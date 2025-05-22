import { detectBug, inferBugContext, BugType } from '../cursor/agents/debug/core/blast-mapper';
import { AIProvider, BugContext } from '../cursor/agents/debug/engines/ai-provider';
import { DebugConfig } from '../cursor/agents/debug/config/config';
import { appendToFixContextAsync } from '../cursor/agents/debug/context/fix-context-utils';
import { recordMetric } from '../cursor/agents/debug/utils/telemetry';
import { jest } from '@jest/globals';

jest.mock('../cursor/agents/debug/context/fix-context-utils');
jest.mock('../cursor/agents/debug/utils/telemetry');

describe('blast-mapper', () => {
  const mockAIProvider: Partial<AIProvider> = {
    detectBug: jest.fn(async (log: string, traceId: string): Promise<BugContext> => ({
      message: 'Mock bug',
      type: BugType.NullPointer,
      likelihood: 'high',
      impact: ['file.js'],
    })),
    generateEscalationTicket: jest.fn(async (input) => Promise.resolve()),
    proposeFix: jest.fn(async (bug: BugContext, traceId: string) => Promise.resolve({ patch: '', filepath: '', reason: '' })),
    ping: jest.fn(async () => Promise.resolve(true)),
  };

  const config: DebugConfig = {
    bugDetectionRetries: 2,
    escalationPriority: 'high',
  };

  const traceId = 'test123';
  const log = 'Error: null reference (file.js:10:5)';

  beforeEach(() => {
    jest.clearAllMocks();
    (recordMetric as jest.Mock).mockReturnValue(undefined);
  });

  it('detects bug with AI', async () => {
    const bugContext: BugContext = {
      message: 'Null error',
      type: BugType.NullPointer,
      likelihood: 'high',
      impact: ['file.js'],
    };

    (mockAIProvider.detectBug as jest.Mock).mockImplementation(async () => bugContext);

    const result = await detectBug(log, mockAIProvider as AIProvider, config, traceId);

    expect(result).toEqual(bugContext);
    expect(recordMetric).toHaveBeenCalledWith(
      'bug_detected',
      expect.objectContaining({ type: BugType.NullPointer })
    );
  });

  it('falls back to inference on AI failure', async () => {
    (mockAIProvider.detectBug as jest.Mock).mockImplementation(async () => { throw new Error('AI failed'); });

    const result = await detectBug(log, mockAIProvider as AIProvider, config, traceId);

    expect(result.type).toBe(BugType.NullPointer);
    expect(result.impact).toContain('file.js');
    expect((mockAIProvider.generateEscalationTicket as jest.Mock)).toHaveBeenCalled();
  });

  it('infers bug context correctly', () => {
    const result = inferBugContext(log);

    expect(result.type).toBe(BugType.NullPointer);
    expect(result.impact).toContain('file.js');
    expect(result.message.length).toBeLessThanOrEqual(1000);
  });

  it('limits log lines for performance', () => {
    const largeLog = Array(200).fill('Error: null reference (file.js:10:5)').join('\n');

    const result = inferBugContext(largeLog);

    expect(result.impact).toHaveLength(1); // Deduplicated
  });
});
