/**
 * @file log-validator.test.ts
 * @description Unit tests for log-validator.ts — input validation and sanitization logic.
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { validateLog } from '../log-validator';
import { recordMetric } from '../telemetry';
import * as maskModule from '../maskSensitive';
import { DebugConfig } from '../../core/debug-config';

jest.mock('../telemetry');
jest.mock('../maskSensitive');

describe('LogValidator', () => {
  let mockConfig: DebugConfig;

  beforeEach(() => {
    mockConfig = {
      logLevel: 'info',
      maxRetries: 3,
      timeoutMs: 5000,
      includeStackTrace: true,
      maxLogSize: 1000,
      trustThreshold: 0.8,
      validationRules: {
        requireStackTrace: true,
        requireContext: true,
        maxMessageLength: 500
      }
    };
  });

  describe('validateLog', () => {
    it('should validate valid log', () => {
      const input = 'Test log message';
      const result = validateLog(input, mockConfig, 'trace-123');
      expect(result).toBe(true);
    });

    it('should reject empty log', () => {
      expect(() => validateLog('', mockConfig, 'trace-123')).toThrow('Log is empty');
    });

    it('should reject oversized log', () => {
      const largeLog = 'x'.repeat(mockConfig.maxLogSize + 1);
      expect(() => validateLog(largeLog, mockConfig, 'trace-123')).toThrow('Log exceeds maxLogSize');
    });

    it('should validate log with stack trace', () => {
      const input = 'Error: Test error\n    at test.js:10:5';
      validateLog(input, mockConfig, 'trace-123');
    });

    it('should validate log with context', () => {
      const input = '[Context: Test] Test log message';
      const result = validateLog(input, mockConfig, 'trace-123');
      expect(result).toBe(true);
    });
  });
});
