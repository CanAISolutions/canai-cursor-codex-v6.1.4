# 🧠 Smart Prompt Score – Composite Quality Scoring Engine

**Module:** `smart-prompt-score`  
**Status:** ✅ Codex Finalized – Snapshot-Safe  
**Last Verified:** 2025-04-30  
**Location:** `/cursor/accelerators/smart-prompt-score/`

---

## 🎯 Purpose

Evaluate prompt outputs using weighted, schema-driven signal traits.  
Scoring is used for:

- Lifecycle intelligence (e.g. Golden Prompt qualification)  
- Copilot UX feedback and retries  
- Prompt evolution tracking  
- Quality assurance and regression detection  

---

## 📐 Scoring Model

Signals are declared in `scoring-signals.jsonc` and include:

| Trait            | Type        | Goal       | Description                           |
|------------------|-------------|------------|----------------------------------------|
| `clarityScore`   | numerical   | maximize   | Measures output readability/clarity   |
| `emotionScore`   | numerical   | maximize   | Detects alignment with intended tone  |
| `outputDelta`    | numerical   | maximize   | Measures meaningful revision shift     |
| `revisionCount`  | integer     | minimize   | Penalizes excess retries              |
| `reuseRate`      | percentage  | maximize   | Captures user reuse/replication       |

---

## 🧪 Grading Ranges

| Range       | Grade     | Meaning                                         |
|-------------|-----------|-------------------------------------------------|
| ≥ 90        | `gold`    | Emotionally resonant, reusable, revision-light |
| 72–89       | `pass`    | Acceptable – usable prompt                     |
| < 72        | `fallback`| Likely needs tone fix or Copilot suggestion    |

---

## 📁 Folder Structure

| File                              | Purpose |
|-----------------------------------|---------|
| `scoring-signals.jsonc`           | Trait schema + weights             |
| `prompt-score-engine.ts`          | Computes score + reasoning chain   |
| `prompt-score-engine.spec.ts`     | Full test suite + snapshot coverage |
| `scoring-policy.md`               | Strategic definitions + thresholds |
| `behavior-contract.md`            | Copilot-safe invocation contract   |
| `self-check-blocks.md`            | QA + anti-drift logic enforcement  |
| `README.md`                       | Codex lock + module summary        |

---

## 🤖 Agent & Copilot Usage

| System             | Usage Example                             |
|--------------------|--------------------------------------------|
| `promptReplay.ts`  | Score < fallback → inject tone variant     |
| `goldmineLog`      | Score ≥ gold → archive prompt              |
| `Copilot Hints`    | Score < pass → show coaching suggestion    |
| `revisionLoop`     | Track score delta over retry attempts      |

---

## 🧬 LLM-Safe Evolution

- All traits declared in JSONC — Copilot-modifiable  
- Weighting, granularity, and thresholds are declarative  
- Reasoning chain is returned to enable feedback, coaching, or logs  
- Fully compatible with Prompt Intelligence Loop and Delta Logging

---

## ✅ Codex Lock Criteria

| Checkpoint                        | Status |
|----------------------------------|--------|
| Fail-safe engine logic           | ✅     |
| Snapshot test coverage           | ✅     |
| Behavior contract + co-evolution | ✅     |
| UX interpretation policy         | ✅     |
| Regression guards                | ✅     |
| File structure and schema        | ✅     |

---

> If a prompt feels unclear, flat, or hard to reuse — this system knows.  
> If it’s magic — it captures it.  
> This is the difference between prompts that land and those that live forever.

**Codex Status:** ✅ Finalized • Snapshot-Safe  
**Last Audited:** 2025-04-30  
**Change Authority:** Declarative schema only — no internal logic edits allowed.
