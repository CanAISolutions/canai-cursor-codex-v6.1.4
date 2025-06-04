# Boot Sequence Test Suite

This directory contains comprehensive tests for the CanAI boot sequence system. The tests are designed to validate each boot sequence module individually and as an integrated system.

## Test Structure

Each boot sequence module has a corresponding test file:

- `00_mdc_rules_activation.test.ts` - Tests for MDC rules activation
- `01_dreamstate_alignment.test.ts` - Tests for dreamstate alignment
- `02_system_integrity_audit.test.ts` - Tests for system integrity
- `03_emotional_consistency_check.test.ts` - Tests for emotional consistency
- `04_modularity_snapshot.test.ts` - Tests for modularity snapshot
- `05_codex_upgrade_detector.test.ts` - Tests for codex upgrade detection
- `06_cursor_selfcheck_trigger.test.ts` - Tests for cursor self-check
- `07_strategic_recommendation_emitter.test.ts` - Tests for strategic recommendations
- `08_generate_action_plan_issues.test.ts` - Tests for action plan issues
- `09_generate_action_plan_opportunities.test.ts` - Tests for action plan opportunities
- `10_execute_action_plan.test.ts` - Tests for action plan execution
- `boot_sequence_manager.test.ts` - Tests for the boot sequence manager

## Test Strategy

1. **Unit Tests**: Each function within a module is tested in isolation
2. **Integration Tests**: Module interactions are tested to verify proper coordination
3. **Emotional Tests**: Ensure emotional sovereignty principles are maintained
4. **Error Handling Tests**: Verify proper handling of error scenarios
5. **End-to-End Tests**: Validate the complete boot sequence

## Running Tests

```bash
# Run all boot sequence tests
npm test -- --testPathPattern=tests/boot_sequence

# Run tests for a specific module
npm test -- --testPathPattern=tests/boot_sequence/01_dreamstate_alignment.test.ts
```

## Verification Evidence

Test results are automatically captured and stored in the verification evidence directory:
`/docs/verification-hub/verification-evidence/test-execution/boot-sequence-tests.log` 