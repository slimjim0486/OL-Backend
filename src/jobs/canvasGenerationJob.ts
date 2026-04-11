/**
 * Canvas Material Generation Job
 * Processes one topic at a time from a canvas batch generation request.
 * Each job calls materialService.generateFromNode(), places the result
 * on the canvas, and sends SSE progress events.
 */
import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { materialService } from '../services/teacher/materialService.js';
import { canvasService } from '../services/teacher/canvasService.js';
import { sseService } from '../services/teacher/sseService.js';

const QUEUE_NAME = 'canvas-material-gen';

export interface CanvasGenerationJobData {
  teacherId: string;
  canvasId: string;
  graphNodeId: string;
  topicLabel: string;
  materialType: string;
  canvasItemId: string;
  // Batch tracking (for progress events)
  total: number;
}

interface CanvasGenerationJobResult {
  success: boolean;
  materialId?: string;
  error?: string;
}

let generationQueue: Queue<CanvasGenerationJobData, CanvasGenerationJobResult> | null = null;
let generationWorker: Worker<CanvasGenerationJobData, CanvasGenerationJobResult> | null = null;

// Track completed count per canvas for progress events
const batchProgress = new Map<string, { completed: number; failed: number }>();

async function processCanvasGenerationJob(
  job: Job<CanvasGenerationJobData, CanvasGenerationJobResult>
): Promise<CanvasGenerationJobResult> {
  const { teacherId, canvasId, graphNodeId, topicLabel, materialType, canvasItemId, total } = job.data;

  try {
    // Generate material using existing pipeline
    const material = await materialService.generateFromNode(teacherId, graphNodeId, {
      materialType: materialType as any,
    });

    if (!material) {
      throw new Error('generateFromNode returned null');
    }

    // Place the new material node on the canvas
    try {
      await canvasService.addMaterialToCanvas(
        canvasId,
        material.id,
        material.title,
        materialType,
        canvasItemId
      );
    } catch (err) {
      // Non-fatal — material still exists in library even if canvas placement fails
      logger.warn('Failed to place material on canvas', { canvasId, materialId: material.id, error: (err as Error).message });
    }

    // Track progress
    const key = canvasId;
    const progress = batchProgress.get(key) || { completed: 0, failed: 0 };
    progress.completed++;
    batchProgress.set(key, progress);

    // Send SSE progress event
    sseService.sendEvent(teacherId, {
      type: 'canvas-generation-progress',
      data: {
        canvasId,
        topicLabel,
        materialId: material.id,
        materialTitle: material.title,
        materialType,
        canvasItemId,
        completed: progress.completed,
        failed: progress.failed,
        total,
      },
    });

    // Clean up batch tracking when all done
    if (progress.completed + progress.failed >= total) {
      batchProgress.delete(key);
    }

    return { success: true, materialId: material.id };
  } catch (error) {
    const key = canvasId;
    const progress = batchProgress.get(key) || { completed: 0, failed: 0 };
    progress.failed++;
    batchProgress.set(key, progress);

    // Send failure progress event
    sseService.sendEvent(teacherId, {
      type: 'canvas-generation-progress',
      data: {
        canvasId,
        topicLabel,
        materialId: null,
        error: true,
        completed: progress.completed,
        failed: progress.failed,
        total,
      },
    });

    if (progress.completed + progress.failed >= total) {
      batchProgress.delete(key);
    }

    logger.error('Canvas generation job failed', {
      canvasId,
      graphNodeId,
      topicLabel,
      error: (error as Error).message,
    });

    return { success: false, error: (error as Error).message };
  }
}

export async function initializeCanvasGenerationJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    generationQueue = new Queue<CanvasGenerationJobData, CanvasGenerationJobResult>(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 1, // Don't retry — teacher can re-trigger manually
      },
    });

    generationWorker = new Worker<CanvasGenerationJobData, CanvasGenerationJobResult>(
      QUEUE_NAME,
      async (job) => processCanvasGenerationJob(job),
      {
        connection: createBullConnection(),
        concurrency: 2,
        lockDuration: 120000, // 2 min — generation can take time
        lockRenewTime: 30000,
      }
    );

    generationWorker.on('completed', (job, result) => {
      logger.info('Canvas generation job completed', {
        jobId: job?.id,
        materialId: result?.materialId,
        topic: job?.data?.topicLabel,
      });
    });

    generationWorker.on('failed', (job, err) => {
      logger.error('Canvas generation job failed permanently', {
        jobId: job?.id,
        topic: job?.data?.topicLabel,
        error: err.message,
      });
    });

    logger.info('Canvas generation job queue initialized');
  } catch (error) {
    logger.error('Failed to initialize canvas generation job queue', { error });
  }
}

export async function queueCanvasGeneration(
  data: CanvasGenerationJobData,
  delayMs: number = 0
): Promise<void> {
  if (!generationQueue) {
    throw new Error('Canvas generation queue not initialized');
  }
  await generationQueue.add('generate', data, { delay: delayMs });
}

export async function shutdownCanvasGenerationJob(): Promise<void> {
  if (generationWorker) {
    await generationWorker.close();
    generationWorker = null;
  }
  if (generationQueue) {
    await generationQueue.close();
    generationQueue = null;
  }
  logger.info('Canvas generation job queue shut down');
}
