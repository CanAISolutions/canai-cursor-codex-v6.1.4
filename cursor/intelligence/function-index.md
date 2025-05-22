# Function Index

> This file is auto-generated or manually curated. Each function is indexed with location, usage, emotional sensitivity, Codex Pillar, and test status.

---

## Pillar: Emotional UX Fidelity

- **EmotionalValidator** (class)
  - Location: cursor/validators/emotional-validator.ts
  - Exports:
    - validateEmotionalTone (emotional contract, tone scoring)
    - validateEvent, validateMessage, validateContent, validateScore, validateSession, validateResponse (emotional scoring)
  - Emotional Tags: empathy, tone, fallback, trust
  - Usage: All emotional validation and scoring across system outputs, fallbacks, and agent responses
  - Test Status: PARTIAL (see DreamState tests)

- **CXToneSentinel** (class)
  - Location: cursor/validators/cx-tone-sentinel.ts
  - Exports:
    - scan (tone drift, reversal test)
  - Emotional Tags: tone, drift, clarity, CX
  - Usage: Scans outputs, fallbacks, CTAs, emails for tone drift and emotional disconnects
  - Test Status: UNKNOWN

- **DreamStateChecker** (class)
  - Location: cursor/validators/dream-state.ts
  - Exports:
    - validate (dream state alignment)
  - Emotional Tags: empowerment, clarity, confidence, progress
  - Usage: Validates dream state alignment in outputs and agent results
  - Test Status: UNKNOWN

## Pillar: Trust & Operational Resilience

- **TrustScoreCalculator** (class)
  - Location: cursor/validators/trust-score.ts
  - Exports:
    - calculateTrustScore (trust scoring)
    - validateTrustScore (trust threshold validation)
  - Emotional Tags: trust, safety, reliability, transparency
  - Usage: Calculates and validates trust score for system and agent operations
  - Test Status: PARTIAL (see DreamState tests)

---

# Next: Continue extraction for /cursor/utils/, /api/, /gpt-templates/, and other emotionally sensitive modules. 