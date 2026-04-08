/**
 * ICSE (Indian Certificate of Secondary Education) - English Standards
 * Classes 1-12 (Primary through Senior Secondary)
 *
 * These are skill-based learning objectives aligned with the CISCE curriculum
 * framework. ICSE is an English-medium board so English is the primary
 * language of instruction and assessment.
 *
 * Structure:
 *   Classes 1-8: Foundational English (reading, writing, grammar, vocabulary,
 *     listening and speaking, literature)
 *   Classes 9-10 (ICSE): Two papers — English Language (Paper 1) and
 *     Literature in English (Paper 2)
 *   Classes 11-12 (ISC): English Core (compulsory) — Paper 1 (Language)
 *     and Paper 2 (Literature in English)
 *
 * Sourcing:
 *   Classes 1-8: Selina, Frank, and Gulmohar CISCE-aligned primary English
 *     textbooks (the de facto ICSE primary curriculum).
 *   Classes 9-10: CISCE ICSE 2028 English syllabus
 *     https://cisce.org/wp-content/uploads/2026/01/2.-English.pdf
 *   Classes 11-12: CISCE ISC 2028 English syllabus (801).
 *
 * Notation System: IN.ICSE.C{class}.EN.{strand}.{number}
 * - Strand codes:
 *   - RC = Reading Comprehension
 *   - WR = Writing
 *   - GR = Grammar
 *   - VC = Vocabulary
 *   - LS = Listening and Speaking
 *   - LT = Literature
 *   - CW = Creative Writing (senior classes)
 *   - AC = Academic Writing (senior classes)
 */

export interface ICSEEnglishStandard {
  notation: string;
  strand: string;
  description: string;
  chapter?: string;
}

export interface ICSEEnglishClass {
  class: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: ICSEEnglishStandard[];
}

export interface ICSEEnglishCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  classes: ICSEEnglishClass[];
}

// =============================================================================
// CLASS 1 (Ages 6-7)
// =============================================================================

const class1Standards: ICSEEnglishStandard[] = [
  // READING COMPREHENSION
  { notation: 'IN.ICSE.C1.EN.RC.1', strand: 'Reading Comprehension', description: 'recognize and name all capital and small letters of the alphabet' },
  { notation: 'IN.ICSE.C1.EN.RC.2', strand: 'Reading Comprehension', description: 'blend phonemes to read simple three-letter consonant-vowel-consonant words' },
  { notation: 'IN.ICSE.C1.EN.RC.3', strand: 'Reading Comprehension', description: 'read simple sentences with sight words and familiar vocabulary' },
  { notation: 'IN.ICSE.C1.EN.RC.4', strand: 'Reading Comprehension', description: 'identify the main character and setting of a simple story' },
  { notation: 'IN.ICSE.C1.EN.RC.5', strand: 'Reading Comprehension', description: 'answer simple questions about a read-aloud text' },

  // WRITING
  { notation: 'IN.ICSE.C1.EN.WR.1', strand: 'Writing', description: 'write capital and small letters with proper formation' },
  { notation: 'IN.ICSE.C1.EN.WR.2', strand: 'Writing', description: 'copy words, phrases, and simple sentences correctly' },
  { notation: 'IN.ICSE.C1.EN.WR.3', strand: 'Writing', description: 'write simple three- and four-letter words from dictation' },
  { notation: 'IN.ICSE.C1.EN.WR.4', strand: 'Writing', description: 'arrange words to form simple sentences with capital letter and full stop' },

  // GRAMMAR
  { notation: 'IN.ICSE.C1.EN.GR.1', strand: 'Grammar', description: 'identify naming words (nouns) for people, animals, places, and things' },
  { notation: 'IN.ICSE.C1.EN.GR.2', strand: 'Grammar', description: 'identify action words (verbs) in simple sentences' },
  { notation: 'IN.ICSE.C1.EN.GR.3', strand: 'Grammar', description: 'use a, an, and the correctly with common nouns' },
  { notation: 'IN.ICSE.C1.EN.GR.4', strand: 'Grammar', description: 'distinguish between singular and plural forms of common nouns' },
  { notation: 'IN.ICSE.C1.EN.GR.5', strand: 'Grammar', description: 'use pronouns I, he, she, it, we, they' },
  { notation: 'IN.ICSE.C1.EN.GR.6', strand: 'Grammar', description: 'identify describing words (adjectives) for size, colour, and shape' },

  // VOCABULARY
  { notation: 'IN.ICSE.C1.EN.VC.1', strand: 'Vocabulary', description: 'identify opposites for simple everyday words' },
  { notation: 'IN.ICSE.C1.EN.VC.2', strand: 'Vocabulary', description: 'name common words for family members, body parts, and colours' },
  { notation: 'IN.ICSE.C1.EN.VC.3', strand: 'Vocabulary', description: 'identify rhyming words' },

  // LISTENING AND SPEAKING
  { notation: 'IN.ICSE.C1.EN.LS.1', strand: 'Listening and Speaking', description: 'listen attentively to stories, rhymes, and instructions' },
  { notation: 'IN.ICSE.C1.EN.LS.2', strand: 'Listening and Speaking', description: 'recite short poems and nursery rhymes with rhythm' },
  { notation: 'IN.ICSE.C1.EN.LS.3', strand: 'Listening and Speaking', description: 'introduce self using simple sentences' },
  { notation: 'IN.ICSE.C1.EN.LS.4', strand: 'Listening and Speaking', description: 'use polite expressions: please, thank you, sorry, excuse me' },

  // LITERATURE
  { notation: 'IN.ICSE.C1.EN.LT.1', strand: 'Literature', description: 'enjoy and retell simple stories, rhymes, and poems' },
  { notation: 'IN.ICSE.C1.EN.LT.2', strand: 'Literature', description: 'identify characters in picture storybooks' }
];

// =============================================================================
// CLASS 2 (Ages 7-8)
// =============================================================================

const class2Standards: ICSEEnglishStandard[] = [
  { notation: 'IN.ICSE.C2.EN.RC.1', strand: 'Reading Comprehension', description: 'read short passages with familiar vocabulary and answer simple questions' },
  { notation: 'IN.ICSE.C2.EN.RC.2', strand: 'Reading Comprehension', description: 'identify characters, setting, and main events of a simple story' },
  { notation: 'IN.ICSE.C2.EN.RC.3', strand: 'Reading Comprehension', description: 'read aloud with proper pronunciation and expression' },
  { notation: 'IN.ICSE.C2.EN.RC.4', strand: 'Reading Comprehension', description: 'use picture clues to understand unfamiliar words' },
  { notation: 'IN.ICSE.C2.EN.RC.5', strand: 'Reading Comprehension', description: 'sequence events in a simple story' },
  { notation: 'IN.ICSE.C2.EN.WR.1', strand: 'Writing', description: 'write simple sentences about oneself, family, and daily activities' },
  { notation: 'IN.ICSE.C2.EN.WR.2', strand: 'Writing', description: 'write short paragraphs on familiar topics' },
  { notation: 'IN.ICSE.C2.EN.WR.3', strand: 'Writing', description: 'use capital letters for names, the first word of a sentence, and the word I' },
  { notation: 'IN.ICSE.C2.EN.WR.4', strand: 'Writing', description: 'use appropriate punctuation: full stops, question marks, and exclamation marks' },
  { notation: 'IN.ICSE.C2.EN.GR.1', strand: 'Grammar', description: 'identify common and proper nouns' },
  { notation: 'IN.ICSE.C2.EN.GR.2', strand: 'Grammar', description: 'form singular and plural forms of nouns' },
  { notation: 'IN.ICSE.C2.EN.GR.3', strand: 'Grammar', description: 'use personal pronouns and possessive pronouns' },
  { notation: 'IN.ICSE.C2.EN.GR.4', strand: 'Grammar', description: 'use simple present tense verbs' },
  { notation: 'IN.ICSE.C2.EN.GR.5', strand: 'Grammar', description: 'use simple past tense of common regular verbs' },
  { notation: 'IN.ICSE.C2.EN.GR.6', strand: 'Grammar', description: 'use describing words (adjectives) in sentences' },
  { notation: 'IN.ICSE.C2.EN.GR.7', strand: 'Grammar', description: 'use prepositions of place: in, on, under, above, behind' },
  { notation: 'IN.ICSE.C2.EN.VC.1', strand: 'Vocabulary', description: 'identify synonyms for simple everyday words' },
  { notation: 'IN.ICSE.C2.EN.VC.2', strand: 'Vocabulary', description: 'identify antonyms (opposites) of common words' },
  { notation: 'IN.ICSE.C2.EN.VC.3', strand: 'Vocabulary', description: 'identify words related by category (animals, food, clothing)' },
  { notation: 'IN.ICSE.C2.EN.LS.1', strand: 'Listening and Speaking', description: 'follow two-step oral instructions' },
  { notation: 'IN.ICSE.C2.EN.LS.2', strand: 'Listening and Speaking', description: 'participate in simple conversations on familiar topics' },
  { notation: 'IN.ICSE.C2.EN.LS.3', strand: 'Listening and Speaking', description: 'ask and answer simple wh-questions' },
  { notation: 'IN.ICSE.C2.EN.LT.1', strand: 'Literature', description: 'recite poems with rhythm and appropriate expression' },
  { notation: 'IN.ICSE.C2.EN.LT.2', strand: 'Literature', description: 'retell simple stories in sequence' }
];

// =============================================================================
// CLASS 3 (Ages 8-9)
// =============================================================================

const class3Standards: ICSEEnglishStandard[] = [
  { notation: 'IN.ICSE.C3.EN.RC.1', strand: 'Reading Comprehension', description: 'read age-appropriate texts with fluency and comprehension' },
  { notation: 'IN.ICSE.C3.EN.RC.2', strand: 'Reading Comprehension', description: 'identify main idea and supporting details in a passage' },
  { notation: 'IN.ICSE.C3.EN.RC.3', strand: 'Reading Comprehension', description: 'make simple inferences from stories and poems' },
  { notation: 'IN.ICSE.C3.EN.RC.4', strand: 'Reading Comprehension', description: 'distinguish between fiction and non-fiction texts' },
  { notation: 'IN.ICSE.C3.EN.RC.5', strand: 'Reading Comprehension', description: 'answer comprehension questions in complete sentences' },
  { notation: 'IN.ICSE.C3.EN.WR.1', strand: 'Writing', description: 'write paragraphs with topic sentences on familiar topics' },
  { notation: 'IN.ICSE.C3.EN.WR.2', strand: 'Writing', description: 'write simple informal letters to friends and family' },
  { notation: 'IN.ICSE.C3.EN.WR.3', strand: 'Writing', description: 'write simple stories with beginning, middle, and end' },
  { notation: 'IN.ICSE.C3.EN.WR.4', strand: 'Writing', description: 'write descriptions of people, places, and objects' },
  { notation: 'IN.ICSE.C3.EN.GR.1', strand: 'Grammar', description: 'identify kinds of nouns: proper, common, collective, material' },
  { notation: 'IN.ICSE.C3.EN.GR.2', strand: 'Grammar', description: 'identify gender of nouns: masculine, feminine, neuter, common' },
  { notation: 'IN.ICSE.C3.EN.GR.3', strand: 'Grammar', description: 'use subject and object pronouns correctly' },
  { notation: 'IN.ICSE.C3.EN.GR.4', strand: 'Grammar', description: 'use simple present, simple past, and simple future tenses' },
  { notation: 'IN.ICSE.C3.EN.GR.5', strand: 'Grammar', description: 'use adverbs of time, place, and manner' },
  { notation: 'IN.ICSE.C3.EN.GR.6', strand: 'Grammar', description: 'use articles a, an, the with appropriate nouns' },
  { notation: 'IN.ICSE.C3.EN.GR.7', strand: 'Grammar', description: 'use coordinating conjunctions: and, but, or' },
  { notation: 'IN.ICSE.C3.EN.VC.1', strand: 'Vocabulary', description: 'identify compound words and form new ones' },
  { notation: 'IN.ICSE.C3.EN.VC.2', strand: 'Vocabulary', description: 'understand homophones: sound-alike words with different meanings' },
  { notation: 'IN.ICSE.C3.EN.VC.3', strand: 'Vocabulary', description: 'identify common prefixes and suffixes' },
  { notation: 'IN.ICSE.C3.EN.LS.1', strand: 'Listening and Speaking', description: 'listen to and summarise oral information' },
  { notation: 'IN.ICSE.C3.EN.LS.2', strand: 'Listening and Speaking', description: 'speak clearly on familiar topics for one to two minutes' },
  { notation: 'IN.ICSE.C3.EN.LS.3', strand: 'Listening and Speaking', description: 'participate in group discussions respectfully' },
  { notation: 'IN.ICSE.C3.EN.LT.1', strand: 'Literature', description: 'identify rhyme and rhythm in poems' },
  { notation: 'IN.ICSE.C3.EN.LT.2', strand: 'Literature', description: 'discuss characters and themes in simple stories' }
];

// =============================================================================
// CLASS 4 (Ages 9-10)
// =============================================================================

const class4Standards: ICSEEnglishStandard[] = [
  { notation: 'IN.ICSE.C4.EN.RC.1', strand: 'Reading Comprehension', description: 'read longer passages fluently with comprehension' },
  { notation: 'IN.ICSE.C4.EN.RC.2', strand: 'Reading Comprehension', description: 'identify main idea, supporting details, and author\'s purpose' },
  { notation: 'IN.ICSE.C4.EN.RC.3', strand: 'Reading Comprehension', description: 'make inferences and draw conclusions from texts' },
  { notation: 'IN.ICSE.C4.EN.RC.4', strand: 'Reading Comprehension', description: 'identify cause and effect relationships in stories' },
  { notation: 'IN.ICSE.C4.EN.RC.5', strand: 'Reading Comprehension', description: 'compare and contrast characters and events' },
  { notation: 'IN.ICSE.C4.EN.RC.6', strand: 'Reading Comprehension', description: 'use context clues to determine meaning of unfamiliar words' },
  { notation: 'IN.ICSE.C4.EN.WR.1', strand: 'Writing', description: 'write descriptive paragraphs with sensory details' },
  { notation: 'IN.ICSE.C4.EN.WR.2', strand: 'Writing', description: 'write narrative stories with clear plot structure' },
  { notation: 'IN.ICSE.C4.EN.WR.3', strand: 'Writing', description: 'write informal letters including addressing, greeting, and closing' },
  { notation: 'IN.ICSE.C4.EN.WR.4', strand: 'Writing', description: 'write simple notices and messages' },
  { notation: 'IN.ICSE.C4.EN.WR.5', strand: 'Writing', description: 'apply spelling rules and use a dictionary' },
  { notation: 'IN.ICSE.C4.EN.GR.1', strand: 'Grammar', description: 'identify subject and predicate in sentences' },
  { notation: 'IN.ICSE.C4.EN.GR.2', strand: 'Grammar', description: 'classify sentences as declarative, interrogative, imperative, exclamatory' },
  { notation: 'IN.ICSE.C4.EN.GR.3', strand: 'Grammar', description: 'use present, past, and future continuous tenses' },
  { notation: 'IN.ICSE.C4.EN.GR.4', strand: 'Grammar', description: 'identify degrees of comparison of adjectives' },
  { notation: 'IN.ICSE.C4.EN.GR.5', strand: 'Grammar', description: 'use prepositions of time, place, and direction' },
  { notation: 'IN.ICSE.C4.EN.GR.6', strand: 'Grammar', description: 'identify and use helping verbs: is, am, are, was, were, has, have, had' },
  { notation: 'IN.ICSE.C4.EN.GR.7', strand: 'Grammar', description: 'change sentences from statement to question form' },
  { notation: 'IN.ICSE.C4.EN.VC.1', strand: 'Vocabulary', description: 'identify and use synonyms and antonyms in writing' },
  { notation: 'IN.ICSE.C4.EN.VC.2', strand: 'Vocabulary', description: 'use idioms and simple phrases in context' },
  { notation: 'IN.ICSE.C4.EN.VC.3', strand: 'Vocabulary', description: 'identify root words and their derivatives' },
  { notation: 'IN.ICSE.C4.EN.LS.1', strand: 'Listening and Speaking', description: 'listen to and respond to different types of oral texts' },
  { notation: 'IN.ICSE.C4.EN.LS.2', strand: 'Listening and Speaking', description: 'deliver short prepared presentations on familiar topics' },
  { notation: 'IN.ICSE.C4.EN.LS.3', strand: 'Listening and Speaking', description: 'use appropriate tone and volume in various situations' },
  { notation: 'IN.ICSE.C4.EN.LT.1', strand: 'Literature', description: 'identify figurative language: simile and metaphor' },
  { notation: 'IN.ICSE.C4.EN.LT.2', strand: 'Literature', description: 'analyze simple poems for theme and feeling' }
];

// =============================================================================
// CLASS 5 (Ages 10-11)
// =============================================================================

const class5Standards: ICSEEnglishStandard[] = [
  { notation: 'IN.ICSE.C5.EN.RC.1', strand: 'Reading Comprehension', description: 'read a variety of texts including stories, poems, and informational texts' },
  { notation: 'IN.ICSE.C5.EN.RC.2', strand: 'Reading Comprehension', description: 'identify main idea, supporting details, and organizational patterns' },
  { notation: 'IN.ICSE.C5.EN.RC.3', strand: 'Reading Comprehension', description: 'make inferences about character motivations and feelings' },
  { notation: 'IN.ICSE.C5.EN.RC.4', strand: 'Reading Comprehension', description: 'identify text features: titles, headings, captions, glossary' },
  { notation: 'IN.ICSE.C5.EN.RC.5', strand: 'Reading Comprehension', description: 'summarise main points from a text' },
  { notation: 'IN.ICSE.C5.EN.WR.1', strand: 'Writing', description: 'write well-structured paragraphs with clear topic sentences' },
  { notation: 'IN.ICSE.C5.EN.WR.2', strand: 'Writing', description: 'write narrative, descriptive, and expository paragraphs' },
  { notation: 'IN.ICSE.C5.EN.WR.3', strand: 'Writing', description: 'write formal and informal letters in proper format' },
  { notation: 'IN.ICSE.C5.EN.WR.4', strand: 'Writing', description: 'write diary entries and book reviews' },
  { notation: 'IN.ICSE.C5.EN.WR.5', strand: 'Writing', description: 'apply editing skills for spelling, grammar, and punctuation' },
  { notation: 'IN.ICSE.C5.EN.GR.1', strand: 'Grammar', description: 'identify kinds of sentences: simple, compound, complex' },
  { notation: 'IN.ICSE.C5.EN.GR.2', strand: 'Grammar', description: 'use perfect tenses: present perfect and past perfect' },
  { notation: 'IN.ICSE.C5.EN.GR.3', strand: 'Grammar', description: 'identify subject-verb agreement rules' },
  { notation: 'IN.ICSE.C5.EN.GR.4', strand: 'Grammar', description: 'identify kinds of adverbs and their placement' },
  { notation: 'IN.ICSE.C5.EN.GR.5', strand: 'Grammar', description: 'use subordinating conjunctions: because, although, if, when' },
  { notation: 'IN.ICSE.C5.EN.GR.6', strand: 'Grammar', description: 'use direct and indirect speech' },
  { notation: 'IN.ICSE.C5.EN.GR.7', strand: 'Grammar', description: 'change active to passive voice in simple sentences' },
  { notation: 'IN.ICSE.C5.EN.VC.1', strand: 'Vocabulary', description: 'identify homographs and homonyms' },
  { notation: 'IN.ICSE.C5.EN.VC.2', strand: 'Vocabulary', description: 'use common idioms, phrases, and proverbs' },
  { notation: 'IN.ICSE.C5.EN.VC.3', strand: 'Vocabulary', description: 'use prefixes and suffixes to form new words' },
  { notation: 'IN.ICSE.C5.EN.LS.1', strand: 'Listening and Speaking', description: 'listen critically and respond to different speakers' },
  { notation: 'IN.ICSE.C5.EN.LS.2', strand: 'Listening and Speaking', description: 'present information clearly and coherently to a group' },
  { notation: 'IN.ICSE.C5.EN.LS.3', strand: 'Listening and Speaking', description: 'participate in debates and group discussions' },
  { notation: 'IN.ICSE.C5.EN.LT.1', strand: 'Literature', description: 'identify literary devices: rhyme, rhythm, simile, metaphor' },
  { notation: 'IN.ICSE.C5.EN.LT.2', strand: 'Literature', description: 'analyze character development and plot in stories' }
];

// =============================================================================
// CLASS 6 (Ages 11-12)
// =============================================================================

const class6Standards: ICSEEnglishStandard[] = [
  { notation: 'IN.ICSE.C6.EN.RC.1', strand: 'Reading Comprehension', description: 'read and comprehend age-appropriate prose, poetry, and informational texts' },
  { notation: 'IN.ICSE.C6.EN.RC.2', strand: 'Reading Comprehension', description: 'identify explicit and implicit information in texts' },
  { notation: 'IN.ICSE.C6.EN.RC.3', strand: 'Reading Comprehension', description: 'summarise texts in original words' },
  { notation: 'IN.ICSE.C6.EN.RC.4', strand: 'Reading Comprehension', description: 'analyze author\'s tone and mood' },
  { notation: 'IN.ICSE.C6.EN.WR.1', strand: 'Writing', description: 'write descriptive, narrative, and expository essays of 150-200 words' },
  { notation: 'IN.ICSE.C6.EN.WR.2', strand: 'Writing', description: 'write formal letters including applications and requests' },
  { notation: 'IN.ICSE.C6.EN.WR.3', strand: 'Writing', description: 'write notices, messages, and short reports' },
  { notation: 'IN.ICSE.C6.EN.WR.4', strand: 'Writing', description: 'write dialogues between two or more characters' },
  { notation: 'IN.ICSE.C6.EN.GR.1', strand: 'Grammar', description: 'use all twelve tenses appropriately' },
  { notation: 'IN.ICSE.C6.EN.GR.2', strand: 'Grammar', description: 'change sentences between active and passive voice' },
  { notation: 'IN.ICSE.C6.EN.GR.3', strand: 'Grammar', description: 'change sentences between direct and indirect speech' },
  { notation: 'IN.ICSE.C6.EN.GR.4', strand: 'Grammar', description: 'use modal auxiliaries: can, could, may, might, will, would, shall, should, must' },
  { notation: 'IN.ICSE.C6.EN.GR.5', strand: 'Grammar', description: 'identify phrases and clauses in sentences' },
  { notation: 'IN.ICSE.C6.EN.GR.6', strand: 'Grammar', description: 'use punctuation marks correctly including apostrophes and quotation marks' },
  { notation: 'IN.ICSE.C6.EN.VC.1', strand: 'Vocabulary', description: 'understand shades of meaning among related words' },
  { notation: 'IN.ICSE.C6.EN.VC.2', strand: 'Vocabulary', description: 'use context clues effectively to determine meaning' },
  { notation: 'IN.ICSE.C6.EN.VC.3', strand: 'Vocabulary', description: 'use idiomatic expressions and proverbs in writing' },
  { notation: 'IN.ICSE.C6.EN.LS.1', strand: 'Listening and Speaking', description: 'listen actively and take notes from oral presentations' },
  { notation: 'IN.ICSE.C6.EN.LS.2', strand: 'Listening and Speaking', description: 'deliver prepared speeches on assigned topics' },
  { notation: 'IN.ICSE.C6.EN.LT.1', strand: 'Literature', description: 'identify themes and main ideas in prose and poetry' },
  { notation: 'IN.ICSE.C6.EN.LT.2', strand: 'Literature', description: 'analyze characters and their development' },
  { notation: 'IN.ICSE.C6.EN.LT.3', strand: 'Literature', description: 'identify literary devices: personification, alliteration, onomatopoeia' }
];

// =============================================================================
// CLASS 7 (Ages 12-13)
// =============================================================================

const class7Standards: ICSEEnglishStandard[] = [
  { notation: 'IN.ICSE.C7.EN.RC.1', strand: 'Reading Comprehension', description: 'read and comprehend complex texts including classics and contemporary works' },
  { notation: 'IN.ICSE.C7.EN.RC.2', strand: 'Reading Comprehension', description: 'analyze text structure and organization' },
  { notation: 'IN.ICSE.C7.EN.RC.3', strand: 'Reading Comprehension', description: 'make inferences supported by textual evidence' },
  { notation: 'IN.ICSE.C7.EN.RC.4', strand: 'Reading Comprehension', description: 'evaluate credibility of sources and author\'s point of view' },
  { notation: 'IN.ICSE.C7.EN.WR.1', strand: 'Writing', description: 'write well-organized essays of 200-250 words on varied topics' },
  { notation: 'IN.ICSE.C7.EN.WR.2', strand: 'Writing', description: 'write formal letters including complaints and enquiries' },
  { notation: 'IN.ICSE.C7.EN.WR.3', strand: 'Writing', description: 'write news reports and articles' },
  { notation: 'IN.ICSE.C7.EN.WR.4', strand: 'Writing', description: 'write biographies and autobiographies' },
  { notation: 'IN.ICSE.C7.EN.WR.5', strand: 'Writing', description: 'apply editing and proofreading strategies' },
  { notation: 'IN.ICSE.C7.EN.GR.1', strand: 'Grammar', description: 'identify kinds of clauses: main, subordinate, and relative' },
  { notation: 'IN.ICSE.C7.EN.GR.2', strand: 'Grammar', description: 'use participles and infinitives in sentences' },
  { notation: 'IN.ICSE.C7.EN.GR.3', strand: 'Grammar', description: 'use conditional sentences: zero, first, second, and third' },
  { notation: 'IN.ICSE.C7.EN.GR.4', strand: 'Grammar', description: 'use determiners: articles, quantifiers, demonstratives, possessives' },
  { notation: 'IN.ICSE.C7.EN.GR.5', strand: 'Grammar', description: 'identify and correct common grammatical errors' },
  { notation: 'IN.ICSE.C7.EN.VC.1', strand: 'Vocabulary', description: 'develop vocabulary through reading and word study' },
  { notation: 'IN.ICSE.C7.EN.VC.2', strand: 'Vocabulary', description: 'use figurative language and idioms appropriately' },
  { notation: 'IN.ICSE.C7.EN.VC.3', strand: 'Vocabulary', description: 'identify connotations and denotations of words' },
  { notation: 'IN.ICSE.C7.EN.LS.1', strand: 'Listening and Speaking', description: 'listen critically and evaluate oral arguments' },
  { notation: 'IN.ICSE.C7.EN.LS.2', strand: 'Listening and Speaking', description: 'participate in structured debates on relevant issues' },
  { notation: 'IN.ICSE.C7.EN.LT.1', strand: 'Literature', description: 'analyze prose for theme, plot, characterisation, and setting' },
  { notation: 'IN.ICSE.C7.EN.LT.2', strand: 'Literature', description: 'analyze poems for form, structure, and literary devices' },
  { notation: 'IN.ICSE.C7.EN.LT.3', strand: 'Literature', description: 'compare works by different authors on similar themes' }
];

// =============================================================================
// CLASS 8 (Ages 13-14)
// =============================================================================

const class8Standards: ICSEEnglishStandard[] = [
  { notation: 'IN.ICSE.C8.EN.RC.1', strand: 'Reading Comprehension', description: 'comprehend and analyze a wide variety of literary and informational texts' },
  { notation: 'IN.ICSE.C8.EN.RC.2', strand: 'Reading Comprehension', description: 'identify central ideas and analyze their development over a text' },
  { notation: 'IN.ICSE.C8.EN.RC.3', strand: 'Reading Comprehension', description: 'evaluate author\'s claims and reasoning with textual evidence' },
  { notation: 'IN.ICSE.C8.EN.RC.4', strand: 'Reading Comprehension', description: 'determine meaning of words and phrases including figurative and connotative meanings' },
  { notation: 'IN.ICSE.C8.EN.WR.1', strand: 'Writing', description: 'write multi-paragraph essays of 250-300 words in various forms' },
  { notation: 'IN.ICSE.C8.EN.WR.2', strand: 'Writing', description: 'write persuasive essays with clear thesis and supporting arguments' },
  { notation: 'IN.ICSE.C8.EN.WR.3', strand: 'Writing', description: 'write formal letters to editors, authorities, and organizations' },
  { notation: 'IN.ICSE.C8.EN.WR.4', strand: 'Writing', description: 'write reports on surveys, events, and experiments' },
  { notation: 'IN.ICSE.C8.EN.WR.5', strand: 'Writing', description: 'apply conventions of standard written English' },
  { notation: 'IN.ICSE.C8.EN.GR.1', strand: 'Grammar', description: 'use complex and compound-complex sentence structures' },
  { notation: 'IN.ICSE.C8.EN.GR.2', strand: 'Grammar', description: 'use gerunds, participles, and infinitives correctly' },
  { notation: 'IN.ICSE.C8.EN.GR.3', strand: 'Grammar', description: 'apply all tense forms in context' },
  { notation: 'IN.ICSE.C8.EN.GR.4', strand: 'Grammar', description: 'use passive voice appropriately in different contexts' },
  { notation: 'IN.ICSE.C8.EN.GR.5', strand: 'Grammar', description: 'use reported speech including commands, requests, and questions' },
  { notation: 'IN.ICSE.C8.EN.VC.1', strand: 'Vocabulary', description: 'use academic vocabulary appropriately' },
  { notation: 'IN.ICSE.C8.EN.VC.2', strand: 'Vocabulary', description: 'use figures of speech to enhance writing' },
  { notation: 'IN.ICSE.C8.EN.VC.3', strand: 'Vocabulary', description: 'apply knowledge of word origins and etymology' },
  { notation: 'IN.ICSE.C8.EN.LS.1', strand: 'Listening and Speaking', description: 'demonstrate active listening skills in various contexts' },
  { notation: 'IN.ICSE.C8.EN.LS.2', strand: 'Listening and Speaking', description: 'deliver formal presentations using visual aids' },
  { notation: 'IN.ICSE.C8.EN.LT.1', strand: 'Literature', description: 'analyze the role of setting and context in literature' },
  { notation: 'IN.ICSE.C8.EN.LT.2', strand: 'Literature', description: 'compare themes across different cultures and time periods' },
  { notation: 'IN.ICSE.C8.EN.LT.3', strand: 'Literature', description: 'identify and explain symbols and their significance' }
];

// =============================================================================
// CLASS 9 (Ages 14-15) - ICSE English
// Source: CISCE ICSE 2028 English syllabus
// =============================================================================

const class9Standards: ICSEEnglishStandard[] = [
  // READING COMPREHENSION
  { notation: 'IN.ICSE.C9.EN.RC.1', strand: 'Reading Comprehension', description: 'read and understand a variety of literary, informational, and functional texts' },
  { notation: 'IN.ICSE.C9.EN.RC.2', strand: 'Reading Comprehension', description: 'identify the central idea and supporting details in a passage' },
  { notation: 'IN.ICSE.C9.EN.RC.3', strand: 'Reading Comprehension', description: 'draw inferences and conclusions from explicit and implicit information' },
  { notation: 'IN.ICSE.C9.EN.RC.4', strand: 'Reading Comprehension', description: 'analyze how authors use word choice and sentence structure for effect' },
  { notation: 'IN.ICSE.C9.EN.RC.5', strand: 'Reading Comprehension', description: 'summarise a passage accurately in own words' },

  // WRITING
  { notation: 'IN.ICSE.C9.EN.WR.1', strand: 'Writing - Composition', description: 'write compositions in descriptive, narrative, reflective, and argumentative forms' },
  { notation: 'IN.ICSE.C9.EN.WR.2', strand: 'Writing - Composition', description: 'organize ideas coherently with clear paragraphing' },
  { notation: 'IN.ICSE.C9.EN.WR.3', strand: 'Writing - Composition', description: 'use appropriate vocabulary and varied sentence structure' },
  { notation: 'IN.ICSE.C9.EN.WR.4', strand: 'Writing - Letters', description: 'write formal letters: applications, complaints, enquiries, orders' },
  { notation: 'IN.ICSE.C9.EN.WR.5', strand: 'Writing - Letters', description: 'write informal letters to friends and family with appropriate tone' },
  { notation: 'IN.ICSE.C9.EN.WR.6', strand: 'Writing - Notice and Email', description: 'write notices, messages, and emails in prescribed formats' },

  // GRAMMAR
  { notation: 'IN.ICSE.C9.EN.GR.1', strand: 'Grammar', description: 'identify and correctly use parts of speech in context' },
  { notation: 'IN.ICSE.C9.EN.GR.2', strand: 'Grammar', description: 'apply all tense forms appropriately' },
  { notation: 'IN.ICSE.C9.EN.GR.3', strand: 'Grammar', description: 'change sentences between active and passive voice' },
  { notation: 'IN.ICSE.C9.EN.GR.4', strand: 'Grammar', description: 'change sentences between direct and reported speech' },
  { notation: 'IN.ICSE.C9.EN.GR.5', strand: 'Grammar', description: 'apply subject-verb agreement and pronoun-antecedent agreement' },
  { notation: 'IN.ICSE.C9.EN.GR.6', strand: 'Grammar', description: 'combine sentences using relative clauses and participles' },
  { notation: 'IN.ICSE.C9.EN.GR.7', strand: 'Grammar', description: 'transform sentences: affirmative to negative, assertive to interrogative' },
  { notation: 'IN.ICSE.C9.EN.GR.8', strand: 'Grammar', description: 'use prepositions, conjunctions, and determiners accurately' },

  // VOCABULARY
  { notation: 'IN.ICSE.C9.EN.VC.1', strand: 'Vocabulary', description: 'use synonyms, antonyms, and homophones in context' },
  { notation: 'IN.ICSE.C9.EN.VC.2', strand: 'Vocabulary', description: 'interpret and use idiomatic expressions and phrasal verbs' },
  { notation: 'IN.ICSE.C9.EN.VC.3', strand: 'Vocabulary', description: 'identify and apply roots, prefixes, and suffixes to expand vocabulary' },

  // LITERATURE (English Paper 2)
  { notation: 'IN.ICSE.C9.EN.LT.1', strand: 'Literature - Drama', description: 'analyze characters, plot, and themes in prescribed dramatic text' },
  { notation: 'IN.ICSE.C9.EN.LT.2', strand: 'Literature - Drama', description: 'identify dramatic techniques: dialogue, soliloquy, dramatic irony' },
  { notation: 'IN.ICSE.C9.EN.LT.3', strand: 'Literature - Prose', description: 'analyze short stories for theme, character, and setting' },
  { notation: 'IN.ICSE.C9.EN.LT.4', strand: 'Literature - Prose', description: 'interpret author\'s purpose and message in prose texts' },
  { notation: 'IN.ICSE.C9.EN.LT.5', strand: 'Literature - Poetry', description: 'analyze prescribed poems for meaning, mood, and poetic devices' },
  { notation: 'IN.ICSE.C9.EN.LT.6', strand: 'Literature - Poetry', description: 'identify and explain metaphors, similes, imagery, and symbolism' },
  { notation: 'IN.ICSE.C9.EN.LT.7', strand: 'Literature', description: 'support literary interpretations with evidence from the text' },

  // LISTENING AND SPEAKING
  { notation: 'IN.ICSE.C9.EN.LS.1', strand: 'Listening and Speaking', description: 'listen to and evaluate oral arguments and presentations' },
  { notation: 'IN.ICSE.C9.EN.LS.2', strand: 'Listening and Speaking', description: 'deliver oral presentations with clarity and appropriate body language' },
  { notation: 'IN.ICSE.C9.EN.LS.3', strand: 'Listening and Speaking', description: 'participate in group discussions and debates on current issues' }
];

// =============================================================================
// CLASS 10 (Ages 15-16) - ICSE English (Board Examination)
// =============================================================================

const class10Standards: ICSEEnglishStandard[] = [
  // READING COMPREHENSION
  { notation: 'IN.ICSE.C10.EN.RC.1', strand: 'Reading Comprehension', description: 'comprehend unseen passages of prose and poetry with depth' },
  { notation: 'IN.ICSE.C10.EN.RC.2', strand: 'Reading Comprehension', description: 'identify main idea, supporting details, and author\'s purpose' },
  { notation: 'IN.ICSE.C10.EN.RC.3', strand: 'Reading Comprehension', description: 'analyze text organization and rhetorical structure' },
  { notation: 'IN.ICSE.C10.EN.RC.4', strand: 'Reading Comprehension', description: 'distinguish between fact and opinion, inference and interpretation' },
  { notation: 'IN.ICSE.C10.EN.RC.5', strand: 'Reading Comprehension', description: 'summarise passages in own words within a word limit' },

  // WRITING - COMPOSITION
  { notation: 'IN.ICSE.C10.EN.WR.1', strand: 'Writing - Composition', description: 'write a composition of 300-350 words in chosen form: descriptive, narrative, reflective, argumentative' },
  { notation: 'IN.ICSE.C10.EN.WR.2', strand: 'Writing - Composition', description: 'develop a clear thesis and support with relevant details' },
  { notation: 'IN.ICSE.C10.EN.WR.3', strand: 'Writing - Composition', description: 'maintain consistent tone and style throughout a composition' },
  { notation: 'IN.ICSE.C10.EN.WR.4', strand: 'Writing - Composition', description: 'use varied sentence structures and precise vocabulary' },
  { notation: 'IN.ICSE.C10.EN.WR.5', strand: 'Writing - Letters', description: 'write formal letters with correct format, tone, and purpose' },
  { notation: 'IN.ICSE.C10.EN.WR.6', strand: 'Writing - Letters', description: 'write informal letters with appropriate register' },
  { notation: 'IN.ICSE.C10.EN.WR.7', strand: 'Writing - Email and Notice', description: 'write notices, emails, and messages in standard formats' },
  { notation: 'IN.ICSE.C10.EN.WR.8', strand: 'Writing - Email and Notice', description: 'write articles and reports for newspapers or magazines' },

  // GRAMMAR
  { notation: 'IN.ICSE.C10.EN.GR.1', strand: 'Grammar', description: 'complete passages by filling in blanks with appropriate words' },
  { notation: 'IN.ICSE.C10.EN.GR.2', strand: 'Grammar', description: 'transform sentences using various grammatical structures' },
  { notation: 'IN.ICSE.C10.EN.GR.3', strand: 'Grammar', description: 'convert sentences from active to passive and vice versa' },
  { notation: 'IN.ICSE.C10.EN.GR.4', strand: 'Grammar', description: 'convert sentences from direct to indirect speech and vice versa' },
  { notation: 'IN.ICSE.C10.EN.GR.5', strand: 'Grammar', description: 'combine simple sentences into compound or complex sentences' },
  { notation: 'IN.ICSE.C10.EN.GR.6', strand: 'Grammar', description: 'identify and correct errors in given sentences' },
  { notation: 'IN.ICSE.C10.EN.GR.7', strand: 'Grammar', description: 'apply subject-verb agreement and tense consistency' },

  // VOCABULARY
  { notation: 'IN.ICSE.C10.EN.VC.1', strand: 'Vocabulary', description: 'use words appropriately according to context' },
  { notation: 'IN.ICSE.C10.EN.VC.2', strand: 'Vocabulary', description: 'differentiate between confusing word pairs' },
  { notation: 'IN.ICSE.C10.EN.VC.3', strand: 'Vocabulary', description: 'use figurative language and idioms appropriately' },

  // LITERATURE (English Paper 2)
  { notation: 'IN.ICSE.C10.EN.LT.1', strand: 'Literature - Drama', description: 'analyze Shakespearean or modern drama prescribed for study' },
  { notation: 'IN.ICSE.C10.EN.LT.2', strand: 'Literature - Drama', description: 'examine dramatic structure: exposition, rising action, climax, resolution' },
  { notation: 'IN.ICSE.C10.EN.LT.3', strand: 'Literature - Drama', description: 'analyze character motivations, conflicts, and transformations' },
  { notation: 'IN.ICSE.C10.EN.LT.4', strand: 'Literature - Drama', description: 'interpret themes and relevance of dramatic works' },
  { notation: 'IN.ICSE.C10.EN.LT.5', strand: 'Literature - Prose', description: 'analyze short stories for narrative technique and point of view' },
  { notation: 'IN.ICSE.C10.EN.LT.6', strand: 'Literature - Prose', description: 'interpret themes, symbolism, and author\'s message in prose' },
  { notation: 'IN.ICSE.C10.EN.LT.7', strand: 'Literature - Poetry', description: 'analyze prescribed poems for form, structure, and meaning' },
  { notation: 'IN.ICSE.C10.EN.LT.8', strand: 'Literature - Poetry', description: 'identify poetic devices: imagery, metaphor, alliteration, assonance, enjambment' },
  { notation: 'IN.ICSE.C10.EN.LT.9', strand: 'Literature - Poetry', description: 'explain the poet\'s message and tone with textual evidence' },
  { notation: 'IN.ICSE.C10.EN.LT.10', strand: 'Literature', description: 'write critical appreciations and character sketches' },
  { notation: 'IN.ICSE.C10.EN.LT.11', strand: 'Literature', description: 'support literary analysis with specific quotations and references' },

  // LISTENING AND SPEAKING
  { notation: 'IN.ICSE.C10.EN.LS.1', strand: 'Listening and Speaking', description: 'deliver prepared and impromptu oral presentations confidently' },
  { notation: 'IN.ICSE.C10.EN.LS.2', strand: 'Listening and Speaking', description: 'engage in analytical discussions and formal debates' }
];

// =============================================================================
// CLASS 11 (Ages 16-17) - ISC English Core
// =============================================================================

const class11Standards: ICSEEnglishStandard[] = [
  { notation: 'IN.ICSE.C11.EN.RC.1', strand: 'Reading Comprehension', description: 'comprehend and analyze complex literary and non-literary texts' },
  { notation: 'IN.ICSE.C11.EN.RC.2', strand: 'Reading Comprehension', description: 'identify main arguments, supporting evidence, and logical progression' },
  { notation: 'IN.ICSE.C11.EN.RC.3', strand: 'Reading Comprehension', description: 'evaluate credibility, bias, and author\'s intent' },
  { notation: 'IN.ICSE.C11.EN.RC.4', strand: 'Reading Comprehension', description: 'summarise and paraphrase complex passages accurately' },
  { notation: 'IN.ICSE.C11.EN.CW.1', strand: 'Creative Writing', description: 'write well-crafted compositions in various forms: narrative, descriptive, reflective' },
  { notation: 'IN.ICSE.C11.EN.CW.2', strand: 'Creative Writing', description: 'develop original voice and style in writing' },
  { notation: 'IN.ICSE.C11.EN.AC.1', strand: 'Academic Writing', description: 'write argumentative and analytical essays with clear thesis statements' },
  { notation: 'IN.ICSE.C11.EN.AC.2', strand: 'Academic Writing', description: 'use citations and references appropriately' },
  { notation: 'IN.ICSE.C11.EN.AC.3', strand: 'Academic Writing', description: 'write reports, summaries, and précis' },
  { notation: 'IN.ICSE.C11.EN.AC.4', strand: 'Academic Writing', description: 'write formal letters and official communications' },
  { notation: 'IN.ICSE.C11.EN.AC.5', strand: 'Academic Writing', description: 'apply editing and revision strategies' },
  { notation: 'IN.ICSE.C11.EN.GR.1', strand: 'Grammar and Usage', description: 'demonstrate mastery of complex grammatical structures' },
  { notation: 'IN.ICSE.C11.EN.GR.2', strand: 'Grammar and Usage', description: 'use parallel structure and coordination effectively' },
  { notation: 'IN.ICSE.C11.EN.GR.3', strand: 'Grammar and Usage', description: 'apply punctuation for clarity and emphasis' },
  { notation: 'IN.ICSE.C11.EN.VC.1', strand: 'Vocabulary', description: 'use advanced academic and literary vocabulary' },
  { notation: 'IN.ICSE.C11.EN.VC.2', strand: 'Vocabulary', description: 'distinguish between denotation and connotation' },
  { notation: 'IN.ICSE.C11.EN.LT.1', strand: 'Literature - Prose', description: 'analyze prescribed prose works for style, theme, and narrative technique' },
  { notation: 'IN.ICSE.C11.EN.LT.2', strand: 'Literature - Poetry', description: 'analyze prescribed poetry for form, meter, imagery, and meaning' },
  { notation: 'IN.ICSE.C11.EN.LT.3', strand: 'Literature - Poetry', description: 'identify schools of poetry and historical context' },
  { notation: 'IN.ICSE.C11.EN.LT.4', strand: 'Literature - Drama', description: 'analyze prescribed dramatic works for structure, character, and theme' },
  { notation: 'IN.ICSE.C11.EN.LT.5', strand: 'Literature', description: 'compare and contrast works by different authors or periods' },
  { notation: 'IN.ICSE.C11.EN.LT.6', strand: 'Literature', description: 'evaluate literary works in historical and cultural contexts' },
  { notation: 'IN.ICSE.C11.EN.LT.7', strand: 'Literature', description: 'support literary analysis with precise textual evidence' },
  { notation: 'IN.ICSE.C11.EN.LS.1', strand: 'Listening and Speaking', description: 'deliver formal presentations on analytical topics' },
  { notation: 'IN.ICSE.C11.EN.LS.2', strand: 'Listening and Speaking', description: 'engage in critical discussions on literary and contemporary issues' }
];

// =============================================================================
// CLASS 12 (Ages 17-18) - ISC English Core (Board Examination)
// =============================================================================

const class12Standards: ICSEEnglishStandard[] = [
  { notation: 'IN.ICSE.C12.EN.RC.1', strand: 'Reading Comprehension', description: 'analyze complex unseen passages with critical depth' },
  { notation: 'IN.ICSE.C12.EN.RC.2', strand: 'Reading Comprehension', description: 'evaluate the effectiveness of author\'s arguments and rhetorical choices' },
  { notation: 'IN.ICSE.C12.EN.RC.3', strand: 'Reading Comprehension', description: 'synthesize information from multiple sources' },
  { notation: 'IN.ICSE.C12.EN.RC.4', strand: 'Reading Comprehension', description: 'distinguish between explicit and implicit meaning' },
  { notation: 'IN.ICSE.C12.EN.CW.1', strand: 'Creative Writing', description: 'write sophisticated compositions with clear purpose and audience' },
  { notation: 'IN.ICSE.C12.EN.CW.2', strand: 'Creative Writing', description: 'develop ideas with coherence, logical progression, and original insight' },
  { notation: 'IN.ICSE.C12.EN.CW.3', strand: 'Creative Writing', description: 'demonstrate control of tone, diction, and style' },
  { notation: 'IN.ICSE.C12.EN.AC.1', strand: 'Academic Writing', description: 'write extended analytical and argumentative essays' },
  { notation: 'IN.ICSE.C12.EN.AC.2', strand: 'Academic Writing', description: 'write critical appreciations of literary texts' },
  { notation: 'IN.ICSE.C12.EN.AC.3', strand: 'Academic Writing', description: 'write formal reports, proposals, and reviews' },
  { notation: 'IN.ICSE.C12.EN.AC.4', strand: 'Academic Writing', description: 'apply revision and editing for clarity, concision, and accuracy' },
  { notation: 'IN.ICSE.C12.EN.GR.1', strand: 'Grammar and Usage', description: 'demonstrate sophisticated command of grammar in writing' },
  { notation: 'IN.ICSE.C12.EN.GR.2', strand: 'Grammar and Usage', description: 'use varied sentence structures for rhetorical effect' },
  { notation: 'IN.ICSE.C12.EN.VC.1', strand: 'Vocabulary', description: 'use precise and varied vocabulary appropriate to context' },
  { notation: 'IN.ICSE.C12.EN.VC.2', strand: 'Vocabulary', description: 'employ figurative language and literary devices in writing' },
  { notation: 'IN.ICSE.C12.EN.LT.1', strand: 'Literature - Prose', description: 'critically analyze prescribed prose with attention to theme, form, and context' },
  { notation: 'IN.ICSE.C12.EN.LT.2', strand: 'Literature - Prose', description: 'analyze narrative technique, point of view, and characterization' },
  { notation: 'IN.ICSE.C12.EN.LT.3', strand: 'Literature - Poetry', description: 'critically analyze prescribed poetry with attention to form, structure, and meaning' },
  { notation: 'IN.ICSE.C12.EN.LT.4', strand: 'Literature - Poetry', description: 'identify and analyze the effect of poetic devices' },
  { notation: 'IN.ICSE.C12.EN.LT.5', strand: 'Literature - Drama', description: 'critically analyze prescribed dramatic works including Shakespeare' },
  { notation: 'IN.ICSE.C12.EN.LT.6', strand: 'Literature - Drama', description: 'examine dramatic structure, character development, and thematic concerns' },
  { notation: 'IN.ICSE.C12.EN.LT.7', strand: 'Literature', description: 'write sustained critical responses supported by textual evidence' },
  { notation: 'IN.ICSE.C12.EN.LT.8', strand: 'Literature', description: 'relate literary works to their historical, cultural, and philosophical contexts' },
  { notation: 'IN.ICSE.C12.EN.LT.9', strand: 'Literature', description: 'evaluate literary works from multiple critical perspectives' },
  { notation: 'IN.ICSE.C12.EN.LS.1', strand: 'Listening and Speaking', description: 'deliver persuasive and analytical oral presentations' },
  { notation: 'IN.ICSE.C12.EN.LS.2', strand: 'Listening and Speaking', description: 'participate in formal discussions with critical rigor' }
];

// =============================================================================
// EXPORT
// =============================================================================

export const icseEnglishCurriculum: ICSEEnglishCurriculum = {
  code: 'INDIAN_ICSE',
  name: 'Indian Certificate of Secondary Education (CISCE)',
  country: 'IN',
  version: '2027-28',
  sourceUrl: 'https://cisce.org/regulations-and-syllabus-icse-2028/',
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

export function getICSEEnglishStandardsForClass(classNum: number): ICSEEnglishStandard[] {
  const classData = icseEnglishCurriculum.classes.find(c => c.class === classNum);
  return classData?.standards || [];
}

export function getTotalICSEEnglishStandardsCount(): number {
  return icseEnglishCurriculum.classes.reduce(
    (sum, c) => sum + c.standards.length,
    0
  );
}

export default icseEnglishCurriculum;
