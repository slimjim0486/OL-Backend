// Weekly Digest Service — Compiles and sends weekly teaching activity summaries
// Sends Sunday evening to teachers active in past 14 days
import { Resend } from 'resend';
import { config } from '../../config/index.js';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

const resend = config.email.apiKey ? new Resend(config.email.apiKey) : null;

// ============================================
// TYPES
// ============================================

interface WeeklyDigest {
  teacherId: string;
  firstName: string;
  email: string;
  noteCount: number;
  topicCount: number;
  materialCount: number;
  reflectionDays: number;
  currentStreak: number;
  topTopic: string | null;
  topTopicCount: number;
  newTopics: string[];
  weekStart: Date;
  weekEnd: Date;
}

// ============================================
// DIGEST COMPILATION
// ============================================

async function generateDigest(teacherId: string): Promise<WeeklyDigest | null> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      id: true,
      firstName: true,
      email: true,
      currentStreak: true,
    },
  });

  if (!teacher) return null;

  const weekEnd = new Date();
  const weekStart = new Date(Date.now() - 7 * 86400000);

  // Get this week's stream entries
  const entries = await prisma.teacherStreamEntry.findMany({
    where: {
      teacherId,
      archived: false,
      createdAt: { gte: weekStart, lte: weekEnd },
    },
    select: {
      extractedTags: true,
      createdAt: true,
    },
  });

  if (entries.length === 0) return null;

  // Get this week's materials
  const materialCount = await prisma.teacherMaterial.count({
    where: {
      teacherId,
      createdAt: { gte: weekStart, lte: weekEnd },
    },
  });

  // Analyze entries
  const topicCounts = new Map<string, number>();
  const uniqueDays = new Set<string>();
  const allTopicsThisWeek = new Set<string>();

  for (const entry of entries) {
    // Count unique days (for reflection tracking)
    uniqueDays.add(entry.createdAt.toISOString().split('T')[0]);

    const tags = entry.extractedTags as any;
    if (tags?.topics) {
      for (const topic of tags.topics) {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
        allTopicsThisWeek.add(topic);
      }
    }
  }

  // Find top topic
  let topTopic: string | null = null;
  let topTopicCount = 0;
  for (const [topic, count] of topicCounts) {
    if (count > topTopicCount) {
      topTopic = topic;
      topTopicCount = count;
    }
  }

  // Find new topics (not mentioned in previous 30 days)
  const previousEntries = await prisma.teacherStreamEntry.findMany({
    where: {
      teacherId,
      archived: false,
      createdAt: {
        gte: new Date(Date.now() - 37 * 86400000), // 30 days before this week
        lt: weekStart,
      },
    },
    select: { extractedTags: true },
  });

  const previousTopics = new Set<string>();
  for (const entry of previousEntries) {
    const tags = entry.extractedTags as any;
    if (tags?.topics) {
      for (const topic of tags.topics) {
        previousTopics.add(topic);
      }
    }
  }

  const newTopics = [...allTopicsThisWeek].filter(t => !previousTopics.has(t));

  return {
    teacherId: teacher.id,
    firstName: teacher.firstName || 'there',
    email: teacher.email,
    noteCount: entries.length,
    topicCount: allTopicsThisWeek.size,
    materialCount,
    reflectionDays: uniqueDays.size,
    currentStreak: teacher.currentStreak,
    topTopic,
    topTopicCount,
    newTopics: newTopics.slice(0, 3), // Max 3 new topics in email
    weekStart,
    weekEnd,
  };
}

// ============================================
// EMAIL
// ============================================

function buildDigestEmail(digest: WeeklyDigest): { subject: string; html: string; text: string } {
  const streamUrl = `${config.frontendUrl}/teacher/stream`;
  const streakText = digest.currentStreak > 0
    ? ` (🔥 ${digest.currentStreak}-day streak!)`
    : '';

  const topTopicLine = digest.topTopic
    ? `<li style="margin-bottom: 8px;">Your most active topic: <strong>${digest.topTopic}</strong> (${digest.topTopicCount} mentions)</li>`
    : '';

  const newTopicLines = digest.newTopics.length > 0
    ? digest.newTopics.map(t => `<li style="margin-bottom: 8px;">New topic this week: <strong>${t}</strong></li>`).join('')
    : '';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#FDF8F3;font-family:'Outfit',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF8F3;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(30,42,58,0.05);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#2D5A4A,#3D7A6A);padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-family:'Fraunces',Georgia,serif;font-size:24px;font-weight:700;">Your week in teaching</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px;">
          <p style="color:#1E2A3A;font-size:16px;line-height:1.6;margin:0 0 24px;">
            Hi ${digest.firstName},
          </p>

          <p style="color:#1E2A3A;font-size:16px;line-height:1.6;margin:0 0 16px;">
            This week you:
          </p>

          <ul style="color:#3D4F66;font-size:15px;line-height:1.8;padding-left:20px;margin:0 0 24px;">
            <li style="margin-bottom: 8px;">Wrote <strong>${digest.noteCount}</strong> notes across <strong>${digest.topicCount}</strong> topics</li>
            <li style="margin-bottom: 8px;">Generated <strong>${digest.materialCount}</strong> materials</li>
            <li style="margin-bottom: 8px;">Reflected on <strong>${digest.reflectionDays}</strong> days${streakText}</li>
            ${topTopicLine}
            ${newTopicLines}
          </ul>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
            <tr><td align="center">
              <a href="${streamUrl}" style="display:inline-block;background:linear-gradient(135deg,#D4A853,#E8C97A);color:#1E2A3A;font-weight:700;font-size:16px;padding:14px 32px;border-radius:16px;text-decoration:none;border:2px solid #B8923F;box-shadow:0 4px 0 #B8923F;">
                Open your Stream →
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px 32px;border-top:1px solid #f0ece7;text-align:center;">
          <p style="color:#8a8580;font-size:12px;line-height:1.5;margin:0;">
            Orbit Learn · You received this because you're an active teacher on our platform.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Your week in teaching

Hi ${digest.firstName},

This week you:
- Wrote ${digest.noteCount} notes across ${digest.topicCount} topics
- Generated ${digest.materialCount} materials
- Reflected on ${digest.reflectionDays} days${streakText}
${digest.topTopic ? `- Most active topic: ${digest.topTopic} (${digest.topTopicCount} mentions)` : ''}
${digest.newTopics.map(t => `- New topic: ${t}`).join('\n')}

Open your Stream: ${streamUrl}`;

  return {
    subject: 'Your week in teaching',
    html,
    text,
  };
}

async function sendDigestEmail(digest: WeeklyDigest): Promise<boolean> {
  if (!resend) {
    logger.warn('Resend not configured — skipping digest email', { teacherId: digest.teacherId });
    return false;
  }

  const template = buildDigestEmail(digest);

  try {
    const { error } = await resend.emails.send({
      from: `Orbit Learn <${config.email.fromEmail}>`,
      to: digest.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      logger.error('Failed to send weekly digest email', { error, email: digest.email });
      return false;
    }

    logger.info('Weekly digest email sent', { email: digest.email, teacherId: digest.teacherId });
    return true;
  } catch (err) {
    logger.error('Weekly digest email error', { error: (err as Error).message, email: digest.email });
    return false;
  }
}

// ============================================
// BULK PROCESSING (called by cron job)
// ============================================

async function processWeeklyDigests(): Promise<{ sent: number; skipped: number; failed: number }> {
  const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000);

  // Get teachers active in the past 14 days who want digest emails
  const teachers = await prisma.teacher.findMany({
    where: {
      notifyWeeklyDigest: true,
      lastActiveDate: { gte: fourteenDaysAgo },
    },
    select: { id: true },
  });

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const teacher of teachers) {
    try {
      const digest = await generateDigest(teacher.id);
      if (!digest || digest.noteCount === 0) {
        skipped++;
        continue;
      }

      const success = await sendDigestEmail(digest);
      if (success) {
        sent++;
      } else {
        failed++;
      }
    } catch (err) {
      logger.error('Failed to process digest for teacher', {
        teacherId: teacher.id,
        error: (err as Error).message,
      });
      failed++;
    }
  }

  logger.info('Weekly digest processing complete', { sent, skipped, failed });
  return { sent, skipped, failed };
}

// ============================================
// EXPORT
// ============================================

export const weeklyDigestService = {
  generateDigest,
  sendDigestEmail,
  processWeeklyDigests,
};
