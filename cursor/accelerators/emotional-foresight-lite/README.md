# 🧠 Emotional Foresight Lite

Lite accelerator to detect future emotional degradation or improvement based on current session signals.

---

## What it does:
- Reads delta patterns + emotional tone across session
- Predicts emotional risk or uplift conditions
- Triggers system nudges or structural fallback if needed

---

## Files

| File                         | Role                                                |
|------------------------------|-----------------------------------------------------|
| `emotion-signal-spec.jsonc`  | Signal definitions + threshold values               |
| `foresight-model-lite.ts`    | Predictive engine to emit signals                   |
| `intervention-policy.md`     | Logic for system or Copilot actions post-detection  |

---

## Key Bindings
- `sessionDeltaLogEmitter.ts`
- `output-delta-analyzer.ts`
- `emotionDriftJournal.ts`
- `promptReplay.ts` (indirectly via intervention)

---

## Future Upgrade
→ Replace heuristic logic with LLM-classifier once emotion embeddings stabilize

---

## QA Coverage

Test suite: `/tests/foresight/emotional-foresight-lite.spec.ts`  
Covers:  
- Signal detection accuracy  
- Fallback signal behavior (`none-detected`)  
- Emotion delta logging via `emitDeltaLog`  
- Detector clause logic (tone, clarity score, revision loops)  
- Confidence-bound behavior routing

All tests are snapshot-stable, Copilot-readable, and mock-isolated.