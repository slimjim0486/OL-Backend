/**
 * Script to generate iPad splash screen image using Gemini AI
 * Run with: npx tsx scripts/generateSplashScreen.ts
 *
 * Outputs to: frontend/ios/App/App/Assets.xcassets/Splash.imageset/
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

// Output directory for splash screen
const OUTPUT_DIR = path.join(__dirname, '../../frontend/ios/App/App/Assets.xcassets/Splash.imageset');

// Splash screen prompt based on your brand identity
const SPLASH_PROMPT = `Create a beautiful, clean iPad splash screen for an educational app called "Orbit Learn".

DESIGN REQUIREMENTS:
- Clean, minimal design with lots of whitespace
- Centered composition perfect for a loading/splash screen
- Square format (will be displayed on iPad)

CENTRAL ELEMENT:
- Feature "Ollie" (also called Jeffrey), the friendly AI tutor mascot
- Ollie is a 3D cartoon character with soft lavender/purple skin
- He has wavy purple hair, neatly styled
- He wears large, round gold-framed glasses that make him look wise yet approachable
- He wears a brown herringbone tweed jacket over a light blue shirt with a purple bow tie
- His expression is warm, welcoming, and friendly - like greeting a friend
- Ollie should be waving hello or in a welcoming pose

ORBIT RING:
- Surround Ollie with a stylized green/teal orbital ring (like a planet's ring)
- The ring should be elegant and swooping around him
- Small educational icons float around the orbit: books, stars, pencils, lightbulbs (subtle, small)

BACKGROUND:
- Very soft, warm cream/off-white gradient background
- Clean and minimal - this is a splash screen, not a busy illustration
- Subtle warm glow behind the character

TEXT:
- Below the character, include the text "Orbit Learn" in a friendly, modern sans-serif font
- The text should be dark gray or purple, easy to read
- Optional small tagline: "Your AI Learning Companion"

STYLE:
- Polished Pixar-style 3D animation aesthetic
- Professional app splash screen quality
- Warm, inviting, and child-friendly but not childish
- Premium feel suitable for App Store presentation

IMPORTANT:
- Keep the design CENTERED and BALANCED
- Leave plenty of breathing room around the edges
- This will be shown briefly when the app launches, so it should be instantly recognizable`;

async function generateSplashScreen() {
  console.log('🎨 Generating Orbit Learn splash screen...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

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

    console.log(`📝 Prompt: Generating splash screen with Ollie mascot...\n`);

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: SPLASH_PROMPT }],
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

    let imageFound = false;
    for (const part of parts) {
      if ((part as any).inlineData) {
        const inlineData = (part as any).inlineData;
        const imageBuffer = Buffer.from(inlineData.data, 'base64');

        // Save as all three required sizes for iOS
        const filenames = [
          'splash-2732x2732.png',
          'splash-2732x2732-1.png',
          'splash-2732x2732-2.png'
        ];

        for (const filename of filenames) {
          const outputPath = path.join(OUTPUT_DIR, filename);
          fs.writeFileSync(outputPath, imageBuffer);
          console.log(`✅ Saved: ${outputPath}`);
        }

        imageFound = true;
        break;
      }
    }

    if (!imageFound) {
      throw new Error('No image data in response');
    }

    console.log('\n🎉 Splash screen generated successfully!');
    console.log('\n📱 Next steps:');
    console.log('   1. Open Xcode and verify the splash screen in Assets.xcassets');
    console.log('   2. Build and run the app to test the new splash screen');
    console.log('   3. If needed, adjust the image in an image editor for perfect centering');

  } catch (error) {
    console.error('❌ Failed to generate splash screen:', error);
    process.exit(1);
  }
}

generateSplashScreen();
