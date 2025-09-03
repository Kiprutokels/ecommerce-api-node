import prisma from '@/config/database';
import { hashPassword, comparePassword, generateToken } from '@/config/auth';
import { RegisterData, LoginData, AuthResponse } from '@/types/auth.types';
import redisClient from '@/config/redis';
import { CACHE_KEYS } from '@/utils/constants';

export class AuthService {
  static async register(data: RegisterData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        isAdmin: false,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isAdmin: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? undefined,
        is_admin: user.isAdmin,
        is_active: user.isActive,
      },
      token,
    };
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await comparePassword(data.password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is inactive. Please contact support.');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Clear user cache
    try {
      await redisClient.del(CACHE_KEYS.USER(user.id));
    } catch (error) {
      console.warn('Cache clear error:', error);
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? undefined,
        is_admin: user.isAdmin,
        is_active: user.isActive,
      },
      token,
    };
  }

  static async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isAdmin: true,
        isActive: true,
        avatar: true,
        preferences: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
