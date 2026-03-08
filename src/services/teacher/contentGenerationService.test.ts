import { describe, expect, it } from 'vitest';
import {
  extractJSON,
  getQuizMaxOutputTokens,
  normalizeGeneratedQuiz,
} from './contentGenerationService.js';

describe('contentGenerationService quiz helpers', () => {
  it('repairs truncated quiz JSON by trimming the incomplete tail', () => {
    const truncated = `{
      "title": "Ecosystems Quiz",
      "questions": [
        {
          "id": "q1",
          "question": "What is an ecosystem?",
          "type": "multiple_choice",
          "options": ["A habitat", "A community"],
          "correctAnswer": "A community",
          "explanation": "It includes living and non-living parts.",
          "difficulty": "easy",
          "points": 1
        },
        {
          "id": "q2",
          "question": "What do food webs show?",
          "type": "multiple_choice",
          "options": ["Weather", "Energy flow"],
          "correctAnswer": "Energy flow",
          "explanatio`;

    const repaired = extractJSON(truncated);
    const parsed = JSON.parse(repaired);

    expect(parsed.title).toBe('Ecosystems Quiz');
    expect(Array.isArray(parsed.questions)).toBe(true);
    expect(parsed.questions.length).toBeGreaterThan(0);
  });

  it('normalizes quiz questions and fills missing defaults', () => {
    const normalized = normalizeGeneratedQuiz(
      {
        title: 'Energy Quiz',
        questions: [
          {
            id: 'q1',
            question: 'What is a producer?',
            type: 'short_answer',
            correctAnswer: 'An organism that makes its own food.',
          },
        ],
      },
      {
        content: 'Food chains and food webs',
        questionCount: 1,
        difficulty: 'mixed',
      }
    );

    expect(normalized.questions).toHaveLength(1);
    expect(normalized.questions[0].explanation).toContain('Review the lesson content');
    expect(normalized.questions[0].difficulty).toBe('medium');
    expect(normalized.questions[0].points).toBe(1);
    expect(normalized.totalPoints).toBe(1);
  });

  it('scales quiz output tokens for larger requested quizzes', () => {
    expect(getQuizMaxOutputTokens(10)).toBe(4000);
    expect(getQuizMaxOutputTokens(30)).toBeGreaterThan(4000);
    expect(getQuizMaxOutputTokens(30)).toBeLessThanOrEqual(12000);
  });
});
