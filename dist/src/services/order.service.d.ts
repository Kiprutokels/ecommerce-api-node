import { OrderCreateData, OrderUpdateStatusData } from '@/types/order.types';
export declare class OrderService {
    static createOrder(userId: string, data: OrderCreateData): Promise<({
        user: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
        };
        items: ({
            product: {
                name: string;
                id: string;
                slug: string;
                images: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            orderId: string;
            productName: string;
            productSku: string;
            productDetails: import("@prisma/client/runtime/library").JsonValue | null;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        taxRate: import("@prisma/client/runtime/library").Decimal;
        taxAmount: import("@prisma/client/runtime/library").Decimal;
        shippingAmount: import("@prisma/client/runtime/library").Decimal;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
        paymentId: string | null;
        paymentDetails: import("@prisma/client/runtime/library").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/library").JsonValue;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        shippingMethod: string | null;
        trackingNumber: string | null;
        notes: string | null;
        adminNotes: string | null;
        couponCode: string | null;
        confirmedAt: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
    }) | null>;
    static getOrderById(orderId: string, userId?: string): Promise<({
        user: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
        };
        items: ({
            product: {
                name: string;
                category: {
                    name: string;
                };
                brand: {
                    name: string;
                } | null;
                id: string;
                slug: string;
                images: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            orderId: string;
            productName: string;
            productSku: string;
            productDetails: import("@prisma/client/runtime/library").JsonValue | null;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        taxRate: import("@prisma/client/runtime/library").Decimal;
        taxAmount: import("@prisma/client/runtime/library").Decimal;
        shippingAmount: import("@prisma/client/runtime/library").Decimal;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
        paymentId: string | null;
        paymentDetails: import("@prisma/client/runtime/library").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/library").JsonValue;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        shippingMethod: string | null;
        trackingNumber: string | null;
        notes: string | null;
        adminNotes: string | null;
        couponCode: string | null;
        confirmedAt: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
    }) | null>;
    static getUserOrders(userId: string, filters: any, page: number, perPage: number): Promise<{
        orders: ({
            items: ({
                product: {
                    name: string;
                    id: string;
                    images: string[];
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                total: import("@prisma/client/runtime/library").Decimal;
                price: import("@prisma/client/runtime/library").Decimal;
                productId: string;
                orderId: string;
                productName: string;
                productSku: string;
                productDetails: import("@prisma/client/runtime/library").JsonValue | null;
                quantity: number;
            })[];
        } & {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderNumber: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            taxRate: import("@prisma/client/runtime/library").Decimal;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            shippingAmount: import("@prisma/client/runtime/library").Decimal;
            discountAmount: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paymentMethod: string | null;
            paymentId: string | null;
            paymentDetails: import("@prisma/client/runtime/library").JsonValue | null;
            billingAddress: import("@prisma/client/runtime/library").JsonValue;
            shippingAddress: import("@prisma/client/runtime/library").JsonValue;
            shippingMethod: string | null;
            trackingNumber: string | null;
            notes: string | null;
            adminNotes: string | null;
            couponCode: string | null;
            confirmedAt: Date | null;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            cancelledAt: Date | null;
        })[];
        total: number;
    }>;
    static getAllOrders(filters: any, page: number, perPage: number): Promise<{
        orders: ({
            user: {
                name: string;
                id: string;
                email: string;
                phone: string | null;
            };
            items: ({
                product: {
                    name: string;
                    id: string;
                    images: string[];
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                total: import("@prisma/client/runtime/library").Decimal;
                price: import("@prisma/client/runtime/library").Decimal;
                productId: string;
                orderId: string;
                productName: string;
                productSku: string;
                productDetails: import("@prisma/client/runtime/library").JsonValue | null;
                quantity: number;
            })[];
        } & {
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderNumber: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            taxRate: import("@prisma/client/runtime/library").Decimal;
            taxAmount: import("@prisma/client/runtime/library").Decimal;
            shippingAmount: import("@prisma/client/runtime/library").Decimal;
            discountAmount: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            paymentMethod: string | null;
            paymentId: string | null;
            paymentDetails: import("@prisma/client/runtime/library").JsonValue | null;
            billingAddress: import("@prisma/client/runtime/library").JsonValue;
            shippingAddress: import("@prisma/client/runtime/library").JsonValue;
            shippingMethod: string | null;
            trackingNumber: string | null;
            notes: string | null;
            adminNotes: string | null;
            couponCode: string | null;
            confirmedAt: Date | null;
            shippedAt: Date | null;
            deliveredAt: Date | null;
            cancelledAt: Date | null;
        })[];
        total: number;
    }>;
    static updateOrderStatus(orderId: string, data: OrderUpdateStatusData): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
        };
        items: ({
            product: {
                name: string;
                id: string;
                images: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            orderId: string;
            productName: string;
            productSku: string;
            productDetails: import("@prisma/client/runtime/library").JsonValue | null;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        taxRate: import("@prisma/client/runtime/library").Decimal;
        taxAmount: import("@prisma/client/runtime/library").Decimal;
        shippingAmount: import("@prisma/client/runtime/library").Decimal;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
        paymentId: string | null;
        paymentDetails: import("@prisma/client/runtime/library").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/library").JsonValue;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        shippingMethod: string | null;
        trackingNumber: string | null;
        notes: string | null;
        adminNotes: string | null;
        couponCode: string | null;
        confirmedAt: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
    }>;
    static cancelOrder(orderId: string, userId: string): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
        };
        items: ({
            product: {
                name: string;
                id: string;
                images: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string;
            orderId: string;
            productName: string;
            productSku: string;
            productDetails: import("@prisma/client/runtime/library").JsonValue | null;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        orderNumber: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        taxRate: import("@prisma/client/runtime/library").Decimal;
        taxAmount: import("@prisma/client/runtime/library").Decimal;
        shippingAmount: import("@prisma/client/runtime/library").Decimal;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: string | null;
        paymentId: string | null;
        paymentDetails: import("@prisma/client/runtime/library").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/library").JsonValue;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        shippingMethod: string | null;
        trackingNumber: string | null;
        notes: string | null;
        adminNotes: string | null;
        couponCode: string | null;
        confirmedAt: Date | null;
        shippedAt: Date | null;
        deliveredAt: Date | null;
        cancelledAt: Date | null;
    }>;
}
//# sourceMappingURL=order.service.d.ts.map