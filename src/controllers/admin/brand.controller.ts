import { Request, Response } from "express";
import { BrandService } from "@/services/brand.service";
import { ResponseUtil } from "@/utils/response.util";
import { HelperUtil } from "@/utils/helpers.util";

export class AdminBrandController {
  static async index(req: Request, res: Response): Promise<void> {
    try {
      const { page, perPage } = HelperUtil.getPaginationParams(req.query);
      const filters = {
        search: req.query.search as string,
        status: req.query.status as string,
      };

      const { brands, total } = await BrandService.getBrandsWithPagination(
        filters,
        page,
        perPage
      );

      const formattedBrands = brands.map((brand: any) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logo: brand.logo,
        website: brand.website,
        is_active: brand.isActive,
        isActive: brand.isActive,
        sort_order: brand.sortOrder,
        sortOrder: brand.sortOrder,
        product_count: brand._count.products,
        created_at: brand.createdAt,
        updated_at: brand.updatedAt,
      }));

      ResponseUtil.paginated(res, formattedBrands, total, page, perPage);
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const brand = await BrandService.getBrandById(id);

      if (!brand) {
        ResponseUtil.error(res, "Brand not found", 404);
        return;
      }

      const formattedBrand = {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logo: brand.logo,
        website: brand.website,
        is_active: brand.isActive,
        isActive: brand.isActive,
        sort_order: brand.sortOrder,
        sortOrder: brand.sortOrder,
        product_count: brand._count?.products || 0,
        created_at: brand.createdAt,
        updated_at: brand.updatedAt,
      };

      ResponseUtil.success(res, formattedBrand, "Brand retrieved successfully");
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 500);
    }
  }

  static async store(req: Request, res: Response): Promise<void> {
    try {
      const brand = await BrandService.createBrand(req.body);

      const formattedBrand = {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logo: brand.logo,
        website: brand.website,
        is_active: brand.isActive,
        isActive: brand.isActive,
        sort_order: brand.sortOrder,
        sortOrder: brand.sortOrder,
        product_count: brand._count?.products || 0,
        created_at: brand.createdAt,
        updated_at: brand.updatedAt,
      };

      ResponseUtil.success(
        res,
        formattedBrand,
        "Brand created successfully",
        201
      );
    } catch (error: any) {
      ResponseUtil.error(res, error.message, 400);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const brand = await BrandService.updateBrand(id, req.body);

      const formattedBrand = {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logo: brand.logo,
        website: brand.website,
        is_active: brand.isActive,
        isActive: brand.isActive,
        sort_order: brand.sortOrder,
        sortOrder: brand.sortOrder,
        product_count: brand._count?.products || 0,
        created_at: brand.createdAt,
        updated_at: brand.updatedAt,
      };

      ResponseUtil.success(res, formattedBrand, "Brand updated successfully");
    } catch (error: any) {
      if (error.message === "Brand not found") {
        ResponseUtil.error(res, error.message, 404);
      } else {
        ResponseUtil.error(res, error.message, 400);
      }
    }
  }

  static async destroy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await BrandService.deleteBrand(id);
      ResponseUtil.success(res, null, "Brand deleted successfully");
    } catch (error: any) {
      if (error.message === "Brand not found") {
        ResponseUtil.error(res, error.message, 404);
      } else if (error.message.includes("products associated")) {
        ResponseUtil.error(res, error.message, 400);
      } else {
        ResponseUtil.error(res, error.message, 500);
      }
    }
  }
}
