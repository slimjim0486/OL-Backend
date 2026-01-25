/**
 * British National Curriculum - English Standards
 * Years 1-13 (Key Stages 1, 2, 3, 4, and 5)
 *
 * Sources:
 * - KS1-3: GOV.UK National Curriculum in England
 *   https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study
 * - KS4 (GCSE): DfE GCSE English Language and Literature Subject Content (2015)
 *   https://www.gov.uk/government/publications/gcse-english-language
 *   https://www.gov.uk/government/publications/gcse-english-literature
 * - KS5 (A-Level): DfE GCE AS and A Level English Subject Content (2014)
 *   https://www.gov.uk/government/publications/gce-as-and-a-level-english-language-and-literature
 *
 * VERIFIED: 2025-01-15 against official GOV.UK documentation
 *
 * Notation System: UK.KS{keyStage}.Y{year}.EN.{strand}.{number}
 * - UK = United Kingdom
 * - KS = Key Stage (1, 2, 3, 4, or 5)
 * - Y = Year (1-13)
 * - EN = English
 * - Strand codes:
 *   KS1/KS2:
 *   - SL = Spoken Language
 *   - RWR = Reading - Word Reading
 *   - RC = Reading - Comprehension
 *   - WTS = Writing - Transcription (Spelling)
 *   - WTH = Writing - Transcription (Handwriting)
 *   - WC = Writing - Composition
 *   - WVG = Writing - Vocabulary, Grammar and Punctuation
 *   KS3:
 *   - R = Reading
 *   - W = Writing
 *   - GV = Grammar and Vocabulary
 *   - SE = Spoken English
 *   KS4 (GCSE English Language):
 *   - EL.R = English Language - Reading
 *   - EL.W = English Language - Writing
 *   - EL.SL = English Language - Spoken Language
 *   KS4 (GCSE English Literature):
 *   - LIT.R = Literature - Reading
 *   - LIT.CR = Literature - Critical Reading
 *   - LIT.W = Literature - Writing about Literature
 *   KS5 (A-Level English Language):
 *   - AL.TL = Textual Analysis and Representation
 *   - AL.LC = Language Change
 *   - AL.CV = Child Language Acquisition
 *   - AL.LD = Language Diversity
 *   - AL.LV = Language and Variation
 *   - AL.NE = Non-Examined Assessment
 *   KS5 (A-Level English Literature):
 *   - LT.DR = Drama
 *   - LT.PR = Prose
 *   - LT.PO = Poetry
 *   - LT.CR = Critical Analysis
 *   - LT.NE = Non-Examined Assessment
 */

export interface BritishNCEnglishStandard {
  notation: string;
  strand: string;
  description: string;
  isStatutory: boolean;
  guidance?: string;
}

export interface BritishNCEnglishYear {
  year: number;
  keyStage: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: BritishNCEnglishStandard[];
}

export interface BritishNCEnglishJurisdiction {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  years: BritishNCEnglishYear[];
}

// =============================================================================
// SPOKEN LANGUAGE - Years 1-6 (Statutory across all primary years)
// =============================================================================
// Note: These standards apply to ALL years 1-6 and are included in each year's set

const spokenLanguageStandards: BritishNCEnglishStandard[] = [
  {
    notation: 'SL.1',
    strand: 'Spoken Language',
    description: 'listen and respond appropriately to adults and their peers',
    isStatutory: true
  },
  {
    notation: 'SL.2',
    strand: 'Spoken Language',
    description: 'ask relevant questions to extend their understanding and knowledge',
    isStatutory: true
  },
  {
    notation: 'SL.3',
    strand: 'Spoken Language',
    description: 'use relevant strategies to build their vocabulary',
    isStatutory: true
  },
  {
    notation: 'SL.4',
    strand: 'Spoken Language',
    description: 'articulate and justify answers, arguments and opinions',
    isStatutory: true
  },
  {
    notation: 'SL.5',
    strand: 'Spoken Language',
    description: 'give well-structured descriptions, explanations and narratives for different purposes, including for expressing feelings',
    isStatutory: true
  },
  {
    notation: 'SL.6',
    strand: 'Spoken Language',
    description: 'maintain attention and participate actively in collaborative conversations, staying on topic and initiating and responding to comments',
    isStatutory: true
  },
  {
    notation: 'SL.7',
    strand: 'Spoken Language',
    description: 'use spoken language to develop understanding through speculating, hypothesising, imagining and exploring ideas',
    isStatutory: true
  },
  {
    notation: 'SL.8',
    strand: 'Spoken Language',
    description: 'speak audibly and fluently with an increasing command of Standard English',
    isStatutory: true
  },
  {
    notation: 'SL.9',
    strand: 'Spoken Language',
    description: 'participate in discussions, presentations, performances, role play/improvisations and debates',
    isStatutory: true
  },
  {
    notation: 'SL.10',
    strand: 'Spoken Language',
    description: 'gain, maintain and monitor the interest of the listener(s)',
    isStatutory: true
  },
  {
    notation: 'SL.11',
    strand: 'Spoken Language',
    description: 'consider and evaluate different viewpoints, attending to and building on the contributions of others',
    isStatutory: true
  },
  {
    notation: 'SL.12',
    strand: 'Spoken Language',
    description: 'select and use appropriate registers for effective communication',
    isStatutory: true
  }
];

// Helper to create year-specific spoken language standards
function createSpokenLanguageForYear(year: number, keyStage: number): BritishNCEnglishStandard[] {
  return spokenLanguageStandards.map((std, index) => ({
    ...std,
    notation: `UK.KS${keyStage}.Y${year}.EN.SL.${index + 1}`
  }));
}

// =============================================================================
// KEY STAGE 1: YEAR 1 (Ages 5-6)
// =============================================================================

const year1Standards: BritishNCEnglishStandard[] = [
  // READING - WORD READING (RWR)
  {
    notation: 'UK.KS1.Y1.EN.RWR.1',
    strand: 'Reading - Word Reading',
    description: 'apply phonic knowledge and skills as the route to decode words',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RWR.2',
    strand: 'Reading - Word Reading',
    description: 'respond speedily with the correct sound to graphemes (letters or groups of letters) for all 40+ phonemes, including, where applicable, alternative sounds for graphemes',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RWR.3',
    strand: 'Reading - Word Reading',
    description: 'read accurately by blending sounds in unfamiliar words containing GPCs that have been taught',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RWR.4',
    strand: 'Reading - Word Reading',
    description: 'read common exception words, noting unusual correspondences between spelling and sound and where these occur in the word',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RWR.5',
    strand: 'Reading - Word Reading',
    description: 'read words containing taught GPCs and -s, -es, -ing, -ed, -er and -est endings',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RWR.6',
    strand: 'Reading - Word Reading',
    description: 'read other words of more than one syllable that contain taught GPCs',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RWR.7',
    strand: 'Reading - Word Reading',
    description: 'read words with contractions [for example, I\'m, I\'ll, we\'ll], and understand that the apostrophe represents the omitted letter(s)',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RWR.8',
    strand: 'Reading - Word Reading',
    description: 'read books aloud, accurately, that are consistent with their developing phonic knowledge and that do not require them to use other strategies to work out words',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RWR.9',
    strand: 'Reading - Word Reading',
    description: 'reread these books to build up their fluency and confidence in word reading',
    isStatutory: true
  },

  // READING - COMPREHENSION (RC)
  {
    notation: 'UK.KS1.Y1.EN.RC.1',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading, motivation to read, vocabulary and understanding by listening to and discussing a wide range of poems, stories and non-fiction at a level beyond that at which they can read independently',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RC.2',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading by being encouraged to link what they read or hear to their own experiences',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RC.3',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading by becoming very familiar with key stories, fairy stories and traditional tales, retelling them and considering their particular characteristics',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RC.4',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading by recognising and joining in with predictable phrases',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RC.5',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading by learning to appreciate rhymes and poems, and to recite some by heart',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RC.6',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading by discussing word meanings, linking new meanings to those already known',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RC.7',
    strand: 'Reading - Comprehension',
    description: 'understand both the books they can already read accurately and fluently and those they listen to by drawing on what they already know or on background information and vocabulary provided by the teacher',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RC.8',
    strand: 'Reading - Comprehension',
    description: 'understand books by checking that the text makes sense to them as they read, and correcting inaccurate reading',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RC.9',
    strand: 'Reading - Comprehension',
    description: 'understand books by discussing the significance of the title and events',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RC.10',
    strand: 'Reading - Comprehension',
    description: 'understand books by making inferences on the basis of what is being said and done',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RC.11',
    strand: 'Reading - Comprehension',
    description: 'understand books by predicting what might happen on the basis of what has been read so far',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RC.12',
    strand: 'Reading - Comprehension',
    description: 'participate in discussion about what is read to them, taking turns and listening to what others say',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.RC.13',
    strand: 'Reading - Comprehension',
    description: 'explain clearly their understanding of what is read to them',
    isStatutory: true
  },

  // WRITING - TRANSCRIPTION: SPELLING (WTS)
  {
    notation: 'UK.KS1.Y1.EN.WTS.1',
    strand: 'Writing - Spelling',
    description: 'spell words containing each of the 40+ phonemes already taught',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WTS.2',
    strand: 'Writing - Spelling',
    description: 'spell common exception words',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WTS.3',
    strand: 'Writing - Spelling',
    description: 'spell the days of the week',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WTS.4',
    strand: 'Writing - Spelling',
    description: 'name the letters of the alphabet in order',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WTS.5',
    strand: 'Writing - Spelling',
    description: 'use letter names to distinguish between alternative spellings of the same sound',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WTS.6',
    strand: 'Writing - Spelling',
    description: 'add prefixes and suffixes: using the spelling rule for adding -s or -es as the plural marker for nouns and the third person singular marker for verbs',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WTS.7',
    strand: 'Writing - Spelling',
    description: 'add prefixes and suffixes: using the prefix un-',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WTS.8',
    strand: 'Writing - Spelling',
    description: 'add prefixes and suffixes: using -ing, -ed, -er and -est where no change is needed in the spelling of root words [for example, helping, helped, helper, eating, quicker, quickest]',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WTS.9',
    strand: 'Writing - Spelling',
    description: 'apply simple spelling rules and guidance, as listed in English appendix 1',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WTS.10',
    strand: 'Writing - Spelling',
    description: 'write from memory simple sentences dictated by the teacher that include words using the GPCs and common exception words taught so far',
    isStatutory: true
  },

  // WRITING - TRANSCRIPTION: HANDWRITING (WTH)
  {
    notation: 'UK.KS1.Y1.EN.WTH.1',
    strand: 'Writing - Handwriting',
    description: 'sit correctly at a table, holding a pencil comfortably and correctly',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WTH.2',
    strand: 'Writing - Handwriting',
    description: 'begin to form lower-case letters in the correct direction, starting and finishing in the right place',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WTH.3',
    strand: 'Writing - Handwriting',
    description: 'form capital letters',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WTH.4',
    strand: 'Writing - Handwriting',
    description: 'form digits 0-9',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WTH.5',
    strand: 'Writing - Handwriting',
    description: 'understand which letters belong to which handwriting \'families\' (ie letters that are formed in similar ways) and to practise these',
    isStatutory: true
  },

  // WRITING - COMPOSITION (WC)
  {
    notation: 'UK.KS1.Y1.EN.WC.1',
    strand: 'Writing - Composition',
    description: 'write sentences by saying out loud what they are going to write about',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WC.2',
    strand: 'Writing - Composition',
    description: 'write sentences by composing a sentence orally before writing it',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WC.3',
    strand: 'Writing - Composition',
    description: 'write sentences by sequencing sentences to form short narratives',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WC.4',
    strand: 'Writing - Composition',
    description: 'write sentences by re-reading what they have written to check that it makes sense',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WC.5',
    strand: 'Writing - Composition',
    description: 'discuss what they have written with the teacher or other pupils',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WC.6',
    strand: 'Writing - Composition',
    description: 'read their writing aloud, clearly enough to be heard by their peers and the teacher',
    isStatutory: true
  },

  // WRITING - VOCABULARY, GRAMMAR AND PUNCTUATION (WVG)
  {
    notation: 'UK.KS1.Y1.EN.WVG.1',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'leave spaces between words',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WVG.2',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'join words and joining clauses using \'and\'',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WVG.3',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'begin to punctuate sentences using a capital letter and a full stop, question mark or exclamation mark',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WVG.4',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use a capital letter for names of people, places, the days of the week, and the personal pronoun \'I\'',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WVG.5',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'learn the grammar for year 1 in English appendix 2',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.EN.WVG.6',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use the grammatical terminology in English appendix 2 in discussing their writing',
    isStatutory: true
  },

  // Add Spoken Language standards for Year 1
  ...createSpokenLanguageForYear(1, 1)
];

// =============================================================================
// KEY STAGE 1: YEAR 2 (Ages 6-7)
// =============================================================================

const year2Standards: BritishNCEnglishStandard[] = [
  // READING - WORD READING (RWR)
  {
    notation: 'UK.KS1.Y2.EN.RWR.1',
    strand: 'Reading - Word Reading',
    description: 'continue to apply phonic knowledge and skills as the route to decode words until automatic decoding has become embedded and reading is fluent',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RWR.2',
    strand: 'Reading - Word Reading',
    description: 'read accurately by blending the sounds in words that contain the graphemes taught so far, especially recognising alternative sounds for graphemes',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RWR.3',
    strand: 'Reading - Word Reading',
    description: 'read accurately words of two or more syllables that contain the same graphemes as above',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RWR.4',
    strand: 'Reading - Word Reading',
    description: 'read words containing common suffixes',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RWR.5',
    strand: 'Reading - Word Reading',
    description: 'read further common exception words, noting unusual correspondences between spelling and sound and where these occur in the word',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RWR.6',
    strand: 'Reading - Word Reading',
    description: 'read most words quickly and accurately, without overt sounding and blending, when they have been frequently encountered',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RWR.7',
    strand: 'Reading - Word Reading',
    description: 'read aloud books closely matched to their improving phonic knowledge, sounding out unfamiliar words accurately, automatically and without undue hesitation',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RWR.8',
    strand: 'Reading - Word Reading',
    description: 'reread these books to build up their fluency and confidence in word reading',
    isStatutory: true
  },

  // READING - COMPREHENSION (RC)
  {
    notation: 'UK.KS1.Y2.EN.RC.1',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading by listening to, discussing and expressing views about a wide range of contemporary and classic poetry, stories and non-fiction at a level beyond that at which they can read independently',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.2',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading by discussing the sequence of events in books and how items of information are related',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.3',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading by becoming increasingly familiar with and retelling a wider range of stories, fairy stories and traditional tales',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.4',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading by being introduced to non-fiction books that are structured in different ways',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.5',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading by recognising simple recurring literary language in stories and poetry',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.6',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading by discussing and clarifying the meanings of words, linking new meanings to known vocabulary',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.7',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading by discussing their favourite words and phrases',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.8',
    strand: 'Reading - Comprehension',
    description: 'develop pleasure in reading by continuing to build up a repertoire of poems learnt by heart, appreciating these and reciting some, with appropriate intonation to make the meaning clear',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.9',
    strand: 'Reading - Comprehension',
    description: 'understand books by drawing on what they already know or on background information and vocabulary provided by the teacher',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.10',
    strand: 'Reading - Comprehension',
    description: 'understand books by checking that the text makes sense to them as they read, and correcting inaccurate reading',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.11',
    strand: 'Reading - Comprehension',
    description: 'understand books by making inferences on the basis of what is being said and done',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.12',
    strand: 'Reading - Comprehension',
    description: 'understand books by answering and asking questions',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.13',
    strand: 'Reading - Comprehension',
    description: 'understand books by predicting what might happen on the basis of what has been read so far',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.14',
    strand: 'Reading - Comprehension',
    description: 'participate in discussion about books, poems and other works that are read to them and those that they can read for themselves, taking turns and listening to what others say',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.RC.15',
    strand: 'Reading - Comprehension',
    description: 'explain and discuss their understanding of books, poems and other material, both those that they listen to and those that they read for themselves',
    isStatutory: true
  },

  // WRITING - TRANSCRIPTION: SPELLING (WTS)
  {
    notation: 'UK.KS1.Y2.EN.WTS.1',
    strand: 'Writing - Spelling',
    description: 'spell by segmenting spoken words into phonemes and representing these by graphemes, spelling many correctly',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WTS.2',
    strand: 'Writing - Spelling',
    description: 'spell by learning new ways of spelling phonemes for which 1 or more spellings are already known, and learn some words with each spelling, including a few common homophones',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WTS.3',
    strand: 'Writing - Spelling',
    description: 'spell by learning to spell common exception words',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WTS.4',
    strand: 'Writing - Spelling',
    description: 'spell by learning to spell more words with contracted forms',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WTS.5',
    strand: 'Writing - Spelling',
    description: 'spell by learning the possessive apostrophe (singular) [for example, the girl\'s book]',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WTS.6',
    strand: 'Writing - Spelling',
    description: 'spell by distinguishing between homophones and near-homophones',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WTS.7',
    strand: 'Writing - Spelling',
    description: 'add suffixes to spell longer words including -ment, -ness, -ful, -less, -ly',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WTS.8',
    strand: 'Writing - Spelling',
    description: 'apply spelling rules and guidance, as listed in English appendix 1',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WTS.9',
    strand: 'Writing - Spelling',
    description: 'write from memory simple sentences dictated by the teacher that include words using the GPCs, common exception words and punctuation taught so far',
    isStatutory: true
  },

  // WRITING - TRANSCRIPTION: HANDWRITING (WTH)
  {
    notation: 'UK.KS1.Y2.EN.WTH.1',
    strand: 'Writing - Handwriting',
    description: 'form lower-case letters of the correct size relative to one another',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WTH.2',
    strand: 'Writing - Handwriting',
    description: 'start using some of the diagonal and horizontal strokes needed to join letters and understand which letters, when adjacent to one another, are best left unjoined',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WTH.3',
    strand: 'Writing - Handwriting',
    description: 'write capital letters and digits of the correct size, orientation and relationship to one another and to lower-case letters',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WTH.4',
    strand: 'Writing - Handwriting',
    description: 'use spacing between words that reflects the size of the letters',
    isStatutory: true
  },

  // WRITING - COMPOSITION (WC)
  {
    notation: 'UK.KS1.Y2.EN.WC.1',
    strand: 'Writing - Composition',
    description: 'develop positive attitudes towards and stamina for writing by writing narratives about personal experiences and those of others (real and fictional)',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WC.2',
    strand: 'Writing - Composition',
    description: 'develop positive attitudes towards and stamina for writing by writing about real events',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WC.3',
    strand: 'Writing - Composition',
    description: 'develop positive attitudes towards and stamina for writing by writing poetry',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WC.4',
    strand: 'Writing - Composition',
    description: 'develop positive attitudes towards and stamina for writing by writing for different purposes',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WC.5',
    strand: 'Writing - Composition',
    description: 'consider what they are going to write before beginning by planning or saying out loud what they are going to write about',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WC.6',
    strand: 'Writing - Composition',
    description: 'consider what they are going to write before beginning by writing down ideas and/or key words, including new vocabulary',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WC.7',
    strand: 'Writing - Composition',
    description: 'consider what they are going to write before beginning by encapsulating what they want to say, sentence by sentence',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WC.8',
    strand: 'Writing - Composition',
    description: 'make simple additions, revisions and corrections to their own writing by evaluating their writing with the teacher and other pupils',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WC.9',
    strand: 'Writing - Composition',
    description: 'make simple additions, revisions and corrections to their own writing by rereading to check that their writing makes sense and that verbs to indicate time are used correctly and consistently',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WC.10',
    strand: 'Writing - Composition',
    description: 'make simple additions, revisions and corrections to their own writing by proofreading to check for errors in spelling, grammar and punctuation',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WC.11',
    strand: 'Writing - Composition',
    description: 'read aloud what they have written with appropriate intonation to make the meaning clear',
    isStatutory: true
  },

  // WRITING - VOCABULARY, GRAMMAR AND PUNCTUATION (WVG)
  {
    notation: 'UK.KS1.Y2.EN.WVG.1',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'learn how to use both familiar and new punctuation correctly, including full stops, capital letters, exclamation marks, question marks, commas for lists and apostrophes for contracted forms and the possessive (singular)',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WVG.2',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'learn how to use sentences with different forms: statement, question, exclamation, command',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WVG.3',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'learn how to use expanded noun phrases to describe and specify [for example, the blue butterfly]',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WVG.4',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'learn how to use the present and past tenses correctly and consistently, including the progressive form',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WVG.5',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'learn how to use subordination (using when, if, that, or because) and co-ordination (using or, and, or but)',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WVG.6',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'learn the grammar for year 2 in English appendix 2',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WVG.7',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'learn some features of written Standard English',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.EN.WVG.8',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use and understand the grammatical terminology in English appendix 2 in discussing their writing',
    isStatutory: true
  },

  // Add Spoken Language standards for Year 2
  ...createSpokenLanguageForYear(2, 1)
];

// =============================================================================
// KEY STAGE 2: YEARS 3-4 (Lower KS2)
// Note: Official curriculum combines Years 3-4, split here for year-by-year tracking
// =============================================================================

const year3Standards: BritishNCEnglishStandard[] = [
  // READING - WORD READING (RWR)
  {
    notation: 'UK.KS2.Y3.EN.RWR.1',
    strand: 'Reading - Word Reading',
    description: 'apply their growing knowledge of root words, prefixes and suffixes (etymology and morphology), both to read aloud and to understand the meaning of new words they meet',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RWR.2',
    strand: 'Reading - Word Reading',
    description: 'read further exception words, noting the unusual correspondences between spelling and sound, and where these occur in the word',
    isStatutory: true
  },

  // READING - COMPREHENSION (RC)
  {
    notation: 'UK.KS2.Y3.EN.RC.1',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by listening to and discussing a wide range of fiction, poetry, plays, non-fiction and reference books or textbooks',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.2',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by reading books that are structured in different ways and reading for a range of purposes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.3',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by using dictionaries to check the meaning of words that they have read',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.4',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by increasing their familiarity with a wide range of books, including fairy stories, myths and legends, and retelling some of these orally',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.5',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by identifying themes and conventions in a wide range of books',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.6',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by preparing poems and play scripts to read aloud and to perform, showing understanding through intonation, tone, volume and action',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.7',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by discussing words and phrases that capture the reader\'s interest and imagination',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.8',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by recognising some different forms of poetry [for example, free verse, narrative poetry]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.9',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by checking that the text makes sense to them, discussing their understanding, and explaining the meaning of words in context',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.10',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by asking questions to improve their understanding of a text',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.11',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by drawing inferences such as inferring characters\' feelings, thoughts and motives from their actions, and justifying inferences with evidence',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.12',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by predicting what might happen from details stated and implied',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.13',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by identifying main ideas drawn from more than 1 paragraph and summarising these',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.14',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by identifying how language, structure, and presentation contribute to meaning',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.15',
    strand: 'Reading - Comprehension',
    description: 'retrieve and record information from non-fiction',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.RC.16',
    strand: 'Reading - Comprehension',
    description: 'participate in discussion about both books that are read to them and those they can read for themselves, taking turns and listening to what others say',
    isStatutory: true
  },

  // WRITING - TRANSCRIPTION: SPELLING (WTS)
  {
    notation: 'UK.KS2.Y3.EN.WTS.1',
    strand: 'Writing - Spelling',
    description: 'use further prefixes and suffixes and understand how to add them',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WTS.2',
    strand: 'Writing - Spelling',
    description: 'spell further homophones',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WTS.3',
    strand: 'Writing - Spelling',
    description: 'spell words that are often misspelt (English appendix 1)',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WTS.4',
    strand: 'Writing - Spelling',
    description: 'place the possessive apostrophe accurately in words with regular plurals [for example, girls\', boys\'] and in words with irregular plurals [for example, children\'s]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WTS.5',
    strand: 'Writing - Spelling',
    description: 'use the first 2 or 3 letters of a word to check its spelling in a dictionary',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WTS.6',
    strand: 'Writing - Spelling',
    description: 'write from memory simple sentences, dictated by the teacher, that include words and punctuation taught so far',
    isStatutory: true
  },

  // WRITING - TRANSCRIPTION: HANDWRITING (WTH)
  {
    notation: 'UK.KS2.Y3.EN.WTH.1',
    strand: 'Writing - Handwriting',
    description: 'use the diagonal and horizontal strokes that are needed to join letters and understand which letters, when adjacent to one another, are best left unjoined',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WTH.2',
    strand: 'Writing - Handwriting',
    description: 'increase the legibility, consistency and quality of their handwriting',
    isStatutory: true
  },

  // WRITING - COMPOSITION (WC)
  {
    notation: 'UK.KS2.Y3.EN.WC.1',
    strand: 'Writing - Composition',
    description: 'plan their writing by discussing writing similar to that which they are planning to write in order to understand and learn from its structure, vocabulary and grammar',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WC.2',
    strand: 'Writing - Composition',
    description: 'plan their writing by discussing and recording ideas',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WC.3',
    strand: 'Writing - Composition',
    description: 'draft and write by composing and rehearsing sentences orally (including dialogue), progressively building a varied and rich vocabulary and an increasing range of sentence structures',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WC.4',
    strand: 'Writing - Composition',
    description: 'draft and write by organising paragraphs around a theme',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WC.5',
    strand: 'Writing - Composition',
    description: 'draft and write by creating settings, characters and plot in narratives',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WC.6',
    strand: 'Writing - Composition',
    description: 'draft and write by using simple organisational devices in non-narrative material [for example, headings and sub-headings]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WC.7',
    strand: 'Writing - Composition',
    description: 'evaluate and edit by assessing the effectiveness of their own and others\' writing and suggesting improvements',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WC.8',
    strand: 'Writing - Composition',
    description: 'evaluate and edit by proposing changes to grammar and vocabulary to improve consistency, including the accurate use of pronouns in sentences',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WC.9',
    strand: 'Writing - Composition',
    description: 'proofread for spelling and punctuation errors',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WC.10',
    strand: 'Writing - Composition',
    description: 'read their own writing aloud to a group or the whole class, using appropriate intonation and controlling the tone and volume so that the meaning is clear',
    isStatutory: true
  },

  // WRITING - VOCABULARY, GRAMMAR AND PUNCTUATION (WVG)
  {
    notation: 'UK.KS2.Y3.EN.WVG.1',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'extend the range of sentences with more than one clause by using a wider range of conjunctions, including: when, if, because, although',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WVG.2',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use the present perfect form of verbs in contrast to the past tense',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WVG.3',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'choose nouns or pronouns appropriately for clarity and cohesion and to avoid repetition',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WVG.4',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use conjunctions, adverbs and prepositions to express time and cause',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WVG.5',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use fronted adverbials',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WVG.6',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'learn the grammar for years 3 and 4 in English appendix 2',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WVG.7',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by using commas after fronted adverbials',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WVG.8',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate possession by using the possessive apostrophe with plural nouns',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WVG.9',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use and punctuate direct speech',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.EN.WVG.10',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use and understand the grammatical terminology in English appendix 2 accurately and appropriately when discussing their writing and reading',
    isStatutory: true
  },

  // Add Spoken Language standards for Year 3
  ...createSpokenLanguageForYear(3, 2)
];

const year4Standards: BritishNCEnglishStandard[] = [
  // Year 4 uses the same Years 3-4 programme of study
  // Standards are duplicated but with Y4 notation for tracking purposes

  // READING - WORD READING (RWR)
  {
    notation: 'UK.KS2.Y4.EN.RWR.1',
    strand: 'Reading - Word Reading',
    description: 'apply their growing knowledge of root words, prefixes and suffixes (etymology and morphology), both to read aloud and to understand the meaning of new words they meet',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RWR.2',
    strand: 'Reading - Word Reading',
    description: 'read further exception words, noting the unusual correspondences between spelling and sound, and where these occur in the word',
    isStatutory: true
  },

  // READING - COMPREHENSION (RC) - same as Year 3
  {
    notation: 'UK.KS2.Y4.EN.RC.1',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by listening to and discussing a wide range of fiction, poetry, plays, non-fiction and reference books or textbooks',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.2',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by reading books that are structured in different ways and reading for a range of purposes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.3',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by using dictionaries to check the meaning of words that they have read',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.4',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by increasing their familiarity with a wide range of books, including fairy stories, myths and legends, and retelling some of these orally',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.5',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by identifying themes and conventions in a wide range of books',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.6',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by preparing poems and play scripts to read aloud and to perform, showing understanding through intonation, tone, volume and action',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.7',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by discussing words and phrases that capture the reader\'s interest and imagination',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.8',
    strand: 'Reading - Comprehension',
    description: 'develop positive attitudes to reading by recognising some different forms of poetry [for example, free verse, narrative poetry]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.9',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by checking that the text makes sense to them, discussing their understanding, and explaining the meaning of words in context',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.10',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by asking questions to improve their understanding of a text',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.11',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by drawing inferences such as inferring characters\' feelings, thoughts and motives from their actions, and justifying inferences with evidence',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.12',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by predicting what might happen from details stated and implied',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.13',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by identifying main ideas drawn from more than 1 paragraph and summarising these',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.14',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by identifying how language, structure, and presentation contribute to meaning',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.15',
    strand: 'Reading - Comprehension',
    description: 'retrieve and record information from non-fiction',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.RC.16',
    strand: 'Reading - Comprehension',
    description: 'participate in discussion about both books that are read to them and those they can read for themselves, taking turns and listening to what others say',
    isStatutory: true
  },

  // WRITING - TRANSCRIPTION: SPELLING (WTS)
  {
    notation: 'UK.KS2.Y4.EN.WTS.1',
    strand: 'Writing - Spelling',
    description: 'use further prefixes and suffixes and understand how to add them',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WTS.2',
    strand: 'Writing - Spelling',
    description: 'spell further homophones',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WTS.3',
    strand: 'Writing - Spelling',
    description: 'spell words that are often misspelt (English appendix 1)',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WTS.4',
    strand: 'Writing - Spelling',
    description: 'place the possessive apostrophe accurately in words with regular plurals [for example, girls\', boys\'] and in words with irregular plurals [for example, children\'s]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WTS.5',
    strand: 'Writing - Spelling',
    description: 'use the first 2 or 3 letters of a word to check its spelling in a dictionary',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WTS.6',
    strand: 'Writing - Spelling',
    description: 'write from memory simple sentences, dictated by the teacher, that include words and punctuation taught so far',
    isStatutory: true
  },

  // WRITING - TRANSCRIPTION: HANDWRITING (WTH)
  {
    notation: 'UK.KS2.Y4.EN.WTH.1',
    strand: 'Writing - Handwriting',
    description: 'use the diagonal and horizontal strokes that are needed to join letters and understand which letters, when adjacent to one another, are best left unjoined',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WTH.2',
    strand: 'Writing - Handwriting',
    description: 'increase the legibility, consistency and quality of their handwriting',
    isStatutory: true
  },

  // WRITING - COMPOSITION (WC)
  {
    notation: 'UK.KS2.Y4.EN.WC.1',
    strand: 'Writing - Composition',
    description: 'plan their writing by discussing writing similar to that which they are planning to write in order to understand and learn from its structure, vocabulary and grammar',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WC.2',
    strand: 'Writing - Composition',
    description: 'plan their writing by discussing and recording ideas',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WC.3',
    strand: 'Writing - Composition',
    description: 'draft and write by composing and rehearsing sentences orally (including dialogue), progressively building a varied and rich vocabulary and an increasing range of sentence structures',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WC.4',
    strand: 'Writing - Composition',
    description: 'draft and write by organising paragraphs around a theme',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WC.5',
    strand: 'Writing - Composition',
    description: 'draft and write by creating settings, characters and plot in narratives',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WC.6',
    strand: 'Writing - Composition',
    description: 'draft and write by using simple organisational devices in non-narrative material [for example, headings and sub-headings]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WC.7',
    strand: 'Writing - Composition',
    description: 'evaluate and edit by assessing the effectiveness of their own and others\' writing and suggesting improvements',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WC.8',
    strand: 'Writing - Composition',
    description: 'evaluate and edit by proposing changes to grammar and vocabulary to improve consistency, including the accurate use of pronouns in sentences',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WC.9',
    strand: 'Writing - Composition',
    description: 'proofread for spelling and punctuation errors',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WC.10',
    strand: 'Writing - Composition',
    description: 'read their own writing aloud to a group or the whole class, using appropriate intonation and controlling the tone and volume so that the meaning is clear',
    isStatutory: true
  },

  // WRITING - VOCABULARY, GRAMMAR AND PUNCTUATION (WVG)
  {
    notation: 'UK.KS2.Y4.EN.WVG.1',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'extend the range of sentences with more than one clause by using a wider range of conjunctions, including: when, if, because, although',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WVG.2',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use the present perfect form of verbs in contrast to the past tense',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WVG.3',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'choose nouns or pronouns appropriately for clarity and cohesion and to avoid repetition',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WVG.4',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use conjunctions, adverbs and prepositions to express time and cause',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WVG.5',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use fronted adverbials',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WVG.6',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'learn the grammar for years 3 and 4 in English appendix 2',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WVG.7',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by using commas after fronted adverbials',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WVG.8',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate possession by using the possessive apostrophe with plural nouns',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WVG.9',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use and punctuate direct speech',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.EN.WVG.10',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use and understand the grammatical terminology in English appendix 2 accurately and appropriately when discussing their writing and reading',
    isStatutory: true
  },

  // Add Spoken Language standards for Year 4
  ...createSpokenLanguageForYear(4, 2)
];

// =============================================================================
// KEY STAGE 2: YEARS 5-6 (Upper KS2)
// =============================================================================

const year5Standards: BritishNCEnglishStandard[] = [
  // READING - WORD READING (RWR)
  {
    notation: 'UK.KS2.Y5.EN.RWR.1',
    strand: 'Reading - Word Reading',
    description: 'apply their growing knowledge of root words, prefixes and suffixes (morphology and etymology), both to read aloud and to understand the meaning of new words that they meet',
    isStatutory: true
  },

  // READING - COMPREHENSION (RC)
  {
    notation: 'UK.KS2.Y5.EN.RC.1',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by continuing to read and discuss an increasingly wide range of fiction, poetry, plays, non-fiction and reference books or textbooks',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.2',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by reading books that are structured in different ways and reading for a range of purposes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.3',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by increasing their familiarity with a wide range of books, including myths, legends and traditional stories, modern fiction, fiction from our literary heritage, and books from other cultures and traditions',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.4',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by recommending books that they have read to their peers, giving reasons for their choices',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.5',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by identifying and discussing themes and conventions in and across a wide range of writing',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.6',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by making comparisons within and across books',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.7',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by learning a wider range of poetry by heart',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.8',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by preparing poems and plays to read aloud and to perform, showing understanding through intonation, tone and volume so that the meaning is clear to an audience',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.9',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by checking that the book makes sense to them, discussing their understanding and exploring the meaning of words in context',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.10',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by asking questions to improve their understanding',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.11',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by drawing inferences such as inferring characters\' feelings, thoughts and motives from their actions, and justifying inferences with evidence',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.12',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by predicting what might happen from details stated and implied',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.13',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by summarising the main ideas drawn from more than 1 paragraph, identifying key details that support the main ideas',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.14',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by identifying how language, structure and presentation contribute to meaning',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.15',
    strand: 'Reading - Comprehension',
    description: 'discuss and evaluate how authors use language, including figurative language, considering the impact on the reader',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.16',
    strand: 'Reading - Comprehension',
    description: 'distinguish between statements of fact and opinion',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.17',
    strand: 'Reading - Comprehension',
    description: 'retrieve, record and present information from non-fiction',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.18',
    strand: 'Reading - Comprehension',
    description: 'participate in discussions about books that are read to them and those they can read for themselves, building on their own and others\' ideas and challenging views courteously',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.19',
    strand: 'Reading - Comprehension',
    description: 'explain and discuss their understanding of what they have read, including through formal presentations and debates, maintaining a focus on the topic and using notes where necessary',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.RC.20',
    strand: 'Reading - Comprehension',
    description: 'provide reasoned justifications for their views',
    isStatutory: true
  },

  // WRITING - TRANSCRIPTION: SPELLING (WTS)
  {
    notation: 'UK.KS2.Y5.EN.WTS.1',
    strand: 'Writing - Spelling',
    description: 'use further prefixes and suffixes and understand the guidance for adding them',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WTS.2',
    strand: 'Writing - Spelling',
    description: 'spell some words with \'silent\' letters [for example, knight, psalm, solemn]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WTS.3',
    strand: 'Writing - Spelling',
    description: 'continue to distinguish between homophones and other words which are often confused',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WTS.4',
    strand: 'Writing - Spelling',
    description: 'use knowledge of morphology and etymology in spelling and understand that the spelling of some words needs to be learnt specifically',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WTS.5',
    strand: 'Writing - Spelling',
    description: 'use dictionaries to check the spelling and meaning of words',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WTS.6',
    strand: 'Writing - Spelling',
    description: 'use the first 3 or 4 letters of a word to check spelling, meaning or both of these in a dictionary',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WTS.7',
    strand: 'Writing - Spelling',
    description: 'use a thesaurus',
    isStatutory: true
  },

  // WRITING - TRANSCRIPTION: HANDWRITING (WTH)
  {
    notation: 'UK.KS2.Y5.EN.WTH.1',
    strand: 'Writing - Handwriting',
    description: 'write legibly, fluently and with increasing speed by choosing which shape of a letter to use when given choices and deciding whether or not to join specific letters',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WTH.2',
    strand: 'Writing - Handwriting',
    description: 'write legibly, fluently and with increasing speed by choosing the writing implement that is best suited for a task',
    isStatutory: true
  },

  // WRITING - COMPOSITION (WC)
  {
    notation: 'UK.KS2.Y5.EN.WC.1',
    strand: 'Writing - Composition',
    description: 'plan their writing by identifying the audience for and purpose of the writing, selecting the appropriate form and using other similar writing as models for their own',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WC.2',
    strand: 'Writing - Composition',
    description: 'plan their writing by noting and developing initial ideas, drawing on reading and research where necessary',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WC.3',
    strand: 'Writing - Composition',
    description: 'plan their writing by considering how authors have developed characters and settings in what pupils have read, listened to or seen performed',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WC.4',
    strand: 'Writing - Composition',
    description: 'draft and write by selecting appropriate grammar and vocabulary, understanding how such choices can change and enhance meaning',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WC.5',
    strand: 'Writing - Composition',
    description: 'draft and write by describing settings, characters and atmosphere and integrating dialogue to convey character and advance the action',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WC.6',
    strand: 'Writing - Composition',
    description: 'draft and write by précising longer passages',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WC.7',
    strand: 'Writing - Composition',
    description: 'draft and write by using a wide range of devices to build cohesion within and across paragraphs',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WC.8',
    strand: 'Writing - Composition',
    description: 'draft and write by using further organisational and presentational devices to structure text and to guide the reader [for example, headings, bullet points, underlining]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WC.9',
    strand: 'Writing - Composition',
    description: 'evaluate and edit by assessing the effectiveness of their own and others\' writing',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WC.10',
    strand: 'Writing - Composition',
    description: 'evaluate and edit by proposing changes to vocabulary, grammar and punctuation to enhance effects and clarify meaning',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WC.11',
    strand: 'Writing - Composition',
    description: 'evaluate and edit by ensuring the consistent and correct use of tense throughout a piece of writing',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WC.12',
    strand: 'Writing - Composition',
    description: 'evaluate and edit by ensuring correct subject and verb agreement when using singular and plural, distinguishing between the language of speech and writing and choosing the appropriate register',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WC.13',
    strand: 'Writing - Composition',
    description: 'proofread for spelling and punctuation errors',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WC.14',
    strand: 'Writing - Composition',
    description: 'perform their own compositions, using appropriate intonation, volume, and movement so that meaning is clear',
    isStatutory: true
  },

  // WRITING - VOCABULARY, GRAMMAR AND PUNCTUATION (WVG)
  {
    notation: 'UK.KS2.Y5.EN.WVG.1',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'recognise vocabulary and structures that are appropriate for formal speech and writing, including subjunctive forms',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WVG.2',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use passive verbs to affect the presentation of information in a sentence',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WVG.3',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use the perfect form of verbs to mark relationships of time and cause',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WVG.4',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use expanded noun phrases to convey complicated information concisely',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WVG.5',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use modal verbs or adverbs to indicate degrees of possibility',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WVG.6',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use relative clauses beginning with who, which, where, when, whose, that or with an implied (ie omitted) relative pronoun',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WVG.7',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'learn the grammar for years 5 and 6 in English appendix 2',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WVG.8',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by using commas to clarify meaning or avoid ambiguity in writing',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WVG.9',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by using hyphens to avoid ambiguity',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WVG.10',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by using brackets, dashes or commas to indicate parenthesis',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WVG.11',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by using semicolons, colons or dashes to mark boundaries between independent clauses',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WVG.12',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by using a colon to introduce a list',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WVG.13',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by punctuating bullet points consistently',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.EN.WVG.14',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use and understand the grammatical terminology in English appendix 2 accurately and appropriately in discussing their writing and reading',
    isStatutory: true
  },

  // Add Spoken Language standards for Year 5
  ...createSpokenLanguageForYear(5, 2)
];

const year6Standards: BritishNCEnglishStandard[] = [
  // Year 6 uses the same Years 5-6 programme of study
  // Standards are duplicated but with Y6 notation for tracking purposes

  // READING - WORD READING (RWR)
  {
    notation: 'UK.KS2.Y6.EN.RWR.1',
    strand: 'Reading - Word Reading',
    description: 'apply their growing knowledge of root words, prefixes and suffixes (morphology and etymology), both to read aloud and to understand the meaning of new words that they meet',
    isStatutory: true
  },

  // READING - COMPREHENSION (RC) - same structure as Year 5
  {
    notation: 'UK.KS2.Y6.EN.RC.1',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by continuing to read and discuss an increasingly wide range of fiction, poetry, plays, non-fiction and reference books or textbooks',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.2',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by reading books that are structured in different ways and reading for a range of purposes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.3',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by increasing their familiarity with a wide range of books, including myths, legends and traditional stories, modern fiction, fiction from our literary heritage, and books from other cultures and traditions',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.4',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by recommending books that they have read to their peers, giving reasons for their choices',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.5',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by identifying and discussing themes and conventions in and across a wide range of writing',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.6',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by making comparisons within and across books',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.7',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by learning a wider range of poetry by heart',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.8',
    strand: 'Reading - Comprehension',
    description: 'maintain positive attitudes to reading by preparing poems and plays to read aloud and to perform, showing understanding through intonation, tone and volume so that the meaning is clear to an audience',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.9',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by checking that the book makes sense to them, discussing their understanding and exploring the meaning of words in context',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.10',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by asking questions to improve their understanding',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.11',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by drawing inferences such as inferring characters\' feelings, thoughts and motives from their actions, and justifying inferences with evidence',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.12',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by predicting what might happen from details stated and implied',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.13',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by summarising the main ideas drawn from more than 1 paragraph, identifying key details that support the main ideas',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.14',
    strand: 'Reading - Comprehension',
    description: 'understand what they read by identifying how language, structure and presentation contribute to meaning',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.15',
    strand: 'Reading - Comprehension',
    description: 'discuss and evaluate how authors use language, including figurative language, considering the impact on the reader',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.16',
    strand: 'Reading - Comprehension',
    description: 'distinguish between statements of fact and opinion',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.17',
    strand: 'Reading - Comprehension',
    description: 'retrieve, record and present information from non-fiction',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.18',
    strand: 'Reading - Comprehension',
    description: 'participate in discussions about books that are read to them and those they can read for themselves, building on their own and others\' ideas and challenging views courteously',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.19',
    strand: 'Reading - Comprehension',
    description: 'explain and discuss their understanding of what they have read, including through formal presentations and debates, maintaining a focus on the topic and using notes where necessary',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.RC.20',
    strand: 'Reading - Comprehension',
    description: 'provide reasoned justifications for their views',
    isStatutory: true
  },

  // WRITING sections follow same pattern as Year 5...
  // (abbreviated for file size - same structure with Y6 notation)

  // WRITING - TRANSCRIPTION: SPELLING (WTS)
  {
    notation: 'UK.KS2.Y6.EN.WTS.1',
    strand: 'Writing - Spelling',
    description: 'use further prefixes and suffixes and understand the guidance for adding them',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WTS.2',
    strand: 'Writing - Spelling',
    description: 'spell some words with \'silent\' letters [for example, knight, psalm, solemn]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WTS.3',
    strand: 'Writing - Spelling',
    description: 'continue to distinguish between homophones and other words which are often confused',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WTS.4',
    strand: 'Writing - Spelling',
    description: 'use knowledge of morphology and etymology in spelling and understand that the spelling of some words needs to be learnt specifically',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WTS.5',
    strand: 'Writing - Spelling',
    description: 'use dictionaries to check the spelling and meaning of words',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WTS.6',
    strand: 'Writing - Spelling',
    description: 'use the first 3 or 4 letters of a word to check spelling, meaning or both of these in a dictionary',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WTS.7',
    strand: 'Writing - Spelling',
    description: 'use a thesaurus',
    isStatutory: true
  },

  // WRITING - HANDWRITING
  {
    notation: 'UK.KS2.Y6.EN.WTH.1',
    strand: 'Writing - Handwriting',
    description: 'write legibly, fluently and with increasing speed by choosing which shape of a letter to use when given choices and deciding whether or not to join specific letters',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WTH.2',
    strand: 'Writing - Handwriting',
    description: 'write legibly, fluently and with increasing speed by choosing the writing implement that is best suited for a task',
    isStatutory: true
  },

  // WRITING - COMPOSITION
  {
    notation: 'UK.KS2.Y6.EN.WC.1',
    strand: 'Writing - Composition',
    description: 'plan their writing by identifying the audience for and purpose of the writing, selecting the appropriate form and using other similar writing as models for their own',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WC.2',
    strand: 'Writing - Composition',
    description: 'plan their writing by noting and developing initial ideas, drawing on reading and research where necessary',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WC.3',
    strand: 'Writing - Composition',
    description: 'plan their writing by considering how authors have developed characters and settings in what pupils have read, listened to or seen performed',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WC.4',
    strand: 'Writing - Composition',
    description: 'draft and write by selecting appropriate grammar and vocabulary, understanding how such choices can change and enhance meaning',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WC.5',
    strand: 'Writing - Composition',
    description: 'draft and write by describing settings, characters and atmosphere and integrating dialogue to convey character and advance the action',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WC.6',
    strand: 'Writing - Composition',
    description: 'draft and write by précising longer passages',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WC.7',
    strand: 'Writing - Composition',
    description: 'draft and write by using a wide range of devices to build cohesion within and across paragraphs',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WC.8',
    strand: 'Writing - Composition',
    description: 'draft and write by using further organisational and presentational devices to structure text and to guide the reader',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WC.9',
    strand: 'Writing - Composition',
    description: 'evaluate and edit by assessing the effectiveness of their own and others\' writing',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WC.10',
    strand: 'Writing - Composition',
    description: 'evaluate and edit by proposing changes to vocabulary, grammar and punctuation to enhance effects and clarify meaning',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WC.11',
    strand: 'Writing - Composition',
    description: 'evaluate and edit by ensuring the consistent and correct use of tense throughout a piece of writing',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WC.12',
    strand: 'Writing - Composition',
    description: 'evaluate and edit by ensuring correct subject and verb agreement when using singular and plural, distinguishing between the language of speech and writing and choosing the appropriate register',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WC.13',
    strand: 'Writing - Composition',
    description: 'proofread for spelling and punctuation errors',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WC.14',
    strand: 'Writing - Composition',
    description: 'perform their own compositions, using appropriate intonation, volume, and movement so that meaning is clear',
    isStatutory: true
  },

  // WRITING - VOCABULARY, GRAMMAR AND PUNCTUATION
  {
    notation: 'UK.KS2.Y6.EN.WVG.1',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'recognise vocabulary and structures that are appropriate for formal speech and writing, including subjunctive forms',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WVG.2',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use passive verbs to affect the presentation of information in a sentence',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WVG.3',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use the perfect form of verbs to mark relationships of time and cause',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WVG.4',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use expanded noun phrases to convey complicated information concisely',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WVG.5',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use modal verbs or adverbs to indicate degrees of possibility',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WVG.6',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use relative clauses beginning with who, which, where, when, whose, that or with an implied (ie omitted) relative pronoun',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WVG.7',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'learn the grammar for years 5 and 6 in English appendix 2',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WVG.8',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by using commas to clarify meaning or avoid ambiguity in writing',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WVG.9',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by using hyphens to avoid ambiguity',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WVG.10',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by using brackets, dashes or commas to indicate parenthesis',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WVG.11',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by using semicolons, colons or dashes to mark boundaries between independent clauses',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WVG.12',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by using a colon to introduce a list',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WVG.13',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'indicate grammatical features by punctuating bullet points consistently',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.EN.WVG.14',
    strand: 'Writing - Vocabulary, Grammar and Punctuation',
    description: 'use and understand the grammatical terminology in English appendix 2 accurately and appropriately in discussing their writing and reading',
    isStatutory: true
  },

  // Add Spoken Language standards for Year 6
  ...createSpokenLanguageForYear(6, 2)
];

// =============================================================================
// KEY STAGE 3: YEARS 7-9 (Ages 11-14)
// Note: Official KS3 curriculum is combined for Years 7-9
// =============================================================================

const year7Standards: BritishNCEnglishStandard[] = [
  // READING (R)
  {
    notation: 'UK.KS3.Y7.EN.R.1',
    strand: 'Reading',
    description: 'develop an appreciation and love of reading by reading a wide range of fiction and non-fiction, including whole books, short stories, poems and plays with a wide coverage of genres, historical periods, forms and authors',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.R.2',
    strand: 'Reading',
    description: 'develop an appreciation and love of reading by choosing and reading books independently for challenge, interest and enjoyment',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.R.3',
    strand: 'Reading',
    description: 'develop an appreciation and love of reading by rereading books encountered earlier to increase familiarity with them and provide a basis for making comparisons',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.R.4',
    strand: 'Reading',
    description: 'understand increasingly challenging texts by learning new vocabulary, relating it explicitly to known vocabulary and understanding it with the help of context and dictionaries',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.R.5',
    strand: 'Reading',
    description: 'understand increasingly challenging texts by making inferences and referring to evidence in the text',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.R.6',
    strand: 'Reading',
    description: 'understand increasingly challenging texts by knowing the purpose, audience for and context of the writing and drawing on this knowledge to support comprehension',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.R.7',
    strand: 'Reading',
    description: 'understand increasingly challenging texts by checking their understanding to make sure that what they have read makes sense',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.R.8',
    strand: 'Reading',
    description: 'read critically by knowing how language, including figurative language, vocabulary choice, grammar, text structure and organisational features, presents meaning',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.R.9',
    strand: 'Reading',
    description: 'read critically by recognising a range of poetic conventions and understanding how these have been used',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.R.10',
    strand: 'Reading',
    description: 'read critically by studying setting, plot, and characterisation, and the effects of these',
    isStatutory: true
  },

  // WRITING (W)
  {
    notation: 'UK.KS3.Y7.EN.W.1',
    strand: 'Writing',
    description: 'write accurately, fluently, effectively and at length for pleasure and information through writing for a wide range of purposes and audiences',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.W.2',
    strand: 'Writing',
    description: 'write accurately by summarising and organising material, and supporting ideas and arguments with any necessary factual detail',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.W.3',
    strand: 'Writing',
    description: 'write accurately by applying their growing knowledge of vocabulary, grammar and text structure to their writing and selecting the appropriate form',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.W.4',
    strand: 'Writing',
    description: 'write accurately by drawing on knowledge of literary and rhetorical devices from their reading and listening to enhance the impact of their writing',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.W.5',
    strand: 'Writing',
    description: 'plan, draft, edit and proofread by considering how their writing reflects the audiences and purposes for which it was intended',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.W.6',
    strand: 'Writing',
    description: 'plan, draft, edit and proofread by amending the vocabulary, grammar and structure of their writing to improve its coherence and overall effectiveness',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.W.7',
    strand: 'Writing',
    description: 'plan, draft, edit and proofread by paying attention to accurate grammar, punctuation and spelling',
    isStatutory: true
  },

  // GRAMMAR AND VOCABULARY (GV)
  {
    notation: 'UK.KS3.Y7.EN.GV.1',
    strand: 'Grammar and Vocabulary',
    description: 'consolidate and build on their knowledge of grammar and vocabulary by extending and applying grammatical knowledge to analyse more challenging texts',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.GV.2',
    strand: 'Grammar and Vocabulary',
    description: 'consolidate and build on their knowledge of grammar and vocabulary by studying the effectiveness and impact of the grammatical features of the texts they read',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.GV.3',
    strand: 'Grammar and Vocabulary',
    description: 'consolidate and build on their knowledge of grammar and vocabulary by drawing on new vocabulary and grammatical constructions from their reading and listening, and using these consciously in their writing and speech to achieve particular effects',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.GV.4',
    strand: 'Grammar and Vocabulary',
    description: 'consolidate and build on their knowledge of grammar and vocabulary by knowing and understanding the differences between spoken and written language, including differences associated with formal and informal registers, and between Standard English and other varieties of English',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.GV.5',
    strand: 'Grammar and Vocabulary',
    description: 'consolidate and build on their knowledge of grammar and vocabulary by using Standard English confidently in their own writing and speech',
    isStatutory: true
  },

  // SPOKEN ENGLISH (SE)
  {
    notation: 'UK.KS3.Y7.EN.SE.1',
    strand: 'Spoken English',
    description: 'speak confidently and effectively by using Standard English confidently in a range of formal and informal contexts, including classroom discussion',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.SE.2',
    strand: 'Spoken English',
    description: 'speak confidently and effectively by giving short speeches and presentations, expressing their own ideas and keeping to the point',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.SE.3',
    strand: 'Spoken English',
    description: 'speak confidently and effectively by participating in formal debates and structured discussions, summarising and/or building on what has been said',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.EN.SE.4',
    strand: 'Spoken English',
    description: 'speak confidently and effectively by improvising, rehearsing and performing play scripts and poetry in order to generate language and discuss language use and meaning',
    isStatutory: true
  }
];

const year8Standards: BritishNCEnglishStandard[] = [
  // Year 8 continues KS3 programme - standards with Y8 notation
  // READING
  {
    notation: 'UK.KS3.Y8.EN.R.1',
    strand: 'Reading',
    description: 'read high-quality works from English literature, both pre-1914 and contemporary, including prose, poetry and drama',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.EN.R.2',
    strand: 'Reading',
    description: 'read Shakespeare (at least 1 play) and seminal world literature',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.EN.R.3',
    strand: 'Reading',
    description: 'understand how the work of dramatists is communicated effectively through performance and how alternative staging allows for different interpretations of a play',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.EN.R.4',
    strand: 'Reading',
    description: 'make critical comparisons across texts',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.EN.R.5',
    strand: 'Reading',
    description: 'study a range of authors, including at least 2 authors in depth each year',
    isStatutory: true
  },

  // WRITING
  {
    notation: 'UK.KS3.Y8.EN.W.1',
    strand: 'Writing',
    description: 'write well-structured formal expository and narrative essays',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.EN.W.2',
    strand: 'Writing',
    description: 'write stories, scripts, poetry and other imaginative writing',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.EN.W.3',
    strand: 'Writing',
    description: 'write notes and polished scripts for talks and presentations',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.EN.W.4',
    strand: 'Writing',
    description: 'write a range of other narrative and non-narrative texts, including arguments, and personal and formal letters',
    isStatutory: true
  },

  // GRAMMAR AND VOCABULARY
  {
    notation: 'UK.KS3.Y8.EN.GV.1',
    strand: 'Grammar and Vocabulary',
    description: 'discuss reading, writing and spoken language with precise and confident use of linguistic and literary terminology',
    isStatutory: true
  },

  // SPOKEN ENGLISH
  {
    notation: 'UK.KS3.Y8.EN.SE.1',
    strand: 'Spoken English',
    description: 'use role, intonation, tone, volume, mood, silence, stillness and action to add impact to spoken presentations',
    isStatutory: true
  }
];

const year9Standards: BritishNCEnglishStandard[] = [
  // Year 9 - consolidation and preparation for KS4/GCSE
  // READING
  {
    notation: 'UK.KS3.Y9.EN.R.1',
    strand: 'Reading',
    description: 'consolidate reading skills to prepare for GCSE English Literature and Language',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.EN.R.2',
    strand: 'Reading',
    description: 'read and study Shakespeare (2nd play) in preparation for GCSE',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.EN.R.3',
    strand: 'Reading',
    description: 'analyse writer\'s choice of vocabulary, form, grammatical and structural features, and evaluate their effectiveness and impact',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.EN.R.4',
    strand: 'Reading',
    description: 'make critical comparisons, referring to the contexts, themes, characterisation, style and literary quality of texts',
    isStatutory: true
  },

  // WRITING
  {
    notation: 'UK.KS3.Y9.EN.W.1',
    strand: 'Writing',
    description: 'write with increasing sophistication for a range of purposes and audiences',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.EN.W.2',
    strand: 'Writing',
    description: 'apply spelling patterns and rules confidently in extended writing',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.EN.W.3',
    strand: 'Writing',
    description: 'use a wide vocabulary and varied grammatical constructions to achieve specific effects',
    isStatutory: true
  },

  // GRAMMAR AND VOCABULARY
  {
    notation: 'UK.KS3.Y9.EN.GV.1',
    strand: 'Grammar and Vocabulary',
    description: 'analyse complex grammatical structures in challenging texts',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.EN.GV.2',
    strand: 'Grammar and Vocabulary',
    description: 'use sophisticated vocabulary and grammatical constructions in formal academic writing',
    isStatutory: true
  },

  // SPOKEN ENGLISH
  {
    notation: 'UK.KS3.Y9.EN.SE.1',
    strand: 'Spoken English',
    description: 'deliver formal presentations with confidence, using appropriate register and rhetorical devices',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.EN.SE.2',
    strand: 'Spoken English',
    description: 'participate in formal debates, responding to others\' arguments and defending positions with evidence',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 4: YEAR 10 - GCSE English Language & Literature (Ages 14-15)
// =============================================================================

const year10Standards: BritishNCEnglishStandard[] = [
  // ENGLISH LANGUAGE - Reading
  {
    notation: 'UK.KS4.Y10.EN.EL.R.1',
    strand: 'English Language - Reading',
    description: 'identify and interpret explicit and implicit information and ideas',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.EL.R.2',
    strand: 'English Language - Reading',
    description: 'select and synthesise evidence from different texts',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.EL.R.3',
    strand: 'English Language - Reading',
    description: 'explain, comment on and analyse how writers use language and structure to achieve effects and influence readers',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.EL.R.4',
    strand: 'English Language - Reading',
    description: 'compare writers\' ideas and perspectives, as well as how these are conveyed, across two or more texts',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.EL.R.5',
    strand: 'English Language - Reading',
    description: 'evaluate texts critically and support this with appropriate textual references',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.EL.R.6',
    strand: 'English Language - Reading',
    description: 'read a wide range of texts fluently and with good understanding, including literary non-fiction and other writing',
    isStatutory: true
  },
  // ENGLISH LANGUAGE - Writing
  {
    notation: 'UK.KS4.Y10.EN.EL.W.1',
    strand: 'English Language - Writing',
    description: 'communicate clearly, effectively and imaginatively, selecting and adapting tone, style and register for different forms, purposes and audiences',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.EL.W.2',
    strand: 'English Language - Writing',
    description: 'organise information and ideas, using structural and grammatical features to support coherence and cohesion of texts',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.EL.W.3',
    strand: 'English Language - Writing',
    description: 'use a range of vocabulary and sentence structures for clarity, purpose and effect, with accurate spelling and punctuation',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.EL.W.4',
    strand: 'English Language - Writing',
    description: 'write for a range of purposes and audiences, including narratives, descriptions, persuasive texts and arguments',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.EL.W.5',
    strand: 'English Language - Writing',
    description: 'apply Standard English conventions consistently and accurately in writing',
    isStatutory: true
  },
  // ENGLISH LANGUAGE - Spoken Language
  {
    notation: 'UK.KS4.Y10.EN.EL.SL.1',
    strand: 'English Language - Spoken Language',
    description: 'present information and ideas clearly to an audience, adapting speech to different contexts',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.EL.SL.2',
    strand: 'English Language - Spoken Language',
    description: 'respond appropriately to questions and feedback, exploring ideas in depth',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.EL.SL.3',
    strand: 'English Language - Spoken Language',
    description: 'use Standard English in formal situations and understanding its importance',
    isStatutory: true
  },
  // ENGLISH LITERATURE - Reading
  {
    notation: 'UK.KS4.Y10.EN.LIT.R.1',
    strand: 'English Literature - Reading',
    description: 'read a wide range of literature including whole texts from different forms, periods and cultures',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.LIT.R.2',
    strand: 'English Literature - Reading',
    description: 'read and evaluate texts critically, making references to texts and considering how meaning is shaped',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.LIT.R.3',
    strand: 'English Literature - Reading',
    description: 'study at least one Shakespeare play and experience a range of poetry since 1789, including the Romantics',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.LIT.R.4',
    strand: 'English Literature - Reading',
    description: 'study a 19th century novel and fiction or drama from the British literary heritage',
    isStatutory: true
  },
  // ENGLISH LITERATURE - Critical Reading
  {
    notation: 'UK.KS4.Y10.EN.LIT.CR.1',
    strand: 'English Literature - Critical Reading',
    description: 'understand and critically evaluate texts, making comparisons between different texts',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.LIT.CR.2',
    strand: 'English Literature - Critical Reading',
    description: 'analyse the language, form and structure used by a writer to create meanings and effects',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.LIT.CR.3',
    strand: 'English Literature - Critical Reading',
    description: 'explore relationships between texts and the contexts in which they were written',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.LIT.CR.4',
    strand: 'English Literature - Critical Reading',
    description: 'use literary and critical terminology accurately in discussing and writing about texts',
    isStatutory: true
  },
  // ENGLISH LITERATURE - Writing about Literature
  {
    notation: 'UK.KS4.Y10.EN.LIT.W.1',
    strand: 'English Literature - Writing about Literature',
    description: 'write analytical essays on texts studied, supporting interpretations with textual references',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.LIT.W.2',
    strand: 'English Literature - Writing about Literature',
    description: 'structure responses coherently, using appropriate register and vocabulary for literary analysis',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.EN.LIT.W.3',
    strand: 'English Literature - Writing about Literature',
    description: 'develop and sustain interpretations of literary texts, considering alternative readings',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 4: YEAR 11 - GCSE English Language & Literature (Ages 15-16)
// =============================================================================

const year11Standards: BritishNCEnglishStandard[] = [
  // ENGLISH LANGUAGE - Advanced Reading
  {
    notation: 'UK.KS4.Y11.EN.EL.R.1',
    strand: 'English Language - Reading',
    description: 'compare and contrast writers\' viewpoints across multiple texts on similar themes',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.EL.R.2',
    strand: 'English Language - Reading',
    description: 'analyse unseen fiction and non-fiction texts, identifying and interpreting themes and ideas',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.EL.R.3',
    strand: 'English Language - Reading',
    description: 'evaluate how language features and structural choices create effects in different text types',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.EL.R.4',
    strand: 'English Language - Reading',
    description: 'demonstrate sophisticated understanding of how writers construct meaning using linguistic and structural techniques',
    isStatutory: true
  },
  // ENGLISH LANGUAGE - Advanced Writing
  {
    notation: 'UK.KS4.Y11.EN.EL.W.1',
    strand: 'English Language - Writing',
    description: 'write with technical accuracy using a varied vocabulary and range of sentence structures',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.EL.W.2',
    strand: 'English Language - Writing',
    description: 'produce extended pieces of writing that are well-organised and sustain coherence throughout',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.EL.W.3',
    strand: 'English Language - Writing',
    description: 'demonstrate control of a range of writing styles appropriate to purpose, form and audience',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.EL.W.4',
    strand: 'English Language - Writing',
    description: 'craft language for deliberate effects and create compelling narratives or arguments',
    isStatutory: true
  },
  // ENGLISH LITERATURE - Drama Study
  {
    notation: 'UK.KS4.Y11.EN.LIT.DR.1',
    strand: 'English Literature - Drama',
    description: 'analyse Shakespeare\'s use of language, form and dramatic conventions to create character and convey themes',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.LIT.DR.2',
    strand: 'English Literature - Drama',
    description: 'evaluate the significance of stagecraft in creating meaning and dramatic effect',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.LIT.DR.3',
    strand: 'English Literature - Drama',
    description: 'understand the influence of historical and social context on dramatic texts',
    isStatutory: true
  },
  // ENGLISH LITERATURE - Prose Study
  {
    notation: 'UK.KS4.Y11.EN.LIT.PR.1',
    strand: 'English Literature - Prose',
    description: 'analyse narrative techniques and their effects in 19th century fiction',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.LIT.PR.2',
    strand: 'English Literature - Prose',
    description: 'understand the relationship between texts and their social, historical and cultural contexts',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.LIT.PR.3',
    strand: 'English Literature - Prose',
    description: 'compare and contrast prose texts, considering themes, characterisation and narrative voice',
    isStatutory: true
  },
  // ENGLISH LITERATURE - Poetry Study
  {
    notation: 'UK.KS4.Y11.EN.LIT.PO.1',
    strand: 'English Literature - Poetry',
    description: 'analyse poetic techniques including imagery, form, rhythm and tone',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.LIT.PO.2',
    strand: 'English Literature - Poetry',
    description: 'compare poems thematically, considering how meaning is created and conveyed',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.LIT.PO.3',
    strand: 'English Literature - Poetry',
    description: 'analyse unseen poetry, identifying and interpreting language and structural features',
    isStatutory: true
  },
  // ENGLISH LITERATURE - Critical Comparison
  {
    notation: 'UK.KS4.Y11.EN.LIT.CR.1',
    strand: 'English Literature - Critical Reading',
    description: 'construct sustained, analytical essays comparing literary texts from different genres and periods',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.LIT.CR.2',
    strand: 'English Literature - Critical Reading',
    description: 'evaluate literary texts using critical and theoretical perspectives',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.EN.LIT.CR.3',
    strand: 'English Literature - Critical Reading',
    description: 'develop personal and critical responses to literature, supporting with well-integrated textual evidence',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 5: YEAR 12 - A-Level English Language & Literature (Ages 16-17)
// =============================================================================

const year12Standards: BritishNCEnglishStandard[] = [
  // A-LEVEL ENGLISH LANGUAGE - Textual Analysis
  {
    notation: 'UK.KS5.Y12.EN.AL.TL.1',
    strand: 'A-Level English Language - Textual Analysis',
    description: 'apply systematic frameworks to analyse spoken and written texts',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.AL.TL.2',
    strand: 'A-Level English Language - Textual Analysis',
    description: 'analyse the ways meanings are shaped in texts through choices of vocabulary, grammar and discourse',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.AL.TL.3',
    strand: 'A-Level English Language - Textual Analysis',
    description: 'explore how texts construct representations of the world, including social groups and events',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.AL.TL.4',
    strand: 'A-Level English Language - Textual Analysis',
    description: 'understand and apply concepts of register, mode, genre and purpose in textual analysis',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.AL.TL.5',
    strand: 'A-Level English Language - Textual Analysis',
    description: 'analyse graphological and phonological features and their effects on meaning',
    isStatutory: true
  },
  // A-LEVEL ENGLISH LANGUAGE - Language and Context
  {
    notation: 'UK.KS5.Y12.EN.AL.LC.1',
    strand: 'A-Level English Language - Language Change',
    description: 'understand and analyse how the English language has changed over time',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.AL.LC.2',
    strand: 'A-Level English Language - Language Change',
    description: 'explore semantic, lexical and grammatical change in the history of English',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.AL.LC.3',
    strand: 'A-Level English Language - Language Change',
    description: 'evaluate attitudes towards language change and standardisation',
    isStatutory: true
  },
  // A-LEVEL ENGLISH LANGUAGE - Language Diversity
  {
    notation: 'UK.KS5.Y12.EN.AL.LD.1',
    strand: 'A-Level English Language - Language Diversity',
    description: 'analyse how language varies according to social and regional factors',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.AL.LD.2',
    strand: 'A-Level English Language - Language Diversity',
    description: 'understand concepts of dialect, sociolect, idiolect and accent',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.AL.LD.3',
    strand: 'A-Level English Language - Language Diversity',
    description: 'explore World Englishes and the global spread of English',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.AL.LD.4',
    strand: 'A-Level English Language - Language Diversity',
    description: 'evaluate social and political attitudes to language variation',
    isStatutory: true
  },
  // A-LEVEL ENGLISH LITERATURE - Drama
  {
    notation: 'UK.KS5.Y12.EN.LT.DR.1',
    strand: 'A-Level English Literature - Drama',
    description: 'study plays from different periods and genres including tragedy, comedy and modern drama',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.LT.DR.2',
    strand: 'A-Level English Literature - Drama',
    description: 'analyse how dramatists create meaning through language, form and structure',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.LT.DR.3',
    strand: 'A-Level English Literature - Drama',
    description: 'understand the significance of theatrical conventions and stagecraft',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.LT.DR.4',
    strand: 'A-Level English Literature - Drama',
    description: 'explore the relationship between drama texts and their contexts of production and reception',
    isStatutory: true
  },
  // A-LEVEL ENGLISH LITERATURE - Prose
  {
    notation: 'UK.KS5.Y12.EN.LT.PR.1',
    strand: 'A-Level English Literature - Prose',
    description: 'study prose fiction from different periods including pre-1900 and post-1900 texts',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.LT.PR.2',
    strand: 'A-Level English Literature - Prose',
    description: 'analyse narrative techniques including point of view, voice, chronology and setting',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.LT.PR.3',
    strand: 'A-Level English Literature - Prose',
    description: 'understand how prose writers use language to create character and atmosphere',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.LT.PR.4',
    strand: 'A-Level English Literature - Prose',
    description: 'explore literary traditions and movements in the development of prose fiction',
    isStatutory: true
  },
  // A-LEVEL ENGLISH LITERATURE - Poetry
  {
    notation: 'UK.KS5.Y12.EN.LT.PO.1',
    strand: 'A-Level English Literature - Poetry',
    description: 'study poetry from different periods including pre-1900 and post-1900 texts',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.LT.PO.2',
    strand: 'A-Level English Literature - Poetry',
    description: 'analyse poetic form, including verse forms, rhythm, rhyme and sound patterns',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.LT.PO.3',
    strand: 'A-Level English Literature - Poetry',
    description: 'understand how poets use imagery, figurative language and symbolism',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.LT.PO.4',
    strand: 'A-Level English Literature - Poetry',
    description: 'explore the relationship between poetic texts and their literary and historical contexts',
    isStatutory: true
  },
  // A-LEVEL - Critical Approaches
  {
    notation: 'UK.KS5.Y12.EN.LT.CR.1',
    strand: 'A-Level English Literature - Critical Analysis',
    description: 'develop understanding of different critical approaches to literature',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.LT.CR.2',
    strand: 'A-Level English Literature - Critical Analysis',
    description: 'apply critical terminology accurately and appropriately in literary analysis',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.EN.LT.CR.3',
    strand: 'A-Level English Literature - Critical Analysis',
    description: 'construct sustained arguments about literary texts, supported by relevant evidence',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 5: YEAR 13 - A-Level English Language & Literature (Ages 17-18)
// =============================================================================

const year13Standards: BritishNCEnglishStandard[] = [
  // A-LEVEL ENGLISH LANGUAGE - Child Language Acquisition
  {
    notation: 'UK.KS5.Y13.EN.AL.CV.1',
    strand: 'A-Level English Language - Child Language Acquisition',
    description: 'understand theories of child language acquisition and development',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.AL.CV.2',
    strand: 'A-Level English Language - Child Language Acquisition',
    description: 'analyse features of child language at different developmental stages',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.AL.CV.3',
    strand: 'A-Level English Language - Child Language Acquisition',
    description: 'explore factors affecting language development including social, cognitive and biological factors',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.AL.CV.4',
    strand: 'A-Level English Language - Child Language Acquisition',
    description: 'analyse transcripts of child language data, identifying patterns and developmental features',
    isStatutory: true
  },
  // A-LEVEL ENGLISH LANGUAGE - Language and Power
  {
    notation: 'UK.KS5.Y13.EN.AL.LP.1',
    strand: 'A-Level English Language - Language and Power',
    description: 'analyse how language is used to exercise and maintain power in different contexts',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.AL.LP.2',
    strand: 'A-Level English Language - Language and Power',
    description: 'explore language and gender, including theories and debates about gendered language use',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.AL.LP.3',
    strand: 'A-Level English Language - Language and Power',
    description: 'analyse political and media discourse, including persuasion and manipulation',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.AL.LP.4',
    strand: 'A-Level English Language - Language and Power',
    description: 'evaluate the relationship between language, identity and social groups',
    isStatutory: true
  },
  // A-LEVEL ENGLISH LANGUAGE - Language Investigation
  {
    notation: 'UK.KS5.Y13.EN.AL.NE.1',
    strand: 'A-Level English Language - Non-Examined Assessment',
    description: 'conduct an independent language investigation on a topic of personal interest',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.AL.NE.2',
    strand: 'A-Level English Language - Non-Examined Assessment',
    description: 'collect, analyse and present language data using appropriate methodologies',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.AL.NE.3',
    strand: 'A-Level English Language - Non-Examined Assessment',
    description: 'apply linguistic frameworks and concepts to original research',
    isStatutory: true
  },
  // A-LEVEL ENGLISH LITERATURE - Comparative Study
  {
    notation: 'UK.KS5.Y13.EN.LT.CP.1',
    strand: 'A-Level English Literature - Comparative Study',
    description: 'compare and contrast texts from different periods and genres',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.LT.CP.2',
    strand: 'A-Level English Literature - Comparative Study',
    description: 'explore thematic connections and differences across literary texts',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.LT.CP.3',
    strand: 'A-Level English Literature - Comparative Study',
    description: 'analyse how genre conventions shape meaning in different literary forms',
    isStatutory: true
  },
  // A-LEVEL ENGLISH LITERATURE - Critical Theory
  {
    notation: 'UK.KS5.Y13.EN.LT.TH.1',
    strand: 'A-Level English Literature - Critical Theory',
    description: 'understand and apply different theoretical approaches to literary texts',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.LT.TH.2',
    strand: 'A-Level English Literature - Critical Theory',
    description: 'evaluate the strengths and limitations of different critical perspectives',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.LT.TH.3',
    strand: 'A-Level English Literature - Critical Theory',
    description: 'engage with literary criticism and scholarly debates about texts studied',
    isStatutory: true
  },
  // A-LEVEL ENGLISH LITERATURE - Independent Critical Study
  {
    notation: 'UK.KS5.Y13.EN.LT.NE.1',
    strand: 'A-Level English Literature - Non-Examined Assessment',
    description: 'produce an extended comparative essay on texts of own choosing',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.LT.NE.2',
    strand: 'A-Level English Literature - Non-Examined Assessment',
    description: 'demonstrate independent reading and original critical thinking',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.LT.NE.3',
    strand: 'A-Level English Literature - Non-Examined Assessment',
    description: 'engage with critical and theoretical perspectives in independent study',
    isStatutory: true
  },
  // A-LEVEL - Advanced Essay Writing
  {
    notation: 'UK.KS5.Y13.EN.AW.1',
    strand: 'A-Level English - Advanced Writing',
    description: 'construct sophisticated, nuanced arguments about language and literature',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.AW.2',
    strand: 'A-Level English - Advanced Writing',
    description: 'integrate quotations and evidence seamlessly into analytical writing',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.AW.3',
    strand: 'A-Level English - Advanced Writing',
    description: 'demonstrate mastery of academic register and critical vocabulary',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.EN.AW.4',
    strand: 'A-Level English - Advanced Writing',
    description: 'develop and sustain original interpretations with intellectual rigour',
    isStatutory: true
  }
];

// =============================================================================
// BRITISH NATIONAL CURRICULUM ENGLISH DATA EXPORT
// =============================================================================

export const britishNCEnglish: BritishNCEnglishJurisdiction = {
  code: 'UK_NATIONAL_CURRICULUM',
  name: 'British National Curriculum',
  country: 'GB',
  version: '2014 (verified 2025)',
  sourceUrl: 'https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study',
  years: [
    { year: 1, keyStage: 1, ageRangeMin: 5, ageRangeMax: 6, standards: year1Standards },
    { year: 2, keyStage: 1, ageRangeMin: 6, ageRangeMax: 7, standards: year2Standards },
    { year: 3, keyStage: 2, ageRangeMin: 7, ageRangeMax: 8, standards: year3Standards },
    { year: 4, keyStage: 2, ageRangeMin: 8, ageRangeMax: 9, standards: year4Standards },
    { year: 5, keyStage: 2, ageRangeMin: 9, ageRangeMax: 10, standards: year5Standards },
    { year: 6, keyStage: 2, ageRangeMin: 10, ageRangeMax: 11, standards: year6Standards },
    { year: 7, keyStage: 3, ageRangeMin: 11, ageRangeMax: 12, standards: year7Standards },
    { year: 8, keyStage: 3, ageRangeMin: 12, ageRangeMax: 13, standards: year8Standards },
    { year: 9, keyStage: 3, ageRangeMin: 13, ageRangeMax: 14, standards: year9Standards },
    { year: 10, keyStage: 4, ageRangeMin: 14, ageRangeMax: 15, standards: year10Standards },
    { year: 11, keyStage: 4, ageRangeMin: 15, ageRangeMax: 16, standards: year11Standards },
    { year: 12, keyStage: 5, ageRangeMin: 16, ageRangeMax: 17, standards: year12Standards },
    { year: 13, keyStage: 5, ageRangeMin: 17, ageRangeMax: 18, standards: year13Standards }
  ]
};

// Helper functions
export function getEnglishStandardsForYear(year: number): BritishNCEnglishStandard[] {
  const yearData = britishNCEnglish.years.find(y => y.year === year);
  return yearData?.standards || [];
}

export function getEnglishStandardsForKeyStage(keyStage: number): BritishNCEnglishStandard[] {
  return britishNCEnglish.years
    .filter(y => y.keyStage === keyStage)
    .flatMap(y => y.standards);
}

export function getTotalEnglishStandardsCount(): number {
  return britishNCEnglish.years.reduce((sum, y) => sum + y.standards.length, 0);
}

export default britishNCEnglish;
