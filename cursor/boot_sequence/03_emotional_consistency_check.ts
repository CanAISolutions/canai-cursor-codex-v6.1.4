/**
 * 03_emotional_consistency_check.ts
 * 
 * Purpose: Validate that emotional resonance, UX tone, and psychological trust signals remain aligned with CanAI Dream-State standards.
 * Triggered: On boot, pre-output dispatch, periodic emotional audits.
 * Enforces: Emotional consistency, UX magnetism, brand integrity at a subconscious level.
 */

import { calculateEmotionalResonanceScore } from "../utils/dreamstate-utils";
import { emitSystemLog } from "../system-intel/audit-utils";
import { readSelfAwarenessJournal } from "../self-awareness/selfAwarenessJournal";

interface EmotionalConsistencyCheckResult {
  score: number;
  passed: boolean;
  delta?: number;
}

export async function runEmotionalConsistencyCheck(): Promise<EmotionalConsistencyCheckResult> {
  const priorState = await readSelfAwarenessJournal();
  const { score, delta } = calculateEmotionalResonanceScore(priorState);

  const passed = score >= 90; // Slightly looser threshold to allow natural micro-variations

  if (!passed) {
    emitSystemLog("emotional-consistency-failed", { score, delta });
  } else {
    emitSystemLog("emotional-consistency-passed", { score });
  }

  return {
    score,
    passed,
    delta,
  };
}
