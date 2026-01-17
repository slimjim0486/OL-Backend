/**
 * Script to generate images for the two new blog posts
 * Run with: npx tsx scripts/generateNewBlogImages.ts
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

// New blog post image prompts
const NEW_BLOG_IMAGE_PROMPTS = [
  {
    name: 'bilingual-children-gulf',
    altText: 'Multi-generational Gulf family sharing a bilingual learning moment with Arabic and English books',
    prompt: `Create a warm, emotionally resonant illustration for a blog post about bilingual children in Gulf families.

SCENE COMPOSITION: A cozy Middle Eastern living room with a multi-generational family moment. A young child (around 7 years old) sits between their parent and grandparent. On the coffee table, there are both Arabic and English children's books visible. The child has a thoughtful, slightly uncertain expression - caught between two worlds but surrounded by love.

THE FAMILY: A mother or father in their 30s-40s, dressed in a mix of modern and traditional Gulf attire. A grandmother or grandfather in traditional Emirati/Gulf clothing (kandura, abaya, or similar). The child in casual modern clothes. All have warm, supportive expressions.

ENVIRONMENT: A warm, inviting Gulf-style living room - comfortable majlis seating with traditional cushions, modern touches mixed with cultural elements. A traditional Arabic coffee pot (dallah) on the table alongside children's books in both Arabic and English scripts.

EMOTIONAL TONE: The core message is "two languages, one loving family." The image should feel hopeful and supportive, not stressful. Show the beauty and complexity of bilingual upbringing - the child is cherished regardless of which language they speak.

LIGHTING: Warm, golden evening light suggesting a comfortable family gathering. Soft and embracing.

COLOR PALETTE: Warm, nurturing colors - golden yellows, soft teals, warm browns, cream tones. Cozy and inviting with subtle Gulf cultural elements.

STYLE: Modern illustration style, slightly stylized but not cartoonish. Soft edges, expressive faces, professional quality suitable for a blog header. The atmosphere should feel like home and belonging.`,
  },
  {
    name: 'neurodiverse-learning-support',
    altText: 'Parent and child having a breakthrough learning moment with supportive tools and technology',
    prompt: `Create an empowering, emotionally resonant illustration for a blog post about supporting neurodiverse children with learning differences.

SCENE COMPOSITION: A bright, organized home study space where a parent and child (around 9-10 years old) are working together. The child's face shows a moment of "aha!" understanding - that breakthrough moment when something finally clicks. Around them are various learning tools: colorful visual aids, a tablet showing an educational app, fidget tools on the desk, noise-canceling headphones nearby.

THE CHILD: A confident, engaged child (Middle Eastern or South Asian features to represent Gulf region families) showing genuine excitement at understanding something. NOT struggling or sad - this is the "after" moment of success. Eyes bright, maybe pointing at something on the tablet with pride.

THE PARENT: Patient, supportive body language without hovering. Perhaps sitting beside the child at eye level, showing encouragement and joy at the child's success. Their expression shows pride and relief.

LEARNING ENVIRONMENT: A home study space that feels organized but not clinical - colorful but calming. Visual schedule or chart on the wall, good lighting, plants adding life. The space feels designed for success.

EMOTIONAL TONE: The core message is "different, not less" - showing a child who is thriving with the right support. Hope, capability, breakthrough, and joy. This is NOT about struggle - it's about success.

LIGHTING: Bright, optimistic light streaming through a window suggesting possibility and hope. Warm and energizing.

COLOR PALETTE: Uplifting colors - soft purples, calming blues, warm oranges and yellows. The palette should feel hopeful and modern.

STYLE: Modern, clean illustration style - welcoming and professional. Soft but clear edges, expressive faces showing genuine emotion. Professional quality suitable for a blog header about neurodiversity and learning differences.`,
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

UNIVERSAL REQUIREMENTS FOR THIS IMAGE:
- The image must be completely safe and appropriate for children of all ages
- Do NOT include any readable text, words, letters, or numbers in the image
- All characters should appear friendly, warm, and welcoming
- Include diverse representation where multiple people are shown
- The final image should be high-resolution and suitable for professional blog use
- Render with consistent lighting and color grading throughout the scene
- Aspect ratio should be landscape (16:9 or similar) suitable for blog headers`;

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
  console.log('New Blog Post Image Generator\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Created output directory\n');
  }

  const results: { name: string; altText: string; success: boolean; path?: string }[] = [];

  for (let i = 0; i < NEW_BLOG_IMAGE_PROMPTS.length; i++) {
    const { name, altText, prompt } = NEW_BLOG_IMAGE_PROMPTS[i];
    console.log(`[${i + 1}/${NEW_BLOG_IMAGE_PROMPTS.length}] Generating: ${name}`);
    console.log(`  Alt text: "${altText}"`);

    const imageBuffer = await generateImage(prompt);

    if (imageBuffer) {
      const outputPath = path.join(OUTPUT_DIR, `${name}.jpg`);
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`  ✓ Saved: ${outputPath}\n`);
      results.push({ name, altText, success: true, path: outputPath });
    } else {
      console.log(`  ✗ Failed to generate: ${name}\n`);
      results.push({ name, altText, success: false });
    }

    // Add delay between requests to avoid rate limiting
    if (i < NEW_BLOG_IMAGE_PROMPTS.length - 1) {
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
    console.log('\nGenerated images:');
    results
      .filter((r) => r.success)
      .forEach((r) => {
        console.log(`  ✓ ${r.name}.jpg`);
        console.log(`    Alt: "${r.altText}"`);
      });
  }

  if (failed > 0) {
    console.log('\nFailed images:');
    results
      .filter((r) => !r.success)
      .forEach((r) => console.log(`  ✗ ${r.name}`));
  }

  console.log('\nDone!');
}

main().catch(console.error);
