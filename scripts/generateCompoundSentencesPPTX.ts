/**
 * One-off script to generate Compound Sentences PPTX for customer
 * Uses the Presenton API with our custom orbit-learn-teacher template
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Presenton API configuration
const PRESENTON_API_URL = 'https://api.presenton.ai/api/v1/ppt/presentation/generate';
const PRESENTON_API_KEY = process.env.PRESENTON_API_KEY;

interface PresentonRequest {
  content: string;
  instructions?: string;
  tone: 'default' | 'casual' | 'professional' | 'funny' | 'educational' | 'sales_pitch';
  verbosity: 'concise' | 'standard' | 'text-heavy';
  web_search: boolean;
  image_type: 'stock' | 'ai-generated';
  theme?: string;
  n_slides: number;
  language: string;
  template: string;
  include_table_of_contents: boolean;
  include_title_slide: boolean;
  export_as: 'pptx' | 'pdf';
}

interface PresentonResponse {
  presentation_id: string;
  path: string;
  edit_path: string;
  credits_consumed: number;
}

// The lesson content formatted for Presenton
const lessonContent = `
Title: Mastering Compound Sentences
Subject: English Grammar, Grades 5-8

Overview: A comprehensive lesson on compound sentences covering coordinating conjunctions (FANBOYS), conjunctive adverbs, semicolons, and colons. Students will learn four methods to join independent clauses into compound sentences.

Learning Objectives:
1. Understand what compound sentences are and how they differ from simple sentences
2. Master the seven coordinating conjunctions (FANBOYS) to join sentences
3. Learn to use conjunctive adverbs with proper punctuation
4. Apply semicolons and colons to create sophisticated compound sentences

Lesson Content:

1. What is a Compound Sentence?
A compound sentence joins two independent clauses (complete sentences) together. Each clause has its own subject and verb, and together they create a more complex thought.
Formula: compound sentence = sentence + sentence
Example: Simple sentences: "The dog found a bone." "The cat found a mouse." → Compound: "The dog found a bone, AND the cat found a mouse."

2. Independent Clauses
A clause is a word group containing a subject and a verb. An independent clause can stand alone as a complete sentence. When we join two independent clauses, we create a compound sentence. We refer to them as the "left-hand clause" and "right-hand clause."
Key Point: An independent clause IS a sentence!

3. The FANBOYS Conjunctions
There are seven coordinating conjunctions that join sentences. Use the mnemonic FANBOYS:
- For (means "because")
- And (joins similar ideas)
- Nor (used after negatives)
- But (shows contrast)
- Or (shows choice/uncertainty)
- Yet (elegant contrast, like "but")
- So (shows result, like "therefore")
Rule: Place a comma BEFORE the coordinating conjunction when joining two complete sentences.

4. Using AND and BUT
AND joins similar or agreeing ideas. It says "this is true, and this is also true."
BUT shows contrast or introduces something unexpected. It says "this is true, but here's something different."
Examples:
- "The fishermen would not harm the whales, AND the man gathering salt would look at his hurt hands."
- "Everything is the same, BUT everything is different."

5. The Other FANBOYS
FOR means "because" - gives a reason: "We were safe on the fifth floor, FOR the flood only reached the second."
SO shows result or consequence: "She took one of the six roses, SO now there are five."
OR expresses uncertainty or choice: "Hugo is at the House of Pancakes, OR he is on the autobahn."
YET is similar to BUT but more elegant: "Santa thinks he is unseen, YET the cats are watching."
NOR is used after a negative and requires a helping verb: "I do not want to be your shoebox, NOR do I want to be your dairy cow."

6. Conjunctive Adverbs
Conjunctive adverbs are longer, more formal joining words including: however, therefore, meanwhile, furthermore, consequently, nevertheless, moreover, and many more.
Punctuation Pattern: Sentence; CONJUNCTIVE ADVERB, sentence.
Examples:
- "I wanted to go; HOWEVER, it was raining."
- "She studied hard; THEREFORE, she passed."

7. Types of Conjunctive Adverbs
TIME: at last, eventually, finally, first, later, meanwhile, next, now, subsequently, then
SIMILARITY (like AND): again, also, besides, furthermore, in addition, in fact, indeed, likewise, moreover, similarly
DIFFERENCE (like BUT): conversely, even so, however, instead, nevertheless, nonetheless, on the contrary, on the other hand, still
EXAMPLES: for example, for instance, namely, that is
CAUSE-EFFECT: accordingly, as a result, consequently, hence, therefore, thus

8. Using Semicolons Alone
A semicolon (;) alone can join two closely related sentences without any conjunction. This creates a tight, sophisticated connection.
Example: "The fishermen would not harm the whales; the man gathering salt looked at his hurt hands."
Tip: Use a semicolon when two sentences are so connected they feel like one thought!

9. Using Colons
A colon (:) joins two sentences when the second clause explains, illustrates, or expands on the first. Think of it as saying "here's what I mean."
Example: "I have one goal in life: I want to travel the world."

10. Four Ways to Create Compound Sentences (Summary)
1. Comma + Coordinating Conjunction: "She ran, AND he followed."
2. Semicolon + Conjunctive Adverb + Comma: "She ran; HOWEVER, he caught up."
3. Semicolon alone: "She ran; he followed."
4. Colon: "She had one plan: she would run."

Key Vocabulary:
- Independent Clause: A complete thought with a subject and verb that can stand alone
- Compound Sentence: Two independent clauses joined together
- Coordinating Conjunction: FANBOYS words that join equal parts (for, and, nor, but, or, yet, so)
- Conjunctive Adverb: Longer joining words like however, therefore, meanwhile
- Semicolon: Punctuation (;) that joins closely related sentences
- Colon: Punctuation (:) that introduces an explanation

Key Takeaways:
- A compound sentence joins two independent clauses together
- FANBOYS (For, And, Nor, But, Or, Yet, So) are the seven coordinating conjunctions
- Conjunctive adverbs use the pattern: semicolon + word + comma
- Semicolons and colons can also create compound sentences
- Using variety in sentence structure makes writing more engaging

Practice: Try identifying compound sentences in your reading. Then practice writing your own using all four methods!
`;

async function generatePPTX(): Promise<void> {
  if (!PRESENTON_API_KEY) {
    throw new Error('PRESENTON_API_KEY is not configured');
  }

  console.log('[Presenton] Generating Compound Sentences presentation...');
  console.log(`[Presenton] Content length: ${lessonContent.length} chars`);

  const requestBody: PresentonRequest = {
    content: lessonContent,
    instructions: 'Create an engaging educational presentation for Grades 5-8 students learning about compound sentences. Use clear headings, bullet points, examples, and make it visually appealing for middle school students. Include the FANBOYS mnemonic prominently.',
    tone: 'educational',
    verbosity: 'standard',
    web_search: false,
    image_type: 'stock',
    theme: 'professional-blue',
    n_slides: 15,
    language: 'English',
    template: 'general',
    include_table_of_contents: false,
    include_title_slide: true,
    export_as: 'pptx',
  };

  console.log('[Presenton] Calling API...');

  const response = await fetch(PRESENTON_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PRESENTON_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Presenton] API error:', response.status, errorText);
    throw new Error(`Presenton API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json() as PresentonResponse;
  console.log(`[Presenton] Presentation generated: ${result.presentation_id}`);
  console.log(`[Presenton] Credits used: ${result.credits_consumed}`);
  console.log(`[Presenton] Edit URL: ${result.edit_path}`);

  // Download the generated PPTX file
  const presentonBaseUrl = PRESENTON_API_URL.replace('/api/v1/ppt/presentation/generate', '');
  const fileUrl = result.path.startsWith('http')
    ? result.path
    : `${presentonBaseUrl}${result.path}`;

  console.log(`[Presenton] Downloading PPTX from: ${fileUrl}`);

  const fileResponse = await fetch(fileUrl);
  if (!fileResponse.ok) {
    throw new Error(`Failed to download PPTX: ${fileResponse.status}`);
  }

  const arrayBuffer = await fileResponse.arrayBuffer();
  const pptxBuffer = Buffer.from(arrayBuffer);

  // Save to content folder
  const outputPath = path.join(__dirname, '../../content/Mastering Compound Sentences - Orbit Learn.pptx');

  // Ensure directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, pptxBuffer);
  console.log(`[Presenton] PPTX saved to: ${outputPath}`);
  console.log(`[Presenton] File size: ${(pptxBuffer.length / 1024).toFixed(2)} KB`);
}

// Run the script
generatePPTX()
  .then(() => {
    console.log('\n✅ Successfully generated Compound Sentences PPTX!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error generating PPTX:', error.message);
    process.exit(1);
  });
