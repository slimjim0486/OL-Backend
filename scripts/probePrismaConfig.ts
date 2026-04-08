import { PrismaClient } from '@prisma/client';
import { config } from '../src/config';
console.log('DATABASE_URL from config:', config.databaseUrl?.slice(0, 60) + '...');
console.log('process.env.DATABASE_URL:', process.env.DATABASE_URL?.slice(0, 60) + '...');
const prisma = new PrismaClient();
async function main() {
  const c = await prisma.learningStandard.count();
  console.log('count:', c);
  await prisma.$disconnect();
}
main().catch((e) => { console.error('FAIL:', e.message); process.exit(1); });
