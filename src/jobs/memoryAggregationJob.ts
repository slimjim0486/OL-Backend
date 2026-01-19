// Weekly Memory Aggregation Job
// Runs every Sunday at 2 AM UTC to aggregate weekly patterns for all active children

import { Queue, Worker, QueueEvents } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { memoryService } from '../services/memory/memoryService.js';
import { MEMORY_CONSTANTS } from '../services/memory/memoryTypes.js';

const QUEUE_NAME = 'memory-aggregation';

let memoryQueue: Queue | null = null;
let memoryWorker: Worker | null = null;
let queueEvents: QueueEvents | null = null;

/**
 * Initialize the memory aggregation job queue
 */
export async function initializeMemoryAggregationJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    // Create the queue
    memoryQueue = new Queue(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 100,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    });

    // Create the worker
    memoryWorker = new Worker(
      QUEUE_NAME,
      async (job) => {
        logger.info('Starting memory aggregation job', { jobId: job.id });

        const startTime = Date.now();
        const result = await memoryService.runWeeklyAggregation();

        const duration = Date.now() - startTime;
        logger.info('Memory aggregation job completed', {
          jobId: job.id,
          processed: result.processed,
          errors: result.errors,
          durationMs: duration,
        });

        return result;
      },
      {
        connection: createBullConnection(),
        concurrency: 1, // Only run one aggregation at a time
      }
    );

    // Handle worker events
    memoryWorker.on('completed', (job) => {
      logger.info('Memory aggregation job completed', { jobId: job?.id });
    });

    memoryWorker.on('failed', (job, err) => {
      logger.error('Memory aggregation job failed', {
        jobId: job?.id,
        error: err.message,
      });
    });

    // Queue events for monitoring
    queueEvents = new QueueEvents(QUEUE_NAME, {
      connection: createBullConnection(),
    });

    // Schedule weekly job
    await scheduleWeeklyAggregation();

    logger.info('Memory aggregation job initialized');
  } catch (error) {
    logger.error('Failed to initialize memory aggregation job', { error });
  }
}

/**
 * Schedule the weekly aggregation job
 * Runs every Sunday at 2 AM UTC
 */
async function scheduleWeeklyAggregation(): Promise<void> {
  if (!memoryQueue) {
    logger.warn('Memory queue not initialized');
    return;
  }

  // Remove any existing scheduled jobs
  const repeatableJobs = await memoryQueue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    await memoryQueue.removeRepeatableByKey(job.key);
  }

  // Schedule weekly job
  // Cron: "0 2 * * 0" = 2:00 AM every Sunday
  await memoryQueue.add(
    'weekly-aggregation',
    { type: 'weekly' },
    {
      repeat: {
        pattern: '0 2 * * 0', // Every Sunday at 2 AM UTC
      },
    }
  );

  logger.info('Weekly memory aggregation scheduled for Sundays at 2 AM UTC');
}

/**
 * Manually trigger the aggregation job (for testing/admin use)
 */
export async function triggerMemoryAggregation(): Promise<void> {
  if (!memoryQueue) {
    throw new Error('Memory queue not initialized');
  }

  await memoryQueue.add('manual-aggregation', { type: 'manual' });
  logger.info('Manual memory aggregation triggered');
}

/**
 * Shutdown the memory aggregation job
 */
export async function shutdownMemoryAggregationJob(): Promise<void> {
  try {
    if (memoryWorker) {
      await memoryWorker.close();
      memoryWorker = null;
    }

    if (memoryQueue) {
      await memoryQueue.close();
      memoryQueue = null;
    }

    if (queueEvents) {
      await queueEvents.close();
      queueEvents = null;
    }

    logger.info('Memory aggregation job shutdown complete');
  } catch (error) {
    logger.error('Error shutting down memory aggregation job', { error });
  }
}

/**
 * Get queue status for monitoring
 */
export async function getMemoryAggregationStatus(): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}> {
  if (!memoryQueue) {
    return { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 };
  }

  const counts = await memoryQueue.getJobCounts();
  return {
    waiting: counts.waiting,
    active: counts.active,
    completed: counts.completed,
    failed: counts.failed,
    delayed: counts.delayed,
  };
}
