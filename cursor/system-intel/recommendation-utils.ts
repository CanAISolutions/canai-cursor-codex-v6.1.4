/**
 * recommendation-utils.ts
 * 
 * Purpose: Generate strategic improvement suggestions from system audit data.
 * Used in dashboards, Copilot revisions, and prompt evolution planners.
 */

import { AuditReport } from "./audit-utils";

export type RecommendationType = "structure" | "tone" | "prompt" | "modularity" | "directive";

export interface CodexRecommendation {
  type: RecommendationType;
  reason: string;
  priority: "low" | "medium" | "high";
  action: string;
}

export function generateCodexRecommendations(audit: AuditReport): CodexRecommendation[] {
  const recs: CodexRecommendation[] = [];

  if (audit.modularityScore < 0.7) {
    recs.push({
      type: "modularity",
      reason: "Structural cohesion is critically low.",
      priority: "high",
      action: "Split large files into scoped modules by intent.",
    });
  }

  if (audit.directiveCoverage.percent < 90) {
    recs.push({
      type: "directive",
      reason: "Not all Codex directives are currently enforced in logic.",
      priority: "high",
      action: "Backfill directive-aware logic into uncovered areas.",
    });
  }

  if (audit.emotionalResonanceScore < 75) {
    recs.push({
      type: "tone",
      reason: "Tone score is below threshold for emotionally magnetic UX.",
      priority: "medium",
      action: "Inject clear, empowering phrasing into prompt or output templates.",
    });
  }

  if (audit.uxConsistencyScore < 0.75) {
    recs.push({
      type: "structure",
      reason: "UX flow consistency is at risk.",
      priority: "medium",
      action: "Revalidate prompt output templates for flow and style.",
    });
  }

  return recs;
}
