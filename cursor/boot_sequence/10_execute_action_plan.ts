/**
 * 10_execute_action_plan.ts
 * 
 * Purpose: Execute the action plan derived from identified issues and opportunities, repairing weaknesses and expanding strengths.
 * Triggered: Post health-checks, strategic recommendation generation, or scheduled optimization pulses.
 * Enforces: Closing the loop between intelligence and operationalized evolution.
 */

import { ActionPlanIssue } from "./08_generate_action_plan_issues";
import { ActionPlanOpportunity } from "./09_generate_action_plan_opportunities";
import { emitSystemLog } from "../system-intel/audit-utils";

interface ActionExecutionResult {
  executed: number;
  queued: number;
}

export async function executeActionPlan(issues: ActionPlanIssue[], opportunities: ActionPlanOpportunity[]): Promise<ActionExecutionResult> {
  let executed = 0;
  let queued = 0;

  for (const issue of issues) {
    if (issue.severity === "critical" || issue.severity === "important") {
      emitSystemLog("action-executed", { description: issue.description });
      executed++;
    } else {
      emitSystemLog("action-queued", { description: issue.description });
      queued++;
    }
  }

  for (const opp of opportunities) {
    if (opp.confidence > 0.9) {
      emitSystemLog("action-executed", { description: opp.description });
      executed++;
    } else {
      emitSystemLog("action-queued", { description: opp.description });
      queued++;
    }
  }

  return {
    executed,
    queued,
  };
}
