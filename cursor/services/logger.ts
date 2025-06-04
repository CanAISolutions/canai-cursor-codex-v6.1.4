/**
 * Logger Service
 * 
 * Provides structured logging capabilities with event bus integration.
 * Used for consistent logging throughout the application.
 */

import { EventBus } from '../event-bus/eventBus';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogEntry {
  level: LogLevel;
  type: string;
  message?: string;
  timestamp: string;
  data?: any;
  context?: string;
}

/**
 * Logger class for structured logging with event bus integration
 */
export class Logger {
  private static instance: Logger;
  private eventBus: EventBus;
  private logStore: LogEntry[] = [];
  
  constructor() {
    this.eventBus = EventBus.getInstance();
  }
  
  /**
   * Get singleton instance
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  /**
   * Log an entry
   */
  log(entry: Omit<LogEntry, 'timestamp'>): void {
    const fullEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };
    
    // Store log entry
    this.logStore.push(fullEntry);
    
    // Emit event
    this.eventBus.emit(`log:${entry.level}`, fullEntry);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${fullEntry.timestamp}] [${fullEntry.level}] ${fullEntry.type}: ${fullEntry.message || ''}`);
      if (fullEntry.data) {
        console.log(fullEntry.data);
      }
    }
  }
  
  /**
   * Log debug level entry
   */
  debug(type: string, message?: string, data?: any, context?: string): void {
    this.log({ level: LogLevel.DEBUG, type, message, data, context });
  }
  
  /**
   * Log info level entry
   */
  info(type: string, message?: string, data?: any, context?: string): void {
    this.log({ level: LogLevel.INFO, type, message, data, context });
  }
  
  /**
   * Log warning level entry
   */
  warn(type: string, message?: string, data?: any, context?: string): void {
    this.log({ level: LogLevel.WARN, type, message, data, context });
  }
  
  /**
   * Log error level entry
   */
  error(type: string, message?: string, data?: any, context?: string): void {
    this.log({ level: LogLevel.ERROR, type, message, data, context });
  }
  
  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logStore];
  }
  
  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logStore = [];
  }
}

// Export default instance
export default Logger.getInstance(); 