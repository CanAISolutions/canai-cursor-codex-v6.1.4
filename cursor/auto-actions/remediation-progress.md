# Remediation Progress Tracker

| # | Test Name | File | Status | Details |
|---|-----------|------|--------|---------|
| 1 | raceConditionResilience (integration) › should safely roll back or recover from mid-write crash [mock:v1] | cursor/tests/race-condition-resilience.test.ts | Open | [Details](#test-1) |
| 2 | raceConditionResilience (integration) › should fail loudly if race-induced inconsistencies are not caught [mock:v1] | cursor/tests/race-condition-resilience.test.ts | Open | [Details](#test-2) |
| 3 | Compliance Contract Logging › should fail if compliance contract is missing | tests/compliance/compliance-logging.test.ts | Open | [Details](#test-3) |
| 4 | Test suite failed to run | tests/cursor-debug-agent.test.ts | Open | [Details](#test-4) |
| 5 | MotivationHook › should fallback for null input | cursor/preprocessors/motivation-hook.test.ts | Open | [Details](#test-5) |
| 6 | testFallbackCascade (integration) › should handle intermittent failure and avoid infinite fallback loops [mock:v1] | cursor/tests/test-fallback-cascade.test.ts | Open | [Details](#test-6) |
| 7 | QualityTracker › trackMetrics › should detect degrading metrics | cursor/agents/evolution-driver/tests/quality-tracker.test.ts | Open | [Details](#test-7) |
| 8 | QualityTracker › trackMetrics › should detect improving metrics | cursor/agents/evolution-driver/tests/quality-tracker.test.ts | Open | [Details](#test-8) |
| 9 | mutationDriftFuzzer (integration) › should detect and log all drift-induced misalignments and prompt inconsistencies [mock:v1] | cursor/tests/mutation-drift-fuzzer.test.ts | Open | [Details](#test-9) |
| 10 | mutationDriftFuzzer (integration) › should assert deterministic behavior under expected config [mock:v1] | cursor/tests/mutation-drift-fuzzer.test.ts | Open | [Details](#test-10) |
| 11 | Test suite failed to run | tests/blast-mapper.test.ts | Open | [Details](#test-11) |
| 12 | Test suite failed to run | tests/config.test.ts | Open | [Details](#test-12) |
| 13 | Test suite failed to run | cursor/agents/evolution-driver/tests/refactor-proposer.test.ts | Open | [Details](#test-13) |
| 14 | Test suite failed to run | cursor/tests/enforcement/ci-checklist-verification.test.ts | Open | [Details](#test-14) |
| 15 | Test suite failed to run | cursor/agents/evolution-driver/tests/pattern-analyzer.test.ts | Open | [Details](#test-15) |
| 16 | telemetry › should throw a TelemetryError on write failure | tests/telemetry.test.ts | Open | [Details](#test-16) |
| 17 | Test suite failed to run | cursor/agents/trust-scorer/trust-scorer.test.ts | Open | [Details](#test-17) |
| 18 | Test suite failed to run | cursor/system-intel/tests/sessionRefactorLogWriter.test.ts | Open | [Details](#test-18) |
| 19 | Test suite failed to run | cursor/agents/trust-scorer/integration.test.ts | Open | [Details](#test-19) |
| 20 | Dream-State Server Integrity › should boot and respond to invalid routes with golden 404 payload | tests/server.test.ts | Open | [Details](#test-20) |
| 21 | Dream-State Server Integrity › should normalize internal server errors into golden emotional payloads | tests/server.test.ts | Open | [Details](#test-21) |
| 22 | Dream-State Server Integrity › should allow feature router (posts) to operate correctly | tests/server.test.ts | Open | [Details](#test-22) |
| 23 | Test suite failed to run | cursor/accelerators/auto-rollback/rollback-engine.test.ts | Open | [Details](#test-23) |
| 24 | Dream-State Config Loader › should load valid dreamstate-config.json safely | tests/tools/loadDreamstateConfig.test.ts | Open | [Details](#test-24) |
| 25 | Dream-State Config Loader › should ensure required top-level fields exist | tests/tools/loadDreamstateConfig.test.ts | Open | [Details](#test-25) |
| 26 | LogValidator › validateLog › should validate valid log | cursor/agents/debug/utils/__tests__/log-validator.test.ts | Open | [Details](#test-26) |
| 27 | LogValidator › validateLog › should validate log with context | cursor/agents/debug/utils/__tests__/log-validator.test.ts | Open | [Details](#test-27) |
| 28 | �� Ingest Drift Check — Codex Lock Enforcement › should match the ingested SHA256 of /docs/system-map.md | tests/ci/ingest-drift-check.test.ts | Open | [Details](#test-28) |
| 29 | �� Ingest Drift Check — Codex Lock Enforcement › should match the ingested SHA256 of /cursor/cursor-ingest.md | tests/ci/ingest-drift-check.test.ts | Open | [Details](#test-29) |
| 30 | Test suite failed to run | tests/codex-gatekeeper.test.ts | Open | [Details](#test-30) |
| 31 | Test suite failed to run | tests/fix-log.test.ts | Open | [Details](#test-31) |
| 32 | appendToFixContextAsync › should write sanitized message to log file | tests/fix-context-utils.test.ts | Open | [Details](#test-32) |
| 33 | appendToFixContextAsync › should throw a FixContextError on write failure | tests/fix-context-utils.test.ts | Open | [Details](#test-33) |
| 34 | Test suite failed to run | tests/burst-protection.test.ts | Open | [Details](#test-34) |
| 35 | Test suite failed to run | tests/test-openaiHandler.test.ts | Open | [Details](#test-35) |
| 36 | Test suite failed to run | tests/selfcheck.test.ts | Open | [Details](#test-36) |

---

## Detailed Test Entries

### Test 1
**Test Name:** raceConditionResilience (integration) › should safely roll back or recover from mid-write crash [mock:v1]
**File:** cursor/tests/race-condition-resilience.test.ts
**Error:**

**Remediation:**

**Test Pass Confirmation:**

**Status:** Open

---

### Test 2
**Test Name:** raceConditionResilience (integration) › should fail loudly if race-induced inconsistencies are not caught [mock:v1]
**File:** cursor/tests/race-condition-resilience.test.ts
**Error:**

**Remediation:**

**Test Pass Confirmation:**

**Status:** Open

---

### Test 3
**Test Name:** Compliance Contract Logging › should fail if compliance contract is missing
**File:** tests/compliance/compliance-logging.test.ts
**Error:**

**Remediation:**

**Test Pass Confirmation:**

**Status:** Open

---

<!-- Repeat for all tests in the index above, using the same structure. --> 