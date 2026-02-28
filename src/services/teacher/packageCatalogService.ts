/**
 * Package Catalog Service — Serves the DTC product catalog and generates sample previews
 */

import { PackageCategory, PackageTier } from '@prisma/client';
import { DTC_PRODUCTS, getDTCProduct, getDTCProducts, getDTCProductsByCategory, DTCProduct } from '../../config/stripeProductsDTC.js';
import { contextAssemblerService } from './contextAssemblerService.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// CATALOG QUERIES
// =============================================================================

function getProducts(category?: PackageCategory): DTCProduct[] {
  return getDTCProducts(category);
}

function getProduct(tier: PackageTier): DTCProduct {
  return getDTCProduct(tier);
}

function getProductsByCategory(): Record<PackageCategory, DTCProduct[]> {
  return getDTCProductsByCategory();
}

// =============================================================================
// SAMPLE PREVIEW — Generate 3-4 sample items using teacher context
// =============================================================================

interface SampleItem {
  type: string;
  title: string;
  description: string;
  subject?: string;
}

async function getProductSamples(tier: PackageTier, teacherId: string): Promise<SampleItem[]> {
  const product = getDTCProduct(tier);

  try {
    const context = await contextAssemblerService.assembleContext(teacherId, 'CONTENT_GENERATION');
    const additionalContext = contextAssemblerService.buildAdditionalContextString(context);

    const model = genAI.getGenerativeModel({
      model: config.gemini.models.flash,
      safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    });

    const prompt = `You are generating sample content previews for a teacher product package.

Product: ${product.name}
Description: ${product.description}
Resource Estimate: ${product.resourceEstimate}

${additionalContext}

Generate exactly 4 sample items that would be included in this package. Each should show the kind of personalized content the teacher would receive.

Return a JSON array with exactly 4 objects:
[
  { "type": "lesson" | "quiz" | "worksheet" | "warm_up" | "exit_ticket" | "activity", "title": "...", "description": "A 1-2 sentence preview", "subject": "..." }
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed.slice(0, 4) : [];
  } catch (error) {
    logger.error('Failed to generate product samples', { tier, teacherId, error });
    // Return static fallback samples
    return getStaticSamples(product);
  }
}

function getStaticSamples(product: DTCProduct): SampleItem[] {
  const samples: SampleItem[] = [
    { type: 'lesson', title: 'Personalized lesson plan', description: 'A standards-aligned lesson customized to your teaching style and students.' },
    { type: 'worksheet', title: 'Differentiated worksheet', description: 'Practice materials with above, on-level, and below-grade versions.' },
    { type: 'quiz', title: 'Formative assessment', description: 'Quick check for understanding aligned to the lesson objectives.' },
    { type: 'warm_up', title: 'Bell-ringer activity', description: 'Engaging warm-up to activate prior knowledge.' },
  ];
  return samples;
}

export const packageCatalogService = {
  getProducts,
  getProduct,
  getProductsByCategory,
  getProductSamples,
};
