"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const database_1 = __importDefault(require("@/config/database"));
const helpers_util_1 = require("@/utils/helpers.util");
const redis_1 = __importDefault(require("@/config/redis"));
const constants_1 = require("@/utils/constants");
class CategoryService {
    static async getAllCategories(filters = {}) {
        const where = {};
        if (filters.search) {
            where.name = {
                contains: filters.search,
                mode: 'insensitive',
            };
        }
        if (filters.status && filters.status !== 'all') {
            where.isActive = filters.status === 'active';
        }
        if (filters.featured) {
            where.isFeatured = true;
        }
        return database_1.default.category.findMany({
            where,
            include: {
                parent: true,
                children: true,
                _count: {
                    select: { products: true },
                },
            },
            orderBy: [
                { sortOrder: 'asc' },
                { name: 'asc' },
            ],
        });
    }
    static async getCategoriesWithPagination(filters, page, perPage) {
        const where = {};
        if (filters.search) {
            where.name = {
                contains: filters.search,
                mode: 'insensitive',
            };
        }
        if (filters.status && filters.status !== 'all') {
            where.isActive = filters.status === 'active';
        }
        const [categories, total] = await Promise.all([
            database_1.default.category.findMany({
                where,
                include: {
                    parent: true,
                    children: true,
                    _count: {
                        select: { products: true },
                    },
                },
                orderBy: [
                    { sortOrder: 'asc' },
                    { name: 'asc' },
                ],
                skip: (page - 1) * perPage,
                take: perPage,
            }),
            database_1.default.category.count({ where }),
        ]);
        return { categories, total };
    }
    static async getCategoryById(id) {
        return database_1.default.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
                _count: {
                    select: { products: true },
                },
            },
        });
    }
    static async createCategory(data) {
        if (!data.slug) {
            data.slug = helpers_util_1.HelperUtil.generateSlug(data.name);
        }
        const existingCategory = await database_1.default.category.findUnique({
            where: { slug: data.slug },
        });
        if (existingCategory) {
            throw new Error('Category with this slug already exists');
        }
        const category = await database_1.default.category.create({
            data,
            include: {
                parent: true,
                children: true,
                _count: {
                    select: { products: true },
                },
            },
        });
        try {
            await redis_1.default.del(constants_1.CACHE_KEYS.CATEGORIES);
        }
        catch (error) {
            console.warn('Cache clear error:', error);
        }
        return category;
    }
    static async updateCategory(id, data) {
        if (data.name && !data.slug) {
            data.slug = helpers_util_1.HelperUtil.generateSlug(data.name);
        }
        if (data.slug) {
            const existingCategory = await database_1.default.category.findFirst({
                where: {
                    slug: data.slug,
                    NOT: { id },
                },
            });
            if (existingCategory) {
                throw new Error('Category with this slug already exists');
            }
        }
        const category = await database_1.default.category.update({
            where: { id },
            data,
            include: {
                parent: true,
                children: true,
                _count: {
                    select: { products: true },
                },
            },
        });
        try {
            await redis_1.default.del(constants_1.CACHE_KEYS.CATEGORIES);
        }
        catch (error) {
            console.warn('Cache clear error:', error);
        }
        return category;
    }
    static async deleteCategory(id) {
        const productCount = await database_1.default.product.count({
            where: { categoryId: id },
        });
        if (productCount > 0) {
            throw new Error('Cannot delete category with products');
        }
        const childrenCount = await database_1.default.category.count({
            where: { parentId: id },
        });
        if (childrenCount > 0) {
            throw new Error('Cannot delete category with subcategories');
        }
        await database_1.default.category.delete({
            where: { id },
        });
        try {
            await redis_1.default.del(constants_1.CACHE_KEYS.CATEGORIES);
        }
        catch (error) {
            console.warn('Cache clear error:', error);
        }
    }
    static async getActiveCategories() {
        try {
            const cached = await redis_1.default.get(constants_1.CACHE_KEYS.CATEGORIES);
            if (cached) {
                return JSON.parse(cached);
            }
        }
        catch (error) {
            console.warn('Cache get error:', error);
        }
        const categories = await database_1.default.category.findMany({
            where: { isActive: true },
            include: {
                parent: true,
                children: {
                    where: { isActive: true },
                },
                _count: {
                    select: { products: true },
                },
            },
            orderBy: [
                { sortOrder: 'asc' },
                { name: 'asc' },
            ],
        });
        try {
            await redis_1.default.set(constants_1.CACHE_KEYS.CATEGORIES, JSON.stringify(categories), constants_1.CACHE_TTL.LONG);
        }
        catch (error) {
            console.warn('Cache set error:', error);
        }
        return categories;
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map