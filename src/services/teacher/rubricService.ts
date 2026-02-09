// Rubric Management Service - CRUD for grading rubrics
// Supports custom rubrics with weighted criteria and scoring levels
import { prisma } from '../../config/database.js';
import { Rubric, Subject, ScoringType } from '@prisma/client';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export interface ScoringLevel {
  score: number;          // e.g., 4, 3, 2, 1, 0
  label: string;          // e.g., "Excellent", "Proficient", "Developing"
  description: string;    // Detailed description of what this level looks like
}

export interface RubricCriterion {
  id: string;             // UUID for tracking
  name: string;           // e.g., "Thesis Statement", "Evidence", "Grammar"
  description: string;    // What this criterion assesses
  weight: number;         // Percentage weight (all must sum to 100)
  levels: ScoringLevel[]; // Scoring levels (2-6 levels per criterion)
}

export interface CreateRubricInput {
  name: string;
  description?: string;
  subject?: Subject;
  gradeLevel?: string;
  criteria: RubricCriterion[];
  maxScore: number;
  scoringType?: ScoringType;
  passingThreshold?: number;
  gradingPrompt?: string;        // Custom AI instructions
  confidenceThreshold?: number;  // 0-1, default 0.7
}

export interface UpdateRubricInput {
  name?: string;
  description?: string;
  subject?: Subject;
  gradeLevel?: string;
  criteria?: RubricCriterion[];
  maxScore?: number;
  scoringType?: ScoringType;
  passingThreshold?: number;
  gradingPrompt?: string;
  confidenceThreshold?: number;
}

export interface ListRubricsOptions {
  limit?: number;
  offset?: number;
  subject?: Subject;
  search?: string;
}

export interface CriteriaValidationResult {
  valid: boolean;
  errors: string[];
}

// ============================================
// SYSTEM TEMPLATES
// ============================================

const SYSTEM_TEMPLATES: Omit<CreateRubricInput, 'name'>[] = [
  // Narrative Writing Rubric (Elementary)
  {
    description: 'Comprehensive rubric for narrative writing assessment focusing on story elements, organization, and conventions.',
    subject: 'ENGLISH',
    gradeLevel: '3-5',
    maxScore: 16,
    scoringType: 'POINTS',
    passingThreshold: 10,
    confidenceThreshold: 0.7,
    criteria: [
      {
        id: 'narrative-focus',
        name: 'Focus & Organization',
        description: 'Story has a clear beginning, middle, and end with logical sequence of events.',
        weight: 25,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Story has a compelling introduction, well-developed events in logical order, and a satisfying conclusion. Transitions are smooth and purposeful.' },
          { score: 3, label: 'Proficient', description: 'Story has a clear beginning, middle, and end. Events are mostly in order with some transitions.' },
          { score: 2, label: 'Developing', description: 'Story has a beginning and end but middle is underdeveloped. Some events may be out of order.' },
          { score: 1, label: 'Beginning', description: 'Story lacks clear structure. Events are confusing or out of sequence.' },
        ],
      },
      {
        id: 'narrative-development',
        name: 'Narrative Development',
        description: 'Use of dialogue, description, and pacing to develop characters and events.',
        weight: 30,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Rich dialogue and sensory details bring characters to life. Pacing is varied and effective.' },
          { score: 3, label: 'Proficient', description: 'Good use of dialogue and description. Characters are developed and events are engaging.' },
          { score: 2, label: 'Developing', description: 'Some dialogue or description present. Characters need more development.' },
          { score: 1, label: 'Beginning', description: 'Little or no dialogue. Characters are flat and events lack detail.' },
        ],
      },
      {
        id: 'narrative-voice',
        name: 'Voice & Style',
        description: 'Writer\'s unique voice comes through with varied sentence structure.',
        weight: 20,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Distinctive voice engages reader. Varied sentence structure creates rhythm and flow.' },
          { score: 3, label: 'Proficient', description: 'Voice is present and appropriate. Some sentence variety.' },
          { score: 2, label: 'Developing', description: 'Voice is inconsistent. Sentences tend to follow similar patterns.' },
          { score: 1, label: 'Beginning', description: 'No discernible voice. Sentences are choppy or run-on.' },
        ],
      },
      {
        id: 'narrative-conventions',
        name: 'Conventions',
        description: 'Correct spelling, grammar, punctuation, and capitalization.',
        weight: 25,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Very few or no errors in spelling, grammar, or punctuation.' },
          { score: 3, label: 'Proficient', description: 'Minor errors that do not interfere with meaning.' },
          { score: 2, label: 'Developing', description: 'Several errors that sometimes interfere with meaning.' },
          { score: 1, label: 'Beginning', description: 'Frequent errors that make text difficult to read.' },
        ],
      },
    ],
  },
  // Argumentative Essay Rubric (Middle School)
  {
    description: 'Rubric for argumentative essays assessing claim, evidence, reasoning, and writing quality.',
    subject: 'ENGLISH',
    gradeLevel: '6-8',
    maxScore: 20,
    scoringType: 'POINTS',
    passingThreshold: 12,
    confidenceThreshold: 0.7,
    criteria: [
      {
        id: 'argument-claim',
        name: 'Claim & Focus',
        description: 'Clear, arguable thesis that establishes the writer\'s position.',
        weight: 20,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Thesis is clear, specific, and arguable. Position is maintained throughout.' },
          { score: 3, label: 'Proficient', description: 'Thesis is clear and states a position. Focus is mostly maintained.' },
          { score: 2, label: 'Developing', description: 'Thesis is present but may be vague or overly broad. Focus wavers.' },
          { score: 1, label: 'Beginning', description: 'No clear thesis or position stated.' },
        ],
      },
      {
        id: 'argument-evidence',
        name: 'Evidence & Support',
        description: 'Relevant, credible evidence that supports the claim.',
        weight: 25,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Multiple pieces of strong, relevant evidence from credible sources. Evidence is well-integrated.' },
          { score: 3, label: 'Proficient', description: 'Adequate evidence supports the claim. Most sources are credible.' },
          { score: 2, label: 'Developing', description: 'Some evidence present but may be weak, irrelevant, or poorly integrated.' },
          { score: 1, label: 'Beginning', description: 'Little or no evidence. Claims are unsupported.' },
        ],
      },
      {
        id: 'argument-reasoning',
        name: 'Reasoning & Analysis',
        description: 'Logical connections between claim and evidence with analysis.',
        weight: 25,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Insightful analysis explains how evidence supports claim. Counterarguments are addressed.' },
          { score: 3, label: 'Proficient', description: 'Analysis connects evidence to claim. Some acknowledgment of counterarguments.' },
          { score: 2, label: 'Developing', description: 'Limited analysis. Evidence is presented but not explained.' },
          { score: 1, label: 'Beginning', description: 'No analysis. Evidence is dropped in without connection to claim.' },
        ],
      },
      {
        id: 'argument-organization',
        name: 'Organization',
        description: 'Logical structure with introduction, body, and conclusion.',
        weight: 15,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Clear structure with engaging intro, well-organized body, and strong conclusion. Effective transitions.' },
          { score: 3, label: 'Proficient', description: 'Clear intro, body, and conclusion. Transitions are present.' },
          { score: 2, label: 'Developing', description: 'Basic structure present but may be weak in places. Few transitions.' },
          { score: 1, label: 'Beginning', description: 'No clear structure. Ideas are disorganized.' },
        ],
      },
      {
        id: 'argument-conventions',
        name: 'Language & Conventions',
        description: 'Formal tone, varied sentences, and correct grammar/mechanics.',
        weight: 15,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Formal, academic tone. Varied sentences. Few or no errors.' },
          { score: 3, label: 'Proficient', description: 'Appropriate tone. Some sentence variety. Minor errors.' },
          { score: 2, label: 'Developing', description: 'Tone may be informal. Limited sentence variety. Several errors.' },
          { score: 1, label: 'Beginning', description: 'Inappropriate tone. Many errors interfere with meaning.' },
        ],
      },
    ],
  },
  // Research Report Rubric
  {
    description: 'Rubric for research reports assessing research quality, organization, and citation.',
    subject: 'ENGLISH',
    gradeLevel: '5-8',
    maxScore: 20,
    scoringType: 'POINTS',
    passingThreshold: 12,
    confidenceThreshold: 0.7,
    criteria: [
      {
        id: 'research-topic',
        name: 'Topic & Focus',
        description: 'Clear research question or topic with maintained focus.',
        weight: 20,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Focused, researchable topic. Clear purpose maintained throughout.' },
          { score: 3, label: 'Proficient', description: 'Clear topic with mostly maintained focus.' },
          { score: 2, label: 'Developing', description: 'Topic is broad or unfocused. Focus wavers.' },
          { score: 1, label: 'Beginning', description: 'No clear topic or purpose.' },
        ],
      },
      {
        id: 'research-sources',
        name: 'Sources & Research',
        description: 'Quality and variety of sources used.',
        weight: 25,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Multiple credible, varied sources. Excellent research depth.' },
          { score: 3, label: 'Proficient', description: 'Adequate sources that are mostly credible.' },
          { score: 2, label: 'Developing', description: 'Few sources or sources of questionable credibility.' },
          { score: 1, label: 'Beginning', description: 'No sources or only unreliable sources.' },
        ],
      },
      {
        id: 'research-synthesis',
        name: 'Synthesis & Analysis',
        description: 'Integration of information from multiple sources.',
        weight: 25,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Skillfully synthesizes information. Original analysis and conclusions.' },
          { score: 3, label: 'Proficient', description: 'Good integration of sources. Some analysis present.' },
          { score: 2, label: 'Developing', description: 'Information is presented but not integrated. Mostly summary.' },
          { score: 1, label: 'Beginning', description: 'Copied information without integration or analysis.' },
        ],
      },
      {
        id: 'research-organization',
        name: 'Organization',
        description: 'Logical structure appropriate for research report.',
        weight: 15,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Excellent organization with clear sections and smooth flow.' },
          { score: 3, label: 'Proficient', description: 'Clear organization with appropriate sections.' },
          { score: 2, label: 'Developing', description: 'Basic organization but flow is choppy.' },
          { score: 1, label: 'Beginning', description: 'No clear organization.' },
        ],
      },
      {
        id: 'research-citations',
        name: 'Citations & Format',
        description: 'Proper citation format and bibliography.',
        weight: 15,
        levels: [
          { score: 4, label: 'Exemplary', description: 'All sources properly cited in consistent format. Complete bibliography.' },
          { score: 3, label: 'Proficient', description: 'Most sources cited correctly. Bibliography present.' },
          { score: 2, label: 'Developing', description: 'Inconsistent citations. Bibliography incomplete.' },
          { score: 1, label: 'Beginning', description: 'No citations or bibliography.' },
        ],
      },
    ],
  },
  // Math Problem Solving Rubric
  {
    description: 'Rubric for assessing mathematical problem-solving and explanation.',
    subject: 'MATH',
    gradeLevel: '3-8',
    maxScore: 12,
    scoringType: 'POINTS',
    passingThreshold: 8,
    confidenceThreshold: 0.75,
    criteria: [
      {
        id: 'math-understanding',
        name: 'Mathematical Understanding',
        description: 'Understanding of the problem and mathematical concepts.',
        weight: 35,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Complete understanding of problem. Appropriate concepts and procedures selected.' },
          { score: 3, label: 'Proficient', description: 'Good understanding. Mostly appropriate methods chosen.' },
          { score: 2, label: 'Developing', description: 'Partial understanding. Some appropriate methods used.' },
          { score: 1, label: 'Beginning', description: 'Little understanding shown. Inappropriate methods used.' },
        ],
      },
      {
        id: 'math-process',
        name: 'Problem-Solving Process',
        description: 'Strategy and steps used to solve the problem.',
        weight: 35,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Efficient strategy. All steps shown clearly. Correct answer.' },
          { score: 3, label: 'Proficient', description: 'Reasonable strategy. Most steps shown. Answer may have minor error.' },
          { score: 2, label: 'Developing', description: 'Strategy partially correct. Some steps missing. Answer incorrect.' },
          { score: 1, label: 'Beginning', description: 'No clear strategy. Work is incomplete or incorrect.' },
        ],
      },
      {
        id: 'math-explanation',
        name: 'Explanation & Reasoning',
        description: 'Clear explanation of mathematical thinking.',
        weight: 30,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Clear, complete explanation using math vocabulary. Reasoning is logical.' },
          { score: 3, label: 'Proficient', description: 'Good explanation with some math vocabulary.' },
          { score: 2, label: 'Developing', description: 'Partial explanation. Limited use of math vocabulary.' },
          { score: 1, label: 'Beginning', description: 'No explanation or explanation is unclear.' },
        ],
      },
    ],
  },
  // Science Lab Report Rubric
  {
    description: 'Rubric for science lab reports and experiments.',
    subject: 'SCIENCE',
    gradeLevel: '5-8',
    maxScore: 20,
    scoringType: 'POINTS',
    passingThreshold: 12,
    confidenceThreshold: 0.7,
    criteria: [
      {
        id: 'science-hypothesis',
        name: 'Hypothesis & Purpose',
        description: 'Clear, testable hypothesis based on research question.',
        weight: 20,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Clear, testable hypothesis using if-then format. Purpose well stated.' },
          { score: 3, label: 'Proficient', description: 'Hypothesis is testable. Purpose is clear.' },
          { score: 2, label: 'Developing', description: 'Hypothesis present but may not be testable. Purpose unclear.' },
          { score: 1, label: 'Beginning', description: 'No hypothesis or purpose stated.' },
        ],
      },
      {
        id: 'science-procedure',
        name: 'Procedure',
        description: 'Clear, detailed, repeatable procedure.',
        weight: 20,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Detailed, numbered steps. Controls and variables identified. Repeatable by others.' },
          { score: 3, label: 'Proficient', description: 'Clear steps. Most variables identified.' },
          { score: 2, label: 'Developing', description: 'Steps present but lack detail. Variables unclear.' },
          { score: 1, label: 'Beginning', description: 'No procedure or procedure incomplete.' },
        ],
      },
      {
        id: 'science-data',
        name: 'Data & Observations',
        description: 'Organized data with accurate observations.',
        weight: 25,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Well-organized data in appropriate format (table/graph). Detailed observations.' },
          { score: 3, label: 'Proficient', description: 'Data organized. Observations present.' },
          { score: 2, label: 'Developing', description: 'Some data collected. Observations minimal.' },
          { score: 1, label: 'Beginning', description: 'No data or data is disorganized.' },
        ],
      },
      {
        id: 'science-analysis',
        name: 'Analysis & Conclusion',
        description: 'Interpretation of data and conclusion based on evidence.',
        weight: 25,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Thorough analysis. Conclusion supported by data. Sources of error discussed.' },
          { score: 3, label: 'Proficient', description: 'Good analysis. Conclusion relates to hypothesis.' },
          { score: 2, label: 'Developing', description: 'Limited analysis. Conclusion may not match data.' },
          { score: 1, label: 'Beginning', description: 'No analysis or conclusion.' },
        ],
      },
      {
        id: 'science-format',
        name: 'Scientific Writing',
        description: 'Use of scientific vocabulary and proper format.',
        weight: 10,
        levels: [
          { score: 4, label: 'Exemplary', description: 'Excellent use of scientific vocabulary. Proper lab report format.' },
          { score: 3, label: 'Proficient', description: 'Good vocabulary usage. Format mostly correct.' },
          { score: 2, label: 'Developing', description: 'Limited vocabulary. Format issues.' },
          { score: 1, label: 'Beginning', description: 'No scientific vocabulary. Poor format.' },
        ],
      },
    ],
  },
];

// Template names mapping
const TEMPLATE_NAMES: Record<number, string> = {
  0: 'Narrative Writing (Elementary)',
  1: 'Argumentative Essay (Middle School)',
  2: 'Research Report',
  3: 'Math Problem Solving',
  4: 'Science Lab Report',
};

// ============================================
// SERVICE
// ============================================

export const rubricService = {
  /**
   * Validate rubric criteria
   * - Weights must sum to 100
   * - Each criterion needs 2-6 levels
   * - Level scores must be unique within criterion
   */
  validateCriteria(criteria: RubricCriterion[]): CriteriaValidationResult {
    const errors: string[] = [];

    if (!criteria || criteria.length === 0) {
      errors.push('At least one criterion is required');
      return { valid: false, errors };
    }

    if (criteria.length > 10) {
      errors.push('Maximum 10 criteria allowed');
    }

    // Check weight sum
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      errors.push(`Criteria weights must sum to 100% (current: ${totalWeight}%)`);
    }

    // Validate each criterion
    criteria.forEach((criterion, index) => {
      const prefix = `Criterion ${index + 1} "${criterion.name}"`;

      if (!criterion.name || criterion.name.trim().length === 0) {
        errors.push(`${prefix}: Name is required`);
      }

      if (!criterion.id) {
        errors.push(`${prefix}: ID is required`);
      }

      if (criterion.weight <= 0 || criterion.weight > 100) {
        errors.push(`${prefix}: Weight must be between 1 and 100`);
      }

      if (!criterion.levels || criterion.levels.length < 2) {
        errors.push(`${prefix}: At least 2 scoring levels required`);
      } else if (criterion.levels.length > 6) {
        errors.push(`${prefix}: Maximum 6 scoring levels allowed`);
      } else {
        // Check for unique scores
        const scores = criterion.levels.map(l => l.score);
        const uniqueScores = new Set(scores);
        if (uniqueScores.size !== scores.length) {
          errors.push(`${prefix}: Level scores must be unique`);
        }

        // Validate each level
        criterion.levels.forEach((level, levelIndex) => {
          if (!level.label || level.label.trim().length === 0) {
            errors.push(`${prefix}, Level ${levelIndex + 1}: Label is required`);
          }
          if (!level.description || level.description.trim().length === 0) {
            errors.push(`${prefix}, Level ${levelIndex + 1}: Description is required`);
          }
          if (typeof level.score !== 'number') {
            errors.push(`${prefix}, Level ${levelIndex + 1}: Score must be a number`);
          }
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Create a new rubric
   */
  async create(
    teacherId: string,
    input: CreateRubricInput
  ): Promise<Rubric> {
    // Validate criteria
    const validation = this.validateCriteria(input.criteria);
    if (!validation.valid) {
      throw new Error(`Invalid criteria: ${validation.errors.join('; ')}`);
    }

    const rubric = await prisma.rubric.create({
      data: {
        teacherId,
        name: input.name,
        description: input.description,
        subject: input.subject,
        gradeLevel: input.gradeLevel,
        criteria: input.criteria as unknown as object,
        maxScore: input.maxScore,
        scoringType: input.scoringType || 'POINTS',
        passingThreshold: input.passingThreshold,
        gradingPrompt: input.gradingPrompt,
        confidenceThreshold: input.confidenceThreshold ?? 0.7,
      },
    });

    logger.info('Rubric created', {
      teacherId,
      rubricId: rubric.id,
      criteriaCount: input.criteria.length,
    });

    return rubric;
  },

  /**
   * Get rubric by ID
   */
  async getById(
    rubricId: string,
    teacherId: string
  ): Promise<Rubric | null> {
    return prisma.rubric.findFirst({
      where: {
        id: rubricId,
        teacherId,
      },
    });
  },

  /**
   * List rubrics for a teacher
   */
  async list(
    teacherId: string,
    options: ListRubricsOptions = {}
  ): Promise<{ rubrics: Rubric[]; total: number }> {
    const { limit = 20, offset = 0, subject, search } = options;

    const where: {
      teacherId: string;
      subject?: Subject;
      name?: { contains: string; mode: 'insensitive' };
    } = { teacherId };

    if (subject) {
      where.subject = subject;
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [rubrics, total] = await Promise.all([
      prisma.rubric.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.rubric.count({ where }),
    ]);

    return { rubrics, total };
  },

  /**
   * Update a rubric
   */
  async update(
    rubricId: string,
    teacherId: string,
    input: UpdateRubricInput
  ): Promise<Rubric> {
    const existing = await prisma.rubric.findFirst({
      where: { id: rubricId, teacherId },
    });

    if (!existing) {
      throw new Error('Rubric not found');
    }

    // Validate criteria if being updated
    if (input.criteria) {
      const validation = this.validateCriteria(input.criteria);
      if (!validation.valid) {
        throw new Error(`Invalid criteria: ${validation.errors.join('; ')}`);
      }
    }

    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.subject !== undefined) updateData.subject = input.subject;
    if (input.gradeLevel !== undefined) updateData.gradeLevel = input.gradeLevel;
    if (input.criteria !== undefined) updateData.criteria = input.criteria as unknown as object;
    if (input.maxScore !== undefined) updateData.maxScore = input.maxScore;
    if (input.scoringType !== undefined) updateData.scoringType = input.scoringType;
    if (input.passingThreshold !== undefined) updateData.passingThreshold = input.passingThreshold;
    if (input.gradingPrompt !== undefined) updateData.gradingPrompt = input.gradingPrompt;
    if (input.confidenceThreshold !== undefined) updateData.confidenceThreshold = input.confidenceThreshold;

    return prisma.rubric.update({
      where: { id: rubricId },
      data: updateData,
    });
  },

  /**
   * Delete a rubric
   */
  async delete(
    rubricId: string,
    teacherId: string
  ): Promise<void> {
    const existing = await prisma.rubric.findFirst({
      where: { id: rubricId, teacherId },
    });

    if (!existing) {
      throw new Error('Rubric not found');
    }

    // Check if rubric is used by any grading jobs
    const jobCount = await prisma.gradingJob.count({
      where: { rubricId },
    });

    if (jobCount > 0) {
      throw new Error(`Cannot delete rubric: it is used by ${jobCount} grading job(s). Archive instead or delete the grading jobs first.`);
    }

    await prisma.rubric.delete({
      where: { id: rubricId },
    });

    logger.info('Rubric deleted', { teacherId, rubricId });
  },

  /**
   * Duplicate a rubric
   */
  async duplicate(
    rubricId: string,
    teacherId: string,
    newName?: string
  ): Promise<Rubric> {
    const existing = await prisma.rubric.findFirst({
      where: { id: rubricId, teacherId },
    });

    if (!existing) {
      throw new Error('Rubric not found');
    }

    const duplicatedName = newName || `${existing.name} (Copy)`;

    return prisma.rubric.create({
      data: {
        teacherId,
        name: duplicatedName,
        description: existing.description,
        subject: existing.subject,
        gradeLevel: existing.gradeLevel,
        criteria: existing.criteria ?? {},
        maxScore: existing.maxScore,
        scoringType: existing.scoringType,
        passingThreshold: existing.passingThreshold,
        gradingPrompt: existing.gradingPrompt,
        confidenceThreshold: existing.confidenceThreshold,
      },
    });
  },

  /**
   * Get system templates
   */
  async getTemplates(
    subject?: Subject,
    gradeLevel?: string
  ): Promise<Array<{ id: string; name: string; description?: string; subject?: Subject; gradeLevel?: string; criteriaCount: number }>> {
    const templates = SYSTEM_TEMPLATES.map((template, index) => ({
      id: `template-${index}`,
      name: TEMPLATE_NAMES[index],
      description: template.description,
      subject: template.subject,
      gradeLevel: template.gradeLevel,
      criteriaCount: template.criteria.length,
    }));

    // Filter by subject if specified
    let filtered = templates;
    if (subject) {
      filtered = filtered.filter(t => t.subject === subject);
    }

    // Filter by grade level if specified (partial match)
    if (gradeLevel) {
      filtered = filtered.filter(t => !t.gradeLevel || t.gradeLevel.includes(gradeLevel));
    }

    return filtered;
  },

  /**
   * Create rubric from template
   */
  async createFromTemplate(
    teacherId: string,
    templateId: string,
    customName?: string
  ): Promise<Rubric> {
    const templateIndex = parseInt(templateId.replace('template-', ''), 10);
    const template = SYSTEM_TEMPLATES[templateIndex];

    if (!template) {
      throw new Error('Template not found');
    }

    const name = customName || TEMPLATE_NAMES[templateIndex];

    return this.create(teacherId, {
      name,
      ...template,
    });
  },

  /**
   * Increment usage count
   */
  async incrementUsage(rubricId: string): Promise<void> {
    await prisma.rubric.update({
      where: { id: rubricId },
      data: { usageCount: { increment: 1 } },
    });
  },
};

export default rubricService;
