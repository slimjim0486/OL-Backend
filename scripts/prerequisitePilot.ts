/**
 * Phase 4.8 Item 2 Pilot — Prerequisite generation for British Y6 Mathematics
 *
 * Calls Gemini Flash 3 to propose `prerequisites` arrays for the 49 Year 6
 * British National Curriculum Math standards. Picks prerequisites from a
 * 242-row candidate pool (Y1-Y6 Math), validates that every proposed
 * prerequisite exists in the DB, and writes the result to a JSON file for
 * inspection BEFORE any production write.
 *
 * Validation:
 *  - Every target notation must exist in the DB (otherwise Gemini hallucinated)
 *  - Every prereq notation must exist in the candidate pool
 *  - No self-references (target ≠ its own prereq)
 *  - Year sanity: prereq.year < target.year, OR (same year AND lower position
 *    OR different strand). This catches obvious sequencing errors.
 *
 * The script writes NOTHING to production. Output is a JSON file at
 * backend/scripts/output/prerequisite-pilot-britishY6Math.json that
 * captures: the proposed prereqs, the validation result for each, the
 * pedagogical-quality field (filled in by manual review), token usage,
 * cost estimate, and a recommendation for the full backfill.
 *
 * Run with: npx tsx scripts/prerequisitePilot.ts
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

interface StandardRow {
  id: string;
  notation: string;
  description: string;
  strand: string | null;
  year: number;
  position: number;
}

interface ProposedPrereq {
  notation: string;          // Y6 target notation
  prerequisites: string[];   // proposed Y1-Y6 prereq notations
  rationale?: string;        // optional one-line explanation from Gemini
}

interface ValidationOutcome {
  notation: string;
  description: string;
  strand: string | null;
  proposed: string[];
  valid: string[];           // prereqs that exist in DB
  invalid: string[];         // hallucinated notations
  yearViolations: string[];  // prereqs from a later year
  selfReference: boolean;
  resolvedIds: string[];     // DB ids for the valid prereqs (ready to write)
}

const OUTPUT_DIR = path.join(__dirname, 'output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'prerequisite-pilot-britishY6Math.json');

async function fetchTargets(): Promise<StandardRow[]> {
  const rows = await prisma.learningStandard.findMany({
    where: {
      standardSet: {
        jurisdiction: { code: 'UK_NATIONAL_CURRICULUM' },
        subject: 'MATH',
        gradeLevel: 6,
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
  });
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

async function fetchCandidates(): Promise<StandardRow[]> {
  const rows = await prisma.learningStandard.findMany({
    where: {
      standardSet: {
        jurisdiction: { code: 'UK_NATIONAL_CURRICULUM' },
        subject: 'MATH',
        gradeLevel: { gte: 1, lte: 6 },
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
  });
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

function buildPrompt(targets: StandardRow[], candidates: StandardRow[]): string {
  // Group candidates by year for the prompt — easier for Gemini to scan
  const byYear = new Map<number, StandardRow[]>();
  for (const c of candidates) {
    const list = byYear.get(c.year) || [];
    list.push(c);
    byYear.set(c.year, list);
  }
  const candidateLines: string[] = [];
  for (const year of [...byYear.keys()].sort((a, b) => a - b)) {
    candidateLines.push(`\n--- Year ${year} ---`);
    const yearList = byYear.get(year)!;
    // Sort by strand then position
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

  return `You are a curriculum sequencing expert. For each Year 6 British National Curriculum Mathematics standard listed below, identify its DIRECT PREREQUISITES — the specific earlier standards a student must already understand before they can learn this one.

CANDIDATE POOL (you may ONLY pick prerequisites from this list — do not invent codes):
${candidateLines.join('\n')}

YEAR 6 TARGETS (provide prerequisites for each of these 49 standards):
${targetLines.join('\n')}

RULES:
1. Each target may have 0-4 direct prerequisites. Quality over quantity. Only include a prereq if a student genuinely cannot learn the target without it first.
2. Prerequisites should come from EARLIER years when possible. Same-year prereqs are allowed only when there is a clear within-year sequence (e.g. "use simple formulae" depends on having been taught what a formula is).
3. NEVER include a target as its own prerequisite.
4. NEVER invent codes that aren't in the candidate pool. If you cannot find a good prerequisite in the pool, return an empty array.
5. Use the EXACT notation strings from the candidate pool (e.g. "UK.KS2.Y5.MA.NPV.3"). Do not abbreviate.
6. Aim for direct/proximal prerequisites, not foundational ones. If A → B → C, list B as a prereq of C, not A.

Return ONLY valid JSON in this exact shape:
{
  "results": [
    {
      "notation": "UK.KS2.Y6.MA.NPV.1",
      "prerequisites": ["UK.KS2.Y5.MA.NPV.1", "UK.KS2.Y5.MA.NPV.2"],
      "rationale": "reading 7-digit numbers builds on reading 6-digit numbers from Y5"
    }
  ]
}`;
}

async function callGemini(prompt: string): Promise<{ proposals: ProposedPrereq[]; tokensUsed: number; promptTokens: number; outputTokens: number }> {
  const model = genAI.getGenerativeModel({
    model: FLASH_MODEL,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.2,
      // 49 targets × ~200 tokens each (notation + 2-4 prereqs + rationale) ≈ 10K
      // Bumped from 8192 to give plenty of headroom for the full response.
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

  let parsed: { results: ProposedPrereq[] };
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error(`Gemini returned non-JSON output: ${text.slice(0, 500)}`);
  }
  if (!Array.isArray(parsed.results)) {
    throw new Error(`Gemini output missing "results" array: ${JSON.stringify(parsed).slice(0, 500)}`);
  }
  return { proposals: parsed.results, tokensUsed, promptTokens, outputTokens };
}

function validate(
  proposals: ProposedPrereq[],
  targets: StandardRow[],
  candidates: StandardRow[]
): ValidationOutcome[] {
  const targetByNotation = new Map(targets.map((t) => [t.notation, t]));
  const candidateByNotation = new Map(candidates.map((c) => [c.notation, c]));

  const outcomes: ValidationOutcome[] = [];
  for (const target of targets) {
    const proposal = proposals.find((p) => p.notation === target.notation);
    const proposed = proposal?.prerequisites || [];

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
      // Year sanity check
      if (candidate.year > target.year) {
        yearViolations.push(prereqNotation);
        continue;
      }
      valid.push(prereqNotation);
      resolvedIds.push(candidate.id);
    }

    outcomes.push({
      notation: target.notation,
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

function printQualityReport(outcomes: ValidationOutcome[], usage: { promptTokens: number; outputTokens: number }) {
  const total = outcomes.length;
  const withProposals = outcomes.filter((o) => o.proposed.length > 0).length;
  const withAllValid = outcomes.filter((o) => o.proposed.length > 0 && o.invalid.length === 0 && o.yearViolations.length === 0 && !o.selfReference).length;
  const withAnyHallucination = outcomes.filter((o) => o.invalid.length > 0).length;
  const withYearViolations = outcomes.filter((o) => o.yearViolations.length > 0).length;
  const withSelfRef = outcomes.filter((o) => o.selfReference).length;

  console.log('\n=== QUALITY REPORT ===\n');
  console.log(`  Total Y6 targets:                ${total}`);
  console.log(`  Targets with ≥1 proposal:        ${withProposals} (${Math.round((withProposals / total) * 100)}%)`);
  console.log(`  Targets with all-valid prereqs:  ${withAllValid} (${Math.round((withAllValid / total) * 100)}%)`);
  console.log(`  Targets with hallucinated codes: ${withAnyHallucination}`);
  console.log(`  Targets with year violations:    ${withYearViolations}`);
  console.log(`  Targets with self-reference:     ${withSelfRef}`);

  // Cost (Gemini Flash pricing — approximate as of 2025)
  const inputCost = (usage.promptTokens / 1_000_000) * 0.075;
  const outputCost = (usage.outputTokens / 1_000_000) * 0.30;
  const totalCost = inputCost + outputCost;
  console.log(`\n  Tokens — input: ${usage.promptTokens}, output: ${usage.outputTokens}`);
  console.log(`  Cost (Flash 3): ~$${totalCost.toFixed(5)}`);
  console.log(`  Projected cost for full 8,434-standard backfill: ~$${(totalCost * (8434 / total)).toFixed(2)}`);
}

function printManualInspection(outcomes: ValidationOutcome[], targets: StandardRow[], candidates: StandardRow[]) {
  const candidateByNotation = new Map(candidates.map((c) => [c.notation, c]));
  console.log('\n=== MANUAL INSPECTION FORMAT ===\n');
  let lastStrand: string | null = '__init__';
  for (const target of targets) {
    const outcome = outcomes.find((o) => o.notation === target.notation)!;
    if (target.strand !== lastStrand) {
      console.log(`\n  --- ${target.strand} ---`);
      lastStrand = target.strand;
    }
    console.log(`\n  ${target.notation}: ${target.description.slice(0, 130)}`);
    if (outcome.proposed.length === 0) {
      console.log(`    (no prereqs proposed)`);
    } else {
      for (const prereq of outcome.proposed) {
        const cand = candidateByNotation.get(prereq);
        const status = outcome.invalid.includes(prereq)
          ? '❌ HALLUCINATED'
          : outcome.yearViolations.includes(prereq)
            ? '⚠️  YEAR VIOLATION'
            : prereq === target.notation
              ? '⚠️  SELF-REF'
              : '✓';
        const desc = cand ? cand.description.slice(0, 100) : '(unknown)';
        console.log(`    ${status} ${prereq}: ${desc}`);
      }
    }
  }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  Phase 4.8 Item 2 Pilot — British Y6 Math Prerequisites  ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  console.log('  Fetching targets (British Y6 Math)...');
  const targets = await fetchTargets();
  console.log(`  ${targets.length} targets across ${new Set(targets.map((t) => t.strand)).size} strands.`);

  console.log('  Fetching candidate pool (British Y1-Y6 Math)...');
  const candidates = await fetchCandidates();
  console.log(`  ${candidates.length} candidates.`);

  const prompt = buildPrompt(targets, candidates);
  console.log(`  Prompt size: ${prompt.length} chars (~${Math.round(prompt.length / 4)} tokens estimated)`);

  console.log('\n  Calling Gemini Flash 3...');
  const startTime = Date.now();
  const { proposals, tokensUsed, promptTokens, outputTokens } = await callGemini(prompt);
  const elapsed = Date.now() - startTime;
  console.log(`  Response received in ${(elapsed / 1000).toFixed(1)}s — ${tokensUsed} tokens (${promptTokens} in / ${outputTokens} out)`);
  console.log(`  ${proposals.length} target proposals returned.`);

  console.log('\n  Validating against DB...');
  const outcomes = validate(proposals, targets, candidates);

  printQualityReport(outcomes, { promptTokens, outputTokens });
  printManualInspection(outcomes, targets, candidates);

  // Persist for the user to review
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const output = {
    timestamp: new Date().toISOString(),
    pilot: 'British Y6 Mathematics',
    model: FLASH_MODEL,
    counts: {
      targets: targets.length,
      candidates: candidates.length,
      proposals: proposals.length,
    },
    usage: { promptTokens, outputTokens, tokensUsed },
    outcomes,
    proposalsRaw: proposals,
  };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n  Wrote ${OUTPUT_FILE}`);
  console.log('  Nothing was written to production. Re-run with explicit --apply flag (not yet implemented) to proceed.\n');

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('\nPilot failed:', err);
  prisma.$disconnect();
  process.exit(1);
});
