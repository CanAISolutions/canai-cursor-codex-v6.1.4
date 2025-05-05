/**
 * @file log-validator.test.ts
 * @description Unit tests for log-validator.ts — input validation and sanitization logic.
 */

import { validateLog } from '../utils/log-validator';
import { recordMetric } from '../utils/telemetry';
import * as maskModule from '../utils/maskSensitive';
import { DebugConfig } from '../config';

import { jest } from '@jest/globals';

jest.mock('../utils/telemetry');

describe('validateLog', () => {
  const config: DebugConfig = {
    maxLogSize: 10000,
    aiProvider: 'openai',
    aiProviderConfig: {},
    trustScoreThreshold: 4.2,
  };

  const traceId = 'test-trace';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes valid log and sanitizes output', () => {
    const spy = jest.spyOn(maskModule, 'maskSensitive');
    const log = 'TypeError: Cannot read property';
    const result = validateLog(log, config, traceId);

    expect(result).toContain('[REDACTED');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('TypeError'));
  });

  it('throws on empty log', () => {
    expect(() => validateLog('   ', config, traceId)).toThrowError(/Log is empty/);
    expect(recordMetric).toHaveBeenCalledWith('invalid_log_format', expect.objectContaining({ traceId }));
  });

  it('throws if log exceeds maxLogSize', () => {
    const longLog = 'Error: Overflow'.repeat(2000);
    expect(() => validateLog(longLog, config, traceId)).toThrowError(/Log exceeds maxLogSize/);
    expect(recordMetric).toHaveBeenCalledWith('log_too_large', expect.objectContaining({ traceId }));
  });

  it('flags logs with suspicious structure', () => {
    const oddLog = 'This is a weird string without stack';
    const result = validateLog(oddLog, config, traceId);
    expect(result).toContain('REDACTED');
    expect(recordMetric).toHaveBeenCalledWith('log_suspicious_structure', { traceId });
  });
});
