// Teacher Activity Service
// Aggregates recent activities from various sources for the activity dropdown

import { prisma } from '../../config/database.js';
import { quotaService } from './quotaService.js';
import { logger } from '../../utils/logger.js';

// Activity types enum
export type ActivityType =
  | 'CONTENT_CREATED'
  | 'AUDIO_READY'
  | 'AUDIO_PUBLISHED'
  | 'SUB_PLAN_CREATED'
  | 'IEP_GOALS_CREATED'
  | 'LOW_CREDITS';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  subtitle?: string;
  timestamp: string;
  actionUrl: string;
  metadata?: {
    contentType?: string;
    status?: string;
    percentUsed?: number;
  };
}

export interface ActivitiesResponse {
  activities: ActivityItem[];
  hasNew: boolean;
  newestTimestamp: string | null;
}

// Low credits threshold (show warning when usage >= 80%)
const LOW_CREDITS_THRESHOLD = 80;

export const activityService = {
  /**
   * Get recent activities for a teacher
   * Aggregates from TeacherContent, TeacherAudioUpdate, SubstitutePlan, IEPGoalSession
   */
  async getRecentActivities(
    teacherId: string,
    limit: number = 10
  ): Promise<ActivitiesResponse> {
    const activities: ActivityItem[] = [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      // Fetch all data sources in parallel
      const [
        recentContent,
        recentAudio,
        recentSubPlans,
        recentIEP,
        quotaInfo,
      ] = await Promise.all([
        // 1. Recent content (lessons, quizzes, flashcards)
        prisma.teacherContent.findMany({
          where: {
            teacherId,
            createdAt: { gte: thirtyDaysAgo },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            title: true,
            contentType: true,
            subject: true,
            createdAt: true,
          },
        }),

        // 2. Audio updates (READY or PUBLISHED)
        prisma.teacherAudioUpdate.findMany({
          where: {
            teacherId,
            status: { in: ['READY', 'PUBLISHED'] },
            updatedAt: { gte: thirtyDaysAgo },
          },
          orderBy: { updatedAt: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            status: true,
            updatedAt: true,
          },
        }),

        // 3. Substitute plans
        prisma.substitutePlan.findMany({
          where: {
            teacherId,
            createdAt: { gte: thirtyDaysAgo },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            date: true,
            createdAt: true,
          },
        }),

        // 4. IEP goal sessions
        prisma.iEPGoalSession.findMany({
          where: {
            teacherId,
            createdAt: { gte: thirtyDaysAgo },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            studentIdentifier: true,
            gradeLevel: true,
            createdAt: true,
          },
        }),

        // 5. Quota info for low credits warning
        quotaService.getQuotaInfo(teacherId).catch(() => null),
      ]);

      // Transform content items
      for (const content of recentContent) {
        activities.push({
          id: `content:${content.id}`,
          type: 'CONTENT_CREATED',
          title: content.title || 'Untitled Content',
          subtitle: formatContentType(content.contentType),
          timestamp: content.createdAt.toISOString(),
          actionUrl: `/teacher/content/${content.id}`,
          metadata: {
            contentType: content.contentType,
          },
        });
      }

      // Transform audio updates
      for (const audio of recentAudio) {
        const isPublished = audio.status === 'PUBLISHED';
        activities.push({
          id: `audio:${audio.id}`,
          type: isPublished ? 'AUDIO_PUBLISHED' : 'AUDIO_READY',
          title: isPublished
            ? `Published: ${audio.title}`
            : `Audio ready: ${audio.title}`,
          timestamp: audio.updatedAt.toISOString(),
          actionUrl: `/teacher/audio-updates`,
          metadata: {
            status: audio.status,
          },
        });
      }

      // Transform sub plans
      for (const plan of recentSubPlans) {
        activities.push({
          id: `subplan:${plan.id}`,
          type: 'SUB_PLAN_CREATED',
          title: plan.title || 'Sub Plan',
          subtitle: plan.date
            ? `For ${formatDate(plan.date)}`
            : undefined,
          timestamp: plan.createdAt.toISOString(),
          actionUrl: `/teacher/sub-plans/${plan.id}`,
        });
      }

      // Transform IEP sessions
      for (const iep of recentIEP) {
        activities.push({
          id: `iep:${iep.id}`,
          type: 'IEP_GOALS_CREATED',
          title: iep.studentIdentifier
            ? `IEP goals for ${iep.studentIdentifier}`
            : 'IEP goals generated',
          subtitle: iep.gradeLevel || undefined,
          timestamp: iep.createdAt.toISOString(),
          actionUrl: `/teacher/iep-goals/${iep.id}`,
        });
      }

      // Add low credits warning if applicable
      if (quotaInfo && quotaInfo.quota.percentUsed >= LOW_CREDITS_THRESHOLD) {
        activities.push({
          id: 'credits-warning',
          type: 'LOW_CREDITS',
          title: 'Credits running low',
          subtitle: `${Math.round(quotaInfo.quota.percentUsed)}% used this month`,
          timestamp: new Date().toISOString(),
          actionUrl: '/teacher/usage',
          metadata: {
            percentUsed: quotaInfo.quota.percentUsed,
          },
        });
      }

      // Sort by timestamp descending
      activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Apply limit
      const limitedActivities = activities.slice(0, limit);

      // Determine newest timestamp
      const newestTimestamp =
        limitedActivities.length > 0 ? limitedActivities[0].timestamp : null;

      // Check if there are "new" activities (within last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const hasNew = limitedActivities.some(
        (a) => new Date(a.timestamp) > oneDayAgo
      );

      return {
        activities: limitedActivities,
        hasNew,
        newestTimestamp,
      };
    } catch (error) {
      logger.error('Error fetching teacher activities', {
        teacherId,
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  },
};

// Helper functions
function formatContentType(type: string): string {
  const typeMap: Record<string, string> = {
    LESSON: 'Lesson',
    QUIZ: 'Quiz',
    FLASHCARD_DECK: 'Flashcards',
    STUDY_GUIDE: 'Study Guide',
  };
  return typeMap[type] || type;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
