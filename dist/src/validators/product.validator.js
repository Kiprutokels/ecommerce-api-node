"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpdateProductsSchema = exports.productQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255),
    slug: zod_1.z.string().max(255).optional(),
    description: zod_1.z.string().min(1, 'Description is required'),
    short_description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive('Price must be positive'),
    sale_price: zod_1.z.number().positive().optional(),
    cost_price: zod_1.z.number().positive().optional(),
    sku: zod_1.z.string().max(255).optional(),
    barcode: zod_1.z.string().max(255).optional(),
    stock_quantity: zod_1.z.number().int().min(0).optional(),
    low_stock_threshold: zod_1.z.number().int().min(0).optional(),
    manage_stock: zod_1.z.boolean().optional(),
    in_stock: zod_1.z.boolean().optional(),
    is_active: zod_1.z.boolean().optional(),
    is_featured: zod_1.z.boolean().optional(),
    is_digital: zod_1.z.boolean().optional(),
    images: zod_1.z.array(zod_1.z.string().url()).optional(),
    gallery: zod_1.z.array(zod_1.z.string().url()).optional(),
    weight: zod_1.z.number().positive().optional(),
    dimensions: zod_1.z.record(zod_1.z.any()).optional(),
    category_id: zod_1.z.string().cuid('Invalid category ID'),
    brand_id: zod_1.z.string().cuid().optional(),
    attributes: zod_1.z.record(zod_1.z.any()).optional(),
    variations: zod_1.z.record(zod_1.z.any()).optional(),
    meta_title: zod_1.z.string().max(255).optional(),
    meta_description: zod_1.z.string().optional(),
    seo_keywords: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateProductSchema = exports.createProductSchema.partial();
exports.productQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    category_id: zod_1.z.string().cuid().optional(),
    brand_id: zod_1.z.string().cuid().optional(),
    status: zod_1.z.enum(['active', 'inactive', 'all']).optional(),
    stock_status: zod_1.z.enum(['in_stock', 'low_stock', 'out_of_stock']).optional(),
    min_price: zod_1.z.string().transform(val => parseFloat(val) || undefined).optional(),
    max_price: zod_1.z.string().transform(val => parseFloat(val) || undefined).optional(),
    is_featured: zod_1.z.string().transform(val => val === 'true').optional(),
    sort_by: zod_1.z.enum(['createdAt', 'price', 'name', 'averageRating', 'salesCount']).optional(),
    sort_direction: zod_1.z.enum(['asc', 'desc']).optional(),
    page: zod_1.z.string().transform(val => parseInt(val) || 1).optional(),
    per_page: zod_1.z.string().transform(val => parseInt(val) || 15).optional(),
});
exports.bulkUpdateProductsSchema = zod_1.z.object({
    product_ids: zod_1.z.array(zod_1.z.string().cuid()),
    action: zod_1.z.enum(['activate', 'deactivate', 'feature', 'unfeature', 'delete']),
    category_id: zod_1.z.string().cuid().optional(),
    brand_id: zod_1.z.string().cuid().optional(),
});
//# sourceMappingURL=product.validator.js.map