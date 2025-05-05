/**
 * @file codex-auditor.test.ts
 * @description Tests for auditFix – verifies structural, security, and policy rule enforcement.
 */

import { auditFix } from '../core/codex-auditor';
import { appendToFixContextAsync } from '../core/fix-context-utils';
import { recordMetric } from '../core/telemetry';
import { jest } from '@jest/globals';

jest.mock('../core/fix-context-utils');
jest.mock('../core/telemetry');

describe('auditFix()', () => {
  const baseFix = {
    patch: 'diff --git a/app.js b/app.js\n--- a/app.js\n+++ b/app.js\n@@ ...',
    filepath: 'src/app.js',
    reason: 'Fix missing null check',
  };

  const traceId = 'test-audit';

  beforeEach(() => {
    jest.clearAllMocks();
    (appendToFixContextAsync as jest.Mock).mockResolvedValue(undefined);
    (recordMetric as jest.Mock).mockReturnValue(undefined);
  });

  it('passes a valid fix', async () => {
    const result = await auditFix(baseFix, traceId);
    expect(result).toBe(true);
    expect(recordMetric).toHaveBeenCalledWith('audit_passed', expect.objectContaining({ traceId }));
  });

  it('fails if patch is missing', async () => {
    const result = await auditFix({ ...baseFix, patch: '' }, traceId);
    expect(result).toBe(false);
    expect(recordMetric).toHaveBeenCalledWith('audit_failed', expect.objectContaining({ error: 'MISSING_FIELDS' }));
  });

  it('fails if patch does not start with diff --git', async () => {
    const result = await auditFix({ ...baseFix, patch: '+++ file.js\n--- file.js' }, traceId);
    expect(result).toBe(false);
    expect(recordMetric).toHaveBeenCalledWith('audit_failed', expect.objectContaining({ error: 'INVALID_PATCH_FORMAT' }));
  });

  it('fails if filepath is sensitive', async () => {
    const result = await auditFix({ ...baseFix, filepath: '.env' }, traceId);
    expect(result).toBe(false);
    expect(recordMetric).toHaveBeenCalledWith('audit_failed', expect.objectContaining({ error: 'FORBIDDEN_FILEPATH' }));
  });

  it('fails if patch includes dangerous command', async () => {
    const result = await auditFix({ ...baseFix, patch: 'diff --git ...\n+ exec("rm -rf /")' }, traceId);
    expect(result).toBe(false);
    expect(recordMetric).toHaveBeenCalledWith('audit_failed', expect.objectContaining({ error: 'SUSPICIOUS_CODE' }));
  });

  it('warns if reason is too short but still passes', async () => {
    const result = await auditFix({ ...baseFix, reason: 'Fix' }, traceId);
    expect(result).toBe(true);
    expect(recordMetric).toHaveBeenCalledWith('audit_warning', expect.objectContaining({ warning: 'WEAK_REASON' }));
    expect(recordMetric).toHaveBeenCalledWith('audit_passed', expect.objectContaining({ traceId }));
  });
});
