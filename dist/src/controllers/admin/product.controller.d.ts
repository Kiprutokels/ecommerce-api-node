import { Request, Response } from 'express';
export declare class AdminProductController {
    static index(req: Request, res: Response): Promise<void>;
    static store(req: Request, res: Response): Promise<void>;
    static show(req: Request, res: Response): Promise<void>;
    static update(req: Request, res: Response): Promise<void>;
    static destroy(req: Request, res: Response): Promise<void>;
    static bulkUpdate(req: Request, res: Response): Promise<void>;
    static duplicate(req: Request, res: Response): Promise<void>;
    static stats(req: Request, res: Response): Promise<void>;
    static export(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=product.controller.d.ts.map