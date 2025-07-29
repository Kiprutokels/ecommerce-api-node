// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth';
import publicRoutes from './public';
import adminRoutes from './admin';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', publicRoutes);
router.use('/admin', adminRoutes);

export default router;
