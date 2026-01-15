/**
 * British National Curriculum - Mathematics Standards
 * Years 1-6 (Key Stages 1 and 2) - PRIMARY ONLY
 *
 * Source: GOV.UK National Curriculum in England
 * https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study
 *
 * VERIFIED: 2025-01-14 against official GOV.UK documentation
 *
 * Notation System: UK.KS{keyStage}.Y{year}.MA.{strand}.{number}
 * - UK = United Kingdom
 * - KS = Key Stage (1 or 2)
 * - Y = Year (1-6)
 * - MA = Mathematics
 * - Strand codes:
 *   - NPV = Number - Place Value
 *   - NAS = Number - Addition and Subtraction
 *   - NMD = Number - Multiplication and Division
 *   - NFR = Number - Fractions (inc. decimals, percentages)
 *   - MEA = Measurement
 *   - GPS = Geometry - Properties of Shapes
 *   - GPD = Geometry - Position and Direction
 *   - STA = Statistics
 *   - ALG = Algebra (Year 6 only)
 *   - RAT = Ratio and Proportion (Year 6 only)
 */

export interface BritishNCStandard {
  notation: string;
  strand: string;
  description: string;
  isStatutory: boolean;
  guidance?: string;
}

export interface BritishNCYear {
  year: number;
  keyStage: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: BritishNCStandard[];
}

export interface BritishNCJurisdiction {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  years: BritishNCYear[];
}

// =============================================================================
// KEY STAGE 1: YEARS 1-2 (Ages 5-7)
// =============================================================================

const year1Standards: BritishNCStandard[] = [
  // NUMBER - PLACE VALUE (NPV)
  {
    notation: 'UK.KS1.Y1.MA.NPV.1',
    strand: 'Number - Place Value',
    description: 'count to and across 100, forwards and backwards, beginning with 0 or 1, or from any given number',
    isStatutory: true,
    guidance: 'Pupils practise counting (1, 2, 3…), ordering (for example, first, second, third…), and to indicate a quantity (for example, 3 apples, 2 centimetres), including solving simple concrete problems, until they are fluent.'
  },
  {
    notation: 'UK.KS1.Y1.MA.NPV.2',
    strand: 'Number - Place Value',
    description: 'count, read and write numbers to 100 in numerals; count in multiples of 2s, 5s and 10s',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.NPV.3',
    strand: 'Number - Place Value',
    description: 'given a number, identify 1 more and 1 less',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.NPV.4',
    strand: 'Number - Place Value',
    description: 'identify and represent numbers using objects and pictorial representations including the number line, and use the language of: equal to, more than, less than (fewer), most, least',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.NPV.5',
    strand: 'Number - Place Value',
    description: 'read and write numbers from 1 to 20 in numerals and words',
    isStatutory: true
  },

  // NUMBER - ADDITION AND SUBTRACTION (NAS)
  {
    notation: 'UK.KS1.Y1.MA.NAS.1',
    strand: 'Number - Addition and Subtraction',
    description: 'read, write and interpret mathematical statements involving addition (+), subtraction (−) and equals (=) signs',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.NAS.2',
    strand: 'Number - Addition and Subtraction',
    description: 'represent and use number bonds and related subtraction facts within 20',
    isStatutory: true,
    guidance: 'Pupils memorise and reason with number bonds to 10 and 20 in several forms (for example, 9 + 7 = 16; 16 − 7 = 9; 7 = 16 − 9). They should realise the effect of adding or subtracting 0. This establishes addition and subtraction as related operations.'
  },
  {
    notation: 'UK.KS1.Y1.MA.NAS.3',
    strand: 'Number - Addition and Subtraction',
    description: 'add and subtract one-digit and two-digit numbers to 20, including 0',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.NAS.4',
    strand: 'Number - Addition and Subtraction',
    description: 'solve one-step problems that involve addition and subtraction, using concrete objects and pictorial representations, and missing number problems such as 7 = ? − 9',
    isStatutory: true
  },

  // NUMBER - MULTIPLICATION AND DIVISION (NMD)
  {
    notation: 'UK.KS1.Y1.MA.NMD.1',
    strand: 'Number - Multiplication and Division',
    description: 'solve one-step problems involving multiplication and division, by calculating the answer using concrete objects, pictorial representations and arrays with the support of the teacher',
    isStatutory: true,
    guidance: 'They make connections between arrays, number patterns, and counting in 2s, 5s and 10s.'
  },

  // NUMBER - FRACTIONS (NFR)
  {
    notation: 'UK.KS1.Y1.MA.NFR.1',
    strand: 'Number - Fractions',
    description: 'recognise, find and name a half as 1 of 2 equal parts of an object, shape or quantity',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.NFR.2',
    strand: 'Number - Fractions',
    description: 'recognise, find and name a quarter as 1 of 4 equal parts of an object, shape or quantity',
    isStatutory: true
  },

  // MEASUREMENT (MEA)
  {
    notation: 'UK.KS1.Y1.MA.MEA.1',
    strand: 'Measurement',
    description: 'compare, describe and solve practical problems for: lengths and heights [for example, long/short, longer/shorter, tall/short, double/half]',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.MEA.2',
    strand: 'Measurement',
    description: 'compare, describe and solve practical problems for: mass/weight [for example, heavy/light, heavier than, lighter than]',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.MEA.3',
    strand: 'Measurement',
    description: 'compare, describe and solve practical problems for: capacity and volume [for example, full/empty, more than, less than, half, half full, quarter]',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.MEA.4',
    strand: 'Measurement',
    description: 'compare, describe and solve practical problems for: time [for example, quicker, slower, earlier, later]',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.MEA.5',
    strand: 'Measurement',
    description: 'measure and begin to record the following: lengths and heights',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.MEA.6',
    strand: 'Measurement',
    description: 'measure and begin to record the following: mass/weight',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.MEA.7',
    strand: 'Measurement',
    description: 'measure and begin to record the following: capacity and volume',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.MEA.8',
    strand: 'Measurement',
    description: 'measure and begin to record the following: time (hours, minutes, seconds)',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.MEA.9',
    strand: 'Measurement',
    description: 'recognise and know the value of different denominations of coins and notes',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.MEA.10',
    strand: 'Measurement',
    description: 'sequence events in chronological order using language [for example, before and after, next, first, today, yesterday, tomorrow, morning, afternoon and evening]',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.MEA.11',
    strand: 'Measurement',
    description: 'recognise and use language relating to dates, including days of the week, weeks, months and years',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.MEA.12',
    strand: 'Measurement',
    description: 'tell the time to the hour and half past the hour and draw the hands on a clock face to show these times',
    isStatutory: true
  },

  // GEOMETRY - PROPERTIES OF SHAPES (GPS)
  {
    notation: 'UK.KS1.Y1.MA.GPS.1',
    strand: 'Geometry - Properties of Shapes',
    description: 'recognise and name common 2-D and 3-D shapes, including: 2-D shapes [for example, rectangles (including squares), circles and triangles]',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y1.MA.GPS.2',
    strand: 'Geometry - Properties of Shapes',
    description: 'recognise and name common 2-D and 3-D shapes, including: 3-D shapes [for example, cuboids (including cubes), pyramids and spheres]',
    isStatutory: true
  },

  // GEOMETRY - POSITION AND DIRECTION (GPD)
  {
    notation: 'UK.KS1.Y1.MA.GPD.1',
    strand: 'Geometry - Position and Direction',
    description: 'describe position, direction and movement, including whole, half, quarter and three-quarter turns',
    isStatutory: true
  }
];

const year2Standards: BritishNCStandard[] = [
  // NUMBER - PLACE VALUE (NPV)
  {
    notation: 'UK.KS1.Y2.MA.NPV.1',
    strand: 'Number - Place Value',
    description: 'count in steps of 2, 3, and 5 from 0, and in 10s from any number, forward and backward',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NPV.2',
    strand: 'Number - Place Value',
    description: 'recognise the place value of each digit in a two-digit number (10s, 1s)',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NPV.3',
    strand: 'Number - Place Value',
    description: 'identify, represent and estimate numbers using different representations, including the number line',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NPV.4',
    strand: 'Number - Place Value',
    description: 'compare and order numbers from 0 up to 100; use <, > and = signs',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NPV.5',
    strand: 'Number - Place Value',
    description: 'read and write numbers to at least 100 in numerals and in words',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NPV.6',
    strand: 'Number - Place Value',
    description: 'use place value and number facts to solve problems',
    isStatutory: true
  },

  // NUMBER - ADDITION AND SUBTRACTION (NAS)
  {
    notation: 'UK.KS1.Y2.MA.NAS.1',
    strand: 'Number - Addition and Subtraction',
    description: 'solve problems with addition and subtraction: using concrete objects and pictorial representations, including those involving numbers, quantities and measures',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NAS.2',
    strand: 'Number - Addition and Subtraction',
    description: 'solve problems with addition and subtraction: applying their increasing knowledge of mental and written methods',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NAS.3',
    strand: 'Number - Addition and Subtraction',
    description: 'recall and use addition and subtraction facts to 20 fluently, and derive and use related facts up to 100',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NAS.4',
    strand: 'Number - Addition and Subtraction',
    description: 'add and subtract numbers using concrete objects, pictorial representations, and mentally, including: a two-digit number and 1s',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NAS.5',
    strand: 'Number - Addition and Subtraction',
    description: 'add and subtract numbers using concrete objects, pictorial representations, and mentally, including: a two-digit number and 10s',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NAS.6',
    strand: 'Number - Addition and Subtraction',
    description: 'add and subtract numbers using concrete objects, pictorial representations, and mentally, including: 2 two-digit numbers',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NAS.7',
    strand: 'Number - Addition and Subtraction',
    description: 'add and subtract numbers using concrete objects, pictorial representations, and mentally, including: adding 3 one-digit numbers',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NAS.8',
    strand: 'Number - Addition and Subtraction',
    description: 'show that addition of 2 numbers can be done in any order (commutative) and subtraction of 1 number from another cannot',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NAS.9',
    strand: 'Number - Addition and Subtraction',
    description: 'recognise and use the inverse relationship between addition and subtraction and use this to check calculations and solve missing number problems',
    isStatutory: true
  },

  // NUMBER - MULTIPLICATION AND DIVISION (NMD)
  {
    notation: 'UK.KS1.Y2.MA.NMD.1',
    strand: 'Number - Multiplication and Division',
    description: 'recall and use multiplication and division facts for the 2, 5 and 10 multiplication tables, including recognising odd and even numbers',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NMD.2',
    strand: 'Number - Multiplication and Division',
    description: 'calculate mathematical statements for multiplication and division within the multiplication tables and write them using the multiplication (×), division (÷) and equals (=) signs',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NMD.3',
    strand: 'Number - Multiplication and Division',
    description: 'show that multiplication of 2 numbers can be done in any order (commutative) and division of 1 number by another cannot',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NMD.4',
    strand: 'Number - Multiplication and Division',
    description: 'solve problems involving multiplication and division, using materials, arrays, repeated addition, mental methods, and multiplication and division facts, including problems in contexts',
    isStatutory: true
  },

  // NUMBER - FRACTIONS (NFR)
  {
    notation: 'UK.KS1.Y2.MA.NFR.1',
    strand: 'Number - Fractions',
    description: 'recognise, find, name and write fractions 1/3, 1/4, 2/4 and 3/4 of a length, shape, set of objects or quantity',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.NFR.2',
    strand: 'Number - Fractions',
    description: 'write simple fractions, for example 1/2 of 6 = 3 and recognise the equivalence of 2/4 and 1/2',
    isStatutory: true
  },

  // MEASUREMENT (MEA)
  {
    notation: 'UK.KS1.Y2.MA.MEA.1',
    strand: 'Measurement',
    description: 'choose and use appropriate standard units to estimate and measure length/height in any direction (m/cm); mass (kg/g); temperature (°C); capacity (litres/ml) to the nearest appropriate unit, using rulers, scales, thermometers and measuring vessels',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.MEA.2',
    strand: 'Measurement',
    description: 'compare and order lengths, mass, volume/capacity and record the results using >, < and =',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.MEA.3',
    strand: 'Measurement',
    description: 'recognise and use symbols for pounds (£) and pence (p); combine amounts to make a particular value',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.MEA.4',
    strand: 'Measurement',
    description: 'find different combinations of coins that equal the same amounts of money',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.MEA.5',
    strand: 'Measurement',
    description: 'solve simple problems in a practical context involving addition and subtraction of money of the same unit, including giving change',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.MEA.6',
    strand: 'Measurement',
    description: 'compare and sequence intervals of time',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.MEA.7',
    strand: 'Measurement',
    description: 'tell and write the time to five minutes, including quarter past/to the hour and draw the hands on a clock face to show these times',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.MEA.8',
    strand: 'Measurement',
    description: 'know the number of minutes in an hour and the number of hours in a day',
    isStatutory: true
  },

  // GEOMETRY - PROPERTIES OF SHAPES (GPS)
  {
    notation: 'UK.KS1.Y2.MA.GPS.1',
    strand: 'Geometry - Properties of Shapes',
    description: 'identify and describe the properties of 2-D shapes, including the number of sides, and line symmetry in a vertical line',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.GPS.2',
    strand: 'Geometry - Properties of Shapes',
    description: 'identify and describe the properties of 3-D shapes, including the number of edges, vertices and faces',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.GPS.3',
    strand: 'Geometry - Properties of Shapes',
    description: 'identify 2-D shapes on the surface of 3-D shapes, [for example, a circle on a cylinder and a triangle on a pyramid]',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.GPS.4',
    strand: 'Geometry - Properties of Shapes',
    description: 'compare and sort common 2-D and 3-D shapes and everyday objects',
    isStatutory: true
  },

  // GEOMETRY - POSITION AND DIRECTION (GPD)
  {
    notation: 'UK.KS1.Y2.MA.GPD.1',
    strand: 'Geometry - Position and Direction',
    description: 'order and arrange combinations of mathematical objects in patterns and sequences',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.GPD.2',
    strand: 'Geometry - Position and Direction',
    description: 'use mathematical vocabulary to describe position, direction and movement, including movement in a straight line and distinguishing between rotation as a turn and in terms of right angles for quarter, half and three-quarter turns (clockwise and anti-clockwise)',
    isStatutory: true
  },

  // STATISTICS (STA)
  {
    notation: 'UK.KS1.Y2.MA.STA.1',
    strand: 'Statistics',
    description: 'interpret and construct simple pictograms, tally charts, block diagrams and tables',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.STA.2',
    strand: 'Statistics',
    description: 'ask and answer simple questions by counting the number of objects in each category and sorting the categories by quantity',
    isStatutory: true
  },
  {
    notation: 'UK.KS1.Y2.MA.STA.3',
    strand: 'Statistics',
    description: 'ask-and-answer questions about totalling and comparing categorical data',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 2: YEARS 3-6 (Ages 7-11)
// =============================================================================

const year3Standards: BritishNCStandard[] = [
  // NUMBER - PLACE VALUE (NPV)
  {
    notation: 'UK.KS2.Y3.MA.NPV.1',
    strand: 'Number - Place Value',
    description: 'count from 0 in multiples of 4, 8, 50 and 100; find 10 or 100 more or less than a given number',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NPV.2',
    strand: 'Number - Place Value',
    description: 'recognise the place value of each digit in a 3-digit number (100s, 10s, 1s)',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NPV.3',
    strand: 'Number - Place Value',
    description: 'compare and order numbers up to 1,000',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NPV.4',
    strand: 'Number - Place Value',
    description: 'identify, represent and estimate numbers using different representations',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NPV.5',
    strand: 'Number - Place Value',
    description: 'read and write numbers up to 1,000 in numerals and in words',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NPV.6',
    strand: 'Number - Place Value',
    description: 'solve number problems and practical problems involving these ideas',
    isStatutory: true
  },

  // NUMBER - ADDITION AND SUBTRACTION (NAS)
  {
    notation: 'UK.KS2.Y3.MA.NAS.1',
    strand: 'Number - Addition and Subtraction',
    description: 'add and subtract numbers mentally, including: a three-digit number and 1s',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NAS.2',
    strand: 'Number - Addition and Subtraction',
    description: 'add and subtract numbers mentally, including: a three-digit number and 10s',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NAS.3',
    strand: 'Number - Addition and Subtraction',
    description: 'add and subtract numbers mentally, including: a three-digit number and 100s',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NAS.4',
    strand: 'Number - Addition and Subtraction',
    description: 'add and subtract numbers with up to 3 digits, using formal written methods of columnar addition and subtraction',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NAS.5',
    strand: 'Number - Addition and Subtraction',
    description: 'estimate the answer to a calculation and use inverse operations to check answers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NAS.6',
    strand: 'Number - Addition and Subtraction',
    description: 'solve problems, including missing number problems, using number facts, place value, and more complex addition and subtraction',
    isStatutory: true
  },

  // NUMBER - MULTIPLICATION AND DIVISION (NMD)
  {
    notation: 'UK.KS2.Y3.MA.NMD.1',
    strand: 'Number - Multiplication and Division',
    description: 'recall and use multiplication and division facts for the 3, 4 and 8 multiplication tables',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NMD.2',
    strand: 'Number - Multiplication and Division',
    description: 'write and calculate mathematical statements for multiplication and division using the multiplication tables that they know, including for two-digit numbers times one-digit numbers, using mental and progressing to formal written methods',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NMD.3',
    strand: 'Number - Multiplication and Division',
    description: 'solve problems, including missing number problems, involving multiplication and division, including positive integer scaling problems and correspondence problems in which n objects are connected to m objects',
    isStatutory: true
  },

  // NUMBER - FRACTIONS (NFR)
  {
    notation: 'UK.KS2.Y3.MA.NFR.1',
    strand: 'Number - Fractions',
    description: 'count up and down in tenths; recognise that tenths arise from dividing an object into 10 equal parts and in dividing one-digit numbers or quantities by 10',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NFR.2',
    strand: 'Number - Fractions',
    description: 'recognise, find and write fractions of a discrete set of objects: unit fractions and non-unit fractions with small denominators',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NFR.3',
    strand: 'Number - Fractions',
    description: 'recognise and use fractions as numbers: unit fractions and non-unit fractions with small denominators',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NFR.4',
    strand: 'Number - Fractions',
    description: 'recognise and show, using diagrams, equivalent fractions with small denominators',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NFR.5',
    strand: 'Number - Fractions',
    description: 'add and subtract fractions with the same denominator within one whole [for example, 5/7 + 1/7 = 6/7]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NFR.6',
    strand: 'Number - Fractions',
    description: 'compare and order unit fractions, and fractions with the same denominators',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.NFR.7',
    strand: 'Number - Fractions',
    description: 'solve problems that involve all of the above',
    isStatutory: true
  },

  // MEASUREMENT (MEA)
  {
    notation: 'UK.KS2.Y3.MA.MEA.1',
    strand: 'Measurement',
    description: 'measure, compare, add and subtract: lengths (m/cm/mm); mass (kg/g); volume/capacity (l/ml)',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.MEA.2',
    strand: 'Measurement',
    description: 'measure the perimeter of simple 2-D shapes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.MEA.3',
    strand: 'Measurement',
    description: 'add and subtract amounts of money to give change, using both £ and p in practical contexts',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.MEA.4',
    strand: 'Measurement',
    description: 'tell and write the time from an analogue clock, including using Roman numerals from I to XII, and 12-hour and 24-hour clocks',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.MEA.5',
    strand: 'Measurement',
    description: 'estimate and read time with increasing accuracy to the nearest minute; record and compare time in terms of seconds, minutes and hours; use vocabulary such as o\'clock, am/pm, morning, afternoon, noon and midnight',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.MEA.6',
    strand: 'Measurement',
    description: 'know the number of seconds in a minute and the number of days in each month, year and leap year',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.MEA.7',
    strand: 'Measurement',
    description: 'compare durations of events [for example, to calculate the time taken by particular events or tasks]',
    isStatutory: true
  },

  // GEOMETRY - PROPERTIES OF SHAPES (GPS)
  {
    notation: 'UK.KS2.Y3.MA.GPS.1',
    strand: 'Geometry - Properties of Shapes',
    description: 'draw 2-D shapes and make 3-D shapes using modelling materials; recognise 3-D shapes in different orientations and describe them',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.GPS.2',
    strand: 'Geometry - Properties of Shapes',
    description: 'recognise angles as a property of shape or a description of a turn',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.GPS.3',
    strand: 'Geometry - Properties of Shapes',
    description: 'identify right angles, recognise that 2 right angles make a half-turn, 3 make three-quarters of a turn and 4 a complete turn; identify whether angles are greater than or less than a right angle',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.GPS.4',
    strand: 'Geometry - Properties of Shapes',
    description: 'identify horizontal and vertical lines and pairs of perpendicular and parallel lines',
    isStatutory: true
  },

  // STATISTICS (STA)
  {
    notation: 'UK.KS2.Y3.MA.STA.1',
    strand: 'Statistics',
    description: 'interpret and present data using bar charts, pictograms and tables',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y3.MA.STA.2',
    strand: 'Statistics',
    description: 'solve one-step and two-step questions [for example \'How many more?\' and \'How many fewer?\'] using information presented in scaled bar charts and pictograms and tables',
    isStatutory: true
  }
];

const year4Standards: BritishNCStandard[] = [
  // NUMBER - PLACE VALUE (NPV)
  {
    notation: 'UK.KS2.Y4.MA.NPV.1',
    strand: 'Number - Place Value',
    description: 'count in multiples of 6, 7, 9, 25 and 1,000',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NPV.2',
    strand: 'Number - Place Value',
    description: 'find 1,000 more or less than a given number',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NPV.3',
    strand: 'Number - Place Value',
    description: 'count backwards through 0 to include negative numbers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NPV.4',
    strand: 'Number - Place Value',
    description: 'recognise the place value of each digit in a four-digit number (1,000s, 100s, 10s, and 1s)',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NPV.5',
    strand: 'Number - Place Value',
    description: 'order and compare numbers beyond 1,000',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NPV.6',
    strand: 'Number - Place Value',
    description: 'identify, represent and estimate numbers using different representations',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NPV.7',
    strand: 'Number - Place Value',
    description: 'round any number to the nearest 10, 100 or 1,000',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NPV.8',
    strand: 'Number - Place Value',
    description: 'solve number and practical problems that involve all of the above and with increasingly large positive numbers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NPV.9',
    strand: 'Number - Place Value',
    description: 'read Roman numerals to 100 (I to C) and know that over time, the numeral system changed to include the concept of 0 and place value',
    isStatutory: true
  },

  // NUMBER - ADDITION AND SUBTRACTION (NAS)
  {
    notation: 'UK.KS2.Y4.MA.NAS.1',
    strand: 'Number - Addition and Subtraction',
    description: 'add and subtract numbers with up to 4 digits using the formal written methods of columnar addition and subtraction where appropriate',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NAS.2',
    strand: 'Number - Addition and Subtraction',
    description: 'estimate and use inverse operations to check answers to a calculation',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NAS.3',
    strand: 'Number - Addition and Subtraction',
    description: 'solve addition and subtraction two-step problems in contexts, deciding which operations and methods to use and why',
    isStatutory: true
  },

  // NUMBER - MULTIPLICATION AND DIVISION (NMD)
  {
    notation: 'UK.KS2.Y4.MA.NMD.1',
    strand: 'Number - Multiplication and Division',
    description: 'recall multiplication and division facts for multiplication tables up to 12 × 12',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NMD.2',
    strand: 'Number - Multiplication and Division',
    description: 'use place value, known and derived facts to multiply and divide mentally, including: multiplying by 0 and 1; dividing by 1; multiplying together 3 numbers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NMD.3',
    strand: 'Number - Multiplication and Division',
    description: 'recognise and use factor pairs and commutativity in mental calculations',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NMD.4',
    strand: 'Number - Multiplication and Division',
    description: 'multiply two-digit and three-digit numbers by a one-digit number using formal written layout',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NMD.5',
    strand: 'Number - Multiplication and Division',
    description: 'solve problems involving multiplying and adding, including using the distributive law to multiply two-digit numbers by 1 digit, integer scaling problems and harder correspondence problems such as n objects are connected to m objects',
    isStatutory: true
  },

  // NUMBER - FRACTIONS (including decimals) (NFR)
  {
    notation: 'UK.KS2.Y4.MA.NFR.1',
    strand: 'Number - Fractions (including decimals)',
    description: 'recognise and show, using diagrams, families of common equivalent fractions',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NFR.2',
    strand: 'Number - Fractions (including decimals)',
    description: 'count up and down in hundredths; recognise that hundredths arise when dividing an object by 100 and dividing tenths by 10',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NFR.3',
    strand: 'Number - Fractions (including decimals)',
    description: 'solve problems involving increasingly harder fractions to calculate quantities, and fractions to divide quantities, including non-unit fractions where the answer is a whole number',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NFR.4',
    strand: 'Number - Fractions (including decimals)',
    description: 'add and subtract fractions with the same denominator',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NFR.5',
    strand: 'Number - Fractions (including decimals)',
    description: 'recognise and write decimal equivalents of any number of tenths or hundredths',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NFR.6',
    strand: 'Number - Fractions (including decimals)',
    description: 'recognise and write decimal equivalents to 1/4, 1/2, 3/4',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NFR.7',
    strand: 'Number - Fractions (including decimals)',
    description: 'find the effect of dividing a one- or two-digit number by 10 and 100, identifying the value of the digits in the answer as ones, tenths and hundredths',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NFR.8',
    strand: 'Number - Fractions (including decimals)',
    description: 'round decimals with 1 decimal place to the nearest whole number',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NFR.9',
    strand: 'Number - Fractions (including decimals)',
    description: 'compare numbers with the same number of decimal places up to 2 decimal places',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.NFR.10',
    strand: 'Number - Fractions (including decimals)',
    description: 'solve simple measure and money problems involving fractions and decimals to 2 decimal places',
    isStatutory: true
  },

  // MEASUREMENT (MEA)
  {
    notation: 'UK.KS2.Y4.MA.MEA.1',
    strand: 'Measurement',
    description: 'convert between different units of measure [for example, kilometre to metre; hour to minute]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.MEA.2',
    strand: 'Measurement',
    description: 'measure and calculate the perimeter of a rectilinear figure (including squares) in centimetres and metres',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.MEA.3',
    strand: 'Measurement',
    description: 'find the area of rectilinear shapes by counting squares',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.MEA.4',
    strand: 'Measurement',
    description: 'estimate, compare and calculate different measures, including money in pounds and pence',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.MEA.5',
    strand: 'Measurement',
    description: 'read, write and convert time between analogue and digital 12- and 24-hour clocks',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.MEA.6',
    strand: 'Measurement',
    description: 'solve problems involving converting from hours to minutes, minutes to seconds, years to months, weeks to days',
    isStatutory: true
  },

  // GEOMETRY - PROPERTIES OF SHAPES (GPS)
  {
    notation: 'UK.KS2.Y4.MA.GPS.1',
    strand: 'Geometry - Properties of Shapes',
    description: 'compare and classify geometric shapes, including quadrilaterals and triangles, based on their properties and sizes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.GPS.2',
    strand: 'Geometry - Properties of Shapes',
    description: 'identify acute and obtuse angles and compare and order angles up to 2 right angles by size',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.GPS.3',
    strand: 'Geometry - Properties of Shapes',
    description: 'identify lines of symmetry in 2-D shapes presented in different orientations',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.GPS.4',
    strand: 'Geometry - Properties of Shapes',
    description: 'complete a simple symmetric figure with respect to a specific line of symmetry',
    isStatutory: true
  },

  // GEOMETRY - POSITION AND DIRECTION (GPD)
  {
    notation: 'UK.KS2.Y4.MA.GPD.1',
    strand: 'Geometry - Position and Direction',
    description: 'describe positions on a 2-D grid as coordinates in the first quadrant',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.GPD.2',
    strand: 'Geometry - Position and Direction',
    description: 'describe movements between positions as translations of a given unit to the left/right and up/down',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.GPD.3',
    strand: 'Geometry - Position and Direction',
    description: 'plot specified points and draw sides to complete a given polygon',
    isStatutory: true
  },

  // STATISTICS (STA)
  {
    notation: 'UK.KS2.Y4.MA.STA.1',
    strand: 'Statistics',
    description: 'interpret and present discrete and continuous data using appropriate graphical methods, including bar charts and time graphs',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y4.MA.STA.2',
    strand: 'Statistics',
    description: 'solve comparison, sum and difference problems using information presented in bar charts, pictograms, tables and other graphs',
    isStatutory: true
  }
];

const year5Standards: BritishNCStandard[] = [
  // NUMBER - PLACE VALUE (NPV)
  {
    notation: 'UK.KS2.Y5.MA.NPV.1',
    strand: 'Number - Place Value',
    description: 'read, write, order and compare numbers to at least 1,000,000 and determine the value of each digit',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NPV.2',
    strand: 'Number - Place Value',
    description: 'count forwards or backwards in steps of powers of 10 for any given number up to 1,000,000',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NPV.3',
    strand: 'Number - Place Value',
    description: 'interpret negative numbers in context, count forwards and backwards with positive and negative whole numbers, including through 0',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NPV.4',
    strand: 'Number - Place Value',
    description: 'round any number up to 1,000,000 to the nearest 10, 100, 1,000, 10,000 and 100,000',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NPV.5',
    strand: 'Number - Place Value',
    description: 'solve number problems and practical problems that involve all of the above',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NPV.6',
    strand: 'Number - Place Value',
    description: 'read Roman numerals to 1,000 (M) and recognise years written in Roman numerals',
    isStatutory: true
  },

  // NUMBER - ADDITION AND SUBTRACTION (NAS)
  {
    notation: 'UK.KS2.Y5.MA.NAS.1',
    strand: 'Number - Addition and Subtraction',
    description: 'add and subtract whole numbers with more than 4 digits, including using formal written methods (columnar addition and subtraction)',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NAS.2',
    strand: 'Number - Addition and Subtraction',
    description: 'add and subtract numbers mentally with increasingly large numbers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NAS.3',
    strand: 'Number - Addition and Subtraction',
    description: 'use rounding to check answers to calculations and determine, in the context of a problem, levels of accuracy',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NAS.4',
    strand: 'Number - Addition and Subtraction',
    description: 'solve addition and subtraction multi-step problems in contexts, deciding which operations and methods to use and why',
    isStatutory: true
  },

  // NUMBER - MULTIPLICATION AND DIVISION (NMD)
  {
    notation: 'UK.KS2.Y5.MA.NMD.1',
    strand: 'Number - Multiplication and Division',
    description: 'identify multiples and factors, including finding all factor pairs of a number, and common factors of 2 numbers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NMD.2',
    strand: 'Number - Multiplication and Division',
    description: 'know and use the vocabulary of prime numbers, prime factors and composite (non-prime) numbers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NMD.3',
    strand: 'Number - Multiplication and Division',
    description: 'establish whether a number up to 100 is prime and recall prime numbers up to 19',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NMD.4',
    strand: 'Number - Multiplication and Division',
    description: 'multiply numbers up to 4 digits by a one- or two-digit number using a formal written method, including long multiplication for two-digit numbers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NMD.5',
    strand: 'Number - Multiplication and Division',
    description: 'multiply and divide numbers mentally, drawing upon known facts',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NMD.6',
    strand: 'Number - Multiplication and Division',
    description: 'divide numbers up to 4 digits by a one-digit number using the formal written method of short division and interpret remainders appropriately for the context',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NMD.7',
    strand: 'Number - Multiplication and Division',
    description: 'multiply and divide whole numbers and those involving decimals by 10, 100 and 1,000',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NMD.8',
    strand: 'Number - Multiplication and Division',
    description: 'recognise and use square numbers and cube numbers, and the notation for squared (²) and cubed (³)',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NMD.9',
    strand: 'Number - Multiplication and Division',
    description: 'solve problems involving multiplication and division, including using their knowledge of factors and multiples, squares and cubes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NMD.10',
    strand: 'Number - Multiplication and Division',
    description: 'solve problems involving addition, subtraction, multiplication and division and a combination of these, including understanding the meaning of the equals sign',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NMD.11',
    strand: 'Number - Multiplication and Division',
    description: 'solve problems involving multiplication and division, including scaling by simple fractions and problems involving simple rates',
    isStatutory: true
  },

  // NUMBER - FRACTIONS (including decimals and percentages) (NFR)
  {
    notation: 'UK.KS2.Y5.MA.NFR.1',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'compare and order fractions whose denominators are all multiples of the same number',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NFR.2',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'identify, name and write equivalent fractions of a given fraction, represented visually, including tenths and hundredths',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NFR.3',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'recognise mixed numbers and improper fractions and convert from one form to the other and write mathematical statements > 1 as a mixed number [for example, 2/5 + 4/5 = 6/5 = 1 1/5]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NFR.4',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'add and subtract fractions with the same denominator, and denominators that are multiples of the same number',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NFR.5',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'multiply proper fractions and mixed numbers by whole numbers, supported by materials and diagrams',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NFR.6',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'read and write decimal numbers as fractions [for example, 0.71 = 71/100]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NFR.7',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'recognise and use thousandths and relate them to tenths, hundredths and decimal equivalents',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NFR.8',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'round decimals with 2 decimal places to the nearest whole number and to 1 decimal place',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NFR.9',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'read, write, order and compare numbers with up to 3 decimal places',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NFR.10',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'solve problems involving number up to 3 decimal places',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NFR.11',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'recognise the per cent symbol (%) and understand that per cent relates to \'number of parts per 100\', and write percentages as a fraction with denominator 100, and as a decimal fraction',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.NFR.12',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'solve problems which require knowing percentage and decimal equivalents of 1/2, 1/4, 1/5, 2/5, 4/5 and those fractions with a denominator of a multiple of 10 or 25',
    isStatutory: true
  },

  // MEASUREMENT (MEA)
  {
    notation: 'UK.KS2.Y5.MA.MEA.1',
    strand: 'Measurement',
    description: 'convert between different units of metric measure [for example, kilometre and metre; centimetre and metre; centimetre and millimetre; gram and kilogram; litre and millilitre]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.MEA.2',
    strand: 'Measurement',
    description: 'understand and use approximate equivalences between metric units and common imperial units such as inches, pounds and pints',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.MEA.3',
    strand: 'Measurement',
    description: 'measure and calculate the perimeter of composite rectilinear shapes in centimetres and metres',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.MEA.4',
    strand: 'Measurement',
    description: 'calculate and compare the area of rectangles (including squares), including using standard units, square centimetres (cm²) and square metres (m²), and estimate the area of irregular shapes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.MEA.5',
    strand: 'Measurement',
    description: 'estimate volume [for example, using 1 cm³ blocks to build cuboids (including cubes)] and capacity [for example, using water]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.MEA.6',
    strand: 'Measurement',
    description: 'solve problems involving converting between units of time',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.MEA.7',
    strand: 'Measurement',
    description: 'use all four operations to solve problems involving measure [for example, length, mass, volume, money] using decimal notation, including scaling',
    isStatutory: true
  },

  // GEOMETRY - PROPERTIES OF SHAPES (GPS)
  {
    notation: 'UK.KS2.Y5.MA.GPS.1',
    strand: 'Geometry - Properties of Shapes',
    description: 'identify 3-D shapes, including cubes and other cuboids, from 2-D representations',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.GPS.2',
    strand: 'Geometry - Properties of Shapes',
    description: 'know angles are measured in degrees: estimate and compare acute, obtuse and reflex angles',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.GPS.3',
    strand: 'Geometry - Properties of Shapes',
    description: 'draw given angles, and measure them in degrees (°)',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.GPS.4',
    strand: 'Geometry - Properties of Shapes',
    description: 'identify: angles at a point and 1 whole turn (total 360°)',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.GPS.5',
    strand: 'Geometry - Properties of Shapes',
    description: 'identify: angles at a point on a straight line and half a turn (total 180°)',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.GPS.6',
    strand: 'Geometry - Properties of Shapes',
    description: 'identify: other multiples of 90°',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.GPS.7',
    strand: 'Geometry - Properties of Shapes',
    description: 'use the properties of rectangles to deduce related facts and find missing lengths and angles',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.GPS.8',
    strand: 'Geometry - Properties of Shapes',
    description: 'distinguish between regular and irregular polygons based on reasoning about equal sides and angles',
    isStatutory: true
  },

  // GEOMETRY - POSITION AND DIRECTION (GPD)
  {
    notation: 'UK.KS2.Y5.MA.GPD.1',
    strand: 'Geometry - Position and Direction',
    description: 'identify, describe and represent the position of a shape following a reflection or translation, using the appropriate language, and know that the shape has not changed',
    isStatutory: true
  },

  // STATISTICS (STA)
  {
    notation: 'UK.KS2.Y5.MA.STA.1',
    strand: 'Statistics',
    description: 'solve comparison, sum and difference problems using information presented in a line graph',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y5.MA.STA.2',
    strand: 'Statistics',
    description: 'complete, read and interpret information in tables, including timetables',
    isStatutory: true
  }
];

const year6Standards: BritishNCStandard[] = [
  // NUMBER - PLACE VALUE (NPV)
  {
    notation: 'UK.KS2.Y6.MA.NPV.1',
    strand: 'Number - Place Value',
    description: 'read, write, order and compare numbers up to 10,000,000 and determine the value of each digit',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NPV.2',
    strand: 'Number - Place Value',
    description: 'round any whole number to a required degree of accuracy',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NPV.3',
    strand: 'Number - Place Value',
    description: 'use negative numbers in context, and calculate intervals across 0',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NPV.4',
    strand: 'Number - Place Value',
    description: 'solve number and practical problems that involve all of the above',
    isStatutory: true
  },

  // NUMBER - ADDITION, SUBTRACTION, MULTIPLICATION AND DIVISION (NASMD)
  {
    notation: 'UK.KS2.Y6.MA.NASMD.1',
    strand: 'Number - Addition, Subtraction, Multiplication and Division',
    description: 'multiply multi-digit numbers up to 4 digits by a two-digit whole number using the formal written method of long multiplication',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NASMD.2',
    strand: 'Number - Addition, Subtraction, Multiplication and Division',
    description: 'divide numbers up to 4 digits by a two-digit whole number using the formal written method of long division, and interpret remainders as whole number remainders, fractions, or by rounding, as appropriate for the context',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NASMD.3',
    strand: 'Number - Addition, Subtraction, Multiplication and Division',
    description: 'divide numbers up to 4 digits by a two-digit number using the formal written method of short division where appropriate, interpreting remainders according to the context',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NASMD.4',
    strand: 'Number - Addition, Subtraction, Multiplication and Division',
    description: 'perform mental calculations, including with mixed operations and large numbers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NASMD.5',
    strand: 'Number - Addition, Subtraction, Multiplication and Division',
    description: 'identify common factors, common multiples and prime numbers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NASMD.6',
    strand: 'Number - Addition, Subtraction, Multiplication and Division',
    description: 'use their knowledge of the order of operations to carry out calculations involving the 4 operations',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NASMD.7',
    strand: 'Number - Addition, Subtraction, Multiplication and Division',
    description: 'solve addition and subtraction multi-step problems in contexts, deciding which operations and methods to use and why',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NASMD.8',
    strand: 'Number - Addition, Subtraction, Multiplication and Division',
    description: 'solve problems involving addition, subtraction, multiplication and division',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NASMD.9',
    strand: 'Number - Addition, Subtraction, Multiplication and Division',
    description: 'use estimation to check answers to calculations and determine, in the context of a problem, an appropriate degree of accuracy',
    isStatutory: true
  },

  // NUMBER - FRACTIONS (including decimals and percentages) (NFR)
  {
    notation: 'UK.KS2.Y6.MA.NFR.1',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'use common factors to simplify fractions; use common multiples to express fractions in the same denomination',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NFR.2',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'compare and order fractions, including fractions >1',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NFR.3',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'add and subtract fractions with different denominators and mixed numbers, using the concept of equivalent fractions',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NFR.4',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'multiply simple pairs of proper fractions, writing the answer in its simplest form [for example, 1/4 × 1/2 = 1/8]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NFR.5',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'divide proper fractions by whole numbers [for example, 1/3 ÷ 2 = 1/6]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NFR.6',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'associate a fraction with division and calculate decimal fraction equivalents [for example, 0.375] for a simple fraction [for example, 3/8]',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NFR.7',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'identify the value of each digit in numbers given to 3 decimal places and multiply and divide numbers by 10, 100 and 1,000 giving answers up to 3 decimal places',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NFR.8',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'multiply one-digit numbers with up to 2 decimal places by whole numbers',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NFR.9',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'use written division methods in cases where the answer has up to 2 decimal places',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NFR.10',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'solve problems which require answers to be rounded to specified degrees of accuracy',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.NFR.11',
    strand: 'Number - Fractions (including decimals and percentages)',
    description: 'recall and use equivalences between simple fractions, decimals and percentages, including in different contexts',
    isStatutory: true
  },

  // RATIO AND PROPORTION (RAT)
  {
    notation: 'UK.KS2.Y6.MA.RAT.1',
    strand: 'Ratio and Proportion',
    description: 'solve problems involving the relative sizes of 2 quantities where missing values can be found by using integer multiplication and division facts',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.RAT.2',
    strand: 'Ratio and Proportion',
    description: 'solve problems involving the calculation of percentages [for example, of measures and such as 15% of 360] and the use of percentages for comparison',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.RAT.3',
    strand: 'Ratio and Proportion',
    description: 'solve problems involving similar shapes where the scale factor is known or can be found',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.RAT.4',
    strand: 'Ratio and Proportion',
    description: 'solve problems involving unequal sharing and grouping using knowledge of fractions and multiples',
    isStatutory: true
  },

  // ALGEBRA (ALG)
  {
    notation: 'UK.KS2.Y6.MA.ALG.1',
    strand: 'Algebra',
    description: 'use simple formulae',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.ALG.2',
    strand: 'Algebra',
    description: 'generate and describe linear number sequences',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.ALG.3',
    strand: 'Algebra',
    description: 'express missing number problems algebraically',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.ALG.4',
    strand: 'Algebra',
    description: 'find pairs of numbers that satisfy an equation with 2 unknowns',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.ALG.5',
    strand: 'Algebra',
    description: 'enumerate possibilities of combinations of 2 variables',
    isStatutory: true
  },

  // MEASUREMENT (MEA)
  {
    notation: 'UK.KS2.Y6.MA.MEA.1',
    strand: 'Measurement',
    description: 'solve problems involving the calculation and conversion of units of measure, using decimal notation up to 3 decimal places where appropriate',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.MEA.2',
    strand: 'Measurement',
    description: 'use, read, write and convert between standard units, converting measurements of length, mass, volume and time from a smaller unit of measure to a larger unit, and vice versa, using decimal notation to up to 3 decimal places',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.MEA.3',
    strand: 'Measurement',
    description: 'convert between miles and kilometres',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.MEA.4',
    strand: 'Measurement',
    description: 'recognise that shapes with the same areas can have different perimeters and vice versa',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.MEA.5',
    strand: 'Measurement',
    description: 'recognise when it is possible to use formulae for area and volume of shapes',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.MEA.6',
    strand: 'Measurement',
    description: 'calculate the area of parallelograms and triangles',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.MEA.7',
    strand: 'Measurement',
    description: 'calculate, estimate and compare volume of cubes and cuboids using standard units, including cubic centimetres (cm³) and cubic metres (m³), and extending to other units [for example, mm³ and km³]',
    isStatutory: true
  },

  // GEOMETRY - PROPERTIES OF SHAPES (GPS)
  {
    notation: 'UK.KS2.Y6.MA.GPS.1',
    strand: 'Geometry - Properties of Shapes',
    description: 'draw 2-D shapes using given dimensions and angles',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.GPS.2',
    strand: 'Geometry - Properties of Shapes',
    description: 'recognise, describe and build simple 3-D shapes, including making nets',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.GPS.3',
    strand: 'Geometry - Properties of Shapes',
    description: 'compare and classify geometric shapes based on their properties and sizes and find unknown angles in any triangles, quadrilaterals, and regular polygons',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.GPS.4',
    strand: 'Geometry - Properties of Shapes',
    description: 'illustrate and name parts of circles, including radius, diameter and circumference and know that the diameter is twice the radius',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.GPS.5',
    strand: 'Geometry - Properties of Shapes',
    description: 'recognise angles where they meet at a point, are on a straight line, or are vertically opposite, and find missing angles',
    isStatutory: true
  },

  // GEOMETRY - POSITION AND DIRECTION (GPD)
  {
    notation: 'UK.KS2.Y6.MA.GPD.1',
    strand: 'Geometry - Position and Direction',
    description: 'describe positions on the full coordinate grid (all 4 quadrants)',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.GPD.2',
    strand: 'Geometry - Position and Direction',
    description: 'draw and translate simple shapes on the coordinate plane, and reflect them in the axes',
    isStatutory: true
  },

  // STATISTICS (STA)
  {
    notation: 'UK.KS2.Y6.MA.STA.1',
    strand: 'Statistics',
    description: 'interpret and construct pie charts and line graphs and use these to solve problems',
    isStatutory: true
  },
  {
    notation: 'UK.KS2.Y6.MA.STA.2',
    strand: 'Statistics',
    description: 'calculate and interpret the mean as an average',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 3: YEARS 7-9 (Ages 11-14)
// =============================================================================
// Note: The official KS3 curriculum is a combined programme for Years 7-9.
// These standards are allocated by year based on typical progression and complexity.

const year7Standards: BritishNCStandard[] = [
  // NUMBER (NUM)
  {
    notation: 'UK.KS3.Y7.MA.NUM.1',
    strand: 'Number',
    description: 'understand and use place value for decimals, measures and integers of any size',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.NUM.2',
    strand: 'Number',
    description: 'order positive and negative integers, decimals and fractions; use the number line as a model for ordering of the real numbers; use the symbols =, ≠, <, >, ≤, ≥',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.NUM.3',
    strand: 'Number',
    description: 'use the concepts and vocabulary of prime numbers, factors (or divisors), multiples, common factors, common multiples, highest common factor, lowest common multiple, prime factorisation, including using product notation and the unique factorisation property',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.NUM.4',
    strand: 'Number',
    description: 'use the 4 operations, including formal written methods, applied to integers, decimals, proper and improper fractions, and mixed numbers, all both positive and negative',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.NUM.5',
    strand: 'Number',
    description: 'use conventional notation for the priority of operations, including brackets, powers, roots and reciprocals',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.NUM.6',
    strand: 'Number',
    description: 'recognise and use relationships between operations including inverse operations',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.NUM.7',
    strand: 'Number',
    description: 'use integer powers and associated real roots (square, cube and higher), recognise powers of 2, 3, 4, 5 and distinguish between exact representations of roots and their decimal approximations',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.NUM.8',
    strand: 'Number',
    description: 'work interchangeably with terminating decimals and their corresponding fractions (such as 3.5 and 7/2 or 0.375 and 3/8)',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.NUM.9',
    strand: 'Number',
    description: 'use standard units of mass, length, time, money and other measures, including with decimal quantities',
    isStatutory: true
  },

  // ALGEBRA (ALG)
  {
    notation: 'UK.KS3.Y7.MA.ALG.1',
    strand: 'Algebra',
    description: 'use and interpret algebraic notation, including: ab in place of a × b; 3y in place of y + y + y and 3 × y; a² in place of a × a, a³ in place of a × a × a; a²b in place of a × a × b; a/b in place of a ÷ b; coefficients written as fractions rather than as decimals; brackets',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.ALG.2',
    strand: 'Algebra',
    description: 'substitute numerical values into formulae and expressions, including scientific formulae',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.ALG.3',
    strand: 'Algebra',
    description: 'understand and use the concepts and vocabulary of expressions, equations, inequalities, terms and factors',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.ALG.4',
    strand: 'Algebra',
    description: 'simplify and manipulate algebraic expressions to maintain equivalence by: collecting like terms; multiplying a single term over a bracket',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.ALG.5',
    strand: 'Algebra',
    description: 'work with coordinates in all 4 quadrants',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.ALG.6',
    strand: 'Algebra',
    description: 'generate terms of a sequence from either a term-to-term or a position-to-term rule',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.ALG.7',
    strand: 'Algebra',
    description: 'recognise arithmetic sequences and find the nth term',
    isStatutory: true
  },

  // RATIO, PROPORTION AND RATES OF CHANGE (RAT)
  {
    notation: 'UK.KS3.Y7.MA.RAT.1',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'change freely between related standard units [for example time, length, area, volume/capacity, mass]',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.RAT.2',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'use ratio notation, including reduction to simplest form',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.RAT.3',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'divide a given quantity into 2 parts in a given part:part or part:whole ratio; express the division of a quantity into 2 parts as a ratio',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.RAT.4',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'express 1 quantity as a fraction of another, where the fraction is less than 1 and greater than 1',
    isStatutory: true
  },

  // GEOMETRY AND MEASURES (GEO)
  {
    notation: 'UK.KS3.Y7.MA.GEO.1',
    strand: 'Geometry and Measures',
    description: 'draw and measure line segments and angles in geometric figures, including interpreting scale drawings',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.GEO.2',
    strand: 'Geometry and Measures',
    description: 'describe, sketch and draw using conventional terms and notations: points, lines, parallel lines, perpendicular lines, right angles, regular polygons, and other polygons that are reflectively and rotationally symmetric',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.GEO.3',
    strand: 'Geometry and Measures',
    description: 'use the standard conventions for labelling the sides and angles of triangle ABC, and know and use the criteria for congruence of triangles',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.GEO.4',
    strand: 'Geometry and Measures',
    description: 'derive and illustrate properties of triangles, quadrilaterals, circles, and other plane figures [for example, equal lengths and angles] using appropriate language and technologies',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.GEO.5',
    strand: 'Geometry and Measures',
    description: 'apply the properties of angles at a point, angles at a point on a straight line, vertically opposite angles',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.GEO.6',
    strand: 'Geometry and Measures',
    description: 'derive and apply formulae to calculate and solve problems involving: perimeter and area of triangles, parallelograms, trapezia',
    isStatutory: true
  },

  // PROBABILITY (PRB)
  {
    notation: 'UK.KS3.Y7.MA.PRB.1',
    strand: 'Probability',
    description: 'record, describe and analyse the frequency of outcomes of simple probability experiments involving randomness, fairness, equally and unequally likely outcomes, using appropriate language and the 0-1 probability scale',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.PRB.2',
    strand: 'Probability',
    description: 'understand that the probabilities of all possible outcomes sum to 1',
    isStatutory: true
  },

  // STATISTICS (STA)
  {
    notation: 'UK.KS3.Y7.MA.STA.1',
    strand: 'Statistics',
    description: 'describe, interpret and compare observed distributions of a single variable through: appropriate graphical representation involving discrete, continuous and grouped data; and appropriate measures of central tendency (mean, mode, median) and spread (range, consideration of outliers)',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y7.MA.STA.2',
    strand: 'Statistics',
    description: 'construct and interpret appropriate tables, charts, and diagrams, including frequency tables, bar charts, pie charts, and pictograms for categorical data, and vertical line (or bar) charts for ungrouped and grouped numerical data',
    isStatutory: true
  }
];

const year8Standards: BritishNCStandard[] = [
  // NUMBER (NUM)
  {
    notation: 'UK.KS3.Y8.MA.NUM.1',
    strand: 'Number',
    description: 'interpret and compare numbers in standard form A × 10ⁿ where 1≤A<10, where n is a positive or negative integer or 0',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.NUM.2',
    strand: 'Number',
    description: 'define percentage as \'number of parts per hundred\', interpret percentages and percentage changes as a fraction or a decimal, interpret these multiplicatively, express 1 quantity as a percentage of another, compare 2 quantities using percentages, and work with percentages greater than 100%',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.NUM.3',
    strand: 'Number',
    description: 'interpret fractions and percentages as operators',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.NUM.4',
    strand: 'Number',
    description: 'round numbers and measures to an appropriate degree of accuracy [for example, to a number of decimal places or significant figures]',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.NUM.5',
    strand: 'Number',
    description: 'use approximation through rounding to estimate answers and calculate possible resulting errors expressed using inequality notation a<x≤b',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.NUM.6',
    strand: 'Number',
    description: 'use a calculator and other technologies to calculate results accurately and then interpret them appropriately',
    isStatutory: true
  },

  // ALGEBRA (ALG)
  {
    notation: 'UK.KS3.Y8.MA.ALG.1',
    strand: 'Algebra',
    description: 'simplify and manipulate algebraic expressions to maintain equivalence by: taking out common factors; expanding products of 2 or more binomials',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.ALG.2',
    strand: 'Algebra',
    description: 'understand and use standard mathematical formulae; rearrange formulae to change the subject',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.ALG.3',
    strand: 'Algebra',
    description: 'model situations or procedures by translating them into algebraic expressions or formulae and by using graphs',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.ALG.4',
    strand: 'Algebra',
    description: 'use algebraic methods to solve linear equations in 1 variable (including all forms that require rearrangement)',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.ALG.5',
    strand: 'Algebra',
    description: 'recognise, sketch and produce graphs of linear and quadratic functions of 1 variable with appropriate scaling, using equations in x and y and the Cartesian plane',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.ALG.6',
    strand: 'Algebra',
    description: 'interpret mathematical relationships both algebraically and graphically',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.ALG.7',
    strand: 'Algebra',
    description: 'reduce a given linear equation in 2 variables to the standard form y = mx + c; calculate and interpret gradients and intercepts of graphs of such linear equations numerically, graphically and algebraically',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.ALG.8',
    strand: 'Algebra',
    description: 'recognise geometric sequences and appreciate other sequences that arise',
    isStatutory: true
  },

  // RATIO, PROPORTION AND RATES OF CHANGE (RAT)
  {
    notation: 'UK.KS3.Y8.MA.RAT.1',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'use scale factors, scale diagrams and maps',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.RAT.2',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'understand that a multiplicative relationship between 2 quantities can be expressed as a ratio or a fraction',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.RAT.3',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'relate the language of ratios and the associated calculations to the arithmetic of fractions and to linear functions',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.RAT.4',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'solve problems involving percentage change, including: percentage increase, decrease and original value problems and simple interest in financial mathematics',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.RAT.5',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'use compound units such as speed, unit pricing and density to solve problems',
    isStatutory: true
  },

  // GEOMETRY AND MEASURES (GEO)
  {
    notation: 'UK.KS3.Y8.MA.GEO.1',
    strand: 'Geometry and Measures',
    description: 'derive and use the standard ruler and compass constructions (perpendicular bisector of a line segment, constructing a perpendicular to a given line from/at a given point, bisecting a given angle); recognise and use the perpendicular distance from a point to a line as the shortest distance to the line',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.GEO.2',
    strand: 'Geometry and Measures',
    description: 'identify properties of, and describe the results of, translations, rotations and reflections applied to given figures',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.GEO.3',
    strand: 'Geometry and Measures',
    description: 'identify and construct congruent triangles, and construct similar shapes by enlargement, with and without coordinate grids',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.GEO.4',
    strand: 'Geometry and Measures',
    description: 'understand and use the relationship between parallel lines and alternate and corresponding angles',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.GEO.5',
    strand: 'Geometry and Measures',
    description: 'derive and use the sum of angles in a triangle and use it to deduce the angle sum in any polygon, and to derive properties of regular polygons',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.GEO.6',
    strand: 'Geometry and Measures',
    description: 'calculate and solve problems involving: perimeters of 2-D shapes (including circles), areas of circles and composite shapes',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.GEO.7',
    strand: 'Geometry and Measures',
    description: 'derive and apply formulae to calculate and solve problems involving: volume of cuboids (including cubes) and other prisms (including cylinders)',
    isStatutory: true
  },

  // PROBABILITY (PRB)
  {
    notation: 'UK.KS3.Y8.MA.PRB.1',
    strand: 'Probability',
    description: 'enumerate sets and unions/intersections of sets systematically, using tables, grids and Venn diagrams',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y8.MA.PRB.2',
    strand: 'Probability',
    description: 'generate theoretical sample spaces for single and combined events with equally likely, mutually exclusive outcomes and use these to calculate theoretical probabilities',
    isStatutory: true
  },

  // STATISTICS (STA)
  {
    notation: 'UK.KS3.Y8.MA.STA.1',
    strand: 'Statistics',
    description: 'describe simple mathematical relationships between 2 variables (bivariate data) in observational and experimental contexts and illustrate using scatter graphs',
    isStatutory: true
  }
];

const year9Standards: BritishNCStandard[] = [
  // NUMBER (NUM) - Advanced concepts
  {
    notation: 'UK.KS3.Y9.MA.NUM.1',
    strand: 'Number',
    description: 'appreciate the infinite nature of the sets of integers, real and rational numbers',
    isStatutory: true
  },

  // ALGEBRA (ALG) - Advanced concepts
  {
    notation: 'UK.KS3.Y9.MA.ALG.1',
    strand: 'Algebra',
    description: 'use linear and quadratic graphs to estimate values of y for given values of x and vice versa and to find approximate solutions of simultaneous linear equations',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.ALG.2',
    strand: 'Algebra',
    description: 'find approximate solutions to contextual problems from given graphs of a variety of functions, including piece-wise linear, exponential and reciprocal graphs',
    isStatutory: true
  },

  // RATIO, PROPORTION AND RATES OF CHANGE (RAT) - Advanced concepts
  {
    notation: 'UK.KS3.Y9.MA.RAT.1',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'solve problems involving direct and inverse proportion, including graphical and algebraic representations',
    isStatutory: true
  },

  // GEOMETRY AND MEASURES (GEO) - Advanced concepts
  {
    notation: 'UK.KS3.Y9.MA.GEO.1',
    strand: 'Geometry and Measures',
    description: 'apply angle facts, triangle congruence, similarity and properties of quadrilaterals to derive results about angles and sides, including Pythagoras\' Theorem, and use known results to obtain simple proofs',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.GEO.2',
    strand: 'Geometry and Measures',
    description: 'use Pythagoras\' Theorem and trigonometric ratios in similar triangles to solve problems involving right-angled triangles',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.GEO.3',
    strand: 'Geometry and Measures',
    description: 'use the properties of faces, surfaces, edges and vertices of cubes, cuboids, prisms, cylinders, pyramids, cones and spheres to solve problems in 3-D',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.GEO.4',
    strand: 'Geometry and Measures',
    description: 'interpret mathematical relationships both algebraically and geometrically',
    isStatutory: true
  },

  // WORKING MATHEMATICALLY - Develop Fluency (WMF)
  {
    notation: 'UK.KS3.Y9.MA.WMF.1',
    strand: 'Working Mathematically - Develop Fluency',
    description: 'consolidate their numerical and mathematical capability from key stage 2 and extend their understanding of the number system and place value to include decimals, fractions, powers and roots',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMF.2',
    strand: 'Working Mathematically - Develop Fluency',
    description: 'select and use appropriate calculation strategies to solve increasingly complex problems',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMF.3',
    strand: 'Working Mathematically - Develop Fluency',
    description: 'use algebra to generalise the structure of arithmetic, including to formulate mathematical relationships',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMF.4',
    strand: 'Working Mathematically - Develop Fluency',
    description: 'substitute values in expressions, rearrange and simplify expressions, and solve equations',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMF.5',
    strand: 'Working Mathematically - Develop Fluency',
    description: 'move freely between different numerical, algebraic, graphical and diagrammatic representations [for example, equivalent fractions, fractions and decimals, and equations and graphs]',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMF.6',
    strand: 'Working Mathematically - Develop Fluency',
    description: 'develop algebraic and graphical fluency, including understanding linear and simple quadratic functions',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMF.7',
    strand: 'Working Mathematically - Develop Fluency',
    description: 'use language and properties precisely to analyse numbers, algebraic expressions, 2-D and 3-D shapes, probability and statistics',
    isStatutory: true
  },

  // WORKING MATHEMATICALLY - Reason Mathematically (WMR)
  {
    notation: 'UK.KS3.Y9.MA.WMR.1',
    strand: 'Working Mathematically - Reason Mathematically',
    description: 'extend their understanding of the number system; make connections between number relationships, and their algebraic and graphical representations',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMR.2',
    strand: 'Working Mathematically - Reason Mathematically',
    description: 'extend and formalise their knowledge of ratio and proportion in working with measures and geometry, and in formulating proportional relations algebraically',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMR.3',
    strand: 'Working Mathematically - Reason Mathematically',
    description: 'identify variables and express relations between variables algebraically and graphically',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMR.4',
    strand: 'Working Mathematically - Reason Mathematically',
    description: 'make and test conjectures about patterns and relationships; look for proofs or counter-examples',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMR.5',
    strand: 'Working Mathematically - Reason Mathematically',
    description: 'begin to reason deductively in geometry, number and algebra, including using geometrical constructions',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMR.6',
    strand: 'Working Mathematically - Reason Mathematically',
    description: 'interpret when the structure of a numerical problem requires additive, multiplicative or proportional reasoning',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMR.7',
    strand: 'Working Mathematically - Reason Mathematically',
    description: 'explore what can and cannot be inferred in statistical and probabilistic settings, and begin to express their arguments formally',
    isStatutory: true
  },

  // WORKING MATHEMATICALLY - Solve Problems (WMS)
  {
    notation: 'UK.KS3.Y9.MA.WMS.1',
    strand: 'Working Mathematically - Solve Problems',
    description: 'develop their mathematical knowledge, in part through solving problems and evaluating the outcomes, including multi-step problems',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMS.2',
    strand: 'Working Mathematically - Solve Problems',
    description: 'develop their use of formal mathematical knowledge to interpret and solve problems, including in financial mathematics',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMS.3',
    strand: 'Working Mathematically - Solve Problems',
    description: 'begin to model situations mathematically and express the results using a range of formal mathematical representations',
    isStatutory: true
  },
  {
    notation: 'UK.KS3.Y9.MA.WMS.4',
    strand: 'Working Mathematically - Solve Problems',
    description: 'select appropriate concepts, methods and techniques to apply to unfamiliar and non-routine problems',
    isStatutory: true
  }
];

// =============================================================================
// BRITISH NATIONAL CURRICULUM DATA EXPORT
// =============================================================================

export const britishNCMathematics: BritishNCJurisdiction = {
  code: 'UK_NATIONAL_CURRICULUM',
  name: 'British National Curriculum',
  country: 'GB',
  version: '2014 (verified 2025)',
  sourceUrl: 'https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study',
  years: [
    { year: 1, keyStage: 1, ageRangeMin: 5, ageRangeMax: 6, standards: year1Standards },
    { year: 2, keyStage: 1, ageRangeMin: 6, ageRangeMax: 7, standards: year2Standards },
    { year: 3, keyStage: 2, ageRangeMin: 7, ageRangeMax: 8, standards: year3Standards },
    { year: 4, keyStage: 2, ageRangeMin: 8, ageRangeMax: 9, standards: year4Standards },
    { year: 5, keyStage: 2, ageRangeMin: 9, ageRangeMax: 10, standards: year5Standards },
    { year: 6, keyStage: 2, ageRangeMin: 10, ageRangeMax: 11, standards: year6Standards },
    { year: 7, keyStage: 3, ageRangeMin: 11, ageRangeMax: 12, standards: year7Standards },
    { year: 8, keyStage: 3, ageRangeMin: 12, ageRangeMax: 13, standards: year8Standards },
    { year: 9, keyStage: 3, ageRangeMin: 13, ageRangeMax: 14, standards: year9Standards }
  ]
};

// Helper functions
export function getStandardsForYear(year: number): BritishNCStandard[] {
  const yearData = britishNCMathematics.years.find(y => y.year === year);
  return yearData?.standards || [];
}

export function getStandardsForKeyStage(keyStage: number): BritishNCStandard[] {
  return britishNCMathematics.years
    .filter(y => y.keyStage === keyStage)
    .flatMap(y => y.standards);
}

export function getStandardByNotation(notation: string): BritishNCStandard | undefined {
  for (const year of britishNCMathematics.years) {
    const standard = year.standards.find(s => s.notation === notation);
    if (standard) return standard;
  }
  return undefined;
}

export function getStandardsByStrand(strand: string): BritishNCStandard[] {
  return britishNCMathematics.years
    .flatMap(y => y.standards)
    .filter(s => s.strand.toLowerCase().includes(strand.toLowerCase()));
}

export function getTotalStandardsCount(): number {
  return britishNCMathematics.years.reduce((sum, y) => sum + y.standards.length, 0);
}

export default britishNCMathematics;
