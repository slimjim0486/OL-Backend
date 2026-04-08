/**
 * Parent Bridge Routes — Teacher Intelligence Platform
 * Allows teachers to share material summaries with parents via unique shortcode links.
 *
 * Mounting plan:
 * - Auth routes (default export): mounted at /api/teacher/parent-bridge/ (teacher auth required)
 * - Public routes (publicParentBridgeRoutes): mounted at /api/public/parent-bridge/ (no auth)
 */
import { Router, Request, Response, NextFunction } from 'express';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { parentBridgeService } from '../../services/teacher/parentBridgeService.js';

// ============================================================================
// Authenticated Routes (teacher auth required)
// ============================================================================

const authRouter = Router();
authRouter.use(authenticateTeacher);

// Create share link for a material
authRouter.post('/share/:materialId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const shared = await parentBridgeService.createShareLink(teacherId, req.params.materialId);
    res.status(201).json(shared);
  } catch (error) {
    next(error);
  }
});

// Deactivate share link for a material
authRouter.delete('/share/:materialId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const result = await parentBridgeService.deactivateShare(teacherId, req.params.materialId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// Public Routes (no auth — parent-facing)
// ============================================================================

const publicRouter = Router();

// Get shared update by shortcode (public viewing)
publicRouter.get('/:shortcode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shared = await parentBridgeService.getSharedUpdate(req.params.shortcode);
    res.json(shared);
  } catch (error) {
    next(error);
  }
});

// Track CTA click on shared update
publicRouter.post('/:shortcode/cta', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await parentBridgeService.trackCtaClick(req.params.shortcode);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Export auth-protected routes as default, public routes as named export
export default authRouter;
export { publicRouter as publicParentBridgeRoutes };
