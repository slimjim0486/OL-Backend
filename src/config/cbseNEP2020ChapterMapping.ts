/**
 * CBSE NEP 2020 Chapter Mapping - Implementation Plan
 *
 * This file defines the structure for mapping our skill-based learning standards
 * to the new NEP 2020 (2024-25 onwards) NCERT textbook chapters.
 *
 * STATUS: PENDING IMPLEMENTATION
 *
 * Why this matters:
 * - Indian students/parents reference chapters, not learning objectives
 * - "Help with Chapter 5" is more common than "Help with adding fractions"
 * - Traditional tutors know exact NCERT chapters; we need parity to compete
 *
 * Implementation Phases:
 * 1. Scrape/compile official NEP 2020 chapter lists from NCERT
 * 2. Map each standard to its corresponding chapter(s)
 * 3. Add exercise-level granularity (NCERT exercises per chapter)
 * 4. Build search/discovery layer ("Chapter 5" → standards → lessons)
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface NEP2020Chapter {
  chapterNumber: number;
  chapterName: string;
  textbook: string; // e.g., "Joyful Mathematics", "Curiosity"
  topics: string[]; // Key topics covered
}

export interface NEP2020ClassChapters {
  class: number;
  subject: 'MATH' | 'SCIENCE' | 'ENGLISH';
  textbookName: string;
  chapters: NEP2020Chapter[];
}

export interface StandardToChapterMapping {
  standardNotation: string; // e.g., "IN.CBSE.C6.MA.INT.1"
  chapters: string[]; // Chapter names this standard maps to
  exercises?: string[]; // Optional: specific NCERT exercises
}

// =============================================================================
// NEP 2020 TEXTBOOK STRUCTURE (From Official NCERT 2024-25)
// =============================================================================

/**
 * Official NEP 2020 Textbook Names:
 *
 * MATHEMATICS:
 * - Classes 1-5: "Joyful Mathematics" (Aanandmay Ganit)
 * - Classes 6-8: "Ganit Prakash" (Mathematics Illumination)
 *
 * SCIENCE:
 * - Classes 1-2: Integrated with EVS
 * - Classes 3-5: "Curiosity" (Jigyasa) - EVS
 * - Classes 6-8: "Curiosity" (Jigyasa) - Science
 *
 * ENGLISH:
 * - Classes 1-5: "Mridang" (New series)
 * - Classes 6-8: Various readers (updated selections)
 */

// =============================================================================
// KNOWN NEP 2020 CHAPTERS (From Cross-Reference Research)
// =============================================================================

export const nep2020MathChapters: NEP2020ClassChapters[] = [
  {
    class: 6,
    subject: 'MATH',
    textbookName: 'Ganit Prakash',
    chapters: [
      { chapterNumber: 1, chapterName: 'Patterns in Mathematics', textbook: 'Ganit Prakash', topics: ['sequences', 'patterns', 'relationships'] },
      { chapterNumber: 2, chapterName: 'Lines and Angles', textbook: 'Ganit Prakash', topics: ['points', 'lines', 'rays', 'angles'] },
      { chapterNumber: 3, chapterName: 'Number Play', textbook: 'Ganit Prakash', topics: ['number patterns', 'divisibility'] },
      { chapterNumber: 4, chapterName: 'Data Handling and Presentation', textbook: 'Ganit Prakash', topics: ['data collection', 'graphs', 'charts'] },
      { chapterNumber: 5, chapterName: 'Prime Time', textbook: 'Ganit Prakash', topics: ['prime numbers', 'factors', 'multiples'] },
      { chapterNumber: 6, chapterName: 'Perimeter and Area', textbook: 'Ganit Prakash', topics: ['perimeter', 'area', 'measurement'] },
      { chapterNumber: 7, chapterName: 'Fractions', textbook: 'Ganit Prakash', topics: ['fractions', 'equivalent fractions', 'operations'] },
      { chapterNumber: 8, chapterName: 'Playing with Constructions', textbook: 'Ganit Prakash', topics: ['geometric constructions', 'compass', 'ruler'] },
      { chapterNumber: 9, chapterName: 'Symmetry', textbook: 'Ganit Prakash', topics: ['line symmetry', 'rotational symmetry'] },
      { chapterNumber: 10, chapterName: 'The Other Side of Zero', textbook: 'Ganit Prakash', topics: ['integers', 'negative numbers', 'number line'] },
    ]
  },
  {
    class: 7,
    subject: 'MATH',
    textbookName: 'Ganit Prakash',
    chapters: [
      { chapterNumber: 1, chapterName: 'Numbers and Number Systems', textbook: 'Ganit Prakash', topics: ['integers', 'rational numbers'] },
      { chapterNumber: 2, chapterName: 'Fractions and Decimals', textbook: 'Ganit Prakash', topics: ['operations on fractions', 'decimals'] },
      { chapterNumber: 3, chapterName: 'Integers', textbook: 'Ganit Prakash', topics: ['operations on integers', 'properties'] },
      { chapterNumber: 4, chapterName: 'Lines and Angles', textbook: 'Ganit Prakash', topics: ['parallel lines', 'transversal', 'angle relationships'] },
      { chapterNumber: 5, chapterName: 'Triangles', textbook: 'Ganit Prakash', topics: ['types of triangles', 'properties', 'congruence'] },
      { chapterNumber: 6, chapterName: 'Ratio and Proportion', textbook: 'Ganit Prakash', topics: ['ratios', 'proportions', 'unitary method'] },
      { chapterNumber: 7, chapterName: 'Perimeter and Area', textbook: 'Ganit Prakash', topics: ['area of triangles', 'parallelograms'] },
      { chapterNumber: 8, chapterName: 'Algebraic Expressions', textbook: 'Ganit Prakash', topics: ['terms', 'coefficients', 'like terms'] },
      { chapterNumber: 9, chapterName: 'Exponents and Powers', textbook: 'Ganit Prakash', topics: ['exponents', 'laws of exponents'] },
      { chapterNumber: 10, chapterName: 'Data Handling', textbook: 'Ganit Prakash', topics: ['mean', 'median', 'mode', 'bar graphs'] },
    ]
  },
  {
    class: 8,
    subject: 'MATH',
    textbookName: 'Ganit Prakash',
    chapters: [
      { chapterNumber: 1, chapterName: 'Rational Numbers', textbook: 'Ganit Prakash', topics: ['properties', 'operations', 'number line'] },
      { chapterNumber: 2, chapterName: 'Linear Equations in One Variable', textbook: 'Ganit Prakash', topics: ['solving equations', 'word problems'] },
      { chapterNumber: 3, chapterName: 'Understanding Quadrilaterals', textbook: 'Ganit Prakash', topics: ['types', 'properties', 'angle sum'] },
      { chapterNumber: 4, chapterName: 'Data Handling', textbook: 'Ganit Prakash', topics: ['pie charts', 'probability'] },
      { chapterNumber: 5, chapterName: 'Squares and Square Roots', textbook: 'Ganit Prakash', topics: ['perfect squares', 'square roots'] },
      { chapterNumber: 6, chapterName: 'Cubes and Cube Roots', textbook: 'Ganit Prakash', topics: ['perfect cubes', 'cube roots'] },
      { chapterNumber: 7, chapterName: 'Comparing Quantities', textbook: 'Ganit Prakash', topics: ['percentages', 'profit/loss', 'interest'] },
      { chapterNumber: 8, chapterName: 'Algebraic Expressions', textbook: 'Ganit Prakash', topics: ['identities', 'factorization'] },
      { chapterNumber: 9, chapterName: 'Mensuration', textbook: 'Ganit Prakash', topics: ['surface area', 'volume'] },
      { chapterNumber: 10, chapterName: 'Exponents and Powers', textbook: 'Ganit Prakash', topics: ['negative exponents', 'scientific notation'] },
      { chapterNumber: 11, chapterName: 'Direct and Inverse Proportions', textbook: 'Ganit Prakash', topics: ['direct proportion', 'inverse proportion'] },
      { chapterNumber: 12, chapterName: 'Factorization', textbook: 'Ganit Prakash', topics: ['factoring expressions', 'division'] },
      { chapterNumber: 13, chapterName: 'Introduction to Graphs', textbook: 'Ganit Prakash', topics: ['linear graphs', 'coordinates'] },
    ]
  }
];

export const nep2020ScienceChapters: NEP2020ClassChapters[] = [
  {
    class: 6,
    subject: 'SCIENCE',
    textbookName: 'Curiosity (Jigyasa)',
    chapters: [
      { chapterNumber: 1, chapterName: 'The Wonderful World of Science', textbook: 'Curiosity', topics: ['scientific method', 'observation'] },
      { chapterNumber: 2, chapterName: 'Diversity in the Living World', textbook: 'Curiosity', topics: ['classification', 'biodiversity'] },
      { chapterNumber: 3, chapterName: 'Mindful Eating: A Path to a Healthy Body', textbook: 'Curiosity', topics: ['nutrition', 'balanced diet'] },
      { chapterNumber: 4, chapterName: 'Exploring Magnets', textbook: 'Curiosity', topics: ['magnetic properties', 'poles', 'compass'] },
      { chapterNumber: 5, chapterName: 'Measurement of Length and Motion', textbook: 'Curiosity', topics: ['units', 'motion types'] },
      { chapterNumber: 6, chapterName: 'Materials Around Us', textbook: 'Curiosity', topics: ['materials classification', 'properties'] },
      { chapterNumber: 7, chapterName: 'Temperature and Its Measurement', textbook: 'Curiosity', topics: ['thermometer', 'heat transfer'] },
      { chapterNumber: 8, chapterName: 'A Journey through States of Matter', textbook: 'Curiosity', topics: ['states of matter', 'changes'] },
      { chapterNumber: 9, chapterName: 'Methods of Separation', textbook: 'Curiosity', topics: ['filtration', 'evaporation', 'sedimentation'] },
      { chapterNumber: 10, chapterName: 'Living Creatures: Exploring their Characteristics', textbook: 'Curiosity', topics: ['life processes', 'adaptations'] },
      { chapterNumber: 11, chapterName: 'Nature\'s Treasures', textbook: 'Curiosity', topics: ['natural resources', 'conservation'] },
      { chapterNumber: 12, chapterName: 'Beyond Earth', textbook: 'Curiosity', topics: ['solar system', 'space exploration'] },
    ]
  },
  {
    class: 7,
    subject: 'SCIENCE',
    textbookName: 'Curiosity (Jigyasa)',
    chapters: [
      { chapterNumber: 1, chapterName: 'The Ever Evolving World of Science', textbook: 'Curiosity', topics: ['scientific discoveries', 'evolution of science'] },
      { chapterNumber: 2, chapterName: 'Exploring Substances', textbook: 'Curiosity', topics: ['pure substances', 'mixtures', 'solutions'] },
      { chapterNumber: 3, chapterName: 'Electricity - Circuits and Beyond', textbook: 'Curiosity', topics: ['circuits', 'current', 'conductors'] },
      { chapterNumber: 4, chapterName: 'Atoms and Molecules', textbook: 'Curiosity', topics: ['atomic structure', 'molecules'] },
      { chapterNumber: 5, chapterName: 'Structure and Function of Organisms', textbook: 'Curiosity', topics: ['cells', 'tissues', 'organs'] },
      { chapterNumber: 6, chapterName: 'Heat and Temperature', textbook: 'Curiosity', topics: ['heat transfer', 'thermal equilibrium'] },
      { chapterNumber: 7, chapterName: 'How Things Move', textbook: 'Curiosity', topics: ['types of motion', 'speed', 'distance'] },
      { chapterNumber: 8, chapterName: 'Respiration in Organisms', textbook: 'Curiosity', topics: ['breathing', 'cellular respiration'] },
      { chapterNumber: 9, chapterName: 'Plant Life', textbook: 'Curiosity', topics: ['plant structure', 'photosynthesis'] },
      { chapterNumber: 10, chapterName: 'Water - Elixir of Life', textbook: 'Curiosity', topics: ['water cycle', 'water conservation'] },
      { chapterNumber: 11, chapterName: 'Environmental Changes and Impact', textbook: 'Curiosity', topics: ['climate', 'pollution'] },
      { chapterNumber: 12, chapterName: 'Universe: The Cosmic Quest', textbook: 'Curiosity', topics: ['stars', 'galaxies', 'universe'] },
    ]
  },
  {
    class: 8,
    subject: 'SCIENCE',
    textbookName: 'Curiosity (Jigyasa)',
    chapters: [
      { chapterNumber: 1, chapterName: 'Exploring the Investigative World of Science', textbook: 'Curiosity', topics: ['scientific inquiry', 'experiments'] },
      { chapterNumber: 2, chapterName: 'The Invisible Living World', textbook: 'Curiosity', topics: ['microorganisms', 'bacteria', 'viruses'] },
      { chapterNumber: 3, chapterName: 'Health: The Ultimate Treasure', textbook: 'Curiosity', topics: ['diseases', 'prevention', 'immunity'] },
      { chapterNumber: 4, chapterName: 'Synthetic Fibres and Plastics', textbook: 'Curiosity', topics: ['polymers', 'synthetic materials'] },
      { chapterNumber: 5, chapterName: 'Metals and Non-metals', textbook: 'Curiosity', topics: ['properties', 'reactions', 'uses'] },
      { chapterNumber: 6, chapterName: 'Combustion and Flame', textbook: 'Curiosity', topics: ['combustion', 'types of flames', 'fuel'] },
      { chapterNumber: 7, chapterName: 'Conservation of Plants and Animals', textbook: 'Curiosity', topics: ['biodiversity', 'endangered species'] },
      { chapterNumber: 8, chapterName: 'Cell - Structure and Function', textbook: 'Curiosity', topics: ['cell organelles', 'plant vs animal cells'] },
      { chapterNumber: 9, chapterName: 'Reproduction in Animals', textbook: 'Curiosity', topics: ['sexual', 'asexual reproduction'] },
      { chapterNumber: 10, chapterName: 'Force and Pressure', textbook: 'Curiosity', topics: ['types of forces', 'pressure'] },
      { chapterNumber: 11, chapterName: 'Friction', textbook: 'Curiosity', topics: ['types of friction', 'applications'] },
      { chapterNumber: 12, chapterName: 'Sound', textbook: 'Curiosity', topics: ['sound waves', 'pitch', 'loudness'] },
      { chapterNumber: 13, chapterName: 'Light', textbook: 'Curiosity', topics: ['reflection', 'refraction', 'human eye'] },
    ]
  }
];

// =============================================================================
// IMPLEMENTATION ROADMAP
// =============================================================================

/**
 * Phase 1: Complete Chapter Inventory (2-3 days)
 * - Scrape official NCERT PDFs for Classes 1-8 (all subjects)
 * - Extract chapter names, topics, and page numbers
 * - Verify against multiple sources (Vedantu, BYJU'S, official NCERT)
 *
 * Phase 2: Standard-to-Chapter Mapping (1 week)
 * - For each of our 639 standards, identify matching NEP 2020 chapter(s)
 * - Some standards may map to multiple chapters
 * - Some chapters may have no direct standard mapping (literature, etc.)
 *
 * Phase 3: Exercise-Level Granularity (2 weeks)
 * - Extract NCERT exercises per chapter
 * - Map exercises to standards
 * - Enable "help with Exercise 3.2" discovery
 *
 * Phase 4: Search/Discovery Layer (1 week)
 * - API endpoint: chapter name → relevant standards → lessons
 * - Fuzzy matching for chapter name variations
 * - "Important questions" tagging based on exam patterns
 */

// Placeholder for future mapping data
export const standardToChapterMappings: StandardToChapterMapping[] = [
  // Example mapping (to be populated):
  // {
  //   standardNotation: 'IN.CBSE.C6.MA.INT.1',
  //   chapters: ['The Other Side of Zero'],
  //   exercises: ['Ex 10.1', 'Ex 10.2']
  // }
];

/**
 * Utility function to find chapters for a standard
 * (To be implemented once mappings are populated)
 */
export function getChaptersForStandard(notation: string): string[] {
  const mapping = standardToChapterMappings.find(m => m.standardNotation === notation);
  return mapping?.chapters || [];
}

/**
 * Utility function to find standards for a chapter
 * (To be implemented once mappings are populated)
 */
export function getStandardsForChapter(chapterName: string): string[] {
  return standardToChapterMappings
    .filter(m => m.chapters.some(c => c.toLowerCase().includes(chapterName.toLowerCase())))
    .map(m => m.standardNotation);
}
