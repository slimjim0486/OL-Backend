/**
 * Teacher Games Routes
 *
 * Provides daily cached games plus on-demand AI generation.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateTeacher, requireTeacher } from '../../middleware/teacherAuth.js';
import { PaymentRequiredError } from '../../middleware/errorHandler.js';
import { quotaService } from '../../services/teacher/quotaService.js';
import { TokenOperation } from '@prisma/client';
import {
  gamesService,
  ICEBREAKER_CATEGORY_IDS,
  type IcebreakerCategoryId,
} from '../../services/teacher/gamesService.js';
import { logger } from '../../utils/logger.js';

const router = Router();

router.use(authenticateTeacher);
router.use(requireTeacher);

const GAME_RESOURCE_TYPES = {
  connections: 'games_connections',
  icebreaker: 'games_icebreaker',
  vocabulary: 'games_vocabulary',
  trivia: 'games_trivia',
  crossword: 'games_crossword',
} as const;

const GAME_TOKEN_ESTIMATES = {
  connections: 1400,
  icebreaker: 900,
  vocabulary: 1200,
  trivia: 1800,
  crossword: 2500, // Pro model uses more tokens
} as const;

function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: result.error.errors,
      });
    }
    req.body = result.data;
    next();
  };
}

function resolveTokensUsed(tokensUsed: number | null, prompt: string, responseText: string): number | null {
  if (tokensUsed && tokensUsed > 0) return tokensUsed;
  if (prompt && responseText) {
    return quotaService.estimateTokens(prompt + responseText);
  }
  return null;
}

const connectionsSchema = z.object({
  topic: z.string().min(2).max(120).optional(),
  gradeLevel: z.string().min(1).max(40).optional(),
  subject: z.string().min(2).max(80).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  force: z.boolean().optional(),
});

const icebreakerSchema = z.object({
  category: z.enum(ICEBREAKER_CATEGORY_IDS).optional(),
  tone: z.enum(['playful', 'calm', 'academic']).optional(),
  force: z.boolean().optional(),
});

const vocabularySchema = z.object({
  topic: z.string().min(2).max(120),
  gradeLevel: z.string().min(1).max(40).optional(),
  subject: z.string().min(2).max(80).optional(),
  count: z.coerce.number().int().min(4).max(12).default(6),
});

const triviaSchema = z.object({
  topic: z.string().min(2).max(120).optional(),
  theme: z.string().min(2).max(80).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  force: z.boolean().optional(),
});

const crosswordSchema = z.object({
  topic: z.string().min(2).max(120).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  force: z.boolean().optional(),
});

/**
 * POST /api/teacher/games/connections
 * - Daily cached puzzle when no topic and not forced
 * - On-demand generation when forced or a topic is provided
 */
router.post('/connections', validateBody(connectionsSchema), async (req: Request, res: Response) => {
  const teacherId = req.teacher!.id;
  const input = req.body as z.infer<typeof connectionsSchema>;

  const wantsDaily = !input.force && !input.topic;

  try {
    if (wantsDaily) {
      const daily = await gamesService.getDailyConnectionsPuzzle();
      return res.json({
        success: true,
        data: daily.puzzle,
        meta: {
          source: daily.meta.source,
          modelUsed: daily.meta.modelUsed,
          daily: true,
        },
      });
    }

    await quotaService.enforceQuota(
      teacherId,
      TokenOperation.GAMES,
      GAME_TOKEN_ESTIMATES.connections
    );

    const generated = await gamesService.generateConnectionsOnDemand({
      topic: input.topic,
      gradeLevel: input.gradeLevel,
      subject: input.subject,
      difficulty: input.difficulty,
    });

    const tokensUsed = resolveTokensUsed(generated.tokensUsed, generated.prompt, generated.responseText);
    if (tokensUsed) {
      await quotaService.recordUsage({
        teacherId,
        operation: TokenOperation.GAMES,
        tokensUsed,
        modelUsed: generated.modelUsed,
        resourceType: GAME_RESOURCE_TYPES.connections,
      });
    }

    return res.json({
      success: true,
      data: generated.puzzle,
      meta: {
        source: generated.source,
        modelUsed: generated.modelUsed,
        tokensUsed: tokensUsed || undefined,
        daily: false,
      },
    });
  } catch (error) {
    if (error instanceof PaymentRequiredError) {
      return res.status(402).json({ success: false, error: error.message });
    }

    logger.error('Connections route failed', {
      teacherId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to generate connections puzzle',
    });
  }
});

/**
 * POST /api/teacher/games/icebreaker
 * - Daily cached prompts by category unless forced
 * - On-demand generation when forced
 */
router.post('/icebreaker', validateBody(icebreakerSchema), async (req: Request, res: Response) => {
  const teacherId = req.teacher!.id;
  const input = req.body as z.infer<typeof icebreakerSchema>;

  const category: IcebreakerCategoryId = input.category ?? ICEBREAKER_CATEGORY_IDS[0];
  const wantsDaily = !input.force;

  try {
    if (wantsDaily) {
      const daily = await gamesService.getDailyIcebreakerPrompts(category);
      return res.json({
        success: true,
        data: daily.prompts,
        meta: {
          source: daily.meta.source,
          modelUsed: daily.meta.modelUsed,
          daily: true,
        },
      });
    }

    await quotaService.enforceQuota(
      teacherId,
      TokenOperation.GAMES,
      GAME_TOKEN_ESTIMATES.icebreaker
    );

    const generated = await gamesService.generateIcebreakersOnDemand(category, input.tone);

    const tokensUsed = resolveTokensUsed(generated.tokensUsed, generated.prompt, generated.responseText);
    if (tokensUsed) {
      await quotaService.recordUsage({
        teacherId,
        operation: TokenOperation.GAMES,
        tokensUsed,
        modelUsed: generated.modelUsed,
        resourceType: GAME_RESOURCE_TYPES.icebreaker,
      });
    }

    return res.json({
      success: true,
      data: generated.prompts,
      meta: {
        source: generated.source,
        modelUsed: generated.modelUsed,
        tokensUsed: tokensUsed || undefined,
        daily: false,
      },
    });
  } catch (error) {
    if (error instanceof PaymentRequiredError) {
      return res.status(402).json({ success: false, error: error.message });
    }

    logger.error('Icebreaker route failed', {
      teacherId,
      category,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to generate icebreaker prompts',
    });
  }
});

/**
 * POST /api/teacher/games/vocabulary
 * - Always on-demand, quota enforced
 */
router.post('/vocabulary', validateBody(vocabularySchema), async (req: Request, res: Response) => {
  const teacherId = req.teacher!.id;
  const input = req.body as z.infer<typeof vocabularySchema>;

  try {
    await quotaService.enforceQuota(
      teacherId,
      TokenOperation.GAMES,
      GAME_TOKEN_ESTIMATES.vocabulary
    );

    const generated = await gamesService.generateVocabularyOnDemand({
      topic: input.topic,
      gradeLevel: input.gradeLevel,
      subject: input.subject,
      count: input.count,
    });

    const tokensUsed = resolveTokensUsed(generated.tokensUsed, generated.prompt, generated.responseText);
    if (tokensUsed) {
      await quotaService.recordUsage({
        teacherId,
        operation: TokenOperation.GAMES,
        tokensUsed,
        modelUsed: generated.modelUsed,
        resourceType: GAME_RESOURCE_TYPES.vocabulary,
      });
    }

    return res.json({
      success: true,
      data: {
        entries: generated.entries,
        source: generated.source,
      },
      meta: {
        source: generated.source,
        modelUsed: generated.modelUsed,
        tokensUsed: tokensUsed || undefined,
        daily: false,
      },
    });
  } catch (error) {
    if (error instanceof PaymentRequiredError) {
      return res.status(402).json({ success: false, error: error.message });
    }

    logger.error('Vocabulary route failed', {
      teacherId,
      topic: input.topic,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to generate vocabulary',
    });
  }
});

/**
 * POST /api/teacher/games/trivia
 * - Daily cached trivia when not forced and no topic
 * - On-demand generation when forced or a topic is provided
 */
router.post('/trivia', validateBody(triviaSchema), async (req: Request, res: Response) => {
  const teacherId = req.teacher!.id;
  const input = req.body as z.infer<typeof triviaSchema>;

  const wantsDaily = !input.force && !input.topic;

  try {
    if (wantsDaily) {
      const daily = await gamesService.getDailyTrivia();
      return res.json({
        success: true,
        data: daily.puzzle,
        meta: {
          source: daily.meta.source,
          modelUsed: daily.meta.modelUsed,
          daily: true,
        },
      });
    }

    await quotaService.enforceQuota(
      teacherId,
      TokenOperation.GAMES,
      GAME_TOKEN_ESTIMATES.trivia
    );

    const generated = await gamesService.generateTriviaOnDemand({
      topic: input.topic,
      theme: input.theme,
      difficulty: input.difficulty,
    });

    const tokensUsed = resolveTokensUsed(generated.tokensUsed, generated.prompt, generated.responseText);
    if (tokensUsed) {
      await quotaService.recordUsage({
        teacherId,
        operation: TokenOperation.GAMES,
        tokensUsed,
        modelUsed: generated.modelUsed,
        resourceType: GAME_RESOURCE_TYPES.trivia,
      });
    }

    return res.json({
      success: true,
      data: generated.puzzle,
      meta: {
        source: generated.source,
        modelUsed: generated.modelUsed,
        tokensUsed: tokensUsed || undefined,
        daily: false,
      },
    });
  } catch (error) {
    if (error instanceof PaymentRequiredError) {
      return res.status(402).json({ success: false, error: error.message });
    }

    logger.error('Trivia route failed', {
      teacherId,
      topic: input.topic,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to generate trivia',
    });
  }
});

/**
 * POST /api/teacher/games/crossword
 * - Daily cached crossword when not forced and no topic
 * - On-demand generation when forced or a topic is provided
 */
router.post('/crossword', validateBody(crosswordSchema), async (req: Request, res: Response) => {
  const teacherId = req.teacher!.id;
  const input = req.body as z.infer<typeof crosswordSchema>;

  const wantsDaily = !input.force && !input.topic;

  try {
    if (wantsDaily) {
      const daily = await gamesService.getDailyCrossword();
      return res.json({
        success: true,
        data: daily.puzzle,
        meta: {
          source: daily.meta.source,
          modelUsed: daily.meta.modelUsed,
          daily: true,
        },
      });
    }

    await quotaService.enforceQuota(
      teacherId,
      TokenOperation.GAMES,
      GAME_TOKEN_ESTIMATES.crossword
    );

    const generated = await gamesService.generateCrosswordOnDemand({
      topic: input.topic,
      difficulty: input.difficulty,
    });

    const tokensUsed = resolveTokensUsed(generated.tokensUsed, generated.prompt, generated.responseText);
    if (tokensUsed) {
      await quotaService.recordUsage({
        teacherId,
        operation: TokenOperation.GAMES,
        tokensUsed,
        modelUsed: generated.modelUsed,
        resourceType: GAME_RESOURCE_TYPES.crossword,
      });
    }

    return res.json({
      success: true,
      data: generated.puzzle,
      meta: {
        source: generated.source,
        modelUsed: generated.modelUsed,
        tokensUsed: tokensUsed || undefined,
        daily: false,
      },
    });
  } catch (error) {
    if (error instanceof PaymentRequiredError) {
      return res.status(402).json({ success: false, error: error.message });
    }

    logger.error('Crossword route failed', {
      teacherId,
      topic: input.topic,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to generate crossword',
    });
  }
});

export default router;
