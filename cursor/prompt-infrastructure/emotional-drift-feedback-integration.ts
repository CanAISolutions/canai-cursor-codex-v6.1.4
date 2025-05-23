/**
 * @file emotional-drift-feedback-integration.ts
 * @purpose Integrates emotionalDriftDiffLog into agent feedback loops and meta-reasoning systems
 * @codex Enables continuous emotional quality improvement through drift pattern analysis
 * @version v6.1.4
 */

import { EventBus } from '../event-bus/eventBus';
import { PromptEvolutionManager } from './prompt-evolver';
import { MetaController } from '../meta-control/meta-controller';
import { SmartPromptScore } from '../agents/smartPromptScore';
import { PromptDefinition } from './prompt-schema';

// Enhanced interfaces for drift feedback integration
interface EmotionalDriftPattern {
  sessionId: string;
  promptId: string;
  agentLineage: string[];
  driftHistory: Array<{
    timestamp: string;
    requestedTone: string;
    actualTone: string;
    driftScore: number;
    driftCategory: 'none' | 'minor' | 'moderate' | 'severe';
    semanticDiffSummary: string;
    correctionApplied: boolean;
    contentIndicators: string[];
    trustImpact: number;
  }>;
  aggregatedMetrics: {
    avgDriftScore: number;
    driftTrend: 'improving' | 'stable' | 'degrading';
    correctionFrequency: number;
    severeDriftCount: number;
    trustVolatility: number;
  };
}

interface DriftFeedbackSignal {
  type: 'prompt_evolution' | 'agent_tuning' | 'meta_reasoning' | 'copilot_guidance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetComponent: string;
  driftPattern: EmotionalDriftPattern;
  recommendations: Array<{
    action: string;
    confidence: number;
    expectedImpact: number;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  metadata: {
    analysisTimestamp: string;
    analysisConfidence: number;
    patternStrength: number;
    urgencyScore: number;
  };
}

interface AgentTuningParameters {
  agentId: string;
  emotionalSensitivity: number; // 0-1 scale
  toneStabilityThreshold: number; // Drift tolerance
  correctionAggression: number; // How quickly to apply corrections
  fallbackTriggerThreshold: number; // When to trigger fallback
  learningRate: number; // How quickly to adapt to patterns
  contextMemoryDepth: number; // How much history to consider
}

interface MetaReasoningContext {
  systemEmotionalHealth: {
    overallDriftScore: number;
    trendDirection: 'improving' | 'stable' | 'degrading';
    criticalDriftAgents: string[];
    emotionalVolatility: number;
  };
  agentPerformanceMap: Record<string, {
    driftStability: number;
    correctionEffectiveness: number;
    trustImpact: number;
    adaptationRate: number;
  }>;
  promptEvolutionNeeds: Array<{
    promptId: string;
    evolutionPriority: number;
    driftReason: string;
    suggestedChanges: string[];
  }>;
}

/**
 * Core integration engine for emotional drift feedback
 */
export class EmotionalDriftFeedbackEngine {
  private readonly eventBus: EventBus;
  private readonly promptEvolutionManager: PromptEvolutionManager;
  private readonly metaController: MetaController;
  private readonly smartPromptScore: SmartPromptScore;
  
  private driftPatterns: Map<string, EmotionalDriftPattern> = new Map();
  private agentTuningParams: Map<string, AgentTuningParameters> = new Map();
  private feedbackHistory: DriftFeedbackSignal[] = [];
  
  private readonly DRIFT_ANALYSIS_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
  private readonly CRITICAL_DRIFT_THRESHOLD = 0.7;
  private readonly PATTERN_CONFIDENCE_THRESHOLD = 0.8;

  constructor(
    eventBus: EventBus,
    promptEvolutionManager: PromptEvolutionManager,
    metaController: MetaController,
    smartPromptScore: SmartPromptScore
  ) {
    this.eventBus = eventBus;
    this.promptEvolutionManager = promptEvolutionManager;
    this.metaController = metaController;
    this.smartPromptScore = smartPromptScore;
    
    this.initializeEventListeners();
    this.initializeDefaultTuningParameters();
  }

  /**
   * Main entry point: Process drift data from SnapshotMetadataAnnotator
   */
  async processDriftData(snapshotMetadata: {
    snapshotId: string;
    outputHash: string;
    emotionalDriftDiffLog: {
      requestedTone: string;
      actualTone: string;
      driftScore: number;
      semanticDiffSummary: string;
      driftCategory: 'none' | 'minor' | 'moderate' | 'severe';
      correctionApplied: boolean;
      timestamp: string;
    };
  }, context: {
    sessionId: string;
    promptId: string;
    agentLineage: string[];
    trustScore: number;
  }): Promise<void> {
    // 1. Update drift patterns
    await this.updateDriftPattern(snapshotMetadata, context);
    
    // 2. Analyze for feedback signals
    const feedbackSignals = await this.analyzeDriftForFeedback(context.sessionId);
    
    // 3. Route feedback to appropriate systems
    for (const signal of feedbackSignals) {
      await this.routeFeedbackSignal(signal);
    }
    
    // 4. Update meta-reasoning context
    await this.updateMetaReasoningContext();
    
    // 5. Log feedback processing
    await this.logFeedbackProcessing(snapshotMetadata, feedbackSignals);
  }

  /**
   * Update drift patterns with new data
   */
  private async updateDriftPattern(
    snapshotMetadata: any,
    context: any
  ): Promise<void> {
    const patternKey = `${context.sessionId}-${context.promptId}`;
    let pattern = this.driftPatterns.get(patternKey);
    
    if (!pattern) {
      pattern = {
        sessionId: context.sessionId,
        promptId: context.promptId,
        agentLineage: context.agentLineage,
        driftHistory: [],
        aggregatedMetrics: {
          avgDriftScore: 0,
          driftTrend: 'stable',
          correctionFrequency: 0,
          severeDriftCount: 0,
          trustVolatility: 0
        }
      };
    }
    
    // Add new drift entry
    pattern.driftHistory.push({
      timestamp: snapshotMetadata.emotionalDriftDiffLog.timestamp,
      requestedTone: snapshotMetadata.emotionalDriftDiffLog.requestedTone,
      actualTone: snapshotMetadata.emotionalDriftDiffLog.actualTone,
      driftScore: snapshotMetadata.emotionalDriftDiffLog.driftScore,
      driftCategory: snapshotMetadata.emotionalDriftDiffLog.driftCategory,
      semanticDiffSummary: snapshotMetadata.emotionalDriftDiffLog.semanticDiffSummary,
      correctionApplied: snapshotMetadata.emotionalDriftDiffLog.correctionApplied,
      contentIndicators: this.extractContentIndicators(snapshotMetadata.emotionalDriftDiffLog.semanticDiffSummary),
      trustImpact: this.calculateTrustImpact(snapshotMetadata.emotionalDriftDiffLog.driftScore, context.trustScore)
    });
    
    // Update aggregated metrics
    pattern.aggregatedMetrics = this.calculateAggregatedMetrics(pattern.driftHistory);
    
    // Store updated pattern
    this.driftPatterns.set(patternKey, pattern);
    
    // Emit pattern update event
    this.eventBus.emit('drift-pattern-updated', {
      patternKey,
      pattern,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Analyze drift patterns for feedback signals
   */
  private async analyzeDriftForFeedback(sessionId: string): Promise<DriftFeedbackSignal[]> {
    const signals: DriftFeedbackSignal[] = [];
    const relevantPatterns = Array.from(this.driftPatterns.values())
      .filter(pattern => pattern.sessionId === sessionId);
    
    for (const pattern of relevantPatterns) {
      // 1. Check for prompt evolution needs
      if (this.needsPromptEvolution(pattern)) {
        signals.push(await this.createPromptEvolutionSignal(pattern));
      }
      
      // 2. Check for agent tuning needs
      if (this.needsAgentTuning(pattern)) {
        signals.push(await this.createAgentTuningSignal(pattern));
      }
      
      // 3. Check for meta-reasoning needs
      if (this.needsMetaReasoning(pattern)) {
        signals.push(await this.createMetaReasoningSignal(pattern));
      }
      
      // 4. Check for copilot guidance needs
      if (this.needsCopilotGuidance(pattern)) {
        signals.push(await this.createCopilotGuidanceSignal(pattern));
      }
    }
    
    return signals;
  }

  /**
   * Route feedback signals to appropriate systems
   */
  private async routeFeedbackSignal(signal: DriftFeedbackSignal): Promise<void> {
    switch (signal.type) {
      case 'prompt_evolution':
        await this.routeToPromptEvolution(signal);
        break;
      case 'agent_tuning':
        await this.routeToAgentTuning(signal);
        break;
      case 'meta_reasoning':
        await this.routeToMetaReasoning(signal);
        break;
      case 'copilot_guidance':
        await this.routeToCopilotGuidance(signal);
        break;
    }
    
    // Store feedback signal in history
    this.feedbackHistory.push(signal);
    
    // Emit feedback routing event
    this.eventBus.emit('drift-feedback-routed', {
      signalType: signal.type,
      targetComponent: signal.targetComponent,
      priority: signal.priority,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Route to Prompt Evolution Manager
   */
  private async routeToPromptEvolution(signal: DriftFeedbackSignal): Promise<void> {
    const evolutionContext = {
      feedback: {
        driftPattern: signal.driftPattern,
        recommendations: signal.recommendations,
        quality: 1 - signal.driftPattern.aggregatedMetrics.avgDriftScore // Invert drift score for quality
      },
      metrics: {
        performance: signal.driftPattern.aggregatedMetrics.correctionFrequency < 0.3 ? 0.8 : 0.4,
        emotionalStability: 1 - signal.driftPattern.aggregatedMetrics.trustVolatility
      },
      triggers: {
        driftCategory: signal.driftPattern.driftHistory[signal.driftPattern.driftHistory.length - 1]?.driftCategory,
        urgency: signal.metadata.urgencyScore
      }
    };
    
    // Find prompt definition (simplified - would need actual prompt lookup)
    const promptDefinition: PromptDefinition = {
      id: signal.driftPattern.promptId,
      type: 'production',
      version: '1.0.0',
      status: 'active',
      name: 'Emotional Drift Prompt',
      description: 'Prompt requiring emotional drift correction',
      content: 'placeholder', // Would be actual prompt content
      metadata: {
        author: 'system',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: ['emotional-drift'],
        dependencies: [],
        trustScore: signal.driftPattern.aggregatedMetrics.avgDriftScore,
        alignmentScore: 0.8,
        performanceScore: 0.7
      },
      contracts: [],
      constraints: [],
      evolution: {
        id: `evolution-${Date.now()}`,
        version: '1.0.0',
        timestamp: Date.now(),
        changes: [],
        metadata: {
          author: 'system',
          reason: 'Initial creation',
          trustImpact: 0,
          performanceImpact: 0,
          alignmentImpact: 0
        }
      }
    };
    
    try {
      const evolvedPrompt = await this.promptEvolutionManager.evolvePrompt(promptDefinition, evolutionContext);
      
      this.eventBus.emit('prompt-evolved-from-drift', {
        originalPromptId: signal.driftPattern.promptId,
        evolvedPromptId: evolvedPrompt.id,
        driftReason: signal.recommendations[0]?.action,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.eventBus.emit('prompt-evolution-failed', {
        promptId: signal.driftPattern.promptId,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Route to Agent Tuning
   */
  private async routeToAgentTuning(signal: DriftFeedbackSignal): Promise<void> {
    for (const agentId of signal.driftPattern.agentLineage) {
      const currentParams = this.agentTuningParams.get(agentId) || this.getDefaultTuningParameters(agentId);
      const adjustedParams = this.calculateTuningAdjustments(currentParams, signal.driftPattern);
      
      this.agentTuningParams.set(agentId, adjustedParams);
      
      this.eventBus.emit('agent-tuning-updated', {
        agentId,
        previousParams: currentParams,
        newParams: adjustedParams,
        driftReason: signal.recommendations[0]?.action,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Route to Meta-Reasoning
   */
  private async routeToMetaReasoning(signal: DriftFeedbackSignal): Promise<void> {
    const metaContext = await this.buildMetaReasoningContext();
    
    // Update meta-controller with drift insights
    this.eventBus.emit('meta-reasoning-drift-update', {
      systemEmotionalHealth: metaContext.systemEmotionalHealth,
      agentPerformanceMap: metaContext.agentPerformanceMap,
      promptEvolutionNeeds: metaContext.promptEvolutionNeeds,
      signal,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Route to Copilot Guidance
   */
  private async routeToCopilotGuidance(signal: DriftFeedbackSignal): Promise<void> {
    const guidanceMessage = this.generateCopilotGuidanceMessage(signal);
    
    this.eventBus.emit('copilot-drift-guidance', {
      sessionId: signal.driftPattern.sessionId,
      message: guidanceMessage,
      priority: signal.priority,
      driftCategory: signal.driftPattern.driftHistory[signal.driftPattern.driftHistory.length - 1]?.driftCategory,
      timestamp: new Date().toISOString()
    });
  }

  // Helper methods for analysis and decision making
  private needsPromptEvolution(pattern: EmotionalDriftPattern): boolean {
    return pattern.aggregatedMetrics.avgDriftScore > 0.5 && 
           pattern.aggregatedMetrics.driftTrend === 'degrading' &&
           pattern.driftHistory.length >= 3;
  }

  private needsAgentTuning(pattern: EmotionalDriftPattern): boolean {
    return pattern.aggregatedMetrics.correctionFrequency > 0.4 &&
           pattern.aggregatedMetrics.severeDriftCount > 2;
  }

  private needsMetaReasoning(pattern: EmotionalDriftPattern): boolean {
    return pattern.aggregatedMetrics.trustVolatility > 0.3 ||
           pattern.aggregatedMetrics.avgDriftScore > this.CRITICAL_DRIFT_THRESHOLD;
  }

  private needsCopilotGuidance(pattern: EmotionalDriftPattern): boolean {
    const recentDrift = pattern.driftHistory[pattern.driftHistory.length - 1];
    return recentDrift?.driftCategory === 'severe' || 
           pattern.aggregatedMetrics.correctionFrequency > 0.6;
  }

  private async createPromptEvolutionSignal(pattern: EmotionalDriftPattern): Promise<DriftFeedbackSignal> {
    return {
      type: 'prompt_evolution',
      priority: pattern.aggregatedMetrics.avgDriftScore > this.CRITICAL_DRIFT_THRESHOLD ? 'critical' : 'high',
      targetComponent: 'PromptEvolutionManager',
      driftPattern: pattern,
      recommendations: [
        {
          action: 'Evolve prompt to reduce emotional drift',
          confidence: 0.85,
          expectedImpact: 0.3,
          riskLevel: 'low'
        },
        {
          action: 'Adjust tone guidance in prompt template',
          confidence: 0.75,
          expectedImpact: 0.2,
          riskLevel: 'low'
        }
      ],
      metadata: {
        analysisTimestamp: new Date().toISOString(),
        analysisConfidence: 0.8,
        patternStrength: pattern.driftHistory.length / 10,
        urgencyScore: pattern.aggregatedMetrics.avgDriftScore
      }
    };
  }

  private async createAgentTuningSignal(pattern: EmotionalDriftPattern): Promise<DriftFeedbackSignal> {
    return {
      type: 'agent_tuning',
      priority: 'medium',
      targetComponent: pattern.agentLineage.join(','),
      driftPattern: pattern,
      recommendations: [
        {
          action: 'Increase emotional sensitivity threshold',
          confidence: 0.7,
          expectedImpact: 0.25,
          riskLevel: 'medium'
        },
        {
          action: 'Reduce correction aggression',
          confidence: 0.65,
          expectedImpact: 0.15,
          riskLevel: 'low'
        }
      ],
      metadata: {
        analysisTimestamp: new Date().toISOString(),
        analysisConfidence: 0.75,
        patternStrength: pattern.aggregatedMetrics.correctionFrequency,
        urgencyScore: pattern.aggregatedMetrics.severeDriftCount / 10
      }
    };
  }

  private async createMetaReasoningSignal(pattern: EmotionalDriftPattern): Promise<DriftFeedbackSignal> {
    return {
      type: 'meta_reasoning',
      priority: 'high',
      targetComponent: 'MetaController',
      driftPattern: pattern,
      recommendations: [
        {
          action: 'Reassess agent selection criteria',
          confidence: 0.8,
          expectedImpact: 0.4,
          riskLevel: 'medium'
        },
        {
          action: 'Trigger system-wide emotional health check',
          confidence: 0.9,
          expectedImpact: 0.5,
          riskLevel: 'low'
        }
      ],
      metadata: {
        analysisTimestamp: new Date().toISOString(),
        analysisConfidence: 0.85,
        patternStrength: pattern.aggregatedMetrics.trustVolatility,
        urgencyScore: pattern.aggregatedMetrics.avgDriftScore
      }
    };
  }

  private async createCopilotGuidanceSignal(pattern: EmotionalDriftPattern): Promise<DriftFeedbackSignal> {
    return {
      type: 'copilot_guidance',
      priority: 'medium',
      targetComponent: 'CopilotFeedbackAgent',
      driftPattern: pattern,
      recommendations: [
        {
          action: 'Provide tone adjustment guidance',
          confidence: 0.9,
          expectedImpact: 0.3,
          riskLevel: 'low'
        }
      ],
      metadata: {
        analysisTimestamp: new Date().toISOString(),
        analysisConfidence: 0.9,
        patternStrength: 1.0,
        urgencyScore: 0.6
      }
    };
  }

  // Utility methods
  private calculateAggregatedMetrics(driftHistory: any[]): EmotionalDriftPattern['aggregatedMetrics'] {
    if (driftHistory.length === 0) {
      return {
        avgDriftScore: 0,
        driftTrend: 'stable',
        correctionFrequency: 0,
        severeDriftCount: 0,
        trustVolatility: 0
      };
    }

    const avgDriftScore = driftHistory.reduce((sum, entry) => sum + entry.driftScore, 0) / driftHistory.length;
    const correctionFrequency = driftHistory.filter(entry => entry.correctionApplied).length / driftHistory.length;
    const severeDriftCount = driftHistory.filter(entry => entry.driftCategory === 'severe').length;
    
    // Calculate trend (simplified)
    const recentEntries = driftHistory.slice(-3);
    const oldEntries = driftHistory.slice(0, 3);
    const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.driftScore, 0) / recentEntries.length;
    const oldAvg = oldEntries.reduce((sum, entry) => sum + entry.driftScore, 0) / oldEntries.length;
    
    let driftTrend: 'improving' | 'stable' | 'degrading' = 'stable';
    if (recentAvg < oldAvg - 0.1) driftTrend = 'improving';
    else if (recentAvg > oldAvg + 0.1) driftTrend = 'degrading';
    
    // Calculate trust volatility
    const trustImpacts = driftHistory.map(entry => entry.trustImpact);
    const trustVolatility = this.calculateVolatility(trustImpacts);

    return {
      avgDriftScore,
      driftTrend,
      correctionFrequency,
      severeDriftCount,
      trustVolatility
    };
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private extractContentIndicators(semanticDiffSummary: string): string[] {
    // Extract key indicators from semantic summary
    const indicators: string[] = [];
    const patterns = [
      /tone shift/i,
      /confidence/i,
      /drift/i,
      /fallback/i,
      /correction/i,
      /alignment/i
    ];
    
    patterns.forEach(pattern => {
      if (pattern.test(semanticDiffSummary)) {
        indicators.push(pattern.source.replace(/[\/\\^$*+?.()|[\]{}]/g, ''));
      }
    });
    
    return indicators;
  }

  private calculateTrustImpact(driftScore: number, trustScore: number): number {
    // Higher drift score = more negative trust impact
    return -driftScore * (1 - trustScore);
  }

  private getDefaultTuningParameters(agentId: string): AgentTuningParameters {
    return {
      agentId,
      emotionalSensitivity: 0.7,
      toneStabilityThreshold: 0.25,
      correctionAggression: 0.5,
      fallbackTriggerThreshold: 0.75,
      learningRate: 0.1,
      contextMemoryDepth: 10
    };
  }

  private calculateTuningAdjustments(
    currentParams: AgentTuningParameters,
    pattern: EmotionalDriftPattern
  ): AgentTuningParameters {
    const adjustments = { ...currentParams };
    
    // Increase sensitivity if high drift
    if (pattern.aggregatedMetrics.avgDriftScore > 0.5) {
      adjustments.emotionalSensitivity = Math.min(0.9, currentParams.emotionalSensitivity + 0.1);
    }
    
    // Reduce correction aggression if too many corrections
    if (pattern.aggregatedMetrics.correctionFrequency > 0.5) {
      adjustments.correctionAggression = Math.max(0.2, currentParams.correctionAggression - 0.1);
    }
    
    // Adjust fallback threshold based on severe drift
    if (pattern.aggregatedMetrics.severeDriftCount > 2) {
      adjustments.fallbackTriggerThreshold = Math.max(0.5, currentParams.fallbackTriggerThreshold - 0.1);
    }
    
    return adjustments;
  }

  private async buildMetaReasoningContext(): Promise<MetaReasoningContext> {
    const allPatterns = Array.from(this.driftPatterns.values());
    
    // Calculate system emotional health
    const overallDriftScore = allPatterns.reduce((sum, pattern) => 
      sum + pattern.aggregatedMetrics.avgDriftScore, 0) / allPatterns.length;
    
    const criticalDriftAgents = allPatterns
      .filter(pattern => pattern.aggregatedMetrics.avgDriftScore > this.CRITICAL_DRIFT_THRESHOLD)
      .flatMap(pattern => pattern.agentLineage);
    
    // Build agent performance map
    const agentPerformanceMap: Record<string, any> = {};
    allPatterns.forEach(pattern => {
      pattern.agentLineage.forEach(agentId => {
        if (!agentPerformanceMap[agentId]) {
          agentPerformanceMap[agentId] = {
            driftStability: 1 - pattern.aggregatedMetrics.avgDriftScore,
            correctionEffectiveness: 1 - pattern.aggregatedMetrics.correctionFrequency,
            trustImpact: pattern.aggregatedMetrics.trustVolatility,
            adaptationRate: 0.5 // Placeholder
          };
        }
      });
    });
    
    // Identify prompt evolution needs
    const promptEvolutionNeeds = allPatterns
      .filter(pattern => this.needsPromptEvolution(pattern))
      .map(pattern => ({
        promptId: pattern.promptId,
        evolutionPriority: pattern.aggregatedMetrics.avgDriftScore,
        driftReason: pattern.driftHistory[pattern.driftHistory.length - 1]?.semanticDiffSummary || 'Unknown',
        suggestedChanges: ['Improve tone guidance', 'Add emotional stability checks']
      }));
    
    return {
      systemEmotionalHealth: {
        overallDriftScore,
        trendDirection: 'stable', // Simplified
        criticalDriftAgents,
        emotionalVolatility: this.calculateVolatility(allPatterns.map(p => p.aggregatedMetrics.avgDriftScore))
      },
      agentPerformanceMap,
      promptEvolutionNeeds
    };
  }

  private generateCopilotGuidanceMessage(signal: DriftFeedbackSignal): string {
    const recentDrift = signal.driftPattern.driftHistory[signal.driftPattern.driftHistory.length - 1];
    
    switch (recentDrift?.driftCategory) {
      case 'severe':
        return "I notice the tone isn't quite matching what you're looking for. Let me help adjust the emotional direction.";
      case 'moderate':
        return "The tone is close but could use some fine-tuning. Would you like me to suggest some adjustments?";
      case 'minor':
        return "Just a small tone adjustment might help - I can guide you through it.";
      default:
        return "Let's work together to get the emotional tone just right.";
    }
  }

  private async updateMetaReasoningContext(): Promise<void> {
    const context = await this.buildMetaReasoningContext();
    
    this.eventBus.emit('meta-reasoning-context-updated', {
      context,
      timestamp: new Date().toISOString()
    });
  }

  private async logFeedbackProcessing(
    snapshotMetadata: any,
    feedbackSignals: DriftFeedbackSignal[]
  ): Promise<void> {
    this.eventBus.emit('drift-feedback-processed', {
      snapshotId: snapshotMetadata.snapshotId,
      driftCategory: snapshotMetadata.emotionalDriftDiffLog.driftCategory,
      signalsGenerated: feedbackSignals.length,
      signalTypes: feedbackSignals.map(s => s.type),
      timestamp: new Date().toISOString()
    });
  }

  private initializeEventListeners(): void {
    // Listen for snapshot approval events to process drift data
    this.eventBus.on('snapshot-approval-gate', async (data) => {
      if (data.snapshotMetadata?.emotionalDriftDiffLog) {
        await this.processDriftData(data.snapshotMetadata, {
          sessionId: data.sessionId || 'unknown',
          promptId: data.promptId || 'unknown',
          agentLineage: data.agentLineage || [],
          trustScore: data.trustScore || 0.5
        });
      }
    });
  }

  private initializeDefaultTuningParameters(): void {
    // Initialize default tuning parameters for common agents
    const commonAgents = [
      'strategy-agent',
      'content-enhancer',
      'emotional-intelligence',
      'tone-override-agent',
      'copilot-feedback-agent'
    ];
    
    commonAgents.forEach(agentId => {
      this.agentTuningParams.set(agentId, this.getDefaultTuningParameters(agentId));
    });
  }

  // Public API methods for external integration
  public async getDriftPattern(sessionId: string, promptId: string): Promise<EmotionalDriftPattern | null> {
    return this.driftPatterns.get(`${sessionId}-${promptId}`) || null;
  }

  public async getAgentTuningParameters(agentId: string): Promise<AgentTuningParameters | null> {
    return this.agentTuningParams.get(agentId) || null;
  }

  public async getFeedbackHistory(limit: number = 50): Promise<DriftFeedbackSignal[]> {
    return this.feedbackHistory.slice(-limit);
  }

  public async getSystemEmotionalHealth(): Promise<MetaReasoningContext['systemEmotionalHealth']> {
    const context = await this.buildMetaReasoningContext();
    return context.systemEmotionalHealth;
  }
}

/**
 * Integration helper for connecting to existing systems
 */
export class DriftFeedbackIntegrationHelper {
  static async integrateWithSnapshotApprovalGate(
    snapshotApprovalGate: any,
    driftFeedbackEngine: EmotionalDriftFeedbackEngine
  ): Promise<void> {
    // Enhance SnapshotApprovalGate to emit drift data
    const originalValidate = snapshotApprovalGate.validate.bind(snapshotApprovalGate);
    
    snapshotApprovalGate.validate = async function(outputPayload: any, requestedTone: string) {
      const result = await originalValidate(outputPayload, requestedTone);
      
      // If we have drift data, send it to the feedback engine
      if (result.metadata?.emotionalDriftDiffLog) {
        await driftFeedbackEngine.processDriftData(
          {
            snapshotId: `snapshot-${Date.now()}`,
            outputHash: result.metadata.outputHash,
            emotionalDriftDiffLog: result.metadata.emotionalDriftDiffLog
          },
          {
            sessionId: outputPayload.sessionId,
            promptId: outputPayload.traceId,
            agentLineage: outputPayload.metadata.agentLineage,
            trustScore: outputPayload.trustScore
          }
        );
      }
      
      return result;
    };
  }

  static async enhancePromptEvolutionManager(
    promptEvolutionManager: PromptEvolutionManager,
    driftFeedbackEngine: EmotionalDriftFeedbackEngine
  ): Promise<void> {
    // Enhance analyzeFeedback method to use drift patterns
    const originalAnalyzeFeedback = promptEvolutionManager['analyzeFeedback'].bind(promptEvolutionManager);
    
    promptEvolutionManager['analyzeFeedback'] = function(prompt: any, feedback: any) {
      const originalChanges = originalAnalyzeFeedback(prompt, feedback);
      
      // Add drift-based changes if we have drift pattern data
      if (feedback.driftPattern) {
        const driftChanges = DriftFeedbackIntegrationHelper.generateDriftBasedChanges(feedback.driftPattern);
        return [...originalChanges, ...driftChanges];
      }
      
      return originalChanges;
    };
  }

  private static generateDriftBasedChanges(driftPattern: EmotionalDriftPattern): any[] {
    const changes = [];
    
    // Add tone stability improvements
    if (driftPattern.aggregatedMetrics.avgDriftScore > 0.5) {
      changes.push({
        type: 'tone_guidance_enhancement',
        description: 'Add explicit tone guidance to reduce drift',
        impact: 'medium',
        confidence: 0.8
      });
    }
    
    // Add emotional anchoring
    if (driftPattern.aggregatedMetrics.correctionFrequency > 0.4) {
      changes.push({
        type: 'emotional_anchoring',
        description: 'Add emotional stability anchors to prompt',
        impact: 'high',
        confidence: 0.75
      });
    }
    
    return changes;
  }
}

export default EmotionalDriftFeedbackEngine; 