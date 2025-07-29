"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = __importDefault(require("@/config/database"));
const auth_1 = require("@/config/auth");
const redis_1 = __importDefault(require("@/config/redis"));
const constants_1 = require("@/utils/constants");
class AuthService {
    static async register(data) {
        const existingUser = await database_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const hashedPassword = await (0, auth_1.hashPassword)(data.password);
        const user = await database_1.default.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                phone: data.phone,
                isAdmin: false,
                isActive: true,
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
        const token = (0, auth_1.generateToken)({
            userId: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone ?? undefined,
                is_admin: user.isAdmin,
                is_active: user.isActive,
            },
            token,
        };
    }
    static async login(data) {
        const user = await database_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await (0, auth_1.comparePassword)(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        if (!user.isActive) {
            throw new Error('Account is inactive. Please contact support.');
        }
        await database_1.default.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        try {
            await redis_1.default.del(constants_1.CACHE_KEYS.USER(user.id));
        }
        catch (error) {
            console.warn('Cache clear error:', error);
        }
        const token = (0, auth_1.generateToken)({
            userId: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone ?? undefined,
                is_admin: user.isAdmin,
                is_active: user.isActive,
            },
            token,
        };
    }
    static async getUserById(userId) {
        return database_1.default.user.findUnique({
            where: { id: userId },
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
            },
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map