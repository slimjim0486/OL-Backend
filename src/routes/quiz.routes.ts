// Quiz routes for generating and managing quizzes
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
import { memoryService, encouragementService } from '../services/memory/index.js';

const router = Router();

// ============================================
// SCHEMAS
// ============================================

const generateQuizSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters'),
  count: z.number().min(1).max(10).optional().default(5),
  type: z.enum(['multiple_choice', 'true_false', 'fill_blank']).optional().default('multiple_choice'),
  childId: z.string().optional().nullable(),
  ageGroup: z.enum(['YOUNG', 'OLDER']).optional(),
  lessonId: z.string().optional(),
});

const submitQuizSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  answers: z.array(
    z.object({
      questionId: z.string(),
      questionIndex: z.number(),
      selectedAnswer: z.number(), // Index of selected option
      isCorrect: z.boolean(),
    })
  ).min(1, 'At least one answer is required'),
  totalQuestions: z.number().min(1),
  timeSpentSeconds: z.number().min(0).optional().default(0),
  quizTitle: z.string().optional(),
});

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/quizzes/generate
 * Generate a quiz from content
 */
router.post(
  '/generate',
  authenticate,
  validateInput(generateQuizSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content, count, type } = req.body;
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

      logger.info('Quiz generation request', {
        childId,
        ageGroup: effectiveAgeGroup,
        contentLength: content.length,
        count,
        type,
      });

      const quiz = await generateQuiz(content, effectiveAgeGroup, count, type);

      res.json({
        success: true,
        data: quiz,
      });
    } catch (error) {
      logger.error('Quiz generation error', { error });
      next(error);
    }
  }
);

/**
 * POST /api/quizzes/submit
 * Submit quiz answers, calculate score, update progress, award XP
 */
router.post(
  '/submit',
  authenticate,
  validateInput(submitQuizSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lessonId, answers, totalQuestions, timeSpentSeconds, quizTitle } = req.body;

      // Determine child ID and curriculum type
      let childId: string;
      let curriculumType: CurriculumType | null = null;

      if (req.child) {
        childId = req.child.id;
        const childData = await prisma.child.findUnique({
          where: { id: childId },
          select: { curriculumType: true },
        });
        curriculumType = childData?.curriculumType || null;
      } else if (req.parent) {
        // Get lesson to find child
        const lesson = await prisma.lesson.findUnique({
          where: { id: lessonId },
          select: {
            childId: true,
            child: { select: { curriculumType: true } },
          },
        });
        if (!lesson) {
          return res.status(404).json({ success: false, error: 'Lesson not found. It may have been deleted.' });
        }
        childId = lesson.childId;
        curriculumType = lesson.child.curriculumType;
      } else {
        return res.status(401).json({ success: false, error: 'Please sign in to submit your quiz.' });
      }

      // Calculate score
      const correctCount = answers.filter((a: { isCorrect: boolean }) => a.isCorrect).length;
      const score = Math.round((correctCount / totalQuestions) * 100);
      const isPerfect = score === 100;

      logger.info('Quiz submission received', {
        childId,
        lessonId,
        correctCount,
        totalQuestions,
        score,
        isPerfect,
      });

      // Get or create quiz record
      let quiz = await prisma.quiz.findFirst({
        where: { lessonId },
      });

      if (!quiz) {
        // Create quiz record if it doesn't exist
        quiz = await prisma.quiz.create({
          data: {
            lessonId,
            title: quizTitle || 'Generated Quiz',
            type: 'MULTIPLE_CHOICE',
            questions: answers,
          },
        });
      }

      // Record quiz attempt
      const attempt = await prisma.quizAttempt.create({
        data: {
          quizId: quiz.id,
          answers: answers,
          score,
          timeSpentSeconds: timeSpentSeconds || 0,
          xpEarned: 0, // Will update after XP calculation
        },
      });

      // Award XP
      let xpResult = null;
      try {
        const xpAmount = isPerfect ? XP_VALUES.QUIZ_PERFECT : XP_VALUES.QUIZ_COMPLETE;
        xpResult = await xpEngine.awardXP(childId, {
          amount: xpAmount,
          reason: isPerfect ? 'QUIZ_PERFECT' : 'QUIZ_COMPLETE',
          sourceType: 'quiz',
          sourceId: quiz.id,
        });

        // Update attempt with XP earned
        await prisma.quizAttempt.update({
          where: { id: attempt.id },
          data: { xpEarned: xpResult.xpAwarded },
        });

        logger.info('XP awarded for quiz', {
          childId,
          quizId: quiz.id,
          xpAwarded: xpResult.xpAwarded,
          isPerfect,
        });
      } catch (xpError) {
        logger.error('XP award failed', {
          error: xpError instanceof Error ? xpError.message : 'Unknown error',
          childId,
          quizId: quiz.id,
        });
      }

      // Update curriculum progress if lesson has alignments
      if (curriculumType) {
        try {
          const alignments = await progressService.getContentAlignments('LESSON', lessonId);

          if (alignments.length > 0) {
            // For each aligned standard, update progress based on quiz performance
            // Consider 70%+ score as demonstrating proficiency for the standard
            const progressUpdates = alignments.map(alignment => ({
              standardId: alignment.standardId,
              isCorrect: score >= 70,
            }));

            await progressService.updateProgressBatch(
              childId,
              curriculumType,
              progressUpdates
            );

            logger.info('Curriculum progress updated', {
              childId,
              lessonId,
              standardsUpdated: progressUpdates.length,
              quizScore: score,
            });
          }
        } catch (progressError) {
          logger.error('Progress update failed', {
            error: progressError instanceof Error ? progressError.message : 'Unknown error',
            childId,
            lessonId,
          });
        }
      }

      // Update UserProgress stats
      try {
        await prisma.userProgress.upsert({
          where: { childId },
          update: {
            questionsAnswered: { increment: totalQuestions },
            perfectScores: isPerfect ? { increment: 1 } : undefined,
          },
          create: {
            childId,
            questionsAnswered: totalQuestions,
            perfectScores: isPerfect ? 1 : 0,
          },
        });
      } catch (statsError) {
        logger.error('UserProgress update failed', { error: statsError });
      }

      // ============================================
      // OLLIE'S MEMORY - Track answers and get encouragement
      // ============================================
      let encouragement: string | null = null;
      try {
        // Get lesson info for topic/subject context
        const lesson = await prisma.lesson.findUnique({
          where: { id: lessonId },
          select: { title: true, subject: true },
        });
        const topic = lesson?.title || quizTitle || 'this quiz';
        const subject = lesson?.subject || undefined;

        // Record each answer in session memory for pattern tracking
        for (const answer of answers) {
          await memoryService.recordAnswerInSession(
            childId,
            answer.isCorrect,
            topic
          );
        }

        // Get previous quiz score for comparison (for "better than last time!" feedback)
        const previousAttempt = await prisma.quizAttempt.findFirst({
          where: {
            quiz: { lessonId },
            id: { not: attempt.id },
          },
          orderBy: { id: 'desc' },
          select: { score: true },
        });

        // Generate personalized encouragement based on performance and memory
        const encouragementResult = await encouragementService.getQuizEncouragement(
          childId,
          score,
          previousAttempt?.score,
          topic
        );
        encouragement = encouragementResult.message;

        logger.info('Ollie memory updated for quiz', {
          childId,
          score,
          previousScore: previousAttempt?.score,
          encouragementType: encouragementResult.type,
        });
      } catch (memoryError) {
        // Don't fail the request if memory tracking fails
        logger.error('Ollie memory tracking failed', {
          error: memoryError instanceof Error ? memoryError.message : 'Unknown error',
          childId,
        });
      }

      res.json({
        success: true,
        data: {
          attemptId: attempt.id,
          quizId: quiz.id,
          score,
          correctCount,
          totalQuestions,
          isPerfect,
          xp: xpResult
            ? {
                awarded: xpResult.xpAwarded,
                leveledUp: xpResult.leveledUp,
                newLevel: xpResult.newLevel,
                newBadges: xpResult.newBadges,
              }
            : null,
          // Ollie's personalized encouragement
          encouragement,
        },
      });
    } catch (error) {
      logger.error('Quiz submission error', { error });
      next(error);
    }
  }
);

/**
 * Generate quiz using Gemini AI
 */
async function generateQuiz(
  content: string,
  ageGroup: AgeGroup,
  count: number = 5,
  type: string = 'multiple_choice'
): Promise<{ title: string; questions: Array<any> }> {
  const isYoung = ageGroup === 'YOUNG';

  const prompt = `Create a ${count}-question ${type.replace('_', ' ')} quiz from this content for a ${isYoung ? 'young child (ages 4-7)' : 'child (ages 8-12)'}.

Content: ${content.substring(0, 3000)}

Requirements:
- ${isYoung ? 'Use very simple words and short questions' : 'Use clear, age-appropriate language'}
- Questions should test understanding, not just memorization
- Include encouraging feedback for correct and incorrect answers
- Make it fun and engaging

Return ONLY a valid JSON object with this exact format, no other text:
{
  "title": "Quiz title",
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct",
      "encouragement": "Great job!" or "Keep trying!"
    }
  ]
}

For correctAnswer, use the index (0-3) of the correct option.`;

  const model = genAI.getGenerativeModel({
    model: config.gemini.models.pro, // Using Gemini 3 Pro for better quiz generation
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  try {
    const quiz = JSON.parse(responseText);

    // Add IDs to questions
    quiz.questions = quiz.questions.map((q: any, index: number) => ({
      id: `q-${Date.now()}-${index}`,
      ...q,
    }));

    return quiz;
  } catch (parseError) {
    logger.error('Failed to parse quiz response', { responseText, parseError });
    throw new Error('Quiz generation failed. Try with different content or a shorter lesson.');
  }
}

export default router;
