# 🛡️ Self-Check Blocks – Smart Prompt Score

**Module:** `smart-prompt-score`  
**Codex Enforcement Layer:** QA Integrity + Future-Proof Logic

---

## ✅ Required Test Assertions

### 1. Snapshot Stability
> Ensure scoring behavior does not change unintentionally

```ts
expect(scorePrompt(sampleInput)).toMatchSnapshot()
```

---

### 2. Grade Boundaries Must Hold

| Grade         | Trigger                     |
|---------------|-----------------------------|
| `gold`        | Score ≥ `goldThreshold`     |
| `fallback`    | Score < `fallbackThreshold` |

```ts
expect(goldPrompt.grade).toBe('gold')
expect(lowPrompt.grade).toBe('fallback')
```

---

### 3. Trait Goal Direction Must Respect Schema

- Traits with `goal: minimize` must invert their score scale
- Traits with `goal: maximize` must scale normally

```ts
expect(lowRev.normalizedSignals.revisionCount).toBeGreaterThan(highRev.normalizedSignals.revisionCount)
```

---

### 4. Missing Signal Grace

> Prompt score must still return a result if partial signals are passed

```ts
expect(scorePrompt({ clarityScore: 0.8 })).toBeDefined()
```

---

### 5. Config Integrity Check

Each `signal` entry in `scoring-signals.jsonc` must include:

- `name` (string)  
- `type` (numerical | percentage | integer)  
- `range` (number[])  
- `weight` (number)  
- `goal` (maximize | minimize)

```ts
expect(allTraits).toSatisfy(trait => trait.name && trait.goal && trait.range)
```

---

## 🚨 Failure Actions

| Condition              | Action                         |
|------------------------|--------------------------------|
| Score drift detected   | Trigger `outputDeltaLog` + lock merge |
| Missing trait metadata | Fail Copilot invocation        |
| Grade misclassification | Block Golden Prompt storage   |

---

## Codex Mandate

This module **must pass all checks above** before being called by any system, agent, or Copilot.

✅ Audited and aligned as of 2025-04-30
