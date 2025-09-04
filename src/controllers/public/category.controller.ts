import { Request, Response } from 'express';
import { CategoryService } from '@/services/category.service';
import { BrandService } from '@/services/brand.service';
import { ResponseUtil } from '@/utils/response.util';

export class PublicCategoryController {
  static async index(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryService.getActiveCategories();
      
      const formattedCategories = categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        icon: category.icon,
        parent_id: category.parentId,
        sort_order: category.sortOrder,
        is_featured: category.isFeatured,
        product_count: category._count.products,
        children: category.children?.map((child: any) => ({
          id: child.id,
          name: child.name,
          slug: child.slug,
          image: child.image,
          icon: child.icon,
          product_count: child._count?.products || 0,
        })) || [],
      }));

      ResponseUtil.success(res, formattedCategories);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async brands(req: Request, res: Response): Promise<void> {
    try {
      const brands = await BrandService.getActiveBrands();
      
      const formattedBrands = brands.map((brand: any) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logo: brand.logo,
        website: brand.website,
        sort_order: brand.sortOrder,
        product_count: brand._count.products,
      }));

      ResponseUtil.success(res, formattedBrands);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }
}
