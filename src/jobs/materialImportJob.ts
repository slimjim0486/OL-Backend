/**
 * Material Import Job Queue — Teacher Intelligence Platform
 * Processes bulk material imports through Gemini Flash for auto-tagging.
 */
import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { materialImportService } from '../services/teacher/materialImportService.js';

const QUEUE_NAME = 'material-import';

export interface MaterialImportJobData {
  jobId: string;
  teacherId: string;
}

interface MaterialImportJobResult {
  success: boolean;
  jobId: string;
  error?: string;
}

let importQueue: Queue<MaterialImportJobData, MaterialImportJobResult> | null = null;
let importWorker: Worker<MaterialImportJobData, MaterialImportJobResult> | null = null;

export async function initializeMaterialImportJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    importQueue = new Queue<MaterialImportJobData, MaterialImportJobResult>(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 100,
        attempts: 1,
        backoff: {
          type: 'exponential',
          delay: 10000,
        },
      },
    });

    importWorker = new Worker<MaterialImportJobData, MaterialImportJobResult>(
      QUEUE_NAME,
      async (job: Job<MaterialImportJobData, MaterialImportJobResult>) => {
        return processMaterialImportJob(job);
      },
      {
        connection: createBullConnection(),
        concurrency: 1,
        lockDuration: 300000,  // 5 minutes — imports can take a while
        lockRenewTime: 60000,
      }
    );

    importWorker.on('completed', (job, result) => {
      logger.info('Material import job completed', {
        jobId: job?.id,
        importJobId: result?.jobId,
        success: result?.success,
      });
    });

    importWorker.on('failed', (job, err) => {
      logger.error('Material import job failed', {
        jobId: job?.id,
        importJobId: job?.data?.jobId,
        error: err.message,
      });
    });

    logger.info('Material import job queue initialized');
  } catch (error) {
    logger.error('Failed to initialize material import job queue', { error });
  }
}

async function processMaterialImportJob(
  job: Job<MaterialImportJobData, MaterialImportJobResult>
): Promise<MaterialImportJobResult> {
  const { jobId } = job.data;

  try {
    await materialImportService.processImportJob(jobId);
    return { success: true, jobId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Material import processing failed', { jobId, error: errorMessage });
    return { success: false, jobId, error: errorMessage };
  }
}

export async function queueMaterialImport(
  data: MaterialImportJobData
): Promise<string> {
  if (!importQueue) {
    throw new Error('Material import queue not initialized');
  }

  const job = await importQueue.add('import-materials', data, {
    jobId: `import-${data.jobId}-${Date.now()}`,
  });

  logger.info('Material import job queued', {
    jobId: job.id,
    importJobId: data.jobId,
    teacherId: data.teacherId,
  });

  return job.id || data.jobId;
}

export async function shutdownMaterialImportJob(): Promise<void> {
  if (importWorker) await importWorker.close();
  if (importQueue) await importQueue.close();
  logger.info('Material import job queue shut down');
}
