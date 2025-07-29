// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ResponseUtil } from '@/utils/response.util';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        ResponseUtil.error(res, 'A record with this data already exists', 409);
        return;
      case 'P2025':
        ResponseUtil.error(res, 'Record not found', 404);
        return;
      case 'P2003':
        ResponseUtil.error(res, 'Foreign key constraint failed', 400);
        return;
      default:
        ResponseUtil.error(res, 'Database error', 500);
        return;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    ResponseUtil.error(res, 'Invalid data provided', 400);
    return;
  }

  // Default error
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Internal server error';
  
  ResponseUtil.error(res, message, statusCode);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  ResponseUtil.error(res, `Route ${req.originalUrl} not found`, 404);
};
