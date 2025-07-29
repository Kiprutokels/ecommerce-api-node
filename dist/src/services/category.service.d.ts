export declare class CategoryService {
    static getAllCategories(filters?: any): Promise<({
        _count: {
            products: number;
        };
        parent: {
            name: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            image: string | null;
            icon: string | null;
            parentId: string | null;
            sortOrder: number;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
        } | null;
        children: {
            name: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            image: string | null;
            icon: string | null;
            parentId: string | null;
            sortOrder: number;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        image: string | null;
        icon: string | null;
        parentId: string | null;
        sortOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
    })[]>;
    static getCategoriesWithPagination(filters: any, page: number, perPage: number): Promise<{
        categories: ({
            _count: {
                products: number;
            };
            parent: {
                name: string;
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                image: string | null;
                icon: string | null;
                parentId: string | null;
                sortOrder: number;
                isFeatured: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
            } | null;
            children: {
                name: string;
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                image: string | null;
                icon: string | null;
                parentId: string | null;
                sortOrder: number;
                isFeatured: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
            }[];
        } & {
            name: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            image: string | null;
            icon: string | null;
            parentId: string | null;
            sortOrder: number;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
        })[];
        total: number;
    }>;
    static getCategoryById(id: string): Promise<({
        _count: {
            products: number;
        };
        parent: {
            name: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            image: string | null;
            icon: string | null;
            parentId: string | null;
            sortOrder: number;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
        } | null;
        children: {
            name: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            image: string | null;
            icon: string | null;
            parentId: string | null;
            sortOrder: number;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        image: string | null;
        icon: string | null;
        parentId: string | null;
        sortOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
    }) | null>;
    static createCategory(data: any): Promise<{
        _count: {
            products: number;
        };
        parent: {
            name: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            image: string | null;
            icon: string | null;
            parentId: string | null;
            sortOrder: number;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
        } | null;
        children: {
            name: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            image: string | null;
            icon: string | null;
            parentId: string | null;
            sortOrder: number;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        image: string | null;
        icon: string | null;
        parentId: string | null;
        sortOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    static updateCategory(id: string, data: any): Promise<{
        _count: {
            products: number;
        };
        parent: {
            name: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            image: string | null;
            icon: string | null;
            parentId: string | null;
            sortOrder: number;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
        } | null;
        children: {
            name: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            image: string | null;
            icon: string | null;
            parentId: string | null;
            sortOrder: number;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        image: string | null;
        icon: string | null;
        parentId: string | null;
        sortOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    static deleteCategory(id: string): Promise<void>;
    static getActiveCategories(): Promise<any>;
}
//# sourceMappingURL=category.service.d.ts.map