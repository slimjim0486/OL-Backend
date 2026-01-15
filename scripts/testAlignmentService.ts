/**
 * Test script for curriculum alignment service
 * Run: npx tsx scripts/testAlignmentService.ts
 */

import { alignmentService } from '../src/services/curriculum/index.js';
import { curriculumService } from '../src/services/curriculum/index.js';
import { CurriculumType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

async function testAlignment() {
  console.log('\n=== Curriculum Alignment Service Test ===\n');

  // 1. First test curriculum service - count standards
  console.log('1. Testing curriculum service - counting British NC standards...');
  const britishMathCount = await curriculumService.countStandards('BRITISH', 'MATH');
  const britishEnglishCount = await curriculumService.countStandards('BRITISH', 'ENGLISH');
  const britishScienceCount = await curriculumService.countStandards('BRITISH', 'SCIENCE');
  console.log(`   British Math standards: ${britishMathCount}`);
  console.log(`   British English standards: ${britishEnglishCount}`);
  console.log(`   British Science standards: ${britishScienceCount}`);
  console.log('');

  // 2. Test getting standards for a specific grade
  console.log('2. Testing getStandardsForGrade (Year 5 Math)...');
  const year5MathStandards = await curriculumService.getStandardsForGrade('BRITISH', 'MATH', 5);
  console.log(`   Found ${year5MathStandards.length} standards for Year 5 Math`);
  if (year5MathStandards.length > 0) {
    console.log(`   Sample standard: ${year5MathStandards[0].notation} - ${year5MathStandards[0].description.substring(0, 80)}...`);
  }
  console.log('');

  // 3. Test alignment with a Year 5 Maths lesson (fractions)
  console.log('3. Testing alignment with Year 5 Maths lesson (fractions)...');
  const mathLessonPath = path.join(process.cwd(), 'test-lessons', 'year5-maths-fractions.txt');

  if (fs.existsSync(mathLessonPath)) {
    const mathLessonContent = fs.readFileSync(mathLessonPath, 'utf-8');
    console.log(`   Lesson length: ${mathLessonContent.length} characters`);

    const mathAlignment = await alignmentService.alignContentToStandards(
      mathLessonContent,
      'MATH',
      '5',
      'BRITISH' as CurriculumType,
      5
    );

    console.log('\n   === Math Alignment Results ===');
    console.log(`   Standards checked: ${mathAlignment.totalStandardsChecked}`);
    console.log(`   Aligned standards found: ${mathAlignment.alignedStandards.length}`);
    console.log(`   Primary standards: ${mathAlignment.primaryStandards.length}`);

    if (mathAlignment.alignedStandards.length > 0) {
      console.log('\n   Top aligned standards:');
      for (const std of mathAlignment.alignedStandards.slice(0, 5)) {
        console.log(`   - [${(std.alignmentStrength * 100).toFixed(0)}%] ${std.notation}: ${std.description.substring(0, 60)}...`);
        if (std.relevanceNote) {
          console.log(`     Note: ${std.relevanceNote}`);
        }
      }
    }
  } else {
    console.log('   ERROR: Math lesson file not found at ' + mathLessonPath);
  }
  console.log('');

  // 4. Test alignment with Year 3 English lesson
  console.log('4. Testing alignment with Year 3 English lesson (adjectives)...');
  const englishLessonPath = path.join(process.cwd(), 'test-lessons', 'year3-english-adjectives.txt');

  if (fs.existsSync(englishLessonPath)) {
    const englishLessonContent = fs.readFileSync(englishLessonPath, 'utf-8');
    console.log(`   Lesson length: ${englishLessonContent.length} characters`);

    const englishAlignment = await alignmentService.alignContentToStandards(
      englishLessonContent,
      'ENGLISH',
      '3',
      'BRITISH' as CurriculumType,
      3
    );

    console.log('\n   === English Alignment Results ===');
    console.log(`   Standards checked: ${englishAlignment.totalStandardsChecked}`);
    console.log(`   Aligned standards found: ${englishAlignment.alignedStandards.length}`);
    console.log(`   Primary standards: ${englishAlignment.primaryStandards.length}`);

    if (englishAlignment.alignedStandards.length > 0) {
      console.log('\n   Top aligned standards:');
      for (const std of englishAlignment.alignedStandards.slice(0, 5)) {
        console.log(`   - [${(std.alignmentStrength * 100).toFixed(0)}%] ${std.notation}: ${std.description.substring(0, 60)}...`);
        if (std.relevanceNote) {
          console.log(`     Note: ${std.relevanceNote}`);
        }
      }
    }
  } else {
    console.log('   ERROR: English lesson file not found');
  }
  console.log('');

  // 5. Test alignment with Year 2 Science lesson
  console.log('5. Testing alignment with Year 2 Science lesson (plants)...');
  const scienceLessonPath = path.join(process.cwd(), 'test-lessons', 'year2-science-plants.txt');

  if (fs.existsSync(scienceLessonPath)) {
    const scienceLessonContent = fs.readFileSync(scienceLessonPath, 'utf-8');
    console.log(`   Lesson length: ${scienceLessonContent.length} characters`);

    const scienceAlignment = await alignmentService.alignContentToStandards(
      scienceLessonContent,
      'SCIENCE',
      '2',
      'BRITISH' as CurriculumType,
      2
    );

    console.log('\n   === Science Alignment Results ===');
    console.log(`   Standards checked: ${scienceAlignment.totalStandardsChecked}`);
    console.log(`   Aligned standards found: ${scienceAlignment.alignedStandards.length}`);
    console.log(`   Primary standards: ${scienceAlignment.primaryStandards.length}`);

    if (scienceAlignment.alignedStandards.length > 0) {
      console.log('\n   Top aligned standards:');
      for (const std of scienceAlignment.alignedStandards.slice(0, 5)) {
        console.log(`   - [${(std.alignmentStrength * 100).toFixed(0)}%] ${std.notation}: ${std.description.substring(0, 60)}...`);
        if (std.relevanceNote) {
          console.log(`     Note: ${std.relevanceNote}`);
        }
      }
    }
  } else {
    console.log('   ERROR: Science lesson file not found');
  }

  console.log('\n=== Test Complete ===\n');
  process.exit(0);
}

testAlignment().catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});
