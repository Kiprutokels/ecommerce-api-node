// src/controllers/admin/user.controller.ts
import { Request, Response } from 'express';
import { UserService } from '@/services/user.service';
import { ResponseUtil } from '@/utils/response.util';
import { HelperUtil } from '@/utils/helpers.util';

export class AdminUserController {
  static async index(req: Request, res: Response): Promise<void> {
    try {
      const { page, perPage } = HelperUtil.getPaginationParams(req.query);
      const filters = {
        search: req.query.search as string,
        role: req.query.role as string,
        status: req.query.status as string,
      };

      const { users, total } = await UserService.getAllUsers(filters, page, perPage);

      const formattedUsers = users.map((user: any) => ({
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

      ResponseUtil.paginated(res, formattedUsers, total, page, perPage);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async store(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);

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

      ResponseUtil.success(res, formattedUser, 'User created successfully', 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 400);
    }
  }

  static async show(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);

      if (!user) {
        ResponseUtil.error(res, 'User not found', 404);
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

      ResponseUtil.success(res, formattedUser);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);

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

      ResponseUtil.success(res, formattedUser, 'User updated successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 400);
    }
  }

  static async destroy(req: Request, res: Response): Promise<void> {
    try {
      await UserService.deleteUser(req.params.id);
      ResponseUtil.success(res, null, 'User deleted successfully');
    } catch (error: any) {
      const statusCode = error.message.includes('Cannot delete') ? 422 : 500;
      ResponseUtil.error(res, error.message, statusCode);
    }
  }
}
