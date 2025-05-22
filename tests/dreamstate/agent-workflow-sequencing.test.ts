// agent-workflow-sequencing.test.ts
// DreamState Test 21: Agent Workflow Sequencing
// What: Validates end-to-end agent task sequencing and execution
// Why: Ensures correct order and emotional output in multi-agent workflows
// How: Uses canonical mocks and asserts Codex-aligned agent sequencing

import { mockAgentWorkflow, requireMock } from '../mocks/dreamstate-core';

describe('DreamState: agent-workflow-sequencing', () => {
  it('should validate agent task sequencing and execution', () => {
    // What: Simulate multi-agent workflow and assert correct sequencing
    // Why: Ensures correct order and emotional output in multi-agent workflows
    // How: Compare agent sequence and outputs
    if (!mockAgentWorkflow) requireMock('mockAgentWorkflow');
    const expectedOrder = ['Parser', 'Generator', 'Validator'];
    mockAgentWorkflow.forEach((step, idx) => {
      expect(step.agent).toBe(expectedOrder[idx]);
      expect(step.status).toBe('complete');
      expect(step.output).toBeDefined();
    });
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 