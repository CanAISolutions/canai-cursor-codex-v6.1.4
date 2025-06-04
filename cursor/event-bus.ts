/**
 * EventBus - Canonical Export
 * 
 * Re-exports the canonical EventBus implementation from cursor/event-bus/eventBus.ts
 * to ensure interface consistency across the entire codebase.
 */

// Import the EventBus for use in the emitSystemLog function
import { EventBus } from './event-bus/eventBus';

export { EventBus } from './event-bus/eventBus';

/**
 * System log level enum
 */
export enum SystemLogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * System log message interface
 */
export interface SystemLogMessage {
  level: SystemLogLevel;
  message: string;
  context?: Record<string, any>;
}

/**
 * Emit a system log message
 * 
 * @param logMessage The log message to emit
 * @param eventBus The event bus to emit the message on
 */
export function emitSystemLog(logMessage: SystemLogMessage, eventBus: EventBus): void {
  eventBus.emit('system.log', {
    ...logMessage,
    timestamp: new Date().toISOString()
  });
} 