# Ritual Engine Enforcement Layer

## Purpose
The Ritual Engine is the integrity circuit for CanAI, enforcing emotional, operational, and trust contracts at runtime and in CI. Each ritual is mapped to a Codex Pillar, protects a specific emotional contract, and is enforced via CI hooks.

## Core Rituals (v1.0)

| Ritual Name                    | Codex Pillar                  | Emotional Contract Protected                        | CI Enforcement Behavior                      |
|-------------------------------|-------------------------------|----------------------------------------------------|----------------------------------------------|
| emotional-drift-detection      | Emotional UX Fidelity         | Prevents tone/structure drift (Ideal CX Thread)    | Fails if drift detected                      |
| trustscore-threshold-protection| Trust & Operational Resilience| Prevents trustScore drop below Codex threshold     | Fails if trustScore below threshold          |
| fallback-depth-limit           | Fallback Resilience           | Prevents runaway fallback chains, enforces max depth| Fails if fallback depth exceeded             |
| tone-continuity-cross-session  | Emotional UX Continuity       | Ensures tone/intent continuity across sessions     | Fails if continuity broken                   |
| session-init-memory-check      | Memory & State Integrity      | Ensures state memory is initialized and safe       | Fails if state memory missing or corrupted   |
| schema-change-alerting         | Schema Evolution & Safety     | Alerts on schema changes that risk emotional drift | Fails if unapproved schema change detected   |
| agent-empathy-sentinel         | Agent Empathy & Clarity       | Ensures agents maintain empathy and clarity        | Fails if empathy/clarity contract breached   |

## Enforcement Pattern
- Each ritual exports a check function returning `{ name, passed, details }`.
- `ritual-orchestrator.ts` runs all rituals and fails CI if any are unmet.
- All enforcement actions and deltas are logged to `/cursor/auto-actions.log.md`.
- Rituals are versioned and mapped to Codex Pillars for auditability.

## Example: emotional-drift-detection
- Enforces snapshot match for tone and structure across regenerated outputs.
- Logs all deltas and enforcement actions to `/cursor/auto-actions.log.md`.
- Fails CI if drift is detected.

---

**Codex Safeguard:** No ritual may be marked complete unless it is real-system bound, emotionally auditable, and CI-enforced. 