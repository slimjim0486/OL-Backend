-- Phase 4.8 — Prerequisite-aware intelligence
-- Adds a PREREQUISITE value to the EdgeType enum (used by the teaching graph
-- to draw directed edges from prerequisite topic → dependent topic), and a
-- PREREQUISITE_GAP value to the NudgeType enum (used by the new
-- generatePrerequisiteGapNudges generator in nudgeService).

ALTER TYPE "EdgeType" ADD VALUE IF NOT EXISTS 'PREREQUISITE';
ALTER TYPE "NudgeType" ADD VALUE IF NOT EXISTS 'PREREQUISITE_GAP';
