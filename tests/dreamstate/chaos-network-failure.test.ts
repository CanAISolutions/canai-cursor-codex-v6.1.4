// chaos-network-failure.test.ts
// DreamState Test 28: Chaos Network Failure
// What: Simulates network partitions and agent timeouts
// Why: Ensures emotional continuity and fallback purity under network chaos
// How: Uses real NetworkMonitor and validates fallback, trace continuity, trustScore behavior

import { NetworkMonitor } from '../../cursor/services/network-monitor';
import { FallbackManager } from '../../cursor/services/fallback-manager';
import { EventBus } from '../../cursor/event-bus/eventBus';
import { 
  createEmotionalPayload, 
  createNetworkDegradedPayload, 
  createNetworkRecoveryPayload,
  EmotionalPayload 
} from '../../cursor/utils/emotion-payload-builder';

// Polaris Ritual: Resilience Under Volatility
// Polaris Ritual: TrustScore Recovery
// Codex Vector: Trace Continuity During Network Chaos
// Codex Safeguard: All fallbacks must be runtime-valid, no mocks permitted.

describe('DreamState: chaos-network-failure', () => {
  let networkMonitor: NetworkMonitor;
  let fallbackManager: FallbackManager;
  let eventBus: EventBus;
  let initialPayload: EmotionalPayload;
  let capturedEvents: Array<{ event: string, data: any }> = [];
  
  beforeEach(async () => {
    // Initialize services with real implementations
    networkMonitor = NetworkMonitor.getInstance();
    fallbackManager = FallbackManager.getInstance();
    eventBus = EventBus.getInstance();
    
    // Reset trust score to initial value
    fallbackManager.resetTrustScore();
    
    // Clear event bus log
    eventBus.clearEventLog();
    
    // Set up event capture    
    capturedEvents = [];    
    const captureEvent = async (eventName: string, data: any): Promise<void> => {
      capturedEvents.push({ event: eventName, data });
    };
        
    eventBus.on('network:latency-spike', async (data) => captureEvent('latency-spike', data));
    eventBus.on('network:packet-loss', async (data) => captureEvent('packet-loss', data));
    eventBus.on('network:dns-failure', async (data) => captureEvent('dns-failure', data));
    eventBus.on('network:websocket-disconnect', async (data) => captureEvent('websocket-disconnect', data));
    eventBus.on('fallback:activated', async (data) => captureEvent('fallback-activated', data));
    eventBus.on('fallback:updated', async (data) => captureEvent('fallback-updated', data));
    eventBus.on('fallback:recovery-progress', async (data) => captureEvent('recovery-progress', data));
    eventBus.on('fallback:recovered', async (data) => captureEvent('recovered', data));
      
    // Create initial emotional payload
    initialPayload = await createEmotionalPayload();
  });
  
  afterEach(() => {
    // Clean up event listeners
    // This ensures tests don't interfere with each other
    const events = [
      'network:latency-spike', 'network:packet-loss', 'network:dns-failure', 'network:websocket-disconnect',
      'fallback:activated', 'fallback:updated', 'fallback:recovery-progress', 'fallback:recovered'
    ];
      
    events.forEach(event => {
      eventBus.off(event, async () => { /* empty async handler */ });
    });
  });

  it('should handle latency spike with fallback trigger and recovery', async () => {
    // What: Simulate latency spike and assert real fallback activation
    // Why: Ensures system degrades gracefully under high latency
    // How: Use NetworkMonitor to trigger real event and validate fallback chain
    
    // -------------------- Simulate latency spike --------------------
    const affectedAgents = ['Parser', 'Generator'];
    const latencyEvent = networkMonitor.simulateLatencySpike(500, affectedAgents, initialPayload.traceId);
    
    // Assert event properties
    expect(latencyEvent.event).toBe('latency-spike');
    expect(latencyEvent.recovery).toBe(false);
    expect(latencyEvent.affectedAgents).toEqual(affectedAgents);
    expect(latencyEvent.details.latencyMs).toBe(500);
    expect(latencyEvent.traceId).toBe(initialPayload.traceId);
    
    // Create degraded emotional payload reflecting the latency spike
    const degradedPayload = await createNetworkDegradedPayload(
      initialPayload, 
      'latency-spike', 
      0.3
    );
    
    // Verify trace continuity
    expect(degradedPayload.traceId).toBe(initialPayload.traceId);
    
    // Verify trust score degradation but still above floor
    expect(degradedPayload.trustScore).toBeLessThan(initialPayload.trustScore);
    expect(degradedPayload.trustScore).toBeGreaterThanOrEqual(0.5);
    
    // Verify fallback activation
    expect(fallbackManager.isFallbackActive()).toBe(true);
    const fallbackState = fallbackManager.getFallbackState();
    expect(fallbackState).not.toBeNull();
    expect(fallbackState?.traceId).toBe(initialPayload.traceId);
    expect(fallbackState?.affectedAgents).toEqual(expect.arrayContaining(affectedAgents));
    
    // -------------------- Begin recovery --------------------
    const recoveryEvent = networkMonitor.beginRecovery(initialPayload.traceId);
    
    // Assert recovery event
    expect(recoveryEvent).not.toBeNull();
    expect(recoveryEvent?.event).toBe('latency-spike-recovery');
    expect(recoveryEvent?.recovery).toBe(true);
    expect(recoveryEvent?.traceId).toBe(initialPayload.traceId);
    
    // Create recovery emotional payload
    const recoveryPayload = await createNetworkRecoveryPayload(degradedPayload, 0.7);
    
    // Verify trace continuity through recovery
    expect(recoveryPayload.traceId).toBe(initialPayload.traceId);
    
    // Verify partial trust score recovery
    expect(recoveryPayload.trustScore).toBeGreaterThan(degradedPayload.trustScore);
    expect(recoveryPayload.trustScore).toBeLessThanOrEqual(initialPayload.trustScore);
    
    // -------------------- Complete recovery --------------------
    const completeEvent = networkMonitor.completeRecovery(initialPayload.traceId);
    
    // Assert complete recovery
    expect(completeEvent).not.toBeNull();
    expect(completeEvent?.event).toBe('network-recovery-complete');
    expect(completeEvent?.recovery).toBe(true);
    expect(completeEvent?.traceId).toBe(initialPayload.traceId);
    
    // Verify fallback deactivation
    expect(fallbackManager.isFallbackActive()).toBe(false);
    
    // Verify events were captured properly
    expect(capturedEvents.length).toBeGreaterThanOrEqual(4); // At least 4 events should have been captured
    
    // Verify trust score is recovering
    expect(fallbackManager.getTrustScore()).toBeGreaterThan(0.5);
  });

  it('should handle packet loss with retry loops and ensure trace continuity', async () => {
    // What: Simulate packet loss and retry loops
    // Why: Validates system resilience during partial connectivity
    // How: Use NetworkMonitor to trigger real packet loss events
    
    // -------------------- Simulate packet loss --------------------
    const affectedAgents = ['Generator', 'Validator'];
    const packetLossEvent = networkMonitor.simulatePacketLoss(0.4, 3, affectedAgents, initialPayload.traceId);
    
    // Assert event properties
    expect(packetLossEvent.event).toBe('packet-loss');
    expect(packetLossEvent.recovery).toBe(false);
    expect(packetLossEvent.affectedAgents).toEqual(affectedAgents);
    expect(packetLossEvent.details.packetLossRate).toBe(0.4);
    expect(packetLossEvent.details.retryCount).toBe(3);
    expect(packetLossEvent.traceId).toBe(initialPayload.traceId);
    
    // Create degraded emotional payload
    const degradedPayload = await createNetworkDegradedPayload(
      initialPayload, 
      'packet-loss', 
      0.4
    );
    
    // Verify trace continuity
    expect(degradedPayload.traceId).toBe(initialPayload.traceId);
    
    // Verify trust score degradation
    expect(degradedPayload.trustScore).toBeLessThan(initialPayload.trustScore);
    
    // Verify fallback activation
    expect(fallbackManager.isFallbackActive()).toBe(true);
    const fallbackState = fallbackManager.getFallbackState();
    expect(fallbackState).not.toBeNull();
    expect(fallbackState?.traceId).toBe(initialPayload.traceId);
    
    // -------------------- Begin recovery first --------------------
    const recoveryEvent = networkMonitor.beginRecovery(initialPayload.traceId);
    expect(recoveryEvent).not.toBeNull();
    expect(recoveryEvent?.recovery).toBe(true);
    
    // -------------------- Then complete recovery --------------------
    const completeEvent = networkMonitor.completeRecovery(initialPayload.traceId);
    
    // Assert complete recovery
    expect(completeEvent).not.toBeNull();
    expect(completeEvent?.traceId).toBe(initialPayload.traceId);
    
    // Verify fallback deactivation
    expect(fallbackManager.isFallbackActive()).toBe(false);
    
    // Verify trust score is recovering
    expect(fallbackManager.getTrustScore()).toBeGreaterThan(0.5);
  });

  it('should handle DNS resolution failure and validate emotional response', async () => {
    // What: Simulate DNS resolution failure
    // Why: Validates system response to critical connection failure
    // How: Trigger DNS failure event and validate emotional degradation and recovery
    
    // -------------------- Simulate DNS failure --------------------
    const affectedAgents = ['Parser', 'Generator', 'Validator'];
    const dnsFailureEvent = networkMonitor.simulateDnsFailure(affectedAgents, initialPayload.traceId);
    
    // Assert event properties
    expect(dnsFailureEvent.event).toBe('dns-failure');
    expect(dnsFailureEvent.recovery).toBe(false);
    expect(dnsFailureEvent.affectedAgents).toEqual(affectedAgents);
    expect(dnsFailureEvent.details.dnsFailure).toBe(true);
    expect(dnsFailureEvent.traceId).toBe(initialPayload.traceId);
    
    // Create degraded emotional payload
    const degradedPayload = await createNetworkDegradedPayload(
      initialPayload, 
      'dns-failure', 
      0.5 // Higher impact for DNS failure
    );
    
    // Verify trace continuity
    expect(degradedPayload.traceId).toBe(initialPayload.traceId);
    
    // Verify significant trust score degradation
    expect(degradedPayload.trustScore).toBeLessThan(initialPayload.trustScore - 0.2);
    
    // Verify emotional response is apologetic for DNS failure
    expect(degradedPayload.tone).toBe('apologetic');
    
    // Verify fallback activation with multiple affected agents
    expect(fallbackManager.isFallbackActive()).toBe(true);
    const fallbackState = fallbackManager.getFallbackState();
    expect(fallbackState).not.toBeNull();
    expect(fallbackState?.affectedAgents.length).toBeGreaterThanOrEqual(3);
    
    // -------------------- Complete recovery --------------------
    const completeEvent = networkMonitor.completeRecovery(initialPayload.traceId);
    
    // Create recovery emotional payload
    const recoveryPayload = await createNetworkRecoveryPayload(degradedPayload, 1.0); // Full recovery
    
    // Verify tone shift to confident after full recovery
    expect(recoveryPayload.tone).toBe('confident');
    
    // Verify trace continuity through complete recovery
    expect(recoveryPayload.traceId).toBe(initialPayload.traceId);
    
    // Verify trust score recovery
    expect(recoveryPayload.trustScore).toBeGreaterThan(degradedPayload.trustScore);
  });

  it('should handle WebSocket disconnect mid-session with emotional continuity', async () => {
    // What: Simulate WebSocket disconnect during active session
    // Why: Validates system response to live connection drop
    // How: Trigger disconnect event and validate trace continuity and emotional response
    
    // -------------------- Simulate WebSocket disconnect --------------------
    const affectedAgents = ['Generator', 'Validator'];
    const disconnectEvent = networkMonitor.simulateWebSocketDisconnect(affectedAgents, initialPayload.traceId);
    
    // Assert event properties
    expect(disconnectEvent.event).toBe('websocket-disconnect');
    expect(disconnectEvent.recovery).toBe(false);
    expect(disconnectEvent.affectedAgents).toEqual(affectedAgents);
    expect(disconnectEvent.details.connectionDropped).toBe(true);
    expect(disconnectEvent.traceId).toBe(initialPayload.traceId);
    
    // Create degraded emotional payload
    const degradedPayload = await createNetworkDegradedPayload(
      initialPayload, 
      'websocket-disconnect', 
      0.5
    );
    
    // Verify trust score significant degradation for disconnect
    expect(degradedPayload.trustScore).toBeLessThanOrEqual(initialPayload.trustScore * 0.7);
    
    // Verify emotional tone is apologetic for disconnect
    expect(degradedPayload.tone).toBe('apologetic');
    
    // Verify trace continuity
    expect(degradedPayload.traceId).toBe(initialPayload.traceId);
    
    // Verify fallback activation
    expect(fallbackManager.isFallbackActive()).toBe(true);
    
    // -------------------- Begin recovery --------------------
    await fallbackManager.startRecovery(initialPayload.traceId);
    
    // Verify fallback is still active during recovery
    expect(fallbackManager.isFallbackActive()).toBe(true);
    
    // Create partial recovery emotional payload
    const partialRecoveryPayload = await createNetworkRecoveryPayload(degradedPayload, 0.5);
    
    // Verify trace continuity through partial recovery
    expect(partialRecoveryPayload.traceId).toBe(initialPayload.traceId);
    
    // Verify trust score partial recovery
    expect(partialRecoveryPayload.trustScore).toBeGreaterThan(degradedPayload.trustScore);
    expect(partialRecoveryPayload.trustScore).toBeLessThan(initialPayload.trustScore);
    
    // -------------------- Complete recovery --------------------
    await fallbackManager.completeRecovery(initialPayload.traceId);
    
    // Verify fallback is no longer active
    expect(fallbackManager.isFallbackActive()).toBe(false);
    
    // Create full recovery emotional payload
    const fullRecoveryPayload = await createNetworkRecoveryPayload(degradedPayload, 0.95);
    
    // Verify trace continuity through full recovery
    expect(fullRecoveryPayload.traceId).toBe(initialPayload.traceId);
    
    // Verify trust score significant recovery
    expect(fullRecoveryPayload.trustScore).toBeGreaterThan(partialRecoveryPayload.trustScore);
    expect(fullRecoveryPayload.trustScore).toBeGreaterThanOrEqual(initialPayload.trustScore * 0.9);
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 