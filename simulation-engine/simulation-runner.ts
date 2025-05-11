import { Logger } from '../utils/logger';
import { EventBus } from '../utils/event-bus';
import { ScoringOrchestrator } from './metrics/scoring-orchestrator';
import { SchemaValidator } from './schema-validator';
import * as fs from 'fs';
import * as path from 'path';

/**
 * SimulationRunner - Orchestrates the execution of simulation scenarios
 * Manages prompt injection and result evaluation
 */
export class SimulationRunner {
  private logger: Logger;
  private eventBus: EventBus;
  private scoringOrchestrator: ScoringOrchestrator;
  private schemaValidator: SchemaValidator;
  private resultsDir: string;
  private reportsDir: string;

  constructor() {
    this.logger = new Logger('simulation-runner');
    this.eventBus = new EventBus();
    this.scoringOrchestrator = new ScoringOrchestrator();
    this.schemaValidator = new SchemaValidator();
    
    // Initialize directories
    this.resultsDir = path.join(__dirname, 'results');
    this.reportsDir = path.join(__dirname, 'reports');
    this.initializeDirectories();
  }

  /**
   * Initializes required directories
   */
  private initializeDirectories(): void {
    [this.resultsDir, this.reportsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Runs all simulation scenarios
   * @param scenariosPath Path to scenarios file
   */
  public async runScenarios(scenariosPath: string): Promise<void> {
    try {
      // Load scenarios
      const scenarios = this.loadScenarios(scenariosPath);
      this.logger.info(`Loaded ${scenarios.length} scenarios`);

      // Validate schema alignment
      const alignmentResults = await this.validateSchemaAlignment(scenarios);
      if (!alignmentResults.valid) {
        this.logger.error('Schema validation failed', alignmentResults.errors);
        return;
      }

      // Run each scenario
      for (const scenario of scenarios) {
        await this.runScenario(scenario);
      }

      // Generate final report
      await this.generateReport();
    } catch (error) {
      this.logger.error('Failed to run scenarios', error);
      throw error;
    }
  }

  /**
   * Runs a single simulation scenario
   * @param scenario The scenario to run
   */
  private async runScenario(scenario: any): Promise<void> {
    try {
      this.logger.info(`Running scenario: ${scenario.name}`);

      // Run inputs through prompt template
      const results = await this.runInputs(scenario);
      
      // Score results
      const scoringResults = await this.scoringOrchestrator.scoreResult(results);

      // Save results
      await this.saveResults(scenario.name, {
        scenario,
        results,
        scoring: scoringResults
      });

      // Emit completion event
      this.eventBus.emit('scenario:completed', {
        scenario,
        results,
        scoring: scoringResults
      });
    } catch (error) {
      this.logger.error(`Failed to run scenario: ${scenario.name}`, error);
      throw error;
    }
  }

  /**
   * Validates schema alignment for scenarios
   * @param scenarios The scenarios to validate
   * @returns Validation results
   */
  private async validateSchemaAlignment(scenarios: any[]): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    
    for (const scenario of scenarios) {
      const validation = await this.schemaValidator.validateScenario(scenario);
      if (validation.alignmentScore < 0.8) {
        errors.push(`Scenario ${scenario.name}: ${validation.errors.join(', ')}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Runs inputs through prompt template
   * @param scenario The scenario containing inputs
   * @returns The results
   */
  private async runInputs(scenario: any): Promise<any> {
    // TODO: Implement actual prompt template execution
    // This is a placeholder that returns mock results
    return {
      content: `Mock result for ${scenario.name}`,
      metadata: {
        timestamp: new Date().toISOString(),
        scenario: scenario.name
      }
    };
  }

  /**
   * Saves scenario results
   * @param scenarioName Name of the scenario
   * @param data The data to save
   */
  private async saveResults(scenarioName: string, data: any): Promise<void> {
    const filePath = path.join(this.resultsDir, `${scenarioName}.json`);
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  /**
   * Generates a final report of all simulation results
   */
  private async generateReport(): Promise<void> {
    try {
      const results = await this.loadAllResults();
      const report = this.aggregateResults(results);

      const reportPath = path.join(this.reportsDir, 'simulation-report.json');
      await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));

      this.logger.info('Generated simulation report');
    } catch (error) {
      this.logger.error('Failed to generate report', error);
      throw error;
    }
  }

  /**
   * Loads all scenario results
   * @returns Array of results
   */
  private async loadAllResults(): Promise<Array<{
    scenario: { name: string };
    results: any;
    scoring: {
      overallScore: number;
      scores: Record<string, number>;
      flags: string[];
    };
  }>> {
    const files = await fs.promises.readdir(this.resultsDir);
    const results: Array<{
      scenario: { name: string };
      results: any;
      scoring: {
        overallScore: number;
        scores: Record<string, number>;
        flags: string[];
      };
    }> = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.promises.readFile(
          path.join(this.resultsDir, file),
          'utf-8'
        );
        results.push(JSON.parse(content));
      }
    }

    return results;
  }

  /**
   * Aggregates results into a report
   * @param results Array of results to aggregate
   * @returns Aggregated report
   */
  private aggregateResults(results: any[]): any {
    const report = {
      timestamp: new Date().toISOString(),
      totalScenarios: results.length,
      averageScores: {
        overall: 0,
        clarity: 0,
        coaching: 0,
        memory_fidelity: 0
      },
      flags: [] as string[],
      scenarios: results.map(r => ({
        name: r.scenario.name,
        scores: r.scoring.scores,
        flags: r.scoring.flags
      }))
    };

    // Calculate averages
    const scoreSums = {
      overall: 0,
      clarity: 0,
      coaching: 0,
      memory_fidelity: 0
    };

    results.forEach(r => {
      scoreSums.overall += r.scoring.overallScore;
      Object.entries(r.scoring.scores).forEach(([key, value]) => {
        scoreSums[key as keyof typeof scoreSums] += value as number;
      });
      r.scoring.flags.forEach((flag: string) => {
        if (!report.flags.includes(flag)) {
          report.flags.push(flag);
        }
      });
    });

    Object.keys(report.averageScores).forEach(key => {
      report.averageScores[key as keyof typeof report.averageScores] =
        scoreSums[key as keyof typeof scoreSums] / results.length;
    });

    return report;
  }

  /**
   * Loads scenarios from a file
   * @param scenariosPath Path to scenarios file
   * @returns Array of scenarios
   */
  private loadScenarios(scenariosPath: string): any[] {
    const content = fs.readFileSync(scenariosPath, 'utf-8');
    return JSON.parse(content);
  }
} 