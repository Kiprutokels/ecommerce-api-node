import prisma from '@/config/database';
import { HelperUtil } from '@/utils/helpers.util';
import { ProductCreateData, ProductUpdateData, ProductFilters } from '@/types/product.types';
import redisClient from '@/config/redis';
import { CACHE_KEYS, CACHE_TTL } from '@/utils/constants';
import { Prisma } from '@prisma/client';

export class ProductService {
  private static handleJsonField(value: any): Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue {
    if (value === null || value === undefined) {
      return Prisma.JsonNull;
    }
    return value as Prisma.InputJsonValue;
  }

  static async getAllProducts(filters: ProductFilters, page: number, perPage: number) {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.category_id) {
      where.categoryId = filters.category_id;
    }

    if (filters.brand_id) {
      where.brandId = filters.brand_id;
    }

    if (filters.status && filters.status !== 'all') {
      where.isActive = filters.status === 'active';
    }

    if (filters.stock_status && filters.stock_status !== 'all') {
      switch (filters.stock_status) {
        case 'in_stock':
          where.inStock = true;
          where.stockQuantity = { gt: 0 };
          break;
        case 'low_stock':
          where.stockQuantity = { lte: 5 };
          break;
        case 'out_of_stock':
          where.OR = [
            { inStock: false },
            { stockQuantity: 0 },
          ];
          break;
      }
    }

    if (filters.min_price || filters.max_price) {
      where.price = {};
      if (filters.min_price) {
        where.price.gte = filters.min_price;
      }
      if (filters.max_price) {
        where.price.lte = filters.max_price;
      }
    }

    if (filters.is_featured !== undefined) {
      where.isFeatured = filters.is_featured;
    }

    // Build orderBy
    const orderBy: any = {};
    if (filters.sort_by) {
      switch (filters.sort_by) {
        case 'created_at':
          orderBy.createdAt = filters.sort_direction || 'desc';
          break;
        case 'price':
          orderBy.price = filters.sort_direction || 'asc';
          break;
        case 'name':
          orderBy.name = filters.sort_direction || 'asc';
          break;
        case 'stock_quantity':
          orderBy.stockQuantity = filters.sort_direction || 'desc';
          break;
        case 'sales_count':
          orderBy.salesCount = filters.sort_direction || 'desc';
          break;
        default:
          orderBy.createdAt = 'desc';
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
        },
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (product) {
      await prisma.product.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return product;
  }

  static async createProduct(data: ProductCreateData) {
    if (!data.slug) {
      data.slug = HelperUtil.generateSlug(data.name);
    }

    if (!data.sku) {
      data.sku = HelperUtil.generateSKU();
    }

    const existingBySlug = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingBySlug) {
      throw new Error('Product with this slug already exists');
    }

    const existingBySku = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existingBySku) {
      throw new Error('Product with this SKU already exists');
    }

    if (data.manage_stock && data.stock_quantity !== undefined && data.stock_quantity <= 0) {
      data.in_stock = false;
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.short_description,
        price: data.price,
        salePrice: data.sale_price,
        costPrice: data.cost_price,
        sku: data.sku,
        barcode: data.barcode,
        stockQuantity: data.stock_quantity || 0,
        lowStockThreshold: data.low_stock_threshold || 5,
        manageStock: data.manage_stock !== false,
        inStock: data.in_stock !== false,
        isActive: data.is_active !== false,
        isFeatured: data.is_featured || false,
        isDigital: data.is_digital || false,
        images: data.images || [],
        gallery: data.gallery || [],
        weight: data.weight,
        dimensions: this.handleJsonField(data.dimensions),
        categoryId: data.category_id,
        brandId: data.brand_id,
        attributes: this.handleJsonField(data.attributes),
        variations: this.handleJsonField(data.variations),
        metaTitle: data.meta_title,
        metaDescription: data.meta_description,
        seoKeywords: data.seo_keywords || [],
      },
      include: {
        category: true,
        brand: true,
      },
    });

    if (product.isFeatured) {
      try {
        await redisClient.del(CACHE_KEYS.FEATURED_PRODUCTS);
      } catch (error) {
        console.warn('Cache clear error:', error);
      }
    }

    return product;
  }

  static async updateProduct(id: string, data: ProductUpdateData) {
    if (data.name && !data.slug) {
      data.slug = HelperUtil.generateSlug(data.name);
    }

    if (data.slug) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      });

      if (existingProduct) {
        throw new Error('Product with this slug already exists');
      }
    }

    if (data.sku) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          sku: data.sku,
          NOT: { id },
        },
      });

      if (existingProduct) {
        throw new Error('Product with this SKU already exists');
      }
    }

    if (data.manage_stock && data.stock_quantity !== undefined && data.stock_quantity <= 0) {
      data.in_stock = false;
    }

    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.short_description !== undefined) updateData.shortDescription = data.short_description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.sale_price !== undefined) updateData.salePrice = data.sale_price;
    if (data.cost_price !== undefined) updateData.costPrice = data.cost_price;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.barcode !== undefined) updateData.barcode = data.barcode;
    if (data.stock_quantity !== undefined) updateData.stockQuantity = data.stock_quantity;
    if (data.low_stock_threshold !== undefined) updateData.lowStockThreshold = data.low_stock_threshold;
    if (data.manage_stock !== undefined) updateData.manageStock = data.manage_stock;
    if (data.in_stock !== undefined) updateData.inStock = data.in_stock;
    if (data.is_active !== undefined) updateData.isActive = data.is_active;
    if (data.is_featured !== undefined) updateData.isFeatured = data.is_featured;
    if (data.is_digital !== undefined) updateData.isDigital = data.is_digital;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.gallery !== undefined) updateData.gallery = data.gallery;
    if (data.weight !== undefined) updateData.weight = data.weight;
    if (data.dimensions !== undefined) updateData.dimensions = this.handleJsonField(data.dimensions);
    if (data.category_id !== undefined) updateData.categoryId = data.category_id;
    if (data.brand_id !== undefined) updateData.brandId = data.brand_id;
    if (data.attributes !== undefined) updateData.attributes = this.handleJsonField(data.attributes);
    if (data.variations !== undefined) updateData.variations = this.handleJsonField(data.variations);
    if (data.meta_title !== undefined) updateData.metaTitle = data.meta_title;
    if (data.meta_description !== undefined) updateData.metaDescription = data.meta_description;
    if (data.seo_keywords !== undefined) updateData.seoKeywords = data.seo_keywords;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        brand: true,
      },
    });

    try {
      await Promise.all([
        redisClient.del(CACHE_KEYS.PRODUCT(id)),
        redisClient.del(CACHE_KEYS.FEATURED_PRODUCTS),
      ]);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }

    return product;
  }

  static async deleteProduct(id: string) {
    const orderItemCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemCount > 0) {
      throw new Error('Cannot delete product with existing orders');
    }

    await prisma.product.delete({
      where: { id },
    });

    try {
      await Promise.all([
        redisClient.del(CACHE_KEYS.PRODUCT(id)),
        redisClient.del(CACHE_KEYS.FEATURED_PRODUCTS),
      ]);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }

  static async getFeaturedProducts(limit: number = 8) {
    try {
      const cached = await redisClient.get(CACHE_KEYS.FEATURED_PRODUCTS);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Cache get error:', error);
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        category: true,
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    try {
      await redisClient.set(
        CACHE_KEYS.FEATURED_PRODUCTS,
        JSON.stringify(products),
        CACHE_TTL.MEDIUM
      );
    } catch (error) {
      console.warn('Cache set error:', error);
    }

    return products;
  }

  static async bulkUpdateProducts(productIds: string[], action: string, data?: any) {
    const updateData: any = {};

    switch (action) {
      case 'activate':
        updateData.isActive = true;
        break;
      case 'deactivate':
        updateData.isActive = false;
        break;
      case 'feature':
        updateData.isFeatured = true;
        break;
      case 'unfeature':
        updateData.isFeatured = false;
        break;
      case 'delete':
        const hasOrders = await prisma.orderItem.findFirst({
          where: { productId: { in: productIds } },
        });

        if (hasOrders) {
          throw new Error('Some products have existing orders and cannot be deleted');
        }

        await prisma.product.deleteMany({
          where: { id: { in: productIds } },
        });

        try {
          await Promise.all([
            redisClient.del(CACHE_KEYS.FEATURED_PRODUCTS),
            ...productIds.map(id => redisClient.del(CACHE_KEYS.PRODUCT(id))),
          ]);
        } catch (error) {
          console.warn('Cache clear error:', error);
        }

        return;
      default:
        throw new Error('Invalid action');
    }

    if (data?.category_id) {
      updateData.categoryId = data.category_id;
    }
    if (data?.brand_id) {
      updateData.brandId = data.brand_id;
    }

    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: updateData,
    });

    try {
      await Promise.all([
        redisClient.del(CACHE_KEYS.FEATURED_PRODUCTS),
        ...productIds.map(id => redisClient.del(CACHE_KEYS.PRODUCT(id))),
      ]);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }

  static async duplicateProduct(id: string) {
    const originalProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
      },
    });

    if (!originalProduct) {
      throw new Error('Product not found');
    }

    const newProduct = await prisma.product.create({
      data: {
        name: `${originalProduct.name} (Copy)`,
        slug: `${originalProduct.slug}-copy-${Date.now()}`,
        description: originalProduct.description,
        shortDescription: originalProduct.shortDescription,
        price: originalProduct.price,
        salePrice: originalProduct.salePrice,
        costPrice: originalProduct.costPrice,
        sku: `${originalProduct.sku}-COPY-${Date.now()}`,
        barcode: originalProduct.barcode,
        stockQuantity: originalProduct.stockQuantity,
        lowStockThreshold: originalProduct.lowStockThreshold,
        manageStock: originalProduct.manageStock,
        inStock: originalProduct.inStock,
        isActive: false,
        isFeatured: originalProduct.isFeatured,
        isDigital: originalProduct.isDigital,
        images: originalProduct.images,
        gallery: originalProduct.gallery,
        weight: originalProduct.weight,
        dimensions: this.handleJsonField(originalProduct.dimensions),
        status: originalProduct.status,
        categoryId: originalProduct.categoryId,
        brandId: originalProduct.brandId,
        attributes: this.handleJsonField(originalProduct.attributes),
        variations: this.handleJsonField(originalProduct.variations),
        metaTitle: originalProduct.metaTitle,
        metaDescription: originalProduct.metaDescription,
        seoKeywords: originalProduct.seoKeywords,
      },
      include: {
        category: true,
        brand: true,
      },
    });

    return newProduct;
  }

  static async getProductStats() {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      featuredProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue,
      averagePrice,
      topCategories,
      recentProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: false } }),
      prisma.product.count({ where: { isFeatured: true } }),
      prisma.product.count({ where: { stockQuantity: { lte: 5 } } }),
      prisma.product.count({ where: { inStock: false } }),
      prisma.product.aggregate({
        where: { isActive: true },
        _sum: { price: true },
      }),
      prisma.product.aggregate({
        where: { isActive: true },
        _avg: { price: true },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { products: true } },
        },
        orderBy: {
          products: { _count: 'desc' },
        },
        take: 5,
      }),
      prisma.product.findMany({
        include: {
          category: { select: { name: true } },
          brand: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      total_products: totalProducts,
      active_products: activeProducts,
      inactive_products: inactiveProducts,
      featured_products: featuredProducts,
      low_stock_products: lowStockProducts,
      out_of_stock_products: outOfStockProducts,
      total_value: totalValue._sum.price || 0,
      average_price: averagePrice._avg.price || 0,
      top_categories: topCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        products_count: cat._count.products,
      })),
      recent_products: recentProducts.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category?.name || 'N/A',
        brand: product.brand?.name || 'N/A',
        created_at: product.createdAt,
      })),
    };
  }
}
