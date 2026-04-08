/**
 * Upload new blog images to R2 CDN
 * Run with: npx tsx scripts/uploadNewBlogImages.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../src/services/storage/storageService.js';

const IMAGES = [
  {
    localName: 'parent-communication-burnout.jpg',
    r2Path: 'images/blog/parent-communication-burnout.jpg',
  },
  {
    localName: 'standards-coverage-anxiety.jpg',
    r2Path: 'images/blog/standards-coverage-anxiety.jpg',
  },
];

async function uploadAll(): Promise<void> {
  console.log('='.repeat(60));
  console.log('Blog Image Batch Uploader - R2 CDN');
  console.log('='.repeat(60) + '\n');

  for (const img of IMAGES) {
    const imagePath = path.join(
      process.cwd(),
      '..',
      'frontend',
      'public',
      'images',
      'blog',
      img.localName
    );

    if (!fs.existsSync(imagePath)) {
      console.error(`Image not found: ${imagePath}`);
      continue;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const stats = fs.statSync(imagePath);

    console.log(`Uploading: ${img.localName} (${(stats.size / 1024).toFixed(1)} KB)`);

    try {
      const result = await uploadFile(
        'static',
        img.r2Path,
        imageBuffer,
        'image/jpeg',
        {
          'cache-control': 'public, max-age=31536000',
        }
      );

      console.log(`  -> ${result.publicUrl}\n`);
    } catch (error) {
      console.error(`  Upload failed for ${img.localName}:`, error);
    }
  }

  console.log('Done!');
}

uploadAll().catch(console.error);
