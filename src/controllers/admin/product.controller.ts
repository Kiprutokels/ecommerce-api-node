import { Request, Response } from 'express';
import { ProductService } from '@/services/product.service';
import { ResponseUtil } from '@/utils/response.util';
import { HelperUtil } from '@/utils/helpers.util';
import { ProductFilters } from '@/types/product.types';

export class AdminProductController {
  static async index(req: Request, res: Response): Promise<void> {
    try {
      const { page, perPage } = HelperUtil.getPaginationParams(req.query);
      
      const filters: ProductFilters = {};

      if (req.query.search) {
        filters.search = req.query.search as string;
      }

      if (req.query.category_id) {
        filters.category_id = req.query.category_id as string;
      }

      if (req.query.brand_id) {
        filters.brand_id = req.query.brand_id as string;
      }

      if (req.query.status) {
        filters.status = req.query.status as 'active' | 'inactive' | 'all';
      }

      if (req.query.stock_status) {
        filters.stock_status = req.query.stock_status as 'in_stock' | 'low_stock' | 'out_of_stock';
      }

      if (req.query.sort_by) {
        filters.sort_by = req.query.sort_by as string;
      }

      if (req.query.sort_direction) {
        filters.sort_direction = req.query.sort_direction as 'asc' | 'desc';
      }

      const { products, total } = await ProductService.getAllProducts(filters, page, perPage);

      const formattedProducts = products.map((product: any) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        short_description: product.shortDescription,
        price: parseFloat(product.price.toString()),
        sale_price: product.salePrice ? parseFloat(product.salePrice.toString()) : null,
        cost_price: product.costPrice ? parseFloat(product.costPrice.toString()) : null,
        current_price: HelperUtil.calculateDiscountedPrice(
          parseFloat(product.price.toString()),
          product.salePrice ? parseFloat(product.salePrice.toString()) : undefined
        ),
        is_on_sale: HelperUtil.isOnSale(
          parseFloat(product.price.toString()),
          product.salePrice ? parseFloat(product.salePrice.toString()) : undefined
        ),
        sku: product.sku,
        barcode: product.barcode,
        stock_quantity: product.stockQuantity,
        low_stock_threshold: product.lowStockThreshold,
        manage_stock: product.manageStock,
        in_stock: product.inStock,
        is_active: product.isActive,
        is_featured: product.isFeatured,
        is_digital: product.isDigital,
        images: product.images || [],
        gallery: product.gallery || [],
        main_image: product.images?.[0] || null,
        weight: product.weight ? parseFloat(product.weight.toString()) : null,
        dimensions: product.dimensions,
        status: product.status,
        attributes: product.attributes,
        variations: product.variations,
        average_rating: parseFloat(product.averageRating.toString()),
        review_count: product.reviewCount,
        view_count: product.viewCount,
        sales_count: product.salesCount,
        meta_title: product.metaTitle,
        meta_description: product.metaDescription,
        seo_keywords: product.seoKeywords || [],
        category_id: product.categoryId,
        brand_id: product.brandId,
        category: product.category ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        } : null,
        brand: product.brand ? {
          id: product.brand.id,
          name: product.brand.name,
          slug: product.brand.slug,
          logo: product.brand.logo,
        } : null,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      }));

      ResponseUtil.paginated(res, formattedProducts, total, page, perPage);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async store(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.createProduct(req.body);

      const formattedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        short_description: product.shortDescription,
        price: parseFloat(product.price.toString()),
        sale_price: product.salePrice ? parseFloat(product.salePrice.toString()) : null,
        cost_price: product.costPrice ? parseFloat(product.costPrice.toString()) : null,
        sku: product.sku,
        barcode: product.barcode,
        stock_quantity: product.stockQuantity,
        low_stock_threshold: product.lowStockThreshold,
        manage_stock: product.manageStock,
        in_stock: product.inStock,
        is_active: product.isActive,
        is_featured: product.isFeatured,
        is_digital: product.isDigital,
        images: product.images || [],
        gallery: product.gallery || [],
        weight: product.weight ? parseFloat(product.weight.toString()) : null,
        dimensions: product.dimensions,
        status: product.status,
        attributes: product.attributes,
        variations: product.variations,
        meta_title: product.metaTitle,
        meta_description: product.metaDescription,
        seo_keywords: product.seoKeywords || [],
        category_id: product.categoryId,
        brand_id: product.brandId,
        category: product.category ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        } : null,
        brand: product.brand ? {
          id: product.brand.id,
          name: product.brand.name,
          slug: product.brand.slug,
          logo: product.brand.logo,
        } : null,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      };

      ResponseUtil.success(res, formattedProduct, 'Product created successfully', 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 400);
    }
  }

  static async show(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.getProductById(req.params.id);

      if (!product) {
        ResponseUtil.error(res, 'Product not found', 404);
        return;
      }

      const formattedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        short_description: product.shortDescription,
        price: parseFloat(product.price.toString()),
        sale_price: product.salePrice ? parseFloat(product.salePrice.toString()) : null,
        cost_price: product.costPrice ? parseFloat(product.costPrice.toString()) : null,
        sku: product.sku,
        barcode: product.barcode,
        stock_quantity: product.stockQuantity,
        low_stock_threshold: product.lowStockThreshold,
        manage_stock: product.manageStock,
        in_stock: product.inStock,
        is_active: product.isActive,
        is_featured: product.isFeatured,
        is_digital: product.isDigital,
        images: product.images || [],
        gallery: product.gallery || [],
        weight: product.weight ? parseFloat(product.weight.toString()) : null,
        dimensions: product.dimensions,
        status: product.status,
        attributes: product.attributes,
        variations: product.variations,
        average_rating: parseFloat(product.averageRating.toString()),
        review_count: product.reviewCount,
        view_count: product.viewCount,
        sales_count: product.salesCount,
        meta_title: product.metaTitle,
        meta_description: product.metaDescription,
        seo_keywords: product.seoKeywords || [],
        category_id: product.categoryId,
        brand_id: product.brandId,
        category: product.category ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        } : null,
        brand: product.brand ? {
          id: product.brand.id,
          name: product.brand.name,
          slug: product.brand.slug,
          logo: product.brand.logo,
        } : null,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      };

      ResponseUtil.success(res, formattedProduct);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);

      const formattedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        short_description: product.shortDescription,
        price: parseFloat(product.price.toString()),
        sale_price: product.salePrice ? parseFloat(product.salePrice.toString()) : null,
        cost_price: product.costPrice ? parseFloat(product.costPrice.toString()) : null,
        sku: product.sku,
        barcode: product.barcode,
        stock_quantity: product.stockQuantity,
        low_stock_threshold: product.lowStockThreshold,
        manage_stock: product.manageStock,
        in_stock: product.inStock,
        is_active: product.isActive,
        is_featured: product.isFeatured,
        is_digital: product.isDigital,
        images: product.images || [],
        gallery: product.gallery || [],
        weight: product.weight ? parseFloat(product.weight.toString()) : null,
        dimensions: product.dimensions,
        status: product.status,
        attributes: product.attributes,
        variations: product.variations,
        meta_title: product.metaTitle,
        meta_description: product.metaDescription,
        seo_keywords: product.seoKeywords || [],
        category_id: product.categoryId,
        brand_id: product.brandId,
        category: product.category ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        } : null,
        brand: product.brand ? {
          id: product.brand.id,
          name: product.brand.name,
          slug: product.brand.slug,
          logo: product.brand.logo,
        } : null,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      };

      ResponseUtil.success(res, formattedProduct, 'Product updated successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 400);
    }
  }

  static async destroy(req: Request, res: Response): Promise<void> {
    try {
      await ProductService.deleteProduct(req.params.id);
      ResponseUtil.success(res, null, 'Product deleted successfully');
    } catch (error: any) {
      const statusCode = error.message.includes('Cannot delete') ? 422 : 500;
      ResponseUtil.error(res, error.message, statusCode);
    }
  }

  static async bulkUpdate(req: Request, res: Response): Promise<void> {
    try {
      await ProductService.bulkUpdateProducts(
        req.body.product_ids,
        req.body.action,
        req.body
      );

      ResponseUtil.success(res, null, `Products ${req.body.action}d successfully`);
    } catch (error: any) {
      const statusCode = error.message.includes('cannot be deleted') ? 422 : 500;
      ResponseUtil.error(res, error.message, statusCode);
    }
  }

  static async duplicate(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.duplicateProduct(req.params.id);

      const formattedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        price: parseFloat(product.price.toString()),
        is_active: product.isActive,
        category: product.category ? {
          id: product.category.id,
          name: product.category.name,
        } : null,
        brand: product.brand ? {
          id: product.brand.id,
          name: product.brand.name,
        } : null,
        created_at: product.createdAt,
      };

      ResponseUtil.success(res, formattedProduct, 'Product duplicated successfully', 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 400);
    }
  }

  static async stats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await ProductService.getProductStats();
      ResponseUtil.success(res, stats, 'Product stats retrieved successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async export(req: Request, res: Response): Promise<void> {
    try {
      const filters: ProductFilters = {};

      if (req.query.category_id) {
        filters.category_id = req.query.category_id as string;
      }

      if (req.query.brand_id) {
        filters.brand_id = req.query.brand_id as string;
      }

      const { products } = await ProductService.getAllProducts(filters, 1, 10000);

      const exportData = products.map((product: any) => ({
        ID: product.id,
        Name: product.name,
        SKU: product.sku,
        Price: parseFloat(product.price.toString()),
        'Sale Price': product.salePrice ? parseFloat(product.salePrice.toString()) : '',
        Stock: product.stockQuantity,
        Category: product.category?.name || '',
        Brand: product.brand?.name || '',
        Status: product.isActive ? 'Active' : 'Inactive',
        Created: product.createdAt.toISOString().split('T')[0],
      }));

      const exportResult = {
        filename: `products-export-${new Date().toISOString().split('T')[0]}.csv`,
        data: exportData,
        count: exportData.length,
      };

      ResponseUtil.success(res, exportResult, 'Products exported successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async toggleStatus(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) {
        ResponseUtil.error(res, 'Product not found', 404);
        return;
      }

      const updatedProduct = await ProductService.updateProduct(req.params.id, {
        is_active: !product.isActive
      });

      ResponseUtil.success(res, {
        id: updatedProduct.id,
        is_active: updatedProduct.isActive
      }, 'Product status updated successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async toggleFeatured(req: Request, res: Response): Promise<void> {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) {
        ResponseUtil.error(res, 'Product not found', 404);
        return;
      }

      const updatedProduct = await ProductService.updateProduct(req.params.id, {
        is_featured: !product.isFeatured
      });

      ResponseUtil.success(res, {
        id: updatedProduct.id,
        is_featured: updatedProduct.isFeatured
      }, 'Product featured status updated successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }
}
