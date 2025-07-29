"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("@/services/auth.service");
const response_util_1 = require("@/utils/response.util");
class AuthController {
    static async register(req, res) {
        try {
            const result = await auth_service_1.AuthService.register(req.body);
            response_util_1.ResponseUtil.success(res, result, 'User registered successfully', 201);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 400);
        }
    }
    static async login(req, res) {
        try {
            const result = await auth_service_1.AuthService.login(req.body);
            response_util_1.ResponseUtil.success(res, result, 'Login successful');
        }
        catch (error) {
            const statusCode = error.message === 'Invalid credentials' ? 401 : 400;
            response_util_1.ResponseUtil.error(res, error.message, statusCode);
        }
    }
    static async logout(req, res) {
        try {
            response_util_1.ResponseUtil.success(res, null, 'Logged out successfully');
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
    static async me(req, res) {
        try {
            if (!req.user) {
                response_util_1.ResponseUtil.error(res, 'User not found', 404);
                return;
            }
            const user = await auth_service_1.AuthService.getUserById(req.user.id);
            if (!user) {
                response_util_1.ResponseUtil.error(res, 'User not found', 404);
                return;
            }
            response_util_1.ResponseUtil.success(res, {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                is_admin: user.isAdmin,
                is_active: user.isActive,
                avatar: user.avatar,
                preferences: user.preferences,
                last_login_at: user.lastLoginAt,
                created_at: user.createdAt,
                updated_at: user.updatedAt,
            });
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map