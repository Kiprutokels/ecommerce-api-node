import { z } from 'zod';
export declare const registerSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    password_confirmation: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    password: string;
    name: string;
    email: string;
    password_confirmation: string;
    phone?: string | undefined;
}, {
    password: string;
    name: string;
    email: string;
    password_confirmation: string;
    phone?: string | undefined;
}>, {
    password: string;
    name: string;
    email: string;
    password_confirmation: string;
    phone?: string | undefined;
}, {
    password: string;
    name: string;
    email: string;
    password_confirmation: string;
    phone?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
}, {
    password: string;
    email: string;
}>;
//# sourceMappingURL=auth.validator.d.ts.map