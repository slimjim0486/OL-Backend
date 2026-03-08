// Communication Service — Parent emails and report card comment generation
// Uses curriculum-specific tone and terminology from getCurriculumConfig()
import { CommunicationType, CommunicationStatus, TokenOperation } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { getCurriculumConfig } from '../../config/curricula.js';
import { agentMemoryService } from './agentMemoryService.js';
import { contextAssemblerService } from './contextAssemblerService.js';
import { quotaService } from './quotaService.js';
import { generateAndParseJson, truncatePromptText } from '../../utils/modelJson.js';

// ============================================
// TYPES
// ============================================

export interface GenerateParentEmailInput {
  topic: string;
  tone?: 'positive' | 'concern' | 'update' | 'celebration';
  subject?: string; // Academic subject
  studentGroup?: string;
  gradeLevel?: string;
  additionalContext?: string;
  length?: 'short' | 'medium' | 'long';
}

export interface GenerateReportCommentsInput {
  studentGroup?: string;
  subject?: string;
  gradeLevel?: string;
  performanceLevel?: 'exceeding' | 'meeting' | 'approaching' | 'below';
  focusAreas?: string[];
  includeGoals?: boolean;
  commentCount?: number;
}

const COMMUNICATION_CONTEXT_MAX_CHARS = 6000;
const PARENT_EMAIL_INPUT_CONTEXT_MAX_CHARS = 2000;
const REPORT_COMMENT_FOCUS_MAX_CHARS = 1200;

// ============================================
// PARENT EMAIL GENERATION
// ============================================

async function generateParentEmail(
  teacherId: string,
  input: GenerateParentEmailInput
): Promise<{ id: string; title: string; content: string; tokensUsed: number }> {
  const estimatedTokens = 3000;
  await quotaService.enforceQuota(teacherId, TokenOperation.PARENT_EMAIL_GENERATION, estimatedTokens);

  // Load teacher context for curriculum-specific tone
  const agent = await agentMemoryService.getAgent(teacherId);
  const curriculumType = agent?.curriculumType || 'AMERICAN';
  const currConfig = getCurriculumConfig(curriculumType);

  const context = await contextAssemblerService.assembleContext(teacherId, 'CHAT');
  const additionalContext = truncatePromptText(
    contextAssemblerService.buildAdditionalContextString(context),
    COMMUNICATION_CONTEXT_MAX_CHARS
  );

  const toneMap = {
    positive: 'warm and encouraging',
    concern: 'professional and supportive, addressing areas for growth',
    update: 'informative and friendly',
    celebration: 'enthusiastic and congratulatory',
  };

  const lengthMap = {
    short: '150-200 words',
    medium: '250-350 words',
    long: '400-500 words',
  };

  const communicationTone = currConfig?.parentExpectations?.communicationTone || 'friendly';
  const keyTerms: Record<string, string> = currConfig?.parentExpectations?.keyTerminology || {};

  const prompt = `You are helping a teacher write a parent email. Use the following curriculum-specific communication style:

CURRICULUM: ${currConfig?.displayName || curriculumType}
COMMUNICATION TONE: ${communicationTone}
TERMINOLOGY:
- For mastery/excellence: "${keyTerms.mastery || 'mastery'}"
- For advanced work: "${keyTerms.advanced || 'exceeds expectations'}"
- For needs improvement: "${keyTerms.struggling || 'developing'}"
- For progress: "${keyTerms.progress || 'making progress'}"

TEACHER CONTEXT:
${additionalContext}

EMAIL REQUEST:
- Topic: ${input.topic}
- Tone: ${toneMap[input.tone || 'update']}
- Length: ${lengthMap[input.length || 'medium']}
${input.subject ? `- Subject: ${input.subject}` : ''}
${input.studentGroup ? `- Student Group: ${input.studentGroup}` : ''}
${input.gradeLevel ? `- Grade Level: ${input.gradeLevel}` : ''}
${input.additionalContext ? `- Additional Context: ${truncatePromptText(input.additionalContext, PARENT_EMAIL_INPUT_CONTEXT_MAX_CHARS)}` : ''}

Generate a professional parent email. Include:
1. A warm greeting
2. Clear communication of the topic
3. What students are learning or have accomplished
4. How parents can support at home (if relevant)
5. A positive, encouraging sign-off

Return JSON:
{
  "title": "Email subject line",
  "content": "Full email body text with proper paragraphs"
}`;

  const parsedResult = await generateAndParseJson({
    contextLabel: 'Parent email',
    prompts: [
      prompt,
      `${prompt}\n\nIMPORTANT: Return a single compact JSON object only. Keep the email concise and avoid unnecessary repetition.`,
    ],
    estimatedTokens,
    invoke: async (attemptPrompt) => {
      const model = genAI.getGenerativeModel({
        model: config.gemini.models.flash,
        safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: getParentEmailMaxOutputTokens(input.length),
          responseMimeType: 'application/json',
        },
      });
      return model.generateContent(attemptPrompt);
    },
    normalize: normalizeParentEmail,
  });

  const parsed = parsedResult.data;
  const tokensUsed = parsedResult.tokensUsed;

  // Save to database
  const communication = await prisma.teacherCommunication.create({
    data: {
      teacherId,
      type: CommunicationType.PARENT_EMAIL,
      title: parsed.title,
      content: parsed.content,
      subject: input.subject,
      studentGroup: input.studentGroup,
      gradeLevel: input.gradeLevel,
      parameters: input as any,
      tokensUsed,
      modelUsed: config.gemini.models.flash,
      status: CommunicationStatus.DRAFT,
    },
  });

  // Record usage
  await quotaService.recordUsage({
    teacherId,
    operation: TokenOperation.PARENT_EMAIL_GENERATION,
    tokensUsed,
    modelUsed: config.gemini.models.flash,
    resourceType: 'parent_email',
    resourceId: communication.id,
  });

  return {
    id: communication.id,
    title: parsed.title,
    content: parsed.content,
    tokensUsed,
  };
}

// ============================================
// REPORT CARD COMMENT GENERATION
// ============================================

async function generateReportComments(
  teacherId: string,
  input: GenerateReportCommentsInput
): Promise<{ id: string; title: string; content: string; tokensUsed: number }> {
  const estimatedTokens = 4000;
  await quotaService.enforceQuota(teacherId, TokenOperation.REPORT_COMMENT_GENERATION, estimatedTokens);

  const agent = await agentMemoryService.getAgent(teacherId);
  const curriculumType = agent?.curriculumType || 'AMERICAN';
  const currConfig = getCurriculumConfig(curriculumType);

  const context = await contextAssemblerService.assembleContext(teacherId, 'CHAT');
  const additionalContext = truncatePromptText(
    contextAssemblerService.buildAdditionalContextString(context),
    COMMUNICATION_CONTEXT_MAX_CHARS
  );

  // Load curriculum state for subject context
  let curriculumContext = '';
  if (agent) {
    const states = await agentMemoryService.getCurriculumStates(agent.id);
    const relevantState = input.subject
      ? states.find(s => s.subject === input.subject)
      : states[0];
    if (relevantState) {
      curriculumContext = `Standards taught: ${relevantState.standardsTaught.length}, Standards assessed: ${relevantState.standardsAssessed.length}`;
    }
  }

  const keyTerms: Record<string, string> = currConfig?.parentExpectations?.keyTerminology || {};
  const commentCount = input.commentCount || 5;

  const prompt = `You are helping a teacher write report card comments. Use curriculum-specific language:

CURRICULUM: ${currConfig?.displayName || curriculumType}
COMMUNICATION TONE: ${currConfig?.parentExpectations?.communicationTone || 'professional'}
TERMINOLOGY:
- Mastery: "${keyTerms.mastery || 'mastery'}"
- Advanced: "${keyTerms.advanced || 'exceeds expectations'}"
- Struggling: "${keyTerms.struggling || 'developing'}"
- Progress: "${keyTerms.progress || 'making progress'}"

TEACHER CONTEXT:
${additionalContext}
${curriculumContext ? `CURRICULUM PROGRESS: ${curriculumContext}` : ''}

COMMENT REQUEST:
- Performance Level: ${input.performanceLevel || 'meeting'}
- Number of Comments: ${commentCount}
${input.subject ? `- Subject: ${input.subject}` : ''}
${input.gradeLevel ? `- Grade Level: ${input.gradeLevel}` : ''}
${input.studentGroup ? `- Student Group: ${input.studentGroup}` : ''}
${input.focusAreas?.length ? `- Focus Areas: ${truncatePromptText(input.focusAreas.join(', '), REPORT_COMMENT_FOCUS_MAX_CHARS)}` : ''}
${input.includeGoals ? '- Include specific learning goals for next term' : ''}

Generate ${commentCount} unique report card comments appropriate for students at the "${input.performanceLevel || 'meeting'}" level. Each comment should:
1. Acknowledge specific strengths
2. Reference actual curriculum areas
3. Suggest areas for growth using encouraging language
4. Use curriculum-appropriate terminology
${input.includeGoals ? '5. Include a specific goal for next term' : ''}

Return JSON:
{
  "title": "Report Card Comments - [Subject] [Performance Level]",
  "comments": [
    {
      "comment": "Full report card comment text",
      "strengthArea": "Key strength highlighted",
      "growthArea": "Area for growth"
    }
  ]
}`;

  const parsedResult = await generateAndParseJson({
    contextLabel: 'Report comments',
    prompts: [
      prompt,
      `${prompt}\n\nIMPORTANT: Return a single valid JSON object only. Keep each comment compact but specific.`,
    ],
    estimatedTokens,
    invoke: async (attemptPrompt) => {
      const model = genAI.getGenerativeModel({
        model: config.gemini.models.flash,
        safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: getReportCommentsMaxOutputTokens(commentCount),
          responseMimeType: 'application/json',
        },
      });
      return model.generateContent(attemptPrompt);
    },
    normalize: (value) => normalizeReportComments(value, input.subject, input.performanceLevel, commentCount),
  });

  const parsed = parsedResult.data;
  const tokensUsed = parsedResult.tokensUsed;

  // Format comments into readable content
  const formattedContent = parsed.comments
    .map((c, i) => `--- Comment ${i + 1} ---\n${c.comment}\n\n[Strength: ${c.strengthArea}] [Growth: ${c.growthArea}]`)
    .join('\n\n');

  const communication = await prisma.teacherCommunication.create({
    data: {
      teacherId,
      type: CommunicationType.REPORT_CARD_COMMENT,
      title: parsed.title,
      content: formattedContent,
      subject: input.subject,
      studentGroup: input.studentGroup,
      gradeLevel: input.gradeLevel,
      parameters: { ...input, comments: parsed.comments } as any,
      tokensUsed,
      modelUsed: config.gemini.models.flash,
      status: CommunicationStatus.DRAFT,
    },
  });

  await quotaService.recordUsage({
    teacherId,
    operation: TokenOperation.REPORT_COMMENT_GENERATION,
    tokensUsed,
    modelUsed: config.gemini.models.flash,
    resourceType: 'report_comment',
    resourceId: communication.id,
  });

  return {
    id: communication.id,
    title: parsed.title,
    content: formattedContent,
    tokensUsed,
  };
}

// ============================================
// CRUD
// ============================================

async function listCommunications(
  teacherId: string,
  opts?: { type?: CommunicationType; page?: number; limit?: number }
) {
  const page = opts?.page || 1;
  const limit = opts?.limit || 20;
  const where = {
    teacherId,
    ...(opts?.type && { type: opts.type }),
  };

  const [communications, total] = await Promise.all([
    prisma.teacherCommunication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.teacherCommunication.count({ where }),
  ]);

  return { communications, total };
}

async function getCommunication(id: string, teacherId: string) {
  return prisma.teacherCommunication.findFirst({
    where: { id, teacherId },
  });
}

async function updateCommunication(
  id: string,
  teacherId: string,
  data: { title?: string; content?: string; status?: CommunicationStatus }
) {
  const existing = await prisma.teacherCommunication.findFirst({
    where: { id, teacherId },
  });
  if (!existing) throw new Error('Communication not found');

  return prisma.teacherCommunication.update({
    where: { id },
    data,
  });
}

async function deleteCommunication(id: string, teacherId: string) {
  const existing = await prisma.teacherCommunication.findFirst({
    where: { id, teacherId },
  });
  if (!existing) throw new Error('Communication not found');

  await prisma.teacherCommunication.delete({ where: { id } });
}

// ============================================
// EXPORTS
// ============================================

export const communicationService = {
  generateParentEmail,
  generateReportComments,
  listCommunications,
  getCommunication,
  updateCommunication,
  deleteCommunication,
};

function getParentEmailMaxOutputTokens(length?: GenerateParentEmailInput['length']): number {
  switch (length) {
    case 'short':
      return 1400;
    case 'long':
      return 2600;
    case 'medium':
    default:
      return 2000;
  }
}

function getReportCommentsMaxOutputTokens(commentCount: number): number {
  return Math.min(8000, Math.max(3500, 1200 + commentCount * 450));
}

function normalizeParentEmail(value: any): { title: string; content: string } {
  const title = String(value?.title || '').trim();
  const content = String(value?.content || '').trim();

  if (!title || !content) {
    throw new Error('Parent email JSON missing title or content');
  }

  return { title, content };
}

function normalizeReportComments(
  value: any,
  subject?: string,
  performanceLevel?: string,
  requestedCount?: number
): { title: string; comments: Array<{ comment: string; strengthArea: string; growthArea: string }> } {
  const comments = Array.isArray(value?.comments)
    ? value.comments
        .map((item: any) => ({
          comment: String(item?.comment || '').trim(),
          strengthArea: String(item?.strengthArea || '').trim(),
          growthArea: String(item?.growthArea || '').trim(),
        }))
        .filter((item: { comment: string; strengthArea: string; growthArea: string }) => item.comment)
    : [];

  if (!comments.length) {
    throw new Error('Report comments JSON did not contain any valid comments');
  }

  return {
    title: String(value?.title || '').trim() || `Report Card Comments - ${subject || 'General'} ${performanceLevel || 'meeting'}`,
    comments: comments.slice(0, requestedCount || comments.length),
  };
}
