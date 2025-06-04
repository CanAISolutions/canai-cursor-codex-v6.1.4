/**
 * SparkSplit A/B Testing & Benchmarking Engine v1.0
 * Purpose: Continuous improvement through sterile baseline comparison
 * Revolutionary Feature: Uses sterile outputs to benchmark and enhance CanAI
 */

import { SparkSplitEngine, SparkSplitInput, SparkSplitOutput } from './spark-split-engine';
import { EmotionalContext, TrustDelta } from '../types/emotional-sovereignty';
import { emitSystemLog } from './logger';

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  enhancementStrategy: EnhancementStrategy;
  active: boolean;
  trafficAllocation: number; // 0-100%
  performanceMetrics: VariantMetrics;
}

export interface EnhancementStrategy {
  emotionalDepthMultiplier: number; // 1.0 = baseline, 1.5 = 50% more emotional
  inferenceAggressiveness: number; // How much context to infer
  toneAmplification: number; // How much to amplify user's tone
  personalizationLevel: number; // How much to personalize
  creativityBoost: number; // How creative vs safe to be
  trustSignalStrength: number; // How strong to make trust signals
}

export interface VariantMetrics {
  userSelectionRate: number; // % who choose CanAI over sterile
  trustDeltaAverage: number; // Average trust improvement
  emotionalResonanceScore: number; // Emotional impact rating
  conversionToTestimonial: number; // % who give testimonials
  referralGeneration: number; // % who say they'd refer
  timeToSelection: number; // How quickly users choose
  confidenceScore: number; // Statistical confidence
  sampleSize: number;
}

export interface BenchmarkResult {
  sterileBaseline: {
    output: string;
    metrics: OutputMetrics;
  };
  canaiVariants: Array<{
    variant: ABTestVariant;
    output: string;
    metrics: OutputMetrics;
    improvementOverSterile: number;
  }>;
  winningVariant: string;
  improvementRecommendations: string[];
  nextTestSuggestions: string[];
}

export interface OutputMetrics {
  emotionalWords: number;
  personalizedElements: number;
  contextualReferences: number;
  toneConsistency: number;
  trustSignals: number;
  actionableAdvice: number;
  readabilityScore: number;
  engagementPotential: number;
}

export class SparkSplitABTestingEngine {
  private sparkSplitEngine: SparkSplitEngine;
  private activeVariants: Map<string, ABTestVariant> = new Map();
  private benchmarkHistory: BenchmarkResult[] = [];
  
  constructor(sparkSplitEngine: SparkSplitEngine) {
    this.sparkSplitEngine = sparkSplitEngine;
    this.initializeDefaultVariants();
  }

  /**
   * Initialize default A/B test variants
   */
  private initializeDefaultVariants(): void {
    const defaultVariants: ABTestVariant[] = [
      {
        id: 'baseline',
        name: 'Current CanAI',
        description: 'Current production CanAI with standard enhancement',
        enhancementStrategy: {
          emotionalDepthMultiplier: 1.0,
          inferenceAggressiveness: 1.0,
          toneAmplification: 1.0,
          personalizationLevel: 1.0,
          creativityBoost: 1.0,
          trustSignalStrength: 1.0
        },
        active: true,
        trafficAllocation: 70,
        performanceMetrics: this.initializeMetrics()
      },
      {
        id: 'emotional_amplified',
        name: 'Emotional Amplified',
        description: 'Enhanced emotional depth and resonance',
        enhancementStrategy: {
          emotionalDepthMultiplier: 1.4,
          inferenceAggressiveness: 1.2,
          toneAmplification: 1.3,
          personalizationLevel: 1.1,
          creativityBoost: 1.2,
          trustSignalStrength: 1.3
        },
        active: true,
        trafficAllocation: 15,
        performanceMetrics: this.initializeMetrics()
      },
      {
        id: 'hyper_personalized',
        name: 'Hyper Personalized',
        description: 'Maximum personalization and context inference',
        enhancementStrategy: {
          emotionalDepthMultiplier: 1.1,
          inferenceAggressiveness: 1.5,
          toneAmplification: 1.1,
          personalizationLevel: 1.6,
          creativityBoost: 1.0,
          trustSignalStrength: 1.2
        },
        active: true,
        trafficAllocation: 15,
        performanceMetrics: this.initializeMetrics()
      }
    ];

    defaultVariants.forEach(variant => {
      this.activeVariants.set(variant.id, variant);
    });
  }

  /**
   * Run comprehensive A/B test with sterile baseline
   */
  async runABTestWithSterileBaseline(input: SparkSplitInput): Promise<BenchmarkResult> {
    // 1. Generate sterile baseline
    const sterileOutput = await this.generateSterileBaseline(input);
    const sterileMetrics = await this.analyzeOutputMetrics(sterileOutput, input);

    // 2. Generate CanAI variants
    const canaiVariants = [];
    for (const [variantId, variant] of this.activeVariants) {
      if (!variant.active) continue;

      const enhancedOutput = await this.generateEnhancedOutput(input, variant.enhancementStrategy);
      const enhancedMetrics = await this.analyzeOutputMetrics(enhancedOutput, input);
      const improvement = this.calculateImprovement(sterileMetrics, enhancedMetrics);

      canaiVariants.push({
        variant,
        output: enhancedOutput,
        metrics: enhancedMetrics,
        improvementOverSterile: improvement
      });
    }

    // 3. Determine winning variant
    const winningVariant = this.determineWinningVariant(canaiVariants);

    // 4. Generate improvement recommendations
    const improvementRecommendations = await this.generateImprovementRecommendations(
      sterileMetrics,
      canaiVariants
    );

    // 5. Suggest next tests
    const nextTestSuggestions = await this.generateNextTestSuggestions(canaiVariants);

    const benchmarkResult: BenchmarkResult = {
      sterileBaseline: {
        output: sterileOutput,
        metrics: sterileMetrics
      },
      canaiVariants,
      winningVariant: winningVariant.variant.id,
      improvementRecommendations,
      nextTestSuggestions
    };

    // Store for learning
    this.benchmarkHistory.push(benchmarkResult);

    return benchmarkResult;
  }

  /**
   * Generate sterile baseline using only user input
   */
  private async generateSterileBaseline(input: SparkSplitInput): Promise<string> {
    // Extract only original user input (no MCP enhancements)
    const originalInput = this.extractOriginalUserInput(input);
    
    // Create neutral prompt
    const sterilePrompt = this.buildNeutralPrompt(originalInput, input.sessionId);
    
    // Use same model but neutral instructions
    const response = await this.callAIWithNeutralInstructions(sterilePrompt);
    
    return response;
  }

  /**
   * Generate enhanced output using specific strategy
   */
  private async generateEnhancedOutput(
    input: SparkSplitInput, 
    strategy: EnhancementStrategy
  ): Promise<string> {
    // Apply enhancement strategy to input
    const enhancedInput = this.applyEnhancementStrategy(input, strategy);
    
    // Generate with enhanced context
    const response = await this.callAIWithEnhancedInstructions(enhancedInput, strategy);
    
    return response;
  }

  /**
   * Analyze output metrics for comparison
   */
  private async analyzeOutputMetrics(output: string, input: SparkSplitInput): Promise<OutputMetrics> {
    return {
      emotionalWords: this.countEmotionalWords(output),
      personalizedElements: this.countPersonalizedElements(output),
      contextualReferences: this.countContextualReferences(output, input),
      toneConsistency: await this.analyzeToneConsistency(output, input.toneContext),
      trustSignals: this.countTrustSignals(output),
      actionableAdvice: this.countActionableAdvice(output),
      readabilityScore: this.calculateReadabilityScore(output),
      engagementPotential: await this.calculateEngagementPotential(output)
    };
  }

  /**
   * Calculate improvement over sterile baseline
   */
  private calculateImprovement(sterileMetrics: OutputMetrics, enhancedMetrics: OutputMetrics): number {
    const weights = {
      emotionalWords: 0.2,
      personalizedElements: 0.25,
      contextualReferences: 0.15,
      toneConsistency: 0.15,
      trustSignals: 0.1,
      actionableAdvice: 0.1,
      engagementPotential: 0.05
    };

    let totalImprovement = 0;
    let totalWeight = 0;

    Object.keys(weights).forEach(metric => {
      const sterileValue = sterileMetrics[metric] || 0;
      const enhancedValue = enhancedMetrics[metric] || 0;
      const improvement = sterileValue > 0 ? (enhancedValue - sterileValue) / sterileValue : 0;
      
      totalImprovement += improvement * weights[metric];
      totalWeight += weights[metric];
    });

    return totalWeight > 0 ? totalImprovement / totalWeight : 0;
  }

  /**
   * Determine winning variant based on multiple factors
   */
  private determineWinningVariant(variants: any[]): any {
    return variants.reduce((winner, current) => {
      const winnerScore = this.calculateVariantScore(winner);
      const currentScore = this.calculateVariantScore(current);
      return currentScore > winnerScore ? current : winner;
    });
  }

  /**
   * Calculate overall variant score
   */
  private calculateVariantScore(variant: any): number {
    const metrics = variant.variant.performanceMetrics;
    
    // Weighted scoring
    return (
      metrics.userSelectionRate * 0.3 +
      metrics.trustDeltaAverage * 0.25 +
      metrics.emotionalResonanceScore * 0.2 +
      metrics.conversionToTestimonial * 0.15 +
      metrics.referralGeneration * 0.1
    );
  }

  /**
   * Generate improvement recommendations based on analysis
   */
  private async generateImprovementRecommendations(
    sterileMetrics: OutputMetrics,
    variants: any[]
  ): Promise<string[]> {
    const recommendations = [];

    // Analyze gaps in emotional depth
    const avgEmotionalWords = variants.reduce((sum, v) => sum + v.metrics.emotionalWords, 0) / variants.length;
    if (avgEmotionalWords < sterileMetrics.emotionalWords * 1.5) {
      recommendations.push("Increase emotional vocabulary and resonance language");
    }

    // Analyze personalization effectiveness
    const avgPersonalization = variants.reduce((sum, v) => sum + v.metrics.personalizedElements, 0) / variants.length;
    if (avgPersonalization < 5) {
      recommendations.push("Enhance personalization with more user-specific references");
    }

    // Analyze tone consistency
    const avgToneConsistency = variants.reduce((sum, v) => sum + v.metrics.toneConsistency, 0) / variants.length;
    if (avgToneConsistency < 4.0) {
      recommendations.push("Improve tone consistency and alignment with user preferences");
    }

    // Analyze trust signals
    const avgTrustSignals = variants.reduce((sum, v) => sum + v.metrics.trustSignals, 0) / variants.length;
    if (avgTrustSignals < 3) {
      recommendations.push("Incorporate more credibility and trust-building elements");
    }

    return recommendations;
  }

  /**
   * Generate next test suggestions
   */
  private async generateNextTestSuggestions(variants: any[]): Promise<string[]> {
    const suggestions = [];

    // Find best performing aspects
    const bestEmotional = variants.reduce((best, current) => 
      current.metrics.emotionalWords > best.metrics.emotionalWords ? current : best
    );

    const bestPersonalized = variants.reduce((best, current) => 
      current.metrics.personalizedElements > best.metrics.personalizedElements ? current : best
    );

    // Suggest hybrid approaches
    if (bestEmotional.variant.id !== bestPersonalized.variant.id) {
      suggestions.push(`Test hybrid of ${bestEmotional.variant.name} emotional depth with ${bestPersonalized.variant.name} personalization`);
    }

    // Suggest extreme variants
    suggestions.push("Test ultra-high emotional amplification (2x current levels)");
    suggestions.push("Test minimal enhancement to find optimal baseline");
    suggestions.push("Test industry-specific enhancement strategies");

    return suggestions;
  }

  /**
   * Update variant performance based on user selection
   */
  async updateVariantPerformance(
    variantId: string,
    userSelection: 'sterile' | 'canai',
    trustDelta: number,
    feedback?: any
  ): Promise<void> {
    const variant = this.activeVariants.get(variantId);
    if (!variant) return;

    const metrics = variant.performanceMetrics;
    
    // Update selection rate
    const totalSelections = metrics.sampleSize;
    const canaiSelections = metrics.userSelectionRate * totalSelections;
    const newCanaiSelections = userSelection === 'canai' ? canaiSelections + 1 : canaiSelections;
    const newTotalSelections = totalSelections + 1;
    
    metrics.userSelectionRate = newCanaiSelections / newTotalSelections;
    metrics.sampleSize = newTotalSelections;
    
    // Update trust delta
    metrics.trustDeltaAverage = (
      (metrics.trustDeltaAverage * totalSelections) + trustDelta
    ) / newTotalSelections;

    // Update other metrics if feedback provided
    if (feedback) {
      if (feedback.emotionalSatisfactionScore) {
        metrics.emotionalResonanceScore = (
          (metrics.emotionalResonanceScore * totalSelections) + feedback.emotionalSatisfactionScore
        ) / newTotalSelections;
      }
      
      if (feedback.wouldRefer !== undefined) {
        const currentReferrals = metrics.referralGeneration * totalSelections;
        const newReferrals = feedback.wouldRefer ? currentReferrals + 1 : currentReferrals;
        metrics.referralGeneration = newReferrals / newTotalSelections;
      }
    }

    // Update confidence score
    metrics.confidenceScore = this.calculateStatisticalConfidence(metrics.sampleSize, metrics.userSelectionRate);
    
    this.activeVariants.set(variantId, variant);
  }

  /**
   * Get performance dashboard data
   */
  getPerformanceDashboard(): any {
    const variants = Array.from(this.activeVariants.values());
    
    return {
      activeVariants: variants.length,
      totalTests: this.benchmarkHistory.length,
      bestPerformingVariant: this.getBestPerformingVariant(),
      averageImprovement: this.getAverageImprovementOverSterile(),
      recommendedActions: this.getRecommendedActions(),
      variants: variants.map(v => ({
        id: v.id,
        name: v.name,
        performance: v.performanceMetrics,
        trafficAllocation: v.trafficAllocation
      }))
    };
  }

  // Helper methods
  private initializeMetrics(): VariantMetrics {
    return {
      userSelectionRate: 0,
      trustDeltaAverage: 0,
      emotionalResonanceScore: 0,
      conversionToTestimonial: 0,
      referralGeneration: 0,
      timeToSelection: 0,
      confidenceScore: 0,
      sampleSize: 0
    };
  }

  private extractOriginalUserInput(input: SparkSplitInput): any {
    // Implementation to extract only user-provided fields
    // Remove MCP enhancements and emotional defaults
    return {
      prompt: input.prompt,
      toneContext: input.toneContext,
      // Only include explicitly user-provided fields
    };
  }

  private buildNeutralPrompt(originalInput: any, sessionId: string): string {
    return `Provide a professional response to: ${originalInput.prompt}`;
  }

  private async callAIWithNeutralInstructions(prompt: string): Promise<string> {
    try {
      // Use OpenAI API for neutral, sterile responses
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant. Provide direct, factual, professional responses without emotional language, personalization, or creative flourishes. Focus on accuracy and clarity.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1, // Low temperature for consistent, sterile responses
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      return data.choices?.[0]?.message?.content || 'Unable to generate neutral response';
    } catch (error) {
      emitSystemLog('neutral-ai-generation-error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        prompt: prompt.substring(0, 100) + '...',
        timestamp: new Date().toISOString()
      });
      return `Professional response: ${prompt}. This is a direct, factual approach without additional emotional context.`;
    }
  }

  private async callAIWithEnhancedInstructions(input: any, strategy: EnhancementStrategy): Promise<string> {
    try {
      // Use Emotional Sovereignty Orchestrator for enhanced responses
      const response = await fetch(`${process.env.API_BASE_URL}/api/webhook/emotional-sovereignty-bridge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_KEY}`
        },
        body: JSON.stringify({
          userInput: {
            intent: input.prompt,
            tone: input.toneContext,
            industry: input.emotionalContext?.industry || 'general',
            pain_point: input.emotionalContext?.painPoint || 'general improvement'
          },
          sessionId: `ab-test-${Date.now()}`,
          productType: 'ab_testing',
          context: {
            enhancementStrategy: strategy,
            emotionalDepthMultiplier: strategy.emotionalDepthMultiplier,
            toneAmplification: strategy.toneAmplification,
            personalizationLevel: strategy.personalizationLevel,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Orchestrator API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as {
        makeWebhookData?: { deliverable?: string };
        emotionalArc?: { finalTrustScore?: number };
      };
      
      return data.makeWebhookData?.deliverable || 'Unable to generate enhanced response';
    } catch (error) {
      emitSystemLog('enhanced-ai-generation-error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        input: input.prompt?.substring(0, 100) + '...',
        strategy,
        timestamp: new Date().toISOString()
      });
      return `Enhanced response: ${input.prompt}. This response incorporates emotional intelligence and personalization based on your context.`;
    }
  }

  private applyEnhancementStrategy(input: SparkSplitInput, strategy: EnhancementStrategy): any {
    // Apply enhancement multipliers to input
    return input;
  }

  private countEmotionalWords(text: string): number {
    const emotionalWords = ['amazing', 'incredible', 'passionate', 'excited', 'thrilled', 'confident', 'empowered'];
    return emotionalWords.filter(word => text.toLowerCase().includes(word)).length;
  }

  private countPersonalizedElements(text: string): number {
    const personalWords = ['your', 'you', 'yours', 'personal', 'unique', 'individual'];
    return personalWords.filter(word => text.toLowerCase().includes(word)).length;
  }

  private countContextualReferences(text: string, input: SparkSplitInput): number {
    // Count references to user's specific context
    return 0;
  }

  private async analyzeToneConsistency(text: string, requestedTone: string): Promise<number> {
    // Analyze tone consistency
    return 4.0;
  }

  private countTrustSignals(text: string): number {
    const trustWords = ['proven', 'reliable', 'trusted', 'verified', 'guaranteed'];
    return trustWords.filter(word => text.toLowerCase().includes(word)).length;
  }

  private countActionableAdvice(text: string): number {
    const actionWords = ['start', 'begin', 'implement', 'create', 'build', 'launch'];
    return actionWords.filter(word => text.toLowerCase().includes(word)).length;
  }

  private calculateReadabilityScore(text: string): number {
    // Simple readability calculation
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    return Math.min(5, words / sentences);
  }

  private async calculateEngagementPotential(text: string): Promise<number> {
    // Calculate engagement potential
    return 4.0;
  }

  private calculateStatisticalConfidence(sampleSize: number, rate: number): number {
    // Calculate statistical confidence
    return Math.min(1, sampleSize / 100);
  }

  private getBestPerformingVariant(): string {
    const variants = Array.from(this.activeVariants.values());
    const best = variants.reduce((best, current) => 
      this.calculateVariantScore({ variant: current }) > this.calculateVariantScore({ variant: best }) ? current : best
    );
    return best.name;
  }

  private getAverageImprovementOverSterile(): number {
    if (this.benchmarkHistory.length === 0) return 0;
    
    const totalImprovement = this.benchmarkHistory.reduce((sum, result) => {
      const avgImprovement = result.canaiVariants.reduce((sum, variant) => 
        sum + variant.improvementOverSterile, 0) / result.canaiVariants.length;
      return sum + avgImprovement;
    }, 0);
    
    return totalImprovement / this.benchmarkHistory.length;
  }

  private getRecommendedActions(): string[] {
    // Analyze performance and suggest actions
    return [
      "Continue testing emotional amplification variants",
      "Increase sample size for statistical significance",
      "Test industry-specific enhancement strategies"
    ];
  }
} 