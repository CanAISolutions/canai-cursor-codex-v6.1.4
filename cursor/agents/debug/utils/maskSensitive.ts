/**
 * @file maskSensitive.ts
 * @description Codex Edition v4.1.4 – PII and secret redaction for logs, telemetry, and GPT safety.
 * Masks tokens, credentials, API keys, emails, paths, and other high-risk values.
 * Designed for audit-safe debugging, zero-risk AI input, and traceable user sessions.
 */

const redactionRules: Array<{ label: string; pattern: RegExp }> = [
    {
      label: 'email',
      pattern: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
    },
    {
      label: 'access_token',
      pattern: /access_token=["']?[\w\-]{16,}["']?|access_token="[\w\-]+"/gi
    },
    {
      label: 'api_key',
      pattern: /api_key=["']?[\w\-]{16,}["']?|api_key="[\w\-]+"/gi
    },
    {
      label: 'bearer_token',
      pattern: /bearer\s+[\w\-]{16,}/gi
    },
    {
      label: 'authorization_header',
      pattern: /authorization:\s*(Bearer\s+[\w\-]+)/gi
    },
    {
      label: 'env_var',
      pattern: /\b[A-Z0-9_]{2,32}=[^\s'"]+/g // Handles secrets like DB_PASSWORD=xyz
    },
    {
      label: 'filesystem_path',
      pattern: /(?:\/[a-zA-Z0-9._-]+)+/g
    },
    {
      label: 'windows_path',
      pattern: /[a-zA-Z]:\\(?:[^\\]+\\)*[^\\]+/g
    },
    {
      label: 'token_like',
      pattern: /\b(?:sk|ghp|tok|sess|bearer|jwt)[\w\-]{8,}/gi
    }
  ];
  
  /**
   * Sanitizes logs by masking sensitive content for GPT safety, telemetry, and UI logs.
   *
   * @param inputLog - Raw string that may contain secrets, credentials, or identifiers.
   * @returns Redacted log with `[REDACTED_TYPE]` labels for each pattern match.
   */
  export function maskSensitive(inputLog: string): string {
    let redacted = inputLog;
  
    for (const { label, pattern } of redactionRules) {
      redacted = redacted.replace(pattern, `[REDACTED_${label.toUpperCase()}]`);
    }
  
    return redacted;
  }
  