import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/types/common.types';
export declare class AuthController {
    static register(req: Request, res: Response): Promise<void>;
    static login(req: Request, res: Response): Promise<void>;
    static logout(req: AuthenticatedRequest, res: Response): Promise<void>;
    static me(req: AuthenticatedRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map