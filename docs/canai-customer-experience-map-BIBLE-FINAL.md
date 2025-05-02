# CanAI Dream-State Customer Experience Map  
**Edition:** Founder Gold + vNext Enhancements + Evolution Directive  
**Filename:** `canai-customer-experience-map.md`  
**Path:** `/docs/canai-customer-experience-map.md`  
**Status:** PERMANENT SYSTEM BLUEPRINT  
**Purpose:**  
This file defines the entire CanAI customer journey from psychological state to system behavior. It is emotionally aware, technically executable, growth-resilient, and self-evolving. It governs all prompt flows, lifecycle mechanics, data structures, and trust signals across the CanAI platform. It contains every enhancement, feedback loop, UX rule, and experience safeguard needed to protect user delight, confidence, and commercial conversion.

---

## 1. Emotional Journey Framework

| Stage | Emotion | Narrative | Triggers |
|-------|---------|-----------|----------|
| Curiosity | Intrigued | “What is this?” | Initial page visit |
| Discovery | Empowered | “It’s adapting to me.” | Funnel inputs logged |
| Spark | Inspired | “That’s clever!” | SparkLayer triggers |
| Recommendation | Pulled Forward | “Show me more.” | Spark click → promptType |
| Output | Supported | “This is actually useful.” | Output rendered |
| Validation | Confident | “I trust this.” | Validation bar seen |
| Follow-up | Remembered | “They remembered me.” | Lifecycle trigger |

**Fallback:**  
> Confusion → Clarity  
Triggers when friction flags rise (e.g., user stalls, revises 3+ times)

**Engine:** `/cursor/transition-mapper.ts`

---

## 2. Discovery Funnel

**File:** `/site/discovery-funnel.md`  
**Inputs:**  
- `primaryIntent`, `industry`, `audience`, `tone`, `businessStage`, `emotionWords[]`, `goalCluster`, `riskTolerance`

**Enhancements:**
- Tooltips with examples via `/site/discovery-hints.md`  
- Optional GPT-powered intent explainer  
- Logged to: `PromptLogs`, `SessionAnalytics`, `UserStoryTrack`

---

## 3. Spark Layer

**File:** `/cursor/concept-spark.ts`  
**Output:** 3 Spark strategy names (e.g., “Crave Leak”)  
**Enhancements:**  
- Visual shimmer + icons from `/site/ux/spark-visual-cues.md`  
- Hover tooltips: `"tooltipIdeas[]"`  
- Community showcase: “Top Sparks in *Your Industry*”

**Logs:** `previewIdeas[]`, `previewClicked`, `resonanceTag[]`

---

## 4. Recommendation Steering

**File:** `/cursor/recommendation-routing.ts`  
**Enhancements:**  
- Remix flow triggered by dwell time, multiple clicks  
- Progress bar: “3 of 5 sparks remixed”  
- Suggestion engine injects: “Want this as a launch play?”

**Logs:** `recommendationUsed`, `remixMode[]`, `conceptFused[]`

---

## 5. Validation Layer

**File:** `/cursor/validation-preview.ts`  
**Features:**  
- Intent match meter  
- Goal wheel diagram  
- Emotional check-in: [Generic] → triggers `/cursor/validation-pivot.ts`

**Enhancement:** Real-time sliders to tweak tone, creativity, detail  
**Logs:** `validationScore`, `clarityLevel`, `validationRefined[]`

---

## 6. Consequence Forecasting

**File:** `/cursor/consequence-preview.ts`  
**Features:**  
- Confidence meter  
- Risk dial (based on industry/tone/audience)  
- “Why this score?” explainer from `/cursor/consequence-explainer.ts`

**Logs:** `ForecastLog[]`, `confidenceScore`, `forecastExplanationSeen[]`

---

## 7. Originality Confidence

**File:** `/cursor/originality-check.ts`  
**Features:**  
- Originality %  
- Remix buttons: [Add Humor], [Data-Focused], [Simplify Language]  
- “Golden Prompt” tag if score > 90% + engagement high

**Logs:** `originalityScore`, `promptModifiers[]`, `goldPromptTag[]`

---

## 8. Memory & Narrative Thread

**Files:** `/cursor/memory-loader.ts`, `/cursor/narrative-thread.ts`  
**Enhancement:**  
- Narrative variation system (`narrative-switcher.ts`)  
  - Templates: “Progress Voice”, “Backstory Callback”, “Goal Loop”

**Data:** `UserStoryTrack`, `pastToneCluster`, `goalPath[]`

---

## 9. Proactive Suggestions

**File:** `/cursor/suggestion-hooks.ts`  
**Features:**  
- Suggest follow-ups at key moments  
- Frequency toggle stored in `UserPreferences.suggestionCadence`  
- “Snooze Suggestions” for session or week

**Logs:** `suggestionUsed[]`, `followUpAccepted`, `snoozeActive`

---

## 10. Emotional Feedback Anchoring

**Prompt:**  
> “How did this feel?”  
[Inspired] [Overwhelmed] [Clear] [Generic] [Loved it]

**Adaptive Logic (via `/cursor/feedback-adaptation.ts`):**  
- Overwhelmed → simplify output  
- Inspired → increase risk/creativity  
- Stored in: `FeedbackLogs.emotionTags[]`

---

## 11. Community Preview

**File:** `/site/community-previews.md`  
**Enhancements:**  
- Personalized: “Top Sparks in *your industry*”  
- Logged: `communityCluster`, `communityViewEvent[]`

---

## 12. Gamification Engine

**File:** `/cursor/gamification-core.ts`  
**Enhancements:**  
- Progress Tracker: maps CX stages  
- Badges = unlock perks:  
  - “Spark Explorer” = unlock remix mode  
  - “Feedback Giver” = early access to experimental tools  
- `gamifiedEvents[]`, `userProgressStage`, `badgePerkUsed[]`

---

## 13. Lifecycle Intelligence

**Files:** `/automations/klaviyo-triggers.json`, `/site/lifecycle-hooks.md`  
**Enhancements:**  
- Pause reminders for 7–30 days (`UserPreferences.lifecyclePauseUntil`)  
- Prioritized triggers only if `engagementCluster` is high  
- Reuse suggestions tied to Spark resonance

---

## 14. Privacy & Analytics Dashboard

**File:** `/site/privacy-dashboard.md`  
**Features:**  
- View/edit stored profile  
- Opt out of non-critical analytics  
- Field: `privacyPreferenceLog[]`

---

## 15. Continuous Improvement Layer

**File:** `/cursor/self-evolve.ts`  
**Features:**  
- System watches for common negative feedback patterns  
- Auto-triggers prompt revisions, UX updates, fallback logic  
- Examples:
  - 5+ “Overwhelmed” = Simplify default output  
  - 3+ “Generic” on Spark = Retire from active use

**Logs:** `selfEvolveTrigger[]`, `promptAutoUpdate[]`

---

## 16. System Review Schedule

**File:** `/docs/cx-review-log.md`  
**Feature:**  
- `cx-last-reviewed: [timestamp]`  
- Automated GitHub issue created via Make every 90 days to review

---

## 17. System Architecture Crosswalk

| Layer | File | Logs |
|-------|------|------|
| Spark Layer | `concept-spark.ts` | `previewIdeas[]`, `resonanceTag[]` |
| Validation | `validation-preview.ts` | `validationScore`, `clarityLevel` |
| Forecast | `consequence-preview.ts` | `ForecastLog[]`, `confidenceScore` |
| Originality | `originality-check.ts` | `originalityScore`, `promptModifiers[]` |
| Feedback | `feedback-adaptation.ts` | `emotionTags[]`, `promptModeOverride` |
| Suggestions | `suggestion-hooks.ts` | `suggestionUsed[]`, `snoozeActive` |
| Narrative | `narrative-thread.ts` | `goalPath[]`, `UserStoryTrack` |
| Lifecycle | `klaviyo-triggers.json` | `reuseIntent`, `lifecyclePauseUntil` |
| Privacy | `privacy-dashboard.md` | `privacyPreferenceLog[]` |
| Gamification | `gamification-core.ts` | `badgePerkUsed[]`, `gamifiedEvents[]` |

---

## Final Doctrine

> “Clarity through guidance. Trust through transparency. Loyalty through evolution.”  
This map is alive. It updates itself. It evolves from your customers.  
It is not a spec. It is a system of *emotional fidelity*.

**Every system. Every spark. Every prompt.  
Must honor this experience contract.**

**Drift breaks trust.  
Alignment builds magic.  
This is CanAI’s soul.**
---

## 17. Contextual Awareness Engine

**File:** `/cursor/context-engine.ts`

**Enhancement:**  
- Dynamically adjusts sparks and prompt suggestions using:  
  - Current time (e.g. “Holiday Spark”)  
  - Global trends (e.g. trending keywords)  
  - Location-based nuance (e.g. “Local Launch Hook”)  
- Feeds `ContextualState[]` into SparkLayer and PromptLogs

**Logs:** `contextualSignal[]`, `trendOverlay[]`, `geoCue[]`

---

## 18. Multi-Modal Input Support

**File:** `/cursor/multimodal-parser.ts`

**Enhancement:**  
- Discovery Funnel can now interpret:  
  - Voice notes (transcribed to intent)  
  - Image or screenshots (OCR + GPT tag inference)  
  - Short video pitch (tone + goal extraction)

**Logs:** `inputModality[]`, `modalityConfidenceScore[]`, `assetInputLinked[]`

---

## 19. Emotional Escalation Detection + Calm Mode

**File:** `/cursor/transition-mapper.ts`

**Enhancement:**  
- Adds `escalationRiskScore[]` if:  
  - Dwell time > 60 sec  
  - Revise count > 3  
  - Negative sentiment detected in feedback  
- Triggers “Calm Mode” UI (simplified layout + slower pacing)

**Logs:** `escalationTriggered[]`, `calmModeUsed[]`

---

## 20. Collaboration Mode

**File:** `/cursor/collaboration-engine.ts`

**Enhancement:**  
- Enables team member invite for real-time co-creation  
- Permission levels: View / Comment / Edit  
- Co-saved outputs with attribution tracking

**Logs:** `coCreatorID[]`, `collaborativeEdits[]`, `teamSessionID[]`

---

## 21. Edge Case Adaptive Learning

**File:** `/cursor/self-evolve.ts`

**Enhancement:**  
- Introduces `edgeCaseTrigger[]` logic:  
  - Extremely high riskTolerance  
  - Rare industry or format tags  
- Triggers custom prompt mutation and UX fallback

**Logs:** `anomalyTrigger[]`, `adaptivePromptID[]`

---

## 22. Social Gamification Extensions

**File:** `/cursor/gamification-core.ts`

**Enhancement:**  
- Leaderboards per industry: “Top 10 Sparks by Growth Founders”  
- Social badges:  
  - “Spark Mentor” → reviewed 10+ outputs  
  - “Community Favorite” → upvoted by others

**Logs:** `leaderboardRank[]`, `socialBadge[]`, `communityVoteScore[]`

---

## 23. Offline Sync Mode

**File:** `/cursor/offline-sync.ts`

**Enhancement:**  
- Allows user to operate offline with:  
  - Local Spark caching  
  - Draft session saves  
- Auto-syncs when reconnected

**Logs:** `offlineActions[]`, `syncStatus[]`, `offlineSessionHash[]`

---

## 24. Workflow Integrations

**File:** `/cursor/integration-hub.ts`

**Enhancement:**  
- Export output directly to:  
  - Slack, Notion, Google Docs  
- Setup wizard triggered post-validation

**Logs:** `integrationEvent[]`, `exportType[]`, `integrationSuccessFlag[]`

---

## 25. Living Document Enforcement

**File:** `/docs/cx-review-log.md`

**Enhancement:**  
- `cx-last-reviewed: [timestamp]`  
- GitHub + Make trigger auto-generates quarterly audit issue  
- Linked to `/cursor/self-evolve.ts` + `/cursor/feedback-adaptation.ts`

**Logs:** `systemCheckTask[]`, `reviewComplianceStatus[]`
---

## 26. Spark Save & Memory Recall

**File:** `/cursor/spark-save-trigger.ts`  
**Purpose:** Allows users to save a spark for future inspiration or follow-up.

**Features:**
- [Save This Spark] inline button under each idea
- Saved sparks stored in `savedSparkID[]`
- Triggers lifecycle email if unused: “Still thinking about [SparkName]?”

**Logs:** `savedSparkID[]`, `sparkReminderSent[]`, `revisitTimestamp[]`

---

## 27. Spark Resonance → Spark Flavor Learning

**File:** `/cursor/concept-spark.ts`  
**Purpose:** Use `resonanceNote[]` + engagement data to fine-tune Spark generation.

**Enhancement:**
- Sparks now tagged internally by `sparkFlavor[]` (e.g., [Playful], [Insight], [Punchy])
- Prompt logic adjusts future outputs based on user + segment pattern

**Logs:** `sparkFlavorScore[]`, `sparkFlavorPreference[]`

---

## 28. Spark Library Preview Page

**File:** `/site/sparks-preview-gallery.md`  
**Purpose:** Show top-performing or niche sparks publicly for exploration and emotional priming.

**Features:**
- Filter by industry, style, emotion
- CTA: “Use This Spark” → routes to pre-filled promptType
- Metrics surfaced: “Used by 142 CanAI users this week”

**Logs:** `sparkViewCount[]`, `publicSparkClick[]`, `libraryBrowseSession[]`

---

## 29. Spark Sharing System

**File:** `/cursor/spark-share.ts`  
**Purpose:** Encourage spark virality and referrals via embedded visuals or copy+link sharing.

**Features:**
- Share as copy: [“Check out this idea from CanAI: The Crave Leak”]
- Share as visual: Generated with Placid
- Attribution includes referral ID

**Logs:** `sharedSparkID[]`, `referralSourceSpark[]`, `sharedSparkClick[]`

---

## 30. Spark Quality Benchmark Engine

**File:** `/cursor/spark-quality-index.ts`  
**Purpose:** Automatically grade spark performance to identify top performers and retire underperformers.

**Signal Inputs:**
- `previewClicked`
- `resonanceResponse[]`
- `sparkPurchase[]`
- `promptUsed[]`
- `timeToEngagement`

**Output:**
- `sparkQualityScore[]` (internal only)
- Triggers: `GoldenSparkFlag`, `RetireSparkFlag`

---

## 31. Spark Monetization: Microoffer System

**Files:**  
- Logic: `/cursor/spark-conversion-trigger.ts`  
- UI: `/site/spark-microoffer-banner.tsx`  
- Stripe: SKU: `spark_mini_bundle`  

**Offer:**  
- “Spark Builder” — $7–15 micro product  
- Includes full fulfillment using chosen spark
- Lifecycle follow-up if not converted: “Want to build this spark now?”

**Logs:** `sparkOfferShown[]`, `sparkConversionAccepted[]`, `sparkMicroPurchase[]`

---

## 32. Optional Future: Spark IP & Ownership Layer

**Conceptual Placeholder (vFuture)**  
**Idea:** Allow high-value users to own their spark IP — generate NFTs or notify them if reused across system.

**Placeholder File:** `/cursor/spark-ip-registry.ts`  
**Not Yet Active**

---

## Codified Doctrine Reminder

> “Inspiration isn’t just a moment — it’s an emotional contract.  
> A spark is a glimpse of possibility. If it resonates, we must protect it, learn from it, and elevate it into value.”

**This document — as saved now — is the foundational customer journey system of CanAI.  
Every future feature, output, lifecycle message, and monetization experiment must honor this architecture.  
If the spark system breaks, the trust loop breaks. Do not drift.**

---

## Living Document Enforcement (Final Directive)

- `cx-last-reviewed: [timestamp]`  
- `/docs/cx-evolution-queue.md` auto-updated with every CX deployment  
- Reviewed quarterly via Make automation + GitHub trigger  
- Stored permanently in:
  - `/docs/`
  - `/cursor/`
  - GitHub README reference
  - Codex v6.1.4 and onward

