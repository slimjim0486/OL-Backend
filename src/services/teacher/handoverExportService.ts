/**
 * Year-End Handover Package Export
 * Generates a printable PDF from a YEARLY TeacherReviewSummary + curriculum snapshots.
 */

import puppeteer from 'puppeteer';
import { prisma } from '../../config/database.js';
import { ReviewType, CurriculumState } from '@prisma/client';

function escapeHtml(input: unknown): string {
  const str = typeof input === 'string' ? input : (input === null || input === undefined ? '' : String(input));
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function safeFileSlug(input: string, maxLen = 80): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, maxLen) || 'handover';
}

function renderList(items: unknown): string {
  if (!Array.isArray(items) || items.length === 0) {
    return '<p style="color:#6b7280; margin:0;">No items.</p>';
  }
  return `
    <ul>
      ${items.map((item) => {
        if (typeof item === 'string') return `<li>${escapeHtml(item)}</li>`;
        if (item && typeof item === 'object') {
          const obj = item as Record<string, unknown>;
          const text = obj.description || obj.recommendation || obj.area || obj.topic || JSON.stringify(obj);
          return `<li>${escapeHtml(text)}</li>`;
        }
        return `<li>${escapeHtml(item)}</li>`;
      }).join('')}
    </ul>
  `;
}

function renderByKeyValueMap(map: unknown): string {
  if (!map || typeof map !== 'object') return '<span style="color:#6b7280;">None</span>';
  const entries = Object.entries(map as Record<string, unknown>)
    .filter(([, v]) => typeof v === 'number' && Number.isFinite(v))
    .sort((a, b) => (b[1] as number) - (a[1] as number));
  if (entries.length === 0) return '<span style="color:#6b7280;">None</span>';
  return entries
    .map(([k, v]) => `${escapeHtml(k)}: <strong>${escapeHtml(v)}</strong>`)
    .join('<span style="color:#9ca3af;"> · </span>');
}

function renderCurriculumTable(states: Array<Pick<CurriculumState, 'subject' | 'gradeLevel' | 'schoolYear' | 'standardsTaught' | 'standardsAssessed' | 'identifiedGaps'>>): string {
  if (!states || states.length === 0) {
    return '<p style="color:#6b7280; margin:0;">No curriculum snapshots found.</p>';
  }

  const rows = states
    .sort((a, b) => a.subject.localeCompare(b.subject))
    .map((s) => {
      const gapsCount = Array.isArray(s.identifiedGaps as unknown as any[]) ? (s.identifiedGaps as unknown as any[]).length : 0;
      return `
        <tr>
          <td>${escapeHtml(s.subject)}</td>
          <td>${escapeHtml(s.gradeLevel || '')}</td>
          <td>${escapeHtml(s.schoolYear)}</td>
          <td>${escapeHtml(s.standardsTaught?.length || 0)}</td>
          <td>${escapeHtml(s.standardsAssessed?.length || 0)}</td>
          <td>${escapeHtml(gapsCount)}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th>Grade</th>
          <th>School Year</th>
          <th>Taught</th>
          <th>Assessed</th>
          <th>Gaps</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

export async function exportYearEndHandoverPDF(params: {
  teacherId: string;
  reviewId: string;
}): Promise<{ data: Buffer; filename: string; mimeType: string }> {
  const { teacherId, reviewId } = params;

  const review = await prisma.teacherReviewSummary.findFirst({
    where: { id: reviewId, teacherId },
    include: {
      teacher: { select: { firstName: true, lastName: true, schoolName: true, email: true } },
    },
  });

  if (!review) {
    throw new Error('Review not found');
  }

  if (review.type !== ReviewType.YEARLY) {
    throw new Error('Handover package is only available for yearly reviews');
  }

  const curriculumStates = await prisma.curriculumState.findMany({
    where: {
      agentId: review.agentId,
      ...(review.schoolYear ? { schoolYear: review.schoolYear } : {}),
    },
    select: {
      subject: true,
      gradeLevel: true,
      schoolYear: true,
      standardsTaught: true,
      standardsAssessed: true,
      identifiedGaps: true,
    },
  });

  const lessonsDelivered = (review.lessonsDelivered as any) || {};
  const assessmentsGiven = (review.assessmentsGiven as any) || {};
  const standardsCovered = (review.standardsCovered as any) || {};
  const studentGrowth = (review.studentGrowth as any) || {};

  const teacherName = [review.teacher.firstName, review.teacher.lastName].filter(Boolean).join(' ') || 'Teacher';
  const schoolName = review.teacher.schoolName ? ` · ${review.teacher.schoolName}` : '';
  const generatedAt = new Date().toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(review.periodLabel)} - Handover Package</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            color: #111827;
            margin: 0;
            padding: 0;
          }
          .page {
            padding: 36px 36px 24px 36px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 18px;
          }
          .brand { font-weight: 800; letter-spacing: 0.2px; color: #1D4ED8; font-size: 14px; }
          h1 { font-size: 24px; margin: 6px 0 0 0; line-height: 1.2; }
          .meta { color: #6B7280; font-size: 12px; margin-top: 6px; }
          .badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 9999px;
            background: #FEF3C7;
            color: #92400E;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            white-space: nowrap;
          }
          .card {
            border: 1px solid #E5E7EB;
            border-radius: 14px;
            padding: 16px;
            margin: 14px 0;
          }
          .card-title {
            font-size: 13px;
            font-weight: 800;
            margin: 0 0 10px 0;
            color: #111827;
          }
          .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
          .stat {
            border-radius: 12px;
            background: #F9FAFB;
            padding: 14px;
            text-align: center;
            border: 1px solid #EEF2F7;
          }
          .stat .num { font-size: 22px; font-weight: 900; }
          .stat .label { font-size: 11px; color: #6B7280; margin-top: 4px; }
          .section {
            margin-top: 18px;
          }
          .section h2 {
            font-size: 14px;
            margin: 0 0 10px 0;
            font-weight: 900;
          }
          .muted { color: #6B7280; }
          ul { margin: 0; padding-left: 18px; }
          li { margin: 0 0 6px 0; font-size: 12px; color: #374151; }
          p { font-size: 12px; line-height: 1.5; margin: 0; color: #374151; }
          .divider { height: 1px; background: #EEF2F7; margin: 16px 0; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border-bottom: 1px solid #E5E7EB; padding: 8px 6px; text-align: left; vertical-align: top; }
          th { color: #374151; font-weight: 800; background: #F9FAFB; }
          .footer {
            margin-top: 18px;
            padding-top: 12px;
            border-top: 1px solid #EEF2F7;
            font-size: 10px;
            color: #9CA3AF;
            display: flex;
            justify-content: space-between;
            gap: 12px;
          }
          .page-break { page-break-before: always; }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div>
              <div class="brand">OrbitLearn</div>
              <h1>Year-End Handover Package</h1>
              <div class="meta">${escapeHtml(review.periodLabel)} · Generated ${escapeHtml(generatedAt)}</div>
              <div class="meta">Teacher: ${escapeHtml(teacherName)}${escapeHtml(schoolName)} · ${escapeHtml(review.teacher.email)}</div>
            </div>
            <div class="badge">YEARLY</div>
          </div>

          <div class="card">
            <div class="card-title">Executive Summary</div>
            <p>${escapeHtml(review.executiveSummary || '')}</p>
          </div>

          <div class="grid-3">
            <div class="stat">
              <div class="num">${escapeHtml(lessonsDelivered.total ?? '—')}</div>
              <div class="label">Lessons Delivered</div>
            </div>
            <div class="stat">
              <div class="num">${escapeHtml(assessmentsGiven.total ?? '—')}</div>
              <div class="label">Assessments Given</div>
            </div>
            <div class="stat">
              <div class="num">${escapeHtml(standardsCovered.total ?? '—')}</div>
              <div class="label">Standards Covered</div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">Breakdown</div>
            <p><strong>Lessons by Subject:</strong> ${renderByKeyValueMap(lessonsDelivered.bySubject)}</p>
            <div class="divider"></div>
            <p><strong>Assessments by Type:</strong> ${renderByKeyValueMap(assessmentsGiven.byType)}</p>
            <div class="divider"></div>
            <p><strong>Standards:</strong> Newly mastered: <strong>${escapeHtml(standardsCovered.newlyMastered ?? '—')}</strong> · Gaps: <strong>${escapeHtml(standardsCovered.gaps ?? '—')}</strong></p>
          </div>

          <div class="section">
            <h2>Student Growth</h2>
            <div class="card">
              <p>${escapeHtml(studentGrowth.summary || '')}</p>
              ${Array.isArray(studentGrowth.highlights) && studentGrowth.highlights.length > 0
                ? `<div class="divider"></div><div class="card-title">Highlights</div>${renderList(studentGrowth.highlights)}`
                : ''
              }
            </div>
          </div>

          <div class="section">
            <h2>Attention Areas</h2>
            <div class="card">
              ${renderList(review.attentionAreas as any)}
            </div>
          </div>

          <div class="section">
            <h2>Upcoming Focus</h2>
            <div class="card">
              ${renderList(review.upcomingFocus as any)}
            </div>
          </div>

          <div class="section">
            <h2>Recommendations</h2>
            <div class="card">
              ${renderList(review.recommendations as any)}
            </div>
          </div>

          <div class="section">
            <h2>Curriculum Snapshot</h2>
            <div class="card">
              ${renderCurriculumTable(curriculumStates)}
            </div>
          </div>

          <div class="section">
            <h2>Handover Notes</h2>
            <div class="card">
              <p>${escapeHtml(review.handoverNotes || '')}</p>
            </div>
          </div>

          <div class="footer">
            <div>Generated by OrbitLearn Teacher AI Assistant</div>
            <div>${escapeHtml(review.id)}</div>
          </div>
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
    });

    const filename = `OrbitLearn - Handover - ${safeFileSlug(review.periodLabel)}.pdf`;

    return {
      data: Buffer.from(pdfBuffer),
      filename,
      mimeType: 'application/pdf',
    };
  } finally {
    await browser.close();
  }
}
