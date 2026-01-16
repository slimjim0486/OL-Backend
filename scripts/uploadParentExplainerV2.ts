/**
 * Upload Parent Explainer Video v2 to R2 CDN
 * Replaces the existing explainer-video.mp4 used on the parent landing page
 */

import * as dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs';
import { uploadFile } from '../src/services/storage/storageService.js';

// Path to the new video file
const VIDEO_PATH = '/Users/saleemjadallah/Desktop/OrbitLearn App/Marketing/Video/Parent Explainer v2.mp4';

// Storage path - same as current video to replace it
const R2_STORAGE_PATH = 'marketing/explainer-video.mp4';

async function uploadToR2(): Promise<void> {
  console.log('\n📤 Uploading Parent Explainer Video v2 to R2 CDN...\n');

  // Check if video exists
  if (!fs.existsSync(VIDEO_PATH)) {
    console.error('❌ Video file not found at:', VIDEO_PATH);
    process.exit(1);
  }

  const videoBuffer = fs.readFileSync(VIDEO_PATH);
  const fileSizeMB = (videoBuffer.length / (1024 * 1024)).toFixed(2);
  console.log(`   📹 Video size: ${fileSizeMB} MB`);

  try {
    // Upload to aiContent bucket (same bucket as current video)
    const result = await uploadFile(
      'aiContent',
      R2_STORAGE_PATH,
      videoBuffer,
      'video/mp4',
      {
        'cache-control': 'public, max-age=31536000', // 1 year cache
        'content-disposition': 'inline',
      }
    );

    console.log('\n   ✅ Upload successful!\n');
    console.log(`   Storage Path: ${result.storagePath}`);
    console.log(`   Size: ${fileSizeMB} MB`);
    console.log(`\n🔗 Public URL: ${result.publicUrl}`);
    console.log('\n📺 The video is now live on the parent landing page!');
    console.log('   Note: CDN cache may take a few minutes to update.');

  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Parent Explainer Video v2 - R2 Uploader');
  console.log('='.repeat(60) + '\n');

  console.log(`📄 Source: ${VIDEO_PATH}`);
  console.log(`📍 Target: ${R2_STORAGE_PATH}\n`);

  try {
    await uploadToR2();
    console.log('\n✅ Done!\n');
  } catch (error) {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  }
}

main();
