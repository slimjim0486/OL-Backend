/**
 * Sample Content Routes
 *
 * Public endpoints for viewing sample teacher content.
 * No authentication required - samples are free for everyone to explore.
 */

import { Router, Request, Response } from 'express';
import { SAMPLE_TEACHER_CONTENT, getSampleById, getAllSampleSummaries } from '../../data/sampleTeacherContent.js';

const router = Router();

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

export default router;
