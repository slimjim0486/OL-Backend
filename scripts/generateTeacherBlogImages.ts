/**
 * Script to generate teacher blog post images using Gemini AI
 * Run with: npx tsx scripts/generateTeacherBlogImages.ts
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

// Teacher blog post image prompts
const TEACHER_BLOG_IMAGE_PROMPTS = [
  {
    name: 'substitute-plans-teacher',
    altText: 'Teacher looking at phone in early morning light, coffee cup nearby, representing the moment of waking up sick and needing substitute plans',
    prompt: `Create an emotionally resonant illustration of a teacher experiencing the early morning moment of waking up sick and needing to create substitute plans.

SCENE COMPOSITION: A teacher (any gender, 30s-40s) is sitting up in bed or at the edge of the bed in the early morning darkness. They're looking at their phone with a mix of exhaustion and worry. The scene captures that universal moment of dread when illness strikes and work still demands attention.

THE TEACHER: They look unwell - tired eyes, perhaps a hand to their forehead or wrapped in a blanket. They're in sleepwear or a robe. Their face is illuminated by the phone screen, showing concern and fatigue. They're clearly not well but trying to function. Their posture conveys that "I feel terrible but I have responsibilities" feeling.

THE PHONE: The teacher holds their phone, its glow the primary light source. The screen content isn't readable (no text), but the blue-white glow illuminates their tired face.

THE BEDROOM: Early morning darkness - maybe 5:47 AM suggested by the dim light. A nightstand with:
- A glass of water or medicine
- A thermometer
- Perhaps used tissues
- An alarm clock (time not readable)
- A lamp that's off

A window might show the very first hints of pre-dawn light. The bed is rumpled, suggesting a restless night.

LIGHTING: The primary light is the phone's glow on the teacher's face, creating a dramatic but empathetic effect. Perhaps the faintest hint of dawn light through window blinds. The overall atmosphere is dim and intimate.

EMOTIONAL TONE: The image should evoke empathy for teachers who've experienced this moment - the guilt, the worry about students, the physical misery, all combined. But there should also be a sense of determination - this teacher cares enough to try.

COLOR PALETTE: Cool blues from the phone, warm skin tones, dark bedroom shadows, perhaps warm orange hints of a nightlight or dawn. The mood is intimate and slightly melancholic but not depressing.

STYLE: Warm, editorial illustration style with emotional depth. Like a scene from a film about the hidden struggles of teaching. Professional quality suitable for a blog about teacher substitute plans and the guilt of calling in sick.`,
  },
  {
    name: 'teacher-ai-confession',
    altText: 'Teacher at home on a Sunday, relaxed with coffee while lesson plans are prepared on screen',
    prompt: `Create a warm, hopeful illustration showing a teacher finally experiencing a peaceful Sunday after discovering AI teaching tools - the "after" moment of transformation.

SCENE COMPOSITION: A teacher (woman in her 40s-50s, any ethnicity) sits comfortably at home on a Sunday, looking relaxed and content. She might be on a couch or at a table, with a laptop nearby showing completed lesson plans. The key emotion is relief and peace - the Sunday that used to be consumed by work is now hers again.

THE TEACHER (PATRICIA): She looks genuinely relaxed - perhaps holding a warm cup of coffee or tea, maybe looking out a window at a sunny day, or smiling softly at something off-screen (family sounds, perhaps). Her posture is open and relaxed, not hunched over work. She might be in comfortable weekend clothes - a cozy sweater, relaxed fit. Her expression shows contentment and perhaps a touch of wonder at having free time.

THE LAPTOP: Visible but not dominant - it sits nearby showing what appears to be completed work (colorful elements suggesting lesson plans), but she's not actively working on it. The laptop represents work that's done, not work that's consuming her.

THE HOME: A warm, lived-in family home:
- Comfortable furniture
- Natural light streaming through windows
- Perhaps family photos visible
- Maybe signs of weekend life - a book on the coffee table, a blanket
- Possibly a glimpse of family activity in the background (husband in another room, pet sleeping nearby)

SUNDAY ATMOSPHERE: The scene should feel like a perfect Sunday morning:
- Warm natural light
- No sense of rush or stress
- Comfort and peace
- Time stretching pleasantly ahead

CONTRAST ELEMENT: Perhaps a small visual hint of what Sundays used to look like - maybe a small stack of papers that's NOT being worked on, pushed to the side.

LIGHTING: Warm, golden Sunday morning light. Natural daylight fills the space, creating a sense of hope and new beginnings. The lighting should feel like relief.

COLOR PALETTE: Warm, comfortable colors - soft creams, warm browns, touches of green from plants or outdoor views, golden light. The palette should feel like home, like rest, like finally being okay.

EMOTIONAL TONE: The image should convey: "I finally have my life back." It's not about technology - it's about the human result of finding balance. Parents of teachers and teachers themselves should see this and think, "I want that peace."

STYLE: Warm, hopeful illustration style with emotional resonance. Like the satisfying ending scene of a movie about overcoming burnout. Professional quality suitable for a blog about a teacher's journey from AI skeptic to advocate.`,
  },
  {
    name: 'teacher-grading-weekend',
    altText: 'Teacher surrounded by stacks of papers, looking exhausted at their desk on a weekend evening',
    prompt: `Create an evocative, empathetic illustration of a teacher overwhelmed by grading on a weekend evening - capturing the hidden cost of "I'll just grade it this weekend."

SCENE COMPOSITION: A teacher (man in his 30s-40s, any ethnicity - this is "David") sits at a home desk or kitchen table, surrounded by tall stacks of student papers. He looks exhausted, perhaps rubbing his eyes or resting his head in his hand. The scene captures the moment when the weight of 150 papers feels crushing.

THE TEACHER (DAVID): He shows visible signs of grading fatigue:
- Tired posture - shoulders slumped, perhaps leaning back in exhaustion
- Hand rubbing eyes or temples, or chin resting on hand
- Reading glasses pushed up on forehead or set aside
- Expression of someone who's been at this for hours
- Still in weekend casual clothes but looking depleted

THE PAPER STACKS: This is the visual heart of the image - intimidating stacks of student papers that tell the story:
- Multiple tall stacks across the table
- Some papers with visible red pen marks (but no readable text)
- A "graded" pile that's much smaller than the "to grade" pile
- Perhaps papers starting to slide or cascade slightly
- Post-it notes on some stacks

THE WORKSPACE: A home setting on a weekend evening:
- Laptop open showing more work (rubrics, grade spreadsheet)
- Cold or half-drunk coffee mug
- Red pens scattered
- Maybe a notepad with tallies (grading tracking)
- A window showing darkness outside
- Perhaps a clock suggesting evening hours
- Signs of abandoned family time - a child's drawing visible, family noise suggested

THE FAMILY CONTEXT: Subtle but important - signs that life is happening without him:
- Maybe sounds/light from another room suggesting family is watching TV
- A child's artwork or photo visible
- Something suggesting Saturday (weekend newspaper, casual home setting)
- The contrast between his isolation and family life nearby

LIGHTING: Dramatic but warm - a desk lamp creates a pool of light on the papers and the teacher's tired face. The rest of the room is darker, creating a sense of isolation. Perhaps TV glow from another room adds color. The laptop provides cool contrast light.

EMOTIONAL TONE: The image should evoke:
- Recognition ("I've been there")
- Empathy for the invisible labor of teaching
- A slight sense of sadness about what's being sacrificed
- But also dignity - this teacher cares about doing feedback well

COLOR PALETTE: Warm lamp light (orange-yellow) on the papers and face, cool laptop glow (blue-white), dark shadows. The papers should have a weight and presence. Red pen marks provide accent. Overall mood is intimate and slightly melancholic.

VISUAL WEIGHT: The stacks of papers should feel heavy, almost overwhelming. They should dominate the table space, making the teacher look somewhat small or engulfed by the task.

STYLE: Editorial illustration style with emotional depth and narrative power. Like a documentary photograph turned into art. The image should make non-teachers understand what weekend grading actually looks like, and make teachers feel deeply seen. Professional quality suitable for a blog about the hidden costs of grading.`,
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
- Style should feel warm and editorial, like magazine illustration`;

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
  console.log('Teacher Blog Post Image Generator\n');
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Created output directory\n');
  }

  const results: { name: string; altText: string; success: boolean; path?: string }[] = [];

  for (let i = 0; i < TEACHER_BLOG_IMAGE_PROMPTS.length; i++) {
    const { name, altText, prompt } = TEACHER_BLOG_IMAGE_PROMPTS[i];
    console.log(`[${i + 1}/${TEACHER_BLOG_IMAGE_PROMPTS.length}] Generating: ${name}`);
    console.log(`  Alt text: "${altText}"`);

    const imageBuffer = await generateImage(prompt);

    if (imageBuffer) {
      const outputPath = path.join(OUTPUT_DIR, `${name}.jpg`);
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`  Saved: ${outputPath}\n`);
      results.push({ name, altText, success: true, path: outputPath });
    } else {
      console.log(`  Failed to generate: ${name}\n`);
      results.push({ name, altText, success: false });
    }

    // Add delay between requests to avoid rate limiting
    if (i < TEACHER_BLOG_IMAGE_PROMPTS.length - 1) {
      console.log('  Waiting 5 seconds before next request...\n');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  // Summary
  console.log('\nGeneration Summary:');
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
  }

  if (failed > 0) {
    console.log('\nFailed images:');
    results
      .filter((r) => !r.success)
      .forEach((r) => console.log(`  - ${r.name}`));
  }

  console.log('\nDone!');
}

main().catch(console.error);
