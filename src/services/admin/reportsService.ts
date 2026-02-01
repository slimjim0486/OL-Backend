// Reports Service for Admin Dashboard
// Provides paginated user lists for Parents, Children, and Teachers
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import type { Prisma } from '@prisma/client';

// Query options interface
export interface ReportQueryOptions {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  // Filters
  subscriptionTier?: string;
  pricingTier?: string;
  curriculumType?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

type TeacherPricingTier = 'GENERATE' | 'DOWNLOAD' | 'SUBSCRIBED';

function getTeacherPricingTier(params: {
  subscriptionTier?: string | null;
  subscriptionStatus?: string | null;
  stripeSubscriptionId?: string | null;
  downloadPurchasesCount?: number;
}): TeacherPricingTier {
  const tier = String(params.subscriptionTier || '').toUpperCase();
  const status = String(params.subscriptionStatus || '').toUpperCase();
  const isSubscribed = status === 'ACTIVE' && (tier && tier !== 'FREE' || Boolean(params.stripeSubscriptionId));
  if (isSubscribed) return 'SUBSCRIBED';
  if ((params.downloadPurchasesCount || 0) > 0) return 'DOWNLOAD';
  return 'GENERATE';
}

export const reportsService = {
  /**
   * Get all parents with pagination, search, and filters
   */
  async getParents(options: ReportQueryOptions): Promise<PaginatedResult<any>> {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      subscriptionTier,
      pricingTier,
      dateFrom,
      dateTo,
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ParentWhereInput = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (subscriptionTier) {
      where.subscriptionTier = subscriptionTier as any;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
    }

    // Build orderBy
    const orderBy: Prisma.ParentOrderByWithRelationInput = {};
    const validSortFields = ['email', 'firstName', 'lastName', 'subscriptionTier', 'subscriptionStatus', 'createdAt'];
    if (validSortFields.includes(sortBy)) {
      (orderBy as any)[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    try {
      // Execute count and query in parallel
      const [total, parents] = await Promise.all([
        prisma.parent.count({ where }),
        prisma.parent.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            country: true,
            subscriptionTier: true,
            subscriptionStatus: true,
            stripeCustomerId: true,
            trialEndsAt: true,
            subscriptionExpiresAt: true,
            emailVerified: true,
            authProvider: true,
            preferredLanguage: true,
            createdAt: true,
            lastLoginAt: true,
            _count: {
              select: {
                children: true,
              },
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: parents.map(parent => ({
          ...parent,
          childrenCount: parent._count.children,
          _count: undefined,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        },
      };
    } catch (error) {
      logger.error('Error fetching parents:', error);
      throw error;
    }
  },

  /**
   * Get single parent with detailed information
   */
  async getParentDetails(parentId: string) {
    try {
      const parent = await prisma.parent.findUnique({
        where: { id: parentId },
        include: {
          children: {
            select: {
              id: true,
              displayName: true,
              avatarUrl: true,
              dateOfBirth: true,
              ageGroup: true,
              gradeLevel: true,
              curriculumType: true,
              lastActiveAt: true,
              createdAt: true,
              _count: {
                select: {
                  lessons: true,
                },
              },
            },
          },
          lessonUsage: {
            orderBy: { month: 'desc' },
            take: 6,
          },
          consents: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!parent) {
        return null;
      }

      // Format children with age
      const childrenWithAge = parent.children.map(child => ({
        ...child,
        age: calculateAge(child.dateOfBirth),
        lessonsCount: child._count.lessons,
        _count: undefined,
      }));

      return {
        ...parent,
        children: childrenWithAge,
      };
    } catch (error) {
      logger.error('Error fetching parent details:', error);
      throw error;
    }
  },

  /**
   * Get all children with pagination, search, and filters
   */
  async getChildren(options: ReportQueryOptions): Promise<PaginatedResult<any>> {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      curriculumType,
      dateFrom,
      dateTo,
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ChildWhereInput = {};

    if (search) {
      where.OR = [
        { displayName: { contains: search, mode: 'insensitive' } },
        { parent: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (curriculumType) {
      where.curriculumType = curriculumType as any;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
    }

    // Build orderBy
    const orderBy: Prisma.ChildOrderByWithRelationInput = {};
    const validSortFields = ['displayName', 'gradeLevel', 'curriculumType', 'createdAt', 'lastActiveAt'];
    if (validSortFields.includes(sortBy)) {
      (orderBy as any)[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    try {
      // Execute count and query in parallel
      const [total, children] = await Promise.all([
        prisma.child.count({ where }),
        prisma.child.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            dateOfBirth: true,
            ageGroup: true,
            gradeLevel: true,
            curriculumType: true,
            preferredLanguage: true,
            learningStyle: true,
            lastActiveAt: true,
            createdAt: true,
            parent: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            _count: {
              select: {
                lessons: true,
                flashcardDecks: true,
                earnedBadges: true,
              },
            },
            progress: {
              select: {
                currentXP: true,
                totalXP: true,
                level: true,
                lessonsCompleted: true,
              },
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: children.map(child => ({
          ...child,
          age: calculateAge(child.dateOfBirth),
          lessonsCount: child._count.lessons,
          flashcardDecksCount: child._count.flashcardDecks,
          badgesCount: child._count.earnedBadges,
          _count: undefined,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        },
      };
    } catch (error) {
      logger.error('Error fetching children:', error);
      throw error;
    }
  },

  /**
   * Get single child with detailed information
   */
  async getChildDetails(childId: string) {
    try {
      const child = await prisma.child.findUnique({
        where: { id: childId },
        include: {
          parent: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              subscriptionTier: true,
            },
          },
          progress: true,
          streak: true,
          lessons: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
              id: true,
              title: true,
              subject: true,
              processingStatus: true,
              percentComplete: true,
              completedAt: true,
              createdAt: true,
            },
          },
          earnedBadges: {
            orderBy: { earnedAt: 'desc' },
            take: 10,
            include: {
              badge: true,
            },
          },
          _count: {
            select: {
              lessons: true,
              flashcardDecks: true,
              chatMessages: true,
              earnedBadges: true,
            },
          },
        },
      });

      if (!child) {
        return null;
      }

      return {
        ...child,
        age: calculateAge(child.dateOfBirth),
        lessonsCount: child._count.lessons,
        flashcardDecksCount: child._count.flashcardDecks,
        chatMessagesCount: child._count.chatMessages,
        badgesCount: child._count.earnedBadges,
      };
    } catch (error) {
      logger.error('Error fetching child details:', error);
      throw error;
    }
  },

  /**
   * Get all teachers with pagination, search, and filters
   */
  async getTeachers(options: ReportQueryOptions): Promise<PaginatedResult<any>> {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      subscriptionTier,
      dateFrom,
      dateTo,
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.TeacherWhereInput = {};
    const andConditions: Prisma.TeacherWhereInput[] = [];

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { schoolName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (subscriptionTier) {
      andConditions.push({ subscriptionTier: subscriptionTier as any });
    }

    if (pricingTier) {
      const normalizedPricingTier = pricingTier.toUpperCase();
      if (normalizedPricingTier === 'SUBSCRIBED') {
        andConditions.push({
          AND: [
            { subscriptionStatus: 'ACTIVE' },
            {
              OR: [
                { subscriptionTier: { not: 'FREE' } },
                { stripeSubscriptionId: { not: null } },
              ],
            },
          ],
        });
      } else if (normalizedPricingTier === 'DOWNLOAD') {
        andConditions.push({
          AND: [
            { subscriptionTier: 'FREE' },
            { stripeSubscriptionId: null },
            { downloadPurchases: { some: {} } },
          ],
        });
      } else if (normalizedPricingTier === 'GENERATE') {
        andConditions.push({
          AND: [
            { subscriptionTier: 'FREE' },
            { stripeSubscriptionId: null },
            { downloadPurchases: { none: {} } },
          ],
        });
      }
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Build orderBy
    const orderBy: Prisma.TeacherOrderByWithRelationInput = {};
    const validSortFields = ['email', 'firstName', 'lastName', 'subscriptionTier', 'createdAt', 'lastLoginAt'];
    if (validSortFields.includes(sortBy)) {
      (orderBy as any)[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    try {
      // Execute count and query in parallel
      const [total, teachers] = await Promise.all([
        prisma.teacher.count({ where }),
        prisma.teacher.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            schoolName: true,
            primarySubject: true,
            gradeRange: true,
            country: true,
            countryCode: true,
            emailVerified: true,
            authProvider: true,
            subscriptionTier: true,
            subscriptionStatus: true,
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            trialEndsAt: true,
            monthlyTokenQuota: true,
            currentMonthUsage: true,
            rolledOverCredits: true,
            bonusCredits: true,
            createdAt: true,
            lastLoginAt: true,
            _count: {
              select: {
                content: true,
                audioUpdates: true,
                substitutePlans: true,
                iepGoalSessions: true,
                downloadPurchases: true,
              },
            },
          },
        }),
      ]);

      const teacherIds = teachers.map(teacher => teacher.id);
      const completedExports = teacherIds.length > 0
        ? await prisma.teacherExport.groupBy({
          by: ['teacherId'],
          where: {
            teacherId: { in: teacherIds },
            status: 'COMPLETED',
          },
          _count: { _all: true },
        })
        : [];

      const completedExportMap = new Map(
        completedExports.map(item => [item.teacherId, item._count._all])
      );

      const totalPages = Math.ceil(total / limit);

      return {
        data: teachers.map(teacher => ({
          ...teacher,
          // Convert BigInt to Number for JSON serialization
          monthlyTokenQuota: Number(teacher.monthlyTokenQuota),
          currentMonthUsage: Number(teacher.currentMonthUsage),
          contentCount: teacher._count.content,
          audioUpdatesCount: teacher._count.audioUpdates,
          subPlansCount: teacher._count.substitutePlans,
          iepGoalsCount: teacher._count.iepGoalSessions,
          downloadPurchasesCount: teacher._count.downloadPurchases,
          downloadsCount: completedExportMap.get(teacher.id) || 0,
          pricingTier: getTeacherPricingTier({
            subscriptionTier: teacher.subscriptionTier,
            subscriptionStatus: teacher.subscriptionStatus,
            stripeSubscriptionId: teacher.stripeSubscriptionId,
            downloadPurchasesCount: teacher._count.downloadPurchases,
          }),
          quotaUsedPercent: Number(teacher.monthlyTokenQuota) > 0
            ? Math.round((Number(teacher.currentMonthUsage) / Number(teacher.monthlyTokenQuota)) * 100)
            : 0,
          _count: undefined,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        },
      };
    } catch (error) {
      logger.error('Error fetching teachers:', error);
      throw error;
    }
  },

  /**
   * Get single teacher with detailed information
   */
  async getTeacherDetails(teacherId: string) {
    try {
      const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
            },
          },
          content: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
              id: true,
              title: true,
              contentType: true,
              subject: true,
              status: true,
              createdAt: true,
            },
          },
          audioUpdates: {
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
              id: true,
              title: true,
              status: true,
              createdAt: true,
            },
          },
          tokenUsageLogs: {
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
              id: true,
              operation: true,
              tokensUsed: true,
              modelUsed: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              content: true,
              rubrics: true,
              gradingJobs: true,
              templates: true,
              audioUpdates: true,
              substitutePlans: true,
              iepGoalSessions: true,
              exports: true,
              downloadPurchases: true,
            },
          },
        },
      });

      if (!teacher) {
        return null;
      }

      // Calculate total tokens used
      const totalTokensUsed = teacher.tokenUsageLogs.reduce((sum, log) => sum + log.tokensUsed, 0);

      // Count exports by format (completed only)
      const [pptxExportsCount, pdfExportsCount] = await Promise.all([
        prisma.teacherExport.count({
          where: {
            teacherId,
            format: 'PPTX',
            status: 'COMPLETED',
          },
        }),
        prisma.teacherExport.count({
          where: {
            teacherId,
            format: 'PDF',
            status: 'COMPLETED',
          },
        }),
      ]);

      return {
        ...teacher,
        // Convert BigInt to Number for JSON serialization
        monthlyTokenQuota: Number(teacher.monthlyTokenQuota),
        currentMonthUsage: Number(teacher.currentMonthUsage),
        contentCount: teacher._count.content,
        rubricsCount: teacher._count.rubrics,
        gradingJobsCount: teacher._count.gradingJobs,
        templatesCount: teacher._count.templates,
        audioUpdatesCount: teacher._count.audioUpdates,
        subPlansCount: teacher._count.substitutePlans,
        iepGoalsCount: teacher._count.iepGoalSessions,
        exportsCount: teacher._count.exports,
        downloadPurchasesCount: teacher._count.downloadPurchases,
        pptxExportsCount,
        pdfExportsCount,
        downloadsCount: pdfExportsCount + pptxExportsCount,
        recentTokensUsed: totalTokensUsed,
        pricingTier: getTeacherPricingTier({
          subscriptionTier: teacher.subscriptionTier,
          subscriptionStatus: teacher.subscriptionStatus,
          stripeSubscriptionId: teacher.stripeSubscriptionId,
          downloadPurchasesCount: teacher._count.downloadPurchases,
        }),
        quotaUsedPercent: Number(teacher.monthlyTokenQuota) > 0
          ? Math.round((Number(teacher.currentMonthUsage) / Number(teacher.monthlyTokenQuota)) * 100)
          : 0,
      };
    } catch (error) {
      logger.error('Error fetching teacher details:', error);
      throw error;
    }
  },

  /**
   * Get summary stats for reports
   */
  async getReportsSummary() {
    try {
      const [
        totalParents,
        totalChildren,
        totalTeachers,
        parentsThisWeek,
        childrenThisWeek,
        teachersThisWeek,
      ] = await Promise.all([
        prisma.parent.count(),
        prisma.child.count(),
        prisma.teacher.count(),
        prisma.parent.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.child.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.teacher.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

      return {
        parents: {
          total: totalParents,
          newThisWeek: parentsThisWeek,
        },
        children: {
          total: totalChildren,
          newThisWeek: childrenThisWeek,
        },
        teachers: {
          total: totalTeachers,
          newThisWeek: teachersThisWeek,
        },
      };
    } catch (error) {
      logger.error('Error fetching reports summary:', error);
      throw error;
    }
  },
};
