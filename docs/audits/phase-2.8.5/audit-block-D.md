# phase-2.8.5-audit-block-D.md

## Phase 2.8.5 – Audit Block D: Integrations + Plugin Routing

**Track:** 2D – Functional Audit Layer  
**Status:** Active  
**Persona:** Cursor  
**Codex Version:** v6.1.4  
**Log Target:** `/cursor/auto-actions.log.md`  
**Audit Threshold:** Must pass to unlock testing logic (Block E) and prepare for system-wide agent simulation

---

## Purpose

This block validates every path that crosses **in or out of the system** — from plugins to Webflow calls to async pub/sub flows.

You are confirming that:
- All integrations are observable and fallback-aware
- Plugin logic is sandboxed, loggable, and versioned
- Services are modular, retry-safe, and trackable
- No external call executes without guardrails or memory

This is your **external boundary safety pass** — no more shadow APIs or brittle ops glue.

---

## Scope of Audit

### ✅ Required Integration & Plugin Zones

| Zone | Purpose | Folder |
|------|---------|--------|
| **Plugin Interfaces** | Modular logic injected into core flows | `/cursor/plugins/` |
| **Event Handling** | Async flows, retryable signals | `/cursor/event-bus/`, `/cursor/services/` |
| **Service Logic** | Internal helpers, translation layers | `/cursor/services/`, `/cursor/utils/` |
| **Platform Bridges** | Webflow, Render, Airtable, Klaviyo, etc. | `/cursor/webflow/`, `/render.yaml`, `/api-router/` |
| **Render Deployment Routing** | Startup targets, build path signals | `render.yaml`, `server.js` |
| **Webflow Exports** | Asset pipelines, CMS mutation flows | `/cursor/webflow-exports/`, `/cursor/assets/` |
| **Third-Party Scripts** | Retry-safe third-party logic | `/scripts/`, `/api/`, `/cursor/ai-ops/` (if applicable) |

---

## Validation Checks

| Check | Requirement |
|-------|-------------|
| Plugin Wrapping | All plugin calls are versioned, fallback-safe, and declared via `intent-token.json` |
| Retry Logic | Event-driven or async services include retries, log fallback on fail |
| Integration Scoping | External services only interact through dedicated, declarative handlers |
| Failover Visibility | If Airtable/Webflow/Klaviyo fails, system logs + triggers fallback |
| Pub/Sub Logging | Event-bus activity is logged, replayable, and attached to session ID |
| Plugin Autonomy Limits | Plugins may not mutate state or inject unless authorized by Codex memory |
| Render Bridge | Deployments are mapped to known Codex version + fallback plan |
| Output Isolation | External-facing calls (emails, web, assets) use safe wrappers and logging

---

## Required Files

Each folder or service listed must include:

- `README.md` describing integration strategy or plugin scope  
- `intent-token.json` specifying:
  - `"fallbackSensitive": true`
  - `"integrationBound": true`
  - `"codexOverrideAllowed": false` (unless explicitly mapped to memory modules)
- `log-expectation.md` describing:
  - Integration triggers
  - Fallback paths
  - Retry or dead-letter behavior
- `delta.md` if:
  - Plugins were added/refactored
  - Event routing changed since Phase 2.8.4

---

## Audit Logging Format

Log validation results in `/cursor/auto-actions.log.md`:

```json
{
  "phase": "2.8.5",
  "auditBlock": "D",
  "persona": "Cursor",
  "check": "plugin-sandbox-check",
  "folder": "cursor/plugins",
  "status": "Pass",
  "notes": "Plugins are fallback-wrapped, versioned, and logged on invocation. Codex overrides blocked."
}

---

Emotional Guidance
This is your boundary check.
This is where you prove the outside world can’t break you.

You are showing that nothing connects to CanAI unless it earns your trust.

This is integration safety work.
This is plugin immunity architecture.

---

This audit creates a firewall of clarity — every integration becomes legible, loggable, and self-defending.
