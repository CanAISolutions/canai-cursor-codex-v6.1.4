/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "System alignment and compliance verification"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Performs real-time system audits to detect and report misalignments
 * @invokedBy boot sequence, periodic audits, output generation
 * @outputs AlignmentAuditResult with compliance status
 * @integration Uses dream-state utils and modularity checks
 * @codex Ensures system-wide alignment with Codex standards
 */

import { calculateDreamAlignmentScore } from "../utils/dreamstate-utils";
import { validateModularIntegrity } from "../utils/modularity-utils";
import { compareLocalToCanonicalDirectives } from "../utils/codex-memory-utils";
import { emitSystemLog } from "../utils/audit-utils";
import { EventBus } from "../event-bus/eventBus";

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
    issues.push({
      type: "emotional",
      description: "Emotional resonance drift detected.",
      suggestedAction: "Recalibrate emotional UX tone outputs.",
    });
  }

  const modularityIntegrity = await validateModularIntegrity();
  if (!modularityIntegrity.passed) {
    issues.push({
      type: "modular",
      description: "Detected modular snapshot drift or version inconsistency.",
      suggestedAction: "Rebuild modular snapshot and validate exports.",
    });
  }

  const codexCompliance = await compareLocalToCanonicalDirectives();
  if (codexCompliance.upgradesDetected) {
    issues.push({
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

// Event handling
const eventBus = EventBus.getInstance();

function handleCodexAlignment(event: any) {
  const { aligned, issues } = event;
  if (!aligned && issues) {
    emitSystemLog("codex-alignment-issues", { issues });
  }
}

eventBus.on('CODEX_ALIGNMENT_VERIFIED', handleCodexAlignment);
