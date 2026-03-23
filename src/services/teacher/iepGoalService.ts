// IEP Goal Writer Service - AI-generated SMART goals and accommodations
// Creates legally-compliant IEP goals based on present levels of performance
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { prisma } from '../../config/database.js';
import { TokenOperation, IEPGoalSession, DisabilityCategory, IEPSubjectArea, Prisma } from '@prisma/client';
import { quotaService } from './quotaService.js';
import { logger } from '../../utils/logger.js';
import { generateAndParseJson, truncatePromptText } from '../../utils/modelJson.js';

// ============================================
// TYPES
// ============================================

export interface SMARTGoal {
  id: string;
  goalStatement: string;           // Full SMART goal statement
  baseline: string;                // Current performance level
  target: string;                  // Target performance level
  measurementMethod: string;       // How progress will be measured
  frequency: string;               // How often measurement occurs
  accuracyCriteria: string;        // e.g., "80% accuracy"
  trials: string;                  // e.g., "3 consecutive sessions"
  timeframe: string;               // e.g., "By the end of the IEP period"
  shortTermObjectives?: string[];  // Optional benchmarks
}

export interface AccommodationCategory {
  category: 'presentation' | 'response' | 'setting' | 'timing';
  title: string;
  accommodations: Array<{
    accommodation: string;
    rationale: string;
    implementationTips?: string;
  }>;
}

export interface ProgressMonitoringPlan {
  tool: string;                    // Assessment tool to use
  frequency: string;               // How often to monitor
  dataCollection: string;          // How to collect data
  decisionRules: string;           // When to adjust instruction
}

export interface GenerateIEPGoalsInput {
  gradeLevel: string;
  disabilityCategory: DisabilityCategory;
  subjectArea: IEPSubjectArea;
  presentLevels: string;           // Current performance description
  strengths?: string;              // Student strengths
  challenges?: string;             // Areas of difficulty
  previousGoals?: string;          // Previous IEP goals (for continuity)
  additionalContext?: string;      // Extra info from teacher
}

export interface GeneratedIEPContent {
  goals: SMARTGoal[];
  accommodations: AccommodationCategory[];
  progressMonitoring: ProgressMonitoringPlan[];
  tokensUsed: number;
}

const IEP_PRESENT_LEVELS_MAX_CHARS = 12000;
const IEP_ADDITIONAL_CONTEXT_MAX_CHARS = 3000;

export interface CreateIEPSessionInput extends GenerateIEPGoalsInput {
  studentIdentifier?: string;      // Optional reference (e.g., "Student A")
  goalStartDate?: Date;
  goalEndDate?: Date;
}

export interface UpdateIEPSessionInput {
  studentIdentifier?: string;
  gradeLevel?: string;
  presentLevels?: string;
  strengths?: string;
  challenges?: string;
  selectedGoals?: unknown;
  selectedAccommodations?: unknown;
  goalStartDate?: Date;
  goalEndDate?: Date;
}

// Human-readable labels for enums (IDEA 13 disability categories)
export const DISABILITY_LABELS: Record<DisabilityCategory, string> = {
  SPECIFIC_LEARNING_DISABILITY: 'Specific Learning Disability (SLD)',
  SPEECH_LANGUAGE_IMPAIRMENT: 'Speech or Language Impairment',
  OTHER_HEALTH_IMPAIRMENT: 'Other Health Impairment (OHI/ADHD)',
  AUTISM_SPECTRUM: 'Autism Spectrum Disorder',
  EMOTIONAL_DISTURBANCE: 'Emotional Disturbance',
  INTELLECTUAL_DISABILITY: 'Intellectual Disability',
  DEVELOPMENTAL_DELAY: 'Developmental Delay (ages 3-9)',
  MULTIPLE_DISABILITIES: 'Multiple Disabilities',
  HEARING_IMPAIRMENT: 'Hearing Impairment (including Deafness)',
  VISUAL_IMPAIRMENT: 'Visual Impairment (including Blindness)',
  ORTHOPEDIC_IMPAIRMENT: 'Orthopedic Impairment',
  TRAUMATIC_BRAIN_INJURY: 'Traumatic Brain Injury',
  DEAF_BLINDNESS: 'Deaf-Blindness',
};

export const SUBJECT_AREA_LABELS: Record<IEPSubjectArea, string> = {
  READING_FLUENCY: 'Reading Fluency',
  READING_COMPREHENSION: 'Reading Comprehension',
  WRITTEN_EXPRESSION: 'Written Expression',
  MATH_CALCULATION: 'Math Calculation',
  MATH_PROBLEM_SOLVING: 'Math Problem Solving',
  SPEECH_ARTICULATION: 'Speech Articulation',
  EXPRESSIVE_LANGUAGE: 'Expressive Language',
  RECEPTIVE_LANGUAGE: 'Receptive Language',
  SOCIAL_SKILLS: 'Social Skills',
  BEHAVIOR_SELF_REGULATION: 'Behavior/Self-Regulation',
  EXECUTIVE_FUNCTIONING: 'Executive Functioning',
  FINE_MOTOR: 'Fine Motor Skills',
  GROSS_MOTOR: 'Gross Motor Skills',
  ADAPTIVE_LIVING_SKILLS: 'Adaptive/Daily Living Skills',
  TRANSITION_VOCATIONAL: 'Transition/Vocational Skills',
};

const VALID_DISABILITY_CATEGORIES = new Set(Object.values(DisabilityCategory));
const VALID_SUBJECT_AREAS = new Set(Object.values(IEPSubjectArea));

const DISABILITY_CATEGORY_ALIASES: Record<string, DisabilityCategory> = {
  AUTISM: DisabilityCategory.AUTISM_SPECTRUM,
  ASD: DisabilityCategory.AUTISM_SPECTRUM,
  ADHD: DisabilityCategory.OTHER_HEALTH_IMPAIRMENT,
  OHI: DisabilityCategory.OTHER_HEALTH_IMPAIRMENT,
  SLD: DisabilityCategory.SPECIFIC_LEARNING_DISABILITY,
  SPEECH: DisabilityCategory.SPEECH_LANGUAGE_IMPAIRMENT,
};

const SUBJECT_AREA_ALIASES: Record<string, IEPSubjectArea> = {
  READING: IEPSubjectArea.READING_COMPREHENSION,
  FLUENCY: IEPSubjectArea.READING_FLUENCY,
  COMPREHENSION: IEPSubjectArea.READING_COMPREHENSION,
  WRITING: IEPSubjectArea.WRITTEN_EXPRESSION,
  MATH: IEPSubjectArea.MATH_CALCULATION,
  MATH_COMPUTATION: IEPSubjectArea.MATH_CALCULATION,
  COMPUTATION: IEPSubjectArea.MATH_CALCULATION,
  BEHAVIOR: IEPSubjectArea.BEHAVIOR_SELF_REGULATION,
  SELF_REGULATION: IEPSubjectArea.BEHAVIOR_SELF_REGULATION,
  SOCIAL_EMOTIONAL: IEPSubjectArea.BEHAVIOR_SELF_REGULATION,
  SOCIAL_EMOTIONAL_LEARNING: IEPSubjectArea.BEHAVIOR_SELF_REGULATION,
  EXECUTIVE_SKILLS: IEPSubjectArea.EXECUTIVE_FUNCTIONING,
};

const SUBJECT_AREA_PATTERNS: Array<{ value: IEPSubjectArea; patterns: RegExp[] }> = [
  {
    value: IEPSubjectArea.READING_FLUENCY,
    patterns: [
      /\breading fluency\b/i,
      /\bfluency\b/i,
      /\bwpm\b/i,
      /\bwords per minute\b/i,
      /\bdecode(?:s|d|ing)?\b/i,
      /\bdecoding\b/i,
      /\bmultisyllabic\b/i,
      /\bphonics\b/i,
    ],
  },
  {
    value: IEPSubjectArea.READING_COMPREHENSION,
    patterns: [
      /\breading comprehension\b/i,
      /\bcomprehension\b/i,
      /\bmain idea\b/i,
      /\binference\b/i,
      /\bretell\b/i,
    ],
  },
  {
    value: IEPSubjectArea.WRITTEN_EXPRESSION,
    patterns: [/\bwritten expression\b/i, /\bwriting\b/i, /\bparagraph\b/i, /\bessay\b/i],
  },
  {
    value: IEPSubjectArea.MATH_CALCULATION,
    patterns: [/\bmath calculation\b/i, /\bcalculation\b/i, /\bcomputation\b/i, /\barithmetic\b/i],
  },
  {
    value: IEPSubjectArea.MATH_PROBLEM_SOLVING,
    patterns: [/\bmath problem solving\b/i, /\bword problem\b/i, /\bproblem solving\b/i],
  },
  {
    value: IEPSubjectArea.SPEECH_ARTICULATION,
    patterns: [/\barticulation\b/i, /\bspeech sound\b/i],
  },
  {
    value: IEPSubjectArea.EXPRESSIVE_LANGUAGE,
    patterns: [/\bexpressive language\b/i],
  },
  {
    value: IEPSubjectArea.RECEPTIVE_LANGUAGE,
    patterns: [/\breceptive language\b/i],
  },
  {
    value: IEPSubjectArea.SOCIAL_SKILLS,
    patterns: [/\bsocial skills?\b/i, /\bsocial interaction\b/i, /\bpeer interaction\b/i],
  },
  {
    value: IEPSubjectArea.BEHAVIOR_SELF_REGULATION,
    patterns: [
      /\bbehavior\b/i,
      /\bbehaviour\b/i,
      /\bself[\s/-]?regulation\b/i,
      /\bcoping\b/i,
      /\bon[-\s]?task\b/i,
      /\brequesting a break\b/i,
      /\bfrustrat(?:ed|ing|ion)\b/i,
    ],
  },
  {
    value: IEPSubjectArea.EXECUTIVE_FUNCTIONING,
    patterns: [/\bexecutive functioning\b/i, /\borganization\b/i, /\battention\b/i, /\bfocus\b/i],
  },
  {
    value: IEPSubjectArea.FINE_MOTOR,
    patterns: [/\bfine motor\b/i],
  },
  {
    value: IEPSubjectArea.GROSS_MOTOR,
    patterns: [/\bgross motor\b/i],
  },
  {
    value: IEPSubjectArea.ADAPTIVE_LIVING_SKILLS,
    patterns: [/\badaptive\b/i, /\bdaily living\b/i],
  },
  {
    value: IEPSubjectArea.TRANSITION_VOCATIONAL,
    patterns: [/\btransition\b/i, /\bvocational\b/i],
  },
];

// ============================================
// SERVICE
// ============================================

export const iepGoalService = {
  /**
   * Generate SMART IEP goals and accommodations
   * Uses Gemini 3 Flash for legally-compliant goal generation
   */
  async generateIEPGoals(
    teacherId: string,
    input: GenerateIEPGoalsInput
  ): Promise<GeneratedIEPContent> {
    const normalizedInput = normalizeIEPGoalInput(input);

    // Check quota
    const estimatedTokens = 5000; // ~50 credits per IEP session
    await quotaService.enforceQuota(teacherId, TokenOperation.IEP_GOAL_GENERATION, estimatedTokens);

    logger.info('Generating IEP goals', {
      teacherId,
      disabilityCategory: normalizedInput.disabilityCategory,
      subjectArea: normalizedInput.subjectArea,
    });

    const prompt = buildIEPGoalPrompt(normalizedInput);
    const parsedResult = await generateAndParseJson({
      contextLabel: 'IEP goals',
      prompts: [
        prompt,
        `${prompt}\n\nIMPORTANT: Return a single valid JSON object only. Keep each rationale concise and avoid unnecessary repetition.`,
      ],
      estimatedTokens,
      invoke: async (attemptPrompt) => {
        const model = genAI.getGenerativeModel({
          model: config.gemini.models.flash,
          safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: getIEPMaxOutputTokens(normalizedInput),
            responseMimeType: 'application/json',
          },
        });
        return model.generateContent(attemptPrompt);
      },
      normalize: normalizeIEPContent,
    });

    await quotaService.recordUsage({
      teacherId,
      operation: TokenOperation.IEP_GOAL_GENERATION,
      tokensUsed: parsedResult.tokensUsed,
      modelUsed: config.gemini.models.flash,
      resourceType: 'iep_goals',
    });

    return {
      ...parsedResult.data,
      tokensUsed: parsedResult.tokensUsed,
    };
  },

  /**
   * Create a new IEP goal session (generates content immediately)
   */
  async createIEPSession(
    teacherId: string,
    input: CreateIEPSessionInput
  ): Promise<IEPGoalSession> {
    const normalizedInput = normalizeIEPGoalInput(input);

    // Generate the IEP content
    const generated = await this.generateIEPGoals(teacherId, normalizedInput);

    // Create the database record
    const session = await prisma.iEPGoalSession.create({
      data: {
        teacherId,
        studentIdentifier: normalizedInput.studentIdentifier,
        gradeLevel: normalizedInput.gradeLevel,
        disabilityCategory: normalizedInput.disabilityCategory,
        subjectArea: normalizedInput.subjectArea,
        presentLevels: normalizedInput.presentLevels,
        strengths: normalizedInput.strengths,
        challenges: normalizedInput.challenges,
        generatedGoals: generated.goals as unknown as object,
        accommodations: generated.accommodations as unknown as object,
        progressMonitoring: generated.progressMonitoring as unknown as object,
        goalStartDate: normalizedInput.goalStartDate,
        goalEndDate: normalizedInput.goalEndDate,
        tokensUsed: generated.tokensUsed,
        modelUsed: config.gemini.models.flash,
      },
    });

    logger.info('IEP goal session created', {
      teacherId,
      sessionId: session.id,
      disabilityCategory: normalizedInput.disabilityCategory,
      subjectArea: normalizedInput.subjectArea,
    });

    return session;
  },

  /**
   * Get IEP session by ID
   */
  async getIEPSession(
    sessionId: string,
    teacherId: string
  ): Promise<IEPGoalSession | null> {
    return prisma.iEPGoalSession.findFirst({
      where: { id: sessionId, teacherId },
    });
  },

  /**
   * List IEP sessions for a teacher
   */
  async listIEPSessions(
    teacherId: string,
    options: {
      limit?: number;
      offset?: number;
      disabilityCategory?: DisabilityCategory;
      subjectArea?: IEPSubjectArea;
    } = {}
  ): Promise<{ sessions: IEPGoalSession[]; total: number }> {
    const { limit = 20, offset = 0, disabilityCategory, subjectArea } = options;

    const where: {
      teacherId: string;
      disabilityCategory?: DisabilityCategory;
      subjectArea?: IEPSubjectArea;
    } = { teacherId };

    if (disabilityCategory) where.disabilityCategory = disabilityCategory;
    if (subjectArea) where.subjectArea = subjectArea;

    const [sessions, total] = await Promise.all([
      prisma.iEPGoalSession.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.iEPGoalSession.count({ where }),
    ]);

    return { sessions, total };
  },

  /**
   * Update an IEP session (e.g., select goals, update dates)
   */
  async updateIEPSession(
    sessionId: string,
    teacherId: string,
    input: UpdateIEPSessionInput
  ): Promise<IEPGoalSession> {
    const existing = await prisma.iEPGoalSession.findFirst({
      where: { id: sessionId, teacherId },
    });

    if (!existing) {
      throw new Error('IEP session not found. It may have been deleted. Start a new session from the IEP Goals page.');
    }

    const updateData: Record<string, unknown> = {};
    if (input.studentIdentifier !== undefined) updateData.studentIdentifier = input.studentIdentifier;
    if (input.gradeLevel !== undefined) updateData.gradeLevel = input.gradeLevel;
    if (input.presentLevels !== undefined) updateData.presentLevels = input.presentLevels;
    if (input.strengths !== undefined) updateData.strengths = input.strengths;
    if (input.challenges !== undefined) updateData.challenges = input.challenges;
    if (input.selectedGoals !== undefined) updateData.selectedGoals = input.selectedGoals as object;
    if (input.selectedAccommodations !== undefined) {
      updateData.selectedAccommodations = input.selectedAccommodations as object;
    }
    if (input.goalStartDate !== undefined) updateData.goalStartDate = input.goalStartDate;
    if (input.goalEndDate !== undefined) updateData.goalEndDate = input.goalEndDate;

    return prisma.iEPGoalSession.update({
      where: { id: sessionId },
      data: updateData,
    });
  },

  /**
   * Delete an IEP session
   */
  async deleteIEPSession(
    sessionId: string,
    teacherId: string
  ): Promise<void> {
    const existing = await prisma.iEPGoalSession.findFirst({
      where: { id: sessionId, teacherId },
    });

    if (!existing) {
      throw new Error('IEP session not found. It may have been deleted. Start a new session from the IEP Goals page.');
    }

    await prisma.iEPGoalSession.delete({
      where: { id: sessionId },
    });

    logger.info('IEP session deleted', { teacherId, sessionId });
  },

  /**
   * Regenerate goals for an existing session
   */
  async regenerateGoals(
    sessionId: string,
    teacherId: string,
    additionalContext?: string
  ): Promise<IEPGoalSession> {
    const existing = await prisma.iEPGoalSession.findFirst({
      where: { id: sessionId, teacherId },
    });

    if (!existing) {
      throw new Error('IEP session not found. It may have been deleted. Start a new session from the IEP Goals page.');
    }

    // Regenerate the goals
    const generated = await this.generateIEPGoals(teacherId, {
      gradeLevel: existing.gradeLevel,
      disabilityCategory: existing.disabilityCategory,
      subjectArea: existing.subjectArea,
      presentLevels: existing.presentLevels,
      strengths: existing.strengths || undefined,
      challenges: existing.challenges || undefined,
      additionalContext,
    });

    // Update with new goals
    return prisma.iEPGoalSession.update({
      where: { id: sessionId },
      data: {
        generatedGoals: generated.goals as unknown as object,
        accommodations: generated.accommodations as unknown as object,
        progressMonitoring: generated.progressMonitoring as unknown as object,
        selectedGoals: Prisma.JsonNull, // Reset selections
        selectedAccommodations: Prisma.JsonNull,
        tokensUsed: existing.tokensUsed + generated.tokensUsed,
      },
    });
  },

  /**
   * Get available disability categories with labels
   */
  getDisabilityCategories(): Array<{ value: DisabilityCategory; label: string }> {
    return Object.entries(DISABILITY_LABELS).map(([value, label]) => ({
      value: value as DisabilityCategory,
      label,
    }));
  },

  /**
   * Get available subject areas with labels
   */
  getSubjectAreas(): Array<{ value: IEPSubjectArea; label: string }> {
    return Object.entries(SUBJECT_AREA_LABELS).map(([value, label]) => ({
      value: value as IEPSubjectArea,
      label,
    }));
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function buildIEPGoalPrompt(input: GenerateIEPGoalsInput): string {
  const disabilityLabel = DISABILITY_LABELS[input.disabilityCategory];
  const subjectLabel = SUBJECT_AREA_LABELS[input.subjectArea];

  return `You are an expert special education consultant helping write IEP (Individualized Education Program) goals that are legally compliant with IDEA (Individuals with Disabilities Education Act).

STUDENT INFORMATION:
- Grade Level: ${input.gradeLevel}
- Disability Category: ${disabilityLabel}
- Goal Area: ${subjectLabel}

PRESENT LEVELS OF PERFORMANCE:
${truncatePromptText(input.presentLevels, IEP_PRESENT_LEVELS_MAX_CHARS)}

${input.strengths ? `STUDENT STRENGTHS:\n${truncatePromptText(input.strengths, 2000)}\n` : ''}
${input.challenges ? `AREAS OF CHALLENGE:\n${truncatePromptText(input.challenges, 2500)}\n` : ''}
${input.previousGoals ? `PREVIOUS IEP GOALS (for continuity):\n${truncatePromptText(input.previousGoals, 2500)}\n` : ''}
${input.additionalContext ? `ADDITIONAL CONTEXT:\n${truncatePromptText(input.additionalContext, IEP_ADDITIONAL_CONTEXT_MAX_CHARS)}\n` : ''}

Generate 3-5 SMART IEP goals following this format:
"By [timeframe], [student] will [measurable skill/behavior] from [baseline] to [target], as measured by [assessment method], with [accuracy/frequency] across [number] consecutive [trials/data points]."

SMART GOAL REQUIREMENTS:
- **Specific**: Clearly define the skill or behavior
- **Measurable**: Include quantifiable criteria (percentages, frequencies, scores)
- **Achievable**: Realistic given present levels (typical growth is 1-1.5 grade levels/year)
- **Relevant**: Directly address identified needs from present levels
- **Time-bound**: Include clear timeframe (typically annual)

ACCOMMODATION CATEGORIES:
1. **Presentation**: How information is presented to the student
2. **Response**: How the student demonstrates learning
3. **Setting**: Where the student learns/tests
4. **Timing/Scheduling**: When and how long

Generate accommodations that are:
- Specific to the disability category
- Practical to implement in a classroom
- Research-based and effective
- Not giving unfair advantage, but leveling the playing field

Return JSON with this structure:
{
  "goals": [
    {
      "id": "goal_1",
      "goalStatement": "Full SMART goal statement",
      "baseline": "Current performance level (from present levels)",
      "target": "Target performance level",
      "measurementMethod": "How progress will be measured (e.g., curriculum-based measurement, teacher observation, work samples)",
      "frequency": "How often measurement occurs (e.g., weekly, bi-weekly)",
      "accuracyCriteria": "Success criteria (e.g., 80% accuracy, 4 out of 5 trials)",
      "trials": "Consistency requirement (e.g., 3 consecutive sessions)",
      "timeframe": "By end of IEP period",
      "shortTermObjectives": ["Optional benchmark 1", "Optional benchmark 2"]
    }
  ],
  "accommodations": [
    {
      "category": "presentation",
      "title": "Presentation Accommodations",
      "accommodations": [
        {
          "accommodation": "Specific accommodation",
          "rationale": "Why this helps the student",
          "implementationTips": "How to implement effectively"
        }
      ]
    },
    {
      "category": "response",
      "title": "Response Accommodations",
      "accommodations": [...]
    },
    {
      "category": "setting",
      "title": "Setting Accommodations",
      "accommodations": [...]
    },
    {
      "category": "timing",
      "title": "Timing/Scheduling Accommodations",
      "accommodations": [...]
    }
  ],
  "progressMonitoring": [
    {
      "tool": "Assessment tool name (e.g., DIBELS, AIMSweb, teacher-made probes)",
      "frequency": "How often to collect data",
      "dataCollection": "Method for collecting and recording data",
      "decisionRules": "When to adjust instruction (e.g., 4 consecutive data points below aimline)"
    }
  ]
}

IMPORTANT:
- Goals must be educationally meaningful and address the student's unique needs
- Use person-first language (e.g., "student with autism" not "autistic student")
- Avoid jargon; goals should be understandable by parents
- Include both academic/skill goals and may include behavioral components if relevant
- Accommodations should be disability-specific, not generic
- Progress monitoring should be feasible for classroom teachers`;
}

function normalizeIEPGoalInput<T extends {
  disabilityCategory: unknown;
  subjectArea: unknown;
  presentLevels?: string;
  strengths?: string;
  challenges?: string;
  previousGoals?: string;
  additionalContext?: string;
}>(input: T): T & { disabilityCategory: DisabilityCategory; subjectArea: IEPSubjectArea } {
  const disabilityCategory = normalizeDisabilityCategoryInput(input.disabilityCategory);
  if (!disabilityCategory) {
    throw new Error('Invalid IEP disabilityCategory. Expected a valid DisabilityCategory enum value.');
  }

  const subjectContext = [
    String(input.presentLevels || '').trim(),
    String(input.strengths || '').trim(),
    String(input.challenges || '').trim(),
    String(input.previousGoals || '').trim(),
    String(input.additionalContext || '').trim(),
  ]
    .filter(Boolean)
    .join('\n');

  const subjectArea = normalizeSubjectAreaInput(input.subjectArea, subjectContext);
  if (!subjectArea) {
    throw new Error('Invalid IEP subjectArea. Expected a valid IEPSubjectArea enum value.');
  }

  return {
    ...input,
    disabilityCategory,
    subjectArea,
  };
}

function normalizeDisabilityCategoryInput(value: unknown): DisabilityCategory | undefined {
  if (value === null || value === undefined) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;

  const enumLike = normalizeEnumKey(raw);
  if (VALID_DISABILITY_CATEGORIES.has(enumLike as DisabilityCategory)) {
    return enumLike as DisabilityCategory;
  }
  if (DISABILITY_CATEGORY_ALIASES[enumLike]) {
    return DISABILITY_CATEGORY_ALIASES[enumLike];
  }

  const normalizedRaw = normalizeLooseText(raw);
  for (const [enumValue, label] of Object.entries(DISABILITY_LABELS)) {
    if (normalizeLooseText(label) === normalizedRaw) {
      return enumValue as DisabilityCategory;
    }
  }

  return undefined;
}

function normalizeSubjectAreaInput(value: unknown, contextText = ''): IEPSubjectArea | undefined {
  if (value === null || value === undefined) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;

  const enumLike = normalizeEnumKey(raw);
  if (VALID_SUBJECT_AREAS.has(enumLike as IEPSubjectArea)) {
    return enumLike as IEPSubjectArea;
  }
  if (SUBJECT_AREA_ALIASES[enumLike]) {
    return SUBJECT_AREA_ALIASES[enumLike];
  }

  const normalizedRaw = normalizeLooseText(raw);
  for (const [enumValue, label] of Object.entries(SUBJECT_AREA_LABELS)) {
    if (normalizeLooseText(label) === normalizedRaw) {
      return enumValue as IEPSubjectArea;
    }
  }

  const inferenceText = [raw, contextText].filter(Boolean).join('\n');
  const patternMatch = SUBJECT_AREA_PATTERNS.find((item) =>
    item.patterns.some((pattern) => pattern.test(inferenceText))
  );
  return patternMatch?.value;
}

function normalizeEnumKey(value: string): string {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
}

function normalizeLooseText(value: string): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ');
}

function getIEPMaxOutputTokens(input: GenerateIEPGoalsInput): number {
  const detailFactor = Math.ceil(
    (
      String(input.presentLevels || '').length +
      String(input.strengths || '').length +
      String(input.challenges || '').length +
      String(input.previousGoals || '').length +
      String(input.additionalContext || '').length
    ) / 40
  );
  return Math.min(14000, Math.max(8000, 7000 + detailFactor));
}

function normalizeIEPContent(value: any): Omit<GeneratedIEPContent, 'tokensUsed'> {
  const goals = Array.isArray(value?.goals)
    ? value.goals
        .map((goal: any, index: number) => ({
          id: String(goal?.id || `goal_${index + 1}`).trim(),
          goalStatement: String(goal?.goalStatement || '').trim(),
          baseline: String(goal?.baseline || '').trim(),
          target: String(goal?.target || '').trim(),
          measurementMethod: String(goal?.measurementMethod || '').trim(),
          frequency: String(goal?.frequency || '').trim(),
          accuracyCriteria: String(goal?.accuracyCriteria || '').trim(),
          trials: String(goal?.trials || '').trim(),
          timeframe: String(goal?.timeframe || '').trim(),
          shortTermObjectives: Array.isArray(goal?.shortTermObjectives)
            ? goal.shortTermObjectives.map((item: any) => String(item || '').trim()).filter(Boolean)
            : undefined,
        }))
        .filter((goal: SMARTGoal) => goal.goalStatement && goal.target)
    : [];

  if (!goals.length) {
    throw new Error('IEP goals JSON did not contain any valid goals');
  }

  const accommodations = Array.isArray(value?.accommodations)
    ? value.accommodations
        .map((category: any) => ({
          category: normalizeAccommodationCategory(category?.category),
          title: String(category?.title || '').trim(),
          accommodations: Array.isArray(category?.accommodations)
            ? category.accommodations
                .map((item: any) => ({
                  accommodation: String(item?.accommodation || '').trim(),
                  rationale: String(item?.rationale || '').trim(),
                  implementationTips: String(item?.implementationTips || '').trim() || undefined,
                }))
                .filter((item: { accommodation: string; rationale: string }) => item.accommodation && item.rationale)
            : [],
        }))
        .filter((category: AccommodationCategory) => category.title && category.accommodations.length > 0)
    : [];

  const progressMonitoring = Array.isArray(value?.progressMonitoring)
    ? value.progressMonitoring
        .map((item: any) => ({
          tool: String(item?.tool || '').trim(),
          frequency: String(item?.frequency || '').trim(),
          dataCollection: String(item?.dataCollection || '').trim(),
          decisionRules: String(item?.decisionRules || '').trim(),
        }))
        .filter((item: ProgressMonitoringPlan) => item.tool && item.frequency)
    : [];

  return {
    goals,
    accommodations,
    progressMonitoring,
  };
}

function normalizeAccommodationCategory(value: unknown): AccommodationCategory['category'] {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'presentation' || normalized === 'response' || normalized === 'setting' || normalized === 'timing') {
    return normalized;
  }
  return 'presentation';
}

export default iepGoalService;
