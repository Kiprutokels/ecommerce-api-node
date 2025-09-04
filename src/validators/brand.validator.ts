import { z } from 'zod';

export const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255, 'Brand name is too long'),
  slug: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const updateBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(255, 'Brand name is too long').optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const brandQuerySchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive']).optional(),
});
