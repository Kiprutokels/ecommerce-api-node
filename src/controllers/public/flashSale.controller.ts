import { Request, Response } from 'express';
import { FlashSaleService } from '@/services/flashSale.service';
import { ResponseUtil } from '@/utils/response.util';
import { HelperUtil } from '@/utils/helpers.util';

export class PublicFlashSaleController {
  static async index(req: Request, res: Response): Promise<void> {
    try {
      const flashSales = await FlashSaleService.getActiveFlashSales();

      const formattedFlashSales = flashSales.map((flashSale: any) => ({
        id: flashSale.id,
        title: flashSale.title,
        description: flashSale.description,
        start_date: flashSale.startDate,
        end_date: flashSale.endDate,
        discount_percent: flashSale.discountPercent,
        banner_image: flashSale.bannerImage,
        products: flashSale.products.map((item: any) => ({
          id: item.id,
          original_price: parseFloat(item.originalPrice.toString()),
          sale_price: parseFloat(item.salePrice.toString()),
          stock_limit: item.stockLimit,
          sold_count: item.soldCount,
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            images: item.product.images || [],
            main_image: item.product.images?.[0] || null,
            average_rating: parseFloat(item.product.averageRating?.toString() || '0'),
            review_count: item.product.reviewCount || 0,
            category: item.product.category ? {
              id: item.product.category.id,
              name: item.product.category.name,
              slug: item.product.category.slug,
            } : null,
            brand: item.product.brand ? {
              id: item.product.brand.id,
              name: item.product.brand.name,
              slug: item.product.brand.slug,
            } : null,
          },
        })),
      }));

      ResponseUtil.success(res, formattedFlashSales);
    } catch (error: any) {
      console.error('Flash sales index error:', error);
      ResponseUtil.error(res, error.message || 'Failed to fetch flash sales', 500);
    }
  }

  static async show(req: Request, res: Response): Promise<void> {
    try {
      const { page, perPage } = HelperUtil.getPaginationParams(req.query);
      const { products, total } = await FlashSaleService.getFlashSaleProducts(
        req.params.id,
        page,
        perPage
      );

      const formattedProducts = products.map((item: any) => ({
        id: item.id,
        original_price: parseFloat(item.originalPrice.toString()),
        sale_price: parseFloat(item.salePrice.toString()),
        discount_percent: Math.round(
          ((parseFloat(item.originalPrice.toString()) - parseFloat(item.salePrice.toString())) /
            parseFloat(item.originalPrice.toString())) * 100
        ),
        stock_limit: item.stockLimit,
        sold_count: item.soldCount,
        availability: item.stockLimit ? item.stockLimit - item.soldCount : null,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          description: item.product.description,
          short_description: item.product.shortDescription,
          images: item.product.images || [],
          main_image: item.product.images?.[0] || null,
          average_rating: parseFloat(item.product.averageRating?.toString() || '0'),
          review_count: item.product.reviewCount || 0,
          in_stock: item.product.inStock,
          category: item.product.category ? {
            id: item.product.category.id,
            name: item.product.category.name,
            slug: item.product.category.slug,
          } : null,
          brand: item.product.brand ? {
            id: item.product.brand.id,
            name: item.product.brand.name,
            slug: item.product.brand.slug,
          } : null,
        },
        flash_sale: {
          id: item.flashSale.id,
          title: item.flashSale.title,
          end_date: item.flashSale.endDate,
        },
      }));

      ResponseUtil.paginated(res, formattedProducts, total, page, perPage);
    } catch (error: any) {
      console.error('Flash sale products error:', error);
      ResponseUtil.error(res, error.message || 'Failed to fetch flash sale products', 500);
    }
  }
}
