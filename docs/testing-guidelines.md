# 📘 CanAI Testing Guidelines

**Codex Edition v4.1.3 — Last Updated: 2025-05-05**

---

## 🧪 Overview

This document defines the **mandatory testing protocols** for all CanAI modules. Every code file must be paired with automated tests that:

* Ensure correctness under normal and edge cases
* Log failures deterministically
* Enable safe evolution and AI copiloting
* Preserve trust through regression prevention

We do **not** test for coverage — we test for **clarity, resilience, and permanence**.

---

## ✅ Test File Structure

* All test files live in `/tests/`
* Filename convention: `<module>.test.ts`
* Mirror the structure of production files:

  * `/cursor/core/telemetry.ts` → `/tests/telemetry.test.ts`
  * `/cursor/agents/debug/cursor-debug-agent.ts` → `/tests/cursor-debug-agent.test.ts`

---

## 🧠 Core Testing Rules

### 🔹 1. Every Public Function Must Be Tested

Even if wrapped by a main orchestrator. This includes:

* Utility functions
* Async retry wrappers
* AI decision logic
* Scoring algorithms

### 🔹 2. Mocks Are Required

Use `jest.mock()` and `jest.fn()` to replace:

* AI providers
* File system access
* Git execution logic
* Logging/metrics

This ensures:

* No external API calls
* No file writes or side effects
* Full control of test behavior

### 🔹 3. Trace IDs Required

Every test with `recordMetric`, `appendToFixContextAsync`, or `runCursorDebugAgent` must use a `traceId`. This ensures all logs are correlated.

### 🔹 4. Include Failure Modes

Each test file must:

* Test the happy path
* Test common edge cases
* Simulate and assert error recovery (e.g., retries, fallbacks, escalations)

### 🔹 5. Metric Verification Required

All metric-producing modules (`telemetry.ts`, `trust-scorer.ts`, etc.) must assert on `recordMetric(...)` calls:

```ts
expect(recordMetric).toHaveBeenCalledWith('bug_detected', expect.objectContaining({ traceId }));
```

---

## 📊 Coverage Expectations

> ✅ We require *qualitative coverage*, not line coverage.

Checkpoints:

* Every major logic branch is exercised
* Every fallback path is verified
* No silent failures
* Every traceable event is asserted

---

## 📦 Snapshot & CI Expectations

* Tests must run cleanly with `pnpm test`
* CI must pass before merge
* For snapshot logic, store expected values in `test-data/snapshots/`
* Use `.snapshot-hashes.json` for change tracking

---

## 🔍 Approved Utilities

| Purpose               | File                                |
| --------------------- | ----------------------------------- |
| Validate context logs | `scripts/validate.ts`               |
| Validate metrics      | `scripts/tools/validate-metrics.ts` |
| Convert JSONL → JSON  | `scripts/tools/convert-metrics.ts`  |

All scripts must be runnable via `pnpm run [script]`.

---

## 🚨 Failure Handling

* All thrown errors must be typed (e.g., `TelemetryError`, `FixContextError`)
* All error messages must be included in test assertions
* No stack traces in stdout unless the test is explicitly validating error paths

---

## 🏁 Final Checklist Before Merge

* [ ] All new modules have a `.test.ts` file
* [ ] All new functions are mocked and verified
* [ ] All metrics are asserted
* [ ] No AI or Git logic is executed in test
* [ ] `pnpm test`, `pnpm lint`, `pnpm build` pass

---

## 🔒 Codex Alignment

This testing protocol enforces:

* Codex Directive: "No silent failure, no ambiguity, no regressions"
* Dream-State Engineering: "Every line survives time and change"
* Cursor Compatibility: "Copilot-safe, traceable, explainable"

If a test makes assumptions, misses a failure case, or isn’t future-proof, it must be rewritten.

---

For questions, contact: **[debug-agent@canai.so](mailto:debug-agent@canai.so)**

> We do not test for green checks. We test for permanent clarity.
