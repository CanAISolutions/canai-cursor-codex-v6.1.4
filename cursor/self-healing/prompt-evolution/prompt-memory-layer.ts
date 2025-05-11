/**
 * prompt-memory-layer.ts
 * 
 * Purpose: Version, snapshot, and track prompt evolution based on trigger signals.
 * Triggered: When Self-Refine Trigger Layer fires a revision signal.
 * Enforces: Version control, evolutionary tracking, and safe rollbacks.
 */

import { EventBus } from '../../event-bus/eventBus';
import { emitSystemLog } from '../../system-intel/audit-utils';
import { RevisionTrigger } from '../self-refine/self-refine-trigger';
import * as fs from 'fs/promises';

export interface PromptVersion {
  version: string;
  timestamp: string;
  trigger: RevisionTrigger;
  content: string;
  metrics: {
    clarity: number;
    trust: number;
    empathy: number;
    emotionalResonance: number;
  };
  diff?: {
    additions: string[];
    removals: string[];
    modifications: Array<{
      before: string;
      after: string;
      context: string;
    }>;
  };
}

interface VersionMetadata {
  currentVersion: string;
  versions: string[];
  lastUpdated: string;
  evolutionPath: Array<{
    from: string;
    to: string;
    trigger: string;
    timestamp: string;
  }>;
}

export class PromptMemoryLayer {
  private eventBus: EventBus;
  private readonly VERSION_PREFIX = 'v';
  private readonly SNAPSHOT_DIR = '/prompt-versions';
  private readonly METADATA_FILE = 'version-metadata.json';

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.initializeEventListeners();
  }

  /**
   * Initialize event listeners for trigger signals
   */
  private initializeEventListeners(): void {
    this.eventBus.on('REVISION_TRIGGERED', this.handleRevisionTrigger.bind(this));
    this.eventBus.on('ROLLBACK_REQUESTED', this.handleRollbackRequest.bind(this));
  }

  /**
   * Handle revision trigger and create new version
   */
  async handleRevisionTrigger(trigger: RevisionTrigger): Promise<void> {
    try {
      // Get current prompt content
      const currentContent = await this.getCurrentPromptContent(trigger.promptPath);
      
      // Generate new version
      const newVersion = await this.createNewVersion(trigger, currentContent);
      
      // Calculate diff
      const diff = await this.calculateDiff(currentContent, newVersion.content);
      
      // Update version metadata
      await this.updateVersionMetadata(trigger, newVersion.version);
      
      // Emit version snapshot
      await this.emitVersionSnapshot(newVersion, diff);
      
      // Log evolution
      await this.logEvolution(trigger, newVersion, diff);
    } catch (error) {
      console.error('Failed to handle revision trigger:', error);
      throw error;
    }
  }

  /**
   * Create new prompt version
   */
  private async createNewVersion(trigger: RevisionTrigger, currentContent: string): Promise<PromptVersion> {
    const version = await this.generateVersionNumber(trigger.promptPath);
    const timestamp = new Date().toISOString();
    
    // Calculate metrics for new version
    const metrics = await this.calculateMetrics(currentContent);
    
    return {
      version,
      timestamp,
      trigger,
      content: currentContent, // In real implementation, this would be the evolved content
      metrics
    };
  }

  /**
   * Calculate diff between versions
   */
  private async calculateDiff(oldContent: string, newContent: string): Promise<PromptVersion['diff']> {
    // Simple line-based diff implementation
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    
    const additions = newLines.filter(line => !oldLines.includes(line));
    const removals = oldLines.filter(line => !newLines.includes(line));
    
    const modifications = oldLines
      .filter((line, i) => line !== newLines[i] && newLines[i] !== undefined)
      .map((line, i) => ({
        before: line,
        after: newLines[i],
        context: this.getDiffContext(oldLines, i)
      }));

    return { additions, removals, modifications };
  }

  /**
   * Get context for diff modifications
   */
  private getDiffContext(lines: string[], index: number): string {
    const start = Math.max(0, index - 2);
    const end = Math.min(lines.length, index + 3);
    return lines.slice(start, end).join('\n');
  }

  /**
   * Update version metadata
   */
  private async updateVersionMetadata(trigger: RevisionTrigger, newVersion: string): Promise<void> {
    const metadataPath = `${this.SNAPSHOT_DIR}/${trigger.promptPath}/${this.METADATA_FILE}`;
    let metadata: VersionMetadata;

    try {
      const content = await fs.readFile(metadataPath, 'utf8');
      metadata = JSON.parse(content);
    } catch {
      metadata = {
        currentVersion: newVersion,
        versions: [],
        lastUpdated: new Date().toISOString(),
        evolutionPath: []
      };
    }

    metadata.currentVersion = newVersion;
    metadata.versions.push(newVersion);
    metadata.lastUpdated = new Date().toISOString();
    metadata.evolutionPath.push({
      from: metadata.versions[metadata.versions.length - 2] || 'initial',
      to: newVersion,
      trigger: trigger.type,
      timestamp: new Date().toISOString()
    });

    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }

  /**
   * Emit version snapshot
   */
  private async emitVersionSnapshot(version: PromptVersion, diff: PromptVersion['diff']): Promise<void> {
    const snapshotPath = `${this.SNAPSHOT_DIR}/${version.trigger.promptPath}/${version.version}.json`;
    
    await emitSystemLog('version-snapshot', {
      path: snapshotPath,
      content: JSON.stringify({ ...version, diff }, null, 2)
    });
  }

  /**
   * Log evolution details
   */
  private async logEvolution(
    trigger: RevisionTrigger,
    version: PromptVersion,
    diff: PromptVersion['diff']
  ): Promise<void> {
    const logEntry = `
## [${new Date().toISOString()}] Prompt Evolution

### Version: ${version.version}
- Trigger: ${trigger.type}
- Priority: ${trigger.priority}
- Metrics: ${JSON.stringify(version.metrics)}

### Changes:
${diff?.additions.map(add => `+ ${add}`).join('\n')}
${diff?.removals.map(rem => `- ${rem}`).join('\n')}
${diff?.modifications.map(mod => `
~ ${mod.before}
+ ${mod.after}
Context:
${mod.context}
`).join('\n')}
`;

    await emitSystemLog('prompt-evolution', {
      path: '/prompt-evolution.log.md',
      content: logEntry
    });
  }

  /**
   * Handle rollback request
   */
  async handleRollbackRequest(request: { promptPath: string; targetVersion: string }): Promise<void> {
    try {
      const metadata = await this.getVersionMetadata(request.promptPath);
      const targetIndex = metadata.versions.indexOf(request.targetVersion);
      
      if (targetIndex === -1) {
        throw new Error(`Version ${request.targetVersion} not found`);
      }

      // Get target version content
      const targetContent = await this.getVersionContent(request.promptPath, request.targetVersion);
      
      // Apply rollback
      await this.applyRollback(request.promptPath, targetContent, request.targetVersion);
      
      // Log rollback
      await this.logRollback(request, metadata.currentVersion);
    } catch (error) {
      console.error('Failed to handle rollback request:', error);
      throw error;
    }
  }

  /**
   * Apply rollback to specific version
   */
  private async applyRollback(promptPath: string, content: string, version: string): Promise<void> {
    // Update current prompt content
    await fs.writeFile(promptPath, content);
    
    // Update metadata
    const metadata = await this.getVersionMetadata(promptPath);
    metadata.currentVersion = version;
    metadata.lastUpdated = new Date().toISOString();
    
    await fs.writeFile(
      `${this.SNAPSHOT_DIR}/${promptPath}/${this.METADATA_FILE}`,
      JSON.stringify(metadata, null, 2)
    );
  }

  /**
   * Log rollback operation
   */
  private async logRollback(
    request: { promptPath: string; targetVersion: string },
    fromVersion: string
  ): Promise<void> {
    const logEntry = `
## [${new Date().toISOString()}] Prompt Rollback

### Details
- Prompt: ${request.promptPath}
- From: ${fromVersion}
- To: ${request.targetVersion}

### Reason
Rollback requested to version ${request.targetVersion}
`;

    await emitSystemLog('prompt-rollback', {
      path: '/prompt-evolution.log.md',
      content: logEntry
    });
  }

  /**
   * Get current prompt content
   */
  private async getCurrentPromptContent(promptPath: string): Promise<string> {
    return fs.readFile(promptPath, 'utf8');
  }

  /**
   * Get version content
   */
  private async getVersionContent(promptPath: string, version: string): Promise<string> {
    const snapshotPath = `${this.SNAPSHOT_DIR}/${promptPath}/${version}.json`;
    const content = await fs.readFile(snapshotPath, 'utf8');
    return JSON.parse(content).content;
  }

  /**
   * Get version metadata
   */
  private async getVersionMetadata(promptPath: string): Promise<VersionMetadata> {
    const metadataPath = `${this.SNAPSHOT_DIR}/${promptPath}/${this.METADATA_FILE}`;
    const content = await fs.readFile(metadataPath, 'utf8');
    return JSON.parse(content);
  }

  /**
   * Generate new version number
   */
  private async generateVersionNumber(promptPath: string): Promise<string> {
    const metadata = await this.getVersionMetadata(promptPath);
    const lastVersion = metadata.versions[metadata.versions.length - 1] || 'v0.0.0';
    const [major, minor, patch] = lastVersion.slice(1).split('.').map(Number);
    return `${this.VERSION_PREFIX}${major}.${minor}.${patch + 1}`;
  }

  /**
   * Calculate metrics for prompt content
   */
  private async calculateMetrics(content: string): Promise<PromptVersion['metrics']> {
    // In real implementation, this would use more sophisticated analysis
    return {
      clarity: 0.85,
      trust: 0.9,
      empathy: 0.8,
      emotionalResonance: 0.85
    };
  }
} 