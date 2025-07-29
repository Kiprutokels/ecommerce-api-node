export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
}
export interface LoginData {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        is_admin: boolean;
        is_active: boolean;
    };
    token: string;
}
export interface JwtPayload {
    userId: string;
    email: string;
    isAdmin: boolean;
}
//# sourceMappingURL=auth.types.d.ts.map