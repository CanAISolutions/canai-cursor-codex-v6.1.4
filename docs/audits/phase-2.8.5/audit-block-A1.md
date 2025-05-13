## Phase 2.8.5 – Audit Block A1: Core Fallback + Memory Validation

**Track:** 2A – Functional Audit Layer  
**Status:** Active  
**Persona:** Cursor  
**Codex Version:** v6.1.4  
**Log Target:** `/cursor/auto-actions.log.md`  
**Audit Threshold:** Must pass to unlock system-intel audits (Block A2)

---

## Purpose

You are now validating the *survivability layer* of the CanAI system.

This audit block confirms:
- Fallback logic is resilient, isolated, and testable.
- Memory modules are correctly injected, versioned, and restorable.
- Session continuity survives internal error, API fail, or partial completion.
- No memory drift, shadow logic, or undeclared state leakage occurs.

---

## Scope of Audit

### ✅ Required Folders:
- `/cursor/fallback/`
- `/cursor/memory/`
- `/gpt-templates/`
- `/api/add_project.ts` (memory injection trigger)
- `/cursor/session/` or `.cursor/` (state healing, continuity)
- `/analytics/` (telemetry validation)

### 🔍 Validation Checks:

| Check | Requirement |
|-------|-------------|
| Fallback Routing | All major failures route through `/cursor/fallback` logic without silent fails |
| Memory Injection | At least 24 memory modules injected during session start (Codex v6.1.4) |
| Recovery Resilience | Session state is recoverable from logs or cached memory |
| Version Locking | Memory injection refers to a versioned Codex (`v6.1.4` or pinned config) |
| Intent Drift Guard | Session data must persist intended `promptType` and key input vars |
| Output Continuity | Partial completions must not corrupt memory chain or hallucinate state |

---

## Required Files

Each folder listed must include:

- `README.md` declaring its fallback/memory role
- `intent-token.json` confirming fallback impact
- `log-expectation.md` (only if it parses, triggers, or logs system events)
- `delta.md` (if purpose has evolved since earlier Codex versions)

---

## Audit Logging Format

After verifying each folder or file, log the result in `/cursor/auto-actions.log.md`:

```json
{
  "phase": "2.8.5",
  "auditBlock": "A1",
  "persona": "Cursor",
  "check": "fallback-routing",
  "folder": "cursor/fallback",
  "status": "Pass",
  "notes": "All error states route to user-safe fallback with graceful UX."
}
```

Repeat for each check listed above.

---

## Emotional Guidance

This is not a technicality.  
This is the immune system of the platform.

Without this audit passing, memory is untrustworthy — and fallback becomes a gamble.  
This is your proof that **CanAI remembers, recovers, and protects trust by default.**

This is clarity work.  
This is trust architecture.
