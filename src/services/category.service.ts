// src/services/category.service.ts
import prisma from '@/config/database';
import { HelperUtil } from '@/utils/helpers.util';
import redisClient from '@/config/redis';
import { CACHE_KEYS, CACHE_TTL } from '@/utils/constants';

export class CategoryService {
  static async getAllCategories(filters: any = {}) {
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

    if (filters.featured) {
      where.isFeatured = true;
    }

    return prisma.category.findMany({
      where,
      include: {
        parent: true,
        children: true,
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

  static async getCategoriesWithPagination(filters: any, page: number, perPage: number) {
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

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          parent: true,
          children: true,
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
      prisma.category.count({ where }),
    ]);

    return { categories, total };
  }

  static async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });
  }

  static async createCategory(data: any) {
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = HelperUtil.generateSlug(data.name);
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingCategory) {
      throw new Error('Category with this slug already exists');
    }

    const category = await prisma.category.create({
      data,
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });

    // Clear cache
    try {
      await redisClient.del(CACHE_KEYS.CATEGORIES);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }

    return category;
  }

  static async updateCategory(id: string, data: any) {
    // Generate slug if name is being updated and slug is not provided
    if (data.name && !data.slug) {
      data.slug = HelperUtil.generateSlug(data.name);
    }

    // Check if slug already exists (excluding current category)
    if (data.slug) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      });

      if (existingCategory) {
        throw new Error('Category with this slug already exists');
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });

    // Clear cache
    try {
      await redisClient.del(CACHE_KEYS.CATEGORIES);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }

    return category;
  }

  static async deleteCategory(id: string) {
    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new Error('Cannot delete category with products');
    }

    // Check if category has children
    const childrenCount = await prisma.category.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new Error('Cannot delete category with subcategories');
    }

    await prisma.category.delete({
      where: { id },
    });

    // Clear cache
    try {
      await redisClient.del(CACHE_KEYS.CATEGORIES);
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }

  static async getActiveCategories() {
    try {
      // Try to get from cache first
      const cached = await redisClient.get(CACHE_KEYS.CATEGORIES);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Cache get error:', error);
    }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
        },
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
        CACHE_KEYS.CATEGORIES,
        JSON.stringify(categories),
        CACHE_TTL.LONG
      );
    } catch (error) {
      console.warn('Cache set error:', error);
    }

    return categories;
  }
}
