/**
 * prompt-infrastructure/prompt-evolver.ts
 * 
 * Purpose:
 * Handles prompt evolution with safety checks, version tracking, and trust impact analysis.
 */

import { EventBus } from '../utils/event-bus';
import {
  PromptDefinition,
  PromptEvolver,
  PromptEvent,
  PromptEventType,
  PromptDelta
} from './prompt-schema';

export class PromptEvolutionManager implements PromptEvolver {
  public eventBus: EventBus;
  private evolutionHistory: Map<string, PromptDelta[]>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.evolutionHistory = new Map();
  }

  /**
   * Evolves a prompt based on context and feedback
   */
  async evolvePrompt(
    prompt: PromptDefinition,
    context: {
      feedback?: any;
      metrics?: any;
      triggers?: any;
    }
  ): Promise<PromptDefinition> {
    try {
      // Generate evolution delta
      const delta = await this.generateDelta(prompt, context);

      // Create evolved prompt
      const evolvedPrompt = this.applyDelta(prompt, delta);

      // Validate evolution
      const isValid = await this.validateEvolution(prompt, evolvedPrompt);
      if (!isValid) {
        throw new Error('Evolution validation failed');
      }

      // Track evolution
      this.trackEvolution(prompt.id, delta);

      // Emit evolution event
      this.emitEvent('prompt:evolved', {
        promptId: prompt.id,
        version: evolvedPrompt.version,
        details: { delta }
      });

      return evolvedPrompt;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.emitEvent('prompt:invalid', {
        promptId: prompt.id,
        details: { error: errorMessage }
      });
      throw error;
    }
  }

  /**
   * Validates that an evolution maintains safety and alignment
   */
  async validateEvolution(
    original: PromptDefinition,
    evolved: PromptDefinition
  ): Promise<boolean> {
    try {
      // Check version increment
      if (!this.isValidVersionIncrement(original.version, evolved.version)) {
        return false;
      }

      // Validate contracts are maintained
      if (!this.validateContractPreservation(original, evolved)) {
        return false;
      }

      // Check trust impact
      if (!this.validateTrustImpact(original, evolved)) {
        return false;
      }

      // Validate constraints
      if (!this.validateConstraints(original, evolved)) {
        return false;
      }

      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.emitEvent('prompt:invalid', {
        promptId: original.id,
        details: { error: errorMessage }
      });
      return false;
    }
  }

  /**
   * Generates an evolution delta based on context
   */
  private async generateDelta(
    prompt: PromptDefinition,
    context: {
      feedback?: any;
      metrics?: any;
      triggers?: any;
    }
  ): Promise<PromptDelta> {
    const changes = [];

    // Analyze feedback for content improvements
    if (context.feedback) {
      const contentChanges = this.analyzeFeedback(prompt, context.feedback);
      changes.push(...contentChanges);
    }

    // Apply performance optimizations
    if (context.metrics) {
      const optimizationChanges = this.optimizePerformance(prompt, context.metrics);
      changes.push(...optimizationChanges);
    }

    // Apply system evolution triggers
    if (context.triggers) {
      const triggerChanges = this.applyEvolutionTriggers(prompt, context.triggers);
      changes.push(...triggerChanges);
    }

    return {
      id: `${prompt.id}-delta-${Date.now()}`,
      promptId: prompt.id,
      fromVersion: prompt.version,
      toVersion: this.incrementVersion(prompt.version),
      timestamp: Date.now(),
      changes,
      metadata: {
        author: 'system',
        reason: this.generateEvolutionReason(changes),
        trustImpact: this.calculateTrustImpact(changes),
        performanceImpact: this.calculatePerformanceImpact(changes),
        alignmentImpact: this.calculateAlignmentImpact(changes)
      }
    };
  }

  /**
   * Applies a delta to create an evolved prompt
   */
  private applyDelta(prompt: PromptDefinition, delta: PromptDelta): PromptDefinition {
    const evolved = { ...prompt };

    // Apply each change
    for (const change of delta.changes) {
      if (change.field.includes('.')) {
        // Handle nested fields
        const [parent, child] = change.field.split('.');
        switch (parent) {
          case 'metadata':
            evolved.metadata = {
              ...evolved.metadata,
              [child]: change.newValue
            };
            break;
          case 'evolution':
            evolved.evolution = {
              ...evolved.evolution,
              [child]: change.newValue
            };
            break;
          default:
            // Skip unknown nested fields
            continue;
        }
      } else {
        // Handle top-level fields
        switch (change.field) {
          case 'version':
            evolved.version = change.newValue;
            break;
          case 'status':
            evolved.status = change.newValue;
            break;
          case 'name':
            evolved.name = change.newValue;
            break;
          case 'description':
            evolved.description = change.newValue;
            break;
          case 'content':
            evolved.content = change.newValue;
            break;
          case 'contracts':
            evolved.contracts = change.newValue;
            break;
          case 'constraints':
            evolved.constraints = change.newValue;
            break;
          default:
            // Skip unknown fields
            continue;
        }
      }
    }

    // Update version and evolution info
    evolved.version = delta.toVersion;
    evolved.metadata.updatedAt = Date.now();
    evolved.evolution = {
      parentVersion: delta.fromVersion,
      delta,
      reason: delta.metadata.reason
    };

    return evolved;
  }

  /**
   * Tracks evolution history
   */
  private trackEvolution(promptId: string, delta: PromptDelta): void {
    if (!this.evolutionHistory.has(promptId)) {
      this.evolutionHistory.set(promptId, []);
    }
    this.evolutionHistory.get(promptId)!.push(delta);
  }

  /**
   * Validates version increment
   */
  private isValidVersionIncrement(from: string, to: string): boolean {
    const [fromMajor, fromMinor, fromPatch] = from.split('.').map(Number);
    const [toMajor, toMinor, toPatch] = to.split('.').map(Number);

    // Major version can only be incremented manually
    if (toMajor !== fromMajor) {
      return false;
    }

    // Minor version can be incremented for significant changes
    if (toMinor > fromMinor) {
      return true;
    }

    // Patch version can be incremented for minor changes
    if (toMinor === fromMinor && toPatch > fromPatch) {
      return true;
    }

    return false;
  }

  /**
   * Validates contract preservation
   */
  private validateContractPreservation(
    original: PromptDefinition,
    evolved: PromptDefinition
  ): boolean {
    // Check that all required contracts are maintained
    for (const contract of original.contracts) {
      if (contract.required) {
        const evolvedContract = evolved.contracts.find(
          c => c.type === contract.type
        );
        if (!evolvedContract) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Validates trust impact
   */
  private validateTrustImpact(
    original: PromptDefinition,
    evolved: PromptDefinition
  ): boolean {
    // Get the latest delta
    const latestDelta = this.evolutionHistory.get(original.id)?.slice(-1)[0];
    if (!latestDelta) {
      return true;
    }

    // Check trust impact threshold
    return latestDelta.metadata.trustImpact >= 0.8;
  }

  /**
   * Validates constraints
   */
  private validateConstraints(
    original: PromptDefinition,
    evolved: PromptDefinition
  ): boolean {
    for (const constraint of original.constraints) {
      const originalValue = this.getNestedValue(original, constraint.field);
      const evolvedValue = this.getNestedValue(evolved, constraint.field);

      switch (constraint.operator) {
        case 'equals':
          if (evolvedValue !== constraint.value) return false;
          break;
        case 'contains':
          if (!evolvedValue.includes(constraint.value)) return false;
          break;
        case 'matches':
          if (!new RegExp(constraint.value).test(evolvedValue)) return false;
          break;
        case 'greaterThan':
          if (evolvedValue <= constraint.value) return false;
          break;
        case 'lessThan':
          if (evolvedValue >= constraint.value) return false;
          break;
      }
    }

    return true;
  }

  /**
   * Gets a nested value from an object
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  /**
   * Increments a semantic version
   */
  private incrementVersion(version: string): string {
    const [major, minor, patch] = version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  /**
   * Analyzes feedback for content improvements
   */
  private analyzeFeedback(prompt: PromptDefinition, feedback: any): any[] {
    // TODO: Implement feedback analysis
    return [];
  }

  /**
   * Optimizes performance based on metrics
   */
  private optimizePerformance(prompt: PromptDefinition, metrics: any): any[] {
    // TODO: Implement performance optimization
    return [];
  }

  /**
   * Applies system evolution triggers
   */
  private applyEvolutionTriggers(prompt: PromptDefinition, triggers: any): any[] {
    // TODO: Implement trigger application
    return [];
  }

  /**
   * Generates evolution reason
   */
  private generateEvolutionReason(changes: any[]): string {
    // TODO: Implement reason generation
    return 'System evolution';
  }

  /**
   * Calculates trust impact
   */
  private calculateTrustImpact(changes: any[]): number {
    // TODO: Implement trust impact calculation
    return 1.0;
  }

  /**
   * Calculates performance impact
   */
  private calculatePerformanceImpact(changes: any[]): number {
    // TODO: Implement performance impact calculation
    return 1.0;
  }

  /**
   * Calculates alignment impact
   */
  private calculateAlignmentImpact(changes: any[]): number {
    // TODO: Implement alignment impact calculation
    return 1.0;
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
} 