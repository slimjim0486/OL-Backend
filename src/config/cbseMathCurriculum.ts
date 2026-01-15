/**
 * CBSE (Central Board of Secondary Education) - Mathematics Standards
 * Classes 1-8 (Primary and Middle School)
 *
 * Source: NCERT Curriculum Framework and Textbooks
 * https://ncert.nic.in/textbook.php
 * https://cbseacademic.nic.in/curriculum.html
 *
 * Based on NCERT "Math Magic" (Classes 1-5) and "Mathematics" (Classes 6-8)
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
  chapter?: string; // NCERT chapter reference
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
    chapter: 'Numbers from 1 to 9'
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'read and write numerals from 1 to 100',
    chapter: 'Numbers from 10 to 20'
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.3',
    strand: 'Numbers and Operations',
    description: 'compare numbers using more than, less than, and equal to',
    chapter: 'Numbers from 21 to 50'
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.4',
    strand: 'Numbers and Operations',
    description: 'arrange numbers in ascending and descending order up to 100',
    chapter: 'Numbers'
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.5',
    strand: 'Numbers and Operations',
    description: 'skip count in 2s, 5s, and 10s',
    chapter: 'Numbers from 1 to 9'
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.6',
    strand: 'Numbers and Operations',
    description: 'add single-digit numbers with sum up to 18',
    chapter: 'Addition'
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.7',
    strand: 'Numbers and Operations',
    description: 'subtract single-digit numbers from numbers up to 18',
    chapter: 'Subtraction'
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.8',
    strand: 'Numbers and Operations',
    description: 'solve simple word problems involving addition and subtraction',
    chapter: 'Addition'
  },
  {
    notation: 'IN.CBSE.C1.MA.NUM.9',
    strand: 'Numbers and Operations',
    description: 'identify the place value of digits in two-digit numbers (ones and tens)',
    chapter: 'Numbers from 10 to 20'
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C1.MA.GEO.1',
    strand: 'Geometry',
    description: 'identify and name basic 2D shapes: circle, triangle, rectangle, square',
    chapter: 'Shapes and Space'
  },
  {
    notation: 'IN.CBSE.C1.MA.GEO.2',
    strand: 'Geometry',
    description: 'recognize shapes in everyday objects',
    chapter: 'Shapes and Space'
  },
  {
    notation: 'IN.CBSE.C1.MA.GEO.3',
    strand: 'Geometry',
    description: 'classify objects based on shape',
    chapter: 'Shapes and Space'
  },
  {
    notation: 'IN.CBSE.C1.MA.GEO.4',
    strand: 'Geometry',
    description: 'understand concepts of inside, outside, above, below, near, far',
    chapter: 'Shapes and Space'
  },

  // MEASUREMENT
  {
    notation: 'IN.CBSE.C1.MA.MEA.1',
    strand: 'Measurement',
    description: 'compare lengths of objects using terms like longer, shorter, taller',
    chapter: 'Measurement'
  },
  {
    notation: 'IN.CBSE.C1.MA.MEA.2',
    strand: 'Measurement',
    description: 'compare weights using heavy and light',
    chapter: 'Measurement'
  },
  {
    notation: 'IN.CBSE.C1.MA.MEA.3',
    strand: 'Measurement',
    description: 'compare capacity using full, empty, more, less',
    chapter: 'Measurement'
  },
  {
    notation: 'IN.CBSE.C1.MA.MEA.4',
    strand: 'Measurement',
    description: 'read time to the hour using an analog clock',
    chapter: 'Time'
  },
  {
    notation: 'IN.CBSE.C1.MA.MEA.5',
    strand: 'Measurement',
    description: 'understand sequence of days of the week',
    chapter: 'Time'
  },
  {
    notation: 'IN.CBSE.C1.MA.MEA.6',
    strand: 'Measurement',
    description: 'identify Indian currency notes and coins',
    chapter: 'Money'
  },

  // PATTERNS
  {
    notation: 'IN.CBSE.C1.MA.PAT.1',
    strand: 'Patterns',
    description: 'recognize simple repeating patterns in shapes and numbers',
    chapter: 'Patterns'
  },
  {
    notation: 'IN.CBSE.C1.MA.PAT.2',
    strand: 'Patterns',
    description: 'extend and create simple patterns',
    chapter: 'Patterns'
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C1.MA.DAT.1',
    strand: 'Data Handling',
    description: 'collect and organize objects into groups',
    chapter: 'How Many'
  },
  {
    notation: 'IN.CBSE.C1.MA.DAT.2',
    strand: 'Data Handling',
    description: 'count objects in each group and compare',
    chapter: 'How Many'
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
    chapter: 'Numbers from 1 to 100'
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'understand place value of three-digit numbers (ones, tens, hundreds)',
    chapter: 'Counting in Groups'
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.3',
    strand: 'Numbers and Operations',
    description: 'compare three-digit numbers and arrange in order',
    chapter: 'How Much Can You Carry?'
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.4',
    strand: 'Numbers and Operations',
    description: 'add two-digit numbers without regrouping',
    chapter: 'Counting in Groups'
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.5',
    strand: 'Numbers and Operations',
    description: 'add two-digit numbers with regrouping',
    chapter: 'How Much Can You Carry?'
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.6',
    strand: 'Numbers and Operations',
    description: 'subtract two-digit numbers without borrowing',
    chapter: 'Counting in Groups'
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.7',
    strand: 'Numbers and Operations',
    description: 'subtract two-digit numbers with borrowing',
    chapter: 'How Much Can You Carry?'
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.8',
    strand: 'Numbers and Operations',
    description: 'understand multiplication as repeated addition',
    chapter: 'Counting in Twos'
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.9',
    strand: 'Numbers and Operations',
    description: 'learn multiplication tables of 2, 3, 4, and 5',
    chapter: 'Counting in Twos'
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.10',
    strand: 'Numbers and Operations',
    description: 'understand division as equal sharing',
    chapter: 'Counting in Twos'
  },
  {
    notation: 'IN.CBSE.C2.MA.NUM.11',
    strand: 'Numbers and Operations',
    description: 'solve word problems involving addition, subtraction, and simple multiplication',
    chapter: 'How Much Can You Carry?'
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C2.MA.GEO.1',
    strand: 'Geometry',
    description: 'identify and describe properties of 2D shapes (sides, corners)',
    chapter: 'Lines and Lines'
  },
  {
    notation: 'IN.CBSE.C2.MA.GEO.2',
    strand: 'Geometry',
    description: 'differentiate between straight and curved lines',
    chapter: 'Lines and Lines'
  },
  {
    notation: 'IN.CBSE.C2.MA.GEO.3',
    strand: 'Geometry',
    description: 'understand horizontal, vertical, and slanting lines',
    chapter: 'Lines and Lines'
  },
  {
    notation: 'IN.CBSE.C2.MA.GEO.4',
    strand: 'Geometry',
    description: 'create shapes using tangrams and pattern blocks',
    chapter: 'Lines and Lines'
  },

  // MEASUREMENT
  {
    notation: 'IN.CBSE.C2.MA.MEA.1',
    strand: 'Measurement',
    description: 'measure length using non-standard units (hand span, foot)',
    chapter: 'Jugs and Mugs'
  },
  {
    notation: 'IN.CBSE.C2.MA.MEA.2',
    strand: 'Measurement',
    description: 'estimate and measure length using a ruler in centimeters',
    chapter: 'Jugs and Mugs'
  },
  {
    notation: 'IN.CBSE.C2.MA.MEA.3',
    strand: 'Measurement',
    description: 'compare and order objects by weight',
    chapter: 'Jugs and Mugs'
  },
  {
    notation: 'IN.CBSE.C2.MA.MEA.4',
    strand: 'Measurement',
    description: 'estimate and measure capacity using non-standard and standard units',
    chapter: 'Jugs and Mugs'
  },
  {
    notation: 'IN.CBSE.C2.MA.MEA.5',
    strand: 'Measurement',
    description: 'read time to the half hour on an analog clock',
    chapter: 'Counting in Twos'
  },
  {
    notation: 'IN.CBSE.C2.MA.MEA.6',
    strand: 'Measurement',
    description: 'read a calendar and identify days, weeks, months',
    chapter: 'Counting in Twos'
  },
  {
    notation: 'IN.CBSE.C2.MA.MEA.7',
    strand: 'Measurement',
    description: 'add and subtract money amounts up to Rs 100',
    chapter: 'Tens and Ones'
  },

  // PATTERNS
  {
    notation: 'IN.CBSE.C2.MA.PAT.1',
    strand: 'Patterns',
    description: 'identify and extend number patterns',
    chapter: 'Patterns'
  },
  {
    notation: 'IN.CBSE.C2.MA.PAT.2',
    strand: 'Patterns',
    description: 'create patterns using shapes and numbers',
    chapter: 'Patterns'
  },
  {
    notation: 'IN.CBSE.C2.MA.PAT.3',
    strand: 'Patterns',
    description: 'identify odd and even numbers',
    chapter: 'Patterns'
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C2.MA.DAT.1',
    strand: 'Data Handling',
    description: 'collect data and represent using pictographs',
    chapter: 'Footprints'
  },
  {
    notation: 'IN.CBSE.C2.MA.DAT.2',
    strand: 'Data Handling',
    description: 'read and interpret simple pictographs',
    chapter: 'Footprints'
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
    chapter: 'Where to Look From'
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'understand place value up to thousands',
    chapter: 'Fun with Numbers'
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.3',
    strand: 'Numbers and Operations',
    description: 'round numbers to the nearest 10 and 100',
    chapter: 'Fun with Numbers'
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.4',
    strand: 'Numbers and Operations',
    description: 'add and subtract four-digit numbers with and without regrouping',
    chapter: 'Fun with Numbers'
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.5',
    strand: 'Numbers and Operations',
    description: 'learn multiplication tables up to 10',
    chapter: 'Give and Take'
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.6',
    strand: 'Numbers and Operations',
    description: 'multiply two-digit numbers by single-digit numbers',
    chapter: 'Give and Take'
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.7',
    strand: 'Numbers and Operations',
    description: 'divide two-digit numbers by single-digit numbers',
    chapter: 'Give and Take'
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.8',
    strand: 'Numbers and Operations',
    description: 'understand relationship between multiplication and division',
    chapter: 'Give and Take'
  },
  {
    notation: 'IN.CBSE.C3.MA.NUM.9',
    strand: 'Numbers and Operations',
    description: 'solve multi-step word problems using all four operations',
    chapter: 'Can We Share?'
  },

  // FRACTIONS
  {
    notation: 'IN.CBSE.C3.MA.FRA.1',
    strand: 'Fractions',
    description: 'understand fractions as parts of a whole',
    chapter: 'Carts and Wheels'
  },
  {
    notation: 'IN.CBSE.C3.MA.FRA.2',
    strand: 'Fractions',
    description: 'identify and represent fractions: 1/2, 1/3, 1/4, 2/3, 3/4',
    chapter: 'Carts and Wheels'
  },
  {
    notation: 'IN.CBSE.C3.MA.FRA.3',
    strand: 'Fractions',
    description: 'compare like fractions',
    chapter: 'Carts and Wheels'
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C3.MA.GEO.1',
    strand: 'Geometry',
    description: 'identify 3D shapes: cube, cuboid, cylinder, sphere, cone',
    chapter: 'Shapes and Designs'
  },
  {
    notation: 'IN.CBSE.C3.MA.GEO.2',
    strand: 'Geometry',
    description: 'identify faces, edges, and vertices of 3D shapes',
    chapter: 'Shapes and Designs'
  },
  {
    notation: 'IN.CBSE.C3.MA.GEO.3',
    strand: 'Geometry',
    description: 'understand symmetry and identify lines of symmetry',
    chapter: 'Shapes and Designs'
  },
  {
    notation: 'IN.CBSE.C3.MA.GEO.4',
    strand: 'Geometry',
    description: 'draw and identify different types of angles (right angle)',
    chapter: 'Shapes and Designs'
  },
  {
    notation: 'IN.CBSE.C3.MA.GEO.5',
    strand: 'Geometry',
    description: 'identify and create tiling patterns',
    chapter: 'Shapes and Designs'
  },

  // MEASUREMENT
  {
    notation: 'IN.CBSE.C3.MA.MEA.1',
    strand: 'Measurement',
    description: 'measure length in meters and centimeters',
    chapter: 'Long and Short'
  },
  {
    notation: 'IN.CBSE.C3.MA.MEA.2',
    strand: 'Measurement',
    description: 'convert between meters and centimeters',
    chapter: 'Long and Short'
  },
  {
    notation: 'IN.CBSE.C3.MA.MEA.3',
    strand: 'Measurement',
    description: 'measure weight in kilograms and grams',
    chapter: 'Weighing Balances'
  },
  {
    notation: 'IN.CBSE.C3.MA.MEA.4',
    strand: 'Measurement',
    description: 'measure capacity in liters and milliliters',
    chapter: 'Jugs and Mugs'
  },
  {
    notation: 'IN.CBSE.C3.MA.MEA.5',
    strand: 'Measurement',
    description: 'read time to five minutes and calculate elapsed time',
    chapter: 'Time Goes On...'
  },
  {
    notation: 'IN.CBSE.C3.MA.MEA.6',
    strand: 'Measurement',
    description: 'calculate perimeter of simple shapes',
    chapter: 'Play with Patterns'
  },
  {
    notation: 'IN.CBSE.C3.MA.MEA.7',
    strand: 'Measurement',
    description: 'solve problems involving money up to Rs 1000',
    chapter: 'Rupees and Paise'
  },

  // PATTERNS
  {
    notation: 'IN.CBSE.C3.MA.PAT.1',
    strand: 'Patterns',
    description: 'identify and extend complex number patterns',
    chapter: 'Play with Patterns'
  },
  {
    notation: 'IN.CBSE.C3.MA.PAT.2',
    strand: 'Patterns',
    description: 'understand and create geometric patterns',
    chapter: 'Play with Patterns'
  },
  {
    notation: 'IN.CBSE.C3.MA.PAT.3',
    strand: 'Patterns',
    description: 'identify patterns in multiplication tables',
    chapter: 'Tables and Shares'
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C3.MA.DAT.1',
    strand: 'Data Handling',
    description: 'collect, organize, and represent data using tally marks',
    chapter: 'Smart Charts'
  },
  {
    notation: 'IN.CBSE.C3.MA.DAT.2',
    strand: 'Data Handling',
    description: 'create and interpret bar graphs',
    chapter: 'Smart Charts'
  },
  {
    notation: 'IN.CBSE.C3.MA.DAT.3',
    strand: 'Data Handling',
    description: 'answer questions based on data in tables and graphs',
    chapter: 'Smart Charts'
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
    chapter: 'Building with Bricks'
  },
  {
    notation: 'IN.CBSE.C4.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'understand place value up to ten thousands (Indian system)',
    chapter: 'Long and Short'
  },
  {
    notation: 'IN.CBSE.C4.MA.NUM.3',
    strand: 'Numbers and Operations',
    description: 'use estimation strategies for addition and subtraction',
    chapter: 'A Trip to Bhopal'
  },
  {
    notation: 'IN.CBSE.C4.MA.NUM.4',
    strand: 'Numbers and Operations',
    description: 'multiply numbers up to three digits by two-digit numbers',
    chapter: 'Tick-Tick-Tick'
  },
  {
    notation: 'IN.CBSE.C4.MA.NUM.5',
    strand: 'Numbers and Operations',
    description: 'divide numbers up to four digits by one-digit numbers',
    chapter: 'The Way the World Looks'
  },
  {
    notation: 'IN.CBSE.C4.MA.NUM.6',
    strand: 'Numbers and Operations',
    description: 'identify factors and multiples of numbers',
    chapter: 'Play with Patterns'
  },
  {
    notation: 'IN.CBSE.C4.MA.NUM.7',
    strand: 'Numbers and Operations',
    description: 'solve complex word problems involving multiple operations',
    chapter: 'Carts and Wheels'
  },

  // FRACTIONS
  {
    notation: 'IN.CBSE.C4.MA.FRA.1',
    strand: 'Fractions',
    description: 'understand equivalent fractions',
    chapter: 'Halves and Quarters'
  },
  {
    notation: 'IN.CBSE.C4.MA.FRA.2',
    strand: 'Fractions',
    description: 'compare and order like and unlike fractions',
    chapter: 'Halves and Quarters'
  },
  {
    notation: 'IN.CBSE.C4.MA.FRA.3',
    strand: 'Fractions',
    description: 'add and subtract fractions with same denominator',
    chapter: 'Halves and Quarters'
  },
  {
    notation: 'IN.CBSE.C4.MA.FRA.4',
    strand: 'Fractions',
    description: 'relate fractions to division',
    chapter: 'Halves and Quarters'
  },
  {
    notation: 'IN.CBSE.C4.MA.FRA.5',
    strand: 'Fractions',
    description: 'understand decimals as fractions (tenths)',
    chapter: 'Halves and Quarters'
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C4.MA.GEO.1',
    strand: 'Geometry',
    description: 'classify angles as acute, right, obtuse, and straight',
    chapter: 'Packing and Unpacking'
  },
  {
    notation: 'IN.CBSE.C4.MA.GEO.2',
    strand: 'Geometry',
    description: 'identify and draw parallel and perpendicular lines',
    chapter: 'Building with Bricks'
  },
  {
    notation: 'IN.CBSE.C4.MA.GEO.3',
    strand: 'Geometry',
    description: 'understand nets of 3D shapes (cube, cuboid)',
    chapter: 'Packing and Unpacking'
  },
  {
    notation: 'IN.CBSE.C4.MA.GEO.4',
    strand: 'Geometry',
    description: 'identify multiple lines of symmetry in shapes',
    chapter: 'Building with Bricks'
  },
  {
    notation: 'IN.CBSE.C4.MA.GEO.5',
    strand: 'Geometry',
    description: 'understand reflection and rotational symmetry',
    chapter: 'Building with Bricks'
  },

  // MEASUREMENT
  {
    notation: 'IN.CBSE.C4.MA.MEA.1',
    strand: 'Measurement',
    description: 'convert between units of length (km, m, cm, mm)',
    chapter: 'Long and Short'
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.2',
    strand: 'Measurement',
    description: 'convert between units of weight (kg, g)',
    chapter: 'Tables and Shares'
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.3',
    strand: 'Measurement',
    description: 'convert between units of capacity (L, mL)',
    chapter: 'Jugs and Mugs'
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.4',
    strand: 'Measurement',
    description: 'calculate area using square units',
    chapter: 'Carts and Wheels'
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.5',
    strand: 'Measurement',
    description: 'calculate perimeter and area of rectangles and squares',
    chapter: 'Carts and Wheels'
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.6',
    strand: 'Measurement',
    description: 'read and use a 24-hour clock',
    chapter: 'Tick-Tick-Tick'
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.7',
    strand: 'Measurement',
    description: 'calculate time intervals and duration',
    chapter: 'Tick-Tick-Tick'
  },
  {
    notation: 'IN.CBSE.C4.MA.MEA.8',
    strand: 'Measurement',
    description: 'solve problems involving Indian Rupees and Paise',
    chapter: 'Trip to Bhopal'
  },

  // PATTERNS
  {
    notation: 'IN.CBSE.C4.MA.PAT.1',
    strand: 'Patterns',
    description: 'identify and describe patterns involving operations',
    chapter: 'Play with Patterns'
  },
  {
    notation: 'IN.CBSE.C4.MA.PAT.2',
    strand: 'Patterns',
    description: 'understand and apply rules to extend patterns',
    chapter: 'Play with Patterns'
  },
  {
    notation: 'IN.CBSE.C4.MA.PAT.3',
    strand: 'Patterns',
    description: 'explore magic squares and number puzzles',
    chapter: 'Play with Patterns'
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C4.MA.DAT.1',
    strand: 'Data Handling',
    description: 'collect and organize data in tables',
    chapter: 'Tables and Shares'
  },
  {
    notation: 'IN.CBSE.C4.MA.DAT.2',
    strand: 'Data Handling',
    description: 'create and interpret bar graphs with scale',
    chapter: 'Tables and Shares'
  },
  {
    notation: 'IN.CBSE.C4.MA.DAT.3',
    strand: 'Data Handling',
    description: 'analyze data and draw conclusions',
    chapter: 'Tables and Shares'
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
    chapter: 'The Fish Tale'
  },
  {
    notation: 'IN.CBSE.C5.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'understand place value up to lakhs',
    chapter: 'The Fish Tale'
  },
  {
    notation: 'IN.CBSE.C5.MA.NUM.3',
    strand: 'Numbers and Operations',
    description: 'multiply and divide large numbers',
    chapter: 'Shapes and Angles'
  },
  {
    notation: 'IN.CBSE.C5.MA.NUM.4',
    strand: 'Numbers and Operations',
    description: 'find factors, multiples, HCF, and LCM of numbers',
    chapter: 'How Many Squares?'
  },
  {
    notation: 'IN.CBSE.C5.MA.NUM.5',
    strand: 'Numbers and Operations',
    description: 'identify prime and composite numbers',
    chapter: 'Parts and Wholes'
  },
  {
    notation: 'IN.CBSE.C5.MA.NUM.6',
    strand: 'Numbers and Operations',
    description: 'apply BODMAS rule for order of operations',
    chapter: 'The Fish Tale'
  },

  // FRACTIONS AND DECIMALS
  {
    notation: 'IN.CBSE.C5.MA.FRA.1',
    strand: 'Fractions and Decimals',
    description: 'convert between improper fractions and mixed numbers',
    chapter: 'Parts and Wholes'
  },
  {
    notation: 'IN.CBSE.C5.MA.FRA.2',
    strand: 'Fractions and Decimals',
    description: 'add and subtract fractions with different denominators',
    chapter: 'Parts and Wholes'
  },
  {
    notation: 'IN.CBSE.C5.MA.FRA.3',
    strand: 'Fractions and Decimals',
    description: 'multiply fractions by whole numbers',
    chapter: 'Parts and Wholes'
  },
  {
    notation: 'IN.CBSE.C5.MA.FRA.4',
    strand: 'Fractions and Decimals',
    description: 'understand decimals up to hundredths place',
    chapter: 'Does it Look the Same?'
  },
  {
    notation: 'IN.CBSE.C5.MA.FRA.5',
    strand: 'Fractions and Decimals',
    description: 'convert fractions to decimals and vice versa',
    chapter: 'Does it Look the Same?'
  },
  {
    notation: 'IN.CBSE.C5.MA.FRA.6',
    strand: 'Fractions and Decimals',
    description: 'add and subtract decimals',
    chapter: 'Does it Look the Same?'
  },
  {
    notation: 'IN.CBSE.C5.MA.FRA.7',
    strand: 'Fractions and Decimals',
    description: 'multiply decimals by 10, 100, 1000',
    chapter: 'Does it Look the Same?'
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C5.MA.GEO.1',
    strand: 'Geometry',
    description: 'measure angles using a protractor',
    chapter: 'Shapes and Angles'
  },
  {
    notation: 'IN.CBSE.C5.MA.GEO.2',
    strand: 'Geometry',
    description: 'classify triangles based on sides and angles',
    chapter: 'Shapes and Angles'
  },
  {
    notation: 'IN.CBSE.C5.MA.GEO.3',
    strand: 'Geometry',
    description: 'classify quadrilaterals (square, rectangle, parallelogram, rhombus)',
    chapter: 'Shapes and Angles'
  },
  {
    notation: 'IN.CBSE.C5.MA.GEO.4',
    strand: 'Geometry',
    description: 'understand and identify 3D shapes and their properties',
    chapter: 'Boxes and Sketches'
  },
  {
    notation: 'IN.CBSE.C5.MA.GEO.5',
    strand: 'Geometry',
    description: 'draw and interpret scale drawings and maps',
    chapter: 'Mapping Your Way'
  },
  {
    notation: 'IN.CBSE.C5.MA.GEO.6',
    strand: 'Geometry',
    description: 'understand coordinate system and plot points',
    chapter: 'Mapping Your Way'
  },

  // MEASUREMENT
  {
    notation: 'IN.CBSE.C5.MA.MEA.1',
    strand: 'Measurement',
    description: 'calculate area of triangles and composite shapes',
    chapter: 'How Many Squares?'
  },
  {
    notation: 'IN.CBSE.C5.MA.MEA.2',
    strand: 'Measurement',
    description: 'understand volume of cubes and cuboids',
    chapter: 'Boxes and Sketches'
  },
  {
    notation: 'IN.CBSE.C5.MA.MEA.3',
    strand: 'Measurement',
    description: 'convert between different units of time',
    chapter: 'Be My Multiple, I will Be Your Factor'
  },
  {
    notation: 'IN.CBSE.C5.MA.MEA.4',
    strand: 'Measurement',
    description: 'calculate speed, distance, and time',
    chapter: 'The Fish Tale'
  },

  // PATTERNS AND ALGEBRA
  {
    notation: 'IN.CBSE.C5.MA.PAT.1',
    strand: 'Patterns',
    description: 'identify patterns in sequences and series',
    chapter: 'Be My Multiple, I will Be Your Factor'
  },
  {
    notation: 'IN.CBSE.C5.MA.PAT.2',
    strand: 'Patterns',
    description: 'describe patterns using rules and expressions',
    chapter: 'Be My Multiple, I will Be Your Factor'
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C5.MA.DAT.1',
    strand: 'Data Handling',
    description: 'calculate mean (average) of a data set',
    chapter: 'Can You See the Pattern?'
  },
  {
    notation: 'IN.CBSE.C5.MA.DAT.2',
    strand: 'Data Handling',
    description: 'create and interpret line graphs',
    chapter: 'Can You See the Pattern?'
  },
  {
    notation: 'IN.CBSE.C5.MA.DAT.3',
    strand: 'Data Handling',
    description: 'understand probability as likelihood of events',
    chapter: 'Smart Charts'
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
    chapter: 'Knowing Our Numbers'
  },
  {
    notation: 'IN.CBSE.C6.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'compare Indian and International place value systems',
    chapter: 'Knowing Our Numbers'
  },
  {
    notation: 'IN.CBSE.C6.MA.NUM.3',
    strand: 'Numbers and Operations',
    description: 'perform operations on large numbers',
    chapter: 'Knowing Our Numbers'
  },
  {
    notation: 'IN.CBSE.C6.MA.NUM.4',
    strand: 'Numbers and Operations',
    description: 'understand and use Roman numerals',
    chapter: 'Knowing Our Numbers'
  },
  {
    notation: 'IN.CBSE.C6.MA.NUM.5',
    strand: 'Numbers and Operations',
    description: 'understand properties of whole numbers (closure, commutative, associative)',
    chapter: 'Whole Numbers'
  },
  {
    notation: 'IN.CBSE.C6.MA.NUM.6',
    strand: 'Numbers and Operations',
    description: 'represent numbers on number line',
    chapter: 'Whole Numbers'
  },

  // INTEGERS
  {
    notation: 'IN.CBSE.C6.MA.INT.1',
    strand: 'Integers',
    description: 'understand positive and negative integers',
    chapter: 'Integers'
  },
  {
    notation: 'IN.CBSE.C6.MA.INT.2',
    strand: 'Integers',
    description: 'represent integers on a number line',
    chapter: 'Integers'
  },
  {
    notation: 'IN.CBSE.C6.MA.INT.3',
    strand: 'Integers',
    description: 'compare and order integers',
    chapter: 'Integers'
  },
  {
    notation: 'IN.CBSE.C6.MA.INT.4',
    strand: 'Integers',
    description: 'add and subtract integers',
    chapter: 'Integers'
  },

  // FRACTIONS AND DECIMALS
  {
    notation: 'IN.CBSE.C6.MA.FRA.1',
    strand: 'Fractions and Decimals',
    description: 'understand types of fractions (proper, improper, mixed)',
    chapter: 'Fractions'
  },
  {
    notation: 'IN.CBSE.C6.MA.FRA.2',
    strand: 'Fractions and Decimals',
    description: 'compare and order fractions',
    chapter: 'Fractions'
  },
  {
    notation: 'IN.CBSE.C6.MA.FRA.3',
    strand: 'Fractions and Decimals',
    description: 'add, subtract, multiply fractions',
    chapter: 'Fractions'
  },
  {
    notation: 'IN.CBSE.C6.MA.FRA.4',
    strand: 'Fractions and Decimals',
    description: 'understand place value in decimals up to thousandths',
    chapter: 'Decimals'
  },
  {
    notation: 'IN.CBSE.C6.MA.FRA.5',
    strand: 'Fractions and Decimals',
    description: 'perform all operations on decimals',
    chapter: 'Decimals'
  },

  // ALGEBRA
  {
    notation: 'IN.CBSE.C6.MA.ALG.1',
    strand: 'Algebra',
    description: 'understand use of variables in algebra',
    chapter: 'Algebra'
  },
  {
    notation: 'IN.CBSE.C6.MA.ALG.2',
    strand: 'Algebra',
    description: 'write algebraic expressions and equations',
    chapter: 'Algebra'
  },
  {
    notation: 'IN.CBSE.C6.MA.ALG.3',
    strand: 'Algebra',
    description: 'solve simple linear equations',
    chapter: 'Algebra'
  },

  // RATIO AND PROPORTION
  {
    notation: 'IN.CBSE.C6.MA.RAT.1',
    strand: 'Ratio and Proportion',
    description: 'understand ratio and its representation',
    chapter: 'Ratio and Proportion'
  },
  {
    notation: 'IN.CBSE.C6.MA.RAT.2',
    strand: 'Ratio and Proportion',
    description: 'understand proportion and solve problems',
    chapter: 'Ratio and Proportion'
  },
  {
    notation: 'IN.CBSE.C6.MA.RAT.3',
    strand: 'Ratio and Proportion',
    description: 'apply unitary method in problem solving',
    chapter: 'Ratio and Proportion'
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C6.MA.GEO.1',
    strand: 'Geometry',
    description: 'understand basic geometrical concepts: point, line, ray, line segment',
    chapter: 'Basic Geometrical Ideas'
  },
  {
    notation: 'IN.CBSE.C6.MA.GEO.2',
    strand: 'Geometry',
    description: 'understand curves, polygons, and circles',
    chapter: 'Basic Geometrical Ideas'
  },
  {
    notation: 'IN.CBSE.C6.MA.GEO.3',
    strand: 'Geometry',
    description: 'classify and draw angles',
    chapter: 'Understanding Elementary Shapes'
  },
  {
    notation: 'IN.CBSE.C6.MA.GEO.4',
    strand: 'Geometry',
    description: 'understand properties of triangles and quadrilaterals',
    chapter: 'Understanding Elementary Shapes'
  },
  {
    notation: 'IN.CBSE.C6.MA.GEO.5',
    strand: 'Geometry',
    description: 'identify 3D shapes and their faces, edges, vertices',
    chapter: 'Understanding Elementary Shapes'
  },
  {
    notation: 'IN.CBSE.C6.MA.GEO.6',
    strand: 'Geometry',
    description: 'understand and identify lines of symmetry',
    chapter: 'Symmetry'
  },

  // MENSURATION
  {
    notation: 'IN.CBSE.C6.MA.MEN.1',
    strand: 'Mensuration',
    description: 'calculate perimeter of various shapes',
    chapter: 'Mensuration'
  },
  {
    notation: 'IN.CBSE.C6.MA.MEN.2',
    strand: 'Mensuration',
    description: 'calculate area of squares, rectangles, triangles',
    chapter: 'Mensuration'
  },
  {
    notation: 'IN.CBSE.C6.MA.MEN.3',
    strand: 'Mensuration',
    description: 'understand relationship between area and perimeter',
    chapter: 'Mensuration'
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C6.MA.DAT.1',
    strand: 'Data Handling',
    description: 'collect, organize, and represent data',
    chapter: 'Data Handling'
  },
  {
    notation: 'IN.CBSE.C6.MA.DAT.2',
    strand: 'Data Handling',
    description: 'create and interpret bar graphs and pictographs',
    chapter: 'Data Handling'
  },
  {
    notation: 'IN.CBSE.C6.MA.DAT.3',
    strand: 'Data Handling',
    description: 'calculate mean and median of data',
    chapter: 'Data Handling'
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
    chapter: 'Integers'
  },
  {
    notation: 'IN.CBSE.C7.MA.INT.2',
    strand: 'Integers',
    description: 'understand properties of integer operations',
    chapter: 'Integers'
  },

  // FRACTIONS AND DECIMALS
  {
    notation: 'IN.CBSE.C7.MA.FRA.1',
    strand: 'Fractions and Decimals',
    description: 'multiply fractions and mixed numbers',
    chapter: 'Fractions and Decimals'
  },
  {
    notation: 'IN.CBSE.C7.MA.FRA.2',
    strand: 'Fractions and Decimals',
    description: 'divide fractions and mixed numbers',
    chapter: 'Fractions and Decimals'
  },
  {
    notation: 'IN.CBSE.C7.MA.FRA.3',
    strand: 'Fractions and Decimals',
    description: 'multiply and divide decimals',
    chapter: 'Fractions and Decimals'
  },

  // RATIONAL NUMBERS
  {
    notation: 'IN.CBSE.C7.MA.RAT.1',
    strand: 'Rational Numbers',
    description: 'understand rational numbers and their representation',
    chapter: 'Rational Numbers'
  },
  {
    notation: 'IN.CBSE.C7.MA.RAT.2',
    strand: 'Rational Numbers',
    description: 'compare and order rational numbers',
    chapter: 'Rational Numbers'
  },
  {
    notation: 'IN.CBSE.C7.MA.RAT.3',
    strand: 'Rational Numbers',
    description: 'perform operations on rational numbers',
    chapter: 'Rational Numbers'
  },

  // ALGEBRA
  {
    notation: 'IN.CBSE.C7.MA.ALG.1',
    strand: 'Algebra',
    description: 'understand algebraic expressions and terms',
    chapter: 'Algebraic Expressions'
  },
  {
    notation: 'IN.CBSE.C7.MA.ALG.2',
    strand: 'Algebra',
    description: 'add and subtract algebraic expressions',
    chapter: 'Algebraic Expressions'
  },
  {
    notation: 'IN.CBSE.C7.MA.ALG.3',
    strand: 'Algebra',
    description: 'evaluate algebraic expressions',
    chapter: 'Algebraic Expressions'
  },
  {
    notation: 'IN.CBSE.C7.MA.ALG.4',
    strand: 'Algebra',
    description: 'solve linear equations in one variable',
    chapter: 'Simple Equations'
  },
  {
    notation: 'IN.CBSE.C7.MA.ALG.5',
    strand: 'Algebra',
    description: 'form and solve equations from word problems',
    chapter: 'Simple Equations'
  },

  // EXPONENTS AND POWERS
  {
    notation: 'IN.CBSE.C7.MA.EXP.1',
    strand: 'Exponents and Powers',
    description: 'understand exponents and powers',
    chapter: 'Exponents and Powers'
  },
  {
    notation: 'IN.CBSE.C7.MA.EXP.2',
    strand: 'Exponents and Powers',
    description: 'apply laws of exponents',
    chapter: 'Exponents and Powers'
  },
  {
    notation: 'IN.CBSE.C7.MA.EXP.3',
    strand: 'Exponents and Powers',
    description: 'express numbers in standard form',
    chapter: 'Exponents and Powers'
  },

  // RATIO AND PROPORTION
  {
    notation: 'IN.CBSE.C7.MA.RAP.1',
    strand: 'Ratio and Proportion',
    description: 'solve problems on ratio and proportion',
    chapter: 'Comparing Quantities'
  },
  {
    notation: 'IN.CBSE.C7.MA.RAP.2',
    strand: 'Ratio and Proportion',
    description: 'calculate percentage and its applications',
    chapter: 'Comparing Quantities'
  },
  {
    notation: 'IN.CBSE.C7.MA.RAP.3',
    strand: 'Ratio and Proportion',
    description: 'calculate profit, loss, and simple interest',
    chapter: 'Comparing Quantities'
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C7.MA.GEO.1',
    strand: 'Geometry',
    description: 'understand pairs of angles (complementary, supplementary, adjacent)',
    chapter: 'Lines and Angles'
  },
  {
    notation: 'IN.CBSE.C7.MA.GEO.2',
    strand: 'Geometry',
    description: 'understand angles made by parallel lines with transversal',
    chapter: 'Lines and Angles'
  },
  {
    notation: 'IN.CBSE.C7.MA.GEO.3',
    strand: 'Geometry',
    description: 'understand properties of triangles (angle sum, exterior angle)',
    chapter: 'The Triangle and Its Properties'
  },
  {
    notation: 'IN.CBSE.C7.MA.GEO.4',
    strand: 'Geometry',
    description: 'understand Pythagoras theorem',
    chapter: 'The Triangle and Its Properties'
  },
  {
    notation: 'IN.CBSE.C7.MA.GEO.5',
    strand: 'Geometry',
    description: 'understand congruence of triangles',
    chapter: 'Congruence of Triangles'
  },
  {
    notation: 'IN.CBSE.C7.MA.GEO.6',
    strand: 'Geometry',
    description: 'construct triangles given SSS, SAS, ASA, RHS',
    chapter: 'Practical Geometry'
  },

  // MENSURATION
  {
    notation: 'IN.CBSE.C7.MA.MEN.1',
    strand: 'Mensuration',
    description: 'calculate area of parallelogram and triangles',
    chapter: 'Perimeter and Area'
  },
  {
    notation: 'IN.CBSE.C7.MA.MEN.2',
    strand: 'Mensuration',
    description: 'calculate circumference and area of circles',
    chapter: 'Perimeter and Area'
  },
  {
    notation: 'IN.CBSE.C7.MA.MEN.3',
    strand: 'Mensuration',
    description: 'convert between units of area',
    chapter: 'Perimeter and Area'
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C7.MA.DAT.1',
    strand: 'Data Handling',
    description: 'calculate mean, median, and mode',
    chapter: 'Data Handling'
  },
  {
    notation: 'IN.CBSE.C7.MA.DAT.2',
    strand: 'Data Handling',
    description: 'read and interpret double bar graphs',
    chapter: 'Data Handling'
  },
  {
    notation: 'IN.CBSE.C7.MA.DAT.3',
    strand: 'Data Handling',
    description: 'understand probability of events',
    chapter: 'Data Handling'
  },

  // SYMMETRY
  {
    notation: 'IN.CBSE.C7.MA.SYM.1',
    strand: 'Symmetry',
    description: 'identify rotational symmetry',
    chapter: 'Symmetry'
  },
  {
    notation: 'IN.CBSE.C7.MA.SYM.2',
    strand: 'Symmetry',
    description: 'understand order of rotational symmetry',
    chapter: 'Symmetry'
  },

  // 3D SHAPES
  {
    notation: 'IN.CBSE.C7.MA.SOL.1',
    strand: 'Solid Shapes',
    description: 'visualize and identify 3D shapes from 2D representations',
    chapter: 'Visualising Solid Shapes'
  },
  {
    notation: 'IN.CBSE.C7.MA.SOL.2',
    strand: 'Solid Shapes',
    description: 'understand views (front, top, side) of 3D objects',
    chapter: 'Visualising Solid Shapes'
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
    chapter: 'Rational Numbers'
  },
  {
    notation: 'IN.CBSE.C8.MA.RAT.2',
    strand: 'Rational Numbers',
    description: 'find rational numbers between two given rational numbers',
    chapter: 'Rational Numbers'
  },

  // EXPONENTS AND POWERS
  {
    notation: 'IN.CBSE.C8.MA.EXP.1',
    strand: 'Exponents and Powers',
    description: 'understand negative exponents and their laws',
    chapter: 'Exponents and Powers'
  },
  {
    notation: 'IN.CBSE.C8.MA.EXP.2',
    strand: 'Exponents and Powers',
    description: 'express very small numbers in standard form',
    chapter: 'Exponents and Powers'
  },

  // SQUARES AND SQUARE ROOTS
  {
    notation: 'IN.CBSE.C8.MA.SQR.1',
    strand: 'Squares and Square Roots',
    description: 'identify perfect squares and their properties',
    chapter: 'Squares and Square Roots'
  },
  {
    notation: 'IN.CBSE.C8.MA.SQR.2',
    strand: 'Squares and Square Roots',
    description: 'find square roots using factorization and division method',
    chapter: 'Squares and Square Roots'
  },
  {
    notation: 'IN.CBSE.C8.MA.SQR.3',
    strand: 'Squares and Square Roots',
    description: 'estimate square roots of non-perfect squares',
    chapter: 'Squares and Square Roots'
  },

  // CUBES AND CUBE ROOTS
  {
    notation: 'IN.CBSE.C8.MA.CUB.1',
    strand: 'Cubes and Cube Roots',
    description: 'identify perfect cubes and their properties',
    chapter: 'Cubes and Cube Roots'
  },
  {
    notation: 'IN.CBSE.C8.MA.CUB.2',
    strand: 'Cubes and Cube Roots',
    description: 'find cube roots using factorization method',
    chapter: 'Cubes and Cube Roots'
  },

  // ALGEBRA
  {
    notation: 'IN.CBSE.C8.MA.ALG.1',
    strand: 'Algebra',
    description: 'multiply algebraic expressions',
    chapter: 'Algebraic Expressions and Identities'
  },
  {
    notation: 'IN.CBSE.C8.MA.ALG.2',
    strand: 'Algebra',
    description: 'understand and apply algebraic identities',
    chapter: 'Algebraic Expressions and Identities'
  },
  {
    notation: 'IN.CBSE.C8.MA.ALG.3',
    strand: 'Algebra',
    description: 'factorize algebraic expressions',
    chapter: 'Factorisation'
  },
  {
    notation: 'IN.CBSE.C8.MA.ALG.4',
    strand: 'Algebra',
    description: 'divide algebraic expressions',
    chapter: 'Factorisation'
  },
  {
    notation: 'IN.CBSE.C8.MA.ALG.5',
    strand: 'Algebra',
    description: 'solve linear equations with variables on both sides',
    chapter: 'Linear Equations in One Variable'
  },
  {
    notation: 'IN.CBSE.C8.MA.ALG.6',
    strand: 'Algebra',
    description: 'solve equations with cross multiplication',
    chapter: 'Linear Equations in One Variable'
  },

  // RATIO AND PROPORTION
  {
    notation: 'IN.CBSE.C8.MA.RAP.1',
    strand: 'Ratio and Proportion',
    description: 'understand direct and inverse proportion',
    chapter: 'Direct and Inverse Proportions'
  },
  {
    notation: 'IN.CBSE.C8.MA.RAP.2',
    strand: 'Ratio and Proportion',
    description: 'solve problems involving compound ratio',
    chapter: 'Comparing Quantities'
  },
  {
    notation: 'IN.CBSE.C8.MA.RAP.3',
    strand: 'Ratio and Proportion',
    description: 'calculate compound interest',
    chapter: 'Comparing Quantities'
  },
  {
    notation: 'IN.CBSE.C8.MA.RAP.4',
    strand: 'Ratio and Proportion',
    description: 'apply percentage in real-life situations (discount, tax, depreciation)',
    chapter: 'Comparing Quantities'
  },

  // GEOMETRY
  {
    notation: 'IN.CBSE.C8.MA.GEO.1',
    strand: 'Geometry',
    description: 'understand properties of quadrilaterals',
    chapter: 'Understanding Quadrilaterals'
  },
  {
    notation: 'IN.CBSE.C8.MA.GEO.2',
    strand: 'Geometry',
    description: 'classify quadrilaterals based on properties',
    chapter: 'Understanding Quadrilaterals'
  },
  {
    notation: 'IN.CBSE.C8.MA.GEO.3',
    strand: 'Geometry',
    description: 'construct quadrilaterals given various conditions',
    chapter: 'Practical Geometry'
  },
  {
    notation: 'IN.CBSE.C8.MA.GEO.4',
    strand: 'Geometry',
    description: 'understand special quadrilaterals and their properties',
    chapter: 'Understanding Quadrilaterals'
  },

  // MENSURATION
  {
    notation: 'IN.CBSE.C8.MA.MEN.1',
    strand: 'Mensuration',
    description: 'calculate area of trapezium and general quadrilaterals',
    chapter: 'Mensuration'
  },
  {
    notation: 'IN.CBSE.C8.MA.MEN.2',
    strand: 'Mensuration',
    description: 'calculate surface area of cube, cuboid, cylinder',
    chapter: 'Mensuration'
  },
  {
    notation: 'IN.CBSE.C8.MA.MEN.3',
    strand: 'Mensuration',
    description: 'calculate volume of cube, cuboid, cylinder',
    chapter: 'Mensuration'
  },

  // DATA HANDLING
  {
    notation: 'IN.CBSE.C8.MA.DAT.1',
    strand: 'Data Handling',
    description: 'organize data in grouped frequency distribution',
    chapter: 'Data Handling'
  },
  {
    notation: 'IN.CBSE.C8.MA.DAT.2',
    strand: 'Data Handling',
    description: 'construct and interpret histograms and pie charts',
    chapter: 'Data Handling'
  },
  {
    notation: 'IN.CBSE.C8.MA.DAT.3',
    strand: 'Data Handling',
    description: 'understand experimental probability',
    chapter: 'Data Handling'
  },

  // GRAPHS
  {
    notation: 'IN.CBSE.C8.MA.GRP.1',
    strand: 'Graphs',
    description: 'locate points on Cartesian plane',
    chapter: 'Introduction to Graphs'
  },
  {
    notation: 'IN.CBSE.C8.MA.GRP.2',
    strand: 'Graphs',
    description: 'plot and interpret linear graphs',
    chapter: 'Introduction to Graphs'
  },
  {
    notation: 'IN.CBSE.C8.MA.GRP.3',
    strand: 'Graphs',
    description: 'read and draw graphs from real-life situations',
    chapter: 'Introduction to Graphs'
  },

  // 3D SHAPES
  {
    notation: 'IN.CBSE.C8.MA.SOL.1',
    strand: 'Solid Shapes',
    description: 'understand polyhedrons and their properties',
    chapter: 'Visualising Solid Shapes'
  },
  {
    notation: 'IN.CBSE.C8.MA.SOL.2',
    strand: 'Solid Shapes',
    description: 'apply Euler\'s formula for polyhedrons',
    chapter: 'Visualising Solid Shapes'
  },
  {
    notation: 'IN.CBSE.C8.MA.SOL.3',
    strand: 'Solid Shapes',
    description: 'understand mapping of 3D objects to 2D representations',
    chapter: 'Visualising Solid Shapes'
  },

  // PLAYING WITH NUMBERS
  {
    notation: 'IN.CBSE.C8.MA.NUM.1',
    strand: 'Numbers and Operations',
    description: 'understand divisibility rules',
    chapter: 'Playing with Numbers'
  },
  {
    notation: 'IN.CBSE.C8.MA.NUM.2',
    strand: 'Numbers and Operations',
    description: 'solve puzzles and games involving numbers',
    chapter: 'Playing with Numbers'
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
