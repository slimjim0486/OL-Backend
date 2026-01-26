// Teacher routes index
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import quotaRoutes from './quota.routes.js';
import contentRoutes from './content.routes.js';
import templateRoutes from './template.routes.js';
import exportRoutes from './export.routes.js';
import subscriptionRoutes from './subscription.routes.js';
import audioUpdateRoutes from './audioUpdate.routes.js';
import subPlanRoutes from './subPlan.routes.js';
import iepGoalRoutes from './iepGoal.routes.js';
import brainstormRoutes from './brainstorm.routes.js';
import referralRoutes from './referral.routes.js';
import sampleContentRoutes from './sampleContent.routes.js';
import activityRoutes from './activity.routes.js';
import rubricRoutes from './rubric.routes.js';
import gradingRoutes from './grading.routes.js';

const router = Router();

// Mount teacher routes
router.use('/auth', authRoutes);
router.use('/quota', quotaRoutes);
router.use('/content', contentRoutes);
router.use('/templates', templateRoutes);
router.use('/export', exportRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/audio-updates', audioUpdateRoutes);
router.use('/sub-plans', subPlanRoutes);
router.use('/iep-goals', iepGoalRoutes);
router.use('/brainstorm', brainstormRoutes);
router.use('/referrals', referralRoutes);
router.use('/samples', sampleContentRoutes);  // Public sample content
router.use('/activities', activityRoutes);    // Activity feed for notifications
router.use('/rubrics', rubricRoutes);         // Rubric management
router.use('/grading', gradingRoutes);        // AI grading

export default router;
