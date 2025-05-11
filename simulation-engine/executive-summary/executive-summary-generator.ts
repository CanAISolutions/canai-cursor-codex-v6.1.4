// Executive Summary Generator: Aggregates scenario and persona logs to produce a stakeholder-facing summary
// What/Why/How: Provides a human-readable, CI-exportable summary of simulation results, highlighting key insights and actionable improvements

import * as fs from 'fs';
import * as path from 'path';

/**
 * ExecutiveSummaryGenerator - Aggregates scenario and persona logs to produce a stakeholder-facing summary
 * - Parses all scenario and persona logs
 * - Aggregates data to identify top failing prompts, persona insights, ethical incidents, phantom winners, and suggested improvements
 * - Emits a human-readable, CI-exportable Markdown summary to /reports/executive-summary.md
 */
export class ExecutiveSummaryGenerator {
  private readonly resultsDir: string;
  private readonly personaReportsDir: string;
  private readonly reportPath: string;
  private readonly logPath: string;

  constructor(
    resultsDir: string = path.resolve('simulation-engine/results'),
    personaReportsDir: string = path.resolve('persona-cluster-reports'),
    reportPath: string = path.resolve('reports/executive-summary.md'),
    logPath: string = path.resolve('cursor/auto-actions.log.md')
  ) {
    this.resultsDir = resultsDir;
    this.personaReportsDir = personaReportsDir;
    this.reportPath = reportPath;
    this.logPath = logPath;
    if (!fs.existsSync(path.dirname(this.reportPath))) fs.mkdirSync(path.dirname(this.reportPath), { recursive: true });
  }

  /**
   * Main entry: parses logs, aggregates data, emits summary
   */
  public async run(): Promise<void> {
    this.logAction('Starting Executive Summary Generator run.');
    const scenarioResults = this.loadScenarioResults();
    const personaReports = this.loadPersonaReports();
    const summary = this.aggregateSummary(scenarioResults, personaReports);
    this.emitSummary(summary);
    this.logAction('Executive Summary Generator run complete.');
  }

  /**
   * Loads all scenario result JSON files from resultsDir
   */
  private loadScenarioResults(): any[] {
    const files = fs.readdirSync(this.resultsDir).filter(f => f.endsWith('.json'));
    const results: any[] = [];
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(this.resultsDir, file), 'utf-8'));
        results.push(data);
      } catch (e) {
        this.logAction(`Failed to parse scenario result file: ${file}`);
      }
    }
    return results;
  }

  /**
   * Loads all persona cluster report JSON files from personaReportsDir
   */
  private loadPersonaReports(): any[] {
    const files = fs.readdirSync(this.personaReportsDir).filter(f => f.endsWith('.json'));
    const reports: any[] = [];
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(this.personaReportsDir, file), 'utf-8'));
        reports.push(data);
      } catch (e) {
        this.logAction(`Failed to parse persona report file: ${file}`);
      }
    }
    return reports;
  }

  /**
   * Aggregates scenario and persona data into a summary
   */
  private aggregateSummary(scenarioResults: any[], personaReports: any[]): any {
    // Identify top failing prompts (low uplift, trust drop, drift flags)
    const failingPrompts = this.identifyFailingPrompts(scenarioResults);
    // Extract persona insights (risk, fatigue, growth opportunity)
    const personaInsights = this.extractPersonaInsights(personaReports);
    // Identify ethical incidents (quarantine triggers, bias, regression)
    const ethicalIncidents = this.identifyEthicalIncidents(scenarioResults);
    // Identify phantom winners (impact-delta logged)
    const phantomWinners = this.identifyPhantomWinners(scenarioResults);
    // Generate suggested improvements (ranked for fixability + impact)
    const suggestedImprovements = this.generateSuggestedImprovements(scenarioResults, personaReports);
    // Compose summary
    return {
      failingPrompts,
      personaInsights,
      ethicalIncidents,
      phantomWinners,
      suggestedImprovements
    };
  }

  /**
   * Identifies top failing prompts based on low uplift, trust drop, and drift flags
   */
  private identifyFailingPrompts(scenarioResults: any[]): any[] {
    return scenarioResults
      .filter(result => {
        const scores = result.scores || result.scoring?.scores || {};
        const metrics = result.metrics || result.scoring?.metrics || {};
        return (scores.trust !== undefined && scores.trust < 4.2) ||
               (metrics.drift !== undefined && metrics.drift > 0.3) ||
               (scores.clarity !== undefined && scores.clarity < 0.7);
      })
      .map(result => ({
        scenario_id: result?.scenario?.id || result?.scenario_id || 'unknown',
        trust: result.scores?.trust,
        drift: result.metrics?.drift,
        clarity: result.scores?.clarity
      }));
  }

  /**
   * Extracts persona insights from persona reports
   */
  private extractPersonaInsights(personaReports: any[]): any[] {
    return personaReports.map(report => ({
      persona_id: report.persona_id,
      average_trust: report.average_trust,
      average_drift: report.average_drift,
      flags: report.flags
    }));
  }

  /**
   * Identifies ethical incidents from scenario results
   */
  private identifyEthicalIncidents(scenarioResults: any[]): any[] {
    return scenarioResults
      .filter(result => {
        const flags = result.flags || result.scoring?.flags || [];
        return flags.includes('quarantine_trigger') || flags.includes('bias') || flags.includes('regression');
      })
      .map(result => ({
        scenario_id: result?.scenario?.id || result?.scenario_id || 'unknown',
        flags: result.flags || result.scoring?.flags || []
      }));
  }

  /**
   * Identifies phantom winners based on impact-delta logged
   */
  private identifyPhantomWinners(scenarioResults: any[]): any[] {
    return scenarioResults
      .filter(result => result.phantom_winner)
      .map(result => ({
        scenario_id: result?.scenario?.id || result?.scenario_id || 'unknown',
        impact_delta: result.impact_delta
      }));
  }

  /**
   * Generates suggested improvements ranked for fixability + impact
   */
  private generateSuggestedImprovements(scenarioResults: any[], personaReports: any[]): any[] {
    // Placeholder logic: rank improvements based on fixability and impact
    return [
      { improvement: 'Enhance trust scoring', fixability: 0.8, impact: 0.9 },
      { improvement: 'Reduce drift in persona alignment', fixability: 0.7, impact: 0.8 },
      { improvement: 'Improve clarity in failing prompts', fixability: 0.6, impact: 0.7 }
    ];
  }

  /**
   * Emits the executive summary as a Markdown file
   */
  private emitSummary(summary: any): void {
    const markdown = this.formatSummaryAsMarkdown(summary);
    fs.writeFileSync(this.reportPath, markdown);
    this.logAction(`Wrote executive summary: ${this.reportPath}`);
  }

  /**
   * Formats the summary as a human-readable Markdown string
   */
  private formatSummaryAsMarkdown(summary: any): string {
    return `# Executive Summary

## Top Failing Prompts
${summary.failingPrompts.map((p: { scenario_id: string; trust: number; drift: number; clarity: number }) => `- ${p.scenario_id}: Trust ${p.trust}, Drift ${p.drift}, Clarity ${p.clarity}`).join('\n')}

## Persona Insights
${summary.personaInsights.map((p: { persona_id: string; average_trust: number; average_drift: number; flags: string[] }) => `- ${p.persona_id}: Trust ${p.average_trust}, Drift ${p.average_drift}, Flags ${p.flags.join(', ')}`).join('\n')}

## Ethical Incidents
${summary.ethicalIncidents.map((e: { scenario_id: string; flags: string[] }) => `- ${e.scenario_id}: Flags ${e.flags.join(', ')}`).join('\n')}

## Phantom Winners
${summary.phantomWinners.map((p: { scenario_id: string; impact_delta: number }) => `- ${p.scenario_id}: Impact Delta ${p.impact_delta}`).join('\n')}

## Suggested Improvements
${summary.suggestedImprovements.map((i: { improvement: string; fixability: number; impact: number }) => `- ${i.improvement}: Fixability ${i.fixability}, Impact ${i.impact}`).join('\n')}
`;
  }

  /**
   * Appends an action to the auto-actions log
   */
  private logAction(msg: string): void {
    const entry = `\n[${new Date().toISOString()}] ExecutiveSummaryGenerator: ${msg}`;
    fs.appendFileSync(this.logPath, entry);
  }
}

// If run directly, execute the generator
if (require.main === module) {
  (async () => {
    const generator = new ExecutiveSummaryGenerator();
    await generator.run();
  })();
} 