# 🛡 `/api-router/devtools/` — Dream-State Developer Tools Layer

## 📦 Purpose
Provides structured, emotionally safe diagnostic and introspection endpoints to assist trusted developers and copilots during development and scaling.

Every devtool must:
- Preserve emotional UX even under observability failure
- Be protected against unintended production exposure
- Enable clear, structured output for human and AI copilots
- De-risk operational blindspots by exposing critical system state safely
- Harden development workflows without introducing hidden security risks

---

## 🎯 Current Developer Tools

| File | Purpose | Codex Criticality |
|:-----|:--------|:------------------|
| `manifest-dump.ts` | Exposes the live `routeMetaRegistry` and system route states for developer inspection. | Enables fast debugging, Copilot reasoning, and route integrity checking. |

---

## 🛡 Developer Tools Expansion Rules

- Every new devtool must:
  - Fail gracefully if accessed outside of a safe environment (e.g., block or sanitize in production).
  - Output structured, emotionally safe payloads — not raw dumps or stack traces.
  - Use standardized success/error output formats.
  - Be documented with a `@codex` header block (purpose, system, criticality, version).
  - Be snapshot-safe for potential future QA automation.

- Devtools must **never**:
  - Leak internal secrets (ENV variables, tokens, internal-only error messages).
  - Expose system architecture paths that could aid malicious actors.
  - Break emotional UX even during observability failures.

---

## 🔗 System Integrations

| System | Interaction |
|:-------|:------------|
| `server.ts` | Devtools router (`/api/devtools`) mounted dynamically — only active outside production environments. |
| `routeMetaRegistry` | `manifest-dump.ts` introspects live route metadata for operational verification and development introspection. |
| `selfcheck/` | Future devtools may visualize selfcheck results or error code mappings. |
| `golden-output-standard.md` | All devtool outputs must conform to Dream-State emotional output standards.

---

## 🧠 Copilot Expansion Guide

When adding new developer tools:
1. Create a new `.ts` module under `/devtools/`.
2. Start file with a full `@codex` header block.
3. Ensure dynamic checks for production environment safety.
4. Standardize outputs using emotional UX-safe formats.
5. Document the new tool under "Current Developer Tools" in this README.
6. Optional: Provide `/__tests__/` coverage if tool output evolves dynamically.

---

# 🛡 Final Reminder

> Developer tools aren’t just conveniences.  
> In Dream-State systems, devtools **empower safe exploration**, **enhance emotional trust**, and **future-proof debugging experiences** for both humans and copilots.

No unsafe leaks.  
No raw fractures.  
No brittle tools that decay under pressure.  
Only structured clarity, emotional safety, and operational mastery.

---
