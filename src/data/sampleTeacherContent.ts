/**
 * Sample Teacher Content Library
 *
 * Pre-generated lessons, quizzes, and flashcards for teacher onboarding.
 * These match EXACTLY the output format of AI-generated content.
 *
 * Display Strategy: Show 3 samples at a time, rotate weekly.
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface SampleLessonContent {
  title: string;
  summary: string;
  objectives: string[];
  sections: Array<{
    title: string;
    content: string;
    duration?: number;
    activities?: Array<{
      name: string;
      description: string;
      materials: string[];
      duration: number;
      discussionQuestions: string[];
    }>;
    teachingTips?: string[];
    visualAids?: string[];
    realWorldConnections?: string[];
  }>;
  vocabulary: Array<{
    term: string;
    definition: string;
    example: string;
    memoryAid?: string;
  }>;
  practiceExercises: Array<{
    question: string;
    type: 'practice';
    hint: string;
    answer: string;
  }>;
  assessment: {
    questions: Array<{
      question: string;
      type: 'multiple_choice' | 'short_answer' | 'true_false' | 'fill_blank';
      options?: string[];
      correctAnswer: string;
      explanation: string;
      points: number;
      difficulty: 'easy' | 'medium' | 'hard';
    }>;
    totalPoints: number;
    passingScore: number;
    scoringGuide: string;
  };
  summaryPoints: string[];
  reviewQuestions: string[];
  teacherNotes: string;
  additionalResources: string[];
  prerequisites: string[];
  nextSteps: string;
}

export interface SampleQuizContent {
  title: string;
  questions: Array<{
    id: string;
    question: string;
    type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'short_answer';
    options?: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
  }>;
  totalPoints: number;
  estimatedTime: number;
}

export interface SampleFlashcardContent {
  title: string;
  cards: Array<{
    id: string;
    front: string;
    back: string;
    hint?: string;
    category?: string;
  }>;
}

export interface SampleTeacherContent {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  contentType: string;
  lessonContent: SampleLessonContent;
  quizContent: SampleQuizContent;
  flashcardContent: SampleFlashcardContent;
  thumbnail?: string;
  estimatedDuration: number;
  tags: string[];
  curriculum: string;
}

export interface SampleAudioUpdate {
  id: string;
  title: string;
  script: string;
  audioUrl: string;
  duration: number;
  language: string;
  voiceId: string;
  lessonIds: string[];
  status: string;
}

// ============================================
// SAMPLE 1: Math Grade 3 - Fractions
// ============================================

const SAMPLE_MATH_FRACTIONS_3: SampleTeacherContent = {
  id: 'sample_math_fractions_3',
  title: 'Introduction to Fractions',
  description: 'A complete lesson on understanding fractions with visual models, hands-on activities, and real-world examples perfect for 3rd graders.',
  subject: 'MATH',
  gradeLevel: '3',
  contentType: 'LESSON',
  estimatedDuration: 45,
  tags: ['fractions', 'visual learning', 'manipulatives', 'part-whole'],
  curriculum: 'american',
  lessonContent: {
    title: 'Introduction to Fractions',
    summary: 'Students will learn the foundational concepts of fractions, including how to read, write, and represent simple fractions using visual models. This lesson emphasizes understanding fractions as parts of a whole through hands-on activities and real-world connections.',
    objectives: [
      'Understand that a fraction represents equal parts of a whole',
      'Identify and name the numerator and denominator in a fraction',
      'Read and write fractions in standard form (e.g., 1/2, 3/4)',
      'Represent fractions using visual models such as circles, rectangles, and number lines',
      'Compare fractions with the same denominator'
    ],
    sections: [
      {
        title: 'What is a Fraction?',
        content: 'A fraction is a way to represent a part of a whole. When we divide something into equal parts, each part is called a fraction of the whole.\n\nImagine you have a pizza cut into 4 equal slices. If you eat 1 slice, you have eaten 1/4 (one-fourth) of the pizza. The whole pizza had 4 parts, and you ate 1 of those parts.\n\nFractions are everywhere in our daily lives! When you share a cookie with a friend, you might break it in half - that\'s 1/2 for each person. When your parent cuts an apple into pieces, each piece is a fraction of the whole apple.',
        duration: 10,
        activities: [
          {
            name: 'Pizza Fraction Activity',
            description: 'Give each student a paper circle (pizza). Have them fold it in half, then in half again to create 4 equal parts. Color different amounts and identify the fractions.',
            materials: ['Paper circles', 'Crayons or markers', 'Scissors'],
            duration: 8,
            discussionQuestions: [
              'How many equal parts does your pizza have?',
              'If you colored 2 parts, what fraction did you color?',
              'What do you notice about the size of each part?'
            ]
          }
        ],
        teachingTips: [
          'Emphasize the word "equal" - fractions only work when parts are equal in size',
          'Use familiar objects like pizza, pie, and chocolate bars to make fractions relatable'
        ],
        visualAids: ['Circle divided into equal parts', 'Rectangle fraction bars'],
        realWorldConnections: ['Sharing food equally', 'Telling time (half past, quarter past)', 'Measuring ingredients in cooking']
      },
      {
        title: 'Parts of a Fraction',
        content: 'Every fraction has two important numbers:\n\n**Numerator (Top Number)**: This tells us HOW MANY parts we have or are talking about.\n\n**Denominator (Bottom Number)**: This tells us how many TOTAL equal parts the whole is divided into.\n\nIn the fraction 3/4:\n- The numerator is 3 (we have 3 parts)\n- The denominator is 4 (the whole is divided into 4 equal parts)\n\nThink of it like this: The denominator is the "name" of the fraction (fourths, halves, thirds), and the numerator tells us how many of those parts we have.',
        duration: 12,
        activities: [
          {
            name: 'Fraction Label Hunt',
            description: 'Display various fraction diagrams around the room. Students walk around with a recording sheet, identifying and labeling the numerator and denominator for each fraction they find.',
            materials: ['Fraction diagram posters', 'Recording sheets', 'Pencils'],
            duration: 10,
            discussionQuestions: [
              'Which number is always on top?',
              'What does the bottom number tell us?',
              'Can the numerator ever be bigger than the denominator?'
            ]
          }
        ],
        teachingTips: [
          'Use the memory trick: "Denominator is DOWN" (both start with D)',
          'Have students say the fraction parts out loud: "3 out of 4 equal parts"'
        ],
        visualAids: ['Labeled fraction diagram showing numerator and denominator'],
        realWorldConnections: ['Sports scores', 'Test scores (8 out of 10 correct = 8/10)']
      },
      {
        title: 'Representing Fractions',
        content: 'We can show fractions in different ways:\n\n**1. Area Models (Shapes)**\nDivide a shape into equal parts and shade the fraction amount. Circles and rectangles work great!\n\n**2. Number Lines**\nMark equal spaces on a number line between 0 and 1. Each mark represents a fraction.\n\n**3. Sets of Objects**\nUse groups of items. If you have 5 apples and 2 are red, then 2/5 of the apples are red.\n\nAll these methods help us see and understand fractions in different situations.',
        duration: 12,
        activities: [
          {
            name: 'Fraction Representation Stations',
            description: 'Set up three stations: (1) Shape models with pattern blocks, (2) Number line practice, (3) Object sets with counters. Students rotate through each station representing the same fractions in different ways.',
            materials: ['Pattern blocks', 'Number line templates', 'Two-color counters', 'Recording sheets'],
            duration: 15,
            discussionQuestions: [
              'Which representation was easiest for you? Why?',
              'How are the representations similar?',
              'When might you use each type in real life?'
            ]
          }
        ],
        teachingTips: [
          'Let students choose their preferred representation method',
          'Connect number lines to rulers and measuring'
        ],
        visualAids: ['Area model examples', 'Number line with fractions marked', 'Set model diagrams'],
        realWorldConnections: ['Reading rulers (inches divided into fractions)', 'Pie charts and graphs']
      },
      {
        title: 'Comparing Fractions with Same Denominators',
        content: 'When fractions have the SAME denominator, comparing them is easy! Just look at the numerators.\n\n**Example**: Which is greater, 2/5 or 4/5?\n\nBoth fractions are "fifths" (same denominator of 5). Since 4 is greater than 2, then 4/5 is greater than 2/5.\n\nThink of it like pizza slices: Would you rather have 2 slices of a pizza cut into 5 pieces, or 4 slices? More slices of the same size pizza means more pizza!\n\n**Key Rule**: Same denominator → Compare numerators → Bigger numerator = Bigger fraction',
        duration: 11,
        activities: [
          {
            name: 'Fraction Comparison Game',
            description: 'Students work in pairs with fraction cards (all same denominator). Each player flips a card, and they determine which fraction is greater. The player with the greater fraction wins both cards.',
            materials: ['Fraction comparison cards', 'Comparison symbols (<, >, =)'],
            duration: 10,
            discussionQuestions: [
              'How do you know which fraction is greater?',
              'What if both fractions are the same?',
              'Does this work when denominators are different?'
            ]
          }
        ],
        teachingTips: [
          'Use visual models alongside symbolic comparisons',
          'Preview that comparing fractions with different denominators requires different strategies'
        ],
        visualAids: ['Side-by-side fraction bars for comparison'],
        realWorldConnections: ['Comparing test scores', 'Determining who ate more pizza']
      }
    ],
    vocabulary: [
      {
        term: 'Fraction',
        definition: 'A number that represents part of a whole or part of a group',
        example: '1/2 represents one part out of two equal parts',
        memoryAid: 'Think "fraction" = "a piece of the action"'
      },
      {
        term: 'Numerator',
        definition: 'The top number in a fraction that tells how many parts we have',
        example: 'In 3/4, the numerator is 3',
        memoryAid: 'Numerator = Number of parts (both start with N)'
      },
      {
        term: 'Denominator',
        definition: 'The bottom number in a fraction that tells how many equal parts the whole is divided into',
        example: 'In 3/4, the denominator is 4',
        memoryAid: 'Denominator is DOWN (both start with D)'
      },
      {
        term: 'Equal Parts',
        definition: 'Parts that are exactly the same size',
        example: 'A pizza cut into 4 equal parts means each slice is the same size',
        memoryAid: 'Equal = Even = Same size'
      },
      {
        term: 'Unit Fraction',
        definition: 'A fraction with 1 as the numerator',
        example: '1/2, 1/3, 1/4, and 1/5 are all unit fractions',
        memoryAid: 'Unit = One piece'
      }
    ],
    practiceExercises: [
      {
        question: 'Draw a rectangle and divide it into 6 equal parts. Shade 4 parts. What fraction did you shade?',
        type: 'practice',
        hint: 'Count how many parts you shaded (numerator) and how many total parts there are (denominator).',
        answer: '4/6 - The numerator is 4 (shaded parts) and the denominator is 6 (total equal parts).'
      },
      {
        question: 'Maria ate 2/8 of a cake. Her brother ate 5/8 of the same cake. Who ate more cake?',
        type: 'practice',
        hint: 'The denominators are the same, so compare the numerators.',
        answer: 'Her brother ate more cake. Since both fractions have the same denominator (8), we compare numerators: 5 > 2, so 5/8 > 2/8.'
      },
      {
        question: 'Write a fraction for this situation: A bag has 10 marbles, and 3 of them are blue.',
        type: 'practice',
        hint: 'What part of the whole bag is blue?',
        answer: '3/10 - Three marbles out of ten total marbles are blue.'
      }
    ],
    assessment: {
      questions: [
        {
          question: 'In the fraction 5/8, what does the 8 represent?',
          type: 'multiple_choice',
          options: [
            'The number of parts we have',
            'The total number of equal parts in the whole',
            'The number of wholes',
            'The number of fractions'
          ],
          correctAnswer: 'The total number of equal parts in the whole',
          explanation: 'The denominator (bottom number) always tells us how many equal parts the whole is divided into. In 5/8, the whole is divided into 8 equal parts.',
          points: 2,
          difficulty: 'easy'
        },
        {
          question: 'Which fraction is greater: 3/6 or 5/6?',
          type: 'multiple_choice',
          options: ['3/6', '5/6', 'They are equal', 'Cannot be determined'],
          correctAnswer: '5/6',
          explanation: 'When fractions have the same denominator, the fraction with the larger numerator is greater. Since 5 > 3, then 5/6 > 3/6.',
          points: 2,
          difficulty: 'easy'
        },
        {
          question: 'True or False: The fraction 1/4 represents one whole divided into four equal parts, with one part selected.',
          type: 'true_false',
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'This is exactly what 1/4 means - one part out of four equal parts.',
          points: 1,
          difficulty: 'easy'
        },
        {
          question: 'A rectangle is divided into 5 equal parts. If 2 parts are shaded, the shaded part represents _____.',
          type: 'fill_blank',
          correctAnswer: '2/5',
          explanation: 'The numerator is 2 (shaded parts) and the denominator is 5 (total parts), giving us the fraction 2/5.',
          points: 2,
          difficulty: 'medium'
        },
        {
          question: 'Explain why 4/4 equals one whole.',
          type: 'short_answer',
          correctAnswer: 'When the numerator equals the denominator, it means we have ALL the parts that make up the whole. 4/4 means we have 4 parts out of 4 total parts, which is the entire thing - one whole.',
          explanation: 'A complete answer should explain that having all parts (numerator = denominator) means having the complete whole.',
          points: 3,
          difficulty: 'medium'
        }
      ],
      totalPoints: 10,
      passingScore: 7,
      scoringGuide: 'Award full points for correct answers with proper reasoning. For short answer, accept equivalent explanations that demonstrate understanding of the concept.'
    },
    summaryPoints: [
      'A fraction represents part of a whole or part of a group',
      'The numerator (top) tells how many parts we have; the denominator (bottom) tells how many equal parts total',
      'Fractions can be shown using shapes, number lines, or sets of objects',
      'When comparing fractions with the same denominator, the larger numerator means the larger fraction'
    ],
    reviewQuestions: [
      'What are the two parts of a fraction called, and what does each represent?',
      'How can you represent the fraction 3/4 using a shape?',
      'If two fractions have the same denominator, how do you know which is greater?'
    ],
    teacherNotes: 'Common misconceptions: Students may think the larger denominator means a larger fraction (e.g., thinking 1/8 > 1/4). Address this by showing visual models side by side. For struggling students, focus on unit fractions first (1/2, 1/3, 1/4) before moving to other numerators. For advanced students, introduce equivalent fractions as an extension.',
    additionalResources: [
      'Virtual fraction manipulatives at mathplayground.com',
      'Fraction bars printable templates'
    ],
    prerequisites: [
      'Understanding of equal/unequal',
      'Basic division concept (sharing equally)',
      'Number recognition to 12'
    ],
    nextSteps: 'Next lesson will cover equivalent fractions and comparing fractions with different denominators.'
  },
  quizContent: {
    title: 'Introduction to Fractions Quiz',
    questions: [
      {
        id: 'q1',
        question: 'What is the numerator in the fraction 3/7?',
        type: 'multiple_choice',
        options: ['3', '7', '10', '21'],
        correctAnswer: '3',
        explanation: 'The numerator is the top number in a fraction. In 3/7, the numerator is 3.',
        difficulty: 'easy',
        points: 1
      },
      {
        id: 'q2',
        question: 'What is the denominator in the fraction 5/9?',
        type: 'multiple_choice',
        options: ['5', '9', '14', '45'],
        correctAnswer: '9',
        explanation: 'The denominator is the bottom number in a fraction. In 5/9, the denominator is 9.',
        difficulty: 'easy',
        points: 1
      },
      {
        id: 'q3',
        question: 'A pie is cut into 8 equal slices. Tom eats 3 slices. What fraction of the pie did Tom eat?',
        type: 'multiple_choice',
        options: ['8/3', '3/8', '3/5', '5/8'],
        correctAnswer: '3/8',
        explanation: 'Tom ate 3 slices out of 8 total slices, so he ate 3/8 of the pie.',
        difficulty: 'easy',
        points: 1
      },
      {
        id: 'q4',
        question: 'Which fraction is greater: 2/5 or 4/5?',
        type: 'multiple_choice',
        options: ['2/5', '4/5', 'They are equal', 'Cannot compare'],
        correctAnswer: '4/5',
        explanation: 'Both fractions have the same denominator (5), so we compare numerators. Since 4 > 2, then 4/5 > 2/5.',
        difficulty: 'easy',
        points: 1
      },
      {
        id: 'q5',
        question: 'True or False: In a fraction, the denominator tells us how many parts we are counting.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'The denominator tells us how many equal parts the whole is divided into. The NUMERATOR tells us how many parts we are counting.',
        difficulty: 'medium',
        points: 1
      },
      {
        id: 'q6',
        question: 'Which fraction represents the shaded part if 2 out of 6 equal parts are shaded?',
        type: 'multiple_choice',
        options: ['6/2', '2/6', '4/6', '2/4'],
        correctAnswer: '2/6',
        explanation: '2 shaded parts out of 6 total equal parts = 2/6.',
        difficulty: 'easy',
        points: 1
      },
      {
        id: 'q7',
        question: 'Put the correct symbol: 5/8 ___ 3/8',
        type: 'multiple_choice',
        options: ['<', '>', '='],
        correctAnswer: '>',
        explanation: 'Same denominators, so compare numerators: 5 > 3, therefore 5/8 > 3/8.',
        difficulty: 'medium',
        points: 1
      },
      {
        id: 'q8',
        question: 'A fraction with 1 as the numerator is called a _____ fraction.',
        type: 'fill_blank',
        correctAnswer: 'unit',
        explanation: 'A unit fraction has 1 as its numerator (like 1/2, 1/3, 1/4).',
        difficulty: 'medium',
        points: 1
      },
      {
        id: 'q9',
        question: 'If a rectangle is divided into 4 equal parts and all 4 parts are shaded, what fraction is shaded?',
        type: 'multiple_choice',
        options: ['1/4', '4/4', '4/1', '0/4'],
        correctAnswer: '4/4',
        explanation: '4 parts shaded out of 4 total parts = 4/4, which equals 1 whole.',
        difficulty: 'medium',
        points: 1
      },
      {
        id: 'q10',
        question: 'Explain what the fraction 3/4 means in your own words.',
        type: 'short_answer',
        correctAnswer: '3/4 means that something is divided into 4 equal parts, and we are talking about 3 of those parts.',
        explanation: 'A complete answer should mention both that there are 4 equal parts total and that 3 of them are being referred to.',
        difficulty: 'medium',
        points: 2
      }
    ],
    totalPoints: 12,
    estimatedTime: 15
  },
  flashcardContent: {
    title: 'Fractions Flashcards',
    cards: [
      { id: 'card1', front: 'What is a fraction?', back: 'A number that represents part of a whole or part of a group', hint: 'Think of a pizza slice', category: 'definitions' },
      { id: 'card2', front: 'What is the numerator?', back: 'The top number in a fraction that tells how many parts we have', hint: 'N for Numerator, N for Number of parts', category: 'definitions' },
      { id: 'card3', front: 'What is the denominator?', back: 'The bottom number that tells how many equal parts the whole is divided into', hint: 'D for Denominator, D for Down', category: 'definitions' },
      { id: 'card4', front: 'In 5/8, what is the numerator?', back: '5', hint: 'Look at the top number', category: 'identification' },
      { id: 'card5', front: 'In 5/8, what is the denominator?', back: '8', hint: 'Look at the bottom number', category: 'identification' },
      { id: 'card6', front: 'What is a unit fraction?', back: 'A fraction with 1 as the numerator (like 1/2, 1/3, 1/4)', hint: 'Unit means one', category: 'definitions' },
      { id: 'card7', front: '3 slices out of 8 total slices = ?', back: '3/8', hint: 'Numerator/Denominator', category: 'application' },
      { id: 'card8', front: 'Which is greater: 2/7 or 5/7?', back: '5/7 (same denominator, bigger numerator wins)', hint: 'Compare the top numbers', category: 'comparison' },
      { id: 'card9', front: 'What does 4/4 equal?', back: '1 whole (all parts = the whole)', hint: 'What happens when you have all the parts?', category: 'concepts' },
      { id: 'card10', front: 'Why must parts be EQUAL in fractions?', back: 'So each part represents the same amount of the whole', hint: 'Fair sharing', category: 'concepts' },
      { id: 'card11', front: 'Name 3 ways to represent fractions', back: '1) Area models (shapes) 2) Number lines 3) Sets of objects', hint: 'Visual, linear, grouped', category: 'representations' },
      { id: 'card12', front: 'In 7/10, how many total parts?', back: '10 (the denominator)', hint: 'Bottom number = total parts', category: 'identification' },
      { id: 'card13', front: 'In 7/10, how many parts are we counting?', back: '7 (the numerator)', hint: 'Top number = parts counted', category: 'identification' },
      { id: 'card14', front: 'Compare: 6/9 ___ 4/9', back: '6/9 > 4/9', hint: 'Same bottom, compare tops', category: 'comparison' },
      { id: 'card15', front: 'What real-life example uses fractions?', back: 'Pizza slices, time (half hour), measuring cups, test scores', hint: 'Think about sharing or measuring', category: 'application' }
    ]
  }
};

// ============================================
// SAMPLE 2: Math Grade 9 - Linear Equations
// ============================================

const SAMPLE_MATH_LINEAR_EQ_9: SampleTeacherContent = {
  id: 'sample_math_linear_eq_9',
  title: 'Linear Equations & Graphing',
  description: 'A comprehensive lesson on solving linear equations, graphing lines, and understanding slope-intercept form for 9th grade algebra students.',
  subject: 'MATH',
  gradeLevel: '9',
  contentType: 'LESSON',
  estimatedDuration: 55,
  tags: ['algebra', 'linear equations', 'graphing', 'slope', 'y-intercept'],
  curriculum: 'american',
  lessonContent: {
    title: 'Linear Equations & Graphing',
    summary: 'Students will master solving linear equations in one variable, understand the relationship between equations and their graphs, and learn to use slope-intercept form (y = mx + b) to graph lines efficiently. This lesson builds foundational algebra skills essential for higher mathematics.',
    objectives: [
      'Solve linear equations in one variable using inverse operations',
      'Identify slope and y-intercept from an equation in slope-intercept form',
      'Graph linear equations using slope-intercept form',
      'Convert equations from standard form to slope-intercept form',
      'Interpret slope and y-intercept in real-world contexts'
    ],
    sections: [
      {
        title: 'Solving Linear Equations Review',
        content: 'A linear equation is an equation where the highest power of the variable is 1. To solve linear equations, we use inverse operations to isolate the variable.\n\n**Steps to Solve:**\n1. Simplify both sides (distribute, combine like terms)\n2. Move variable terms to one side using addition/subtraction\n3. Move constant terms to the other side\n4. Divide both sides by the coefficient of the variable\n\n**Example:** Solve 3x + 7 = 22\n- Subtract 7 from both sides: 3x = 15\n- Divide both sides by 3: x = 5\n- Check: 3(5) + 7 = 15 + 7 = 22 ✓',
        duration: 12,
        activities: [
          {
            name: 'Equation Solving Race',
            description: 'Students work in pairs to solve a set of 10 linear equations. First pair to correctly solve all equations wins. Partners must verify each other\'s work.',
            materials: ['Equation worksheet', 'Calculators (optional)', 'Timer'],
            duration: 10,
            discussionQuestions: [
              'What was your strategy for the more complex equations?',
              'Did you find any shortcuts?',
              'What mistakes did you catch while checking?'
            ]
          }
        ],
        teachingTips: [
          'Emphasize checking solutions by substituting back into the original equation',
          'Use balance scale analogy - whatever you do to one side, do to the other'
        ],
        visualAids: ['Balance scale diagram showing equation solving'],
        realWorldConnections: ['Calculating unknown costs', 'Finding break-even points in business']
      },
      {
        title: 'Introduction to Slope-Intercept Form',
        content: 'The slope-intercept form of a linear equation is:\n\n**y = mx + b**\n\nWhere:\n- **m** = slope (rate of change, rise over run)\n- **b** = y-intercept (where the line crosses the y-axis)\n\n**Slope (m)** tells us:\n- How steep the line is\n- Direction: positive slope goes up (↗), negative slope goes down (↘)\n- Rate: how much y changes for each unit increase in x\n\n**Y-intercept (b)** tells us:\n- The starting point on the y-axis\n- The value of y when x = 0\n\n**Example:** y = 2x + 3\n- Slope m = 2 (rise 2, run 1)\n- Y-intercept b = 3 (crosses y-axis at (0, 3))',
        duration: 15,
        activities: [
          {
            name: 'Slope and Intercept Identification',
            description: 'Given 15 equations in slope-intercept form, students identify the slope and y-intercept. Progress from simple (y = 3x + 2) to complex (y = -2/3x - 5).',
            materials: ['Identification worksheet', 'Highlighters (two colors)'],
            duration: 8,
            discussionQuestions: [
              'How can you quickly identify m and b?',
              'What does a negative slope tell you about the line?',
              'What if there is no constant term (like y = 4x)?'
            ]
          }
        ],
        teachingTips: [
          'Use color coding: one color for slope, another for y-intercept',
          'Remind students that "b" is what\'s "being added" at the end'
        ],
        visualAids: ['Annotated equation with m and b labeled', 'Graph showing slope triangle'],
        realWorldConnections: ['Phone plan pricing (base fee + per minute rate)', 'Distance = rate × time + starting position']
      },
      {
        title: 'Graphing Using Slope-Intercept Form',
        content: 'To graph a line using y = mx + b:\n\n**Step 1:** Plot the y-intercept (0, b) on the y-axis\n\n**Step 2:** Use the slope to find another point\n- Write slope as a fraction: m = rise/run\n- From y-intercept, move up/down (rise) and right (run)\n\n**Step 3:** Draw a straight line through both points\n\n**Example:** Graph y = 2x - 1\n1. Plot y-intercept: (0, -1)\n2. Slope = 2 = 2/1, so rise 2, run 1\n3. From (0, -1), go up 2 and right 1 to get (1, 1)\n4. Draw line through (0, -1) and (1, 1)\n\n**Tip:** For negative slopes, you can go down (negative rise) and right, OR up and left.',
        duration: 15,
        activities: [
          {
            name: 'Graphing Gallery Walk',
            description: 'Each student graphs an assigned equation on graph paper. Papers are posted around the room. Students do a gallery walk to check each other\'s graphs, leaving sticky note feedback.',
            materials: ['Graph paper', 'Rulers', 'Colored pencils', 'Sticky notes'],
            duration: 15,
            discussionQuestions: [
              'What common errors did you notice?',
              'How did you verify that graphs were correct?',
              'Which slopes were trickiest to graph?'
            ]
          }
        ],
        teachingTips: [
          'Always use a ruler for straight lines',
          'Plot at least 3 points to verify the line is correct',
          'For fractional slopes, emphasize that slope is rise/run, not run/rise'
        ],
        visualAids: ['Step-by-step graphing example', 'Coordinate plane with plotted line'],
        realWorldConnections: ['Tracking savings over time', 'Predicting future values']
      },
      {
        title: 'Converting to Slope-Intercept Form',
        content: 'Equations aren\'t always given in slope-intercept form. Standard form is **Ax + By = C**.\n\nTo convert to slope-intercept form, solve for y:\n\n**Example:** Convert 2x + 3y = 12 to slope-intercept form\n\n1. Start: 2x + 3y = 12\n2. Subtract 2x: 3y = -2x + 12\n3. Divide by 3: y = -2/3x + 4\n\nNow we can see:\n- Slope m = -2/3\n- Y-intercept b = 4\n\n**Why Convert?**\n- Easier to graph\n- Quickly identify slope and y-intercept\n- Compare lines (parallel lines have same slope)',
        duration: 13,
        activities: [
          {
            name: 'Conversion Practice',
            description: 'Students convert 8 equations from standard form to slope-intercept form, then verify by graphing both forms on the same coordinate plane (they should overlap perfectly).',
            materials: ['Worksheet with standard form equations', 'Graph paper', 'Calculators'],
            duration: 12,
            discussionQuestions: [
              'What\'s the first step in converting?',
              'How do you handle negative coefficients?',
              'Why do both forms graph the same line?'
            ]
          }
        ],
        teachingTips: [
          'Emphasize that different forms represent the same relationship',
          'Practice with equations where y has a coefficient other than 1'
        ],
        visualAids: ['Side-by-side comparison of forms'],
        realWorldConnections: ['Different representations of the same data']
      }
    ],
    vocabulary: [
      {
        term: 'Linear Equation',
        definition: 'An equation whose graph is a straight line; the highest power of the variable is 1',
        example: '3x + 2 = 14 and y = 5x - 3 are linear equations',
        memoryAid: 'Linear = Line'
      },
      {
        term: 'Slope',
        definition: 'The steepness and direction of a line; calculated as rise over run (change in y / change in x)',
        example: 'A slope of 3 means the line rises 3 units for every 1 unit it runs right',
        memoryAid: 'Slope = how much it SLOPES upward or downward'
      },
      {
        term: 'Y-intercept',
        definition: 'The point where a line crosses the y-axis; the value of y when x = 0',
        example: 'In y = 2x + 5, the y-intercept is 5, meaning the line crosses at (0, 5)',
        memoryAid: 'Y-intercept = where it INTERCEPTS the Y-axis'
      },
      {
        term: 'Slope-Intercept Form',
        definition: 'The form y = mx + b, where m is slope and b is y-intercept',
        example: 'y = -4x + 7 has slope -4 and y-intercept 7',
        memoryAid: 'y = mx + b: "m" for mountain (slope), "b" for base (starting point)'
      },
      {
        term: 'Standard Form',
        definition: 'A linear equation written as Ax + By = C, where A, B, and C are integers',
        example: '2x + 5y = 10 is in standard form',
        memoryAid: 'Standard = the formal, official way'
      }
    ],
    practiceExercises: [
      {
        question: 'Solve for x: 4x - 9 = 2x + 7',
        type: 'practice',
        hint: 'Get all x terms on one side first.',
        answer: 'x = 8. Subtract 2x from both sides: 2x - 9 = 7. Add 9: 2x = 16. Divide by 2: x = 8.'
      },
      {
        question: 'Identify the slope and y-intercept of y = -3x + 8',
        type: 'practice',
        hint: 'Compare to y = mx + b',
        answer: 'Slope (m) = -3, Y-intercept (b) = 8'
      },
      {
        question: 'Convert 4x + 2y = 10 to slope-intercept form',
        type: 'practice',
        hint: 'Isolate y by moving the x term and dividing.',
        answer: 'y = -2x + 5. Subtract 4x: 2y = -4x + 10. Divide by 2: y = -2x + 5.'
      }
    ],
    assessment: {
      questions: [
        {
          question: 'Solve: 5x + 3 = 2x + 18',
          type: 'multiple_choice',
          options: ['x = 3', 'x = 5', 'x = 7', 'x = 15'],
          correctAnswer: 'x = 5',
          explanation: '5x + 3 = 2x + 18 → 3x + 3 = 18 → 3x = 15 → x = 5',
          points: 2,
          difficulty: 'easy'
        },
        {
          question: 'What is the slope of the line y = -2/5x + 9?',
          type: 'multiple_choice',
          options: ['-2/5', '9', '5', '-2'],
          correctAnswer: '-2/5',
          explanation: 'In y = mx + b, the coefficient of x is the slope. Here, m = -2/5.',
          points: 2,
          difficulty: 'easy'
        },
        {
          question: 'True or False: A line with a negative slope goes upward from left to right.',
          type: 'true_false',
          options: ['True', 'False'],
          correctAnswer: 'False',
          explanation: 'A negative slope means the line goes downward from left to right.',
          points: 1,
          difficulty: 'easy'
        },
        {
          question: 'Convert 6x - 2y = 8 to slope-intercept form.',
          type: 'short_answer',
          correctAnswer: 'y = 3x - 4',
          explanation: '-2y = -6x + 8 → y = 3x - 4',
          points: 3,
          difficulty: 'medium'
        },
        {
          question: 'A line passes through (0, 4) and has a slope of -2. What is its equation?',
          type: 'multiple_choice',
          options: ['y = -2x + 4', 'y = 4x - 2', 'y = 2x + 4', 'y = -2x - 4'],
          correctAnswer: 'y = -2x + 4',
          explanation: 'The point (0, 4) is the y-intercept, so b = 4. With m = -2, the equation is y = -2x + 4.',
          points: 2,
          difficulty: 'medium'
        }
      ],
      totalPoints: 10,
      passingScore: 7,
      scoringGuide: 'Award full points for correct answers with work shown. Partial credit for conversion problems if method is correct but arithmetic error occurred.'
    },
    summaryPoints: [
      'Linear equations are solved by isolating the variable using inverse operations',
      'Slope-intercept form y = mx + b shows the slope (m) and y-intercept (b) directly',
      'To graph: plot the y-intercept, then use slope (rise/run) to find another point',
      'Any linear equation can be converted to slope-intercept form by solving for y'
    ],
    reviewQuestions: [
      'How do you solve a linear equation with variables on both sides?',
      'What do the m and b represent in y = mx + b?',
      'Describe the steps to graph a line using slope-intercept form.'
    ],
    teacherNotes: 'Common errors: confusing slope with y-intercept, forgetting to distribute negative signs when converting forms, and graphing slope as run/rise instead of rise/run. For struggling students, provide graph paper with pre-labeled axes. For advanced students, introduce point-slope form and parallel/perpendicular line relationships.',
    additionalResources: ['Desmos graphing calculator for visual exploration', 'Khan Academy linear equations unit'],
    prerequisites: ['Operations with integers', 'Solving one-step and two-step equations', 'Plotting points on coordinate plane'],
    nextSteps: 'Next lessons will cover systems of linear equations and linear inequalities.'
  },
  quizContent: {
    title: 'Linear Equations & Graphing Quiz',
    questions: [
      { id: 'q1', question: 'Solve: 7x - 4 = 3x + 12', type: 'multiple_choice', options: ['x = 2', 'x = 4', 'x = 8', 'x = 16'], correctAnswer: 'x = 4', explanation: '7x - 4 = 3x + 12 → 4x = 16 → x = 4', difficulty: 'easy', points: 1 },
      { id: 'q2', question: 'What is the y-intercept of y = 5x - 7?', type: 'multiple_choice', options: ['5', '-7', '7', '-5'], correctAnswer: '-7', explanation: 'In y = mx + b, b is the y-intercept. Here b = -7.', difficulty: 'easy', points: 1 },
      { id: 'q3', question: 'What is the slope of y = -x + 4?', type: 'multiple_choice', options: ['4', '-4', '1', '-1'], correctAnswer: '-1', explanation: 'y = -x + 4 = -1x + 4, so m = -1', difficulty: 'easy', points: 1 },
      { id: 'q4', question: 'A line with slope 0 is:', type: 'multiple_choice', options: ['Vertical', 'Horizontal', 'Diagonal upward', 'Diagonal downward'], correctAnswer: 'Horizontal', explanation: 'Zero slope means no rise, so the line is flat/horizontal.', difficulty: 'medium', points: 1 },
      { id: 'q5', question: 'True or False: The line y = 3x passes through the origin (0,0).', type: 'true_false', options: ['True', 'False'], correctAnswer: 'True', explanation: 'y = 3x has y-intercept 0, so it passes through (0,0).', difficulty: 'medium', points: 1 },
      { id: 'q6', question: 'Convert 3x + y = 9 to slope-intercept form.', type: 'multiple_choice', options: ['y = 3x + 9', 'y = -3x + 9', 'y = 3x - 9', 'y = -3x - 9'], correctAnswer: 'y = -3x + 9', explanation: 'Subtract 3x: y = -3x + 9', difficulty: 'medium', points: 1 },
      { id: 'q7', question: 'Which point is on the line y = 2x + 1?', type: 'multiple_choice', options: ['(1, 2)', '(2, 5)', '(0, 2)', '(3, 5)'], correctAnswer: '(2, 5)', explanation: 'Check: y = 2(2) + 1 = 5. Point (2, 5) works.', difficulty: 'medium', points: 1 },
      { id: 'q8', question: 'A slope of 3/4 means:', type: 'multiple_choice', options: ['Rise 3, run 4', 'Rise 4, run 3', 'Rise 3, run -4', 'Rise -3, run 4'], correctAnswer: 'Rise 3, run 4', explanation: 'Slope = rise/run, so 3/4 means rise 3 and run 4.', difficulty: 'easy', points: 1 },
      { id: 'q9', question: 'Solve: 2(x + 3) = 5x - 9', type: 'short_answer', correctAnswer: 'x = 5', explanation: '2x + 6 = 5x - 9 → 6 + 9 = 3x → 15 = 3x → x = 5', difficulty: 'hard', points: 2 },
      { id: 'q10', question: 'Write the equation of a line with slope 4 and y-intercept -2.', type: 'short_answer', correctAnswer: 'y = 4x - 2', explanation: 'Substitute m = 4 and b = -2 into y = mx + b.', difficulty: 'medium', points: 2 }
    ],
    totalPoints: 12,
    estimatedTime: 20
  },
  flashcardContent: {
    title: 'Linear Equations Flashcards',
    cards: [
      { id: 'card1', front: 'What is slope-intercept form?', back: 'y = mx + b, where m is slope and b is y-intercept', category: 'forms' },
      { id: 'card2', front: 'What does slope represent?', back: 'The steepness and direction of a line (rise over run)', category: 'concepts' },
      { id: 'card3', front: 'What does the y-intercept tell us?', back: 'Where the line crosses the y-axis (value of y when x = 0)', category: 'concepts' },
      { id: 'card4', front: 'How do you graph using y = mx + b?', back: '1) Plot y-intercept (0, b), 2) Use slope to find next point, 3) Draw line', category: 'procedures' },
      { id: 'card5', front: 'Positive slope goes which direction?', back: 'Upward from left to right (↗)', category: 'concepts' },
      { id: 'card6', front: 'Negative slope goes which direction?', back: 'Downward from left to right (↘)', category: 'concepts' },
      { id: 'card7', front: 'What is standard form?', back: 'Ax + By = C (where A, B, C are integers)', category: 'forms' },
      { id: 'card8', front: 'How to convert standard form to slope-intercept?', back: 'Solve for y: isolate y on one side', category: 'procedures' },
      { id: 'card9', front: 'In y = -5x + 3, what is the slope?', back: '-5', category: 'identification' },
      { id: 'card10', front: 'In y = -5x + 3, what is the y-intercept?', back: '3', category: 'identification' },
      { id: 'card11', front: 'What does a slope of 0 look like?', back: 'A horizontal line', category: 'concepts' },
      { id: 'card12', front: 'What does an undefined slope look like?', back: 'A vertical line', category: 'concepts' },
      { id: 'card13', front: 'Slope formula between two points', back: 'm = (y₂ - y₁) / (x₂ - x₁)', category: 'formulas' },
      { id: 'card14', front: 'Real-world example of slope', back: 'Speed (distance per time), rate of change, unit price', category: 'applications' },
      { id: 'card15', front: 'What makes two lines parallel?', back: 'They have the same slope (m values are equal)', category: 'concepts' }
    ]
  }
};

// ============================================
// SAMPLE 3: Science Grade 4 - Water Cycle
// ============================================

const SAMPLE_SCIENCE_WATER_CYCLE_4: SampleTeacherContent = {
  id: 'sample_science_water_cycle_4',
  title: 'The Water Cycle',
  description: 'An engaging lesson exploring how water moves through Earth\'s systems via evaporation, condensation, and precipitation, with hands-on experiments.',
  subject: 'SCIENCE',
  gradeLevel: '4',
  contentType: 'LESSON',
  estimatedDuration: 50,
  tags: ['water cycle', 'evaporation', 'condensation', 'precipitation', 'earth science'],
  curriculum: 'american',
  lessonContent: {
    title: 'The Water Cycle',
    summary: 'Students will explore the continuous movement of water through Earth\'s systems. Through hands-on experiments and visual models, they will understand evaporation, condensation, precipitation, and collection - the four main stages that keep water cycling through our planet.',
    objectives: [
      'Identify and explain the four main stages of the water cycle',
      'Describe how the sun provides energy to drive the water cycle',
      'Demonstrate understanding through a hands-on water cycle model',
      'Connect water cycle concepts to weather patterns and daily life'
    ],
    sections: [
      {
        title: 'What is the Water Cycle?',
        content: 'The water cycle is nature\'s way of recycling water! Water on Earth is constantly moving - from oceans to sky to land and back again. This has been happening for billions of years, which means the water you drink today might have been drunk by a dinosaur!\n\nThe same water keeps cycling over and over. It changes form (liquid, gas, solid) but the total amount of water on Earth stays the same. The sun\'s energy powers this amazing cycle.',
        duration: 10,
        activities: [{
          name: 'Water Cycle Prediction',
          description: 'Before teaching, ask students to draw what they think happens to a puddle on a sunny day. Save these for comparison at the end of the lesson.',
          materials: ['Paper', 'Crayons'],
          duration: 5,
          discussionQuestions: ['Where do you think puddles go?', 'Have you ever seen steam rising from hot water?']
        }],
        teachingTips: ['Use the analogy of water "traveling" on a journey', 'Connect to students\' experiences with rain and puddles'],
        visualAids: ['Water cycle diagram poster'],
        realWorldConnections: ['Rain after sunny days', 'Clouds forming over mountains']
      },
      {
        title: 'Stage 1: Evaporation',
        content: 'Evaporation is when liquid water turns into water vapor (an invisible gas). The sun heats water in oceans, lakes, rivers, and even puddles. When water molecules get enough energy from the heat, they escape into the air.\n\nYou can\'t see water vapor, but it\'s all around us! Think about wet clothes drying on a line - the water evaporates into the air.',
        duration: 12,
        activities: [{
          name: 'Evaporation Race',
          description: 'Put equal amounts of water in two containers - one in sun/warm area, one in shade/cool area. Check every 30 minutes and measure water levels.',
          materials: ['Two containers', 'Water', 'Measuring cup', 'Timer'],
          duration: 10,
          discussionQuestions: ['Which container lost more water?', 'Why does heat speed up evaporation?']
        }],
        teachingTips: ['Emphasize that water vapor is invisible - steam you see is actually tiny water droplets'],
        visualAids: ['Diagram of sun heating water surface'],
        realWorldConnections: ['Hair dryer drying wet hair', 'Sweating cools you down through evaporation']
      },
      {
        title: 'Stage 2: Condensation',
        content: 'Condensation is the opposite of evaporation - water vapor turns back into liquid water. When warm air containing water vapor rises and cools down, the water vapor condenses into tiny water droplets. These droplets form clouds!\n\nYou see condensation when you breathe on a cold window, or when water droplets form on a cold glass of lemonade.',
        duration: 12,
        activities: [{
          name: 'Make a Cloud',
          description: 'Fill a jar with hot water (1 inch). Place ice on a plate and set it on top of the jar. Watch condensation form a "cloud" inside the jar.',
          materials: ['Glass jar', 'Hot water', 'Ice', 'Plate'],
          duration: 8,
          discussionQuestions: ['What do you see forming?', 'Why does the cloud form near the ice?']
        }],
        teachingTips: ['Cold surfaces cause condensation - connect to bathroom mirrors after hot showers'],
        visualAids: ['Cloud formation diagram'],
        realWorldConnections: ['Foggy bathroom mirrors', 'Morning dew on grass']
      },
      {
        title: 'Stage 3: Precipitation',
        content: 'Precipitation is water falling from clouds to Earth. When water droplets in clouds combine and get heavy enough, they fall as precipitation. This can be rain, snow, sleet, or hail depending on temperature.\n\nClouds can hold water for a while, but eventually the droplets get too heavy to stay floating and fall down to Earth.',
        duration: 8,
        activities: [{
          name: 'Rain Cloud Demo',
          description: 'Fill a clear container with water. Spray shaving cream on top (the "cloud"). Slowly drip blue food coloring on the shaving cream and watch "rain" fall through.',
          materials: ['Clear container', 'Water', 'Shaving cream', 'Blue food coloring', 'Dropper'],
          duration: 8,
          discussionQuestions: ['What happened when the cloud couldn\'t hold more water?', 'How is this like real rain?']
        }],
        teachingTips: ['Discuss different types of precipitation based on temperature'],
        visualAids: ['Diagram showing rain, snow, sleet, hail'],
        realWorldConnections: ['Weather forecasts', 'Seasonal precipitation patterns']
      },
      {
        title: 'Stage 4: Collection',
        content: 'Collection is when precipitation gathers in bodies of water. Rain and melted snow flow into streams, rivers, lakes, and oceans. Some water soaks into the ground (groundwater).\n\nOnce collected, the water is ready to evaporate again, and the cycle continues! This is why it\'s called a CYCLE - it goes around and around.',
        duration: 8,
        activities: [{
          name: 'Water Cycle in a Bag',
          description: 'Draw a water cycle scene on a ziplock bag. Add a small amount of blue water, seal it, and tape to a sunny window. Observe over several days.',
          materials: ['Ziplock bags', 'Blue water', 'Markers', 'Tape'],
          duration: 10,
          discussionQuestions: ['Where did the water droplets come from?', 'What stage is happening?']
        }],
        teachingTips: ['Emphasize that collection completes the cycle by providing water for evaporation'],
        visualAids: ['Map showing rivers flowing to ocean'],
        realWorldConnections: ['Local rivers and lakes', 'Where your drinking water comes from']
      }
    ],
    vocabulary: [
      { term: 'Water Cycle', definition: 'The continuous movement of water through Earth\'s systems', example: 'The water cycle includes evaporation, condensation, precipitation, and collection', memoryAid: 'Cycle = Circle of water' },
      { term: 'Evaporation', definition: 'When liquid water changes into water vapor due to heat', example: 'Puddles disappear through evaporation', memoryAid: 'E-vapor-ation = making vapor' },
      { term: 'Condensation', definition: 'When water vapor cools and changes back into liquid water', example: 'Water droplets on a cold glass are condensation', memoryAid: 'Con-DENSE = water becomes more dense (liquid)' },
      { term: 'Precipitation', definition: 'Water falling from clouds as rain, snow, sleet, or hail', example: 'Rain is a form of precipitation', memoryAid: 'Pre-CIP-itation = water DRIPS down' },
      { term: 'Water Vapor', definition: 'Water in its gas form (invisible)', example: 'Steam rising from a pot becomes water vapor', memoryAid: 'Vapor = invisible air form' }
    ],
    practiceExercises: [
      { question: 'Draw and label the four stages of the water cycle.', type: 'practice', hint: 'Start with the sun heating water. What happens next?', answer: 'Drawing should show: 1) Evaporation (water rising from ocean/lake), 2) Condensation (clouds forming), 3) Precipitation (rain/snow falling), 4) Collection (water gathering in bodies of water). Sun should be included as the energy source.' },
      { question: 'Explain why the water cycle is important for life on Earth.', type: 'practice', hint: 'Think about what all living things need.', answer: 'The water cycle is important because it provides fresh water for drinking, supports plant growth, fills rivers and lakes, creates weather patterns, and distributes water around the planet. Without it, water would stay in one place and many areas would have no water.' }
    ],
    assessment: {
      questions: [
        { question: 'What provides the energy to power the water cycle?', type: 'multiple_choice', options: ['The moon', 'The sun', 'Wind', 'The ocean'], correctAnswer: 'The sun', explanation: 'The sun\'s heat energy causes water to evaporate, which starts the water cycle.', points: 2, difficulty: 'easy' },
        { question: 'When water vapor cools and forms clouds, this is called:', type: 'multiple_choice', options: ['Evaporation', 'Precipitation', 'Condensation', 'Collection'], correctAnswer: 'Condensation', explanation: 'Condensation is when water vapor cools and turns back into liquid water droplets, forming clouds.', points: 2, difficulty: 'easy' },
        { question: 'True or False: Water can only exist as a liquid in the water cycle.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Water exists as liquid (rain, oceans), gas (water vapor), and solid (snow, ice) in the water cycle.', points: 1, difficulty: 'medium' },
        { question: 'Put these stages in order: Precipitation, Evaporation, Condensation, Collection', type: 'short_answer', correctAnswer: 'Evaporation → Condensation → Precipitation → Collection', explanation: 'Water evaporates, condenses into clouds, falls as precipitation, and collects in bodies of water.', points: 3, difficulty: 'medium' },
        { question: 'Where does the water go when a puddle dries up on a sunny day?', type: 'short_answer', correctAnswer: 'The water evaporates into the air as water vapor. The sun\'s heat gives the water molecules energy to escape into the atmosphere.', explanation: 'This tests understanding of evaporation in everyday contexts.', points: 2, difficulty: 'easy' }
      ],
      totalPoints: 10,
      passingScore: 7,
      scoringGuide: 'Accept equivalent explanations that demonstrate understanding of the concepts.'
    },
    summaryPoints: [
      'The water cycle moves water continuously through evaporation, condensation, precipitation, and collection',
      'The sun provides the energy that drives the water cycle',
      'Water changes forms (liquid, gas, solid) but the amount on Earth stays the same',
      'The water cycle is essential for weather, fresh water, and all life on Earth'
    ],
    reviewQuestions: ['What are the four stages of the water cycle?', 'How does the sun affect the water cycle?', 'Why is it called a "cycle"?'],
    teacherNotes: 'Students often confuse evaporation with boiling. Clarify that evaporation happens at any temperature, while boiling is rapid evaporation at 100°C. The water cycle in a bag activity works best with several days of observation. Consider keeping a class water cycle journal.',
    additionalResources: ['NASA Water Cycle animation', 'USGS Water Science School website'],
    prerequisites: ['States of matter (solid, liquid, gas)', 'Basic weather concepts'],
    nextSteps: 'Connect to weather patterns, climate, and the importance of water conservation.'
  },
  quizContent: {
    title: 'The Water Cycle Quiz',
    questions: [
      { id: 'q1', question: 'What is evaporation?', type: 'multiple_choice', options: ['Water falling from clouds', 'Water turning into vapor', 'Water forming clouds', 'Water collecting in lakes'], correctAnswer: 'Water turning into vapor', explanation: 'Evaporation is when liquid water changes into water vapor (gas).', difficulty: 'easy', points: 1 },
      { id: 'q2', question: 'What causes water to evaporate?', type: 'multiple_choice', options: ['Cold temperatures', 'Heat from the sun', 'Wind', 'Gravity'], correctAnswer: 'Heat from the sun', explanation: 'The sun\'s heat provides energy for water molecules to evaporate.', difficulty: 'easy', points: 1 },
      { id: 'q3', question: 'Clouds are formed during which stage?', type: 'multiple_choice', options: ['Evaporation', 'Condensation', 'Precipitation', 'Collection'], correctAnswer: 'Condensation', explanation: 'Condensation forms clouds when water vapor cools and becomes water droplets.', difficulty: 'easy', points: 1 },
      { id: 'q4', question: 'Rain, snow, and hail are all types of:', type: 'multiple_choice', options: ['Evaporation', 'Condensation', 'Precipitation', 'Collection'], correctAnswer: 'Precipitation', explanation: 'Precipitation is water falling from clouds in various forms.', difficulty: 'easy', points: 1 },
      { id: 'q5', question: 'True or False: The water on Earth today is the same water that existed millions of years ago.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Water is constantly recycled through the water cycle - the same water has been cycling for billions of years.', difficulty: 'medium', points: 1 },
      { id: 'q6', question: 'Where does water collect after precipitation?', type: 'multiple_choice', options: ['Only in oceans', 'Only in rivers', 'In oceans, lakes, rivers, and groundwater', 'Only in clouds'], correctAnswer: 'In oceans, lakes, rivers, and groundwater', explanation: 'Collection happens in all bodies of water and underground.', difficulty: 'medium', points: 1 },
      { id: 'q7', question: 'Water vapor is:', type: 'multiple_choice', options: ['Visible steam', 'Invisible gas', 'Liquid water', 'Ice crystals'], correctAnswer: 'Invisible gas', explanation: 'Water vapor is the gaseous form of water and is invisible.', difficulty: 'medium', points: 1 },
      { id: 'q8', question: 'Why do water droplets form on a cold glass?', type: 'short_answer', correctAnswer: 'Water vapor in the warm air condenses when it touches the cold glass surface, turning into liquid water droplets.', explanation: 'This is condensation happening in everyday life.', difficulty: 'medium', points: 2 },
      { id: 'q9', question: 'List the four stages of the water cycle in order.', type: 'short_answer', correctAnswer: 'Evaporation, Condensation, Precipitation, Collection', explanation: 'This is the correct sequence of the water cycle stages.', difficulty: 'easy', points: 2 },
      { id: 'q10', question: 'True or False: The water cycle only happens over oceans.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'False', explanation: 'The water cycle happens everywhere - over oceans, land, lakes, and even in your backyard!', difficulty: 'easy', points: 1 }
    ],
    totalPoints: 12,
    estimatedTime: 15
  },
  flashcardContent: {
    title: 'Water Cycle Flashcards',
    cards: [
      { id: 'card1', front: 'What is the water cycle?', back: 'The continuous movement of water through Earth\'s systems', category: 'concepts' },
      { id: 'card2', front: 'What is evaporation?', back: 'When liquid water turns into water vapor (gas) due to heat', category: 'stages' },
      { id: 'card3', front: 'What is condensation?', back: 'When water vapor cools and turns back into liquid water droplets', category: 'stages' },
      { id: 'card4', front: 'What is precipitation?', back: 'Water falling from clouds as rain, snow, sleet, or hail', category: 'stages' },
      { id: 'card5', front: 'What is collection?', back: 'When water gathers in oceans, lakes, rivers, and groundwater', category: 'stages' },
      { id: 'card6', front: 'What powers the water cycle?', back: 'The sun\'s heat energy', category: 'concepts' },
      { id: 'card7', front: 'What is water vapor?', back: 'Water in its invisible gas form', category: 'vocabulary' },
      { id: 'card8', front: 'How do clouds form?', back: 'Water vapor rises, cools, and condenses into tiny water droplets', category: 'concepts' },
      { id: 'card9', front: 'Why is it called a "cycle"?', back: 'Because water keeps going around and around through the same stages', category: 'concepts' },
      { id: 'card10', front: 'Example of evaporation in daily life', back: 'Wet clothes drying, puddles disappearing, sweating', category: 'examples' },
      { id: 'card11', front: 'Example of condensation in daily life', back: 'Water droplets on cold glass, foggy bathroom mirror, morning dew', category: 'examples' },
      { id: 'card12', front: 'Four types of precipitation', back: 'Rain, snow, sleet, and hail', category: 'vocabulary' },
      { id: 'card13', front: 'Where does groundwater come from?', back: 'Precipitation that soaks into the soil instead of flowing into rivers', category: 'concepts' },
      { id: 'card14', front: 'Does the amount of water on Earth change?', back: 'No - the same water keeps cycling, it just changes form', category: 'concepts' },
      { id: 'card15', front: 'What happens to water after it falls as rain?', back: 'It collects in rivers, lakes, oceans, or soaks into the ground, then can evaporate again', category: 'concepts' }
    ]
  }
};

// ============================================
// SAMPLE 4: Science Grade 9 - Cell Structure
// ============================================

const SAMPLE_SCIENCE_CELLS_9: SampleTeacherContent = {
  id: 'sample_science_cells_9',
  title: 'Cell Structure & Function',
  description: 'An in-depth exploration of cell biology covering organelles, cell types, and the relationship between structure and function for high school biology.',
  subject: 'SCIENCE',
  gradeLevel: '9',
  contentType: 'LESSON',
  estimatedDuration: 60,
  tags: ['biology', 'cells', 'organelles', 'cell theory', 'microscopy'],
  curriculum: 'american',
  lessonContent: {
    title: 'Cell Structure & Function',
    summary: 'This lesson introduces students to the fundamental unit of life - the cell. Students will explore cell theory, compare prokaryotic and eukaryotic cells, examine major organelles and their functions, and understand how structure relates to function in living systems.',
    objectives: [
      'Explain the three principles of cell theory',
      'Distinguish between prokaryotic and eukaryotic cells',
      'Identify major cell organelles and describe their functions',
      'Compare and contrast plant and animal cells',
      'Relate cell structure to cellular function'
    ],
    sections: [
      {
        title: 'Cell Theory: The Foundation',
        content: 'Cell theory is one of the fundamental principles of biology, developed in the 1830s-1850s by scientists Schleiden, Schwann, and Virchow.\n\n**The Three Principles:**\n1. All living things are composed of one or more cells\n2. The cell is the basic unit of structure and function in living things\n3. All cells come from pre-existing cells\n\nThis theory revolutionized biology by establishing that cells are the building blocks of all life - from bacteria to blue whales, from mushrooms to humans.',
        duration: 10,
        activities: [{
          name: 'Cell Theory Timeline',
          description: 'Students create a timeline showing the key discoveries that led to cell theory, including the invention of the microscope and contributions of key scientists.',
          materials: ['Timeline template', 'Research materials', 'Colored pencils'],
          duration: 12,
          discussionQuestions: ['Why was the microscope essential for cell theory?', 'How did each scientist build on previous discoveries?']
        }],
        teachingTips: ['Connect to the scientific method - how observations led to a unifying theory', 'Emphasize that cell theory applies to ALL living things'],
        visualAids: ['Historical microscope images', 'Timeline of cell theory development'],
        realWorldConnections: ['Medical advances based on cell biology', 'Cancer as uncontrolled cell division']
      },
      {
        title: 'Prokaryotic vs. Eukaryotic Cells',
        content: '**Prokaryotic Cells** (bacteria and archaea):\n- NO membrane-bound nucleus\n- NO membrane-bound organelles\n- Smaller (1-10 μm)\n- Circular DNA in nucleoid region\n- Have ribosomes, cell membrane, cell wall\n\n**Eukaryotic Cells** (plants, animals, fungi, protists):\n- Membrane-bound nucleus containing DNA\n- Membrane-bound organelles (mitochondria, ER, etc.)\n- Larger (10-100 μm)\n- Linear DNA in chromosomes\n\nThe prefix "eu" means "true" and "karyon" means "nucleus" - so eukaryote means "true nucleus."',
        duration: 12,
        activities: [{
          name: 'Cell Type Comparison',
          description: 'Using diagrams, students create a Venn diagram comparing prokaryotic and eukaryotic cells, identifying shared and unique features.',
          materials: ['Cell diagrams', 'Venn diagram template', 'Colored markers'],
          duration: 10,
          discussionQuestions: ['Why is the presence of a nucleus significant?', 'Which type of cell evolved first?']
        }],
        teachingTips: ['Use size comparisons students can visualize', 'Explain that "simpler" doesn\'t mean "less successful" - bacteria thrive everywhere'],
        visualAids: ['Side-by-side prokaryote vs eukaryote diagrams', 'Size comparison chart'],
        realWorldConnections: ['Bacteria in human microbiome', 'Antibiotic resistance']
      },
      {
        title: 'Major Organelles and Their Functions',
        content: '**Nucleus** - The control center; contains DNA and directs cell activities\n\n**Mitochondria** - The powerhouse; produces ATP through cellular respiration\n\n**Ribosomes** - Protein factories; synthesize proteins from amino acids\n\n**Endoplasmic Reticulum (ER)**:\n- Rough ER (with ribosomes): protein processing and transport\n- Smooth ER: lipid synthesis and detoxification\n\n**Golgi Apparatus** - The shipping center; modifies, packages, and ships proteins\n\n**Lysosomes** - Recycling centers; break down waste and worn-out organelles\n\n**Cell Membrane** - The gatekeeper; controls what enters and exits the cell\n\n**Cytoplasm** - The cellular "soup"; gel-like fluid where organelles float',
        duration: 15,
        activities: [{
          name: 'Organelle Analogy Project',
          description: 'Students create an analogy comparing a cell to something familiar (city, factory, school) and match each organelle to a corresponding structure.',
          materials: ['Poster paper', 'Markers', 'Cell diagram reference'],
          duration: 15,
          discussionQuestions: ['Why is the nucleus like a city hall or principal\'s office?', 'What would happen if mitochondria stopped working?']
        }],
        teachingTips: ['Use the factory/city analogy consistently', 'Emphasize that organelles work together as a system'],
        visualAids: ['Detailed cell diagram with labeled organelles', 'Organelle function chart'],
        realWorldConnections: ['Mitochondrial diseases', 'Lysosomal storage disorders']
      },
      {
        title: 'Plant vs. Animal Cells',
        content: '**Unique to Plant Cells:**\n- Cell Wall: rigid outer layer providing structure and support\n- Chloroplasts: contain chlorophyll for photosynthesis\n- Large Central Vacuole: stores water and maintains turgor pressure\n\n**Unique to Animal Cells:**\n- Centrioles: involved in cell division\n- Lysosomes: more prominent than in plant cells\n\n**Both Have:**\n- Nucleus, mitochondria, ribosomes, ER, Golgi apparatus\n- Cell membrane, cytoplasm\n\nThese differences reflect how plants and animals meet their needs differently - plants make their own food, while animals must consume food.',
        duration: 12,
        activities: [{
          name: 'Cell Identification Lab',
          description: 'Students examine prepared slides of onion (plant) and cheek (animal) cells under microscopes, drawing and labeling what they observe.',
          materials: ['Microscopes', 'Prepared slides', 'Drawing paper', 'Colored pencils'],
          duration: 20,
          discussionQuestions: ['What structures can you actually see?', 'How do the cells differ in shape?']
        }],
        teachingTips: ['Safety first with microscopes', 'Plant cells are easier to see - their cell walls make them more distinct'],
        visualAids: ['Plant vs animal cell comparison diagram'],
        realWorldConnections: ['Why plants are rigid/animals are flexible', 'Photosynthesis and food chains']
      },
      {
        title: 'Structure Meets Function',
        content: 'Every organelle\'s structure is perfectly suited to its function:\n\n- **Mitochondria** have folded inner membranes (cristae) to maximize surface area for ATP production\n- **Ribosomes** are small to allow quick protein assembly\n- **The nucleus** is protected by a double membrane with pores for controlled transport\n- **Cells themselves** are small to maintain a high surface area-to-volume ratio for efficient nutrient/waste exchange\n\nThis structure-function relationship is a recurring theme in biology - form follows function at every level of organization.',
        duration: 11,
        activities: [{
          name: 'Design Your Own Cell',
          description: 'Students design a specialized cell for a specific function (muscle cell, nerve cell, red blood cell) and justify which organelles would be most abundant.',
          materials: ['Design worksheet', 'Cell structure reference', 'Colored pencils'],
          duration: 15,
          discussionQuestions: ['Why would a muscle cell need more mitochondria?', 'Why don\'t red blood cells have a nucleus?']
        }],
        teachingTips: ['Connect to real specialized cells in the body', 'Emphasize that structure-function is a key concept throughout biology'],
        visualAids: ['Images of specialized cells'],
        realWorldConnections: ['Muscle cells and energy needs', 'Nerve cell structure and communication']
      }
    ],
    vocabulary: [
      { term: 'Cell', definition: 'The basic structural and functional unit of all living organisms', example: 'Your body contains trillions of cells working together', memoryAid: 'Cell = small room (like a monk\'s cell)' },
      { term: 'Organelle', definition: 'A specialized structure within a cell that performs a specific function', example: 'Mitochondria and ribosomes are organelles', memoryAid: 'Organelle = little organ' },
      { term: 'Prokaryote', definition: 'A single-celled organism without a membrane-bound nucleus', example: 'Bacteria are prokaryotes', memoryAid: 'Pro = before, karyon = nucleus (before nucleus evolved)' },
      { term: 'Eukaryote', definition: 'An organism whose cells contain a membrane-bound nucleus', example: 'Plants, animals, and fungi are eukaryotes', memoryAid: 'Eu = true, karyon = nucleus (true nucleus)' },
      { term: 'Mitochondria', definition: 'Organelles that produce ATP through cellular respiration', example: 'Mitochondria are called the powerhouse of the cell', memoryAid: 'Mighty mitochondria make energy' }
    ],
    practiceExercises: [
      { question: 'Explain why cells are considered the basic unit of life.', type: 'practice', hint: 'Think about what all living things have in common.', answer: 'Cells are the basic unit of life because: 1) All living things are made of cells, 2) Cells carry out all life functions (metabolism, reproduction, response to stimuli), 3) New cells only come from existing cells, and 4) Cells contain genetic material that controls heredity.' },
      { question: 'A scientist discovers a new single-celled organism. It has a nucleus and mitochondria. Is it prokaryotic or eukaryotic? Explain.', type: 'practice', hint: 'What defines each cell type?', answer: 'It is eukaryotic because it has a membrane-bound nucleus. Prokaryotes lack a true nucleus - their DNA is in a nucleoid region without a membrane. The presence of mitochondria further confirms it is a eukaryote.' }
    ],
    assessment: {
      questions: [
        { question: 'Which organelle is known as the "powerhouse of the cell"?', type: 'multiple_choice', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'], correctAnswer: 'Mitochondria', explanation: 'Mitochondria produce ATP through cellular respiration, providing energy for cell activities.', points: 2, difficulty: 'easy' },
        { question: 'What is the main difference between prokaryotic and eukaryotic cells?', type: 'multiple_choice', options: ['Size only', 'Presence of a membrane-bound nucleus', 'Presence of DNA', 'Ability to reproduce'], correctAnswer: 'Presence of a membrane-bound nucleus', explanation: 'Eukaryotic cells have a membrane-bound nucleus; prokaryotic cells do not.', points: 2, difficulty: 'easy' },
        { question: 'True or False: Plant cells have chloroplasts while animal cells do not.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Chloroplasts contain chlorophyll for photosynthesis, which only plants perform.', points: 1, difficulty: 'easy' },
        { question: 'Explain the structure-function relationship of mitochondria.', type: 'short_answer', correctAnswer: 'Mitochondria have a double membrane with the inner membrane folded into cristae. These folds increase surface area for the chemical reactions of cellular respiration, allowing more ATP to be produced efficiently.', explanation: 'This tests understanding of how structure enables function.', points: 3, difficulty: 'hard' },
        { question: 'List three principles of cell theory.', type: 'short_answer', correctAnswer: '1) All living things are composed of cells, 2) The cell is the basic unit of structure and function, 3) All cells come from pre-existing cells.', explanation: 'Cell theory is fundamental to understanding biology.', points: 2, difficulty: 'medium' }
      ],
      totalPoints: 10,
      passingScore: 7,
      scoringGuide: 'Award full points for accurate, complete answers. Partial credit for structure-function question if relationship is correctly identified but incompletely explained.'
    },
    summaryPoints: [
      'Cell theory states all living things are made of cells, cells are the basic unit of life, and all cells come from existing cells',
      'Prokaryotic cells lack a nucleus; eukaryotic cells have a membrane-bound nucleus and organelles',
      'Each organelle has a specific structure suited to its function within the cell',
      'Plant and animal cells share many features but have key differences related to their life strategies'
    ],
    reviewQuestions: ['What are the three principles of cell theory?', 'How do prokaryotic and eukaryotic cells differ?', 'Why do plant cells have structures that animal cells lack?'],
    teacherNotes: 'Students often confuse cell membrane and cell wall. Emphasize that ALL cells have a membrane, but only some have walls. Use microscope lab time efficiently by having slides pre-focused. The organelle analogy project is excellent for differentiation - advanced students can include more complex organelles.',
    additionalResources: ['HHMI BioInteractive cell explorer', 'Khan Academy cell biology'],
    prerequisites: ['Basic chemistry (atoms, molecules)', 'Understanding of living vs. non-living', 'Microscope skills'],
    nextSteps: 'Cell transport (diffusion, osmosis), cell division (mitosis, meiosis), and cellular respiration.'
  },
  quizContent: {
    title: 'Cell Structure & Function Quiz',
    questions: [
      { id: 'q1', question: 'What does cell theory state about the origin of cells?', type: 'multiple_choice', options: ['Cells appear spontaneously', 'All cells come from pre-existing cells', 'Cells come from non-living matter', 'Only some cells come from other cells'], correctAnswer: 'All cells come from pre-existing cells', explanation: 'One of the three principles of cell theory.', difficulty: 'easy', points: 1 },
      { id: 'q2', question: 'Which type of cell has no membrane-bound nucleus?', type: 'multiple_choice', options: ['Eukaryotic', 'Prokaryotic', 'Plant cells', 'Animal cells'], correctAnswer: 'Prokaryotic', explanation: 'Prokaryotes (bacteria) lack a true nucleus.', difficulty: 'easy', points: 1 },
      { id: 'q3', question: 'What is the function of ribosomes?', type: 'multiple_choice', options: ['Produce energy', 'Synthesize proteins', 'Store water', 'Control the cell'], correctAnswer: 'Synthesize proteins', explanation: 'Ribosomes are the sites of protein synthesis.', difficulty: 'easy', points: 1 },
      { id: 'q4', question: 'Which organelle is found in plant cells but NOT animal cells?', type: 'multiple_choice', options: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Ribosome'], correctAnswer: 'Chloroplast', explanation: 'Chloroplasts enable photosynthesis in plants.', difficulty: 'easy', points: 1 },
      { id: 'q5', question: 'True or False: All eukaryotic cells have mitochondria.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Almost all eukaryotic cells have mitochondria for energy production.', difficulty: 'medium', points: 1 },
      { id: 'q6', question: 'The Golgi apparatus is best described as:', type: 'multiple_choice', options: ['The cell\'s power plant', 'The cell\'s packaging and shipping center', 'The cell\'s brain', 'The cell\'s recycling center'], correctAnswer: 'The cell\'s packaging and shipping center', explanation: 'The Golgi modifies, packages, and ships proteins.', difficulty: 'medium', points: 1 },
      { id: 'q7', question: 'What provides structural support for plant cells that animal cells lack?', type: 'multiple_choice', options: ['Cell membrane', 'Cell wall', 'Nucleus', 'Cytoplasm'], correctAnswer: 'Cell wall', explanation: 'The cell wall is a rigid structure outside the cell membrane in plants.', difficulty: 'easy', points: 1 },
      { id: 'q8', question: 'Describe the function of the cell membrane.', type: 'short_answer', correctAnswer: 'The cell membrane controls what enters and exits the cell, acting as a selective barrier. It protects the cell and maintains homeostasis.', explanation: 'Also called the plasma membrane, it regulates transport.', difficulty: 'medium', points: 2 },
      { id: 'q9', question: 'Why are cells small rather than large?', type: 'short_answer', correctAnswer: 'Cells are small to maintain a high surface area to volume ratio, which allows efficient exchange of nutrients and waste across the cell membrane.', explanation: 'This is a key structure-function relationship.', difficulty: 'hard', points: 2 },
      { id: 'q10', question: 'True or False: Prokaryotic cells are generally larger than eukaryotic cells.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Prokaryotic cells are typically 1-10 μm while eukaryotic cells are 10-100 μm.', difficulty: 'medium', points: 1 }
    ],
    totalPoints: 12,
    estimatedTime: 20
  },
  flashcardContent: {
    title: 'Cell Structure Flashcards',
    cards: [
      { id: 'card1', front: 'Three principles of cell theory', back: '1) All living things are made of cells, 2) The cell is the basic unit of life, 3) All cells come from existing cells', category: 'theory' },
      { id: 'card2', front: 'Prokaryotic cell characteristics', back: 'No membrane-bound nucleus, no membrane-bound organelles, smaller (1-10μm), circular DNA', category: 'cell types' },
      { id: 'card3', front: 'Eukaryotic cell characteristics', back: 'Membrane-bound nucleus, membrane-bound organelles, larger (10-100μm), linear DNA in chromosomes', category: 'cell types' },
      { id: 'card4', front: 'Function of nucleus', back: 'Control center - contains DNA, directs cell activities, controls protein synthesis', category: 'organelles' },
      { id: 'card5', front: 'Function of mitochondria', back: 'Powerhouse - produces ATP through cellular respiration', category: 'organelles' },
      { id: 'card6', front: 'Function of ribosomes', back: 'Protein synthesis - assembles amino acids into proteins', category: 'organelles' },
      { id: 'card7', front: 'Function of Golgi apparatus', back: 'Packaging/shipping center - modifies, packages, and ships proteins', category: 'organelles' },
      { id: 'card8', front: 'Function of lysosomes', back: 'Recycling center - breaks down waste and worn-out organelles', category: 'organelles' },
      { id: 'card9', front: 'Function of endoplasmic reticulum', back: 'Rough ER: protein processing. Smooth ER: lipid synthesis, detoxification', category: 'organelles' },
      { id: 'card10', front: 'What\'s unique to plant cells?', back: 'Cell wall, chloroplasts, large central vacuole', category: 'cell types' },
      { id: 'card11', front: 'What\'s unique to animal cells?', back: 'Centrioles, more prominent lysosomes', category: 'cell types' },
      { id: 'card12', front: 'What does "eu" mean in eukaryote?', back: 'True (true nucleus)', category: 'vocabulary' },
      { id: 'card13', front: 'What does "pro" mean in prokaryote?', back: 'Before (before nucleus evolved)', category: 'vocabulary' },
      { id: 'card14', front: 'Why do cells need to be small?', back: 'To maintain high surface area to volume ratio for efficient nutrient/waste exchange', category: 'concepts' },
      { id: 'card15', front: 'Function of chloroplasts', back: 'Site of photosynthesis - convert light energy to chemical energy (glucose)', category: 'organelles' }
    ]
  }
};

// ============================================
// SAMPLE 5: English Grade 3 - Parts of Speech
// ============================================

const SAMPLE_ENGLISH_PARTS_SPEECH_3: SampleTeacherContent = {
  id: 'sample_english_parts_speech_3',
  title: 'Parts of Speech: Nouns, Verbs & Adjectives',
  description: 'A fun and interactive lesson introducing the fundamental parts of speech with games, sorting activities, and creative writing for 3rd graders.',
  subject: 'ENGLISH',
  gradeLevel: '3',
  contentType: 'LESSON',
  estimatedDuration: 45,
  tags: ['grammar', 'parts of speech', 'nouns', 'verbs', 'adjectives', 'language arts'],
  curriculum: 'american',
  lessonContent: {
    title: 'Parts of Speech: Nouns, Verbs & Adjectives',
    summary: 'Students will learn to identify and use the three foundational parts of speech: nouns (people, places, things, ideas), verbs (action and being words), and adjectives (describing words). Through interactive activities and creative exercises, students will understand how these word types work together to create meaningful sentences.',
    objectives: [
      'Identify nouns as words that name people, places, things, or ideas',
      'Recognize verbs as action words or words that show a state of being',
      'Use adjectives to describe nouns and make writing more vivid',
      'Correctly categorize words into nouns, verbs, and adjectives',
      'Create sentences using all three parts of speech'
    ],
    sections: [
      {
        title: 'What Are Nouns?',
        content: 'A **noun** is a word that names something. Nouns can name:\n\n**People**: teacher, mom, firefighter, friend, Dr. Smith\n**Places**: school, park, kitchen, Texas, Disneyland\n**Things**: book, pencil, dog, pizza, computer\n**Ideas/Feelings**: happiness, love, freedom, courage, dream\n\n**Tip**: If you can put "the" or "a" in front of a word, it\'s probably a noun!\n- "the dog" ✓ (dog is a noun)\n- "a happiness" ✓ (happiness is a noun)\n\nNouns are the building blocks of sentences. Every sentence needs at least one noun!',
        duration: 12,
        activities: [{
          name: 'Noun Hunt',
          description: 'Students work in pairs to find and list 20 nouns in the classroom. They categorize them as people, places, things, or ideas. The pair with the most correctly categorized nouns wins.',
          materials: ['Recording sheet', 'Pencils', 'Timer'],
          duration: 10,
          discussionQuestions: ['What was the hardest category to find?', 'Are there more things or people in our classroom?', 'Can you think of an idea noun?']
        }],
        teachingTips: ['Start with concrete nouns (things you can see/touch) before abstract nouns (ideas)', 'Use students\' names as examples of proper nouns'],
        visualAids: ['Noun categories poster', 'Picture cards for noun sorting'],
        realWorldConnections: ['Names on signs and labels', 'Nouns in book titles', 'Nouns on restaurant menus']
      },
      {
        title: 'What Are Verbs?',
        content: '**Verbs** are action words or words that show a state of being. They tell what the noun is DOING or BEING.\n\n**Action Verbs** (show movement or activity):\nrun, jump, eat, read, dance, think, play, write, sleep\n\n**Being Verbs** (show a state of existence):\nam, is, are, was, were, be, been, being\n\nEvery sentence needs a verb! The verb is like the engine of the sentence - it makes things happen.\n\n**Examples**:\n- The dog **runs** fast. (action verb)\n- She **is** happy. (being verb)\n- We **played** soccer yesterday. (action verb)',
        duration: 12,
        activities: [{
          name: 'Verb Charades',
          description: 'Students take turns acting out action verbs while classmates guess the word. Each student has 30 seconds to act out 3 verbs from cards they draw.',
          materials: ['Verb cards', 'Timer'],
          duration: 10,
          discussionQuestions: ['Which verbs were easiest to act out?', 'Can you act out a "being" verb? Why or why not?', 'What verb describes what you\'re doing right now?']
        }],
        teachingTips: ['Action verbs are easier to understand - start there', 'Have students physically act out verbs to remember them'],
        visualAids: ['Action verb posters', 'Being verb list'],
        realWorldConnections: ['Sports commentary uses lots of verbs', 'Recipes are full of action verbs (mix, bake, stir)']
      },
      {
        title: 'What Are Adjectives?',
        content: '**Adjectives** are words that describe nouns. They tell us MORE about the noun - what kind, how many, or which one.\n\n**What kind?**: red apple, tall building, scary movie, soft pillow\n**How many?**: three cats, several books, many friends, few clouds\n**Which one?**: this pencil, that house, these shoes, those trees\n\nAdjectives make writing more interesting! Compare:\n- "I have a dog." (boring)\n- "I have a fluffy, brown, playful dog." (interesting!)\n\n**Tip**: Adjectives usually come BEFORE the noun they describe.',
        duration: 11,
        activities: [{
          name: 'Adjective Add-On',
          description: 'Start with a boring sentence (The cat sat.). Students take turns adding adjectives to make it more interesting. See how many adjectives you can add while keeping the sentence sensible!',
          materials: ['Whiteboard', 'Markers'],
          duration: 8,
          discussionQuestions: ['How many adjectives is too many?', 'Which adjectives painted the best picture?', 'What adjectives describe YOU?']
        }],
        teachingTips: ['Use the five senses to brainstorm adjectives', 'Color words and size words are great starter adjectives'],
        visualAids: ['Adjective word wall', 'Sensory adjective chart'],
        realWorldConnections: ['Product descriptions (crunchy, delicious, new)', 'Weather reports (sunny, cloudy, cold)']
      },
      {
        title: 'Putting It All Together',
        content: 'Now we know the three main parts of speech! Let\'s see how they work together:\n\n**Noun + Verb**: The dog runs. (basic sentence)\n**Adjective + Noun + Verb**: The happy dog runs. (better!)\n**Adjective + Noun + Verb + Adjective + Noun**: The happy dog runs to the green park. (even better!)\n\n**Sentence Pattern**: Adjective(s) + Noun + Verb + more words\n\nRemember:\n- **Nouns** = WHO or WHAT the sentence is about\n- **Verbs** = what the noun DOES or IS\n- **Adjectives** = describe the nouns',
        duration: 10,
        activities: [{
          name: 'Build-a-Sentence Game',
          description: 'Using cards with nouns, verbs, and adjectives, students create sentences. Each group gets a set of word cards and must create 5 complete sentences using at least one of each part of speech.',
          materials: ['Word cards (color-coded by part of speech)', 'Recording sheets'],
          duration: 12,
          discussionQuestions: ['What\'s the silliest sentence you made?', 'Can you make a sentence with two adjectives?', 'What happens if you try to make a sentence without a verb?']
        }],
        teachingTips: ['Color-code parts of speech (e.g., nouns=blue, verbs=red, adjectives=green)', 'Celebrate creative and silly sentences that are grammatically correct'],
        visualAids: ['Sentence building chart', 'Color-coded sentence examples'],
        realWorldConnections: ['Writing stories', 'Describing things to friends', 'Following instructions']
      }
    ],
    vocabulary: [
      { term: 'Noun', definition: 'A word that names a person, place, thing, or idea', example: 'dog, school, love, teacher', memoryAid: 'Noun = Name (both start with N)' },
      { term: 'Verb', definition: 'A word that shows action or a state of being', example: 'run, jump, is, was', memoryAid: 'Verbs are Vigorous - they show action!' },
      { term: 'Adjective', definition: 'A word that describes a noun', example: 'big, red, happy, three', memoryAid: 'Adjectives ADD description' },
      { term: 'Action Verb', definition: 'A verb that shows movement or activity', example: 'swim, write, think, dance', memoryAid: 'Action verbs = Act it out!' },
      { term: 'Being Verb', definition: 'A verb that shows existence (am, is, are, was, were)', example: 'She is tall. They were happy.', memoryAid: 'Being verbs show you\'re BEING something' }
    ],
    practiceExercises: [
      { question: 'Sort these words into nouns, verbs, and adjectives: beautiful, cat, jumping, happiness, blue, runs, pencil, sleeps', type: 'practice', hint: 'Ask yourself: Is it a name (noun)? An action (verb)? Or does it describe something (adjective)?', answer: 'Nouns: cat, happiness, pencil | Verbs: jumping, runs, sleeps | Adjectives: beautiful, blue' },
      { question: 'Write a sentence using at least one noun, one verb, and two adjectives.', type: 'practice', hint: 'Start with a noun, add adjectives before it, then add a verb to show what it does.', answer: 'Example: The fluffy, orange cat sleeps peacefully. (Noun: cat, Verb: sleeps, Adjectives: fluffy, orange)' },
      { question: 'Find the adjective in this sentence: The tiny mouse ran under the old wooden chair.', type: 'practice', hint: 'Which words describe the nouns (mouse and chair)?', answer: 'Adjectives: tiny (describes mouse), old, wooden (describe chair)' }
    ],
    assessment: {
      questions: [
        { question: 'Which word is a NOUN?', type: 'multiple_choice', options: ['quickly', 'happiness', 'running', 'beautiful'], correctAnswer: 'happiness', explanation: 'Happiness is a noun because it names an idea/feeling. The others are: quickly (adverb), running (verb), beautiful (adjective).', points: 2, difficulty: 'easy' },
        { question: 'Which word is a VERB?', type: 'multiple_choice', options: ['table', 'purple', 'swims', 'loud'], correctAnswer: 'swims', explanation: 'Swims is a verb because it shows action. Table is a noun, purple and loud are adjectives.', points: 2, difficulty: 'easy' },
        { question: 'Which word is an ADJECTIVE?', type: 'multiple_choice', options: ['school', 'jumped', 'quickly', 'enormous'], correctAnswer: 'enormous', explanation: 'Enormous is an adjective because it describes something (tells us about size). School is a noun, jumped is a verb.', points: 2, difficulty: 'easy' },
        { question: 'True or False: Every sentence needs at least one verb.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Every complete sentence must have a verb to show action or a state of being.', points: 1, difficulty: 'easy' },
        { question: 'In the sentence "The happy children played games," identify the adjective.', type: 'short_answer', correctAnswer: 'happy', explanation: 'Happy describes the noun "children," telling us what kind of children they are.', points: 3, difficulty: 'medium' }
      ],
      totalPoints: 10,
      passingScore: 7,
      scoringGuide: 'Award full points for correct identification. For the short answer, accept the correct adjective with or without explanation.'
    },
    summaryPoints: [
      'Nouns name people, places, things, or ideas',
      'Verbs show action or a state of being',
      'Adjectives describe nouns and make writing more interesting',
      'Every sentence needs at least one noun and one verb'
    ],
    reviewQuestions: ['What are the three parts of speech we learned today?', 'How can you tell if a word is a noun?', 'Why do we use adjectives in our writing?'],
    teacherNotes: 'Students often confuse verbs ending in -ing with adjectives. Clarify that "running" in "the running water" is acting as an adjective, but in "The dog is running" it\'s a verb. Use color-coding consistently throughout the unit. For struggling learners, focus on concrete nouns and action verbs first.',
    additionalResources: ['Schoolhouse Rock videos on parts of speech', 'BrainPOP grammar activities'],
    prerequisites: ['Basic sentence recognition', 'Understanding of what makes a complete thought'],
    nextSteps: 'Introduce pronouns, adverbs, and prepositions in future lessons.'
  },
  quizContent: {
    title: 'Parts of Speech Quiz',
    questions: [
      { id: 'q1', question: 'A noun names a _____.', type: 'multiple_choice', options: ['action', 'person, place, thing, or idea', 'description', 'time'], correctAnswer: 'person, place, thing, or idea', explanation: 'Nouns are words that name people, places, things, or ideas.', difficulty: 'easy', points: 1 },
      { id: 'q2', question: 'Which word is a verb?', type: 'multiple_choice', options: ['mountain', 'delicious', 'climbed', 'several'], correctAnswer: 'climbed', explanation: 'Climbed shows action - it tells what someone did.', difficulty: 'easy', points: 1 },
      { id: 'q3', question: 'Adjectives describe _____.', type: 'multiple_choice', options: ['verbs', 'nouns', 'sentences', 'paragraphs'], correctAnswer: 'nouns', explanation: 'Adjectives describe nouns by telling what kind, how many, or which one.', difficulty: 'easy', points: 1 },
      { id: 'q4', question: 'Which is a being verb?', type: 'multiple_choice', options: ['run', 'is', 'jump', 'eat'], correctAnswer: 'is', explanation: 'Is shows a state of being rather than action. Am, is, are, was, were are all being verbs.', difficulty: 'medium', points: 1 },
      { id: 'q5', question: 'True or False: "Happy" is a verb.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Happy is an adjective - it describes how someone feels.', difficulty: 'easy', points: 1 },
      { id: 'q6', question: 'In "The large elephant trumpeted loudly," what is the adjective?', type: 'multiple_choice', options: ['elephant', 'trumpeted', 'large', 'loudly'], correctAnswer: 'large', explanation: 'Large describes the elephant, telling us what size it is.', difficulty: 'medium', points: 1 },
      { id: 'q7', question: 'Which list contains ONLY nouns?', type: 'multiple_choice', options: ['cat, run, blue', 'table, door, friendship', 'happy, swim, desk', 'park, tall, plays'], correctAnswer: 'table, door, friendship', explanation: 'Table, door, and friendship are all nouns (things and ideas).', difficulty: 'medium', points: 1 },
      { id: 'q8', question: 'What part of speech is "beautiful"?', type: 'multiple_choice', options: ['Noun', 'Verb', 'Adjective', 'None of these'], correctAnswer: 'Adjective', explanation: 'Beautiful describes nouns (a beautiful flower, a beautiful day).', difficulty: 'easy', points: 1 },
      { id: 'q9', question: 'Write a sentence with the noun "dog," the verb "barks," and the adjective "loud."', type: 'short_answer', correctAnswer: 'The loud dog barks. / A loud dog barks. / The dog barks loudly. (Accept variations)', explanation: 'Any grammatically correct sentence using all three words is acceptable.', difficulty: 'medium', points: 2 },
      { id: 'q10', question: 'True or False: "School" can be a noun.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'True', explanation: 'School names a place, making it a noun.', difficulty: 'easy', points: 1 }
    ],
    totalPoints: 11,
    estimatedTime: 12
  },
  flashcardContent: {
    title: 'Parts of Speech Flashcards',
    cards: [
      { id: 'card1', front: 'What is a noun?', back: 'A word that names a person, place, thing, or idea', category: 'definitions' },
      { id: 'card2', front: 'What is a verb?', back: 'A word that shows action or a state of being', category: 'definitions' },
      { id: 'card3', front: 'What is an adjective?', back: 'A word that describes a noun', category: 'definitions' },
      { id: 'card4', front: 'Is "teacher" a noun or verb?', back: 'Noun - it names a person', category: 'identification' },
      { id: 'card5', front: 'Is "running" a noun or verb?', back: 'Verb - it shows action', category: 'identification' },
      { id: 'card6', front: 'Is "purple" a noun or adjective?', back: 'Adjective - it describes color', category: 'identification' },
      { id: 'card7', front: 'What do adjectives tell us?', back: 'What kind, how many, or which one', category: 'concepts' },
      { id: 'card8', front: 'What are "being verbs"?', back: 'am, is, are, was, were, be, been, being', category: 'concepts' },
      { id: 'card9', front: 'What 4 things can nouns name?', back: 'People, places, things, ideas', category: 'concepts' },
      { id: 'card10', front: 'Noun: person example', back: 'teacher, mom, firefighter, Dr. Smith', category: 'examples' },
      { id: 'card11', front: 'Noun: place example', back: 'school, park, Texas, Disneyland', category: 'examples' },
      { id: 'card12', front: 'Noun: thing example', back: 'book, pencil, dog, computer', category: 'examples' },
      { id: 'card13', front: 'Noun: idea example', back: 'happiness, love, freedom, courage', category: 'examples' },
      { id: 'card14', front: 'How can you test if a word is a noun?', back: 'Put "the" or "a" in front of it - if it sounds right, it\'s a noun!', category: 'tips' },
      { id: 'card15', front: 'Where do adjectives usually go in a sentence?', back: 'Before the noun they describe (the big dog)', category: 'tips' }
    ]
  }
};

// ============================================
// SAMPLE 6: English Grade 11 - Persuasive Essay
// ============================================

const SAMPLE_ENGLISH_PERSUASIVE_11: SampleTeacherContent = {
  id: 'sample_english_persuasive_11',
  title: 'The Art of Persuasion: Writing Effective Argumentative Essays',
  description: 'A comprehensive lesson on crafting compelling persuasive essays using rhetorical strategies, evidence-based arguments, and counterargument techniques for 11th grade students.',
  subject: 'ENGLISH',
  gradeLevel: '11',
  contentType: 'LESSON',
  estimatedDuration: 60,
  tags: ['persuasive writing', 'argumentative essay', 'rhetoric', 'thesis statement', 'AP Language'],
  curriculum: 'american',
  lessonContent: {
    title: 'The Art of Persuasion: Writing Effective Argumentative Essays',
    summary: 'Students will master the essential components of persuasive writing, including crafting strong thesis statements, using rhetorical appeals (ethos, pathos, logos), incorporating evidence effectively, and addressing counterarguments. This lesson prepares students for AP Language and college-level argumentative writing.',
    objectives: [
      'Construct clear, debatable thesis statements that take a defensible position',
      'Apply Aristotle\'s rhetorical appeals (ethos, pathos, logos) strategically',
      'Integrate evidence from multiple sources to support claims',
      'Anticipate and refute counterarguments effectively',
      'Organize arguments using classical or Rogerian essay structures'
    ],
    sections: [
      {
        title: 'The Anatomy of a Strong Thesis',
        content: 'A thesis statement is the backbone of your persuasive essay. It must be:\n\n**Debatable**: Someone could reasonably disagree\n- Weak: "Social media affects teenagers."\n- Strong: "Social media\'s emphasis on curated perfection has created an unprecedented mental health crisis among teenagers that requires legislative regulation."\n\n**Specific**: Provides clear direction for your argument\n**Assertive**: Takes a definitive stance (avoid "I think" or "I believe")\n**Provable**: Can be supported with evidence\n\n**Formula**: [Topic] + [Position] + [Reasoning/Preview]\n\nExample: "Schools should eliminate letter grades [position] because research shows they decrease intrinsic motivation, increase anxiety, and fail to accurately measure student learning [reasoning]."',
        duration: 12,
        activities: [{
          name: 'Thesis Transformation',
          description: 'Students receive weak thesis statements and transform them into strong, debatable claims. They then peer-review each other\'s revisions using the DASP rubric (Debatable, Assertive, Specific, Provable).',
          materials: ['Thesis examples handout', 'DASP rubric', 'Peer review worksheet'],
          duration: 12,
          discussionQuestions: ['What makes a thesis "debatable"?', 'How specific is too specific?', 'Why should you avoid "I believe" in academic writing?']
        }],
        teachingTips: ['Have students identify the thesis in published op-eds before writing their own', 'Use the "So what?" test - if the answer is "nothing," the thesis needs work'],
        visualAids: ['Thesis formula poster', 'Strong vs. weak thesis comparison chart'],
        realWorldConnections: ['Thesis statements in TED talks', 'Opinion pieces in major newspapers', 'Legal arguments in court']
      },
      {
        title: 'The Rhetorical Triangle: Ethos, Pathos, Logos',
        content: '**Ethos** (Credibility/Ethics)\nEstablishes the writer\'s trustworthiness and authority.\n- Citing credentials and expertise\n- Using credible sources\n- Demonstrating fairness to opposing views\n- Maintaining professional tone\n\n**Pathos** (Emotion)\nAppeals to the audience\'s emotions, values, and beliefs.\n- Vivid language and imagery\n- Anecdotes and personal stories\n- Appealing to shared values (freedom, fairness, safety)\n- Strategic word choice (connotation)\n\n**Logos** (Logic/Reason)\nAppeals to rationality through evidence and reasoning.\n- Statistics and data\n- Expert testimony\n- Logical reasoning (if/then, cause/effect)\n- Examples and case studies\n\n**Balance is key**: Effective persuasion uses all three appeals strategically, adjusting emphasis based on audience and purpose.',
        duration: 15,
        activities: [{
          name: 'Rhetorical Analysis Hunt',
          description: 'Students analyze a famous speech (MLK\'s "I Have a Dream" or JFK\'s inaugural) highlighting examples of ethos (yellow), pathos (red), and logos (blue). They discuss why the speaker chose each appeal at each moment.',
          materials: ['Printed speech copies', 'Highlighters (3 colors)', 'Analysis guide'],
          duration: 15,
          discussionQuestions: ['Which appeal does this speaker rely on most?', 'When is pathos most effective?', 'How does the speaker establish ethos?']
        }],
        teachingTips: ['Start with advertisements - students easily identify rhetorical appeals in marketing', 'Caution against over-reliance on pathos in academic writing'],
        visualAids: ['Rhetorical triangle diagram', 'Appeal identification examples'],
        realWorldConnections: ['Political speeches', 'Advertising campaigns', 'Courtroom arguments', 'Job interviews']
      },
      {
        title: 'Evidence and Source Integration',
        content: '**Types of Evidence**:\n1. **Statistics**: Numerical data from credible research\n2. **Expert testimony**: Quotes from authorities in the field\n3. **Examples**: Specific cases that illustrate your point\n4. **Anecdotes**: Brief stories that humanize the issue\n5. **Analogies**: Comparisons to familiar situations\n\n**Source Integration Methods**:\n- **Direct quote**: Use exact words for powerful or precise language\n- **Paraphrase**: Restate in your own words for complex information\n- **Summary**: Condense longer passages for general support\n\n**The Evidence Sandwich**:\n1. **Introduction**: Set up the evidence with context\n2. **Evidence**: Present the quote, statistic, or example\n3. **Analysis**: Explain how this evidence supports YOUR argument\n\nNever let evidence speak for itself - always analyze!',
        duration: 12,
        activities: [{
          name: 'Evidence Sandwich Workshop',
          description: 'Students receive a claim and three pieces of evidence. They practice writing proper evidence sandwiches, then share and critique each other\'s integration techniques.',
          materials: ['Claim and evidence cards', 'Sandwich graphic organizer', 'Sample evidence sandwiches'],
          duration: 12,
          discussionQuestions: ['When should you quote vs. paraphrase?', 'How much analysis is enough?', 'What makes evidence "credible"?']
        }],
        teachingTips: ['Model "dropped quotes" vs. properly integrated evidence', 'Teach signal phrases: "According to...", "Research indicates...", "As Smith argues..."'],
        visualAids: ['Evidence sandwich poster', 'Signal phrase list'],
        realWorldConnections: ['Citing sources in journalism', 'Legal briefs and case law', 'Scientific paper methodology']
      },
      {
        title: 'Addressing Counterarguments',
        content: '**Why Address Counterarguments?**\n- Strengthens credibility (shows you\'ve considered all sides)\n- Prevents objections before they arise\n- Demonstrates intellectual honesty\n- Makes your argument more convincing\n\n**The Counterargument Formula**:\n1. **Acknowledge**: Present the opposing view fairly\n   "Critics argue that..." / "Some may object that..."\n2. **Respond**: Refute, concede, or qualify\n   - **Refute**: Prove the counterargument is wrong\n   - **Concede**: Admit partial validity, then pivot\n   - **Qualify**: Show your argument is stronger despite the objection\n3. **Reinforce**: Return to your thesis strengthened\n\n**Example**:\n"While opponents claim that [counterargument], this view overlooks [flaw in reasoning]. In fact, [evidence against counterargument], further demonstrating that [your thesis]."',
        duration: 11,
        activities: [{
          name: 'Devil\'s Advocate Debate',
          description: 'Students pair up. One presents their thesis; the partner plays devil\'s advocate raising objections. The original student must address each counterargument on the spot. Roles then switch.',
          materials: ['Thesis statements from earlier activity', 'Counterargument sentence starters', 'Peer feedback form'],
          duration: 10,
          discussionQuestions: ['What was the strongest counterargument you faced?', 'How did addressing counterarguments change your thesis?', 'Where in your essay should counterarguments appear?']
        }],
        teachingTips: ['Counterargument placement varies - can be in intro, body, or its own paragraph', 'Strongest essays address the BEST counterargument, not the weakest'],
        visualAids: ['Counterargument formula chart', 'Concede/refute/qualify examples'],
        realWorldConnections: ['Debate competitions', 'Political discourse', 'Business proposals', 'Academic peer review']
      },
      {
        title: 'Essay Organization and Structure',
        content: '**Classical Structure (5-paragraph adaptation)**:\n1. Introduction → Hook + Context + Thesis\n2. Body 1 → Strongest supporting argument\n3. Body 2 → Second argument OR counterargument\n4. Body 3 → Third argument OR call to action\n5. Conclusion → Restate thesis + broader implications\n\n**Rogerian Structure** (for hostile audiences):\n1. Introduction → Present the issue neutrally\n2. Opponent\'s position → Fair summary of other side\n3. Common ground → Where both sides agree\n4. Your position → Your argument with evidence\n5. Conclusion → Compromise or synthesis\n\n**Transitions**: Use logical connectors to guide readers\n- Addition: furthermore, moreover, additionally\n- Contrast: however, conversely, on the other hand\n- Cause/effect: therefore, consequently, as a result\n- Conclusion: ultimately, in conclusion, finally',
        duration: 10,
        activities: [{
          name: 'Outline Construction',
          description: 'Using their thesis from earlier, students create a detailed outline for their persuasive essay, choosing either classical or Rogerian structure based on their topic and audience.',
          materials: ['Outline template (both structures)', 'Thesis statements', 'Transition word bank'],
          duration: 12,
          discussionQuestions: ['Which structure fits your topic better?', 'Where will you place your counterargument?', 'What order will you present your evidence?']
        }],
        teachingTips: ['Encourage students to experiment with both structures', 'Rogerian is excellent for controversial topics or resistant audiences'],
        visualAids: ['Classical vs. Rogerian comparison chart', 'Sample outlines'],
        realWorldConnections: ['Business proposal structures', 'Grant applications', 'Scientific paper organization']
      }
    ],
    vocabulary: [
      { term: 'Thesis Statement', definition: 'A debatable claim that presents the main argument of an essay', example: '"Standardized testing should be eliminated because it narrows curriculum, increases inequality, and fails to measure real learning."', memoryAid: 'Your thesis is your essay\'s thesis = hypothesis' },
      { term: 'Ethos', definition: 'A rhetorical appeal to credibility, character, and trustworthiness', example: 'A doctor citing their medical degree when giving health advice', memoryAid: 'Ethos = Ethics/Expertise' },
      { term: 'Pathos', definition: 'A rhetorical appeal to emotions, values, and beliefs', example: 'A charity ad showing hungry children to evoke sympathy', memoryAid: 'Pathos = Passion/Emotional' },
      { term: 'Logos', definition: 'A rhetorical appeal to logic, reason, and evidence', example: 'Citing statistics that 90% of scientists agree on climate change', memoryAid: 'Logos = Logic' },
      { term: 'Counterargument', definition: 'An opposing viewpoint that is acknowledged and addressed in your essay', example: '"While some argue that video games cause violence, research shows no causal link..."', memoryAid: 'Counter = against (addressing what\'s against you)' }
    ],
    practiceExercises: [
      { question: 'Transform this weak thesis into a strong one: "Cell phones are bad for students."', type: 'practice', hint: 'Make it debatable, specific, and include reasoning.', answer: 'Strong thesis: "Unrestricted cell phone use in classrooms undermines academic performance and social development, and schools should implement structured phone-free periods to restore focus and genuine peer interaction."' },
      { question: 'Identify whether this statement uses ethos, pathos, or logos: "As a pediatric nurse with 20 years of experience, I\'ve witnessed firsthand the devastating effects of childhood obesity."', type: 'practice', hint: 'What is this statement trying to establish?', answer: 'This primarily uses ETHOS (establishing credibility through experience) with elements of PATHOS ("devastating effects" appeals to emotion).' },
      { question: 'Write a counterargument paragraph for this thesis: "Schools should start later to improve student health and academic performance."', type: 'practice', hint: 'Use the acknowledge → respond → reinforce formula.', answer: 'Sample: "Critics argue that later start times would disrupt parents\' work schedules and after-school activities. While this concern is valid, districts like Seattle have successfully implemented later starts with minimal disruption by coordinating with employers and adjusting extracurricular schedules. Moreover, the documented 30% improvement in student attendance and the reduction in car accidents among teen drivers far outweigh the logistical inconveniences, demonstrating that later start times are worth the adjustment period."' }
    ],
    assessment: {
      questions: [
        { question: 'Which element makes a thesis statement "debatable"?', type: 'multiple_choice', options: ['It includes statistics', 'Someone could reasonably disagree with it', 'It uses emotional language', 'It is written in first person'], correctAnswer: 'Someone could reasonably disagree with it', explanation: 'A debatable thesis takes a position that isn\'t obviously true to everyone - it requires argument and evidence to prove.', points: 2, difficulty: 'easy' },
        { question: 'An advertisement showing statistics about car safety ratings is primarily using:', type: 'multiple_choice', options: ['Ethos', 'Pathos', 'Logos', 'All three equally'], correctAnswer: 'Logos', explanation: 'Statistics and data appeal to logic and reason (logos). While the ad may also build credibility (ethos), the primary appeal of statistics is logical.', points: 2, difficulty: 'medium' },
        { question: 'True or False: Addressing counterarguments weakens your persuasive essay.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Addressing counterarguments actually STRENGTHENS your essay by demonstrating intellectual honesty and showing you\'ve considered multiple perspectives.', points: 1, difficulty: 'easy' },
        { question: 'Explain the "evidence sandwich" technique and why it\'s important.', type: 'short_answer', correctAnswer: 'The evidence sandwich has three parts: (1) Introduction/context that sets up the evidence, (2) The evidence itself (quote, statistic, etc.), and (3) Analysis explaining how the evidence supports the argument. It\'s important because evidence alone doesn\'t prove your point - you must explicitly connect it to your thesis through analysis.', explanation: 'This tests understanding of proper evidence integration.', points: 3, difficulty: 'medium' },
        { question: 'When would you choose Rogerian structure over classical structure?', type: 'short_answer', correctAnswer: 'Rogerian structure is best when writing for a hostile or resistant audience, or when addressing highly controversial topics. It works by establishing common ground before presenting your position, making the audience more receptive. Classical structure works better for neutral audiences or when you have strong evidence to make a direct argument.', explanation: 'This tests understanding of strategic structure choices.', points: 2, difficulty: 'hard' }
      ],
      totalPoints: 10,
      passingScore: 7,
      scoringGuide: 'Award full points for complete, accurate answers. For short answer questions, accept equivalent explanations that demonstrate understanding of the concepts.'
    },
    summaryPoints: [
      'Strong thesis statements are debatable, specific, assertive, and provable',
      'Effective persuasion balances ethos (credibility), pathos (emotion), and logos (logic)',
      'Evidence must be integrated with context and analysis (evidence sandwich)',
      'Addressing counterarguments strengthens rather than weakens your argument',
      'Structure should match your audience - classical for neutral, Rogerian for hostile'
    ],
    reviewQuestions: ['What are the three rhetorical appeals and when should each be used?', 'Why is it important to address counterarguments?', 'What makes a thesis statement "debatable"?'],
    teacherNotes: 'This lesson prepares students for AP Language and Composition. Consider using real college application essays, op-eds from major publications, and TED talk scripts as mentor texts. Students often struggle with thesis specificity - use the "zoom in" technique to help them narrow broad topics. For advanced students, introduce logical fallacies as a way to evaluate arguments.',
    additionalResources: ['Purdue OWL argumentative essay guide', 'They Say / I Say by Graff and Birkenstein', 'AP Lang rhetorical analysis examples'],
    prerequisites: ['Basic essay structure (intro, body, conclusion)', 'Understanding of claim vs. evidence', 'Research and citation skills'],
    nextSteps: 'Synthesis essays combining multiple sources, rhetorical analysis of published arguments, and developing personal voice in argumentative writing.'
  },
  quizContent: {
    title: 'Persuasive Essay Writing Quiz',
    questions: [
      { id: 'q1', question: 'A strong thesis statement must be:', type: 'multiple_choice', options: ['A fact everyone agrees with', 'Debatable and specific', 'Written as a question', 'At least three sentences long'], correctAnswer: 'Debatable and specific', explanation: 'A thesis must take a position someone could disagree with and be specific enough to argue effectively.', difficulty: 'easy', points: 1 },
      { id: 'q2', question: 'Which rhetorical appeal relies on the speaker\'s credibility?', type: 'multiple_choice', options: ['Logos', 'Pathos', 'Ethos', 'Kairos'], correctAnswer: 'Ethos', explanation: 'Ethos establishes the speaker\'s trustworthiness, expertise, and character.', difficulty: 'easy', points: 1 },
      { id: 'q3', question: 'What is the purpose of the "analysis" part of an evidence sandwich?', type: 'multiple_choice', options: ['To introduce the source', 'To quote the evidence exactly', 'To explain how evidence supports your argument', 'To cite the page number'], correctAnswer: 'To explain how evidence supports your argument', explanation: 'Analysis connects the evidence to your thesis - you explain WHY this evidence matters.', difficulty: 'medium', points: 1 },
      { id: 'q4', question: 'True or False: The strongest persuasive essays avoid mentioning opposing viewpoints.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Strong essays address counterarguments to demonstrate intellectual honesty and strengthen credibility.', difficulty: 'easy', points: 1 },
      { id: 'q5', question: '"As a 30-year veteran police officer, I can tell you that community policing works." This statement primarily uses:', type: 'multiple_choice', options: ['Pathos', 'Logos', 'Ethos', 'None of the above'], correctAnswer: 'Ethos', explanation: 'The speaker establishes credibility through their experience and expertise.', difficulty: 'medium', points: 1 },
      { id: 'q6', question: 'Which essay structure is best for a hostile audience?', type: 'multiple_choice', options: ['Classical 5-paragraph', 'Rogerian', 'Chronological', 'Compare/contrast'], correctAnswer: 'Rogerian', explanation: 'Rogerian structure establishes common ground before presenting your argument, making resistant audiences more receptive.', difficulty: 'medium', points: 1 },
      { id: 'q7', question: 'What is the difference between "refuting" and "conceding" a counterargument?', type: 'short_answer', correctAnswer: 'Refuting means proving the counterargument is wrong with evidence or reasoning. Conceding means admitting the counterargument has some validity but arguing your position is still stronger or more important.', explanation: 'Understanding these response strategies is key to effective argumentation.', difficulty: 'medium', points: 2 },
      { id: 'q8', question: 'True or False: "I believe that homework should be optional" is an effective thesis statement.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Effective thesis statements avoid "I believe" phrases and should be more specific about reasoning.', difficulty: 'easy', points: 1 },
      { id: 'q9', question: 'Identify the rhetorical appeal: "Every year, 3,000 teenagers die in car accidents caused by distracted driving."', type: 'multiple_choice', options: ['Ethos', 'Pathos', 'Logos', 'Both pathos and logos'], correctAnswer: 'Both pathos and logos', explanation: 'The statistic appeals to logic (logos), while "teenagers die" appeals to emotion (pathos).', difficulty: 'hard', points: 1 },
      { id: 'q10', question: 'Write a debatable thesis statement about a topic of your choice.', type: 'short_answer', correctAnswer: 'Answers will vary. Should be debatable (not a fact), specific, assertive (no "I think"), and include reasoning or preview of arguments.', explanation: 'Evaluating thesis statements is a core skill for this unit.', difficulty: 'medium', points: 2 }
    ],
    totalPoints: 12,
    estimatedTime: 18
  },
  flashcardContent: {
    title: 'Persuasive Writing Flashcards',
    cards: [
      { id: 'card1', front: 'What makes a thesis "debatable"?', back: 'Someone could reasonably disagree with it - it\'s not a fact but a claim requiring evidence', category: 'thesis' },
      { id: 'card2', front: 'What is ethos?', back: 'Appeal to credibility, character, and trustworthiness of the speaker/writer', category: 'rhetoric' },
      { id: 'card3', front: 'What is pathos?', back: 'Appeal to emotions, values, and beliefs of the audience', category: 'rhetoric' },
      { id: 'card4', front: 'What is logos?', back: 'Appeal to logic, reason, and evidence', category: 'rhetoric' },
      { id: 'card5', front: 'What are the 3 parts of an evidence sandwich?', back: '1) Introduction/context, 2) Evidence (quote/stat), 3) Analysis explaining how it supports your argument', category: 'evidence' },
      { id: 'card6', front: 'Why address counterarguments?', back: 'Strengthens credibility, shows intellectual honesty, prevents objections, makes argument more convincing', category: 'counterargument' },
      { id: 'card7', front: 'What\'s the difference between refute and concede?', back: 'Refute = prove wrong; Concede = admit partial validity, then pivot to why your argument is still stronger', category: 'counterargument' },
      { id: 'card8', front: 'When use Rogerian structure?', back: 'For hostile/resistant audiences or controversial topics - establishes common ground first', category: 'structure' },
      { id: 'card9', front: 'When use Classical structure?', back: 'For neutral audiences when you have strong evidence for direct argument', category: 'structure' },
      { id: 'card10', front: 'Thesis formula', back: '[Topic] + [Position] + [Reasoning/Preview of arguments]', category: 'thesis' },
      { id: 'card11', front: 'Why avoid "I believe" in thesis?', back: 'Academic writing should be assertive and objective; "I believe" weakens the claim', category: 'thesis' },
      { id: 'card12', front: 'Five types of evidence', back: 'Statistics, expert testimony, examples, anecdotes, analogies', category: 'evidence' },
      { id: 'card13', front: 'Transition words for contrast', back: 'however, conversely, on the other hand, nevertheless, although', category: 'structure' },
      { id: 'card14', front: 'Transition words for addition', back: 'furthermore, moreover, additionally, also, in addition', category: 'structure' },
      { id: 'card15', front: 'What makes evidence "credible"?', back: 'From reputable sources, recent (when relevant), from experts in the field, peer-reviewed', category: 'evidence' }
    ]
  }
};

// ============================================
// SAMPLE 7: Social Studies Grade 2 - Maps
// ============================================

const SAMPLE_SOCIAL_STUDIES_MAPS_2: SampleTeacherContent = {
  id: 'sample_geography_maps_2',
  title: 'Introduction to Maps & Geography',
  description: 'An engaging introduction to maps and basic geography concepts including cardinal directions, map symbols, and map keys for 2nd graders.',
  subject: 'SOCIAL_STUDIES',
  gradeLevel: '2',
  contentType: 'LESSON',
  estimatedDuration: 40,
  tags: ['maps', 'geography', 'cardinal directions', 'map skills', 'compass rose'],
  curriculum: 'american',
  lessonContent: {
    title: 'Introduction to Maps & Geography',
    summary: 'Students will discover the exciting world of maps! They will learn what maps are, why people use them, how to read cardinal directions using a compass rose, and how to interpret map symbols using a map key. Hands-on activities will reinforce these essential geography skills.',
    objectives: [
      'Explain what a map is and why people use maps',
      'Identify and use the four cardinal directions (North, South, East, West)',
      'Use a compass rose to find directions on a map',
      'Read and interpret map symbols using a map key/legend',
      'Create a simple map with symbols and a key'
    ],
    sections: [
      {
        title: 'What is a Map?',
        content: 'A **map** is a drawing or picture that shows what a place looks like from above - like a bird flying high in the sky looking down!\n\nMaps help us:\n- Find places we want to go\n- See how far away things are\n- Learn about new places without visiting them\n- Know which direction to travel\n\nThere are many kinds of maps:\n- **City maps** show streets and buildings\n- **World maps** show countries and oceans\n- **Trail maps** help hikers find paths\n- **Treasure maps** lead to hidden treasure (in stories!)\n\nMaps are like special pictures with their own language. Today we\'ll learn how to read this language!',
        duration: 8,
        activities: [{
          name: 'Bird\'s-Eye View',
          description: 'Students look at a toy car, stuffed animal, or object from the side, then from directly above. They draw both views and discuss how maps show the "from above" view.',
          materials: ['Small toys or objects', 'Drawing paper', 'Crayons'],
          duration: 8,
          discussionQuestions: ['How does the object look different from above?', 'Can you see things from above that you couldn\'t see from the side?', 'Why do you think maps show places from above?']
        }],
        teachingTips: ['Start with the classroom as a familiar "place" to map', 'Use Google Earth to show the bird\'s-eye view concept'],
        visualAids: ['Side view vs. top view comparison images', 'Simple map examples'],
        realWorldConnections: ['Maps in the car', 'Maps on phones', 'Maps at the zoo or theme park']
      },
      {
        title: 'Cardinal Directions',
        content: 'There are four main directions called **cardinal directions**:\n\n**North (N)** - Up on most maps\n**South (S)** - Down on most maps\n**East (E)** - Right on most maps\n**West (W)** - Left on most maps\n\n**Memory Trick**: "**N**ever **E**at **S**oggy **W**affles"\nStart at the top (North) and go clockwise!\n\nThese directions help us describe where things are:\n- "The playground is **north** of our school."\n- "The library is **east** of the classroom."\n\nNo matter where you are in the world, North is always toward the North Pole, and South is always toward the South Pole!',
        duration: 10,
        activities: [{
          name: 'Direction Dance',
          description: 'Students stand facing "North" (post a sign on the classroom wall). Teacher calls out directions and students point or take a step in that direction. Speed up for more challenge!',
          materials: ['Direction signs (N, S, E, W) posted on classroom walls', 'Open space'],
          duration: 8,
          discussionQuestions: ['If you face North, what direction is behind you?', 'If you turn East, what direction is on your left?', 'What\'s the memory trick for the directions?']
        }],
        teachingTips: ['Post cardinal direction signs on classroom walls permanently', 'Practice with real directions in your school'],
        visualAids: ['Large compass rose poster', 'Cardinal direction cards'],
        realWorldConnections: ['Following directions to a friend\'s house', 'Hiking trails', 'Weather reports ("A storm is coming from the West")']
      },
      {
        title: 'The Compass Rose',
        content: 'A **compass rose** is a special symbol on maps that shows directions. It looks like a star with points!\n\nThe compass rose helps us know which way is:\n- **N** for North (usually at the top)\n- **S** for South (usually at the bottom)\n- **E** for East (usually on the right)\n- **W** for West (usually on the left)\n\nWhen you look at a map, first find the compass rose. Then you\'ll know which direction everything is!\n\n**Fun Fact**: The compass rose got its name because it looks like a rose flower with petals pointing in different directions!',
        duration: 8,
        activities: [{
          name: 'Compass Rose Hunt',
          description: 'Give students various maps (world maps, park maps, city maps). They search for and circle the compass rose on each map, then use it to answer direction questions.',
          materials: ['Various printed maps', 'Crayons or markers', 'Direction question worksheet'],
          duration: 8,
          discussionQuestions: ['Did every map have a compass rose?', 'Did they all look the same?', 'If a map doesn\'t have a compass rose, how could you figure out directions?']
        }],
        teachingTips: ['Show different styles of compass roses - simple and decorative', 'Point out that North isn\'t always at the top on every map'],
        visualAids: ['Different compass rose designs', 'Maps with compass roses highlighted'],
        realWorldConnections: ['Ship navigation', 'Compass tools (real compasses)', 'Airplane cockpits']
      },
      {
        title: 'Map Symbols and the Map Key',
        content: 'Maps use **symbols** (small pictures or shapes) to represent real things. This keeps maps from being too crowded with words!\n\nCommon map symbols:\n- **Blue wavy lines** = rivers or water\n- **Green areas** = parks or forests\n- **Small squares** = buildings\n- **Stars** = capital cities\n- **Dots** = other cities\n- **Lines** = roads or paths\n\nThe **map key** (also called a **legend**) is a box on the map that explains what each symbol means. Always check the map key first - it\'s like a secret code decoder!\n\nDifferent maps use different symbols, so always check the key!',
        duration: 8,
        activities: [{
          name: 'Symbol Match',
          description: 'Students play a matching game connecting map symbols to what they represent. Then they create their own symbols for things in the classroom.',
          materials: ['Symbol matching cards', 'Blank paper', 'Crayons'],
          duration: 10,
          discussionQuestions: ['Why do maps use symbols instead of words?', 'What symbol would you create for a playground?', 'Why is the map key important?']
        }],
        teachingTips: ['Create a classroom "map key" for your room map activity', 'Discuss why certain symbols make sense (blue for water, green for nature)'],
        visualAids: ['Common map symbols chart', 'Example map keys'],
        realWorldConnections: ['Road signs use symbols too', 'App icons are like symbols', 'Signs at stores and public places']
      },
      {
        title: 'Making Our Own Maps',
        content: 'Now it\'s your turn to be a mapmaker!\n\nTo make a good map:\n1. **Think** about the place from above (bird\'s-eye view)\n2. **Draw** the important things as simple shapes\n3. **Add** a compass rose to show directions\n4. **Create** symbols for things in your map\n5. **Make** a map key to explain your symbols\n\nGood maps are:\n- Clear and easy to read\n- Have a compass rose\n- Use symbols with a key\n- Show the important parts of a place',
        duration: 6,
        activities: [{
          name: 'Classroom Map Project',
          description: 'Students create a map of the classroom from above, including a compass rose, symbols for furniture/areas, and a complete map key.',
          materials: ['Large paper', 'Crayons/markers', 'Map template (optional)', 'Classroom to reference'],
          duration: 15,
          discussionQuestions: ['What symbols did you create?', 'How did you decide which things to include?', 'If someone new came to our class, could they use your map?']
        }],
        teachingTips: ['Walk around the room first, noting key features to include', 'Accept simplified representations - it\'s about the concept'],
        visualAids: ['Student map examples', 'Step-by-step map making guide'],
        realWorldConnections: ['Architects and city planners make maps', 'Video game designers create map layouts', 'Delivery drivers use maps every day']
      }
    ],
    vocabulary: [
      { term: 'Map', definition: 'A drawing that shows what a place looks like from above', example: 'We used a map to find our way to the zoo.', memoryAid: 'Maps help us find our way!' },
      { term: 'Cardinal Directions', definition: 'The four main directions: North, South, East, and West', example: 'The playground is north of the school.', memoryAid: 'Never Eat Soggy Waffles (N-E-S-W)' },
      { term: 'Compass Rose', definition: 'A symbol on a map that shows the four cardinal directions', example: 'I found the compass rose to see which way was north.', memoryAid: 'It looks like a rose flower pointing in directions!' },
      { term: 'Map Key', definition: 'A box that explains what the symbols on a map mean (also called a legend)', example: 'The map key showed that blue meant water.', memoryAid: 'The key unlocks the meaning of symbols!' },
      { term: 'Symbol', definition: 'A small picture or shape that represents something on a map', example: 'The tree symbol showed where the forest was.', memoryAid: 'Symbols are shortcut pictures' }
    ],
    practiceExercises: [
      { question: 'Name the four cardinal directions in order starting from the top of a map and going clockwise.', type: 'practice', hint: 'Use the memory trick!', answer: 'North, East, South, West (Never Eat Soggy Waffles)' },
      { question: 'Look at a simple map. If the school is in the center, and the park is to the right of the school, what direction is the park from the school?', type: 'practice', hint: 'On most maps, right is which direction?', answer: 'East - On most maps, right is East.' },
      { question: 'Why is a map key important?', type: 'practice', hint: 'What does the map key help you understand?', answer: 'A map key is important because it tells you what each symbol on the map means. Without it, you wouldn\'t know what the pictures and shapes represent.' }
    ],
    assessment: {
      questions: [
        { question: 'What does a map show?', type: 'multiple_choice', options: ['What a place looks like from the side', 'What a place looks like from above', 'What a place sounds like', 'What a place smells like'], correctAnswer: 'What a place looks like from above', explanation: 'Maps show places from a bird\'s-eye view - looking down from above.', points: 2, difficulty: 'easy' },
        { question: 'On most maps, which direction is at the TOP?', type: 'multiple_choice', options: ['South', 'East', 'West', 'North'], correctAnswer: 'North', explanation: 'On most maps, North is at the top, which is shown by the compass rose.', points: 2, difficulty: 'easy' },
        { question: 'What is a compass rose?', type: 'multiple_choice', options: ['A type of flower', 'A symbol that shows directions on a map', 'A map of a garden', 'A kind of key'], correctAnswer: 'A symbol that shows directions on a map', explanation: 'The compass rose is a symbol on maps that shows the four cardinal directions.', points: 2, difficulty: 'easy' },
        { question: 'True or False: A map key tells you what the symbols on a map mean.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'True', explanation: 'The map key (or legend) explains what each symbol on the map represents.', points: 2, difficulty: 'easy' },
        { question: 'What are the four cardinal directions?', type: 'short_answer', correctAnswer: 'North, South, East, and West', explanation: 'The four cardinal directions are North, South, East, and West.', points: 2, difficulty: 'easy' }
      ],
      totalPoints: 10,
      passingScore: 7,
      scoringGuide: 'Award full points for correct answers. For the short answer, accept the four directions in any order.'
    },
    summaryPoints: [
      'A map is a picture of a place seen from above (bird\'s-eye view)',
      'The four cardinal directions are North, South, East, and West',
      'A compass rose is a symbol that shows directions on a map',
      'Map symbols represent real things, and the map key explains them'
    ],
    reviewQuestions: ['What is a map?', 'What memory trick helps you remember the cardinal directions?', 'Why do we need a map key?'],
    teacherNotes: 'This lesson pairs well with the sample Audio Update about Geography. For struggling students, focus on the four cardinal directions before introducing the compass rose. Use kinesthetic learning - have students physically move in directions. Consider creating a large floor map students can walk on. For advanced students, introduce intermediate directions (NE, SE, SW, NW).',
    additionalResources: ['National Geographic Kids map activities', 'Google Earth virtual exploration'],
    prerequisites: ['Left and right recognition', 'Basic shape recognition'],
    nextSteps: 'Introduce intermediate directions, map scales, and different types of maps (physical, political, etc.).'
  },
  quizContent: {
    title: 'Maps & Geography Quiz',
    questions: [
      { id: 'q1', question: 'What is a map?', type: 'multiple_choice', options: ['A drawing of a place from above', 'A photograph of a place', 'A video of a place', 'A list of places'], correctAnswer: 'A drawing of a place from above', explanation: 'A map is a drawing that shows what a place looks like from a bird\'s-eye view (above).', difficulty: 'easy', points: 1 },
      { id: 'q2', question: 'What does the compass rose show?', type: 'multiple_choice', options: ['How pretty the map is', 'The four cardinal directions', 'Where flowers grow', 'How old the map is'], correctAnswer: 'The four cardinal directions', explanation: 'The compass rose shows North, South, East, and West on a map.', difficulty: 'easy', points: 1 },
      { id: 'q3', question: 'Which direction is usually at the TOP of a map?', type: 'multiple_choice', options: ['West', 'East', 'South', 'North'], correctAnswer: 'North', explanation: 'On most maps, North is at the top.', difficulty: 'easy', points: 1 },
      { id: 'q4', question: 'What is the memory trick for the four directions?', type: 'multiple_choice', options: ['Never Eat Soggy Waffles', 'Waffles Eat Soggy Never', 'South Never West East', 'Eat Never West South'], correctAnswer: 'Never Eat Soggy Waffles', explanation: 'Never Eat Soggy Waffles helps us remember N-E-S-W going clockwise from North.', difficulty: 'easy', points: 1 },
      { id: 'q5', question: 'True or False: Blue on a map usually means water.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'True', explanation: 'Blue is commonly used to show water on maps (oceans, lakes, rivers).', difficulty: 'easy', points: 1 },
      { id: 'q6', question: 'What is a map key?', type: 'multiple_choice', options: ['A key that opens the map', 'A box that explains map symbols', 'The title of the map', 'A lock on the map'], correctAnswer: 'A box that explains map symbols', explanation: 'A map key (legend) is a box that tells you what each symbol on the map means.', difficulty: 'easy', points: 1 },
      { id: 'q7', question: 'If you face North, what direction is behind you?', type: 'multiple_choice', options: ['East', 'West', 'South', 'North'], correctAnswer: 'South', explanation: 'South is the opposite of North, so if you face North, South is behind you.', difficulty: 'medium', points: 1 },
      { id: 'q8', question: 'Why do maps use symbols?', type: 'short_answer', correctAnswer: 'Maps use symbols to show things without using many words and to keep the map from being too crowded/cluttered.', explanation: 'Symbols make maps easier to read and less cluttered than words.', difficulty: 'medium', points: 2 },
      { id: 'q9', question: 'True or False: Every map looks exactly the same.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Different maps show different things (cities, trails, countries) and use different symbols.', difficulty: 'easy', points: 1 },
      { id: 'q10', question: 'On a map, right is usually which direction?', type: 'multiple_choice', options: ['North', 'South', 'East', 'West'], correctAnswer: 'East', explanation: 'On most maps with North at the top, East is on the right.', difficulty: 'medium', points: 1 }
    ],
    totalPoints: 11,
    estimatedTime: 10
  },
  flashcardContent: {
    title: 'Maps & Geography Flashcards',
    cards: [
      { id: 'card1', front: 'What is a map?', back: 'A drawing that shows what a place looks like from above', category: 'basics' },
      { id: 'card2', front: 'What are the 4 cardinal directions?', back: 'North, South, East, West', category: 'directions' },
      { id: 'card3', front: 'What is the compass rose?', back: 'A symbol on maps that shows the four cardinal directions', category: 'map parts' },
      { id: 'card4', front: 'What is a map key?', back: 'A box that explains what the symbols on a map mean (also called a legend)', category: 'map parts' },
      { id: 'card5', front: 'On most maps, which direction is at the top?', back: 'North', category: 'directions' },
      { id: 'card6', front: 'Memory trick for directions', back: 'Never Eat Soggy Waffles (N-E-S-W going clockwise)', category: 'directions' },
      { id: 'card7', front: 'What does blue usually mean on a map?', back: 'Water (oceans, lakes, rivers)', category: 'symbols' },
      { id: 'card8', front: 'What does green usually mean on a map?', back: 'Parks, forests, or nature areas', category: 'symbols' },
      { id: 'card9', front: 'If you face North, what\'s behind you?', back: 'South', category: 'directions' },
      { id: 'card10', front: 'If you face North, what\'s on your right?', back: 'East', category: 'directions' },
      { id: 'card11', front: 'Why do maps use symbols?', back: 'To show things without many words and keep maps easy to read', category: 'concepts' },
      { id: 'card12', front: 'What is bird\'s-eye view?', back: 'Looking at something from above, like a bird flying in the sky', category: 'concepts' },
      { id: 'card13', front: 'If North is up, where is West?', back: 'Left side of the map', category: 'directions' },
      { id: 'card14', front: 'If North is up, where is East?', back: 'Right side of the map', category: 'directions' },
      { id: 'card15', front: 'What should you always check when reading a new map?', back: 'The compass rose (for directions) and the map key (for symbols)', category: 'concepts' }
    ]
  }
};

// ============================================
// SAMPLE 8: Arabic Grade 6 - Verb Conjugation
// ============================================

const SAMPLE_ARABIC_VERBS_6: SampleTeacherContent = {
  id: 'sample_arabic_verbs_6',
  title: 'تصريف الأفعال - Verb Conjugation in Arabic',
  description: 'A comprehensive lesson on Arabic verb conjugation covering past (الماضي), present (المضارع), and imperative (الأمر) tenses with pattern recognition and practice.',
  subject: 'ARABIC',
  gradeLevel: '6',
  contentType: 'LESSON',
  estimatedDuration: 50,
  tags: ['arabic', 'verbs', 'conjugation', 'grammar', 'الأفعال', 'تصريف'],
  curriculum: 'arabic',
  lessonContent: {
    title: 'تصريف الأفعال - Verb Conjugation in Arabic',
    summary: 'Students will learn to conjugate Arabic verbs in the three main tenses: past (الماضي), present (المضارع), and imperative (الأمر). Using the root system as a foundation, students will recognize patterns and apply conjugation rules for different pronouns.',
    objectives: [
      'Understand the Arabic root system and how verbs are derived from 3-letter roots',
      'Conjugate verbs in past tense (الماضي) for all pronouns',
      'Conjugate verbs in present tense (المضارع) for all pronouns',
      'Form imperative commands (الأمر) correctly',
      'Identify verb patterns and apply conjugation rules to new verbs'
    ],
    sections: [
      {
        title: 'The Arabic Root System',
        content: 'Arabic verbs are built from **roots** (جذر) - usually 3 consonant letters that carry the core meaning.\n\n**Example Root: ك-ت-ب (k-t-b)** = writing\n- كَتَبَ (kataba) = he wrote\n- يَكْتُبُ (yaktub) = he writes\n- كِتاب (kitaab) = book\n- مَكْتَبَة (maktaba) = library\n- كاتِب (kaatib) = writer\n\n**Common 3-letter roots:**\n- ف-ع-ل (f-ʿ-l) = doing\n- ذ-ه-ب (dh-h-b) = going\n- ج-ل-س (j-l-s) = sitting\n- ق-ر-أ (q-r-ʾ) = reading\n- ش-ر-ب (sh-r-b) = drinking\n\nUnderstanding roots helps you recognize word families and predict verb forms!',
        duration: 10,
        activities: [{
          name: 'Root Detective',
          description: 'Students receive cards with Arabic words from the same root. They group words by root and identify the core meaning of each root family.',
          materials: ['Word cards with root-based vocabulary', 'Sorting mats', 'Root chart'],
          duration: 10,
          discussionQuestions: ['What do all these words have in common?', 'Can you guess a new word from this root?', 'How does the root give a clue to meaning?']
        }],
        teachingTips: ['Use color coding for the three root letters', 'Start with very common roots students already know from vocabulary'],
        visualAids: ['Root tree diagram showing word derivations', 'Color-coded root letter chart'],
        realWorldConnections: ['Arabic dictionary is organized by roots', 'Understanding roots helps with reading comprehension']
      },
      {
        title: 'Past Tense (الفعل الماضي)',
        content: 'The past tense describes actions that already happened.\n\n**Base Form**: فَعَلَ (faʿala) = he did\n\n**Past Tense Conjugation Pattern:**\n\n| Pronoun | Arabic | Ending | Example (كتب) |\n|---------|--------|--------|---------------|\n| He (هو) | فَعَلَ | -َ | كَتَبَ (kataba) |\n| She (هي) | فَعَلَتْ | -تْ | كَتَبَتْ (katabat) |\n| You (m.) أنتَ | فَعَلْتَ | -تَ | كَتَبْتَ (katabta) |\n| You (f.) أنتِ | فَعَلْتِ | -تِ | كَتَبْتِ (katabti) |\n| I (أنا) | فَعَلْتُ | -تُ | كَتَبْتُ (katabtu) |\n| They (m.) هم | فَعَلُوا | -وا | كَتَبُوا (katabuu) |\n| We (نحن) | فَعَلْنا | -نا | كَتَبْنا (katabnaa) |\n\n**Notice:** The root letters (ك-ت-ب) stay the same - only the endings change!',
        duration: 12,
        activities: [{
          name: 'Conjugation Relay',
          description: 'Teams race to correctly conjugate given verbs in past tense. Each team member conjugates for one pronoun, then passes to the next.',
          materials: ['Verb cards', 'Conjugation chart templates', 'Timer'],
          duration: 10,
          discussionQuestions: ['Which endings were easiest to remember?', 'What pattern do you notice for "I/you/we" forms?', 'How is "she" different from "he"?']
        }],
        teachingTips: ['Teach the endings as a song or chant', 'Use hand gestures for each pronoun'],
        visualAids: ['Past tense conjugation chart', 'Ending patterns poster'],
        realWorldConnections: ['Telling stories about yesterday', 'Writing about historical events']
      },
      {
        title: 'Present Tense (الفعل المضارع)',
        content: 'The present tense describes actions happening now or habitually.\n\n**Pattern**: Prefix + Root + Suffix\n\n**Present Tense Conjugation:**\n\n| Pronoun | Prefix | Suffix | Example (كتب) |\n|---------|--------|--------|---------------|\n| He (هو) | يَـ | -ُ | يَكْتُبُ (yaktub) |\n| She (هي) | تَـ | -ُ | تَكْتُبُ (taktub) |\n| You (m.) أنتَ | تَـ | -ُ | تَكْتُبُ (taktub) |\n| You (f.) أنتِ | تَـ | -ِينَ | تَكْتُبِينَ (taktubeen) |\n| I (أنا) | أَ | -ُ | أَكْتُبُ (aktub) |\n| They (m.) هم | يَـ | -ُونَ | يَكْتُبُونَ (yaktubuun) |\n| We (نحن) | نَـ | -ُ | نَكْتُبُ (naktub) |\n\n**Prefix Memory Trick**: أ-ن-ي-ت (ANYT)\n- أ = I (أنا)\n- ن = We (نحن)\n- ي = He/They (هو/هم)\n- ت = She/You (هي/أنت)',
        duration: 12,
        activities: [{
          name: 'Present Tense Transformation',
          description: 'Students receive past tense verbs and transform them to present tense for assigned pronouns. They check each other\'s work.',
          materials: ['Transformation worksheet', 'Verb dice', 'Pronoun cards'],
          duration: 10,
          discussionQuestions: ['What letter tells you it\'s present tense?', 'Which pronouns share the same prefix?', 'How is present tense different from past tense?']
        }],
        teachingTips: ['Emphasize the prefixes as the key identifier of present tense', 'Practice with common daily action verbs'],
        visualAids: ['Present tense prefix chart (أنيت)', 'Verb transformation flowchart'],
        realWorldConnections: ['Describing daily routines', 'Talking about hobbies and habits']
      },
      {
        title: 'Imperative (فعل الأمر)',
        content: 'The imperative is used for commands and requests.\n\n**Forming the Imperative:**\n1. Start with the present tense "you" form\n2. Remove the prefix (تَـ)\n3. Add أ at the beginning if needed (when first letter has sukoon)\n\n**Examples:**\n- تَكْتُبُ → اُكْتُبْ (uktub!) = Write!\n- تَجْلِسُ → اِجْلِسْ (ijlis!) = Sit!\n- تَقْرَأُ → اِقْرَأْ (iqraʾ!) = Read!\n- تَذْهَبُ → اِذْهَبْ (idhhab!) = Go!\n\n**For Feminine (أنتِ):** Add ي at the end\n- اُكْتُبِي (uktubii!) = Write! (to a female)\n\n**For Plural (أنتم):** Add وا at the end\n- اُكْتُبُوا (uktubuu!) = Write! (to a group)',
        duration: 10,
        activities: [{
          name: 'Command Challenge',
          description: 'Students practice giving and following commands in Arabic. One student gives a command, another performs it. Commands increase in complexity.',
          materials: ['Command cards', 'Props for actions', 'Reward stickers'],
          duration: 8,
          discussionQuestions: ['How do you make a polite request vs. a direct command?', 'What changes for feminine commands?', 'When do you add أ at the beginning?']
        }],
        teachingTips: ['Practice with classroom commands first (stand, sit, open, close)', 'Use Total Physical Response (TPR) methodology'],
        visualAids: ['Imperative formation steps poster', 'Common commands chart'],
        realWorldConnections: ['Classroom instructions', 'Recipes and directions', 'Signs and warnings']
      },
      {
        title: 'Putting It All Together',
        content: '**Summary of All Three Tenses:**\n\nUsing the root ك-ت-ب (to write):\n\n| Tense | هو (He) | هي (She) | أنا (I) |\n|-------|---------|----------|--------|\n| Past | كَتَبَ | كَتَبَتْ | كَتَبْتُ |\n| Present | يَكْتُبُ | تَكْتُبُ | أَكْتُبُ |\n| Command | - | - | - |\n\n**Quick Recognition Tips:**\n- Past tense: Ends with vowel sounds (-a, -at, -tu)\n- Present tense: Starts with أ-ن-ي-ت\n- Imperative: Starts with ا (hamza)\n\n**Remember:** The 3 root letters always stay together, only the affixes change!',
        duration: 6,
        activities: [{
          name: 'Tense Sorting Game',
          description: 'Students receive a mix of conjugated verbs and sort them by tense (past, present, imperative), then identify the root and pronoun for each.',
          materials: ['Mixed verb cards', 'Three sorting bins labeled by tense', 'Answer key for self-checking'],
          duration: 10,
          discussionQuestions: ['What\'s your strategy for identifying the tense?', 'Which tense is easiest to recognize? Why?', 'Can you create a sentence using all three tenses?']
        }],
        teachingTips: ['Create a master reference chart students can keep', 'Practice with verb stories using all three tenses'],
        visualAids: ['Three-tense comparison chart', 'Verb family tree'],
        realWorldConnections: ['Writing stories with proper tense usage', 'Understanding Arabic news and literature']
      }
    ],
    vocabulary: [
      { term: 'جذر (Root)', definition: 'The 3 consonant letters that carry the core meaning of Arabic words', example: 'ك-ت-ب is the root for writing-related words', memoryAid: 'Roots are like word families' },
      { term: 'الفعل الماضي (Past Tense)', definition: 'Verb form for actions that already happened', example: 'كَتَبَ (he wrote)', memoryAid: 'الماضي = past, already passed' },
      { term: 'الفعل المضارع (Present Tense)', definition: 'Verb form for current or habitual actions', example: 'يَكْتُبُ (he writes)', memoryAid: 'المضارع = happening now, present' },
      { term: 'فعل الأمر (Imperative)', definition: 'Verb form for commands and requests', example: '!اُكْتُبْ (Write!)', memoryAid: 'أمر = order, command' },
      { term: 'تصريف (Conjugation)', definition: 'Changing a verb to match different pronouns and tenses', example: 'كتب → كتبت → كتبنا', memoryAid: 'صرف = to spend/change - conjugation changes the verb' }
    ],
    practiceExercises: [
      { question: 'Conjugate the verb ذهب (to go) in past tense for: هو، هي، أنا، نحن', type: 'practice', hint: 'Use the same endings as كتب - the root letters stay, only endings change.', answer: 'هو: ذَهَبَ | هي: ذَهَبَتْ | أنا: ذَهَبْتُ | نحن: ذَهَبْنا' },
      { question: 'Identify the tense and pronoun: يَقْرَأُ', type: 'practice', hint: 'What prefix does it have? What does that prefix indicate?', answer: 'Present tense (يـ prefix) for "he" (هو). Root: ق-ر-أ (to read). Meaning: He reads.' },
      { question: 'Convert "تَجْلِسُ" to an imperative command.', type: 'practice', hint: 'Remove the prefix and add ا if the first letter has sukoon.', answer: 'اِجْلِسْ (ijlis!) = Sit!' }
    ],
    assessment: {
      questions: [
        { question: 'What is the root of the words: كِتاب، كاتِب، مَكْتَبَة?', type: 'multiple_choice', options: ['ك-ت-ب', 'ك-ب-ر', 'ت-ب-ع', 'ب-ت-ك'], correctAnswer: 'ك-ت-ب', explanation: 'All these words relate to writing, sharing the root ك-ت-ب (k-t-b).', points: 2, difficulty: 'easy' },
        { question: 'Which prefix indicates present tense for "I" (أنا)?', type: 'multiple_choice', options: ['يـ', 'تـ', 'نـ', 'أ'], correctAnswer: 'أ', explanation: 'For "I" in present tense, we use the prefix أ (أَكْتُبُ = I write).', points: 2, difficulty: 'easy' },
        { question: 'True or False: كَتَبَتْ means "she wrote."', type: 'true_false', options: ['True', 'False'], correctAnswer: 'True', explanation: 'The ending -تْ indicates feminine "she" in past tense.', points: 1, difficulty: 'easy' },
        { question: 'Conjugate فَعَلَ for "we" (نحن) in past tense.', type: 'short_answer', correctAnswer: 'فَعَلْنا', explanation: 'For "we" in past tense, add the ending -نا.', points: 3, difficulty: 'medium' },
        { question: 'Convert يَجْلِسُ to imperative (command for أنتَ).', type: 'short_answer', correctAnswer: 'اِجْلِسْ', explanation: 'Remove prefix, add initial alif: يَجْلِسُ → جلس → اِجْلِسْ (Sit!)', points: 2, difficulty: 'medium' }
      ],
      totalPoints: 10,
      passingScore: 7,
      scoringGuide: 'Award full points for correct answers with proper vowel marks when applicable. Partial credit for correct root without vowels.'
    },
    summaryPoints: [
      'Arabic verbs are built from 3-letter roots that carry core meaning',
      'Past tense changes endings: -a (he), -at (she), -tu (I), -na (we), -u (they)',
      'Present tense uses prefixes: أ (I), ن (we), ي (he/they), ت (she/you)',
      'Imperative removes prefix and adds alif: تَكْتُبُ → اُكْتُبْ'
    ],
    reviewQuestions: ['What are the three main verb tenses in Arabic?', 'How do you identify past tense vs. present tense?', 'What is the أنيت memory trick for?'],
    teacherNotes: 'This lesson focuses on Form I (basic) verbs. Weak verbs (with و or ي as root letters) follow slightly different patterns and should be introduced separately. Use songs and chants for memorizing conjugation patterns. Consider creating verb conjugation cards for students to practice at home. For struggling students, focus on the most common pronouns (هو، هي، أنا) before expanding to others.',
    additionalResources: ['Arabic verb conjugation tables', 'Interactive Arabic verb practice apps'],
    prerequisites: ['Arabic alphabet and reading skills', 'Basic vocabulary including common verbs', 'Understanding of pronouns in Arabic'],
    nextSteps: 'Introduce derived forms (أوزان الفعل), weak verbs (الأفعال المعتلة), and negative verb forms.'
  },
  quizContent: {
    title: 'Arabic Verb Conjugation Quiz | اختبار تصريف الأفعال',
    questions: [
      { id: 'q1', question: 'What is the root of كَتَبَ (he wrote)?', type: 'multiple_choice', options: ['ك-ت-ب', 'ك-ب-ت', 'ت-ب-ك', 'ب-ك-ت'], correctAnswer: 'ك-ت-ب', explanation: 'The three root letters are ك-ت-ب in order.', difficulty: 'easy', points: 1 },
      { id: 'q2', question: 'Which is past tense for "she" (هي)?', type: 'multiple_choice', options: ['كَتَبَ', 'كَتَبَتْ', 'يَكْتُبُ', 'تَكْتُبُ'], correctAnswer: 'كَتَبَتْ', explanation: 'The ending -تْ indicates feminine past tense.', difficulty: 'easy', points: 1 },
      { id: 'q3', question: 'The prefix "يـ" in present tense indicates:', type: 'multiple_choice', options: ['I (أنا)', 'He or They (هو/هم)', 'She (هي)', 'We (نحن)'], correctAnswer: 'He or They (هو/هم)', explanation: 'يـ is used for هو (he) and هم (they masculine).', difficulty: 'medium', points: 1 },
      { id: 'q4', question: 'True or False: أَكْتُبُ means "I write."', type: 'true_false', options: ['True', 'False'], correctAnswer: 'True', explanation: 'The prefix أ indicates "I" in present tense.', difficulty: 'easy', points: 1 },
      { id: 'q5', question: 'What is the imperative (command) of تَذْهَبُ?', type: 'multiple_choice', options: ['ذَهَبَ', 'يَذْهَبُ', 'اِذْهَبْ', 'ذاهِب'], correctAnswer: 'اِذْهَبْ', explanation: 'Remove prefix تـ and add alif: اِذْهَبْ (Go!)', difficulty: 'medium', points: 1 },
      { id: 'q6', question: 'فَعَلْنا is which pronoun in past tense?', type: 'multiple_choice', options: ['أنا (I)', 'أنتَ (You m.)', 'نحن (We)', 'هم (They)'], correctAnswer: 'نحن (We)', explanation: 'The ending -نا indicates "we" in past tense.', difficulty: 'medium', points: 1 },
      { id: 'q7', question: 'What does الفعل المضارع mean?', type: 'multiple_choice', options: ['Past tense verb', 'Present tense verb', 'Command verb', 'Future verb'], correctAnswer: 'Present tense verb', explanation: 'المضارع is the Arabic term for present tense.', difficulty: 'easy', points: 1 },
      { id: 'q8', question: 'Conjugate جَلَسَ (to sit) for أنا in past tense.', type: 'short_answer', correctAnswer: 'جَلَسْتُ', explanation: 'Add -تُ ending for "I" in past tense.', difficulty: 'medium', points: 2 },
      { id: 'q9', question: 'True or False: The root letters change in different conjugations.', type: 'true_false', options: ['True', 'False'], correctAnswer: 'False', explanation: 'Root letters stay the same; only prefixes and suffixes change.', difficulty: 'easy', points: 1 },
      { id: 'q10', question: 'What is أنيت?', type: 'short_answer', correctAnswer: 'Memory trick for present tense prefixes: أ (I), ن (we), ي (he/they), ت (she/you)', explanation: 'The letters represent the four prefixes used in present tense conjugation.', difficulty: 'medium', points: 2 }
    ],
    totalPoints: 12,
    estimatedTime: 15
  },
  flashcardContent: {
    title: 'Arabic Verb Conjugation Flashcards | بطاقات تصريف الأفعال',
    cards: [
      { id: 'card1', front: 'What is a جذر (root)?', back: '3 consonant letters that carry the core meaning of Arabic words', category: 'concepts' },
      { id: 'card2', front: 'الفعل الماضي', back: 'Past tense verb (action already happened)', category: 'tenses' },
      { id: 'card3', front: 'الفعل المضارع', back: 'Present tense verb (happening now)', category: 'tenses' },
      { id: 'card4', front: 'فعل الأمر', back: 'Imperative - command verb', category: 'tenses' },
      { id: 'card5', front: 'Past tense ending for هي (she)', back: '-تْ (example: كَتَبَتْ)', category: 'conjugation' },
      { id: 'card6', front: 'Past tense ending for أنا (I)', back: '-تُ (example: كَتَبْتُ)', category: 'conjugation' },
      { id: 'card7', front: 'Past tense ending for نحن (we)', back: '-نا (example: كَتَبْنا)', category: 'conjugation' },
      { id: 'card8', front: 'أنيت means...', back: 'Present tense prefix memory trick: أ=I, ن=We, ي=He/They, ت=She/You', category: 'tips' },
      { id: 'card9', front: 'Present tense prefix for أنا (I)', back: 'أ (example: أَكْتُبُ)', category: 'conjugation' },
      { id: 'card10', front: 'Present tense prefix for نحن (we)', back: 'ن (example: نَكْتُبُ)', category: 'conjugation' },
      { id: 'card11', front: 'Present tense prefix for هو (he)', back: 'ي (example: يَكْتُبُ)', category: 'conjugation' },
      { id: 'card12', front: 'How to form imperative?', back: 'Remove present tense prefix, add أ if needed: تَكْتُبُ → اُكْتُبْ', category: 'tips' },
      { id: 'card13', front: 'Root of كِتاب, مَكْتَبَة, كاتِب?', back: 'ك-ت-ب (writing)', category: 'roots' },
      { id: 'card14', front: 'كَتَبَ means...', back: 'He wrote (past tense)', category: 'vocabulary' },
      { id: 'card15', front: 'يَكْتُبُ means...', back: 'He writes (present tense)', category: 'vocabulary' }
    ]
  }
};

// ============================================
// FINAL EXPORT: All 8 Sample Lessons
// ============================================

export const SAMPLE_TEACHER_CONTENT: SampleTeacherContent[] = [
  SAMPLE_MATH_FRACTIONS_3,
  SAMPLE_MATH_LINEAR_EQ_9,
  SAMPLE_SCIENCE_WATER_CYCLE_4,
  SAMPLE_SCIENCE_CELLS_9,
  SAMPLE_ENGLISH_PARTS_SPEECH_3,
  SAMPLE_ENGLISH_PERSUASIVE_11,
  SAMPLE_SOCIAL_STUDIES_MAPS_2,
  SAMPLE_ARABIC_VERBS_6,
];

// Sample audio update (Geography lesson)
export const SAMPLE_AUDIO_UPDATE: SampleAudioUpdate = {
  id: 'sample_audio_geography_2nd',
  title: 'Week 12: Geography Lesson - 2nd Grade',
  script: `Hello parents! This is your weekly classroom update from Orbit Learn.

This week in our 2nd grade classroom, we've been on an exciting journey exploring the wonderful world of maps and geography!

Your children have been learning how to read and understand different types of maps. We started by exploring what maps are and why people use them. The students were amazed to discover that maps are like bird's-eye views of places - as if they were flying high above and looking down!

We practiced identifying the four cardinal directions - North, South, East, and West. The children loved using the compass rose, and many of them came up with creative ways to remember the directions. One popular phrase was "Never Eat Soggy Waffles" going clockwise from North!

The highlight of the week was our map-making activity where each student created a map of our classroom. They had to include a map key to show what different symbols meant, like desks, the door, and windows. I was so impressed by their attention to detail and creativity.

For next week, we'll be expanding our geography skills by learning about different landforms like mountains, valleys, and rivers. If you get a chance over the weekend, talking about any maps you might see - whether in a mall, at a park, or even on your phone - would be a wonderful way to reinforce what we've learned.

Thank you for your continued support of your child's learning journey. As always, feel free to reach out if you have any questions.

Have a wonderful week!`,
  audioUrl: 'https://pub-5f67b6f04e034f6b98ed3cd44ea0b10a.r2.dev/samples/audio/Week_12_Geography_Lesson_2nd_Grade.mp3',
  duration: 184,
  language: 'en',
  voiceId: 'en-US-Studio-O',
  lessonIds: ['sample_geography_maps_2'],
  status: 'PUBLISHED'
};

// ============================================
// HELPER: Get samples for weekly rotation
// ============================================
export function getWeeklySamples(allSamples: SampleTeacherContent[], count: number = 3): SampleTeacherContent[] {
  const weekOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  const startIndex = (weekOfYear * count) % allSamples.length;

  const result: SampleTeacherContent[] = [];
  for (let i = 0; i < count; i++) {
    result.push(allSamples[(startIndex + i) % allSamples.length]);
  }
  return result;
}

// ============================================
// HELPER: Get sample by ID
// ============================================
export function getSampleById(id: string): SampleTeacherContent | undefined {
  return SAMPLE_TEACHER_CONTENT.find(sample => sample.id === id);
}

// ============================================
// HELPER: Get all sample summaries (for listing)
// ============================================
export function getAllSampleSummaries() {
  return SAMPLE_TEACHER_CONTENT.map(sample => ({
    id: sample.id,
    title: sample.title,
    description: sample.description,
    subject: sample.subject,
    gradeLevel: sample.gradeLevel,
    contentType: sample.contentType,
    estimatedDuration: sample.estimatedDuration,
    tags: sample.tags,
    curriculum: sample.curriculum,
    // Summary stats
    sectionsCount: sample.lessonContent.sections.length,
    quizQuestionsCount: sample.quizContent.questions.length,
    flashcardsCount: sample.flashcardContent.cards.length,
    objectives: sample.lessonContent.objectives,
    vocabulary: sample.lessonContent.vocabulary.map(v => v.term),
  }));
}
