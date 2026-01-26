/**
 * IB Middle Years Programme (MYP) & Diploma Programme (DP) - Language and Literature (English)
 * Grades 6-12 (Ages 11-18)
 *
 * Official Source: IB MYP Language and Literature Guide (2020) & DP Language A Guide (2019)
 * https://www.ibo.org/programmes/middle-years-programme/curriculum/language-and-literature/
 * https://www.ibo.org/programmes/diploma-programme/curriculum/language-and-literature/
 *
 * Structure:
 * - MYP Years 1-5 (Grades 6-10, Ages 11-16): Language and Literature with 4 assessment criteria
 * - DP Years 1-2 (Grades 11-12, Ages 16-18): Language A: Literature or Language and Literature (SL/HL)
 *
 * Notation System: IB.{programme}.{year}.EN.{strand}.{number}
 * - Programme: MYP or DP
 * - Year: Y1-Y5 for MYP, Y1-Y2 for DP
 * - EN = English/Language and Literature
 * - Strand codes (MYP): AN (Analyzing), OR (Organizing), PT (Producing Text), UL (Using Language)
 * - Strand codes (DP): RD (Readers/Writers/Texts), TT (Time and Space), IT (Intertextuality),
 *                      LT (Literary Forms), GL (Global Issues)
 */

export interface IBMYPDPEnglishStandard {
  notation: string;
  strand: string; // For MYP: assessment focus; For DP: area of exploration
  topic?: string; // Specific skill or concept area
  level?: 'standard' | 'SL' | 'HL'; // MYP: standard; DP: SL/HL
  description: string;
  assessmentCriteria?: string[]; // Which criteria this relates to
}

export interface IBMYPDPEnglishYear {
  year: number; // 1-5 for MYP, 1-2 for DP (mapped to grades 6-12)
  grade: number; // Traditional grade equivalent (6-12)
  programme: 'MYP' | 'DP';
  yearLabel: string;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: IBMYPDPEnglishStandard[];
}

export interface IBMYPDPEnglishCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  years: IBMYPDPEnglishYear[];
}

// =============================================================================
// MYP ASSESSMENT CRITERIA (used across all MYP years)
// =============================================================================
// Criterion A: Analyzing - Analyze the content, context, language, structure,
//              technique and style of text(s) and the relationship between texts
// Criterion B: Organizing - Organize opinions and ideas in a sustained, coherent
//              and logical manner
// Criterion C: Producing text - Produce texts that demonstrate insight, imagination
//              and sensitivity while exploring and reflecting critically on new perspectives
// Criterion D: Using language - Use appropriate and varied vocabulary, sentence structures
//              and forms of expression

// =============================================================================
// DP ASSESSMENT CRITERIA
// =============================================================================
// Paper 1: Guided textual analysis (SL/HL)
// Paper 2: Comparative essay (SL/HL)
// HL Essay: 1,200-1,500 word essay (HL only)
// Individual Oral: 15-minute oral based on works studied

// =============================================================================
// MYP YEAR 1 (Grade 6, Ages 11-12) - Foundation
// Focus: Building reading comprehension, basic writing, oral communication
// =============================================================================

const mypYear1Standards: IBMYPDPEnglishStandard[] = [
  // ANALYZING (Criterion A)
  {
    notation: 'IB.MYP.Y1.EN.AN.1',
    strand: 'Analyzing',
    topic: 'Reading Comprehension',
    level: 'standard',
    description: 'Identify main ideas and supporting details in literary and non-literary texts',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y1.EN.AN.2',
    strand: 'Analyzing',
    topic: 'Text Features',
    level: 'standard',
    description: 'Identify and explain the purpose of text features and structures',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y1.EN.AN.3',
    strand: 'Analyzing',
    topic: 'Literary Elements',
    level: 'standard',
    description: 'Identify basic literary elements including character, setting, and plot',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y1.EN.AN.4',
    strand: 'Analyzing',
    topic: 'Author Purpose',
    level: 'standard',
    description: 'Identify the author\'s purpose and intended audience',
    assessmentCriteria: ['A'],
  },

  // ORGANIZING (Criterion B)
  {
    notation: 'IB.MYP.Y1.EN.OR.1',
    strand: 'Organizing',
    topic: 'Paragraph Structure',
    level: 'standard',
    description: 'Organize ideas into coherent paragraphs with topic sentences',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y1.EN.OR.2',
    strand: 'Organizing',
    topic: 'Logical Sequence',
    level: 'standard',
    description: 'Arrange ideas in a logical sequence with appropriate transitions',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y1.EN.OR.3',
    strand: 'Organizing',
    topic: 'Basic Formatting',
    level: 'standard',
    description: 'Use appropriate formatting conventions for different text types',
    assessmentCriteria: ['B'],
  },

  // PRODUCING TEXT (Criterion C)
  {
    notation: 'IB.MYP.Y1.EN.PT.1',
    strand: 'Producing Text',
    topic: 'Narrative Writing',
    level: 'standard',
    description: 'Write narratives with a clear beginning, middle, and end',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y1.EN.PT.2',
    strand: 'Producing Text',
    topic: 'Descriptive Writing',
    level: 'standard',
    description: 'Use sensory details to create vivid descriptions',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y1.EN.PT.3',
    strand: 'Producing Text',
    topic: 'Expository Writing',
    level: 'standard',
    description: 'Write informational texts that explain a topic clearly',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y1.EN.PT.4',
    strand: 'Producing Text',
    topic: 'Creative Expression',
    level: 'standard',
    description: 'Express ideas creatively through poetry and short fiction',
    assessmentCriteria: ['C'],
  },

  // USING LANGUAGE (Criterion D)
  {
    notation: 'IB.MYP.Y1.EN.UL.1',
    strand: 'Using Language',
    topic: 'Vocabulary',
    level: 'standard',
    description: 'Use grade-appropriate vocabulary accurately in writing',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y1.EN.UL.2',
    strand: 'Using Language',
    topic: 'Grammar',
    level: 'standard',
    description: 'Apply correct grammar including subject-verb agreement and verb tenses',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y1.EN.UL.3',
    strand: 'Using Language',
    topic: 'Punctuation',
    level: 'standard',
    description: 'Use punctuation correctly including periods, commas, and quotation marks',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y1.EN.UL.4',
    strand: 'Using Language',
    topic: 'Oral Communication',
    level: 'standard',
    description: 'Speak clearly and listen actively in discussions and presentations',
    assessmentCriteria: ['D'],
  },
];

// =============================================================================
// MYP YEAR 2 (Grade 7, Ages 12-13) - Developing
// Focus: Developing analysis skills, structured writing, literary appreciation
// =============================================================================

const mypYear2Standards: IBMYPDPEnglishStandard[] = [
  // ANALYZING (Criterion A)
  {
    notation: 'IB.MYP.Y2.EN.AN.1',
    strand: 'Analyzing',
    topic: 'Textual Analysis',
    level: 'standard',
    description: 'Analyze how authors use language and structure to create meaning',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y2.EN.AN.2',
    strand: 'Analyzing',
    topic: 'Character Development',
    level: 'standard',
    description: 'Analyze character development and motivation in literary texts',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y2.EN.AN.3',
    strand: 'Analyzing',
    topic: 'Theme',
    level: 'standard',
    description: 'Identify and analyze themes across different texts',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y2.EN.AN.4',
    strand: 'Analyzing',
    topic: 'Literary Devices',
    level: 'standard',
    description: 'Identify and explain the effect of simile, metaphor, and personification',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y2.EN.AN.5',
    strand: 'Analyzing',
    topic: 'Point of View',
    level: 'standard',
    description: 'Analyze how point of view affects the reader\'s understanding',
    assessmentCriteria: ['A'],
  },

  // ORGANIZING (Criterion B)
  {
    notation: 'IB.MYP.Y2.EN.OR.1',
    strand: 'Organizing',
    topic: 'Essay Structure',
    level: 'standard',
    description: 'Organize multi-paragraph essays with introduction, body, and conclusion',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y2.EN.OR.2',
    strand: 'Organizing',
    topic: 'Thesis Statements',
    level: 'standard',
    description: 'Develop clear thesis statements that guide essay organization',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y2.EN.OR.3',
    strand: 'Organizing',
    topic: 'Transitions',
    level: 'standard',
    description: 'Use transitional words and phrases to connect ideas between paragraphs',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y2.EN.OR.4',
    strand: 'Organizing',
    topic: 'Evidence Integration',
    level: 'standard',
    description: 'Integrate textual evidence to support claims and ideas',
    assessmentCriteria: ['B'],
  },

  // PRODUCING TEXT (Criterion C)
  {
    notation: 'IB.MYP.Y2.EN.PT.1',
    strand: 'Producing Text',
    topic: 'Narrative Techniques',
    level: 'standard',
    description: 'Use dialogue, pacing, and description to develop experiences and events',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y2.EN.PT.2',
    strand: 'Producing Text',
    topic: 'Argumentative Writing',
    level: 'standard',
    description: 'Write arguments with clear claims supported by reasons and evidence',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y2.EN.PT.3',
    strand: 'Producing Text',
    topic: 'Research Writing',
    level: 'standard',
    description: 'Conduct short research projects and synthesize information from sources',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y2.EN.PT.4',
    strand: 'Producing Text',
    topic: 'Genre Awareness',
    level: 'standard',
    description: 'Produce texts in different genres adapting style and format appropriately',
    assessmentCriteria: ['C'],
  },

  // USING LANGUAGE (Criterion D)
  {
    notation: 'IB.MYP.Y2.EN.UL.1',
    strand: 'Using Language',
    topic: 'Vocabulary Development',
    level: 'standard',
    description: 'Use precise vocabulary including academic and domain-specific words',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y2.EN.UL.2',
    strand: 'Using Language',
    topic: 'Sentence Variety',
    level: 'standard',
    description: 'Use varied sentence structures including compound and complex sentences',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y2.EN.UL.3',
    strand: 'Using Language',
    topic: 'Conventions',
    level: 'standard',
    description: 'Apply grammar, usage, and mechanics conventions accurately',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y2.EN.UL.4',
    strand: 'Using Language',
    topic: 'Presentation Skills',
    level: 'standard',
    description: 'Deliver presentations with appropriate volume, eye contact, and pacing',
    assessmentCriteria: ['D'],
  },
];

// =============================================================================
// MYP YEAR 3 (Grade 8, Ages 13-14) - Expanding
// Focus: Critical analysis, persuasive writing, literary interpretation
// =============================================================================

const mypYear3Standards: IBMYPDPEnglishStandard[] = [
  // ANALYZING (Criterion A)
  {
    notation: 'IB.MYP.Y3.EN.AN.1',
    strand: 'Analyzing',
    topic: 'Critical Analysis',
    level: 'standard',
    description: 'Analyze how authors use rhetoric and literary techniques to achieve purpose',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y3.EN.AN.2',
    strand: 'Analyzing',
    topic: 'Context and Culture',
    level: 'standard',
    description: 'Analyze how cultural and historical context shapes meaning in texts',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y3.EN.AN.3',
    strand: 'Analyzing',
    topic: 'Comparing Texts',
    level: 'standard',
    description: 'Compare and contrast how different texts address similar themes',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y3.EN.AN.4',
    strand: 'Analyzing',
    topic: 'Symbolism and Imagery',
    level: 'standard',
    description: 'Analyze the use of symbolism, imagery, and figurative language',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y3.EN.AN.5',
    strand: 'Analyzing',
    topic: 'Media Analysis',
    level: 'standard',
    description: 'Analyze how media texts use visual and verbal techniques to convey meaning',
    assessmentCriteria: ['A'],
  },

  // ORGANIZING (Criterion B)
  {
    notation: 'IB.MYP.Y3.EN.OR.1',
    strand: 'Organizing',
    topic: 'Argument Structure',
    level: 'standard',
    description: 'Organize arguments with claims, counterclaims, and evidence',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y3.EN.OR.2',
    strand: 'Organizing',
    topic: 'Literary Essays',
    level: 'standard',
    description: 'Structure literary analysis essays with thesis, analysis, and synthesis',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y3.EN.OR.3',
    strand: 'Organizing',
    topic: 'Research Integration',
    level: 'standard',
    description: 'Integrate multiple sources effectively with proper citation',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y3.EN.OR.4',
    strand: 'Organizing',
    topic: 'Coherent Arguments',
    level: 'standard',
    description: 'Develop sustained, coherent arguments with logical progression',
    assessmentCriteria: ['B'],
  },

  // PRODUCING TEXT (Criterion C)
  {
    notation: 'IB.MYP.Y3.EN.PT.1',
    strand: 'Producing Text',
    topic: 'Persuasive Writing',
    level: 'standard',
    description: 'Write persuasive texts using rhetorical appeals and techniques',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y3.EN.PT.2',
    strand: 'Producing Text',
    topic: 'Literary Response',
    level: 'standard',
    description: 'Write analytical responses to literature demonstrating critical insight',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y3.EN.PT.3',
    strand: 'Producing Text',
    topic: 'Creative Writing',
    level: 'standard',
    description: 'Create original literary works exploring voice, style, and technique',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y3.EN.PT.4',
    strand: 'Producing Text',
    topic: 'Extended Writing',
    level: 'standard',
    description: 'Produce extended texts (500+ words) with sustained development',
    assessmentCriteria: ['C'],
  },

  // USING LANGUAGE (Criterion D)
  {
    notation: 'IB.MYP.Y3.EN.UL.1',
    strand: 'Using Language',
    topic: 'Advanced Vocabulary',
    level: 'standard',
    description: 'Use sophisticated vocabulary including figurative and connotative meanings',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y3.EN.UL.2',
    strand: 'Using Language',
    topic: 'Syntax Control',
    level: 'standard',
    description: 'Use varied and controlled syntax for effect and clarity',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y3.EN.UL.3',
    strand: 'Using Language',
    topic: 'Register and Tone',
    level: 'standard',
    description: 'Adapt register and tone appropriately for audience and purpose',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y3.EN.UL.4',
    strand: 'Using Language',
    topic: 'Formal Discussion',
    level: 'standard',
    description: 'Participate effectively in formal discussions and debates',
    assessmentCriteria: ['D'],
  },
];

// =============================================================================
// MYP YEAR 4 (Grade 9, Ages 14-15)
// Focus: Sophisticated analysis, comparative studies, creative writing mastery
// =============================================================================

const mypYear4Standards: IBMYPDPEnglishStandard[] = [
  // ANALYZING (Criterion A)
  {
    notation: 'IB.MYP.Y4.EN.AN.1',
    strand: 'Analyzing',
    topic: 'Textual Analysis',
    level: 'standard',
    description: 'Analyze the content, context, language, structure, technique and style of literary and non-literary texts',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y4.EN.AN.2',
    strand: 'Analyzing',
    topic: 'Author Purpose',
    level: 'standard',
    description: 'Analyze the effects of the creator\'s choices on an audience, including intended and implicit meanings',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y4.EN.AN.3',
    strand: 'Analyzing',
    topic: 'Comparative Analysis',
    level: 'standard',
    description: 'Justify opinions and ideas using examples, explanations and terminology, comparing and contrasting texts',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y4.EN.AN.4',
    strand: 'Analyzing',
    topic: 'Literary Devices',
    level: 'standard',
    description: 'Evaluate the use of literary techniques including symbolism, imagery, figurative language, and narrative perspective',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y4.EN.AN.5',
    strand: 'Analyzing',
    topic: 'Context and Culture',
    level: 'standard',
    description: 'Analyze how texts reflect the cultural and historical contexts in which they were created',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y4.EN.AN.6',
    strand: 'Analyzing',
    topic: 'Media Literacy',
    level: 'standard',
    description: 'Critically analyze media texts including bias, perspective, and rhetorical strategies',
    assessmentCriteria: ['A'],
  },

  // ORGANIZING (Criterion B)
  {
    notation: 'IB.MYP.Y4.EN.OR.1',
    strand: 'Organizing',
    topic: 'Essay Structure',
    level: 'standard',
    description: 'Employ organizational structures that serve the context and intention effectively',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y4.EN.OR.2',
    strand: 'Organizing',
    topic: 'Coherent Arguments',
    level: 'standard',
    description: 'Organize opinions and ideas in a sustained, coherent and logical manner with smooth transitions',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y4.EN.OR.3',
    strand: 'Organizing',
    topic: 'Reference and Citation',
    level: 'standard',
    description: 'Use referencing and formatting tools to create a presentation style suitable to the context and intention',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y4.EN.OR.4',
    strand: 'Organizing',
    topic: 'Thesis Development',
    level: 'standard',
    description: 'Develop and sustain a clear thesis with supporting evidence organized logically',
    assessmentCriteria: ['B'],
  },

  // PRODUCING TEXT (Criterion C)
  {
    notation: 'IB.MYP.Y4.EN.PT.1',
    strand: 'Producing Text',
    topic: 'Creative Writing',
    level: 'standard',
    description: 'Produce texts that demonstrate insight, imagination and sensitivity while exploring and reflecting critically',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y4.EN.PT.2',
    strand: 'Producing Text',
    topic: 'Genre Conventions',
    level: 'standard',
    description: 'Make stylistic choices in terms of linguistic, literary and visual devices, demonstrating awareness of impact on audience',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y4.EN.PT.3',
    strand: 'Producing Text',
    topic: 'Voice and Perspective',
    level: 'standard',
    description: 'Select relevant details and examples to develop ideas and create distinct voices and perspectives',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y4.EN.PT.4',
    strand: 'Producing Text',
    topic: 'Narrative Techniques',
    level: 'standard',
    description: 'Employ sophisticated narrative techniques including flashback, foreshadowing, and unreliable narration',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y4.EN.PT.5',
    strand: 'Producing Text',
    topic: 'Persuasive Writing',
    level: 'standard',
    description: 'Craft persuasive texts using rhetorical devices, logical arguments, and emotional appeals effectively',
    assessmentCriteria: ['C'],
  },

  // USING LANGUAGE (Criterion D)
  {
    notation: 'IB.MYP.Y4.EN.UL.1',
    strand: 'Using Language',
    topic: 'Vocabulary',
    level: 'standard',
    description: 'Use appropriate and varied vocabulary, sentence structures and forms of expression',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y4.EN.UL.2',
    strand: 'Using Language',
    topic: 'Grammar and Syntax',
    level: 'standard',
    description: 'Write and speak using a register and style that serve the context and intention with correct grammar, syntax, and punctuation',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y4.EN.UL.3',
    strand: 'Using Language',
    topic: 'Spelling and Conventions',
    level: 'standard',
    description: 'Use correct spelling and apply the conventions of the language accurately and appropriately',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y4.EN.UL.4',
    strand: 'Using Language',
    topic: 'Rhetorical Devices',
    level: 'standard',
    description: 'Employ a range of rhetorical devices purposefully to enhance meaning and impact',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y4.EN.UL.5',
    strand: 'Using Language',
    topic: 'Oral Presentation',
    level: 'standard',
    description: 'Communicate effectively in spoken presentations using appropriate register, tone, and verbal techniques',
    assessmentCriteria: ['D'],
  },
];

// =============================================================================
// MYP YEAR 5 (Grade 10, Ages 15-16)
// Focus: Pre-DP preparation, sophisticated textual analysis, extended writing
// =============================================================================

const mypYear5Standards: IBMYPDPEnglishStandard[] = [
  // ANALYZING (Criterion A)
  {
    notation: 'IB.MYP.Y5.EN.AN.1',
    strand: 'Analyzing',
    topic: 'Advanced Textual Analysis',
    level: 'standard',
    description: 'Provide perceptive analysis of the content, context, language, structure, technique and style of sophisticated texts',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y5.EN.AN.2',
    strand: 'Analyzing',
    topic: 'Critical Interpretation',
    level: 'standard',
    description: 'Evaluate the effects of the creator\'s choices on an audience with sophisticated critical interpretation',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y5.EN.AN.3',
    strand: 'Analyzing',
    topic: 'Intertextuality',
    level: 'standard',
    description: 'Analyze relationships between texts, exploring how texts reference, influence, and build upon each other',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y5.EN.AN.4',
    strand: 'Analyzing',
    topic: 'Literary Criticism',
    level: 'standard',
    description: 'Apply different critical lenses (feminist, postcolonial, Marxist, psychoanalytic) to interpret texts',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y5.EN.AN.5',
    strand: 'Analyzing',
    topic: 'Global Perspectives',
    level: 'standard',
    description: 'Analyze texts from diverse cultural perspectives, examining representation and voice',
    assessmentCriteria: ['A'],
  },

  // ORGANIZING (Criterion B)
  {
    notation: 'IB.MYP.Y5.EN.OR.1',
    strand: 'Organizing',
    topic: 'Complex Argumentation',
    level: 'standard',
    description: 'Employ sophisticated organizational structures that serve complex arguments and multiple perspectives',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y5.EN.OR.2',
    strand: 'Organizing',
    topic: 'Academic Writing',
    level: 'standard',
    description: 'Organize academic essays with sustained, coherent and logical development of ideas',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y5.EN.OR.3',
    strand: 'Organizing',
    topic: 'Research Integration',
    level: 'standard',
    description: 'Integrate research and secondary sources effectively with proper academic referencing',
    assessmentCriteria: ['B'],
  },
  {
    notation: 'IB.MYP.Y5.EN.OR.4',
    strand: 'Organizing',
    topic: 'Synthesis',
    level: 'standard',
    description: 'Synthesize multiple sources and perspectives into cohesive, well-structured arguments',
    assessmentCriteria: ['B'],
  },

  // PRODUCING TEXT (Criterion C)
  {
    notation: 'IB.MYP.Y5.EN.PT.1',
    strand: 'Producing Text',
    topic: 'Literary Production',
    level: 'standard',
    description: 'Produce sophisticated texts that demonstrate deep insight, imagination, and critical reflection',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y5.EN.PT.2',
    strand: 'Producing Text',
    topic: 'Style Mastery',
    level: 'standard',
    description: 'Make purposeful stylistic choices demonstrating mastery of linguistic, literary, and visual devices',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y5.EN.PT.3',
    strand: 'Producing Text',
    topic: 'Extended Writing',
    level: 'standard',
    description: 'Produce extended texts (1000+ words) with sustained development of ideas and controlled structure',
    assessmentCriteria: ['C'],
  },
  {
    notation: 'IB.MYP.Y5.EN.PT.4',
    strand: 'Producing Text',
    topic: 'Multimodal Texts',
    level: 'standard',
    description: 'Create multimodal texts that integrate visual, verbal, and written elements effectively',
    assessmentCriteria: ['C'],
  },

  // USING LANGUAGE (Criterion D)
  {
    notation: 'IB.MYP.Y5.EN.UL.1',
    strand: 'Using Language',
    topic: 'Academic Register',
    level: 'standard',
    description: 'Use sophisticated and varied vocabulary appropriate to academic and literary contexts',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y5.EN.UL.2',
    strand: 'Using Language',
    topic: 'Complex Syntax',
    level: 'standard',
    description: 'Employ varied and complex sentence structures with consistent control of grammar and mechanics',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y5.EN.UL.3',
    strand: 'Using Language',
    topic: 'Register Flexibility',
    level: 'standard',
    description: 'Adapt register and style effectively across different contexts, purposes, and audiences',
    assessmentCriteria: ['D'],
  },
  {
    notation: 'IB.MYP.Y5.EN.UL.4',
    strand: 'Using Language',
    topic: 'Oral Discourse',
    level: 'standard',
    description: 'Engage in sophisticated oral discourse including formal debate, discussion, and presentation',
    assessmentCriteria: ['D'],
  },
];

// =============================================================================
// DP YEAR 1 (Grade 11, Ages 16-17)
// Language A: Literature and Language and Literature
// Focus: Areas of exploration, guided analysis, comparative study
// =============================================================================

const dpYear1Standards: IBMYPDPEnglishStandard[] = [
  // READERS, WRITERS, AND TEXTS
  {
    notation: 'IB.DP.Y1.EN.RD.1',
    strand: 'Readers, Writers, and Texts',
    topic: 'Author and Context',
    level: 'SL',
    description: 'Examine how literary and non-literary texts develop from particular contexts and traditions',
    assessmentCriteria: ['Paper 1', 'IO'],
  },
  {
    notation: 'IB.DP.Y1.EN.RD.2',
    strand: 'Readers, Writers, and Texts',
    topic: 'Reader Response',
    level: 'SL',
    description: 'Analyze how readers interpret texts based on personal experience, culture, and knowledge',
    assessmentCriteria: ['Paper 1', 'IO'],
  },
  {
    notation: 'IB.DP.Y1.EN.RD.3',
    strand: 'Readers, Writers, and Texts',
    topic: 'Authorial Choices',
    level: 'SL',
    description: 'Evaluate how authors use language, structure, and technique to create meaning and effects',
    assessmentCriteria: ['Paper 1', 'Paper 2'],
  },
  {
    notation: 'IB.DP.Y1.EN.RD.4',
    strand: 'Readers, Writers, and Texts',
    topic: 'Text Types and Conventions',
    level: 'SL',
    description: 'Understand how texts adhere to or subvert genre conventions and reader expectations',
    assessmentCriteria: ['Paper 1'],
  },
  {
    notation: 'IB.DP.Y1.EN.RD.5',
    strand: 'Readers, Writers, and Texts',
    topic: 'Critical Perspectives',
    level: 'HL',
    description: 'Apply critical theories and perspectives to analyze the relationship between texts and meaning',
    assessmentCriteria: ['HL Essay'],
  },

  // TIME AND SPACE
  {
    notation: 'IB.DP.Y1.EN.TT.1',
    strand: 'Time and Space',
    topic: 'Historical Context',
    level: 'SL',
    description: 'Explore how texts are shaped by and reflect their historical and cultural contexts',
    assessmentCriteria: ['Paper 2', 'IO'],
  },
  {
    notation: 'IB.DP.Y1.EN.TT.2',
    strand: 'Time and Space',
    topic: 'Social and Political Context',
    level: 'SL',
    description: 'Analyze how social, political, and economic factors influence the production and reception of texts',
    assessmentCriteria: ['Paper 2', 'IO'],
  },
  {
    notation: 'IB.DP.Y1.EN.TT.3',
    strand: 'Time and Space',
    topic: 'Comparative Contexts',
    level: 'SL',
    description: 'Compare texts from different time periods and places to understand changing values and perspectives',
    assessmentCriteria: ['Paper 2'],
  },
  {
    notation: 'IB.DP.Y1.EN.TT.4',
    strand: 'Time and Space',
    topic: 'Contemporary Relevance',
    level: 'SL',
    description: 'Evaluate the ongoing relevance and resonance of texts across time and cultures',
    assessmentCriteria: ['IO'],
  },

  // INTERTEXTUALITY: CONNECTING TEXTS
  {
    notation: 'IB.DP.Y1.EN.IT.1',
    strand: 'Intertextuality',
    topic: 'Textual Connections',
    level: 'SL',
    description: 'Identify and analyze connections, allusions, and references between texts',
    assessmentCriteria: ['Paper 2', 'IO'],
  },
  {
    notation: 'IB.DP.Y1.EN.IT.2',
    strand: 'Intertextuality',
    topic: 'Transformation',
    level: 'SL',
    description: 'Examine how texts transform, adapt, or respond to other texts and ideas',
    assessmentCriteria: ['Paper 2'],
  },
  {
    notation: 'IB.DP.Y1.EN.IT.3',
    strand: 'Intertextuality',
    topic: 'Comparative Analysis',
    level: 'SL',
    description: 'Develop comparative analyses exploring thematic and stylistic connections between works',
    assessmentCriteria: ['Paper 2'],
  },

  // TEXTUAL ANALYSIS SKILLS
  {
    notation: 'IB.DP.Y1.EN.TA.1',
    strand: 'Textual Analysis',
    topic: 'Guided Analysis',
    level: 'SL',
    description: 'Produce guided textual analysis of unseen literary and non-literary texts',
    assessmentCriteria: ['Paper 1'],
  },
  {
    notation: 'IB.DP.Y1.EN.TA.2',
    strand: 'Textual Analysis',
    topic: 'Close Reading',
    level: 'SL',
    description: 'Apply close reading techniques to analyze literary devices, structure, and meaning',
    assessmentCriteria: ['Paper 1'],
  },
  {
    notation: 'IB.DP.Y1.EN.TA.3',
    strand: 'Textual Analysis',
    topic: 'Comparative Essay',
    level: 'SL',
    description: 'Write comparative essays connecting works studied through thematic and technical analysis',
    assessmentCriteria: ['Paper 2'],
  },

  // ORAL COMMUNICATION
  {
    notation: 'IB.DP.Y1.EN.OC.1',
    strand: 'Oral Communication',
    topic: 'Individual Oral',
    level: 'SL',
    description: 'Prepare and deliver individual oral presentations connecting texts to global issues',
    assessmentCriteria: ['IO'],
  },
  {
    notation: 'IB.DP.Y1.EN.OC.2',
    strand: 'Oral Communication',
    topic: 'Literary Discussion',
    level: 'SL',
    description: 'Engage in informed literary discussions demonstrating understanding and critical thinking',
    assessmentCriteria: ['IO'],
  },

  // HL EXTENSIONS
  {
    notation: 'IB.DP.Y1.EN.HL.1',
    strand: 'HL Extension',
    topic: 'Literary Research',
    level: 'HL',
    description: 'Develop independent literary research skills for the HL essay',
    assessmentCriteria: ['HL Essay'],
  },
  {
    notation: 'IB.DP.Y1.EN.HL.2',
    strand: 'HL Extension',
    topic: 'Extended Analysis',
    level: 'HL',
    description: 'Produce extended analysis of two literary texts (1,200-1,500 words) for HL essay',
    assessmentCriteria: ['HL Essay'],
  },
];

// =============================================================================
// DP YEAR 2 (Grade 12, Ages 17-18)
// Language A: Literature and Language and Literature
// Focus: Assessment preparation, synthesis, independent thinking
// =============================================================================

const dpYear2Standards: IBMYPDPEnglishStandard[] = [
  // ADVANCED READERS, WRITERS, AND TEXTS
  {
    notation: 'IB.DP.Y2.EN.RD.1',
    strand: 'Readers, Writers, and Texts',
    topic: 'Sophisticated Analysis',
    level: 'SL',
    description: 'Demonstrate sophisticated understanding of how texts construct and shape meaning',
    assessmentCriteria: ['Paper 1', 'IO'],
  },
  {
    notation: 'IB.DP.Y2.EN.RD.2',
    strand: 'Readers, Writers, and Texts',
    topic: 'Personal Response',
    level: 'SL',
    description: 'Develop and articulate personal, informed responses to texts with supporting evidence',
    assessmentCriteria: ['Paper 1', 'IO'],
  },
  {
    notation: 'IB.DP.Y2.EN.RD.3',
    strand: 'Readers, Writers, and Texts',
    topic: 'Literary Awareness',
    level: 'SL',
    description: 'Demonstrate awareness of how texts reflect and shape attitudes, values, and beliefs',
    assessmentCriteria: ['Paper 2', 'IO'],
  },

  // ADVANCED TIME AND SPACE
  {
    notation: 'IB.DP.Y2.EN.TT.1',
    strand: 'Time and Space',
    topic: 'Cultural Analysis',
    level: 'SL',
    description: 'Synthesize understanding of cultural contexts in analyzing diverse texts',
    assessmentCriteria: ['Paper 2', 'IO'],
  },
  {
    notation: 'IB.DP.Y2.EN.TT.2',
    strand: 'Time and Space',
    topic: 'Literary Movements',
    level: 'SL',
    description: 'Understand texts within the context of literary movements and traditions',
    assessmentCriteria: ['Paper 2'],
  },

  // ADVANCED INTERTEXTUALITY
  {
    notation: 'IB.DP.Y2.EN.IT.1',
    strand: 'Intertextuality',
    topic: 'Synthesis',
    level: 'SL',
    description: 'Synthesize connections between works studied throughout the course',
    assessmentCriteria: ['Paper 2', 'IO'],
  },
  {
    notation: 'IB.DP.Y2.EN.IT.2',
    strand: 'Intertextuality',
    topic: 'Global Issues',
    level: 'SL',
    description: 'Connect literary works to global issues demonstrating international mindedness',
    assessmentCriteria: ['IO'],
  },

  // EXAMINATION PREPARATION
  {
    notation: 'IB.DP.Y2.EN.EX.1',
    strand: 'Examination Skills',
    topic: 'Paper 1 Mastery',
    level: 'SL',
    description: 'Produce polished guided textual analysis under timed examination conditions',
    assessmentCriteria: ['Paper 1'],
  },
  {
    notation: 'IB.DP.Y2.EN.EX.2',
    strand: 'Examination Skills',
    topic: 'Paper 2 Mastery',
    level: 'SL',
    description: 'Write sophisticated comparative essays under timed examination conditions',
    assessmentCriteria: ['Paper 2'],
  },
  {
    notation: 'IB.DP.Y2.EN.EX.3',
    strand: 'Examination Skills',
    topic: 'Individual Oral Mastery',
    level: 'SL',
    description: 'Deliver polished individual oral connecting extract and work to global issue',
    assessmentCriteria: ['IO'],
  },

  // WRITTEN EXPRESSION
  {
    notation: 'IB.DP.Y2.EN.WR.1',
    strand: 'Written Expression',
    topic: 'Academic Writing',
    level: 'SL',
    description: 'Demonstrate mastery of academic essay writing with sophisticated analysis and expression',
    assessmentCriteria: ['Paper 1', 'Paper 2'],
  },
  {
    notation: 'IB.DP.Y2.EN.WR.2',
    strand: 'Written Expression',
    topic: 'Textual Evidence',
    level: 'SL',
    description: 'Use textual evidence effectively and appropriately to support analysis',
    assessmentCriteria: ['Paper 1', 'Paper 2'],
  },

  // HL EXTENSIONS
  {
    notation: 'IB.DP.Y2.EN.HL.1',
    strand: 'HL Extension',
    topic: 'HL Essay Completion',
    level: 'HL',
    description: 'Complete independent HL essay demonstrating sophisticated literary analysis',
    assessmentCriteria: ['HL Essay'],
  },
  {
    notation: 'IB.DP.Y2.EN.HL.2',
    strand: 'HL Extension',
    topic: 'Additional Works',
    level: 'HL',
    description: 'Analyze additional literary works required for HL study with depth and sophistication',
    assessmentCriteria: ['Paper 2', 'IO'],
  },
  {
    notation: 'IB.DP.Y2.EN.HL.3',
    strand: 'HL Extension',
    topic: 'Critical Theory',
    level: 'HL',
    description: 'Apply multiple critical perspectives to literary analysis with nuance and insight',
    assessmentCriteria: ['HL Essay', 'Paper 2'],
  },
];

// =============================================================================
// CURRICULUM EXPORT
// =============================================================================

export const ibMYPDPEnglishCurriculum: IBMYPDPEnglishCurriculum = {
  code: 'IB_MYPDP_EN',
  name: 'IB MYP/DP Language and Literature (English)',
  country: 'International',
  version: '2020-2019', // MYP 2020, DP 2019 guides
  sourceUrl: 'https://www.ibo.org/programmes/',
  subject: 'English Language and Literature',
  years: [
    // MYP Years 1-3 (Grades 6-8) - Foundation level
    {
      year: 1,
      grade: 6,
      programme: 'MYP',
      yearLabel: 'MYP Year 1 (Grade 6)',
      ageRangeMin: 11,
      ageRangeMax: 12,
      standards: mypYear1Standards,
    },
    {
      year: 2,
      grade: 7,
      programme: 'MYP',
      yearLabel: 'MYP Year 2 (Grade 7)',
      ageRangeMin: 12,
      ageRangeMax: 13,
      standards: mypYear2Standards,
    },
    {
      year: 3,
      grade: 8,
      programme: 'MYP',
      yearLabel: 'MYP Year 3 (Grade 8)',
      ageRangeMin: 13,
      ageRangeMax: 14,
      standards: mypYear3Standards,
    },
    // MYP Years 4-5 (Grades 9-10) - Advanced level
    {
      year: 4,
      grade: 9,
      programme: 'MYP',
      yearLabel: 'MYP Year 4',
      ageRangeMin: 14,
      ageRangeMax: 15,
      standards: mypYear4Standards,
    },
    {
      year: 5,
      grade: 10,
      programme: 'MYP',
      yearLabel: 'MYP Year 5',
      ageRangeMin: 15,
      ageRangeMax: 16,
      standards: mypYear5Standards,
    },
    {
      year: 1,
      grade: 11,
      programme: 'DP',
      yearLabel: 'DP Year 1',
      ageRangeMin: 16,
      ageRangeMax: 17,
      standards: dpYear1Standards,
    },
    {
      year: 2,
      grade: 12,
      programme: 'DP',
      yearLabel: 'DP Year 2',
      ageRangeMin: 17,
      ageRangeMax: 18,
      standards: dpYear2Standards,
    },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get standards for a specific grade (6-12)
 */
export function getIBMYPDPEnglishStandardsByGrade(grade: number): IBMYPDPEnglishStandard[] {
  const year = ibMYPDPEnglishCurriculum.years.find((y) => y.grade === grade);
  return year?.standards ?? [];
}

/**
 * Get standards by strand across all grades
 */
export function getIBMYPDPEnglishStandardsByStrand(strand: string): IBMYPDPEnglishStandard[] {
  return ibMYPDPEnglishCurriculum.years.flatMap((year) =>
    year.standards.filter((s) => s.strand.toLowerCase().includes(strand.toLowerCase()))
  );
}

/**
 * Get all standards for a programme (MYP or DP)
 */
export function getIBMYPDPEnglishStandardsByProgramme(
  programme: 'MYP' | 'DP'
): IBMYPDPEnglishStandard[] {
  return ibMYPDPEnglishCurriculum.years
    .filter((y) => y.programme === programme)
    .flatMap((y) => y.standards);
}

/**
 * Get standards by level (SL or HL for DP)
 */
export function getIBDPEnglishStandardsByLevel(level: 'SL' | 'HL'): IBMYPDPEnglishStandard[] {
  return ibMYPDPEnglishCurriculum.years
    .filter((y) => y.programme === 'DP')
    .flatMap((y) => y.standards.filter((s) => s.level === level || s.level === 'SL'));
}

/**
 * Get total number of standards across all grades
 */
export function getTotalIBMYPDPEnglishStandardsCount(): number {
  return ibMYPDPEnglishCurriculum.years.reduce(
    (total, year) => total + year.standards.length,
    0
  );
}

/**
 * Get grades covered by this curriculum
 */
export function getIBMYPDPEnglishGrades(): number[] {
  return ibMYPDPEnglishCurriculum.years.map((y) => y.grade);
}
