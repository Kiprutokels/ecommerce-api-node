"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthenticate = exports.authenticate = void 0;
const auth_1 = require("@/config/auth");
const response_util_1 = require("@/utils/response.util");
const database_1 = __importDefault(require("@/config/database"));
const redis_1 = __importDefault(require("@/config/redis"));
const constants_1 = require("@/utils/constants");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            response_util_1.ResponseUtil.error(res, 'Access token is required', 401);
            return;
        }
        const token = authHeader.substring(7);
        if (!token) {
            response_util_1.ResponseUtil.error(res, 'Access token is required', 401);
            return;
        }
        const decoded = (0, auth_1.verifyToken)(token);
        if (!decoded || !decoded.userId) {
            response_util_1.ResponseUtil.error(res, 'Invalid access token', 401);
            return;
        }
        const cacheKey = constants_1.CACHE_KEYS.USER(decoded.userId);
        let user;
        try {
            const cachedUser = await redis_1.default.get(cacheKey);
            if (cachedUser) {
                user = JSON.parse(cachedUser);
            }
        }
        catch (cacheError) {
            console.warn('Cache error:', cacheError);
        }
        if (!user) {
            user = await database_1.default.user.findUnique({
                where: { id: decoded.userId },
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
            if (user) {
                try {
                    await redis_1.default.set(cacheKey, JSON.stringify(user), constants_1.CACHE_TTL.MEDIUM);
                }
                catch (cacheError) {
                    console.warn('Cache set error:', cacheError);
                }
            }
        }
        if (!user) {
            response_util_1.ResponseUtil.error(res, 'User not found', 401);
            return;
        }
        if (!user.isActive) {
            response_util_1.ResponseUtil.error(res, 'Account is inactive', 403);
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            response_util_1.ResponseUtil.error(res, 'Invalid access token', 401);
            return;
        }
        if (error.name === 'TokenExpiredError') {
            response_util_1.ResponseUtil.error(res, 'Access token has expired', 401);
            return;
        }
        console.error('Authentication error:', error);
        response_util_1.ResponseUtil.error(res, 'Authentication failed', 500);
    }
};
exports.authenticate = authenticate;
const optionalAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            return;
        }
        const token = authHeader.substring(7);
        if (!token) {
            next();
            return;
        }
        const decoded = (0, auth_1.verifyToken)(token);
        if (decoded && decoded.userId) {
            const user = await database_1.default.user.findUnique({
                where: { id: decoded.userId },
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
            if (user && user.isActive) {
                req.user = user;
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuthenticate = optionalAuthenticate;
//# sourceMappingURL=auth.middleware.js.map