/**
 * Seed Script: CBSE Computer Science Standards
 *
 * Populates the database with CBSE Computer Science standards for Classes 9-12
 * - Classes 9-10: Computer Applications (Code 165)
 * - Classes 11-12: Computer Science (Code 083)
 *
 * Run with: npx tsx scripts/seedCBSEComputerScience.ts
 */

import { PrismaClient } from '@prisma/client';
import {
  cbseComputerScienceClasses,
  getCBSEComputerScienceStandardsCount,
  CBSEComputerScienceStandard
} from '../src/config/cbseComputerScienceCurriculum';

const prisma = new PrismaClient();

// Helper: Group standards by strand
function groupByStrand(standards: CBSEComputerScienceStandard[]): Record<string, CBSEComputerScienceStandard[]> {
  return standards.reduce((groups, std) => {
    if (!groups[std.strand]) {
      groups[std.strand] = [];
    }
    groups[std.strand].push(std);
    return groups;
  }, {} as Record<string, CBSEComputerScienceStandard[]>);
}

// Helper: Get conceptual area from strand
function getConceptualArea(strand: string): string {
  const mapping: Record<string, string> = {
    'ICT Fundamentals': 'Computer Fundamentals',
    'Networking': 'Networks',
    'HTML/Web Development': 'Web Development',
    'Python Basics': 'Programming',
    'Cyber Safety': 'Digital Citizenship',
    'Python Programming': 'Programming',
    'Data Structures': 'Data Structures',
    'Sorting and Searching': 'Algorithms',
    'Computer Networks': 'Networks',
    'Database and SQL': 'Data Management',
    'Python-SQL Connectivity': 'Data Management',
    'File Handling': 'Programming',
    'Exception Handling': 'Programming',
  };
  return mapping[strand] || strand;
}

// Helper: Get ancestor descriptions
function getAncestorDescriptions(strand: string): string[] {
  if (['ICT Fundamentals'].includes(strand)) {
    return ['Computer Science', 'Fundamentals'];
  } else if (['Python Basics', 'Python Programming', 'File Handling', 'Exception Handling'].includes(strand)) {
    return ['Computer Science', 'Programming'];
  } else if (['Networking', 'Computer Networks'].includes(strand)) {
    return ['Computer Science', 'Networks'];
  } else if (['HTML/Web Development'].includes(strand)) {
    return ['Computer Science', 'Web Development'];
  } else if (['Cyber Safety'].includes(strand)) {
    return ['Computer Science', 'Digital Citizenship'];
  } else if (['Data Structures', 'Sorting and Searching'].includes(strand)) {
    return ['Computer Science', 'Data Structures and Algorithms'];
  } else if (['Database and SQL', 'Python-SQL Connectivity'].includes(strand)) {
    return ['Computer Science', 'Databases'];
  }
  return ['Computer Science'];
}

async function seedCBSEComputerScience() {
  console.log('\n========================================');
  console.log('  CBSE Computer Science Seeder');
  console.log('  (Classes 9-12)');
  console.log('========================================\n');

  const totalStandards = getCBSEComputerScienceStandardsCount();
  console.log('Curriculum Statistics:');
  console.log(`  Total Standards: ${totalStandards}`);
  console.log('\nStandards by Class:');
  cbseComputerScienceClasses.forEach(c => {
    console.log(`  Class ${c.class} (${c.courseName}): ${c.standards.length} standards`);
  });

  try {
    // Step 1: Create or update the Jurisdiction
    console.log('\n[1/3] Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: 'INDIAN_CBSE' },
      update: {
        lastSyncedAt: new Date()
      },
      create: {
        code: 'INDIAN_CBSE',
        name: 'Central Board of Secondary Education',
        country: 'IN',
        version: '2024-25',
        sourceUrl: 'https://ncert.nic.in/textbook.php',
        lastSyncedAt: new Date()
      }
    });
    console.log(`  Created/Updated: ${jurisdiction.name} (${jurisdiction.id})`);

    // Step 2: Create StandardSets for each class
    console.log('\n[2/3] Creating standard sets...');
    const standardSets: Map<number, string> = new Map();

    for (const classData of cbseComputerScienceClasses) {
      const setCode = `IN.CBSE.C${classData.class}.CS`;
      const standardSet = await prisma.standardSet.upsert({
        where: {
          jurisdictionId_code: {
            jurisdictionId: jurisdiction.id,
            code: setCode
          }
        },
        update: {
          title: `Class ${classData.class} ${classData.courseName}`,
          subject: 'COMPUTER_SCIENCE',
          educationLevels: [`C${classData.class}`],
          gradeLevel: classData.class,
          ageRangeMin: classData.ageRangeMin,
          ageRangeMax: classData.ageRangeMax,
          documentTitle: `CBSE ${classData.courseName} (Code ${classData.courseCode}) for Class ${classData.class}`,
          documentYear: '2024'
        },
        create: {
          jurisdictionId: jurisdiction.id,
          code: setCode,
          title: `Class ${classData.class} ${classData.courseName}`,
          subject: 'COMPUTER_SCIENCE',
          educationLevels: [`C${classData.class}`],
          gradeLevel: classData.class,
          ageRangeMin: classData.ageRangeMin,
          ageRangeMax: classData.ageRangeMax,
          documentTitle: `CBSE ${classData.courseName} (Code ${classData.courseCode}) for Class ${classData.class}`,
          documentYear: '2024'
        }
      });

      standardSets.set(classData.class, standardSet.id);
      console.log(`  Class ${classData.class}: ${standardSet.id}`);
    }

    // Step 3: Create Learning Standards
    console.log('\n[3/3] Creating learning standards...');
    let totalCreated = 0;
    let totalUpdated = 0;

    for (const classData of cbseComputerScienceClasses) {
      const standardSetId = standardSets.get(classData.class);
      if (!standardSetId) continue;

      let classCreated = 0;
      let classUpdated = 0;

      const strandGroups = groupByStrand(classData.standards);

      for (const [strand, standards] of Object.entries(strandGroups)) {
        for (let i = 0; i < standards.length; i++) {
          const std = standards[i];

          const result = await prisma.learningStandard.upsert({
            where: {
              standardSetId_notation: {
                standardSetId,
                notation: std.notation
              }
            },
            update: {
              description: std.description,
              strand: std.strand,
              conceptualArea: getConceptualArea(std.strand),
              isStatutory: true,
              position: i,
              depth: 0,
              ancestorDescriptions: getAncestorDescriptions(std.strand)
            },
            create: {
              standardSetId,
              notation: std.notation,
              description: std.description,
              strand: std.strand,
              conceptualArea: getConceptualArea(std.strand),
              isStatutory: true,
              position: i,
              depth: 0,
              ancestorDescriptions: getAncestorDescriptions(std.strand)
            }
          });

          if (result.createdAt.getTime() === result.updatedAt.getTime()) {
            classCreated++;
            totalCreated++;
          } else {
            classUpdated++;
            totalUpdated++;
          }
        }
      }

      console.log(`  Class ${classData.class}: Created ${classCreated}, Updated ${classUpdated}`);
    }

    // Summary
    console.log('\n========================================');
    console.log('  Seeding Complete!');
    console.log('========================================');
    console.log(`  Total Created: ${totalCreated}`);
    console.log(`  Total Updated: ${totalUpdated}`);
    console.log(`  Total Standards: ${totalCreated + totalUpdated}`);

  } catch (error) {
    console.error('\nError seeding curriculum:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
seedCBSEComputerScience()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
