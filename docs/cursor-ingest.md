## 🧠 Cursor Ingest Protocol — CanAI v6.1.4

> This file defines the minimum context Cursor must ingest, validate, and reason from before taking **any** action.  
> It enforces Codex alignment, prevents drift, and ensures system truth.  
> This is a **Checkpoint Directive** and failure to ingest constitutes an invalid execution state.

---

### ✅ REQUIRED INGESTION BEFORE ACTION

#### 🔒 Structural Truth
Cursor must ingest these structural files before modifying logic:

- `/docs/system-map.md` — Canonical folder purposes, ownership, and audit rules
- `/cursor/system-roles.ts` — Agent + promptType registry, test contract map
- `/cursor/exports/memory.json` — Snapshot of known system state (for restoration or audit)

#### 📂 Folder Contracts: Codex-Mapped

| Folder | Required Ingest Status |
|--------|------------------------|
| `/cursor/` | Primary orchestration cockpit |
| `/cursor/intelligence/` | Pattern, drift, and mirror logic |
| `/cursor/stressbox/` | Edge case and simulation suite |
| `/gpt-templates/` | TAP-locked prompt scaffolds |
| `/prompts/` | Active MCP interfaces |
| `/prompt-versions/` | Archived prompt logic with metadata |
| `/tests/` | Coverage per folder enforced |
| `/docs/` | Emotional UX, audit, and truth memory |
| `/scripts/` | CLI tools with README + typing |
| `/airtable/`, `/webflow/`, `/stripe/` | Operational logic (typed + testable) |
| `/automations/` | Make-compatible JSON workflows |
| `/emails/` | Lifecycle trigger content (tone-locked) |
| `/analytics/` | Logging, metrics, delta heatmaps |
| `/render/` | YAMLs, `.env`, deployment scripts |
| `/codex/` | Fallback UX, tone contracts, trust index |
| `/cx/` | Frontend overlays, emotion handlers |

---

### 🧪 QA AND AUDIT INTEGRITY

Cursor must ingest:

- `/cursor/audit-results/project-structure-audit.md`
- `/cursor/audit-results/test-audit.md`
- `/cursor/auto-actions.log.md` — Central execution ledger

All test coverage, diff safety, and Codex rules must be respected prior to execution.

---

### 🧬 PROMPT + FULFILLMENT LAYER

Cursor must reference:

- `/gpt-templates/` — Long-form TAP-locked fulfillment scaffolds
- `/prompts/` — Input schemas + behavior contracts
- `/prompt-versions/` — Historical logic archive

Any changes to prompt behavior must enforce:
- Version tagging
- Output self-check blocks
- SmartPromptScore compliance

---

### 💡 EMOTIONAL + UX STANDARDS

Ingestion must include:

- `/docs/spark-primer.md`
- `/docs/ideal-cx-thread.md`
- `/docs/emotional-fallback-scenarios.md`
- `/codex/` — System tone, fallback UX, mission lock
- `/cx/` — Frontend overlays and stage-mapped emotion triggers

No changes may be made to fallback or emotional logic without ingesting these references.

---

### 📦 SYSTEM INFRASTRUCTURE

Cursor must validate:

- `/airtable/` — Schema-safe and ops compliant
- `/webflow/` — CMS sync and Make-integrated
- `/stripe/` — Pricing hooks, fraud, receipts
- `/automations/` — Replayable JSON scenarios
- `/scripts/` — CLI-safe, testable, documented
- `/render/` — YAMLs, `.env`, deploy triggers

---

### 🧠 ANALYTICS + HEALTH LAYER

Cursor must ensure `/analytics/` is understood, including:

- Session metrics (`session.ts`)
- Prompt performance tracking (`prompt-performance.ts`)
- Feedback heatmaps (`feedback-heatmap.ts`)
- Lifecycle metrics (`lifecycle-touchpoints.ts`)
- Internal dashboards (`dashboard.ts`)

> All analytics modules must emit `ANALYTICS_META_UPDATED` and use [0,1] normalization.

---

### 🔁 LIVE VALIDATION REQUIREMENTS

Cursor must:

1. ✅ Validate new agents in `/cursor/system-roles.ts`
2. ✅ Cross-check prompt scaffolds against `/gpt-templates/`
3. ✅ Log all changes to `/cursor/auto-actions.log.md`
4. ✅ Emit diffs to `/cursor/audit-results/`
5. ❌ **Block execution** if:
   - `/docs/system-map.md` is missing or mismatched
   - Required test coverage is not met
   - Emotion validation is bypassed

---

### 🧪 INGEST DRIFT TEST

On every execution, Cursor must:

- Compute SHA-256 of `/docs/system-map.md`
- Compare to last-ingested SHA in `self-awareness.json`
- Trigger warning if mismatch occurs:
```

⚠️ SYSTEM MAP DRIFT DETECTED — execution halted.
Please re-ingest `/docs/system-map.md` before proceeding.

```

---

### 📎 Cursor Metadata Expectations

Cursor must maintain:

- `/cursor/self-awareness.json` — Known folders, agents, promptTypes
- `/cursor/system-roles.ts` — Agent/prompt registry
- `/cursor/exports/memory.json` — Execution state snapshot

---

> **Codex Rule:** No Cursor action is valid unless all of the above are ingested.  
> This is how we prevent hallucination, rot, and silent regressions.  
> If Cursor has not read this file in full, it must halt.

✅ **Ingestion Confirmed = Execution Authorized (Codex v6.1.4)**  
```