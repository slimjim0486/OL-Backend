// Curriculum-aware brainstorm service for teacher brainstorming sessions
import {
  BrainstormMessage,
  BrainstormSession,
  CurriculumType,
  Subject,
  MessageRole,
  LearningStandard,
  TokenOperation,
} from '@prisma/client';
import { prisma } from '../../config/database.js';
import { config } from '../../config/index.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { getCurriculumConfig, getGradeLevelConfig } from '../../config/curricula.js';
import { quotaService } from './quotaService.js';
import { uploadFile } from '../storage/storageService.js';
import { v4 as uuidv4 } from 'uuid';

const MAX_HISTORY_MESSAGES = 20;
const MAX_LESSON_CONTEXT_CHARS = 4000;
const IMAGE_TOKEN_ESTIMATE = 1000;
const SESSION_LIMITS = {
  maxMessagesPerSession: 50,
  maxStandardsPerSession: 20,
};

export interface StandardReference {
  id: string;
  notation: string | null;
  description: string;
}

function parseGradeLevel(gradeLevel?: string | null): number | null {
  if (!gradeLevel) return null;
  const normalized = gradeLevel.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized.includes('kindergarten') || normalized === 'k' || normalized.startsWith('k-')) {
    return 0;
  }
  const match = normalized.match(/\d+/);
  if (!match) return null;
  const value = Number(match[0]);
  return Number.isNaN(value) ? null : value;
}

function buildEducationLevelCandidates(gradeLevel?: string | null): string[] {
  if (!gradeLevel) return [];
  const trimmed = gradeLevel.trim();
  if (!trimmed) return [];
  const upper = trimmed.toUpperCase();
  const candidates = new Set<string>();
  candidates.add(trimmed);
  candidates.add(upper);
  if (upper.includes('KINDER') || upper === 'K' || upper.startsWith('K-')) {
    candidates.add('K');
  }
  const match = upper.match(/\d+/);
  if (match) {
    const num = match[0];
    candidates.add(num);
    candidates.add(`Y${num}`);
    candidates.add(`YEAR_${num}`);
    candidates.add(`GRADE_${num}`);
  }
  return Array.from(candidates);
}

function mapCurriculumToJurisdiction(curriculumType: CurriculumType, subject?: Subject): string {
  if (curriculumType === 'AMERICAN' && subject) {
    if (subject === 'SCIENCE') {
      return 'US_NGSS';
    }
    if (subject === 'SOCIAL_STUDIES') {
      return 'US_C3';
    }
    return 'US_COMMON_CORE';
  }

  const mapping: Record<CurriculumType, string> = {
    BRITISH: 'UK_NATIONAL_CURRICULUM',
    AMERICAN: 'US_COMMON_CORE',
    IB: 'IB_PYP',
    INDIAN_CBSE: 'INDIAN_CBSE',
    INDIAN_ICSE: 'INDIAN_ICSE',
    ARABIC: 'ARABIC_CURRICULUM',
  };

  return mapping[curriculumType] || 'UK_NATIONAL_CURRICULUM';
}

function shouldSearchStandards(message: string): boolean {
  const normalized = message.toLowerCase();
  const triggers = [
    'standard',
    'curriculum',
    'objective',
    'outcome',
    'alignment',
    'align',
    'cover',
    'assessment',
  ];
  return triggers.some(trigger => normalized.includes(trigger));
}

function getSubjectDisplayName(subject?: Subject | null): string {
  if (!subject) return 'General';
  const mapping: Partial<Record<Subject, string>> = {
    MATH: 'Mathematics',
    SCIENCE: 'Science',
    ENGLISH: 'English Language Arts',
    SOCIAL_STUDIES: 'Social Studies',
    HISTORY: 'History',
    GEOGRAPHY: 'Geography',
    ART: 'Art',
    MUSIC: 'Music',
    PHYSICAL_EDUCATION: 'Physical Education',
    COMPUTER_SCIENCE: 'Computer Science',
    FOREIGN_LANGUAGE: 'World Languages',
    OTHER: 'General',
  };
  return mapping[subject] || subject.replace(/_/g, ' ');
}

function formatStandardsForPrompt(
  standards: LearningStandard[],
  context: { curriculumType?: CurriculumType | null; subject?: Subject | null }
): string {
  if (!standards.length) return '';
  const subjectName = getSubjectDisplayName(context.subject);
  const curriculumName = context.curriculumType
    ? getCurriculumConfig(context.curriculumType).displayName
    : null;

  return standards
    .map((standard) => {
      const strandLabel = standard.strand ? ` — ${standard.strand}` : '';
      const curriculumLabel = curriculumName ? `${curriculumName} ` : '';
      return `- ${curriculumLabel}${subjectName}${strandLabel}: ${standard.description}`;
    })
    .join('\n');
}

function shouldUsePro(message: string, historyCount: number): boolean {
  const normalized = message.toLowerCase();
  const forceProTriggers = [
    'use pro',
    'pro model',
    'deep think',
    'deep analysis',
  ];
  if (forceProTriggers.some(trigger => normalized.includes(trigger))) {
    return true;
  }

  let score = 0;
  if (message.length > 500) {
    score += 2;
  } else if (message.length > 250) {
    score += 1;
  }

  const questionCount = (message.match(/\?/g) || []).length;
  if (questionCount >= 2) {
    score += 1;
  }

  const highSignal = [
    'root cause',
    'systems',
    'policy',
    'equity',
    'trauma',
    'behavior plan',
    'behaviour plan',
    'mtss',
    'rti',
    'intervention',
    'assessment design',
    'data analysis',
    'curriculum map',
    'scope and sequence',
    'psychology',
  ];
  if (highSignal.some(term => normalized.includes(term))) {
    score += 2;
  }

  const mediumSignal = [
    'comprehensive',
    'in-depth',
    'in depth',
    'detailed',
    'complex',
    'long-term',
    'long term',
    'multi-step',
    'multi step',
    'strategy',
    'framework',
    'diagnostic',
    'leadership',
  ];
  if (mediumSignal.some(term => normalized.includes(term))) {
    score += 1;
  }

  if (historyCount >= 8) {
    score += 1;
  }

  return score >= 2;
}

function isImageRequest(message: string): boolean {
  const normalized = message.toLowerCase();
  const triggers = [
    'illustration',
    'picture',
    'image',
    'diagram',
    'sketch',
    'drawing',
    'draw',
    'visual',
    'poster',
    'infographic',
    'worksheet',
    'coloring',
    'colouring',
    'dotted line',
    'dot-to-dot',
    'dot to dot',
    'tracing',
    'trace',
    'outline',
    'stencil',
  ];
  return triggers.some(trigger => normalized.includes(trigger));
}

function buildBrainstormImagePrompt(
  message: string,
  context: {
    gradeLevel?: string | null;
    subject?: Subject | null;
  }
): string {
  const normalized = message.toLowerCase();
  const wantsDotted = (
    normalized.includes('dotted') ||
    normalized.includes('dot-to-dot') ||
    normalized.includes('dot to dot') ||
    normalized.includes('tracing') ||
    normalized.includes('trace')
  );
  const wantsColor = (
    normalized.includes('color') ||
    normalized.includes('colour') ||
    normalized.includes('colorful') ||
    normalized.includes('coloured')
  );
  const wantsLabels = (
    normalized.includes('label') ||
    normalized.includes('labels') ||
    normalized.includes('caption') ||
    normalized.includes('word')
  );

  const style = wantsDotted
    ? 'dotted line tracing worksheet'
    : wantsColor
      ? 'colorful illustration'
      : 'black-and-white line art';

  const gradeNote = context.gradeLevel
    ? `Target grade level: ${context.gradeLevel}.`
    : 'Target grade level: elementary and middle school.';
  const subjectNote = context.subject ? `Subject context: ${context.subject}.` : '';

  return `Create a ${style} for students based on the teacher request.
REQUEST: ${message}
${gradeNote}
${subjectNote}

STYLE GUIDANCE:
- Clean, high-contrast, classroom-friendly
- Centered subject on a white background
- Printable and simple
- Avoid copyrighted characters, logos, or branded materials
- No scary or inappropriate imagery
${wantsLabels ? '- Include simple labels only if requested.' : '- Do not include any text.'}

If the request mentions tracing or dotted lines, use dotted outlines with generous white space for writing.`;
}

async function generateBrainstormImage(params: {
  teacherId: string;
  sessionId: string;
  prompt: string;
}): Promise<{ imageUrl: string; tokensUsed: number }> {
  const { teacherId, sessionId, prompt } = params;
  const model = genAI.getGenerativeModel({
    model: config.gemini.models.image,
    generationConfig: {
      // @ts-expect-error - image generation specific config
      responseModalities: ['image', 'text'],
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const tokensUsed = response.usageMetadata?.totalTokenCount || IMAGE_TOKEN_ESTIMATE;

  let imageData: Buffer | null = null;
  let mimeType = 'image/png';

  for (const candidate of response.candidates || []) {
    for (const part of candidate.content?.parts || []) {
      const inlineData = (part as { inlineData?: { data: string; mimeType?: string } }).inlineData;
      if (inlineData?.data) {
        imageData = Buffer.from(inlineData.data, 'base64');
        mimeType = inlineData.mimeType || 'image/png';
        break;
      }
    }
    if (imageData) break;
  }

  if (!imageData) {
    throw new Error('Image generation did not produce an image. Try simplifying the request.');
  }

  const filename = `brainstorm-${uuidv4()}.png`;
  const storagePath = `teacher/${teacherId}/brainstorm/${sessionId}/${filename}`;

  const uploadResult = await uploadFile(
    'aiContent',
    storagePath,
    imageData,
    mimeType,
    {
      teacherId,
      sessionId,
    }
  );

  await quotaService.recordUsage({
    teacherId,
    operation: TokenOperation.INFOGRAPHIC_GENERATION,
    tokensUsed,
    modelUsed: config.gemini.models.image,
    resourceType: 'brainstorm_image',
    resourceId: sessionId,
  });

  return { imageUrl: uploadResult.publicUrl, tokensUsed };
}

function buildBrainstormSystemPrompt(context: {
  curriculumType?: CurriculumType | null;
  gradeLevel?: string | null;
  subject?: Subject | null;
  lessonContext?: string | null;
  teacherName?: string | null;
  standardsContext?: string | null;
}): string {
  const {
    curriculumType,
    gradeLevel,
    subject,
    lessonContext,
    teacherName,
    standardsContext,
  } = context;

  const curriculumConfig = curriculumType ? getCurriculumConfig(curriculumType) : null;
  const gradeNum = parseGradeLevel(gradeLevel);
  const gradeLevelConfig = gradeNum !== null ? getGradeLevelConfig(gradeNum) : null;

  return `You are Ollie, a thoughtful teaching partner in Orbit Learn. You brainstorm with teachers about pedagogy, lesson ideas, classroom challenges, and the human side of teaching.

PERSONALITY:
- Warm, collaborative peer (not an authoritative expert)
- Ask clarifying questions before jumping to solutions
- Offer multiple perspectives, not single "right answers"
- Acknowledge the complexity and emotional weight of teaching
- Use "we" language: "What if we tried..." not "You should..."
- When teachers share struggles or motivation challenges, respond with empathy and practical reflection, without offering therapy

${curriculumConfig ? `
CURRICULUM CONTEXT: ${curriculumConfig.displayName}
Philosophy: ${curriculumConfig.philosophy}

Your pedagogical approach should reflect:
- Teacher role: ${curriculumConfig.teacherRole}
- Question style: ${curriculumConfig.questionStyle.approach}
- Feedback approach: ${curriculumConfig.feedbackStyle.approach}
- Mistake culture: ${curriculumConfig.mistakeCulture}
- Content density: ${curriculumConfig.contentStyle.questionDensity} practice density
- Scaffolding: ${curriculumConfig.contentStyle.scaffoldingLevel}

Key terminology to use:
- For mastery: "${curriculumConfig.parentExpectations.keyTerminology.mastery}"
- For advanced: "${curriculumConfig.parentExpectations.keyTerminology.advanced}"
- For struggling: "${curriculumConfig.parentExpectations.keyTerminology.struggling}"
- For progress: "${curriculumConfig.parentExpectations.keyTerminology.progress}"

Key phrases: ${curriculumConfig.keyPhrases.slice(0, 3).join(' | ')}
` : ''}

${gradeLevelConfig ? `
GRADE LEVEL CONTEXT: ${gradeLevel || 'Not specified'}
- Optimal session length: ~${gradeLevelConfig.optimalSessionMinutes} minutes
- Instruction style: ${gradeLevelConfig.instructionStyle}
- Vocabulary tier: ${gradeLevelConfig.vocabularyTier}
- Working memory capacity: ~${gradeLevelConfig.workingMemoryChunks} chunks at a time
` : ''}

${subject ? `SUBJECT FOCUS: ${subject}` : ''}

${standardsContext ? `
RELEVANT STANDARDS (reference when appropriate):
${standardsContext}
` : ''}

STANDARDS AWARENESS:
When discussing curriculum topics, you can reference specific learning standards.
If the teacher asks about standards or what a lesson covers, reference them in teacher-friendly language.
Avoid CCSS/notation codes unless the teacher explicitly asks for them.
Format standard references as: **[Subject — Standard Focus]** - Plain-language description
Example: **[English Language Arts — Reading Informational Text]** - Citing textual evidence to support analysis.

BEHAVIOR:
- For simple questions: Be concise, offer 2-3 ideas
- For complex problems: Ask 1-2 clarifying questions first
- When suggesting activities, consider the curriculum's preferred approach
- Always end with an open question to continue dialogue

GUARDRAILS:
- Stay education-focused (redirect off-topic gently)
- Do not generate full lesson plans (suggest using Lesson Creator)
- Do not provide medical/legal/therapeutic advice
- Acknowledge uncertainty: "I'm not sure, but here's a thought..."

${lessonContext ? `
LESSON CONTEXT:
The teacher has attached this lesson for reference:
---
${lessonContext}
---
` : ''}

${teacherName ? `Teacher name: ${teacherName}` : ''}`;
}

function formatConversationHistory(
  messages: BrainstormMessage[]
): Array<{ role: string; parts: Array<{ text: string }> }> {
  if (!messages.length) return [];

  const formatted = messages.map((msg) => ({
    role: msg.role === 'USER' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  if (formatted.length > 0 && formatted[0].role === 'model') {
    const firstUserIndex = formatted.findIndex(m => m.role === 'user');
    if (firstUserIndex === -1) {
      return [];
    }
    return formatted.slice(firstUserIndex);
  }

  return formatted;
}

function formatTeacherName(firstName?: string | null, lastName?: string | null): string | null {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.length ? parts.join(' ') : null;
}

function trimLessonContext(lessonContent?: string | null): string | null {
  if (!lessonContent) return null;
  if (lessonContent.length <= MAX_LESSON_CONTEXT_CHARS) {
    return lessonContent;
  }
  return `${lessonContent.slice(0, MAX_LESSON_CONTEXT_CHARS)}...`;
}

export const brainstormService = {
  async createSession(
    teacherId: string,
    options?: {
      lessonId?: string;
      initialMessage?: string;
      curriculumType?: CurriculumType;
      gradeLevel?: string;
      subject?: Subject;
    }
  ): Promise<BrainstormSession> {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        preferredCurriculum: true,
        preferredGradeRange: true,
        primarySubject: true,
      },
    });

    const curriculumType = options?.curriculumType ?? teacher?.preferredCurriculum ?? null;
    const gradeLevel = options?.gradeLevel ?? teacher?.preferredGradeRange ?? null;
    const subject = options?.subject ?? teacher?.primarySubject ?? null;

    let lessonTitle: string | null = null;
    let lessonContent: string | null = null;
    let lessonId: string | null = null;

    if (options?.lessonId) {
      const lesson = await prisma.teacherContent.findFirst({
        where: {
          id: options.lessonId,
          teacherId,
        },
        select: {
          id: true,
          title: true,
          lessonContent: true,
          extractedText: true,
          description: true,
        },
      });

      if (!lesson) {
        throw new Error('Lesson not found or access denied.');
      }

      lessonId = lesson.id;
      lessonTitle = lesson.title;
      if (lesson.lessonContent) {
        lessonContent = JSON.stringify(lesson.lessonContent);
      } else if (lesson.extractedText) {
        lessonContent = lesson.extractedText;
      } else if (lesson.description) {
        lessonContent = lesson.description;
      }
    }

    const session = await prisma.brainstormSession.create({
      data: {
        teacherId,
        curriculumType,
        gradeLevel,
        subject,
        lessonId,
        lessonTitle,
        lessonContent,
      },
    });

    if (options?.initialMessage) {
      await this.sendMessage(session.id, teacherId, options.initialMessage);
      const refreshed = await this.getSession(session.id, teacherId);
      if (refreshed) {
        return refreshed;
      }
    }

    return session;
  },

  async getSession(sessionId: string, teacherId: string): Promise<BrainstormSession | null> {
    return prisma.brainstormSession.findFirst({
      where: { id: sessionId, teacherId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
  },

  async listSessions(
    teacherId: string,
    options: {
      page?: number;
      limit?: number;
      curriculumType?: CurriculumType;
      subject?: Subject;
      search?: string;
    }
  ): Promise<{ sessions: Array<BrainstormSession & { _count: { messages: number } }>; total: number }> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      teacherId,
    };

    if (options.curriculumType) {
      where.curriculumType = options.curriculumType;
    }
    if (options.subject) {
      where.subject = options.subject;
    }
    if (options.search) {
      where.title = { contains: options.search, mode: 'insensitive' };
    }

    const [sessions, total] = await prisma.$transaction([
      prisma.brainstormSession.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        include: {
          _count: { select: { messages: true } },
        },
      }),
      prisma.brainstormSession.count({ where }),
    ]);

    return { sessions, total };
  },

  async sendMessage(
    sessionId: string,
    teacherId: string,
    message: string
  ): Promise<{
    userMessage: BrainstormMessage;
    assistantMessage: BrainstormMessage;
    tokensUsed: number;
    standardsReferenced?: StandardReference[];
  }> {
    const session = await prisma.brainstormSession.findFirst({
      where: { id: sessionId, teacherId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) {
      throw new Error('Brainstorm session not found.');
    }

    if (session.messages.length >= SESSION_LIMITS.maxMessagesPerSession) {
      throw new Error('This session has reached the maximum number of messages.');
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        firstName: true,
        lastName: true,
        preferredCurriculum: true,
        preferredGradeRange: true,
      },
    });

    const effectiveCurriculum = session.curriculumType ?? teacher?.preferredCurriculum ?? null;
    const effectiveGradeLevel = session.gradeLevel ?? teacher?.preferredGradeRange ?? null;
    const effectiveSubject = session.subject ?? null;
    const teacherName = formatTeacherName(teacher?.firstName, teacher?.lastName);

    const updates: Record<string, unknown> = {};
    if (!session.curriculumType && effectiveCurriculum) {
      updates.curriculumType = effectiveCurriculum;
    }
    if (!session.gradeLevel && effectiveGradeLevel) {
      updates.gradeLevel = effectiveGradeLevel;
    }
    if (Object.keys(updates).length > 0) {
      await prisma.brainstormSession.update({
        where: { id: sessionId },
        data: updates,
      });
    }

    let standards: LearningStandard[] = [];
    if (
      effectiveCurriculum &&
      effectiveSubject &&
      message.trim().length > 0 &&
      shouldSearchStandards(message)
    ) {
      standards = await this.findRelevantStandards(
        effectiveCurriculum,
        effectiveSubject,
        effectiveGradeLevel || '',
        message
      );
    }

    const standardsContext = standards.length
      ? formatStandardsForPrompt(standards, {
        curriculumType: effectiveCurriculum,
        subject: effectiveSubject,
      })
      : null;
    const systemPrompt = buildBrainstormSystemPrompt({
      curriculumType: effectiveCurriculum,
      gradeLevel: effectiveGradeLevel,
      subject: effectiveSubject,
      lessonContext: trimLessonContext(session.lessonContent),
      teacherName,
      standardsContext,
    });

    const needsImage = isImageRequest(message);
    let imageAllowed = needsImage;
    let imageQuotaError: string | null = null;
    if (needsImage) {
      try {
        await quotaService.enforceQuota(
          teacherId,
          TokenOperation.INFOGRAPHIC_GENERATION,
          IMAGE_TOKEN_ESTIMATE
        );
      } catch (error) {
        imageAllowed = false;
        imageQuotaError = error instanceof Error
          ? error.message
          : 'Not enough credits to generate images.';
      }
    }

    const recentMessages = session.messages.slice(-MAX_HISTORY_MESSAGES);
    const history = formatConversationHistory(recentMessages);

    const usePro = shouldUsePro(message, session.messages.length);
    const modelId = usePro ? config.gemini.models.pro : config.gemini.models.flash;
    const modelLabel = usePro ? 'pro' : 'flash';
    const model = genAI.getGenerativeModel({
      model: modelId,
      safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: usePro ? 1400 : 900,
      },
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const response = result.response;
    const responseText = response.text();
    const tokensUsed =
      response.usageMetadata?.totalTokenCount
      ?? quotaService.estimateTokens(message + responseText);

    let imageUrls: string[] = [];
    let imagePrompt: string | null = null;
    let imageTokensUsed = 0;
    let imageError: string | null = imageQuotaError;

    if (needsImage && imageAllowed) {
      imagePrompt = buildBrainstormImagePrompt(message, {
        gradeLevel: effectiveGradeLevel,
        subject: effectiveSubject,
      });
      try {
        const imageResult = await generateBrainstormImage({
          teacherId,
          sessionId,
          prompt: imagePrompt,
        });
        imageUrls = [imageResult.imageUrl];
        imageTokensUsed = imageResult.tokensUsed;
      } catch (error) {
        imageError = error instanceof Error ? error.message : 'Image generation failed.';
      }
    }

    let finalResponseText = responseText;
    if (needsImage && imageUrls.length > 0) {
      finalResponseText = `${responseText}\n\nI generated a printable illustration below. Want a different style or size?`;
    } else if (needsImage && imageError) {
      finalResponseText = `${responseText}\n\nI could not generate the illustration this time. Try a simpler description or tell me the exact object and style you want.`;
    }

    const standardReferences: StandardReference[] | undefined = standards.length
      ? standards.map((standard) => ({
        id: standard.id,
        notation: standard.notation,
        description: standard.description,
      }))
      : undefined;

    const [userMessage, assistantMessage] = await prisma.$transaction([
      prisma.brainstormMessage.create({
        data: {
          sessionId,
          role: MessageRole.USER,
          content: message,
          tokens: 0,
        },
      }),
      prisma.brainstormMessage.create({
        data: {
          sessionId,
          role: MessageRole.ASSISTANT,
          content: finalResponseText,
          model: modelLabel,
          tokens: tokensUsed,
          standardReferences: standardReferences ? JSON.parse(JSON.stringify(standardReferences)) : undefined,
          imageUrls,
          imagePrompt: imagePrompt || undefined,
        },
      }),
    ]);

    const updatedStandardIds = standardReferences
      ? Array.from(new Set([
        ...session.referencedStandardIds,
        ...standardReferences.map((reference) => reference.id),
      ])).slice(0, SESSION_LIMITS.maxStandardsPerSession)
      : session.referencedStandardIds;

    const inferredTitle = session.title
      ? null
      : message.trim().length > 80
        ? `${message.trim().slice(0, 77)}...`
        : message.trim();

    const sessionTokenUpdate: Record<string, unknown> = {
      totalTokens: { increment: tokensUsed + imageTokensUsed },
      referencedStandardIds: updatedStandardIds,
      ...(inferredTitle ? { title: inferredTitle } : {}),
    };
    if (usePro) {
      sessionTokenUpdate.proTokens = { increment: tokensUsed };
    } else {
      sessionTokenUpdate.flashTokens = { increment: tokensUsed };
    }

    await prisma.brainstormSession.update({
      where: { id: sessionId },
      data: sessionTokenUpdate,
    });

    await quotaService.recordUsage({
      teacherId,
      operation: TokenOperation.BRAINSTORM,
      tokensUsed,
      modelUsed: modelId,
      resourceType: 'brainstorm_message',
      resourceId: sessionId,
    });

    return {
      userMessage,
      assistantMessage,
      tokensUsed: tokensUsed + imageTokensUsed,
      standardsReferenced: standardReferences,
    };
  },

  async findRelevantStandards(
    curriculumType: CurriculumType,
    subject: Subject,
    gradeLevel: string,
    topic: string
  ): Promise<LearningStandard[]> {
    const jurisdictionCode = mapCurriculumToJurisdiction(curriculumType, subject);
    if (!jurisdictionCode || !topic.trim()) return [];

    const gradeNum = parseGradeLevel(gradeLevel);
    const educationLevelCandidates = buildEducationLevelCandidates(gradeLevel);

    const standardSetFilter: Record<string, unknown> = {
      jurisdiction: { code: jurisdictionCode },
      subject,
    };

    if (gradeNum !== null || educationLevelCandidates.length > 0) {
      const levelFilters: Array<Record<string, unknown>> = [];
      if (gradeNum !== null) {
        levelFilters.push({ gradeLevel: gradeNum });
      }
      if (educationLevelCandidates.length > 0) {
        levelFilters.push({ educationLevels: { hasSome: educationLevelCandidates } });
      }
      if (levelFilters.length > 0) {
        standardSetFilter.OR = levelFilters;
      }
    }

    return prisma.learningStandard.findMany({
      where: {
        standardSet: standardSetFilter,
        OR: [
          { description: { contains: topic, mode: 'insensitive' } },
          { notation: { contains: topic, mode: 'insensitive' } },
          { strand: { contains: topic, mode: 'insensitive' } },
          { conceptualArea: { contains: topic, mode: 'insensitive' } },
        ],
      },
      take: 5,
      include: {
        standardSet: true,
      },
    });
  },

  async updateTitle(sessionId: string, teacherId: string, title: string): Promise<void> {
    const result = await prisma.brainstormSession.updateMany({
      where: { id: sessionId, teacherId },
      data: { title },
    });

    if (result.count === 0) {
      throw new Error('Brainstorm session not found.');
    }
  },

  async deleteSession(sessionId: string, teacherId: string): Promise<void> {
    const result = await prisma.brainstormSession.deleteMany({
      where: { id: sessionId, teacherId },
    });

    if (result.count === 0) {
      throw new Error('Brainstorm session not found.');
    }
  },

  async exportSession(
    sessionId: string,
    teacherId: string,
    format: 'markdown' | 'text'
  ): Promise<string> {
    const session = await prisma.brainstormSession.findFirst({
      where: { id: sessionId, teacherId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) {
      throw new Error('Brainstorm session not found.');
    }

    const standards = session.referencedStandardIds.length
      ? await prisma.learningStandard.findMany({
        where: { id: { in: session.referencedStandardIds } },
        include: {
          standardSet: {
            select: {
              title: true,
              subject: true,
              gradeLevel: true,
              jurisdiction: { select: { name: true } },
            },
          },
        },
      })
      : [];

    const lines: string[] = [];
    const title = session.title || 'Brainstorm Session';
    if (format === 'markdown') {
      lines.push(`# ${title}`);
    } else {
      lines.push(title);
      lines.push('='.repeat(title.length));
    }

    const contextParts: string[] = [];
    if (session.curriculumType) contextParts.push(`Curriculum: ${session.curriculumType}`);
    if (session.gradeLevel) contextParts.push(`Grade: ${session.gradeLevel}`);
    if (session.subject) contextParts.push(`Subject: ${session.subject}`);
    if (contextParts.length) {
      lines.push('');
      lines.push(format === 'markdown' ? '## Context' : 'Context');
      lines.push(contextParts.join(' | '));
    }

    if (standards.length) {
      lines.push('');
      lines.push(format === 'markdown' ? '## Standards Referenced' : 'Standards Referenced');
      standards.forEach((standard) => {
        const code = standard.notation || standard.id;
        const descriptor = `${code} - ${standard.description}`;
        lines.push(format === 'markdown' ? `- **[${code}]** ${standard.description}` : descriptor);
      });
    }

    lines.push('');
    lines.push(format === 'markdown' ? '## Conversation' : 'Conversation');
    session.messages.forEach((msg) => {
      const speaker = msg.role === 'USER' ? 'Teacher' : 'Ollie';
      if (format === 'markdown') {
        lines.push('');
        lines.push(`**${speaker}:** ${msg.content}`);
      } else {
        lines.push('');
        lines.push(`${speaker}: ${msg.content}`);
      }

      if (msg.imageUrls && msg.imageUrls.length > 0) {
        msg.imageUrls.forEach((url) => {
          if (format === 'markdown') {
            lines.push(`![Illustration](${url})`);
          } else {
            lines.push(`Image: ${url}`);
          }
        });
      }
    });

    return lines.join('\n');
  },
};
