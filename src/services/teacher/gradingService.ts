// AI Writing Grading Service - Grade essays against rubrics with curriculum-aware feedback
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { prisma } from '../../config/database.js';
import {
  TokenOperation,
  GradingJob,
  GradingSubmission,
  GradingJobStatus,
  SubmissionStatus,
  Rubric,
  ScoringType,
  CurriculumType,
  Prisma,
} from '@prisma/client';
import { quotaService } from './quotaService.js';
import { rubricService, RubricCriterion } from './rubricService.js';
import {
  buildGradingSystemPrompt,
  buildGradingUserPrompt,
  parseGradingResponse,
  validateGradingResponse,
  estimateGradingTokens,
  GradingResponseSchema,
} from '../ai/gradingPromptBuilder.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export interface GradeSingleInput {
  rubricId: string;
  studentSubmission: string;
  studentIdentifier?: string;
  curriculumType?: CurriculumType;
}

export interface CreateBatchJobInput {
  rubricId: string;
  name: string;
  description?: string;
  submissions: Array<{
    studentIdentifier: string;
    text?: string;
    fileUrl?: string;
    fileName?: string;
  }>;
  curriculumType?: CurriculumType;
}

export interface OverrideInput {
  criteriaScores?: Record<string, { score: number; feedback: string }>;
  overallFeedback?: string;
  teacherNotes?: string;
}

export interface ExportOptions {
  format: 'csv' | 'json';
  includeOriginalText?: boolean;
  includeTeacherNotes?: boolean;
}

export interface GradingResult {
  submission: GradingSubmission;
  tokensUsed: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function calculateTotalScore(
  criteriaScores: GradingResponseSchema['criteriaScores'],
  criteria: RubricCriterion[],
  maxScore: number
): { totalScore: number; percentageScore: number } {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const score of criteriaScores) {
    const criterion = criteria.find(c => c.id === score.criterionId);
    if (criterion) {
      // Find the max score for this criterion
      const maxCriterionScore = Math.max(...criterion.levels.map(l => l.score));
      const normalizedScore = score.score / maxCriterionScore;
      weightedSum += normalizedScore * criterion.weight;
      totalWeight += criterion.weight;
    }
  }

  const percentageScore = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
  const totalScore = (percentageScore / 100) * maxScore;

  return {
    totalScore: Math.round(totalScore * 100) / 100,
    percentageScore: Math.round(percentageScore * 100) / 100,
  };
}

function calculateLetterGrade(percentageScore: number): string {
  if (percentageScore >= 90) return 'A';
  if (percentageScore >= 80) return 'B';
  if (percentageScore >= 70) return 'C';
  if (percentageScore >= 60) return 'D';
  return 'F';
}

// ============================================
// SERVICE
// ============================================

export const gradingService = {
  /**
   * Grade a single submission
   */
  async gradeSingle(
    teacherId: string,
    input: GradeSingleInput
  ): Promise<GradingResult> {
    // Get rubric
    const rubric = await rubricService.getById(input.rubricId, teacherId);
    if (!rubric) {
      throw new Error('Rubric not found');
    }

    const criteria = rubric.criteria as unknown as RubricCriterion[];
    const submissionLength = input.studentSubmission.length;

    // Estimate tokens and check quota
    const estimatedTokens = estimateGradingTokens(criteria, submissionLength);
    await quotaService.enforceQuota(teacherId, TokenOperation.GRADING_SINGLE, estimatedTokens);

    logger.info('Starting single submission grading', {
      teacherId,
      rubricId: input.rubricId,
      submissionLength,
      estimatedTokens,
    });

    // Create a grading job for single submission
    const job = await prisma.gradingJob.create({
      data: {
        teacherId,
        rubricId: input.rubricId,
        name: `Single Grade - ${new Date().toISOString()}`,
        status: 'PROCESSING',
        totalSubmissions: 1,
        startedAt: new Date(),
      },
    });

    // Create submission record
    const submission = await prisma.gradingSubmission.create({
      data: {
        gradingJobId: job.id,
        studentIdentifier: input.studentIdentifier || 'Anonymous',
        extractedText: input.studentSubmission,
        status: 'PENDING',
      },
    });

    try {
      // Build prompts
      const systemPrompt = buildGradingSystemPrompt({
        rubricName: rubric.name,
        rubricDescription: rubric.description || undefined,
        subject: rubric.subject || undefined,
        gradeLevel: rubric.gradeLevel || undefined,
        criteria,
        maxScore: rubric.maxScore,
        scoringType: rubric.scoringType,
        passingThreshold: rubric.passingThreshold || undefined,
        confidenceThreshold: rubric.confidenceThreshold,
        customInstructions: rubric.gradingPrompt || undefined,
        curriculumType: input.curriculumType,
        studentSubmission: input.studentSubmission,
      });

      const userPrompt = buildGradingUserPrompt({
        rubricName: rubric.name,
        rubricDescription: rubric.description || undefined,
        subject: rubric.subject || undefined,
        gradeLevel: rubric.gradeLevel || undefined,
        criteria,
        maxScore: rubric.maxScore,
        scoringType: rubric.scoringType,
        passingThreshold: rubric.passingThreshold || undefined,
        confidenceThreshold: rubric.confidenceThreshold,
        curriculumType: input.curriculumType,
        studentSubmission: input.studentSubmission,
        studentIdentifier: input.studentIdentifier,
      });

      // Call Gemini Pro for grading
      const model = genAI.getGenerativeModel({
        model: config.gemini.models.pro,
        safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
        generationConfig: {
          temperature: 0.3, // Lower for consistent grading
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        },
        systemInstruction: systemPrompt,
      });

      const result = await model.generateContent(userPrompt);
      const responseText = result.response.text();
      const tokensUsed = result.response.usageMetadata?.totalTokenCount || estimatedTokens;

      // Parse response
      const gradingResult = parseGradingResponse(responseText);
      if (!gradingResult) {
        throw new Error('Failed to parse AI grading response');
      }

      // Validate response
      const validation = validateGradingResponse(gradingResult, criteria);
      if (!validation.valid) {
        logger.warn('Grading response validation warnings', {
          submissionId: submission.id,
          errors: validation.errors,
        });
      }

      // Calculate scores
      const { totalScore, percentageScore } = calculateTotalScore(
        gradingResult.criteriaScores,
        criteria,
        rubric.maxScore
      );

      const letterGrade = rubric.scoringType === 'LETTER_GRADE'
        ? calculateLetterGrade(percentageScore)
        : undefined;

      // Determine if flagged for review
      const flagForReview = gradingResult.flagForReview ||
        gradingResult.confidenceScore < rubric.confidenceThreshold;

      // Update submission
      const updatedSubmission = await prisma.gradingSubmission.update({
        where: { id: submission.id },
        data: {
          status: flagForReview ? 'FLAGGED' : 'GRADED',
          criteriaScores: gradingResult.criteriaScores as unknown as object,
          totalScore,
          percentageScore,
          letterGrade,
          overallFeedback: gradingResult.overallFeedback,
          strengths: gradingResult.strengths,
          improvements: gradingResult.improvements,
          confidenceScore: gradingResult.confidenceScore,
          flaggedForReview: flagForReview,
          flagReason: gradingResult.flagReason || (flagForReview ? 'Low confidence score' : null),
          tokensUsed,
        },
      });

      // Update job
      await prisma.gradingJob.update({
        where: { id: job.id },
        data: {
          status: 'COMPLETED',
          gradedCount: 1,
          completedAt: new Date(),
          totalTokensUsed: tokensUsed,
        },
      });

      // Record token usage
      await quotaService.recordUsage({
        teacherId,
        operation: TokenOperation.GRADING_SINGLE,
        tokensUsed,
        modelUsed: config.gemini.models.pro,
        resourceType: 'grading_submission',
        resourceId: submission.id,
      });

      // Increment rubric usage
      await rubricService.incrementUsage(input.rubricId);

      logger.info('Single submission graded successfully', {
        teacherId,
        submissionId: updatedSubmission.id,
        totalScore,
        percentageScore,
        flagged: flagForReview,
        tokensUsed,
      });

      return {
        submission: updatedSubmission,
        tokensUsed,
      };
    } catch (error) {
      // Update submission and job with error
      await prisma.gradingSubmission.update({
        where: { id: submission.id },
        data: {
          status: 'ERROR',
          flaggedForReview: true,
          flagReason: error instanceof Error ? error.message : 'Grading failed',
        },
      });

      await prisma.gradingJob.update({
        where: { id: job.id },
        data: {
          status: 'FAILED',
          errorCount: 1,
          completedAt: new Date(),
          processingError: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  },

  /**
   * Create a batch grading job
   */
  async createBatchJob(
    teacherId: string,
    input: CreateBatchJobInput
  ): Promise<GradingJob> {
    // Validate rubric
    const rubric = await rubricService.getById(input.rubricId, teacherId);
    if (!rubric) {
      throw new Error('Rubric not found');
    }

    if (input.submissions.length === 0) {
      throw new Error('At least one submission is required');
    }

    if (input.submissions.length > 100) {
      throw new Error('Maximum 100 submissions per batch');
    }

    const criteria = rubric.criteria as unknown as RubricCriterion[];

    // Estimate total tokens for batch
    const avgSubmissionLength = input.submissions.reduce((sum, s) => {
      return sum + (s.text?.length || 1000);
    }, 0) / input.submissions.length;

    const tokensPerSubmission = estimateGradingTokens(criteria, avgSubmissionLength);
    const totalEstimatedTokens = tokensPerSubmission * input.submissions.length;

    // Check quota for entire batch
    await quotaService.enforceQuota(teacherId, TokenOperation.GRADING_BATCH, totalEstimatedTokens);

    logger.info('Creating batch grading job', {
      teacherId,
      rubricId: input.rubricId,
      submissionCount: input.submissions.length,
      totalEstimatedTokens,
    });

    // Create job
    const job = await prisma.gradingJob.create({
      data: {
        teacherId,
        rubricId: input.rubricId,
        name: input.name,
        description: input.description,
        status: 'PENDING',
        totalSubmissions: input.submissions.length,
      },
    });

    // Create submission records
    await prisma.gradingSubmission.createMany({
      data: input.submissions.map(sub => ({
        gradingJobId: job.id,
        studentIdentifier: sub.studentIdentifier,
        extractedText: sub.text,
        fileUrl: sub.fileUrl,
        fileName: sub.fileName,
        status: 'PENDING',
      })),
    });

    return job;
  },

  /**
   * Process a batch grading job (to be called by queue worker)
   */
  async processBatchJob(
    jobId: string,
    curriculumType?: CurriculumType
  ): Promise<void> {
    const job = await prisma.gradingJob.findUnique({
      where: { id: jobId },
      include: {
        rubric: true,
        submissions: {
          where: { status: 'PENDING' },
        },
      },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    if (job.status !== 'PENDING' && job.status !== 'PROCESSING') {
      throw new Error(`Job cannot be processed: status is ${job.status}`);
    }

    const rubric = job.rubric;
    const criteria = rubric.criteria as unknown as RubricCriterion[];
    const teacherId = job.teacherId;

    // Update job status
    await prisma.gradingJob.update({
      where: { id: jobId },
      data: {
        status: 'PROCESSING',
        startedAt: job.startedAt || new Date(),
      },
    });

    let gradedCount = job.gradedCount;
    let errorCount = job.errorCount;
    let totalTokensUsed = job.totalTokensUsed;

    // Process each pending submission
    for (const submission of job.submissions) {
      if (!submission.extractedText) {
        // Skip submissions without text (would need OCR/file processing)
        await prisma.gradingSubmission.update({
          where: { id: submission.id },
          data: {
            status: 'FLAGGED',
            flaggedForReview: true,
            flagReason: 'No text content available',
          },
        });
        errorCount++;
        continue;
      }

      try {
        // Build prompts
        const systemPrompt = buildGradingSystemPrompt({
          rubricName: rubric.name,
          rubricDescription: rubric.description || undefined,
          subject: rubric.subject || undefined,
          gradeLevel: rubric.gradeLevel || undefined,
          criteria,
          maxScore: rubric.maxScore,
          scoringType: rubric.scoringType,
          passingThreshold: rubric.passingThreshold || undefined,
          confidenceThreshold: rubric.confidenceThreshold,
          customInstructions: rubric.gradingPrompt || undefined,
          curriculumType,
          studentSubmission: submission.extractedText,
        });

        const userPrompt = buildGradingUserPrompt({
          rubricName: rubric.name,
          rubricDescription: rubric.description || undefined,
          subject: rubric.subject || undefined,
          gradeLevel: rubric.gradeLevel || undefined,
          criteria,
          maxScore: rubric.maxScore,
          scoringType: rubric.scoringType,
          passingThreshold: rubric.passingThreshold || undefined,
          confidenceThreshold: rubric.confidenceThreshold,
          curriculumType,
          studentSubmission: submission.extractedText,
          studentIdentifier: submission.studentIdentifier,
        });

        // Call Gemini Pro
        const model = genAI.getGenerativeModel({
          model: config.gemini.models.pro,
          safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
          },
          systemInstruction: systemPrompt,
        });

        const result = await model.generateContent(userPrompt);
        const responseText = result.response.text();
        const tokensUsed = result.response.usageMetadata?.totalTokenCount || 4000;

        // Parse and validate response
        const gradingResult = parseGradingResponse(responseText);
        if (!gradingResult) {
          throw new Error('Failed to parse grading response');
        }

        // Calculate scores
        const { totalScore, percentageScore } = calculateTotalScore(
          gradingResult.criteriaScores,
          criteria,
          rubric.maxScore
        );

        const letterGrade = rubric.scoringType === 'LETTER_GRADE'
          ? calculateLetterGrade(percentageScore)
          : undefined;

        const flagForReview = gradingResult.flagForReview ||
          gradingResult.confidenceScore < rubric.confidenceThreshold;

        // Update submission
        await prisma.gradingSubmission.update({
          where: { id: submission.id },
          data: {
            status: flagForReview ? 'FLAGGED' : 'GRADED',
            criteriaScores: gradingResult.criteriaScores as unknown as object,
            totalScore,
            percentageScore,
            letterGrade,
            overallFeedback: gradingResult.overallFeedback,
            strengths: gradingResult.strengths,
            improvements: gradingResult.improvements,
            confidenceScore: gradingResult.confidenceScore,
            flaggedForReview: flagForReview,
            flagReason: gradingResult.flagReason,
            tokensUsed,
          },
        });

        gradedCount++;
        totalTokensUsed += tokensUsed;

        // Record token usage
        await quotaService.recordUsage({
          teacherId,
          operation: TokenOperation.GRADING_BATCH,
          tokensUsed,
          modelUsed: config.gemini.models.pro,
          resourceType: 'grading_submission',
          resourceId: submission.id,
        });

        // Update job progress
        await prisma.gradingJob.update({
          where: { id: jobId },
          data: {
            gradedCount,
            totalTokensUsed,
          },
        });
      } catch (error) {
        logger.error('Failed to grade submission', {
          submissionId: submission.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        await prisma.gradingSubmission.update({
          where: { id: submission.id },
          data: {
            status: 'FLAGGED',
            flaggedForReview: true,
            flagReason: error instanceof Error ? error.message : 'Grading failed',
          },
        });

        errorCount++;
      }
    }

    // Determine final status
    let finalStatus: GradingJobStatus = 'COMPLETED';
    if (errorCount === job.totalSubmissions) {
      finalStatus = 'FAILED';
    } else if (errorCount > 0) {
      finalStatus = 'PARTIALLY_COMPLETED';
    }

    // Update job completion
    await prisma.gradingJob.update({
      where: { id: jobId },
      data: {
        status: finalStatus,
        gradedCount,
        errorCount,
        totalTokensUsed,
        completedAt: new Date(),
      },
    });

    // Increment rubric usage
    await rubricService.incrementUsage(rubric.id);

    logger.info('Batch grading job completed', {
      jobId,
      gradedCount,
      errorCount,
      totalTokensUsed,
      status: finalStatus,
    });
  },

  /**
   * Get job status with submissions
   */
  async getJobStatus(
    jobId: string,
    teacherId: string
  ): Promise<{
    job: GradingJob;
    submissions: GradingSubmission[];
    progress: { completed: number; total: number; percentage: number };
  } | null> {
    const job = await prisma.gradingJob.findFirst({
      where: { id: jobId, teacherId },
      include: {
        submissions: {
          orderBy: { createdAt: 'asc' },
        },
        rubric: {
          select: {
            id: true,
            name: true,
            subject: true,
            gradeLevel: true,
            maxScore: true,
            scoringType: true,
            criteria: true,
          },
        },
      },
    });

    if (!job) return null;

    const completed = job.gradedCount + job.errorCount;
    const progress = {
      completed,
      total: job.totalSubmissions,
      percentage: job.totalSubmissions > 0 ? Math.round((completed / job.totalSubmissions) * 100) : 0,
    };

    return {
      job,
      submissions: job.submissions,
      progress,
    };
  },

  /**
   * Get a single submission
   */
  async getSubmission(
    submissionId: string,
    teacherId: string
  ): Promise<GradingSubmission | null> {
    const submission = await prisma.gradingSubmission.findFirst({
      where: {
        id: submissionId,
        gradingJob: { teacherId },
      },
      include: {
        gradingJob: {
          include: {
            rubric: true,
          },
        },
      },
    });

    return submission;
  },

  /**
   * Apply teacher override to a submission
   */
  async applyOverride(
    submissionId: string,
    teacherId: string,
    override: OverrideInput
  ): Promise<GradingSubmission> {
    const submission = await prisma.gradingSubmission.findFirst({
      where: {
        id: submissionId,
        gradingJob: { teacherId },
      },
      include: {
        gradingJob: {
          include: { rubric: true },
        },
      },
    });

    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.finalizedAt) {
      throw new Error('Cannot modify finalized submission');
    }

    const updateData: Record<string, unknown> = {
      teacherReviewed: true,
    };

    if (override.criteriaScores) {
      updateData.teacherOverride = override.criteriaScores as unknown as object;

      // Recalculate total score with overrides
      const rubric = submission.gradingJob.rubric;
      const criteria = rubric.criteria as unknown as RubricCriterion[];
      const originalScores = submission.criteriaScores as unknown as GradingResponseSchema['criteriaScores'];

      // Merge original with overrides
      const mergedScores = originalScores.map(score => {
        const overrideScore = override.criteriaScores![score.criterionId];
        if (overrideScore) {
          return {
            ...score,
            score: overrideScore.score,
            feedback: overrideScore.feedback,
          };
        }
        return score;
      });

      const { totalScore, percentageScore } = calculateTotalScore(
        mergedScores,
        criteria,
        rubric.maxScore
      );

      updateData.totalScore = totalScore;
      updateData.percentageScore = percentageScore;

      if (rubric.scoringType === 'LETTER_GRADE') {
        updateData.letterGrade = calculateLetterGrade(percentageScore);
      }
    }

    if (override.overallFeedback !== undefined) {
      updateData.overallFeedback = override.overallFeedback;
    }

    if (override.teacherNotes !== undefined) {
      updateData.teacherNotes = override.teacherNotes;
    }

    return prisma.gradingSubmission.update({
      where: { id: submissionId },
      data: updateData,
    });
  },

  /**
   * Finalize a submission (lock it from further edits)
   */
  async finalizeSubmission(
    submissionId: string,
    teacherId: string
  ): Promise<GradingSubmission> {
    const submission = await prisma.gradingSubmission.findFirst({
      where: {
        id: submissionId,
        gradingJob: { teacherId },
      },
    });

    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.finalizedAt) {
      throw new Error('Submission is already finalized');
    }

    return prisma.gradingSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'FINALIZED',
        finalizedAt: new Date(),
      },
    });
  },

  /**
   * Bulk finalize all submissions in a job
   */
  async finalizeJob(
    jobId: string,
    teacherId: string
  ): Promise<{ count: number }> {
    const job = await prisma.gradingJob.findFirst({
      where: { id: jobId, teacherId },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const result = await prisma.gradingSubmission.updateMany({
      where: {
        gradingJobId: jobId,
        finalizedAt: null,
        status: { in: ['GRADED', 'REVIEWED'] },
      },
      data: {
        status: 'FINALIZED',
        finalizedAt: new Date(),
      },
    });

    return { count: result.count };
  },

  /**
   * Export grading results
   */
  async exportResults(
    jobId: string,
    teacherId: string,
    options: ExportOptions
  ): Promise<{ data: string; filename: string; mimeType: string }> {
    const job = await prisma.gradingJob.findFirst({
      where: { id: jobId, teacherId },
      include: {
        rubric: true,
        submissions: {
          orderBy: { studentIdentifier: 'asc' },
        },
      },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const rubric = job.rubric;
    const criteria = rubric.criteria as unknown as RubricCriterion[];

    if (options.format === 'csv') {
      // Build CSV
      const headers = [
        'Student',
        'Status',
        'Total Score',
        'Percentage',
        rubric.scoringType === 'LETTER_GRADE' ? 'Letter Grade' : null,
        ...criteria.map(c => `${c.name} Score`),
        ...criteria.map(c => `${c.name} Feedback`),
        'Overall Feedback',
        'Strengths',
        'Areas for Improvement',
        'Confidence',
        'Flagged',
        options.includeTeacherNotes ? 'Teacher Notes' : null,
      ].filter(Boolean);

      const rows = job.submissions.map(sub => {
        const criteriaScores = sub.criteriaScores as unknown as GradingResponseSchema['criteriaScores'] || [];
        const scoreMap = new Map(criteriaScores.map(s => [s.criterionId, s]));

        const row = [
          sub.studentIdentifier,
          sub.status,
          sub.totalScore?.toString() || '',
          sub.percentageScore ? `${sub.percentageScore}%` : '',
          rubric.scoringType === 'LETTER_GRADE' ? (sub.letterGrade || '') : null,
          ...criteria.map(c => scoreMap.get(c.id)?.score?.toString() || ''),
          ...criteria.map(c => `"${(scoreMap.get(c.id)?.feedback || '').replace(/"/g, '""')}"`),
          `"${(sub.overallFeedback || '').replace(/"/g, '""')}"`,
          `"${(sub.strengths || []).join('; ').replace(/"/g, '""')}"`,
          `"${(sub.improvements || []).join('; ').replace(/"/g, '""')}"`,
          sub.confidenceScore?.toFixed(2) || '',
          sub.flaggedForReview ? 'Yes' : 'No',
          options.includeTeacherNotes ? `"${(sub.teacherNotes || '').replace(/"/g, '""')}"` : null,
        ].filter(v => v !== null);

        return row.join(',');
      });

      const csv = [headers.join(','), ...rows].join('\n');
      const filename = `grading-${job.name.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.csv`;

      return {
        data: csv,
        filename,
        mimeType: 'text/csv',
      };
    } else {
      // JSON export
      const data = {
        job: {
          id: job.id,
          name: job.name,
          rubric: rubric.name,
          subject: rubric.subject,
          gradeLevel: rubric.gradeLevel,
          maxScore: rubric.maxScore,
          scoringType: rubric.scoringType,
          completedAt: job.completedAt,
        },
        criteria: criteria.map(c => ({
          id: c.id,
          name: c.name,
          weight: c.weight,
        })),
        submissions: job.submissions.map(sub => ({
          studentIdentifier: sub.studentIdentifier,
          status: sub.status,
          totalScore: sub.totalScore,
          percentageScore: sub.percentageScore,
          letterGrade: sub.letterGrade,
          criteriaScores: sub.criteriaScores,
          overallFeedback: sub.overallFeedback,
          strengths: sub.strengths,
          improvements: sub.improvements,
          confidenceScore: sub.confidenceScore,
          flaggedForReview: sub.flaggedForReview,
          flagReason: sub.flagReason,
          teacherReviewed: sub.teacherReviewed,
          teacherOverride: sub.teacherOverride,
          teacherNotes: options.includeTeacherNotes ? sub.teacherNotes : undefined,
          originalText: options.includeOriginalText ? sub.extractedText : undefined,
        })),
      };

      const filename = `grading-${job.name.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.json`;

      return {
        data: JSON.stringify(data, null, 2),
        filename,
        mimeType: 'application/json',
      };
    }
  },

  /**
   * Estimate tokens for a grading operation
   */
  estimateTokens(
    rubricId: string,
    teacherId: string,
    contentLength: number
  ): Promise<number> {
    return rubricService.getById(rubricId, teacherId).then(rubric => {
      if (!rubric) {
        throw new Error('Rubric not found');
      }
      const criteria = rubric.criteria as unknown as RubricCriterion[];
      return estimateGradingTokens(criteria, contentLength);
    });
  },

  /**
   * Regenerate grading for a submission
   */
  async regenerateSubmission(
    submissionId: string,
    teacherId: string,
    curriculumType?: CurriculumType
  ): Promise<GradingResult> {
    const submission = await prisma.gradingSubmission.findFirst({
      where: {
        id: submissionId,
        gradingJob: { teacherId },
      },
      include: {
        gradingJob: true,
      },
    });

    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.finalizedAt) {
      throw new Error('Cannot regenerate finalized submission');
    }

    if (!submission.extractedText) {
      throw new Error('No text content to grade');
    }

    // Reset submission status
    await prisma.gradingSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'PENDING',
        criteriaScores: Prisma.JsonNull,
        totalScore: null,
        percentageScore: null,
        letterGrade: null,
        overallFeedback: null,
        strengths: [],
        improvements: [],
        confidenceScore: null,
        flaggedForReview: false,
        flagReason: null,
        teacherReviewed: false,
        teacherOverride: Prisma.JsonNull,
      },
    });

    // Grade again
    return this.gradeSingle(teacherId, {
      rubricId: submission.gradingJob.rubricId,
      studentSubmission: submission.extractedText,
      studentIdentifier: submission.studentIdentifier,
      curriculumType,
    });
  },

  /**
   * List grading jobs for a teacher
   */
  async listJobs(
    teacherId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: GradingJobStatus;
    } = {}
  ): Promise<{ jobs: GradingJob[]; total: number }> {
    const { limit = 20, offset = 0, status } = options;

    const where: { teacherId: string; status?: GradingJobStatus } = { teacherId };
    if (status) {
      where.status = status;
    }

    const [jobs, total] = await Promise.all([
      prisma.gradingJob.findMany({
        where,
        include: {
          rubric: {
            select: {
              id: true,
              name: true,
              subject: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.gradingJob.count({ where }),
    ]);

    return { jobs, total };
  },
};

export default gradingService;
