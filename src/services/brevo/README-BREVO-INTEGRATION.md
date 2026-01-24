# Brevo Behavioral Email Integration

This guide explains how to set up and integrate Brevo behavioral trigger emails for the teacher welcome sequence v2.

## Overview

The system sends events to Brevo when teachers take specific actions. Brevo then triggers automated emails based on these events.

### Events Tracked

| Event | Trigger | Email |
|-------|---------|-------|
| `first_lesson_created` | After 1st lesson saved | B1 |
| `second_lesson_created` | After 2nd lesson saved | B2 |
| `third_lesson_created` | After 3rd lesson saved | B3 |
| `credits_50_percent` | When credits ≥ 50% used | B4 |
| `credits_80_percent` | When credits ≥ 80% used | B5 |
| `signup_no_lesson_day3` | Daily cron: signed up 3 days ago, 0 lessons | B6 |
| `inactive_7_days` | Daily cron: last active 7 days ago | B7 |
| `inactive_14_days` | Daily cron: last active 14 days ago | B8 |

## Setup Steps

### 1. Environment Variables

Add to `.env`:

```env
# Brevo API Key (get from Brevo dashboard > SMTP & API > API Keys)
BREVO_API_KEY=xkeysib-xxxxxxxxxxxx
```

### 2. Database Migration

Run the SQL migration to add required fields:

```bash
# Option A: Run raw SQL
psql $DATABASE_URL < prisma/migrations/brevo_tracking_additions.sql

# Option B: Add to schema.prisma and run migration
npx prisma migrate dev --name add_brevo_tracking
```

Add these to `prisma/schema.prisma`:

```prisma
// Add to Teacher model (around line 970)
model Teacher {
  // ... existing fields ...

  // Brevo tracking
  lastActiveAt DateTime?  // Track last activity for inactivity triggers
  lessonCount  Int @default(0)  // Cached count for quick access

  // Add relation
  triggerLogs TeacherTriggerLog[]
}

// Add new model at the end of schema.prisma
model TeacherTriggerLog {
  id          String   @id @default(uuid())
  teacherId   String
  teacher     Teacher  @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  triggerName String   // e.g., "credits_50_percent", "inactive_7_days"
  monthKey    String   // e.g., "2026-0" for January 2026
  sentAt      DateTime @default(now())
  metadata    Json?    // Optional additional data

  @@index([teacherId])
  @@index([triggerName])
  @@index([teacherId, triggerName])
}
```

Then run:

```bash
npx prisma generate
npx prisma migrate dev --name add_brevo_tracking
```

### 3. Integrate with Lesson Creation

In your lesson creation handler, add tracking:

```typescript
// src/routes/teacher/content.routes.ts or similar

import { trackLessonCreated, trackCreditUsage } from '../../services/brevo/brevoTrackingService';

// After lesson is created successfully:
router.post('/lessons', async (req, res) => {
  // ... existing lesson creation logic ...

  // Increment lesson count
  const updatedTeacher = await prisma.teacher.update({
    where: { id: teacher.id },
    data: {
      lessonCount: { increment: 1 },
      lastActiveAt: new Date(),
    },
  });

  // Track in Brevo
  await trackLessonCreated({
    teacher: updatedTeacher,
    lessonTitle: lesson.title,
    lessonSubject: lesson.subject,
  });

  // ... return response ...
});
```

### 4. Integrate with Token Usage

After consuming tokens, check credit thresholds:

```typescript
// In quotaService.ts or wherever tokens are recorded

import { trackCreditUsage } from '../../services/brevo/brevoTrackingService';

// After recording token usage:
await trackCreditUsage(teacher);
```

### 5. Track Signup

When a teacher signs up:

```typescript
// In teacherAuthService.ts signup method

import { trackTeacherSignup } from '../../services/brevo/brevoTrackingService';

// After successful signup:
await trackTeacherSignup(teacher);
```

### 6. Track Activity on Login

Update lastActiveAt on login:

```typescript
// In teacherAuthService.ts login method

import { trackTeacherActivity } from '../../services/brevo/brevoTrackingService';

// After successful login:
await prisma.teacher.update({
  where: { id: teacher.id },
  data: { lastActiveAt: new Date() },
});
await trackTeacherActivity(teacher);
```

### 7. Schedule Daily Inactivity Checks

In your main server file (e.g., `src/index.ts`):

```typescript
import { scheduleBrevoInactivityChecks } from './jobs/brevoInactivityChecks';

// After server starts
scheduleBrevoInactivityChecks();
```

Or if using a separate worker:

```bash
# Add to crontab or scheduler
0 9 * * * cd /path/to/backend && npx tsx src/jobs/brevoInactivityChecks.ts
```

## Brevo Automation Setup

For each behavioral trigger, create an automation in Brevo:

### Example: B1 - First Lesson Created

1. Go to **Automations** → **Create an Automation**
2. Select **Custom Automation**
3. **Entry Point**: Track Event
   - Event name: `first_lesson_created`
4. **Add Action**: Send an Email
   - Select your B1 email template
5. **Activate** the automation

### Example: B5 - 80% Credits (with delay)

1. Create automation with entry point: `credits_80_percent`
2. Add **Wait** action: 1 hour
3. Add **Send Email** action: B5 template

## Contact Attributes

These attributes are automatically synced to Brevo contacts:

| Attribute | Description |
|-----------|-------------|
| `FIRSTNAME` | Teacher's first name |
| `LASTNAME` | Teacher's last name |
| `LESSON_COUNT` | Number of lessons created |
| `CREDITS_USED` | Credits consumed this month |
| `CREDITS_REMAINING` | Credits remaining |
| `CREDIT_LIMIT` | Total credits for their tier |
| `SUBSCRIPTION_TIER` | FREE, BASIC, or PROFESSIONAL |
| `RESET_DATE` | Next credit reset date |
| `DAYS_UNTIL_RESET` | Days until credits reset |
| `LESSONS_POSSIBLE` | Estimated lessons possible with remaining credits |
| `TIME_SAVED` | Estimated hours saved |
| `SIGNUP_DATE` | When they signed up |
| `SCHOOL_NAME` | Their school/organization |
| `GRADE_LEVELS` | Grades they teach |
| `SUBJECTS` | Subjects they teach |

## Testing

### Manual Event Test

```typescript
import { trackBrevoEvent } from './services/brevo/brevoTrackingService';

// Test sending an event
await trackBrevoEvent({
  email: 'test@example.com',
  event: 'first_lesson_created',
  properties: {
    FIRSTNAME: 'Test',
    LESSON_COUNT: 1,
  },
});
```

### Run Inactivity Check Manually

```bash
npx tsx src/jobs/brevoInactivityChecks.ts
```

### Verify in Brevo

1. Go to **Contacts** → Find your test contact
2. Check **Activity** tab for tracked events
3. Go to **Automations** → Check automation logs

## Troubleshooting

### Events Not Appearing in Brevo

1. Check `BREVO_API_KEY` is set correctly
2. Check server logs for "Brevo tracking error" messages
3. Verify the API key has "Track Events" permission

### Duplicate Emails Being Sent

- The `TeacherTriggerLog` table prevents duplicates
- Each trigger is only sent once per teacher
- Credit triggers reset monthly (based on `monthKey`)

### Cron Job Not Running

1. Check cron schedule syntax
2. Verify database connection in job
3. Check server timezone matches expected run time

## Files Reference

| File | Purpose |
|------|---------|
| `src/services/brevo/brevoTrackingService.ts` | Core tracking service |
| `src/jobs/brevoInactivityChecks.ts` | Daily cron for B6, B7, B8 |
| `prisma/migrations/brevo_tracking_additions.sql` | Database migration |
| `marketing/email-campaigns/teacher-welcome-sequence-v2/` | Email templates |
