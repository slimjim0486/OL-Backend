/**
 * Material Import Service — Teacher Intelligence Platform
 * Handles bulk upload of teacher materials (PDFs, images, text files),
 * auto-tags them via Gemini Flash, and populates the library + teaching graph.
 */
import { prisma } from '../../config/database.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { ImportStatus, IntelligenceMaterialType } from '@prisma/client';

// ============================================
// TYPES
// ============================================

interface ImportFile {
  name: string;
  content: string;   // base64 or text content
  mimeType: string;
}

interface GeminiAnalysisResult {
  title: string;
  subject: string;
  topics: string[];
  standards: string[];
  gradeLevel: string;
  materialType: string;
  summary: string;
}

interface ImportError {
  fileName: string;
  error: string;
}

const FLASH_MODEL = config.gemini.models.flash;

// Valid IntelligenceMaterialType values for safe mapping
const VALID_MATERIAL_TYPES = new Set<string>([
  'WORKSHEET', 'QUIZ', 'FLASHCARDS', 'INFOGRAPHIC', 'SUMMARY',
  'RETEACH_ACTIVITY', 'PARENT_UPDATE', 'SUB_PLAN', 'LESSON_PLAN', 'AUDIO_UPDATE',
]);

// ============================================
// IMPORT JOB MANAGEMENT
// ============================================

/**
 * Create an import job record and queue it for async processing.
 */
async function createImportJob(
  teacherId: string,
  files: ImportFile[]
) {
  const job = await prisma.materialImportJob.create({
    data: {
      teacherId,
      totalFiles: files.length,
      status: ImportStatus.PENDING,
    },
  });

  // Store file data in a temporary structure for the worker to pick up.
  // We use Redis to avoid passing large payloads through BullMQ job data.
  // The worker will read and delete this key.
  try {
    const { redis } = await import('../../config/redis.js');
    await redis.set(
      `import-files:${job.id}`,
      JSON.stringify(files),
      'EX',
      3600 // 1 hour TTL
    );
  } catch (err) {
    logger.error('Failed to store import files in Redis', { jobId: job.id, error: (err as Error).message });
    // Clean up the job record since we can't proceed
    await prisma.materialImportJob.update({
      where: { id: job.id },
      data: { status: ImportStatus.FAILED, errors: [{ fileName: 'system', error: 'Failed to store files for processing' }] },
    });
    throw new Error('Failed to queue import job');
  }

  // Queue the BullMQ job
  try {
    const { queueMaterialImport } = await import('../../jobs/materialImportJob.js');
    await queueMaterialImport({ jobId: job.id, teacherId });
  } catch (err) {
    logger.error('Failed to queue material import job', { jobId: job.id, error: (err as Error).message });
  }

  return job;
}

/**
 * Get the current status and progress of an import job.
 */
async function getImportJobStatus(teacherId: string, jobId: string) {
  const job = await prisma.materialImportJob.findFirst({
    where: { id: jobId, teacherId },
  });

  if (!job) {
    throw new Error('Import job not found');
  }

  return job;
}

// ============================================
// PROCESSING
// ============================================

/**
 * Process all files in an import job. Called by the BullMQ worker.
 * For each file: analyze via Gemini Flash, create TeacherMaterial, update graph.
 */
async function processImportJob(jobId: string) {
  // Mark as processing
  const job = await prisma.materialImportJob.update({
    where: { id: jobId },
    data: { status: ImportStatus.PROCESSING },
  });

  const teacherId = job.teacherId;

  // Retrieve files from Redis
  let files: ImportFile[];
  try {
    const { redis } = await import('../../config/redis.js');
    const filesJson = await redis.get(`import-files:${jobId}`);
    if (!filesJson) {
      throw new Error('Import files not found in Redis (expired or missing)');
    }
    files = JSON.parse(filesJson);
    // Clean up Redis key
    await redis.del(`import-files:${jobId}`);
  } catch (err) {
    await prisma.materialImportJob.update({
      where: { id: jobId },
      data: {
        status: ImportStatus.FAILED,
        errors: [{ fileName: 'system', error: (err as Error).message }],
      },
    });
    throw err;
  }

  // Load teacher profile for context
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      gradeRange: true,
      primarySubject: true,
      preferredCurriculum: true,
    },
  });

  const errors: ImportError[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      // Analyze via Gemini Flash
      const analysis = await analyzeFile(file, teacher);

      // Map materialType string to enum value
      const materialType = mapMaterialType(analysis.materialType);

      // Create TeacherMaterial record
      const material = await prisma.teacherMaterial.create({
        data: {
          teacherId,
          title: analysis.title || file.name,
          type: materialType,
          content: { summary: analysis.summary, importedFrom: file.name, mimeType: file.mimeType },
          subject: analysis.subject || teacher?.primarySubject || 'general',
          topics: analysis.topics || [],
          standards: analysis.standards || [],
          gradeLevel: analysis.gradeLevel || teacher?.gradeRange || 'unknown',
          curriculum: teacher?.preferredCurriculum || 'AMERICAN',
        },
      });

      // Update the teaching graph (thought-centric: MATERIAL + TOPIC nodes, no STANDARD nodes)
      try {
        const { teachingGraphService } = await import('./teachingGraphService.js');

        // Use processMaterial to create MATERIAL node, link to topics, and update weights
        await teachingGraphService.processMaterial(
          teacherId,
          material.id,
          material.title,
          analysis.subject || material.subject,
          analysis.topics || [],
        );
      } catch (graphErr) {
        // Non-fatal: graph update failure shouldn't block import
        logger.error('Failed to update graph from imported material', {
          jobId,
          fileName: file.name,
          error: (graphErr as Error).message,
        });
      }

      // Update progress: succeeded
      await prisma.materialImportJob.update({
        where: { id: jobId },
        data: {
          processed: { increment: 1 },
          succeeded: { increment: 1 },
        },
      });

      logger.info('Imported material successfully', {
        jobId,
        fileName: file.name,
        materialId: material.id,
      });
    } catch (fileErr) {
      const errorMessage = fileErr instanceof Error ? fileErr.message : 'Unknown error';
      errors.push({ fileName: file.name, error: errorMessage });

      // Update progress: failed
      await prisma.materialImportJob.update({
        where: { id: jobId },
        data: {
          processed: { increment: 1 },
          failed: { increment: 1 },
        },
      });

      logger.error('Failed to import material', {
        jobId,
        fileName: file.name,
        error: errorMessage,
      });
    }
  }

  // Mark job as completed
  const finalStatus = errors.length === files.length ? ImportStatus.FAILED : ImportStatus.COMPLETED;
  await prisma.materialImportJob.update({
    where: { id: jobId },
    data: {
      status: finalStatus,
      errors: errors.length > 0 ? (errors as any) : undefined,
    },
  });

  // Send SSE event to notify teacher
  try {
    const { sseService } = await import('./sseService.js');
    sseService.sendEvent(teacherId, {
      type: 'import-complete',
      data: {
        jobId,
        status: finalStatus,
        totalFiles: files.length,
        succeeded: files.length - errors.length,
        failed: errors.length,
      },
    });
  } catch (sseErr) {
    // Non-fatal
    logger.error('Failed to send import SSE event', { error: (sseErr as Error).message });
  }

  logger.info('Material import job completed', {
    jobId,
    teacherId,
    total: files.length,
    succeeded: files.length - errors.length,
    failed: errors.length,
  });
}

// ============================================
// GEMINI ANALYSIS
// ============================================

function buildAnalysisPrompt(
  fileName: string,
  content: string,
  mimeType: string,
  teacherProfile: { gradeRange?: string | null; primarySubject?: string | null; preferredCurriculum?: string | null } | null
): string {
  const gradeInfo = teacherProfile?.gradeRange || 'unknown';
  const subjectInfo = teacherProfile?.primarySubject || 'unknown';
  const curriculumInfo = teacherProfile?.preferredCurriculum || 'unknown';

  return `You are an AI assistant that analyzes educational materials uploaded by teachers.

Teacher context:
- Grade level: ${gradeInfo}
- Subject: ${subjectInfo}
- Curriculum: ${curriculumInfo}

Analyze the following uploaded file and extract structured metadata.

File name: ${fileName}
File type: ${mimeType}

Content:
"""
${content}
"""

Extract the following:
1. **title**: A concise title for this material (if not obvious, generate one from the content)
2. **subject**: The primary academic subject (e.g., "mathematics", "science", "english", "social studies"). Use lowercase.
3. **topics**: Specific topics or concepts covered (e.g., "fractions", "water cycle"). Use lowercase. Array of strings.
4. **standards**: Any curriculum standards that could be linked to this content. Provide standard codes (e.g., "CCSS.MATH.CONTENT.3.NF.A.1"). Array of strings.
5. **gradeLevel**: The target grade level (e.g., "3rd", "K-2", "5th-6th")
6. **materialType**: Classify as one of: WORKSHEET, QUIZ, FLASHCARDS, INFOGRAPHIC, SUMMARY, RETEACH_ACTIVITY, PARENT_UPDATE, SUB_PLAN, LESSON_PLAN, AUDIO_UPDATE
7. **summary**: A 1-2 sentence summary of the material's content and purpose.

IMPORTANT: Extract what's actually in the content. Don't invent information. If a field cannot be determined, use reasonable defaults based on the teacher's profile.

Respond with ONLY valid JSON:
{
  "title": "string",
  "subject": "string",
  "topics": ["string"],
  "standards": ["string"],
  "gradeLevel": "string",
  "materialType": "string",
  "summary": "string"
}`;
}

async function analyzeFile(
  file: ImportFile,
  teacherProfile: { gradeRange?: string | null; primarySubject?: string | null; preferredCurriculum?: string | null } | null
): Promise<GeminiAnalysisResult> {
  const prompt = buildAnalysisPrompt(file.name, file.content, file.mimeType, teacherProfile);

  const model = genAI.getGenerativeModel({
    model: FLASH_MODEL,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2000,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  let analysis: GeminiAnalysisResult;
  try {
    analysis = JSON.parse(text);
  } catch {
    // Try extracting JSON from markdown code block
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      analysis = JSON.parse(jsonMatch[1]);
    } else {
      logger.warn('Failed to parse import analysis response', { text: text.substring(0, 500), fileName: file.name });
      // Return sensible defaults
      analysis = {
        title: file.name,
        subject: teacherProfile?.primarySubject || 'general',
        topics: [],
        standards: [],
        gradeLevel: teacherProfile?.gradeRange || 'unknown',
        materialType: 'WORKSHEET',
        summary: 'Imported material',
      };
    }
  }

  // Normalize arrays
  analysis.topics = analysis.topics || [];
  analysis.standards = analysis.standards || [];

  return analysis;
}

/**
 * Map a Gemini-returned material type string to a valid IntelligenceMaterialType enum.
 * Falls back to WORKSHEET if unrecognized.
 */
function mapMaterialType(typeStr: string): IntelligenceMaterialType {
  const normalized = (typeStr || '').toUpperCase().replace(/[\s-]/g, '_');
  if (VALID_MATERIAL_TYPES.has(normalized)) {
    return normalized as IntelligenceMaterialType;
  }
  // Common mappings
  if (normalized.includes('LESSON')) return IntelligenceMaterialType.LESSON_PLAN;
  if (normalized.includes('TEST') || normalized.includes('ASSESSMENT')) return IntelligenceMaterialType.QUIZ;
  if (normalized.includes('FLASH')) return IntelligenceMaterialType.FLASHCARDS;
  if (normalized.includes('SUB')) return IntelligenceMaterialType.SUB_PLAN;
  return IntelligenceMaterialType.WORKSHEET;
}

// ============================================
// EXPORTS
// ============================================

export const materialImportService = {
  createImportJob,
  getImportJobStatus,
  processImportJob,
};
