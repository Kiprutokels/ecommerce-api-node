"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProductController = void 0;
const product_service_1 = require("@/services/product.service");
const response_util_1 = require("@/utils/response.util");
const helpers_util_1 = require("@/utils/helpers.util");
class AdminProductController {
    static async index(req, res) {
        try {
            const { page, perPage } = helpers_util_1.HelperUtil.getPaginationParams(req.query);
            const filters = {};
            if (req.query.search) {
                filters.search = req.query.search;
            }
            if (req.query.category_id) {
                filters.category_id = parseInt(req.query.category_id, 10);
            }
            if (req.query.brand_id) {
                filters.brand_id = parseInt(req.query.brand_id, 10);
            }
            if (req.query.status) {
                filters.status = req.query.status;
            }
            if (req.query.stock_status) {
                filters.stock_status = req.query.stock_status;
            }
            const { products, total } = await product_service_1.ProductService.getAllProducts(filters, page, perPage);
            const formattedProducts = products.map((product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                short_description: product.shortDescription,
                price: parseFloat(product.price.toString()),
                sale_price: product.salePrice ? parseFloat(product.salePrice.toString()) : null,
                cost_price: product.costPrice ? parseFloat(product.costPrice.toString()) : null,
                current_price: helpers_util_1.HelperUtil.calculateDiscountedPrice(parseFloat(product.price.toString()), product.salePrice ? parseFloat(product.salePrice.toString()) : undefined),
                is_on_sale: helpers_util_1.HelperUtil.isOnSale(parseFloat(product.price.toString()), product.salePrice ? parseFloat(product.salePrice.toString()) : undefined),
                sku: product.sku,
                barcode: product.barcode,
                stock_quantity: product.stockQuantity,
                low_stock_threshold: product.lowStockThreshold,
                manage_stock: product.manageStock,
                in_stock: product.inStock,
                is_active: product.isActive,
                is_featured: product.isFeatured,
                is_digital: product.isDigital,
                images: product.images || [],
                gallery: product.gallery || [],
                main_image: product.images?.[0] || null,
                weight: product.weight ? parseFloat(product.weight.toString()) : null,
                dimensions: product.dimensions,
                status: product.status,
                attributes: product.attributes,
                variations: product.variations,
                average_rating: parseFloat(product.averageRating.toString()),
                review_count: product.reviewCount,
                view_count: product.viewCount,
                sales_count: product.salesCount,
                meta_title: product.metaTitle,
                meta_description: product.metaDescription,
                seo_keywords: product.seoKeywords || [],
                category: product.category ? {
                    id: product.category.id,
                    name: product.category.name,
                    slug: product.category.slug,
                } : null,
                brand: product.brand ? {
                    id: product.brand.id,
                    name: product.brand.name,
                    slug: product.brand.slug,
                    logo: product.brand.logo,
                } : null,
                created_at: product.createdAt,
                updated_at: product.updatedAt,
            }));
            response_util_1.ResponseUtil.paginated(res, formattedProducts, total, page, perPage);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
    static async store(req, res) {
        try {
            const product = await product_service_1.ProductService.createProduct(req.body);
            const formattedProduct = {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                short_description: product.shortDescription,
                price: parseFloat(product.price.toString()),
                sale_price: product.salePrice ? parseFloat(product.salePrice.toString()) : null,
                cost_price: product.costPrice ? parseFloat(product.costPrice.toString()) : null,
                sku: product.sku,
                barcode: product.barcode,
                stock_quantity: product.stockQuantity,
                low_stock_threshold: product.lowStockThreshold,
                manage_stock: product.manageStock,
                in_stock: product.inStock,
                is_active: product.isActive,
                is_featured: product.isFeatured,
                is_digital: product.isDigital,
                images: product.images || [],
                gallery: product.gallery || [],
                weight: product.weight ? parseFloat(product.weight.toString()) : null,
                dimensions: product.dimensions,
                status: product.status,
                attributes: product.attributes,
                variations: product.variations,
                meta_title: product.metaTitle,
                meta_description: product.metaDescription,
                seo_keywords: product.seoKeywords || [],
                category: product.category ? {
                    id: product.category.id,
                    name: product.category.name,
                    slug: product.category.slug,
                } : null,
                brand: product.brand ? {
                    id: product.brand.id,
                    name: product.brand.name,
                    slug: product.brand.slug,
                    logo: product.brand.logo,
                } : null,
                created_at: product.createdAt,
                updated_at: product.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedProduct, 'Product created successfully', 201);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 400);
        }
    }
    static async show(req, res) {
        try {
            const product = await product_service_1.ProductService.getProductById(req.params.id);
            if (!product) {
                response_util_1.ResponseUtil.error(res, 'Product not found', 404);
                return;
            }
            const formattedProduct = {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                short_description: product.shortDescription,
                price: parseFloat(product.price.toString()),
                sale_price: product.salePrice ? parseFloat(product.salePrice.toString()) : null,
                cost_price: product.costPrice ? parseFloat(product.costPrice.toString()) : null,
                sku: product.sku,
                barcode: product.barcode,
                stock_quantity: product.stockQuantity,
                low_stock_threshold: product.lowStockThreshold,
                manage_stock: product.manageStock,
                in_stock: product.inStock,
                is_active: product.isActive,
                is_featured: product.isFeatured,
                is_digital: product.isDigital,
                images: product.images || [],
                gallery: product.gallery || [],
                weight: product.weight ? parseFloat(product.weight.toString()) : null,
                dimensions: product.dimensions,
                status: product.status,
                attributes: product.attributes,
                variations: product.variations,
                average_rating: parseFloat(product.averageRating.toString()),
                review_count: product.reviewCount,
                view_count: product.viewCount,
                sales_count: product.salesCount,
                meta_title: product.metaTitle,
                meta_description: product.metaDescription,
                seo_keywords: product.seoKeywords || [],
                category: product.category ? {
                    id: product.category.id,
                    name: product.category.name,
                    slug: product.category.slug,
                } : null,
                brand: product.brand ? {
                    id: product.brand.id,
                    name: product.brand.name,
                    slug: product.brand.slug,
                    logo: product.brand.logo,
                } : null,
                created_at: product.createdAt,
                updated_at: product.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedProduct);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
    static async update(req, res) {
        try {
            const product = await product_service_1.ProductService.updateProduct(req.params.id, req.body);
            const formattedProduct = {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                short_description: product.shortDescription,
                price: parseFloat(product.price.toString()),
                sale_price: product.salePrice ? parseFloat(product.salePrice.toString()) : null,
                cost_price: product.costPrice ? parseFloat(product.costPrice.toString()) : null,
                sku: product.sku,
                barcode: product.barcode,
                stock_quantity: product.stockQuantity,
                low_stock_threshold: product.lowStockThreshold,
                manage_stock: product.manageStock,
                in_stock: product.inStock,
                is_active: product.isActive,
                is_featured: product.isFeatured,
                is_digital: product.isDigital,
                images: product.images || [],
                gallery: product.gallery || [],
                weight: product.weight ? parseFloat(product.weight.toString()) : null,
                dimensions: product.dimensions,
                status: product.status,
                attributes: product.attributes,
                variations: product.variations,
                meta_title: product.metaTitle,
                meta_description: product.metaDescription,
                seo_keywords: product.seoKeywords || [],
                category: product.category ? {
                    id: product.category.id,
                    name: product.category.name,
                    slug: product.category.slug,
                } : null,
                brand: product.brand ? {
                    id: product.brand.id,
                    name: product.brand.name,
                    slug: product.brand.slug,
                    logo: product.brand.logo,
                } : null,
                created_at: product.createdAt,
                updated_at: product.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedProduct, 'Product updated successfully');
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 400);
        }
    }
    static async destroy(req, res) {
        try {
            await product_service_1.ProductService.deleteProduct(req.params.id);
            response_util_1.ResponseUtil.success(res, null, 'Product deleted successfully');
        }
        catch (error) {
            const statusCode = error.message.includes('Cannot delete') ? 422 : 500;
            response_util_1.ResponseUtil.error(res, error.message, statusCode);
        }
    }
    static async bulkUpdate(req, res) {
        try {
            await product_service_1.ProductService.bulkUpdateProducts(req.body.product_ids, req.body.action, req.body);
            response_util_1.ResponseUtil.success(res, null, `Products ${req.body.action}d successfully`);
        }
        catch (error) {
            const statusCode = error.message.includes('cannot be deleted') ? 422 : 500;
            response_util_1.ResponseUtil.error(res, error.message, statusCode);
        }
    }
    static async duplicate(req, res) {
        try {
            const product = await product_service_1.ProductService.duplicateProduct(req.params.id);
            const formattedProduct = {
                id: product.id,
                name: product.name,
                slug: product.slug,
                sku: product.sku,
                price: parseFloat(product.price.toString()),
                is_active: product.isActive,
                category: product.category ? {
                    id: product.category.id,
                    name: product.category.name,
                } : null,
                brand: product.brand ? {
                    id: product.brand.id,
                    name: product.brand.name,
                } : null,
                created_at: product.createdAt,
            };
            response_util_1.ResponseUtil.success(res, formattedProduct, 'Product duplicated successfully', 201);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 400);
        }
    }
    static async stats(req, res) {
        try {
            const stats = await product_service_1.ProductService.getProductStats();
            response_util_1.ResponseUtil.success(res, stats, 'Product stats retrieved successfully');
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
    static async export(req, res) {
        try {
            const filters = {};
            if (req.query.category_id) {
                filters.category_id = parseInt(req.query.category_id, 10);
            }
            if (req.query.brand_id) {
                filters.brand_id = parseInt(req.query.brand_id, 10);
            }
            const { products } = await product_service_1.ProductService.getAllProducts(filters, 1, 10000);
            const exportData = products.map((product) => ({
                ID: product.id,
                Name: product.name,
                SKU: product.sku,
                Price: parseFloat(product.price.toString()),
                'Sale Price': product.salePrice ? parseFloat(product.salePrice.toString()) : '',
                Stock: product.stockQuantity,
                Category: product.category?.name || '',
                Brand: product.brand?.name || '',
                Status: product.isActive ? 'Active' : 'Inactive',
                Created: product.createdAt.toISOString().split('T')[0],
            }));
            const exportResult = {
                filename: `products-export-${new Date().toISOString().split('T')[0]}.csv`,
                data: exportData,
                count: exportData.length,
            };
            response_util_1.ResponseUtil.success(res, exportResult, 'Products exported successfully');
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
}
exports.AdminProductController = AdminProductController;
//# sourceMappingURL=product.controller.js.map