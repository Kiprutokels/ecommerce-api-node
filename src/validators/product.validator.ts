import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: z.string().max(255).optional(),
  description: z.string().min(1, 'Description is required'),
  short_description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  sale_price: z.number().positive().optional(),
  cost_price: z.number().positive().optional(),
  sku: z.string().max(255).optional(),
  barcode: z.string().max(255).optional(),
  stock_quantity: z.number().int().min(0).optional(),
  low_stock_threshold: z.number().int().min(0).optional(),
  manage_stock: z.boolean().optional(),
  in_stock: z.boolean().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  is_digital: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
  gallery: z.array(z.string().url()).optional(),
  weight: z.number().positive().optional(),
  dimensions: z.record(z.any()).optional(),
  category_id: z.string().cuid('Invalid category ID'),
  brand_id: z.string().cuid().optional(),
  attributes: z.record(z.any()).optional(),
  variations: z.record(z.any()).optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().optional(),
  seo_keywords: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category_id: z.string().optional(),
  brand_id: z.string().optional(),
  status: z.enum(['active', 'inactive', 'all']).optional(),
  stock_status: z.enum(['in_stock', 'low_stock', 'out_of_stock', 'all']).optional(),
  min_price: z.string().transform(val => parseFloat(val) || undefined).optional(),
  max_price: z.string().transform(val => parseFloat(val) || undefined).optional(),
  is_featured: z.string().transform(val => val === 'true').optional(),
  sort_by: z.enum(['createdAt', 'price', 'name', 'averageRating', 'salesCount', 'created_at', 'stock_quantity']).optional(),
  sort_direction: z.enum(['asc', 'desc']).optional(),
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  per_page: z.string().transform(val => parseInt(val) || 15).optional(),
});

export const bulkUpdateProductsSchema = z.object({
  product_ids: z.array(z.string().cuid()),
  action: z.enum(['activate', 'deactivate', 'feature', 'unfeature', 'delete']),
  category_id: z.string().cuid().optional(),
  brand_id: z.string().cuid().optional(),
});
