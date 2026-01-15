/**
 * CBSE (Central Board of Secondary Education) - Mathematics Standards
 * Classes 1-8 (Primary and Middle School)
 *
 * These are skill-based learning objectives aligned with the CBSE/NCERT
 * curriculum framework. Standards focus on measurable learning outcomes
 * rather than specific textbook chapters.
 *
 * NOTE: Chapter mapping to NEP 2020 textbooks (2024-25 onwards) is pending.
 * New NCERT textbooks include "Joyful Mathematics" (Classes 1-5) and
 * "Ganit Prakash" (Classes 6-8).
 *
 * Notation System: IN.CBSE.C{class}.MA.{strand}.{number}
 * - IN = India
 * - CBSE = Central Board of Secondary Education
 * - C = Class (1-8)
 * - MA = Mathematics
 * - Strand codes:
 *   - NUM = Numbers and Operations
 *   - GEO = Geometry
 *   - MEA = Measurement
 *   - DAT = Data Handling
 *   - PAT = Patterns and Algebra
 *   - FRA = Fractions and Decimals
 *   - RAT = Ratio and Proportion
 *   - INT = Integers
 *   - ALG = Algebra
 *   - MEN = Mensuration
 */

export interface CBSEMathStandard {
  notation: string;
  strand: string;
  description: string;
  chapter?: string; // Future: NEP 2020 NCERT chapter mapping
}

export interface CBSEMathClass {
  class: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: CBSEMathStandard[];
}

export interface CBSEMathCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  classes: CBSEMathClass[];
}

// =============================================================================
// CLASS 1 (Ages 6-7)
// NCERT: Math Magic Book 1
// =============================================================================

const class1Standards: CBSEMathStandard[] = [
  // NUMBERS AND OPERATIONS
  {
    notation: 'IN.CBSE.C1.MA.NUM.1',
    strand: 'Numbers and Operations',
    description: 'count objects up to 100 and write numerals',
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'read and write numerals from 1 to 100',
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.3',
    strand: 'Numbers and Operations',
    description: 'compare numbers using more than, less than, and equal to',
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.4',
    strand: 'Numbers and Operations',
    description: 'arrange numbers in ascending and descending order up to 100',
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.5',
    strand: 'Numbers and Operations',
    description: 'skip count in 2s, 5s, and 10s',
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.6',
    strand: 'Numbers and Operations',
    description: 'add single-digit numbers with sum up to 18',
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.7',
    strand: 'Numbers and Operations',
    description: 'subtract single-digit numbers from numbers up to 18',
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.8',
    strand: 'Numbers and Operations',
    description: 'solve simple word problems involving addition and subtraction',
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.9',
    strand: 'Numbers and Operations',
    description: 'identify the place value of digits in two-digit numbers (ones and tens)',
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C1.MA.GEO.1',
    strand: 'Geometry',
    description: 'identify and name basic 2D shapes: circle, triangle, rectangle, square',
  },
  {
    notation: 'IN.CBSE.C1.MA.GEO.2',
    strand: 'Geometry',
    description: 'recognize shapes in everyday objects',
  },
  {
    notation: 'IN.CBSE.C1.MA.GEO.3',
    strand: 'Geometry',
    description: 'classify objects based on shape',
  },
  {
    notation: 'IN.CBSE.C1.MA.GEO.4',
    strand: 'Geometry',
    description: 'understand concepts of inside, outside, above, below, near, far',
  },

  // MEASUREMENT
  {
    notation: 'IN.CBSE.C1.MA.MEA.1',
    strand: 'Measurement',
    description: 'compare lengths of objects using terms like longer, shorter, taller',
  },
  {
    notation: 'IN.CBSE.C1.MA.MEA.2',
    strand: 'Measurement',
    description: 'compare weights using heavy and light',
  },
  {
    notation: 'IN.CBSE.C1.MA.MEA.3',
    strand: 'Measurement',
    description: 'compare capacity using full, empty, more, less',
  },
  {
    notation: 'IN.CBSE.C1.MA.MEA.4',
    strand: 'Measurement',
    description: 'read time to the hour using an analog clock',
  },
  {
    notation: 'IN.CBSE.C1.MA.MEA.5',
    strand: 'Measurement',
    description: 'understand sequence of days of the week',
  },
  {
    notation: 'IN.CBSE.C1.MA.MEA.6',
    strand: 'Measurement',
    description: 'identify Indian currency notes and coins',
  },

  // PATTERNS
  {
    notation: 'IN.CBSE.C1.MA.PAT.1',
    strand: 'Patterns',
    description: 'recognize simple repeating patterns in shapes and numbers',
  },
  {
    notation: 'IN.CBSE.C1.MA.PAT.2',
    strand: 'Patterns',
    description: 'extend and create simple patterns',
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C1.MA.DAT.1',
    strand: 'Data Handling',
    description: 'collect and organize objects into groups',
  },
  {
    notation: 'IN.CBSE.C1.MA.DAT.2',
    strand: 'Data Handling',
    description: 'count objects in each group and compare',
  }
];

// =============================================================================
// CLASS 2 (Ages 7-8)
// NCERT: Math Magic Book 2
// =============================================================================

const class2Standards: CBSEMathStandard[] = [
  // NUMBERS AND OPERATIONS
  {
    notation: 'IN.CBSE.C2.MA.NUM.1',
    strand: 'Numbers and Operations',
    description: 'count, read, and write numbers up to 999',
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'understand place value of three-digit numbers (ones, tens, hundreds)',
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.3',
    strand: 'Numbers and Operations',
    description: 'compare three-digit numbers and arrange in order',
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.4',
    strand: 'Numbers and Operations',
    description: 'add two-digit numbers without regrouping',
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.5',
    strand: 'Numbers and Operations',
    description: 'add two-digit numbers with regrouping',
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.6',
    strand: 'Numbers and Operations',
    description: 'subtract two-digit numbers without borrowing',
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.7',
    strand: 'Numbers and Operations',
    description: 'subtract two-digit numbers with borrowing',
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.8',
    strand: 'Numbers and Operations',
    description: 'understand multiplication as repeated addition',
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.9',
    strand: 'Numbers and Operations',
    description: 'learn multiplication tables of 2, 3, 4, and 5',
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.10',
    strand: 'Numbers and Operations',
    description: 'understand division as equal sharing',
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.11',
    strand: 'Numbers and Operations',
    description: 'solve word problems involving addition, subtraction, and simple multiplication',
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C2.MA.GEO.1',
    strand: 'Geometry',
    description: 'identify and describe properties of 2D shapes (sides, corners)',
  },
  {
    notation: 'IN.CBSE.C2.MA.GEO.2',
    strand: 'Geometry',
    description: 'differentiate between straight and curved lines',
  },
  {
    notation: 'IN.CBSE.C2.MA.GEO.3',
    strand: 'Geometry',
    description: 'understand horizontal, vertical, and slanting lines',
  },
  {
    notation: 'IN.CBSE.C2.MA.GEO.4',
    strand: 'Geometry',
    description: 'create shapes using tangrams and pattern blocks',
  },

  // MEASUREMENT
  {
    notation: 'IN.CBSE.C2.MA.MEA.1',
    strand: 'Measurement',
    description: 'measure length using non-standard units (hand span, foot)',
  },
  {
    notation: 'IN.CBSE.C2.MA.MEA.2',
    strand: 'Measurement',
    description: 'estimate and measure length using a ruler in centimeters',
  },
  {
    notation: 'IN.CBSE.C2.MA.MEA.3',
    strand: 'Measurement',
    description: 'compare and order objects by weight',
  },
  {
    notation: 'IN.CBSE.C2.MA.MEA.4',
    strand: 'Measurement',
    description: 'estimate and measure capacity using non-standard and standard units',
  },
  {
    notation: 'IN.CBSE.C2.MA.MEA.5',
    strand: 'Measurement',
    description: 'read time to the half hour on an analog clock',
  },
  {
    notation: 'IN.CBSE.C2.MA.MEA.6',
    strand: 'Measurement',
    description: 'read a calendar and identify days, weeks, months',
  },
  {
    notation: 'IN.CBSE.C2.MA.MEA.7',
    strand: 'Measurement',
    description: 'add and subtract money amounts up to Rs 100',
  },

  // PATTERNS
  {
    notation: 'IN.CBSE.C2.MA.PAT.1',
    strand: 'Patterns',
    description: 'identify and extend number patterns',
  },
  {
    notation: 'IN.CBSE.C2.MA.PAT.2',
    strand: 'Patterns',
    description: 'create patterns using shapes and numbers',
  },
  {
    notation: 'IN.CBSE.C2.MA.PAT.3',
    strand: 'Patterns',
    description: 'identify odd and even numbers',
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C2.MA.DAT.1',
    strand: 'Data Handling',
    description: 'collect data and represent using pictographs',
  },
  {
    notation: 'IN.CBSE.C2.MA.DAT.2',
    strand: 'Data Handling',
    description: 'read and interpret simple pictographs',
  }
];

// =============================================================================
// CLASS 3 (Ages 8-9)
// NCERT: Math Magic Book 3
// =============================================================================

const class3Standards: CBSEMathStandard[] = [
  // NUMBERS AND OPERATIONS
  {
    notation: 'IN.CBSE.C3.MA.NUM.1',
    strand: 'Numbers and Operations',
    description: 'read, write, and compare numbers up to 9999',
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'understand place value up to thousands',
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.3',
    strand: 'Numbers and Operations',
    description: 'round numbers to the nearest 10 and 100',
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.4',
    strand: 'Numbers and Operations',
    description: 'add and subtract four-digit numbers with and without regrouping',
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.5',
    strand: 'Numbers and Operations',
    description: 'learn multiplication tables up to 10',
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.6',
    strand: 'Numbers and Operations',
    description: 'multiply two-digit numbers by single-digit numbers',
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.7',
    strand: 'Numbers and Operations',
    description: 'divide two-digit numbers by single-digit numbers',
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.8',
    strand: 'Numbers and Operations',
    description: 'understand relationship between multiplication and division',
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.9',
    strand: 'Numbers and Operations',
    description: 'solve multi-step word problems using all four operations',
  },

  // FRACTIONS
  {
    notation: 'IN.CBSE.C3.MA.FRA.1',
    strand: 'Fractions',
    description: 'understand fractions as parts of a whole',
  },
  {
    notation: 'IN.CBSE.C3.MA.FRA.2',
    strand: 'Fractions',
    description: 'identify and represent fractions: 1/2, 1/3, 1/4, 2/3, 3/4',
  },
  {
    notation: 'IN.CBSE.C3.MA.FRA.3',
    strand: 'Fractions',
    description: 'compare like fractions',
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C3.MA.GEO.1',
    strand: 'Geometry',
    description: 'identify 3D shapes: cube, cuboid, cylinder, sphere, cone',
  },
  {
    notation: 'IN.CBSE.C3.MA.GEO.2',
    strand: 'Geometry',
    description: 'identify faces, edges, and vertices of 3D shapes',
  },
  {
    notation: 'IN.CBSE.C3.MA.GEO.3',
    strand: 'Geometry',
    description: 'understand symmetry and identify lines of symmetry',
  },
  {
    notation: 'IN.CBSE.C3.MA.GEO.4',
    strand: 'Geometry',
    description: 'draw and identify different types of angles (right angle)',
  },
  {
    notation: 'IN.CBSE.C3.MA.GEO.5',
    strand: 'Geometry',
    description: 'identify and create tiling patterns',
  },

  // MEASUREMENT
  {
    notation: 'IN.CBSE.C3.MA.MEA.1',
    strand: 'Measurement',
    description: 'measure length in meters and centimeters',
  },
  {
    notation: 'IN.CBSE.C3.MA.MEA.2',
    strand: 'Measurement',
    description: 'convert between meters and centimeters',
  },
  {
    notation: 'IN.CBSE.C3.MA.MEA.3',
    strand: 'Measurement',
    description: 'measure weight in kilograms and grams',
  },
  {
    notation: 'IN.CBSE.C3.MA.MEA.4',
    strand: 'Measurement',
    description: 'measure capacity in liters and milliliters',
  },
  {
    notation: 'IN.CBSE.C3.MA.MEA.5',
    strand: 'Measurement',
    description: 'read time to five minutes and calculate elapsed time',
  },
  {
    notation: 'IN.CBSE.C3.MA.MEA.6',
    strand: 'Measurement',
    description: 'calculate perimeter of simple shapes',
  },
  {
    notation: 'IN.CBSE.C3.MA.MEA.7',
    strand: 'Measurement',
    description: 'solve problems involving money up to Rs 1000',
  },

  // PATTERNS
  {
    notation: 'IN.CBSE.C3.MA.PAT.1',
    strand: 'Patterns',
    description: 'identify and extend complex number patterns',
  },
  {
    notation: 'IN.CBSE.C3.MA.PAT.2',
    strand: 'Patterns',
    description: 'understand and create geometric patterns',
  },
  {
    notation: 'IN.CBSE.C3.MA.PAT.3',
    strand: 'Patterns',
    description: 'identify patterns in multiplication tables',
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C3.MA.DAT.1',
    strand: 'Data Handling',
    description: 'collect, organize, and represent data using tally marks',
  },
  {
    notation: 'IN.CBSE.C3.MA.DAT.2',
    strand: 'Data Handling',
    description: 'create and interpret bar graphs',
  },
  {
    notation: 'IN.CBSE.C3.MA.DAT.3',
    strand: 'Data Handling',
    description: 'answer questions based on data in tables and graphs',
  }
];

// =============================================================================
// CLASS 4 (Ages 9-10)
// NCERT: Math Magic Book 4
// =============================================================================

const class4Standards: CBSEMathStandard[] = [
  // NUMBERS AND OPERATIONS
  {
    notation: 'IN.CBSE.C4.MA.NUM.1',
    strand: 'Numbers and Operations',
    description: 'read, write, and compare numbers up to 99,999',
  },
  {
    notation: 'IN.CBSE.C4.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'understand place value up to ten thousands (Indian system)',
  },
  {
    notation: 'IN.CBSE.C4.MA.NUM.3',
    strand: 'Numbers and Operations',
    description: 'use estimation strategies for addition and subtraction',
  },
  {
    notation: 'IN.CBSE.C4.MA.NUM.4',
    strand: 'Numbers and Operations',
    description: 'multiply numbers up to three digits by two-digit numbers',
  },
  {
    notation: 'IN.CBSE.C4.MA.NUM.5',
    strand: 'Numbers and Operations',
    description: 'divide numbers up to four digits by one-digit numbers',
  },
  {
    notation: 'IN.CBSE.C4.MA.NUM.6',
    strand: 'Numbers and Operations',
    description: 'identify factors and multiples of numbers',
  },
  {
    notation: 'IN.CBSE.C4.MA.NUM.7',
    strand: 'Numbers and Operations',
    description: 'solve complex word problems involving multiple operations',
  },

  // FRACTIONS
  {
    notation: 'IN.CBSE.C4.MA.FRA.1',
    strand: 'Fractions',
    description: 'understand equivalent fractions',
  },
  {
    notation: 'IN.CBSE.C4.MA.FRA.2',
    strand: 'Fractions',
    description: 'compare and order like and unlike fractions',
  },
  {
    notation: 'IN.CBSE.C4.MA.FRA.3',
    strand: 'Fractions',
    description: 'add and subtract fractions with same denominator',
  },
  {
    notation: 'IN.CBSE.C4.MA.FRA.4',
    strand: 'Fractions',
    description: 'relate fractions to division',
  },
  {
    notation: 'IN.CBSE.C4.MA.FRA.5',
    strand: 'Fractions',
    description: 'understand decimals as fractions (tenths)',
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C4.MA.GEO.1',
    strand: 'Geometry',
    description: 'classify angles as acute, right, obtuse, and straight',
  },
  {
    notation: 'IN.CBSE.C4.MA.GEO.2',
    strand: 'Geometry',
    description: 'identify and draw parallel and perpendicular lines',
  },
  {
    notation: 'IN.CBSE.C4.MA.GEO.3',
    strand: 'Geometry',
    description: 'understand nets of 3D shapes (cube, cuboid)',
  },
  {
    notation: 'IN.CBSE.C4.MA.GEO.4',
    strand: 'Geometry',
    description: 'identify multiple lines of symmetry in shapes',
  },
  {
    notation: 'IN.CBSE.C4.MA.GEO.5',
    strand: 'Geometry',
    description: 'understand reflection and rotational symmetry',
  },

  // MEASUREMENT
  {
    notation: 'IN.CBSE.C4.MA.MEA.1',
    strand: 'Measurement',
    description: 'convert between units of length (km, m, cm, mm)',
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.2',
    strand: 'Measurement',
    description: 'convert between units of weight (kg, g)',
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.3',
    strand: 'Measurement',
    description: 'convert between units of capacity (L, mL)',
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.4',
    strand: 'Measurement',
    description: 'calculate area using square units',
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.5',
    strand: 'Measurement',
    description: 'calculate perimeter and area of rectangles and squares',
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.6',
    strand: 'Measurement',
    description: 'read and use a 24-hour clock',
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.7',
    strand: 'Measurement',
    description: 'calculate time intervals and duration',
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.8',
    strand: 'Measurement',
    description: 'solve problems involving Indian Rupees and Paise',
  },

  // PATTERNS
  {
    notation: 'IN.CBSE.C4.MA.PAT.1',
    strand: 'Patterns',
    description: 'identify and describe patterns involving operations',
  },
  {
    notation: 'IN.CBSE.C4.MA.PAT.2',
    strand: 'Patterns',
    description: 'understand and apply rules to extend patterns',
  },
  {
    notation: 'IN.CBSE.C4.MA.PAT.3',
    strand: 'Patterns',
    description: 'explore magic squares and number puzzles',
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C4.MA.DAT.1',
    strand: 'Data Handling',
    description: 'collect and organize data in tables',
  },
  {
    notation: 'IN.CBSE.C4.MA.DAT.2',
    strand: 'Data Handling',
    description: 'create and interpret bar graphs with scale',
  },
  {
    notation: 'IN.CBSE.C4.MA.DAT.3',
    strand: 'Data Handling',
    description: 'analyze data and draw conclusions',
  }
];

// =============================================================================
// CLASS 5 (Ages 10-11)
// NCERT: Math Magic Book 5
// =============================================================================

const class5Standards: CBSEMathStandard[] = [
  // NUMBERS AND OPERATIONS
  {
    notation: 'IN.CBSE.C5.MA.NUM.1',
    strand: 'Numbers and Operations',
    description: 'read, write, and compare numbers up to 10,00,000 (Indian system)',
  },
  {
    notation: 'IN.CBSE.C5.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'understand place value up to lakhs',
  },
  {
    notation: 'IN.CBSE.C5.MA.NUM.3',
    strand: 'Numbers and Operations',
    description: 'multiply and divide large numbers',
  },
  {
    notation: 'IN.CBSE.C5.MA.NUM.4',
    strand: 'Numbers and Operations',
    description: 'find factors, multiples, HCF, and LCM of numbers',
  },
  {
    notation: 'IN.CBSE.C5.MA.NUM.5',
    strand: 'Numbers and Operations',
    description: 'identify prime and composite numbers',
  },
  {
    notation: 'IN.CBSE.C5.MA.NUM.6',
    strand: 'Numbers and Operations',
    description: 'apply BODMAS rule for order of operations',
  },

  // FRACTIONS AND DECIMALS
  {
    notation: 'IN.CBSE.C5.MA.FRA.1',
    strand: 'Fractions and Decimals',
    description: 'convert between improper fractions and mixed numbers',
  },
  {
    notation: 'IN.CBSE.C5.MA.FRA.2',
    strand: 'Fractions and Decimals',
    description: 'add and subtract fractions with different denominators',
  },
  {
    notation: 'IN.CBSE.C5.MA.FRA.3',
    strand: 'Fractions and Decimals',
    description: 'multiply fractions by whole numbers',
  },
  {
    notation: 'IN.CBSE.C5.MA.FRA.4',
    strand: 'Fractions and Decimals',
    description: 'understand decimals up to hundredths place',
  },
  {
    notation: 'IN.CBSE.C5.MA.FRA.5',
    strand: 'Fractions and Decimals',
    description: 'convert fractions to decimals and vice versa',
  },
  {
    notation: 'IN.CBSE.C5.MA.FRA.6',
    strand: 'Fractions and Decimals',
    description: 'add and subtract decimals',
  },
  {
    notation: 'IN.CBSE.C5.MA.FRA.7',
    strand: 'Fractions and Decimals',
    description: 'multiply decimals by 10, 100, 1000',
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C5.MA.GEO.1',
    strand: 'Geometry',
    description: 'measure angles using a protractor',
  },
  {
    notation: 'IN.CBSE.C5.MA.GEO.2',
    strand: 'Geometry',
    description: 'classify triangles based on sides and angles',
  },
  {
    notation: 'IN.CBSE.C5.MA.GEO.3',
    strand: 'Geometry',
    description: 'classify quadrilaterals (square, rectangle, parallelogram, rhombus)',
  },
  {
    notation: 'IN.CBSE.C5.MA.GEO.4',
    strand: 'Geometry',
    description: 'understand and identify 3D shapes and their properties',
  },
  {
    notation: 'IN.CBSE.C5.MA.GEO.5',
    strand: 'Geometry',
    description: 'draw and interpret scale drawings and maps',
  },
  {
    notation: 'IN.CBSE.C5.MA.GEO.6',
    strand: 'Geometry',
    description: 'understand coordinate system and plot points',
  },

  // MEASUREMENT
  {
    notation: 'IN.CBSE.C5.MA.MEA.1',
    strand: 'Measurement',
    description: 'calculate area of triangles and composite shapes',
  },
  {
    notation: 'IN.CBSE.C5.MA.MEA.2',
    strand: 'Measurement',
    description: 'understand volume of cubes and cuboids',
  },
  {
    notation: 'IN.CBSE.C5.MA.MEA.3',
    strand: 'Measurement',
    description: 'convert between different units of time',
  },
  {
    notation: 'IN.CBSE.C5.MA.MEA.4',
    strand: 'Measurement',
    description: 'calculate speed, distance, and time',
  },

  // PATTERNS AND ALGEBRA
  {
    notation: 'IN.CBSE.C5.MA.PAT.1',
    strand: 'Patterns',
    description: 'identify patterns in sequences and series',
  },
  {
    notation: 'IN.CBSE.C5.MA.PAT.2',
    strand: 'Patterns',
    description: 'describe patterns using rules and expressions',
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C5.MA.DAT.1',
    strand: 'Data Handling',
    description: 'calculate mean (average) of a data set',
  },
  {
    notation: 'IN.CBSE.C5.MA.DAT.2',
    strand: 'Data Handling',
    description: 'create and interpret line graphs',
  },
  {
    notation: 'IN.CBSE.C5.MA.DAT.3',
    strand: 'Data Handling',
    description: 'understand probability as likelihood of events',
  }
];

// =============================================================================
// CLASS 6 (Ages 11-12)
// NCERT: Mathematics Textbook for Class VI
// =============================================================================

const class6Standards: CBSEMathStandard[] = [
  // NUMBERS AND OPERATIONS
  {
    notation: 'IN.CBSE.C6.MA.NUM.1',
    strand: 'Numbers and Operations',
    description: 'understand number systems up to crores',
  },
  {
    notation: 'IN.CBSE.C6.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'compare Indian and International place value systems',
  },
  {
    notation: 'IN.CBSE.C6.MA.NUM.3',
    strand: 'Numbers and Operations',
    description: 'perform operations on large numbers',
  },
  {
    notation: 'IN.CBSE.C6.MA.NUM.4',
    strand: 'Numbers and Operations',
    description: 'understand and use Roman numerals',
  },
  {
    notation: 'IN.CBSE.C6.MA.NUM.5',
    strand: 'Numbers and Operations',
    description: 'understand properties of whole numbers (closure, commutative, associative)',
  },
  {
    notation: 'IN.CBSE.C6.MA.NUM.6',
    strand: 'Numbers and Operations',
    description: 'represent numbers on number line',
  },

  // INTEGERS
  {
    notation: 'IN.CBSE.C6.MA.INT.1',
    strand: 'Integers',
    description: 'understand positive and negative integers',
  },
  {
    notation: 'IN.CBSE.C6.MA.INT.2',
    strand: 'Integers',
    description: 'represent integers on a number line',
  },
  {
    notation: 'IN.CBSE.C6.MA.INT.3',
    strand: 'Integers',
    description: 'compare and order integers',
  },
  {
    notation: 'IN.CBSE.C6.MA.INT.4',
    strand: 'Integers',
    description: 'add and subtract integers',
  },

  // FRACTIONS AND DECIMALS
  {
    notation: 'IN.CBSE.C6.MA.FRA.1',
    strand: 'Fractions and Decimals',
    description: 'understand types of fractions (proper, improper, mixed)',
  },
  {
    notation: 'IN.CBSE.C6.MA.FRA.2',
    strand: 'Fractions and Decimals',
    description: 'compare and order fractions',
  },
  {
    notation: 'IN.CBSE.C6.MA.FRA.3',
    strand: 'Fractions and Decimals',
    description: 'add, subtract, multiply fractions',
  },
  {
    notation: 'IN.CBSE.C6.MA.FRA.4',
    strand: 'Fractions and Decimals',
    description: 'understand place value in decimals up to thousandths',
  },
  {
    notation: 'IN.CBSE.C6.MA.FRA.5',
    strand: 'Fractions and Decimals',
    description: 'perform all operations on decimals',
  },

  // ALGEBRA
  {
    notation: 'IN.CBSE.C6.MA.ALG.1',
    strand: 'Algebra',
    description: 'understand use of variables in algebra',
  },
  {
    notation: 'IN.CBSE.C6.MA.ALG.2',
    strand: 'Algebra',
    description: 'write algebraic expressions and equations',
  },
  {
    notation: 'IN.CBSE.C6.MA.ALG.3',
    strand: 'Algebra',
    description: 'solve simple linear equations',
  },

  // RATIO AND PROPORTION
  {
    notation: 'IN.CBSE.C6.MA.RAT.1',
    strand: 'Ratio and Proportion',
    description: 'understand ratio and its representation',
  },
  {
    notation: 'IN.CBSE.C6.MA.RAT.2',
    strand: 'Ratio and Proportion',
    description: 'understand proportion and solve problems',
  },
  {
    notation: 'IN.CBSE.C6.MA.RAT.3',
    strand: 'Ratio and Proportion',
    description: 'apply unitary method in problem solving',
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C6.MA.GEO.1',
    strand: 'Geometry',
    description: 'understand basic geometrical concepts: point, line, ray, line segment',
  },
  {
    notation: 'IN.CBSE.C6.MA.GEO.2',
    strand: 'Geometry',
    description: 'understand curves, polygons, and circles',
  },
  {
    notation: 'IN.CBSE.C6.MA.GEO.3',
    strand: 'Geometry',
    description: 'classify and draw angles',
  },
  {
    notation: 'IN.CBSE.C6.MA.GEO.4',
    strand: 'Geometry',
    description: 'understand properties of triangles and quadrilaterals',
  },
  {
    notation: 'IN.CBSE.C6.MA.GEO.5',
    strand: 'Geometry',
    description: 'identify 3D shapes and their faces, edges, vertices',
  },
  {
    notation: 'IN.CBSE.C6.MA.GEO.6',
    strand: 'Geometry',
    description: 'understand and identify lines of symmetry',
  },

  // MENSURATION
  {
    notation: 'IN.CBSE.C6.MA.MEN.1',
    strand: 'Mensuration',
    description: 'calculate perimeter of various shapes',
  },
  {
    notation: 'IN.CBSE.C6.MA.MEN.2',
    strand: 'Mensuration',
    description: 'calculate area of squares, rectangles, triangles',
  },
  {
    notation: 'IN.CBSE.C6.MA.MEN.3',
    strand: 'Mensuration',
    description: 'understand relationship between area and perimeter',
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C6.MA.DAT.1',
    strand: 'Data Handling',
    description: 'collect, organize, and represent data',
  },
  {
    notation: 'IN.CBSE.C6.MA.DAT.2',
    strand: 'Data Handling',
    description: 'create and interpret bar graphs and pictographs',
  },
  {
    notation: 'IN.CBSE.C6.MA.DAT.3',
    strand: 'Data Handling',
    description: 'calculate mean and median of data',
  }
];

// =============================================================================
// CLASS 7 (Ages 12-13)
// NCERT: Mathematics Textbook for Class VII
// =============================================================================

const class7Standards: CBSEMathStandard[] = [
  // INTEGERS
  {
    notation: 'IN.CBSE.C7.MA.INT.1',
    strand: 'Integers',
    description: 'multiply and divide integers',
  },
  {
    notation: 'IN.CBSE.C7.MA.INT.2',
    strand: 'Integers',
    description: 'understand properties of integer operations',
  },

  // FRACTIONS AND DECIMALS
  {
    notation: 'IN.CBSE.C7.MA.FRA.1',
    strand: 'Fractions and Decimals',
    description: 'multiply fractions and mixed numbers',
  },
  {
    notation: 'IN.CBSE.C7.MA.FRA.2',
    strand: 'Fractions and Decimals',
    description: 'divide fractions and mixed numbers',
  },
  {
    notation: 'IN.CBSE.C7.MA.FRA.3',
    strand: 'Fractions and Decimals',
    description: 'multiply and divide decimals',
  },

  // RATIONAL NUMBERS
  {
    notation: 'IN.CBSE.C7.MA.RAT.1',
    strand: 'Rational Numbers',
    description: 'understand rational numbers and their representation',
  },
  {
    notation: 'IN.CBSE.C7.MA.RAT.2',
    strand: 'Rational Numbers',
    description: 'compare and order rational numbers',
  },
  {
    notation: 'IN.CBSE.C7.MA.RAT.3',
    strand: 'Rational Numbers',
    description: 'perform operations on rational numbers',
  },

  // ALGEBRA
  {
    notation: 'IN.CBSE.C7.MA.ALG.1',
    strand: 'Algebra',
    description: 'understand algebraic expressions and terms',
  },
  {
    notation: 'IN.CBSE.C7.MA.ALG.2',
    strand: 'Algebra',
    description: 'add and subtract algebraic expressions',
  },
  {
    notation: 'IN.CBSE.C7.MA.ALG.3',
    strand: 'Algebra',
    description: 'evaluate algebraic expressions',
  },
  {
    notation: 'IN.CBSE.C7.MA.ALG.4',
    strand: 'Algebra',
    description: 'solve linear equations in one variable',
  },
  {
    notation: 'IN.CBSE.C7.MA.ALG.5',
    strand: 'Algebra',
    description: 'form and solve equations from word problems',
  },

  // EXPONENTS AND POWERS
  {
    notation: 'IN.CBSE.C7.MA.EXP.1',
    strand: 'Exponents and Powers',
    description: 'understand exponents and powers',
  },
  {
    notation: 'IN.CBSE.C7.MA.EXP.2',
    strand: 'Exponents and Powers',
    description: 'apply laws of exponents',
  },
  {
    notation: 'IN.CBSE.C7.MA.EXP.3',
    strand: 'Exponents and Powers',
    description: 'express numbers in standard form',
  },

  // RATIO AND PROPORTION
  {
    notation: 'IN.CBSE.C7.MA.RAP.1',
    strand: 'Ratio and Proportion',
    description: 'solve problems on ratio and proportion',
  },
  {
    notation: 'IN.CBSE.C7.MA.RAP.2',
    strand: 'Ratio and Proportion',
    description: 'calculate percentage and its applications',
  },
  {
    notation: 'IN.CBSE.C7.MA.RAP.3',
    strand: 'Ratio and Proportion',
    description: 'calculate profit, loss, and simple interest',
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C7.MA.GEO.1',
    strand: 'Geometry',
    description: 'understand pairs of angles (complementary, supplementary, adjacent)',
  },
  {
    notation: 'IN.CBSE.C7.MA.GEO.2',
    strand: 'Geometry',
    description: 'understand angles made by parallel lines with transversal',
  },
  {
    notation: 'IN.CBSE.C7.MA.GEO.3',
    strand: 'Geometry',
    description: 'understand properties of triangles (angle sum, exterior angle)',
  },
  {
    notation: 'IN.CBSE.C7.MA.GEO.4',
    strand: 'Geometry',
    description: 'understand Pythagoras theorem',
  },
  {
    notation: 'IN.CBSE.C7.MA.GEO.5',
    strand: 'Geometry',
    description: 'understand congruence of triangles',
  },
  {
    notation: 'IN.CBSE.C7.MA.GEO.6',
    strand: 'Geometry',
    description: 'construct triangles given SSS, SAS, ASA, RHS',
  },

  // MENSURATION
  {
    notation: 'IN.CBSE.C7.MA.MEN.1',
    strand: 'Mensuration',
    description: 'calculate area of parallelogram and triangles',
  },
  {
    notation: 'IN.CBSE.C7.MA.MEN.2',
    strand: 'Mensuration',
    description: 'calculate circumference and area of circles',
  },
  {
    notation: 'IN.CBSE.C7.MA.MEN.3',
    strand: 'Mensuration',
    description: 'convert between units of area',
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C7.MA.DAT.1',
    strand: 'Data Handling',
    description: 'calculate mean, median, and mode',
  },
  {
    notation: 'IN.CBSE.C7.MA.DAT.2',
    strand: 'Data Handling',
    description: 'read and interpret double bar graphs',
  },
  {
    notation: 'IN.CBSE.C7.MA.DAT.3',
    strand: 'Data Handling',
    description: 'understand probability of events',
  },

  // SYMMETRY
  {
    notation: 'IN.CBSE.C7.MA.SYM.1',
    strand: 'Symmetry',
    description: 'identify rotational symmetry',
  },
  {
    notation: 'IN.CBSE.C7.MA.SYM.2',
    strand: 'Symmetry',
    description: 'understand order of rotational symmetry',
  },

  // 3D SHAPES
  {
    notation: 'IN.CBSE.C7.MA.SOL.1',
    strand: 'Solid Shapes',
    description: 'visualize and identify 3D shapes from 2D representations',
  },
  {
    notation: 'IN.CBSE.C7.MA.SOL.2',
    strand: 'Solid Shapes',
    description: 'understand views (front, top, side) of 3D objects',
  }
];

// =============================================================================
// CLASS 8 (Ages 13-14)
// NCERT: Mathematics Textbook for Class VIII
// =============================================================================

const class8Standards: CBSEMathStandard[] = [
  // RATIONAL NUMBERS
  {
    notation: 'IN.CBSE.C8.MA.RAT.1',
    strand: 'Rational Numbers',
    description: 'understand properties of rational numbers (closure, commutative, associative)',
  },
  {
    notation: 'IN.CBSE.C8.MA.RAT.2',
    strand: 'Rational Numbers',
    description: 'find rational numbers between two given rational numbers',
  },

  // EXPONENTS AND POWERS
  {
    notation: 'IN.CBSE.C8.MA.EXP.1',
    strand: 'Exponents and Powers',
    description: 'understand negative exponents and their laws',
  },
  {
    notation: 'IN.CBSE.C8.MA.EXP.2',
    strand: 'Exponents and Powers',
    description: 'express very small numbers in standard form',
  },

  // SQUARES AND SQUARE ROOTS
  {
    notation: 'IN.CBSE.C8.MA.SQR.1',
    strand: 'Squares and Square Roots',
    description: 'identify perfect squares and their properties',
  },
  {
    notation: 'IN.CBSE.C8.MA.SQR.2',
    strand: 'Squares and Square Roots',
    description: 'find square roots using factorization and division method',
  },
  {
    notation: 'IN.CBSE.C8.MA.SQR.3',
    strand: 'Squares and Square Roots',
    description: 'estimate square roots of non-perfect squares',
  },

  // CUBES AND CUBE ROOTS
  {
    notation: 'IN.CBSE.C8.MA.CUB.1',
    strand: 'Cubes and Cube Roots',
    description: 'identify perfect cubes and their properties',
  },
  {
    notation: 'IN.CBSE.C8.MA.CUB.2',
    strand: 'Cubes and Cube Roots',
    description: 'find cube roots using factorization method',
  },

  // ALGEBRA
  {
    notation: 'IN.CBSE.C8.MA.ALG.1',
    strand: 'Algebra',
    description: 'multiply algebraic expressions',
  },
  {
    notation: 'IN.CBSE.C8.MA.ALG.2',
    strand: 'Algebra',
    description: 'understand and apply algebraic identities',
  },
  {
    notation: 'IN.CBSE.C8.MA.ALG.3',
    strand: 'Algebra',
    description: 'factorize algebraic expressions',
  },
  {
    notation: 'IN.CBSE.C8.MA.ALG.4',
    strand: 'Algebra',
    description: 'divide algebraic expressions',
  },
  {
    notation: 'IN.CBSE.C8.MA.ALG.5',
    strand: 'Algebra',
    description: 'solve linear equations with variables on both sides',
  },
  {
    notation: 'IN.CBSE.C8.MA.ALG.6',
    strand: 'Algebra',
    description: 'solve equations with cross multiplication',
  },

  // RATIO AND PROPORTION
  {
    notation: 'IN.CBSE.C8.MA.RAP.1',
    strand: 'Ratio and Proportion',
    description: 'understand direct and inverse proportion',
  },
  {
    notation: 'IN.CBSE.C8.MA.RAP.2',
    strand: 'Ratio and Proportion',
    description: 'solve problems involving compound ratio',
  },
  {
    notation: 'IN.CBSE.C8.MA.RAP.3',
    strand: 'Ratio and Proportion',
    description: 'calculate compound interest',
  },
  {
    notation: 'IN.CBSE.C8.MA.RAP.4',
    strand: 'Ratio and Proportion',
    description: 'apply percentage in real-life situations (discount, tax, depreciation)',
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C8.MA.GEO.1',
    strand: 'Geometry',
    description: 'understand properties of quadrilaterals',
  },
  {
    notation: 'IN.CBSE.C8.MA.GEO.2',
    strand: 'Geometry',
    description: 'classify quadrilaterals based on properties',
  },
  {
    notation: 'IN.CBSE.C8.MA.GEO.3',
    strand: 'Geometry',
    description: 'construct quadrilaterals given various conditions',
  },
  {
    notation: 'IN.CBSE.C8.MA.GEO.4',
    strand: 'Geometry',
    description: 'understand special quadrilaterals and their properties',
  },

  // MENSURATION
  {
    notation: 'IN.CBSE.C8.MA.MEN.1',
    strand: 'Mensuration',
    description: 'calculate area of trapezium and general quadrilaterals',
  },
  {
    notation: 'IN.CBSE.C8.MA.MEN.2',
    strand: 'Mensuration',
    description: 'calculate surface area of cube, cuboid, cylinder',
  },
  {
    notation: 'IN.CBSE.C8.MA.MEN.3',
    strand: 'Mensuration',
    description: 'calculate volume of cube, cuboid, cylinder',
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C8.MA.DAT.1',
    strand: 'Data Handling',
    description: 'organize data in grouped frequency distribution',
  },
  {
    notation: 'IN.CBSE.C8.MA.DAT.2',
    strand: 'Data Handling',
    description: 'construct and interpret histograms and pie charts',
  },
  {
    notation: 'IN.CBSE.C8.MA.DAT.3',
    strand: 'Data Handling',
    description: 'understand experimental probability',
  },

  // GRAPHS
  {
    notation: 'IN.CBSE.C8.MA.GRP.1',
    strand: 'Graphs',
    description: 'locate points on Cartesian plane',
  },
  {
    notation: 'IN.CBSE.C8.MA.GRP.2',
    strand: 'Graphs',
    description: 'plot and interpret linear graphs',
  },
  {
    notation: 'IN.CBSE.C8.MA.GRP.3',
    strand: 'Graphs',
    description: 'read and draw graphs from real-life situations',
  },

  // 3D SHAPES
  {
    notation: 'IN.CBSE.C8.MA.SOL.1',
    strand: 'Solid Shapes',
    description: 'understand polyhedrons and their properties',
  },
  {
    notation: 'IN.CBSE.C8.MA.SOL.2',
    strand: 'Solid Shapes',
    description: 'apply Euler\'s formula for polyhedrons',
  },
  {
    notation: 'IN.CBSE.C8.MA.SOL.3',
    strand: 'Solid Shapes',
    description: 'understand mapping of 3D objects to 2D representations',
  },

  // PLAYING WITH NUMBERS
  {
    notation: 'IN.CBSE.C8.MA.NUM.1',
    strand: 'Numbers and Operations',
    description: 'understand divisibility rules',
  },
  {
    notation: 'IN.CBSE.C8.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'solve puzzles and games involving numbers',
  }
];

// =============================================================================
// EXPORT CBSE MATHEMATICS CURRICULUM
// =============================================================================

export const cbseMathCurriculum: CBSEMathCurriculum = {
  code: 'INDIAN_CBSE',
  name: 'Central Board of Secondary Education',
  country: 'IN',
  version: '2024-25',
  sourceUrl: 'https://ncert.nic.in/textbook.php',
  subject: 'MATH',
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
export function getCBSEMathStandardsForClass(classNum: number): CBSEMathStandard[] {
  const classData = cbseMathCurriculum.classes.find(c => c.class === classNum);
  return classData?.standards || [];
}

export function getTotalCBSEMathStandardsCount(): number {
  return cbseMathCurriculum.classes.reduce(
    (sum, c) => sum + c.standards.length,
    0
  );
}

export default cbseMathCurriculum;
