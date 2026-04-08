/**
 * ICSE (Indian Certificate of Secondary Education) - Mathematics Standards
 * Classes 1-12 (Primary through Senior Secondary)
 *
 * These are skill-based learning objectives aligned with the CISCE curriculum
 * framework. Standards focus on measurable learning outcomes rather than
 * specific textbook chapters.
 *
 * Sourcing:
 *   Classes 1-8 (Primary/Middle): CISCE-aligned scope as implemented by
 *     Selina "Concise Mathematics" and Frank "Middle School Mathematics"
 *     publishers — the de facto ICSE primary curriculum. CISCE does not
 *     publish a single binding primary syllabus; schools follow the CISCE
 *     framework via these publishers. Cross-referenced with Shaalaa.com
 *     CISCE primary syllabus pages.
 *   Classes 9-10 (ICSE): CISCE "ICSE Regulations and Syllabuses 2028"
 *     official PDF (https://cisce.org/wp-content/uploads/2026/01/9.-Mathematics.pdf).
 *     Also cross-referenced with Shaalaa.com ICSE Class 9/10 Mathematics
 *     syllabus 2026-27.
 *   Classes 11-12 (ISC): CISCE "ISC Mathematics 860 Syllabus 2027-2028".
 *     Cross-referenced with Shaalaa.com ISC Class 11/12 Mathematics syllabus
 *     2026-27.
 *
 * Notation System: IN.ICSE.C{class}.MA.{strand}.{number}
 * - IN = India
 * - ICSE = Indian Certificate of Secondary Education
 * - C = Class (1-12)
 * - MA = Mathematics
 * - Strand codes:
 *   Classes 1-5 (Primary):
 *   - NUM = Numbers and Operations
 *   - GEO = Geometry
 *   - MEA = Measurement
 *   - DAT = Data Handling
 *   - PAT = Patterns
 *   - FRA = Fractions and Decimals
 *   - MON = Money
 *   - TIM = Time
 *   Classes 6-8 (Middle):
 *   - INT = Integers and Rational Numbers
 *   - ALG = Algebra
 *   - GEO = Geometry
 *   - MEA = Measurement / Mensuration
 *   - RAT = Ratio, Proportion and Percentage
 *   - FRA = Fractions and Decimals
 *   - DAT = Data Handling
 *   - EXP = Exponents and Powers
 *   - SET = Set Concepts
 *   Classes 9-10 (ICSE Secondary):
 *   - PAR = Pure Arithmetic
 *   - COM = Commercial Mathematics
 *   - ALG = Algebra
 *   - GEO = Geometry
 *   - MEN = Mensuration
 *   - TRG = Trigonometry
 *   - STA = Statistics
 *   - PRB = Probability
 *   - COG = Coordinate Geometry
 *   Classes 11-12 (ISC):
 *   - SET = Sets, Relations and Functions
 *   - TRG = Trigonometry
 *   - ALG = Algebra
 *   - CAL = Calculus
 *   - COG = Coordinate Geometry
 *   - VEC = Vectors
 *   - 3DG = 3D Geometry
 *   - PRB = Probability and Statistics
 *   - LPG = Linear Programming
 *   - APM = Applications of Mathematics
 */

export interface ICSEMathStandard {
  notation: string;
  strand: string;
  description: string;
  chapter?: string; // Optional: CISCE syllabus unit reference
}

export interface ICSEMathClass {
  class: number;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: ICSEMathStandard[];
}

export interface ICSEMathCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  classes: ICSEMathClass[];
}

// =============================================================================
// CLASS 1 (Ages 6-7)
// Primary Stage: Number recognition, basic operations, shapes
// =============================================================================

const class1Standards: ICSEMathStandard[] = [
  // NUMBERS AND OPERATIONS
  { notation: 'IN.ICSE.C1.MA.NUM.1', strand: 'Numbers and Operations', description: 'count objects up to 100 using one-to-one correspondence' },
  { notation: 'IN.ICSE.C1.MA.NUM.2', strand: 'Numbers and Operations', description: 'read and write numerals and number names from 1 to 100' },
  { notation: 'IN.ICSE.C1.MA.NUM.3', strand: 'Numbers and Operations', description: 'compare numbers using more than, less than, and equal to' },
  { notation: 'IN.ICSE.C1.MA.NUM.4', strand: 'Numbers and Operations', description: 'arrange numbers in ascending and descending order up to 100' },
  { notation: 'IN.ICSE.C1.MA.NUM.5', strand: 'Numbers and Operations', description: 'skip count forward in 2s, 5s, and 10s up to 100' },
  { notation: 'IN.ICSE.C1.MA.NUM.6', strand: 'Numbers and Operations', description: 'identify the place value of digits in two-digit numbers (tens and ones)' },
  { notation: 'IN.ICSE.C1.MA.NUM.7', strand: 'Numbers and Operations', description: 'add two single-digit numbers with sums up to 20' },
  { notation: 'IN.ICSE.C1.MA.NUM.8', strand: 'Numbers and Operations', description: 'subtract single-digit numbers from numbers up to 20' },
  { notation: 'IN.ICSE.C1.MA.NUM.9', strand: 'Numbers and Operations', description: 'solve simple one-step word problems using addition and subtraction' },
  { notation: 'IN.ICSE.C1.MA.NUM.10', strand: 'Numbers and Operations', description: 'identify ordinal numbers from first to tenth' },
  { notation: 'IN.ICSE.C1.MA.NUM.11', strand: 'Numbers and Operations', description: 'recognize odd and even numbers up to 20' },
  { notation: 'IN.ICSE.C1.MA.NUM.12', strand: 'Numbers and Operations', description: 'identify zero as a number representing "nothing"' },

  // GEOMETRY
  { notation: 'IN.ICSE.C1.MA.GEO.1', strand: 'Geometry', description: 'identify and name basic 2D shapes: circle, square, triangle, rectangle' },
  { notation: 'IN.ICSE.C1.MA.GEO.2', strand: 'Geometry', description: 'recognize basic 3D shapes: ball (sphere), box (cube), cone, cylinder' },
  { notation: 'IN.ICSE.C1.MA.GEO.3', strand: 'Geometry', description: 'identify shapes in everyday objects around them' },
  { notation: 'IN.ICSE.C1.MA.GEO.4', strand: 'Geometry', description: 'understand positional concepts: inside, outside, above, below, near, far, front, behind' },

  // MEASUREMENT
  { notation: 'IN.ICSE.C1.MA.MEA.1', strand: 'Measurement', description: 'compare lengths using terms long, longer, longest and short, shorter, shortest' },
  { notation: 'IN.ICSE.C1.MA.MEA.2', strand: 'Measurement', description: 'compare weights using terms heavy, heavier, light, lighter' },
  { notation: 'IN.ICSE.C1.MA.MEA.3', strand: 'Measurement', description: 'compare capacity using terms full, empty, more, less' },
  { notation: 'IN.ICSE.C1.MA.MEA.4', strand: 'Measurement', description: 'measure length using non-standard units like handspan or pencil' },

  // TIME
  { notation: 'IN.ICSE.C1.MA.TIM.1', strand: 'Time', description: 'identify parts of the day: morning, afternoon, evening, night' },
  { notation: 'IN.ICSE.C1.MA.TIM.2', strand: 'Time', description: 'name the days of the week in sequence' },
  { notation: 'IN.ICSE.C1.MA.TIM.3', strand: 'Time', description: 'read time to the hour on an analog clock' },

  // MONEY
  { notation: 'IN.ICSE.C1.MA.MON.1', strand: 'Money', description: 'identify Indian currency notes and coins of common denominations' },
  { notation: 'IN.ICSE.C1.MA.MON.2', strand: 'Money', description: 'count money up to ten rupees using coins' },

  // PATTERNS
  { notation: 'IN.ICSE.C1.MA.PAT.1', strand: 'Patterns', description: 'recognize and describe simple repeating patterns with shapes, colours, and numbers' },
  { notation: 'IN.ICSE.C1.MA.PAT.2', strand: 'Patterns', description: 'extend and create simple repeating patterns' },

  // DATA HANDLING
  { notation: 'IN.ICSE.C1.MA.DAT.1', strand: 'Data Handling', description: 'sort and classify objects by a single attribute such as colour, size, or shape' },
  { notation: 'IN.ICSE.C1.MA.DAT.2', strand: 'Data Handling', description: 'interpret simple picture graphs' }
];

// =============================================================================
// CLASS 2 (Ages 7-8)
// =============================================================================

const class2Standards: ICSEMathStandard[] = [
  // NUMBERS AND OPERATIONS
  { notation: 'IN.ICSE.C2.MA.NUM.1', strand: 'Numbers and Operations', description: 'read, write and count numbers up to 999' },
  { notation: 'IN.ICSE.C2.MA.NUM.2', strand: 'Numbers and Operations', description: 'identify the place value of digits in three-digit numbers (hundreds, tens, ones)' },
  { notation: 'IN.ICSE.C2.MA.NUM.3', strand: 'Numbers and Operations', description: 'compare and order three-digit numbers using place value' },
  { notation: 'IN.ICSE.C2.MA.NUM.4', strand: 'Numbers and Operations', description: 'skip count forward and backward in 2s, 3s, 5s, and 10s' },
  { notation: 'IN.ICSE.C2.MA.NUM.5', strand: 'Numbers and Operations', description: 'add two-digit numbers with and without regrouping' },
  { notation: 'IN.ICSE.C2.MA.NUM.6', strand: 'Numbers and Operations', description: 'subtract two-digit numbers with and without regrouping' },
  { notation: 'IN.ICSE.C2.MA.NUM.7', strand: 'Numbers and Operations', description: 'understand multiplication as repeated addition' },
  { notation: 'IN.ICSE.C2.MA.NUM.8', strand: 'Numbers and Operations', description: 'construct and recall multiplication tables of 2, 3, 4, 5, and 10' },
  { notation: 'IN.ICSE.C2.MA.NUM.9', strand: 'Numbers and Operations', description: 'understand division as equal sharing and repeated subtraction' },
  { notation: 'IN.ICSE.C2.MA.NUM.10', strand: 'Numbers and Operations', description: 'solve one-step word problems involving addition, subtraction, and simple multiplication' },
  { notation: 'IN.ICSE.C2.MA.NUM.11', strand: 'Numbers and Operations', description: 'identify odd and even numbers up to 100' },
  { notation: 'IN.ICSE.C2.MA.NUM.12', strand: 'Numbers and Operations', description: 'use ordinal numbers up to twentieth' },

  // GEOMETRY
  { notation: 'IN.ICSE.C2.MA.GEO.1', strand: 'Geometry', description: 'identify and draw straight, curved, and slanting lines' },
  { notation: 'IN.ICSE.C2.MA.GEO.2', strand: 'Geometry', description: 'identify properties of basic 2D shapes: sides and corners' },
  { notation: 'IN.ICSE.C2.MA.GEO.3', strand: 'Geometry', description: 'distinguish between 2D and 3D shapes' },
  { notation: 'IN.ICSE.C2.MA.GEO.4', strand: 'Geometry', description: 'identify faces, edges, and corners of cubes, cuboids, spheres, cylinders, and cones' },

  // FRACTIONS
  { notation: 'IN.ICSE.C2.MA.FRA.1', strand: 'Fractions and Decimals', description: 'identify halves and quarters of an object, shape, or collection' },
  { notation: 'IN.ICSE.C2.MA.FRA.2', strand: 'Fractions and Decimals', description: 'understand half and quarter as equal parts of a whole' },

  // MEASUREMENT
  { notation: 'IN.ICSE.C2.MA.MEA.1', strand: 'Measurement', description: 'measure length in centimetres and metres using a ruler' },
  { notation: 'IN.ICSE.C2.MA.MEA.2', strand: 'Measurement', description: 'measure weight in grams and kilograms using a balance' },
  { notation: 'IN.ICSE.C2.MA.MEA.3', strand: 'Measurement', description: 'measure capacity in millilitres and litres' },

  // TIME
  { notation: 'IN.ICSE.C2.MA.TIM.1', strand: 'Time', description: 'read time to the hour and half-hour on an analog clock' },
  { notation: 'IN.ICSE.C2.MA.TIM.2', strand: 'Time', description: 'name the months of the year in sequence' },
  { notation: 'IN.ICSE.C2.MA.TIM.3', strand: 'Time', description: 'identify yesterday, today, and tomorrow on a calendar' },

  // MONEY
  { notation: 'IN.ICSE.C2.MA.MON.1', strand: 'Money', description: 'count and add amounts of Indian money up to one hundred rupees' },
  { notation: 'IN.ICSE.C2.MA.MON.2', strand: 'Money', description: 'make change for small transactions' },

  // PATTERNS
  { notation: 'IN.ICSE.C2.MA.PAT.1', strand: 'Patterns', description: 'recognize and extend growing number patterns' },

  // DATA HANDLING
  { notation: 'IN.ICSE.C2.MA.DAT.1', strand: 'Data Handling', description: 'collect, record, and organize data using tally marks' },
  { notation: 'IN.ICSE.C2.MA.DAT.2', strand: 'Data Handling', description: 'read and interpret simple pictographs and block graphs' }
];

// =============================================================================
// CLASS 3 (Ages 8-9)
// =============================================================================

const class3Standards: ICSEMathStandard[] = [
  // NUMBERS AND OPERATIONS
  { notation: 'IN.ICSE.C3.MA.NUM.1', strand: 'Numbers and Operations', description: 'read, write and order numbers up to 9999' },
  { notation: 'IN.ICSE.C3.MA.NUM.2', strand: 'Numbers and Operations', description: 'identify place value of digits in four-digit numbers (thousands, hundreds, tens, ones)' },
  { notation: 'IN.ICSE.C3.MA.NUM.3', strand: 'Numbers and Operations', description: 'round numbers to the nearest ten and hundred' },
  { notation: 'IN.ICSE.C3.MA.NUM.4', strand: 'Numbers and Operations', description: 'add and subtract three- and four-digit numbers with regrouping' },
  { notation: 'IN.ICSE.C3.MA.NUM.5', strand: 'Numbers and Operations', description: 'construct and recall multiplication tables up to 10' },
  { notation: 'IN.ICSE.C3.MA.NUM.6', strand: 'Numbers and Operations', description: 'multiply a two-digit number by a one-digit number' },
  { notation: 'IN.ICSE.C3.MA.NUM.7', strand: 'Numbers and Operations', description: 'divide two-digit numbers by a one-digit number with and without remainder' },
  { notation: 'IN.ICSE.C3.MA.NUM.8', strand: 'Numbers and Operations', description: 'use Roman numerals I to XX' },
  { notation: 'IN.ICSE.C3.MA.NUM.9', strand: 'Numbers and Operations', description: 'solve two-step word problems involving the four operations' },

  // FRACTIONS
  { notation: 'IN.ICSE.C3.MA.FRA.1', strand: 'Fractions and Decimals', description: 'identify and represent fractions using halves, thirds, quarters, and fifths' },
  { notation: 'IN.ICSE.C3.MA.FRA.2', strand: 'Fractions and Decimals', description: 'distinguish between numerator and denominator of a fraction' },
  { notation: 'IN.ICSE.C3.MA.FRA.3', strand: 'Fractions and Decimals', description: 'compare fractions with the same denominator' },
  { notation: 'IN.ICSE.C3.MA.FRA.4', strand: 'Fractions and Decimals', description: 'identify equivalent fractions using diagrams' },

  // GEOMETRY
  { notation: 'IN.ICSE.C3.MA.GEO.1', strand: 'Geometry', description: 'identify different types of lines: horizontal, vertical, slanting, parallel, intersecting' },
  { notation: 'IN.ICSE.C3.MA.GEO.2', strand: 'Geometry', description: 'draw and classify basic 2D shapes by number of sides' },
  { notation: 'IN.ICSE.C3.MA.GEO.3', strand: 'Geometry', description: 'identify right angles in shapes and the environment' },
  { notation: 'IN.ICSE.C3.MA.GEO.4', strand: 'Geometry', description: 'identify symmetry in shapes and letters using a line of symmetry' },

  // MEASUREMENT
  { notation: 'IN.ICSE.C3.MA.MEA.1', strand: 'Measurement', description: 'convert between centimetres and metres' },
  { notation: 'IN.ICSE.C3.MA.MEA.2', strand: 'Measurement', description: 'convert between grams and kilograms' },
  { notation: 'IN.ICSE.C3.MA.MEA.3', strand: 'Measurement', description: 'convert between millilitres and litres' },
  { notation: 'IN.ICSE.C3.MA.MEA.4', strand: 'Measurement', description: 'find the perimeter of simple rectilinear shapes' },

  // TIME
  { notation: 'IN.ICSE.C3.MA.TIM.1', strand: 'Time', description: 'read time to the quarter hour and five minutes on an analog clock' },
  { notation: 'IN.ICSE.C3.MA.TIM.2', strand: 'Time', description: 'calculate duration of events in hours and half-hours' },
  { notation: 'IN.ICSE.C3.MA.TIM.3', strand: 'Time', description: 'read dates from a calendar and find days between events' },

  // MONEY
  { notation: 'IN.ICSE.C3.MA.MON.1', strand: 'Money', description: 'add and subtract amounts of money involving rupees and paise' },
  { notation: 'IN.ICSE.C3.MA.MON.2', strand: 'Money', description: 'solve simple word problems involving money' },

  // DATA HANDLING
  { notation: 'IN.ICSE.C3.MA.DAT.1', strand: 'Data Handling', description: 'read and construct pictographs with a symbol representing multiple items' },
  { notation: 'IN.ICSE.C3.MA.DAT.2', strand: 'Data Handling', description: 'read and construct simple bar graphs' },

  // PATTERNS
  { notation: 'IN.ICSE.C3.MA.PAT.1', strand: 'Patterns', description: 'identify and extend patterns in numbers and shapes' }
];

// =============================================================================
// CLASS 4 (Ages 9-10)
// =============================================================================

const class4Standards: ICSEMathStandard[] = [
  // NUMBERS AND OPERATIONS
  { notation: 'IN.ICSE.C4.MA.NUM.1', strand: 'Numbers and Operations', description: 'read, write and order numbers up to 99999 using the Indian place value system' },
  { notation: 'IN.ICSE.C4.MA.NUM.2', strand: 'Numbers and Operations', description: 'identify place value up to ten thousands' },
  { notation: 'IN.ICSE.C4.MA.NUM.3', strand: 'Numbers and Operations', description: 'round numbers to the nearest ten, hundred, and thousand' },
  { notation: 'IN.ICSE.C4.MA.NUM.4', strand: 'Numbers and Operations', description: 'add and subtract large numbers with regrouping' },
  { notation: 'IN.ICSE.C4.MA.NUM.5', strand: 'Numbers and Operations', description: 'multiply three-digit numbers by two-digit numbers' },
  { notation: 'IN.ICSE.C4.MA.NUM.6', strand: 'Numbers and Operations', description: 'divide three-digit numbers by one- and two-digit divisors' },
  { notation: 'IN.ICSE.C4.MA.NUM.7', strand: 'Numbers and Operations', description: 'apply order of operations in expressions involving the four operations' },
  { notation: 'IN.ICSE.C4.MA.NUM.8', strand: 'Numbers and Operations', description: 'identify factors and multiples of whole numbers' },
  { notation: 'IN.ICSE.C4.MA.NUM.9', strand: 'Numbers and Operations', description: 'identify prime and composite numbers up to 50' },
  { notation: 'IN.ICSE.C4.MA.NUM.10', strand: 'Numbers and Operations', description: 'find HCF and LCM of two small numbers by listing' },
  { notation: 'IN.ICSE.C4.MA.NUM.11', strand: 'Numbers and Operations', description: 'read and write Roman numerals up to C (100)' },
  { notation: 'IN.ICSE.C4.MA.NUM.12', strand: 'Numbers and Operations', description: 'solve multi-step word problems involving the four operations' },

  // FRACTIONS AND DECIMALS
  { notation: 'IN.ICSE.C4.MA.FRA.1', strand: 'Fractions and Decimals', description: 'identify like and unlike fractions' },
  { notation: 'IN.ICSE.C4.MA.FRA.2', strand: 'Fractions and Decimals', description: 'convert between proper, improper, and mixed fractions' },
  { notation: 'IN.ICSE.C4.MA.FRA.3', strand: 'Fractions and Decimals', description: 'add and subtract fractions with the same denominator' },
  { notation: 'IN.ICSE.C4.MA.FRA.4', strand: 'Fractions and Decimals', description: 'reduce fractions to lowest terms' },
  { notation: 'IN.ICSE.C4.MA.FRA.5', strand: 'Fractions and Decimals', description: 'write fractions with denominators 10 and 100 as decimals' },
  { notation: 'IN.ICSE.C4.MA.FRA.6', strand: 'Fractions and Decimals', description: 'read and write decimals up to two decimal places' },

  // GEOMETRY
  { notation: 'IN.ICSE.C4.MA.GEO.1', strand: 'Geometry', description: 'classify angles as acute, right, obtuse, and straight' },
  { notation: 'IN.ICSE.C4.MA.GEO.2', strand: 'Geometry', description: 'identify and name types of triangles by sides and by angles' },
  { notation: 'IN.ICSE.C4.MA.GEO.3', strand: 'Geometry', description: 'identify parts of a circle: centre, radius, diameter, circumference' },
  { notation: 'IN.ICSE.C4.MA.GEO.4', strand: 'Geometry', description: 'identify lines of symmetry in 2D shapes' },

  // MEASUREMENT
  { notation: 'IN.ICSE.C4.MA.MEA.1', strand: 'Measurement', description: 'convert between units of length, mass, and capacity using metric prefixes' },
  { notation: 'IN.ICSE.C4.MA.MEA.2', strand: 'Measurement', description: 'calculate perimeter of rectangles and squares' },
  { notation: 'IN.ICSE.C4.MA.MEA.3', strand: 'Measurement', description: 'find the area of rectangles and squares by counting unit squares' },
  { notation: 'IN.ICSE.C4.MA.MEA.4', strand: 'Measurement', description: 'solve word problems involving units of measurement' },

  // TIME
  { notation: 'IN.ICSE.C4.MA.TIM.1', strand: 'Time', description: 'read time to the minute on analog and digital clocks' },
  { notation: 'IN.ICSE.C4.MA.TIM.2', strand: 'Time', description: 'convert between hours, minutes, and seconds' },
  { notation: 'IN.ICSE.C4.MA.TIM.3', strand: 'Time', description: 'compute elapsed time between two events' },

  // MONEY
  { notation: 'IN.ICSE.C4.MA.MON.1', strand: 'Money', description: 'solve word problems involving profit and loss without percentage' },
  { notation: 'IN.ICSE.C4.MA.MON.2', strand: 'Money', description: 'prepare simple bills with multiple items' },

  // DATA HANDLING
  { notation: 'IN.ICSE.C4.MA.DAT.1', strand: 'Data Handling', description: 'read and interpret bar graphs with scales' },
  { notation: 'IN.ICSE.C4.MA.DAT.2', strand: 'Data Handling', description: 'find mode of a small data set' }
];

// =============================================================================
// CLASS 5 (Ages 10-11)
// =============================================================================

const class5Standards: ICSEMathStandard[] = [
  // NUMBERS AND OPERATIONS
  { notation: 'IN.ICSE.C5.MA.NUM.1', strand: 'Numbers and Operations', description: 'read, write, and compare numbers up to one crore using Indian place value system' },
  { notation: 'IN.ICSE.C5.MA.NUM.2', strand: 'Numbers and Operations', description: 'compare Indian and international place value systems' },
  { notation: 'IN.ICSE.C5.MA.NUM.3', strand: 'Numbers and Operations', description: 'perform all four operations on whole numbers with word problems' },
  { notation: 'IN.ICSE.C5.MA.NUM.4', strand: 'Numbers and Operations', description: 'find HCF of two or more numbers using prime factorisation' },
  { notation: 'IN.ICSE.C5.MA.NUM.5', strand: 'Numbers and Operations', description: 'find LCM of two or more numbers using prime factorisation' },
  { notation: 'IN.ICSE.C5.MA.NUM.6', strand: 'Numbers and Operations', description: 'apply divisibility rules for 2, 3, 4, 5, 6, 9, and 10' },
  { notation: 'IN.ICSE.C5.MA.NUM.7', strand: 'Numbers and Operations', description: 'write and interpret Roman numerals up to CCC (300)' },

  // FRACTIONS AND DECIMALS
  { notation: 'IN.ICSE.C5.MA.FRA.1', strand: 'Fractions and Decimals', description: 'add and subtract unlike fractions using LCM' },
  { notation: 'IN.ICSE.C5.MA.FRA.2', strand: 'Fractions and Decimals', description: 'multiply fractions by whole numbers and by other fractions' },
  { notation: 'IN.ICSE.C5.MA.FRA.3', strand: 'Fractions and Decimals', description: 'divide fractions by whole numbers and by other fractions' },
  { notation: 'IN.ICSE.C5.MA.FRA.4', strand: 'Fractions and Decimals', description: 'read and write decimals up to three decimal places' },
  { notation: 'IN.ICSE.C5.MA.FRA.5', strand: 'Fractions and Decimals', description: 'add and subtract decimal numbers' },
  { notation: 'IN.ICSE.C5.MA.FRA.6', strand: 'Fractions and Decimals', description: 'multiply and divide decimals by whole numbers' },
  { notation: 'IN.ICSE.C5.MA.FRA.7', strand: 'Fractions and Decimals', description: 'convert between fractions and decimals' },

  // RATIO AND PERCENTAGE
  { notation: 'IN.ICSE.C5.MA.RAT.1', strand: 'Ratio and Percentage', description: 'understand ratio as a comparison between two quantities' },
  { notation: 'IN.ICSE.C5.MA.RAT.2', strand: 'Ratio and Percentage', description: 'express a ratio in simplest form' },
  { notation: 'IN.ICSE.C5.MA.RAT.3', strand: 'Ratio and Percentage', description: 'interpret percentage as a fraction with denominator 100' },
  { notation: 'IN.ICSE.C5.MA.RAT.4', strand: 'Ratio and Percentage', description: 'convert between fractions, decimals, and percentages' },

  // GEOMETRY
  { notation: 'IN.ICSE.C5.MA.GEO.1', strand: 'Geometry', description: 'measure angles in degrees using a protractor' },
  { notation: 'IN.ICSE.C5.MA.GEO.2', strand: 'Geometry', description: 'construct angles of given measure using a protractor' },
  { notation: 'IN.ICSE.C5.MA.GEO.3', strand: 'Geometry', description: 'classify triangles and quadrilaterals by properties' },
  { notation: 'IN.ICSE.C5.MA.GEO.4', strand: 'Geometry', description: 'identify congruent figures' },
  { notation: 'IN.ICSE.C5.MA.GEO.5', strand: 'Geometry', description: 'construct a circle of given radius using a compass' },
  { notation: 'IN.ICSE.C5.MA.GEO.6', strand: 'Geometry', description: 'identify faces, edges, and vertices of 3D solids' },

  // MEASUREMENT
  { notation: 'IN.ICSE.C5.MA.MEA.1', strand: 'Measurement', description: 'calculate area of rectangles and squares using formulae' },
  { notation: 'IN.ICSE.C5.MA.MEA.2', strand: 'Measurement', description: 'calculate perimeter of polygons' },
  { notation: 'IN.ICSE.C5.MA.MEA.3', strand: 'Measurement', description: 'find the volume of a cube and cuboid by counting unit cubes' },
  { notation: 'IN.ICSE.C5.MA.MEA.4', strand: 'Measurement', description: 'solve word problems involving area and perimeter' },

  // MONEY
  { notation: 'IN.ICSE.C5.MA.MON.1', strand: 'Money', description: 'compute simple interest for one year' },
  { notation: 'IN.ICSE.C5.MA.MON.2', strand: 'Money', description: 'solve problems on profit, loss, and discount' },

  // DATA HANDLING
  { notation: 'IN.ICSE.C5.MA.DAT.1', strand: 'Data Handling', description: 'compute the arithmetic mean of a data set' },
  { notation: 'IN.ICSE.C5.MA.DAT.2', strand: 'Data Handling', description: 'construct and interpret double bar graphs' }
];

// =============================================================================
// CLASS 6 (Ages 11-12)
// Middle School: Integers, algebra introduction, geometry
// =============================================================================

const class6Standards: ICSEMathStandard[] = [
  // INTEGERS AND NUMBER SYSTEM
  { notation: 'IN.ICSE.C6.MA.INT.1', strand: 'Integers', description: 'represent integers on the number line' },
  { notation: 'IN.ICSE.C6.MA.INT.2', strand: 'Integers', description: 'compare and order positive and negative integers' },
  { notation: 'IN.ICSE.C6.MA.INT.3', strand: 'Integers', description: 'add and subtract integers using the number line and rules of signs' },
  { notation: 'IN.ICSE.C6.MA.INT.4', strand: 'Integers', description: 'identify the absolute value of an integer' },
  { notation: 'IN.ICSE.C6.MA.INT.5', strand: 'Integers', description: 'solve word problems involving integers' },
  { notation: 'IN.ICSE.C6.MA.INT.6', strand: 'Numbers and Operations', description: 'apply HCF and LCM to solve real-life problems' },
  { notation: 'IN.ICSE.C6.MA.INT.7', strand: 'Numbers and Operations', description: 'identify prime and composite numbers using the sieve of Eratosthenes' },
  { notation: 'IN.ICSE.C6.MA.INT.8', strand: 'Numbers and Operations', description: 'find the square and square root of perfect squares up to 100' },

  // FRACTIONS AND DECIMALS
  { notation: 'IN.ICSE.C6.MA.FRA.1', strand: 'Fractions and Decimals', description: 'perform all four operations on fractions, including mixed numbers' },
  { notation: 'IN.ICSE.C6.MA.FRA.2', strand: 'Fractions and Decimals', description: 'perform all four operations on decimals' },
  { notation: 'IN.ICSE.C6.MA.FRA.3', strand: 'Fractions and Decimals', description: 'convert between fractions, decimals, and percentages' },
  { notation: 'IN.ICSE.C6.MA.FRA.4', strand: 'Fractions and Decimals', description: 'round decimals to a given number of decimal places' },

  // SETS
  { notation: 'IN.ICSE.C6.MA.SET.1', strand: 'Sets', description: 'understand the concept of a set and identify well-defined collections' },
  { notation: 'IN.ICSE.C6.MA.SET.2', strand: 'Sets', description: 'represent sets in roster and set-builder form' },
  { notation: 'IN.ICSE.C6.MA.SET.3', strand: 'Sets', description: 'identify empty, finite, and infinite sets' },
  { notation: 'IN.ICSE.C6.MA.SET.4', strand: 'Sets', description: 'identify equal and equivalent sets' },
  { notation: 'IN.ICSE.C6.MA.SET.5', strand: 'Sets', description: 'find the cardinality of a finite set' },

  // RATIO AND PROPORTION
  { notation: 'IN.ICSE.C6.MA.RAT.1', strand: 'Ratio and Proportion', description: 'express the ratio between two quantities in simplest form' },
  { notation: 'IN.ICSE.C6.MA.RAT.2', strand: 'Ratio and Proportion', description: 'test whether two ratios form a proportion' },
  { notation: 'IN.ICSE.C6.MA.RAT.3', strand: 'Ratio and Proportion', description: 'apply the unitary method to solve word problems' },
  { notation: 'IN.ICSE.C6.MA.RAT.4', strand: 'Ratio and Proportion', description: 'calculate percentage of a quantity in word problems' },

  // ALGEBRA
  { notation: 'IN.ICSE.C6.MA.ALG.1', strand: 'Algebra', description: 'use letters to represent unknown numbers and write algebraic expressions' },
  { notation: 'IN.ICSE.C6.MA.ALG.2', strand: 'Algebra', description: 'identify variables, constants, and coefficients in expressions' },
  { notation: 'IN.ICSE.C6.MA.ALG.3', strand: 'Algebra', description: 'evaluate algebraic expressions by substituting values' },
  { notation: 'IN.ICSE.C6.MA.ALG.4', strand: 'Algebra', description: 'add and subtract like algebraic terms' },
  { notation: 'IN.ICSE.C6.MA.ALG.5', strand: 'Algebra', description: 'solve simple linear equations in one variable by inspection and by systematic methods' },
  { notation: 'IN.ICSE.C6.MA.ALG.6', strand: 'Algebra', description: 'translate word statements into equations' },

  // GEOMETRY
  { notation: 'IN.ICSE.C6.MA.GEO.1', strand: 'Geometry', description: 'identify points, lines, line segments, and rays' },
  { notation: 'IN.ICSE.C6.MA.GEO.2', strand: 'Geometry', description: 'measure and draw angles using a protractor' },
  { notation: 'IN.ICSE.C6.MA.GEO.3', strand: 'Geometry', description: 'classify angles as acute, right, obtuse, straight, and reflex' },
  { notation: 'IN.ICSE.C6.MA.GEO.4', strand: 'Geometry', description: 'identify complementary and supplementary angles' },
  { notation: 'IN.ICSE.C6.MA.GEO.5', strand: 'Geometry', description: 'classify triangles by sides and by angles' },
  { notation: 'IN.ICSE.C6.MA.GEO.6', strand: 'Geometry', description: 'identify different types of quadrilaterals and their properties' },
  { notation: 'IN.ICSE.C6.MA.GEO.7', strand: 'Geometry', description: 'construct line segments and circles using ruler and compass' },
  { notation: 'IN.ICSE.C6.MA.GEO.8', strand: 'Geometry', description: 'identify 3D shapes and describe their faces, edges, and vertices' },

  // MENSURATION
  { notation: 'IN.ICSE.C6.MA.MEA.1', strand: 'Mensuration', description: 'calculate perimeter of regular and irregular polygons' },
  { notation: 'IN.ICSE.C6.MA.MEA.2', strand: 'Mensuration', description: 'calculate area of rectangles, squares, and triangles' },

  // DATA HANDLING
  { notation: 'IN.ICSE.C6.MA.DAT.1', strand: 'Data Handling', description: 'organize raw data into frequency tables' },
  { notation: 'IN.ICSE.C6.MA.DAT.2', strand: 'Data Handling', description: 'construct and interpret bar graphs using given scales' },
  { notation: 'IN.ICSE.C6.MA.DAT.3', strand: 'Data Handling', description: 'compute arithmetic mean, median, and mode of ungrouped data' }
];

// =============================================================================
// CLASS 7 (Ages 12-13)
// =============================================================================

const class7Standards: ICSEMathStandard[] = [
  // INTEGERS AND RATIONAL NUMBERS
  { notation: 'IN.ICSE.C7.MA.INT.1', strand: 'Integers', description: 'multiply and divide integers using rules of signs' },
  { notation: 'IN.ICSE.C7.MA.INT.2', strand: 'Integers', description: 'apply properties of integers: closure, commutative, associative, distributive' },
  { notation: 'IN.ICSE.C7.MA.INT.3', strand: 'Rational Numbers', description: 'understand rational numbers as ratios of integers' },
  { notation: 'IN.ICSE.C7.MA.INT.4', strand: 'Rational Numbers', description: 'represent rational numbers on the number line' },
  { notation: 'IN.ICSE.C7.MA.INT.5', strand: 'Rational Numbers', description: 'perform all four operations on rational numbers' },
  { notation: 'IN.ICSE.C7.MA.INT.6', strand: 'Rational Numbers', description: 'compare and order rational numbers' },
  { notation: 'IN.ICSE.C7.MA.INT.7', strand: 'Rational Numbers', description: 'find rational numbers between any two given rational numbers' },

  // FRACTIONS AND DECIMALS
  { notation: 'IN.ICSE.C7.MA.FRA.1', strand: 'Fractions and Decimals', description: 'multiply and divide fractions by fractions and whole numbers' },
  { notation: 'IN.ICSE.C7.MA.FRA.2', strand: 'Fractions and Decimals', description: 'multiply decimals by whole numbers and by decimals' },
  { notation: 'IN.ICSE.C7.MA.FRA.3', strand: 'Fractions and Decimals', description: 'divide decimals by whole numbers and by decimals' },

  // EXPONENTS AND POWERS
  { notation: 'IN.ICSE.C7.MA.EXP.1', strand: 'Exponents and Powers', description: 'understand the meaning of exponents and powers' },
  { notation: 'IN.ICSE.C7.MA.EXP.2', strand: 'Exponents and Powers', description: 'apply the laws of exponents for multiplication and division' },
  { notation: 'IN.ICSE.C7.MA.EXP.3', strand: 'Exponents and Powers', description: 'express large numbers in standard form using powers of 10' },

  // SETS
  { notation: 'IN.ICSE.C7.MA.SET.1', strand: 'Sets', description: 'identify subsets, proper subsets, and supersets' },
  { notation: 'IN.ICSE.C7.MA.SET.2', strand: 'Sets', description: 'find the union and intersection of sets' },
  { notation: 'IN.ICSE.C7.MA.SET.3', strand: 'Sets', description: 'find the difference and complement of sets' },
  { notation: 'IN.ICSE.C7.MA.SET.4', strand: 'Sets', description: 'represent set operations using Venn diagrams' },

  // PERCENTAGE AND PROFIT/LOSS
  { notation: 'IN.ICSE.C7.MA.RAT.1', strand: 'Ratio and Proportion', description: 'apply direct and inverse proportion in word problems' },
  { notation: 'IN.ICSE.C7.MA.RAT.2', strand: 'Percentage', description: 'convert between fractions, decimals, percentages, and ratios' },
  { notation: 'IN.ICSE.C7.MA.RAT.3', strand: 'Percentage', description: 'solve percentage word problems including increase and decrease' },
  { notation: 'IN.ICSE.C7.MA.RAT.4', strand: 'Profit and Loss', description: 'compute profit, loss, and percentage profit or loss' },
  { notation: 'IN.ICSE.C7.MA.RAT.5', strand: 'Simple Interest', description: 'compute simple interest using I = PRT/100' },
  { notation: 'IN.ICSE.C7.MA.RAT.6', strand: 'Simple Interest', description: 'solve word problems on simple interest' },

  // ALGEBRA
  { notation: 'IN.ICSE.C7.MA.ALG.1', strand: 'Algebra', description: 'identify polynomial expressions: monomials, binomials, and trinomials' },
  { notation: 'IN.ICSE.C7.MA.ALG.2', strand: 'Algebra', description: 'add and subtract algebraic expressions' },
  { notation: 'IN.ICSE.C7.MA.ALG.3', strand: 'Algebra', description: 'multiply algebraic expressions by monomials' },
  { notation: 'IN.ICSE.C7.MA.ALG.4', strand: 'Algebra', description: 'use algebraic identities (a+b)^2, (a-b)^2, (a+b)(a-b)' },
  { notation: 'IN.ICSE.C7.MA.ALG.5', strand: 'Algebra', description: 'solve linear equations in one variable with integer coefficients' },
  { notation: 'IN.ICSE.C7.MA.ALG.6', strand: 'Algebra', description: 'solve linear inequalities in one variable' },

  // GEOMETRY
  { notation: 'IN.ICSE.C7.MA.GEO.1', strand: 'Geometry', description: 'identify pairs of angles formed by parallel lines and a transversal' },
  { notation: 'IN.ICSE.C7.MA.GEO.2', strand: 'Geometry', description: 'apply the angle sum property of a triangle' },
  { notation: 'IN.ICSE.C7.MA.GEO.3', strand: 'Geometry', description: 'apply the exterior angle property of a triangle' },
  { notation: 'IN.ICSE.C7.MA.GEO.4', strand: 'Geometry', description: 'identify congruent triangles using SSS, SAS, ASA, and RHS criteria' },
  { notation: 'IN.ICSE.C7.MA.GEO.5', strand: 'Geometry', description: 'construct triangles given sides and angles using ruler, compass, and protractor' },
  { notation: 'IN.ICSE.C7.MA.GEO.6', strand: 'Geometry', description: 'identify line and rotational symmetry in figures' },

  // MENSURATION
  { notation: 'IN.ICSE.C7.MA.MEA.1', strand: 'Mensuration', description: 'calculate area of triangles and parallelograms' },
  { notation: 'IN.ICSE.C7.MA.MEA.2', strand: 'Mensuration', description: 'calculate circumference and area of a circle using formulae' },
  { notation: 'IN.ICSE.C7.MA.MEA.3', strand: 'Mensuration', description: 'calculate volume and surface area of cubes and cuboids' },

  // DATA HANDLING
  { notation: 'IN.ICSE.C7.MA.DAT.1', strand: 'Data Handling', description: 'compute arithmetic mean, median, and mode of ungrouped data' },
  { notation: 'IN.ICSE.C7.MA.DAT.2', strand: 'Data Handling', description: 'interpret double bar graphs' },
  { notation: 'IN.ICSE.C7.MA.DAT.3', strand: 'Data Handling', description: 'understand probability of simple events as a fraction' }
];

// =============================================================================
// CLASS 8 (Ages 13-14)
// =============================================================================

const class8Standards: ICSEMathStandard[] = [
  // NUMBER SYSTEM
  { notation: 'IN.ICSE.C8.MA.INT.1', strand: 'Rational Numbers', description: 'identify properties of rational numbers: closure, commutative, associative, distributive, identity, inverse' },
  { notation: 'IN.ICSE.C8.MA.INT.2', strand: 'Rational Numbers', description: 'represent rational numbers in standard form' },
  { notation: 'IN.ICSE.C8.MA.INT.3', strand: 'Rational Numbers', description: 'find the reciprocal and additive inverse of a rational number' },
  { notation: 'IN.ICSE.C8.MA.INT.4', strand: 'Squares and Square Roots', description: 'find squares of numbers using identities and column method' },
  { notation: 'IN.ICSE.C8.MA.INT.5', strand: 'Squares and Square Roots', description: 'find square roots by prime factorisation and long division method' },
  { notation: 'IN.ICSE.C8.MA.INT.6', strand: 'Cubes and Cube Roots', description: 'find cubes of numbers and recognize perfect cubes' },
  { notation: 'IN.ICSE.C8.MA.INT.7', strand: 'Cubes and Cube Roots', description: 'find cube roots of perfect cubes by prime factorisation' },

  // EXPONENTS AND POWERS
  { notation: 'IN.ICSE.C8.MA.EXP.1', strand: 'Exponents and Powers', description: 'apply laws of exponents with rational bases' },
  { notation: 'IN.ICSE.C8.MA.EXP.2', strand: 'Exponents and Powers', description: 'interpret zero, negative, and fractional exponents' },
  { notation: 'IN.ICSE.C8.MA.EXP.3', strand: 'Exponents and Powers', description: 'express numbers in standard form (scientific notation)' },

  // COMMERCIAL ARITHMETIC
  { notation: 'IN.ICSE.C8.MA.RAT.1', strand: 'Percentage and Profit Loss', description: 'solve percentage word problems including successive percentages' },
  { notation: 'IN.ICSE.C8.MA.RAT.2', strand: 'Percentage and Profit Loss', description: 'compute discount and marked price in sales problems' },
  { notation: 'IN.ICSE.C8.MA.RAT.3', strand: 'Percentage and Profit Loss', description: 'compute sales tax, VAT, and goods and services tax' },
  { notation: 'IN.ICSE.C8.MA.RAT.4', strand: 'Compound Interest', description: 'compute compound interest using the formula and tabular method' },
  { notation: 'IN.ICSE.C8.MA.RAT.5', strand: 'Compound Interest', description: 'compute compound interest when interest is compounded annually and half-yearly' },
  { notation: 'IN.ICSE.C8.MA.RAT.6', strand: 'Direct and Inverse Proportion', description: 'identify and solve problems in direct and inverse proportion' },
  { notation: 'IN.ICSE.C8.MA.RAT.7', strand: 'Time Work and Distance', description: 'solve problems on time and work' },
  { notation: 'IN.ICSE.C8.MA.RAT.8', strand: 'Time Work and Distance', description: 'solve problems on time, speed, and distance' },

  // ALGEBRA
  { notation: 'IN.ICSE.C8.MA.ALG.1', strand: 'Algebra', description: 'multiply algebraic expressions: binomial by binomial and binomial by trinomial' },
  { notation: 'IN.ICSE.C8.MA.ALG.2', strand: 'Algebra', description: 'expand squares and cubes of binomials using standard identities' },
  { notation: 'IN.ICSE.C8.MA.ALG.3', strand: 'Algebra', description: 'factorise algebraic expressions by taking out common factors' },
  { notation: 'IN.ICSE.C8.MA.ALG.4', strand: 'Algebra', description: 'factorise expressions of the form a^2 − b^2 using difference of squares identity' },
  { notation: 'IN.ICSE.C8.MA.ALG.5', strand: 'Algebra', description: 'factorise quadratic trinomials by splitting the middle term' },
  { notation: 'IN.ICSE.C8.MA.ALG.6', strand: 'Algebra', description: 'simplify algebraic fractions through factorisation and cancellation' },
  { notation: 'IN.ICSE.C8.MA.ALG.7', strand: 'Algebra', description: 'solve linear equations with variables on both sides' },
  { notation: 'IN.ICSE.C8.MA.ALG.8', strand: 'Algebra', description: 'solve linear equations with fractional coefficients and brackets' },
  { notation: 'IN.ICSE.C8.MA.ALG.9', strand: 'Algebra', description: 'apply linear equations to solve real-life word problems' },

  // SETS
  { notation: 'IN.ICSE.C8.MA.SET.1', strand: 'Sets', description: 'apply laws of set operations: commutative, associative, distributive, De Morgan' },
  { notation: 'IN.ICSE.C8.MA.SET.2', strand: 'Sets', description: 'solve problems involving Venn diagrams with two or three sets' },

  // GEOMETRY
  { notation: 'IN.ICSE.C8.MA.GEO.1', strand: 'Geometry', description: 'apply angle sum properties of polygons and regular polygons' },
  { notation: 'IN.ICSE.C8.MA.GEO.2', strand: 'Geometry', description: 'identify properties of parallelograms: opposite sides, angles, and diagonals' },
  { notation: 'IN.ICSE.C8.MA.GEO.3', strand: 'Geometry', description: 'identify properties of rhombus, rectangle, square, and trapezium' },
  { notation: 'IN.ICSE.C8.MA.GEO.4', strand: 'Geometry', description: 'construct quadrilaterals given sides, diagonals, or angles' },
  { notation: 'IN.ICSE.C8.MA.GEO.5', strand: 'Geometry', description: 'identify congruent triangles and apply congruency rules' },
  { notation: 'IN.ICSE.C8.MA.GEO.6', strand: 'Geometry', description: 'identify rotational symmetry and find order of symmetry' },

  // MENSURATION
  { notation: 'IN.ICSE.C8.MA.MEA.1', strand: 'Mensuration', description: 'calculate area of trapezium, rhombus, and general quadrilateral' },
  { notation: 'IN.ICSE.C8.MA.MEA.2', strand: 'Mensuration', description: 'calculate surface area and volume of cubes and cuboids' },
  { notation: 'IN.ICSE.C8.MA.MEA.3', strand: 'Mensuration', description: 'calculate surface area and volume of right circular cylinders' },

  // DATA HANDLING
  { notation: 'IN.ICSE.C8.MA.DAT.1', strand: 'Data Handling', description: 'organize data into frequency distribution tables with class intervals' },
  { notation: 'IN.ICSE.C8.MA.DAT.2', strand: 'Data Handling', description: 'construct and interpret histograms' },
  { notation: 'IN.ICSE.C8.MA.DAT.3', strand: 'Data Handling', description: 'construct and interpret pie charts' },
  { notation: 'IN.ICSE.C8.MA.DAT.4', strand: 'Probability', description: 'compute probability of simple events' },

  // COORDINATE GEOMETRY
  { notation: 'IN.ICSE.C8.MA.COG.1', strand: 'Coordinate Geometry', description: 'plot points on a Cartesian plane' },
  { notation: 'IN.ICSE.C8.MA.COG.2', strand: 'Coordinate Geometry', description: 'identify the quadrant of a point from its coordinates' }
];

// =============================================================================
// CLASS 9 (Ages 14-15)
// ICSE Secondary: Basis for Class 10 Board Examination
// Source: CISCE ICSE 2028 Mathematics syllabus + Shaalaa 2026-27 reference
// =============================================================================

const class9Standards: ICSEMathStandard[] = [
  // PURE ARITHMETIC
  { notation: 'IN.ICSE.C9.MA.PAR.1', strand: 'Rational and Irrational Numbers', description: 'distinguish between rational and irrational numbers' },
  { notation: 'IN.ICSE.C9.MA.PAR.2', strand: 'Rational and Irrational Numbers', description: 'prove the irrationality of square roots of non-perfect squares' },
  { notation: 'IN.ICSE.C9.MA.PAR.3', strand: 'Rational and Irrational Numbers', description: 'represent rational and irrational numbers on the number line' },
  { notation: 'IN.ICSE.C9.MA.PAR.4', strand: 'Rational and Irrational Numbers', description: 'identify terminating and non-terminating recurring decimals as rational numbers' },
  { notation: 'IN.ICSE.C9.MA.PAR.5', strand: 'Rational and Irrational Numbers', description: 'perform operations on surds and simplify surd expressions' },
  { notation: 'IN.ICSE.C9.MA.PAR.6', strand: 'Rational and Irrational Numbers', description: 'rationalise denominators of fractions containing surds' },

  // COMMERCIAL MATHEMATICS
  { notation: 'IN.ICSE.C9.MA.COM.1', strand: 'Commercial Mathematics', description: 'compute profit and loss percentage including overhead expenses' },
  { notation: 'IN.ICSE.C9.MA.COM.2', strand: 'Commercial Mathematics', description: 'compute discount and selling price given marked price and discount percentage' },
  { notation: 'IN.ICSE.C9.MA.COM.3', strand: 'Commercial Mathematics', description: 'compute compound interest without using formula for up to three years' },
  { notation: 'IN.ICSE.C9.MA.COM.4', strand: 'Commercial Mathematics', description: 'apply the compound interest formula A = P(1 + r/100)^n to find amount and interest' },
  { notation: 'IN.ICSE.C9.MA.COM.5', strand: 'Commercial Mathematics', description: 'compute compound interest when interest is compounded half-yearly' },
  { notation: 'IN.ICSE.C9.MA.COM.6', strand: 'Commercial Mathematics', description: 'apply compound interest to growth and depreciation problems' },

  // ALGEBRA
  { notation: 'IN.ICSE.C9.MA.ALG.1', strand: 'Algebra', description: 'expand binomials using the identity (a + b)(a − b) = a^2 − b^2' },
  { notation: 'IN.ICSE.C9.MA.ALG.2', strand: 'Algebra', description: 'expand (a + b)^2 and (a − b)^2 and apply in computations' },
  { notation: 'IN.ICSE.C9.MA.ALG.3', strand: 'Algebra', description: 'expand (a + b + c)^2 and apply in simplification' },
  { notation: 'IN.ICSE.C9.MA.ALG.4', strand: 'Algebra', description: 'expand (a + b)^3 and (a − b)^3 and related cubic identities' },
  { notation: 'IN.ICSE.C9.MA.ALG.5', strand: 'Algebra', description: 'factorise algebraic expressions by taking out common factors' },
  { notation: 'IN.ICSE.C9.MA.ALG.6', strand: 'Algebra', description: 'factorise expressions by grouping terms' },
  { notation: 'IN.ICSE.C9.MA.ALG.7', strand: 'Algebra', description: 'factorise quadratic trinomials by splitting the middle term' },
  { notation: 'IN.ICSE.C9.MA.ALG.8', strand: 'Algebra', description: 'factorise expressions using difference of two squares' },
  { notation: 'IN.ICSE.C9.MA.ALG.9', strand: 'Algebra', description: 'factorise the sum and difference of two cubes' },
  { notation: 'IN.ICSE.C9.MA.ALG.10', strand: 'Algebra', description: 'solve simultaneous linear equations in two variables by substitution method' },
  { notation: 'IN.ICSE.C9.MA.ALG.11', strand: 'Algebra', description: 'solve simultaneous linear equations in two variables by elimination method' },
  { notation: 'IN.ICSE.C9.MA.ALG.12', strand: 'Algebra', description: 'solve simultaneous linear equations by cross-multiplication method' },
  { notation: 'IN.ICSE.C9.MA.ALG.13', strand: 'Algebra', description: 'solve simultaneous linear equations graphically' },
  { notation: 'IN.ICSE.C9.MA.ALG.14', strand: 'Algebra', description: 'formulate and solve word problems using simultaneous equations' },
  { notation: 'IN.ICSE.C9.MA.ALG.15', strand: 'Algebra', description: 'apply laws of exponents for positive, negative, zero, and fractional indices' },
  { notation: 'IN.ICSE.C9.MA.ALG.16', strand: 'Algebra', description: 'simplify exponential expressions and solve simple exponential equations' },
  { notation: 'IN.ICSE.C9.MA.ALG.17', strand: 'Algebra', description: 'interconvert between exponential and logarithmic forms' },
  { notation: 'IN.ICSE.C9.MA.ALG.18', strand: 'Algebra', description: 'apply laws of logarithms: product, quotient, and power laws' },
  { notation: 'IN.ICSE.C9.MA.ALG.19', strand: 'Algebra', description: 'simplify logarithmic expressions using laws of logarithms' },
  { notation: 'IN.ICSE.C9.MA.ALG.20', strand: 'Algebra', description: 'change the subject of a given formula' },

  // GEOMETRY
  { notation: 'IN.ICSE.C9.MA.GEO.1', strand: 'Geometry - Triangles', description: 'identify congruent triangles using SSS, SAS, ASA, AAS, and RHS criteria' },
  { notation: 'IN.ICSE.C9.MA.GEO.2', strand: 'Geometry - Triangles', description: 'prove and apply the isosceles triangle theorem and its converse' },
  { notation: 'IN.ICSE.C9.MA.GEO.3', strand: 'Geometry - Triangles', description: 'apply triangle inequality theorem relating sides and angles' },
  { notation: 'IN.ICSE.C9.MA.GEO.4', strand: 'Geometry - Triangles', description: 'prove and apply the mid-point theorem in a triangle' },
  { notation: 'IN.ICSE.C9.MA.GEO.5', strand: 'Geometry - Triangles', description: 'apply the equal intercepts theorem on transversals' },
  { notation: 'IN.ICSE.C9.MA.GEO.6', strand: 'Geometry - Triangles', description: 'prove and apply the Pythagoras theorem and its converse' },
  { notation: 'IN.ICSE.C9.MA.GEO.7', strand: 'Geometry - Rectilinear Figures', description: 'classify polygons as regular, irregular, convex, and concave' },
  { notation: 'IN.ICSE.C9.MA.GEO.8', strand: 'Geometry - Rectilinear Figures', description: 'find sum of interior and exterior angles of polygons' },
  { notation: 'IN.ICSE.C9.MA.GEO.9', strand: 'Geometry - Rectilinear Figures', description: 'prove properties of parallelograms including opposite sides and diagonals' },
  { notation: 'IN.ICSE.C9.MA.GEO.10', strand: 'Geometry - Rectilinear Figures', description: 'identify and apply properties of rectangle, rhombus, square, and trapezium' },
  { notation: 'IN.ICSE.C9.MA.GEO.11', strand: 'Geometry - Rectilinear Figures', description: 'construct parallelograms and trapeziums using ruler and compass' },
  { notation: 'IN.ICSE.C9.MA.GEO.12', strand: 'Geometry - Rectilinear Figures', description: 'construct regular hexagons using ruler and compass' },
  { notation: 'IN.ICSE.C9.MA.GEO.13', strand: 'Geometry - Triangles', description: 'construct triangles given SSS, SAS, ASA, and RHS conditions' },
  { notation: 'IN.ICSE.C9.MA.GEO.14', strand: 'Geometry - Area Theorems', description: 'prove and apply theorems on parallelograms and triangles between same parallels' },
  { notation: 'IN.ICSE.C9.MA.GEO.15', strand: 'Geometry - Circle', description: 'identify parts of a circle: chord, arc, segment, and sector' },
  { notation: 'IN.ICSE.C9.MA.GEO.16', strand: 'Geometry - Circle', description: 'prove theorems on equal chords and their distance from the centre' },
  { notation: 'IN.ICSE.C9.MA.GEO.17', strand: 'Geometry - Circle', description: 'apply theorems on perpendicular from centre to a chord' },
  { notation: 'IN.ICSE.C9.MA.GEO.18', strand: 'Geometry - Similarity', description: 'identify similar triangles and apply similarity criteria' },

  // MENSURATION
  { notation: 'IN.ICSE.C9.MA.MEN.1', strand: 'Mensuration', description: 'calculate perimeter and area of plane figures including triangles and quadrilaterals' },
  { notation: 'IN.ICSE.C9.MA.MEN.2', strand: 'Mensuration', description: 'calculate circumference and area of circles and sectors' },
  { notation: 'IN.ICSE.C9.MA.MEN.3', strand: 'Mensuration', description: 'calculate surface area and volume of cuboids and cubes' },
  { notation: 'IN.ICSE.C9.MA.MEN.4', strand: 'Mensuration', description: 'calculate surface area and volume of right circular cylinders' },
  { notation: 'IN.ICSE.C9.MA.MEN.5', strand: 'Mensuration', description: 'solve problems involving cross sections and flow of liquids' },

  // TRIGONOMETRY
  { notation: 'IN.ICSE.C9.MA.TRG.1', strand: 'Trigonometry', description: 'define sine, cosine, and tangent ratios in a right-angled triangle' },
  { notation: 'IN.ICSE.C9.MA.TRG.2', strand: 'Trigonometry', description: 'compute reciprocal trigonometric ratios: cosec, sec, and cot' },
  { notation: 'IN.ICSE.C9.MA.TRG.3', strand: 'Trigonometry', description: 'find trigonometric ratios of 0°, 30°, 45°, 60°, and 90°' },
  { notation: 'IN.ICSE.C9.MA.TRG.4', strand: 'Trigonometry', description: 'evaluate trigonometric expressions involving standard angles' },
  { notation: 'IN.ICSE.C9.MA.TRG.5', strand: 'Trigonometry', description: 'solve right triangles using trigonometric ratios' },
  { notation: 'IN.ICSE.C9.MA.TRG.6', strand: 'Trigonometry', description: 'apply trigonometric ratios of complementary angles' },

  // STATISTICS
  { notation: 'IN.ICSE.C9.MA.STA.1', strand: 'Statistics', description: 'organize raw data into grouped frequency distribution tables' },
  { notation: 'IN.ICSE.C9.MA.STA.2', strand: 'Statistics', description: 'identify class intervals, class marks, class limits, and class boundaries' },
  { notation: 'IN.ICSE.C9.MA.STA.3', strand: 'Statistics', description: 'compute mean of ungrouped data' },
  { notation: 'IN.ICSE.C9.MA.STA.4', strand: 'Statistics', description: 'compute median of ungrouped data' },
  { notation: 'IN.ICSE.C9.MA.STA.5', strand: 'Statistics', description: 'construct histograms and frequency polygons' },

  // COORDINATE GEOMETRY
  { notation: 'IN.ICSE.C9.MA.COG.1', strand: 'Coordinate Geometry', description: 'plot points on the Cartesian plane and identify quadrants' },
  { notation: 'IN.ICSE.C9.MA.COG.2', strand: 'Coordinate Geometry', description: 'compute the distance between two points using the distance formula' },
  { notation: 'IN.ICSE.C9.MA.COG.3', strand: 'Coordinate Geometry', description: 'find the equation of a straight line in slope-intercept form y = mx + c' },
  { notation: 'IN.ICSE.C9.MA.COG.4', strand: 'Coordinate Geometry', description: 'identify slope of a line and use slopes of parallel and perpendicular lines' },
  { notation: 'IN.ICSE.C9.MA.COG.5', strand: 'Coordinate Geometry', description: 'draw graphs of linear equations in two variables' }
];

// =============================================================================
// CLASS 10 (Ages 15-16)
// ICSE Board Examination
// Source: CISCE ICSE 2028 Mathematics syllabus + Shaalaa 2026-27 reference
// =============================================================================

const class10Standards: ICSEMathStandard[] = [
  // COMMERCIAL MATHEMATICS
  { notation: 'IN.ICSE.C10.MA.COM.1', strand: 'Commercial Mathematics - GST', description: 'define goods and services tax and identify direct and indirect taxes' },
  { notation: 'IN.ICSE.C10.MA.COM.2', strand: 'Commercial Mathematics - GST', description: 'compute CGST, SGST, and IGST for intra-state and inter-state supply' },
  { notation: 'IN.ICSE.C10.MA.COM.3', strand: 'Commercial Mathematics - GST', description: 'compute GST at different rate slabs (5%, 12%, 18%, 28%)' },
  { notation: 'IN.ICSE.C10.MA.COM.4', strand: 'Commercial Mathematics - GST', description: 'compute input tax credit and net GST payable' },
  { notation: 'IN.ICSE.C10.MA.COM.5', strand: 'Commercial Mathematics - Banking', description: 'define recurring deposit and identify its maturity period' },
  { notation: 'IN.ICSE.C10.MA.COM.6', strand: 'Commercial Mathematics - Banking', description: 'compute interest earned on a recurring deposit using the formula' },
  { notation: 'IN.ICSE.C10.MA.COM.7', strand: 'Commercial Mathematics - Banking', description: 'compute maturity value of a recurring deposit account' },
  { notation: 'IN.ICSE.C10.MA.COM.8', strand: 'Commercial Mathematics - Shares and Dividends', description: 'identify face value, market value, and dividend rate of shares' },
  { notation: 'IN.ICSE.C10.MA.COM.9', strand: 'Commercial Mathematics - Shares and Dividends', description: 'compute investment, number of shares, and dividend income' },
  { notation: 'IN.ICSE.C10.MA.COM.10', strand: 'Commercial Mathematics - Shares and Dividends', description: 'compute rate of return on investment in shares' },
  { notation: 'IN.ICSE.C10.MA.COM.11', strand: 'Commercial Mathematics - Shares and Dividends', description: 'compare returns from two different share investments' },

  // ALGEBRA
  { notation: 'IN.ICSE.C10.MA.ALG.1', strand: 'Algebra - Linear Inequations', description: 'solve linear inequations in one variable over the set of real numbers' },
  { notation: 'IN.ICSE.C10.MA.ALG.2', strand: 'Algebra - Linear Inequations', description: 'represent solutions of linear inequations on the number line' },
  { notation: 'IN.ICSE.C10.MA.ALG.3', strand: 'Algebra - Linear Inequations', description: 'solve combined inequations and product of linear expressions' },
  { notation: 'IN.ICSE.C10.MA.ALG.4', strand: 'Algebra - Quadratic Equations', description: 'identify quadratic equations and their roots' },
  { notation: 'IN.ICSE.C10.MA.ALG.5', strand: 'Algebra - Quadratic Equations', description: 'solve quadratic equations by factorisation' },
  { notation: 'IN.ICSE.C10.MA.ALG.6', strand: 'Algebra - Quadratic Equations', description: 'solve quadratic equations using the quadratic formula' },
  { notation: 'IN.ICSE.C10.MA.ALG.7', strand: 'Algebra - Quadratic Equations', description: 'determine the nature of roots using the discriminant' },
  { notation: 'IN.ICSE.C10.MA.ALG.8', strand: 'Algebra - Quadratic Equations', description: 'formulate and solve quadratic word problems on numbers, ages, time, and work' },
  { notation: 'IN.ICSE.C10.MA.ALG.9', strand: 'Algebra - Quadratic Equations', description: 'formulate and solve quadratic problems on geometry, mensuration, and commerce' },
  { notation: 'IN.ICSE.C10.MA.ALG.10', strand: 'Algebra - Ratio and Proportion', description: 'apply properties of proportion: invertendo, alternendo, componendo, dividendo' },
  { notation: 'IN.ICSE.C10.MA.ALG.11', strand: 'Algebra - Ratio and Proportion', description: 'apply the concept of continued proportion to solve problems' },
  { notation: 'IN.ICSE.C10.MA.ALG.12', strand: 'Algebra - Remainder and Factor Theorem', description: 'apply the remainder theorem to find remainder when a polynomial is divided by a linear polynomial' },
  { notation: 'IN.ICSE.C10.MA.ALG.13', strand: 'Algebra - Remainder and Factor Theorem', description: 'apply the factor theorem to check and find factors of polynomials' },
  { notation: 'IN.ICSE.C10.MA.ALG.14', strand: 'Algebra - Remainder and Factor Theorem', description: 'factorise cubic polynomials using the factor theorem' },
  { notation: 'IN.ICSE.C10.MA.ALG.15', strand: 'Algebra - Matrices', description: 'identify types of matrices: row, column, square, diagonal, identity, zero' },
  { notation: 'IN.ICSE.C10.MA.ALG.16', strand: 'Algebra - Matrices', description: 'determine equality of matrices and find unknown entries' },
  { notation: 'IN.ICSE.C10.MA.ALG.17', strand: 'Algebra - Matrices', description: 'perform addition, subtraction, and scalar multiplication of matrices' },
  { notation: 'IN.ICSE.C10.MA.ALG.18', strand: 'Algebra - Matrices', description: 'multiply matrices of compatible orders' },
  { notation: 'IN.ICSE.C10.MA.ALG.19', strand: 'Algebra - Arithmetic Progression', description: 'identify arithmetic progressions and find the common difference' },
  { notation: 'IN.ICSE.C10.MA.ALG.20', strand: 'Algebra - Arithmetic Progression', description: 'find the nth term of an arithmetic progression using the formula' },
  { notation: 'IN.ICSE.C10.MA.ALG.21', strand: 'Algebra - Arithmetic Progression', description: 'find the sum of first n terms of an arithmetic progression' },
  { notation: 'IN.ICSE.C10.MA.ALG.22', strand: 'Algebra - Geometric Progression', description: 'identify geometric progressions and find the common ratio' },
  { notation: 'IN.ICSE.C10.MA.ALG.23', strand: 'Algebra - Geometric Progression', description: 'find the nth term and sum of n terms of a geometric progression' },
  { notation: 'IN.ICSE.C10.MA.ALG.24', strand: 'Algebra - Reflection', description: 'find the reflection of a point in the x-axis, y-axis, and origin' },
  { notation: 'IN.ICSE.C10.MA.ALG.25', strand: 'Algebra - Reflection', description: 'find reflections in lines parallel to the axes and identify invariant points' },

  // COORDINATE GEOMETRY
  { notation: 'IN.ICSE.C10.MA.COG.1', strand: 'Coordinate Geometry - Section Formula', description: 'apply the section formula to find point dividing a line segment in a given ratio' },
  { notation: 'IN.ICSE.C10.MA.COG.2', strand: 'Coordinate Geometry - Section Formula', description: 'apply the midpoint formula to find midpoint of a line segment' },
  { notation: 'IN.ICSE.C10.MA.COG.3', strand: 'Coordinate Geometry - Section Formula', description: 'find the centroid of a triangle using coordinates of its vertices' },
  { notation: 'IN.ICSE.C10.MA.COG.4', strand: 'Coordinate Geometry - Equation of a Line', description: 'find the slope of a line passing through two points' },
  { notation: 'IN.ICSE.C10.MA.COG.5', strand: 'Coordinate Geometry - Equation of a Line', description: 'find the equation of a line in slope-intercept form and point-slope form' },
  { notation: 'IN.ICSE.C10.MA.COG.6', strand: 'Coordinate Geometry - Equation of a Line', description: 'apply conditions for parallel and perpendicular lines in terms of slopes' },
  { notation: 'IN.ICSE.C10.MA.COG.7', strand: 'Coordinate Geometry - Equation of a Line', description: 'find the equation of a line parallel or perpendicular to a given line' },
  { notation: 'IN.ICSE.C10.MA.COG.8', strand: 'Coordinate Geometry - Equation of a Line', description: 'test collinearity of three points using slopes' },

  // GEOMETRY
  { notation: 'IN.ICSE.C10.MA.GEO.1', strand: 'Geometry - Similarity', description: 'apply criteria for similarity of triangles: AA, SSS, and SAS' },
  { notation: 'IN.ICSE.C10.MA.GEO.2', strand: 'Geometry - Similarity', description: 'apply the basic proportionality theorem and its converse' },
  { notation: 'IN.ICSE.C10.MA.GEO.3', strand: 'Geometry - Similarity', description: 'apply the ratio of areas of similar triangles being proportional to squares of sides' },
  { notation: 'IN.ICSE.C10.MA.GEO.4', strand: 'Geometry - Similarity', description: 'solve problems on similarity in maps and models using scale factor' },
  { notation: 'IN.ICSE.C10.MA.GEO.5', strand: 'Geometry - Loci', description: 'define locus as the set of points satisfying a given geometric condition' },
  { notation: 'IN.ICSE.C10.MA.GEO.6', strand: 'Geometry - Loci', description: 'find locus of points equidistant from two given points' },
  { notation: 'IN.ICSE.C10.MA.GEO.7', strand: 'Geometry - Loci', description: 'find locus of points equidistant from two intersecting lines' },
  { notation: 'IN.ICSE.C10.MA.GEO.8', strand: 'Geometry - Loci', description: 'construct loci using ruler and compass' },
  { notation: 'IN.ICSE.C10.MA.GEO.9', strand: 'Geometry - Circles', description: 'apply the theorem that angle subtended by an arc at centre is twice the angle at the circumference' },
  { notation: 'IN.ICSE.C10.MA.GEO.10', strand: 'Geometry - Circles', description: 'apply the theorem that angles in the same segment are equal' },
  { notation: 'IN.ICSE.C10.MA.GEO.11', strand: 'Geometry - Circles', description: 'apply the theorem that angle in a semicircle is a right angle' },
  { notation: 'IN.ICSE.C10.MA.GEO.12', strand: 'Geometry - Circles', description: 'apply properties of cyclic quadrilaterals including opposite angles supplementary' },
  { notation: 'IN.ICSE.C10.MA.GEO.13', strand: 'Geometry - Circles', description: 'apply tangent properties: tangent perpendicular to radius at point of contact' },
  { notation: 'IN.ICSE.C10.MA.GEO.14', strand: 'Geometry - Circles', description: 'apply the theorem on tangents from an external point being equal in length' },
  { notation: 'IN.ICSE.C10.MA.GEO.15', strand: 'Geometry - Circles', description: 'apply the intersecting chords and secants theorem' },
  { notation: 'IN.ICSE.C10.MA.GEO.16', strand: 'Geometry - Circles', description: 'apply the alternate segment theorem' },
  { notation: 'IN.ICSE.C10.MA.GEO.17', strand: 'Geometry - Constructions', description: 'construct tangents to a circle from an external point' },
  { notation: 'IN.ICSE.C10.MA.GEO.18', strand: 'Geometry - Constructions', description: 'construct the circumcircle and incircle of a given triangle' },

  // MENSURATION
  { notation: 'IN.ICSE.C10.MA.MEN.1', strand: 'Mensuration', description: 'calculate total surface area and volume of right circular cylinder and hollow cylinder' },
  { notation: 'IN.ICSE.C10.MA.MEN.2', strand: 'Mensuration', description: 'calculate total surface area and volume of right circular cone' },
  { notation: 'IN.ICSE.C10.MA.MEN.3', strand: 'Mensuration', description: 'calculate surface area and volume of sphere and hemisphere' },
  { notation: 'IN.ICSE.C10.MA.MEN.4', strand: 'Mensuration', description: 'solve problems involving conversion of solids from one shape to another' },
  { notation: 'IN.ICSE.C10.MA.MEN.5', strand: 'Mensuration', description: 'solve problems involving combination of solids' },

  // TRIGONOMETRY
  { notation: 'IN.ICSE.C10.MA.TRG.1', strand: 'Trigonometry - Identities', description: 'prove and apply the identity sin^2 θ + cos^2 θ = 1' },
  { notation: 'IN.ICSE.C10.MA.TRG.2', strand: 'Trigonometry - Identities', description: 'prove and apply the identities 1 + tan^2 θ = sec^2 θ and 1 + cot^2 θ = cosec^2 θ' },
  { notation: 'IN.ICSE.C10.MA.TRG.3', strand: 'Trigonometry - Identities', description: 'simplify expressions involving trigonometric identities' },
  { notation: 'IN.ICSE.C10.MA.TRG.4', strand: 'Trigonometry - Identities', description: 'prove conditional trigonometric identities' },
  { notation: 'IN.ICSE.C10.MA.TRG.5', strand: 'Trigonometry - Heights and Distances', description: 'define angle of elevation and angle of depression' },
  { notation: 'IN.ICSE.C10.MA.TRG.6', strand: 'Trigonometry - Heights and Distances', description: 'solve problems on heights and distances using a single right triangle' },
  { notation: 'IN.ICSE.C10.MA.TRG.7', strand: 'Trigonometry - Heights and Distances', description: 'solve problems on heights and distances involving two or more right triangles' },

  // STATISTICS
  { notation: 'IN.ICSE.C10.MA.STA.1', strand: 'Statistics', description: 'construct histograms and frequency polygons for grouped data' },
  { notation: 'IN.ICSE.C10.MA.STA.2', strand: 'Statistics', description: 'construct cumulative frequency curves (ogives) less than type and more than type' },
  { notation: 'IN.ICSE.C10.MA.STA.3', strand: 'Statistics', description: 'compute mean of grouped data using direct method' },
  { notation: 'IN.ICSE.C10.MA.STA.4', strand: 'Statistics', description: 'compute mean of grouped data using assumed mean and step-deviation methods' },
  { notation: 'IN.ICSE.C10.MA.STA.5', strand: 'Statistics', description: 'compute median of grouped data from ogive and by interpolation' },
  { notation: 'IN.ICSE.C10.MA.STA.6', strand: 'Statistics', description: 'compute mode of grouped data using the modal formula' },
  { notation: 'IN.ICSE.C10.MA.STA.7', strand: 'Statistics', description: 'compute quartiles and range from given data' },

  // PROBABILITY
  { notation: 'IN.ICSE.C10.MA.PRB.1', strand: 'Probability', description: 'identify random experiments and sample spaces' },
  { notation: 'IN.ICSE.C10.MA.PRB.2', strand: 'Probability', description: 'compute probability of simple events using P(E) = favourable / total outcomes' },
  { notation: 'IN.ICSE.C10.MA.PRB.3', strand: 'Probability', description: 'solve probability problems involving dice, coins, and playing cards' },
  { notation: 'IN.ICSE.C10.MA.PRB.4', strand: 'Probability', description: 'compute probability of complementary events' }
];

// =============================================================================
// CLASS 11 (Ages 16-17)
// ISC Senior Secondary - Mathematics
// Source: CISCE ISC 2028 Mathematics (860) syllabus
// =============================================================================

const class11Standards: ICSEMathStandard[] = [
  // SETS, RELATIONS AND FUNCTIONS
  { notation: 'IN.ICSE.C11.MA.SET.1', strand: 'Sets', description: 'identify sets and their subsets using roster and set-builder forms' },
  { notation: 'IN.ICSE.C11.MA.SET.2', strand: 'Sets', description: 'perform operations on sets: union, intersection, difference, complement' },
  { notation: 'IN.ICSE.C11.MA.SET.3', strand: 'Sets', description: 'apply laws of algebra of sets and De Morgan\'s laws' },
  { notation: 'IN.ICSE.C11.MA.SET.4', strand: 'Sets', description: 'solve Venn diagram problems involving up to three sets' },
  { notation: 'IN.ICSE.C11.MA.SET.5', strand: 'Relations and Functions', description: 'define Cartesian product of two sets' },
  { notation: 'IN.ICSE.C11.MA.SET.6', strand: 'Relations and Functions', description: 'define a relation and identify domain, range, and co-domain' },
  { notation: 'IN.ICSE.C11.MA.SET.7', strand: 'Relations and Functions', description: 'define a function and identify types: one-one, onto, bijective' },
  { notation: 'IN.ICSE.C11.MA.SET.8', strand: 'Relations and Functions', description: 'identify real-valued functions: constant, identity, polynomial, rational, modulus, signum' },
  { notation: 'IN.ICSE.C11.MA.SET.9', strand: 'Relations and Functions', description: 'sketch graphs of standard functions and identify their domain and range' },

  // TRIGONOMETRY
  { notation: 'IN.ICSE.C11.MA.TRG.1', strand: 'Trigonometry', description: 'convert angles between degree and radian measure' },
  { notation: 'IN.ICSE.C11.MA.TRG.2', strand: 'Trigonometry', description: 'apply trigonometric functions for all angles using unit circle' },
  { notation: 'IN.ICSE.C11.MA.TRG.3', strand: 'Trigonometry', description: 'apply signs of trigonometric functions in all four quadrants' },
  { notation: 'IN.ICSE.C11.MA.TRG.4', strand: 'Trigonometry', description: 'find trigonometric functions of allied angles' },
  { notation: 'IN.ICSE.C11.MA.TRG.5', strand: 'Trigonometry', description: 'apply addition and subtraction formulas for sine, cosine, and tangent' },
  { notation: 'IN.ICSE.C11.MA.TRG.6', strand: 'Trigonometry', description: 'apply double angle and half angle formulas' },
  { notation: 'IN.ICSE.C11.MA.TRG.7', strand: 'Trigonometry', description: 'express sum and differences as products and vice versa' },
  { notation: 'IN.ICSE.C11.MA.TRG.8', strand: 'Trigonometry', description: 'solve trigonometric equations for the general solution' },
  { notation: 'IN.ICSE.C11.MA.TRG.9', strand: 'Trigonometry', description: 'apply sine rule, cosine rule, and projection rule in any triangle' },

  // ALGEBRA
  { notation: 'IN.ICSE.C11.MA.ALG.1', strand: 'Principle of Mathematical Induction', description: 'apply principle of mathematical induction to prove statements about natural numbers' },
  { notation: 'IN.ICSE.C11.MA.ALG.2', strand: 'Complex Numbers', description: 'identify complex numbers and represent in rectangular form a + ib' },
  { notation: 'IN.ICSE.C11.MA.ALG.3', strand: 'Complex Numbers', description: 'perform operations on complex numbers and find conjugate and modulus' },
  { notation: 'IN.ICSE.C11.MA.ALG.4', strand: 'Complex Numbers', description: 'represent complex numbers in polar and Argand plane form' },
  { notation: 'IN.ICSE.C11.MA.ALG.5', strand: 'Complex Numbers', description: 'solve quadratic equations with complex roots' },
  { notation: 'IN.ICSE.C11.MA.ALG.6', strand: 'Quadratic Equations', description: 'solve quadratic inequalities and linear inequalities graphically' },
  { notation: 'IN.ICSE.C11.MA.ALG.7', strand: 'Permutations and Combinations', description: 'apply fundamental principle of counting' },
  { notation: 'IN.ICSE.C11.MA.ALG.8', strand: 'Permutations and Combinations', description: 'compute permutations P(n,r) and combinations C(n,r)' },
  { notation: 'IN.ICSE.C11.MA.ALG.9', strand: 'Permutations and Combinations', description: 'solve problems on arrangements and selections with constraints' },
  { notation: 'IN.ICSE.C11.MA.ALG.10', strand: 'Binomial Theorem', description: 'apply binomial theorem for positive integer index' },
  { notation: 'IN.ICSE.C11.MA.ALG.11', strand: 'Binomial Theorem', description: 'find the general term and middle term in a binomial expansion' },
  { notation: 'IN.ICSE.C11.MA.ALG.12', strand: 'Sequence and Series', description: 'identify arithmetic progression, geometric progression, and harmonic progression' },
  { notation: 'IN.ICSE.C11.MA.ALG.13', strand: 'Sequence and Series', description: 'find sum of arithmetic, geometric, and infinite geometric series' },
  { notation: 'IN.ICSE.C11.MA.ALG.14', strand: 'Sequence and Series', description: 'apply the relationship between arithmetic mean, geometric mean, and harmonic mean' },
  { notation: 'IN.ICSE.C11.MA.ALG.15', strand: 'Sequence and Series', description: 'find sum of special series: sum of squares and cubes of natural numbers' },

  // COORDINATE GEOMETRY
  { notation: 'IN.ICSE.C11.MA.COG.1', strand: 'Straight Lines', description: 'find various forms of the equation of a line: slope-intercept, point-slope, two-point, intercept, normal form' },
  { notation: 'IN.ICSE.C11.MA.COG.2', strand: 'Straight Lines', description: 'find the angle between two lines and condition for parallel and perpendicular lines' },
  { notation: 'IN.ICSE.C11.MA.COG.3', strand: 'Straight Lines', description: 'find distance from a point to a line and distance between parallel lines' },
  { notation: 'IN.ICSE.C11.MA.COG.4', strand: 'Conic Sections', description: 'identify and derive the equation of a circle in standard form' },
  { notation: 'IN.ICSE.C11.MA.COG.5', strand: 'Conic Sections', description: 'identify and derive the equation of a parabola with vertex at origin' },
  { notation: 'IN.ICSE.C11.MA.COG.6', strand: 'Conic Sections', description: 'identify and derive the equation of an ellipse with centre at origin' },
  { notation: 'IN.ICSE.C11.MA.COG.7', strand: 'Conic Sections', description: 'identify and derive the equation of a hyperbola with centre at origin' },
  { notation: 'IN.ICSE.C11.MA.COG.8', strand: 'Three-Dimensional Geometry', description: 'find distance between two points in three-dimensional space' },
  { notation: 'IN.ICSE.C11.MA.COG.9', strand: 'Three-Dimensional Geometry', description: 'apply the section formula in three dimensions' },

  // CALCULUS
  { notation: 'IN.ICSE.C11.MA.CAL.1', strand: 'Limits and Derivatives', description: 'compute limits of simple functions using standard results' },
  { notation: 'IN.ICSE.C11.MA.CAL.2', strand: 'Limits and Derivatives', description: 'compute limits of trigonometric, exponential, and logarithmic functions' },
  { notation: 'IN.ICSE.C11.MA.CAL.3', strand: 'Limits and Derivatives', description: 'define derivative of a function as limit and compute first principles derivatives' },
  { notation: 'IN.ICSE.C11.MA.CAL.4', strand: 'Limits and Derivatives', description: 'compute derivatives of polynomial, trigonometric, exponential, and logarithmic functions' },
  { notation: 'IN.ICSE.C11.MA.CAL.5', strand: 'Limits and Derivatives', description: 'apply sum, product, and quotient rules of differentiation' },

  // STATISTICS AND PROBABILITY
  { notation: 'IN.ICSE.C11.MA.STA.1', strand: 'Statistics', description: 'compute mean deviation about the mean and median for ungrouped and grouped data' },
  { notation: 'IN.ICSE.C11.MA.STA.2', strand: 'Statistics', description: 'compute variance and standard deviation for ungrouped and grouped data' },
  { notation: 'IN.ICSE.C11.MA.STA.3', strand: 'Statistics', description: 'compute the coefficient of variation and compare data sets' },
  { notation: 'IN.ICSE.C11.MA.PRB.1', strand: 'Probability', description: 'apply axiomatic approach to probability using sample space' },
  { notation: 'IN.ICSE.C11.MA.PRB.2', strand: 'Probability', description: 'compute probability of events using P(A ∪ B) = P(A) + P(B) − P(A ∩ B)' },
  { notation: 'IN.ICSE.C11.MA.PRB.3', strand: 'Probability', description: 'compute conditional probability and identify independent events' },

  // MATHEMATICAL REASONING
  { notation: 'IN.ICSE.C11.MA.ALG.16', strand: 'Mathematical Reasoning', description: 'identify statements and connectives in logical reasoning' },
  { notation: 'IN.ICSE.C11.MA.ALG.17', strand: 'Mathematical Reasoning', description: 'apply logical operations: conjunction, disjunction, negation, implication' }
];

// =============================================================================
// CLASS 12 (Ages 17-18)
// ISC Board Examination
// Source: CISCE ISC 2028 Mathematics (860) syllabus
// =============================================================================

const class12Standards: ICSEMathStandard[] = [
  // RELATIONS AND FUNCTIONS
  { notation: 'IN.ICSE.C12.MA.SET.1', strand: 'Relations and Functions', description: 'identify reflexive, symmetric, transitive, and equivalence relations' },
  { notation: 'IN.ICSE.C12.MA.SET.2', strand: 'Relations and Functions', description: 'identify one-one, onto, and invertible functions' },
  { notation: 'IN.ICSE.C12.MA.SET.3', strand: 'Relations and Functions', description: 'compute composition of functions and inverse of a function' },
  { notation: 'IN.ICSE.C12.MA.SET.4', strand: 'Inverse Trigonometric Functions', description: 'define inverse trigonometric functions and their principal value branches' },
  { notation: 'IN.ICSE.C12.MA.SET.5', strand: 'Inverse Trigonometric Functions', description: 'apply properties of inverse trigonometric functions in simplification' },
  { notation: 'IN.ICSE.C12.MA.SET.6', strand: 'Inverse Trigonometric Functions', description: 'sketch graphs of inverse trigonometric functions' },

  // ALGEBRA (MATRICES AND DETERMINANTS)
  { notation: 'IN.ICSE.C12.MA.ALG.1', strand: 'Matrices', description: 'identify types of matrices and perform addition, subtraction, and scalar multiplication' },
  { notation: 'IN.ICSE.C12.MA.ALG.2', strand: 'Matrices', description: 'perform matrix multiplication and verify properties' },
  { notation: 'IN.ICSE.C12.MA.ALG.3', strand: 'Matrices', description: 'compute transpose of a matrix and identify symmetric and skew-symmetric matrices' },
  { notation: 'IN.ICSE.C12.MA.ALG.4', strand: 'Matrices', description: 'find the inverse of a matrix using elementary row transformations' },
  { notation: 'IN.ICSE.C12.MA.ALG.5', strand: 'Determinants', description: 'compute determinants of matrices up to order 3' },
  { notation: 'IN.ICSE.C12.MA.ALG.6', strand: 'Determinants', description: 'apply properties of determinants to simplify computation' },
  { notation: 'IN.ICSE.C12.MA.ALG.7', strand: 'Determinants', description: 'compute area of a triangle using coordinates and determinant formula' },
  { notation: 'IN.ICSE.C12.MA.ALG.8', strand: 'Determinants', description: 'find adjoint and inverse of a matrix using cofactors' },
  { notation: 'IN.ICSE.C12.MA.ALG.9', strand: 'Determinants', description: 'solve systems of linear equations using matrix method and Cramer\'s rule' },

  // CALCULUS
  { notation: 'IN.ICSE.C12.MA.CAL.1', strand: 'Continuity and Differentiability', description: 'determine continuity of a function at a point and on an interval' },
  { notation: 'IN.ICSE.C12.MA.CAL.2', strand: 'Continuity and Differentiability', description: 'determine differentiability and find derivatives of composite, implicit, and inverse trigonometric functions' },
  { notation: 'IN.ICSE.C12.MA.CAL.3', strand: 'Continuity and Differentiability', description: 'apply logarithmic differentiation and parametric differentiation' },
  { notation: 'IN.ICSE.C12.MA.CAL.4', strand: 'Continuity and Differentiability', description: 'compute higher order derivatives and apply Rolle\'s and Lagrange\'s mean value theorems' },
  { notation: 'IN.ICSE.C12.MA.CAL.5', strand: 'Applications of Derivatives', description: 'apply derivatives to find rate of change of quantities' },
  { notation: 'IN.ICSE.C12.MA.CAL.6', strand: 'Applications of Derivatives', description: 'find intervals where function is increasing or decreasing' },
  { notation: 'IN.ICSE.C12.MA.CAL.7', strand: 'Applications of Derivatives', description: 'find maxima and minima of functions using first and second derivative tests' },
  { notation: 'IN.ICSE.C12.MA.CAL.8', strand: 'Applications of Derivatives', description: 'apply derivatives to solve optimization problems' },
  { notation: 'IN.ICSE.C12.MA.CAL.9', strand: 'Applications of Derivatives', description: 'find equations of tangents and normals to curves' },
  { notation: 'IN.ICSE.C12.MA.CAL.10', strand: 'Integrals', description: 'identify integration as anti-derivative and find standard integrals' },
  { notation: 'IN.ICSE.C12.MA.CAL.11', strand: 'Integrals', description: 'apply methods of integration: substitution, partial fractions, and by parts' },
  { notation: 'IN.ICSE.C12.MA.CAL.12', strand: 'Integrals', description: 'integrate trigonometric, exponential, and logarithmic functions' },
  { notation: 'IN.ICSE.C12.MA.CAL.13', strand: 'Integrals', description: 'evaluate definite integrals using fundamental theorem of calculus' },
  { notation: 'IN.ICSE.C12.MA.CAL.14', strand: 'Integrals', description: 'apply properties of definite integrals to simplify computation' },
  { notation: 'IN.ICSE.C12.MA.CAL.15', strand: 'Applications of Integrals', description: 'find area bounded by curves using definite integration' },
  { notation: 'IN.ICSE.C12.MA.CAL.16', strand: 'Applications of Integrals', description: 'find area between two curves using definite integration' },
  { notation: 'IN.ICSE.C12.MA.CAL.17', strand: 'Differential Equations', description: 'identify order and degree of a differential equation' },
  { notation: 'IN.ICSE.C12.MA.CAL.18', strand: 'Differential Equations', description: 'solve first order and first degree differential equations with variables separable' },
  { notation: 'IN.ICSE.C12.MA.CAL.19', strand: 'Differential Equations', description: 'solve homogeneous differential equations' },
  { notation: 'IN.ICSE.C12.MA.CAL.20', strand: 'Differential Equations', description: 'solve linear differential equations of the form dy/dx + Py = Q' },

  // VECTORS AND 3D GEOMETRY
  { notation: 'IN.ICSE.C12.MA.VEC.1', strand: 'Vectors', description: 'identify vectors, scalars, and types of vectors: zero, unit, equal, parallel' },
  { notation: 'IN.ICSE.C12.MA.VEC.2', strand: 'Vectors', description: 'perform addition, subtraction, and scalar multiplication of vectors' },
  { notation: 'IN.ICSE.C12.MA.VEC.3', strand: 'Vectors', description: 'compute position vectors and direction cosines of a vector' },
  { notation: 'IN.ICSE.C12.MA.VEC.4', strand: 'Vectors', description: 'compute scalar (dot) product of vectors and its geometric interpretation' },
  { notation: 'IN.ICSE.C12.MA.VEC.5', strand: 'Vectors', description: 'compute vector (cross) product of vectors and its geometric interpretation' },
  { notation: 'IN.ICSE.C12.MA.VEC.6', strand: 'Vectors', description: 'compute scalar triple product of three vectors' },
  { notation: 'IN.ICSE.C12.MA.VEC.7', strand: 'Vectors', description: 'apply vectors to find area of triangles and parallelograms' },
  { notation: 'IN.ICSE.C12.MA.3DG.1', strand: 'Three-Dimensional Geometry', description: 'find direction cosines and direction ratios of a line' },
  { notation: 'IN.ICSE.C12.MA.3DG.2', strand: 'Three-Dimensional Geometry', description: 'find equation of a line in vector and Cartesian form' },
  { notation: 'IN.ICSE.C12.MA.3DG.3', strand: 'Three-Dimensional Geometry', description: 'find angle between two lines and shortest distance between skew lines' },
  { notation: 'IN.ICSE.C12.MA.3DG.4', strand: 'Three-Dimensional Geometry', description: 'find equation of a plane in various forms' },
  { notation: 'IN.ICSE.C12.MA.3DG.5', strand: 'Three-Dimensional Geometry', description: 'find angle between two planes and between a line and a plane' },
  { notation: 'IN.ICSE.C12.MA.3DG.6', strand: 'Three-Dimensional Geometry', description: 'find distance of a point from a plane' },

  // LINEAR PROGRAMMING
  { notation: 'IN.ICSE.C12.MA.LPG.1', strand: 'Linear Programming', description: 'formulate a linear programming problem with constraints and objective function' },
  { notation: 'IN.ICSE.C12.MA.LPG.2', strand: 'Linear Programming', description: 'identify feasible region and corner points graphically' },
  { notation: 'IN.ICSE.C12.MA.LPG.3', strand: 'Linear Programming', description: 'solve linear programming problems graphically for maximization' },
  { notation: 'IN.ICSE.C12.MA.LPG.4', strand: 'Linear Programming', description: 'solve linear programming problems graphically for minimization' },

  // PROBABILITY
  { notation: 'IN.ICSE.C12.MA.PRB.1', strand: 'Probability', description: 'compute conditional probability P(A|B) and multiplication theorem' },
  { notation: 'IN.ICSE.C12.MA.PRB.2', strand: 'Probability', description: 'apply total probability theorem to solve problems' },
  { notation: 'IN.ICSE.C12.MA.PRB.3', strand: 'Probability', description: 'apply Bayes theorem to solve inverse probability problems' },
  { notation: 'IN.ICSE.C12.MA.PRB.4', strand: 'Probability', description: 'identify random variables and probability distributions' },
  { notation: 'IN.ICSE.C12.MA.PRB.5', strand: 'Probability', description: 'compute mean (expectation) and variance of a random variable' },
  { notation: 'IN.ICSE.C12.MA.PRB.6', strand: 'Probability', description: 'apply binomial distribution to Bernoulli trials problems' },

  // APPLICATIONS OF MATHEMATICS (Commerce Stream)
  { notation: 'IN.ICSE.C12.MA.APM.1', strand: 'Applications of Integrals', description: 'apply integration to find cost and revenue functions from marginal functions' },
  { notation: 'IN.ICSE.C12.MA.APM.2', strand: 'Application of Calculus in Commerce', description: 'apply differentiation to compute marginal cost and marginal revenue' },
  { notation: 'IN.ICSE.C12.MA.APM.3', strand: 'Application of Calculus in Commerce', description: 'find maximum profit and minimum cost in business applications' },
  { notation: 'IN.ICSE.C12.MA.APM.4', strand: 'Application of Calculus in Commerce', description: 'compute price elasticity of demand using derivatives' }
];

// =============================================================================
// EXPORT ICSE MATHEMATICS CURRICULUM
// =============================================================================

export const icseMathCurriculum: ICSEMathCurriculum = {
  code: 'INDIAN_ICSE',
  name: 'Indian Certificate of Secondary Education (CISCE)',
  country: 'IN',
  version: '2027-28',
  sourceUrl: 'https://cisce.org/regulations-and-syllabus-icse-2028/',
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
export function getICSEMathStandardsForClass(classNum: number): ICSEMathStandard[] {
  const classData = icseMathCurriculum.classes.find(c => c.class === classNum);
  return classData?.standards || [];
}

export function getTotalICSEMathStandardsCount(): number {
  return icseMathCurriculum.classes.reduce(
    (sum, c) => sum + c.standards.length,
    0
  );
}

export default icseMathCurriculum;
