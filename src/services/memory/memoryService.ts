// Ollie's Memory Service
// Core service for personalized learning companion experience

import { prisma } from '../../config/database.js';
import { redis } from '../../config/redis.js';
import { logger } from '../../utils/logger.js';
import { AgeGroup, Subject, OllieMemory } from '@prisma/client';
import { streakService } from '../gamification/streakService.js';
import {
  OllieMemoryContext,
  SessionMemory,
  WeeklyPatterns,
  RecentStruggle,
  RecentWin,
  MemorableMoment,
  UpcomingMilestone,
  MemoryUpdatePayload,
  AggregationResult,
  MEMORY_CONSTANTS,
} from './memoryTypes.js';

// Redis key prefixes
const REDIS_PREFIX = {
  SESSION: 'ollie:session:',
  SESSIONS_TODAY: 'ollie:sessions_today:',
};

export const memoryService = {
  // ============================================
  // MEMORY CONTEXT RETRIEVAL
  // ============================================

  /**
   * Get full memory context for a child (for AI prompts and greetings)
   */
  async getMemoryContext(childId: string): Promise<OllieMemoryContext> {
    try {
      // Fetch child with memory
      const child = await prisma.child.findUnique({
        where: { id: childId },
        include: {
          ollieMemory: true,
          streak: true,
          progress: true,
        },
      });

      if (!child) {
        throw new Error(`Child not found: ${childId}`);
      }

      const memory = child.ollieMemory;
      const streak = child.streak;

      // Get streak info
      const streakInfo = await streakService.getStreakInfo(childId);

      // Calculate days since last session
      let daysSinceLastSession: number | null = null;
      if (memory?.lastSessionAt) {
        const now = new Date();
        const lastSession = new Date(memory.lastSessionAt);
        daysSinceLastSession = Math.floor(
          (now.getTime() - lastSession.getTime()) / (24 * 60 * 60 * 1000)
        );
      }

      // Get sessions today count from Redis
      const sessionsToday = await this.getSessionsToday(childId);

      // Parse JSON fields safely
      const weeklyPatterns = this.parseJsonField<WeeklyPatterns>(memory?.weeklyPatterns);
      const recentStruggles = this.parseJsonField<RecentStruggle[]>(memory?.recentStruggles) || [];
      const recentWins = this.parseJsonField<RecentWin[]>(memory?.recentWins) || [];
      const memorableMoments = this.parseJsonField<MemorableMoment[]>(memory?.memorableMoments) || [];
      const upcomingMilestones = this.parseJsonField<UpcomingMilestone>(memory?.upcomingMilestones);

      return {
        displayName: child.displayName,
        ageGroup: child.ageGroup,
        lastSessionAt: memory?.lastSessionAt || null,
        daysSinceLastSession,
        lastTopic: memory?.lastTopic || null,
        lastSubject: memory?.lastSubject || null,
        sessionsToday,
        currentStreak: streakInfo.current,
        longestStreak: streakInfo.longest,
        isActiveToday: streakInfo.isActiveToday,
        weeklyPatterns,
        preferredTimeOfDay: memory?.preferredTimeOfDay || null,
        preferredSessionLength: memory?.preferredSessionLength || null,
        recentStruggles,
        recentWins,
        strongestSubjects: memory?.strongestSubjects || [],
        growthAreas: memory?.growthAreas || [],
        persistenceScore: memory?.persistenceScore || 0.5,
        totalLessonsCompleted: memory?.totalLessonsCompleted || 0,
        totalCorrectAnswers: memory?.totalCorrectAnswers || 0,
        totalQuestionsAttempted: memory?.totalQuestionsAttempted || 0,
        upcomingMilestones,
        memorableMoments: memorableMoments.slice(0, 10), // Only include recent for context
      };
    } catch (error) {
      logger.error('Error getting memory context', { childId, error });
      // Return minimal context on error
      return this.getDefaultMemoryContext(childId);
    }
  },

  /**
   * Get default memory context when child has no memory or error occurs
   */
  async getDefaultMemoryContext(childId: string): Promise<OllieMemoryContext> {
    const child = await prisma.child.findUnique({
      where: { id: childId },
      select: { displayName: true, ageGroup: true },
    });

    return {
      displayName: child?.displayName || 'Friend',
      ageGroup: child?.ageGroup || 'OLDER',
      lastSessionAt: null,
      daysSinceLastSession: null,
      lastTopic: null,
      lastSubject: null,
      sessionsToday: 0,
      currentStreak: 0,
      longestStreak: 0,
      isActiveToday: false,
      weeklyPatterns: null,
      preferredTimeOfDay: null,
      preferredSessionLength: null,
      recentStruggles: [],
      recentWins: [],
      strongestSubjects: [],
      growthAreas: [],
      persistenceScore: 0.5,
      totalLessonsCompleted: 0,
      totalCorrectAnswers: 0,
      totalQuestionsAttempted: 0,
      upcomingMilestones: null,
      memorableMoments: [],
    };
  },

  // ============================================
  // SESSION MEMORY (Redis)
  // ============================================

  /**
   * Get or create session memory
   */
  async getSessionMemory(childId: string): Promise<SessionMemory | null> {
    try {
      const key = `${REDIS_PREFIX.SESSION}${childId}`;
      const data = await redis.get(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      logger.error('Error getting session memory', { childId, error });
      return null;
    }
  },

  /**
   * Create new session memory
   */
  async createSessionMemory(childId: string): Promise<SessionMemory> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: SessionMemory = {
      childId,
      sessionId,
      startedAt: new Date(),
      correctAnswersInSession: 0,
      wrongAnswersInSession: 0,
      topicsVisited: [],
      lessonsStarted: [],
      lessonsCompleted: [],
      quizzesCompleted: [],
      strugglesMoments: 0,
      celebrationMoments: 0,
      lastActivityType: null,
      lastActivityAt: null,
    };

    try {
      const key = `${REDIS_PREFIX.SESSION}${childId}`;
      await redis.setex(key, MEMORY_CONSTANTS.SESSION_TTL_HOURS * 3600, JSON.stringify(session));

      // Increment sessions today counter
      await this.incrementSessionsToday(childId);

      return session;
    } catch (error) {
      logger.error('Error creating session memory', { childId, error });
      return session;
    }
  },

  /**
   * Update session memory
   */
  async updateSessionMemory(
    childId: string,
    updates: Partial<SessionMemory>
  ): Promise<void> {
    try {
      const current = await this.getSessionMemory(childId);
      if (!current) {
        logger.warn('No session memory to update', { childId });
        return;
      }

      const updated = { ...current, ...updates };
      const key = `${REDIS_PREFIX.SESSION}${childId}`;
      await redis.setex(key, MEMORY_CONSTANTS.SESSION_TTL_HOURS * 3600, JSON.stringify(updated));
    } catch (error) {
      logger.error('Error updating session memory', { childId, error });
    }
  },

  /**
   * Record correct/wrong answer in session
   */
  async recordAnswerInSession(
    childId: string,
    isCorrect: boolean,
    topic?: string
  ): Promise<{ correctInSession: number; wrongInSession: number }> {
    let session = await this.getSessionMemory(childId);
    if (!session) {
      session = await this.createSessionMemory(childId);
    }

    if (isCorrect) {
      session.correctAnswersInSession++;
    } else {
      session.wrongAnswersInSession++;
      // Track consecutive wrong answers as struggle moments
      if (session.wrongAnswersInSession >= 3 && session.wrongAnswersInSession % 3 === 0) {
        session.strugglesMoments++;
      }
    }

    // Track topic if provided
    if (topic && !session.topicsVisited.includes(topic)) {
      session.topicsVisited.push(topic);
    }

    session.lastActivityType = 'exercise';
    session.lastActivityAt = new Date();

    await this.updateSessionMemory(childId, session);

    return {
      correctInSession: session.correctAnswersInSession,
      wrongInSession: session.wrongAnswersInSession,
    };
  },

  /**
   * Get sessions today count
   */
  async getSessionsToday(childId: string): Promise<number> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const key = `${REDIS_PREFIX.SESSIONS_TODAY}${childId}:${today}`;
      const count = await redis.get(key);
      return parseInt(count || '0', 10);
    } catch (error) {
      return 0;
    }
  },

  /**
   * Increment sessions today counter
   */
  async incrementSessionsToday(childId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const key = `${REDIS_PREFIX.SESSIONS_TODAY}${childId}:${today}`;
      await redis.incr(key);
      // Set expiry to end of day + some buffer
      await redis.expire(key, 48 * 3600);
    } catch (error) {
      logger.error('Error incrementing sessions today', { childId, error });
    }
  },

  // ============================================
  // PERSISTENT MEMORY UPDATES
  // ============================================

  /**
   * Record session start and update memory
   */
  async recordSessionStart(
    childId: string,
    topic?: string,
    subject?: string,
    lessonId?: string
  ): Promise<void> {
    try {
      const now = new Date();

      await prisma.ollieMemory.upsert({
        where: { childId },
        create: {
          childId,
          lastSessionAt: now,
          lastTopic: topic || null,
          lastSubject: subject || null,
          lastLessonId: lessonId || null,
        },
        update: {
          lastSessionAt: now,
          lastTopic: topic || undefined,
          lastSubject: subject || undefined,
          lastLessonId: lessonId || undefined,
        },
      });

      // Create session memory in Redis
      await this.createSessionMemory(childId);

      logger.info('Session start recorded', { childId, topic, subject });
    } catch (error) {
      logger.error('Error recording session start', { childId, error });
    }
  },

  /**
   * Update memory with lesson completion
   */
  async recordLessonCompletion(
    childId: string,
    lessonId: string,
    topic: string,
    subject: string
  ): Promise<void> {
    try {
      const memory = await this.getOrCreateMemory(childId);

      // Update lesson count and last context
      await prisma.ollieMemory.update({
        where: { childId },
        data: {
          totalLessonsCompleted: memory.totalLessonsCompleted + 1,
          lastTopic: topic,
          lastSubject: subject,
          lastLessonId: lessonId,
          lastSessionAt: new Date(),
        },
      });

      // Update session memory
      const session = await this.getSessionMemory(childId);
      if (session) {
        if (!session.lessonsCompleted.includes(lessonId)) {
          session.lessonsCompleted.push(lessonId);
        }
        session.lastActivityType = 'lesson';
        session.lastActivityAt = new Date();
        await this.updateSessionMemory(childId, session);
      }

      logger.info('Lesson completion recorded', { childId, lessonId });
    } catch (error) {
      logger.error('Error recording lesson completion', { childId, error });
    }
  },

  /**
   * Update memory with exercise attempt
   */
  async recordExerciseAttempt(
    childId: string,
    isCorrect: boolean,
    topic: string,
    subject: string
  ): Promise<void> {
    try {
      const memory = await this.getOrCreateMemory(childId);

      // Update cumulative stats
      await prisma.ollieMemory.update({
        where: { childId },
        data: {
          totalQuestionsAttempted: memory.totalQuestionsAttempted + 1,
          totalCorrectAnswers: isCorrect
            ? memory.totalCorrectAnswers + 1
            : memory.totalCorrectAnswers,
          lastTopic: topic,
          lastSubject: subject,
          lastSessionAt: new Date(),
        },
      });

      // Update session memory
      await this.recordAnswerInSession(childId, isCorrect, topic);

      // Update struggles/wins tracking
      await this.updateStruggleTracking(childId, isCorrect, topic, subject);

      logger.debug('Exercise attempt recorded', { childId, isCorrect, topic });
    } catch (error) {
      logger.error('Error recording exercise attempt', { childId, error });
    }
  },

  /**
   * Track struggles and wins based on exercise attempts
   */
  async updateStruggleTracking(
    childId: string,
    isCorrect: boolean,
    topic: string,
    subject: string
  ): Promise<void> {
    try {
      const memory = await this.getOrCreateMemory(childId);
      let recentStruggles = this.parseJsonField<RecentStruggle[]>(memory.recentStruggles) || [];

      // Find existing struggle for this topic
      const existingIndex = recentStruggles.findIndex(
        s => s.topic === topic && s.subject === subject
      );

      if (existingIndex >= 0) {
        // Update existing struggle
        const struggle = recentStruggles[existingIndex];
        struggle.attempts++;
        struggle.correctRate =
          ((struggle.correctRate * (struggle.attempts - 1)) + (isCorrect ? 1 : 0)) / struggle.attempts;
        struggle.lastAttempt = new Date();

        // If accuracy improved above threshold, move to wins
        if (struggle.correctRate >= MEMORY_CONSTANTS.WIN_ACCURACY_THRESHOLD && struggle.attempts >= 5) {
          recentStruggles.splice(existingIndex, 1);
          await this.recordWin(childId, `Mastered ${topic}`, `Improved to ${Math.round(struggle.correctRate * 100)}% accuracy`);
        }
      } else if (!isCorrect) {
        // New struggle
        recentStruggles.push({
          topic,
          subject,
          attempts: 1,
          correctRate: 0,
          lastAttempt: new Date(),
        });
      }

      // Keep only recent struggles (max limit)
      recentStruggles = recentStruggles
        .sort((a, b) => new Date(b.lastAttempt).getTime() - new Date(a.lastAttempt).getTime())
        .slice(0, MEMORY_CONSTANTS.MAX_STRUGGLES);

      await prisma.ollieMemory.update({
        where: { childId },
        data: {
          recentStruggles: recentStruggles as any,
        },
      });
    } catch (error) {
      logger.error('Error updating struggle tracking', { childId, error });
    }
  },

  /**
   * Record a win/achievement
   */
  async recordWin(
    childId: string,
    achievement: string,
    context: string,
    type: RecentWin['type'] = 'topic_mastered'
  ): Promise<void> {
    try {
      const memory = await this.getOrCreateMemory(childId);
      let recentWins = this.parseJsonField<RecentWin[]>(memory.recentWins) || [];

      recentWins.unshift({
        achievement,
        date: new Date(),
        context,
        type,
      });

      // Keep only recent wins
      recentWins = recentWins.slice(0, MEMORY_CONSTANTS.MAX_WINS);

      await prisma.ollieMemory.update({
        where: { childId },
        data: {
          recentWins: recentWins as any,
        },
      });

      logger.info('Win recorded', { childId, achievement });
    } catch (error) {
      logger.error('Error recording win', { childId, error });
    }
  },

  /**
   * Record a memorable moment
   */
  async recordMemorableMoment(
    childId: string,
    moment: Omit<MemorableMoment, 'date'>
  ): Promise<void> {
    try {
      const memory = await this.getOrCreateMemory(childId);
      let moments = this.parseJsonField<MemorableMoment[]>(memory.memorableMoments) || [];

      moments.unshift({
        ...moment,
        date: new Date(),
      });

      // Keep only up to max limit
      moments = moments.slice(0, MEMORY_CONSTANTS.MAX_MEMORABLE_MOMENTS);

      await prisma.ollieMemory.update({
        where: { childId },
        data: {
          memorableMoments: moments as any,
        },
      });

      logger.info('Memorable moment recorded', { childId, type: moment.type });
    } catch (error) {
      logger.error('Error recording memorable moment', { childId, error });
    }
  },

  /**
   * Update greeting history
   */
  async recordGreetingUsed(childId: string, templateType: string): Promise<void> {
    try {
      const memory = await this.getOrCreateMemory(childId);
      let history = this.parseJsonField<string[]>(memory.recentGreetingTemplates) || [];

      // Add to front, remove duplicates
      history = [templateType, ...history.filter(t => t !== templateType)];
      history = history.slice(0, MEMORY_CONSTANTS.MAX_GREETING_HISTORY);

      await prisma.ollieMemory.update({
        where: { childId },
        data: {
          recentGreetingTemplates: history as any,
        },
      });
    } catch (error) {
      logger.error('Error recording greeting used', { childId, error });
    }
  },

  /**
   * Get recently used greeting templates
   */
  async getRecentGreetings(childId: string): Promise<string[]> {
    try {
      const memory = await prisma.ollieMemory.findUnique({
        where: { childId },
        select: { recentGreetingTemplates: true },
      });
      return this.parseJsonField<string[]>(memory?.recentGreetingTemplates) || [];
    } catch (error) {
      return [];
    }
  },

  // ============================================
  // WEEKLY AGGREGATION
  // ============================================

  /**
   * Aggregate weekly patterns for a child
   */
  async aggregateWeeklyPatterns(childId: string): Promise<AggregationResult | null> {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Get activity sessions from the past week
      const sessions = await prisma.activitySession.findMany({
        where: {
          childId,
          startedAt: { gte: oneWeekAgo },
        },
        orderBy: { startedAt: 'desc' },
      });

      // Get exercise attempts from the past week
      const exerciseAttempts = await prisma.exerciseAttempt.findMany({
        where: {
          childId,
          createdAt: { gte: oneWeekAgo },
        },
        include: {
          exercise: {
            include: {
              lesson: {
                select: { subject: true },
              },
            },
          },
        },
      });

      // Get quiz attempts from the past week
      const quizAttempts = await prisma.quizAttempt.findMany({
        where: {
          quiz: {
            lesson: {
              childId,
            },
          },
          completedAt: { gte: oneWeekAgo },
        },
      });

      // Calculate patterns
      const weeklyPatterns = this.calculateWeeklyPatterns(sessions, exerciseAttempts);

      // Calculate struggles and wins
      const { recentStruggles, recentWins } = this.calculateStrugglesAndWins(exerciseAttempts);

      // Calculate subject strengths
      const { strongestSubjects, growthAreas } = this.calculateSubjectStrengths(exerciseAttempts);

      // Calculate persistence score
      const persistenceScore = this.calculatePersistenceScore(exerciseAttempts);

      // Get upcoming milestones
      const upcomingMilestones = await this.calculateUpcomingMilestones(childId);

      const result: AggregationResult = {
        weeklyPatterns,
        recentStruggles,
        recentWins,
        upcomingMilestones,
        strongestSubjects,
        growthAreas,
        persistenceScore,
      };

      // Save to database
      await prisma.ollieMemory.upsert({
        where: { childId },
        create: {
          childId,
          weeklyPatterns: weeklyPatterns as any,
          recentStruggles: recentStruggles as any,
          recentWins: recentWins as any,
          upcomingMilestones: upcomingMilestones as any,
          strongestSubjects,
          growthAreas,
          persistenceScore,
          lastWeeklyUpdate: new Date(),
        },
        update: {
          weeklyPatterns: weeklyPatterns as any,
          recentStruggles: recentStruggles as any,
          recentWins: recentWins as any,
          upcomingMilestones: upcomingMilestones as any,
          strongestSubjects,
          growthAreas,
          persistenceScore,
          lastWeeklyUpdate: new Date(),
        },
      });

      logger.info('Weekly patterns aggregated', { childId });
      return result;
    } catch (error) {
      logger.error('Error aggregating weekly patterns', { childId, error });
      return null;
    }
  },

  /**
   * Calculate weekly patterns from sessions
   */
  calculateWeeklyPatterns(
    sessions: any[],
    exerciseAttempts: any[]
  ): WeeklyPatterns {
    // Calculate best time of day
    const hourCounts: Record<number, { count: number; accuracy: number }> = {};
    sessions.forEach(s => {
      const hour = new Date(s.startedAt).getHours();
      if (!hourCounts[hour]) {
        hourCounts[hour] = { count: 0, accuracy: 0 };
      }
      hourCounts[hour].count++;
    });

    let bestHour = 16; // Default to 4 PM
    let maxCount = 0;
    Object.entries(hourCounts).forEach(([hour, data]) => {
      if (data.count > maxCount) {
        maxCount = data.count;
        bestHour = parseInt(hour);
      }
    });

    // Calculate average session duration
    const avgSessionMinutes = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) / sessions.length
      : 0;

    // Calculate top subjects
    const subjectCounts: Record<string, number> = {};
    exerciseAttempts.forEach(a => {
      const subject = a.exercise?.lesson?.subject;
      if (subject) {
        subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
      }
    });
    const topSubjects = Object.entries(subjectCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([subject]) => subject);

    // Calculate average accuracy
    const correctCount = exerciseAttempts.filter(a => a.isCorrect).length;
    const averageAccuracy = exerciseAttempts.length > 0
      ? correctCount / exerciseAttempts.length
      : 0;

    // Calculate most active day
    const dayCounts: Record<string, number> = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    sessions.forEach(s => {
      const day = days[new Date(s.startedAt).getDay()];
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    let mostActiveDay = 'Monday';
    let maxDayCount = 0;
    Object.entries(dayCounts).forEach(([day, count]) => {
      if (count > maxDayCount) {
        maxDayCount = count;
        mostActiveDay = day;
      }
    });

    return {
      bestTimeOfDay: `${bestHour.toString().padStart(2, '0')}:00`,
      avgSessionMinutes: Math.round(avgSessionMinutes),
      topSubjects,
      preferredActivityType: null, // Could be calculated from activity breakdown
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      mostActiveDay,
    };
  },

  /**
   * Calculate struggles and wins from exercise attempts
   */
  calculateStrugglesAndWins(exerciseAttempts: any[]): {
    recentStruggles: RecentStruggle[];
    recentWins: RecentWin[];
  } {
    // Group by topic
    const topicStats: Record<string, { correct: number; total: number; subject: string; lastAttempt: Date }> = {};

    exerciseAttempts.forEach(a => {
      const topic = a.exercise?.contextText?.substring(0, 50) || 'General';
      const subject = a.exercise?.lesson?.subject || 'OTHER';

      if (!topicStats[topic]) {
        topicStats[topic] = { correct: 0, total: 0, subject, lastAttempt: new Date(a.createdAt) };
      }
      topicStats[topic].total++;
      if (a.isCorrect) topicStats[topic].correct++;
      if (new Date(a.createdAt) > topicStats[topic].lastAttempt) {
        topicStats[topic].lastAttempt = new Date(a.createdAt);
      }
    });

    const recentStruggles: RecentStruggle[] = [];
    const recentWins: RecentWin[] = [];

    Object.entries(topicStats).forEach(([topic, stats]) => {
      const correctRate = stats.total > 0 ? stats.correct / stats.total : 0;

      if (stats.total >= MEMORY_CONSTANTS.STRUGGLE_MIN_ATTEMPTS) {
        if (correctRate < MEMORY_CONSTANTS.STRUGGLE_ACCURACY_THRESHOLD) {
          recentStruggles.push({
            topic,
            subject: stats.subject,
            attempts: stats.total,
            correctRate,
            lastAttempt: stats.lastAttempt,
          });
        } else if (correctRate >= MEMORY_CONSTANTS.WIN_ACCURACY_THRESHOLD) {
          recentWins.push({
            achievement: `Mastered ${topic}`,
            date: stats.lastAttempt,
            context: `${Math.round(correctRate * 100)}% accuracy`,
            type: 'topic_mastered',
          });
        }
      }
    });

    return {
      recentStruggles: recentStruggles.slice(0, MEMORY_CONSTANTS.MAX_STRUGGLES),
      recentWins: recentWins.slice(0, MEMORY_CONSTANTS.MAX_WINS),
    };
  },

  /**
   * Calculate subject strengths and growth areas
   */
  calculateSubjectStrengths(exerciseAttempts: any[]): {
    strongestSubjects: string[];
    growthAreas: string[];
  } {
    const subjectStats: Record<string, { correct: number; total: number }> = {};

    exerciseAttempts.forEach(a => {
      const subject = a.exercise?.lesson?.subject || 'OTHER';
      if (!subjectStats[subject]) {
        subjectStats[subject] = { correct: 0, total: 0 };
      }
      subjectStats[subject].total++;
      if (a.isCorrect) subjectStats[subject].correct++;
    });

    const subjectAccuracies = Object.entries(subjectStats)
      .filter(([_, stats]) => stats.total >= 5)
      .map(([subject, stats]) => ({
        subject,
        accuracy: stats.correct / stats.total,
      }))
      .sort((a, b) => b.accuracy - a.accuracy);

    const strongestSubjects = subjectAccuracies
      .filter(s => s.accuracy >= 0.7)
      .slice(0, 3)
      .map(s => s.subject);

    const growthAreas = subjectAccuracies
      .filter(s => s.accuracy < 0.6)
      .slice(0, 3)
      .map(s => s.subject);

    return { strongestSubjects, growthAreas };
  },

  /**
   * Calculate persistence score based on retry behavior
   */
  calculatePersistenceScore(exerciseAttempts: any[]): number {
    if (exerciseAttempts.length === 0) return 0.5;

    // Group by exercise to see retry behavior
    const exerciseGroups: Record<string, any[]> = {};
    exerciseAttempts.forEach(a => {
      const exerciseId = a.exerciseId;
      if (!exerciseGroups[exerciseId]) {
        exerciseGroups[exerciseId] = [];
      }
      exerciseGroups[exerciseId].push(a);
    });

    // Calculate metrics
    let retriedExercises = 0;
    let successAfterFailure = 0;
    let totalExercises = Object.keys(exerciseGroups).length;

    Object.values(exerciseGroups).forEach(attempts => {
      if (attempts.length > 1) {
        retriedExercises++;
        // Check if later attempt was successful
        const hasSuccess = attempts.some((a, i) => i > 0 && a.isCorrect);
        if (hasSuccess) successAfterFailure++;
      }
    });

    // Score: weighted combination of retry rate and success after failure
    const retryRate = totalExercises > 0 ? retriedExercises / totalExercises : 0;
    const recoveryRate = retriedExercises > 0 ? successAfterFailure / retriedExercises : 0;

    const score = (retryRate * 0.4) + (recoveryRate * 0.6);
    return Math.min(1, Math.max(0, score));
  },

  /**
   * Calculate upcoming milestones for a child
   */
  async calculateUpcomingMilestones(childId: string): Promise<UpcomingMilestone | null> {
    try {
      // Get child's progress
      const progress = await prisma.userProgress.findUnique({
        where: { childId },
      });

      // Get streak
      const streak = await streakService.getStreakInfo(childId);

      // Get badges
      const earnedBadges = await prisma.earnedBadge.findMany({
        where: { childId },
        select: { badgeId: true },
      });
      const earnedBadgeIds = new Set(earnedBadges.map(b => b.badgeId));

      // Find next badge
      const nextBadge = await prisma.badge.findFirst({
        where: {
          id: { notIn: Array.from(earnedBadgeIds) },
        },
        orderBy: { xpReward: 'asc' },
      });

      // Calculate which milestone is closest
      const milestones: UpcomingMilestone[] = [];

      // Level milestone
      if (progress) {
        const xpForNextLevel = progress.level * 100; // Simplified XP calculation
        const xpNeeded = xpForNextLevel - progress.currentXP;
        if (xpNeeded > 0 && xpNeeded <= 150) {
          milestones.push({
            type: 'level',
            name: `Level ${progress.level + 1}`,
            current: progress.currentXP,
            target: xpForNextLevel,
            description: `${xpNeeded} XP to level up!`,
          });
        }
      }

      // Streak milestone
      const nextStreakMilestone = [3, 7, 14, 30, 60, 100].find(m => m > streak.current);
      if (nextStreakMilestone && nextStreakMilestone - streak.current <= 3) {
        milestones.push({
          type: 'streak',
          name: `${nextStreakMilestone}-Day Streak`,
          current: streak.current,
          target: nextStreakMilestone,
          description: `${nextStreakMilestone - streak.current} more day${nextStreakMilestone - streak.current > 1 ? 's' : ''} to go!`,
        });
      }

      // Badge milestone
      if (nextBadge) {
        milestones.push({
          type: 'badge',
          name: nextBadge.name,
          current: 0,
          target: 1,
          description: nextBadge.description,
        });
      }

      // Return the closest milestone (prefer streak and level over badge)
      return milestones.sort((a, b) => {
        const priority = { streak: 1, level: 2, badge: 3 };
        return priority[a.type] - priority[b.type];
      })[0] || null;
    } catch (error) {
      logger.error('Error calculating upcoming milestones', { childId, error });
      return null;
    }
  },

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Get or create memory for a child
   */
  async getOrCreateMemory(childId: string): Promise<OllieMemory> {
    const existing = await prisma.ollieMemory.findUnique({
      where: { childId },
    });

    if (existing) {
      return existing;
    }

    return prisma.ollieMemory.create({
      data: { childId },
    });
  },

  /**
   * Safely parse JSON field
   */
  parseJsonField<T>(value: any): T | null {
    if (!value) return null;
    if (typeof value === 'object') return value as T;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  /**
   * Run weekly aggregation for all children
   * Called by cron job
   */
  async runWeeklyAggregation(): Promise<{ processed: number; errors: number }> {
    let processed = 0;
    let errors = 0;

    try {
      // Get all children with recent activity
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const children = await prisma.child.findMany({
        where: {
          OR: [
            { lastActiveAt: { gte: oneWeekAgo } },
            { activitySessions: { some: { startedAt: { gte: oneWeekAgo } } } },
          ],
        },
        select: { id: true },
      });

      logger.info('Starting weekly memory aggregation', { childCount: children.length });

      for (const child of children) {
        try {
          await this.aggregateWeeklyPatterns(child.id);
          processed++;
        } catch (error) {
          logger.error('Error aggregating for child', { childId: child.id, error });
          errors++;
        }
      }

      logger.info('Weekly memory aggregation complete', { processed, errors });
      return { processed, errors };
    } catch (error) {
      logger.error('Error running weekly aggregation', { error });
      return { processed, errors };
    }
  },
};
