// Admin routes index for VC Analytics Dashboard
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import analyticsRoutes from './analytics.routes.js';
import reportsRoutes from './reports.routes.js';

const router = Router();

// Mount admin routes
router.use('/auth', authRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportsRoutes);

export default router;
