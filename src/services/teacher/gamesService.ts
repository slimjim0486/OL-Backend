import { prisma } from '../../config/database.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { DailyGameType } from '@prisma/client';

export const ICEBREAKER_CATEGORY_IDS = [
  'wouldYouRather',
  'thisOrThat',
  'twoTruths',
  'emojiStory',
  'wordAssociation',
] as const;

export type IcebreakerCategoryId = (typeof ICEBREAKER_CATEGORY_IDS)[number];

export type ConnectionsCategory = {
  name: string;
  words: string[];
};

export type ConnectionsPuzzle = {
  title: string;
  categories: ConnectionsCategory[];
};

export type IcebreakerPrompts = {
  category: IcebreakerCategoryId;
  prompts: string[];
  source: 'gemini' | 'fallback';
};

export type VocabularyEntry = {
  id: number;
  term: string;
  definition: string;
};

const DAILY_GAME_DEFAULT_KEY = 'default';

const FALLBACK_CONNECTIONS: ConnectionsPuzzle[] = [
  {
    title: 'Classroom Flow',
    categories: [
      {
        name: 'Start Of Class',
        words: ['Bellwork', 'Attendance', 'Warm-Up', 'Agenda'],
      },
      {
        name: 'Assessment Types',
        words: ['Quiz', 'Rubric', 'Exit Ticket', 'Observation'],
      },
      {
        name: 'Student Supports',
        words: ['Scaffold', 'Anchor Chart', 'Modeling', 'Sentence Frames'],
      },
      {
        name: 'Classroom Signals',
        words: ['Chime', 'Call-and-Response', 'Hand Signal', 'Countdown'],
      },
    ],
  },
  {
    title: 'Literacy Lab',
    categories: [
      {
        name: 'Reading Skills',
        words: ['Inference', 'Theme', 'Main Idea', 'Summary'],
      },
      {
        name: 'Writing Moves',
        words: ['Thesis', 'Evidence', 'Transition', 'Conclusion'],
      },
      {
        name: 'Discussion Routines',
        words: ['Turn and Talk', 'Think-Pair-Share', 'Socratic Seminar', 'Debate'],
      },
      {
        name: 'Text Features',
        words: ['Caption', 'Glossary', 'Heading', 'Diagram'],
      },
    ],
  },
];

const FALLBACK_ICEBREAKERS: Record<IcebreakerCategoryId, string[]> = {
  wouldYouRather: [
    'Would you rather teach with only a whiteboard or only a projector for a week?',
    'Would you rather have a surprise assembly or a surprise fire drill?',
    'Would you rather grade everything by hand or by voice notes for a day?',
    'Would you rather have extra recess time or extra maker time this week?',
    'Would you rather start class with music or with a mystery question?',
  ],
  thisOrThat: [
    'This or That: Silent reading first, or a quick partner chat first?',
    'This or That: Sticky notes exit tickets or digital exit tickets?',
    'This or That: Project-based learning day or review game day?',
    'This or That: Classroom jobs or rotating responsibilities?',
    'This or That: Morning meeting on the rug or at desks?',
  ],
  twoTruths: [
    'Two truths and a lie: One hobby, one food, one travel dream. Guess the lie!',
    'Two truths and a lie: Something you can do, something you cannot do, something you want to learn.',
    'Two truths and a lie: Two classroom wins and one classroom flop.',
    'Two truths and a lie: Two favorite books and one made-up title.',
  ],
  emojiStory: [
    "Emoji Story: Tell today's lesson using only 6 emojis. Partner decodes it.",
    'Emoji Story: Share your weekend plans using emojis only. Class guesses.',
    'Emoji Story: Use emojis to describe a character from your current unit.',
  ],
  wordAssociation: [
    'Word Association: Start with "energy". Each student adds a related word in 3 seconds.',
    'Word Association: Start with "community". Build a chain without repeats.',
    'Word Association: Start with "fraction". Connect to real-life examples quickly.',
  ],
};

function pickFallbackPuzzle(): ConnectionsPuzzle {
  return FALLBACK_CONNECTIONS[Math.floor(Math.random() * FALLBACK_CONNECTIONS.length)];
}

export function getUtcDayStart(date: Date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function extractJSON(text: string): string {
  const trimmed = text.trim();

  try {
    JSON.parse(trimmed);
    return trimmed;
  } catch {
    // Continue to recovery strategies
  }

  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeBlockMatch?.[1]) {
    const candidate = codeBlockMatch[1].trim();
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      // Continue
    }
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function sanitizeJSONCandidate(candidate: string): string {
  return candidate
    .replace(/^\uFEFF/, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/[\u0000-\u001F]+/g, ' ')
    .trim();
}

function parseJSONSafely<T>(text: string, context: string): T {
  const candidate = extractJSON(text);

  try {
    return JSON.parse(candidate) as T;
  } catch (firstError) {
    const sanitized = sanitizeJSONCandidate(candidate);

    try {
      const repaired = JSON.parse(sanitized) as T;
      logger.warn(`${context} JSON parse required sanitation`, {
        originalLength: candidate.length,
        sanitizedLength: sanitized.length,
      });
      return repaired;
    } catch (secondError) {
      const firstMessage = firstError instanceof Error ? firstError.message : String(firstError);
      const secondMessage = secondError instanceof Error ? secondError.message : String(secondError);
      throw new Error(`${context} JSON parse failed (${firstMessage}; sanitized: ${secondMessage})`);
    }
  }
}

function dedupeWords(words: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const raw of words) {
    const word = raw.trim();
    if (!word) continue;
    const key = word.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(word);
  }

  return unique;
}

function isIcebreakerCategory(value: unknown): value is IcebreakerCategoryId {
  return typeof value === 'string' && (ICEBREAKER_CATEGORY_IDS as readonly string[]).includes(value);
}

function normalizeConnectionsPuzzle(data: unknown): ConnectionsPuzzle | null {
  if (!data || typeof data !== 'object') return null;
  const raw = data as any;

  const title = typeof raw.title === 'string' && raw.title.trim()
    ? raw.title.trim()
    : 'Teacher Connections';

  if (!Array.isArray(raw.categories) || raw.categories.length < 4) return null;

  const categories: ConnectionsCategory[] = raw.categories.slice(0, 4).map((category: any, index: number) => {
    const name = typeof category?.name === 'string' && category.name.trim()
      ? category.name.trim()
      : `Category ${index + 1}`;

    const words = Array.isArray(category?.words)
      ? dedupeWords(category.words.map((w: any) => String(w))).slice(0, 4)
      : [];

    return {
      name,
      words,
    };
  });

  if (categories.some((category) => category.words.length !== 4)) return null;

  const allWords = categories.flatMap((category) => category.words.map((word) => word.toLowerCase()));
  const uniqueWords = new Set(allWords);
  if (uniqueWords.size !== 16) return null;

  return { title, categories };
}

function normalizeIcebreakers(data: unknown, fallbackCategory: IcebreakerCategoryId): IcebreakerPrompts {
  if (!data || typeof data !== 'object') {
    return {
      category: fallbackCategory,
      prompts: FALLBACK_ICEBREAKERS[fallbackCategory],
      source: 'fallback',
    };
  }

  const raw = data as any;
  const maybeCategory: unknown = raw.category;
  const category = isIcebreakerCategory(maybeCategory) ? maybeCategory : fallbackCategory;

  const prompts = Array.isArray(raw.prompts)
    ? dedupeWords(raw.prompts.map((prompt: any) => String(prompt))).slice(0, 6)
    : [];

  if (prompts.length < 3) {
    return {
      category,
      prompts: FALLBACK_ICEBREAKERS[category],
      source: 'fallback',
    };
  }

  return {
    category,
    prompts,
    source: 'gemini',
  };
}

function normalizeVocabulary(data: unknown, count: number): VocabularyEntry[] | null {
  if (!data || typeof data !== 'object') return null;
  const raw = data as any;
  const entries = Array.isArray(raw.entries) ? raw.entries : [];

  const normalized = entries
    .map((entry: any, index: number) => {
      const term = typeof entry?.term === 'string' ? entry.term.trim() : '';
      const definition = typeof entry?.definition === 'string' ? entry.definition.trim() : '';

      if (!term || !definition) return null;

      return {
        id: index,
        term,
        definition,
      };
    })
    .filter(Boolean)
    .slice(0, count) as VocabularyEntry[];

  if (normalized.length < Math.min(4, count)) return null;

  return normalized;
}

function buildConnectionsPrompt(input: {
  topic?: string;
  gradeLevel?: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}): string {
  const topicLine = input.topic ? `Topic focus: ${input.topic}.` : '';
  const subjectLine = input.subject ? `Subject: ${input.subject}.` : '';
  const gradeLine = input.gradeLevel ? `Grade level: ${input.gradeLevel}.` : '';
  const difficultyLine = input.difficulty ? `Difficulty: ${input.difficulty}.` : 'Difficulty: medium.';

  return `You are creating a Connections-style word puzzle for teachers.

${topicLine}
${subjectLine}
${gradeLine}
${difficultyLine}

Rules:
- Provide EXACTLY 4 categories.
- Each category must have EXACTLY 4 words.
- Total words = 16, all unique.
- Words should be education-themed and classroom-appropriate.
- Avoid obscure jargon. Keep it satisfying but solvable in 2-4 minutes.
- Do not include quotation marks inside any value. Use plain text only.
- Use strict JSON with standard double quotes only (no smart quotes).

Return JSON ONLY with this exact shape:
{
  "title": "Short puzzle title",
  "categories": [
    { "name": "Category name", "words": ["Word 1", "Word 2", "Word 3", "Word 4"] },
    { "name": "Category name", "words": ["Word 1", "Word 2", "Word 3", "Word 4"] },
    { "name": "Category name", "words": ["Word 1", "Word 2", "Word 3", "Word 4"] },
    { "name": "Category name", "words": ["Word 1", "Word 2", "Word 3", "Word 4"] }
  ]
}`;
}

function buildIcebreakerPrompt(
  category: IcebreakerCategoryId,
  tone?: 'playful' | 'calm' | 'academic'
): string {
  const toneLine = tone ? `Tone: ${tone}.` : 'Tone: playful but professional.';

  return `You are generating quick classroom icebreakers for teachers.

Category: ${category}
${toneLine}

Create 5-6 prompts that are:
- Fast to run (2-5 minutes)
- Safe for school
- Inclusive and age-flexible
- Clear when projected

Return JSON ONLY with this exact shape:
{
  "category": "${category}",
  "prompts": [
    "Prompt 1",
    "Prompt 2",
    "Prompt 3",
    "Prompt 4",
    "Prompt 5"
  ]
}`;
}

function buildVocabularyPrompt(input: {
  topic: string;
  subject?: string;
  gradeLevel?: string;
  count: number;
}): string {
  const { topic, subject, gradeLevel, count } = input;
  const subjectLine = subject ? `Subject: ${subject}.` : '';
  const gradeLine = gradeLevel ? `Grade level: ${gradeLevel}.` : '';

  return `You are creating a classroom vocabulary list for a matching game.

Topic: ${topic}
${subjectLine}
${gradeLine}

Generate ${count} vocabulary terms with concise, student-friendly definitions.
Keep definitions to one sentence, plain language.

Return JSON ONLY with this exact shape:
{
  "title": "Optional short title",
  "entries": [
    { "term": "Term 1", "definition": "Definition 1" },
    { "term": "Term 2", "definition": "Definition 2" }
  ]
}`;
}

async function generateConnectionsWithGemini(input: {
  topic?: string;
  gradeLevel?: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}) {
  const prompt = buildConnectionsPrompt(input);
  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1400,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const responseText = response.text();
  const parsed = parseJSONSafely(responseText, 'Connections');
  const normalized = normalizeConnectionsPuzzle(parsed);

  if (!normalized) {
    throw new Error('Gemini response did not match expected puzzle shape');
  }

  const tokensUsed = response.usageMetadata?.totalTokenCount ?? null;

  return {
    puzzle: normalized,
    prompt,
    responseText,
    tokensUsed,
    source: 'gemini' as const,
    modelUsed: config.gemini.models.flash,
  };
}

async function generateIcebreakersWithGemini(category: IcebreakerCategoryId, tone?: 'playful' | 'calm' | 'academic') {
  const prompt = buildIcebreakerPrompt(category, tone);
  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 900,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const responseText = response.text();
  const parsed = parseJSONSafely(responseText, 'Icebreakers');
  const normalized = normalizeIcebreakers(parsed, category);

  const tokensUsed = response.usageMetadata?.totalTokenCount ?? null;

  return {
    prompts: normalized,
    prompt,
    responseText,
    tokensUsed,
    source: normalized.source,
    modelUsed: config.gemini.models.flash,
  };
}

export const gamesService = {
  getUtcDayStart,

  async getDailyConnectionsPuzzle(date: Date = new Date()) {
    const day = getUtcDayStart(date);

    const existing = await prisma.dailyGame.findUnique({
      where: {
        date_gameType_key: {
          date: day,
          gameType: DailyGameType.CONNECTIONS,
          key: DAILY_GAME_DEFAULT_KEY,
        },
      },
    });

    if (existing) {
      return {
        puzzle: existing.payload as ConnectionsPuzzle,
        meta: {
          source: 'daily_cache',
          modelUsed: existing.modelUsed || config.gemini.models.flash,
        },
      };
    }

    const generated = await this.generateAndStoreDailyConnections(day);
    return {
      puzzle: generated.puzzle,
      meta: {
        source: generated.source === 'gemini' ? 'daily_gemini' : 'daily_fallback',
        modelUsed: generated.modelUsed,
      },
    };
  },

  async generateAndStoreDailyConnections(day: Date) {
    try {
      const generated = await generateConnectionsWithGemini({});

      await prisma.dailyGame.upsert({
        where: {
          date_gameType_key: {
            date: day,
            gameType: DailyGameType.CONNECTIONS,
            key: DAILY_GAME_DEFAULT_KEY,
          },
        },
        create: {
          date: day,
          gameType: DailyGameType.CONNECTIONS,
          key: DAILY_GAME_DEFAULT_KEY,
          payload: generated.puzzle,
          source: generated.source,
          modelUsed: generated.modelUsed,
          tokensUsed: generated.tokensUsed,
        },
        update: {
          payload: generated.puzzle,
          source: generated.source,
          modelUsed: generated.modelUsed,
          tokensUsed: generated.tokensUsed,
        },
      });

      logger.info('Daily connections puzzle stored', {
        date: day.toISOString(),
        source: generated.source,
        tokensUsed: generated.tokensUsed,
      });

      return generated;
    } catch (error) {
      logger.warn('Daily connections generation failed, storing fallback', {
        date: day.toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const fallback = pickFallbackPuzzle();

      await prisma.dailyGame.upsert({
        where: {
          date_gameType_key: {
            date: day,
            gameType: DailyGameType.CONNECTIONS,
            key: DAILY_GAME_DEFAULT_KEY,
          },
        },
        create: {
          date: day,
          gameType: DailyGameType.CONNECTIONS,
          key: DAILY_GAME_DEFAULT_KEY,
          payload: fallback,
          source: 'fallback',
          modelUsed: config.gemini.models.flash,
        },
        update: {
          payload: fallback,
          source: 'fallback',
          modelUsed: config.gemini.models.flash,
          tokensUsed: null,
        },
      });

      return {
        puzzle: fallback,
        prompt: '',
        responseText: '',
        tokensUsed: null,
        source: 'fallback' as const,
        modelUsed: config.gemini.models.flash,
      };
    }
  },

  async getDailyIcebreakerPrompts(category: IcebreakerCategoryId, date: Date = new Date()) {
    const day = getUtcDayStart(date);

    const existing = await prisma.dailyGame.findUnique({
      where: {
        date_gameType_key: {
          date: day,
          gameType: DailyGameType.ICEBREAKER,
          key: category,
        },
      },
    });

    if (existing) {
      return {
        prompts: existing.payload as IcebreakerPrompts,
        meta: {
          source: 'daily_cache',
          modelUsed: existing.modelUsed || config.gemini.models.flash,
        },
      };
    }

    const generated = await this.generateAndStoreDailyIcebreakers(category, day);
    return {
      prompts: generated.prompts,
      meta: {
        source: generated.source === 'gemini' ? 'daily_gemini' : 'daily_fallback',
        modelUsed: generated.modelUsed,
      },
    };
  },

  async generateAndStoreDailyIcebreakers(category: IcebreakerCategoryId, day: Date) {
    try {
      const generated = await generateIcebreakersWithGemini(category);

      await prisma.dailyGame.upsert({
        where: {
          date_gameType_key: {
            date: day,
            gameType: DailyGameType.ICEBREAKER,
            key: category,
          },
        },
        create: {
          date: day,
          gameType: DailyGameType.ICEBREAKER,
          key: category,
          payload: generated.prompts,
          source: generated.source,
          modelUsed: generated.modelUsed,
          tokensUsed: generated.tokensUsed,
        },
        update: {
          payload: generated.prompts,
          source: generated.source,
          modelUsed: generated.modelUsed,
          tokensUsed: generated.tokensUsed,
        },
      });

      logger.info('Daily icebreaker prompts stored', {
        date: day.toISOString(),
        category,
        source: generated.source,
        tokensUsed: generated.tokensUsed,
      });

      return generated;
    } catch (error) {
      logger.warn('Daily icebreaker generation failed, storing fallback', {
        date: day.toISOString(),
        category,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const fallback: IcebreakerPrompts = {
        category,
        prompts: FALLBACK_ICEBREAKERS[category],
        source: 'fallback',
      };

      await prisma.dailyGame.upsert({
        where: {
          date_gameType_key: {
            date: day,
            gameType: DailyGameType.ICEBREAKER,
            key: category,
          },
        },
        create: {
          date: day,
          gameType: DailyGameType.ICEBREAKER,
          key: category,
          payload: fallback,
          source: 'fallback',
          modelUsed: config.gemini.models.flash,
        },
        update: {
          payload: fallback,
          source: 'fallback',
          modelUsed: config.gemini.models.flash,
          tokensUsed: null,
        },
      });

      return {
        prompts: fallback,
        prompt: '',
        responseText: '',
        tokensUsed: null,
        source: 'fallback' as const,
        modelUsed: config.gemini.models.flash,
      };
    }
  },

  async generateConnectionsOnDemand(input: {
    topic?: string;
    gradeLevel?: string;
    subject?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  }) {
    try {
      const generated = await generateConnectionsWithGemini(input);

      logger.info('Generated connections puzzle on demand', {
        topic: input.topic,
        tokensUsed: generated.tokensUsed,
      });

      return generated;
    } catch (error) {
      logger.warn('Connections generation failed, using fallback puzzle', {
        topic: input.topic,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return {
        puzzle: pickFallbackPuzzle(),
        prompt: '',
        responseText: '',
        tokensUsed: null,
        source: 'fallback' as const,
        modelUsed: config.gemini.models.flash,
      };
    }
  },

  async generateIcebreakersOnDemand(category: IcebreakerCategoryId, tone?: 'playful' | 'calm' | 'academic') {
    try {
      const generated = await generateIcebreakersWithGemini(category, tone);

      logger.info('Generated icebreakers on demand', {
        category,
        tokensUsed: generated.tokensUsed,
      });

      return generated;
    } catch (error) {
      logger.warn('Icebreaker generation failed, using fallback prompts', {
        category,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const fallback: IcebreakerPrompts = {
        category,
        prompts: FALLBACK_ICEBREAKERS[category],
        source: 'fallback',
      };

      return {
        prompts: fallback,
        prompt: '',
        responseText: '',
        tokensUsed: null,
        source: 'fallback' as const,
        modelUsed: config.gemini.models.flash,
      };
    }
  },

  async generateVocabularyOnDemand(input: {
    topic: string;
    gradeLevel?: string;
    subject?: string;
    count: number;
  }) {
    const prompt = buildVocabularyPrompt(input);
    const model = genAI.getGenerativeModel({
      model: config.gemini.models.flash,
      safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 1200,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    const parsed = parseJSONSafely(responseText, 'Vocabulary');
    const normalized = normalizeVocabulary(parsed, input.count);

    if (!normalized) {
      throw new Error('Gemini response did not contain enough vocabulary entries');
    }

    const tokensUsed = response.usageMetadata?.totalTokenCount
      ?? Math.ceil((prompt.length + responseText.length) / 4);

    logger.info('Generated vocabulary on demand', {
      topic: input.topic,
      count: normalized.length,
      tokensUsed,
    });

    return {
      entries: normalized,
      prompt,
      responseText,
      tokensUsed,
      source: 'gemini' as const,
      modelUsed: config.gemini.models.flash,
    };
  },

  async refreshDailyGames(date: Date = new Date()) {
    const day = getUtcDayStart(date);

    const results = await Promise.allSettled([
      this.generateAndStoreDailyConnections(day),
      ...ICEBREAKER_CATEGORY_IDS.map((category) => this.generateAndStoreDailyIcebreakers(category, day)),
    ]);

    const failures = results.filter((result) => result.status === 'rejected');

    if (failures.length > 0) {
      logger.warn('Daily games refresh completed with failures', {
        date: day.toISOString(),
        failures: failures.length,
      });
    } else {
      logger.info('Daily games refresh completed', { date: day.toISOString() });
    }
  },
};

export default gamesService;
