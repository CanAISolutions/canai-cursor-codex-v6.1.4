/**
 * Logger Class
 * 
 * Provides structured logging with different severity levels
 * and contextual information for better debugging and monitoring.
 */

// Import required dependencies
import { EventBus } from '../cursor/event-bus';
import { LogLevel, LogEntry, LogTransport, LogConfig } from './types/logging';

export class Logger {
  private namespace: string;
  private enabled: boolean = true;
  private transports: LogTransport[] = [];
  private minLevel: LogLevel = 'debug';
  private eventBus?: EventBus;
  private defaultContext: Record<string, any> = {};
  
  /**
   * Creates a new logger instance
   * 
   * @param namespace - Namespace for the logger to identify its origin
   * @param config - Optional configuration for the logger
   */
  constructor(
    namespace: string, 
    config?: LogConfig,
    eventBus?: EventBus
  ) {
    this.namespace = namespace;
    this.eventBus = eventBus;
    
    if (config) {
      this.enabled = config.enabled ?? this.enabled;
      this.minLevel = config.minLevel ?? this.minLevel;
      this.transports = config.transports ?? this.transports;
      this.defaultContext = config.defaultContext ?? this.defaultContext;
    }
    
    // Add console transport by default if none specified
    if (this.transports.length === 0) {
      this.transports.push({
        type: 'console',
        enabled: true
      });
    }
  }
  
  /**
   * Logs debug level information
   * 
   * @param message - Log message
   * @param context - Optional contextual data
   */
  debug(message: string, context: Record<string, any> = {}): void {
    this.log('debug', message, context);
  }
  
  /**
   * Logs informational messages
   * 
   * @param message - Log message
   * @param context - Optional contextual data
   */
  info(message: string, context: Record<string, any> = {}): void {
    this.log('info', message, context);
  }
  
  /**
   * Logs warning messages
   * 
   * @param message - Log message
   * @param context - Optional contextual data
   */
  warn(message: string, context: Record<string, any> = {}): void {
    this.log('warn', message, context);
  }
  
  /**
   * Logs error messages
   * 
   * @param message - Log message
   * @param context - Optional contextual data
   */
  error(message: string, context: Record<string, any> = {}): void {
    this.log('error', message, context);
  }
  
  /**
   * Enables or disables logging
   * 
   * @param enabled - Whether logging is enabled
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Sets the minimum log level to record
   * 
   * @param level - Minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
  
  /**
   * Adds a transport for log output
   * 
   * @param transport - Transport configuration
   */
  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }
  
  /**
   * Core logging function
   * 
   * @param level - Log level
   * @param message - Log message
   * @param context - Contextual data
   */
  private log(level: LogLevel, message: string, context: Record<string, any> = {}): void {
    if (!this.enabled || !this.shouldLog(level)) return;
    
    const timestamp = new Date().toISOString();
    const mergedContext = {
      ...this.defaultContext,
      ...context
    };
    
    const logEntry: LogEntry = {
      timestamp,
      level,
      namespace: this.namespace,
      message,
      context: mergedContext
    };
    
    // Process through all enabled transports
    this.processTransports(logEntry);
    
    // Emit log event if event bus is available
    if (this.eventBus) {
      this.eventBus.emit('log', logEntry);
    }
  }

  /**
   * Determines if a message should be logged based on level
   * 
   * @param level - Log level to check
   * @returns Whether the message should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    return levels[level] >= levels[this.minLevel];
  }
  
  /**
   * Process the log entry through all enabled transports
   * 
   * @param logEntry - Log entry to process
   */
  private processTransports(logEntry: LogEntry): void {
    for (const transport of this.transports) {
      if (!transport.enabled) continue;
      
      switch (transport.type) {
        case 'console':
          this.consoleTransport(logEntry);
          break;
        case 'file':
          if (transport.filePath) {
            this.fileTransport(logEntry, transport.filePath);
          }
          break;
        case 'remote':
          if (transport.url) {
            this.remoteTransport(logEntry, transport.url);
          }
          break;
        case 'custom':
          if (transport.handler) {
            transport.handler(logEntry);
          }
          break;
      }
    }
  }
  
  /**
   * Console transport implementation
   * 
   * @param logEntry - Log entry to output
   */
  private consoleTransport(logEntry: LogEntry): void {
    const { timestamp, level, namespace, message, context } = logEntry;
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [${namespace}] ${message}`;
    
    // Use appropriate console method based on level
    switch (level) {
      case 'debug':
        console.debug(formattedMessage, context);
        break;
      case 'info':
        console.info(formattedMessage, context);
        break;
      case 'warn':
        console.warn(formattedMessage, context);
        break;
      case 'error':
        console.error(formattedMessage, context);
        break;
    }
  }
  
  /**
   * File transport implementation
   * 
   * @param logEntry - Log entry to output
   * @param filePath - Path to log file
   */
  private fileTransport(logEntry: LogEntry, filePath: string): void {
    // In a production implementation, this would use proper file writing
    // For now, we'll just note that this would be implemented with the proper
    // Node.js fs module or a dedicated logging library
    try {
      const serializedEntry = JSON.stringify(logEntry);
      // This would write to the file in production code
      // fs.appendFileSync(filePath, serializedEntry + '\n');
    } catch (error) {
      // Fallback to console if file writing fails
      console.error(`Failed to write to log file: ${filePath}`, error);
    }
  }
  
  /**
   * Remote transport implementation
   * 
   * @param logEntry - Log entry to output
   * @param url - URL to send logs to
   */
  private remoteTransport(logEntry: LogEntry, url: string): void {
    // In a production implementation, this would use proper HTTP requests
    // For now, we'll just note that this would be implemented with fetch or axios
    try {
      // This would make an HTTP request in production code
      // fetch(url, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // });
    } catch (error) {
      // Fallback to console if remote logging fails
      console.error(`Failed to send log to remote endpoint: ${url}`, error);
    }
  }
} 