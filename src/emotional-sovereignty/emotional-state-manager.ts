/**
 * EmotionalStateManager Class
 * 
 * Provides core emotional state tracking, persistence, and transition management
 * for the emotional sovereignty system.
 * 
 * This class is responsible for managing emotional states, tracking transitions
 * between states, and ensuring emotional continuity across sessions.
 */
export class EmotionalStateManager {
  private currentState: EmotionalState;
  private stateHistory: EmotionalStateTransition[] = [];
  private sessionId: string;
  private userId: string | null = null;
  
  constructor(initialState?: Partial<EmotionalState>) {
    this.sessionId = this.generateSessionId();
    this.currentState = {
      primaryEmotion: 'neutral',
      intensity: 0.5,
      valence: 0,
      arousal: 0,
      trustScore: 0.9,
      timestamp: Date.now(),
      ...initialState
    };
  }
  
  /**
   * Generates a unique session identifier
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
  
  /**
   * Sets user identifier for cross-session tracking
   * 
   * @param userId - Unique identifier for the user
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }
  
  /**
   * Updates the current emotional state
   * 
   * @param newState - New emotional state data
   * @returns The updated emotional state
   */
  updateState(newState: Partial<EmotionalState>): EmotionalState {
    const previousState = { ...this.currentState };
    
    // Calculate transition metrics
    const transition: EmotionalStateTransition = {
      from: previousState,
      to: {
        ...this.currentState,
        ...newState,
        timestamp: Date.now()
      },
      metrics: this.calculateTransitionMetrics(previousState, {
        ...this.currentState,
        ...newState
      })
    };
    
    // Update current state
    this.currentState = transition.to;
    
    // Record transition in history
    this.stateHistory.push(transition);
    
    return this.currentState;
  }
  
  /**
   * Calculates metrics for an emotional state transition
   * 
   * @param fromState - Starting emotional state
   * @param toState - Ending emotional state
   * @returns Transition metrics including velocity and naturalness
   */
  private calculateTransitionMetrics(
    fromState: EmotionalState,
    toState: EmotionalState
  ): TransitionMetrics {
    // Calculate time delta in seconds
    const timeDelta = (toState.timestamp - fromState.timestamp) / 1000;
    
    // Prevent division by zero
    if (timeDelta === 0) {
      return {
        velocityValence: 0,
        velocityArousal: 0,
        velocityIntensity: 0,
        velocityTrust: 0,
        naturalness: 1.0,
        jarring: false
      };
    }
    
    // Calculate velocities (change per second)
    const velocityValence = (toState.valence - fromState.valence) / timeDelta;
    const velocityArousal = (toState.arousal - fromState.arousal) / timeDelta;
    const velocityIntensity = (toState.intensity - fromState.intensity) / timeDelta;
    const velocityTrust = (toState.trustScore - fromState.trustScore) / timeDelta;
    
    // Calculate naturalness score based on emotion transition model
    const naturalness = this.calculateNaturalness(fromState, toState);
    
    // Determine if transition is jarring (unnatural)
    const jarring = naturalness < 0.6;
    
    return {
      velocityValence,
      velocityArousal,
      velocityIntensity,
      velocityTrust,
      naturalness,
      jarring
    };
  }
  
  /**
   * Calculates naturalness score for an emotional transition
   * 
   * @param fromState - Starting emotional state
   * @param toState - Ending emotional state
   * @returns Naturalness score (0-1) where 1 is completely natural
   */
  private calculateNaturalness(
    fromState: EmotionalState,
    toState: EmotionalState
  ): number {
    // This is a simplified model - a real implementation would use a more
    // sophisticated psychological model of emotional transitions
    
    // Define natural emotional transitions
    const naturalTransitions: Record<string, string[]> = {
      'joy': ['neutral', 'excitement', 'gratitude', 'satisfaction', 'empathy'],
      'sadness': ['neutral', 'disappointment', 'concern', 'empathy', 'resignation'],
      'anger': ['neutral', 'frustration', 'disappointment', 'determination'],
      'fear': ['neutral', 'anxiety', 'concern', 'caution'],
      'neutral': ['joy', 'sadness', 'anger', 'fear', 'surprise', 'empathy', 'confusion']
      // Additional emotions would be defined here
    };
    
    // If transition is to same emotion, it's natural
    if (fromState.primaryEmotion === toState.primaryEmotion) {
      return 1.0;
    }
    
    // Check if transition follows natural path
    const naturalPaths = naturalTransitions[fromState.primaryEmotion] || [];
    if (naturalPaths.includes(toState.primaryEmotion)) {
      return 0.9;
    }
    
    // Calculate intensity difference
    const intensityDiff = Math.abs(toState.intensity - fromState.intensity);
    
    // Large intensity jumps reduce naturalness
    if (intensityDiff > 0.5) {
      return 0.5;
    }
    
    // Default moderate naturalness for unmapped transitions
    return 0.7;
  }
  
  /**
   * Gets the current emotional state
   * 
   * @returns Current emotional state
   */
  getCurrentState(): EmotionalState {
    return { ...this.currentState };
  }
  
  /**
   * Gets emotional state history
   * 
   * @param limit - Optional limit on number of history items
   * @returns Array of state transitions
   */
  getStateHistory(limit?: number): EmotionalStateTransition[] {
    if (limit) {
      return this.stateHistory.slice(-limit);
    }
    return [...this.stateHistory];
  }
  
  /**
   * Analyzes emotional trajectory
   * 
   * @param window - Number of transitions to analyze
   * @returns Trajectory analysis
   */
  analyzeTrajectory(window: number = 5): TrajectoryAnalysis {
    const recentHistory = this.getStateHistory(window);
    
    if (recentHistory.length < 2) {
      return {
        direction: 'stable',
        trustTrend: 'stable',
        volatility: 0,
        predictedNextEmotion: this.currentState.primaryEmotion
      };
    }
    
    // Calculate average velocities
    let totalValenceVelocity = 0;
    let totalArousalVelocity = 0;
    let totalTrustVelocity = 0;
    let totalNaturalness = 0;
    
    for (const transition of recentHistory) {
      totalValenceVelocity += transition.metrics.velocityValence;
      totalArousalVelocity += transition.metrics.velocityArousal;
      totalTrustVelocity += transition.metrics.velocityTrust;
      totalNaturalness += transition.metrics.naturalness;
    }
    
    const avgValenceVelocity = totalValenceVelocity / recentHistory.length;
    const avgArousalVelocity = totalArousalVelocity / recentHistory.length;
    const avgTrustVelocity = totalTrustVelocity / recentHistory.length;
    const avgNaturalness = totalNaturalness / recentHistory.length;
    
    // Determine trajectory direction
    let direction: TrajectoryDirection;
    if (Math.abs(avgValenceVelocity) < 0.05 && Math.abs(avgArousalVelocity) < 0.05) {
      direction = 'stable';
    } else if (avgValenceVelocity > 0) {
      direction = avgArousalVelocity > 0 ? 'ascending' : 'mixed';
    } else {
      direction = avgArousalVelocity < 0 ? 'descending' : 'mixed';
    }
    
    // Determine trust trend
    let trustTrend: TrustTrend;
    if (Math.abs(avgTrustVelocity) < 0.01) {
      trustTrend = 'stable';
    } else if (avgTrustVelocity > 0) {
      trustTrend = 'improving';
    } else {
      trustTrend = 'declining';
    }
    
    // Calculate volatility
    const volatility = this.calculateVolatility(recentHistory);
    
    // Predict next emotion
    const predictedNextEmotion = this.predictNextEmotion(recentHistory);
    
    return {
      direction,
      trustTrend,
      volatility,
      predictedNextEmotion,
      avgValenceVelocity,
      avgArousalVelocity,
      avgTrustVelocity,
      avgNaturalness
    };
  }
  
  /**
   * Calculates emotional volatility from history
   * 
   * @param history - Emotional state transition history
   * @returns Volatility score (0-1)
   */
  private calculateVolatility(history: EmotionalStateTransition[]): number {
    if (history.length < 2) {
      return 0;
    }
    
    // Count direction changes
    let directionChanges = 0;
    let previousValenceDirection = Math.sign(history[0].metrics.velocityValence);
    let previousArousalDirection = Math.sign(history[0].metrics.velocityArousal);
    
    for (let i = 1; i < history.length; i++) {
      const currentValenceDirection = Math.sign(history[i].metrics.velocityValence);
      const currentArousalDirection = Math.sign(history[i].metrics.velocityArousal);
      
      if (currentValenceDirection !== previousValenceDirection && currentValenceDirection !== 0) {
        directionChanges++;
      }
      
      if (currentArousalDirection !== previousArousalDirection && currentArousalDirection !== 0) {
        directionChanges++;
      }
      
      previousValenceDirection = currentValenceDirection;
      previousArousalDirection = currentArousalDirection;
    }
    
    // Calculate average intensity change
    let totalIntensityChange = 0;
    for (const transition of history) {
      totalIntensityChange += Math.abs(
        transition.to.intensity - transition.from.intensity
      );
    }
    
    const avgIntensityChange = totalIntensityChange / history.length;
    
    // Count jarring transitions
    const jarringTransitions = history.filter(t => t.metrics.jarring).length;
    
    // Combine factors into volatility score
    const directionChangeWeight = 0.4;
    const intensityChangeWeight = 0.3;
    const jarringTransitionWeight = 0.3;
    
    const normalizedDirectionChanges = Math.min(directionChanges / (history.length * 2), 1);
    const normalizedIntensityChange = Math.min(avgIntensityChange * 3, 1);
    const normalizedJarringTransitions = jarringTransitions / history.length;
    
    return (
      normalizedDirectionChanges * directionChangeWeight +
      normalizedIntensityChange * intensityChangeWeight +
      normalizedJarringTransitions * jarringTransitionWeight
    );
  }
  
  /**
   * Predicts the next emotional state based on history
   * 
   * @param history - Emotional state transition history
   * @returns Predicted next primary emotion
   */
  private predictNextEmotion(history: EmotionalStateTransition[]): string {
    if (history.length === 0) {
      return this.currentState.primaryEmotion;
    }
    
    // Simple prediction based on current trajectory
    // In a real implementation, this would use a more sophisticated
    // predictive model based on emotional psychology
    
    const currentEmotion = this.currentState.primaryEmotion;
    const trajectory = this.analyzeTrajectory(history.length);
    
    // If stable, predict same emotion
    if (trajectory.direction === 'stable') {
      return currentEmotion;
    }
    
    // Simplified emotion progression model
    const emotionalProgressions: Record<string, Record<string, string>> = {
      'ascending': {
        'neutral': 'joy',
        'joy': 'excitement',
        'sadness': 'neutral',
        'anger': 'determination',
        'fear': 'concern'
      },
      'descending': {
        'neutral': 'sadness',
        'joy': 'neutral',
        'excitement': 'joy',
        'concern': 'fear',
        'determination': 'neutral'
      }
    };
    
    // Return predicted emotion based on trajectory or default to current
    return emotionalProgressions[trajectory.direction]?.[currentEmotion] || currentEmotion;
  }
  
  /**
   * Persists emotional state for cross-session continuity
   * 
   * @returns Success status of the persistence operation
   */
  persistState(): boolean {
    // In a real implementation, this would save state to a database
    // or other persistent storage
    
    // For this example, we'll simulate successful persistence
    return true;
  }
  
  /**
   * Restores emotional state from previous session
   * 
   * @param userId - User identifier for retrieving previous state
   * @returns Whether restoration was successful
   */
  restoreState(userId: string): boolean {
    // In a real implementation, this would load state from a database
    // or other persistent storage
    
    this.userId = userId;
    
    // For this example, we'll simulate failed restoration
    return false;
  }
}

/**
 * Types for emotional state management
 */
export interface EmotionalState {
  primaryEmotion: string;
  intensity: number;
  valence: number;
  arousal: number;
  trustScore: number;
  timestamp: number;
  secondaryEmotions?: string[];
  culturalContext?: string;
}

export interface TransitionMetrics {
  velocityValence: number;
  velocityArousal: number;
  velocityIntensity: number;
  velocityTrust: number;
  naturalness: number;
  jarring: boolean;
}

export interface EmotionalStateTransition {
  from: EmotionalState;
  to: EmotionalState;
  metrics: TransitionMetrics;
}

export type TrajectoryDirection = 'ascending' | 'descending' | 'stable' | 'mixed' | 'volatile';
export type TrustTrend = 'improving' | 'declining' | 'stable';

export interface TrajectoryAnalysis {
  direction: TrajectoryDirection;
  trustTrend: TrustTrend;
  volatility: number;
  predictedNextEmotion: string;
  avgValenceVelocity?: number;
  avgArousalVelocity?: number;
  avgTrustVelocity?: number;
  avgNaturalness?: number;
} 