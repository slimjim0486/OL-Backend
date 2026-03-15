// Slug generation service for public resource URLs
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

/**
 * Generate a URL-friendly slug from a title + content ID for uniqueness.
 * e.g. "Fractions Quiz — Grade 3" → "fractions-quiz-grade-3-a1b2c3d4"
 */
export function generateSlug(title: string, contentId: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // strip special chars
    .replace(/\s+/g, '-')     // spaces → hyphens
    .replace(/-+/g, '-')      // collapse multiple hyphens
    .replace(/^-|-$/g, '')    // trim leading/trailing hyphens
    .slice(0, 60);            // truncate

  const suffix = contentId.replace(/-/g, '').slice(0, 8);
  return `${base}-${suffix}`;
}

/**
 * Ensure a TeacherContent record has a slug. If not, generate and persist one.
 * Returns the slug.
 */
export async function ensureSlug(contentId: string, title: string): Promise<string> {
  const existing = await prisma.teacherContent.findUnique({
    where: { id: contentId },
    select: { slug: true },
  });

  if (existing?.slug) {
    return existing.slug;
  }

  let slug = generateSlug(title, contentId);

  // Handle (rare) collision
  const collision = await prisma.teacherContent.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (collision) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  await prisma.teacherContent.update({
    where: { id: contentId },
    data: { slug },
  });

  logger.info('Slug generated for content', { contentId, slug });
  return slug;
}
