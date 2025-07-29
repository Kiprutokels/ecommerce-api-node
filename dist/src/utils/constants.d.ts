export declare const ORDER_STATUS: {
    readonly PENDING: "PENDING";
    readonly CONFIRMED: "CONFIRMED";
    readonly PROCESSING: "PROCESSING";
    readonly SHIPPED: "SHIPPED";
    readonly DELIVERED: "DELIVERED";
    readonly CANCELLED: "CANCELLED";
    readonly REFUNDED: "REFUNDED";
    readonly RETURNED: "RETURNED";
};
export declare const PAYMENT_STATUS: {
    readonly PENDING: "PENDING";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
    readonly PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED";
};
export declare const GENDER: {
    readonly MALE: "MALE";
    readonly FEMALE: "FEMALE";
    readonly OTHER: "OTHER";
};
export declare const DEFAULT_TAX_RATE = 0.08;
export declare const FREE_SHIPPING_THRESHOLD = 50;
export declare const DEFAULT_SHIPPING_COST = 9.99;
export declare const DEFAULT_CURRENCY = "USD";
export declare const ALLOWED_IMAGE_TYPES: string[];
export declare const MAX_IMAGE_SIZE: number;
export declare const CACHE_KEYS: {
    readonly CATEGORIES: "categories:all";
    readonly BRANDS: "brands:all";
    readonly FEATURED_PRODUCTS: "products:featured";
    readonly PRODUCT: (id: string) => string;
    readonly USER: (id: string) => string;
};
export declare const CACHE_TTL: {
    readonly SHORT: 300;
    readonly MEDIUM: 1800;
    readonly LONG: 3600;
    readonly VERY_LONG: 86400;
};
//# sourceMappingURL=constants.d.ts.map