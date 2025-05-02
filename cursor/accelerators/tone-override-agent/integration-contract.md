# ✅ File: `integration-contract.md`  
@location: `/cursor/accelerators/tone-override-agent/integration-contract.md`  
@purpose: Declares safe I/O types, override conditions, trace format, and state usage  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🤝 Integration Contract – Tone Override Agent

@agent: tone-override-agent  
@version: v1.0.0  
@scope: UX Recovery Layer  
@triggerSource: Copilot / Fallback / Smart Score / Prompt Drift  

---

## 📥 Input Shape

```ts
type ToneOverrideInput = {
  promptOutput: string
  emotionScore: number
  outputDrift: number
  revisionCount: number
  intentLabel?: string
}
```

---

## 📤 Output Shape

```ts
type ToneOverrideResult = {
  shouldOverride: boolean
  overrideMessage?: string
  matchedProfile?: string
  reason?: string
  trace?: {
    score: number
    drift: number
    profileUsed: string
    profileTraits: string[]
  }
}
```

---

## 🧠 Override Activation Rules

| Signal             | Condition           |
|--------------------|---------------------|
| `emotionScore`     | `< 0.3`             |
| `outputDrift`      | `> 0.8`             |
| `revisionCount`    | `≤ 3`               |
| Profile Match      | Must align with `tone-profiles.jsonc`  
| Session Lockout    | Only once per session unless `forced = true`

---

## 🧾 State Keys

| Key                                 | Purpose |
|--------------------------------------|---------|
| `tone-override:lastOverrideTrace`    | Records last override recommendation |
| `tone-override:overrideCount`        | Tracks how often agent is triggered |
| `tone-override:blockedSessions[]`    | Prevents repeat override per session unless flagged |

---

## 📦 Consuming Modules

| Consumer                   | Usage |
|----------------------------|-------|
| `copilot-feedback-agent`   | Surfaces override message with reasoning |
| `smart-prompt-score`       | Triggers override if score < 72 |
| `zombie-hunter`            | Forces override if session stagnates |
| `promptReplay.ts`          | Uses override profile for tone reset |

---

```
