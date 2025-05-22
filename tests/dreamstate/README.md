# DreamState Test Suite

## Purpose
This folder contains the canonical DreamState test suite, enforcing emotional UX, schema resilience, trace continuity, fallback integrity, localization accuracy, security, and operational stability for all CanAI orchestrations.

## What
- Implements all 33 DreamState v1.0.4 tests as mandated by the Codex Lock Blueprint.
- Guarantees coverage for emotional drift, schema migration, agent workflows, fallback chains, chaos scenarios, and trustScore logic.
- Centralizes mocks and edge cases for full-system validation.

## Why
- Ensures no emotional, operational, or systemic degradation can compromise user trust or Codex pillars.
- Provides a single source of truth for system-critical validation, enforced by CI and Codex governance.

## How
- Each test is named and implemented per `/docs/DreamState-v1.0.4-Codex-Lock-Blueprint.md`.
- All tests are required; no bypass or modification is allowed without Codex Override.
- Mocks and edge cases are centralized in `/tests/mocks/dreamstate-core.ts`.
- All failures, chaos events, and regressions are logged and reflected in `/cursor/auto-actions.log.md` for audit and recovery.

**Codex Safeguard:**
If any required test or mock is missing, Sentinel auto-generates scaffolds using canonical templates. All test failures and regressions are logged for audit and Codex review. 