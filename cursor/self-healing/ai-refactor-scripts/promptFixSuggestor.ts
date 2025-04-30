/**
 * promptFixSuggestor.ts
 * 
 * Purpose: Generate targeted suggestions to fix emotional, semantic, or structural issues in prompt outputs, based on delta and refine evaluations.
 * Triggered: During revision loops or audit cycles after drift or low selfRefineScore.
 * Enforces: Precision prompt evolution, Copilot guidance, and UX safety.
 */

import { SelfRefineResult } from "./selfRefineScore";

export interface PromptFixSuggestion {
  type: "tone-adjust" | "structure-reorder" | "clarity-boost" | "redundancy-trim" | "emotional-amp";
  reason: string;
  priority: "low" | "medium" | "high";
}

export function suggestPromptFixes(refineResult: SelfRefineResult): PromptFixSuggestion[] {
  const suggestions: PromptFixSuggestion[] = [];

  if (refineResult.emotionalShift < -5) {
    suggestions.push({
      type: "emotional-amp",
      reason: `Detected emotional decay of ${refineResult.emotionalShift} points.`,
      priority: "high",
    });
  }

  if (refineResult.structuralShift >= 1) {
    suggestions.push({
      type: "structure-reorder",
      reason: "Structure changed significantly — may require refactoring output flow.",
      priority: "medium",
    });
  }

  if (refineResult.semanticShiftDetected) {
    suggestions.push({
      type: "clarity-boost",
      reason: "Semantic pattern changed unexpectedly — clarity may be reduced.",
      priority: "medium",
    });
  }

  if (refineResult.status === "regressed") {
    suggestions.push({
      type: "tone-adjust",
      reason: "Overall refinement score dropped — tone may be mismatched.",
      priority: "high",
    });
  }

  if (refineResult.refineScore < 0.6) {
    suggestions.push({
      type: "redundancy-trim",
      reason: "Low refinement score suggests bloat — trim and refocus structure.",
      priority: "low",
    });
  }

  return suggestions;
}
