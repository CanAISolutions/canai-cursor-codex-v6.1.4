# ✅ File: `future-integration.md`  
@location: `/cursor/accelerators/tone-override-agent/future-integration.md`  
@purpose: Declares roadmap scenarios and downstream integration forecast  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🔮 Future Integration – Tone Override Agent

@agent: tone-override-agent  
@version: v1.0.0  
@codex-checkpoint: v2.3  
@scope: Emotional Quality Correction Layer

---

## 🛠 Planned Enhancements

---

### 1. **User-Tuned Tone Profiles**

- Let users define or adjust their preferred tone override profiles  
- Store preference in `platformPersonalization.ts` → `userToneOverride[]`

→ Integration: Copilot Memory Layer  
→ Output: `preferredToneMatchScore`  

---

### 2. **Live A/B Replay for Override Suggestions**

- Inject override + original in side-by-side Copilot preview  
- Ask user: "Which one feels more right?" → use result for profile learning

→ Integration: `promptReplay.ts` and `CopilotFeedbackAgent`  
→ Output: `toneOverrideVoteTrace`

---

### 3. **Override Fatigue Prevention Layer**

- Track how often tone overrides are rejected or skipped  
- Reduce frequency if user consistently ignores them

→ Integration: `sessionDeltaLogEmitter` → `rejectionCount`  
→ Output: `overrideSuppressionScore`

---

### 4. **Regenerative Trait Tracing**

- Map override profiles to prompt-genetics traits  
- Auto-mutate traits when certain tones continually fail

→ Integration: `prompt-genetics/` + `smart-revision-loop`  
→ Output: `geneticDriftTrigger`

---

## 📊 Scenario Impact Matrix

| Scenario                             | System Response                                | Contract Impact |
|--------------------------------------|------------------------------------------------|-----------------|
| User disables tone correction        | Agent exits silently (respects user memory)    | ✅ Add `sessionFlags.allowToneFix = false` |
| Override accepted 3+ times in a row  | Boost profile weight                           | ✅ Add `toneProfileConfidence` |
| Override rejected 3+ times           | Suppress future override for 2 sessions        | ✅ Add `overrideSuppressionScore` |
| Trait mismatch causes loop           | Inject Copilot explanation layer               | ✅ Add `trace.debugPath` |

---

```
