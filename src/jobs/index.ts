// Job Queue Exports
export {
  initializeMemoryAggregationJob,
  shutdownMemoryAggregationJob,
  triggerMemoryAggregation,
  getMemoryAggregationStatus,
} from './memoryAggregationJob.js';

export {
  initializeExportJob,
  shutdownExportJob,
  queueExportJob,
  getExportQueueStatus,
} from './exportJob.js';

export type { ExportJobData } from './exportJob.js';

export {
  initializeDocumentAnalysisJob,
  shutdownDocumentAnalysisJob,
  queueDocumentAnalysisJob,
  getDocumentAnalysisQueueStatus,
} from './documentAnalysisJob.js';

export type { DocumentAnalysisJobData } from './documentAnalysisJob.js';

export {
  initializeWeeklyPrepJob,
  shutdownWeeklyPrepJob,
  queueWeeklyPrep,
  getWeeklyPrepQueueStatus,
} from './weeklyPrepJob.js';

export type { WeeklyPrepJobData } from './weeklyPrepJob.js';

export {
  initializeContentDripJob,
  shutdownContentDripJob,
  queueDripStep,
} from './contentDripJob.js';

export type { ContentDripJobData } from './contentDripJob.js';

export {
  scheduleContentDripDelivery,
  runScheduledContentDrips,
} from './contentDripCronJob.js';

export {
  scheduleWeeklyPrepDelivery,
  runScheduledWeeklyPreps,
} from './scheduledWeeklyPrepJob.js';

export {
  scheduleMonthlyReviewJob,
  shutdownMonthlyReviewJob,
  triggerMonthlyReviews,
} from './monthlyReviewJob.js';

export {
  initializeGradingBatchJob,
  shutdownGradingBatchJob,
  queueGradingBatchJob,
  getGradingBatchQueueStatus,
} from './gradingBatchJob.js';

export type { GradingBatchJobData } from './gradingBatchJob.js';

// Teacher Intelligence Platform
export {
  initializeStreamExtractionJob,
  shutdownStreamExtractionJob,
  queueStreamExtraction,
  getStreamExtractionQueueStatus,
} from './streamExtractionJob.js';

export type { StreamExtractionJobData } from './streamExtractionJob.js';

export {
  initializeMaterialImportJob,
  shutdownMaterialImportJob,
  queueMaterialImport,
} from './materialImportJob.js';

export type { MaterialImportJobData } from './materialImportJob.js';

// Phase 4.9: Edit Intelligence Loop
export {
  initializeEditAnalysisJob,
  shutdownEditAnalysisJob,
  queueEditAnalysis,
  getEditAnalysisQueueStatus,
} from './editAnalysisJob.js';

export type { EditAnalysisJobData } from './editAnalysisJob.js';

// Intelligence Platform Cron Jobs
export {
  scheduleNudgeGenerationJob,
  shutdownNudgeGenerationJob,
  triggerNudgeGeneration,
} from './nudgeGenerationJob.js';

export {
  schedulePreferenceUpdateJob,
  shutdownPreferenceUpdateJob,
  triggerPreferenceUpdate,
} from './preferenceUpdateJob.js';

// Canvas Material Generation
export {
  initializeCanvasGenerationJob,
  shutdownCanvasGenerationJob,
  queueCanvasGeneration,
} from './canvasGenerationJob.js';

export type { CanvasGenerationJobData } from './canvasGenerationJob.js';

// Completions Eligibility Cron (2 AM UTC daily)
export {
  scheduleCompletionsEligibilityJob,
  shutdownCompletionsEligibilityJob,
  triggerCompletionsEligibility,
} from './completionsEligibilityJob.js';

// Phase 2: Streak & Digest Cron Jobs
export {
  scheduleStreakResetJob,
  shutdownStreakResetJob,
  triggerStreakReset,
} from './streakResetJob.js';

export {
  scheduleWeeklyDigestJob,
  shutdownWeeklyDigestJob,
  triggerWeeklyDigest,
} from './weeklyDigestJob.js';
