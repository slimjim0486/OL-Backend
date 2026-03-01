/**
 * Package Export Service — Handles ZIP export of purchased packages
 */

import { createRequire } from 'node:module';
import { prisma } from '../../config/database.js';
import JSZip from 'jszip';

// pptxgenjs exports field points to an ESM .js file without "type":"module",
// which crashes Node 18. Force CJS resolution via createRequire.
const _require = createRequire(import.meta.url);
const PptxGenJS = _require('pptxgenjs');
import {
  Subject,
  TeacherContentType,
  type PackageMaterial,
  type PackagePurchase,
  type TeacherContent,
} from '@prisma/client';
import { exportContent, exportMultipleContent } from './exportService.js';
import { packageGenerationService } from './packageGenerationService.js';
import { uploadFile } from '../storage/storageService.js';
import { logger } from '../../utils/logger.js';
import { AppError } from '../../middleware/errorHandler.js';

// =============================================================================
// TYPES
// =============================================================================

interface ExportOptions {
  includeAnswer?: boolean;
}

interface ExportResult {
  downloadUrl: string;
  filename: string;
  sizeBytes: number;
}

type PackageWithWeeks = PackagePurchase & {
  weeks: Array<{
    id: string;
    weekNumber: number;
    weekLabel: string;
    materials: PackageMaterial[];
  }>;
};

type MaterialWithPurchase = PackageMaterial & {
  purchase: PackagePurchase;
};

type PptxInstance = {
  layout: string;
  author: string;
  company: string;
  subject: string;
  title: string;
  ShapeType: Record<string, string>;
  addSlide: () => any;
  write: (opts: { outputType: 'nodebuffer' }) => Promise<Buffer>;
};

const VALID_SUBJECTS = new Set<string>(Object.values(Subject));

function createPptx(): PptxInstance {
  const Ctor = PptxGenJS as unknown as new () => PptxInstance;
  return new Ctor();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function toText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || 'export';
}

function safeFilename(value: string, fallback = 'file'): string {
  const cleaned = value
    .replace(/[\\/:*?"<>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.slice(0, 120) || fallback;
}

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function errorToMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error || 'Unknown error');
}

function normalizeSubject(raw: string | null | undefined): Subject {
  const candidate = String(raw || '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

  if (candidate && VALID_SUBJECTS.has(candidate)) {
    return candidate as Subject;
  }

  return Subject.OTHER;
}

function extractGradeLevel(config: unknown): string {
  if (!isRecord(config)) return 'General';
  return toText(config.gradeLevel) || 'General';
}

function getMaterialSource(material: PackageMaterial): unknown {
  return material.editedContent ?? material.content ?? {};
}

function unwrapContentShape(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) return {};
  const nested = isRecord(value.content) ? value.content : null;
  if (!nested) return value;
  // Merge top-level metadata with nested content body.
  return { ...nested, ...value };
}

function buildQuizPayload(raw: unknown, fallbackTitle: string) {
  const normalized = unwrapContentShape(raw);
  const candidates = asArray(normalized.questions);
  const problems = asArray(normalized.problems);
  const questionSource = candidates.length > 0 ? candidates : problems;

  const questions = questionSource
    .map((item, idx) => {
      if (typeof item === 'string') {
        const question = toText(item);
        if (!question) return null;
        return {
          id: `q-${idx + 1}`,
          question,
          type: 'short_answer',
          options: [],
          correctAnswer: '',
          explanation: '',
        };
      }

      if (!isRecord(item)) return null;
      const question = toText(item.question) || toText(item.prompt);
      if (!question) return null;
      const options = asArray(item.options).map(toText).filter(Boolean);
      const correctAnswer = toText(item.correctAnswer) || toText(item.answer);

      return {
        id: toText(item.id) || `q-${idx + 1}`,
        question,
        type: toText(item.type) || (options.length ? 'multiple_choice' : 'short_answer'),
        options,
        correctAnswer,
        explanation: toText(item.explanation),
      };
    })
    .filter(Boolean);

  return {
    title: toText(normalized.title) || fallbackTitle,
    questions,
    totalPoints: questions.length,
  };
}

function buildFlashcardPayload(raw: unknown, fallbackTitle: string) {
  const normalized = unwrapContentShape(raw);
  const cardsSource = asArray(normalized.cards).length > 0
    ? asArray(normalized.cards)
    : asArray(normalized.flashcards);

  const cards = cardsSource
    .map((item, idx) => {
      if (typeof item === 'string') {
        const front = toText(item);
        if (!front) return null;
        return { id: `c-${idx + 1}`, front, back: '' };
      }

      if (!isRecord(item)) return null;
      const front = toText(item.front) || toText(item.term) || toText(item.question);
      if (!front) return null;
      return {
        id: toText(item.id) || `c-${idx + 1}`,
        front,
        back: toText(item.back) || toText(item.definition) || toText(item.answer),
        hint: toText(item.hint),
        category: toText(item.category),
      };
    })
    .filter(Boolean);

  return {
    title: toText(normalized.title) || fallbackTitle,
    cards,
  };
}

function mapMaterialTypeToContentType(materialType: string): TeacherContentType {
  switch (materialType) {
    case 'QUIZ':
      return TeacherContentType.QUIZ;
    case 'FLASHCARDS':
      return TeacherContentType.FLASHCARD_DECK;
    case 'WORKSHEET':
    case 'HOMEWORK':
      return TeacherContentType.WORKSHEET;
    default:
      return TeacherContentType.LESSON;
  }
}

function buildTeacherContentLike(
  material: PackageMaterial,
  purchase: PackagePurchase
): TeacherContent {
  const raw = getMaterialSource(material);
  const contentType = mapMaterialTypeToContentType(material.materialType);
  const normalized = unwrapContentShape(raw);

  const lessonPayload = {
    ...normalized,
    title: toText(normalized.title) || material.title,
    summary: toText(normalized.summary) || material.description || '',
    weeklyMaterialType: material.materialType,
  };

  const quizPayload = buildQuizPayload(raw, material.title);
  const flashcardPayload = buildFlashcardPayload(raw, material.title);

  return {
    id: `pkg-${material.id}`,
    teacherId: purchase.teacherId,
    title: material.title,
    description: material.description || '',
    subject: normalizeSubject(material.subject),
    gradeLevel: extractGradeLevel(purchase.config),
    contentType,
    sourceType: null,
    originalFileUrl: null,
    originalFileName: null,
    extractedText: null,
    lessonContent: contentType === TeacherContentType.QUIZ
      ? { title: material.title, summary: material.description || '' }
      : lessonPayload,
    quizContent: contentType === TeacherContentType.QUIZ ? quizPayload : null,
    flashcardContent: contentType === TeacherContentType.FLASHCARD_DECK ? flashcardPayload : null,
    infographicUrl: null,
    status: 'DRAFT',
    isPublic: false,
    publishedAt: null,
    sharedAt: null,
    shareCategory: null,
    downloadCount: 0,
    viewCount: 0,
    likeCount: 0,
    isFeatured: false,
    remixedFromId: null,
    templateId: null,
    tokensUsed: material.tokensUsed || 0,
    aiModelUsed: material.modelUsed || null,
    createdAt: material.createdAt,
    updatedAt: material.updatedAt,
  } as unknown as TeacherContent;
}

function flattenContentLines(value: unknown, lines: string[], prefix = '', depth = 0): void {
  if (lines.length >= 80 || depth > 4) return;

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    const text = String(value).trim();
    if (!text) return;
    lines.push(prefix ? `${prefix}: ${text}` : text);
    return;
  }

  if (Array.isArray(value)) {
    value.slice(0, 16).forEach((item) => flattenContentLines(item, lines, prefix, depth + 1));
    return;
  }

  if (isRecord(value)) {
    Object.entries(value)
      .slice(0, 20)
      .forEach(([key, nested]) => {
        if (['differentiatedContent', 'metadata', 'rawText'].includes(key)) return;
        flattenContentLines(nested, lines, titleCase(key), depth + 1);
      });
  }
}

function flattenContentLinesExtended(
  value: unknown,
  lines: string[],
  prefix = '',
  depth = 0,
  maxLines = 400
): void {
  if (lines.length >= maxLines || depth > 8) return;

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    const text = String(value).trim();
    if (!text) return;
    lines.push(prefix ? `${prefix}: ${text}` : text);
    return;
  }

  if (Array.isArray(value)) {
    value.slice(0, 120).forEach((item) => flattenContentLinesExtended(item, lines, prefix, depth + 1, maxLines));
    return;
  }

  if (isRecord(value)) {
    Object.entries(value)
      .slice(0, 150)
      .forEach(([key, nested]) => {
        if (key === 'metadata') return;
        flattenContentLinesExtended(nested, lines, titleCase(key), depth + 1, maxLines);
      });
  }
}

function wrapTextLines(input: string, maxWidth = 92): string[] {
  if (!input) return [''];
  const parts = input.split(/\s+/).filter(Boolean);
  if (!parts.length) return [''];

  const out: string[] = [];
  let current = '';
  for (const word of parts) {
    if (!current) {
      current = word;
      continue;
    }
    if ((current + ' ' + word).length <= maxWidth) {
      current += ` ${word}`;
    } else {
      out.push(current);
      current = word;
    }
  }
  if (current) out.push(current);
  return out;
}

function escapePdfText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function buildTextPdf(title: string, rawLines: string[]): Buffer {
  const normalizedLines = rawLines
    .flatMap((line) => {
      const stripped = String(line ?? '').replace(/[\t\r\n]+/g, ' ').trim();
      return wrapTextLines(stripped, 92);
    })
    .filter(Boolean)
    .slice(0, 2600);

  if (!normalizedLines.length) {
    normalizedLines.push('No content available.');
  }

  const linesPerPage = 44;
  const pages: string[][] = [];
  for (let i = 0; i < normalizedLines.length; i += linesPerPage) {
    pages.push(normalizedLines.slice(i, i + linesPerPage));
  }

  const objectCount = 3 + pages.length * 2;
  const objects: Record<number, string> = {};
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = `<< /Type /Pages /Count ${pages.length} /Kids [${pages.map((_, idx) => `${4 + idx * 2} 0 R`).join(' ')}] >>`;
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

  pages.forEach((pageLines, idx) => {
    const pageObj = 4 + idx * 2;
    const contentObj = pageObj + 1;
    const commands: string[] = [
      'BT',
      '/F1 12 Tf',
      '50 760 Td',
      `(${escapePdfText(idx === 0 ? title : `${title} (Page ${idx + 1})`)}) Tj`,
      '0 -18 Td',
    ];

    pageLines.forEach((line, lineIdx) => {
      if (lineIdx > 0) commands.push('0 -16 Td');
      commands.push(`(${escapePdfText(line)}) Tj`);
    });
    commands.push('ET');

    const stream = commands.join('\n');
    objects[pageObj] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObj} 0 R >>`;
    objects[contentObj] = `<< /Length ${Buffer.byteLength(stream, 'ascii')} >>\nstream\n${stream}\nendstream`;
  });

  let output = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (let i = 1; i <= objectCount; i += 1) {
    offsets[i] = Buffer.byteLength(output, 'ascii');
    output += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = Buffer.byteLength(output, 'ascii');
  output += `xref\n0 ${objectCount + 1}\n`;
  output += '0000000000 65535 f \n';
  for (let i = 1; i <= objectCount; i += 1) {
    output += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  output += `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\n`;
  output += `startxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(output, 'ascii');
}

function buildFallbackMaterialPdf(
  material: PackageMaterial,
  purchase: PackagePurchase
): Buffer {
  const lines: string[] = [
    `Material: ${material.title}`,
    `Type: ${titleCase(material.materialType)}`,
    `Subject: ${material.subject || 'General'}`,
    `Grade: ${extractGradeLevel(purchase.config)}`,
    '',
  ];

  if (material.description) {
    lines.push(`Summary: ${material.description}`, '');
  }

  const source = unwrapContentShape(getMaterialSource(material));
  flattenContentLinesExtended(source, lines, '', 0, 2200);

  return buildTextPdf(material.title, lines);
}

function buildFallbackPackagePdf(purchase: PackageWithWeeks): Buffer {
  const lines: string[] = [
    `Package: ${purchase.packageName}`,
    `Tier: ${purchase.packageTier}`,
    `Materials: ${purchase.generatedCount}/${purchase.totalMaterials}`,
    `Generated: ${new Date().toISOString()}`,
    '',
  ];

  for (const week of purchase.weeks) {
    lines.push(`Week ${week.weekNumber}: ${week.weekLabel}`);
    for (const material of week.materials) {
      lines.push(`  - ${material.title} (${titleCase(material.materialType)})`);
      if (material.description) lines.push(`    ${material.description}`);
      const materialLines: string[] = [];
      flattenContentLinesExtended(unwrapContentShape(getMaterialSource(material)), materialLines, '', 0, 140);
      materialLines.forEach((line) => lines.push(`    ${line}`));
      lines.push('');
    }
  }

  return buildTextPdf(purchase.packageName, lines);
}

async function generateMaterialPdf(
  material: PackageMaterial,
  purchase: PackagePurchase
): Promise<Buffer> {
  const teacherContent = buildTeacherContentLike(material, purchase);
  try {
    const pdfResult = await exportContent(teacherContent, {
      format: 'pdf',
      includeAnswers: true,
      includeTeacherNotes: true,
      paperSize: 'letter',
      colorScheme: 'color',
    });
    return pdfResult.data as Buffer;
  } catch (error) {
    logger.warn('Primary material PDF export failed; using fallback PDF', {
      materialId: material.id,
      purchaseId: material.purchaseId,
      error,
    });
    return buildFallbackMaterialPdf(material, purchase);
  }
}

async function generatePackagePdf(
  purchase: PackageWithWeeks,
  options?: ExportOptions
): Promise<Buffer> {
  const materials = purchase.weeks.flatMap((week) => week.materials);
  const contents = materials.map((material) => buildTeacherContentLike(material, purchase));
  try {
    const pdfResult = await exportMultipleContent(contents, {
      format: 'pdf',
      includeAnswers: options?.includeAnswer ?? true,
      includeTeacherNotes: true,
      paperSize: 'letter',
      colorScheme: 'color',
    });
    return pdfResult.data as Buffer;
  } catch (error) {
    logger.warn('Primary package PDF export failed; using fallback PDF', {
      purchaseId: purchase.id,
      error,
    });
    return buildFallbackPackagePdf(purchase);
  }
}

async function buildSingleMaterialPptx(
  material: PackageMaterial,
  purchase: PackagePurchase
): Promise<Buffer> {
  const pptx = createPptx();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Orbit Learn';
  pptx.company = 'Orbit Learn';
  pptx.subject = 'Teaching Material';
  pptx.title = material.title;

  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: 'F8FAFC' };
  titleSlide.addText(material.title, {
    x: 0.6, y: 0.8, w: 12, h: 1.0,
    fontFace: 'Aptos Display', fontSize: 30, bold: true, color: '1E2A3A',
  });
  titleSlide.addText(
    `${titleCase(material.materialType)} | ${material.subject || 'General'} | Grade ${extractGradeLevel(purchase.config)}`,
    {
      x: 0.6, y: 2.0, w: 12, h: 0.6,
      fontFace: 'Aptos', fontSize: 15, color: '4B5563',
    }
  );
  if (material.description) {
    titleSlide.addText(material.description, {
      x: 0.6, y: 2.8, w: 12, h: 1.4,
      fontFace: 'Aptos', fontSize: 14, color: '374151',
      valign: 'top',
    });
  }

  const lines: string[] = [];
  flattenContentLines(unwrapContentShape(getMaterialSource(material)), lines);
  const displayLines = lines.filter(Boolean).slice(0, 48);
  const chunks: string[][] = [];
  for (let i = 0; i < displayLines.length; i += 12) {
    chunks.push(displayLines.slice(i, i + 12));
  }

  if (chunks.length === 0) chunks.push(['Content generated and ready to use.']);

  chunks.forEach((chunk, idx) => {
    const slide = pptx.addSlide();
    slide.addText(`${material.title}${chunks.length > 1 ? ` (${idx + 1}/${chunks.length})` : ''}`, {
      x: 0.6, y: 0.4, w: 12, h: 0.6,
      fontFace: 'Aptos Display', fontSize: 20, bold: true, color: '1E2A3A',
    });
    slide.addShape(pptx.ShapeType.line, {
      x: 0.6, y: 1.1, w: 12, h: 0,
      line: { color: 'D1D5DB', width: 1 },
    });
    slide.addText(chunk.map((line) => `• ${line}`).join('\n'), {
      x: 0.8, y: 1.4, w: 11.5, h: 5.5,
      fontFace: 'Aptos', fontSize: 17, color: '111827',
      valign: 'top',
      breakLine: true,
    });
  });

  return pptx.write({ outputType: 'nodebuffer' }) as Promise<Buffer>;
}

async function buildPackagePptx(
  purchase: PackageWithWeeks
): Promise<Buffer> {
  const pptx = createPptx();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Orbit Learn';
  pptx.company = 'Orbit Learn';
  pptx.subject = 'Package Export';
  pptx.title = purchase.packageName;

  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: 'F8FAFC' };
  titleSlide.addText(purchase.packageName, {
    x: 0.6, y: 0.8, w: 12, h: 1.0,
    fontFace: 'Aptos Display', fontSize: 32, bold: true, color: '1E2A3A',
  });
  titleSlide.addText(
    `Package Slides | ${purchase.generatedCount}/${purchase.totalMaterials} materials`,
    {
      x: 0.6, y: 2.1, w: 12, h: 0.7,
      fontFace: 'Aptos', fontSize: 16, color: '4B5563',
    }
  );
  titleSlide.addText(`Exported on ${new Date().toLocaleDateString()}`, {
    x: 0.6, y: 2.9, w: 12, h: 0.5,
    fontFace: 'Aptos', fontSize: 13, color: '6B7280',
  });

  for (const week of purchase.weeks) {
    for (const material of week.materials) {
      const slide = pptx.addSlide();
      slide.addText(material.title, {
        x: 0.6, y: 0.4, w: 12, h: 0.6,
        fontFace: 'Aptos Display', fontSize: 20, bold: true, color: '1E2A3A',
      });
      slide.addText(
        `Week ${week.weekNumber} • ${week.weekLabel} • ${titleCase(material.materialType)} • ${material.subject || 'General'}`,
        {
          x: 0.6, y: 1.0, w: 12, h: 0.5,
          fontFace: 'Aptos', fontSize: 12, color: '6B7280',
        }
      );
      slide.addShape(pptx.ShapeType.line, {
        x: 0.6, y: 1.45, w: 12, h: 0,
        line: { color: 'D1D5DB', width: 1 },
      });

      const lines: string[] = [];
      flattenContentLines(unwrapContentShape(getMaterialSource(material)), lines);
      const preview = lines.slice(0, 10);
      slide.addText(
        (preview.length ? preview : ['Content generated and ready to use.']).map((line) => `• ${line}`).join('\n'),
        {
          x: 0.8, y: 1.8, w: 11.5, h: 5.1,
          fontFace: 'Aptos', fontSize: 15, color: '111827',
          valign: 'top',
          breakLine: true,
        }
      );
    }
  }

  return pptx.write({ outputType: 'nodebuffer' }) as Promise<Buffer>;
}

// =============================================================================
// PACKAGE ZIP EXPORT
// =============================================================================

async function exportPackageZip(
  purchaseId: string,
  teacherId: string,
  options?: ExportOptions
): Promise<ExportResult> {
  const purchase = await prisma.packagePurchase.findFirst({
    where: { id: purchaseId, teacherId },
    include: {
      weeks: {
        orderBy: { weekNumber: 'asc' },
        include: {
          materials: {
            where: { status: { in: ['PKG_GENERATED', 'PKG_APPROVED', 'PKG_EDITED'] } },
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  }) as PackageWithWeeks | null;

  if (!purchase) throw new AppError('Package not found', 404);
  const materials = purchase.weeks.flatMap((week) => week.materials);
  if (!materials.length) {
    throw new AppError('No generated materials available to export yet', 400);
  }

  let pdfBuffer: Buffer | null = null;
  let pptxBuffer: Buffer | null = null;
  const generationWarnings: string[] = [];
  const [pdfResult, pptxResult] = await Promise.allSettled([
    generatePackagePdf(purchase, options),
    buildPackagePptx(purchase),
  ]);

  if (pdfResult.status === 'fulfilled') {
    pdfBuffer = pdfResult.value;
  } else {
    generationWarnings.push(`PDF generation failed: ${errorToMessage(pdfResult.reason)}`);
  }

  if (pptxResult.status === 'fulfilled') {
    pptxBuffer = pptxResult.value;
  } else {
    generationWarnings.push(`PPTX generation failed: ${errorToMessage(pptxResult.reason)}`);
  }

  if (!pdfBuffer && !pptxBuffer) {
    logger.error('Package export generation failed (all formats)', {
      purchaseId,
      warnings: generationWarnings,
    });
    throw new AppError('Failed to generate package files. Please try again.', 500);
  }

  const zip = new JSZip();
  const baseName = slugify(purchase.packageName);
  const packageTitle = safeFilename(purchase.packageName, 'Package');
  if (pdfBuffer) {
    zip.file(`${baseName}/${packageTitle} - Full Package.pdf`, pdfBuffer);
  }
  if (pptxBuffer) {
    zip.file(`${baseName}/${packageTitle} - Full Package.pptx`, pptxBuffer);
  }
  zip.file(
    `${baseName}/README.txt`,
    [
      `Package: ${purchase.packageName}`,
      `Tier: ${purchase.packageTier}`,
      `Materials included: ${materials.length}`,
      `Generated at: ${new Date().toISOString()}`,
      '',
      'This download contains generated package assets.',
      ...(pdfBuffer ? ['- Included: Full Package PDF'] : ['- PDF was not included due to a generation issue.']),
      ...(pptxBuffer ? ['- Included: Full Package PPTX'] : ['- PPTX was not included due to a generation issue.']),
      ...(generationWarnings.length > 0 ? ['', 'Generation notes:', ...generationWarnings] : []),
    ].join('\n')
  );

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  const filename = `${baseName}-${purchase.id.slice(0, 8)}-full-package.zip`;

  try {
    const storagePath = `teacher/${teacherId}/packages/${filename}`;
    const stored = await uploadFile('aiContent', storagePath, zipBuffer, 'application/zip');

    logger.info('Package exported as ZIP', {
      purchaseId,
      filename,
      materials: materials.length,
      sizeBytes: zipBuffer.length,
    });
    return { downloadUrl: stored.publicUrl, filename, sizeBytes: zipBuffer.length };
  } catch (error) {
    logger.error('Package export failed', { purchaseId, error });
    throw new AppError('Failed to upload package export. Please try again.', 500);
  }
}

// =============================================================================
// SINGLE MATERIAL EXPORT
// =============================================================================

async function exportMaterial(
  materialId: string,
  teacherId: string
): Promise<ExportResult> {
  let material = await prisma.packageMaterial.findFirst({
    where: { id: materialId, purchase: { teacherId } },
    include: {
      purchase: true,
    },
  }) as MaterialWithPurchase | null;

  if (!material) throw new AppError('Material not found', 404);

  // On-demand generation: if material has no content, generate it now
  if (!material.content && ['PKG_PENDING', 'PKG_FAILED'].includes(material.status)) {
    await packageGenerationService.generateMaterialOnDemand(material.id, teacherId);
    // Reload with fresh content
    material = await prisma.packageMaterial.findFirst({
      where: { id: materialId, purchase: { teacherId } },
      include: { purchase: true },
    }) as MaterialWithPurchase;
    if (!material?.content) {
      throw new AppError('Material generation failed. Please try again.', 500);
    }
  }

  let pdfBuffer: Buffer | null = null;
  let pptxBuffer: Buffer | null = null;
  const generationWarnings: string[] = [];
  const [pdfResult, pptxResult] = await Promise.allSettled([
    generateMaterialPdf(material, material.purchase),
    buildSingleMaterialPptx(material, material.purchase),
  ]);

  if (pdfResult.status === 'fulfilled') {
    pdfBuffer = pdfResult.value;
  } else {
    generationWarnings.push(`PDF generation failed: ${errorToMessage(pdfResult.reason)}`);
  }

  if (pptxResult.status === 'fulfilled') {
    pptxBuffer = pptxResult.value;
  } else {
    generationWarnings.push(`PPTX generation failed: ${errorToMessage(pptxResult.reason)}`);
  }

  if (!pdfBuffer && !pptxBuffer) {
    logger.error('Package material generation failed (all formats)', {
      materialId,
      purchaseId: material.purchaseId,
      warnings: generationWarnings,
    });
    throw new AppError('Failed to generate material files. Please try again.', 500);
  }

  const materialSlug = slugify(material.title);
  const materialTitle = safeFilename(material.title, 'Material');
  const zip = new JSZip();
  if (pdfBuffer) {
    zip.file(`${materialSlug}/${materialTitle}.pdf`, pdfBuffer);
  }
  if (pptxBuffer) {
    zip.file(`${materialSlug}/${materialTitle}.pptx`, pptxBuffer);
  }
  zip.file(
    `${materialSlug}/README.txt`,
    [
      `Material: ${material.title}`,
      `Generated at: ${new Date().toISOString()}`,
      '',
      ...(pdfBuffer ? ['- Included: PDF'] : ['- PDF was not included due to a generation issue.']),
      ...(pptxBuffer ? ['- Included: PPTX'] : ['- PPTX was not included due to a generation issue.']),
      ...(generationWarnings.length > 0 ? ['', 'Generation notes:', ...generationWarnings] : []),
    ].join('\n')
  );

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const filename = `${materialSlug}-${material.id.slice(0, 8)}.zip`;

  try {
    const storagePath = `teacher/${teacherId}/packages/materials/${filename}`;
    const stored = await uploadFile('aiContent', storagePath, zipBuffer, 'application/zip');
    logger.info('Package material exported', {
      materialId,
      purchaseId: material.purchaseId,
      filename,
      sizeBytes: zipBuffer.length,
    });
    return { downloadUrl: stored.publicUrl, filename, sizeBytes: zipBuffer.length };
  } catch (error) {
    logger.error('Package material export failed', {
      materialId,
      purchaseId: material.purchaseId,
      error,
    });
    throw new AppError('Failed to upload material export. Please try again.', 500);
  }
}

export const packageExportService = {
  exportPackageZip,
  exportMaterial,
};
