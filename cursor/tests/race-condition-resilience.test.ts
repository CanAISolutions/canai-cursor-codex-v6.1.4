/**
 * raceConditionResilience — Validates safe memory behavior under concurrent agent access
 * WHAT: Simulates two agents writing/reading shared memory with delay/randomness.
 * WHY: To guarantee no memory corruption, safe reconciliation, and Codex-aligned trust under race conditions.
 * HOW: Uses version-tagged mocks, logs all events, and asserts safe, deterministic outcomes.
 */
import { RaceMemoryMockV1, RaceEventLog } from './_mocks/race-memory-mock';

describe('raceConditionResilience (integration)', () => {
  it('should prevent memory corruption and reconcile final state deterministically [mock:v1]', async () => {
    // Arrange: Create a version-tagged race memory mock
    const memory = new RaceMemoryMockV1();
    const eventLog: RaceEventLog[] = [];

    // Act: Simulate two agents writing/reading with random delay
    const agent1 = memory.agentWrite('A', { key: 'critical', value: 1 }, event => eventLog.push(event));
    const agent2 = memory.agentWrite('B', { key: 'critical', value: 2 }, event => eventLog.push(event));
    await Promise.all([agent1, agent2]);

    // Assert: No corruption, final state is safely reconciled
    const finalState = memory.getState();
    expect([1, 2]).toContain(finalState.critical); // One valid value
    expect(eventLog.some(e => e.type === 'conflict-resolved')).toBe(true);
  });

  it('should prioritize most recent valid write over stale restore [mock:v1]', async () => {
    // Arrange: Agent A writes, Agent B restores stale memory
    const memory = new RaceMemoryMockV1();
    const eventLog: RaceEventLog[] = [];
    await memory.agentWrite('A', { key: 'critical', value: 10 }, event => eventLog.push(event));
    await memory.agentRestore('B', { key: 'critical', value: 5 }, event => eventLog.push(event));

    // Assert: Final state prioritizes most recent valid write
    const finalState = memory.getState();
    expect(finalState.critical).toBe(10);
    expect(eventLog.some(e => e.type === 'restore-stale-blocked')).toBe(true);
  });

  it('should safely roll back or recover from mid-write crash [mock:v1]', async () => {
    // Arrange: Agent crashes mid-write
    const memory = new RaceMemoryMockV1({ crashMidWrite: true });
    const eventLog: RaceEventLog[] = [];
    let error: Error | undefined;
    try {
      await memory.agentWrite('A', { key: 'critical', value: 99 }, event => eventLog.push(event));
    } catch (e) {
      error = e as Error;
    }

    // Assert: Memory is not left in undefined state
    const finalState = memory.getState();
    expect(error).toBeDefined();
    expect(finalState.critical).not.toBeUndefined();
    expect(eventLog.some(e => e.type === 'crash-recovered')).toBe(true);
  });

  it('should log and gracefully resolve memory lock/conflict [mock:v1]', async () => {
    // Arrange: Simulate memory lock/conflict
    const memory = new RaceMemoryMockV1({ lockConflict: true });
    const eventLog: RaceEventLog[] = [];
    await memory.agentWrite('A', { key: 'critical', value: 1 }, event => eventLog.push(event));
    await memory.agentWrite('B', { key: 'critical', value: 2 }, event => eventLog.push(event));

    // Assert: Conflict is logged and resolved, user-facing message is Codex-aligned
    expect(eventLog.some(e => e.type === 'lock-conflict')).toBe(true);
    expect(eventLog.some(e => e.type === 'conflict-resolved')).toBe(true);
    expect(eventLog.some(e => e.type === 'user-message' && typeof e.message === 'string' && /resolving your update/i.test(e.message || ''))).toBe(true);
  });

  it('should fail loudly if race-induced inconsistencies are not caught [mock:v1]', async () => {
    // Arrange: Create a mock that skips conflict resolution
    const memory = new RaceMemoryMockV1({ skipConflictResolution: true });
    const eventLog: RaceEventLog[] = [];
    await memory.agentWrite('A', { key: 'critical', value: 1 }, event => eventLog.push(event));
    await expect(memory.agentWrite('B', { key: 'critical', value: 2 }, event => eventLog.push(event)))
      .rejects.toThrow(/race inconsistency|unresolved/i);
  });
}); 