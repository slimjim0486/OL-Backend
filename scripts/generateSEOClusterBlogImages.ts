/**
 * Script to generate blog post images for SEO content cluster posts (April 2026)
 * Uses Gemini Flash Image Preview model
 * Run with: npx tsx scripts/generateSEOClusterBlogImages.ts
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

// Output directly to the blog images directory
const OUTPUT_DIR = path.join(__dirname, '../../frontend/public/images/blog');

const BLOG_IMAGE_PROMPTS = [
  {
    name: 'iep-goals-reading-examples',
    prompt: `Create a warm, emotionally resonant editorial illustration of a special education teacher writing IEP reading goals for a student.

SCENE: A caring female teacher (early 30s, any ethnicity) sits at a desk reviewing student reading assessment data. She has a thoughtful, focused expression — the look of someone translating deep knowledge of a child into precise language.

KEY ELEMENTS:
- Open laptop showing a document template
- Printed reading assessment data and fluency charts spread on the desk
- A child's leveled reader book visible nearby
- Colorful sticky notes with goal drafts
- A warm cup of tea or coffee
- Soft ambient lighting suggesting late afternoon in a school resource room

MOOD: Dedicated, caring, professional. This teacher knows her students deeply and wants to get the goals right.

COLOR PALETTE: Warm teal (#2D5A4A) and cream (#FDF8F3) tones with gold (#D4A853) accents. Soft, editorial feel.

STYLE: Modern editorial photography — warm, intimate, professional. Suitable for a blog header about IEP reading goals.`,
  },
  {
    name: 'iep-goals-math-examples',
    prompt: `Create a warm editorial illustration of a special education teacher working on math IEP goals with student math work samples visible.

SCENE: A dedicated teacher (any gender, mid-30s, any ethnicity) sits at their desk after hours reviewing a student's math work. The classroom is empty but warm — afternoon light streams through windows. They're comparing assessment data with a blank IEP goal template.

KEY ELEMENTS:
- Student math work samples showing number problems and manipulative work
- Math manipulatives (base-ten blocks, fraction tiles) on the desk edge
- A laptop open to an IEP form
- Progress monitoring graphs with data points
- The teacher holds a pen, mid-thought, looking at both the data and the goal template
- A small stack of IEP folders in different colors

MOOD: Thoughtful concentration. The quiet after-school hours where real IEP work happens.

COLOR PALETTE: Warm amber light mixing with cool classroom tones. Teal (#2D5A4A) and cream (#FDF8F3) accents.

STYLE: Editorial photography style — documentary-feeling, authentic, professional. Landscape format for blog header.`,
  },
  {
    name: 'iep-goals-behavior-examples',
    prompt: `Create an emotionally resonant editorial illustration showing a teacher observing student behavior with a data collection clipboard.

SCENE: A teacher (female, late 20s, any ethnicity) stands slightly back from a busy elementary classroom, holding a clipboard with a behavior tracking sheet. She is observing a specific student with caring attention — not surveillance, but genuine professional observation aimed at understanding and helping.

KEY ELEMENTS:
- The teacher holds a clipboard with a visible tally/checklist sheet
- In the soft-focus background, students are working at tables during a transition moment
- The teacher's expression is one of careful, compassionate observation
- Warm classroom environment with student work on walls
- A behavior chart or visual timer partially visible on a nearby wall
- Natural classroom lighting

MOOD: Professional care. This is what good behavior support looks like — patient observation, careful data collection, genuine investment in understanding the whole child.

COLOR PALETTE: Warm classroom tones with teal (#2D5A4A) and sage green (#7BAE7F) accents. Cream (#FDF8F3) warmth.

STYLE: Candid editorial photography — capturing a real moment of teacher observation. Professional, warm, relatable. Landscape blog header format.`,
  },
  {
    name: 'how-to-write-measurable-iep-goals',
    prompt: `Create a powerful editorial illustration of a special education teacher at an IEP meeting confidently presenting student progress data.

SCENE: A confident female teacher (mid-30s, any ethnicity) sits at a conference table presenting a printed page of progress monitoring data to a small group (2-3 other adults partially visible at the table edges). She looks prepared and composed — a stark contrast to how IEP meetings usually feel.

KEY ELEMENTS:
- The teacher holds a printed graph showing student progress data points and a trendline
- A neat IEP document folder is open in front of her
- Other meeting participants (partially visible) lean in with engaged, positive expressions
- A professional conference room or meeting space setting
- Good lighting — this is a daytime meeting, not a late-night struggle
- The teacher's posture conveys confidence and expertise

MOOD: Professional confidence. This is what happens when IEP goals are written well — meetings become conversations about data, not arguments about perception. Empowering.

COLOR PALETTE: Professional tones with teal (#2D5A4A) accents. Warm cream (#FDF8F3) and gold (#D4A853) highlights suggesting success.

STYLE: Corporate editorial photography — professional, empowering, aspirational but realistic. Landscape format for a pillar blog post header.`,
  },
  {
    name: 'report-card-comments-examples',
    prompt: `Create an emotionally resonant editorial illustration of a teacher writing report card comments at their kitchen table late at night.

SCENE: A teacher (any gender, early 30s, any ethnicity) sits at a kitchen table with a laptop open to a report card portal showing a grid of empty comment fields. They look thoughtful — not defeated, but searching for the right words. The house around them is dark and quiet.

KEY ELEMENTS:
- Laptop screen glowing with a report card portal (grid of text boxes visible)
- A cold cup of coffee beside the laptop
- A notepad with scribbled draft comments
- A class list or roster printed nearby
- The kitchen clock showing a late hour (subtle, not prominent)
- Warm lamp light creating an intimate workspace in the dark kitchen
- Perhaps a stack of student portfolios or a gradebook

MOOD: The quiet late-night dedication of report card season. Exhausting but meaningful — this teacher cares about finding the right words for every child.

COLOR PALETTE: Warm lamp amber mixed with cool laptop blue. Teal (#2D5A4A) and cream (#FDF8F3) overall tone.

STYLE: Intimate editorial photography — like a documentary photo essay about teacher life. Warm, relatable, dignified. Landscape blog header format.`,
  },
  {
    name: 'emergency-sub-plan-template',
    prompt: `Create an editorial illustration showing a well-organized substitute teacher plan binder on a teacher's desk, ready for use.

SCENE: A neatly organized sub plan binder sits open on a clean teacher's desk in an elementary classroom. The binder is clearly labeled and well-prepared — tabs for schedule, student info, lesson plans, emergency contacts. This is what preparedness looks like.

KEY ELEMENTS:
- An open three-ring binder with colorful labeled divider tabs
- Printed seating chart visible on one page
- A daily schedule with clear time blocks on another page
- A note on the cover that reads like a warm welcome (blur the text — suggest it without making it readable)
- The classroom is bright and organized in the background
- Perhaps a small stack of pre-printed worksheets in labeled folders nearby
- A sticky note on the binder suggesting it's emergency-ready

MOOD: Organization and preparedness. Relief. This is the system that means you never have to write sub plans from bed at 5:47 AM again.

COLOR PALETTE: Bright classroom colors with teal (#2D5A4A), gold (#D4A853), and cream (#FDF8F3) accents. Clean, organized, inviting.

STYLE: Clean editorial product-style photography — like a feature image for a teacher organization article. Bright, optimistic, practical. Landscape blog header format.`,
  },
  {
    name: 'ai-lesson-plans-3rd-grade-math',
    prompt: `Create a warm, inviting editorial illustration of a 3rd grade classroom during a hands-on fractions lesson.

SCENE: A bright, colorful 3rd grade classroom during an engaging math lesson on fractions. A teacher (any gender, early 30s, any ethnicity) works with a small group of diverse 8-year-old students at a table covered with fraction manipulatives. The students look engaged and curious — the kind of lesson where math makes sense.

KEY ELEMENTS:
- Colorful fraction tiles, fraction circles, and pattern blocks spread on the table
- Students actively handling manipulatives — folding paper, comparing fraction pieces
- The teacher pointing to or holding up fraction strips, showing equivalence
- A number line visible on the wall or whiteboard behind them
- Anchor charts about fractions partially visible
- Student work (colorful fraction drawings) displayed on the wall
- Natural classroom lighting — bright and energetic

MOOD: Joyful learning. Math made tangible and accessible. The kind of lesson where fractions click for every student in the room.

COLOR PALETTE: Bright, warm classroom tones. Teal (#2D5A4A), gold (#D4A853), and sage green (#7BAE7F) accents with cream (#FDF8F3) warmth.

STYLE: Warm editorial classroom photography — authentic, diverse, engaging. Captures the energy of hands-on math learning. Landscape blog header format.`,
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

    const enhancedPrompt = prompt + `

UNIVERSAL REQUIREMENTS FOR THIS IMAGE:
- The image must be completely safe and appropriate for all audiences
- Do NOT include any readable text, words, letters, or numbers in the image
- All characters should appear friendly, warm, and welcoming
- Include diverse representation where multiple people are shown
- The final image should be high-resolution and suitable for professional blog use
- Render with consistent lighting and color grading throughout the scene
- Aspect ratio should be landscape (16:9 or similar) suitable for blog headers`;

    console.log('  Generating with prompt: "' + prompt.substring(0, 80) + '..."');

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
  console.log('SEO Content Cluster Blog Image Generator\n');
  console.log('Output directory: ' + OUTPUT_DIR + '\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Created output directory\n');
  }

  const results: { name: string; success: boolean; path?: string }[] = [];

  for (let i = 0; i < BLOG_IMAGE_PROMPTS.length; i++) {
    const item = BLOG_IMAGE_PROMPTS[i];
    console.log('[' + (i + 1) + '/' + BLOG_IMAGE_PROMPTS.length + '] Generating: ' + item.name);

    const imageBuffer = await generateImage(item.prompt);

    if (imageBuffer) {
      const outputPath = path.join(OUTPUT_DIR, item.name + '.jpg');
      fs.writeFileSync(outputPath, imageBuffer);
      console.log('  Saved: ' + outputPath + '\n');
      results.push({ name: item.name, success: true, path: outputPath });
    } else {
      console.log('  FAILED: ' + item.name + '\n');
      results.push({ name: item.name, success: false });
    }

    // Wait between requests to avoid rate limiting
    if (i < BLOG_IMAGE_PROMPTS.length - 1) {
      console.log('  Waiting 5 seconds before next request...\n');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('GENERATION SUMMARY');
  console.log('='.repeat(60));
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  console.log('Successful: ' + successful + '/' + BLOG_IMAGE_PROMPTS.length);
  console.log('Failed: ' + failed);

  if (successful > 0) {
    console.log('\nGenerated images (ready at /images/blog/):');
    results
      .filter((r) => r.success)
      .forEach((r) => {
        console.log('  /images/blog/' + r.name + '.jpg');
      });
  }

  if (failed > 0) {
    console.log('\nFailed images (retry manually):');
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log('  ' + r.name);
      });
  }
}

main().catch(console.error);
