// Weekly Prep Audio Service — Generates parent-facing audio updates from weekly prep data
// Wraps audioUpdateService without modifying it. Formats weekly prep plan into lesson summaries.
import { prisma } from '../../config/database.js';
import { audioUpdateService } from './audioUpdateService.js';
import { logger } from '../../utils/logger.js';
import { buildLessonSummariesFromPlan, type WeeklyPlan } from './weeklyPrepAudioUtils.js';

// ============================================
// TYPES
// ============================================

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
      lessonSummaries,
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

// ============================================
// EXPORTS
// ============================================

export const weeklyPrepAudioService = {
  generateAudioFromWeeklyPrep,
};
