/**
 * @file maskSensitive.test.ts
 * @description Unit tests for log redaction via maskSensitive util.
 * Validates PII, secrets, tokens, and path masking.
 */

import { describe, it, expect } from '@jest/globals';
import { maskSensitive } from '../maskSensitive';

describe('maskSensitive', () => {
  it('masks access tokens', () => {
    const input = 'access_token="abcd1234xyz5678"';
    const result = maskSensitive(input);
    expect(result).toBe('[REDACTED_ACCESS_TOKEN]');
  });

  it('masks api keys', () => {
    const input = 'api_key=xyz123456789abcd';
    const result = maskSensitive(input);
    expect(result).toBe('[REDACTED_API_KEY]');
  });

  it('masks bearer tokens', () => {
    const input = 'Bearer xyz123456789abcd';
    const result = maskSensitive(input);
    expect(result).toBe('[REDACTED_BEARER_TOKEN]');
  });

  it('masks email addresses', () => {
    const input = 'user@example.com';
    const result = maskSensitive(input);
    expect(result).toBe('[REDACTED_EMAIL]');
  });

  it('masks filesystem paths', () => {
    const input = '/usr/local/bin/node';
    const result = maskSensitive(input);
    expect(result).toBe('[REDACTED_FILESYSTEM_PATH]');
  });

  it('masks windows paths', () => {
    const input = 'C:\\Program Files\\App\\config.json';
    const result = maskSensitive(input);
    expect(result).toBe('[REDACTED_WINDOWS_PATH]');
  });

  it('masks environment variables', () => {
    const input = 'DB_PASSWORD=secretpass123';
    const result = maskSensitive(input);
    expect(result).toBe('[REDACTED_ENV_VAR]');
  });

  it('preserves non-sensitive content', () => {
    const input = 'Normal log message without secrets';
    const result = maskSensitive(input);
    expect(result).toBe(input);
  });
});
