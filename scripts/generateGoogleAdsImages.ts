/**
 * Generate Google Ads images for the Teacher Portal campaign
 * Run with: npx tsx scripts/generateGoogleAdsImages.ts
 *
 * Generates:
 * - 7 square images (1:1 ratio) for responsive display ads
 * - 7 horizontal images (1.91:1 ratio) for responsive display ads
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface AdImageConfig {
  name: string;
  filename: string;
  prompt: string;
}

// Ad concepts that work for both square and horizontal
const adConcepts: Omit<AdImageConfig, 'filename'>[] = [
  {
    name: 'Happy Teacher with AI',
    prompt: `A happy, relieved Special Education teacher sitting at a clean, organized desk with a laptop showing a simple checkmark or completion indicator. The teacher looks relaxed and confident. Warm lighting, modern classroom setting. The mood is positive and empowering - technology making their job easier.`,
  },
  {
    name: 'IEP Goals Magic',
    prompt: `A stylized illustration showing IEP paperwork/documents on one side transforming into organized, neat goals on the other side, with magical sparkles or light effects in between suggesting AI transformation. Use warm greens and golds. The transformation should feel effortless and satisfying.`,
  },
  {
    name: 'Time Saved Clock',
    prompt: `A creative illustration of a clock or hourglass where sand/time is being saved or reversed. Show a teacher figure gaining back hours. Include visual elements like a stack of papers shrinking or disappearing. The mood should be hopeful and liberating. Warm colors with green and gold accents.`,
  },
  {
    name: 'Sick Day Relief',
    prompt: `A cozy illustration of a teacher at home (couch or bed) looking relieved while their phone or tablet shows sub plans being sent/completed. Include a cup of tea and comfortable elements. The mood is calm and reassuring - they can rest because the AI has it handled. Soft, warm colors.`,
  },
  {
    name: 'Teacher with Students',
    prompt: `A heartwarming scene of a Special Ed teacher actually teaching and connecting with diverse students in a classroom, while paperwork/documents are minimized or in the background. The focus is on human connection and teaching. Bright, warm, inclusive atmosphere.`,
  },
  {
    name: 'Multiple Tools Dashboard',
    prompt: `A clean, modern illustration showing multiple teaching tools/icons (lesson plans, quizzes, IEP goals, sub plans) arranged in an organized dashboard or toolkit layout. Each tool has a friendly icon. The overall feeling is organized, powerful, and accessible. Use greens, golds, and cream colors.`,
  },
  {
    name: 'Before After Stress',
    prompt: `A split illustration: Left side shows a stressed teacher buried in papers with messy desk and worried expression. Right side shows the same teacher relaxed, organized desk, smiling, with a laptop. The transformation is dramatic but tasteful. Warm lighting on the "after" side.`,
  },
];

async function generateImage(prompt: string, aspectRatio: 'square' | 'horizontal'): Promise<Buffer> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-pro-image-preview', // Better quality than gemini-2.0-flash-exp
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
  });

  const aspectInstructions = aspectRatio === 'square'
    ? `Create a SQUARE composition (1:1 aspect ratio). Center the main subject with balanced negative space on all sides.`
    : `Create a WIDE HORIZONTAL composition (approximately 1.91:1 aspect ratio, like a banner). Spread elements across the width, with the main subject slightly off-center for visual interest.`;

  const enhancedPrompt = `Create a professional advertisement illustration for an AI-powered teacher tool called "Orbit Learn" that helps Special Education teachers with IEP goals and substitute plans.

TARGET AUDIENCE: US/Canada Special Education teachers who are overwhelmed with paperwork.

SUBJECT TO ILLUSTRATE:
${prompt}

COMPOSITION:
${aspectInstructions}

STYLE REQUIREMENTS:
- Clean, modern SaaS/tech company aesthetic
- Warm and inviting, not cold or corporate
- Color palette: Forest greens (#2D5A3D), warm golds (#C4A962), cream whites, soft purples
- Soft gradients and gentle shadows
- Professional quality suitable for Google Ads
- Should feel trustworthy, helpful, and empowering
- Style similar to top EdTech companies like Canva, Notion, or Duolingo

CRITICAL REQUIREMENTS:
- NO text, words, letters, numbers, or logos in the image
- NO Orbit Learn branding - keep it generic enough for ad use
- All people should appear diverse, friendly, and professional
- Safe for all audiences
- High quality, sharp, professional`;

  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: enhancedPrompt }],
      },
    ],
    generationConfig: {
      responseModalities: ['image', 'text'],
    },
  } as any);

  const response = result.response;
  const parts = response.candidates?.[0]?.content?.parts;

  if (!parts) {
    throw new Error('No response parts from image generation');
  }

  for (const part of parts) {
    if ((part as any).inlineData) {
      const inlineData = (part as any).inlineData;
      return Buffer.from(inlineData.data, 'base64');
    }
  }

  throw new Error('No image data in response');
}

async function main() {
  console.log('='.repeat(60));
  console.log('Generating Google Ads Images for Teacher Portal Campaign');
  console.log('='.repeat(60));
  console.log('');

  // Output directories
  const squareDir = path.join(__dirname, '../../frontend/public/assets/google-ads/square');
  const horizontalDir = path.join(__dirname, '../../frontend/public/assets/google-ads/horizontal');

  // Create directories
  for (const dir of [squareDir, horizontalDir]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  }

  console.log('');
  console.log('Generating 7 SQUARE images (1:1)...');
  console.log('-'.repeat(40));

  for (let i = 0; i < adConcepts.length; i++) {
    const concept = adConcepts[i];
    const filename = `ad-square-${i + 1}-${concept.name.toLowerCase().replace(/\s+/g, '-')}.png`;

    try {
      console.log(`\n[${i + 1}/7] ${concept.name}...`);
      const imageBuffer = await generateImage(concept.prompt, 'square');
      const outputPath = path.join(squareDir, filename);
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`  ✓ Saved: ${filename}`);
    } catch (error) {
      console.error(`  ✗ Failed: ${error}`);
    }

    // Delay between requests
    if (i < adConcepts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('');
  console.log('Generating 7 HORIZONTAL images (1.91:1)...');
  console.log('-'.repeat(40));

  for (let i = 0; i < adConcepts.length; i++) {
    const concept = adConcepts[i];
    const filename = `ad-horizontal-${i + 1}-${concept.name.toLowerCase().replace(/\s+/g, '-')}.png`;

    try {
      console.log(`\n[${i + 1}/7] ${concept.name}...`);
      const imageBuffer = await generateImage(concept.prompt, 'horizontal');
      const outputPath = path.join(horizontalDir, filename);
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`  ✓ Saved: ${filename}`);
    } catch (error) {
      console.error(`  ✗ Failed: ${error}`);
    }

    // Delay between requests
    if (i < adConcepts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('DONE! Generated 14 images total.');
  console.log('');
  console.log('Square images (1:1):');
  console.log(`  ${squareDir}`);
  console.log('');
  console.log('Horizontal images (1.91:1):');
  console.log(`  ${horizontalDir}`);
  console.log('');
  console.log('Google Ads Specs:');
  console.log('  - Square: Recommended 1200x1200, min 300x300');
  console.log('  - Horizontal: Recommended 1200x628, min 600x314');
  console.log('='.repeat(60));
}

main().catch(console.error);
