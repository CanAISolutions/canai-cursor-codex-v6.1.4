/**
 * @file scripts/quarantine-handler.ts
 * @description Handles prompt quarantine and recovery for Clarity Engine
 * @version 6.2.1
 */

import { ClarityEngine } from '../gpt-templates/clarity-schema';
import { TrustScoreCalculator } from '../cursor/validators/trust-score';
import { MemoryFidelityTracker } from '../cursor/memory/fidelity-tracker';
import { EventBus } from '../event-bus/eventBus';
import * as fs from 'fs/promises';
import * as path from 'path';

interface QuarantineConfig {
  trustScoreThreshold: number;
  memoryFidelityThreshold: number;
  maxQuarantineDays: number;
  quarantineDir: string;
}

export class QuarantineHandler {
  private clarityEngine: ClarityEngine;
  private trustCalculator: TrustScoreCalculator;
  private memoryTracker: MemoryFidelityTracker;
  private eventBus: EventBus;
  private config: QuarantineConfig;

  constructor(config: QuarantineConfig) {
    this.clarityEngine = new ClarityEngine();
    this.trustCalculator = new TrustScoreCalculator();
    this.memoryTracker = new MemoryFidelityTracker();
    this.eventBus = new EventBus();
    this.config = config;
  }

  async handlePrompt(promptPath: string): Promise<void> {
    try {
      const prompt = await this.loadPrompt(promptPath);
      const validation = await this.clarityEngine.validateSchema(prompt);
      
      if (!validation.isValid) {
        await this.quarantinePrompt(promptPath, validation);
      }
    } catch (error) {
      await this.handleError(error, promptPath);
    }
  }

  private async loadPrompt(promptPath: string): Promise<any> {
    const content = await fs.readFile(promptPath, 'utf-8');
    return JSON.parse(content);
  }

  private async quarantinePrompt(promptPath: string, validation: any): Promise<void> {
    const timestamp = new Date().toISOString().split('T')[0];
    const promptName = path.basename(promptPath, path.extname(promptPath));
    const quarantinePath = path.join(
      this.config.quarantineDir,
      `${timestamp}-${promptName}`
    );

    // Create quarantine directory
    await fs.mkdir(quarantinePath, { recursive: true });

    // Move prompt to quarantine
    await fs.rename(promptPath, path.join(quarantinePath, path.basename(promptPath)));

    // Create quarantine metadata
    const metadata = {
      originalPath: promptPath,
      quarantinedAt: new Date().toISOString(),
      validationResults: validation,
      trustScore: await this.trustCalculator.calculateTrustScore(promptPath),
      memoryFidelity: await this.memoryTracker.getFidelityScore(promptPath)
    };

    await fs.writeFile(
      path.join(quarantinePath, 'quarantine-metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    // Log to auto-actions
    await this.logQuarantine(metadata);

    // Emit quarantine event
    await this.eventBus.emit('prompt.quarantined', {
      promptPath,
      quarantinePath,
      metadata
    });

    // Restore last passing version if available
    await this.restoreLastPassingVersion(promptPath);
  }

  private async restoreLastPassingVersion(promptPath: string): Promise<void> {
    const versionsDir = path.join(path.dirname(promptPath), 'versions');
    const versions = await fs.readdir(versionsDir);
    
    // Sort versions by date (newest first)
    const sortedVersions = versions
      .filter(v => v.endsWith('.prompt'))
      .sort()
      .reverse();

    for (const version of sortedVersions) {
      const versionPath = path.join(versionsDir, version);
      const prompt = await this.loadPrompt(versionPath);
      const validation = await this.clarityEngine.validateSchema(prompt);

      if (validation.isValid) {
        await fs.copyFile(versionPath, promptPath);
        await this.eventBus.emit('prompt.restored', {
          promptPath,
          restoredFrom: versionPath
        });
        break;
      }
    }
  }

  private async logQuarantine(metadata: any): Promise<void> {
    const logEntry = `
## [${new Date().toISOString()}] Prompt Quarantined

### Details
- Original Path: ${metadata.originalPath}
- Trust Score: ${metadata.trustScore}
- Memory Fidelity: ${metadata.memoryFidelity}%

### Validation Results
${JSON.stringify(metadata.validationResults, null, 2)}

---
`;

    await fs.appendFile('cursor/auto-actions.log.md', logEntry);
  }

  private async handleError(error: any, promptPath: string): Promise<void> {
    const errorEntry = `
## [${new Date().toISOString()}] Quarantine Handler Error

### Details
- Prompt Path: ${promptPath}
- Error: ${error.message}
- Stack: ${error.stack}

---
`;

    await fs.appendFile('cursor/auto-actions.log.md', errorEntry);
    await this.eventBus.emit('quarantine.error', {
      promptPath,
      error: error.message
    });
  }

  async cleanupOldQuarantines(): Promise<void> {
    const quarantineDir = this.config.quarantineDir;
    const entries = await fs.readdir(quarantineDir, { withFileTypes: true });
    
    const now = new Date();
    const maxAge = this.config.maxQuarantineDays * 24 * 60 * 60 * 1000;

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const dirPath = path.join(quarantineDir, entry.name);
        const stats = await fs.stat(dirPath);
        const age = now.getTime() - stats.mtime.getTime();

        if (age > maxAge) {
          await fs.rm(dirPath, { recursive: true });
          await this.eventBus.emit('quarantine.cleaned', {
            path: dirPath,
            age: age
          });
        }
      }
    }
  }
} 