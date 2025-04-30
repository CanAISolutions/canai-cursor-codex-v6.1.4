# 🛡 `/api-router/utils/` — Dream-State Utility Intelligence Layer

## 📦 Purpose
Centralizes small but critical helper functions that protect Dream-State operational structure, standardize emotional UX outputs, and prevent silent contract drift across the platform.

Every utility must:
- Be modular, pure, and independently testable
- Preserve emotional payload structures across success and failure paths
- Harden input/output validation against accidental drift
- Enable AI copilots to predict behavior and safely extend
- Prevent operational decay during scaling or feature expansion

---

## 🎯 Current Utilities

| File | Purpose | Codex Criticality |
|:-----|:--------|:------------------|
| `error-normalizer.ts` | Normalizes all raw errors into emotional golden output structures. | Prevents framework leakages and harsh UX failures. |
| `input-validation.ts` | Core input validation enhancer (ties schema validation to Dream-State expectations). | Protects against API drift and validation decay. |
| `output-standardization.ts` | Provides golden success and error response structures for API consistency. | Guarantees emotional UX trust at every API interaction. |
| `standardizeError.ts` | Helper to format standardized error payloads. | Prevents structural drift across failure pathways. |
| `standardizeSuccess.ts` | Helper to format standardized success payloads. | Protects UX consistency and response predictability. |
| `server.ts` | Local server utilities for dynamic router management and meta operations. | Enables modular router loading and live adaptability. |

---

## 🛡 Utility Expansion Rules

- Every new utility must:
  - Be a pure, side-effect free function unless explicitly required otherwise.
  - Support full snapshot-ready unit tests in `/__tests__/`.
  - Export only clearly documented, predictable interfaces.
  - Be annotated with a `@codex-purpose`, `@codex-system`, `@codex-critical`, and `@codex-verified` header.
  - Conform to Dream-State emotional payload and output expectations.

- Utilities must **never**:
  - Mutate shared global state silently.
  - Create invisible coupling between modules.
  - Drift from golden payload formats without versioned justification.

---

## 🔗 System Integrations

| System | Interaction |
|:-------|:------------|
| `middleware/` | Depends on `standardizeError`, `standardizeSuccess`, and `error-normalizer` for payload emotional safety. |
| `feature/posts/` | Utilizes `validateInput` and `output-standardization` to enforce input correctness and response uniformity. |
| `selfcheck/` | Relies on `output-standardization` for selfcheck report payloads. |
| `server.ts` (root) | Depends on local `server.ts` helpers for router registration and meta handling. |

---

## 🧠 Copilot Expansion Guide

When expanding the Utilities Layer:
1. Create a new `.ts` file under `/utils/`.
2. Begin file with `@codex` meta block (purpose, system, criticality, version).
3. Write pure, documented functions or helpers.
4. Add corresponding unit tests under `/utils/__tests__/`.
5. If the utility affects payload structures, update documentation in `output-standardization.md`.

Optional:
- If altering emotional output structures, snapshot test full API output flows to ensure Dream-State compliance.

---

# 🛡 Final Reminder

> Utilities aren’t random helpers.  
> In Dream-State systems, utilities **lock operational contracts**, **preserve emotional experience**, and **shield trust structures** against invisible drift.

No silent corruption.  
No brittle code smells.  
No unpredictable expansions.  
Only modularity, predictability, and emotional precision.

---
