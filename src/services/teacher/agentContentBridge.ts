// Agent Content Bridge — Wraps existing generation services with memory context
// CRITICAL: Does NOT modify contentGenerationService.ts. Injects context through existing fields.
import { Subject, AgentInteractionType, ContentStatus, SourceType, TeacherContentType } from '@prisma/client';
import { contentGenerationService } from './contentGenerationService.js';
import { contentService } from './contentService.js';
import { subPlanService } from './subPlanService.js';
import { iepGoalService } from './iepGoalService.js';
import { communicationService } from './communicationService.js';
import { classroomManagementService } from './classroomManagementService.js';
import { contextAssemblerService, TaskType } from './contextAssemblerService.js';
import { agentMemoryService } from './agentMemoryService.js';
import { logger } from '../../utils/logger.js';
import type { TaskIntent } from './taskRouterService.js';

// ============================================
// TYPES
// ============================================

export interface BridgeResult {
  content: any;
  preview: string; // Short text preview for chat display
  tokensUsed: number;
  contentType: string;
  contentId?: string;
  interactionId?: string;
}

// ============================================
// LESSON GENERATION WITH CONTEXT
// ============================================

function stripGenerationMetadata(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const {
    tokensUsed: _tokensUsed,
    modelUsed: _modelUsed,
    fallbackTriggered: _fallbackTriggered,
    fallbackReason: _fallbackReason,
    ...content
  } = value as Record<string, unknown>;
  return content;
}

async function generateLessonWithContext(
  teacherId: string,
  intent: TaskIntent,
  sessionId?: string
): Promise<BridgeResult> {
  const context = await contextAssemblerService.assembleContext(
    teacherId,
    'CONTENT_GENERATION',
    { subject: intent.extractedParams.subject }
  );

  const additionalContext = contextAssemblerService.buildAdditionalContextString(context);

  const result = await contentGenerationService.generateLesson(teacherId, {
    topic: intent.extractedParams.topic || 'General lesson',
    subject: mapToSubject(intent.extractedParams.subject),
    gradeLevel: intent.extractedParams.gradeLevel,
    additionalContext,
    lessonType: intent.extractedParams.lessonType || 'guide',
    includeActivities: true,
    includeAssessment: true,
  });
  const savedContent = await contentService.createContent(teacherId, {
    title: result.title || intent.extractedParams.topic || 'Generated Lesson',
    description: result.summary,
    contentType: TeacherContentType.LESSON,
    subject: mapToSubject(intent.extractedParams.subject),
    gradeLevel: intent.extractedParams.gradeLevel,
    sourceType: SourceType.TEXT,
    status: ContentStatus.DRAFT,
    lessonContent: stripGenerationMetadata(result),
  });

  // Record interaction
  let interactionId: string | undefined;
  const agent = await agentMemoryService.getAgent(teacherId);
  if (agent) {
    const interaction = await agentMemoryService.recordInteraction(agent.id, {
      type: AgentInteractionType.CONTENT_GENERATION,
      summary: `Generated lesson: ${result.title}`,
      input: intent.extractedParams.topic,
      outputType: 'lesson',
      outputId: savedContent.id,
      tokensUsed: result.tokensUsed,
      modelUsed: result.modelUsed || 'flash',
    });
    interactionId = interaction?.id;
  }

  return {
    content: { ...result, id: savedContent.id, contentId: savedContent.id },
    preview: `Created lesson: "${result.title}" with ${result.sections.length} sections`,
    tokensUsed: result.tokensUsed,
    contentType: 'lesson',
    contentId: savedContent.id,
    interactionId,
  };
}

// ============================================
// QUIZ GENERATION WITH CONTEXT
// ============================================

async function generateQuizWithContext(
  teacherId: string,
  intent: TaskIntent,
  sessionId?: string
): Promise<BridgeResult> {
  const context = await contextAssemblerService.assembleContext(
    teacherId,
    'QUIZ_GENERATION',
    { subject: intent.extractedParams.subject }
  );

  // Prepend classroom context to quiz content
  const additionalContextStr = contextAssemblerService.buildAdditionalContextString(context);
  const content = intent.extractedParams.topic
    ? `${additionalContextStr}\n\nTopic: ${intent.extractedParams.topic}`
    : additionalContextStr || 'Generate a quiz based on recent classroom topics.';

  const result = await contentGenerationService.generateQuiz(teacherId, '', {
    content,
    title: intent.extractedParams.title,
    questionCount: intent.extractedParams.count || 10,
    difficulty: intent.extractedParams.difficulty || 'mixed',
    gradeLevel: intent.extractedParams.gradeLevel,
  });
  const savedContent = await contentService.createContent(teacherId, {
    title: result.title || intent.extractedParams.title || `Quiz: ${intent.extractedParams.topic || 'Generated Quiz'}`,
    description: `Generated quiz with ${result.questions.length} questions`,
    contentType: TeacherContentType.QUIZ,
    subject: mapToSubject(intent.extractedParams.subject),
    gradeLevel: intent.extractedParams.gradeLevel,
    sourceType: SourceType.TEXT,
    status: ContentStatus.DRAFT,
    quizContent: stripGenerationMetadata(result),
  });

  let interactionId: string | undefined;
  const agent = await agentMemoryService.getAgent(teacherId);
  if (agent) {
    const interaction = await agentMemoryService.recordInteraction(agent.id, {
      type: AgentInteractionType.CONTENT_GENERATION,
      summary: `Generated quiz: ${result.title} (${result.questions.length} questions)`,
      input: intent.extractedParams.topic,
      outputType: 'quiz',
      outputId: savedContent.id,
      tokensUsed: result.tokensUsed,
      modelUsed: 'flash',
    });
    interactionId = interaction?.id;
  }

  return {
    content: { ...result, id: savedContent.id, contentId: savedContent.id },
    preview: `Created quiz: "${result.title}" with ${result.questions.length} questions (${result.totalPoints} points)`,
    tokensUsed: result.tokensUsed,
    contentType: 'quiz',
    contentId: savedContent.id,
    interactionId,
  };
}

// ============================================
// FLASHCARD GENERATION WITH CONTEXT
// ============================================

async function generateFlashcardsWithContext(
  teacherId: string,
  intent: TaskIntent,
  sessionId?: string
): Promise<BridgeResult> {
  const context = await contextAssemblerService.assembleContext(
    teacherId,
    'FLASHCARD_GENERATION',
    { subject: intent.extractedParams.subject }
  );

  const additionalContextStr = contextAssemblerService.buildAdditionalContextString(context);
  const content = intent.extractedParams.topic
    ? `${additionalContextStr}\n\nTopic: ${intent.extractedParams.topic}`
    : additionalContextStr || 'Generate flashcards based on recent classroom topics.';

  const result = await contentGenerationService.generateFlashcards(teacherId, '', {
    content,
    title: intent.extractedParams.title,
    cardCount: intent.extractedParams.count || 20,
    gradeLevel: intent.extractedParams.gradeLevel,
  });
  const savedContent = await contentService.createContent(teacherId, {
    title: result.title || intent.extractedParams.title || `Flashcards: ${intent.extractedParams.topic || 'Generated Flashcards'}`,
    description: `Generated flashcard deck with ${result.cards.length} cards`,
    contentType: TeacherContentType.FLASHCARD_DECK,
    subject: mapToSubject(intent.extractedParams.subject),
    gradeLevel: intent.extractedParams.gradeLevel,
    sourceType: SourceType.TEXT,
    status: ContentStatus.DRAFT,
    flashcardContent: stripGenerationMetadata(result),
  });

  let interactionId: string | undefined;
  const agent = await agentMemoryService.getAgent(teacherId);
  if (agent) {
    const interaction = await agentMemoryService.recordInteraction(agent.id, {
      type: AgentInteractionType.CONTENT_GENERATION,
      summary: `Generated flashcards: ${result.title} (${result.cards.length} cards)`,
      input: intent.extractedParams.topic,
      outputType: 'flashcards',
      outputId: savedContent.id,
      tokensUsed: result.tokensUsed,
      modelUsed: 'flash',
    });
    interactionId = interaction?.id;
  }

  return {
    content: { ...result, id: savedContent.id, contentId: savedContent.id },
    preview: `Created flashcard set: "${result.title}" with ${result.cards.length} cards`,
    tokensUsed: result.tokensUsed,
    contentType: 'flashcards',
    contentId: savedContent.id,
    interactionId,
  };
}

// ============================================
// SUB PLAN GENERATION WITH CONTEXT
// ============================================

async function generateSubPlanWithContext(
  teacherId: string,
  intent: TaskIntent,
  sessionId?: string
): Promise<BridgeResult> {
  const context = await contextAssemblerService.assembleContext(
    teacherId,
    'SUB_PLAN',
    { subject: intent.extractedParams.subject }
  );

  const contextNotes = contextAssemblerService.buildAdditionalContextString(context);
  const explicitNotes = String(intent.extractedParams.additionalContext || '').trim();
  const topicNotes = String(intent.extractedParams.topic || '').trim();
  const additionalNotes = [explicitNotes, topicNotes ? `Requested focus: ${topicNotes}` : '', contextNotes]
    .filter(Boolean)
    .join('\n\n');

  const result = await subPlanService.createSubPlan(teacherId, {
    title: intent.extractedParams.title || `Sub Plan - ${new Date().toLocaleDateString()}`,
    date: intent.extractedParams.date || new Date().toISOString().split('T')[0],
    gradeLevel: intent.extractedParams.gradeLevel,
    subject: intent.extractedParams.subject,
    timePeriod: intent.extractedParams.timePeriod,
    classroomNotes: intent.extractedParams.classroomNotes,
    emergencyProcedures: intent.extractedParams.emergencyProcedures,
    helpfulStudents: intent.extractedParams.helpfulStudents,
    lessonIds: intent.extractedParams.lessonIds || [],
    additionalNotes: additionalNotes || undefined,
  });

  let interactionId: string | undefined;
  const agent = await agentMemoryService.getAgent(teacherId);
  if (agent) {
    const interaction = await agentMemoryService.recordInteraction(agent.id, {
      type: AgentInteractionType.CONTENT_GENERATION,
      summary: `Generated sub plan: ${result.title}`,
      input: intent.extractedParams.title,
      outputType: 'sub_plan',
      outputId: result.id,
      modelUsed: 'flash',
    });
    interactionId = interaction?.id;
  }

  return {
    content: result,
    preview: `Created substitute plan: "${result.title}"`,
    tokensUsed: result.tokensUsed || 0,
    contentType: 'sub_plan',
    contentId: result.id,
    interactionId,
  };
}

// ============================================
// IEP GOAL GENERATION WITH CONTEXT
// ============================================

async function generateIEPWithContext(
  teacherId: string,
  intent: TaskIntent,
  sessionId?: string
): Promise<BridgeResult> {
  const context = await contextAssemblerService.assembleContext(
    teacherId,
    'IEP',
    { subject: intent.extractedParams.subject }
  );

  const modelContext = contextAssemblerService.buildAdditionalContextString(context);
  const teacherAdditionalContext = String(intent.extractedParams.additionalContext || '').trim();
  const additionalContext = [teacherAdditionalContext, modelContext].filter(Boolean).join('\n\n');
  const missingFields: string[] = [];

  if (!intent.extractedParams.gradeLevel) missingFields.push('grade level');
  if (!intent.extractedParams.disabilityCategory) missingFields.push('disability category');
  if (!intent.extractedParams.subjectArea) missingFields.push('focus area');
  if (!intent.extractedParams.presentLevels || String(intent.extractedParams.presentLevels).trim().length < 10) {
    missingFields.push('present levels');
  }

  if (missingFields.length > 0) {
    throw new Error(`Need ${missingFields.join(', ')} before drafting IEP goals.`);
  }

  const result = await iepGoalService.createIEPSession(teacherId, {
    gradeLevel: intent.extractedParams.gradeLevel,
    disabilityCategory: intent.extractedParams.disabilityCategory,
    subjectArea: intent.extractedParams.subjectArea,
    presentLevels: intent.extractedParams.presentLevels,
    studentIdentifier: intent.extractedParams.studentIdentifier || intent.extractedParams.studentName,
    strengths: intent.extractedParams.strengths,
    challenges: intent.extractedParams.challenges,
    additionalContext: additionalContext || undefined,
  });

  let interactionId: string | undefined;
  const agent = await agentMemoryService.getAgent(teacherId);
  if (agent) {
    const interaction = await agentMemoryService.recordInteraction(agent.id, {
      type: AgentInteractionType.CONTENT_GENERATION,
      summary: `Generated IEP goals for ${intent.extractedParams.subjectArea || 'student'}`,
      input: intent.extractedParams.presentLevels,
      outputType: 'iep',
      outputId: result.id,
      modelUsed: 'flash',
    });
    interactionId = interaction?.id;
  }

  return {
    content: result,
    preview: `Created IEP goal session with generated goals and accommodations`,
    tokensUsed: result.tokensUsed || 0,
    contentType: 'iep',
    contentId: result.id,
    interactionId,
  };
}

// ============================================
// PARENT EMAIL GENERATION WITH CONTEXT
// ============================================

async function generateParentEmailWithContext(
  teacherId: string,
  intent: TaskIntent,
  sessionId?: string
): Promise<BridgeResult> {
  const result = await communicationService.generateParentEmail(teacherId, {
    topic: intent.extractedParams.topic || 'Class update',
    tone: intent.extractedParams.tone || 'update',
    subject: intent.extractedParams.subject,
    gradeLevel: intent.extractedParams.gradeLevel,
    additionalContext: intent.extractedParams.additionalContext,
    length: intent.extractedParams.length || 'medium',
  });

  let interactionId: string | undefined;
  const agent = await agentMemoryService.getAgent(teacherId);
  if (agent) {
    const interaction = await agentMemoryService.recordInteraction(agent.id, {
      type: AgentInteractionType.CONTENT_GENERATION,
      summary: `Generated parent email: ${result.title}`,
      input: intent.extractedParams.topic,
      outputType: 'parent_email',
      outputId: result.id,
      tokensUsed: result.tokensUsed,
      modelUsed: 'flash',
    });
    interactionId = interaction?.id;
  }

  return {
    content: result,
    preview: `Created parent email: "${result.title}"`,
    tokensUsed: result.tokensUsed,
    contentType: 'parent_email',
    contentId: result.id,
    interactionId,
  };
}

// ============================================
// REPORT CARD COMMENTS GENERATION WITH CONTEXT
// ============================================

async function generateReportCommentsWithContext(
  teacherId: string,
  intent: TaskIntent,
  sessionId?: string
): Promise<BridgeResult> {
  const result = await communicationService.generateReportComments(teacherId, {
    subject: intent.extractedParams.subject,
    gradeLevel: intent.extractedParams.gradeLevel,
    performanceLevel: intent.extractedParams.performanceLevel || 'meeting',
    focusAreas: intent.extractedParams.focusAreas,
    includeGoals: intent.extractedParams.includeGoals !== false,
    commentCount: intent.extractedParams.count || 5,
  });

  let interactionId: string | undefined;
  const agent = await agentMemoryService.getAgent(teacherId);
  if (agent) {
    const interaction = await agentMemoryService.recordInteraction(agent.id, {
      type: AgentInteractionType.CONTENT_GENERATION,
      summary: `Generated report card comments: ${result.title}`,
      input: intent.extractedParams.subject || 'general',
      outputType: 'report_comments',
      outputId: result.id,
      tokensUsed: result.tokensUsed,
      modelUsed: 'flash',
    });
    interactionId = interaction?.id;
  }

  return {
    content: result,
    preview: `Created report card comments: "${result.title}"`,
    tokensUsed: result.tokensUsed,
    contentType: 'report_comments',
    contentId: result.id,
    interactionId,
  };
}

// ============================================
// UTILITY
// ============================================

function mapToSubject(subjectStr?: string): Subject | undefined {
  if (!subjectStr) return undefined;
  const upper = subjectStr.toUpperCase().replace(/\s+/g, '_');
  if (Object.values(Subject).includes(upper as Subject)) {
    return upper as Subject;
  }
  // Common mappings
  const map: Record<string, Subject> = {
    MATHEMATICS: Subject.MATH,
    MATHS: Subject.MATH,
    ELA: Subject.ENGLISH,
    'LANGUAGE ARTS': Subject.ENGLISH,
    LITERATURE: Subject.ENGLISH,
    SS: Subject.SOCIAL_STUDIES,
    PE: Subject.PHYSICAL_EDUCATION,
    CS: Subject.COMPUTER_SCIENCE,
    IT: Subject.COMPUTER_SCIENCE,
  };
  return map[upper] || undefined;
}

// ============================================
// BEHAVIOR STRATEGY WITH CONTEXT
// ============================================

async function generateBehaviorStrategyWithContext(
  teacherId: string,
  intent: TaskIntent,
  sessionId?: string
): Promise<BridgeResult> {
  const context = await contextAssemblerService.assembleContext(
    teacherId,
    'CLASSROOM_MANAGEMENT' as TaskType,
    { subject: intent.extractedParams.subject }
  );

  const additionalContext = contextAssemblerService.buildAdditionalContextString(context);

  const result = await classroomManagementService.generateStrategies(teacherId, {
    challengeType: intent.extractedParams.challengeType || intent.extractedParams.topic,
    context: intent.extractedParams.context,
    gradeLevel: intent.extractedParams.gradeLevel,
    subject: intent.extractedParams.subject,
    urgency: intent.extractedParams.urgency,
  }, additionalContext);

  // Record interaction
  let interactionId: string | undefined;
  const agent = await agentMemoryService.getAgent(teacherId);
  if (agent) {
    const interaction = await agentMemoryService.recordInteraction(agent.id, {
      type: AgentInteractionType.CONTENT_GENERATION,
      summary: `Generated behavior strategies: ${result.title}`,
      input: intent.extractedParams.challengeType || intent.extractedParams.topic || 'classroom management',
      outputType: 'behavior_strategy',
      tokensUsed: result.tokensUsed,
      modelUsed: result.modelUsed,
    });
    interactionId = interaction?.id;
  }

  const strategyCount =
    result.immediateStrategies.length +
    result.preventiveApproaches.length +
    result.longTermSystems.length;

  return {
    content: result,
    preview: `Here are ${strategyCount} strategies for "${result.title}"`,
    tokensUsed: result.tokensUsed,
    contentType: 'behavior_strategy',
    interactionId,
  };
}

// ============================================
// EXPORTS
// ============================================

export const agentContentBridge = {
  generateLessonWithContext,
  generateQuizWithContext,
  generateFlashcardsWithContext,
  generateSubPlanWithContext,
  generateIEPWithContext,
  generateParentEmailWithContext,
  generateReportCommentsWithContext,
  generateBehaviorStrategyWithContext,
};
