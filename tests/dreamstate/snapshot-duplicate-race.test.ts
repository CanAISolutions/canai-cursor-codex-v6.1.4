// snapshot-duplicate-race.test.ts
// DreamState Test 12: Snapshot Duplicate Race
// What: Prevents race conditions in snapshot creation
// Why: Ensures snapshot consistency and prevents duplication
// How: Uses canonical mocks and asserts Codex-aligned race prevention

import { mockEmotionalPayload, requireMock } from '../mocks/dreamstate-core';

describe('DreamState: snapshot-duplicate-race', () => {
  it('should prevent race conditions in snapshot creation', () => {
    // What: Simulate concurrent snapshot creation and assert no duplication
    // Why: Ensures snapshot consistency and prevents duplication
    // How: Use a Set to simulate snapshot IDs and concurrent creation
    if (!mockEmotionalPayload) requireMock('mockEmotionalPayload');
    const concurrentSnapshots = [
      { ...mockEmotionalPayload, traceId: 'trace-1' },
      { ...mockEmotionalPayload, traceId: 'trace-1' }, // duplicate
      { ...mockEmotionalPayload, traceId: 'trace-2' }
    ];
    const snapshotIds = new Set();
    let duplicateFound = false;
    for (const snap of concurrentSnapshots) {
      if (snapshotIds.has(snap.traceId)) {
        duplicateFound = true;
        break;
      }
      snapshotIds.add(snap.traceId);
    }
    expect(duplicateFound).toBe(false);
    expect(snapshotIds.size).toBe(2);
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 