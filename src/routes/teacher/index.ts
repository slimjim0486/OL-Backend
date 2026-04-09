// Teacher routes index
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import quotaRoutes from './quota.routes.js';
import contentRoutes from './content.routes.js';
import templateRoutes from './template.routes.js';
import exportRoutes from './export.routes.js';
import checkoutRoutes from './checkout.routes.js';
import subscriptionRoutes from './subscription.routes.js';
import audioUpdateRoutes from './audioUpdate.routes.js';
import subPlanRoutes from './subPlan.routes.js';
import rubricRoutes from './rubric.routes.js';
import gradingRoutes from './grading.routes.js';
import iepGoalRoutes from './iepGoal.routes.js';
import brainstormRoutes from './brainstorm.routes.js';
import referralRoutes from './referral.routes.js';
import sampleContentRoutes from './sampleContent.routes.js';
import activityRoutes from './activity.routes.js';
import gamesRoutes from './games.routes.js';
import sharingRoutes from './sharing.routes.js';
import agentRoutes from './agent.routes.js';
import communicationRoutes from './communication.routes.js';
import organizationRoutes from './organization.routes.js';
import voiceRoutes from './voice.routes.js';
import streamRoutes from './stream.routes.js';
import materialsRoutes from './materials.routes.js';
import eventsRoutes from './events.routes.js';
import graphRoutes from './graph.routes.js';
import nudgeRoutes from './nudges.routes.js';
import importRoutes from './import.routes.js';
import parentBridgeRoutes from './parentBridge.routes.js';
import preferencesRoutes from './preferences.routes.js';
import studentsRoutes from './students.routes.js';
import canvasRoutes from './canvas.routes.js';
import searchRoutes from './search.routes.js';
import notificationRoutes from './notifications.routes.js';
const router = Router();

// Mount teacher routes
router.use('/auth', authRoutes);
router.use('/quota', quotaRoutes);
router.use('/content', contentRoutes);
router.use('/templates', templateRoutes);
router.use('/export', exportRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/audio-updates', audioUpdateRoutes);
router.use('/sub-plans', subPlanRoutes);
router.use('/rubrics', rubricRoutes);
router.use('/grading', gradingRoutes);
router.use('/iep-goals', iepGoalRoutes);
router.use('/brainstorm', brainstormRoutes);
router.use('/referrals', referralRoutes);
router.use('/samples', sampleContentRoutes);  // Public sample content
router.use('/activities', activityRoutes);    // Activity feed for notifications
router.use('/games', gamesRoutes);
router.use('/sharing', sharingRoutes);        // Content sharing hub
router.use('/agent', agentRoutes);
router.use('/communications', communicationRoutes);
router.use('/organizations', organizationRoutes);
router.use('/voice', voiceRoutes);

// Teacher Intelligence Platform
router.use('/stream', streamRoutes);
router.use('/materials', materialsRoutes);
router.use('/events', eventsRoutes);
router.use('/graph', graphRoutes);
router.use('/nudges', nudgeRoutes);
router.use('/import', importRoutes);
router.use('/parent-bridge', parentBridgeRoutes);
router.use('/preferences', preferencesRoutes);
router.use('/students', studentsRoutes);
router.use('/canvas', canvasRoutes);
router.use('/search', searchRoutes);
router.use('/notifications', notificationRoutes);
// NOTE: Public parent bridge routes (publicParentBridgeRoutes) must be mounted
// separately in the main app at /api/public/parent-bridge/ without teacher auth.
// Import from './routes/teacher/parentBridge.routes.js' and use publicParentBridgeRoutes.

export default router;
