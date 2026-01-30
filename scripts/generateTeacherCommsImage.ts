/**
 * Generate teacher communication blog image using Gemini AI
 * Run with: npx tsx scripts/generateTeacherCommsImage.ts
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

const OUTPUT_DIR = path.join(__dirname, '../../frontend/public/images/blog');

const IMAGE_CONFIG = {
  name: 'teacher-parent-communication',
  altText: 'Teacher looking thoughtfully at laptop while composing parent communication late at night',
  prompt: `Create a warm, empathetic illustration capturing the reality of a dedicated teacher trying to communicate with parents.

SCENE COMPOSITION: A teacher sits at their desk or home workspace, looking at a laptop screen with a mix of determination and slight frustration. The scene should evoke empathy - this is someone who cares deeply and is trying their best to connect with families.

THE TEACHER: A warm, professional educator (any gender/ethnicity, late 20s-40s) sitting at a desk. Their expression shows thoughtful determination - not defeated, but clearly wrestling with a challenge. Maybe they're resting their chin on their hand, or pausing mid-type to think. They look dedicated but tired.

THE WORKSPACE: Evidence of communication efforts:
- A laptop showing an email or newsletter being composed
- Perhaps a phone nearby with notification badges
- Coffee cup (probably cold at this point)
- Some student work or classroom materials visible
- Maybe sticky notes with parent names or reminders
- A clock suggesting evening hours (not necessarily visible, but the lighting suggests it)

VISUAL STORYTELLING: Subtle elements suggesting the communication challenge:
- Perhaps a few "sent" indicators or email icons floating subtly
- The warm glow of the laptop contrasting with the dimmer room
- A sense of care and effort in the teacher's posture

LIGHTING: Warm, evening lighting - perhaps a desk lamp providing cozy illumination mixed with the cool glow from the laptop screen. The lighting should feel intimate and hardworking, like dedication after hours.

ATMOSPHERE: The image should feel relatable to teachers - capturing the invisible labor of parent communication. There's dignity in this work, even when it feels unnoticed.

COLOR PALETTE: Warm oranges and yellows from lamp light, cool blues from the laptop, soft earth tones in the environment. The mood should feel warm and humanizing, not cold or corporate.

STYLE: Editorial illustration style with emotional resonance - like a thoughtful magazine piece about education. Professional quality suitable for a blog about teacher-parent communication. The image should make teachers feel seen and understood.`,
};

async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-pro-image-preview',
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    const enhancedPrompt = `${prompt}

UNIVERSAL REQUIREMENTS FOR THIS IMAGE:
- The image must be completely safe and appropriate for all audiences
- Do NOT include any readable text, words, letters, or numbers in the image
- All characters should appear friendly, warm, and professional
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
  console.log('Teacher Communication Blog Image Generator\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Generating: ${IMAGE_CONFIG.name}`);
  console.log(`Alt text: "${IMAGE_CONFIG.altText}"\n`);

  const imageBuffer = await generateImage(IMAGE_CONFIG.prompt);

  if (imageBuffer) {
    const outputPath = path.join(OUTPUT_DIR, `${IMAGE_CONFIG.name}.jpg`);
    fs.writeFileSync(outputPath, imageBuffer);
    console.log(`\nSuccess! Image saved to: ${outputPath}`);
    console.log(`\nTo use in the blog post, the image path is:`);
    console.log(`  /images/blog/${IMAGE_CONFIG.name}.jpg`);
  } else {
    console.log('\nFailed to generate image');
    process.exit(1);
  }

  console.log('\nDone!');
}

main().catch(console.error);
