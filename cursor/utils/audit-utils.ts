/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Provide system audit and logging capabilities"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Utilities for system logging and audit trail
 */

interface SystemLog {
  event: string;
  timestamp: string;
  data: any;
  metadata?: {
    source?: string;
    correlationId?: string;
    severity?: 'info' | 'warning' | 'error';
  };
}

/**
 * Emits a system log event
 */
export function emitSystemLog(event: string, data: any, metadata?: SystemLog['metadata']): void {
  const log: SystemLog = {
    event,
    timestamp: new Date().toISOString(),
    data,
    metadata: {
      source: 'system',
      correlationId: generateCorrelationId(),
      severity: 'info',
      ...metadata
    }
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${log.timestamp}] ${log.event}:`, log.data);
  }

  // In production, this would send to a logging service
  if (process.env.NODE_ENV === 'production') {
    sendToLoggingService(log);
  }
}

/**
 * Generates a unique correlation ID for request tracing
 */
function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sends log to logging service (implementation would connect to actual service)
 */
async function sendToLoggingService(log: SystemLog): Promise<void> {
  // Implementation would connect to logging service
  // For now, just a placeholder
  return Promise.resolve();
}

/**
 * Formats a log entry for display
 */
export function formatLogEntry(log: SystemLog): string {
  return `[${log.timestamp}] ${log.event}${log.metadata?.severity ? ` (${log.metadata.severity})` : ''}`;
}

/**
 * Creates an audit trail entry
 */
export function createAuditTrail(action: string, details: any): void {
  emitSystemLog('audit-trail', {
    action,
    details,
    timestamp: new Date().toISOString()
  }, {
    severity: 'info',
    source: 'audit'
  });
}

/**
 * Logs an error with full context
 */
export function logError(error: Error, context?: any): void {
  emitSystemLog('error', {
    message: error.message,
    stack: error.stack,
    context
  }, {
    severity: 'error',
    source: 'error-handler'
  });
}

/**
 * Logs a warning with context
 */
export function logWarning(message: string, context?: any): void {
  emitSystemLog('warning', {
    message,
    context
  }, {
    severity: 'warning',
    source: 'warning-handler'
  });
} 