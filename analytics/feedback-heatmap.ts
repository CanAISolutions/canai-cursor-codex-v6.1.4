/**
 * FeedbackDelta Heatmap
 * Tracks most edited fields across sessions
 * Clusters edits by field, tone, and confidence gap
 * Flags fields needing Smart Default tuning
 */

import { EventBus } from '../cursor/utils/event-bus';
import { PromptLogs } from '../cursor/types/prompt-logs';

export interface FieldEdit {
  fieldName: string;
  timestamp: number;
  sessionId: string;
  promptType: string;
  tone: string;
  confidenceGap: number;
  editType: 'override' | 'revision' | 'default';
}

export interface FieldCluster {
  fieldName: string;
  editCount: number;
  averageConfidenceGap: number;
  toneDistribution: Map<string, number>;
  editTypes: {
    override: number;
    revision: number;
    default: number;
  };
  needsTuning: boolean;
}

export interface FeedbackHeatmap {
  fieldClusters: Map<string, FieldCluster>;
  sessionEdits: Map<string, FieldEdit[]>;
  promptTypeEdits: Map<string, FieldEdit[]>;
}

export class FeedbackDeltaTracker {
  private eventBus: EventBus;
  private fieldEdits: FieldEdit[];
  private fieldClusters: Map<string, FieldCluster>;
  private sessionEdits: Map<string, FieldEdit[]>;
  private promptTypeEdits: Map<string, FieldEdit[]>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.fieldEdits = [];
    this.fieldClusters = new Map();
    this.sessionEdits = new Map();
    this.promptTypeEdits = new Map();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.eventBus.on('FIELD_EDITED', this.handleFieldEdit.bind(this));
    this.eventBus.on('SMART_DEFAULT_APPLIED', this.handleSmartDefault.bind(this));
    this.eventBus.on('OVERRIDE_DETECTED', this.handleOverride.bind(this));
  }

  private handleFieldEdit(
    sessionId: string,
    fieldName: string,
    promptType: string,
    tone: string,
    confidenceGap: number
  ): void {
    const edit: FieldEdit = {
      fieldName,
      timestamp: Date.now(),
      sessionId,
      promptType,
      tone,
      confidenceGap,
      editType: 'revision'
    };

    this.addEdit(edit);
  }

  private handleSmartDefault(
    sessionId: string,
    fieldName: string,
    promptType: string,
    tone: string,
    confidenceGap: number
  ): void {
    const edit: FieldEdit = {
      fieldName,
      timestamp: Date.now(),
      sessionId,
      promptType,
      tone,
      confidenceGap,
      editType: 'default'
    };

    this.addEdit(edit);
  }

  private handleOverride(
    sessionId: string,
    fieldName: string,
    promptType: string,
    tone: string,
    confidenceGap: number
  ): void {
    const edit: FieldEdit = {
      fieldName,
      timestamp: Date.now(),
      sessionId,
      promptType,
      tone,
      confidenceGap,
      editType: 'override'
    };

    this.addEdit(edit);
  }

  private addEdit(edit: FieldEdit): void {
    this.fieldEdits.push(edit);
    this.updateClusters(edit);
    this.updateSessionEdits(edit);
    this.updatePromptTypeEdits(edit);
    this.emitAnalyticsMeta();
  }

  private updateClusters(edit: FieldEdit): void {
    let cluster = this.fieldClusters.get(edit.fieldName);
    if (!cluster) {
      cluster = {
        fieldName: edit.fieldName,
        editCount: 0,
        averageConfidenceGap: 0,
        toneDistribution: new Map(),
        editTypes: {
          override: 0,
          revision: 0,
          default: 0
        },
        needsTuning: false
      };
      this.fieldClusters.set(edit.fieldName, cluster);
    }

    // Update cluster metrics
    cluster.editCount++;
    cluster.averageConfidenceGap = (cluster.averageConfidenceGap * (cluster.editCount - 1) + edit.confidenceGap) / cluster.editCount;
    
    const toneCount = cluster.toneDistribution.get(edit.tone) || 0;
    cluster.toneDistribution.set(edit.tone, toneCount + 1);
    
    cluster.editTypes[edit.editType]++;

    // Determine if field needs tuning
    cluster.needsTuning = this.shouldTuneField(cluster);
  }

  private shouldTuneField(cluster: FieldCluster): boolean {
    const highConfidenceGap = cluster.averageConfidenceGap > 0.3;
    const highOverrideRate = cluster.editTypes.override / cluster.editCount > 0.2;
    const highEditCount = cluster.editCount > 10;
    
    return (highConfidenceGap && highOverrideRate) || (highEditCount && highConfidenceGap);
  }

  private updateSessionEdits(edit: FieldEdit): void {
    const sessionEdits = this.sessionEdits.get(edit.sessionId) || [];
    sessionEdits.push(edit);
    this.sessionEdits.set(edit.sessionId, sessionEdits);
  }

  private updatePromptTypeEdits(edit: FieldEdit): void {
    const promptTypeEdits = this.promptTypeEdits.get(edit.promptType) || [];
    promptTypeEdits.push(edit);
    this.promptTypeEdits.set(edit.promptType, promptTypeEdits);
  }

  private emitAnalyticsMeta(): void {
    const analyticsMeta: PromptLogs['analyticsMeta'] = {
      feedbackHeatmap: {
        fieldClusters: this.fieldClusters,
        sessionEdits: this.sessionEdits,
        promptTypeEdits: this.promptTypeEdits
      }
    };

    this.eventBus.emit('ANALYTICS_META_UPDATED', analyticsMeta);
  }

  public getFeedbackHeatmap(): FeedbackHeatmap {
    return {
      fieldClusters: this.fieldClusters,
      sessionEdits: this.sessionEdits,
      promptTypeEdits: this.promptTypeEdits
    };
  }

  public getFieldsNeedingTuning(): string[] {
    return Array.from(this.fieldClusters.entries())
      .filter(([_, cluster]) => cluster.needsTuning)
      .map(([fieldName]) => fieldName);
  }
} 