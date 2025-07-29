"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const response_util_1 = require("@/utils/response.util");
const database_1 = __importDefault(require("@/config/database"));
class AdminController {
    static async dashboard(req, res) {
        try {
            const [totalProducts, activeProducts, lowStockProducts, totalCategories, totalBrands, totalOrders, pendingOrders, recentOrders, recentProducts,] = await Promise.all([
                database_1.default.product.count(),
                database_1.default.product.count({ where: { isActive: true } }),
                database_1.default.product.count({ where: { stockQuantity: { lte: 5 } } }),
                database_1.default.category.count(),
                database_1.default.brand.count(),
                database_1.default.order.count(),
                database_1.default.order.count({ where: { status: 'PENDING' } }),
                database_1.default.order.findMany({
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
                database_1.default.product.findMany({
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
                recent_orders: recentOrders.map((order) => ({
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
                recent_products: recentProducts.map((product) => ({
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price.toString()),
                    stock_quantity: product.stockQuantity,
                    category: product.category?.name || 'N/A',
                    brand: product.brand?.name || 'N/A',
                    created_at: product.createdAt,
                })),
            };
            response_util_1.ResponseUtil.success(res, stats, 'Dashboard data retrieved successfully');
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map