/**
 * Script to generate decorative assets for the blog page redesign
 * Run with: npx tsx scripts/generateBlogPageAssets.ts
 */

import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY not found in environment');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Output directory for generated images
const OUTPUT_DIR = path.join(__dirname, '../../frontend/public/images/blog');

// Decorative assets for the blog page
const BLOG_PAGE_ASSETS = [
  {
    name: 'blog-hero-texture',
    prompt: `Create an abstract, warm decorative texture for a premium educational blog.

STYLE: Soft, organic flowing shapes reminiscent of paper texture or watercolor washes
COLOR PALETTE: Warm cream (#FDF8F3) as base with subtle hints of:
- Soft terracotta/rust tones (#D4A574, #C4956A)
- Muted sage green accents (#9CAF88)
- Gentle gold highlights (#E8D5B7)

COMPOSITION:
- Flowing, organic curves and waves
- Subtle gradient transitions between colors
- Areas of lighter and darker tones for depth
- No sharp edges - everything soft and blended

MOOD: Warm, inviting, sophisticated, like the pages of a luxury magazine
AVOID: Text, geometric shapes, harsh lines, neon colors, patterns that look digital

The texture should be subtle enough to use as a background with text overlay, but interesting enough to add visual warmth.

OUTPUT: Landscape orientation (16:9), high resolution suitable for web hero section.`,
  },
  {
    name: 'blog-decorative-corner',
    prompt: `Create a decorative corner flourish element for a premium educational blog.

STYLE: Elegant, organic botanical-inspired illustration
COLOR PALETTE:
- Deep teal (#2D5A5A) as primary
- Warm terracotta (#D4A574) as accent
- Soft gold (#E8D5B7) highlights
- Transparent/white background

COMPOSITION:
- Flowing leaves, subtle vine-like curves
- Position in corner (as if decorating top-right corner of a page)
- Asymmetric, natural growth pattern
- Some elements more detailed, some abstract brush strokes

MOOD: Sophisticated, natural, editorial, like decorative elements in high-end magazines
AVOID: Cartoonish, childish, symmetrical patterns, neon colors, text

The element should feel hand-painted, organic, and premium - something you'd see in a luxury lifestyle publication.

OUTPUT: Square format with transparent areas, high resolution.`,
  },
];

async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    const enhancedPrompt = `${prompt}

UNIVERSAL REQUIREMENTS:
- The image must be completely safe and appropriate for all audiences
- Do NOT include any readable text, words, letters, or numbers
- High-resolution, professional quality suitable for web use
- Consistent lighting and color grading`;

    console.log(`  Generating with prompt: "${prompt.substring(0, 60)}..."`);

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
      console.error('  No response parts');
      return null;
    }

    for (const part of parts) {
      if ((part as any).inlineData) {
        const inlineData = (part as any).inlineData;
        const buffer = Buffer.from(inlineData.data, 'base64');
        return buffer;
      }
    }

    console.error('  No image data in response');
    return null;
  } catch (error) {
    console.error('  Generation error:', error);
    return null;
  }
}

async function main() {
  console.log('Blog Page Assets Generator\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Created output directory\n');
  }

  const results: { name: string; success: boolean; path?: string }[] = [];

  for (let i = 0; i < BLOG_PAGE_ASSETS.length; i++) {
    const { name, prompt } = BLOG_PAGE_ASSETS[i];
    console.log(`[${i + 1}/${BLOG_PAGE_ASSETS.length}] Generating: ${name}`);

    const imageBuffer = await generateImage(prompt);

    if (imageBuffer) {
      const outputPath = path.join(OUTPUT_DIR, `${name}.jpg`);
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`  ✓ Saved: ${outputPath}\n`);
      results.push({ name, success: true, path: outputPath });
    } else {
      console.log(`  ✗ Failed to generate: ${name}\n`);
      results.push({ name, success: false });
    }

    // Add delay between requests
    if (i < BLOG_PAGE_ASSETS.length - 1) {
      console.log('  Waiting 5 seconds before next request...\n');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Generation Summary:');
  console.log('='.repeat(60));
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  console.log(`✓ Successful: ${successful}`);
  console.log(`✗ Failed: ${failed}`);

  if (successful > 0) {
    console.log('\nGenerated assets:');
    results
      .filter((r) => r.success)
      .forEach((r) => {
        console.log(`  ✓ ${r.name}.jpg`);
      });
  }

  console.log('\nDone!');
}

main().catch(console.error);
