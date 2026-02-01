import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { quotaService } from './quotaService.js';
import { TokenOperation } from '@prisma/client';
import { logger } from '../../utils/logger.js';

const MODEL = config.gemini.models.flash;
const SELECTION_OPERATION = TokenOperation.BRAINSTORM;

export interface SelectionActionResult {
  originalText: string;
  resultText: string;
  tokensUsed: number;
}

export interface TranslationResult extends SelectionActionResult {
  targetLanguage: string;
  pronunciation?: string;
}

export const selectionActionsService = {
  async simplify(
    text: string,
    targetGrade: string,
    teacherId: string
  ): Promise<SelectionActionResult> {
    const estimatedTokens = 1500;
    await quotaService.enforceQuota(teacherId, SELECTION_OPERATION, estimatedTokens);

    const prompt = `Simplify the following text for ${targetGrade} grade students.
Keep the core meaning but use simpler vocabulary and shorter sentences.
Do not add any explanation, just provide the simplified text.

Text to simplify:
${text}`;

    const model = genAI.getGenerativeModel({
      model: MODEL,
      safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const resultText = response.text().trim();
    const tokensUsed = response.usageMetadata?.totalTokenCount || estimatedTokens;

    await quotaService.recordUsage({
      teacherId,
      operation: SELECTION_OPERATION,
      tokensUsed,
      modelUsed: MODEL,
      resourceType: 'selection_simplify',
    });

    return { originalText: text, resultText, tokensUsed };
  },

  async redraft(
    text: string,
    style: string | undefined,
    teacherId: string
  ): Promise<SelectionActionResult> {
    const estimatedTokens = 2000;
    await quotaService.enforceQuota(teacherId, SELECTION_OPERATION, estimatedTokens);

    const styleInstructions = style
      ? `Rewrite in a ${style} style.`
      : 'Rewrite in a different way while keeping the same meaning.';

    const prompt = `${styleInstructions}
Do not add any explanation, just provide the rewritten text.

Text to rewrite:
${text}`;

    const model = genAI.getGenerativeModel({
      model: MODEL,
      safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const resultText = response.text().trim();
    const tokensUsed = response.usageMetadata?.totalTokenCount || estimatedTokens;

    await quotaService.recordUsage({
      teacherId,
      operation: SELECTION_OPERATION,
      tokensUsed,
      modelUsed: MODEL,
      resourceType: 'selection_redraft',
    });

    return { originalText: text, resultText, tokensUsed };
  },

  async expand(
    text: string,
    teacherId: string
  ): Promise<SelectionActionResult> {
    const estimatedTokens = 2500;
    await quotaService.enforceQuota(teacherId, SELECTION_OPERATION, estimatedTokens);

    const prompt = `Expand the following text with more detail, examples, and explanation.
Maintain the same tone and style, but make it more comprehensive.
Do not add any meta-explanation, just provide the expanded text.

Text to expand:
${text}`;

    const model = genAI.getGenerativeModel({
      model: MODEL,
      safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const resultText = response.text().trim();
    const tokensUsed = response.usageMetadata?.totalTokenCount || estimatedTokens;

    await quotaService.recordUsage({
      teacherId,
      operation: SELECTION_OPERATION,
      tokensUsed,
      modelUsed: MODEL,
      resourceType: 'selection_expand',
    });

    return { originalText: text, resultText, tokensUsed };
  },

  async translate(
    text: string,
    targetLanguage: string,
    teacherId: string
  ): Promise<TranslationResult> {
    const estimatedTokens = 1000;
    await quotaService.enforceQuota(teacherId, SELECTION_OPERATION, estimatedTokens);

    const prompt = `Translate the following text to ${targetLanguage}.
Return ONLY a JSON object with this structure:
{
  "translatedText": "the translation",
  "pronunciation": "optional pronunciation guide for non-Latin scripts"
}

Text to translate:
${text}`;

    const model = genAI.getGenerativeModel({
      model: MODEL,
      safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text().trim();
    const tokensUsed = response.usageMetadata?.totalTokenCount || estimatedTokens;

    let parsed: { translatedText?: string; pronunciation?: string | null } = {};
    try {
      parsed = JSON.parse(extractJSON(responseText));
    } catch (error) {
      logger.warn('Failed to parse translation response', {
        error: (error as Error)?.message || error,
        responseText: responseText.slice(0, 200),
      });
    }

    const resultText = parsed.translatedText?.toString().trim() || responseText;
    const pronunciation = parsed.pronunciation ? parsed.pronunciation.toString().trim() : undefined;

    await quotaService.recordUsage({
      teacherId,
      operation: SELECTION_OPERATION,
      tokensUsed,
      modelUsed: MODEL,
      resourceType: 'selection_translate',
    });

    return {
      originalText: text,
      resultText,
      targetLanguage,
      pronunciation,
      tokensUsed,
    };
  },
};

function extractJSON(text: string): string {
  try {
    JSON.parse(text);
    return text;
  } catch {
    // Continue to extraction logic
  }

  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    const extracted = jsonBlockMatch[1].trim();
    try {
      JSON.parse(extracted);
      return extracted;
    } catch {
      // Continue
    }
  }

  const jsonObjectMatch = text.match(/\{[\s\S]*\}/);
  if (jsonObjectMatch) {
    return jsonObjectMatch[0];
  }

  return text;
}
