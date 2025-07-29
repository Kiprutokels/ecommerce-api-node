import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
    is_admin: z.ZodOptional<z.ZodBoolean>;
    is_active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    password: string;
    name: string;
    email: string;
    phone?: string | undefined;
    is_active?: boolean | undefined;
    is_admin?: boolean | undefined;
}, {
    password: string;
    name: string;
    email: string;
    phone?: string | undefined;
    is_active?: boolean | undefined;
    is_admin?: boolean | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    is_admin: z.ZodOptional<z.ZodBoolean>;
    is_active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password?: string | undefined;
    phone?: string | undefined;
    is_active?: boolean | undefined;
    is_admin?: boolean | undefined;
}, {
    name: string;
    email: string;
    password?: string | undefined;
    phone?: string | undefined;
    is_active?: boolean | undefined;
    is_admin?: boolean | undefined;
}>;
export declare const userQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["admin", "user", "all"]>>;
    status: z.ZodOptional<z.ZodEnum<["active", "inactive", "all"]>>;
    page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    per_page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
}, "strip", z.ZodTypeAny, {
    role?: "user" | "all" | "admin" | undefined;
    search?: string | undefined;
    status?: "all" | "active" | "inactive" | undefined;
    page?: number | undefined;
    per_page?: number | undefined;
}, {
    role?: "user" | "all" | "admin" | undefined;
    search?: string | undefined;
    status?: "all" | "active" | "inactive" | undefined;
    page?: string | undefined;
    per_page?: string | undefined;
}>;
//# sourceMappingURL=user.validator.d.ts.map