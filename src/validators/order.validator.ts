// src/validators/order.validator.ts
import { z } from 'zod';

const addressSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required').max(50),
  address_line_1: z.string().min(1, 'Address line 1 is required').max(255),
  address_line_2: z.string().max(255).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  postal_code: z.string().min(1, 'Postal code is required').max(20),
  country: z.string().min(1, 'Country is required').max(100),
});

export const createOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().cuid('Invalid product ID'),
    quantity: z.number().int().positive('Quantity must be positive'),
    price: z.number().positive('Price must be positive'),
  })).min(1, 'At least one item is required'),
  billing_address: addressSchema,
  shipping_address: addressSchema,
  payment_method: z.enum(['card', 'paypal', 'bank_transfer']),
  notes: z.string().max(1000).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  tracking_number: z.string().max(255).optional(),
  admin_notes: z.string().max(1000).optional(),
});

export const orderQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'all']).optional(),
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded', 'partially_refunded', 'all']).optional(),
  search: z.string().optional(),
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  per_page: z.string().transform(val => parseInt(val) || 15).optional(),
});
