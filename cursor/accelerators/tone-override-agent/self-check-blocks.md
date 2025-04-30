# ✅ Self-Check Blocks – Tone Override Agent  
**Folder:** `/cursor/accelerators/tone-override-agent/`  
**Codex Rule:** Required for all modules that affect emotional UX or scoring infrastructure

---

## 🔒 Enforcement Checklist

To be marked **Codex Locked**, this module must pass the following:

### 🧪 Test Suite Coverage

| Check                                       | ✅ |
|---------------------------------------------|----|
| `tone-overrider.spec.ts` present            | ✅ |
| Tests emotionScore, drift, and revision     | ✅ |
| Returns null safely if no match             | ✅ |
| At least 5 assertion branches               | ✅ |
| Drift override and emotion override both tested | ✅ |

---

### 📦 File Structure Validated

| File                                     | Required | Present |
|------------------------------------------|----------|---------|
| `tone-profiles.jsonc`                    | ✅        | ✅      |
| `tone-overrider.ts`                      | ✅        | ✅      |
| `tone-overrider.spec.ts`                 | ✅        | ✅      |
| `behavior-contract.md`                   | ✅        | ✅      |
| `self-check-blocks.md`                   | ✅        | ✅      |
| `README.md`                              | ✅        | 🚧 (pending) |

---

### 🧠 LLM Co-Evolution Compliance

- [x] Traits follow prompt-genetics schema  
- [x] Override logic is declarative, modular, and upgrade-safe  
- [x] Profile file includes descriptions for LLM parsing  
- [x] Codified `reason` field for all override events  
- [x] Return format uses structured traits for injection safety

---

### 🚨 Safety & Misfire Protections

| Protection                       | Enforced |
|----------------------------------|----------|
| Never overrides unless emotion or drift thresholds met | ✅ |
| Rejects override if revisionCount > 5                  | ✅ |
| Fails closed — returns null if profile match is weak   | ✅ |
| Defensive defaults set in `tone-profiles.jsonc`        | ✅ |
| All results traceable via reason + overrideId          | ✅ |

---

### 🔐 Codex Summary

> This module **protects emotional tone quality** by surgically offering override presets when drift or flatline symptoms are detected.  
> All logic is test-validated, snapshot-stable, and compliant with coevolution patterns.

**Codex Status:** Passes all enforcement gates  
**Codex Lock Date:** _Pending README finalization_
