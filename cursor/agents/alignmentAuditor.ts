/**
 * alignmentAuditor.ts
 * 
 * Purpose: Perform real-time system audits to detect and report misalignments in emotional resonance, modularity, Codex adherence, and operational execution.
 * Triggered: On boot, periodic audit intervals, output generation, or UX dispatch events.
 * Enforces: Dream-state preservation, Codex compliance, UX emotional fidelity.
 */

import { calculateDreamAlignmentScore } from "../utils/dreamstate-utils";
import { validateModularIntegrity } from "../utils/modularity-utils";
import { compareLocalToCanonicalDirectives } from "../codex/codex-memory-utils";
import { emitSystemLog } from "../system-intel/audit-utils";

interface AlignmentAuditResult {
  aligned: boolean;
  issues?: {
    type: "emotional" | "modular" | "codex" | "execution";
    description: string;
    suggestedAction: string;
  }[];
}

export async function runAlignmentAudit(): Promise<AlignmentAuditResult> {
  const issues: AlignmentAuditResult["issues"] = [];

  const dreamAlignment = await calculateDreamAlignmentScore();
  if (dreamAlignment.score < 92) {
    issues?.push({
      type: "emotional",
      description: "Emotional resonance drift detected.",
      suggestedAction: "Recalibrate emotional UX tone outputs.",
    });
  }

  const modularityIntegrity = await validateModularIntegrity();
  if (!modularityIntegrity.passed) {
    issues?.push({
      type: "modular",
      description: "Detected modular snapshot drift or version inconsistency.",
      suggestedAction: "Rebuild modular snapshot and validate exports.",
    });
  }

  const codexCompliance = await compareLocalToCanonicalDirectives();
  if (codexCompliance.upgradesDetected) {
    issues?.push({
      type: "codex",
      description: "Codex upgrades available — local directives outdated.",
      suggestedAction: "Initiate Codex upgrade absorption process.",
    });
  }

  const aligned = (issues.length === 0);

  emitSystemLog("alignment-audit-completed", { aligned, issues });

  return {
    aligned,
    issues: aligned ? undefined : issues,
  };
}
