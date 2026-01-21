/**
 * Upload landing page screenshots to R2 CDN
 * Run with: npx tsx scripts/uploadLandingScreenshots.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../src/services/storage/storageService.js';

const ASSETS_DIR = '/Users/saleemjadallah/Desktop/OrbitLearn App/Assets';

const SCREENSHOTS = [
  {
    localPath: path.join(ASSETS_DIR, 'Dashboard with Summary.png'),
    r2Path: 'images/landing/lesson-canvas-screenshot.png',
    description: 'Lesson Canvas Screenshot',
  },
  {
    localPath: path.join(ASSETS_DIR, 'Parent Dashboard v2.png'),
    r2Path: 'images/landing/parent-dashboard-screenshot.png',
    description: 'Parent Dashboard Screenshot',
  },
];

async function uploadScreenshots(): Promise<void> {
  console.log('='.repeat(60));
  console.log('Landing Page Screenshots Uploader - R2 CDN');
  console.log('='.repeat(60) + '\n');

  const results: { name: string; url: string }[] = [];

  for (const screenshot of SCREENSHOTS) {
    console.log(`\nProcessing: ${screenshot.description}`);
    console.log(`Source: ${screenshot.localPath}`);

    // Check if image exists
    if (!fs.existsSync(screenshot.localPath)) {
      console.error(`ERROR: File not found at: ${screenshot.localPath}`);
      continue;
    }

    const imageBuffer = fs.readFileSync(screenshot.localPath);
    const stats = fs.statSync(screenshot.localPath);

    console.log(`Size: ${(stats.size / 1024).toFixed(1)} KB`);
    console.log('Uploading to R2 CDN...');

    try {
      const result = await uploadFile(
        'static',
        screenshot.r2Path,
        imageBuffer,
        'image/png',
        {
          'cache-control': 'public, max-age=31536000', // 1 year cache
          'content-description': screenshot.description,
        }
      );

      console.log(`SUCCESS: ${result.publicUrl}`);
      results.push({ name: screenshot.description, url: result.publicUrl });
    } catch (error) {
      console.error(`ERROR uploading ${screenshot.description}:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('UPLOAD SUMMARY');
  console.log('='.repeat(60));

  for (const r of results) {
    console.log(`\n${r.name}:`);
    console.log(`  ${r.url}`);
  }

  console.log('\n\nUse these URLs in ProductShowcaseSection.jsx');
}

uploadScreenshots().catch(console.error);
