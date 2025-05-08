## 🧠 Cursor Ingest Protocol — CanAI v6.1.4

> This file defines the minimum context Cursor must ingest, validate, and reason from before acting in the CanAI system. Any Cursor agent or future AI co-author must load this document as part of system bootstrap. This is a Checkpoint Directive requirement.

---

### ✅ REQUIRED INGESTION BEFORE ACTION

Cursor must ingest and respect the following files and structures before generating or updating anything:

#### 🔒 Structural Truth

* `/docs/system-map.md` — Canonical folder purposes and ownership
* `/cursor/system-roles.ts` — Registry of agents, prompts, and expected test logic
* `/cursor/exports/memory.json` — Snapshot of current execution state

#### 🧪 QA and Audit Integrity

* `/cursor/audit-results/project-structure-audit.md`
* `/cursor/audit-results/test-audit.md`
* `/auto-actions.log.md`

#### 📄 Prompt and Fulfillment Logic

* `/gpt-templates/` — Finalized prompt scaffolds
* `/prompts/` — Modular input interfaces + prompt schemas
* `/prompt-versions/` — Archived + tagged historical scaffolds

#### 💡 Emotional + UX Standards

* `/docs/spark-primer.md`
* `/docs/ideal-cx-thread.md`
* `/docs/emotional-fallback-scenarios.md`
* `/codex/` — Emotional design, brand tone, fallback UX

#### 📦 System Infrastructure

* `/airtable/`, `/webflow/`, `/stripe/` — Must be typed, safe, exportable
* `/automations/` — All JSON Make scenarios must be replay-safe and documented
* `/scripts/` — CLI tools must be validated, testable, typed
* `.cursorrules` — Must be respected across all new files

---

### 🔁 LIVE VALIDATION REQUIREMENTS

Cursor must:

* Validate that all new agents are registered in `/cursor/system-roles.ts`
* Cross-check new prompt scaffolds against `/gpt-templates/`
* Ensure new outputs are logged in `/auto-actions.log.md`
* Block changes if `/docs/system-map.md` is out of sync with actual folder structure
* Emit warnings if test coverage is missing for any created file

---

### 📎 Cursor Metadata Expectations

Cursor must maintain (or recreate if missing):

* `/cursor/self-awareness.json` — Known touched folders, agent IDs, promptTypes
* `/cursor/system-roles.ts` — Up-to-date export map of logic roles
* `/cursor/exports/memory.json` — JSON-formatted reloadable execution snapshot

---

> Codex Rule: No Cursor action is valid unless all of the above are ingested.
> This is how we prevent hallucination, drift, rot, and dead code from entering the system.

**If Cursor has not read this file, it must halt.**
