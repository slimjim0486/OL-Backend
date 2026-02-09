// Task Router Service — Classifies user intent via Gemini Flash function calling
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export type IntentType =
  | 'chat'
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

async function classifyIntent(
  message: string,
  recentMessages?: Array<{ role: string; content: string }>,
  agentContext?: string
): Promise<TaskIntent> {
  try {
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

    const parsed = JSON.parse(text);
    return {
      type: parsed.type || 'chat',
      confidence: Math.min(1, Math.max(0, parsed.confidence || 0.5)),
      extractedParams: parsed.extractedParams || {},
      reasoning: parsed.reasoning,
    };
  } catch (error) {
    logger.warn('Intent classification failed, defaulting to chat', { error, message });
    return {
      type: 'chat',
      confidence: 0.3,
      extractedParams: {},
      reasoning: 'Classification failed, defaulting to chat',
    };
  }
}

// ============================================
// EXPORTS
// ============================================

export const taskRouterService = {
  classifyIntent,
};
