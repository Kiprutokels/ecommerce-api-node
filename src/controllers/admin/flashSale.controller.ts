import { Request, Response } from 'express';
import { ResponseUtil } from '@/utils/response.util';
import { HelperUtil } from '@/utils/helpers.util';
import prisma from '@/config/database';

export class AdminFlashSaleController {
  static async index(req: Request, res: Response): Promise<void> {
    try {
      const { page, perPage } = HelperUtil.getPaginationParams(req.query);
      
      const [flashSales, total] = await Promise.all([
        prisma.flashSale.findMany({
          include: {
            products: {
              include: {
                product: {
                  select: { id: true, name: true, images: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * perPage,
          take: perPage,
        }),
        prisma.flashSale.count(),
      ]);

      ResponseUtil.paginated(res, flashSales, total, page, perPage);
    } catch (error: any) {
      console.error('Admin flash sales index error:', error);
      ResponseUtil.error(res, error.message || 'Failed to fetch flash sales', 500);
    }
  }

static async store(req: Request, res: Response): Promise<void> {
  try {
    const {
      title,
      description,
      start_date,
      end_date,
      discount_percent,
      banner_image,
      priority,
      product_ids // Array of product IDs instead of full product objects
    } = req.body;

    const flashSale = await prisma.flashSale.create({
      data: {
        title,
        description,
        startDate: new Date(start_date),
        endDate: new Date(end_date),
        discountPercent: discount_percent,
        bannerImage: banner_image,
        priority: priority || 0,
      }
    });

    // If products are provided, add them with calculated prices
    if (product_ids && product_ids.length > 0) {
      // Get products to calculate sale prices
      const products = await prisma.product.findMany({
        where: { id: { in: product_ids } },
        select: { id: true, price: true, salePrice: true }
      });

      const flashSaleProducts = products.map(product => {
        const originalPrice = Number(product.salePrice ?? product.price);
        const salePrice = originalPrice * (1 - discount_percent / 100);
        
        return {
          flashSaleId: flashSale.id,
          productId: product.id,
          originalPrice: originalPrice,
          salePrice: salePrice,
        };
      });

      await prisma.flashSaleProduct.createMany({
        data: flashSaleProducts
      });
    }

    // Return flash sale with products
    const completeFlashSale = await prisma.flashSale.findUnique({
      where: { id: flashSale.id },
      include: {
        products: {
          include: {
            product: {
              select: { id: true, name: true, images: true, price: true, salePrice: true }
            }
          }
        }
      }
    });

    ResponseUtil.success(res, completeFlashSale, 'Flash sale created successfully', 201);
  } catch (error: any) {
    console.error('Flash sale creation error:', error);
    ResponseUtil.error(res, error.message || 'Failed to create flash sale', 500);
  }
}


  static async show(req: Request, res: Response): Promise<void> {
    try {
      const flashSale = await prisma.flashSale.findUnique({
        where: { id: req.params.id },
        include: {
          products: {
            include: {
              product: true
            }
          }
        }
      });

      if (!flashSale) {
        ResponseUtil.error(res, 'Flash sale not found', 404);
        return;
      }

      ResponseUtil.success(res, flashSale);
    } catch (error: any) {
      console.error('Flash sale show error:', error);
      ResponseUtil.error(res, error.message || 'Failed to fetch flash sale', 500);
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        description,
        start_date,
        end_date,
        discount_percent,
        banner_image,
        priority,
        is_active
      } = req.body;

      const flashSale = await prisma.flashSale.update({
        where: { id: req.params.id },
        data: {
          title,
          description,
          startDate: start_date ? new Date(start_date) : undefined,
          endDate: end_date ? new Date(end_date) : undefined,
          discountPercent: discount_percent,
          bannerImage: banner_image,
          priority,
          isActive: is_active,
        },
        include: {
          products: {
            include: {
              product: true
            }
          }
        }
      });

      ResponseUtil.success(res, flashSale, 'Flash sale updated successfully');
    } catch (error: any) {
      console.error('Flash sale update error:', error);
      ResponseUtil.error(res, error.message || 'Failed to update flash sale', 500);
    }
  }

  static async destroy(req: Request, res: Response): Promise<void> {
    try {
      await prisma.flashSale.delete({
        where: { id: req.params.id }
      });

      ResponseUtil.success(res, null, 'Flash sale deleted successfully');
    } catch (error: any) {
      console.error('Flash sale deletion error:', error);
      ResponseUtil.error(res, error.message || 'Failed to delete flash sale', 500);
    }
  }

static async addProduct(req: Request, res: Response): Promise<void> {
  try {
    const { product_id, stock_limit } = req.body;
    const flashSaleId = req.params.id;

    // Get flash sale discount percentage
    const flashSale = await prisma.flashSale.findUnique({
      where: { id: flashSaleId },
      select: { discountPercent: true }
    });

    if (!flashSale) {
      ResponseUtil.error(res, 'Flash sale not found', 404);
      return;
    }

    // Get product price
    const product = await prisma.product.findUnique({
      where: { id: product_id },
      select: { price: true, salePrice: true }
    });

    if (!product) {
      ResponseUtil.error(res, 'Product not found', 404);
      return;
    }

    const originalPrice = Number(product.salePrice ?? product.price);
    const salePrice = originalPrice * (1 - flashSale.discountPercent / 100);

    const flashSaleProduct = await prisma.flashSaleProduct.create({
      data: {
        flashSaleId,
        productId: product_id,
        originalPrice: originalPrice,
        salePrice: salePrice,
        stockLimit: stock_limit,
      },
      include: {
        product: {
          select: { id: true, name: true, images: true, price: true, salePrice: true }
        }
      }
    });

    ResponseUtil.success(res, flashSaleProduct, 'Product added to flash sale successfully', 201);
  } catch (error: any) {
    console.error('Add product to flash sale error:', error);
    ResponseUtil.error(res, error.message || 'Failed to add product to flash sale', 500);
  }
}

  static async removeProduct(req: Request, res: Response): Promise<void> {
    try {
      await prisma.flashSaleProduct.delete({
        where: {
          flashSaleId_productId: {
            flashSaleId: req.params.id,
            productId: req.params.productId
          }
        }
      });

      ResponseUtil.success(res, null, 'Product removed from flash sale successfully');
    } catch (error: any) {
      console.error('Remove product from flash sale error:', error);
      ResponseUtil.error(res, error.message || 'Failed to remove product from flash sale', 500);
    }
  }
}