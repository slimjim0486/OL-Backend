// Preference Analysis Service — Analyzes teacher behavior patterns from stream entries
// and material edits to build a TeacherPreferenceProfile.
// Complements reinforcementService (which handles 7-dimension style signals from approve/edit/regenerate)
// by focusing on higher-level teaching rhythm, format preferences, and content patterns.

import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

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
// EXPORTS
// ============================================

export const preferenceAnalysisService = {
  analyzeAndUpdatePreferences,
};
