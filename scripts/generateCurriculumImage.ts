/**
 * Script to generate curriculum choice blog image using Gemini AI
 * Run with: npx tsx scripts/generateCurriculumImage.ts
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

const IMAGE_CONFIG = {
  name: 'curriculum-choice-guide',
  altText: 'Expat parent reviewing school brochures and comparing curriculum options for their child in Dubai',
  prompt: `Create a warm, emotionally resonant illustration of an expat parent navigating the overwhelming decision of choosing a school curriculum for their child.

SCENE COMPOSITION: A parent (could be any ethnicity - representing Dubai's diverse expat community) sits at a table late at night or early morning, surrounded by school brochures, papers, and a laptop. They look thoughtful but slightly overwhelmed - not defeated, but clearly wrestling with an important decision. The scene captures the universal parenting moment of wanting the absolute best for your child.

THE PARENT: A woman or man in their 30s-40s, dressed casually (perhaps still in work clothes with sleeves rolled up, or comfortable home clothes). Their expression shows deep thought and care - perhaps chin resting on hand, or fingers rubbing temple. They're illuminated by laptop glow and perhaps a warm lamp. They look tired but determined.

THE EVIDENCE OF RESEARCH: The table tells the story of extensive research:
- Multiple colorful school brochures (suggesting British, American, IB, Indian schools)
- A laptop showing comparison spreadsheet or school websites
- Sticky notes with pros/cons
- Perhaps a cold cup of coffee or tea
- A phone showing WhatsApp (the lifeline of expat parent advice)
- Maybe a small photo of their child visible, reminding us why this matters

DUBAI CONTEXT: Subtle elements suggesting the Gulf setting:
- Perhaps a window showing a cityscape with distinctive architecture in the background
- The diversity of school brochures representing the unique abundance of choices in Dubai
- Modern, comfortable home environment

EMOTIONAL UNDERTONE: The image should evoke empathy - every parent who has agonized over educational decisions will recognize this moment. But there should also be hope - this parent cares deeply, and that care is what really matters.

LIGHTING: Warm lamp light mixed with cool laptop glow creates an intimate late-night atmosphere. The lighting should feel like 2 AM - that quiet time when parents do their most important thinking.

COLOR PALETTE: Warm browns and oranges from lamp light, cool blues from the laptop screen, with pops of color from school brochures. The overall mood should feel warm and relatable, not cold or clinical.

STYLE: Warm, editorial illustration style with emotional depth - like a touching scene from a film about parenthood. The image should make parents feel seen and understood. Professional quality suitable for a blog about the curriculum choice journey.`,
};

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

    console.log('Generating image with Gemini...');
    console.log(`Prompt preview: "${prompt.substring(0, 100)}..."\n`);

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
      console.error('No response parts');
      return null;
    }

    for (const part of parts) {
      if ((part as any).inlineData) {
        const inlineData = (part as any).inlineData;
        const buffer = Buffer.from(inlineData.data, 'base64');
        return buffer;
      }
    }

    console.error('No image data in response');
    return null;
  } catch (error) {
    console.error('Generation error:', error);
    return null;
  }
}

async function main() {
  console.log('Curriculum Choice Blog Image Generator\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Created output directory\n');
  }

  console.log(`Generating: ${IMAGE_CONFIG.name}`);
  console.log(`Alt text: "${IMAGE_CONFIG.altText}"\n`);

  const imageBuffer = await generateImage(IMAGE_CONFIG.prompt);

  if (imageBuffer) {
    const outputPath = path.join(OUTPUT_DIR, `${IMAGE_CONFIG.name}.jpg`);
    fs.writeFileSync(outputPath, imageBuffer);
    console.log(`\nSuccess! Image saved to: ${outputPath}`);
    console.log(`\nTo use in the blog post, update the image src to:`);
    console.log(`  /images/blog/${IMAGE_CONFIG.name}.jpg`);
  } else {
    console.log('\nFailed to generate image');
    process.exit(1);
  }

  console.log('\nDone!');
}

main().catch(console.error);
