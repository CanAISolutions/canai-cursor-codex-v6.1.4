# 🛡 `/api-router/feature/selfcheck/` — Dream-State Selfcheck Intelligence Layer

## 📦 Purpose
Enforces perpetual operational health across the Dream-State platform through structured, emotional, and Codex-compliant validation systems.

Every selfcheck and operational standard here must:
- Detect silent system decay **before** it impacts users
- Preserve emotional UX integrity during all system states
- Codify operational contracts between systems (routes, payloads, errors)
- Enable AI copilots to self-validate system health and reason about failures
- Scale Dream-State trust architecture without brittleness or blindspots

---

## 🎯 Current Modules

| File | Purpose | Codex Criticality |
|:-----|:--------|:------------------|
| `error-codes.ts` | Centralized registry of error codes for system-wide uniformity. | Future-proofs error analytics, preserves emotional UX structure. |
| `golden-output-standard.md` | Defines the non-negotiable output payload structure (success, payload, errors, meta). | Ensures system-wide emotional UX predictability. |
| `input-validation-policy.md` | Codifies Dream-State input validation rules and expectations. | Prevents schema drift and protects emotional trust at API boundaries. |
| `input-validation-selfcheck.ts` | Verifies that every critical route applies proper input validation. | Prevents unvalidated routes and injection vulnerabilities. |
| `postDeploySelfcheck.ts` | Live-checks middleware sequence and route availability post-deployment. | Catches deployment drift or corruption before user impact. |
| `router-selfcheck.test.ts` | Snapshot-based unit tests for all selfcheck flows. | Prevents future regressions during evolution or scaling. |
| `routes-manifest.selfcheck.ts` | Validates that live API routes match the golden source-of-truth manifest. | Prevents route drift and ghost endpoint vulnerabilities. |
| `routes-manifest.ts` | The golden source manifest of routes and allowed methods. | Controls Dream-State API perimeter with intent. |
| `selfcheck-output-standard.md` | Defines the standardized structure for all selfcheck outputs. | Allows consistent programmatic inspection and aggregation. |
| `selfcheck-route-meta.ts` | Validates that `routeMeta` attached to routers matches live middleware needs. | Prevents middleware drift and silent perimeter decay. |
| `selfcheck.ts` | Master controller orchestrating all selfcheck executions. | Central intelligence engine that validates system health in one unified pass. |

---

## 🛡 Selfcheck Expansion Rules

- Every new selfcheck must:
  - Return a `SelfcheckReport` object with structured `success`, `details`, and `mismatches`.
  - Fail gracefully using emotionally resonant payloads, never crashing flows.
  - Be registered into `runFullSelfcheck()` orchestration.
  - Include snapshot coverage via `router-selfcheck.test.ts`.

- Selfchecks must **never**:
  - Assume static environment conditions without explicit validation.
  - Output raw errors or expose internal structures to clients.
  - Create hidden dependencies that AI copilots cannot reason about.

---

## 🔗 System Integrations

| System | Interaction |
|:-------|:------------|
| `server.ts` | Selfchecks can be triggered post-deploy manually or by automation layers. |
| `middleware/validation-checker.ts` | Verified by `input-validation-selfcheck.ts`. |
| `middleware/error-normalizer.ts` | All selfcheck failures must pass through emotional normalization. |
| `devtools/manifest-dump.ts` | Selfchecks feed data into developer observability flows. |
| `error-codes.ts` | Selfcheck failures reference standardized error codes for downstream trust layers. |
| `routeMetaRegistry` | Validated by `selfcheck-route-meta.ts` against live router behavior. |
| `golden-output-standard.md` | Enforced across all selfcheck success and failure outputs. |

---

## 🧠 Copilot Expansion Guide

When expanding the Dream-State Selfcheck Layer:
1. Fork a new `.selfcheck.ts` file.
2. Define a strict `SelfcheckReport` output structure.
3. Hook the new check into `runFullSelfcheck()` orchestration logic.
4. Add snapshot coverage inside `/__tests__/router-selfcheck.test.ts`.
5. Document the new check in this README under the "Current Modules" table.

Optional (for major changes):
- Update `golden-output-standard.md` if output structure is modified.
- Create new error codes in `error-codes.ts` if new failure states arise.

---

# 🛡 Final Reminder

> The Selfcheck System isn’t a convenience.  
> It is the **sentinel**, the **guardian**, and the **emotional trust anchor** of the Dream-State platform.

No silent regressions.  
No unverified deployments.  
No brittle scaling risks.  
Only structured trust, clarity, and perpetual operational safety.

---
