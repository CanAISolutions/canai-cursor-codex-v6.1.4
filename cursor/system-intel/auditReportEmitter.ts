// /cursor/system-intel/auditReportEmitter.ts

/**
 * Codex Module: Audit Report Emitter
 * ----------------------------------
 * Emits full system audit summaries for external consumption (CLI, Make, UI).
 * Used in boot sequences, self-healing triggers, evolution audits, and DeltaMap exports.
 * Integrates with audit-utils, modularity-utils, dreamstate-utils, and risk layers.
 *
 * 🧠 Enforces:
 * - Snapshot safety
 * - AI-coauthorable outputs
 * - Evolution traceability
 */

import { runAuditSnapshot } from './audit-utils';
import { getModularityReport } from './modularity-utils';
import { getDreamStateScore } from './dreamstate-utils';
import { getRiskSurface } from './recommendation-utils';
import { generateDeltaMap, logDeltaRecords } from '../self-awareness/deltaMapGenerator';

type AuditReport = {
  timestamp: string;
  systemStatus: 'stable' | 'drifting' | 'critical';
  dreamStateScore: number;
  modularityFindings: Record<string, any>;
  risks: string[];
  notes: string[];
};

/**
 * Generates a full JSON audit report
 */
export function generateAuditReport(): AuditReport {
  const timestamp = new Date().toISOString();
  const modularityFindings = getModularityReport();
  const dreamStateScore = getDreamStateScore();
  const risks = getRiskSurface();
  const notes: string[] = [];

  if (dreamStateScore < 0.6) {
    notes.push('⚠️ Emotional drift detected. Review prompt tone and UX helpers.');
  }

  if (Object.keys(modularityFindings.violations || {}).length > 0) {
    notes.push('⚠️ Modularity violations found. Review folder coupling.');
  }

  if (risks.length > 0) {
    notes.push('⚠️ System risk surfaces active. See `risk-scenarios.md`.');
  }

  const status: AuditReport['systemStatus'] =
    dreamStateScore >= 0.8 && risks.length === 0 && notes.length === 0
      ? 'stable'
      : dreamStateScore < 0.5 || risks.length > 2
        ? 'critical'
        : 'drifting';

  return {
    timestamp,
    systemStatus: status,
    dreamStateScore,
    modularityFindings,
    risks,
    notes,
  };
}

/**
 * Exports report as a markdown string for journaling or manual review
 */
export function exportAuditMarkdown(): string {
  const report = generateAuditReport();

  return `# 🧠 CanAI System Audit Report
**Timestamp:** ${report.timestamp}  
**Status:** ${report.systemStatus.toUpperCase()}  
**Dream-State Score:** ${report.dreamStateScore}

## 🧩 Modularity
\`\`\`json
${JSON.stringify(report.modularityFindings, null, 2)}
\`\`\`

## 🚨 Risks
${report.risks.length > 0 ? report.risks.map(r => `- ${r}`).join('\n') : '✅ No active risks detected.'}

## 📝 Notes
${report.notes.length > 0 ? report.notes.map(n => `- ${n}`).join('\n') : '✅ System within expected parameters.'}
`;
}

/**
 * 🔁 Wrapped version of generateAuditReport + DeltaMap journaling
 * Call this in CLI, boot sequences, or Make instead of generateAuditReport()
 */
export async function runAndLogAudit(): Promise<AuditReport> {
  const report = generateAuditReport();

  const deltas = await generateDeltaMap();
  if (deltas.length > 0) {
    logDeltaRecords(deltas);
  }

  return report;
}
