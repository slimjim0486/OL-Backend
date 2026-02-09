// Reinforcement Service — Records teacher approve/edit/regenerate signals and builds style profile
// Phase 3: Enhanced with multi-dimension diff analysis, content-type partitioning, recency weighting
import { prisma } from '../../config/database.js';
import { agentMemoryService, StyleSignal } from './agentMemoryService.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export type FeedbackType = 'approval' | 'edit' | 'regeneration';

export interface FeedbackContext {
  contentType?: string; // 'lesson' | 'quiz' | 'flashcard' | 'sub_plan' | 'iep' etc.
  subject?: string; // 'MATH' | 'ELA' etc.
}

/**
 * Lightweight reinforcement helpers (no AgentInteraction mutation).
 * Use these for flows where we don't have an `interactionId` (e.g., Weekly Prep material review).
 */
async function recordApprovalSignal(
  agentId: string,
  ctx?: FeedbackContext,
  opts?: { skipAggregate?: boolean }
): Promise<void> {
  const signal: StyleSignal = {
    dimension: 'general',
    value: 'approved',
    source: 'approval',
    timestamp: new Date().toISOString(),
    contentType: ctx?.contentType,
    subject: ctx?.subject,
  };

  await agentMemoryService.recordStyleSignal(agentId, signal);
  if (!opts?.skipAggregate) {
    await maybeAutoAggregate(agentId);
  }
}

async function recordRegenerationSignal(
  agentId: string,
  feedbackNote?: string,
  ctx?: FeedbackContext,
  opts?: { skipAggregate?: boolean }
): Promise<void> {
  const signal: StyleSignal = {
    dimension: 'general',
    value: feedbackNote || 'regenerated',
    source: 'regeneration',
    timestamp: new Date().toISOString(),
    contentType: ctx?.contentType,
    subject: ctx?.subject,
  };

  await agentMemoryService.recordStyleSignal(agentId, signal);
  if (!opts?.skipAggregate) {
    await maybeAutoAggregate(agentId);
  }
}

async function recordEditSignals(
  agentId: string,
  original: string,
  edited: string,
  ctx?: FeedbackContext,
  opts?: { skipAggregate?: boolean }
): Promise<void> {
  const signals = extractStyleSignals(original, edited, ctx);
  if (signals.length === 0) {
    // Still record "an edit happened" even if our heuristics didn't detect a directional preference.
    await agentMemoryService.recordStyleSignal(agentId, {
      dimension: 'general',
      value: 'edited',
      source: 'edit',
      timestamp: new Date().toISOString(),
      contentType: ctx?.contentType,
      subject: ctx?.subject,
    });
  }
  for (const signal of signals) {
    await agentMemoryService.recordStyleSignal(agentId, signal);
  }
  if (!opts?.skipAggregate) {
    await maybeAutoAggregate(agentId);
  }
}

// Style dimensions tracked
const STYLE_DIMENSIONS = [
  'lessonLength',
  'detailLevel',
  'vocabularyLevel',
  'scaffolding',
  'formality',
  'questionCount',
  'structurePreference',
] as const;

// Auto-trigger aggregation every N signals
const AUTO_AGGREGATE_THRESHOLD = 5;

// Scaffolding indicator phrases
const SCAFFOLDING_PHRASES = [
  'example:', 'for example', 'step 1', 'step 2', 'step 3',
  'hint:', 'try this:', 'remember:', 'think about',
  'first,', 'next,', 'then,', 'finally,',
];

// Formality markers
const FORMAL_MARKERS = ['shall', 'furthermore', 'therefore', 'consequently', 'moreover', 'thus', 'hereby', 'whereas'];
const INFORMAL_MARKERS = ["let's", "let's", 'try', "you'll", "we'll", 'gonna', 'wanna', 'awesome', 'cool', 'great job'];

// ============================================
// FEEDBACK RECORDING
// ============================================

async function recordApproval(
  teacherId: string,
  interactionId: string,
  contentId?: string,
  ctx?: FeedbackContext
): Promise<void> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) return;

  await prisma.agentInteraction.update({
    where: { id: interactionId },
    data: { wasApproved: true },
  });

  const signal: StyleSignal = {
    dimension: 'general',
    value: 'approved',
    source: 'approval',
    timestamp: new Date().toISOString(),
    contentType: ctx?.contentType,
    subject: ctx?.subject,
  };

  await agentMemoryService.recordStyleSignal(agent.id, signal);
  await maybeAutoAggregate(agent.id);

  logger.info('Recorded approval signal', { teacherId, interactionId });
}

async function recordEdit(
  teacherId: string,
  interactionId: string,
  contentId: string,
  original: string,
  edited: string,
  ctx?: FeedbackContext
): Promise<void> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) return;

  await prisma.agentInteraction.update({
    where: { id: interactionId },
    data: { wasEdited: true },
  });

  const signals = extractStyleSignals(original, edited, ctx);
  for (const signal of signals) {
    await agentMemoryService.recordStyleSignal(agent.id, signal);
  }

  await maybeAutoAggregate(agent.id);

  logger.info('Recorded edit signals', { teacherId, interactionId, signalCount: signals.length });
}

async function recordRegeneration(
  teacherId: string,
  interactionId: string,
  contentId?: string,
  feedbackNote?: string,
  ctx?: FeedbackContext
): Promise<void> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) return;

  await prisma.agentInteraction.update({
    where: { id: interactionId },
    data: { wasRegenerated: true },
  });

  const signal: StyleSignal = {
    dimension: 'general',
    value: feedbackNote || 'regenerated',
    source: 'regeneration',
    timestamp: new Date().toISOString(),
    contentType: ctx?.contentType,
    subject: ctx?.subject,
  };

  await agentMemoryService.recordStyleSignal(agent.id, signal);
  await maybeAutoAggregate(agent.id);

  logger.info('Recorded regeneration signal', { teacherId, interactionId });
}

// ============================================
// STYLE SIGNAL EXTRACTION (7 dimensions)
// ============================================

function extractStyleSignals(
  original: string,
  edited: string,
  ctx?: FeedbackContext
): StyleSignal[] {
  const signals: StyleSignal[] = [];
  const now = new Date().toISOString();
  const base = { source: 'edit', timestamp: now, contentType: ctx?.contentType, subject: ctx?.subject };

  // Guard against empty strings
  if (!original || !edited) return signals;

  // 1. Length preference (existing)
  const lengthRatio = edited.length / original.length;
  if (lengthRatio < 0.7) {
    signals.push({ ...base, dimension: 'lessonLength', value: 'shorter' });
  } else if (lengthRatio > 1.3) {
    signals.push({ ...base, dimension: 'lessonLength', value: 'longer' });
  }

  // 2. Detail level — paragraph count (existing)
  const originalParas = original.split('\n\n').filter(Boolean).length;
  const editedParas = edited.split('\n\n').filter(Boolean).length;
  if (editedParas > originalParas * 1.3) {
    signals.push({ ...base, dimension: 'detailLevel', value: 'more_detail' });
  } else if (editedParas < originalParas * 0.7) {
    signals.push({ ...base, dimension: 'detailLevel', value: 'less_detail' });
  }

  // 3. Vocabulary level — average word length comparison
  const origAvgWordLen = averageWordLength(original);
  const editAvgWordLen = averageWordLength(edited);
  if (editAvgWordLen > origAvgWordLen + 0.5) {
    signals.push({ ...base, dimension: 'vocabularyLevel', value: 'more_advanced' });
  } else if (editAvgWordLen < origAvgWordLen - 0.5) {
    signals.push({ ...base, dimension: 'vocabularyLevel', value: 'simpler' });
  }

  // 4. Scaffolding — count of scaffolding indicator phrases
  const origScaffold = countPhrases(original.toLowerCase(), SCAFFOLDING_PHRASES);
  const editScaffold = countPhrases(edited.toLowerCase(), SCAFFOLDING_PHRASES);
  if (editScaffold > origScaffold + 2) {
    signals.push({ ...base, dimension: 'scaffolding', value: 'more_scaffolding' });
  } else if (editScaffold < origScaffold - 2) {
    signals.push({ ...base, dimension: 'scaffolding', value: 'less_scaffolding' });
  }

  // 5. Formality
  const origFormal = countPhrases(original.toLowerCase(), FORMAL_MARKERS);
  const origInformal = countPhrases(original.toLowerCase(), INFORMAL_MARKERS);
  const editFormal = countPhrases(edited.toLowerCase(), FORMAL_MARKERS);
  const editInformal = countPhrases(edited.toLowerCase(), INFORMAL_MARKERS);

  const origScore = origFormal - origInformal;
  const editScore = editFormal - editInformal;
  if (editScore > origScore + 2) {
    signals.push({ ...base, dimension: 'formality', value: 'more_formal' });
  } else if (editScore < origScore - 2) {
    signals.push({ ...base, dimension: 'formality', value: 'more_casual' });
  }

  // 6. Question count (lines ending with ?)
  const origQuestions = countQuestions(original);
  const editQuestions = countQuestions(edited);
  if (editQuestions > origQuestions + 2) {
    signals.push({ ...base, dimension: 'questionCount', value: 'more_questions' });
  } else if (editQuestions < origQuestions - 2) {
    signals.push({ ...base, dimension: 'questionCount', value: 'fewer_questions' });
  }

  // 7. Structure preference — headings, lists, tables
  const origStruct = countStructureElements(original);
  const editStruct = countStructureElements(edited);
  if (editStruct > origStruct + 3) {
    signals.push({ ...base, dimension: 'structurePreference', value: 'more_structured' });
  } else if (editStruct < origStruct - 3) {
    signals.push({ ...base, dimension: 'structurePreference', value: 'less_structured' });
  }

  return signals;
}

// ============================================
// TEXT ANALYSIS HELPERS
// ============================================

function averageWordLength(text: string): number {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return 0;
  const totalChars = words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, '').length, 0);
  return totalChars / words.length;
}

function countPhrases(text: string, phrases: string[]): number {
  let count = 0;
  for (const phrase of phrases) {
    let idx = 0;
    while ((idx = text.indexOf(phrase, idx)) !== -1) {
      count++;
      idx += phrase.length;
    }
  }
  return count;
}

function countQuestions(text: string): number {
  return text.split('\n').filter((line) => line.trim().endsWith('?')).length;
}

function countStructureElements(text: string): number {
  let count = 0;
  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // Markdown headings
    if (/^#{1,4}\s/.test(trimmed)) count++;
    // Bold headings
    if (/^\*\*[^*]+\*\*/.test(trimmed)) count++;
    // Bullet lists
    if (/^[-*]\s/.test(trimmed)) count++;
    // Numbered lists
    if (/^\d+[.)]\s/.test(trimmed)) count++;
    // Table rows
    if (/^\|.+\|$/.test(trimmed)) count++;
  }
  return count;
}

// ============================================
// STYLE PROFILE AGGREGATION (with recency weighting + content-type partitioning)
// ============================================

async function updateStyleProfile(agentId: string): Promise<void> {
  const profile = await agentMemoryService.getStyleProfile(agentId);
  if (!profile) return;

  const signals = (profile.styleSignals as unknown as StyleSignal[]) || [];
  if (signals.length < 5) return;

  // --- Global preferences (recency-weighted) ---
  const globalPrefs: Record<string, string> = {};
  const globalConfidence: Record<string, number> = {};
  aggregateSignals(signals, globalPrefs, globalConfidence);

  // --- Content-type partitioned preferences ---
  const byContentType: Record<string, Record<string, string>> = {};
  const contentTypeGroups: Record<string, StyleSignal[]> = {};

  for (const signal of signals) {
    if (signal.contentType) {
      if (!contentTypeGroups[signal.contentType]) {
        contentTypeGroups[signal.contentType] = [];
      }
      contentTypeGroups[signal.contentType].push(signal);
    }
  }

  const contentTypeConfidence: Record<string, Record<string, number>> = {};
  for (const [ct, ctSignals] of Object.entries(contentTypeGroups)) {
    if (ctSignals.length >= 3) {
      const prefs: Record<string, string> = {};
      const scores: Record<string, number> = {};
      aggregateSignals(ctSignals, prefs, scores);

      // Only keep dimensions with sufficient confidence
      const filtered: Record<string, string> = {};
      for (const [dim, val] of Object.entries(prefs)) {
        if ((scores[dim] || 0) >= 0.5) {
          filtered[dim] = val;
        }
      }
      if (Object.keys(filtered).length > 0) {
        byContentType[ct] = filtered;
        contentTypeConfidence[ct] = scores;
      }
    }
  }

  // Merge into stored preferences
  const mergedPrefs: Record<string, any> = {
    ...globalPrefs,
    _byContentType: byContentType,
  };
  const mergedConfidence: Record<string, number> = {
    ...globalConfidence,
  };

  await agentMemoryService.updateStylePreferences(agentId, mergedPrefs, mergedConfidence);
  logger.info('Updated style profile', {
    agentId,
    globalDimensions: Object.keys(globalPrefs),
    contentTypes: Object.keys(byContentType),
  });
}

/**
 * Aggregate signals into preferences with recency weighting.
 * Half-life of 20 signals (most recent signals count more).
 */
function aggregateSignals(
  signals: StyleSignal[],
  outPrefs: Record<string, string>,
  outConfidence: Record<string, number>
): void {
  const HALF_LIFE = 20;

  // Sort by timestamp ascending (oldest first) so index aligns with recency
  const sorted = [...signals].sort((a, b) =>
    (a.timestamp || '').localeCompare(b.timestamp || '')
  );

  // Weighted counts per dimension per value
  const dimensionWeights: Record<string, Record<string, number>> = {};
  const dimensionTotalWeight: Record<string, number> = {};

  for (let i = 0; i < sorted.length; i++) {
    const signal = sorted[i];
    if (signal.dimension === 'general') continue;

    // Exponential recency weight: newer signals have higher weight
    const recency = i - (sorted.length - 1); // negative for old, 0 for newest
    const weight = Math.pow(2, recency / HALF_LIFE);

    if (!dimensionWeights[signal.dimension]) {
      dimensionWeights[signal.dimension] = {};
      dimensionTotalWeight[signal.dimension] = 0;
    }
    dimensionWeights[signal.dimension][signal.value] =
      (dimensionWeights[signal.dimension][signal.value] || 0) + weight;
    dimensionTotalWeight[signal.dimension] += weight;
  }

  for (const [dimension, valueCounts] of Object.entries(dimensionWeights)) {
    const total = dimensionTotalWeight[dimension];
    const sorted = Object.entries(valueCounts).sort((a, b) => b[1] - a[1]);

    if (sorted.length > 0 && total > 0) {
      const topValue = sorted[0][0];
      const confidence = sorted[0][1] / total;

      // Only include if confidence >= 0.5 and at least ~3 signals worth of weight
      if (confidence >= 0.5) {
        outPrefs[dimension] = topValue;
        outConfidence[dimension] = confidence;
      }
    }
  }
}

// ============================================
// AUTO-TRIGGER AGGREGATION
// ============================================

async function maybeAutoAggregate(agentId: string): Promise<void> {
  try {
    const profile = await agentMemoryService.getStyleProfile(agentId);
    if (!profile) return;

    const signals = (profile.styleSignals as unknown as StyleSignal[]) || [];
    const totalFeedback = profile.totalApprovals + profile.totalEdits + profile.totalRegenerations;

    // Trigger aggregation every AUTO_AGGREGATE_THRESHOLD signals
    if (totalFeedback > 0 && totalFeedback % AUTO_AGGREGATE_THRESHOLD === 0) {
      await updateStyleProfile(agentId);
      logger.info('Auto-triggered style profile aggregation', { agentId, totalFeedback });
    }
  } catch (error) {
    logger.warn('Auto-aggregate check failed', { agentId, error });
  }
}

// ============================================
// EXPORTS
// ============================================

export const reinforcementService = {
  recordApproval,
  recordEdit,
  recordRegeneration,
  recordApprovalSignal,
  recordEditSignals,
  recordRegenerationSignal,
  extractStyleSignals,
  updateStyleProfile,
  maybeAutoAggregate,
};
