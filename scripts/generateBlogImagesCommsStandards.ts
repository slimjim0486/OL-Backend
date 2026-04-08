/**
 * Script to generate blog post images for:
 * 1. parent-communication-burnout (report card comments blog post)
 * 2. standards-coverage-anxiety (standards gap 3am panic blog post)
 *
 * Run with: npx tsx scripts/generateBlogImagesCommsStandards.ts
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

const BLOG_IMAGE_PROMPTS = [
  {
    name: 'parent-communication-burnout',
    altText: 'Teacher sitting at a desk late at night, surrounded by stacks of report cards and a half-finished cup of coffee',
    prompt: `Create an emotionally resonant illustration of a teacher overwhelmed by the hidden labor of parent communication — the endless report card comments, newsletters, and individual emails that consume invisible hours.

SCENE COMPOSITION: A dedicated teacher (woman in her late 30s, "Rachel Torres" - 9-year veteran 4th-grade teacher) sits at her home desk late at night, surrounded by towering stacks of report cards. Her laptop is open with a half-written email visible as abstract shapes on screen. She looks exhausted but still pushing through.

THE TEACHER (RACHEL): She shows the specific exhaustion of communication overload:
- Tired eyes, rubbing the bridge of her nose or resting her chin on her hand
- Professional but comfortable evening wear (cardigan over a simple top)
- Hair slightly coming undone from the day
- Reading glasses pushed up on her forehead
- Multiple browser tabs open on laptop (abstract, no readable text)
- Her posture shows someone deep into hour three of comments

THE DESK CHAOS: The visual story of communication labor:
- Tall stacks of report cards (at least 3-4 piles of different heights)
- A printed roster or class list with checkmarks (abstract marks, no readable text)
- Half-empty coffee cup that's clearly been sitting there for hours (cold coffee)
- Post-it notes stuck everywhere with abstract reminder marks
- A phone face-down (ignoring personal life)
- Crumpled paper balls showing abandoned draft attempts
- A worn comment bank printout with abstract highlighting

THE HOME OFFICE SETTING: Late-night domestic workspace:
- Desk lamp creating a warm pool of light on the chaos
- Rest of the room in darkness
- Clock on the wall suggesting 11 PM or later
- Family photos in the background (husband, kids)
- Window showing complete darkness outside
- A plate with uneaten dinner pushed to the side

LIGHTING: Warm desk lamp creates intimate, focused light on Rachel and her report card stacks. The laptop provides cool blue contrast. The rest of the room fades to shadow. The lighting should feel late-night, solitary, and slightly melancholic.

EMOTIONAL TONE: The image should evoke:
- Deep recognition from teachers ("I've spent those exact nights")
- The invisible labor of personalizing communication for every student
- Empathy for the sheer volume — stacks representing 200+ individual comments
- Dignity in the work — she cares enough to keep going
- A sense that this labor deserves to be seen and eased

COLOR PALETTE: Warm amber desk lamp light. Cool blue laptop glow. Cream and white report card paper. Rachel in muted burgundy or navy cardigan. Dark shadows around the edges. The coffee cup and crumpled papers add texture. Overall mood: intimate, exhausting, real.

STYLE: Warm, editorial illustration with emotional depth. Like a documentary photograph capturing the hidden reality of teaching after hours. Professional quality suitable for a blog header. Landscape orientation (16:9). No readable text anywhere in the image.`,
  },
  {
    name: 'standards-coverage-anxiety',
    altText: 'Teacher looking at a complex spreadsheet of standards with highlighted gaps, coffee cup nearby',
    prompt: `Create an emotionally powerful illustration capturing the anxiety of standards coverage gaps — the 3 AM realization that critical curriculum standards have been missed and the school year is running out.

SCENE COMPOSITION: A teacher (woman in her early 30s, "Jenna Okafor" - 4th-grade teacher) is at her desk in the very early morning hours, staring at a complex color-coded spreadsheet on her laptop screen. The spreadsheet shows a grid with some cells highlighted in red/amber (gaps). Her expression shows the specific dread of discovering what you've missed. A large printed standards document sits beside her, filled with abstract marks.

THE TEACHER (JENNA): She shows the anxiety of standards accountability:
- Wide-eyed, slightly panicked expression — the "oh no" moment
- One hand on the laptop as if she's been scrolling through gaps
- Other hand perhaps holding her phone (the device that woke her at 3 AM)
- Wearing pajamas or a robe (she couldn't sleep, came to check)
- Hair messy from bed
- Sitting forward, tense posture
- The blue light of the screen illuminating her worried face

THE SPREADSHEET (abstract, no readable text): The visual centerpiece:
- A laptop screen showing a grid/matrix pattern
- Some cells colored green (covered), some amber (partial), some red (missed)
- The red gaps are what she's staring at
- The grid should look complex and overwhelming
- Abstract column and row headers (no readable text)

THE STANDARDS DOCUMENTS: Physical evidence of the tracking struggle:
- A thick printed curriculum standards binder open on the desk
- Abstract highlighting and tab markers throughout
- A separate handwritten tracking sheet with abstract checkmarks and X marks
- Post-it notes marking specific pages
- The physical documents look well-used but insufficient

THE EARLY MORNING SETTING: 3 AM home workspace:
- Complete darkness outside the window
- Only the laptop screen providing light (blue glow)
- Maybe a small desk lamp just turned on
- A glass of water (she came from bed)
- The room feels quiet and still — the rest of the house is asleep
- Digital clock showing very early morning hours
- The atmosphere of being alone with a problem at 3 AM

LIGHTING: Predominantly the cool blue glow of the laptop screen on Jenna's face. A warm desk lamp may provide secondary light. The contrast between the harsh blue screen light and the dark room should create tension. The red/amber cells on the spreadsheet should seem to glow.

EMOTIONAL TONE: The image should evoke:
- The specific anxiety of curriculum accountability
- The dread of discovering gaps you can't easily fix
- The isolation of 3 AM problem-solving
- Recognition from teachers ("I've had that exact panic")
- The weight of being responsible for every student's standards mastery
- A sense that teachers need better tools for this invisible tracking work

COLOR PALETTE: Cool blue laptop glow dominant. Red and amber accents from the spreadsheet gaps. Dark shadows everywhere else. Jenna in soft pajama colors (gray, muted blue). The standards binder in institutional white/cream. The overall mood is tense, anxious, and eerily quiet — a 3 AM color palette.

VISUAL METAPHOR: The spreadsheet gaps (red cells) should feel like alarm signals — small fires that have been burning unnoticed. The thick standards binder represents the impossible scope of what one teacher must track.

STYLE: Cinematic, editorial illustration with anxiety and tension. Like a still from a psychological thriller about education accountability. Professional quality suitable for a blog header about standards coverage anxiety. Landscape orientation (16:9). No readable text anywhere in the image — all text on screens, papers, and documents should be abstract marks or shapes.`,
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

UNIVERSAL REQUIREMENTS FOR THIS IMAGE:
- The image must be completely safe and appropriate for all audiences
- Do NOT include any readable text, words, letters, or numbers in the image
- All characters should appear as real, relatable professionals
- Include diverse representation where appropriate
- The final image should be high-resolution and suitable for professional blog use
- Render with consistent lighting and color grading throughout the scene
- Aspect ratio should be landscape (16:9 or similar) suitable for blog headers
- Style should feel warm and editorial, like magazine illustration
- No text on any papers, screens, or surfaces - just abstract marks`;

    console.log(`  Generating with prompt: "${prompt.substring(0, 80)}..."`);

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
  console.log('Blog Image Generator — Parent Communication & Standards Coverage\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Created output directory\n');
  }

  const results: { name: string; altText: string; success: boolean; path?: string }[] = [];

  for (let i = 0; i < BLOG_IMAGE_PROMPTS.length; i++) {
    const { name, altText, prompt } = BLOG_IMAGE_PROMPTS[i];
    console.log(`[${i + 1}/${BLOG_IMAGE_PROMPTS.length}] Generating: ${name}`);
    console.log(`  Alt text: "${altText}"`);

    const imageBuffer = await generateImage(prompt);

    if (imageBuffer) {
      const outputPath = path.join(OUTPUT_DIR, `${name}.jpg`);
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`  Saved: ${outputPath}`);
      console.log(`  Size: ${(imageBuffer.length / 1024).toFixed(1)} KB\n`);
      results.push({ name, altText, success: true, path: outputPath });
    } else {
      console.log(`  Failed to generate: ${name}\n`);
      results.push({ name, altText, success: false });
    }

    // Add delay between requests to avoid rate limiting
    if (i < BLOG_IMAGE_PROMPTS.length - 1) {
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
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);

  if (successful > 0) {
    console.log('\nGenerated images:');
    results
      .filter((r) => r.success)
      .forEach((r) => {
        console.log(`  ${r.name}.jpg`);
        console.log(`    Alt: "${r.altText}"`);
      });

    console.log('\nNext steps:');
    console.log('1. Review the generated images in frontend/public/images/blog/');
    console.log('2. Upload to R2 CDN using: npx tsx scripts/uploadBlogImage.ts');
    console.log('   (Update IMAGE_PATH and R2_STORAGE_PATH for each image)');
  }

  if (failed > 0) {
    console.log('\nFailed images (retry by running the script again):');
    results
      .filter((r) => !r.success)
      .forEach((r) => console.log(`  ${r.name}`));
  }

  console.log('\nDone!');
}

main().catch(console.error);
