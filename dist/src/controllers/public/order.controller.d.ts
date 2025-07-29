import { Response } from 'express';
import { AuthenticatedRequest } from '@/types/common.types';
export declare class PublicOrderController {
    static index(req: AuthenticatedRequest, res: Response): Promise<void>;
    static store(req: AuthenticatedRequest, res: Response): Promise<void>;
    static show(req: AuthenticatedRequest, res: Response): Promise<void>;
    static cancel(req: AuthenticatedRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=order.controller.d.ts.map