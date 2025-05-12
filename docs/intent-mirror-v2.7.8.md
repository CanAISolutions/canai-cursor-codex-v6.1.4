# Intent Mirror Vision Document — v2.7.8  
**Author:** CanAI Founders  
**Status:** Codex-Locked Clarity Protocol  
**Purpose:** Confirmed user intent before prompt execution  
**System Layer:** Pre-ingestion intelligence layer for every product flow  
**Trigger:** Runs between Discovery Funnel input and GPT-4o prompt fulfillment  

---

## 1. Why This Layer Exists

No user prompt should be executed based on guesswork.

The Intent Mirror ensures:
- Every prompt is emotionally and strategically grounded  
- Every tone, goal, and motivation is explicitly understood  
- Every user feels deeply seen before anything is fulfilled  

This layer turns input friction into **trust momentum.**  
It is the first moment where the system says:  
> “We got you. Here’s what we understand — is that right?”

---

## 2. Mission-Critical Goals

| Objective                  | Target Value        |
|---------------------------|---------------------|
| Token savings             | ≥ 25%               |
| Output misalignment drop  | ≥ 30%               |
| Confirmation rate         | ≥ 85%               |
| Prompt trust score        | ≥ 4.4 per session   |
| Field override rate       | ≤ 5%                |
| Smart defaults accuracy   | ≥ 70%               |

These aren’t just numbers — they’re emotional reliability signals.  
All metrics must be tracked via `PromptLogs.enrichedInput` and reflected in StressBox outcomes.

---

## 3. Emotional Chain-of-Custody

**No prompt is allowed to proceed unless at least one of the following is present:**
1. Validated structured form inputs  
2. Spark Signal enrichment  
3. Vision Catcher fallback quote  

This ensures that **emotional resonance is never missing**.  
Every strategy begins with a clear why.

---

## 4. Inference System Design

**Model Cascade (automatic):**
1. Rules-based parser  
2. TinyLLM (fast, task-specific LLM)  
3. Fallback to GPT-3.5/Claude if low confidence  

**Sample Output:**
```json
{
  "business_type": "solo consultant",
  "primary_goal": "launch email list",
  "tone": "supportive",
  "motivator": "build confidence without burnout",
  "intent_confidence": 0.91,
  "source_map": {
    "tone": "spark",
    "motivator": "vision",
    "primary_goal": "form"
  },
  "usedSparkSignal": true,
  "usedVisionCatcher": true
}
```

---

## 5. Spark Signal Injection (Enhancement A)

Spark Intent is early, frictionless language — often more human and expressive.

This layer:
- Enhances tone and motivator if they're vague  
- Never overwrites confirmed fields  
- Logs `usedSparkSignal = true`  
- Can inform the confirmation phrasing:
  > “You mentioned wanting to finally feel in control — we’ve kept that in mind.”

---

## 6. Vision Catcher (Enhancement B)

Triggers if:
- Confidence < 0.80  
- Or tone, goal, or motivator are ambiguous or missing

Prompt:
> *“What would ultimate success feel like for you?”*

Captures emotional clarity in `vision_feel_quote`  
Logs `usedVisionCatcher = true`  
Used for fallback phrasing and summary UX grounding

---

## 7. Motivational Hook

If Spark or Vision signals reveal a deeper drive, this becomes a dedicated anchor:
```json
"motivationHook": "Break free from hesitation and finally launch with confidence"
```

This can:
- Influence Smart Defaults  
- Personalize prompt framing  
- Increase emotional alignment downstream

---

## 8. Confirmation UX Logic

Phrasing must feel intuitive, kind, and accurate.

Example:
> “Looks like you’re a consultant launching an email list with a supportive tone. Sound right?”

**Confidence-Based Microcopy:**
- >90%: “Looks great.”  
- 80–89%: “Seem right?”  
- <80%: “Help us fine-tune this.”

**Features:**
- One-click confirm or “Tweak”  
- Inline editing per field  
- Optional “See why we inferred this” overlay  
- Motivation hook preview:
  > “You said you’re ready to finally get unstuck — we’ve honored that here.”

---

## 9. Schema & Field Handling

### Every structured field must include:
- `confidence: float`
- `source: string`
- `wasConfirmed: boolean`
- `overrideable: boolean`
- `errorState: boolean`

### Conditional Fields:
- `KPI`, `launch_timing`, `target_audience`, `founder_story`  
  → Only injected if contextually inferred or mentioned

### Conflict Resolution:
If Spark says “fun” and Vision says “serious”:
> “You mentioned both ‘fun’ and ‘urgency’ — should this feel more upbeat or focused?”

### Confirmation Skipping Logic:
- If all inputs are complete + high confidence → mirror can be skipped  
- If user skips confirmation → flag `unconfirmed: true`

---

## 10. Learning & Feedback Engine

- All tweaks logged via `feedbackDelta`  
- System adapts Smart Defaults and inference model over time  
- Track:
  - Most-edited fields  
  - Tone shifts  
  - Unconfirmed sessions  
- Use deltas to retrain mirror accuracy monthly  
- Enable “Use previous intent?” for returning users

---

## 11. Privacy & UX Protections

- Raw input discarded post-confirmation  
- Only `StructuredIntent` is saved  
- Consider local processing for sensitive flows  
- `motivationHook` never shown externally  
- “See why” overlays show field source (e.g., Spark vs Vision)

---

## 12. Shadow Mode Validation & Launch

Deploy shadow mode across:
- `ai_blueprint`  
- `social_content`  
- High-ambiguity flow (e.g., `ai_brand_identity`)

**Pass Criteria:**
- ≥ 85% confirmation rate  
- ≤ 5% override rate  
- ≥ 20% token savings  
- Average trust score delta ≥ +0.2  
- Confirmation UX latency < 1.2s (95th percentile)

---

## 13. Cursor Alignment Protocol

> This document supersedes all prior mirror logic.

**Action Required:**
- Re-evaluate all prior schema, Spark, and Vision logic  
- Identify outdated assumptions  
- Log differences as:
  `auto-actions.log.md → tag: visionRecalibration: intent-mirror-v2.7.8`  
- Confirm alignment before beginning Confirmation UX (Step 3)

**No further development may proceed** until this document is fully understood and implemented.

---

## Final Lock

This document governs the Intent Mirror Layer across all CanAI products and prompt types.

It protects emotional trust.  
It eliminates misalignment.  
It ensures every prompt begins with human clarity.

**This is how we build trust at scale.**