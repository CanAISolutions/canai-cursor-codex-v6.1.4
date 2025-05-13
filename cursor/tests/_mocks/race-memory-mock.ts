// race-memory-mock.ts
// WHAT: Version-tagged mock for race condition resilience integration tests
// WHY: Enables simulation of concurrent agent access, memory conflict, and trust validation
// HOW: Provides a mock memory module with event logging, delay, crash, and conflict handling

export interface RaceEventLog {
  agent: string;
  type: 'write' | 'restore' | 'lock-conflict' | 'conflict-resolved' | 'crash-recovered' | 'restore-stale-blocked' | 'user-message';
  key?: string;
  value?: any;
  message?: string;
}

interface RaceMemoryMockOptions {
  crashMidWrite?: boolean;
  lockConflict?: boolean;
  skipConflictResolution?: boolean;
}

/**
 * RaceMemoryMockV1 — Simulates concurrent agent access and memory conflict
 * Version: v1.0.0
 */
export class RaceMemoryMockV1 {
  public readonly version = 'v1.0.0';
  private opts: RaceMemoryMockOptions;
  private state: Record<string, any> = {};
  private lock: boolean = false;

  constructor(options: RaceMemoryMockOptions = {}) {
    this.opts = options;
  }

  getState() {
    return { ...this.state };
  }

  async agentWrite(agent: string, { key, value }: { key: string; value: any }, onEvent: (event: RaceEventLog) => void) {
    // Simulate random delay
    await new Promise(res => setTimeout(res, Math.random() * 20));
    if (this.lock || this.opts.lockConflict) {
      onEvent({ agent, type: 'lock-conflict', key });
      if (this.opts.skipConflictResolution) throw new Error('race inconsistency: unresolved lock conflict');
      // Simulate Codex-aligned user message
      onEvent({ agent, type: 'user-message', message: "We're resolving your update now..." });
      // Resolve conflict
      this.lock = false;
      onEvent({ agent, type: 'conflict-resolved', key });
    }
    this.lock = true;
    onEvent({ agent, type: 'write', key, value });
    if (this.opts.crashMidWrite) {
      this.lock = false;
      onEvent({ agent, type: 'crash-recovered', key });
      throw new Error('Agent crashed mid-write');
    }
    this.state[key] = value;
    this.lock = false;
  }

  async agentRestore(agent: string, { key, value }: { key: string; value: any }, onEvent: (event: RaceEventLog) => void) {
    // Simulate random delay
    await new Promise(res => setTimeout(res, Math.random() * 20));
    if (this.state[key] !== undefined && this.state[key] !== value) {
      onEvent({ agent, type: 'restore-stale-blocked', key });
      return;
    }
    onEvent({ agent, type: 'restore', key, value });
    this.state[key] = value;
  }
} 