// SelfRefineTrigger: Triggers prompt revision heuristics based on top delta sources
// What/Why/How: Integrates with outputDeltaLog, ImprovementQueueBuilder, and phantom winner trends to emit revision triggers

import * as fs from 'fs';
import * as path from 'path';
import { LogEntry } from '../../log-utils';

export class SelfRefineTrigger {
  private readonly outputDeltaLogPath: string;
  private readonly improvementQueuePath: string;
  private readonly revisionQueueDir: string;
  private readonly revisionTriggersLogPath: string;

  constructor(
    outputDeltaLogPath: string = path.resolve('simulation-engine/outputDeltaLog.json'),
    improvementQueuePath: string = path.resolve('simulation-engine/improvement-queue.json'),
    revisionQueueDir: string = path.resolve('simulation-engine/revision-queue'),
    revisionTriggersLogPath: string = path.resolve('simulation-engine/revision-triggers.log')
  ) {
    this.outputDeltaLogPath = outputDeltaLogPath;
    this.improvementQueuePath = improvementQueuePath;
    this.revisionQueueDir = revisionQueueDir;
    this.revisionTriggersLogPath = revisionTriggersLogPath;
    if (!fs.existsSync(this.revisionQueueDir)) fs.mkdirSync(this.revisionQueueDir, { recursive: true });
  }

  /**
   * Main entry: triggers prompt revision heuristics for each scenario
   */
  public async run(): Promise<void> {
    const outputDeltaLog = this.loadOutputDeltaLog();
    const improvementQueue = this.loadImprovementQueue();
    const revisionTriggers = this.generateRevisionTriggers(outputDeltaLog, improvementQueue);
    this.emitRevisionTriggers(revisionTriggers);
    this.logRevisionTriggers(revisionTriggers);
  }

  /**
   * Loads the output delta log
   */
  private loadOutputDeltaLog(): any {
    try {
      return JSON.parse(fs.readFileSync(this.outputDeltaLogPath, 'utf-8'));
    } catch (e) {
      console.error('Failed to load output delta log:', e);
      return {};
    }
  }

  /**
   * Loads the improvement queue
   */
  private loadImprovementQueue(): any[] {
    try {
      return JSON.parse(fs.readFileSync(this.improvementQueuePath, 'utf-8'));
    } catch (e) {
      console.error('Failed to load improvement queue:', e);
      return [];
    }
  }

  /**
   * Generates revision triggers based on output delta log and improvement queue
   */
  private generateRevisionTriggers(outputDeltaLog: any, improvementQueue: any[]): any[] {
    return improvementQueue.map(scenario => {
      const scenarioId = scenario.scenario_id;
      const deltaSources = outputDeltaLog[scenarioId] || [];
      return {
        scenario_id: scenarioId,
        delta_sources: deltaSources,
        revision_heuristics: this.determineRevisionHeuristics(deltaSources)
      };
    });
  }

  /**
   * Determines revision heuristics based on delta sources
   */
  private determineRevisionHeuristics(deltaSources: any[]): string[] {
    const heuristics: string[] = [];
    if (deltaSources.some(d => d.metric === 'trust' && d.value < 4.2)) heuristics.push('trust realignment');
    if (deltaSources.some(d => d.metric === 'clarity' && d.value < 0.7)) heuristics.push('clarity nudge');
    if (deltaSources.some(d => d.metric === 'empathy' && d.value < 0.7)) heuristics.push('empathy reframe');
    return heuristics;
  }

  /**
   * Emits revision triggers to /revision-queue/{scenario_id}.json
   */
  private emitRevisionTriggers(revisionTriggers: any[]): void {
    for (const trigger of revisionTriggers) {
      const filePath = path.join(this.revisionQueueDir, `${trigger.scenario_id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(trigger, null, 2));
    }
  }

  /**
   * Logs revision triggers to revision-triggers.log
   */
  private logRevisionTriggers(revisionTriggers: any[]): void {
    const logContent = revisionTriggers.map(trigger => `Scenario ${trigger.scenario_id}: ${trigger.revision_heuristics.join(', ')}`).join('\n');
    fs.appendFileSync(this.revisionTriggersLogPath, logContent + '\n');
  }
}

// If run directly, execute the trigger
if (require.main === module) {
  (async () => {
    const trigger = new SelfRefineTrigger();
    await trigger.run();
  })();
} 