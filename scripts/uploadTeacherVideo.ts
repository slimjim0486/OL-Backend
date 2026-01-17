/**
 * Upload Teacher Explainer Video to R2 CDN
 */

import * as dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs';
import * as path from 'path';
import { uploadFile } from '../src/services/storage/storageService.js';

// The video is located outside the main project folder
const VIDEO_PATH = '/Users/saleemjadallah/Desktop/Orbit Learn/marketing/Video/Teacher Explainer.mp4';

const R2_STORAGE_PATH = 'marketing/teacher-explainer.mp4';

async function uploadToR2(): Promise<void> {
  console.log('\n📤 Uploading Teacher Explainer Video to R2 CDN...\n');

  // Check if video exists
  if (!fs.existsSync(VIDEO_PATH)) {
    console.error('❌ Video file not found at:', VIDEO_PATH);
    process.exit(1);
  }

  const videoBuffer = fs.readFileSync(VIDEO_PATH);
  const fileSizeMB = (videoBuffer.length / (1024 * 1024)).toFixed(2);
  console.log(`   📹 Video size: ${fileSizeMB} MB`);

  try {
    const result = await uploadFile(
      'static',
      R2_STORAGE_PATH,
      videoBuffer,
      'video/mp4',
      {
        'cache-control': 'public, max-age=31536000', // 1 year cache
      }
    );

    console.log('\n   ✅ Upload successful!\n');
    console.log(`   Storage Path: ${result.storagePath}`);
    console.log(`   Size: ${fileSizeMB} MB`);
    console.log(`\n🔗 Public URL: ${result.publicUrl}`);
    console.log('\n📺 Use this URL in TeacherHeroSection video source.');

  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Teacher Explainer Video - R2 Uploader');
  console.log('='.repeat(60) + '\n');

  console.log(`📄 Source: ${VIDEO_PATH}\n`);

  try {
    await uploadToR2();
    console.log('\n✅ Done!\n');
  } catch (error) {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  }
}

main();
