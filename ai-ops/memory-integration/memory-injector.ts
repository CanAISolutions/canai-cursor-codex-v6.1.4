/**
 * Memory Injector
 * Handles the injection of user memory into prompts with validation and filtering
 */

import { EventEmitter } from 'events';
import { 
  MemoryInjectionRequest, 
  MemoryInjectionResult, 
  InjectionRejectionReason,
  MemoryInfluenceScore,
  MemoryFilterConfig
} from './memory-integration-schema';
import { MemoryType, MemoryPayload } from '../ai-memories/memory-types';
import { PromptVersion } from '../prompt-registry/prompt-registry-types';
import { TrustScore } from '../trust/trust-types';
import { MemoryHierarchyManager } from '../ai-memories/memory-hierarchy-manager';
import { MemoryFilter } from './memory-filter';

export class MemoryInjector extends EventEmitter {
  private memoryHierarchy: MemoryHierarchyManager;
  private memoryFilter: MemoryFilter;
  private readonly TRUST_THRESHOLD = 4.2;

  constructor() {
    super();
    this.memoryHierarchy = new MemoryHierarchyManager();
    this.memoryFilter = new MemoryFilter();
  }

  /**
   * Injects memory into a prompt based on the provided request
   * @param request The memory injection request
   * @returns Promise resolving to the injection result
   */
  public async injectMemory(request: MemoryInjectionRequest): Promise<MemoryInjectionResult> {
    try {
      // Validate trust score
      if (request.trustScore.score < this.TRUST_THRESHOLD) {
        return this.createRejectionResult(InjectionRejectionReason.TRUST_THRESHOLD_NOT_MET);
      }

      // Retrieve and filter memory
      const memory = await this.memoryHierarchy.retrieveMemory(
        request.memory.userId,
        request.memory.sessionId,
        request.memory.contextGoal
      );

      if (!memory) {
        return this.createRejectionResult(InjectionRejectionReason.MEMORY_FILTER_REJECTED);
      }

      // Apply memory filtering
      const filterConfig: MemoryFilterConfig = {
        minTrustScore: this.TRUST_THRESHOLD,
        sanitizeEmotionalContent: true
      };

      const filteredMemory = await this.memoryFilter.filterMemory(memory, filterConfig);
      if (!filteredMemory) {
        return this.createRejectionResult(InjectionRejectionReason.MEMORY_FILTER_REJECTED);
      }

      // Calculate influence score
      const influenceScore = this.calculateInfluenceScore(filteredMemory, request.targetPrompt);
      if (!influenceScore.isAcceptable) {
        return this.createRejectionResult(InjectionRejectionReason.RULE_VIOLATION);
      }

      // Inject memory into prompt
      const modifiedPrompt = this.injectMemoryIntoPrompt(request.targetPrompt, filteredMemory);

      // Emit success event
      this.emit('memoryInjected', {
        userId: request.memory.userId,
        sessionId: request.memory.sessionId,
        influenceScore,
        timestamp: Date.now()
      });

      return {
        success: true,
        modifiedPrompt,
        influenceScore,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('Memory injection failed:', error);
      return this.createRejectionResult(InjectionRejectionReason.SCHEMA_VALIDATION_FAILED);
    }
  }

  /**
   * Creates a rejection result with the specified reason
   */
  private createRejectionResult(reason: InjectionRejectionReason): MemoryInjectionResult {
    return {
      success: false,
      rejectionReason: reason,
      timestamp: Date.now()
    };
  }

  /**
   * Calculates the influence score of memory injection
   */
  private calculateInfluenceScore(memory: MemoryPayload, prompt: PromptVersion): MemoryInfluenceScore {
    // Calculate influence on different aspects
    const toneInfluence = this.calculateAspectInfluence(memory, prompt, 'tone');
    const goalInfluence = this.calculateAspectInfluence(memory, prompt, 'goal');
    const behaviorInfluence = this.calculateAspectInfluence(memory, prompt, 'behavior');

    const overallScore = (toneInfluence + goalInfluence + behaviorInfluence) / 3;
    const confidence = this.calculateConfidence(memory, prompt);

    return {
      score: overallScore,
      aspects: {
        tone: toneInfluence,
        goal: goalInfluence,
        behavior: behaviorInfluence
      },
      confidence,
      isAcceptable: overallScore <= 0.7 && confidence >= 0.8
    };
  }

  /**
   * Calculates influence on a specific aspect
   */
  private calculateAspectInfluence(memory: MemoryPayload, prompt: PromptVersion, aspect: keyof MemoryInfluenceScore['aspects']): number {
    // Implementation would analyze the overlap between memory and prompt for the given aspect
    return 0.5; // Placeholder implementation
  }

  /**
   * Calculates confidence in the influence calculation
   */
  private calculateConfidence(memory: MemoryPayload, prompt: PromptVersion): number {
    // Implementation would consider factors like memory age, relevance, and prompt compatibility
    return 0.9; // Placeholder implementation
  }

  /**
   * Injects memory into the prompt
   */
  private injectMemoryIntoPrompt(prompt: PromptVersion, memory: MemoryPayload): PromptVersion {
    // Implementation would merge memory with prompt while preserving prompt structure
    return {
      ...prompt,
      content: `${prompt.content}\n\nContext from previous interactions: ${JSON.stringify(memory)}`
    };
  }
} 