/**
 * @file log-validator.ts
 * @description Validates raw logs for processing by the debugging pipeline.
 * Ensures size, structure, and content integrity. Codex Edition v4.1.3.
 */

import { recordMetric } from './telemetry';
import { maskSensitive } from './maskSensitive';
import { DebugConfig } from '../config/config';
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

/**
 * Validates a log entry against the debug configuration
 * @param logEntry The log entry to validate
 * @param config The debug configuration
 * @returns Object containing validation result and any issues found
 */
export function validateLogEntry(
  logEntry: any,
  config: DebugConfig
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check if log entry is an object
  if (!logEntry || typeof logEntry !== 'object') {
    issues.push('Log entry must be an object');
    return { valid: false, issues };
  }

  // Check required fields
  if (!logEntry.timestamp || !(logEntry.timestamp instanceof Date)) {
    issues.push('Log entry must have a valid timestamp');
  }

  if (!logEntry.level || !['debug', 'info', 'warn', 'error'].includes(logEntry.level)) {
    issues.push('Log entry must have a valid level');
  }

  if (!logEntry.message || typeof logEntry.message !== 'string') {
    issues.push('Log entry must have a message string');
  }

  // Check if log level is allowed by config
  if (logEntry.level && !isLogLevelAllowed(logEntry.level, config.logLevel)) {
    issues.push(`Log level ${logEntry.level} is not allowed by current config`);
  }

  // Check error object if present
  if (logEntry.error && !isValidError(logEntry.error)) {
    issues.push('Log entry error object is invalid');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Checks if a log level is allowed by the current config
 * @param level The log level to check
 * @param configLevel The configured log level
 * @returns true if the level is allowed
 */
function isLogLevelAllowed(level: string, configLevel: string): boolean {
  const levels = ['debug', 'info', 'warn', 'error'];
  const levelIndex = levels.indexOf(level);
  const configIndex = levels.indexOf(configLevel);
  return levelIndex >= configIndex;
}

/**
 * Validates an error object
 * @param error The error object to validate
 * @returns true if the error object is valid
 */
function isValidError(error: any): boolean {
  if (!error || typeof error !== 'object') return false;
  if (!error.message || typeof error.message !== 'string') return false;
  if (error.code && typeof error.code !== 'string') return false;
  if (error.stack && typeof error.stack !== 'string') return false;
  return true;
}
