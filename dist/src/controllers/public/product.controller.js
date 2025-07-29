"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicProductController = void 0;
const product_service_1 = require("@/services/product.service");
const response_util_1 = require("@/utils/response.util");
const helpers_util_1 = require("@/utils/helpers.util");
class PublicProductController {
    static async index(req, res) {
        try {
            const { page, perPage } = helpers_util_1.HelperUtil.getPaginationParams(req.query);
            const filters = {
                status: 'active',
            };
            if (req.query.search) {
                filters.search = req.query.search;
            }
            if (req.query.category_id) {
                filters.category_id = parseInt(req.query.category_id, 10);
            }
            if (req.query.brand_id) {
                filters.brand_id = parseInt(req.query.brand_id, 10);
            }
            if (req.query.min_price) {
                filters.min_price = parseFloat(req.query.min_price);
            }
            if (req.query.max_price) {
                filters.max_price = parseFloat(req.query.max_price);
            }
            if (req.query.is_featured === 'true') {
                filters.is_featured = true;
            }
            else if (req.query.is_featured === 'false') {
                filters.is_featured = false;
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
                current_price: helpers_util_1.HelperUtil.calculateDiscountedPrice(parseFloat(product.price.toString()), product.salePrice ? parseFloat(product.salePrice.toString()) : undefined),
                is_on_sale: helpers_util_1.HelperUtil.isOnSale(parseFloat(product.price.toString()), product.salePrice ? parseFloat(product.salePrice.toString()) : undefined),
                sku: product.sku,
                in_stock: product.inStock,
                stock_quantity: product.stockQuantity,
                is_featured: product.isFeatured,
                average_rating: parseFloat(product.averageRating.toString()),
                review_count: product.reviewCount,
                images: product.images || [],
                main_image: product.images?.[0] || null,
                weight: product.weight ? parseFloat(product.weight.toString()) : null,
                dimensions: product.dimensions,
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
    static async show(req, res) {
        try {
            const product = await product_service_1.ProductService.getProductById(req.params.id);
            if (!product || !product.isActive) {
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
                current_price: helpers_util_1.HelperUtil.calculateDiscountedPrice(parseFloat(product.price.toString()), product.salePrice ? parseFloat(product.salePrice.toString()) : undefined),
                is_on_sale: helpers_util_1.HelperUtil.isOnSale(parseFloat(product.price.toString()), product.salePrice ? parseFloat(product.salePrice.toString()) : undefined),
                sku: product.sku,
                in_stock: product.inStock,
                stock_quantity: product.stockQuantity,
                is_featured: product.isFeatured,
                average_rating: parseFloat(product.averageRating.toString()),
                review_count: product.reviewCount,
                view_count: product.viewCount,
                sales_count: product.salesCount,
                images: product.images || [],
                gallery: product.gallery || [],
                main_image: product.images?.[0] || null,
                weight: product.weight ? parseFloat(product.weight.toString()) : null,
                dimensions: product.dimensions,
                attributes: product.attributes,
                variations: product.variations,
                meta_title: product.metaTitle,
                meta_description: product.metaDescription,
                seo_keywords: product.seoKeywords || [],
                category: product.category ? {
                    id: product.category.id,
                    name: product.category.name,
                    slug: product.category.slug,
                    image: product.category.image,
                } : null,
                brand: product.brand ? {
                    id: product.brand.id,
                    name: product.brand.name,
                    slug: product.brand.slug,
                    logo: product.brand.logo,
                    website: product.brand.website,
                } : null,
                reviews: product.reviews?.map((review) => ({
                    id: review.id,
                    rating: review.rating,
                    title: review.title,
                    review: review.review,
                    images: review.images || [],
                    is_verified_purchase: review.isVerifiedPurchase,
                    helpful_count: review.helpfulCount,
                    user: {
                        id: review.user.id,
                        name: review.user.name,
                        avatar: review.user.avatar,
                    },
                    created_at: review.createdAt,
                })) || [],
                created_at: product.createdAt,
                updated_at: product.updatedAt,
            };
            response_util_1.ResponseUtil.success(res, formattedProduct);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
    static async featured(req, res) {
        try {
            const products = await product_service_1.ProductService.getFeaturedProducts();
            const formattedProducts = products.map((product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description,
                short_description: product.shortDescription,
                price: parseFloat(product.price.toString()),
                sale_price: product.salePrice ? parseFloat(product.salePrice.toString()) : null,
                current_price: helpers_util_1.HelperUtil.calculateDiscountedPrice(parseFloat(product.price.toString()), product.salePrice ? parseFloat(product.salePrice.toString()) : undefined),
                is_on_sale: helpers_util_1.HelperUtil.isOnSale(parseFloat(product.price.toString()), product.salePrice ? parseFloat(product.salePrice.toString()) : undefined),
                sku: product.sku,
                in_stock: product.inStock,
                average_rating: parseFloat(product.averageRating.toString()),
                review_count: product.reviewCount,
                images: product.images || [],
                main_image: product.images?.[0] || null,
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
            }));
            response_util_1.ResponseUtil.success(res, formattedProducts);
        }
        catch (error) {
            response_util_1.ResponseUtil.error(res, error.message, 500);
        }
    }
}
exports.PublicProductController = PublicProductController;
//# sourceMappingURL=product.controller.js.map