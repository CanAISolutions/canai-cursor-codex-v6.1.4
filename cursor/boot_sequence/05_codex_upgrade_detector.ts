/**
 * 05_codex_upgrade_detector.ts
 * 
 * Purpose: Detect changes in Codex directives, memory modules, or Cursor operating principles to trigger proactive evolution or self-upgrade pathways.
 * Triggered: On boot, Codex reload, forced sync operations, or scheduled integrity audits.
 * Enforces: Evolutionary agility, future-proofing, Codex loyalty.
 */

import { fetchCanonicalCodexDirectives, compareLocalToCanonicalDirectives } from "../codex/codex-memory-utils";
import { emitSystemLog } from "../system-intel/audit-utils";

interface CodexUpgradeDetectionResult {
  upgradesDetected: boolean;
  changes?: string[];
}

export async function detectCodexUpgrades(): Promise<CodexUpgradeDetectionResult> {
  const canonicalDirectives = await fetchCanonicalCodexDirectives();
  const { upgradesDetected, changes } = await compareLocalToCanonicalDirectives(canonicalDirectives);

  if (upgradesDetected) {
    emitSystemLog("codex-upgrade-required", { changes });
  } else {
    emitSystemLog("codex-up-to-date", {});
  }

  return {
    upgradesDetected,
    changes,
  };
}
