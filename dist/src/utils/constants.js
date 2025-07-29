"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_TTL = exports.CACHE_KEYS = exports.MAX_IMAGE_SIZE = exports.ALLOWED_IMAGE_TYPES = exports.DEFAULT_CURRENCY = exports.DEFAULT_SHIPPING_COST = exports.FREE_SHIPPING_THRESHOLD = exports.DEFAULT_TAX_RATE = exports.GENDER = exports.PAYMENT_STATUS = exports.ORDER_STATUS = void 0;
exports.ORDER_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    REFUNDED: 'REFUNDED',
    RETURNED: 'RETURNED',
};
exports.PAYMENT_STATUS = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
    PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
};
exports.GENDER = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHER: 'OTHER',
};
exports.DEFAULT_TAX_RATE = 0.08;
exports.FREE_SHIPPING_THRESHOLD = 50;
exports.DEFAULT_SHIPPING_COST = 9.99;
exports.DEFAULT_CURRENCY = 'USD';
exports.ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
exports.MAX_IMAGE_SIZE = 5 * 1024 * 1024;
exports.CACHE_KEYS = {
    CATEGORIES: 'categories:all',
    BRANDS: 'brands:all',
    FEATURED_PRODUCTS: 'products:featured',
    PRODUCT: (id) => `product:${id}`,
    USER: (id) => `user:${id}`,
};
exports.CACHE_TTL = {
    SHORT: 300,
    MEDIUM: 1800,
    LONG: 3600,
    VERY_LONG: 86400,
};
//# sourceMappingURL=constants.js.map