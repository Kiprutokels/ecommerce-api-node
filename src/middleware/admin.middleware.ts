// src/middleware/admin.middleware.ts
import { Response, NextFunction } from 'express';
import { ResponseUtil } from '@/utils/response.util';
import { AuthenticatedRequest } from '@/types/common.types';

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    ResponseUtil.error(res, 'Authentication required', 401);
    return;
  }

  if (!req.user.isAdmin) {
    ResponseUtil.error(res, 'Admin access required', 403);
    return;
  }

  next();
};
