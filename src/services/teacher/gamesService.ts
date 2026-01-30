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

export type TriviaQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type TriviaPuzzle = {
  title: string;
  theme: string;
  questions: TriviaQuestion[];
};

export type CrosswordClue = {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
};

export type CrosswordPuzzle = {
  title: string;
  size: number;
  clues: CrosswordClue[];
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

const FALLBACK_TRIVIA: TriviaPuzzle[] = [
  {
    title: 'Classroom Wisdom',
    theme: 'Teaching Best Practices',
    questions: [
      {
        question: 'What does "scaffolding" mean in educational terms?',
        options: [
          'Building furniture for classrooms',
          'Providing temporary support structures for learning',
          'Creating lesson plan outlines',
          'Organizing student desks',
        ],
        correctIndex: 1,
        explanation: 'Scaffolding refers to temporary instructional support that helps students achieve learning goals they couldn\'t reach independently.',
      },
      {
        question: 'The "Zone of Proximal Development" was introduced by which theorist?',
        options: ['Jean Piaget', 'Lev Vygotsky', 'John Dewey', 'Maria Montessori'],
        correctIndex: 1,
        explanation: 'Vygotsky\'s ZPD describes the space between what a learner can do independently and what they can achieve with guidance.',
      },
      {
        question: 'What is a "formative assessment"?',
        options: [
          'A final exam at the end of a unit',
          'An ongoing assessment during learning',
          'A standardized state test',
          'A student self-evaluation',
        ],
        correctIndex: 1,
        explanation: 'Formative assessments are low-stakes checks during instruction that help teachers adjust their teaching in real-time.',
      },
      {
        question: 'What does IEP stand for?',
        options: [
          'Individual Education Plan',
          'Integrated Educational Program',
          'Inclusive Education Policy',
          'Instructional Evaluation Process',
        ],
        correctIndex: 0,
        explanation: 'An IEP is a legal document that outlines specialized instruction and services for students with disabilities.',
      },
      {
        question: 'Which teaching strategy involves students teaching each other?',
        options: ['Direct instruction', 'Peer tutoring', 'Lecture method', 'Rote learning'],
        correctIndex: 1,
        explanation: 'Peer tutoring leverages student collaboration and can benefit both the tutor and tutee.',
      },
    ],
  },
  {
    title: 'Education History',
    theme: 'Educational Pioneers',
    questions: [
      {
        question: 'Who is known as the "Father of Modern Education"?',
        options: ['Horace Mann', 'John Dewey', 'Johann Pestalozzi', 'Friedrich Froebel'],
        correctIndex: 0,
        explanation: 'Horace Mann championed public education in 19th century America and established the first state board of education.',
      },
      {
        question: 'What educational approach did Maria Montessori develop?',
        options: [
          'Teacher-directed whole class instruction',
          'Child-centered, self-directed learning',
          'Strict discipline and memorization',
          'Computer-based learning',
        ],
        correctIndex: 1,
        explanation: 'The Montessori method emphasizes hands-on learning, mixed-age classrooms, and student choice in activities.',
      },
      {
        question: 'When was the first kindergarten established?',
        options: ['1637', '1837', '1937', '1787'],
        correctIndex: 1,
        explanation: 'Friedrich Froebel opened the first kindergarten in Germany in 1837, introducing play-based early childhood education.',
      },
      {
        question: 'What does "Bloom\'s Taxonomy" classify?',
        options: [
          'Types of flowers in school gardens',
          'Levels of cognitive learning objectives',
          'Student behavior categories',
          'Classroom management styles',
        ],
        correctIndex: 1,
        explanation: 'Bloom\'s Taxonomy organizes educational goals from basic recall to higher-order thinking skills like analysis and creation.',
      },
      {
        question: 'Who wrote "Democracy and Education"?',
        options: ['Paulo Freire', 'John Dewey', 'Howard Gardner', 'Jerome Bruner'],
        correctIndex: 1,
        explanation: 'John Dewey\'s 1916 book emphasized experiential learning and education\'s role in democratic society.',
      },
    ],
  },
];

const FALLBACK_CROSSWORDS: CrosswordPuzzle[] = [
  {
    title: 'Classroom Basics',
    size: 10,
    clues: [
      { number: 1, clue: 'Learning objective target', answer: 'GOAL', row: 0, col: 0, direction: 'across' },
      { number: 2, clue: 'Student work folder', answer: 'BINDER', row: 0, col: 0, direction: 'down' },
      { number: 3, clue: 'Daily attendance check', answer: 'ROLL', row: 2, col: 4, direction: 'across' },
      { number: 4, clue: 'Teaching session', answer: 'LESSON', row: 1, col: 2, direction: 'down' },
      { number: 5, clue: 'End-of-class summary', answer: 'RECAP', row: 4, col: 0, direction: 'across' },
      { number: 6, clue: 'Learning team', answer: 'GROUP', row: 3, col: 3, direction: 'down' },
      { number: 7, clue: 'Classroom guidelines', answer: 'RULES', row: 6, col: 0, direction: 'across' },
      { number: 8, clue: 'Teaching helper', answer: 'AIDE', row: 5, col: 6, direction: 'down' },
    ],
  },
  {
    title: 'Teaching Tools',
    size: 10,
    clues: [
      { number: 1, clue: 'Visual display on wall', answer: 'CHART', row: 0, col: 0, direction: 'across' },
      { number: 2, clue: 'Writing surface', answer: 'BOARD', row: 0, col: 0, direction: 'down' },
      { number: 3, clue: 'Quick test', answer: 'QUIZ', row: 2, col: 2, direction: 'across' },
      { number: 4, clue: 'Grading guide', answer: 'RUBRIC', row: 1, col: 4, direction: 'down' },
      { number: 5, clue: 'Work surface', answer: 'DESK', row: 4, col: 0, direction: 'across' },
      { number: 6, clue: 'Presentation page', answer: 'SLIDE', row: 3, col: 5, direction: 'down' },
      { number: 7, clue: 'Reminder paper', answer: 'NOTE', row: 6, col: 0, direction: 'across' },
      { number: 8, clue: 'Writing tool', answer: 'PEN', row: 5, col: 3, direction: 'down' },
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

function pickFallbackTrivia(): TriviaPuzzle {
  return FALLBACK_TRIVIA[Math.floor(Math.random() * FALLBACK_TRIVIA.length)];
}

function pickFallbackCrossword(): CrosswordPuzzle {
  return FALLBACK_CROSSWORDS[Math.floor(Math.random() * FALLBACK_CROSSWORDS.length)];
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

function convertSingleQuotedStrings(input: string): string {
  let result = '';
  let inDouble = false;
  let inSingle = false;
  let escaped = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (inDouble) {
      if (escaped) {
        result += char;
        escaped = false;
        continue;
      }

      if (char === '\\') {
        result += char;
        escaped = true;
        continue;
      }

      if (char === '"') {
        inDouble = false;
      }

      result += char;
      continue;
    }

    if (inSingle) {
      if (escaped) {
        result += char;
        escaped = false;
        continue;
      }

      if (char === '\\') {
        result += char;
        escaped = true;
        continue;
      }

      if (char === "'") {
        inSingle = false;
        result += '"';
        continue;
      }

      if (char === '"') {
        result += '\\"';
        continue;
      }

      result += char;
      continue;
    }

    if (char === '"') {
      inDouble = true;
      result += char;
      continue;
    }

    if (char === "'") {
      inSingle = true;
      result += '"';
      continue;
    }

    result += char;
  }

  if (inSingle) {
    result += '"';
  }

  return result;
}

function escapeUnescapedQuotes(input: string): string {
  let result = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (inString) {
      if (escaped) {
        result += char;
        escaped = false;
        continue;
      }

      if (char === '\\') {
        result += char;
        escaped = true;
        continue;
      }

      if (char === '"') {
        let j = i + 1;
        while (j < input.length && /\s/.test(input[j])) {
          j += 1;
        }
        const next = input[j];
        if (next && ![',', '}', ']', ':'].includes(next)) {
          result += '\\"';
          continue;
        }
        inString = false;
        result += char;
        continue;
      }

      result += char;
      continue;
    }

    if (char === '"') {
      inString = true;
    }
    result += char;
  }

  return result;
}

function repairMissingCommas(input: string): string {
  const isValueStart = (char: string) =>
    char === '"' || char === '{' || char === '[' || char === '-' || /[0-9tfn]/.test(char);
  const isValueEnd = (char: string) =>
    char === '"' || char === '}' || char === ']' || /[0-9el]/.test(char);
  const isDivider = (char: string) => char === ',' || char === ':' || char === '{' || char === '[';

  let result = '';
  let inString = false;
  let escaped = false;
  let lastNonSpace = '';

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (inString) {
      if (escaped) {
        result += char;
        escaped = false;
        continue;
      }

      if (char === '\\') {
        result += char;
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      result += char;
      continue;
    }

    if (isValueStart(char) && lastNonSpace && isValueEnd(lastNonSpace) && !isDivider(lastNonSpace)) {
      result += ',';
    }

    if (char === '"') {
      inString = true;
    }

    if (!/\s/.test(char)) {
      lastNonSpace = char;
    }

    result += char;
  }

  return result;
}

function repairUnterminatedStrings(input: string): string {
  let result = '';
  let inString = false;
  let escaped = false;

  const isValueStart = (char: string) =>
    char === '"' || char === '{' || char === '[' || char === '-' || /[0-9tfn]/.test(char);

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (inString) {
      if (escaped) {
        result += char;
        escaped = false;
        continue;
      }

      if (char === '\\') {
        result += char;
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = false;
        result += char;
        continue;
      }

      if (char === '\n' || char === '\r') {
        result += ' ';
        continue;
      }

      if (char === ',' || char === '}' || char === ']') {
        let j = i + 1;
        while (j < input.length && /\s/.test(input[j])) {
          j += 1;
        }
        const next = input[j];
        if (!next || isValueStart(next) || next === '}' || next === ']') {
          result += '"';
          inString = false;
          result += char;
          continue;
        }
      }

      result += char;
      continue;
    }

    if (char === '"') {
      inString = true;
    }

    result += char;
  }

  if (inString) {
    result += '"';
  }

  return result;
}

function quoteUnquotedKeys(input: string): string {
  let result = '';
  let inString = false;
  let escaped = false;
  const stack: Array<{ type: 'object' | 'array'; expectingKey?: boolean }> = [];

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (inString) {
      if (escaped) {
        result += char;
        escaped = false;
        continue;
      }

      if (char === '\\') {
        result += char;
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      result += char;
      continue;
    }

    if (char === '"') {
      inString = true;
      result += char;
      continue;
    }

    if (char === '{') {
      stack.push({ type: 'object', expectingKey: true });
      result += char;
      continue;
    }

    if (char === '[') {
      stack.push({ type: 'array' });
      result += char;
      continue;
    }

    if (char === '}' || char === ']') {
      stack.pop();
      result += char;
      continue;
    }

    const context = stack[stack.length - 1];

    if (context?.type === 'object') {
      if (char === ':') {
        context.expectingKey = false;
        result += char;
        continue;
      }

      if (char === ',') {
        context.expectingKey = true;
        result += char;
        continue;
      }

      if (context.expectingKey) {
        if (/\s/.test(char)) {
          result += char;
          continue;
        }

        if (/[A-Za-z_]/.test(char)) {
          let j = i;
          let key = '';
          while (j < input.length && /[A-Za-z0-9_]/.test(input[j])) {
            key += input[j];
            j += 1;
          }
          result += `"${key}"`;
          i = j - 1;
          context.expectingKey = false;
          continue;
        }
      }
    }

    result += char;
  }

  return result;
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
      const singleQuotedFixed = convertSingleQuotedStrings(sanitized);
      const escaped = escapeUnescapedQuotes(singleQuotedFixed);
      const unterminatedFixed = repairUnterminatedStrings(escaped);
      const commaFixed = repairMissingCommas(unterminatedFixed);
      const quotedKeys = quoteUnquotedKeys(commaFixed);

      try {
        const repaired = JSON.parse(quotedKeys) as T;
        logger.warn(`${context} JSON parse required repair`, {
          originalLength: candidate.length,
          sanitizedLength: sanitized.length,
          repairedLength: quotedKeys.length,
        });
        return repaired;
      } catch (thirdError) {
        const firstMessage = firstError instanceof Error ? firstError.message : String(firstError);
        const secondMessage = secondError instanceof Error ? secondError.message : String(secondError);
        const thirdMessage = thirdError instanceof Error ? thirdError.message : String(thirdError);
        throw new Error(`${context} JSON parse failed (${firstMessage}; sanitized: ${secondMessage}; repaired: ${thirdMessage})`);
      }
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

function normalizeTriviaPuzzle(data: unknown): TriviaPuzzle | null {
  if (!data || typeof data !== 'object') return null;
  const raw = data as any;

  const title = typeof raw.title === 'string' && raw.title.trim()
    ? raw.title.trim()
    : 'Teacher Trivia';

  const theme = typeof raw.theme === 'string' && raw.theme.trim()
    ? raw.theme.trim()
    : 'Education';

  if (!Array.isArray(raw.questions) || raw.questions.length < 5) return null;

  const questions: TriviaQuestion[] = raw.questions.slice(0, 5).map((q: any) => {
    const question = typeof q?.question === 'string' ? q.question.trim() : '';
    const options = Array.isArray(q?.options)
      ? q.options.map((o: any) => String(o).trim()).filter(Boolean).slice(0, 4)
      : [];
    const correctIndex = typeof q?.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < options.length
      ? q.correctIndex
      : 0;
    const explanation = typeof q?.explanation === 'string' ? q.explanation.trim() : 'No explanation provided.';

    return {
      question,
      options,
      correctIndex,
      explanation,
    };
  });

  if (questions.some((q) => !q.question || q.options.length !== 4)) return null;

  return { title, theme, questions };
}

function normalizeCrosswordPuzzle(data: unknown): CrosswordPuzzle | null {
  if (!data || typeof data !== 'object') return null;
  const raw = data as any;

  const title = typeof raw.title === 'string' && raw.title.trim()
    ? raw.title.trim()
    : 'Quick Crossword';

  const size = typeof raw.size === 'number' && raw.size >= 8 && raw.size <= 15
    ? raw.size
    : 10;

  if (!Array.isArray(raw.clues) || raw.clues.length < 6) return null;

  const clues: CrosswordClue[] = raw.clues.slice(0, 8).map((c: any, index: number) => {
    const number = typeof c?.number === 'number' ? c.number : index + 1;
    const clue = typeof c?.clue === 'string' ? c.clue.trim() : '';
    const answer = typeof c?.answer === 'string' ? c.answer.toUpperCase().replace(/[^A-Z]/g, '') : '';
    const row = typeof c?.row === 'number' ? c.row : 0;
    const col = typeof c?.col === 'number' ? c.col : 0;
    const direction = c?.direction === 'down' ? 'down' : 'across';

    return {
      number,
      clue,
      answer,
      row,
      col,
      direction: direction as 'across' | 'down',
    };
  });

  // Filter out invalid clues instead of failing entirely
  const validClues = clues.filter((c) => c.clue && c.answer && c.answer.length >= 3);
  if (validClues.length < 6) return null;

  return { title, size, clues: validClues };
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

function buildTriviaPrompt(input: {
  topic?: string;
  theme?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}): string {
  const topicLine = input.topic ? `Topic focus: ${input.topic}.` : 'Topic: Education, pedagogy, classroom culture, and teaching history.';
  const themeLine = input.theme ? `Theme: ${input.theme}.` : '';
  const difficultyLine = input.difficulty ? `Difficulty: ${input.difficulty}.` : 'Difficulty: medium.';

  return `You are creating a 5-question trivia quiz for teachers.

${topicLine}
${themeLine}
${difficultyLine}

Rules:
- Create EXACTLY 5 multiple-choice questions.
- Each question must have EXACTLY 4 answer options.
- Questions should be about teaching methods, education history, classroom management, or pedagogy.
- Keep questions fun and interesting - not boring textbook facts.
- Include a brief explanation for the correct answer.
- Do not include quotation marks inside any value.

Return JSON ONLY with this exact shape:
{
  "title": "Short trivia title",
  "theme": "Theme description",
  "questions": [
    {
      "question": "The question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of why this is correct."
    }
  ]
}`;
}

function buildCrosswordPrompt(input: {
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}): string {
  const topic = input.topic || 'education and teaching';
  const difficulty = input.difficulty || 'medium';

  return `Generate a crossword puzzle about ${topic}. Difficulty: ${difficulty}.

Create 8 clues. Each answer is a single uppercase word (4-7 letters).
${difficulty === 'easy' ? 'Use simple, common words.' : difficulty === 'hard' ? 'Use advanced terminology.' : 'Mix of common and challenging words.'}

Output valid JSON only:
{
  "title": "Puzzle Title",
  "size": 10,
  "clues": [
    {"number": 1, "clue": "Clue here", "answer": "WORD", "row": 0, "col": 0, "direction": "across"},
    {"number": 2, "clue": "Clue here", "answer": "WORD", "row": 0, "col": 2, "direction": "down"},
    {"number": 3, "clue": "Clue here", "answer": "WORD", "row": 2, "col": 0, "direction": "across"},
    {"number": 4, "clue": "Clue here", "answer": "WORD", "row": 1, "col": 4, "direction": "down"},
    {"number": 5, "clue": "Clue here", "answer": "WORD", "row": 4, "col": 0, "direction": "across"},
    {"number": 6, "clue": "Clue here", "answer": "WORD", "row": 3, "col": 6, "direction": "down"},
    {"number": 7, "clue": "Clue here", "answer": "WORD", "row": 6, "col": 0, "direction": "across"},
    {"number": 8, "clue": "Clue here", "answer": "WORD", "row": 5, "col": 3, "direction": "down"}
  ]
}`;
}

const CROSSWORD_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    size: { type: 'integer', minimum: 10, maximum: 10 },
    clues: {
      type: 'array',
      minItems: 8,
      maxItems: 8,
      items: {
        type: 'object',
        properties: {
          number: { type: 'integer', minimum: 1, maximum: 10 },
          clue: { type: 'string' },
          answer: { type: 'string' },
          row: { type: 'integer', minimum: 0, maximum: 9 },
          col: { type: 'integer', minimum: 0, maximum: 9 },
          direction: { type: 'string', enum: ['across', 'down'] },
        },
        required: ['number', 'clue', 'answer', 'row', 'col', 'direction'],
      },
    },
  },
  required: ['title', 'size', 'clues'],
};

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

async function generateTriviaWithGemini(input: {
  topic?: string;
  theme?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}) {
  const prompt = buildTriviaPrompt(input);
  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 1800,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const responseText = response.text();
  const parsed = parseJSONSafely(responseText, 'Trivia');
  const normalized = normalizeTriviaPuzzle(parsed);

  if (!normalized) {
    throw new Error('Gemini response did not match expected trivia shape');
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

async function generateCrosswordWithGemini(input: {
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}) {
  const prompt = buildCrosswordPrompt(input);
  // Use Pro model for better structured JSON output
  const model = genAI.getGenerativeModel({
    model: config.gemini.models.pro,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2500,
      responseMimeType: 'application/json',
      responseSchema: CROSSWORD_RESPONSE_SCHEMA as any,
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const responseText = response.text();
  const parsed = parseJSONSafely(responseText, 'Crossword');
  const normalized = normalizeCrosswordPuzzle(parsed);

  if (!normalized) {
    throw new Error('Gemini response did not match expected crossword shape');
  }

  const tokensUsed = response.usageMetadata?.totalTokenCount ?? null;

  return {
    puzzle: normalized,
    prompt,
    responseText,
    tokensUsed,
    source: 'gemini' as const,
    modelUsed: config.gemini.models.pro,
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

  // ========================================
  // TRIVIA METHODS
  // ========================================

  async getDailyTrivia(date: Date = new Date()) {
    const day = getUtcDayStart(date);

    const existing = await prisma.dailyGame.findUnique({
      where: {
        date_gameType_key: {
          date: day,
          gameType: DailyGameType.TRIVIA,
          key: DAILY_GAME_DEFAULT_KEY,
        },
      },
    });

    if (existing) {
      return {
        puzzle: existing.payload as TriviaPuzzle,
        meta: {
          source: 'daily_cache',
          modelUsed: existing.modelUsed || config.gemini.models.flash,
        },
      };
    }

    const generated = await this.generateAndStoreDailyTrivia(day);
    return {
      puzzle: generated.puzzle,
      meta: {
        source: generated.source === 'gemini' ? 'daily_gemini' : 'daily_fallback',
        modelUsed: generated.modelUsed,
      },
    };
  },

  async generateAndStoreDailyTrivia(day: Date) {
    try {
      const generated = await generateTriviaWithGemini({});

      await prisma.dailyGame.upsert({
        where: {
          date_gameType_key: {
            date: day,
            gameType: DailyGameType.TRIVIA,
            key: DAILY_GAME_DEFAULT_KEY,
          },
        },
        create: {
          date: day,
          gameType: DailyGameType.TRIVIA,
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

      logger.info('Daily trivia puzzle stored', {
        date: day.toISOString(),
        source: generated.source,
        tokensUsed: generated.tokensUsed,
      });

      return generated;
    } catch (error) {
      logger.warn('Daily trivia generation failed, storing fallback', {
        date: day.toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const fallback = pickFallbackTrivia();

      await prisma.dailyGame.upsert({
        where: {
          date_gameType_key: {
            date: day,
            gameType: DailyGameType.TRIVIA,
            key: DAILY_GAME_DEFAULT_KEY,
          },
        },
        create: {
          date: day,
          gameType: DailyGameType.TRIVIA,
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

  async generateTriviaOnDemand(input: {
    topic?: string;
    theme?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  }) {
    try {
      const generated = await generateTriviaWithGemini(input);

      logger.info('Generated trivia puzzle on demand', {
        topic: input.topic,
        tokensUsed: generated.tokensUsed,
      });

      return generated;
    } catch (error) {
      logger.warn('Trivia generation failed, using fallback puzzle', {
        topic: input.topic,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return {
        puzzle: pickFallbackTrivia(),
        prompt: '',
        responseText: '',
        tokensUsed: null,
        source: 'fallback' as const,
        modelUsed: config.gemini.models.flash,
      };
    }
  },

  // ========================================
  // CROSSWORD METHODS
  // ========================================

  async getDailyCrossword(date: Date = new Date()) {
    const day = getUtcDayStart(date);

    const existing = await prisma.dailyGame.findUnique({
      where: {
        date_gameType_key: {
          date: day,
          gameType: DailyGameType.CROSSWORD,
          key: DAILY_GAME_DEFAULT_KEY,
        },
      },
    });

    if (existing) {
      return {
        puzzle: existing.payload as CrosswordPuzzle,
        meta: {
          source: 'daily_cache',
          modelUsed: existing.modelUsed || config.gemini.models.flash,
        },
      };
    }

    const generated = await this.generateAndStoreDailyCrossword(day);
    return {
      puzzle: generated.puzzle,
      meta: {
        source: generated.source === 'gemini' ? 'daily_gemini' : 'daily_fallback',
        modelUsed: generated.modelUsed,
      },
    };
  },

  async generateAndStoreDailyCrossword(day: Date) {
    try {
      const generated = await generateCrosswordWithGemini({});

      await prisma.dailyGame.upsert({
        where: {
          date_gameType_key: {
            date: day,
            gameType: DailyGameType.CROSSWORD,
            key: DAILY_GAME_DEFAULT_KEY,
          },
        },
        create: {
          date: day,
          gameType: DailyGameType.CROSSWORD,
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

      logger.info('Daily crossword puzzle stored', {
        date: day.toISOString(),
        source: generated.source,
        tokensUsed: generated.tokensUsed,
      });

      return generated;
    } catch (error) {
      logger.warn('Daily crossword generation failed, storing fallback', {
        date: day.toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      const fallback = pickFallbackCrossword();

      await prisma.dailyGame.upsert({
        where: {
          date_gameType_key: {
            date: day,
            gameType: DailyGameType.CROSSWORD,
            key: DAILY_GAME_DEFAULT_KEY,
          },
        },
        create: {
          date: day,
          gameType: DailyGameType.CROSSWORD,
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

  async generateCrosswordOnDemand(input: {
    topic?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  }) {
    try {
      const generated = await generateCrosswordWithGemini(input);

      logger.info('Generated crossword puzzle on demand', {
        topic: input.topic,
        tokensUsed: generated.tokensUsed,
      });

      return generated;
    } catch (error) {
      logger.warn('Crossword generation failed, using fallback puzzle', {
        topic: input.topic,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return {
        puzzle: pickFallbackCrossword(),
        prompt: '',
        responseText: '',
        tokensUsed: null,
        source: 'fallback' as const,
        modelUsed: config.gemini.models.flash,
      };
    }
  },

  async refreshDailyGames(date: Date = new Date()) {
    const day = getUtcDayStart(date);

    const results = await Promise.allSettled([
      this.generateAndStoreDailyConnections(day),
      this.generateAndStoreDailyTrivia(day),
      this.generateAndStoreDailyCrossword(day),
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
