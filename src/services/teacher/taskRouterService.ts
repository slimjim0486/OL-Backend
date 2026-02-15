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
- difficulty: Difficulty level if mentioned`;

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
  const subjectMap: Array<[RegExp, string]> = [
    [/\b(?:math|mathematics|maths)\b/, 'MATH'],
    [/\b(?:science)\b/, 'SCIENCE'],
    [/\b(?:english|ela|language arts|reading|writing|literature)\b/, 'ENGLISH'],
    [/\b(?:social studies|history|geography|civics)\b/, 'SOCIAL_STUDIES'],
    [/\b(?:arabic)\b/, 'ARABIC'],
    [/\b(?:islamic studies|quran)\b/, 'ISLAMIC_STUDIES'],
  ];
  for (const [pattern, value] of subjectMap) {
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

function ruleBasedIntent(message: string): TaskIntent | null {
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
    return { type: 'generate_sub_plan', confidence: 0.72, extractedParams: extractBasicParams(trimmed), reasoning: 'Matched brief substitute keyword heuristic' };
  }
  if (isBrief && /\b(?:iep|accommodations?|present levels|special education)\b/i.test(trimmed)) {
    return { type: 'generate_iep', confidence: 0.72, extractedParams: extractBasicParams(trimmed), reasoning: 'Matched brief IEP keyword heuristic' };
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
    const fast = ruleBasedIntent(message);
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

    return {
      type,
      confidence,
      extractedParams: parsed.extractedParams || {},
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
