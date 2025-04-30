# 🧪 Dream-State Snapshot Test Coverage Manifest

## 📦 Purpose
Defines all current `/tests/` modules mapped to system criticality — ensuring Dream-State operational resilience, emotional UX integrity, and expansion safety.

This document must be updated as new systems, modules, and protections are added.

---

# 📂 Tests Overview

| Test File | Target System | Purpose |
|:----------|:--------------|:--------|
| `/tests/server.test.ts` | Server Boot + Routing | Validate server initialization, 404 golden fallback, internal error normalization, feature router health. |
| `/tests/devtools/errors-dashboard.test.ts` | Devtools Dashboard | Validate `/api/devtools/errors` endpoint availability, emotional payloads, and production lockout. |
| `/tests/selfcheck.test.ts` | System Healthcheck | Validate full selfcheck orchestration, golden output format, and operational integrity. |
| `/tests/middleware/error-event-capture.test.ts` | Middleware Error Capture | Validate smart error telemetry resilience, production safety, and emotional structure preservation. |
| `/tests/utils/standardizeSuccess.test.ts` | Golden Success Payload | Validate emotionally safe success payload generation and meta handling. |
| `/tests/utils/standardizeError.test.ts` | Golden Error Payload | Validate emotionally safe error payload generation and optional meta structure. |
| `/tests/tools/loadDreamstateConfig.test.ts` | Configuration Boot | Validate schema-driven config loading, operational boot safety, and snapshot protection. |

---

# 🛡 System-Wide Coverage Guarantees

✅ Emotional UX outputs (success, error)  
✅ Server lifecycle (boot, error handling, routing)  
✅ Middleware lifecycle (validation, auth, rate-limits, error capture)  
✅ Devtools observability (non-production only)  
✅ Selfcheck operational decay prevention  
✅ Config loading and schema validation safety

---

# 🧠 Expansion Rules for Future Tests

| When you add | You must also add |
|:-------------|:------------------|
| New feature router | `/tests/feature/{router}.test.ts` for endpoint validation. |
| New middleware | `/tests/middleware/{middleware}.test.ts` for input/output protection. |
| New devtools module | `/tests/devtools/{tool}.test.ts` for safe telemetry. |
| New utils/tools function | `/tests/utils/{function}.test.ts` or `/tests/tools/{function}.test.ts` for output standardization. |

---

# 📜 Final Reminder

> Dream-State systems are trusted through emotional resonance, operational resilience, and **invisible predictability**.  
>  
> Test coverage is **not an overhead** —  
> It is the **emotional perimeter fence** of the Dream-State platform.

Never ship without golden coverage.  
Never guess. Always protect.

---
