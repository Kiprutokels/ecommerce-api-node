"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserController = void 0;
const user_service_1 = require("@/services/user.service");
const response_util_1 = require("@/utils/response.util");
const helpers_util_1 = require("@/utils/helpers.util");
class AdminUserController {
    static async index(req, res) {
        try {
            const { page, perPage } = helpers_util_1.HelperUtil.getPaginationParams(req.query);
            const filters = {
                search: req.query.search,
                role: req.query.role,
                status: req.query.status,
            };
            const { users, total } = await user_service_1.UserService.getAllUsers(filters, page, perPage);
            const formattedUsers = users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                is_admin: user.isAdmin,
                is_active: user.isActive,
                last_login_at: user.lastLoginAt,
                order_count: user._count.orders,
                created_at: user.createdAt,
                updated_at: user.updatedAt,
            }));
            response_util_1.ResponseUtil.paginated(res, formattedUsers, total, page, perPage);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
    static async store(req, res) {
        try {
            const user = await user_service_1.UserService.createUser(req.body);
            const formattedUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                is_admin: user.isAdmin,
                is_active: user.isActive,
                created_at: user.createdAt,
                updated_at: user.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedUser, 'User created successfully', 201);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 400);
        }
    }
    static async show(req, res) {
        try {
            const user = await user_service_1.UserService.getUserById(req.params.id);
            if (!user) {
                response_util_1.ResponseUtil.error(res, 'User not found', 404);
                return;
            }
            const formattedUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                is_admin: user.isAdmin,
                is_active: user.isActive,
                avatar: user.avatar,
                preferences: user.preferences,
                last_login_at: user.lastLoginAt,
                order_count: user._count.orders,
                review_count: user._count.reviews,
                wishlist_count: user._count.wishlists,
                created_at: user.createdAt,
                updated_at: user.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedUser);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
    static async update(req, res) {
        try {
            const user = await user_service_1.UserService.updateUser(req.params.id, req.body);
            const formattedUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                is_admin: user.isAdmin,
                is_active: user.isActive,
                created_at: user.createdAt,
                updated_at: user.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedUser, 'User updated successfully');
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 400);
        }
    }
    static async destroy(req, res) {
        try {
            await user_service_1.UserService.deleteUser(req.params.id);
            response_util_1.ResponseUtil.success(res, null, 'User deleted successfully');
        }
        catch (error) {
            const statusCode = error.message.includes('Cannot delete') ? 422 : 500;
            response_util_1.ResponseUtil.error(res, error.message, statusCode);
        }
    }
}
exports.AdminUserController = AdminUserController;
//# sourceMappingURL=user.controller.js.map