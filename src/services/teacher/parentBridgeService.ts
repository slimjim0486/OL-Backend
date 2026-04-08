// Parent Bridge Service — Teacher Intelligence Platform
// Manages sharing material summaries with parents via unique shortcode links
import crypto from 'crypto';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

// ============================================
// HELPERS
// ============================================

function generateShortcode(): string {
  // 8-char alphanumeric shortcode from crypto-random bytes
  return crypto.randomBytes(6).toString('base64url').slice(0, 8);
}

// ============================================
// SERVICE
// ============================================

/**
 * Create a share link for a material. Returns existing link if one already exists.
 */
async function createShareLink(teacherId: string, materialId: string) {
  // Verify the material belongs to this teacher
  const material = await prisma.teacherMaterial.findFirst({
    where: { id: materialId, teacherId },
  });

  if (!material) {
    throw Object.assign(new Error('Material not found or does not belong to this teacher'), { status: 404 });
  }

  // Check if a SharedParentUpdate already exists for this material
  const existing = await prisma.sharedParentUpdate.findUnique({
    where: { materialId },
  });

  if (existing) {
    logger.info('Returning existing share link', { teacherId, materialId, shortcode: existing.shortcode });
    return existing;
  }

  // Generate a unique shortcode with collision retry
  let shortcode = generateShortcode();
  let attempts = 0;
  const MAX_ATTEMPTS = 5;

  while (attempts < MAX_ATTEMPTS) {
    const collision = await prisma.sharedParentUpdate.findUnique({
      where: { shortcode },
    });
    if (!collision) break;
    shortcode = generateShortcode();
    attempts++;
  }

  if (attempts >= MAX_ATTEMPTS) {
    throw new Error('Failed to generate unique shortcode after maximum attempts');
  }

  // Create SharedParentUpdate with 30-day expiry
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const shared = await prisma.sharedParentUpdate.create({
    data: {
      materialId,
      teacherId,
      shortcode,
      expiresAt,
    },
  });

  logger.info('Created share link', { teacherId, materialId, shortcode });
  return shared;
}

/**
 * Get a shared update by shortcode (public). Increments view count atomically.
 */
async function getSharedUpdate(shortcode: string) {
  const shared = await prisma.sharedParentUpdate.findUnique({
    where: { shortcode },
    include: {
      material: {
        select: {
          title: true,
          type: true,
          content: true,
          subject: true,
          topics: true,
          gradeLevel: true,
        },
      },
    },
  });

  if (!shared) {
    throw Object.assign(new Error('Shared update not found'), { status: 404 });
  }

  if (!shared.isActive) {
    throw Object.assign(new Error('This shared link has been deactivated'), { status: 410 });
  }

  if (shared.expiresAt && shared.expiresAt < new Date()) {
    throw Object.assign(new Error('This shared link has expired'), { status: 410 });
  }

  // Increment view count atomically
  await prisma.sharedParentUpdate.update({
    where: { shortcode },
    data: { viewCount: { increment: 1 } },
  });

  return shared;
}

/**
 * Track a CTA click on a shared update (public).
 */
async function trackCtaClick(shortcode: string) {
  const shared = await prisma.sharedParentUpdate.findUnique({
    where: { shortcode },
  });

  if (!shared) {
    throw Object.assign(new Error('Shared update not found'), { status: 404 });
  }

  await prisma.sharedParentUpdate.update({
    where: { shortcode },
    data: { ctaClickCount: { increment: 1 } },
  });

  logger.info('CTA click tracked', { shortcode });
}

/**
 * Deactivate a share link. Verifies teacher ownership.
 */
async function deactivateShare(teacherId: string, materialId: string) {
  const shared = await prisma.sharedParentUpdate.findUnique({
    where: { materialId },
  });

  if (!shared) {
    throw Object.assign(new Error('Shared update not found'), { status: 404 });
  }

  if (shared.teacherId !== teacherId) {
    throw Object.assign(new Error('Not authorized to deactivate this share link'), { status: 403 });
  }

  const deactivated = await prisma.sharedParentUpdate.update({
    where: { materialId },
    data: { isActive: false },
  });

  logger.info('Share link deactivated', { teacherId, materialId });
  return deactivated;
}

export const parentBridgeService = {
  createShareLink,
  getSharedUpdate,
  trackCtaClick,
  deactivateShare,
};
