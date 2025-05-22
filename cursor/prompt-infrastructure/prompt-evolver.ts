/**
 * prompt-infrastructure/prompt-evolver.ts
 * 
 * Purpose:
 * Handles prompt evolution with safety checks, version tracking, and trust impact analysis.
 */

import { EventBus } from '../event-bus/eventBus';
import {
  PromptDefinition,
  PromptEvolver,
  PromptEvent,
  PromptEventType,
  PromptDelta,
  PromptContract,
  PromptConstraint
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

      // Validate evolution (pass context for feedback/metrics validation)
      const isValid = await this.validateEvolution(prompt, evolvedPrompt, context);
      if (!isValid) {
        this.emitEvent('prompt:invalid', {
          promptId: prompt.id,
          details: { error: 'Evolution validation failed' }
        });
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
    evolved: PromptDefinition,
    context?: {
      feedback?: any;
      metrics?: any;
      triggers?: any;
    }
  ): Promise<boolean> {
    try {
      // What: Validate feedback/metrics for minimum quality/performance
      // Why: Ensure prompt evolution only proceeds if feedback/metrics meet Codex trust thresholds
      // How: If context is provided, check quality/performance >= 0.5
      if (context) {
        if (context.feedback && typeof context.feedback.quality === 'number' && context.feedback.quality < 0.5) {
          return false;
        }
        if (context.metrics && typeof context.metrics.performance === 'number' && context.metrics.performance < 0.5) {
          return false;
        }
      }
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
    const changes: PromptDelta['changes'] = [];

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
    const evolved: PromptDefinition = { ...prompt };

    // Apply each change with explicit type validation/casting
    for (const change of delta.changes) {
      if (change.field.includes('.')) {
        // Handle nested fields
        const [parent, child] = change.field.split('.');
        switch (parent) {
          case 'metadata':
            if (Object.prototype.hasOwnProperty.call(evolved.metadata, child)) {
              (evolved.metadata as any)[child] = change.newValue;
            }
            break;
          case 'evolution':
            evolved.evolution = {
              ...evolved.evolution,
              [child]: change.newValue
            };
            break;
          default:
            continue;
        }
      } else {
        // Handle top-level fields with type guards
        switch (change.field) {
          case 'version':
            evolved.version = String(change.newValue);
            break;
          case 'status':
            evolved.status = change.newValue as PromptDefinition['status'];
            break;
          case 'name':
            evolved.name = String(change.newValue);
            break;
          case 'description':
            evolved.description = String(change.newValue);
            break;
          case 'content':
            evolved.content = String(change.newValue);
            break;
          case 'contracts':
            evolved.contracts = Array.isArray(change.newValue) ? change.newValue as PromptContract[] : evolved.contracts;
            break;
          case 'constraints':
            evolved.constraints = Array.isArray(change.newValue) ? change.newValue as PromptConstraint[] : evolved.constraints;
            break;
          default:
            continue;
        }
      }
    }

    // Update version and evolution info to match schema
    evolved.version = delta.toVersion;
    evolved.metadata.updatedAt = Date.now();
    evolved.evolution = {
      id: delta.id,
      version: delta.toVersion,
      timestamp: Date.now(),
      changes: delta.changes,
      metadata: delta.metadata
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
    // What: Ensure all contracts from the original are present and valid in the evolved prompt, per schema.
    // Why: Codex compliance and contract continuity, not just presence.
    // How: Compare by contract id/type and validate using contract.validation (e.g., regex).
    for (const contract of original.contracts) {
      const evolvedContract = evolved.contracts.find(
        c => c.id === contract.id && c.type === contract.type
      );
      if (!evolvedContract) {
        return false;
      }
      // Enforce contract logic (e.g., regex validation)
      if (contract.validation && contract.validation.regex) {
        const regex = new RegExp(contract.validation.regex);
        if (!regex.test(evolved.content)) {
          return false;
        }
      }
      // Add additional contract validation logic as needed (schema, function, etc.)
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
    // What: Validate constraints using only schema operators: 'lt', 'lte', 'eq', 'gte', 'gt'.
    // Why: Remove legacy operators and enforce schema alignment.
    // How: Use type guards and explicit checks.
    for (const constraint of original.constraints) {
      const evolvedValue = this.getNestedValue(evolved, constraint.type);
      switch (constraint.operator) {
        case 'lt':
          if (!(typeof evolvedValue === 'number' && evolvedValue < constraint.value)) return false;
          break;
        case 'lte':
          if (!(typeof evolvedValue === 'number' && evolvedValue <= constraint.value)) return false;
          break;
        case 'eq':
          if (evolvedValue !== constraint.value) return false;
          break;
        case 'gte':
          if (!(typeof evolvedValue === 'number' && evolvedValue >= constraint.value)) return false;
          break;
        case 'gt':
          if (!(typeof evolvedValue === 'number' && evolvedValue > constraint.value)) return false;
          break;
        default:
          // Skip non-schema operators
          continue;
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