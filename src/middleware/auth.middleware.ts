// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/config/auth';
import { ResponseUtil } from '@/utils/response.util';
import { AuthenticatedRequest } from '@/types/common.types';
import prisma from '@/config/database';
import redisClient from '@/config/redis';
import { CACHE_KEYS, CACHE_TTL } from '@/utils/constants';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ResponseUtil.error(res, 'Access token is required', 401);
      return;
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      ResponseUtil.error(res, 'Access token is required', 401);
      return;
    }

    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      ResponseUtil.error(res, 'Invalid access token', 401);
      return;
    }

    // Try to get user from cache first
    const cacheKey = CACHE_KEYS.USER(decoded.userId);
    let user;
    
    try {
      const cachedUser = await redisClient.get(cacheKey);
      if (cachedUser) {
        user = JSON.parse(cachedUser);
      }
    } catch (cacheError) {
      console.warn('Cache error:', cacheError);
    }

    // If not in cache, get from database
    if (!user) {
      user = await prisma.user.findUnique({
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
        // Cache user for future requests
        try {
          await redisClient.set(cacheKey, JSON.stringify(user), CACHE_TTL.MEDIUM);
        } catch (cacheError) {
          console.warn('Cache set error:', cacheError);
        }
      }
    }

    if (!user) {
      ResponseUtil.error(res, 'User not found', 401);
      return;
    }

    if (!user.isActive) {
      ResponseUtil.error(res, 'Account is inactive', 403);
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      ResponseUtil.error(res, 'Invalid access token', 401);
      return;
    }
    
    if (error.name === 'TokenExpiredError') {
      ResponseUtil.error(res, 'Access token has expired', 401);
      return;
    }

    console.error('Authentication error:', error);
    ResponseUtil.error(res, 'Authentication failed', 500);
  }
};

export const optionalAuthenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const decoded = verifyToken(token);
    
    if (decoded && decoded.userId) {
      const user = await prisma.user.findUnique({
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
  } catch (error) {
    // Ignore authentication errors in optional auth
    next();
  }
};
