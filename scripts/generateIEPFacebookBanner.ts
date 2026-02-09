/**
 * Script to generate Facebook banner for IEP Goals post
 * Run with: npx tsx scripts/generateIEPFacebookBanner.ts
 *
 * Uses Gemini image generation to create an authentic, teacher-focused visual
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

// Output directory for marketing images
const OUTPUT_DIR = path.join(__dirname, '../public/marketing/facebook');

// Facebook banner prompt - authentic, relatable teacher scene for IEP post
const IEP_BANNER_PROMPT = `Create a warm, relatable illustration for a Facebook post in a Special Education teachers group about IEP goal writing.

SCENE COMPOSITION:
A tired but caring special education teacher sits at a desk late in the evening, surrounded by IEP paperwork. The scene should feel authentic and relatable - not polished corporate imagery. Think "real teacher life."

THE TEACHER:
- Female, mid-30s, can be any ethnicity
- Warm, tired but hopeful expression - the look of someone who genuinely cares but is overwhelmed
- Hair slightly messy from a long day
- Comfortable cardigan over a simple top
- Reading glasses pushed up on head or hanging from neck
- One hand resting on laptop, other hand holding a coffee mug
- Posture slightly slouched but engaged with work

THE DESK/WORKSPACE:
- Laptop open with soft glow illuminating face
- Stack of manila IEP folders to one side
- Scattered papers and sticky notes
- A small succulent plant for personality
- A framed photo of students or motivational quote in background
- Empty snack wrapper or coffee cup suggesting long hours
- A worn teacher planner or binder

LIGHTING & MOOD:
- Warm desk lamp creating cozy pool of light
- Window in background showing it's dark outside (late evening work)
- Soft, warm color temperature - feels like a real home office or classroom after hours
- NOT clinical or corporate - this is authentic teacher life

COLOR PALETTE:
- Warm earth tones: soft browns, cream, dusty rose
- Accent: soft teal or sage green (calming, educator-friendly)
- Warm yellow from desk lamp
- Avoid harsh corporate blues or overly saturated colors

EMOTIONAL TONE:
- Relatable exhaustion (not despair)
- Quiet determination
- The feeling of "we're all in this together"
- Warmth and humanity
- NOT polished, NOT corporate, NOT fake

STYLE:
- Soft illustration style, slightly painterly
- Warm and inviting, like a children's book illustration for adults
- NOT photorealistic, NOT corporate stock photo style
- Gentle, rounded shapes
- Optimized for Facebook feed (1200x630 landscape)

CRITICAL REQUIREMENTS:
- NO text, words, letters, or numbers visible anywhere
- NO visible brand logos or specific software interfaces
- Should feel authentic to the SpEd teacher experience
- Evokes empathy and recognition ("that's me!")
- Professional but warm and human`;

async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
    // Use gemini-3-pro-image-preview for best quality image generation
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-pro-image-preview',
    });

    console.log('Generating IEP Facebook banner...');
    console.log('Using gemini-3-pro-image-preview model...');
    console.log('This may take 30-60 seconds...\n');

    const enhancedPrompt = `${prompt}

UNIVERSAL REQUIREMENTS:
- Do NOT include any readable text, words, letters, or numbers in the image
- Professional quality suitable for Facebook marketing
- Aspect ratio should be landscape (1200x630) suitable for Facebook feeds
- Warm, inviting illustration style`;

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
      console.error('No response parts received from Gemini');
      return null;
    }

    for (const part of parts) {
      if ((part as any).inlineData) {
        const inlineData = (part as any).inlineData;
        const buffer = Buffer.from(inlineData.data, 'base64');
        console.log('Image generated successfully!');
        return buffer;
      }
    }

    console.error('No image data found in response');
    return null;
  } catch (error) {
    console.error('Image generation failed:', error);
    return null;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('  ORBIT LEARN - IEP Facebook Banner Generator');
  console.log('='.repeat(60));
  console.log('');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Created output directory\n');
  }

  // Generate the image
  const imageBuffer = await generateImage(IEP_BANNER_PROMPT);

  if (imageBuffer) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `iep-facebook-banner-${timestamp}.png`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    fs.writeFileSync(outputPath, imageBuffer);
    console.log(`\nImage saved: ${outputPath}`);
    console.log(`File size: ${(imageBuffer.length / 1024).toFixed(1)} KB`);

    // Also save as the "latest" version
    const latestPath = path.join(OUTPUT_DIR, 'iep-facebook-banner-latest.png');
    fs.writeFileSync(latestPath, imageBuffer);
    console.log(`Latest version saved: ${latestPath}`);

    console.log('\n' + '='.repeat(60));
    console.log('  BANNER GENERATION COMPLETE');
    console.log('='.repeat(60));

    return outputPath;
  } else {
    console.error('\nFailed to generate IEP Facebook banner');
    process.exit(1);
  }
}

main().catch(console.error);
