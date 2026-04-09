// Edit Analysis Service — Teacher Intelligence Platform
// Phase 4.9: Edit Intelligence Loop
//
// Every edit a teacher makes to a generated material is recorded as a
// MaterialEdit row and analyzed by Gemini Flash to extract *why* they changed
// it (vocabulary, difficulty, length, added example, etc.). Extracted signals
// are stored back on the MaterialEdit row and then aggregated into the
// TeacherPreferenceProfile by preferenceAnalysisService.updatePreferencesFromEdits().
//
// This is the single richest signal source in the platform — it tells us
// exactly what the generation engine got wrong, every single time.

import { MaterialEditType, MaterialEdit } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

const FLASH_MODEL = config.gemini.models.flash;

// Cap the text we send to Gemini to keep the prompt bounded.
const MAX_CONTENT_CHARS = 4000;

// ============================================
// TYPES
// ============================================

export interface RecordEditInput {
  materialId: string;
  editType: MaterialEditType;
  sectionType?: string | null;
  originalContent?: string | null;
  newContent?: string | null;
}

export type ExtractedEditSignals = {
  vocabularyChange?: 'simplified' | 'elevated' | 'no_change';
  difficultyChange?: 'easier' | 'harder' | 'no_change';
  contentChange?:
    | 'added_examples'
    | 'removed_fluff'
    | 'changed_approach'
    | 'added_scaffolding'
    | 'added_extension'
    | 'other';
  formatChange?: 'shorter' | 'longer' | 'restructured' | 'no_change';
  toneChange?: 'more_formal' | 'more_casual' | 'more_encouraging' | 'no_change';
  specificPatterns?: string[];
  // DELETE-specific
  likelyReason?:
    | 'too_advanced'
    | 'too_basic'
    | 'off_topic'
    | 'redundant'
    | 'wrong_format'
    | 'unnecessary';
  // ADD-specific
  missingElement?:
    | 'examples'
    | 'scaffolding'
    | 'visual_support'
    | 'real_world_context'
    | 'differentiation'
    | 'instructions'
    | 'extension_activity'
    | 'other';
};

// ============================================
// RECORD AN EDIT
// ============================================

/**
 * Persist a new MaterialEdit row. Called synchronously from the edits route
 * at the moment the teacher performs the edit. Returns the edit record so the
 * route can queue an async analysis job with the ID.
 */
async function recordEdit(
  teacherId: string,
  input: RecordEditInput
): Promise<MaterialEdit> {
  // Verify the material belongs to this teacher — ownership check.
  const material = await prisma.teacherMaterial.findFirst({
    where: { id: input.materialId, teacherId },
    select: { id: true, type: true },
  });
  if (!material) {
    throw new Error('Material not found');
  }

  const edit = await prisma.materialEdit.create({
    data: {
      teacherId,
      materialId: input.materialId,
      editType: input.editType,
      sectionType: input.sectionType ?? null,
      originalContent: truncate(input.originalContent ?? null, MAX_CONTENT_CHARS),
      newContent: truncate(input.newContent ?? null, MAX_CONTENT_CHARS),
    },
  });

  // Mark the underlying material as edited. This keeps legacy consumers
  // (preferenceAnalysisService.analyzeCommonEdits, MaterialCard) accurate
  // without forcing them to query MaterialEdit directly.
  if (input.editType !== 'REGENERATE' || input.newContent) {
    await prisma.teacherMaterial.update({
      where: { id: input.materialId },
      data: { edited: true },
    });
  }

  logger.info('Material edit recorded', {
    teacherId,
    materialId: input.materialId,
    editType: input.editType,
    sectionType: input.sectionType,
    editId: edit.id,
  });

  return edit;
}

// ============================================
// ANALYZE AN EDIT (Gemini Flash)
// ============================================

/**
 * Send an edit to Gemini for signal extraction. Called from the edit
 * analysis BullMQ job. Writes extractedSignals back to the row and marks
 * it analyzed. Non-fatal on Gemini failure — marks the row analyzed with
 * a minimal fallback signal so we don't re-try forever.
 */
async function analyzeEdit(editId: string): Promise<ExtractedEditSignals | null> {
  const edit = await prisma.materialEdit.findUnique({
    where: { id: editId },
    include: {
      material: {
        select: {
          type: true,
          subject: true,
          gradeLevel: true,
          topics: true,
        },
      },
    },
  });

  if (!edit) {
    logger.warn('analyzeEdit: edit not found', { editId });
    return null;
  }
  if (edit.analyzed) {
    logger.debug('analyzeEdit: already analyzed', { editId });
    return (edit.extractedSignals as ExtractedEditSignals) || null;
  }

  const context = {
    materialType: edit.material.type,
    subject: edit.material.subject,
    gradeLevel: edit.material.gradeLevel,
    sectionType: edit.sectionType || 'content',
  };

  let signals: ExtractedEditSignals | null = null;

  try {
    switch (edit.editType) {
      case 'TEXT_EDIT':
      case 'REGENERATE':
        signals = await analyzeDiff(edit, context);
        break;
      case 'DELETE':
        signals = await analyzeDeletion(edit, context);
        break;
      case 'ADD':
        signals = await analyzeAddition(edit, context);
        break;
    }
  } catch (err) {
    logger.warn('analyzeEdit: Gemini extraction failed (non-fatal)', {
      editId,
      editType: edit.editType,
      error: (err as Error).message,
    });
    // Fallback — mark analyzed with empty signals so we don't retry forever.
    signals = { specificPatterns: [] };
  }

  await prisma.materialEdit.update({
    where: { id: editId },
    data: {
      extractedSignals: (signals ?? {}) as any,
      analyzed: true,
      analyzedAt: new Date(),
    },
  });

  return signals;
}

// ============================================
// GEMINI PROMPT BUILDERS
// ============================================

interface EditContext {
  materialType: string;
  subject: string;
  gradeLevel: string;
  sectionType: string;
}

/**
 * For TEXT_EDIT and REGENERATE — we have before/after text and can compute
 * what changed on every dimension we care about.
 */
async function analyzeDiff(
  edit: MaterialEdit,
  context: EditContext
): Promise<ExtractedEditSignals> {
  // If we don't have both sides of the diff (e.g. a queued regeneration that
  // hasn't produced output yet), treat it as a weak regenerate-only signal.
  if (!edit.originalContent || !edit.newContent) {
    return {
      specificPatterns: [
        `teacher regenerated ${context.sectionType} in ${context.materialType.toLowerCase()}`,
      ],
    };
  }

  const prompt = [
    `A teacher generated educational content and then edited it.`,
    `Analyze what changed and why.`,
    ``,
    `Material type: ${context.materialType}`,
    `Subject: ${context.subject}`,
    `Grade level: ${context.gradeLevel}`,
    `Section: ${context.sectionType}`,
    ``,
    `Original (AI-generated):`,
    edit.originalContent,
    ``,
    `Teacher's version:`,
    edit.newContent,
    ``,
    `Return ONLY valid JSON with this exact shape (no prose, no markdown):`,
    `{`,
    `  "vocabularyChange": "simplified" | "elevated" | "no_change",`,
    `  "difficultyChange": "easier" | "harder" | "no_change",`,
    `  "contentChange": "added_examples" | "removed_fluff" | "changed_approach" | "added_scaffolding" | "added_extension" | "other",`,
    `  "formatChange": "shorter" | "longer" | "restructured" | "no_change",`,
    `  "toneChange": "more_formal" | "more_casual" | "more_encouraging" | "no_change",`,
    `  "specificPatterns": ["short observations about what the teacher changed and why — 5-10 words each, max 4 items"]`,
    `}`,
  ].join('\n');

  return runGeminiJson(prompt);
}

/**
 * For DELETE — we only have the original content. Ask Gemini to infer why
 * a teacher would delete it.
 */
async function analyzeDeletion(
  edit: MaterialEdit,
  context: EditContext
): Promise<ExtractedEditSignals> {
  if (!edit.originalContent) {
    return {
      likelyReason: 'unnecessary',
      specificPatterns: [`deleted ${context.sectionType} from ${context.materialType.toLowerCase()}`],
    };
  }

  const prompt = [
    `A teacher deleted this section from a generated ${context.materialType.toLowerCase()} for ${context.gradeLevel} ${context.subject}:`,
    ``,
    `Deleted content:`,
    edit.originalContent,
    ``,
    `Why might a teacher delete this? Return ONLY valid JSON:`,
    `{`,
    `  "likelyReason": "too_advanced" | "too_basic" | "off_topic" | "redundant" | "wrong_format" | "unnecessary",`,
    `  "specificPatterns": ["short observations about what was wrong — 5-10 words each, max 3 items"]`,
    `}`,
  ].join('\n');

  return runGeminiJson(prompt);
}

/**
 * For ADD — we only have the new content. Ask Gemini what the teacher felt
 * was missing from the generated material.
 */
async function analyzeAddition(
  edit: MaterialEdit,
  context: EditContext
): Promise<ExtractedEditSignals> {
  if (!edit.newContent) {
    return {
      missingElement: 'other',
      specificPatterns: [`added ${context.sectionType} to ${context.materialType.toLowerCase()}`],
    };
  }

  const prompt = [
    `A teacher manually added this content to a generated ${context.materialType.toLowerCase()} for ${context.gradeLevel} ${context.subject}:`,
    ``,
    `Added content:`,
    edit.newContent,
    ``,
    `What was missing from the generated material? Return ONLY valid JSON:`,
    `{`,
    `  "missingElement": "examples" | "scaffolding" | "visual_support" | "real_world_context" | "differentiation" | "instructions" | "extension_activity" | "other",`,
    `  "specificPatterns": ["short observations about what the teacher felt was needed — 5-10 words each, max 3 items"]`,
    `}`,
  ].join('\n');

  return runGeminiJson(prompt);
}

// ============================================
// GEMINI HELPER
// ============================================

async function runGeminiJson(prompt: string): Promise<ExtractedEditSignals> {
  const model = genAI.getGenerativeModel({
    model: FLASH_MODEL,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.2, // Low — we want consistent classification, not creativity
      maxOutputTokens: 500,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const parsed = JSON.parse(text);
    return sanitizeSignals(parsed);
  } catch {
    // Try pulling JSON out of a fenced code block
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      try {
        return sanitizeSignals(JSON.parse(match[1].trim()));
      } catch {
        // fall through
      }
    }
    logger.warn('editAnalysisService: failed to parse Gemini JSON', {
      textSnippet: text.slice(0, 200),
    });
    return { specificPatterns: [] };
  }
}

/**
 * Clamp AI output to the fields we know about — Gemini sometimes invents
 * extra keys or returns arrays too long to be useful.
 */
function sanitizeSignals(raw: any): ExtractedEditSignals {
  const out: ExtractedEditSignals = {};

  const enumField = <K extends keyof ExtractedEditSignals>(
    key: K,
    allowed: readonly string[]
  ) => {
    const v = raw?.[key];
    if (typeof v === 'string' && allowed.includes(v)) {
      (out as any)[key] = v;
    }
  };

  enumField('vocabularyChange', ['simplified', 'elevated', 'no_change']);
  enumField('difficultyChange', ['easier', 'harder', 'no_change']);
  enumField('contentChange', [
    'added_examples',
    'removed_fluff',
    'changed_approach',
    'added_scaffolding',
    'added_extension',
    'other',
  ]);
  enumField('formatChange', ['shorter', 'longer', 'restructured', 'no_change']);
  enumField('toneChange', [
    'more_formal',
    'more_casual',
    'more_encouraging',
    'no_change',
  ]);
  enumField('likelyReason', [
    'too_advanced',
    'too_basic',
    'off_topic',
    'redundant',
    'wrong_format',
    'unnecessary',
  ]);
  enumField('missingElement', [
    'examples',
    'scaffolding',
    'visual_support',
    'real_world_context',
    'differentiation',
    'instructions',
    'extension_activity',
    'other',
  ]);

  if (Array.isArray(raw?.specificPatterns)) {
    out.specificPatterns = raw.specificPatterns
      .filter((p: any) => typeof p === 'string' && p.trim().length > 0)
      .slice(0, 5)
      .map((p: string) => p.slice(0, 120));
  }

  return out;
}

// ============================================
// GENERATION CONTEXT INJECTION
// ============================================

/**
 * Build a compact prompt snippet capturing what the system has learned from
 * this teacher's edits. Injected into Gemini system prompts for every
 * material generation call so new materials match the teacher's style from
 * the start — minimizing the editing they'll need to do. Returns empty
 * string if the learning confidence isn't high enough yet.
 *
 * This is the payoff of the whole Edit Intelligence Loop: what starts as
 * edit capture ends as prompt guidance.
 */
async function buildEditPreferencesContext(
  teacherId: string
): Promise<string> {
  const profile = await prisma.teacherPreferenceProfile.findUnique({
    where: { teacherId },
    select: {
      totalEdits: true,
      totalApprovedNoEdit: true,
      vocabularyTendency: true,
      difficultyTendency: true,
      lengthTendency: true,
      toneTendency: true,
      learnedPatterns: true,
      typePreferences: true,
    },
  });

  if (!profile) return '';
  const totalEdits = profile.totalEdits ?? 0;
  // Need a meaningful sample before we start dictating to the model.
  if (totalEdits < 5) return '';

  const lines: string[] = [];
  const vocab = profile.vocabularyTendency;
  const diff = profile.difficultyTendency;
  const len = profile.lengthTendency;
  const tone = profile.toneTendency;

  if (vocab === 'simplifies_consistently') {
    lines.push('- Vocabulary: use simpler, more accessible language — this teacher consistently simplifies generated vocabulary.');
  } else if (vocab === 'elevates_consistently') {
    lines.push('- Vocabulary: use richer, more advanced vocabulary — this teacher consistently raises the language level.');
  }

  if (diff === 'makes_easier_consistently') {
    lines.push('- Difficulty: target slightly below grade level — this teacher consistently makes content easier for their class.');
  } else if (diff === 'makes_harder_consistently') {
    lines.push('- Difficulty: lean slightly above grade level — this teacher consistently increases challenge.');
  }

  if (len === 'shortens_consistently') {
    lines.push('- Length: keep sections concise — 2-3 sentences for instructions, no filler. This teacher consistently shortens generated content.');
  } else if (len === 'lengthens_consistently') {
    lines.push('- Length: provide fuller explanations and additional detail — this teacher consistently expands generated content.');
  }

  if (tone && tone !== 'neutral') {
    const toneLabel = tone.replace(/_/g, ' ');
    lines.push(`- Tone: ${toneLabel} — this teacher has rewritten generated content in this direction repeatedly.`);
  }

  // Specific learned patterns (only ones with high confidence)
  const patterns = Array.isArray(profile.learnedPatterns)
    ? (profile.learnedPatterns as Array<{
        pattern: string;
        confidence: number;
        sampleSize: number;
      }>)
    : [];
  const strongPatterns = patterns
    .filter((p) => p && typeof p.pattern === 'string' && (p.confidence ?? 0) >= 0.5)
    .slice(0, 5);
  if (strongPatterns.length > 0) {
    lines.push('- Specific patterns learned from edits:');
    for (const p of strongPatterns) {
      lines.push(`    • ${p.pattern}`);
    }
  }

  if (lines.length === 0) return '';

  const totalApprovedNoEdit = profile.totalApprovedNoEdit ?? 0;
  const samplesNote =
    totalEdits > 0
      ? ` (Based on ${totalEdits} previous edit${totalEdits === 1 ? '' : 's'}${
          totalApprovedNoEdit > 0
            ? ` and ${totalApprovedNoEdit} materials approved as-is`
            : ''
        }.)`
      : '';

  return [
    `IMPORTANT — this teacher's learned preferences from editing patterns:`,
    ...lines,
    ``,
    `Follow these closely so this material needs minimal editing.${samplesNote}`,
  ].join('\n');
}

/**
 * Build a compact per-material-type preferences snippet for a specific
 * material type. Used alongside buildEditPreferencesContext for type-aware
 * prompting ("for worksheets specifically, this teacher...").
 */
async function buildTypeSpecificEditContext(
  teacherId: string,
  materialType: string
): Promise<string> {
  const profile = await prisma.teacherPreferenceProfile.findUnique({
    where: { teacherId },
    select: { typePreferences: true },
  });
  if (!profile?.typePreferences) return '';

  const typePrefs = profile.typePreferences as Record<
    string,
    { avgEditsPerMaterial?: number; commonEdits?: string[] } | undefined
  >;
  const forType = typePrefs[materialType];
  if (!forType) return '';

  const common = Array.isArray(forType.commonEdits) ? forType.commonEdits : [];
  if (common.length === 0) return '';

  return [
    `For ${materialType.toLowerCase()}s specifically, this teacher typically:`,
    ...common.map((edit) => `- ${edit}`),
  ].join('\n');
}

// ============================================
// READERS (used by routes)
// ============================================

async function listEditsForMaterial(teacherId: string, materialId: string) {
  // Ownership check via the where clause on teacherId
  return prisma.materialEdit.findMany({
    where: { teacherId, materialId },
    orderBy: { createdAt: 'desc' },
  });
}

async function countEditsForMaterial(teacherId: string, materialId: string) {
  return prisma.materialEdit.count({ where: { teacherId, materialId } });
}

/**
 * Track a no-edit approval. Called when a teacher explicitly approves,
 * downloads, or shares a material without making any edits. Drives the
 * edit rate metric that signals whether the learning loop is working.
 */
async function recordApprovedNoEdit(teacherId: string, materialId: string) {
  // Skip if the material has any edits already — it's no longer "no edit"
  const editCount = await prisma.materialEdit.count({
    where: { teacherId, materialId },
  });
  if (editCount > 0) return;

  await prisma.teacherPreferenceProfile.upsert({
    where: { teacherId },
    create: { teacherId, totalApprovedNoEdit: 1 },
    update: { totalApprovedNoEdit: { increment: 1 } },
  });
}

// ============================================
// HELPERS
// ============================================

function truncate(text: string | null, max: number): string | null {
  if (text == null) return null;
  if (text.length <= max) return text;
  return text.slice(0, max - 3) + '...';
}

// ============================================
// EXPORTS
// ============================================

export const editAnalysisService = {
  recordEdit,
  analyzeEdit,
  listEditsForMaterial,
  countEditsForMaterial,
  recordApprovedNoEdit,
  buildEditPreferencesContext,
  buildTypeSpecificEditContext,
};
