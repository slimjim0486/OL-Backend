// Agent Tool Executor — Dispatches Claude tool calls to existing backend services
import { AgentInteractionType, Subject } from '@prisma/client';
import { agentMemoryService } from './agentMemoryService.js';
import { contextAssemblerService } from './contextAssemblerService.js';
import { contentGenerationService } from './contentGenerationService.js';
import { subPlanService } from './subPlanService.js';
import { iepGoalService } from './iepGoalService.js';
import { communicationService } from './communicationService.js';
import { standardsAnalysisService } from './standardsAnalysisService.js';
import { proactiveSuggestionService } from './proactiveSuggestionService.js';
import { reinforcementService } from './reinforcementService.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export interface ToolCallResult {
  toolName: string;
  result: any;
  isContentGeneration: boolean;
  contentType?: string;
  interactionId?: string;
}

// Content generation tools that produce actionResult for frontend
const CONTENT_TOOLS = new Set([
  'generate_lesson', 'generate_quiz', 'generate_flashcards',
  'generate_sub_plan', 'generate_iep_goals', 'generate_parent_email',
  'generate_report_comments',
]);

export const TOOL_TO_CONTENT_TYPE: Record<string, string> = {
  generate_lesson: 'lesson',
  generate_quiz: 'quiz',
  generate_flashcards: 'flashcards',
  generate_sub_plan: 'sub_plan',
  generate_iep_goals: 'iep',
  generate_parent_email: 'parent_email',
  generate_report_comments: 'report_comments',
};

// ============================================
// TOOL EXECUTOR
// ============================================

export async function executeToolCall(
  teacherId: string,
  agentId: string,
  toolName: string,
  toolInput: Record<string, any>
): Promise<ToolCallResult> {
  const isContent = CONTENT_TOOLS.has(toolName);

  try {
    switch (toolName) {
      // ── READ TOOLS ──
      case 'get_teacher_profile': {
        const agent = await agentMemoryService.getAgent(teacherId);
        if (!agent) return { toolName, result: { error: 'Agent not initialized' }, isContentGeneration: false };
        return {
          toolName,
          result: {
            schoolName: agent.schoolName,
            schoolType: agent.schoolType,
            gradesTaught: agent.gradesTaught,
            subjectsTaught: agent.subjectsTaught,
            curriculumType: agent.curriculumType,
            yearsExperience: agent.yearsExperience,
            teachingPhilosophy: agent.teachingPhilosophy,
            agentTone: agent.agentTone,
            planningAutonomy: 'PLANNER',
            firstName: (agent as any).firstName,
            lastName: (agent as any).lastName,
          },
          isContentGeneration: false,
        };
      }

      case 'get_classrooms': {
        const classrooms = await agentMemoryService.getClassroomContexts(agentId);
        return {
          toolName,
          result: classrooms.map(c => ({
            id: c.id,
            name: c.name,
            gradeLevel: c.gradeLevel,
            subject: c.subject,
            studentCount: c.studentCount,
            studentGroups: c.studentGroups,
            schedule: c.schedule,
          })),
          isContentGeneration: false,
        };
      }

      case 'get_curriculum_state': {
        const state = await agentMemoryService.getCurriculumState(agentId, toolInput.subject);
        if (!state) return { toolName, result: { message: `No curriculum state found for ${toolInput.subject}` }, isContentGeneration: false };
        return {
          toolName,
          result: {
            subject: state.subject,
            gradeLevel: state.gradeLevel,
            schoolYear: state.schoolYear,
            standardsTaught: state.standardsTaught,
            standardsAssessed: state.standardsAssessed,
            standardsSkipped: state.standardsSkipped,
            identifiedGaps: state.identifiedGaps,
            currentWeek: state.currentWeek,
            pacingGuide: state.pacingGuide,
          },
          isContentGeneration: false,
        };
      }

      case 'get_all_curriculum_states': {
        const states = await agentMemoryService.getCurriculumStates(agentId);
        return {
          toolName,
          result: states.map(s => ({
            subject: s.subject,
            gradeLevel: s.gradeLevel,
            taughtCount: Array.isArray(s.standardsTaught) ? s.standardsTaught.length : 0,
            assessedCount: Array.isArray(s.standardsAssessed) ? s.standardsAssessed.length : 0,
            gapCount: Array.isArray(s.identifiedGaps) ? s.identifiedGaps.length : 0,
            currentWeek: s.currentWeek,
          })),
          isContentGeneration: false,
        };
      }

      case 'get_style_preferences': {
        const profile = await agentMemoryService.getStyleProfile(agentId);
        if (!profile) return { toolName, result: { message: 'No style profile yet — using defaults.' }, isContentGeneration: false };
        const prefs = profile.preferences as Record<string, any> || {};
        const contentPrefs = toolInput.contentType && prefs[toolInput.contentType]
          ? prefs[toolInput.contentType]
          : prefs;
        return {
          toolName,
          result: {
            preferences: contentPrefs,
            totalApprovals: profile.totalApprovals,
            totalEdits: profile.totalEdits,
            totalRegenerations: profile.totalRegenerations,
            lastUpdated: profile.updatedAt,
          },
          isContentGeneration: false,
        };
      }

      case 'get_recent_interactions': {
        const limit = Math.min(toolInput.limit || 10, 25);
        const interactions = await agentMemoryService.getRecentInteractions(agentId, { limit });
        return {
          toolName,
          result: interactions.map(i => ({
            id: i.id,
            type: i.type,
            summary: i.summary,
            outputType: i.outputType,
            createdAt: i.createdAt,
          })),
          isContentGeneration: false,
        };
      }

      case 'get_standards_overview': {
        const overview = await standardsAnalysisService.getOverviewStats(teacherId);
        return { toolName, result: overview, isContentGeneration: false };
      }

      case 'get_standards_coverage': {
        const coverage = await standardsAnalysisService.getCoverageBySubject(teacherId, toolInput.subject);
        if (!coverage) return { toolName, result: { message: `No coverage data for ${toolInput.subject}` }, isContentGeneration: false };
        return { toolName, result: truncateResult(coverage), isContentGeneration: false };
      }

      // ── CONTENT GENERATION TOOLS ──
      case 'generate_lesson': {
        const context = await contextAssemblerService.assembleContext(
          teacherId, 'CONTENT_GENERATION', { subject: toolInput.subject }
        );
        const additionalContext = contextAssemblerService.buildAdditionalContextString(context);

        const result = await contentGenerationService.generateLesson(teacherId, {
          topic: toolInput.topic,
          subject: mapToSubject(toolInput.subject),
          gradeLevel: toolInput.gradeLevel,
          additionalContext,
          lessonType: toolInput.lessonType || 'guide',
          includeActivities: true,
          includeAssessment: true,
        });

        const interaction = await agentMemoryService.recordInteraction(agentId, {
          type: AgentInteractionType.CONTENT_GENERATION,
          summary: `Generated lesson: ${result.title}`,
          input: toolInput.topic,
          outputType: 'lesson',
          tokensUsed: result.tokensUsed,
          modelUsed: result.modelUsed || 'flash',
        });

        return {
          toolName,
          result: { content: result, preview: `Created lesson: "${result.title}" with ${result.sections.length} sections` },
          isContentGeneration: true,
          contentType: 'lesson',
          interactionId: interaction?.id,
        };
      }

      case 'generate_quiz': {
        const context = await contextAssemblerService.assembleContext(
          teacherId, 'QUIZ_GENERATION', { subject: toolInput.subject }
        );
        const additionalContextStr = contextAssemblerService.buildAdditionalContextString(context);
        const content = toolInput.topic
          ? `${additionalContextStr}\n\nTopic: ${toolInput.topic}`
          : additionalContextStr || 'Generate a quiz based on recent classroom topics.';

        const result = await contentGenerationService.generateQuiz(teacherId, '', {
          content,
          title: toolInput.title,
          questionCount: toolInput.questionCount || 10,
          difficulty: toolInput.difficulty || 'mixed',
          gradeLevel: toolInput.gradeLevel,
        });

        const interaction = await agentMemoryService.recordInteraction(agentId, {
          type: AgentInteractionType.CONTENT_GENERATION,
          summary: `Generated quiz: ${result.title} (${result.questions.length} questions)`,
          input: toolInput.topic,
          outputType: 'quiz',
          tokensUsed: result.tokensUsed,
          modelUsed: 'flash',
        });

        return {
          toolName,
          result: { content: result, preview: `Created quiz: "${result.title}" with ${result.questions.length} questions (${result.totalPoints} points)` },
          isContentGeneration: true,
          contentType: 'quiz',
          interactionId: interaction?.id,
        };
      }

      case 'generate_flashcards': {
        const context = await contextAssemblerService.assembleContext(
          teacherId, 'FLASHCARD_GENERATION', { subject: toolInput.subject }
        );
        const additionalContextStr = contextAssemblerService.buildAdditionalContextString(context);
        const content = toolInput.topic
          ? `${additionalContextStr}\n\nTopic: ${toolInput.topic}`
          : additionalContextStr || 'Generate flashcards based on recent classroom topics.';

        const result = await contentGenerationService.generateFlashcards(teacherId, '', {
          content,
          title: toolInput.title,
          cardCount: toolInput.cardCount || 20,
          gradeLevel: toolInput.gradeLevel,
        });

        const interaction = await agentMemoryService.recordInteraction(agentId, {
          type: AgentInteractionType.CONTENT_GENERATION,
          summary: `Generated flashcards: ${result.title} (${result.cards.length} cards)`,
          input: toolInput.topic,
          outputType: 'flashcards',
          tokensUsed: result.tokensUsed,
          modelUsed: 'flash',
        });

        return {
          toolName,
          result: { content: result, preview: `Created flashcard set: "${result.title}" with ${result.cards.length} cards` },
          isContentGeneration: true,
          contentType: 'flashcards',
          interactionId: interaction?.id,
        };
      }

      case 'generate_sub_plan': {
        const context = await contextAssemblerService.assembleContext(
          teacherId, 'SUB_PLAN', { subject: toolInput.subject }
        );
        const contextNotes = contextAssemblerService.buildAdditionalContextString(context);
        const additionalNotes = [toolInput.additionalNotes, contextNotes].filter(Boolean).join('\n\n');

        const result = await subPlanService.createSubPlan(teacherId, {
          title: toolInput.title || `Sub Plan - ${new Date().toLocaleDateString()}`,
          date: toolInput.date || new Date().toISOString().split('T')[0],
          gradeLevel: toolInput.gradeLevel,
          subject: toolInput.subject,
          lessonIds: [],
          additionalNotes: additionalNotes || undefined,
        });

        const interaction = await agentMemoryService.recordInteraction(agentId, {
          type: AgentInteractionType.CONTENT_GENERATION,
          summary: `Generated sub plan: ${result.title}`,
          input: toolInput.title,
          outputType: 'sub_plan',
          outputId: result.id,
          modelUsed: 'flash',
        });

        return {
          toolName,
          result: { content: result, preview: `Created substitute plan: "${result.title}"` },
          isContentGeneration: true,
          contentType: 'sub_plan',
          interactionId: interaction?.id,
        };
      }

      case 'generate_iep_goals': {
        const context = await contextAssemblerService.assembleContext(
          teacherId, 'IEP', { subject: toolInput.subjectArea }
        );
        const modelContext = contextAssemblerService.buildAdditionalContextString(context);
        const additionalContext = [toolInput.additionalContext, modelContext].filter(Boolean).join('\n\n');
        const missingFields: string[] = [];

        if (!toolInput.gradeLevel) missingFields.push('grade level');
        if (!toolInput.disabilityCategory) missingFields.push('disability category');
        if (!toolInput.subjectArea) missingFields.push('focus area');
        if (!toolInput.presentLevels || String(toolInput.presentLevels).trim().length < 10) {
          missingFields.push('present levels');
        }

        if (missingFields.length > 0) {
          throw new Error(`Need ${missingFields.join(', ')} before drafting IEP goals.`);
        }

        const result = await iepGoalService.createIEPSession(teacherId, {
          gradeLevel: toolInput.gradeLevel,
          disabilityCategory: toolInput.disabilityCategory,
          subjectArea: toolInput.subjectArea,
          presentLevels: toolInput.presentLevels,
          studentIdentifier: toolInput.studentName,
          additionalContext: additionalContext || undefined,
        });

        const interaction = await agentMemoryService.recordInteraction(agentId, {
          type: AgentInteractionType.CONTENT_GENERATION,
          summary: `Generated IEP goals for ${toolInput.subjectArea || 'student'}`,
          input: toolInput.presentLevels,
          outputType: 'iep',
          outputId: result.id,
          modelUsed: 'flash',
        });

        return {
          toolName,
          result: { content: result, preview: `Created IEP goal session with generated goals and accommodations` },
          isContentGeneration: true,
          contentType: 'iep',
          interactionId: interaction?.id,
        };
      }

      case 'generate_parent_email': {
        const result = await communicationService.generateParentEmail(teacherId, {
          topic: toolInput.topic || 'Class update',
          tone: toolInput.tone || 'update',
          subject: toolInput.subject,
          gradeLevel: toolInput.gradeLevel,
          additionalContext: toolInput.additionalContext,
          length: toolInput.length || 'medium',
        });

        const interaction = await agentMemoryService.recordInteraction(agentId, {
          type: AgentInteractionType.CONTENT_GENERATION,
          summary: `Generated parent email: ${result.title}`,
          input: toolInput.topic,
          outputType: 'parent_email',
          outputId: result.id,
          tokensUsed: result.tokensUsed,
          modelUsed: 'flash',
        });

        return {
          toolName,
          result: { content: result, preview: `Created parent email: "${result.title}"` },
          isContentGeneration: true,
          contentType: 'parent_email',
          interactionId: interaction?.id,
        };
      }

      case 'generate_report_comments': {
        const result = await communicationService.generateReportComments(teacherId, {
          subject: toolInput.subject,
          gradeLevel: toolInput.gradeLevel,
          performanceLevel: toolInput.performanceLevel || 'meeting',
          includeGoals: true,
          commentCount: toolInput.commentCount || 5,
        });

        const interaction = await agentMemoryService.recordInteraction(agentId, {
          type: AgentInteractionType.CONTENT_GENERATION,
          summary: `Generated report card comments: ${result.title}`,
          input: toolInput.subject || 'general',
          outputType: 'report_comments',
          outputId: result.id,
          tokensUsed: result.tokensUsed,
          modelUsed: 'flash',
        });

        return {
          toolName,
          result: { content: result, preview: `Created report card comments: "${result.title}"` },
          isContentGeneration: true,
          contentType: 'report_comments',
          interactionId: interaction?.id,
        };
      }

      // ── STATE & NAVIGATION TOOLS ──
      case 'update_curriculum_progress': {
        const updated = await agentMemoryService.updateCurriculumState(agentId, toolInput.subject, {
          standardsTaught: toolInput.standardsTaught,
          standardsAssessed: toolInput.standardsAssessed,
          topicProgress: toolInput.currentTopic ? { current: toolInput.currentTopic } : undefined,
        });
        return {
          toolName,
          result: { success: true, subject: toolInput.subject, updated: !!updated },
          isContentGeneration: false,
        };
      }

      case 'navigate_to_page': {
        const pageRoutes: Record<string, string> = {
          lessons: '/teacher/content/create',
          quiz: '/teacher/generate/quiz',
          flashcards: '/teacher/generate/flashcards',
          'sub-plans': '/teacher/sub-plans',
          'iep-goals': '/teacher/iep-goals',
          'audio-updates': '/teacher/audio-updates',
          communications: '/teacher/communications',
          games: '/teacher/games',
          standards: '/teacher/agent/standards',
          reviews: '/teacher/agent/reviews',
          settings: '/teacher/settings',
          billing: '/teacher/billing',
          content: '/teacher/content',
          store: '/teacher/store',
        };
        const route = pageRoutes[toolInput.page] || `/teacher/${toolInput.page}`;
        return {
          toolName,
          result: { navigateTo: route, page: toolInput.page },
          isContentGeneration: false,
        };
      }

      case 'record_feedback': {
        if (toolInput.feedbackType === 'approve') {
          await reinforcementService.recordApprovalSignal(agentId);
        } else if (toolInput.feedbackType === 'regenerate') {
          await reinforcementService.recordRegenerationSignal(agentId);
        }
        return {
          toolName,
          result: { success: true, feedbackType: toolInput.feedbackType },
          isContentGeneration: false,
        };
      }

      // ── ANALYSIS TOOLS ──
      case 'suggest_gap_actions': {
        const suggestions = await standardsAnalysisService.suggestGapActions(
          teacherId,
          toolInput.subject,
          toolInput.gapStandardIds || []
        );
        return { toolName, result: truncateResult(suggestions), isContentGeneration: false };
      }

      case 'get_proactive_suggestions': {
        const suggestions = await proactiveSuggestionService.getSuggestions(teacherId);
        return { toolName, result: truncateResult(suggestions), isContentGeneration: false };
      }

      case 'get_differentiation_advice': {
        const classrooms = await agentMemoryService.getClassroomContexts(agentId);
        const targetClassroom = toolInput.classroomId
          ? classrooms.find(c => c.id === toolInput.classroomId)
          : classrooms[0];

        const studentGroups = targetClassroom?.studentGroups as any[] || [];
        const advice = {
          topic: toolInput.topic,
          classroom: targetClassroom?.name || 'General',
          strategies: {
            aboveGrade: `For advanced learners: extend "${toolInput.topic}" with challenge problems, open-ended exploration, or peer teaching.`,
            onLevel: `For on-level learners: follow the standard lesson progression for "${toolInput.topic}" with guided practice.`,
            belowGrade: `For students needing support: break "${toolInput.topic}" into smaller steps, provide visual aids, and use hands-on manipulatives.`,
            ell: `For ELL students: pre-teach vocabulary for "${toolInput.topic}", use visual supports, and provide sentence frames.`,
          },
          studentGroups: studentGroups.length > 0
            ? studentGroups.map((g: any) => ({ name: g.name, level: g.level, count: g.count }))
            : [],
        };
        return { toolName, result: advice, isContentGeneration: false };
      }

      default:
        return {
          toolName,
          result: { error: `Unknown tool: ${toolName}` },
          isContentGeneration: false,
        };
    }
  } catch (err: any) {
    logger.error('Tool execution failed', { toolName, teacherId, error: err?.message || err });
    return {
      toolName,
      result: { error: `Failed to execute ${toolName}: ${err?.message || 'Unknown error'}` },
      isContentGeneration: isContent,
      contentType: TOOL_TO_CONTENT_TYPE[toolName],
    };
  }
}

// ============================================
// UTILITIES
// ============================================

function mapToSubject(subjectStr?: string): Subject | undefined {
  if (!subjectStr) return undefined;
  const upper = subjectStr.toUpperCase().replace(/\s+/g, '_');
  if (Object.values(Subject).includes(upper as Subject)) {
    return upper as Subject;
  }
  const map: Record<string, Subject> = {
    MATHEMATICS: Subject.MATH,
    MATHS: Subject.MATH,
    ELA: Subject.ENGLISH,
    'LANGUAGE ARTS': Subject.ENGLISH,
    LITERATURE: Subject.ENGLISH,
    SS: Subject.SOCIAL_STUDIES,
    PE: Subject.PHYSICAL_EDUCATION,
    CS: Subject.COMPUTER_SCIENCE,
    IT: Subject.COMPUTER_SCIENCE,
  };
  return map[upper] || undefined;
}

/**
 * Truncate large results before sending back to Claude to stay within context limits.
 * Max ~8000 chars per tool result.
 */
function truncateResult(data: any): any {
  const json = JSON.stringify(data);
  if (json.length <= 8000) return data;

  // For arrays, truncate to first 5 items
  if (Array.isArray(data)) {
    const truncated = data.slice(0, 5);
    return { items: truncated, _truncated: true, totalItems: data.length };
  }

  // For objects with nested arrays, truncate those arrays
  if (typeof data === 'object' && data !== null) {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value) && value.length > 5) {
        result[key] = { items: value.slice(0, 5), _truncated: true, totalItems: value.length };
      } else if (typeof value === 'string' && value.length > 1000) {
        result[key] = value.substring(0, 1000) + ' [truncated]';
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  // Fallback: stringify and truncate
  return {
    _truncated: true,
    preview: json.substring(0, 8000) + ' [truncated]',
  };
}
