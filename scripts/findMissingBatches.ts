import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
const prisma = new PrismaClient();
const OUT = path.join(process.cwd(), 'scripts/output/prereq-batches');
async function main() {
  const groups = await prisma.$queryRaw<Array<{jurisdiction:string,subject:string,gradeLevel:number}>>`
    SELECT j.code AS jurisdiction, ss.subject::text AS subject, ss."gradeLevel" AS "gradeLevel"
    FROM "LearningStandard" ls JOIN "StandardSet" ss ON ls."standardSetId"=ss.id
    JOIN "CurriculumJurisdiction" j ON ss."jurisdictionId"=j.id
    GROUP BY j.code, ss.subject, ss."gradeLevel" ORDER BY j.code, ss.subject, ss."gradeLevel"`;
  const lowest = new Map<string,number>();
  for (const g of groups) {
    const k = `${g.jurisdiction}:${g.subject}`;
    if (!lowest.has(k) || g.gradeLevel < lowest.get(k)!) lowest.set(k, g.gradeLevel);
  }
  const expected: string[] = [];
  for (const g of groups) {
    if (g.gradeLevel <= lowest.get(`${g.jurisdiction}:${g.subject}`)!) continue;
    expected.push(`${g.jurisdiction}_${g.subject}_g${g.gradeLevel}.json`);
  }
  const onDisk = new Set(fs.readdirSync(OUT).filter(f => f.endsWith('.json')));
  console.log('Expected:', expected.length);
  console.log('On disk:', onDisk.size);
  const missing = expected.filter(e => !onDisk.has(e));
  console.log('Missing:', missing);
  await prisma.$disconnect();
}
main().catch(console.error);
