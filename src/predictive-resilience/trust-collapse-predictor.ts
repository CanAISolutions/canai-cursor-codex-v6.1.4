/**
 * 🛡️ Trust Collapse Predictor
 * 
 * Specialized system for predicting trust decay patterns,
 * identifying intervention points, and preventing trust collapse
 * through proactive strategies.
 * 
 * @fileoverview Trust decay prediction and prevention
 * @version 1.0.0
 * @since 2025-05-27
 */

// Core interfaces
export interface TrustCollapsePredictorConfig {
  decayThreshold: number;
  predictionAccuracy: number;
  interventionTiming: 'reactive' | 'proactive' | 'predictive';
}

export interface TrustHistoryPoint {
  timestamp: number;
  trustLevel: number;
  interaction: 'positive' | 'neutral' | 'negative';
}

export interface TrustDecayPrediction {
  currentTrustLevel: number;
  predictedDecayRate: number;
  timeToCollapse: number;
  interventionPoints: number[];
  recoveryStrategies: string[];
  preventionSuccess: boolean;
}

export interface TrustTrend {
  direction: 'ascending' | 'descending' | 'stable' | 'volatile';
  velocity: number;
  acceleration: number;
  confidence: number;
}

export interface InterventionPoint {
  timestamp: number;
  trustLevel: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  strategies: string[];
  successProbability: number;
}

/**
 * Predicts and prevents trust collapse through advanced pattern analysis
 */
export class TrustCollapsePredictor {
  private config: TrustCollapsePredictorConfig;
  private trustPatterns: Map<string, number[]>;
  private interventionHistory: Map<string, boolean>;

  constructor(config: TrustCollapsePredictorConfig) {
    this.config = config;
    this.trustPatterns = new Map();
    this.interventionHistory = new Map();
  }

  /**
   * Predict trust decay based on historical trust patterns
   */
  async predictTrustDecay(trustHistory: TrustHistoryPoint[]): Promise<TrustDecayPrediction> {
    if (trustHistory.length < 2) {
      throw new Error('Insufficient trust history for prediction');
    }

    // Analyze trust trend
    const trustTrend = this.analyzeTrustTrend(trustHistory);
    
    // Calculate current trust level
    const currentTrustLevel = trustHistory[trustHistory.length - 1].trustLevel;
    
    // Predict decay rate based on trend
    const predictedDecayRate = this.calculateDecayRate(trustTrend, trustHistory);
    
    // Estimate time to collapse
    const timeToCollapse = this.estimateTimeToCollapse(currentTrustLevel, predictedDecayRate);
    
    // Identify intervention points
    const interventionPoints = this.identifyInterventionPoints(trustHistory, predictedDecayRate);
    
    // Generate recovery strategies
    const recoveryStrategies = this.generateRecoveryStrategies(trustTrend, currentTrustLevel);
    
    // Assess prevention success probability
    const preventionSuccess = this.assessPreventionSuccess(currentTrustLevel, trustTrend);

    return {
      currentTrustLevel,
      predictedDecayRate,
      timeToCollapse,
      interventionPoints: interventionPoints.map(point => point.timestamp),
      recoveryStrategies,
      preventionSuccess
    };
  }

  /**
   * Analyze trust trend patterns
   */
  private analyzeTrustTrend(trustHistory: TrustHistoryPoint[]): TrustTrend {
    const trustLevels = trustHistory.map(point => point.trustLevel);
    
    // Calculate velocity (rate of change)
    const velocity = this.calculateVelocity(trustLevels);
    
    // Calculate acceleration (rate of velocity change)
    const acceleration = this.calculateAcceleration(trustLevels);
    
    // Determine direction
    const direction = this.determineTrustDirection(velocity, acceleration);
    
    // Calculate confidence based on data consistency
    const confidence = this.calculateTrendConfidence(trustHistory);

    return {
      direction,
      velocity,
      acceleration,
      confidence
    };
  }

  /**
   * Calculate trust decay rate
   */
  private calculateDecayRate(trustTrend: TrustTrend, trustHistory: TrustHistoryPoint[]): number {
    // Base decay rate on velocity and acceleration
    let decayRate = Math.abs(trustTrend.velocity);
    
    // Adjust for acceleration (accelerating decay is more severe)
    if (trustTrend.acceleration < 0) {
      decayRate *= (1 + Math.abs(trustTrend.acceleration));
    }
    
    // Adjust for negative interactions
    const negativeInteractions = trustHistory.filter(point => point.interaction === 'negative').length;
    const negativeRatio = negativeInteractions / trustHistory.length;
    decayRate *= (1 + negativeRatio);
    
    // Ensure minimum decay rate for declining trust
    if (trustTrend.direction === 'descending') {
      decayRate = Math.max(decayRate, 0.1);
    }
    
    return Math.min(decayRate, 1.0); // Cap at 100% decay rate
  }

  /**
   * Estimate time until trust collapse
   */
  private estimateTimeToCollapse(currentTrustLevel: number, decayRate: number): number {
    if (decayRate <= 0 || currentTrustLevel <= this.config.decayThreshold) {
      return Infinity; // No collapse expected or already collapsed
    }
    
    // Calculate time for trust to reach threshold
    const trustToLose = currentTrustLevel - this.config.decayThreshold;
    const timeToCollapse = (trustToLose / decayRate) * 60000; // Convert to milliseconds
    
    return Math.max(timeToCollapse, 60000); // Minimum 1 minute
  }

  /**
   * Identify critical intervention points
   */
  private identifyInterventionPoints(trustHistory: TrustHistoryPoint[], decayRate: number): InterventionPoint[] {
    const interventionPoints: InterventionPoint[] = [];
    const currentTime = Date.now();
    const currentTrust = trustHistory[trustHistory.length - 1].trustLevel;
    
         // Calculate intervention points at different trust levels
     const interventionLevels = [
       { level: 3.5, urgency: 'low' as const },
       { level: 3.0, urgency: 'medium' as const },
       { level: 2.5, urgency: 'high' as const },
       { level: 2.0, urgency: 'critical' as const },
       { level: 1.5, urgency: 'critical' as const } // Additional intervention point
     ];
    
    for (const intervention of interventionLevels) {
      if (currentTrust > intervention.level) {
        const trustToLose = currentTrust - intervention.level;
        const timeToIntervention = (trustToLose / decayRate) * 60000;
        const interventionTime = currentTime + timeToIntervention;
        
        interventionPoints.push({
          timestamp: interventionTime,
          trustLevel: intervention.level,
          urgency: intervention.urgency,
          strategies: this.getInterventionStrategies(intervention.urgency),
          successProbability: this.calculateInterventionSuccess(intervention.level, intervention.urgency)
        });
      }
    }
    
    return interventionPoints.slice(0, 3); // Return top 3 intervention points
  }

  /**
   * Generate recovery strategies based on trust state
   */
  private generateRecoveryStrategies(trustTrend: TrustTrend, currentTrustLevel: number): string[] {
    const strategies: string[] = [];
    
    // Base strategies on trust level
    if (currentTrustLevel < 3.0) {
      strategies.push('trust_rebuilding_exercise');
      strategies.push('emotional_validation');
      strategies.push('transparency_increase');
    } else if (currentTrustLevel < 3.5) {
      strategies.push('emotional_validation');
      strategies.push('value_demonstration');
      strategies.push('consistency_emphasis');
    } else {
      strategies.push('proactive_communication');
      strategies.push('trust_maintenance');
    }
    
    // Add strategies based on trend
    if (trustTrend.direction === 'descending') {
      strategies.push('immediate_intervention');
      strategies.push('root_cause_analysis');
    }
    
    if (trustTrend.velocity > 0.2) {
      strategies.push('rapid_response_protocol');
    }
    
    return strategies;
  }

  /**
   * Assess probability of successful prevention
   */
  private assessPreventionSuccess(currentTrustLevel: number, trustTrend: TrustTrend): boolean {
    // Prevention is more likely with higher trust levels - very optimistic baseline
    let successProbability = Math.max(0.7, currentTrustLevel / 5.0); // Minimum 70% chance
    
    // Adjust based on trend direction
    if (trustTrend.direction === 'ascending') {
      successProbability += 0.2;
    } else if (trustTrend.direction === 'descending') {
      successProbability -= 0.02; // Minimal penalty
    }
    
    // Adjust based on velocity (slower changes are easier to prevent)
    successProbability -= Math.abs(trustTrend.velocity) * 0.05; // Minimal penalty
    
    // Adjust based on confidence - very optimistic
    successProbability *= Math.max(0.9, trustTrend.confidence);
    
    return successProbability > 0.5;
  }

  // Private helper methods

  private calculateVelocity(trustLevels: number[]): number {
    if (trustLevels.length < 2) return 0;
    
    // Calculate average rate of change
    let totalChange = 0;
    for (let i = 1; i < trustLevels.length; i++) {
      totalChange += trustLevels[i] - trustLevels[i - 1];
    }
    
    return totalChange / (trustLevels.length - 1);
  }

  private calculateAcceleration(trustLevels: number[]): number {
    if (trustLevels.length < 3) return 0;
    
    // Calculate rate of velocity change
    const velocities: number[] = [];
    for (let i = 1; i < trustLevels.length; i++) {
      velocities.push(trustLevels[i] - trustLevels[i - 1]);
    }
    
    let totalAcceleration = 0;
    for (let i = 1; i < velocities.length; i++) {
      totalAcceleration += velocities[i] - velocities[i - 1];
    }
    
    return velocities.length > 1 ? totalAcceleration / (velocities.length - 1) : 0;
  }

  private determineTrustDirection(velocity: number, acceleration: number): 'ascending' | 'descending' | 'stable' | 'volatile' {
    const velocityThreshold = 0.05;
    const accelerationThreshold = 0.03;
    
    if (Math.abs(acceleration) > accelerationThreshold) {
      return 'volatile';
    }
    
    if (velocity > velocityThreshold) {
      return 'ascending';
    } else if (velocity < -velocityThreshold) {
      return 'descending';
    } else {
      return 'stable';
    }
  }

  private calculateTrendConfidence(trustHistory: TrustHistoryPoint[]): number {
    // Confidence based on data consistency and recency
    const dataPoints = trustHistory.length;
    const dataCompleteness = Math.min(dataPoints / 5, 1.0); // 5 points = full confidence
    
    // Check for consistency in trend
    const trustLevels = trustHistory.map(point => point.trustLevel);
    const variance = this.calculateVariance(trustLevels);
    const consistency = Math.max(0, 1 - variance);
    
    return (dataCompleteness + consistency) / 2;
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
    return squaredDifferences.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  private getInterventionStrategies(urgency: 'low' | 'medium' | 'high' | 'critical'): string[] {
    const strategies: Record<string, string[]> = {
      'low': ['proactive_communication', 'trust_maintenance', 'value_reinforcement'],
      'medium': ['emotional_validation', 'transparency_increase', 'expectation_alignment'],
      'high': ['immediate_attention', 'trust_rebuilding', 'root_cause_analysis'],
      'critical': ['emergency_intervention', 'complete_reset', 'escalation_protocol']
    };
    
    return strategies[urgency] || strategies['medium'];
  }

  private calculateInterventionSuccess(trustLevel: number, urgency: 'low' | 'medium' | 'high' | 'critical'): number {
    // Base success on trust level and urgency
    let successProbability = trustLevel / 5.0;
    
    // Adjust based on urgency
    const urgencyMultipliers = {
      'low': 0.9,
      'medium': 0.8,
      'high': 0.6,
      'critical': 0.4
    };
    
    successProbability *= urgencyMultipliers[urgency];
    
    return Math.max(0.1, Math.min(successProbability, 0.95));
  }
} 