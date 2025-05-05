/**
 * @file log-validator.ts
 * @description Validates raw logs for processing by the debugging pipeline.
 * Ensures size, structure, and content integrity. Codex Edition v4.1.3.
 */

import { recordMetric } from './telemetry';
import { maskSensitive } from './maskSensitive';
import { DebugConfig } from '../config';
import { PipelineError } from '../types';

/**
 * Validates and normalizes a raw log input.
 * @param rawLog The unprocessed log string.
 * @param config The runtime pipeline configuration.
 * @param traceId Unique trace identifier for audit logging.
 * @returns The sanitized, normalized log.
 * @throws {PipelineError} If the log is empty, too large, or structurally invalid.
 */
export function validateLog(rawLog: string, config: DebugConfig, traceId: string): string {
  if (typeof rawLog !== 'string' || rawLog.trim().length === 0) {
    recordMetric('invalid_log_format', { traceId, reason: 'empty' });
    throw pipelineError('Log is empty or not a string', 'INVALID_LOG_FORMAT', 'validation');
  }

  const normalizedLog = rawLog.replace(/\r\n/g, '\n').trim();

  if (normalizedLog.length > (config.maxLogSize ?? 1_000_000)) {
    recordMetric('log_too_large', { traceId, size: normalizedLog.length });
    throw pipelineError('Log exceeds maxLogSize', 'LOG_SIZE_EXCEEDED', 'validation');
  }

  // Optional structure check for debug context
  if (!normalizedLog.includes('Error') && !normalizedLog.match(/(Exception|Trace|Stack|at\s)/i)) {
    recordMetric('log_suspicious_structure', { traceId });
  }

  const sanitized = maskSensitive(normalizedLog);
  return sanitized;
}

/**
 * Constructs a typed pipeline error with metadata.
 */
function pipelineError(
  message: string,
  errorCode: string,
  errorType: PipelineError['errorType']
): PipelineError {
  return {
    name: 'PipelineError',
    message,
    errorCode,
    errorType
  };
}
