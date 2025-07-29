"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = __importDefault(require("@/config/database"));
const auth_1 = require("@/config/auth");
const redis_1 = __importDefault(require("@/config/redis"));
const constants_1 = require("@/utils/constants");
class UserService {
    static async getAllUsers(filters, page, perPage) {
        const where = {};
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
                { phone: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        if (filters.role && filters.role !== 'all') {
            where.isAdmin = filters.role === 'admin';
        }
        if (filters.status && filters.status !== 'all') {
            where.isActive = filters.status === 'active';
        }
        const [users, total] = await Promise.all([
            database_1.default.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    isAdmin: true,
                    isActive: true,
                    lastLoginAt: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            orders: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * perPage,
                take: perPage,
            }),
            database_1.default.user.count({ where }),
        ]);
        return { users, total };
    }
    static async createUser(data) {
        const existingUser = await database_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const hashedPassword = await (0, auth_1.hashPassword)(data.password);
        return database_1.default.user.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: hashedPassword,
                isAdmin: data.is_admin || false,
                isActive: data.is_active !== false,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isAdmin: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    static async updateUser(id, data) {
        if (data.email) {
            const existingUser = await database_1.default.user.findFirst({
                where: {
                    email: data.email,
                    NOT: { id },
                },
            });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }
        }
        const updateData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            isAdmin: data.is_admin,
            isActive: data.is_active,
        };
        if (data.password) {
            updateData.password = await (0, auth_1.hashPassword)(data.password);
        }
        const user = await database_1.default.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isAdmin: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        try {
            await redis_1.default.del(constants_1.CACHE_KEYS.USER(id));
        }
        catch (error) {
            console.warn('Cache clear error:', error);
        }
        return user;
    }
    static async deleteUser(id) {
        const orderCount = await database_1.default.order.count({
            where: { userId: id },
        });
        if (orderCount > 0) {
            throw new Error('Cannot delete user with existing orders');
        }
        await database_1.default.user.delete({
            where: { id },
        });
        try {
            await redis_1.default.del(constants_1.CACHE_KEYS.USER(id));
        }
        catch (error) {
            console.warn('Cache clear error:', error);
        }
    }
    static async getUserById(id) {
        return database_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isAdmin: true,
                isActive: true,
                avatar: true,
                preferences: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        orders: true,
                        reviews: true,
                        wishlists: true,
                    },
                },
            },
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map