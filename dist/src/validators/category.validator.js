"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryQuerySchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255),
    slug: zod_1.z.string().max(255).optional(),
    description: zod_1.z.string().optional(),
    image: zod_1.z.string().url().optional(),
    icon: zod_1.z.string().optional(),
    parent_id: zod_1.z.string().cuid().optional(),
    sort_order: zod_1.z.number().int().min(0).optional(),
    is_active: zod_1.z.boolean().optional(),
    is_featured: zod_1.z.boolean().optional(),
    meta_title: zod_1.z.string().max(255).optional(),
    meta_description: zod_1.z.string().optional(),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
exports.categoryQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['active', 'inactive', 'all']).optional(),
    featured: zod_1.z.string().transform(val => val === 'true').optional(),
    page: zod_1.z.string().transform(val => parseInt(val) || 1).optional(),
    per_page: zod_1.z.string().transform(val => parseInt(val) || 15).optional(),
});
//# sourceMappingURL=category.validator.js.map