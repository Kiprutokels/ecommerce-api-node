"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQuerySchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const addressSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255),
    email: zod_1.z.string().email('Valid email is required'),
    phone: zod_1.z.string().min(1, 'Phone is required').max(50),
    address_line_1: zod_1.z.string().min(1, 'Address line 1 is required').max(255),
    address_line_2: zod_1.z.string().max(255).optional(),
    city: zod_1.z.string().min(1, 'City is required').max(100),
    state: zod_1.z.string().min(1, 'State is required').max(100),
    postal_code: zod_1.z.string().min(1, 'Postal code is required').max(20),
    country: zod_1.z.string().min(1, 'Country is required').max(100),
});
exports.createOrderSchema = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        product_id: zod_1.z.string().cuid('Invalid product ID'),
        quantity: zod_1.z.number().int().positive('Quantity must be positive'),
        price: zod_1.z.number().positive('Price must be positive'),
    })).min(1, 'At least one item is required'),
    billing_address: addressSchema,
    shipping_address: addressSchema,
    payment_method: zod_1.z.enum(['card', 'paypal', 'bank_transfer']),
    notes: zod_1.z.string().max(1000).optional(),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
    tracking_number: zod_1.z.string().max(255).optional(),
    admin_notes: zod_1.z.string().max(1000).optional(),
});
exports.orderQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'all']).optional(),
    payment_status: zod_1.z.enum(['pending', 'paid', 'failed', 'refunded', 'partially_refunded', 'all']).optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.string().transform(val => parseInt(val) || 1).optional(),
    per_page: zod_1.z.string().transform(val => parseInt(val) || 15).optional(),
});
//# sourceMappingURL=order.validator.js.map