import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/**
 * Logger - Provides logging functionality with file output
 * Supports different log levels and file-based logging
 */
export class Logger {
  private readonly context: string;
  private readonly logDir: string;

  constructor(context: string) {
    this.context = context;
    this.logDir = join(process.cwd(), 'logs');
    
    // Create logs directory if it doesn't exist
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Logs an info message
   * @param message The message to log
   * @param data Additional data to log
   */
  public info(message: string, data?: any): void {
    this.log('INFO', message, data);
  }

  /**
   * Logs a warning message
   * @param message The message to log
   * @param data Additional data to log
   */
  public warn(message: string, data?: any): void {
    this.log('WARN', message, data);
  }

  /**
   * Logs an error message
   * @param message The message to log
   * @param error The error that occurred
   */
  public error(message: string, error?: any): void {
    this.log('ERROR', message, error);
  }

  /**
   * Logs a debug message
   * @param message The message to log
   * @param data Additional data to log
   */
  public debug(message: string, data?: any): void {
    this.log('DEBUG', message, data);
  }

  /**
   * Writes content to a file
   * @param filePath The path to write to
   * @param content The content to write
   */
  public async writeToFile(filePath: string, content: string): Promise<void> {
    try {
      writeFileSync(filePath, content, 'utf-8');
    } catch (error) {
      this.error(`Failed to write to file: ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Logs a message with the specified level
   * @param level The log level
   * @param message The message to log
   * @param data Additional data to log
   */
  private log(level: string, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      data
    };

    // Log to console
    console.log(JSON.stringify(logEntry, null, 2));

    // Log to file
    const logFile = join(this.logDir, `${this.context}.log`);
    appendFileSync(logFile, JSON.stringify(logEntry) + '\n', 'utf-8');
  }
} 