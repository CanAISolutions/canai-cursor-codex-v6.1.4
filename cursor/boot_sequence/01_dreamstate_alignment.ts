/**
 * 01_dreamstate_alignment.ts
 * 
 * Purpose: Ensure emotional, architectural, and operational alignment with CanAI Dream-State
 * Triggered: On boot, self-check, agent activation, or periodic system refresh
 * Enforces: Codex compliance, UX tone integrity, modular architecture trust
 */

import { calculateDreamAlignmentScore } from "../utils/dreamstate-utils";
import { readSelfAwarenessJournal, recordAlignmentDelta } from "../self-awareness/selfAwarenessJournal";
import { emitSystemLog } from "../system-intel/audit-utils";

interface DreamstateAlignmentResult {
  score: number;
  passed: boolean;
  issues?: string[];
}

export async function runDreamstateAlignmentCheck(): Promise<DreamstateAlignmentResult> {
  const priorState = await readSelfAwarenessJournal();
  const { score, issues } = calculateDreamAlignmentScore(priorState);

  const passed = score >= 92; // Codex-mandated threshold

  if (!passed) {
    emitSystemLog("dream-alignment-failed", {
      score,
      issues,
    });
  } else {
    emitSystemLog("dream-alignment-passed", { score });
  }

  await recordAlignmentDelta({ score, passed, timestamp: Date.now() });

  return {
    score,
    passed,
    issues: passed ? undefined : issues,
  };
}
