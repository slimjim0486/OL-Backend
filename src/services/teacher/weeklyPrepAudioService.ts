// Weekly Prep Audio Service — Generates parent-facing audio updates from weekly prep data
// Wraps audioUpdateService without modifying it. Formats weekly prep plan into lesson summaries.
import { prisma } from '../../config/database.js';
import { audioUpdateService } from './audioUpdateService.js';
import { agentMemoryService } from './agentMemoryService.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

interface PlanSubject {
  subject: string;
  topic: string;
  standards?: string[];
  materials?: Array<{ type: string; title: string; description: string }>;
}

interface PlanDay {
  dayOfWeek: number;
  date: string;
  subjects: PlanSubject[];
}

interface WeeklyPlan {
  days: PlanDay[];
  weekSummary?: string;
}

// ============================================
// SERVICE
// ============================================

/**
 * Generate an audio class update from a completed weekly prep.
 * This creates a linked TeacherAudioUpdate from the prep's plan JSON.
 * Non-fatal — caller should catch and log errors.
 */
async function generateAudioFromWeeklyPrep(prepId: string): Promise<string | null> {
  const prep = await prisma.agentWeeklyPrep.findUnique({
    where: { id: prepId },
    include: {
      agent: {
        include: {
          teacher: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      audioUpdate: { select: { id: true } },
    },
  });

  if (!prep) {
    logger.warn('Weekly prep not found for audio generation', { prepId });
    return null;
  }

  // Already has an audio update linked
  if (prep.audioUpdate) {
    logger.info('Weekly prep already has audio update', { prepId, audioUpdateId: prep.audioUpdate.id });
    return prep.audioUpdate.id;
  }

  const teacherId = prep.agent.teacherId;
  const plan = prep.plan as unknown as WeeklyPlan | null;

  if (!plan?.days?.length) {
    logger.warn('Weekly prep has no plan data for audio generation', { prepId });
    return null;
  }

  // Build lesson summaries from the plan — same format audioUpdateService expects
  const lessonSummaries = buildLessonSummariesFromPlan(plan, prep.weekLabel);

  try {
    // Generate the script using existing audio service
    const scriptResult = await audioUpdateService.generateScript(teacherId, {
      lessonIds: [], // No direct lesson IDs — we're using custom notes instead
      customNotes: lessonSummaries,
      weekLabel: prep.weekLabel,
      duration: 'medium',
    });

    // Create the audio update record linked to this weekly prep
    const audioUpdate = await prisma.teacherAudioUpdate.create({
      data: {
        teacherId,
        title: scriptResult.title || `${prep.weekLabel} - Class Update`,
        script: scriptResult.script,
        customNotes: `Auto-generated from weekly prep: ${prep.weekLabel}`,
        language: 'en',
        lessonIds: [],
        source: 'weekly_prep',
        weeklyPrepId: prepId,
        status: 'DRAFT',
        tokensUsed: scriptResult.tokensUsed,
        modelUsed: 'gemini-3-flash',
      },
    });

    logger.info('Audio update generated from weekly prep', {
      prepId,
      audioUpdateId: audioUpdate.id,
      tokensUsed: scriptResult.tokensUsed,
    });

    return audioUpdate.id;
  } catch (error) {
    logger.error('Failed to generate audio from weekly prep', {
      prepId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return null;
  }
}

/**
 * Build lesson summary text from weekly prep plan JSON.
 * Formats each day's subjects and topics into a readable summary.
 */
function buildLessonSummariesFromPlan(plan: WeeklyPlan, weekLabel: string): string {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const parts: string[] = [];

  parts.push(`WEEKLY PLAN OVERVIEW: ${weekLabel}`);
  if (plan.weekSummary) {
    parts.push(`Summary: ${plan.weekSummary}`);
  }
  parts.push('');

  for (const day of plan.days) {
    const dayName = dayNames[day.dayOfWeek] || `Day ${day.dayOfWeek + 1}`;
    const subjectLines: string[] = [];

    for (const subj of day.subjects) {
      let line = `  - ${subj.subject}: ${subj.topic}`;
      if (subj.standards?.length) {
        line += ` (Standards: ${subj.standards.slice(0, 3).join(', ')})`;
      }
      if (subj.materials?.length) {
        const materialTypes = subj.materials.map(m => m.type).join(', ');
        line += ` [Materials: ${materialTypes}]`;
      }
      subjectLines.push(line);
    }

    if (subjectLines.length > 0) {
      parts.push(`${dayName}:`);
      parts.push(...subjectLines);
      parts.push('');
    }
  }

  return parts.join('\n');
}

// ============================================
// EXPORTS
// ============================================

export const weeklyPrepAudioService = {
  generateAudioFromWeeklyPrep,
};
