// Flashcard routes for generating and managing flashcards
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { validateInput } from '../middleware/validateInput.js';
import { genAI } from '../config/gemini.js';
import { config } from '../config/index.js';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { AgeGroup, CurriculumType } from '@prisma/client';
import { xpEngine, XP_VALUES } from '../services/gamification/xpEngine.js';
import { progressService } from '../services/curriculum/progressService.js';

const router = Router();

// ============================================
// SCHEMAS
// ============================================

const generateFlashcardsSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters'),
  count: z.number().min(1).max(20).optional().default(5),
  childId: z.string().optional().nullable(),
  ageGroup: z.enum(['YOUNG', 'OLDER']).optional(),
  lessonId: z.string().optional(),
});

const reviewFlashcardSchema = z.object({
  deckId: z.string().min(1, 'Deck ID is required'),
  cardId: z.string().min(1, 'Card ID is required'),
  isCorrect: z.boolean(),
  responseTimeMs: z.number().min(0).optional(),
});

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/flashcards/generate
 * Generate flashcards from content
 */
router.post(
  '/generate',
  authenticate,
  validateInput(generateFlashcardsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content, count } = req.body;
      let { childId, ageGroup } = req.body;

      // Get age group from child if available
      let effectiveAgeGroup: AgeGroup = (ageGroup as AgeGroup) || 'OLDER';

      if (req.child) {
        effectiveAgeGroup = req.child.ageGroup;
        childId = req.child.id;
      } else if (childId) {
        const child = await prisma.child.findUnique({
          where: { id: childId },
          select: { ageGroup: true },
        });
        if (child) {
          effectiveAgeGroup = child.ageGroup;
        }
      }

      logger.info('Flashcard generation request', {
        childId,
        ageGroup: effectiveAgeGroup,
        contentLength: content.length,
        count,
      });

      const flashcards = await generateFlashcards(content, effectiveAgeGroup, count);

      res.json({
        success: true,
        data: flashcards,
      });
    } catch (error) {
      logger.error('Flashcard generation error', { error });
      next(error);
    }
  }
);

/**
 * POST /api/flashcards/review
 * Record flashcard review result, update progress, award XP
 */
router.post(
  '/review',
  authenticate,
  validateInput(reviewFlashcardSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deckId, cardId, isCorrect, responseTimeMs } = req.body;

      // Get child ID - only allow child sessions for flashcard review
      if (!req.child) {
        return res.status(401).json({
          success: false,
          error: 'Please sign in with a child profile to review flashcards.',
        });
      }

      const childId = req.child.id;

      // Get deck with lesson info
      const deck = await prisma.flashcardDeck.findUnique({
        where: { id: deckId },
        include: {
          lesson: { select: { id: true } },
          child: { select: { curriculumType: true } },
        },
      });

      if (!deck) {
        return res.status(404).json({ success: false, error: 'Flashcard deck not found. It may have been deleted.' });
      }

      // Verify the deck belongs to this child
      if (deck.childId !== childId) {
        return res.status(403).json({ success: false, error: 'You don\'t have access to these flashcards.' });
      }

      // Get the specific flashcard
      const flashcard = await prisma.flashcard.findUnique({
        where: { id: cardId },
      });

      if (!flashcard || flashcard.deckId !== deckId) {
        return res.status(404).json({ success: false, error: 'Flashcard not found. It may have been deleted or moved.' });
      }

      // Update flashcard statistics
      await prisma.flashcard.update({
        where: { id: cardId },
        data: {
          timesReviewed: { increment: 1 },
          timesCorrect: isCorrect ? { increment: 1 } : undefined,
        },
      });

      // Award XP
      let xpResult = null;
      try {
        const xpAmount = isCorrect ? XP_VALUES.FLASHCARD_CORRECT : XP_VALUES.FLASHCARD_REVIEW;
        xpResult = await xpEngine.awardXP(childId, {
          amount: xpAmount,
          reason: isCorrect ? 'FLASHCARD_CORRECT' : 'FLASHCARD_REVIEW',
          sourceType: 'flashcard',
          sourceId: cardId,
        });

        logger.info('XP awarded for flashcard review', {
          childId,
          cardId,
          isCorrect,
          xpAwarded: xpResult.xpAwarded,
        });
      } catch (xpError) {
        logger.error('XP award failed for flashcard', {
          error: xpError instanceof Error ? xpError.message : 'Unknown error',
          childId,
          cardId,
        });
      }

      // Update curriculum progress if lesson is linked
      if (deck.lessonId && deck.child.curriculumType) {
        try {
          const alignments = await progressService.getContentAlignments('LESSON', deck.lessonId);

          if (alignments.length > 0) {
            await progressService.updateProgressBatch(
              childId,
              deck.child.curriculumType,
              alignments.map(a => ({
                standardId: a.standardId,
                isCorrect,
              }))
            );

            logger.info('Curriculum progress updated for flashcard', {
              childId,
              lessonId: deck.lessonId,
              standardsUpdated: alignments.length,
            });
          }
        } catch (progressError) {
          logger.error('Progress update failed for flashcard', {
            error: progressError instanceof Error ? progressError.message : 'Unknown error',
            childId,
          });
        }
      }

      // Update UserProgress stats
      try {
        await prisma.userProgress.upsert({
          where: { childId },
          update: {
            flashcardsReviewed: { increment: 1 },
          },
          create: {
            childId,
            flashcardsReviewed: 1,
          },
        });
      } catch (statsError) {
        logger.error('UserProgress update failed', { error: statsError });
      }

      // Update deck's lastStudiedAt
      await prisma.flashcardDeck.update({
        where: { id: deckId },
        data: { lastStudiedAt: new Date() },
      });

      res.json({
        success: true,
        data: {
          cardId,
          isCorrect,
          xp: xpResult
            ? {
                awarded: xpResult.xpAwarded,
                leveledUp: xpResult.leveledUp,
                newLevel: xpResult.newLevel,
                newBadges: xpResult.newBadges,
              }
            : null,
        },
      });
    } catch (error) {
      logger.error('Flashcard review error', { error });
      next(error);
    }
  }
);

/**
 * Generate flashcards using Gemini AI
 */
async function generateFlashcards(
  content: string,
  ageGroup: AgeGroup,
  count: number = 5
): Promise<Array<{ id: string; front: string; back: string; hint?: string; difficulty: string }>> {
  const isYoung = ageGroup === 'YOUNG';

  const prompt = `Create ${count} flashcards from this content for a ${isYoung ? 'young child (ages 4-7)' : 'child (ages 8-12)'}.

Content: ${content.substring(0, 3000)}

Requirements:
- ${isYoung ? 'Use very simple words and short phrases' : 'Use clear, age-appropriate language'}
- Each flashcard should test one concept
- Front: A question or prompt
- Back: The answer
- Hint: A helpful clue (optional)

Return ONLY a valid JSON array with this exact format, no other text:
[
  {
    "front": "question or prompt",
    "back": "answer",
    "hint": "optional hint",
    "difficulty": "easy" | "medium" | "hard"
  }
]`;

  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash,
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  try {
    const flashcards = JSON.parse(responseText);

    // Add IDs to each flashcard
    return flashcards.map((card: any, index: number) => ({
      id: `card-${Date.now()}-${index}`,
      front: card.front,
      back: card.back,
      hint: card.hint || null,
      difficulty: card.difficulty || 'medium',
    }));
  } catch (parseError) {
    logger.error('Failed to parse flashcard response', { responseText, parseError });
    throw new Error('Flashcard generation failed unexpectedly. Try again, or use shorter content.');
  }
}

export default router;
