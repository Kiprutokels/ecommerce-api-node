// src/types/common.types.ts
import { Request } from 'express';
import { User } from '@prisma/client';

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};


export interface AuthenticatedRequest extends Request {
  user?: SafeUser;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export interface PaginationQuery {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
