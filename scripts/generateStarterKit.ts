/**
 * Script: Generate a Starter Kit for a specific teacher and email the materials
 *
 * Usage: npx tsx scripts/generateStarterKit.ts
 */

import { prisma } from '../src/config/database.js';
import { packageGenerationService } from '../src/services/teacher/packageGenerationService.js';
import { emailService } from '../src/services/email/emailService.js';
import { logger } from '../src/utils/logger.js';

const TEACHER_EMAIL = 'support@mydscvr.ai';
const SEND_TO_EMAIL = 'support@mydscvr.ai'; // Where to send the materials summary

const CONFIG = {
  gradeLevel: '3rd Grade',
  subjects: ['MATH'],
  topic: 'Fractions',
  curriculum: 'AMERICAN',
  weekStartDate: '2026-03-02', // Next Monday
};

async function main() {
  console.log('🔍 Finding teacher...');
  const teacher = await prisma.teacher.findFirst({ where: { email: TEACHER_EMAIL } });
  if (!teacher) {
    console.error(`❌ Teacher not found: ${TEACHER_EMAIL}`);
    process.exit(1);
  }
  console.log(`✅ Found teacher: ${teacher.firstName} ${teacher.lastName} (${teacher.id})`);

  console.log('\n📦 Creating Starter Kit purchase record...');
  const purchase = await prisma.packagePurchase.create({
    data: {
      teacherId: teacher.id,
      packageTier: 'STARTER',
      packageCategory: 'CORE',
      packageName: 'Starter Kit',
      priceCents: 0, // Complimentary
      deliveryType: 'INSTANT',
      totalWeeks: 3,
      status: 'PAID',
      config: CONFIG,
      purchasedAt: new Date(),
    },
  });
  console.log(`✅ Purchase created: ${purchase.id}`);

  console.log('\n⚙️  Generating package materials (this may take 3-5 minutes)...');
  const startTime = Date.now();

  try {
    await packageGenerationService.generatePackage(purchase.id);
  } catch (err: any) {
    console.error(`❌ Generation failed: ${err.message}`);
    // Still try to fetch whatever was generated
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`⏱️  Generation completed in ${elapsed}s`);

  // Fetch the generated materials
  console.log('\n📋 Fetching generated materials...');
  const fullPurchase = await prisma.packagePurchase.findUnique({
    where: { id: purchase.id },
    include: {
      weeks: {
        orderBy: { weekNumber: 'asc' },
        include: {
          materials: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  });

  if (!fullPurchase) {
    console.error('❌ Could not fetch purchase');
    process.exit(1);
  }

  console.log(`📊 Status: ${fullPurchase.status}`);
  console.log(`📊 Total materials: ${fullPurchase.totalMaterials}`);
  console.log(`📊 Generated: ${fullPurchase.generatedCount}`);
  console.log(`📊 Failed: ${fullPurchase.failedCount}`);
  console.log(`📊 Weeks: ${fullPurchase.weeks.length}`);

  // Build email HTML
  const materialsHtml = buildMaterialsEmail(fullPurchase, teacher);

  console.log('\n📧 Sending materials email...');
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: 'Orbit Learn <support@orbitlearn.app>',
      to: SEND_TO_EMAIL,
      subject: `Your Starter Kit is Ready — ${CONFIG.topic} (Grade ${CONFIG.gradeLevel})`,
      html: materialsHtml,
    });

    if (error) {
      console.error('❌ Email failed:', error);
    } else {
      console.log(`✅ Email sent to ${SEND_TO_EMAIL}`);
    }
  } catch (err: any) {
    console.error('❌ Email error:', err.message);
    // Fallback: write to file
    const fs = await import('fs');
    const outputPath = `./starter-kit-${purchase.id.slice(0, 8)}.html`;
    fs.writeFileSync(outputPath, materialsHtml);
    console.log(`📄 Materials saved to ${outputPath}`);
  }

  console.log('\n🎉 Done!');
  await prisma.$disconnect();
}

function buildMaterialsEmail(purchase: any, teacher: any): string {
  let weekSections = '';

  for (const week of purchase.weeks) {
    let materialRows = '';
    for (const mat of week.materials) {
      const statusColor = mat.status === 'PKG_GENERATED' ? '#7BAE7F' : mat.status === 'PKG_FAILED' ? '#C75B39' : '#D4A853';
      const statusLabel = mat.status.replace('PKG_', '');

      // Extract content preview
      let contentPreview = '';
      if (mat.content) {
        const content = typeof mat.content === 'string' ? JSON.parse(mat.content) : mat.content;
        contentPreview = content.html
          ? content.html.substring(0, 500) + (content.html.length > 500 ? '...' : '')
          : content.content
            ? (typeof content.content === 'string' ? content.content.substring(0, 500) : JSON.stringify(content.content).substring(0, 500))
            : 'Content generated';
      }

      // Check for differentiated versions
      let diffInfo = '';
      if (mat.differentiatedContent) {
        const diff = typeof mat.differentiatedContent === 'string' ? JSON.parse(mat.differentiatedContent) : mat.differentiatedContent;
        const levels = Object.keys(diff);
        if (levels.length > 0) {
          diffInfo = `<div style="margin-top: 8px; padding: 8px 12px; background: #F3F0FF; border-radius: 8px; font-size: 12px; color: #7B5EA7;">
            <strong>Differentiated versions:</strong> ${levels.map(l => l.replace(/_/g, ' ')).join(', ')}
          </div>`;
        }
      }

      materialRows += `
        <div style="background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="display: inline-block; padding: 2px 8px; background: ${statusColor}20; color: ${statusColor}; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase;">
              ${mat.materialType.replace(/_/g, ' ')}
            </span>
            <span style="display: inline-block; padding: 2px 8px; background: ${statusColor}15; color: ${statusColor}; border-radius: 4px; font-size: 11px; font-weight: 600;">
              ${statusLabel}
            </span>
            ${mat.subject ? `<span style="font-size: 12px; color: #6B7280;">${mat.subject}</span>` : ''}
          </div>
          <h4 style="margin: 0 0 4px 0; color: #1E2A3A; font-size: 15px;">${mat.title}</h4>
          ${mat.description ? `<p style="margin: 0 0 8px 0; color: #6B7280; font-size: 13px;">${mat.description}</p>` : ''}
          ${contentPreview ? `<div style="margin-top: 8px; padding: 12px; background: #F9FAFB; border-radius: 8px; font-size: 13px; color: #374151; max-height: 200px; overflow: hidden;">${contentPreview}</div>` : ''}
          ${diffInfo}
        </div>
      `;
    }

    weekSections += `
      <div style="margin-bottom: 32px;">
        <h3 style="color: #2D5A4A; font-size: 18px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #2D5A4A20;">
          ${week.weekLabel}
        </h3>
        ${materialRows}
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 700px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; font-family: Georgia, serif;">
          Your Starter Kit is Ready!
        </h1>
        <p style="color: rgba(255,255,255,0.85); margin-top: 8px; font-size: 16px;">
          ${CONFIG.topic} — ${CONFIG.gradeLevel} — ${CONFIG.curriculum.replace(/_/g, ' ')} Curriculum
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="background-color: #ffffff; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
        <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-top: 0;">
          Hi ${teacher.firstName || 'Teacher'},
        </p>
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
          Great news! Ollie has finished generating your <strong>Starter Kit</strong> package. Here's a summary of everything that was created for you:
        </p>

        <!-- Stats -->
        <div style="display: flex; gap: 12px; margin: 24px 0; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 120px; padding: 16px; background: #2D5A4A10; border-radius: 12px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #2D5A4A;">${purchase.generatedCount}</div>
            <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">Resources Generated</div>
          </div>
          <div style="flex: 1; min-width: 120px; padding: 16px; background: #D4A85310; border-radius: 12px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #D4A853;">${purchase.weeks.length}</div>
            <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">Weeks of Content</div>
          </div>
          <div style="flex: 1; min-width: 120px; padding: 16px; background: #7BAE7F10; border-radius: 12px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #7BAE7F;">4</div>
            <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">Resource Types</div>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;">

        <!-- Materials by Week -->
        ${weekSections}

        <!-- CTA -->
        <div style="text-align: center; margin: 32px 0 16px;">
          <a href="https://orbitlearn.app/en/teacher/store" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; font-weight: 700; text-decoration: none; border-radius: 12px; font-size: 15px; border: 2px solid #B8923F;">
            View in Your Dashboard
          </a>
        </div>

        <p style="color: #9CA3AF; font-size: 13px; text-align: center; margin-top: 24px;">
          All materials are personalized by Ollie and differentiated for your student groups.<br>
          You can approve, edit, or regenerate any material from your dashboard.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px; text-align: center;">
        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
          Orbit Learn — AI-powered teaching resources<br>
          <a href="https://orbitlearn.app" style="color: #2D5A4A;">orbitlearn.app</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
