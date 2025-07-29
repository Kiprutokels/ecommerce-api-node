"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicCategoryController = void 0;
const category_service_1 = require("@/services/category.service");
const brand_service_1 = require("@/services/brand.service");
const response_util_1 = require("@/utils/response.util");
class PublicCategoryController {
    static async index(req, res) {
        try {
            const categories = await category_service_1.CategoryService.getActiveCategories();
            const formattedCategories = categories.map((category) => ({
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
                children: category.children?.map((child) => ({
                    id: child.id,
                    name: child.name,
                    slug: child.slug,
                    image: child.image,
                    icon: child.icon,
                    product_count: child._count?.products || 0,
                })) || [],
            }));
            response_util_1.ResponseUtil.success(res, formattedCategories);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
    static async brands(req, res) {
        try {
            const brands = await brand_service_1.BrandService.getActiveBrands();
            const formattedBrands = brands.map((brand) => ({
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                description: brand.description,
                logo: brand.logo,
                website: brand.website,
                sort_order: brand.sortOrder,
                product_count: brand._count.products,
            }));
            response_util_1.ResponseUtil.success(res, formattedBrands);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
}
exports.PublicCategoryController = PublicCategoryController;
//# sourceMappingURL=category.controller.js.map