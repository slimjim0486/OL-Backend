import { PrismaClient } from '@prisma/client';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../src/config/gemini';
import { config } from '../src/config';
console.log('DATABASE_URL:', process.env.DATABASE_URL?.slice(0, 60) + '...');
const prisma = new PrismaClient();
async function main() {
  const c = await prisma.learningStandard.count();
  console.log('count:', c, '— gemini loaded:', !!genAI);
  await prisma.$disconnect();
}
main().catch((e) => { console.error('FAIL:', e.message); process.exit(1); });
