import prisma from '@/config/database';
import { CACHE_KEYS, CACHE_TTL } from '@/utils/constants';
import redisClient from '@/config/redis';

export class FlashSaleService {
  static async getActiveFlashSales() {
    try {
      const cached = await redisClient.get(CACHE_KEYS.ACTIVE_FLASH_SALES);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Cache get error:', error);
    }

    const now = new Date();
    const flashSales = await prisma.flashSale.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        products: {
          where: { isActive: true },
          include: {
            product: {
              include: {
                category: true,
                brand: true,
              },
            },
          },
          take: 10,
        },
      },
      orderBy: { priority: 'desc' },
    });

    try {
      await redisClient.set(
        CACHE_KEYS.ACTIVE_FLASH_SALES,
        JSON.stringify(flashSales),
        CACHE_TTL.SHORT
      );
    } catch (error) {
      console.warn('Cache set error:', error);
    }

    return flashSales;
  }

  static async getFlashSaleById(id: string) {
    const flashSale = await prisma.flashSale.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          include: {
            product: {
              include: {
                category: true,
                brand: true,
              },
            },
          },
        },
      },
    });

    return flashSale;
  }

  static async getFlashSaleProducts(flashSaleId: string, page: number = 1, perPage: number = 20) {
    const [products, total] = await Promise.all([
      prisma.flashSaleProduct.findMany({
        where: {
          flashSaleId,
          isActive: true,
          flashSale: {
            isActive: true,
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
        },
        include: {
          product: {
            include: {
              category: true,
              brand: true,
            },
          },
          flashSale: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.flashSaleProduct.count({
        where: {
          flashSaleId,
          isActive: true,
          flashSale: {
            isActive: true,
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
        },
      }),
    ]);

    return { products, total };
  }
}
