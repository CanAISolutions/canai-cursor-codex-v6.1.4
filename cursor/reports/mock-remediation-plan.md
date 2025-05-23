# DreamState Mock Remediation Plan — Codex Enforcement

## Purpose
Eliminate all canonical mocks from DreamState tests, enforce real system-bound validation, and ensure production readiness for CanAI launch and Ideal CX Thread.

## Remediation Steps

### 1. Audit & Enumeration
- Parse all DreamState tests for usage of canonical mocks (mockEmotionalPayload, mockFallbackChain, mockAgentWorkflow, mockMaliciousInput, mockChaosNetworkFailure, requireMock, createMocks, etc.).
- List every affected test in the remediation tracker.

### 2. Refactor & Replace
- Remove all mock imports and requireMock guards from each test.
- Replace with real builder functions, runtime data, or system entrypoints.
- If real logic is not available, inject a stub with // @codex-temp-real-input and log as a critical blocker.
- Update assertions to validate real emotional volatility, fallback chains, agent workflows, and trace propagation.

### 3. Test & Validate
- Run the full DreamState suite after each batch of refactors.
- Log all failures; fix brittle logic or escalate if emotional volatility is valid but unpredictable (@codex-flaky).
- No test is marked "production-ready" until it passes with real, runtime-valid data.

### 4. Tracker & Audit Trail
- Update the remediation tracker after each file: Status, Blockers, Notes.
- Log all actions in /cursor/auto-actions.log.md and cross-reference the tracker.

### 5. Final Validation & Launch Readiness
- Once all tests are refactored and passing, mark as "production-ready" in the tracker.
- Generate a final audit report for Codex and operator sign-off.
- Remove all @codex-temp-real-input stubs before launch, or escalate as launch blockers.

## 6. Final Review & Continuous Improvement
- After all tests are marked "production-ready," conduct a comprehensive, line-by-line review of every file in /tests/dreamstate as if seeing it for the first time.
- Validate:
  - Real system-bound logic (no hidden or legacy mocks)
  - Accurate, meaningful assertions for real-world and Codex/Ideal CX Thread scenarios
  - Emotional volatility, agent trace continuity, fallback realism, and multilingual/edge-case coverage
  - Security, trust, and operational resilience
  - Codex-aligned comments and operator guidance
- Suggest and implement improvements where possible.
- Log all findings, improvements, and any remaining gaps in /cursor/auto-actions.log.md and update the remediation tracker as needed.
- Escalate any test that does not meet Codex or Ideal CX Thread standards for further operator review.
- No test is final or launch-eligible until it passes this review.

## Operator Guidance
- No test may use a canonical mock except in a @codex-temp-real-input fallback zone, and only with operator sign-off.
- All blockers must be logged and escalated.
- No "green" test is valid for launch unless it passes with real, runtime-valid data.
- All tracker updates and audit logs must be cross-referenced for full traceability.
- Operator override is required for any exceptions, and must be logged with rationale.

## References
- [Remediation Tracker](/cursor/reports/mock-remediation-tracker.md)
- [Auto Actions Log](/cursor/auto-actions.log.md)
- [Ideal CX Thread](/docs/ideal-cx-thread-v2-emotional-sovereignty.md)
- [Polaris DreamState Codex Lock](/docs/reference/polaris-dreamstate-codex-lock.md)

## 7. Emotional Volatility & Drift Simulation
- Inject controlled volatility into emotional payloads, trust scores, and agent traces to ensure tests catch real-world drift, not just static values.
- Randomize and mutate tone, intent, and fallback paths in chaos and edge-case tests to surface hidden regressions.

## 8. Agent Workflow & Fallback Chain Realism
- Drive agent workflow and fallback chain tests from actual orchestrator logic, not hardcoded arrays.
- Assert on emergent, not expected, behavior—the system must prove it can adapt, recover, and maintain emotional safety under real conditions.

## 9. Multilingual & Accessibility Coverage
- Expand locale and accessibility tests to cover all supported languages and accessibility scenarios.
- Simulate real translation, a11y, and input edge cases—not just happy paths.

## 10. Security, Trust, and Operational Resilience
- Inject security edge cases (e.g., prompt injection, malformed input, trustScore bypass attempts) and assert on system resilience.
- Test for trustScore volatility, recovery, and breach scenarios using real system logic.

## 11. Snapshot & Approval Gate Integrity
- Enforce cryptographic snapshot validation using real hash/signature logic.
- Simulate concurrent and adversarial snapshot scenarios to ensure no race or unauthorized change is possible.

## 12. Automated Regression & Mutation Testing
- Introduce mutation testing: automatically mutate test logic and system outputs to ensure tests fail when they should.
- Automate regression sweeps after every change to catch silent failures or drift.

## 13. Auditability, Traceability, and Documentation
- Ensure every test, logic block, and assertion is commented with what/why/how, per Codex standards.
- Maintain a living audit trail in the tracker and log, with cross-references to all operator actions and escalations.
- Document all system dependencies, builder functions, and test invariants for future maintainers.

## 14. Future-Proofing & Codex Safeguards
- Add Codex safeguard blocks to auto-detect and log any future reintroduction of mocks or non-canonical stubs.
- Set up CI/CD gates to block merges if any test regresses to mock usage or loses emotional/operational coverage.

## 15. Continuous Operator Feedback Loop
- Solicit operator feedback and incorporate suggestions for further hardening.
- Log all feedback, actions, and improvements in the tracker and auto-actions log. 