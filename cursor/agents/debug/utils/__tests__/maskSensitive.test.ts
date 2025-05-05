/**
 * @file maskSensitive.test.ts
 * @description Unit tests for log redaction via maskSensitive util.
 * Validates PII, secrets, tokens, and path masking.
 */

import { maskSensitive } from '../maskSensitive';

describe('maskSensitive', () => {
  it('masks email addresses', () => {
    const input = 'User email is john.doe@example.com';
    const result = maskSensitive(input);
    expect(result).toContain('[REDACTED_EMAIL]');
  });

  it('masks access tokens', () => {
    const input = 'access_token=abcd1234xyz5678';
    const result = maskSensitive(input);
    expect(result).toContain('[REDACTED_ACCESS_TOKEN]');
  });

  it('masks api keys', () => {
    const input = '"apiKey": "1234abcd5678efgh"';
    const result = maskSensitive(input);
    expect(result).toContain('[REDACTED_API_KEY]');
  });

  it('masks bearer tokens', () => {
    const input = 'Bearer abcd-1234-xyz-token';
    const result = maskSensitive(input);
    expect(result).toContain('[REDACTED_BEARER_TOKEN]');
  });

  it('masks authorization headers', () => {
    const input = 'authorization: Bearer secret1234token';
    const result = maskSensitive(input);
    expect(result).toContain('[REDACTED_AUTHORIZATION_HEADER]');
  });

  it('masks env vars like DB_PASSWORD', () => {
    const input = 'DB_PASSWORD=secret123';
    const result = maskSensitive(input);
    expect(result).toContain('[REDACTED_ENV_VAR]');
  });

  it('masks Unix-style file paths', () => {
    const input = 'File saved at /usr/local/bin/file.js';
    const result = maskSensitive(input);
    expect(result).toContain('[REDACTED_FILESYSTEM_PATH]');
  });

  it('masks Windows-style file paths', () => {
    const input = 'C:\\Users\\Admin\\secret.txt';
    const result = maskSensitive(input);
    expect(result).toContain('[REDACTED_WINDOWS_PATH]');
  });

  it('masks token-like strings', () => {
    const input = 'sk-abc123xyz789';
    const result = maskSensitive(input);
    expect(result).toContain('[REDACTED_TOKEN_LIKE]');
  });

  it('does not over-redact safe content', () => {
    const input = 'Normal log with no secrets.';
    const result = maskSensitive(input);
    expect(result).toBe(input);
  });
});
