import { DebugConfig } from '../src/config';
import { LogEntry } from '../src/types';

/**
 * Validates a log entry against the debug configuration
 * @param logEntry The log entry to validate
 * @param config The debug configuration
 * @returns Object containing validation result and any issues found
 */
export function validateLogEntry(
  logEntry: LogEntry,
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

  // Check optional fields
  if (logEntry.metadata !== undefined && typeof logEntry.metadata !== 'object') {
    issues.push('Metadata must be an object if present');
  }

  if (logEntry.error !== undefined && typeof logEntry.error !== 'object') {
    issues.push('Error must be an object if present');
  }

  // Check log level against config
  if (logEntry.level && config.logLevel) {
    const levels = ['debug', 'info', 'warn', 'error'];
    const entryLevelIndex = levels.indexOf(logEntry.level);
    const configLevelIndex = levels.indexOf(config.logLevel);
    
    if (entryLevelIndex < configLevelIndex) {
      issues.push(`Log level ${logEntry.level} is below configured minimum ${config.logLevel}`);
    }
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