/**
 * memory-integration/memory-injector.ts
 * 
 * Purpose:
 * Handles safe injection of memory into prompts.
 * Validates injection safety and calculates influence.
 */

import { EventBus } from '../event-bus/eventBus';
import { CodexRuleEngine } from '../rules/rule-engine';
import { CodexPromptRegistry } from '../prompt-registry/prompt-registry';
import { MemoryFilter } from './memory-filter';
import { MemoryHierarchyManager } from '../ai-memories/memory-hierarchy-manager';
import {
  MemoryInjectionRequest,
  MemoryInjectionResult,
  MemoryInjectionConfig,
  MemoryInfluenceScore,
  InjectionRejectionReason
} from './memory-integration-schema';
import { Rule } from '../rules/rules-schema';
import { v4 as uuidv4 } from 'uuid';
import { Memory, MemoryType } from '../ai-memories/memory-types';
import { MemoryRecord, MemoryMetadata } from '../ai-memories/memory-schema';

export class MemoryInjector {
  constructor(
    private eventBus: EventBus,
    private ruleEngine: CodexRuleEngine,
    private promptRegistry: CodexPromptRegistry,
    private memoryFilter: MemoryFilter,
    private memoryHierarchy: MemoryHierarchyManager,
    private config: MemoryInjectionConfig
  ) {}

  /**
   * Injects memory into a prompt
   */
  async injectMemory(request: MemoryInjectionRequest): Promise<MemoryInjectionResult> {
    try {
      // Validate prompt version
      if (!request.promptVersion) {
        return this.createRejectionResult(request, {
          code: 'VERSION_MISMATCH',
          message: 'Prompt version is required'
        });
      }

      // Get target prompt and verify version
      const prompt = await this.promptRegistry.get(
        request.promptId,
        request.promptVersion
      );

      if (!prompt) {
        return this.createRejectionResult(request, {
          code: 'VERSION_MISMATCH',
          message: 'Prompt not found or version mismatch'
        });
      }

      // Retrieve memories from hierarchy
      const memories = await this.retrieveMemories(request);
      if (memories.length === 0) {
        return this.createRejectionResult(request, {
          code: 'MEMORY_NOT_FOUND',
          message: 'No relevant memories found'
        });
      }

      // Convert Memory to MemoryRecord for filtering
      const memoryRecords: MemoryRecord[] = memories.map(memory => ({
        id: memory.id,
        type: memory.type,
        content: memory.content,
        metadata: {
          trustScore: memory.metadata.confidence,
          alignmentScore: memory.metadata.importance,
          volatilityScore: 1 - memory.metadata.importance,
          timestamp: memory.timestamp,
          tags: memory.metadata.tags,
          source: memory.metadata.source,
          confidence: memory.metadata.confidence,
          context: memory.metadata.context
        },
        createdAt: memory.timestamp,
        updatedAt: memory.lastAccessed,
        influence: {
          trust: memory.metadata.confidence,
          alignment: memory.metadata.importance,
          volatility: 1 - memory.metadata.importance
        }
      }));

      // Filter memory records
      const filteredRecords = await this.memoryFilter.filterRecords(
        memoryRecords,
        request.memoryType
      );

      if (filteredRecords.length === 0) {
        return this.createRejectionResult(request, {
          code: 'MEMORY_FILTERED',
          message: 'No valid memory records after filtering'
        });
      }

      // Validate injection safety
      const validationResult = await this.validateInjection(prompt, filteredRecords);
      if (!validationResult.valid) {
        return this.createRejectionResult(request, {
          code: 'RULE_VIOLATION',
          message: validationResult.reason || 'Failed validation'
        });
      }

      // Calculate influence
      const influence = await this.calculateInfluence(prompt, filteredRecords);

      // Check influence thresholds
      if (!this.meetsInfluenceThresholds(influence)) {
        return this.createRejectionResult(request, {
          code: 'TRUST_THRESHOLD',
          message: 'Influence below required thresholds'
        });
      }

      // Create injection result
      const result: MemoryInjectionResult = {
        success: true,
        promptId: request.promptId,
        promptVersion: prompt.prompt.version,
        injectedMemory: {
          type: request.memoryType,
          records: filteredRecords,
          influence
        },
        metadata: {
          timestamp: Date.now(),
          trustImpact: influence.trust,
          alignmentImpact: influence.alignment,
          volatilityImpact: influence.volatility
        }
      };

      // Emit events
      this.emitInjectionEvents(result);

      return result;
    } catch (error) {
      return this.createRejectionResult(request, {
        code: 'RULE_VIOLATION',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Retrieves memories from the hierarchy based on request context
   */
  private async retrieveMemories(request: MemoryInjectionRequest): Promise<Memory[]> {
    const memories: Memory[] = [];
    
    try {
      // First try to retrieve by ID if session exists
      if (request.sessionId) {
        const sessionMemory = await this.memoryHierarchy.recall(request.sessionId);
        if (sessionMemory) {
          memories.push(sessionMemory);
        }
      }

      // Then get related memories based on context
      if (request.contextGoal && memories.length > 0) {
        const contextMemories = await Promise.all(
          memories.map((m: Memory) => this.memoryHierarchy.recall(m.id))
        );
        memories.push(...contextMemories.filter((m): m is Memory => m !== null));
      }

      // Finally get any topic-related memories
      if (request.topic && memories.length < this.config.filterConfig.maxRecordsPerInjection) {
        const remainingSlots = this.config.filterConfig.maxRecordsPerInjection - memories.length;
        const topicMemories = await Promise.all(
          memories
            .slice(0, remainingSlots)
            .map((m: Memory) => this.memoryHierarchy.recall(m.id))
        );
        memories.push(...topicMemories.filter((m): m is Memory => m !== null));
      }

      // Deduplicate memories
      const uniqueMemories = new Map<string, Memory>();
      memories.forEach(m => uniqueMemories.set(m.id, m));

      return Array.from(uniqueMemories.values());
    } catch (error) {
      this.eventBus.emit('memory.retrieval.error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        request: {
          sessionId: request.sessionId,
          contextGoal: request.contextGoal,
          topic: request.topic
        }
      });
      return [];
    }
  }

  /**
   * Validates injection safety
   */
  private async validateInjection(
    prompt: any,
    records: any[]
  ): Promise<{ valid: boolean; reason?: string }> {
    // Create validation rules from required fields
    const rules: Rule[] = this.config.filterConfig.requiredFields.map(field => ({
      id: uuidv4(),
      type: 'structure',
      name: `Required field: ${field}`,
      description: `Validates presence of required field: ${field}`,
      severity: 'high',
      recoveryAction: 'block',
      validation: {
        method: 'schema',
        schema: {
          type: 'object',
          required: [field]
        }
      },
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: '1.0.0',
        tags: ['memory', 'validation'],
        dependencies: []
      }
    }));

    // Validate against rule engine
    const violations = await this.ruleEngine.evaluateRules(rules, { prompt, records });

    if (violations.length > 0) {
      return {
        valid: false,
        reason: violations.map(v => v.context.value).join(', ')
      };
    }

    return { valid: true };
  }

  /**
   * Calculates memory influence on prompt
   */
  private async calculateInfluence(
    prompt: any,
    records: any[]
  ): Promise<MemoryInfluenceScore> {
    // Calculate trust impact
    const trustImpact = this.calculateTrustImpact(prompt, records);

    // Calculate alignment impact
    const alignmentImpact = this.calculateAlignmentImpact(prompt, records);

    // Calculate volatility impact
    const volatilityImpact = this.calculateVolatilityImpact(prompt, records);

    // Calculate relevance
    const relevance = this.calculateRelevance(prompt, records);

    // Calculate confidence
    const confidence = this.calculateConfidence(
      trustImpact,
      alignmentImpact,
      volatilityImpact,
      relevance
    );

    return {
      trust: trustImpact,
      alignment: alignmentImpact,
      volatility: volatilityImpact,
      relevance,
      confidence
    };
  }

  /**
   * Calculates trust impact
   */
  private calculateTrustImpact(prompt: any, records: any[]): number {
    const recordTrust = records.reduce((sum, r) => sum + r.metadata.trustScore, 0) / records.length;
    return Math.min(recordTrust, prompt.metadata.trustScore);
  }

  /**
   * Calculates alignment impact
   */
  private calculateAlignmentImpact(prompt: any, records: any[]): number {
    const recordAlignment = records.reduce((sum, r) => sum + r.metadata.alignmentScore, 0) / records.length;
    return Math.min(recordAlignment, prompt.metadata.alignmentScore);
  }

  /**
   * Calculates volatility impact
   */
  private calculateVolatilityImpact(prompt: any, records: any[]): number {
    const recordVolatility = records.reduce((sum, r) => sum + r.metadata.volatilityScore, 0) / records.length;
    return Math.max(recordVolatility, prompt.metadata.volatilityScore);
  }

  /**
   * Calculates relevance score
   */
  private calculateRelevance(prompt: any, records: any[]): number {
    // Simple relevance calculation based on metadata overlap
    const promptTags = new Set(prompt.metadata.tags);
    const recordTags = new Set(records.flatMap(r => r.metadata.tags));
    
    const intersection = new Set([...promptTags].filter(t => recordTags.has(t)));
    return intersection.size / Math.max(promptTags.size, recordTags.size);
  }

  /**
   * Calculates confidence score
   */
  private calculateConfidence(
    trust: number,
    alignment: number,
    volatility: number,
    relevance: number
  ): number {
    return (trust + alignment + (1 - volatility) + relevance) / 4;
  }

  /**
   * Checks if influence meets thresholds
   */
  private meetsInfluenceThresholds(influence: MemoryInfluenceScore): boolean {
    return (
      influence.trust >= this.config.influenceThresholds.minTrust &&
      influence.alignment >= this.config.influenceThresholds.minAlignment &&
      influence.volatility <= this.config.influenceThresholds.maxVolatility
    );
  }

  /**
   * Creates rejection result
   */
  private createRejectionResult(
    request: MemoryInjectionRequest,
    reason: InjectionRejectionReason
  ): MemoryInjectionResult {
    const result: MemoryInjectionResult = {
      success: false,
      promptId: request.promptId,
      promptVersion: request.promptVersion,
      rejectionReason: reason,
      metadata: {
        timestamp: Date.now(),
        trustImpact: 0,
        alignmentImpact: 0,
        volatilityImpact: 0
      }
    };

    if (this.config.eventConfig.emitRejectionEvents) {
      this.eventBus.emit('memory.rejected', result);
    }

    return result;
  }

  /**
   * Emits injection events
   */
  private emitInjectionEvents(result: MemoryInjectionResult): void {
    if (this.config.eventConfig.emitInjectionEvents) {
      this.eventBus.emit('memory.injected', result);
    }
    if (this.config.eventConfig.emitInfluenceEvents && result.injectedMemory?.influence) {
      this.eventBus.emit('memory.influence.calculated', result.injectedMemory.influence);
    }
  }
} 