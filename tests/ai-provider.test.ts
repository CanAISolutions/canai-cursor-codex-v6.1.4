/**
 * @file tests/ai-provider.test.ts
 * @description Unit tests for the AIProvider interface and OpenAI integration.
 * Codex Edition v4.2.0 – Validates bug detection, fix proposal, escalation logic, and fallback safety.
 */

import { loadAIProvider, testOverrides, BugContext, FixProposal } from '../engines/ai-provider';
import { DebugConfig } from '../config';
import { jest } from '@jest/globals';

describe('AIProvider – OpenAI (mocked)', () => {
  const config: DebugConfig = {
    aiProvider: 'openai',
    aiProviderConfig: { apiKey: 'sk-test', model: 'gpt-4o' },
    trustScoreThreshold: 4.2,
  };

  const mockProvider = loadAIProvider(config);

  beforeEach(() => {
    testOverrides.mockResponses = {};
  });

  it('ping() returns true with valid model', async () => {
    mockProvider['openai'] = {
      models: { list: async () => ({ data: [{ id: 'gpt-4o' }] }) }
    } as any;
    expect(await mockProvider.ping()).toBe(true);
  });

  it('detectBug() returns valid BugContext from mock', async () => {
    const mockBug: BugContext = {
      message: 'Null error',
      type: 'NullPointer',
      likelihood: 'high',
      impact: ['src/app.ts'],
    };
    testOverrides.mockResponses.detectBug = mockBug;
    const result = await mockProvider.detectBug('Error log here');
    expect(result).toEqual(mockBug);
  });

  it('proposeFix() returns valid FixProposal from mock', async () => {
    const mockFix: FixProposal = {
      patch: 'diff --git ...',
      filepath: 'src/app.ts',
      reason: 'Fix null pointer',
    };
    testOverrides.mockResponses.proposeFix = mockFix;
    const result = await mockProvider.proposeFix({
      message: 'Null pointer',
      type: 'NullPointer',
      likelihood: 'high',
      impact: ['src/app.ts'],
    });
    expect(result).toEqual(mockFix);
  });

  it('throws on invalid BugContext shape', async () => {
    testOverrides.mockResponses.detectBug = {
      message: '',
      type: '',
      likelihood: 'low',
      impact: [],
    };
    await expect(mockProvider.detectBug('bad log')).rejects.toThrow('AIProviderError');
  });

  it('throws on invalid FixProposal shape', async () => {
    testOverrides.mockResponses.proposeFix = {
      patch: '',
      filepath: '',
      reason: '',
    };
    await expect(
      mockProvider.proposeFix({
        message: 'msg',
        type: 'type',
        likelihood: 'low',
        impact: [],
      })
    ).rejects.toThrow('AIProviderError');
  });

  it('generates an escalation ticket with traceable summary', async () => {
    const appendSpy = jest.spyOn(require('../context/fix-context-utils'), 'appendToFixContextAsync');
    await mockProvider.generateEscalationTicket({
      summary: 'Unable to parse AI response',
      sourceFile: 'src/bug.ts',
      priority: 'high',
    });
    expect(appendSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unable to parse AI response')
    );
    appendSpy.mockRestore();
  });
});
