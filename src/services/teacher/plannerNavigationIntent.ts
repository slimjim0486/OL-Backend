export interface PlannerNavigationIntent {
  isNavigation: boolean;
  forceFresh: boolean;
}

const TARGET_RE = /\b(?:calendar|schedule|planner|weekly prep|weekly plan|week view|planning hub|planning page|planning tab|planning screen)\b/;
const DIRECT_NAV_RE =
  /\b(?:take me to|go to|open(?: up)?(?:\s+(?:it|that|this|the|my|to|me|page|tab|screen|view|calendar|schedule|planner))?|show(?: me)?|bring me to|bring me over to|navigate to|navigate me to|head to|jump to|pull up|send me to|get me to|launch|route me to|drop me in|move me to|pop open|redirect me to)\b/;
const SEE_RE =
  /\b(?:let me see(?: it|that)?|can i see(?: it|that)?|could i see(?: it|that)?|i want to see|wanna see|i need to see)\b/;
const PLACE_RE = /\b(?:put|add)\s+(?:it|this|that|these|those)?\s*(?:on|to)\b/;
const SHORT_TARGET_RE =
  /^(?:my )?(?:(?:calendar|schedule|planner|weekly prep|weekly plan|week view)(?: (?:page|tab|screen|view|hub))?|planning (?:page|tab|screen|view|hub))(?: (?:please|now|pls))?$/;
const MODE_CHANGE_RE =
  /\b(?:\/mode|mode|switch(?: me)?|set|change)\b[\s\S]*\b(?:coach|planner|autopilot)\b/;
const MODE_LABEL_RE = /\b(?:coach|planner|autopilot)\s+mode\b/;
const NON_NAV_PLANNER_RE = /\blesson planner\b/;
const NON_NAV_CONTEXT_RE = /\b(?:example|examples|idea|ideas|template|templates|tips?|guide|guides)\b/;
const NAV_SURFACE_RE = /\b(?:page|tab|screen|view|hub)\b/;
const DEFERRED_NAV_RE =
  /\b(?:when|once|after|as soon as)\b[\s\S]{0,50}\b(?:done|ready|finish(?:ed)?|complete(?:d)?)\b/;
const FRESH_HINT_RE = /\b(?:new|fresh|another|next|upcoming)\b/;
const WEEK_REFERENCE_RE = /\bweek(?:\s*#?\s*)?\d+\b/;
const NEXT_WEEK_RE = /\bnext(?:\s+week|['’]?s\s+week)\b/;
const NEW_WEEK_RE = /\bnew\s+week\b/;

function normalizeIntentText(input: string): string {
  let text = String(input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[’‘`]/g, "'")
    .replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const replacements: Array<[RegExp, string]> = [
    [/\bweekly planner\b/g, 'weekly prep'],
    [/\bweek(?:ly)? plan(?:ner)?\b/g, 'weekly prep'],
    [/\bweekly planning\b/g, 'weekly prep'],
    [/\btimetable\b/g, 'schedule'],
    [/\bplanbook\b/g, 'planner'],
    [/\bplanning board\b/g, 'planner'],
  ];

  for (const [pattern, value] of replacements) {
    text = text.replace(pattern, value);
  }

  return text;
}

function isNavigationRequest(normalized: string): boolean {
  if (!normalized) return false;
  if (MODE_CHANGE_RE.test(normalized) || MODE_LABEL_RE.test(normalized) || NON_NAV_PLANNER_RE.test(normalized)) {
    return false;
  }
  if (NON_NAV_CONTEXT_RE.test(normalized) && !NAV_SURFACE_RE.test(normalized)) {
    return false;
  }

  if (!TARGET_RE.test(normalized)) return false;

  const hasAction = DIRECT_NAV_RE.test(normalized) || SEE_RE.test(normalized);
  const hasPlacementAction = PLACE_RE.test(normalized);
  const hasDeferredNavigation = DEFERRED_NAV_RE.test(normalized);
  const isShortTargetPrompt = SHORT_TARGET_RE.test(normalized);

  return hasAction || hasPlacementAction || hasDeferredNavigation || isShortTargetPrompt;
}

function shouldForceFreshPrep(normalized: string): boolean {
  if (!TARGET_RE.test(normalized)) return false;
  if (WEEK_REFERENCE_RE.test(normalized)) return true;
  if (NEXT_WEEK_RE.test(normalized) || NEW_WEEK_RE.test(normalized)) return true;
  return FRESH_HINT_RE.test(normalized);
}

export function detectPlannerNavigationIntent(message: string): PlannerNavigationIntent {
  const normalized = normalizeIntentText(message);
  const isNavigation = isNavigationRequest(normalized);

  if (!isNavigation) {
    return { isNavigation: false, forceFresh: false };
  }

  return {
    isNavigation: true,
    forceFresh: shouldForceFreshPrep(normalized),
  };
}
