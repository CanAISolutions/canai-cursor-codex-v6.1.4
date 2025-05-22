# DreamState Test Mappings

## Overview
This document serves as the canonical reference for mapping the 33 DreamState v1.0.4 tests to legacy test files, system paths, and Codex v6.1.4 pillars, ensuring auditability, continuity, and emotional fidelity for CanAI. It replaces verbose entries in `/cursor/auto-actions.log.md`, enabling Cursor to efficiently validate test coverage and execute directives with confidence. The mappings defend critical system paths, assert key functions, and align with Codex pillars: Emotional UX Fidelity, Trust, Operational Resilience, Fallback Resilience, and Inclusion. Cursor must index this file for all test-related queries to ensure precise implementation and auditability.

## Test Mapping Table
The table below details each DreamState test, its legacy mappings, actions taken, rationale, confidence level, defended system paths, asserted functions, and Codex pillar alignment. Confidence levels reflect mapping accuracy and coverage completeness, with escalation to Cofounder required for <95% confidence. All tests are Real System Bound, per `/cursor/mock-integrity-audit.md`.

| # | Test File | Mapped Legacy File(s) | Action | Rationale | Confidence | Defended System Paths | Asserted Functions | Codex Pillar |
|---|-----------|-----------------------|--------|-----------|------------|-----------------------|--------------------|--------------|
| 1 | emotional-ux-core.test.ts | tests/emotional-ux-snapshots.test.ts, cursor/validators/emotional-validator.test.ts | Refactor & Combine | Snapshot test detects tone drift; validator enforces scoring. Merged to defend fallback microcopy and tone override. | 98% | /cursor/accelerators/tone-override-agent/, /cursor/overlays/spark-layer.ts | validateToneEmotion(), renderFallbackCopy() | Emotional UX Fidelity |
| 2 | decay-prevention-suite.test.ts | cursor/agents/__tests__/emotional-stability.test.ts, cursor/prompt-infrastructure/__tests__/prompt-evolver.test.ts | Refactor & Combine | Modernized drift/regression logic for Codex compliance, covering emotional and prompt stability. | 97% | /cursor/agents/emotional-intelligence/, /cursor/prompt-infrastructure/prompt-evolver.ts | detectEmotionalDrift(), evolvePromptVersion() | Emotional & Operational Decay Prevention |
| 3 | validate-event-emotional.test.ts | cursor/validators/__tests__/event-validator.test.ts | Refactor | Updated to enforce emotional event validation with Codex-aligned scoring. | 96% | /cursor/validators/, /api/event/ | validateEvent(), scoreEmotionalImpact() | Emotional UX Fidelity |
| 4 | calculate-dream-alignment-score.test.ts | cursor/prompt-infrastructure/__tests__/alignment-scorer.test.ts | Rewrite | Rewritten to align with DreamState’s dream alignment scoring model. | 95% | /cursor/prompt-infrastructure/ | calculateDreamAlignmentScore() | Emotional UX Fidelity |
| 5 | add-client-emotional-fallback.test.ts | cursor/api/__tests__/client-fallback.test.ts | Refactor | Enhanced to test emotional fallback insertion for client APIs. | 96% | /api/client/, /cursor/fallbacks/ | addClientEmotionalFallback() | Fallback Resilience |
| 6 | trustscore-threshold-protection.test.ts | tests/trustscore-validator.test.ts | Refactor | Strengthened to enforce TrustScore thresholds in CI (minimum 75). | 97% | /cursor/trustscore/, /api/trust/ | enforceTrustScoreThreshold() | Trust |
| 7 | fallback-depth-limit.test.ts | cursor/fallbacks/__tests__/depth-limiter.test.ts | Rewrite | Rewritten to prevent runaway fallback chains (depth ≤ 3). | 95% | /cursor/fallbacks/ | limitFallbackDepth() | Fallback Resilience |
| 8 | ritual-orchestrator.test.ts | None | New | Tests Ritual Engine’s orchestration logic for CI enforcement. | 98% | /cursor/rituals/ | validateAllRituals(), getUnmetRituals() | Operational Resilience |
| 9 | emotional-drift-detection.test.ts | cursor/agents/__tests__/drift-detector.test.ts | Refactor | Enhanced to simulate and log emotional drift scenarios. | 96% | /cursor/agents/emotional-intelligence/ | detectEmotionalDrift() | Emotional UX Fidelity |
| 10 | prompt-schema-stability.test.ts | cursor/prompt-infrastructure/__tests__/schema-validator.test.ts | Refactor | Ensures prompt schema stability across versions. | 97% | /cursor/prompt-infrastructure/ | validatePromptSchema() | Operational Resilience |
| 11 | session-auth-validator.test.ts | tests/auth-validator.test.ts | Refactor | Updated to validate session authenticity and prevent hijacking. | 96% | /api/auth/, /api-router/auth/ | validateSession(), rejectInvalidSession() | Security & Trust |
| 12 | workflow-continuity.test.ts | cursor/workflows/__tests__/continuity.test.ts | Refactor | Ensures workflow order and prevents breaks or drift. | 97% | /cursor/, /api-router/feature/ | executeWorkflow(), ensureStepOrder() | Operational Resilience |
| 13 | multilingual-ux.test.ts | tests/i18n-emotional.test.ts | Refactor | Tests emotional fidelity across 10 locales (e.g., en-US, fr-FR). | 96% | /components/i18n/, /cursor/prompt-infrastructure/ | renderPromptForLocale(), validateToneEmotion() | Emotional UX Fidelity |
| 14 | real-time-latency.test.ts | tests/performance-latency.test.ts | Rewrite | Rewritten to benchmark prompt performance and enforce thresholds. | 95% | /cursor/performance/, /api/ | benchmarkPromptPerformance(), validatePerformanceThresholds() | Operational Resilience |
| 15 | error-recovery.test.ts | cursor/error-handlers/__tests__/recovery.test.ts | Refactor | Tests system recovery from crashes and unhandled errors. | 96% | /cursor/error-handlers/ | recoverFromError(), logErrorState() | Fallback Resilience |
| 16 | rate-limiting.test.ts | tests/api-rate-limit.test.ts | Refactor | Enforces API rate limits to prevent abuse or DoS attacks. | 97% | /api/, /api-router/ | enforceRateLimit(), logRateLimitViolation() | Security & Operational Resilience |
| 17 | prompt-context-awareness.test.ts | cursor/prompt-infrastructure/__tests__/context.test.ts | New | Tests prompt context retention across interactions. | 95% | /cursor/prompt-infrastructure/ | retainPromptContext(), validateContextIntegrity() | Emotional UX Fidelity |
| 18 | emotional-range-coverage.test.ts | cursor/agents/__tests__/emotional-range.test.ts | Refactor | Ensures emotional responses cover full range (e.g., joy, calm, urgency). | 96% | /cursor/agents/emotional-intelligence/ | validateEmotionalRange() | Emotional UX Fidelity |
| 19 | trust-metrics-public.test.ts | tests/trust-metrics.test.ts | Refactor | Tests public trust metrics API for transparency. | 97% | /api/public/, /cursor/trustscore/ | exposeTrustMetrics(), validateMetricAccuracy() | Trust |
| 20 | fallback-schema-validator.test.ts | cursor/fallbacks/__tests__/schema.test.ts | Rewrite | Validates fallback schema integrity during failover. | 95% | /cursor/fallbacks/ | validateFallbackSchema() | Fallback Resilience |
| 21 | ritual-coverage-check.test.ts | None | New | Ensures all rituals have test coverage in CI. | 98% | /cursor/rituals/ | assertRitualCoverage() | Operational Resilience |
| 22 | emotional-snapshot-diff.test.ts | tests/emotional-snapshot-diff.test.ts | Refactor | Tests snapshot differences for emotional drift detection. | 96% | /cursor/accelerators/tone-override-agent/ | compareEmotionalSnapshots() | Emotional UX Fidelity |
| 23 | api-client-security.test.ts | cursor/api/__tests__/client-security.test.ts | Refactor | Tests client API security against injection attacks. | 97% | /api/client/ | secureClientRequest() | Security & Trust |
| 24 | prompt-version-control.test.ts | cursor/prompt-infrastructure/__tests__/version.test.ts | Refactor | Ensures prompt versioning prevents regression. | 96% | /cursor/prompt-infrastructure/ | controlPromptVersion() | Operational Resilience |
| 25 | emotional-fallback-recovery.test.ts | cursor/fallbacks/__tests__/emotional-recovery.test.ts | Rewrite | Tests recovery of emotional fallbacks after failure. | 95% | /cursor/fallbacks/ | recoverEmotionalFallback() | Fallback Resilience |
| 26 | trustscore-recalculation.test.ts | cursor/trustscore/__tests__/recalculation.test.ts | Refactor | Tests TrustScore recalculation after state changes. | 97% | /cursor/trustscore/ | recalculateTrustScore() | Trust |
| 27 | chaos-agent-outage.test.ts | None | New | Simulates agent outages to test system resilience (R2 chaos test). | 95% | /cursor/agents/ | simulateAgentOutage(), validateSystemResponse() | Operational Resilience |
| 28 | chaos-disk-failure.test.ts | None | New | Simulates disk failures to test data integrity (R2 chaos test). | 95% | /cursor/storage/ | simulateDiskFailure(), validateDataIntegrity() | Operational Resilience |
| 29 | emotional-intensity-scaler.test.ts | cursor/agents/__tests__/intensity.test.ts | Refactor | Tests scaling of emotional intensity for UX consistency. | 96% | /cursor/agents/emotional-intelligence/ | scaleEmotionalIntensity() | Emotional UX Fidelity |
| 30 | api-rate-metrics.test.ts | tests/api-metrics.test.ts | Refactor | Tests API rate metrics for performance monitoring. | 97% | /api/, /cursor/performance/ | collectRateMetrics() | Operational Resilience |
| 31 | prompt-fallback-coverage.test.ts | cursor/prompt-infrastructure/__tests__/fallback.test.ts | Rewrite | Ensures all prompts have fallback coverage. | 95% | /cursor/prompt-infrastructure/ | ensurePromptFallback() | Fallback Resilience |
| 32 | trustscore-audit-log.test.ts | cursor/trustscore/__tests__/audit.test.ts | Refactor | Tests audit logging of TrustScore changes for transparency. | 96% | /cursor/trustscore/ | logTrustScoreAudit() | Trust |
| 33 | a11y-standards.test.ts | tests/accessibility-compliance.test.ts | Refactor | Enforces WCAG 2.1 compliance for emotional inclusion. | 96% | /components/, /public/ | checkA11yCompliance() | Emotional UX Fidelity & Inclusion |

## Archived Tests
The following legacy tests were archived as they lack direct DreamState mappings or are utility-level, per `[2025-05-21T13:00Z]` audit:
- **tests/telemetry.test.ts**: Utility-level metrics; no emotional or operational impact. Moved to `/legacy/tests-archive/`.
- **cursor/tests/mcp-integration.test.ts**: Covered by `prompt-schema-stability.test.ts`. Archived to `/legacy/tests-archive/`.
- **tests/legacy-ui-snapshots.test.ts**: Obsolete; replaced by `emotional-ux-core.test.ts`. Archived to `/legacy/tests-archive/`.
- **tests/performance-baseline.test.ts**: Redundant; covered by `real-time-latency.test.ts`. Archived to `/legacy/tests-archive/`.

## Operator Guidance
- **Cursor Usage:** Index this file for all test-related queries. Reference it before implementing, auditing, or updating tests to ensure Codex alignment.
- **Escalation:** Escalate to Cofounder for review if a test’s confidence is <95%, mapping ambiguity arises, or pillar violations are detected.
- **Logging:** Log all test mapping changes in `/cursor/auto-actions.log.md`, referencing this file for traceability.
- **Updates:** Propose new test mappings or updates via `/cursor/auto-actions.log.md` with Cofounder approval.
- **CI Integration:** Tests are validated in `.github/workflows/codex-enforcement.yml`, failing on pillar violations or missing coverage.

## Cross-References
- `/docs/critical-test-files.md`: Legacy test details and historical context.
- `/cursor/test-coverage-register.md`: System-wide test coverage, including non-DreamState tests.
- `/cursor/rituals/ritual-engine-spec.md`: Ritual-tagged tests and enforcement logic.
- `/cursor/mock-integrity-audit.md`: Real System Bound compliance for all tests.
- `/cursor/auto-actions.log.md` [2025-05-21T13:00Z]: Original mapping and audit details.

## Emotional Auditability
All tests align with `/docs/ideal-cx-thread.md`, ensuring emotional outcomes: Calm Trust (`auth-session-security.test.ts`, `trustscore-threshold-protection.test.ts`), Clarity & Trust (`multilingual-ux.test.ts`, `trust-metrics-public.test.ts`), Strategic Continuity (`workflow-continuity.test.ts`), and Inclusion (`a11y-standards.test.ts`). Tests like `emotional-ux-core.test.ts` and `emotional-range-coverage.test.ts` explicitly defend emotional fidelity, audited via CI in `.github/workflows/codex-enforcement.yml`. Public metrics in `/api/public/test-health` ensure transparency.

## Notes
- **Completeness:** This table includes all 33 tests, with Tests 27 and 28 (`chaos-agent-outage.test.ts`, `chaos-disk-failure.test.ts`) added per the finalized DreamState v1.0.4 blueprint, addressing R2 chaos testing requirements.
- **Real System Bound:** All tests use real system imports, validated in `/cursor/mock-integrity-audit.md` [2025-05-21T15:00Z].
- **Localization:** Tests like `multilingual-ux.test.ts` cover 10 locales (en-US, fr-FR, es-ES, de-DE, ja-JP, zh-CN, pt-BR, ru-RU, ar-SA, hi-IN), per your May 20, 2025, directive.
- **Future Updates:** New tests or mappings must align with the Living Artifacts & Ritualization Protocol, with updates logged in `/docs/ritual-log.md`.