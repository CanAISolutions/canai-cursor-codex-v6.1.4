/**
 * Logging Types
 * 
 * Type definitions for the logging system.
 */

/**
 * Supported log levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  namespace: string;
  message: string;
  context: Record<string, any>;
}

/**
 * Custom log handler function type
 */
export type LogHandler = (entry: LogEntry) => void;

/**
 * Console transport configuration
 */
export interface ConsoleTransport {
  type: 'console';
  enabled: boolean;
  colorize?: boolean;
}

/**
 * File transport configuration
 */
export interface FileTransport {
  type: 'file';
  enabled: boolean;
  filePath: string;
  rotationSize?: number;
  maxFiles?: number;
}

/**
 * Remote transport configuration
 */
export interface RemoteTransport {
  type: 'remote';
  enabled: boolean;
  url: string;
  headers?: Record<string, string>;
  batchSize?: number;
  retryOptions?: {
    maxRetries: number;
    delay: number;
  };
}

/**
 * Custom transport configuration
 */
export interface CustomTransport {
  type: 'custom';
  enabled: boolean;
  handler: LogHandler;
}

/**
 * Union type of all transport types
 */
export type LogTransport = ConsoleTransport | FileTransport | RemoteTransport | CustomTransport;

/**
 * Logger configuration
 */
export interface LogConfig {
  enabled?: boolean;
  minLevel?: LogLevel;
  transports?: LogTransport[];
  defaultContext?: Record<string, any>;
  redactKeys?: string[];
  includeStackTrace?: boolean;
}

/**
 * Log output formatter
 */
export interface LogFormatter {
  format(entry: LogEntry): string;
}

/**
 * Log transport provider
 */
export interface LogTransportProvider {
  initialize(): Promise<void>;
  log(entry: LogEntry): Promise<void>;
  flush(): Promise<void>;
  close(): Promise<void>;
} 