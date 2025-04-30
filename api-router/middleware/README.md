# 🛡 `/api-router/middleware/` — Dream-State Middleware System

## 📦 Purpose
All middleware in this folder serves to modularize, enforce, and protect the Dream-State operating perimeter across the API Router system.

Every middleware must:
- Preserve emotional UX safety
- Be snapshot-testable
- Support AI copilots via clear structure and expansion guides
- De-risk operational decay
- Enable future scaling gracefully

---

## 🎯 Current Middlewares

| File | Purpose | Codex Criticality |
|:---|:---|:---|
| `error-normalizer.ts` | Standardizes all error outputs into Dream-State emotionally intelligent structures. | Prevents raw error leaks and emotional UX fractures. |
| `handleRateLimitExceeded.ts` | Provides UX-preserving fallback for rate limit overloads. | Prevents raw 429 errors and preserves user trust under high load. |
| `rateLimit.ts` | Enforces basic in-memory IP-based request limiting. | Protects against API abuse and system overload during early scaling. |
| `validateInput.ts` | Validates incoming request bodies, queries, and params using Zod schemas. | Prevents silent schema drift and input structure decay. |

---

## 🛡 Middleware Expansion Rules

- Every new middleware must:
  - Be created as an isolated atomic function.
  - Expose predictable signature: `(req, res, next) => {}`.
  - Fail emotionally and Codex-compliantly if needed.
  - Include a snapshot-safe test in `/__tests__/`.
  - Document purpose and criticality in top-level JSDoc comment block.

- Middleware must **never**:
  - Bypass Codex emotional UX fallbacks.
  - Create silent operational risks without explicit failovers.
  - Introduce environmental drift (e.g., ENV-check logic must be explicit).

---

## 🔗 System Integrations

| System | Interaction |
|:---|:---|
| `server.ts` | All middlewares applied globally or at router level. |
| `router-selfcheck.test.ts` | Indirectly validates middleware-preserved perimeter (errors, auth, limits). |
| `output-standardization.md` | Middlewares must conform to standard output structures. |
| `dream-state-checklist.md` | Middleware behaviors contribute directly to Dream-State scoring. |

---

## 🧠 Copilot Expansion Guide

When a Copilot or developer wants to add a new middleware:
1. Fork from `/middleware/_templateMiddleware.ts` (if exists).
2. Build atomic unit.
3. Snapshot-test behavior under `/__tests__/`.
4. Document file with Codex header block.
5. Register middleware thoughtfully in relevant routers or globally.

---

# 🛡 Final Reminder

> Middlewares **aren't** just technical tools.  
> In Dream-State systems, they **protect trust**, **preserve emotional resonance**, and **scale operational resilience**.

No silent failures.  
No ugly breakpoints.  
No brittle expansion.  
Only elegance, clarity, and emotional integrity.

---
