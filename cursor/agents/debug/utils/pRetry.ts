/**
 * @file pRetry.ts
 * @description Codex Edition v4.1.4 – Retry Wrapper with Context Logging.
 * Wraps p-retry with trace-aware diagnostics and AI-cooperative observability.
 */

import retry from 'p-retry';
import { appendToFixContextAsync } from './fix-context-utils';
import { recordMetric } from './telemetry';

/**
 * Typed retry wrapper with Codex trace observability.
 * @template T
 * @param fn - The function to retry.
 * @param opts - Retry options including retries, traceId, and fallback hooks.
 * @returns The resolved value of the successful retry.
 */
export async function pRetryWithTrace<T>(
  fn: () => Promise<T>,
  opts: {
    retries?: number;
    traceId?: string;
    label?: string;
    onFailedAttempt?: (err: any, attempt: number) => Promise<void>;
  } = {}
): Promise<T> {
  const { retries = 3, traceId = 'unknown', label = 'retryable-op', onFailedAttempt } = opts;

  return retry(fn, {
    retries,
    onFailedAttempt: async (error, attempt) => {
      await appendToFixContextAsync(`[${traceId}] ${label} failed (attempt #${attempt}): ${error.message}`);
      recordMetric('retry_failed', { traceId, attempt, label, error: error.message });
      if (onFailedAttempt) await onFailedAttempt(error, attempt);
    }
  });
}
