import { detectBug, inferBugContext, BugType } from '../blast-mapper';
import { AIProvider } from '../ai-provider';
import { DebugConfig } from '../config';
import { appendToFixContextAsync } from '../fix-context-utils';
import { recordMetric } from '../telemetry';
import { jest } from '@jest/globals';

jest.mock('../fix-context-utils');
jest.mock('../telemetry');

describe('blast-mapper', () => {
  const mockAIProvider: Partial<AIProvider> = {
    detectBug: jest.fn(),
    generateEscalationTicket: jest.fn().mockResolvedValue(undefined),
  };

  const config: DebugConfig = {
    bugDetectionRetries: 2,
    escalationPriority: 'high',
  };

  const traceId = 'test123';
  const log = 'Error: null reference (file.js:10:5)';

  beforeEach(() => {
    jest.clearAllMocks();
    (mockAIProvider.detectBug as jest.Mock).mockReset();
    (appendToFixContextAsync as jest.Mock).mockResolvedValue(undefined);
    (recordMetric as jest.Mock).mockReturnValue(undefined);
  });

  it('detects bug with AI', async () => {
    const bugContext = {
      message: 'Null error',
      type: BugType.NullPointer,
      likelihood: 'high',
      impact: ['file.js'],
    };

    (mockAIProvider.detectBug as jest.Mock).mockResolvedValue(bugContext);

    const result = await detectBug(log, mockAIProvider as AIProvider, config, traceId);

    expect(result).toEqual(bugContext);
    expect(recordMetric).toHaveBeenCalledWith(
      'bug_detected',
      expect.objectContaining({ type: BugType.NullPointer })
    );
  });

  it('falls back to inference on AI failure', async () => {
    (mockAIProvider.detectBug as jest.Mock).mockRejectedValue(new Error('AI failed'));

    const result = await detectBug(log, mockAIProvider as AIProvider, config, traceId);

    expect(result.type).toBe(BugType.NullPointer);
    expect(result.impact).toContain('file.js');
    expect(mockAIProvider.generateEscalationTicket).toHaveBeenCalled();
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
