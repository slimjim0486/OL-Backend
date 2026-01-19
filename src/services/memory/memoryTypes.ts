// Ollie's Memory - TypeScript Interfaces
// Types for personalized learning companion experience

import { AgeGroup, Subject } from '@prisma/client';

// ============================================
// GREETING TYPES
// ============================================

export type GreetingTemplateType =
  | 'streak_continuation'    // Active streak > 2 days
  | 'return_after_break'     // 2-7 days since last session
  | 'return_after_long_break' // 7+ days since last session
  | 'same_day_return'        // Second+ session same day
  | 'morning_session'        // Session before 12 PM
  | 'optimal_time'           // Session during detected optimal time
  | 'milestone_approaching'  // Close to level-up, badge, or streak milestone
  | 'after_tough_session'    // Previous session had low accuracy
  | 'default';               // Fallback when no context available

export interface GreetingContext {
  displayName: string;
  streakCount: number;
  daysSinceLastSession: number | null;
  lastTopic: string | null;
  lastSubject: string | null;
  preferredTimeOfDay: string | null;
  currentHour: number;
  isActiveToday: boolean;
  sessionsToday: number;
  recentStruggles: RecentStruggle[];
  upcomingMilestones: UpcomingMilestone | null;
  ageGroup: AgeGroup;
}

export interface PersonalizedGreeting {
  templateType: GreetingTemplateType;
  greeting: string;
  suggestions: string[];
}

// ============================================
// ENCOURAGEMENT TYPES
// ============================================

export type EncouragementType =
  | 'correct_standard'       // Regular correct answer
  | 'correct_with_callback'  // Correct on previously struggled topic
  | 'correct_streak'         // 5+ correct in a row
  | 'wrong_first_attempt'    // First wrong attempt
  | 'wrong_persistence'      // 2+ wrong but high persistence
  | 'wrong_after_success'    // Wrong but has overcome struggles before
  | 'quiz_improvement'       // Quiz score improved from previous
  | 'quiz_below_expectations' // Score < 70% but has growth history
  | 'lesson_complete'        // Standard lesson completion
  | 'lesson_persistence';    // Completed lesson on struggled topic

export interface EncouragementContext {
  displayName: string;
  outcome: 'correct' | 'incorrect' | 'complete';
  attemptNumber: number;
  correctInSession: number;
  currentTopic: string | null;
  currentSubject: Subject | null;
  recentStruggles: RecentStruggle[];
  masteredTopics: string[];
  previousQuizScore: number | null;
  currentScore: number | null;
  persistenceScore: number;
  totalLessonsCompleted: number;
  ageGroup: AgeGroup;
}

export interface PersonalizedEncouragement {
  type: EncouragementType;
  message: string;
  hint?: string;
}

// ============================================
// MEMORY DATA STRUCTURES
// ============================================

export interface WeeklyPatterns {
  bestTimeOfDay: string | null;     // "16:00" format
  avgSessionMinutes: number;
  topSubjects: string[];            // ["MATH", "SCIENCE"]
  preferredActivityType: string | null; // "quiz", "flashcard", "lesson"
  averageAccuracy: number;          // 0-1
  mostActiveDay: string | null;     // "Monday", "Tuesday", etc.
}

export interface RecentStruggle {
  topic: string;
  subject: string;
  attempts: number;
  correctRate: number;              // 0-1
  lastAttempt: Date;
}

export interface RecentWin {
  achievement: string;
  date: Date;
  context: string;
  type: 'badge' | 'streak' | 'quiz_perfect' | 'topic_mastered' | 'breakthrough';
}

export interface MemorableMoment {
  type: 'breakthrough' | 'milestone' | 'celebration' | 'persistence';
  topic: string | null;
  subject: string | null;
  description: string;
  date: Date;
  xpEarned?: number;
}

export interface UpcomingMilestone {
  type: 'level' | 'badge' | 'streak';
  name: string;
  current: number;
  target: number;
  description: string;
}

// ============================================
// MEMORY CONTEXT (for AI prompts)
// ============================================

export interface OllieMemoryContext {
  // Identity
  displayName: string;
  ageGroup: AgeGroup;

  // Session context
  lastSessionAt: Date | null;
  daysSinceLastSession: number | null;
  lastTopic: string | null;
  lastSubject: string | null;
  sessionsToday: number;

  // Streak info
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;

  // Patterns
  weeklyPatterns: WeeklyPatterns | null;
  preferredTimeOfDay: string | null;
  preferredSessionLength: number | null;

  // Performance context
  recentStruggles: RecentStruggle[];
  recentWins: RecentWin[];
  strongestSubjects: string[];
  growthAreas: string[];
  persistenceScore: number;

  // Cumulative stats
  totalLessonsCompleted: number;
  totalCorrectAnswers: number;
  totalQuestionsAttempted: number;

  // Milestones
  upcomingMilestones: UpcomingMilestone | null;

  // Memorable moments (for callbacks)
  memorableMoments: MemorableMoment[];
}

// ============================================
// SESSION MEMORY (Redis - short-term)
// ============================================

export interface SessionMemory {
  childId: string;
  sessionId: string;
  startedAt: Date;

  // Session-specific tracking
  correctAnswersInSession: number;
  wrongAnswersInSession: number;
  topicsVisited: string[];
  lessonsStarted: string[];
  lessonsCompleted: string[];
  quizzesCompleted: string[];

  // Emotional tracking
  strugglesMoments: number;        // Times child got multiple wrong
  celebrationMoments: number;      // Perfect scores, streaks

  // Last interaction
  lastActivityType: 'chat' | 'exercise' | 'quiz' | 'flashcard' | 'lesson' | null;
  lastActivityAt: Date | null;
}

// ============================================
// PARENT SUMMARY TYPES
// ============================================

export interface ParentSummaryData {
  childId: string;
  parentId: string;
  childName: string;
  periodStart: Date;
  periodEnd: Date;

  // The headline (one compelling sentence)
  headline: string;

  // What I noticed section
  insights: {
    bestLearningTime: string;
    learningStyle: string;
    persistenceDescription: string;
    persistenceScore: number;
  };

  // Celebration moments
  celebrations: {
    type: 'badge' | 'streak' | 'mastery' | 'behavior';
    description: string;
    date: Date;
  }[];

  // Focus areas
  focusAreas: {
    subject: string;
    reason: string;
    suggestion: string;
  }[];

  // Parent action item
  parentAction: string;

  // Coming up
  upcomingGoals: {
    type: 'badge' | 'level' | 'streak' | 'topic';
    name: string;
    progress: string;
  }[];

  // Stats
  stats: {
    lessonsCompleted: number;
    questionsAnswered: number;
    averageAccuracy: number;
    timeSpentMinutes: number;
    daysActive: number;
  };
}

export interface TranslatedSummary {
  headline: string;
  insights: {
    bestLearningTime: string;
    learningStyle: string;
    persistenceDescription: string;
  };
  celebrations: { description: string }[];
  focusAreas: { reason: string; suggestion: string }[];
  parentAction: string;
  upcomingGoals: { name: string; progress: string }[];
}

// ============================================
// SERVICE INTERFACES
// ============================================

export interface MemoryUpdatePayload {
  // Session updates
  sessionStarted?: boolean;
  lessonCompleted?: { lessonId: string; topic: string; subject: string };
  quizCompleted?: { quizId: string; score: number; topic: string };
  exerciseAttempt?: { correct: boolean; topic: string; subject: string };

  // Achievement updates
  badgeEarned?: { code: string; name: string };
  levelUp?: { newLevel: number };
  streakMilestone?: { days: number };
}

export interface AggregationResult {
  weeklyPatterns: WeeklyPatterns;
  recentStruggles: RecentStruggle[];
  recentWins: RecentWin[];
  upcomingMilestones: UpcomingMilestone | null;
  strongestSubjects: string[];
  growthAreas: string[];
  persistenceScore: number;
}

// ============================================
// GREETING TEMPLATES
// ============================================

export interface GreetingTemplate {
  type: GreetingTemplateType;
  templates: {
    young: string[];  // For YOUNG age group (4-7)
    older: string[];  // For OLDER age group (8-12)
  };
  // Variables available: {displayName}, {streakCount}, {daysSince}, {lastTopic}, {time}, {count}, {thing}, {milestone}, {topic}, {enthusiasticPhrase}
}

// ============================================
// ENCOURAGEMENT TEMPLATES
// ============================================

export interface EncouragementTemplate {
  type: EncouragementType;
  templates: {
    young: string[];  // For YOUNG age group (4-7)
    older: string[];  // For OLDER age group (8-12)
  };
  // Variables available: {displayName}, {correctInARow}, {struggledTopic}, {masteredTopic}, {score}, {improvement}, {firstScore}, {totalLessons}, {topic}
}

// ============================================
// CONSTANTS
// ============================================

export const MEMORY_CONSTANTS = {
  // Struggle thresholds
  STRUGGLE_ACCURACY_THRESHOLD: 0.6,    // Below 60% = struggling
  STRUGGLE_MIN_ATTEMPTS: 3,            // Minimum attempts to track
  STRUGGLE_ROLLING_WINDOW_DAYS: 14,    // 2 weeks rolling window

  // Win thresholds
  WIN_ACCURACY_THRESHOLD: 0.9,         // Above 90% = mastered
  WIN_STREAK_THRESHOLD: 5,             // 5 in a row = celebration

  // Memory limits
  MAX_STRUGGLES: 10,
  MAX_WINS: 10,
  MAX_MEMORABLE_MOMENTS: 50,
  MAX_GREETING_HISTORY: 5,

  // Session timeouts
  SESSION_TTL_HOURS: 24,               // Redis session TTL

  // Aggregation
  AGGREGATION_DAY: 0,                  // Sunday = 0
  AGGREGATION_HOUR: 2,                 // 2 AM UTC

  // Parent summary
  PARENT_SUMMARY_DAY: 0,               // Sunday
  PARENT_SUMMARY_HOUR: 18,             // 6 PM parent's timezone
} as const;
