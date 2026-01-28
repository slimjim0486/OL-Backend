/**
 * IB Arts Curriculum - Visual Arts and Music
 * PYP (Ages 3-12), MYP (Ages 11-16), DP (Ages 16-18)
 *
 * Official Sources:
 * - IB PYP Arts Scope and Sequence (2009)
 * - IB MYP Arts Guide (2022)
 * - IB DP Visual Arts Guide (2024 - First assessment 2027)
 * - IB DP Music Guide (2020)
 *
 * Structure:
 * - PYP: Dance, Drama, Music, Visual Arts with responding/creating strands
 * - MYP: Dance, Music, Theatre, Media arts, Visual arts with 4 assessment criteria
 * - DP: Visual Arts and Music as separate subjects (SL/HL)
 *
 * MYP Assessment Criteria:
 * - Criterion A: Investigating (Knowledge and understanding)
 * - Criterion B: Developing skills
 * - Criterion C: Thinking creatively
 * - Criterion D: Responding
 *
 * DP Visual Arts Core Areas:
 * - Visual Arts in Context
 * - Visual Arts Methods
 * - Communicating Visual Arts
 *
 * DP Music Roles & Processes:
 * - Roles: Researcher, Creator, Performer
 * - Processes: Exploring, Experimenting, Presenting
 *
 * Notation System: IB.{programme}.{level}.AR.{discipline}.{strand}.{number}
 * - Programme: PYP, MYP, DP
 * - Level: Age band (PYP), Year (MYP), Year (DP)
 * - AR = Arts
 * - Discipline: VA (Visual Arts), MU (Music)
 * - Strand codes vary by programme
 */

export interface IBArtStandard {
  notation: string;
  discipline: 'Visual Arts' | 'Music';
  strand: string;
  description: string;
  assessmentCriterion?: 'A' | 'B' | 'C' | 'D';
  isHL?: boolean;
}

export interface IBArtLevel {
  level: string;
  levelLabel: string;
  gradeEquivalent: string;
  ageRangeMin: number;
  ageRangeMax: number;
  programme: 'PYP' | 'MYP' | 'DP';
  standards: IBArtStandard[];
}

// ============================================================================
// PYP AGE BAND 1 (Ages 3-5, Pre-K to K)
// ============================================================================
const pypAgeBand1Standards: IBArtStandard[] = [
  // Visual Arts - Responding
  { notation: 'IB.PYP.A1.AR.VA.RES.1', discipline: 'Visual Arts', strand: 'Responding', description: 'Share thoughts and feelings about their own artwork and the artwork of others' },
  { notation: 'IB.PYP.A1.AR.VA.RES.2', discipline: 'Visual Arts', strand: 'Responding', description: 'Recognize that people create art to express ideas and feelings' },
  { notation: 'IB.PYP.A1.AR.VA.RES.3', discipline: 'Visual Arts', strand: 'Responding', description: 'Use senses to explore artwork (colors, shapes, textures)' },

  // Visual Arts - Creating
  { notation: 'IB.PYP.A1.AR.VA.CRE.1', discipline: 'Visual Arts', strand: 'Creating', description: 'Explore and experiment with a variety of art materials and tools' },
  { notation: 'IB.PYP.A1.AR.VA.CRE.2', discipline: 'Visual Arts', strand: 'Creating', description: 'Create artwork that represents ideas, feelings, and experiences' },
  { notation: 'IB.PYP.A1.AR.VA.CRE.3', discipline: 'Visual Arts', strand: 'Creating', description: 'Use basic elements of art: line, shape, color' },
  { notation: 'IB.PYP.A1.AR.VA.CRE.4', discipline: 'Visual Arts', strand: 'Creating', description: 'Participate in the process of creating art with enjoyment' },

  // Music - Responding
  { notation: 'IB.PYP.A1.AR.MU.RES.1', discipline: 'Music', strand: 'Responding', description: 'Listen and respond to a variety of music with movement and words' },
  { notation: 'IB.PYP.A1.AR.MU.RES.2', discipline: 'Music', strand: 'Responding', description: 'Identify fast and slow, loud and soft in music' },
  { notation: 'IB.PYP.A1.AR.MU.RES.3', discipline: 'Music', strand: 'Responding', description: 'Express how music makes them feel' },

  // Music - Creating
  { notation: 'IB.PYP.A1.AR.MU.CRE.1', discipline: 'Music', strand: 'Creating', description: 'Explore sounds using voice, body percussion, and simple instruments' },
  { notation: 'IB.PYP.A1.AR.MU.CRE.2', discipline: 'Music', strand: 'Creating', description: 'Sing simple songs and rhymes' },
  { notation: 'IB.PYP.A1.AR.MU.CRE.3', discipline: 'Music', strand: 'Creating', description: 'Move to music rhythmically' },
  { notation: 'IB.PYP.A1.AR.MU.CRE.4', discipline: 'Music', strand: 'Creating', description: 'Create simple sound patterns' },
];

// ============================================================================
// PYP AGE BAND 2 (Ages 5-7, Grades K-1)
// ============================================================================
const pypAgeBand2Standards: IBArtStandard[] = [
  // Visual Arts - Responding
  { notation: 'IB.PYP.A2.AR.VA.RES.1', discipline: 'Visual Arts', strand: 'Responding', description: 'Describe what they see in artworks using art vocabulary' },
  { notation: 'IB.PYP.A2.AR.VA.RES.2', discipline: 'Visual Arts', strand: 'Responding', description: 'Identify different purposes of art (decoration, expression, storytelling)' },
  { notation: 'IB.PYP.A2.AR.VA.RES.3', discipline: 'Visual Arts', strand: 'Responding', description: 'Compare similarities and differences in artworks' },
  { notation: 'IB.PYP.A2.AR.VA.RES.4', discipline: 'Visual Arts', strand: 'Responding', description: 'Explain choices made in their own artwork' },

  // Visual Arts - Creating
  { notation: 'IB.PYP.A2.AR.VA.CRE.1', discipline: 'Visual Arts', strand: 'Creating', description: 'Use line, shape, color, and texture purposefully in artwork' },
  { notation: 'IB.PYP.A2.AR.VA.CRE.2', discipline: 'Visual Arts', strand: 'Creating', description: 'Create artwork using a variety of media (paint, clay, collage, drawing)' },
  { notation: 'IB.PYP.A2.AR.VA.CRE.3', discipline: 'Visual Arts', strand: 'Creating', description: 'Plan artwork before creating' },
  { notation: 'IB.PYP.A2.AR.VA.CRE.4', discipline: 'Visual Arts', strand: 'Creating', description: 'Demonstrate increasing control of art tools and materials' },
  { notation: 'IB.PYP.A2.AR.VA.CRE.5', discipline: 'Visual Arts', strand: 'Creating', description: 'Create art inspired by observations of the world' },

  // Music - Responding
  { notation: 'IB.PYP.A2.AR.MU.RES.1', discipline: 'Music', strand: 'Responding', description: 'Identify and describe elements of music (tempo, dynamics, pitch)' },
  { notation: 'IB.PYP.A2.AR.MU.RES.2', discipline: 'Music', strand: 'Responding', description: 'Recognize different types of instruments by sound' },
  { notation: 'IB.PYP.A2.AR.MU.RES.3', discipline: 'Music', strand: 'Responding', description: 'Describe how music expresses feelings and ideas' },
  { notation: 'IB.PYP.A2.AR.MU.RES.4', discipline: 'Music', strand: 'Responding', description: 'Listen to music from different cultures' },

  // Music - Creating
  { notation: 'IB.PYP.A2.AR.MU.CRE.1', discipline: 'Music', strand: 'Creating', description: 'Sing songs with accurate pitch and rhythm' },
  { notation: 'IB.PYP.A2.AR.MU.CRE.2', discipline: 'Music', strand: 'Creating', description: 'Play simple rhythms on percussion instruments' },
  { notation: 'IB.PYP.A2.AR.MU.CRE.3', discipline: 'Music', strand: 'Creating', description: 'Create simple rhythmic and melodic patterns' },
  { notation: 'IB.PYP.A2.AR.MU.CRE.4', discipline: 'Music', strand: 'Creating', description: 'Move expressively to music' },
  { notation: 'IB.PYP.A2.AR.MU.CRE.5', discipline: 'Music', strand: 'Creating', description: 'Use simple notation (icons, pictures) to represent sounds' },
];

// ============================================================================
// PYP AGE BAND 3 (Ages 7-9, Grades 2-3)
// ============================================================================
const pypAgeBand3Standards: IBArtStandard[] = [
  // Visual Arts - Responding
  { notation: 'IB.PYP.A3.AR.VA.RES.1', discipline: 'Visual Arts', strand: 'Responding', description: 'Analyze how artists use elements and principles of design' },
  { notation: 'IB.PYP.A3.AR.VA.RES.2', discipline: 'Visual Arts', strand: 'Responding', description: 'Identify how art reflects cultural traditions and beliefs' },
  { notation: 'IB.PYP.A3.AR.VA.RES.3', discipline: 'Visual Arts', strand: 'Responding', description: 'Evaluate artwork using appropriate criteria and vocabulary' },
  { notation: 'IB.PYP.A3.AR.VA.RES.4', discipline: 'Visual Arts', strand: 'Responding', description: 'Make connections between artworks from different times and places' },
  { notation: 'IB.PYP.A3.AR.VA.RES.5', discipline: 'Visual Arts', strand: 'Responding', description: 'Reflect on how artworks communicate ideas and emotions' },

  // Visual Arts - Creating
  { notation: 'IB.PYP.A3.AR.VA.CRE.1', discipline: 'Visual Arts', strand: 'Creating', description: 'Apply elements of art and principles of design intentionally' },
  { notation: 'IB.PYP.A3.AR.VA.CRE.2', discipline: 'Visual Arts', strand: 'Creating', description: 'Experiment with different techniques and processes' },
  { notation: 'IB.PYP.A3.AR.VA.CRE.3', discipline: 'Visual Arts', strand: 'Creating', description: 'Develop ideas through sketching and planning' },
  { notation: 'IB.PYP.A3.AR.VA.CRE.4', discipline: 'Visual Arts', strand: 'Creating', description: 'Create artwork that expresses personal ideas and experiences' },
  { notation: 'IB.PYP.A3.AR.VA.CRE.5', discipline: 'Visual Arts', strand: 'Creating', description: 'Refine and improve artwork based on reflection' },
  { notation: 'IB.PYP.A3.AR.VA.CRE.6', discipline: 'Visual Arts', strand: 'Creating', description: 'Explore art from different cultures as inspiration' },

  // Music - Responding
  { notation: 'IB.PYP.A3.AR.MU.RES.1', discipline: 'Music', strand: 'Responding', description: 'Analyze musical elements in compositions (form, texture, timbre)' },
  { notation: 'IB.PYP.A3.AR.MU.RES.2', discipline: 'Music', strand: 'Responding', description: 'Compare music from different cultures and time periods' },
  { notation: 'IB.PYP.A3.AR.MU.RES.3', discipline: 'Music', strand: 'Responding', description: 'Describe the relationship between music and its cultural context' },
  { notation: 'IB.PYP.A3.AR.MU.RES.4', discipline: 'Music', strand: 'Responding', description: 'Use musical vocabulary to discuss and critique music' },

  // Music - Creating
  { notation: 'IB.PYP.A3.AR.MU.CRE.1', discipline: 'Music', strand: 'Creating', description: 'Sing with expression, accurate pitch, and breathing control' },
  { notation: 'IB.PYP.A3.AR.MU.CRE.2', discipline: 'Music', strand: 'Creating', description: 'Play melodic and rhythmic patterns on instruments' },
  { notation: 'IB.PYP.A3.AR.MU.CRE.3', discipline: 'Music', strand: 'Creating', description: 'Compose short pieces using musical elements' },
  { notation: 'IB.PYP.A3.AR.MU.CRE.4', discipline: 'Music', strand: 'Creating', description: 'Read and write basic musical notation' },
  { notation: 'IB.PYP.A3.AR.MU.CRE.5', discipline: 'Music', strand: 'Creating', description: 'Perform in groups with awareness of ensemble' },
  { notation: 'IB.PYP.A3.AR.MU.CRE.6', discipline: 'Music', strand: 'Creating', description: 'Improvise musical ideas within a structure' },
];

// ============================================================================
// PYP AGE BAND 4 (Ages 9-12, Grades 4-5)
// ============================================================================
const pypAgeBand4Standards: IBArtStandard[] = [
  // Visual Arts - Responding
  { notation: 'IB.PYP.A4.AR.VA.RES.1', discipline: 'Visual Arts', strand: 'Responding', description: 'Interpret the meaning and significance of artworks in context' },
  { notation: 'IB.PYP.A4.AR.VA.RES.2', discipline: 'Visual Arts', strand: 'Responding', description: 'Analyze how artists make choices to communicate ideas' },
  { notation: 'IB.PYP.A4.AR.VA.RES.3', discipline: 'Visual Arts', strand: 'Responding', description: 'Evaluate how art reflects and shapes society' },
  { notation: 'IB.PYP.A4.AR.VA.RES.4', discipline: 'Visual Arts', strand: 'Responding', description: 'Research and present on artists and art movements' },
  { notation: 'IB.PYP.A4.AR.VA.RES.5', discipline: 'Visual Arts', strand: 'Responding', description: 'Connect personal responses to art with broader themes' },

  // Visual Arts - Creating
  { notation: 'IB.PYP.A4.AR.VA.CRE.1', discipline: 'Visual Arts', strand: 'Creating', description: 'Develop personal artistic style and voice' },
  { notation: 'IB.PYP.A4.AR.VA.CRE.2', discipline: 'Visual Arts', strand: 'Creating', description: 'Create artwork that demonstrates technical skill and creativity' },
  { notation: 'IB.PYP.A4.AR.VA.CRE.3', discipline: 'Visual Arts', strand: 'Creating', description: 'Use the creative process: research, plan, create, reflect, refine' },
  { notation: 'IB.PYP.A4.AR.VA.CRE.4', discipline: 'Visual Arts', strand: 'Creating', description: 'Experiment with mixed media and contemporary techniques' },
  { notation: 'IB.PYP.A4.AR.VA.CRE.5', discipline: 'Visual Arts', strand: 'Creating', description: 'Create art that addresses issues or expresses viewpoints' },
  { notation: 'IB.PYP.A4.AR.VA.CRE.6', discipline: 'Visual Arts', strand: 'Creating', description: 'Document the creative process in a visual journal' },

  // Music - Responding
  { notation: 'IB.PYP.A4.AR.MU.RES.1', discipline: 'Music', strand: 'Responding', description: 'Analyze how composers use musical elements to create meaning' },
  { notation: 'IB.PYP.A4.AR.MU.RES.2', discipline: 'Music', strand: 'Responding', description: 'Evaluate performances and compositions using musical criteria' },
  { notation: 'IB.PYP.A4.AR.MU.RES.3', discipline: 'Music', strand: 'Responding', description: 'Research and present on musical traditions from around the world' },
  { notation: 'IB.PYP.A4.AR.MU.RES.4', discipline: 'Music', strand: 'Responding', description: 'Understand how music functions in different social contexts' },
  { notation: 'IB.PYP.A4.AR.MU.RES.5', discipline: 'Music', strand: 'Responding', description: 'Develop informed personal preferences in music' },

  // Music - Creating
  { notation: 'IB.PYP.A4.AR.MU.CRE.1', discipline: 'Music', strand: 'Creating', description: 'Perform with technical accuracy and musical expression' },
  { notation: 'IB.PYP.A4.AR.MU.CRE.2', discipline: 'Music', strand: 'Creating', description: 'Compose music that demonstrates understanding of form and structure' },
  { notation: 'IB.PYP.A4.AR.MU.CRE.3', discipline: 'Music', strand: 'Creating', description: 'Read and write standard musical notation fluently' },
  { notation: 'IB.PYP.A4.AR.MU.CRE.4', discipline: 'Music', strand: 'Creating', description: 'Perform in ensembles with attention to balance and blend' },
  { notation: 'IB.PYP.A4.AR.MU.CRE.5', discipline: 'Music', strand: 'Creating', description: 'Use technology in music creation and performance' },
  { notation: 'IB.PYP.A4.AR.MU.CRE.6', discipline: 'Music', strand: 'Creating', description: 'Develop original compositions in various genres' },
];

// ============================================================================
// MYP YEAR 1 (Grade 6, Ages 11-12)
// ============================================================================
const mypYear1Standards: IBArtStandard[] = [
  // Visual Arts - Criterion A: Investigating
  { notation: 'IB.MYP.M1.AR.VA.INV.1', discipline: 'Visual Arts', strand: 'Investigating', description: 'Identify and describe the role of visual arts in different cultures and contexts', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M1.AR.VA.INV.2', discipline: 'Visual Arts', strand: 'Investigating', description: 'Research artists and art movements relevant to their work', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M1.AR.VA.INV.3', discipline: 'Visual Arts', strand: 'Investigating', description: 'Demonstrate awareness of art forms from various times and cultures', assessmentCriterion: 'A' },

  // Visual Arts - Criterion B: Developing Skills
  { notation: 'IB.MYP.M1.AR.VA.DEV.1', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Demonstrate the application of skills and techniques', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.AR.VA.DEV.2', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Demonstrate the application of techniques to create artwork', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.AR.VA.DEV.3', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Use appropriate materials and processes safely', assessmentCriterion: 'B' },

  // Visual Arts - Criterion C: Thinking Creatively
  { notation: 'IB.MYP.M1.AR.VA.CRE.1', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Develop an idea or a theme to a point of realization', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M1.AR.VA.CRE.2', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Show experimentation with ideas and art-making processes', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M1.AR.VA.CRE.3', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Explore ideas through visual brainstorming and sketching', assessmentCriterion: 'C' },

  // Visual Arts - Criterion D: Responding
  { notation: 'IB.MYP.M1.AR.VA.RES.1', discipline: 'Visual Arts', strand: 'Responding', description: 'Construct meaning from artwork and explain personal interpretations', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M1.AR.VA.RES.2', discipline: 'Visual Arts', strand: 'Responding', description: 'Evaluate the artwork of self and others using appropriate vocabulary', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M1.AR.VA.RES.3', discipline: 'Visual Arts', strand: 'Responding', description: 'Identify connections between art and other areas of knowledge', assessmentCriterion: 'D' },

  // Music - Criterion A: Investigating
  { notation: 'IB.MYP.M1.AR.MU.INV.1', discipline: 'Music', strand: 'Investigating', description: 'Identify and describe the role of music in different cultures', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M1.AR.MU.INV.2', discipline: 'Music', strand: 'Investigating', description: 'Research musical genres and their historical contexts', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M1.AR.MU.INV.3', discipline: 'Music', strand: 'Investigating', description: 'Demonstrate awareness of music from various times and cultures', assessmentCriterion: 'A' },

  // Music - Criterion B: Developing Skills
  { notation: 'IB.MYP.M1.AR.MU.DEV.1', discipline: 'Music', strand: 'Developing Skills', description: 'Demonstrate the application of musical skills and techniques', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.AR.MU.DEV.2', discipline: 'Music', strand: 'Developing Skills', description: 'Demonstrate the application of skills in performance', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M1.AR.MU.DEV.3', discipline: 'Music', strand: 'Developing Skills', description: 'Practice and rehearse systematically to improve', assessmentCriterion: 'B' },

  // Music - Criterion C: Thinking Creatively
  { notation: 'IB.MYP.M1.AR.MU.CRE.1', discipline: 'Music', strand: 'Thinking Creatively', description: 'Develop musical ideas to a point of realization', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M1.AR.MU.CRE.2', discipline: 'Music', strand: 'Thinking Creatively', description: 'Experiment with musical elements in composition', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M1.AR.MU.CRE.3', discipline: 'Music', strand: 'Thinking Creatively', description: 'Show willingness to explore new musical ideas', assessmentCriterion: 'C' },

  // Music - Criterion D: Responding
  { notation: 'IB.MYP.M1.AR.MU.RES.1', discipline: 'Music', strand: 'Responding', description: 'Construct meaning from music and explain personal interpretations', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M1.AR.MU.RES.2', discipline: 'Music', strand: 'Responding', description: 'Evaluate music and performances using appropriate vocabulary', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M1.AR.MU.RES.3', discipline: 'Music', strand: 'Responding', description: 'Reflect on own learning and set goals for improvement', assessmentCriterion: 'D' },
];

// ============================================================================
// MYP YEAR 2 (Grade 7, Ages 12-13)
// ============================================================================
const mypYear2Standards: IBArtStandard[] = [
  // Visual Arts
  { notation: 'IB.MYP.M2.AR.VA.INV.1', discipline: 'Visual Arts', strand: 'Investigating', description: 'Analyze the purpose and meaning of visual arts in cultural contexts', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M2.AR.VA.INV.2', discipline: 'Visual Arts', strand: 'Investigating', description: 'Compare art from different cultures and time periods', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M2.AR.VA.INV.3', discipline: 'Visual Arts', strand: 'Investigating', description: 'Identify artistic influences on contemporary art practices', assessmentCriterion: 'A' },

  { notation: 'IB.MYP.M2.AR.VA.DEV.1', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Apply skills and techniques with increasing proficiency', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.AR.VA.DEV.2', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Demonstrate the application of techniques in multiple media', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.AR.VA.DEV.3', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Select and use appropriate tools and materials purposefully', assessmentCriterion: 'B' },

  { notation: 'IB.MYP.M2.AR.VA.CRE.1', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Develop and refine artistic ideas through exploration', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M2.AR.VA.CRE.2', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Present a personal response showing experimentation', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M2.AR.VA.CRE.3', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Show exploration of ideas through the creative process', assessmentCriterion: 'C' },

  { notation: 'IB.MYP.M2.AR.VA.RES.1', discipline: 'Visual Arts', strand: 'Responding', description: 'Analyze and interpret the meaning of artworks', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M2.AR.VA.RES.2', discipline: 'Visual Arts', strand: 'Responding', description: 'Critically evaluate the artwork of self and others', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M2.AR.VA.RES.3', discipline: 'Visual Arts', strand: 'Responding', description: 'Make connections between art and personal experiences', assessmentCriterion: 'D' },

  // Music
  { notation: 'IB.MYP.M2.AR.MU.INV.1', discipline: 'Music', strand: 'Investigating', description: 'Analyze the role and significance of music in society', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M2.AR.MU.INV.2', discipline: 'Music', strand: 'Investigating', description: 'Compare musical traditions from different cultures', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M2.AR.MU.INV.3', discipline: 'Music', strand: 'Investigating', description: 'Identify how historical events influence music', assessmentCriterion: 'A' },

  { notation: 'IB.MYP.M2.AR.MU.DEV.1', discipline: 'Music', strand: 'Developing Skills', description: 'Apply technical skills with increasing accuracy', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.AR.MU.DEV.2', discipline: 'Music', strand: 'Developing Skills', description: 'Perform music with attention to dynamics and expression', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M2.AR.MU.DEV.3', discipline: 'Music', strand: 'Developing Skills', description: 'Read and interpret increasingly complex notation', assessmentCriterion: 'B' },

  { notation: 'IB.MYP.M2.AR.MU.CRE.1', discipline: 'Music', strand: 'Thinking Creatively', description: 'Compose music using varied elements and structures', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M2.AR.MU.CRE.2', discipline: 'Music', strand: 'Thinking Creatively', description: 'Experiment with different compositional techniques', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M2.AR.MU.CRE.3', discipline: 'Music', strand: 'Thinking Creatively', description: 'Show originality in musical ideas and expression', assessmentCriterion: 'C' },

  { notation: 'IB.MYP.M2.AR.MU.RES.1', discipline: 'Music', strand: 'Responding', description: 'Analyze the use of musical elements in compositions', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M2.AR.MU.RES.2', discipline: 'Music', strand: 'Responding', description: 'Evaluate performances and compositions critically', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M2.AR.MU.RES.3', discipline: 'Music', strand: 'Responding', description: 'Reflect on progress and identify areas for development', assessmentCriterion: 'D' },
];

// ============================================================================
// MYP YEAR 3 (Grade 8, Ages 13-14)
// ============================================================================
const mypYear3Standards: IBArtStandard[] = [
  // Visual Arts
  { notation: 'IB.MYP.M3.AR.VA.INV.1', discipline: 'Visual Arts', strand: 'Investigating', description: 'Evaluate how social, cultural, and historical factors influence art', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M3.AR.VA.INV.2', discipline: 'Visual Arts', strand: 'Investigating', description: 'Analyze the work of artists and connect to own practice', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M3.AR.VA.INV.3', discipline: 'Visual Arts', strand: 'Investigating', description: 'Research art movements and their impact on contemporary art', assessmentCriterion: 'A' },

  { notation: 'IB.MYP.M3.AR.VA.DEV.1', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Demonstrate competent application of skills across media', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.AR.VA.DEV.2', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Apply techniques that communicate artistic intentions', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.AR.VA.DEV.3', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Adapt and refine techniques based on reflection', assessmentCriterion: 'B' },

  { notation: 'IB.MYP.M3.AR.VA.CRE.1', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Develop a personal artistic concept through sustained exploration', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M3.AR.VA.CRE.2', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Create work that shows a clear development of ideas', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M3.AR.VA.CRE.3', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Take creative risks and explore unconventional approaches', assessmentCriterion: 'C' },

  { notation: 'IB.MYP.M3.AR.VA.RES.1', discipline: 'Visual Arts', strand: 'Responding', description: 'Formulate and justify informed opinions about art', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M3.AR.VA.RES.2', discipline: 'Visual Arts', strand: 'Responding', description: 'Analyze and evaluate creative decisions in artworks', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M3.AR.VA.RES.3', discipline: 'Visual Arts', strand: 'Responding', description: 'Connect artistic practice to broader themes and issues', assessmentCriterion: 'D' },

  // Music
  { notation: 'IB.MYP.M3.AR.MU.INV.1', discipline: 'Music', strand: 'Investigating', description: 'Evaluate the influence of context on musical creation', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M3.AR.MU.INV.2', discipline: 'Music', strand: 'Investigating', description: 'Analyze how technology has changed music creation and distribution', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M3.AR.MU.INV.3', discipline: 'Music', strand: 'Investigating', description: 'Research the evolution of musical genres and styles', assessmentCriterion: 'A' },

  { notation: 'IB.MYP.M3.AR.MU.DEV.1', discipline: 'Music', strand: 'Developing Skills', description: 'Demonstrate competence in performance techniques', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.AR.MU.DEV.2', discipline: 'Music', strand: 'Developing Skills', description: 'Apply music theory to composition and analysis', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M3.AR.MU.DEV.3', discipline: 'Music', strand: 'Developing Skills', description: 'Use music technology effectively in creation and performance', assessmentCriterion: 'B' },

  { notation: 'IB.MYP.M3.AR.MU.CRE.1', discipline: 'Music', strand: 'Thinking Creatively', description: 'Compose original music with clear structure and form', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M3.AR.MU.CRE.2', discipline: 'Music', strand: 'Thinking Creatively', description: 'Arrange and adapt existing music creatively', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M3.AR.MU.CRE.3', discipline: 'Music', strand: 'Thinking Creatively', description: 'Demonstrate originality in musical expression', assessmentCriterion: 'C' },

  { notation: 'IB.MYP.M3.AR.MU.RES.1', discipline: 'Music', strand: 'Responding', description: 'Provide informed analysis of musical works', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M3.AR.MU.RES.2', discipline: 'Music', strand: 'Responding', description: 'Evaluate artistic choices in music critically', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M3.AR.MU.RES.3', discipline: 'Music', strand: 'Responding', description: 'Reflect meaningfully on the creative process', assessmentCriterion: 'D' },
];

// ============================================================================
// MYP YEAR 4 (Grade 9, Ages 14-15)
// ============================================================================
const mypYear4Standards: IBArtStandard[] = [
  // Visual Arts
  { notation: 'IB.MYP.M4.AR.VA.INV.1', discipline: 'Visual Arts', strand: 'Investigating', description: 'Synthesize research to inform personal artistic practice', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M4.AR.VA.INV.2', discipline: 'Visual Arts', strand: 'Investigating', description: 'Evaluate diverse perspectives and their influence on art', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M4.AR.VA.INV.3', discipline: 'Visual Arts', strand: 'Investigating', description: 'Analyze global connections and influences in contemporary art', assessmentCriterion: 'A' },

  { notation: 'IB.MYP.M4.AR.VA.DEV.1', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Demonstrate proficient application of advanced techniques', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M4.AR.VA.DEV.2', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Select and combine techniques to achieve artistic goals', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M4.AR.VA.DEV.3', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Demonstrate mastery in chosen media and processes', assessmentCriterion: 'B' },

  { notation: 'IB.MYP.M4.AR.VA.CRE.1', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Develop a coherent body of work with a clear artistic vision', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M4.AR.VA.CRE.2', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Demonstrate innovation and personal expression', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M4.AR.VA.CRE.3', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Show sophistication in the development of ideas', assessmentCriterion: 'C' },

  { notation: 'IB.MYP.M4.AR.VA.RES.1', discipline: 'Visual Arts', strand: 'Responding', description: 'Critically evaluate art using sophisticated analysis', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M4.AR.VA.RES.2', discipline: 'Visual Arts', strand: 'Responding', description: 'Articulate the relationship between intention and outcome', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M4.AR.VA.RES.3', discipline: 'Visual Arts', strand: 'Responding', description: 'Evaluate own work in relation to artistic traditions', assessmentCriterion: 'D' },

  // Music
  { notation: 'IB.MYP.M4.AR.MU.INV.1', discipline: 'Music', strand: 'Investigating', description: 'Synthesize research on music from multiple contexts', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M4.AR.MU.INV.2', discipline: 'Music', strand: 'Investigating', description: 'Evaluate the impact of globalization on music', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M4.AR.MU.INV.3', discipline: 'Music', strand: 'Investigating', description: 'Analyze how music reflects and influences society', assessmentCriterion: 'A' },

  { notation: 'IB.MYP.M4.AR.MU.DEV.1', discipline: 'Music', strand: 'Developing Skills', description: 'Demonstrate proficient performance skills', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M4.AR.MU.DEV.2', discipline: 'Music', strand: 'Developing Skills', description: 'Apply advanced music theory in composition', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M4.AR.MU.DEV.3', discipline: 'Music', strand: 'Developing Skills', description: 'Demonstrate mastery of chosen instrument or voice', assessmentCriterion: 'B' },

  { notation: 'IB.MYP.M4.AR.MU.CRE.1', discipline: 'Music', strand: 'Thinking Creatively', description: 'Create compositions that demonstrate artistic vision', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M4.AR.MU.CRE.2', discipline: 'Music', strand: 'Thinking Creatively', description: 'Demonstrate innovation in musical expression', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M4.AR.MU.CRE.3', discipline: 'Music', strand: 'Thinking Creatively', description: 'Show sophistication in creative choices', assessmentCriterion: 'C' },

  { notation: 'IB.MYP.M4.AR.MU.RES.1', discipline: 'Music', strand: 'Responding', description: 'Provide sophisticated analysis of musical works', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M4.AR.MU.RES.2', discipline: 'Music', strand: 'Responding', description: 'Evaluate the effectiveness of creative decisions', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M4.AR.MU.RES.3', discipline: 'Music', strand: 'Responding', description: 'Reflect critically on artistic growth and development', assessmentCriterion: 'D' },
];

// ============================================================================
// MYP YEAR 5 (Grade 10, Ages 15-16) - Pre-DP Preparation
// ============================================================================
const mypYear5Standards: IBArtStandard[] = [
  // Visual Arts
  { notation: 'IB.MYP.M5.AR.VA.INV.1', discipline: 'Visual Arts', strand: 'Investigating', description: 'Conduct comprehensive research to inform artistic practice', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M5.AR.VA.INV.2', discipline: 'Visual Arts', strand: 'Investigating', description: 'Analyze the function and significance of art across cultures', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M5.AR.VA.INV.3', discipline: 'Visual Arts', strand: 'Investigating', description: 'Evaluate how art shapes and is shaped by society', assessmentCriterion: 'A' },

  { notation: 'IB.MYP.M5.AR.VA.DEV.1', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Demonstrate excellent application of skills and techniques', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M5.AR.VA.DEV.2', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Apply skills innovatively to realize artistic intentions', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M5.AR.VA.DEV.3', discipline: 'Visual Arts', strand: 'Developing Skills', description: 'Demonstrate expertise in chosen media and processes', assessmentCriterion: 'B' },

  { notation: 'IB.MYP.M5.AR.VA.CRE.1', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Create a sustained body of work with sophisticated artistic vision', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M5.AR.VA.CRE.2', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Demonstrate excellent creative thinking and risk-taking', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M5.AR.VA.CRE.3', discipline: 'Visual Arts', strand: 'Thinking Creatively', description: 'Present a highly developed personal artistic voice', assessmentCriterion: 'C' },

  { notation: 'IB.MYP.M5.AR.VA.RES.1', discipline: 'Visual Arts', strand: 'Responding', description: 'Construct excellent meaning and provide insightful interpretations', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M5.AR.VA.RES.2', discipline: 'Visual Arts', strand: 'Responding', description: 'Evaluate artwork with sophisticated critical analysis', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M5.AR.VA.RES.3', discipline: 'Visual Arts', strand: 'Responding', description: 'Articulate connections between art and global issues', assessmentCriterion: 'D' },

  // Music
  { notation: 'IB.MYP.M5.AR.MU.INV.1', discipline: 'Music', strand: 'Investigating', description: 'Conduct comprehensive research on musical topics', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M5.AR.MU.INV.2', discipline: 'Music', strand: 'Investigating', description: 'Evaluate the function and significance of music in society', assessmentCriterion: 'A' },
  { notation: 'IB.MYP.M5.AR.MU.INV.3', discipline: 'Music', strand: 'Investigating', description: 'Analyze how music reflects cultural identity and values', assessmentCriterion: 'A' },

  { notation: 'IB.MYP.M5.AR.MU.DEV.1', discipline: 'Music', strand: 'Developing Skills', description: 'Demonstrate excellent performance skills', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M5.AR.MU.DEV.2', discipline: 'Music', strand: 'Developing Skills', description: 'Apply advanced techniques innovatively', assessmentCriterion: 'B' },
  { notation: 'IB.MYP.M5.AR.MU.DEV.3', discipline: 'Music', strand: 'Developing Skills', description: 'Demonstrate expertise in performance and/or composition', assessmentCriterion: 'B' },

  { notation: 'IB.MYP.M5.AR.MU.CRE.1', discipline: 'Music', strand: 'Thinking Creatively', description: 'Create sophisticated compositions with personal voice', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M5.AR.MU.CRE.2', discipline: 'Music', strand: 'Thinking Creatively', description: 'Demonstrate excellent creative thinking and originality', assessmentCriterion: 'C' },
  { notation: 'IB.MYP.M5.AR.MU.CRE.3', discipline: 'Music', strand: 'Thinking Creatively', description: 'Present a highly developed musical identity', assessmentCriterion: 'C' },

  { notation: 'IB.MYP.M5.AR.MU.RES.1', discipline: 'Music', strand: 'Responding', description: 'Provide excellent analysis of musical works', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M5.AR.MU.RES.2', discipline: 'Music', strand: 'Responding', description: 'Critically evaluate music with sophisticated insight', assessmentCriterion: 'D' },
  { notation: 'IB.MYP.M5.AR.MU.RES.3', discipline: 'Music', strand: 'Responding', description: 'Reflect on artistic development and future goals', assessmentCriterion: 'D' },
];

// ============================================================================
// DP YEAR 1 (Grade 11, Ages 16-17)
// ============================================================================
const dpYear1Standards: IBArtStandard[] = [
  // Visual Arts - Visual Arts in Context
  { notation: 'IB.DP.DP1.AR.VA.CTX.1', discipline: 'Visual Arts', strand: 'Visual Arts in Context', description: 'Examine and compare artworks from different cultural contexts' },
  { notation: 'IB.DP.DP1.AR.VA.CTX.2', discipline: 'Visual Arts', strand: 'Visual Arts in Context', description: 'Consider the contexts influencing own work and the work of others' },
  { notation: 'IB.DP.DP1.AR.VA.CTX.3', discipline: 'Visual Arts', strand: 'Visual Arts in Context', description: 'Develop informed response to exhibitions and art experiences' },
  { notation: 'IB.DP.DP1.AR.VA.CTX.4', discipline: 'Visual Arts', strand: 'Visual Arts in Context', description: 'Begin formulating personal intentions for art-making' },

  // Visual Arts - Visual Arts Methods
  { notation: 'IB.DP.DP1.AR.VA.MTH.1', discipline: 'Visual Arts', strand: 'Visual Arts Methods', description: 'Investigate different techniques for making art' },
  { notation: 'IB.DP.DP1.AR.VA.MTH.2', discipline: 'Visual Arts', strand: 'Visual Arts Methods', description: 'Experiment with diverse media and explore techniques' },
  { notation: 'IB.DP.DP1.AR.VA.MTH.3', discipline: 'Visual Arts', strand: 'Visual Arts Methods', description: 'Develop concepts through processes informed by skills and techniques' },
  { notation: 'IB.DP.DP1.AR.VA.MTH.4', discipline: 'Visual Arts', strand: 'Visual Arts Methods', description: 'Document experimentation and development in process portfolio' },

  // Visual Arts - Communicating Visual Arts
  { notation: 'IB.DP.DP1.AR.VA.COM.1', discipline: 'Visual Arts', strand: 'Communicating Visual Arts', description: 'Explore ways of communicating through visual and written means' },
  { notation: 'IB.DP.DP1.AR.VA.COM.2', discipline: 'Visual Arts', strand: 'Communicating Visual Arts', description: 'Make artistic choices about effective communication' },
  { notation: 'IB.DP.DP1.AR.VA.COM.3', discipline: 'Visual Arts', strand: 'Communicating Visual Arts', description: 'Begin developing comparative study skills' },

  // Visual Arts - HL Extensions
  { notation: 'IB.DP.DP1.AR.VA.HL.1', discipline: 'Visual Arts', strand: 'HL Extension', description: 'Reflect on how practices have been influenced by artists examined', isHL: true },
  { notation: 'IB.DP.DP1.AR.VA.HL.2', discipline: 'Visual Arts', strand: 'HL Extension', description: 'Work in at least three different art-making forms', isHL: true },

  // Music - Exploring Music in Context
  { notation: 'IB.DP.DP1.AR.MU.EXP.1', discipline: 'Music', strand: 'Exploring Music in Context', description: 'Engage with diverse range of music from different contexts' },
  { notation: 'IB.DP.DP1.AR.MU.EXP.2', discipline: 'Music', strand: 'Exploring Music in Context', description: 'Demonstrate diversity in exploration of musical works' },
  { notation: 'IB.DP.DP1.AR.MU.EXP.3', discipline: 'Music', strand: 'Exploring Music in Context', description: 'Apply areas of inquiry in personal and local contexts' },
  { notation: 'IB.DP.DP1.AR.MU.EXP.4', discipline: 'Music', strand: 'Exploring Music in Context', description: 'Develop deep listening skills' },

  // Music - Experimenting with Music
  { notation: 'IB.DP.DP1.AR.MU.EXM.1', discipline: 'Music', strand: 'Experimenting with Music', description: 'Connect theoretical studies to practical work' },
  { notation: 'IB.DP.DP1.AR.MU.EXM.2', discipline: 'Music', strand: 'Experimenting with Music', description: 'Experiment with musical material from areas of inquiry' },
  { notation: 'IB.DP.DP1.AR.MU.EXM.3', discipline: 'Music', strand: 'Experimenting with Music', description: 'Work as researcher, creator, and performer' },
  { notation: 'IB.DP.DP1.AR.MU.EXM.4', discipline: 'Music', strand: 'Experimenting with Music', description: 'Develop performance proficiency' },

  // Music - Presenting Music
  { notation: 'IB.DP.DP1.AR.MU.PRE.1', discipline: 'Music', strand: 'Presenting Music', description: 'Practice and prepare pieces for performance' },
  { notation: 'IB.DP.DP1.AR.MU.PRE.2', discipline: 'Music', strand: 'Presenting Music', description: 'Expand musical identity through performance' },
  { notation: 'IB.DP.DP1.AR.MU.PRE.3', discipline: 'Music', strand: 'Presenting Music', description: 'Develop compositional craft' },
];

// ============================================================================
// DP YEAR 2 (Grade 12, Ages 17-18)
// ============================================================================
const dpYear2Standards: IBArtStandard[] = [
  // Visual Arts - Context (Advanced)
  { notation: 'IB.DP.DP2.AR.VA.CTX.1', discipline: 'Visual Arts', strand: 'Visual Arts in Context', description: 'Complete comparative study analyzing at least 3 artworks by at least 2 artists' },
  { notation: 'IB.DP.DP2.AR.VA.CTX.2', discipline: 'Visual Arts', strand: 'Visual Arts in Context', description: 'Demonstrate critical and contextual investigation skills' },
  { notation: 'IB.DP.DP2.AR.VA.CTX.3', discipline: 'Visual Arts', strand: 'Visual Arts in Context', description: 'Present comparative study over 10-15 pages (SL) or 13-18 pages (HL)' },

  // Visual Arts - Methods (Advanced)
  { notation: 'IB.DP.DP2.AR.VA.MTH.1', discipline: 'Visual Arts', strand: 'Visual Arts Methods', description: 'Complete process portfolio demonstrating experimentation and refinement' },
  { notation: 'IB.DP.DP2.AR.VA.MTH.2', discipline: 'Visual Arts', strand: 'Visual Arts Methods', description: 'Submit work in at least 2 (SL) or 3 (HL) different art-making forms' },
  { notation: 'IB.DP.DP2.AR.VA.MTH.3', discipline: 'Visual Arts', strand: 'Visual Arts Methods', description: 'Demonstrate manipulation and refinement of visual arts activities' },

  // Visual Arts - Communication (Advanced)
  { notation: 'IB.DP.DP2.AR.VA.COM.1', discipline: 'Visual Arts', strand: 'Communicating Visual Arts', description: 'Present exhibition of 4-7 (SL) or 8-11 (HL) resolved artworks' },
  { notation: 'IB.DP.DP2.AR.VA.COM.2', discipline: 'Visual Arts', strand: 'Communicating Visual Arts', description: 'Write exhibition text for each artwork' },
  { notation: 'IB.DP.DP2.AR.VA.COM.3', discipline: 'Visual Arts', strand: 'Communicating Visual Arts', description: 'Complete curatorial rationale (400 words SL / 700 words HL)' },
  { notation: 'IB.DP.DP2.AR.VA.COM.4', discipline: 'Visual Arts', strand: 'Communicating Visual Arts', description: 'Demonstrate technical accomplishment and understanding of materials' },

  // Visual Arts - HL Extensions
  { notation: 'IB.DP.DP2.AR.VA.HL.1', discipline: 'Visual Arts', strand: 'HL Extension', description: 'Complete extended comparative study with reflection on influences (3-5 pages)', isHL: true },
  { notation: 'IB.DP.DP2.AR.VA.HL.2', discipline: 'Visual Arts', strand: 'HL Extension', description: 'Submit process portfolio of 13-25 pages', isHL: true },
  { notation: 'IB.DP.DP2.AR.VA.HL.3', discipline: 'Visual Arts', strand: 'HL Extension', description: 'Present exhibition of 8-11 pieces with 700-word curatorial rationale', isHL: true },

  // Music - Exploring (Assessment)
  { notation: 'IB.DP.DP2.AR.MU.EXP.1', discipline: 'Music', strand: 'Exploring Music in Context', description: 'Complete portfolio exploring music in context' },
  { notation: 'IB.DP.DP2.AR.MU.EXP.2', discipline: 'Music', strand: 'Exploring Music in Context', description: 'Demonstrate ability to discuss music critically' },
  { notation: 'IB.DP.DP2.AR.MU.EXP.3', discipline: 'Music', strand: 'Exploring Music in Context', description: 'Justify creative choices in written and oral formats' },

  // Music - Experimenting (Assessment)
  { notation: 'IB.DP.DP2.AR.MU.EXM.1', discipline: 'Music', strand: 'Experimenting with Music', description: 'Complete report evidencing research and experimentation' },
  { notation: 'IB.DP.DP2.AR.MU.EXM.2', discipline: 'Music', strand: 'Experimenting with Music', description: 'Demonstrate creating and performing tasks' },
  { notation: 'IB.DP.DP2.AR.MU.EXM.3', discipline: 'Music', strand: 'Experimenting with Music', description: 'Show evidence of sustained experimentation' },

  // Music - Presenting (Assessment)
  { notation: 'IB.DP.DP2.AR.MU.PRE.1', discipline: 'Music', strand: 'Presenting Music', description: 'Submit diverse programme of created and performed works' },
  { notation: 'IB.DP.DP2.AR.MU.PRE.2', discipline: 'Music', strand: 'Presenting Music', description: 'Demonstrate level of musicianship' },
  { notation: 'IB.DP.DP2.AR.MU.PRE.3', discipline: 'Music', strand: 'Presenting Music', description: 'Communicate music effectively to audience' },

  // Music - HL: Contemporary Music Maker
  { notation: 'IB.DP.DP2.AR.MU.HL.1', discipline: 'Music', strand: 'Contemporary Music Maker', description: 'Plan and collaboratively create a project', isHL: true },
  { notation: 'IB.DP.DP2.AR.MU.HL.2', discipline: 'Music', strand: 'Contemporary Music Maker', description: 'Engage with real-life practices of music-making', isHL: true },
  { notation: 'IB.DP.DP2.AR.MU.HL.3', discipline: 'Music', strand: 'Contemporary Music Maker', description: 'Submit multimedia presentation', isHL: true },
  { notation: 'IB.DP.DP2.AR.MU.HL.4', discipline: 'Music', strand: 'Contemporary Music Maker', description: 'Demonstrate capacity for entrepreneurship in music', isHL: true },
];

// ============================================================================
// EXPORT LEVEL DATA
// ============================================================================
export const ibArtsLevels: IBArtLevel[] = [
  // PYP
  {
    level: 'A1',
    levelLabel: 'PYP Age Band 1',
    gradeEquivalent: 'Pre-K to K',
    ageRangeMin: 3,
    ageRangeMax: 5,
    programme: 'PYP',
    standards: pypAgeBand1Standards,
  },
  {
    level: 'A2',
    levelLabel: 'PYP Age Band 2',
    gradeEquivalent: 'K-Grade 1',
    ageRangeMin: 5,
    ageRangeMax: 7,
    programme: 'PYP',
    standards: pypAgeBand2Standards,
  },
  {
    level: 'A3',
    levelLabel: 'PYP Age Band 3',
    gradeEquivalent: 'Grades 2-3',
    ageRangeMin: 7,
    ageRangeMax: 9,
    programme: 'PYP',
    standards: pypAgeBand3Standards,
  },
  {
    level: 'A4',
    levelLabel: 'PYP Age Band 4',
    gradeEquivalent: 'Grades 4-5',
    ageRangeMin: 9,
    ageRangeMax: 12,
    programme: 'PYP',
    standards: pypAgeBand4Standards,
  },
  // MYP
  {
    level: 'M1',
    levelLabel: 'MYP Year 1',
    gradeEquivalent: 'Grade 6',
    ageRangeMin: 11,
    ageRangeMax: 12,
    programme: 'MYP',
    standards: mypYear1Standards,
  },
  {
    level: 'M2',
    levelLabel: 'MYP Year 2',
    gradeEquivalent: 'Grade 7',
    ageRangeMin: 12,
    ageRangeMax: 13,
    programme: 'MYP',
    standards: mypYear2Standards,
  },
  {
    level: 'M3',
    levelLabel: 'MYP Year 3',
    gradeEquivalent: 'Grade 8',
    ageRangeMin: 13,
    ageRangeMax: 14,
    programme: 'MYP',
    standards: mypYear3Standards,
  },
  {
    level: 'M4',
    levelLabel: 'MYP Year 4',
    gradeEquivalent: 'Grade 9',
    ageRangeMin: 14,
    ageRangeMax: 15,
    programme: 'MYP',
    standards: mypYear4Standards,
  },
  {
    level: 'M5',
    levelLabel: 'MYP Year 5',
    gradeEquivalent: 'Grade 10',
    ageRangeMin: 15,
    ageRangeMax: 16,
    programme: 'MYP',
    standards: mypYear5Standards,
  },
  // DP
  {
    level: 'DP1',
    levelLabel: 'DP Year 1',
    gradeEquivalent: 'Grade 11',
    ageRangeMin: 16,
    ageRangeMax: 17,
    programme: 'DP',
    standards: dpYear1Standards,
  },
  {
    level: 'DP2',
    levelLabel: 'DP Year 2',
    gradeEquivalent: 'Grade 12',
    ageRangeMin: 17,
    ageRangeMax: 18,
    programme: 'DP',
    standards: dpYear2Standards,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getArtsStandardsByLevel(level: string): IBArtStandard[] {
  const levelData = ibArtsLevels.find(l => l.level === level);
  return levelData?.standards || [];
}

export function getAllArtsStandards(): IBArtStandard[] {
  return ibArtsLevels.flatMap(l => l.standards);
}

export function getArtsStandardsByProgramme(programme: 'PYP' | 'MYP' | 'DP'): IBArtStandard[] {
  return ibArtsLevels
    .filter(l => l.programme === programme)
    .flatMap(l => l.standards);
}

export function getArtsStandardsByDiscipline(discipline: 'Visual Arts' | 'Music'): IBArtStandard[] {
  return getAllArtsStandards().filter(s => s.discipline === discipline);
}

export function getArtsHLStandards(): IBArtStandard[] {
  return getAllArtsStandards().filter(s => s.isHL);
}

export function getArtsStandardsCount(): number {
  return getAllArtsStandards().length;
}

export default {
  levels: ibArtsLevels,
  getStandardsByLevel: getArtsStandardsByLevel,
  getAllStandards: getAllArtsStandards,
  getStandardsByProgramme: getArtsStandardsByProgramme,
  getStandardsByDiscipline: getArtsStandardsByDiscipline,
  getHLStandards: getArtsHLStandards,
  getStandardsCount: getArtsStandardsCount,
};
