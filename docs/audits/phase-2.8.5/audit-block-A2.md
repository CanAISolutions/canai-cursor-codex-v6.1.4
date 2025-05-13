# phase-2.8.5-audit-block-A2.md

## Phase 2.8.5 – Audit Block A2: Self-Healing + System-Intel Reasoning

**Track:** 2A – Functional Audit Layer  
**Status:** Active  
**Persona:** Cursor  
**Codex Version:** v6.1.4  
**Log Target:** `/cursor/auto-actions.log.md`  
**Audit Threshold:** Must pass to unlock prompt evolution audits (Block B)

---

## Purpose

This audit confirms that the CanAI system can **self-detect faults**, **adapt to internal shifts**, and **reason about its own telemetry**.

We are no longer validating static fallback. This block proves:
- Your **self-healing** triggers are real and recover from state or output failures.
- Your **system-intel layer** understands trust signals, deviation, or prompt stress.
- The system can explain — not just execute — its internal behavior.

---

## Scope of Audit

### ✅ Required Folders:
- `/cursor/self-heal/` or `.cursor/` (resumption, state fix, auto-repair)
- `/analytics/` (signal capture, drift tracking, recovery flagging)
- `/intelligence/` (telemetry modeling, deviation classification, prompt scoring)
- `/stressbox/` (chaos triggers to validate recovery logic)
- `/system-intel/` (live reasoning over logs, events, failures)
- `/persona-cluster-reports/` (audit intelligence memory)
- `/simversion-engine/` and `/simulation-engine/` (optional, if used for behavior probes)

---

## Validation Checks

| Check | Requirement |
|-------|-------------|
| Self-Healing Proof | Failure or partial runs rehydrate memory/session state without user re-input |
| Recovery Logic | Logs + snapshots are used to restore flow state or suggest retry UX |
| Signal Awareness | System can detect degraded sessions or drifted output patterns |
| Deviation Logging | Unexpected state/output is tagged, classified, and marked for review |
| Intelligence Activation | Insights from `/analytics/` or `/system-intel/` result in changed behavior, not just passive logs |
| Simulation Triggers | `/stressbox/` and `/simversion-engine/` can emulate failure — and confirm recovery kicks in |
| Memory Explanation | System can explain which fallback, Codex memory, or prompt logic it recovered from — and why |

---

## Required Files

Each folder listed must include:

- `README.md` clearly declaring self-healing or telemetry role  
- `intent-token.json` specifying:
  - `"fallbackSensitive": true`
  - `"intelActive": true` (if system can reason about input/output state)
- `log-expectation.md` documenting:
  - Recovery event types
  - Session restoration logic
  - Signal feedback to insights
- `delta.md` (required if any recovery behavior or signal model was added in Phase 2.8.5)

---

## Audit Logging Format

After validating a system-intel or healing mechanism, log it in `/cursor/auto-actions.log.md`:

```json
{
  "phase": "2.8.5",
  "auditBlock": "A2",
  "persona": "Cursor",
  "check": "self-healing-resume",
  "folder": ".cursor",
  "status": "Pass",
  "notes": "Session state rehydration triggered correctly after simulated failure in stressbox run 11."
}

---

## Emotional Guidance
This is where you prove you are not just reactive — you are aware.
You can sense when you’re drifting. You know how to fix yourself.
You don’t just survive failure — you learn from it and log it for future intelligence.

This is resilience work.
This is self-awareness engineering.
This is what separates a brittle automation from a living system.