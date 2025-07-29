import { z } from 'zod';
export declare const createOrderSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        product_id: z.ZodString;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        price: number;
        quantity: number;
        product_id: string;
    }, {
        price: number;
        quantity: number;
        product_id: string;
    }>, "many">;
    billing_address: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        address_line_1: z.ZodString;
        address_line_2: z.ZodOptional<z.ZodString>;
        city: z.ZodString;
        state: z.ZodString;
        postal_code: z.ZodString;
        country: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email: string;
        phone: string;
        address_line_1: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        address_line_2?: string | undefined;
    }, {
        name: string;
        email: string;
        phone: string;
        address_line_1: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        address_line_2?: string | undefined;
    }>;
    shipping_address: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        address_line_1: z.ZodString;
        address_line_2: z.ZodOptional<z.ZodString>;
        city: z.ZodString;
        state: z.ZodString;
        postal_code: z.ZodString;
        country: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email: string;
        phone: string;
        address_line_1: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        address_line_2?: string | undefined;
    }, {
        name: string;
        email: string;
        phone: string;
        address_line_1: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        address_line_2?: string | undefined;
    }>;
    payment_method: z.ZodEnum<["card", "paypal", "bank_transfer"]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        price: number;
        quantity: number;
        product_id: string;
    }[];
    billing_address: {
        name: string;
        email: string;
        phone: string;
        address_line_1: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        address_line_2?: string | undefined;
    };
    shipping_address: {
        name: string;
        email: string;
        phone: string;
        address_line_1: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        address_line_2?: string | undefined;
    };
    payment_method: "card" | "paypal" | "bank_transfer";
    notes?: string | undefined;
}, {
    items: {
        price: number;
        quantity: number;
        product_id: string;
    }[];
    billing_address: {
        name: string;
        email: string;
        phone: string;
        address_line_1: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        address_line_2?: string | undefined;
    };
    shipping_address: {
        name: string;
        email: string;
        phone: string;
        address_line_1: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        address_line_2?: string | undefined;
    };
    payment_method: "card" | "paypal" | "bank_transfer";
    notes?: string | undefined;
}>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]>;
    tracking_number: z.ZodOptional<z.ZodString>;
    admin_notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    tracking_number?: string | undefined;
    admin_notes?: string | undefined;
}, {
    status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    tracking_number?: string | undefined;
    admin_notes?: string | undefined;
}>;
export declare const orderQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "all"]>>;
    payment_status: z.ZodOptional<z.ZodEnum<["pending", "paid", "failed", "refunded", "partially_refunded", "all"]>>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    per_page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    status?: "all" | "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | undefined;
    page?: number | undefined;
    per_page?: number | undefined;
    payment_status?: "all" | "pending" | "paid" | "failed" | "refunded" | "partially_refunded" | undefined;
}, {
    search?: string | undefined;
    status?: "all" | "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | undefined;
    page?: string | undefined;
    per_page?: string | undefined;
    payment_status?: "all" | "pending" | "paid" | "failed" | "refunded" | "partially_refunded" | undefined;
}>;
//# sourceMappingURL=order.validator.d.ts.map