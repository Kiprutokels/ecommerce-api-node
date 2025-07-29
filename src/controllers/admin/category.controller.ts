// src/controllers/admin/category.controller.ts
import { Request, Response } from 'express';
import { CategoryService } from '@/services/category.service';
import { ResponseUtil } from '@/utils/response.util';
import { HelperUtil } from '@/utils/helpers.util';

export class AdminCategoryController {
  static async index(req: Request, res: Response): Promise<void> {
    try {
      const { page, perPage } = HelperUtil.getPaginationParams(req.query);
      const filters = {
        search: req.query.search as string,
        status: req.query.status as string,
      };

      const { categories, total } = await CategoryService.getCategoriesWithPagination(filters, page, perPage);

      const formattedCategories = categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        icon: category.icon,
        parent_id: category.parentId,
        sort_order: category.sortOrder,
        is_active: category.isActive,
        is_featured: category.isFeatured,
        meta_title: category.metaTitle,
        meta_description: category.metaDescription,
        product_count: category._count.products,
        parent: category.parent ? {
          id: category.parent.id,
          name: category.parent.name,
          slug: category.parent.slug,
        } : null,
        children: category.children?.map((child: any) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
        })) || [],
        created_at: category.createdAt,
        updated_at: category.updatedAt,
      }));

      ResponseUtil.paginated(res, formattedCategories, total, page, perPage);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async store(req: Request, res: Response): Promise<void> {
    try {
      const category = await CategoryService.createCategory(req.body);

      const formattedCategory = {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        icon: category.icon,
        parent_id: category.parentId,
        sort_order: category.sortOrder,
        is_active: category.isActive,
        is_featured: category.isFeatured,
        meta_title: category.metaTitle,
        meta_description: category.metaDescription,
        product_count: category._count.products,
        parent: category.parent ? {
          id: category.parent.id,
          name: category.parent.name,
          slug: category.parent.slug,
        } : null,
        children: category.children?.map((child: any) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
        })) || [],
        created_at: category.createdAt,
        updated_at: category.updatedAt,
      };

      ResponseUtil.success(res, formattedCategory, 'Category created successfully', 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 400);
    }
  }

  static async show(req: Request, res: Response): Promise<void> {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);

      if (!category) {
        ResponseUtil.error(res, 'Category not found', 404);
        return;
      }

      const formattedCategory = {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        icon: category.icon,
        parent_id: category.parentId,
        sort_order: category.sortOrder,
        is_active: category.isActive,
        is_featured: category.isFeatured,
        meta_title: category.metaTitle,
        meta_description: category.metaDescription,
        product_count: category._count.products,
        parent: category.parent ? {
          id: category.parent.id,
          name: category.parent.name,
          slug: category.parent.slug,
        } : null,
        children: category.children?.map((child: any) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
        })) || [],
        created_at: category.createdAt,
        updated_at: category.updatedAt,
      };

      ResponseUtil.success(res, formattedCategory);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);

      const formattedCategory = {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        icon: category.icon,
        parent_id: category.parentId,
        sort_order: category.sortOrder,
        is_active: category.isActive,
        is_featured: category.isFeatured,
        meta_title: category.metaTitle,
        meta_description: category.metaDescription,
        product_count: category._count.products,
        parent: category.parent ? {
          id: category.parent.id,
          name: category.parent.name,
          slug: category.parent.slug,
        } : null,
        children: category.children?.map((child: any) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
        })) || [],
        created_at: category.createdAt,
        updated_at: category.updatedAt,
      };

      ResponseUtil.success(res, formattedCategory, 'Category updated successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 400);
    }
  }

  static async destroy(req: Request, res: Response): Promise<void> {
    try {
      await CategoryService.deleteCategory(req.params.id);
      ResponseUtil.success(res, null, 'Category deleted successfully');
    } catch (error: any) {
      const statusCode = error.message.includes('Cannot delete') ? 422 : 500;
      ResponseUtil.error(res, error.message, statusCode);
    }
  }
}
