/**
 * Export Routes for Teacher Content
 * Handles PDF export and Google Drive integration
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateTeacher, requireTeacher } from '../../middleware/teacherAuth.js';
import { prisma } from '../../config/database.js';
import { exportContent, exportMultipleContent, ExportOptions } from '../../services/teacher/exportService.js';
import { generateLessonPPTX, generateFlashcardPPTX, PresentonExportOptions } from '../../services/teacher/presentonService.js';
import * as googleDriveService from '../../services/teacher/googleDriveService.js';
import { createGoogleSlidesPresentationFromPptx } from '../../services/teacher/googleSlidesService.js';
import { uploadFile } from '../../services/storage/storageService.js';
import { SUBSCRIPTION_PRODUCTS } from '../../config/stripeProducts.js';
import { checkDownloadAccess, consumeFreeDownloadAllowance, getDownloadAccess } from '../../services/teacher/downloadAccessService.js';

const router = Router();

// In-memory tracking of ongoing exports to prevent duplicate processing
// Key format: `${teacherId}:${contentId}:${exportType}`
// Auto-cleanup after 5 minutes to handle abandoned requests
const ongoingExports = new Map<string, { startedAt: Date }>();
const EXPORT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// Cleanup stale export entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of ongoingExports.entries()) {
    if (now - value.startedAt.getTime() > EXPORT_TIMEOUT_MS) {
      ongoingExports.delete(key);
      console.log(`Cleaned up stale export entry: ${key}`);
    }
  }
}, 60 * 1000); // Check every minute

// All routes require teacher authentication
// authenticateTeacher verifies JWT and populates req.teacher
// requireTeacher ensures req.teacher exists
router.use(authenticateTeacher);
router.use(requireTeacher);

// Validation schemas
const exportOptionsSchema = z.object({
  format: z.enum(['pdf', 'html']).default('pdf'),
  includeAnswers: z.boolean().default(true),
  includeTeacherNotes: z.boolean().default(true),
  paperSize: z.enum(['letter', 'a4']).default('letter'),
  colorScheme: z.enum(['color', 'grayscale']).default('color'),
});

const batchExportSchema = z.object({
  contentIds: z.array(z.string().uuid()).min(1).max(20),
  options: exportOptionsSchema.optional(),
});

const directDownloadConsumeSchema = z.object({
  exportKind: z.enum(['pdf', 'pptx', 'drive', 'batch']).optional(),
  sourceType: z.string().max(100).optional(),
  sourceId: z.string().max(255).optional(),
});

function getDownloadAccessResponseData(access: Awaited<ReturnType<typeof getDownloadAccess>>) {
  const teacherPlan = SUBSCRIPTION_PRODUCTS.BASIC;
  const proPlan = SUBSCRIPTION_PRODUCTS.PROFESSIONAL;

  return {
    ...access,
    prices: {
      subscription_monthly: Math.round(teacherPlan.priceMonthly * 100),
      subscription_annual: Math.round(teacherPlan.priceAnnual * 100),
      pro_subscription_monthly: Math.round(proPlan.priceMonthly * 100),
      pro_subscription_annual: Math.round(proPlan.priceAnnual * 100),
    },
  };
}

function getDownloadBlockedPayload(access: {
  requiredProduct: string;
  priceCents: number;
  freeMonthlyLimit: number;
  freeDownloadsUsed: number;
  freeDownloadsRemaining: number;
  freeDownloadsResetAt: Date;
}) {
  return {
    success: false,
    error: 'Free monthly download limit reached. Start Teacher Unlimited to continue exporting.',
    requiredProduct: access.requiredProduct,
    price: access.priceCents,
    freeMonthlyLimit: access.freeMonthlyLimit,
    freeDownloadsUsed: access.freeDownloadsUsed,
    freeDownloadsRemaining: access.freeDownloadsRemaining,
    freeDownloadsResetAt: access.freeDownloadsResetAt,
  };
}

async function consumeDownloadAllowanceOrRespond(
  res: Response,
  teacherId: string,
  contentId: string
): Promise<boolean> {
  try {
    await consumeFreeDownloadAllowance(teacherId);
    return true;
  } catch (error: any) {
    if (error?.name === 'ForbiddenError') {
      const latestAccess = await getDownloadAccess(teacherId, contentId);
      res.status(403).json(getDownloadBlockedPayload({
        requiredProduct: 'SUBSCRIPTION',
        priceCents: Math.round(SUBSCRIPTION_PRODUCTS.BASIC.priceMonthly * 100),
        freeMonthlyLimit: latestAccess.freeMonthlyLimit,
        freeDownloadsUsed: latestAccess.freeDownloadsUsed,
        freeDownloadsRemaining: latestAccess.freeDownloadsRemaining,
        freeDownloadsResetAt: latestAccess.freeDownloadsResetAt,
      }));
      return false;
    }

    throw error;
  }
}

// ============================================
// DOWNLOADS ROUTES (must come before /:contentId)
// ============================================

/**
 * Check download access for a specific content item
 * GET /api/teacher/export/access/:contentId
 */
router.get('/access/:contentId', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const { contentId } = req.params;

    const content = await prisma.teacherContent.findFirst({
      where: {
        id: contentId,
        teacherId,
      },
      select: { id: true },
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    const access = await getDownloadAccess(teacherId, contentId);

    return res.json({
      success: true,
      data: getDownloadAccessResponseData(access),
    });
  } catch (error) {
    console.error('Access check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check download access',
    });
  }
});

/**
 * Check generic direct-download access for flows that do not export TeacherContent
 * GET /api/teacher/export/access
 */
router.get('/access', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const sourceId = typeof req.query.sourceId === 'string' && req.query.sourceId.trim()
      ? req.query.sourceId.trim()
      : teacherId;
    const access = await getDownloadAccess(teacherId, sourceId);

    return res.json({
      success: true,
      data: getDownloadAccessResponseData(access),
    });
  } catch (error) {
    console.error('Direct access check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check download access',
    });
  }
});

/**
 * Consume generic direct-download allowance for flows that bypass TeacherContent exports
 * POST /api/teacher/export/consume
 */
router.post('/consume', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const { sourceId } = directDownloadConsumeSchema.parse(req.body || {});
    const access = await getDownloadAccess(teacherId, sourceId || teacherId);

    if (!access.canDownload) {
      return res.status(403).json(getDownloadBlockedPayload({
        requiredProduct: 'SUBSCRIPTION',
        priceCents: Math.round(SUBSCRIPTION_PRODUCTS.BASIC.priceMonthly * 100),
        freeMonthlyLimit: access.freeMonthlyLimit,
        freeDownloadsUsed: access.freeDownloadsUsed,
        freeDownloadsRemaining: access.freeDownloadsRemaining,
        freeDownloadsResetAt: access.freeDownloadsResetAt,
      }));
    }

    const result = await consumeFreeDownloadAllowance(teacherId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    if (error?.name === 'ForbiddenError') {
      const teacherId = req.teacher!.id;
      const sourceId = typeof req.body?.sourceId === 'string' && req.body.sourceId.trim()
        ? req.body.sourceId.trim()
        : teacherId;
      const latestAccess = await getDownloadAccess(teacherId, sourceId);
      return res.status(403).json(getDownloadBlockedPayload({
        requiredProduct: 'SUBSCRIPTION',
        priceCents: Math.round(SUBSCRIPTION_PRODUCTS.BASIC.priceMonthly * 100),
        freeMonthlyLimit: latestAccess.freeMonthlyLimit,
        freeDownloadsUsed: latestAccess.freeDownloadsUsed,
        freeDownloadsRemaining: latestAccess.freeDownloadsRemaining,
        freeDownloadsResetAt: latestAccess.freeDownloadsResetAt,
      }));
    }

    console.error('Direct download consume error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to reserve download allowance',
    });
  }
});

import { queueExportJob, ExportJobData } from '../../jobs/index.js';
import { ExportFormat, ExportStatus } from '@prisma/client';

/**
 * List all exports for the teacher (Downloads page)
 * GET /api/teacher/export/downloads
 */
router.get('/downloads', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const offset = (page - 1) * limit;

    const [exports, total, dripEnrollment] = await Promise.all([
      prisma.teacherExport.findMany({
        where: { teacherId },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          content: {
            select: {
              id: true,
              title: true,
              contentType: true,
              subject: true,
            },
          },
        },
      }),
      prisma.teacherExport.count({ where: { teacherId } }),
      prisma.contentDripEnrollment.findUnique({
        where: { teacherId },
        select: { generatedContentIds: true },
      }),
    ]);

    const dripContentIds = new Set(dripEnrollment?.generatedContentIds || []);

    return res.json({
      success: true,
      data: {
        exports: exports.map(exp => ({
          id: exp.id,
          contentId: exp.contentId,
          contentTitle: exp.contentTitle,
          contentType: exp.content?.contentType,
          subject: exp.content?.subject,
          format: exp.format,
          filename: exp.filename,
          fileSize: exp.fileSize,
          downloadUrl: exp.r2Url,
          editUrl: exp.editUrl,
          status: exp.status,
          errorMessage: exp.errorMessage,
          emailSent: exp.emailSent,
          isSystemGenerated: dripContentIds.has(exp.contentId),
          notificationEligible: !dripContentIds.has(exp.contentId),
          createdAt: exp.createdAt,
          completedAt: exp.completedAt,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('List downloads error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to list downloads',
    });
  }
});

/**
 * Get single export details
 * GET /api/teacher/export/downloads/:exportId
 */
router.get('/downloads/:exportId', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const { exportId } = req.params;

    const [exportRecord, dripEnrollment] = await Promise.all([
      prisma.teacherExport.findFirst({
        where: {
          id: exportId,
          teacherId,
        },
        include: {
          content: {
            select: {
              id: true,
              title: true,
              contentType: true,
              subject: true,
            },
          },
        },
      }),
      prisma.contentDripEnrollment.findUnique({
        where: { teacherId },
        select: { generatedContentIds: true },
      }),
    ]);

    if (!exportRecord) {
      return res.status(404).json({
        success: false,
        error: 'Export not found',
      });
    }

    const dripContentIds = new Set(dripEnrollment?.generatedContentIds || []);

    return res.json({
      success: true,
      data: {
        id: exportRecord.id,
        contentId: exportRecord.contentId,
        contentTitle: exportRecord.contentTitle,
        contentType: exportRecord.content?.contentType,
        subject: exportRecord.content?.subject,
        format: exportRecord.format,
        filename: exportRecord.filename,
        fileSize: exportRecord.fileSize,
        downloadUrl: exportRecord.r2Url,
        editUrl: exportRecord.editUrl,
        status: exportRecord.status,
        errorMessage: exportRecord.errorMessage,
        emailSent: exportRecord.emailSent,
        isSystemGenerated: dripContentIds.has(exportRecord.contentId),
        notificationEligible: !dripContentIds.has(exportRecord.contentId),
        createdAt: exportRecord.createdAt,
        completedAt: exportRecord.completedAt,
      },
    });
  } catch (error) {
    console.error('Get export error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get export details',
    });
  }
});

/**
 * Delete an export
 * DELETE /api/teacher/export/downloads/:exportId
 */
router.delete('/downloads/:exportId', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const { exportId } = req.params;

    const exportRecord = await prisma.teacherExport.findFirst({
      where: {
        id: exportId,
        teacherId,
      },
    });

    if (!exportRecord) {
      return res.status(404).json({
        success: false,
        error: 'Export not found',
      });
    }

    // Delete from R2 if exists
    if (exportRecord.r2Key) {
      try {
        const { deleteFile } = await import('../../services/storage/storageService.js');
        await deleteFile('aiContent', exportRecord.r2Key);
      } catch (deleteError) {
        console.error('Failed to delete file from R2:', deleteError);
        // Continue with database deletion even if R2 deletion fails
      }
    }

    // Delete from database
    await prisma.teacherExport.delete({
      where: { id: exportId },
    });

    return res.json({
      success: true,
      message: 'Export deleted',
    });
  } catch (error) {
    console.error('Delete export error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete export',
    });
  }
});

// ============================================
// PDF EXPORT ROUTES
// ============================================

/**
 * Export single content to PDF/HTML
 * GET /api/teacher/export/:contentId
 */
router.get('/:contentId', async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const teacherId = req.teacher!.id;
  const exportFormat = (req.query.format as string) || 'pdf';
  const answerKeyOnly = req.query.answerKeyOnly === 'true';
  const exportKey = `${teacherId}:${contentId}:${exportFormat}${answerKeyOnly ? ':answer-key' : ''}`;

  try {
    // Check for duplicate export request
    if (ongoingExports.has(exportKey)) {
      console.log(`Duplicate ${exportFormat.toUpperCase()} export request blocked: ${exportKey}`);
      return res.status(409).json({
        success: false,
        error: 'Export already in progress. Please wait for the current export to complete.',
      });
    }

    // Mark export as in progress
    ongoingExports.set(exportKey, { startedAt: new Date() });

    // Parse query params
    const options: ExportOptions = {
      format: exportFormat as 'pdf' | 'html',
      includeAnswers: req.query.includeAnswers !== 'false',
      includeTeacherNotes: req.query.includeTeacherNotes !== 'false',
      paperSize: (req.query.paperSize as 'letter' | 'a4') || 'letter',
      colorScheme: (req.query.colorScheme as 'color' | 'grayscale') || 'color',
      answerKeyOnly: req.query.answerKeyOnly === 'true',
    };

    // Verify content exists and belongs to teacher
    const content = await prisma.teacherContent.findFirst({
      where: {
        id: contentId,
        teacherId,
      },
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found. It may have been deleted. Go back to your Content library.',
      });
    }

    // Answer-key-only requests are a companion to the quiz PDF download
    // (which already consumed the allowance), so skip access/allowance checks.
    if (!options.answerKeyOnly) {
      const access = await checkDownloadAccess(
        teacherId,
        contentId,
        content.contentType,
        'pdf'
      );

      if (!access.allowed) {
        return res.status(403).json(getDownloadBlockedPayload(access));
      }

      if (!(await consumeDownloadAllowanceOrRespond(res, teacherId, contentId))) {
        return;
      }
    }

    // Generate export
    const result = await exportContent(content, options);

    // Set response headers
    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);

    // Send file
    return res.send(result.data);
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({
      success: false,
      error: 'Export failed. Try again or choose a different format (PDF, DOCX, or PPTX).',
    });
  } finally {
    // Always clean up the export tracking
    ongoingExports.delete(exportKey);
  }
});

/**
 * Export single content to PowerPoint using Presenton API
 * GET /api/teacher/export/:contentId/pptx
 */
router.get('/:contentId/pptx', async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const teacherId = req.teacher!.id;
  const exportKey = `${teacherId}:${contentId}:pptx`;

  try {
    // Check for duplicate export request
    if (ongoingExports.has(exportKey)) {
      console.log(`Duplicate PPTX export request blocked: ${exportKey}`);
      return res.status(409).json({
        success: false,
        error: 'Export already in progress. Please wait for the current export to complete.',
      });
    }

    // Mark export as in progress
    ongoingExports.set(exportKey, { startedAt: new Date() });
    console.log(`Starting PPTX export: ${exportKey}`);

    // Parse query params for PPTX options
    // Map frontend theme options to Presenton themes
    const themeMap: Record<string, PresentonExportOptions['theme']> = {
      'professional': 'professional-blue',
      'colorful': 'mint-blue',
    };
    const frontendTheme = (req.query.theme as string) || 'professional';

    const options: PresentonExportOptions = {
      theme: themeMap[frontendTheme] || 'professional-blue',
      slideStyle: (req.query.slideStyle as 'focused' | 'dense') || 'focused',
      includeAnswers: req.query.includeAnswers !== 'false',
      includeTeacherNotes: req.query.includeTeacherNotes !== 'false',
      includeInfographic: req.query.includeInfographic !== 'false',
      language: (req.query.language as string) || 'English',
    };

    // Verify content exists and belongs to teacher
    const content = await prisma.teacherContent.findFirst({
      where: {
        id: contentId,
        teacherId,
      },
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found. It may have been deleted. Go back to your Content library.',
      });
    }

    // Lessons, flashcards, and worksheets can be exported to PPTX
    if (
      content.contentType !== 'LESSON' &&
      content.contentType !== 'FLASHCARD_DECK' &&
      content.contentType !== 'WORKSHEET'
    ) {
      return res.status(400).json({
        success: false,
        error: 'Only lessons, worksheets, and flashcard decks can be exported to PowerPoint. Try PDF export for quizzes.',
      });
    }

    const access = await checkDownloadAccess(
      teacherId,
      contentId,
      content.contentType,
      'pptx'
    );

    if (!access.allowed) {
      return res.status(403).json(getDownloadBlockedPayload(access));
    }

    if (!(await consumeDownloadAllowanceOrRespond(res, teacherId, contentId))) {
      return;
    }

    // Generate PPTX using Presenton API (different function for flashcards)
    const result = content.contentType === 'FLASHCARD_DECK'
      ? await generateFlashcardPPTX(content, options)
      : await generateLessonPPTX(content, options);

    // Persist export record for admin reports/downloads (best-effort)
    try {
      const exportRecord = await prisma.teacherExport.create({
        data: {
          teacherId,
          contentId,
          contentTitle: content.title,
          format: ExportFormat.PPTX,
          filename: result.filename,
          status: ExportStatus.PROCESSING,
        },
      });

      try {
        const timestamp = Date.now();
        const sanitizedTitle = content.title
          .replace(/[^a-z0-9]/gi, '-')
          .replace(/-+/g, '-')
          .substring(0, 50);
        const r2Key = `teacher/${teacherId}/exports/${timestamp}-${sanitizedTitle}.pptx`;
        const mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        const uploadResult = await uploadFile(
          'aiContent',
          r2Key,
          result.data,
          mimeType,
          {
            'teacher-id': teacherId,
            'content-id': contentId,
            'export-id': exportRecord.id,
            'original-filename': result.filename,
          }
        );

        await prisma.teacherExport.update({
          where: { id: exportRecord.id },
          data: {
            status: ExportStatus.COMPLETED,
            r2Key,
            r2Url: uploadResult.publicUrl,
            fileSize: result.data.length,
            editUrl: 'editUrl' in result ? (result.editUrl as string) : undefined,
            completedAt: new Date(),
            filename: result.filename,
          },
        });
      } catch (storeError) {
        console.error('Failed to store PPTX export for reports:', storeError);
        try {
          await prisma.teacherExport.update({
            where: { id: exportRecord.id },
            data: {
              status: ExportStatus.FAILED,
              errorMessage: storeError instanceof Error ? storeError.message : 'Failed to store export',
            },
          });
        } catch (updateError) {
          console.error('Failed to mark PPTX export as failed:', updateError);
        }
      }
    } catch (recordError) {
      console.error('Failed to create PPTX export record:', recordError);
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);

    // Send file
    return res.send(result.data);
  } catch (error) {
    console.error('PPTX export error:', error);
    return res.status(500).json({
      success: false,
      error: 'PowerPoint export failed. Try PDF export instead, or wait a moment and retry.',
    });
  } finally {
    // Always clean up the export tracking
    ongoingExports.delete(exportKey);
    console.log(`Completed PPTX export: ${exportKey}`);
  }
});

/**
 * Export multiple content items as single PDF
 * POST /api/teacher/export/batch
 */
router.post('/batch', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const { contentIds, options } = batchExportSchema.parse(req.body);

    // Fetch all content
    const contents = await prisma.teacherContent.findMany({
      where: {
        id: { in: contentIds },
        teacherId,
      },
    });

    if (contents.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No content found',
      });
    }

    const access = await getDownloadAccess(teacherId, contents[0].id);
    if (!access.canDownload) {
      return res.status(403).json(getDownloadBlockedPayload({
        requiredProduct: 'SUBSCRIPTION',
        priceCents: Math.round(SUBSCRIPTION_PRODUCTS.BASIC.priceMonthly * 100),
        freeMonthlyLimit: access.freeMonthlyLimit,
        freeDownloadsUsed: access.freeDownloadsUsed,
        freeDownloadsRemaining: access.freeDownloadsRemaining,
        freeDownloadsResetAt: access.freeDownloadsResetAt,
      }));
    }

    if (!(await consumeDownloadAllowanceOrRespond(res, teacherId, contents[0].id))) {
      return;
    }

    // Generate combined export
    const result = await exportMultipleContent(contents, options);

    // Set response headers
    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);

    return res.send(result.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
    console.error('Batch export error:', error);
    return res.status(500).json({
      success: false,
      error: 'Batch export failed. Try selecting fewer items or exporting individually.',
    });
  }
});

// ============================================
// GOOGLE DRIVE ROUTES
// ============================================

/**
 * Check Google Drive connection status
 * GET /api/teacher/export/drive/status
 */
router.get('/drive/status', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const connected = await googleDriveService.isGoogleDriveConnected(teacherId);

    return res.json({
      success: true,
      data: {
        connected,
      },
    });
  } catch (error) {
    console.error('Drive status error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to check Google Drive connection. Please try again.',
    });
  }
});

/**
 * Get Google Drive authorization URL
 * GET /api/teacher/export/drive/auth-url
 */
router.get('/drive/auth-url', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;

    // Include teacher ID in state for callback
    const state = Buffer.from(JSON.stringify({ teacherId })).toString('base64');
    const authUrl = googleDriveService.getAuthorizationUrl(state);

    return res.json({
      success: true,
      data: {
        authUrl,
      },
    });
  } catch (error) {
    console.error('Auth URL error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate authorization URL',
    });
  }
});

/**
 * Handle Google OAuth callback
 * POST /api/teacher/export/drive/callback
 */
router.post('/drive/callback', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Authorization code required',
      });
    }

    // Exchange code for tokens
    const tokens = await googleDriveService.exchangeCodeForTokens(code);

    // Save tokens for teacher
    await googleDriveService.saveTeacherDriveTokens(teacherId, tokens);

    return res.json({
      success: true,
      message: 'Google Drive connected successfully',
    });
  } catch (error) {
    console.error('Drive callback error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to connect Google Drive',
    });
  }
});

/**
 * Disconnect Google Drive
 * DELETE /api/teacher/export/drive/disconnect
 */
router.delete('/drive/disconnect', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    await googleDriveService.disconnectGoogleDrive(teacherId);

    return res.json({
      success: true,
      message: 'Google Drive disconnected',
    });
  } catch (error) {
    console.error('Drive disconnect error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to disconnect Google Drive',
    });
  }
});

/**
 * Create editable Google Slides presentation
 * POST /api/teacher/export/:contentId/google-slides
 */
router.post('/:contentId/google-slides', async (req: Request, res: Response) => {
  try {
    const { contentId } = req.params;
    const teacherId = req.teacher!.id;
    const themeMap: Record<string, PresentonExportOptions['theme']> = {
      professional: 'professional-blue',
      colorful: 'mint-blue',
    };
    const frontendTheme = (req.body.theme as string) || 'professional';
    const options: PresentonExportOptions = {
      theme: themeMap[frontendTheme] || 'professional-blue',
      slideStyle: (req.body.slideStyle as 'focused' | 'dense') || 'focused',
      includeAnswers: req.body.includeAnswers !== false,
      includeTeacherNotes: req.body.includeTeacherNotes !== false,
      includeInfographic: req.body.includeInfographic !== false,
      language: (req.body.language as string) || 'English',
    };

    const content = await prisma.teacherContent.findFirst({
      where: {
        id: contentId,
        teacherId,
      },
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    if (
      content.contentType !== 'LESSON' &&
      content.contentType !== 'FLASHCARD_DECK' &&
      content.contentType !== 'WORKSHEET'
    ) {
      return res.status(400).json({
        success: false,
        error: 'Google Slides export is currently available for lessons, worksheets, and flashcard decks.',
      });
    }

    const access = await checkDownloadAccess(
      teacherId,
      contentId,
      content.contentType,
      'drive'
    );

    if (!access.allowed) {
      return res.status(403).json(getDownloadBlockedPayload(access));
    }

    if (!(await consumeDownloadAllowanceOrRespond(res, teacherId, contentId))) {
      return;
    }

    const pptx = content.contentType === 'FLASHCARD_DECK'
      ? await generateFlashcardPPTX(content, options)
      : await generateLessonPPTX(content, options);

    const result = await createGoogleSlidesPresentationFromPptx(teacherId, {
      data: pptx.data,
      filename: pptx.filename,
      title: content.contentType === 'FLASHCARD_DECK'
        ? `${content.title} - Orbit Learn Flashcards`
        : `${content.title} - Orbit Learn`,
    });

    return res.json({
      success: true,
      data: {
        presentationId: result.presentationId,
        fileId: result.fileId,
        webViewLink: result.webViewLink,
        title: result.title,
      },
    });
  } catch (error) {
    console.error('Google Slides export error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create Google Slides presentation';
    const status = message.toLowerCase().includes('google') || message.toLowerCase().includes('reconnect')
      ? 400
      : 500;

    return res.status(status).json({
      success: false,
      error: message,
    });
  }
});

/**
 * Save content to Google Drive
 * POST /api/teacher/export/:contentId/drive
 */
router.post('/:contentId/drive', async (req: Request, res: Response) => {
  try {
    const { contentId } = req.params;
    const teacherId = req.teacher!.id;

    // Parse options
    const options: ExportOptions = {
      format: 'pdf',
      includeAnswers: req.body.includeAnswers !== false,
      includeTeacherNotes: req.body.includeTeacherNotes !== false,
      paperSize: req.body.paperSize || 'letter',
      colorScheme: req.body.colorScheme || 'color',
    };

    // Verify content exists and belongs to teacher
    const content = await prisma.teacherContent.findFirst({
      where: {
        id: contentId,
        teacherId,
      },
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    const access = await checkDownloadAccess(
      teacherId,
      contentId,
      content.contentType,
      'drive'
    );

    if (!access.allowed) {
      return res.status(403).json(getDownloadBlockedPayload(access));
    }

    if (!(await consumeDownloadAllowanceOrRespond(res, teacherId, contentId))) {
      return;
    }

    // Generate PDF
    const exportResult = await exportContent(content, options);

    // Upload to Drive
    const driveResult = await googleDriveService.uploadToDrive(teacherId, {
      name: exportResult.filename,
      mimeType: exportResult.mimeType,
      data: exportResult.data as Buffer,
    }, {
      description: `Exported from Orbit Learn: ${content.title}`,
    });

    if (!driveResult.success) {
      return res.status(400).json({
        success: false,
        error: driveResult.error,
      });
    }

    return res.json({
      success: true,
      data: {
        fileId: driveResult.fileId,
        webViewLink: driveResult.webViewLink,
      },
    });
  } catch (error) {
    console.error('Drive upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save to Google Drive',
    });
  }
});

/**
 * Save multiple content items to Google Drive
 * POST /api/teacher/export/batch/drive
 */
router.post('/batch/drive', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const { contentIds, options } = batchExportSchema.parse(req.body);

    // Fetch all content
    const contents = await prisma.teacherContent.findMany({
      where: {
        id: { in: contentIds },
        teacherId,
      },
    });

    if (contents.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No content found',
      });
    }

    const access = await getDownloadAccess(teacherId, contents[0].id);
    if (!access.canDownload) {
      return res.status(403).json(getDownloadBlockedPayload({
        requiredProduct: 'SUBSCRIPTION',
        priceCents: Math.round(SUBSCRIPTION_PRODUCTS.BASIC.priceMonthly * 100),
        freeMonthlyLimit: access.freeMonthlyLimit,
        freeDownloadsUsed: access.freeDownloadsUsed,
        freeDownloadsRemaining: access.freeDownloadsRemaining,
        freeDownloadsResetAt: access.freeDownloadsResetAt,
      }));
    }

    if (!(await consumeDownloadAllowanceOrRespond(res, teacherId, contents[0].id))) {
      return;
    }

    // Generate combined PDF
    const exportResult = await exportMultipleContent(contents, options);

    // Upload to Drive
    const driveResult = await googleDriveService.uploadToDrive(teacherId, {
      name: exportResult.filename,
      mimeType: exportResult.mimeType,
      data: exportResult.data,
    }, {
      description: `Batch export from Orbit Learn (${contents.length} items)`,
    });

    if (!driveResult.success) {
      return res.status(400).json({
        success: false,
        error: driveResult.error,
      });
    }

    return res.json({
      success: true,
      data: {
        fileId: driveResult.fileId,
        webViewLink: driveResult.webViewLink,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
    console.error('Batch Drive upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save to Google Drive',
    });
  }
});

/**
 * List files in Google Drive Orbit Learn folder
 * GET /api/teacher/export/drive/files
 */
router.get('/drive/files', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const pageToken = req.query.pageToken as string | undefined;

    const result = await googleDriveService.listDriveFiles(teacherId, pageSize, pageToken);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    return res.json({
      success: true,
      data: {
        files: result.files,
        nextPageToken: result.nextPageToken,
      },
    });
  } catch (error) {
    console.error('Drive list error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to list Drive files',
    });
  }
});

/**
 * Delete file from Google Drive
 * DELETE /api/teacher/export/drive/files/:fileId
 */
router.delete('/drive/files/:fileId', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const { fileId } = req.params;

    const result = await googleDriveService.deleteFromDrive(teacherId, fileId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    return res.json({
      success: true,
      message: 'File deleted from Drive',
    });
  } catch (error) {
    console.error('Drive delete error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete file',
    });
  }
});

// ============================================
// ASYNC EXPORT ROUTES
// ============================================

/**
 * Queue async PPTX export (with email notification)
 * POST /api/teacher/export/:contentId/pptx-async
 */
router.post('/:contentId/pptx-async', async (req: Request, res: Response) => {
  try {
    const { contentId } = req.params;
    const teacher = req.teacher!;

    // Parse options
    const themeMap: Record<string, PresentonExportOptions['theme']> = {
      'professional': 'professional-blue',
      'colorful': 'mint-blue',
    };
    const frontendTheme = (req.body.theme as string) || 'professional';

    const options: PresentonExportOptions = {
      theme: themeMap[frontendTheme] || 'professional-blue',
      slideStyle: (req.body.slideStyle as 'focused' | 'dense') || 'focused',
      includeAnswers: req.body.includeAnswers !== false,
      includeTeacherNotes: req.body.includeTeacherNotes !== false,
      includeInfographic: req.body.includeInfographic !== false,
      language: (req.body.language as string) || 'English',
    };

    // Verify content exists and belongs to teacher
    const content = await prisma.teacherContent.findFirst({
      where: {
        id: contentId,
        teacherId: teacher.id,
      },
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    // Lessons, flashcards, and worksheets can be exported to PPTX
    if (
      content.contentType !== 'LESSON' &&
      content.contentType !== 'FLASHCARD_DECK' &&
      content.contentType !== 'WORKSHEET'
    ) {
      return res.status(400).json({
        success: false,
        error: 'Only lessons, worksheets, and flashcard decks can be exported to PowerPoint',
      });
    }

    const access = await checkDownloadAccess(
      teacher.id,
      contentId,
      content.contentType,
      'pptx'
    );

    if (!access.allowed) {
      return res.status(403).json(getDownloadBlockedPayload(access));
    }

    // Check for existing in-progress export
    const existingExport = await prisma.teacherExport.findFirst({
      where: {
        teacherId: teacher.id,
        contentId,
        format: ExportFormat.PPTX,
        status: { in: [ExportStatus.QUEUED, ExportStatus.PROCESSING] },
      },
    });

    if (existingExport) {
      return res.status(409).json({
        success: false,
        error: 'Export already in progress for this content',
        data: {
          exportId: existingExport.id,
          status: existingExport.status,
        },
      });
    }

    if (!(await consumeDownloadAllowanceOrRespond(res, teacher.id, contentId))) {
      return;
    }

    // Get teacher's full name for email
    const teacherRecord = await prisma.teacher.findUnique({
      where: { id: teacher.id },
      select: { firstName: true },
    });

    // Determine filename based on content type
    const isFlashcard = content.contentType === 'FLASHCARD_DECK';
    const filename = isFlashcard
      ? `${content.title} - Flashcards - Orbit Learn.pptx`
      : `${content.title} - Orbit Learn.pptx`;

    // Create export record
    const exportRecord = await prisma.teacherExport.create({
      data: {
        teacherId: teacher.id,
        contentId,
        contentTitle: content.title,
        format: ExportFormat.PPTX,
        filename,
        status: ExportStatus.QUEUED,
      },
    });

    // Queue the export job
    const jobData: ExportJobData = {
      exportId: exportRecord.id,
      teacherId: teacher.id,
      teacherEmail: teacher.email,
      teacherName: teacherRecord?.firstName || 'Teacher',
      contentId,
      contentTitle: content.title,
      format: ExportFormat.PPTX,
      options,
    };

    await queueExportJob(jobData);

    return res.status(202).json({
      success: true,
      message: 'Export queued. You will receive an email when your PowerPoint is ready.',
      data: {
        exportId: exportRecord.id,
        status: ExportStatus.QUEUED,
      },
    });
  } catch (error) {
    console.error('Async PPTX export error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to queue export. Please try again.',
    });
  }
});

/**
 * Queue async PDF export (with email notification)
 * POST /api/teacher/export/:contentId/pdf-async
 */
router.post('/:contentId/pdf-async', async (req: Request, res: Response) => {
  try {
    const { contentId } = req.params;
    const teacher = req.teacher!;

    const options: ExportOptions = {
      format: 'pdf',
      includeAnswers: req.body.includeAnswers !== false,
      includeTeacherNotes: req.body.includeTeacherNotes !== false,
      paperSize: req.body.paperSize || 'letter',
      colorScheme: req.body.colorScheme || 'color',
    };

    // Verify content exists and belongs to teacher
    const content = await prisma.teacherContent.findFirst({
      where: {
        id: contentId,
        teacherId: teacher.id,
      },
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    const access = await checkDownloadAccess(
      teacher.id,
      contentId,
      content.contentType,
      'pdf'
    );

    if (!access.allowed) {
      return res.status(403).json(getDownloadBlockedPayload(access));
    }

    // Check for existing in-progress export
    const existingExport = await prisma.teacherExport.findFirst({
      where: {
        teacherId: teacher.id,
        contentId,
        format: ExportFormat.PDF,
        status: { in: [ExportStatus.QUEUED, ExportStatus.PROCESSING] },
      },
    });

    if (existingExport) {
      return res.status(409).json({
        success: false,
        error: 'Export already in progress for this content',
        data: {
          exportId: existingExport.id,
          status: existingExport.status,
        },
      });
    }

    if (!(await consumeDownloadAllowanceOrRespond(res, teacher.id, contentId))) {
      return;
    }

    // Get teacher's full name for email
    const teacherRecord = await prisma.teacher.findUnique({
      where: { id: teacher.id },
      select: { firstName: true },
    });

    // Create export record
    const exportRecord = await prisma.teacherExport.create({
      data: {
        teacherId: teacher.id,
        contentId,
        contentTitle: content.title,
        format: ExportFormat.PDF,
        filename: `${content.title} - Orbit Learn.pdf`,
        status: ExportStatus.QUEUED,
      },
    });

    // Queue the export job
    const jobData: ExportJobData = {
      exportId: exportRecord.id,
      teacherId: teacher.id,
      teacherEmail: teacher.email,
      teacherName: teacherRecord?.firstName || 'Teacher',
      contentId,
      contentTitle: content.title,
      format: ExportFormat.PDF,
      options,
    };

    await queueExportJob(jobData);

    return res.status(202).json({
      success: true,
      message: 'Export queued. You will receive an email when your PDF is ready.',
      data: {
        exportId: exportRecord.id,
        status: ExportStatus.QUEUED,
      },
    });
  } catch (error) {
    console.error('Async PDF export error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to queue export. Please try again.',
    });
  }
});

export default router;
