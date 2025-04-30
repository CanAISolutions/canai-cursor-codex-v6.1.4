# 🧠 Scoring Policy – Smart Prompt Score

**Module:** `smart-prompt-score`  
**Purpose:** Standardize how prompt sessions are evaluated, trusted, flagged, or upgraded.

---

## 🎯 Primary Objectives

- Evaluate prompt sessions based on emotional tone, clarity, evolution, and reuse potential  
- Provide downstream systems (Copilot, Golden Prompt tagging, analytics) with a unified score  
- Guide revisions, upgrades, and feedback suggestions with grounded signal math

---

## 📊 How Scoring Works

Score is calculated via weighted traits defined in `scoring-signals.jsonc`. These include:

| Signal           | Meaning                                | Goal         |
|------------------|-----------------------------------------|--------------|
| `clarityScore`   | Is the output well-structured, readable? | Maximize     |
| `emotionScore`   | Does it feel emotionally aligned?        | Maximize     |
| `outputDelta`    | Is the output meaningfully evolving?     | Maximize     |
| `revisionCount`  | How many retries were needed?            | Minimize     |
| `reuseRate`      | Do users reuse this structure/prompt?    | Maximize     |

---

## 🧪 Threshold Interpretation

| Score Range | Grade     | Meaning                                         |
|-------------|-----------|-------------------------------------------------|
| ≥ 90        | `gold`    | Top-tier prompt — emotionally resonant, reusable, and low friction |
| 72–89       | `pass`    | Acceptable — output likely fulfills the user's goal |
| < 72        | `fallback`| Requires upgrade, tone fix, or Copilot intervention |

---

## 📦 Where Score Is Used

| System                      | Usage Description |
|-----------------------------|-------------------|
| `promptReplay`              | Fallback triggers on low score or stagnation |
| `Golden Prompt Library`     | Auto-capture if `grade = gold` + reuse ≥ 0.6 |
| `Copilot Feedback Hints`    | Inject coaching when `score < 72` or `emotionScore < 0.4` |
| `PromptLogs / Analytics`    | Stored per session for longitudinal QA |
| `Revision Intelligence`     | Tracks score delta over attempts to suggest improvements |

---

## 🤖 Copilot Evolution Notes

This module outputs:
- `score`
- `grade`
- `reasoning[]`
- `normalizedSignals{}`

All values are prompt-safe and can be explained or embedded in Copilot UX coaching.

---

## 🧬 Long-Term Quality Standard

> Every CanAI prompt must either:
> - Emotionally resonate, or  
> - Clarify user intent, or  
> - Meaningfully evolve the output

If it fails all three → fallback triggers, immediately.

---

**Codex Status:** ✅ Finalized • Snapshot-Safe  
**Last Audited:** 2025-04-30
