/**
 * output-delta-analyzer.ts
 * 
 * Purpose: Analyze changes between previous and current outputs to detect semantic, structural, and emotional drift. Enforce evolution safety and UX continuity.
 * Triggered: During smart revision loops, after prompt evolution, or as part of QA audit.
 * Enforces: Output consistency, emotional fidelity, and drift prevention.
 */

import { calculateEmotionalResonanceScore } from "../utils/dreamstate-utils";

type DiffType = "semantic-diff" | "emotional-diff" | "structure-diff";

interface OutputDelta {
  type: DiffType;
  confidence: number; // 0–1
  message: string;
  suggestedAction: string;
}

interface OutputDeltaReport {
  diffs: OutputDelta[];
  majorChangeDetected: boolean;
}

export async function analyzeOutputDelta(previous: string, current: string): Promise<OutputDeltaReport> {
  const diffs: OutputDelta[] = [];
  let majorChange = false;

  if (previous !== current) {
    const prevLength = previous.length;
    const currLength = current.length;
    const structureChangeRatio = Math.abs(prevLength - currLength) / Math.max(prevLength, currLength);

    if (structureChangeRatio > 0.3) {
      diffs.push({
        type: "structure-diff",
        confidence: 0.8,
        message: "Substantial change in output structure.",
        suggestedAction: "Run smart revision or request Copilot QA.",
      });
      majorChange = true;
    }

    const prevEmotion = calculateEmotionalResonanceScore(previous).score;
    const currEmotion = calculateEmotionalResonanceScore(current).score;
    const emotionalDelta = prevEmotion - currEmotion;

    if (Math.abs(emotionalDelta) >= 5) {
      diffs.push({
        type: "emotional-diff",
        confidence: 0.9,
        message: `Emotional resonance changed by ${emotionalDelta} points.`,
        suggestedAction: emotionalDelta < 0
          ? "Reinforce emotional tone or adjust warmth weighting."
          : "Log improvement and proceed.",
      });
      majorChange = majorChange || emotionalDelta < 0;
    }

    // Simplified semantic drift detection placeholder
    if (current.includes("summary") && !previous.includes("summary")) {
      diffs.push({
        type: "semantic-diff",
        confidence: 0.6,
        message: "New semantic pattern detected: addition of summary construct.",
        suggestedAction: "Check if structure change aligns with intent.",
      });
    }
  }

  return {
    diffs,
    majorChangeDetected: majorChange,
  };
}
