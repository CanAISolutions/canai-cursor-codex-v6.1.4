/**
 * tests/codex-gatekeeper.test.ts
 * Unit tests for enforceMergeGate and createPipelineError
 */

import { jest } from '@jest/globals';
import { enforceMergeGate } from '../cursor/agents/debug/core/codex-gatekeeper';
import { execAsync } from '../cursor/agents/debug/utils/shell-utils';
import { appendToFixContextAsync } from '../cursor/agents/debug/context/fix-context-utils';
import { recordMetric } from '../cursor/agents/debug/utils/telemetry';
import fs from 'fs';

jest.mock('../cursor/agents/debug/utils/shell-utils');
jest.mock('../cursor/agents/debug/context/fix-context-utils');
jest.mock('../telemetry');

describe('enforceMergeGate', () => {
  const fixProposal = {
    patch: 'diff --git a/file.js b/file.js\n...',
    filepath: 'file.js',
    reason: 'Fix bug',
  };
  const opts = { traceId: 'test123', createBranch: 'test-branch' };
  const config = {
    token: 'test-token',
    owner: 'test-owner',
    repo: 'test-repo',
    baseBranch: 'main',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (execAsync as any).mockResolvedValue({ stdout: 'file.js', stderr: '' });
    (appendToFixContextAsync as any).mockResolvedValue(undefined);
    (recordMetric as any).mockReturnValue(undefined);
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  });

  it('should apply and commit patch', async () => {
    await enforceMergeGate(fixProposal, opts, config);
    expect(execAsync).toHaveBeenCalledWith(expect.stringContaining('git apply'));
    expect(execAsync).toHaveBeenCalledWith(expect.stringContaining('git commit'));
  });
});
