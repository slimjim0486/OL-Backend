/**
 * Script to generate blog post images for new articles using Gemini 3 Pro Image
 * Run with: npx tsx scripts/generateNewBlogImages.ts
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

const OUTPUT_DIR = path.join(__dirname, '../../marketing/generated-assets/blog');

const BLOG_IMAGE_PROMPTS = [
  {
    name: 'iep-goal-writing-weekend',
    altText: 'Special education teacher working late at kitchen table surrounded by IEP documents and student files',
    prompt: `Create an emotionally resonant, photorealistic editorial illustration of a special education teacher overwhelmed by IEP paperwork late at night.

SCENE COMPOSITION: A dedicated SPED teacher (woman, early 30s) sits at her kitchen table late at night, surrounded by stacks of IEP documents, student files, and legal paperwork. The scene captures the exhausting reality of IEP season that every special education teacher knows too well.

THE TEACHER: She looks tired but deeply caring - perhaps rubbing her eyes or resting her forehead on her hand. She is wearing comfortable home clothes (a cozy sweater). Her reading glasses are pushed up on her head. Despite the exhaustion, there is determination in her posture - she cares about getting these goals right for her students.

THE EVIDENCE OF IEP WORK: The kitchen table tells the story:
- Multiple IEP binders/folders in different colors (one per student)
- A laptop open to what appears to be a document template
- Sticky notes with handwritten goals and benchmarks
- A legal pad with crossed-out attempts at writing measurable goals
- Printed assessment data and progress monitoring charts
- A cold mug of coffee or tea
- Perhaps a small stack of SMART goal reference guides

EMOTIONAL UNDERTONE: This image should make every SPED teacher feel seen. The weight of writing legally binding documents for each student, the pressure to get the language exactly right, the endless hours outside of contract time. But also the love - she does this because these students matter.

LIGHTING: Warm kitchen light mixed with cool laptop glow. The rest of the house is dark - everyone else is asleep. A single lamp illuminates her workspace. The lighting creates an intimate, slightly melancholy but dignified atmosphere.

COLOR PALETTE: Warm amber tones from the lamp, cool blue from the laptop, muted earth tones for the IEP folders. Overall warm but with a sense of quiet exhaustion. Teal and cream accents would complement the Orbit Learn brand.

STYLE: Warm editorial photography style - like a documentary photograph for a feature story about special education teachers. Emotionally powerful, dignified, and deeply relatable. Professional quality for a blog header image.`,
  },
  {
    name: 'lesson-planning-time-tracking',
    altText: 'Teacher looking at time-tracking data on laptop surrounded by lesson planning materials showing hours spent',
    prompt: `Create an emotionally powerful, photorealistic editorial illustration of a teacher confronting the shocking reality of how much time they spend on lesson planning.

SCENE COMPOSITION: A teacher (man or woman, mid-30s) sits at their desk staring at a laptop screen that shows time-tracking data - charts, hours logged, totals that tell a sobering story. Their expression shows a mix of realization and frustration - the I knew it was bad but not THIS bad moment.

THE TEACHER: They look like they have just had a realization moment - but not a happy one. Perhaps leaning back slightly in their chair, one hand covering their mouth in surprise, or fingers pressed to their temple. They are dressed casually (weekend clothes - this is their free time being consumed). Any ethnicity, relatable and authentic.

THE DATA STORY: The laptop screen is the focal point:
- A time-tracking app or spreadsheet showing hours
- Bar charts or pie charts that visually communicate too many hours
- The total is clearly alarming (though not readable as specific text)
- The screen glow illuminates their face with the harsh truth

THE PLANNING EVIDENCE: Around the desk, the artifacts of lesson planning are everywhere:
- Open textbooks and curriculum guides
- A planner or calendar with every evening blocked for planning
- Printed worksheets and handouts in various stages of creation
- A timer or stopwatch (representing the tracking)
- Multiple tabs/browsers open on the laptop
- A notepad with a time log (hash marks or tallied hours)

EMOTIONAL UNDERTONE: This is the moment of reckoning - when a teacher finally quantifies what they have always felt. The image should evoke I need to see this from every teacher who visits the blog. It is uncomfortable but validating.

LIGHTING: Bright laptop screen as the main light source, with warm desk lamp providing secondary light. The contrast between the harsh digital reality on screen and the warm human at the desk creates visual tension. Late afternoon or evening light from a window.

COLOR PALETTE: Cool blues from the screen data, warm browns and oranges from the desk environment. The contrast between cold data and warm humanity. Teal and sage green accents to complement the Orbit Learn brand.

STYLE: Modern editorial photography style - like a compelling feature image for an education publication. Should feel like a real moment captured, not staged. Professional quality for a blog header image about teacher time and burnout.`,
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
  console.log('New Blog Post Image Generator\n');
  console.log('Output directory: ' + OUTPUT_DIR + '\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Created output directory\n');
  }

  const results: { name: string; altText: string; success: boolean; path?: string }[] = [];

  for (let i = 0; i < BLOG_IMAGE_PROMPTS.length; i++) {
    const item = BLOG_IMAGE_PROMPTS[i];
    console.log('[' + (i + 1) + '/' + BLOG_IMAGE_PROMPTS.length + '] Generating: ' + item.name);
    console.log('  Alt text: "' + item.altText + '"');

    const imageBuffer = await generateImage(item.prompt);

    if (imageBuffer) {
      const outputPath = path.join(OUTPUT_DIR, item.name + '.jpg');
      fs.writeFileSync(outputPath, imageBuffer);
      console.log('  Saved: ' + outputPath + '\n');
      results.push({ name: item.name, altText: item.altText, success: true, path: outputPath });
    } else {
      console.log('  Failed to generate: ' + item.name + '\n');
      results.push({ name: item.name, altText: item.altText, success: false });
    }

    if (i < BLOG_IMAGE_PROMPTS.length - 1) {
      console.log('  Waiting 5 seconds before next request...\n');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.log('\nGeneration Summary:');
  console.log('='.repeat(60));
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  console.log('Successful: ' + successful);
  console.log('Failed: ' + failed);

  if (successful > 0) {
    console.log('\nGenerated images:');
    results
      .filter((r) => r.success)
      .forEach((r) => {
        console.log('  ' + r.name + '.jpg');
        console.log('    Alt: "' + r.altText + '"');
      });
  }

  if (failed > 0) {
    console.log('\nFailed images:');
    results
      .filter((r) => !r.success)
      .forEach((r) => console.log('  - ' + r.name));
  }

  console.log('\nDone!');
}

main().catch(console.error);
