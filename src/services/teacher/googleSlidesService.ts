import { TeacherContent } from '@prisma/client';
import { google, drive_v3, slides_v1 } from 'googleapis';
import {
  disconnectGoogleDrive,
  getAuthenticatedOAuth2Client,
  getOrCreateOrbitFolderId,
} from './googleDriveService.js';

export interface GoogleSlidesExportOptions {
  includeAnswers: boolean;
  includeTeacherNotes: boolean;
}

type SlideDraft = {
  title: string;
  body?: string;
  bullets?: boolean;
};

type LessonSection = {
  title?: string;
  content?: string;
  activities?: unknown[];
  teachingTips?: string[];
};

type VocabularyItem = {
  term?: string;
  definition?: string;
  example?: string;
};

type AssessmentQuestion = {
  question?: string;
  correctAnswer?: string;
  explanation?: string;
};

type Flashcard = {
  front?: string;
  back?: string;
  hint?: string;
  term?: string;
  definition?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join('\n');
  return '';
}

function splitLines(value: unknown): string[] {
  const source = asText(value);
  if (!source) return [];
  return source
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)])\s*/, '').trim())
    .filter(Boolean);
}

function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3).trimEnd()}...`;
}

function chunkArray<T>(items: T[], size: number): T[][]
{
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function cleanBodyText(text: string, maxLength = 1400): string {
  return truncateText(
    text
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
    maxLength
  );
}

function formatActivity(activity: unknown): string {
  if (typeof activity === 'string') return activity.trim();
  const item = asRecord(activity);
  const name = asText(item.name);
  const description = asText(item.description);
  return [name, description].filter(Boolean).join(': ');
}

function buildLessonDrafts(content: TeacherContent, options: GoogleSlidesExportOptions): SlideDraft[] {
  const lesson = asRecord(content.lessonContent);
  const quiz = asRecord(content.quizContent);
  const flashcards = asRecord(content.flashcardContent);

  const subjectBits = [
    content.subject ? content.subject.replace(/_/g, ' ') : '',
    content.gradeLevel ? `Grade ${content.gradeLevel}` : '',
  ].filter(Boolean);
  const titleBodyParts = [
    subjectBits.join(' • '),
    truncateText(asText(lesson.summary), 240),
  ].filter(Boolean);

  const drafts: SlideDraft[] = [
    {
      title: content.title,
      body: titleBodyParts.join('\n\n'),
    },
  ];

  const objectives = asArray<string>(lesson.objectives)
    .map((item) => asText(item))
    .filter(Boolean);
  if (objectives.length) {
    drafts.push({
      title: 'Learning Objectives',
      body: cleanBodyText(objectives.map((item) => item.trim()).join('\n'), 1200),
      bullets: true,
    });
  }

  const sections = asArray<LessonSection>(lesson.sections);
  const sectionDrafts = sections.slice(0, 8).map((section, index) => {
    const bodyParts = [
      asText(section.content),
      ...asArray(section.activities).map(formatActivity).filter(Boolean).map((item) => `Activity: ${item}`),
      ...asArray<string>(section.teachingTips).map((tip) => `Teacher tip: ${asText(tip)}`).filter(Boolean),
    ].filter(Boolean);

    return {
      title: asText(section.title) || `Section ${index + 1}`,
      body: cleanBodyText(bodyParts.join('\n\n')),
    };
  }).filter((draft) => draft.body);

  drafts.push(...sectionDrafts);

  const questions = asArray<unknown>(lesson.questions)
    .map((item) => {
      const record = asRecord(item);
      return asText(record.question || item);
    })
    .filter(Boolean);
  const problems = asArray<unknown>(lesson.problems)
    .map((item) => {
      const record = asRecord(item);
      return asText(record.question || item);
    })
    .filter(Boolean);
  const practiceItems = [...questions, ...problems];
  if (!sectionDrafts.length && practiceItems.length) {
    chunkArray(practiceItems, 5).slice(0, 2).forEach((chunk, index) => {
      drafts.push({
        title: index === 0 ? 'Practice' : 'More Practice',
        body: cleanBodyText(chunk.join('\n'), 1200),
        bullets: true,
      });
    });
  }

  const vocabulary = asArray<VocabularyItem>(lesson.vocabulary)
    .map((item) => {
      const term = asText(item.term);
      const definition = asText(item.definition);
      const example = asText(item.example);
      return [term && `${term}: ${definition || ''}`.trim(), example && `Example: ${example}`]
        .filter(Boolean)
        .join('\n');
    })
    .filter(Boolean);
  if (vocabulary.length) {
    chunkArray(vocabulary, 4).slice(0, 2).forEach((chunk, index) => {
      drafts.push({
        title: index === 0 ? 'Key Vocabulary' : 'More Vocabulary',
        body: cleanBodyText(chunk.join('\n\n'), 1200),
      });
    });
  }

  const assessmentQuestions = asArray<AssessmentQuestion>(asRecord(lesson.assessment).questions);
  const quizQuestions = asArray<AssessmentQuestion>(quiz.questions);
  const allQuestions = (quizQuestions.length ? quizQuestions : assessmentQuestions)
    .map((item, index) => {
      const prompt = asText(item.question) || `Question ${index + 1}`;
      const answer = options.includeAnswers ? asText(item.correctAnswer) : '';
      const explanation = options.includeAnswers ? asText(item.explanation) : '';
      return [
        `${index + 1}. ${prompt}`,
        answer && `Answer: ${answer}`,
        explanation && `Why: ${explanation}`,
      ].filter(Boolean).join('\n');
    })
    .filter(Boolean);

  if (allQuestions.length) {
    chunkArray(allQuestions, 3).slice(0, 2).forEach((chunk, index) => {
      drafts.push({
        title: index === 0 ? 'Check for Understanding' : 'Assessment',
        body: cleanBodyText(chunk.join('\n\n'), 1200),
      });
    });
  }

  const flashcardItems = asArray<Flashcard>(flashcards.cards)
    .map((card, index) => {
      const front = asText(card.front || card.term);
      const back = asText(card.back || card.definition);
      if (!front && !back) return '';
      return `${index + 1}. ${front}${back ? `\nAnswer: ${back}` : ''}`;
    })
    .filter(Boolean);
  if (flashcardItems.length) {
    drafts.push({
      title: 'Key Review Cards',
      body: cleanBodyText(flashcardItems.slice(0, 6).join('\n\n'), 1200),
    });
  }

  const summaryPoints = asArray<string>(lesson.summaryPoints)
    .map((item) => asText(item))
    .filter(Boolean);
  const nextSteps = asText(lesson.nextSteps);
  const teacherNotes = options.includeTeacherNotes ? asText(lesson.teacherNotes) : '';
  const closingLines = [
    ...summaryPoints,
    nextSteps && `Next steps: ${nextSteps}`,
    teacherNotes && `Teacher notes: ${teacherNotes}`,
  ].filter(Boolean);

  if (closingLines.length) {
    drafts.push({
      title: 'Wrap Up',
      body: cleanBodyText(closingLines.join('\n\n'), 1200),
      bullets: summaryPoints.length > 0 && !nextSteps && !teacherNotes,
    });
  }

  return drafts.slice(0, 12);
}

function buildFlashcardDrafts(content: TeacherContent): SlideDraft[] {
  const flashcards = asRecord(content.flashcardContent);
  const cards = asArray<Flashcard>(flashcards.cards);
  const subjectBits = [
    content.subject ? content.subject.replace(/_/g, ' ') : '',
    content.gradeLevel ? `Grade ${content.gradeLevel}` : '',
    cards.length ? `${cards.length} cards` : '',
  ].filter(Boolean);

  const drafts: SlideDraft[] = [
    {
      title: asText(flashcards.title) || content.title,
      body: subjectBits.join(' • '),
    },
  ];

  cards.slice(0, 20).forEach((card, index) => {
    const front = asText(card.front || card.term) || `Card ${index + 1}`;
    const back = asText(card.back || card.definition);
    const hint = asText(card.hint);
    drafts.push({
      title: front,
      body: cleanBodyText(
        [
          back,
          hint && `Hint: ${hint}`,
        ].filter(Boolean).join('\n\n'),
        1200
      ),
    });
  });

  return drafts;
}

function buildSlideDrafts(content: TeacherContent, options: GoogleSlidesExportOptions): SlideDraft[] {
  if (content.contentType === 'FLASHCARD_DECK') {
    return buildFlashcardDrafts(content);
  }

  return buildLessonDrafts(content, options);
}

function textStyleRequests(
  objectId: string,
  fontSize: number,
  bold = false
): slides_v1.Schema$Request[] {
  return [
    {
      updateTextStyle: {
        objectId,
        textRange: { type: 'ALL' },
        style: {
          bold,
          fontFamily: 'Arial',
          fontSize: {
            magnitude: fontSize,
            unit: 'PT',
          },
        },
        fields: 'bold,fontFamily,fontSize',
      },
    },
  ];
}

function buildSlideRequests(drafts: SlideDraft[]): slides_v1.Schema$Request[] {
  const requests: slides_v1.Schema$Request[] = [];

  drafts.forEach((draft, index) => {
    const slideId = `orbit_slide_${index + 1}`;
    const titleId = `orbit_title_${index + 1}`;
    const bodyId = `orbit_body_${index + 1}`;

    requests.push({
      createSlide: {
        objectId: slideId,
        insertionIndex: index,
        slideLayoutReference: {
          predefinedLayout: 'TITLE_AND_BODY',
        },
        placeholderIdMappings: [
          {
            layoutPlaceholder: { type: 'TITLE', index: 0 },
            objectId: titleId,
          },
          {
            layoutPlaceholder: { type: 'BODY', index: 0 },
            objectId: bodyId,
          },
        ],
      },
    });

    requests.push({
      insertText: {
        objectId: titleId,
        insertionIndex: 0,
        text: draft.title,
      },
    });
    requests.push(...textStyleRequests(titleId, index === 0 ? 30 : 24, true));

    if (draft.body) {
      requests.push({
        insertText: {
          objectId: bodyId,
          insertionIndex: 0,
          text: draft.body,
        },
      });
      requests.push(...textStyleRequests(bodyId, 16, false));
      requests.push({
        updateParagraphStyle: {
          objectId: bodyId,
          textRange: { type: 'ALL' },
          style: {
            lineSpacing: 130,
            spaceBelow: {
              magnitude: 6,
              unit: 'PT',
            },
          },
          fields: 'lineSpacing,spaceBelow',
        },
      });

      if (draft.bullets) {
        requests.push({
          createParagraphBullets: {
            objectId: bodyId,
            textRange: { type: 'ALL' },
            bulletPreset: 'BULLET_DISC_CIRCLE_SQUARE',
          },
        });
      }
    }
  });

  return requests;
}

async function movePresentationToOrbitFolder(
  drive: drive_v3.Drive,
  teacherId: string,
  fileId: string
): Promise<string | undefined> {
  const folderId = await getOrCreateOrbitFolderId(drive, teacherId);
  const existingFile = await drive.files.get({
    fileId,
    fields: 'parents, webViewLink',
  });

  const previousParents = existingFile.data.parents?.join(',') || undefined;
  const updatedFile = await drive.files.update({
    fileId,
    addParents: folderId,
    removeParents: previousParents,
    fields: 'webViewLink',
  });

  return updatedFile.data.webViewLink || existingFile.data.webViewLink || undefined;
}

function toFriendlyGoogleError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('invalid_grant')) {
      return 'Google authorization expired. Please reconnect your Google account.';
    }
    if (
      error.message.includes('insufficient authentication scopes') ||
      error.message.includes('PERMISSION_DENIED')
    ) {
      return 'Google permissions need to be updated. Please reconnect your Google account.';
    }
    return error.message;
  }

  return 'Failed to create Google Slides presentation';
}

export async function createGoogleSlidesPresentation(
  teacherId: string,
  content: TeacherContent,
  options: GoogleSlidesExportOptions
): Promise<{
  presentationId: string;
  fileId: string;
  webViewLink?: string;
  title: string;
}> {
  const auth = await getAuthenticatedOAuth2Client(teacherId);
  if (!auth) {
    throw new Error('Google Drive not connected. Please connect your Google account first.');
  }

  const drive = google.drive({ version: 'v3', auth });
  const slides = google.slides({ version: 'v1', auth });
  const title = content.contentType === 'FLASHCARD_DECK'
    ? `${content.title} - Orbit Learn Flashcards`
    : `${content.title} - Orbit Learn`;

  try {
    const created = await slides.presentations.create({
      requestBody: { title },
    });

    const presentationId = created.data.presentationId;
    if (!presentationId) {
      throw new Error('Google Slides did not return a presentation ID.');
    }

    const existingPresentation = await slides.presentations.get({
      presentationId,
      fields: 'slides/objectId',
    });

    const requests: slides_v1.Schema$Request[] = [];
    for (const slide of existingPresentation.data.slides || []) {
      if (slide.objectId) {
        requests.push({
          deleteObject: {
            objectId: slide.objectId,
          },
        });
      }
    }

    requests.push(...buildSlideRequests(buildSlideDrafts(content, options)));

    await slides.presentations.batchUpdate({
      presentationId,
      requestBody: { requests },
    });

    const webViewLink = await movePresentationToOrbitFolder(drive, teacherId, presentationId);

    return {
      presentationId,
      fileId: presentationId,
      webViewLink,
      title,
    };
  } catch (error) {
    const message = toFriendlyGoogleError(error);
    if (
      message.includes('reconnect your Google account') ||
      message.includes('authorization expired')
    ) {
      await disconnectGoogleDrive(teacherId);
    }
    throw new Error(message);
  }
}
