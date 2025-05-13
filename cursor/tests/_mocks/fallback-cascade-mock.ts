// fallback-cascade-mock.ts
// WHAT: Version-tagged mock for fallback cascade integration tests
// WHY: Enables simulation of layered fallback logic, edge cases, and trust validation
// HOW: Provides a mock fallback cascade with event logging, failure injection, and edge case handling

export interface FallbackEventLog {
  sessionId: string;
  tier: 'fallback:level-1' | 'fallback:level-2' | 'fallback:final';
  attempt?: number;
}

interface FallbackCascadeMockOptions {
  failPrimary?: boolean;
  failSecondary?: boolean;
  intermittentSecondary?: boolean;
  partialMemory?: boolean;
  skipLog?: 'fallback:level-1' | 'fallback:level-2' | 'fallback:final';
}

/**
 * FallbackCascadeMockV1 — Simulates a three-tier fallback cascade with edge cases
 * Version: v1.0.0
 */
export class FallbackCascadeMockV1 {
  public readonly version = 'v1.0.0';
  private opts: FallbackCascadeMockOptions;
  private secondaryAttempts = 0;

  constructor(options: FallbackCascadeMockOptions = {}) {
    this.opts = options;
  }

  /**
   * Simulate running the fallback cascade, logging each tier
   * @param input - initial input for the cascade
   * @param onEvent - callback for event logging
   */
  async run(
    input: { sessionId: string; data: any },
    onEvent: (event: FallbackEventLog) => void
  ): Promise<{ userSafe: boolean; message: string; partialMemoryPreserved: boolean }> {
    // Primary validator tier
    if (this.opts.failPrimary) {
      if (this.opts.skipLog === 'fallback:level-1') throw new Error('unlogged fallback:level-1 skipped');
      onEvent({ sessionId: input.sessionId, tier: 'fallback:level-1' });
      // Secondary context restore tier
      if (this.opts.failSecondary) {
        // Intermittent failure simulation
        if (this.opts.intermittentSecondary && this.secondaryAttempts < 1) {
          this.secondaryAttempts++;
          onEvent({ sessionId: input.sessionId, tier: 'fallback:level-2', attempt: this.secondaryAttempts });
          // Retry once
          return this.run(input, onEvent);
        }
        if (this.opts.skipLog === 'fallback:level-2') throw new Error('unlogged fallback:level-2 skipped');
        onEvent({ sessionId: input.sessionId, tier: 'fallback:level-2', attempt: this.secondaryAttempts + 1 });
        // Final fallback tier
        if (this.opts.skipLog === 'fallback:final') throw new Error('unlogged fallback:final skipped');
        onEvent({ sessionId: input.sessionId, tier: 'fallback:final' });
        return {
          userSafe: true,
          message: 'Graceful default: safe fallback engaged.',
          partialMemoryPreserved: !!this.opts.partialMemory,
        };
      } else {
        // Secondary succeeds
        if (this.opts.skipLog === 'fallback:level-2') throw new Error('unlogged fallback:level-2 skipped');
        onEvent({ sessionId: input.sessionId, tier: 'fallback:level-2', attempt: 1 });
        return {
          userSafe: true,
          message: 'Secondary fallback succeeded.',
          partialMemoryPreserved: !!this.opts.partialMemory,
        };
      }
    } else {
      // Primary succeeds
      return {
        userSafe: true,
        message: 'Primary succeeded.',
        partialMemoryPreserved: !!this.opts.partialMemory,
      };
    }
  }
} 