/**
 * Parent Translation Service
 *
 * Handles translation of parent-facing communications (progress reports,
 * notifications, emails) based on their preferred language setting.
 *
 * Uses TranslateGemma (Google's open translation model) as primary engine
 * with Google Translate as fallback for reliability.
 */

import { Parent } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { translateGemmaService } from '../ai/translateGemmaService.js';
import {
  isLanguageSupported,
  SupportedLanguage,
  getLanguageName,
  isRTL,
  TRANSLATE_GEMMA_CONFIG,
} from '../../config/translateGemma.js';
import { geminiService } from '../ai/geminiService.js';
import { logger } from '../../utils/logger.js';
import type { ProgressReportData } from './progressReportService.js';

/**
 * Translated progress report with language metadata
 */
export interface TranslatedProgressReport {
  original: ProgressReportData;
  translated: {
    summary: string;
    highlights: string[];
    areasForFocus: string[];
    communicationTone: string;
  };
  language: {
    code: string;
    name: string;
    isRTL: boolean;
  };
}

/**
 * Notification to translate
 */
export interface NotificationContent {
  title: string;
  body: string;
  actionText?: string;
}

/**
 * Translated notification
 */
export interface TranslatedNotification {
  original: NotificationContent;
  translated: NotificationContent;
  language: {
    code: string;
    name: string;
    isRTL: boolean;
  };
}

/**
 * Email content to translate
 */
export interface EmailContent {
  subject: string;
  greeting: string;
  body: string[];
  callToAction?: string;
  signoff: string;
}

/**
 * Translated email
 */
export interface TranslatedEmail {
  original: EmailContent;
  translated: EmailContent;
  language: {
    code: string;
    name: string;
    isRTL: boolean;
  };
}

class ParentTranslationService {
  /**
   * Get parent's preferred language from database
   */
  async getParentLanguagePreference(parentId: string): Promise<SupportedLanguage> {
    const parent = await prisma.parent.findUnique({
      where: { id: parentId },
      select: { preferredLanguage: true },
    });

    const langCode = parent?.preferredLanguage || 'en';

    // Validate and return supported language, default to English
    if (isLanguageSupported(langCode)) {
      return langCode;
    }

    logger.warn('Parent has unsupported language preference, defaulting to English', {
      parentId,
      preferredLanguage: langCode,
    });

    return 'en';
  }

  /**
   * Update parent's language preference
   */
  async setParentLanguagePreference(
    parentId: string,
    languageCode: string
  ): Promise<{ success: boolean; language?: SupportedLanguage; error?: string }> {
    if (!isLanguageSupported(languageCode)) {
      return {
        success: false,
        error: `Language '${languageCode}' is not supported. Supported languages: ${TRANSLATE_GEMMA_CONFIG.supportedLanguages.join(', ')}`,
      };
    }

    try {
      await prisma.parent.update({
        where: { id: parentId },
        data: { preferredLanguage: languageCode },
      });

      logger.info('Updated parent language preference', {
        parentId,
        languageCode,
      });

      return {
        success: true,
        language: languageCode as SupportedLanguage,
      };
    } catch (error) {
      logger.error('Failed to update parent language preference', {
        parentId,
        languageCode,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return {
        success: false,
        error: 'Failed to update language preference',
      };
    }
  }

  /**
   * Translate a progress report to parent's preferred language
   */
  async translateProgressReport(
    report: ProgressReportData,
    parentId: string
  ): Promise<TranslatedProgressReport> {
    const targetLanguage = await this.getParentLanguagePreference(parentId);

    // If English, return original without translation
    if (targetLanguage === 'en') {
      return {
        original: report,
        translated: {
          summary: report.summary,
          highlights: report.highlights,
          areasForFocus: report.areasForFocus,
          communicationTone: report.communicationTone,
        },
        language: {
          code: 'en',
          name: getLanguageName('en'),
          isRTL: false,
        },
      };
    }

    logger.info('Translating progress report for parent', {
      parentId,
      targetLanguage,
      reportDate: report.reportDate,
    });

    // Translate each component
    const [
      translatedSummary,
      translatedHighlights,
      translatedAreasForFocus,
    ] = await Promise.all([
      this.translateText(report.summary, targetLanguage),
      this.translateTexts(report.highlights, targetLanguage),
      this.translateTexts(report.areasForFocus, targetLanguage),
    ]);

    return {
      original: report,
      translated: {
        summary: translatedSummary,
        highlights: translatedHighlights,
        areasForFocus: translatedAreasForFocus,
        communicationTone: report.communicationTone,
      },
      language: {
        code: targetLanguage,
        name: getLanguageName(targetLanguage),
        isRTL: isRTL(targetLanguage),
      },
    };
  }

  /**
   * Translate a notification to parent's preferred language
   */
  async translateNotification(
    notification: NotificationContent,
    parentId: string
  ): Promise<TranslatedNotification> {
    const targetLanguage = await this.getParentLanguagePreference(parentId);

    // If English, return original
    if (targetLanguage === 'en') {
      return {
        original: notification,
        translated: notification,
        language: {
          code: 'en',
          name: getLanguageName('en'),
          isRTL: false,
        },
      };
    }

    logger.info('Translating notification for parent', {
      parentId,
      targetLanguage,
      title: notification.title.substring(0, 50),
    });

    // Translate notification components
    const [translatedTitle, translatedBody, translatedAction] = await Promise.all([
      this.translateText(notification.title, targetLanguage),
      this.translateText(notification.body, targetLanguage),
      notification.actionText
        ? this.translateText(notification.actionText, targetLanguage)
        : Promise.resolve(undefined),
    ]);

    return {
      original: notification,
      translated: {
        title: translatedTitle,
        body: translatedBody,
        actionText: translatedAction,
      },
      language: {
        code: targetLanguage,
        name: getLanguageName(targetLanguage),
        isRTL: isRTL(targetLanguage),
      },
    };
  }

  /**
   * Translate email content to parent's preferred language
   */
  async translateEmail(
    email: EmailContent,
    parentId: string
  ): Promise<TranslatedEmail> {
    const targetLanguage = await this.getParentLanguagePreference(parentId);

    // If English, return original
    if (targetLanguage === 'en') {
      return {
        original: email,
        translated: email,
        language: {
          code: 'en',
          name: getLanguageName('en'),
          isRTL: false,
        },
      };
    }

    logger.info('Translating email for parent', {
      parentId,
      targetLanguage,
      subject: email.subject.substring(0, 50),
    });

    // Translate email components
    const [
      translatedSubject,
      translatedGreeting,
      translatedBody,
      translatedCTA,
      translatedSignoff,
    ] = await Promise.all([
      this.translateText(email.subject, targetLanguage),
      this.translateText(email.greeting, targetLanguage),
      this.translateTexts(email.body, targetLanguage),
      email.callToAction
        ? this.translateText(email.callToAction, targetLanguage)
        : Promise.resolve(undefined),
      this.translateText(email.signoff, targetLanguage),
    ]);

    return {
      original: email,
      translated: {
        subject: translatedSubject,
        greeting: translatedGreeting,
        body: translatedBody,
        callToAction: translatedCTA,
        signoff: translatedSignoff,
      },
      language: {
        code: targetLanguage,
        name: getLanguageName(targetLanguage),
        isRTL: isRTL(targetLanguage),
      },
    };
  }

  /**
   * Get list of available languages for UI display
   */
  getAvailableLanguages(): Array<{
    code: SupportedLanguage;
    name: string;
    isRTL: boolean;
    isPrimary: boolean;
  }> {
    return TRANSLATE_GEMMA_CONFIG.supportedLanguages.map(code => ({
      code,
      name: getLanguageName(code),
      isRTL: isRTL(code),
      isPrimary: TRANSLATE_GEMMA_CONFIG.primaryLanguages.includes(code),
    }));
  }

  /**
   * Translate a single text string
   * Uses TranslateGemma via geminiService.translateText which has fallback logic
   */
  private async translateText(text: string, targetLanguage: SupportedLanguage): Promise<string> {
    if (!text || text.trim().length === 0) {
      return text;
    }

    try {
      // First try TranslateGemma directly for better performance
      const translateGemmaResult = await translateGemmaService.translate({
        text,
        targetLanguage,
        sourceLanguage: 'en',
      });

      if (translateGemmaResult) {
        return translateGemmaResult.translatedText;
      }

      // Fall back to geminiService.translateText which has Google Translate fallback
      const result = await geminiService.translateText(text, targetLanguage, {
        ageGroup: 'OLDER', // Parent communication uses adult language
      });

      return result.translatedText;
    } catch (error) {
      logger.error('Translation failed, returning original text', {
        error: error instanceof Error ? error.message : 'Unknown error',
        textLength: text.length,
        targetLanguage,
      });

      // Return original text if translation fails
      return text;
    }
  }

  /**
   * Translate multiple text strings in batch
   */
  private async translateTexts(
    texts: string[],
    targetLanguage: SupportedLanguage
  ): Promise<string[]> {
    if (!texts || texts.length === 0) {
      return texts;
    }

    // Try batch translation first
    const batchResult = await translateGemmaService.translateBatch({
      texts,
      targetLanguage,
      sourceLanguage: 'en',
    });

    if (batchResult) {
      return batchResult.map(r => r.translatedText);
    }

    // Fall back to individual translations
    return Promise.all(
      texts.map(text => this.translateText(text, targetLanguage))
    );
  }
}

export const parentTranslationService = new ParentTranslationService();
