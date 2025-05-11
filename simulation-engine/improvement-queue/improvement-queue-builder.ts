// ImprovementQueueBuilder: Aggregates deltas, score trends, drift triggers, and ethical incidents
// What/Why/How: Ranks scenarios by opportunity delta and emits a human-readable priority queue and a sortable CI artifact

import * as fs from 'fs';
import * as path from 'path';

/**
 * ImprovementQueueBuilder - Aggregates deltas, score trends, drift triggers, and ethical incidents
 * - Ranks scenarios by opportunity delta (uplift potential × severity)
 * - Emits a human-readable priority queue and a sortable CI artifact
 */
export class ImprovementQueueBuilder {
  private readonly resultsDir: string;
  private readonly reportPath: string;
  private readonly jsonPath: string;
  private readonly logPath: string;

  constructor(
    resultsDir: string = path.resolve('simulation-engine/results'),
    reportPath: string = path.resolve('reports/improvement-queue.md'),
    jsonPath: string = path.resolve('simulation-engine/improvement-queue.json'),
    logPath: string = path.resolve('cursor/auto-actions.log.md')
  ) {
    this.resultsDir = resultsDir;
    this.reportPath = reportPath;
    this.jsonPath = jsonPath;
    this.logPath = logPath;
    if (!fs.existsSync(path.dirname(this.reportPath))) fs.mkdirSync(path.dirname(this.reportPath), { recursive: true });
  }

  /**
   * Main entry: aggregates data, ranks scenarios, emits queue
   */
  public async run(): Promise<void> {
    this.logAction('Starting ImprovementQueueBuilder run.');
    const results = this.loadResults();
    const queue = this.buildQueue(results);
    this.emitQueue(queue);
    this.logAction('ImprovementQueueBuilder run complete.');
  }

  /**
   * Loads all scenario result JSON files from resultsDir
   */
  private loadResults(): any[] {
    const files = fs.readdirSync(this.resultsDir).filter(f => f.endsWith('.json'));
    const results: any[] = [];
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(this.resultsDir, file), 'utf-8'));
        results.push(data);
      } catch (e) {
        this.logAction(`Failed to parse result file: ${file}`);
      }
    }
    return results;
  }

  /**
   * Builds the improvement queue by ranking scenarios
   */
  private buildQueue(results: any[]): any[] {
    return results.map(result => {
      const opportunityDelta = this.calculateOpportunityDelta(result);
      return {
        scenario_id: result?.scenario?.id || result?.scenario_id || 'unknown',
        primary_failing_metrics: this.identifyFailingMetrics(result),
        suggested_improvement_type: this.suggestImprovementType(result),
        prompt_scaffold_path: result?.scenario?.scaffold_path || 'unknown',
        risk_flags: result.flags || result.scoring?.flags || [],
        estimated_gain: opportunityDelta
      };
    }).sort((a, b) => b.estimated_gain - a.estimated_gain);
  }

  /**
   * Calculates the opportunity delta for a scenario
   */
  private calculateOpportunityDelta(result: any): number {
    const upliftPotential = result.uplift_potential || 0;
    const severity = result.severity || 0;
    return upliftPotential * severity;
  }

  /**
   * Identifies the primary failing metrics for a scenario
   */
  private identifyFailingMetrics(result: any): string[] {
    const metrics: string[] = [];
    const scores = result.scores || result.scoring?.scores || {};
    if (scores.trust !== undefined && scores.trust < 4.2) metrics.push('trust');
    if (scores.clarity !== undefined && scores.clarity < 0.7) metrics.push('clarity');
    if (scores.empathy !== undefined && scores.empathy < 0.7) metrics.push('empathy');
    return metrics;
  }

  /**
   * Suggests an improvement type based on failing metrics
   */
  private suggestImprovementType(result: any): string {
    const failingMetrics = this.identifyFailingMetrics(result);
    if (failingMetrics.includes('trust')) return 'trust realignment';
    if (failingMetrics.includes('clarity')) return 'clarity nudge';
    if (failingMetrics.includes('empathy')) return 'empathy reframe';
    return 'general improvement';
  }

  /**
   * Emits the improvement queue as a Markdown file and JSON artifact
   */
  private emitQueue(queue: any[]): void {
    const markdown = this.formatQueueAsMarkdown(queue);
    const json = JSON.stringify(queue, null, 2);
    fs.writeFileSync(this.reportPath, markdown);
    fs.writeFileSync(this.jsonPath, json);
    this.logAction(`Wrote improvement queue: ${this.reportPath} and ${this.jsonPath}`);
  }

  /**
   * Formats the queue as a human-readable Markdown string
   */
  private formatQueueAsMarkdown(queue: any[]): string {
    return `# Improvement Queue

${queue.map(q => `## Scenario ${q.scenario_id}
- Primary Failing Metrics: ${q.primary_failing_metrics.join(', ')}
- Suggested Improvement Type: ${q.suggested_improvement_type}
- Prompt Scaffold Path: ${q.prompt_scaffold_path}
- Risk Flags: ${q.risk_flags.join(', ')}
- Estimated Gain: ${q.estimated_gain}
`).join('\n')}
`;
  }

  /**
   * Appends an action to the auto-actions log
   */
  private logAction(msg: string): void {
    const entry = `\n[${new Date().toISOString()}] ImprovementQueueBuilder: ${msg}`;
    fs.appendFileSync(this.logPath, entry);
  }
}

// If run directly, execute the builder
if (require.main === module) {
  (async () => {
    const builder = new ImprovementQueueBuilder();
    await builder.run();
  })();
} 