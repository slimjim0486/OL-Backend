/**
 * Upload blog image to R2 CDN
 * Run with: npx tsx scripts/uploadBlogImage.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../src/services/storage/storageService.js';

const IMAGE_PATH = path.join(
  process.cwd(),
  '..',
  'frontend',
  'public',
  'images',
  'blog',
  'teacher-parent-communication.jpg'
);

const R2_STORAGE_PATH = 'images/blog/teacher-parent-communication.jpg';

async function uploadToR2(): Promise<void> {
  console.log('='.repeat(60));
  console.log('Blog Image Uploader - R2 CDN');
  console.log('='.repeat(60) + '\n');

  // Check if image exists
  if (!fs.existsSync(IMAGE_PATH)) {
    console.error('Image not found at:', IMAGE_PATH);
    process.exit(1);
  }

  console.log(`Source: ${IMAGE_PATH}\n`);

  const imageBuffer = fs.readFileSync(IMAGE_PATH);
  const stats = fs.statSync(IMAGE_PATH);

  console.log(`Size: ${(stats.size / 1024).toFixed(1)} KB\n`);
  console.log('Uploading to R2 CDN...\n');

  try {
    const result = await uploadFile(
      'static',
      R2_STORAGE_PATH,
      imageBuffer,
      'image/jpeg',
      {
        'cache-control': 'public, max-age=31536000', // 1 year cache
      }
    );

    console.log('Upload successful!\n');
    console.log(`Storage Path: ${result.storagePath}`);
    console.log(`Size: ${(result.size / 1024).toFixed(1)} KB`);
    console.log(`\nPublic URL: ${result.publicUrl}`);
    console.log('\nUse this URL in the blog post <img> tag.');

  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

uploadToR2().catch(console.error);
