---
docType: "prompt-guide"
audience: "ai-copilot"
codexTag: "v6.1.4"
locked: true
linkedPromptTypes: ["reverse_strategy", "business_plan", "ai_brand_identity"]
---

# 🌟 Spark Primer — The Emotional Engine Behind the Discovery Funnel

## ✨ Purpose

The Spark Layer is the **first emotional heartbeat** of the CanAI experience.  
It appears in **Step 3 of the Discovery Funnel**, before any prompt is fulfilled, any CTA is clicked, or any trust is earned.

It is the moment the user realizes:  
> “This system *gets me.*”

## 🎯 Goal

To generate 3 **emotionally resonant, curiosity-triggering concept names** — tailored to the user’s challenge, tone, and intent — that immediately inspire action and trust.

These sparks act like campaign titles, playbook names, or visionary headlines.  
They are not just suggestions — they are *identity mirrors*.

---

## 🧠 Why Spark Exists

We are not building a tool.  
We are building an emotionally intelligent partner that helps the user feel confident, excited, and professionally seen.

**Before** the user writes a single input…  
**Before** they understand how GPT works…  
**Before** they trust our platform…

...they meet Spark.

If Spark does its job:
- The user feels understood
- The CTA feels irresistible
- The rest of the system feels emotionally safe

---

## 🌀 How Spark Works

**Input:**  
The Spark Layer receives:
- User intent or product challenge (e.g., “launch a loyalty program for a bakery”)
- Optional tone (e.g., playful, sleek, bold)
- Emotional style (inferred or explicit)

**Processing:**  
1. Match to Spark style templates and resonance themes
2. Inject tone-matching via `emotionalMemoryBank.ts`
3. Generate 3 curiosity-driving Spark Names (e.g.):
   - “The Crave Loop”
   - “Fresh Bread, Daily Loyalty”
   - “The 7-Day Muffin Magnet”

4. Score outputs using `SmartPromptScore.ts` to ensure:
   - High emotional fidelity
   - Resonance with user tone
   - No generic phrasing or low-trust templates

**Output:**
- Display as cards, each with a short subheadline (optional)
- Preload a CTA: “Get My [Spark Name] Blueprint”
- Log Spark to PromptLogs with emotional metadata
- Offer soft revision option: “Show me 3 more ideas”

---

## 🎭 UX Microcopy Examples

| Use Case | Spark Name | CTA Preview |
|----------|------------|-------------|
| Launching a coffee brand | The Espresso Mission | Get My Espresso Mission Blueprint |
| Personal branding for a consultant | The Authority Spark | Build My Authority Spark Strategy |
| Social campaign for eco startup | Green Is the Hook | Launch My Green Campaign Blueprint |

---

## 🧠 What Makes a Spark *Good*?

- **It surprises** without confusing
- **It matches tone** (playful, bold, calm, assertive)
- **It evokes curiosity** (“what is this?”)
- **It previews strategy** in just 3-5 words
- **It feels like *mine*** — personalized, not generic

---

## ❌ What to Avoid

| Anti-Pattern | Description |
|--------------|-------------|
| Generic | “Marketing Strategy”, “Growth Plan”, “Business Funnel” |
| Buzzword-only | “Hype Engine”, “Click Magnet”, “AI Turbo Mode” |
| Unanchored | Concepts not connected to the user’s challenge |
| Overlong | Phrases over 6 words, awkward grammar, passive structure |
| Emotionless | Fails to elicit curiosity or confidence |

---

## 🧩 Spark Integration Points

- **Comes after user challenge input (Discovery Step 3)**
- Pulls from: `emotionalMemoryBank.ts`, `SmartPromptScore.ts`, `sessionReuseEngine.ts`
- Fallbacks:
   - If Spark fails or scores < trustScoreThreshold (4.2), default to graceful reassurance:
     > “We're warming up the right ideas for you — Spark suggestions coming shortly.”
   - Offer soft retry: “Try again” or “Change tone”

---

## 🧪 Test Scenarios

- Generate Sparks for each industry vertical (bakery, consulting, SaaS, fitness, etc.)
- Confirm tone-matching: playful, bold, calm, luxury
- Fallback on low trust scores (< 4.2)
- Log events to PromptLogs: sparkCreated, sparkFallback, sparkReused
- CTA preview accuracy and personalization (e.g., “Get My Loyalty Spark”)

---

## 🛠 Future Enhancements

- ✨ Dynamic Spark memory: track which sparks performed best across sessions
- ✨ User editable spark: allow user to rename their concept post-generation
- ✨ “Why This Spark?” button — explain emotional tone match and curiosity value

---

## 🌈 Final Note to Builders

This is not just another feature.

This is the *first impression*.  
The moment CanAI stops being a tool and starts being *a trusted creative partner*.  

Build Spark with magic in mind.  
Every Spark name should feel like the start of a journey.

Let’s give users the feeling that something powerful, personal, and **inevitable** is about to happen.

