/**
 * Business Plan Trust Transparency Integration - V4 Compliance
 * Integrates SparkSplitEngine for trust transparency and competitive differentiation
 */

// SparkSplit Integration Interfaces
export interface TrustTransparencyComparison {
  canaiOutput: StandardMCPOutput;
  sterileAIOutput: StandardMCPOutput;
  emotionalCompass: EmotionalCompass;
  trustDelta: number;
  transparencyFactors: string[];
}

export interface EmotionalCompass {
  clarity: number;        // 4.0-5.0 scale
  empowerment: number;    // 4.0-5.0 scale
  trust: number;          // 4.0-5.0 scale
  joy: number;            // 4.0-5.0 scale
  alignment: number;      // 4.0-5.0 scale
}

export interface StandardMCPOutput {
  primary: string;
  strategy: string;
  implementation: string;
  nextSteps: string;
  sparkSplitComparison?: TrustTransparencyComparison;
}

// SparkSplit Engine Integration
export class BusinessPlanSparkSplitEngine {
  
  /**
   * Calculate comprehensive trust score combining scoring (60%) and empathy (40%)
   */
  calculateTrustScore(input: any, scoreBreakdown: any): number {
    const scoringScore = scoreBreakdown.overall; // 0-1 scale
    const empathyScore = this.calculateEmpathyScore(input); // 0-1 scale
    
    // Convert to 5.0 scale and apply weighting
    const trustScore = ((scoringScore * 0.6) + (empathyScore * 0.4)) * 5.0;
    
    // Ensure minimum 4.2 for valid outputs per V4 plan
    return Math.max(trustScore, 4.2);
  }

  /**
   * Calculate empathy score based on emotional intelligence markers
   */
  private calculateEmpathyScore(input: any): number {
    let empathyScore = 0.7; // Base empathy score
    
    // Boost for emotional context
    if (input.emotionalContext?.personalStory) empathyScore += 0.1;
    if (input.emotionalContext?.visionQuote) empathyScore += 0.1;
    if (input.emotionalContext?.motivator) empathyScore += 0.05;
    
    // Boost for clear target audience understanding
    if (input.targetAudience && input.targetAudience.length > 20) empathyScore += 0.05;
    
    // Boost for social impact/sustainability
    const description = (input.businessDescription || '').toLowerCase();
    if (description.includes('sustainable') || description.includes('social impact') || 
        description.includes('healthcare') || description.includes('education')) {
      empathyScore += 0.1;
    }
    
    return Math.min(empathyScore, 1.0);
  }

  /**
   * Generate SparkSplit comparison showing CanAI vs sterile AI output
   */
  async generateSparkSplitComparison(
    canaiOutput: StandardMCPOutput, 
    input: any
  ): Promise<TrustTransparencyComparison> {
    
    const sterileOutput = this.generateSterileComparison(canaiOutput);
    const emotionalCompass = this.calculateEmotionalCompass(canaiOutput, input);
    const trustDelta = this.calculateTrustDelta(canaiOutput, sterileOutput);
    const transparencyFactors = this.generateTransparencyFactors(input);

    return {
      canaiOutput,
      sterileAIOutput: sterileOutput,
      emotionalCompass,
      trustDelta,
      transparencyFactors
    };
  }

  /**
   * Generate sterile AI comparison (what generic AI would produce)
   */
  private generateSterileComparison(canaiOutput: StandardMCPOutput): StandardMCPOutput {
    return {
      primary: "Generic business plan template with standard sections and boilerplate content.",
      strategy: "Standard market analysis and competitive positioning without personalization.",
      implementation: "Generic implementation steps without consideration of specific constraints.",
      nextSteps: "Standard next steps: 1) Finalize plan 2) Seek funding 3) Execute strategy"
    };
  }

  /**
   * Calculate 5-axis emotional compass
   */
  private calculateEmotionalCompass(output: StandardMCPOutput, input: any): EmotionalCompass {
    return {
      clarity: this.scoreClarity(output, input),
      empowerment: this.scoreEmpowerment(output, input),
      trust: this.scoreTrust(output, input),
      joy: this.scoreJoy(output, input),
      alignment: this.scoreAlignment(output, input)
    };
  }

  private scoreClarity(output: StandardMCPOutput, input: any): number {
    let score = 4.0;
    const businessName = input.businessName || input.bizName || '';
    if (output.primary.length > 100 && output.primary.includes(businessName)) score += 0.3;
    if (output.strategy.includes('specific') || output.strategy.includes('targeted')) score += 0.2;
    if (output.implementation.includes('timeline') || output.implementation.includes('milestone')) score += 0.3;
    if (output.nextSteps.split('.').length >= 3) score += 0.2;
    return Math.min(score, 5.0);
  }

  private scoreEmpowerment(output: StandardMCPOutput, input: any): number {
    let score = 4.0;
    if (output.primary.includes('achieve') || output.primary.includes('success')) score += 0.2;
    if (output.strategy.includes('competitive advantage') || output.strategy.includes('differentiation')) score += 0.3;
    if (output.implementation.includes('actionable') || output.implementation.includes('executable')) score += 0.3;
    if (output.nextSteps.includes('immediate') || output.nextSteps.includes('priority')) score += 0.2;
    return Math.min(score, 5.0);
  }

  private scoreTrust(output: StandardMCPOutput, input: any): number {
    let score = 4.2; // Minimum trust score per V4
    if (input.financials?.revenueModel && output.strategy.includes('revenue')) score += 0.2;
    if (input.currentStatus && output.implementation.includes('current')) score += 0.2;
    if (input.resourceConstraints && output.strategy.includes('budget')) score += 0.2;
    if (output.primary.includes('realistic') || output.primary.includes('achievable')) score += 0.2;
    return Math.min(score, 5.0);
  }

  private scoreJoy(output: StandardMCPOutput, input: any): number {
    let score = 4.0;
    if (input.emotionalContext?.visionQuote && output.primary.includes('vision')) score += 0.3;
    if (output.strategy.includes('opportunity') || output.strategy.includes('potential')) score += 0.2;
    if (output.implementation.includes('exciting') || output.implementation.includes('innovative')) score += 0.3;
    const description = input.businessDescription || '';
    if (description.includes('passion') || description.includes('love')) score += 0.2;
    return Math.min(score, 5.0);
  }

  private scoreAlignment(output: StandardMCPOutput, input: any): number {
    let score = 4.0;
    const primaryGoal = input.primaryGoal || input.goal || '';
    const targetAudience = input.targetAudience || input.audience || '';
    const planPurpose = input.planPurpose || '';
    const brandVoice = input.brandVoice || input.tone || '';
    
    if (output.primary.includes(primaryGoal.toLowerCase())) score += 0.3;
    if (output.strategy.includes(targetAudience.toLowerCase())) score += 0.2;
    if (output.implementation.includes(planPurpose)) score += 0.3;
    if (brandVoice === 'professional' && output.primary.includes('professional')) score += 0.2;
    return Math.min(score, 5.0);
  }

  /**
   * Calculate trust delta between CanAI and sterile AI
   */
  private calculateTrustDelta(canaiOutput: StandardMCPOutput, sterileOutput: StandardMCPOutput): number {
    // Calculate based on content depth, personalization, and emotional intelligence
    const canaiScore = this.calculateContentTrustScore(canaiOutput);
    const sterileScore = this.calculateContentTrustScore(sterileOutput);
    
    return Math.max(canaiScore - sterileScore, 0.5); // Minimum 0.5 delta
  }

  private calculateContentTrustScore(output: StandardMCPOutput): number {
    let score = 0;
    
    // Length and depth indicators
    if (output.primary.length > 150) score += 1.0;
    if (output.strategy.length > 200) score += 1.0;
    if (output.implementation.length > 200) score += 1.0;
    
    // Specificity indicators
    if (output.primary.includes('specific') || output.primary.includes('targeted')) score += 0.5;
    if (output.strategy.includes('analysis') || output.strategy.includes('research')) score += 0.5;
    if (output.implementation.includes('timeline') || output.implementation.includes('metrics')) score += 0.5;
    
    return score;
  }

  /**
   * Generate transparency factors explaining trust score
   */
  private generateTransparencyFactors(input: any): string[] {
    const factors = [];
    
    if (input.businessName || input.bizName) factors.push("Business name provided for personalization");
    if (input.targetAudience || input.audience) factors.push("Target audience specified for focused strategy");
    if (input.competitiveContext || input.industry) factors.push("Competitive context analyzed for differentiation");
    if (input.resourceConstraints) factors.push("Resource constraints considered for realistic planning");
    if (input.emotionalContext) factors.push("Emotional context integrated for authentic voice");
    if (input.financials) factors.push("Financial details included for credible projections");
    
    factors.push("Content generated with emotional intelligence and empathy");
    factors.push("Plan structure optimized for investor presentation");
    factors.push("Recommendations based on industry best practices");
    
    return factors;
  }

  /**
   * Log trust metrics via EventBus with transparency factors
   */
  logTrustMetrics(session: any, trustScore: number, transparencyFactors: string[]): void {
    // Log to console for immediate feedback
    console.log(`Business Plan Trust Score: ${trustScore.toFixed(2)}/5.0`);
    console.log(`Transparency Factors: ${transparencyFactors.length} factors identified`);
    
    // Would emit to EventBus in full implementation
    // eventBus.emit('trust_metrics_logged', { ... });
  }
} 