/**
 * simulateValidatorHandoff — Simulates layered validator handoff and fallback
 * WHAT: Simulates a chain of validators, enforcing schema and fallback logic.
 * WHY: To guarantee validator handoff, fallback, and schema enforcement are reliable and auditable.
 * HOW: Uses version-tagged mocks, logs all events, and asserts correct propagation and fallback.
 */
import { ValidatorChainMockV1, ValidatorEventLog } from './_mocks/validator-chain-mock';

describe('simulateValidatorHandoff (integration)', () => {
  it('should propagate validation and fallback events across validator chain [mock:v1]', async () => {
    // Arrange: Create a version-tagged validator chain mock
    const chain = new ValidatorChainMockV1();
    const input = { sessionId: 'validator-session', data: { field: 'value' } };
    const eventLog: ValidatorEventLog[] = [];

    // Act: Simulate validator handoff and fallback
    await chain.run(input, event => eventLog.push(event));

    // Assert: All handoffs and fallbacks are logged and context is preserved
    expect(eventLog.length).toBe(chain.length);
    eventLog.forEach((event, idx) => {
      expect(event.sessionId).toBe(input.sessionId);
      expect(event.step).toBe(idx + 1);
      expect(event.validatorVersion).toMatch(/^v1/);
      expect(['validated', 'fallback']).toContain(event.status);
    });
  });

  it('should log fallback on schema enforcement failure [mock:v1]', async () => {
    // Arrange: Create a chain with a failing validator
    const chain = new ValidatorChainMockV1({ failAt: 2 });
    const input = { sessionId: 'fail-validator', data: { field: 'value' } };
    const eventLog: ValidatorEventLog[] = [];

    // Act: Simulate validator handoff with expected fallback
    await chain.run(input, event => eventLog.push(event));

    // Assert: Fallback is logged and identified
    const fallbackEvent = eventLog.find(e => e.status === 'fallback');
    expect(fallbackEvent).toBeDefined();
    expect(fallbackEvent?.step).toBe(2);
    expect(eventLog.length).toBe(chain.length);
  });
}); 