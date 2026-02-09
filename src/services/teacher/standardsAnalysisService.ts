// Standards Analysis Service — Coverage overview, gap detection, and actionable suggestions
// Reads from existing CurriculumState model (no new schema needed)
import { prisma } from '../../config/database.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { agentMemoryService } from './agentMemoryService.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export interface OverviewStats {
  totalSubjects: number;
  avgCoveragePercent: number;
  totalStandardsTaught: number;
  totalStandardsAssessed: number;
  totalGaps: number;
  criticalGaps: number; // Gaps that are behind pacing
  subjectSummaries: SubjectSummary[];
}

export interface SubjectSummary {
  subject: string;
  gradeLevel: string | null;
  schoolYear: string | null;
  currentWeek: number;
  taughtCount: number;
  assessedCount: number;
  skippedCount: number;
  gapCount: number;
  coveragePercent: number;
  pacingStatus: 'on_track' | 'behind' | 'ahead' | 'unknown';
}

export interface CoverageReport {
  subject: string;
  gradeLevel: string | null;
  currentWeek: number;
  standards: StandardStatus[];
  summary: {
    complete: number; // taught + assessed
    taughtNotAssessed: number;
    notTaught: number;
    skipped: number;
    total: number;
  };
}

export interface StandardStatus {
  standardId: string;
  status: 'complete' | 'taught_not_assessed' | 'not_taught' | 'skipped';
}

export interface GapAction {
  standardId: string;
  description: string;
  suggestedActions: Array<{
    action: string;
    type: 'create_quiz' | 'create_lesson' | 'mark_taught' | 'skip';
    description: string;
  }>;
}

// ============================================
// OVERVIEW
// ============================================

async function getOverviewStats(teacherId: string): Promise<OverviewStats> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) throw new Error('Agent not initialized');

  const states = await agentMemoryService.getCurriculumStates(agent.id);

  const subjectSummaries: SubjectSummary[] = states.map(state => {
    const taughtCount = state.standardsTaught.length;
    const assessedCount = state.standardsAssessed.length;
    const skippedCount = state.standardsSkipped.length;

    // Standards taught but not assessed = gaps
    const taughtNotAssessed = state.standardsTaught.filter(
      s => !state.standardsAssessed.includes(s)
    );
    const gapCount = taughtNotAssessed.length;

    // Total unique standards referenced
    const allStandards = new Set([
      ...state.standardsTaught,
      ...state.standardsAssessed,
      ...state.standardsSkipped,
    ]);
    const total = allStandards.size || 1; // Avoid division by zero

    const coveragePercent = Math.round((assessedCount / total) * 100);

    // Pacing status
    let pacingStatus: SubjectSummary['pacingStatus'] = 'unknown';
    if (state.pacingGuide) {
      const expectedWeek = getExpectedWeek();
      if (state.currentWeek >= expectedWeek - 1) {
        pacingStatus = state.currentWeek > expectedWeek + 1 ? 'ahead' : 'on_track';
      } else {
        pacingStatus = 'behind';
      }
    }

    return {
      subject: state.subject,
      gradeLevel: state.gradeLevel,
      schoolYear: state.schoolYear,
      currentWeek: state.currentWeek,
      taughtCount,
      assessedCount,
      skippedCount,
      gapCount,
      coveragePercent,
      pacingStatus,
    };
  });

  const totalStandardsTaught = subjectSummaries.reduce((sum, s) => sum + s.taughtCount, 0);
  const totalStandardsAssessed = subjectSummaries.reduce((sum, s) => sum + s.assessedCount, 0);
  const totalGaps = subjectSummaries.reduce((sum, s) => sum + s.gapCount, 0);
  const criticalGaps = subjectSummaries
    .filter(s => s.pacingStatus === 'behind')
    .reduce((sum, s) => sum + s.gapCount, 0);
  const avgCoveragePercent = subjectSummaries.length > 0
    ? Math.round(subjectSummaries.reduce((sum, s) => sum + s.coveragePercent, 0) / subjectSummaries.length)
    : 0;

  return {
    totalSubjects: subjectSummaries.length,
    avgCoveragePercent,
    totalStandardsTaught,
    totalStandardsAssessed,
    totalGaps,
    criticalGaps,
    subjectSummaries,
  };
}

// ============================================
// DETAILED COVERAGE REPORT
// ============================================

async function getFullCoverageReport(teacherId: string): Promise<CoverageReport[]> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) throw new Error('Agent not initialized');

  const states = await agentMemoryService.getCurriculumStates(agent.id);

  return states.map(state => {
    const taughtSet = new Set(state.standardsTaught);
    const assessedSet = new Set(state.standardsAssessed);
    const skippedSet = new Set(state.standardsSkipped);

    // Collect all unique standards
    const allStandardIds = new Set([
      ...state.standardsTaught,
      ...state.standardsAssessed,
      ...state.standardsSkipped,
    ]);

    const standards: StandardStatus[] = Array.from(allStandardIds).map(id => {
      if (skippedSet.has(id)) return { standardId: id, status: 'skipped' as const };
      if (taughtSet.has(id) && assessedSet.has(id)) return { standardId: id, status: 'complete' as const };
      if (taughtSet.has(id)) return { standardId: id, status: 'taught_not_assessed' as const };
      return { standardId: id, status: 'not_taught' as const };
    });

    const summary = {
      complete: standards.filter(s => s.status === 'complete').length,
      taughtNotAssessed: standards.filter(s => s.status === 'taught_not_assessed').length,
      notTaught: standards.filter(s => s.status === 'not_taught').length,
      skipped: standards.filter(s => s.status === 'skipped').length,
      total: standards.length,
    };

    return {
      subject: state.subject,
      gradeLevel: state.gradeLevel,
      currentWeek: state.currentWeek,
      standards,
      summary,
    };
  });
}

async function getCoverageBySubject(teacherId: string, subject: string): Promise<CoverageReport | null> {
  const reports = await getFullCoverageReport(teacherId);
  return reports.find(r => r.subject === subject) || null;
}

// ============================================
// GAP ACTION SUGGESTIONS
// ============================================

async function suggestGapActions(
  teacherId: string,
  subject: string,
  gapStandardIds: string[]
): Promise<GapAction[]> {
  if (gapStandardIds.length === 0) return [];

  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 2000,
      responseMimeType: 'application/json',
    },
  });

  const prompt = `You are a curriculum planning assistant. A teacher has the following gap standards in ${subject} that have been taught but not assessed, or not taught at all:

Standards: ${gapStandardIds.slice(0, 10).join(', ')}

For each standard, suggest 2-3 actionable next steps. Return JSON:
{
  "actions": [
    {
      "standardId": "standard_id",
      "description": "Brief description of what this standard covers",
      "suggestedActions": [
        {
          "action": "Short action label",
          "type": "create_quiz" | "create_lesson" | "mark_taught" | "skip",
          "description": "What this action will do"
        }
      ]
    }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const parsed = JSON.parse(text);
    return parsed.actions || [];
  } catch (error) {
    logger.error('Failed to generate gap action suggestions', { subject, error });
    // Return basic suggestions as fallback
    return gapStandardIds.slice(0, 10).map(id => ({
      standardId: id,
      description: id,
      suggestedActions: [
        { action: 'Create Quiz', type: 'create_quiz' as const, description: 'Create an assessment quiz for this standard' },
        { action: 'Create Lesson', type: 'create_lesson' as const, description: 'Create a review lesson covering this standard' },
        { action: 'Mark as Taught', type: 'mark_taught' as const, description: 'Mark this standard as taught if already covered' },
      ],
    }));
  }
}

// ============================================
// HELPERS
// ============================================

function getExpectedWeek(): number {
  const now = new Date();
  const year = now.getFullYear();
  const schoolStart = new Date(
    now.getMonth() >= 7 ? year : year - 1,
    7, // August
    15
  );
  const diffMs = now.getTime() - schoolStart.getTime();
  const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
  return Math.max(1, diffWeeks);
}

// ============================================
// EXPORTS
// ============================================

export const standardsAnalysisService = {
  getOverviewStats,
  getFullCoverageReport,
  getCoverageBySubject,
  suggestGapActions,
};
