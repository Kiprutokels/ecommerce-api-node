// src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ResponseUtil } from '@/utils/response.util';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        ResponseUtil.error(res, 'Validation failed', 422, errors);
        return;
      }
      
      ResponseUtil.error(res, 'Validation error', 500);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        ResponseUtil.error(res, 'Query validation failed', 422, errors);
        return;
      }
      
      ResponseUtil.error(res, 'Query validation error', 500);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        ResponseUtil.error(res, 'Parameter validation failed', 422, errors);
        return;
      }
      
      ResponseUtil.error(res, 'Parameter validation error', 500);
    }
  };
};
