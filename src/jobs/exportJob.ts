/**
 * Export Job Queue
 * Handles async generation of PPTX and PDF exports
 * Uploads to R2 storage and sends email notifications
 */

import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';
import { generateLessonPPTX, generateFlashcardPPTX, PresentonExportOptions } from '../services/teacher/presentonService.js';
import { exportContent, ExportOptions } from '../services/teacher/exportService.js';
import { uploadFile } from '../services/storage/storageService.js';
import { emailService } from '../services/email/emailService.js';
import { ExportStatus, ExportFormat } from '@prisma/client';

const QUEUE_NAME = 'teacher-exports';

// Job data interface
export interface ExportJobData {
  exportId: string;        // TeacherExport record ID
  teacherId: string;
  teacherEmail: string;
  teacherName: string;
  contentId: string;
  contentTitle: string;
  format: ExportFormat;
  options: PresentonExportOptions | ExportOptions;
}

// Job result interface
interface ExportJobResult {
  success: boolean;
  exportId: string;
  r2Key?: string;
  r2Url?: string;
  fileSize?: number;
  error?: string;
}

let exportQueue: Queue<ExportJobData, ExportJobResult> | null = null;
let exportWorker: Worker<ExportJobData, ExportJobResult> | null = null;

/**
 * Initialize the export job queue
 */
export async function initializeExportJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    // Create the queue
    exportQueue = new Queue<ExportJobData, ExportJobResult>(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 100,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 15000, // 15 seconds initial delay
        },
      },
    });

    // Create the worker
    exportWorker = new Worker<ExportJobData, ExportJobResult>(
      QUEUE_NAME,
      async (job: Job<ExportJobData, ExportJobResult>) => {
        return processExportJob(job);
      },
      {
        connection: createBullConnection(),
        concurrency: 2, // Process 2 exports at a time
      }
    );

    // Handle worker events
    exportWorker.on('completed', async (job, result) => {
      logger.info('Export job completed', {
        jobId: job?.id,
        exportId: result?.exportId,
        success: result?.success,
      });
    });

    exportWorker.on('failed', async (job, err) => {
      logger.error('Export job failed', {
        jobId: job?.id,
        exportId: job?.data?.exportId,
        error: err.message,
      });

      // Update export status to failed only after final attempt
      if (job?.data?.exportId) {
        const attempts = job?.opts?.attempts ?? 1;
        const attemptsMade = job?.attemptsMade ?? 0;
        const isFinalAttempt = attemptsMade >= attempts;

        await prisma.teacherExport.update({
          where: { id: job.data.exportId },
          data: {
            status: isFinalAttempt ? ExportStatus.FAILED : ExportStatus.QUEUED,
            errorMessage: err.message,
          },
        });
      }
    });

    logger.info('Export job queue initialized');
  } catch (error) {
    logger.error('Failed to initialize export job queue', { error });
  }
}

/**
 * Process an export job
 */
async function processExportJob(job: Job<ExportJobData, ExportJobResult>): Promise<ExportJobResult> {
  const { exportId, teacherId, teacherEmail, teacherName, contentId, contentTitle, format, options } = job.data;

  logger.info('Processing export job', { exportId, teacherId, contentId, format });

  try {
    // Update status to PROCESSING
    await prisma.teacherExport.update({
      where: { id: exportId },
      data: { status: ExportStatus.PROCESSING },
    });

    // Get the content
    const content = await prisma.teacherContent.findFirst({
      where: { id: contentId, teacherId },
    });

    if (!content) {
      throw new Error('Content not found');
    }

    let fileBuffer: Buffer;
    let filename: string;
    let mimeType: string;
    let presentationId: string | undefined;
    let editUrl: string | undefined;

    if (format === ExportFormat.PPTX) {
      // Generate PPTX via Presenton - use appropriate function based on content type
      const isFlashcard = content.contentType === 'FLASHCARD_DECK';
      const result = isFlashcard
        ? await generateFlashcardPPTX(content, options as PresentonExportOptions)
        : await generateLessonPPTX(content, options as PresentonExportOptions);
      fileBuffer = result.data;
      filename = result.filename;
      mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      // Store edit URL if available (for flashcard presentations)
      if ('editUrl' in result && typeof result.editUrl === 'string') {
        editUrl = result.editUrl;
      }
    } else {
      // Generate PDF
      const result = await exportContent(content, options as ExportOptions);
      fileBuffer = result.data as Buffer;
      filename = result.filename;
      mimeType = result.mimeType;
    }

    // Generate R2 storage path
    const timestamp = Date.now();
    const sanitizedTitle = contentTitle
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    const extension = format === ExportFormat.PPTX ? 'pptx' : 'pdf';
    const r2Key = `teacher/${teacherId}/exports/${timestamp}-${sanitizedTitle}.${extension}`;

    // Upload to R2
    const uploadResult = await uploadFile(
      'aiContent',
      r2Key,
      fileBuffer,
      mimeType,
      {
        'teacher-id': teacherId,
        'content-id': contentId,
        'export-id': exportId,
        'original-filename': filename,
      }
    );

    // Update export record with success
    await prisma.teacherExport.update({
      where: { id: exportId },
      data: {
        status: ExportStatus.COMPLETED,
        r2Key,
        r2Url: uploadResult.publicUrl,
        fileSize: fileBuffer.length,
        presentationId,
        editUrl,
        completedAt: new Date(),
        filename,
      },
    });

    // Send email notification
    const emailSent = await sendExportReadyEmail({
      email: teacherEmail,
      name: teacherName,
      contentTitle,
      format,
      downloadUrl: uploadResult.publicUrl,
      fileSize: fileBuffer.length,
    });

    // Update email sent status
    if (emailSent) {
      await prisma.teacherExport.update({
        where: { id: exportId },
        data: {
          emailSent: true,
          emailSentAt: new Date(),
        },
      });
    }

    logger.info('Export completed successfully', {
      exportId,
      r2Key,
      fileSize: fileBuffer.length,
      emailSent,
    });

    return {
      success: true,
      exportId,
      r2Key,
      r2Url: uploadResult.publicUrl,
      fileSize: fileBuffer.length,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Export job failed', { exportId, error: errorMessage });

    // Throw to let BullMQ handle retries and final failure state
    throw new Error(errorMessage);
  }
}

/**
 * Add an export job to the queue
 */
export async function queueExportJob(data: ExportJobData): Promise<string> {
  if (!exportQueue) {
    throw new Error('Export queue not initialized');
  }

  const job = await exportQueue.add(`export-${data.format.toLowerCase()}`, data, {
    jobId: `export-${data.exportId}`,
  });

  logger.info('Export job queued', { jobId: job.id, exportId: data.exportId });

  return job.id || data.exportId;
}

/**
 * Get queue status for monitoring
 */
export async function getExportQueueStatus(): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}> {
  if (!exportQueue) {
    return { waiting: 0, active: 0, completed: 0, failed: 0 };
  }

  const counts = await exportQueue.getJobCounts();
  return {
    waiting: counts.waiting,
    active: counts.active,
    completed: counts.completed,
    failed: counts.failed,
  };
}

/**
 * Shutdown the export job queue
 */
export async function shutdownExportJob(): Promise<void> {
  try {
    if (exportWorker) {
      await exportWorker.close();
      exportWorker = null;
    }

    if (exportQueue) {
      await exportQueue.close();
      exportQueue = null;
    }

    logger.info('Export job queue shutdown complete');
  } catch (error) {
    logger.error('Error shutting down export job queue', { error });
  }
}

/**
 * Send email notification when export is ready
 */
async function sendExportReadyEmail(params: {
  email: string;
  name: string;
  contentTitle: string;
  format: ExportFormat;
  downloadUrl: string;
  fileSize: number;
}): Promise<boolean> {
  const { email, name, contentTitle, format, downloadUrl, fileSize } = params;

  const formatName = format === ExportFormat.PPTX ? 'PowerPoint' : 'PDF';
  const fileSizeFormatted = formatFileSize(fileSize);

  try {
    return await emailService.sendExportReadyEmail(
      email,
      name,
      contentTitle,
      formatName,
      downloadUrl,
      fileSizeFormatted
    );
  } catch (error) {
    logger.error('Failed to send export ready email', { email, error });
    return false;
  }
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
