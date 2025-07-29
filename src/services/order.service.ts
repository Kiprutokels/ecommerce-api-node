// src/services/order.service.ts
import prisma from '@/config/database';
import { OrderCreateData, OrderUpdateStatusData } from '@/types/order.types';
import { HelperUtil } from '@/utils/helpers.util';
import { DEFAULT_TAX_RATE, FREE_SHIPPING_THRESHOLD, DEFAULT_SHIPPING_COST, DEFAULT_CURRENCY } from '@/utils/constants';

export class OrderService {
  static async createOrder(userId: string, data: OrderCreateData) {
    return prisma.$transaction(async (tx) => {
      // Validate products and calculate totals
      let subtotal = 0;
      const orderItems = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.product_id },
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            salePrice: true,
            stockQuantity: true,
            manageStock: true,
            inStock: true,
            isActive: true,
            category: { select: { name: true } },
            brand: { select: { name: true } },
            images: true,
          },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }

        if (!product.isActive) {
          throw new Error(`Product ${product.name} is not available`);
        }

        if (!product.inStock) {
          throw new Error(`Product ${product.name} is out of stock`);
        }

        if (product.manageStock && product.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`);
        }

        const currentPrice = product.salePrice || product.price;
        const itemTotal = Number(currentPrice) * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          productDetails: {
            image: product.images?.[0] || null,
            category: product.category?.name || null,
            brand: product.brand?.name || null,
          },
          quantity: item.quantity,
          price: currentPrice,
          total: itemTotal,
        });

        // Update stock if managed
        if (product.manageStock) {
          await tx.product.update({
            where: { id: product.id },
            data: {
              stockQuantity: { decrement: item.quantity },
              salesCount: { increment: item.quantity },
              inStock: product.stockQuantity - item.quantity > 0,
            },
          });
        }
      }

      // Calculate tax and shipping
      const taxAmount = subtotal * DEFAULT_TAX_RATE;
      const shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_COST;
      const discountAmount = 0; // TODO: Implement coupon logic
      const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber: HelperUtil.generateOrderNumber(),
          userId,
          status: 'PENDING',
          subtotal,
          taxRate: DEFAULT_TAX_RATE,
          taxAmount,
          shippingAmount,
          discountAmount,
          totalAmount,
          currency: DEFAULT_CURRENCY,
          paymentStatus: 'PENDING',
          paymentMethod: data.payment_method,
          billingAddress: data.billing_address,
          shippingAddress: data.shipping_address,
          notes: data.notes,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: orderItems.map(item => ({
          ...item,
          orderId: order.id,
        })),
      });

      // Return order with items
      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
        },
      });
    });
  }

  static async getOrderById(orderId: string, userId?: string) {
    const where: any = { id: orderId };
    
    // If userId is provided, ensure user can only access their own orders
    if (userId) {
      where.userId = userId;
    }

    return prisma.order.findUnique({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                category: { select: { name: true } },
                brand: { select: { name: true } },
              },
            },
          },
        },
      },
    });
  }

  static async getUserOrders(userId: string, filters: any, page: number, perPage: number) {
    const where: any = { userId };

    if (filters.status && filters.status !== 'all') {
      where.status = filters.status.toUpperCase();
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  static async getAllOrders(filters: any, page: number, perPage: number) {
    const where: any = {};

    if (filters.status && filters.status !== 'all') {
      where.status = filters.status.toUpperCase();
    }

    if (filters.payment_status && filters.payment_status !== 'all') {
      where.paymentStatus = filters.payment_status.toUpperCase();
    }

    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { email: { contains: filters.search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  static async updateOrderStatus(orderId: string, data: OrderUpdateStatusData) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const updateData: any = {
      status: data.status.toUpperCase(),
      adminNotes: data.admin_notes,
    };

    // Set timestamps based on status
    const now = new Date();
    switch (data.status) {
      case 'confirmed':
        if (order.status === 'PENDING') {
          updateData.confirmedAt = now;
        }
        break;
      case 'shipped':
        if (order.status !== 'SHIPPED') {
          updateData.shippedAt = now;
          if (data.tracking_number) {
            updateData.trackingNumber = data.tracking_number;
          }
        }
        break;
      case 'delivered':
        if (order.status !== 'DELIVERED') {
          updateData.deliveredAt = now;
        }
        break;
      case 'cancelled':
        updateData.cancelledAt = now;
        break;
    }

    return prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  static async cancelOrder(orderId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.userId !== userId) {
        throw new Error('Unauthorized');
      }

      if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
        throw new Error('Order cannot be cancelled');
      }

      // Restore stock quantities
      for (const item of order.items) {
        if (item.product.manageStock) {
          await tx.product.update({
            where: { id: item.product.id },
            data: {
              stockQuantity: { increment: item.quantity },
              salesCount: { decrement: item.quantity },
              inStock: true,
            },
          });
        }
      }

      // Update order status
      return tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
      });
    });
  }
}
