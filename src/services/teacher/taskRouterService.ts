// Task Router Service — Classifies user intent via Gemini Flash function calling
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { detectPlannerNavigationIntent } from './plannerNavigationIntent.js';

// ============================================
// TYPES
// ============================================

export type IntentType =
  | 'chat'
  | 'open_calendar'
  | 'generate_lesson'
  | 'generate_quiz'
  | 'generate_flashcards'
  | 'generate_sub_plan'
  | 'generate_iep'
  | 'generate_audio'
  | 'generate_parent_email'
  | 'generate_report_comments'
  | 'update_curriculum'
  | 'weekly_prep'
  | 'export'
  | 'unknown';

export interface TaskIntent {
  type: IntentType;
  confidence: number;
  extractedParams: Record<string, any>;
  reasoning?: string;
}

// ============================================
// INTENT CLASSIFICATION
// ============================================

const CLASSIFICATION_PROMPT = `You are an intent classifier for a teacher AI assistant. Given a teacher's message, classify the intent into one of these categories:

- chat: General conversation, questions about teaching, advice, or anything that doesn't require content generation
- open_calendar: User wants to open/view the calendar, planner, weekly prep, or schedule view (keywords: open calendar, show my schedule, open planner, open weekly prep, let me see it on calendar, take me to week 9 calendar, open new calendar)
- generate_lesson: Create a lesson plan (keywords: lesson, plan, teach, unit)
- generate_quiz: Create a quiz or test (keywords: quiz, test, assessment, questions)
- generate_flashcards: Create flashcards (keywords: flashcards, review cards, study cards)
- generate_sub_plan: Create a substitute teacher plan (keywords: sub plan, substitute, absence, cover)
- generate_iep: Create IEP goals (keywords: IEP, goals, accommodation, special education)
- generate_audio: Create an audio update for parents (keywords: audio, podcast, parent update)
- generate_parent_email: Draft an email to parents (keywords: email parents, parent letter, parent communication, draft email, write email to parents)
- generate_report_comments: Generate report card comments (keywords: report card, progress report, report comments, student comments, grades comments)
- update_curriculum: Update curriculum progress or pacing (keywords: pacing, standards, covered, taught today)
- weekly_prep: Help with weekly planning (keywords: this week, plan for next week, upcoming)
- export: Export or download content (keywords: download, export, PDF, PowerPoint)

Respond with ONLY a JSON object:
{
  "type": "<intent_type>",
  "confidence": <0.0-1.0>,
  "extractedParams": { <any relevant parameters extracted from the message> },
  "reasoning": "<brief explanation>"
}

Extract relevant parameters like:
- topic: The subject/topic mentioned
- subject: Academic subject (MATH, SCIENCE, ENGLISH, etc.)
- gradeLevel: Grade level mentioned
- count: Number of items requested (e.g., "10 questions")
- difficulty: Difficulty level if mentioned

For generate_iep requests, always try to extract:
- disabilityCategory: One of IDEA categories (e.g., AUTISM_SPECTRUM, OTHER_HEALTH_IMPAIRMENT, SPECIFIC_LEARNING_DISABILITY)
- subjectArea: One IEP domain (e.g., READING_COMPREHENSION, WRITTEN_EXPRESSION, EXECUTIVE_FUNCTIONING, SOCIAL_SKILLS)
- presentLevels: Current performance statement (PLAAFP / present levels)
- strengths: Student strengths if stated
- challenges: Student challenges if stated
- studentName or studentIdentifier if provided
- additionalContext when useful

For generate_sub_plan requests, always try to extract:
- subject
- gradeLevel
- date (YYYY-MM-DD if possible)
- timePeriod (morning, afternoon, full_day)
- title
- classroomNotes / emergencyProcedures / helpfulStudents when present`;

const VALID_INTENTS: Set<IntentType> = new Set([
  'chat',
  'open_calendar',
  'generate_lesson',
  'generate_quiz',
  'generate_flashcards',
  'generate_sub_plan',
  'generate_iep',
  'generate_audio',
  'generate_parent_email',
  'generate_report_comments',
  'update_curriculum',
  'weekly_prep',
  'export',
  'unknown',
]);

function extractJSON(text: string): string {
  const normalized = String(text || '').replace(/^\uFEFF/, '').trim();
  if (!normalized) return normalized;

  const jsonBlockMatch = normalized.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (jsonBlockMatch) {
    return jsonBlockMatch[1].trim();
  }

  const jsonObjectMatch = normalized.match(/\{[\s\S]*\}/);
  if (jsonObjectMatch) {
    return jsonObjectMatch[0].trim();
  }

  return normalized;
}

function repairJSON(jsonLike: string): string {
  // Common model bug: trailing commas.
  return String(jsonLike || '').replace(/,\s*([}\]])/g, '$1');
}

function parseIntentJson(raw: string): any | null {
  const text = String(raw || '').trim();
  if (!text) return null;

  const candidates = [text, extractJSON(text)];
  for (const candidate of candidates) {
    for (const variant of [candidate, repairJSON(candidate)]) {
      try {
        const parsed = JSON.parse(variant);
        if (Array.isArray(parsed)) {
          const firstObj = parsed.find((x) => x && typeof x === 'object' && !Array.isArray(x));
          if (firstObj) return firstObj;
        }
        if (parsed && typeof parsed === 'object') return parsed;
      } catch {
        // continue
      }
    }
  }

  return null;
}

function heuristicIntent(message: string, reason: string): TaskIntent {
  const navigationIntent = detectPlannerNavigationIntent(message);
  if (navigationIntent.isNavigation) {
    return {
      type: 'open_calendar',
      confidence: navigationIntent.forceFresh ? 0.86 : 0.8,
      extractedParams: {},
      reasoning: `${reason}; detected planner navigation phrasing`,
    };
  }
  return {
    type: 'chat',
    confidence: 0.3,
    extractedParams: {},
    reasoning: reason,
  };
}

function wordCount(message: string): number {
  const normalized = String(message || '').trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).filter(Boolean).length;
}

const BASIC_SUBJECT_MAP: Array<[RegExp, string]> = [
  [/\b(?:math|mathematics|maths)\b/i, 'MATH'],
  [/\b(?:science)\b/i, 'SCIENCE'],
  [/\b(?:english|ela|language arts|reading|writing|literature)\b/i, 'ENGLISH'],
  [/\b(?:social studies|history|geography|civics)\b/i, 'SOCIAL_STUDIES'],
  [/\b(?:arabic)\b/i, 'ARABIC'],
  [/\b(?:islamic studies|quran)\b/i, 'ISLAMIC_STUDIES'],
];

function extractBasicParams(message: string): Record<string, any> {
  const text = String(message || '').trim();
  const lower = text.toLowerCase();
  const params: Record<string, any> = {};

  // Grade level
  const gradeMatch = lower.match(/\b(?:grade|gr)\s*(\d{1,2})\b/);
  if (gradeMatch) {
    params.gradeLevel = gradeMatch[1];
  } else if (/\bkindergarten\b/.test(lower)) {
    params.gradeLevel = 'K';
  }

  // Count (questions/cards/etc.)
  const countMatch = lower.match(/\b(\d{1,2})\s+(?:question|questions|cards|flashcards|items|problems)\b/);
  if (countMatch) {
    params.count = Number(countMatch[1]);
  }

  // Difficulty
  if (/\b(?:easy|beginner)\b/.test(lower)) params.difficulty = 'easy';
  else if (/\b(?:hard|challenging|advanced)\b/.test(lower)) params.difficulty = 'hard';
  else if (/\b(?:medium|intermediate)\b/.test(lower)) params.difficulty = 'medium';

  // Subject
  for (const [pattern, value] of BASIC_SUBJECT_MAP) {
    if (pattern.test(lower)) {
      params.subject = value;
      break;
    }
  }

  // Topic (best-effort for short requests)
  const topic = lower
    .replace(/\b(?:create|make|generate|draft|write|build|plan)\b/g, ' ')
    .replace(/\b(?:a|an|the|please)\b/g, ' ')
    .replace(/\b(?:quiz|test|assessment|exit ticket|exam|flashcards?|lesson|sub plan|substitute|iep|audio|podcast|email|report)\b/g, ' ')
    .replace(/\b(?:on|about|for|of)\b/g, ' ')
    .replace(/\b(?:grade|gr)\s*\d{1,2}\b/g, ' ')
    .replace(/\bkindergarten\b/g, ' ')
    .replace(/\b\d{1,2}\s+(?:question|questions|cards|flashcards|items|problems)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (topic) {
    params.topic = topic;
  }

  return params;
}

const IEP_DISABILITY_VALUE_MAP: Array<{ value: string; patterns: RegExp[] }> = [
  { value: 'AUTISM_SPECTRUM', patterns: [/\bautism\b/i, /\basd\b/i, /\bautistic\b/i] },
  { value: 'OTHER_HEALTH_IMPAIRMENT', patterns: [/\badhd\b/i, /\bohi\b/i, /\battention\b/i] },
  { value: 'SPECIFIC_LEARNING_DISABILITY', patterns: [/\bsld\b/i, /\bspecific learning disability\b/i, /\bdyslexia\b/i, /\bdysgraphia\b/i, /\bdyscalculia\b/i] },
  { value: 'SPEECH_LANGUAGE_IMPAIRMENT', patterns: [/\bspeech\b/i, /\blanguage impairment\b/i, /\barticulation\b/i] },
  { value: 'INTELLECTUAL_DISABILITY', patterns: [/\bintellectual disability\b/i] },
  { value: 'EMOTIONAL_DISTURBANCE', patterns: [/\bemotional disturbance\b/i] },
  { value: 'DEVELOPMENTAL_DELAY', patterns: [/\bdevelopmental delay\b/i] },
  { value: 'MULTIPLE_DISABILITIES', patterns: [/\bmultiple disabilities\b/i] },
  { value: 'HEARING_IMPAIRMENT', patterns: [/\bhearing impairment\b/i, /\bdeaf(?:ness)?\b/i] },
  { value: 'VISUAL_IMPAIRMENT', patterns: [/\bvisual impairment\b/i, /\bblind(?:ness)?\b/i] },
  { value: 'ORTHOPEDIC_IMPAIRMENT', patterns: [/\borthopedic\b/i] },
  { value: 'TRAUMATIC_BRAIN_INJURY', patterns: [/\btraumatic brain injury\b/i, /\btbi\b/i] },
  { value: 'DEAF_BLINDNESS', patterns: [/\bdeaf[\s-]?blind(?:ness)?\b/i] },
];

const IEP_SUBJECT_AREA_VALUE_MAP: Array<{ value: string; patterns: RegExp[] }> = [
  { value: 'READING_COMPREHENSION', patterns: [/\breading comprehension\b/i, /\bmain idea\b/i, /\binference\b/i] },
  { value: 'READING_FLUENCY', patterns: [/\breading fluency\b/i, /\bfluency\b/i] },
  { value: 'WRITTEN_EXPRESSION', patterns: [/\bwritten expression\b/i, /\bwriting\b/i] },
  { value: 'MATH_CALCULATION', patterns: [/\bmath calculation\b/i, /\bcalculation\b/i, /\bcomputation\b/i] },
  { value: 'MATH_PROBLEM_SOLVING', patterns: [/\bmath problem solving\b/i, /\bword problem\b/i, /\bproblem solving\b/i] },
  { value: 'SPEECH_ARTICULATION', patterns: [/\barticulation\b/i] },
  { value: 'EXPRESSIVE_LANGUAGE', patterns: [/\bexpressive language\b/i] },
  { value: 'RECEPTIVE_LANGUAGE', patterns: [/\breceptive language\b/i] },
  { value: 'SOCIAL_SKILLS', patterns: [/\bsocial skills?\b/i, /\bsocial interaction\b/i] },
  { value: 'BEHAVIOR_SELF_REGULATION', patterns: [/\bself[\s-]?regulation\b/i, /\bbehavior\b/i] },
  { value: 'EXECUTIVE_FUNCTIONING', patterns: [/\bexecutive functioning\b/i, /\borganization\b/i, /\bfocus\b/i, /\battention\b/i] },
  { value: 'FINE_MOTOR', patterns: [/\bfine motor\b/i] },
  { value: 'GROSS_MOTOR', patterns: [/\bgross motor\b/i] },
  { value: 'ADAPTIVE_LIVING_SKILLS', patterns: [/\badaptive\b/i, /\bdaily living\b/i] },
  { value: 'TRANSITION_VOCATIONAL', patterns: [/\btransition\b/i, /\bvocational\b/i] },
];

function normalizeGradeLevel(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const raw = String(value).trim().toLowerCase();
  if (!raw) return undefined;
  if (raw === 'kindergarten' || raw === 'k') return 'K';
  if (raw === 'pre-k' || raw === 'prek' || raw === 'pre k') return 'Pre-K';
  const gradeMatch = raw.match(/^(\d{1,2})$/);
  if (gradeMatch) return gradeMatch[1];
  const embeddedMatch = raw.match(/\b(?:grade|gr)\s*(\d{1,2})\b/);
  if (embeddedMatch) return embeddedMatch[1];
  return undefined;
}

function normalizeByPatterns(
  value: unknown,
  mapping: Array<{ value: string; patterns: RegExp[] }>
): string | undefined {
  if (value === null || value === undefined) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;
  const upper = raw.toUpperCase();
  const exact = mapping.find((item) => item.value === upper);
  if (exact) return exact.value;
  const matched = mapping.find((item) => item.patterns.some((pattern) => pattern.test(raw)));
  return matched?.value;
}

function inferByPatterns(
  text: string,
  mapping: Array<{ value: string; patterns: RegExp[] }>
): string | undefined {
  const matched = mapping.find((item) => item.patterns.some((pattern) => pattern.test(text)));
  return matched?.value;
}

function deriveIepPresentLevels(message: string, conversationText: string): string | undefined {
  const candidates = [message, conversationText]
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  for (const candidate of candidates) {
    const presentLevelMatch = candidate.match(
      /\b(?:present levels?|plaafp|impact statement)\b[:\s-]*([\s\S]{30,})/i
    );
    if (presentLevelMatch?.[1]) {
      return presentLevelMatch[1].trim().slice(0, 1400);
    }
    if (candidate.length >= 40) {
      return candidate.slice(0, 1400);
    }
  }
  return undefined;
}

function deriveIepChallenges(text: string): string | undefined {
  const challengeMatch = text.match(
    /\b(?:struggles?\s+with|has\s+difficulty\s+with|difficulty\s+with|challenge[sd]?\s+by|needs\s+support\s+with)\s+([^.;\n]+)/i
  );
  if (challengeMatch?.[1]) return challengeMatch[1].trim().slice(0, 400);
  return undefined;
}

function deriveIepStrengths(text: string): string | undefined {
  const strengthsMatch = text.match(/\bstrengths?\b[:\s-]*([^.;\n]+)/i);
  if (strengthsMatch?.[1]) return strengthsMatch[1].trim().slice(0, 400);
  return undefined;
}

function deriveStudentIdentifier(text: string): string | undefined {
  const nameMatch = text.match(/\b(?:student(?:\s+name)?|learner)\s*(?:is|:)\s*([A-Za-z][A-Za-z\s'-]{1,40})/i);
  if (!nameMatch?.[1]) return undefined;
  return nameMatch[1].trim();
}

function enrichIepExtractedParams(
  message: string,
  recentMessages: Array<{ role: string; content: string }> | undefined,
  extractedParams: Record<string, any>
): Record<string, any> {
  const merged: Record<string, any> = { ...(extractedParams || {}) };
  const conversationText = [
    ...(Array.isArray(recentMessages) ? recentMessages : [])
      .slice(-6)
      .map((m) => String(m?.content || '').trim())
      .filter(Boolean),
    String(message || '').trim(),
  ]
    .filter(Boolean)
    .join('\n');

  const normalizedGrade = normalizeGradeLevel(merged.gradeLevel) || normalizeGradeLevel(conversationText);
  if (normalizedGrade) merged.gradeLevel = normalizedGrade;

  const disability =
    normalizeByPatterns(merged.disabilityCategory, IEP_DISABILITY_VALUE_MAP) ||
    inferByPatterns(conversationText, IEP_DISABILITY_VALUE_MAP);
  if (disability) merged.disabilityCategory = disability;

  const subjectArea =
    normalizeByPatterns(merged.subjectArea, IEP_SUBJECT_AREA_VALUE_MAP) ||
    inferByPatterns(conversationText, IEP_SUBJECT_AREA_VALUE_MAP);
  if (subjectArea) merged.subjectArea = subjectArea;

  const presentLevels =
    String(merged.presentLevels || '').trim() ||
    String(merged.topic || '').trim() ||
    deriveIepPresentLevels(message, conversationText);
  if (presentLevels) merged.presentLevels = presentLevels.slice(0, 1400);

  const challenges = String(merged.challenges || '').trim() || deriveIepChallenges(conversationText);
  if (challenges) merged.challenges = challenges;

  const strengths = String(merged.strengths || '').trim() || deriveIepStrengths(conversationText);
  if (strengths) merged.strengths = strengths;

  const studentIdentifier =
    String(merged.studentIdentifier || '').trim() ||
    String(merged.studentName || '').trim() ||
    deriveStudentIdentifier(conversationText);
  if (studentIdentifier) {
    merged.studentIdentifier = studentIdentifier;
    if (!merged.studentName) merged.studentName = studentIdentifier;
  }

  if (!merged.additionalContext && conversationText) {
    merged.additionalContext = conversationText.slice(0, 1800);
  }

  return merged;
}

function normalizeSubjectValue(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;
  const upper = raw.toUpperCase();
  if (/^[A-Z_]+$/.test(upper)) return upper;
  for (const [pattern, mapped] of BASIC_SUBJECT_MAP) {
    if (pattern.test(raw)) return mapped;
  }
  return raw;
}

function inferSubjectFromText(text: string): string | undefined {
  for (const [pattern, mapped] of BASIC_SUBJECT_MAP) {
    if (pattern.test(text)) return mapped;
  }
  return undefined;
}

function normalizeTimePeriod(value: unknown): 'morning' | 'afternoon' | 'full_day' | undefined {
  if (value === null || value === undefined) return undefined;
  const raw = String(value).trim().toLowerCase();
  if (!raw) return undefined;
  if (raw === 'morning' || raw.includes('morning') || /\bam\b/.test(raw)) return 'morning';
  if (raw === 'afternoon' || raw.includes('afternoon') || /\bpm\b/.test(raw)) return 'afternoon';
  if (raw === 'full_day' || raw === 'full day' || raw === 'fullday' || raw.includes('all day')) return 'full_day';
  return undefined;
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function deriveDateFromText(text: string, now = new Date()): string | undefined {
  const normalized = String(text || '').toLowerCase();
  if (!normalized) return undefined;

  const isoMatch = normalized.match(/\b(20\d{2}-\d{1,2}-\d{1,2})\b/);
  if (isoMatch?.[1]) {
    const parsed = new Date(isoMatch[1]);
    if (!Number.isNaN(parsed.getTime())) return formatDateInput(parsed);
  }

  const mdYMatch = normalized.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
  if (mdYMatch) {
    const month = Number(mdYMatch[1]);
    const day = Number(mdYMatch[2]);
    const year = mdYMatch[3]
      ? Number(mdYMatch[3].length === 2 ? `20${mdYMatch[3]}` : mdYMatch[3])
      : now.getFullYear();
    const parsed = new Date(year, month - 1, day);
    if (!Number.isNaN(parsed.getTime())) return formatDateInput(parsed);
  }

  if (/\btoday\b/.test(normalized)) return formatDateInput(now);
  if (/\btomorrow\b/.test(normalized)) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return formatDateInput(d);
  }

  const weekdays: Array<{ name: string; index: number }> = [
    { name: 'sunday', index: 0 },
    { name: 'monday', index: 1 },
    { name: 'tuesday', index: 2 },
    { name: 'wednesday', index: 3 },
    { name: 'thursday', index: 4 },
    { name: 'friday', index: 5 },
    { name: 'saturday', index: 6 },
  ];
  const weekdayMatch = normalized.match(/\b(?:next|this|on)?\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/);
  if (weekdayMatch?.[1]) {
    const target = weekdays.find((w) => w.name === weekdayMatch[1])?.index;
    if (typeof target === 'number') {
      const d = new Date(now);
      const delta = (target - d.getDay() + 7) % 7 || 7;
      d.setDate(d.getDate() + delta);
      return formatDateInput(d);
    }
  }

  return undefined;
}

function enrichSubPlanExtractedParams(
  message: string,
  recentMessages: Array<{ role: string; content: string }> | undefined,
  extractedParams: Record<string, any>
): Record<string, any> {
  const merged: Record<string, any> = { ...(extractedParams || {}) };
  const conversationText = [
    ...(Array.isArray(recentMessages) ? recentMessages : [])
      .slice(-6)
      .map((m) => String(m?.content || '').trim())
      .filter(Boolean),
    String(message || '').trim(),
  ]
    .filter(Boolean)
    .join('\n');

  const gradeLevel = normalizeGradeLevel(merged.gradeLevel) || normalizeGradeLevel(conversationText);
  if (gradeLevel) merged.gradeLevel = gradeLevel;

  const subject =
    normalizeSubjectValue(merged.subject) ||
    inferSubjectFromText(conversationText);
  if (subject) merged.subject = subject;

  const timePeriod = normalizeTimePeriod(merged.timePeriod) || normalizeTimePeriod(conversationText);
  if (timePeriod) merged.timePeriod = timePeriod;

  const date =
    deriveDateFromText(String(merged.date || '')) ||
    deriveDateFromText(conversationText);
  if (date) merged.date = date;

  const userTitle = String(merged.title || '').trim();
  if (!userTitle) {
    const titleSubject = String(subject || '').replace(/_/g, ' ').trim() || 'Class';
    merged.title = `Sub Plan - ${titleSubject}`;
  }

  if (!merged.additionalContext && conversationText) {
    merged.additionalContext = conversationText.slice(0, 1800);
  }

  return merged;
}

function ruleBasedIntent(
  message: string,
  recentMessages?: Array<{ role: string; content: string }>
): TaskIntent | null {
  const trimmed = String(message || '').trim();
  if (!trimmed) {
    return {
      type: 'chat',
      confidence: 0.2,
      extractedParams: {},
      reasoning: 'Empty message',
    };
  }

  const navigationIntent = detectPlannerNavigationIntent(trimmed);
  if (navigationIntent.isNavigation) {
    return {
      type: 'open_calendar',
      confidence: navigationIntent.forceFresh ? 0.86 : 0.8,
      extractedParams: {},
      reasoning: 'Detected planner navigation phrasing',
    };
  }

  // Ultra-common: short replies that are almost always follow-ups. Skip the classifier for these,
  // and let the chat model interpret the reply with conversation context.
  const wc = wordCount(trimmed);
  const isBrief = wc <= 4 && trimmed.length <= 40;
  const isShortFollowUp = wc <= 4 && trimmed.length <= 20;
  if (isShortFollowUp) {
    // But don't skip if it's an obvious request keyword.
    if (!/\b(?:quiz|test|assessment|flashcard|lesson|iep|sub(?:stitute)?|weekly prep|export|download|pdf|pptx|powerpoint|slides)\b/i.test(trimmed)) {
      return {
        type: 'chat',
        confidence: 0.35,
        extractedParams: {},
        reasoning: 'Short/ambiguous reply; skipped classifier',
      };
    }
    // else fall through to keyword heuristics below
  }

  // Keyword heuristics to avoid unnecessary classifier calls and reduce "classification failed" noise.
  {
    const lower = trimmed.toLowerCase();
    const hasExportKeyword = /\b(?:export|download|pdf|pptx|powerpoint|print)\b/i.test(lower);
    const hasSlidesNoun = /\bslides?\b/i.test(lower);
    const hasFindVerb = /\b(?:where|find|locate|located|access)\b/i.test(lower);
    if (hasExportKeyword || (hasSlidesNoun && hasFindVerb)) {
      return { type: 'export', confidence: 0.72, extractedParams: {}, reasoning: 'Matched export/download heuristic' };
    }
  }
  if (/\b(?:weekly prep|plan (?:my|the) week|plan for next week|next week|this week)\b/i.test(trimmed)) {
    return { type: 'weekly_prep', confidence: 0.72, extractedParams: {}, reasoning: 'Matched weekly planning heuristic' };
  }
  if (isBrief && /\b(?:quiz|test|assessment|exit ticket|exam)\b/i.test(trimmed)) {
    return { type: 'generate_quiz', confidence: 0.72, extractedParams: extractBasicParams(trimmed), reasoning: 'Matched brief quiz keyword heuristic' };
  }
  if (isBrief && /\b(?:flashcards?|review cards?|study cards?)\b/i.test(trimmed)) {
    return { type: 'generate_flashcards', confidence: 0.72, extractedParams: extractBasicParams(trimmed), reasoning: 'Matched brief flashcards keyword heuristic' };
  }
  if (isBrief && /\b(?:sub plan|substitute|cover my class|covering|absence)\b/i.test(trimmed)) {
    return {
      type: 'generate_sub_plan',
      confidence: 0.72,
      extractedParams: enrichSubPlanExtractedParams(trimmed, recentMessages, extractBasicParams(trimmed)),
      reasoning: 'Matched brief substitute keyword heuristic',
    };
  }
  if (isBrief && /\b(?:iep|accommodations?|present levels|special education)\b/i.test(trimmed)) {
    return {
      type: 'generate_iep',
      confidence: 0.72,
      extractedParams: enrichIepExtractedParams(trimmed, recentMessages, extractBasicParams(trimmed)),
      reasoning: 'Matched brief IEP keyword heuristic',
    };
  }
  if (isBrief && /\b(?:audio|podcast|parent update)\b/i.test(trimmed)) {
    return { type: 'generate_audio', confidence: 0.68, extractedParams: extractBasicParams(trimmed), reasoning: 'Matched brief audio keyword heuristic' };
  }
  if (isBrief && /\b(?:email (?:to )?parents?|parent letter|parent communication)\b/i.test(trimmed)) {
    return { type: 'generate_parent_email', confidence: 0.68, extractedParams: extractBasicParams(trimmed), reasoning: 'Matched brief parent email keyword heuristic' };
  }
  if (isBrief && /\b(?:report card|progress report|report comments|student comments)\b/i.test(trimmed)) {
    return { type: 'generate_report_comments', confidence: 0.68, extractedParams: extractBasicParams(trimmed), reasoning: 'Matched brief report comments keyword heuristic' };
  }
  if (isBrief && /\b(?:pacing|standards|covered|taught today|curriculum)\b/i.test(trimmed)) {
    return { type: 'update_curriculum', confidence: 0.62, extractedParams: extractBasicParams(trimmed), reasoning: 'Matched brief curriculum update keyword heuristic' };
  }
  if (isBrief && /\b(?:lesson plan|lesson|unit plan|teach(?:ing)? plan)\b/i.test(trimmed)) {
    return { type: 'generate_lesson', confidence: 0.62, extractedParams: extractBasicParams(trimmed), reasoning: 'Matched brief lesson keyword heuristic' };
  }

  return null;
}

async function classifyIntent(
  message: string,
  recentMessages?: Array<{ role: string; content: string }>,
  agentContext?: string
): Promise<TaskIntent> {
  try {
    const fast = ruleBasedIntent(message, recentMessages);
    if (fast) return fast;

    const model = genAI.getGenerativeModel({
      model: config.gemini.models.flash,
      safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 300,
        responseMimeType: 'application/json',
      },
    });

    let contextStr = '';
    if (recentMessages?.length) {
      const recent = recentMessages.slice(-3);
      contextStr = `\nRecent conversation:\n${recent.map((m) => `${m.role}: ${m.content}`).join('\n')}\n`;
    }
    if (agentContext) {
      contextStr += `\nTeacher context: ${agentContext}\n`;
    }

    const prompt = `${CLASSIFICATION_PROMPT}\n${contextStr}\nTeacher's message: "${message}"`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const parsed = parseIntentJson(text);
    if (!parsed) {
      return heuristicIntent(message, 'Classifier response was not parseable; used heuristic fallback');
    }
    const rawType = String(parsed.type || 'chat') as IntentType;
    const type: IntentType = VALID_INTENTS.has(rawType) ? rawType : 'chat';
    const confidence = Math.min(1, Math.max(0, parsed.confidence || 0.5));
    const navigationIntent = detectPlannerNavigationIntent(message);

    if (navigationIntent.isNavigation && (type === 'chat' || type === 'unknown')) {
      return {
        type: 'open_calendar',
        confidence: Math.max(confidence, navigationIntent.forceFresh ? 0.88 : 0.82),
        extractedParams: parsed.extractedParams || {},
        reasoning:
          parsed.reasoning ||
          'Classifier returned chat/unknown, but navigation intent detector matched planner request',
      };
    }

    const extractedParams =
      type === 'generate_iep'
        ? enrichIepExtractedParams(message, recentMessages, parsed.extractedParams || {})
        : type === 'generate_sub_plan'
          ? enrichSubPlanExtractedParams(message, recentMessages, parsed.extractedParams || {})
        : (parsed.extractedParams || {});

    return {
      type,
      confidence,
      extractedParams,
      reasoning: parsed.reasoning,
    };
  } catch (error) {
    logger.warn('Intent classification failed, defaulting to chat', { error, message });
    return heuristicIntent(message, 'Classification failed; used heuristic fallback');
  }
}

// ============================================
// EXPORTS
// ============================================

export const taskRouterService = {
  classifyIntent,
};
