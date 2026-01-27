-- AlterEnum
ALTER TYPE "TokenOperation" ADD VALUE IF NOT EXISTS 'GAMES';

-- CreateEnum
CREATE TYPE "DailyGameType" AS ENUM ('CONNECTIONS', 'ICEBREAKER');

-- CreateTable
CREATE TABLE "DailyGame" (
  "id" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "gameType" "DailyGameType" NOT NULL,
  "key" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "source" TEXT,
  "modelUsed" TEXT,
  "tokensUsed" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "DailyGame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyGame_date_gameType_key_key" ON "DailyGame"("date", "gameType", "key");

-- CreateIndex
CREATE INDEX "DailyGame_gameType_date_idx" ON "DailyGame"("gameType", "date");
