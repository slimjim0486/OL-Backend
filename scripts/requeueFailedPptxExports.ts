/**
 * Re-queue failed PPTX exports (e.g., "fetch failed") for retry.
 *
 * Usage:
 *   DRY_RUN=true npx tsx scripts/requeueFailedPptxExports.ts
 *   ERROR_FILTER="fetch failed" SINCE_DAYS=30 LIMIT=50 npx tsx scripts/requeueFailedPptxExports.ts
 */

import { PrismaClient, ExportFormat, ExportStatus } from '@prisma/client';
import { Queue } from 'bullmq';
import { createBullConnection } from '../src/config/redis.js';
import type { PresentonExportOptions } from '../src/services/teacher/presentonService.js';
import type { ExportJobData } from '../src/jobs/exportJob.js';

const prisma = new PrismaClient();
const QUEUE_NAME = 'teacher-exports';

const DRY_RUN = process.env.DRY_RUN === 'true';
const ERROR_FILTER = (process.env.ERROR_FILTER || 'fetch failed').trim();
const LIMIT = Number.parseInt(process.env.LIMIT || '100', 10);
const SINCE_DAYS = Number.parseInt(process.env.SINCE_DAYS || '', 10);
const EXPORT_ID = (process.env.EXPORT_ID || '').trim();
const CONTENT_ID = (process.env.CONTENT_ID || '').trim();
const TEACHER_EMAIL = (process.env.TEACHER_EMAIL || '').trim().toLowerCase();

const sinceDate = Number.isFinite(SINCE_DAYS)
  ? new Date(Date.now() - SINCE_DAYS * 24 * 60 * 60 * 1000)
  : null;

const defaultOptions: PresentonExportOptions = {
  theme: 'professional-blue',
  slideStyle: 'focused',
  includeAnswers: true,
  includeTeacherNotes: true,
  includeInfographic: true,
  language: 'English',
};

async function run() {
  let failedExports;

  if (EXPORT_ID) {
    const single = await prisma.teacherExport.findUnique({
      where: { id: EXPORT_ID },
      include: { teacher: true, content: true },
    });
    failedExports = single ? [single] : [];
  } else {
    const whereClause = {
      status: ExportStatus.FAILED,
      format: ExportFormat.PPTX,
      ...(ERROR_FILTER
        ? { errorMessage: { contains: ERROR_FILTER, mode: 'insensitive' as const } }
        : {}),
      ...(sinceDate ? { createdAt: { gte: sinceDate } } : {}),
      ...(CONTENT_ID ? { contentId: CONTENT_ID } : {}),
      ...(TEACHER_EMAIL ? { teacher: { email: TEACHER_EMAIL } } : {}),
    };

    failedExports = await prisma.teacherExport.findMany({
      where: whereClause,
      include: {
        teacher: true,
        content: true,
      },
      orderBy: { createdAt: 'desc' },
      take: Number.isFinite(LIMIT) ? LIMIT : 100,
    });
  }

  if (failedExports.length === 0) {
    console.log('No failed PPTX exports found for requeue.');
    return;
  }

  console.log(`Found ${failedExports.length} failed PPTX exports.`);

  if (DRY_RUN) {
    failedExports.forEach((exp) => {
      console.log(`[DRY RUN] ${exp.id} | ${exp.contentTitle} | ${exp.errorMessage}`);
    });
    return;
  }

  const queue = new Queue<ExportJobData>(QUEUE_NAME, {
    connection: createBullConnection(),
  });

  let requeued = 0;
  let skipped = 0;

  for (const exp of failedExports) {
    if (!exp.teacher || !exp.content) {
      console.log(`[SKIP] Missing teacher/content for export ${exp.id}`);
      skipped += 1;
      continue;
    }

    if (exp.content.contentType !== 'LESSON') {
      console.log(`[SKIP] Content not a lesson for export ${exp.id}`);
      skipped += 1;
      continue;
    }

    try {
      await prisma.teacherExport.update({
        where: { id: exp.id },
        data: {
          status: ExportStatus.QUEUED,
          errorMessage: null,
          completedAt: null,
          r2Key: null,
          r2Url: null,
          fileSize: null,
          presentationId: null,
          editUrl: null,
        },
      });

      const jobData: ExportJobData = {
        exportId: exp.id,
        teacherId: exp.teacherId,
        teacherEmail: exp.teacher.email,
        teacherName: exp.teacher.firstName || 'Teacher',
        contentId: exp.contentId,
        contentTitle: exp.contentTitle,
        format: ExportFormat.PPTX,
        options: defaultOptions,
      };

      await queue.add(`export-${jobData.format.toLowerCase()}`, jobData, {
        jobId: `export-${jobData.exportId}`,
      });

      requeued += 1;
      console.log(`[REQUEUED] ${exp.id} | ${exp.contentTitle}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[FAILED] ${exp.id} | ${message}`);
      skipped += 1;
    }
  }

  await queue.close();

  console.log(`Requeued ${requeued} exports. Skipped ${skipped}.`);
}

run()
  .catch((error) => {
    console.error('Requeue failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
