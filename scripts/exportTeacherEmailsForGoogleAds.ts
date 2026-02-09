/**
 * Export Teacher Emails for Google Ads Customer Match
 *
 * This script exports teacher emails in the format required by Google Ads:
 * - Emails are lowercase and trimmed
 * - Hashed using SHA256 (Google's requirement)
 * - Only teachers who consented to marketing (notifyProductUpdates = true)
 *
 * Usage:
 *   npx tsx scripts/exportTeacherEmailsForGoogleAds.ts
 *   npx tsx scripts/exportTeacherEmailsForGoogleAds.ts --include-names
 *   npx tsx scripts/exportTeacherEmailsForGoogleAds.ts --country AE
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
  includeNames: boolean;
  countryFilter?: string;
  outputPath: string;
}

function hashEmail(email: string): string {
  // Google Ads Customer Match requirements:
  // 1. Lowercase the email
  // 2. Trim whitespace
  // 3. Hash with SHA256
  const normalized = email.toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

function hashName(name: string): string {
  // Google also accepts hashed first/last names
  const normalized = name.toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

async function exportTeacherEmails(options: ExportOptions) {
  console.log('Fetching teachers with marketing consent...\n');

  // Build query filter
  const where: any = {
    notifyProductUpdates: true, // Only teachers who consented to marketing
    emailVerified: true,        // Only verified emails
  };

  // Exclude test emails
  where.NOT = {
    email: {
      contains: '@test.orbitlearn.com'
    }
  };

  if (options.countryFilter) {
    where.countryCode = options.countryFilter.toUpperCase();
    console.log(`Filtering by country: ${options.countryFilter.toUpperCase()}`);
  }

  const teachers = await prisma.teacher.findMany({
    where,
    select: {
      email: true,
      firstName: true,
      lastName: true,
      country: true,
      countryCode: true,
      primarySubject: true,
      gradeRange: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  console.log(`Found ${teachers.length} teachers with marketing consent\n`);

  if (teachers.length === 0) {
    console.log('No teachers to export.');
    return;
  }

  // Build CSV content
  let csvHeader: string;
  let csvRows: string[];

  if (options.includeNames) {
    // Google Ads accepts: Email, First Name, Last Name, Country
    // All should be SHA256 hashed except Country
    csvHeader = 'Email,First Name,Last Name,Country';
    csvRows = teachers.map(t => {
      const hashedEmail = hashEmail(t.email);
      const hashedFirst = t.firstName ? hashName(t.firstName) : '';
      const hashedLast = t.lastName ? hashName(t.lastName) : '';
      const country = t.countryCode || '';
      return `${hashedEmail},${hashedFirst},${hashedLast},${country}`;
    });
  } else {
    // Simple format: just hashed emails
    csvHeader = 'Email';
    csvRows = teachers.map(t => hashEmail(t.email));
  }

  const csvContent = [csvHeader, ...csvRows].join('\n');

  // Write to file
  const outputPath = options.outputPath;
  fs.writeFileSync(outputPath, csvContent);

  console.log(`Exported to: ${outputPath}`);
  console.log(`Total records: ${teachers.length}`);

  // Print summary by country
  const byCountry = teachers.reduce((acc, t) => {
    const country = t.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\nBreakdown by country:');
  Object.entries(byCountry)
    .sort((a, b) => b[1] - a[1])
    .forEach(([country, count]) => {
      console.log(`  ${country}: ${count}`);
    });

  // Print sample (first 3 hashed emails)
  console.log('\nSample hashed emails (first 3):');
  csvRows.slice(0, 3).forEach(row => {
    const email = row.split(',')[0];
    console.log(`  ${email.substring(0, 20)}...`);
  });

  console.log('\n✅ Ready to upload to Google Ads Customer Match');
  console.log('   Go to: Google Ads > Tools > Audience Manager > Customer Lists');
}

// Parse command line arguments
function parseArgs(): ExportOptions {
  const args = process.argv.slice(2);
  const options: ExportOptions = {
    includeNames: args.includes('--include-names'),
    outputPath: path.join(__dirname, '..', 'exports', `teacher-emails-${Date.now()}.csv`),
  };

  const countryIndex = args.indexOf('--country');
  if (countryIndex !== -1 && args[countryIndex + 1]) {
    options.countryFilter = args[countryIndex + 1];
  }

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

  console.log('===========================================');
  console.log('  Google Ads Teacher Email Export Script');
  console.log('===========================================\n');

  try {
    await exportTeacherEmails(options);
  } catch (error) {
    console.error('Error exporting teachers:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
