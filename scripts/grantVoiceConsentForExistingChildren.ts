// One-time script to grant voice consent for all existing children
import { prisma } from '../src/config/database.js';
import { VoiceConsentStatus } from '@prisma/client';

async function main() {
  console.log('Granting voice consent for all existing children...');
  
  // Get all children with their parents
  const children = await prisma.child.findMany({
    include: { parent: true },
  });
  
  console.log(`Found ${children.length} children`);
  
  let granted = 0;
  let skipped = 0;
  
  for (const child of children) {
    // Check if consent already exists
    const existingConsent = await prisma.voiceConsent.findUnique({
      where: {
        parentId_childId: {
          parentId: child.parentId,
          childId: child.id,
        },
      },
    });
    
    if (existingConsent) {
      skipped++;
      continue;
    }
    
    // Grant consent
    await prisma.voiceConsent.create({
      data: {
        parentId: child.parentId,
        childId: child.id,
        status: VoiceConsentStatus.GRANTED,
        consentGivenAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });
    granted++;
  }
  
  console.log(`Done! Granted: ${granted}, Skipped (already had consent): ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
