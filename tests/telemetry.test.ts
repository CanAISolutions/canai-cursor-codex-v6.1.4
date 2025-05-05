/**
 * tests/telemetry.test.ts
 * Unit tests for telemetry functions
 */

import { jest } from '@jest/globals';
import { recordMetric, readMetrics, clearMetrics, testOverrides } from '../telemetry';

describe('telemetry', () => {
  beforeEach(() => {
    testOverrides.appendFileAsync = jest.fn().mockResolvedValue(undefined);
    testOverrides.readFileAsync = jest.fn().mockResolvedValue('');
    testOverrides.writeFileAsync = jest.fn().mockResolvedValue(undefined);
    testOverrides.mkdirSync = jest.fn();
    testOverrides.existsSync = jest.fn().mockReturnValue(true);
  });

  it('should record metric to file', async () => {
    await recordMetric('test_metric', { value: 42 }, 'trace123');

    expect(testOverrides.appendFileAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('"metricName":"test_metric"'),
      { encoding: 'utf-8' }
    );
  });

  it('should read metrics from file', async () => {
    testOverrides.readFileAsync.mockResolvedValue(
      '{"timestamp":"2023-01-01T00:00:00Z","metricName":"test","data":{"value":42}}\n'
    );

    const metrics = await readMetrics();
    expect(metrics).toEqual([
      { timestamp: '2023-01-01T00:00:00Z', metricName: 'test', data: { value: 42 } },
    ]);
  });

  it('should skip invalid metric lines', async () => {
    testOverrides.readFileAsync.mockResolvedValue(
      'invalid\n{"timestamp":"2023-01-01T00:00:00Z","metricName":"test"}\n'
    );

    const metrics = await readMetrics();
    expect(metrics).toHaveLength(1);
    expect(metrics[0].metricName).toBe('test');
  });

  it('should clear metrics file', async () => {
    await clearMetrics();
    expect(testOverrides.writeFileAsync).toHaveBeenCalledWith(
      expect.any(String),
      '',
      { encoding: 'utf-8' }
    );
  });

  it('should throw a TelemetryError on write failure', async () => {
    testOverrides.appendFileAsync.mockRejectedValue(new Error('Write failed'));

    await expect(recordMetric('test')).rejects.toThrow('TelemetryError');
  });
});
