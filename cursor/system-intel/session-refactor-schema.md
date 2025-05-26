# 📐 CanAI Session Refactor Log Schema

**Codex-Enforced Format:** `sessionRefactorLog.json`  
**Purpose:** Immutable audit trail of smart revisions — emotional, modular, directive, and UX upgrades.

---

## 🔖 Entry Object Schema

Each item in the array must conform to the following structure:

### 🔹 `revisionId`  
- **Type:** `string` (UUID or short hash)  
- **Required:** ✅  
- **Purpose:** Globally unique ID for this revision event.

---

### 🔹 `timestamp`  
- **Type:** `number` (Unix epoch ms)  
- **Required:** ✅  
- **Purpose:** Machine-sortable timestamp for logs.

### 🔹 `timestampIso`  
- **Type:** `string` (ISO 8601)  
- **Required:** ✅  
- **Purpose:** Human-readable time reference.

---

### 🔹 `sessionId`  
- **Type:** `string` (ISO-like or structured ID)  
- **Required:** ✅  
- **Pattern:** `rev-YYYY-MM-DDTHH-MM-SSZ`

### 🔹 `promptType`  
- **Type:** `string`  
- **Required:** ✅  
- **Enum:** `business_plan`, `email_campaign`, `ai_blueprint`, `site_audit`, `ai_brand_identity`, `reverse_strategy`, `social_content`, `profile_makeover`, `blogblitz`, `ad_amplify`, `sparksplit`, etc.

---

### 🔹 `revisionType`  
- **Type:** `string`  
- **Required:** ✅  
- **Enum:** `prompt-evolution`, `self-healing`, `manual-review`, `directive-sync`

### 🔹 `initiator`  
- **Type:** `string`  
- **Required:** ✅  
- **Examples:** `smart-revision-loop`, `delta-trigger`, `founder-override`

---

## 🔍 `beforeAudit` and `afterAudit`

Each must include:

- `modularityScore` — `number` (0.0–1.0)
- `emotionalResonanceScore` — `number` (0–100)
- `directiveCoverage`:  
  - `total`: `number`  
  - `covered`: `number`  
  - `percent`: `number`  
  - `missing`: `string[]`
- `uxConsistencyScore` — `number` (0.0–1.0)
- `summary`: `string[]` (subjective commentary on findings)

---

## 🔁 `deltaSummary`

- `modularityDelta`: `number`  
- `emotionalDelta`: `number`  
- `uxConsistencyDelta`: `number`  
- `directiveDelta`: `number` (percentage change)  
- `overallAssessment`: `string` (human-readable reflection)

---

## 📝 `notes`

- **Type:** `string[]`  
- **Required:** ✅  
- **Purpose:** Declarative causal log of actions taken (template swaps, refactors, etc.)

---

## ✅ Invariant Rules (Hard Codex Locks)

- `modularityDelta`, `uxConsistencyDelta` must range `-1.0` to `+1.0`
- `emotionalDelta` must be between `-100` to `+100`
- `directiveCoverage.percent` must always equal `(covered / total * 100)`
- `revisionId` must be unique across log
- If `directiveCoverage.missing.length === 0`, then `percent === 100`

---

## 🛠️ Suggested Validation Tools

- JSON Schema Validator (e.g. Ajv, TypeBox, Zod)
- Internal Codex Validator via `schemaValidatorTester.ts`
- Cursor test engine integration (optional)

---

## 🔐 Codex Enforcement Status

This schema is **locked** under the Prime Directive:  
> If violated, system evolution triggers should halt and raise a Codex alert.

