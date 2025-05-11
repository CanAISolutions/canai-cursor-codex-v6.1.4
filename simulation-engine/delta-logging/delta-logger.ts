import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../utils/logger';
import { AutoQuarantine } from '../quarantine/auto-quarantine';

/**
 * DeltaLogger - Handles delta calculation and logging for simulation runs
 */
export class DeltaLogger {
  private readonly logger: Logger;
  private readonly quarantine: AutoQuarantine;
  private readonly outputDeltaLogPath: string;
  private readonly personaWatchLogPath: string;
  private readonly resultsDir: string;
  private readonly reportsDir: string;

  constructor(
    outputDeltaLogPath: string = path.resolve('simulation-engine/outputDeltaLog.md'),
    personaWatchLogPath: string = path.resolve('simulation-engine/persona-watch.log.md'),
    resultsDir: string = path.resolve('simulation-engine/results'),
    reportsDir: string = path.resolve('simulation-engine/reports')
  ) {
    this.logger = new Logger('DeltaLogger');
    this.quarantine = new AutoQuarantine();
    this.outputDeltaLogPath = outputDeltaLogPath;
    this.personaWatchLogPath = personaWatchLogPath;
    this.resultsDir = resultsDir;
    this.reportsDir = reportsDir;
    if (!fs.existsSync(this.resultsDir)) fs.mkdirSync(this.resultsDir, { recursive: true });
    if (!fs.existsSync(this.reportsDir)) fs.mkdirSync(this.reportsDir, { recursive: true });
  }

  /**
   * Main entry: logs all deltas, traces, and triggers quarantine if needed
   */
  public async logDeltas({
    scenario,
    weakOutput,
    strongOutput,
    weakScores,
    strongScores,
    weakMetrics,
    strongMetrics
  }: {
    scenario: any,
    weakOutput: string,
    strongOutput: string,
    weakScores: Record<string, number>,
    strongScores: Record<string, number>,
    weakMetrics: Record<string, any>,
    strongMetrics: Record<string, any>
  }): Promise<void> {
    const scenarioId = scenario.scenario_id;
    // Calculate deltas
    const clarityDelta = (strongScores.clarity ?? 0) - (weakScores.clarity ?? 0);
    const empathyDrift = Math.abs((strongScores.empathy ?? 0) - (weakScores.empathy ?? 0));
    const trustRegression = (strongScores.trust ?? 0) < (weakScores.trust ?? 0);
    const memoryMismatch = this.calcMemoryMismatch(weakOutput, strongOutput);
    const personaMisalignment = this.calcPersonaMisalignment(scenario, strongOutput);

    // Compose delta object
    const delta = {
      scenario_id: scenarioId,
      timestamp: new Date().toISOString(),
      clarity_delta: clarityDelta,
      empathy_drift: empathyDrift,
      trust_regression: trustRegression,
      memory_mismatch: memoryMismatch,
      persona_misalignment: personaMisalignment
    };

    // 1. outputDeltaLog (append-safe, Markdown)
    this.appendMarkdownLog(this.outputDeltaLogPath, `\n### Scenario: ${scenarioId}\n- Clarity Δ: ${clarityDelta.toFixed(3)}\n- Empathy Drift: ${empathyDrift.toFixed(3)}\n- Trust Regression: ${trustRegression}\n- Memory Mismatch: ${memoryMismatch}\n- Persona Misalignment: ${personaMisalignment}`);

    // 2. persona-watch.log.md (append-safe, Markdown)
    this.appendMarkdownLog(this.personaWatchLogPath, `\n### Scenario: ${scenarioId}\n- Empathy Drift: ${empathyDrift.toFixed(3)}\n- Memory Mismatch: ${memoryMismatch}\n- Persona Misalignment: ${personaMisalignment}`);

    // 3. results/{scenario_id}.json (full trace)
    const resultsPath = path.join(this.resultsDir, `${scenarioId}.json`);
    const trace = {
      scenario,
      weak: { output: weakOutput, scores: weakScores, metrics: weakMetrics },
      strong: { output: strongOutput, scores: strongScores, metrics: strongMetrics },
      delta,
      timestamp: new Date().toISOString()
    };
    fs.writeFileSync(resultsPath, JSON.stringify(trace, null, 2));

    // 4. reports/{scenario_id}-trace.md (plain-English trace)
    const traceMd = this.generateTraceMarkdown(scenario, weakOutput, strongOutput, weakScores, strongScores, delta);
    const tracePath = path.join(this.reportsDir, `${scenarioId}-trace.md`);
    fs.writeFileSync(tracePath, traceMd);

    // 5. Auto-quarantine if thresholds breached
    if (empathyDrift > 0.4 || memoryMismatch > 0.2 || trustRegression) {
      await this.quarantine.quarantine(trace, resultsPath);
      this.logger.warn(`Auto-quarantine triggered for scenario ${scenarioId}`);
    }

    this.logger.info(`Delta logging complete for scenario ${scenarioId}`);
  }

  /**
   * Calculates memory mismatch (simple Jaccard similarity on facts/keywords)
   */
  private calcMemoryMismatch(weak: string, strong: string): number {
    const weakFacts = this.extractFacts(weak);
    const strongFacts = this.extractFacts(strong);
    const intersection = weakFacts.filter(f => strongFacts.includes(f));
    const union = Array.from(new Set([...weakFacts, ...strongFacts]));
    if (union.length === 0) return 0;
    return 1 - intersection.length / union.length;
  }

  /**
   * Calculates persona misalignment (simple keyword match to persona background)
   */
  private calcPersonaMisalignment(scenario: any, output: string): number {
    const persona = scenario.persona_background || {};
    let mismatch = 0;
    if (persona.role && !output.toLowerCase().includes(persona.role.toLowerCase())) mismatch += 0.25;
    if (persona.domain && !output.toLowerCase().includes(persona.domain.toLowerCase())) mismatch += 0.25;
    if (persona.tone && !output.toLowerCase().includes(persona.tone.toLowerCase())) mismatch += 0.25;
    if (persona.expertise && !output.toLowerCase().includes(persona.expertise.toLowerCase())) mismatch += 0.25;
    return mismatch;
  }

  /**
   * Extracts facts/keywords from output (naive noun extraction)
   */
  private extractFacts(text: string): string[] {
    return (text.match(/\b\w{4,}\b/g) || []).map(w => w.toLowerCase());
  }

  /**
   * Appends a Markdown log entry (append-safe)
   */
  private appendMarkdownLog(filePath: string, entry: string): void {
    fs.appendFileSync(filePath, entry + '\n');
  }

  /**
   * Generates a plain-English trace for the scenario
   */
  private generateTraceMarkdown(
    scenario: any,
    weakOutput: string,
    strongOutput: string,
    weakScores: Record<string, number>,
    strongScores: Record<string, number>,
    delta: any
  ): string {
    return `# Scenario Trace: ${scenario.scenario_id}

**Prompt Type:** ${scenario.promptType}
**Persona:** ${JSON.stringify(scenario.persona_background, null, 2)}

## Weak Input
${scenario.weak_input}

### Weak Output
${weakOutput}

#### Weak Scores
${JSON.stringify(weakScores, null, 2)}

## Strong Input
${scenario.strong_input}

### Strong Output
${strongOutput}

#### Strong Scores
${JSON.stringify(strongScores, null, 2)}

## Delta Metrics
${JSON.stringify(delta, null, 2)}
`;
  }
} 