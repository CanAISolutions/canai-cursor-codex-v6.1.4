/**
 * prompt-infrastructure/prompt-loader.ts
 * 
 * Purpose:
 * Loads and validates prompt schema files with safety checks and event emission.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { EventBus } from '../utils/event-bus';
import {
  PromptDefinition,
  PromptLoader,
  PromptEvent,
  PromptEventType,
  PromptContractViolation
} from './prompt-schema';

export class PromptFileLoader implements PromptLoader {
  public eventBus: EventBus;
  private loadedPrompts: Map<string, PromptDefinition>;
  private validationCache: Map<string, boolean>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.loadedPrompts = new Map();
    this.validationCache = new Map();
  }

  /**
   * Loads a prompt definition from a file path
   */
  async loadPrompt(filePath: string): Promise<PromptDefinition> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const prompt = JSON.parse(content) as PromptDefinition;

      // Validate the prompt structure
      if (!this.validatePromptStructure(prompt)) {
        throw new Error(`Invalid prompt structure in ${filePath}`);
      }

      // Validate contracts and constraints
      const violations = await this.validatePromptContracts(prompt);
      if (violations.length > 0) {
        this.emitViolations(prompt.id, violations);
        throw new Error(`Contract violations found in ${filePath}`);
      }

      // Cache the loaded prompt
      this.loadedPrompts.set(prompt.id, prompt);
      this.validationCache.set(prompt.id, true);

      // Emit loaded event
      this.emitEvent('prompt:loaded', {
        promptId: prompt.id,
        version: prompt.version,
        details: { filePath }
      });

      return prompt;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.emitEvent('prompt:invalid', {
        promptId: path.basename(filePath),
        details: { error: errorMessage }
      });
      throw error;
    }
  }

  /**
   * Validates a prompt definition's structure and content
   */
  async validatePrompt(prompt: PromptDefinition): Promise<boolean> {
    try {
      // Check if already validated
      if (this.validationCache.has(prompt.id)) {
        return this.validationCache.get(prompt.id)!;
      }

      // Validate structure
      if (!this.validatePromptStructure(prompt)) {
        return false;
      }

      // Validate contracts
      const violations = await this.validatePromptContracts(prompt);
      if (violations.length > 0) {
        this.emitViolations(prompt.id, violations);
        return false;
      }

      // Cache validation result
      this.validationCache.set(prompt.id, true);
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.emitEvent('prompt:invalid', {
        promptId: prompt.id,
        details: { error: errorMessage }
      });
      return false;
    }
  }

  /**
   * Refreshes all loaded prompts
   */
  async refreshPrompts(): Promise<void> {
    const refreshPromises = Array.from(this.loadedPrompts.entries()).map(
      async ([id, prompt]) => {
        try {
          const isValid = await this.validatePrompt(prompt);
          if (!isValid) {
            this.loadedPrompts.delete(id);
            this.validationCache.delete(id);
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.emitEvent('prompt:invalid', {
            promptId: id,
            details: { error: errorMessage }
          });
        }
      }
    );

    await Promise.all(refreshPromises);
  }

  /**
   * Validates the basic structure of a prompt definition
   */
  private validatePromptStructure(prompt: PromptDefinition): boolean {
    const requiredFields = [
      'id',
      'type',
      'version',
      'status',
      'name',
      'description',
      'content',
      'metadata',
      'contracts',
      'constraints'
    ];

    // Check required fields
    for (const field of requiredFields) {
      if (!(field in prompt)) {
        this.emitEvent('prompt:invalid', {
          promptId: prompt.id,
          details: { error: `Missing required field: ${field}` }
        });
        return false;
      }
    }

    // Validate metadata structure
    const requiredMetadata = ['author', 'createdAt', 'updatedAt', 'tags'];
    for (const field of requiredMetadata) {
      if (!(field in prompt.metadata)) {
        this.emitEvent('prompt:invalid', {
          promptId: prompt.id,
          details: { error: `Missing required metadata field: ${field}` }
        });
        return false;
      }
    }

    return true;
  }

  /**
   * Validates all contracts defined in the prompt
   */
  private async validatePromptContracts(
    prompt: PromptDefinition
  ): Promise<PromptContractViolation[]> {
    const violations: PromptContractViolation[] = [];

    for (const contract of prompt.contracts) {
      try {
        const isValid = await this.validateContract(prompt, contract);
        if (!isValid) {
          violations.push({
            id: `${prompt.id}-${contract.type}-${Date.now()}`,
            promptId: prompt.id,
            version: prompt.version,
            timestamp: Date.now(),
            contract,
            context: {
              input: null,
              output: null,
              session: {}
            },
            severity: contract.required ? 'high' : 'low',
            action: this.mapFailureAction(contract.failureAction)
          });
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        violations.push({
          id: `${prompt.id}-${contract.type}-${Date.now()}`,
          promptId: prompt.id,
          version: prompt.version,
          timestamp: Date.now(),
          contract,
          context: {
            input: null,
            output: null,
            session: { error: errorMessage }
          },
          severity: 'critical',
          action: 'blocked'
        });
      }
    }

    return violations;
  }

  /**
   * Maps contract failure actions to violation actions
   */
  private mapFailureAction(action: 'warn' | 'error' | 'fallback'): 'warned' | 'failed' | 'fallback' | 'blocked' {
    switch (action) {
      case 'warn':
        return 'warned';
      case 'error':
        return 'failed';
      case 'fallback':
        return 'fallback';
      default:
        return 'blocked';
    }
  }

  /**
   * Validates a single contract using its defined validation method
   */
  private async validateContract(
    prompt: PromptDefinition,
    contract: any
  ): Promise<boolean> {
    switch (contract.validation.method) {
      case 'regex':
        return this.validateRegex(prompt, contract);
      case 'schema':
        return this.validateSchema(prompt, contract);
      case 'function':
        return this.validateFunction(prompt, contract);
      default:
        throw new Error(`Unknown validation method: ${contract.validation.method}`);
    }
  }

  /**
   * Validates using regex pattern
   */
  private validateRegex(prompt: PromptDefinition, contract: any): boolean {
    if (!contract.validation.pattern) {
      throw new Error('Regex pattern not provided');
    }
    const regex = new RegExp(contract.validation.pattern);
    return regex.test(prompt.content);
  }

  /**
   * Validates using JSON schema
   */
  private validateSchema(prompt: PromptDefinition, contract: any): boolean {
    if (!contract.validation.schema) {
      throw new Error('Schema not provided');
    }
    // TODO: Implement schema validation
    return true;
  }

  /**
   * Validates using custom function
   */
  private validateFunction(prompt: PromptDefinition, contract: any): boolean {
    if (!contract.validation.function) {
      throw new Error('Validation function not provided');
    }
    // TODO: Implement function validation
    return true;
  }

  /**
   * Emits a prompt event
   */
  private emitEvent(type: PromptEventType, data: any): void {
    const event: PromptEvent = {
      type,
      timestamp: Date.now(),
      data
    };
    this.eventBus.emit(`prompt.${type}`, event);
  }

  /**
   * Emits contract violations
   */
  private emitViolations(
    promptId: string,
    violations: PromptContractViolation[]
  ): void {
    this.emitEvent('prompt:violation', {
      promptId,
      details: { violations }
    });
  }
} 