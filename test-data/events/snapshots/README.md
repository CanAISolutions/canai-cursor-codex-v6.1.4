# 📦 Snapshot Registry (`/events/snapshots`)

## ✅ Purpose
This folder contains **critical event snapshots** that act as source-of-truth test data for CanAI's system validation layer. Each snapshot:

- Validates a specific system edge-case, failure mode, or logic branch.
- Is versioned, structurally locked, and CI-compatible.
- Prevents silent failure, schema drift, or corrupted automation logic.

Snapshots are used for:
- Automated regression tests
- Make + Render fallback flows
- PromptLogs validation
- Token cost monitoring
- Fulfillment system debugging
- Copilot-powered QA and repair

---

## 🧠 Usage

### To Validate Snapshots:
Run CI snapshot diffing with `assert ===` logic against these files.

### To Add a New Snapshot:
1. Use `your-event.snapshot.json` format.
2. Add the full `@codex-*` header block.
3. Include `_meta` with:
   - `description`
   - `assert`
   - `guardrailFor`
   - `triggerField`
   - `snapshotCompatible: true`
   - `lastVerifiedAgainst`
4. Register it in `index.ts`.

---

## 📌 Codex Principles

- **No orphaned files** – every snapshot must be registered.
- **No silent failures** – every guardrail must be described.
- **No ambiguity** – all logic must be self-documenting.

> _This system is built to last 10+ years. Each snapshot is a contract with the future._

---

## 🔒 Current Snapshots

| Snapshot Name                    | Guardrail Purpose                              |
| ------------------------------- | ---------------------------------------------- |
| `bulk-event-batch`              | Catch schema drift in large event batches      |
| `copilot-revision-requested`    | Enforce Copilot prompt revision structure      |
| `cross-event-replay`            | Prevent replay timestamp mismatches            |
| `event-test-trigger`            | Validate automated test events                 |
| `gpt-usage-spike-event`         | Detect abnormal token cost surges              |
| `klaviyo-lifecycle`             | Lock lifecycle email payload format            |
| `lifecycle-triggered-event`     | Verify post-purchase and journey automations   |
| `missing-event-type`            | Block events missing `eventType` field         |
| `referral-conversion-event`     | Validate referral attribution & rewards        |
| `retry-failed-fulfillment`      | Lock retry-logic against loops/fail-silently   |
| `timeout-detected-event`        | Catch system hangs or broken workflows         |
| `unhandled-error-escalation`    | Elevate runtime failures to incident handlers  |
| `webhook-ingest-event`          | Ensure inbound webhooks are structurally safe  |

---

## 🧪 Verified Against
**CanAI Codex v1.4.2**

