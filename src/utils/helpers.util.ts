
export class HelperUtil {
  static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static generateSKU(prefix: string = 'PRD'): string {
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}-${random}`;
  }

  static generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${year}-${random}`;
  }

  static calculateDiscountedPrice(price: number, salePrice?: number): number {
    return salePrice && salePrice < price ? salePrice : price;
  }

  static isOnSale(price: number, salePrice?: number): boolean {
    return salePrice !== null && salePrice !== undefined && salePrice < price;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static sanitizeObject(obj: any, allowedFields: string[]): any {
    const sanitized: any = {};
    allowedFields.forEach(field => {
      if (obj[field] !== undefined) {
        sanitized[field] = obj[field];
      }
    });
    return sanitized;
  }

  static getPaginationParams(query: any) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const perPage = Math.min(100, Math.max(1, parseInt(query.per_page) || 15));
    const skip = (page - 1) * perPage;
    
    return { page, perPage, skip };
  }

  static getSortParams(query: any, allowedFields: string[] = []) {
    const sortBy = allowedFields.includes(query.sort_by) ? query.sort_by : 'createdAt';
    const sortDirection = query.sort_direction === 'asc' ? 'asc' : 'desc';
    
    return { [sortBy]: sortDirection };
  }
}
