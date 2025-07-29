import { SignOptions } from 'jsonwebtoken';
import { TokenPayload } from '@/types/jwt';
export declare const JWT_SECRET: string;
export declare const JWT_EXPIRES_IN: SignOptions["expiresIn"];
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hash: string) => Promise<boolean>;
export declare const generateToken: (payload: object) => string;
export declare const verifyToken: (token: string) => TokenPayload;
//# sourceMappingURL=auth.d.ts.map