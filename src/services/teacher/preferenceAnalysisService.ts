// Preference Analysis Service — Analyzes teacher behavior patterns from stream entries
// and material edits to build a TeacherPreferenceProfile.
// Complements reinforcementService (which handles 7-dimension style signals from approve/edit/regenerate)
// by focusing on higher-level teaching rhythm, format preferences, and content patterns.
//
// Phase 4.9 (Edit Intelligence Loop): updatePreferencesFromEdits() aggregates
// Gemini-extracted signals from MaterialEdit rows into concrete tendencies
// (vocabulary, difficulty, length, tone), learned patterns with confidence
// scores, and per-material-type preferences. Called on every 5th edit by the
// edit analysis job.

import type { MaterialEdit } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import type { ExtractedEditSignals } from './editAnalysisService.js';

// ============================================
// TYPES
// ============================================

interface ExtractedTags {
  subjects?: string[];
  topics?: string[];
  standards?: string[];
  signals?: string[];
}

interface WeeklyPattern {
  sunday: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
}

interface TopicDuration {
  /** Average number of stream entries per topic before moving on */
  averageEntriesPerTopic: number;
  /** Map of topic → entry count for the analysis window */
  topicCounts: Record<string, number>;
}

interface CommonEdits {
  /** Total materials in the analysis window */
  totalMaterials: number;
  /** Materials that were edited */
  editedCount: number;
  /** Materials approved without edits */
  approvedWithoutEditsCount: number;
  /** Edit rate (editedCount / totalMaterials) */
  editRate: number;
}

interface ConfidenceScores {
  weeklyPattern: number;
  reflectionFrequency: number;
  planningHorizon: number;
  preferredFormats: number;
  difficultyBias: number;
  topicDuration: number;
  commonEdits: number;
  vocabularyLevel: number;
}

const DAY_NAMES: readonly string[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

const ANALYSIS_WINDOW_DAYS = 30;

/** Confidence = dataPoints / CONFIDENCE_DENOMINATOR, capped at 1.0 */
const CONFIDENCE_DENOMINATOR = 20;

// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================

/**
 * Analyze teacher behavior patterns from the last 30 days of stream entries and materials,
 * then upsert the TeacherPreferenceProfile.
 *
 * Designed to be called by a weekly cron job.
 */
async function analyzeAndUpdatePreferences(teacherId: string): Promise<void> {
  const since = new Date();
  since.setDate(since.getDate() - ANALYSIS_WINDOW_DAYS);

  try {
    // Load data sources in parallel
    const [streamEntries, materials] = await Promise.all([
      prisma.teacherStreamEntry.findMany({
        where: {
          teacherId,
          createdAt: { gte: since },
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.teacherMaterial.findMany({
        where: {
          teacherId,
          createdAt: { gte: since },
        },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const totalDataPoints = streamEntries.length + materials.length;
    if (totalDataPoints === 0) {
      logger.info('No data to analyze for preference profile', { teacherId });
      return;
    }

    // Run all analysis dimensions
    const weeklyPattern = analyzeWeeklyPattern(streamEntries);
    const reflectionFrequency = analyzeReflectionFrequency(streamEntries);
    const planningHorizon = analyzePlanningHorizon(streamEntries);
    const preferredFormats = analyzePreferredFormats(materials);
    const difficultyBias = analyzeDifficultyBias(materials);
    const topicDuration = analyzeTopicDuration(streamEntries);
    const commonEdits = analyzeCommonEdits(materials);
    const vocabularyLevel = deriveVocabularyLevel(streamEntries);

    // Build confidence scores
    const confidenceScores: ConfidenceScores = {
      weeklyPattern: cap(streamEntries.length / CONFIDENCE_DENOMINATOR),
      reflectionFrequency: cap(streamEntries.length / CONFIDENCE_DENOMINATOR),
      planningHorizon: cap(
        streamEntries.filter((e) => hasSignal(e, 'schedule')).length / CONFIDENCE_DENOMINATOR
      ),
      preferredFormats: cap(materials.length / CONFIDENCE_DENOMINATOR),
      difficultyBias: cap(materials.filter((m) => m.rating !== null).length / CONFIDENCE_DENOMINATOR),
      topicDuration: cap(
        Object.keys(topicDuration.topicCounts).length / CONFIDENCE_DENOMINATOR
      ),
      commonEdits: cap(materials.length / CONFIDENCE_DENOMINATOR),
      vocabularyLevel: cap(streamEntries.length / CONFIDENCE_DENOMINATOR),
    };

    // Upsert the profile
    await prisma.teacherPreferenceProfile.upsert({
      where: { teacherId },
      create: {
        teacherId,
        weeklyPattern: weeklyPattern as any,
        reflectionFrequency,
        planningHorizon,
        preferredFormats,
        difficultyBias,
        topicDuration: topicDuration as any,
        commonEdits: commonEdits as any,
        vocabularyLevel,
        confidenceScores: confidenceScores as any,
      },
      update: {
        weeklyPattern: weeklyPattern as any,
        reflectionFrequency,
        planningHorizon,
        preferredFormats,
        difficultyBias,
        topicDuration: topicDuration as any,
        commonEdits: commonEdits as any,
        vocabularyLevel,
        confidenceScores: confidenceScores as any,
      },
    });

    logger.info('Updated teacher preference profile', {
      teacherId,
      streamEntries: streamEntries.length,
      materials: materials.length,
      confidenceScores,
    });
  } catch (error) {
    logger.error('Failed to analyze teacher preferences', {
      teacherId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

// ============================================
// ANALYSIS HELPERS
// ============================================

/**
 * Count stream entries by day-of-week to reveal posting rhythm.
 */
function analyzeWeeklyPattern(
  entries: Array<{ createdAt: Date }>
): WeeklyPattern {
  const counts: WeeklyPattern = {
    sunday: 0,
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
  };

  for (const entry of entries) {
    const dayIndex = new Date(entry.createdAt).getDay(); // 0 = Sunday
    const dayName = DAY_NAMES[dayIndex] as keyof WeeklyPattern;
    counts[dayName]++;
  }

  return counts;
}

/**
 * Ratio of entries containing a "reflection" signal to total entries.
 * Returns a human-readable label: "high" (>30%), "moderate" (10-30%), "low" (<10%), or "none".
 */
function analyzeReflectionFrequency(
  entries: Array<{ extractedTags: any }>
): string {
  if (entries.length === 0) return 'none';

  const reflectionCount = entries.filter((e) => hasSignal(e, 'reflection')).length;
  const ratio = reflectionCount / entries.length;

  if (ratio > 0.3) return 'high';
  if (ratio > 0.1) return 'moderate';
  if (ratio > 0) return 'low';
  return 'none';
}

/**
 * Estimate planning horizon from "schedule" signal frequency.
 * More schedule-type entries → longer planning horizon.
 * Returns "long", "medium", or "short".
 */
function analyzePlanningHorizon(
  entries: Array<{ extractedTags: any }>
): string {
  if (entries.length === 0) return 'short';

  const scheduleCount = entries.filter((e) => hasSignal(e, 'schedule')).length;
  const ratio = scheduleCount / entries.length;

  // Teachers who frequently mention scheduling are planning further ahead
  if (ratio > 0.25) return 'long';
  if (ratio > 0.1) return 'medium';
  return 'short';
}

/**
 * Rank material types by generation frequency.
 * Returns the top types (those generated at least twice), up to 5.
 */
function analyzePreferredFormats(
  materials: Array<{ type: string }>
): string[] {
  if (materials.length === 0) return [];

  const typeCounts: Record<string, number> = {};
  for (const m of materials) {
    typeCounts[m.type] = (typeCounts[m.type] || 0) + 1;
  }

  return Object.entries(typeCounts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type]) => type);
}

/**
 * Determine difficulty bias based on material ratings and reteach activity prevalence.
 * - If many materials are low-rated AND reteach activities are common → "simpler"
 * - If many materials are high-rated → "challenging"
 * - Otherwise → "standard"
 */
function analyzeDifficultyBias(
  materials: Array<{ type: string; rating: number | null; usedInClass: boolean }>
): string {
  if (materials.length === 0) return 'standard';

  const ratedMaterials = materials.filter((m) => m.rating !== null);
  const reteachCount = materials.filter((m) => m.type === 'RETEACH_ACTIVITY').length;
  const reteachRatio = reteachCount / materials.length;

  if (ratedMaterials.length === 0) {
    // No ratings — infer from reteach activity prevalence only
    return reteachRatio > 0.15 ? 'simpler' : 'standard';
  }

  const avgRating =
    ratedMaterials.reduce((sum, m) => sum + (m.rating as number), 0) / ratedMaterials.length;

  // Low average rating + frequent reteach → teacher finds content too hard for students
  if (avgRating < 3 && reteachRatio > 0.1) return 'simpler';
  // High ratings with low reteach → teacher prefers challenging content
  if (avgRating >= 4 && reteachRatio < 0.05) return 'challenging';
  return 'standard';
}

/**
 * Calculate average entries per topic before a teacher moves on.
 * Topics are extracted from stream entry tags.
 */
function analyzeTopicDuration(
  entries: Array<{ extractedTags: any }>
): TopicDuration {
  const topicCounts: Record<string, number> = {};

  for (const entry of entries) {
    const tags = parseExtractedTags(entry.extractedTags);
    if (!tags.topics) continue;

    for (const topic of tags.topics) {
      const normalized = topic.toLowerCase().trim();
      if (normalized) {
        topicCounts[normalized] = (topicCounts[normalized] || 0) + 1;
      }
    }
  }

  const topicValues = Object.values(topicCounts);
  const averageEntriesPerTopic =
    topicValues.length > 0
      ? topicValues.reduce((sum, c) => sum + c, 0) / topicValues.length
      : 0;

  return {
    averageEntriesPerTopic: Math.round(averageEntriesPerTopic * 10) / 10,
    topicCounts,
  };
}

/**
 * Track edit patterns: how many materials were edited vs approved without edits.
 */
function analyzeCommonEdits(
  materials: Array<{ edited: boolean; approved: boolean; editDiff: any }>
): CommonEdits {
  const totalMaterials = materials.length;
  if (totalMaterials === 0) {
    return {
      totalMaterials: 0,
      editedCount: 0,
      approvedWithoutEditsCount: 0,
      editRate: 0,
    };
  }

  const editedCount = materials.filter((m) => m.edited).length;
  const approvedWithoutEditsCount = materials.filter(
    (m) => m.approved && !m.edited
  ).length;

  return {
    totalMaterials,
    editedCount,
    approvedWithoutEditsCount,
    editRate: Math.round((editedCount / totalMaterials) * 100) / 100,
  };
}

/**
 * Derive vocabulary level from stream entry content length and signal patterns.
 * A rough heuristic: longer, more detailed entries suggest higher vocabulary comfort.
 * Returns "advanced", "intermediate", or "basic".
 */
function deriveVocabularyLevel(
  entries: Array<{ content: string; extractedTags: any }>
): string {
  if (entries.length === 0) return 'intermediate';

  const avgLength =
    entries.reduce((sum, e) => sum + (e.content?.length || 0), 0) / entries.length;

  // Count entries with standards-related signals (indicates curriculum fluency)
  const standardsCount = entries.filter((e) => {
    const tags = parseExtractedTags(e.extractedTags);
    return tags.standards && tags.standards.length > 0;
  }).length;
  const standardsRatio = standardsCount / entries.length;

  // Teachers who write longer entries and reference standards frequently
  // tend to use more advanced educational vocabulary
  if (avgLength > 300 && standardsRatio > 0.3) return 'advanced';
  if (avgLength > 150 || standardsRatio > 0.15) return 'intermediate';
  return 'basic';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Safely parse extractedTags from a stream entry (stored as Json).
 */
function parseExtractedTags(raw: any): ExtractedTags {
  if (!raw || typeof raw !== 'object') return {};
  return raw as ExtractedTags;
}

/**
 * Check if a stream entry has a specific signal in its extractedTags.signals array.
 */
function hasSignal(entry: { extractedTags: any }, signal: string): boolean {
  const tags = parseExtractedTags(entry.extractedTags);
  if (!tags.signals || !Array.isArray(tags.signals)) return false;
  return tags.signals.some(
    (s: string) => typeof s === 'string' && s.toLowerCase().includes(signal.toLowerCase())
  );
}

/**
 * Cap a number at 1.0 (for confidence scores).
 */
function cap(value: number): number {
  return Math.min(Math.round(value * 100) / 100, 1.0);
}

// ============================================
// EDIT-DERIVED PREFERENCES (Phase 4.9)
// ============================================

/** How many edits back we look when aggregating tendencies. */
const EDIT_AGGREGATION_WINDOW = 50;

/** Minimum edits on a dimension before we trust the tendency */
const TENDENCY_MIN_SAMPLES = 3;

/** Threshold — if ≥70% of samples point the same direction, it's a tendency */
const TENDENCY_DOMINANCE_THRESHOLD = 0.7;

/** Minimum occurrences before a specific pattern becomes a learnedPattern */
const PATTERN_MIN_OCCURRENCES = 3;

/** Confidence threshold to fire the "I've learned your preferences" whisper */
const LEARNING_NOTIFY_THRESHOLD = 0.8;

/** Minimum total edits before we surface any learned patterns at all */
const MIN_EDITS_FOR_SURFACE = 5;

/**
 * Pull the last N analyzed edits for a teacher and recompute their
 * edit-derived preferences. Safe to call repeatedly — idempotent upsert.
 */
async function updatePreferencesFromEdits(teacherId: string): Promise<{
  totalEdits: number;
  totalApprovedNoEdit: number;
  editRate: number | null;
  learnedPatternCount: number;
  highestConfidence: number;
}> {
  // Load recent analyzed edits alongside the material they apply to so we
  // can compute per-type preferences without a second query.
  const edits = await prisma.materialEdit.findMany({
    where: {
      teacherId,
      analyzed: true,
      NOT: { extractedSignals: { equals: Prisma.DbNull } },
    },
    orderBy: { createdAt: 'desc' },
    take: EDIT_AGGREGATION_WINDOW,
    include: {
      material: {
        select: { id: true, type: true },
      },
    },
  });

  // Load the current profile so we preserve totalApprovedNoEdit (which is
  // maintained by editAnalysisService.recordApprovedNoEdit, not from edits).
  const existingProfile = await prisma.teacherPreferenceProfile.findUnique({
    where: { teacherId },
  });

  const totalEditsAllTime = await prisma.materialEdit.count({
    where: { teacherId },
  });
  const totalApprovedNoEdit = existingProfile?.totalApprovedNoEdit ?? 0;

  const denominator = totalEditsAllTime + totalApprovedNoEdit;
  const editRate =
    denominator > 0 ? round2(totalEditsAllTime / denominator) : null;

  // Tendencies across all edits in the window
  const vocabularyTendency = computeTendency(edits, 'vocabularyChange', {
    simplified: 'simplifies_consistently',
    elevated: 'elevates_consistently',
  });
  const difficultyTendency = computeTendency(edits, 'difficultyChange', {
    easier: 'makes_easier_consistently',
    harder: 'makes_harder_consistently',
  });
  const lengthTendency = computeTendency(edits, 'formatChange', {
    shorter: 'shortens_consistently',
    longer: 'lengthens_consistently',
  });
  const toneTendency = computeTendency(edits, 'toneChange', {
    more_formal: 'more_formal',
    more_casual: 'more_casual',
    more_encouraging: 'more_encouraging',
  });

  // Extract learned patterns — group similar specificPatterns by string match
  const learnedPatterns = edits.length >= MIN_EDITS_FOR_SURFACE
    ? extractLearnedPatterns(edits)
    : [];

  // Per-material-type preferences
  const typePreferences = computeTypePreferences(edits);

  const highestConfidence = learnedPatterns.reduce(
    (max, p) => (p.confidence > max ? p.confidence : max),
    0
  );

  // Upsert the profile
  await prisma.teacherPreferenceProfile.upsert({
    where: { teacherId },
    create: {
      teacherId,
      totalEdits: totalEditsAllTime,
      totalApprovedNoEdit,
      editRate,
      vocabularyTendency,
      difficultyTendency,
      lengthTendency,
      toneTendency,
      learnedPatterns: learnedPatterns as any,
      typePreferences: typePreferences as any,
    },
    update: {
      totalEdits: totalEditsAllTime,
      editRate,
      vocabularyTendency,
      difficultyTendency,
      lengthTendency,
      toneTendency,
      learnedPatterns: learnedPatterns as any,
      typePreferences: typePreferences as any,
    },
  });

  logger.info('Updated edit-derived preferences', {
    teacherId,
    totalEdits: totalEditsAllTime,
    totalApprovedNoEdit,
    editRate,
    vocabularyTendency,
    difficultyTendency,
    lengthTendency,
    learnedPatterns: learnedPatterns.length,
    highestConfidence,
  });

  return {
    totalEdits: totalEditsAllTime,
    totalApprovedNoEdit,
    editRate,
    learnedPatternCount: learnedPatterns.length,
    highestConfidence,
  };
}

/**
 * Decide whether the "I've learned your preferences" whisper should fire now.
 * Fires once per confidence jump — we track lastLearnedNotifiedAt on the
 * profile to avoid spamming. Returns a short human-readable summary the
 * whisper can use, or null if we shouldn't notify.
 */
async function maybeWhisperLearnedPreferences(teacherId: string): Promise<string | null> {
  const profile = await prisma.teacherPreferenceProfile.findUnique({
    where: { teacherId },
  });
  if (!profile) return null;

  const totalSignals = (profile.totalEdits ?? 0);
  if (totalSignals < 15) return null; // Need a meaningful sample

  const patterns = Array.isArray(profile.learnedPatterns)
    ? (profile.learnedPatterns as Array<{ pattern: string; confidence: number }>)
    : [];
  const topConfidence = patterns.reduce(
    (max, p) => (p?.confidence > max ? p.confidence : max),
    0
  );

  if (topConfidence < LEARNING_NOTIFY_THRESHOLD) return null;

  // Don't re-notify within 14 days
  if (profile.lastLearnedNotifiedAt) {
    const daysSince =
      (Date.now() - new Date(profile.lastLearnedNotifiedAt).getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysSince < 14) return null;
  }

  // Build a one-line summary the whisper can use
  const parts: string[] = [];
  if (profile.vocabularyTendency === 'simplifies_consistently') {
    parts.push('simplify vocabulary');
  }
  if (profile.lengthTendency === 'shortens_consistently') {
    parts.push('shorten sections');
  }
  if (profile.difficultyTendency === 'makes_easier_consistently') {
    parts.push('target below grade level');
  }
  const topPattern = patterns
    .sort((a, b) => (b?.confidence ?? 0) - (a?.confidence ?? 0))[0];

  let summary = "I've learned your teaching style from your edits. ";
  if (parts.length > 0) {
    summary += `You ${parts.join(', ')} on most materials. `;
  }
  if (topPattern?.pattern) {
    summary += `I'll ${topPattern.pattern.toLowerCase()} by default now.`;
  } else {
    summary += `I've adjusted your generation defaults.`;
  }

  await prisma.teacherPreferenceProfile.update({
    where: { teacherId },
    data: { lastLearnedNotifiedAt: new Date() },
  });

  return summary;
}

// ============================================
// EDIT AGGREGATION HELPERS
// ============================================

type EditWithMaterial = MaterialEdit & {
  material: { id: string; type: string };
};

/**
 * Given a list of edits, a signal field to look at, and a value → label map,
 * return the dominant tendency label — or null if no direction has a strong
 * majority, or we don't have enough samples.
 */
function computeTendency(
  edits: EditWithMaterial[],
  field: keyof ExtractedEditSignals,
  mapping: Record<string, string>
): string | null {
  const counts: Record<string, number> = {};
  let total = 0;

  for (const edit of edits) {
    const signals = (edit.extractedSignals as ExtractedEditSignals | null) ?? null;
    if (!signals) continue;
    const value = signals[field];
    if (typeof value !== 'string') continue;
    // Ignore no_change — it tells us nothing about direction
    if (value === 'no_change') continue;
    if (!mapping[value]) continue;
    counts[value] = (counts[value] || 0) + 1;
    total += 1;
  }

  if (total < TENDENCY_MIN_SAMPLES) return null;

  let topValue: string | null = null;
  let topCount = 0;
  for (const [value, count] of Object.entries(counts)) {
    if (count > topCount) {
      topCount = count;
      topValue = value;
    }
  }

  if (!topValue) return null;
  if (topCount / total < TENDENCY_DOMINANCE_THRESHOLD) return 'neutral';
  return mapping[topValue];
}

interface LearnedPattern {
  pattern: string;
  confidence: number;
  sampleSize: number;
}

/**
 * Group similar specificPatterns across the edit window and surface the ones
 * that appear ≥ PATTERN_MIN_OCCURRENCES times. Uses a naive normalized-key
 * match — we deliberately don't call Gemini again here to keep costs down.
 * Confidence = occurrences / totalEdits, capped at 0.95 so we never fake 100%.
 */
function extractLearnedPatterns(edits: EditWithMaterial[]): LearnedPattern[] {
  const buckets = new Map<
    string,
    { label: string; count: number }
  >();

  for (const edit of edits) {
    const signals = (edit.extractedSignals as ExtractedEditSignals | null) ?? null;
    const patterns = signals?.specificPatterns;
    if (!Array.isArray(patterns)) continue;
    for (const raw of patterns) {
      if (typeof raw !== 'string') continue;
      const key = normalizePatternKey(raw);
      if (!key) continue;
      const existing = buckets.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        buckets.set(key, { label: raw.trim(), count: 1 });
      }
    }
  }

  const totalEdits = Math.max(edits.length, 1);
  const learned: LearnedPattern[] = [];
  for (const { label, count } of buckets.values()) {
    if (count < PATTERN_MIN_OCCURRENCES) continue;
    learned.push({
      pattern: label,
      confidence: round2(Math.min(count / totalEdits, 0.95)),
      sampleSize: count,
    });
  }

  // Keep the top 8 most confident patterns — more than that is noise.
  return learned.sort((a, b) => b.confidence - a.confidence).slice(0, 8);
}

/**
 * Normalize a free-form pattern string to a dedup key. Drops punctuation,
 * lowercases, collapses whitespace, and sorts stem words so "added more
 * examples" and "more examples added" hash to the same bucket.
 */
function normalizePatternKey(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return '';
  const stopwords = new Set([
    'the', 'a', 'an', 'to', 'of', 'for', 'with', 'and', 'or',
    'in', 'on', 'at', 'by', 'is', 'was', 'are', 'were', 'that', 'this',
  ]);
  const tokens = cleaned
    .split(' ')
    .filter((t) => t && !stopwords.has(t) && t.length > 2);
  if (tokens.length === 0) return cleaned;
  return tokens.sort().join(' ');
}

interface TypePreference {
  avgEditsPerMaterial: number;
  commonEdits: string[];
}

/**
 * Per-material-type edit summary. Helps us tell the teacher
 * "Your worksheets need more edits than your flashcards."
 */
function computeTypePreferences(
  edits: EditWithMaterial[]
): Record<string, TypePreference> {
  const byType = new Map<
    string,
    {
      editCount: number;
      materialIds: Set<string>;
      patterns: Map<string, { label: string; count: number }>;
    }
  >();

  for (const edit of edits) {
    const type = edit.material.type;
    if (!type) continue;
    let bucket = byType.get(type);
    if (!bucket) {
      bucket = {
        editCount: 0,
        materialIds: new Set(),
        patterns: new Map(),
      };
      byType.set(type, bucket);
    }
    bucket.editCount += 1;
    bucket.materialIds.add(edit.material.id);

    const signals = (edit.extractedSignals as ExtractedEditSignals | null) ?? null;
    if (signals && Array.isArray(signals.specificPatterns)) {
      for (const raw of signals.specificPatterns) {
        if (typeof raw !== 'string') continue;
        const key = normalizePatternKey(raw);
        if (!key) continue;
        const existing = bucket.patterns.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          bucket.patterns.set(key, { label: raw.trim(), count: 1 });
        }
      }
    }
  }

  const result: Record<string, TypePreference> = {};
  for (const [type, bucket] of byType.entries()) {
    const materialCount = Math.max(bucket.materialIds.size, 1);
    const commonEdits = [...bucket.patterns.values()]
      .filter((p) => p.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((p) => p.label);

    result[type] = {
      avgEditsPerMaterial: round2(bucket.editCount / materialCount),
      commonEdits,
    };
  }

  return result;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ============================================
// EXPORTS
// ============================================

export const preferenceAnalysisService = {
  analyzeAndUpdatePreferences,
  updatePreferencesFromEdits,
  maybeWhisperLearnedPreferences,
};
