/**
 * selfRefineScore.ts
 * 
 * Purpose: Score and evaluate how much a revision or output change improved system quality, emotional resonance, and structural integrity.
 * Triggered: After prompt revisions, drift corrections, or system audits.
 * Enforces: Scientific refinement discipline, UX emotional safeguarding, and operational trust.
 */

import { analyzeOutputDelta } from "../self-healing/output-delta-analyzer";
import { calculateEmotionalResonanceScore } from "../utils/dreamstate-utils";

interface SelfRefineResult {
  refineScore: number; // 0–1
  status: "improved" | "neutral" | "regressed";
  emotionalShift: number;
  structuralShift: number;
  semanticShiftDetected: boolean;
  notes: string[];
}

export async function calculateSelfRefineScore(previous: string, current: string): Promise<SelfRefineResult> {
  const delta = await analyzeOutputDelta(previous, current);
  const prevEmotion = calculateEmotionalResonanceScore(previous).score;
  const currEmotion = calculateEmotionalResonanceScore(current).score;
  const emotionalShift = currEmotion - prevEmotion;

  let refineScore = 1;
  const notes: string[] = [];

  if (delta.majorChangeDetected) {
    refineScore -= 0.2;
    notes.push("Major structural or semantic drift detected.");
  }

  if (emotionalShift < -5) {
    refineScore -= 0.3;
    notes.push(`Emotional resonance dropped by ${emotionalShift} points.`);
  } else if (emotionalShift > 5) {
    refineScore += 0.2;
    notes.push(`Emotional resonance improved by ${emotionalShift} points.`);
  }

  refineScore = Math.max(0, Math.min(1, refineScore));

  let status: SelfRefineResult["status"] = "neutral";
  if (refineScore >= 0.8) status = "improved";
  if (refineScore <= 0.5) status = "regressed";

  return {
    refineScore,
    status,
    emotionalShift,
    structuralShift: delta.diffs.filter(d => d.type === "structure-diff").length,
    semanticShiftDetected: delta.diffs.some(d => d.type === "semantic-diff"),
    notes,
  };
}
