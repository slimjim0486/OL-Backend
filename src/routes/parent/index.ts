/**
 * Parent Routes Index
 *
 * Exports all parent-related routes for mounting in the main app.
 */

import { Router } from 'express';
import subscriptionRoutes from './subscription.routes.js';
import languageRoutes from './language.routes.js';

const router = Router();

// Mount subscription routes
router.use('/subscription', subscriptionRoutes);

// Mount language preference routes (TranslateGemma integration)
router.use('/language', languageRoutes);

export default router;
