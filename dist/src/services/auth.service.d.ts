import { RegisterData, LoginData, AuthResponse } from '@/types/auth.types';
export declare class AuthService {
    static register(data: RegisterData): Promise<AuthResponse>;
    static login(data: LoginData): Promise<AuthResponse>;
    static getUserById(userId: string): Promise<{
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
    } | null>;
}
//# sourceMappingURL=auth.service.d.ts.map