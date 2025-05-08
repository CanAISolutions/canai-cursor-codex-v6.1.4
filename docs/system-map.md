## 📁 CanAI System Map — Codex v6.1.4 Structural Truth (as of 2025-05-07)

> This document defines the full folder structure, purpose, audit expectations, and ownership logic for the CanAI system. Cursor and any co-authoring agent must load, reason from, and respect this map. All development must align with this structure.

---

### ✅ PRIMARY SYSTEM FOLDERS

| Folder              | Purpose                                                                  | Audit Rules                                                                                      | Owner              |
| ------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------ |
| `/cursor/`          | Agents, engines, overlays, system logic. Primary AI orchestration layer. | All files must be exported, tested, and emotionally aligned. `/cursor/exports/` must be tracked. | Cursor + Cofounder |
| `/api/`             | Core API endpoints (declarative, request-safe logic).                    | Must be typed, versioned, and fully covered.                                                     | Cofounder          |
| `/api-router/`      | Custom routing/middleware. (Should merge with `/api`).                   | Flagged for merge.                                                                               | Cofounder          |
| `/agents/`          | Legacy or modular agent logic.                                           | Must be tested and either merged into `/cursor/` or removed.                                     | Cursor             |
| `/gpt-templates/`   | Long-form locked fulfillment logic.                                      | Must map 1:1 with promptTypes. Versioning required.                                              | Cursor             |
| `/prompt-versions/` | Archived prompt versions.                                                | Must be auditable. Codex-style metadata required.                                                | Cursor             |
| `/prompts/`         | Active prompt scaffolds and interfaces.                                  | Must use behavior-contract.md, prompt-schema.md, and self-check-blocks.md.                       | Cursor             |
| `/tests/`           | Global test suites.                                                      | Must track coverage per folder. No folder may lack tests.                                        | Cursor + Cofounder |
| `/docs/`            | Codex references, emotional UX guides, audit protocols.                  | All system truths live here.                                                                     | Cofounder          |
| `/scripts/`         | CLI tools for automation, audit, or repair.                              | Must be documented in README and typed.                                                          | Cofounder          |
| `/airtable/`        | Airtable sync logic, schema definitions, ops clients.                    | Must be typed, safe, and tracked.                                                                | Cursor + Cofounder |
| `/webflow/`         | CMS integration and deployment sync logic.                               | Must align with Make + Memberstack. Testable.                                                    | Cursor             |
| `/stripe/`          | Billing, pricing logic, hooks, fraud protection.                         | Requires audit-safe event handling and test coverage.                                            | Cofounder          |
| `/automations/`     | Make-compatible JSON scenarios, Webhook builders, enrichers.             | Must be replay-safe.                                                                             | Cursor             |
| `/analytics/`       | Logging, margin tracking, feedback ingestion.                            | Must log all critical session data.                                                              | Cursor + Cofounder |
| `/emails/`          | Email templates, triggers, and lifecycle logic.                          | All templates must be reuse-safe and tone-aware.                                                 | Cursor             |
| `/render/`          | Render deployment logic, YAMLs, .env config, health checks.              | Locked infrastructure folder.                                                                    | Cofounder          |
| `/codex/`           | Internal rules, fallback systems, tone contracts.                        | Must not drift. Canonical Codex logic lives here.                                                | Cofounder          |
| `/cx/`              | UX logic, overlays, tone handlers.                                       | Must respect dream-state principles.                                                             | Cursor + Cofounder |

---

### ⚠️ SECONDARY & OPTIONAL FOLDERS

| Folder                                 | Notes                                                 |
| -------------------------------------- | ----------------------------------------------------- |
| `/canai-orbital/`                      | Experimental — must justify existence or be removed.  |
| `/pr-templates/`                       | Legacy GitHub files. May be merged into `/.github/`.  |
| `/test-data/`                          | Should be moved to `/tests/fixtures/` and documented. |
| `/public/`, `/assets/`, `/components/` | Must be usage-tracked or deleted.                     |
| `/manifest/`, `/version/`              | System ledger files. Must be owned by Codex.          |
| `/user/`, `/dist/`, `/coverage/`       | Ignore or remove from repo.                           |

---

### 🔁 SYSTEM MAINTENANCE EXPECTATIONS

* All folders must be:

  * Owned
  * Purposeful
  * Testable
  * Scanned in every audit

* No duplicate folders should exist across `/api`, `/cursor`, `/prompts`, etc.

* All agents must be referenced in `/cursor/system-roles.ts`.

* All outputs must be versioned or safely exported.

* All `/scripts/` must have type annotations and CLI-safe usage.

> If Cursor or any AI agent cannot explain the purpose of a folder, it must halt execution and request clarification.

---

This map defines your authority, your limits, and your responsibility.
If you are Cursor, you are now expected to enforce this structure and validate all assumptions against it.

**Codex-enforced. Checkpoint-locked. Auditable. Real.**
