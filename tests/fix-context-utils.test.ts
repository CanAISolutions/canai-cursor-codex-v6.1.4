/**
 * tests/fix-context-utils.test.ts
 * Unit tests for appendToFixContextAsync
 */

import { jest } from '@jest/globals';
import { appendToFixContextAsync, testOverrides } from '../fix-context-utils';

describe('appendToFixContextAsync', () => {
  beforeEach(() => {
    testOverrides.appendFileAsync = jest.fn().mockResolvedValue(undefined);
    testOverrides.mkdirSync = jest.fn();
    testOverrides.existsSync = jest.fn().mockReturnValue(false);
  });

  it('should write sanitized message to log file', async () => {
    await appendToFixContextAsync('Test\nMessage');

    expect(testOverrides.appendFileAsync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('[Test Message]'),
      { encoding: 'utf-8' }
    );
  });

  it('should throw a FixContextError on write failure', async () => {
    testOverrides.appendFileAsync.mockRejectedValue(new Error('Write failed'));

    await expect(appendToFixContextAsync('Test')).rejects.toThrow('FixContextError');
  });

  it('should create context directory if missing', async () => {
    await appendToFixContextAsync('Test');

    expect(testOverrides.mkdirSync).toHaveBeenCalledWith('.canai-context', { recursive: true });
  });
});
