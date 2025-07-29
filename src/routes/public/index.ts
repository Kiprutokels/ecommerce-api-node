// src/routes/public/index.ts
import { Router } from 'express';
import { PublicCategoryController } from '@/controllers/public/category.controller';
import { PublicProductController } from '@/controllers/public/product.controller';
import { PublicOrderController } from '@/controllers/public/order.controller';
import { validateBody, validateQuery } from '@/middleware/validation.middleware';
import { authenticate } from '@/middleware/auth.middleware';
import { productQuerySchema } from '@/validators/product.validator';
import { createOrderSchema, orderQuerySchema } from '@/validators/order.validator';

const router = Router();

// Categories & Brands
router.get('/categories', PublicCategoryController.index);
router.get('/brands', PublicCategoryController.brands);

// Products
router.get('/products', validateQuery(productQuerySchema), PublicProductController.index);
router.get('/products/featured', PublicProductController.featured);
router.get('/products/:id', PublicProductController.show);

// Orders (requires authentication)
router.get('/orders', authenticate, validateQuery(orderQuerySchema), PublicOrderController.index);
router.post('/orders', authenticate, validateBody(createOrderSchema), PublicOrderController.store);
router.get('/orders/:id', authenticate, PublicOrderController.show);
router.post('/orders/:id/cancel', authenticate, PublicOrderController.cancel);

export default router;
