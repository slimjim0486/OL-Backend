/**
 * British National Curriculum - Mathematics Standards
 * Years 1-13 (Key Stages 1-5)
 *
 * Sources:
 * - KS1-3 (Years 1-9): GOV.UK National Curriculum in England
 *   https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study
 * - KS4 (Years 10-11 GCSE): DfE GCSE Mathematics Subject Content
 *   https://www.gov.uk/government/publications/gcse-mathematics-subject-content-and-assessment-objectives
 * - KS5 (Years 12-13 A-Level): DfE A-Level Mathematics Subject Content
 *   https://www.gov.uk/government/publications/gce-as-and-a-level-mathematics
 *
 * VERIFIED: 2026-01-24 against official DfE documentation
 *
 * Notation System: UK.KS{keyStage}.Y{year}.MA.{strand}.{number}
 * - UK = United Kingdom
 * - KS = Key Stage (1-5)
 * - Y = Year (1-13)
 * - MA = Mathematics
 *
 * Strand codes by Key Stage:
 *
 * KS1-2 (Years 1-6):
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
 *
 * KS3 (Years 7-9):
 *   - NUM = Number
 *   - ALG = Algebra
 *   - RPR = Ratio, Proportion and Rates of Change
 *   - GEO = Geometry and Measures
 *   - PRB = Probability
 *   - STA = Statistics
 *   - WMF = Working Mathematically - Develop Fluency
 *   - WMR = Working Mathematically - Reason Mathematically
 *   - WMS = Working Mathematically - Solve Problems
 *
 * KS4 GCSE (Years 10-11):
 *   - NUM = Number
 *   - ALG = Algebra
 *   - RPR = Ratio, Proportion and Rates of Change
 *   - GEO = Geometry and Measures
 *   - PRB = Probability
 *   - STA = Statistics
 *
 * KS5 A-Level (Years 12-13):
 *   - PRF = Proof
 *   - ALG = Algebra and Functions
 *   - CGE = Coordinate Geometry
 *   - SEQ = Sequences and Series
 *   - TRG = Trigonometry
 *   - EXP = Exponentials and Logarithms
 *   - DIF = Differentiation
 *   - INT = Integration
 *   - NME = Numerical Methods
 *   - VEC = Vectors
 *   - SSA = Statistical Sampling
 *   - DPI = Data Presentation and Interpretation
 *   - PRB = Probability
 *   - SDI = Statistical Distributions
 *   - SHT = Statistical Hypothesis Testing
 *   - QUM = Quantities and Units in Mechanics
 *   - KIN = Kinematics
 *   - FNL = Forces and Newton's Laws
 *   - MOM = Moments
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
// KEY STAGE 4: YEARS 10-11 (Ages 14-16) - GCSE MATHEMATICS
// Source: DfE GCSE Mathematics Subject Content (2013, updated 2021)
// =============================================================================

const year10Standards: BritishNCStandard[] = [
  // NUMBER (NUM)
  {
    notation: 'UK.KS4.Y10.MA.NUM.1',
    strand: 'Number',
    description: 'order positive and negative integers, decimals and fractions; use the symbols =, ≠, <, >, ≤, ≥',
    isStatutory: true,
    guidance: 'Foundation and Higher tier. Students extend ordering to negative numbers and use inequality symbols fluently.'
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.2',
    strand: 'Number',
    description: 'apply the four operations, including formal written methods, to integers, decimals and simple fractions (proper and improper), and mixed numbers – all both positive and negative',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.3',
    strand: 'Number',
    description: 'understand and use place value (e.g. when working with very large or very small numbers, and when calculating with decimals)',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.4',
    strand: 'Number',
    description: 'recognise and use relationships between operations, including inverse operations (e.g. cancellation to simplify calculations and expressions)',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.5',
    strand: 'Number',
    description: 'use conventional notation for priority of operations, including brackets, powers, roots and reciprocals',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.6',
    strand: 'Number',
    description: 'use the concepts and vocabulary of prime numbers, factors (divisors), multiples, common factors, common multiples, highest common factor, lowest common multiple, prime factorisation, including using product notation and the unique factorisation theorem',
    isStatutory: true,
    guidance: 'Higher tier includes unique factorisation theorem proof understanding.'
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.7',
    strand: 'Number',
    description: 'apply systematic listing strategies including use of the product rule for counting',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.8',
    strand: 'Number',
    description: 'use positive integer powers and associated real roots (square, cube and higher), recognise powers of 2, 3, 4, 5',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.9',
    strand: 'Number',
    description: 'calculate with roots, and with integer and fractional indices',
    isStatutory: true,
    guidance: 'Higher tier extends to negative and fractional indices.'
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.10',
    strand: 'Number',
    description: 'calculate exactly with fractions, surds and multiples of π; simplify surd expressions involving squares and rationalise denominators',
    isStatutory: true,
    guidance: 'Higher tier only. Foundation students work with fractions and multiples of π.'
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.11',
    strand: 'Number',
    description: 'calculate with and interpret standard form A × 10ⁿ, where 1 ≤ A < 10 and n is an integer',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.12',
    strand: 'Number',
    description: 'work interchangeably with terminating decimals and their corresponding fractions',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.13',
    strand: 'Number',
    description: 'define percentage as "number of parts per hundred"; interpret percentages and percentage changes as a fraction or a decimal, and interpret these multiplicatively',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.14',
    strand: 'Number',
    description: 'interpret fractions and percentages as operators',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.15',
    strand: 'Number',
    description: 'use standard units of mass, length, time, money and other measures (including standard compound measures) using decimal quantities where appropriate',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.16',
    strand: 'Number',
    description: 'round numbers and measures to an appropriate degree of accuracy (e.g. to a specified number of decimal places or significant figures)',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.17',
    strand: 'Number',
    description: 'use approximation through rounding to estimate answers and calculate possible resulting errors expressed using inequality notation a < x ≤ b',
    isStatutory: true,
    guidance: 'Higher tier includes error intervals and bounds.'
  },
  {
    notation: 'UK.KS4.Y10.MA.NUM.18',
    strand: 'Number',
    description: 'apply and interpret limits of accuracy, including upper and lower bounds',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },

  // ALGEBRA (ALG)
  {
    notation: 'UK.KS4.Y10.MA.ALG.1',
    strand: 'Algebra',
    description: 'use and interpret algebraic notation, including: ab in place of a × b, 3y in place of y + y + y and 3 × y, a² in place of a × a, a³ in place of a × a × a, a/b in place of a ÷ b, coefficients written as fractions rather than as decimals, brackets',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.2',
    strand: 'Algebra',
    description: 'substitute numerical values into formulae and expressions, including scientific formulae',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.3',
    strand: 'Algebra',
    description: 'understand and use the concepts and vocabulary of expressions, equations, formulae, identities, inequalities, terms and factors',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.4',
    strand: 'Algebra',
    description: 'simplify and manipulate algebraic expressions by collecting like terms, multiplying a single term over a bracket, taking out common factors, expanding products of two or more binomials',
    isStatutory: true,
    guidance: 'Higher tier extends to expanding products of three binomials.'
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.5',
    strand: 'Algebra',
    description: 'understand and use standard mathematical formulae; rearrange formulae to change the subject',
    isStatutory: true,
    guidance: 'Higher tier includes rearranging where the subject appears twice or as a power.'
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.6',
    strand: 'Algebra',
    description: 'know the difference between an equation and an identity; argue mathematically to show algebraic expressions are equivalent, and use algebra to support and construct arguments',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.7',
    strand: 'Algebra',
    description: 'where appropriate, interpret simple expressions as functions with inputs and outputs',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.8',
    strand: 'Algebra',
    description: 'work with coordinates in all four quadrants',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.9',
    strand: 'Algebra',
    description: 'plot graphs of equations that correspond to straight-line graphs in the coordinate plane; use the form y = mx + c to identify parallel and perpendicular lines',
    isStatutory: true,
    guidance: 'Higher tier includes finding equations of perpendicular lines.'
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.10',
    strand: 'Algebra',
    description: 'find the equation of the line through two given points, or through one point with a given gradient',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.11',
    strand: 'Algebra',
    description: 'identify and interpret gradients and intercepts of linear functions graphically and algebraically',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.12',
    strand: 'Algebra',
    description: 'recognise, sketch and interpret graphs of linear functions, quadratic functions, simple cubic functions, the reciprocal function y = 1/x with x ≠ 0',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.13',
    strand: 'Algebra',
    description: 'solve linear equations in one unknown algebraically (including those with the unknown on both sides of the equation)',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.14',
    strand: 'Algebra',
    description: 'solve quadratic equations algebraically by factorising, by completing the square and by using the quadratic formula; find approximate solutions using a graph',
    isStatutory: true,
    guidance: 'Completing the square and quadratic formula are Higher tier.'
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.15',
    strand: 'Algebra',
    description: 'solve two simultaneous equations in two variables (linear/linear or linear/quadratic) algebraically; find approximate solutions using a graph',
    isStatutory: true,
    guidance: 'Linear/quadratic is Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.16',
    strand: 'Algebra',
    description: 'translate simple situations or procedures into algebraic expressions or formulae; derive an equation, solve the equation and interpret the solution',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.17',
    strand: 'Algebra',
    description: 'solve linear inequalities in one or two variable(s), and quadratic inequalities in one variable; represent the solution set on a number line, using set notation and on a graph',
    isStatutory: true,
    guidance: 'Quadratic inequalities are Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.18',
    strand: 'Algebra',
    description: 'generate terms of a sequence from either a term-to-term or a position-to-term rule',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.19',
    strand: 'Algebra',
    description: 'recognise and use sequences of triangular, square and cube numbers, simple arithmetic progressions, Fibonacci type sequences, quadratic sequences, and simple geometric progressions',
    isStatutory: true,
    guidance: 'Quadratic and geometric sequences are Higher tier.'
  },
  {
    notation: 'UK.KS4.Y10.MA.ALG.20',
    strand: 'Algebra',
    description: 'deduce expressions to calculate the nth term of linear and quadratic sequences',
    isStatutory: true,
    guidance: 'Quadratic nth term is Higher tier only.'
  },

  // RATIO, PROPORTION AND RATES OF CHANGE (RPR)
  {
    notation: 'UK.KS4.Y10.MA.RPR.1',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'change freely between related standard units (e.g. time, length, area, volume/capacity, mass) and compound units (e.g. speed, rates of pay, prices) in numerical and algebraic contexts',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.2',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'use scale factors, scale diagrams and maps',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.3',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'express one quantity as a fraction of another, where the fraction is less than 1 or greater than 1',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.4',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'use ratio notation, including reduction to simplest form',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.5',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'divide a given quantity into two parts in a given part:part or part:whole ratio; express the division of a quantity into two parts as a ratio',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.6',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'apply ratio to real contexts and problems (such as those involving conversion, comparison, scaling, mixing, concentrations)',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.7',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'understand and use proportion as equality of ratios',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.8',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'relate ratios to fractions and to linear functions',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.9',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'define percentage as "number of parts per hundred"; interpret percentages and percentage changes as a fraction or a decimal, and interpret these multiplicatively',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.10',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'express a change as a percentage of the original, and express a percentage change as a multiplier',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.11',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'solve problems involving percentage change, including percentage increase/decrease and original value problems, and simple interest including in financial mathematics',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.12',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'solve problems involving direct and inverse proportion, including graphical and algebraic representations',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.13',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'use compound units such as speed, rates of pay, unit pricing, density and pressure',
    isStatutory: true,
    guidance: 'Density and pressure are Higher tier.'
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.14',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'compare lengths, areas and volumes using ratio notation; make links to similarity (including trigonometric ratios) and scale factors',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.15',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'understand that X is inversely proportional to Y is equivalent to X is proportional to 1/Y; interpret equations that describe direct and inverse proportion',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y10.MA.RPR.16',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'set up, solve and interpret the answers in growth and decay problems, including compound interest and work with general iterative processes',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },

  // GEOMETRY AND MEASURES (GEO)
  {
    notation: 'UK.KS4.Y10.MA.GEO.1',
    strand: 'Geometry and Measures',
    description: 'use conventional terms and notations: points, lines, vertices, edges, planes, parallel lines, perpendicular lines, right angles, polygons, regular polygons and polygons with reflection and/or rotation symmetries',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.2',
    strand: 'Geometry and Measures',
    description: 'use the standard conventions for labelling and referring to the sides and angles of triangles',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.3',
    strand: 'Geometry and Measures',
    description: 'draw diagrams from written description',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.4',
    strand: 'Geometry and Measures',
    description: 'apply the properties of angles at a point, angles at a point on a straight line, vertically opposite angles; understand and use alternate and corresponding angles on parallel lines',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.5',
    strand: 'Geometry and Measures',
    description: 'derive and use the sum of angles in a triangle (e.g. to deduce and use the angle sum in any polygon, and to derive properties of regular polygons)',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.6',
    strand: 'Geometry and Measures',
    description: 'apply angle facts, triangle congruence, similarity and properties of quadrilaterals to conjecture and derive results about angles and sides, including Pythagoras\' Theorem, and use known results to obtain simple proofs',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.7',
    strand: 'Geometry and Measures',
    description: 'use Pythagoras\' Theorem and trigonometric ratios in similar triangles to solve problems involving right-angled triangles',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.8',
    strand: 'Geometry and Measures',
    description: 'use the trigonometric ratios and their exact values for 0°, 30°, 45°, 60° and 90°; know and apply the sine rule and cosine rule to find unknown lengths and angles',
    isStatutory: true,
    guidance: 'Sine rule and cosine rule are Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.9',
    strand: 'Geometry and Measures',
    description: 'know and apply Area = ½ab sin C to calculate the area, sides or angles of any triangle',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.10',
    strand: 'Geometry and Measures',
    description: 'identify, describe and construct congruent and similar shapes, including on coordinate axes, by considering rotation, reflection, translation and enlargement (including fractional and negative scale factors)',
    isStatutory: true,
    guidance: 'Negative scale factors are Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.11',
    strand: 'Geometry and Measures',
    description: 'describe the changes and invariance achieved by combinations of rotations, reflections and translations',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.12',
    strand: 'Geometry and Measures',
    description: 'identify and apply circle definitions and properties, including: centre, radius, chord, diameter, circumference, tangent, arc, sector and segment',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.13',
    strand: 'Geometry and Measures',
    description: 'apply and prove the standard circle theorems concerning angles, radii, tangents and chords, and use them to prove related results',
    isStatutory: true,
    guidance: 'Circle theorems proofs are Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.14',
    strand: 'Geometry and Measures',
    description: 'construct and interpret plans and elevations of 3D shapes',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.15',
    strand: 'Geometry and Measures',
    description: 'interpret and use bearings',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.16',
    strand: 'Geometry and Measures',
    description: 'calculate arc lengths, angles and areas of sectors of circles',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.17',
    strand: 'Geometry and Measures',
    description: 'calculate surface areas and volumes of spheres, pyramids, cones and composite solids',
    isStatutory: true,
    guidance: 'Spheres, pyramids and cones are Higher tier; composite solids with these shapes are also Higher tier.'
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.18',
    strand: 'Geometry and Measures',
    description: 'apply the concepts of congruence and similarity, including the relationships between lengths, areas and volumes in similar figures',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.19',
    strand: 'Geometry and Measures',
    description: 'know the formulae for: Pythagoras\' theorem a² + b² = c², and the trigonometric ratios, sin θ = opposite/hypotenuse, cos θ = adjacent/hypotenuse, tan θ = opposite/adjacent; apply them to find angles and lengths in right-angled triangles and, where possible, general triangles in two and three dimensional figures',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.20',
    strand: 'Geometry and Measures',
    description: 'know the exact values of sin θ and cos θ for θ = 0°, 30°, 45°, 60° and 90°; know the exact value of tan θ for θ = 0°, 30°, 45° and 60°',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.21',
    strand: 'Geometry and Measures',
    description: 'describe translations as 2D vectors',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.22',
    strand: 'Geometry and Measures',
    description: 'apply addition and subtraction of vectors, multiplication of vectors by a scalar, and diagrammatic and column representations of vectors',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.GEO.23',
    strand: 'Geometry and Measures',
    description: 'use vectors to construct geometric arguments and proofs',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },

  // PROBABILITY (PRB)
  {
    notation: 'UK.KS4.Y10.MA.PRB.1',
    strand: 'Probability',
    description: 'record, describe and analyse the frequency of outcomes of probability experiments using tables and frequency trees',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.PRB.2',
    strand: 'Probability',
    description: 'apply ideas of randomness, fairness and equally likely events to calculate expected outcomes of multiple future experiments',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.PRB.3',
    strand: 'Probability',
    description: 'relate relative expected frequencies to theoretical probability, using appropriate language and the 0-1 probability scale',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.PRB.4',
    strand: 'Probability',
    description: 'apply the property that the probabilities of an exhaustive set of outcomes sum to one; apply the property that the probabilities of an exhaustive set of mutually exclusive events sum to one',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.PRB.5',
    strand: 'Probability',
    description: 'understand that empirical unbiased samples tend towards theoretical probability distributions, with increasing sample size',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.PRB.6',
    strand: 'Probability',
    description: 'enumerate sets and combinations of sets systematically, using tables, grids, Venn diagrams and tree diagrams',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.PRB.7',
    strand: 'Probability',
    description: 'construct theoretical possibility spaces for single and combined experiments with equally likely outcomes and use these to calculate theoretical probabilities',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.PRB.8',
    strand: 'Probability',
    description: 'calculate the probability of independent and dependent combined events, including using tree diagrams and other representations, and know the underlying assumptions',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.PRB.9',
    strand: 'Probability',
    description: 'calculate and interpret conditional probabilities through representation using expected frequencies with two-way tables, tree diagrams and Venn diagrams',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },

  // STATISTICS (STA)
  {
    notation: 'UK.KS4.Y10.MA.STA.1',
    strand: 'Statistics',
    description: 'infer properties of populations or distributions from a sample, whilst knowing the limitations of sampling',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.STA.2',
    strand: 'Statistics',
    description: 'interpret and construct tables, charts and diagrams, including frequency tables, bar charts, pie charts and pictograms for categorical data, vertical line charts for ungrouped discrete numerical data, and know their appropriate use',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.STA.3',
    strand: 'Statistics',
    description: 'interpret, analyse and compare the distributions of data sets from univariate empirical distributions through: appropriate graphical representation involving discrete, continuous and grouped data, including box plots; appropriate measures of central tendency and spread',
    isStatutory: true,
    guidance: 'Box plots are Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y10.MA.STA.4',
    strand: 'Statistics',
    description: 'apply statistics to describe a population',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.STA.5',
    strand: 'Statistics',
    description: 'use and interpret scatter graphs of bivariate data; recognise correlation and know that it does not indicate causation; draw estimated lines of best fit; make predictions; interpolate and extrapolate apparent trends whilst knowing the dangers of so doing',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y10.MA.STA.6',
    strand: 'Statistics',
    description: 'interpret, analyse and compare the distributions of data sets from univariate empirical distributions using appropriate measures of central tendency (median, mean, mode and modal class) and spread (range, including consideration of outliers, quartiles and inter-quartile range)',
    isStatutory: true,
    guidance: 'Quartiles and IQR are Higher tier.'
  },
  {
    notation: 'UK.KS4.Y10.MA.STA.7',
    strand: 'Statistics',
    description: 'use and interpret cumulative frequency graphs and histograms',
    isStatutory: true,
    guidance: 'Histograms with unequal class widths are Higher tier only.'
  }
];

const year11Standards: BritishNCStandard[] = [
  // Year 11 consolidates and extends Year 10 GCSE content to exam level
  // These standards focus on higher-tier content and exam preparation

  // NUMBER - Advanced (NUM)
  {
    notation: 'UK.KS4.Y11.MA.NUM.1',
    strand: 'Number',
    description: 'change recurring decimals into their corresponding fractions and vice versa',
    isStatutory: true,
    guidance: 'Higher tier only. Students must be able to prove that recurring decimals are rational.'
  },
  {
    notation: 'UK.KS4.Y11.MA.NUM.2',
    strand: 'Number',
    description: 'interpret, order and calculate with numbers written in standard form (including negative indices)',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.MA.NUM.3',
    strand: 'Number',
    description: 'manipulate surds, including rationalising the denominator',
    isStatutory: true,
    guidance: 'Higher tier only. Includes expressions like 1/(√3 + 1).'
  },
  {
    notation: 'UK.KS4.Y11.MA.NUM.4',
    strand: 'Number',
    description: 'apply and interpret limits of accuracy including upper and lower bounds in calculations',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.NUM.5',
    strand: 'Number',
    description: 'use inequality notation to specify simple error intervals due to truncation or rounding',
    isStatutory: true
  },

  // ALGEBRA - Advanced (ALG)
  {
    notation: 'UK.KS4.Y11.MA.ALG.1',
    strand: 'Algebra',
    description: 'simplify and manipulate algebraic expressions (including those involving surds and algebraic fractions) by factorising quadratic expressions of the form x² + bx + c, including the difference of two squares; factorising quadratic expressions of the form ax² + bx + c',
    isStatutory: true,
    guidance: 'ax² + bx + c factorisation is Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.ALG.2',
    strand: 'Algebra',
    description: 'simplify algebraic fractions and simplify expressions involving sums, products and powers, including the laws of indices',
    isStatutory: true,
    guidance: 'Higher tier includes algebraic fractions with binomial denominators.'
  },
  {
    notation: 'UK.KS4.Y11.MA.ALG.3',
    strand: 'Algebra',
    description: 'know and use the quadratic formula to solve quadratic equations; complete the square of a quadratic expression and hence solve the equation',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.ALG.4',
    strand: 'Algebra',
    description: 'solve simultaneous equations where one is linear and one is quadratic',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.ALG.5',
    strand: 'Algebra',
    description: 'find approximate solutions to equations numerically using iteration',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.ALG.6',
    strand: 'Algebra',
    description: 'recognise, sketch and interpret graphs of exponential functions y = kˣ for positive values of k, and the trigonometric functions y = sin x, y = cos x and y = tan x for angles of any size',
    isStatutory: true,
    guidance: 'Exponential and trigonometric graphs are Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.ALG.7',
    strand: 'Algebra',
    description: 'sketch translations and reflections of the graph of a given function',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.ALG.8',
    strand: 'Algebra',
    description: 'interpret the gradient of a straight line graph as a rate of change; recognise and interpret graphs that illustrate direct and inverse proportion',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.MA.ALG.9',
    strand: 'Algebra',
    description: 'interpret the gradient at a point on a curve as the instantaneous rate of change; apply the concepts of average and instantaneous rate of change (gradients of chords and tangents) in numerical, algebraic and graphical contexts',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.ALG.10',
    strand: 'Algebra',
    description: 'calculate or estimate gradients of graphs and areas under graphs (including quadratic and other non-linear graphs), and interpret results in cases such as distance-time graphs, velocity-time graphs and graphs in financial contexts',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.MA.ALG.11',
    strand: 'Algebra',
    description: 'deduce turning points of quadratic functions by completing the square',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.ALG.12',
    strand: 'Algebra',
    description: 'recognise and use the equation of a circle with centre at the origin; find the equation of a tangent to a circle at a given point',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },

  // RATIO, PROPORTION AND RATES OF CHANGE - Advanced (RPR)
  {
    notation: 'UK.KS4.Y11.MA.RPR.1',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'set up, solve and interpret the answers in growth and decay problems, including compound interest',
    isStatutory: true,
    guidance: 'Higher tier extends to general exponential growth/decay models.'
  },
  {
    notation: 'UK.KS4.Y11.MA.RPR.2',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'understand that X is inversely proportional to Y is equivalent to X is proportional to 1/Y; construct and interpret equations that describe direct and inverse proportion',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.RPR.3',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'use compound units such as density, pressure, speed and acceleration in problem-solving',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.MA.RPR.4',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'interpret the gradient of a straight line graph as a rate of change and use this to solve problems',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.MA.RPR.5',
    strand: 'Ratio, Proportion and Rates of Change',
    description: 'compare lengths, areas and volumes using ratio notation and/or scale factors; make links to similarity and scale factors',
    isStatutory: true
  },

  // GEOMETRY AND MEASURES - Advanced (GEO)
  {
    notation: 'UK.KS4.Y11.MA.GEO.1',
    strand: 'Geometry and Measures',
    description: 'prove the standard circle theorems: angle in a semicircle is 90°; angle at centre is twice angle at circumference; angles in the same segment are equal; opposite angles in a cyclic quadrilateral sum to 180°; tangent meets radius at 90°; alternate segment theorem',
    isStatutory: true,
    guidance: 'Higher tier only. Students must be able to prove theorems and apply them.'
  },
  {
    notation: 'UK.KS4.Y11.MA.GEO.2',
    strand: 'Geometry and Measures',
    description: 'know and use the sine rule a/sin A = b/sin B = c/sin C and cosine rule a² = b² + c² – 2bc cos A; apply these to find unknown lengths and angles',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.GEO.3',
    strand: 'Geometry and Measures',
    description: 'apply the formula Area = ½ab sin C to calculate the area of a triangle',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.GEO.4',
    strand: 'Geometry and Measures',
    description: 'solve problems involving trigonometry in 3D figures',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.GEO.5',
    strand: 'Geometry and Measures',
    description: 'calculate surface area and volume of spheres, pyramids, cones and frustums of cones',
    isStatutory: true,
    guidance: 'Frustums are Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.GEO.6',
    strand: 'Geometry and Measures',
    description: 'apply the concepts of congruence and similarity, including the relationships between lengths in similar figures, areas of similar figures and volumes of similar figures',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.MA.GEO.7',
    strand: 'Geometry and Measures',
    description: 'use vectors to construct geometric arguments and proofs',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },

  // PROBABILITY - Advanced (PRB)
  {
    notation: 'UK.KS4.Y11.MA.PRB.1',
    strand: 'Probability',
    description: 'calculate and interpret conditional probabilities through representation using expected frequencies with two-way tables, tree diagrams and Venn diagrams',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.PRB.2',
    strand: 'Probability',
    description: 'understand and use set notation including union (∪), intersection (∩) and complement',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.MA.PRB.3',
    strand: 'Probability',
    description: 'apply systematic listing strategies including use of the product rule for counting',
    isStatutory: true
  },

  // STATISTICS - Advanced (STA)
  {
    notation: 'UK.KS4.Y11.MA.STA.1',
    strand: 'Statistics',
    description: 'construct and interpret histograms with unequal class widths (using frequency density)',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.STA.2',
    strand: 'Statistics',
    description: 'interpret, analyse and compare the distributions of data sets from univariate empirical distributions through appropriate measures of central tendency and spread (median, quartiles, inter-quartile range) and use to compare distributions',
    isStatutory: true
  },
  {
    notation: 'UK.KS4.Y11.MA.STA.3',
    strand: 'Statistics',
    description: 'construct and interpret box plots (box and whisker diagrams)',
    isStatutory: true,
    guidance: 'Higher tier only.'
  },
  {
    notation: 'UK.KS4.Y11.MA.STA.4',
    strand: 'Statistics',
    description: 'compare distributions using measures of central tendency and measures of spread, including box plots and cumulative frequency curves',
    isStatutory: true
  }
];

// =============================================================================
// KEY STAGE 5: YEARS 12-13 (Ages 16-18) - A-LEVEL MATHEMATICS
// Source: DfE A-Level Mathematics Subject Content (2014, for teaching from 2017)
// =============================================================================

const year12Standards: BritishNCStandard[] = [
  // PROOF (PRF)
  {
    notation: 'UK.KS5.Y12.MA.PRF.1',
    strand: 'Proof',
    description: 'understand and use the structure of mathematical proof, proceeding from given assumptions through a series of logical steps to a conclusion; use methods of proof, including proof by deduction and proof by exhaustion',
    isStatutory: true,
    guidance: 'Foundation for mathematical reasoning at A-Level.'
  },
  {
    notation: 'UK.KS5.Y12.MA.PRF.2',
    strand: 'Proof',
    description: 'construct proofs using mathematical induction; contexts include sums of series, divisibility and powers of matrices',
    isStatutory: true,
    guidance: 'Higher content, typically introduced in Year 12 but developed further in Year 13.'
  },
  {
    notation: 'UK.KS5.Y12.MA.PRF.3',
    strand: 'Proof',
    description: 'use disproof by counter-example',
    isStatutory: true
  },

  // ALGEBRA AND FUNCTIONS (ALG)
  {
    notation: 'UK.KS5.Y12.MA.ALG.1',
    strand: 'Algebra and Functions',
    description: 'understand and use the laws of indices for all rational exponents',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.ALG.2',
    strand: 'Algebra and Functions',
    description: 'use and manipulate surds, including rationalising the denominator',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.ALG.3',
    strand: 'Algebra and Functions',
    description: 'work with quadratic functions and their graphs; the discriminant of a quadratic function, including the conditions for real and repeated roots; completing the square; solution of quadratic equations and quadratic inequalities',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.ALG.4',
    strand: 'Algebra and Functions',
    description: 'solve simultaneous equations in two variables by elimination and by substitution, including one linear and one quadratic equation',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.ALG.5',
    strand: 'Algebra and Functions',
    description: 'solve linear and quadratic inequalities in a single variable and interpret such inequalities graphically, including inequalities with brackets and fractions; express solutions through correct use of "and" and "or", or through set notation',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.ALG.6',
    strand: 'Algebra and Functions',
    description: 'represent linear and quadratic inequalities such as y > x + 1 and y > ax² + bx + c graphically',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.ALG.7',
    strand: 'Algebra and Functions',
    description: 'manipulate polynomials algebraically, including expanding brackets and collecting like terms, factorisation and simple algebraic division; use of the factor theorem',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.ALG.8',
    strand: 'Algebra and Functions',
    description: 'understand and use graphs of functions; sketch curves defined by simple equations including polynomials, the modulus of a linear function, y = a/x and y = a/x² (including their vertical and horizontal asymptotes); interpret algebraic solution of equations graphically; use intersection points of graphs to solve equations',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.ALG.9',
    strand: 'Algebra and Functions',
    description: 'understand and use composite functions; inverse functions and their graphs',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.ALG.10',
    strand: 'Algebra and Functions',
    description: 'understand the effect of simple transformations on the graph of y = f(x) including sketching associated graphs: y = af(x), y = f(x) + a, y = f(x + a), y = f(ax) and combinations of these transformations',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.ALG.11',
    strand: 'Algebra and Functions',
    description: 'decompose rational functions into partial fractions (denominators not more than 3 linear terms and/or irreducible quadratic in the denominator)',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.ALG.12',
    strand: 'Algebra and Functions',
    description: 'use of functions in modelling, including consideration of limitations and refinements of the models',
    isStatutory: true
  },

  // COORDINATE GEOMETRY (CGE)
  {
    notation: 'UK.KS5.Y12.MA.CGE.1',
    strand: 'Coordinate Geometry',
    description: 'understand and use the equation of a straight line, including the forms y - y₁ = m(x - x₁) and ax + by + c = 0; gradient conditions for two straight lines to be parallel or perpendicular',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.CGE.2',
    strand: 'Coordinate Geometry',
    description: 'be able to use straight line models in a variety of contexts',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.CGE.3',
    strand: 'Coordinate Geometry',
    description: 'understand and use the coordinate geometry of the circle including using the equation of a circle in the form (x − a)² + (y − b)² = r²; completing the square to find the centre and radius of a circle; use of the following properties: the angle in a semicircle is a right angle; the perpendicular from the centre to a chord bisects the chord; the radius of a circle at a given point on its circumference is perpendicular to the tangent to the circle at that point',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.CGE.4',
    strand: 'Coordinate Geometry',
    description: 'understand and use the parametric equations of curves and conversion between Cartesian and parametric forms',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.CGE.5',
    strand: 'Coordinate Geometry',
    description: 'use parametric equations in modelling in a variety of contexts',
    isStatutory: true
  },

  // SEQUENCES AND SERIES (SEQ)
  {
    notation: 'UK.KS5.Y12.MA.SEQ.1',
    strand: 'Sequences and Series',
    description: 'understand and use the binomial expansion of (a + bx)ⁿ for positive integer n; the notations n! and ⁿCᵣ; link to binomial probabilities',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.SEQ.2',
    strand: 'Sequences and Series',
    description: 'extend the binomial expansion to any rational n; know and use the general term formula',
    isStatutory: true,
    guidance: 'Extension to non-positive integer exponents.'
  },
  {
    notation: 'UK.KS5.Y12.MA.SEQ.3',
    strand: 'Sequences and Series',
    description: 'work with sequences including those given by a formula for the nth term and those generated by a simple relation of the form xₙ₊₁ = f(xₙ); increasing sequences; decreasing sequences; periodic sequences',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.SEQ.4',
    strand: 'Sequences and Series',
    description: 'understand and use sigma notation for sums of series including use of r, r², r³',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.SEQ.5',
    strand: 'Sequences and Series',
    description: 'understand and work with arithmetic sequences and series, including the formulae for nth term and the sum to n terms',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.SEQ.6',
    strand: 'Sequences and Series',
    description: 'understand and work with geometric sequences and series including the formulae for the nth term and the sum of a finite geometric series; the sum to infinity of a convergent geometric series, including the use of |r| < 1; modelling with sequences and series',
    isStatutory: true
  },

  // TRIGONOMETRY (TRG)
  {
    notation: 'UK.KS5.Y12.MA.TRG.1',
    strand: 'Trigonometry',
    description: 'understand and use the definitions of sine, cosine and tangent for all arguments; the sine and cosine rules; the area of a triangle in the form ½ab sin C',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.TRG.2',
    strand: 'Trigonometry',
    description: 'work with radian measure, including use for arc length and area of sector',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.TRG.3',
    strand: 'Trigonometry',
    description: 'understand and use the standard small angle approximations of sine, cosine and tangent: sin θ ≈ θ, cos θ ≈ 1 − θ²/2, tan θ ≈ θ where θ is in radians',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.TRG.4',
    strand: 'Trigonometry',
    description: 'understand and use the sine, cosine and tangent functions; their graphs, symmetries and periodicity',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.TRG.5',
    strand: 'Trigonometry',
    description: 'know and use exact values of sin and cos for 0, π/6, π/4, π/3, π/2, π and multiples thereof; exact values of tan for 0, π/6, π/4, π/3, π and multiples thereof',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.TRG.6',
    strand: 'Trigonometry',
    description: 'understand and use the definitions of secant, cosecant and cotangent and of arcsin, arccos and arctan; their relationships to sine, cosine and tangent; understanding of their graphs; their ranges and domains',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.TRG.7',
    strand: 'Trigonometry',
    description: 'understand and use tan θ = sin θ/cos θ and sin²θ + cos²θ = 1 and related identities',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.TRG.8',
    strand: 'Trigonometry',
    description: 'understand and use sec²θ = 1 + tan²θ and cosec²θ = 1 + cot²θ',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.TRG.9',
    strand: 'Trigonometry',
    description: 'understand and use double angle formulae; use of formulae for sin(A ± B), cos(A ± B) and tan(A ± B)',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.TRG.10',
    strand: 'Trigonometry',
    description: 'understand and use expressions for a cos θ + b sin θ in the equivalent forms of R cos(θ ± α) or R sin(θ ± α)',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.TRG.11',
    strand: 'Trigonometry',
    description: 'solve simple trigonometric equations in a given interval, including quadratic equations in sin, cos and tan and equations involving multiples of the unknown angle',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.TRG.12',
    strand: 'Trigonometry',
    description: 'construct proofs involving trigonometric functions and identities',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.TRG.13',
    strand: 'Trigonometry',
    description: 'use trigonometric functions to solve problems in context, including problems involving vectors, kinematics and forces',
    isStatutory: true
  },

  // EXPONENTIALS AND LOGARITHMS (EXP)
  {
    notation: 'UK.KS5.Y12.MA.EXP.1',
    strand: 'Exponentials and Logarithms',
    description: 'know and use the function aˣ and its graph, where a is positive',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.EXP.2',
    strand: 'Exponentials and Logarithms',
    description: 'know and use the function eˣ and its graph',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.EXP.3',
    strand: 'Exponentials and Logarithms',
    description: 'know that the gradient of eˣ is equal to kekˣ and hence understand why the exponential model is suitable in many applications',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.EXP.4',
    strand: 'Exponentials and Logarithms',
    description: 'know and use the definition of logₐx as the inverse of aˣ, where a is positive (a ≠ 1) and x > 0',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.EXP.5',
    strand: 'Exponentials and Logarithms',
    description: 'know and use the function ln x and its graph',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.EXP.6',
    strand: 'Exponentials and Logarithms',
    description: 'know and use ln x as the inverse function of eˣ',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.EXP.7',
    strand: 'Exponentials and Logarithms',
    description: 'understand and use the laws of logarithms: logₐx + logₐy = logₐ(xy), logₐx − logₐy = logₐ(x/y), k logₐx = logₐxᵏ (including k = −1 and k = −½)',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.EXP.8',
    strand: 'Exponentials and Logarithms',
    description: 'solve equations of the form aˣ = b',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.EXP.9',
    strand: 'Exponentials and Logarithms',
    description: 'use logarithmic graphs to estimate parameters in relationships of the form y = axⁿ and y = kbˣ, given data for x and y',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.EXP.10',
    strand: 'Exponentials and Logarithms',
    description: 'understand and use exponential growth and decay; use in modelling (examples may include the use of e in continuous compound interest, radioactive decay, drug concentration decay, exponential growth as a model for population growth); consideration of limitations and refinements of exponential models',
    isStatutory: true
  },

  // DIFFERENTIATION (DIF)
  {
    notation: 'UK.KS5.Y12.MA.DIF.1',
    strand: 'Differentiation',
    description: 'understand and use the derivative of f(x) as the gradient of the tangent to the graph of y = f(x) at a general point (x, y); the gradient of the tangent as a limit; interpretation as a rate of change',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DIF.2',
    strand: 'Differentiation',
    description: 'sketching the gradient function for a given curve; second derivatives; differentiation from first principles for small positive integer powers of x and for sin x and cos x',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DIF.3',
    strand: 'Differentiation',
    description: 'differentiate xⁿ, for rational values of n, and related constant multiples, sums and differences',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DIF.4',
    strand: 'Differentiation',
    description: 'differentiate eᵏˣ, aᵏˣ, sin kx, cos kx, tan kx and related sums, differences and constant multiples',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DIF.5',
    strand: 'Differentiation',
    description: 'understand and use the derivative of ln x',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DIF.6',
    strand: 'Differentiation',
    description: 'apply differentiation to find gradients, tangents and normals, maxima and minima and stationary points, points of inflection',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DIF.7',
    strand: 'Differentiation',
    description: 'identify where functions are increasing or decreasing',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DIF.8',
    strand: 'Differentiation',
    description: 'differentiate using the product rule, the quotient rule and the chain rule, including problems involving connected rates of change and inverse functions',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DIF.9',
    strand: 'Differentiation',
    description: 'differentiate simple functions and relations defined implicitly or parametrically, for first derivative only',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DIF.10',
    strand: 'Differentiation',
    description: 'construct simple differential equations in pure mathematics and in context (contexts may include kinematics, population growth and modelling the relationship between price and demand)',
    isStatutory: true
  },

  // INTEGRATION (INT)
  {
    notation: 'UK.KS5.Y12.MA.INT.1',
    strand: 'Integration',
    description: 'know and use the Fundamental Theorem of Calculus',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.INT.2',
    strand: 'Integration',
    description: 'integrate xⁿ (excluding n = −1), and related sums, differences and constant multiples',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.INT.3',
    strand: 'Integration',
    description: 'integrate eᵏˣ, 1/x, sin kx, cos kx and related sums, differences and constant multiples',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.INT.4',
    strand: 'Integration',
    description: 'evaluate definite integrals; use a definite integral to find the area under a curve and the area between two curves',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.INT.5',
    strand: 'Integration',
    description: 'understand and use integration as the limit of a sum',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.INT.6',
    strand: 'Integration',
    description: 'carry out simple cases of integration by substitution and integration by parts; understand these methods as the inverse processes of the chain and product rules respectively',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.INT.7',
    strand: 'Integration',
    description: 'integrate using partial fractions that are linear in the denominator',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.INT.8',
    strand: 'Integration',
    description: 'evaluate the analytical solution of simple first order differential equations with separable variables, including finding particular solutions',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.INT.9',
    strand: 'Integration',
    description: 'interpret the solution of a differential equation in the context of solving a problem, including identifying limitations of the solution; includes links to sherds',
    isStatutory: true
  },

  // VECTORS (VEC)
  {
    notation: 'UK.KS5.Y12.MA.VEC.1',
    strand: 'Vectors',
    description: 'use vectors in two dimensions and in three dimensions',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.VEC.2',
    strand: 'Vectors',
    description: 'calculate the magnitude and direction of a vector and convert between component form and magnitude/direction form',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.VEC.3',
    strand: 'Vectors',
    description: 'add vectors diagrammatically and perform the algebraic operations of vector addition and multiplication by scalars, and understand their geometrical interpretations',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.VEC.4',
    strand: 'Vectors',
    description: 'understand and use position vectors; calculate the distance between two points represented by position vectors',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.VEC.5',
    strand: 'Vectors',
    description: 'use vectors to solve problems in pure mathematics and in context, including forces and kinematics',
    isStatutory: true
  },

  // STATISTICAL SAMPLING (SSA)
  {
    notation: 'UK.KS5.Y12.MA.SSA.1',
    strand: 'Statistical Sampling',
    description: 'understand and use the terms "population" and "sample"; use samples to make informal inferences about the population',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.SSA.2',
    strand: 'Statistical Sampling',
    description: 'understand and use sampling techniques, including simple random sampling and opportunity sampling; select or critique sampling techniques in the context of solving a statistical problem, including understanding that different samples can lead to different conclusions about the population',
    isStatutory: true
  },

  // DATA PRESENTATION AND INTERPRETATION (DPI)
  {
    notation: 'UK.KS5.Y12.MA.DPI.1',
    strand: 'Data Presentation and Interpretation',
    description: 'interpret diagrams for single-variable data, including understanding that area in a histogram represents frequency',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DPI.2',
    strand: 'Data Presentation and Interpretation',
    description: 'connect to probability distributions',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DPI.3',
    strand: 'Data Presentation and Interpretation',
    description: 'interpret scatter diagrams and regression lines for bivariate data, including recognition of scatter diagrams which include distinct sections of the population',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DPI.4',
    strand: 'Data Presentation and Interpretation',
    description: 'understand and apply the concept of correlation',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DPI.5',
    strand: 'Data Presentation and Interpretation',
    description: 'interpret measures of central tendency and variation, extending to standard deviation',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DPI.6',
    strand: 'Data Presentation and Interpretation',
    description: 'be able to calculate standard deviation, including from summary statistics',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DPI.7',
    strand: 'Data Presentation and Interpretation',
    description: 'recognise and interpret possible outliers in data sets and statistical diagrams',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DPI.8',
    strand: 'Data Presentation and Interpretation',
    description: 'select or critique data presentation techniques in the context of a statistical problem',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.DPI.9',
    strand: 'Data Presentation and Interpretation',
    description: 'be able to clean data, including dealing with missing data, errors and outliers',
    isStatutory: true
  },

  // PROBABILITY (PRB)
  {
    notation: 'UK.KS5.Y12.MA.PRB.1',
    strand: 'Probability',
    description: 'understand and use mutually exclusive and independent events when calculating probabilities',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.PRB.2',
    strand: 'Probability',
    description: 'link to discrete and continuous distributions',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.PRB.3',
    strand: 'Probability',
    description: 'understand and use conditional probability, including the use of tree diagrams, Venn diagrams, two-way tables',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.PRB.4',
    strand: 'Probability',
    description: 'understand and use the conditional probability formula P(A|B) = P(A∩B)/P(B)',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.PRB.5',
    strand: 'Probability',
    description: 'model with probability, including critiquing assumptions made and the likely effect of more realistic assumptions',
    isStatutory: true
  },

  // STATISTICAL DISTRIBUTIONS (SDI)
  {
    notation: 'UK.KS5.Y12.MA.SDI.1',
    strand: 'Statistical Distributions',
    description: 'understand and use simple, discrete probability distributions (calculation of mean and variance of discrete random variables is excluded), including the binomial distribution, as a model; calculate probabilities using the binomial distribution',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.SDI.2',
    strand: 'Statistical Distributions',
    description: 'understand and use the Normal distribution as a model; find probabilities using the Normal distribution',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.SDI.3',
    strand: 'Statistical Distributions',
    description: 'link to histograms, mean, standard deviation, points of inflection and the binomial distribution',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.SDI.4',
    strand: 'Statistical Distributions',
    description: 'select an appropriate probability distribution for a context, with appropriate reasoning, including recognising when the binomial or Normal model may not be appropriate',
    isStatutory: true
  },

  // STATISTICAL HYPOTHESIS TESTING (SHT)
  {
    notation: 'UK.KS5.Y12.MA.SHT.1',
    strand: 'Statistical Hypothesis Testing',
    description: 'understand and apply the language of statistical hypothesis testing, developed through a binomial model: null hypothesis, alternative hypothesis, significance level, test statistic, 1-tail test, 2-tail test, critical value, critical region, acceptance region, p-value',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.SHT.2',
    strand: 'Statistical Hypothesis Testing',
    description: 'conduct a statistical hypothesis test for the proportion in the binomial distribution and interpret the results in context',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.SHT.3',
    strand: 'Statistical Hypothesis Testing',
    description: 'understand that a sample is being used to make an inference about the population and appreciate that the significance level is the probability of incorrectly rejecting the null hypothesis',
    isStatutory: true
  },

  // QUANTITIES AND UNITS IN MECHANICS (QUM)
  {
    notation: 'UK.KS5.Y12.MA.QUM.1',
    strand: 'Quantities and Units in Mechanics',
    description: 'understand and use fundamental quantities and units in the S.I. system: length, time, mass',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.QUM.2',
    strand: 'Quantities and Units in Mechanics',
    description: 'understand and use derived quantities and units: velocity, acceleration, force, weight, moment',
    isStatutory: true
  },

  // KINEMATICS (KIN)
  {
    notation: 'UK.KS5.Y12.MA.KIN.1',
    strand: 'Kinematics',
    description: 'understand and use the language of kinematics: position; displacement; distance travelled; velocity; speed; acceleration',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.KIN.2',
    strand: 'Kinematics',
    description: 'understand, use and interpret graphs in kinematics for motion in a straight line: displacement against time and interpretation of gradient; velocity against time and interpretation of gradient and area under the graph',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.KIN.3',
    strand: 'Kinematics',
    description: 'understand, use and derive the formulae for constant acceleration for motion in a straight line; extend to 2 dimensions using vectors',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.KIN.4',
    strand: 'Kinematics',
    description: 'use calculus in kinematics for motion in a straight line: v = dr/dt, a = dv/dt = d²r/dt², r = ∫v dt, v = ∫a dt; extend to 2 dimensions using vectors',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.KIN.5',
    strand: 'Kinematics',
    description: 'model motion under gravity in a vertical plane using vectors; projectiles',
    isStatutory: true
  },

  // FORCES AND NEWTON'S LAWS (FNL)
  {
    notation: 'UK.KS5.Y12.MA.FNL.1',
    strand: 'Forces and Newton\'s Laws',
    description: 'understand the concept of a force; understand and use Newton\'s first law',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.FNL.2',
    strand: 'Forces and Newton\'s Laws',
    description: 'understand and use Newton\'s second law for motion in a straight line (including where forces need to be resolved); extend to situations where forces need to be resolved (2 dimensions)',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.FNL.3',
    strand: 'Forces and Newton\'s Laws',
    description: 'understand and use weight and the model of an object as a particle',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.FNL.4',
    strand: 'Forces and Newton\'s Laws',
    description: 'understand and use Newton\'s third law; equilibrium of forces on a particle and modelling the contact between two rough surfaces by friction (i.e. friction is sufficiently large to prevent motion, or motion is imminent, or sliding is occurring); understanding of F ≤ μR; motion of a body on a rough surface',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y12.MA.FNL.5',
    strand: 'Forces and Newton\'s Laws',
    description: 'apply Newton\'s laws to linear motion and simple problems involving connected particles',
    isStatutory: true
  }
];

const year13Standards: BritishNCStandard[] = [
  // Year 13 extends Year 12 content and adds Further Mathematics preparation

  // PROOF - Advanced (PRF)
  {
    notation: 'UK.KS5.Y13.MA.PRF.1',
    strand: 'Proof',
    description: 'apply proof by contradiction (including proving the irrationality of √2 and the infinity of primes)',
    isStatutory: true,
    guidance: 'Extension of proof techniques from Year 12.'
  },
  {
    notation: 'UK.KS5.Y13.MA.PRF.2',
    strand: 'Proof',
    description: 'apply advanced mathematical induction proofs including sums of series, divisibility and recurrence relations',
    isStatutory: true
  },

  // ALGEBRA AND FUNCTIONS - Advanced (ALG)
  {
    notation: 'UK.KS5.Y13.MA.ALG.1',
    strand: 'Algebra and Functions',
    description: 'simplify rational expressions including by factorising and cancelling, and algebraic division (by linear expressions only)',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.ALG.2',
    strand: 'Algebra and Functions',
    description: 'decompose rational functions into partial fractions (including cases with repeated linear terms in the denominator)',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.ALG.3',
    strand: 'Algebra and Functions',
    description: 'understand and use the modulus function; sketch the modulus of a function and solve equations and inequalities involving the modulus function',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.ALG.4',
    strand: 'Algebra and Functions',
    description: 'use functions in modelling, including consideration of limitations and refinements of the models',
    isStatutory: true
  },

  // COORDINATE GEOMETRY - Advanced (CGE)
  {
    notation: 'UK.KS5.Y13.MA.CGE.1',
    strand: 'Coordinate Geometry',
    description: 'understand and use the parametric equations of curves and sketch parametric curves; use parametric equations in modelling in a variety of contexts',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.CGE.2',
    strand: 'Coordinate Geometry',
    description: 'convert between Cartesian and parametric forms; understand the connection between the equation of a curve and its parametric form',
    isStatutory: true
  },

  // SEQUENCES AND SERIES - Advanced (SEQ)
  {
    notation: 'UK.KS5.Y13.MA.SEQ.1',
    strand: 'Sequences and Series',
    description: 'understand and use the binomial expansion of (1 + x)ⁿ for rational n, including validity range |x| < 1',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.SEQ.2',
    strand: 'Sequences and Series',
    description: 'work with Maclaurin series and Taylor series; understand the relation between power series and functions',
    isStatutory: true,
    guidance: 'Introduction to advanced series expansions.'
  },

  // TRIGONOMETRY - Advanced (TRG)
  {
    notation: 'UK.KS5.Y13.MA.TRG.1',
    strand: 'Trigonometry',
    description: 'solve more complex trigonometric equations including those requiring the use of double angle and addition formulae',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.TRG.2',
    strand: 'Trigonometry',
    description: 'use trigonometric identities to prove results and solve problems in pure mathematics and applications',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.TRG.3',
    strand: 'Trigonometry',
    description: 'apply trigonometry in 3D contexts including finding angles between lines and planes',
    isStatutory: true
  },

  // DIFFERENTIATION - Advanced (DIF)
  {
    notation: 'UK.KS5.Y13.MA.DIF.1',
    strand: 'Differentiation',
    description: 'differentiate parametric equations and implicit functions to find gradients, tangents and normals',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.DIF.2',
    strand: 'Differentiation',
    description: 'use second derivatives to classify stationary points and investigate concavity',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.DIF.3',
    strand: 'Differentiation',
    description: 'apply differentiation to model and solve problems involving rates of change, optimisation and related rates',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.DIF.4',
    strand: 'Differentiation',
    description: 'construct differential equations and verify their solutions',
    isStatutory: true
  },

  // INTEGRATION - Advanced (INT)
  {
    notation: 'UK.KS5.Y13.MA.INT.1',
    strand: 'Integration',
    description: 'integrate more complex functions using substitution, integration by parts and partial fractions',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.INT.2',
    strand: 'Integration',
    description: 'use integration to find volumes of revolution about the x-axis and y-axis',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.INT.3',
    strand: 'Integration',
    description: 'solve differential equations of the form dy/dx = f(x)g(y) and interpret solutions in context',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.INT.4',
    strand: 'Integration',
    description: 'evaluate improper integrals where either the integrand is undefined at a value in the range of integration, or the range of integration extends to infinity',
    isStatutory: true,
    guidance: 'Extension content for more able students.'
  },

  // NUMERICAL METHODS (NME)
  {
    notation: 'UK.KS5.Y13.MA.NME.1',
    strand: 'Numerical Methods',
    description: 'locate roots of f(x) = 0 by considering changes of sign of f(x) in an interval of x on which f(x) is sufficiently well-behaved',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.NME.2',
    strand: 'Numerical Methods',
    description: 'understand how change of sign methods can fail',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.NME.3',
    strand: 'Numerical Methods',
    description: 'solve equations approximately using simple iterative methods; be able to draw cobweb and staircase diagrams to illustrate and understand convergence, and the notation xₙ₊₁ = g(xₙ)',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.NME.4',
    strand: 'Numerical Methods',
    description: 'solve equations using the Newton-Raphson method and other recurrence relations of the form xₙ₊₁ = g(xₙ)',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.NME.5',
    strand: 'Numerical Methods',
    description: 'understand how such methods can fail',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.NME.6',
    strand: 'Numerical Methods',
    description: 'use numerical methods to solve problems in context',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.NME.7',
    strand: 'Numerical Methods',
    description: 'use the trapezium rule to estimate the value of a definite integral; use increasing number of strips to estimate accuracy',
    isStatutory: true
  },

  // VECTORS - Advanced (VEC)
  {
    notation: 'UK.KS5.Y13.MA.VEC.1',
    strand: 'Vectors',
    description: 'use vectors in three dimensions; calculate the distance between two points in 3D space',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.VEC.2',
    strand: 'Vectors',
    description: 'understand and use the equation of a line in 3D in vector form r = a + tb',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.VEC.3',
    strand: 'Vectors',
    description: 'calculate the scalar product of two vectors; use the scalar product to find the angle between two vectors and to prove perpendicularity',
    isStatutory: true
  },

  // STATISTICAL DISTRIBUTIONS - Advanced (SDI)
  {
    notation: 'UK.KS5.Y13.MA.SDI.1',
    strand: 'Statistical Distributions',
    description: 'use the Normal distribution as an approximation to the binomial distribution; understand when this is appropriate',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.SDI.2',
    strand: 'Statistical Distributions',
    description: 'apply continuity corrections when using Normal approximations',
    isStatutory: true
  },

  // STATISTICAL HYPOTHESIS TESTING - Advanced (SHT)
  {
    notation: 'UK.KS5.Y13.MA.SHT.1',
    strand: 'Statistical Hypothesis Testing',
    description: 'conduct a statistical hypothesis test for the mean of a Normal distribution with known, given or assumed variance and interpret the results in context',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.SHT.2',
    strand: 'Statistical Hypothesis Testing',
    description: 'understand the terminology of hypothesis testing including Type I and Type II errors',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.SHT.3',
    strand: 'Statistical Hypothesis Testing',
    description: 'conduct a statistical hypothesis test for the correlation coefficient for bivariate data and interpret the results in context',
    isStatutory: true
  },

  // FORCES AND NEWTON'S LAWS - Advanced (FNL)
  {
    notation: 'UK.KS5.Y13.MA.FNL.1',
    strand: 'Forces and Newton\'s Laws',
    description: 'understand and apply the principle of moments and solve problems involving parallel and non-parallel coplanar forces',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.FNL.2',
    strand: 'Forces and Newton\'s Laws',
    description: 'resolve forces in 2 dimensions; apply equilibrium conditions for a particle and a rigid body',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.FNL.3',
    strand: 'Forces and Newton\'s Laws',
    description: 'solve problems involving friction including the coefficient of friction and the limiting equilibrium',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.FNL.4',
    strand: 'Forces and Newton\'s Laws',
    description: 'apply Newton\'s laws to problems involving connected particles including those on inclined planes',
    isStatutory: true
  },

  // MOMENTS (MOM)
  {
    notation: 'UK.KS5.Y13.MA.MOM.1',
    strand: 'Moments',
    description: 'understand and use moments in simple static contexts',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.MOM.2',
    strand: 'Moments',
    description: 'understand and apply the principle of moments to solve problems involving equilibrium of rigid bodies',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.MOM.3',
    strand: 'Moments',
    description: 'solve problems involving centres of mass of symmetric uniform plane laminas and simple composite bodies',
    isStatutory: true,
    guidance: 'Extension to composite shapes and practical applications.'
  },

  // KINEMATICS - Advanced (KIN)
  {
    notation: 'UK.KS5.Y13.MA.KIN.1',
    strand: 'Kinematics',
    description: 'use calculus for kinematics in two and three dimensions with position, velocity and acceleration as vector functions of time',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.KIN.2',
    strand: 'Kinematics',
    description: 'solve problems involving projectile motion including finding range, maximum height and time of flight',
    isStatutory: true
  },
  {
    notation: 'UK.KS5.Y13.MA.KIN.3',
    strand: 'Kinematics',
    description: 'solve problems involving variable acceleration using integration and differentiation',
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
  version: '2014 + GCSE 2021 + A-Level 2017 (verified 2026)',
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
    { year: 9, keyStage: 3, ageRangeMin: 13, ageRangeMax: 14, standards: year9Standards },
    { year: 10, keyStage: 4, ageRangeMin: 14, ageRangeMax: 15, standards: year10Standards },
    { year: 11, keyStage: 4, ageRangeMin: 15, ageRangeMax: 16, standards: year11Standards },
    { year: 12, keyStage: 5, ageRangeMin: 16, ageRangeMax: 17, standards: year12Standards },
    { year: 13, keyStage: 5, ageRangeMin: 17, ageRangeMax: 18, standards: year13Standards }
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
