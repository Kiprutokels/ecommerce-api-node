// src/controllers/admin/admin.controller.ts
import { Request, Response } from 'express';
import { ProductService } from '@/services/product.service';
import { OrderService } from '@/services/order.service';
import { ResponseUtil } from '@/utils/response.util';
import prisma from '@/config/database';

export class AdminController {
  static async dashboard(req: Request, res: Response): Promise<void> {
    try {
      const [
        totalProducts,
        activeProducts,
        lowStockProducts,
        totalCategories,
        totalBrands,
        totalOrders,
        pendingOrders,
        recentOrders,
        recentProducts,
      ] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { isActive: true } }),
        prisma.product.count({ where: { stockQuantity: { lte: 5 } } }),
        prisma.category.count(),
        prisma.brand.count(),
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        prisma.product.findMany({
          include: {
            category: { select: { id: true, name: true } },
            brand: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

      const stats = {
        total_products: totalProducts,
        active_products: activeProducts,
        low_stock_products: lowStockProducts,
        total_categories: totalCategories,
        total_brands: totalBrands,
        total_orders: totalOrders,
        pending_orders: pendingOrders,
        recent_orders: recentOrders.map((order: any) => ({
          id: order.id,
          order_number: order.orderNumber,
          status: order.status.toLowerCase(),
          total_amount: parseFloat(order.totalAmount.toString()),
          user: {
            id: order.user.id,
            name: order.user.name,
            email: order.user.email,
          },
          created_at: order.createdAt,
        })),
        recent_products: recentProducts.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price.toString()),
          stock_quantity: product.stockQuantity,
          category: product.category?.name || 'N/A',
          brand: product.brand?.name || 'N/A',
          created_at: product.createdAt,
        })),
      };

      ResponseUtil.success(res, stats, 'Dashboard data retrieved successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }
}
