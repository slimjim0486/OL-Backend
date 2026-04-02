/**
 * Export Service for Teacher Content
 * Generates PDF exports of lessons, quizzes, flashcards, and study guides
 */

import puppeteer from 'puppeteer';
import { TeacherContent, Subject } from '@prisma/client';

// Types for content structures
interface ActivityObject {
  name?: string;
  description?: string;
  materials?: string[];
  duration?: number;
  discussionQuestions?: string[];
}

interface LessonSection {
  title: string;
  content: string;
  duration?: number;
  activities?: (string | ActivityObject)[];
  teachingTips?: string[];
  visualAids?: string[];
  realWorldConnections?: string[];
}

interface VocabularyItem {
  term: string;
  definition: string;
  example?: string;
}

interface AssessmentQuestion {
  question: string;
  type: 'multiple_choice' | 'short_answer' | 'true_false';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

interface PracticeExercise {
  question: string;
  type?: string;
  hint?: string;
  answer?: string;
}

interface LessonContent {
  title: string;
  summary?: string;
  weeklyMaterialType?: string;
  weeklyTemplateVersion?: string;
  objectives?: string[];
  sections?: LessonSection[];
  vocabulary?: VocabularyItem[];
  assessment?: {
    questions: AssessmentQuestion[];
    totalPoints?: number;
    passingScore?: number;
    scoringGuide?: string;
  };
  teacherNotes?: string;
  practiceExercises?: PracticeExercise[];
  summaryPoints?: string[];
  reviewQuestions?: string[];
  additionalResources?: string[];
  prerequisites?: string[];
  nextSteps?: string;
}

type WeeklyTemplateType = 'WARM_UP' | 'WORKSHEET' | 'ACTIVITY' | 'HOMEWORK';

interface QuizQuestion {
  id: string;
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: string;
  points?: number;
}

interface QuizContent {
  title: string;
  questions: QuizQuestion[];
  totalPoints?: number;
  estimatedTime?: number;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  category?: string;
}

interface FlashcardContent {
  title: string;
  cards: Flashcard[];
}

interface StudyGuideContent {
  title: string;
  summary?: string;
  outline?: Array<{ section: string; points: string[] }>;
  keyTerms?: Array<{ term: string; definition: string }>;
  reviewQuestions?: string[];
}

export interface ExportOptions {
  format?: 'pdf' | 'html';
  includeAnswers?: boolean;
  includeTeacherNotes?: boolean;
  paperSize?: 'letter' | 'a4';
  colorScheme?: 'color' | 'grayscale';
  separateAnswerKey?: boolean;
  answerKeyOnly?: boolean;
}

// Subject colors for styling - matches the Prisma Subject enum
const subjectColors: Record<Subject, { primary: string; secondary: string; accent: string }> = {
  MATH: { primary: '#3B82F6', secondary: '#DBEAFE', accent: '#1D4ED8' },
  ENGLISH: { primary: '#8B5CF6', secondary: '#EDE9FE', accent: '#6D28D9' },
  SCIENCE: { primary: '#10B981', secondary: '#D1FAE5', accent: '#047857' },
  SOCIAL_STUDIES: { primary: '#F59E0B', secondary: '#FEF3C7', accent: '#D97706' },
  HISTORY: { primary: '#92400E', secondary: '#FEF3C7', accent: '#78350F' },
  GEOGRAPHY: { primary: '#0D9488', secondary: '#CCFBF1', accent: '#0F766E' },
  PHYSICAL_EDUCATION: { primary: '#DC2626', secondary: '#FEE2E2', accent: '#B91C1C' },
  HEALTH: { primary: '#16A34A', secondary: '#DCFCE7', accent: '#15803D' },
  COMPUTER_SCIENCE: { primary: '#0EA5E9', secondary: '#E0F2FE', accent: '#0284C7' },
  READING: { primary: '#7C3AED', secondary: '#EDE9FE', accent: '#6D28D9' },
  FOREIGN_LANGUAGE: { primary: '#DB2777', secondary: '#FCE7F3', accent: '#BE185D' },
  ECONOMICS: { primary: '#059669', secondary: '#D1FAE5', accent: '#047857' },
  DRAMA: { primary: '#C026D3', secondary: '#FAE8FF', accent: '#A21CAF' },
  ENVIRONMENTAL_STUDIES: { primary: '#65A30D', secondary: '#ECFCCB', accent: '#4D7C0F' },
  ARABIC: { primary: '#059669', secondary: '#D1FAE5', accent: '#047857' },
  ISLAMIC_STUDIES: { primary: '#047857', secondary: '#ECFDF5', accent: '#065F46' },
  ART: { primary: '#EC4899', secondary: '#FCE7F3', accent: '#BE185D' },
  MUSIC: { primary: '#6366F1', secondary: '#E0E7FF', accent: '#4338CA' },
  OTHER: { primary: '#6B7280', secondary: '#F3F4F6', accent: '#4B5563' },
};

// ─── SVG Icon System ──────────────────────────────────────────────────────────
// Replaces emoji icons with consistent, print-safe, CSS-colorable inline SVGs.
function getIcon(name: string, color: string = 'currentColor'): string {
  const icons: Record<string, string> = {
    target: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="${color}" stroke-width="1.5"/><circle cx="8" cy="8" r="3.5" stroke="${color}" stroke-width="1.5"/><circle cx="8" cy="8" r="1" fill="${color}"/></svg>`,
    book: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 2.5C2 2.5 3.5 1.5 5.5 1.5C7.5 1.5 8 2.5 8 2.5V13.5C8 13.5 7 12.5 5.5 12.5C4 12.5 2 13.5 2 13.5V2.5Z" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 2.5C8 2.5 8.5 1.5 10.5 1.5C12.5 1.5 14 2.5 14 2.5V13.5C14 13.5 13 12.5 10.5 12.5C9 12.5 8 13.5 8 13.5" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    pencil: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 3.5L12.5 6.5" stroke="${color}" stroke-width="1.5"/></svg>`,
    question: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="${color}" stroke-width="1.5"/><path d="M5.8 6C5.8 4.78 6.78 3.8 8 3.8C9.22 3.8 10.2 4.78 10.2 6C10.2 7.22 9.22 8.2 8 8.2V9.5" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="11.5" r="0.75" fill="${color}"/></svg>`,
    check: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="${color}" stroke-width="1.5"/><path d="M5 8L7 10.5L11 5.5" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    lightbulb: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M6 13H10M6.5 14.5H9.5M8 1C5.24 1 3 3.24 3 6C3 8.05 4.23 9.81 6 10.58V12H10V10.58C11.77 9.81 13 8.05 13 6C13 3.24 10.76 1 8 1Z" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    clock: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="${color}" stroke-width="1.5"/><path d="M8 4V8L10.5 10.5" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tools: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M6.5 6.5L2 11L5 14L9.5 9.5M14.5 1.5L9 7M11 1.5H14.5V5" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    star: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L9.8 5.7L14.3 6.1L10.9 9.1L11.9 13.5L8 11.3L4.1 13.5L5.1 9.1L1.7 6.1L6.2 5.7L8 1.5Z" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    list: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M5.5 3H14M5.5 8H14M5.5 13H14" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/><circle cx="2.5" cy="3" r="1" fill="${color}"/><circle cx="2.5" cy="8" r="1" fill="${color}"/><circle cx="2.5" cy="13" r="1" fill="${color}"/></svg>`,
    notepad: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><rect x="3" y="1" width="10" height="14" rx="1.5" stroke="${color}" stroke-width="1.5"/><path d="M6 5H10M6 8H10M6 11H8" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    globe: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="${color}" stroke-width="1.5"/><path d="M1.5 8H14.5M8 1.5C6 4 6 12 8 14.5M8 1.5C10 4 10 12 8 14.5" stroke="${color}" stroke-width="1.5"/></svg>`,
    home: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2.5 7.5L8 2L13.5 7.5M4 9V14H6.5V10.5H9.5V14H12V9" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    compass: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="${color}" stroke-width="1.5"/><path d="M10.5 5.5L9 9L5.5 10.5L7 7L10.5 5.5Z" fill="${color}" opacity="0.2" stroke="${color}" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
    rocket: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C8 1.5 4.5 4 4.5 9L6.5 11H9.5L11.5 9C11.5 4 8 1.5 8 1.5ZM6.5 11L4.5 14M9.5 11L11.5 14" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="6.5" r="1" fill="${color}"/></svg>`,
    cards: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="9" height="11" rx="1.5" stroke="${color}" stroke-width="1.5"/><path d="M5.5 3.5V2C5.5 1.45 5.95 1 6.5 1H13.5C14.05 1 14.5 1.45 14.5 2V10.5C14.5 11.05 14.05 11.5 13.5 11.5H10.5" stroke="${color}" stroke-width="1.5"/></svg>`,
    link: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M6.5 9.5L9.5 6.5M4.5 7.5L3 9C1.9 10.1 1.9 11.9 3 13C4.1 14.1 5.9 14.1 7 13L8.5 11.5M8.5 4.5L10 3C11.1 1.9 12.9 1.9 14 3C15.1 4.1 15.1 5.9 14 7L12.5 8.5" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    steps: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 13H6V9H10V5H14" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="2" cy="13" r="1.2" fill="${color}"/><circle cx="6" cy="9" r="1.2" fill="${color}"/><circle cx="10" cy="5" r="1.2" fill="${color}"/></svg>`,
    pin: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L11 5.5L9.5 9L10.5 14.5L8 11.5L5.5 14.5L6.5 9L5 5.5L8 1.5Z" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    arrow: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    quiz: `<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="1.5" stroke="${color}" stroke-width="1.5"/><path d="M5 5H11M5 8H9M5 11H7" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="11" r="2.5" fill="white" stroke="${color}" stroke-width="1.5"/><path d="M11 11L12 12L13.5 10" stroke="${color}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };
  return icons[name] || '';
}

// ─── Orbit Learn Logo (Inline SVG) ──────────────────────────────────────────
function getOrbitLogo(size: number = 22, color: string = '#2D5A4A'): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" stroke="${color}" stroke-width="2.5"/>
    <circle cx="16" cy="16" r="5" fill="${color}"/>
    <ellipse cx="16" cy="16" rx="14" ry="7" stroke="${color}" stroke-width="1.5" stroke-dasharray="3 2" transform="rotate(-25 16 16)"/>
  </svg>`;
}

// ─── Subject-Specific Header Background Patterns (CSS only) ─────────────────
function getSubjectPattern(subject: Subject, colorScheme: string): string {
  if (colorScheme === 'grayscale') return '';
  const color = subjectColors[subject]?.primary || '#6B7280';

  const patterns: Partial<Record<Subject, string>> = {
    MATH: `background-image:
      linear-gradient(${color}08 1px, transparent 1px),
      linear-gradient(90deg, ${color}08 1px, transparent 1px);
    background-size: 20px 20px;`,
    SCIENCE: `background-image: radial-gradient(circle, ${color}0A 1px, transparent 1px);
    background-size: 16px 16px;`,
    ENGLISH: `background-image: repeating-linear-gradient(
      0deg, transparent, transparent 19px, ${color}06 19px, ${color}06 20px);`,
    READING: `background-image: repeating-linear-gradient(
      0deg, transparent, transparent 19px, ${color}06 19px, ${color}06 20px);`,
    HISTORY: `background-image:
      linear-gradient(45deg, ${color}05 25%, transparent 25%),
      linear-gradient(-45deg, ${color}05 25%, transparent 25%);
    background-size: 30px 30px;`,
    SOCIAL_STUDIES: `background-image:
      linear-gradient(45deg, ${color}05 25%, transparent 25%),
      linear-gradient(-45deg, ${color}05 25%, transparent 25%);
    background-size: 30px 30px;`,
    ART: `background-image: radial-gradient(circle at 50% 50%, ${color}08 0%, transparent 60%);
    background-size: 24px 24px;`,
    MUSIC: `background-image: radial-gradient(circle at 50% 50%, ${color}08 0%, transparent 60%);
    background-size: 24px 24px;`,
    COMPUTER_SCIENCE: `background-image:
      linear-gradient(${color}06 1px, transparent 1px),
      linear-gradient(90deg, ${color}06 1px, transparent 1px);
    background-size: 14px 14px;`,
  };

  return patterns[subject] || `background-image:
    linear-gradient(135deg, ${color}04 25%, transparent 25%),
    linear-gradient(225deg, ${color}04 25%, transparent 25%);
  background-size: 24px 24px;`;
}

// ─── Section Divider ────────────────────────────────────────────────────────
function getSectionDivider(color: string): string {
  return `<div class="section-divider"><span>·</span><span>·</span><span>·</span></div>`;
}

// ─── Branded Header HTML ────────────────────────────────────────────────────
function getBrandedHeader(
  title: string,
  subject: Subject,
  gradeLevel: string,
  contentType: string,
  date: string,
  colors: { primary: string; secondary: string; accent: string },
  colorScheme: string
): string {
  const logoColor = colorScheme === 'grayscale' ? '#374151' : '#2D5A4A';
  const subjectLabel = (subject || 'OTHER').replace(/_/g, ' ');
  return `
    <div class="branded-header">
      <div class="header-top">
        <div class="header-brand">
          ${getOrbitLogo(20, logoColor)}
          <span class="brand-name">Orbit Learn</span>
        </div>
        <div class="header-badges">
          <span class="badge badge-subject">${escapeHtml(subjectLabel)}</span>
          ${gradeLevel ? `<span class="badge badge-grade">Grade ${escapeHtml(gradeLevel)}</span>` : ''}
        </div>
      </div>
      <h1 class="header-title">${escapeHtml(title)}</h1>
      <div class="header-meta">
        <span>${escapeHtml(contentType)}</span>
        <span class="header-meta-dot">·</span>
        <span>${escapeHtml(date)}</span>
      </div>
      <div class="header-accent-bar"></div>
    </div>
  `;
}

// ─── Name/Date Line for Student Materials ───────────────────────────────────
function getNameDateLine(): string {
  return `
    <div class="name-date-line">
      <div class="name-date-field">
        <span class="name-date-label">Name</span>
        <div class="name-date-rule"></div>
      </div>
      <div class="name-date-field name-date-short">
        <span class="name-date-label">Date</span>
        <div class="name-date-rule"></div>
      </div>
      <div class="name-date-field name-date-score">
        <span class="name-date-label">Score</span>
        <div class="name-date-rule"></div>
      </div>
    </div>
  `;
}

// ─── Puppeteer Footer Template ──────────────────────────────────────────────
function getFooterTemplate(primaryColor: string, colorScheme: string): string {
  const barColor = colorScheme === 'grayscale' ? '#9CA3AF' : primaryColor;
  return `
    <div style="width: 100%; padding: 0 0.5in; font-size: 8px; font-family: 'Outfit', -apple-system, sans-serif;">
      <div style="height: 1px; background: linear-gradient(90deg, ${barColor}40, ${barColor}, ${barColor}40); margin-bottom: 6px;"></div>
      <div style="display: flex; justify-content: space-between; align-items: center; color: #9CA3AF;">
        <span style="display: flex; align-items: center; gap: 4px;">
          <svg width="10" height="10" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" stroke="${barColor}" stroke-width="3"/><circle cx="16" cy="16" r="5" fill="${barColor}"/></svg>
          Made with Orbit Learn
        </span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    </div>
  `;
}

/**
 * Generate base CSS styles for exports — Canva-quality branded design
 */
function getBaseStyles(subject: Subject, colorScheme: 'color' | 'grayscale' = 'color'): string {
  const colors = colorScheme === 'color' ? subjectColors[subject] : {
    primary: '#374151',
    secondary: '#F3F4F6',
    accent: '#1F2937',
  };

  const paperBg = colorScheme === 'color' ? '#FEFDFB' : '#FFFFFF';
  const subjectPatternCSS = getSubjectPattern(subject, colorScheme);

  return `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Outfit:wght@400;500;600;700&display=swap');

    :root {
      --color-primary: ${colors.primary};
      --color-secondary: ${colors.secondary};
      --color-accent: ${colors.accent};
      --color-text: #1E2A3A;
      --color-text-light: #4B5563;
      --color-text-muted: #6B7280;
      --color-border: #E5E7EB;
      --color-surface: #FFFFFF;
      --color-paper: ${paperBg};
      --font-heading: 'Fraunces', Georgia, 'Times New Roman', serif;
      --font-body: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --space-xs: 4px;
      --space-sm: 8px;
      --space-md: 16px;
      --space-lg: 24px;
      --space-xl: 32px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-body);
      font-size: 11pt;
      line-height: 1.6;
      color: var(--color-text);
      background-color: var(--color-paper);
      padding: 0;
    }

    /* ── Branded Header ─────────────────────────────────────────────── */
    .branded-header {
      margin-bottom: var(--space-lg);
      padding: var(--space-md) var(--space-lg);
      position: relative;
      ${subjectPatternCSS}
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-name {
      font-family: var(--font-heading);
      font-size: 11pt;
      font-weight: 600;
      color: ${colorScheme === 'grayscale' ? '#374151' : '#2D5A4A'};
      letter-spacing: -0.02em;
    }

    .header-badges {
      display: flex;
      gap: 8px;
    }

    .header-title {
      font-family: var(--font-heading);
      font-size: 22pt;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 8px;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .header-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 10pt;
      color: var(--color-text-muted);
      margin-bottom: var(--space-md);
    }

    .header-meta-dot {
      color: var(--color-border);
    }

    .header-accent-bar {
      height: 3px;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
      border-radius: 2px;
    }

    /* ── Legacy Header (for quiz answer key, etc.) ───────────────── */
    .header {
      text-align: center;
      margin-bottom: var(--space-lg);
      padding-bottom: var(--space-md);
      border-bottom: 3px solid var(--color-primary);
    }

    .header h1 {
      font-family: var(--font-heading);
      font-size: 22pt;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }

    .header .meta {
      display: flex;
      justify-content: center;
      gap: var(--space-lg);
      font-size: 10pt;
      color: var(--color-text-muted);
    }

    .header .meta span {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    /* ── Badges ──────────────────────────────────────────────────── */
    .badge {
      display: inline-block;
      padding: 4px 14px;
      background: var(--color-secondary);
      color: var(--color-accent);
      border-radius: 20px;
      font-size: 9pt;
      font-weight: 600;
      border: 1px solid ${colors.primary}20;
      letter-spacing: 0.01em;
    }

    .badge-subject {
      font-family: var(--font-heading);
      font-weight: 600;
    }

    .badge-grade {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text-light);
    }

    /* ── Name/Date Line ──────────────────────────────────────────── */
    .name-date-line {
      display: flex;
      gap: var(--space-lg);
      margin-bottom: var(--space-lg);
      padding-bottom: var(--space-md);
      border-bottom: 1px solid var(--color-border);
    }

    .name-date-field {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .name-date-field.name-date-short { flex: 0.6; }
    .name-date-field.name-date-score { flex: 0.4; }

    .name-date-label {
      font-family: var(--font-body);
      font-weight: 500;
      color: var(--color-text-light);
      font-size: 10pt;
      white-space: nowrap;
    }

    .name-date-rule {
      flex: 1;
      border-bottom: 1.5px solid #9CA3AF;
      min-width: 40px;
    }

    /* ── Section Divider ─────────────────────────────────────────── */
    .section-divider {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin: var(--space-lg) 0;
      color: var(--color-primary);
      opacity: 0.35;
      font-size: 14pt;
      letter-spacing: 8px;
    }

    /* ── Sections ────────────────────────────────────────────────── */
    .section {
      margin-bottom: var(--space-lg);
      page-break-inside: avoid;
    }

    .section-title {
      font-family: var(--font-heading);
      font-size: 13pt;
      font-weight: 600;
      color: var(--color-primary);
      margin-bottom: 14px;
      padding: 8px 0 8px 14px;
      border-left: 4px solid var(--color-primary);
      display: flex;
      align-items: center;
      gap: 10px;
      letter-spacing: -0.01em;
    }

    .section-title .icon {
      display: inline-flex;
      flex-shrink: 0;
    }

    /* ── Objectives List ─────────────────────────────────────────── */
    .objectives-list {
      list-style: none;
      padding: 0;
      counter-reset: objectives;
    }

    .objectives-list li {
      padding: 10px 14px 10px 44px;
      margin-bottom: 8px;
      background: var(--color-secondary);
      border-radius: var(--radius-md);
      position: relative;
      color: var(--color-text);
      line-height: 1.5;
    }

    .objectives-list li::before {
      counter-increment: objectives;
      content: counter(objectives);
      position: absolute;
      left: 12px;
      top: 10px;
      width: 22px;
      height: 22px;
      background: var(--color-primary);
      color: white;
      border-radius: 50%;
      font-size: 9pt;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ── Lesson Section Cards ────────────────────────────────────── */
    .lesson-section {
      background: var(--color-paper);
      border: 1px solid var(--color-border);
      border-left: 4px solid var(--color-primary);
      border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
      padding: var(--space-md) 20px;
      margin-bottom: var(--space-md);
    }

    .lesson-section h3 {
      font-family: var(--font-heading);
      font-size: 12pt;
      font-weight: 600;
      color: var(--color-accent);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .lesson-section .duration {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: var(--font-body);
      font-size: 9pt;
      color: var(--color-text-muted);
      font-weight: 400;
      background: var(--color-secondary);
      padding: 2px 10px;
      border-radius: 12px;
    }

    .lesson-section .content {
      color: var(--color-text-light);
      margin-bottom: 12px;
      line-height: 1.7;
    }

    /* ── Activities ──────────────────────────────────────────────── */
    .activities {
      background: var(--color-secondary);
      border-radius: var(--radius-md);
      padding: 14px;
      margin-top: 10px;
    }

    .activities h4 {
      font-family: var(--font-heading);
      font-size: 10pt;
      font-weight: 600;
      color: var(--color-accent);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .activities ul {
      margin-left: 16px;
    }

    .activities li {
      margin-bottom: 6px;
      color: var(--color-text-light);
      line-height: 1.5;
    }

    /* ── Vocabulary Grid ─────────────────────────────────────────── */
    .vocabulary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .vocabulary-card {
      background: var(--color-secondary);
      border: 1px solid ${colors.primary}15;
      border-radius: var(--radius-md);
      padding: 14px;
    }

    .vocabulary-card .term {
      font-family: var(--font-heading);
      font-weight: 600;
      color: var(--color-primary);
      margin-bottom: 4px;
      font-size: 11pt;
    }

    .vocabulary-card .definition {
      font-size: 10pt;
      color: var(--color-text-light);
      line-height: 1.5;
    }

    .vocabulary-card .example {
      font-size: 9pt;
      color: var(--color-text-muted);
      font-style: italic;
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px dashed var(--color-border);
    }

    /* ── Question Cards ──────────────────────────────────────────── */
    .question-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 18px;
      margin-bottom: var(--space-md);
      page-break-inside: avoid;
      box-shadow: 0 1px 3px rgba(30,42,58,0.04);
    }

    .question-card .number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: var(--color-primary);
      color: white;
      border-radius: 50%;
      font-weight: 700;
      font-size: 10pt;
      margin-right: 10px;
      flex-shrink: 0;
    }

    .question-card .question-text {
      font-weight: 500;
      color: var(--color-text);
      margin-bottom: 12px;
      display: flex;
      align-items: flex-start;
      line-height: 1.5;
    }

    .question-card .meta-row {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      font-size: 9pt;
    }

    /* ── Options List ────────────────────────────────────────────── */
    .options-list {
      list-style: none;
      padding: 0;
      margin-top: 8px;
    }

    .options-list li {
      padding: 10px 14px;
      margin-bottom: 6px;
      background: #F9FAFB;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background 0.15s;
    }

    .options-list li.correct {
      background: #D1FAE5;
      border-color: #10B981;
    }

    .option-letter {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      background: var(--color-border);
      border-radius: 50%;
      font-weight: 700;
      font-size: 9pt;
      flex-shrink: 0;
    }

    .correct .option-letter {
      background: #10B981;
      color: white;
    }

    /* ── Answer Section ──────────────────────────────────────────── */
    .answer-section {
      margin-top: 12px;
      padding: 12px 14px;
      background: #ECFDF5;
      border-radius: var(--radius-md);
      border-left: 4px solid #10B981;
    }

    .answer-section .label {
      font-weight: 600;
      color: #047857;
      font-size: 9pt;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .answer-section .answer {
      color: #065F46;
      font-weight: 500;
    }

    .answer-section .explanation {
      margin-top: 8px;
      font-size: 10pt;
      color: var(--color-text-light);
      line-height: 1.5;
    }

    /* ── Flashcards ──────────────────────────────────────────────── */
    .flashcard {
      background: var(--color-surface);
      border: 2px solid var(--color-primary);
      border-radius: var(--radius-lg);
      padding: 20px;
      margin-bottom: var(--space-md);
      page-break-inside: avoid;
      position: relative;
    }

    .flashcard::before {
      content: attr(data-card-number);
      position: absolute;
      top: -1px;
      left: 20px;
      background: var(--color-primary);
      color: white;
      font-size: 8pt;
      font-weight: 700;
      padding: 2px 12px 4px;
      border-radius: 0 0 var(--radius-sm) var(--radius-sm);
      font-family: var(--font-body);
    }

    .flashcard .front {
      font-family: var(--font-heading);
      font-size: 12pt;
      font-weight: 600;
      color: var(--color-primary);
      padding-top: 8px;
      padding-bottom: 12px;
      margin-bottom: 12px;
      border-bottom: 1px dashed var(--color-border);
    }

    .flashcard .back {
      color: var(--color-text-light);
      line-height: 1.6;
    }

    .flashcard .hint {
      margin-top: 10px;
      font-size: 9pt;
      color: var(--color-text-muted);
      font-style: italic;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .flashcard .category {
      margin-top: 10px;
      display: inline-block;
      padding: 3px 10px;
      background: var(--color-secondary);
      color: var(--color-accent);
      border-radius: 12px;
      font-size: 8pt;
      font-weight: 500;
      border: 1px solid ${colors.primary}15;
    }

    /* ── Teacher Notes ───────────────────────────────────────────── */
    .teacher-notes {
      background: #FEF9EE;
      border: 1px solid #F5D77A;
      border-left: 4px solid #D4A853;
      border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
      padding: 18px;
      margin-top: var(--space-lg);
    }

    .teacher-notes h3 {
      font-family: var(--font-heading);
      color: #92400E;
      font-size: 12pt;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .teacher-notes .content {
      color: #78350F;
      font-size: 10pt;
      line-height: 1.6;
    }

    /* ── Summary Box ─────────────────────────────────────────────── */
    .summary-box {
      background: var(--color-secondary);
      border-radius: var(--radius-lg);
      padding: 18px;
      margin-bottom: 20px;
      border: 1px solid ${colors.primary}10;
    }

    .summary-box p {
      color: var(--color-text);
      line-height: 1.7;
    }

    /* ── Footer (in-body fallback for HTML exports) ──────────────── */
    .footer {
      margin-top: var(--space-xl);
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-border);
      text-align: center;
      font-size: 9pt;
      color: #9CA3AF;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .page-break {
      page-break-before: always;
    }

    @media print {
      body {
        padding: 0;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }

      p, li { orphans: 3; widows: 3; }

      .section {
        page-break-inside: avoid;
      }

      .question-card, .flashcard, .lesson-section {
        page-break-inside: avoid;
      }
    }
  `;
}

const WEEKLY_TEMPLATE_LABELS: Record<WeeklyTemplateType, string> = {
  WARM_UP: 'Warm-Up',
  WORKSHEET: 'Worksheet',
  ACTIVITY: 'Activity',
  HOMEWORK: 'Homework',
};

function isWeeklyTemplateType(value: string): value is WeeklyTemplateType {
  return value === 'WARM_UP' || value === 'WORKSHEET' || value === 'ACTIVITY' || value === 'HOMEWORK';
}

function normalizeWeeklyTemplateType(lessonData: LessonContent): WeeklyTemplateType | undefined {
  const raw = String(lessonData?.weeklyMaterialType || '').toUpperCase();
  return isWeeklyTemplateType(raw) ? raw : undefined;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join('\n');
  return '';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function textToHtml(value: unknown): string {
  const text = asText(value);
  if (!text) return '';
  return escapeHtml(text).replace(/\n/g, '<br />');
}

function splitLines(value: unknown): string[] {
  const source = asText(value);
  if (!source) return [];
  return source
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)])\s*/, '').trim())
    .filter(Boolean);
}

function sectionByKeywords(lessonData: LessonContent, keywords: string[]): LessonSection | undefined {
  const sections = lessonData.sections || [];
  const lowerKeywords = keywords.map((k) => k.toLowerCase());
  return sections.find((section) => {
    const title = String(section.title || '').toLowerCase();
    return lowerKeywords.some((keyword) => title.includes(keyword));
  });
}

function orderedSteps(value: unknown): string[] {
  const items = asArray(value).map(asText).filter(Boolean);
  if (items.length > 0) return items;
  return splitLines(value);
}

function generateWeeklyTemplateHTML(
  content: TeacherContent,
  lessonData: LessonContent,
  options: ExportOptions,
  templateType: WeeklyTemplateType
): string {
  const subject = (content.subject || 'OTHER') as Subject;
  const styles = getBaseStyles(subject, options.colorScheme);
  const data = asRecord(lessonData as unknown as Record<string, unknown>);
  const templateLabel = WEEKLY_TEMPLATE_LABELS[templateType];
  const summary = asText(data.summary) || asText(content.description);
  const createdDate = new Date(content.createdAt).toLocaleDateString();

  const metadataPills: string[] = [];
  const pushPill = (value: unknown) => {
    const text = asText(value);
    if (text) metadataPills.push(`<span class="badge">${escapeHtml(text)}</span>`);
  };

  switch (templateType) {
    case 'WARM_UP':
      pushPill(asText(data.duration) || '5-10 min');
      pushPill(data.focus);
      break;
    case 'WORKSHEET':
      pushPill(data.topic);
      break;
    case 'ACTIVITY':
      pushPill(data.duration);
      pushPill(data.grouping);
      break;
    case 'HOMEWORK':
      pushPill(data.estimatedTime);
      break;
  }

  const colorScheme = options.colorScheme || 'color';
  const colorsObj = colorScheme === 'color' ? subjectColors[subject] : { primary: '#374151', secondary: '#F3F4F6', accent: '#1F2937' };

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(lessonData.title || content.title)}</title>
      <style>
        ${styles}
        .weekly-shell {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 20px;
        }
        .weekly-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }
        .weekly-list {
          margin: 0;
          padding-left: 20px;
        }
        .weekly-list li {
          margin-bottom: 10px;
          line-height: 1.5;
        }
        .weekly-card {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: #F9FAFB;
          padding: 14px 16px;
          margin-bottom: 10px;
        }
        .weekly-answer {
          margin-top: 8px;
          padding: 10px 12px;
          background: #ECFDF5;
          border-left: 3px solid #10B981;
          border-radius: var(--radius-sm);
          font-size: 10pt;
          color: #065F46;
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
      </style>
    </head>
    <body>
      ${getBrandedHeader(
        lessonData.title || content.title,
        subject,
        content.gradeLevel || '',
        templateLabel,
        createdDate,
        colorsObj,
        colorScheme,
      )}
      <div class="weekly-shell">
        <div class="weekly-meta">
          ${metadataPills.join('')}
        </div>
        ${summary ? `<div class="summary-box"><p>${textToHtml(summary)}</p></div>` : ''}
  `;

  if (templateType === 'WARM_UP') {
    const instructions = asText(data.instructions) || asText(sectionByKeywords(lessonData, ['instructions', 'task'])?.content);
    const questions = asArray(data.questions);
    const fallbackQuestions = splitLines(sectionByKeywords(lessonData, ['warm-up', 'prompt', 'question'])?.content);
    html += `
      ${instructions ? `
        <div class="section">
          <h2 class="section-title"><span class="icon">${getIcon('compass', 'var(--color-primary)')}</span> Instructions</h2>
          <p>${textToHtml(instructions)}</p>
        </div>
      ` : ''}
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('question', 'var(--color-primary)')}</span> Questions</h2>
        ${questions.length > 0 ? `
          <ol class="weekly-list">
            ${questions.map((item, i) => {
              const q = asRecord(item);
              const question = asText(q.question) || asText(item);
              const answer = asText(q.answer);
              return `
                <li>
                  <div>${textToHtml(question) || `Question ${i + 1}`}</div>
                  ${options.includeAnswers && answer ? `<div class="weekly-answer"><strong>Answer:</strong> ${textToHtml(answer)}</div>` : ''}
                </li>
              `;
            }).join('')}
          </ol>
        ` : `
          ${fallbackQuestions.length > 0
            ? `<ol class="weekly-list">${fallbackQuestions.map((line) => `<li>${textToHtml(line)}</li>`).join('')}</ol>`
            : '<p>No warm-up questions provided.</p>'}
        `}
      </div>
    `;
  }

  if (templateType === 'WORKSHEET' || templateType === 'HOMEWORK') {
    const instructions = asText(data.instructions) || asText(sectionByKeywords(lessonData, ['instructions'])?.content);
    const problems = asArray(data.problems);
    const fallbackProblems = splitLines(
      sectionByKeywords(lessonData, ['practice', 'problem', 'assignment', 'questions'])?.content
    );

    html += `
      ${instructions ? `
        <div class="section">
          <h2 class="section-title"><span class="icon">${getIcon('compass', 'var(--color-primary)')}</span> Instructions</h2>
          <p>${textToHtml(instructions)}</p>
        </div>
      ` : ''}

      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('pencil', 'var(--color-primary)')}</span> Problems</h2>
        ${problems.length > 0 ? `
          ${problems.map((item, i) => {
            const p = asRecord(item);
            const number = asText(p.number) || String(i + 1);
            const question = asText(p.question) || asText(item);
            const difficulty = asText(p.difficulty);
            const answer = asText(p.answer);
            return `
              <div class="weekly-card">
                <div style="display:flex; justify-content:space-between; gap:8px; margin-bottom:6px;">
                  <strong>${escapeHtml(number)}.</strong>
                  ${difficulty ? `<span class="badge">${escapeHtml(difficulty)}</span>` : ''}
                </div>
                <div>${textToHtml(question)}</div>
                ${options.includeAnswers && answer ? `<div class="weekly-answer"><strong>Answer:</strong> ${textToHtml(answer)}</div>` : ''}
              </div>
            `;
          }).join('')}
        ` : `
          ${fallbackProblems.length > 0
            ? `<ol class="weekly-list">${fallbackProblems.map((line) => `<li>${textToHtml(line)}</li>`).join('')}</ol>`
            : '<p>No problems provided.</p>'}
        `}
      </div>
    `;

    if (templateType === 'HOMEWORK') {
      const parentNote = asText(data.parentNote) || asText(sectionByKeywords(lessonData, ['parent', 'family'])?.content);
      if (parentNote) {
        html += `
          <div class="section">
            <h2 class="section-title"><span class="icon">${getIcon('home', 'var(--color-primary)')}</span> Parent Note</h2>
            <p>${textToHtml(parentNote)}</p>
          </div>
        `;
      }
    }
  }

  if (templateType === 'ACTIVITY') {
    const objective = asText(sectionByKeywords(lessonData, ['overview', 'objective'])?.content);
    const materials = asArray(data.materials).map(asText).filter(Boolean);
    const materialFallback = splitLines(sectionByKeywords(lessonData, ['materials'])?.content);
    const instructions = orderedSteps(data.instructions);
    const instructionFallback = orderedSteps(sectionByKeywords(lessonData, ['procedure', 'steps', 'instructions'])?.content);
    const extensions = asText(data.extensions)
      || asText(sectionByKeywords(lessonData, ['extension', 'differentiation'])?.content);

    html += `
      ${objective ? `
        <div class="section">
          <h2 class="section-title"><span class="icon">${getIcon('target', 'var(--color-primary)')}</span> Activity Overview</h2>
          <p>${textToHtml(objective)}</p>
        </div>
      ` : ''}
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('tools', 'var(--color-primary)')}</span> Materials</h2>
        ${(materials.length > 0 || materialFallback.length > 0)
          ? `<ul class="weekly-list">${(materials.length > 0 ? materials : materialFallback).map((line) => `<li>${textToHtml(line)}</li>`).join('')}</ul>`
          : '<p>No materials listed.</p>'}
      </div>
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('steps', 'var(--color-primary)')}</span> Step-by-Step Instructions</h2>
        ${(instructions.length > 0 || instructionFallback.length > 0)
          ? `<ol class="weekly-list">${(instructions.length > 0 ? instructions : instructionFallback).map((line) => `<li>${textToHtml(line)}</li>`).join('')}</ol>`
          : '<p>No instructions provided.</p>'}
      </div>
      ${extensions ? `
        <div class="section">
          <h2 class="section-title"><span class="icon">${getIcon('rocket', 'var(--color-primary)')}</span> Extensions</h2>
          <p>${textToHtml(extensions)}</p>
        </div>
      ` : ''}
    `;
  }

  if (options.includeTeacherNotes && lessonData.teacherNotes) {
    html += `
      <div class="teacher-notes">
        <h3>${getIcon('notepad', '#92400E')} Teacher Notes</h3>
        <div class="content">${textToHtml(lessonData.teacherNotes)}</div>
      </div>
    `;
  }

  html += `
      </div>
      <div class="footer">
        ${getOrbitLogo(12, '#9CA3AF')} Made with Orbit Learn · ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Generate HTML for lesson content
 */
function generateLessonHTML(
  content: TeacherContent,
  lessonData: LessonContent,
  options: ExportOptions
): string {
  const weeklyTemplateType = normalizeWeeklyTemplateType(lessonData);
  if (weeklyTemplateType) {
    return generateWeeklyTemplateHTML(content, lessonData, options, weeklyTemplateType);
  }

  const subject = (content.subject || 'OTHER') as Subject;
  const styles = getBaseStyles(subject, options.colorScheme);
  const cs = options.colorScheme || 'color';
  const cols = cs === 'color' ? subjectColors[subject] : { primary: '#374151', secondary: '#F3F4F6', accent: '#1F2937' };

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(lessonData.title || content.title)}</title>
      <style>${styles}</style>
    </head>
    <body>
      ${getBrandedHeader(
        lessonData.title || content.title,
        subject,
        content.gradeLevel || '',
        'Lesson Plan',
        new Date(content.createdAt).toLocaleDateString(),
        cols,
        cs,
      )}
  `;

  // Summary
  if (lessonData.summary) {
    html += `
      <div class="summary-box">
        <p>${escapeHtml(lessonData.summary)}</p>
      </div>
    `;
  }

  // Learning Objectives
  if (lessonData.objectives && lessonData.objectives.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('target', 'var(--color-primary)')}</span> Learning Objectives</h2>
        <ul class="objectives-list">
          ${lessonData.objectives.map(obj => `<li>${obj}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Lesson Sections
  if (lessonData.sections && lessonData.sections.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('book', 'var(--color-primary)')}</span> Lesson Content</h2>
        ${lessonData.sections.map((section, i) => `
          <div class="lesson-section">
            <h3>
              ${i + 1}. ${section.title}
              ${section.duration ? `<span class="duration">${getIcon('clock', 'var(--color-text-muted)')} ${section.duration} min</span>` : ''}
            </h3>
            <div class="content">${section.content}</div>
            ${section.activities && section.activities.length > 0 ? `
              <div class="activities">
                <h4>${getIcon('list', 'var(--color-accent)')} Activities</h4>
                ${section.activities.map(act => {
                  if (typeof act === 'string') {
                    return `<ul><li>${act}</li></ul>`;
                  }
                  // Handle activity object format from full lessons
                  const actObj = act as ActivityObject;
                  return `
                    <div class="activity-item" style="margin-bottom: 12px; padding: 12px; background: white; border-radius: 8px;">
                      ${actObj.name ? `<div style="font-weight: 600; margin-bottom: 4px;">${actObj.name}</div>` : ''}
                      ${actObj.description ? `<div style="margin-bottom: 8px;">${actObj.description}</div>` : ''}
                      ${actObj.duration ? `<div style="font-size: 9pt; color: #6B7280; display: flex; align-items: center; gap: 4px;">${getIcon('clock', '#6B7280')} ${actObj.duration} min</div>` : ''}
                      ${actObj.materials && actObj.materials.length > 0 ? `
                        <div style="margin-top: 8px;">
                          <div style="font-size: 9pt; font-weight: 500; color: #4B5563;">Materials:</div>
                          <ul style="margin: 4px 0 0 16px; font-size: 10pt;">
                            ${actObj.materials.map(m => `<li>${m}</li>`).join('')}
                          </ul>
                        </div>
                      ` : ''}
                      ${actObj.discussionQuestions && actObj.discussionQuestions.length > 0 ? `
                        <div style="margin-top: 8px;">
                          <div style="font-size: 9pt; font-weight: 500; color: #4B5563;">Discussion Questions:</div>
                          <ul style="margin: 4px 0 0 16px; font-size: 10pt;">
                            ${actObj.discussionQuestions.map(q => `<li>${q}</li>`).join('')}
                          </ul>
                        </div>
                      ` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  // Vocabulary
  if (lessonData.vocabulary && lessonData.vocabulary.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('star', 'var(--color-primary)')}</span> Vocabulary</h2>
        <div class="vocabulary-grid">
          ${lessonData.vocabulary.map(vocab => `
            <div class="vocabulary-card">
              <div class="term">${vocab.term}</div>
              <div class="definition">${vocab.definition}</div>
              ${vocab.example ? `<div class="example">Example: ${vocab.example}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Assessment Questions
  if (lessonData.assessment?.questions && lessonData.assessment.questions.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('check', 'var(--color-primary)')}</span> Assessment Questions</h2>
        ${lessonData.assessment.questions.map((q, i) => `
          <div class="question-card">
            <div class="question-text">
              <span class="number">${i + 1}</span>
              ${q.question}
            </div>
            ${q.options && q.options.length > 0 ? `
              <ul class="options-list">
                ${q.options.map((opt, j) => `
                  <li class="${options.includeAnswers && opt === q.correctAnswer ? 'correct' : ''}">
                    <span class="option-letter">${String.fromCharCode(65 + j)}</span>
                    ${opt}
                  </li>
                `).join('')}
              </ul>
            ` : ''}
            ${options.includeAnswers ? `
              <div class="answer-section">
                <div class="label">Answer:</div>
                <div class="answer">${q.correctAnswer}</div>
                ${q.explanation ? `<div class="explanation">${q.explanation}</div>` : ''}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  // Practice Exercises (for full lessons)
  if (lessonData.practiceExercises && lessonData.practiceExercises.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('pencil', 'var(--color-primary)')}</span> Practice Exercises</h2>
        ${lessonData.practiceExercises.map((ex, i) => `
          <div class="question-card">
            <div class="question-text">
              <span class="number">${i + 1}</span>
              ${ex.question}
            </div>
            ${ex.hint ? `<div style="font-size: 10pt; color: #6B7280; margin-top: 8px;">${getIcon('lightbulb', '#6B7280')} Hint: ${ex.hint}</div>` : ''}
            ${options.includeAnswers && ex.answer ? `
              <div class="answer-section">
                <div class="label">Answer:</div>
                <div class="answer">${ex.answer}</div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  // Summary Points (for full lessons)
  if (lessonData.summaryPoints && lessonData.summaryPoints.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('pin', 'var(--color-primary)')}</span> Key Takeaways</h2>
        <ul class="objectives-list">
          ${lessonData.summaryPoints.map(point => `<li>${point}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Review Questions (for full lessons)
  if (lessonData.reviewQuestions && lessonData.reviewQuestions.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('question', 'var(--color-primary)')}</span> Review Questions</h2>
        <ol style="padding-left: 20px;">
          ${lessonData.reviewQuestions.map(q => `<li style="margin-bottom: 12px;">${q}</li>`).join('')}
        </ol>
      </div>
    `;
  }

  // Prerequisites and Next Steps (for full lessons)
  if (lessonData.prerequisites || lessonData.nextSteps) {
    html += `
      <div class="section" style="background: #F9FAFB; border-radius: 12px; padding: 16px; margin-top: 20px;">
        ${lessonData.prerequisites && lessonData.prerequisites.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h3 style="font-size: 11pt; color: #4B5563; margin-bottom: 8px;">Prerequisites</h3>
            <ul style="margin-left: 16px; color: #6B7280; font-size: 10pt;">
              ${lessonData.prerequisites.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${lessonData.nextSteps ? `
          <div>
            <h3 style="font-size: 11pt; color: #4B5563; margin-bottom: 8px;">What's Next</h3>
            <p style="color: #6B7280; font-size: 10pt;">${lessonData.nextSteps}</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Additional Resources (for full lessons)
  if (lessonData.additionalResources && lessonData.additionalResources.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('link', 'var(--color-primary)')}</span> Additional Resources</h2>
        <ul style="padding-left: 20px;">
          ${lessonData.additionalResources.map(r => `<li style="margin-bottom: 8px;">${r}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Teacher Notes
  if (options.includeTeacherNotes && lessonData.teacherNotes) {
    html += `
      <div class="teacher-notes">
        <h3>${getIcon('notepad', '#92400E')} Teacher Notes</h3>
        <div class="content">${escapeHtml(lessonData.teacherNotes)}</div>
      </div>
    `;
  }

  // Include Quiz Content if present on the lesson
  const quizContent = content.quizContent as unknown as QuizContent | null;
  if (quizContent && quizContent.questions && quizContent.questions.length > 0) {
    html += `
      <div class="section page-break">
        <h2 class="section-title"><span class="icon">${getIcon('quiz', 'var(--color-primary)')}</span> Quiz (${quizContent.questions.length} questions)</h2>
        ${quizContent.questions.map((q, i) => `
          <div class="question-card">
            <div class="question-text">
              <span class="number">${i + 1}</span>
              ${q.question}
            </div>
            ${q.options && q.options.length > 0 ? `
              <ul class="options-list">
                ${q.options.map((opt, j) => `
                  <li class="${options.includeAnswers && opt === q.correctAnswer ? 'correct' : ''}">
                    <span class="option-letter">${String.fromCharCode(65 + j)}</span>
                    ${opt}
                  </li>
                `).join('')}
              </ul>
            ` : ''}
            ${options.includeAnswers ? `
              <div class="answer-section">
                <div class="label">Answer:</div>
                <div class="answer">${q.correctAnswer}</div>
                ${q.explanation ? `<div class="explanation">${q.explanation}</div>` : ''}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  // Include Flashcard Content if present on the lesson
  const flashcardContent = content.flashcardContent as unknown as FlashcardContent | null;
  if (flashcardContent && flashcardContent.cards && flashcardContent.cards.length > 0) {
    html += `
      <div class="section page-break">
        <h2 class="section-title"><span class="icon">${getIcon('cards', 'var(--color-primary)')}</span> Flashcards (${flashcardContent.cards.length} cards)</h2>
        ${flashcardContent.cards.map((card, i) => `
          <div class="flashcard" data-card-number="Card ${i + 1}">
            <div class="front">
              ${card.front}
            </div>
            <div class="back">${card.back}</div>
            ${card.hint ? `<div class="hint">${getIcon('lightbulb', '#6B7280')} Hint: ${card.hint}</div>` : ''}
            ${card.category ? `<span class="category">${card.category}</span>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  html += `
      <div class="footer">
        ${getOrbitLogo(12, '#9CA3AF')} Made with Orbit Learn · ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Generate HTML for quiz content
 */
function generateQuizHTML(
  content: TeacherContent,
  quizData: QuizContent,
  options: ExportOptions
): string {
  const subject = (content.subject || 'OTHER') as Subject;
  const styles = getBaseStyles(subject, options.colorScheme);
  const cs = options.colorScheme || 'color';
  const cols = cs === 'color' ? subjectColors[subject] : { primary: '#374151', secondary: '#F3F4F6', accent: '#1F2937' };

  // Determine if answers should be shown inline or on a separate answer key page
  const isAnswerKeyOnly = options.answerKeyOnly === true;
  const showInlineAnswers = !isAnswerKeyOnly && options.includeAnswers && !options.separateAnswerKey;
  const showAnswerKey = isAnswerKeyOnly || (options.includeAnswers && options.separateAnswerKey);

  const metaParts: string[] = [];
  if (quizData.totalPoints) metaParts.push(`Total Points: ${quizData.totalPoints}`);
  if (quizData.estimatedTime) metaParts.push(`${quizData.estimatedTime} min`);

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(quizData.title || content.title)} - Quiz</title>
      <style>
        ${styles}

        /* Answer key styles */
        .answer-key-header {
          text-align: center;
          margin-bottom: var(--space-lg);
          padding: var(--space-md);
          background: #ECFDF5;
          border-radius: var(--radius-lg);
          border: 2px solid #10B981;
        }

        .answer-key-header h1 {
          font-family: var(--font-heading);
          font-size: 18pt;
          font-weight: 700;
          color: #047857;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }

        .answer-key-header .subtitle {
          font-size: 10pt;
          color: var(--color-text-muted);
        }

        .answer-key-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .answer-key-item {
          background: #F9FAFB;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .answer-key-item:nth-child(odd) {
          background: #FAFAFA;
        }

        .answer-key-item .q-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 28px;
          background: #10B981;
          color: white;
          border-radius: 50%;
          font-weight: 700;
          font-size: 10pt;
          flex-shrink: 0;
        }

        .answer-key-item .answer-content {
          flex: 1;
        }

        .answer-key-item .answer-text {
          font-weight: 600;
          color: #065F46;
          margin-bottom: 4px;
        }

        .answer-key-item .explanation-text {
          font-size: 9pt;
          color: var(--color-text-muted);
          line-height: 1.4;
        }
      </style>
    </head>
    <body>
      ${getBrandedHeader(
        quizData.title || content.title,
        subject,
        content.gradeLevel || '',
        `Quiz · ${quizData.questions.length} questions${metaParts.length ? ' · ' + metaParts.join(' · ') : ''}`,
        new Date(content.createdAt).toLocaleDateString(),
        cols,
        cs,
      )}

      ${!isAnswerKeyOnly && showAnswerKey ? getNameDateLine() : ''}

      ${!isAnswerKeyOnly ? `
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('quiz', 'var(--color-primary)')}</span> Questions</h2>
        ${quizData.questions.map((q, i) => `
          <div class="question-card">
            <div class="question-text">
              <span class="number">${i + 1}</span>
              ${q.question}
            </div>
            <div class="meta-row">
              <span class="badge">${q.type.replace('_', ' ')}</span>
              ${q.difficulty ? `<span class="badge">${q.difficulty}</span>` : ''}
              ${q.points ? `<span>${q.points} pts</span>` : ''}
            </div>
            ${q.options && q.options.length > 0 ? `
              <ul class="options-list">
                ${q.options.map((opt, j) => `
                  <li class="${showInlineAnswers && opt === q.correctAnswer ? 'correct' : ''}">
                    <span class="option-letter">${String.fromCharCode(65 + j)}</span>
                    ${opt}
                  </li>
                `).join('')}
              </ul>
            ` : ''}
            ${showInlineAnswers ? `
              <div class="answer-section">
                <div class="label">Correct Answer:</div>
                <div class="answer">${q.correctAnswer}</div>
                ${q.explanation ? `<div class="explanation">${q.explanation}</div>` : ''}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${showAnswerKey ? `
        ${!isAnswerKeyOnly ? '<div class="page-break"></div>' : ''}
        <div class="answer-key-header">
          <h1>${getIcon('check', '#047857')} Answer Key</h1>
          <div class="subtitle">${escapeHtml(quizData.title || content.title)}</div>
        </div>

        <div class="answer-key-grid">
          ${quizData.questions.map((q, i) => `
            <div class="answer-key-item">
              <span class="q-number">${i + 1}</span>
              <div class="answer-content">
                <div class="answer-text">${escapeHtml(q.correctAnswer)}</div>
                ${q.explanation ? `<div class="explanation-text">${escapeHtml(q.explanation)}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="footer">
        ${getOrbitLogo(12, '#9CA3AF')} Made with Orbit Learn · ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Generate HTML for flashcard content
 */
function generateFlashcardHTML(
  content: TeacherContent,
  flashcardData: FlashcardContent,
  options: ExportOptions
): string {
  const subject = (content.subject || 'OTHER') as Subject;
  const styles = getBaseStyles(subject, options.colorScheme);
  const cs = options.colorScheme || 'color';
  const cols = cs === 'color' ? subjectColors[subject] : { primary: '#374151', secondary: '#F3F4F6', accent: '#1F2937' };

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(flashcardData.title || content.title)} - Flashcards</title>
      <style>${styles}</style>
    </head>
    <body>
      ${getBrandedHeader(
        flashcardData.title || content.title,
        subject,
        content.gradeLevel || '',
        'Flashcards · ' + flashcardData.cards.length + ' cards',
        new Date(content.createdAt).toLocaleDateString(),
        cols,
        cs,
      )}

      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('cards', 'var(--color-primary)')}</span> Flashcards</h2>
        ${flashcardData.cards.map((card, i) => `
          <div class="flashcard" data-card-number="Card ${i + 1}">
            <div class="front">
              ${escapeHtml(card.front)}
            </div>
            <div class="back">${escapeHtml(card.back)}</div>
            ${card.hint ? `<div class="hint">${getIcon('lightbulb', '#6B7280')} Hint: ${escapeHtml(card.hint)}</div>` : ''}
            ${card.category ? `<span class="category">${escapeHtml(card.category)}</span>` : ''}
          </div>
        `).join('')}
      </div>

      <div class="footer">
        ${getOrbitLogo(12, '#9CA3AF')} Made with Orbit Learn · ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Generate HTML for study guide content
 */
function generateStudyGuideHTML(
  content: TeacherContent,
  guideData: StudyGuideContent,
  options: ExportOptions
): string {
  const subject = (content.subject || 'OTHER') as Subject;
  const styles = getBaseStyles(subject, options.colorScheme);
  const cs = options.colorScheme || 'color';
  const cols = cs === 'color' ? subjectColors[subject] : { primary: '#374151', secondary: '#F3F4F6', accent: '#1F2937' };

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${escapeHtml(guideData.title || content.title)} - Study Guide</title>
      <style>${styles}</style>
    </head>
    <body>
      ${getBrandedHeader(
        guideData.title || content.title,
        subject,
        content.gradeLevel || '',
        'Study Guide',
        new Date(content.createdAt).toLocaleDateString(),
        cols,
        cs,
      )}
  `;

  // Summary
  if (guideData.summary) {
    html += `
      <div class="summary-box">
        <p>${escapeHtml(guideData.summary)}</p>
      </div>
    `;
  }

  // Outline
  if (guideData.outline && guideData.outline.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('list', 'var(--color-primary)')}</span> Outline</h2>
        ${guideData.outline.map((section, i) => `
          <div class="lesson-section">
            <h3>${i + 1}. ${escapeHtml(section.section)}</h3>
            <ul>
              ${section.points.map(point => `<li>${escapeHtml(point)}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Key Terms
  if (guideData.keyTerms && guideData.keyTerms.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('star', 'var(--color-primary)')}</span> Key Terms</h2>
        <div class="vocabulary-grid">
          ${guideData.keyTerms.map(term => `
            <div class="vocabulary-card">
              <div class="term">${escapeHtml(term.term)}</div>
              <div class="definition">${escapeHtml(term.definition)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Review Questions
  if (guideData.reviewQuestions && guideData.reviewQuestions.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title"><span class="icon">${getIcon('question', 'var(--color-primary)')}</span> Review Questions</h2>
        <ol>
          ${guideData.reviewQuestions.map(q => `<li style="margin-bottom: 12px;">${escapeHtml(q)}</li>`).join('')}
        </ol>
      </div>
    `;
  }

  html += `
      <div class="footer">
        ${getOrbitLogo(12, '#9CA3AF')} Made with Orbit Learn · ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Main export function - generates HTML or PDF from TeacherContent
 */
export async function exportContent(
  content: TeacherContent,
  options: ExportOptions = {}
): Promise<{ data: Buffer | string; mimeType: string; filename: string }> {
  const opts: ExportOptions = {
    format: options.format ?? 'pdf',
    includeAnswers: options.includeAnswers ?? true,
    includeTeacherNotes: options.includeTeacherNotes ?? true,
    paperSize: options.paperSize ?? 'letter',
    colorScheme: options.colorScheme ?? 'color',
    separateAnswerKey: options.separateAnswerKey ?? false,
    answerKeyOnly: options.answerKeyOnly ?? false,
  };

  let html: string;
  let filename: string;
  const contentType = content.contentType;
  // Clean title for filename: replace non-alphanumeric with spaces, collapse multiple spaces, trim
  const cleanTitle = content.title
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 50);

  // Generate HTML based on content type
  switch (contentType) {
    case 'LESSON':
    case 'WORKSHEET':
      const lessonData = content.lessonContent as unknown as LessonContent;
      html = generateLessonHTML(content, lessonData || { title: content.title }, opts);
      filename = `${cleanTitle} - Orbit Learn`;
      break;

    case 'QUIZ':
      const quizData = content.quizContent as unknown as QuizContent;
      html = generateQuizHTML(content, quizData || { title: content.title, questions: [] }, opts);
      filename = opts.answerKeyOnly
        ? `${cleanTitle} - Answer Key - Orbit Learn`
        : `${cleanTitle} - Orbit Learn`;
      break;

    case 'FLASHCARD_DECK':
      const flashcardData = content.flashcardContent as unknown as FlashcardContent;
      html = generateFlashcardHTML(content, flashcardData || { title: content.title, cards: [] }, opts);
      filename = `${cleanTitle} - Orbit Learn`;
      break;

    case 'STUDY_GUIDE':
      const guideData = content.lessonContent as unknown as StudyGuideContent;
      html = generateStudyGuideHTML(content, guideData || { title: content.title }, opts);
      filename = `${cleanTitle} - Orbit Learn`;
      break;

    default:
      // Default to lesson format
      const defaultData = content.lessonContent as unknown as LessonContent;
      html = generateLessonHTML(content, defaultData || { title: content.title }, opts);
      filename = `${cleanTitle} - Orbit Learn`;
  }

  // Return HTML if requested
  if (opts.format === 'html') {
    return {
      data: html,
      mimeType: 'text/html',
      filename: `${filename}.html`,
    };
  }

  // Generate PDF using Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const subject = (content.subject || 'OTHER') as Subject;
  const pdfColors = (opts.colorScheme === 'color') ? subjectColors[subject] : { primary: '#374151', secondary: '#F3F4F6', accent: '#1F2937' };

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: opts.paperSize === 'a4' ? 'A4' : 'Letter',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: getFooterTemplate(pdfColors.primary, opts.colorScheme || 'color'),
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.75in',
        left: '0.5in',
      },
    });

    return {
      data: Buffer.from(pdfBuffer),
      mimeType: 'application/pdf',
      filename: `${filename}.pdf`,
    };
  } finally {
    await browser.close();
  }
}

/**
 * Export multiple content items as a single PDF
 */
export async function exportMultipleContent(
  contents: TeacherContent[],
  options: ExportOptions = { format: 'pdf' }
): Promise<{ data: Buffer; mimeType: string; filename: string }> {
  // Generate HTML for each content item
  const htmlParts: string[] = [];

  for (const content of contents) {
    const result = await exportContent(content, { ...options, format: 'html' });
    // Extract body content only (strip html/head tags)
    const bodyMatch = (result.data as string).match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      htmlParts.push(bodyMatch[1]);
    }
  }

  // Combine into single HTML
  const combinedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Content Export</title>
      <style>${getBaseStyles('OTHER', options.colorScheme)}</style>
    </head>
    <body>
      ${htmlParts.join('<div class="page-break"></div>')}
    </body>
    </html>
  `;

  // Generate PDF
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(combinedHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: options.paperSize === 'a4' ? 'A4' : 'Letter',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: getFooterTemplate('#6B7280', options.colorScheme || 'color'),
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.75in',
        left: '0.5in',
      },
    });

    return {
      data: Buffer.from(pdfBuffer),
      mimeType: 'application/pdf',
      filename: `Orbit_Learn_Export_${new Date().toISOString().split('T')[0]}.pdf`,
    };
  } finally {
    await browser.close();
  }
}

export default {
  exportContent,
  exportMultipleContent,
};
