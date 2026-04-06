/**
 * Stream Extraction Job Queue — Teacher Intelligence Platform
 * Processes stream entries through Gemini Flash to extract tags.
 */
import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';
import { streamExtractionService } from '../services/teacher/streamExtractionService.js';
import { sseService } from '../services/teacher/sseService.js';
import { teachingGraphService } from '../services/teacher/teachingGraphService.js';
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

    // Send SSE event to teacher
    sseService.sendEvent(teacherId, {
      type: 'tags-extracted',
      data: { entryId, tags },
    });

    logger.info('Stream extraction completed', { teacherId, entryId, tokensUsed });

    return { success: true, entryId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    try {
      await prisma.teacherStreamEntry.update({
        where: { id: entryId },
        data: { extractionStatus: 'failed' },
      });
    } catch (updateErr) {
      logger.error('Failed to update entry status to failed', { entryId, error: (updateErr as Error).message });
    }

    logger.error('Stream extraction failed', { entryId, teacherId, error: errorMessage });

    return { success: false, entryId, error: errorMessage };
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
