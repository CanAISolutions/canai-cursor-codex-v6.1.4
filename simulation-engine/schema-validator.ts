import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { EventBus } from '../event-bus/eventBus';
import { Logger } from '../utils/logger';

/**
 * SchemaValidator - Validates simulation scenarios against actual prompt schemas
 * Ensures all scenarios align with real CanAI prompt structures and requirements
 */
export class SchemaValidator {
  private readonly logger: Logger;
  private readonly eventBus: EventBus;
  private readonly promptSchemas: Map<string, any>;
  private readonly alignmentErrors: Map<string, string[]>;

  constructor() {
    this.logger = new Logger('SchemaValidator');
    this.eventBus = EventBus.getInstance();
    this.promptSchemas = new Map();
    this.alignmentErrors = new Map();
  }

  /**
   * Discovers and loads all prompt schemas from gpt-templates and prompts directories
   */
  public async discoverSchemas(): Promise<void> {
    try {
      // Load schemas from gpt-templates
      const templateDir = join(process.cwd(), 'gpt-templates');
      const templateFiles = readdirSync(templateDir)
        .filter(file => file.endsWith('.json'));

      for (const file of templateFiles) {
        const schema = JSON.parse(readFileSync(join(templateDir, file), 'utf-8'));
        this.promptSchemas.set(file.replace('.json', ''), schema);
      }

      // Load schemas from prompts
      const promptsDir = join(process.cwd(), 'prompts');
      const promptFiles = readdirSync(promptsDir)
        .filter(file => file.endsWith('.mcp.ts'));

      for (const file of promptFiles) {
        const content = readFileSync(join(promptsDir, file), 'utf-8');
        const schema = this.extractSchemaFromMCP(content);
        if (schema) {
          this.promptSchemas.set(file.replace('.mcp.ts', ''), schema);
        }
      }

      this.logger.info(`Discovered ${this.promptSchemas.size} prompt schemas`);
      this.eventBus.emit('schemas.discovered', { count: this.promptSchemas.size });
    } catch (error) {
      this.logger.error('Failed to discover schemas', error);
      throw error;
    }
  }

  /**
   * Validates a scenario against its corresponding prompt schema
   * @param scenario The scenario to validate
   * @returns Validation result with alignment score and errors
   */
  public validateScenario(scenario: any): {
    alignmentScore: number;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    let alignmentScore = 1.0;

    try {
      const schema = this.promptSchemas.get(scenario.promptType);
      if (!schema) {
        errors.push(`No schema found for prompt type: ${scenario.promptType}`);
        return { alignmentScore: 0, errors, warnings };
      }

      // Validate required fields
      for (const [field, rules] of Object.entries(schema.required || {})) {
        if (!scenario.weak_input[field] && !scenario.strong_input[field]) {
          errors.push(`Missing required field: ${field}`);
          alignmentScore -= 0.1;
        }
      }

      // Validate field types
      for (const [field, type] of Object.entries(schema.types || {})) {
        const weakValue = scenario.weak_input[field];
        const strongValue = scenario.strong_input[field];

        if (weakValue && typeof weakValue !== type) {
          warnings.push(`Weak input field ${field} has incorrect type: expected ${type}`);
          alignmentScore -= 0.05;
        }

        if (strongValue && typeof strongValue !== type) {
          warnings.push(`Strong input field ${field} has incorrect type: expected ${type}`);
          alignmentScore -= 0.05;
        }
      }

      // Validate field constraints
      for (const [field, constraints] of Object.entries(schema.constraints || {})) {
        const weakValue = scenario.weak_input[field];
        const strongValue = scenario.strong_input[field];

        if (weakValue && !this.validateConstraints(weakValue, constraints)) {
          warnings.push(`Weak input field ${field} violates constraints`);
          alignmentScore -= 0.05;
        }

        if (strongValue && !this.validateConstraints(strongValue, constraints)) {
          warnings.push(`Strong input field ${field} violates constraints`);
          alignmentScore -= 0.05;
        }
      }

      // Store errors for logging
      if (errors.length > 0 || warnings.length > 0) {
        this.alignmentErrors.set(scenario.id, [...errors, ...warnings]);
      }

      return {
        alignmentScore: Math.max(0, alignmentScore),
        errors,
        warnings
      };
    } catch (error) {
      this.logger.error(`Failed to validate scenario ${scenario.id}`, error);
      throw error;
    }
  }

  /**
   * Extracts schema from MCP file content
   * @param content MCP file content
   * @returns Extracted schema or null if not found
   */
  private extractSchemaFromMCP(content: string): any | null {
    try {
      // Extract schema from MCP file using regex
      const schemaMatch = content.match(/schema:\s*({[\s\S]*?})/);
      if (schemaMatch) {
        return JSON.parse(schemaMatch[1]);
      }
      return null;
    } catch (error) {
      this.logger.error('Failed to extract schema from MCP', error);
      return null;
    }
  }

  /**
   * Validates a value against schema constraints
   * @param value Value to validate
   * @param constraints Schema constraints
   * @returns Whether value passes constraints
   */
  private validateConstraints(value: any, constraints: any): boolean {
    if (constraints.minLength && value.length < constraints.minLength) return false;
    if (constraints.maxLength && value.length > constraints.maxLength) return false;
    if (constraints.pattern && !new RegExp(constraints.pattern).test(value)) return false;
    if (constraints.enum && !constraints.enum.includes(value)) return false;
    return true;
  }

  /**
   * Logs all alignment errors to file
   */
  public async logAlignmentErrors(): Promise<void> {
    try {
      const logPath = join(process.cwd(), 'simulation-engine', 'schema-align-errors.log');
      const logContent = Array.from(this.alignmentErrors.entries())
        .map(([scenarioId, errors]) => `Scenario ${scenarioId}:\n${errors.join('\n')}\n`)
        .join('\n');

      await this.logger.writeToFile(logPath, logContent);
      this.eventBus.emit('schema.errors.logged', { count: this.alignmentErrors.size });
    } catch (error) {
      this.logger.error('Failed to log alignment errors', error);
      throw error;
    }
  }
} 