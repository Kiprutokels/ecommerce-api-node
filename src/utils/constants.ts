// src/utils/constants.ts
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  RETURNED: 'RETURNED',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
} as const;

export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export const DEFAULT_TAX_RATE = 0.08; // 8%
export const FREE_SHIPPING_THRESHOLD = 50;
export const DEFAULT_SHIPPING_COST = 9.99;
export const DEFAULT_CURRENCY = 'USD';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const CACHE_KEYS = {
  CATEGORIES: 'categories:all',
  BRANDS: 'brands:all',
  FEATURED_PRODUCTS: 'products:featured',
  PRODUCT: (id: string) => `product:${id}`,
  USER: (id: string) => `user:${id}`,
} as const;

export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;
