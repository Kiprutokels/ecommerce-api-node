"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const database_1 = __importDefault(require("@/config/database"));
const helpers_util_1 = require("@/utils/helpers.util");
const constants_1 = require("@/utils/constants");
class OrderService {
    static async createOrder(userId, data) {
        return database_1.default.$transaction(async (tx) => {
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
            const taxAmount = subtotal * constants_1.DEFAULT_TAX_RATE;
            const shippingAmount = subtotal >= constants_1.FREE_SHIPPING_THRESHOLD ? 0 : constants_1.DEFAULT_SHIPPING_COST;
            const discountAmount = 0;
            const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;
            const order = await tx.order.create({
                data: {
                    orderNumber: helpers_util_1.HelperUtil.generateOrderNumber(),
                    userId,
                    status: 'PENDING',
                    subtotal,
                    taxRate: constants_1.DEFAULT_TAX_RATE,
                    taxAmount,
                    shippingAmount,
                    discountAmount,
                    totalAmount,
                    currency: constants_1.DEFAULT_CURRENCY,
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
            await tx.orderItem.createMany({
                data: orderItems.map(item => ({
                    ...item,
                    orderId: order.id,
                })),
            });
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
    static async getOrderById(orderId, userId) {
        const where = { id: orderId };
        if (userId) {
            where.userId = userId;
        }
        return database_1.default.order.findUnique({
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
    static async getUserOrders(userId, filters, page, perPage) {
        const where = { userId };
        if (filters.status && filters.status !== 'all') {
            where.status = filters.status.toUpperCase();
        }
        const [orders, total] = await Promise.all([
            database_1.default.order.findMany({
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
            database_1.default.order.count({ where }),
        ]);
        return { orders, total };
    }
    static async getAllOrders(filters, page, perPage) {
        const where = {};
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
            database_1.default.order.findMany({
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
            database_1.default.order.count({ where }),
        ]);
        return { orders, total };
    }
    static async updateOrderStatus(orderId, data) {
        const order = await database_1.default.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new Error('Order not found');
        }
        const updateData = {
            status: data.status.toUpperCase(),
            adminNotes: data.admin_notes,
        };
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
        return database_1.default.order.update({
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
    static async cancelOrder(orderId, userId) {
        return database_1.default.$transaction(async (tx) => {
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
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map