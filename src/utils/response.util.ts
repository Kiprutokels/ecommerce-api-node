// src/utils/response.util.ts
import { Response } from 'express';
import { ApiResponse } from '@/types/common.types';

export class ResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = 'Error',
    statusCode: number = 400,
    errors?: any
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    perPage: number,
    message: string = 'Success'
  ): Response {
    const totalPages = Math.ceil(total / perPage);
    
    const response = {
      success: true,
      message,
      data,
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    };
    
    return res.status(200).json(response);
  }
}
