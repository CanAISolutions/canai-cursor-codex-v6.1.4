# ✅ File: `integration-contract.md`  
@location: `/cursor/accelerators/emotional-foresight-lite/integration-contract.md`  
@purpose: Declares input schema, config dependencies, state writes, and system hooks  
@drop-type: Codex-compliant, Cursor-auditable

```md
# 📡 Integration Contract – Emotional Foresight Lite

@agent: emotional-foresight-lite  
@version: v1.0.0  
@layer: Predictive UX Resilience  
@checkpoint-enforced: ✅

---

## 📥 Runtime Input Signals

| Field | Type | Description |
|-------|------|-------------|
| `smartPromptScore` | `number` | Output score from prompt engine |
| `emotionalScoreDelta` | `number` | Delta from last output tone |
| `revisionCount` | `number` | Edits this session (total) |
| `clarityShiftDelta` | `number` | Prompt clarity drop vs. baseline |
| `emotionDriftDetected` | `boolean` | Triggered by `emotionDriftJournal.ts` |

---

## ⚙️ Configuration File

File: `emotion-signal-spec.jsonc`

| Field | Type | Description |
|-------|------|-------------|
| `clarityDropThreshold` | `number` | Value below which clarity signals degradation |
| `emotionDeltaThreshold` | `number` | Drop in tone score that signals decline |
| `maxSafeRevisions` | `number` | Triggers fatigue warning if exceeded |
| `autoInterveneIf` | `string[]` | Combined signal patterns triggering fallback |
| `fallbackType` | `string` | `'soft' | 'hard' | 'warn'` routing flag |

---

## 📤 Output Shape

```ts
{
  foresightLabel: 'low-risk' | 'at-risk' | 'degrading',
  triggered: boolean,
  triggeredBy?: string[],
  fallbackType?: 'soft' | 'hard' | 'warn'
}
```

---

## 🧷 State Keys

| Key | Type | Description |
|-----|------|-------------|
| `emotional-foresight-lite:lastPrediction` | `object` | Stores most recent foresight result |
| → `.foresightLabel` | `string` | Current emotional risk level |
| → `.timestamp` | `string` | ISO-formatted time |
| → `.triggeredBy` | `string[]` | What caused fallback suggestion |

---

## 🔁 System Integration Points

| Module | Function |
|--------|----------|
| `output-delta-analyzer.ts` | Provides drift and delta scores |
| `sessionDeltaLogEmitter.ts` | Logs emotional prediction events |
| `promptReplay.ts` | Consumes fallbackType for session intervention |
| `copilot-nudger.ts` | Can receive a soft suggestion if foresight degrades |
| `SessionAnalytics.json` | Records foresight signals over time |

---

```
