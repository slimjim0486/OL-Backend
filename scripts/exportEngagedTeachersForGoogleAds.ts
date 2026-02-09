/**
 * Export Engaged/Repeat Teachers for Google Ads Customer Match
 *
 * This script identifies "power users" - teachers who have:
 * - Used the service on multiple distinct days
 * - Consumed credits multiple times
 * - Created multiple pieces of content
 *
 * These users make the best lookalike audiences for Google Ads.
 *
 * Usage:
 *   npx tsx scripts/exportEngagedTeachersForGoogleAds.ts
 *   npx tsx scripts/exportEngagedTeachersForGoogleAds.ts --min-days 2
 *   npx tsx scripts/exportEngagedTeachersForGoogleAds.ts --min-usage 3
 *   npx tsx scripts/exportEngagedTeachersForGoogleAds.ts --include-names
 */

import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

interface ExportOptions {
  minDistinctDays: number;    // Minimum distinct days of usage
  minUsageEvents: number;     // Minimum total usage events
  minContentCreated: number;  // Minimum content pieces created
  includeNames: boolean;
  outputPath: string;
}

interface EngagedTeacher {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  countryCode: string | null;
  distinctUsageDays: number;
  totalUsageEvents: number;
  totalTokensUsed: number;
  contentCreated: number;
  firstUsageDate: Date | null;
  lastUsageDate: Date | null;
}

function hashEmail(email: string): string {
  const normalized = email.toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function hashName(name: string): string {
  const normalized = name.toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

async function findEngagedTeachers(options: ExportOptions): Promise<EngagedTeacher[]> {
  console.log('Analyzing teacher engagement patterns...\n');

  // Get all teachers with marketing consent (excluding test accounts)
  const teachers = await prisma.teacher.findMany({
    where: {
      notifyProductUpdates: true,
      emailVerified: true,
      NOT: {
        email: {
          contains: '@test.orbitlearn.com'
        }
      }
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      country: true,
      countryCode: true,
    }
  });

  console.log(`Found ${teachers.length} teachers with marketing consent`);
  console.log('Calculating engagement metrics for each teacher...\n');

  const engagedTeachers: EngagedTeacher[] = [];

  for (const teacher of teachers) {
    // Get token usage logs for this teacher
    const usageLogs = await prisma.tokenUsageLog.findMany({
      where: { teacherId: teacher.id },
      select: {
        createdAt: true,
        tokensUsed: true,
      },
      orderBy: { createdAt: 'asc' }
    });

    // Get content created by this teacher
    const contentCount = await prisma.teacherContent.count({
      where: { teacherId: teacher.id }
    });

    // Calculate distinct usage days
    const uniqueDays = new Set(
      usageLogs.map(log => log.createdAt.toISOString().split('T')[0])
    );
    const distinctUsageDays = uniqueDays.size;

    // Calculate totals
    const totalUsageEvents = usageLogs.length;
    const totalTokensUsed = usageLogs.reduce((sum, log) => sum + log.tokensUsed, 0);

    // Check if this teacher meets engagement criteria
    const meetsDistinctDays = distinctUsageDays >= options.minDistinctDays;
    const meetsUsageEvents = totalUsageEvents >= options.minUsageEvents;
    const meetsContentCreated = contentCount >= options.minContentCreated;

    // Must meet at least one engagement criterion
    if (meetsDistinctDays || meetsUsageEvents || meetsContentCreated) {
      engagedTeachers.push({
        id: teacher.id,
        email: teacher.email,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        country: teacher.country,
        countryCode: teacher.countryCode,
        distinctUsageDays,
        totalUsageEvents,
        totalTokensUsed,
        contentCreated: contentCount,
        firstUsageDate: usageLogs.length > 0 ? usageLogs[0].createdAt : null,
        lastUsageDate: usageLogs.length > 0 ? usageLogs[usageLogs.length - 1].createdAt : null,
      });
    }
  }

  // Sort by engagement (most engaged first)
  engagedTeachers.sort((a, b) => {
    // Primary sort: distinct days
    if (b.distinctUsageDays !== a.distinctUsageDays) {
      return b.distinctUsageDays - a.distinctUsageDays;
    }
    // Secondary sort: total usage events
    return b.totalUsageEvents - a.totalUsageEvents;
  });

  return engagedTeachers;
}

async function exportEngagedTeachers(options: ExportOptions) {
  console.log('=================================================');
  console.log('  Google Ads Engaged Teacher Export Script');
  console.log('=================================================\n');
  console.log('Engagement criteria:');
  console.log(`  - Minimum distinct usage days: ${options.minDistinctDays}`);
  console.log(`  - Minimum usage events: ${options.minUsageEvents}`);
  console.log(`  - Minimum content created: ${options.minContentCreated}`);
  console.log('  (Teacher must meet at least ONE criterion)\n');

  const engagedTeachers = await findEngagedTeachers(options);

  if (engagedTeachers.length === 0) {
    console.log('No engaged teachers found matching criteria.');
    return;
  }

  console.log(`\nFound ${engagedTeachers.length} engaged teachers\n`);

  // Build CSV content
  let csvHeader: string;
  let csvRows: string[];

  if (options.includeNames) {
    csvHeader = 'Email,First Name,Last Name,Country';
    csvRows = engagedTeachers.map(t => {
      const hashedEmail = hashEmail(t.email);
      const hashedFirst = t.firstName ? hashName(t.firstName) : '';
      const hashedLast = t.lastName ? hashName(t.lastName) : '';
      const country = t.countryCode || '';
      return `${hashedEmail},${hashedFirst},${hashedLast},${country}`;
    });
  } else {
    csvHeader = 'Email';
    csvRows = engagedTeachers.map(t => hashEmail(t.email));
  }

  const csvContent = [csvHeader, ...csvRows].join('\n');

  // Write CSV file
  fs.writeFileSync(options.outputPath, csvContent);
  console.log(`Exported to: ${options.outputPath}`);

  // Also write a detailed report (not for upload, just for your reference)
  const reportPath = options.outputPath.replace('.csv', '-report.txt');
  const reportLines = [
    'ENGAGED TEACHER REPORT',
    '=' .repeat(80),
    `Generated: ${new Date().toISOString()}`,
    `Criteria: ${options.minDistinctDays}+ days OR ${options.minUsageEvents}+ events OR ${options.minContentCreated}+ content`,
    '',
    'TOP 20 MOST ENGAGED TEACHERS:',
    '-'.repeat(80),
    'Days | Events | Tokens | Content | Country | Email (masked)',
    '-'.repeat(80),
  ];

  engagedTeachers.slice(0, 20).forEach(t => {
    const maskedEmail = t.email.replace(/(.{3}).*(@.*)/, '$1***$2');
    reportLines.push(
      `${String(t.distinctUsageDays).padStart(4)} | ` +
      `${String(t.totalUsageEvents).padStart(6)} | ` +
      `${String(t.totalTokensUsed).padStart(6)} | ` +
      `${String(t.contentCreated).padStart(7)} | ` +
      `${(t.countryCode || '??').padStart(7)} | ` +
      maskedEmail
    );
  });

  // Summary stats
  reportLines.push('');
  reportLines.push('SUMMARY STATISTICS:');
  reportLines.push('-'.repeat(80));

  const stats = {
    total: engagedTeachers.length,
    avgDistinctDays: (engagedTeachers.reduce((s, t) => s + t.distinctUsageDays, 0) / engagedTeachers.length).toFixed(1),
    avgUsageEvents: (engagedTeachers.reduce((s, t) => s + t.totalUsageEvents, 0) / engagedTeachers.length).toFixed(1),
    avgContentCreated: (engagedTeachers.reduce((s, t) => s + t.contentCreated, 0) / engagedTeachers.length).toFixed(1),
    totalTokensConsumed: engagedTeachers.reduce((s, t) => s + t.totalTokensUsed, 0),
  };

  reportLines.push(`Total engaged teachers: ${stats.total}`);
  reportLines.push(`Average distinct usage days: ${stats.avgDistinctDays}`);
  reportLines.push(`Average usage events: ${stats.avgUsageEvents}`);
  reportLines.push(`Average content created: ${stats.avgContentCreated}`);
  reportLines.push(`Total tokens consumed: ${stats.totalTokensConsumed.toLocaleString()}`);

  // Breakdown by engagement level
  const superUsers = engagedTeachers.filter(t => t.distinctUsageDays >= 5 || t.totalUsageEvents >= 10);
  const regularUsers = engagedTeachers.filter(t =>
    (t.distinctUsageDays >= 2 && t.distinctUsageDays < 5) ||
    (t.totalUsageEvents >= 3 && t.totalUsageEvents < 10)
  );
  const lightUsers = engagedTeachers.filter(t =>
    t.distinctUsageDays < 2 && t.totalUsageEvents < 3
  );

  reportLines.push('');
  reportLines.push('ENGAGEMENT TIERS:');
  reportLines.push(`  Super users (5+ days or 10+ events): ${superUsers.length}`);
  reportLines.push(`  Regular users (2-4 days or 3-9 events): ${regularUsers.length}`);
  reportLines.push(`  Light users (occasional): ${lightUsers.length}`);

  // Country breakdown
  const byCountry = engagedTeachers.reduce((acc, t) => {
    const country = t.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  reportLines.push('');
  reportLines.push('BY COUNTRY:');
  Object.entries(byCountry)
    .sort((a, b) => b[1] - a[1])
    .forEach(([country, count]) => {
      reportLines.push(`  ${country}: ${count}`);
    });

  fs.writeFileSync(reportPath, reportLines.join('\n'));
  console.log(`Report saved to: ${reportPath}`);

  // Console summary
  console.log('\n' + '='.repeat(50));
  console.log('ENGAGEMENT SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total engaged teachers: ${stats.total}`);
  console.log(`  - Super users (5+ days): ${superUsers.length}`);
  console.log(`  - Regular users (2-4 days): ${regularUsers.length}`);
  console.log(`  - Light users: ${lightUsers.length}`);
  console.log('');
  console.log('Top 5 most engaged:');
  engagedTeachers.slice(0, 5).forEach((t, i) => {
    const maskedEmail = t.email.replace(/(.{3}).*(@.*)/, '$1***$2');
    console.log(`  ${i + 1}. ${maskedEmail} - ${t.distinctUsageDays} days, ${t.totalUsageEvents} events`);
  });

  console.log('\n✅ Ready to upload to Google Ads Customer Match');
  console.log('   Upload the .csv file (not the report)');
}

function parseArgs(): ExportOptions {
  const args = process.argv.slice(2);

  const options: ExportOptions = {
    minDistinctDays: 2,      // Default: used on at least 2 different days
    minUsageEvents: 3,       // Default: at least 3 usage events
    minContentCreated: 2,    // Default: created at least 2 pieces of content
    includeNames: args.includes('--include-names'),
    outputPath: path.join(__dirname, '..', 'exports', `engaged-teachers-${Date.now()}.csv`),
  };

  // Parse --min-days
  const daysIndex = args.indexOf('--min-days');
  if (daysIndex !== -1 && args[daysIndex + 1]) {
    options.minDistinctDays = parseInt(args[daysIndex + 1], 10);
  }

  // Parse --min-usage
  const usageIndex = args.indexOf('--min-usage');
  if (usageIndex !== -1 && args[usageIndex + 1]) {
    options.minUsageEvents = parseInt(args[usageIndex + 1], 10);
  }

  // Parse --min-content
  const contentIndex = args.indexOf('--min-content');
  if (contentIndex !== -1 && args[contentIndex + 1]) {
    options.minContentCreated = parseInt(args[contentIndex + 1], 10);
  }

  // Parse --output
  const outputIndex = args.indexOf('--output');
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    options.outputPath = args[outputIndex + 1];
  }

  return options;
}

async function main() {
  const options = parseArgs();

  // Ensure exports directory exists
  const exportsDir = path.dirname(options.outputPath);
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  try {
    await exportEngagedTeachers(options);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
