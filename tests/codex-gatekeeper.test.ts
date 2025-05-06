/**
 * tests/codex-gatekeeper.test.ts
 * Unit tests for enforceMergeGate and createPipelineError
 */

import { jest } from '@jest/globals';
import { enforceMergeGate, createPipelineError } from '../cursor/agents/debug/core/codex-gatekeeper';
import { execAsync } from '../cursor/agents/debug/utils/shell-utils';
import { appendToFixContextAsync } from '../cursor/agents/debug/context/fix-context-utils';
import { recordMetric } from '../cursor/agents/debug/utils/telemetry';
import fs from 'fs';

jest.mock('../shell-utils');
jest.mock('../fix-context-utils');
jest.mock('../telemetry');

describe('enforceMergeGate', () => {
  const fixProposal = {
    patch: 'diff --git a/file.js b/file.js\n...',
    filepath: 'file.js',
    reason: 'Fix bug',
  };
  const opts = { traceId: 'test123' };

  beforeEach(() => {
    jest.clearAllMocks();
    (execAsync as jest.Mock).mockResolvedValue({ stdout: 'file.js' });
    (appendToFixContextAsync as jest.Mock).mockResolvedValue(undefined);
    (recordMetric as jest.Mock).mockReturnValue(undefined);
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  });

  it('should apply and commit patch', async () => {
    await enforceMergeGate(fixProposal, opts);
    expect(execAsync).toHaveBeenCalledWith(expect.stringContaining('git apply'), expect.any(Object));
    expect(execAsync).toHaveBeenCalledWith(expect.stringContaining('git commit'), expect.any(Object));
