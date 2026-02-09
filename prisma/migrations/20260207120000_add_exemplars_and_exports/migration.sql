-- Enable pgvector extension for vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Add QTI to ExportFormat enum
ALTER TYPE "ExportFormat" ADD VALUE IF NOT EXISTS 'QTI';

-- Create ExemplarStatus enum
DO $$ BEGIN
  CREATE TYPE "ExemplarStatus" AS ENUM ('UPLOADING', 'PROCESSING', 'READY', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create ExemplarDocument table
CREATE TABLE "ExemplarDocument" (
  "id" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "uploadedById" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "originalFilename" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "r2Key" TEXT NOT NULL,
  "r2Url" TEXT,
  "pageCount" INTEGER,
  "totalChunks" INTEGER NOT NULL DEFAULT 0,
  "status" "ExemplarStatus" NOT NULL DEFAULT 'UPLOADING',
  "errorMessage" TEXT,
  "subject" "Subject",
  "gradeLevel" TEXT,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "processedAt" TIMESTAMP(3),

  CONSTRAINT "ExemplarDocument_pkey" PRIMARY KEY ("id")
);

-- Create ExemplarChunk table
CREATE TABLE "ExemplarChunk" (
  "id" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "schoolId" TEXT NOT NULL,
  "chunkIndex" INTEGER NOT NULL,
  "content" TEXT NOT NULL,
  "tokenCount" INTEGER NOT NULL DEFAULT 0,
  "embedding" vector(768),
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ExemplarChunk_pkey" PRIMARY KEY ("id")
);

-- Indexes for ExemplarDocument
CREATE INDEX "ExemplarDocument_schoolId_idx" ON "ExemplarDocument"("schoolId");
CREATE INDEX "ExemplarDocument_schoolId_subject_idx" ON "ExemplarDocument"("schoolId", "subject");
CREATE INDEX "ExemplarDocument_status_idx" ON "ExemplarDocument"("status");

-- Indexes for ExemplarChunk
CREATE INDEX "ExemplarChunk_documentId_idx" ON "ExemplarChunk"("documentId");
CREATE INDEX "ExemplarChunk_schoolId_idx" ON "ExemplarChunk"("schoolId");

-- HNSW index for fast cosine similarity search on embeddings
CREATE INDEX "ExemplarChunk_embedding_idx" ON "ExemplarChunk"
  USING hnsw ("embedding" vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Foreign keys
ALTER TABLE "ExemplarDocument" ADD CONSTRAINT "ExemplarDocument_schoolId_fkey"
  FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExemplarDocument" ADD CONSTRAINT "ExemplarDocument_uploadedById_fkey"
  FOREIGN KEY ("uploadedById") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ExemplarChunk" ADD CONSTRAINT "ExemplarChunk_documentId_fkey"
  FOREIGN KEY ("documentId") REFERENCES "ExemplarDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
