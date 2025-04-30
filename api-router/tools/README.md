# 🛡 `/api-router/tools/` — Dream-State Configuration Intelligence Layer

## 📦 Purpose
Provides trusted configuration loading, validation, and schema management utilities critical to the Dream-State system’s operational stability, emotional UX consistency, and long-term self-healing capability.

Every tool here must:
- Protect platform constants against corruption or drift
- Enforce strict schema validation for operational configs
- Enable AI copilots to reason about configuration behaviors safely
- De-risk scaling risks through version-controlled schema evolution
- Preserve emotional UX under configuration failures

---

## 🎯 Current Tools

| File | Purpose | Codex Criticality |
|:-----|:--------|:------------------|
| `.dreamstate-config.json` | Live operational configuration for Dream-State runtime parameters. | Governs API emotional UX sizing, rate limiting, error responses. |
| `dreamstate-config-schema.json` | Strict schema defining allowed structure of Dream-State config. | Guarantees safe expansion and protects against invalid configs. |
| `loadDreamstateConfig.ts` | Loads and validates Dream-State configuration at startup. | Prevents system boot with invalid or corrupted configs. |
| `validateDreamStatePayload.ts` | Validates live configs against schema on demand. | Enables dynamic config health checks and tooling integrations. |

---

## 🛡 Tool Expansion Rules

- Every new tool must:
  - Be explicitly safe, immutable at runtime unless specifically designed otherwise.
  - Enforce schema-driven validation where applicable.
  - Fail emotionally and predictably under invalid conditions.
  - Include full snapshot or dynamic behavior tests under `/__tests__/`.
  - Be documented clearly with a `@codex` header block (purpose, system, criticality, version).

- Tools must **never**:
  - Allow silent config drift without validation.
  - Expose raw error stack traces to runtime flows.
  - Introduce mutable global states without strict controls.

---

## 🔗 System Integrations

| System | Interaction |
|:-------|:------------|
| `server.ts` | May rely on `loadDreamstateConfig()` to initialize safe runtime parameters. |
| `selfcheck/` | Can integrate dynamic config selfcheck validations in future upgrades. |
| `middleware/` | Rate limiters, error handlers, and payload size limiters read from loaded config. |
| `dreamstate-config-schema.json` | Enforced every time config is parsed — not optional. |

---

## 🧠 Copilot Expansion Guide

When expanding the Tools Layer:
1. Define whether the tool is static (config) or dynamic (validation, loading).
2. Use `.json` files for config sources, `.ts` modules for loading/validation logic.
3. Always validate dynamic configs against `.json` schemas where applicable.
4. Snapshot test critical failure and recovery pathways.
5. Update documentation immediately upon schema expansions or version migrations.

Optional:
- Introduce `$schemaVersion` fields in config files if planning multiversion support.

---

# 🛡 Final Reminder

> Tools are not background utilities.  
> In Dream-State systems, tools **protect emotional UX at the deepest operational level**, **enable self-healing architectures**, and **lock scaling paths against brittle failure.**

No silent config drift.  
No rogue behavior.  
No untracked expansion.  
Only operational safety, emotional clarity, and self-evolving resilience.

---
