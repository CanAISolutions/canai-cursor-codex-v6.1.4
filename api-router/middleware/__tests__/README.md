# 🛡 `/api-router/middleware/` — Dream-State Middleware Intelligence Layer

## 📦 Purpose
All middlewares in this layer enforce the Dream-State operational perimeter by adapting behavior dynamically, preserving emotional UX, and protecting system integrity.

Every middleware must:
- Safeguard user trust and emotional experience under all conditions
- Be modular, atomic, and independently testable
- Codify predictable failover behavior
- Support AI copilots through clear structure, meta annotations, and snapshot-ready design
- De-risk scaling risks by enabling graceful perimeter expansion

---

## 🎯 Current Middlewares

| File | Purpose | Codex Criticality |
|:-----|:--------|:------------------|
| `auth-checker.ts` | Dynamically enforces authentication based on `routeMeta`. | Prevents unauthorized access without breaking UX flows. |
| `burst-protection-middleware.ts` | Adds additional burst control protections at the router level. | Prevents mechanical traffic spikes from degrading service quality. |
| `dynamic-tier-burst.ts` | Dynamically throttles request bursts based on user tier (free, standard, premium, enterprise). | Maintains emotional pacing even under high load. |
| `error-event-logger.ts` | Captures structured error events for live inspection and telemetry. | Enables future error dashboards and trust signal analytics. |
| `handleRateLimitExceeded.ts` | Normalizes 429 responses into emotional, UX-preserving fallbacks. | Prevents harsh rate limit experiences that erode trust. |
| `middleware-manifest.ts` | Central source-of-truth manifest for middleware expectations. | Guarantees auditability and scaling resilience. |
| `rateLimit.ts` | Basic IP-based rate limiting middleware. | Protects API from abuse and unscalable traffic spikes. |
| `rate-limit-checker.ts` | Dynamically enforces rate limiting requirements based on `routeMeta`. | Ensures emotional UX continuity even during throttling. |
| `standardizeError.ts` | Provides reusable functions to format error objects to golden output. | Prevents inconsistent emotional payload structures. |
| `standardizeSuccess.ts` | Formats successful responses into golden emotional structures. | Guarantees UX consistency across all success paths. |
| `validation-checker.ts` | Dynamically enforces input validation requirements per `routeMeta`. | Protects the Dream-State boundary from invalid input intrusion. |
| `validateInput.ts` | Standalone middleware to apply strict Zod-based validation to routes. | Hardens API input structure predictability. |

---

## 🛡 Middleware Expansion Rules

- Every new middleware must:
  - Be an isolated, atomic Express middleware `(req, res, next) => {}`.
  - Fail emotionally — using standardized golden output payloads.
  - Snapshot-test critical behaviors inside `/__tests__/`.
  - Document purpose, system role, criticality, and version in a `@codex` header block.
  - Register clearly in the `middleware-manifest.ts` if core system impacting.

- Middlewares must **never**:
  - Crash system flows without a graceful UX fallback.
  - Leak raw or framework errors back to clients.
  - Introduce hidden silent drift without explicit version tagging.

---

## 🔗 System Integrations

| System | Interaction |
|:-------|:------------|
| `server.ts` | Middlewares registered globally in structured order (error event logger, then golden dynamic middlewares). |
| `routeMetaRegistry` | `authChecker`, `rateLimitChecker`, and `validationChecker` dynamically adapt based on live `routeMeta`. |
| `errorNormalizer.ts` | Final layer of error emotional UX normalization — post middleware chain. |
| `selfcheck-route-meta.ts` | Validates middleware execution pathways match declared routeMeta contracts. |

---

## 🧠 Copilot Expansion Guide

When expanding the Middleware Layer:
1. Fork from `/middleware/_templateMiddleware.ts` if available.
2. Create atomic middleware with clear `@codex-purpose`, `@codex-system`, `@codex-critical`, and `@codex-verified` blocks.
3. Build snapshot-safe test under `/__tests__/`.
4. Integrate into router or global flow explicitly.
5. Update `middleware-manifest.ts` if it impacts perimeter-critical behavior.

Optional:
- Update or snapshot adjust `selfcheck-route-meta.ts` if middleware behavior affects routeMeta pathways.

---

# 🛡 Final Reminder

> Middlewares are not mere technical filters.  
> In the Dream-State system, they are the **guardians of emotional trust**, the **architects of operational resilience**, and the **invisible caretakers of the user journey**.

No silent failures.  
No raw fractures.  
No brittle expansion risks.  
Only intentional protection, emotional clarity, and evolutionary strength.

---
