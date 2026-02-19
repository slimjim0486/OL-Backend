/**
 * Content Preview Service
 * Extracts structured preview data from TeacherContent JSON fields
 * for use in download reminder emails (Stage 2 inline previews).
 */

import { TeacherContent, TeacherContentType } from '@prisma/client';

export interface ContentPreview {
  title: string;
  type: TeacherContentType;
  subject: string | null;
  grade: string | null;
  sections: string[];
  questionCount?: number;
  vocabularyTerms: string[];
  cardCount?: number;
}

/**
 * Extract a lightweight preview from a TeacherContent record.
 * Used by Stage 2 download reminder email to build an inline preview card
 * without sending the full content.
 */
export function extractContentPreview(content: TeacherContent): ContentPreview {
  const preview: ContentPreview = {
    title: content.title,
    type: content.contentType,
    subject: content.subject,
    grade: content.gradeLevel ?? null,
    sections: [],
    vocabularyTerms: [],
  };

  switch (content.contentType) {
    case 'LESSON':
    case 'WORKSHEET':
    case 'STUDY_GUIDE': {
      const lesson = content.lessonContent as Record<string, any> | null;
      if (lesson) {
        if (Array.isArray(lesson.sections)) {
          preview.sections = lesson.sections
            .slice(0, 4)
            .map((s: any) => (typeof s === 'string' ? s : s.title ?? ''))
            .filter(Boolean);
        }
        if (Array.isArray(lesson.vocabulary)) {
          preview.vocabularyTerms = lesson.vocabulary
            .slice(0, 5)
            .map((v: any) => (typeof v === 'string' ? v : v.term ?? ''))
            .filter(Boolean);
        }
        if (Array.isArray(lesson.objectives)) {
          // Use objectives as sections fallback when sections are empty
          if (preview.sections.length === 0) {
            preview.sections = lesson.objectives.slice(0, 4);
          }
        }
        if (lesson.assessment?.questions) {
          preview.questionCount = lesson.assessment.questions.length;
        }
      }
      break;
    }

    case 'QUIZ': {
      const quiz = content.quizContent as Record<string, any> | null;
      if (quiz) {
        if (Array.isArray(quiz.questions)) {
          preview.questionCount = quiz.questions.length;
          // Extract first 3 question stems for preview
          preview.sections = quiz.questions
            .slice(0, 3)
            .map((q: any) => q.question ?? '')
            .filter(Boolean);
        }
      }
      break;
    }

    case 'FLASHCARD_DECK': {
      const deck = content.flashcardContent as Record<string, any> | null;
      if (deck && Array.isArray(deck.cards)) {
        preview.cardCount = deck.cards.length;
        // Extract first 4 terms for preview
        preview.vocabularyTerms = deck.cards
          .slice(0, 4)
          .map((c: any) => c.front ?? c.term ?? '')
          .filter(Boolean);
      }
      break;
    }

    default:
      break;
  }

  return preview;
}

/** Human-readable label for content type */
export function contentTypeLabel(type: TeacherContentType): string {
  const labels: Record<TeacherContentType, string> = {
    LESSON: 'Lesson Plan',
    QUIZ: 'Quiz',
    FLASHCARD_DECK: 'Flashcard Deck',
    INFOGRAPHIC: 'Infographic',
    WORKSHEET: 'Worksheet',
    STUDY_GUIDE: 'Study Guide',
  };
  return labels[type] || type;
}
