import { beforeAll, describe, expect, it, vi } from 'vitest';
import {
  ContentStatus,
  SourceType,
  Subject,
  TeacherContent,
  TeacherContentType,
} from '@prisma/client';
vi.mock('puppeteer', () => {
  const launch = vi.fn(async () => ({
    newPage: async () => ({
      setContent: async () => undefined,
      pdf: async () => Buffer.from(''),
    }),
    close: async () => undefined,
  }));
  return {
    default: { launch },
    launch,
  };
});

let exportContent: typeof import('./exportService.js').exportContent;

beforeAll(async () => {
  ({ exportContent } = await import('./exportService.js'));
});

function makeContent(overrides: Partial<TeacherContent> = {}): TeacherContent {
  return {
    id: 'content-test-id',
    teacherId: 'teacher-test-id',
    title: 'Template Export Test',
    description: 'Description fallback',
    subject: Subject.SCIENCE,
    gradeLevel: '5',
    contentType: TeacherContentType.LESSON,
    sourceType: SourceType.TEXT,
    originalFileUrl: null,
    originalFileName: null,
    extractedText: null,
    lessonContent: null,
    quizContent: null,
    flashcardContent: null,
    infographicUrl: null,
    status: ContentStatus.DRAFT,
    isPublic: false,
    publishedAt: null,
    sharedAt: null,
    shareCategory: null,
    downloadCount: 0,
    viewCount: 0,
    likeCount: 0,
    isFeatured: false,
    remixedFromId: null,
    templateId: null,
    tokensUsed: 0,
    aiModelUsed: null,
    createdAt: new Date('2026-02-12T00:00:00.000Z'),
    updatedAt: new Date('2026-02-12T00:00:00.000Z'),
    ...overrides,
  };
}

async function exportHtml(content: TeacherContent, includeAnswers = true): Promise<string> {
  const result = await exportContent(content, {
    format: 'html',
    includeAnswers,
    includeTeacherNotes: true,
    colorScheme: 'color',
  });
  return result.data as string;
}

describe('exportService weekly template regressions', () => {
  it('renders WARM_UP with weekly question template instead of generic lesson section', async () => {
    const content = makeContent({
      lessonContent: {
        title: 'Atomic Warm-Up',
        weeklyMaterialType: 'WARM_UP',
        summary: 'Quick start activity.',
        duration: '5 min',
        instructions: 'Answer each prompt in one sentence.',
        questions: [
          { question: 'What is an atom?', answer: 'The smallest unit of matter.' },
          { question: 'Name one element.', answer: 'Oxygen.' },
        ],
      } as unknown as TeacherContent['lessonContent'],
    });

    const html = await exportHtml(content, true);
    expect(html).toContain('Warm-Up');
    expect(html).toContain('Questions');
    expect(html).toContain('Answer:');
    expect(html).not.toContain('Lesson Content');
  });

  it('renders WORKSHEET problems and respects includeAnswers=false', async () => {
    const content = makeContent({
      contentType: TeacherContentType.WORKSHEET,
      lessonContent: {
        title: 'Element Classification Worksheet',
        weeklyMaterialType: 'WORKSHEET',
        instructions: 'Solve all problems.',
        problems: [
          { number: 1, question: 'Classify Neon.', answer: 'Noble gas', difficulty: 'easy' },
          { number: 2, question: 'Classify Iron.', answer: 'Transition metal', difficulty: 'medium' },
        ],
      } as unknown as TeacherContent['lessonContent'],
    });

    const html = await exportHtml(content, false);
    expect(html).toContain('Worksheet');
    expect(html).toContain('Problems');
    expect(html).not.toContain('Answer:');
    expect(html).not.toContain('Learning Objectives');
  });

  it('renders ACTIVITY structure with materials and steps', async () => {
    const content = makeContent({
      lessonContent: {
        title: 'Lab Activity',
        weeklyMaterialType: 'ACTIVITY',
        duration: '20 min',
        grouping: 'small_groups',
        materials: ['Beaker', 'Water', 'Salt'],
        instructions: ['Mix water and salt.', 'Record observations.'],
        extensions: 'Try different temperatures.',
      } as unknown as TeacherContent['lessonContent'],
    });

    const html = await exportHtml(content, true);
    expect(html).toContain('Activity');
    expect(html).toContain('Materials');
    expect(html).toContain('Step-by-Step Instructions');
    expect(html).toContain('Extensions');
  });

  it('falls back to classic lesson export when weeklyMaterialType is missing', async () => {
    const content = makeContent({
      lessonContent: {
        title: 'Classic Lesson',
        summary: 'Legacy lesson format',
        objectives: ['Explain the periodic table structure.'],
        sections: [{ title: 'Intro', content: 'Discuss groups and periods.' }],
      } as unknown as TeacherContent['lessonContent'],
    });

    const html = await exportHtml(content, true);
    expect(html).toContain('Learning Objectives');
    expect(html).toContain('Lesson Content');
    expect(html).not.toContain('Step-by-Step Instructions');
  });
});
