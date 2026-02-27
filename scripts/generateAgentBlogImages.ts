/**
 * Script to generate blog post images for the Agent Evolution blog posts
 * Post 1: "I Used ChatGPT to Write My Lesson Plans..."
 * Post 2: "What If You Never Had to Plan Monday Through Friday Again?"
 *
 * Run with: npx tsx scripts/generateAgentBlogImages.ts
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

// Output directory for generated images (matches existing blog image workflow)
const OUTPUT_DIR = path.join(__dirname, '../../marketing/generated-assets/blog');

const BLOG_IMAGE_PROMPTS = [
  // ═══════════════════════════════════════════════════════════════
  // POST 1: "I Used ChatGPT to Write My Lesson Plans..."
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'chatgpt-lesson-plans-missing',
    altText: 'Teacher at laptop late at night, surrounded by multiple browser tabs and a Google Doc of prompts, looking frustrated while copying and pasting text',
    prompt: `Create an emotionally resonant, warm editorial illustration of a teacher trapped in the cycle of AI prompt engineering -- the hidden labor of using generic AI tools for lesson planning.

SCENE COMPOSITION: A dedicated female teacher (Nadia, early 30s, South Asian descent) sits at her home desk late on a Sunday evening. Her laptop is open with a chat interface visible. A second monitor or tablet shows a Google Doc titled with highlighted text (no readable words -- just colored blocks suggesting a "master prompt" document). She is mid-type, fingers on keyboard, her expression showing tired determination mixed with frustration.

THE PROMPT ENGINEERING RITUAL:
- Laptop screen shows a chat interface with a long block of text in the input area (suggesting the 112-word prompt ritual)
- A Google Doc on a second screen/tablet with highlighted text blocks (the "master prompts" template)
- Sticky notes around the monitor with abstract marks suggesting notes like "remember to add ELL" or "specify tone"
- The visual story: she is COPYING information from one place to another, over and over

THE WORKSPACE - SUNDAY EVENING VIBES:
- Home office or kitchen table workspace
- Clock suggesting late evening (hands near 9 or 10 PM)
- Cold coffee mug, half-empty
- A stack of curriculum guides or teacher edition textbooks nearby
- Dim ambient lighting -- just the desk lamp and screen glow
- Window showing evening darkness outside
- A phone face-down (she's been at this for hours)

THE TEACHER (NADIA):
- Professional but casual Sunday clothes (comfortable sweater, hair pulled back)
- Expression: not anger, but the specific exhaustion of someone doing repetitive mental labor
- Posture: slightly hunched forward, deep in concentration
- One hand perhaps rubbing her temple or pushing hair back between typing

EMOTIONAL UNDERCURRENT:
- Papers with lesson plans spread out -- some with red marks suggesting edits to AI output
- A printed lesson plan with handwritten corrections and arrows (showing the editing labor)
- The contrast between the bright, sterile screen and the warm, human workspace

COLOR PALETTE:
- Warm cream and amber tones for the room (cozy home setting)
- Cool blue-white light from screens creating contrast on her face
- Terracotta (#C75B39) accent in her mug or a notebook
- Deep teal (#2D5A5A) in a bookshelf or plant in the background
- Gold (#D4A853) in the desk lamp light
- The overall mood: warm room, cold task

STYLE: Warm editorial illustration with cinematic lighting. Like a documentary still that captures the hidden reality of teacher labor. Professional quality suitable for a blog header. The image should make teachers instantly recognize their own Sunday night ritual and feel deeply seen.

MOOD: The quiet frustration of repetitive intellectual labor. Not dramatic -- just honest. The feeling of "I know there has to be a better way, but I don't know what it is yet."`,
  },
  {
    name: 'chatgpt-vs-personalized-ai-teaching',
    altText: 'Split illustration showing the contrast between a generic AI vending machine on the left and a warm, personalized AI teaching partner on the right',
    prompt: `Create a compelling split-screen editorial illustration showing the evolution from generic AI tools to personalized AI teaching assistants -- the "vending machine vs. teaching partner" metaphor.

COMPOSITION: The image is divided into two halves with a subtle gradient transition in the middle. Left side represents the OLD way (generic AI). Right side represents the NEW way (AI that knows you). The transition should feel like moving from winter to spring -- same teacher, transformed experience.

LEFT SIDE - "THE VENDING MACHINE" (Generic AI):
- A teacher (woman, early 30s) sitting alone at a desk, typing a LONG message into a plain chat interface
- The screen shows a wall of text (the lengthy prompt)
- Her expression: focused but weary, doing labor
- The environment feels sterile, clinical -- flat lighting
- A stack of printed AI outputs with red editing marks on them
- The visual metaphor of FEEDING information in and getting generic output back
- Color treatment: slightly desaturated, cooler tones, more gray
- A subtle visual echo of a vending machine aesthetic -- transactional, impersonal
- Small clock showing time passing

RIGHT SIDE - "THE TEACHING PARTNER" (Personalized AI):
- The SAME teacher, but now relaxed, leaning back slightly, smiling
- Her screen shows a SHORT, casual message in a friendly chat interface
- The AI response on screen is rich and detailed (suggesting it already knows context)
- Around her, subtle visual elements suggesting the AI "knows" her: a small classroom photo, student group labels, a curriculum calendar -- things the AI has internalized
- A warm glow emanating from the screen, suggesting understanding and connection
- Color treatment: warm, saturated, inviting -- creams, golds, sage greens
- Her coffee is still hot (steaming!) -- she didn't have to spend hours on this
- Small clock showing minimal time passed

THE TRANSITION ZONE (Center):
- A gradient from cool/sterile to warm/inviting
- Perhaps subtle sparkle or light particles suggesting transformation
- The dividing line could have a very subtle arrow or flow direction (left to right)

COLOR PALETTE:
- Left side: Cool grays, muted blues, desaturated -- the "before"
- Right side: Warm cream (#FDF8F3), teal (#2D5A5A), terracotta (#C17F59), gold (#E8C568), sage (#87A878) -- the "after"
- The Orbit Learn brand colors should dominate the right side

STYLE: Modern editorial illustration, clean and professional. Think of comparison images in premium tech publications. Not cartoonish -- warm, human, and aspirational. Suitable for a blog about AI tools for teachers. Landscape format (16:9).

MOOD: The left side evokes recognition ("that's me now"). The right side evokes aspiration ("that's what I want"). Together, they tell a story of transformation without a single word.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // POST 2: "What If You Never Had to Plan Monday Through Friday Again?"
  // ═══════════════════════════════════════════════════════════════
  {
    name: 'weekly-prep-revolution',
    altText: 'Teacher overwhelmed at a kitchen table on Sunday evening, surrounded by curriculum guides, legal pads, and a laptop, representing the weekly planning burden',
    prompt: `Create a powerful, emotionally honest editorial illustration of a teacher deep in the Sunday evening lesson planning ritual -- the overwhelming weekly preparation that consumes every teacher's weekend.

SCENE COMPOSITION: A kitchen table transformed into a war room of lesson planning. A female teacher (Danielle, late 30s, warm features, brown hair pulled into a messy bun) sits amid the controlled chaos of weekly preparation. The scene should feel intimate, honest, and deeply recognizable to any teacher.

THE KITCHEN TABLE WAR ROOM:
- Legal pad with handwritten notes and calculations (no readable text, just abstract marks and numbers)
- Laptop open showing a blank planning template or document
- Three curriculum guide books, some open, some stacked
- Colored pens and highlighters scattered
- Sticky notes in multiple colors (suggesting different subjects or days)
- A plate with barely-touched dinner pushed to the side
- A cold coffee mug (clearly been there for hours)
- Scissors and a paper cutter nearby (she was creating physical materials)
- A printer has just spit out pages nearby

THE TEACHER (DANIELLE):
- Expression: not crying, not dramatic -- just the quiet weight of an impossible task
- She has paused, pen in hand, staring at the legal pad with the look of someone doing math that doesn't work out
- Her posture shows hours of sitting -- slightly slumped but still present
- Comfortable home clothes: oversized cardigan, ponytail
- Reading glasses pushed up on her head
- She looks like someone who cares deeply and is running out of hours

THE ENVIRONMENT - A LIFE PUT ON HOLD:
- Kitchen in the background, clean but clearly dinner was rushed
- Through a doorway or in the background: a child's drawing on the fridge, family photos
- A jacket or bag by the door suggesting plans that were cancelled
- Window showing the deep blue of evening sky transitioning to night
- The rest of the house is dim -- the kitchen table lamp creates a pool of warm light

THE IMPOSSIBLE MATH VISUAL:
- On the legal pad or a nearby paper: abstract number calculations visible (5 x 4 x 4 = suggesting the 320 materials calculation)
- Color-coded sections suggesting different subjects (math in blue, reading in green, science in orange)
- Multiple stacks of papers suggesting different ability levels
- The sheer VOLUME of materials should be visually striking

LIGHTING:
- Warm kitchen lamp light pooling on the table
- Cool laptop screen light on Danielle's face
- The contrast between warm home and cold task
- Golden hour fading in the window (she started when it was light; now it's dark)

COLOR PALETTE:
- Warm kitchen tones: cream walls, wooden table, amber lamp light
- Terracotta (#C75B39) in her cardigan or mug
- Teal (#2D5A5A) in a book spine or notebook
- Gold (#D4A853) in the lamp light
- Sage green (#87A878) in a plant on the windowsill
- The overall mood is warm but heavy -- a beautiful space being used for exhausting labor

STYLE: Cinematic editorial illustration with emotional depth. Like a still from an empathetic documentary about teaching. This should be the image that makes a teacher's partner finally understand what Sunday evenings feel like. Professional quality, landscape format (16:9), suitable for a blog header.

MOOD: The weight of love. This teacher is not here because she's lazy or disorganized. She's here because she cares about 22 children and the math doesn't work. The image should evoke empathy, recognition, and the quiet thought: "This shouldn't be how it works."`,
  },
  {
    name: 'weekly-prep-sunday-reimagined',
    altText: 'Teacher relaxed on a Sunday morning, casually reviewing lesson materials on a tablet with coffee, morning light streaming in, life happening around her',
    prompt: `Create an aspirational, warm editorial illustration of a teacher's TRANSFORMED Sunday -- the "after" image showing what weekly planning looks like when AI handles the first draft and the teacher simply reviews.

SCENE COMPOSITION: The same kitchen table from the "before" image, but COMPLETELY different energy. It's Sunday MORNING now (not evening). The table is clean. Danielle sits comfortably with a tablet or laptop, coffee steaming, reviewing materials with the relaxed focus of an editor, not the desperate energy of a creator.

THE TRANSFORMED WORKSPACE:
- Clean kitchen table with just a laptop/tablet and a coffee mug
- The tablet/laptop shows organized, colorful content (suggesting a week of pre-generated materials)
- A pen nearby for occasional notes, but mostly untouched
- No stacks of curriculum guides. No scissors. No printer. No chaos.
- Perhaps a small notebook for jotting personal touches
- The contrast with the cluttered "before" should be STRIKING

THE TEACHER (DANIELLE) - TRANSFORMED:
- Same woman, but the energy is completely different
- She's sitting back slightly, comfortable, reviewing rather than creating
- Her expression: focused but CALM -- the difference between reading a book and writing one
- Hair down and comfortable (she didn't rush to the table after getting dressed)
- She might have one foot tucked under her, suggesting she's comfortable
- Glasses on, reading, occasionally nodding or making a small note
- A slight smile -- she just approved something good

THE LIFE HAPPENING AROUND HER:
- Through a window or doorway: morning sunlight streaming in (golden, warm, hopeful)
- A child's voice suggested by: a half-eaten pancake plate nearby, a juice box
- A jacket on the back of a chair suggesting PLANS for later (not cancelled plans)
- Maybe car keys on the table ready for later (Home Depot trip, park visit)
- A family calendar on the wall with afternoon activities visible
- The kitchen shows evidence of a relaxed morning: pancake batter bowl, syrup
- A phone face-UP with a text visible (she's available, not buried in work)

THE TIME CONTRAST:
- A clock showing approximately 11:30 AM or noon (she'll be done by 12:04!)
- Morning light flooding the space
- Everything about the lighting says "beginning of the day" not "end of the day"
- The window shows blue sky, trees, a beautiful day waiting

THE SCREEN CONTENT (subtle, not readable):
- Colorful, organized blocks suggesting a full week of materials
- Small checkmarks appearing (approved materials)
- The interface looks friendly and organized, not like a blank document
- Colorful indicators suggesting different subjects and days

COLOR PALETTE:
- Dominant warm morning light: golden yellows, soft creams
- Cream walls (#FDF8F3) glowing in morning sun
- Terracotta (#C75B39) in a warm mug or her comfortable top
- Teal (#2D5A5A) as accent in screen interface or a plant
- Gold (#D4A853) in the abundant morning sunlight
- Sage green (#87A878) in visible plants, trees through window
- Everything feels WARM, LIGHT, OPEN, FREE

STYLE: Aspirational editorial illustration with abundant morning light. Like a lifestyle magazine photograph that captures a peaceful, productive morning. The image should make teachers think "I want THAT Sunday." Not staged or fake -- genuinely warm, real, and inviting. Landscape format (16:9), professional quality for blog use.

MOOD: Freedom. Relief. Possibility. The Sunday that was stolen by lesson planning for ten years has been returned. The image should feel like taking a deep breath. Like waking up and knowing the day is yours. Like hope made visible.`,
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
  console.log('Agent Evolution Blog Post Image Generator\n');
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
      console.log(`  Saved: ${outputPath}\n`);
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
  }

  if (failed > 0) {
    console.log('\nFailed images (retry manually):');
    results
      .filter((r) => !r.success)
      .forEach((r) => console.log(`  ${r.name}`));
  }

  console.log('\nImage assignments:');
  console.log('  Post 1 hero: chatgpt-lesson-plans-missing.jpg');
  console.log('  Post 1 mid:  chatgpt-vs-personalized-ai-teaching.jpg');
  console.log('  Post 2 hero: weekly-prep-revolution.jpg');
  console.log('  Post 2 mid:  weekly-prep-sunday-reimagined.jpg');
  console.log('\nDone!');
}

main().catch(console.error);
