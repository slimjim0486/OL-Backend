/**
 * Send Lesson Recommendation Emails to Onboarded Teachers
 *
 * Queries the last N teachers who completed onboarding (have grade + subject data),
 * generates personalized lesson recommendations from a static topic map,
 * produces subject-matched sample lesson PDFs via Puppeteer, and sends
 * Chalk-branded Resend emails with the relevant PDF attached.
 *
 * Usage:
 *   npx tsx backend/scripts/sendLessonRecommendationEmails.ts               # Send to 50 teachers
 *   npx tsx backend/scripts/sendLessonRecommendationEmails.ts --dry-run     # Preview only
 *   npx tsx backend/scripts/sendLessonRecommendationEmails.ts --limit 5     # Override count
 *   npx tsx backend/scripts/sendLessonRecommendationEmails.ts --skip-pdf    # Skip PDF attachment
 */

import { PrismaClient, Subject } from '@prisma/client';
import { Resend } from 'resend';
import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'support@orbitlearn.app';
// Always use production URL for email links/images (local FRONTEND_URL is localhost)
const FRONTEND_URL = 'https://orbitlearn.app';

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SKIP_PDF = args.includes('--skip-pdf');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : 50;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type GradeBand = 'K-2' | '3-5' | '6-8';

interface LessonRec {
  title: string;
  description: string;
  icon: string;
}

interface SubjectRecMap {
  'K-2': LessonRec[];
  '3-5': LessonRec[];
  '6-8': LessonRec[];
}

interface SamplePdfDef {
  key: string;
  subjects: Subject[];
  title: string;
  grade: string;
  objectives: string[];
  sections: { title: string; duration: string; content: string }[];
  vocabulary: string[];
  assessment: string;
}

// ---------------------------------------------------------------------------
// Grade band helper
// ---------------------------------------------------------------------------
function parseGradeBand(gradesTaught: string[]): GradeBand {
  if (!gradesTaught.length) return '3-5';
  const first = gradesTaught[0].toLowerCase();
  if (first.includes('k') || first.includes('1st') || first.includes('2nd') || first === '1' || first === '2') return 'K-2';
  if (first.includes('6') || first.includes('7') || first.includes('8') || first.includes('9')
    || first.includes('year 7') || first.includes('year 8') || first.includes('year 9')
    || first.includes('10') || first.includes('11') || first.includes('12')) return '6-8';
  return '3-5';
}

function formatSubject(subject: Subject): string {
  return subject
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatGradeBand(band: GradeBand): string {
  switch (band) {
    case 'K-2': return 'K-2nd Grade';
    case '3-5': return '3rd-5th Grade';
    case '6-8': return '6th-8th Grade';
  }
}

// ---------------------------------------------------------------------------
// Static lesson recommendation map
// ---------------------------------------------------------------------------
const RECOMMENDATIONS: Record<string, SubjectRecMap> = {
  MATH: {
    'K-2': [
      { title: 'Number Bonds to 20', description: 'Interactive activities exploring part-whole relationships with manipulatives and games.', icon: '🔢' },
      { title: 'Shape Detectives', description: 'A hands-on geometry hunt where students find and classify 2D and 3D shapes in the classroom.', icon: '🔷' },
      { title: 'Measurement with Non-Standard Units', description: 'Students measure classroom objects using paperclips, cubes, and their own feet.', icon: '📏' },
      { title: 'Addition Strategies Toolbox', description: 'Teach counting on, doubles, and making ten with visual models and partner practice.', icon: '➕' },
    ],
    '3-5': [
      { title: 'Multiplication Strategies: Arrays & Equal Groups', description: 'Build conceptual understanding of multiplication through visual models before algorithms.', icon: '✖️' },
      { title: 'Fraction Number Line Adventures', description: 'Place, compare, and order fractions on number lines with real-world contexts.', icon: '📐' },
      { title: 'Multi-Step Word Problem Workshop', description: 'A structured approach to breaking down and solving complex word problems.', icon: '🧩' },
      { title: 'Area & Perimeter Design Challenge', description: 'Students design dream rooms using grid paper to explore area and perimeter.', icon: '📊' },
    ],
    '6-8': [
      { title: 'Ratio Tables & Proportional Reasoning', description: 'Real-world ratio problems using recipes, maps, and scale drawings.', icon: '⚖️' },
      { title: 'Integer Operations Exploration', description: 'Use number lines and chip models to make sense of adding and subtracting negatives.', icon: '🔢' },
      { title: 'Expressions & Equations Escape Room', description: 'Solve multi-step equations to unlock clues in this engaging classroom activity.', icon: '🔓' },
      { title: 'Data Analysis & Statistical Thinking', description: 'Collect, display, and interpret real classroom data using mean, median, and mode.', icon: '📈' },
    ],
  },
  SCIENCE: {
    'K-2': [
      { title: 'Life Cycles: From Seed to Plant', description: 'Observe and record plant growth stages with a classroom garden journal.', icon: '🌱' },
      { title: 'Push, Pull, and Motion', description: 'Explore forces through ramps, balls, and simple machines.', icon: '🏗️' },
      { title: 'Weather Watchers', description: 'Track daily weather patterns and learn to read simple weather instruments.', icon: '🌤️' },
      { title: 'Animal Habitats Around the World', description: 'Match animals to their habitats and discover adaptations.', icon: '🦁' },
    ],
    '3-5': [
      { title: 'Ecosystems & Food Webs', description: 'Build food webs, explore producer-consumer relationships, and model energy flow.', icon: '🕸️' },
      { title: 'States of Matter Investigation', description: 'Hands-on experiments with solids, liquids, and gases using everyday materials.', icon: '🧪' },
      { title: 'Earth\'s Changing Surface', description: 'Model weathering, erosion, and deposition with sand, water, and wind.', icon: '🌍' },
      { title: 'Simple Machines Engineering Challenge', description: 'Design and build devices using levers, pulleys, and inclined planes.', icon: '⚙️' },
    ],
    '6-8': [
      { title: 'Cell Structure & Function', description: 'Compare plant and animal cells using microscopes and 3D models.', icon: '🔬' },
      { title: 'Chemical Reactions Lab', description: 'Identify evidence of chemical change through safe, engaging experiments.', icon: '⚗️' },
      { title: 'Forces & Motion: Newton\'s Laws', description: 'Investigate all three laws with hands-on labs and real-world applications.', icon: '🚀' },
      { title: 'Genetics & Heredity', description: 'Model inheritance patterns using Punnett squares and trait surveys.', icon: '🧬' },
    ],
  },
  ENGLISH: {
    'K-2': [
      { title: 'Sight Word Superheroes', description: 'Multi-sensory activities for mastering high-frequency words.', icon: '📖' },
      { title: 'Story Retelling with Puppets', description: 'Build comprehension through creative retelling of favorite read-alouds.', icon: '🎭' },
      { title: 'Phonics Patterns: Word Families', description: 'Sort, build, and read words in common word families (-at, -ig, -op).', icon: '🔤' },
      { title: 'Personal Narrative: My Best Day', description: 'Guide young writers through planning and writing a personal story.', icon: '✏️' },
    ],
    '3-5': [
      { title: 'Narrative Writing Workshop', description: 'Craft engaging stories with strong leads, dialogue, and descriptive details.', icon: '📝' },
      { title: 'Reading Comprehension Strategies', description: 'Teach predicting, questioning, and summarizing with mentor texts.', icon: '📚' },
      { title: 'Poetry Exploration & Creation', description: 'Explore figurative language through reading and writing original poems.', icon: '🎨' },
      { title: 'Research Report Mini-Unit', description: 'Guide students through choosing a topic, note-taking, and organized writing.', icon: '🔍' },
    ],
    '6-8': [
      { title: 'Argumentative Essay Boot Camp', description: 'Build strong claims, evidence, and counterarguments step by step.', icon: '⚔️' },
      { title: 'Novel Study Discussion Circles', description: 'Student-led literature circles with roles and accountable talk stems.', icon: '💬' },
      { title: 'Grammar in Context', description: 'Teach clauses, sentence variety, and conventions through real writing.', icon: '📋' },
      { title: 'Digital Literacy & Media Analysis', description: 'Evaluate sources, identify bias, and craft informed responses.', icon: '🖥️' },
    ],
  },
  SOCIAL_STUDIES: {
    'K-2': [
      { title: 'Community Helpers & Civic Roles', description: 'Explore the roles people play in keeping communities safe and running.', icon: '🏘️' },
      { title: 'Maps & Globes: Our World', description: 'Introduction to maps, continents, and oceans with hands-on activities.', icon: '🗺️' },
      { title: 'Then and Now: How Life Has Changed', description: 'Compare daily life today with life long ago through artifacts and stories.', icon: '⏳' },
      { title: 'Rules, Rights, and Responsibilities', description: 'Build understanding of classroom and community rules through role-play.', icon: '📜' },
    ],
    '3-5': [
      { title: 'Regions of the United States', description: 'Explore geography, culture, and economy across U.S. regions with projects.', icon: '🇺🇸' },
      { title: 'Indigenous Peoples & Cultural Heritage', description: 'Respectful exploration of diverse Indigenous cultures and contributions.', icon: '🪶' },
      { title: 'Government & Citizenship', description: 'Understand branches of government and what it means to be an active citizen.', icon: '🏛️' },
      { title: 'Economics: Wants, Needs, and Trade', description: 'Introduce supply, demand, and trade through simulation activities.', icon: '💱' },
    ],
    '6-8': [
      { title: 'Ancient Civilizations Comparison', description: 'Compare governance, culture, and innovation across ancient societies.', icon: '🏺' },
      { title: 'Civil Rights Movement Deep Dive', description: 'Primary source analysis and discussion of the struggle for equality.', icon: '✊' },
      { title: 'Geography & Human Impact', description: 'Explore how geography shapes settlement, resources, and conflict.', icon: '🌎' },
      { title: 'Current Events & Critical Thinking', description: 'Analyze current events using multiple perspectives and credible sources.', icon: '📰' },
    ],
  },
  GENERAL: {
    'K-2': [
      { title: 'Cross-Curricular Centers Rotation', description: 'Engaging learning stations that blend reading, math, science, and art.', icon: '🎯' },
      { title: 'STEAM Challenge: Build a Bridge', description: 'Design and build bridges using simple materials, then test their strength.', icon: '🌉' },
      { title: 'Mindfulness & Social-Emotional Check-Ins', description: 'Daily activities to build self-awareness and emotional regulation.', icon: '🧘' },
      { title: 'Show & Share: Oral Presentation Skills', description: 'Build confidence with structured speaking opportunities.', icon: '🎤' },
    ],
    '3-5': [
      { title: 'Cross-Curricular Project-Based Learning', description: 'Multi-week project integrating research, writing, math, and presentation.', icon: '🎯' },
      { title: 'Growth Mindset Workshop', description: 'Activities and discussions that build resilience and love of learning.', icon: '🧠' },
      { title: 'Collaborative Problem Solving', description: 'Team challenges that develop communication and critical thinking.', icon: '🤝' },
      { title: 'Digital Citizenship Lessons', description: 'Age-appropriate lessons on online safety, kindness, and responsibility.', icon: '🛡️' },
    ],
    '6-8': [
      { title: 'Genius Hour Passion Projects', description: 'Student-driven inquiry projects with structured checkpoints.', icon: '💡' },
      { title: 'Debate & Public Speaking', description: 'Build argumentation skills through structured classroom debates.', icon: '🎙️' },
      { title: 'Study Skills & Organization', description: 'Teach note-taking, time management, and test preparation strategies.', icon: '📓' },
      { title: 'Service Learning Project', description: 'Connect curriculum to community through meaningful service projects.', icon: '🤲' },
    ],
  },
};

// Map specific subjects to recommendation categories
function getRecCategory(subject: Subject): string {
  switch (subject) {
    case 'MATH': return 'MATH';
    case 'SCIENCE':
    case 'ENVIRONMENTAL_STUDIES': return 'SCIENCE';
    case 'ENGLISH':
    case 'READING':
    case 'FOREIGN_LANGUAGE': return 'ENGLISH';
    case 'SOCIAL_STUDIES':
    case 'HISTORY':
    case 'GEOGRAPHY':
    case 'ECONOMICS': return 'SOCIAL_STUDIES';
    default: return 'GENERAL';
  }
}

// ---------------------------------------------------------------------------
// Sample PDF definitions
// ---------------------------------------------------------------------------
const SAMPLE_PDFS: SamplePdfDef[] = [
  {
    key: 'MATH',
    subjects: ['MATH'] as Subject[],
    title: 'Multiplication Strategies: Arrays & Equal Groups',
    grade: '3rd Grade Math',
    objectives: [
      'Represent multiplication using arrays and equal groups',
      'Connect repeated addition to multiplication expressions',
      'Solve word problems involving equal groups',
    ],
    sections: [
      { title: 'Warm-Up: Skip Counting Review', duration: '5 min', content: 'Students skip count by 2s, 5s, and 10s using a number line. Partner share: "Where do you see skip counting in real life?"' },
      { title: 'Direct Instruction: What Is Multiplication?', duration: '15 min', content: 'Introduce multiplication as "equal groups of." Model with counters: 3 groups of 4 = 12. Show the same quantity as an array (3 rows x 4 columns). Students record both representations in math journals.' },
      { title: 'Guided Practice: Array Art', duration: '15 min', content: 'Students use dot stickers to create arrays for given multiplication facts. They write the multiplication sentence below each array. Circulate and check for understanding, asking: "How many rows? How many in each row?"' },
      { title: 'Independent Practice: Word Problem Station', duration: '15 min', content: 'Students rotate through 4 stations solving equal group word problems. Each station has manipulatives available (counters, grid paper, number lines). Problems increase in complexity across stations.' },
      { title: 'Closure: Exit Ticket', duration: '5 min', content: 'Draw an array for 4 × 5. Write a word problem that matches. Explain how arrays help you understand multiplication.' },
    ],
    vocabulary: ['array', 'equal groups', 'rows', 'columns', 'multiplication', 'factors', 'product'],
    assessment: 'Exit ticket: Students draw an array, write a matching word problem, and explain the connection. Success criteria: correct array dimensions, accurate multiplication sentence, clear explanation.',
  },
  {
    key: 'SCIENCE',
    subjects: ['SCIENCE', 'ENVIRONMENTAL_STUDIES'] as Subject[],
    title: 'Ecosystems & Food Webs',
    grade: '5th Grade Science',
    objectives: [
      'Identify producers, consumers, and decomposers in an ecosystem',
      'Construct a food web showing energy flow',
      'Predict effects of removing an organism from a food web',
    ],
    sections: [
      { title: 'Engagement: Ecosystem Photo Sort', duration: '10 min', content: 'Display photos of organisms from a forest ecosystem. Students sort into groups and justify their categories. Introduce the terms producer, consumer (herbivore, carnivore, omnivore), and decomposer.' },
      { title: 'Exploration: Food Chain to Food Web', duration: '15 min', content: 'Begin with simple food chains using yarn and organism cards. Then connect multiple chains to reveal the web of relationships. Key question: "Why is it called a web and not just a chain?"' },
      { title: 'Explanation: Energy Flow Model', duration: '10 min', content: 'Use an energy pyramid to show that energy decreases at each level. Discuss why there are more producers than top predators. Students annotate diagrams in science notebooks.' },
      { title: 'Elaboration: What Happens If...?', duration: '15 min', content: 'Remove one organism card from the class food web. Student groups predict and discuss ripple effects. Each group presents their scenario. Connect to real-world examples (wolf reintroduction in Yellowstone).' },
      { title: 'Evaluation: Food Web Poster', duration: '10 min', content: 'Students create a food web poster for an assigned ecosystem (ocean, desert, or rainforest). Must include at least 8 organisms with arrows showing energy flow and labels for each trophic level.' },
    ],
    vocabulary: ['ecosystem', 'producer', 'consumer', 'decomposer', 'food web', 'food chain', 'energy flow', 'trophic level'],
    assessment: 'Food web poster with correct energy flow arrows, proper organism classification, and a written paragraph predicting what would happen if one organism disappeared.',
  },
  {
    key: 'ENGLISH',
    subjects: ['ENGLISH', 'READING', 'FOREIGN_LANGUAGE'] as Subject[],
    title: 'Narrative Writing Workshop',
    grade: '4th Grade English Language Arts',
    objectives: [
      'Write a narrative with a clear beginning, middle, and end',
      'Use descriptive details and dialogue to develop characters',
      'Apply transition words to sequence events',
    ],
    sections: [
      { title: 'Mini-Lesson: Strong Story Leads', duration: '10 min', content: 'Read 3 opening paragraphs from mentor texts. Students identify what makes each lead engaging (action, dialogue, question, sound effect). Chart the strategies. Students try writing 2 different leads for their story idea.' },
      { title: 'Guided Writing: Building the Middle', duration: '15 min', content: 'Model expanding the "problem" section of a narrative using a shared class story. Add sensory details: What did the character see, hear, feel? Practice using transition words (suddenly, meanwhile, after that) to connect events.' },
      { title: 'Writing Workshop: Draft Time', duration: '20 min', content: 'Students work on their narratives independently. Teacher confers with 4-5 students using targeted feedback. Anchor chart displayed: Story Mountain (exposition, rising action, climax, falling action, resolution).' },
      { title: 'Peer Conference: Stars & Wishes', duration: '10 min', content: 'Partner pairs exchange drafts. Each reader gives 2 "stars" (specific things done well) and 1 "wish" (a suggestion for improvement). Focus today: Does the dialogue sound natural? Are there enough details to picture the scene?' },
      { title: 'Share Chair & Reflection', duration: '5 min', content: '2-3 volunteers read their favorite paragraph aloud. Class listens for strong leads, vivid details, or effective dialogue. Writers reflect: "What is one thing I want to improve tomorrow?"' },
    ],
    vocabulary: ['narrative', 'lead', 'dialogue', 'sensory details', 'transition words', 'draft', 'revision'],
    assessment: 'Narrative draft scored on 4-point rubric: organization (beginning/middle/end), descriptive details, use of dialogue, and conventions. Self-assessment checklist completed by students.',
  },
  {
    key: 'SOCIAL_STUDIES',
    subjects: ['SOCIAL_STUDIES', 'HISTORY', 'GEOGRAPHY', 'ECONOMICS'] as Subject[],
    title: 'Community Helpers & Civic Roles',
    grade: '2nd Grade Social Studies',
    objectives: [
      'Identify community helpers and their roles',
      'Explain how community helpers contribute to a safe and healthy community',
      'Connect community roles to civic responsibility',
    ],
    sections: [
      { title: 'Circle Time: Who Helps Us?', duration: '10 min', content: 'Show images of community helpers (firefighter, teacher, doctor, mail carrier, farmer). Students turn and talk: "How does this person help our community?" Create a class anchor chart organizing helpers by category (safety, health, education, services).' },
      { title: 'Read-Aloud & Discussion', duration: '10 min', content: 'Read a picture book about community helpers. Pause to ask: "What would happen if we didn\'t have this helper?" Students begin to understand interdependence. Record key ideas on chart paper.' },
      { title: 'Role-Play Stations', duration: '20 min', content: 'Four stations set up as community locations (hospital, fire station, school, post office). Students rotate, taking on roles with simple props. At each station they complete a sentence frame: "I am a ___ and I help by ___."' },
      { title: 'Community Helper Interview Prep', duration: '10 min', content: 'Students choose one community helper to "interview" (stuffed animal stand-in). They write 3 questions they would ask. Model good interview questions vs. yes/no questions.' },
      { title: 'Closing: How Can WE Help?', duration: '10 min', content: 'Discuss: "Kids are community helpers too!" Brainstorm ways students help at school and home. Each student draws and writes one way they are a community helper. Display on "Our Community" bulletin board.' },
    ],
    vocabulary: ['community', 'community helper', 'role', 'responsibility', 'civic', 'interdependence'],
    assessment: 'Students draw and label 3 community helpers and write one sentence explaining how each helper makes the community better. Assessed on accuracy and completeness.',
  },
  {
    key: 'GENERAL',
    subjects: [] as Subject[],
    title: 'Cross-Curricular Project-Based Learning',
    grade: '3rd-5th Grade (All Subjects)',
    objectives: [
      'Apply skills from multiple subject areas to a real-world project',
      'Collaborate effectively in small groups',
      'Present findings using evidence and visual aids',
    ],
    sections: [
      { title: 'Project Launch: The Driving Question', duration: '10 min', content: 'Present the driving question: "How can we design a school garden that feeds our cafeteria?" Students brainstorm what they need to know (science: plant needs; math: area/budget; ELA: persuasive letter to principal; art: garden design).' },
      { title: 'Research Phase: Expert Groups', duration: '20 min', content: 'Jigsaw structure: groups research one aspect (soil science, plant spacing/math, nutrition facts, garden layouts). Each group uses provided resources and records notes on graphic organizers. Teacher circulates to support research skills.' },
      { title: 'Design & Planning', duration: '15 min', content: 'Groups come together to share expertise. Using grid paper, teams design their garden plot (math: calculating area, estimating costs). They list materials needed and create a simple budget. Writing connection: draft a persuasive letter explaining why the school needs a garden.' },
      { title: 'Create & Present', duration: '10 min', content: 'Teams create a poster or digital presentation showing their garden design, budget, research findings, and persuasive argument. Each member presents their area of expertise. Audience uses a peer feedback form.' },
      { title: 'Reflection & Next Steps', duration: '5 min', content: 'Individual reflection: "What did I learn from another subject that helped my project? What was challenging about working in a team?" Class discussion on real next steps—could we actually build this garden?' },
    ],
    vocabulary: ['project-based learning', 'driving question', 'jigsaw', 'cross-curricular', 'collaboration', 'evidence'],
    assessment: 'Group project rubric covering: research quality, mathematical accuracy, persuasive writing, visual presentation, and collaboration. Individual reflection journal entry.',
  },
];

// ---------------------------------------------------------------------------
// PDF HTML generator
// ---------------------------------------------------------------------------
function generateSampleLessonHTML(pdf: SamplePdfDef): string {
  const sectionsHTML = pdf.sections
    .map(
      (s, i) => `
      <div style="margin-bottom: 20px; ${i < pdf.sections.length - 1 ? 'border-bottom: 1px solid #E5E7EB; padding-bottom: 20px;' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
          <h3 style="color: #2D5A4A; margin: 0; font-size: 15px; font-family: 'Georgia', serif;">${s.title}</h3>
          <span style="color: #7BAE7F; font-size: 13px; font-weight: 600; white-space: nowrap; margin-left: 12px;">${s.duration}</span>
        </div>
        <p style="color: #3D4F66; line-height: 1.65; font-size: 14px; margin: 0;">${s.content}</p>
      </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Outfit', 'Segoe UI', sans-serif; background: #ffffff; color: #1E2A3A; }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); padding: 32px 40px; position: relative;">
    <div style="position: absolute; top: 16px; right: 24px; background: rgba(212,168,83,0.2); border: 1px solid rgba(212,168,83,0.5); border-radius: 20px; padding: 4px 14px;">
      <span style="color: #E8C97A; font-size: 11px; font-weight: 600; letter-spacing: 0.5px;">SAMPLE LESSON &mdash; Generated by Ollie</span>
    </div>
    <h1 style="color: #ffffff; font-family: 'Fraunces', Georgia, serif; font-size: 24px; font-weight: 700; margin-bottom: 6px;">${pdf.title}</h1>
    <p style="color: rgba(255,255,255,0.85); font-size: 14px;">${pdf.grade}</p>
  </div>

  <div style="padding: 32px 40px;">
    <!-- Objectives -->
    <div style="background: #FAF7F2; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; border-left: 4px solid #2D5A4A;">
      <h2 style="color: #2D5A4A; font-family: 'Fraunces', Georgia, serif; font-size: 16px; margin-bottom: 12px;">Learning Objectives</h2>
      ${pdf.objectives.map((o) => `<div style="display: flex; align-items: flex-start; margin-bottom: 6px;"><span style="color: #7BAE7F; margin-right: 8px; font-size: 14px;">&#10003;</span><span style="color: #3D4F66; font-size: 14px; line-height: 1.5;">${o}</span></div>`).join('')}
    </div>

    <!-- Sections -->
    <h2 style="color: #1E2A3A; font-family: 'Fraunces', Georgia, serif; font-size: 18px; margin-bottom: 20px;">Lesson Flow</h2>
    ${sectionsHTML}

    <!-- Vocabulary -->
    <div style="margin-top: 28px; margin-bottom: 28px;">
      <h2 style="color: #1E2A3A; font-family: 'Fraunces', Georgia, serif; font-size: 16px; margin-bottom: 12px;">Key Vocabulary</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${pdf.vocabulary.map((v) => `<span style="background: #EDF5F0; color: #2D5A4A; padding: 4px 12px; border-radius: 16px; font-size: 13px; font-weight: 500;">${v}</span>`).join('')}
      </div>
    </div>

    <!-- Assessment -->
    <div style="background: linear-gradient(135deg, rgba(212,168,83,0.08) 0%, rgba(232,201,122,0.08) 100%); border-radius: 12px; padding: 20px 24px; border-left: 4px solid #D4A853;">
      <h2 style="color: #B8923F; font-family: 'Fraunces', Georgia, serif; font-size: 16px; margin-bottom: 8px;">Assessment</h2>
      <p style="color: #3D4F66; font-size: 14px; line-height: 1.6;">${pdf.assessment}</p>
    </div>
  </div>

  <!-- Footer -->
  <div style="border-top: 1px solid #E5E7EB; padding: 16px 40px; text-align: center; margin-top: 20px;">
    <p style="color: #9CA3AF; font-size: 12px;">orbitlearn.app/teacher &mdash; AI-powered lesson planning with Ollie</p>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Generate PDFs
// ---------------------------------------------------------------------------
async function generateSamplePDFs(): Promise<Map<string, Buffer>> {
  console.log('Generating sample lesson PDFs...');
  const pdfMap = new Map<string, Buffer>();

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const def of SAMPLE_PDFS) {
      const html = generateSampleLessonHTML(def);
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: 'Letter',
        printBackground: true,
        margin: { top: '0.4in', right: '0in', bottom: '0.4in', left: '0in' },
      });
      pdfMap.set(def.key, Buffer.from(pdfBuffer));
      await page.close();
      console.log(`  ✓ ${def.key} PDF generated (${Math.round(pdfBuffer.byteLength / 1024)}KB)`);
    }
  } finally {
    await browser.close();
  }

  console.log(`Generated ${pdfMap.size} sample PDFs.\n`);
  return pdfMap;
}

function getPdfForSubject(subject: Subject, pdfMap: Map<string, Buffer>): Buffer | null {
  for (const def of SAMPLE_PDFS) {
    if (def.subjects.includes(subject)) {
      return pdfMap.get(def.key) || null;
    }
  }
  return pdfMap.get('GENERAL') || null;
}

// ---------------------------------------------------------------------------
// Email HTML template
// ---------------------------------------------------------------------------
function buildEmailHTML(
  teacherName: string,
  gradeBand: GradeBand,
  subject: Subject,
  recommendations: LessonRec[],
  hasPdf: boolean
): string {
  const formattedSubject = formatSubject(subject);
  const formattedGrade = formatGradeBand(gradeBand);

  const recCards = recommendations
    .map(
      (r) => `
        <tr>
          <td style="padding: 8px 0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #FAF7F2; border-radius: 12px; border: 1px solid #E5E7EB;">
              <tr>
                <td style="padding: 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="vertical-align: top; width: 36px; font-size: 24px;">${r.icon}</td>
                      <td style="padding-left: 14px;">
                        <p style="margin: 0 0 4px 0; font-weight: 600; color: #1E2A3A; font-size: 15px;">${r.title}</p>
                        <p style="margin: 0; color: #3D4F66; font-size: 14px; line-height: 1.5;">${r.description}</p>
                        <a href="${FRONTEND_URL}/teacher/agent/chat" style="color: #2D5A4A; font-size: 13px; font-weight: 600; text-decoration: none; display: inline-block; margin-top: 8px;">Generate This Lesson &rarr;</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
    )
    .join('');

  const pdfNote = hasPdf
    ? `<tr><td style="padding: 20px 0 0 0;"><p style="color: #3D4F66; font-size: 14px; line-height: 1.6; font-style: italic; background: #F0FAF4; padding: 14px 18px; border-radius: 10px; border-left: 3px solid #7BAE7F; margin: 0;">P.S. We attached a sample lesson plan so you can see exactly what Ollie creates &mdash; ready to use in your classroom.</p></td></tr>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lesson Ideas for Your Classroom</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', 'Segoe UI', sans-serif; background-color: #FDF8F3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #2D5A4A 0%, #3D7A6A 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
        <img src="${FRONTEND_URL}/assets/orbit-learn-logo.png" alt="Orbit Learn" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; font-family: 'Fraunces', Georgia, serif;">Lessons picked for your classroom</h1>
        <p style="color: rgba(255,255,255,0.88); margin-top: 8px; font-size: 15px;">${formattedGrade} &bull; ${formattedSubject}</p>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="background-color: #ffffff; padding: 36px 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(30,42,58,0.05);">
        <h2 style="color: #1E2A3A; margin: 0 0 8px 0; font-size: 20px; font-family: 'Fraunces', Georgia, serif;">Hi ${teacherName},</h2>
        <p style="color: #3D4F66; line-height: 1.7; font-size: 15px; margin: 0 0 24px 0;">
          Based on your <strong>${formattedGrade.toLowerCase()}</strong> <strong>${formattedSubject.toLowerCase()}</strong> classroom, here are lesson ideas Ollie can build for you in minutes &mdash; differentiated, standards-aligned, and ready to teach.
        </p>

        <!-- Recommendation Cards -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          ${recCards}
        </table>

        <!-- CTA Button -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 0 0 0; text-align: center;">
              <a href="${FRONTEND_URL}/teacher/agent/chat" style="background: linear-gradient(135deg, #D4A853 0%, #E8C97A 100%); color: #1E2A3A; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-weight: bold; font-size: 16px; display: inline-block; border: 2px solid #B8923F; box-shadow: 0 4px 0 #B8923F;">
                Plan My Week with Ollie
              </a>
            </td>
          </tr>
        </table>

        <!-- PS note -->
        ${pdfNote}

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-top: 28px; border-top: 1px solid #E5E7EB; margin-top: 28px;">
              <p style="color: #9CA3AF; font-size: 13px; text-align: center; margin: 0;">
                Questions? Reply to this email &mdash; we read every one.<br>
                <span style="color: #3D4F66;">&mdash; The Orbit Learn Team</span>
              </p>
              <p style="color: #C0C5CC; font-size: 11px; text-align: center; margin: 12px 0 0 0;">
                <a href="${FRONTEND_URL}/teacher/settings" style="color: #C0C5CC; text-decoration: underline;">Email preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildPlainText(
  teacherName: string,
  gradeBand: GradeBand,
  subject: Subject,
  recommendations: LessonRec[],
  hasPdf: boolean
): string {
  const formattedSubject = formatSubject(subject);
  const formattedGrade = formatGradeBand(gradeBand);

  let text = `Lessons picked for your classroom\n${formattedGrade} • ${formattedSubject}\n\n`;
  text += `Hi ${teacherName},\n\n`;
  text += `Based on your ${formattedGrade.toLowerCase()} ${formattedSubject.toLowerCase()} classroom, here are lesson ideas Ollie can build for you in minutes — differentiated, standards-aligned, and ready to teach.\n\n`;

  recommendations.forEach((r, i) => {
    text += `${i + 1}. ${r.title}\n   ${r.description}\n\n`;
  });

  text += `Plan My Week with Ollie: ${FRONTEND_URL}/teacher/agent/chat\n\n`;

  if (hasPdf) {
    text += `P.S. We attached a sample lesson plan so you can see exactly what Ollie creates — ready to use in your classroom.\n\n`;
  }

  text += `Questions? Reply to this email — we read every one.\n— The Orbit Learn Team`;
  return text;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('=== Lesson Recommendation Email Campaign ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE SEND'}`);
  console.log(`Limit: ${LIMIT}`);
  console.log(`PDF attachment: ${SKIP_PDF ? 'SKIPPED' : 'ENABLED'}\n`);

  // Step 1: Query teachers
  console.log('Querying onboarded teachers...');
  const teachers = await prisma.teacher.findMany({
    where: {
      emailVerified: true,
      email: {
        not: { contains: '@test.' },
      },
      agentProfile: {
        setupStatus: { not: 'NOT_STARTED' },
        gradesTaught: { isEmpty: false },
        subjectsTaught: { isEmpty: false },
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      agentProfile: {
        select: {
          gradesTaught: true,
          subjectsTaught: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      agentProfile: { createdAt: 'desc' },
    },
    take: LIMIT,
  });

  console.log(`Found ${teachers.length} teachers.\n`);

  if (teachers.length === 0) {
    console.log('No teachers found matching criteria. Exiting.');
    await prisma.$disconnect();
    return;
  }

  // Step 2: Generate PDFs
  let pdfMap: Map<string, Buffer> | null = null;
  if (!SKIP_PDF) {
    pdfMap = await generateSamplePDFs();
  }

  // Step 3: Send emails
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const teacher of teachers) {
    const agent = teacher.agentProfile;
    if (!agent) {
      skipped++;
      continue;
    }

    const teacherName = teacher.firstName || 'Teacher';
    const primarySubject = agent.subjectsTaught[0] || 'OTHER' as Subject;
    const gradeBand = parseGradeBand(agent.gradesTaught);
    const recCategory = getRecCategory(primarySubject);
    const recommendations = RECOMMENDATIONS[recCategory]?.[gradeBand] || RECOMMENDATIONS['GENERAL'][gradeBand];

    const hasPdf = !SKIP_PDF && pdfMap !== null;
    const pdfBuffer = hasPdf ? getPdfForSubject(primarySubject, pdfMap!) : null;

    const subjectLine = `Lesson ideas for your ${formatGradeBand(gradeBand).toLowerCase()} ${formatSubject(primarySubject).toLowerCase()} classroom`;

    if (DRY_RUN) {
      console.log(`[DRY RUN] ${teacher.email}`);
      console.log(`  Name: ${teacherName}`);
      console.log(`  Subject: ${primarySubject} → ${recCategory}`);
      console.log(`  Grade band: ${gradeBand} (from: ${agent.gradesTaught.join(', ')})`);
      console.log(`  Subject line: ${subjectLine}`);
      console.log(`  Recommendations: ${recommendations.map((r) => r.title).join(', ')}`);
      console.log(`  PDF: ${pdfBuffer ? `${recCategory} (${Math.round(pdfBuffer.byteLength / 1024)}KB)` : 'none'}`);
      console.log('');
      sent++;
      continue;
    }

    try {
      const emailPayload: any = {
        from: `Orbit Learn <${FROM_EMAIL}>`,
        to: teacher.email,
        subject: subjectLine,
        html: buildEmailHTML(teacherName, gradeBand, primarySubject, recommendations, !!pdfBuffer),
        text: buildPlainText(teacherName, gradeBand, primarySubject, recommendations, !!pdfBuffer),
      };

      if (pdfBuffer) {
        emailPayload.attachments = [
          {
            filename: 'Sample-Lesson-Plan.pdf',
            content: pdfBuffer.toString('base64'),
          },
        ];
      }

      await resend.emails.send(emailPayload);
      sent++;
      console.log(`✓ Sent to ${teacher.email} (${recCategory}/${gradeBand})`);

      // Rate limit: 200ms between sends
      if (sent < teachers.length) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch (err: any) {
      failed++;
      console.error(`✗ Failed for ${teacher.email}: ${err.message}`);
    }
  }

  // Summary
  console.log('\n=== Campaign Summary ===');
  console.log(`Total teachers queried: ${teachers.length}`);
  console.log(`Sent: ${sent}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  if (DRY_RUN) console.log('(Dry run — no emails were actually sent)');

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  prisma.$disconnect();
  process.exit(1);
});
