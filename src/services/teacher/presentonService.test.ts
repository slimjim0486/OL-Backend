import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ContentStatus,
  SourceType,
  Subject,
  TeacherContent,
  TeacherContentType,
} from '@prisma/client';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('presentonService material prompt formatting', () => {
  it('sends generated worksheet section problems and answers to Presenton', async () => {
    vi.stubEnv('PRESENTON_API_KEY', 'test-presenton-key');
    vi.stubEnv('PRESENTON_API_URL', 'https://presenton.test/api/v1/ppt/presentation/generate');
    vi.stubEnv('PRESENTON_BASE_URL', 'https://presenton.test');

    let requestBody: any;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (init?.method === 'POST') {
        requestBody = JSON.parse(String(init.body));
        return {
          ok: true,
          status: 200,
          json: async () => ({
            presentation_id: 'presentation-test-id',
            path: '/exports/worksheet.pptx',
            edit_path: '',
            credits_consumed: 1,
          }),
        };
      }

      expect(url).toBe('https://presenton.test/exports/worksheet.pptx');
      return {
        ok: true,
        status: 200,
        arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    const { generateLessonPPTX } = await import('./presentonService.js');
    const content = {
      id: 'content-test-id',
      teacherId: 'teacher-test-id',
      title: 'Fractions Worksheet',
      description: null,
      subject: Subject.MATH,
      gradeLevel: '5',
      contentType: TeacherContentType.WORKSHEET,
      sourceType: SourceType.TEXT,
      status: ContentStatus.DRAFT,
      lessonContent: {
        title: 'Fractions Worksheet',
        instructions: 'Show your work.',
        sections: [
          {
            name: 'Adding Fractions',
            problems: [
              {
                question: 'Solve 1/2 + 1/4.',
                answer: '3/4',
                difficulty: 'easy',
              },
            ],
          },
        ],
        answerKey: [{ problem: 1, answer: '3/4' }],
      },
      quizContent: null,
      flashcardContent: null,
      createdAt: new Date('2026-02-12T00:00:00.000Z'),
      updatedAt: new Date('2026-02-12T00:00:00.000Z'),
    } as unknown as TeacherContent;

    const result = await generateLessonPPTX(content, {
      theme: 'professional-blue',
      slideStyle: 'focused',
      includeAnswers: true,
      includeTeacherNotes: true,
      includeInfographic: true,
      language: 'English',
    });

    expect(result.filename).toContain('Fractions Worksheet');
    expect(result.filename).toMatch(/\.pptx$/);
    expect(requestBody.template).toBe('orbit-learn-teacher');
    expect(requestBody.export_as).toBe('pptx');
    expect(requestBody.content).toContain('Adding Fractions');
    expect(requestBody.content).toContain('Solve 1/2 + 1/4.');
    expect(requestBody.content).toContain('Answer: 3/4');
  });
});
