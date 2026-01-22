/**
 * Parent Routes Index
 *
 * Exports all parent-related routes for mounting in the main app.
 */

import { Router } from 'express';
import subscriptionRoutes from './subscription.routes.js';
import languageRoutes from './language.routes.js';
import voiceConsentRoutes from './voiceConsent.routes.js';
import notificationRoutes from './notifications.routes.js';

const router = Router();

// Mount subscription routes
router.use('/subscription', subscriptionRoutes);

// Mount language preference routes (TranslateGemma integration)
router.use('/language', languageRoutes);

// Mount voice consent routes (COPPA-compliant voice input permissions)
router.use('/voice-consent', voiceConsentRoutes);

// Mount notification routes (achievement alerts, preferences)
router.use('/notifications', notificationRoutes);

export default router;
