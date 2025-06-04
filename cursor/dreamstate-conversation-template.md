# DreamState Conversation Template

> **Purpose**: Copy this template into new DreamState conversations for comprehensive context and directive execution.

## Context Files:
- `/cursor/context-card.md` (quick reference)
- `/cursor/auto-actions.log.md` (current status)
- `/cursor/knowledge-base.md` (patterns & principles)
- `/cursor/reports/mock-remediation-tracker.md` (progress tracking)
- `/cursor/dreamstate-config.md` (requirements & quality gates)

## Historical Context (if needed):
- `/cursor/auto-actions.log.archive.2025-05-23.md`

---

## ✅ Cursor Directive: Codex Remediation for traceid-continuity.test.ts

### 🧠 Objective

Ensure that trace continuity is preserved across all system operations — including fallback chains, replays, retries, agent switches, and chaotic recovery sequences.

Trace IDs are the lifeline of emotional memory. They must survive every turbulence. No operation should cause trace discontinuity, ambiguity, or forked metadata without recovery.

### 💣 Failure Risks

If this test fails:

1. Trace IDs become ambiguous or overwritten mid-chain
2. Emotional and trust metadata become fragmented
3. Replay scenarios spawn new trace roots instead of maintaining lineage
4. Fallback agents emit conflicting trace metadata
5. TrustScore audit trail loses continuity
6. UX messaging may reflect mismatched tone history

### ✅ Codex Remediation Plan

```typescript
// Cursor — initiate full Codex remediation for:
/tests/dreamstate/traceid-continuity.test.ts
```

#### ✅ Must Validate:

| Area | What to Assert |
|------|----------------|
| 🧬 Emotional Lineage Lock | traceId, spanId, originTraceId preserved across hops |
| 🔁 Replay Consistency | Replays reuse traceId lineage, no new root unless explicitly triggered |
| ⛓️ Fallback Link Integrity | All fallback hops correctly reference prior trace segment |
| 🧾 Span Auditability | Full trace lineage reconstructable from events and metadata |
| 🧘 TrustScore Continuity | Trust metadata persists through full trace chain |
| 🕐 Concurrency Stability | Concurrent fallbacks/replays do not overwrite or fragment trace |

### 🧪 Required Test Scenarios

1. **Fallback → Replay** → Validate same traceId, new spanId
2. **Fallback → Retry** → No new originTraceId, span chaining preserved
3. **Agent switch (via fallback)** → traceId retained, new spanId linked
4. **Concurrent fallback + replay** → Verify no collision or overwrites
5. **TrustScore and drift logs** linked across full trace span
6. **Malformed input → fallback** → trace continues
7. **Replay with lost context** → system regenerates trace with continuity notice
8. **3-hop fallback → replay from 2nd hop** → span lineage complete and auditable

### 🧱 Real System Components Required

- **TraceManager** (must support `startSpan()`, `endSpan()`, `recoverSpan()`, `validateLineage()`)
- **FallbackManager**
- **EmotionalValidator**
- **TrustScoreManager**
- **EventBus**
- **SnapshotManager**
- **EmotionalUXRenderer**

### 🧱 Polaris Ritual Tags

```typescript
// Polaris Ritual: Trace Continuity Under Pressure
// Codex Vector: Emotional Lineage Integrity
// Codex Safeguard: Every emotional event must be traceable to its origin
```

### 📌 Finalization Checklist

- ✅ No mocks (e.g. `mockTraceId`, `requireMock`)
- ✅ traceId, spanId, and originTraceId preserved or explicitly regenerated
- ✅ Fallback, replay, and retry chains log trace transitions with continuity
- ✅ All trace events emit to EventBus with complete metadata
- ✅ Drift and trust logs are linked to trace lineage
- ✅ `mock-remediation-tracker.md` updated
- ✅ `auto-actions.log.md` logs continuity integrity validation

### 🧠 Ideal CX Thread Integration

> "I want to feel like the system remembers every step I've taken — even if it had to catch me a few times along the way."

This test ensures the illusion of memory is real — every fallback, retry, or recovery still feels like part of the same coherent emotional journey.

---

## 📋 Execution Instructions

1. **Copy this entire template** into a new DreamState conversation
2. **Attach the context files** listed above
3. **Execute the directive** with full Codex compliance
4. **Update tracking files** upon completion
5. **Validate against Ideal CX Thread** requirements

---

## 🔗 Cross-References

- `/tests/dreamstate/traceid-continuity.test.ts`
- `/cursor/reports/mock-remediation-tracker.md`
- `/docs/ideal-cx-thread-v2-emotional-sovereignty.md`
- `/cursor/auto-actions.log.md`

---

*Template Version: 2025-05-24 | Codex v6.1.4 | DreamState Mock Remediation Phase* 