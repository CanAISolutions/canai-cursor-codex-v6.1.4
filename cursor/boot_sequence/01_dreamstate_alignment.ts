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
  const score = calculateDreamAlignmentScore(priorState, { state: 'target', context: 'alignment-check' });
  const issues: string[] = [];

  const passed = score >= 92; // Codex-mandated threshold

  if (!passed) {
    issues.push('Dream alignment score below threshold');
    await emitSystemLog("dream-alignment-failed", {
      path: "cursor/logs/dreamstate-alignment.log",
      content: `Dream alignment failed: score=${score}, issues=${JSON.stringify(issues)}`
    });
  } else {
    await emitSystemLog("dream-alignment-passed", {
      path: "cursor/logs/dreamstate-alignment.log", 
      content: `Dream alignment passed: score=${score}`
    });
  }

  await recordAlignmentDelta({ lastEmotionalScore: score });

  return {
    score,
    passed,
    issues: passed ? undefined : issues,
  };
}
