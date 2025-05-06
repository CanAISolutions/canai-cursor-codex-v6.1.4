/**
 * self-healing/orchestrator.ts
 * 
 * Purpose:
 * Orchestrates self-healing components and coordinates recovery actions across
 * the system, ensuring proper sequencing and resource management.
 */

import { SmartRevisionLoop } from './smart-revision-loop';
import { EnhancedVisionProcessor } from '../vision-injection/enhanced-vision-processor';
import { TrustEvolutionTracker } from '../agents/trust-scorer/evolution-tracker';
import { EmotionalIntelligenceEngine } from '../agents/emotional-intelligence/pipeline';

interface RecoveryAction {
  type: string;
  priority: number;
  component: string;
  strategy: any;
  timestamp: number;
}

interface RecoveryContext {
  emotionalState: {
    userState: number;
    conversationHistory: number;
    environmentalFactors: number;
    needsAttention?: boolean;
    critical?: boolean;
  };
  visionState: {
    recoveryNeeded: boolean;
    critical?: boolean;
  };
  trustState: any;
  systemState: string;
}

export class SelfHealingOrchestrator {
  private recoveryQueue: RecoveryAction[] = [];
  private isProcessing: boolean = false;
  private readonly MAX_CONCURRENT_RECOVERIES = 3;
  private activeRecoveries: Set<string> = new Set();

  constructor(
    private revisionLoop: SmartRevisionLoop,
    private visionProcessor: EnhancedVisionProcessor,
    private trustTracker: TrustEvolutionTracker,
    private emotionalEngine: EmotionalIntelligenceEngine
  ) {}

  /**
   * Initiates a recovery process for a component
   */
  async initiateRecovery(
    component: string,
    context: RecoveryContext
  ): Promise<void> {
    const recoveryAction = await this.createRecoveryAction(component, context);
    this.recoveryQueue.push(recoveryAction);
    this.recoveryQueue.sort((a, b) => b.priority - a.priority);

    if (!this.isProcessing) {
      await this.processRecoveryQueue();
    }
  }

  /**
   * Creates a recovery action based on context
   */
  private async createRecoveryAction(
    component: string,
    context: RecoveryContext
  ): Promise<RecoveryAction> {
    const priority = await this.calculateRecoveryPriority(component, context);
    const strategy = await this.determineRecoveryStrategy(component, context);

    return {
      type: strategy.type,
      priority,
      component,
      strategy,
      timestamp: Date.now()
    };
  }

  /**
   * Processes the recovery queue
   */
  private async processRecoveryQueue(): Promise<void> {
    if (this.isProcessing || this.recoveryQueue.length === 0) return;

    this.isProcessing = true;

    try {
      while (this.recoveryQueue.length > 0) {
        const batch = this.recoveryQueue.splice(
          0,
          this.MAX_CONCURRENT_RECOVERIES
        );

        await Promise.all(
          batch.map(action => this.executeRecoveryAction(action))
        );
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Executes a recovery action
   */
  private async executeRecoveryAction(action: RecoveryAction): Promise<void> {
    if (this.activeRecoveries.has(action.component)) {
      return;
    }

    this.activeRecoveries.add(action.component);

    try {
      switch (action.type) {
        case 'semantic':
          await this.handleSemanticRecovery(action);
          break;
        case 'emotional':
          await this.handleEmotionalRecovery(action);
          break;
        case 'contextual':
          await this.handleContextualRecovery(action);
          break;
        default:
          throw new Error(`Unknown recovery type: ${action.type}`);
      }

      await this.recordRecoverySuccess(action);
    } catch (error) {
      await this.handleRecoveryFailure(action, error);
    } finally {
      this.activeRecoveries.delete(action.component);
    }
  }

  /**
   * Calculates recovery priority
   */
  private async calculateRecoveryPriority(
    component: string,
    context: RecoveryContext
  ): Promise<number> {
    const trustMetrics = await this.trustTracker.calculateEvolutionMetrics(component);
    const emotionalState = context.emotionalState;
    const visionState = context.visionState;

    let priority = 0;

    // Trust-based priority
    if (trustMetrics.baselineScore < 0.7) priority += 3;
    if (trustMetrics.stabilityIndex < 0.6) priority += 2;

    // Emotional state priority
    if (emotionalState.needsAttention) priority += 2;
    if (emotionalState.critical) priority += 3;

    // Vision state priority
    if (visionState.recoveryNeeded) priority += 2;
    if (visionState.critical) priority += 3;

    return Math.min(10, priority);
  }

  /**
   * Determines recovery strategy
   */
  private async determineRecoveryStrategy(
    component: string,
    context: RecoveryContext
  ): Promise<any> {
    const emotionalAnalysis = await this.emotionalEngine.processInput(
      context.systemState,
      {
        userState: context.emotionalState.userState,
        conversationHistory: context.emotionalState.conversationHistory,
        environmentalFactors: context.emotionalState.environmentalFactors
      }
    );

    const visionAnalysis = await this.visionProcessor.processVision(
      context.systemState,
      context,
      context.emotionalState
    );

    return {
      type: this.determineRecoveryType(emotionalAnalysis, visionAnalysis),
      actions: this.generateRecoveryActions(emotionalAnalysis, visionAnalysis),
      expectedOutcome: this.predictRecoveryOutcome(emotionalAnalysis, visionAnalysis)
    };
  }

  /**
   * Handles semantic recovery
   */
  private async handleSemanticRecovery(action: RecoveryAction): Promise<void> {
    await this.revisionLoop.attemptRecovery('semantic', {
      component: action.component,
      strategy: action.strategy
    });
  }

  /**
   * Handles emotional recovery
   */
  private async handleEmotionalRecovery(action: RecoveryAction): Promise<void> {
    await this.revisionLoop.attemptRecovery('emotional', {
      component: action.component,
      strategy: action.strategy
    });
  }

  /**
   * Handles contextual recovery
   */
  private async handleContextualRecovery(action: RecoveryAction): Promise<void> {
    await this.revisionLoop.attemptRecovery('contextual', {
      component: action.component,
      strategy: action.strategy
    });
  }

  /**
   * Records successful recovery
   */
  private async recordRecoverySuccess(action: RecoveryAction): Promise<void> {
    await this.trustTracker.recordTrustScore(
      action.component,
      0.9, // High trust score after successful recovery
      'recovery_success',
      true,
      true
    );
  }

  /**
   * Handles recovery failure
   */
  private async handleRecoveryFailure(
    action: RecoveryAction,
    error: any
  ): Promise<void> {
    await this.trustTracker.recordTrustScore(
      action.component,
      0.5, // Lower trust score after failure
      'recovery_failure',
      true,
      false
    );

    // Requeue with lower priority
    const requeuedAction = {
      ...action,
      priority: Math.max(1, action.priority - 2),
      timestamp: Date.now()
    };

    this.recoveryQueue.push(requeuedAction);
  }

  /**
   * Determines recovery type
   */
  private determineRecoveryType(emotionalAnalysis: any, visionAnalysis: any): string {
    if (visionAnalysis.semanticAnalysis.recoveryNeeded) return 'semantic';
    if (emotionalAnalysis.needsRecovery) return 'emotional';
    return 'contextual';
  }

  /**
   * Generates recovery actions
   */
  private generateRecoveryActions(
    emotionalAnalysis: any,
    visionAnalysis: any
  ): string[] {
    const actions: string[] = [];

    if (visionAnalysis.semanticAnalysis.recoveryNeeded) {
      actions.push('Enhance semantic understanding');
      actions.push('Improve context alignment');
    }

    if (emotionalAnalysis.needsRecovery) {
      actions.push('Adjust emotional tone');
      actions.push('Strengthen empathy');
    }

    return actions;
  }

  /**
   * Predicts recovery outcome
   */
  private predictRecoveryOutcome(
    emotionalAnalysis: any,
    visionAnalysis: any
  ): string {
    if (visionAnalysis.semanticAnalysis.recoveryNeeded) {
      return 'Improved semantic understanding and context alignment';
    }
    if (emotionalAnalysis.needsRecovery) {
      return 'Enhanced emotional resonance and connection';
    }
    return 'Better system state and stability';
  }
} 