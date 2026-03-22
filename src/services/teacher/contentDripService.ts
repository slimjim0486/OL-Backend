import {
  DripStatus,
  ExportFormat,
  ExportStatus,
  Prisma,
  Subject,
  TeacherContent,
  TeacherContentType,
  TokenOperation,
} from '@prisma/client';
import { prisma } from '../../config/database.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { uploadFile } from '../storage/storageService.js';
import { emailService } from '../email/emailService.js';
import { contentGenerationService } from './contentGenerationService.js';
import { contentService } from './contentService.js';
import { exportContent } from './exportService.js';
import { generateLessonPPTX, type PresentonExportOptions } from './presentonService.js';

type DripStepName =
  | 'drip_day0_lesson_pdf'
  | 'drip_day0_lesson_pptx'
  | 'drip_day1_quiz'
  | 'drip_day2_flashcards'
  | 'drip_day3_worksheet';

type EnrollmentWithTeacher = Prisma.ContentDripEnrollmentGetPayload<{
  include: {
    teacher: {
      select: {
        id: true;
        email: true;
        firstName: true;
      };
    };
  };
}>;

interface DripStepDefinition {
  name: DripStepName;
  index: number;
  kind: 'lesson_pdf' | 'lesson_pptx' | 'quiz' | 'flashcards' | 'worksheet';
  delayHoursAfterPrevious: number;
}

interface DeliveryResult {
  contentId?: string;
  triggerMetadata?: Record<string, unknown>;
}

interface ProcessStepResult {
  success: boolean;
  enrollmentId: string;
  processedSteps: string[];
  skippedSteps: string[];
  error?: string;
}

const DRIP_STEPS: DripStepDefinition[] = [
  { name: 'drip_day0_lesson_pdf', index: 0, kind: 'lesson_pdf', delayHoursAfterPrevious: 0 },
  { name: 'drip_day0_lesson_pptx', index: 1, kind: 'lesson_pptx', delayHoursAfterPrevious: 0 },
  { name: 'drip_day1_quiz', index: 2, kind: 'quiz', delayHoursAfterPrevious: 24 },
  { name: 'drip_day2_flashcards', index: 3, kind: 'flashcards', delayHoursAfterPrevious: 24 },
  { name: 'drip_day3_worksheet', index: 4, kind: 'worksheet', delayHoursAfterPrevious: 24 },
];

const FAILURE_RETRY_MS = 4 * 60 * 60 * 1000;
const MAX_STEPS_PER_RUN = 5;

const PRESENTON_OPTIONS: PresentonExportOptions = {
  theme: 'professional-blue',
  slideStyle: 'focused',
  includeAnswers: true,
  includeTeacherNotes: true,
  includeInfographic: false,
  language: 'English',
};

function getMonthKey(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${now.getUTCMonth()}`;
}

function sanitizeFileComponent(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'content';
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function formatSubjectLabel(subject: string): string {
  return subject
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function toSubject(subject?: string | null): Subject | undefined {
  if (!subject) return undefined;
  return Object.values(Subject).includes(subject as Subject)
    ? (subject as Subject)
    : undefined;
}

function parseGradeBucket(gradeLevel?: string | null): 'early' | 'upper_elementary' | 'middle' | 'high' {
  const raw = String(gradeLevel || '').toLowerCase();
  if (!raw) return 'upper_elementary';
  if (raw.includes('k')) return 'early';

  const matches = raw.match(/\d+/g) || [];
  const nums = matches.map((value) => Number.parseInt(value, 10)).filter((value) => Number.isFinite(value));
  const grade = nums.length ? Math.max(...nums) : null;

  if (grade === null) return 'upper_elementary';
  if (grade <= 2) return 'early';
  if (grade <= 5) return 'upper_elementary';
  if (grade <= 8) return 'middle';
  return 'high';
}

function getDefaultTopic(subject: string, gradeLevel: string): string {
  const bucket = parseGradeBucket(gradeLevel);
  const key = subject || 'OTHER';

  const defaults: Record<string, Record<string, string>> = {
    MATH: {
      early: 'Counting and number sense',
      upper_elementary: 'Fractions',
      middle: 'Ratios and proportions',
      high: 'Linear functions',
    },
    SCIENCE: {
      early: 'Living things and their needs',
      upper_elementary: 'Ecosystems',
      middle: 'Cells and body systems',
      high: 'Forces and motion',
    },
    ENGLISH: {
      early: 'Story elements',
      upper_elementary: 'Main idea and supporting details',
      middle: 'Text evidence and inference',
      high: 'Argument writing',
    },
    READING: {
      early: 'Story retelling',
      upper_elementary: 'Main idea and vocabulary',
      middle: 'Theme and evidence',
      high: 'Close reading strategies',
    },
    SOCIAL_STUDIES: {
      early: 'Communities and citizenship',
      upper_elementary: 'Regions and cultures',
      middle: 'Ancient civilizations',
      high: 'Civic systems and government',
    },
    HISTORY: {
      early: 'Important people in our community',
      upper_elementary: 'Local history and timelines',
      middle: 'Ancient civilizations',
      high: 'Historical causation',
    },
    GEOGRAPHY: {
      early: 'Maps and landforms',
      upper_elementary: 'Regions and resources',
      middle: 'Human geography',
      high: 'Population and migration',
    },
    COMPUTER_SCIENCE: {
      early: 'Algorithms and sequencing',
      upper_elementary: 'Patterns and problem solving',
      middle: 'Programming logic',
      high: 'Data and systems design',
    },
  };

  const fallback = {
    early: 'Foundational skills practice',
    upper_elementary: 'Core concept review',
    middle: 'Concept application',
    high: 'Standards-aligned practice',
  };

  return defaults[key]?.[bucket] || fallback[bucket];
}

function buildSourceMaterialText(enrollment: {
  primarySubject: string;
  gradeLevel: string;
  curriculumType: string | null;
  currentTopic: string;
  upNextTopic: string | null;
}, topic: string): string {
  const parts = [
    `Subject: ${formatSubjectLabel(enrollment.primarySubject)}`,
    `Grade Level: ${enrollment.gradeLevel}`,
    enrollment.curriculumType ? `Curriculum: ${enrollment.curriculumType}` : '',
    `Current Teaching Topic: ${enrollment.currentTopic}`,
    enrollment.upNextTopic ? `Up Next Topic: ${enrollment.upNextTopic}` : '',
    `Focus Topic: ${topic}`,
    'Create classroom-ready material a teacher can use immediately.',
  ];

  return parts.filter(Boolean).join('\n');
}

function buildTeacherName(firstName?: string | null): string {
  return firstName?.trim() || 'there';
}

function buildNextDeliveryAt(nextStepIndex: number, from: Date): Date {
  const nextStep = DRIP_STEPS[nextStepIndex];
  if (!nextStep) return from;
  return addHours(from, nextStep.delayHoursAfterPrevious);
}

function isPresentonGenerationError(error: unknown): boolean {
  const message = String((error as any)?.message || error || '').toLowerCase();
  return (
    message.includes('presenton') ||
    message.includes('pptx') ||
    message.includes('presentation') ||
    message.includes('api key') ||
    message.includes('rate limit') ||
    message.includes('temporarily unavailable')
  );
}

async function hasLifetimeTrigger(teacherId: string, triggerName: string): Promise<boolean> {
  const existing = await prisma.teacherTriggerLog.findFirst({
    where: {
      teacherId,
      triggerName,
    },
    select: { id: true },
  });

  return Boolean(existing);
}

async function recordTrigger(
  teacherId: string,
  triggerName: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await prisma.teacherTriggerLog.create({
    data: {
      teacherId,
      triggerName,
      monthKey: getMonthKey(),
      metadata: (metadata as Prisma.InputJsonValue | undefined) ?? undefined,
    },
  });
}

async function createCompletedPdfExport(
  teacherId: string,
  content: TeacherContent,
  stepName: DripStepName
): Promise<{ exportId: string; downloadUrl: string; filename: string }> {
  const result = await exportContent(content, {
    format: 'pdf',
    includeAnswers: true,
    includeTeacherNotes: true,
  });

  if (typeof result.data === 'string') {
    throw new Error('Expected PDF export to return a binary buffer');
  }

  const extension = result.filename.split('.').pop() || 'pdf';
  const r2Key = `teacher/${teacherId}/drip/${stepName}-${sanitizeFileComponent(content.title)}.${extension}`;
  const stored = await uploadFile('aiContent', r2Key, result.data, result.mimeType, {
    'teacher-id': teacherId,
    'content-id': content.id,
    'step-name': stepName,
  });

  const exportRecord = await prisma.teacherExport.create({
    data: {
      teacherId,
      contentId: content.id,
      contentTitle: content.title,
      format: ExportFormat.PDF,
      filename: result.filename,
      fileSize: result.data.length,
      r2Key,
      r2Url: stored.publicUrl,
      status: ExportStatus.COMPLETED,
      completedAt: new Date(),
    },
  });

  return {
    exportId: exportRecord.id,
    downloadUrl: stored.publicUrl,
    filename: result.filename,
  };
}

async function createCompletedPptxExport(
  teacherId: string,
  content: TeacherContent,
  stepName: DripStepName
): Promise<{ exportId: string; downloadUrl: string; filename: string }> {
  const result = await generateLessonPPTX(content, PRESENTON_OPTIONS);
  const r2Key = `teacher/${teacherId}/drip/${stepName}-${sanitizeFileComponent(content.title)}.pptx`;
  const mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  const stored = await uploadFile('aiContent', r2Key, result.data, mimeType, {
    'teacher-id': teacherId,
    'content-id': content.id,
    'step-name': stepName,
  });

  const exportRecord = await prisma.teacherExport.create({
    data: {
      teacherId,
      contentId: content.id,
      contentTitle: content.title,
      format: ExportFormat.PPTX,
      filename: result.filename,
      fileSize: result.data.length,
      r2Key,
      r2Url: stored.publicUrl,
      status: ExportStatus.COMPLETED,
      completedAt: new Date(),
    },
  });

  return {
    exportId: exportRecord.id,
    downloadUrl: stored.publicUrl,
    filename: result.filename,
  };
}

async function markExportEmailStatus(exportId: string, sent: boolean): Promise<void> {
  if (!sent) return;

  await prisma.teacherExport.update({
    where: { id: exportId },
    data: {
      emailSent: true,
      emailSentAt: new Date(),
    },
  });
}

async function createGeneratedContent(params: {
  teacherId: string;
  title: string;
  description: string;
  subject?: Subject;
  gradeLevel: string;
  contentType: TeacherContentType;
  lessonContent?: Record<string, unknown>;
  quizContent?: Record<string, unknown>;
  flashcardContent?: Record<string, unknown>;
  tokensUsed: number;
  modelUsed: string;
  operation: TokenOperation;
}): Promise<TeacherContent> {
  const content = await contentService.createContent(params.teacherId, {
    title: params.title,
    description: params.description,
    subject: params.subject,
    gradeLevel: params.gradeLevel,
    contentType: params.contentType,
    lessonContent: params.lessonContent,
    quizContent: params.quizContent,
    flashcardContent: params.flashcardContent,
  });

  await contentService.recordAIUsage(
    content.id,
    params.teacherId,
    params.tokensUsed,
    params.modelUsed,
    params.operation,
    { recordQuota: false }
  );

  return content;
}

async function sendDripEmailAndRecord(params: {
  enrollment: EnrollmentWithTeacher;
  stepName: DripStepName;
  topic: string;
  subject: string;
  gradeLevel: string;
  contentTitle: string;
  downloadUrl: string;
  exportId: string;
  contentId?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const emailSent = await emailService.sendDripContentEmail(
    params.enrollment.teacher.email,
    buildTeacherName(params.enrollment.teacher.firstName),
    params.stepName,
    params.topic,
    params.subject,
    params.gradeLevel,
    params.contentTitle,
    params.downloadUrl
  );

  await markExportEmailStatus(params.exportId, emailSent);
  await recordTrigger(params.enrollment.teacherId, params.stepName, {
    ...params.metadata,
    contentId: params.contentId,
    exportId: params.exportId,
    emailSent,
  });
}

async function buildEnrollmentSnapshot(teacherId: string): Promise<{
  primarySubject: string;
  gradeLevel: string;
  curriculumType: string | null;
  currentTopic: string;
  upNextTopic: string | null;
  teacherEmail: string;
} | null> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      email: true,
      primarySubject: true,
      preferredCurriculum: true,
      preferredGradeRange: true,
      agentProfile: {
        select: {
          onboardingComplete: true,
          curriculumType: true,
          subjectsTaught: true,
          gradesTaught: true,
          classrooms: {
            where: { isActive: true },
            select: {
              gradeLevel: true,
              subject: true,
            },
            take: 3,
          },
          curriculumStates: {
            select: {
              subject: true,
              gradeLevel: true,
              topicProgress: true,
              updatedAt: true,
            },
            orderBy: { updatedAt: 'desc' },
            take: 10,
          },
        },
      },
    },
  });

  if (!teacher) return null;

  const fallbackSubject =
    teacher.primarySubject ||
    teacher.agentProfile?.subjectsTaught?.[0] ||
    teacher.agentProfile?.curriculumStates?.[0]?.subject ||
    teacher.agentProfile?.classrooms?.find((room) => room.subject)?.subject ||
    Subject.OTHER;

  const fallbackGrade =
    teacher.agentProfile?.classrooms?.find((room) => room.gradeLevel)?.gradeLevel ||
    teacher.agentProfile?.curriculumStates?.find((state) => state.gradeLevel)?.gradeLevel ||
    teacher.preferredGradeRange ||
    teacher.agentProfile?.gradesTaught?.[0] ||
    '3-5';

  const subjectKey = String(fallbackSubject);
  const matchingState = teacher.agentProfile?.curriculumStates?.find((state) => state.subject === fallbackSubject)
    || teacher.agentProfile?.curriculumStates?.[0];
  const topicProgress = (matchingState?.topicProgress || {}) as Record<string, unknown>;
  const currentTopic =
    typeof topicProgress.currentTopic === 'string' && topicProgress.currentTopic.trim()
      ? topicProgress.currentTopic.trim()
      : getDefaultTopic(subjectKey, fallbackGrade);

  const upNextTopic =
    Array.isArray(topicProgress.upNextTopics) && topicProgress.upNextTopics.length > 0
      ? String(topicProgress.upNextTopics[0] || '').trim() || null
      : null;

  return {
    primarySubject: subjectKey,
    gradeLevel: fallbackGrade,
    curriculumType: teacher.agentProfile?.curriculumType?.toString() || teacher.preferredCurriculum?.toString() || null,
    currentTopic,
    upNextTopic,
    teacherEmail: teacher.email,
  };
}

async function queueEnrollmentIfDue(enrollmentId: string, teacherId: string, step: number): Promise<void> {
  try {
    const { isContentDripJobInitialized, queueDripStep } = await import('../../jobs/contentDripJob.js');
    if (!isContentDripJobInitialized()) {
      logger.warn('Content drip queue is not initialized; immediate drip delivery not queued', {
        enrollmentId,
        teacherId,
        step,
      });
      return;
    }

    await queueDripStep({ enrollmentId, teacherId, step });
  } catch (error) {
    logger.warn('Failed to queue immediate drip step', {
      enrollmentId,
      teacherId,
      step,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function deliverLessonPdf(enrollment: EnrollmentWithTeacher): Promise<DeliveryResult> {
  const subject = toSubject(enrollment.primarySubject);
  const lesson = await contentGenerationService.generateLesson(enrollment.teacherId, {
    topic: enrollment.currentTopic,
    subject,
    gradeLevel: enrollment.gradeLevel,
    curriculum: enrollment.curriculumType || undefined,
    lessonType: 'full',
    includeActivities: true,
    includeAssessment: true,
    additionalContext: 'This is the first free drip lesson. Make it practical, complete, and ready for classroom use.',
    skipQuota: true,
  });

  const modelUsed = lesson.modelUsed === 'pro' ? config.gemini.models.pro : config.gemini.models.flash;
  const title = `${enrollment.currentTopic} Lesson Plan`;
  const content = await createGeneratedContent({
    teacherId: enrollment.teacherId,
    title,
    description: `Free drip lesson plan for ${enrollment.currentTopic}.`,
    subject,
    gradeLevel: enrollment.gradeLevel,
    contentType: TeacherContentType.LESSON,
    lessonContent: lesson as unknown as Record<string, unknown>,
    tokensUsed: lesson.tokensUsed,
    modelUsed,
    operation: TokenOperation.LESSON_GENERATION,
  });

  const exportResult = await createCompletedPdfExport(enrollment.teacherId, content, 'drip_day0_lesson_pdf');
  await sendDripEmailAndRecord({
    enrollment,
    stepName: 'drip_day0_lesson_pdf',
    topic: enrollment.currentTopic,
    subject: formatSubjectLabel(enrollment.primarySubject),
    gradeLevel: enrollment.gradeLevel,
    contentTitle: content.title,
    downloadUrl: exportResult.downloadUrl,
    exportId: exportResult.exportId,
    contentId: content.id,
  });

  return {
    contentId: content.id,
    triggerMetadata: { exportId: exportResult.exportId },
  };
}

async function deliverLessonPptx(enrollment: EnrollmentWithTeacher): Promise<DeliveryResult> {
  const subject = toSubject(enrollment.primarySubject);
  const lesson = await contentGenerationService.generateLesson(enrollment.teacherId, {
    topic: enrollment.currentTopic,
    subject,
    gradeLevel: enrollment.gradeLevel,
    curriculum: enrollment.curriculumType || undefined,
    lessonType: 'full',
    includeActivities: true,
    includeAssessment: false,
    additionalContext: 'This is the second free drip lesson for the same topic. Make it meaningfully different from the first lesson and optimized for teaching with slides.',
    skipQuota: true,
  });

  const modelUsed = lesson.modelUsed === 'pro' ? config.gemini.models.pro : config.gemini.models.flash;
  const title = `${enrollment.currentTopic} Presentation Lesson`;
  const content = await createGeneratedContent({
    teacherId: enrollment.teacherId,
    title,
    description: `Free drip presentation lesson for ${enrollment.currentTopic}.`,
    subject,
    gradeLevel: enrollment.gradeLevel,
    contentType: TeacherContentType.LESSON,
    lessonContent: lesson as unknown as Record<string, unknown>,
    tokensUsed: lesson.tokensUsed,
    modelUsed,
    operation: TokenOperation.LESSON_GENERATION,
  });

  try {
    const exportResult = await createCompletedPptxExport(enrollment.teacherId, content, 'drip_day0_lesson_pptx');
    await sendDripEmailAndRecord({
      enrollment,
      stepName: 'drip_day0_lesson_pptx',
      topic: enrollment.currentTopic,
      subject: formatSubjectLabel(enrollment.primarySubject),
      gradeLevel: enrollment.gradeLevel,
      contentTitle: content.title,
      downloadUrl: exportResult.downloadUrl,
      exportId: exportResult.exportId,
      contentId: content.id,
    });

    return {
      contentId: content.id,
      triggerMetadata: { exportId: exportResult.exportId },
    };
  } catch (error) {
    if (!isPresentonGenerationError(error)) {
      throw error;
    }

    logger.warn('Presenton unavailable for drip PPTX step; advancing without email', {
      teacherId: enrollment.teacherId,
      enrollmentId: enrollment.id,
      error: error instanceof Error ? error.message : String(error),
    });

    await recordTrigger(enrollment.teacherId, 'drip_day0_lesson_pptx', {
      contentId: content.id,
      skipped: true,
      reason: 'presenton_unavailable',
    });

    return {
      contentId: content.id,
      triggerMetadata: {
        skipped: true,
        reason: 'presenton_unavailable',
      },
    };
  }
}

async function deliverQuiz(enrollment: EnrollmentWithTeacher): Promise<DeliveryResult> {
  const subject = toSubject(enrollment.primarySubject);
  const quiz = await contentGenerationService.generateQuiz(enrollment.teacherId, '', {
    content: buildSourceMaterialText(enrollment, enrollment.currentTopic),
    title: `${enrollment.currentTopic} Quiz`,
    questionCount: 10,
    questionTypes: ['multiple_choice', 'true_false', 'short_answer'],
    difficulty: 'mixed',
    gradeLevel: enrollment.gradeLevel,
    skipQuota: true,
  });

  const content = await createGeneratedContent({
    teacherId: enrollment.teacherId,
    title: quiz.title,
    description: `Free drip quiz for ${enrollment.currentTopic}.`,
    subject,
    gradeLevel: enrollment.gradeLevel,
    contentType: TeacherContentType.QUIZ,
    quizContent: quiz as unknown as Record<string, unknown>,
    tokensUsed: quiz.tokensUsed,
    modelUsed: config.gemini.models.flash,
    operation: TokenOperation.QUIZ_GENERATION,
  });

  const exportResult = await createCompletedPdfExport(enrollment.teacherId, content, 'drip_day1_quiz');
  await sendDripEmailAndRecord({
    enrollment,
    stepName: 'drip_day1_quiz',
    topic: enrollment.currentTopic,
    subject: formatSubjectLabel(enrollment.primarySubject),
    gradeLevel: enrollment.gradeLevel,
    contentTitle: content.title,
    downloadUrl: exportResult.downloadUrl,
    exportId: exportResult.exportId,
    contentId: content.id,
  });

  return {
    contentId: content.id,
    triggerMetadata: { exportId: exportResult.exportId },
  };
}

async function deliverFlashcards(enrollment: EnrollmentWithTeacher): Promise<DeliveryResult> {
  const subject = toSubject(enrollment.primarySubject);
  const flashcards = await contentGenerationService.generateFlashcards(enrollment.teacherId, '', {
    content: buildSourceMaterialText(enrollment, enrollment.currentTopic),
    title: `${enrollment.currentTopic} Flashcards`,
    cardCount: 12,
    includeHints: true,
    gradeLevel: enrollment.gradeLevel,
    skipQuota: true,
  });

  const content = await createGeneratedContent({
    teacherId: enrollment.teacherId,
    title: flashcards.title,
    description: `Free drip flashcards for ${enrollment.currentTopic}.`,
    subject,
    gradeLevel: enrollment.gradeLevel,
    contentType: TeacherContentType.FLASHCARD_DECK,
    flashcardContent: flashcards as unknown as Record<string, unknown>,
    tokensUsed: flashcards.tokensUsed,
    modelUsed: config.gemini.models.flash,
    operation: TokenOperation.FLASHCARD_GENERATION,
  });

  const exportResult = await createCompletedPdfExport(enrollment.teacherId, content, 'drip_day2_flashcards');
  await sendDripEmailAndRecord({
    enrollment,
    stepName: 'drip_day2_flashcards',
    topic: enrollment.currentTopic,
    subject: formatSubjectLabel(enrollment.primarySubject),
    gradeLevel: enrollment.gradeLevel,
    contentTitle: content.title,
    downloadUrl: exportResult.downloadUrl,
    exportId: exportResult.exportId,
    contentId: content.id,
  });

  return {
    contentId: content.id,
    triggerMetadata: { exportId: exportResult.exportId },
  };
}

async function deliverWorksheet(enrollment: EnrollmentWithTeacher): Promise<DeliveryResult> {
  const worksheetTopic = enrollment.upNextTopic || enrollment.currentTopic;
  const subject = toSubject(enrollment.primarySubject);
  const worksheet = await contentGenerationService.generateLesson(enrollment.teacherId, {
    topic: worksheetTopic,
    subject,
    gradeLevel: enrollment.gradeLevel,
    curriculum: enrollment.curriculumType || undefined,
    lessonType: 'guide',
    includeActivities: true,
    includeAssessment: true,
    additionalContext: 'Create a concise worksheet or study guide that is easy to print and use for next-class review.',
    skipQuota: true,
  });

  const modelUsed = worksheet.modelUsed === 'pro' ? config.gemini.models.pro : config.gemini.models.flash;
  const title = `${worksheetTopic} Worksheet`;
  const content = await createGeneratedContent({
    teacherId: enrollment.teacherId,
    title,
    description: `Free drip worksheet for ${worksheetTopic}.`,
    subject,
    gradeLevel: enrollment.gradeLevel,
    contentType: TeacherContentType.WORKSHEET,
    lessonContent: worksheet as unknown as Record<string, unknown>,
    tokensUsed: worksheet.tokensUsed,
    modelUsed,
    operation: TokenOperation.LESSON_GENERATION,
  });

  const exportResult = await createCompletedPdfExport(enrollment.teacherId, content, 'drip_day3_worksheet');
  await sendDripEmailAndRecord({
    enrollment,
    stepName: 'drip_day3_worksheet',
    topic: worksheetTopic,
    subject: formatSubjectLabel(enrollment.primarySubject),
    gradeLevel: enrollment.gradeLevel,
    contentTitle: content.title,
    downloadUrl: exportResult.downloadUrl,
    exportId: exportResult.exportId,
    contentId: content.id,
  });

  return {
    contentId: content.id,
    triggerMetadata: { exportId: exportResult.exportId },
  };
}

async function advanceEnrollment(
  enrollment: EnrollmentWithTeacher,
  deliveredAt: Date,
  contentIds: string[] = []
): Promise<void> {
  const nextStepIndex = enrollment.currentStep + 1;
  const nextDeliveryAt = buildNextDeliveryAt(nextStepIndex, deliveredAt);
  const nextGeneratedIds = [...enrollment.generatedContentIds, ...contentIds].filter(Boolean);

  if (nextStepIndex >= DRIP_STEPS.length) {
    await prisma.contentDripEnrollment.update({
      where: { id: enrollment.id },
      data: {
        status: DripStatus.COMPLETED,
        currentStep: nextStepIndex,
        completedAt: deliveredAt,
        lastDeliveryAt: deliveredAt,
        nextDeliveryAt,
        generatedContentIds: nextGeneratedIds,
        consecutiveFailures: 0,
        lastError: null,
      },
    });
    return;
  }

  await prisma.contentDripEnrollment.update({
    where: { id: enrollment.id },
    data: {
      status: DripStatus.ACTIVE,
      currentStep: nextStepIndex,
      nextDeliveryAt,
      lastDeliveryAt: deliveredAt,
      generatedContentIds: nextGeneratedIds,
      consecutiveFailures: 0,
      lastError: null,
    },
  });
}

async function handleFailure(enrollment: EnrollmentWithTeacher, error: unknown): Promise<string> {
  const message = error instanceof Error ? error.message : String(error);
  const nextFailures = enrollment.consecutiveFailures + 1;
  const shouldPause = nextFailures >= 3;

  await prisma.contentDripEnrollment.update({
    where: { id: enrollment.id },
    data: {
      status: shouldPause ? DripStatus.PAUSED : DripStatus.ACTIVE,
      consecutiveFailures: nextFailures,
      lastError: message,
      nextDeliveryAt: addHours(new Date(), 4),
    },
  });

  logger.error('Content drip step failed', {
    enrollmentId: enrollment.id,
    teacherId: enrollment.teacherId,
    currentStep: enrollment.currentStep,
    consecutiveFailures: nextFailures,
    paused: shouldPause,
    error: message,
  });

  return message;
}

async function runSingleStep(enrollment: EnrollmentWithTeacher, step: DripStepDefinition): Promise<DeliveryResult> {
  switch (step.kind) {
    case 'lesson_pdf':
      return deliverLessonPdf(enrollment);
    case 'lesson_pptx':
      return deliverLessonPptx(enrollment);
    case 'quiz':
      return deliverQuiz(enrollment);
    case 'flashcards':
      return deliverFlashcards(enrollment);
    case 'worksheet':
      return deliverWorksheet(enrollment);
    default:
      throw new Error(`Unsupported drip step: ${step.kind}`);
  }
}

export const contentDripService = {
  async enrollTeacher(
    teacherId: string,
    options: {
      force?: boolean;
      reset?: boolean;
      queueImmediate?: boolean;
    } = {}
  ) {
    const snapshot = await buildEnrollmentSnapshot(teacherId);
    if (!snapshot) return null;

    const agent = await prisma.teacherAgent.findUnique({
      where: { teacherId },
      select: { onboardingComplete: true },
    });

    if (!options.force && !agent?.onboardingComplete) {
      logger.info('Skipped content drip enrollment because onboarding is incomplete', { teacherId });
      return null;
    }

    const existing = await prisma.contentDripEnrollment.findUnique({
      where: { teacherId },
    });

    if (existing && !options.reset) {
      return existing;
    }

    const enrollmentData = {
      status: DripStatus.ACTIVE,
      currentStep: 0,
      totalSteps: DRIP_STEPS.length,
      primarySubject: snapshot.primarySubject,
      gradeLevel: snapshot.gradeLevel,
      curriculumType: snapshot.curriculumType,
      currentTopic: snapshot.currentTopic,
      upNextTopic: snapshot.upNextTopic,
      nextDeliveryAt: new Date(),
      lastDeliveryAt: null,
      completedAt: null,
      enrolledAt: new Date(),
      generatedContentIds: [] as string[],
      consecutiveFailures: 0,
      lastError: null,
    };

    const enrollment = existing
      ? await prisma.contentDripEnrollment.update({
          where: { teacherId },
          data: enrollmentData,
        })
      : await prisma.contentDripEnrollment.create({
          data: {
            teacherId,
            ...enrollmentData,
          },
        });

    if (options.queueImmediate !== false) {
      await queueEnrollmentIfDue(enrollment.id, teacherId, enrollment.currentStep);
    }

    logger.info('Teacher enrolled in content drip campaign', {
      teacherId,
      enrollmentId: enrollment.id,
      email: snapshot.teacherEmail,
      topic: snapshot.currentTopic,
    });

    return enrollment;
  },

  async enrollTeacherByEmail(
    email: string,
    options: {
      force?: boolean;
      reset?: boolean;
      queueImmediate?: boolean;
    } = {}
  ) {
    const teacher = await prisma.teacher.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { id: true },
    });

    if (!teacher) {
      throw new Error(`Teacher not found for email ${email}`);
    }

    return this.enrollTeacher(teacher.id, options);
  },

  async resumeEnrollment(teacherId: string) {
    return prisma.contentDripEnrollment.update({
      where: { teacherId },
      data: {
        status: DripStatus.ACTIVE,
        lastError: null,
      },
    });
  },

  async processTeacherByEmail(
    email: string,
    options: {
      reset?: boolean;
      force?: boolean;
    } = {}
  ): Promise<ProcessStepResult> {
    const enrollment = await this.enrollTeacherByEmail(email, {
      reset: options.reset,
      force: options.force ?? true,
      queueImmediate: false,
    });

    if (!enrollment) {
      throw new Error(`Could not enroll teacher ${email} in the drip pilot`);
    }

    return this.processStep(enrollment.id);
  },

  async processStep(enrollmentId: string): Promise<ProcessStepResult> {
    const processedSteps: string[] = [];
    const skippedSteps: string[] = [];
    let failureMessage: string | undefined;

    for (let i = 0; i < MAX_STEPS_PER_RUN; i += 1) {
      const enrollment = await prisma.contentDripEnrollment.findUnique({
        where: { id: enrollmentId },
        include: {
          teacher: {
            select: {
              id: true,
              email: true,
              firstName: true,
            },
          },
        },
      });

      if (!enrollment) {
        return {
          success: false,
          enrollmentId,
          processedSteps,
          skippedSteps,
          error: 'Enrollment not found',
        };
      }

      if (enrollment.status !== DripStatus.ACTIVE) {
        return {
          success: !failureMessage,
          enrollmentId,
          processedSteps,
          skippedSteps,
          error: failureMessage,
        };
      }

      if (enrollment.nextDeliveryAt > new Date()) {
        return {
          success: !failureMessage,
          enrollmentId,
          processedSteps,
          skippedSteps,
          error: failureMessage,
        };
      }

      const step = DRIP_STEPS[enrollment.currentStep];
      if (!step) {
        await prisma.contentDripEnrollment.update({
          where: { id: enrollment.id },
          data: {
            status: DripStatus.COMPLETED,
            completedAt: new Date(),
          },
        });
        return {
          success: !failureMessage,
          enrollmentId,
          processedSteps,
          skippedSteps,
          error: failureMessage,
        };
      }

      if (await hasLifetimeTrigger(enrollment.teacherId, step.name)) {
        skippedSteps.push(step.name);
        await advanceEnrollment(enrollment, new Date());
        continue;
      }

      try {
        const delivery = await runSingleStep(enrollment, step);
        processedSteps.push(step.name);
        await advanceEnrollment(
          enrollment,
          new Date(),
          delivery.contentId ? [delivery.contentId] : []
        );
      } catch (error) {
        failureMessage = await handleFailure(enrollment, error);
        break;
      }
    }

    return {
      success: !failureMessage,
      enrollmentId,
      processedSteps,
      skippedSteps,
      error: failureMessage,
    };
  },
};
