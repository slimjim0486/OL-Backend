/**
 * Preferences Routes — Teacher Intelligence Platform
 * Read teacher preference profile (learned from behavior) plus
 * edit-intelligence-loop patterns (Phase 4.9).
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

// Edit-derived patterns view (Phase 4.9).
// Surfaces everything the Edit Intelligence Loop has learned: tendencies,
// specific patterns with confidence, per-type preferences, and the edit
// rate metric that tells the teacher how much the system is improving.
router.get('/edit-patterns', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const profile = await prisma.teacherPreferenceProfile.findUnique({
      where: { teacherId },
    });

    if (!profile) {
      return res.json({
        hasLearned: false,
        totalEdits: 0,
        totalApprovedNoEdit: 0,
        editRate: null,
        tendencies: {},
        learnedPatterns: [],
        typePreferences: {},
      });
    }

    const totalEdits = profile.totalEdits ?? 0;
    const totalApprovedNoEdit = profile.totalApprovedNoEdit ?? 0;
    const learnedPatterns = Array.isArray(profile.learnedPatterns)
      ? profile.learnedPatterns
      : [];

    res.json({
      hasLearned: totalEdits >= 5 || learnedPatterns.length > 0,
      totalEdits,
      totalApprovedNoEdit,
      editRate: profile.editRate,
      tendencies: {
        vocabulary: profile.vocabularyTendency,
        difficulty: profile.difficultyTendency,
        length: profile.lengthTendency,
        tone: profile.toneTendency,
      },
      learnedPatterns,
      typePreferences: profile.typePreferences ?? {},
      lastUpdatedAt: profile.lastUpdatedAt,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
