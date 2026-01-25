/**
 * Curriculum Services
 * Exports all curriculum-related services for content alignment and progress tracking
 */

export { curriculumService } from './curriculumService.js';
export type { StandardWithContext } from './curriculumService.js';

// Re-export cache types for consumers
export type { CachedStandard, CachedAIContext } from '../cache/standardsCache.js';
export { alignmentService } from './alignmentService.js';
export type { AlignedStandard, AlignmentResult } from './alignmentService.js';
export { progressService } from './progressService.js';
export type {
  CurriculumCoverage,
  SubjectProgress,
  ContentAlignment,
} from './progressService.js';
