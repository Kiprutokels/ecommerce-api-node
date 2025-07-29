"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicOrderController = void 0;
const order_service_1 = require("@/services/order.service");
const response_util_1 = require("@/utils/response.util");
const helpers_util_1 = require("@/utils/helpers.util");
class PublicOrderController {
    static async index(req, res) {
        try {
            if (!req.user) {
                response_util_1.ResponseUtil.error(res, 'Authentication required', 401);
                return;
            }
            const { page, perPage } = helpers_util_1.HelperUtil.getPaginationParams(req.query);
            const filters = {
                status: req.query.status,
            };
            const { orders, total } = await order_service_1.OrderService.getUserOrders(req.user.id, filters, page, perPage);
            const formattedOrders = orders.map((order) => ({
                id: order.id,
                order_number: order.orderNumber,
                status: order.status.toLowerCase(),
                subtotal: parseFloat(order.subtotal.toString()),
                tax_amount: parseFloat(order.taxAmount.toString()),
                shipping_amount: parseFloat(order.shippingAmount.toString()),
                discount_amount: parseFloat(order.discountAmount.toString()),
                total_amount: parseFloat(order.totalAmount.toString()),
                currency: order.currency,
                payment_status: order.paymentStatus.toLowerCase(),
                payment_method: order.paymentMethod,
                billing_address: order.billingAddress,
                shipping_address: order.shippingAddress,
                tracking_number: order.trackingNumber,
                notes: order.notes,
                confirmed_at: order.confirmedAt,
                shipped_at: order.shippedAt,
                delivered_at: order.deliveredAt,
                cancelled_at: order.cancelledAt,
                total_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
                items: order.items.map((item) => ({
                    id: item.id,
                    product_id: item.productId,
                    product_name: item.productName,
                    product_sku: item.productSku,
                    product_details: item.productDetails,
                    quantity: item.quantity,
                    price: parseFloat(item.price.toString()),
                    total: parseFloat(item.total.toString()),
                    product: item.product ? {
                        id: item.product.id,
                        name: item.product.name,
                        slug: item.product.slug,
                        images: item.product.images,
                    } : null,
                })),
                created_at: order.createdAt,
                updated_at: order.updatedAt,
            }));
            response_util_1.ResponseUtil.paginated(res, formattedOrders, total, page, perPage);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
    static async store(req, res) {
        try {
            if (!req.user) {
                response_util_1.ResponseUtil.error(res, 'Authentication required', 401);
                return;
            }
            const order = await order_service_1.OrderService.createOrder(req.user.id, req.body);
            const formattedOrder = {
                id: order.id,
                order_number: order.orderNumber,
                status: order.status.toLowerCase(),
                subtotal: parseFloat(order.subtotal.toString()),
                tax_rate: parseFloat(order.taxRate.toString()),
                tax_amount: parseFloat(order.taxAmount.toString()),
                shipping_amount: parseFloat(order.shippingAmount.toString()),
                discount_amount: parseFloat(order.discountAmount.toString()),
                total_amount: parseFloat(order.totalAmount.toString()),
                currency: order.currency,
                payment_status: order.paymentStatus.toLowerCase(),
                payment_method: order.paymentMethod,
                billing_address: order.billingAddress,
                shipping_address: order.shippingAddress,
                notes: order.notes,
                user: {
                    id: order.user.id,
                    name: order.user.name,
                    email: order.user.email,
                    phone: order.user.phone,
                },
                items: order.items.map((item) => ({
                    id: item.id,
                    product_id: item.productId,
                    product_name: item.productName,
                    product_sku: item.productSku,
                    product_details: item.productDetails,
                    quantity: item.quantity,
                    price: parseFloat(item.price.toString()),
                    total: parseFloat(item.total.toString()),
                    product: item.product ? {
                        id: item.product.id,
                        name: item.product.name,
                        slug: item.product.slug,
                        images: item.product.images,
                    } : null,
                })),
                created_at: order.createdAt,
                updated_at: order.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedOrder, 'Order created successfully', 201);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 400);
        }
    }
    static async show(req, res) {
        try {
            if (!req.user) {
                response_util_1.ResponseUtil.error(res, 'Authentication required', 401);
                return;
            }
            const order = await order_service_1.OrderService.getOrderById(req.params.id, req.user?.isAdmin ? undefined : req.user.id);
            if (!order) {
                response_util_1.ResponseUtil.error(res, 'Order not found', 404);
                return;
            }
            const formattedOrder = {
                id: order.id,
                order_number: order.orderNumber,
                status: order.status.toLowerCase(),
                subtotal: parseFloat(order.subtotal.toString()),
                tax_rate: parseFloat(order.taxRate.toString()),
                tax_amount: parseFloat(order.taxAmount.toString()),
                shipping_amount: parseFloat(order.shippingAmount.toString()),
                discount_amount: parseFloat(order.discountAmount.toString()),
                total_amount: parseFloat(order.totalAmount.toString()),
                currency: order.currency,
                payment_status: order.paymentStatus.toLowerCase(),
                payment_method: order.paymentMethod,
                billing_address: order.billingAddress,
                shipping_address: order.shippingAddress,
                shipping_method: order.shippingMethod,
                tracking_number: order.trackingNumber,
                notes: order.notes,
                admin_notes: order.adminNotes,
                confirmed_at: order.confirmedAt,
                shipped_at: order.shippedAt,
                delivered_at: order.deliveredAt,
                cancelled_at: order.cancelledAt,
                user: {
                    id: order.user.id,
                    name: order.user.name,
                    email: order.user.email,
                    phone: order.user.phone,
                },
                items: order.items.map((item) => ({
                    id: item.id,
                    product_id: item.productId,
                    product_name: item.productName,
                    product_sku: item.productSku,
                    product_details: item.productDetails,
                    quantity: item.quantity,
                    price: parseFloat(item.price.toString()),
                    total: parseFloat(item.total.toString()),
                    product: item.product ? {
                        id: item.product.id,
                        name: item.product.name,
                        slug: item.product.slug,
                        images: item.product.images,
                        category: item.product.category,
                        brand: item.product.brand,
                    } : null,
                })),
                created_at: order.createdAt,
                updated_at: order.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedOrder);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
    static async cancel(req, res) {
        try {
            if (!req.user) {
                response_util_1.ResponseUtil.error(res, 'Authentication required', 401);
                return;
            }
            const order = await order_service_1.OrderService.cancelOrder(req.params.id, req.user.id);
            const formattedOrder = {
                id: order.id,
                order_number: order.orderNumber,
                status: order.status.toLowerCase(),
                cancelled_at: order.cancelledAt,
                total_amount: parseFloat(order.totalAmount.toString()),
                items: order.items.map((item) => ({
                    id: item.id,
                    product_name: item.productName,
                    quantity: item.quantity,
                    price: parseFloat(item.price.toString()),
                    total: parseFloat(item.total.toString()),
                })),
                created_at: order.createdAt,
                updated_at: order.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedOrder, 'Order cancelled successfully');
        }
        catch (error) {
            const statusCode = error.message.includes('Unauthorized') ? 403 : 400;
            response_util_1.ResponseUtil.error(res, error.message, statusCode);
        }
    }
}
exports.PublicOrderController = PublicOrderController;
//# sourceMappingURL=order.controller.js.map