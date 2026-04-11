/**
 * Stream Extraction Job Queue — Teacher Intelligence Platform
 * Processes stream entries through Gemini Flash to extract tags.
 */
import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';
import {
  streamExtractionService,
  type ExtractedTags,
  type CurriculumSignals,
} from '../services/teacher/streamExtractionService.js';
import { sseService } from '../services/teacher/sseService.js';
import { teachingGraphService } from '../services/teacher/teachingGraphService.js';
import { studentMentionService } from '../services/teacher/studentMentionService.js';
import { TokenOperation } from '@prisma/client';

const QUEUE_NAME = 'stream-extract';

export interface StreamExtractionJobData {
  entryId: string;
  teacherId: string;
}

interface StreamExtractionJobResult {
  success: boolean;
  entryId: string;
  error?: string;
}

let extractionQueue: Queue<StreamExtractionJobData, StreamExtractionJobResult> | null = null;
let extractionWorker: Worker<StreamExtractionJobData, StreamExtractionJobResult> | null = null;

export async function initializeStreamExtractionJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    extractionQueue = new Queue<StreamExtractionJobData, StreamExtractionJobResult>(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 100,
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 10000,
        },
      },
    });

    extractionWorker = new Worker<StreamExtractionJobData, StreamExtractionJobResult>(
      QUEUE_NAME,
      async (job: Job<StreamExtractionJobData, StreamExtractionJobResult>) => {
        return processStreamExtractionJob(job);
      },
      {
        connection: createBullConnection(),
        concurrency: 3,
        lockDuration: 60000,
        lockRenewTime: 15000,
      }
    );

    extractionWorker.on('completed', (job, result) => {
      logger.info('Stream extraction job completed', {
        jobId: job?.id,
        entryId: result?.entryId,
        success: result?.success,
      });
    });

    extractionWorker.on('failed', (job, err) => {
      logger.error('Stream extraction job failed', {
        jobId: job?.id,
        entryId: job?.data?.entryId,
        error: err.message,
      });
    });

    logger.info('Stream extraction job queue initialized');
  } catch (error) {
    logger.error('Failed to initialize stream extraction job queue', { error });
  }
}

/**
 * Item B (Phase 4.8 follow-up): compute whether any of the current entry's
 * extracted topics are a PREREQUISITE for a topic the teacher has flagged as
 * "up next" in their curriculum state.
 *
 * Join, in order:
 *   1. extractedTags.topics → TeachingGraphNode.linkedStandardCodes
 *      (find which notations the teacher's topic nodes cover for the topics
 *      just extracted from this entry)
 *   2. notations → LearningStandard.progressesTo
 *      (the standard IDs this standard feeds into)
 *   3. progressesTo IDs → LearningStandard.notation
 *      (resolve those downstream IDs back to human-readable notations)
 *   4. downstream notations → TeachingGraphNode.linkedStandardCodes hasSome
 *      (find topic nodes the teacher has created that cover those downstream
 *      standards — gives us teacher-authored topic labels, which is what
 *      upNextTopics is stored as)
 *   5. downstream topic labels ∩ CurriculumState.topicProgress.upNextTopics
 *      (fuzzy case-insensitive match)
 *
 * Graceful no-op until the Phase 4.8 Phase B prerequisite data backfill
 * lands. Before that, `LearningStandard.progressesTo` is empty for every
 * row, so step 2 returns an empty set and we short-circuit to false with
 * zero user-visible effect.
 */
async function computeCurriculumSignals(
  teacherId: string,
  extractedTopics: string[],
): Promise<CurriculumSignals> {
  const falseResult: CurriculumSignals = { isPrerequisiteForUpcoming: false };
  if (!extractedTopics.length) return falseResult;

  try {
    // Step 1: find the teacher's topic nodes that match the extracted topics.
    // Case-insensitive match via Prisma `mode: 'insensitive'` on `in` is not
    // supported, so normalize in-memory.
    const allTopicNodes = await prisma.teachingGraphNode.findMany({
      where: { teacherId, type: 'TOPIC' },
      select: { label: true, linkedStandardCodes: true },
    });
    const lowerExtracted = new Set(
      extractedTopics.map(t => t.toLowerCase().trim()).filter(Boolean),
    );
    const currentNotations = new Set<string>();
    for (const node of allTopicNodes) {
      if (!node.label) continue;
      if (!lowerExtracted.has(node.label.toLowerCase().trim())) continue;
      for (const code of node.linkedStandardCodes) {
        if (code) currentNotations.add(code);
      }
    }
    if (currentNotations.size === 0) return falseResult;

    // Step 2: resolve notations → standards → progressesTo IDs
    const currentStandards = await prisma.learningStandard.findMany({
      where: { notation: { in: [...currentNotations] } },
      select: { progressesTo: true },
    });
    const downstreamIds = new Set<string>();
    for (const s of currentStandards) {
      for (const id of s.progressesTo || []) {
        if (id) downstreamIds.add(id);
      }
    }
    if (downstreamIds.size === 0) return falseResult;

    // Step 3: resolve downstream standard IDs → notations
    const downstreamStandards = await prisma.learningStandard.findMany({
      where: { id: { in: [...downstreamIds] } },
      select: { notation: true },
    });
    const downstreamNotations = new Set<string>();
    for (const s of downstreamStandards) {
      if (s.notation) downstreamNotations.add(s.notation);
    }
    if (downstreamNotations.size === 0) return falseResult;

    // Step 4: find the teacher's topic nodes covering any downstream notation
    const downstreamTopicNodes = await prisma.teachingGraphNode.findMany({
      where: {
        teacherId,
        type: 'TOPIC',
        linkedStandardCodes: { hasSome: [...downstreamNotations] },
      },
      select: { label: true },
    });
    const downstreamLabelsLower = new Set<string>();
    for (const node of downstreamTopicNodes) {
      if (node.label) {
        const normalized = node.label.toLowerCase().trim();
        if (normalized) downstreamLabelsLower.add(normalized);
      }
    }

    // Step 5: load teacher's curriculum states and collect upNextTopics.
    // CurriculumState is keyed by agentId — filter through the agent relation.
    const states = await prisma.curriculumState.findMany({
      where: { agent: { teacherId } },
      select: { topicProgress: true },
    });
    const upNextLower: string[] = [];
    for (const state of states) {
      const tp = state.topicProgress as { upNextTopics?: unknown } | null;
      if (tp && Array.isArray(tp.upNextTopics)) {
        for (const t of tp.upNextTopics) {
          if (typeof t === 'string' && t.trim()) {
            upNextLower.push(t.toLowerCase().trim());
          }
        }
      }
    }
    if (upNextLower.length === 0) return falseResult;

    // Compare: (a) downstream topic labels exact/substring match, and
    // (b) downstream notations exact match (in case a teacher typed a
    // notation directly into upNextTopics during onboarding).
    for (const label of downstreamLabelsLower) {
      for (const upNext of upNextLower) {
        if (label === upNext || label.includes(upNext) || upNext.includes(label)) {
          return { isPrerequisiteForUpcoming: true };
        }
      }
    }
    for (const notation of downstreamNotations) {
      const lower = notation.toLowerCase();
      if (upNextLower.includes(lower)) {
        return { isPrerequisiteForUpcoming: true };
      }
    }

    return falseResult;
  } catch (err) {
    logger.warn('computeCurriculumSignals failed (non-fatal)', {
      teacherId,
      error: (err as Error).message,
    });
    return falseResult;
  }
}

async function processStreamExtractionJob(
  job: Job<StreamExtractionJobData, StreamExtractionJobResult>
): Promise<StreamExtractionJobResult> {
  const { entryId, teacherId } = job.data;

  try {
    // Mark as processing
    await prisma.teacherStreamEntry.update({
      where: { id: entryId },
      data: { extractionStatus: 'processing' },
    });

    // Load entry
    const entry = await prisma.teacherStreamEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      throw new Error(`Stream entry not found: ${entryId}`);
    }

    // Load teacher profile for context
    const profile = await streamExtractionService.getTeacherProfile(teacherId);

    // Extract tags via Gemini Flash
    const { tags, tokensUsed } = await streamExtractionService.extractTags(entry.content, profile);

    // Update entry with extracted tags
    await prisma.teacherStreamEntry.update({
      where: { id: entryId },
      data: {
        extractedTags: tags as any,
        extractionStatus: 'completed',
      },
    });

    // Log token usage
    await prisma.tokenUsageLog.create({
      data: {
        teacherId,
        operation: TokenOperation.STREAM_EXTRACTION,
        tokensUsed,
        modelUsed: 'gemini-3-flash-preview',
      },
    });

    // Update teaching graph with extracted tags
    try {
      await teachingGraphService.processStreamEntry(teacherId, entryId);
    } catch (graphErr) {
      logger.error('Failed to update graph from stream entry', { entryId, error: (graphErr as Error).message });
      // Non-fatal: graph update failure shouldn't block extraction success
    }

    // Process student mentions (silent entity linking)
    try {
      await studentMentionService.processEntryMentions(teacherId, entryId, tags);
    } catch (mentionErr) {
      logger.error('Failed to process student mentions', { entryId, error: (mentionErr as Error).message });
      // Non-fatal: mention processing failure shouldn't block extraction success
    }

    // Item B: compute curriculum signals after graph update. Runs against
    // the now-current graph so topic nodes created/touched by this entry
    // are part of the join. Merged into extractedTags via a second write
    // so the SSE payload and subsequent /stream loads both see the flag.
    let enrichedTags: ExtractedTags = tags;
    try {
      const curriculumSignals = await computeCurriculumSignals(
        teacherId,
        tags.topics || [],
      );
      if (curriculumSignals.isPrerequisiteForUpcoming) {
        enrichedTags = { ...tags, curriculumSignals };
        await prisma.teacherStreamEntry.update({
          where: { id: entryId },
          data: { extractedTags: enrichedTags as any },
        });
      }
    } catch (signalErr) {
      logger.warn('Curriculum signal enrichment failed (non-fatal)', {
        entryId,
        error: (signalErr as Error).message,
      });
    }

    // Send SSE event to teacher
    sseService.sendEvent(teacherId, {
      type: 'tags-extracted',
      data: { entryId, tags: enrichedTags },
    });

    logger.info('Stream extraction completed', { teacherId, entryId, tokensUsed });

    return { success: true, entryId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    const maxAttempts = job.opts.attempts ?? 1;
    const isFinalAttempt = job.attemptsMade + 1 >= maxAttempts;

    if (isFinalAttempt) {
      try {
        await prisma.teacherStreamEntry.update({
          where: { id: entryId },
          data: { extractionStatus: 'failed' },
        });
      } catch (updateErr) {
        logger.error('Failed to update entry status to failed', { entryId, error: (updateErr as Error).message });
      }
    } else {
      try {
        await prisma.teacherStreamEntry.update({
          where: { id: entryId },
          data: { extractionStatus: 'pending' },
        });
      } catch (updateErr) {
        logger.error('Failed to reset entry status before retry', { entryId, error: (updateErr as Error).message });
      }
    }

    logger.error('Stream extraction failed', {
      entryId,
      teacherId,
      attempt: job.attemptsMade + 1,
      maxAttempts,
      finalAttempt: isFinalAttempt,
      error: errorMessage,
    });

    throw error instanceof Error ? error : new Error(errorMessage);
  }
}

export async function queueStreamExtraction(
  data: StreamExtractionJobData
): Promise<string> {
  if (!extractionQueue) {
    throw new Error('Stream extraction queue not initialized');
  }

  const job = await extractionQueue.add('extract-tags', data, {
    jobId: `stream-${data.entryId}-${Date.now()}`,
  });

  logger.info('Stream extraction job queued', {
    jobId: job.id,
    entryId: data.entryId,
  });

  return job.id || data.entryId;
}

export async function shutdownStreamExtractionJob(): Promise<void> {
  if (extractionWorker) await extractionWorker.close();
  if (extractionQueue) await extractionQueue.close();
  logger.info('Stream extraction job queue shut down');
}

export async function getStreamExtractionQueueStatus() {
  if (!extractionQueue) {
    return { waiting: 0, active: 0, completed: 0, failed: 0 };
  }
  const [waiting, active, completed, failed] = await Promise.all([
    extractionQueue.getWaitingCount(),
    extractionQueue.getActiveCount(),
    extractionQueue.getCompletedCount(),
    extractionQueue.getFailedCount(),
  ]);
  return { waiting, active, completed, failed };
}
