/**
 * meta-control/codex-aligner.ts
 * 
 * Purpose:
 * Ensures system behavior aligns with Codex principles and guidelines.
 * Monitors and corrects deviations from expected behavior patterns.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';

export interface AlignmentPlan {
  priority: number;
  corrections: Array<{
    type: 'prompt' | 'response' | 'behavior';
    target: string;
    parameters: Record<string, any>;
  }>;
  expectedOutcome: {
    alignmentScore: number;
    trustImpact: number;
    resourceImpact: number;
  };
}

export interface CodexGuidelines {
  promptGuidelines: {
    maxLength: number;
    requiredElements: string[];
    prohibitedElements: string[];
  };
  responseGuidelines: {
    maxLength: number;
    requiredElements: string[];
    prohibitedElements: string[];
  };
  behaviorGuidelines: {
    maxResponseTime: number;
    requiredPatterns: string[];
    prohibitedPatterns: string[];
  };
}

export class CodexAligner {
  private readonly ALIGNMENT_THRESHOLD = 0.8;
  private readonly CORRECTION_COOLDOWN = 3000; // 3 seconds
  private readonly MAX_CORRECTIONS = 3;

  private readonly guidelines: CodexGuidelines = {
    promptGuidelines: {
      maxLength: 2000,
      requiredElements: ['purpose', 'context', 'constraints'],
      prohibitedElements: ['api_key', 'password', 'secret']
    },
    responseGuidelines: {
      maxLength: 4000,
      requiredElements: ['explanation', 'solution', 'impact'],
      prohibitedElements: ['error_details', 'stack_trace', 'internal_paths']
    },
    behaviorGuidelines: {
      maxResponseTime: 5000,
      requiredPatterns: ['clear_explanation', 'step_by_step', 'error_handling'],
      prohibitedPatterns: ['direct_api_calls', 'unsafe_eval', 'infinite_loops']
    }
  };

  constructor(
    private readonly eventBus: EventBus,
    private readonly trustScorer: TrustScorer,
    private readonly agentMemory: AgentMemory
  ) {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.on('alignment:required', this.handleAlignmentRequired.bind(this));
    this.eventBus.on('correction:applied', this.handleCorrectionApplied.bind(this));
  }

  public async validatePromptAlignment(prompt: { content: string; metadata: Record<string, any> }): Promise<boolean> {
    const { content, metadata } = prompt;
    const isAligned = this.validateContent(content, metadata, this.guidelines.promptGuidelines);
    
    if (!isAligned) {
      await this.eventBus.emit('alignment:deviation', {
        type: 'prompt',
        content,
        metadata,
        timestamp: Date.now()
      }, 'high');
    }
    
    return isAligned;
  }

  public async validateResponseAlignment(response: { content: string; metadata: Record<string, any> }): Promise<boolean> {
    const { content, metadata } = response;
    const isAligned = this.validateContent(content, metadata, this.guidelines.responseGuidelines);
    
    if (!isAligned) {
      await this.eventBus.emit('alignment:deviation', {
        type: 'response',
        content,
        metadata,
        timestamp: Date.now()
      }, 'high');
    }
    
    return isAligned;
  }

  public async validateBehaviorAlignment(behavior: { action: string; metadata: Record<string, any> }): Promise<boolean> {
    const { action, metadata } = behavior;
    const isAligned = this.validateContent(action, metadata, this.guidelines.behaviorGuidelines);
    
    if (!isAligned) {
      await this.eventBus.emit('alignment:deviation', {
        type: 'behavior',
        action,
        metadata,
        timestamp: Date.now()
      }, 'high');
    }
    
    return isAligned;
  }

  public async enforceAlignment(content: { type: string; data: { content: string; metadata: Record<string, any> } }): Promise<boolean> {
    try {
      const { type, data } = content;
      const guidelines = this.getGuidelinesForType(type);
      
      if (!guidelines) {
        throw new Error(`Unknown content type: ${type}`);
      }

      const alignedContent = this.alignContent(data.content, data.metadata, guidelines);
      
      await this.eventBus.emit('alignment:enforced', {
        type,
        originalContent: data.content,
        alignedContent,
        timestamp: Date.now()
      }, 'medium');

      return true;
    } catch (error) {
      await this.eventBus.emit('alignment:error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        content,
        timestamp: Date.now()
      }, 'high');
      return false;
    }
  }

  public async getAlignmentMetrics(): Promise<{
    alignmentScore: number;
    deviationMetrics: {
      promptDeviation: number;
      responseDeviation: number;
      behaviorDeviation: number;
    };
  }> {
    try {
      const metrics = await this.agentMemory.getSystemMetrics();
      return {
        alignmentScore: metrics.alignmentScore || 0,
        deviationMetrics: {
          promptDeviation: 0,
          responseDeviation: 0,
          behaviorDeviation: 0
        }
      };
    } catch (error) {
      return {
        alignmentScore: 0,
        deviationMetrics: {
          promptDeviation: 0,
          responseDeviation: 0,
          behaviorDeviation: 0
        }
      };
    }
  }

  private validateContent(content: string, metadata: Record<string, any>, guidelines: any): boolean {
    // Check content length
    if (content.length > guidelines.maxLength) {
      return false;
    }

    // Check required elements
    if (guidelines.requiredElements) {
      for (const element of guidelines.requiredElements) {
        if (!content.includes(element)) {
          return false;
        }
      }
    }

    // Check prohibited elements
    if (guidelines.prohibitedElements) {
      for (const element of guidelines.prohibitedElements) {
        if (content.includes(element)) {
          return false;
        }
      }
    }

    // Check metadata tone
    if (metadata.tone === 'casual' && metadata.context === 'business') {
      return false;
    }

    return true;
  }

  private alignContent(content: string, metadata: Record<string, any>, guidelines: any): string {
    let alignedContent = content;

    // Enforce length limit
    if (alignedContent.length > guidelines.maxLength) {
      alignedContent = alignedContent.substring(0, guidelines.maxLength);
    }

    // Add missing required elements
    if (guidelines.requiredElements) {
      for (const element of guidelines.requiredElements) {
        if (!alignedContent.includes(element)) {
          alignedContent += `\n${element}`;
        }
      }
    }

    // Remove prohibited elements
    if (guidelines.prohibitedElements) {
      for (const element of guidelines.prohibitedElements) {
        alignedContent = alignedContent.replace(new RegExp(element, 'g'), '');
      }
    }

    return alignedContent;
  }

  private getGuidelinesForType(type: string): any {
    switch (type) {
      case 'prompt':
        return this.guidelines.promptGuidelines;
      case 'response':
        return this.guidelines.responseGuidelines;
      case 'behavior':
        return this.guidelines.behaviorGuidelines;
      default:
        return null;
    }
  }

  private async handleAlignmentRequired(event: any): Promise<void> {
    // Implementation for alignment requirement handling
  }

  private async handleCorrectionApplied(event: any): Promise<void> {
    // Implementation for correction application handling
  }
} 