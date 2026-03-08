// Agent Tool Definitions — Claude tool schemas for the agentic loop
// These define what Claude can call; execution is in agentToolExecutor.ts
import type Anthropic from '@anthropic-ai/sdk';

export const AGENT_TOOLS: Anthropic.Messages.Tool[] = [
  // ============================================
  // READ TOOLS (10)
  // ============================================
  {
    name: 'get_teacher_profile',
    description:
      'Get the teacher\'s identity: name, school, grades taught, subjects, curriculum, teaching philosophy, preferred tone, and planning autonomy level. Call this early to personalize your responses.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_classrooms',
    description:
      'Get all classrooms with student groups, grade levels, subject, and student counts. Call before generating differentiated content to tailor it to specific groups.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_curriculum_state',
    description:
      'Get curriculum state for a specific subject: standards taught, standards assessed, pacing guide, identified gaps, and current topic. Use to give data-informed teaching advice.',
    input_schema: {
      type: 'object' as const,
      properties: {
        subject: {
          type: 'string',
          description: 'The subject to get curriculum state for (e.g., "MATH", "ENGLISH", "SCIENCE")',
        },
      },
      required: ['subject'],
    },
  },
  {
    name: 'get_all_curriculum_states',
    description:
      'Get an overview of curriculum states for all subjects. Use for cross-subject planning or when the teacher asks about overall progress.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_style_preferences',
    description:
      'Get the teacher\'s learned style preferences (7 dimensions: lesson length, detail level, vocabulary, scaffolding, formality, question count, structure). Optionally filter by content type. ALWAYS call before generating content.',
    input_schema: {
      type: 'object' as const,
      properties: {
        contentType: {
          type: 'string',
          description: 'Optional content type to get type-specific preferences (e.g., "lesson", "quiz", "flashcards")',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_recent_interactions',
    description:
      'Get the last N interactions with the teacher, including feedback status (approved, edited, regenerated). Use to understand recent activity and teaching patterns.',
    input_schema: {
      type: 'object' as const,
      properties: {
        limit: {
          type: 'number',
          description: 'Number of recent interactions to retrieve (default: 10, max: 25)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_standards_overview',
    description:
      'Get KPI overview of standards coverage: overall coverage percentage, gaps count, and per-subject summaries. Use when teacher asks about progress or readiness.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_standards_coverage',
    description:
      'Get detailed per-standard coverage report for a specific subject. Shows which standards are taught, assessed, or gaps.',
    input_schema: {
      type: 'object' as const,
      properties: {
        subject: {
          type: 'string',
          description: 'The subject to get standards coverage for',
        },
      },
      required: ['subject'],
    },
  },

  // ============================================
  // WRITE TOOLS — CONTENT GENERATION (8)
  // ============================================
  {
    name: 'generate_lesson',
    description:
      'Generate a complete lesson plan. Before calling, check style preferences and classrooms. If topic, subject, or grade level are not provided by the teacher, ask them naturally before calling this tool.',
    input_schema: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          description: 'The lesson topic (required)',
        },
        subject: {
          type: 'string',
          description: 'Subject area (e.g., "MATH", "ENGLISH", "SCIENCE")',
        },
        gradeLevel: {
          type: 'string',
          description: 'Grade level (e.g., "3rd Grade", "K", "5th Grade")',
        },
        lessonType: {
          type: 'string',
          enum: ['guide', 'full'],
          description: 'Lesson type: "guide" for teaching guide, "full" for full lesson plan (default: "guide")',
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'generate_quiz',
    description:
      'Generate a quiz or worksheet with questions. Ask for topic if not provided.',
    input_schema: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          description: 'The quiz topic (required)',
        },
        subject: {
          type: 'string',
          description: 'Subject area',
        },
        gradeLevel: {
          type: 'string',
          description: 'Grade level',
        },
        questionCount: {
          type: 'number',
          description: 'Number of questions (default: 10)',
        },
        difficulty: {
          type: 'string',
          enum: ['easy', 'medium', 'hard', 'mixed'],
          description: 'Difficulty level (default: "mixed")',
        },
        isWorksheet: {
          type: 'boolean',
          description: 'If true, generate as a worksheet instead of quiz',
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'generate_flashcards',
    description:
      'Generate a set of flashcards for study/review. Ask for topic if not provided.',
    input_schema: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          description: 'The flashcard topic (required)',
        },
        subject: {
          type: 'string',
          description: 'Subject area',
        },
        gradeLevel: {
          type: 'string',
          description: 'Grade level',
        },
        cardCount: {
          type: 'number',
          description: 'Number of cards (default: 20)',
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'generate_sub_plan',
    description:
      'Generate a substitute teacher plan with schedules, procedures, and lesson details. Subject and grade level are needed.',
    input_schema: {
      type: 'object' as const,
      properties: {
        subject: {
          type: 'string',
          description: 'Subject area (required)',
        },
        gradeLevel: {
          type: 'string',
          description: 'Grade level (required)',
        },
        date: {
          type: 'string',
          description: 'Date for the sub plan (YYYY-MM-DD format)',
        },
        title: {
          type: 'string',
          description: 'Optional title for the plan',
        },
        additionalNotes: {
          type: 'string',
          description: 'Additional context or notes about what to cover',
        },
      },
      required: ['subject', 'gradeLevel'],
    },
  },
  {
    name: 'generate_iep_goals',
    description:
      'Generate IEP goals in SMART format (IDEA-compliant). Requires grade level, disability category, and subject area.',
    input_schema: {
      type: 'object' as const,
      properties: {
        gradeLevel: {
          type: 'string',
          description: 'Grade level (required)',
        },
        disabilityCategory: {
          type: 'string',
          description: 'Disability category (e.g., "SPECIFIC_LEARNING_DISABILITY", "AUTISM", "SPEECH_LANGUAGE_IMPAIRMENT")',
        },
        subjectArea: {
          type: 'string',
          description: 'Subject area for goals (e.g., "READING_COMPREHENSION", "MATH_COMPUTATION", "WRITTEN_EXPRESSION")',
        },
        presentLevels: {
          type: 'string',
          description: 'Description of student\'s current performance levels',
        },
        studentName: {
          type: 'string',
          description: 'Optional student name or identifier',
        },
        additionalContext: {
          type: 'string',
          description: 'Additional context about the student',
        },
      },
      required: ['gradeLevel'],
    },
  },
  {
    name: 'generate_parent_email',
    description:
      'Draft a parent email (newsletter, announcement, update, etc.).',
    input_schema: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          description: 'Email topic or subject (required)',
        },
        tone: {
          type: 'string',
          enum: ['update', 'celebration', 'concern', 'event', 'newsletter'],
          description: 'Email tone/type (default: "update")',
        },
        subject: {
          type: 'string',
          description: 'Related subject area',
        },
        gradeLevel: {
          type: 'string',
          description: 'Grade level',
        },
        additionalContext: {
          type: 'string',
          description: 'Additional details to include',
        },
        length: {
          type: 'string',
          enum: ['short', 'medium', 'long'],
          description: 'Email length (default: "medium")',
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'generate_report_comments',
    description:
      'Generate report card comments for students.',
    input_schema: {
      type: 'object' as const,
      properties: {
        subject: {
          type: 'string',
          description: 'Subject area for the comments',
        },
        gradeLevel: {
          type: 'string',
          description: 'Grade level',
        },
        performanceLevel: {
          type: 'string',
          enum: ['exceeding', 'meeting', 'approaching', 'below'],
          description: 'Student performance level (default: "meeting")',
        },
        commentCount: {
          type: 'number',
          description: 'Number of comments to generate (default: 5)',
        },
      },
      required: [],
    },
  },
  // ============================================
  // WRITE TOOLS — STATE & NAVIGATION (3)
  // ============================================
  {
    name: 'update_curriculum_progress',
    description:
      'Mark standards as taught or assessed, or update the current topic. Use when the teacher reports progress.',
    input_schema: {
      type: 'object' as const,
      properties: {
        subject: {
          type: 'string',
          description: 'Subject to update (required)',
        },
        standardsTaught: {
          type: 'array',
          items: { type: 'string' },
          description: 'Standard IDs to mark as taught',
        },
        standardsAssessed: {
          type: 'array',
          items: { type: 'string' },
          description: 'Standard IDs to mark as assessed',
        },
        currentTopic: {
          type: 'string',
          description: 'Current topic being taught',
        },
      },
      required: ['subject'],
    },
  },
  {
    name: 'navigate_to_page',
    description:
      'Navigate the teacher to a specific portal page. Use when they ask to go somewhere specific.',
    input_schema: {
      type: 'object' as const,
      properties: {
        page: {
          type: 'string',
          enum: [
            'lessons', 'quiz', 'flashcards', 'sub-plans', 'iep-goals',
            'audio-updates', 'communications', 'games', 'standards',
            'reviews', 'settings', 'billing', 'content', 'store',
          ],
          description: 'The page to navigate to',
        },
      },
      required: ['page'],
    },
  },
  {
    name: 'record_feedback',
    description:
      'Record teacher feedback (approve, edit, or regenerate) on generated content. This feeds the style learning system.',
    input_schema: {
      type: 'object' as const,
      properties: {
        interactionId: {
          type: 'string',
          description: 'The interaction ID from the content generation',
        },
        feedbackType: {
          type: 'string',
          enum: ['approve', 'edit', 'regenerate'],
          description: 'Type of feedback',
        },
      },
      required: ['interactionId', 'feedbackType'],
    },
  },

  // ============================================
  // ANALYSIS TOOLS (3)
  // ============================================
  {
    name: 'suggest_gap_actions',
    description:
      'Get AI-generated suggestions for addressing standards gaps in a subject. Call after identifying gaps via get_standards_coverage.',
    input_schema: {
      type: 'object' as const,
      properties: {
        subject: {
          type: 'string',
          description: 'Subject with gaps to address (required)',
        },
        gapStandardIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific standard IDs to get suggestions for',
        },
      },
      required: ['subject'],
    },
  },
  {
    name: 'get_proactive_suggestions',
    description:
      'Get context-aware proactive suggestions: onboarding nudges, standards gaps, pacing alerts, content ideas, style insights. Use to give the teacher helpful suggestions.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_differentiation_advice',
    description:
      'Given a topic and optionally a classroom, suggest differentiation strategies for different student groups (above grade, on level, below grade, ELL).',
    input_schema: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          description: 'The topic to get differentiation advice for (required)',
        },
        classroomId: {
          type: 'string',
          description: 'Optional classroom ID to tailor advice to specific student groups',
        },
      },
      required: ['topic'],
    },
  },
];
