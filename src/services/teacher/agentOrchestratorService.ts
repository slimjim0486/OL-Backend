// Agent Orchestrator Service — The brain of the AI teaching assistant
// Processes teacher messages through: load agent → assemble context → classify intent → route → save → respond
import {
  AgentChatSession,
  AgentChatMessage,
  MessageRole,
  AgentInteractionType,
  Subject,
  Prisma,
} from '@prisma/client';
import { prisma } from '../../config/database.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { agentMemoryService } from './agentMemoryService.js';
import { contextAssemblerService } from './contextAssemblerService.js';
import { taskRouterService, IntentType } from './taskRouterService.js';
import { agentContentBridge, BridgeResult } from './agentContentBridge.js';
import { weeklyPrepService } from './weeklyPrepService.js';
import { queueWeeklyPrep } from '../../jobs/index.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export interface AgentResponse {
  message: string;
  sessionId: string;
  messageId: string;
  // Populated when the server updates the session title (usually from the first user prompt)
  sessionTitle?: string | null;
  intent: IntentType;
  actionResult?: {
    type: string;
    content: any;
    preview: string;
    contentId?: string;
  };
  tokensUsed: number;
}

interface SessionWithMessages extends AgentChatSession {
  messages: AgentChatMessage[];
}

const MAX_HISTORY_FOR_CONTEXT = 20;

function toSessionTitleFromFirstPrompt(prompt: string): string {
  const normalized = String(prompt || '')
    .replace(/\s+/g, ' ')
    .trim();
  return truncate(normalized || 'Untitled chat', 60);
}

// ============================================
// MESSAGE PROCESSING PIPELINE
// ============================================

async function processMessage(
  teacherId: string,
  sessionId: string,
  message: string
): Promise<AgentResponse> {
  // 1. Load agent, verify setup
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) {
    throw new Error('Agent not initialized. Please complete setup first.');
  }
  if (!agent.onboardingComplete) {
    throw new Error('Please complete onboarding before using chat.');
  }

  // 2. Verify session belongs to this agent
  const session = await prisma.agentChatSession.findFirst({
    where: { id: sessionId, agentId: agent.id },
    include: { messages: { orderBy: { createdAt: 'desc' }, take: MAX_HISTORY_FOR_CONTEXT } },
  });
  if (!session) {
    throw new Error('Chat session not found.');
  }

  // 3. Save user message
  const userMessage = await prisma.agentChatMessage.create({
    data: {
      sessionId,
      role: MessageRole.USER,
      content: message,
    },
  });

  // 4. Assemble context
  const context = await contextAssemblerService.assembleChatContext(teacherId, sessionId);

  // 5. Classify intent
  const recentMessages = session.messages
    .reverse()
    .slice(-5)
    .map((m) => ({ role: m.role, content: m.content }));
  const intent = await taskRouterService.classifyIntent(
    message,
    recentMessages,
    context.identityContext
  );

  logger.info('Intent classified', { teacherId, sessionId, intent: intent.type, confidence: intent.confidence });

  // 6. Route to handler
  let assistantContent: string;
  let actionResult: AgentResponse['actionResult'] | undefined;
  let totalTokens = 0;

  if (intent.type !== 'chat' && intent.confidence >= 0.6) {
    // Content generation intent
    try {
      const bridgeResult = await routeToContentBridge(teacherId, intent);
      actionResult = {
        type: bridgeResult.contentType,
        content: bridgeResult.content,
        preview: bridgeResult.preview,
        contentId: bridgeResult.contentId,
      };
      assistantContent = `${bridgeResult.preview}\n\nWould you like me to modify anything, or is this good to go?`;
      totalTokens = bridgeResult.tokensUsed;
    } catch (error: any) {
      logger.error('Content generation failed in orchestrator', { error, intent: intent.type });
      assistantContent = `I tried to create that for you, but ran into an issue: ${error.message || 'Unknown error'}. Could you try rephrasing your request?`;
    }
  } else {
    // Conversational chat
    const chatResult = await generateChatResponse(
      context.systemPrompt,
      message,
      recentMessages
    );
    assistantContent = chatResult.response;
    totalTokens = chatResult.tokensUsed;
  }

  // 7. Save assistant message
  const assistantMessage = await prisma.agentChatMessage.create({
    data: {
      sessionId,
      role: MessageRole.ASSISTANT,
      content: assistantContent,
      actionType: actionResult?.type || null,
      actionResult: actionResult ? (actionResult as any) : undefined,
      actionStatus: actionResult ? 'completed' : null,
      model: config.gemini.models.flash,
      tokens: totalTokens,
    },
  });

  // 8. Update session token count
  const nextTitle = session.title ? undefined : toSessionTitleFromFirstPrompt(message);
  const updatedSession = await prisma.agentChatSession.update({
    where: { id: sessionId },
    data: {
      totalTokens: { increment: totalTokens },
      // Auto-set title from first message if not set
      ...(nextTitle ? { title: nextTitle } : {}),
    },
    select: { title: true },
  });

  // 9. Record interaction
  await agentMemoryService.recordInteraction(agent.id, {
    type: intent.type === 'chat' ? AgentInteractionType.CHAT : AgentInteractionType.CONTENT_GENERATION,
    summary: truncate(message, 200),
    input: message,
    outputType: actionResult?.type || 'chat',
    outputId: actionResult?.contentId,
    tokensUsed: totalTokens,
    modelUsed: config.gemini.models.flash,
  });

  return {
    message: assistantContent,
    sessionId,
    messageId: assistantMessage.id,
    sessionTitle: updatedSession.title,
    intent: intent.type,
    actionResult,
    tokensUsed: totalTokens,
  };
}

// ============================================
// CHAT RESPONSE GENERATION
// ============================================

async function generateChatResponse(
  systemPrompt: string,
  userMessage: string,
  recentMessages: Array<{ role: string; content: string }>
): Promise<{ response: string; tokensUsed: number }> {
  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1500,
    },
  });

  // Build conversation history for Gemini
  const history = recentMessages.map((m) => ({
    role: m.role === 'USER' ? 'user' as const : 'model' as const,
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userMessage);
  const responseText = result.response.text().trim();
  const tokensUsed = result.response.usageMetadata?.totalTokenCount || 500;

  return { response: responseText, tokensUsed };
}

// ============================================
// CONTENT ROUTING
// ============================================

async function routeToContentBridge(
  teacherId: string,
  intent: { type: IntentType; extractedParams: Record<string, any> }
): Promise<BridgeResult> {
  switch (intent.type) {
    case 'generate_lesson':
      return agentContentBridge.generateLessonWithContext(teacherId, intent as any);
    case 'generate_quiz':
      return agentContentBridge.generateQuizWithContext(teacherId, intent as any);
    case 'generate_flashcards':
      return agentContentBridge.generateFlashcardsWithContext(teacherId, intent as any);
    case 'generate_sub_plan':
      return agentContentBridge.generateSubPlanWithContext(teacherId, intent as any);
    case 'generate_iep':
      return agentContentBridge.generateIEPWithContext(teacherId, intent as any);
    case 'generate_parent_email':
      return agentContentBridge.generateParentEmailWithContext(teacherId, intent as any);
    case 'generate_report_comments':
      return agentContentBridge.generateReportCommentsWithContext(teacherId, intent as any);
    case 'weekly_prep': {
      const { prepId, weekLabel } = await weeklyPrepService.initiateWeeklyPrep(teacherId, {
        triggeredBy: 'chat',
      });
      await queueWeeklyPrep({ prepId, teacherId, triggeredBy: 'chat' });
      return {
        content: { prepId, weekLabel },
        preview: `I'm generating your weekly prep package for "${weekLabel}" now. This usually takes 2-3 minutes. You can check the progress on the Weekly Prep page.`,
        tokensUsed: 0,
        contentType: 'weekly_prep',
        contentId: prepId,
      };
    }
    default:
      throw new Error(`Unsupported content type: ${intent.type}`);
  }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

async function createSession(
  teacherId: string,
  opts?: { title?: string; subject?: Subject }
): Promise<AgentChatSession> {
  const agent = await agentMemoryService.getOrCreateAgent(teacherId);

  return prisma.agentChatSession.create({
    data: {
      agentId: agent.id,
      title: opts?.title,
      subject: opts?.subject,
    },
  });
}

async function listSessions(
  teacherId: string,
  opts?: { page?: number; limit?: number; pinned?: boolean }
): Promise<{ sessions: AgentChatSession[]; total: number }> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) return { sessions: [], total: 0 };

  const page = opts?.page || 1;
  const limit = opts?.limit || 20;
  const where: Prisma.AgentChatSessionWhereInput = {
    agentId: agent.id,
    ...(opts?.pinned !== undefined && { isPinned: opts.pinned }),
  };

  const [sessions, total] = await Promise.all([
    prisma.agentChatSession.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, role: true, createdAt: true },
        },
      },
    }),
    prisma.agentChatSession.count({ where }),
  ]);

  return { sessions, total };
}

async function getSession(
  sessionId: string,
  teacherId: string
): Promise<SessionWithMessages | null> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) return null;

  return prisma.agentChatSession.findFirst({
    where: { id: sessionId, agentId: agent.id },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });
}

async function deleteSession(
  sessionId: string,
  teacherId: string
): Promise<void> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) throw new Error('Agent not found');

  await prisma.agentChatSession.deleteMany({
    where: { id: sessionId, agentId: agent.id },
  });
}

async function pinSession(
  sessionId: string,
  teacherId: string,
  isPinned: boolean
): Promise<AgentChatSession> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) throw new Error('Agent not found');

  const session = await prisma.agentChatSession.findFirst({
    where: { id: sessionId, agentId: agent.id },
  });
  if (!session) throw new Error('Session not found');

  return prisma.agentChatSession.update({
    where: { id: sessionId },
    data: { isPinned },
  });
}

// ============================================
// UTILITY
// ============================================

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.substring(0, max - 3) + '...';
}

// ============================================
// EXPORTS
// ============================================

export const agentOrchestratorService = {
  processMessage,
  createSession,
  listSessions,
  getSession,
  deleteSession,
  pinSession,
};
