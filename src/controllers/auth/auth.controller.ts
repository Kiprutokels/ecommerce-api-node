import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { ResponseUtil } from '@/utils/response.util';
import { AuthenticatedRequest } from '@/types/common.types';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      ResponseUtil.success(res, result, 'User registered successfully', 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 400);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      ResponseUtil.success(res, result, 'Login successful');
    } catch (error: any) {
      const statusCode = error.message === 'Invalid credentials' ? 401 : 400;
      ResponseUtil.error(res, error.message, statusCode);
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // In JWT implementation, we don't need to do anything on the server side
      // Client should remove the token
      ResponseUtil.success(res, null, 'Logged out successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseUtil.error(res, 'User not found', 404);
        return;
      }

      const user = await AuthService.getUserById(req.user.id);
      
      if (!user) {
        ResponseUtil.error(res, 'User not found', 404);
        return;
      }

      ResponseUtil.success(res, {
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
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }
}
