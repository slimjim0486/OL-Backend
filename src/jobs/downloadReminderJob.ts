/**
 * Download Reminder Job
 *
 * Daily cron job that sends tiered download reminders to teachers
 * who have generated content but never downloaded/exported it.
 *
 * Stages:
 *   Stage 1 (24h) — Simple nudge listing un-downloaded items
 *   Stage 2 (72h) — Inline content preview showing what they made
 *   Stage 3 (gift) — One-time auto-generated PDF of most recent content
 *
 * Email fatigue rules:
 *   - Max 1 download reminder per 48h per teacher
 *   - Skip if any Brevo trigger sent in last 48h
 *   - Respect teacher.notifyUsageAlerts preference
 *   - Gift PDF is lifetime one-time (not monthly)
 *
 * Run via cron (10 AM daily — 1h after Brevo checks):
 *   import { scheduleDownloadReminders } from './jobs/downloadReminderJob';
 *   scheduleDownloadReminders();
 *
 * Or run manually:
 *   npx tsx src/jobs/downloadReminderJob.ts
 */

import cron from 'node-cron';
import { fileURLToPath } from 'url';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { emailService } from '../services/email/emailService.js';
import { extractContentPreview, contentTypeLabel } from '../services/teacher/contentPreviewService.js';
import { exportContent } from '../services/teacher/exportService.js';
import { uploadFile } from '../services/storage/storageService.js';
import { consumeFreeDownloadAllowance } from '../services/teacher/downloadAccessService.js';
import { ExportFormat, ExportStatus } from '@prisma/client';

// ============================================================================
// HELPERS
// ============================================================================

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}`;
}

function getNextMonthStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
}

function getCurrentMonthStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/** Check if teacher had any trigger in the last 48 hours */
async function hasRecentTrigger(teacherId: string): Promise<boolean> {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const recent = await prisma.teacherTriggerLog.findFirst({
    where: {
      teacherId,
      sentAt: { gte: cutoff },
    },
  }).catch(() => null);
  return !!recent;
}

/** Check if a specific trigger was already sent for this teacher */
async function hasTrigger(
  teacherId: string,
  triggerName: string,
  scope: 'month' | 'lifetime' = 'month'
): Promise<boolean> {
  const where: any = { teacherId, triggerName };
  if (scope === 'month') {
    where.monthKey = getMonthKey();
  }
  const existing = await prisma.teacherTriggerLog.findFirst({ where }).catch(() => null);
  return !!existing;
}

/** Record a trigger in the log */
async function recordTrigger(
  teacherId: string,
  triggerName: string,
  metadata?: Record<string, any>
): Promise<void> {
  await prisma.teacherTriggerLog.create({
    data: {
      teacherId,
      triggerName,
      monthKey: getMonthKey(),
      sentAt: new Date(),
      metadata: metadata ?? undefined,
    },
  }).catch((err) => {
    logger.error('Failed to record trigger log', { teacherId, triggerName, error: err });
  });
}

/** Get free downloads remaining for a teacher this month */
async function getFreeDownloadsRemaining(teacherId: string): Promise<number> {
  const monthStart = getCurrentMonthStart();
  const usage = await prisma.teacherDownloadUsage.findUnique({
    where: { teacherId_month: { teacherId, month: monthStart } },
    select: { usedCount: true },
  }).catch(() => null);
  return Math.max(0, 3 - (usage?.usedCount || 0));
}

// ============================================================================
// STAGE 1 — 24h reminder
// ============================================================================

async function checkDownloadReminder24h(): Promise<number> {
  const now = new Date();
  // Content created ~24h ago (window: 23-25h)
  const windowStart = new Date(now.getTime() - 25 * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() - 23 * 60 * 60 * 1000);
  let sent = 0;

  try {
    // Find teachers with content created ~24h ago that has zero exports
    const teachers = await prisma.teacher.findMany({
      where: {
        subscriptionTier: 'FREE',
        emailVerified: true,
        notifyUsageAlerts: true,
        content: {
          some: {
            createdAt: { gte: windowStart, lte: windowEnd },
            exports: { none: {} },
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        content: {
          where: {
            createdAt: { gte: windowStart, lte: windowEnd },
            exports: { none: {} },
          },
          select: {
            id: true,
            title: true,
            contentType: true,
          },
          take: 3,
        },
      },
    });

    for (const teacher of teachers) {
      // Dedup: already sent this month
      if (await hasTrigger(teacher.id, 'download_reminder_24h')) continue;
      // Fatigue: any trigger in last 48h
      if (await hasRecentTrigger(teacher.id)) continue;

      const downloadsRemaining = await getFreeDownloadsRemaining(teacher.id);
      const contentItems = teacher.content.map((c) => ({
        title: c.title,
        type: contentTypeLabel(c.contentType),
      }));

      const success = await emailService.sendDownloadReminder24hEmail(
        teacher.email,
        teacher.firstName || 'there',
        contentItems,
        downloadsRemaining
      );

      if (success) {
        await recordTrigger(teacher.id, 'download_reminder_24h', {
          contentIds: teacher.content.map((c) => c.id),
        });
        sent++;
      }
    }

    logger.info('Stage 1 (24h reminder) complete', { checked: teachers.length, sent });
  } catch (error) {
    logger.error('Stage 1 (24h reminder) failed', { error });
  }

  return sent;
}

// ============================================================================
// STAGE 2 — 72h reminder with preview
// ============================================================================

async function checkDownloadReminder72h(): Promise<number> {
  const now = new Date();
  // Content created ~72h ago (window: 71-73h)
  const windowStart = new Date(now.getTime() - 73 * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() - 71 * 60 * 60 * 1000);
  let sent = 0;

  try {
    const teachers = await prisma.teacher.findMany({
      where: {
        subscriptionTier: 'FREE',
        emailVerified: true,
        notifyUsageAlerts: true,
        // Must have received Stage 1 already
        triggerLogs: {
          some: { triggerName: 'download_reminder_24h', monthKey: getMonthKey() },
        },
        content: {
          some: {
            createdAt: { gte: windowStart, lte: windowEnd },
            exports: { none: {} },
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        content: {
          where: {
            createdAt: { gte: windowStart, lte: windowEnd },
            exports: { none: {} },
          },
          select: {
            id: true,
            title: true,
            contentType: true,
            subject: true,
            gradeLevel: true,
            lessonContent: true,
            quizContent: true,
            flashcardContent: true,
          },
          take: 3,
        },
      },
    });

    for (const teacher of teachers) {
      if (await hasTrigger(teacher.id, 'download_reminder_72h')) continue;
      if (await hasRecentTrigger(teacher.id)) continue;

      const downloadsRemaining = await getFreeDownloadsRemaining(teacher.id);
      const contentItems = teacher.content.map((c) => ({
        title: c.title,
        type: contentTypeLabel(c.contentType),
      }));

      const previews = teacher.content.map((c) => {
        const preview = extractContentPreview(c as any);
        return {
          title: preview.title,
          type: contentTypeLabel(preview.type),
          sections: preview.sections,
          questionCount: preview.questionCount,
          vocabularyTerms: preview.vocabularyTerms,
          cardCount: preview.cardCount,
        };
      });

      const success = await emailService.sendDownloadReminder72hEmail(
        teacher.email,
        teacher.firstName || 'there',
        contentItems,
        previews,
        downloadsRemaining
      );

      if (success) {
        await recordTrigger(teacher.id, 'download_reminder_72h', {
          contentIds: teacher.content.map((c) => c.id),
        });
        sent++;
      }
    }

    logger.info('Stage 2 (72h preview) complete', { checked: teachers.length, sent });
  } catch (error) {
    logger.error('Stage 2 (72h preview) failed', { error });
  }

  return sent;
}

// ============================================================================
// STAGE 3 — Gift PDF (one-time, lifetime)
// ============================================================================

async function checkAutoGiftPdf(): Promise<number> {
  let sent = 0;

  try {
    // Teachers with 3+ content pieces, all with zero exports, never received gift
    const teachers = await prisma.teacher.findMany({
      where: {
        subscriptionTier: 'FREE',
        emailVerified: true,
        notifyUsageAlerts: true,
        // Must NOT have lifetime gift trigger
        triggerLogs: {
          none: { triggerName: 'auto_gift_pdf' },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        content: {
          where: {
            exports: { none: {} },
          },
          select: { id: true },
        },
      },
    });

    // Filter to teachers with 3+ un-exported content
    const eligible = teachers.filter((t) => t.content.length >= 3);

    for (const teacher of eligible) {
      if (await hasRecentTrigger(teacher.id)) continue;

      // Check they still have free downloads remaining
      const downloadsRemaining = await getFreeDownloadsRemaining(teacher.id);
      if (downloadsRemaining <= 0) continue;

      // Get their most recent content with full data for PDF generation
      const recentContent = await prisma.teacherContent.findFirst({
        where: {
          teacherId: teacher.id,
          exports: { none: {} },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!recentContent) continue;

      try {
        // Generate PDF
        const result = await exportContent(recentContent, { format: 'pdf' });
        const pdfBuffer = result.data as Buffer;

        // Upload to R2
        const timestamp = Date.now();
        const sanitizedTitle = recentContent.title
          .replace(/[^a-z0-9]/gi, '-')
          .replace(/-+/g, '-')
          .substring(0, 50);
        const r2Key = `teacher/${teacher.id}/exports/${timestamp}-${sanitizedTitle}-gift.pdf`;

        const uploadResult = await uploadFile(
          'aiContent',
          r2Key,
          pdfBuffer,
          'application/pdf',
          {
            'teacher-id': teacher.id,
            'content-id': recentContent.id,
            'source': 'auto-gift',
          }
        );

        // Create TeacherExport record
        await prisma.teacherExport.create({
          data: {
            teacherId: teacher.id,
            contentId: recentContent.id,
            contentTitle: recentContent.title,
            format: ExportFormat.PDF,
            filename: `${result.filename}.pdf`,
            fileSize: pdfBuffer.length,
            r2Key,
            r2Url: uploadResult.publicUrl,
            status: ExportStatus.COMPLETED,
            completedAt: new Date(),
          },
        });

        // Consume one free download
        await consumeFreeDownloadAllowance(teacher.id);
        const newRemaining = downloadsRemaining - 1;

        // Format reset date
        const resetDate = getNextMonthStart().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
        });

        // Send email
        const success = await emailService.sendAutoGiftPdfEmail(
          teacher.email,
          teacher.firstName || 'there',
          recentContent.title,
          uploadResult.publicUrl,
          newRemaining,
          resetDate
        );

        if (success) {
          await recordTrigger(teacher.id, 'auto_gift_pdf', {
            contentId: recentContent.id,
            r2Key,
          });
          sent++;
        }
      } catch (exportError) {
        // Non-fatal: log and continue to next teacher
        logger.error('Auto gift PDF generation failed for teacher', {
          teacherId: teacher.id,
          contentId: recentContent.id,
          error: exportError,
        });
      }
    }

    logger.info('Stage 3 (gift PDF) complete', { checked: eligible.length, sent });
  } catch (error) {
    logger.error('Stage 3 (gift PDF) failed', { error });
  }

  return sent;
}

// ============================================================================
// ORCHESTRATOR
// ============================================================================

export async function runDownloadReminders(): Promise<{
  stage1: number;
  stage2: number;
  stage3: number;
}> {
  logger.info('Starting download reminder checks...');

  const results = {
    stage1: await checkDownloadReminder24h(),
    stage2: await checkDownloadReminder72h(),
    stage3: await checkAutoGiftPdf(),
  };

  logger.info('Download reminder checks complete', results);
  return results;
}

// ============================================================================
// CRON SCHEDULER
// ============================================================================

export function scheduleDownloadReminders(): void {
  // Run every day at 10:00 AM (1 hour after Brevo checks at 9 AM)
  cron.schedule('0 10 * * *', async () => {
    logger.info('Running scheduled download reminders');
    try {
      await runDownloadReminders();
    } catch (error) {
      logger.error('Download reminder check failed', { error });
    }
  });

  logger.info('Download reminders scheduled for 10:00 AM daily');
}

// ============================================================================
// BACKFILL — Retroactive Stage 2 emails for existing teachers
// ============================================================================

/**
 * One-time backfill: find teachers with un-downloaded content (any age)
 * and send them the Stage 2 preview email. Skips anyone who already
 * received any download reminder trigger.
 *
 * Usage: npx tsx src/jobs/downloadReminderJob.ts --backfill 20
 */
export async function backfillDownloadReminders(limit: number): Promise<number> {
  logger.info('Starting download reminder backfill...', { limit });
  let sent = 0;

  try {
    const teachers = await prisma.teacher.findMany({
      where: {
        subscriptionTier: 'FREE',
        emailVerified: true,
        notifyUsageAlerts: true,
        // Has content with zero exports
        content: {
          some: {
            exports: { none: {} },
          },
        },
        // Never received any download reminder
        triggerLogs: {
          none: {
            triggerName: { in: ['download_reminder_24h', 'download_reminder_72h', 'auto_gift_pdf'] },
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        content: {
          where: { exports: { none: {} } },
          select: {
            id: true,
            title: true,
            contentType: true,
            subject: true,
            gradeLevel: true,
            lessonContent: true,
            quizContent: true,
            flashcardContent: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    for (const teacher of teachers) {
      if (teacher.content.length === 0) continue;

      const downloadsRemaining = await getFreeDownloadsRemaining(teacher.id);
      const contentItems = teacher.content.map((c) => ({
        title: c.title,
        type: contentTypeLabel(c.contentType),
      }));

      const previews = teacher.content.map((c) => {
        const preview = extractContentPreview(c as any);
        return {
          title: preview.title,
          type: contentTypeLabel(preview.type),
          sections: preview.sections,
          questionCount: preview.questionCount,
          vocabularyTerms: preview.vocabularyTerms,
          cardCount: preview.cardCount,
        };
      });

      const success = await emailService.sendDownloadReminder72hEmail(
        teacher.email,
        teacher.firstName || 'there',
        contentItems,
        previews,
        downloadsRemaining
      );

      if (success) {
        // Record as 72h trigger so future cron runs skip them
        await recordTrigger(teacher.id, 'download_reminder_72h', {
          contentIds: teacher.content.map((c) => c.id),
          source: 'backfill',
        });
        sent++;
        logger.info(`Backfill email sent to ${teacher.email}`, { teacherId: teacher.id });
      }
    }

    logger.info('Download reminder backfill complete', { eligible: teachers.length, sent });
  } catch (error) {
    logger.error('Download reminder backfill failed', { error });
  }

  return sent;
}

// ============================================================================
// CLI RUNNER
// ============================================================================

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  const backfillIdx = process.argv.indexOf('--backfill');
  if (backfillIdx !== -1) {
    const limit = parseInt(process.argv[backfillIdx + 1], 10) || 20;
    backfillDownloadReminders(limit)
      .then((sent) => {
        console.log(`Backfill complete: ${sent} emails sent`);
        process.exit(0);
      })
      .catch((error) => {
        console.error('Error running backfill:', error);
        process.exit(1);
      });
  } else {
    runDownloadReminders()
      .then((results) => {
        console.log('Download reminders complete:', results);
        process.exit(0);
      })
      .catch((error) => {
        console.error('Error running download reminders:', error);
        process.exit(1);
      });
  }
}

export default {
  runDownloadReminders,
  scheduleDownloadReminders,
  backfillDownloadReminders,
};
