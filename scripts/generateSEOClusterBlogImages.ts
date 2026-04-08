/**
 * Script to generate blog post images for Tier 2 SEO content cluster posts
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
const OUTPUT_DIR = path.join(__dirname, '../../frontend/public/images/blog');

const BLOG_IMAGE_PROMPTS = [
  {
    name: 'best-ai-grading-tools-for-teachers',
    prompt: `Create an editorial illustration of a teacher's kitchen counter with a stack of student papers and a laptop showing an AI grading interface. The scene captures the Sunday grading struggle — papers fanned out, a red pen, a cold coffee mug, and a laptop screen showing colorful rubric scores. Warm kitchen lighting, afternoon sun through a window. The mood is hopeful — technology meeting the grading pile. COLOR PALETTE: Teal (#2D5A4A), cream (#FDF8F3), gold (#D4A853). STYLE: Modern editorial photography, landscape blog header format.`,
  },
  {
    name: 'rubric-examples-elementary',
    prompt: `Create a warm editorial illustration of an elementary teacher's desk with several printed rubric sheets and student papers being graded. Show colorful rubric grids with highlighted performance levels, a teacher's hand holding a pen circling a score, and neatly organized student work. The desk is well-lit and organized — this is what systematic grading looks like. Include colorful rubric templates visible on the papers. COLOR PALETTE: Teal (#2D5A4A), cream (#FDF8F3), sage green (#7BAE7F). STYLE: Clean editorial photography, landscape blog header.`,
  },
  {
    name: 'how-to-grade-faster-teacher',
    prompt: `Create an editorial illustration showing a teacher's desk split into two halves — one side chaotic (towering stack of papers, multiple red pens, crumpled sticky notes, cold coffee) and the other side organized (neat piles sorted into three groups, a timer, a rubric, a laptop). The contrast tells the story of grading before and after adopting better systems. Warm lighting, clean composition. COLOR PALETTE: Teal (#2D5A4A), cream (#FDF8F3), gold (#D4A853). STYLE: Editorial split-composition photography, landscape blog header.`,
  },
  {
    name: 'formative-assessment-ideas-elementary',
    prompt: `Create a vibrant editorial illustration of an elementary classroom during a formative assessment moment. A teacher stands at the front while diverse students hold up small whiteboards with their answers written in marker. Some students look confident, others are thinking. The teacher scans the room with an engaged, purposeful expression. Colorful classroom with student work on walls. Natural classroom lighting. COLOR PALETTE: Teal (#2D5A4A), cream (#FDF8F3), sage (#7BAE7F), gold (#D4A853). STYLE: Warm editorial classroom photography, landscape blog header.`,
  },
  {
    name: 'exit-ticket-examples-elementary',
    prompt: `Create an editorial illustration of a teacher's hand sorting small exit ticket papers (half-sheets and sticky notes) into three neat piles on a desk after class. The sticky notes show student handwriting (blurred/not readable). Three labeled sections visible: a green area, yellow area, and red area representing "got it", "almost", and "reteach." The classroom is empty, afternoon light streaming in — the quiet moment after students leave where data becomes decisions. COLOR PALETTE: Teal (#2D5A4A), cream (#FDF8F3), green/yellow/coral accents. STYLE: Intimate editorial photography, landscape blog header.`,
  },
  {
    name: 'iep-goal-bank-elementary',
    prompt: `Create an editorial illustration of a special education teacher's organized digital workspace showing an IEP goal bank document. A laptop screen shows a well-organized document with color-coded sections (reading in blue, math in green, behavior in orange). The teacher sits in a resource room with IEP binders on a shelf behind them. Their expression is calm and confident — this is a teacher who has a system. Warm, professional lighting. COLOR PALETTE: Teal (#2D5A4A), cream (#FDF8F3), multicolor coded sections. STYLE: Professional editorial photography, landscape blog header.`,
  },
  {
    name: 'iep-goals-autism-spectrum',
    prompt: `Create a warm, sensitive editorial illustration of an inclusion classroom moment. A teacher sits beside a student at a small table, working together on a visual schedule or social story. The student has tools nearby — noise-reducing headphones hanging on their chair, a fidget on the table, a visual timer. The interaction is warm and respectful — two people working together, not a teacher "fixing" a student. Other students work in the background. Soft, natural classroom lighting. COLOR PALETTE: Teal (#2D5A4A), cream (#FDF8F3), calming blue and sage green tones. STYLE: Sensitive, dignified editorial photography, landscape blog header.`,
  },
  {
    name: 'report-card-comments-math',
    prompt: `Create an editorial illustration of a teacher writing report card comments with math-specific materials visible. A laptop shows a report card portal with comment fields. Beside it: a student's math workbook open to fraction problems, a gradebook with scores, and a printed rubric. The teacher is focused, pen in hand, translating mathematical understanding into parent-friendly language. Late evening kitchen table setting, warm lamp light. COLOR PALETTE: Teal (#2D5A4A), cream (#FDF8F3), gold (#D4A853). STYLE: Intimate editorial photography, landscape blog header.`,
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

UNIVERSAL REQUIREMENTS:
- Completely safe and appropriate for all audiences
- Do NOT include any readable text, words, letters, or numbers
- All characters friendly, warm, and welcoming
- Diverse representation where multiple people are shown
- High-resolution, suitable for professional blog use
- Consistent lighting and color grading
- Landscape aspect ratio (16:9) for blog headers`;

    console.log('  Generating: "' + prompt.substring(0, 80) + '..."');

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: enhancedPrompt }] }],
      generationConfig: { responseModalities: ['image', 'text'] },
    } as any);

    const parts = result.response.candidates?.[0]?.content?.parts;
    if (!parts) { console.error('  No response parts'); return null; }

    for (const part of parts) {
      if ((part as any).inlineData) {
        return Buffer.from((part as any).inlineData.data, 'base64');
      }
    }
    console.error('  No image data'); return null;
  } catch (error) {
    console.error('  Error:', error);
    return null;
  }
}

async function main() {
  console.log('Tier 2 Blog Image Generator\n');
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let success = 0, fail = 0;
  for (let i = 0; i < BLOG_IMAGE_PROMPTS.length; i++) {
    const item = BLOG_IMAGE_PROMPTS[i];
    console.log(`[${i + 1}/${BLOG_IMAGE_PROMPTS.length}] ${item.name}`);
    const buf = await generateImage(item.prompt);
    if (buf) {
      fs.writeFileSync(path.join(OUTPUT_DIR, item.name + '.jpg'), buf);
      console.log('  Saved!\n');
      success++;
    } else {
      console.log('  FAILED\n');
      fail++;
    }
    if (i < BLOG_IMAGE_PROMPTS.length - 1) {
      console.log('  Waiting 5s...\n');
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  console.log(`\nDone: ${success} success, ${fail} failed`);
}

main().catch(console.error);
