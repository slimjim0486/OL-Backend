/**
 * Sample Content Routes
 *
 * Public endpoints for viewing sample teacher content.
 * No authentication required - samples are free for everyone to explore.
 *
 * Also includes admin endpoints for generating sample exports (PDF/PPTX).
 */

import { Router, Request, Response } from 'express';
import { TeacherContent, Subject, TeacherContentType } from '@prisma/client';
import { SAMPLE_TEACHER_CONTENT, getSampleById, getAllSampleSummaries, getAudioSample, SampleTeacherContent } from '../../data/sampleTeacherContent.js';
import { exportContent, ExportOptions } from '../../services/teacher/exportService.js';
import { generateLessonPPTX, PresentonExportOptions } from '../../services/teacher/presentonService.js';
import { uploadFile } from '../../services/storage/storageService.js';

const router = Router();

// Admin secret for generating exports (set in env)
const ADMIN_SECRET = process.env.SAMPLE_EXPORT_ADMIN_SECRET || 'orbit-sample-export-2024';

/**
 * Transform sample content to TeacherContent format for export services
 */
function sampleToTeacherContent(sample: SampleTeacherContent): TeacherContent {
  return {
    id: sample.id,
    teacherId: 'sample-teacher',
    title: sample.title,
    description: sample.description,
    subject: sample.subject as Subject,
    gradeLevel: sample.gradeLevel,
    contentType: 'LESSON' as TeacherContentType,
    sourceType: 'TEXT',
    originalFileUrl: null,
    originalFileName: null,
    extractedText: null,
    lessonContent: sample.lessonContent as unknown as Record<string, unknown>,
    quizContent: sample.quizContent as unknown as Record<string, unknown>,
    flashcardContent: sample.flashcardContent as unknown as Record<string, unknown>,
    infographicUrl: null,
    status: 'PUBLISHED',
    isPublic: true,
    publishedAt: new Date(),
    templateId: null,
    tokensUsed: 0,
    aiModelUsed: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as TeacherContent;
}

/**
 * GET /api/teacher/samples
 * Get list of all sample content (summaries only)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const samples = getAllSampleSummaries();
    res.json({
      success: true,
      data: samples,
      count: samples.length,
    });
  } catch (error) {
    console.error('Error fetching sample list:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sample content',
    });
  }
});

/**
 * GET /api/teacher/samples/:id
 * Get full sample content by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sample = getSampleById(id);

    if (!sample) {
      return res.status(404).json({
        success: false,
        error: 'Sample not found',
      });
    }

    res.json({
      success: true,
      data: sample,
    });
  } catch (error) {
    console.error('Error fetching sample:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sample content',
    });
  }
});

/**
 * GET /api/teacher/samples/:id/lesson
 * Get just the lesson content
 */
router.get('/:id/lesson', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sample = getSampleById(id);

    if (!sample) {
      return res.status(404).json({
        success: false,
        error: 'Sample not found',
      });
    }

    res.json({
      success: true,
      data: {
        id: sample.id,
        title: sample.title,
        subject: sample.subject,
        gradeLevel: sample.gradeLevel,
        lessonContent: sample.lessonContent,
      },
    });
  } catch (error) {
    console.error('Error fetching sample lesson:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sample lesson',
    });
  }
});

/**
 * GET /api/teacher/samples/:id/quiz
 * Get just the quiz content
 */
router.get('/:id/quiz', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sample = getSampleById(id);

    if (!sample) {
      return res.status(404).json({
        success: false,
        error: 'Sample not found',
      });
    }

    res.json({
      success: true,
      data: {
        id: sample.id,
        title: sample.title,
        subject: sample.subject,
        gradeLevel: sample.gradeLevel,
        quizContent: sample.quizContent,
      },
    });
  } catch (error) {
    console.error('Error fetching sample quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sample quiz',
    });
  }
});

/**
 * GET /api/teacher/samples/:id/flashcards
 * Get just the flashcard content
 */
router.get('/:id/flashcards', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sample = getSampleById(id);

    if (!sample) {
      return res.status(404).json({
        success: false,
        error: 'Sample not found',
      });
    }

    res.json({
      success: true,
      data: {
        id: sample.id,
        title: sample.title,
        subject: sample.subject,
        gradeLevel: sample.gradeLevel,
        flashcardContent: sample.flashcardContent,
      },
    });
  } catch (error) {
    console.error('Error fetching sample flashcards:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sample flashcards',
    });
  }
});

/**
 * GET /api/teacher/samples/audio/sample
 * Get the sample audio update content
 */
router.get('/audio/sample', async (req: Request, res: Response) => {
  try {
    const audioSample = getAudioSample();
    res.json({
      success: true,
      data: audioSample,
    });
  } catch (error) {
    console.error('Error fetching audio sample:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audio sample',
    });
  }
});

// ============================================
// ADMIN: EXPORT GENERATION ROUTES
// These require admin secret to prevent abuse
// ============================================

/**
 * POST /api/teacher/samples/:id/generate-exports
 * Generate all exports (PDF lesson, PDF quiz, PDF flashcards, PPTX) for a sample
 * Requires admin secret in header: X-Admin-Secret
 */
router.post('/:id/generate-exports', async (req: Request, res: Response) => {
  try {
    // Verify admin secret
    const adminSecret = req.headers['x-admin-secret'];
    if (adminSecret !== ADMIN_SECRET) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - invalid admin secret',
      });
    }

    const { id } = req.params;
    const sample = getSampleById(id);

    if (!sample) {
      return res.status(404).json({
        success: false,
        error: 'Sample not found',
      });
    }

    console.log(`[SampleExport] Generating exports for: ${sample.id} - ${sample.title}`);

    const results: Record<string, { success: boolean; url?: string; error?: string }> = {};
    const teacherContent = sampleToTeacherContent(sample);

    // Export options
    const pdfOptions: ExportOptions = {
      format: 'pdf',
      includeAnswers: true,
      includeTeacherNotes: true,
      paperSize: 'letter',
      colorScheme: 'color',
    };

    const pptxOptions: PresentonExportOptions = {
      theme: 'professional-blue',
      slideStyle: 'focused',
      includeAnswers: true,
      includeTeacherNotes: true,
      includeInfographic: true,
      language: 'English',
    };

    // 1. Generate Lesson PDF
    try {
      console.log(`[SampleExport] Generating lesson PDF...`);
      const lessonPdf = await exportContent(teacherContent, pdfOptions);
      const lessonPdfPath = `samples/${sample.id}/${sample.id}-lesson.pdf`;
      const uploaded = await uploadFile('aiContent', lessonPdfPath, lessonPdf.data, 'application/pdf', {
        'sample-id': sample.id,
        'export-type': 'lesson-pdf',
      });
      results['lesson-pdf'] = { success: true, url: uploaded.publicUrl };
      console.log(`[SampleExport] Lesson PDF uploaded: ${uploaded.publicUrl}`);
    } catch (error) {
      console.error('[SampleExport] Lesson PDF error:', error);
      results['lesson-pdf'] = { success: false, error: String(error) };
    }

    // 2. Generate Quiz PDF (using quiz content type)
    try {
      console.log(`[SampleExport] Generating quiz PDF...`);
      const quizContent = {
        ...teacherContent,
        contentType: 'QUIZ' as TeacherContentType,
        title: sample.quizContent?.title || `${sample.title} - Quiz`,
      };
      const quizPdf = await exportContent(quizContent, pdfOptions);
      const quizPdfPath = `samples/${sample.id}/${sample.id}-quiz.pdf`;
      const uploaded = await uploadFile('aiContent', quizPdfPath, quizPdf.data, 'application/pdf', {
        'sample-id': sample.id,
        'export-type': 'quiz-pdf',
      });
      results['quiz-pdf'] = { success: true, url: uploaded.publicUrl };
      console.log(`[SampleExport] Quiz PDF uploaded: ${uploaded.publicUrl}`);
    } catch (error) {
      console.error('[SampleExport] Quiz PDF error:', error);
      results['quiz-pdf'] = { success: false, error: String(error) };
    }

    // 3. Generate Flashcards PDF
    try {
      console.log(`[SampleExport] Generating flashcards PDF...`);
      const flashcardContent = {
        ...teacherContent,
        contentType: 'FLASHCARD_DECK' as TeacherContentType,
        title: sample.flashcardContent?.title || `${sample.title} - Flashcards`,
      };
      const flashcardPdf = await exportContent(flashcardContent, pdfOptions);
      const flashcardPdfPath = `samples/${sample.id}/${sample.id}-flashcards.pdf`;
      const uploaded = await uploadFile('aiContent', flashcardPdfPath, flashcardPdf.data, 'application/pdf', {
        'sample-id': sample.id,
        'export-type': 'flashcards-pdf',
      });
      results['flashcards-pdf'] = { success: true, url: uploaded.publicUrl };
      console.log(`[SampleExport] Flashcards PDF uploaded: ${uploaded.publicUrl}`);
    } catch (error) {
      console.error('[SampleExport] Flashcards PDF error:', error);
      results['flashcards-pdf'] = { success: false, error: String(error) };
    }

    // 4. Generate Lesson PPTX (using Presenton)
    try {
      console.log(`[SampleExport] Generating lesson PPTX via Presenton...`);
      const lessonPptx = await generateLessonPPTX(teacherContent, pptxOptions);
      const lessonPptxPath = `samples/${sample.id}/${sample.id}-lesson.pptx`;
      const uploaded = await uploadFile(
        'aiContent',
        lessonPptxPath,
        lessonPptx.data,
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        {
          'sample-id': sample.id,
          'export-type': 'lesson-pptx',
        }
      );
      results['lesson-pptx'] = { success: true, url: uploaded.publicUrl };
      console.log(`[SampleExport] Lesson PPTX uploaded: ${uploaded.publicUrl}`);
    } catch (error) {
      console.error('[SampleExport] Lesson PPTX error:', error);
      results['lesson-pptx'] = { success: false, error: String(error) };
    }

    // Summary
    const successCount = Object.values(results).filter(r => r.success).length;
    const totalCount = Object.keys(results).length;

    res.json({
      success: successCount === totalCount,
      message: `Generated ${successCount}/${totalCount} exports for ${sample.title}`,
      data: {
        sampleId: sample.id,
        sampleTitle: sample.title,
        exports: results,
      },
    });
  } catch (error) {
    console.error('Error generating sample exports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate sample exports',
      details: String(error),
    });
  }
});

/**
 * POST /api/teacher/samples/generate-all-exports
 * Generate exports for ALL samples (admin batch operation)
 * Requires admin secret in header: X-Admin-Secret
 */
router.post('/generate-all-exports', async (req: Request, res: Response) => {
  try {
    // Verify admin secret
    const adminSecret = req.headers['x-admin-secret'];
    if (adminSecret !== ADMIN_SECRET) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - invalid admin secret',
      });
    }

    const allSamples = SAMPLE_TEACHER_CONTENT;
    const allResults: Record<string, Record<string, { success: boolean; url?: string; error?: string }>> = {};

    console.log(`[SampleExport] Starting batch export for ${allSamples.length} samples...`);

    for (const sample of allSamples) {
      console.log(`\n[SampleExport] Processing: ${sample.id}`);

      const results: Record<string, { success: boolean; url?: string; error?: string }> = {};
      const teacherContent = sampleToTeacherContent(sample);

      const pdfOptions: ExportOptions = {
        format: 'pdf',
        includeAnswers: true,
        includeTeacherNotes: true,
        paperSize: 'letter',
        colorScheme: 'color',
      };

      const pptxOptions: PresentonExportOptions = {
        theme: 'professional-blue',
        slideStyle: 'focused',
        includeAnswers: true,
        includeTeacherNotes: true,
        includeInfographic: true,
        language: 'English',
      };

      // Generate all exports for this sample
      // 1. Lesson PDF
      try {
        const lessonPdf = await exportContent(teacherContent, pdfOptions);
        const uploaded = await uploadFile('aiContent', `samples/${sample.id}/${sample.id}-lesson.pdf`, lessonPdf.data, 'application/pdf');
        results['lesson-pdf'] = { success: true, url: uploaded.publicUrl };
      } catch (error) {
        results['lesson-pdf'] = { success: false, error: String(error) };
      }

      // 2. Quiz PDF
      try {
        const quizContent = { ...teacherContent, contentType: 'QUIZ' as TeacherContentType };
        const quizPdf = await exportContent(quizContent, pdfOptions);
        const uploaded = await uploadFile('aiContent', `samples/${sample.id}/${sample.id}-quiz.pdf`, quizPdf.data, 'application/pdf');
        results['quiz-pdf'] = { success: true, url: uploaded.publicUrl };
      } catch (error) {
        results['quiz-pdf'] = { success: false, error: String(error) };
      }

      // 3. Flashcards PDF
      try {
        const flashcardContent = { ...teacherContent, contentType: 'FLASHCARD_DECK' as TeacherContentType };
        const flashcardPdf = await exportContent(flashcardContent, pdfOptions);
        const uploaded = await uploadFile('aiContent', `samples/${sample.id}/${sample.id}-flashcards.pdf`, flashcardPdf.data, 'application/pdf');
        results['flashcards-pdf'] = { success: true, url: uploaded.publicUrl };
      } catch (error) {
        results['flashcards-pdf'] = { success: false, error: String(error) };
      }

      // 4. Lesson PPTX
      try {
        const lessonPptx = await generateLessonPPTX(teacherContent, pptxOptions);
        const uploaded = await uploadFile(
          'aiContent',
          `samples/${sample.id}/${sample.id}-lesson.pptx`,
          lessonPptx.data,
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        );
        results['lesson-pptx'] = { success: true, url: uploaded.publicUrl };
      } catch (error) {
        results['lesson-pptx'] = { success: false, error: String(error) };
      }

      allResults[sample.id] = results;

      // Small delay between samples to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Calculate totals
    let totalSuccess = 0;
    let totalFailed = 0;
    for (const sampleResults of Object.values(allResults)) {
      for (const result of Object.values(sampleResults)) {
        if (result.success) totalSuccess++;
        else totalFailed++;
      }
    }

    console.log(`\n[SampleExport] Batch complete: ${totalSuccess} success, ${totalFailed} failed`);

    res.json({
      success: totalFailed === 0,
      message: `Batch export complete: ${totalSuccess} success, ${totalFailed} failed`,
      data: {
        totalSamples: allSamples.length,
        totalExports: totalSuccess + totalFailed,
        successCount: totalSuccess,
        failedCount: totalFailed,
        results: allResults,
      },
    });
  } catch (error) {
    console.error('Error in batch sample export:', error);
    res.status(500).json({
      success: false,
      error: 'Batch export failed',
      details: String(error),
    });
  }
});

export default router;
