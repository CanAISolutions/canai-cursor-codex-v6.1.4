/**
 * @file log-validator.test.ts
 * @description Unit tests for log-validator.ts — input validation and sanitization logic.
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { validateLog } from '../log-validator';
import { recordMetric } from '../telemetry';
import * as maskModule from '../maskSensitive';
import { DebugConfig } from '../../config/config';

jest.mock('../telemetry');
jest.mock('../maskSensitive');

describe('validateLog', () => {
  const mockConfig: Required<DebugConfig> = {
    trustScoreThreshold: 4.2,
    escalationPriority: 'high',
    concurrencyLimit: 5,
    pipelineTimeoutMs: 30000,
    maxLogSize: 1000,
    maxLogLines: 1000,
    fallbackMode: false,
    dryRun: false,
    aiProvider: 'openai',
    fallbackProvider: 'anthropic',
    aiProviderConfig: {},
    bugDetectionRetries: 3,
    fixProposalRetries: 3
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (maskModule.maskSensitive as jest.Mock).mockImplementation(input => input);
  });

  it('validates and sanitizes valid logs', () => {
    const input = 'Valid log message with Error: test failed';
    const result = validateLog(input, mockConfig, 'trace-123');
    expect(result).toBe(input);
    expect(maskModule.maskSensitive).toHaveBeenCalledWith(input);
  });

  it('rejects empty logs', () => {
    expect(() => validateLog('', mockConfig, 'trace-123')).toThrow('Log is empty');
    expect(recordMetric).toHaveBeenCalledWith('invalid_log_format', {
      traceId: 'trace-123',
      reason: 'empty'
    });
  });

  it('rejects oversized logs', () => {
    const largeLog = 'x'.repeat(mockConfig.maxLogSize + 1);
    expect(() => validateLog(largeLog, mockConfig, 'trace-123')).toThrow('Log exceeds maxLogSize');
    expect(recordMetric).toHaveBeenCalledWith('log_too_large', {
      traceId: 'trace-123',
      size: mockConfig.maxLogSize + 1
    });
  });

  it('flags suspicious log structure', () => {
    const input = 'Just a normal message without error context';
    validateLog(input, mockConfig, 'trace-123');
    expect(recordMetric).toHaveBeenCalledWith('log_suspicious_structure', {
      traceId: 'trace-123'
    });
  });

  it('normalizes line endings', () => {
    const input = 'Line 1\r\nLine 2\r\nLine 3';
    const expected = 'Line 1\nLine 2\nLine 3';
    const result = validateLog(input, mockConfig, 'trace-123');
    expect(result).toBe(expected);
  });
});
