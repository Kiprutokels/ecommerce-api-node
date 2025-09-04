import { Router } from 'express';
import { AdminController } from '@/controllers/admin/admin.controller';
import { AdminCategoryController } from '@/controllers/admin/category.controller';
import { AdminProductController } from '@/controllers/admin/product.controller';
import { AdminOrderController } from '@/controllers/admin/order.controller';
import { AdminUserController } from '@/controllers/admin/user.controller';
import { AdminBrandController } from '@/controllers/admin/brand.controller';
import { AdminSettingsController } from '@/controllers/admin/settings.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { requireAdmin } from '@/middleware/admin.middleware';
import { validateBody, validateQuery } from '@/middleware/validation.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
} from '@/validators/category.validator';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  bulkUpdateProductsSchema,
} from '@/validators/product.validator';
import {
  updateOrderStatusSchema,
  orderQuerySchema,
} from '@/validators/order.validator';
import {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
} from '@/validators/user.validator';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', AdminController.dashboard);

// Categories
router.get('/categories', validateQuery(categoryQuerySchema), AdminCategoryController.index);
router.post('/categories', validateBody(createCategorySchema), AdminCategoryController.store);
router.get('/categories/:id', AdminCategoryController.show);
router.put('/categories/:id', validateBody(updateCategorySchema), AdminCategoryController.update);
router.delete('/categories/:id', AdminCategoryController.destroy);

// Brands
router.get('/brands', AdminBrandController.index);
router.post('/brands', AdminBrandController.store);

// Products
router.get('/products', validateQuery(productQuerySchema), AdminProductController.index);
router.post('/products', validateBody(createProductSchema), AdminProductController.store);
router.get('/products/stats', AdminProductController.stats);
router.get('/products/export', AdminProductController.export);
router.post('/products/bulk-update', validateBody(bulkUpdateProductsSchema), AdminProductController.bulkUpdate);
router.get('/products/:id', AdminProductController.show);
router.put('/products/:id', validateBody(updateProductSchema), AdminProductController.update);
router.delete('/products/:id', AdminProductController.destroy);
router.post('/products/:id/duplicate', AdminProductController.duplicate);
router.patch('/products/:id/toggle-status', AdminProductController.toggleStatus);
router.patch('/products/:id/toggle-featured', AdminProductController.toggleFeatured);

// Orders
router.get('/orders', validateQuery(orderQuerySchema), AdminOrderController.index);
router.get('/orders/stats', AdminOrderController.stats);
router.get('/orders/export', AdminOrderController.export);
router.get('/orders/:id', AdminOrderController.show);
router.patch(
  '/orders/:id/status',
  validateBody(updateOrderStatusSchema),
  AdminOrderController.updateStatus
);

// Users
router.get('/users', validateQuery(userQuerySchema), AdminUserController.index);
router.post('/users', validateBody(createUserSchema), AdminUserController.store);
router.get('/users/:id', AdminUserController.show);
router.put('/users/:id', validateBody(updateUserSchema), AdminUserController.update);
router.delete('/users/:id', AdminUserController.destroy);

router.get('/settings', AdminSettingsController.get);
router.put('/settings', AdminSettingsController.update);

export default router;