"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandService = void 0;
const database_1 = __importDefault(require("@/config/database"));
const helpers_util_1 = require("@/utils/helpers.util");
const redis_1 = __importDefault(require("@/config/redis"));
const constants_1 = require("@/utils/constants");
class BrandService {
    static async getAllBrands(filters = {}) {
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
        return database_1.default.brand.findMany({
            where,
            include: {
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
    static async getBrandsWithPagination(filters, page, perPage) {
        const where = {};
        if (filters.search) {
            where.name = {
                contains: filters.search,
                mode: 'insensitive',
            };
        }
        const [brands, total] = await Promise.all([
            database_1.default.brand.findMany({
                where,
                include: {
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
            database_1.default.brand.count({ where }),
        ]);
        return { brands, total };
    }
    static async createBrand(data) {
        if (!data.slug) {
            data.slug = helpers_util_1.HelperUtil.generateSlug(data.name);
        }
        const existingBrand = await database_1.default.brand.findUnique({
            where: { slug: data.slug },
        });
        if (existingBrand) {
            throw new Error('Brand with this slug already exists');
        }
        const brand = await database_1.default.brand.create({
            data,
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
        try {
            await redis_1.default.del(constants_1.CACHE_KEYS.BRANDS);
        }
        catch (error) {
            console.warn('Cache clear error:', error);
        }
        return brand;
    }
    static async getActiveBrands() {
        try {
            const cached = await redis_1.default.get(constants_1.CACHE_KEYS.BRANDS);
            if (cached) {
                return JSON.parse(cached);
            }
        }
        catch (error) {
            console.warn('Cache get error:', error);
        }
        const brands = await database_1.default.brand.findMany({
            where: { isActive: true },
            include: {
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
            await redis_1.default.set(constants_1.CACHE_KEYS.BRANDS, JSON.stringify(brands), constants_1.CACHE_TTL.LONG);
        }
        catch (error) {
            console.warn('Cache set error:', error);
        }
        return brands;
    }
}
exports.BrandService = BrandService;
//# sourceMappingURL=brand.service.js.map