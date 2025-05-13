// agent-chain-mock.ts
// WHAT: Version-tagged mock for agent chain integration tests
// WHY: Enables simulation of agent handoffs and coordination for Codex trust validation
// HOW: Provides a mock agent chain with event logging and failure injection

export interface AgentEventLog {
  sessionId: string;
  step: number;
  agentVersion: string;
}

interface AgentChainMockOptions {
  failAt?: number;
}

/**
 * AgentChainMockV1 — Simulates a chain of agents with handoff and event logging
 * Version: v1.0.0
 */
export class AgentChainMockV1 {
  public readonly length = 3;
  private failAt?: number;
  public readonly version = 'v1.0.0';

  constructor(options: AgentChainMockOptions = {}) {
    this.failAt = options.failAt;
  }

  /**
   * Simulate running the agent chain, logging each handoff event
   * @param context - initial context for the chain
   * @param onEvent - callback for event logging
   */
  async run(context: { sessionId: string; payload: any }, onEvent: (event: AgentEventLog | any) => void) {
    for (let i = 0; i < this.length; i++) {
      if (this.failAt && i + 1 === this.failAt) {
        // Emit degraded event before throwing
        onEvent({
          type: 'AgentChainStatusUpdate',
          status: 'degraded',
          reason: 'failure-triggered',
          agentId: 'mock-agent-001',
          timestamp: Date.now(),
          sessionId: context.sessionId,
          step: i + 1,
          agentVersion: this.version
        });
        throw new Error(`AgentChainMockV1 failure at step ${this.failAt}`);
      }
      onEvent({
        sessionId: context.sessionId,
        step: i + 1,
        agentVersion: this.version,
      });
      // Simulate async handoff
      await new Promise(res => setTimeout(res, 10));
    }
  }
} 