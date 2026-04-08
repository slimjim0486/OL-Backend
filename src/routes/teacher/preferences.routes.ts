/**
 * Preferences Routes — Teacher Intelligence Platform
 * Read teacher preference profile (learned from behavior)
 */
import { Router, Request, Response, NextFunction } from 'express';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { prisma } from '../../config/database.js';

const router = Router();
router.use(authenticateTeacher);

// Get teacher's learned preference profile
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const profile = await prisma.teacherPreferenceProfile.findUnique({
      where: { teacherId },
    });

    if (!profile) {
      return res.json({ preferences: null, message: 'No preferences learned yet' });
    }

    res.json({ preferences: profile });
  } catch (error) {
    next(error);
  }
});

export default router;
