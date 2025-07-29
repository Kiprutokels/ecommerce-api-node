import { Response } from 'express';
export declare class ResponseUtil {
    static success<T>(res: Response, data: T, message?: string, statusCode?: number): Response;
    static error(res: Response, message?: string, statusCode?: number, errors?: any): Response;
    static paginated<T>(res: Response, data: T[], total: number, page: number, perPage: number, message?: string): Response;
}
//# sourceMappingURL=response.util.d.ts.map