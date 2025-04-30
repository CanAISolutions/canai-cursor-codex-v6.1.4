# 🧟 Stagnation Detection & Rescue Policy

This system detects sessions that are technically alive but emotionally or logically dead.

---

## Triggers

| Pattern            | Criteria                                         | Response                     |
|--------------------|--------------------------------------------------|------------------------------|
| no-change-loop     | 3+ identical outputs despite revisions           | Auto-trigger prompt replay   |
| emotion-flatline   | Emotion score < 0.2 for 2+ turns                 | Suggest tone-shift           |
| drift-deadzone     | OutputDelta < 0.05 + flat tone                   | Alert Copilot for intervention |

---

## Recovery Flow

1. Log `zombie_detected` event in `sessionDeltaLogEmitter`
2. Replay last prompt using `promptReplay.ts`
3. Inject Copilot prompt:  
   _“We noticed this session may be stuck. Want to try a new direction?”_

---

## Safety Rule

Zombie detection is silent unless confirmed.  
→ No immediate action unless **≥2** signals match.

---

## Copilot Usage

Run from post-output check:

````ts
await detectZombieSession("session_ABC123")
