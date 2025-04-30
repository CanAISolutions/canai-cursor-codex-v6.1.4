// /cursor/system-intel/emotionalRegressionAlert.ts

/**
 * Emotional Regression Alert System
 * ---------------------------------
 * Detects tone decay, emotional inconsistency, or drift from dream-state benchmarks.
 * Designed for use in prompt audits, self-healing loops, and UX testing environments.
 *
 * 🧠 Part of Codex's emotional integrity layer.
 * Can run standalone or be embedded in journaling and delta analysis flows.
 */

import { getDreamStateScore } from './dreamstate-utils';
import { generateAuditReport } from './auditReportEmitter';

type RegressionAlert = {
  timestamp: string;
  currentScore: number;
  priorScore?: number;
  regressionDetected: boolean;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
};

/**
 * Compare two dream-state scores to detect regression.
 * Accepts an optional prior score for diffing.
 */
export function checkEmotionalRegression(currentScore: number, priorScore?: number): RegressionAlert {
  const delta = priorScore !== undefined ? currentScore - priorScore : 0;
  const regressionDetected = delta < -0.15;

  const severity: RegressionAlert['severity'] =
    delta < -0.3 ? 'high' : delta < -0.2 ? 'medium' : 'low';

  const recommendations: string[] = [];

  if (regressionDetected) {
    recommendations.push('🔁 Rerun prompt with emotional reinforcement tag.');
    recommendations.push('🎯 Re-evaluate `tone`, `goal`, and `ux` fields.');
    recommendations.push('🧠 Re-align with `output-emotion-score.md` rubric.');
  }

  return {
    timestamp: new Date().toISOString(),
    currentScore,
    priorScore,
    regressionDetected,
    severity,
    recommendations,
  };
}

/**
 * Run full regression alert based on current system audit
 */
export function runEmotionalAlert(priorScore?: number): RegressionAlert {
  const report = generateAuditReport();
  return checkEmotionalRegression(report.dreamStateScore, priorScore);
}

/**
 * Exports result as markdown for journaling or Copilot review
 */
export function exportRegressionMarkdown(alert: RegressionAlert): string {
  return `# 💔 Emotional Regression Alert

**Timestamp:** ${alert.timestamp}  
**Current Score:** ${alert.currentScore}  
**Prior Score:** ${alert.priorScore ?? 'N/A'}  
**Regression Detected:** ${alert.regressionDetected ? '🚨 YES' : '✅ NO'}  
**Severity:** ${alert.severity.toUpperCase()}

## 📌 Recommendations
${alert.recommendations.length > 0 ? alert.recommendations.map(r => `- ${r}`).join('\n') : '✅ No action needed.'}
`;
}
