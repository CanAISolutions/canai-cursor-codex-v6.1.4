# 🧠 CanAI Events — Codex Blueprint

Welcome to the `events/` folder — the **source-of-truth** for all system-triggered actions, errors, retries, and automation tests across CanAI.

This directory powers:
- ✅ Fulfillment logic and retry flows
- ✅ Lifecycle campaigns and webhook ingestion
- ✅ Escalation detection and GPT fallback systems
- ✅ Manual and Copilot-driven revision retries
- ✅ Testing, schema validation, and CI snapshot safety

---

## 🗂 Folder Structure

```
📁 events/
├─ 📄 *.json (individual event types)
├─ 📄 README.events.md ← You are here
├─ 📄 test-event-structure.ts ← CI validator
├─ 📄 test-event-trigger-runner.ts ← Local simulator
└─ 📁 schemas/ ← JSON schemas for autocomplete & inference
```

---

## ✅ Event Types & Descriptions

| File | Purpose |
|------|---------|
| bulk-event-batch.json | Simulates a grouped batch of multiple sub-events |
| copilot-revision-requested.json | When Copilot triggers a retry or regenerate |
| cross-event-replay.json | Replays multiple sessions based on failure type |
| event-test-trigger.json | Manually simulate a controlled trigger for local QA |
| gpt-usage-spike-event.json | Detects token overuse or load-based anomaly |
| klaviyo-lifecycle.json | Inbound webhook from Klaviyo (e.g. Welcome flow) |
| lifecycle-triggered-event.json | Internal event to start lifecycle automation |
| missing-event-type.json | Simulates a malformed event with no `type` field |
| referral-conversion-event.json | Logs a referral payout-worthy conversion |
| retry-failed-fulfillment.json | System retry after a fulfillment timeout/error |
| timeout-detected-event.json | Fulfillment timed out waiting for GPT |
| unhandled-error-escalation.json | Catch-all escalation for uncaught logic holes |
| webhook-ingest-event.json | General webhook receiver from external apps |

---

## 🧠 Codex Validation (test-event-structure.ts)

All `.json` files are checked for:
- Full Codex headers (`@codex-purpose`, etc.)
- `_meta` block with `triggerField`, `routeTo`, `assert`, `snapshotCompatible`, etc.
- Type-specific enforcement rules like:

| Event Type | Enforced Logic |
|------------|----------------|
| referral-conversion | `referrerId` + `conversionAmount > 0` |
| retry-failed-fulfillment | `sessionId` + `retryCount >= 1` |
| timeout-detected | `sessionId` + `timeoutMs >= 5000` |
| gpt-usage-spike | `tokenDelta >= 100000` + `sessionsImpacted >= 1` |
| copilot-revision-requested | `revisionType` + `revisionCount >= 1` |
| unhandled-error-escalation | `errorCode` + `severity === "critical"` |

---

## 🧪 Local Test Simulation

```bash
ts-node test-event-trigger-runner.ts
```

- CLI simulation of any event file
- Displays metadata and routing info
- Useful for manual QA or Copilot testing

---

## 🧬 Copilot & Schema Support

Every event includes:
- `_meta` block for AI traceability
- `.schema.json` (in `/schemas/`) for autocomplete + safety
- CI validation via `test-event-structure.ts`

---

## 🔭 Future Extensions

- `/events/metrics/` folder (session spike tracking)
- `/api/events/validate` (runtime endpoint)
- `Make.com` / `Postmark` webhook integration
- `fallback-monitor.ts` for real-time alerts

---

**Codex Standard: Built to scale. Built to recover. Built for forever.**
