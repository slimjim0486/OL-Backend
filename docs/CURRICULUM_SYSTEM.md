# Curriculum Mapping System - Master Document

**Last Updated**: January 14, 2026
**Status**: Phase 1 Complete (British NC Mathematics)

---

## Table of Contents

1. [Overview](#overview)
2. [Completed Work](#completed-work)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Pending Curricula](#pending-curricula)
6. [Data Accuracy Notes](#data-accuracy-notes)
7. [Future Enhancements](#future-enhancements)

---

## Overview

The curriculum mapping system enables Orbit Learn to:
- Store structured learning standards from multiple curricula
- Map lesson content to specific standards
- Track child progress per standard
- Enable curriculum switching with gap analysis for expat families

### Why This Matters (Gulf Market Context)

- Dubai alone operates **17 different curricula**
- British curriculum: 36% market share
- Indian CBSE: 26% market share
- American: 15% market share
- IB: 7% market share
- **88.5% of UAE residents are expatriates** navigating multiple curricula

---

## Completed Work

### 1. Database Schema ✅

**File**: `prisma/schema.prisma`

Added 7 new models:

| Model | Purpose | Status |
|-------|---------|--------|
| `CurriculumJurisdiction` | Curriculum authorities (UK, US, IB, CBSE) | ✅ Created |
| `StandardSet` | Groups standards by year/grade | ✅ Created |
| `LearningStandard` | Individual learning objectives | ✅ Created |
| `StandardEquivalence` | Cross-curriculum mappings | ✅ Schema only |
| `ContentStandardAlignment` | Link content to standards | ✅ Schema only |
| `ChildStandardProgress` | Track mastery per standard | ✅ Schema only |
| `CurriculumSwitch` | Gap analysis records | ✅ Schema only |

Added 3 new enums:
- `EquivalenceType`: EXACT, PARTIAL, PREREQUISITE, ADVANCED, RELATED
- `AlignableContentType`: LESSON, QUIZ, FLASHCARD_DECK, EXERCISE, TEACHER_CONTENT
- `StandardMasteryStatus`: NOT_STARTED, IN_PROGRESS, APPROACHING, PROFICIENT, MASTERED

### 2. British National Curriculum - Mathematics ✅

**File**: `src/config/britishCurriculum.ts`

| Key Stage | Years | Age Range | Standards Count |
|-----------|-------|-----------|-----------------|
| KS1 | 1-2 | 5-7 | 58 |
| KS2 | 3-6 | 7-11 | 173 |
| KS3 | 7-8 | 11-13 | 100 |
| **Total** | **1-8** | **5-13** | **331** |

**Strands Covered**:
- Number - Place Value (NPV)
- Number - Addition and Subtraction (NAS)
- Number - Multiplication and Division (NMD)
- Number - Fractions (NFR)
- Measurement (MEA)
- Geometry - Properties of Shapes (GPS)
- Geometry - Position and Direction (GPD)
- Statistics (STA)
- Algebra (ALG) - Year 6+
- Ratio and Proportion (RAT) - Year 6+
- Probability (PRB) - KS3

**Notation System**:
```
UK.KS1.Y1.MA.NPV.1
│  │   │  │  │   └── Standard number within strand
│  │   │  │  └────── Strand code (Number-Place Value)
│  │   │  └───────── Subject (MA = Mathematics)
│  │   └──────────── Year (Y1 = Year 1)
│  └────────────────  Key Stage (KS1, KS2, KS3)
└───────────────────── Country (UK)
```

### 3. Seed Script ✅

**File**: `scripts/seedBritishCurriculum.ts`

```bash
# Run to populate database
npx tsx scripts/seedBritishCurriculum.ts
```

Output:
- Creates 1 jurisdiction (UK_NATIONAL_CURRICULUM)
- Creates 8 standard sets (one per year)
- Creates 331 learning standards

### 4. API Service Layer ✅

**File**: `src/services/curriculum/curriculumService.ts`

Functions:
- `getAllJurisdictions()` - List all curricula
- `getJurisdictionByCode(code)` - Get single curriculum
- `getStandardSets(code, subject?)` - Get standard sets
- `getStandardsForYear(code, year, subject, options)` - Get standards for year
- `getStandardById(id)` - Get single standard
- `getStandardByNotation(notation)` - Get by notation code
- `searchStandards(query, options)` - Search across curricula
- `getStrandsForYear(code, year, subject)` - Get available strands
- `curriculumTypeToJurisdictionCode(type)` - Map enum to code
- `getStandardsForChild(childId)` - Get standards based on child's settings

### 5. API Routes ✅

**File**: `src/routes/curriculum.routes.ts`
**Base Path**: `/api/curricula`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all curriculum jurisdictions |
| GET | `/:code` | Get curriculum details |
| GET | `/:code/standard-sets` | Get standard sets for curriculum |
| GET | `/:code/years/:year` | Get standards for specific year |
| GET | `/:code/years/:year/strands` | Get available strands for year |
| GET | `/standards/search?q=` | Search standards across all curricula |
| GET | `/standards/:id` | Get standard by ID |
| GET | `/standards/by-notation/:notation` | Get standard by notation |
| GET | `/child/:childId/standards` | Get standards for child (auth required) |

**Query Parameters** (for `/years/:year`):
- `strand` - Filter by strand
- `search` - Search within year
- `subject` - Filter by subject (default: MATH)
- `limit` - Pagination limit (default: 100)
- `offset` - Pagination offset (default: 0)

---

## Database Schema

### Entity Relationship

```
CurriculumJurisdiction (1) ──── (N) StandardSet (1) ──── (N) LearningStandard
        │                              │                         │
        │                              │                         │
        └── code: UK_NATIONAL_CURRICULUM                         │
            name: British National Curriculum                    │
            country: GB                                          │
            version: 2014                                        │
                                                                 │
                    StandardSet                                  │
                    ├── code: UK.KS1.Y1.MA                       │
                    ├── title: Year 1 Mathematics                │
                    ├── subject: MATH                            │
                    ├── gradeLevel: 1                            │
                    └── ageRangeMin/Max: 5-6                     │
                                                                 │
                                        LearningStandard ────────┘
                                        ├── notation: UK.KS1.Y1.MA.NPV.1
                                        ├── description: "count to and across 100..."
                                        ├── strand: "Number - Place Value"
                                        ├── isStatutory: true
                                        └── guidance: "Pupils practise counting..."
```

### Cross-Curriculum Mapping (Future)

```
LearningStandard (UK.KS1.Y1.MA.NPV.1)
        │
        └──── StandardEquivalence ────── LearningStandard (1.NBT.1 US Common Core)
                    │
                    ├── equivalenceType: PARTIAL
                    ├── confidence: 0.85
                    └── notes: "Both cover counting to 100..."
```

---

## API Endpoints

### Example Requests

**List all curricula:**
```bash
GET /api/curricula

Response:
{
  "success": true,
  "data": [
    {
      "id": "a92e0d4a-5840-4894-9462-683fdfb34acd",
      "code": "UK_NATIONAL_CURRICULUM",
      "name": "British National Curriculum",
      "country": "GB",
      "version": "2014",
      "standardSetsCount": 8,
      "standardsCount": 331
    }
  ]
}
```

**Get Year 3 Mathematics standards:**
```bash
GET /api/curricula/UK_NATIONAL_CURRICULUM/years/3?subject=MATH

Response:
{
  "success": true,
  "data": [
    {
      "id": "...",
      "notation": "UK.KS2.Y3.MA.NPV.1",
      "description": "count from 0 in multiples of 4, 8, 50 and 100...",
      "strand": "Number - Place Value",
      "isStatutory": true
    },
    ...
  ],
  "meta": {
    "curriculum": "UK_NATIONAL_CURRICULUM",
    "year": 3,
    "subject": "MATH",
    "count": 33
  }
}
```

**Search for "fractions":**
```bash
GET /api/curricula/standards/search?q=fractions&curriculum=UK_NATIONAL_CURRICULUM

Response:
{
  "success": true,
  "data": [
    {
      "notation": "UK.KS1.Y1.MA.NFR.1",
      "description": "recognise, find and name a half as one of two equal parts...",
      "strand": "Number - Fractions"
    },
    ...
  ]
}
```

---

## Pending Curricula

### Priority 1: US Common Core (High - Easy)

**Effort**: 1-2 days
**Data Source**: Common Standards Project API (JSON, ready to use)
**API**: `https://commonstandardsproject.com/api/v1/`

**Structure**:
- Kindergarten through Grade 8
- Domains: Counting & Cardinality, Operations, Number & Operations, etc.
- Notation: `K.CC.1`, `1.NBT.4`, `2.OA.1`

**Tasks**:
- [ ] Create `src/config/usCommonCore.ts` data file
- [ ] Create `scripts/seedUSCommonCore.ts` using API
- [ ] Map US grades to UK years for equivalence

**Why Priority**:
- 15% Gulf market share
- Data already in JSON format via API
- Khan Academy alignment exists

---

### Priority 2: Indian CBSE/NCERT (High - Hard)

**Effort**: 1-2 weeks
**Data Source**: NCERT website PDFs (unstructured)
**Blue Ocean Opportunity**: 4+ million Indian expats in UAE, no Gulf EdTech targets CBSE

**Structure**:
- Classes 1-8 (Primary + Middle School)
- Chapters map to NCERT textbook structure
- "Math Magic" series for Classes 1-5

**Sample Class 1 Structure**:
```
Class 1 Mathematics (NCERT "Math Magic")
├── Chapter 1: Shapes and Space
├── Chapter 2: Numbers from 1-9
├── Chapter 3: Addition
├── Chapter 4: Subtraction
├── Chapter 5: Numbers from 10-20
├── Chapter 6: Time
├── Chapter 7: Measurement
├── Chapter 8: Numbers from 21-50
├── Chapter 9: Data Handling
├── Chapter 10: Patterns
├── Chapter 11: Numbers
├── Chapter 12: Money
└── Chapter 13: How Many
```

**Tasks**:
- [ ] Download NCERT syllabus PDFs for Classes 1-8
- [ ] Use Gemini to extract standards from PDFs
- [ ] Create `src/config/cbseCurriculum.ts`
- [ ] Create notation system: `IN.CBSE.C1.MA.CH1.1`
- [ ] Map CBSE to UK/US equivalents

**Why Priority**:
- Massive underserved market
- Creates competitive moat
- High parent willingness to pay

---

### Priority 3: IB PYP (Medium)

**Effort**: 3-5 days
**Data Source**: IBO scope & sequence PDFs (semi-structured)

**Structure**:
- 4 Phases (not grades):
  - Phase 1: Ages 3-5 (Early years)
  - Phase 2: Ages 5-7 (Lower primary)
  - Phase 3: Ages 7-9 (Middle primary)
  - Phase 4: Ages 9-12 (Upper primary)
- Strands: Number, Pattern & Function, Data Handling, Measurement, Shape & Space

**Tasks**:
- [ ] Extract IB PYP scope & sequence
- [ ] Create phase-based structure (not year-based)
- [ ] Create `src/config/ibPypCurriculum.ts`
- [ ] Notation: `IB.PYP.P2.MA.NUM.1`

**Why Priority**:
- 7% Gulf market share
- Premium segment (high willingness to pay)
- Phase-based structure aligns well with mastery learning

---

### Priority 4: British NC English & Science (Medium)

**Effort**: 1 week each
**Data Source**: GOV.UK PDFs

**Tasks**:
- [ ] Extract English standards (Reading, Writing, Grammar, Spelling)
- [ ] Extract Science standards (Working Scientifically + content)
- [ ] Add to `britishCurriculum.ts` or create separate files
- [ ] Update seed script

---

### Priority 5: Arabic Curriculum (Low - Strategic)

**Effort**: 2-3 weeks
**Data Source**: UAE Ministry of Education

**Why Important**:
- Arabic is compulsory for all students Grades 1-9/10 in UAE
- 44% of supplemental learning demand is for Arabic
- No good Arabic EdTech for non-native speakers

**Tasks**:
- [ ] Research UAE MOE Arabic curriculum structure
- [ ] Focus on "Arabic for non-native speakers" track
- [ ] Create simplified standards for basic proficiency

---

## Data Accuracy Notes

### British National Curriculum - NEEDS VERIFICATION

**Current Status**: Data created from AI knowledge, not extracted from official source

**What's Accurate**:
- ✅ Overall structure (Key Stages, Years, Strands)
- ✅ Approximate number of standards per year
- ✅ General topics and progression

**What May Need Correction**:
- ⚠️ Exact wording of statutory requirements
- ⚠️ Non-statutory guidance text
- ⚠️ Precise number of standards per strand

**Official Source**:
https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study

**Verification Tasks**:
- [ ] Download official PDF from GOV.UK
- [ ] Compare each standard description word-for-word
- [ ] Update any discrepancies
- [ ] Add any missing standards
- [ ] Verify guidance text for each standard

**Recommended Approach**:
```typescript
// Use Firecrawl extract with schema to pull exact data
const schema = {
  type: "object",
  properties: {
    year: { type: "number" },
    strand: { type: "string" },
    standards: {
      type: "array",
      items: {
        description: { type: "string" },
        isStatutory: { type: "boolean" },
        guidance: { type: "string" }
      }
    }
  }
};
```

---

## Future Enhancements

### Phase 2: Content-Standard Alignment

**Goal**: Automatically align uploaded lessons to curriculum standards

**Implementation**:
```typescript
// AI-powered alignment
async function alignLessonToStandards(lessonId: string) {
  const lesson = await getLesson(lessonId);
  const childStandards = await getStandardsForChild(lesson.childId);

  const prompt = `Analyze this lesson and identify which standards it covers:
    LESSON: ${lesson.content}
    STANDARDS: ${JSON.stringify(childStandards)}

    Return standards with alignment strength (0.0-1.0)`;

  const alignments = await gemini.generate(prompt);

  // Save to ContentStandardAlignment table
  await saveAlignments(lessonId, alignments);
}
```

**Tasks**:
- [ ] Add alignment service
- [ ] Create teacher UI for manual alignment override
- [ ] Show aligned standards on lesson detail page

---

### Phase 3: Progress Tracking

**Goal**: Track child mastery per standard

**Implementation**:
- Update `ChildStandardProgress` after quiz/exercise completion
- Calculate mastery based on:
  - Number of attempts
  - Success rate
  - Recency of practice
- Show progress dashboard to parents

**Mastery Levels**:
| Level | Criteria |
|-------|----------|
| NOT_STARTED | No attempts |
| IN_PROGRESS | <50% success rate |
| APPROACHING | 50-70% success rate |
| PROFICIENT | 70-90% success rate |
| MASTERED | >90% success rate, 3+ attempts |

---

### Phase 4: Curriculum Switching

**Goal**: Enable families to switch curricula with gap analysis

**Flow**:
1. Parent initiates switch: British Year 3 → US Grade 3
2. System queries child's current progress
3. AI generates gap analysis:
   - Standards in target not covered in source
   - Standards where child is ahead
4. Recommend catch-up lessons
5. Store analysis in `CurriculumSwitch` table

**UI Mockup**:
```
┌─────────────────────────────────────────────┐
│  Curriculum Switch Analysis                 │
│  British Year 3 → US Grade 3                │
├─────────────────────────────────────────────┤
│  GAPS (5 standards to catch up):            │
│  • 3.OA.1: Word problems with multiplication│
│  • 3.OA.2: Division word problems           │
│  • ...                                      │
│                                             │
│  AHEAD (2 standards):                       │
│  • Fractions: UK covers 1/3, 1/4 earlier   │
│  • Time: 24-hour clock introduced earlier   │
│                                             │
│  [View Recommended Lessons] [Confirm Switch]│
└─────────────────────────────────────────────┘
```

---

### Phase 5: Cross-Curriculum Equivalence

**Goal**: Map standards across curricula for seamless switching

**Approach**:
1. Use AI to generate initial mappings
2. Store in `StandardEquivalence` table
3. Expert review workflow for verification
4. Confidence scoring

**Example Mapping**:
```json
{
  "source": "UK.KS1.Y1.MA.NPV.1",
  "sourceDescription": "count to and across 100...",
  "target": "1.NBT.1",
  "targetDescription": "Count to 120, starting at any number...",
  "equivalenceType": "PARTIAL",
  "confidence": 0.85,
  "notes": "UK goes to 100, US goes to 120. Both cover forwards/backwards."
}
```

---

## File Reference

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database models |
| `src/config/britishCurriculum.ts` | British NC Mathematics data |
| `scripts/seedBritishCurriculum.ts` | Seed script |
| `src/services/curriculum/curriculumService.ts` | Service layer |
| `src/services/curriculum/index.ts` | Service exports |
| `src/routes/curriculum.routes.ts` | API routes |
| `src/index.ts` | Route registration |
| `docs/CURRICULUM_SYSTEM.md` | This document |

---

## Quick Commands

```bash
# Seed British NC standards
cd backend
npx tsx scripts/seedBritishCurriculum.ts

# Type-check
npx tsc --noEmit

# Test API
curl http://localhost:3001/api/curricula
curl http://localhost:3001/api/curricula/UK_NATIONAL_CURRICULUM/years/3
curl "http://localhost:3001/api/curricula/standards/search?q=fractions"
```

---

## Contact

For questions about the curriculum system, see the plan document:
`/Users/saleemjadallah/.claude/plans/hazy-shimmying-pond.md`
