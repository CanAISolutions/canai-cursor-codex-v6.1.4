import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { EventBus } from '../event-bus/eventBus';
import { Logger } from '../utils/logger';
import { SchemaValidator } from './schema-validator';
import { PromptRegistry } from '../prompts/promptTypeRouter';
import { EmotionalValidator } from '../cursor/validators/emotional-validator';
import { TrustScore } from '../cursor/validators/trust-score';

/**
 * SimulationRunner - Orchestrates the execution of business scenarios
 * Handles prompt injection, enhancer application, and result logging
 */
export class SimulationRunner {
  private readonly logger: Logger;
  private readonly eventBus: EventBus;
  private readonly schemaValidator: SchemaValidator;
  private readonly promptRegistry: PromptRegistry;
  private readonly emotionalValidator: EmotionalValidator;
  private readonly trustScore: TrustScore;

  constructor() {
    this.logger = new Logger('SimulationRunner');
    this.eventBus = EventBus.getInstance();
    this.schemaValidator = new SchemaValidator();
    this.promptRegistry = new PromptRegistry();
    this.emotionalValidator = new EmotionalValidator();
    this.trustScore = new TrustScore();
  }

  /**
   * Initializes the simulation environment
   */
  public async initialize(): Promise<void> {
    try {
      // Create results and reports directories
      mkdirSync(join(process.cwd(), 'simulation-engine', 'results'), { recursive: true });
      mkdirSync(join(process.cwd(), 'simulation-engine', 'reports'), { recursive: true });

      // Discover schemas
      await this.schemaValidator.discoverSchemas();

      this.logger.info('Simulation environment initialized');
      this.eventBus.emit('simulation.initialized');
    } catch (error) {
      this.logger.error('Failed to initialize simulation environment', error);
      throw error;
    }
  }

  /**
   * Runs all scenarios from scenarios.json
   */
  public async runAllScenarios(): Promise<void> {
    try {
      const scenariosPath = join(process.cwd(), 'simulation-engine', 'scenarios.json');
      const scenarios = JSON.parse(readFileSync(scenariosPath, 'utf-8'));

      for (const scenario of scenarios) {
        await this.runScenario(scenario);
      }

      this.logger.info(`Completed ${scenarios.length} scenarios`);
      this.eventBus.emit('simulation.completed', { count: scenarios.length });
    } catch (error) {
      this.logger.error('Failed to run scenarios', error);
      throw error;
    }
  }

  /**
   * Runs a single scenario
   * @param scenario The scenario to run
   */
  private async runScenario(scenario: any): Promise<void> {
    try {
      this.logger.info(`Running scenario: ${scenario.id}`);

      // Validate schema alignment
      const validation = this.schemaValidator.validateScenario(scenario);
      if (validation.alignmentScore < 0.8) {
        this.logger.warn(`Scenario ${scenario.id} has low schema alignment: ${validation.alignmentScore}`);
      }

      // Get prompt template
      const promptTemplate = await this.promptRegistry.getPromptTemplate(scenario.promptType);
      if (!promptTemplate) {
        throw new Error(`No prompt template found for type: ${scenario.promptType}`);
      }

      // Run weak input
      const weakResult = await this.runInput(scenario, promptTemplate, 'weak');
      
      // Run strong input
      const strongResult = await this.runInput(scenario, promptTemplate, 'strong');

      // Calculate metrics
      const metrics = await this.calculateMetrics(scenario, weakResult, strongResult);

      // Save results
      await this.saveResults(scenario.id, {
        scenario,
        weakResult,
        strongResult,
        metrics,
        validation
      });

      this.logger.info(`Completed scenario: ${scenario.id}`);
      this.eventBus.emit('scenario.completed', { id: scenario.id, metrics });
    } catch (error) {
      this.logger.error(`Failed to run scenario ${scenario.id}`, error);
      this.eventBus.emit('scenario.failed', { id: scenario.id, error });
      throw error;
    }
  }

  /**
   * Runs a single input through the prompt template
   * @param scenario The scenario being run
   * @param promptTemplate The prompt template to use
   * @param inputType The type of input (weak/strong)
   */
  private async runInput(
    scenario: any,
    promptTemplate: any,
    inputType: 'weak' | 'strong'
  ): Promise<any> {
    try {
      const input = scenario[`${inputType}_input`];
      
      // Inject enhancers
      const enhancedInput = await this.injectEnhancers(input, scenario.enhancers);

      // Run prompt
      const result = await promptTemplate.run(enhancedInput);

      // Validate emotional resonance
      const emotionalScore = await this.emotionalValidator.validate(result);
      if (emotionalScore < 4.2) {
        this.logger.warn(`Low emotional score for ${inputType} input: ${emotionalScore}`);
      }

      return {
        input: enhancedInput,
        result,
        emotionalScore
      };
    } catch (error) {
      this.logger.error(`Failed to run ${inputType} input`, error);
      throw error;
    }
  }

  /**
   * Injects enhancers into the input
   * @param input The input to enhance
   * @param enhancers The enhancers to apply
   */
  private async injectEnhancers(input: any, enhancers: any[]): Promise<any> {
    let enhanced = { ...input };

    for (const enhancer of enhancers || []) {
      try {
        enhanced = await enhancer.apply(enhanced);
      } catch (error) {
        this.logger.warn(`Failed to apply enhancer: ${enhancer.name}`, error);
      }
    }

    return enhanced;
  }

  /**
   * Calculates metrics for the scenario results
   * @param scenario The scenario
   * @param weakResult The weak input result
   * @param strongResult The strong input result
   */
  private async calculateMetrics(
    scenario: any,
    weakResult: any,
    strongResult: any
  ): Promise<any> {
    try {
      // Calculate trust scores
      const weakTrust = await this.trustScore.calculate(weakResult.result);
      const strongTrust = await this.trustScore.calculate(strongResult.result);

      // Calculate input uplift
      const inputUplift = this.calculateInputUplift(weakResult, strongResult);

      return {
        weakTrust,
        strongTrust,
        inputUplift,
        emotionalResonance: {
          weak: weakResult.emotionalScore,
          strong: strongResult.emotionalScore
        }
      };
    } catch (error) {
      this.logger.error('Failed to calculate metrics', error);
      throw error;
    }
  }

  /**
   * Calculates the input uplift between weak and strong results
   * @param weakResult The weak input result
   * @param strongResult The strong input result
   */
  private calculateInputUplift(weakResult: any, strongResult: any): number {
    // Implement uplift calculation logic
    // This is a placeholder - implement actual uplift calculation
    return 0.75;
  }

  /**
   * Saves scenario results and reports
   * @param scenarioId The scenario ID
   * @param data The data to save
   */
  private async saveResults(scenarioId: string, data: any): Promise<void> {
    try {
      // Save results
      const resultsPath = join(process.cwd(), 'simulation-engine', 'results', `${scenarioId}.json`);
      writeFileSync(resultsPath, JSON.stringify(data, null, 2));

      // Save UX report
      const uxReport = await this.generateUXReport(data);
      const reportPath = join(process.cwd(), 'simulation-engine', 'reports', `${scenarioId}-ux.json`);
      writeFileSync(reportPath, JSON.stringify(uxReport, null, 2));

      this.logger.info(`Saved results for scenario: ${scenarioId}`);
    } catch (error) {
      this.logger.error(`Failed to save results for scenario ${scenarioId}`, error);
      throw error;
    }
  }

  /**
   * Generates a UX report for the scenario results
   * @param data The scenario data
   */
  private async generateUXReport(data: any): Promise<any> {
    // Implement UX report generation
    // This is a placeholder - implement actual UX report generation
    return {
      readability: {
        weak: 0.85,
        strong: 0.92
      },
      toneMatch: {
        weak: 0.78,
        strong: 0.91
      },
      structure: {
        weak: 0.82,
        strong: 0.95
      }
    };
  }
} 