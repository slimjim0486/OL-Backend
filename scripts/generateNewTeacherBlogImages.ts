/**
 * Script to generate new teacher blog post images using Gemini AI
 * Run with: npx tsx scripts/generateNewTeacherBlogImages.ts
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

// New teacher blog post image prompts
const NEW_BLOG_IMAGE_PROMPTS = [
  {
    name: 'differentiation-impossible-standard',
    altText: 'Teacher surrounded by multiple lesson plan versions late at night, representing the impossible standard of differentiation',
    prompt: `Create an emotionally resonant illustration of a teacher overwhelmed by the impossible standard of differentiated instruction - the late-night struggle of trying to create personalized lessons for every student.

SCENE COMPOSITION: A dedicated teacher (man in his 30s, "Marcus" - former accountant turned teacher) sits at his kitchen table late at night, surrounded by multiple stacks of lesson plan variations. He looks exhausted but determined, caught in the impossible math of differentiation. A notepad nearby has "55 seconds" circled multiple times.

THE TEACHER (MARCUS): He shows the specific exhaustion of someone who cares deeply but faces an impossible task:
- Tired but thoughtful expression - not defeated, but wrestling with reality
- Hand perhaps running through his hair or rubbing his temple
- Professional but casual evening clothes (untucked shirt, sleeves rolled up)
- Reading glasses either on or pushed up on forehead
- Calculator or notepad visible with calculations
- His posture shows someone who's been at this for hours

THE LESSON STACKS: The visual heart of the image - three distinct piles representing differentiation attempts:
- Stack labeled/colored for "below grade level"
- Stack for "on grade level"
- Stack for "advanced/gifted"
- Post-it notes with student names visible (no readable text)
- Papers spreading across the table, slightly chaotic
- Color-coded materials suggesting different ability levels
- Fraction manipulatives or math tools scattered about

THE KITCHEN TABLE WORKSPACE: A home setting showing dedication:
- Cold coffee mug (clearly been there hours)
- Laptop open showing spreadsheets or planning documents
- Pencils and colored pens scattered
- A family photo visible in the background (wife and young daughter)
- Clock on wall suggesting 11 PM or later
- Kitchen light on while rest of house is dark
- Window showing complete darkness outside

THE NOTEPAD DETAIL: Prominently visible - a notepad with simple math:
- "27 students"
- "45 minutes"
- "55 seconds each" (circled multiple times)
- This tells the story of the impossible standard

LIGHTING: Warm kitchen light creates a pool of illumination on the chaotic table and Marcus's tired face. The rest of the house is dark - family is asleep. The laptop provides cool contrast light. The lighting should feel intimate and late-night.

EMOTIONAL TONE: The image should evoke:
- Deep recognition from teachers ("I've been exactly there")
- Empathy for the impossible expectations placed on educators
- The conflict between caring deeply and mathematical impossibility
- Dignity in the struggle - this teacher loves his students
- A sense of something that needs to change

COLOR PALETTE: Warm kitchen lamp light (amber-yellow) on the papers and face. The three lesson stacks could have subtle color coding (blue, green, purple). Dark shadows in the background. Red pen marks on papers. The mood is intimate, determined, and slightly melancholic.

VISUAL METAPHOR: The three separate lesson stacks should feel almost overwhelming - too many versions for one person to reasonably deliver. But the teacher keeps trying.

STYLE: Warm, editorial illustration style with emotional depth. Like a documentary photograph capturing the hidden reality of teaching. Professional quality suitable for a blog about the differentiation impossible standard. The image should make administrators understand what they're actually asking, and make teachers feel deeply seen.`,
  },
  {
    name: 'teacher-isolation-loneliest-profession',
    altText: 'Teacher alone in empty classroom after school, representing the isolation many educators experience',
    prompt: `Create a powerful, emotionally resonant illustration capturing the profound isolation of teaching - the loneliest profession where you're surrounded by people all day yet feel completely alone.

SCENE COMPOSITION: A teacher (woman in her early 30s, "Rachel") is in her classroom after school hours. The room is empty of students, chairs up on desks, afternoon light streaming through windows. She leans against her closed classroom door, having just had a private moment of tears. The image captures the paradox of teaching - surrounded by people all day, utterly alone in your struggles.

THE TEACHER (RACHEL): She embodies the hidden struggle of teaching:
- Back against the closed classroom door, perhaps hand still on the handle
- Expression showing she's just composed herself - slight puffiness around eyes but "mask" going back on
- Professional teacher attire (cardigan, modest dress or slacks)
- Posture that shows she's gathering herself before facing the world again
- Phone in hand (maybe just checked the time - her "90 seconds" are up)
- Looking toward the empty classroom with complex emotions

THE EMPTY CLASSROOM: The visual metaphor of isolation:
- Student chairs stacked on desks (end of day routine)
- Afternoon sunlight streaming through windows, creating long shadows
- Bulletin board visible but slightly outdated (not Instagram-worthy)
- Her desk covered with papers that need grading
- A coffee mug from the morning, long cold
- One student desk still has something left behind (reminder of the humans she serves)
- The door she leans against is her barrier between private and public self

THE HALLWAY HINT: Through a window in the door or a crack:
- Suggestion of another classroom where sounds of laughter can be heard (Jennifer's room)
- The contrast between Rachel's silence and the joy elsewhere
- Other teachers walking by who don't know her struggle

THE LIGHTING: Dramatic afternoon light:
- Golden hour sunlight streaming through classroom windows
- Long shadows across the empty floor
- Rachel partially in shadow near the door
- Dust motes visible in light beams (empty room, settled air)
- The lighting creates both beauty and melancholy

EMOTIONAL TONE: The image should evoke:
- Recognition of the isolation built into teaching's structure
- Empathy for educators who suffer in silence
- The weight of performing competence while struggling
- Hope too - she's about to go back out, still trying
- The profound loneliness of being "on" all day with no peer support

VISUAL ELEMENTS OF ISOLATION:
- The closed door as both protection and barrier
- Empty chairs as absent students/absent connection
- Her solo figure in a room designed for 30
- The silence you can almost feel
- The contrast between the warm light and emotional coldness

COLOR PALETTE: Warm afternoon golden light, but with a sense of emptiness. Soft blues and creams of typical classroom colors. Rachel's cardigan could be a muted color (burgundy, navy) that grounds her. The shadows should be long and meaningful. The overall mood is beautiful but melancholic - "golden hour loneliness."

THE MASK METAPHOR: Rachel is in the moment between private emotion and public performance. Her face should show the transition - vulnerable but composing. Teachers will recognize this exact moment.

STYLE: Cinematic, editorial illustration with deep emotional resonance. Like a still from a thoughtful film about educator mental health. Professional quality suitable for a blog about teacher isolation and the loneliest profession. The image should make non-teachers finally understand what happens behind closed classroom doors, and make teachers feel their hidden struggle is finally seen.`,
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
  console.log('New Teacher Blog Post Image Generator\n');
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
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);

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
    console.log('\nFailed images (retry manually):');
    results
      .filter((r) => !r.success)
      .forEach((r) => console.log(`  ✗ ${r.name}`));
  }

  console.log('\nDone!');
}

main().catch(console.error);
