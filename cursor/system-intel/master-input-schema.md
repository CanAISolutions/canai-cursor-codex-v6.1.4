# Master Input Schema — Soulfire Integration (Phase 3.0.0)

---

## 1. Core Product Prompts (Unified Input Fields)

| fieldName           | fieldType   | smartDefault                | emotionalRole         | promptType         | triggerLogic                | cxToneSentinel | flowAnnotation                                 |
|---------------------|-------------|-----------------------------|-----------------------|--------------------|-----------------------------|----------------|------------------------------------------------|
| userName            | text        | "Visionary"                | Identity, Welcome     | All                | Onboarding, Return          | Yes            | Webflow → Make → Prompt → Logs                 |
| userGoal            | text        | "Launch my next big idea"  | Aspiration, Momentum  | All                | Prompt start, CTA           | Yes            | Webflow → Make → Prompt → Logs                 |
| industry            | select      | "SaaS"                     | Context, Relevance    | Business Plan      | Smart default, enrichment   | Yes            | Webflow → Make → Prompt → Logs                 |
| tone                | select      | "Empowering"               | Emotional Calibration | All                | Prompt, output, fallback    | Yes            | Webflow → Make → Prompt → Logs                 |
| painPoint           | text        | "Wasting time on admin"    | Empathy, Trust        | Business Plan      | Enrichment, feedback        | Yes            | Webflow → Make → Prompt → Logs                 |
| visionQuote         | text        | "The future is ours."      | Inspiration, Spark    | All                | Spark Layer, output reveal  | Yes            | Webflow → Make → Prompt → Logs                 |
| ctaPreference       | select      | "Show me what's possible"  | Momentum, Curiosity   | All                | CTA, output reveal          | Yes            | Webflow → Make → Prompt → Logs                 |
| feedback            | text        | "This feels right."        | Validation, Trust     | All                | Feedback, session end       | Yes            | Webflow → Make → Prompt → FeedbackLogs         |
| email               | email       | (user input)                | Contact, Continuity   | All                | Onboarding, lifecycle       | Yes            | Webflow → Make → Prompt → Logs                 |
| sessionId           | text        | (auto-generated)            | Traceability, Safety  | All                | Session start, logging      | Yes            | Webflow → Make → Prompt → Logs                 |

---

## 2. Logging & Analytics Tables

### PromptLogs
| fieldName           | fieldType   | smartDefault                | emotionalRole         | promptType         | triggerLogic                | cxToneSentinel | flowAnnotation                                 |
|---------------------|-------------|-----------------------------|-----------------------|--------------------|-----------------------------|----------------|------------------------------------------------|
| sessionId           | text        | (auto-generated)            | Traceability, Safety  | All                | Session start, logging      | Yes            | Prompt → Logs                                   |
| promptType          | text        | (from product)              | Context, Audit        | All                | Prompt execution            | Yes            | Prompt → Logs                                   |
| inputSnapshot       | json        | (captured)                  | Audit, Recovery       | All                | Prompt execution            | Yes            | Prompt → Logs                                   |
| outputSnapshot      | json        | (captured)                  | Audit, Recovery       | All                | Output reveal               | Yes            | Prompt → Logs                                   |
| cxToneScore         | number      | 100                         | Trust, Audit          | All                | CX Tone Sentinel            | Yes            | Prompt → Logs                                   |
| fallbackUsed        | boolean     | false                       | Safety, Trust         | All                | Fallback trigger            | Yes            | Prompt → Logs                                   |
| timestamp           | datetime    | (auto-generated)            | Traceability          | All                | Logging                     | No             | Prompt → Logs                                   |

### FeedbackLogs
| fieldName           | fieldType   | smartDefault                | emotionalRole         | promptType         | triggerLogic                | cxToneSentinel | flowAnnotation                                 |
|---------------------|-------------|-----------------------------|-----------------------|--------------------|-----------------------------|----------------|------------------------------------------------|
| sessionId           | text        | (auto-generated)            | Traceability, Safety  | All                | Session end, feedback       | Yes            | Feedback → Logs                                 |
| feedback            | text        | "This feels right."        | Validation, Trust     | All                | Feedback, session end       | Yes            | Feedback → Logs                                 |
| cxToneScore         | number      | 100                         | Trust, Audit          | All                | CX Tone Sentinel            | Yes            | Feedback → Logs                                 |
| improvementFlag     | boolean     | false                       | Audit, Recovery       | All                | Feedback review             | Yes            | Feedback → Logs                                 |
| timestamp           | datetime    | (auto-generated)            | Traceability          | All                | Logging                     | No             | Feedback → Logs                                 |

### SessionAnalytics
| fieldName           | fieldType   | smartDefault                | emotionalRole         | promptType         | triggerLogic                | cxToneSentinel | flowAnnotation                                 |
|---------------------|-------------|-----------------------------|-----------------------|--------------------|-----------------------------|----------------|------------------------------------------------|
| sessionId           | text        | (auto-generated)            | Traceability, Safety  | All                | Session start, logging      | Yes            | Session → Analytics                             |
| userName            | text        | "Visionary"                | Identity, Welcome     | All                | Onboarding, Return          | Yes            | Session → Analytics                             |
| promptType          | text        | (from product)              | Context, Audit        | All                | Prompt execution            | Yes            | Session → Analytics                             |
| cxToneScore         | number      | 100                         | Trust, Audit          | All                | CX Tone Sentinel            | Yes            | Session → Analytics                             |
| engagementScore     | number      | 100                         | Momentum, Trust       | All                | Session end                 | Yes            | Session → Analytics                             |
| timestamp           | datetime    | (auto-generated)            | Traceability          | All                | Logging                     | No             | Session → Analytics                             |

### ReferralTriggers
| fieldName           | fieldType   | smartDefault                | emotionalRole         | promptType         | triggerLogic                | cxToneSentinel | flowAnnotation                                 |
|---------------------|-------------|-----------------------------|-----------------------|--------------------|-----------------------------|----------------|------------------------------------------------|
| sessionId           | text        | (auto-generated)            | Traceability, Safety  | All                | Referral event              | Yes            | Referral → Logs                                 |
| userName            | text        | "Visionary"                | Identity, Welcome     | All                | Referral event              | Yes            | Referral → Logs                                 |
| referralSource      | text        | "Friend"                   | Trust, Social Proof   | All                | Referral event              | Yes            | Referral → Logs                                 |
| timestamp           | datetime    | (auto-generated)            | Traceability          | All                | Logging                     | No             | Referral → Logs                                 |

### DeliveryCostLogs
| fieldName           | fieldType   | smartDefault                | emotionalRole         | promptType         | triggerLogic                | cxToneSentinel | flowAnnotation                                 |
|---------------------|-------------|-----------------------------|-----------------------|--------------------|-----------------------------|----------------|------------------------------------------------|
| sessionId           | text        | (auto-generated)            | Traceability, Safety  | All                | Delivery event              | Yes            | Delivery → Logs                                 |
| promptType          | text        | (from product)              | Context, Audit        | All                | Delivery event              | Yes            | Delivery → Logs                                 |
| deliveryCost        | number      | 0                           | Audit, Trust          | All                | Delivery event              | Yes            | Delivery → Logs                                 |
| timestamp           | datetime    | (auto-generated)            | Traceability          | All                | Logging                     | No             | Delivery → Logs                                 |

---

## 3. CX Tone Sentinel-Relevant Fields
- All fields marked "Yes" in cxToneSentinel column are scanned for emotional resonance, trust, and clarity at every flow transition.
- Violations are logged and remediated before user delivery.

---

## 4. Flow Annotations
- All input fields are mapped from Webflow → Make → Prompt → Logging tables for full traceability and emotional continuity.
- Every field is annotated for emotional role and system trigger.

--- 