/**
 * IB Middle Years Programme (MYP) & Diploma Programme (DP) - Mathematics
 * Grades 6-12 (Ages 11-18)
 *
 * Official Source: IB MYP Mathematics Guide (2020) & DP Mathematics Guide (2019)
 * https://www.ibo.org/programmes/middle-years-programme/curriculum/mathematics/
 * https://www.ibo.org/programmes/diploma-programme/curriculum/mathematics/
 *
 * Structure:
 * - MYP Years 1-5 (Grades 6-10, Ages 11-16): Concept-based with 4 branches
 * - DP Years 1-2 (Grades 11-12, Ages 16-18): Analysis & Approaches or Applications & Interpretation
 *
 * Notation System: IB.{programme}.{year}.MA.{branch/topic}.{number}
 * - Programme: MYP or DP
 * - Year: Y1-Y5 for MYP, Y1-Y2 for DP
 * - MA = Mathematics
 * - Branch codes (MYP): NR (Numerical/Abstract Reasoning), TM (Thinking with Models),
 *                       SR (Spatial Reasoning), RD (Reasoning with Data)
 * - Topic codes (DP): NA (Number & Algebra), FN (Functions), GT (Geometry & Trigonometry),
 *                     SP (Statistics & Probability), CA (Calculus)
 */

export interface IBMYPDPMathStandard {
  notation: string;
  branch: string; // For MYP: branch of study; For DP: syllabus component
  topic?: string; // Specific topic within branch
  level?: 'standard' | 'extended' | 'SL' | 'HL'; // MYP: standard/extended; DP: SL/HL
  description: string;
  assessmentCriteria?: string[]; // Which criteria this relates to
}

export interface IBMYPDPMathYear {
  year: number; // 1-5 for MYP, 1-2 for DP (mapped to grades 6-12)
  grade: number; // Traditional grade equivalent (6-12)
  programme: 'MYP' | 'DP';
  yearLabel: string;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: IBMYPDPMathStandard[];
}

export interface IBMYPDPMathCurriculum {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  years: IBMYPDPMathYear[];
}

// =============================================================================
// MYP ASSESSMENT CRITERIA (used across all MYP years)
// =============================================================================
// Criterion A: Knowing and understanding
// Criterion B: Investigating patterns
// Criterion C: Communicating
// Criterion D: Applying mathematics in real-life contexts

// =============================================================================
// MYP YEAR 1 (Grade 6, Ages 11-12) - Foundation
// =============================================================================

const mypYear1Standards: IBMYPDPMathStandard[] = [
  // NUMERICAL AND ABSTRACT REASONING
  {
    notation: 'IB.MYP.Y1.MA.NR.1',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Number Systems',
    level: 'standard',
    description: 'Understand and work with positive and negative integers',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y1.MA.NR.2',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Fractions and Decimals',
    level: 'standard',
    description: 'Convert between fractions, decimals, and percentages',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y1.MA.NR.3',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Order of Operations',
    level: 'standard',
    description: 'Apply order of operations with integers and rational numbers',
    assessmentCriteria: ['A'],
  },
  {
    notation: 'IB.MYP.Y1.MA.NR.4',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Factors and Multiples',
    level: 'standard',
    description: 'Find factors, multiples, and prime factorization of numbers',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y1.MA.NR.5',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Basic Algebra',
    level: 'standard',
    description: 'Use variables to represent unknown quantities and write simple expressions',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y1.MA.NR.6',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'One-Step Equations',
    level: 'standard',
    description: 'Solve one-step equations using inverse operations',
    assessmentCriteria: ['A', 'D'],
  },

  // THINKING WITH MODELS
  {
    notation: 'IB.MYP.Y1.MA.TM.1',
    branch: 'Thinking with Models',
    topic: 'Ratios',
    level: 'standard',
    description: 'Understand and use ratios to compare quantities',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y1.MA.TM.2',
    branch: 'Thinking with Models',
    topic: 'Proportional Relationships',
    level: 'standard',
    description: 'Recognize and represent proportional relationships',
    assessmentCriteria: ['B', 'D'],
  },
  {
    notation: 'IB.MYP.Y1.MA.TM.3',
    branch: 'Thinking with Models',
    topic: 'Tables and Patterns',
    level: 'standard',
    description: 'Identify patterns in tables and extend sequences',
    assessmentCriteria: ['B', 'C'],
  },
  {
    notation: 'IB.MYP.Y1.MA.TM.4',
    branch: 'Thinking with Models',
    topic: 'Graphs',
    level: 'standard',
    description: 'Plot points on a coordinate plane and interpret simple graphs',
    assessmentCriteria: ['B', 'C'],
  },

  // SPATIAL REASONING
  {
    notation: 'IB.MYP.Y1.MA.SR.1',
    branch: 'Spatial Reasoning',
    topic: 'Angles',
    level: 'standard',
    description: 'Measure, classify, and construct angles',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y1.MA.SR.2',
    branch: 'Spatial Reasoning',
    topic: '2D Shapes',
    level: 'standard',
    description: 'Classify and analyze properties of polygons',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y1.MA.SR.3',
    branch: 'Spatial Reasoning',
    topic: 'Perimeter and Area',
    level: 'standard',
    description: 'Calculate perimeter and area of rectangles, triangles, and composite shapes',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y1.MA.SR.4',
    branch: 'Spatial Reasoning',
    topic: '3D Shapes',
    level: 'standard',
    description: 'Identify and describe properties of prisms and pyramids',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y1.MA.SR.5',
    branch: 'Spatial Reasoning',
    topic: 'Surface Area and Volume',
    level: 'standard',
    description: 'Calculate surface area and volume of rectangular prisms',
    assessmentCriteria: ['A', 'D'],
  },

  // REASONING WITH DATA
  {
    notation: 'IB.MYP.Y1.MA.RD.1',
    branch: 'Reasoning with Data',
    topic: 'Data Collection',
    level: 'standard',
    description: 'Design and conduct surveys to collect data',
    assessmentCriteria: ['B', 'D'],
  },
  {
    notation: 'IB.MYP.Y1.MA.RD.2',
    branch: 'Reasoning with Data',
    topic: 'Data Representation',
    level: 'standard',
    description: 'Create and interpret bar graphs, line graphs, and pie charts',
    assessmentCriteria: ['C', 'D'],
  },
  {
    notation: 'IB.MYP.Y1.MA.RD.3',
    branch: 'Reasoning with Data',
    topic: 'Measures of Center',
    level: 'standard',
    description: 'Calculate and interpret mean, median, and mode',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y1.MA.RD.4',
    branch: 'Reasoning with Data',
    topic: 'Basic Probability',
    level: 'standard',
    description: 'Calculate probability of simple events using fractions',
    assessmentCriteria: ['A', 'D'],
  },
];

// =============================================================================
// MYP YEAR 2 (Grade 7, Ages 12-13) - Developing
// =============================================================================

const mypYear2Standards: IBMYPDPMathStandard[] = [
  // NUMERICAL AND ABSTRACT REASONING
  {
    notation: 'IB.MYP.Y2.MA.NR.1',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Rational Numbers',
    level: 'standard',
    description: 'Perform operations with positive and negative rational numbers',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y2.MA.NR.2',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Exponents',
    level: 'standard',
    description: 'Understand and apply integer exponents and powers of 10',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y2.MA.NR.3',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Square Roots',
    level: 'standard',
    description: 'Find square roots of perfect squares and estimate others',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y2.MA.NR.4',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Algebraic Expressions',
    level: 'standard',
    description: 'Simplify algebraic expressions by combining like terms',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y2.MA.NR.5',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Two-Step Equations',
    level: 'standard',
    description: 'Solve two-step linear equations',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y2.MA.NR.6',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Inequalities',
    level: 'standard',
    description: 'Write and solve one-step inequalities',
    assessmentCriteria: ['A', 'C'],
  },

  // THINKING WITH MODELS
  {
    notation: 'IB.MYP.Y2.MA.TM.1',
    branch: 'Thinking with Models',
    topic: 'Proportional Reasoning',
    level: 'standard',
    description: 'Solve problems involving proportions and unit rates',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y2.MA.TM.2',
    branch: 'Thinking with Models',
    topic: 'Percent Applications',
    level: 'standard',
    description: 'Calculate percent increase, decrease, and solve percent problems',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y2.MA.TM.3',
    branch: 'Thinking with Models',
    topic: 'Linear Relationships',
    level: 'standard',
    description: 'Identify and represent linear relationships in tables and graphs',
    assessmentCriteria: ['B', 'C'],
  },
  {
    notation: 'IB.MYP.Y2.MA.TM.4',
    branch: 'Thinking with Models',
    topic: 'Direct Variation',
    level: 'standard',
    description: 'Recognize and model direct variation relationships',
    assessmentCriteria: ['B', 'D'],
  },
  {
    notation: 'IB.MYP.Y2.MA.TM.5',
    branch: 'Thinking with Models',
    topic: 'Simple Interest',
    level: 'standard',
    description: 'Calculate simple interest in financial contexts',
    assessmentCriteria: ['A', 'D'],
  },

  // SPATIAL REASONING
  {
    notation: 'IB.MYP.Y2.MA.SR.1',
    branch: 'Spatial Reasoning',
    topic: 'Angle Relationships',
    level: 'standard',
    description: 'Identify and use complementary, supplementary, and vertical angles',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y2.MA.SR.2',
    branch: 'Spatial Reasoning',
    topic: 'Triangle Properties',
    level: 'standard',
    description: 'Apply triangle angle sum and inequality theorems',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y2.MA.SR.3',
    branch: 'Spatial Reasoning',
    topic: 'Circle Basics',
    level: 'standard',
    description: 'Calculate circumference and area of circles',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y2.MA.SR.4',
    branch: 'Spatial Reasoning',
    topic: 'Scale Drawings',
    level: 'standard',
    description: 'Interpret and create scale drawings and models',
    assessmentCriteria: ['C', 'D'],
  },
  {
    notation: 'IB.MYP.Y2.MA.SR.5',
    branch: 'Spatial Reasoning',
    topic: 'Cross-Sections',
    level: 'standard',
    description: 'Identify cross-sections of 3D shapes',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y2.MA.SR.6',
    branch: 'Spatial Reasoning',
    topic: 'Composite Figures',
    level: 'standard',
    description: 'Calculate area of composite 2D figures',
    assessmentCriteria: ['A', 'D'],
  },

  // REASONING WITH DATA
  {
    notation: 'IB.MYP.Y2.MA.RD.1',
    branch: 'Reasoning with Data',
    topic: 'Statistical Questions',
    level: 'standard',
    description: 'Recognize and formulate statistical questions',
    assessmentCriteria: ['B', 'C'],
  },
  {
    notation: 'IB.MYP.Y2.MA.RD.2',
    branch: 'Reasoning with Data',
    topic: 'Measures of Spread',
    level: 'standard',
    description: 'Calculate and interpret range and interquartile range',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y2.MA.RD.3',
    branch: 'Reasoning with Data',
    topic: 'Box Plots',
    level: 'standard',
    description: 'Create and interpret box-and-whisker plots',
    assessmentCriteria: ['C', 'D'],
  },
  {
    notation: 'IB.MYP.Y2.MA.RD.4',
    branch: 'Reasoning with Data',
    topic: 'Compound Probability',
    level: 'standard',
    description: 'Calculate probability of compound events',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y2.MA.RD.5',
    branch: 'Reasoning with Data',
    topic: 'Sampling',
    level: 'standard',
    description: 'Understand random sampling and make inferences about populations',
    assessmentCriteria: ['B', 'D'],
  },
];

// =============================================================================
// MYP YEAR 3 (Grade 8, Ages 13-14) - Expanding
// =============================================================================

const mypYear3Standards: IBMYPDPMathStandard[] = [
  // NUMERICAL AND ABSTRACT REASONING
  {
    notation: 'IB.MYP.Y3.MA.NR.1',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Real Numbers',
    level: 'standard',
    description: 'Classify numbers as rational or irrational and approximate irrationals',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y3.MA.NR.2',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Scientific Notation',
    level: 'standard',
    description: 'Express and compute with numbers in scientific notation',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y3.MA.NR.3',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Laws of Exponents',
    level: 'standard',
    description: 'Apply laws of exponents to simplify expressions',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y3.MA.NR.4',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Multi-Step Equations',
    level: 'standard',
    description: 'Solve multi-step linear equations with variables on both sides',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y3.MA.NR.5',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Systems Introduction',
    level: 'standard',
    description: 'Solve simple systems of linear equations graphically',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y3.MA.NR.6',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Polynomials Introduction',
    level: 'standard',
    description: 'Add, subtract, and multiply polynomials',
    assessmentCriteria: ['A', 'C'],
  },

  // THINKING WITH MODELS
  {
    notation: 'IB.MYP.Y3.MA.TM.1',
    branch: 'Thinking with Models',
    topic: 'Linear Functions',
    level: 'standard',
    description: 'Write and graph linear equations in slope-intercept form',
    assessmentCriteria: ['B', 'C'],
  },
  {
    notation: 'IB.MYP.Y3.MA.TM.2',
    branch: 'Thinking with Models',
    topic: 'Slope',
    level: 'standard',
    description: 'Calculate and interpret slope as rate of change',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y3.MA.TM.3',
    branch: 'Thinking with Models',
    topic: 'Function Concept',
    level: 'standard',
    description: 'Understand functions as input-output relationships',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y3.MA.TM.4',
    branch: 'Thinking with Models',
    topic: 'Comparing Functions',
    level: 'standard',
    description: 'Compare properties of functions represented in different ways',
    assessmentCriteria: ['B', 'C'],
  },
  {
    notation: 'IB.MYP.Y3.MA.TM.5',
    branch: 'Thinking with Models',
    topic: 'Non-Linear Patterns',
    level: 'standard',
    description: 'Recognize and describe patterns in non-linear relationships',
    assessmentCriteria: ['B', 'D'],
  },

  // SPATIAL REASONING
  {
    notation: 'IB.MYP.Y3.MA.SR.1',
    branch: 'Spatial Reasoning',
    topic: 'Transformations',
    level: 'standard',
    description: 'Perform and describe rotations, reflections, and translations',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y3.MA.SR.2',
    branch: 'Spatial Reasoning',
    topic: 'Congruence',
    level: 'standard',
    description: 'Understand congruence through transformations',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y3.MA.SR.3',
    branch: 'Spatial Reasoning',
    topic: 'Similarity',
    level: 'standard',
    description: 'Understand similarity through dilations and apply scale factors',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y3.MA.SR.4',
    branch: 'Spatial Reasoning',
    topic: 'Pythagorean Theorem',
    level: 'standard',
    description: 'Apply the Pythagorean theorem to find distances',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y3.MA.SR.5',
    branch: 'Spatial Reasoning',
    topic: 'Volume of Cylinders',
    level: 'standard',
    description: 'Calculate volume of cylinders, cones, and spheres',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y3.MA.SR.6',
    branch: 'Spatial Reasoning',
    topic: 'Coordinate Geometry',
    level: 'standard',
    description: 'Apply distance and midpoint formulas in the coordinate plane',
    assessmentCriteria: ['A', 'C'],
  },

  // REASONING WITH DATA
  {
    notation: 'IB.MYP.Y3.MA.RD.1',
    branch: 'Reasoning with Data',
    topic: 'Bivariate Data',
    level: 'standard',
    description: 'Create and interpret scatter plots for bivariate data',
    assessmentCriteria: ['B', 'C'],
  },
  {
    notation: 'IB.MYP.Y3.MA.RD.2',
    branch: 'Reasoning with Data',
    topic: 'Line of Best Fit',
    level: 'standard',
    description: 'Draw and use informal lines of best fit',
    assessmentCriteria: ['B', 'D'],
  },
  {
    notation: 'IB.MYP.Y3.MA.RD.3',
    branch: 'Reasoning with Data',
    topic: 'Two-Way Tables',
    level: 'standard',
    description: 'Construct and interpret two-way frequency tables',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y3.MA.RD.4',
    branch: 'Reasoning with Data',
    topic: 'Probability Models',
    level: 'standard',
    description: 'Develop and use probability models including tree diagrams',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y3.MA.RD.5',
    branch: 'Reasoning with Data',
    topic: 'Simulations',
    level: 'standard',
    description: 'Design simulations to estimate probabilities',
    assessmentCriteria: ['B', 'D'],
  },
];

// =============================================================================
// MYP YEAR 4 (Grade 9, Ages 14-15) - Standard & Extended
// =============================================================================

const mypYear4Standards: IBMYPDPMathStandard[] = [
  // NUMERICAL AND ABSTRACT REASONING
  {
    notation: 'IB.MYP.Y4.MA.NR.1',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Number Systems',
    level: 'standard',
    description: 'Understand and use rational and irrational numbers in various contexts',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.MA.NR.2',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Exponents and Roots',
    level: 'standard',
    description: 'Apply laws of exponents and understand nth roots',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y4.MA.NR.3',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Scientific Notation',
    level: 'standard',
    description: 'Use scientific notation for very large and very small numbers',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.MA.NR.4',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Algebraic Expressions',
    level: 'standard',
    description: 'Simplify and manipulate algebraic expressions including polynomials',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y4.MA.NR.5',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Equations',
    level: 'standard',
    description: 'Solve linear and quadratic equations algebraically and graphically',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y4.MA.NR.6',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Inequalities',
    level: 'standard',
    description: 'Solve and graph linear inequalities in one and two variables',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y4.MA.NR.7',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Systems of Equations',
    level: 'extended',
    description: 'Solve systems of linear equations using multiple methods',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y4.MA.NR.8',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Quadratic Expressions',
    level: 'extended',
    description: 'Factor quadratic expressions and solve using the quadratic formula',
    assessmentCriteria: ['A', 'C'],
  },

  // THINKING WITH MODELS
  {
    notation: 'IB.MYP.Y4.MA.TM.1',
    branch: 'Thinking with Models',
    topic: 'Linear Functions',
    level: 'standard',
    description: 'Model real-world situations using linear functions and interpret their parameters',
    assessmentCriteria: ['B', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.MA.TM.2',
    branch: 'Thinking with Models',
    topic: 'Quadratic Functions',
    level: 'standard',
    description: 'Understand and graph quadratic functions, identifying key features',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y4.MA.TM.3',
    branch: 'Thinking with Models',
    topic: 'Exponential Models',
    level: 'standard',
    description: 'Model growth and decay situations using exponential functions',
    assessmentCriteria: ['B', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.MA.TM.4',
    branch: 'Thinking with Models',
    topic: 'Function Notation',
    level: 'standard',
    description: 'Use and interpret function notation, including domain and range',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y4.MA.TM.5',
    branch: 'Thinking with Models',
    topic: 'Function Transformations',
    level: 'extended',
    description: 'Apply transformations to functions (translations, reflections, stretches)',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y4.MA.TM.6',
    branch: 'Thinking with Models',
    topic: 'Inverse Functions',
    level: 'extended',
    description: 'Understand and find inverse functions graphically and algebraically',
    assessmentCriteria: ['A', 'B'],
  },

  // SPATIAL REASONING
  {
    notation: 'IB.MYP.Y4.MA.SR.1',
    branch: 'Spatial Reasoning',
    topic: 'Coordinate Geometry',
    level: 'standard',
    description: 'Apply distance, midpoint, and gradient formulas in the coordinate plane',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y4.MA.SR.2',
    branch: 'Spatial Reasoning',
    topic: 'Equations of Lines',
    level: 'standard',
    description: 'Write and interpret equations of lines in various forms',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.MA.SR.3',
    branch: 'Spatial Reasoning',
    topic: 'Circle Properties',
    level: 'standard',
    description: 'Understand and apply properties of circles including arc length and sector area',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.MA.SR.4',
    branch: 'Spatial Reasoning',
    topic: 'Trigonometric Ratios',
    level: 'standard',
    description: 'Use sine, cosine, and tangent ratios to solve right triangle problems',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.MA.SR.5',
    branch: 'Spatial Reasoning',
    topic: 'Surface Area and Volume',
    level: 'standard',
    description: 'Calculate surface area and volume of prisms, cylinders, pyramids, and cones',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.MA.SR.6',
    branch: 'Spatial Reasoning',
    topic: 'Sine and Cosine Rules',
    level: 'extended',
    description: 'Apply sine and cosine rules to solve non-right triangle problems',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.MA.SR.7',
    branch: 'Spatial Reasoning',
    topic: 'Vectors Introduction',
    level: 'extended',
    description: 'Understand vectors as quantities with magnitude and direction',
    assessmentCriteria: ['A', 'C'],
  },

  // REASONING WITH DATA
  {
    notation: 'IB.MYP.Y4.MA.RD.1',
    branch: 'Reasoning with Data',
    topic: 'Statistical Measures',
    level: 'standard',
    description: 'Calculate and interpret measures of central tendency and spread',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.MA.RD.2',
    branch: 'Reasoning with Data',
    topic: 'Data Representation',
    level: 'standard',
    description: 'Create and interpret histograms, box plots, and cumulative frequency graphs',
    assessmentCriteria: ['C', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.MA.RD.3',
    branch: 'Reasoning with Data',
    topic: 'Probability Concepts',
    level: 'standard',
    description: 'Apply probability concepts including combined events and conditional probability',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y4.MA.RD.4',
    branch: 'Reasoning with Data',
    topic: 'Scatter Plots',
    level: 'standard',
    description: 'Analyze relationships using scatter plots and lines of best fit',
    assessmentCriteria: ['B', 'D'],
  },
  {
    notation: 'IB.MYP.Y4.MA.RD.5',
    branch: 'Reasoning with Data',
    topic: 'Probability Distributions',
    level: 'extended',
    description: 'Understand discrete probability distributions and expected value',
    assessmentCriteria: ['A', 'B'],
  },
];

// =============================================================================
// MYP YEAR 5 (Grade 10, Ages 15-16) - Standard & Extended
// =============================================================================

const mypYear5Standards: IBMYPDPMathStandard[] = [
  // NUMERICAL AND ABSTRACT REASONING
  {
    notation: 'IB.MYP.Y5.MA.NR.1',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Complex Numbers Introduction',
    level: 'extended',
    description: 'Understand the concept of imaginary and complex numbers',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y5.MA.NR.2',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Polynomial Functions',
    level: 'standard',
    description: 'Analyze and graph polynomial functions of higher degree',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y5.MA.NR.3',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Rational Expressions',
    level: 'standard',
    description: 'Simplify, multiply, divide, add, and subtract rational expressions',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y5.MA.NR.4',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Radical Expressions',
    level: 'standard',
    description: 'Simplify and operate with radical expressions',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y5.MA.NR.5',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Sequences and Series',
    level: 'standard',
    description: 'Analyze arithmetic and geometric sequences and their sums',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y5.MA.NR.6',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Logarithms',
    level: 'extended',
    description: 'Understand logarithms as inverses of exponentials and apply log laws',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y5.MA.NR.7',
    branch: 'Numerical and Abstract Reasoning',
    topic: 'Mathematical Proof',
    level: 'extended',
    description: 'Construct simple mathematical proofs and understand logical reasoning',
    assessmentCriteria: ['B', 'C'],
  },

  // THINKING WITH MODELS
  {
    notation: 'IB.MYP.Y5.MA.TM.1',
    branch: 'Thinking with Models',
    topic: 'Exponential and Logarithmic Models',
    level: 'standard',
    description: 'Model real-world situations using exponential and logarithmic functions',
    assessmentCriteria: ['B', 'D'],
  },
  {
    notation: 'IB.MYP.Y5.MA.TM.2',
    branch: 'Thinking with Models',
    topic: 'Polynomial Models',
    level: 'standard',
    description: 'Use polynomial functions to model complex relationships',
    assessmentCriteria: ['B', 'D'],
  },
  {
    notation: 'IB.MYP.Y5.MA.TM.3',
    branch: 'Thinking with Models',
    topic: 'Periodic Functions',
    level: 'extended',
    description: 'Model periodic phenomena using trigonometric functions',
    assessmentCriteria: ['B', 'D'],
  },
  {
    notation: 'IB.MYP.Y5.MA.TM.4',
    branch: 'Thinking with Models',
    topic: 'Optimization',
    level: 'extended',
    description: 'Use mathematical models to optimize real-world situations',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y5.MA.TM.5',
    branch: 'Thinking with Models',
    topic: 'Composite Functions',
    level: 'standard',
    description: 'Understand and work with composition of functions',
    assessmentCriteria: ['A', 'B'],
  },

  // SPATIAL REASONING
  {
    notation: 'IB.MYP.Y5.MA.SR.1',
    branch: 'Spatial Reasoning',
    topic: 'Unit Circle',
    level: 'standard',
    description: 'Understand the unit circle and radian measure',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y5.MA.SR.2',
    branch: 'Spatial Reasoning',
    topic: 'Trigonometric Functions',
    level: 'standard',
    description: 'Graph and analyze sine, cosine, and tangent functions',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y5.MA.SR.3',
    branch: 'Spatial Reasoning',
    topic: 'Trigonometric Identities',
    level: 'extended',
    description: 'Use and prove fundamental trigonometric identities',
    assessmentCriteria: ['A', 'B'],
  },
  {
    notation: 'IB.MYP.Y5.MA.SR.4',
    branch: 'Spatial Reasoning',
    topic: 'Vector Operations',
    level: 'extended',
    description: 'Perform operations with vectors including dot product',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y5.MA.SR.5',
    branch: 'Spatial Reasoning',
    topic: 'Transformations',
    level: 'standard',
    description: 'Apply and combine geometric transformations',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y5.MA.SR.6',
    branch: 'Spatial Reasoning',
    topic: '3D Geometry',
    level: 'standard',
    description: 'Solve problems involving 3D shapes including spheres',
    assessmentCriteria: ['A', 'D'],
  },

  // REASONING WITH DATA
  {
    notation: 'IB.MYP.Y5.MA.RD.1',
    branch: 'Reasoning with Data',
    topic: 'Normal Distribution',
    level: 'extended',
    description: 'Understand properties of the normal distribution',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y5.MA.RD.2',
    branch: 'Reasoning with Data',
    topic: 'Correlation and Regression',
    level: 'standard',
    description: 'Calculate and interpret correlation coefficients and regression lines',
    assessmentCriteria: ['A', 'D'],
  },
  {
    notation: 'IB.MYP.Y5.MA.RD.3',
    branch: 'Reasoning with Data',
    topic: 'Probability Trees',
    level: 'standard',
    description: 'Use tree diagrams to calculate probabilities of sequential events',
    assessmentCriteria: ['A', 'C'],
  },
  {
    notation: 'IB.MYP.Y5.MA.RD.4',
    branch: 'Reasoning with Data',
    topic: 'Sampling Methods',
    level: 'standard',
    description: 'Understand different sampling methods and their applications',
    assessmentCriteria: ['C', 'D'],
  },
  {
    notation: 'IB.MYP.Y5.MA.RD.5',
    branch: 'Reasoning with Data',
    topic: 'Statistical Inference',
    level: 'extended',
    description: 'Make inferences about populations based on sample data',
    assessmentCriteria: ['A', 'D'],
  },
];

// =============================================================================
// DP YEAR 1 (Grade 11, Ages 16-17) - Analysis & Approaches
// =============================================================================

const dpYear1Standards: IBMYPDPMathStandard[] = [
  // NUMBER AND ALGEBRA
  {
    notation: 'IB.DP.Y1.MA.NA.1',
    branch: 'Number and Algebra',
    topic: 'Sequences and Series',
    level: 'SL',
    description: 'Work with arithmetic and geometric sequences, including sigma notation',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y1.MA.NA.2',
    branch: 'Number and Algebra',
    topic: 'Exponents and Logarithms',
    level: 'SL',
    description: 'Apply laws of exponents and logarithms to solve equations',
    assessmentCriteria: ['Knowledge', 'Reasoning'],
  },
  {
    notation: 'IB.DP.Y1.MA.NA.3',
    branch: 'Number and Algebra',
    topic: 'Binomial Theorem',
    level: 'SL',
    description: 'Expand binomial expressions using the binomial theorem',
    assessmentCriteria: ['Knowledge', 'Communication'],
  },
  {
    notation: 'IB.DP.Y1.MA.NA.4',
    branch: 'Number and Algebra',
    topic: 'Proof by Induction',
    level: 'HL',
    description: 'Construct proofs using mathematical induction',
    assessmentCriteria: ['Reasoning', 'Communication'],
  },
  {
    notation: 'IB.DP.Y1.MA.NA.5',
    branch: 'Number and Algebra',
    topic: 'Complex Numbers',
    level: 'HL',
    description: 'Perform operations with complex numbers in Cartesian and polar form',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y1.MA.NA.6',
    branch: 'Number and Algebra',
    topic: 'Polynomials',
    level: 'HL',
    description: 'Analyze polynomial functions and apply the factor and remainder theorems',
    assessmentCriteria: ['Knowledge', 'Reasoning'],
  },

  // FUNCTIONS
  {
    notation: 'IB.DP.Y1.MA.FN.1',
    branch: 'Functions',
    topic: 'Function Properties',
    level: 'SL',
    description: 'Analyze functions including domain, range, and asymptotes',
    assessmentCriteria: ['Knowledge', 'Communication'],
  },
  {
    notation: 'IB.DP.Y1.MA.FN.2',
    branch: 'Functions',
    topic: 'Function Transformations',
    level: 'SL',
    description: 'Apply transformations to functions and understand their effects',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y1.MA.FN.3',
    branch: 'Functions',
    topic: 'Quadratic Functions',
    level: 'SL',
    description: 'Analyze quadratic functions and solve related problems',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y1.MA.FN.4',
    branch: 'Functions',
    topic: 'Rational Functions',
    level: 'HL',
    description: 'Analyze and graph rational functions',
    assessmentCriteria: ['Knowledge', 'Communication'],
  },
  {
    notation: 'IB.DP.Y1.MA.FN.5',
    branch: 'Functions',
    topic: 'Exponential and Logarithmic Functions',
    level: 'SL',
    description: 'Model and solve problems using exponential and logarithmic functions',
    assessmentCriteria: ['Problem Solving', 'Inquiry'],
  },

  // GEOMETRY AND TRIGONOMETRY
  {
    notation: 'IB.DP.Y1.MA.GT.1',
    branch: 'Geometry and Trigonometry',
    topic: 'Radian Measure',
    level: 'SL',
    description: 'Work with angles in radians and convert between degrees and radians',
    assessmentCriteria: ['Knowledge', 'Communication'],
  },
  {
    notation: 'IB.DP.Y1.MA.GT.2',
    branch: 'Geometry and Trigonometry',
    topic: 'Trigonometric Functions',
    level: 'SL',
    description: 'Graph and analyze trigonometric functions and their inverses',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y1.MA.GT.3',
    branch: 'Geometry and Trigonometry',
    topic: 'Trigonometric Identities',
    level: 'SL',
    description: 'Use and prove trigonometric identities',
    assessmentCriteria: ['Knowledge', 'Reasoning'],
  },
  {
    notation: 'IB.DP.Y1.MA.GT.4',
    branch: 'Geometry and Trigonometry',
    topic: 'Sine and Cosine Rules',
    level: 'SL',
    description: 'Apply sine and cosine rules to solve triangles',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y1.MA.GT.5',
    branch: 'Geometry and Trigonometry',
    topic: 'Vectors in 2D and 3D',
    level: 'HL',
    description: 'Perform vector operations and understand geometric applications',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },

  // STATISTICS AND PROBABILITY
  {
    notation: 'IB.DP.Y1.MA.SP.1',
    branch: 'Statistics and Probability',
    topic: 'Descriptive Statistics',
    level: 'SL',
    description: 'Calculate and interpret measures of central tendency and dispersion',
    assessmentCriteria: ['Knowledge', 'Communication'],
  },
  {
    notation: 'IB.DP.Y1.MA.SP.2',
    branch: 'Statistics and Probability',
    topic: 'Probability Concepts',
    level: 'SL',
    description: 'Apply probability rules including conditional probability and independence',
    assessmentCriteria: ['Knowledge', 'Reasoning'],
  },
  {
    notation: 'IB.DP.Y1.MA.SP.3',
    branch: 'Statistics and Probability',
    topic: 'Discrete Random Variables',
    level: 'SL',
    description: 'Work with discrete random variables and their distributions',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y1.MA.SP.4',
    branch: 'Statistics and Probability',
    topic: 'Binomial Distribution',
    level: 'SL',
    description: 'Apply the binomial distribution to solve probability problems',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },

  // CALCULUS
  {
    notation: 'IB.DP.Y1.MA.CA.1',
    branch: 'Calculus',
    topic: 'Limits and Continuity',
    level: 'SL',
    description: 'Understand limits and continuity of functions',
    assessmentCriteria: ['Knowledge', 'Reasoning'],
  },
  {
    notation: 'IB.DP.Y1.MA.CA.2',
    branch: 'Calculus',
    topic: 'Differentiation',
    level: 'SL',
    description: 'Differentiate polynomial, trigonometric, exponential, and logarithmic functions',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y1.MA.CA.3',
    branch: 'Calculus',
    topic: 'Applications of Derivatives',
    level: 'SL',
    description: 'Apply derivatives to find tangents, normals, and optimization',
    assessmentCriteria: ['Problem Solving', 'Inquiry'],
  },
  {
    notation: 'IB.DP.Y1.MA.CA.4',
    branch: 'Calculus',
    topic: 'Integration',
    level: 'SL',
    description: 'Integrate functions and understand the fundamental theorem of calculus',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
];

// =============================================================================
// DP YEAR 2 (Grade 12, Ages 17-18) - Analysis & Approaches
// =============================================================================

const dpYear2Standards: IBMYPDPMathStandard[] = [
  // NUMBER AND ALGEBRA (Advanced)
  {
    notation: 'IB.DP.Y2.MA.NA.1',
    branch: 'Number and Algebra',
    topic: 'Systems of Equations',
    level: 'HL',
    description: 'Solve systems of linear equations using matrices',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y2.MA.NA.2',
    branch: 'Number and Algebra',
    topic: 'Complex Number Applications',
    level: 'HL',
    description: 'Apply De Moivre\'s theorem and find roots of complex numbers',
    assessmentCriteria: ['Knowledge', 'Reasoning'],
  },
  {
    notation: 'IB.DP.Y2.MA.NA.3',
    branch: 'Number and Algebra',
    topic: 'Counting Principles',
    level: 'SL',
    description: 'Apply permutations and combinations to solve counting problems',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },

  // FUNCTIONS (Advanced)
  {
    notation: 'IB.DP.Y2.MA.FN.1',
    branch: 'Functions',
    topic: 'Polynomial Division',
    level: 'HL',
    description: 'Perform polynomial division and apply to solve equations',
    assessmentCriteria: ['Knowledge', 'Reasoning'],
  },
  {
    notation: 'IB.DP.Y2.MA.FN.2',
    branch: 'Functions',
    topic: 'Partial Fractions',
    level: 'HL',
    description: 'Decompose rational expressions into partial fractions',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },

  // GEOMETRY AND TRIGONOMETRY (Advanced)
  {
    notation: 'IB.DP.Y2.MA.GT.1',
    branch: 'Geometry and Trigonometry',
    topic: 'Vector Equations',
    level: 'HL',
    description: 'Write and interpret vector equations of lines and planes',
    assessmentCriteria: ['Knowledge', 'Communication'],
  },
  {
    notation: 'IB.DP.Y2.MA.GT.2',
    branch: 'Geometry and Trigonometry',
    topic: 'Vector Products',
    level: 'HL',
    description: 'Calculate and apply scalar and cross products',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y2.MA.GT.3',
    branch: 'Geometry and Trigonometry',
    topic: 'Trigonometric Equations',
    level: 'SL',
    description: 'Solve trigonometric equations within given domains',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },

  // STATISTICS AND PROBABILITY (Advanced)
  {
    notation: 'IB.DP.Y2.MA.SP.1',
    branch: 'Statistics and Probability',
    topic: 'Normal Distribution',
    level: 'SL',
    description: 'Apply the normal distribution to solve probability problems',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y2.MA.SP.2',
    branch: 'Statistics and Probability',
    topic: 'Regression and Correlation',
    level: 'SL',
    description: 'Calculate and interpret correlation and regression',
    assessmentCriteria: ['Knowledge', 'Inquiry'],
  },
  {
    notation: 'IB.DP.Y2.MA.SP.3',
    branch: 'Statistics and Probability',
    topic: 'Hypothesis Testing',
    level: 'HL',
    description: 'Perform hypothesis tests for means and proportions',
    assessmentCriteria: ['Reasoning', 'Inquiry'],
  },
  {
    notation: 'IB.DP.Y2.MA.SP.4',
    branch: 'Statistics and Probability',
    topic: 'Continuous Distributions',
    level: 'HL',
    description: 'Work with continuous probability distributions',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },

  // CALCULUS (Advanced)
  {
    notation: 'IB.DP.Y2.MA.CA.1',
    branch: 'Calculus',
    topic: 'Advanced Differentiation',
    level: 'SL',
    description: 'Apply chain rule, product rule, and quotient rule',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y2.MA.CA.2',
    branch: 'Calculus',
    topic: 'Implicit Differentiation',
    level: 'HL',
    description: 'Differentiate implicitly defined functions',
    assessmentCriteria: ['Knowledge', 'Reasoning'],
  },
  {
    notation: 'IB.DP.Y2.MA.CA.3',
    branch: 'Calculus',
    topic: 'Related Rates',
    level: 'HL',
    description: 'Solve related rates problems using differentiation',
    assessmentCriteria: ['Problem Solving', 'Inquiry'],
  },
  {
    notation: 'IB.DP.Y2.MA.CA.4',
    branch: 'Calculus',
    topic: 'Integration Techniques',
    level: 'HL',
    description: 'Apply integration by substitution and parts',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y2.MA.CA.5',
    branch: 'Calculus',
    topic: 'Definite Integrals',
    level: 'SL',
    description: 'Calculate areas and volumes using definite integrals',
    assessmentCriteria: ['Problem Solving', 'Inquiry'],
  },
  {
    notation: 'IB.DP.Y2.MA.CA.6',
    branch: 'Calculus',
    topic: 'Differential Equations',
    level: 'HL',
    description: 'Solve first-order differential equations',
    assessmentCriteria: ['Knowledge', 'Problem Solving'],
  },
  {
    notation: 'IB.DP.Y2.MA.CA.7',
    branch: 'Calculus',
    topic: 'Maclaurin Series',
    level: 'HL',
    description: 'Find and use Maclaurin series expansions',
    assessmentCriteria: ['Knowledge', 'Reasoning'],
  },

  // EXPLORATION
  {
    notation: 'IB.DP.Y2.MA.EX.1',
    branch: 'Mathematical Exploration',
    topic: 'Internal Assessment',
    level: 'SL',
    description: 'Complete an independent mathematical exploration demonstrating personal engagement',
    assessmentCriteria: ['Communication', 'Inquiry', 'Reasoning'],
  },
];

// =============================================================================
// CURRICULUM EXPORT
// =============================================================================

export const ibMYPDPMathCurriculum: IBMYPDPMathCurriculum = {
  code: 'IB_MYP_DP',
  name: 'International Baccalaureate MYP & DP Mathematics',
  country: 'International',
  version: '2020/2019',
  sourceUrl: 'https://www.ibo.org/programmes/',
  subject: 'Mathematics',
  years: [
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
    {
      year: 4,
      grade: 9,
      programme: 'MYP',
      yearLabel: 'MYP Year 4 (Grade 9)',
      ageRangeMin: 14,
      ageRangeMax: 15,
      standards: mypYear4Standards,
    },
    {
      year: 5,
      grade: 10,
      programme: 'MYP',
      yearLabel: 'MYP Year 5 (Grade 10)',
      ageRangeMin: 15,
      ageRangeMax: 16,
      standards: mypYear5Standards,
    },
    {
      year: 1,
      grade: 11,
      programme: 'DP',
      yearLabel: 'DP Year 1 (Grade 11)',
      ageRangeMin: 16,
      ageRangeMax: 17,
      standards: dpYear1Standards,
    },
    {
      year: 2,
      grade: 12,
      programme: 'DP',
      yearLabel: 'DP Year 2 (Grade 12)',
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
 * Get standards for a specific grade
 * @param grade Grade number (6-12)
 */
export function getIBMathStandardsForGrade(grade: number): IBMYPDPMathStandard[] {
  const yearData = ibMYPDPMathCurriculum.years.find((y) => y.grade === grade);
  return yearData?.standards || [];
}

/**
 * Get all standards for MYP only
 */
export function getIBMYPMathStandards(): IBMYPDPMathStandard[] {
  return ibMYPDPMathCurriculum.years
    .filter((y) => y.programme === 'MYP')
    .flatMap((y) => y.standards);
}

/**
 * Get all standards for DP only
 */
export function getIBDPMathStandards(): IBMYPDPMathStandard[] {
  return ibMYPDPMathCurriculum.years
    .filter((y) => y.programme === 'DP')
    .flatMap((y) => y.standards);
}

/**
 * Get total count of IB MYP/DP Math standards
 */
export function getIBMathStandardsCount(): number {
  return ibMYPDPMathCurriculum.years.reduce((total, year) => total + year.standards.length, 0);
}
