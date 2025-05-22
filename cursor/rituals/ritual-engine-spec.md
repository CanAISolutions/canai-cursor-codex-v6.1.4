# Ritual Engine Specification

## Overview
The Ritual Engine in `/cursor/rituals/` enforces Codex v6.1.4 pillars (Emotional UX Fidelity, Trust, Operational Resilience, Fallback Resilience) through runtime checks, CI integration, and test-driven enforcement. It prevents emotional drift, trust violations, and operational failures, ensuring CanAI’s alignment with the Polaris-DreamState-Codex-Lock Directive. This file is the canonical reference for ritual specifications, replacing verbose log entries in `/cursor/auto-actions.log.md`. Cursor must index this file to enforce rituals and validate tests with confidence.

## Canonical Rituals
The Ritual Engine comprises 7 canonical rituals, implemented as TypeScript files in `/cursor/rituals/`. Each ritual enforces specific Codex pillars and integrates with CI via `.github/workflows/ritual-check.yml`.

- **ritual-orchestrator.ts**:
  - **Purpose:** Orchestrates all rituals, ensuring complete coverage and CI enforcement.
  - **Exports:** `validateAllRituals()`, `getUnmetRituals()`, `assertRitualCoverage()`.
  - **Codex Pillar:** Operational Resilience.
  - **CI Behavior:** Fails CI if any ritual contract is unmet.
- **emotional-drift-detection.ts**:
  - **Purpose:** Simulates emotional drift scenarios, logs deltas, and enforces fidelity.
  - **Exports:** `detectEmotionalDrift()`, `logDriftDelta()`.
  - **Codex Pillar:** Emotional UX Fidelity.
  - **CI Behavior:** Fails CI if drift exceeds 5% without fallback.
- **trustscore-threshold-protection.ts**:
  - **Purpose:** Enforces TrustScore thresholds (minimum 75) for all interactions.
  - **Exports:** `enforceTrustScoreThreshold()`, `calculateTrustScore()`.
  - **Codex Pillar:** Trust & Operational Resilience.
  - **CI Behavior:** Fails CI if TrustScore < 75.
- **fallback-depth-limit.ts**:
  - **Purpose:** Prevents runaway fallback chains by limiting depth to 3.
  - **Exports:** `limitFallbackDepth()`, `checkFallbackChain()`.
  - **Codex Pillar:** Fallback Resilience.
  - **CI Behavior:** Fails CI if depth > 3.
- **prompt-schema-validator.ts**:
  - **Purpose:** Ensures prompt schema stability across versions.
  - **Exports:** `validatePromptSchema()`, `checkSchemaVersion()`.
  - **Codex Pillar:** Operational Resilience.
  - **CI Behavior:** Fails CI on schema drift.
- **client-emotional-fallback.ts**:
  - **Purpose:** Inserts emotional fallbacks for client API interactions.
  - **Exports:** `addClientEmotionalFallback()`, `validateFallbackInsertion()`.
  - **Codex Pillar:** Emotional UX Fidelity & Fallback Resilience.
  - **CI Behavior:** Fails CI if fallbacks are missing.
- **accessibility-checker.ts**:
  - **Purpose:** Enforces WCAG 2.1 compliance for emotional inclusion.
  - **Exports:** `checkA11yCompliance()`, `validateA11yStandards()`.
  - **Codex Pillar:** Emotional UX Fidelity & Inclusion.
  - **CI Behavior:** Fails CI on accessibility violations.

## Ritual-Tagged Tests
The following tests in `/tests/dreamstate/` enforce ritual contracts, tagged with `#ritual-*` for traceability. Each test maps to a Codex pillar, includes fallback coverage, and defends specific system paths.

| Test File | Function/Class | Codex Pillar | Ritual Tag | Fallback Coverage | Path |
|-----------|----------------|--------------|------------|-------------------|------|
| validate-event-emotional.test.ts | EmotionalValidator.validateEvent | Emotional UX Fidelity | #ritual-validate-event-emotional | Yes | /tests/dreamstate/validators/ |
| calculate-dream-alignment-score.test.ts | calculateDreamAlignmentScore | Emotional UX Fidelity | #ritual-calculate-dream-alignment-score | Yes | /tests/dreamstate/utils/ |
| add-client-emotional-fallback.test.ts | addClientEmotionalFallback | Emotional UX Fidelity & Fallback Resilience | #ritual-add-client-emotional-fallback | Yes | /tests/dreamstate/api/ |
| trustscore-threshold-protection.test.ts | enforceTrustScoreThreshold | Trust & Operational Resilience | #ritual-trustscore-threshold | Yes | /tests/dreamstate/validators/ |
| fallback-depth-limit.test.ts | limitFallbackDepth | Fallback Resilience | #ritual-fallback-depth-limit | Yes | /tests/dreamstate/utils/ |
| prompt-schema-stability.test.ts | validatePromptSchema | Operational Resilience | #ritual-prompt-schema | Yes | /tests/dreamstate/validators/ |
| a11y-standards.test.ts | checkA11yCompliance | Emotional UX Fidelity & Inclusion | #ritual-a11y-standards | Yes | /tests/dreamstate/system/ |

## CI Enforcement
- **Workflow:** `.github/workflows/ritual-check.yml` runs `validateAllRituals()` on every push/pull request.
- **Failure Conditions:**
  - Unmet ritual contracts (e.g., missing fallbacks, TrustScore < 75).
  - Emotional drift > 5% without fallback.
  - Accessibility or schema violations.
- **Approval:** Snapshot changes require two-person approval, logged in `/cursor/auto-actions.log.md`.

## Operator Guidance
- **Cursor Usage:** Index this file for all ritual-related queries. Reference it before implementing rituals, tests, or CI checks to ensure Codex alignment.
- **Escalation:** Escalate to Cofounder if ritual enforcement fails, confidence is <95%, or ambiguity arises.
- **Logging:** Log all ritual-related actions in `/cursor/auto-actions.log.md`, referencing this file.
- **Updates:** Propose ritual updates via `/cursor/auto-actions.log.md` with Cofounder approval.

## Cross-References
- `/cursor/rituals/README.md`: High-level ritual overview.
- `/docs/reference/dreamstate-test-mappings.md`: Test mappings for ritual-tagged tests.
- `/cursor/test-coverage-register.md`: System-wide tests supporting rituals.
- `/cursor/auto-actions.log.md` [2025-05-21T17:15Z]: Ritual scaffolding details.

## Emotional Auditability
Rituals align with `/docs/ideal-cx-thread.md`, defending emotional outcomes (Calm Trust, Clarity & Trust, Inclusion). Tests like `validate-event-emotional.test.ts` and `a11y-standards.test.ts` ensure fidelity and accessibility, validated via CI. Public metrics in `/api/public/ritual-health` provide transparency.