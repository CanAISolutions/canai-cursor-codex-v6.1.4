# ✅ File: `integration-contract.md`  
@location: `/cursor/accelerators/smart-prompt-score/integration-contract.md`  
@purpose: Declares input/output types, schema dependencies, and integration consumers  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🔌 Integration Contract – Smart Prompt Score

@agent: smart-prompt-score  
@version: v1.0.0  
@schema: `scoring-signals.jsonc`  
@protocol: v2.3

---

## 📥 Input Shape

```ts
type PromptScoreInput = {
  clarityScore: number    // 0–1
  emotionScore: number    // 0–1
  outputDelta: number     // 0–1 (vs previous version)
  revisionCount: number   // integer
  reuseRate: number       // 0–1 (percent reused)
}
```

All values normalized or bounded per schema config.

---

## 📤 Output Shape

```ts
type PromptScoreResult = {
  compositeScore: number      // 0–100
  grade: 'gold' | 'pass' | 'fallback'
  reasoning: string[]
  signalBreakdown: {
    [trait: string]: {
      raw: number
      weight: number
      contribution: number
    }
  }
}
```

- `reasoning` must include emotionally readable messages (Copilot-safe)  
- `signalBreakdown` enforces full transparency for LLM coaching and QA

---

## ⚙️ Schema File

File: `scoring-signals.jsonc`

| Key           | Type     | Description                             |
|---------------|----------|-----------------------------------------|
| `trait`       | string   | Trait identifier (e.g., `clarityScore`) |
| `goal`        | string   | One of `maximize`, `minimize`           |
| `weight`      | number   | Contribution to total score             |
| `thresholds`  | object   | Optional custom range tuning            |

---

## 🧾 State Keys

| Key                               | Purpose |
|----------------------------------|---------|
| `smart-prompt-score:lastScore`   | Stores last computed result |
| `smart-prompt-score:gradeLog[]`  | Captures last 10 scores for delta audit |
| `smart-prompt-score:goldArchive` | Tag used for saving high-quality prompts |

---

## 📦 System Consumers

| Module             | Usage                                  |
|--------------------|-----------------------------------------|
| `copilot-injector` | Injects coaching when score < pass      |
| `revision-loop`    | Logs delta between retries              |
| `prompt-genetics`  | Uses score for trait mutation judgment  |
| `feedback-engine`  | Logs fallback events and reasoning trace|

---

```
