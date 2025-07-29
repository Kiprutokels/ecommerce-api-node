export declare class BrandService {
    static getAllBrands(filters?: any): Promise<({
        _count: {
            products: number;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        sortOrder: number;
        logo: string | null;
        website: string | null;
    })[]>;
    static getBrandsWithPagination(filters: any, page: number, perPage: number): Promise<{
        brands: ({
            _count: {
                products: number;
            };
        } & {
            name: string;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            sortOrder: number;
            logo: string | null;
            website: string | null;
        })[];
        total: number;
    }>;
    static createBrand(data: any): Promise<{
        _count: {
            products: number;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        sortOrder: number;
        logo: string | null;
        website: string | null;
    }>;
    static getActiveBrands(): Promise<any>;
}
//# sourceMappingURL=brand.service.d.ts.map