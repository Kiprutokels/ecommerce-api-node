import prisma from '@/config/database';
import { HelperUtil } from '@/utils/helpers.util';
import redisClient from '@/config/redis';
import { CACHE_KEYS, CACHE_TTL } from '@/utils/constants';

export class BrandService {
  static async getAllBrands(filters: any = {}) {
    const where: any = {};

    if (filters.search) {
      where.name = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    if (filters.status && filters.status !== 'all') {
      where.isActive = filters.status === 'active';
    }

    return prisma.brand.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  static async getBrandsWithPagination(filters: any, page: number, perPage: number) {
    const where: any = {};

    if (filters.search) {
      where.name = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    if (filters.status && filters.status !== 'all') {
      where.isActive = filters.status === 'active';
    }

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: [
          { sortOrder: 'asc' },
          { name: 'asc' },
        ],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.brand.count({ where }),
    ]);

    return { brands, total };
  }

  static async getBrandById(id: string) {
    return prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  static async createBrand(data: any) {
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = HelperUtil.generateSlug(data.name);
    }

    // Check if slug already exists
    const existingBrand = await prisma.brand.findUnique({
      where: { slug: data.slug },
    });

    if (existingBrand) {
      throw new Error('Brand with this slug already exists');
    }

    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        logo: data.logo || null,
        website: data.website || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        sortOrder: data.sortOrder || 0,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    // Clear cache
    try {
      await redisClient.del(CACHE_KEYS.BRANDS);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }

    return brand;
  }

  static async updateBrand(id: string, data: any) {
    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      throw new Error('Brand not found');
    }

    // Check if slug already exists (excluding current brand)
    if (data.slug) {
      const slugExists = await prisma.brand.findFirst({
        where: {
          slug: data.slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        throw new Error('Brand with this slug already exists');
      }
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        logo: data.logo || null,
        website: data.website || null,
        isActive: data.isActive !== undefined ? data.isActive : existingBrand.isActive,
        sortOrder: data.sortOrder !== undefined ? data.sortOrder : existingBrand.sortOrder,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    // Clear cache
    try {
      await redisClient.del(CACHE_KEYS.BRANDS);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }

    return brand;
  }

  static async deleteBrand(id: string) {
    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!existingBrand) {
      throw new Error('Brand not found');
    }

    // Check if brand has associated products
    if (existingBrand._count.products > 0) {
      throw new Error('Cannot delete brand that has products associated with it. Please remove or reassign the products first.');
    }

    await prisma.brand.delete({
      where: { id },
    });

    // Clear cache
    try {
      await redisClient.del(CACHE_KEYS.BRANDS);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }

    return true;
  }

  static async getActiveBrands() {
    try {
      // Try to get from cache first
      const cached = await redisClient.get(CACHE_KEYS.BRANDS);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Cache get error:', error);
    }

    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    // Cache the result
    try {
      await redisClient.set(
        CACHE_KEYS.BRANDS,
        JSON.stringify(brands),
        CACHE_TTL.LONG
      );
    } catch (error) {
      console.warn('Cache set error:', error);
    }

    return brands;
  }
}
