// Nudge Service — Teacher Intelligence Platform
// Generates smart nudges based on teaching graph, preferences, and activity patterns
import { NudgeType } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

// ============================================
// CONSTANTS
// ============================================

const MAX_ACTIVE_NUDGES = 3;
const NUDGE_EXPIRY_DAYS = 7;

const PRIORITY: Record<NudgeType, number> = {
  CURRICULUM_GAP: 3,
  PREREQUISITE_GAP: 3, // "blocks next week's plan" is high-signal → same tier as gap
  RETEACH_SUGGESTION: 2,
  PACING_BEHIND: 2,
  PACING_AHEAD: 1,
  PREFERENCE_LEARNED: 1,
  COLLECTIVE_INSIGHT: 1,
};

// Minimum days since first stream entry before pacing nudges apply
const PACING_MIN_DAYS = 60;
// Coverage threshold below which a pacing-behind nudge fires
const PACING_BEHIND_THRESHOLD = 0.3;

// ============================================
// NUDGE GENERATORS
// ============================================

/**
 * CURRICULUM_GAP — Compare teacher's TOPIC nodes' linkedStandardCodes against full curriculum.
 * Standards not linked to any topic = gaps. Surfaces as nudge text, NOT as graph nodes.
 */
async function generateCurriculumGapNudges(teacherId: string): Promise<NudgeCandidate[]> {
  const candidates: NudgeCandidate[] = [];

  try {
    // Get teacher's curriculum config
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { preferredCurriculum: true, gradeRange: true, primarySubject: true },
    });

    if (!teacher?.preferredCurriculum || !teacher?.primarySubject) return candidates;

    // Collect all linkedStandardCodes from TOPIC nodes
    const topicNodes = await prisma.teachingGraphNode.findMany({
      where: { teacherId, type: 'TOPIC' },
      select: { id: true, label: true, linkedStandardCodes: true },
    });

    const coveredCodes = new Set<string>();
    for (const node of topicNodes) {
      for (const code of node.linkedStandardCodes) {
        coveredCodes.add(code);
      }
    }

    // Get full standards for this teacher's curriculum
    const { curriculumAdapterService } = await import('./curriculumAdapterService.js');
    const allStandards = await curriculumAdapterService.getStandardsForTeacher(
      teacher.preferredCurriculum,
      teacher.gradeRange || '',
      [teacher.primarySubject],
    );

    // Find uncovered standards grouped by strand/topic area
    const uncoveredStrands = new Map<string, number>();
    for (const std of allStandards) {
      if (!coveredCodes.has(std.code)) {
        const area = std.strand || std.subject;
        uncoveredStrands.set(area, (uncoveredStrands.get(area) || 0) + 1);
      }
    }

    // Create nudges for the top gaps
    const sortedGaps = Array.from(uncoveredStrands.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    for (const [area, count] of sortedGaps) {
      const content = `You haven't touched ${area} this term (${count} standards). Consider adding some stream notes or materials in this area.`;

      candidates.push({
        type: NudgeType.CURRICULUM_GAP,
        content,
        priority: PRIORITY.CURRICULUM_GAP,
        relatedTopicId: null,
        relatedStandardId: null,
        actionContext: {
          actionType: 'view_standards',
          subject: teacher.primarySubject,
        },
      });
    }
  } catch (err) {
    logger.error('Failed to generate curriculum gap nudges', { teacherId, error: err });
  }

  return candidates;
}

/**
 * RETEACH_SUGGESTION — Find materials with negative outcome ratings and
 * suggest re-teaching those topics.
 */
async function generateReteachNudges(teacherId: string): Promise<NudgeCandidate[]> {
  const candidates: NudgeCandidate[] = [];

  try {
    const problemMaterials = await prisma.teacherMaterial.findMany({
      where: {
        teacherId,
        outcomeRating: { in: ['DIDNT_WORK', 'NEEDED_TWEAKS'] },
      },
      orderBy: { outcomeRatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        subject: true,
        topics: true,
        outcomeRating: true,
      },
    });

    for (const material of problemMaterials) {
      const severity = material.outcomeRating === 'DIDNT_WORK' ? 'didn\'t work well' : 'needed tweaks';
      const topicStr = material.topics.length > 0 ? material.topics.join(', ') : material.subject;
      const content = `Your material "${material.title}" ${severity}. Consider a reteach activity for ${topicStr} using a different approach.`;

      candidates.push({
        type: NudgeType.RETEACH_SUGGESTION,
        content,
        priority: PRIORITY.RETEACH_SUGGESTION,
        relatedTopicId: null,
        relatedStandardId: null,
        actionContext: {
          actionType: 'reteach_material',
          materialId: material.id,
          materialTitle: material.title,
          subject: material.subject || undefined,
          topicLabel: material.topics[0] || undefined,
        },
      });
    }
  } catch (err) {
    logger.error('Failed to generate reteach nudges', { teacherId, error: err });
  }

  return candidates;
}

/**
 * PACING_BEHIND — If a teacher has curriculum graph nodes but less than 30%
 * are COVERED or DEEP after 60+ days since their first stream entry.
 */
async function generatePacingNudges(teacherId: string): Promise<NudgeCandidate[]> {
  const candidates: NudgeCandidate[] = [];

  try {
    // Check if the teacher has been active long enough
    const firstEntry = await prisma.teacherStreamEntry.findFirst({
      where: { teacherId },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    });

    if (!firstEntry) return candidates;

    const daysSinceFirst = Math.floor(
      (Date.now() - firstEntry.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceFirst < PACING_MIN_DAYS) return candidates;

    // Count topic nodes (the teacher's actual coverage)
    const topicNodes = await prisma.teachingGraphNode.findMany({
      where: { teacherId, type: 'TOPIC' },
      select: { linkedStandardCodes: true },
    });

    if (topicNodes.length === 0) return candidates;

    // Get total standards for this teacher's curriculum
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { preferredCurriculum: true, gradeRange: true, primarySubject: true },
    });

    if (!teacher?.preferredCurriculum) return candidates;

    const { curriculumAdapterService } = await import('./curriculumAdapterService.js');
    const totalStandards = await curriculumAdapterService.getStandardsCount(
      teacher.preferredCurriculum,
      teacher.gradeRange || undefined,
      teacher.primarySubject || undefined,
    );

    if (totalStandards === 0) return candidates;

    const coveredCodes = new Set<string>();
    for (const node of topicNodes) {
      for (const code of node.linkedStandardCodes) {
        coveredCodes.add(code);
      }
    }

    const coverageRatio = coveredCodes.size / totalStandards;

    if (coverageRatio < PACING_BEHIND_THRESHOLD) {
      const pct = Math.round(coverageRatio * 100);
      const content = `You've covered ${pct}% of your curriculum standards after ${daysSinceFirst} days. You may want to pick up the pace to stay on track for the year.`;

      candidates.push({
        type: NudgeType.PACING_BEHIND,
        content,
        priority: PRIORITY.PACING_BEHIND,
        relatedTopicId: null,
        relatedStandardId: null,
        actionContext: {
          actionType: 'view_standards',
          subject: teacher.primarySubject || undefined,
        },
      });
    }
  } catch (err) {
    logger.error('Failed to generate pacing nudges', { teacherId, error: err });
  }

  return candidates;
}

/**
 * PREFERENCE_LEARNED — If the preference profile has any confidence score >= 0.8,
 * tell the teacher what Ollie has learned about their style.
 */
async function generatePreferenceNudges(teacherId: string): Promise<NudgeCandidate[]> {
  const candidates: NudgeCandidate[] = [];

  try {
    const profile = await prisma.teacherPreferenceProfile.findUnique({
      where: { teacherId },
    });

    if (!profile || !profile.confidenceScores) return candidates;

    const scores = profile.confidenceScores as Record<string, number>;
    const highConfidenceDimensions: string[] = [];

    for (const [dimension, confidence] of Object.entries(scores)) {
      if (typeof confidence === 'number' && confidence >= 0.8) {
        highConfidenceDimensions.push(dimension);
      }
    }

    if (highConfidenceDimensions.length === 0) return candidates;

    // Build a human-readable preference summary
    const prefParts: string[] = [];

    if (highConfidenceDimensions.includes('vocabularyLevel') && profile.vocabularyLevel) {
      prefParts.push(`${profile.vocabularyLevel} vocabulary`);
    }
    if (highConfidenceDimensions.includes('difficultyBias') && profile.difficultyBias) {
      prefParts.push(`${profile.difficultyBias} difficulty level`);
    }
    if (highConfidenceDimensions.includes('averageLessonLength') && profile.averageLessonLength) {
      prefParts.push(`${profile.averageLessonLength} lesson lengths`);
    }
    if (highConfidenceDimensions.includes('preferredFormats') && profile.preferredFormats.length > 0) {
      prefParts.push(`${profile.preferredFormats.join(', ')} formats`);
    }

    // Fallback: just mention the dimension names
    if (prefParts.length === 0) {
      for (const dim of highConfidenceDimensions.slice(0, 3)) {
        prefParts.push(dim.replace(/([A-Z])/g, ' $1').toLowerCase().trim());
      }
    }

    const prefStr = prefParts.join(', ');
    const content = `I've noticed you prefer ${prefStr}. I'll keep tailoring materials to match your style.`;

    candidates.push({
      type: NudgeType.PREFERENCE_LEARNED,
      content,
      priority: PRIORITY.PREFERENCE_LEARNED,
      relatedTopicId: null,
      relatedStandardId: null,
      actionContext: { actionType: 'view_preferences' },
    });
  } catch (err) {
    logger.error('Failed to generate preference nudges', { teacherId, error: err });
  }

  return candidates;
}

/**
 * PREREQUISITE_GAP — For each upcoming topic in the teacher's CurriculumState,
 * resolve the topic to real standards (via matchStandardsByTopic), walk their
 * `prerequisites` arrays (DB IDs), translate back to notations, and compare
 * against the teacher's already-covered codes (unioned from all TOPIC nodes'
 * `linkedStandardCodes`). If a prerequisite is uncovered, emit a nudge.
 *
 * Depends on LearningStandard.prerequisites being populated. Degrades
 * gracefully to zero nudges for curricula whose prereq data hasn't been
 * backfilled yet.
 *
 * Max 2 nudges emitted per run (one per upcoming topic) to avoid spam.
 */
async function generatePrerequisiteGapNudges(teacherId: string): Promise<NudgeCandidate[]> {
  const candidates: NudgeCandidate[] = [];
  const MAX_PREREQ_NUDGES = 2;

  try {
    // Resolve the teacher's agent + curriculum states
    const agent = await prisma.teacherAgent.findUnique({
      where: { teacherId },
      select: { id: true, curriculumType: true },
    });
    if (!agent) return candidates;

    const states = await prisma.curriculumState.findMany({
      where: { agentId: agent.id },
      select: {
        subject: true,
        topicProgress: true,
      },
    });
    if (states.length === 0) return candidates;

    // Teacher's already-covered standard notations, unioned across all topic nodes.
    const coveredTopicNodes = await prisma.teachingGraphNode.findMany({
      where: { teacherId, type: 'TOPIC' },
      select: { linkedStandardCodes: true },
    });
    const coveredSet = new Set<string>();
    for (const t of coveredTopicNodes) {
      for (const code of t.linkedStandardCodes) coveredSet.add(code);
    }

    // We need curriculumAdapterService for the matchStandardsByTopic step —
    // lazy-load to keep the module's import graph lean.
    const { curriculumAdapterService } = await import('./curriculumAdapterService.js');

    const curriculum = agent.curriculumType || 'BRITISH';

    for (const state of states) {
      if (candidates.length >= MAX_PREREQ_NUDGES) break;

      const tp = state.topicProgress as any;
      const upNext: string[] = Array.isArray(tp?.upNextTopics)
        ? tp.upNextTopics.filter((t: any) => typeof t === 'string' && t.trim())
        : [];
      if (upNext.length === 0) continue;

      for (const upcomingTopic of upNext) {
        if (candidates.length >= MAX_PREREQ_NUDGES) break;

        // Match the upcoming topic phrase to real standards via keyword search
        const matched = await curriculumAdapterService.matchStandardsByTopic(
          upcomingTopic,
          curriculum,
          state.subject,
        );
        if (matched.length === 0) continue;

        // Pull the full LearningStandard records so we can see prerequisites
        const codes = matched.map((m) => m.code).filter(Boolean);
        if (codes.length === 0) continue;

        const fullStandards = await prisma.learningStandard.findMany({
          where: { notation: { in: codes } },
          select: { id: true, notation: true, description: true, prerequisites: true },
        });

        // Collect prereq IDs, translate to notations
        const prereqIds = new Set<string>();
        for (const s of fullStandards) {
          for (const pid of s.prerequisites || []) prereqIds.add(pid);
        }
        if (prereqIds.size === 0) continue;

        const prereqStandards = await prisma.learningStandard.findMany({
          where: { id: { in: [...prereqIds] } },
          select: { id: true, notation: true, description: true },
        });

        // Pick the first uncovered prereq (if any) as the nudge's headline
        const uncovered = prereqStandards.find(
          (p) => p.notation && !coveredSet.has(p.notation)
        );
        if (!uncovered) continue;

        // Short human-readable name for the prereq — first 70 chars of description
        const prereqLabel = uncovered.description.length > 70
          ? uncovered.description.slice(0, 67) + '...'
          : uncovered.description;

        candidates.push({
          type: NudgeType.PREREQUISITE_GAP,
          content: `"${prereqLabel}" is a prerequisite for ${upcomingTopic}, which is on your upcoming plan. Consider covering it first.`,
          priority: PRIORITY.PREREQUISITE_GAP,
          relatedTopicId: null,
          relatedStandardId: uncovered.id,
          actionContext: {
            actionType: 'view_standards',
            subject: state.subject,
          },
        });
      }
    }
  } catch (err) {
    logger.error('Failed to generate prerequisite gap nudges', { teacherId, error: err });
  }

  return candidates;
}

/**
 * COLLECTIVE_INSIGHT — Surfaces aggregated patterns from other teachers
 * working on the same curriculum standard. Reads from the CollectiveInsight
 * table populated by the weekly collectiveInsightsAggregationJob.
 *
 * Privacy: the service layer guarantees each insight row represents
 * >= MIN_TEACHER_THRESHOLD distinct teachers, and each theme phrase is
 * itself shared across multiple teachers. This generator simply formats
 * the pre-anonymized data into a sentence — no further filtering needed.
 *
 * Emits at most 1 nudge per run (low-priority, community tone).
 */
async function generateCollectiveInsightNudges(teacherId: string): Promise<NudgeCandidate[]> {
  const candidates: NudgeCandidate[] = [];
  const MAX_INSIGHT_NUDGES = 1;

  try {
    const { collectiveInsightService } = await import('./collectiveInsightService.js');
    const insights = await collectiveInsightService.getInsightsForTeacher(teacherId);
    if (insights.length === 0) return candidates;

    for (const insight of insights) {
      if (candidates.length >= MAX_INSIGHT_NUDGES) break;

      // Require at least one theme survived k-anonymity — without a theme
      // the nudge has nothing actionable to say.
      if (insight.themes.length === 0) continue;

      // Pick the topic label: first topTopic if present, else the signalType
      const topicLabel = insight.topTopics[0] || insight.signalType;

      // Build a short, readable sentence from the top themes. We list up to
      // the first 2 themes so the sentence stays natural.
      const themePhrases = insight.themes
        .slice(0, 2)
        .map((t) => `"${t.phrase}"`)
        .join(' and ');

      let content: string;
      if (insight.signalType === 'reteach' || insight.signalType === 'concern') {
        content = `${insight.teacherCount} other teachers working on ${topicLabel} hit similar snags — the approaches that came up most often were ${themePhrases}. Worth a look if your students are struggling.`;
      } else if (insight.signalType === 'success') {
        content = `${insight.teacherCount} other teachers had wins with ${topicLabel} — ${themePhrases} kept coming up. Might be worth trying if you haven't already.`;
      } else {
        content = `${insight.teacherCount} other teachers flagged ${topicLabel} this term, and ${themePhrases} kept showing up in their notes. Could be relevant to what you're planning.`;
      }

      candidates.push({
        type: NudgeType.COLLECTIVE_INSIGHT,
        content,
        priority: PRIORITY.COLLECTIVE_INSIGHT,
        relatedTopicId: null,
        relatedStandardId: null,
        actionContext: {
          actionType: 'view_insight',
          insightId: insight.id,
        },
      });
    }
  } catch (err) {
    logger.error('Failed to generate collective insight nudges', { teacherId, error: err });
  }

  return candidates;
}

// ============================================
// TYPES
// ============================================

/**
 * Structured routing data populated by each generator and consumed by the
 * frontend's "Take Action" router. Keep this shape synced with the frontend
 * NudgeActionContext type in StreamPage.jsx.
 */
type NudgeActionContext =
  | { actionType: 'view_standards'; subject?: string }
  | { actionType: 'reteach_material'; materialId: string; materialTitle: string; subject?: string; topicLabel?: string }
  | { actionType: 'view_weekly_prep' }
  | { actionType: 'view_preferences' }
  | { actionType: 'view_insight'; insightId?: string };

interface NudgeCandidate {
  type: NudgeType;
  content: string;
  priority: number;
  relatedTopicId: string | null;
  relatedStandardId: string | null;
  actionContext: NudgeActionContext;
}

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Generate nudges for a teacher. Called by daily cron job.
 * Skips if the teacher already has >= MAX_ACTIVE_NUDGES active nudges.
 * Runs generators in priority order and creates nudge records.
 */
async function generateNudges(teacherId: string): Promise<void> {
  try {
    // Check existing active nudges
    const now = new Date();
    const activeCount = await prisma.teacherNudge.count({
      where: {
        teacherId,
        dismissed: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
    });

    if (activeCount >= MAX_ACTIVE_NUDGES) {
      logger.info('Teacher already has max active nudges, skipping generation', {
        teacherId,
        activeCount,
      });
      return;
    }

    const slotsAvailable = MAX_ACTIVE_NUDGES - activeCount;

    // Run generators in priority order (highest priority first)
    const allCandidates: NudgeCandidate[] = [];

    const gapNudges = await generateCurriculumGapNudges(teacherId);
    allCandidates.push(...gapNudges);

    const prerequisiteGapNudges = await generatePrerequisiteGapNudges(teacherId);
    allCandidates.push(...prerequisiteGapNudges);

    const reteachNudges = await generateReteachNudges(teacherId);
    allCandidates.push(...reteachNudges);

    const pacingNudges = await generatePacingNudges(teacherId);
    allCandidates.push(...pacingNudges);

    const preferenceNudges = await generatePreferenceNudges(teacherId);
    allCandidates.push(...preferenceNudges);

    const collectiveInsightNudges = await generateCollectiveInsightNudges(teacherId);
    allCandidates.push(...collectiveInsightNudges);

    if (allCandidates.length === 0) {
      logger.info('No nudge candidates generated', { teacherId });
      return;
    }

    // Sort by priority descending, take only what fits
    allCandidates.sort((a, b) => b.priority - a.priority);
    const toCreate = allCandidates.slice(0, slotsAvailable);

    // Deduplicate against existing nudges of the same type that are still active
    const existingTypes = await prisma.teacherNudge.findMany({
      where: {
        teacherId,
        dismissed: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
      select: { type: true, content: true },
    });

    const existingSet = new Set(existingTypes.map(n => `${n.type}::${n.content}`));
    const deduplicated = toCreate.filter(c => !existingSet.has(`${c.type}::${c.content}`));

    if (deduplicated.length === 0) {
      logger.info('All nudge candidates already exist, skipping', { teacherId });
      return;
    }

    const expiresAt = new Date(now.getTime() + NUDGE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    // Create nudge records
    const created = await prisma.teacherNudge.createMany({
      data: deduplicated.map(candidate => ({
        teacherId,
        type: candidate.type,
        content: candidate.content,
        priority: candidate.priority,
        relatedTopicId: candidate.relatedTopicId,
        relatedStandardId: candidate.relatedStandardId,
        actionContext: candidate.actionContext as any,
        showAfter: now,
        expiresAt,
      })),
    });

    logger.info('Nudges generated', {
      teacherId,
      count: created.count,
      types: deduplicated.map(c => c.type),
    });
  } catch (err) {
    logger.error('Failed to generate nudges', { teacherId, error: err });
    throw err;
  }
}

/**
 * Channel routing for nudges.
 *
 * Stream channel: timely, conversational nudges shown as "Ollie whispers" at
 * the top of the teacher's stream. Max 1 at a time, ephemeral.
 *
 * Graph channel: structural observations (curriculum gaps, pacing) that live
 * on the teaching graph as ghost nodes and aggregate indicators — never
 * cluttering the stream feed.
 */
export type NudgeChannel = 'stream' | 'graph';

const STREAM_NUDGE_TYPES: readonly NudgeType[] = [
  NudgeType.RETEACH_SUGGESTION,
  NudgeType.PREFERENCE_LEARNED,
  NudgeType.COLLECTIVE_INSIGHT,
  NudgeType.PREREQUISITE_GAP,
] as const;

const GRAPH_NUDGE_TYPES: readonly NudgeType[] = [
  NudgeType.CURRICULUM_GAP,
  NudgeType.PACING_BEHIND,
  NudgeType.PACING_AHEAD,
] as const;

function nudgeTypesForChannel(channel: NudgeChannel): readonly NudgeType[] {
  return channel === 'stream' ? STREAM_NUDGE_TYPES : GRAPH_NUDGE_TYPES;
}

/**
 * Get active nudges for a teacher.
 * Active = not dismissed, showAfter <= now, and not expired.
 *
 * When `channel` is provided, only nudges routed to that surface are
 * returned. The stream channel is additionally capped at 1 nudge (highest
 * priority, most recent) so Ollie never stacks whispers.
 *
 * When no channel is provided the legacy behaviour is preserved (returns all
 * active nudges, no cap) — used by internal callers and backward compat.
 */
async function getActiveNudges(teacherId: string, channel?: NudgeChannel) {
  const now = new Date();

  const typeFilter = channel
    ? { type: { in: [...nudgeTypesForChannel(channel)] } }
    : {};

  const nudges = await prisma.teacherNudge.findMany({
    where: {
      teacherId,
      dismissed: false,
      showAfter: { lte: now },
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ],
      ...typeFilter,
    },
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' },
    ],
    // Stream is capped at 1 (no stacking). Graph returns everything.
    ...(channel === 'stream' ? { take: 1 } : {}),
  });

  // Mark as shown if not already
  const unshownIds = nudges.filter(n => !n.shown).map(n => n.id);
  if (unshownIds.length > 0) {
    await prisma.teacherNudge.updateMany({
      where: { id: { in: unshownIds } },
      data: { shown: true },
    });
  }

  return nudges;
}

/**
 * Dismiss a nudge. Validates ownership.
 */
async function dismissNudge(teacherId: string, nudgeId: string) {
  const nudge = await prisma.teacherNudge.findFirst({
    where: { id: nudgeId, teacherId },
  });

  if (!nudge) {
    throw new Error('Nudge not found');
  }

  const updated = await prisma.teacherNudge.update({
    where: { id: nudgeId },
    data: { dismissed: true },
  });

  logger.info('Nudge dismissed', { teacherId, nudgeId, type: nudge.type });
  return updated;
}

/**
 * Mark a nudge as acted on. Validates ownership.
 */
async function actOnNudge(teacherId: string, nudgeId: string) {
  const nudge = await prisma.teacherNudge.findFirst({
    where: { id: nudgeId, teacherId },
  });

  if (!nudge) {
    throw new Error('Nudge not found');
  }

  const updated = await prisma.teacherNudge.update({
    where: { id: nudgeId },
    data: { actedOn: true },
  });

  logger.info('Nudge acted on', { teacherId, nudgeId, type: nudge.type });
  return updated;
}

// ============================================
// EXPORT
// ============================================

export const nudgeService = {
  generateNudges,
  getActiveNudges,
  dismissNudge,
  actOnNudge,
  // Channel routing helpers
  STREAM_NUDGE_TYPES,
  GRAPH_NUDGE_TYPES,
};
