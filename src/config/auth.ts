import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { TokenPayload } from '@/types/jwt';

export const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
export const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded === 'string' || !('userId' in decoded)) {
    throw new Error('Invalid token payload');
  }
  return decoded as TokenPayload;
};
