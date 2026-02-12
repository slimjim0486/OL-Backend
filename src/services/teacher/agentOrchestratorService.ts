// Agent Orchestrator Service — The brain of the AI teaching assistant
// Processes teacher messages through: load agent → assemble context → classify intent → route → save → respond
import {
  AgentChatSession,
  AgentChatMessage,
  MessageRole,
  AgentInteractionType,
  PlanningAutonomy,
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
  interactionId: string;
  // Populated when the server updates the session title (usually from the first user prompt)
  sessionTitle?: string | null;
  intent: IntentType;
  actionResult?: {
    type: string;
    content: any;
    preview: string;
    contentId?: string;
    interactionId?: string;
  };
  tokensUsed: number;
}

interface SessionWithMessages extends AgentChatSession {
  messages: AgentChatMessage[];
}

const MAX_HISTORY_FOR_CONTEXT = 20;
const CALENDAR_REDIRECT_USER_INTENT_RE =
  /\b(?:take\s+me\s+to|go\s+to|open|show\s+me)\s+(?:my|the)?\s*(?:weekly\s+prep\s*)?(?:calendar|schedule)\b/i;

function toSessionTitleFromFirstPrompt(prompt: string): string {
  const normalized = String(prompt || '')
    .replace(/\s+/g, ' ')
    .trim();
  return truncate(normalized || 'Untitled chat', 60);
}

function normalizeModeArg(raw: string): PlanningAutonomy | null {
  const v = String(raw || '').trim().toLowerCase();
  if (v === 'coach') return PlanningAutonomy.COACH;
  if (v === 'planner') return PlanningAutonomy.PLANNER;
  if (v === 'autopilot') return PlanningAutonomy.AUTOPILOT;
  return null;
}

function describeMode(mode: PlanningAutonomy): { title: string; description: string } {
  switch (mode) {
    case PlanningAutonomy.COACH:
      return {
        title: 'Coach',
        description: 'I suggest options and you decide what to do.',
      };
    case PlanningAutonomy.PLANNER:
      return {
        title: 'Planner',
        description: "I draft daily/weekly plans for you to approve.",
      };
    case PlanningAutonomy.AUTOPILOT:
      return {
        title: 'Autopilot',
        description:
          'I can generate weekly prep automatically on your schedule. You still review and approve materials.',
      };
  }
}

function isDirectCalendarNavigationRequest(message: string): boolean {
  const text = String(message || '').trim();
  if (!text) return false;
  return CALENDAR_REDIRECT_USER_INTENT_RE.test(text);
}

async function maybeHandleSlashCommand(
  teacherId: string,
  agent: { preferredPlanningDay?: string | null; preferredDeliveryTime?: string | null; timezone?: string | null },
  message: string
): Promise<{ assistantContent: string; intent: IntentType; tokensUsed: number } | null> {
  const trimmed = String(message || '').trim();
  if (!trimmed.startsWith('/')) return null;

  const [cmdRaw, argRaw] = trimmed.split(/\s+/, 2);
  const cmd = cmdRaw.toLowerCase();

  if (cmd === '/mode') {
    const mode = normalizeModeArg(argRaw || '');
    if (!mode) {
      return {
        assistantContent:
          `To change planning autonomy, use:\n` +
          `- /mode coach\n` +
          `- /mode planner\n` +
          `- /mode autopilot`,
        intent: 'chat',
        tokensUsed: 0,
      };
    }

    await agentMemoryService.updateIdentity(teacherId, {
      planningAutonomy: mode,
      planningAutonomyAcknowledged: true,
    });

    const desc = describeMode(mode);
    const needsSchedule =
      mode === PlanningAutonomy.AUTOPILOT && (!agent.preferredPlanningDay || !agent.preferredDeliveryTime);

    return {
      assistantContent:
        `Planning mode set to **${desc.title}**.\n` +
        `${desc.description}\n` +
        (needsSchedule
          ? `\nTo enable scheduled weekly prep, set a planning day/time in AI Assistant settings.`
          : ''),
      intent: 'chat',
      tokensUsed: 0,
    };
  }

  return null;
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

  // 4. Fast-path: slash commands (no LLM call)
  let assistantContent: string;
  let actionResult: AgentResponse['actionResult'] | undefined;
  let totalTokens = 0;
  let intent: { type: IntentType; confidence: number; extractedParams: Record<string, any> } = {
    type: 'chat',
    confidence: 1,
    extractedParams: {},
  };

  const commandResult = await maybeHandleSlashCommand(teacherId, agent as any, message);
  if (commandResult) {
    assistantContent = commandResult.assistantContent;
    intent = { type: commandResult.intent, confidence: 1, extractedParams: {} };
    totalTokens = commandResult.tokensUsed;
  } else if (isDirectCalendarNavigationRequest(message)) {
    const { prepId, weekLabel } = await weeklyPrepService.initiateWeeklyPrep(teacherId, {
      triggeredBy: 'chat',
      forceCreate: true,
    });
    await queueWeeklyPrep({ prepId, teacherId, triggeredBy: 'chat' });

    actionResult = {
      type: 'weekly_prep',
      content: { prepId, weekLabel },
      preview: `Opening your calendar for "${weekLabel}" now.`,
      contentId: prepId,
    };
    assistantContent = 'Opening your calendar now.';
    intent = { type: 'weekly_prep', confidence: 1, extractedParams: {} };
    totalTokens = 0;
  } else {
    // 5. Assemble context
    const context = await contextAssemblerService.assembleChatContext(teacherId, sessionId);

    // 6. Classify intent
    const recentMessages = session.messages
      .reverse()
      .slice(-5)
      .map((m) => ({ role: m.role, content: m.content }));

    intent = await taskRouterService.classifyIntent(
      message,
      recentMessages,
      context.identityContext
    );

    logger.info('Intent classified', { teacherId, sessionId, intent: intent.type, confidence: intent.confidence });

    // 7. Route to handler
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
        assistantContent =
          bridgeResult.contentType === 'weekly_prep'
            ? bridgeResult.preview
            : `${bridgeResult.preview}\n\nWould you like me to modify anything, or is this good to go?`;
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
  }

  // 8. Record interaction (return id so UI can send approve/edit/regenerate feedback)
  const interaction = await agentMemoryService.recordInteraction(agent.id, {
    type: intent.type === 'chat' ? AgentInteractionType.CHAT : AgentInteractionType.CONTENT_GENERATION,
    summary: truncate(message, 200),
    input: message,
    outputType: actionResult?.type || 'chat',
    outputId: actionResult?.contentId,
    tokensUsed: totalTokens,
    modelUsed: actionResult ? config.gemini.models.flash : config.gemini.models.flash,
  });

  const persistedActionResult = actionResult
    ? ({ ...actionResult, interactionId: interaction.id } as AgentResponse['actionResult'])
    : undefined;

  // 9. Save assistant message
  const assistantMessage = await prisma.agentChatMessage.create({
    data: {
      sessionId,
      role: MessageRole.ASSISTANT,
      content: assistantContent,
      actionType: persistedActionResult?.type || null,
      actionResult: persistedActionResult ? (persistedActionResult as any) : undefined,
      actionStatus: persistedActionResult ? 'completed' : null,
      model: config.gemini.models.flash,
      tokens: totalTokens,
    },
  });

  // 10. Update session token count
  const isCommand = String(message || '').trim().startsWith('/');
  const nextTitle = session.title || isCommand ? undefined : toSessionTitleFromFirstPrompt(message);
  const updatedSession = await prisma.agentChatSession.update({
    where: { id: sessionId },
    data: {
      totalTokens: { increment: totalTokens },
      // Auto-set title from first message if not set
      ...(nextTitle ? { title: nextTitle } : {}),
    },
    select: { title: true },
  });

  return {
    message: assistantContent,
    sessionId,
    messageId: assistantMessage.id,
    interactionId: interaction.id,
    sessionTitle: updatedSession.title,
    intent: intent.type,
    actionResult: persistedActionResult,
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
  const formattedHistory = recentMessages.map((m) => ({
    role: m.role === 'USER' ? 'user' as const : 'model' as const,
    parts: [{ text: m.content }],
  }));

  // Gemini requires history to start with a 'user' role. If the session was created
  // with an assistant greeting (or any leading model messages), drop them.
  let history = formattedHistory;
  if (history.length > 0 && history[0].role === 'model') {
    const firstUserIndex = history.findIndex((m) => m.role === 'user');
    history = firstUserIndex === -1 ? [] : history.slice(firstUserIndex);
  }

  const chat = model.startChat(history.length ? { history } : {});
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
        forceCreate: true,
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
