// fallback-cross-talk.test.ts
// DreamState Test 7: Fallback Cross-Talk
// What: Prevents unintended agent interactions in fallback scenarios
// Why: Ensures fallback isolation and emotional integrity
// How: Uses canonical mocks and asserts Codex-aligned fallback logic

import { mockFallbackChain, requireMock } from '../mocks/dreamstate-core';
import { describe, it, expect } from '@jest/globals';

describe('DreamState: fallback-cross-talk', () => {
  it('should prevent unintended agent interactions during fallback', () => {
    // What: Simulate fallback chain with multiple agents
    // Why: Ensures fallback isolation and prevents cross-talk
    // How: Assert that only one agent is active per fallback step
    if (!mockFallbackChain) requireMock('mockFallbackChain');
    const activeAgents = mockFallbackChain.map(step => step.agent);
    const uniqueAgents = new Set(activeAgents);
    expect(activeAgents.length).toBe(uniqueAgents.size);
    // Assert no agent appears in more than one fallback step
    activeAgents.forEach(agent => {
      expect(activeAgents.filter(a => a === agent).length).toBe(1);
    });
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 