/**
 * Parent Language Preference Routes
 *
 * Handles language preferences for parent communications:
 * - Get available languages
 * - Get/set preferred language
 * - Translate progress reports on demand
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireParent } from '../../middleware/auth.js';
import { parentTranslationService } from '../../services/parent/translationService.js';
import { progressReportService } from '../../services/parent/progressReportService.js';
import { prisma } from '../../config/database.js';
import { isLanguageSupported, getLanguageName, isRTL } from '../../config/translateGemma.js';

const router = Router();

// =============================================================================
// PUBLIC ENDPOINTS (No auth required)
// =============================================================================

/**
 * GET /api/parent/language/available
 * Get list of available languages for parent communications
 */
router.get('/available', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const languages = parentTranslationService.getAvailableLanguages();

    // Sort by primary languages first, then alphabetically
    const sortedLanguages = languages.sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      return a.name.localeCompare(b.name);
    });

    res.json({
      success: true,
      data: {
        languages: sortedLanguages,
        default: 'en',
      },
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// PROTECTED ENDPOINTS (Auth required)
// =============================================================================

/**
 * GET /api/parent/language
 * Get current language preference
 */
router.get(
  '/',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.parent!.id;
      const languageCode = await parentTranslationService.getParentLanguagePreference(parentId);

      res.json({
        success: true,
        data: {
          code: languageCode,
          name: getLanguageName(languageCode),
          isRTL: isRTL(languageCode),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/parent/language
 * Update language preference
 */
router.put(
  '/',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.parent!.id;
      const { languageCode } = req.body;

      if (!languageCode) {
        return res.status(400).json({
          success: false,
          error: 'Language code is required.',
        });
      }

      const result = await parentTranslationService.setParentLanguagePreference(
        parentId,
        languageCode
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error,
        });
      }

      res.json({
        success: true,
        data: {
          code: result.language,
          name: getLanguageName(result.language!),
          isRTL: isRTL(result.language!),
        },
        message: `Language preference updated to ${getLanguageName(result.language!)}`,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/parent/language/progress-report/:childId
 * Get translated progress report for a child
 */
router.get(
  '/progress-report/:childId',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.parent!.id;
      const { childId } = req.params;
      const { days = '7' } = req.query;

      // Verify child belongs to parent
      const child = await prisma.child.findFirst({
        where: {
          id: childId,
          parentId,
        },
      });

      if (!child) {
        return res.status(404).json({
          success: false,
          error: 'Child not found.',
        });
      }

      // Generate progress report
      const periodDays = parseInt(days as string, 10) || 7;
      const report = await progressReportService.generateProgressReport(childId, periodDays);

      // Translate to parent's preferred language
      const translatedReport = await parentTranslationService.translateProgressReport(
        report,
        parentId
      );

      res.json({
        success: true,
        data: translatedReport,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/parent/language/translate
 * Translate arbitrary text to parent's preferred language
 * Useful for custom notifications or messages
 */
router.post(
  '/translate',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.parent!.id;
      const { text, targetLanguage } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          error: 'Text to translate is required.',
        });
      }

      // Use specified target language or parent's preference
      let langCode = targetLanguage;
      if (!langCode) {
        langCode = await parentTranslationService.getParentLanguagePreference(parentId);
      }

      if (!isLanguageSupported(langCode)) {
        return res.status(400).json({
          success: false,
          error: `Language '${langCode}' is not supported.`,
        });
      }

      // Translate using the notification method (same logic)
      const translatedNotification = await parentTranslationService.translateNotification(
        { title: '', body: text },
        parentId
      );

      res.json({
        success: true,
        data: {
          original: text,
          translated: translatedNotification.translated.body,
          language: translatedNotification.language,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
