import { z } from 'zod';
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    parent_id: z.ZodOptional<z.ZodString>;
    sort_order: z.ZodOptional<z.ZodNumber>;
    is_active: z.ZodOptional<z.ZodBoolean>;
    is_featured: z.ZodOptional<z.ZodBoolean>;
    meta_title: z.ZodOptional<z.ZodString>;
    meta_description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    slug?: string | undefined;
    image?: string | undefined;
    icon?: string | undefined;
    is_active?: boolean | undefined;
    is_featured?: boolean | undefined;
    meta_title?: string | undefined;
    meta_description?: string | undefined;
    parent_id?: string | undefined;
    sort_order?: number | undefined;
}, {
    name: string;
    description?: string | undefined;
    slug?: string | undefined;
    image?: string | undefined;
    icon?: string | undefined;
    is_active?: boolean | undefined;
    is_featured?: boolean | undefined;
    meta_title?: string | undefined;
    meta_description?: string | undefined;
    parent_id?: string | undefined;
    sort_order?: number | undefined;
}>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    icon: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parent_id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sort_order: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    is_active: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    is_featured: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    meta_title: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    meta_description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    image?: string | undefined;
    icon?: string | undefined;
    is_active?: boolean | undefined;
    is_featured?: boolean | undefined;
    meta_title?: string | undefined;
    meta_description?: string | undefined;
    parent_id?: string | undefined;
    sort_order?: number | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    image?: string | undefined;
    icon?: string | undefined;
    is_active?: boolean | undefined;
    is_featured?: boolean | undefined;
    meta_title?: string | undefined;
    meta_description?: string | undefined;
    parent_id?: string | undefined;
    sort_order?: number | undefined;
}>;
export declare const categoryQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["active", "inactive", "all"]>>;
    featured: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
    page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    per_page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    status?: "all" | "active" | "inactive" | undefined;
    page?: number | undefined;
    per_page?: number | undefined;
    featured?: boolean | undefined;
}, {
    search?: string | undefined;
    status?: "all" | "active" | "inactive" | undefined;
    page?: string | undefined;
    per_page?: string | undefined;
    featured?: string | undefined;
}>;
//# sourceMappingURL=category.validator.d.ts.map