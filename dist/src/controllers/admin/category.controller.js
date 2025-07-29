"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCategoryController = void 0;
const category_service_1 = require("@/services/category.service");
const response_util_1 = require("@/utils/response.util");
const helpers_util_1 = require("@/utils/helpers.util");
class AdminCategoryController {
    static async index(req, res) {
        try {
            const { page, perPage } = helpers_util_1.HelperUtil.getPaginationParams(req.query);
            const filters = {
                search: req.query.search,
                status: req.query.status,
            };
            const { categories, total } = await category_service_1.CategoryService.getCategoriesWithPagination(filters, page, perPage);
            const formattedCategories = categories.map((category) => ({
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
                children: category.children?.map((child) => ({
                    id: child.id,
                    name: child.name,
                    slug: child.slug,
                })) || [],
                created_at: category.createdAt,
                updated_at: category.updatedAt,
            }));
            response_util_1.ResponseUtil.paginated(res, formattedCategories, total, page, perPage);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
    static async store(req, res) {
        try {
            const category = await category_service_1.CategoryService.createCategory(req.body);
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
                children: category.children?.map((child) => ({
                    id: child.id,
                    name: child.name,
                    slug: child.slug,
                })) || [],
                created_at: category.createdAt,
                updated_at: category.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedCategory, 'Category created successfully', 201);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 400);
        }
    }
    static async show(req, res) {
        try {
            const category = await category_service_1.CategoryService.getCategoryById(req.params.id);
            if (!category) {
                response_util_1.ResponseUtil.error(res, 'Category not found', 404);
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
                children: category.children?.map((child) => ({
                    id: child.id,
                    name: child.name,
                    slug: child.slug,
                })) || [],
                created_at: category.createdAt,
                updated_at: category.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedCategory);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
    static async update(req, res) {
        try {
            const category = await category_service_1.CategoryService.updateCategory(req.params.id, req.body);
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
                children: category.children?.map((child) => ({
                    id: child.id,
                    name: child.name,
                    slug: child.slug,
                })) || [],
                created_at: category.createdAt,
                updated_at: category.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedCategory, 'Category updated successfully');
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 400);
        }
    }
    static async destroy(req, res) {
        try {
            await category_service_1.CategoryService.deleteCategory(req.params.id);
            response_util_1.ResponseUtil.success(res, null, 'Category deleted successfully');
        }
        catch (error) {
            const statusCode = error.message.includes('Cannot delete') ? 422 : 500;
            response_util_1.ResponseUtil.error(res, error.message, statusCode);
        }
    }
}
exports.AdminCategoryController = AdminCategoryController;
//# sourceMappingURL=category.controller.js.map