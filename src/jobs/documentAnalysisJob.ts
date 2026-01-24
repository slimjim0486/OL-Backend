/**
 * Teacher Document Analysis Job Queue
 * Handles async PDF/PPT analysis for teacher content creation.
 */

import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';
import { geminiService } from '../services/ai/geminiService.js';
import { analyzePPT, isPPTMimeType } from '../services/learning/pptProcessor.js';
import { quotaService } from '../services/teacher/index.js';
import { DocumentAnalysisStatus, TokenOperation, Prisma } from '@prisma/client';

const QUEUE_NAME = 'teacher-document-analysis';
const PDF_ESTIMATED_TOKENS = 4000;
const PPT_ESTIMATED_TOKENS = 5000;
const MODEL_USED = 'gemini-3-flash-preview';

export interface DocumentAnalysisJobData {
  analysisId: string;
  teacherId: string;
  mimeType: string;
  fileBase64: string;
  filename?: string;
}

interface DocumentAnalysisJobResult {
  success: boolean;
  analysisId: string;
  error?: string;
}

let analysisQueue: Queue<DocumentAnalysisJobData, DocumentAnalysisJobResult> | null = null;
let analysisWorker: Worker<DocumentAnalysisJobData, DocumentAnalysisJobResult> | null = null;

export async function initializeDocumentAnalysisJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    analysisQueue = new Queue<DocumentAnalysisJobData, DocumentAnalysisJobResult>(QUEUE_NAME, {
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

    analysisWorker = new Worker<DocumentAnalysisJobData, DocumentAnalysisJobResult>(
      QUEUE_NAME,
      async (job: Job<DocumentAnalysisJobData, DocumentAnalysisJobResult>) => {
        return processDocumentAnalysisJob(job);
      },
      {
        connection: createBullConnection(),
        concurrency: 2,
        lockDuration: 300000,
        lockRenewTime: 60000,
      }
    );

    analysisWorker.on('completed', (job, result) => {
      logger.info('Document analysis job completed', {
        jobId: job?.id,
        analysisId: result?.analysisId,
        success: result?.success,
      });
    });

    analysisWorker.on('failed', (job, err) => {
      logger.error('Document analysis job failed', {
        jobId: job?.id,
        analysisId: job?.data?.analysisId,
        error: err.message,
      });
    });

    logger.info('Document analysis job queue initialized');
  } catch (error) {
    logger.error('Failed to initialize document analysis job queue', { error });
  }
}

async function processDocumentAnalysisJob(
  job: Job<DocumentAnalysisJobData, DocumentAnalysisJobResult>
): Promise<DocumentAnalysisJobResult> {
  const { analysisId, teacherId, mimeType, fileBase64, filename } = job.data;

  try {
    await prisma.teacherDocumentAnalysis.update({
      where: { id: analysisId },
      data: { status: DocumentAnalysisStatus.PROCESSING },
    });

    const estimatedTokens = mimeType === 'application/pdf'
      ? PDF_ESTIMATED_TOKENS
      : PPT_ESTIMATED_TOKENS;

    await quotaService.enforceQuota(
      teacherId,
      TokenOperation.CONTENT_ANALYSIS,
      estimatedTokens
    );

    let resultData: Record<string, unknown>;
    let tokensUsed: number;
    let resourceType: string;

    if (mimeType === 'application/pdf') {
      const result = await geminiService.analyzePDF(fileBase64);
      tokensUsed = result.tokensUsed;
      resourceType = 'pdf_analysis';
      resultData = {
        ...result,
        filename: filename || 'document.pdf',
      };
    } else {
      if (!isPPTMimeType(mimeType)) {
        throw new Error('Unsupported file type for analysis');
      }

      const result = await analyzePPT(
        fileBase64,
        mimeType,
        filename || 'presentation.pptx'
      );
      tokensUsed = result.tokensUsed;
      resourceType = 'ppt_analysis';
      resultData = {
        ...result,
        filename: filename || 'presentation.pptx',
      };
    }

    await quotaService.recordUsage({
      teacherId,
      operation: TokenOperation.CONTENT_ANALYSIS,
      tokensUsed,
      modelUsed: MODEL_USED,
      resourceType,
    });

    await prisma.teacherDocumentAnalysis.update({
      where: { id: analysisId },
      data: {
        status: DocumentAnalysisStatus.COMPLETED,
        result: resultData as Prisma.InputJsonValue,
        tokensUsed,
        modelUsed: MODEL_USED,
        completedAt: new Date(),
      },
    });

    return {
      success: true,
      analysisId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    await prisma.teacherDocumentAnalysis.update({
      where: { id: analysisId },
      data: {
        status: DocumentAnalysisStatus.FAILED,
        errorMessage,
      },
    });

    return {
      success: false,
      analysisId,
      error: errorMessage,
    };
  }
}

export async function queueDocumentAnalysisJob(
  data: DocumentAnalysisJobData
): Promise<string> {
  if (!analysisQueue) {
    throw new Error('Document analysis queue not initialized');
  }

  const job = await analysisQueue.add('analyze-document', data, {
    jobId: `analysis-${data.analysisId}`,
  });

  logger.info('Document analysis job queued', {
    jobId: job.id,
    analysisId: data.analysisId,
  });

  return job.id || data.analysisId;
}

export async function getDocumentAnalysisQueueStatus(): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}> {
  if (!analysisQueue) {
    return { waiting: 0, active: 0, completed: 0, failed: 0 };
  }

  const counts = await analysisQueue.getJobCounts();
  return {
    waiting: counts.waiting,
    active: counts.active,
    completed: counts.completed,
    failed: counts.failed,
  };
}

export async function shutdownDocumentAnalysisJob(): Promise<void> {
  try {
    if (analysisWorker) {
      await analysisWorker.close();
      analysisWorker = null;
    }

    if (analysisQueue) {
      await analysisQueue.close();
      analysisQueue = null;
    }

    logger.info('Document analysis job queue shutdown complete');
  } catch (error) {
    logger.error('Error shutting down document analysis job queue', { error });
  }
}
