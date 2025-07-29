import { Prisma } from '@prisma/client';
export interface OrderCreateData {
    items: OrderItem[];
    billing_address: Address;
    shipping_address: Address;
    payment_method: string;
    notes?: string;
}
export interface OrderItem {
    product_id: string;
    quantity: number;
    price: number;
}
export type Address = Prisma.JsonObject & {
    name: string;
    email: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
};
export interface OrderUpdateStatusData {
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    tracking_number?: string;
    admin_notes?: string;
}
//# sourceMappingURL=order.types.d.ts.map