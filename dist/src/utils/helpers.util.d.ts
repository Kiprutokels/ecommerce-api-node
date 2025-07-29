export declare class HelperUtil {
    static generateSlug(text: string): string;
    static generateSKU(prefix?: string): string;
    static generateOrderNumber(): string;
    static calculateDiscountedPrice(price: number, salePrice?: number): number;
    static isOnSale(price: number, salePrice?: number): boolean;
    static validateEmail(email: string): boolean;
    static sanitizeObject(obj: any, allowedFields: string[]): any;
    static getPaginationParams(query: any): {
        page: number;
        perPage: number;
        skip: number;
    };
    static getSortParams(query: any, allowedFields?: string[]): {
        [x: number]: string;
    };
}
//# sourceMappingURL=helpers.util.d.ts.map