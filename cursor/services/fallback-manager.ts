/**
 * FallbackManager Service
 * 
 * What: Manages fallback handling during system failures
 * Why: Ensures graceful degradation and recovery during network and other failures
 * How: Monitors events, triggers fallbacks, and manages recovery
 */

import { EventBus } from '../event-bus/eventBus';
import { NetworkEvent } from './network-monitor';

export interface FallbackState {
  active: boolean;
  reason: string;
  triggeredBy: string;
  timestamp: string;
  traceId: string;
  trustScore: number;
  affectedAgents: string[];
  recoveryAttempts: number;
  fallbackDepth: number; // Track cascading fallback depth
  agentId?: string; // Add agent isolation
}

export class FallbackManager {
  private static instance: FallbackManager;
  private eventBus: EventBus;
  private fallbackStates: Map<string, FallbackState> = new Map(); // Per-agent fallback states
  private globalFallbackState: FallbackState | null = null; // Legacy global state for backward compatibility
  private trustScoreFloor: number = 0.5; // Minimum trust score
  private initialTrustScore: number = 0.95; // Starting trust score
  private currentTrustScore: number = this.initialTrustScore;
  private maxFallbackDepth: number = 3; // Maximum allowed fallback depth
  
  private constructor() {
    this.eventBus = EventBus.getInstance();
    this.setupEventListeners();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): FallbackManager {
    if (!FallbackManager.instance) {
      FallbackManager.instance = new FallbackManager();
    }
    return FallbackManager.instance;
  }

  /**
   * Setup event listeners for network and other failures
   */
  private setupEventListeners(): void {
    // Network events
    this.eventBus.on('network:latency-spike', this.handleNetworkEvent.bind(this));
    this.eventBus.on('network:packet-loss', this.handleNetworkEvent.bind(this));
    this.eventBus.on('network:dns-failure', this.handleNetworkEvent.bind(this));
    this.eventBus.on('network:websocket-disconnect', this.handleNetworkEvent.bind(this));
    
    // Recovery events
    this.eventBus.on('network:latency-spike-recovery', this.handleRecoveryEvent.bind(this));
    this.eventBus.on('network:packet-loss-recovery', this.handleRecoveryEvent.bind(this));
    this.eventBus.on('network:dns-failure-recovery', this.handleRecoveryEvent.bind(this));
    this.eventBus.on('network:websocket-disconnect-recovery', this.handleRecoveryEvent.bind(this));
    this.eventBus.on('network:recovery-complete', this.handleCompleteRecovery.bind(this));
  }

  /**
   * Handle network failure events
   */
  private async handleNetworkEvent(event: NetworkEvent): Promise<void> {
    // Update trust score
    this.updateTrustScore(event.trustScoreImpact);
    
    // Create fallback state if not already in fallback
    if (!this.globalFallbackState) {
      this.globalFallbackState = {
        active: true,
        reason: event.event,
        triggeredBy: 'NetworkMonitor',
        timestamp: event.timestamp,
        traceId: event.traceId,
        trustScore: this.currentTrustScore,
        affectedAgents: [...event.affectedAgents],
        recoveryAttempts: 0,
        fallbackDepth: 1
      };
      
      // Emit fallback triggered event (for test compatibility)
      await this.eventBus.emit('fallback:triggered', {
        state: this.globalFallbackState,
        reason: event.event,
        affectedAgents: event.affectedAgents,
        traceId: event.traceId,
        trustScore: this.currentTrustScore,
        source: 'FallbackManager'
      }, 'FallbackManager');
      
      // Emit fallback activated event
      await this.eventBus.emit('fallback:activated', {
        state: this.globalFallbackState,
        source: 'FallbackManager'
      }, 'FallbackManager');
    } else {
      // Update existing fallback state
      this.globalFallbackState.affectedAgents = [...new Set([...this.globalFallbackState.affectedAgents, ...event.affectedAgents])];
      this.globalFallbackState.trustScore = this.currentTrustScore;
      this.globalFallbackState.fallbackDepth = Math.min(this.globalFallbackState.fallbackDepth + 1, this.maxFallbackDepth);
      
      // Emit fallback updated event
      await this.eventBus.emit('fallback:updated', {
        state: this.globalFallbackState,
        source: 'FallbackManager'
      }, 'FallbackManager');
    }
  }

  /**
   * Handle recovery events
   */
  private async handleRecoveryEvent(event: NetworkEvent): Promise<void> {
    if (!this.globalFallbackState) {
      return;
    }
    
    // Update trust score positively
    this.updateTrustScore(event.trustScoreImpact);
    
    // Update fallback state
    this.globalFallbackState.recoveryAttempts += 1;
    this.globalFallbackState.trustScore = this.currentTrustScore;
    
    // Remove agents from affected list
    this.globalFallbackState.affectedAgents = this.globalFallbackState.affectedAgents.filter(
      agent => !event.affectedAgents.includes(agent)
    );
    
    // Emit recovery progress event
    await this.eventBus.emit('fallback:recovery-progress', {
      state: this.globalFallbackState,
      source: 'FallbackManager'
    }, 'FallbackManager');
  }

  /**
   * Handle complete recovery events
   */
  private async handleCompleteRecovery(event: NetworkEvent): Promise<void> {
    if (!this.globalFallbackState) {
      return;
    }
    
    // Update trust score positively
    this.updateTrustScore(event.trustScoreImpact);
    
    // Prepare recovery state for emission
    const recoveryState = {
      ...this.globalFallbackState,
      active: false,
      affectedAgents: [],
      trustScore: this.currentTrustScore
    };
    
    // Reset fallback state
    this.globalFallbackState = null;
    
    // Emit recovery complete event
    await this.eventBus.emit('fallback:recovered', {
      state: recoveryState,
      source: 'FallbackManager'
    }, 'FallbackManager');
  }

  /**
   * Manually trigger fallback
   * @param reason Reason for fallback
   * @param affectedAgents List of affected agents
   * @param traceId Trace ID for continuity
   * @param trustScoreImpact Impact on trust score
   */
  public async triggerFallback(
    reason: string,
    affectedAgents: string[],
    traceId: string,
    trustScoreImpact: number = -0.2
  ): Promise<FallbackState> {
    // Update trust score
    this.updateTrustScore(trustScoreImpact);
    
    // For agent isolation, create separate fallback states per agent
    const primaryAgent = affectedAgents[0] || 'default';
    const agentKey = `${primaryAgent}-${traceId}`;
    
    // Check if this specific agent already has a fallback state
    const existingState = this.fallbackStates.get(agentKey);
    
    if (existingState && existingState.active) {
      // Increment fallback depth up to maximum
      existingState.fallbackDepth = Math.min(existingState.fallbackDepth + 1, this.maxFallbackDepth);
      
      // Only update affected agents for this specific agent (no cross-contamination)
      existingState.affectedAgents = [...new Set([...existingState.affectedAgents.filter(agent => agent === primaryAgent), primaryAgent])];
      existingState.trustScore = this.currentTrustScore;
      existingState.reason = `${existingState.reason} → ${reason}`; // Chain reasons
      
      // Emit fallback updated event with isolated state
      await this.eventBus.emit('fallback:updated', {
        state: existingState,
        reason,
        affectedAgents: [primaryAgent], // Only this agent
        traceId,
        trustScore: this.currentTrustScore,
        source: 'FallbackManager'
      }, 'FallbackManager');
      
      return existingState;
    }
    
    // Create new agent-specific fallback state
    const newState: FallbackState = {
      active: true,
      reason,
      triggeredBy: 'Manual',
      timestamp: new Date().toISOString(),
      traceId,
      trustScore: this.currentTrustScore,
      affectedAgents: [primaryAgent], // Only this agent
      recoveryAttempts: 0,
      fallbackDepth: 1,
      agentId: primaryAgent
    };
    
    // Store agent-specific state
    this.fallbackStates.set(agentKey, newState);
    
    // Also maintain global state for backward compatibility
    if (!this.globalFallbackState || !this.globalFallbackState.active) {
      this.globalFallbackState = { ...newState };
    } else {
      // Update global state without cross-contamination
      this.globalFallbackState.affectedAgents = [...new Set([...this.globalFallbackState.affectedAgents, primaryAgent])];
    }
    
    // Emit fallback triggered event with isolated state (for test compatibility)
    await this.eventBus.emit('fallback:triggered', {
      state: newState,
      reason,
      affectedAgents: [primaryAgent], // Only this agent
      traceId,
      trustScore: this.currentTrustScore,
      source: 'FallbackManager'
    }, 'FallbackManager');
    
    // Emit fallback activated event with isolated state
    await this.eventBus.emit('fallback:activated', {
      state: newState,
      source: 'FallbackManager'
    }, 'FallbackManager');
    
    return newState;
  }

  /**
   * Get fallback state for specific agent
   * @param agentId Agent ID
   * @param traceId Trace ID
   */
  public getAgentFallbackState(agentId: string, traceId: string): FallbackState | null {
    const agentKey = `${agentId}-${traceId}`;
    return this.fallbackStates.get(agentKey) || null;
  }

  /**
   * Check if specific agent has active fallback
   * @param agentId Agent ID
   * @param traceId Trace ID
   */
  public isAgentFallbackActive(agentId: string, traceId: string): boolean {
    const state = this.getAgentFallbackState(agentId, traceId);
    return state !== null && state.active;
  }

  /**
   * Manually start recovery for specific agent
   * @param traceId Trace ID for continuity
   * @param agentId Agent ID (optional, defaults to primary agent)
   */
  public async startRecovery(traceId: string, agentId?: string): Promise<FallbackState | null> {
    // If agentId provided, use agent-specific recovery
    if (agentId) {
      const agentKey = `${agentId}-${traceId}`;
      const agentState = this.fallbackStates.get(agentKey);
      
      if (!agentState) {
        return null;
      }
      
      // Update trust score positively
      this.updateTrustScore(0.1);
      
      // Update agent-specific fallback state
      agentState.recoveryAttempts += 1;
      agentState.trustScore = this.currentTrustScore;
      
      // Emit recovery started event for this agent
      await this.eventBus.emit('fallback:recovery-started', {
        state: agentState,
        source: 'FallbackManager'
      }, 'FallbackManager');
      
      return agentState;
    }
    
    // Legacy global recovery
    if (!this.globalFallbackState) {
      return null;
    }
    
    // Update trust score positively
    this.updateTrustScore(0.1);
    
    // Update fallback state
    this.globalFallbackState.recoveryAttempts += 1;
    this.globalFallbackState.trustScore = this.currentTrustScore;
    
    // Emit recovery started event
    await this.eventBus.emit('fallback:recovery-started', {
      state: this.globalFallbackState,
      source: 'FallbackManager'
    }, 'FallbackManager');
    
    return this.globalFallbackState;
  }

  /**
   * Manually complete recovery for specific agent
   * @param traceId Trace ID for continuity
   * @param agentId Agent ID (optional, defaults to primary agent)
   */
  public async completeRecovery(traceId: string, agentId?: string): Promise<FallbackState | null> {
    // If agentId provided, use agent-specific recovery
    if (agentId) {
      const agentKey = `${agentId}-${traceId}`;
      const agentState = this.fallbackStates.get(agentKey);
      
      if (!agentState) {
        return null;
      }
      
      // Update trust score positively
      this.updateTrustScore(0.15);
      
      // Prepare recovery state for emission
      const recoveryState = {
        ...agentState,
        active: false,
        affectedAgents: [],
        trustScore: this.currentTrustScore
      };
      
      // Remove agent-specific state
      this.fallbackStates.delete(agentKey);
      
      // Emit recovery complete event for this agent
      await this.eventBus.emit('fallback:recovered', {
        state: recoveryState,
        source: 'FallbackManager'
      }, 'FallbackManager');
      
      return recoveryState;
    }
    
    // Legacy global recovery
    if (!this.globalFallbackState) {
      return null;
    }
    
    // Update trust score positively
    this.updateTrustScore(0.15);
    
    // Prepare recovery state for emission
    const recoveryState = {
      ...this.globalFallbackState,
      active: false,
      affectedAgents: [],
      trustScore: this.currentTrustScore
    };
    
    // Reset fallback state
    this.globalFallbackState = null;
    
    // Emit recovery complete event
    await this.eventBus.emit('fallback:recovered', {
      state: recoveryState,
      source: 'FallbackManager'
    }, 'FallbackManager');
    
    return recoveryState;
  }

  /**
   * Update trust score
   * @param impact Impact on trust score
   */
  private updateTrustScore(impact: number): void {
    this.currentTrustScore += impact;
    
    // Ensure score doesn't go below floor
    this.currentTrustScore = Math.max(this.currentTrustScore, this.trustScoreFloor);
    
    // Cap at max of 1.0
    this.currentTrustScore = Math.min(this.currentTrustScore, 1.0);
  }

  /**
   * Get current fallback state
   */
  public getFallbackState(): FallbackState | null {
    return this.globalFallbackState;
  }

  /**
   * Get current trust score
   */
  public getTrustScore(): number {
    return this.currentTrustScore;
  }
  
  /**
   * Reset trust score to initial value
   */
  public resetTrustScore(): void {
    this.currentTrustScore = this.initialTrustScore;
  }
  
  /**
   * Check if fallback is active
   */
  public isFallbackActive(): boolean {
    return this.globalFallbackState !== null && this.globalFallbackState.active;
  }
} 