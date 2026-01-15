/**
 * Progress Routes
 * API endpoints for curriculum progress tracking and analytics
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorizeChildAccess } from '../middleware/auth.js';
import { progressService } from '../services/curriculum/progressService.js';
import { logger } from '../utils/logger.js';

const router = Router();

// ============================================
// CHILD PROGRESS ENDPOINTS
// ============================================

/**
 * GET /api/progress/child/:childId/curriculum
 * Get curriculum coverage overview for a child
 * Returns: totalStandards, mastered, proficient, approaching, inProgress, notStarted, coveragePercent, masteryPercent
 */
router.get(
  '/child/:childId/curriculum',
  authenticate,
  authorizeChildAccess('childId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { childId } = req.params;

      const coverage = await progressService.getCurriculumCoverage(childId);

      res.json({
        success: true,
        data: coverage,
      });
    } catch (error) {
      logger.error('Error fetching curriculum coverage', {
        error: error instanceof Error ? error.message : 'Unknown error',
        childId: req.params.childId,
      });
      next(error);
    }
  }
);

/**
 * GET /api/progress/child/:childId/by-subject
 * Get progress breakdown by subject and strand
 * Returns: array of { subject, strand, totalStandards, mastered, coveragePercent }
 */
router.get(
  '/child/:childId/by-subject',
  authenticate,
  authorizeChildAccess('childId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { childId } = req.params;

      const progress = await progressService.getProgressBySubject(childId);

      res.json({
        success: true,
        data: progress,
      });
    } catch (error) {
      logger.error('Error fetching progress by subject', {
        error: error instanceof Error ? error.message : 'Unknown error',
        childId: req.params.childId,
      });
      next(error);
    }
  }
);

/**
 * GET /api/progress/child/:childId/gaps
 * Get gap analysis - standards that need more work
 * Query params: limit (default 10)
 * Returns: array of standards with low mastery scores
 */
router.get(
  '/child/:childId/gaps',
  authenticate,
  authorizeChildAccess('childId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { childId } = req.params;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

      const gaps = await progressService.getGapAnalysis(childId, limit);

      res.json({
        success: true,
        data: gaps,
      });
    } catch (error) {
      logger.error('Error fetching gap analysis', {
        error: error instanceof Error ? error.message : 'Unknown error',
        childId: req.params.childId,
      });
      next(error);
    }
  }
);

// ============================================
// LESSON STANDARDS ENDPOINTS
// ============================================

/**
 * GET /api/progress/lesson/:lessonId/standards
 * Get curriculum standards aligned to a lesson
 * Returns: array of { standardId, notation, description, strand, alignmentStrength, isPrimary }
 */
router.get(
  '/lesson/:lessonId/standards',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lessonId } = req.params;

      const alignments = await progressService.getContentAlignments(
        'LESSON',
        lessonId
      );

      res.json({
        success: true,
        data: alignments,
      });
    } catch (error) {
      logger.error('Error fetching lesson standards', {
        error: error instanceof Error ? error.message : 'Unknown error',
        lessonId: req.params.lessonId,
      });
      next(error);
    }
  }
);

/**
 * GET /api/progress/flashcard-deck/:deckId/standards
 * Get curriculum standards aligned to a flashcard deck
 * Returns: array of { standardId, notation, description, strand, alignmentStrength, isPrimary }
 */
router.get(
  '/flashcard-deck/:deckId/standards',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deckId } = req.params;

      const alignments = await progressService.getContentAlignments(
        'FLASHCARD_DECK',
        deckId
      );

      res.json({
        success: true,
        data: alignments,
      });
    } catch (error) {
      logger.error('Error fetching flashcard deck standards', {
        error: error instanceof Error ? error.message : 'Unknown error',
        deckId: req.params.deckId,
      });
      next(error);
    }
  }
);

/**
 * GET /api/progress/quiz/:quizId/standards
 * Get curriculum standards aligned to a quiz
 * Returns: array of { standardId, notation, description, strand, alignmentStrength, isPrimary }
 */
router.get(
  '/quiz/:quizId/standards',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { quizId } = req.params;

      const alignments = await progressService.getContentAlignments(
        'QUIZ',
        quizId
      );

      res.json({
        success: true,
        data: alignments,
      });
    } catch (error) {
      logger.error('Error fetching quiz standards', {
        error: error instanceof Error ? error.message : 'Unknown error',
        quizId: req.params.quizId,
      });
      next(error);
    }
  }
);

export default router;
