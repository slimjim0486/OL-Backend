/**
 * CBSE (Central Board of Secondary Education) - English Standards
 * Classes 1-12 (Primary through Senior Secondary)
 *
 * These are skill-based learning objectives aligned with the CBSE/NCERT
 * curriculum framework. Standards focus on measurable learning outcomes
 * rather than specific textbook chapters.
 *
 * Classes 1-8: Primary and Middle School
 * Classes 9-10: Secondary (English Language and Literature - Board Examination)
 * Classes 11-12: Senior Secondary (English Core / English Elective)
 *
 * NOTE: Chapter mapping to NEP 2020 textbooks (2024-25 onwards) is pending.
 * New NCERT English textbooks may have updated literature selections.
 *
 * Notation System: IN.CBSE.C{class}.EN.{strand}.{number}
 * - IN = India
 * - CBSE = Central Board of Secondary Education
 * - C = Class (1-12)
 * - EN = English
 * - Strand codes:
 *   Classes 1-10:
 *   - RC = Reading Comprehension
 *   - WR = Writing
 *   - GR = Grammar
 *   - VC = Vocabulary
 *   - LS = Listening and Speaking
 *   - LT = Literature
 *   Classes 11-12 (Additional):
 *   - PR = Prose (Fiction and Non-fiction)
 *   - PO = Poetry
 *   - DR = Drama
 *   - CW = Creative Writing
 *   - AC = Academic Writing
 */

export interface CBSEEnglishStandard {
  notation: string;
  strand: string;
  description: string;
  chapter?: string; // Future: NEP 2020 NCERT chapter mapping
}

export interface CBSEEnglishClass {
  class: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: CBSEEnglishStandard[];
}

export interface CBSEEnglishCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  classes: CBSEEnglishClass[];
}

// =============================================================================
// CLASS 1 (Ages 6-7)
// NCERT: Marigold Book 1
// =============================================================================

const class1Standards: CBSEEnglishStandard[] = [
  // READING COMPREHENSION
  {
    notation: 'IN.CBSE.C1.EN.RC.1',
    strand: 'Reading Comprehension',
    description: 'recognize and read letters of the alphabet',
  },
  {
    notation: 'IN.CBSE.C1.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'read simple three-letter words (CVC words)',
  },
  {
    notation: 'IN.CBSE.C1.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'read simple sentences with familiar words',
  },
  {
    notation: 'IN.CBSE.C1.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'identify the main idea of a simple story or poem',
  },
  {
    notation: 'IN.CBSE.C1.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'read aloud with proper pronunciation',
  },

  // WRITING
  {
    notation: 'IN.CBSE.C1.EN.WR.1',
    strand: 'Writing',
    description: 'write capital and small letters of the alphabet',
  },
  {
    notation: 'IN.CBSE.C1.EN.WR.2',
    strand: 'Writing',
    description: 'copy words and short sentences',
  },
  {
    notation: 'IN.CBSE.C1.EN.WR.3',
    strand: 'Writing',
    description: 'write simple three-letter words',
  },
  {
    notation: 'IN.CBSE.C1.EN.WR.4',
    strand: 'Writing',
    description: 'arrange words to form simple sentences',
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C1.EN.GR.1',
    strand: 'Grammar',
    description: 'identify naming words (nouns) for people, animals, places, things',
  },
  {
    notation: 'IN.CBSE.C1.EN.GR.2',
    strand: 'Grammar',
    description: 'understand one and many (singular and plural)',
  },
  {
    notation: 'IN.CBSE.C1.EN.GR.3',
    strand: 'Grammar',
    description: 'use is, am, are correctly in sentences',
  },
  {
    notation: 'IN.CBSE.C1.EN.GR.4',
    strand: 'Grammar',
    description: 'use this/that, these/those correctly',
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C1.EN.VC.1',
    strand: 'Vocabulary',
    description: 'learn names of common objects, animals, fruits, vegetables',
  },
  {
    notation: 'IN.CBSE.C1.EN.VC.2',
    strand: 'Vocabulary',
    description: 'identify rhyming words',
  },
  {
    notation: 'IN.CBSE.C1.EN.VC.3',
    strand: 'Vocabulary',
    description: 'match words with pictures',
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C1.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'listen to and recite simple poems and rhymes',
  },
  {
    notation: 'IN.CBSE.C1.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'introduce oneself using simple sentences',
  },
  {
    notation: 'IN.CBSE.C1.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'follow simple instructions',
  }
];

// =============================================================================
// CLASS 2 (Ages 7-8)
// NCERT: Marigold Book 2
// =============================================================================

const class2Standards: CBSEEnglishStandard[] = [
  // READING COMPREHENSION
  {
    notation: 'IN.CBSE.C2.EN.RC.1',
    strand: 'Reading Comprehension',
    description: 'read short stories with comprehension',
  },
  {
    notation: 'IN.CBSE.C2.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'answer questions based on a passage',
  },
  {
    notation: 'IN.CBSE.C2.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'identify characters and setting in a story',
  },
  {
    notation: 'IN.CBSE.C2.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'read and understand simple poems',
  },
  {
    notation: 'IN.CBSE.C2.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'sequence events in a story',
  },

  // WRITING
  {
    notation: 'IN.CBSE.C2.EN.WR.1',
    strand: 'Writing',
    description: 'write simple sentences about familiar topics',
  },
  {
    notation: 'IN.CBSE.C2.EN.WR.2',
    strand: 'Writing',
    description: 'write 3-4 sentences about pictures',
  },
  {
    notation: 'IN.CBSE.C2.EN.WR.3',
    strand: 'Writing',
    description: 'fill in the blanks in sentences',
  },
  {
    notation: 'IN.CBSE.C2.EN.WR.4',
    strand: 'Writing',
    description: 'complete a story with given hints',
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C2.EN.GR.1',
    strand: 'Grammar',
    description: 'identify action words (verbs)',
  },
  {
    notation: 'IN.CBSE.C2.EN.GR.2',
    strand: 'Grammar',
    description: 'understand pronouns: he, she, it, they',
  },
  {
    notation: 'IN.CBSE.C2.EN.GR.3',
    strand: 'Grammar',
    description: 'form plurals by adding s, es',
  },
  {
    notation: 'IN.CBSE.C2.EN.GR.4',
    strand: 'Grammar',
    description: 'use prepositions: in, on, under, behind, near',
  },
  {
    notation: 'IN.CBSE.C2.EN.GR.5',
    strand: 'Grammar',
    description: 'understand articles: a, an, the',
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C2.EN.VC.1',
    strand: 'Vocabulary',
    description: 'learn opposite words (antonyms)',
  },
  {
    notation: 'IN.CBSE.C2.EN.VC.2',
    strand: 'Vocabulary',
    description: 'identify words with similar sounds',
  },
  {
    notation: 'IN.CBSE.C2.EN.VC.3',
    strand: 'Vocabulary',
    description: 'group words into categories',
  },
  {
    notation: 'IN.CBSE.C2.EN.VC.4',
    strand: 'Vocabulary',
    description: 'learn compound words',
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C2.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'listen to stories and retell main events',
  },
  {
    notation: 'IN.CBSE.C2.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'participate in simple conversations',
  },
  {
    notation: 'IN.CBSE.C2.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'describe objects using simple sentences',
  }
];

// =============================================================================
// CLASS 3 (Ages 8-9)
// NCERT: Marigold Book 3
// =============================================================================

const class3Standards: CBSEEnglishStandard[] = [
  // READING COMPREHENSION
  {
    notation: 'IN.CBSE.C3.EN.RC.1',
    strand: 'Reading Comprehension',
    description: 'read longer passages and answer comprehension questions',
  },
  {
    notation: 'IN.CBSE.C3.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'infer meaning from context',
  },
  {
    notation: 'IN.CBSE.C3.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'identify main idea and supporting details',
  },
  {
    notation: 'IN.CBSE.C3.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'distinguish between fact and opinion',
  },
  {
    notation: 'IN.CBSE.C3.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'read and appreciate poetry: rhythm, rhyme',
  },

  // WRITING
  {
    notation: 'IN.CBSE.C3.EN.WR.1',
    strand: 'Writing',
    description: 'write short paragraphs on given topics',
  },
  {
    notation: 'IN.CBSE.C3.EN.WR.2',
    strand: 'Writing',
    description: 'write informal letters to friends and family',
  },
  {
    notation: 'IN.CBSE.C3.EN.WR.3',
    strand: 'Writing',
    description: 'write diary entries',
  },
  {
    notation: 'IN.CBSE.C3.EN.WR.4',
    strand: 'Writing',
    description: 'use punctuation marks: full stop, question mark, exclamation',
  },
  {
    notation: 'IN.CBSE.C3.EN.WR.5',
    strand: 'Writing',
    description: 'write a story with beginning, middle, end',
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C3.EN.GR.1',
    strand: 'Grammar',
    description: 'identify adjectives (describing words)',
  },
  {
    notation: 'IN.CBSE.C3.EN.GR.2',
    strand: 'Grammar',
    description: 'understand simple present tense',
  },
  {
    notation: 'IN.CBSE.C3.EN.GR.3',
    strand: 'Grammar',
    description: 'understand simple past tense',
  },
  {
    notation: 'IN.CBSE.C3.EN.GR.4',
    strand: 'Grammar',
    description: 'use conjunctions: and, but, or, because',
  },
  {
    notation: 'IN.CBSE.C3.EN.GR.5',
    strand: 'Grammar',
    description: 'form questions using question words: what, when, where, who, why, how',
  },
  {
    notation: 'IN.CBSE.C3.EN.GR.6',
    strand: 'Grammar',
    description: 'understand irregular plurals',
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C3.EN.VC.1',
    strand: 'Vocabulary',
    description: 'learn synonyms (similar meaning words)',
  },
  {
    notation: 'IN.CBSE.C3.EN.VC.2',
    strand: 'Vocabulary',
    description: 'understand homophones (same sound, different meaning)',
  },
  {
    notation: 'IN.CBSE.C3.EN.VC.3',
    strand: 'Vocabulary',
    description: 'learn prefixes and suffixes',
  },
  {
    notation: 'IN.CBSE.C3.EN.VC.4',
    strand: 'Vocabulary',
    description: 'use dictionary to find word meanings',
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C3.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'recite poems with expression',
  },
  {
    notation: 'IN.CBSE.C3.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'participate in role play',
  },
  {
    notation: 'IN.CBSE.C3.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'give short oral presentations',
  }
];

// =============================================================================
// CLASS 4 (Ages 9-10)
// NCERT: Marigold Book 4
// =============================================================================

const class4Standards: CBSEEnglishStandard[] = [
  // READING COMPREHENSION
  {
    notation: 'IN.CBSE.C4.EN.RC.1',
    strand: 'Reading Comprehension',
    description: 'read and understand stories with multiple characters',
  },
  {
    notation: 'IN.CBSE.C4.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'identify cause and effect in a text',
  },
  {
    notation: 'IN.CBSE.C4.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'make predictions while reading',
  },
  {
    notation: 'IN.CBSE.C4.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'summarize a story in own words',
  },
  {
    notation: 'IN.CBSE.C4.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'understand figurative language in poems',
  },
  {
    notation: 'IN.CBSE.C4.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'read non-fiction texts and extract information',
  },

  // WRITING
  {
    notation: 'IN.CBSE.C4.EN.WR.1',
    strand: 'Writing',
    description: 'write longer paragraphs with topic sentence',
  },
  {
    notation: 'IN.CBSE.C4.EN.WR.2',
    strand: 'Writing',
    description: 'write descriptions of people, places, events',
  },
  {
    notation: 'IN.CBSE.C4.EN.WR.3',
    strand: 'Writing',
    description: 'write notices and messages',
  },
  {
    notation: 'IN.CBSE.C4.EN.WR.4',
    strand: 'Writing',
    description: 'write book reports',
  },
  {
    notation: 'IN.CBSE.C4.EN.WR.5',
    strand: 'Writing',
    description: 'use dialogue in writing',
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C4.EN.GR.1',
    strand: 'Grammar',
    description: 'understand adverbs (words that describe verbs)',
  },
  {
    notation: 'IN.CBSE.C4.EN.GR.2',
    strand: 'Grammar',
    description: 'use continuous tense (present and past)',
  },
  {
    notation: 'IN.CBSE.C4.EN.GR.3',
    strand: 'Grammar',
    description: 'understand simple future tense',
  },
  {
    notation: 'IN.CBSE.C4.EN.GR.4',
    strand: 'Grammar',
    description: 'use apostrophe for contractions and possession',
  },
  {
    notation: 'IN.CBSE.C4.EN.GR.5',
    strand: 'Grammar',
    description: 'identify subject and predicate in sentences',
  },
  {
    notation: 'IN.CBSE.C4.EN.GR.6',
    strand: 'Grammar',
    description: 'understand degrees of comparison',
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C4.EN.VC.1',
    strand: 'Vocabulary',
    description: 'understand idioms and their meanings',
  },
  {
    notation: 'IN.CBSE.C4.EN.VC.2',
    strand: 'Vocabulary',
    description: 'learn words with multiple meanings',
  },
  {
    notation: 'IN.CBSE.C4.EN.VC.3',
    strand: 'Vocabulary',
    description: 'form new words using prefixes: un-, re-, dis-',
  },
  {
    notation: 'IN.CBSE.C4.EN.VC.4',
    strand: 'Vocabulary',
    description: 'form new words using suffixes: -ful, -less, -ly',
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C4.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'participate in group discussions',
  },
  {
    notation: 'IN.CBSE.C4.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'give and follow multi-step instructions',
  },
  {
    notation: 'IN.CBSE.C4.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'narrate personal experiences',
  }
];

// =============================================================================
// CLASS 5 (Ages 10-11)
// NCERT: Marigold Book 5
// =============================================================================

const class5Standards: CBSEEnglishStandard[] = [
  // READING COMPREHENSION
  {
    notation: 'IN.CBSE.C5.EN.RC.1',
    strand: 'Reading Comprehension',
    description: 'analyze character traits and motivations',
  },
  {
    notation: 'IN.CBSE.C5.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'compare and contrast elements in different texts',
  },
  {
    notation: 'IN.CBSE.C5.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'identify theme and moral of a story',
  },
  {
    notation: 'IN.CBSE.C5.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'understand author\'s purpose and point of view',
  },
  {
    notation: 'IN.CBSE.C5.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'draw conclusions from text evidence',
  },
  {
    notation: 'IN.CBSE.C5.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'read and interpret graphs, charts, tables',
  },

  // WRITING
  {
    notation: 'IN.CBSE.C5.EN.WR.1',
    strand: 'Writing',
    description: 'write essays with introduction, body, and conclusion',
  },
  {
    notation: 'IN.CBSE.C5.EN.WR.2',
    strand: 'Writing',
    description: 'write formal and informal letters',
  },
  {
    notation: 'IN.CBSE.C5.EN.WR.3',
    strand: 'Writing',
    description: 'write summaries of passages',
  },
  {
    notation: 'IN.CBSE.C5.EN.WR.4',
    strand: 'Writing',
    description: 'write creative stories with vivid descriptions',
  },
  {
    notation: 'IN.CBSE.C5.EN.WR.5',
    strand: 'Writing',
    description: 'edit and revise written work',
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C5.EN.GR.1',
    strand: 'Grammar',
    description: 'understand perfect tenses (present, past)',
  },
  {
    notation: 'IN.CBSE.C5.EN.GR.2',
    strand: 'Grammar',
    description: 'identify types of sentences: declarative, interrogative, imperative, exclamatory',
  },
  {
    notation: 'IN.CBSE.C5.EN.GR.3',
    strand: 'Grammar',
    description: 'use active and passive voice',
  },
  {
    notation: 'IN.CBSE.C5.EN.GR.4',
    strand: 'Grammar',
    description: 'use direct and indirect speech (basic)',
  },
  {
    notation: 'IN.CBSE.C5.EN.GR.5',
    strand: 'Grammar',
    description: 'identify clauses in complex sentences',
  },
  {
    notation: 'IN.CBSE.C5.EN.GR.6',
    strand: 'Grammar',
    description: 'use modals: can, could, may, might, should, would',
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C5.EN.VC.1',
    strand: 'Vocabulary',
    description: 'learn proverbs and their meanings',
  },
  {
    notation: 'IN.CBSE.C5.EN.VC.2',
    strand: 'Vocabulary',
    description: 'understand similes and metaphors',
  },
  {
    notation: 'IN.CBSE.C5.EN.VC.3',
    strand: 'Vocabulary',
    description: 'learn common collocations',
  },
  {
    notation: 'IN.CBSE.C5.EN.VC.4',
    strand: 'Vocabulary',
    description: 'expand vocabulary through word roots',
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C5.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'give prepared speeches on topics',
  },
  {
    notation: 'IN.CBSE.C5.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'participate in debates (basic)',
  },
  {
    notation: 'IN.CBSE.C5.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'conduct simple interviews',
  }
];

// =============================================================================
// CLASS 6 (Ages 11-12)
// NCERT: Honeysuckle + A Pact with the Sun (Supplementary Reader)
// =============================================================================

const class6Standards: CBSEEnglishStandard[] = [
  // READING COMPREHENSION
  {
    notation: 'IN.CBSE.C6.EN.RC.1',
    strand: 'Reading Comprehension',
    description: 'read and comprehend prose passages of varying difficulty',
  },
  {
    notation: 'IN.CBSE.C6.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'analyze plot structure: exposition, rising action, climax, resolution',
  },
  {
    notation: 'IN.CBSE.C6.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'identify literary devices in poems',
  },
  {
    notation: 'IN.CBSE.C6.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'make inferences and draw conclusions',
  },
  {
    notation: 'IN.CBSE.C6.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'understand context clues to determine word meaning',
  },
  {
    notation: 'IN.CBSE.C6.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'read and appreciate different forms of poetry',
  },

  // LITERATURE
  {
    notation: 'IN.CBSE.C6.EN.LT.1',
    strand: 'Literature',
    description: 'understand elements of short stories',
  },
  {
    notation: 'IN.CBSE.C6.EN.LT.2',
    strand: 'Literature',
    description: 'appreciate biographical narratives',
  },
  {
    notation: 'IN.CBSE.C6.EN.LT.3',
    strand: 'Literature',
    description: 'understand poetry: imagery, symbolism',
  },

  // WRITING
  {
    notation: 'IN.CBSE.C6.EN.WR.1',
    strand: 'Writing',
    description: 'write formal letters: application, complaint',
  },
  {
    notation: 'IN.CBSE.C6.EN.WR.2',
    strand: 'Writing',
    description: 'write diary entries expressing thoughts and feelings',
  },
  {
    notation: 'IN.CBSE.C6.EN.WR.3',
    strand: 'Writing',
    description: 'write narrative essays',
  },
  {
    notation: 'IN.CBSE.C6.EN.WR.4',
    strand: 'Writing',
    description: 'write descriptive paragraphs with sensory details',
  },
  {
    notation: 'IN.CBSE.C6.EN.WR.5',
    strand: 'Writing',
    description: 'write messages and notes',
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C6.EN.GR.1',
    strand: 'Grammar',
    description: 'understand all tenses in detail',
  },
  {
    notation: 'IN.CBSE.C6.EN.GR.2',
    strand: 'Grammar',
    description: 'identify and use determiners',
  },
  {
    notation: 'IN.CBSE.C6.EN.GR.3',
    strand: 'Grammar',
    description: 'understand subject-verb agreement',
  },
  {
    notation: 'IN.CBSE.C6.EN.GR.4',
    strand: 'Grammar',
    description: 'use phrases and clauses effectively',
  },
  {
    notation: 'IN.CBSE.C6.EN.GR.5',
    strand: 'Grammar',
    description: 'transform sentences: affirmative/negative, simple/complex',
  },
  {
    notation: 'IN.CBSE.C6.EN.GR.6',
    strand: 'Grammar',
    description: 'use relative pronouns: who, which, that',
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C6.EN.VC.1',
    strand: 'Vocabulary',
    description: 'understand homonyms and homographs',
  },
  {
    notation: 'IN.CBSE.C6.EN.VC.2',
    strand: 'Vocabulary',
    description: 'learn common phrasal verbs',
  },
  {
    notation: 'IN.CBSE.C6.EN.VC.3',
    strand: 'Vocabulary',
    description: 'understand connotation and denotation',
  },
  {
    notation: 'IN.CBSE.C6.EN.VC.4',
    strand: 'Vocabulary',
    description: 'use contextual vocabulary from texts',
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C6.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'participate in extempore speaking',
  },
  {
    notation: 'IN.CBSE.C6.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'present oral summaries of texts read',
  },
  {
    notation: 'IN.CBSE.C6.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'listen to audio/video clips and answer questions',
  }
];

// =============================================================================
// CLASS 7 (Ages 12-13)
// NCERT: Honeycomb + An Alien Hand (Supplementary Reader)
// =============================================================================

const class7Standards: CBSEEnglishStandard[] = [
  // READING COMPREHENSION
  {
    notation: 'IN.CBSE.C7.EN.RC.1',
    strand: 'Reading Comprehension',
    description: 'analyze author\'s craft and writing style',
  },
  {
    notation: 'IN.CBSE.C7.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'evaluate arguments and evidence in text',
  },
  {
    notation: 'IN.CBSE.C7.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'understand cultural context in literature',
  },
  {
    notation: 'IN.CBSE.C7.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'analyze poetic forms and structures',
  },
  {
    notation: 'IN.CBSE.C7.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'synthesize information from multiple sources',
  },
  {
    notation: 'IN.CBSE.C7.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'identify bias and perspective in texts',
  },

  // LITERATURE
  {
    notation: 'IN.CBSE.C7.EN.LT.1',
    strand: 'Literature',
    description: 'analyze character development across a narrative',
  },
  {
    notation: 'IN.CBSE.C7.EN.LT.2',
    strand: 'Literature',
    description: 'understand dramatic irony and situational irony',
  },
  {
    notation: 'IN.CBSE.C7.EN.LT.3',
    strand: 'Literature',
    description: 'appreciate humor and satire in literature',
  },

  // WRITING
  {
    notation: 'IN.CBSE.C7.EN.WR.1',
    strand: 'Writing',
    description: 'write formal and informal emails',
  },
  {
    notation: 'IN.CBSE.C7.EN.WR.2',
    strand: 'Writing',
    description: 'write newspaper articles and reports',
  },
  {
    notation: 'IN.CBSE.C7.EN.WR.3',
    strand: 'Writing',
    description: 'write argumentative essays',
  },
  {
    notation: 'IN.CBSE.C7.EN.WR.4',
    strand: 'Writing',
    description: 'write bio-sketches',
  },
  {
    notation: 'IN.CBSE.C7.EN.WR.5',
    strand: 'Writing',
    description: 'write advertisements',
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C7.EN.GR.1',
    strand: 'Grammar',
    description: 'use complex sentences with multiple clauses',
  },
  {
    notation: 'IN.CBSE.C7.EN.GR.2',
    strand: 'Grammar',
    description: 'understand conditional sentences',
  },
  {
    notation: 'IN.CBSE.C7.EN.GR.3',
    strand: 'Grammar',
    description: 'convert active voice to passive voice and vice versa',
  },
  {
    notation: 'IN.CBSE.C7.EN.GR.4',
    strand: 'Grammar',
    description: 'convert direct speech to indirect speech',
  },
  {
    notation: 'IN.CBSE.C7.EN.GR.5',
    strand: 'Grammar',
    description: 'use non-finite verbs: infinitives, gerunds, participles',
  },
  {
    notation: 'IN.CBSE.C7.EN.GR.6',
    strand: 'Grammar',
    description: 'understand concord (agreement) in sentences',
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C7.EN.VC.1',
    strand: 'Vocabulary',
    description: 'understand literary vocabulary from texts',
  },
  {
    notation: 'IN.CBSE.C7.EN.VC.2',
    strand: 'Vocabulary',
    description: 'learn one-word substitutions',
  },
  {
    notation: 'IN.CBSE.C7.EN.VC.3',
    strand: 'Vocabulary',
    description: 'understand analogies and word relationships',
  },
  {
    notation: 'IN.CBSE.C7.EN.VC.4',
    strand: 'Vocabulary',
    description: 'expand academic vocabulary',
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C7.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'participate in formal debates',
  },
  {
    notation: 'IN.CBSE.C7.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'deliver persuasive speeches',
  },
  {
    notation: 'IN.CBSE.C7.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'conduct and participate in mock interviews',
  }
];

// =============================================================================
// CLASS 8 (Ages 13-14)
// NCERT: Honeydew + It So Happened (Supplementary Reader)
// =============================================================================

const class8Standards: CBSEEnglishStandard[] = [
  // READING COMPREHENSION
  {
    notation: 'IN.CBSE.C8.EN.RC.1',
    strand: 'Reading Comprehension',
    description: 'critically analyze texts for underlying themes',
  },
  {
    notation: 'IN.CBSE.C8.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'compare texts from different genres',
  },
  {
    notation: 'IN.CBSE.C8.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'understand implicit meaning and subtext',
  },
  {
    notation: 'IN.CBSE.C8.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'analyze narrative perspective and voice',
  },
  {
    notation: 'IN.CBSE.C8.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'evaluate effectiveness of literary techniques',
  },
  {
    notation: 'IN.CBSE.C8.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'interpret poetry: tone, mood, symbolism',
  },

  // LITERATURE
  {
    notation: 'IN.CBSE.C8.EN.LT.1',
    strand: 'Literature',
    description: 'understand historical fiction and its elements',
  },
  {
    notation: 'IN.CBSE.C8.EN.LT.2',
    strand: 'Literature',
    description: 'analyze social commentary in literature',
  },
  {
    notation: 'IN.CBSE.C8.EN.LT.3',
    strand: 'Literature',
    description: 'understand play format and dialogue',
  },
  {
    notation: 'IN.CBSE.C8.EN.LT.4',
    strand: 'Literature',
    description: 'appreciate science fiction as a genre',
  },

  // WRITING
  {
    notation: 'IN.CBSE.C8.EN.WR.1',
    strand: 'Writing',
    description: 'write analytical essays with thesis and evidence',
  },
  {
    notation: 'IN.CBSE.C8.EN.WR.2',
    strand: 'Writing',
    description: 'write speeches for various occasions',
  },
  {
    notation: 'IN.CBSE.C8.EN.WR.3',
    strand: 'Writing',
    description: 'write short stories with plot development',
  },
  {
    notation: 'IN.CBSE.C8.EN.WR.4',
    strand: 'Writing',
    description: 'write business letters and formal communication',
  },
  {
    notation: 'IN.CBSE.C8.EN.WR.5',
    strand: 'Writing',
    description: 'write factual descriptions and processes',
  },
  {
    notation: 'IN.CBSE.C8.EN.WR.6',
    strand: 'Writing',
    description: 'write reviews of books, films, events',
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C8.EN.GR.1',
    strand: 'Grammar',
    description: 'master all aspects of reported speech',
  },
  {
    notation: 'IN.CBSE.C8.EN.GR.2',
    strand: 'Grammar',
    description: 'understand mood in sentences: indicative, imperative, subjunctive',
  },
  {
    notation: 'IN.CBSE.C8.EN.GR.3',
    strand: 'Grammar',
    description: 'use complex passive constructions',
  },
  {
    notation: 'IN.CBSE.C8.EN.GR.4',
    strand: 'Grammar',
    description: 'identify and correct common grammatical errors',
  },
  {
    notation: 'IN.CBSE.C8.EN.GR.5',
    strand: 'Grammar',
    description: 'use parallel structure in writing',
  },
  {
    notation: 'IN.CBSE.C8.EN.GR.6',
    strand: 'Grammar',
    description: 'understand sentence variety for effect',
  },
  {
    notation: 'IN.CBSE.C8.EN.GR.7',
    strand: 'Grammar',
    description: 'use punctuation effectively: semicolons, colons, dashes',
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C8.EN.VC.1',
    strand: 'Vocabulary',
    description: 'understand etymology and word origins',
  },
  {
    notation: 'IN.CBSE.C8.EN.VC.2',
    strand: 'Vocabulary',
    description: 'learn foreign words and phrases used in English',
  },
  {
    notation: 'IN.CBSE.C8.EN.VC.3',
    strand: 'Vocabulary',
    description: 'understand technical and specialized vocabulary',
  },
  {
    notation: 'IN.CBSE.C8.EN.VC.4',
    strand: 'Vocabulary',
    description: 'develop strong academic vocabulary for writing',
  },
  {
    notation: 'IN.CBSE.C8.EN.VC.5',
    strand: 'Vocabulary',
    description: 'understand and use formal register appropriately',
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C8.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'participate in panel discussions',
  },
  {
    notation: 'IN.CBSE.C8.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'deliver formal presentations with visual aids',
  },
  {
    notation: 'IN.CBSE.C8.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'participate in Model United Nations style discussions',
  },
  {
    notation: 'IN.CBSE.C8.EN.LS.4',
    strand: 'Listening and Speaking',
    description: 'analyze and respond to audio-visual media',
  }
];

// =============================================================================
// CLASS 9 (Ages 14-15)
// NCERT: Beehive (Main Reader), Moments (Supplementary Reader)
// Secondary Education - Board Exam Preparation
// =============================================================================

const class9Standards: CBSEEnglishStandard[] = [
  // READING COMPREHENSION
  {
    notation: 'IN.CBSE.C9.EN.RC.1',
    strand: 'Reading Comprehension',
    description: 'read and comprehend unseen passages factual and discursive',
  },
  {
    notation: 'IN.CBSE.C9.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'identify main ideas, supporting details, and inferences',
  },
  {
    notation: 'IN.CBSE.C9.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'analyze author\'s purpose and point of view',
  },
  {
    notation: 'IN.CBSE.C9.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'interpret visual texts: graphs, charts, and diagrams',
  },
  {
    notation: 'IN.CBSE.C9.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'identify literary devices in prose and poetry',
  },
  {
    notation: 'IN.CBSE.C9.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'apply critical reading strategies to texts',
  },

  // WRITING
  {
    notation: 'IN.CBSE.C9.EN.WR.1',
    strand: 'Writing',
    description: 'write formal and informal letters following format',
  },
  {
    notation: 'IN.CBSE.C9.EN.WR.2',
    strand: 'Writing',
    description: 'write diary entries and biographical sketches',
  },
  {
    notation: 'IN.CBSE.C9.EN.WR.3',
    strand: 'Writing',
    description: 'write descriptive paragraphs with sensory details',
  },
  {
    notation: 'IN.CBSE.C9.EN.WR.4',
    strand: 'Writing',
    description: 'write short stories with plot development',
  },
  {
    notation: 'IN.CBSE.C9.EN.WR.5',
    strand: 'Writing',
    description: 'complete stories based on given outlines or beginnings',
  },
  {
    notation: 'IN.CBSE.C9.EN.WR.6',
    strand: 'Writing',
    description: 'write analytical paragraphs based on data interpretation',
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C9.EN.GR.1',
    strand: 'Grammar',
    description: 'use tenses correctly: present, past, future and their forms',
  },
  {
    notation: 'IN.CBSE.C9.EN.GR.2',
    strand: 'Grammar',
    description: 'use modals for various functions: advice, obligation, permission',
  },
  {
    notation: 'IN.CBSE.C9.EN.GR.3',
    strand: 'Grammar',
    description: 'transform sentences: active to passive voice',
  },
  {
    notation: 'IN.CBSE.C9.EN.GR.4',
    strand: 'Grammar',
    description: 'convert direct speech to reported speech',
  },
  {
    notation: 'IN.CBSE.C9.EN.GR.5',
    strand: 'Grammar',
    description: 'use subject-verb agreement with complex subjects',
  },
  {
    notation: 'IN.CBSE.C9.EN.GR.6',
    strand: 'Grammar',
    description: 'identify and correct errors in sentences',
  },
  {
    notation: 'IN.CBSE.C9.EN.GR.7',
    strand: 'Grammar',
    description: 'rearrange jumbled sentences into coherent paragraphs',
  },
  {
    notation: 'IN.CBSE.C9.EN.GR.8',
    strand: 'Grammar',
    description: 'use clauses: noun, adjective, and adverb clauses',
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C9.EN.VC.1',
    strand: 'Vocabulary',
    description: 'understand and use idioms and phrases in context',
  },
  {
    notation: 'IN.CBSE.C9.EN.VC.2',
    strand: 'Vocabulary',
    description: 'use one-word substitutions appropriately',
  },
  {
    notation: 'IN.CBSE.C9.EN.VC.3',
    strand: 'Vocabulary',
    description: 'use collocations correctly in writing',
  },
  {
    notation: 'IN.CBSE.C9.EN.VC.4',
    strand: 'Vocabulary',
    description: 'understand homophones and homonyms',
  },
  {
    notation: 'IN.CBSE.C9.EN.VC.5',
    strand: 'Vocabulary',
    description: 'use contextual vocabulary from prescribed texts',
  },

  // LITERATURE - PROSE
  {
    notation: 'IN.CBSE.C9.EN.LT.1',
    strand: 'Literature',
    description: 'analyze themes and central ideas in prose texts',
  },
  {
    notation: 'IN.CBSE.C9.EN.LT.2',
    strand: 'Literature',
    description: 'analyze character development and motivation',
  },
  {
    notation: 'IN.CBSE.C9.EN.LT.3',
    strand: 'Literature',
    description: 'understand narrative techniques and point of view',
  },
  {
    notation: 'IN.CBSE.C9.EN.LT.4',
    strand: 'Literature',
    description: 'write short and long answers on prose texts',
  },

  // LITERATURE - POETRY
  {
    notation: 'IN.CBSE.C9.EN.LT.5',
    strand: 'Literature',
    description: 'analyze poetic devices: metaphor, simile, personification',
  },
  {
    notation: 'IN.CBSE.C9.EN.LT.6',
    strand: 'Literature',
    description: 'understand rhythm, rhyme scheme, and meter in poetry',
  },
  {
    notation: 'IN.CBSE.C9.EN.LT.7',
    strand: 'Literature',
    description: 'interpret themes and emotions in poems',
  },
  {
    notation: 'IN.CBSE.C9.EN.LT.8',
    strand: 'Literature',
    description: 'write reference to context explanations for poetry',
  },

  // LITERATURE - SUPPLEMENTARY
  {
    notation: 'IN.CBSE.C9.EN.LT.9',
    strand: 'Literature',
    description: 'summarize and analyze supplementary reader stories',
  },
  {
    notation: 'IN.CBSE.C9.EN.LT.10',
    strand: 'Literature',
    description: 'draw comparisons between characters and themes',
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C9.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'participate in formal debates following rules',
  },
  {
    notation: 'IN.CBSE.C9.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'deliver speeches on given topics',
  },
  {
    notation: 'IN.CBSE.C9.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'conduct and participate in group discussions',
  },
  {
    notation: 'IN.CBSE.C9.EN.LS.4',
    strand: 'Listening and Speaking',
    description: 'present book reviews and character analyses',
  }
];

// =============================================================================
// CLASS 10 (Ages 15-16)
// NCERT: First Flight (Main Reader), Footprints Without Feet (Supplementary)
// Secondary Education - Board Examination Year
// =============================================================================

const class10Standards: CBSEEnglishStandard[] = [
  // READING COMPREHENSION
  {
    notation: 'IN.CBSE.C10.EN.RC.1',
    strand: 'Reading Comprehension',
    description: 'comprehend unseen passages with complex vocabulary',
  },
  {
    notation: 'IN.CBSE.C10.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'analyze case-based passages and answer questions',
  },
  {
    notation: 'IN.CBSE.C10.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'identify tone, mood, and author\'s perspective',
  },
  {
    notation: 'IN.CBSE.C10.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'make inferences and draw conclusions from texts',
  },
  {
    notation: 'IN.CBSE.C10.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'analyze data-based passages with statistical information',
  },
  {
    notation: 'IN.CBSE.C10.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'evaluate arguments and identify bias in texts',
  },

  // WRITING
  {
    notation: 'IN.CBSE.C10.EN.WR.1',
    strand: 'Writing',
    description: 'write formal letters: complaint, inquiry, order',
  },
  {
    notation: 'IN.CBSE.C10.EN.WR.2',
    strand: 'Writing',
    description: 'write letters to editors on social issues',
  },
  {
    notation: 'IN.CBSE.C10.EN.WR.3',
    strand: 'Writing',
    description: 'write analytical paragraphs from charts, graphs, data',
  },
  {
    notation: 'IN.CBSE.C10.EN.WR.4',
    strand: 'Writing',
    description: 'write argumentative essays with thesis and evidence',
  },
  {
    notation: 'IN.CBSE.C10.EN.WR.5',
    strand: 'Writing',
    description: 'write stories with climax and resolution',
  },
  {
    notation: 'IN.CBSE.C10.EN.WR.6',
    strand: 'Writing',
    description: 'write reports on events and activities',
  },
  {
    notation: 'IN.CBSE.C10.EN.WR.7',
    strand: 'Writing',
    description: 'write notices, messages, and emails',
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C10.EN.GR.1',
    strand: 'Grammar',
    description: 'apply advanced tense usage in context',
  },
  {
    notation: 'IN.CBSE.C10.EN.GR.2',
    strand: 'Grammar',
    description: 'use conditionals: zero, first, second, third',
  },
  {
    notation: 'IN.CBSE.C10.EN.GR.3',
    strand: 'Grammar',
    description: 'transform complex sentences using clauses',
  },
  {
    notation: 'IN.CBSE.C10.EN.GR.4',
    strand: 'Grammar',
    description: 'edit paragraphs for grammatical accuracy',
  },
  {
    notation: 'IN.CBSE.C10.EN.GR.5',
    strand: 'Grammar',
    description: 'fill blanks with appropriate forms of words',
  },
  {
    notation: 'IN.CBSE.C10.EN.GR.6',
    strand: 'Grammar',
    description: 'use determiners and prepositions correctly',
  },
  {
    notation: 'IN.CBSE.C10.EN.GR.7',
    strand: 'Grammar',
    description: 'transform sentences maintaining meaning',
  },
  {
    notation: 'IN.CBSE.C10.EN.GR.8',
    strand: 'Grammar',
    description: 'use connectors and transitional devices',
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C10.EN.VC.1',
    strand: 'Vocabulary',
    description: 'use phrasal verbs accurately in context',
  },
  {
    notation: 'IN.CBSE.C10.EN.VC.2',
    strand: 'Vocabulary',
    description: 'understand nuances and connotations of words',
  },
  {
    notation: 'IN.CBSE.C10.EN.VC.3',
    strand: 'Vocabulary',
    description: 'use formal and informal register appropriately',
  },
  {
    notation: 'IN.CBSE.C10.EN.VC.4',
    strand: 'Vocabulary',
    description: 'understand domain-specific vocabulary from texts',
  },

  // LITERATURE - PROSE
  {
    notation: 'IN.CBSE.C10.EN.LT.1',
    strand: 'Literature',
    description: 'analyze complex themes in prose: identity, conflict, justice',
  },
  {
    notation: 'IN.CBSE.C10.EN.LT.2',
    strand: 'Literature',
    description: 'analyze characterization techniques and dialogue',
  },
  {
    notation: 'IN.CBSE.C10.EN.LT.3',
    strand: 'Literature',
    description: 'understand setting and its significance in narratives',
  },
  {
    notation: 'IN.CBSE.C10.EN.LT.4',
    strand: 'Literature',
    description: 'write extract-based answers on prose',
  },
  {
    notation: 'IN.CBSE.C10.EN.LT.5',
    strand: 'Literature',
    description: 'write long answers analyzing prose texts',
  },

  // LITERATURE - POETRY
  {
    notation: 'IN.CBSE.C10.EN.LT.6',
    strand: 'Literature',
    description: 'analyze advanced poetic devices: imagery, symbolism, irony',
  },
  {
    notation: 'IN.CBSE.C10.EN.LT.7',
    strand: 'Literature',
    description: 'interpret deeper meanings and universal themes in poetry',
  },
  {
    notation: 'IN.CBSE.C10.EN.LT.8',
    strand: 'Literature',
    description: 'write extract-based answers on poems',
  },
  {
    notation: 'IN.CBSE.C10.EN.LT.9',
    strand: 'Literature',
    description: 'compare and contrast poems thematically',
  },

  // LITERATURE - DRAMA (if applicable)
  {
    notation: 'IN.CBSE.C10.EN.LT.10',
    strand: 'Literature',
    description: 'analyze dramatic elements: dialogue, stage directions',
  },
  {
    notation: 'IN.CBSE.C10.EN.LT.11',
    strand: 'Literature',
    description: 'understand character motivation in plays',
  },

  // LITERATURE - SUPPLEMENTARY
  {
    notation: 'IN.CBSE.C10.EN.LT.12',
    strand: 'Literature',
    description: 'analyze themes in supplementary reader stories',
  },
  {
    notation: 'IN.CBSE.C10.EN.LT.13',
    strand: 'Literature',
    description: 'write value-based answers connecting texts to life',
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C10.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'participate in formal debates with rebuttals',
  },
  {
    notation: 'IN.CBSE.C10.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'conduct interviews and report findings',
  },
  {
    notation: 'IN.CBSE.C10.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'present research-based topics with evidence',
  }
];

// =============================================================================
// CLASS 11 (Ages 16-17)
// NCERT: Hornbill (Prose), Snapshots (Supplementary), The Canterville Ghost
// Senior Secondary Education - English Core
// =============================================================================

const class11Standards: CBSEEnglishStandard[] = [
  // READING COMPREHENSION
  {
    notation: 'IN.CBSE.C11.EN.RC.1',
    strand: 'Reading Comprehension',
    description: 'comprehend unseen literary and factual passages',
  },
  {
    notation: 'IN.CBSE.C11.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'analyze argumentative and persuasive texts',
  },
  {
    notation: 'IN.CBSE.C11.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'interpret texts with multiple layers of meaning',
  },
  {
    notation: 'IN.CBSE.C11.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'identify rhetorical devices in texts',
  },
  {
    notation: 'IN.CBSE.C11.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'synthesize information from multiple sources',
  },
  {
    notation: 'IN.CBSE.C11.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'analyze text structure and organization',
  },
  {
    notation: 'IN.CBSE.C11.EN.RC.7',
    strand: 'Reading Comprehension',
    description: 'comprehend note-making and summarization techniques',
  },

  // WRITING
  {
    notation: 'IN.CBSE.C11.EN.WR.1',
    strand: 'Writing',
    description: 'write notices, advertisements, and posters',
  },
  {
    notation: 'IN.CBSE.C11.EN.WR.2',
    strand: 'Writing',
    description: 'write classified advertisements for various purposes',
  },
  {
    notation: 'IN.CBSE.C11.EN.WR.3',
    strand: 'Writing',
    description: 'write invitations and replies: formal and informal',
  },
  {
    notation: 'IN.CBSE.C11.EN.WR.4',
    strand: 'Writing',
    description: 'write job application letters with bio-data',
  },
  {
    notation: 'IN.CBSE.C11.EN.WR.5',
    strand: 'Writing',
    description: 'write discursive essays presenting multiple perspectives',
  },
  {
    notation: 'IN.CBSE.C11.EN.WR.6',
    strand: 'Writing',
    description: 'write articles for newspapers and magazines',
  },
  {
    notation: 'IN.CBSE.C11.EN.WR.7',
    strand: 'Writing',
    description: 'write speech scripts for formal occasions',
  },
  {
    notation: 'IN.CBSE.C11.EN.WR.8',
    strand: 'Writing',
    description: 'write debate scripts with arguments and counter-arguments',
  },
  {
    notation: 'IN.CBSE.C11.EN.WR.9',
    strand: 'Writing',
    description: 'write reports on events, surveys, and investigations',
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C11.EN.GR.1',
    strand: 'Grammar',
    description: 'use advanced punctuation: semicolons, colons, dashes',
  },
  {
    notation: 'IN.CBSE.C11.EN.GR.2',
    strand: 'Grammar',
    description: 'apply advanced sentence structures in writing',
  },
  {
    notation: 'IN.CBSE.C11.EN.GR.3',
    strand: 'Grammar',
    description: 'use subjunctive mood and conditional structures',
  },
  {
    notation: 'IN.CBSE.C11.EN.GR.4',
    strand: 'Grammar',
    description: 'maintain parallel structure in sentences',
  },
  {
    notation: 'IN.CBSE.C11.EN.GR.5',
    strand: 'Grammar',
    description: 'use modifiers correctly avoiding dangling and misplaced modifiers',
  },
  {
    notation: 'IN.CBSE.C11.EN.GR.6',
    strand: 'Grammar',
    description: 'maintain consistency in tense and voice throughout texts',
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C11.EN.VC.1',
    strand: 'Vocabulary',
    description: 'use academic vocabulary in formal writing',
  },
  {
    notation: 'IN.CBSE.C11.EN.VC.2',
    strand: 'Vocabulary',
    description: 'understand and use literary terminology',
  },
  {
    notation: 'IN.CBSE.C11.EN.VC.3',
    strand: 'Vocabulary',
    description: 'use figurative language effectively in writing',
  },
  {
    notation: 'IN.CBSE.C11.EN.VC.4',
    strand: 'Vocabulary',
    description: 'expand vocabulary through wide reading',
  },

  // LITERATURE - PROSE
  {
    notation: 'IN.CBSE.C11.EN.PR.1',
    strand: 'Prose',
    description: 'analyze narrative techniques in prose works',
  },
  {
    notation: 'IN.CBSE.C11.EN.PR.2',
    strand: 'Prose',
    description: 'understand author\'s style and voice',
  },
  {
    notation: 'IN.CBSE.C11.EN.PR.3',
    strand: 'Prose',
    description: 'analyze social and cultural themes in texts',
  },
  {
    notation: 'IN.CBSE.C11.EN.PR.4',
    strand: 'Prose',
    description: 'write critical appreciation of prose passages',
  },
  {
    notation: 'IN.CBSE.C11.EN.PR.5',
    strand: 'Prose',
    description: 'connect texts to historical and cultural contexts',
  },
  {
    notation: 'IN.CBSE.C11.EN.PR.6',
    strand: 'Prose',
    description: 'analyze essays and non-fiction prose',
  },

  // LITERATURE - POETRY
  {
    notation: 'IN.CBSE.C11.EN.PO.1',
    strand: 'Poetry',
    description: 'analyze structure and form in poetry',
  },
  {
    notation: 'IN.CBSE.C11.EN.PO.2',
    strand: 'Poetry',
    description: 'interpret symbolism and extended metaphors',
  },
  {
    notation: 'IN.CBSE.C11.EN.PO.3',
    strand: 'Poetry',
    description: 'analyze sound devices: alliteration, assonance, onomatopoeia',
  },
  {
    notation: 'IN.CBSE.C11.EN.PO.4',
    strand: 'Poetry',
    description: 'write critical appreciation of poems',
  },
  {
    notation: 'IN.CBSE.C11.EN.PO.5',
    strand: 'Poetry',
    description: 'compare poets and poetic movements',
  },

  // LITERATURE - DRAMA
  {
    notation: 'IN.CBSE.C11.EN.DR.1',
    strand: 'Drama',
    description: 'analyze dramatic structure and conventions',
  },
  {
    notation: 'IN.CBSE.C11.EN.DR.2',
    strand: 'Drama',
    description: 'understand dramatic irony and foreshadowing',
  },
  {
    notation: 'IN.CBSE.C11.EN.DR.3',
    strand: 'Drama',
    description: 'analyze character development in plays',
  },
  {
    notation: 'IN.CBSE.C11.EN.DR.4',
    strand: 'Drama',
    description: 'understand the role of setting in drama',
  },

  // SUPPLEMENTARY READER
  {
    notation: 'IN.CBSE.C11.EN.LT.1',
    strand: 'Literature',
    description: 'analyze narrative techniques in supplementary texts',
  },
  {
    notation: 'IN.CBSE.C11.EN.LT.2',
    strand: 'Literature',
    description: 'write long answers connecting themes across texts',
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C11.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'participate in academic discussions and seminars',
  },
  {
    notation: 'IN.CBSE.C11.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'deliver persuasive speeches',
  },
  {
    notation: 'IN.CBSE.C11.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'present literary analyses orally',
  },
  {
    notation: 'IN.CBSE.C11.EN.LS.4',
    strand: 'Listening and Speaking',
    description: 'participate in mock interviews',
  }
];

// =============================================================================
// CLASS 12 (Ages 17-18)
// NCERT: Flamingo (Prose), Vistas (Supplementary)
// Senior Secondary Education - Board Examination Year
// =============================================================================

const class12Standards: CBSEEnglishStandard[] = [
  // READING COMPREHENSION
  {
    notation: 'IN.CBSE.C12.EN.RC.1',
    strand: 'Reading Comprehension',
    description: 'comprehend complex unseen passages with advanced vocabulary',
  },
  {
    notation: 'IN.CBSE.C12.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'analyze case-based integrated passages',
  },
  {
    notation: 'IN.CBSE.C12.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'evaluate arguments, evidence, and reasoning in texts',
  },
  {
    notation: 'IN.CBSE.C12.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'identify underlying assumptions and implications',
  },
  {
    notation: 'IN.CBSE.C12.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'summarize and create notes from complex texts',
  },
  {
    notation: 'IN.CBSE.C12.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'analyze literary and non-literary texts critically',
  },

  // WRITING - CREATIVE
  {
    notation: 'IN.CBSE.C12.EN.CW.1',
    strand: 'Creative Writing',
    description: 'write notices for various purposes and audiences',
  },
  {
    notation: 'IN.CBSE.C12.EN.CW.2',
    strand: 'Creative Writing',
    description: 'design advertisements for products and services',
  },
  {
    notation: 'IN.CBSE.C12.EN.CW.3',
    strand: 'Creative Writing',
    description: 'write invitations and replies with appropriate formats',
  },
  {
    notation: 'IN.CBSE.C12.EN.CW.4',
    strand: 'Creative Writing',
    description: 'write letters to editors on contemporary issues',
  },
  {
    notation: 'IN.CBSE.C12.EN.CW.5',
    strand: 'Creative Writing',
    description: 'write job applications with impressive cover letters',
  },
  {
    notation: 'IN.CBSE.C12.EN.CW.6',
    strand: 'Creative Writing',
    description: 'write articles presenting balanced viewpoints',
  },
  {
    notation: 'IN.CBSE.C12.EN.CW.7',
    strand: 'Creative Writing',
    description: 'write speeches for formal and informal occasions',
  },
  {
    notation: 'IN.CBSE.C12.EN.CW.8',
    strand: 'Creative Writing',
    description: 'write debates with logical arguments and evidence',
  },
  {
    notation: 'IN.CBSE.C12.EN.CW.9',
    strand: 'Creative Writing',
    description: 'write reports with proper format and content',
  },

  // WRITING - ACADEMIC
  {
    notation: 'IN.CBSE.C12.EN.AC.1',
    strand: 'Academic Writing',
    description: 'write thesis statements and topic sentences',
  },
  {
    notation: 'IN.CBSE.C12.EN.AC.2',
    strand: 'Academic Writing',
    description: 'use evidence and citations effectively',
  },
  {
    notation: 'IN.CBSE.C12.EN.AC.3',
    strand: 'Academic Writing',
    description: 'write coherent paragraphs with transitions',
  },
  {
    notation: 'IN.CBSE.C12.EN.AC.4',
    strand: 'Academic Writing',
    description: 'write research-based analytical essays',
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C12.EN.GR.1',
    strand: 'Grammar',
    description: 'master complex grammatical structures for board exams',
  },
  {
    notation: 'IN.CBSE.C12.EN.GR.2',
    strand: 'Grammar',
    description: 'apply gap-filling and editing techniques accurately',
  },
  {
    notation: 'IN.CBSE.C12.EN.GR.3',
    strand: 'Grammar',
    description: 'transform sentences with varied structures',
  },
  {
    notation: 'IN.CBSE.C12.EN.GR.4',
    strand: 'Grammar',
    description: 'use advanced clause structures effectively',
  },
  {
    notation: 'IN.CBSE.C12.EN.GR.5',
    strand: 'Grammar',
    description: 'edit paragraphs for grammatical errors systematically',
  },
  {
    notation: 'IN.CBSE.C12.EN.GR.6',
    strand: 'Grammar',
    description: 'rearrange sentences into coherent paragraphs',
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C12.EN.VC.1',
    strand: 'Vocabulary',
    description: 'use sophisticated vocabulary appropriate to context',
  },
  {
    notation: 'IN.CBSE.C12.EN.VC.2',
    strand: 'Vocabulary',
    description: 'understand and use literary and critical terminology',
  },
  {
    notation: 'IN.CBSE.C12.EN.VC.3',
    strand: 'Vocabulary',
    description: 'use precise language for nuanced expression',
  },

  // LITERATURE - PROSE
  {
    notation: 'IN.CBSE.C12.EN.PR.1',
    strand: 'Prose',
    description: 'analyze complex narrative structures and techniques',
  },
  {
    notation: 'IN.CBSE.C12.EN.PR.2',
    strand: 'Prose',
    description: 'understand symbolism and allegory in prose',
  },
  {
    notation: 'IN.CBSE.C12.EN.PR.3',
    strand: 'Prose',
    description: 'analyze themes of human experience: love, loss, identity',
  },
  {
    notation: 'IN.CBSE.C12.EN.PR.4',
    strand: 'Prose',
    description: 'write extract-based answers demonstrating comprehension',
  },
  {
    notation: 'IN.CBSE.C12.EN.PR.5',
    strand: 'Prose',
    description: 'write long answers with textual evidence',
  },
  {
    notation: 'IN.CBSE.C12.EN.PR.6',
    strand: 'Prose',
    description: 'analyze prose texts from diverse cultural perspectives',
  },

  // LITERATURE - POETRY
  {
    notation: 'IN.CBSE.C12.EN.PO.1',
    strand: 'Poetry',
    description: 'analyze complex poetic forms and structures',
  },
  {
    notation: 'IN.CBSE.C12.EN.PO.2',
    strand: 'Poetry',
    description: 'interpret layered meanings and ambiguity in poetry',
  },
  {
    notation: 'IN.CBSE.C12.EN.PO.3',
    strand: 'Poetry',
    description: 'analyze poet\'s use of imagery and sensory language',
  },
  {
    notation: 'IN.CBSE.C12.EN.PO.4',
    strand: 'Poetry',
    description: 'write extract-based answers on poems',
  },
  {
    notation: 'IN.CBSE.C12.EN.PO.5',
    strand: 'Poetry',
    description: 'write critical appreciation comparing multiple poems',
  },
  {
    notation: 'IN.CBSE.C12.EN.PO.6',
    strand: 'Poetry',
    description: 'understand historical and biographical context of poetry',
  },

  // SUPPLEMENTARY READER
  {
    notation: 'IN.CBSE.C12.EN.LT.1',
    strand: 'Literature',
    description: 'analyze themes and character development in supplementary texts',
  },
  {
    notation: 'IN.CBSE.C12.EN.LT.2',
    strand: 'Literature',
    description: 'write long answers on supplementary reader texts',
  },
  {
    notation: 'IN.CBSE.C12.EN.LT.3',
    strand: 'Literature',
    description: 'compare and contrast texts from different genres',
  },
  {
    notation: 'IN.CBSE.C12.EN.LT.4',
    strand: 'Literature',
    description: 'apply literary criticism approaches to texts',
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C12.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'deliver academic presentations with supporting materials',
  },
  {
    notation: 'IN.CBSE.C12.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'participate in formal discussions and symposiums',
  },
  {
    notation: 'IN.CBSE.C12.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'conduct and respond effectively in interviews',
  },
  {
    notation: 'IN.CBSE.C12.EN.LS.4',
    strand: 'Listening and Speaking',
    description: 'present literary critiques and analyses',
  }
];

// =============================================================================
// EXPORT CBSE ENGLISH CURRICULUM
// =============================================================================

export const cbseEnglishCurriculum: CBSEEnglishCurriculum = {
  code: 'INDIAN_CBSE',
  name: 'Central Board of Secondary Education',
  country: 'IN',
  version: '2024-25',
  sourceUrl: 'https://ncert.nic.in/textbook.php',
  subject: 'ENGLISH',
  classes: [
    { class: 1, ageRangeMin: 6, ageRangeMax: 7, standards: class1Standards },
    { class: 2, ageRangeMin: 7, ageRangeMax: 8, standards: class2Standards },
    { class: 3, ageRangeMin: 8, ageRangeMax: 9, standards: class3Standards },
    { class: 4, ageRangeMin: 9, ageRangeMax: 10, standards: class4Standards },
    { class: 5, ageRangeMin: 10, ageRangeMax: 11, standards: class5Standards },
    { class: 6, ageRangeMin: 11, ageRangeMax: 12, standards: class6Standards },
    { class: 7, ageRangeMin: 12, ageRangeMax: 13, standards: class7Standards },
    { class: 8, ageRangeMin: 13, ageRangeMax: 14, standards: class8Standards },
    { class: 9, ageRangeMin: 14, ageRangeMax: 15, standards: class9Standards },
    { class: 10, ageRangeMin: 15, ageRangeMax: 16, standards: class10Standards },
    { class: 11, ageRangeMin: 16, ageRangeMax: 17, standards: class11Standards },
    { class: 12, ageRangeMin: 17, ageRangeMax: 18, standards: class12Standards }
  ]
};

// Helper functions
export function getCBSEEnglishStandardsForClass(classNum: number): CBSEEnglishStandard[] {
  const classData = cbseEnglishCurriculum.classes.find(c => c.class === classNum);
  return classData?.standards || [];
}

export function getTotalCBSEEnglishStandardsCount(): number {
  return cbseEnglishCurriculum.classes.reduce(
    (sum, c) => sum + c.standards.length,
    0
  );
}

export default cbseEnglishCurriculum;
