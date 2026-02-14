// Curriculum Configuration for Jeffrey AI Tutor
// Based on educational systems research for K-12 teaching characteristics

import { CurriculumType, AgeGroup } from '@prisma/client';

export interface CurriculumConfig {
  name: string;
  displayName: string;
  philosophy: string;
  teacherRole: string;
  studentRole: string;
  questionStyle: {
    approach: string;
    examples: string[];
  };
  feedbackStyle: {
    approach: string;
    examples: string[];
  };
  mistakeCulture: string;
  keyPhrases: string[];
  conceptualFramework?: string[];
  specialConsiderations?: string;

  // Parent-facing communication preferences
  parentExpectations: {
    primaryConcerns: string[];      // What parents care most about
    preferredMetrics: string[];     // How they want to see progress
    communicationTone: 'professional' | 'formal' | 'friendly' | 'reflective';
    keyTerminology: {
      mastery: string;
      advanced: string;
      struggling: string;
      progress: string;
    };
  };

  // Content generation style
  contentStyle: {
    questionDensity: 'high' | 'medium' | 'low';
    scaffoldingLevel: 'heavy' | 'moderate' | 'light';
    exampleFormat: string;          // "Show your method" vs "Explain your thinking"
    vocabularyLevel: 'formal' | 'conversational' | 'inquiry-based';
  };

  // Assessment and feedback approach
  assessmentStyle: {
    scoreDisplay: 'percentage' | 'stars' | 'descriptive' | 'none';
    encouragementLevel: 'high' | 'moderate' | 'minimal';
    mistakeHandling: string;
  };
}

export interface GradeLevelConfig {
  maxSentenceLength: number;
  vocabularyTier: 'basic' | 'simple_academic' | 'subject_specific' | 'technical';
  instructionStyle: string;
  workingMemoryChunks: number;
  optimalSessionMinutes: number;
}

// Grade level configurations based on developmental research
export const GRADE_LEVEL_CONFIGS: Record<number, GradeLevelConfig> = {
  0: { // Pre-K/Kindergarten
    maxSentenceLength: 8,
    vocabularyTier: 'basic',
    instructionStyle: 'Visual demonstrations with simple verbal support',
    workingMemoryChunks: 2,
    optimalSessionMinutes: 8,
  },
  1: {
    maxSentenceLength: 10,
    vocabularyTier: 'basic',
    instructionStyle: 'Modelled examples with guided practice',
    workingMemoryChunks: 3,
    optimalSessionMinutes: 12,
  },
  2: {
    maxSentenceLength: 12,
    vocabularyTier: 'simple_academic',
    instructionStyle: 'Guided practice with scaffolded support',
    workingMemoryChunks: 4,
    optimalSessionMinutes: 15,
  },
  3: {
    maxSentenceLength: 15,
    vocabularyTier: 'simple_academic',
    instructionStyle: 'Explained concepts with structured practice',
    workingMemoryChunks: 5,
    optimalSessionMinutes: 22,
  },
  4: {
    maxSentenceLength: 15,
    vocabularyTier: 'subject_specific',
    instructionStyle: 'Scaffolded learning with increasing independence',
    workingMemoryChunks: 5,
    optimalSessionMinutes: 27,
  },
  5: {
    maxSentenceLength: 18,
    vocabularyTier: 'subject_specific',
    instructionStyle: 'Discussion-based with guided inquiry',
    workingMemoryChunks: 6,
    optimalSessionMinutes: 35,
  },
  6: {
    maxSentenceLength: 20,
    vocabularyTier: 'technical',
    instructionStyle: 'Discussed concepts with Socratic questioning',
    workingMemoryChunks: 7,
    optimalSessionMinutes: 40,
  },
  7: {
    maxSentenceLength: 22,
    vocabularyTier: 'technical',
    instructionStyle: 'Independent learning with Socratic questioning and critical analysis',
    workingMemoryChunks: 8,
    optimalSessionMinutes: 45,
  },
  8: {
    maxSentenceLength: 25,
    vocabularyTier: 'technical',
    instructionStyle: 'Self-directed learning with analytical discussion and abstract reasoning',
    workingMemoryChunks: 9,
    optimalSessionMinutes: 50,
  },
  9: {
    maxSentenceLength: 28,
    vocabularyTier: 'technical',
    instructionStyle: 'Independent research with critical evaluation, hypothesis testing, and collaborative discourse',
    workingMemoryChunks: 10,
    optimalSessionMinutes: 55,
  },
};

// Curriculum-specific configurations
export const CURRICULUM_CONFIGS: Record<CurriculumType, CurriculumConfig> = {
  IB: {
    name: 'IB',
    displayName: 'IB Primary Years Programme',
    philosophy: 'Inquiry-based, student-driven learning where children construct meaning through experience and social interaction.',
    teacherRole: 'Facilitator and co-learner who guides discovery',
    studentRole: 'Active agent with voice, choice, and ownership of learning',
    questionStyle: {
      approach: 'Open-ended wondering questions that spark curiosity and exploration',
      examples: [
        'I wonder what would happen if...',
        'What do you notice about...?',
        'How might someone else see this?',
        'What connections can you make?',
      ],
    },
    feedbackStyle: {
      approach: 'Process-focused praise that values thinking over correct answers',
      examples: [
        'Tell me how you figured that out!',
        'That\'s an interesting way to think about it.',
        'I love how you made that connection!',
        'What made you choose that approach?',
      ],
    },
    mistakeCulture: 'Mistakes are celebrated as valuable learning opportunities',
    keyPhrases: [
      'Let\'s explore this together',
      'What questions do you have?',
      'How does this connect to what you already know?',
      'What would you like to discover next?',
    ],
    conceptualFramework: [
      'Form - What is it like?',
      'Function - How does it work?',
      'Causation - Why is it this way?',
      'Change - How is it transforming?',
      'Connection - How is it linked to other things?',
      'Perspective - What are different points of view?',
      'Responsibility - What is our role?',
    ],
    specialConsiderations: 'Connect learning to transdisciplinary themes when possible. Support student agency by offering choices.',

    // IB Parent Expectations
    parentExpectations: {
      primaryConcerns: ['inquiry skills', 'learner profile development', 'transdisciplinary understanding', 'international-mindedness'],
      preferredMetrics: ['conceptual understanding levels', 'approaches to learning progress', 'learner profile attribute growth'],
      communicationTone: 'reflective',
      keyTerminology: {
        mastery: 'deep understanding',
        advanced: 'extending understanding',
        struggling: 'emerging understanding',
        progress: 'developing as a learner',
      },
    },

    // IB Content Style
    contentStyle: {
      questionDensity: 'low',
      scaffoldingLevel: 'light',
      exampleFormat: 'What do you wonder about this? What connections can you make?',
      vocabularyLevel: 'inquiry-based',
    },

    // IB Assessment Style
    assessmentStyle: {
      scoreDisplay: 'none',
      encouragementLevel: 'moderate',
      mistakeHandling: 'Mistakes are explored as learning opportunities. "What did you discover from trying that approach?"',
    },
  },

  BRITISH: {
    name: 'BRITISH',
    displayName: 'British National Curriculum',
    philosophy: 'Structured progression with mastery approach - all students learn the same content with challenge through depth.',
    teacherRole: 'Knowledgeable instructor who guides with structure and warmth',
    studentRole: 'Guided learner building strong foundations step by step',
    questionStyle: {
      approach: 'Structured questions that build understanding through concrete-pictorial-abstract progression',
      examples: [
        'Can you show me using the objects?',
        'Now let\'s draw what we see...',
        'How would you write this as a number sentence?',
        'Can you explain why that works?',
      ],
    },
    feedbackStyle: {
      approach: 'Clear, specific feedback that encourages depth over speed',
      examples: [
        'Well done! Can you show me another way?',
        'That\'s correct. Now let\'s go deeper...',
        'Good thinking! What happens if we change this part?',
        'You\'ve mastered this step. Ready for the next challenge?',
      ],
    },
    mistakeCulture: 'Mistakes are identified and gently corrected with supportive guidance',
    keyPhrases: [
      'Let\'s work through this step by step',
      'Can you explain your thinking?',
      'Let\'s check that together',
      'You\'re building strong foundations',
    ],
    specialConsiderations: 'For reading, reference phonics terminology (phonemes, graphemes) when appropriate. For math, follow concrete-pictorial-abstract progression.',

    // British Parent Expectations
    parentExpectations: {
      primaryConcerns: ['SATs preparation', '11+ readiness', 'reading levels', 'phonics progress', 'NC expectations'],
      preferredMetrics: ['working towards/at/greater depth', 'reading band levels', 'phonics screening results'],
      communicationTone: 'professional',
      keyTerminology: {
        mastery: 'mastery',
        advanced: 'greater depth',
        struggling: 'working towards',
        progress: 'meeting expectations',
      },
    },

    // British Content Style
    contentStyle: {
      questionDensity: 'medium',
      scaffoldingLevel: 'heavy',
      exampleFormat: 'Show your method. Explain how you worked this out.',
      vocabularyLevel: 'formal',
    },

    // British Assessment Style
    assessmentStyle: {
      scoreDisplay: 'descriptive',
      encouragementLevel: 'moderate',
      mistakeHandling: 'Gentle correction with clear guidance. "Let\'s check that together. Remember the rule..."',
    },
  },

  AMERICAN: {
    name: 'AMERICAN',
    displayName: 'American Common Core',
    philosophy: 'Standards-based education with growth mindset - emphasizing that abilities develop through effort and learning.',
    teacherRole: 'Coach and facilitator who supports individual growth',
    studentRole: 'Active participant developing skills through practice and perseverance',
    questionStyle: {
      approach: 'Evidence-based questions that encourage reasoning and justification',
      examples: [
        'What in the text tells you that?',
        'How do you know?',
        'Can you prove it?',
        'What evidence supports your thinking?',
      ],
    },
    feedbackStyle: {
      approach: 'Growth mindset praise focusing on effort, strategy, and progress',
      examples: [
        'I notice you tried a different strategy - that\'s great problem-solving!',
        'You don\'t know this YET, but you\'re learning!',
        'Look at how much progress you\'ve made!',
        'Mistakes help our brains grow!',
      ],
    },
    mistakeCulture: 'Mistakes are normalized as essential parts of learning ("not yet" mindset)',
    keyPhrases: [
      'Let\'s figure this out together',
      'You\'re not there yet, but you\'re on your way!',
      'What strategy could you try?',
      'This is challenging - that\'s how you grow!',
    ],
    specialConsiderations: 'Incorporate social-emotional learning by acknowledging feelings and encouraging persistence. Frame collaboration positively.',

    // American Parent Expectations
    parentExpectations: {
      primaryConcerns: ['holistic development', 'Lexile levels', 'enrichment opportunities', 'social-emotional growth', 'college readiness'],
      preferredMetrics: ['standards mastery', 'growth over time', 'effort indicators', 'Lexile/Quantile scores'],
      communicationTone: 'friendly',
      keyTerminology: {
        mastery: 'mastered',
        advanced: 'exceeds expectations',
        struggling: 'developing',
        progress: 'making growth',
      },
    },

    // American Content Style
    contentStyle: {
      questionDensity: 'medium',
      scaffoldingLevel: 'moderate',
      exampleFormat: 'Explain your thinking. How do you know? What strategy did you use?',
      vocabularyLevel: 'conversational',
    },

    // American Assessment Style
    assessmentStyle: {
      scoreDisplay: 'stars',
      encouragementLevel: 'high',
      mistakeHandling: 'Growth mindset framing. "You don\'t know this YET! Let\'s try a different strategy."',
    },
  },

  INDIAN_CBSE: {
    name: 'INDIAN_CBSE',
    displayName: 'Indian CBSE Curriculum',
    philosophy: 'Structured, comprehensive education blending traditional knowledge transmission with modern competency-based learning.',
    teacherRole: 'Respected guide and knowledge expert in the Guru-Shishya tradition',
    studentRole: 'Attentive learner who respects knowledge and works diligently',
    questionStyle: {
      approach: 'Clear, structured questions that build knowledge systematically',
      examples: [
        'What is the definition of...?',
        'Can you list the main points?',
        'Let\'s practice: What is the answer to...?',
        'Can you explain this concept in your own words?',
      ],
    },
    feedbackStyle: {
      approach: 'Clear acknowledgment with encouragement for continued effort',
      examples: [
        'Very good! That\'s the correct answer.',
        'Well done! Now let\'s practice some more.',
        'Let\'s try again. Remember that...',
        'Excellent work! You\'re making good progress.',
      ],
    },
    mistakeCulture: 'Mistakes are corrected promptly with clear guidance on the right approach',
    keyPhrases: [
      'Let me explain this clearly',
      'Here\'s how to solve this',
      'Let\'s practice together',
      'Remember the key points',
    ],
    specialConsiderations: 'Include explicit grammar instruction when relevant. Provide structured practice exercises. Maintain a respectful, encouraging tone.',

    // CBSE Parent Expectations
    parentExpectations: {
      primaryConcerns: ['marks percentage', 'exam technique', 'NCERT coverage', 'competitive edge', 'board exam preparation'],
      preferredMetrics: ['percentage score', 'chapter completion', 'rank improvement', 'questions attempted'],
      communicationTone: 'formal',
      keyTerminology: {
        mastery: 'thorough understanding',
        advanced: 'distinction level',
        struggling: 'needs more practice',
        progress: 'showing improvement',
      },
    },

    // CBSE Content Style
    contentStyle: {
      questionDensity: 'high',
      scaffoldingLevel: 'moderate',
      exampleFormat: 'Solve the following. Show your working. [X marks]',
      vocabularyLevel: 'formal',
    },

    // CBSE Assessment Style
    assessmentStyle: {
      scoreDisplay: 'percentage',
      encouragementLevel: 'moderate',
      mistakeHandling: 'Clear correction with the right method. "That\'s not quite right. The correct approach is..."',
    },
  },

  INDIAN_ICSE: {
    name: 'INDIAN_ICSE',
    displayName: 'Indian ICSE Curriculum',
    philosophy: 'Comprehensive, English-medium education emphasizing depth and breadth across subjects.',
    teacherRole: 'Expert instructor providing thorough, detailed explanations',
    studentRole: 'Dedicated learner engaging deeply with comprehensive content',
    questionStyle: {
      approach: 'Detailed questions that test understanding and application',
      examples: [
        'Explain why this happens...',
        'What are the key characteristics of...?',
        'How does this apply to...?',
        'Describe the process of...',
      ],
    },
    feedbackStyle: {
      approach: 'Detailed feedback acknowledging understanding with guidance for improvement',
      examples: [
        'That\'s correct! Your explanation shows good understanding.',
        'Good attempt! Let me help you refine your answer.',
        'Well done! Now let\'s explore this in more depth.',
        'Excellent! Can you also mention...?',
      ],
    },
    mistakeCulture: 'Mistakes are opportunities for detailed correction and deeper learning',
    keyPhrases: [
      'Let\'s explore this thoroughly',
      'The key concept here is...',
      'To fully understand this, we need to consider...',
      'Let\'s practice with different examples',
    ],
    specialConsiderations: 'Provide comprehensive explanations. Include detailed grammar and language focus. Support analytical thinking.',

    // ICSE Parent Expectations (similar to CBSE with more depth emphasis)
    parentExpectations: {
      primaryConcerns: ['comprehensive understanding', 'exam technique', 'English proficiency', 'analytical skills', 'board exam preparation'],
      preferredMetrics: ['percentage score', 'subject-wise breakdown', 'improvement trend', 'conceptual clarity'],
      communicationTone: 'formal',
      keyTerminology: {
        mastery: 'thorough understanding',
        advanced: 'distinction level',
        struggling: 'needs more practice',
        progress: 'showing improvement',
      },
    },

    // ICSE Content Style
    contentStyle: {
      questionDensity: 'high',
      scaffoldingLevel: 'moderate',
      exampleFormat: 'Answer the following in detail. Explain with examples. [X marks]',
      vocabularyLevel: 'formal',
    },

    // ICSE Assessment Style
    assessmentStyle: {
      scoreDisplay: 'percentage',
      encouragementLevel: 'moderate',
      mistakeHandling: 'Detailed correction with comprehensive explanation. "Let me explain the correct approach in more detail..."',
    },
  },

  ARABIC: {
    name: 'ARABIC',
    displayName: 'Arabic Curriculum',
    philosophy: 'Structured education integrating traditional values with modern learning approaches.',
    teacherRole: 'Respected guide providing clear, structured instruction',
    studentRole: 'Attentive learner engaging with culturally relevant content',
    questionStyle: {
      approach: 'Clear, structured questions with cultural sensitivity',
      examples: [
        'Can you tell me what you learned about...?',
        'What do you remember about...?',
        'Let\'s think about this together...',
        'How would you explain this?',
      ],
    },
    feedbackStyle: {
      approach: 'Warm, encouraging feedback with clear guidance',
      examples: [
        'Excellent work! Well done!',
        'Good thinking! Let\'s continue...',
        'You\'re doing great! Here\'s what comes next...',
        'That\'s right! Keep up the good work!',
      ],
    },
    mistakeCulture: 'Mistakes are gently corrected with supportive encouragement',
    keyPhrases: [
      'Let\'s learn this together',
      'You\'re making wonderful progress',
      'That\'s a great effort',
      'Let me help you with this',
    ],
    // Note: This is a placeholder configuration. The user will provide specific
    // Arabic curriculum characteristics for a more tailored implementation.
    specialConsiderations: 'Placeholder configuration - awaiting specific pedagogical guidance for Arabic curriculum characteristics.',

    // Arabic Parent Expectations
    parentExpectations: {
      primaryConcerns: ['Islamic values integration', 'Arabic language proficiency', 'cultural identity', 'academic excellence'],
      preferredMetrics: ['skill development', 'knowledge retention', 'behavioral progress', 'participation'],
      communicationTone: 'formal',
      keyTerminology: {
        mastery: 'excellent understanding',
        advanced: 'outstanding performance',
        struggling: 'needs additional support',
        progress: 'making good progress',
      },
    },

    // Arabic Content Style
    contentStyle: {
      questionDensity: 'medium',
      scaffoldingLevel: 'moderate',
      exampleFormat: 'Read carefully and answer. Explain your understanding.',
      vocabularyLevel: 'formal',
    },

    // Arabic Assessment Style
    assessmentStyle: {
      scoreDisplay: 'percentage',
      encouragementLevel: 'high',
      mistakeHandling: 'Supportive correction with encouragement. "Good effort! Let\'s review the correct approach together."',
    },
  },
};

/**
 * Get curriculum configuration for a specific curriculum type
 */
export function getCurriculumConfig(curriculumType: CurriculumType): CurriculumConfig {
  return CURRICULUM_CONFIGS[curriculumType];
}

/**
 * Get grade level configuration
 */
export function getGradeLevelConfig(gradeLevel: number): GradeLevelConfig {
  // Clamp grade level to valid range (0-9)
  const clampedGrade = Math.max(0, Math.min(9, gradeLevel));
  return GRADE_LEVEL_CONFIGS[clampedGrade];
}

/**
 * Get combined curriculum and grade level guidance for prompts
 */
export function getCurriculumGuidance(
  curriculumType: CurriculumType | null | undefined,
  ageGroup: AgeGroup,
  gradeLevel: number | null | undefined
): string {
  // Default to American if no curriculum specified
  const curriculum = curriculumType ? CURRICULUM_CONFIGS[curriculumType] : CURRICULUM_CONFIGS.AMERICAN;
  const grade = getGradeLevelConfig(gradeLevel ?? (ageGroup === 'YOUNG' ? 1 : 4));

  const guidance: string[] = [];

  // Add subtle curriculum-specific teaching approach
  guidance.push(`TEACHING APPROACH (${curriculum.displayName}):`);
  guidance.push(`Your role: ${curriculum.teacherRole}`);
  guidance.push('');

  // Question style guidance
  guidance.push('When asking questions:');
  guidance.push(`- ${curriculum.questionStyle.approach}`);
  guidance.push(`- Example phrases: "${curriculum.questionStyle.examples.slice(0, 2).join('", "')}"`);
  guidance.push('');

  // Feedback style guidance
  guidance.push('When giving feedback:');
  guidance.push(`- ${curriculum.feedbackStyle.approach}`);
  guidance.push(`- Example phrases: "${curriculum.feedbackStyle.examples.slice(0, 2).join('", "')}"`);
  guidance.push('');

  // Add conceptual framework for IB
  if (curriculum.conceptualFramework && curriculum.conceptualFramework.length > 0) {
    guidance.push('Conceptual lenses to consider:');
    curriculum.conceptualFramework.slice(0, 3).forEach(concept => {
      guidance.push(`- ${concept}`);
    });
    guidance.push('');
  }

  // Grade-level language calibration
  guidance.push(`LANGUAGE CALIBRATION (Grade ${gradeLevel ?? 'unknown'}):`);
  guidance.push(`- Keep sentences to approximately ${grade.maxSentenceLength} words`);
  guidance.push(`- Use ${grade.vocabularyTier.replace('_', ' ')} vocabulary`);
  guidance.push(`- ${grade.instructionStyle}`);

  return guidance.join('\n');
}

/**
 * Get curriculum-specific teaching approach for AI prompts
 * Used to customize content generation based on pedagogical framework
 */
export function getCurriculumTeachingApproach(curriculumType: CurriculumType | null | undefined): string {
  const config = curriculumType ? CURRICULUM_CONFIGS[curriculumType] : CURRICULUM_CONFIGS.AMERICAN;
  const approach: string[] = [];

  approach.push(`PEDAGOGICAL FRAMEWORK: ${config.displayName}`);
  approach.push(`Core Philosophy: ${config.philosophy}`);
  approach.push('');

  // Content Style
  approach.push('CONTENT PRESENTATION:');
  approach.push(`- Question density: ${config.contentStyle.questionDensity} (${
    config.contentStyle.questionDensity === 'high' ? 'many practice problems throughout' :
    config.contentStyle.questionDensity === 'low' ? 'fewer questions, more open exploration' :
    'balanced mix of content and practice'
  })`);
  approach.push(`- Scaffolding: ${config.contentStyle.scaffoldingLevel} (${
    config.contentStyle.scaffoldingLevel === 'heavy' ? 'step-by-step guidance with concrete examples first' :
    config.contentStyle.scaffoldingLevel === 'light' ? 'minimal guidance, encourage independent discovery' :
    'balanced support with opportunities for independence'
  })`);
  approach.push(`- Example format: "${config.contentStyle.exampleFormat}"`);
  approach.push(`- Vocabulary: ${config.contentStyle.vocabularyLevel}`);
  approach.push('');

  // Assessment Style
  approach.push('ASSESSMENT APPROACH:');
  approach.push(`- Score display: ${config.assessmentStyle.scoreDisplay} (${
    config.assessmentStyle.scoreDisplay === 'percentage' ? 'show scores as X%' :
    config.assessmentStyle.scoreDisplay === 'stars' ? 'show ratings as 1-5 stars' :
    config.assessmentStyle.scoreDisplay === 'descriptive' ? 'use descriptive levels like "At expected level"' :
    'no numerical scores, focus on learning process'
  })`);
  approach.push(`- Encouragement: ${config.assessmentStyle.encouragementLevel}`);
  approach.push(`- Mistake handling: ${config.assessmentStyle.mistakeHandling}`);
  approach.push('');

  // Terminology for progress reporting
  approach.push('PROGRESS TERMINOLOGY:');
  approach.push(`- For mastery: use "${config.parentExpectations.keyTerminology.mastery}"`);
  approach.push(`- For advanced: use "${config.parentExpectations.keyTerminology.advanced}"`);
  approach.push(`- For struggling: use "${config.parentExpectations.keyTerminology.struggling}"`);
  approach.push(`- For progress: use "${config.parentExpectations.keyTerminology.progress}"`);

  return approach.join('\n');
}

/**
 * Get curriculum-specific flashcard generation guidance
 * Enhanced with deeper differentiation for each curriculum type
 */
export function getFlashcardCurriculumGuidance(curriculumType: CurriculumType | null | undefined): string {
  const config = curriculumType ? CURRICULUM_CONFIGS[curriculumType] : CURRICULUM_CONFIGS.AMERICAN;

  switch (curriculumType) {
    case 'IB':
      return `
FLASHCARD STYLE: Inquiry-Based (IB PYP)

Question Design:
- Frame as wondering prompts: "What do you wonder about...?", "What might happen if...?"
- Include open-ended thinking prompts: "How might X connect to Y?"
- Use conceptual lenses: Form, Function, Causation, Connection, Perspective
- Multiple valid approaches should be celebrated

Answer Design:
- No single "right" answer focus - emphasize thinking process
- Include "possible responses" rather than definitive answers
- Encourage reflection: "What else could be true?"

Hints:
- Guide discovery: "What do you already know about...?"
- Connect to prior knowledge: "Think about when you..."
- Never give away the answer directly

Vocabulary: ${config.contentStyle.vocabularyLevel}
Scaffolding: ${config.contentStyle.scaffoldingLevel}`;

    case 'BRITISH':
      return `
FLASHCARD STYLE: Mastery-Based (British National Curriculum)

Question Design:
- Build concrete → pictorial → abstract progression
- "Show your method" prompts: "Can you show me using objects/drawings?"
- Include "Prove it" or "Explain why" challenges
- Focus on depth over breadth

Answer Design:
- Clear, precise definitions
- Include method alongside answer where applicable
- Use descriptive language: "Working towards", "At expected", "Greater depth"

Hints:
- Step-by-step scaffolding: "First, think about..."
- Connect to manipulatives: "Imagine using counters..."
- Reference visual models when helpful

Vocabulary: ${config.contentStyle.vocabularyLevel}
Scaffolding: ${config.contentStyle.scaffoldingLevel}
Example format: ${config.contentStyle.exampleFormat}`;

    case 'AMERICAN':
      return `
FLASHCARD STYLE: Growth Mindset (American Common Core)

Question Design:
- Evidence-based prompts: "What evidence shows...?", "How do you know?"
- Include "Explain your thinking" questions
- Frame as challenges: "Here's a tricky one to stretch your thinking!"
- Use star ratings (1-5) for difficulty, not percentages

Answer Design:
- Show growth over time: "You've got this!"
- "Not yet" framing for missed concepts
- Celebrate strategies, not just correct answers

Hints:
- Strategy suggestions: "What strategy could you try?"
- Growth mindset language: "This is challenging - that's how you grow!"
- Connect to real-world evidence

Vocabulary: ${config.contentStyle.vocabularyLevel}
Scaffolding: ${config.contentStyle.scaffoldingLevel}
Example format: ${config.contentStyle.exampleFormat}`;

    case 'INDIAN_CBSE':
      return `
FLASHCARD STYLE: Comprehensive Practice (CBSE)

Question Design:
- High volume practice questions with marks shown: "Q1. [2 marks]"
- Include definition, application, and analysis questions
- Multiple difficulty tiers per topic
- Format: "Define...", "Solve...", "Explain..."

Answer Design:
- Clear, complete answers showing correct method
- Show percentage scores: "Score: 8/10"
- Include NCERT-aligned terminology

Hints:
- Reference formulas and rules: "Remember the rule..."
- Point to specific concepts: "Recall the definition of..."
- Encourage practice: "Let's try another similar one"

Vocabulary: ${config.contentStyle.vocabularyLevel}
Scaffolding: ${config.contentStyle.scaffoldingLevel}
Example format: ${config.contentStyle.exampleFormat}`;

    case 'INDIAN_ICSE':
      return `
FLASHCARD STYLE: Comprehensive Depth (ICSE)

Question Design:
- Detailed questions testing understanding and application
- "Explain in detail...", "Describe the process of..."
- Include marks allocation: "[X marks]"
- Progressive complexity within topics

Answer Design:
- Comprehensive explanations with examples
- Show percentage scores
- Include subject-specific terminology

Hints:
- Guide analytical thinking: "Consider the factors..."
- Reference comprehensive explanations
- Encourage depth: "Let's explore further..."

Vocabulary: ${config.contentStyle.vocabularyLevel}
Scaffolding: ${config.contentStyle.scaffoldingLevel}
Example format: ${config.contentStyle.exampleFormat}`;

    default:
      return `
FLASHCARD STYLE: Balanced Approach

Question Design:
- Mix factual recall with thinking questions
- Include clear, engaging prompts
- Vary difficulty levels

Answer Design:
- Clear, age-appropriate answers
- Include helpful explanations
- Keep tone encouraging

Hints:
- Provide helpful guidance
- Connect to familiar concepts
- Never give away answers directly

Vocabulary: ${config.contentStyle.vocabularyLevel}
Scaffolding: ${config.contentStyle.scaffoldingLevel}`;
  }
}

/**
 * Get curriculum-specific quiz generation guidance
 * Enhanced with deeper differentiation for each curriculum type
 */
export function getQuizCurriculumGuidance(curriculumType: CurriculumType | null | undefined): string {
  const config = curriculumType ? CURRICULUM_CONFIGS[curriculumType] : CURRICULUM_CONFIGS.AMERICAN;

  switch (curriculumType) {
    case 'IB':
      return `
QUIZ STYLE: Inquiry-Focused Assessment (IB PYP)

Question Design:
- "What do you wonder?" inquiry prompts
- Open-ended questions: "Why might...", "How could..."
- Multiple valid approaches are acceptable
- Focus on thinking process, not just correct answers
- Include reflection prompts: "What connections can you make?"

Score Display: NONE - Do not show numerical scores
- Focus on learning process, not grades
- Use qualitative feedback only

Feedback Style:
- Celebrate exploration: "What an interesting way to think about this!"
- Encourage further inquiry: "What else could you explore?"
- Value the process: "Tell me more about how you figured that out"
- For incorrect: "That's one possibility. What other ideas do you have?"

Example Question Format:
"What do you notice about the pattern? What might happen next? Explain your thinking."

Mistake Handling: ${config.assessmentStyle.mistakeHandling}`;

    case 'BRITISH':
      return `
QUIZ STYLE: Mastery-Based Assessment (British National Curriculum)

Question Design:
- "Show your method" questions requiring working
- Concrete → Pictorial → Abstract progression
- Progress from recall to application to reasoning
- Include "Prove it" or "Explain why" extensions
- Focus on depth: "Can you explain why that works?"

Score Display: DESCRIPTIVE
- Use "Working towards", "At expected level", "Greater depth"
- Do NOT show percentages
- Describe achievement against expectations

Feedback Style:
- Specific and developmental: "Well done! Can you show another way?"
- Reference mastery: "You've mastered this step. Ready for deeper challenge?"
- For incorrect: "Let's check that together. Remember the rule..."

Example Question Format:
"Calculate 3/4 + 1/8. Show your working and explain how you found a common denominator."

Mistake Handling: ${config.assessmentStyle.mistakeHandling}`;

    case 'AMERICAN':
      return `
QUIZ STYLE: Standards-Aligned with Growth Mindset (Common Core)

Question Design:
- Evidence-based: "Which part of the text shows...", "What evidence supports..."
- "Explain your thinking" prompts
- Strategy-focused: "What strategy did you use?"
- Frame as growth opportunities, not tests

Score Display: STARS (1-5 scale)
- Show star ratings, NOT percentages
- Emphasize growth and effort
- "You earned 4 stars! Great progress!"

Feedback Style:
- Growth mindset: "You don't know this YET, but you're learning!"
- Celebrate effort: "I notice you tried a different strategy!"
- For incorrect: "Not quite yet! Here's a hint to try again..."
- Encourage persistence: "This is challenging - that's how you grow!"

Example Question Format:
"Maria has 3/4 of a pizza. She gives 1/8 to her friend. Explain your thinking: How much pizza does Maria have left?"

Mistake Handling: ${config.assessmentStyle.mistakeHandling}`;

    case 'INDIAN_CBSE':
      return `
QUIZ STYLE: Comprehensive Knowledge Assessment (CBSE)

Question Design:
- High volume practice with marks shown: "Q1. Simplify: 3/4 + 1/8 [2 marks]"
- Include definition, application, and analysis questions
- Multiple difficulty tiers within each topic
- Format: "Define...", "Solve...", "Explain...", "Calculate..."
- NCERT-aligned terminology and methods

Score Display: PERCENTAGE
- Show exact percentage: "Score: 85%"
- Include questions attempted: "45 questions completed"
- Show improvement trend where applicable

Feedback Style:
- Clear acknowledgment: "Very good! That's the correct answer."
- Reinforce learning: "Remember this method for your exams."
- For incorrect: "That's not quite right. The correct approach is..."
- Encourage practice: "Let's try more problems like this."

Example Question Format:
"Q1. Simplify: 3/4 + 1/8 [2 marks]
Show your working."

Mistake Handling: ${config.assessmentStyle.mistakeHandling}`;

    case 'INDIAN_ICSE':
      return `
QUIZ STYLE: Comprehensive Depth Assessment (ICSE)

Question Design:
- Detailed questions testing understanding: "Explain why...", "Describe..."
- Application-focused: "How does this apply to..."
- Include marks allocation: "[X marks]"
- Comprehensive coverage of concepts

Score Display: PERCENTAGE
- Show percentage with detailed breakdown
- Subject-wise performance tracking
- Improvement trend indication

Feedback Style:
- Acknowledge depth: "Your explanation shows good understanding."
- Guide improvement: "Let me help you refine your answer."
- For incorrect: "Let me explain the correct approach in more detail..."
- Encourage thoroughness: "Can you also mention...?"

Example Question Format:
"Explain in detail how fractions are added when the denominators are different. [4 marks]"

Mistake Handling: ${config.assessmentStyle.mistakeHandling}`;

    default:
      return `
QUIZ STYLE: Balanced Assessment

Question Design:
- Mix question types for varied practice
- Include clear, engaging prompts
- Vary difficulty levels appropriately

Score Display: ${config.assessmentStyle.scoreDisplay}

Feedback Style:
- Provide encouraging feedback
- Include helpful explanations
- Guide learning constructively

Mistake Handling: ${config.assessmentStyle.mistakeHandling}`;
  }
}
