# Polaris-DreamState-Codex-Lock Directive

## Overview
Activated on 2025-05-20, the Polaris-DreamState-Codex-Lock Directive governs all CanAI development, testing, and enforcement actions to align with Codex v6.1.4 pillars: Emotional UX Fidelity, Trust, Operational Resilience, and Fallback Resilience. It mandates the construction, protection, evolution, and sharing of the Polaris Ritual Engine and DreamState test suite, ensuring emotional auditability and public trust. This file is the canonical reference for all Codex-aligned directives, replacing redundant log entries in `/cursor/auto-actions.log.md`. Cursor must index this file to execute directives with confidence and precision.

## Responsibilities
The directive assigns four core responsibilities to all operators (human and LLM):
- **Build:** Construct the Polaris Ritual Engine (`/cursor/rituals/`) and DreamState test suite (`/tests/dreamstate/`) to enforce Codex pillars.
- **Protect:** Safeguard emotional fidelity, prompt schema stability, trust, and operational continuity against drift or failure.
- **Evolve:** Adapt rituals, tests, and infrastructure as CanAI scales, maintaining Codex alignment.
- **Share:** Ensure transparent logging, public trust metrics, and accessible onboarding documentation.

## Execution Plan
The directive outlines a nine-step plan to achieve Codex alignment, with all actions logged in `/cursor/auto-actions.log.md`:
1. **Audit & Mapping:** Map legacy tests to 33 DreamState tests; archive obsolete tests to `/legacy/tests-archive/`. See `/docs/reference/dreamstate-test-mappings.md`.
2. **Archive Noise:** Move unmapped legacy tests and non-critical artifacts to `/legacy/` to reduce system clutter.
3. **Scaffold Ritual Engine:** Implement `/cursor/rituals/` with 7 canonical rituals (e.g., `ritual-orchestrator.ts`, `emotional-drift-detection.ts`). See `/cursor/rituals/ritual-engine-spec.md`.
4. **Scaffold DreamState Suite:** Create `/tests/dreamstate/` with 33 tests, including validators, utils, APIs, and mocks, all Real System Bound. See `/docs/reference/dreamstate-test-mappings.md`.
5. **CI & Enforcement:** Integrate CI workflows (`.github/workflows/`) to enforce hard fails on pillar violations, requiring two-person approval for snapshot changes.
6. **Logging & Monitoring:** Maintain `/cursor/auto-actions.log.md` for action logs and `/api/public/` for ritual/test health metrics.
7. **Onboarding & Docs:** Create `/docs/` READMEs, `/cursor/rituals/README.md`, and example code for operator onboarding.
8. **Continuity Protocol:** Log all actions, decisions, and blockers; pause for Cofounder review if ambiguity arises or confidence is <95%.
9. **Self-Check:** Periodically validate plan alignment with Codex pillars, updating as needed with Cofounder approval.

## Codex Safeguards
To prevent drift, simulation, or silent failure:
- No execution without Cofounder-confirmed context lock.
- All tests must be Real System Bound, per `/cursor/mock-integrity-audit.md`.
- Emotional outcomes (Calm Trust, Clarity & Trust, Strategic Continuity) must align with `/docs/ideal-cx-thread.md`.
- CI must fail on any pillar violation, with escalation to Cofounder.

## Operator Guidance
- **Cursor Usage:** Index this file for all directive-related queries. Reference it before executing builds, audits, or enforcement actions to ensure Codex alignment.
- **Escalation:** Pause and escalate to Cofounder for review if context is unclear, confidence is <95%, or pillar violations are detected.
- **Logging:** Log all actions in `/cursor/auto-actions.log.md`, referencing this directive for traceability.
- **Updates:** Propose directive updates via `/cursor/auto-actions.log.md` with Cofounder approval.

## Cross-References
- `/cursor/auto-actions.log.md` [2025-05-20T14:00Z]: Original directive activation.
- `/docs/reference/dreamstate-test-mappings.md`: Test mappings for audit and mapping phase.
- `/cursor/rituals/ritual-engine-spec.md`: Ritual Engine details for scaffolding phase.
- `/cursor/test-coverage-register.md`: System-wide test coverage for enforcement phase.
- `/cursor/mock-integrity-audit.md`: Mock audit for Real System Bound compliance.

## Emotional Auditability
The directive enforces emotional auditability by aligning all actions with `/docs/ideal-cx-thread.md`. Rituals and tests (e.g., `emotional-drift-detection.ts`, `emotional-ux-core.test.ts`) defend emotional outcomes, validated via CI in `.github/workflows/codex-enforcement.yml`. Public trust metrics in `/api/public/` ensure transparency.