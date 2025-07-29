export declare class UserService {
    static getAllUsers(filters: any, page: number, perPage: number): Promise<{
        users: {
            name: string;
            id: string;
            email: string;
            phone: string | null;
            isAdmin: boolean;
            isActive: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            _count: {
                orders: number;
            };
        }[];
        total: number;
    }>;
    static createUser(data: any): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        isAdmin: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static updateUser(id: string, data: any): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        isAdmin: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static deleteUser(id: string): Promise<void>;
    static getUserById(id: string): Promise<{
        name: string;
        id: string;
        email: string;
        phone: string | null;
        isAdmin: boolean;
        isActive: boolean;
        avatar: string | null;
        preferences: import("@prisma/client/runtime/library").JsonValue;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            orders: number;
            reviews: number;
            wishlists: number;
        };
    } | null>;
}
//# sourceMappingURL=user.service.d.ts.map