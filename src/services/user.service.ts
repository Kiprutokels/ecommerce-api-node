import prisma from '@/config/database';
import { hashPassword } from '@/config/auth';
import redisClient from '@/config/redis';
import { CACHE_KEYS } from '@/utils/constants';

export class UserService {
  static async getAllUsers(filters: any, page: number, perPage: number) {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.role && filters.role !== 'all') {
      where.isAdmin = filters.role === 'admin';
    }

    if (filters.status && filters.status !== 'all') {
      where.isActive = filters.status === 'active';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isAdmin: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  static async createUser(data: any) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        isAdmin: data.is_admin || false,
        isActive: data.is_active !== false,
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
  }

  static async updateUser(id: string, data: any) {
    // Check if email is being updated and already exists
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id },
        },
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      isAdmin: data.is_admin,
      isActive: data.is_active,
    };

    // Hash password if provided
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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

    // Clear user cache
    try {
      await redisClient.del(CACHE_KEYS.USER(id));
    } catch (error) {
      console.warn('Cache clear error:', error);
    }

    return user;
  }

  static async deleteUser(id: string) {
    // Check if user has orders
    const orderCount = await prisma.order.count({
      where: { userId: id },
    });

    if (orderCount > 0) {
      throw new Error('Cannot delete user with existing orders');
    }

    await prisma.user.delete({
      where: { id },
    });

    // Clear user cache
    try {
      await redisClient.del(CACHE_KEYS.USER(id));
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
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
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlists: true,
          },
        },
      },
    });
  }
}
