// Collective Insight Service — Teacher Intelligence Platform
//
// Aggregates signals from stream entries across ALL teachers by curriculum
// standard code, then exposes query helpers for the nudge generator.
//
// Flow:
//   1. aggregateAllInsights() — Called by the weekly cron. Walks every
//      TOPIC node with linkedStandardCodes, joins to the stream entries that
//      are ABOUT that topic, buckets their extractedTags.signals by
//      (standardCode, curriculumType, gradeRange, signalType), enforces
//      k-anonymity (>= MIN_TEACHERS distinct contributors), extracts
//      multi-teacher n-gram themes, and upserts CollectiveInsight rows.
//
//   2. getInsightsForTeacher(teacherId) — Called by nudgeService. Returns
//      CollectiveInsight rows whose (curriculum, grade) match the teacher
//      and whose standardCode intersects the teacher's own TOPIC nodes'
//      linkedStandardCodes. Filtered to recently-computed rows only.
//
// Privacy model:
//   - No teacherIds, student names, or raw note content are persisted.
//   - teacherCount is only written when >= MIN_TEACHER_THRESHOLD.
//   - Individual theme phrases must themselves appear across >= 2 teachers
//     before being retained, so no single teacher's phrasing is exposed.
//   - Curriculum + gradeRange scoping keeps comparisons peer-to-peer; a
//     US Grade 6 teacher never sees UK KS2 patterns and vice versa.

import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import type { ExtractedTags } from './streamExtractionService.js';

// ============================================
// CONSTANTS — privacy + aggregation tuning
// ============================================

/** Minimum distinct teachers required before an insight row is persisted. */
const MIN_TEACHER_THRESHOLD = 5;

/** Minimum distinct teachers required for a theme phrase to be retained. */
const MIN_THEME_TEACHERS = 2;

/** How far back to look when aggregating signals. Keeps insights recent. */
const LOOKBACK_DAYS = 90;

/** Max themes retained per insight row. */
const MAX_THEMES_PER_INSIGHT = 5;

/** Max top-topics retained per insight row. */
const MAX_TOPICS_PER_INSIGHT = 5;

/** How stale an insight row must be before the nudge generator ignores it. */
const INSIGHT_FRESHNESS_DAYS = 30;

/** Minimum n-gram length (1 = unigrams, up to TRIGRAMS). */
const MIN_NGRAM = 1;
const MAX_NGRAM = 3;

/** Signal types Gemini emits via streamExtractionService. */
const KNOWN_SIGNAL_TYPES = new Set([
  'reteach',
  'schedule',
  'observation',
  'preference',
  'reflection',
  'idea',
  'concern',
  'success',
]);

/**
 * Very small English stop-word list used only to drop the worst noise
 * from n-gram themes. Not a full NLP stop-list — just enough to keep
 * "the fractions" from outranking "fractions".
 */
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'so', 'to', 'of', 'in',
  'on', 'for', 'with', 'at', 'by', 'from', 'up', 'out', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
  'does', 'did', 'it', 'its', 'this', 'that', 'these', 'those', 'i',
  'my', 'we', 'our', 'you', 'your', 'they', 'them', 'their', 'he',
  'she', 'his', 'her', 'as', 'not', 'no',
]);

// ============================================
// TYPES
// ============================================

interface AggregatedPatterns {
  themes: Array<{ phrase: string; teacherCount: number }>;
  topTopics: string[];
  signalTypeBreakdown: Record<string, number>;
}

/** Per-(standard, curriculum, grade, signalType) accumulator used while walking. */
interface InsightBucket {
  standardCode: string;
  curriculumType: string;
  gradeRange: string;
  signalType: string;
  /** teacherId → set of raw signal contents that teacher contributed */
  teacherSignals: Map<string, string[]>;
  /** teacherId → set of topics (from the stream entry) that teacher touched */
  teacherTopics: Map<string, Set<string>>;
  /** Total raw signal count across all teachers */
  totalSignalCount: number;
}

// ============================================
// TEXT HELPERS
// ============================================

/** Normalize a signal content string for tokenization. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate unigrams, bigrams, and trigrams from a normalized string.
 * Skips tokens that are stop-words or pure numbers. Used by theme extraction.
 */
function ngrams(text: string): string[] {
  const tokens = normalize(text)
    .split(' ')
    .filter((t) => t.length > 1 && !/^\d+$/.test(t));

  if (tokens.length === 0) return [];

  const phrases: string[] = [];
  for (let n = MIN_NGRAM; n <= MAX_NGRAM; n++) {
    for (let i = 0; i <= tokens.length - n; i++) {
      const slice = tokens.slice(i, i + n);
      // Drop phrases whose first or last token is a stop-word
      if (STOP_WORDS.has(slice[0]) || STOP_WORDS.has(slice[slice.length - 1])) continue;
      // Drop any phrase where every token is a stop-word
      if (slice.every((t) => STOP_WORDS.has(t))) continue;
      phrases.push(slice.join(' '));
    }
  }
  return phrases;
}

/**
 * Given a bucket, extract up to MAX_THEMES_PER_INSIGHT phrases that appear
 * in at least MIN_THEME_TEACHERS distinct teachers' signals. Returns themes
 * ranked by distinct teacher count (the privacy-relevant metric).
 */
function extractThemes(bucket: InsightBucket): Array<{ phrase: string; teacherCount: number }> {
  // phrase -> set of teacherIds that used it
  const phraseTeachers = new Map<string, Set<string>>();

  for (const [teacherId, contents] of bucket.teacherSignals) {
    const seenThisTeacher = new Set<string>();
    for (const content of contents) {
      for (const phrase of ngrams(content)) {
        if (seenThisTeacher.has(phrase)) continue;
        seenThisTeacher.add(phrase);
        if (!phraseTeachers.has(phrase)) {
          phraseTeachers.set(phrase, new Set());
        }
        phraseTeachers.get(phrase)!.add(teacherId);
      }
    }
  }

  const themes = [...phraseTeachers.entries()]
    .map(([phrase, teachers]) => ({ phrase, teacherCount: teachers.size }))
    .filter((t) => t.teacherCount >= MIN_THEME_TEACHERS)
    .sort((a, b) => {
      // Primary: distinct teacher count
      if (b.teacherCount !== a.teacherCount) return b.teacherCount - a.teacherCount;
      // Tiebreaker: prefer longer phrases (more specific)
      return b.phrase.length - a.phrase.length;
    });

  // Dedup overlapping phrases: if "visual fraction bars" survives, drop
  // "fraction bars" and "visual fraction" to avoid redundant noise.
  const retained: Array<{ phrase: string; teacherCount: number }> = [];
  for (const theme of themes) {
    if (retained.length >= MAX_THEMES_PER_INSIGHT) break;
    const dominatedByExisting = retained.some(
      (r) => r.phrase.includes(theme.phrase) || theme.phrase.includes(r.phrase)
    );
    if (dominatedByExisting) continue;
    retained.push(theme);
  }

  return retained;
}

/**
 * Extract top topics — topics that appear in multiple teachers' stream
 * entries for this standard. Same k-anonymity rule as themes.
 */
function extractTopTopics(bucket: InsightBucket): string[] {
  const topicTeachers = new Map<string, Set<string>>();
  for (const [teacherId, topics] of bucket.teacherTopics) {
    for (const topic of topics) {
      const normalized = normalize(topic);
      if (!normalized) continue;
      if (!topicTeachers.has(normalized)) topicTeachers.set(normalized, new Set());
      topicTeachers.get(normalized)!.add(teacherId);
    }
  }

  return [...topicTeachers.entries()]
    .filter(([, teachers]) => teachers.size >= MIN_THEME_TEACHERS)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, MAX_TOPICS_PER_INSIGHT)
    .map(([topic]) => topic);
}

// ============================================
// AGGREGATION
// ============================================

/**
 * Weekly aggregation. Walks every topic node with standard codes across
 * every teacher, buckets their stream signals, enforces k-anonymity, and
 * upserts CollectiveInsight rows.
 *
 * Idempotent — can be safely re-run. Rows whose composite key is unchanged
 * are updated in place via the unique index.
 */
async function aggregateAllInsights(): Promise<{
  rowsWritten: number;
  rowsSkippedKAnonymity: number;
  teachersScanned: number;
  topicsScanned: number;
}> {
  const startedAt = Date.now();
  logger.info('Collective insight aggregation starting');

  // Aggregation bucket — keyed by the composite unique index
  const buckets = new Map<string, InsightBucket>();
  const bucketKey = (
    standardCode: string,
    curriculumType: string,
    gradeRange: string,
    signalType: string
  ): string => `${curriculumType}::${gradeRange}::${standardCode}::${signalType}`;

  const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

  // Step 1: pull all TOPIC nodes with linkedStandardCodes + their teacher's
  // curriculum + grade. One query gets everything we need for scoping.
  const topicNodes = await prisma.teachingGraphNode.findMany({
    where: {
      type: 'TOPIC',
      linkedStandardCodes: { isEmpty: false },
      teacher: {
        preferredCurriculum: { not: null },
        gradeRange: { not: null },
      },
    },
    select: {
      id: true,
      teacherId: true,
      linkedStandardCodes: true,
      teacher: {
        select: {
          preferredCurriculum: true,
          gradeRange: true,
        },
      },
    },
  });

  logger.info('Collective insight: topic nodes loaded', { count: topicNodes.length });

  const uniqueTeachers = new Set<string>();

  // Step 2: for each topic node, find its connected stream entries and
  // bucket their signals.
  for (const topic of topicNodes) {
    const { teacherId, linkedStandardCodes, teacher } = topic;
    if (!teacher?.preferredCurriculum || !teacher?.gradeRange) continue;

    uniqueTeachers.add(teacherId);

    // Fetch stream entries connected to this topic node via ABOUT edges.
    // Join path: topic (target) <- ABOUT edge <- STREAM_ENTRY node -> TeacherStreamEntry
    const connectedEntryNodes = await prisma.teachingGraphNode.findMany({
      where: {
        type: 'STREAM_ENTRY',
        teacherId,
        edges: {
          some: { targetId: topic.id, type: 'ABOUT' },
        },
        streamEntry: {
          extractionStatus: 'completed',
          archived: false,
          createdAt: { gte: since },
        },
      },
      select: {
        streamEntry: {
          select: {
            extractedTags: true,
          },
        },
      },
    });

    for (const node of connectedEntryNodes) {
      const tags = node.streamEntry?.extractedTags as unknown as ExtractedTags | null;
      if (!tags?.signals?.length) continue;

      const entryTopics = Array.isArray(tags.topics) ? tags.topics : [];

      // Explode: (standardCode x signal) — each signal contributes to
      // every standard linked to this topic.
      for (const signal of tags.signals) {
        if (!signal?.type || !signal?.content) continue;
        const signalType = String(signal.type).toLowerCase().trim();
        if (!KNOWN_SIGNAL_TYPES.has(signalType)) continue;

        for (const standardCode of linkedStandardCodes) {
          const key = bucketKey(
            standardCode,
            teacher.preferredCurriculum,
            teacher.gradeRange,
            signalType
          );
          let bucket = buckets.get(key);
          if (!bucket) {
            bucket = {
              standardCode,
              curriculumType: teacher.preferredCurriculum,
              gradeRange: teacher.gradeRange,
              signalType,
              teacherSignals: new Map(),
              teacherTopics: new Map(),
              totalSignalCount: 0,
            };
            buckets.set(key, bucket);
          }

          if (!bucket.teacherSignals.has(teacherId)) {
            bucket.teacherSignals.set(teacherId, []);
          }
          bucket.teacherSignals.get(teacherId)!.push(signal.content);

          if (!bucket.teacherTopics.has(teacherId)) {
            bucket.teacherTopics.set(teacherId, new Set());
          }
          for (const t of entryTopics) {
            if (typeof t === 'string' && t.trim()) {
              bucket.teacherTopics.get(teacherId)!.add(t);
            }
          }

          bucket.totalSignalCount++;
        }
      }
    }
  }

  logger.info('Collective insight: buckets built', { buckets: buckets.size });

  // Step 3: enforce k-anonymity, extract themes, upsert.
  let rowsWritten = 0;
  let rowsSkippedKAnonymity = 0;

  for (const bucket of buckets.values()) {
    const teacherCount = bucket.teacherSignals.size;
    if (teacherCount < MIN_TEACHER_THRESHOLD) {
      rowsSkippedKAnonymity++;
      continue;
    }

    const themes = extractThemes(bucket);
    const topTopics = extractTopTopics(bucket);

    // Skip rows that have no themes surviving k-anonymity — the row
    // would be a bare count with nothing to show, which isn't actionable.
    if (themes.length === 0 && topTopics.length === 0) {
      rowsSkippedKAnonymity++;
      continue;
    }

    const signalTypeBreakdown: Record<string, number> = {
      [bucket.signalType]: bucket.totalSignalCount,
    };

    const patterns: AggregatedPatterns = {
      themes,
      topTopics,
      signalTypeBreakdown,
    };

    try {
      await prisma.collectiveInsight.upsert({
        where: {
          standardCode_curriculumType_gradeRange_signalType: {
            standardCode: bucket.standardCode,
            curriculumType: bucket.curriculumType,
            gradeRange: bucket.gradeRange,
            signalType: bucket.signalType,
          },
        },
        create: {
          standardCode: bucket.standardCode,
          curriculumType: bucket.curriculumType,
          gradeRange: bucket.gradeRange,
          signalType: bucket.signalType,
          teacherCount,
          signalCount: bucket.totalSignalCount,
          aggregatedPatterns: patterns as unknown as object,
          lastComputedAt: new Date(),
        },
        update: {
          teacherCount,
          signalCount: bucket.totalSignalCount,
          aggregatedPatterns: patterns as unknown as object,
          lastComputedAt: new Date(),
        },
      });
      rowsWritten++;
    } catch (err) {
      logger.error('Failed to upsert CollectiveInsight row', {
        standardCode: bucket.standardCode,
        curriculumType: bucket.curriculumType,
        gradeRange: bucket.gradeRange,
        signalType: bucket.signalType,
        error: err,
      });
    }
  }

  const durationMs = Date.now() - startedAt;
  const summary = {
    rowsWritten,
    rowsSkippedKAnonymity,
    teachersScanned: uniqueTeachers.size,
    topicsScanned: topicNodes.length,
    durationMs,
  };
  logger.info('Collective insight aggregation complete', summary);
  return summary;
}

// ============================================
// QUERY (used by nudgeService)
// ============================================

/**
 * Return the CollectiveInsight rows that are relevant to a specific teacher.
 *
 * "Relevant" means:
 *   - Same curriculum + same gradeRange as the teacher
 *   - standardCode intersects the teacher's own TOPIC nodes' linkedStandardCodes
 *     (i.e. the teacher has actually taught this standard)
 *   - Row was computed within INSIGHT_FRESHNESS_DAYS
 *
 * Results are ordered with the most useful insights first:
 *   1. Reteach/concern signal types ranked above success/observation (they
 *      carry actionable "try this different approach" guidance)
 *   2. Higher teacherCount first (more community consensus)
 */
async function getInsightsForTeacher(teacherId: string): Promise<
  Array<{
    id: string;
    standardCode: string;
    signalType: string;
    teacherCount: number;
    signalCount: number;
    themes: Array<{ phrase: string; teacherCount: number }>;
    topTopics: string[];
  }>
> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: { preferredCurriculum: true, gradeRange: true },
  });
  if (!teacher?.preferredCurriculum || !teacher?.gradeRange) return [];

  // Gather the teacher's covered standard codes from their TOPIC nodes
  const topicNodes = await prisma.teachingGraphNode.findMany({
    where: { teacherId, type: 'TOPIC' },
    select: { linkedStandardCodes: true },
  });
  const coveredCodes = new Set<string>();
  for (const t of topicNodes) {
    for (const c of t.linkedStandardCodes) coveredCodes.add(c);
  }
  if (coveredCodes.size === 0) return [];

  const freshSince = new Date(Date.now() - INSIGHT_FRESHNESS_DAYS * 24 * 60 * 60 * 1000);

  const rows = await prisma.collectiveInsight.findMany({
    where: {
      curriculumType: teacher.preferredCurriculum,
      gradeRange: teacher.gradeRange,
      standardCode: { in: [...coveredCodes] },
      lastComputedAt: { gte: freshSince },
    },
    orderBy: [
      { teacherCount: 'desc' },
      { lastComputedAt: 'desc' },
    ],
  });

  // Sort reteach/concern ahead of success/observation at the JS layer
  // (Prisma can't do this directly without a CASE expression).
  const priorityBySignalType: Record<string, number> = {
    reteach: 3,
    concern: 3,
    success: 2,
    observation: 1,
    reflection: 1,
    idea: 1,
    preference: 1,
    schedule: 0,
  };
  rows.sort((a, b) => {
    const pa = priorityBySignalType[a.signalType] ?? 0;
    const pb = priorityBySignalType[b.signalType] ?? 0;
    if (pa !== pb) return pb - pa;
    if (b.teacherCount !== a.teacherCount) return b.teacherCount - a.teacherCount;
    return 0;
  });

  return rows.map((r) => {
    const patterns = (r.aggregatedPatterns as unknown as AggregatedPatterns) || {
      themes: [],
      topTopics: [],
      signalTypeBreakdown: {},
    };
    return {
      id: r.id,
      standardCode: r.standardCode,
      signalType: r.signalType,
      teacherCount: r.teacherCount,
      signalCount: r.signalCount,
      themes: Array.isArray(patterns.themes) ? patterns.themes : [],
      topTopics: Array.isArray(patterns.topTopics) ? patterns.topTopics : [],
    };
  });
}

// ============================================
// EXPORT
// ============================================

export const collectiveInsightService = {
  aggregateAllInsights,
  getInsightsForTeacher,
  // Expose for tests / manual tuning
  MIN_TEACHER_THRESHOLD,
  MIN_THEME_TEACHERS,
  LOOKBACK_DAYS,
  INSIGHT_FRESHNESS_DAYS,
};
