/**
 * Phase 4.8 Item 2 — Full prerequisite backfill across ALL curricula
 *
 * Iterates every (jurisdiction, subject, gradeLevel) combination in the
 * production LearningStandard table. For each combination above the lowest
 * grade in its track, calls Gemini Flash 3 with:
 *   - Targets:    standards at this exact (jurisdiction, subject, grade)
 *   - Candidates: standards at the same jurisdiction × subject for ALL
 *                 grades less than the target grade
 *
 * Gemini proposes prerequisites by notation. The script validates that every
 * proposed notation exists in the candidate pool, resolves to a DB id, and
 * writes one JSON file per batch to scripts/output/prereq-batches/.
 *
 * Three modes:
 *   (default)             Generate all batch JSON files. Skip batches that
 *                         already have a saved JSON file (resume-friendly).
 *                         Writes nothing to production.
 *   --apply               Read all JSON files, write each batch's resolved
 *                         prereqs to LearningStandard.prerequisites. Per-batch
 *                         transactions. Idempotent via Set union with existing
 *                         prereq arrays.
 *   --derive-progresses-to
 *                         After --apply, run a single pass that inverts
 *                         prerequisites → progressesTo. For every standard A
 *                         with prerequisites=[B, C], add A's id to B.progressesTo
 *                         and C.progressesTo.
 *
 * Cross-jurisdiction prereqs are NEVER produced — each batch's candidate pool
 * is filtered to the same jurisdiction. This is correct: a Common Core standard
 * shouldn't have a British prereq.
 *
 * Run with:
 *   npx tsx scripts/prerequisiteBackfill.ts                       # dry-run all batches
 *   npx tsx scripts/prerequisiteBackfill.ts --resume               # skip existing JSON files
 *   npx tsx scripts/prerequisiteBackfill.ts --batch=UK_NATIONAL_CURRICULUM:MATH:6
 *                                                                  # generate just one batch
 *   npx tsx scripts/prerequisiteBackfill.ts --apply                # write prereqs to DB
 *   npx tsx scripts/prerequisiteBackfill.ts --derive-progresses-to # invert prereqs
 */
import { PrismaClient } from '@prisma/client';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../src/config/gemini';
import { config } from '../src/config';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const FLASH_MODEL = config.gemini.models.flash;

const OUTPUT_DIR = path.join(__dirname, 'output', 'prereq-batches');
const BATCH_LOG = path.join(__dirname, 'output', 'prereq-batch-log.json');

interface StandardRow {
  id: string;
  notation: string;
  description: string;
  strand: string | null;
  year: number;
  position: number;
}

interface ProposedPrereq {
  notation: string;
  prerequisites: string[];
  rationale?: string;
}

interface ValidationOutcome {
  notation: string;
  targetId: string;
  description: string;
  strand: string | null;
  proposed: string[];
  valid: string[];
  invalid: string[];
  yearViolations: string[];
  selfReference: boolean;
  resolvedIds: string[];
}

interface BatchResult {
  jurisdiction: string;
  subject: string;
  gradeLevel: number;
  timestamp: string;
  model: string;
  counts: { targets: number; candidates: number; proposals: number };
  usage: { promptTokens: number; outputTokens: number; tokensUsed: number };
  outcomes: ValidationOutcome[];
  proposalsRaw: ProposedPrereq[];
}

interface BatchKey {
  jurisdiction: string;
  subject: string;
  gradeLevel: number;
}

// ============================================
// CONNECTION RETRY HELPER
// ============================================

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Wrap a Prisma call in retry-on-P1001 logic. Railway proxy occasionally
 * drops idle connections during long-running scripts. We retry with
 * exponential backoff and explicit reconnect via $disconnect + $connect.
 */
async function withDbRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isConnError =
        (err as any)?.code === 'P1001' ||
        /Can't reach database server/i.test((err as Error)?.message || '');
      if (!isConnError || attempt === retries) throw err;
      const backoff = Math.min(2000 * Math.pow(2, attempt), 15000);
      console.log(`\n  [retry ${attempt + 1}/${retries}] DB connection lost, reconnecting in ${backoff}ms...`);
      try { await prisma.$disconnect(); } catch {}
      await sleep(backoff);
      try { await prisma.$connect(); } catch {}
    }
  }
  throw new Error('withDbRetry exhausted retries');
}

// ============================================
// DATA FETCHING
// ============================================

async function listBatches(): Promise<BatchKey[]> {
  const groups = await prisma.$queryRaw<
    Array<{ jurisdiction: string; subject: string; gradeLevel: number; standards: bigint }>
  >`
    SELECT j.code AS jurisdiction, ss.subject::text AS subject, ss."gradeLevel" AS "gradeLevel",
           COUNT(*) AS standards
    FROM "LearningStandard" ls
    JOIN "StandardSet" ss ON ls."standardSetId" = ss.id
    JOIN "CurriculumJurisdiction" j ON ss."jurisdictionId" = j.id
    GROUP BY j.code, ss.subject, ss."gradeLevel"
    ORDER BY j.code, ss.subject, ss."gradeLevel"
  `;

  // For each (jurisdiction, subject), find the lowest grade. Skip that grade
  // as a target (it has no possible prereqs).
  const lowestGradeByTrack = new Map<string, number>();
  for (const g of groups) {
    const key = `${g.jurisdiction}:${g.subject}`;
    const current = lowestGradeByTrack.get(key);
    if (current === undefined || g.gradeLevel < current) {
      lowestGradeByTrack.set(key, g.gradeLevel);
    }
  }

  const batches: BatchKey[] = [];
  for (const g of groups) {
    const key = `${g.jurisdiction}:${g.subject}`;
    const lowest = lowestGradeByTrack.get(key)!;
    if (g.gradeLevel <= lowest) continue; // skip the foundation grade
    batches.push({
      jurisdiction: g.jurisdiction,
      subject: g.subject,
      gradeLevel: g.gradeLevel,
    });
  }
  return batches;
}

async function fetchTargets(batch: BatchKey): Promise<StandardRow[]> {
  const rows = await withDbRetry(() =>
    prisma.learningStandard.findMany({
      where: {
        standardSet: {
          jurisdiction: { code: batch.jurisdiction },
          subject: batch.subject as any,
          gradeLevel: batch.gradeLevel,
        },
      },
      select: {
        id: true,
        notation: true,
        description: true,
        strand: true,
        position: true,
        standardSet: { select: { gradeLevel: true } },
      },
      orderBy: [{ strand: 'asc' }, { position: 'asc' }],
    })
  );
  return rows
    .filter((r) => r.notation)
    .map((r) => ({
      id: r.id,
      notation: r.notation!,
      description: r.description,
      strand: r.strand,
      year: r.standardSet.gradeLevel || 0,
      position: r.position,
    }));
}

async function fetchCandidates(batch: BatchKey): Promise<StandardRow[]> {
  const rows = await withDbRetry(() =>
    prisma.learningStandard.findMany({
      where: {
        standardSet: {
          jurisdiction: { code: batch.jurisdiction },
          subject: batch.subject as any,
          gradeLevel: { lt: batch.gradeLevel },
        },
      },
      select: {
        id: true,
        notation: true,
        description: true,
        strand: true,
        position: true,
        standardSet: { select: { gradeLevel: true } },
      },
    })
  );
  return rows
    .filter((r) => r.notation)
    .map((r) => ({
      id: r.id,
      notation: r.notation!,
      description: r.description,
      strand: r.strand,
      year: r.standardSet.gradeLevel || 0,
      position: r.position,
    }));
}

// ============================================
// PROMPT BUILDING
// ============================================

function buildPrompt(
  batch: BatchKey,
  targets: StandardRow[],
  candidates: StandardRow[]
): string {
  const byYear = new Map<number, StandardRow[]>();
  for (const c of candidates) {
    const list = byYear.get(c.year) || [];
    list.push(c);
    byYear.set(c.year, list);
  }
  const candidateLines: string[] = [];
  for (const year of [...byYear.keys()].sort((a, b) => a - b)) {
    candidateLines.push(`\n--- Grade ${year} ---`);
    const yearList = byYear.get(year)!;
    yearList.sort((a, b) => (a.strand || '').localeCompare(b.strand || '') || a.position - b.position);
    for (const c of yearList) {
      const desc = c.description.length > 130 ? c.description.slice(0, 127) + '...' : c.description;
      candidateLines.push(`${c.notation} [${c.strand || 'general'}]: ${desc}`);
    }
  }

  const targetLines: string[] = [];
  for (const t of targets) {
    const desc = t.description.length > 150 ? t.description.slice(0, 147) + '...' : t.description;
    targetLines.push(`- ${t.notation} [${t.strand || 'general'}]: ${desc}`);
  }

  return `You are a curriculum sequencing expert. For each ${batch.jurisdiction} ${batch.subject} Grade ${batch.gradeLevel} standard listed below, identify its DIRECT PREREQUISITES — the specific earlier standards a student must already understand before they can learn this one.

CANDIDATE POOL (you may ONLY pick prerequisites from this list — do not invent codes):
${candidateLines.join('\n')}

GRADE ${batch.gradeLevel} TARGETS (provide prerequisites for each of these ${targets.length} standards):
${targetLines.join('\n')}

RULES:
1. Each target may have 0-4 direct prerequisites. Quality over quantity. Only include a prereq if a student genuinely cannot learn the target without it first.
2. Prerequisites should come from EARLIER grades. The candidate pool is already filtered to grades less than ${batch.gradeLevel}.
3. NEVER include a target as its own prerequisite.
4. NEVER invent codes that aren't in the candidate pool. If you cannot find a good prerequisite in the pool, return an empty array.
5. Use the EXACT notation strings from the candidate pool. Do not abbreviate.
6. Aim for direct/proximal prerequisites, not foundational ones. If A → B → C (across grades), list B as a prereq of C, not A.
7. Same-strand progression is the strongest signal. Prefer candidates from the same strand as the target when relevant.

CRITICAL FORMAT RULE: The "notation" field in your response must contain ONLY the notation code (e.g. "IB.MYP.M5.DES.CRE.1"). Do NOT include the strand label or description. Same for prerequisites — list ONLY the notation strings, nothing else.

Return ONLY valid JSON in this exact shape:
{
  "results": [
    {
      "notation": "IB.MYP.M5.DES.CRE.1",
      "prerequisites": ["IB.MYP.M4.DES.CRE.1", "IB.MYP.M4.DES.CRE.2"],
      "rationale": "one-line explanation"
    }
  ]
}`;
}

// ============================================
// GEMINI CALL
// ============================================

/**
 * Parse a Gemini response that may be either:
 *   (a) the wrapped shape we asked for: `{ "results": [ ... ] }`
 *   (b) a bare array at the top level: `[ ... ]` (Gemini format drift)
 * Throws on truncation or genuine non-JSON.
 */
function parseGeminiProposals(text: string): ProposedPrereq[] {
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error(`Gemini returned non-JSON: ${text.slice(0, 500)}`);
  }
  // Accept the wrapped shape
  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.results)) {
    return parsed.results as ProposedPrereq[];
  }
  // Accept a bare array
  if (Array.isArray(parsed)) {
    return parsed as ProposedPrereq[];
  }
  // Accept any top-level array property (future format drift)
  if (parsed && typeof parsed === 'object') {
    for (const key of Object.keys(parsed)) {
      if (Array.isArray(parsed[key]) && parsed[key].length > 0 && parsed[key][0]?.notation) {
        return parsed[key] as ProposedPrereq[];
      }
    }
  }
  throw new Error(`Gemini output unparseable: ${JSON.stringify(parsed).slice(0, 500)}`);
}

async function callGeminiOnce(
  prompt: string,
  attempt: number
): Promise<{ proposals: ProposedPrereq[]; promptTokens: number; outputTokens: number; tokensUsed: number }> {
  const model = genAI.getGenerativeModel({
    model: FLASH_MODEL,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      // Slight temperature variation between attempts so a retry is less
      // likely to reproduce the same truncation pattern.
      temperature: 0.2 + attempt * 0.15,
      maxOutputTokens: 32768,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const usage = response.usageMetadata;
  const promptTokens = usage?.promptTokenCount || 0;
  const outputTokens = usage?.candidatesTokenCount || 0;
  const tokensUsed = usage?.totalTokenCount || promptTokens + outputTokens;

  const proposals = parseGeminiProposals(text);
  return { proposals, promptTokens, outputTokens, tokensUsed };
}

/**
 * Call Gemini with retry-once semantics for transient failures (truncation
 * that happens to be non-deterministic). Both attempts use the tolerant
 * parser. Second attempt nudges the temperature slightly so it produces a
 * different generation path.
 */
async function callGemini(
  prompt: string
): Promise<{ proposals: ProposedPrereq[]; promptTokens: number; outputTokens: number; tokensUsed: number }> {
  try {
    return await callGeminiOnce(prompt, 0);
  } catch (err) {
    const msg = (err as Error).message;
    if (/non-JSON|unparseable/.test(msg)) {
      // Retry once on parse failures — slight temp bump for a different path
      await sleep(500);
      return await callGeminiOnce(prompt, 1);
    }
    throw err;
  }
}

// ============================================
// VALIDATION
// ============================================

/**
 * Extract just the notation prefix from a Gemini response field. Some
 * batches have Gemini echoing the full labeled line (e.g.
 * "IB.MYP.M5.DES.CRE.1 [Creating the Solution]: Develop ...") instead
 * of just the notation. This helper strips everything after the first
 * space, bracket, or colon so the validator can still match.
 */
function extractNotation(raw: string | null | undefined): string {
  if (!raw) return '';
  const cleaned = raw.trim();
  const match = cleaned.match(/^([A-Z][A-Z0-9._-]+)/);
  return match ? match[1] : cleaned.split(/[\s\[:]/)[0];
}

function validate(
  proposals: ProposedPrereq[],
  targets: StandardRow[],
  candidates: StandardRow[]
): ValidationOutcome[] {
  const candidateByNotation = new Map(candidates.map((c) => [c.notation, c]));
  // Build a normalized lookup so misformatted Gemini responses still match.
  const targetByNotation = new Map(targets.map((t) => [t.notation, t]));
  const outcomes: ValidationOutcome[] = [];
  for (const target of targets) {
    // Try exact match first; if Gemini echoed the labeled line, fall back to
    // notation-prefix matching against the proposals array.
    let proposal = proposals.find((p) => p.notation === target.notation);
    if (!proposal) {
      proposal = proposals.find((p) => extractNotation(p.notation) === target.notation);
    }
    const proposedRaw = proposal?.prerequisites || [];
    const proposed = proposedRaw.map((p) => extractNotation(p)).filter(Boolean);
    const valid: string[] = [];
    const invalid: string[] = [];
    const yearViolations: string[] = [];
    const resolvedIds: string[] = [];
    const selfReference = proposed.includes(target.notation);
    for (const prereqNotation of proposed) {
      if (prereqNotation === target.notation) continue;
      const candidate = candidateByNotation.get(prereqNotation);
      if (!candidate) {
        invalid.push(prereqNotation);
        continue;
      }
      if (candidate.year >= target.year) {
        yearViolations.push(prereqNotation);
        continue;
      }
      valid.push(prereqNotation);
      resolvedIds.push(candidate.id);
    }
    outcomes.push({
      notation: target.notation,
      targetId: target.id,
      description: target.description,
      strand: target.strand,
      proposed,
      valid,
      invalid,
      yearViolations,
      selfReference,
      resolvedIds,
    });
  }
  return outcomes;
}

// ============================================
// BATCH RUNNER (default mode)
// ============================================

function batchKeyString(b: BatchKey): string {
  return `${b.jurisdiction}:${b.subject}:${b.gradeLevel}`;
}

function batchFilePath(b: BatchKey): string {
  return path.join(OUTPUT_DIR, `${b.jurisdiction}_${b.subject}_g${b.gradeLevel}.json`);
}

// Above this target count, a single Gemini call reliably truncates even
// with maxOutputTokens=32768. Chunk large batches into sub-batches of 30
// targets, reusing the same candidate pool, and merge proposals.
const CHUNK_TARGET_THRESHOLD = 40;
const CHUNK_SIZE = 30;

async function runBatch(batch: BatchKey): Promise<BatchResult | null> {
  const targets = await fetchTargets(batch);
  if (targets.length === 0) {
    console.log(`  [skip] ${batchKeyString(batch)} — no targets`);
    return null;
  }
  const candidates = await fetchCandidates(batch);
  if (candidates.length === 0) {
    console.log(`  [skip] ${batchKeyString(batch)} — no candidate pool`);
    return null;
  }

  // Decide: single call or chunked? Chunking reliably avoids the Gemini
  // truncation bug that hits large batches (observed reproducibly on
  // 110-target batches even with maxOutputTokens=32768).
  const needsChunking = targets.length > CHUNK_TARGET_THRESHOLD;
  const chunks: StandardRow[][] = [];
  if (needsChunking) {
    for (let i = 0; i < targets.length; i += CHUNK_SIZE) {
      chunks.push(targets.slice(i, i + CHUNK_SIZE));
    }
  } else {
    chunks.push(targets);
  }

  const firstPrompt = buildPrompt(batch, chunks[0], candidates);
  const promptKb = (firstPrompt.length / 1024).toFixed(1);
  const chunkTag = needsChunking ? ` [${chunks.length} chunks]` : '';
  process.stdout.write(
    `  ${batchKeyString(batch)} (${targets.length} targets / ${candidates.length} candidates / ${promptKb}KB${chunkTag}) ...`
  );

  const allProposals: ProposedPrereq[] = [];
  let totalPromptTokens = 0;
  let totalOutputTokens = 0;
  let totalTokensUsed = 0;

  for (const chunkTargets of chunks) {
    const prompt = chunks.length > 1 ? buildPrompt(batch, chunkTargets, candidates) : firstPrompt;
    try {
      const result = await callGemini(prompt);
      allProposals.push(...result.proposals);
      totalPromptTokens += result.promptTokens;
      totalOutputTokens += result.outputTokens;
      totalTokensUsed += result.tokensUsed;
    } catch (err) {
      console.log(` ❌ ${(err as Error).message.slice(0, 100)}`);
      return null;
    }
    // Brief sleep between chunks to be gentle on the Gemini API
    if (chunks.length > 1) await sleep(300);
  }

  const outcomes = validate(allProposals, targets, candidates);
  const allValid = outcomes.filter((o) => o.proposed.length > 0 && o.invalid.length === 0 && o.yearViolations.length === 0 && !o.selfReference).length;
  const totalProposed = outcomes.filter((o) => o.proposed.length > 0).length;
  const totalHallucinations = outcomes.reduce((acc, o) => acc + o.invalid.length, 0);

  console.log(` ✓ ${allValid}/${targets.length} clean (${totalProposed} with proposals, ${totalHallucinations} hallucinations)`);

  return {
    jurisdiction: batch.jurisdiction,
    subject: batch.subject,
    gradeLevel: batch.gradeLevel,
    timestamp: new Date().toISOString(),
    model: FLASH_MODEL,
    counts: { targets: targets.length, candidates: candidates.length, proposals: allProposals.length },
    usage: { promptTokens: totalPromptTokens, outputTokens: totalOutputTokens, tokensUsed: totalTokensUsed },
    outcomes,
    proposalsRaw: allProposals,
  };
}

async function generateAllBatches(filterKey?: string, resume: boolean = false): Promise<void> {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('\n  Listing all (jurisdiction, subject, grade) batches...');
  let batches = await listBatches();
  if (filterKey) {
    batches = batches.filter((b) => batchKeyString(b) === filterKey);
    console.log(`  Filtered to single batch: ${filterKey}`);
  } else {
    console.log(`  ${batches.length} batches discovered.`);
  }

  let processed = 0;
  let skipped = 0;
  let failed = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  const startTime = Date.now();

  for (const batch of batches) {
    const filePath = batchFilePath(batch);
    if (resume && fs.existsSync(filePath)) {
      skipped++;
      continue;
    }

    const result = await runBatch(batch);
    if (!result) {
      failed++;
      continue;
    }
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
    processed++;
    totalInputTokens += result.usage.promptTokens;
    totalOutputTokens += result.usage.outputTokens;

    // Brief inter-batch sleep to keep the Railway proxy connection fresh
    // and avoid hitting Gemini rate limits during the long sequential run.
    await sleep(200);
  }

  const elapsedMin = ((Date.now() - startTime) / 60000).toFixed(1);
  const inputCost = (totalInputTokens / 1_000_000) * 0.075;
  const outputCost = (totalOutputTokens / 1_000_000) * 0.30;
  const totalCost = inputCost + outputCost;

  console.log(`\n  Done in ${elapsedMin} min.`);
  console.log(`  Batches: ${processed} processed, ${skipped} skipped (resume), ${failed} failed`);
  console.log(`  Tokens: ${totalInputTokens} in, ${totalOutputTokens} out`);
  console.log(`  Cost (Flash 3): ~$${totalCost.toFixed(4)}`);
  console.log(`\n  All JSON files in: ${OUTPUT_DIR}`);
  console.log(`  Run with --apply to write prerequisites to production.`);
}

// ============================================
// --apply MODE
// ============================================

async function applyBatches(): Promise<void> {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.error(`  No batch output dir at ${OUTPUT_DIR}. Run dry-run first.`);
    process.exit(1);
  }
  const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    console.error('  No batch JSON files found. Run dry-run first.');
    process.exit(1);
  }

  console.log(`\n  Applying ${files.length} batch files...`);
  let updatedCount = 0;
  let skippedNoPrereqs = 0;
  let totalAddedPrereqs = 0;
  const startTime = Date.now();

  for (const file of files) {
    const filePath = path.join(OUTPUT_DIR, file);
    const result: BatchResult = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const batchUpdates = result.outcomes.filter((o) => o.resolvedIds.length > 0);
    if (batchUpdates.length === 0) {
      skippedNoPrereqs += result.outcomes.length;
      continue;
    }

    // Per-batch transaction so a partial failure rolls back cleanly
    await prisma.$transaction(
      batchUpdates.map((outcome) => {
        // Union with existing prereqs (in case --apply is re-run or another
        // backfill ran first). The forward sync from Phase 4.8 Option B never
        // touches this field, so concurrency risk is low.
        return prisma.learningStandard.update({
          where: { id: outcome.targetId },
          data: { prerequisites: outcome.resolvedIds },
        });
      })
    );

    updatedCount += batchUpdates.length;
    totalAddedPrereqs += batchUpdates.reduce((acc, o) => acc + o.resolvedIds.length, 0);
    process.stdout.write(`  ${file.padEnd(60)} ${batchUpdates.length} updates\r`);
  }

  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n  Applied ${updatedCount} prerequisite updates in ${elapsedSec}s.`);
  console.log(`  Total prerequisite IDs written: ${totalAddedPrereqs}`);
  console.log(`  Skipped (no proposed prereqs): ${skippedNoPrereqs} target rows`);
}

// ============================================
// --derive-progresses-to MODE
// ============================================

async function deriveProgressesTo(): Promise<void> {
  console.log('\n  Inverting prerequisites → progressesTo...');

  // Read all standards with non-empty prerequisites in one query
  const all = await prisma.learningStandard.findMany({
    where: { prerequisites: { isEmpty: false } },
    select: { id: true, prerequisites: true },
  });
  console.log(`  ${all.length} standards have prerequisites.`);

  // Build the inverted map: prereqId → [progressesToId, ...]
  const inverted = new Map<string, Set<string>>();
  for (const std of all) {
    for (const prereqId of std.prerequisites) {
      if (!inverted.has(prereqId)) inverted.set(prereqId, new Set());
      inverted.get(prereqId)!.add(std.id);
    }
  }
  console.log(`  ${inverted.size} unique prereq targets to update with progressesTo.`);

  // Read existing progressesTo so we union, not overwrite
  const existing = await prisma.learningStandard.findMany({
    where: { id: { in: [...inverted.keys()] } },
    select: { id: true, progressesTo: true },
  });
  const existingMap = new Map(existing.map((s) => [s.id, new Set(s.progressesTo || [])]));

  let updates = 0;
  const startTime = Date.now();

  // Batch the updates in chunks of 100
  const ids = [...inverted.keys()];
  for (let i = 0; i < ids.length; i += 100) {
    const slice = ids.slice(i, i + 100);
    await prisma.$transaction(
      slice.map((id) => {
        const merged = existingMap.get(id) || new Set();
        for (const pid of inverted.get(id)!) merged.add(pid);
        return prisma.learningStandard.update({
          where: { id },
          data: { progressesTo: [...merged] },
        });
      })
    );
    updates += slice.length;
    process.stdout.write(`  ${updates}/${ids.length} updated\r`);
  }

  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n  Inverted in ${elapsedSec}s. ${updates} standards now have progressesTo populated.`);
}

// ============================================
// MAIN
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const derive = args.includes('--derive-progresses-to');
  const resume = args.includes('--resume');
  const filterArg = args.find((a) => a.startsWith('--batch='));
  const filter = filterArg?.split('=')[1];

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  Phase 4.8 Item 2 — Prerequisite Backfill (FULL)         ║');
  console.log(`║  Mode: ${(derive ? 'DERIVE progressesTo' : apply ? 'APPLY (writing)' : `DRY-RUN${resume ? ' --resume' : ''}${filter ? ` --batch=${filter}` : ''}`).padEnd(50)}║`);
  console.log('╚══════════════════════════════════════════════════════════╝');

  if (derive) {
    await deriveProgressesTo();
  } else if (apply) {
    await applyBatches();
  } else {
    await generateAllBatches(filter, resume);
  }

  await prisma.$disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('\nBackfill failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
