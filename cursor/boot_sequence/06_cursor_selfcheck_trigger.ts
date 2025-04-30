/**
 * 06_cursor_selfcheck_trigger.ts
 * 
 * Purpose: Monitor system health signals and automatically trigger a deep self-check if emotional, modular, or Codex drift is detected.
 * Triggered: Dynamically based on health signal thresholds or detected anomalies.
 * Enforces: Continuous resilience, self-healing, and operational self-awareness.
 */

import { runDreamstateAlignmentCheck } from "./01_dreamstate_alignment";
import { runSystemIntegrityAudit } from "./02_system_integrity_audit";
import { runEmotionalConsistencyCheck } from "./03_emotional_consistency_check";
import { emitSystemLog } from "../system-intel/audit-utils";

interface SelfcheckTriggerResult {
  triggered: boolean;
  reasons?: string[];
}

export async function triggerCursorSelfcheckIfNeeded(): Promise<SelfcheckTriggerResult> {
  const dreamstate = await runDreamstateAlignmentCheck();
  const integrity = await runSystemIntegrityAudit();
  const emotional = await runEmotionalConsistencyCheck();

  const reasons: string[] = [];

  if (!dreamstate.passed) reasons.push("Dream-State Misalignment");
  if (!integrity.passed) reasons.push("System Integrity Failure");
  if (!emotional.passed) reasons.push("Emotional Consistency Breach");

  const triggered = reasons.length > 0;

  if (triggered) {
    emitSystemLog("selfcheck-triggered", { reasons });
  } else {
    emitSystemLog("selfcheck-not-triggered", {});
  }

  return {
    triggered,
    reasons: triggered ? reasons : undefined,
  };
}
