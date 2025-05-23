/**
 * NetworkMonitor Service
 * 
 * What: Monitors network conditions and emits events for network issues
 * Why: Provides real-time monitoring of network health for resilience testing
 * How: Tracks latency, DNS failures, packet loss, and connection status
 */

import { EventBus } from '../event-bus/eventBus';

export interface NetworkEvent {
  event: string;
  affectedAgents: string[];
  timestamp: string;
  recovery: boolean;
  details: {
    latencyMs?: number;
    packetLossRate?: number;
    dnsFailure?: boolean;
    connectionDropped?: boolean;
    retryCount?: number;
  };
  traceId: string;
  trustScoreImpact: number;
}

export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private eventBus: EventBus;
  private isMonitoring: boolean = false;
  private affectedAgents: string[] = [];
  private lastEvent: NetworkEvent | null = null;
  private recoveryMode: boolean = false;
  private trustScoreFloor: number = 0.5; // Minimum trust score allowed
  
  private constructor() {
    this.eventBus = EventBus.getInstance();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  /**
   * Simulate latency spike
   * @param latencyMs Latency in milliseconds
   * @param affectedAgents List of affected agents
   * @param traceId Trace ID for continuity
   */
  public simulateLatencySpike(latencyMs: number, affectedAgents: string[], traceId: string): NetworkEvent {
    const event: NetworkEvent = {
      event: 'latency-spike',
      affectedAgents,
      timestamp: new Date().toISOString(),
      recovery: false,
      details: {
        latencyMs,
      },
      traceId,
      trustScoreImpact: -0.1
    };
    
    this.affectedAgents = affectedAgents;
    this.lastEvent = event;
    this.isMonitoring = true;
    this.recoveryMode = false;
    
    // Emit the event
    void this.eventBus.emit('network:latency-spike', event, 'NetworkMonitor');
    
    return event;
  }

  /**
   * Simulate packet loss or retry loop
   * @param lossRate Packet loss rate (0-1)
   * @param retryCount Number of retries
   * @param affectedAgents List of affected agents
   * @param traceId Trace ID for continuity
   */
  public simulatePacketLoss(lossRate: number, retryCount: number, affectedAgents: string[], traceId: string): NetworkEvent {
    const event: NetworkEvent = {
      event: 'packet-loss',
      affectedAgents,
      timestamp: new Date().toISOString(),
      recovery: false,
      details: {
        packetLossRate: lossRate,
        retryCount,
      },
      traceId,
      trustScoreImpact: -0.15
    };
    
    this.affectedAgents = affectedAgents;
    this.lastEvent = event;
    this.isMonitoring = true;
    this.recoveryMode = false;
    
    // Emit the event
    void this.eventBus.emit('network:packet-loss', event, 'NetworkMonitor');
    
    return event;
  }

  /**
   * Simulate DNS resolution failure
   * @param affectedAgents List of affected agents
   * @param traceId Trace ID for continuity
   */
  public simulateDnsFailure(affectedAgents: string[], traceId: string): NetworkEvent {
    const event: NetworkEvent = {
      event: 'dns-failure',
      affectedAgents,
      timestamp: new Date().toISOString(),
      recovery: false,
      details: {
        dnsFailure: true,
      },
      traceId,
      trustScoreImpact: -0.2
    };
    
    this.affectedAgents = affectedAgents;
    this.lastEvent = event;
    this.isMonitoring = true;
    this.recoveryMode = false;
    
    // Emit the event
    void this.eventBus.emit('network:dns-failure', event, 'NetworkMonitor');
    
    return event;
  }

  /**
   * Simulate WebSocket disconnect
   * @param affectedAgents List of affected agents
   * @param traceId Trace ID for continuity 
   */
  public simulateWebSocketDisconnect(affectedAgents: string[], traceId: string): NetworkEvent {
    const event: NetworkEvent = {
      event: 'websocket-disconnect',
      affectedAgents,
      timestamp: new Date().toISOString(),
      recovery: false,
      details: {
        connectionDropped: true,
      },
      traceId,
      trustScoreImpact: -0.25
    };
    
    this.affectedAgents = affectedAgents;
    this.lastEvent = event;
    this.isMonitoring = true;
    this.recoveryMode = false;
    
    // Emit the event
    void this.eventBus.emit('network:websocket-disconnect', event, 'NetworkMonitor');
    
    return event;
  }

  /**
   * Begin recovery mode for a specific event
   * @param traceId Trace ID for continuity
   */
  public beginRecovery(traceId: string): NetworkEvent | null {
    if (!this.lastEvent) {
      return null;
    }
    
    const recoveryEvent: NetworkEvent = {
      ...this.lastEvent,
      event: `${this.lastEvent.event}-recovery`,
      timestamp: new Date().toISOString(),
      recovery: true,
      traceId,
      trustScoreImpact: 0.1 // Positive impact on recovery
    };
    
    this.recoveryMode = true;
    
    // Emit the recovery event
    void this.eventBus.emit(`network:${recoveryEvent.event}`, recoveryEvent, 'NetworkMonitor');
    
    return recoveryEvent;
  }

  /**
   * Complete recovery for all affected agents
   * @param traceId Trace ID for continuity
   */
  public completeRecovery(traceId: string): NetworkEvent | null {
    if (!this.lastEvent || !this.recoveryMode) {
      return null;
    }
    
    const completeEvent: NetworkEvent = {
      ...this.lastEvent,
      event: 'network-recovery-complete',
      timestamp: new Date().toISOString(),
      recovery: true,
      affectedAgents: [],
      traceId,
      trustScoreImpact: 0.15 // Larger positive impact on complete recovery
    };
    
    this.affectedAgents = [];
    this.recoveryMode = false;
    this.isMonitoring = false;
    this.lastEvent = null;
    
    // Emit the complete recovery event
    void this.eventBus.emit('network:recovery-complete', completeEvent, 'NetworkMonitor');
    
    return completeEvent;
  }
  
  /**
   * Calculate trust score based on network events
   * @param baseScore Starting trust score
   */
  public calculateTrustScore(baseScore: number): number {
    if (!this.lastEvent) {
      return baseScore;
    }
    
    // Apply impact from last event
    let newScore = baseScore + this.lastEvent.trustScoreImpact;
    
    // Ensure score doesn't go below floor
    newScore = Math.max(newScore, this.trustScoreFloor);
    
    // Cap at 1.0
    newScore = Math.min(newScore, 1.0);
    
    return newScore;
  }
  
  /**
   * Get current affected agents
   */
  public getAffectedAgents(): string[] {
    return [...this.affectedAgents];
  }
  
  /**
   * Check if in recovery mode
   */
  public isInRecovery(): boolean {
    return this.recoveryMode;
  }
  
  /**
   * Get last network event
   */
  public getLastEvent(): NetworkEvent | null {
    return this.lastEvent;
  }
} 