/**
 * Presenton API Service for Teacher Content
 * Generates professional PPTX presentations using Presenton AI API
 * https://docs.presenton.ai/
 */

import { TeacherContent, Subject } from '@prisma/client';

// Presenton API configuration
const PRESENTON_API_URL =
  process.env.PRESENTON_API_URL ||
  'https://api.presenton.ai/api/v1/ppt/presentation/generate';
const PRESENTON_BASE_URL =
  process.env.PRESENTON_BASE_URL || new URL(PRESENTON_API_URL).origin;
const PRESENTON_API_KEY = process.env.PRESENTON_API_KEY; // Not needed for local self-hosted

const PRESENTON_REQUEST_TIMEOUT_MS = 45000;
const PRESENTON_DOWNLOAD_TIMEOUT_MS = 60000;
const PRESENTON_MAX_RETRIES = 2;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const shouldRetryStatus = (status: number) => status >= 500 || status === 429;

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  {
    retries = PRESENTON_MAX_RETRIES,
    timeoutMs = PRESENTON_REQUEST_TIMEOUT_MS,
  }: { retries?: number; timeoutMs?: number } = {}
) {
  let attempt = 0;
  while (true) {
    try {
      const response = await fetchWithTimeout(url, options, timeoutMs);
      if (response.ok || !shouldRetryStatus(response.status) || attempt >= retries) {
        return response;
      }
    } catch (error) {
      const isAbort = error instanceof Error && error.name === 'AbortError';
      if (!isAbort && attempt >= retries) {
        throw error;
      }
      if (isAbort && attempt >= retries) {
        throw new Error('Presenton request timed out');
      }
    }

    attempt += 1;
    const delay = Math.min(2000 * Math.pow(2, attempt - 1), 10000);
    await sleep(delay);
  }
}

// Export options interface
export interface PresentonExportOptions {
  theme: 'professional-blue' | 'professional-dark' | 'edge-yellow' | 'light-rose' | 'mint-blue';
  slideStyle: 'focused' | 'dense';
  includeAnswers: boolean;
  includeTeacherNotes: boolean;
  includeInfographic: boolean;
  language: string;
}

// Presenton API request interface
interface PresentonRequest {
  content: string;
  instructions?: string;
  tone: 'default' | 'casual' | 'professional' | 'funny' | 'educational' | 'sales_pitch';
  verbosity: 'concise' | 'standard' | 'text-heavy';
  web_search: boolean;
  image_type: 'stock' | 'ai-generated';
  theme?: string;
  n_slides: number;
  language: string;
  template: string;
  include_table_of_contents: boolean;
  include_title_slide: boolean;
  export_as: 'pptx' | 'pdf';
}

// Presenton API response interface
interface PresentonResponse {
  presentation_id: string;
  path: string;
  edit_path: string;
  credits_consumed: number;
}

// Types for lesson content structure
interface LessonSection {
  title: string;
  content: string;
  duration?: number;
  activities?: (string | { name?: string; description?: string })[];
  teachingTips?: string[];
}

interface VocabularyItem {
  term: string;
  definition: string;
  example?: string;
}

interface AssessmentQuestion {
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

interface LessonContent {
  title: string;
  summary?: string;
  objectives?: string[];
  sections?: LessonSection[];
  vocabulary?: VocabularyItem[];
  assessment?: {
    questions: AssessmentQuestion[];
  };
  teacherNotes?: string;
  summaryPoints?: string[];
  prerequisites?: string[];
  nextSteps?: string;
}

// Quiz content structure (separate from lesson assessment)
interface QuizQuestion {
  id?: string;
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: string;
  points?: number;
}

interface QuizContent {
  title?: string;
  questions: QuizQuestion[];
  totalPoints?: number;
  estimatedTime?: number;
}

// Flashcard content structure
interface Flashcard {
  id?: string;
  front: string;
  back: string;
  hint?: string;
  category?: string;
}

interface FlashcardContent {
  title?: string;
  cards: Flashcard[];
}

/**
 * Truncate text to a maximum length
 */
function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format lesson content into a concise prompt for Presenton
 * Keep it simple and focused to avoid API errors
 */
function formatLessonContent(
  content: TeacherContent,
  options: PresentonExportOptions
): string {
  const lessonData = content.lessonContent as unknown as LessonContent;
  const subject = (content.subject || 'OTHER').replace('_', ' ');

  // Build a concise, structured prompt
  const parts: string[] = [];

  // Title and basic info
  parts.push(`Title: ${lessonData?.title || content.title}`);
  parts.push(`Subject: ${subject}, Grade ${content.gradeLevel}`);

  // Summary (keep it short)
  if (lessonData?.summary) {
    parts.push(`\nOverview: ${truncateText(lessonData.summary, 500)}`);
  }

  // Learning Objectives (limit to 5)
  if (lessonData?.objectives && lessonData.objectives.length > 0) {
    const objectives = lessonData.objectives.slice(0, 5);
    parts.push(`\nLearning Objectives:`);
    objectives.forEach((obj, i) => {
      parts.push(`${i + 1}. ${truncateText(obj, 150)}`);
    });
  }

  // Main Sections (condensed)
  if (lessonData?.sections && lessonData.sections.length > 0) {
    parts.push(`\nLesson Content:`);
    lessonData.sections.forEach((section, index) => {
      parts.push(`\n${index + 1}. ${section.title}`);
      // Truncate section content to prevent overly long prompts
      parts.push(truncateText(section.content, 400));

      // Include a few activities if present
      if (section.activities && section.activities.length > 0) {
        const activities = section.activities.slice(0, 3);
        parts.push('Activities:');
        activities.forEach(act => {
          if (typeof act === 'string') {
            parts.push(`- ${truncateText(act, 100)}`);
          } else {
            parts.push(`- ${truncateText(act.name || act.description || 'Activity', 100)}`);
          }
        });
      }
    });
  }

  // Vocabulary (limit to 8 terms)
  if (lessonData?.vocabulary && lessonData.vocabulary.length > 0) {
    const vocabItems = lessonData.vocabulary.slice(0, 8);
    parts.push(`\nKey Vocabulary:`);
    vocabItems.forEach(vocab => {
      parts.push(`- ${vocab.term}: ${truncateText(vocab.definition, 100)}`);
    });
  }

  // Assessment Questions (limit to 5)
  if (lessonData?.assessment?.questions && lessonData.assessment.questions.length > 0) {
    const questions = lessonData.assessment.questions.slice(0, 5);
    parts.push(`\nAssessment Questions:`);
    questions.forEach((q, i) => {
      parts.push(`${i + 1}. ${truncateText(q.question, 150)}`);
      if (options.includeAnswers && q.correctAnswer) {
        parts.push(`   Answer: ${truncateText(q.correctAnswer, 100)}`);
      }
    });
  }

  // Summary Points (limit to 5)
  if (lessonData?.summaryPoints && lessonData.summaryPoints.length > 0) {
    const summaryPoints = lessonData.summaryPoints.slice(0, 5);
    parts.push(`\nKey Takeaways:`);
    summaryPoints.forEach(point => {
      parts.push(`- ${truncateText(point, 100)}`);
    });
  }

  // Include Quiz Content if present (separate from lesson assessment)
  const quizData = content.quizContent as unknown as QuizContent | null;
  if (quizData?.questions && quizData.questions.length > 0) {
    const questions = quizData.questions.slice(0, 8);
    parts.push(`\nQuiz Questions (${quizData.questions.length} total):`);
    questions.forEach((q, i) => {
      parts.push(`${i + 1}. ${truncateText(q.question, 150)}`);
      if (q.options && q.options.length > 0) {
        q.options.forEach((opt, j) => {
          const letter = String.fromCharCode(65 + j);
          parts.push(`   ${letter}) ${truncateText(opt, 80)}`);
        });
      }
      if (options.includeAnswers && q.correctAnswer) {
        parts.push(`   Answer: ${truncateText(q.correctAnswer, 100)}`);
      }
    });
  }

  // Include Flashcard Content if present
  const flashcardData = content.flashcardContent as unknown as FlashcardContent | null;
  if (flashcardData?.cards && flashcardData.cards.length > 0) {
    const cards = flashcardData.cards.slice(0, 10);
    parts.push(`\nFlashcards (${flashcardData.cards.length} total):`);
    cards.forEach((card, i) => {
      parts.push(`${i + 1}. Front: ${truncateText(card.front, 100)}`);
      parts.push(`   Back: ${truncateText(card.back, 150)}`);
    });
  }

  return parts.join('\n');
}

/**
 * Calculate number of slides based on content and style
 */
function calculateSlideCount(content: TeacherContent, options: PresentonExportOptions): number {
  const lessonData = content.lessonContent as unknown as LessonContent;
  const quizData = content.quizContent as unknown as QuizContent | null;
  const flashcardData = content.flashcardContent as unknown as FlashcardContent | null;

  // Base slides: title + objectives + summary
  let slides = 3;

  // Section slides
  const sectionCount = lessonData?.sections?.length || 0;
  if (options.slideStyle === 'focused') {
    slides += Math.min(sectionCount * 2, 12); // Cap section slides
  } else {
    slides += Math.min(Math.ceil(sectionCount / 2), 6);
  }

  // Vocabulary slide(s)
  const vocabCount = lessonData?.vocabulary?.length || 0;
  if (vocabCount > 0) {
    slides += 1;
  }

  // Assessment slide(s) from lesson content
  const assessmentCount = lessonData?.assessment?.questions?.length || 0;
  if (assessmentCount > 0) {
    slides += options.slideStyle === 'focused' ? 2 : 1;
  }

  // Quiz slide(s) from quizContent (separate from lesson assessment)
  const quizCount = quizData?.questions?.length || 0;
  if (quizCount > 0) {
    // Add 1-3 slides depending on quiz size
    slides += options.slideStyle === 'focused' ? Math.min(Math.ceil(quizCount / 3), 3) : 1;
  }

  // Flashcard slide(s) from flashcardContent
  const flashcardCount = flashcardData?.cards?.length || 0;
  if (flashcardCount > 0) {
    // Add 1-2 slides for flashcards
    slides += options.slideStyle === 'focused' ? Math.min(Math.ceil(flashcardCount / 5), 2) : 1;
  }

  // Summary slide
  slides += 1;

  // Cap at reasonable limits
  const minSlides = options.slideStyle === 'dense' ? 6 : 8;
  const maxSlides = options.slideStyle === 'dense' ? 15 : 22; // Increased max for quiz/flashcards

  return Math.min(Math.max(slides, minSlides), maxSlides);
}

/**
 * Generate PowerPoint using Presenton API
 */
export async function generateLessonPPTX(
  content: TeacherContent,
  options: PresentonExportOptions
): Promise<{ data: Buffer; filename: string }> {
  if (!PRESENTON_API_KEY) {
    throw new Error('PRESENTON_API_KEY is not configured');
  }

  // Format the lesson content into a concise prompt
  const lessonPrompt = formatLessonContent(content, options);

  // Calculate appropriate slide count
  const slideCount = calculateSlideCount(content, options);

  console.log(`[Presenton] Content length: ${lessonPrompt.length} chars, slides: ${slideCount}`);

  // Prepare the API request - keep it simple
  const requestBody: PresentonRequest = {
    content: lessonPrompt,
    instructions: `Create an engaging educational presentation for Grade ${content.gradeLevel} students. Use clear headings, bullet points, and include relevant images.`,
    tone: 'educational',
    verbosity: options.slideStyle === 'dense' ? 'concise' : 'standard',
    web_search: false,
    image_type: 'stock',
    theme: options.theme,
    n_slides: slideCount,
    language: options.language || 'English',
    template: 'orbit-learn-teacher',
    include_table_of_contents: false,
    include_title_slide: true,
    export_as: 'pptx',
  };

  console.log(`[Presenton] Generating presentation with ${slideCount} slides...`);
  console.log(`[Presenton] Request body:`, JSON.stringify(requestBody, null, 2).substring(0, 500) + '...');

  // Call Presenton API
  const response = await fetchWithRetry(PRESENTON_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PRESENTON_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  }, { timeoutMs: PRESENTON_REQUEST_TIMEOUT_MS });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Presenton] API error:', response.status, errorText);

    // Provide more helpful error messages
    if (response.status === 500) {
      throw new Error('Presenton API is temporarily unavailable. Please try again in a moment.');
    } else if (response.status === 401) {
      throw new Error('Presenton API authentication failed. Please check the API key.');
    } else if (response.status === 429) {
      throw new Error('Presenton API rate limit exceeded. Please try again later.');
    }

    throw new Error(`Presenton API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json() as PresentonResponse;
  console.log(`[Presenton] Presentation generated: ${result.presentation_id}, credits used: ${result.credits_consumed}`);

  // Download the generated PPTX file
  // Presenton returns a local path like "/app_data/exports/file.pptx" - convert to full URL
  const fileUrl = result.path.startsWith('http')
    ? result.path
    : new URL(result.path, PRESENTON_BASE_URL).toString();
  console.log(`[Presenton] Downloading PPTX from: ${fileUrl}`);

  const fileResponse = await fetchWithRetry(
    fileUrl,
    { method: 'GET' },
    { timeoutMs: PRESENTON_DOWNLOAD_TIMEOUT_MS }
  );
  if (!fileResponse.ok) {
    throw new Error(`Failed to download PPTX: ${fileResponse.status}`);
  }

  const arrayBuffer = await fileResponse.arrayBuffer();
  const pptxBuffer = Buffer.from(arrayBuffer);

  // Clean title for filename
  const cleanTitle = content.title
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 50);

  return {
    data: pptxBuffer,
    filename: `${cleanTitle} - Orbit Learn.pptx`,
  };
}

export default {
  generateLessonPPTX,
};
