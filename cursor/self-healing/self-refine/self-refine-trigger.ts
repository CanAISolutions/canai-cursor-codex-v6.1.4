/**
 * self-refine-trigger.ts
 * 
 * Purpose: Convert clarity deltas, drift risks, and phantom prompt failures into prompt revision signals.
 * Triggered: During session evolution, after clarity checks, or when phantom prompts outperform.
 * Enforces: Automatic evolution, quality maintenance, and emotional continuity.
 */

import { EventBus } from '../../event-bus/eventBus';
import { analyzeOutputDelta } from '../output-delta-analyzer';
import { calculateEmotionalResonanceScore } from '../../utils/dreamstate-utils';
import { emitSystemLog } from '../../system-intel/audit-utils';

interface RevisionTrigger {
  type: 'clarity' | 'trust' | 'empathy' | 'phantom' | 'misalignment';
  scenarioId: string;
  promptPath: string;
  priority: 'low' | 'medium' | 'high';
  metrics: {
    delta?: number;
    drift?: number;
    trustScore?: number;
    phantomMetrics?: Record<string, number>;
  };
  timestamp: string;
}

interface RevisionQueue {
  scenarioId: string;
  triggers: RevisionTrigger[];
  priority: 'low' | 'medium' | 'high';
  promptPath: string;
}

export { RevisionTrigger };

export class SelfRefineTriggerLayer {
  private eventBus: EventBus;
  private readonly CLARITY_THRESHOLD = 1.0;
  private readonly EMPATHY_DRIFT_THRESHOLD = 0.4;
  private readonly PHANTOM_METRICS_THRESHOLD = 2;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Process output delta log and generate revision triggers
   */
  async processOutputDeltaLog(deltaLog: any): Promise<RevisionTrigger[]> {
    const triggers: RevisionTrigger[] = [];

    // Check clarity delta
    if (deltaLog.clarityDelta > this.CLARITY_THRESHOLD) {
      triggers.push({
        type: 'clarity',
        scenarioId: deltaLog.scenarioId,
        promptPath: deltaLog.promptPath,
        priority: 'high',
        metrics: { delta: deltaLog.clarityDelta },
        timestamp: new Date().toISOString()
      });
    }

    // Check trust regression
    if (deltaLog.trustRegression) {
      triggers.push({
        type: 'trust',
        scenarioId: deltaLog.scenarioId,
        promptPath: deltaLog.promptPath,
        priority: 'high',
        metrics: { trustScore: deltaLog.trustScore },
        timestamp: new Date().toISOString()
      });
    }

    return triggers;
  }

  /**
   * Process persona cluster reports for drift detection
   */
  async processPersonaReports(reports: any[]): Promise<RevisionTrigger[]> {
    const triggers: RevisionTrigger[] = [];

    for (const report of reports) {
      if (report.drift > this.EMPATHY_DRIFT_THRESHOLD) {
        triggers.push({
          type: 'empathy',
          scenarioId: report.scenarioId,
          promptPath: report.promptPath,
          priority: 'medium',
          metrics: { drift: report.drift },
          timestamp: new Date().toISOString()
        });
      }

      if (report.personaMismatch) {
        triggers.push({
          type: 'misalignment',
          scenarioId: report.scenarioId,
          promptPath: report.promptPath,
          priority: 'high',
          metrics: {},
          timestamp: new Date().toISOString()
        });
      }
    }

    return triggers;
  }

  /**
   * Process phantom prompt results
   */
  async processPhantomResults(results: any[]): Promise<RevisionTrigger[]> {
    const triggers: RevisionTrigger[] = [];

    for (const result of results) {
      const outperformingMetrics = Object.entries(result.metrics)
        .filter(([_, value]) => typeof value === 'number' && value >= this.PHANTOM_METRICS_THRESHOLD)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      if (Object.keys(outperformingMetrics).length > 0) {
        triggers.push({
          type: 'phantom',
          scenarioId: result.scenarioId,
          promptPath: result.promptPath,
          priority: 'medium',
          metrics: { phantomMetrics: outperformingMetrics },
          timestamp: new Date().toISOString()
        });
      }
    }

    return triggers;
  }

  /**
   * Generate revision queue from triggers
   */
  async generateRevisionQueue(triggers: RevisionTrigger[]): Promise<RevisionQueue[]> {
    const queueMap = new Map<string, RevisionQueue>();

    for (const trigger of triggers) {
      if (!queueMap.has(trigger.scenarioId)) {
        queueMap.set(trigger.scenarioId, {
          scenarioId: trigger.scenarioId,
          triggers: [],
          priority: 'low',
          promptPath: trigger.promptPath
        });
      }

      const queue = queueMap.get(trigger.scenarioId)!;
      queue.triggers.push(trigger);
      
      // Update priority based on trigger priority
      if (trigger.priority === 'high' || 
          (trigger.priority === 'medium' && queue.priority === 'low')) {
        queue.priority = trigger.priority;
      }
    }

    return Array.from(queueMap.values());
  }

  /**
   * Emit revision queue to files
   */
  async emitRevisionQueue(queue: RevisionQueue[]): Promise<void> {
    for (const item of queue) {
      // Emit JSON file
      await emitSystemLog('revision-queue', {
        path: `/revision-queue/${item.scenarioId}.json`,
        content: JSON.stringify(item, null, 2)
      });

      // Emit to revision triggers log
      await emitSystemLog('revision-triggers', {
        path: '/revision-triggers.log.md',
        content: this.formatRevisionTriggerLog(item)
      });
    }
  }

  /**
   * Format revision trigger log entry
   */
  private formatRevisionTriggerLog(queue: RevisionQueue): string {
    return `
## [${new Date().toISOString()}] Revision Queue Entry

### Scenario: ${queue.scenarioId}
- Priority: ${queue.priority}
- Prompt Path: ${queue.promptPath}

### Triggers:
${queue.triggers.map(trigger => `
- Type: ${trigger.type}
  - Priority: ${trigger.priority}
  - Metrics: ${JSON.stringify(trigger.metrics)}
`).join('\n')}
`;
  }
} 