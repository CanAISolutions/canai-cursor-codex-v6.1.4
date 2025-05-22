/**
 * mutationDriftFuzzer — Fuzzes agent, memory, validator, and prompt for drift/mutation
 * WHAT: Randomizes config, memory, validator logic, and prompt text to induce drift/mutation.
 * WHY: To guarantee Codex alignment, schema enforcement, and prompt consistency under mutation/drift.
 * HOW: Uses version-tagged mocks, logs all mutations, and asserts deterministic or flagged divergence.
 */
import { MutationDriftFuzzerMockV1, MutationDriftEvent } from './_mocks/mutation-drift-fuzzer-mock';

describe('mutationDriftFuzzer (integration)', () => {
  it('should detect and log all drift-induced misalignments and prompt inconsistencies [mock:v1]', async () => {
    // Arrange: Create a version-tagged mutation drift fuzzer mock
    const fuzzer = new MutationDriftFuzzerMockV1();
    const eventLog: MutationDriftEvent[] = [];

    // Act: Run fuzzer with randomized mutations
    const results = await fuzzer.run({
      agentConfig: { version: 'v1.0.0', mode: 'normal' },
      memoryState: { user: 'A', goal: 'B', legacyField: 'X' },
      validatorLogic: { schemaVersion: 1, allowLegacy: false },
      promptText: 'Generate a summary for user A with goal B.',
    }, event => eventLog.push(event));

    // Assert: All drift/mutation events are logged and flagged
    expect(eventLog.some(e => e.type === 'drift-detected')).toBe(true);
    expect(eventLog.some(e => e.type === 'prompt-inconsistency')).toBe(true);
    expect(eventLog.some(e => e.type === 'schema-blocked')).toBe(true);
    expect(results.failures.length).toBe(0);
  });

  it('should fail loudly if any uncaught mutation or drift occurs [mock:v1]', async () => {
    // Arrange: Fuzzer with a mutation that bypasses schema/test
    const fuzzer = new MutationDriftFuzzerMockV1({ allowUncaught: true });
    const eventLog: MutationDriftEvent[] = [];

    // Act & Assert: Should throw error if drift is not caught
    await expect(fuzzer.run({
      agentConfig: { version: 'v1.0.0', mode: 'mutated' },
      memoryState: { user: 'A', goal: undefined },
      validatorLogic: { schemaVersion: 0, allowLegacy: true },
      promptText: 'Generate a summary for user A with goal B.',
    }, event => eventLog.push(event))).rejects.toThrow(/uncaught mutation|drift/i);
  });

  it('should assert deterministic behavior under expected config [mock:v1]', async () => {
    // Arrange: Fuzzer with no mutations
    const fuzzer = new MutationDriftFuzzerMockV1();
    const eventLog: MutationDriftEvent[] = [];
    const input = {
      agentConfig: { version: 'v1.0.0', mode: 'normal' },
      memoryState: { user: 'A', goal: 'B' },
      validatorLogic: { schemaVersion: 1, allowLegacy: false },
      promptText: 'Generate a summary for user A with goal B.',
    };
    const result1 = await fuzzer.run(input, event => eventLog.push(event));
    const result2 = await fuzzer.run(input, event => eventLog.push(event));
    // Assert: Outputs are deterministic
    expect(result1.output).toEqual(result2.output);
    expect(eventLog.filter(e => e.type === 'drift-detected').length).toBe(0);
  });
}); 