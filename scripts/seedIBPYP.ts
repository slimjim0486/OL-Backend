/**
 * Seed Script: IB PYP (International Baccalaureate Primary Years Programme)
 *
 * Populates the database with IB PYP standards for ages 3-12
 * - Mathematics: 4 phases (~200 standards)
 * - English/Language: 5 phases (~180 standards)
 * - Science: 4 age bands (~130 standards)
 *
 * Run with: npx tsx scripts/seedIBPYP.ts
 *
 * Options:
 *   --math-only     Seed only Mathematics standards
 *   --english-only  Seed only English/Language standards
 *   --science-only  Seed only Science standards
 */

import { PrismaClient, Subject } from '@prisma/client';
import {
  ibPYPMathCurriculum,
  getAllIBPYPMathStandards,
  IBPYPMathStandard,
  IBPYPMathPhase
} from '../src/config/ibPYPMathCurriculum';
import {
  ibPYPEnglishCurriculum,
  getAllIBPYPEnglishStandards,
  IBPYPEnglishStandard,
  IBPYPEnglishPhase
} from '../src/config/ibPYPEnglishCurriculum';
import {
  ibPYPScienceCurriculum,
  getAllIBPYPScienceStandards,
  IBPYPScienceStandard,
  IBPYPScienceAgeBand
} from '../src/config/ibPYPScienceCurriculum';

const prisma = new PrismaClient();

const SUBJECT_MAP: Record<string, Subject> = {
  MATH: 'MATH',
  ENGLISH: 'ENGLISH',
  SCIENCE: 'SCIENCE'
};

// Map IB PYP strands to conceptual areas
function getConceptualArea(strand: string, subject: string): string {
  const mapping: Record<string, string> = {
    // Math strands
    'Data Handling': 'Statistics',
    'Measurement': 'Measurement',
    'Shape and Space': 'Geometry',
    'Pattern and Function': 'Algebra',
    'Number': 'Number Sense',
    // English strands
    'Oral Language': 'Oral Language',
    'Visual Language': 'Visual Literacy',
    'Reading': 'Reading',
    'Writing': 'Writing',
    // Science strands
    'Living Things': 'Life Science',
    'Earth and Space': 'Earth Science',
    'Materials and Matter': 'Physical Science',
    'Forces and Energy': 'Physical Science'
  };
  return mapping[strand] || strand;
}

// Build ancestor descriptions for hierarchy
function getAncestorDescriptions(strand: string, subject: string): string[] {
  if (subject === 'MATH') {
    if (strand === 'Number' || strand === 'Data Handling') {
      return ['Mathematics', 'Number'];
    } else if (strand === 'Shape and Space') {
      return ['Mathematics', 'Geometry'];
    } else if (strand === 'Measurement') {
      return ['Mathematics', 'Measurement'];
    } else if (strand === 'Pattern and Function') {
      return ['Mathematics', 'Algebra'];
    }
    return ['Mathematics'];
  }

  if (subject === 'ENGLISH') {
    if (strand === 'Reading') {
      return ['English', 'Reading'];
    } else if (strand === 'Writing') {
      return ['English', 'Writing'];
    } else if (strand === 'Oral Language') {
      return ['English', 'Speaking & Listening'];
    } else if (strand === 'Visual Language') {
      return ['English', 'Visual Literacy'];
    }
    return ['English'];
  }

  if (subject === 'SCIENCE') {
    if (strand === 'Living Things') {
      return ['Science', 'Life Science'];
    } else if (strand === 'Earth and Space') {
      return ['Science', 'Earth Science'];
    } else if (strand === 'Materials and Matter' || strand === 'Forces and Energy') {
      return ['Science', 'Physical Science'];
    }
    return ['Science'];
  }

  return [subject];
}

interface SeedOptions {
  mathOnly?: boolean;
  englishOnly?: boolean;
  scienceOnly?: boolean;
}

async function seedIBPYP(options: SeedOptions = {}) {
  const { mathOnly, englishOnly, scienceOnly } = options;
  const seedAll = !mathOnly && !englishOnly && !scienceOnly;

  console.log('\n========================================');
  console.log('  IB PYP Curriculum Seeder');
  console.log('  (Ages 3-12)');
  console.log('========================================\n');

  console.log('Curriculum Statistics:');
  if (seedAll || mathOnly) {
    console.log(`  Mathematics: ${getAllIBPYPMathStandards().length} standards (4 phases)`);
  }
  if (seedAll || englishOnly) {
    console.log(`  English/Language: ${getAllIBPYPEnglishStandards().length} standards (5 phases)`);
  }
  if (seedAll || scienceOnly) {
    console.log(`  Science: ${getAllIBPYPScienceStandards().length} standards (4 age bands)`);
  }

  try {
    console.log('\n[1/4] Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: 'IB_PYP' },
      update: {
        name: 'International Baccalaureate Primary Years Programme',
        country: 'INTERNATIONAL',
        version: '2018',
        sourceUrl: 'https://www.ibo.org/programmes/primary-years-programme/',
        lastSyncedAt: new Date()
      },
      create: {
        code: 'IB_PYP',
        name: 'International Baccalaureate Primary Years Programme',
        country: 'INTERNATIONAL',
        version: '2018',
        sourceUrl: 'https://www.ibo.org/programmes/primary-years-programme/',
        lastSyncedAt: new Date()
      }
    });
    console.log(`  Created/Updated: ${jurisdiction.name} (${jurisdiction.id})`);

    let totalCreated = 0;
    let totalUpdated = 0;

    if (seedAll || mathOnly) {
      console.log('\n[2/4] Seeding Mathematics standards...');
      const mathResult = await seedMathSubject(jurisdiction.id);
      totalCreated += mathResult.created;
      totalUpdated += mathResult.updated;
    }

    if (seedAll || englishOnly) {
      console.log('\n[3/4] Seeding English/Language standards...');
      const englishResult = await seedEnglishSubject(jurisdiction.id);
      totalCreated += englishResult.created;
      totalUpdated += englishResult.updated;
    }

    if (seedAll || scienceOnly) {
      console.log('\n[4/4] Seeding Science standards...');
      const scienceResult = await seedScienceSubject(jurisdiction.id);
      totalCreated += scienceResult.created;
      totalUpdated += scienceResult.updated;
    }

    console.log('\n========================================');
    console.log('  Seeding Complete!');
    console.log('========================================');
    console.log(`  Total Created: ${totalCreated}`);
    console.log(`  Total Updated: ${totalUpdated}`);
    console.log(`  Total Standards: ${totalCreated + totalUpdated}`);

    // Verification
    const dbCounts = await prisma.learningStandard.groupBy({
      by: ['standardSetId'],
      _count: { id: true },
      where: {
        standardSet: {
          jurisdiction: { code: 'IB_PYP' }
        }
      }
    });

    console.log('\n  Verification - Total IB PYP standards in database:');
    const totalInDb = dbCounts.reduce((sum, c) => sum + (c._count?.id || 0), 0);
    console.log(`    ${totalInDb} standards`);

  } catch (error) {
    console.error('\nError seeding curriculum:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Seed Mathematics (phase-based)
async function seedMathSubject(jurisdictionId: string): Promise<{ created: number; updated: number }> {
  let totalCreated = 0;
  let totalUpdated = 0;

  console.log(`\n  Standards by Phase (Mathematics):`);
  ibPYPMathCurriculum.phases.forEach((p: IBPYPMathPhase) => {
    console.log(`    Phase ${p.phase} (${p.phaseLabel}): ${p.standards.length} standards`);
  });

  console.log(`\n  Creating standard sets...`);
  const standardSets: Map<number, string> = new Map();

  for (const phaseData of ibPYPMathCurriculum.phases) {
    const setCode = `IB.PYP.P${phaseData.phase}.MA`;

    const standardSet = await prisma.standardSet.upsert({
      where: {
        jurisdictionId_code: {
          jurisdictionId,
          code: setCode
        }
      },
      update: {
        title: `IB PYP Mathematics - ${phaseData.phaseLabel}`,
        subject: SUBJECT_MAP['MATH'],
        educationLevels: [phaseData.gradeEquivalent],
        gradeLevel: phaseData.phase,
        ageRangeMin: phaseData.ageRangeMin,
        ageRangeMax: phaseData.ageRangeMax,
        documentTitle: `IB PYP Mathematics Scope and Sequence - ${phaseData.phaseLabel}`,
        documentYear: '2018'
      },
      create: {
        jurisdictionId,
        code: setCode,
        title: `IB PYP Mathematics - ${phaseData.phaseLabel}`,
        subject: SUBJECT_MAP['MATH'],
        educationLevels: [phaseData.gradeEquivalent],
        gradeLevel: phaseData.phase,
        ageRangeMin: phaseData.ageRangeMin,
        ageRangeMax: phaseData.ageRangeMax,
        documentTitle: `IB PYP Mathematics Scope and Sequence - ${phaseData.phaseLabel}`,
        documentYear: '2018'
      }
    });

    standardSets.set(phaseData.phase, standardSet.id);
  }

  console.log(`\n  Creating learning standards...`);

  for (const phaseData of ibPYPMathCurriculum.phases) {
    const standardSetId = standardSets.get(phaseData.phase);
    if (!standardSetId) continue;

    let phaseCreated = 0;
    let phaseUpdated = 0;

    // Group by strand for better organization
    const strandGroups = phaseData.standards.reduce((groups: Record<string, IBPYPMathStandard[]>, std: IBPYPMathStandard) => {
      if (!groups[std.strand]) {
        groups[std.strand] = [];
      }
      groups[std.strand].push(std);
      return groups;
    }, {} as Record<string, IBPYPMathStandard[]>);

    let position = 0;
    for (const [strand, standards] of Object.entries(strandGroups)) {
      for (const std of standards) {
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
            conceptualArea: getConceptualArea(std.strand, 'MATH'),
            isStatutory: true,
            guidance: `Learning Stage: ${std.learningStage.replace(/_/g, ' ')}`,
            position,
            depth: 0,
            ancestorDescriptions: getAncestorDescriptions(std.strand, 'MATH')
          },
          create: {
            standardSetId,
            notation: std.notation,
            description: std.description,
            strand: std.strand,
            conceptualArea: getConceptualArea(std.strand, 'MATH'),
            isStatutory: true,
            guidance: `Learning Stage: ${std.learningStage.replace(/_/g, ' ')}`,
            position,
            depth: 0,
            ancestorDescriptions: getAncestorDescriptions(std.strand, 'MATH')
          }
        });

        position++;
        if (result.createdAt.getTime() === result.updatedAt.getTime()) {
          phaseCreated++;
          totalCreated++;
        } else {
          phaseUpdated++;
          totalUpdated++;
        }
      }
    }

    console.log(`    Phase ${phaseData.phase}: Created ${phaseCreated}, Updated ${phaseUpdated}`);
  }

  return { created: totalCreated, updated: totalUpdated };
}

// Seed English/Language (phase-based)
async function seedEnglishSubject(jurisdictionId: string): Promise<{ created: number; updated: number }> {
  let totalCreated = 0;
  let totalUpdated = 0;

  console.log(`\n  Standards by Phase (English/Language):`);
  ibPYPEnglishCurriculum.phases.forEach((p: IBPYPEnglishPhase) => {
    console.log(`    Phase ${p.phase} (${p.phaseLabel}): ${p.standards.length} standards`);
  });

  console.log(`\n  Creating standard sets...`);
  const standardSets: Map<number, string> = new Map();

  for (const phaseData of ibPYPEnglishCurriculum.phases) {
    const setCode = `IB.PYP.P${phaseData.phase}.EN`;

    const standardSet = await prisma.standardSet.upsert({
      where: {
        jurisdictionId_code: {
          jurisdictionId,
          code: setCode
        }
      },
      update: {
        title: `IB PYP Language (English) - ${phaseData.phaseLabel}`,
        subject: SUBJECT_MAP['ENGLISH'],
        educationLevels: [phaseData.gradeEquivalent],
        gradeLevel: phaseData.phase,
        ageRangeMin: phaseData.ageRangeMin,
        ageRangeMax: phaseData.ageRangeMax,
        documentTitle: `IB PYP Language Scope and Sequence - ${phaseData.phaseLabel}`,
        documentYear: '2018'
      },
      create: {
        jurisdictionId,
        code: setCode,
        title: `IB PYP Language (English) - ${phaseData.phaseLabel}`,
        subject: SUBJECT_MAP['ENGLISH'],
        educationLevels: [phaseData.gradeEquivalent],
        gradeLevel: phaseData.phase,
        ageRangeMin: phaseData.ageRangeMin,
        ageRangeMax: phaseData.ageRangeMax,
        documentTitle: `IB PYP Language Scope and Sequence - ${phaseData.phaseLabel}`,
        documentYear: '2018'
      }
    });

    standardSets.set(phaseData.phase, standardSet.id);
  }

  console.log(`\n  Creating learning standards...`);

  for (const phaseData of ibPYPEnglishCurriculum.phases) {
    const standardSetId = standardSets.get(phaseData.phase);
    if (!standardSetId) continue;

    let phaseCreated = 0;
    let phaseUpdated = 0;

    // Group by strand
    const strandGroups = phaseData.standards.reduce((groups: Record<string, IBPYPEnglishStandard[]>, std: IBPYPEnglishStandard) => {
      if (!groups[std.strand]) {
        groups[std.strand] = [];
      }
      groups[std.strand].push(std);
      return groups;
    }, {} as Record<string, IBPYPEnglishStandard[]>);

    let position = 0;
    for (const [strand, standards] of Object.entries(strandGroups)) {
      for (const std of standards) {
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
            conceptualArea: getConceptualArea(std.strand, 'ENGLISH'),
            isStatutory: true,
            position,
            depth: 0,
            ancestorDescriptions: getAncestorDescriptions(std.strand, 'ENGLISH')
          },
          create: {
            standardSetId,
            notation: std.notation,
            description: std.description,
            strand: std.strand,
            conceptualArea: getConceptualArea(std.strand, 'ENGLISH'),
            isStatutory: true,
            position,
            depth: 0,
            ancestorDescriptions: getAncestorDescriptions(std.strand, 'ENGLISH')
          }
        });

        position++;
        if (result.createdAt.getTime() === result.updatedAt.getTime()) {
          phaseCreated++;
          totalCreated++;
        } else {
          phaseUpdated++;
          totalUpdated++;
        }
      }
    }

    console.log(`    Phase ${phaseData.phase}: Created ${phaseCreated}, Updated ${phaseUpdated}`);
  }

  return { created: totalCreated, updated: totalUpdated };
}

// Seed Science (age-band-based)
async function seedScienceSubject(jurisdictionId: string): Promise<{ created: number; updated: number }> {
  let totalCreated = 0;
  let totalUpdated = 0;

  console.log(`\n  Standards by Age Band (Science):`);
  ibPYPScienceCurriculum.ageBands.forEach((a: IBPYPScienceAgeBand) => {
    console.log(`    ${a.ageBandLabel}: ${a.standards.length} standards`);
  });

  console.log(`\n  Creating standard sets...`);
  const standardSets: Map<string, string> = new Map();

  for (const ageBandData of ibPYPScienceCurriculum.ageBands) {
    const setCode = `IB.PYP.${ageBandData.ageBand}.SC`;

    const standardSet = await prisma.standardSet.upsert({
      where: {
        jurisdictionId_code: {
          jurisdictionId,
          code: setCode
        }
      },
      update: {
        title: `IB PYP Science - ${ageBandData.ageBandLabel}`,
        subject: SUBJECT_MAP['SCIENCE'],
        educationLevels: [ageBandData.gradeEquivalent],
        gradeLevel: parseInt(ageBandData.ageBand.replace('A', '')),
        ageRangeMin: ageBandData.ageRangeMin,
        ageRangeMax: ageBandData.ageRangeMax,
        documentTitle: `IB PYP Science Scope and Sequence - ${ageBandData.ageBandLabel}`,
        documentYear: '2018'
      },
      create: {
        jurisdictionId,
        code: setCode,
        title: `IB PYP Science - ${ageBandData.ageBandLabel}`,
        subject: SUBJECT_MAP['SCIENCE'],
        educationLevels: [ageBandData.gradeEquivalent],
        gradeLevel: parseInt(ageBandData.ageBand.replace('A', '')),
        ageRangeMin: ageBandData.ageRangeMin,
        ageRangeMax: ageBandData.ageRangeMax,
        documentTitle: `IB PYP Science Scope and Sequence - ${ageBandData.ageBandLabel}`,
        documentYear: '2018'
      }
    });

    standardSets.set(ageBandData.ageBand, standardSet.id);
  }

  console.log(`\n  Creating learning standards...`);

  for (const ageBandData of ibPYPScienceCurriculum.ageBands) {
    const standardSetId = standardSets.get(ageBandData.ageBand);
    if (!standardSetId) continue;

    let bandCreated = 0;
    let bandUpdated = 0;

    // Group by strand
    const strandGroups = ageBandData.standards.reduce((groups: Record<string, IBPYPScienceStandard[]>, std: IBPYPScienceStandard) => {
      if (!groups[std.strand]) {
        groups[std.strand] = [];
      }
      groups[std.strand].push(std);
      return groups;
    }, {} as Record<string, IBPYPScienceStandard[]>);

    let position = 0;
    for (const [strand, standards] of Object.entries(strandGroups)) {
      for (const std of standards) {
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
            conceptualArea: getConceptualArea(std.strand, 'SCIENCE'),
            isStatutory: true,
            position,
            depth: 0,
            ancestorDescriptions: getAncestorDescriptions(std.strand, 'SCIENCE')
          },
          create: {
            standardSetId,
            notation: std.notation,
            description: std.description,
            strand: std.strand,
            conceptualArea: getConceptualArea(std.strand, 'SCIENCE'),
            isStatutory: true,
            position,
            depth: 0,
            ancestorDescriptions: getAncestorDescriptions(std.strand, 'SCIENCE')
          }
        });

        position++;
        if (result.createdAt.getTime() === result.updatedAt.getTime()) {
          bandCreated++;
          totalCreated++;
        } else {
          bandUpdated++;
          totalUpdated++;
        }
      }
    }

    console.log(`    ${ageBandData.ageBandLabel}: Created ${bandCreated}, Updated ${bandUpdated}`);
  }

  return { created: totalCreated, updated: totalUpdated };
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: SeedOptions = {
  mathOnly: args.includes('--math-only'),
  englishOnly: args.includes('--english-only'),
  scienceOnly: args.includes('--science-only')
};

seedIBPYP(options)
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
