/**
 * @file config.test.ts
 * @description Unit tests for Codex Edition v4.1.3 – config.ts module
 */

import { loadConfig, testOverrides } from '../config';
import { jest } from '@jest/globals';

describe('loadConfig', () => {
  beforeEach(() => {
    testOverrides.readFileSync = jest.fn();
    testOverrides.statSync = jest.fn();
    testOverrides.env = {};
  });

  it('loads default config with no overrides', () => {
    testOverrides.readFileSync.mockImplementation(() => { throw new Error('File not found'); });
    testOverrides.statSync.mockImplementation(() => { throw new Error('File not found'); });

    const config = loadConfig();
    expect(config.trustScoreThreshold).toBe(4.2);
    expect(config.aiProvider).toBe('openai');
  });

  it('applies valid .cursorrules overrides', () => {
    const fileContent = 'trustScoreThreshold=5.0\nconcurrencyLimit=10';
    testOverrides.readFileSync.mockReturnValue(fileContent);
    testOverrides.statSync.mockReturnValue({ size: 100 });

    const config = loadConfig();
    expect(config.trustScoreThreshold).toBe(5.0);
    expect(config.concurrencyLimit).toBe(10);
  });

  it('skips invalid .cursorrules values', () => {
    const fileContent = 'trustScoreThreshold=invalid';
    testOverrides.readFileSync.mockReturnValue(fileContent);
    testOverrides.statSync.mockReturnValue({ size: 100 });

    const config = loadConfig();
    expect(config.trustScoreThreshold).toBe(4.2);
  });

  it('applies environment variable overrides', () => {
    testOverrides.env = {
      TRUST_SCORE_THRESHOLD: '7.5',
      CONCURRENCY_LIMIT: '8',
      FALLBACK_MODE: 'true'
    };

    const config = loadConfig();
    expect(config.trustScoreThreshold).toBe(7.5);
    expect(config.concurrencyLimit).toBe(8);
    expect(config.fallbackMode).toBe(true);
  });

  it('ignores oversized .cursorrules file', () => {
    testOverrides.statSync.mockReturnValue({ size: 20000 });

    const config = loadConfig();
    expect(config.trustScoreThreshold).toBe(4.2);
  });

  it('ignores .cursorrules with invalid characters', () => {
    testOverrides.readFileSync.mockReturnValue('trustScoreThreshold=5.0<script>');
    testOverrides.statSync.mockReturnValue({ size: 100 });

    const config = loadConfig();
    expect(config.trustScoreThreshold).toBe(4.2);
  });

  it('parses aiProviderConfig JSON in .cursorrules', () => {
    const content = 'aiProviderConfig={"model":"gpt-4"}';
    testOverrides.readFileSync.mockReturnValue(content);
    testOverrides.statSync.mockReturnValue({ size: 100 });

    const config = loadConfig();
    expect(config.aiProviderConfig.model).toBe('gpt-4');
  });

  it('warns on invalid aiProviderConfig JSON in env', () => {
    testOverrides.env = {
      AI_PROVIDER_CONFIG: '{model:gpt-4}'
    };

    const config = loadConfig();
    expect(config.aiProviderConfig).toEqual({});
  });
});
