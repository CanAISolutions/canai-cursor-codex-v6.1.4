# phase-2.8.5-audit-block-C.md

## Phase 2.8.5 – Audit Block C: Legacy Autonomy + Boot Flow Integrity

**Track:** 2C – Functional Audit Layer  
**Status:** Active  
**Persona:** Cursor  
**Codex Version:** v6.1.4  
**Log Target:** `/cursor/auto-actions.log.md`  
**Audit Threshold:** Must pass to unlock integration audits (Block D) and system-wide chaos testing (Block E)

---

## Purpose

This block audits the **hidden backbone** of CanAI:
- Multi-phase startup flows
- Implicit logic
- Legacy scaffolds
- Environment-sensitive boot behavior

This ensures that **nothing loads without awareness, version safety, or declaration**. You are validating **how Cursor wakes up**, initializes trust memory, and prepares to serve users — without drift, ghosts, or legacy bleed.

---

## Scope of Audit

### ✅ Required Boot Functions (Codex-Aligned):

| Function | Required Logic | Mapped Locations |
|----------|----------------|------------------|
| **Codex-Aware Boot Plan** | Declares phase-based init logic, boot checkpoints, and fallback config | `/cursor/boot_sequence/`, `phase-gamma-initialization.md`, `system-propagation-checklist` |
| **System Init** | Loads memory modules, logs readiness state, emits Codex version | `/cursor/scripts/`, `/cursor/system-intel/`, `server.js`, `render.yaml` |
| **API Entrypoint** | Routes first request, sets session memory, routes `/api/add_project`, logs Codex ref | `api/index.ts`, `api/add_project.ts` |
| **Environment Hygiene** | Loads env vars, prevents drift, redacts secrets, confirms required flags | `.env`, `.env.local`, `.env.example` |
| **Legacy Isolation** | Legacy tools declared, wrapped, and blocked from interfering with Codex logic | `/cursor/scripts/`, `/legacy/`, manual CLI tools |
| **Security Guard** | Prevents execution of logic without Codex alignment or log memory | `.gitignore`, `scripts/`, `manual.ts`, `fs` scans |
| **Codex Contract Emitter** | System emits Codex version, fallback state, and init phase log | `server.js`, `analytics/startup.ts`, `/cursor/system-intel/boot-report.ts` |

---

## Validation Checks

| Check | Requirement |
|-------|-------------|
| Cursor Boot Declaration | Multi-phase boot sequence is declared, version-aligned, and recoverable |
| Legacy Isolation | Any CLI tools, old scripts, or scaffolds are protected and logged |
| Env Sanity | All `.env.*` files scoped to Codex-safe variables; secrets are redacted and documented |
| Entrypoint Logging | Boot log emits system ID, Codex version, and fallback readiness |
| Shadow Guard | No logic executes unless mapped to README, intent-token, or boot manifest |
| Render Predictability | Startup on Render confirms version control, memory injection, fallback config |
| Fallback Flow Readiness | If boot fails mid-phase, fallback triggers emit retry plan or self-heal instruction |

---

## Required Files

Each boot-critical folder or logic file must include:

- `README.md` stating role in init, protection, or routing  
- `intent-token.json` specifying:
  - `"legacySensitive": true`
  - `"codexOverrideAllowed": false` (unless explicitly allowed)
- `log-expectation.md` detailing:
  - Startup logs
  - Boot checkpoints
  - Environment variable protections
- `delta.md` if:
  - Boot logic or folder structure evolved from pre-Codex versions
  - `.env` structure changed, split, or replaced

---

## Audit Logging Format

Log boot validations in `/cursor/auto-actions.log.md`:

```json
{
  "phase": "2.8.5",
  "auditBlock": "C",
  "persona": "Cursor",
  "check": "multi-phase-init-checkpoint",
  "folder": "cursor/boot_sequence",
  "status": "Pass",
  "notes": "Boot flow follows phase-gamma-init → memory load → fallback prep. Codex version confirmed and emitted at start."
}
```

---

## Emotional Guidance

This is your system’s first breath.  
If it’s not intentional, it’s dangerous.

You are building **startup with memory**, not just launch.  
This is your declaration that nothing begins without Codex clarity.

This is **init safety work**.  
This is **trust before prompt**.
