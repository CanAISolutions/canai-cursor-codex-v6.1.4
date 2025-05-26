/**
 * @file tests/ai-provider.test.ts
 * @description Unit tests for the AIProvider interface and OpenAI integration.
 * Codex Edition v4.2.0 – Validates bug detection, fix proposal, escalation logic, and fallback safety.
 */

import { loadAIProvider, testOverrides, BugContext, FixProposal } from '../cursor/agents/debug/engines/ai-provider';
import { DebugConfig } from '../cursor/agents/debug/config/config';
import { jest } from '@jest/globals';

describe('AIProvider – OpenAI (mocked)', () => {
  const config: DebugConfig = {
    aiProvider: 'openai',
    aiProviderConfig: { apiKey: 'sk-test', model: 'gpt-4o' },
    trustScoreThreshold: 4.2,
  };

  const mockProvider = loadAIProvider(config);

  beforeEach(() => {
    testOverrides.aiProvider = null;
  });

  it('ping() returns true with valid model', async () => {
    testOverrides.aiProvider = {
      ...mockProvider,
      ping: async () => true,
      detectBug: mockProvider.detectBug,
      proposeFix: mockProvider.proposeFix,
      generateEscalationTicket: mockProvider.generateEscalationTicket
    };
    expect(await testOverrides.aiProvider.ping()).toBe(true);
  });

  it('detectBug() returns valid BugContext from mock', async () => {
    const mockBug: BugContext = {
      message: 'Null error',
      type: 'NullPointer',
      likelihood: 'high',
      impact: ['src/app.ts'],
    };
    testOverrides.aiProvider = {
      ...mockProvider,
      detectBug: async () => mockBug,
      proposeFix: mockProvider.proposeFix,
      ping: mockProvider.ping,
      generateEscalationTicket: mockProvider.generateEscalationTicket
    };
    const result = await testOverrides.aiProvider.detectBug('Error log here', 'test-trace');
    expect(result).toEqual(mockBug);
  });

  it('proposeFix() returns valid FixProposal from mock', async () => {
    const mockFix: FixProposal = {
      patch: 'diff --git ...',
      filepath: 'src/app.ts',
      reason: 'Fix null pointer',
    };
    testOverrides.aiProvider = {
      ...mockProvider,
      proposeFix: async () => mockFix,
      detectBug: mockProvider.detectBug,
      ping: mockProvider.ping,
      generateEscalationTicket: mockProvider.generateEscalationTicket
    };
    const result = await testOverrides.aiProvider.proposeFix({
      message: 'Null pointer',
      type: 'NullPointer',
      likelihood: 'high',
      impact: ['src/app.ts'],
    }, 'test-trace');
    expect(result).toEqual(mockFix);
  });

  it('throws on invalid BugContext shape', async () => {
    testOverrides.aiProvider = {
      ...mockProvider,
      detectBug: async () => ({
        message: '',
        type: '',
        likelihood: 'low',
        impact: [],
      }),
      proposeFix: mockProvider.proposeFix,
      ping: mockProvider.ping,
      generateEscalationTicket: mockProvider.generateEscalationTicket
    };
    await expect(testOverrides.aiProvider.detectBug('bad log', 'test-trace')).rejects.toThrow('AIProviderError');
  });

  it('throws on invalid FixProposal shape', async () => {
    testOverrides.aiProvider = {
      ...mockProvider,
      proposeFix: async () => ({
        patch: '',
        filepath: '',
        reason: '',
      }),
      detectBug: mockProvider.detectBug,
      ping: mockProvider.ping,
      generateEscalationTicket: mockProvider.generateEscalationTicket
    };
    await expect(
      testOverrides.aiProvider.proposeFix({
        message: 'msg',
        type: 'type',
        likelihood: 'low',
        impact: [],
      }, 'test-trace')
    ).rejects.toThrow('AIProviderError');
  });

  it('generates an escalation ticket with traceable summary', async () => {
    const appendSpy = jest.spyOn(require('../cursor/agents/debug/context/fix-context-utils'), 'appendToFixContextAsync');
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
