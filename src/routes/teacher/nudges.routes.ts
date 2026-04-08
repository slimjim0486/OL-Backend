/**
 * Nudge Routes — Teacher Intelligence Platform
 * Active nudges, dismiss, act on
 */
import { Router, Request, Response, NextFunction } from 'express';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { nudgeService } from '../../services/teacher/nudgeService.js';

const router = Router();
router.use(authenticateTeacher);

// Get active nudges
// Optional query: ?channel=stream → returns at most 1 "Ollie whisper" for the
//                 top of the stream (reteach, preference, collective insight)
//                 ?channel=graph  → returns all graph-side nudges (curriculum
//                                    gap, pacing) for graph-embedded display
//                 (no channel)    → legacy behaviour: all active nudges
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const channelParam = typeof req.query.channel === 'string' ? req.query.channel : undefined;
    const channel =
      channelParam === 'stream' || channelParam === 'graph' ? channelParam : undefined;
    const nudges = await nudgeService.getActiveNudges(teacherId, channel);
    res.json({ nudges });
  } catch (error) {
    next(error);
  }
});

// Dismiss a nudge
router.post('/:id/dismiss', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    await nudgeService.dismissNudge(teacherId, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Act on a nudge
router.post('/:id/act', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    await nudgeService.actOnNudge(teacherId, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
