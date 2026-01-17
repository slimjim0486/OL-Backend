/**
 * Generate PDF from HTML cheat sheet and upload to R2 CDN
 */

import * as dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
import { uploadFile } from '../src/services/storage/storageService.js';

const HTML_PATH = path.join(
  process.cwd(),
  '..',
  'marketing',
  'email-campaigns',
  'teacher-welcome-sequence',
  'classroom-management-cheatsheet.html'
);

const PDF_OUTPUT_PATH = path.join(
  process.cwd(),
  'tmp',
  'classroom-management-cheatsheet.pdf'
);

const R2_STORAGE_PATH = 'downloads/teacher/classroom-management-cheatsheet.pdf';

async function generatePDF(): Promise<Buffer> {
  console.log('🖨️  Generating PDF from HTML...\n');

  // Ensure tmp directory exists
  const tmpDir = path.dirname(PDF_OUTPUT_PATH);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Load the HTML file
    const htmlContent = fs.readFileSync(HTML_PATH, 'utf-8');
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF with print-optimized settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
      displayHeaderFooter: false,
    });

    // Also save locally for reference
    fs.writeFileSync(PDF_OUTPUT_PATH, pdfBuffer);
    console.log(`   ✅ PDF saved locally: ${PDF_OUTPUT_PATH}`);

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

async function uploadToR2(pdfBuffer: Buffer): Promise<void> {
  console.log('\n📤 Uploading to R2 CDN...\n');

  try {
    const result = await uploadFile(
      'static',
      R2_STORAGE_PATH,
      pdfBuffer,
      'application/pdf',
      {
        'content-disposition': 'attachment; filename="Classroom-Management-Cheatsheet.pdf"',
        'cache-control': 'public, max-age=31536000', // 1 year cache
      }
    );

    console.log('   ✅ Upload successful!\n');
    console.log(`   Storage Path: ${result.storagePath}`);
    console.log(`   Size: ${(result.size / 1024).toFixed(1)} KB`);
    console.log(`\n🔗 Public URL: ${result.publicUrl}`);
    console.log('\n📧 Use this URL in Email 6 download button.');

  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Classroom Management Cheat Sheet - PDF Generator & Uploader');
  console.log('='.repeat(60) + '\n');

  // Check if HTML exists
  if (!fs.existsSync(HTML_PATH)) {
    console.error('❌ HTML file not found at:', HTML_PATH);
    process.exit(1);
  }

  console.log(`📄 Source: ${HTML_PATH}\n`);

  try {
    const pdfBuffer = await generatePDF();
    await uploadToR2(pdfBuffer);
    console.log('\n✅ Done!\n');
  } catch (error) {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  }
}

main();
