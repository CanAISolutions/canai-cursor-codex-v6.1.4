/**
 * 08_generate_action_plan_issues.ts
 * 
 * Purpose: Generate a set of tactical, actionable issues from strategic insights, emotional drifts, modular shifts, or Codex alerts.
 * Triggered: After strategic recommendation generation or health signal analysis.
 * Enforces: Actionability, execution velocity, dream-state preservation.
 */

import { emitStrategicRecommendations } from "./07_strategic_recommendation_emitter";

interface ActionPlanIssue {
  severity: "critical" | "important" | "minor";
  affectedSystem: "emotional" | "modular" | "codex" | "ux" | "integrity";
  description: string;
  firstActionSuggestion: string;
}

export async function generateActionPlanIssues(): Promise<ActionPlanIssue[]> {
  const strategicMoves = await emitStrategicRecommendations();
  const issues: ActionPlanIssue[] = [];

  for (const move of strategicMoves) {
    let severity: ActionPlanIssue["severity"] = "minor";
    if (move.type === "critical") severity = "critical";
    if (move.type === "emotional" || move.type === "modular") severity = "important";

    const affectedSystem = move.type === "emotional"
      ? "emotional"
      : move.type === "modular"
      ? "modular"
      : move.type === "critical"
      ? "integrity"
      : "codex";

    issues.push({
      severity,
      affectedSystem,
      description: move.description,
      firstActionSuggestion: `Investigate and resolve: ${move.description}`,
    });
  }

  return issues;
}
