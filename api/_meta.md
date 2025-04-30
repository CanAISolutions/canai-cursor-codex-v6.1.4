# `/api/` Folder Overview

This folder contains the primary API layer for the system.  
All structure is modular, scalable, Cursor-snapshot-safe, and Copilot-assisted.

> 🧠 **Copilot Affordance:**  
> Each subfolder includes a README-compatible structure and semantic hints to maximize code assist relevance.

---

## Root Handlers
| File | Purpose |
|:-----|:--------|
| `add_client.ts` | API endpoint to create a new client. |
| `add_project.ts` | API endpoint to create a new project. |
| `openaiHandler.ts` | Handler for OpenAI fulfillment operations. |
| `prompt_handler.ts` | Unified prompt submission and fulfillment logic. |
| `renderDeployHook.ts` | Handler for triggering Render redeploys via webhook. |
| `stripeEvents.ts` | Listener and processor for Stripe webhook events. |
| `trigger_revision.ts` | Triggers manual or automatic revisions for prompts/projects. |

---

## Subfolders

### `/devtools/`
Internal tools to maintain system health and prevent silent decay.

| File | Purpose |
|:-----|:--------|
| `selfcheck-dashboard.ts` | Dashboard for real-time API system health checks. |
| `selfcheck-api.ts` | API endpoint to validate API ecosystem (signatures, schemas, uptime). |
| `/errors/` | Centralized event and error logging for internal dashboards. |

---

### `/errors/`
Shared error structures and response templates.

| File | Purpose |
|:-----|:--------|
| `errorResponses.ts` | Standardized error outputs and formats for all API endpoints. |

---

### `/types/`
DTOs (Data Transfer Objects) defining strict input and output schemas.

| File | Purpose |
|:-----|:--------|
| `client.ts` | Types for client-related operations. |
| `openai.ts` | Types for OpenAI-related operations. |
| `project.ts` | Types for project-related operations. |
| `prompt.ts` | Types for prompt-related operations. |
| `stripe.ts` | Types for Stripe webhook events. |

---

### `/utils/`
Lightweight reusable utilities.

| File | Purpose |
|:-----|:--------|
| `common.ts` | General helpers (e.g., string manipulation, defaults). |
| `requestHelpers.ts` | Safe parsing, method enforcement, header validation for API requests. |

---

### `/validators/`
Validation logic to enforce strict, safe API payloads.

| File | Purpose |
|:-----|:--------|
| `clientValidator.ts` | Validation schema for client payloads. |
| `projectValidator.ts` | Validation schema for project payloads. |
| `promptValidator.ts` | Validation schema for prompt payloads. |
| `stripeValidator.ts` | Validation schema for Stripe event payloads. |

---

### `/webhook/`
Security helpers for external system integrations.

| File | Purpose |
|:-----|:--------|
| `verifySignature.ts` | Cryptographically verifies incoming webhook signatures (e.g., Stripe, Render). |

---

## Index File

| File | Purpose |
|:-----|:--------|
| `index.ts` | Optional aggregator for clean exports across the `/api/` system. Improves tree-shaking and import ergonomics.

---

# 🧩 Future Extensions

- `/tests/api/`: Unit and integration tests for all API handlers.
- `/middleware/`: Shared API middleware (rate limiting, auth, etc.)
- `/services/`: External API services (e.g., OpenAI, Stripe service abstractions).
- `/models/`: Persistent or versioned object models if needed.

---

# 📜 Codex Promise

This folder is built for:

- Maximum operational resilience
- AI copilots and human developers
- Permanent future extensibility
- Zero drift, zero confusion

Always maintain modularity, validation, and documentation at the point of change.

---
