import { prisma } from '../../config/database.js';
import { TeacherContentType, TeacherDownloadProductType } from '@prisma/client';
import { DOWNLOAD_PRODUCTS } from '../../config/stripeProducts.js';

export type ExportKind = 'pdf' | 'pptx' | 'drive' | 'batch';

const PDF_ONLY_CONTENT_TYPES = new Set<TeacherContentType>([
  'LESSON',
  'WORKSHEET',
  'STUDY_GUIDE',
]);

export function isPdfOnlyContentType(contentType: TeacherContentType): boolean {
  return PDF_ONLY_CONTENT_TYPES.has(contentType);
}

export function getRequiredProductForExport(
  contentType: TeacherContentType,
  exportKind: Exclude<ExportKind, 'batch'>
): TeacherDownloadProductType {
  if (exportKind === 'pptx') {
    return 'BUNDLE';
  }

  // PDF/Drive exports: only lessons/worksheets/study guides qualify for PDF-only
  if (exportKind === 'pdf' || exportKind === 'drive') {
    return isPdfOnlyContentType(contentType) ? 'PDF' : 'BUNDLE';
  }

  return 'BUNDLE';
}

export async function getDownloadAccess(teacherId: string, contentId: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      subscriptionTier: true,
      subscriptionStatus: true,
      subscriptionExpiresAt: true,
      organization: {
        select: {
          subscriptionStatus: true,
          subscriptionExpiresAt: true,
        },
      },
    },
  });

  const hasIndividualSubscription = Boolean(
    teacher?.subscriptionTier !== 'FREE' &&
    teacher?.subscriptionStatus === 'ACTIVE' &&
    (!teacher.subscriptionExpiresAt || teacher.subscriptionExpiresAt > new Date())
  );

  const hasOrganizationSeat = Boolean(
    teacher?.organization?.subscriptionStatus === 'ACTIVE' &&
    (!teacher.organization.subscriptionExpiresAt || teacher.organization.subscriptionExpiresAt > new Date())
  );

  // Active individual paid plan or active organization seat grants export access.
  const isSubscriber = hasIndividualSubscription || hasOrganizationSeat;

  const purchases = await prisma.teacherDownloadPurchase.findMany({
    where: { teacherId, contentId },
    select: { productType: true },
  });

  const hasBundle = purchases.some(p => p.productType === 'BUNDLE');
  const hasPdf = purchases.some(p => p.productType === 'PDF') || hasBundle;

  return { isSubscriber, hasPdf, hasBundle };
}

export async function checkDownloadAccess(
  teacherId: string,
  contentId: string,
  contentType: TeacherContentType,
  exportKind: Exclude<ExportKind, 'batch'>
) {
  const access = await getDownloadAccess(teacherId, contentId);
  const requiredProduct = getRequiredProductForExport(contentType, exportKind);
  const allowed = access.isSubscriber ||
    (requiredProduct === 'PDF' ? access.hasPdf : access.hasBundle);

  const product = DOWNLOAD_PRODUCTS[requiredProduct];

  return {
    ...access,
    allowed,
    requiredProduct,
    priceCents: Math.round(product.price * 100),
  };
}
