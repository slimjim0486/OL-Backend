/**
 * US Common Core State Standards - Mathematics
 * Grades K-12
 *
 * Official Source: https://www.corestandards.org/Math/ (Public Domain)
 *
 * The Common Core State Standards for Mathematics were developed through
 * a state-led initiative by the National Governors Association and the
 * Council of Chief State School Officers in 2010.
 *
 * Notation System: US.CC.{grade}.MA.{domain}.{number}
 * - US = United States
 * - CC = Common Core
 * - Grade: K, 1-12
 * - MA = Mathematics
 * - Domain codes:
 *   Grades K-5:
 *   - CC = Counting and Cardinality (K only)
 *   - OA = Operations and Algebraic Thinking
 *   - NBT = Number and Operations in Base Ten
 *   - NF = Number and Operations - Fractions (3-5)
 *   - MD = Measurement and Data
 *   - G = Geometry
 *   Grades 6-8:
 *   - RP = Ratios and Proportional Relationships (6-7)
 *   - NS = The Number System
 *   - EE = Expressions and Equations
 *   - SP = Statistics and Probability
 *   - F = Functions (8)
 *   - G = Geometry
 *   High School (9-12) - Conceptual Categories:
 *   Number and Quantity:
 *   - NRN = The Real Number System
 *   - NQ = Quantities
 *   - NCN = The Complex Number System
 *   - NVM = Vector and Matrix Quantities
 *   Algebra:
 *   - ASSE = Seeing Structure in Expressions
 *   - AAPR = Arithmetic with Polynomials and Rational Expressions
 *   - ACED = Creating Equations
 *   - AREI = Reasoning with Equations and Inequalities
 *   Functions:
 *   - FIF = Interpreting Functions
 *   - FBF = Building Functions
 *   - FLE = Linear, Quadratic, and Exponential Models
 *   - FTF = Trigonometric Functions
 *   Geometry:
 *   - GCO = Congruence
 *   - GSRT = Similarity, Right Triangles, and Trigonometry
 *   - GC = Circles
 *   - GGPE = Expressing Geometric Properties with Equations
 *   - GGMD = Geometric Measurement and Dimension
 *   - GMG = Modeling with Geometry
 *   Statistics and Probability:
 *   - SID = Interpreting Categorical and Quantitative Data
 *   - SIC = Making Inferences and Justifying Conclusions
 *   - SCP = Conditional Probability and Rules of Probability
 *   - SMD = Using Probability to Make Decisions
 */

export interface CommonCoreMathStandard {
  notation: string;
  domain: string;
  cluster: string;
  description: string;
}

export interface CommonCoreMathGrade {
  grade: number; // 0 = K, 1-8 = Grades 1-8
  gradeLabel: string;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: CommonCoreMathStandard[];
}

export interface CommonCoreMathCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  grades: CommonCoreMathGrade[];
}

// =============================================================================
// KINDERGARTEN (Ages 5-6)
// =============================================================================

const kindergartenStandards: CommonCoreMathStandard[] = [
  // COUNTING AND CARDINALITY (CC)
  {
    notation: 'US.CC.K.MA.CC.1',
    domain: 'Counting and Cardinality',
    cluster: 'Know number names and the count sequence',
    description: 'count to 100 by ones and by tens',
  },
  {
    notation: 'US.CC.K.MA.CC.2',
    domain: 'Counting and Cardinality',
    cluster: 'Know number names and the count sequence',
    description: 'count forward beginning from a given number within the known sequence',
  },
  {
    notation: 'US.CC.K.MA.CC.3',
    domain: 'Counting and Cardinality',
    cluster: 'Know number names and the count sequence',
    description: 'write numbers from 0 to 20 and represent a number of objects with a written numeral',
  },
  {
    notation: 'US.CC.K.MA.CC.4a',
    domain: 'Counting and Cardinality',
    cluster: 'Count to tell the number of objects',
    description: 'understand that when counting, each object must be counted exactly once',
  },
  {
    notation: 'US.CC.K.MA.CC.4b',
    domain: 'Counting and Cardinality',
    cluster: 'Count to tell the number of objects',
    description: 'understand that the last number name said tells the number of objects counted',
  },
  {
    notation: 'US.CC.K.MA.CC.4c',
    domain: 'Counting and Cardinality',
    cluster: 'Count to tell the number of objects',
    description: 'understand that the number of objects is the same regardless of arrangement or order counted',
  },
  {
    notation: 'US.CC.K.MA.CC.5',
    domain: 'Counting and Cardinality',
    cluster: 'Count to tell the number of objects',
    description: 'count to answer "how many?" questions about as many as 20 objects arranged in various configurations',
  },
  {
    notation: 'US.CC.K.MA.CC.6',
    domain: 'Counting and Cardinality',
    cluster: 'Compare numbers',
    description: 'identify whether the number of objects in one group is greater than, less than, or equal to the number in another group',
  },
  {
    notation: 'US.CC.K.MA.CC.7',
    domain: 'Counting and Cardinality',
    cluster: 'Compare numbers',
    description: 'compare two numbers between 1 and 10 presented as written numerals',
  },

  // OPERATIONS AND ALGEBRAIC THINKING (OA)
  {
    notation: 'US.CC.K.MA.OA.1',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Understand addition as putting together and adding to',
    description: 'represent addition and subtraction with objects, fingers, mental images, drawings, sounds, acting out situations, verbal explanations, expressions, or equations',
  },
  {
    notation: 'US.CC.K.MA.OA.2',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Understand addition as putting together and adding to',
    description: 'solve addition and subtraction word problems within 10 using objects or drawings',
  },
  {
    notation: 'US.CC.K.MA.OA.3',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Understand addition as putting together and adding to',
    description: 'decompose numbers less than or equal to 10 into pairs in more than one way',
  },
  {
    notation: 'US.CC.K.MA.OA.4',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Understand addition as putting together and adding to',
    description: 'find the number that makes 10 when added to any given number from 1 to 9',
  },
  {
    notation: 'US.CC.K.MA.OA.5',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Understand addition as putting together and adding to',
    description: 'fluently add and subtract within 5',
  },

  // NUMBER AND OPERATIONS IN BASE TEN (NBT)
  {
    notation: 'US.CC.K.MA.NBT.1',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Work with numbers 11-19',
    description: 'compose and decompose numbers from 11 to 19 into ten ones and some further ones, understanding that these numbers are composed of ten ones and one, two, three, four, five, six, seven, eight, or nine ones',
  },

  // MEASUREMENT AND DATA (MD)
  {
    notation: 'US.CC.K.MA.MD.1',
    domain: 'Measurement and Data',
    cluster: 'Describe and compare measurable attributes',
    description: 'describe measurable attributes of objects, such as length or weight, and describe several measurable attributes of a single object',
  },
  {
    notation: 'US.CC.K.MA.MD.2',
    domain: 'Measurement and Data',
    cluster: 'Describe and compare measurable attributes',
    description: 'directly compare two objects with a measurable attribute in common, to see which object has "more of" or "less of" the attribute, and describe the difference',
  },
  {
    notation: 'US.CC.K.MA.MD.3',
    domain: 'Measurement and Data',
    cluster: 'Classify objects and count the number of objects in each category',
    description: 'classify objects into given categories; count the numbers of objects in each category and sort the categories by count',
  },

  // GEOMETRY (G)
  {
    notation: 'US.CC.K.MA.G.1',
    domain: 'Geometry',
    cluster: 'Identify and describe shapes',
    description: 'describe objects in the environment using names of shapes, and describe the relative positions of these objects using terms such as above, below, beside, in front of, behind, and next to',
  },
  {
    notation: 'US.CC.K.MA.G.2',
    domain: 'Geometry',
    cluster: 'Identify and describe shapes',
    description: 'correctly name shapes regardless of their orientations or overall size',
  },
  {
    notation: 'US.CC.K.MA.G.3',
    domain: 'Geometry',
    cluster: 'Identify and describe shapes',
    description: 'identify shapes as two-dimensional (flat) or three-dimensional (solid)',
  },
  {
    notation: 'US.CC.K.MA.G.4',
    domain: 'Geometry',
    cluster: 'Analyze, compare, create, and compose shapes',
    description: 'analyze and compare two- and three-dimensional shapes, in different sizes and orientations, using informal language to describe their similarities, differences, parts, and other attributes',
  },
  {
    notation: 'US.CC.K.MA.G.5',
    domain: 'Geometry',
    cluster: 'Analyze, compare, create, and compose shapes',
    description: 'model shapes in the world by building shapes from components and drawing shapes',
  },
  {
    notation: 'US.CC.K.MA.G.6',
    domain: 'Geometry',
    cluster: 'Analyze, compare, create, and compose shapes',
    description: 'compose simple shapes to form larger shapes',
  },
];

// =============================================================================
// GRADE 1 (Ages 6-7)
// =============================================================================

const grade1Standards: CommonCoreMathStandard[] = [
  // OPERATIONS AND ALGEBRAIC THINKING (OA)
  {
    notation: 'US.CC.1.MA.OA.1',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Represent and solve problems involving addition and subtraction',
    description: 'use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing',
  },
  {
    notation: 'US.CC.1.MA.OA.2',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Represent and solve problems involving addition and subtraction',
    description: 'solve word problems that call for addition of three whole numbers whose sum is less than or equal to 20',
  },
  {
    notation: 'US.CC.1.MA.OA.3',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Understand and apply properties of operations',
    description: 'apply properties of operations as strategies to add and subtract, including commutative and associative properties',
  },
  {
    notation: 'US.CC.1.MA.OA.4',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Understand and apply properties of operations',
    description: 'understand subtraction as an unknown-addend problem',
  },
  {
    notation: 'US.CC.1.MA.OA.5',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Add and subtract within 20',
    description: 'relate counting to addition and subtraction by counting on or counting back',
  },
  {
    notation: 'US.CC.1.MA.OA.6',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Add and subtract within 20',
    description: 'add and subtract within 20, demonstrating fluency for addition and subtraction within 10',
  },
  {
    notation: 'US.CC.1.MA.OA.7',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Work with addition and subtraction equations',
    description: 'understand the meaning of the equal sign, and determine if equations involving addition and subtraction are true or false',
  },
  {
    notation: 'US.CC.1.MA.OA.8',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Work with addition and subtraction equations',
    description: 'determine the unknown whole number in an addition or subtraction equation relating three whole numbers',
  },

  // NUMBER AND OPERATIONS IN BASE TEN (NBT)
  {
    notation: 'US.CC.1.MA.NBT.1',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Extend the counting sequence',
    description: 'count to 120, starting at any number less than 120, and read and write numerals and represent a number of objects with a written numeral',
  },
  {
    notation: 'US.CC.1.MA.NBT.2',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Understand place value',
    description: 'understand that the two digits of a two-digit number represent amounts of tens and ones',
  },
  {
    notation: 'US.CC.1.MA.NBT.3',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Understand place value',
    description: 'compare two two-digit numbers based on meanings of the tens and ones digits, using >, =, and < symbols',
  },
  {
    notation: 'US.CC.1.MA.NBT.4',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to add and subtract',
    description: 'add within 100, including adding a two-digit number and a one-digit number, and adding a two-digit number and a multiple of 10',
  },
  {
    notation: 'US.CC.1.MA.NBT.5',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to add and subtract',
    description: 'given a two-digit number, mentally find 10 more or 10 less than the number, without having to count',
  },
  {
    notation: 'US.CC.1.MA.NBT.6',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to add and subtract',
    description: 'subtract multiples of 10 in the range 10-90 from multiples of 10 in the range 10-90',
  },

  // MEASUREMENT AND DATA (MD)
  {
    notation: 'US.CC.1.MA.MD.1',
    domain: 'Measurement and Data',
    cluster: 'Measure lengths indirectly and by iterating length units',
    description: 'order three objects by length; compare the lengths of two objects indirectly by using a third object',
  },
  {
    notation: 'US.CC.1.MA.MD.2',
    domain: 'Measurement and Data',
    cluster: 'Measure lengths indirectly and by iterating length units',
    description: 'express the length of an object as a whole number of length units, by laying multiple copies of a shorter object end to end',
  },
  {
    notation: 'US.CC.1.MA.MD.3',
    domain: 'Measurement and Data',
    cluster: 'Tell and write time',
    description: 'tell and write time in hours and half-hours using analog and digital clocks',
  },
  {
    notation: 'US.CC.1.MA.MD.4',
    domain: 'Measurement and Data',
    cluster: 'Represent and interpret data',
    description: 'organize, represent, and interpret data with up to three categories; ask and answer questions about the total number of data points, how many in each category, and how many more or less are in one category than in another',
  },

  // GEOMETRY (G)
  {
    notation: 'US.CC.1.MA.G.1',
    domain: 'Geometry',
    cluster: 'Reason with shapes and their attributes',
    description: 'distinguish between defining attributes versus non-defining attributes; build and draw shapes to possess defining attributes',
  },
  {
    notation: 'US.CC.1.MA.G.2',
    domain: 'Geometry',
    cluster: 'Reason with shapes and their attributes',
    description: 'compose two-dimensional shapes (rectangles, squares, trapezoids, triangles, half-circles, and quarter-circles) or three-dimensional shapes (cubes, right rectangular prisms, right circular cones, and right circular cylinders) to create a composite shape',
  },
  {
    notation: 'US.CC.1.MA.G.3',
    domain: 'Geometry',
    cluster: 'Reason with shapes and their attributes',
    description: 'partition circles and rectangles into two and four equal shares, describe the shares using the words halves, fourths, and quarters, and use the phrases half of, fourth of, and quarter of',
  },
];

// =============================================================================
// GRADE 2 (Ages 7-8)
// =============================================================================

const grade2Standards: CommonCoreMathStandard[] = [
  // OPERATIONS AND ALGEBRAIC THINKING (OA)
  {
    notation: 'US.CC.2.MA.OA.1',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Represent and solve problems involving addition and subtraction',
    description: 'use addition and subtraction within 100 to solve one- and two-step word problems involving situations of adding to, taking from, putting together, taking apart, and comparing',
  },
  {
    notation: 'US.CC.2.MA.OA.2',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Add and subtract within 20',
    description: 'fluently add and subtract within 20 using mental strategies, and by end of Grade 2, know from memory all sums of two one-digit numbers',
  },
  {
    notation: 'US.CC.2.MA.OA.3',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Work with equal groups of objects to gain foundations for multiplication',
    description: 'determine whether a group of objects (up to 20) has an odd or even number of members',
  },
  {
    notation: 'US.CC.2.MA.OA.4',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Work with equal groups of objects to gain foundations for multiplication',
    description: 'use addition to find the total number of objects arranged in rectangular arrays with up to 5 rows and up to 5 columns; write an equation to express the total as a sum of equal addends',
  },

  // NUMBER AND OPERATIONS IN BASE TEN (NBT)
  {
    notation: 'US.CC.2.MA.NBT.1',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Understand place value',
    description: 'understand that the three digits of a three-digit number represent amounts of hundreds, tens, and ones',
  },
  {
    notation: 'US.CC.2.MA.NBT.2',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Understand place value',
    description: 'count within 1000; skip-count by 5s, 10s, and 100s',
  },
  {
    notation: 'US.CC.2.MA.NBT.3',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Understand place value',
    description: 'read and write numbers to 1000 using base-ten numerals, number names, and expanded form',
  },
  {
    notation: 'US.CC.2.MA.NBT.4',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Understand place value',
    description: 'compare two three-digit numbers based on meanings of the hundreds, tens, and ones digits, using >, =, and < symbols',
  },
  {
    notation: 'US.CC.2.MA.NBT.5',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to add and subtract',
    description: 'fluently add and subtract within 100 using strategies based on place value, properties of operations, and/or the relationship between addition and subtraction',
  },
  {
    notation: 'US.CC.2.MA.NBT.6',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to add and subtract',
    description: 'add up to four two-digit numbers using strategies based on place value and properties of operations',
  },
  {
    notation: 'US.CC.2.MA.NBT.7',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to add and subtract',
    description: 'add and subtract within 1000, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction',
  },
  {
    notation: 'US.CC.2.MA.NBT.8',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to add and subtract',
    description: 'mentally add 10 or 100 to a given number 100-900, and mentally subtract 10 or 100 from a given number 100-900',
  },
  {
    notation: 'US.CC.2.MA.NBT.9',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to add and subtract',
    description: 'explain why addition and subtraction strategies work, using place value and the properties of operations',
  },

  // MEASUREMENT AND DATA (MD)
  {
    notation: 'US.CC.2.MA.MD.1',
    domain: 'Measurement and Data',
    cluster: 'Measure and estimate lengths in standard units',
    description: 'measure the length of an object by selecting and using appropriate tools such as rulers, yardsticks, meter sticks, and measuring tapes',
  },
  {
    notation: 'US.CC.2.MA.MD.2',
    domain: 'Measurement and Data',
    cluster: 'Measure and estimate lengths in standard units',
    description: 'measure the length of an object twice, using length units of different lengths; describe how the two measurements relate to the size of the unit chosen',
  },
  {
    notation: 'US.CC.2.MA.MD.3',
    domain: 'Measurement and Data',
    cluster: 'Measure and estimate lengths in standard units',
    description: 'estimate lengths using units of inches, feet, centimeters, and meters',
  },
  {
    notation: 'US.CC.2.MA.MD.4',
    domain: 'Measurement and Data',
    cluster: 'Measure and estimate lengths in standard units',
    description: 'measure to determine how much longer one object is than another, expressing the length difference in terms of a standard length unit',
  },
  {
    notation: 'US.CC.2.MA.MD.5',
    domain: 'Measurement and Data',
    cluster: 'Relate addition and subtraction to length',
    description: 'use addition and subtraction within 100 to solve word problems involving lengths that are given in the same units',
  },
  {
    notation: 'US.CC.2.MA.MD.6',
    domain: 'Measurement and Data',
    cluster: 'Relate addition and subtraction to length',
    description: 'represent whole numbers as lengths from 0 on a number line diagram with equally spaced points, and represent whole-number sums and differences within 100 on a number line diagram',
  },
  {
    notation: 'US.CC.2.MA.MD.7',
    domain: 'Measurement and Data',
    cluster: 'Work with time and money',
    description: 'tell and write time from analog and digital clocks to the nearest five minutes, using a.m. and p.m.',
  },
  {
    notation: 'US.CC.2.MA.MD.8',
    domain: 'Measurement and Data',
    cluster: 'Work with time and money',
    description: 'solve word problems involving dollar bills, quarters, dimes, nickels, and pennies, using $ and cent symbols appropriately',
  },
  {
    notation: 'US.CC.2.MA.MD.9',
    domain: 'Measurement and Data',
    cluster: 'Represent and interpret data',
    description: 'generate measurement data by measuring lengths of several objects to the nearest whole unit, or by making repeated measurements of the same object; show the measurements by making a line plot',
  },
  {
    notation: 'US.CC.2.MA.MD.10',
    domain: 'Measurement and Data',
    cluster: 'Represent and interpret data',
    description: 'draw a picture graph and a bar graph (with single-unit scale) to represent a data set with up to four categories; solve simple put-together, take-apart, and compare problems using information presented in a bar graph',
  },

  // GEOMETRY (G)
  {
    notation: 'US.CC.2.MA.G.1',
    domain: 'Geometry',
    cluster: 'Reason with shapes and their attributes',
    description: 'recognize and draw shapes having specified attributes, such as a given number of angles or a given number of equal faces; identify triangles, quadrilaterals, pentagons, hexagons, and cubes',
  },
  {
    notation: 'US.CC.2.MA.G.2',
    domain: 'Geometry',
    cluster: 'Reason with shapes and their attributes',
    description: 'partition a rectangle into rows and columns of same-size squares and count to find the total number of them',
  },
  {
    notation: 'US.CC.2.MA.G.3',
    domain: 'Geometry',
    cluster: 'Reason with shapes and their attributes',
    description: 'partition circles and rectangles into two, three, or four equal shares, describe the shares using the words halves, thirds, half of, a third of, etc., and describe the whole as two halves, three thirds, four fourths',
  },
];

// =============================================================================
// GRADE 3 (Ages 8-9)
// =============================================================================

const grade3Standards: CommonCoreMathStandard[] = [
  // OPERATIONS AND ALGEBRAIC THINKING (OA)
  {
    notation: 'US.CC.3.MA.OA.1',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Represent and solve problems involving multiplication and division',
    description: 'interpret products of whole numbers as the total number of objects in groups',
  },
  {
    notation: 'US.CC.3.MA.OA.2',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Represent and solve problems involving multiplication and division',
    description: 'interpret whole-number quotients of whole numbers as the number of objects in each share or the number of shares',
  },
  {
    notation: 'US.CC.3.MA.OA.3',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Represent and solve problems involving multiplication and division',
    description: 'use multiplication and division within 100 to solve word problems in situations involving equal groups, arrays, and measurement quantities',
  },
  {
    notation: 'US.CC.3.MA.OA.4',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Represent and solve problems involving multiplication and division',
    description: 'determine the unknown whole number in a multiplication or division equation relating three whole numbers',
  },
  {
    notation: 'US.CC.3.MA.OA.5',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Understand properties of multiplication and the relationship between multiplication and division',
    description: 'apply properties of operations as strategies to multiply and divide, including commutative, associative, and distributive properties',
  },
  {
    notation: 'US.CC.3.MA.OA.6',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Understand properties of multiplication and the relationship between multiplication and division',
    description: 'understand division as an unknown-factor problem',
  },
  {
    notation: 'US.CC.3.MA.OA.7',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Multiply and divide within 100',
    description: 'fluently multiply and divide within 100, using strategies such as the relationship between multiplication and division, and properties of operations; by the end of Grade 3, know from memory all products of two one-digit numbers',
  },
  {
    notation: 'US.CC.3.MA.OA.8',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Solve problems involving the four operations',
    description: 'solve two-step word problems using the four operations, and represent these problems using equations with a letter standing for the unknown quantity',
  },
  {
    notation: 'US.CC.3.MA.OA.9',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Solve problems involving the four operations',
    description: 'identify arithmetic patterns (including patterns in the addition table or multiplication table), and explain them using properties of operations',
  },

  // NUMBER AND OPERATIONS IN BASE TEN (NBT)
  {
    notation: 'US.CC.3.MA.NBT.1',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to perform multi-digit arithmetic',
    description: 'use place value understanding to round whole numbers to the nearest 10 or 100',
  },
  {
    notation: 'US.CC.3.MA.NBT.2',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to perform multi-digit arithmetic',
    description: 'fluently add and subtract within 1000 using strategies and algorithms based on place value, properties of operations, and/or the relationship between addition and subtraction',
  },
  {
    notation: 'US.CC.3.MA.NBT.3',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to perform multi-digit arithmetic',
    description: 'multiply one-digit whole numbers by multiples of 10 in the range 10-90 using strategies based on place value and properties of operations',
  },

  // NUMBER AND OPERATIONS - FRACTIONS (NF)
  {
    notation: 'US.CC.3.MA.NF.1',
    domain: 'Number and Operations - Fractions',
    cluster: 'Develop understanding of fractions as numbers',
    description: 'understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts; understand a fraction a/b as the quantity formed by a parts of size 1/b',
  },
  {
    notation: 'US.CC.3.MA.NF.2',
    domain: 'Number and Operations - Fractions',
    cluster: 'Develop understanding of fractions as numbers',
    description: 'understand a fraction as a number on the number line; represent fractions on a number line diagram',
  },
  {
    notation: 'US.CC.3.MA.NF.3',
    domain: 'Number and Operations - Fractions',
    cluster: 'Develop understanding of fractions as numbers',
    description: 'explain equivalence of fractions in special cases, and compare fractions by reasoning about their size',
  },

  // MEASUREMENT AND DATA (MD)
  {
    notation: 'US.CC.3.MA.MD.1',
    domain: 'Measurement and Data',
    cluster: 'Solve problems involving measurement and estimation of intervals of time, liquid volumes, and masses of objects',
    description: 'tell and write time to the nearest minute and measure time intervals in minutes; solve word problems involving addition and subtraction of time intervals',
  },
  {
    notation: 'US.CC.3.MA.MD.2',
    domain: 'Measurement and Data',
    cluster: 'Solve problems involving measurement and estimation of intervals of time, liquid volumes, and masses of objects',
    description: 'measure and estimate liquid volumes and masses of objects using standard units of grams, kilograms, and liters; add, subtract, multiply, or divide to solve one-step word problems involving masses or volumes',
  },
  {
    notation: 'US.CC.3.MA.MD.3',
    domain: 'Measurement and Data',
    cluster: 'Represent and interpret data',
    description: 'draw a scaled picture graph and a scaled bar graph to represent a data set with several categories; solve one- and two-step "how many more" and "how many less" problems using information presented in scaled bar graphs',
  },
  {
    notation: 'US.CC.3.MA.MD.4',
    domain: 'Measurement and Data',
    cluster: 'Represent and interpret data',
    description: 'generate measurement data by measuring lengths using rulers marked with halves and fourths of an inch; show the data by making a line plot, where the horizontal scale is marked off in appropriate units',
  },
  {
    notation: 'US.CC.3.MA.MD.5',
    domain: 'Measurement and Data',
    cluster: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition',
    description: 'recognize area as an attribute of plane figures and understand concepts of area measurement',
  },
  {
    notation: 'US.CC.3.MA.MD.6',
    domain: 'Measurement and Data',
    cluster: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition',
    description: 'measure areas by counting unit squares (square cm, square m, square in, square ft, and improvised units)',
  },
  {
    notation: 'US.CC.3.MA.MD.7',
    domain: 'Measurement and Data',
    cluster: 'Geometric measurement: understand concepts of area and relate area to multiplication and to addition',
    description: 'relate area to the operations of multiplication and addition, and solve real world and mathematical problems involving area',
  },
  {
    notation: 'US.CC.3.MA.MD.8',
    domain: 'Measurement and Data',
    cluster: 'Geometric measurement: recognize perimeter as an attribute of plane figures',
    description: 'solve real world and mathematical problems involving perimeters of polygons, including finding the perimeter given the side lengths, finding an unknown side length, and exhibiting rectangles with the same perimeter and different areas or with the same area and different perimeters',
  },

  // GEOMETRY (G)
  {
    notation: 'US.CC.3.MA.G.1',
    domain: 'Geometry',
    cluster: 'Reason with shapes and their attributes',
    description: 'understand that shapes in different categories may share attributes, and that the shared attributes can define a larger category; recognize rhombuses, rectangles, and squares as examples of quadrilaterals',
  },
  {
    notation: 'US.CC.3.MA.G.2',
    domain: 'Geometry',
    cluster: 'Reason with shapes and their attributes',
    description: 'partition shapes into parts with equal areas and express the area of each part as a unit fraction of the whole',
  },
];

// =============================================================================
// GRADE 4 (Ages 9-10)
// =============================================================================

const grade4Standards: CommonCoreMathStandard[] = [
  // OPERATIONS AND ALGEBRAIC THINKING (OA)
  {
    notation: 'US.CC.4.MA.OA.1',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Use the four operations with whole numbers to solve problems',
    description: 'interpret a multiplication equation as a comparison, and represent verbal statements of multiplicative comparisons as multiplication equations',
  },
  {
    notation: 'US.CC.4.MA.OA.2',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Use the four operations with whole numbers to solve problems',
    description: 'multiply or divide to solve word problems involving multiplicative comparison, using drawings and equations with a symbol for the unknown number',
  },
  {
    notation: 'US.CC.4.MA.OA.3',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Use the four operations with whole numbers to solve problems',
    description: 'solve multistep word problems posed with whole numbers and having whole-number answers using the four operations, including problems in which remainders must be interpreted',
  },
  {
    notation: 'US.CC.4.MA.OA.4',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Gain familiarity with factors and multiples',
    description: 'find all factor pairs for a whole number in the range 1-100, and recognize that a whole number is a multiple of each of its factors; determine whether a given whole number in the range 1-100 is a multiple of a given one-digit number; determine whether a given whole number in the range 1-100 is prime or composite',
  },
  {
    notation: 'US.CC.4.MA.OA.5',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Generate and analyze patterns',
    description: 'generate a number or shape pattern that follows a given rule, and identify apparent features of the pattern that were not explicit in the rule itself',
  },

  // NUMBER AND OPERATIONS IN BASE TEN (NBT)
  {
    notation: 'US.CC.4.MA.NBT.1',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Generalize place value understanding for multi-digit whole numbers',
    description: 'recognize that in a multi-digit whole number, a digit in one place represents ten times what it represents in the place to its right',
  },
  {
    notation: 'US.CC.4.MA.NBT.2',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Generalize place value understanding for multi-digit whole numbers',
    description: 'read and write multi-digit whole numbers using base-ten numerals, number names, and expanded form; compare two multi-digit numbers based on meanings of the digits using >, =, and < symbols',
  },
  {
    notation: 'US.CC.4.MA.NBT.3',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Generalize place value understanding for multi-digit whole numbers',
    description: 'use place value understanding to round multi-digit whole numbers to any place',
  },
  {
    notation: 'US.CC.4.MA.NBT.4',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to perform multi-digit arithmetic',
    description: 'fluently add and subtract multi-digit whole numbers using the standard algorithm',
  },
  {
    notation: 'US.CC.4.MA.NBT.5',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to perform multi-digit arithmetic',
    description: 'multiply a whole number of up to four digits by a one-digit whole number, and multiply two two-digit numbers, using strategies based on place value and the properties of operations',
  },
  {
    notation: 'US.CC.4.MA.NBT.6',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Use place value understanding and properties of operations to perform multi-digit arithmetic',
    description: 'find whole-number quotients and remainders with up to four-digit dividends and one-digit divisors, using strategies based on place value, the properties of operations, and/or the relationship between multiplication and division',
  },

  // NUMBER AND OPERATIONS - FRACTIONS (NF)
  {
    notation: 'US.CC.4.MA.NF.1',
    domain: 'Number and Operations - Fractions',
    cluster: 'Extend understanding of fraction equivalence and ordering',
    description: 'explain why a fraction a/b is equivalent to a fraction (n x a)/(n x b) by using visual fraction models, with attention to how the number and size of the parts differ even though the two fractions themselves are the same size',
  },
  {
    notation: 'US.CC.4.MA.NF.2',
    domain: 'Number and Operations - Fractions',
    cluster: 'Extend understanding of fraction equivalence and ordering',
    description: 'compare two fractions with different numerators and different denominators by creating common denominators or numerators, or by comparing to a benchmark fraction such as 1/2',
  },
  {
    notation: 'US.CC.4.MA.NF.3',
    domain: 'Number and Operations - Fractions',
    cluster: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers',
    description: 'understand a fraction a/b with a > 1 as a sum of fractions 1/b; add and subtract fractions and mixed numbers with like denominators',
  },
  {
    notation: 'US.CC.4.MA.NF.4',
    domain: 'Number and Operations - Fractions',
    cluster: 'Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers',
    description: 'apply and extend previous understandings of multiplication to multiply a fraction by a whole number',
  },
  {
    notation: 'US.CC.4.MA.NF.5',
    domain: 'Number and Operations - Fractions',
    cluster: 'Understand decimal notation for fractions, and compare decimal fractions',
    description: 'express a fraction with denominator 10 as an equivalent fraction with denominator 100, and use this technique to add two fractions with respective denominators 10 and 100',
  },
  {
    notation: 'US.CC.4.MA.NF.6',
    domain: 'Number and Operations - Fractions',
    cluster: 'Understand decimal notation for fractions, and compare decimal fractions',
    description: 'use decimal notation for fractions with denominators 10 or 100',
  },
  {
    notation: 'US.CC.4.MA.NF.7',
    domain: 'Number and Operations - Fractions',
    cluster: 'Understand decimal notation for fractions, and compare decimal fractions',
    description: 'compare two decimals to hundredths by reasoning about their size, using >, =, and < symbols',
  },

  // MEASUREMENT AND DATA (MD)
  {
    notation: 'US.CC.4.MA.MD.1',
    domain: 'Measurement and Data',
    cluster: 'Solve problems involving measurement and conversion of measurements from a larger unit to a smaller unit',
    description: 'know relative sizes of measurement units within one system of units including km, m, cm; kg, g; lb, oz.; l, ml; hr, min, sec; within a single system of measurement, express measurements in a larger unit in terms of a smaller unit',
  },
  {
    notation: 'US.CC.4.MA.MD.2',
    domain: 'Measurement and Data',
    cluster: 'Solve problems involving measurement and conversion of measurements from a larger unit to a smaller unit',
    description: 'use the four operations to solve word problems involving distances, intervals of time, liquid volumes, masses of objects, and money, including problems involving simple fractions or decimals',
  },
  {
    notation: 'US.CC.4.MA.MD.3',
    domain: 'Measurement and Data',
    cluster: 'Solve problems involving measurement and conversion of measurements from a larger unit to a smaller unit',
    description: 'apply the area and perimeter formulas for rectangles in real world and mathematical problems',
  },
  {
    notation: 'US.CC.4.MA.MD.4',
    domain: 'Measurement and Data',
    cluster: 'Represent and interpret data',
    description: 'make a line plot to display a data set of measurements in fractions of a unit (1/2, 1/4, 1/8); solve problems involving addition and subtraction of fractions by using information presented in line plots',
  },
  {
    notation: 'US.CC.4.MA.MD.5',
    domain: 'Measurement and Data',
    cluster: 'Geometric measurement: understand concepts of angle and measure angles',
    description: 'recognize angles as geometric shapes that are formed wherever two rays share a common endpoint, and understand concepts of angle measurement',
  },
  {
    notation: 'US.CC.4.MA.MD.6',
    domain: 'Measurement and Data',
    cluster: 'Geometric measurement: understand concepts of angle and measure angles',
    description: 'measure angles in whole-number degrees using a protractor; sketch angles of specified measure',
  },
  {
    notation: 'US.CC.4.MA.MD.7',
    domain: 'Measurement and Data',
    cluster: 'Geometric measurement: understand concepts of angle and measure angles',
    description: 'recognize angle measure as additive; when an angle is decomposed into non-overlapping parts, the angle measure of the whole is the sum of the angle measures of the parts; solve addition and subtraction problems to find unknown angles on a diagram in real world and mathematical problems',
  },

  // GEOMETRY (G)
  {
    notation: 'US.CC.4.MA.G.1',
    domain: 'Geometry',
    cluster: 'Draw and identify lines and angles, and classify shapes by properties of their lines and angles',
    description: 'draw points, lines, line segments, rays, angles (right, acute, obtuse), and perpendicular and parallel lines; identify these in two-dimensional figures',
  },
  {
    notation: 'US.CC.4.MA.G.2',
    domain: 'Geometry',
    cluster: 'Draw and identify lines and angles, and classify shapes by properties of their lines and angles',
    description: 'classify two-dimensional figures based on the presence or absence of parallel or perpendicular lines, or the presence or absence of angles of a specified size; recognize right triangles as a category',
  },
  {
    notation: 'US.CC.4.MA.G.3',
    domain: 'Geometry',
    cluster: 'Draw and identify lines and angles, and classify shapes by properties of their lines and angles',
    description: 'recognize a line of symmetry for a two-dimensional figure as a line across the figure such that the figure can be folded along the line into matching parts; identify line-symmetric figures and draw lines of symmetry',
  },
];

// =============================================================================
// GRADE 5 (Ages 10-11)
// =============================================================================

const grade5Standards: CommonCoreMathStandard[] = [
  // OPERATIONS AND ALGEBRAIC THINKING (OA)
  {
    notation: 'US.CC.5.MA.OA.1',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Write and interpret numerical expressions',
    description: 'use parentheses, brackets, or braces in numerical expressions, and evaluate expressions with these symbols',
  },
  {
    notation: 'US.CC.5.MA.OA.2',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Write and interpret numerical expressions',
    description: 'write simple expressions that record calculations with numbers, and interpret numerical expressions without evaluating them',
  },
  {
    notation: 'US.CC.5.MA.OA.3',
    domain: 'Operations and Algebraic Thinking',
    cluster: 'Analyze patterns and relationships',
    description: 'generate two numerical patterns using two given rules, identify apparent relationships between corresponding terms, and form ordered pairs consisting of corresponding terms from the two patterns, and graph the ordered pairs on a coordinate plane',
  },

  // NUMBER AND OPERATIONS IN BASE TEN (NBT)
  {
    notation: 'US.CC.5.MA.NBT.1',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Understand the place value system',
    description: 'recognize that in a multi-digit number, a digit in one place represents 10 times as much as it represents in the place to its right and 1/10 of what it represents in the place to its left',
  },
  {
    notation: 'US.CC.5.MA.NBT.2',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Understand the place value system',
    description: 'explain patterns in the number of zeros of the product when multiplying a number by powers of 10, and explain patterns in the placement of the decimal point when a decimal is multiplied or divided by a power of 10',
  },
  {
    notation: 'US.CC.5.MA.NBT.3',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Understand the place value system',
    description: 'read, write, and compare decimals to thousandths using base-ten numerals, number names, and expanded form',
  },
  {
    notation: 'US.CC.5.MA.NBT.4',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Understand the place value system',
    description: 'use place value understanding to round decimals to any place',
  },
  {
    notation: 'US.CC.5.MA.NBT.5',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Perform operations with multi-digit whole numbers and with decimals to hundredths',
    description: 'fluently multiply multi-digit whole numbers using the standard algorithm',
  },
  {
    notation: 'US.CC.5.MA.NBT.6',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Perform operations with multi-digit whole numbers and with decimals to hundredths',
    description: 'find whole-number quotients of whole numbers with up to four-digit dividends and two-digit divisors, using strategies based on place value, the properties of operations, and/or the relationship between multiplication and division',
  },
  {
    notation: 'US.CC.5.MA.NBT.7',
    domain: 'Number and Operations in Base Ten',
    cluster: 'Perform operations with multi-digit whole numbers and with decimals to hundredths',
    description: 'add, subtract, multiply, and divide decimals to hundredths, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between operations',
  },

  // NUMBER AND OPERATIONS - FRACTIONS (NF)
  {
    notation: 'US.CC.5.MA.NF.1',
    domain: 'Number and Operations - Fractions',
    cluster: 'Use equivalent fractions as a strategy to add and subtract fractions',
    description: 'add and subtract fractions with unlike denominators (including mixed numbers) by replacing given fractions with equivalent fractions in such a way as to produce an equivalent sum or difference of fractions with like denominators',
  },
  {
    notation: 'US.CC.5.MA.NF.2',
    domain: 'Number and Operations - Fractions',
    cluster: 'Use equivalent fractions as a strategy to add and subtract fractions',
    description: 'solve word problems involving addition and subtraction of fractions referring to the same whole, including cases of unlike denominators; use benchmark fractions and number sense of fractions to estimate mentally and assess the reasonableness of answers',
  },
  {
    notation: 'US.CC.5.MA.NF.3',
    domain: 'Number and Operations - Fractions',
    cluster: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions',
    description: 'interpret a fraction as division of the numerator by the denominator (a/b = a / b); solve word problems involving division of whole numbers leading to answers in the form of fractions or mixed numbers',
  },
  {
    notation: 'US.CC.5.MA.NF.4',
    domain: 'Number and Operations - Fractions',
    cluster: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions',
    description: 'apply and extend previous understandings of multiplication to multiply a fraction or whole number by a fraction',
  },
  {
    notation: 'US.CC.5.MA.NF.5',
    domain: 'Number and Operations - Fractions',
    cluster: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions',
    description: 'interpret multiplication as scaling (resizing) by comparing the size of a product to the size of one factor on the basis of the size of the other factor, without performing the indicated multiplication',
  },
  {
    notation: 'US.CC.5.MA.NF.6',
    domain: 'Number and Operations - Fractions',
    cluster: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions',
    description: 'solve real world problems involving multiplication of fractions and mixed numbers',
  },
  {
    notation: 'US.CC.5.MA.NF.7',
    domain: 'Number and Operations - Fractions',
    cluster: 'Apply and extend previous understandings of multiplication and division to multiply and divide fractions',
    description: 'apply and extend previous understandings of division to divide unit fractions by whole numbers and whole numbers by unit fractions',
  },

  // MEASUREMENT AND DATA (MD)
  {
    notation: 'US.CC.5.MA.MD.1',
    domain: 'Measurement and Data',
    cluster: 'Convert like measurement units within a given measurement system',
    description: 'convert among different-sized standard measurement units within a given measurement system, and use these conversions in solving multi-step, real world problems',
  },
  {
    notation: 'US.CC.5.MA.MD.2',
    domain: 'Measurement and Data',
    cluster: 'Represent and interpret data',
    description: 'make a line plot to display a data set of measurements in fractions of a unit (1/2, 1/4, 1/8); use operations on fractions for this grade to solve problems involving information presented in line plots',
  },
  {
    notation: 'US.CC.5.MA.MD.3',
    domain: 'Measurement and Data',
    cluster: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition',
    description: 'recognize volume as an attribute of solid figures and understand concepts of volume measurement',
  },
  {
    notation: 'US.CC.5.MA.MD.4',
    domain: 'Measurement and Data',
    cluster: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition',
    description: 'measure volumes by counting unit cubes, using cubic cm, cubic in, cubic ft, and improvised units',
  },
  {
    notation: 'US.CC.5.MA.MD.5',
    domain: 'Measurement and Data',
    cluster: 'Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition',
    description: 'relate volume to the operations of multiplication and addition and solve real world and mathematical problems involving volume',
  },

  // GEOMETRY (G)
  {
    notation: 'US.CC.5.MA.G.1',
    domain: 'Geometry',
    cluster: 'Graph points on the coordinate plane to solve real-world and mathematical problems',
    description: 'use a pair of perpendicular number lines, called axes, to define a coordinate system, with the intersection of the lines (the origin) arranged to coincide with the 0 on each line and a given point in the plane located by using an ordered pair of numbers, called its coordinates',
  },
  {
    notation: 'US.CC.5.MA.G.2',
    domain: 'Geometry',
    cluster: 'Graph points on the coordinate plane to solve real-world and mathematical problems',
    description: 'represent real world and mathematical problems by graphing points in the first quadrant of the coordinate plane, and interpret coordinate values of points in the context of the situation',
  },
  {
    notation: 'US.CC.5.MA.G.3',
    domain: 'Geometry',
    cluster: 'Classify two-dimensional figures into categories based on their properties',
    description: 'understand that attributes belonging to a category of two-dimensional figures also belong to all subcategories of that category',
  },
  {
    notation: 'US.CC.5.MA.G.4',
    domain: 'Geometry',
    cluster: 'Classify two-dimensional figures into categories based on their properties',
    description: 'classify two-dimensional figures in a hierarchy based on properties',
  },
];

// =============================================================================
// GRADE 6 (Ages 11-12)
// =============================================================================

const grade6Standards: CommonCoreMathStandard[] = [
  // RATIOS AND PROPORTIONAL RELATIONSHIPS (RP)
  {
    notation: 'US.CC.6.MA.RP.1',
    domain: 'Ratios and Proportional Relationships',
    cluster: 'Understand ratio concepts and use ratio reasoning to solve problems',
    description: 'understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities',
  },
  {
    notation: 'US.CC.6.MA.RP.2',
    domain: 'Ratios and Proportional Relationships',
    cluster: 'Understand ratio concepts and use ratio reasoning to solve problems',
    description: 'understand the concept of a unit rate a/b associated with a ratio a:b with b not equal to 0, and use rate language in the context of a ratio relationship',
  },
  {
    notation: 'US.CC.6.MA.RP.3',
    domain: 'Ratios and Proportional Relationships',
    cluster: 'Understand ratio concepts and use ratio reasoning to solve problems',
    description: 'use ratio and rate reasoning to solve real-world and mathematical problems, by reasoning about tables of equivalent ratios, tape diagrams, double number line diagrams, or equations',
  },

  // THE NUMBER SYSTEM (NS)
  {
    notation: 'US.CC.6.MA.NS.1',
    domain: 'The Number System',
    cluster: 'Apply and extend previous understandings of multiplication and division to divide fractions by fractions',
    description: 'interpret and compute quotients of fractions, and solve word problems involving division of fractions by fractions',
  },
  {
    notation: 'US.CC.6.MA.NS.2',
    domain: 'The Number System',
    cluster: 'Compute fluently with multi-digit numbers and find common factors and multiples',
    description: 'fluently divide multi-digit numbers using the standard algorithm',
  },
  {
    notation: 'US.CC.6.MA.NS.3',
    domain: 'The Number System',
    cluster: 'Compute fluently with multi-digit numbers and find common factors and multiples',
    description: 'fluently add, subtract, multiply, and divide multi-digit decimals using the standard algorithm for each operation',
  },
  {
    notation: 'US.CC.6.MA.NS.4',
    domain: 'The Number System',
    cluster: 'Compute fluently with multi-digit numbers and find common factors and multiples',
    description: 'find the greatest common factor of two whole numbers less than or equal to 100 and the least common multiple of two whole numbers less than or equal to 12; use the distributive property to express a sum of two whole numbers 1-100 with a common factor as a multiple of a sum of two whole numbers with no common factor',
  },
  {
    notation: 'US.CC.6.MA.NS.5',
    domain: 'The Number System',
    cluster: 'Apply and extend previous understandings of numbers to the system of rational numbers',
    description: 'understand that positive and negative numbers are used together to describe quantities having opposite directions or values; use positive and negative numbers to represent quantities in real-world contexts, explaining the meaning of 0 in each situation',
  },
  {
    notation: 'US.CC.6.MA.NS.6',
    domain: 'The Number System',
    cluster: 'Apply and extend previous understandings of numbers to the system of rational numbers',
    description: 'understand a rational number as a point on the number line; extend number line diagrams and coordinate axes familiar from previous grades to represent points on the line and in the plane with negative number coordinates',
  },
  {
    notation: 'US.CC.6.MA.NS.7',
    domain: 'The Number System',
    cluster: 'Apply and extend previous understandings of numbers to the system of rational numbers',
    description: 'understand ordering and absolute value of rational numbers',
  },
  {
    notation: 'US.CC.6.MA.NS.8',
    domain: 'The Number System',
    cluster: 'Apply and extend previous understandings of numbers to the system of rational numbers',
    description: 'solve real-world and mathematical problems by graphing points in all four quadrants of the coordinate plane; include use of coordinates and absolute value to find distances between points with the same first coordinate or the same second coordinate',
  },

  // EXPRESSIONS AND EQUATIONS (EE)
  {
    notation: 'US.CC.6.MA.EE.1',
    domain: 'Expressions and Equations',
    cluster: 'Apply and extend previous understandings of arithmetic to algebraic expressions',
    description: 'write and evaluate numerical expressions involving whole-number exponents',
  },
  {
    notation: 'US.CC.6.MA.EE.2',
    domain: 'Expressions and Equations',
    cluster: 'Apply and extend previous understandings of arithmetic to algebraic expressions',
    description: 'write, read, and evaluate expressions in which letters stand for numbers',
  },
  {
    notation: 'US.CC.6.MA.EE.3',
    domain: 'Expressions and Equations',
    cluster: 'Apply and extend previous understandings of arithmetic to algebraic expressions',
    description: 'apply the properties of operations to generate equivalent expressions',
  },
  {
    notation: 'US.CC.6.MA.EE.4',
    domain: 'Expressions and Equations',
    cluster: 'Apply and extend previous understandings of arithmetic to algebraic expressions',
    description: 'identify when two expressions are equivalent',
  },
  {
    notation: 'US.CC.6.MA.EE.5',
    domain: 'Expressions and Equations',
    cluster: 'Reason about and solve one-variable equations and inequalities',
    description: 'understand solving an equation or inequality as a process of answering a question: which values from a specified set, if any, make the equation or inequality true; use substitution to determine whether a given number in a specified set makes an equation or inequality true',
  },
  {
    notation: 'US.CC.6.MA.EE.6',
    domain: 'Expressions and Equations',
    cluster: 'Reason about and solve one-variable equations and inequalities',
    description: 'use variables to represent numbers and write expressions when solving a real-world or mathematical problem; understand that a variable can represent an unknown number, or, depending on the purpose at hand, any number in a specified set',
  },
  {
    notation: 'US.CC.6.MA.EE.7',
    domain: 'Expressions and Equations',
    cluster: 'Reason about and solve one-variable equations and inequalities',
    description: 'solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers',
  },
  {
    notation: 'US.CC.6.MA.EE.8',
    domain: 'Expressions and Equations',
    cluster: 'Reason about and solve one-variable equations and inequalities',
    description: 'write an inequality of the form x > c or x < c to represent a constraint or condition in a real-world or mathematical problem; recognize that inequalities of the form x > c or x < c have infinitely many solutions; represent solutions of such inequalities on number line diagrams',
  },
  {
    notation: 'US.CC.6.MA.EE.9',
    domain: 'Expressions and Equations',
    cluster: 'Represent and analyze quantitative relationships between dependent and independent variables',
    description: 'use variables to represent two quantities in a real-world problem that change in relationship to one another; write an equation to express one quantity, thought of as the dependent variable, in terms of the other quantity, thought of as the independent variable; analyze the relationship between the dependent and independent variables using graphs and tables, and relate these to the equation',
  },

  // GEOMETRY (G)
  {
    notation: 'US.CC.6.MA.G.1',
    domain: 'Geometry',
    cluster: 'Solve real-world and mathematical problems involving area, surface area, and volume',
    description: 'find the area of right triangles, other triangles, special quadrilaterals, and polygons by composing into rectangles or decomposing into triangles and other shapes; apply these techniques in the context of solving real-world and mathematical problems',
  },
  {
    notation: 'US.CC.6.MA.G.2',
    domain: 'Geometry',
    cluster: 'Solve real-world and mathematical problems involving area, surface area, and volume',
    description: 'find the volume of a right rectangular prism with fractional edge lengths by packing it with unit cubes of the appropriate unit fraction edge lengths, and show that the volume is the same as would be found by multiplying the edge lengths of the prism; apply the formulas V = l w h and V = b h to find volumes of right rectangular prisms with fractional edge lengths in the context of solving real-world and mathematical problems',
  },
  {
    notation: 'US.CC.6.MA.G.3',
    domain: 'Geometry',
    cluster: 'Solve real-world and mathematical problems involving area, surface area, and volume',
    description: 'draw polygons in the coordinate plane given coordinates for the vertices; use coordinates to find the length of a side joining points with the same first coordinate or the same second coordinate; apply these techniques in the context of solving real-world and mathematical problems',
  },
  {
    notation: 'US.CC.6.MA.G.4',
    domain: 'Geometry',
    cluster: 'Solve real-world and mathematical problems involving area, surface area, and volume',
    description: 'represent three-dimensional figures using nets made up of rectangles and triangles, and use the nets to find the surface area of these figures; apply these techniques in the context of solving real-world and mathematical problems',
  },

  // STATISTICS AND PROBABILITY (SP)
  {
    notation: 'US.CC.6.MA.SP.1',
    domain: 'Statistics and Probability',
    cluster: 'Develop understanding of statistical variability',
    description: 'recognize a statistical question as one that anticipates variability in the data related to the question and accounts for it in the answers',
  },
  {
    notation: 'US.CC.6.MA.SP.2',
    domain: 'Statistics and Probability',
    cluster: 'Develop understanding of statistical variability',
    description: 'understand that a set of data collected to answer a statistical question has a distribution which can be described by its center, spread, and overall shape',
  },
  {
    notation: 'US.CC.6.MA.SP.3',
    domain: 'Statistics and Probability',
    cluster: 'Develop understanding of statistical variability',
    description: 'recognize that a measure of center for a numerical data set summarizes all of its values with a single number, while a measure of variation describes how its values vary with a single number',
  },
  {
    notation: 'US.CC.6.MA.SP.4',
    domain: 'Statistics and Probability',
    cluster: 'Summarize and describe distributions',
    description: 'display numerical data in plots on a number line, including dot plots, histograms, and box plots',
  },
  {
    notation: 'US.CC.6.MA.SP.5',
    domain: 'Statistics and Probability',
    cluster: 'Summarize and describe distributions',
    description: 'summarize numerical data sets in relation to their context by reporting the number of observations; describing the nature of the attribute under investigation; giving quantitative measures of center (median and/or mean) and variability (interquartile range and/or mean absolute deviation); and describing any overall pattern and any striking deviations from the overall pattern with reference to the context in which the data were gathered',
  },
];

// =============================================================================
// GRADE 7 (Ages 12-13)
// =============================================================================

const grade7Standards: CommonCoreMathStandard[] = [
  // RATIOS AND PROPORTIONAL RELATIONSHIPS (RP)
  {
    notation: 'US.CC.7.MA.RP.1',
    domain: 'Ratios and Proportional Relationships',
    cluster: 'Analyze proportional relationships and use them to solve real-world and mathematical problems',
    description: 'compute unit rates associated with ratios of fractions, including ratios of lengths, areas and other quantities measured in like or different units',
  },
  {
    notation: 'US.CC.7.MA.RP.2',
    domain: 'Ratios and Proportional Relationships',
    cluster: 'Analyze proportional relationships and use them to solve real-world and mathematical problems',
    description: 'recognize and represent proportional relationships between quantities',
  },
  {
    notation: 'US.CC.7.MA.RP.3',
    domain: 'Ratios and Proportional Relationships',
    cluster: 'Analyze proportional relationships and use them to solve real-world and mathematical problems',
    description: 'use proportional relationships to solve multistep ratio and percent problems, including simple interest, tax, markups and markdowns, gratuities and commissions, fees, percent increase and decrease, and percent error',
  },

  // THE NUMBER SYSTEM (NS)
  {
    notation: 'US.CC.7.MA.NS.1',
    domain: 'The Number System',
    cluster: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers',
    description: 'apply and extend previous understandings of addition and subtraction to add and subtract rational numbers; represent addition and subtraction on a horizontal or vertical number line diagram',
  },
  {
    notation: 'US.CC.7.MA.NS.2',
    domain: 'The Number System',
    cluster: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers',
    description: 'apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers',
  },
  {
    notation: 'US.CC.7.MA.NS.3',
    domain: 'The Number System',
    cluster: 'Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers',
    description: 'solve real-world and mathematical problems involving the four operations with rational numbers',
  },

  // EXPRESSIONS AND EQUATIONS (EE)
  {
    notation: 'US.CC.7.MA.EE.1',
    domain: 'Expressions and Equations',
    cluster: 'Use properties of operations to generate equivalent expressions',
    description: 'apply properties of operations as strategies to add, subtract, factor, and expand linear expressions with rational coefficients',
  },
  {
    notation: 'US.CC.7.MA.EE.2',
    domain: 'Expressions and Equations',
    cluster: 'Use properties of operations to generate equivalent expressions',
    description: 'understand that rewriting an expression in different forms in a problem context can shed light on the problem and how the quantities in it are related',
  },
  {
    notation: 'US.CC.7.MA.EE.3',
    domain: 'Expressions and Equations',
    cluster: 'Solve real-life and mathematical problems using numerical and algebraic expressions and equations',
    description: 'solve multi-step real-life and mathematical problems posed with positive and negative rational numbers in any form (whole numbers, fractions, and decimals), using tools strategically; apply properties of operations to calculate with numbers in any form; convert between forms as appropriate; and assess the reasonableness of answers using mental computation and estimation strategies',
  },
  {
    notation: 'US.CC.7.MA.EE.4',
    domain: 'Expressions and Equations',
    cluster: 'Solve real-life and mathematical problems using numerical and algebraic expressions and equations',
    description: 'use variables to represent quantities in a real-world or mathematical problem, and construct simple equations and inequalities to solve problems by reasoning about the quantities',
  },

  // GEOMETRY (G)
  {
    notation: 'US.CC.7.MA.G.1',
    domain: 'Geometry',
    cluster: 'Draw, construct, and describe geometrical figures and describe the relationships between them',
    description: 'solve problems involving scale drawings of geometric figures, including computing actual lengths and areas from a scale drawing and reproducing a scale drawing at a different scale',
  },
  {
    notation: 'US.CC.7.MA.G.2',
    domain: 'Geometry',
    cluster: 'Draw, construct, and describe geometrical figures and describe the relationships between them',
    description: 'draw (freehand, with ruler and protractor, and with technology) geometric shapes with given conditions; focus on constructing triangles from three measures of angles or sides, noticing when the conditions determine a unique triangle, more than one triangle, or no triangle',
  },
  {
    notation: 'US.CC.7.MA.G.3',
    domain: 'Geometry',
    cluster: 'Draw, construct, and describe geometrical figures and describe the relationships between them',
    description: 'describe the two-dimensional figures that result from slicing three-dimensional figures, as in plane sections of right rectangular prisms and right rectangular pyramids',
  },
  {
    notation: 'US.CC.7.MA.G.4',
    domain: 'Geometry',
    cluster: 'Solve real-life and mathematical problems involving angle measure, area, surface area, and volume',
    description: 'know the formulas for the area and circumference of a circle and use them to solve problems; give an informal derivation of the relationship between the circumference and area of a circle',
  },
  {
    notation: 'US.CC.7.MA.G.5',
    domain: 'Geometry',
    cluster: 'Solve real-life and mathematical problems involving angle measure, area, surface area, and volume',
    description: 'use facts about supplementary, complementary, vertical, and adjacent angles in a multi-step problem to write and solve simple equations for an unknown angle in a figure',
  },
  {
    notation: 'US.CC.7.MA.G.6',
    domain: 'Geometry',
    cluster: 'Solve real-life and mathematical problems involving angle measure, area, surface area, and volume',
    description: 'solve real-world and mathematical problems involving area, volume and surface area of two- and three-dimensional objects composed of triangles, quadrilaterals, polygons, cubes, and right prisms',
  },

  // STATISTICS AND PROBABILITY (SP)
  {
    notation: 'US.CC.7.MA.SP.1',
    domain: 'Statistics and Probability',
    cluster: 'Use random sampling to draw inferences about a population',
    description: 'understand that statistics can be used to gain information about a population by examining a sample of the population; generalizations about a population from a sample are valid only if the sample is representative of that population; understand that random sampling tends to produce representative samples and support valid inferences',
  },
  {
    notation: 'US.CC.7.MA.SP.2',
    domain: 'Statistics and Probability',
    cluster: 'Use random sampling to draw inferences about a population',
    description: 'use data from a random sample to draw inferences about a population with an unknown characteristic of interest; generate multiple samples (or simulated samples) of the same size to gauge the variation in estimates or predictions',
  },
  {
    notation: 'US.CC.7.MA.SP.3',
    domain: 'Statistics and Probability',
    cluster: 'Draw informal comparative inferences about two populations',
    description: 'informally assess the degree of visual overlap of two numerical data distributions with similar variabilities, measuring the difference between the centers by expressing it as a multiple of a measure of variability',
  },
  {
    notation: 'US.CC.7.MA.SP.4',
    domain: 'Statistics and Probability',
    cluster: 'Draw informal comparative inferences about two populations',
    description: 'use measures of center and measures of variability for numerical data from random samples to draw informal comparative inferences about two populations',
  },
  {
    notation: 'US.CC.7.MA.SP.5',
    domain: 'Statistics and Probability',
    cluster: 'Investigate chance processes and develop, use, and evaluate probability models',
    description: 'understand that the probability of a chance event is a number between 0 and 1 that expresses the likelihood of the event occurring; larger numbers indicate greater likelihood; a probability near 0 indicates an unlikely event, a probability around 1/2 indicates an event that is neither unlikely nor likely, and a probability near 1 indicates a likely event',
  },
  {
    notation: 'US.CC.7.MA.SP.6',
    domain: 'Statistics and Probability',
    cluster: 'Investigate chance processes and develop, use, and evaluate probability models',
    description: 'approximate the probability of a chance event by collecting data on the chance process that produces it and observing its long-run relative frequency, and predict the approximate relative frequency given the probability',
  },
  {
    notation: 'US.CC.7.MA.SP.7',
    domain: 'Statistics and Probability',
    cluster: 'Investigate chance processes and develop, use, and evaluate probability models',
    description: 'develop a probability model and use it to find probabilities of events; compare probabilities from a model to observed frequencies; if the agreement is not good, explain possible sources of the discrepancy',
  },
  {
    notation: 'US.CC.7.MA.SP.8',
    domain: 'Statistics and Probability',
    cluster: 'Investigate chance processes and develop, use, and evaluate probability models',
    description: 'find probabilities of compound events using organized lists, tables, tree diagrams, and simulation',
  },
];

// =============================================================================
// GRADE 8 (Ages 13-14)
// =============================================================================

const grade8Standards: CommonCoreMathStandard[] = [
  // THE NUMBER SYSTEM (NS)
  {
    notation: 'US.CC.8.MA.NS.1',
    domain: 'The Number System',
    cluster: 'Know that there are numbers that are not rational, and approximate them by rational numbers',
    description: 'know that numbers that are not rational are called irrational; understand informally that every number has a decimal expansion; for rational numbers show that the decimal expansion repeats eventually, and convert a decimal expansion which repeats eventually into a rational number',
  },
  {
    notation: 'US.CC.8.MA.NS.2',
    domain: 'The Number System',
    cluster: 'Know that there are numbers that are not rational, and approximate them by rational numbers',
    description: 'use rational approximations of irrational numbers to compare the size of irrational numbers, locate them approximately on a number line diagram, and estimate the value of expressions',
  },

  // EXPRESSIONS AND EQUATIONS (EE)
  {
    notation: 'US.CC.8.MA.EE.1',
    domain: 'Expressions and Equations',
    cluster: 'Work with radicals and integer exponents',
    description: 'know and apply the properties of integer exponents to generate equivalent numerical expressions',
  },
  {
    notation: 'US.CC.8.MA.EE.2',
    domain: 'Expressions and Equations',
    cluster: 'Work with radicals and integer exponents',
    description: 'use square root and cube root symbols to represent solutions to equations of the form x^2 = p and x^3 = p, where p is a positive rational number; evaluate square roots of small perfect squares and cube roots of small perfect cubes; know that the square root of 2 is irrational',
  },
  {
    notation: 'US.CC.8.MA.EE.3',
    domain: 'Expressions and Equations',
    cluster: 'Work with radicals and integer exponents',
    description: 'use numbers expressed in the form of a single digit times an integer power of 10 to estimate very large or very small quantities, and to express how many times as much one is than the other',
  },
  {
    notation: 'US.CC.8.MA.EE.4',
    domain: 'Expressions and Equations',
    cluster: 'Work with radicals and integer exponents',
    description: 'perform operations with numbers expressed in scientific notation, including problems where both decimal and scientific notation are used; use scientific notation and choose units of appropriate size for measurements of very large or very small quantities; interpret scientific notation that has been generated by technology',
  },
  {
    notation: 'US.CC.8.MA.EE.5',
    domain: 'Expressions and Equations',
    cluster: 'Understand the connections between proportional relationships, lines, and linear equations',
    description: 'graph proportional relationships, interpreting the unit rate as the slope of the graph; compare two different proportional relationships represented in different ways',
  },
  {
    notation: 'US.CC.8.MA.EE.6',
    domain: 'Expressions and Equations',
    cluster: 'Understand the connections between proportional relationships, lines, and linear equations',
    description: 'use similar triangles to explain why the slope m is the same between any two distinct points on a non-vertical line in the coordinate plane; derive the equation y = mx for a line through the origin and the equation y = mx + b for a line intercepting the vertical axis at b',
  },
  {
    notation: 'US.CC.8.MA.EE.7',
    domain: 'Expressions and Equations',
    cluster: 'Analyze and solve linear equations and pairs of simultaneous linear equations',
    description: 'solve linear equations in one variable, including equations with one solution, infinitely many solutions, or no solutions; give examples of linear equations in one variable with one solution, infinitely many solutions, or no solutions',
  },
  {
    notation: 'US.CC.8.MA.EE.8',
    domain: 'Expressions and Equations',
    cluster: 'Analyze and solve linear equations and pairs of simultaneous linear equations',
    description: 'analyze and solve pairs of simultaneous linear equations by graphing, substitution, and elimination; understand that solutions to a system of two linear equations in two variables correspond to points of intersection of their graphs, because points of intersection satisfy both equations simultaneously',
  },

  // FUNCTIONS (F)
  {
    notation: 'US.CC.8.MA.F.1',
    domain: 'Functions',
    cluster: 'Define, evaluate, and compare functions',
    description: 'understand that a function is a rule that assigns to each input exactly one output; the graph of a function is the set of ordered pairs consisting of an input and the corresponding output',
  },
  {
    notation: 'US.CC.8.MA.F.2',
    domain: 'Functions',
    cluster: 'Define, evaluate, and compare functions',
    description: 'compare properties of two functions each represented in a different way (algebraically, graphically, numerically in tables, or by verbal descriptions)',
  },
  {
    notation: 'US.CC.8.MA.F.3',
    domain: 'Functions',
    cluster: 'Define, evaluate, and compare functions',
    description: 'interpret the equation y = mx + b as defining a linear function, whose graph is a straight line; give examples of functions that are not linear',
  },
  {
    notation: 'US.CC.8.MA.F.4',
    domain: 'Functions',
    cluster: 'Use functions to model relationships between quantities',
    description: 'construct a function to model a linear relationship between two quantities; determine the rate of change and initial value of the function from a description of a relationship or from two (x, y) values, including reading these from a table or from a graph; interpret the rate of change and initial value of a linear function in terms of the situation it models, and in terms of its graph or a table of values',
  },
  {
    notation: 'US.CC.8.MA.F.5',
    domain: 'Functions',
    cluster: 'Use functions to model relationships between quantities',
    description: 'describe qualitatively the functional relationship between two quantities by analyzing a graph; sketch a graph that exhibits the qualitative features of a function that has been described verbally',
  },

  // GEOMETRY (G)
  {
    notation: 'US.CC.8.MA.G.1',
    domain: 'Geometry',
    cluster: 'Understand congruence and similarity using physical models, transparencies, or geometry software',
    description: 'verify experimentally the properties of rotations, reflections, and translations: lines are taken to lines, and line segments to line segments of the same length; angles are taken to angles of the same measure; parallel lines are taken to parallel lines',
  },
  {
    notation: 'US.CC.8.MA.G.2',
    domain: 'Geometry',
    cluster: 'Understand congruence and similarity using physical models, transparencies, or geometry software',
    description: 'understand that a two-dimensional figure is congruent to another if the second can be obtained from the first by a sequence of rotations, reflections, and translations; given two congruent figures, describe a sequence that exhibits the congruence between them',
  },
  {
    notation: 'US.CC.8.MA.G.3',
    domain: 'Geometry',
    cluster: 'Understand congruence and similarity using physical models, transparencies, or geometry software',
    description: 'describe the effect of dilations, translations, rotations, and reflections on two-dimensional figures using coordinates',
  },
  {
    notation: 'US.CC.8.MA.G.4',
    domain: 'Geometry',
    cluster: 'Understand congruence and similarity using physical models, transparencies, or geometry software',
    description: 'understand that a two-dimensional figure is similar to another if the second can be obtained from the first by a sequence of rotations, reflections, translations, and dilations; given two similar two-dimensional figures, describe a sequence that exhibits the similarity between them',
  },
  {
    notation: 'US.CC.8.MA.G.5',
    domain: 'Geometry',
    cluster: 'Understand congruence and similarity using physical models, transparencies, or geometry software',
    description: 'use informal arguments to establish facts about the angle sum and exterior angle of triangles, about the angles created when parallel lines are cut by a transversal, and the angle-angle criterion for similarity of triangles',
  },
  {
    notation: 'US.CC.8.MA.G.6',
    domain: 'Geometry',
    cluster: 'Understand and apply the Pythagorean Theorem',
    description: 'explain a proof of the Pythagorean Theorem and its converse',
  },
  {
    notation: 'US.CC.8.MA.G.7',
    domain: 'Geometry',
    cluster: 'Understand and apply the Pythagorean Theorem',
    description: 'apply the Pythagorean Theorem to determine unknown side lengths in right triangles in real-world and mathematical problems in two and three dimensions',
  },
  {
    notation: 'US.CC.8.MA.G.8',
    domain: 'Geometry',
    cluster: 'Understand and apply the Pythagorean Theorem',
    description: 'apply the Pythagorean Theorem to find the distance between two points in a coordinate system',
  },
  {
    notation: 'US.CC.8.MA.G.9',
    domain: 'Geometry',
    cluster: 'Solve real-world and mathematical problems involving volume of cylinders, cones, and spheres',
    description: 'know the formulas for the volumes of cones, cylinders, and spheres and use them to solve real-world and mathematical problems',
  },

  // STATISTICS AND PROBABILITY (SP)
  {
    notation: 'US.CC.8.MA.SP.1',
    domain: 'Statistics and Probability',
    cluster: 'Investigate patterns of association in bivariate data',
    description: 'construct and interpret scatter plots for bivariate measurement data to investigate patterns of association between two quantities; describe patterns such as clustering, outliers, positive or negative association, linear association, and nonlinear association',
  },
  {
    notation: 'US.CC.8.MA.SP.2',
    domain: 'Statistics and Probability',
    cluster: 'Investigate patterns of association in bivariate data',
    description: 'know that straight lines are widely used to model relationships between two quantitative variables; for scatter plots that suggest a linear association, informally fit a straight line, and informally assess the model fit by judging the closeness of the data points to the line',
  },
  {
    notation: 'US.CC.8.MA.SP.3',
    domain: 'Statistics and Probability',
    cluster: 'Investigate patterns of association in bivariate data',
    description: 'use the equation of a linear model to solve problems in the context of bivariate measurement data, interpreting the slope and intercept',
  },
  {
    notation: 'US.CC.8.MA.SP.4',
    domain: 'Statistics and Probability',
    cluster: 'Investigate patterns of association in bivariate data',
    description: 'understand that patterns of association can also be seen in bivariate categorical data by displaying frequencies and relative frequencies in a two-way table; construct and interpret a two-way table summarizing data on two categorical variables collected from the same subjects; use relative frequencies calculated for rows or columns to describe possible association between the two variables',
  },
];

// =============================================================================
// GRADE 9 (Ages 14-15) - Algebra I Focus
// High School Common Core standards mapped to typical Algebra I course
// =============================================================================

const grade9Standards: CommonCoreMathStandard[] = [
  // NUMBER AND QUANTITY - The Real Number System (N-RN)
  {
    notation: 'US.CC.9.MA.NRN.1',
    domain: 'Number and Quantity',
    cluster: 'Extend the properties of exponents to rational exponents',
    description: 'explain how the definition of the meaning of rational exponents follows from extending the properties of integer exponents to those values, allowing for a notation for radicals in terms of rational exponents',
  },
  {
    notation: 'US.CC.9.MA.NRN.2',
    domain: 'Number and Quantity',
    cluster: 'Extend the properties of exponents to rational exponents',
    description: 'rewrite expressions involving radicals and rational exponents using the properties of exponents',
  },
  {
    notation: 'US.CC.9.MA.NRN.3',
    domain: 'Number and Quantity',
    cluster: 'Use properties of rational and irrational numbers',
    description: 'explain why the sum or product of two rational numbers is rational; that the sum of a rational number and an irrational number is irrational; and that the product of a nonzero rational number and an irrational number is irrational',
  },

  // NUMBER AND QUANTITY - Quantities (N-Q)
  {
    notation: 'US.CC.9.MA.NQ.1',
    domain: 'Number and Quantity',
    cluster: 'Reason quantitatively and use units to solve problems',
    description: 'use units as a way to understand problems and to guide the solution of multi-step problems; choose and interpret units consistently in formulas; choose and interpret the scale and the origin in graphs and data displays',
  },
  {
    notation: 'US.CC.9.MA.NQ.2',
    domain: 'Number and Quantity',
    cluster: 'Reason quantitatively and use units to solve problems',
    description: 'define appropriate quantities for the purpose of descriptive modeling',
  },
  {
    notation: 'US.CC.9.MA.NQ.3',
    domain: 'Number and Quantity',
    cluster: 'Reason quantitatively and use units to solve problems',
    description: 'choose a level of accuracy appropriate to limitations on measurement when reporting quantities',
  },

  // ALGEBRA - Seeing Structure in Expressions (A-SSE)
  {
    notation: 'US.CC.9.MA.ASSE.1a',
    domain: 'Algebra',
    cluster: 'Interpret the structure of expressions',
    description: 'interpret parts of an expression, such as terms, factors, and coefficients',
  },
  {
    notation: 'US.CC.9.MA.ASSE.1b',
    domain: 'Algebra',
    cluster: 'Interpret the structure of expressions',
    description: 'interpret complicated expressions by viewing one or more of their parts as a single entity',
  },
  {
    notation: 'US.CC.9.MA.ASSE.2',
    domain: 'Algebra',
    cluster: 'Interpret the structure of expressions',
    description: 'use the structure of an expression to identify ways to rewrite it',
  },
  {
    notation: 'US.CC.9.MA.ASSE.3a',
    domain: 'Algebra',
    cluster: 'Write expressions in equivalent forms to solve problems',
    description: 'factor a quadratic expression to reveal the zeros of the function it defines',
  },
  {
    notation: 'US.CC.9.MA.ASSE.3b',
    domain: 'Algebra',
    cluster: 'Write expressions in equivalent forms to solve problems',
    description: 'complete the square in a quadratic expression to reveal the maximum or minimum value of the function it defines',
  },
  {
    notation: 'US.CC.9.MA.ASSE.3c',
    domain: 'Algebra',
    cluster: 'Write expressions in equivalent forms to solve problems',
    description: 'use the properties of exponents to transform expressions for exponential functions',
  },

  // ALGEBRA - Arithmetic with Polynomials (A-APR)
  {
    notation: 'US.CC.9.MA.AAPR.1',
    domain: 'Algebra',
    cluster: 'Perform arithmetic operations on polynomials',
    description: 'understand that polynomials form a system analogous to the integers, namely, they are closed under the operations of addition, subtraction, and multiplication; add, subtract, and multiply polynomials',
  },

  // ALGEBRA - Creating Equations (A-CED)
  {
    notation: 'US.CC.9.MA.ACED.1',
    domain: 'Algebra',
    cluster: 'Create equations that describe numbers or relationships',
    description: 'create equations and inequalities in one variable and use them to solve problems',
  },
  {
    notation: 'US.CC.9.MA.ACED.2',
    domain: 'Algebra',
    cluster: 'Create equations that describe numbers or relationships',
    description: 'create equations in two or more variables to represent relationships between quantities; graph equations on coordinate axes with labels and scales',
  },
  {
    notation: 'US.CC.9.MA.ACED.3',
    domain: 'Algebra',
    cluster: 'Create equations that describe numbers or relationships',
    description: 'represent constraints by equations or inequalities, and by systems of equations and/or inequalities, and interpret solutions as viable or nonviable options in a modeling context',
  },
  {
    notation: 'US.CC.9.MA.ACED.4',
    domain: 'Algebra',
    cluster: 'Create equations that describe numbers or relationships',
    description: 'rearrange formulas to highlight a quantity of interest, using the same reasoning as in solving equations',
  },

  // ALGEBRA - Reasoning with Equations and Inequalities (A-REI)
  {
    notation: 'US.CC.9.MA.AREI.1',
    domain: 'Algebra',
    cluster: 'Understand solving equations as a process of reasoning',
    description: 'explain each step in solving a simple equation as following from the equality of numbers asserted at the previous step, starting from the assumption that the original equation has a solution; construct a viable argument to justify a solution method',
  },
  {
    notation: 'US.CC.9.MA.AREI.3',
    domain: 'Algebra',
    cluster: 'Solve equations and inequalities in one variable',
    description: 'solve linear equations and inequalities in one variable, including equations with coefficients represented by letters',
  },
  {
    notation: 'US.CC.9.MA.AREI.4a',
    domain: 'Algebra',
    cluster: 'Solve equations and inequalities in one variable',
    description: 'use the method of completing the square to transform any quadratic equation in x into an equation of the form (x - p)² = q that has the same solutions; derive the quadratic formula from this form',
  },
  {
    notation: 'US.CC.9.MA.AREI.4b',
    domain: 'Algebra',
    cluster: 'Solve equations and inequalities in one variable',
    description: 'solve quadratic equations by inspection, taking square roots, completing the square, the quadratic formula and factoring, as appropriate to the initial form of the equation; recognize when the quadratic formula gives complex solutions',
  },
  {
    notation: 'US.CC.9.MA.AREI.5',
    domain: 'Algebra',
    cluster: 'Solve systems of equations',
    description: 'prove that, given a system of two equations in two variables, replacing one equation by the sum of that equation and a multiple of the other produces a system with the same solutions',
  },
  {
    notation: 'US.CC.9.MA.AREI.6',
    domain: 'Algebra',
    cluster: 'Solve systems of equations',
    description: 'solve systems of linear equations exactly and approximately, focusing on pairs of linear equations in two variables',
  },
  {
    notation: 'US.CC.9.MA.AREI.10',
    domain: 'Algebra',
    cluster: 'Represent and solve equations and inequalities graphically',
    description: 'understand that the graph of an equation in two variables is the set of all its solutions plotted in the coordinate plane, often forming a curve',
  },
  {
    notation: 'US.CC.9.MA.AREI.11',
    domain: 'Algebra',
    cluster: 'Represent and solve equations and inequalities graphically',
    description: 'explain why the x-coordinates of the points where the graphs of the equations y = f(x) and y = g(x) intersect are the solutions of the equation f(x) = g(x); find the solutions approximately using technology to graph the functions',
  },
  {
    notation: 'US.CC.9.MA.AREI.12',
    domain: 'Algebra',
    cluster: 'Represent and solve equations and inequalities graphically',
    description: 'graph the solutions to a linear inequality in two variables as a half-plane, and graph the solution set to a system of linear inequalities in two variables as the intersection of the corresponding half-planes',
  },

  // FUNCTIONS - Interpreting Functions (F-IF)
  {
    notation: 'US.CC.9.MA.FIF.1a',
    domain: 'Functions',
    cluster: 'Understand the concept of a function',
    description: 'understand that a function from one set to another set assigns to each element of the domain exactly one element of the range',
  },
  {
    notation: 'US.CC.9.MA.FIF.1b',
    domain: 'Functions',
    cluster: 'Understand the concept of a function',
    description: 'use function notation, evaluate functions for inputs in their domains, and interpret statements that use function notation in terms of a context',
  },
  {
    notation: 'US.CC.9.MA.FIF.1c',
    domain: 'Functions',
    cluster: 'Understand the concept of a function',
    description: 'recognize that sequences are functions, sometimes defined recursively, whose domain is a subset of the integers',
  },
  {
    notation: 'US.CC.9.MA.FIF.2',
    domain: 'Functions',
    cluster: 'Understand the concept of a function',
    description: 'use function notation, evaluate functions for inputs in their domains, and interpret statements that use function notation in terms of a context',
  },
  {
    notation: 'US.CC.9.MA.FIF.3',
    domain: 'Functions',
    cluster: 'Understand the concept of a function',
    description: 'recognize that sequences are functions, sometimes defined recursively, whose domain is a subset of the integers',
  },
  {
    notation: 'US.CC.9.MA.FIF.4',
    domain: 'Functions',
    cluster: 'Interpret functions that arise in applications',
    description: 'for a function that models a relationship between two quantities, interpret key features of graphs and tables in terms of the quantities, and sketch graphs showing key features given a verbal description of the relationship',
  },
  {
    notation: 'US.CC.9.MA.FIF.5',
    domain: 'Functions',
    cluster: 'Interpret functions that arise in applications',
    description: 'relate the domain of a function to its graph and, where applicable, to the quantitative relationship it describes',
  },
  {
    notation: 'US.CC.9.MA.FIF.6',
    domain: 'Functions',
    cluster: 'Interpret functions that arise in applications',
    description: 'calculate and interpret the average rate of change of a function presented symbolically or as a table, over a specified interval; estimate the rate of change from a graph',
  },
  {
    notation: 'US.CC.9.MA.FIF.7a',
    domain: 'Functions',
    cluster: 'Analyze functions using different representations',
    description: 'graph linear and quadratic functions and show intercepts, maxima, and minima',
  },
  {
    notation: 'US.CC.9.MA.FIF.7b',
    domain: 'Functions',
    cluster: 'Analyze functions using different representations',
    description: 'graph square root, cube root, and piecewise-defined functions, including step functions and absolute value functions',
  },
  {
    notation: 'US.CC.9.MA.FIF.8a',
    domain: 'Functions',
    cluster: 'Analyze functions using different representations',
    description: 'use the process of factoring and completing the square in a quadratic function to show zeros, extreme values, and symmetry of the graph',
  },
  {
    notation: 'US.CC.9.MA.FIF.9',
    domain: 'Functions',
    cluster: 'Analyze functions using different representations',
    description: 'compare properties of two functions each represented in a different way (algebraically, graphically, numerically in tables, or by verbal descriptions)',
  },

  // FUNCTIONS - Building Functions (F-BF)
  {
    notation: 'US.CC.9.MA.FBF.1a',
    domain: 'Functions',
    cluster: 'Build a function that models a relationship',
    description: 'determine an explicit expression, a recursive process, or steps for calculation from a context',
  },
  {
    notation: 'US.CC.9.MA.FBF.1b',
    domain: 'Functions',
    cluster: 'Build a function that models a relationship',
    description: 'combine standard function types using arithmetic operations',
  },
  {
    notation: 'US.CC.9.MA.FBF.2',
    domain: 'Functions',
    cluster: 'Build a function that models a relationship',
    description: 'write arithmetic and geometric sequences both recursively and with an explicit formula, use them to model situations, and translate between the two forms',
  },
  {
    notation: 'US.CC.9.MA.FBF.3',
    domain: 'Functions',
    cluster: 'Build new functions from existing functions',
    description: 'identify the effect on the graph of replacing f(x) by f(x) + k, k f(x), f(kx), and f(x + k) for specific values of k; find the value of k given the graphs; experiment using technology',
  },

  // FUNCTIONS - Linear, Quadratic, and Exponential Models (F-LE)
  {
    notation: 'US.CC.9.MA.FLE.1a',
    domain: 'Functions',
    cluster: 'Construct and compare linear and exponential models',
    description: 'prove that linear functions grow by equal differences over equal intervals, and that exponential functions grow by equal factors over equal intervals',
  },
  {
    notation: 'US.CC.9.MA.FLE.1b',
    domain: 'Functions',
    cluster: 'Construct and compare linear and exponential models',
    description: 'recognize situations in which one quantity changes at a constant rate per unit interval relative to another',
  },
  {
    notation: 'US.CC.9.MA.FLE.1c',
    domain: 'Functions',
    cluster: 'Construct and compare linear and exponential models',
    description: 'recognize situations in which a quantity grows or decays by a constant percent rate per unit interval relative to another',
  },
  {
    notation: 'US.CC.9.MA.FLE.2',
    domain: 'Functions',
    cluster: 'Construct and compare linear and exponential models',
    description: 'construct linear and exponential functions, including arithmetic and geometric sequences, given a graph, a description of a relationship, or two input-output pairs',
  },
  {
    notation: 'US.CC.9.MA.FLE.3',
    domain: 'Functions',
    cluster: 'Construct and compare linear and exponential models',
    description: 'observe using graphs and tables that a quantity increasing exponentially eventually exceeds a quantity increasing linearly, quadratically, or more generally as a polynomial function',
  },
  {
    notation: 'US.CC.9.MA.FLE.5',
    domain: 'Functions',
    cluster: 'Interpret expressions for functions',
    description: 'interpret the parameters in a linear or exponential function in terms of a context',
  },

  // STATISTICS AND PROBABILITY - Interpreting Categorical and Quantitative Data (S-ID)
  {
    notation: 'US.CC.9.MA.SID.1',
    domain: 'Statistics and Probability',
    cluster: 'Summarize, represent, and interpret data on a single count or measurement variable',
    description: 'represent data with plots on the real number line (dot plots, histograms, and box plots)',
  },
  {
    notation: 'US.CC.9.MA.SID.2',
    domain: 'Statistics and Probability',
    cluster: 'Summarize, represent, and interpret data on a single count or measurement variable',
    description: 'use statistics appropriate to the shape of the data distribution to compare center (median, mean) and spread (interquartile range, standard deviation) of two or more different data sets',
  },
  {
    notation: 'US.CC.9.MA.SID.3',
    domain: 'Statistics and Probability',
    cluster: 'Summarize, represent, and interpret data on a single count or measurement variable',
    description: 'interpret differences in shape, center, and spread in the context of the data sets, accounting for possible effects of extreme data points (outliers)',
  },
  {
    notation: 'US.CC.9.MA.SID.5',
    domain: 'Statistics and Probability',
    cluster: 'Summarize, represent, and interpret data on two categorical and quantitative variables',
    description: 'summarize categorical data for two categories in two-way frequency tables; interpret relative frequencies in the context of the data; recognize possible associations and trends in the data',
  },
  {
    notation: 'US.CC.9.MA.SID.6',
    domain: 'Statistics and Probability',
    cluster: 'Summarize, represent, and interpret data on two categorical and quantitative variables',
    description: 'represent data on two quantitative variables on a scatter plot, and describe how the variables are related',
  },
  {
    notation: 'US.CC.9.MA.SID.7',
    domain: 'Statistics and Probability',
    cluster: 'Interpret linear models',
    description: 'interpret the slope (rate of change) and the intercept (constant term) of a linear model in the context of the data',
  },
  {
    notation: 'US.CC.9.MA.SID.8',
    domain: 'Statistics and Probability',
    cluster: 'Interpret linear models',
    description: 'compute (using technology) and interpret the correlation coefficient of a linear fit',
  },
  {
    notation: 'US.CC.9.MA.SID.9',
    domain: 'Statistics and Probability',
    cluster: 'Interpret linear models',
    description: 'distinguish between correlation and causation',
  },
];

// =============================================================================
// GRADE 10 (Ages 15-16) - Geometry Focus
// High School Common Core standards mapped to typical Geometry course
// =============================================================================

const grade10Standards: CommonCoreMathStandard[] = [
  // GEOMETRY - Congruence (G-CO)
  {
    notation: 'US.CC.10.MA.GCO.1',
    domain: 'Geometry',
    cluster: 'Experiment with transformations in the plane',
    description: 'know precise definitions of angle, circle, perpendicular line, parallel line, and line segment, based on the undefined notions of point, line, distance along a line, and distance around a circular arc',
  },
  {
    notation: 'US.CC.10.MA.GCO.2',
    domain: 'Geometry',
    cluster: 'Experiment with transformations in the plane',
    description: 'represent transformations in the plane using transparencies and geometry software; describe transformations as functions that take points in the plane as inputs and give other points as outputs',
  },
  {
    notation: 'US.CC.10.MA.GCO.3',
    domain: 'Geometry',
    cluster: 'Experiment with transformations in the plane',
    description: 'given a rectangle, parallelogram, trapezoid, or regular polygon, describe the rotations and reflections that carry it onto itself',
  },
  {
    notation: 'US.CC.10.MA.GCO.4',
    domain: 'Geometry',
    cluster: 'Experiment with transformations in the plane',
    description: 'develop definitions of rotations, reflections, and translations in terms of angles, circles, perpendicular lines, parallel lines, and line segments',
  },
  {
    notation: 'US.CC.10.MA.GCO.5',
    domain: 'Geometry',
    cluster: 'Experiment with transformations in the plane',
    description: 'given a geometric figure and a rotation, reflection, or translation, draw the transformed figure using graph paper, tracing paper, or geometry software; specify a sequence of transformations that will carry a given figure onto another',
  },
  {
    notation: 'US.CC.10.MA.GCO.6',
    domain: 'Geometry',
    cluster: 'Understand congruence in terms of rigid motions',
    description: 'use geometric descriptions of rigid motions to transform figures and to predict the effect of a given rigid motion on a given figure; given two figures, use the definition of congruence in terms of rigid motions to decide if they are congruent',
  },
  {
    notation: 'US.CC.10.MA.GCO.7',
    domain: 'Geometry',
    cluster: 'Understand congruence in terms of rigid motions',
    description: 'use the definition of congruence in terms of rigid motions to show that two triangles are congruent if and only if corresponding pairs of sides and corresponding pairs of angles are congruent',
  },
  {
    notation: 'US.CC.10.MA.GCO.8',
    domain: 'Geometry',
    cluster: 'Understand congruence in terms of rigid motions',
    description: 'explain how the criteria for triangle congruence (ASA, SAS, and SSS) follow from the definition of congruence in terms of rigid motions',
  },
  {
    notation: 'US.CC.10.MA.GCO.9',
    domain: 'Geometry',
    cluster: 'Prove geometric theorems',
    description: 'prove theorems about lines and angles (vertical angles are congruent; when a transversal crosses parallel lines, alternate interior angles are congruent and corresponding angles are congruent)',
  },
  {
    notation: 'US.CC.10.MA.GCO.10',
    domain: 'Geometry',
    cluster: 'Prove geometric theorems',
    description: 'prove theorems about triangles (measures of interior angles of a triangle sum to 180°; base angles of isosceles triangles are congruent; the segment joining midpoints of two sides of a triangle is parallel to the third side and half the length)',
  },
  {
    notation: 'US.CC.10.MA.GCO.11',
    domain: 'Geometry',
    cluster: 'Prove geometric theorems',
    description: 'prove theorems about parallelograms (opposite sides are congruent, opposite angles are congruent, the diagonals of a parallelogram bisect each other)',
  },
  {
    notation: 'US.CC.10.MA.GCO.12',
    domain: 'Geometry',
    cluster: 'Make geometric constructions',
    description: 'make formal geometric constructions with a variety of tools and methods (compass and straightedge, string, reflective devices, paper folding, dynamic geometric software)',
  },
  {
    notation: 'US.CC.10.MA.GCO.13',
    domain: 'Geometry',
    cluster: 'Make geometric constructions',
    description: 'construct an equilateral triangle, a square, and a regular hexagon inscribed in a circle',
  },

  // GEOMETRY - Similarity, Right Triangles, and Trigonometry (G-SRT)
  {
    notation: 'US.CC.10.MA.GSRT.1a',
    domain: 'Geometry',
    cluster: 'Understand similarity in terms of similarity transformations',
    description: 'verify experimentally the properties of dilations given by a center and a scale factor: a dilation takes a line not passing through the center of the dilation to a parallel line, and leaves a line passing through the center unchanged',
  },
  {
    notation: 'US.CC.10.MA.GSRT.1b',
    domain: 'Geometry',
    cluster: 'Understand similarity in terms of similarity transformations',
    description: 'verify experimentally the properties of dilations given by a center and a scale factor: the dilation of a line segment is longer or shorter in the ratio given by the scale factor',
  },
  {
    notation: 'US.CC.10.MA.GSRT.2',
    domain: 'Geometry',
    cluster: 'Understand similarity in terms of similarity transformations',
    description: 'given two figures, use the definition of similarity in terms of similarity transformations to decide if they are similar; explain using similarity transformations the meaning of similarity for triangles as the equality of all corresponding pairs of angles and the proportionality of all corresponding pairs of sides',
  },
  {
    notation: 'US.CC.10.MA.GSRT.3',
    domain: 'Geometry',
    cluster: 'Understand similarity in terms of similarity transformations',
    description: 'use the properties of similarity transformations to establish the AA criterion for two triangles to be similar',
  },
  {
    notation: 'US.CC.10.MA.GSRT.4',
    domain: 'Geometry',
    cluster: 'Prove theorems involving similarity',
    description: 'prove theorems about triangles (a line parallel to one side of a triangle divides the other two proportionally; the Pythagorean Theorem proved using triangle similarity)',
  },
  {
    notation: 'US.CC.10.MA.GSRT.5',
    domain: 'Geometry',
    cluster: 'Prove theorems involving similarity',
    description: 'use congruence and similarity criteria for triangles to solve problems and to prove relationships in geometric figures',
  },
  {
    notation: 'US.CC.10.MA.GSRT.6',
    domain: 'Geometry',
    cluster: 'Define trigonometric ratios and solve problems involving right triangles',
    description: 'understand that by similarity, side ratios in right triangles are properties of the angles in the triangle, leading to definitions of trigonometric ratios for acute angles',
  },
  {
    notation: 'US.CC.10.MA.GSRT.7',
    domain: 'Geometry',
    cluster: 'Define trigonometric ratios and solve problems involving right triangles',
    description: 'explain and use the relationship between the sine and cosine of complementary angles',
  },
  {
    notation: 'US.CC.10.MA.GSRT.8',
    domain: 'Geometry',
    cluster: 'Define trigonometric ratios and solve problems involving right triangles',
    description: 'use trigonometric ratios and the Pythagorean Theorem to solve right triangles in applied problems',
  },

  // GEOMETRY - Circles (G-C)
  {
    notation: 'US.CC.10.MA.GC.1',
    domain: 'Geometry',
    cluster: 'Understand and apply theorems about circles',
    description: 'prove that all circles are similar',
  },
  {
    notation: 'US.CC.10.MA.GC.2',
    domain: 'Geometry',
    cluster: 'Understand and apply theorems about circles',
    description: 'identify and describe relationships among inscribed angles, radii, and chords (the relationship between central, inscribed, and circumscribed angles; inscribed angles on a diameter are right angles)',
  },
  {
    notation: 'US.CC.10.MA.GC.3',
    domain: 'Geometry',
    cluster: 'Understand and apply theorems about circles',
    description: 'construct the inscribed and circumscribed circles of a triangle, and prove properties of angles for a quadrilateral inscribed in a circle',
  },
  {
    notation: 'US.CC.10.MA.GC.5',
    domain: 'Geometry',
    cluster: 'Find arc lengths and areas of sectors of circles',
    description: 'derive using similarity the fact that the length of the arc intercepted by an angle is proportional to the radius, and define the radian measure of the angle as the constant of proportionality; derive the formula for the area of a sector',
  },

  // GEOMETRY - Expressing Geometric Properties with Equations (G-GPE)
  {
    notation: 'US.CC.10.MA.GGPE.1',
    domain: 'Geometry',
    cluster: 'Translate between the geometric description and the equation for a conic section',
    description: 'derive the equation of a circle of given center and radius using the Pythagorean Theorem; complete the square to find the center and radius of a circle given by an equation',
  },
  {
    notation: 'US.CC.10.MA.GGPE.2',
    domain: 'Geometry',
    cluster: 'Translate between the geometric description and the equation for a conic section',
    description: 'derive the equation of a parabola given a focus and directrix',
  },
  {
    notation: 'US.CC.10.MA.GGPE.4',
    domain: 'Geometry',
    cluster: 'Use coordinates to prove simple geometric theorems algebraically',
    description: 'use coordinates to prove simple geometric theorems algebraically',
  },
  {
    notation: 'US.CC.10.MA.GGPE.5',
    domain: 'Geometry',
    cluster: 'Use coordinates to prove simple geometric theorems algebraically',
    description: 'prove the slope criteria for parallel and perpendicular lines and use them to solve geometric problems',
  },
  {
    notation: 'US.CC.10.MA.GGPE.6',
    domain: 'Geometry',
    cluster: 'Use coordinates to prove simple geometric theorems algebraically',
    description: 'find the point on a directed line segment between two given points that partitions the segment in a given ratio',
  },
  {
    notation: 'US.CC.10.MA.GGPE.7',
    domain: 'Geometry',
    cluster: 'Use coordinates to prove simple geometric theorems algebraically',
    description: 'use coordinates to compute perimeters of polygons and areas of triangles and rectangles',
  },

  // GEOMETRY - Geometric Measurement and Dimension (G-GMD)
  {
    notation: 'US.CC.10.MA.GGMD.1',
    domain: 'Geometry',
    cluster: 'Explain volume formulas and use them to solve problems',
    description: 'give an informal argument for the formulas for the circumference of a circle, area of a circle, volume of a cylinder, pyramid, and cone',
  },
  {
    notation: 'US.CC.10.MA.GGMD.3',
    domain: 'Geometry',
    cluster: 'Explain volume formulas and use them to solve problems',
    description: 'use volume formulas for cylinders, pyramids, cones, and spheres to solve problems',
  },
  {
    notation: 'US.CC.10.MA.GGMD.4',
    domain: 'Geometry',
    cluster: 'Visualize relationships between two-dimensional and three-dimensional objects',
    description: 'identify the shapes of two-dimensional cross-sections of three-dimensional objects, and identify three-dimensional objects generated by rotations of two-dimensional objects',
  },

  // GEOMETRY - Modeling with Geometry (G-MG)
  {
    notation: 'US.CC.10.MA.GMG.1',
    domain: 'Geometry',
    cluster: 'Apply geometric concepts in modeling situations',
    description: 'use geometric shapes, their measures, and their properties to describe objects',
  },
  {
    notation: 'US.CC.10.MA.GMG.2',
    domain: 'Geometry',
    cluster: 'Apply geometric concepts in modeling situations',
    description: 'apply concepts of density based on area and volume in modeling situations',
  },
  {
    notation: 'US.CC.10.MA.GMG.3',
    domain: 'Geometry',
    cluster: 'Apply geometric concepts in modeling situations',
    description: 'apply geometric methods to solve design problems',
  },
];

// =============================================================================
// GRADE 11 (Ages 16-17) - Algebra II Focus
// High School Common Core standards mapped to typical Algebra II course
// =============================================================================

const grade11Standards: CommonCoreMathStandard[] = [
  // NUMBER AND QUANTITY - The Complex Number System (N-CN)
  {
    notation: 'US.CC.11.MA.NCN.1',
    domain: 'Number and Quantity',
    cluster: 'Perform arithmetic operations with complex numbers',
    description: 'know there is a complex number i such that i² = -1, and every complex number has the form a + bi with a and b real',
  },
  {
    notation: 'US.CC.11.MA.NCN.2',
    domain: 'Number and Quantity',
    cluster: 'Perform arithmetic operations with complex numbers',
    description: 'use the relation i² = -1 and the commutative, associative, and distributive properties to add, subtract, and multiply complex numbers',
  },
  {
    notation: 'US.CC.11.MA.NCN.3',
    domain: 'Number and Quantity',
    cluster: 'Perform arithmetic operations with complex numbers',
    description: 'find the conjugate of a complex number; use conjugates to find moduli and quotients of complex numbers',
  },
  {
    notation: 'US.CC.11.MA.NCN.7',
    domain: 'Number and Quantity',
    cluster: 'Use complex numbers in polynomial identities and equations',
    description: 'solve quadratic equations with real coefficients that have complex solutions',
  },
  {
    notation: 'US.CC.11.MA.NCN.8',
    domain: 'Number and Quantity',
    cluster: 'Use complex numbers in polynomial identities and equations',
    description: 'extend polynomial identities to the complex numbers',
  },
  {
    notation: 'US.CC.11.MA.NCN.9',
    domain: 'Number and Quantity',
    cluster: 'Use complex numbers in polynomial identities and equations',
    description: 'know the Fundamental Theorem of Algebra; show that it is true for quadratic polynomials',
  },

  // ALGEBRA - Arithmetic with Polynomials and Rational Expressions (A-APR)
  {
    notation: 'US.CC.11.MA.AAPR.2',
    domain: 'Algebra',
    cluster: 'Understand the relationship between zeros and factors of polynomials',
    description: 'know and apply the Remainder Theorem: For a polynomial p(x) and a number a, the remainder on division by x - a is p(a), so p(a) = 0 if and only if (x - a) is a factor of p(x)',
  },
  {
    notation: 'US.CC.11.MA.AAPR.3',
    domain: 'Algebra',
    cluster: 'Understand the relationship between zeros and factors of polynomials',
    description: 'identify zeros of polynomials when suitable factorizations are available, and use the zeros to construct a rough graph of the function defined by the polynomial',
  },
  {
    notation: 'US.CC.11.MA.AAPR.4',
    domain: 'Algebra',
    cluster: 'Use polynomial identities to solve problems',
    description: 'prove polynomial identities and use them to describe numerical relationships',
  },
  {
    notation: 'US.CC.11.MA.AAPR.5',
    domain: 'Algebra',
    cluster: 'Use polynomial identities to solve problems',
    description: 'know and apply the Binomial Theorem for the expansion of (x + y)^n in powers of x and y for a positive integer n',
  },
  {
    notation: 'US.CC.11.MA.AAPR.6',
    domain: 'Algebra',
    cluster: 'Rewrite rational expressions',
    description: 'rewrite simple rational expressions in different forms; write a(x)/b(x) in the form q(x) + r(x)/b(x), where a(x), b(x), q(x), and r(x) are polynomials with the degree of r(x) less than the degree of b(x), using inspection, long division, or, for the more complicated examples, a computer algebra system',
  },
  {
    notation: 'US.CC.11.MA.AAPR.7',
    domain: 'Algebra',
    cluster: 'Rewrite rational expressions',
    description: 'understand that rational expressions form a system analogous to the rational numbers, closed under addition, subtraction, multiplication, and division by a nonzero rational expression; add, subtract, multiply, and divide rational expressions',
  },

  // ALGEBRA - Reasoning with Equations and Inequalities (A-REI)
  {
    notation: 'US.CC.11.MA.AREI.2',
    domain: 'Algebra',
    cluster: 'Understand solving equations as a process of reasoning',
    description: 'solve simple rational and radical equations in one variable, and give examples showing how extraneous solutions may arise',
  },
  {
    notation: 'US.CC.11.MA.AREI.7',
    domain: 'Algebra',
    cluster: 'Solve systems of equations',
    description: 'solve a simple system consisting of a linear equation and a quadratic equation in two variables algebraically and graphically',
  },
  {
    notation: 'US.CC.11.MA.AREI.8',
    domain: 'Algebra',
    cluster: 'Solve systems of equations',
    description: 'represent a system of linear equations as a single matrix equation in a vector variable',
  },
  {
    notation: 'US.CC.11.MA.AREI.9',
    domain: 'Algebra',
    cluster: 'Solve systems of equations',
    description: 'find the inverse of a matrix if it exists and use it to solve systems of linear equations (using technology for matrices of dimension 3 × 3 or greater)',
  },

  // FUNCTIONS - Interpreting Functions (F-IF)
  {
    notation: 'US.CC.11.MA.FIF.7c',
    domain: 'Functions',
    cluster: 'Analyze functions using different representations',
    description: 'graph polynomial functions, identifying zeros when suitable factorizations are available, and showing end behavior',
  },
  {
    notation: 'US.CC.11.MA.FIF.7d',
    domain: 'Functions',
    cluster: 'Analyze functions using different representations',
    description: 'graph rational functions, identifying zeros and asymptotes when suitable factorizations are available, and showing end behavior',
  },
  {
    notation: 'US.CC.11.MA.FIF.7e',
    domain: 'Functions',
    cluster: 'Analyze functions using different representations',
    description: 'graph exponential and logarithmic functions, showing intercepts and end behavior, and trigonometric functions, showing period, midline, and amplitude',
  },
  {
    notation: 'US.CC.11.MA.FIF.8b',
    domain: 'Functions',
    cluster: 'Analyze functions using different representations',
    description: 'use the properties of exponents to interpret expressions for exponential functions',
  },

  // FUNCTIONS - Building Functions (F-BF)
  {
    notation: 'US.CC.11.MA.FBF.1c',
    domain: 'Functions',
    cluster: 'Build a function that models a relationship',
    description: 'compose functions',
  },
  {
    notation: 'US.CC.11.MA.FBF.4a',
    domain: 'Functions',
    cluster: 'Build new functions from existing functions',
    description: 'solve an equation of the form f(x) = c for a simple function f that has an inverse and write an expression for the inverse',
  },
  {
    notation: 'US.CC.11.MA.FBF.4b',
    domain: 'Functions',
    cluster: 'Build new functions from existing functions',
    description: 'verify by composition that one function is the inverse of another',
  },
  {
    notation: 'US.CC.11.MA.FBF.4c',
    domain: 'Functions',
    cluster: 'Build new functions from existing functions',
    description: 'read values of an inverse function from a graph or a table, given that the function has an inverse',
  },
  {
    notation: 'US.CC.11.MA.FBF.4d',
    domain: 'Functions',
    cluster: 'Build new functions from existing functions',
    description: 'produce an invertible function from a non-invertible function by restricting the domain',
  },
  {
    notation: 'US.CC.11.MA.FBF.5',
    domain: 'Functions',
    cluster: 'Build new functions from existing functions',
    description: 'understand the inverse relationship between exponents and logarithms and use this relationship to solve problems involving logarithms and exponents',
  },

  // FUNCTIONS - Linear, Quadratic, and Exponential Models (F-LE)
  {
    notation: 'US.CC.11.MA.FLE.4',
    domain: 'Functions',
    cluster: 'Construct and compare linear and exponential models',
    description: 'for exponential models, express as a logarithm the solution to ab^(ct) = d where a, c, and d are numbers and the base b is 2, 10, or e; evaluate the logarithm using technology',
  },

  // STATISTICS AND PROBABILITY - Making Inferences (S-IC)
  {
    notation: 'US.CC.11.MA.SIC.1',
    domain: 'Statistics and Probability',
    cluster: 'Understand and evaluate random processes underlying statistical experiments',
    description: 'understand statistics as a process for making inferences about population parameters based on a random sample from that population',
  },
  {
    notation: 'US.CC.11.MA.SIC.2',
    domain: 'Statistics and Probability',
    cluster: 'Understand and evaluate random processes underlying statistical experiments',
    description: 'decide if a specified model is consistent with results from a given data-generating process',
  },
  {
    notation: 'US.CC.11.MA.SIC.3',
    domain: 'Statistics and Probability',
    cluster: 'Make inferences and justify conclusions from sample surveys, experiments, and observational studies',
    description: 'recognize the purposes of and differences among sample surveys, experiments, and observational studies; explain how randomization relates to each',
  },
  {
    notation: 'US.CC.11.MA.SIC.4',
    domain: 'Statistics and Probability',
    cluster: 'Make inferences and justify conclusions from sample surveys, experiments, and observational studies',
    description: 'use data from a sample survey to estimate a population mean or proportion; develop a margin of error through the use of simulation models for random sampling',
  },
  {
    notation: 'US.CC.11.MA.SIC.5',
    domain: 'Statistics and Probability',
    cluster: 'Make inferences and justify conclusions from sample surveys, experiments, and observational studies',
    description: 'use data from a randomized experiment to compare two treatments; use simulations to decide if differences between parameters are significant',
  },
  {
    notation: 'US.CC.11.MA.SIC.6',
    domain: 'Statistics and Probability',
    cluster: 'Make inferences and justify conclusions from sample surveys, experiments, and observational studies',
    description: 'evaluate reports based on data',
  },

  // STATISTICS AND PROBABILITY - Conditional Probability (S-CP)
  {
    notation: 'US.CC.11.MA.SCP.1',
    domain: 'Statistics and Probability',
    cluster: 'Understand independence and conditional probability',
    description: 'describe events as subsets of a sample space using characteristics of the outcomes, or as unions, intersections, or complements of other events',
  },
  {
    notation: 'US.CC.11.MA.SCP.2',
    domain: 'Statistics and Probability',
    cluster: 'Understand independence and conditional probability',
    description: 'understand that two events A and B are independent if the probability of A and B occurring together is the product of their probabilities, and use this characterization to determine if they are independent',
  },
  {
    notation: 'US.CC.11.MA.SCP.3',
    domain: 'Statistics and Probability',
    cluster: 'Understand independence and conditional probability',
    description: 'understand the conditional probability of A given B as P(A and B)/P(B), and interpret independence of A and B as saying that the conditional probability of A given B is the same as the probability of A',
  },
  {
    notation: 'US.CC.11.MA.SCP.4',
    domain: 'Statistics and Probability',
    cluster: 'Understand independence and conditional probability',
    description: 'construct and interpret two-way frequency tables of data when two categories are associated with each object being classified; use the two-way table as a sample space to decide if events are independent and to approximate conditional probabilities',
  },
  {
    notation: 'US.CC.11.MA.SCP.5',
    domain: 'Statistics and Probability',
    cluster: 'Understand independence and conditional probability',
    description: 'recognize and explain the concepts of conditional probability and independence in everyday language and everyday situations',
  },
  {
    notation: 'US.CC.11.MA.SCP.6',
    domain: 'Statistics and Probability',
    cluster: 'Use the rules of probability to compute probabilities of compound events',
    description: 'find the conditional probability of A given B as the fraction of B outcomes that also belong to A, and interpret the answer in terms of the model',
  },
  {
    notation: 'US.CC.11.MA.SCP.7',
    domain: 'Statistics and Probability',
    cluster: 'Use the rules of probability to compute probabilities of compound events',
    description: 'apply the Addition Rule, P(A or B) = P(A) + P(B) - P(A and B), and interpret the answer in terms of the model',
  },
  {
    notation: 'US.CC.11.MA.SCP.8',
    domain: 'Statistics and Probability',
    cluster: 'Use the rules of probability to compute probabilities of compound events',
    description: 'apply the general Multiplication Rule in a uniform probability model, P(A and B) = P(A)P(B|A) = P(B)P(A|B), and interpret the answer in terms of the model',
  },
  {
    notation: 'US.CC.11.MA.SCP.9',
    domain: 'Statistics and Probability',
    cluster: 'Use the rules of probability to compute probabilities of compound events',
    description: 'use permutations and combinations to compute probabilities of compound events and solve problems',
  },
];

// =============================================================================
// GRADE 12 (Ages 17-18) - Pre-Calculus / Advanced Math Focus
// High School Common Core standards mapped to typical Pre-Calculus course
// =============================================================================

const grade12Standards: CommonCoreMathStandard[] = [
  // NUMBER AND QUANTITY - Vector and Matrix Quantities (N-VM)
  {
    notation: 'US.CC.12.MA.NVM.1',
    domain: 'Number and Quantity',
    cluster: 'Represent and model with vector quantities',
    description: 'recognize vector quantities as having both magnitude and direction; represent vector quantities by directed line segments, and use appropriate symbols for vectors and their magnitudes',
  },
  {
    notation: 'US.CC.12.MA.NVM.2',
    domain: 'Number and Quantity',
    cluster: 'Represent and model with vector quantities',
    description: 'find the components of a vector by subtracting the coordinates of an initial point from the coordinates of a terminal point',
  },
  {
    notation: 'US.CC.12.MA.NVM.3',
    domain: 'Number and Quantity',
    cluster: 'Represent and model with vector quantities',
    description: 'solve problems involving velocity and other quantities that can be represented by vectors',
  },
  {
    notation: 'US.CC.12.MA.NVM.4a',
    domain: 'Number and Quantity',
    cluster: 'Perform operations on vectors',
    description: 'add vectors end-to-end, component-wise, and by the parallelogram rule, and understand that the magnitude of a sum of two vectors is typically not the sum of the magnitudes',
  },
  {
    notation: 'US.CC.12.MA.NVM.4b',
    domain: 'Number and Quantity',
    cluster: 'Perform operations on vectors',
    description: 'given two vectors in magnitude and direction form, determine the magnitude and direction of their sum',
  },
  {
    notation: 'US.CC.12.MA.NVM.4c',
    domain: 'Number and Quantity',
    cluster: 'Perform operations on vectors',
    description: 'understand vector subtraction v - w as v + (-w), where -w is the additive inverse of w, with the same magnitude as w and pointing in the opposite direction; represent vector subtraction graphically by connecting the tips in the appropriate order, and perform vector subtraction component-wise',
  },
  {
    notation: 'US.CC.12.MA.NVM.5a',
    domain: 'Number and Quantity',
    cluster: 'Perform operations on vectors',
    description: 'multiply a vector by a scalar, representing scalar multiplication graphically, and performing scalar multiplication component-wise',
  },
  {
    notation: 'US.CC.12.MA.NVM.5b',
    domain: 'Number and Quantity',
    cluster: 'Perform operations on vectors',
    description: 'compute the magnitude of a scalar multiple cv using ||cv|| = |c|v; compute the direction of cv knowing that when |c|v ≠ 0, the direction of cv is either along v (for c > 0) or against v (for c < 0)',
  },
  {
    notation: 'US.CC.12.MA.NVM.6',
    domain: 'Number and Quantity',
    cluster: 'Perform operations on matrices and use matrices in applications',
    description: 'use matrices to represent and manipulate data',
  },
  {
    notation: 'US.CC.12.MA.NVM.7',
    domain: 'Number and Quantity',
    cluster: 'Perform operations on matrices and use matrices in applications',
    description: 'multiply matrices by scalars to produce new matrices',
  },
  {
    notation: 'US.CC.12.MA.NVM.8',
    domain: 'Number and Quantity',
    cluster: 'Perform operations on matrices and use matrices in applications',
    description: 'add, subtract, and multiply matrices of appropriate dimensions',
  },
  {
    notation: 'US.CC.12.MA.NVM.9',
    domain: 'Number and Quantity',
    cluster: 'Perform operations on matrices and use matrices in applications',
    description: 'understand that, unlike multiplication of numbers, matrix multiplication for square matrices is not a commutative operation, but still satisfies the associative and distributive properties',
  },
  {
    notation: 'US.CC.12.MA.NVM.10',
    domain: 'Number and Quantity',
    cluster: 'Perform operations on matrices and use matrices in applications',
    description: 'understand that the zero and identity matrices play a role in matrix addition and multiplication similar to the role of 0 and 1 in the real numbers; the determinant of a square matrix is nonzero if and only if the matrix has a multiplicative inverse',
  },
  {
    notation: 'US.CC.12.MA.NVM.11',
    domain: 'Number and Quantity',
    cluster: 'Perform operations on matrices and use matrices in applications',
    description: 'multiply a vector (regarded as a matrix with one column) by a matrix of suitable dimensions to produce another vector; work with matrices as transformations of vectors',
  },
  {
    notation: 'US.CC.12.MA.NVM.12',
    domain: 'Number and Quantity',
    cluster: 'Perform operations on matrices and use matrices in applications',
    description: 'work with 2 × 2 matrices as transformations of the plane, and interpret the absolute value of the determinant in terms of area',
  },

  // FUNCTIONS - Trigonometric Functions (F-TF)
  {
    notation: 'US.CC.12.MA.FTF.1',
    domain: 'Functions',
    cluster: 'Extend the domain of trigonometric functions using the unit circle',
    description: 'understand radian measure of an angle as the length of the arc on the unit circle subtended by the angle',
  },
  {
    notation: 'US.CC.12.MA.FTF.2',
    domain: 'Functions',
    cluster: 'Extend the domain of trigonometric functions using the unit circle',
    description: 'explain how the unit circle in the coordinate plane enables the extension of trigonometric functions to all real numbers, interpreted as radian measures of angles traversed counterclockwise around the unit circle',
  },
  {
    notation: 'US.CC.12.MA.FTF.3',
    domain: 'Functions',
    cluster: 'Extend the domain of trigonometric functions using the unit circle',
    description: 'use special triangles to determine geometrically the values of sine, cosine, tangent for π/3, π/4 and π/6, and use the unit circle to express the values of sine, cosine, and tangent for π-x, π+x, and 2π-x in terms of their values for x',
  },
  {
    notation: 'US.CC.12.MA.FTF.4',
    domain: 'Functions',
    cluster: 'Extend the domain of trigonometric functions using the unit circle',
    description: 'use the unit circle to explain symmetry (odd and even) and periodicity of trigonometric functions',
  },
  {
    notation: 'US.CC.12.MA.FTF.5',
    domain: 'Functions',
    cluster: 'Model periodic phenomena with trigonometric functions',
    description: 'choose trigonometric functions to model periodic phenomena with specified amplitude, frequency, and midline',
  },
  {
    notation: 'US.CC.12.MA.FTF.6',
    domain: 'Functions',
    cluster: 'Model periodic phenomena with trigonometric functions',
    description: 'understand that restricting a trigonometric function to a domain on which it is always increasing or always decreasing allows its inverse to be constructed',
  },
  {
    notation: 'US.CC.12.MA.FTF.7',
    domain: 'Functions',
    cluster: 'Model periodic phenomena with trigonometric functions',
    description: 'use inverse functions to solve trigonometric equations that arise in modeling contexts; evaluate the solutions using technology, and interpret them in terms of the context',
  },
  {
    notation: 'US.CC.12.MA.FTF.8',
    domain: 'Functions',
    cluster: 'Prove and apply trigonometric identities',
    description: 'prove the Pythagorean identity sin²(θ) + cos²(θ) = 1 and use it to find sin(θ), cos(θ), or tan(θ) given sin(θ), cos(θ), or tan(θ) and the quadrant of the angle',
  },
  {
    notation: 'US.CC.12.MA.FTF.9',
    domain: 'Functions',
    cluster: 'Prove and apply trigonometric identities',
    description: 'prove the addition and subtraction formulas for sine, cosine, and tangent and use them to solve problems',
  },

  // GEOMETRY - Similarity, Right Triangles, and Trigonometry (G-SRT) - Advanced
  {
    notation: 'US.CC.12.MA.GSRT.9',
    domain: 'Geometry',
    cluster: 'Apply trigonometry to general triangles',
    description: 'derive the formula A = (1/2)ab sin(C) for the area of a triangle by drawing an auxiliary line from a vertex perpendicular to the opposite side',
  },
  {
    notation: 'US.CC.12.MA.GSRT.10',
    domain: 'Geometry',
    cluster: 'Apply trigonometry to general triangles',
    description: 'prove the Laws of Sines and Cosines and use them to solve problems',
  },
  {
    notation: 'US.CC.12.MA.GSRT.11',
    domain: 'Geometry',
    cluster: 'Apply trigonometry to general triangles',
    description: 'understand and apply the Law of Sines and the Law of Cosines to find unknown measurements in right and non-right triangles',
  },

  // GEOMETRY - Expressing Geometric Properties with Equations (G-GPE) - Conics
  {
    notation: 'US.CC.12.MA.GGPE.3',
    domain: 'Geometry',
    cluster: 'Translate between the geometric description and the equation for a conic section',
    description: 'derive the equations of ellipses and hyperbolas given the foci, using the fact that the sum or difference of distances from the foci is constant',
  },

  // STATISTICS AND PROBABILITY - Using Probability to Make Decisions (S-MD)
  {
    notation: 'US.CC.12.MA.SMD.1',
    domain: 'Statistics and Probability',
    cluster: 'Calculate expected values and use them to solve problems',
    description: 'define a random variable for a quantity of interest by assigning a numerical value to each event in a sample space; graph the corresponding probability distribution using the same graphical displays as for data distributions',
  },
  {
    notation: 'US.CC.12.MA.SMD.2',
    domain: 'Statistics and Probability',
    cluster: 'Calculate expected values and use them to solve problems',
    description: 'calculate the expected value of a random variable; interpret it as the mean of the probability distribution',
  },
  {
    notation: 'US.CC.12.MA.SMD.3',
    domain: 'Statistics and Probability',
    cluster: 'Calculate expected values and use them to solve problems',
    description: 'develop a probability distribution for a random variable defined for a sample space in which theoretical probabilities can be calculated; find the expected value',
  },
  {
    notation: 'US.CC.12.MA.SMD.4',
    domain: 'Statistics and Probability',
    cluster: 'Calculate expected values and use them to solve problems',
    description: 'develop a probability distribution for a random variable defined for a sample space in which probabilities are assigned empirically; find the expected value',
  },
  {
    notation: 'US.CC.12.MA.SMD.5a',
    domain: 'Statistics and Probability',
    cluster: 'Use probability to evaluate outcomes of decisions',
    description: 'find the expected payoff for a game of chance',
  },
  {
    notation: 'US.CC.12.MA.SMD.5b',
    domain: 'Statistics and Probability',
    cluster: 'Use probability to evaluate outcomes of decisions',
    description: 'evaluate and compare strategies on the basis of expected values',
  },
  {
    notation: 'US.CC.12.MA.SMD.6',
    domain: 'Statistics and Probability',
    cluster: 'Use probability to evaluate outcomes of decisions',
    description: 'use probabilities to make fair decisions',
  },
  {
    notation: 'US.CC.12.MA.SMD.7',
    domain: 'Statistics and Probability',
    cluster: 'Use probability to evaluate outcomes of decisions',
    description: 'analyze decisions and strategies using probability concepts',
  },

  // ADDITIONAL ADVANCED TOPICS
  {
    notation: 'US.CC.12.MA.NCN.4',
    domain: 'Number and Quantity',
    cluster: 'Represent complex numbers and their operations on the complex plane',
    description: 'represent complex numbers on the complex plane in rectangular and polar form (including real and imaginary numbers)',
  },
  {
    notation: 'US.CC.12.MA.NCN.5',
    domain: 'Number and Quantity',
    cluster: 'Represent complex numbers and their operations on the complex plane',
    description: 'represent addition, subtraction, multiplication, and conjugation of complex numbers geometrically on the complex plane; use properties of this representation for computation',
  },
  {
    notation: 'US.CC.12.MA.NCN.6',
    domain: 'Number and Quantity',
    cluster: 'Represent complex numbers and their operations on the complex plane',
    description: 'calculate the distance between numbers in the complex plane as the modulus of the difference, and the midpoint of a segment as the average of the numbers at its endpoints',
  },

  // LIMITS AND CONTINUITY (Pre-Calculus Preparation)
  {
    notation: 'US.CC.12.MA.LIM.1',
    domain: 'Functions',
    cluster: 'Understand limits conceptually',
    description: 'understand that the concept of a limit describes the behavior of a function as the input approaches a particular value',
  },
  {
    notation: 'US.CC.12.MA.LIM.2',
    domain: 'Functions',
    cluster: 'Understand limits conceptually',
    description: 'estimate limits from graphs and tables of values',
  },
  {
    notation: 'US.CC.12.MA.LIM.3',
    domain: 'Functions',
    cluster: 'Understand limits conceptually',
    description: 'understand the concept of continuity and identify continuous and discontinuous functions',
  },
  {
    notation: 'US.CC.12.MA.LIM.4',
    domain: 'Functions',
    cluster: 'Understand limits conceptually',
    description: 'understand and apply the concept of end behavior and horizontal asymptotes',
  },

  // SEQUENCES AND SERIES
  {
    notation: 'US.CC.12.MA.SEQ.1',
    domain: 'Functions',
    cluster: 'Understand and use sequences and series',
    description: 'write explicit and recursive formulas for arithmetic and geometric sequences',
  },
  {
    notation: 'US.CC.12.MA.SEQ.2',
    domain: 'Functions',
    cluster: 'Understand and use sequences and series',
    description: 'use formulas for the nth term and sum of arithmetic and geometric sequences to solve problems',
  },
  {
    notation: 'US.CC.12.MA.SEQ.3',
    domain: 'Functions',
    cluster: 'Understand and use sequences and series',
    description: 'understand the concept of an infinite geometric series and calculate its sum when it converges',
  },
  {
    notation: 'US.CC.12.MA.SEQ.4',
    domain: 'Functions',
    cluster: 'Understand and use sequences and series',
    description: 'use sigma notation to represent and evaluate sums',
  },

  // PARAMETRIC AND POLAR
  {
    notation: 'US.CC.12.MA.PAR.1',
    domain: 'Functions',
    cluster: 'Understand parametric and polar representations',
    description: 'graph curves given by parametric equations and eliminate the parameter to find a Cartesian equation',
  },
  {
    notation: 'US.CC.12.MA.PAR.2',
    domain: 'Functions',
    cluster: 'Understand parametric and polar representations',
    description: 'convert between polar and rectangular coordinates',
  },
  {
    notation: 'US.CC.12.MA.PAR.3',
    domain: 'Functions',
    cluster: 'Understand parametric and polar representations',
    description: 'graph polar equations and identify common curves (circles, roses, limaçons, lemniscates)',
  },
];

// =============================================================================
// EXPORT
// =============================================================================

export const commonCoreMathCurriculum: CommonCoreMathCurriculum = {
  code: 'US_COMMON_CORE',
  name: 'Common Core State Standards',
  country: 'US',
  version: '2010',
  sourceUrl: 'https://www.corestandards.org/Math/',
  subject: 'MATH',
  grades: [
    { grade: 0, gradeLabel: 'K', ageRangeMin: 5, ageRangeMax: 6, standards: kindergartenStandards },
    { grade: 1, gradeLabel: '1', ageRangeMin: 6, ageRangeMax: 7, standards: grade1Standards },
    { grade: 2, gradeLabel: '2', ageRangeMin: 7, ageRangeMax: 8, standards: grade2Standards },
    { grade: 3, gradeLabel: '3', ageRangeMin: 8, ageRangeMax: 9, standards: grade3Standards },
    { grade: 4, gradeLabel: '4', ageRangeMin: 9, ageRangeMax: 10, standards: grade4Standards },
    { grade: 5, gradeLabel: '5', ageRangeMin: 10, ageRangeMax: 11, standards: grade5Standards },
    { grade: 6, gradeLabel: '6', ageRangeMin: 11, ageRangeMax: 12, standards: grade6Standards },
    { grade: 7, gradeLabel: '7', ageRangeMin: 12, ageRangeMax: 13, standards: grade7Standards },
    { grade: 8, gradeLabel: '8', ageRangeMin: 13, ageRangeMax: 14, standards: grade8Standards },
    { grade: 9, gradeLabel: '9', ageRangeMin: 14, ageRangeMax: 15, standards: grade9Standards },
    { grade: 10, gradeLabel: '10', ageRangeMin: 15, ageRangeMax: 16, standards: grade10Standards },
    { grade: 11, gradeLabel: '11', ageRangeMin: 16, ageRangeMax: 17, standards: grade11Standards },
    { grade: 12, gradeLabel: '12', ageRangeMin: 17, ageRangeMax: 18, standards: grade12Standards },
  ],
};

/**
 * Get total count of Math standards
 */
export function getTotalCommonCoreMathStandardsCount(): number {
  return commonCoreMathCurriculum.grades.reduce(
    (total, grade) => total + grade.standards.length,
    0
  );
}

/**
 * Get standards count by grade
 */
export function getCommonCoreMathStandardsCountByGrade(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const grade of commonCoreMathCurriculum.grades) {
    counts[`Grade ${grade.gradeLabel}`] = grade.standards.length;
  }
  return counts;
}

/**
 * Get standards count by domain
 */
export function getCommonCoreMathStandardsCountByDomain(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const grade of commonCoreMathCurriculum.grades) {
    for (const std of grade.standards) {
      counts[std.domain] = (counts[std.domain] || 0) + 1;
    }
  }
  return counts;
}
