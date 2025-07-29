// src/services/brand.service.ts
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
      data,
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
