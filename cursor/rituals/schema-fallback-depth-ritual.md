---
title: Polaris Ritual – Schema Fallback Depth Check
version: 1.0.1
ritual_id: ritual-005
codex_enforced: true
linked_test: DreamState Test #5
---

## Purpose
Ensures fallback logic across the system does not enter runaway or recursive fallback states. This guards against failure spirals and infinite retry loops.

## Mechanism
- Pulls current fallback depth from `CANAI_FALLBACK_DEPTH` environment variable or system fallback monitor.
- Compares to the Codex-defined max depth (`maxAllowed = 3`).
- Triggers failure and alert if depth is exceeded.

## Enforcement
- **CI:** Fails pipeline if fallback depth > maxAllowed.
- **Runtime:** Sentinel aborts rerun chains beyond depth limit.
- **Logging:** Logs to `/cursor/auto-actions.log.md`.
- **Trust Metrics:** Writes trustScore impact to `/trust/metrics.json`.

## Implementation
→ Code: `cursor/rituals/fallback-depth-limit.ts`  
→ Trigger: CI `ritual-runner` or preflight fallback guard  
→ Configurable: Yes, with `@codex-override` to raise depth limit  
→ Impact: -15 trustScore if violated  
