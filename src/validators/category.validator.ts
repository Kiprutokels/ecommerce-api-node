// src/validators/category.validator.ts
import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: z.string().max(255).optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  icon: z.string().optional(),
  parent_id: z.string().cuid().optional(),
  sort_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'all']).optional(),
  featured: z.string().transform(val => val === 'true').optional(),
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  per_page: z.string().transform(val => parseInt(val) || 15).optional(),
});
