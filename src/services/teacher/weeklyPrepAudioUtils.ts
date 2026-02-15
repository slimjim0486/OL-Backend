// Weekly Prep Audio Utils
// Shared helpers for generating parent-facing audio updates from weekly prep plans.

interface PlanSubject {
  subject: string;
  topic: string;
  standards?: string[];
  materials?: Array<{ type: string; title: string; description: string }>;
}

interface PlanDay {
  dayOfWeek: number;
  date: string;
  subjects: PlanSubject[];
}

export interface WeeklyPlan {
  days: PlanDay[];
  weekSummary?: string;
}

export function buildLessonSummariesFromPlan(plan: WeeklyPlan, weekLabel: string): string {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const parts: string[] = [];

  parts.push(`WEEKLY PLAN OVERVIEW: ${weekLabel}`);
  if (plan.weekSummary) {
    parts.push(`Summary: ${plan.weekSummary}`);
  }
  parts.push('');

  for (const day of plan.days || []) {
    const dayName = dayNames[day.dayOfWeek] || `Day ${day.dayOfWeek + 1}`;
    const subjectLines: string[] = [];

    for (const subj of day.subjects || []) {
      let line = `  - ${subj.subject}: ${subj.topic}`;
      if (subj.standards?.length) {
        line += ` (Standards: ${subj.standards.slice(0, 3).join(', ')})`;
      }
      if (subj.materials?.length) {
        const materialTypes = subj.materials.map(m => m.type).join(', ');
        line += ` [Materials: ${materialTypes}]`;
      }
      subjectLines.push(line);
    }

    if (subjectLines.length > 0) {
      parts.push(`${dayName}:`);
      parts.push(...subjectLines);
      parts.push('');
    }
  }

  return parts.join('\n');
}

