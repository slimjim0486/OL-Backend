/**
 * Exemplar Document Processing Job Queue
 * Downloads file from R2, extracts text, chunks, embeds, and stores in pgvector.
 */

import { Queue, Worker, Job } from 'bullmq';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { createBullConnection } from '../config/redis.js';
import { r2Client, BUCKETS } from '../config/r2.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';
import { ExemplarStatus } from '@prisma/client';
import { embeddingService } from '../services/enterprise/embeddingService.js';

// Lazy-load text extraction libraries to avoid top-level import issues
let pdfParse: any;
let mammoth: any;

const QUEUE_NAME = 'exemplar-processing';
const EMBEDDING_BATCH_SIZE = 20;

export interface ExemplarProcessingJobData {
  documentId: string;
  schoolId: string;
}

interface ExemplarProcessingJobResult {
  success: boolean;
  documentId: string;
  chunksCreated?: number;
  error?: string;
}

let processingQueue: Queue<ExemplarProcessingJobData, ExemplarProcessingJobResult> | null = null;
let processingWorker: Worker<ExemplarProcessingJobData, ExemplarProcessingJobResult> | null = null;

export async function initializeExemplarProcessingJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    processingQueue = new Queue<ExemplarProcessingJobData, ExemplarProcessingJobResult>(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 100,
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 15000,
        },
      },
    });

    processingWorker = new Worker<ExemplarProcessingJobData, ExemplarProcessingJobResult>(
      QUEUE_NAME,
      async (job: Job<ExemplarProcessingJobData, ExemplarProcessingJobResult>) => {
        return processExemplarJob(job);
      },
      {
        connection: createBullConnection(),
        concurrency: 2,
        lockDuration: 600000, // 10 min — embeddings can take a while
        lockRenewTime: 120000,
      }
    );

    processingWorker.on('completed', (job, result) => {
      logger.info('Exemplar processing job completed', {
        jobId: job?.id,
        documentId: result?.documentId,
        chunksCreated: result?.chunksCreated,
      });
    });

    processingWorker.on('failed', (job, err) => {
      logger.error('Exemplar processing job failed', {
        jobId: job?.id,
        documentId: job?.data?.documentId,
        error: err.message,
      });
    });

    logger.info('Exemplar processing job queue initialized');
  } catch (error) {
    logger.error('Failed to initialize exemplar processing job queue', { error });
  }
}

/**
 * Download file content from R2 as a Buffer.
 */
async function downloadFromR2(r2Key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: BUCKETS.aiContent,
    Key: r2Key,
  });

  const response = await r2Client.send(command);
  const stream = response.Body as NodeJS.ReadableStream;
  const chunks: Uint8Array[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk as Uint8Array);
  }

  return Buffer.concat(chunks);
}

/**
 * Extract text from a file based on its MIME type.
 */
async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  switch (mimeType) {
    case 'application/pdf': {
      if (!pdfParse) {
        pdfParse = (await import('pdf-parse')).default;
      }
      const result = await pdfParse(buffer);
      return result.text;
    }

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      if (!mammoth) {
        mammoth = await import('mammoth');
      }
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    case 'text/plain': {
      return buffer.toString('utf-8');
    }

    default:
      throw new Error(`Unsupported MIME type for text extraction: ${mimeType}`);
  }
}

/**
 * Main job processor.
 */
async function processExemplarJob(
  job: Job<ExemplarProcessingJobData, ExemplarProcessingJobResult>
): Promise<ExemplarProcessingJobResult> {
  const { documentId, schoolId } = job.data;

  try {
    // 1. Update status to PROCESSING
    const doc = await prisma.exemplarDocument.update({
      where: { id: documentId },
      data: { status: ExemplarStatus.PROCESSING },
    });

    // 2. Download file from R2
    await job.updateProgress(10);
    const fileBuffer = await downloadFromR2(doc.r2Key);

    // 3. Extract text
    await job.updateProgress(25);
    const text = await extractText(fileBuffer, doc.mimeType);

    if (!text.trim()) {
      throw new Error('No text could be extracted from the document');
    }

    // 4. Chunk text
    await job.updateProgress(40);
    const chunks = embeddingService.chunkText(text);

    if (chunks.length === 0) {
      throw new Error('Document produced no valid text chunks');
    }

    // 5. Generate embeddings in batches
    let allEmbeddings: number[][] = [];
    for (let i = 0; i < chunks.length; i += EMBEDDING_BATCH_SIZE) {
      const batch = chunks.slice(i, i + EMBEDDING_BATCH_SIZE);
      const batchEmbeddings = await embeddingService.generateEmbeddings(batch);
      allEmbeddings.push(...batchEmbeddings);
      const progress = 40 + Math.floor(((i + batch.length) / chunks.length) * 45);
      await job.updateProgress(progress);
    }

    // 6. Insert chunks with embeddings via raw SQL (pgvector requires it)
    await job.updateProgress(90);

    // Delete any existing chunks from a previous failed attempt
    await prisma.exemplarChunk.deleteMany({ where: { documentId } });

    for (let i = 0; i < chunks.length; i++) {
      const chunkId = crypto.randomUUID();
      const embeddingStr = `[${allEmbeddings[i].join(',')}]`;
      const tokenCount = embeddingService.estimateTokens(chunks[i]);

      await prisma.$executeRaw`
        INSERT INTO "ExemplarChunk" ("id", "documentId", "schoolId", "chunkIndex", "content", "tokenCount", "embedding", "createdAt")
        VALUES (${chunkId}, ${documentId}, ${schoolId}, ${i}, ${chunks[i]}, ${tokenCount}, ${embeddingStr}::vector, NOW())
      `;
    }

    // 7. Update document status
    await prisma.exemplarDocument.update({
      where: { id: documentId },
      data: {
        status: ExemplarStatus.READY,
        totalChunks: chunks.length,
        processedAt: new Date(),
        errorMessage: null,
      },
    });

    await job.updateProgress(100);

    return {
      success: true,
      documentId,
      chunksCreated: chunks.length,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    logger.error('Exemplar processing failed', { error, documentId });

    await prisma.exemplarDocument.update({
      where: { id: documentId },
      data: {
        status: ExemplarStatus.FAILED,
        errorMessage,
      },
    });

    return {
      success: false,
      documentId,
      error: errorMessage,
    };
  }
}

export async function queueExemplarProcessingJob(
  data: ExemplarProcessingJobData
): Promise<string> {
  if (!processingQueue) {
    throw new Error('Exemplar processing queue not initialized');
  }

  const job = await processingQueue.add('process-exemplar', data, {
    jobId: `exemplar-${data.documentId}`,
  });

  logger.info('Exemplar processing job queued', {
    jobId: job.id,
    documentId: data.documentId,
  });

  return job.id || data.documentId;
}

export async function shutdownExemplarProcessingJob(): Promise<void> {
  try {
    if (processingWorker) {
      await processingWorker.close();
      processingWorker = null;
    }

    if (processingQueue) {
      await processingQueue.close();
      processingQueue = null;
    }

    logger.info('Exemplar processing job queue shutdown complete');
  } catch (error) {
    logger.error('Error shutting down exemplar processing job queue', { error });
  }
}
