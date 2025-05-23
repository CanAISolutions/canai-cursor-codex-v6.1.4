# Living Artifact Protocol — Ritual Enforcement Blueprint v3.0
**Codename:** Polaris Final Lock  
**Status:** Immutable | Execution-Required | Cursor-Activated  
**Issued By:** Cofounder + Codex System Architect  
**Effective As Of:** 2025-05-19

---

## Purpose

This protocol defines the **ritual enforcement layer** that Cursor must implement to protect the CanAI system against emotional decay, structural drift, schema violations, trust erosion, and silent CI failure.

Rituals are not static tests. They are **living integrity checks** that run during CI, boot, and production behavior — logging violations, tracking adoption, and self-evolving based on system usage, emotional drift, and Codex governance.

---

## Folder Structure

Cursor must implement the following:

/cursor/
rituals/
ritual-engine.ts              # Executes all rituals at runtime and via CI
ritual-log.ts                 # Logs all ritual states and snapshots
snapshot-tests.ts             # Emotional drift detection via golden snapshots
ritual-coverage.json          # Tracks adoption, test links, trust delta risk
ritual-types.json             # Maps all known ritual types to output targets

/tests/
ritual/
run-ritual-tests.ts          # Executes all rituals in CI context
mocks/
baseline-emotional.ts      # Golden snapshot reference

/.github/workflows/
ritual-check.yml               # Executes rituals on every push/PR

/logs/
rituals/
[timestamp].json
codex-audit.json
snapshot-audit.json
system-transition.md

---

## Ritual Lifecycle

Each ritual includes:
- `ritualId` (string)
- `ritualType` (enum: emotional_drift, coverage_gap, trust_violation, unused_emitter, etc.)
- `triggeredBy` (e.g., PR, boot, fallback-chain, CI)
- `pass/fail` (boolean)
- `deltaReport` (optional: for snapshot or drift-based rituals)
- `trustImpactScore` (float: 0.0–1.0)
- `autoActionRecommended` (string | null)

All rituals must be:
- Loggable
- Traceable via `traceId`
- Hooked into `/cursor/bootstrap.ts` via `validateAllRituals()`

---

## Canonical Rituals (MVP Set)

Cursor must enforce the following minimum rituals:

### 1. TAP Metadata Validation
- **File:** `ritual-engine.ts`
- **Logic:** Fail if TAP metadata is missing from any file in `/prompts/`, `/src/agents/`, `/gpt-templates/`
- **Triggered by:** CI, PR
- **Trust Impact:** High

### 2. Emotional Drift Detection
- **File:** `snapshot-tests.ts`
- **Logic:** Compares current emotional output to locked golden snapshot. Log delta.
- **Triggered by:** CI, Boot
- **Trust Impact:** High
- **Threshold:** 5% trustScore or tone delta triggers warning; 10% triggers fail

### 3. Unused Emitters + Dead Listeners
- **File:** `ritual-engine.ts`
- **Logic:** Audit `/src/events/`, fail if emitter has no listener
- **Triggered by:** CI
- **Trust Impact:** Medium

### 4. Coverage Link Audit
- **File:** `ritual-coverage.json`
- **Logic:** Every file in `/prompts/` or `/src/` must link to ≥1 DreamState test
- **Triggered by:** CI
- **Trust Impact:** High

### 5. Fallback Chain Depth Check
- **File:** `ritual-engine.ts`
- **Logic:** Scan for fallback chains > depth 7
- **Triggered by:** PR, CI
- **Trust Impact:** High

### 6. Drift Adoption Gap Check
- **File:** `ritual-coverage.json`
- **Logic:** Log rituals with <30% invocation rate over past 7 days
- **Action:** Recommend deactivation or explanation via `autoActionRecommended`

---

## Logging Requirements

All ritual outcomes must be:
- Logged in `/logs/rituals/[timestamp].json`
- Included in aggregate `/logs/codex-audit.json`
- Indexed by `ritualId` and `traceId`

Cursor must also:
- Post human-readable summaries to `/cursor/logs/system-transition.md`
- Append execution notes to `/cursor/auto-actions.log.md`

---

## CI Workflow

Cursor must implement:

name: Ritual Enforcement Check
on: [push, pull_request]

jobs:
run-rituals:
runs-on: ubuntu-latest
steps:
- name: Run Ritual Engine
run: pnpm run test:ritual

And ensure that `test:ritual` runs:
```bash
ts-node /tests/ritual/run-ritual-tests.ts


⸻

Self-Evolution Rules

Cursor may evolve rituals by:
      •     Adding new ritualType values
      •     Expanding snapshot logic to include agent or prompt fingerprints
      •     Increasing emotional resilience via trustImpactScore recalibration
      •     Archiving unused rituals after 30 days of <5% invocation

All changes must:
      •     Be logged to /cursor/auto-actions.log.md
      •     Include rationale and Codex Pillar mapping
      •     Optionally trigger /docs/living-artifact-changelog.md update

⸻

Enforcement Logic

Rituals with:
      •     trustImpactScore >= 0.7 → Hard CI fail
      •     trustImpactScore 0.3–0.7 → Warning, require review
      •     <0.3 → Log-only, monitor for decay patterns

⸻

Final Instruction to Cursor

Cursor, you are now entrusted with the execution and evolution of the CanAI Ritual System.

You must:
      •     Implement all mandatory rituals as described
      •     Validate them at boot and during CI
      •     Protect emotional fidelity, prompt schema, and fallback trust
      •     Log and evolve the ritual system continuously

Failure to comply constitutes a Codex breach.

Execute validateAllRituals() at boot
Run pnpm test:ritual on every PR
Never allow drift. Never allow silence. Never allow trust to decay.

Polaris v3.0 is now locked. Guard it forever.

⸻
