import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../utils/logger';

/**
 * AutoQuarantine - Handles moving problematic outputs to quarantine and logging them
 * Implements trust, memory fidelity, and empathy drift thresholds
 */
export class AutoQuarantine {
  private readonly logger: Logger;
  private readonly quarantineDir: string;
  private readonly watchLogPath: string;

  /**
   * Creates a new AutoQuarantine instance
   * @param quarantineDir The directory to move quarantined files to
   * @param watchLogPath The path to the persona watch log file
   */
  constructor(quarantineDir: string = 'quarantine', watchLogPath: string = 'persona-watch.log.md') {
    this.logger = new Logger('AutoQuarantine');
    this.quarantineDir = quarantineDir;
    this.watchLogPath = watchLogPath;

    // Ensure quarantine directory exists
    if (!fs.existsSync(this.quarantineDir)) {
      fs.mkdirSync(this.quarantineDir, { recursive: true });
    }

    // Ensure watch log file exists
    if (!fs.existsSync(this.watchLogPath)) {
      fs.writeFileSync(this.watchLogPath, '# Persona Watch Log\n\n');
    }
  }

  /**
   * Checks if a result should be quarantined based on its scores
   * @param result The result to check
   * @returns Whether the result should be quarantined
   */
  public shouldQuarantine(result: any): boolean {
    try {
      const scores = result.scores || {};
      const metrics = result.metrics || {};

      // Check trust score
      if (scores.trust < 0.9) {
        this.logger.warn(`Low trust score: ${scores.trust}`);
        return true;
      }

      // Check memory fidelity
      if (metrics.memory_fidelity < 0.85) {
        this.logger.warn(`Low memory fidelity: ${metrics.memory_fidelity}`);
        return true;
      }

      // Check empathy drift
      if (metrics.empathy_drift > 0.15) {
        this.logger.warn(`High empathy drift: ${metrics.empathy_drift}`);
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error('Failed to check quarantine status', error);
      return false;
    }
  }

  /**
   * Moves a result to quarantine and logs it
   * @param result The result to quarantine
   * @param sourcePath The path of the source file
   * @returns The path of the quarantined file
   */
  public async quarantine(result: any, sourcePath: string): Promise<string> {
    try {
      // Generate quarantine filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = path.basename(sourcePath);
      const quarantinePath = path.join(this.quarantineDir, `${timestamp}-${filename}`);

      // Move file to quarantine
      fs.copyFileSync(sourcePath, quarantinePath);
      fs.unlinkSync(sourcePath);

      // Log to watch log
      const logEntry = this.generateLogEntry(result, sourcePath, quarantinePath);
      fs.appendFileSync(this.watchLogPath, logEntry);

      this.logger.info(`Quarantined file: ${quarantinePath}`);
      return quarantinePath;
    } catch (error) {
      this.logger.error('Failed to quarantine result', error);
      throw error;
    }
  }

  /**
   * Generates a log entry for a quarantined result
   * @param result The quarantined result
   * @param sourcePath The original source path
   * @param quarantinePath The quarantine path
   * @returns The log entry markdown
   */
  private generateLogEntry(result: any, sourcePath: string, quarantinePath: string): string {
    const timestamp = new Date().toISOString();
    const scores = result.scores || {};
    const metrics = result.metrics || {};
    const flags = result.flags || [];

    return `
## Quarantine Entry - ${timestamp}

### File Information
- **Source**: ${sourcePath}
- **Quarantine**: ${quarantinePath}

### Scores
- **Trust**: ${scores.trust || 'N/A'}
- **Memory Fidelity**: ${metrics.memory_fidelity || 'N/A'}
- **Empathy Drift**: ${metrics.empathy_drift || 'N/A'}

### Flags
${flags.map((flag: string) => `- ${flag}`).join('\n')}

### Metrics
\`\`\`json
${JSON.stringify(metrics, null, 2)}
\`\`\`

---
`;
  }

  /**
   * Gets the list of quarantined files
   * @returns Array of quarantined file paths
   */
  public getQuarantinedFiles(): string[] {
    try {
      return fs.readdirSync(this.quarantineDir)
        .map(file => path.join(this.quarantineDir, file))
        .filter(file => fs.statSync(file).isFile());
    } catch (error) {
      this.logger.error('Failed to get quarantined files', error);
      return [];
    }
  }

  /**
   * Restores a quarantined file to its original location
   * @param quarantinePath The path of the quarantined file
   * @param originalPath The original path to restore to
   * @returns Whether the restore was successful
   */
  public async restore(quarantinePath: string, originalPath: string): Promise<boolean> {
    try {
      // Ensure original directory exists
      const originalDir = path.dirname(originalPath);
      if (!fs.existsSync(originalDir)) {
        fs.mkdirSync(originalDir, { recursive: true });
      }

      // Copy file back to original location
      fs.copyFileSync(quarantinePath, originalPath);
      fs.unlinkSync(quarantinePath);

      this.logger.info(`Restored file: ${originalPath}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to restore file', error);
      return false;
    }
  }

  /**
   * Gets the contents of the watch log
   * @returns The watch log contents
   */
  public getWatchLog(): string {
    try {
      return fs.readFileSync(this.watchLogPath, 'utf8');
    } catch (error) {
      this.logger.error('Failed to read watch log', error);
      return '';
    }
  }

  /**
   * Clears the watch log
   * @returns Whether the clear was successful
   */
  public clearWatchLog(): boolean {
    try {
      fs.writeFileSync(this.watchLogPath, '# Persona Watch Log\n\n');
      this.logger.info('Cleared watch log');
      return true;
    } catch (error) {
      this.logger.error('Failed to clear watch log', error);
      return false;
    }
  }
} 