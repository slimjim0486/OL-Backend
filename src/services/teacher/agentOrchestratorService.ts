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
import { detectPlannerNavigationIntent } from './plannerNavigationIntent.js';
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
  suggestedReplies?: string[];
}

interface SessionWithMessages extends AgentChatSession {
  messages: AgentChatMessage[];
}

const MAX_HISTORY_FOR_CONTEXT = 20;
const PLANNER_WEEKLY_PREP_PROMPT_TYPE = 'planner_weekly_prep_prompt';
const IEP_GOALS_QUICK_REPLY = 'Generate IEP goals';

type PlannerWeeklyPrepChoice = 'tell_more' | 'generate_now' | null;

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

function extractWeeklyPrepIdFromActionResult(actionResult: Prisma.JsonValue | null | undefined): string | null {
  if (!actionResult || typeof actionResult !== 'object' || Array.isArray(actionResult)) return null;
  const obj = actionResult as Record<string, any>;

  if (typeof obj.contentId === 'string' && obj.contentId.trim()) {
    return obj.contentId.trim();
  }

  if (obj.content && typeof obj.content === 'object' && !Array.isArray(obj.content)) {
    const prepId = (obj.content as Record<string, any>).prepId;
    if (typeof prepId === 'string' && prepId.trim()) {
      return prepId.trim();
    }
  }

  return null;
}

function findRecentSessionWeeklyPrepId(messages: AgentChatMessage[]): string | null {
  for (const msg of messages) {
    if (msg.role !== MessageRole.ASSISTANT) continue;
    const actionObj = msg.actionResult as Prisma.JsonValue | null | undefined;
    if (!actionObj || typeof actionObj !== 'object' || Array.isArray(actionObj)) continue;
    const type = (actionObj as Record<string, any>).type;
    if (type !== 'weekly_prep') continue;
    const prepId = extractWeeklyPrepIdFromActionResult(actionObj);
    if (prepId) return prepId;
  }
  return null;
}

function buildExportHelpMessage(): string {
  return (
    `To find and export your lesson plans/slides in Orbit Learn:\n` +
    `1. Go to **Teacher Portal → Content**.\n` +
    `2. Open the lesson you want.\n` +
    `3. Use **Export** to download **PDF** or **PowerPoint (PPTX slides)**.\n\n` +
    `Tell me the lesson title (or paste the first few words), and I can help you locate the right one.`
  );
}

function normalizePromptChoiceText(input: string): string {
  return String(input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectPlannerWeeklyPrepChoice(message: string): PlannerWeeklyPrepChoice {
  const normalized = normalizePromptChoiceText(message);
  if (!normalized) return null;

  if (/^1(?:\b|$)/.test(normalized)) return 'tell_more';
  if (/^2(?:\b|$)/.test(normalized)) return 'generate_now';

  const tellMorePatterns: RegExp[] = [
    /\b(?:tell me more|ask me more|ask me a few questions|ask me questions)\b/,
    /\b(?:let me add|i want to add|i need to add|i would like to add)\b[\s\S]*\b(?:context|details|info|information)\b/,
    /\b(?:more context|more details|more info|more information|additional context)\b/,
    /\b(?:before you generate|before generating|don't generate yet|do not generate yet|not yet)\b/,
    /\b(?:hold off|wait a sec|wait a second|pause for now|let me think|thinking)\b/,
    /\b(?:let's discuss|keep discussing|talk it through|clarify first|i need to clarify|i want to explain)\b/,
  ];

  const generateNowPatterns: RegExp[] = [
    /\b(?:generate(?: it| now)?|create(?: it| now)?|build(?: it| now)?|make(?: it| now)?|draft(?: it| now)?)\b/,
    /\b(?:go ahead|proceed|continue|do it|run with it|ship it|send it)\b/,
    /\b(?:use|based on)\s+(?:what|the)\s+(?:you|u)\s+(?:know|have)\b/,
    /\b(?:no more questions|no follow up|no followups|skip follow up|skip followups)\b/,
    /\b(?:that's enough info|that is enough info|ready now|good to generate|ready to generate)\b/,
  ];

  if (tellMorePatterns.some((pattern) => pattern.test(normalized))) return 'tell_more';
  if (generateNowPatterns.some((pattern) => pattern.test(normalized))) return 'generate_now';
  return null;
}

function isBriefAcknowledgement(message: string): boolean {
  const normalized = normalizePromptChoiceText(message);
  if (!normalized) return false;
  return /^(?:ok|okay|kk|got it|sounds good|cool|thanks|thank you|sure|yep|yeah|alright|all right)$/i.test(normalized);
}

function buildPlannerWeeklyPrepPromptActionResult(
  mode: PlanningAutonomy,
  stage: 'initial' | 'details' = 'initial'
): NonNullable<AgentResponse['actionResult']> {
  const modeLabel = mode === PlanningAutonomy.AUTOPILOT ? 'Autopilot' : 'Planner';
  const preview =
    stage === 'details'
      ? `Share any must-haves for this week, or say "generate now" and I'll build it immediately.`
      : `Would you like to tell me more about the lessons, or should I generate the week based on what I know now?`;

  return {
    type: PLANNER_WEEKLY_PREP_PROMPT_TYPE,
    content: {
      mode: modeLabel,
      stage,
      options: [
        {
          id: 'tell_more',
          label: 'Tell me more first',
          hint: 'Add context before I build the week',
          send: 'Tell me more first. Ask me a few questions before generating weekly prep.',
        },
        {
          id: 'generate_now',
          label: 'Generate now',
          hint: 'Use what you know and open my calendar',
          send: 'Generate my weekly prep now using what you already know.',
        },
      ],
    },
    preview,
  };
}

async function buildWeeklyPrepGenerationActionResult(
  teacherId: string
): Promise<NonNullable<AgentResponse['actionResult']>> {
  const { prepId, weekLabel } = await weeklyPrepService.initiateWeeklyPrep(teacherId, {
    triggeredBy: 'chat',
    forceCreate: true,
  });
  await queueWeeklyPrep({ prepId, teacherId, triggeredBy: 'chat' });

  return {
    type: 'weekly_prep',
    content: { prepId, weekLabel },
    preview: `I'm generating your weekly prep package for "${weekLabel}" now. This usually takes 2-3 minutes. You can check the progress on the Weekly Prep page.`,
    contentId: prepId,
  };
}

async function buildCalendarNavigationActionResult(
  teacherId: string,
  sessionMessages: AgentChatMessage[],
  message: string,
  opts?: { forceFresh?: boolean }
): Promise<NonNullable<AgentResponse['actionResult']>> {
  const navigationIntent = detectPlannerNavigationIntent(message);
  const forceFresh = opts?.forceFresh ?? navigationIntent.forceFresh;

  if (!forceFresh) {
    const existingPrepId = findRecentSessionWeeklyPrepId(sessionMessages);
    if (existingPrepId) {
      return {
        type: 'weekly_prep',
        content: { prepId: existingPrepId },
        preview: 'Opening your calendar now.',
        contentId: existingPrepId,
      };
    }
  }

  const { prepId, weekLabel } = await weeklyPrepService.initiateWeeklyPrep(teacherId, {
    triggeredBy: 'chat',
    forceCreate: true,
  });
  await queueWeeklyPrep({ prepId, teacherId, triggeredBy: 'chat' });

  return {
    type: 'weekly_prep',
    content: { prepId, weekLabel },
    preview: `Opening your calendar for "${weekLabel}" now.`,
    contentId: prepId,
  };
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
// SUGGESTED REPLIES (deterministic, no LLM call)
// ============================================

function formatSubjectName(subject: string): string {
  return subject
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function computeSuggestedReplies(
  intent: IntentType,
  actionResult: AgentResponse['actionResult'] | undefined,
  classrooms: Array<{ subject?: string | null }> | undefined,
  hasPriorAssistantMessages: boolean
): string[] {
  let replies: string[] = [];
  const suppressContextualReplies =
    actionResult?.type === 'quiz' ||
    actionResult?.type === 'flashcards' ||
    actionResult?.type === 'lesson' ||
    actionResult?.type === 'sub_plan' ||
    actionResult?.type === 'iep' ||
    actionResult?.type === 'weekly_prep' ||
    actionResult?.type === 'coach_weekly_prep_prompt' ||
    actionResult?.type === PLANNER_WEEKLY_PREP_PROMPT_TYPE;

  if (suppressContextualReplies) {
    if (hasPriorAssistantMessages) {
      return [IEP_GOALS_QUICK_REPLY];
    }
    return [];
  }

  const subjects = (classrooms || [])
    .map((c) => c.subject)
    .filter((s): s is string => !!s);
  const uniqueSubjects = [...new Set(subjects)];

  // Generate lesson/quiz/flashcards intent where AI is likely asking for details
  if (
    intent === 'generate_lesson' ||
    intent === 'generate_quiz' ||
    intent === 'generate_flashcards'
  ) {
    if (uniqueSubjects.length > 0) {
      replies = [
        ...uniqueSubjects.slice(0, 3).map(formatSubjectName),
        "I'll type the topic",
      ];
    } else {
      replies = [];
    }
  } else if (intent === 'chat') {
    // Chat intent -- offer common tasks, subject-aware if possible
    if (uniqueSubjects.length > 0) {
      replies = uniqueSubjects.slice(0, 3).map(formatSubjectName);
    } else if (!hasPriorAssistantMessages) {
      replies = ['Create a lesson', 'Make a quiz', 'Plan my week'];
    }
  }

  // After the initial assistant answer in a session, always offer a fixed IEP handoff chip.
  if (hasPriorAssistantMessages && !replies.includes(IEP_GOALS_QUICK_REPLY)) {
    replies = [IEP_GOALS_QUICK_REPLY, ...replies];
  }

  return replies;
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
  const hasPriorAssistantMessages = session.messages.some((m) => m.role === MessageRole.ASSISTANT);

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
  const navigationIntent = detectPlannerNavigationIntent(message);
  const trimmed = String(message || '').trim();
  const recentAssistant = session.messages.find((m) => m.role === MessageRole.ASSISTANT);
  const recentActionType =
    recentAssistant && typeof (recentAssistant as any).actionType === 'string'
      ? (recentAssistant as any).actionType
      : (recentAssistant as any)?.actionResult && typeof (recentAssistant as any).actionResult === 'object'
        ? String(((recentAssistant as any).actionResult as any).type || '')
        : '';
  const planningMode = (agent.planningAutonomy || PlanningAutonomy.COACH) as PlanningAutonomy;
  const isCoach = planningMode === PlanningAutonomy.COACH;
  const isPlannerOrAutopilot =
    planningMode === PlanningAutonomy.PLANNER || planningMode === PlanningAutonomy.AUTOPILOT;
  const fromCoachWeeklyPrompt = recentActionType === 'coach_weekly_prep_prompt';
  const fromPlannerWeeklyPrompt = recentActionType === PLANNER_WEEKLY_PREP_PROMPT_TYPE;
  const plannerPromptChoice = detectPlannerWeeklyPrepChoice(trimmed);
  if (commandResult) {
    assistantContent = commandResult.assistantContent;
    intent = { type: commandResult.intent, confidence: 1, extractedParams: {} };
    totalTokens = commandResult.tokensUsed;
  } else if (isPlannerOrAutopilot && fromPlannerWeeklyPrompt) {
    const shouldKeepDiscussing =
      plannerPromptChoice === 'tell_more' || isBriefAcknowledgement(trimmed) || /\?$/.test(trimmed);
    if (shouldKeepDiscussing) {
      assistantContent =
        `Perfect. Tell me anything you'd like me to account for this week (subjects, standards, pacing, assessments, accommodations, or special events).\n\n` +
        `When you're ready, say **"generate now"** and I'll take you to the calendar.`;
      actionResult = buildPlannerWeeklyPrepPromptActionResult(planningMode, 'details');
      intent = { type: 'chat', confidence: 1, extractedParams: {} };
      totalTokens = 0;
    } else {
      actionResult = await buildWeeklyPrepGenerationActionResult(teacherId);
      assistantContent = actionResult.preview;
      intent = { type: 'weekly_prep', confidence: 1, extractedParams: {} };
      totalTokens = 0;
    }
  } else if (isPlannerOrAutopilot && navigationIntent.isNavigation) {
    assistantContent =
      `Before I open Weekly Prep, would you like to tell me more about the lessons, or should I generate the week based on what I know now?\n\n` +
      `Reply with **1) Tell me more first** or **2) Generate now**.`;
    actionResult = buildPlannerWeeklyPrepPromptActionResult(planningMode, 'initial');
    intent = { type: 'chat', confidence: 1, extractedParams: {} };
    totalTokens = 0;
  } else if (navigationIntent.isNavigation) {
    actionResult = await buildCalendarNavigationActionResult(teacherId, session.messages, message, {
      forceFresh: navigationIntent.forceFresh,
    });
    assistantContent = 'Opening your calendar now.';
    intent = { type: 'open_calendar', confidence: 1, extractedParams: {} };
    totalTokens = 0;
  } else {
    // Coach-mode follow-ups: allow quick numeric confirmation from the Coach weekly-planning prompt.
    const wantsGenerateWeeklyPrep =
      /^2\b/.test(trimmed) ||
      detectPlannerWeeklyPrepChoice(trimmed) === 'generate_now' ||
      /\b(?:generate|create|make)\b[\s\S]*\bweekly\s+prep\b/i.test(trimmed);

    if (isCoach && fromCoachWeeklyPrompt && wantsGenerateWeeklyPrep) {
      const { prepId, weekLabel, existed } = await weeklyPrepService.initiateWeeklyPrep(teacherId, {
        triggeredBy: 'chat',
      });

      if (!existed) {
        await queueWeeklyPrep({ prepId, teacherId, triggeredBy: 'chat' });
      }
      actionResult = {
        type: 'weekly_prep',
        content: { prepId, weekLabel },
        preview: existed
          ? `Opening your weekly prep for "${weekLabel}" now.`
          : `I'm generating your weekly prep package for "${weekLabel}" now. This usually takes 2-3 minutes. You can check the progress on the Weekly Prep page.`,
        contentId: prepId,
      };
      assistantContent = actionResult.preview;
      intent = { type: 'weekly_prep', confidence: 1, extractedParams: {} };
      totalTokens = 0;
    } else {
    // 5. Assemble context
    const context = await contextAssemblerService.assembleChatContext(teacherId, sessionId);

    // 5b. Pre-classify: detect common weekly-prep phrases before LLM call
    const WEEKLY_PREP_REQUEST_RE = /\b(?:plan\s+my\s+week|plan\s+this\s+week|plan\s+the\s+week|help\s+me\s+plan\s+(?:my|this|the)\s+week|prepare?\s+(?:my|this|the)\s+week)\b/i;
    const isExplicitWeeklyPrepRequest = WEEKLY_PREP_REQUEST_RE.test(message);

    // 6. Classify intent
    const recentMessages = session.messages
      .reverse()
      .slice(-5)
      .map((m) => ({ role: m.role, content: m.content }));

    if (isExplicitWeeklyPrepRequest) {
      intent = { type: 'weekly_prep', confidence: 1, extractedParams: {} };
    } else {
      intent = await taskRouterService.classifyIntent(
        message,
        recentMessages,
        context.identityContext
      );
    }

    logger.info('Intent classified', { teacherId, sessionId, intent: intent.type, confidence: intent.confidence });

    // 7. Route to handler
    if (intent.type === 'open_calendar' && intent.confidence >= 0.6) {
      if (isPlannerOrAutopilot) {
        assistantContent =
          `Before I open Weekly Prep, would you like to tell me more about the lessons, or should I generate the week based on what I know now?\n\n` +
          `Reply with **1) Tell me more first** or **2) Generate now**.`;
        actionResult = buildPlannerWeeklyPrepPromptActionResult(planningMode, 'initial');
        totalTokens = 0;
        intent = { type: 'chat', confidence: 1, extractedParams: {} };
      } else {
        actionResult = await buildCalendarNavigationActionResult(teacherId, session.messages, message);
        assistantContent = 'Opening your calendar now.';
      }
    } else if (intent.type === 'export' && intent.confidence >= 0.6) {
      assistantContent = buildExportHelpMessage();
      totalTokens = 0;
    } else if (
      intent.type === 'weekly_prep' &&
      intent.confidence >= 0.6 &&
      isPlannerOrAutopilot
    ) {
      assistantContent =
        `Before I generate this week, would you like to tell me more about the lessons, or should I generate based on what I know now?\n\n` +
        `Reply with **1) Tell me more first** or **2) Generate now**.`;
      totalTokens = 0;
      actionResult = buildPlannerWeeklyPrepPromptActionResult(planningMode, 'initial');
      intent = { type: 'chat', confidence: 1, extractedParams: {} };
    } else if (
      intent.type === 'weekly_prep' &&
      intent.confidence >= 0.6 &&
      isCoach
    ) {
      // Coach mode should suggest options before taking planning actions.
      assistantContent =
        `In **Coach** mode, I'll suggest options and you choose what to generate.\n\n` +
        `Pick one:\n` +
        `1) **Quick outline** (goals + pacing + what to teach each day)\n` +
        `2) **Generate Weekly Prep** (build the calendar + materials package)\n` +
        `3) **Focus on one subject** (tell me which subject + grade)\n\n` +
        `Reply with **1**, **2**, or **3**.`;
      totalTokens = 0;
      actionResult = {
        type: 'coach_weekly_prep_prompt',
        content: {
          options: [
            { id: 'outline', label: 'Quick outline', hint: 'Goals + pacing + what to teach each day', send: 'Give me a quick outline for my week (no materials yet).' },
            { id: 'weekly_prep', label: 'Generate Weekly Prep', hint: 'Build the calendar + materials package', takeToCalendar: true },
            { id: 'one_subject', label: 'Focus on one subject', hint: 'Tell me which subject + grade', send: "Let's plan one subject. Ask me what subject and grade first." },
          ],
        },
        preview: 'Choose how you want to plan this week.',
      };
      // Treat this as chat so analytics/feedback don't mark it as content generation.
      intent = { type: 'chat', confidence: 1, extractedParams: {} };
    } else if (intent.type !== 'chat' && intent.type !== 'export' && intent.type !== 'unknown' && intent.confidence >= 0.6) {
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

  // 11. Compute suggested replies (deterministic, no LLM call)
  const suggestedReplies = computeSuggestedReplies(
    intent.type,
    persistedActionResult,
    (agent as any).classrooms,
    hasPriorAssistantMessages
  );

  return {
    message: assistantContent,
    sessionId,
    messageId: assistantMessage.id,
    interactionId: interaction.id,
    sessionTitle: updatedSession.title,
    intent: intent.type,
    actionResult: persistedActionResult,
    tokensUsed: totalTokens,
    suggestedReplies,
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
      const actionResult = await buildWeeklyPrepGenerationActionResult(teacherId);
      return {
        content: actionResult.content,
        preview: actionResult.preview,
        tokensUsed: 0,
        contentType: 'weekly_prep',
        contentId: actionResult.contentId,
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
