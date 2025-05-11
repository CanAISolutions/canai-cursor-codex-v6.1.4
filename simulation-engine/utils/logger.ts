/**
 * Logger - Handles logging with different levels and formatting
 * Supports info, warn, error, and debug levels
 */
export class Logger {
  private readonly context: string;
  private readonly logLevel: string;

  /**
   * Creates a new Logger instance
   * @param context The context for the logger (e.g., class name)
   * @param logLevel The minimum log level to output
   */
  constructor(context: string, logLevel: string = 'info') {
    this.context = context;
    this.logLevel = logLevel;
  }

  /**
   * Logs an info message
   * @param message The message to log
   * @param data Optional data to include
   */
  public info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('INFO', message, data));
    }
  }

  /**
   * Logs a warning message
   * @param message The message to log
   * @param data Optional data to include
   */
  public warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('WARN', message, data));
    }
  }

  /**
   * Logs an error message
   * @param message The message to log
   * @param error Optional error object
   */
  public error(message: string, error?: any): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('ERROR', message, error));
    }
  }

  /**
   * Logs a debug message
   * @param message The message to log
   * @param data Optional data to include
   */
  public debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('DEBUG', message, data));
    }
  }

  /**
   * Checks if a message should be logged based on the log level
   * @param level The level of the message
   * @returns Whether the message should be logged
   */
  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  /**
   * Formats a log message
   * @param level The log level
   * @param message The message to format
   * @param data Optional data to include
   * @returns The formatted message
   */
  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    let formattedMessage = `[${timestamp}] [${level}] [${this.context}] ${message}`;

    if (data) {
      if (data instanceof Error) {
        formattedMessage += `\n${data.stack || data.message}`;
      } else {
        formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
      }
    }

    return formattedMessage;
  }
} 