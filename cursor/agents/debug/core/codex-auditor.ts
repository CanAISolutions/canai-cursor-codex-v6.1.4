/**
 * @file codex-auditor.ts
 * @description Codex Edition v4.1.3 – Automated Patch Auditor.
 * Validates fixes against structural, safety, and policy rules before merge.
 */

import { FixProposal } from './ai-provider';
import { appendToFixContextAsync } from './fix-context-utils';
import { recordMetric } from './telemetry';

/**
 * Runs static, rule-based audits on a proposed fix.
 *
 * @param fixProposal - The proposed patch object.
 * @param traceId - The pipeline trace ID for diagnostics.
 * @returns true if fix passes audit, false if rejected.
 */
export async function auditFix(fixProposal: FixProposal, traceId: string): Promise<boolean> {
  const { patch, filepath, reason } = fixProposal;

  // Rule 1: Required fields must exist
  if (!patch || !filepath || !reason) {
    await appendToFixContextAsync(`[${traceId}] ❌ Audit failed: Missing patch, filepath, or reason.`);
    recordMetric('audit_failed', { traceId, error: 'MISSING_FIELDS' });
    return false;
  }

  // Rule 2: Patch must start with expected diff header
  if (!patch.startsWith('diff --git')) {
    await appendToFixContextAsync(`[${traceId}] ❌ Audit failed: Patch does not start with 'diff --git'.`);
    recordMetric('audit_failed', { traceId, error: 'INVALID_PATCH_FORMAT' });
    return false;
  }

  // Rule 3: Disallow sensitive or system-critical files
  const forbiddenPattern = /\.(env|bashrc|r?sa|key|pem|lock)|(^|\/)(secrets|node_modules|.git|dist)\//;
  if (forbiddenPattern.test(filepath)) {
    await appendToFixContextAsync(`[${traceId}] ❌ Audit failed: Patch targets sensitive file (${filepath}).`);
    recordMetric('audit_failed', { traceId, error: 'FORBIDDEN_FILEPATH', filepath });
    return false;
  }

  // Rule 4: Disallow high-risk patterns in patch content
  const redFlags = [
    'require("child_process")',
    'exec(',
    'rm -rf',
    'eval(',
    'curl',
    'wget',
    'netstat',
    'bash -i',
    'spawn(',
    'subprocess',
  ];
  if (redFlags.some(flag => patch.includes(flag))) {
    await appendToFixContextAsync(`[${traceId}] ❌ Audit failed: Suspicious command detected.`);
    recordMetric('audit_failed', { traceId, error: 'SUSPICIOUS_CODE' });
    return false;
  }

  // Rule 5: Reason must be reasonably descriptive
  if (reason.length < 10) {
    await appendToFixContextAsync(`[${traceId}] ⚠️ Audit warning: Reason too short.`);
    recordMetric('audit_warning', { traceId, warning: 'WEAK_REASON' });
  }

  // ✅ Passed all critical audits
  await appendToFixContextAsync(`[${traceId}] ✅ Audit passed for ${filepath}`);
  recordMetric('audit_passed', { traceId, filepath });
  return true;
}
