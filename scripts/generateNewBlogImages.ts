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
    name: 'comparison-trap',
    altText: 'Parent and child reading together peacefully, celebrating individual learning journey',
    prompt: `Create a warm, emotionally resonant illustration of a parent and child sharing a peaceful reading moment together, free from comparison anxiety.

SCENE COMPOSITION: A parent and young child (around 6-8 years old) sit together on a comfortable couch or reading nook, sharing a picture book. The scene radiates calm, connection, and joy - the antithesis of academic pressure. This is a moment of pure presence.

THE PARENT: Their expression shows complete presence and peace - no anxiety, no comparison, just joy in their child. They're looking at the child with warmth and acceptance, or together with the child at the book. Body language is relaxed, perhaps with arm around the child. Any ethnicity/gender.

THE CHILD: Reading or pointing at the book with genuine engagement and confidence. Their posture shows comfort and security - leaning into the parent, completely at ease. Their expression shows the joy of learning at their own pace. No stress, just curiosity and happiness.

THE BOOK: A colorful picture book between them, suggesting early reading - not a chapter book, not "advanced" material. The book represents learning at the child's own pace, and that's beautiful.

ENVIRONMENT: A cozy, warm home setting - soft cushions, warm lighting (perhaps golden hour light through a window), comfortable textures. The space feels safe, unhurried, and free from pressure. Perhaps a bookshelf with varied books in the background.

EMOTIONAL TONE: The core message is "this is enough, this child is enough, this moment is enough." The image should make parents feel permission to let go of comparison. Peace, acceptance, joy.

LIGHTING: Warm, golden, embracing light - like a hug. Soft shadows, no harsh contrasts. The kind of lighting that makes you feel safe and loved.

COLOR PALETTE: Warm, nurturing colors - soft oranges, warm yellows, cream tones, gentle greens. Cozy and inviting. The palette should feel like coming home.

STYLE: Warm, emotional illustration style similar to beloved children's book illustrations. Soft edges, expressive faces, gentle colors. The image should evoke feelings of comfort and acceptance. Professional quality suitable for a blog header about escaping comparison anxiety.`,
  },
  {
    name: 'teacher-burnout',
    altText: 'Teacher finding renewed joy and purpose in the classroom with students',
    prompt: `Create an uplifting, hopeful illustration of a teacher who has rediscovered their joy and purpose - the "after" of burnout recovery.

SCENE COMPOSITION: A teacher (late 20s to early 40s, any gender/ethnicity) is in the middle of a joyful classroom moment - perhaps telling a story that has students laughing, demonstrating something with animated gestures, or sharing a genuine smile with engaged students. This is teaching as it should be - human connection and shared discovery.

THE TEACHER: Their expression shows genuine joy, energy, and presence - the light in their eyes that made them become a teacher. They're animated, engaged, laughing or smiling authentically. Their posture is open and energetic - leaning forward with enthusiasm, hands expressive. This is NOT a stock photo smile - this is real joy.

THE STUDENTS: A small group (3-5) of diverse students visible, all engaged and happy. They might be laughing at a joke, leaning in with curiosity, or raising hands with excitement. The students reflect the teacher's energy back - when the teacher is alive, so is the classroom.

THE MOMENT: Capture a specific joyful teaching moment - perhaps:
- The teacher acting out something from a story with dramatic gestures
- Students laughing together at a math joke the teacher just told
- A hands-on activity where everyone is discovering something together
- The teacher high-fiving a student who just had a breakthrough

CLASSROOM ENVIRONMENT: A bright, welcoming classroom with:
- Natural light streaming through windows
- Colorful but organized space
- Student work displayed on walls
- Plants or cheerful decorations
- The feeling of a space where learning is alive

LIGHTING: Bright, warm, optimistic lighting - like morning light full of possibility. Perhaps sunlight streaming in, creating a sense of new beginnings. The lighting should feel hopeful and energizing.

CONTRAST WITH BURNOUT: This image should feel like the opposite of 2 AM grading sessions. Bright vs dark. Connected vs isolated. Joyful vs exhausted. This is what teaching looks like when teachers have their time and energy back.

COLOR PALETTE: Bright, hopeful colors - sunny yellows, fresh greens, warm oranges, clear blues. The palette should feel like possibility and renewal. Nothing muted or tired.

STYLE: Warm, expressive illustration style that captures emotion and energy. The image should make teachers remember why they started. Should make viewers smile and feel hope. Professional quality suitable for a blog about teacher burnout recovery and rediscovering purpose.`,
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
