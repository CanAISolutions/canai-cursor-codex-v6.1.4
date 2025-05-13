// validator-chain-mock.ts
// WHAT: Version-tagged mock for validator chain integration tests
// WHY: Enables simulation of layered validator handoff and fallback for Codex trust validation
// HOW: Provides a mock validator chain with event logging and failure injection

export interface ValidatorEventLog {
  sessionId: string;
  step: number;
  validatorVersion: string;
  status: 'validated' | 'fallback';
}

interface ValidatorChainMockOptions {
  failAt?: number;
}

/**
 * ValidatorChainMockV1 — Simulates a chain of validators with handoff, schema enforcement, and fallback
 * Version: v1.0.0
 */
export class ValidatorChainMockV1 {
  public readonly length = 3;
  private failAt?: number;
  public readonly version = 'v1.0.0';

  constructor(options: ValidatorChainMockOptions = {}) {
    this.failAt = options.failAt;
  }

  /**
   * Simulate running the validator chain, logging each handoff and fallback event
   * @param input - initial input for the chain
   * @param onEvent - callback for event logging
   */
  async run(input: { sessionId: string; data: any }, onEvent: (event: ValidatorEventLog) => void) {
    for (let i = 0; i < this.length; i++) {
      if (this.failAt && i + 1 === this.failAt) {
        onEvent({
          sessionId: input.sessionId,
          step: i + 1,
          validatorVersion: this.version,
          status: 'fallback',
        });
        // Simulate async fallback
        await new Promise(res => setTimeout(res, 10));
        continue;
      }
      onEvent({
        sessionId: input.sessionId,
        step: i + 1,
        validatorVersion: this.version,
        status: 'validated',
      });
      // Simulate async handoff
      await new Promise(res => setTimeout(res, 10));
    }
  }
} 