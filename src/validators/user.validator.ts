// src/validators/user.validator.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Valid email is required'),
  phone: z.string().max(20).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  is_admin: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Valid email is required'),
  phone: z.string().max(20).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  is_admin: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export const userQuerySchema = z.object({
  search: z.string().optional(),
  role: z.enum(['admin', 'user', 'all']).optional(),
  status: z.enum(['active', 'inactive', 'all']).optional(),
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  per_page: z.string().transform(val => parseInt(val) || 15).optional(),
});
