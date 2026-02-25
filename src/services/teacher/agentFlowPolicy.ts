import type { IntentType } from './taskRouterService.js';

export type AgentFlowType =
  | 'weekly_prep'
  | 'lesson'
  | 'quiz'
  | 'flashcards'
  | 'iep'
  | 'sub_plan'
  | null;

type FlowIntentType =
  | 'weekly_prep'
  | 'open_calendar'
  | 'generate_lesson'
  | 'generate_quiz'
  | 'generate_flashcards'
  | 'generate_iep'
  | 'generate_sub_plan';

interface FlowMessageLike {
  role?: string | null;
  actionType?: string | null;
  actionResult?: unknown;
}

const FLOW_FROM_ACTION_TYPE: Record<string, Exclude<AgentFlowType, null>> = {
  weekly_prep: 'weekly_prep',
  coach_weekly_prep_prompt: 'weekly_prep',
  planner_weekly_prep_prompt: 'weekly_prep',
  lesson: 'lesson',
  lesson_followup_prompt: 'lesson',
  quiz: 'quiz',
  quiz_followup_prompt: 'quiz',
  flashcards: 'flashcards',
  flashcards_followup_prompt: 'flashcards',
  iep: 'iep',
  iep_followup_prompt: 'iep',
  sub_plan: 'sub_plan',
  sub_plan_followup_prompt: 'sub_plan',
};

const FLOW_FROM_INTENT: Partial<Record<IntentType, Exclude<AgentFlowType, null>>> = {
  weekly_prep: 'weekly_prep',
  open_calendar: 'weekly_prep',
  generate_lesson: 'lesson',
  generate_quiz: 'quiz',
  generate_flashcards: 'flashcards',
  generate_iep: 'iep',
  generate_sub_plan: 'sub_plan',
};

const FLOW_TARGET_PATTERNS: Record<Exclude<AgentFlowType, null>, RegExp> = {
  weekly_prep: /\b(?:weekly prep|weekly plan|plan my week|plan this week|planner|calendar|schedule|week view)\b/i,
  lesson: /\b(?:lesson(?:\s+plan)?|content editor)\b/i,
  quiz: /\b(?:quiz(?:zes)?|test|assessment|exit ticket|worksheet|work sheet|practice sheet|practice problems)\b/i,
  flashcards: /\b(?:flashcards?|flash cards?|study cards?|review cards?)\b/i,
  iep: /\b(?:iep(?:\s+goals?)?|special(?:\s+education|\s+ed)?\s+goals?)\b/i,
  sub_plan: /\b(?:sub(?:stitute)?\s+plans?|coverage\s+plans?|absence\s+plans?)\b/i,
};

const MANUAL_SWITCH_CUE_RE =
  /\b(?:switch|change|instead|now|let'?s|i\s+want|i\s+need|please|can\s+you|could\s+you|would\s+you|open|take\s+me\s+to|go\s+to|navigate|create|make|generate|build|draft|start)\b/i;
const REQUEST_DETAIL_CUE_RE =
  /\b(?:for|on|about|with|include|including|cover|covering|focus|focused|around|topic|subject|grade|worksheet|questions?|cards?|goals?)\b/i;
const GRADE_CUE_RE =
  /\b(?:grade\s*(?:\d{1,2}|k|pre[\s-]?k)|(?:\d{1,2}(?:st|nd|rd|th)?|k|kindergarten|pre[\s-]?k)\s*grade)\b/i;
const BARE_TARGET_ONLY_RE: Record<Exclude<AgentFlowType, null>, RegExp> = {
  weekly_prep: /^(?:weekly prep|weekly plan|planner|calendar|schedule)$/i,
  lesson: /^(?:lesson|lesson plan|content editor)$/i,
  quiz: /^(?:quiz|test|assessment|exit ticket|worksheet|work sheet|practice sheet)$/i,
  flashcards: /^(?:flashcards?|flash cards?|study cards?|review cards?)$/i,
  iep: /^(?:iep(?: goals?)?|special(?: education| ed)? goals?)$/i,
  sub_plan: /^(?:sub(?:stitute)? plans?|coverage plans?|absence plans?)$/i,
};

function extractActionType(message: FlowMessageLike): string {
  const direct = String(message?.actionType || '').trim();
  if (direct) return direct;
  const fromActionResult =
    message?.actionResult &&
    typeof message.actionResult === 'object' &&
    !Array.isArray(message.actionResult)
      ? String((message.actionResult as Record<string, unknown>)?.type || '').trim()
      : '';
  return fromActionResult;
}

function normalizeMessage(message: string): string {
  return String(message || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function mapActionTypeToFlow(actionType: string | null | undefined): AgentFlowType {
  const key = String(actionType || '').trim();
  if (!key) return null;
  return FLOW_FROM_ACTION_TYPE[key] || null;
}

export function mapIntentToFlow(intentType: IntentType): AgentFlowType {
  return FLOW_FROM_INTENT[intentType] || null;
}

export function deriveActiveFlowFromMessages(messages: FlowMessageLike[]): AgentFlowType {
  if (!Array.isArray(messages) || !messages.length) return null;

  for (const message of messages) {
    if (String(message?.role || '').toUpperCase() !== 'ASSISTANT') continue;
    const actionType = extractActionType(message);
    const flow = mapActionTypeToFlow(actionType);
    if (flow) return flow;
  }

  return null;
}

export function detectExplicitFlowSwitch(message: string): AgentFlowType {
  const normalized = normalizeMessage(message);
  if (!normalized || normalized.length < 3) return null;

  const matches = (Object.keys(FLOW_TARGET_PATTERNS) as Array<Exclude<AgentFlowType, null>>).filter((flow) =>
    FLOW_TARGET_PATTERNS[flow].test(normalized)
  );
  if (matches.length === 0) return null;
  const hasManualCue = MANUAL_SWITCH_CUE_RE.test(normalized);
  const hasSingleTargetRequestShape =
    matches.length === 1 &&
    (REQUEST_DETAIL_CUE_RE.test(normalized) ||
      GRADE_CUE_RE.test(normalized) ||
      BARE_TARGET_ONLY_RE[matches[0]].test(normalized));
  if (!hasManualCue && !hasSingleTargetRequestShape) return null;

  if (matches.length === 1) return matches[0];

  // Prefer more specific targets over weekly planner words when multiple match.
  const specificityOrder: Array<Exclude<AgentFlowType, null>> = [
    'lesson',
    'quiz',
    'flashcards',
    'iep',
    'sub_plan',
    'weekly_prep',
  ];
  return specificityOrder.find((flow) => matches.includes(flow)) || matches[0];
}

export interface FlowLockInput {
  activeFlow: AgentFlowType;
  explicitSwitchTarget: AgentFlowType;
  intentType: IntentType;
}

export interface FlowLockResult {
  intentType: IntentType;
  blockedCrossFlowTarget: AgentFlowType;
}

export function applyFlowLock(input: FlowLockInput): FlowLockResult {
  const activeFlow = input.activeFlow;
  const explicitSwitchTarget = input.explicitSwitchTarget;
  const intentType = input.intentType;
  const intentFlow = mapIntentToFlow(intentType);

  if (!activeFlow) {
    return { intentType, blockedCrossFlowTarget: null };
  }

  if (explicitSwitchTarget && explicitSwitchTarget !== activeFlow) {
    return { intentType, blockedCrossFlowTarget: null };
  }

  if (!intentFlow || intentFlow === activeFlow) {
    return { intentType, blockedCrossFlowTarget: null };
  }

  return {
    intentType: 'chat',
    blockedCrossFlowTarget: intentFlow,
  };
}

export function describeFlow(flow: AgentFlowType): string {
  switch (flow) {
    case 'weekly_prep':
      return 'Weekly Prep';
    case 'lesson':
      return 'Lesson';
    case 'quiz':
      return 'Quiz';
    case 'flashcards':
      return 'Flashcards';
    case 'iep':
      return 'IEP Goals';
    case 'sub_plan':
      return 'Sub Plans';
    default:
      return 'Chat';
  }
}

export const agentFlowPolicy = {
  mapActionTypeToFlow,
  mapIntentToFlow,
  deriveActiveFlowFromMessages,
  detectExplicitFlowSwitch,
  applyFlowLock,
  describeFlow,
};
