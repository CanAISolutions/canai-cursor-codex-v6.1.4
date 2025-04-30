# ✅ Self-Check Blocks – Conversion Predictor Lite

**Module:** `conversion-predictor-lite`  
**Purpose:** Ensure scoring logic remains accurate, bounded, introspectable, and regression-proof.

---

## 🧪 Required Tests

- [x] Strong signal CTA → score ≥ 0.7 and `verdict = strong`
- [x] Weak/passive phrasing → score ≤ 0.4 and `verdict = weak`
- [x] Neutral output → fallback to `verdict = neutral`
- [x] Score always clamped between 0.0–1.0
- [x] Output always includes `trace.reasoning` and `trace.snippet`

---

## 🔁 Regression Guards

| Risk Condition                              | Triggered Action |
|---------------------------------------------|------------------|
| `score > 1.0` or `score < 0.0`               | Block scoring + emit `signal-overflow` |
| `matchedSignals.length === 0` AND `verdict = strong` | Fail test – signal required for strong verdict |
| Signal pattern missing or malformed          | Emit `signal-parse-error` |
| `conversion-signals.jsonc` fails load        | Suppress scoring engine + emit critical trace |

---

## 📊 Signal Map Validation

- Signal list must include ≥ 3 positive and ≥ 2 negative signals
- All signals must include: `name`, `match`, `weight`, `category`
- No duplicate signal `name` values
- All `weight` values must be within [-1.0, 1.0]

---

## 📤 Trace Output Requirements

| Field            | Rule |
|------------------|------|
| `trace.snippet`  | Max 123 characters |
| `trace.reasoning`| Must explain scoring outcome in plain English |
| `score`          | Must always exist, float, and be parseable |

---

## 🧠 Evolution Support

- `conversion-signals.jsonc` is the only approved source of pattern logic  
- Copilots and devs may propose new signals via `SignalSuggestor` agent  
- Any scoring change must be snapshot-tested in `.spec.ts` before release

---

**Codex Safety:** ✅ Drift-Proof – Signal Map Enforced  
**Last Verified:** 2025-04-30
