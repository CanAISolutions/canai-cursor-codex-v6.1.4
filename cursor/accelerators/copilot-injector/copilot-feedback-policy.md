# 💬 Copilot Feedback Policy – Injection Protocol

**Module:** `copilot-injector`  
**Purpose:** Define when, why, and how Copilot injects feedback suggestions during a user session.

---

## 🎯 Primary Objectives

- Offer helpful, emotionally intelligent nudges when sessions stall, misfire, or feel unclear  
- Maintain user confidence — never undermine their authority  
- Avoid noise, repetition, or forced corrections  
- Empower users with **optional paths forward**, not forced flows

---

## 📥 Trigger Conditions

Copilot may inject a suggestion if **at least one** of the following occurs:

| Scenario                  | Trigger                        |
|---------------------------|--------------------------------|
| Low scoring output        | `score < 72`, `clarity < 0.5`  |
| Emotionally flat output   | `emotionScore < 0.2`           |
| Stagnation or drift loop  | `outputDelta < 0.05`, 3+ revisions |
| Revision fatigue          | `revisionCount ≥ 6`            |
| Output instability        | `outputDrift > 0.8`            |

All trigger logic is defined in `copilot-trigger-rules.jsonc`

---

## 📦 Message Design Principles

Copilot messages must be:

- **Optional** → always allow the user to ignore  
- **Softly empowering** → phrased as helpful invitations, not corrections  
- **Context-aware** → must never repeat or contradict recent suggestions  
- **Emotionally anchoring** → reassure the user they're not stuck or failing

---

## 🧠 Example Copilot Messages

| Scenario               | Message Example                                 |
|------------------------|--------------------------------------------------|
| Low clarity + emotion  | “Want a tone fix or clarity boost?”             |
| Emotion flatline       | “Want to try a more emotionally aligned rewrite?” |
| Repeat revisions       | “Need a fresh take? I can suggest an angle.”    |
| Drift after revision   | “Looks like this changed a lot — want stability?”|

---

## 🧪 Safety Systems

| Mechanism                    | Rule                              |
|------------------------------|------------------------------------|
| Max injections per session   | 2 (from `defaults`)                |
| Min turns between suggestions| 1                                 |
| Drift tolerance              | Trigger only on delta ≥ 0.05       |
| Tone guard                   | Never inject if tone = `inspiring` |

---

## 🧬 Evolution Guidance

- New triggers can be proposed by Copilot agents as signal schemas expand  
- Messages can be A/B tested based on user actions (e.g. revise vs reuse vs ignore)  
- Injection frequency may adjust based on trust, session type, or user history

---

## Codex Notes

- All Copilot feedback is **declared, explainable, and snapshot-safe**  
- No injection occurs unless Codex-approved triggers are matched  
- This ensures users experience **resonant, respectful, and regenerative** AI guidance

**Codex Status:** ✅ Finalized  
**Change Authority:** Declarative schema only  
**UX Risk Level:** Medium — must always default to user empowerment
