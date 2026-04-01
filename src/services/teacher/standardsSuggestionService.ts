/**
 * Standards Suggestion Service
 *
 * Suggests curriculum standards to target for lesson generation based on
 * the teacher's CurriculumState (untaught, gaps, upcoming in pacing guide).
 */

import { Subject, CurriculumType } from '@prisma/client';
import { agentMemoryService } from './agentMemoryService.js';
import { curriculumService, StandardWithContext } from '../curriculum/curriculumService.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export interface SuggestedStandard {
  notation: string;
  description: string;
  domain: string | null;
  reason: 'gap' | 'untaught' | 'upcoming';
  priority: number; // 1 = highest
}

export interface SuggestedStandardsResult {
  standards: SuggestedStandard[];
  totalAvailable: number;
  allStandardsForGrade: Array<{
    notation: string;
    description: string;
    domain: string | null;
    status: 'complete' | 'taught_not_assessed' | 'not_taught' | 'skipped';
  }>;
}

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Get suggested standards for a teacher to target in lesson generation.
 * Prioritizes: gaps > upcoming in pacing guide > untaught standards.
 */
export async function getSuggestedStandards(
  teacherId: string,
  subject: string,
  gradeLevel: string
): Promise<SuggestedStandardsResult> {
  // Parse grade level to number (handles "3rd Grade", "Grade 3", "3", "K", etc.)
  const gradeNum = parseGradeToNumber(gradeLevel);
  if (gradeNum === null) {
    logger.warn('Could not parse grade level for standards suggestion', { gradeLevel });
    return { standards: [], totalAvailable: 0, allStandardsForGrade: [] };
  }

  // Try to get teacher's agent for personalized suggestions
  // If no agent exists (new teacher), we still load standards from curriculum DB
  const agent = await agentMemoryService.getAgent(teacherId);
  const curriculumType = (agent?.curriculumType as CurriculumType) || CurriculumType.AMERICAN;

  let allStandards: StandardWithContext[];
  try {
    allStandards = await curriculumService.getStandardsForGrade(
      curriculumType,
      subject as Subject,
      gradeNum
    );
  } catch (err) {
    logger.warn('Failed to load standards for grade', { subject, gradeLevel, gradeNum, err });
    return { standards: [], totalAvailable: 0, allStandardsForGrade: [] };
  }

  if (!allStandards.length) {
    return { standards: [], totalAvailable: 0, allStandardsForGrade: [] };
  }

  // Get teacher's curriculum state for personalized prioritization
  // If no agent or no state, all standards show as "untaught" (no prioritization)
  let subjectState = null;
  if (agent) {
    const states = await agentMemoryService.getCurriculumStates(agent.id);
    subjectState = states.find((s) => s.subject === subject) || null;
  }

  const taughtSet = new Set(subjectState?.standardsTaught || []);
  const assessedSet = new Set(subjectState?.standardsAssessed || []);
  const skippedSet = new Set(subjectState?.standardsSkipped || []);

  // Parse gap standard IDs
  const gapIds = new Set<string>();
  if (subjectState?.identifiedGaps && Array.isArray(subjectState.identifiedGaps)) {
    for (const gap of subjectState.identifiedGaps as Array<{ standardId?: string }>) {
      if (gap.standardId) gapIds.add(gap.standardId);
    }
  }

  // Parse upcoming standards from pacing guide
  const upcomingIds = new Set<string>();
  if (subjectState?.pacingGuide && typeof subjectState.pacingGuide === 'object') {
    const pg = subjectState.pacingGuide as { weeks?: Array<{ weekNumber?: number; standards?: string[] }> };
    const currentWeek = subjectState.currentWeek || 1;
    if (pg.weeks) {
      for (const week of pg.weeks) {
        if (week.weekNumber && week.weekNumber >= currentWeek && week.weekNumber <= currentWeek + 3) {
          for (const std of week.standards || []) {
            upcomingIds.add(std);
          }
        }
      }
    }
  }

  // Build status map for all standards
  const allStandardsForGrade = allStandards.map((std) => {
    const notation = std.notation || std.id;
    let status: 'complete' | 'taught_not_assessed' | 'not_taught' | 'skipped';
    if (skippedSet.has(notation)) {
      status = 'skipped';
    } else if (taughtSet.has(notation) && assessedSet.has(notation)) {
      status = 'complete';
    } else if (taughtSet.has(notation)) {
      status = 'taught_not_assessed';
    } else {
      status = 'not_taught';
    }
    return {
      notation,
      description: std.description,
      domain: std.strand,
      status,
    };
  });

  // Build suggestions prioritized by: gaps > upcoming > untaught
  const suggestions: SuggestedStandard[] = [];
  let priority = 1;

  for (const std of allStandards) {
    const notation = std.notation || std.id;

    // Skip already complete or skipped
    if (skippedSet.has(notation)) continue;
    if (taughtSet.has(notation) && assessedSet.has(notation)) continue;

    if (gapIds.has(notation)) {
      suggestions.push({
        notation,
        description: std.description,
        domain: std.strand,
        reason: 'gap',
        priority: priority++,
      });
    }
  }

  for (const std of allStandards) {
    const notation = std.notation || std.id;
    if (skippedSet.has(notation)) continue;
    if (taughtSet.has(notation) && assessedSet.has(notation)) continue;
    if (gapIds.has(notation)) continue; // Already added

    if (upcomingIds.has(notation) && !taughtSet.has(notation)) {
      suggestions.push({
        notation,
        description: std.description,
        domain: std.strand,
        reason: 'upcoming',
        priority: priority++,
      });
    }
  }

  for (const std of allStandards) {
    const notation = std.notation || std.id;
    if (skippedSet.has(notation)) continue;
    if (taughtSet.has(notation)) continue;
    if (gapIds.has(notation)) continue;
    if (upcomingIds.has(notation)) continue;

    suggestions.push({
      notation,
      description: std.description,
      domain: std.strand,
      reason: 'untaught',
      priority: priority++,
    });
  }

  return {
    standards: suggestions.slice(0, 20),
    totalAvailable: allStandards.length,
    allStandardsForGrade,
  };
}

// ============================================
// HELPERS
// ============================================

function parseGradeToNumber(gradeLevel: string): number | null {
  if (!gradeLevel) return null;
  const normalized = gradeLevel.toLowerCase().trim();

  if (normalized === 'k' || normalized === 'kindergarten') return 0;

  // Extract digits
  const match = normalized.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num >= 0 && num <= 12) return num;
  }

  return null;
}

export const standardsSuggestionService = {
  getSuggestedStandards,
};
