/**
 * DTC Store Routes — Product catalog, checkout, package management
 */

import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateTeacher, requireTeacher } from '../../middleware/teacherAuth.js';
import { packageCatalogService } from '../../services/teacher/packageCatalogService.js';
import { packagePurchaseService } from '../../services/teacher/packagePurchaseService.js';
import { packageDeliveryService } from '../../services/teacher/packageDeliveryService.js';
import { packageExportService } from '../../services/teacher/packageExportService.js';
import { packageGenerationService } from '../../services/teacher/packageGenerationService.js';
import { getDTCProduct } from '../../config/stripeProductsDTC.js';
import { PackageCategory, PackageTier } from '@prisma/client';
import { logger } from '../../utils/logger.js';

const router = Router();

// Rate limit for preview-plan (Gemini call — 5 per minute per teacher)
const previewPlanRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many preview requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
});

function validatePackageConfig(
  tier: PackageTier,
  packageConfig: any
): { valid: boolean; error?: string } {
  const product = getDTCProduct(tier);
  if (!product) {
    return { valid: false, error: 'Invalid package tier.' };
  }

  if (!packageConfig?.gradeLevel || !packageConfig?.curriculum) {
    return {
      valid: false,
      error: 'Missing required fields: config.gradeLevel and config.curriculum.',
    };
  }

  const subjects = Array.isArray(packageConfig?.subjects)
    ? packageConfig.subjects.filter((s: unknown) => typeof s === 'string' && s.trim())
    : [];

  if (product.requiresSubject && subjects.length === 0) {
    return {
      valid: false,
      error: 'This package requires at least one subject in config.subjects.',
    };
  }

  const topic = typeof packageConfig?.topic === 'string' ? packageConfig.topic.trim() : '';
  if (product.requiresTopic && !topic) {
    return {
      valid: false,
      error: 'This package requires a topic in config.topic.',
    };
  }

  return { valid: true };
}

// =============================================================================
// CATALOG (authenticated — need teacher context for samples)
// =============================================================================

/**
 * GET /api/teacher/store/products
 * List all products, optionally filtered by category
 */
router.get('/products', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.query.category as PackageCategory | undefined;
    const products = packageCatalogService.getProducts(category);
    const byCategory = packageCatalogService.getProductsByCategory();

    res.json({
      success: true,
      data: { products, byCategory },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/teacher/store/products/:tier
 * Get single product details
 */
router.get('/products/:tier', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tier = req.params.tier.toUpperCase() as PackageTier;
    const product = packageCatalogService.getProduct(tier);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/teacher/store/products/:tier/samples
 * Generate sample content preview using teacher's context
 */
router.get('/products/:tier/samples', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tier = req.params.tier.toUpperCase() as PackageTier;
    const samples = await packageCatalogService.getProductSamples(tier, (req as any).teacher.id);
    res.json({ success: true, data: samples });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// PREVIEW PLAN
// =============================================================================

/**
 * POST /api/teacher/store/preview-plan
 * Generate a plan preview (titles + descriptions) without creating a purchase
 */
router.post('/preview-plan', authenticateTeacher, requireTeacher, previewPlanRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tier, config: previewConfig } = req.body;
    const teacherId = (req as any).teacher?.id;
    const normalizedTier = String(tier || '').toUpperCase() as PackageTier;

    logger.info('Preview plan request', { teacherId, tier, config: previewConfig });

    if (!tier) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: tier.',
      });
    }

    const validation = validatePackageConfig(normalizedTier, previewConfig);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    const result = await packageGenerationService.previewPackagePlan(
      teacherId,
      normalizedTier,
      previewConfig
    );

    logger.info('Preview plan success', { teacherId, tier, totalMaterials: result.totalMaterials });
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Preview plan failed', {
      teacherId: (req as any).teacher?.id,
      tier: req.body?.tier,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    next(error);
  }
});

// =============================================================================
// CHECKOUT
// =============================================================================

/**
 * POST /api/teacher/store/checkout
 * Create a Stripe checkout session for a package purchase
 */
router.post('/checkout', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tier, config: purchaseConfig, successUrl, cancelUrl } = req.body;
    const normalizedTier = String(tier || '').toUpperCase() as PackageTier;

    if (!tier || !successUrl || !cancelUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tier, successUrl, cancelUrl',
      });
    }

    const validation = validatePackageConfig(normalizedTier, purchaseConfig || {});
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    const result = await packagePurchaseService.createCheckout({
      teacherId: (req as any).teacher.id,
      tier: normalizedTier,
      config: purchaseConfig || {},
      successUrl,
      cancelUrl,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// MY PACKAGES
// =============================================================================

/**
 * GET /api/teacher/store/my-packages
 * List all purchased packages
 */
router.get('/my-packages', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await packagePurchaseService.getMyPackages((req as any).teacher.id, { page, limit });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/teacher/store/my-packages/:id
 * Get single package with all weeks and materials
 */
router.get('/my-packages/:id', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pkg = await packagePurchaseService.getPackage(req.params.id, (req as any).teacher.id);
    res.json({ success: true, data: pkg });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/teacher/store/my-packages/:id/progress
 * Lightweight progress polling endpoint
 */
router.get('/my-packages/:id/progress', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = await packagePurchaseService.getPackageProgress(req.params.id, (req as any).teacher.id);
    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/teacher/store/my-packages/:id/delivery-schedule
 * Get progressive delivery schedule
 */
router.get('/my-packages/:id/delivery-schedule', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schedule = await packageDeliveryService.getDeliverySchedule(req.params.id, (req as any).teacher.id);
    res.json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// MATERIAL ACTIONS
// =============================================================================

/**
 * POST /api/teacher/store/my-packages/:id/materials/:mid/approve
 */
router.post('/my-packages/:id/materials/:mid/approve', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packagePurchaseService.approveMaterial(
      req.params.id, req.params.mid, (req as any).teacher.id
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/teacher/store/my-packages/:id/materials/:mid
 */
router.patch('/my-packages/:id/materials/:mid', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packagePurchaseService.editMaterial(
      req.params.id, req.params.mid, (req as any).teacher.id, req.body.editedContent
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/teacher/store/my-packages/:id/materials/:mid/regenerate
 */
router.post('/my-packages/:id/materials/:mid/regenerate', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await packagePurchaseService.regenerateMaterial(
      req.params.id, req.params.mid, (req as any).teacher.id, req.body.feedbackNote
    );
    res.json({ success: true, message: 'Regeneration queued' });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/teacher/store/my-packages/:id/approve-all
 */
router.post('/my-packages/:id/approve-all', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packagePurchaseService.approveAllMaterials(req.params.id, (req as any).teacher.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// ON-DEMAND GENERATION
// =============================================================================

/**
 * POST /api/teacher/store/my-packages/:id/materials/:mid/generate
 * Generate a single material on-demand (preview content without downloading)
 */
router.post('/my-packages/:id/materials/:mid/generate', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageGenerationService.generateMaterialOnDemand(
      req.params.mid, (req as any).teacher.id
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// EXPORT
// =============================================================================

/**
 * POST /api/teacher/store/my-packages/:id/download-zip
 */
router.post('/my-packages/:id/download-zip', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageExportService.exportPackageZip(
      req.params.id, (req as any).teacher.id, req.body
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/teacher/store/my-packages/:id/materials/:mid/download
 */
router.get('/my-packages/:id/materials/:mid/download', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await packageExportService.exportMaterial(
      req.params.mid, (req as any).teacher.id
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// RECURRING MANAGEMENT (Weekly Box)
// =============================================================================

/**
 * POST /api/teacher/store/my-packages/:id/cancel
 */
router.post('/my-packages/:id/cancel', authenticateTeacher, requireTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await packagePurchaseService.cancelRecurring(req.params.id, (req as any).teacher.id);
    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    next(error);
  }
});

export default router;
