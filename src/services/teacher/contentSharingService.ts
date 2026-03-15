// Content Sharing Service - Discovery, sharing, and remix functionality
import { prisma } from '../../config/database.js';
import { Prisma, ShareCategory, Subject, TeacherContent, TeacherContentType } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import { ensureSlug } from './slugService.js';

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
  country: string | null;
  primarySubject: Subject | null;
  isProfilePublic: boolean;
}

const teacherPublicSelect = {
  id: true,
  country: true,
  primarySubject: true,
  isProfilePublic: true,
} as const;

const sharedContentListSelect = {
  id: true,
  teacherId: true,
  title: true,
  description: true,
  subject: true,
  gradeLevel: true,
  contentType: true,
  sourceType: true,
  infographicUrl: true,
  status: true,
  isPublic: true,
  publishedAt: true,
  sharedAt: true,
  shareCategory: true,
  downloadCount: true,
  viewCount: true,
  likeCount: true,
  isFeatured: true,
  remixedFromId: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
  teacher: {
    select: teacherPublicSelect,
  },
} as const;

export type SharedContentListItem = Prisma.TeacherContentGetPayload<{
  select: typeof sharedContentListSelect;
}> & {
  isLikedByMe?: boolean;
  isRemixedByMe?: boolean;
};

export type SharedContentWithTeacher = Prisma.TeacherContentGetPayload<{
  include: {
    teacher: { select: typeof teacherPublicSelect };
    remixedFrom: {
      select: {
        id: true;
        title: true;
        teacher: {
          select: {
            id: true;
          };
        };
      };
    };
  };
}> & {
  isLikedByMe?: boolean;
  isRemixedByMe?: boolean;
};

export interface DiscoverResult {
  content: SharedContentListItem[];
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

    // Generate slug for public URL before sharing
    const slug = await ensureSlug(contentId, content.title);

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
      slug,
    });

    return { ...updated, slug };
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
    const where: Prisma.TeacherContentWhereInput = {
      isPublic: true,
      status: 'PUBLISHED',
      teacher: {
        is: {
          isProfilePublic: true,
        },
      },
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
    type OrderByType = Prisma.TeacherContentOrderByWithRelationInput;
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
        select: {
          ...sharedContentListSelect,
          ...(viewerId
            ? {
                likes: {
                  where: { teacherId: viewerId },
                  take: 1,
                  select: { id: true },
                },
              }
            : {}),
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
      } as SharedContentListItem;
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
        teacher: {
          is: {
            isProfilePublic: true,
          },
        },
      },
      include: {
        teacher: {
          select: teacherPublicSelect,
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
  async getTeacherSharedContent(teacherId: string): Promise<SharedContentListItem[]> {
    return prisma.teacherContent.findMany({
      where: {
        teacherId,
        isPublic: true,
        status: 'PUBLISHED',
      },
      orderBy: { sharedAt: 'desc' },
      select: sharedContentListSelect,
    });
  },

  /**
   * Get teacher's remixed content (content they've copied from others)
   */
  async getTeacherRemixes(teacherId: string): Promise<(TeacherContent & {
    remixedFrom: {
      id: string;
      title: string;
      teacher: { id: string };
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
      _count: {
        _all: true,
      },
      _sum: {
        downloadCount: true,
        viewCount: true,
        likeCount: true,
      },
    });

    return {
      totalShared: stats._count?._all ?? 0,
      totalDownloads: stats._sum.downloadCount || 0,
      totalViews: stats._sum.viewCount || 0,
      totalLikes: stats._sum.likeCount || 0,
    };
  },

  /**
   * Get featured content (staff picks)
   */
  async getFeaturedContent(limit: number = 6): Promise<SharedContentListItem[]> {
    const contentList = await prisma.teacherContent.findMany({
      where: {
        isPublic: true,
        status: 'PUBLISHED',
        isFeatured: true,
        teacher: {
          is: {
            isProfilePublic: true,
          },
        },
      },
      take: limit,
      orderBy: { sharedAt: 'desc' },
      select: sharedContentListSelect,
    });

    return contentList;
  },

  /**
   * Get popular content (top by downloads this week/month)
   */
  async getPopularContent(
    period: 'week' | 'month',
    limit: number = 12
  ): Promise<SharedContentListItem[]> {
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
        teacher: {
          is: {
            isProfilePublic: true,
          },
        },
      },
      take: limit,
      orderBy: { downloadCount: 'desc' },
      select: sharedContentListSelect,
    });

    return contentList;
  },

  /**
   * Get teacher public profile with their shared content
   */
  async getTeacherProfile(teacherId: string, _viewerId?: string): Promise<{
    teacher: TeacherPublicInfo & { sharedContentCount: number };
    content: SharedContentListItem[];
  } | null> {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: teacherPublicSelect,
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
        select: sharedContentListSelect,
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
        select: {
          createdAt: true,
          content: {
            select: sharedContentListSelect,
          },
        },
      }),
      prisma.contentLike.count({ where: { teacherId } }),
    ]);

    // Filter out unpublished/private content (in case content was unshared after being liked)
    const content = likes
      .filter(
        l =>
          l.content.isPublic &&
          l.content.status === 'PUBLISHED' &&
          l.content.teacher.isProfilePublic
      )
      .map(l => ({
        ...l.content,
        isLikedByMe: true,
        isRemixedByMe: false, // Could check but not critical for liked list
      })) as SharedContentListItem[];

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
  ): Promise<SharedContentListItem[]> {
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
        teacher: {
          is: {
            isProfilePublic: true,
          },
        },
        OR: [
          { subject: original.subject },
          { gradeLevel: original.gradeLevel },
        ],
      },
      take: limit,
      orderBy: { downloadCount: 'desc' },
      select: sharedContentListSelect,
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

  /**
   * Get public content by slug (for public resource pages, no auth required)
   */
  async getContentBySlug(slug: string): Promise<SharedContentWithTeacher | null> {
    const content = await prisma.teacherContent.findFirst({
      where: {
        slug,
        isPublic: true,
        status: 'PUBLISHED',
      },
      include: {
        teacher: {
          select: {
            ...teacherPublicSelect,
            firstName: true,
            lastName: true,
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

    return content as unknown as SharedContentWithTeacher;
  },

  /**
   * Get lightweight metadata for a public resource (for OG tags)
   */
  async getContentMetaBySlug(slug: string): Promise<{
    title: string;
    description: string | null;
    subject: Subject | null;
    gradeLevel: string | null;
    contentType: TeacherContentType;
    teacherName: string | null;
    slug: string;
  } | null> {
    const content = await prisma.teacherContent.findFirst({
      where: {
        slug,
        isPublic: true,
        status: 'PUBLISHED',
      },
      select: {
        title: true,
        description: true,
        subject: true,
        gradeLevel: true,
        contentType: true,
        slug: true,
        teacher: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!content || !content.slug) {
      return null;
    }

    const teacherName = [content.teacher.firstName, content.teacher.lastName]
      .filter(Boolean)
      .join(' ') || null;

    return {
      title: content.title,
      description: content.description,
      subject: content.subject,
      gradeLevel: content.gradeLevel,
      contentType: content.contentType,
      teacherName,
      slug: content.slug,
    };
  },
};

export default contentSharingService;
