// Teacher Content Template Service - CRUD operations for reusable content templates
import { prisma } from '../../config/database.js';
import { TeacherContentType, Subject } from '@prisma/client';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export interface TemplateSection {
  type: string; // 'warmup', 'instruction', 'practice', 'challenge', 'assessment', etc.
  title: string;
  prompt: string; // AI generation prompt for this section
  duration?: string;
  count?: number;
  optional?: boolean;
}

export interface TemplateStructure {
  sections: TemplateSection[];
  activityTypes?: string[]; // e.g., ['matching', 'fill-in-blank', 'word-problem']
  assessmentStyle?: string;
  questionTypes?: string[]; // For quiz templates
  questionCount?: number;
  flashcardCount?: number;
  includeHints?: boolean;
  includeExamples?: boolean;
}

export interface TemplateDefaultSettings {
  difficultyProgression?: boolean;
  includeVisuals?: boolean;
  vocabularySupport?: boolean;
  adaptToGradeLevel?: boolean;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  contentType: TeacherContentType;
  subject?: Subject;
  gradeLevel?: string;
  structure: TemplateStructure;
  defaultSettings?: TemplateDefaultSettings;
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string;
  subject?: Subject | null;
  gradeLevel?: string | null;
  structure?: TemplateStructure;
  defaultSettings?: TemplateDefaultSettings | null;
}

export interface TemplateFilters {
  contentType?: TeacherContentType;
  subject?: Subject;
  gradeLevel?: string;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'usageCount';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================
// STARTER TEMPLATES
// ============================================

const STARTER_TEMPLATES: Omit<CreateTemplateInput, 'teacherId'>[] = [
  {
    name: 'Standard Lesson Plan',
    description: 'Classic lesson structure with objectives, instruction, activity, and assessment',
    contentType: 'LESSON',
    structure: {
      sections: [
        { type: 'objective', title: 'Learning Objectives', prompt: 'Define 2-3 clear, measurable learning objectives for the lesson' },
        { type: 'warmup', title: 'Warm-up Activity', prompt: 'Create a brief 5-minute warm-up to activate prior knowledge', duration: '5 minutes' },
        { type: 'instruction', title: 'Direct Instruction', prompt: 'Explain the key concepts with clear explanations and examples', duration: '15 minutes' },
        { type: 'activity', title: 'Guided Practice', prompt: 'Design an interactive activity where students apply the concepts with teacher support', duration: '15 minutes' },
        { type: 'assessment', title: 'Check for Understanding', prompt: 'Create 3-5 quick questions to assess student understanding', duration: '5 minutes' },
      ],
      activityTypes: ['discussion', 'practice-problems', 'pair-work'],
      assessmentStyle: 'formative',
    },
    defaultSettings: {
      difficultyProgression: true,
      includeVisuals: true,
      vocabularySupport: true,
    },
  },
  {
    name: 'Chapter Review Quiz',
    description: '10 mixed questions for end-of-chapter assessment',
    contentType: 'QUIZ',
    structure: {
      sections: [
        { type: 'multiple_choice', title: 'Multiple Choice', prompt: 'Create questions testing key concepts', count: 5 },
        { type: 'true_false', title: 'True/False', prompt: 'Create statements about important facts', count: 3 },
        { type: 'short_answer', title: 'Short Answer', prompt: 'Create questions requiring brief written responses', count: 2 },
      ],
      questionTypes: ['multiple_choice', 'true_false', 'short_answer'],
      questionCount: 10,
    },
    defaultSettings: {
      difficultyProgression: true,
      adaptToGradeLevel: true,
    },
  },
  {
    name: 'Vocabulary Builder',
    description: '20 flashcards with terms, definitions, and example sentences',
    contentType: 'FLASHCARD_DECK',
    structure: {
      sections: [
        { type: 'term', title: 'Key Terms', prompt: 'Extract the most important vocabulary terms from the content', count: 20 },
      ],
      flashcardCount: 20,
      includeHints: true,
      includeExamples: true,
    },
    defaultSettings: {
      vocabularySupport: true,
      adaptToGradeLevel: true,
    },
  },
  {
    name: 'Lab Report Structure',
    description: 'Scientific method template for lab activities',
    contentType: 'LESSON',
    subject: 'SCIENCE',
    structure: {
      sections: [
        { type: 'hypothesis', title: 'Hypothesis', prompt: 'Guide students to formulate a testable hypothesis' },
        { type: 'materials', title: 'Materials List', prompt: 'List all required materials with quantities' },
        { type: 'procedure', title: 'Procedure', prompt: 'Write step-by-step instructions for the experiment' },
        { type: 'observation', title: 'Observations', prompt: 'Create a data collection table or observation guide' },
        { type: 'conclusion', title: 'Conclusion', prompt: 'Guide students to analyze results and draw conclusions' },
      ],
      activityTypes: ['hands-on', 'data-collection', 'analysis'],
    },
    defaultSettings: {
      includeVisuals: true,
      vocabularySupport: true,
    },
  },
  {
    name: 'Reading Comprehension',
    description: 'Passage analysis with comprehension questions',
    contentType: 'QUIZ',
    subject: 'ENGLISH',
    structure: {
      sections: [
        { type: 'passage', title: 'Reading Passage', prompt: 'Select or summarize the key passage for analysis' },
        { type: 'vocabulary', title: 'Vocabulary in Context', prompt: 'Create questions about word meanings in the passage', count: 2 },
        { type: 'comprehension', title: 'Comprehension Questions', prompt: 'Create questions testing understanding of main ideas and details', count: 3 },
        { type: 'inference', title: 'Inference Questions', prompt: 'Create questions requiring students to draw conclusions', count: 2 },
      ],
      questionTypes: ['multiple_choice', 'short_answer'],
      questionCount: 7,
    },
    defaultSettings: {
      adaptToGradeLevel: true,
    },
  },
  {
    name: 'Quick Check Quiz',
    description: '5 multiple choice questions for exit tickets',
    contentType: 'QUIZ',
    structure: {
      sections: [
        { type: 'multiple_choice', title: 'Quick Check', prompt: 'Create 5 quick questions to assess lesson understanding', count: 5 },
      ],
      questionTypes: ['multiple_choice'],
      questionCount: 5,
    },
    defaultSettings: {
      adaptToGradeLevel: true,
    },
  },
];

// ============================================
// SERVICE
// ============================================

export const templateService = {
  /**
   * Create a new template
   */
  async createTemplate(
    teacherId: string,
    input: CreateTemplateInput
  ) {
    const template = await prisma.contentTemplate.create({
      data: {
        teacherId,
        name: input.name,
        description: input.description,
        contentType: input.contentType,
        subject: input.subject,
        gradeLevel: input.gradeLevel,
        structure: input.structure as Parameters<typeof prisma.contentTemplate.create>[0]['data']['structure'],
        defaultSettings: input.defaultSettings as Parameters<typeof prisma.contentTemplate.create>[0]['data']['defaultSettings'],
      },
    });

    logger.info('Template created', {
      templateId: template.id,
      teacherId,
      contentType: input.contentType,
    });

    return template;
  },

  /**
   * Get template by ID
   */
  async getTemplateById(templateId: string, teacherId: string) {
    const template = await prisma.contentTemplate.findFirst({
      where: {
        id: templateId,
        teacherId,
      },
      include: {
        _count: {
          select: { content: true },
        },
      },
    });

    return template;
  },

  /**
   * List templates with filters and pagination
   */
  async listTemplates(
    teacherId: string,
    filters: TemplateFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<PaginatedResult<Awaited<ReturnType<typeof prisma.contentTemplate.findFirst>>>> {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      teacherId,
    };

    if (filters.contentType) {
      where.contentType = filters.contentType;
    }
    if (filters.subject) {
      where.subject = filters.subject;
    }
    if (filters.gradeLevel) {
      where.gradeLevel = filters.gradeLevel;
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Execute query
    const [data, total] = await Promise.all([
      prisma.contentTemplate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: { content: true },
          },
        },
      }),
      prisma.contentTemplate.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  },

  /**
   * Update template
   */
  async updateTemplate(
    templateId: string,
    teacherId: string,
    input: UpdateTemplateInput
  ) {
    // Verify ownership
    const existing = await prisma.contentTemplate.findFirst({
      where: { id: templateId, teacherId },
    });

    if (!existing) {
      return null;
    }

    // Build update data
    const updateData: Parameters<typeof prisma.contentTemplate.update>[0]['data'] = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.subject !== undefined) updateData.subject = input.subject;
    if (input.gradeLevel !== undefined) updateData.gradeLevel = input.gradeLevel;
    if (input.structure !== undefined) {
      updateData.structure = input.structure as Parameters<typeof prisma.contentTemplate.update>[0]['data']['structure'];
    }
    if (input.defaultSettings !== undefined) {
      updateData.defaultSettings = input.defaultSettings as Parameters<typeof prisma.contentTemplate.update>[0]['data']['defaultSettings'];
    }

    const template = await prisma.contentTemplate.update({
      where: { id: templateId },
      data: updateData,
    });

    logger.info('Template updated', {
      templateId,
      teacherId,
      fields: Object.keys(input),
    });

    return template;
  },

  /**
   * Delete template
   */
  async deleteTemplate(templateId: string, teacherId: string): Promise<boolean> {
    // Verify ownership
    const existing = await prisma.contentTemplate.findFirst({
      where: { id: templateId, teacherId },
    });

    if (!existing) {
      return false;
    }

    await prisma.contentTemplate.delete({
      where: { id: templateId },
    });

    logger.info('Template deleted', { templateId, teacherId });
    return true;
  },

  /**
   * Duplicate template
   */
  async duplicateTemplate(templateId: string, teacherId: string) {
    const original = await prisma.contentTemplate.findFirst({
      where: { id: templateId, teacherId },
    });

    if (!original) {
      return null;
    }

    const copy = await prisma.contentTemplate.create({
      data: {
        teacherId,
        name: `Copy of ${original.name}`,
        description: original.description,
        contentType: original.contentType,
        subject: original.subject,
        gradeLevel: original.gradeLevel,
        structure: original.structure ?? undefined,
        defaultSettings: original.defaultSettings ?? undefined,
      },
    });

    logger.info('Template duplicated', {
      originalId: templateId,
      newId: copy.id,
      teacherId,
    });

    return copy;
  },

  /**
   * Increment usage count when template is used
   */
  async incrementUsage(templateId: string) {
    await prisma.contentTemplate.update({
      where: { id: templateId },
      data: {
        usageCount: { increment: 1 },
      },
    });

    logger.info('Template usage incremented', { templateId });
  },

  /**
   * Extract structure from existing content to create a template
   */
  async extractStructureFromContent(contentId: string, teacherId: string): Promise<TemplateStructure | null> {
    const content = await prisma.teacherContent.findFirst({
      where: { id: contentId, teacherId },
    });

    if (!content) {
      return null;
    }

    // Extract structure based on content type
    const structure: TemplateStructure = {
      sections: [],
    };

    switch (content.contentType) {
      case 'LESSON': {
        const lessonContent = content.lessonContent as Record<string, unknown> | null;
        if (lessonContent?.sections && Array.isArray(lessonContent.sections)) {
          structure.sections = (lessonContent.sections as Array<Record<string, unknown>>).map((section, index) => ({
            type: (section.type as string) || `section_${index}`,
            title: (section.title as string) || `Section ${index + 1}`,
            prompt: `Generate content for ${(section.title as string) || 'this section'}`,
            duration: section.duration as string | undefined,
          }));
        }
        if (lessonContent?.activities) {
          structure.activityTypes = Array.isArray(lessonContent.activities)
            ? (lessonContent.activities as string[])
            : [];
        }
        break;
      }
      case 'QUIZ': {
        const quizContent = content.quizContent as Record<string, unknown> | null;
        if (quizContent?.questions && Array.isArray(quizContent.questions)) {
          const questions = quizContent.questions as Array<Record<string, unknown>>;
          // Group by question type
          const typeGroups = questions.reduce((acc, q) => {
            const type = (q.type as string) || 'multiple_choice';
            if (!acc[type]) acc[type] = 0;
            acc[type]++;
            return acc;
          }, {} as Record<string, number>);

          structure.sections = Object.entries(typeGroups).map(([type, count]) => ({
            type,
            title: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            prompt: `Generate ${count} ${type.replace(/_/g, ' ')} questions`,
            count,
          }));
          structure.questionTypes = Object.keys(typeGroups);
          structure.questionCount = questions.length;
        }
        break;
      }
      case 'FLASHCARD_DECK': {
        const flashcardContent = content.flashcardContent as Record<string, unknown> | null;
        if (flashcardContent?.cards && Array.isArray(flashcardContent.cards)) {
          const cards = flashcardContent.cards as Array<Record<string, unknown>>;
          structure.flashcardCount = cards.length;
          structure.sections = [{
            type: 'term',
            title: 'Flashcards',
            prompt: 'Generate vocabulary flashcards with terms and definitions',
            count: cards.length,
          }];
          // Check if cards have hints/examples
          if (cards.length > 0) {
            structure.includeHints = !!cards[0].hint;
            structure.includeExamples = !!cards[0].example;
          }
        }
        break;
      }
    }

    return structure;
  },

  /**
   * Create template from existing content
   */
  async createFromContent(
    teacherId: string,
    contentId: string,
    templateName: string,
    templateDescription?: string
  ) {
    const content = await prisma.teacherContent.findFirst({
      where: { id: contentId, teacherId },
    });

    if (!content) {
      return null;
    }

    const structure = await this.extractStructureFromContent(contentId, teacherId);
    if (!structure) {
      return null;
    }

    const template = await this.createTemplate(teacherId, {
      name: templateName,
      description: templateDescription || content.description || undefined,
      contentType: content.contentType,
      subject: content.subject || undefined,
      gradeLevel: content.gradeLevel || undefined,
      structure,
    });

    logger.info('Template created from content', {
      templateId: template.id,
      contentId,
      teacherId,
    });

    return template;
  },

  /**
   * Get starter templates (system-provided templates for all teachers)
   */
  getStarterTemplates(): typeof STARTER_TEMPLATES {
    return STARTER_TEMPLATES;
  },

  /**
   * Get template statistics for teacher
   */
  async getTemplateStats(teacherId: string) {
    const [byType, mostUsed, total] = await Promise.all([
      // Count by content type
      prisma.contentTemplate.groupBy({
        by: ['contentType'],
        where: { teacherId },
        _count: true,
      }),
      // Most used templates
      prisma.contentTemplate.findMany({
        where: { teacherId },
        orderBy: { usageCount: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          contentType: true,
          usageCount: true,
        },
      }),
      // Total templates
      prisma.contentTemplate.count({ where: { teacherId } }),
    ]);

    return {
      byType: byType.reduce((acc, item) => {
        acc[item.contentType] = item._count;
        return acc;
      }, {} as Record<TeacherContentType, number>),
      mostUsed,
      total,
    };
  },
};

export default templateService;
