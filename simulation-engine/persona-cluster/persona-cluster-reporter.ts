// PersonaClusterReporter: Aggregates scenario results by persona and emits cluster reports
// What/Why/How: Enables persona-level insight, drift detection, and CI-friendly reporting for simulation engine

import * as fs from 'fs';
import * as path from 'path';

/**
 * PersonaClusterReporter - Aggregates scenario results by persona and emits cluster reports
 * - Scans all scenario results
 * - Groups by persona_id
 * - Aggregates trust, clarity, empathy, drift, and memory metrics
 * - Detects drift-prone personas, trust degradation, coachability outliers
 * - Emits append-safe, CI-friendly JSON reports to /persona-cluster-reports/{persona_id}.json
 */
export class PersonaClusterReporter {
  private readonly resultsDir: string;
  private readonly reportDir: string;
  private readonly logPath: string;

  constructor(
    resultsDir: string = path.resolve('simulation-engine/results'),
    reportDir: string = path.resolve('persona-cluster-reports'),
    logPath: string = path.resolve('cursor/auto-actions.log.md')
  ) {
    this.resultsDir = resultsDir;
    this.reportDir = reportDir;
    this.logPath = logPath;
    if (!fs.existsSync(this.reportDir)) fs.mkdirSync(this.reportDir, { recursive: true });
  }

  /**
   * Main entry: scans results, aggregates by persona, emits reports
   */
  public async run(): Promise<void> {
    // Log start
    this.logAction('Starting PersonaClusterReporter run.');
    const allResults = this.loadAllResults();
    const personaMap = this.groupByPersona(allResults);
    for (const personaId of Object.keys(personaMap)) {
      const report = this.aggregatePersona(personaId, personaMap[personaId]);
      this.emitPersonaReport(personaId, report);
    }
    this.logAction('PersonaClusterReporter run complete.');
  }

  /**
   * Loads all scenario result JSON files from resultsDir
   */
  private loadAllResults(): any[] {
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
   * Groups results by persona_id
   */
  private groupByPersona(results: any[]): Record<string, any[]> {
    const map: Record<string, any[]> = {};
    for (const result of results) {
      const personaId = result?.scenario?.persona_id || result?.scenario?.persona_background || 'unknown';
      if (!map[personaId]) map[personaId] = [];
      map[personaId].push(result);
    }
    return map;
  }

  /**
   * Aggregates metrics and flags for a persona
   */
  private aggregatePersona(personaId: string, results: any[]): any {
    // Initialize accumulators
    let trustSum = 0, claritySum = 0, empathySum = 0, driftSum = 0, memorySum = 0;
    let trustCount = 0, clarityCount = 0, empathyCount = 0, driftCount = 0, memoryCount = 0;
    const scenarioBreakdowns: any[] = [];
    const flags: string[] = [];
    // For each scenario, extract metrics
    for (const result of results) {
      const scores = result.scores || result.scoring?.scores || {};
      const metrics = result.metrics || result.scoring?.metrics || {};
      // Trust
      if (scores.trust !== undefined) { trustSum += scores.trust; trustCount++; }
      // Clarity
      if (scores.clarity !== undefined) { claritySum += scores.clarity; clarityCount++; }
      // Empathy
      if (scores.empathy !== undefined) { empathySum += scores.empathy; empathyCount++; }
      // Drift
      if (metrics.drift !== undefined) { driftSum += metrics.drift; driftCount++; }
      // Memory
      if (metrics.memory !== undefined) { memorySum += metrics.memory; memoryCount++; }
      // Collect scenario breakdown
      scenarioBreakdowns.push({
        scenario_id: result?.scenario?.id || result?.scenario_id || 'unknown',
        trust: scores.trust,
        clarity: scores.clarity,
        empathy: scores.empathy,
        drift: metrics.drift,
        memory: metrics.memory,
        flags: result.flags || result.scoring?.flags || []
      });
      // Outlier/flag detection
      if (scores.trust !== undefined && scores.trust < 4.2) flags.push('trust_degradation');
      if (metrics.drift !== undefined && metrics.drift > 0.3) flags.push('drift_prone');
      if (scores.coachability !== undefined && scores.coachability < 0.7) flags.push('coachability_outlier');
    }
    // Compose summary
    const summary = {
      persona_id: personaId,
      average_trust: trustCount ? trustSum / trustCount : null,
      average_clarity: clarityCount ? claritySum / clarityCount : null,
      average_empathy: empathyCount ? empathySum / empathyCount : null,
      average_drift: driftCount ? driftSum / driftCount : null,
      average_memory: memoryCount ? memorySum / memoryCount : null,
      scenario_count: results.length,
      flags: Array.from(new Set(flags)),
      scenario_breakdowns: scenarioBreakdowns
    };
    return summary;
  }

  /**
   * Emits a persona cluster report as append-safe JSON
   */
  private emitPersonaReport(personaId: string, report: any): void {
    const outPath = path.join(this.reportDir, `${personaId}.json`);
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
    this.logAction(`Wrote persona cluster report: ${outPath}`);
  }

  /**
   * Appends an action to the auto-actions log
   */
  private logAction(msg: string): void {
    const entry = `\n[${new Date().toISOString()}] PersonaClusterReporter: ${msg}`;
    fs.appendFileSync(this.logPath, entry);
  }
}

// If run directly, execute the reporter
if (require.main === module) {
  (async () => {
    const reporter = new PersonaClusterReporter();
    await reporter.run();
  })();
} 