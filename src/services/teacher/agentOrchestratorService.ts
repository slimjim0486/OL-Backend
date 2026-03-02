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
import { agentContentBridge } from './agentContentBridge.js';
import { agentFlowPolicy } from './agentFlowPolicy.js';
import type { AgentFlowType } from './agentFlowPolicy.js';
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
const COACH_WEEKLY_PREP_PROMPT_TYPE = 'coach_weekly_prep_prompt';
const IEP_GOALS_QUICK_REPLY = 'Generate IEP goals';
const LESSON_FOLLOWUP_PROMPT_TYPE = 'lesson_followup_prompt';
const QUIZ_FOLLOWUP_PROMPT_TYPE = 'quiz_followup_prompt';
const FLASHCARDS_FOLLOWUP_PROMPT_TYPE = 'flashcards_followup_prompt';
const SUB_PLAN_FOLLOWUP_PROMPT_TYPE = 'sub_plan_followup_prompt';
const IEP_FOLLOWUP_PROMPT_TYPE = 'iep_followup_prompt';

// Map follow-up prompt types to their generation intent for rerouting
const CONTENT_FOLLOWUP_REROUTE: Record<string, IntentType> = {
  [QUIZ_FOLLOWUP_PROMPT_TYPE]: 'generate_quiz',
  [FLASHCARDS_FOLLOWUP_PROMPT_TYPE]: 'generate_flashcards',
  [SUB_PLAN_FOLLOWUP_PROMPT_TYPE]: 'generate_sub_plan',
  [IEP_FOLLOWUP_PROMPT_TYPE]: 'generate_iep',
};

type PlannerWeeklyPrepChoice = 'tell_more' | 'generate_now' | null;
type CoachWeeklyPrepChoice = 'outline' | 'generate_weekly_prep' | 'one_subject' | null;
type LessonMissingField = 'topic' | 'subject' | 'gradeLevel';
type QuizMissingField = 'topic' | 'gradeLevel';
type FlashcardsMissingField = 'topic' | 'gradeLevel';
type SubPlanMissingField = 'subject' | 'gradeLevel';
type IepMissingField = 'disabilityCategory' | 'subjectArea' | 'gradeLevel';

interface LessonPrefill {
  title?: string;
  subject?: string;
  gradeLevel?: string;
  curriculum?: string;
  lessonType?: 'guide' | 'full';
  objectives?: string[];
  summary?: string;
}

interface QuizPrefill {
  topic?: string;
  subject?: string;
  gradeLevel?: string;
  questionCount?: number;
  difficulty?: string;
  questionTypes?: string[];
  isWorksheet?: boolean;
}

interface FlashcardsPrefill {
  topic?: string;
  subject?: string;
  gradeLevel?: string;
  cardCount?: number;
  includeHints?: boolean;
}

interface SubPlanPrefill {
  title?: string;
  subject?: string;
  gradeLevel?: string;
  date?: string;
  timePeriod?: string;
  classroomNotes?: string;
  emergencyProcedures?: string;
  helpfulStudents?: string;
  additionalNotes?: string;
}

interface IepPrefill {
  disabilityCategory?: string;
  subjectArea?: string;
  gradeLevel?: string;
  presentLevels?: string;
  studentName?: string;
  additionalContext?: string;
}

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

function detectCoachWeeklyPrepChoice(message: string): CoachWeeklyPrepChoice {
  const normalized = normalizePromptChoiceText(message);
  if (!normalized) return null;

  if (/^1(?:\b|$)/.test(normalized)) return 'outline';
  if (/^2(?:\b|$)/.test(normalized)) return 'generate_weekly_prep';
  if (/^3(?:\b|$)/.test(normalized)) return 'one_subject';

  const outlinePatterns: RegExp[] = [
    /\b(?:quick outline|outline|pacing outline|weekly outline)\b/,
    /\b(?:goals?\s+\+\s+pacing|goals and pacing)\b/,
  ];

  const generateNowPatterns: RegExp[] = [
    /\b(?:generate(?: it| now)?|create(?: it| now)?|build(?: it| now)?|make(?: it| now)?|draft(?: it| now)?)\b[\s\S]{0,30}\b(?:weekly prep|week)\b/,
    /\b(?:open|take me to|go to|show me)\b[\s\S]{0,30}\b(?:weekly prep|calendar|planner|schedule)\b/,
    /\b(?:ready to generate|generate now|open it now)\b/,
  ];

  const oneSubjectPatterns: RegExp[] = [
    /\b(?:one subject|focus on one subject|specific subject|subject first)\b/,
    /\b(?:focus on|let'?s plan)\b[\s\S]{0,20}\b(?:reading|math|science|english|ela|social studies|history)\b/,
  ];

  if (outlinePatterns.some((pattern) => pattern.test(normalized))) return 'outline';
  if (generateNowPatterns.some((pattern) => pattern.test(normalized))) return 'generate_weekly_prep';
  if (oneSubjectPatterns.some((pattern) => pattern.test(normalized))) return 'one_subject';

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

function buildCoachWeeklyPrepPromptActionResult(
  stage: 'initial' | 'one_subject_details' = 'initial'
): NonNullable<AgentResponse['actionResult']> {
  const options =
    stage === 'one_subject_details'
      ? [
          {
            id: 'generate_weekly_prep',
            label: 'Generate Weekly Prep',
            hint: 'Open weekly prep now using this focus',
            send: 'Generate my weekly prep now using this focus.',
          },
          {
            id: 'add_details',
            label: 'Add one more detail',
            hint: 'Add pacing, standards, or constraints first',
            send: 'I want to add one more detail before generating weekly prep.',
          },
        ]
      : [
          {
            id: 'outline',
            label: 'Quick outline',
            hint: 'Goals + pacing + what to teach each day',
            send: 'Give me a quick outline for my week (no materials yet).',
          },
          {
            id: 'weekly_prep',
            label: 'Generate Weekly Prep',
            hint: 'Build the calendar + materials package',
            send: 'Generate my weekly prep now.',
          },
          {
            id: 'one_subject',
            label: 'Focus on one subject',
            hint: 'Tell me which subject + grade first',
            send: "Let's plan one subject. Ask me what subject and grade first.",
          },
        ];

  return {
    type: 'coach_weekly_prep_prompt',
    content: { stage, options },
    preview:
      stage === 'one_subject_details'
        ? 'Ready to open Weekly Prep when you are.'
        : 'Choose how you want to plan this week.',
  };
}

function buildFlowLockMessage(
  activeFlow: AgentFlowType,
  blockedFlow: Exclude<AgentFlowType, null>
): string {
  const current = agentFlowPolicy.describeFlow(activeFlow);
  const blocked = agentFlowPolicy.describeFlow(blockedFlow);
  const switchPhrase =
    blockedFlow === 'weekly_prep'
      ? 'weekly prep'
      : blockedFlow === 'sub_plan'
        ? 'sub plans'
        : blockedFlow === 'flashcards'
          ? 'flashcards'
          : blockedFlow === 'iep'
            ? 'iep goals'
            : blockedFlow;

  if (activeFlow === 'weekly_prep') {
    return (
      `You're currently in **${current}** flow. ` +
      `To switch to **${blocked}**, say **"switch to ${switchPhrase}"**.\n\n` +
      `Or say **"generate now"** to keep going in Weekly Prep.\n\n` +
      `If this keeps getting stuck on an older flow, start this request in a **new chat**.`
    );
  }

  return (
    `You're currently in **${current}** flow. ` +
    `To switch to **${blocked}**, say **"switch to ${switchPhrase}"**.\n\n` +
    `If this keeps getting stuck on an older flow, start this request in a **new chat**.`
  );
}

function shouldEnforceFlowLock(activeFlow: AgentFlowType, recentActionType: string): boolean {
  if (!activeFlow) return false;
  if (activeFlow !== 'weekly_prep') return false;
  return recentActionType === COACH_WEEKLY_PREP_PROMPT_TYPE || recentActionType === PLANNER_WEEKLY_PREP_PROMPT_TYPE;
}

function buildFlowContinuationActionResult(
  flow: AgentFlowType,
  planningMode: PlanningAutonomy
): AgentResponse['actionResult'] | undefined {
  if (flow !== 'weekly_prep') return undefined;
  if (planningMode === PlanningAutonomy.PLANNER || planningMode === PlanningAutonomy.AUTOPILOT) {
    return buildPlannerWeeklyPrepPromptActionResult(planningMode, 'details');
  }
  return buildCoachWeeklyPrepPromptActionResult('one_subject_details');
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

function normalizeLessonSubject(value: unknown): string | undefined {
  const raw = String(value || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_');
  if (!raw) return undefined;
  if (Object.values(Subject).includes(raw as Subject)) return raw;

  const aliasMap: Record<string, string> = {
    MATHEMATICS: 'MATH',
    MATHS: 'MATH',
    LANGUAGE_ARTS: 'ENGLISH',
    ELA: 'ENGLISH',
    LITERATURE: 'ENGLISH',
    SOCIAL_STUDIES: 'SOCIAL_STUDIES',
    HISTORY: 'HISTORY',
    GEOGRAPHY: 'GEOGRAPHY',
    CIVICS: 'SOCIAL_STUDIES',
    COMPUTER_SCIENCE: 'COMPUTER_SCIENCE',
    CS: 'COMPUTER_SCIENCE',
    PE: 'PHYSICAL_EDUCATION',
  };

  const mapped = aliasMap[raw];
  if (mapped && Object.values(Subject).includes(mapped as Subject)) return mapped;
  return undefined;
}

function normalizeLessonGradeLevel(value: unknown): string | undefined {
  const raw = String(value || '').trim().toUpperCase();
  if (!raw) return undefined;
  if (raw === 'K' || raw === 'KINDERGARTEN') return 'K';

  const numericMatch =
    raw.match(/\b(?:GRADE|GR)\s*(\d{1,2})\b/) ||
    raw.match(/\b(\d{1,2})(?:ST|ND|RD|TH)?\s*GRADE\b/) ||
    raw.match(/\b(\d{1,2})\b/);
  const numeric = numericMatch?.[1];
  if (!numeric) return undefined;
  const gradeNumber = Number.parseInt(numeric, 10);
  if (!Number.isFinite(gradeNumber) || gradeNumber < 1 || gradeNumber > 12) return undefined;
  return String(gradeNumber);
}

function normalizeLessonType(value: unknown): 'guide' | 'full' | undefined {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return undefined;
  if (raw === 'full' || raw === 'full_lesson' || raw === 'comprehensive') return 'full';
  if (raw === 'guide' || raw === 'lesson_guide' || raw === 'outline') return 'guide';
  return undefined;
}

function normalizeLessonTopic(value: unknown): string {
  let topic = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!topic) return '';

  topic = topic
    .replace(/^(?:please\s+)?(?:can|could|would)\s+you\s+/i, '')
    .replace(/^(?:help\s+me(?:\s+to)?|i\s+need\s+to|i\s+want\s+to)\s+/i, '')
    .replace(/^(?:create|make|generate|build|draft|plan)\s+(?:me\s+)?(?:a\s+|an\s+|the\s+)?/i, '')
    .replace(/\blesson(?:\s+plan)?\b/gi, ' ')
    .replace(/^(?:on|about|for)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  return truncate(topic, 140);
}

function isMeaningfulLessonTopic(value: unknown): boolean {
  const topic = normalizeLessonTopic(value);
  if (!topic || topic.length < 3) return false;
  const normalized = normalizePromptChoiceText(topic);
  if (!normalized) return false;
  if (
    /^(?:general|new|lesson|topic|anything|something|whatever|class|classwork|work|teach|teaching)$/i.test(
      normalized
    )
  ) {
    return false;
  }
  if (/^(?:i|we)\s+(?:need|want|would|will)\b/.test(normalized)) return false;
  if (/\blesson\b/.test(normalized) && normalized.split(' ').length <= 2) return false;
  return true;
}

function normalizeObjectives(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .slice(0, 8);
}

function mergePrefillSummary(previous?: string, next?: string): string | undefined {
  const previousText = String(previous || '').trim();
  const nextText = String(next || '').trim();
  if (!previousText && !nextText) return undefined;
  if (!previousText) return truncate(nextText, 1800);
  if (!nextText) return truncate(previousText, 1800);
  if (previousText.toLowerCase().includes(nextText.toLowerCase())) return truncate(previousText, 1800);
  if (nextText.toLowerCase().includes(previousText.toLowerCase())) return truncate(nextText, 1800);
  return truncate(`${previousText}\n${nextText}`, 1800);
}

function buildLessonPrefillFromIntent(
  message: string,
  extractedParams: Record<string, any>
): LessonPrefill {
  const topicFromIntent = normalizeLessonTopic(
    extractedParams.topic || extractedParams.title || extractedParams.lessonTopic
  );
  const topicFromMessage = normalizeLessonTopic(message);
  const topic = isMeaningfulLessonTopic(topicFromIntent)
    ? topicFromIntent
    : isMeaningfulLessonTopic(topicFromMessage)
      ? topicFromMessage
      : '';

  const summaryFromParams = String(extractedParams.additionalContext || extractedParams.notes || '').trim();
  const summaryFromMessage = String(message || '').trim();
  const summary = mergePrefillSummary(summaryFromParams, summaryFromMessage);

  return {
    title: topic || undefined,
    subject: normalizeLessonSubject(extractedParams.subject),
    gradeLevel: normalizeLessonGradeLevel(extractedParams.gradeLevel),
    curriculum: String(extractedParams.curriculum || '').trim() || undefined,
    lessonType: normalizeLessonType(extractedParams.lessonType),
    objectives: normalizeObjectives(extractedParams.objectives),
    summary,
  };
}

function extractLessonPrefillFromActionResult(
  actionResult: Prisma.JsonValue | null | undefined
): LessonPrefill {
  if (!actionResult || typeof actionResult !== 'object' || Array.isArray(actionResult)) return {};
  const resultObj = actionResult as Record<string, any>;
  const content = resultObj?.content && typeof resultObj.content === 'object' ? resultObj.content : {};
  const prefill =
    content?.prefill && typeof content.prefill === 'object' && !Array.isArray(content.prefill)
      ? content.prefill
      : {};

  return {
    title: normalizeLessonTopic(prefill.title || prefill.topic || content.title || content.topic) || undefined,
    subject: normalizeLessonSubject(prefill.subject || content.subject),
    gradeLevel: normalizeLessonGradeLevel(prefill.gradeLevel || content.gradeLevel),
    curriculum: String(prefill.curriculum || content.curriculum || '').trim() || undefined,
    lessonType: normalizeLessonType(prefill.lessonType || content.lessonType),
    objectives: normalizeObjectives(prefill.objectives || content.objectives),
    summary: String(prefill.summary || content.summary || '').trim() || undefined,
  };
}

function mergeLessonPrefill(previous: LessonPrefill, current: LessonPrefill): LessonPrefill {
  const previousTopic = normalizeLessonTopic(previous.title);
  const currentTopic = normalizeLessonTopic(current.title);
  const mergedTopic = isMeaningfulLessonTopic(currentTopic)
    ? currentTopic
    : isMeaningfulLessonTopic(previousTopic)
      ? previousTopic
      : '';

  return {
    title: mergedTopic || undefined,
    subject: current.subject || previous.subject,
    gradeLevel: current.gradeLevel || previous.gradeLevel,
    curriculum: current.curriculum || previous.curriculum,
    lessonType: current.lessonType || previous.lessonType || 'guide',
    objectives:
      (Array.isArray(current.objectives) && current.objectives.length > 0
        ? current.objectives
        : previous.objectives) || [],
    summary: mergePrefillSummary(previous.summary, current.summary),
  };
}

function getMissingLessonFields(prefill: LessonPrefill): LessonMissingField[] {
  const missing: LessonMissingField[] = [];
  if (!isMeaningfulLessonTopic(prefill.title)) missing.push('topic');
  if (!prefill.subject) missing.push('subject');
  if (!prefill.gradeLevel) missing.push('gradeLevel');
  return missing;
}

function buildLessonFollowUpQuestion(missing: LessonMissingField[]): string {
  const missingSet = new Set(missing);
  if (missingSet.has('topic') && missingSet.has('subject') && missingSet.has('gradeLevel')) {
    return `Before I set up your lesson, what topic, subject, and grade level should I use?`;
  }
  if (missingSet.has('topic') && missingSet.has('subject')) {
    return `Before I set this up, what topic and subject should this lesson cover?`;
  }
  if (missingSet.has('topic') && missingSet.has('gradeLevel')) {
    return `Before I set this up, what topic and grade level should I use?`;
  }
  if (missingSet.has('subject') && missingSet.has('gradeLevel')) {
    return `What subject and grade level should this lesson target?`;
  }
  if (missingSet.has('topic')) {
    return `What specific topic should this lesson cover?`;
  }
  if (missingSet.has('subject')) {
    return `What subject is this lesson for?`;
  }
  return `What grade level is this lesson for?`;
}

function buildLessonFollowUpActionResult(
  prefill: LessonPrefill,
  missing: LessonMissingField[],
  question: string
): NonNullable<AgentResponse['actionResult']> {
  return {
    type: LESSON_FOLLOWUP_PROMPT_TYPE,
    content: {
      prefill,
      missingFields: missing,
    },
    preview: question,
  };
}

function buildLessonRedirectActionResult(
  prefill: LessonPrefill,
  missing: LessonMissingField[]
): NonNullable<AgentResponse['actionResult']> {
  const title = isMeaningfulLessonTopic(prefill.title) ? normalizeLessonTopic(prefill.title) : '';
  const summary = String(prefill.summary || '').trim();
  const preview =
    missing.length === 0
      ? `Great, that's enough to get started. Opening Lesson Generator with your details now.`
      : `I have enough to start. Opening Lesson Generator with prefilled details so you can finish any missing fields quickly.`;

  return {
    type: 'lesson',
    content: {
      title: title || undefined,
      subject: prefill.subject,
      gradeLevel: prefill.gradeLevel,
      curriculum: prefill.curriculum,
      lessonType: prefill.lessonType || 'guide',
      objectives: prefill.objectives || [],
      summary: summary || undefined,
      missingFields: missing,
      prefillingSource: 'agent_chat',
    },
    preview,
  };
}

// ============================================
// QUIZ PREFILL & REDIRECT HELPERS
// ============================================

function normalizeQuizTopic(value: unknown): string {
  let topic = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!topic) return '';
  topic = topic
    .replace(/^(?:please\s+)?(?:can|could|would)\s+you\s+/i, '')
    .replace(/^(?:help\s+me(?:\s+to)?|i\s+need\s+to|i\s+want\s+to)\s+/i, '')
    .replace(/^(?:create|make|generate|build|draft)\s+(?:me\s+)?(?:a\s+|an\s+|the\s+)?/i, '')
    .replace(/\b(?:quiz|test|assessment|exit ticket|exam|worksheet|work sheet|practice sheet|practice problems)\b/gi, ' ')
    .replace(/^(?:on|about|for)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return truncate(topic, 140);
}

function isMeaningfulTopic(value: unknown): boolean {
  const topic = String(value || '').replace(/\s+/g, ' ').trim();
  if (!topic || topic.length < 3) return false;
  const normalized = normalizePromptChoiceText(topic);
  if (!normalized) return false;
  if (/^(?:general|new|topic|anything|something|whatever|class|classwork|work)$/i.test(normalized)) return false;
  if (/^(?:i|we)\s+(?:need|want|would|will)\b/.test(normalized)) return false;
  return true;
}

const WORKSHEET_KEYWORD_RE = /\b(?:worksheet|work sheet|practice sheet|practice problems)\b/i;

function buildQuizPrefillFromIntent(message: string, extractedParams: Record<string, any>): QuizPrefill {
  const topicFromIntent = normalizeQuizTopic(extractedParams.topic || extractedParams.title);
  const topicFromMessage = normalizeQuizTopic(message);
  const topic = isMeaningfulTopic(topicFromIntent)
    ? topicFromIntent
    : isMeaningfulTopic(topicFromMessage)
      ? topicFromMessage
      : '';

  const isWorksheet = WORKSHEET_KEYWORD_RE.test(message);

  return {
    topic: topic || undefined,
    subject: normalizeLessonSubject(extractedParams.subject),
    gradeLevel: normalizeLessonGradeLevel(extractedParams.gradeLevel),
    questionCount: extractedParams.count ? Number(extractedParams.count) : undefined,
    difficulty: extractedParams.difficulty || undefined,
    questionTypes: Array.isArray(extractedParams.questionTypes) ? extractedParams.questionTypes : undefined,
    isWorksheet,
  };
}

function extractQuizPrefillFromActionResult(actionResult: Prisma.JsonValue | null | undefined): QuizPrefill {
  if (!actionResult || typeof actionResult !== 'object' || Array.isArray(actionResult)) return {};
  const resultObj = actionResult as Record<string, any>;
  const content = resultObj?.content && typeof resultObj.content === 'object' ? resultObj.content : {};
  const prefill = content?.prefill && typeof content.prefill === 'object' ? content.prefill : {};
  return {
    topic: normalizeQuizTopic(prefill.topic || content.topic) || undefined,
    subject: normalizeLessonSubject(prefill.subject || content.subject),
    gradeLevel: normalizeLessonGradeLevel(prefill.gradeLevel || content.gradeLevel),
    questionCount: prefill.questionCount || content.questionCount || undefined,
    difficulty: prefill.difficulty || content.difficulty || undefined,
    questionTypes: prefill.questionTypes || content.questionTypes || undefined,
    isWorksheet: prefill.isWorksheet || content.isWorksheet || undefined,
  };
}

function mergeQuizPrefill(previous: QuizPrefill, current: QuizPrefill): QuizPrefill {
  return {
    topic: (isMeaningfulTopic(current.topic) ? current.topic : previous.topic) || undefined,
    subject: current.subject || previous.subject,
    gradeLevel: current.gradeLevel || previous.gradeLevel,
    questionCount: current.questionCount || previous.questionCount,
    difficulty: current.difficulty || previous.difficulty,
    questionTypes: current.questionTypes || previous.questionTypes,
    isWorksheet: current.isWorksheet || previous.isWorksheet,
  };
}

function getMissingQuizFields(prefill: QuizPrefill): QuizMissingField[] {
  const missing: QuizMissingField[] = [];
  if (!isMeaningfulTopic(prefill.topic)) missing.push('topic');
  if (!prefill.gradeLevel) missing.push('gradeLevel');
  return missing;
}

function buildQuizFollowUpQuestion(missing: QuizMissingField[], isWorksheet?: boolean): string {
  const label = isWorksheet ? 'worksheet' : 'quiz';
  const generator = isWorksheet ? 'Worksheet Generator' : 'Quiz Generator';
  const missingSet = new Set(missing);
  if (missingSet.has('topic') && missingSet.has('gradeLevel')) {
    return `Before I open the ${generator}, what topic and grade level should this ${label} cover?`;
  }
  if (missingSet.has('topic')) return `What topic should this ${label} cover?`;
  return `What grade level is this ${label} for?`;
}

function buildQuizFollowUpActionResult(
  prefill: QuizPrefill,
  missing: QuizMissingField[],
  question: string
): NonNullable<AgentResponse['actionResult']> {
  return {
    type: QUIZ_FOLLOWUP_PROMPT_TYPE,
    content: { prefill, missingFields: missing },
    preview: question,
  };
}

function buildQuizRedirectActionResult(prefill: QuizPrefill): NonNullable<AgentResponse['actionResult']> {
  const topic = isMeaningfulTopic(prefill.topic) ? normalizeQuizTopic(prefill.topic) : '';
  const generator = prefill.isWorksheet ? 'Worksheet Generator' : 'Quiz Generator';
  const parts: string[] = [];
  if (topic) parts.push(`on **${topic}**`);
  if (prefill.gradeLevel) parts.push(`for grade ${prefill.gradeLevel}`);
  if (prefill.subject) parts.push(`(${prefill.subject})`);
  if (prefill.questionCount) parts.push(`with ${prefill.questionCount} questions`);
  const detail = parts.length > 0 ? ` ${parts.join(' ')}` : '';
  const preview = `Opening the ${generator}${detail} now.`;

  return {
    type: 'quiz',
    content: {
      topic: topic || undefined,
      subject: prefill.subject,
      gradeLevel: prefill.gradeLevel,
      questionCount: prefill.questionCount,
      difficulty: prefill.difficulty,
      questionTypes: prefill.questionTypes,
      isWorksheet: prefill.isWorksheet || undefined,
      prefillingSource: 'agent_chat',
    },
    preview,
  };
}

// ============================================
// FLASHCARDS PREFILL & REDIRECT HELPERS
// ============================================

function buildFlashcardsPrefillFromIntent(message: string, extractedParams: Record<string, any>): FlashcardsPrefill {
  const topicRaw = normalizeQuizTopic(extractedParams.topic || extractedParams.title);
  const topicFromMsg = normalizeQuizTopic(message);
  const topic = isMeaningfulTopic(topicRaw) ? topicRaw : isMeaningfulTopic(topicFromMsg) ? topicFromMsg : '';

  return {
    topic: topic || undefined,
    subject: normalizeLessonSubject(extractedParams.subject),
    gradeLevel: normalizeLessonGradeLevel(extractedParams.gradeLevel),
    cardCount: extractedParams.count ? Number(extractedParams.count) : undefined,
    includeHints: extractedParams.includeHints ?? undefined,
  };
}

function extractFlashcardsPrefillFromActionResult(actionResult: Prisma.JsonValue | null | undefined): FlashcardsPrefill {
  if (!actionResult || typeof actionResult !== 'object' || Array.isArray(actionResult)) return {};
  const resultObj = actionResult as Record<string, any>;
  const content = resultObj?.content && typeof resultObj.content === 'object' ? resultObj.content : {};
  const prefill = content?.prefill && typeof content.prefill === 'object' ? content.prefill : {};
  return {
    topic: normalizeQuizTopic(prefill.topic || content.topic) || undefined,
    subject: normalizeLessonSubject(prefill.subject || content.subject),
    gradeLevel: normalizeLessonGradeLevel(prefill.gradeLevel || content.gradeLevel),
    cardCount: prefill.cardCount || content.cardCount || undefined,
    includeHints: prefill.includeHints ?? content.includeHints ?? undefined,
  };
}

function mergeFlashcardsPrefill(previous: FlashcardsPrefill, current: FlashcardsPrefill): FlashcardsPrefill {
  return {
    topic: (isMeaningfulTopic(current.topic) ? current.topic : previous.topic) || undefined,
    subject: current.subject || previous.subject,
    gradeLevel: current.gradeLevel || previous.gradeLevel,
    cardCount: current.cardCount || previous.cardCount,
    includeHints: current.includeHints ?? previous.includeHints,
  };
}

function getMissingFlashcardsFields(prefill: FlashcardsPrefill): FlashcardsMissingField[] {
  const missing: FlashcardsMissingField[] = [];
  if (!isMeaningfulTopic(prefill.topic)) missing.push('topic');
  if (!prefill.gradeLevel) missing.push('gradeLevel');
  return missing;
}

function buildFlashcardsFollowUpQuestion(missing: FlashcardsMissingField[]): string {
  const missingSet = new Set(missing);
  if (missingSet.has('topic') && missingSet.has('gradeLevel')) {
    return `Before I open the Flashcard Generator, what topic and grade level should these flashcards cover?`;
  }
  if (missingSet.has('topic')) return `What topic should these flashcards cover?`;
  return `What grade level are these flashcards for?`;
}

function buildFlashcardsFollowUpActionResult(
  prefill: FlashcardsPrefill,
  missing: FlashcardsMissingField[],
  question: string
): NonNullable<AgentResponse['actionResult']> {
  return {
    type: FLASHCARDS_FOLLOWUP_PROMPT_TYPE,
    content: { prefill, missingFields: missing },
    preview: question,
  };
}

function buildFlashcardsRedirectActionResult(prefill: FlashcardsPrefill): NonNullable<AgentResponse['actionResult']> {
  const topic = isMeaningfulTopic(prefill.topic) ? normalizeQuizTopic(prefill.topic) : '';
  const parts: string[] = [];
  if (topic) parts.push(`on **${topic}**`);
  if (prefill.gradeLevel) parts.push(`for grade ${prefill.gradeLevel}`);
  if (prefill.subject) parts.push(`(${prefill.subject})`);
  const detail = parts.length > 0 ? ` ${parts.join(' ')}` : '';
  const preview = `Opening the Flashcard Generator${detail} now.`;

  return {
    type: 'flashcards',
    content: {
      topic: topic || undefined,
      subject: prefill.subject,
      gradeLevel: prefill.gradeLevel,
      cardCount: prefill.cardCount,
      includeHints: prefill.includeHints,
      prefillingSource: 'agent_chat',
    },
    preview,
  };
}

// ============================================
// SUB PLAN PREFILL & REDIRECT HELPERS
// ============================================

function buildSubPlanPrefillFromIntent(message: string, extractedParams: Record<string, any>): SubPlanPrefill {
  return {
    title: String(extractedParams.title || '').trim() || undefined,
    subject: normalizeLessonSubject(extractedParams.subject),
    gradeLevel: normalizeLessonGradeLevel(extractedParams.gradeLevel),
    date: String(extractedParams.date || '').trim().slice(0, 10) || undefined,
    timePeriod: String(extractedParams.timePeriod || '').trim() || undefined,
    classroomNotes: String(extractedParams.classroomNotes || '').trim() || undefined,
    emergencyProcedures: String(extractedParams.emergencyProcedures || '').trim() || undefined,
    helpfulStudents: String(extractedParams.helpfulStudents || '').trim() || undefined,
    additionalNotes: String(extractedParams.additionalContext || extractedParams.notes || message || '').trim() || undefined,
  };
}

function extractSubPlanPrefillFromActionResult(actionResult: Prisma.JsonValue | null | undefined): SubPlanPrefill {
  if (!actionResult || typeof actionResult !== 'object' || Array.isArray(actionResult)) return {};
  const resultObj = actionResult as Record<string, any>;
  const content = resultObj?.content && typeof resultObj.content === 'object' ? resultObj.content : {};
  const prefill = content?.prefill && typeof content.prefill === 'object' ? content.prefill : {};
  return {
    title: String(prefill.title || content.title || '').trim() || undefined,
    subject: normalizeLessonSubject(prefill.subject || content.subject),
    gradeLevel: normalizeLessonGradeLevel(prefill.gradeLevel || content.gradeLevel),
    date: String(prefill.date || content.date || '').trim().slice(0, 10) || undefined,
    timePeriod: String(prefill.timePeriod || content.timePeriod || '').trim() || undefined,
    classroomNotes: String(prefill.classroomNotes || content.classroomNotes || '').trim() || undefined,
    emergencyProcedures: String(prefill.emergencyProcedures || content.emergencyProcedures || '').trim() || undefined,
    helpfulStudents: String(prefill.helpfulStudents || content.helpfulStudents || '').trim() || undefined,
    additionalNotes: String(prefill.additionalNotes || content.additionalNotes || '').trim() || undefined,
  };
}

function mergeSubPlanPrefill(previous: SubPlanPrefill, current: SubPlanPrefill): SubPlanPrefill {
  return {
    title: current.title || previous.title,
    subject: current.subject || previous.subject,
    gradeLevel: current.gradeLevel || previous.gradeLevel,
    date: current.date || previous.date,
    timePeriod: current.timePeriod || previous.timePeriod,
    classroomNotes: current.classroomNotes || previous.classroomNotes,
    emergencyProcedures: current.emergencyProcedures || previous.emergencyProcedures,
    helpfulStudents: current.helpfulStudents || previous.helpfulStudents,
    additionalNotes: mergePrefillSummary(previous.additionalNotes, current.additionalNotes),
  };
}

function getMissingSubPlanFields(prefill: SubPlanPrefill): SubPlanMissingField[] {
  const missing: SubPlanMissingField[] = [];
  if (!prefill.subject) missing.push('subject');
  if (!prefill.gradeLevel) missing.push('gradeLevel');
  return missing;
}

function buildSubPlanFollowUpQuestion(missing: SubPlanMissingField[]): string {
  const missingSet = new Set(missing);
  if (missingSet.has('subject') && missingSet.has('gradeLevel')) {
    return `Before I open Sub Plans, what subject and grade level do you need covered?`;
  }
  if (missingSet.has('subject')) return `What subject does this sub plan need to cover?`;
  return `What grade level is this sub plan for?`;
}

function buildSubPlanFollowUpActionResult(
  prefill: SubPlanPrefill,
  missing: SubPlanMissingField[],
  question: string
): NonNullable<AgentResponse['actionResult']> {
  return {
    type: SUB_PLAN_FOLLOWUP_PROMPT_TYPE,
    content: { prefill, missingFields: missing },
    preview: question,
  };
}

function buildSubPlanRedirectActionResult(prefill: SubPlanPrefill): NonNullable<AgentResponse['actionResult']> {
  const parts: string[] = [];
  if (prefill.subject) parts.push(`for **${prefill.subject}**`);
  if (prefill.gradeLevel) parts.push(`grade ${prefill.gradeLevel}`);
  if (prefill.date) parts.push(`on ${prefill.date}`);
  const detail = parts.length > 0 ? ` ${parts.join(' ')}` : '';
  const preview = `Opening Sub Plans${detail} now.`;

  return {
    type: 'sub_plan',
    content: {
      title: prefill.title,
      subject: prefill.subject,
      gradeLevel: prefill.gradeLevel,
      date: prefill.date,
      timePeriod: prefill.timePeriod || 'full_day',
      classroomNotes: prefill.classroomNotes,
      emergencyProcedures: prefill.emergencyProcedures,
      helpfulStudents: prefill.helpfulStudents,
      additionalNotes: prefill.additionalNotes,
      prefillingSource: 'agent_chat',
    },
    preview,
  };
}

// ============================================
// IEP PREFILL & REDIRECT HELPERS
// ============================================

function buildIepPrefillFromIntent(message: string, extractedParams: Record<string, any>): IepPrefill {
  return {
    disabilityCategory: String(extractedParams.disabilityCategory || '').trim() || undefined,
    subjectArea: String(extractedParams.subjectArea || '').trim() || undefined,
    gradeLevel: normalizeLessonGradeLevel(extractedParams.gradeLevel),
    presentLevels: String(extractedParams.presentLevels || '').trim() || undefined,
    studentName: String(extractedParams.studentName || extractedParams.studentIdentifier || '').trim() || undefined,
    additionalContext: String(extractedParams.additionalContext || message || '').trim() || undefined,
  };
}

function extractIepPrefillFromActionResult(actionResult: Prisma.JsonValue | null | undefined): IepPrefill {
  if (!actionResult || typeof actionResult !== 'object' || Array.isArray(actionResult)) return {};
  const resultObj = actionResult as Record<string, any>;
  const content = resultObj?.content && typeof resultObj.content === 'object' ? resultObj.content : {};
  const prefill = content?.prefill && typeof content.prefill === 'object' ? content.prefill : {};
  return {
    disabilityCategory: String(prefill.disabilityCategory || content.disabilityCategory || '').trim() || undefined,
    subjectArea: String(prefill.subjectArea || content.subjectArea || '').trim() || undefined,
    gradeLevel: normalizeLessonGradeLevel(prefill.gradeLevel || content.gradeLevel),
    presentLevels: String(prefill.presentLevels || content.presentLevels || '').trim() || undefined,
    studentName: String(prefill.studentName || content.studentName || '').trim() || undefined,
    additionalContext: String(prefill.additionalContext || content.additionalContext || '').trim() || undefined,
  };
}

function mergeIepPrefill(previous: IepPrefill, current: IepPrefill): IepPrefill {
  return {
    disabilityCategory: current.disabilityCategory || previous.disabilityCategory,
    subjectArea: current.subjectArea || previous.subjectArea,
    gradeLevel: current.gradeLevel || previous.gradeLevel,
    presentLevels: current.presentLevels || previous.presentLevels,
    studentName: current.studentName || previous.studentName,
    additionalContext: mergePrefillSummary(previous.additionalContext, current.additionalContext),
  };
}

function getMissingIepFields(prefill: IepPrefill): IepMissingField[] {
  const missing: IepMissingField[] = [];
  if (!prefill.disabilityCategory) missing.push('disabilityCategory');
  if (!prefill.subjectArea) missing.push('subjectArea');
  if (!prefill.gradeLevel) missing.push('gradeLevel');
  return missing;
}

function buildIepFollowUpQuestion(missing: IepMissingField[]): string {
  const missingSet = new Set(missing);
  if (missingSet.size === 3) {
    return `Before I open IEP Goals, I need a few details: What is the student's disability category, the focus area (e.g., reading, math, social skills), and grade level?`;
  }
  if (missingSet.has('disabilityCategory') && missingSet.has('subjectArea')) {
    return `What is the student's disability category and the focus area for these IEP goals?`;
  }
  if (missingSet.has('disabilityCategory') && missingSet.has('gradeLevel')) {
    return `What is the student's disability category and grade level?`;
  }
  if (missingSet.has('subjectArea') && missingSet.has('gradeLevel')) {
    return `What focus area and grade level should these IEP goals target?`;
  }
  if (missingSet.has('disabilityCategory')) return `What is the student's disability category?`;
  if (missingSet.has('subjectArea')) return `What focus area should these IEP goals target (e.g., reading, math, social skills)?`;
  return `What grade level is the student in?`;
}

function buildIepFollowUpActionResult(
  prefill: IepPrefill,
  missing: IepMissingField[],
  question: string
): NonNullable<AgentResponse['actionResult']> {
  return {
    type: IEP_FOLLOWUP_PROMPT_TYPE,
    content: { prefill, missingFields: missing },
    preview: question,
  };
}

function buildIepRedirectActionResult(prefill: IepPrefill): NonNullable<AgentResponse['actionResult']> {
  const parts: string[] = [];
  if (prefill.subjectArea) parts.push(`for **${prefill.subjectArea}**`);
  if (prefill.gradeLevel) parts.push(`grade ${prefill.gradeLevel}`);
  if (prefill.studentName) parts.push(`(${prefill.studentName})`);
  const detail = parts.length > 0 ? ` ${parts.join(' ')}` : '';
  const preview = `Opening IEP Goals${detail} now.`;

  return {
    type: 'iep',
    content: {
      disabilityCategory: prefill.disabilityCategory,
      subjectArea: prefill.subjectArea,
      gradeLevel: prefill.gradeLevel,
      presentLevels: prefill.presentLevels,
      studentName: prefill.studentName,
      additionalContext: prefill.additionalContext,
      prefillingSource: 'agent_chat',
    },
    preview,
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
  hasPriorAssistantMessages: boolean,
  activeFlow: AgentFlowType
): string[] {
  // Keep flow CTA surface strict: once a flow is active, the action cards should drive the flow.
  if (activeFlow) return [];

  let replies: string[] = [];
  const suppressContextualReplies =
    actionResult?.type === 'quiz' ||
    actionResult?.type === 'flashcards' ||
    actionResult?.type === 'lesson' ||
    actionResult?.type === LESSON_FOLLOWUP_PROMPT_TYPE ||
    actionResult?.type === QUIZ_FOLLOWUP_PROMPT_TYPE ||
    actionResult?.type === FLASHCARDS_FOLLOWUP_PROMPT_TYPE ||
    actionResult?.type === SUB_PLAN_FOLLOWUP_PROMPT_TYPE ||
    actionResult?.type === IEP_FOLLOWUP_PROMPT_TYPE ||
    actionResult?.type === 'sub_plan' ||
    actionResult?.type === 'iep' ||
    actionResult?.type === 'audio' ||
    actionResult?.type === 'communications' ||
    actionResult?.type === 'weekly_prep' ||
    actionResult?.type === 'coach_weekly_prep_prompt' ||
    actionResult?.type === PLANNER_WEEKLY_PREP_PROMPT_TYPE;

  if (suppressContextualReplies) {
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

  // Only show IEP handoff after concrete content-generation outputs.
  // Avoid showing it during weekly prep navigation/prompt flows or general chat.
  const shouldOfferIepQuickReply =
    hasPriorAssistantMessages &&
    (actionResult?.type === 'lesson' ||
      actionResult?.type === 'quiz' ||
      actionResult?.type === 'flashcards' ||
      actionResult?.type === 'sub_plan');

  if (shouldOfferIepQuickReply && !replies.includes(IEP_GOALS_QUICK_REPLY)) {
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
  const activeFlow = agentFlowPolicy.deriveActiveFlowFromMessages(session.messages);

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
  let bridgeHandledInteraction = false;
  let intent: { type: IntentType; confidence: number; extractedParams: Record<string, any> } = {
    type: 'chat',
    confidence: 1,
    extractedParams: {},
  };

  const commandResult = await maybeHandleSlashCommand(teacherId, agent as any, message);
  const navigationIntent = detectPlannerNavigationIntent(message);
  const trimmed = String(message || '').trim();
  const explicitSwitchTarget = agentFlowPolicy.detectExplicitFlowSwitch(trimmed);
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
  const fromCoachWeeklyPrompt = recentActionType === COACH_WEEKLY_PREP_PROMPT_TYPE;
  const fromPlannerWeeklyPrompt = recentActionType === PLANNER_WEEKLY_PREP_PROMPT_TYPE;
  const plannerPromptChoice = detectPlannerWeeklyPrepChoice(trimmed);
  const coachPromptChoice = detectCoachWeeklyPrepChoice(trimmed);
  const switchingAwayFromActiveFlow = Boolean(
    activeFlow && explicitSwitchTarget && explicitSwitchTarget !== activeFlow
  );
  if (commandResult) {
    assistantContent = commandResult.assistantContent;
    intent = { type: commandResult.intent, confidence: 1, extractedParams: {} };
    totalTokens = commandResult.tokensUsed;
  } else if (isPlannerOrAutopilot && fromPlannerWeeklyPrompt && !switchingAwayFromActiveFlow) {
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
    // Coach-mode weekly prompt follow-ups: keep this path in weekly prep unless the teacher
    // explicitly chooses quick outline.
    const wantsGenerateWeeklyPrep =
      coachPromptChoice === 'generate_weekly_prep' ||
      /^2\b/.test(trimmed) ||
      plannerPromptChoice === 'generate_now' ||
      /\b(?:generate|create|make)\b[\s\S]*\bweekly\s+prep\b/i.test(trimmed);

    if (isCoach && fromCoachWeeklyPrompt && !switchingAwayFromActiveFlow && coachPromptChoice !== 'outline') {
      if (wantsGenerateWeeklyPrep) {
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
        const normalized = normalizePromptChoiceText(trimmed);
        const providedSubjectFocus =
          coachPromptChoice === 'one_subject' ||
          /\b(?:reading|math|science|english|ela|social studies|history|subject|grade|fluency|comprehension|vocabulary|fiction|nonfiction)\b/i.test(
            normalized
          );
        assistantContent = providedSubjectFocus
          ? `Perfect. I'll focus Weekly Prep around that. Reply **"generate now"** and I'll open your weekly prep view, or add one more must-have first.`
          : `I can open Weekly Prep as soon as you're ready. Reply **"generate now"**, or share one subject + grade to focus first.`;
        actionResult = buildCoachWeeklyPrepPromptActionResult(
          providedSubjectFocus ? 'one_subject_details' : 'initial'
        );
        intent = { type: 'chat', confidence: 1, extractedParams: {} };
        totalTokens = 0;
      }
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

    // Re-route follow-up answers to content setup prompts.
    // When a teacher replies to a follow-up prompt (e.g., "5th grade" after "What grade level?"),
    // the task router may classify it as 'chat'. Override with the correct generation intent.
    const followUpTarget = CONTENT_FOLLOWUP_REROUTE[recentActionType];
    if (followUpTarget && intent.type === 'chat' && !switchingAwayFromActiveFlow) {
      intent = { type: followUpTarget, confidence: 0.8, extractedParams: intent.extractedParams };
      logger.info('Rerouted follow-up answer to content intent', { teacherId, from: 'chat', to: followUpTarget });
    }

    const flowLock = shouldEnforceFlowLock(activeFlow, recentActionType)
      ? agentFlowPolicy.applyFlowLock({
          activeFlow,
          explicitSwitchTarget,
          intentType: intent.type,
        })
      : { intentType: intent.type, blockedCrossFlowTarget: null };
    const blockedCrossFlowTarget = flowLock.blockedCrossFlowTarget;
    if (flowLock.intentType !== intent.type) {
      logger.info('Flow lock blocked implicit cross-flow switch', {
        teacherId,
        sessionId,
        activeFlow,
        blockedCrossFlowTarget,
        originalIntent: intent.type,
      });
      intent = {
        ...intent,
        type: flowLock.intentType,
        confidence: 1,
      };
    }

    // 7. Route to handler
    if (blockedCrossFlowTarget) {
      assistantContent = buildFlowLockMessage(activeFlow, blockedCrossFlowTarget);
      actionResult = buildFlowContinuationActionResult(activeFlow, planningMode);
      totalTokens = 0;
      intent = { type: 'chat', confidence: 1, extractedParams: {} };

    // ── LESSON ──
    } else if (intent.type === 'generate_lesson' && intent.confidence >= 0.6) {
      const priorLessonPrefill =
        recentActionType === LESSON_FOLLOWUP_PROMPT_TYPE
          ? extractLessonPrefillFromActionResult(
              (recentAssistant as any)?.actionResult as Prisma.JsonValue | null | undefined
            )
          : {};
      const currentLessonPrefill = buildLessonPrefillFromIntent(message, intent.extractedParams);
      const mergedLessonPrefill = mergeLessonPrefill(priorLessonPrefill, currentLessonPrefill);
      const missingLessonFields = getMissingLessonFields(mergedLessonPrefill);
      const followUpAlreadyAsked = recentActionType === LESSON_FOLLOWUP_PROMPT_TYPE;

      if (!followUpAlreadyAsked && missingLessonFields.length > 0) {
        const followUpQuestion = buildLessonFollowUpQuestion(missingLessonFields);
        assistantContent = followUpQuestion;
        actionResult = buildLessonFollowUpActionResult(
          mergedLessonPrefill,
          missingLessonFields,
          followUpQuestion
        );
      } else {
        try {
          const bridgeResult = await agentContentBridge.generateLessonWithContext(
            teacherId,
            { type: 'generate_lesson', confidence: intent.confidence, extractedParams: { ...mergedLessonPrefill } },
            sessionId
          );
          actionResult = { type: 'lesson', content: bridgeResult.content, preview: bridgeResult.preview, contentId: bridgeResult.contentId, interactionId: bridgeResult.interactionId };
          assistantContent = bridgeResult.preview;
          totalTokens = bridgeResult.tokensUsed;
          bridgeHandledInteraction = true;
        } catch (err) {
          logger.error('In-chat lesson generation failed', { error: err, teacherId });
          assistantContent = `I ran into an issue generating your lesson. You can try again or use the Lesson page directly.`;
        }
      }
      intent = { type: 'chat', confidence: 1, extractedParams: {} };

    // ── QUIZ ──
    } else if (intent.type === 'generate_quiz' && intent.confidence >= 0.6) {
      const priorQuizPrefill =
        recentActionType === QUIZ_FOLLOWUP_PROMPT_TYPE
          ? extractQuizPrefillFromActionResult(
              (recentAssistant as any)?.actionResult as Prisma.JsonValue | null | undefined
            )
          : {};
      const currentQuizPrefill = buildQuizPrefillFromIntent(message, intent.extractedParams);
      const mergedQuizPrefill = mergeQuizPrefill(priorQuizPrefill, currentQuizPrefill);
      const missingQuizFields = getMissingQuizFields(mergedQuizPrefill);
      const quizFollowUpAsked = recentActionType === QUIZ_FOLLOWUP_PROMPT_TYPE;

      if (!quizFollowUpAsked && missingQuizFields.length > 0) {
        const followUpQuestion = buildQuizFollowUpQuestion(missingQuizFields, mergedQuizPrefill.isWorksheet);
        assistantContent = followUpQuestion;
        actionResult = buildQuizFollowUpActionResult(mergedQuizPrefill, missingQuizFields, followUpQuestion);
      } else {
        try {
          const bridgeResult = await agentContentBridge.generateQuizWithContext(
            teacherId,
            { type: 'generate_quiz', confidence: intent.confidence, extractedParams: { ...mergedQuizPrefill } },
            sessionId
          );
          actionResult = { type: 'quiz', content: bridgeResult.content, preview: bridgeResult.preview, contentId: bridgeResult.contentId, interactionId: bridgeResult.interactionId };
          assistantContent = bridgeResult.preview;
          totalTokens = bridgeResult.tokensUsed;
          bridgeHandledInteraction = true;
        } catch (err) {
          logger.error('In-chat quiz generation failed', { error: err, teacherId });
          assistantContent = `I ran into an issue generating your quiz. You can try again or use the Quiz page directly.`;
        }
      }
      intent = { type: 'chat', confidence: 1, extractedParams: {} };

    // ── FLASHCARDS ──
    } else if (intent.type === 'generate_flashcards' && intent.confidence >= 0.6) {
      const priorFlashcardsPrefill =
        recentActionType === FLASHCARDS_FOLLOWUP_PROMPT_TYPE
          ? extractFlashcardsPrefillFromActionResult(
              (recentAssistant as any)?.actionResult as Prisma.JsonValue | null | undefined
            )
          : {};
      const currentFlashcardsPrefill = buildFlashcardsPrefillFromIntent(message, intent.extractedParams);
      const mergedFlashcardsPrefill = mergeFlashcardsPrefill(priorFlashcardsPrefill, currentFlashcardsPrefill);
      const missingFlashcardsFields = getMissingFlashcardsFields(mergedFlashcardsPrefill);
      const flashcardsFollowUpAsked = recentActionType === FLASHCARDS_FOLLOWUP_PROMPT_TYPE;

      if (!flashcardsFollowUpAsked && missingFlashcardsFields.length > 0) {
        const followUpQuestion = buildFlashcardsFollowUpQuestion(missingFlashcardsFields);
        assistantContent = followUpQuestion;
        actionResult = buildFlashcardsFollowUpActionResult(mergedFlashcardsPrefill, missingFlashcardsFields, followUpQuestion);
      } else {
        try {
          const bridgeResult = await agentContentBridge.generateFlashcardsWithContext(
            teacherId,
            { type: 'generate_flashcards', confidence: intent.confidence, extractedParams: { ...mergedFlashcardsPrefill } },
            sessionId
          );
          actionResult = { type: 'flashcards', content: bridgeResult.content, preview: bridgeResult.preview, contentId: bridgeResult.contentId, interactionId: bridgeResult.interactionId };
          assistantContent = bridgeResult.preview;
          totalTokens = bridgeResult.tokensUsed;
          bridgeHandledInteraction = true;
        } catch (err) {
          logger.error('In-chat flashcards generation failed', { error: err, teacherId });
          assistantContent = `I ran into an issue generating your flashcards. You can try again or use the Flashcards page directly.`;
        }
      }
      intent = { type: 'chat', confidence: 1, extractedParams: {} };

    // ── SUB PLAN ──
    } else if (intent.type === 'generate_sub_plan' && intent.confidence >= 0.6) {
      const priorSubPlanPrefill =
        recentActionType === SUB_PLAN_FOLLOWUP_PROMPT_TYPE
          ? extractSubPlanPrefillFromActionResult(
              (recentAssistant as any)?.actionResult as Prisma.JsonValue | null | undefined
            )
          : {};
      const currentSubPlanPrefill = buildSubPlanPrefillFromIntent(message, intent.extractedParams);
      const mergedSubPlanPrefill = mergeSubPlanPrefill(priorSubPlanPrefill, currentSubPlanPrefill);
      const missingSubPlanFields = getMissingSubPlanFields(mergedSubPlanPrefill);
      const subPlanFollowUpAsked = recentActionType === SUB_PLAN_FOLLOWUP_PROMPT_TYPE;

      if (!subPlanFollowUpAsked && missingSubPlanFields.length > 0) {
        const followUpQuestion = buildSubPlanFollowUpQuestion(missingSubPlanFields);
        assistantContent = followUpQuestion;
        actionResult = buildSubPlanFollowUpActionResult(mergedSubPlanPrefill, missingSubPlanFields, followUpQuestion);
      } else {
        try {
          const bridgeResult = await agentContentBridge.generateSubPlanWithContext(
            teacherId,
            { type: 'generate_sub_plan', confidence: intent.confidence, extractedParams: { ...mergedSubPlanPrefill } },
            sessionId
          );
          actionResult = { type: 'sub_plan', content: bridgeResult.content, preview: bridgeResult.preview, contentId: bridgeResult.contentId, interactionId: bridgeResult.interactionId };
          assistantContent = bridgeResult.preview;
          totalTokens = bridgeResult.tokensUsed;
          bridgeHandledInteraction = true;
        } catch (err) {
          logger.error('In-chat sub plan generation failed', { error: err, teacherId });
          assistantContent = `I ran into an issue generating your substitute plan. You can try again or use the Sub Plans page directly.`;
        }
      }
      intent = { type: 'chat', confidence: 1, extractedParams: {} };

    // ── IEP ──
    } else if (intent.type === 'generate_iep' && intent.confidence >= 0.6) {
      const priorIepPrefill =
        recentActionType === IEP_FOLLOWUP_PROMPT_TYPE
          ? extractIepPrefillFromActionResult(
              (recentAssistant as any)?.actionResult as Prisma.JsonValue | null | undefined
            )
          : {};
      const currentIepPrefill = buildIepPrefillFromIntent(message, intent.extractedParams);
      const mergedIepPrefill = mergeIepPrefill(priorIepPrefill, currentIepPrefill);
      const missingIepFields = getMissingIepFields(mergedIepPrefill);
      const iepFollowUpAsked = recentActionType === IEP_FOLLOWUP_PROMPT_TYPE;

      if (!iepFollowUpAsked && missingIepFields.length > 0) {
        const followUpQuestion = buildIepFollowUpQuestion(missingIepFields);
        assistantContent = followUpQuestion;
        actionResult = buildIepFollowUpActionResult(mergedIepPrefill, missingIepFields, followUpQuestion);
      } else {
        try {
          const bridgeResult = await agentContentBridge.generateIEPWithContext(
            teacherId,
            { type: 'generate_iep', confidence: intent.confidence, extractedParams: { ...mergedIepPrefill } },
            sessionId
          );
          actionResult = { type: 'iep', content: bridgeResult.content, preview: bridgeResult.preview, contentId: bridgeResult.contentId, interactionId: bridgeResult.interactionId };
          assistantContent = bridgeResult.preview;
          totalTokens = bridgeResult.tokensUsed;
          bridgeHandledInteraction = true;
        } catch (err) {
          logger.error('In-chat IEP generation failed', { error: err, teacherId });
          assistantContent = `I ran into an issue generating your IEP goals. You can try again or use the IEP Goals page directly.`;
        }
      }
      intent = { type: 'chat', confidence: 1, extractedParams: {} };

    // ── CALENDAR / WEEKLY PREP ──
    } else if (intent.type === 'open_calendar' && intent.confidence >= 0.6) {
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
      assistantContent =
        `In **Coach** mode, I'll suggest options and you choose what to generate.\n\n` +
        `Pick one:\n` +
        `1) **Quick outline** (goals + pacing + what to teach each day)\n` +
        `2) **Generate Weekly Prep** (build the calendar + materials package)\n` +
        `3) **Focus on one subject** (tell me which subject + grade)\n\n` +
        `Reply with **1**, **2**, or **3**.`;
      totalTokens = 0;
      actionResult = {
        ...buildCoachWeeklyPrepPromptActionResult('initial'),
      };
      intent = { type: 'chat', confidence: 1, extractedParams: {} };

    // ── AUDIO / PARENT EMAIL / REPORT COMMENTS → simple redirect ──
    } else if (intent.type === 'generate_audio' && intent.confidence >= 0.6) {
      assistantContent = `Opening Audio Updates for you now.`;
      actionResult = {
        type: 'audio',
        content: { prefillingSource: 'agent_chat' },
        preview: assistantContent,
      };
      totalTokens = 0;
      intent = { type: 'chat', confidence: 1, extractedParams: {} };
    } else if (intent.type === 'generate_parent_email' && intent.confidence >= 0.6) {
      try {
        const bridgeResult = await agentContentBridge.generateParentEmailWithContext(
          teacherId,
          { type: 'generate_parent_email', confidence: intent.confidence, extractedParams: { ...intent.extractedParams } },
          sessionId
        );
        actionResult = { type: 'parent_email', content: bridgeResult.content, preview: bridgeResult.preview, contentId: bridgeResult.contentId, interactionId: bridgeResult.interactionId };
        assistantContent = bridgeResult.preview;
        totalTokens = bridgeResult.tokensUsed;
        bridgeHandledInteraction = true;
      } catch (err) {
        logger.error('In-chat parent email generation failed', { error: err, teacherId });
        assistantContent = `I ran into an issue generating your parent email. You can try again or use the Communications page directly.`;
      }
      intent = { type: 'chat', confidence: 1, extractedParams: {} };
    } else if (intent.type === 'generate_report_comments' && intent.confidence >= 0.6) {
      try {
        const bridgeResult = await agentContentBridge.generateReportCommentsWithContext(
          teacherId,
          { type: 'generate_report_comments', confidence: intent.confidence, extractedParams: { ...intent.extractedParams } },
          sessionId
        );
        actionResult = { type: 'report_comments', content: bridgeResult.content, preview: bridgeResult.preview, contentId: bridgeResult.contentId, interactionId: bridgeResult.interactionId };
        assistantContent = bridgeResult.preview;
        totalTokens = bridgeResult.tokensUsed;
        bridgeHandledInteraction = true;
      } catch (err) {
        logger.error('In-chat report comments generation failed', { error: err, teacherId });
        assistantContent = `I ran into an issue generating your report comments. You can try again or use the Communications page directly.`;
      }
      intent = { type: 'chat', confidence: 1, extractedParams: {} };

    // ── CONVERSATIONAL CHAT (fallback) ──
    } else {
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
  // Skip if the bridge already recorded the interaction (avoids double-recording)
  let interactionId: string;
  if (bridgeHandledInteraction && actionResult?.interactionId) {
    interactionId = actionResult.interactionId;
  } else {
    const interaction = await agentMemoryService.recordInteraction(agent.id, {
      type: intent.type === 'chat' ? AgentInteractionType.CHAT : AgentInteractionType.CONTENT_GENERATION,
      summary: truncate(message, 200),
      input: message,
      outputType: actionResult?.type || 'chat',
      outputId: actionResult?.contentId,
      tokensUsed: totalTokens,
      modelUsed: actionResult ? config.gemini.models.flash : config.gemini.models.flash,
    });
    interactionId = interaction.id;
  }

  const persistedActionResult = actionResult
    ? ({ ...actionResult, interactionId } as AgentResponse['actionResult'])
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
  const responseFlow =
    agentFlowPolicy.mapActionTypeToFlow(persistedActionResult?.type || '') ||
    (explicitSwitchTarget && explicitSwitchTarget !== activeFlow ? explicitSwitchTarget : activeFlow);
  const suggestedReplies = computeSuggestedReplies(
    intent.type,
    persistedActionResult,
    (agent as any).classrooms,
    hasPriorAssistantMessages,
    responseFlow
  );

  return {
    message: assistantContent,
    sessionId,
    messageId: assistantMessage.id,
    interactionId,
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
