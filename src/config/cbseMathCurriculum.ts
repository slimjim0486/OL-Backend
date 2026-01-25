/**
 * CBSE (Central Board of Secondary Education) - Mathematics Standards
 * Classes 1-12 (Primary through Senior Secondary)
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
 * - C = Class (1-12)
 * - MA = Mathematics
 * - Strand codes:
 *   Classes 1-8 (Primary/Middle):
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
 *   Classes 9-10 (Secondary/Board):
 *   - RNS = Real Number System
 *   - POL = Polynomials
 *   - COG = Coordinate Geometry
 *   - LEQ = Linear Equations
 *   - TRI = Triangles and Circles
 *   - QUA = Quadrilaterals
 *   - STA = Statistics
 *   - PRB = Probability
 *   - TRG = Trigonometry
 *   - ARA = Areas and Volumes
 *   Classes 11-12 (Senior Secondary):
 *   - SET = Sets and Functions
 *   - REL = Relations and Functions
 *   - TRG = Trigonometry
 *   - CAL = Calculus
 *   - MAT = Matrices and Determinants
 *   - VEC = Vectors
 *   - 3DG = 3D Geometry
 *   - LPG = Linear Programming
 *   - PRB = Probability and Statistics
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
// CLASS 9 (Ages 14-15)
// NCERT: Mathematics Textbook for Class IX
// Secondary Education - Board Exam Preparation
// =============================================================================

const class9Standards: CBSEMathStandard[] = [
  // REAL NUMBER SYSTEM
  {
    notation: 'IN.CBSE.C9.MA.RNS.1',
    strand: 'Real Number System',
    description: 'represent natural numbers, integers, and rational numbers on number line',
  },
  {
    notation: 'IN.CBSE.C9.MA.RNS.2',
    strand: 'Real Number System',
    description: 'identify irrational numbers and their decimal expansions',
  },
  {
    notation: 'IN.CBSE.C9.MA.RNS.3',
    strand: 'Real Number System',
    description: 'represent real numbers on the number line',
  },
  {
    notation: 'IN.CBSE.C9.MA.RNS.4',
    strand: 'Real Number System',
    description: 'perform operations on real numbers',
  },
  {
    notation: 'IN.CBSE.C9.MA.RNS.5',
    strand: 'Real Number System',
    description: 'apply laws of exponents for real numbers',
  },
  {
    notation: 'IN.CBSE.C9.MA.RNS.6',
    strand: 'Real Number System',
    description: 'rationalize the denominator of surds',
  },

  // POLYNOMIALS
  {
    notation: 'IN.CBSE.C9.MA.POL.1',
    strand: 'Polynomials',
    description: 'identify polynomials and their degrees',
  },
  {
    notation: 'IN.CBSE.C9.MA.POL.2',
    strand: 'Polynomials',
    description: 'understand zeros of a polynomial',
  },
  {
    notation: 'IN.CBSE.C9.MA.POL.3',
    strand: 'Polynomials',
    description: 'apply remainder theorem',
  },
  {
    notation: 'IN.CBSE.C9.MA.POL.4',
    strand: 'Polynomials',
    description: 'apply factor theorem for factorization',
  },
  {
    notation: 'IN.CBSE.C9.MA.POL.5',
    strand: 'Polynomials',
    description: 'factorize polynomials using identities',
  },
  {
    notation: 'IN.CBSE.C9.MA.POL.6',
    strand: 'Polynomials',
    description: 'apply algebraic identities for expansion',
  },

  // COORDINATE GEOMETRY
  {
    notation: 'IN.CBSE.C9.MA.COG.1',
    strand: 'Coordinate Geometry',
    description: 'plot points in the Cartesian plane',
  },
  {
    notation: 'IN.CBSE.C9.MA.COG.2',
    strand: 'Coordinate Geometry',
    description: 'identify coordinates of points in all four quadrants',
  },
  {
    notation: 'IN.CBSE.C9.MA.COG.3',
    strand: 'Coordinate Geometry',
    description: 'understand concept of abscissa and ordinate',
  },

  // LINEAR EQUATIONS IN TWO VARIABLES
  {
    notation: 'IN.CBSE.C9.MA.LEQ.1',
    strand: 'Linear Equations',
    description: 'represent linear equations in two variables',
  },
  {
    notation: 'IN.CBSE.C9.MA.LEQ.2',
    strand: 'Linear Equations',
    description: 'find solutions of linear equations in two variables',
  },
  {
    notation: 'IN.CBSE.C9.MA.LEQ.3',
    strand: 'Linear Equations',
    description: 'graph linear equations in two variables',
  },
  {
    notation: 'IN.CBSE.C9.MA.LEQ.4',
    strand: 'Linear Equations',
    description: 'understand equations of lines parallel to axes',
  },

  // GEOMETRY - TRIANGLES
  {
    notation: 'IN.CBSE.C9.MA.TRI.1',
    strand: 'Triangles',
    description: 'apply properties of angles of a triangle',
  },
  {
    notation: 'IN.CBSE.C9.MA.TRI.2',
    strand: 'Triangles',
    description: 'prove congruence of triangles using SSS, SAS, ASA, RHS',
  },
  {
    notation: 'IN.CBSE.C9.MA.TRI.3',
    strand: 'Triangles',
    description: 'apply properties of isosceles and equilateral triangles',
  },
  {
    notation: 'IN.CBSE.C9.MA.TRI.4',
    strand: 'Triangles',
    description: 'prove triangle inequality theorem',
  },

  // QUADRILATERALS
  {
    notation: 'IN.CBSE.C9.MA.QUA.1',
    strand: 'Quadrilaterals',
    description: 'understand angle sum property of quadrilaterals',
  },
  {
    notation: 'IN.CBSE.C9.MA.QUA.2',
    strand: 'Quadrilaterals',
    description: 'identify and prove properties of parallelograms',
  },
  {
    notation: 'IN.CBSE.C9.MA.QUA.3',
    strand: 'Quadrilaterals',
    description: 'apply mid-point theorem',
  },

  // CIRCLES
  {
    notation: 'IN.CBSE.C9.MA.CIR.1',
    strand: 'Circles',
    description: 'define circle terms: chord, arc, segment, sector',
  },
  {
    notation: 'IN.CBSE.C9.MA.CIR.2',
    strand: 'Circles',
    description: 'prove and apply angle subtended by chord at center',
  },
  {
    notation: 'IN.CBSE.C9.MA.CIR.3',
    strand: 'Circles',
    description: 'prove perpendicular from center bisects chord',
  },
  {
    notation: 'IN.CBSE.C9.MA.CIR.4',
    strand: 'Circles',
    description: 'prove equal chords equidistant from center',
  },
  {
    notation: 'IN.CBSE.C9.MA.CIR.5',
    strand: 'Circles',
    description: 'prove cyclic quadrilateral properties',
  },

  // CONSTRUCTIONS
  {
    notation: 'IN.CBSE.C9.MA.CON.1',
    strand: 'Constructions',
    description: 'bisect a given angle',
  },
  {
    notation: 'IN.CBSE.C9.MA.CON.2',
    strand: 'Constructions',
    description: 'draw perpendicular bisector of a line segment',
  },
  {
    notation: 'IN.CBSE.C9.MA.CON.3',
    strand: 'Constructions',
    description: 'construct triangles given base, base angles, and sum of sides',
  },

  // HERON'S FORMULA AND AREAS
  {
    notation: 'IN.CBSE.C9.MA.ARA.1',
    strand: 'Areas',
    description: 'apply Heron\'s formula for area of triangle',
  },
  {
    notation: 'IN.CBSE.C9.MA.ARA.2',
    strand: 'Areas',
    description: 'find area of quadrilateral using Heron\'s formula',
  },

  // SURFACE AREAS AND VOLUMES
  {
    notation: 'IN.CBSE.C9.MA.MEN.1',
    strand: 'Mensuration',
    description: 'calculate surface area of cuboid, cylinder, cone, sphere',
  },
  {
    notation: 'IN.CBSE.C9.MA.MEN.2',
    strand: 'Mensuration',
    description: 'calculate volume of cuboid, cylinder, cone, sphere',
  },
  {
    notation: 'IN.CBSE.C9.MA.MEN.3',
    strand: 'Mensuration',
    description: 'solve problems on combination of solids',
  },

  // STATISTICS
  {
    notation: 'IN.CBSE.C9.MA.STA.1',
    strand: 'Statistics',
    description: 'collect and present data using bar graphs, histograms, frequency polygons',
  },
  {
    notation: 'IN.CBSE.C9.MA.STA.2',
    strand: 'Statistics',
    description: 'calculate mean, median, mode of ungrouped data',
  },
  {
    notation: 'IN.CBSE.C9.MA.STA.3',
    strand: 'Statistics',
    description: 'understand range of data',
  },

  // PROBABILITY
  {
    notation: 'IN.CBSE.C9.MA.PRB.1',
    strand: 'Probability',
    description: 'understand probability as experimental probability',
  },
  {
    notation: 'IN.CBSE.C9.MA.PRB.2',
    strand: 'Probability',
    description: 'calculate probability from experiments and surveys',
  }
];

// =============================================================================
// CLASS 10 (Ages 15-16)
// NCERT: Mathematics Textbook for Class X
// Secondary Education - Board Examination Year
// =============================================================================

const class10Standards: CBSEMathStandard[] = [
  // REAL NUMBERS
  {
    notation: 'IN.CBSE.C10.MA.RNS.1',
    strand: 'Real Number System',
    description: 'prove Euclid\'s division lemma',
  },
  {
    notation: 'IN.CBSE.C10.MA.RNS.2',
    strand: 'Real Number System',
    description: 'apply Euclid\'s division algorithm to find HCF',
  },
  {
    notation: 'IN.CBSE.C10.MA.RNS.3',
    strand: 'Real Number System',
    description: 'apply fundamental theorem of arithmetic',
  },
  {
    notation: 'IN.CBSE.C10.MA.RNS.4',
    strand: 'Real Number System',
    description: 'prove irrationality of √2, √3, √5',
  },
  {
    notation: 'IN.CBSE.C10.MA.RNS.5',
    strand: 'Real Number System',
    description: 'determine decimal expansion of rational numbers',
  },

  // POLYNOMIALS
  {
    notation: 'IN.CBSE.C10.MA.POL.1',
    strand: 'Polynomials',
    description: 'find zeros of quadratic polynomial graphically',
  },
  {
    notation: 'IN.CBSE.C10.MA.POL.2',
    strand: 'Polynomials',
    description: 'relate zeros and coefficients of quadratic polynomial',
  },
  {
    notation: 'IN.CBSE.C10.MA.POL.3',
    strand: 'Polynomials',
    description: 'perform division of polynomials',
  },
  {
    notation: 'IN.CBSE.C10.MA.POL.4',
    strand: 'Polynomials',
    description: 'find zeros of cubic polynomial given one zero',
  },

  // PAIR OF LINEAR EQUATIONS IN TWO VARIABLES
  {
    notation: 'IN.CBSE.C10.MA.LEQ.1',
    strand: 'Linear Equations',
    description: 'represent pair of linear equations graphically',
  },
  {
    notation: 'IN.CBSE.C10.MA.LEQ.2',
    strand: 'Linear Equations',
    description: 'identify consistent, inconsistent, dependent systems',
  },
  {
    notation: 'IN.CBSE.C10.MA.LEQ.3',
    strand: 'Linear Equations',
    description: 'solve pair of linear equations by substitution method',
  },
  {
    notation: 'IN.CBSE.C10.MA.LEQ.4',
    strand: 'Linear Equations',
    description: 'solve pair of linear equations by elimination method',
  },
  {
    notation: 'IN.CBSE.C10.MA.LEQ.5',
    strand: 'Linear Equations',
    description: 'solve pair of linear equations by cross-multiplication',
  },
  {
    notation: 'IN.CBSE.C10.MA.LEQ.6',
    strand: 'Linear Equations',
    description: 'solve word problems using linear equations',
  },

  // QUADRATIC EQUATIONS
  {
    notation: 'IN.CBSE.C10.MA.QEQ.1',
    strand: 'Quadratic Equations',
    description: 'identify standard form of quadratic equation',
  },
  {
    notation: 'IN.CBSE.C10.MA.QEQ.2',
    strand: 'Quadratic Equations',
    description: 'solve quadratic equations by factorization',
  },
  {
    notation: 'IN.CBSE.C10.MA.QEQ.3',
    strand: 'Quadratic Equations',
    description: 'solve quadratic equations by completing the square',
  },
  {
    notation: 'IN.CBSE.C10.MA.QEQ.4',
    strand: 'Quadratic Equations',
    description: 'apply quadratic formula',
  },
  {
    notation: 'IN.CBSE.C10.MA.QEQ.5',
    strand: 'Quadratic Equations',
    description: 'determine nature of roots using discriminant',
  },
  {
    notation: 'IN.CBSE.C10.MA.QEQ.6',
    strand: 'Quadratic Equations',
    description: 'solve word problems involving quadratic equations',
  },

  // ARITHMETIC PROGRESSIONS
  {
    notation: 'IN.CBSE.C10.MA.SEQ.1',
    strand: 'Sequences',
    description: 'identify arithmetic progressions',
  },
  {
    notation: 'IN.CBSE.C10.MA.SEQ.2',
    strand: 'Sequences',
    description: 'find nth term of an AP',
  },
  {
    notation: 'IN.CBSE.C10.MA.SEQ.3',
    strand: 'Sequences',
    description: 'find sum of n terms of an AP',
  },
  {
    notation: 'IN.CBSE.C10.MA.SEQ.4',
    strand: 'Sequences',
    description: 'solve word problems on AP',
  },

  // COORDINATE GEOMETRY
  {
    notation: 'IN.CBSE.C10.MA.COG.1',
    strand: 'Coordinate Geometry',
    description: 'apply distance formula',
  },
  {
    notation: 'IN.CBSE.C10.MA.COG.2',
    strand: 'Coordinate Geometry',
    description: 'apply section formula',
  },
  {
    notation: 'IN.CBSE.C10.MA.COG.3',
    strand: 'Coordinate Geometry',
    description: 'find area of triangle using coordinates',
  },
  {
    notation: 'IN.CBSE.C10.MA.COG.4',
    strand: 'Coordinate Geometry',
    description: 'apply mid-point formula',
  },

  // TRIANGLES - SIMILARITY
  {
    notation: 'IN.CBSE.C10.MA.TRI.1',
    strand: 'Triangles',
    description: 'prove and apply Basic Proportionality Theorem',
  },
  {
    notation: 'IN.CBSE.C10.MA.TRI.2',
    strand: 'Triangles',
    description: 'identify similar triangles using AAA, SSS, SAS criteria',
  },
  {
    notation: 'IN.CBSE.C10.MA.TRI.3',
    strand: 'Triangles',
    description: 'prove Pythagoras theorem',
  },
  {
    notation: 'IN.CBSE.C10.MA.TRI.4',
    strand: 'Triangles',
    description: 'apply converse of Pythagoras theorem',
  },

  // CIRCLES
  {
    notation: 'IN.CBSE.C10.MA.CIR.1',
    strand: 'Circles',
    description: 'prove tangent is perpendicular to radius at point of contact',
  },
  {
    notation: 'IN.CBSE.C10.MA.CIR.2',
    strand: 'Circles',
    description: 'prove tangents from external point are equal',
  },
  {
    notation: 'IN.CBSE.C10.MA.CIR.3',
    strand: 'Circles',
    description: 'construct tangents to a circle from external point',
  },

  // TRIGONOMETRY
  {
    notation: 'IN.CBSE.C10.MA.TRG.1',
    strand: 'Trigonometry',
    description: 'define trigonometric ratios: sin, cos, tan, cot, sec, cosec',
  },
  {
    notation: 'IN.CBSE.C10.MA.TRG.2',
    strand: 'Trigonometry',
    description: 'find trigonometric ratios of specific angles (0°, 30°, 45°, 60°, 90°)',
  },
  {
    notation: 'IN.CBSE.C10.MA.TRG.3',
    strand: 'Trigonometry',
    description: 'prove trigonometric identities',
  },
  {
    notation: 'IN.CBSE.C10.MA.TRG.4',
    strand: 'Trigonometry',
    description: 'solve problems on heights and distances',
  },
  {
    notation: 'IN.CBSE.C10.MA.TRG.5',
    strand: 'Trigonometry',
    description: 'understand angle of elevation and depression',
  },

  // AREAS RELATED TO CIRCLES
  {
    notation: 'IN.CBSE.C10.MA.ARA.1',
    strand: 'Areas',
    description: 'calculate perimeter and area of circle',
  },
  {
    notation: 'IN.CBSE.C10.MA.ARA.2',
    strand: 'Areas',
    description: 'calculate area of sector and segment',
  },
  {
    notation: 'IN.CBSE.C10.MA.ARA.3',
    strand: 'Areas',
    description: 'calculate area of combinations of figures',
  },

  // SURFACE AREAS AND VOLUMES
  {
    notation: 'IN.CBSE.C10.MA.MEN.1',
    strand: 'Mensuration',
    description: 'calculate surface area of combination of solids',
  },
  {
    notation: 'IN.CBSE.C10.MA.MEN.2',
    strand: 'Mensuration',
    description: 'calculate volume of combination of solids',
  },
  {
    notation: 'IN.CBSE.C10.MA.MEN.3',
    strand: 'Mensuration',
    description: 'understand conversion of solid from one shape to another',
  },
  {
    notation: 'IN.CBSE.C10.MA.MEN.4',
    strand: 'Mensuration',
    description: 'calculate frustum of cone: surface area and volume',
  },

  // STATISTICS
  {
    notation: 'IN.CBSE.C10.MA.STA.1',
    strand: 'Statistics',
    description: 'calculate mean of grouped data: direct, assumed mean, step deviation',
  },
  {
    notation: 'IN.CBSE.C10.MA.STA.2',
    strand: 'Statistics',
    description: 'calculate mode of grouped data',
  },
  {
    notation: 'IN.CBSE.C10.MA.STA.3',
    strand: 'Statistics',
    description: 'calculate median of grouped data',
  },
  {
    notation: 'IN.CBSE.C10.MA.STA.4',
    strand: 'Statistics',
    description: 'draw and interpret ogive (cumulative frequency curve)',
  },

  // PROBABILITY
  {
    notation: 'IN.CBSE.C10.MA.PRB.1',
    strand: 'Probability',
    description: 'understand theoretical probability',
  },
  {
    notation: 'IN.CBSE.C10.MA.PRB.2',
    strand: 'Probability',
    description: 'calculate probability of complementary events',
  },
  {
    notation: 'IN.CBSE.C10.MA.PRB.3',
    strand: 'Probability',
    description: 'solve problems on probability of simple events',
  },
  {
    notation: 'IN.CBSE.C10.MA.PRB.4',
    strand: 'Probability',
    description: 'apply addition theorem of probability',
  }
];

// =============================================================================
// CLASS 11 (Ages 16-17)
// NCERT: Mathematics Textbook for Class XI
// Senior Secondary Education - Science Stream
// =============================================================================

const class11Standards: CBSEMathStandard[] = [
  // SETS
  {
    notation: 'IN.CBSE.C11.MA.SET.1',
    strand: 'Sets',
    description: 'represent sets using roster and set-builder notation',
  },
  {
    notation: 'IN.CBSE.C11.MA.SET.2',
    strand: 'Sets',
    description: 'identify empty set, finite, infinite, equal, and universal sets',
  },
  {
    notation: 'IN.CBSE.C11.MA.SET.3',
    strand: 'Sets',
    description: 'understand subsets and power sets',
  },
  {
    notation: 'IN.CBSE.C11.MA.SET.4',
    strand: 'Sets',
    description: 'perform operations: union, intersection, difference',
  },
  {
    notation: 'IN.CBSE.C11.MA.SET.5',
    strand: 'Sets',
    description: 'understand complement of a set and De Morgan\'s laws',
  },
  {
    notation: 'IN.CBSE.C11.MA.SET.6',
    strand: 'Sets',
    description: 'solve problems using Venn diagrams',
  },

  // RELATIONS AND FUNCTIONS
  {
    notation: 'IN.CBSE.C11.MA.REL.1',
    strand: 'Relations and Functions',
    description: 'understand ordered pairs and Cartesian product',
  },
  {
    notation: 'IN.CBSE.C11.MA.REL.2',
    strand: 'Relations and Functions',
    description: 'define relation and types of relations',
  },
  {
    notation: 'IN.CBSE.C11.MA.REL.3',
    strand: 'Relations and Functions',
    description: 'define function, domain, codomain, and range',
  },
  {
    notation: 'IN.CBSE.C11.MA.REL.4',
    strand: 'Relations and Functions',
    description: 'identify different types of functions: one-one, onto',
  },
  {
    notation: 'IN.CBSE.C11.MA.REL.5',
    strand: 'Relations and Functions',
    description: 'analyze real-valued functions and their graphs',
  },
  {
    notation: 'IN.CBSE.C11.MA.REL.6',
    strand: 'Relations and Functions',
    description: 'perform algebra of real functions',
  },

  // TRIGONOMETRIC FUNCTIONS
  {
    notation: 'IN.CBSE.C11.MA.TRG.1',
    strand: 'Trigonometry',
    description: 'understand angles in degree and radian measure',
  },
  {
    notation: 'IN.CBSE.C11.MA.TRG.2',
    strand: 'Trigonometry',
    description: 'define trigonometric functions using unit circle',
  },
  {
    notation: 'IN.CBSE.C11.MA.TRG.3',
    strand: 'Trigonometry',
    description: 'analyze signs of trigonometric functions in quadrants',
  },
  {
    notation: 'IN.CBSE.C11.MA.TRG.4',
    strand: 'Trigonometry',
    description: 'apply sum and difference formulas',
  },
  {
    notation: 'IN.CBSE.C11.MA.TRG.5',
    strand: 'Trigonometry',
    description: 'derive and apply double and half angle formulas',
  },
  {
    notation: 'IN.CBSE.C11.MA.TRG.6',
    strand: 'Trigonometry',
    description: 'apply product-to-sum and sum-to-product formulas',
  },
  {
    notation: 'IN.CBSE.C11.MA.TRG.7',
    strand: 'Trigonometry',
    description: 'solve general trigonometric equations',
  },
  {
    notation: 'IN.CBSE.C11.MA.TRG.8',
    strand: 'Trigonometry',
    description: 'draw graphs of trigonometric functions',
  },

  // COMPLEX NUMBERS AND QUADRATIC EQUATIONS
  {
    notation: 'IN.CBSE.C11.MA.CPX.1',
    strand: 'Complex Numbers',
    description: 'understand imaginary unit i and complex numbers',
  },
  {
    notation: 'IN.CBSE.C11.MA.CPX.2',
    strand: 'Complex Numbers',
    description: 'perform algebra of complex numbers',
  },
  {
    notation: 'IN.CBSE.C11.MA.CPX.3',
    strand: 'Complex Numbers',
    description: 'find modulus and conjugate of complex numbers',
  },
  {
    notation: 'IN.CBSE.C11.MA.CPX.4',
    strand: 'Complex Numbers',
    description: 'represent complex numbers in Argand plane',
  },
  {
    notation: 'IN.CBSE.C11.MA.CPX.5',
    strand: 'Complex Numbers',
    description: 'express complex numbers in polar form',
  },
  {
    notation: 'IN.CBSE.C11.MA.CPX.6',
    strand: 'Complex Numbers',
    description: 'solve quadratic equations with complex roots',
  },

  // LINEAR INEQUALITIES
  {
    notation: 'IN.CBSE.C11.MA.INQ.1',
    strand: 'Inequalities',
    description: 'solve linear inequalities in one variable',
  },
  {
    notation: 'IN.CBSE.C11.MA.INQ.2',
    strand: 'Inequalities',
    description: 'represent solution sets on number line',
  },
  {
    notation: 'IN.CBSE.C11.MA.INQ.3',
    strand: 'Inequalities',
    description: 'solve system of linear inequalities in one variable',
  },
  {
    notation: 'IN.CBSE.C11.MA.INQ.4',
    strand: 'Inequalities',
    description: 'solve linear inequalities in two variables graphically',
  },
  {
    notation: 'IN.CBSE.C11.MA.INQ.5',
    strand: 'Inequalities',
    description: 'solve system of linear inequalities in two variables',
  },

  // PERMUTATIONS AND COMBINATIONS
  {
    notation: 'IN.CBSE.C11.MA.PNC.1',
    strand: 'Permutations and Combinations',
    description: 'apply fundamental principle of counting',
  },
  {
    notation: 'IN.CBSE.C11.MA.PNC.2',
    strand: 'Permutations and Combinations',
    description: 'understand and apply factorial notation',
  },
  {
    notation: 'IN.CBSE.C11.MA.PNC.3',
    strand: 'Permutations and Combinations',
    description: 'calculate permutations nPr',
  },
  {
    notation: 'IN.CBSE.C11.MA.PNC.4',
    strand: 'Permutations and Combinations',
    description: 'solve permutation problems with restrictions',
  },
  {
    notation: 'IN.CBSE.C11.MA.PNC.5',
    strand: 'Permutations and Combinations',
    description: 'calculate combinations nCr',
  },
  {
    notation: 'IN.CBSE.C11.MA.PNC.6',
    strand: 'Permutations and Combinations',
    description: 'apply properties of combinations',
  },

  // BINOMIAL THEOREM
  {
    notation: 'IN.CBSE.C11.MA.BIN.1',
    strand: 'Binomial Theorem',
    description: 'state and prove binomial theorem for positive integral index',
  },
  {
    notation: 'IN.CBSE.C11.MA.BIN.2',
    strand: 'Binomial Theorem',
    description: 'find general and middle terms',
  },
  {
    notation: 'IN.CBSE.C11.MA.BIN.3',
    strand: 'Binomial Theorem',
    description: 'understand Pascal\'s triangle',
  },
  {
    notation: 'IN.CBSE.C11.MA.BIN.4',
    strand: 'Binomial Theorem',
    description: 'apply binomial theorem for approximations',
  },

  // SEQUENCES AND SERIES
  {
    notation: 'IN.CBSE.C11.MA.SEQ.1',
    strand: 'Sequences and Series',
    description: 'identify arithmetic progressions and their properties',
  },
  {
    notation: 'IN.CBSE.C11.MA.SEQ.2',
    strand: 'Sequences and Series',
    description: 'find arithmetic mean between two numbers',
  },
  {
    notation: 'IN.CBSE.C11.MA.SEQ.3',
    strand: 'Sequences and Series',
    description: 'identify geometric progressions and their properties',
  },
  {
    notation: 'IN.CBSE.C11.MA.SEQ.4',
    strand: 'Sequences and Series',
    description: 'find geometric mean between two numbers',
  },
  {
    notation: 'IN.CBSE.C11.MA.SEQ.5',
    strand: 'Sequences and Series',
    description: 'find sum of infinite GP',
  },
  {
    notation: 'IN.CBSE.C11.MA.SEQ.6',
    strand: 'Sequences and Series',
    description: 'find sum of special series: Σn, Σn², Σn³',
  },

  // STRAIGHT LINES
  {
    notation: 'IN.CBSE.C11.MA.SLN.1',
    strand: 'Straight Lines',
    description: 'find slope of a line from different forms',
  },
  {
    notation: 'IN.CBSE.C11.MA.SLN.2',
    strand: 'Straight Lines',
    description: 'write equation of line in various forms',
  },
  {
    notation: 'IN.CBSE.C11.MA.SLN.3',
    strand: 'Straight Lines',
    description: 'convert between different forms of line equation',
  },
  {
    notation: 'IN.CBSE.C11.MA.SLN.4',
    strand: 'Straight Lines',
    description: 'find distance of point from a line',
  },
  {
    notation: 'IN.CBSE.C11.MA.SLN.5',
    strand: 'Straight Lines',
    description: 'find angle between two lines',
  },
  {
    notation: 'IN.CBSE.C11.MA.SLN.6',
    strand: 'Straight Lines',
    description: 'apply condition for parallel and perpendicular lines',
  },

  // CONIC SECTIONS
  {
    notation: 'IN.CBSE.C11.MA.CON.1',
    strand: 'Conic Sections',
    description: 'derive equation of circle in standard forms',
  },
  {
    notation: 'IN.CBSE.C11.MA.CON.2',
    strand: 'Conic Sections',
    description: 'derive equation of parabola and identify its elements',
  },
  {
    notation: 'IN.CBSE.C11.MA.CON.3',
    strand: 'Conic Sections',
    description: 'derive equation of ellipse and identify its elements',
  },
  {
    notation: 'IN.CBSE.C11.MA.CON.4',
    strand: 'Conic Sections',
    description: 'derive equation of hyperbola and identify its elements',
  },
  {
    notation: 'IN.CBSE.C11.MA.CON.5',
    strand: 'Conic Sections',
    description: 'understand eccentricity and latus rectum',
  },

  // INTRODUCTION TO 3D GEOMETRY
  {
    notation: 'IN.CBSE.C11.MA.3DG.1',
    strand: '3D Geometry',
    description: 'understand coordinate axes and planes in three dimensions',
  },
  {
    notation: 'IN.CBSE.C11.MA.3DG.2',
    strand: '3D Geometry',
    description: 'plot points in three-dimensional space',
  },
  {
    notation: 'IN.CBSE.C11.MA.3DG.3',
    strand: '3D Geometry',
    description: 'apply distance formula in 3D',
  },
  {
    notation: 'IN.CBSE.C11.MA.3DG.4',
    strand: '3D Geometry',
    description: 'apply section formula in 3D',
  },

  // LIMITS AND DERIVATIVES
  {
    notation: 'IN.CBSE.C11.MA.CAL.1',
    strand: 'Calculus',
    description: 'understand intuitive idea of limit',
  },
  {
    notation: 'IN.CBSE.C11.MA.CAL.2',
    strand: 'Calculus',
    description: 'evaluate limits of polynomial and rational functions',
  },
  {
    notation: 'IN.CBSE.C11.MA.CAL.3',
    strand: 'Calculus',
    description: 'apply standard limits: lim(sinx/x), lim(1-cosx)/x',
  },
  {
    notation: 'IN.CBSE.C11.MA.CAL.4',
    strand: 'Calculus',
    description: 'understand derivative as rate of change',
  },
  {
    notation: 'IN.CBSE.C11.MA.CAL.5',
    strand: 'Calculus',
    description: 'find derivative from first principles',
  },
  {
    notation: 'IN.CBSE.C11.MA.CAL.6',
    strand: 'Calculus',
    description: 'apply derivative rules: sum, difference, product, quotient',
  },
  {
    notation: 'IN.CBSE.C11.MA.CAL.7',
    strand: 'Calculus',
    description: 'find derivatives of polynomial and trigonometric functions',
  },

  // STATISTICS
  {
    notation: 'IN.CBSE.C11.MA.STA.1',
    strand: 'Statistics',
    description: 'calculate measures of dispersion: range, mean deviation',
  },
  {
    notation: 'IN.CBSE.C11.MA.STA.2',
    strand: 'Statistics',
    description: 'calculate variance and standard deviation',
  },
  {
    notation: 'IN.CBSE.C11.MA.STA.3',
    strand: 'Statistics',
    description: 'compare coefficient of variation for consistency',
  },

  // PROBABILITY
  {
    notation: 'IN.CBSE.C11.MA.PRB.1',
    strand: 'Probability',
    description: 'understand sample space and events',
  },
  {
    notation: 'IN.CBSE.C11.MA.PRB.2',
    strand: 'Probability',
    description: 'apply axiomatic approach to probability',
  },
  {
    notation: 'IN.CBSE.C11.MA.PRB.3',
    strand: 'Probability',
    description: 'calculate probability using set operations',
  },
  {
    notation: 'IN.CBSE.C11.MA.PRB.4',
    strand: 'Probability',
    description: 'apply addition theorem for mutually exclusive events',
  },
  {
    notation: 'IN.CBSE.C11.MA.PRB.5',
    strand: 'Probability',
    description: 'apply addition theorem for not mutually exclusive events',
  }
];

// =============================================================================
// CLASS 12 (Ages 17-18)
// NCERT: Mathematics Textbook for Class XII
// Senior Secondary Education - Board Examination Year
// =============================================================================

const class12Standards: CBSEMathStandard[] = [
  // RELATIONS AND FUNCTIONS
  {
    notation: 'IN.CBSE.C12.MA.REL.1',
    strand: 'Relations and Functions',
    description: 'classify relations: reflexive, symmetric, transitive, equivalence',
  },
  {
    notation: 'IN.CBSE.C12.MA.REL.2',
    strand: 'Relations and Functions',
    description: 'classify functions: one-one, onto, bijective',
  },
  {
    notation: 'IN.CBSE.C12.MA.REL.3',
    strand: 'Relations and Functions',
    description: 'understand composition of functions',
  },
  {
    notation: 'IN.CBSE.C12.MA.REL.4',
    strand: 'Relations and Functions',
    description: 'find inverse of a function',
  },
  {
    notation: 'IN.CBSE.C12.MA.REL.5',
    strand: 'Relations and Functions',
    description: 'understand binary operations and their properties',
  },

  // INVERSE TRIGONOMETRIC FUNCTIONS
  {
    notation: 'IN.CBSE.C12.MA.ITF.1',
    strand: 'Inverse Trigonometric Functions',
    description: 'define principal value branches of inverse trig functions',
  },
  {
    notation: 'IN.CBSE.C12.MA.ITF.2',
    strand: 'Inverse Trigonometric Functions',
    description: 'find values of inverse trigonometric functions',
  },
  {
    notation: 'IN.CBSE.C12.MA.ITF.3',
    strand: 'Inverse Trigonometric Functions',
    description: 'draw graphs of inverse trigonometric functions',
  },
  {
    notation: 'IN.CBSE.C12.MA.ITF.4',
    strand: 'Inverse Trigonometric Functions',
    description: 'apply properties of inverse trigonometric functions',
  },
  {
    notation: 'IN.CBSE.C12.MA.ITF.5',
    strand: 'Inverse Trigonometric Functions',
    description: 'simplify expressions using inverse trig identities',
  },

  // MATRICES
  {
    notation: 'IN.CBSE.C12.MA.MAT.1',
    strand: 'Matrices',
    description: 'understand order and types of matrices',
  },
  {
    notation: 'IN.CBSE.C12.MA.MAT.2',
    strand: 'Matrices',
    description: 'perform matrix operations: addition, scalar multiplication',
  },
  {
    notation: 'IN.CBSE.C12.MA.MAT.3',
    strand: 'Matrices',
    description: 'perform matrix multiplication',
  },
  {
    notation: 'IN.CBSE.C12.MA.MAT.4',
    strand: 'Matrices',
    description: 'find transpose of a matrix',
  },
  {
    notation: 'IN.CBSE.C12.MA.MAT.5',
    strand: 'Matrices',
    description: 'identify symmetric and skew-symmetric matrices',
  },
  {
    notation: 'IN.CBSE.C12.MA.MAT.6',
    strand: 'Matrices',
    description: 'understand elementary row operations',
  },
  {
    notation: 'IN.CBSE.C12.MA.MAT.7',
    strand: 'Matrices',
    description: 'find inverse of matrix using elementary operations',
  },

  // DETERMINANTS
  {
    notation: 'IN.CBSE.C12.MA.DET.1',
    strand: 'Determinants',
    description: 'evaluate determinants of 2x2 and 3x3 matrices',
  },
  {
    notation: 'IN.CBSE.C12.MA.DET.2',
    strand: 'Determinants',
    description: 'apply properties of determinants',
  },
  {
    notation: 'IN.CBSE.C12.MA.DET.3',
    strand: 'Determinants',
    description: 'find area of triangle using determinants',
  },
  {
    notation: 'IN.CBSE.C12.MA.DET.4',
    strand: 'Determinants',
    description: 'find minors and cofactors',
  },
  {
    notation: 'IN.CBSE.C12.MA.DET.5',
    strand: 'Determinants',
    description: 'find adjoint and inverse of matrix using cofactors',
  },
  {
    notation: 'IN.CBSE.C12.MA.DET.6',
    strand: 'Determinants',
    description: 'solve linear equations using Cramer\'s rule',
  },
  {
    notation: 'IN.CBSE.C12.MA.DET.7',
    strand: 'Determinants',
    description: 'solve linear equations using matrix method',
  },

  // CONTINUITY AND DIFFERENTIABILITY
  {
    notation: 'IN.CBSE.C12.MA.CAL.1',
    strand: 'Calculus',
    description: 'understand continuity of a function at a point and in an interval',
  },
  {
    notation: 'IN.CBSE.C12.MA.CAL.2',
    strand: 'Calculus',
    description: 'understand differentiability and its relation to continuity',
  },
  {
    notation: 'IN.CBSE.C12.MA.CAL.3',
    strand: 'Calculus',
    description: 'apply chain rule for composite functions',
  },
  {
    notation: 'IN.CBSE.C12.MA.CAL.4',
    strand: 'Calculus',
    description: 'differentiate implicit functions',
  },
  {
    notation: 'IN.CBSE.C12.MA.CAL.5',
    strand: 'Calculus',
    description: 'differentiate logarithmic and exponential functions',
  },
  {
    notation: 'IN.CBSE.C12.MA.CAL.6',
    strand: 'Calculus',
    description: 'apply logarithmic differentiation',
  },
  {
    notation: 'IN.CBSE.C12.MA.CAL.7',
    strand: 'Calculus',
    description: 'find derivatives of parametric functions',
  },
  {
    notation: 'IN.CBSE.C12.MA.CAL.8',
    strand: 'Calculus',
    description: 'find second order derivatives',
  },
  {
    notation: 'IN.CBSE.C12.MA.CAL.9',
    strand: 'Calculus',
    description: 'understand and apply Rolle\'s and Mean Value Theorems',
  },

  // APPLICATIONS OF DERIVATIVES
  {
    notation: 'IN.CBSE.C12.MA.AOD.1',
    strand: 'Applications of Derivatives',
    description: 'find rate of change of quantities',
  },
  {
    notation: 'IN.CBSE.C12.MA.AOD.2',
    strand: 'Applications of Derivatives',
    description: 'determine increasing and decreasing functions',
  },
  {
    notation: 'IN.CBSE.C12.MA.AOD.3',
    strand: 'Applications of Derivatives',
    description: 'find tangent and normal to curves',
  },
  {
    notation: 'IN.CBSE.C12.MA.AOD.4',
    strand: 'Applications of Derivatives',
    description: 'use derivatives in approximations',
  },
  {
    notation: 'IN.CBSE.C12.MA.AOD.5',
    strand: 'Applications of Derivatives',
    description: 'find maxima and minima using first derivative test',
  },
  {
    notation: 'IN.CBSE.C12.MA.AOD.6',
    strand: 'Applications of Derivatives',
    description: 'find maxima and minima using second derivative test',
  },
  {
    notation: 'IN.CBSE.C12.MA.AOD.7',
    strand: 'Applications of Derivatives',
    description: 'solve optimization problems',
  },

  // INTEGRALS
  {
    notation: 'IN.CBSE.C12.MA.INT.1',
    strand: 'Integrals',
    description: 'understand integration as antiderivative',
  },
  {
    notation: 'IN.CBSE.C12.MA.INT.2',
    strand: 'Integrals',
    description: 'integrate using substitution method',
  },
  {
    notation: 'IN.CBSE.C12.MA.INT.3',
    strand: 'Integrals',
    description: 'integrate using partial fractions',
  },
  {
    notation: 'IN.CBSE.C12.MA.INT.4',
    strand: 'Integrals',
    description: 'integrate using by parts method',
  },
  {
    notation: 'IN.CBSE.C12.MA.INT.5',
    strand: 'Integrals',
    description: 'evaluate definite integrals as limit of sum',
  },
  {
    notation: 'IN.CBSE.C12.MA.INT.6',
    strand: 'Integrals',
    description: 'apply fundamental theorem of calculus',
  },
  {
    notation: 'IN.CBSE.C12.MA.INT.7',
    strand: 'Integrals',
    description: 'apply properties of definite integrals',
  },
  {
    notation: 'IN.CBSE.C12.MA.INT.8',
    strand: 'Integrals',
    description: 'integrate special functions: √(a²-x²), 1/(x²+a²)',
  },

  // APPLICATIONS OF INTEGRALS
  {
    notation: 'IN.CBSE.C12.MA.AOI.1',
    strand: 'Applications of Integrals',
    description: 'find area under simple curves',
  },
  {
    notation: 'IN.CBSE.C12.MA.AOI.2',
    strand: 'Applications of Integrals',
    description: 'find area between two curves',
  },
  {
    notation: 'IN.CBSE.C12.MA.AOI.3',
    strand: 'Applications of Integrals',
    description: 'find area of circles, ellipses, parabolas',
  },

  // DIFFERENTIAL EQUATIONS
  {
    notation: 'IN.CBSE.C12.MA.DEQ.1',
    strand: 'Differential Equations',
    description: 'understand order and degree of differential equations',
  },
  {
    notation: 'IN.CBSE.C12.MA.DEQ.2',
    strand: 'Differential Equations',
    description: 'form differential equation from given function',
  },
  {
    notation: 'IN.CBSE.C12.MA.DEQ.3',
    strand: 'Differential Equations',
    description: 'solve differential equations with variables separable',
  },
  {
    notation: 'IN.CBSE.C12.MA.DEQ.4',
    strand: 'Differential Equations',
    description: 'solve homogeneous differential equations',
  },
  {
    notation: 'IN.CBSE.C12.MA.DEQ.5',
    strand: 'Differential Equations',
    description: 'solve linear differential equations of first order',
  },

  // VECTORS
  {
    notation: 'IN.CBSE.C12.MA.VEC.1',
    strand: 'Vectors',
    description: 'understand vectors as directed line segments',
  },
  {
    notation: 'IN.CBSE.C12.MA.VEC.2',
    strand: 'Vectors',
    description: 'identify types of vectors: unit, zero, parallel, collinear',
  },
  {
    notation: 'IN.CBSE.C12.MA.VEC.3',
    strand: 'Vectors',
    description: 'perform vector addition using triangle and parallelogram laws',
  },
  {
    notation: 'IN.CBSE.C12.MA.VEC.4',
    strand: 'Vectors',
    description: 'express vectors in component form',
  },
  {
    notation: 'IN.CBSE.C12.MA.VEC.5',
    strand: 'Vectors',
    description: 'find position vector and section formula',
  },
  {
    notation: 'IN.CBSE.C12.MA.VEC.6',
    strand: 'Vectors',
    description: 'calculate scalar (dot) product and its properties',
  },
  {
    notation: 'IN.CBSE.C12.MA.VEC.7',
    strand: 'Vectors',
    description: 'calculate vector (cross) product and its properties',
  },
  {
    notation: 'IN.CBSE.C12.MA.VEC.8',
    strand: 'Vectors',
    description: 'calculate scalar triple product',
  },

  // 3D GEOMETRY
  {
    notation: 'IN.CBSE.C12.MA.3DG.1',
    strand: '3D Geometry',
    description: 'understand direction cosines and ratios',
  },
  {
    notation: 'IN.CBSE.C12.MA.3DG.2',
    strand: '3D Geometry',
    description: 'find equation of line in vector and Cartesian form',
  },
  {
    notation: 'IN.CBSE.C12.MA.3DG.3',
    strand: '3D Geometry',
    description: 'find angle between two lines',
  },
  {
    notation: 'IN.CBSE.C12.MA.3DG.4',
    strand: '3D Geometry',
    description: 'find shortest distance between skew lines',
  },
  {
    notation: 'IN.CBSE.C12.MA.3DG.5',
    strand: '3D Geometry',
    description: 'find equation of plane in vector and Cartesian form',
  },
  {
    notation: 'IN.CBSE.C12.MA.3DG.6',
    strand: '3D Geometry',
    description: 'find angle between two planes',
  },
  {
    notation: 'IN.CBSE.C12.MA.3DG.7',
    strand: '3D Geometry',
    description: 'find angle between line and plane',
  },
  {
    notation: 'IN.CBSE.C12.MA.3DG.8',
    strand: '3D Geometry',
    description: 'find distance of point from a plane',
  },

  // LINEAR PROGRAMMING
  {
    notation: 'IN.CBSE.C12.MA.LPG.1',
    strand: 'Linear Programming',
    description: 'formulate linear programming problem',
  },
  {
    notation: 'IN.CBSE.C12.MA.LPG.2',
    strand: 'Linear Programming',
    description: 'identify feasible region and corner points',
  },
  {
    notation: 'IN.CBSE.C12.MA.LPG.3',
    strand: 'Linear Programming',
    description: 'solve LPP graphically for maximization',
  },
  {
    notation: 'IN.CBSE.C12.MA.LPG.4',
    strand: 'Linear Programming',
    description: 'solve LPP graphically for minimization',
  },
  {
    notation: 'IN.CBSE.C12.MA.LPG.5',
    strand: 'Linear Programming',
    description: 'identify bounded and unbounded feasible regions',
  },

  // PROBABILITY
  {
    notation: 'IN.CBSE.C12.MA.PRB.1',
    strand: 'Probability',
    description: 'calculate conditional probability P(A|B)',
  },
  {
    notation: 'IN.CBSE.C12.MA.PRB.2',
    strand: 'Probability',
    description: 'apply multiplication theorem of probability',
  },
  {
    notation: 'IN.CBSE.C12.MA.PRB.3',
    strand: 'Probability',
    description: 'understand independent events and their properties',
  },
  {
    notation: 'IN.CBSE.C12.MA.PRB.4',
    strand: 'Probability',
    description: 'apply Bayes\' theorem',
  },
  {
    notation: 'IN.CBSE.C12.MA.PRB.5',
    strand: 'Probability',
    description: 'understand random variables and probability distributions',
  },
  {
    notation: 'IN.CBSE.C12.MA.PRB.6',
    strand: 'Probability',
    description: 'calculate mean and variance of random variable',
  },
  {
    notation: 'IN.CBSE.C12.MA.PRB.7',
    strand: 'Probability',
    description: 'understand Bernoulli trials and binomial distribution',
  },
  {
    notation: 'IN.CBSE.C12.MA.PRB.8',
    strand: 'Probability',
    description: 'calculate mean and variance of binomial distribution',
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
    { class: 8, ageRangeMin: 13, ageRangeMax: 14, standards: class8Standards },
    { class: 9, ageRangeMin: 14, ageRangeMax: 15, standards: class9Standards },
    { class: 10, ageRangeMin: 15, ageRangeMax: 16, standards: class10Standards },
    { class: 11, ageRangeMin: 16, ageRangeMax: 17, standards: class11Standards },
    { class: 12, ageRangeMin: 17, ageRangeMax: 18, standards: class12Standards }
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
