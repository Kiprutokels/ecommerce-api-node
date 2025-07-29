"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQuerySchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255),
    email: zod_1.z.string().email('Valid email is required'),
    phone: zod_1.z.string().max(20).optional(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    is_admin: zod_1.z.boolean().optional(),
    is_active: zod_1.z.boolean().optional(),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(255),
    email: zod_1.z.string().email('Valid email is required'),
    phone: zod_1.z.string().max(20).optional(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters').optional(),
    is_admin: zod_1.z.boolean().optional(),
    is_active: zod_1.z.boolean().optional(),
});
exports.userQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    role: zod_1.z.enum(['admin', 'user', 'all']).optional(),
    status: zod_1.z.enum(['active', 'inactive', 'all']).optional(),
    page: zod_1.z.string().transform(val => parseInt(val) || 1).optional(),
    per_page: zod_1.z.string().transform(val => parseInt(val) || 15).optional(),
});
//# sourceMappingURL=user.validator.js.map