/**
 * Generate custom icons for the Special Ed landing page pain points
 * Run with: npx tsx scripts/generatePainPointIcons.ts
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface IconConfig {
  name: string;
  filename: string;
  prompt: string;
}

const icons: IconConfig[] = [
  {
    name: 'IEP Season Overwhelm',
    filename: 'pain-iep-overwhelm.png',
    prompt: `A single simple icon showing a teacher or person looking stressed, surrounded by a towering stack of paper documents and folders. The papers should have checkboxes or forms visible. The person looks overwhelmed but determined. Style should be warm and empathetic, not scary.`,
  },
  {
    name: 'Sick Day Scramble',
    filename: 'pain-sick-day.png',
    prompt: `A single simple icon showing a person in bed or on a couch, looking sick with a thermometer or tissue, but still typing on a laptop or phone - trying to send sub plans while sick. Show a clock indicating early morning (6am). The mood should be relatable and sympathetic.`,
  },
  {
    name: '60% Paperwork',
    filename: 'pain-paperwork-burden.png',
    prompt: `A single simple icon showing a split scene: on one side, a teacher surrounded by papers, forms, and a computer with spreadsheets. On the other side, students waiting or looking hopeful but separated from the teacher by the wall of paperwork. Show the contrast between paperwork burden vs actual teaching.`,
  },
];

async function generateIcon(config: IconConfig): Promise<Buffer> {
  console.log(`\nGenerating icon: ${config.name}...`);

  const model = genAI.getGenerativeModel({
    model: 'gemini-3-pro-image-preview', // Better quality than gemini-2.0-flash-exp
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
  });

  const enhancedPrompt = `Create a simple, stylized icon illustration for a professional teacher website.

SUBJECT:
${config.prompt}

STYLE REQUIREMENTS:
- Simple, clean icon style suitable for a website section
- Soft, rounded shapes with gentle gradients
- Color palette: Use warm forest greens (#2D5A3D), soft golds (#C4A962), cream whites, and muted purples
- The icon should work well on a dark green background
- Modern, professional look - like high-end SaaS website icons
- Slightly 3D or isometric style with subtle shadows
- Size should be suitable as a decorative icon (will display around 80-100px)

CRITICAL:
- NO text, words, letters, or numbers in the image
- Keep it simple and readable at small sizes
- Single focal point, not too busy
- Professional and empathetic tone (these are teacher pain points)
- The image should be appropriate for all audiences`;

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
      console.log(`  ✓ Generated ${config.name} (${inlineData.mimeType})`);
      return Buffer.from(inlineData.data, 'base64');
    }
  }

  throw new Error('No image data in response');
}

async function main() {
  console.log('='.repeat(50));
  console.log('Generating Pain Point Icons for Landing Page');
  console.log('='.repeat(50));

  // Output directory
  const outputDir = path.join(__dirname, '../../frontend/public/assets/landing');

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created directory: ${outputDir}`);
  }

  for (const icon of icons) {
    try {
      const imageBuffer = await generateIcon(icon);
      const outputPath = path.join(outputDir, icon.filename);
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`  → Saved to: ${outputPath}`);
    } catch (error) {
      console.error(`  ✗ Failed to generate ${icon.name}:`, error);
    }

    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n' + '='.repeat(50));
  console.log('Done! Update the landing page HTML to use these images:');
  console.log('');
  console.log('  <img src="assets/landing/pain-iep-overwhelm.png" alt="IEP Overwhelm">');
  console.log('  <img src="assets/landing/pain-sick-day.png" alt="Sick Day">');
  console.log('  <img src="assets/landing/pain-paperwork-burden.png" alt="Paperwork Burden">');
  console.log('='.repeat(50));
}

main().catch(console.error);
