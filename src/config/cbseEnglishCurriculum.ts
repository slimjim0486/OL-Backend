/**
 * CBSE (Central Board of Secondary Education) - English Standards
 * Classes 1-8 (Primary and Middle School)
 *
 * Source: NCERT Curriculum Framework and Textbooks
 * https://ncert.nic.in/textbook.php
 * https://cbseacademic.nic.in/curriculum.html
 *
 * Based on NCERT Marigold (Classes 1-5) and Honeysuckle/Honeydew (Classes 6-8)
 *
 * Notation System: IN.CBSE.C{class}.EN.{strand}.{number}
 * - IN = India
 * - CBSE = Central Board of Secondary Education
 * - C = Class (1-8)
 * - EN = English
 * - Strand codes:
 *   - RC = Reading Comprehension
 *   - WR = Writing
 *   - GR = Grammar
 *   - VC = Vocabulary
 *   - LS = Listening and Speaking
 *   - LT = Literature
 */

export interface CBSEEnglishStandard {
  notation: string;
  strand: string;
  description: string;
  chapter?: string; // NCERT chapter reference
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
    chapter: 'Alphabet Recognition'
  },
  {
    notation: 'IN.CBSE.C1.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'read simple three-letter words (CVC words)',
    chapter: 'Three-Letter Words'
  },
  {
    notation: 'IN.CBSE.C1.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'read simple sentences with familiar words',
    chapter: 'A Happy Child'
  },
  {
    notation: 'IN.CBSE.C1.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'identify the main idea of a simple story or poem',
    chapter: 'Three Little Pigs'
  },
  {
    notation: 'IN.CBSE.C1.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'read aloud with proper pronunciation',
    chapter: 'Marigold Unit 1'
  },

  // WRITING
  {
    notation: 'IN.CBSE.C1.EN.WR.1',
    strand: 'Writing',
    description: 'write capital and small letters of the alphabet',
    chapter: 'Letter Writing'
  },
  {
    notation: 'IN.CBSE.C1.EN.WR.2',
    strand: 'Writing',
    description: 'copy words and short sentences',
    chapter: 'Copywriting'
  },
  {
    notation: 'IN.CBSE.C1.EN.WR.3',
    strand: 'Writing',
    description: 'write simple three-letter words',
    chapter: 'Word Writing'
  },
  {
    notation: 'IN.CBSE.C1.EN.WR.4',
    strand: 'Writing',
    description: 'arrange words to form simple sentences',
    chapter: 'Sentence Building'
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C1.EN.GR.1',
    strand: 'Grammar',
    description: 'identify naming words (nouns) for people, animals, places, things',
    chapter: 'Naming Words'
  },
  {
    notation: 'IN.CBSE.C1.EN.GR.2',
    strand: 'Grammar',
    description: 'understand one and many (singular and plural)',
    chapter: 'One and Many'
  },
  {
    notation: 'IN.CBSE.C1.EN.GR.3',
    strand: 'Grammar',
    description: 'use is, am, are correctly in sentences',
    chapter: 'Helping Verbs'
  },
  {
    notation: 'IN.CBSE.C1.EN.GR.4',
    strand: 'Grammar',
    description: 'use this/that, these/those correctly',
    chapter: 'This and That'
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C1.EN.VC.1',
    strand: 'Vocabulary',
    description: 'learn names of common objects, animals, fruits, vegetables',
    chapter: 'Picture Dictionary'
  },
  {
    notation: 'IN.CBSE.C1.EN.VC.2',
    strand: 'Vocabulary',
    description: 'identify rhyming words',
    chapter: 'Rhyming Words'
  },
  {
    notation: 'IN.CBSE.C1.EN.VC.3',
    strand: 'Vocabulary',
    description: 'match words with pictures',
    chapter: 'Word Picture Match'
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C1.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'listen to and recite simple poems and rhymes',
    chapter: 'A Happy Child'
  },
  {
    notation: 'IN.CBSE.C1.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'introduce oneself using simple sentences',
    chapter: 'Self Introduction'
  },
  {
    notation: 'IN.CBSE.C1.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'follow simple instructions',
    chapter: 'Listening Activities'
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
    chapter: 'First Day at School'
  },
  {
    notation: 'IN.CBSE.C2.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'answer questions based on a passage',
    chapter: 'Haldi\'s Adventure'
  },
  {
    notation: 'IN.CBSE.C2.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'identify characters and setting in a story',
    chapter: 'I Am Lucky!'
  },
  {
    notation: 'IN.CBSE.C2.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'read and understand simple poems',
    chapter: 'On My Blackboard I Can Draw'
  },
  {
    notation: 'IN.CBSE.C2.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'sequence events in a story',
    chapter: 'I Want'
  },

  // WRITING
  {
    notation: 'IN.CBSE.C2.EN.WR.1',
    strand: 'Writing',
    description: 'write simple sentences about familiar topics',
    chapter: 'Sentence Writing'
  },
  {
    notation: 'IN.CBSE.C2.EN.WR.2',
    strand: 'Writing',
    description: 'write 3-4 sentences about pictures',
    chapter: 'Picture Composition'
  },
  {
    notation: 'IN.CBSE.C2.EN.WR.3',
    strand: 'Writing',
    description: 'fill in the blanks in sentences',
    chapter: 'Cloze Test'
  },
  {
    notation: 'IN.CBSE.C2.EN.WR.4',
    strand: 'Writing',
    description: 'complete a story with given hints',
    chapter: 'Story Completion'
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C2.EN.GR.1',
    strand: 'Grammar',
    description: 'identify action words (verbs)',
    chapter: 'Action Words'
  },
  {
    notation: 'IN.CBSE.C2.EN.GR.2',
    strand: 'Grammar',
    description: 'understand pronouns: he, she, it, they',
    chapter: 'Pronouns'
  },
  {
    notation: 'IN.CBSE.C2.EN.GR.3',
    strand: 'Grammar',
    description: 'form plurals by adding s, es',
    chapter: 'Making Plurals'
  },
  {
    notation: 'IN.CBSE.C2.EN.GR.4',
    strand: 'Grammar',
    description: 'use prepositions: in, on, under, behind, near',
    chapter: 'Prepositions'
  },
  {
    notation: 'IN.CBSE.C2.EN.GR.5',
    strand: 'Grammar',
    description: 'understand articles: a, an, the',
    chapter: 'Articles'
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C2.EN.VC.1',
    strand: 'Vocabulary',
    description: 'learn opposite words (antonyms)',
    chapter: 'Opposites'
  },
  {
    notation: 'IN.CBSE.C2.EN.VC.2',
    strand: 'Vocabulary',
    description: 'identify words with similar sounds',
    chapter: 'Phonics'
  },
  {
    notation: 'IN.CBSE.C2.EN.VC.3',
    strand: 'Vocabulary',
    description: 'group words into categories',
    chapter: 'Word Families'
  },
  {
    notation: 'IN.CBSE.C2.EN.VC.4',
    strand: 'Vocabulary',
    description: 'learn compound words',
    chapter: 'Compound Words'
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C2.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'listen to stories and retell main events',
    chapter: 'Story Time'
  },
  {
    notation: 'IN.CBSE.C2.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'participate in simple conversations',
    chapter: 'Conversation'
  },
  {
    notation: 'IN.CBSE.C2.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'describe objects using simple sentences',
    chapter: 'Describe and Tell'
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
    chapter: 'Good Morning'
  },
  {
    notation: 'IN.CBSE.C3.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'infer meaning from context',
    chapter: 'The Magic Garden'
  },
  {
    notation: 'IN.CBSE.C3.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'identify main idea and supporting details',
    chapter: 'Bird Talk'
  },
  {
    notation: 'IN.CBSE.C3.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'distinguish between fact and opinion',
    chapter: 'Nina and the Baby Sparrows'
  },
  {
    notation: 'IN.CBSE.C3.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'read and appreciate poetry: rhythm, rhyme',
    chapter: 'A Little Fish Story'
  },

  // WRITING
  {
    notation: 'IN.CBSE.C3.EN.WR.1',
    strand: 'Writing',
    description: 'write short paragraphs on given topics',
    chapter: 'Paragraph Writing'
  },
  {
    notation: 'IN.CBSE.C3.EN.WR.2',
    strand: 'Writing',
    description: 'write informal letters to friends and family',
    chapter: 'Letter Writing'
  },
  {
    notation: 'IN.CBSE.C3.EN.WR.3',
    strand: 'Writing',
    description: 'write diary entries',
    chapter: 'Diary Writing'
  },
  {
    notation: 'IN.CBSE.C3.EN.WR.4',
    strand: 'Writing',
    description: 'use punctuation marks: full stop, question mark, exclamation',
    chapter: 'Punctuation'
  },
  {
    notation: 'IN.CBSE.C3.EN.WR.5',
    strand: 'Writing',
    description: 'write a story with beginning, middle, end',
    chapter: 'Story Writing'
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C3.EN.GR.1',
    strand: 'Grammar',
    description: 'identify adjectives (describing words)',
    chapter: 'Describing Words'
  },
  {
    notation: 'IN.CBSE.C3.EN.GR.2',
    strand: 'Grammar',
    description: 'understand simple present tense',
    chapter: 'Present Tense'
  },
  {
    notation: 'IN.CBSE.C3.EN.GR.3',
    strand: 'Grammar',
    description: 'understand simple past tense',
    chapter: 'Past Tense'
  },
  {
    notation: 'IN.CBSE.C3.EN.GR.4',
    strand: 'Grammar',
    description: 'use conjunctions: and, but, or, because',
    chapter: 'Joining Words'
  },
  {
    notation: 'IN.CBSE.C3.EN.GR.5',
    strand: 'Grammar',
    description: 'form questions using question words: what, when, where, who, why, how',
    chapter: 'Question Words'
  },
  {
    notation: 'IN.CBSE.C3.EN.GR.6',
    strand: 'Grammar',
    description: 'understand irregular plurals',
    chapter: 'Irregular Plurals'
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C3.EN.VC.1',
    strand: 'Vocabulary',
    description: 'learn synonyms (similar meaning words)',
    chapter: 'Synonyms'
  },
  {
    notation: 'IN.CBSE.C3.EN.VC.2',
    strand: 'Vocabulary',
    description: 'understand homophones (same sound, different meaning)',
    chapter: 'Homophones'
  },
  {
    notation: 'IN.CBSE.C3.EN.VC.3',
    strand: 'Vocabulary',
    description: 'learn prefixes and suffixes',
    chapter: 'Word Building'
  },
  {
    notation: 'IN.CBSE.C3.EN.VC.4',
    strand: 'Vocabulary',
    description: 'use dictionary to find word meanings',
    chapter: 'Dictionary Skills'
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C3.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'recite poems with expression',
    chapter: 'Poem Recitation'
  },
  {
    notation: 'IN.CBSE.C3.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'participate in role play',
    chapter: 'Role Play'
  },
  {
    notation: 'IN.CBSE.C3.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'give short oral presentations',
    chapter: 'Show and Tell'
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
    chapter: 'Wake Up!'
  },
  {
    notation: 'IN.CBSE.C4.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'identify cause and effect in a text',
    chapter: 'Neha\'s Alarm Clock'
  },
  {
    notation: 'IN.CBSE.C4.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'make predictions while reading',
    chapter: 'The Little Fir Tree'
  },
  {
    notation: 'IN.CBSE.C4.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'summarize a story in own words',
    chapter: 'Nasruddin\'s Aim'
  },
  {
    notation: 'IN.CBSE.C4.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'understand figurative language in poems',
    chapter: 'Don\'t Be Afraid of the Dark'
  },
  {
    notation: 'IN.CBSE.C4.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'read non-fiction texts and extract information',
    chapter: 'Helen Keller'
  },

  // WRITING
  {
    notation: 'IN.CBSE.C4.EN.WR.1',
    strand: 'Writing',
    description: 'write longer paragraphs with topic sentence',
    chapter: 'Paragraph Development'
  },
  {
    notation: 'IN.CBSE.C4.EN.WR.2',
    strand: 'Writing',
    description: 'write descriptions of people, places, events',
    chapter: 'Descriptive Writing'
  },
  {
    notation: 'IN.CBSE.C4.EN.WR.3',
    strand: 'Writing',
    description: 'write notices and messages',
    chapter: 'Notice Writing'
  },
  {
    notation: 'IN.CBSE.C4.EN.WR.4',
    strand: 'Writing',
    description: 'write book reports',
    chapter: 'Book Report'
  },
  {
    notation: 'IN.CBSE.C4.EN.WR.5',
    strand: 'Writing',
    description: 'use dialogue in writing',
    chapter: 'Dialogue Writing'
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C4.EN.GR.1',
    strand: 'Grammar',
    description: 'understand adverbs (words that describe verbs)',
    chapter: 'Adverbs'
  },
  {
    notation: 'IN.CBSE.C4.EN.GR.2',
    strand: 'Grammar',
    description: 'use continuous tense (present and past)',
    chapter: 'Continuous Tense'
  },
  {
    notation: 'IN.CBSE.C4.EN.GR.3',
    strand: 'Grammar',
    description: 'understand simple future tense',
    chapter: 'Future Tense'
  },
  {
    notation: 'IN.CBSE.C4.EN.GR.4',
    strand: 'Grammar',
    description: 'use apostrophe for contractions and possession',
    chapter: 'Apostrophe'
  },
  {
    notation: 'IN.CBSE.C4.EN.GR.5',
    strand: 'Grammar',
    description: 'identify subject and predicate in sentences',
    chapter: 'Subject and Predicate'
  },
  {
    notation: 'IN.CBSE.C4.EN.GR.6',
    strand: 'Grammar',
    description: 'understand degrees of comparison',
    chapter: 'Comparison'
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C4.EN.VC.1',
    strand: 'Vocabulary',
    description: 'understand idioms and their meanings',
    chapter: 'Idioms'
  },
  {
    notation: 'IN.CBSE.C4.EN.VC.2',
    strand: 'Vocabulary',
    description: 'learn words with multiple meanings',
    chapter: 'Multiple Meanings'
  },
  {
    notation: 'IN.CBSE.C4.EN.VC.3',
    strand: 'Vocabulary',
    description: 'form new words using prefixes: un-, re-, dis-',
    chapter: 'Prefixes'
  },
  {
    notation: 'IN.CBSE.C4.EN.VC.4',
    strand: 'Vocabulary',
    description: 'form new words using suffixes: -ful, -less, -ly',
    chapter: 'Suffixes'
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C4.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'participate in group discussions',
    chapter: 'Group Discussion'
  },
  {
    notation: 'IN.CBSE.C4.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'give and follow multi-step instructions',
    chapter: 'Following Instructions'
  },
  {
    notation: 'IN.CBSE.C4.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'narrate personal experiences',
    chapter: 'Storytelling'
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
    chapter: 'Ice Cream Man'
  },
  {
    notation: 'IN.CBSE.C5.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'compare and contrast elements in different texts',
    chapter: 'Wonderful Waste!'
  },
  {
    notation: 'IN.CBSE.C5.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'identify theme and moral of a story',
    chapter: 'The Talkative Barber'
  },
  {
    notation: 'IN.CBSE.C5.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'understand author\'s purpose and point of view',
    chapter: 'Rip Van Winkle'
  },
  {
    notation: 'IN.CBSE.C5.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'draw conclusions from text evidence',
    chapter: 'The Little Bully'
  },
  {
    notation: 'IN.CBSE.C5.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'read and interpret graphs, charts, tables',
    chapter: 'My Elder Brother'
  },

  // WRITING
  {
    notation: 'IN.CBSE.C5.EN.WR.1',
    strand: 'Writing',
    description: 'write essays with introduction, body, and conclusion',
    chapter: 'Essay Writing'
  },
  {
    notation: 'IN.CBSE.C5.EN.WR.2',
    strand: 'Writing',
    description: 'write formal and informal letters',
    chapter: 'Letter Writing'
  },
  {
    notation: 'IN.CBSE.C5.EN.WR.3',
    strand: 'Writing',
    description: 'write summaries of passages',
    chapter: 'Summary Writing'
  },
  {
    notation: 'IN.CBSE.C5.EN.WR.4',
    strand: 'Writing',
    description: 'write creative stories with vivid descriptions',
    chapter: 'Creative Writing'
  },
  {
    notation: 'IN.CBSE.C5.EN.WR.5',
    strand: 'Writing',
    description: 'edit and revise written work',
    chapter: 'Editing'
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C5.EN.GR.1',
    strand: 'Grammar',
    description: 'understand perfect tenses (present, past)',
    chapter: 'Perfect Tense'
  },
  {
    notation: 'IN.CBSE.C5.EN.GR.2',
    strand: 'Grammar',
    description: 'identify types of sentences: declarative, interrogative, imperative, exclamatory',
    chapter: 'Types of Sentences'
  },
  {
    notation: 'IN.CBSE.C5.EN.GR.3',
    strand: 'Grammar',
    description: 'use active and passive voice',
    chapter: 'Active and Passive'
  },
  {
    notation: 'IN.CBSE.C5.EN.GR.4',
    strand: 'Grammar',
    description: 'use direct and indirect speech (basic)',
    chapter: 'Direct and Indirect Speech'
  },
  {
    notation: 'IN.CBSE.C5.EN.GR.5',
    strand: 'Grammar',
    description: 'identify clauses in complex sentences',
    chapter: 'Clauses'
  },
  {
    notation: 'IN.CBSE.C5.EN.GR.6',
    strand: 'Grammar',
    description: 'use modals: can, could, may, might, should, would',
    chapter: 'Modals'
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C5.EN.VC.1',
    strand: 'Vocabulary',
    description: 'learn proverbs and their meanings',
    chapter: 'Proverbs'
  },
  {
    notation: 'IN.CBSE.C5.EN.VC.2',
    strand: 'Vocabulary',
    description: 'understand similes and metaphors',
    chapter: 'Figures of Speech'
  },
  {
    notation: 'IN.CBSE.C5.EN.VC.3',
    strand: 'Vocabulary',
    description: 'learn common collocations',
    chapter: 'Collocations'
  },
  {
    notation: 'IN.CBSE.C5.EN.VC.4',
    strand: 'Vocabulary',
    description: 'expand vocabulary through word roots',
    chapter: 'Word Roots'
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C5.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'give prepared speeches on topics',
    chapter: 'Speech'
  },
  {
    notation: 'IN.CBSE.C5.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'participate in debates (basic)',
    chapter: 'Debate'
  },
  {
    notation: 'IN.CBSE.C5.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'conduct simple interviews',
    chapter: 'Interview Skills'
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
    chapter: 'Who Did Patrick\'s Homework?'
  },
  {
    notation: 'IN.CBSE.C6.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'analyze plot structure: exposition, rising action, climax, resolution',
    chapter: 'How the Dog Found Himself a New Master!'
  },
  {
    notation: 'IN.CBSE.C6.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'identify literary devices in poems',
    chapter: 'A House, A Home'
  },
  {
    notation: 'IN.CBSE.C6.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'make inferences and draw conclusions',
    chapter: 'Taro\'s Reward'
  },
  {
    notation: 'IN.CBSE.C6.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'understand context clues to determine word meaning',
    chapter: 'An Indian-American Woman in Space'
  },
  {
    notation: 'IN.CBSE.C6.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'read and appreciate different forms of poetry',
    chapter: 'The Kite'
  },

  // LITERATURE
  {
    notation: 'IN.CBSE.C6.EN.LT.1',
    strand: 'Literature',
    description: 'understand elements of short stories',
    chapter: 'A Different Kind of School'
  },
  {
    notation: 'IN.CBSE.C6.EN.LT.2',
    strand: 'Literature',
    description: 'appreciate biographical narratives',
    chapter: 'The Shepherd\'s Treasure'
  },
  {
    notation: 'IN.CBSE.C6.EN.LT.3',
    strand: 'Literature',
    description: 'understand poetry: imagery, symbolism',
    chapter: 'Beauty'
  },

  // WRITING
  {
    notation: 'IN.CBSE.C6.EN.WR.1',
    strand: 'Writing',
    description: 'write formal letters: application, complaint',
    chapter: 'Formal Letter'
  },
  {
    notation: 'IN.CBSE.C6.EN.WR.2',
    strand: 'Writing',
    description: 'write diary entries expressing thoughts and feelings',
    chapter: 'Diary Entry'
  },
  {
    notation: 'IN.CBSE.C6.EN.WR.3',
    strand: 'Writing',
    description: 'write narrative essays',
    chapter: 'Narrative Writing'
  },
  {
    notation: 'IN.CBSE.C6.EN.WR.4',
    strand: 'Writing',
    description: 'write descriptive paragraphs with sensory details',
    chapter: 'Descriptive Writing'
  },
  {
    notation: 'IN.CBSE.C6.EN.WR.5',
    strand: 'Writing',
    description: 'write messages and notes',
    chapter: 'Message Writing'
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C6.EN.GR.1',
    strand: 'Grammar',
    description: 'understand all tenses in detail',
    chapter: 'Tenses'
  },
  {
    notation: 'IN.CBSE.C6.EN.GR.2',
    strand: 'Grammar',
    description: 'identify and use determiners',
    chapter: 'Determiners'
  },
  {
    notation: 'IN.CBSE.C6.EN.GR.3',
    strand: 'Grammar',
    description: 'understand subject-verb agreement',
    chapter: 'Subject-Verb Agreement'
  },
  {
    notation: 'IN.CBSE.C6.EN.GR.4',
    strand: 'Grammar',
    description: 'use phrases and clauses effectively',
    chapter: 'Phrases and Clauses'
  },
  {
    notation: 'IN.CBSE.C6.EN.GR.5',
    strand: 'Grammar',
    description: 'transform sentences: affirmative/negative, simple/complex',
    chapter: 'Sentence Transformation'
  },
  {
    notation: 'IN.CBSE.C6.EN.GR.6',
    strand: 'Grammar',
    description: 'use relative pronouns: who, which, that',
    chapter: 'Relative Pronouns'
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C6.EN.VC.1',
    strand: 'Vocabulary',
    description: 'understand homonyms and homographs',
    chapter: 'Word Study'
  },
  {
    notation: 'IN.CBSE.C6.EN.VC.2',
    strand: 'Vocabulary',
    description: 'learn common phrasal verbs',
    chapter: 'Phrasal Verbs'
  },
  {
    notation: 'IN.CBSE.C6.EN.VC.3',
    strand: 'Vocabulary',
    description: 'understand connotation and denotation',
    chapter: 'Word Meanings'
  },
  {
    notation: 'IN.CBSE.C6.EN.VC.4',
    strand: 'Vocabulary',
    description: 'use contextual vocabulary from texts',
    chapter: 'Vocabulary Building'
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C6.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'participate in extempore speaking',
    chapter: 'Extempore'
  },
  {
    notation: 'IN.CBSE.C6.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'present oral summaries of texts read',
    chapter: 'Oral Presentation'
  },
  {
    notation: 'IN.CBSE.C6.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'listen to audio/video clips and answer questions',
    chapter: 'Listening Comprehension'
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
    chapter: 'Three Questions'
  },
  {
    notation: 'IN.CBSE.C7.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'evaluate arguments and evidence in text',
    chapter: 'A Gift of Chappals'
  },
  {
    notation: 'IN.CBSE.C7.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'understand cultural context in literature',
    chapter: 'Gopal and the Hilsa Fish'
  },
  {
    notation: 'IN.CBSE.C7.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'analyze poetic forms and structures',
    chapter: 'The Rebel'
  },
  {
    notation: 'IN.CBSE.C7.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'synthesize information from multiple sources',
    chapter: 'Expert Detectives'
  },
  {
    notation: 'IN.CBSE.C7.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'identify bias and perspective in texts',
    chapter: 'The Invention of Vita-Wonk'
  },

  // LITERATURE
  {
    notation: 'IN.CBSE.C7.EN.LT.1',
    strand: 'Literature',
    description: 'analyze character development across a narrative',
    chapter: 'Quality'
  },
  {
    notation: 'IN.CBSE.C7.EN.LT.2',
    strand: 'Literature',
    description: 'understand dramatic irony and situational irony',
    chapter: 'A Bicycle in Good Repair'
  },
  {
    notation: 'IN.CBSE.C7.EN.LT.3',
    strand: 'Literature',
    description: 'appreciate humor and satire in literature',
    chapter: 'The Story of Cricket'
  },

  // WRITING
  {
    notation: 'IN.CBSE.C7.EN.WR.1',
    strand: 'Writing',
    description: 'write formal and informal emails',
    chapter: 'Email Writing'
  },
  {
    notation: 'IN.CBSE.C7.EN.WR.2',
    strand: 'Writing',
    description: 'write newspaper articles and reports',
    chapter: 'Report Writing'
  },
  {
    notation: 'IN.CBSE.C7.EN.WR.3',
    strand: 'Writing',
    description: 'write argumentative essays',
    chapter: 'Argumentative Writing'
  },
  {
    notation: 'IN.CBSE.C7.EN.WR.4',
    strand: 'Writing',
    description: 'write bio-sketches',
    chapter: 'Bio-Sketch'
  },
  {
    notation: 'IN.CBSE.C7.EN.WR.5',
    strand: 'Writing',
    description: 'write advertisements',
    chapter: 'Advertisement Writing'
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C7.EN.GR.1',
    strand: 'Grammar',
    description: 'use complex sentences with multiple clauses',
    chapter: 'Complex Sentences'
  },
  {
    notation: 'IN.CBSE.C7.EN.GR.2',
    strand: 'Grammar',
    description: 'understand conditional sentences',
    chapter: 'Conditionals'
  },
  {
    notation: 'IN.CBSE.C7.EN.GR.3',
    strand: 'Grammar',
    description: 'convert active voice to passive voice and vice versa',
    chapter: 'Voice'
  },
  {
    notation: 'IN.CBSE.C7.EN.GR.4',
    strand: 'Grammar',
    description: 'convert direct speech to indirect speech',
    chapter: 'Reported Speech'
  },
  {
    notation: 'IN.CBSE.C7.EN.GR.5',
    strand: 'Grammar',
    description: 'use non-finite verbs: infinitives, gerunds, participles',
    chapter: 'Non-finites'
  },
  {
    notation: 'IN.CBSE.C7.EN.GR.6',
    strand: 'Grammar',
    description: 'understand concord (agreement) in sentences',
    chapter: 'Concord'
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C7.EN.VC.1',
    strand: 'Vocabulary',
    description: 'understand literary vocabulary from texts',
    chapter: 'Literary Terms'
  },
  {
    notation: 'IN.CBSE.C7.EN.VC.2',
    strand: 'Vocabulary',
    description: 'learn one-word substitutions',
    chapter: 'One Word Substitution'
  },
  {
    notation: 'IN.CBSE.C7.EN.VC.3',
    strand: 'Vocabulary',
    description: 'understand analogies and word relationships',
    chapter: 'Analogies'
  },
  {
    notation: 'IN.CBSE.C7.EN.VC.4',
    strand: 'Vocabulary',
    description: 'expand academic vocabulary',
    chapter: 'Academic Words'
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C7.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'participate in formal debates',
    chapter: 'Debate'
  },
  {
    notation: 'IN.CBSE.C7.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'deliver persuasive speeches',
    chapter: 'Persuasive Speaking'
  },
  {
    notation: 'IN.CBSE.C7.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'conduct and participate in mock interviews',
    chapter: 'Interview'
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
    chapter: 'The Best Christmas Present in the World'
  },
  {
    notation: 'IN.CBSE.C8.EN.RC.2',
    strand: 'Reading Comprehension',
    description: 'compare texts from different genres',
    chapter: 'The Tsunami'
  },
  {
    notation: 'IN.CBSE.C8.EN.RC.3',
    strand: 'Reading Comprehension',
    description: 'understand implicit meaning and subtext',
    chapter: 'Glimpses of the Past'
  },
  {
    notation: 'IN.CBSE.C8.EN.RC.4',
    strand: 'Reading Comprehension',
    description: 'analyze narrative perspective and voice',
    chapter: 'Bepin Choudhury\'s Lapse of Memory'
  },
  {
    notation: 'IN.CBSE.C8.EN.RC.5',
    strand: 'Reading Comprehension',
    description: 'evaluate effectiveness of literary techniques',
    chapter: 'The Summit Within'
  },
  {
    notation: 'IN.CBSE.C8.EN.RC.6',
    strand: 'Reading Comprehension',
    description: 'interpret poetry: tone, mood, symbolism',
    chapter: 'The Ant and the Cricket'
  },

  // LITERATURE
  {
    notation: 'IN.CBSE.C8.EN.LT.1',
    strand: 'Literature',
    description: 'understand historical fiction and its elements',
    chapter: 'This Is Jody\'s Fawn'
  },
  {
    notation: 'IN.CBSE.C8.EN.LT.2',
    strand: 'Literature',
    description: 'analyze social commentary in literature',
    chapter: 'A Visit to Cambridge'
  },
  {
    notation: 'IN.CBSE.C8.EN.LT.3',
    strand: 'Literature',
    description: 'understand play format and dialogue',
    chapter: 'A Short Monsoon Diary'
  },
  {
    notation: 'IN.CBSE.C8.EN.LT.4',
    strand: 'Literature',
    description: 'appreciate science fiction as a genre',
    chapter: 'The Great Stone Face'
  },

  // WRITING
  {
    notation: 'IN.CBSE.C8.EN.WR.1',
    strand: 'Writing',
    description: 'write analytical essays with thesis and evidence',
    chapter: 'Analytical Writing'
  },
  {
    notation: 'IN.CBSE.C8.EN.WR.2',
    strand: 'Writing',
    description: 'write speeches for various occasions',
    chapter: 'Speech Writing'
  },
  {
    notation: 'IN.CBSE.C8.EN.WR.3',
    strand: 'Writing',
    description: 'write short stories with plot development',
    chapter: 'Story Writing'
  },
  {
    notation: 'IN.CBSE.C8.EN.WR.4',
    strand: 'Writing',
    description: 'write business letters and formal communication',
    chapter: 'Business Writing'
  },
  {
    notation: 'IN.CBSE.C8.EN.WR.5',
    strand: 'Writing',
    description: 'write factual descriptions and processes',
    chapter: 'Factual Description'
  },
  {
    notation: 'IN.CBSE.C8.EN.WR.6',
    strand: 'Writing',
    description: 'write reviews of books, films, events',
    chapter: 'Review Writing'
  },

  // GRAMMAR
  {
    notation: 'IN.CBSE.C8.EN.GR.1',
    strand: 'Grammar',
    description: 'master all aspects of reported speech',
    chapter: 'Reported Speech Advanced'
  },
  {
    notation: 'IN.CBSE.C8.EN.GR.2',
    strand: 'Grammar',
    description: 'understand mood in sentences: indicative, imperative, subjunctive',
    chapter: 'Mood'
  },
  {
    notation: 'IN.CBSE.C8.EN.GR.3',
    strand: 'Grammar',
    description: 'use complex passive constructions',
    chapter: 'Advanced Passive Voice'
  },
  {
    notation: 'IN.CBSE.C8.EN.GR.4',
    strand: 'Grammar',
    description: 'identify and correct common grammatical errors',
    chapter: 'Error Correction'
  },
  {
    notation: 'IN.CBSE.C8.EN.GR.5',
    strand: 'Grammar',
    description: 'use parallel structure in writing',
    chapter: 'Parallelism'
  },
  {
    notation: 'IN.CBSE.C8.EN.GR.6',
    strand: 'Grammar',
    description: 'understand sentence variety for effect',
    chapter: 'Sentence Variety'
  },
  {
    notation: 'IN.CBSE.C8.EN.GR.7',
    strand: 'Grammar',
    description: 'use punctuation effectively: semicolons, colons, dashes',
    chapter: 'Advanced Punctuation'
  },

  // VOCABULARY
  {
    notation: 'IN.CBSE.C8.EN.VC.1',
    strand: 'Vocabulary',
    description: 'understand etymology and word origins',
    chapter: 'Etymology'
  },
  {
    notation: 'IN.CBSE.C8.EN.VC.2',
    strand: 'Vocabulary',
    description: 'learn foreign words and phrases used in English',
    chapter: 'Foreign Words'
  },
  {
    notation: 'IN.CBSE.C8.EN.VC.3',
    strand: 'Vocabulary',
    description: 'understand technical and specialized vocabulary',
    chapter: 'Technical Terms'
  },
  {
    notation: 'IN.CBSE.C8.EN.VC.4',
    strand: 'Vocabulary',
    description: 'develop strong academic vocabulary for writing',
    chapter: 'Academic Vocabulary'
  },
  {
    notation: 'IN.CBSE.C8.EN.VC.5',
    strand: 'Vocabulary',
    description: 'understand and use formal register appropriately',
    chapter: 'Register'
  },

  // LISTENING AND SPEAKING
  {
    notation: 'IN.CBSE.C8.EN.LS.1',
    strand: 'Listening and Speaking',
    description: 'participate in panel discussions',
    chapter: 'Panel Discussion'
  },
  {
    notation: 'IN.CBSE.C8.EN.LS.2',
    strand: 'Listening and Speaking',
    description: 'deliver formal presentations with visual aids',
    chapter: 'Formal Presentation'
  },
  {
    notation: 'IN.CBSE.C8.EN.LS.3',
    strand: 'Listening and Speaking',
    description: 'participate in Model United Nations style discussions',
    chapter: 'MUN'
  },
  {
    notation: 'IN.CBSE.C8.EN.LS.4',
    strand: 'Listening and Speaking',
    description: 'analyze and respond to audio-visual media',
    chapter: 'Media Analysis'
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
    { class: 8, ageRangeMin: 13, ageRangeMax: 14, standards: class8Standards }
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
