/**
 * Script to generate App Store Connect subscription images using Gemini AI
 * Run with: npx tsx scripts/generateSubscriptionImages.ts
 *
 * Generates 1024x1024 images for:
 * - Family Monthly ($7.99/month, 2 children)
 * - Family Annual ($57.99/year, 2 children)
 * - Family Plus Monthly ($14.99/month, 4 children)
 * - Family Plus Annual ($107.99/year, 4 children)
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
  console.error('❌ GEMINI_API_KEY not found in environment');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Output directory for generated images
const OUTPUT_DIR = path.join(__dirname, '../../marketing/app-store/subscriptions');

// Subscription image prompts
const SUBSCRIPTION_PROMPTS = [
  {
    name: 'family-monthly',
    prompt: `Create a warm, inviting illustration for an educational app subscription showing a small happy family learning together.

SCENE COMPOSITION: A cozy home learning scene with ONE parent and TWO children (representing the 2-child limit) gathered around a glowing tablet device. The tablet displays colorful educational content with stars and checkmarks suggesting progress and achievement.

THE FAMILY: A warm, diverse family unit - one adult figure with two children of different ages (approximately 6 and 9 years old). All three are engaged and happy, with the children showing excitement about learning. Body language shows togetherness and shared discovery.

VISUAL ELEMENTS:
- A soft, warm glow emanates from the tablet, illuminating their faces
- Small floating icons around them: stars, lightbulbs, book symbols, planet icons (no text)
- A subtle monthly calendar icon or crescent moon in the corner suggesting "monthly"
- Warm, cozy home environment with soft lighting

COLOR PALETTE: Warm oranges, friendly yellows, soft purples (Orbit Learn brand colors), and comforting earth tones. The overall feel should be accessible and welcoming - this is the entry-level family plan.

ATMOSPHERE: Cozy, achievable, welcoming. This should feel like "the perfect way to start" - not overwhelming, just right for a small family beginning their learning journey.

STYLE: Modern, friendly 3D cartoon style similar to educational app marketing. Clean, professional, and appealing to parents. Pixar-inspired warmth and character design.

CRITICAL: Generate a square 1024x1024 image. No text, words, or letters anywhere in the image.`,
  },
  {
    name: 'family-annual',
    prompt: `Create an illustration for an annual educational subscription showing a small family with a sense of long-term commitment and growth over time.

SCENE COMPOSITION: A heartwarming scene with ONE parent and TWO children (representing the 2-child limit) on a learning journey. The composition suggests progression and growth - perhaps showing the family at a starting point with a winding path ahead filled with educational milestones.

THE JOURNEY METAPHOR:
- The family stands together looking toward a bright horizon
- A gentle path winds forward with milestone markers (stars, badges, trophies) along the way
- Seasonal elements subtly shown (a tree with leaves transitioning, or four small seasonal icons) suggesting a full year
- A warm sun or golden light at the horizon representing future achievement

THE FAMILY: Same warm family unit as monthly - one adult with two children - but their posture is more forward-looking, adventurous, ready for a journey together.

VISUAL ELEMENTS:
- A subtle "365" or calendar wheel shape integrated into the background design (as a decorative element, not readable text)
- Milestone markers along the path: bronze → silver → gold progression
- Sparkles and achievement symbols floating in the air ahead
- A savings/value indicator like a treasure chest or gift box subtly included

COLOR PALETTE: Richer, more premium feeling - deep purples, warm golds, sunrise oranges. More saturated than the monthly version to suggest greater value and commitment.

ATMOSPHERE: Aspirational, rewarding, wise choice. This should feel like "the smart investment" - a year of growth and achievement ahead.

STYLE: Modern, friendly 3D cartoon style. Slightly more polished and premium feeling than the monthly image while maintaining warmth and approachability.

CRITICAL: Generate a square 1024x1024 image. No text, words, or letters anywhere in the image.`,
  },
  {
    name: 'family-plus-monthly',
    prompt: `Create a vibrant illustration for a premium family educational subscription showing a larger, bustling family learning together.

SCENE COMPOSITION: An energetic, joyful scene with TWO parents and FOUR children (representing the 4-child limit) in an expanded learning environment. The scene should feel fuller, more dynamic, and more feature-rich than the basic family plan.

THE LARGER FAMILY:
- Two adult figures (could be parents, or parent + grandparent, or two parents)
- Four children of varying ages (approximately 5, 7, 9, and 11 years old)
- Each child engaged with different learning activities simultaneously
- Multiple devices/tablets visible, all glowing with educational content

VISUAL ELEMENTS:
- Multiple floating educational icons: math symbols, science beakers, art palettes, music notes, globes
- A sense of abundance - more stars, more achievements, more possibilities
- Premium indicators: a subtle crown, plus symbol, or upgrade arrow
- Interconnected learning - visual links between the children showing shared progress

ENVIRONMENT: A larger, more spacious learning area - perhaps a dedicated family learning room or expanded living space. More resources visible - bookshelves, educational posters (as colored shapes), learning tools.

COLOR PALETTE: Vibrant and energetic - bright Orbit Learn purples, electric blues, energetic oranges, with gold accents suggesting premium value. More saturated and dynamic than the basic family plan.

ATMOSPHERE: Abundant, feature-rich, perfect for larger families. This should feel like "everything your growing family needs" - comprehensive and generous.

STYLE: Dynamic, energetic 3D cartoon style. More movement, more elements, more visual richness while maintaining clarity and appeal.

CRITICAL: Generate a square 1024x1024 image. No text, words, or letters anywhere in the image.`,
  },
  {
    name: 'family-plus-annual',
    prompt: `Create a premium, celebratory illustration for the top-tier annual family educational subscription - the ultimate family learning package.

SCENE COMPOSITION: A grand, triumphant scene with a LARGE FAMILY (two adults and four children) at the pinnacle of their learning journey. This is the premium annual plan - the best value, most features, biggest commitment.

THE CELEBRATION:
- Two adult figures and four children in celebratory poses
- They stand on or near a podium/platform suggesting achievement
- Golden light and premium sparkles surround them
- A sense of "we've made it" combined with "exciting journey ahead"

PREMIUM VISUAL ELEMENTS:
- A prominent golden crown, trophy, or VIP badge (as visual symbol, no text)
- Premium sparkle effects - more gold, more shimmer, more prestige
- A year-long journey path behind them AND ahead of them, showing both accomplishment and future growth
- All four children holding different achievement symbols (stars, medals, certificates as shapes)
- Confetti and celebration particles in brand colors

ENVIRONMENT: A premium, aspirational setting - perhaps a beautiful learning sanctuary, a magical library, or a family achievement hall. Rich details suggesting quality and investment in education.

COLOR PALETTE: The most premium palette - rich royal purples, luxurious golds, deep satisfying blues. This should feel like the "gold standard" or "VIP experience" of educational subscriptions.

ATMOSPHERE: Premium, celebratory, best-in-class. This should feel like "the ultimate investment in your family's future" - prestigious but still warm and family-focused.

STYLE: Polished, premium 3D cartoon style with extra attention to lighting, detail, and visual richness. The most refined version while maintaining the friendly, approachable Orbit Learn aesthetic.

CRITICAL: Generate a square 1024x1024 image. No text, words, or letters anywhere in the image.`,
  },
];

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

UNIVERSAL REQUIREMENTS:
- Generate exactly 1024x1024 pixel square image
- The image must be completely safe and appropriate for children of all ages
- Do NOT include any readable text, words, letters, or numbers in the image
- All characters should appear friendly, warm, and welcoming
- Professional quality suitable for App Store Connect subscription artwork
- Consistent warm lighting throughout the scene
- Clean composition with clear focal point`;

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
      console.error('  ❌ No response parts');
      return null;
    }

    for (const part of parts) {
      if ((part as any).inlineData) {
        const inlineData = (part as any).inlineData;
        const buffer = Buffer.from(inlineData.data, 'base64');
        return buffer;
      }
    }

    console.error('  ❌ No image data in response');
    return null;
  } catch (error) {
    console.error('  ❌ Generation error:', error);
    return null;
  }
}

async function main() {
  console.log('🎨 App Store Subscription Image Generator\n');
  console.log('Generating 1024x1024 images for App Store Connect\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('📁 Created output directory\n');
  }

  const results: { name: string; success: boolean; path?: string }[] = [];

  for (let i = 0; i < SUBSCRIPTION_PROMPTS.length; i++) {
    const { name, prompt } = SUBSCRIPTION_PROMPTS[i];
    console.log(`[${i + 1}/${SUBSCRIPTION_PROMPTS.length}] Generating: ${name}`);

    const imageBuffer = await generateImage(prompt);

    if (imageBuffer) {
      const outputPath = path.join(OUTPUT_DIR, `${name}.png`);
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`  ✅ Saved: ${outputPath}\n`);
      results.push({ name, success: true, path: outputPath });
    } else {
      console.log(`  ❌ Failed to generate: ${name}\n`);
      results.push({ name, success: false });
    }

    // Add delay between requests to avoid rate limiting
    if (i < SUBSCRIPTION_PROMPTS.length - 1) {
      console.log('  ⏳ Waiting 3 seconds before next request...\n');
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  // Summary
  console.log('\n📊 Generation Summary:');
  console.log('─'.repeat(50));
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed images:');
    results
      .filter((r) => !r.success)
      .forEach((r) => console.log(`  - ${r.name}`));
  }

  console.log('\n📱 App Store Connect Upload Instructions:');
  console.log('─'.repeat(50));
  console.log('1. Go to App Store Connect → Your App → Subscriptions');
  console.log('2. Select each subscription product');
  console.log('3. Under "App Store Promotion" or "Subscription Image"');
  console.log('4. Upload the corresponding 1024x1024 image');
  console.log('\nImage mapping:');
  console.log('  family-monthly.png    → Family (Monthly)');
  console.log('  family-annual.png     → Family (Annual)');
  console.log('  family-plus-monthly.png → Family Plus (Monthly)');
  console.log('  family-plus-annual.png  → Family Plus (Annual)');

  console.log('\n🎉 Done!');
}

main().catch(console.error);
