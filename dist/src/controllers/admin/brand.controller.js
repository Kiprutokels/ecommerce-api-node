"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBrandController = void 0;
const brand_service_1 = require("@/services/brand.service");
const response_util_1 = require("@/utils/response.util");
const helpers_util_1 = require("@/utils/helpers.util");
class AdminBrandController {
    static async index(req, res) {
        try {
            const { page, perPage } = helpers_util_1.HelperUtil.getPaginationParams(req.query);
            const filters = {
                search: req.query.search,
            };
            const { brands, total } = await brand_service_1.BrandService.getBrandsWithPagination(filters, page, perPage);
            const formattedBrands = brands.map((brand) => ({
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                description: brand.description,
                logo: brand.logo,
                website: brand.website,
                is_active: brand.isActive,
                sort_order: brand.sortOrder,
                product_count: brand._count.products,
                created_at: brand.createdAt,
                updated_at: brand.updatedAt,
            }));
            response_util_1.ResponseUtil.paginated(res, formattedBrands, total, page, perPage);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
    static async store(req, res) {
        try {
            const brand = await brand_service_1.BrandService.createBrand(req.body);
            const formattedBrand = {
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                description: brand.description,
                logo: brand.logo,
                website: brand.website,
                is_active: brand.isActive,
                sort_order: brand.sortOrder,
                product_count: brand._count.products,
                created_at: brand.createdAt,
                updated_at: brand.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedBrand, 'Brand created successfully', 201);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 400);
        }
    }
}
exports.AdminBrandController = AdminBrandController;
//# sourceMappingURL=brand.controller.js.map