// Content Sharing Service - Discovery, sharing, and remix functionality
import { prisma } from '../../config/database.js';
import { TeacherContent, ShareCategory, ContentStatus, Subject, TeacherContentType } from '@prisma/client';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export interface DiscoverFilters {
  contentType?: TeacherContentType;
  subject?: Subject;
  gradeLevel?: string;
  category?: ShareCategory;
  search?: string;
  sortBy?: 'popular' | 'recent' | 'mostLiked';
}

export interface DiscoverPagination {
  page: number;
  limit: number;
}

export interface TeacherPublicInfo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  schoolName: string | null;
  country: string | null;
  primarySubject: Subject | null;
  bio: string | null;
  isProfilePublic: boolean;
}

export interface SharedContentWithTeacher extends TeacherContent {
  teacher: TeacherPublicInfo;
  isLikedByMe?: boolean;
  isRemixedByMe?: boolean;
}

export interface DiscoverResult {
  content: SharedContentWithTeacher[];
  total: number;
  pages: number;
}

export interface SharingStats {
  totalShared: number;
  totalDownloads: number;
  totalViews: number;
  totalLikes: number;
}

// ============================================
// SERVICE
// ============================================

export const contentSharingService = {
  /**
   * Share content publicly with a category
   */
  async shareContent(
    contentId: string,
    teacherId: string,
    category: ShareCategory
  ): Promise<TeacherContent> {
    // Verify ownership
    const content = await prisma.teacherContent.findFirst({
      where: { id: contentId, teacherId },
    });

    if (!content) {
      throw new Error('Content not found or not owned');
    }

    // Content must be PUBLISHED to share
    if (content.status !== 'PUBLISHED') {
      throw new Error('Only published content can be shared');
    }

    // Update sharing fields
    const updated = await prisma.teacherContent.update({
      where: { id: contentId },
      data: {
        isPublic: true,
        sharedAt: content.sharedAt || new Date(), // Keep original share date if re-sharing
        shareCategory: category,
      },
    });

    logger.info('Content shared publicly', {
      contentId,
      teacherId,
      category,
    });

    return updated;
  },

  /**
   * Unshare content (make private again)
   */
  async unshareContent(
    contentId: string,
    teacherId: string
  ): Promise<TeacherContent> {
    // Verify ownership
    const content = await prisma.teacherContent.findFirst({
      where: { id: contentId, teacherId },
    });

    if (!content) {
      throw new Error('Content not found or not owned');
    }

    const updated = await prisma.teacherContent.update({
      where: { id: contentId },
      data: {
        isPublic: false,
        // Keep sharedAt and shareCategory for history
      },
    });

    logger.info('Content unshared', {
      contentId,
      teacherId,
    });

    return updated;
  },

  /**
   * Discover shared content (public, no auth required for browsing)
   */
  async discoverContent(
    filters: DiscoverFilters,
    pagination: DiscoverPagination,
    viewerId?: string
  ): Promise<DiscoverResult> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      isPublic: true,
      status: 'PUBLISHED',
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
    if (filters.category) {
      where.shareCategory = filters.category;
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Build order by
    type OrderByType = { downloadCount?: 'desc'; sharedAt?: 'desc'; likeCount?: 'desc' };
    const orderByMap: Record<string, OrderByType> = {
      popular: { downloadCount: 'desc' },
      recent: { sharedAt: 'desc' },
      mostLiked: { likeCount: 'desc' },
    };
    const orderBy = orderByMap[filters.sortBy || 'recent'];

    // Execute query
    const [contentList, total] = await Promise.all([
      prisma.teacherContent.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              schoolName: true,
              country: true,
              primarySubject: true,
              bio: true,
              isProfilePublic: true,
            },
          },
          ...(viewerId ? {
            likes: {
              where: { teacherId: viewerId },
              take: 1,
            },
          } : {}),
        },
      }),
      prisma.teacherContent.count({ where }),
    ]);

    // Check if viewer has remixed any of these contents
    let remixedIds: Set<string> = new Set();
    if (viewerId) {
      const remixes = await prisma.teacherContent.findMany({
        where: {
          teacherId: viewerId,
          remixedFromId: { in: contentList.map(c => c.id) },
        },
        select: { remixedFromId: true },
      });
      remixedIds = new Set(remixes.map(r => r.remixedFromId).filter(Boolean) as string[]);
    }

    // Transform to SharedContentWithTeacher
    const content = contentList.map(c => {
      const { likes, ...rest } = c as typeof c & { likes?: { id: string }[] };
      return {
        ...rest,
        isLikedByMe: viewerId ? (likes?.length ?? 0) > 0 : false,
        isRemixedByMe: viewerId ? remixedIds.has(c.id) : false,
      } as SharedContentWithTeacher;
    });

    return {
      content,
      total,
      pages: Math.ceil(total / limit),
    };
  },

  /**
   * Get single shared content (public view)
   */
  async getSharedContent(
    contentId: string,
    viewerId?: string
  ): Promise<SharedContentWithTeacher | null> {
    const content = await prisma.teacherContent.findFirst({
      where: {
        id: contentId,
        isPublic: true,
        status: 'PUBLISHED',
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            schoolName: true,
            country: true,
            primarySubject: true,
            bio: true,
            isProfilePublic: true,
          },
        },
        remixedFrom: {
          select: {
            id: true,
            title: true,
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!content) {
      return null;
    }

    // Check if viewer has liked this content
    let isLikedByMe = false;
    let isRemixedByMe = false;
    if (viewerId) {
      const [like, remix] = await Promise.all([
        prisma.contentLike.findUnique({
          where: {
            teacherId_contentId: {
              teacherId: viewerId,
              contentId,
            },
          },
        }),
        prisma.teacherContent.findFirst({
          where: {
            teacherId: viewerId,
            remixedFromId: contentId,
          },
        }),
      ]);
      isLikedByMe = !!like;
      isRemixedByMe = !!remix;
    }

    return {
      ...content,
      isLikedByMe,
      isRemixedByMe,
    } as SharedContentWithTeacher;
  },

  /**
   * Remix (duplicate) shared content with attribution
   */
  async remixContent(
    contentId: string,
    teacherId: string
  ): Promise<TeacherContent> {
    // Get original content (must be public)
    const original = await prisma.teacherContent.findFirst({
      where: {
        id: contentId,
        isPublic: true,
        status: 'PUBLISHED',
      },
    });

    if (!original) {
      throw new Error('Content not available for remix');
    }

    // Check if already remixed by this teacher
    const existingRemix = await prisma.teacherContent.findFirst({
      where: {
        teacherId,
        remixedFromId: contentId,
      },
    });

    if (existingRemix) {
      throw new Error('You have already remixed this content');
    }

    // Create copy with attribution using transaction
    const [remix] = await prisma.$transaction([
      prisma.teacherContent.create({
        data: {
          teacherId,
          title: `${original.title} (Remix)`,
          description: original.description,
          subject: original.subject,
          gradeLevel: original.gradeLevel,
          contentType: original.contentType,
          sourceType: original.sourceType,
          extractedText: original.extractedText,
          lessonContent: original.lessonContent ?? undefined,
          quizContent: original.quizContent ?? undefined,
          flashcardContent: original.flashcardContent ?? undefined,
          infographicUrl: original.infographicUrl,
          status: 'DRAFT', // Always start as draft
          isPublic: false,
          remixedFromId: original.id, // Attribution
        },
      }),
      // Increment original's download count
      prisma.teacherContent.update({
        where: { id: contentId },
        data: { downloadCount: { increment: 1 } },
      }),
    ]);

    logger.info('Content remixed', {
      originalId: contentId,
      remixId: remix.id,
      teacherId,
    });

    return remix;
  },

  /**
   * Like content
   */
  async likeContent(contentId: string, teacherId: string): Promise<void> {
    // Verify content is public
    const content = await prisma.teacherContent.findFirst({
      where: {
        id: contentId,
        isPublic: true,
        status: 'PUBLISHED',
      },
    });

    if (!content) {
      throw new Error('Content not found or not available');
    }

    // Check if already liked
    const existingLike = await prisma.contentLike.findUnique({
      where: {
        teacherId_contentId: { teacherId, contentId },
      },
    });

    if (existingLike) {
      return; // Already liked, no-op
    }

    // Create like and increment count
    await prisma.$transaction([
      prisma.contentLike.create({
        data: { teacherId, contentId },
      }),
      prisma.teacherContent.update({
        where: { id: contentId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);

    logger.info('Content liked', { contentId, teacherId });
  },

  /**
   * Unlike content
   */
  async unlikeContent(contentId: string, teacherId: string): Promise<void> {
    // Check if like exists
    const existingLike = await prisma.contentLike.findUnique({
      where: {
        teacherId_contentId: { teacherId, contentId },
      },
    });

    if (!existingLike) {
      return; // Not liked, no-op
    }

    // Delete like and decrement count
    await prisma.$transaction([
      prisma.contentLike.delete({
        where: {
          teacherId_contentId: { teacherId, contentId },
        },
      }),
      prisma.teacherContent.update({
        where: { id: contentId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);

    logger.info('Content unliked', { contentId, teacherId });
  },

  /**
   * Get teacher's shared content
   */
  async getTeacherSharedContent(teacherId: string): Promise<TeacherContent[]> {
    return prisma.teacherContent.findMany({
      where: {
        teacherId,
        isPublic: true,
      },
      orderBy: { sharedAt: 'desc' },
    });
  },

  /**
   * Get teacher's remixed content (content they've copied from others)
   */
  async getTeacherRemixes(teacherId: string): Promise<(TeacherContent & {
    remixedFrom: {
      id: string;
      title: string;
      teacher: { id: string; firstName: string | null; lastName: string | null };
    } | null;
  })[]> {
    return prisma.teacherContent.findMany({
      where: {
        teacherId,
        remixedFromId: { not: null },
      },
      include: {
        remixedFrom: {
          select: {
            id: true,
            title: true,
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Track view (called when content is viewed publicly)
   */
  async recordView(contentId: string): Promise<void> {
    try {
      await prisma.teacherContent.update({
        where: { id: contentId },
        data: { viewCount: { increment: 1 } },
      });
    } catch (error) {
      // Non-critical, log and continue
      logger.warn('Failed to record view', { contentId, error });
    }
  },

  /**
   * Get sharing stats for a teacher
   */
  async getSharingStats(teacherId: string): Promise<SharingStats> {
    const stats = await prisma.teacherContent.aggregate({
      where: {
        teacherId,
        isPublic: true,
      },
      _count: true,
      _sum: {
        downloadCount: true,
        viewCount: true,
        likeCount: true,
      },
    });

    return {
      totalShared: stats._count,
      totalDownloads: stats._sum.downloadCount || 0,
      totalViews: stats._sum.viewCount || 0,
      totalLikes: stats._sum.likeCount || 0,
    };
  },

  /**
   * Get featured content (staff picks)
   */
  async getFeaturedContent(limit: number = 6): Promise<SharedContentWithTeacher[]> {
    const contentList = await prisma.teacherContent.findMany({
      where: {
        isPublic: true,
        status: 'PUBLISHED',
        isFeatured: true,
      },
      take: limit,
      orderBy: { sharedAt: 'desc' },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            schoolName: true,
            country: true,
            primarySubject: true,
            bio: true,
            isProfilePublic: true,
          },
        },
      },
    });

    return contentList as SharedContentWithTeacher[];
  },

  /**
   * Get popular content (top by downloads this week/month)
   */
  async getPopularContent(
    period: 'week' | 'month',
    limit: number = 12
  ): Promise<SharedContentWithTeacher[]> {
    const now = new Date();
    const startDate = new Date(now);
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const contentList = await prisma.teacherContent.findMany({
      where: {
        isPublic: true,
        status: 'PUBLISHED',
        sharedAt: { gte: startDate },
      },
      take: limit,
      orderBy: { downloadCount: 'desc' },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            schoolName: true,
            country: true,
            primarySubject: true,
            bio: true,
            isProfilePublic: true,
          },
        },
      },
    });

    return contentList as SharedContentWithTeacher[];
  },

  /**
   * Get teacher public profile with their shared content
   */
  async getTeacherProfile(teacherId: string, viewerId?: string): Promise<{
    teacher: TeacherPublicInfo & { sharedContentCount: number };
    content: TeacherContent[];
  } | null> {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        schoolName: true,
        country: true,
        primarySubject: true,
        bio: true,
        isProfilePublic: true,
      },
    });

    if (!teacher || !teacher.isProfilePublic) {
      return null;
    }

    const [content, count] = await Promise.all([
      prisma.teacherContent.findMany({
        where: {
          teacherId,
          isPublic: true,
          status: 'PUBLISHED',
        },
        orderBy: { sharedAt: 'desc' },
        take: 20,
      }),
      prisma.teacherContent.count({
        where: {
          teacherId,
          isPublic: true,
          status: 'PUBLISHED',
        },
      }),
    ]);

    return {
      teacher: { ...teacher, sharedContentCount: count },
      content,
    };
  },

  /**
   * Get content that the teacher has liked
   */
  async getLikedContent(
    teacherId: string,
    pagination: DiscoverPagination
  ): Promise<DiscoverResult> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      prisma.contentLike.findMany({
        where: { teacherId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          content: {
            include: {
              teacher: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  schoolName: true,
                  country: true,
                  primarySubject: true,
                  bio: true,
                  isProfilePublic: true,
                },
              },
            },
          },
        },
      }),
      prisma.contentLike.count({ where: { teacherId } }),
    ]);

    // Filter out unpublished/private content (in case content was unshared after being liked)
    const content = likes
      .filter(l => l.content.isPublic && l.content.status === 'PUBLISHED')
      .map(l => ({
        ...l.content,
        isLikedByMe: true,
        isRemixedByMe: false, // Could check but not critical for liked list
      })) as SharedContentWithTeacher[];

    return {
      content,
      total,
      pages: Math.ceil(total / limit),
    };
  },

  /**
   * Get related content (same subject/grade level)
   */
  async getRelatedContent(
    contentId: string,
    limit: number = 6
  ): Promise<TeacherContent[]> {
    const original = await prisma.teacherContent.findUnique({
      where: { id: contentId },
      select: { subject: true, gradeLevel: true, teacherId: true },
    });

    if (!original) {
      return [];
    }

    return prisma.teacherContent.findMany({
      where: {
        id: { not: contentId },
        isPublic: true,
        status: 'PUBLISHED',
        OR: [
          { subject: original.subject },
          { gradeLevel: original.gradeLevel },
        ],
      },
      take: limit,
      orderBy: { downloadCount: 'desc' },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            schoolName: true,
            country: true,
            primarySubject: true,
            bio: true,
            isProfilePublic: true,
          },
        },
      },
    });
  },

  /**
   * Set content as featured (admin only)
   */
  async setFeatured(contentId: string, isFeatured: boolean): Promise<TeacherContent> {
    return prisma.teacherContent.update({
      where: { id: contentId },
      data: { isFeatured },
    });
  },
};

export default contentSharingService;
