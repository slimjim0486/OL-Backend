// Proactive Suggestion Service — Generates 0-3 contextual suggestions for the dashboard/chat
// Phase 3: Added style_learned, style_conflict, weekly_improvement suggestions
import { WeeklyPrepStatus } from '@prisma/client';
import { agentMemoryService, StyleSignal } from './agentMemoryService.js';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export interface ProactiveSuggestion {
  id: string;
  type:
    | 'standards_gap'
    | 'pacing_alert'
    | 'onboarding_nudge'
    | 'content_idea'
    | 'review_reminder'
    | 'style_learned'
    | 'style_conflict'
    | 'weekly_improvement';
  title: string;
  description: string;
  actionLabel: string; // CTA button text
  actionType: string; // What the button does: "chat", "navigate", "onboarding", "dismiss"
  actionPayload?: Record<string, any>; // Params for the action
  priority: number; // 1-10, higher = more important
}

const MAX_SUGGESTIONS = 3;

// Human-readable dimension names
const DIMENSION_DISPLAY: Record<string, string> = {
  lessonLength: 'content length',
  detailLevel: 'level of detail',
  vocabularyLevel: 'vocabulary level',
  scaffolding: 'scaffolding style',
  formality: 'tone',
  questionCount: 'number of questions',
  structurePreference: 'content structure',
};

const VALUE_DISPLAY: Record<string, string> = {
  shorter: 'shorter content',
  longer: 'longer content',
  more_detail: 'more detailed explanations',
  less_detail: 'concise explanations',
  more_advanced: 'advanced vocabulary',
  simpler: 'simpler vocabulary',
  more_scaffolding: 'heavy scaffolding',
  less_scaffolding: 'lighter scaffolding',
  more_formal: 'formal tone',
  more_casual: 'casual tone',
  more_questions: 'more questions',
  fewer_questions: 'fewer questions',
  more_structured: 'well-structured formatting',
  less_structured: 'flowing prose',
};

// ============================================
// SUGGESTION GENERATION
// ============================================

async function getSuggestions(teacherId: string): Promise<ProactiveSuggestion[]> {
  const suggestions: ProactiveSuggestion[] = [];

  try {
    const agent = await agentMemoryService.getAgent(teacherId);

    if (!agent) {
      suggestions.push({
        id: 'setup-start',
        type: 'onboarding_nudge',
        title: 'Set up your AI assistant',
        description: 'Tell me about your classroom and curriculum so I can create personalized content for you.',
        actionLabel: 'Get started',
        actionType: 'navigate',
        actionPayload: { path: '/teacher/agent/setup' },
        priority: 10,
      });
      return suggestions;
    }

    // Onboarding incomplete
    if (!agent.onboardingComplete) {
      const stepLabels: Record<string, string> = {
        NOT_STARTED: 'Tell me about yourself',
        IDENTITY_COMPLETE: 'Set up your classroom',
        CLASSROOM_COMPLETE: 'Add your curriculum',
        CURRICULUM_COMPLETE: 'Confirm your profile',
      };
      suggestions.push({
        id: 'setup-continue',
        type: 'onboarding_nudge',
        title: 'Complete your assistant setup',
        description: stepLabels[agent.setupStatus] || 'Continue setting up your AI assistant.',
        actionLabel: 'Continue setup',
        actionType: 'navigate',
        actionPayload: { path: '/teacher/agent/setup' },
        priority: 9,
      });
    }

    // Standards gap detection
    const curriculumStates = await agentMemoryService.getCurriculumStates(agent.id);
    for (const state of curriculumStates) {
      const taughtNotAssessed = state.standardsTaught.filter(
        (s) => !state.standardsAssessed.includes(s)
      );
      if (taughtNotAssessed.length >= 3) {
        suggestions.push({
          id: `gap-assess-${state.subject}`,
          type: 'standards_gap',
          title: `${taughtNotAssessed.length} unassessed standards in ${state.subject}`,
          description: `You've taught ${taughtNotAssessed.length} standards that haven't been assessed yet. Want me to create a quick quiz?`,
          actionLabel: 'Create assessment',
          actionType: 'chat',
          actionPayload: {
            message: `Create a quiz covering the ${state.subject} standards I've taught but not assessed yet.`,
          },
          priority: 7,
        });
        break;
      }

      // Pacing alert
      if (state.pacingGuide) {
        const expectedWeek = getExpectedWeek();
        if (state.currentWeek < expectedWeek - 2) {
          suggestions.push({
            id: `pacing-${state.subject}`,
            type: 'pacing_alert',
            title: `Behind on ${state.subject} pacing`,
            description: `You're on week ${state.currentWeek} but the pacing guide expects week ${expectedWeek}. Let's plan how to catch up.`,
            actionLabel: 'Plan catch-up',
            actionType: 'chat',
            actionPayload: {
              message: `I'm behind on my ${state.subject} pacing guide. Help me plan how to catch up.`,
            },
            priority: 6,
          });
          break;
        }
      }
    }

    // Recent interactions check
    const recentInteractions = await agentMemoryService.getRecentInteractions(agent.id, { limit: 1 });
    if (recentInteractions.length > 0) {
      const lastActivity = new Date(recentInteractions[0].createdAt);
      const daysSince = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince >= 3 && agent.onboardingComplete) {
        suggestions.push({
          id: 'welcome-back',
          type: 'content_idea',
          title: "Welcome back! Let's plan your week",
          description: `It's been ${daysSince} days. Want me to suggest some content based on where you are in your curriculum?`,
          actionLabel: 'Plan this week',
          actionType: 'chat',
          actionPayload: {
            message: 'Help me plan my content for this week based on my curriculum pacing.',
          },
          priority: 5,
        });
      }
    } else if (agent.onboardingComplete) {
      suggestions.push({
        id: 'first-chat',
        type: 'content_idea',
        title: 'Start your first conversation',
        description: "I'm ready to help! Try asking me to create a lesson, quiz, or flashcard set.",
        actionLabel: 'Start chatting',
        actionType: 'navigate',
        actionPayload: { path: '/teacher/agent/chat' },
        priority: 8,
      });
    }

    // ============================================
    // Phase 3: Style-based suggestions
    // ============================================

    if (agent.onboardingComplete) {
      const styleSuggestions = await getStyleSuggestions(agent.id);
      suggestions.push(...styleSuggestions);

      const weeklyImprovementSugg = await getWeeklyImprovementSuggestion(agent.id);
      if (weeklyImprovementSugg) {
        suggestions.push(weeklyImprovementSugg);
      }

      // Review reminder: last 3 days of the month
      const reviewSugg = await getReviewReminderSuggestion(agent.id);
      if (reviewSugg) {
        suggestions.push(reviewSugg);
      }
    }
  } catch (error) {
    logger.error('Failed to generate proactive suggestions', { error, teacherId });
  }

  // Sort by priority and limit
  return suggestions
    .sort((a, b) => b.priority - a.priority)
    .slice(0, MAX_SUGGESTIONS);
}

// ============================================
// STYLE SUGGESTIONS (Phase 3)
// ============================================

async function getStyleSuggestions(agentId: string): Promise<ProactiveSuggestion[]> {
  const suggestions: ProactiveSuggestion[] = [];

  try {
    const profile = await agentMemoryService.getStyleProfile(agentId);
    if (!profile) return suggestions;

    const prefs = (profile.preferences as Record<string, any>) || {};
    const scores = (profile.confidenceScores as Record<string, number>) || {};
    const signals = (profile.styleSignals as unknown as StyleSignal[]) || [];

    // style_learned: notify when a preference reaches high confidence for the first time
    for (const [dim, value] of Object.entries(prefs)) {
      if (dim.startsWith('_')) continue;
      const confidence = scores[dim] || 0;
      if (confidence >= 0.8) {
        const displayDim = DIMENSION_DISPLAY[dim] || dim;
        const displayVal = VALUE_DISPLAY[value as string] || value;
        suggestions.push({
          id: `style-learned-${dim}`,
          type: 'style_learned',
          title: `I've learned your preference`,
          description: `I noticed you consistently prefer ${displayVal}. I'll apply this automatically to future content.`,
          actionLabel: 'Got it',
          actionType: 'dismiss',
          priority: 4,
        });
        break; // Only one style_learned at a time
      }
    }

    // style_conflict: detect contradictory signals for same dimension
    if (signals.length >= 10) {
      const conflicts = detectConflicts(signals);
      for (const conflict of conflicts.slice(0, 1)) {
        const displayDim = DIMENSION_DISPLAY[conflict.dimension] || conflict.dimension;
        suggestions.push({
          id: `style-conflict-${conflict.dimension}`,
          type: 'style_conflict',
          title: `Quick question about your ${displayDim} preference`,
          description: `I've noticed you sometimes prefer ${VALUE_DISPLAY[conflict.valueA] || conflict.valueA} but other times ${VALUE_DISPLAY[conflict.valueB] || conflict.valueB}. Is this subject-dependent, or do you have a general preference?`,
          actionLabel: 'Let me clarify',
          actionType: 'chat',
          actionPayload: {
            message: `Regarding my ${displayDim} preference: `,
          },
          priority: 3,
        });
      }
    }
  } catch (error) {
    logger.warn('Failed to generate style suggestions', { agentId, error });
  }

  return suggestions;
}

interface ConflictInfo {
  dimension: string;
  valueA: string;
  valueB: string;
}

/**
 * Detect dimensions where two values have similar confidence (both > 30%).
 */
function detectConflicts(signals: StyleSignal[]): ConflictInfo[] {
  const conflicts: ConflictInfo[] = [];
  const dimCounts: Record<string, Record<string, number>> = {};

  for (const signal of signals) {
    if (signal.dimension === 'general') continue;
    if (!dimCounts[signal.dimension]) dimCounts[signal.dimension] = {};
    dimCounts[signal.dimension][signal.value] = (dimCounts[signal.dimension][signal.value] || 0) + 1;
  }

  for (const [dim, counts] of Object.entries(dimCounts)) {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total < 6) continue; // Need enough data

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length >= 2) {
      const topPct = sorted[0][1] / total;
      const secondPct = sorted[1][1] / total;
      // Both above 30% = conflict
      if (topPct < 0.7 && secondPct > 0.3) {
        conflicts.push({
          dimension: dim,
          valueA: sorted[0][0],
          valueB: sorted[1][0],
        });
      }
    }
  }

  return conflicts;
}

/**
 * weekly_improvement: Summarize what was learned from the most recent weekly prep review.
 */
async function getWeeklyImprovementSuggestion(agentId: string): Promise<ProactiveSuggestion | null> {
  try {
    // Find the most recent completed weekly prep
    const recentPrep = await prisma.agentWeeklyPrep.findFirst({
      where: {
        agentId,
        status: { in: [WeeklyPrepStatus.APPROVED, WeeklyPrepStatus.REVIEWING] },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        materials: {
          select: { status: true },
        },
      },
    });

    if (!recentPrep) return null;

    // Only show for preps completed within the last 7 days
    const daysSince = Math.floor(
      (Date.now() - recentPrep.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince > 7) return null;

    const approved = recentPrep.materials.filter((m) => m.status === 'APPROVED').length;
    const edited = recentPrep.materials.filter((m) => m.status === 'EDITED').length;
    const regenerated = recentPrep.materials.filter((m) => m.status === 'REGENERATING' || m.status === 'FAILED').length;
    const total = recentPrep.materials.length;

    if (total === 0) return null;

    let description: string;
    if (edited === 0 && regenerated === 0) {
      description = `Your last weekly prep (${recentPrep.weekLabel}): ${approved} materials approved with no edits needed. Your preferences are well calibrated!`;
    } else {
      const parts: string[] = [];
      parts.push(`${approved} approved`);
      if (edited > 0) parts.push(`${edited} edited`);
      if (regenerated > 0) parts.push(`${regenerated} regenerated`);
      description = `Your last weekly prep (${recentPrep.weekLabel}): ${parts.join(', ')}. I'm learning from your edits to improve future content.`;
    }

    return {
      id: `weekly-improvement-${recentPrep.id}`,
      type: 'weekly_improvement',
      title: 'Weekly prep summary',
      description,
      actionLabel: 'View details',
      actionType: 'navigate',
      actionPayload: { path: `/teacher/agent/weekly-prep/${recentPrep.id}` },
      priority: 2,
    };
  } catch (error) {
    logger.warn('Failed to generate weekly improvement suggestion', { agentId, error });
    return null;
  }
}

// ============================================
// REVIEW REMINDER (Phase 4)
// ============================================

async function getReviewReminderSuggestion(agentId: string): Promise<ProactiveSuggestion | null> {
  try {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dayOfMonth = now.getDate();

    // Only show in the last 3 days of the month
    if (dayOfMonth < daysInMonth - 2) return null;

    // Check if a monthly review already exists for the current month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const existing = await prisma.teacherReviewSummary.findFirst({
      where: {
        agentId,
        type: 'MONTHLY',
        periodStart: { gte: monthStart },
      },
    });

    if (existing) return null;

    const monthName = now.toLocaleString('en-US', { month: 'long' });
    return {
      id: `review-reminder-${now.getFullYear()}-${now.getMonth()}`,
      type: 'review_reminder',
      title: `${monthName} review coming up`,
      description: `End of month approaching. Want me to generate your ${monthName} teaching review with insights and recommendations?`,
      actionLabel: 'Generate review',
      actionType: 'navigate',
      actionPayload: { path: '/teacher/agent/reviews' },
      priority: 5,
    };
  } catch (error) {
    logger.warn('Failed to generate review reminder', { agentId, error });
    return null;
  }
}

// ============================================
// HELPERS
// ============================================

function getExpectedWeek(): number {
  const now = new Date();
  const year = now.getFullYear();
  // Assume school year starts mid-August
  const schoolStart = new Date(
    now.getMonth() >= 7 ? year : year - 1,
    7, // August
    15
  );
  const diffMs = now.getTime() - schoolStart.getTime();
  const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
  return Math.max(1, diffWeeks);
}

// ============================================
// EXPORTS
// ============================================

export const proactiveSuggestionService = {
  getSuggestions,
};
