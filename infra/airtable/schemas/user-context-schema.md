# UserContext Table Schema — CanAI Airtable

---

## Purpose
Encodes user persona, culture, cognitive and emotional traits for orchestration, analytics, and emotional continuity. Foundation for personalization, emotional resonance, and trust-building across all CanAI flows.

---

## Field Breakdown

| Field Name       | Type      | Required | Default     | Emotional Role | Data Sensitivity | Context Scope | Orchestration Notes                                                                 | Codex Enforcement                                      |
|------------------|-----------|----------|-------------|---------------|------------------|---------------|-------------------------------------------------------------------------------------|--------------------------------------------------------|
| recordId         | ulid      | Yes      | null        | identity      | internal         | global        | Primary key for UserContext. Referenced by all related tables.                      | Block if missing. Audit trail required.                |
| createdAt        | timestamp | Yes      | now()       | traceability  | internal         | global        | Used for audit and recovery.                                                        | Set to now() if missing. Audit trail required.         |
| updatedAt        | timestamp | Yes      | now()       | traceability  | internal         | global        | Tracks last update for audit.                                                        | Set to now() if missing. Audit trail required.         |
| userId           | string    | Yes      | null        | identity      | pii              | user          | User identifier for context binding. Foreign key to user system.                    | Block if missing. Audit trail required.                |
| personaProfile   | object    | Yes      | {}          | persona       | internal         | user          | Persona archetype/profile (e.g., visionary, operator, creator). Drives personalization and emotional resonance. | Log as empty object and flag for review. Audit trail.  |
| cultureVector    | array     | No       | []          | culture       | internal         | user          | Cultural tags (e.g., EMEA, startup, risk-tolerant). Used for adaptive UX/analytics. | Set to [] if missing. Audit trail.                     |
| emotionalTraits  | object    | No       | {}          | emotion       | internal         | user          | Key emotional traits (e.g., empathy, ambition, resilience). For emotional memory/trust-building. | Set to {} if missing. Audit trail.                     |
| cognitiveStyle   | string    | No       | balanced    | cognition     | internal         | user          | Cognitive style (e.g., analytical, creative, balanced). For adaptive prompt/UX.     | Set to 'balanced' if missing. Audit trail.             |
| contextVector    | array     | No       | []          | context       | internal         | user          | Contextual tags (e.g., novice, bold). For session adaptation/analytics.             | Set to [] if missing. Audit trail.                     |
| trustLevel       | number    | No       | 0.5         | trust         | internal         | user          | Trust score (0.0–1.0). For fallback, escalation, analytics.                         | Set to 0.5 if missing. Audit trail.                    |
| memoryTokens     | array     | No       | []          | memory        | internal         | user          | Tokens/keys for memory recall and session continuity.                               | Set to [] if missing. Audit trail.                     |
| auditTrail       | object    | No       | {}          | traceability  | internal         | user          | Audit log for all changes and fallback events.                                      | Set to {} if missing. Audit trail.                     |

---

## Emotional Context & Fallback Logic
- **PersonaProfile** is the emotional anchor for all personalization and trust-building. If missing, system logs and flags for review, never proceeds silently.
- **CultureVector, EmotionalTraits, CognitiveStyle, ContextVector** enable emotionally intelligent adaptation and memory. All default to safe, neutral values if missing, with audit log.
- **TrustLevel** is central to fallback and escalation. Defaults to 0.5 (neutral trust) if missing, always logged.
- **MemoryTokens** ensure session continuity and emotional memory. Defaults to empty if missing, with audit log.
- **AuditTrail** is required for all fallback, mutation, and recovery events.

---

## Codex Enforcement
- All required fields block record creation if missing.
- All optional fields default and log fallback event if missing.
- All changes, fallbacks, and mutations are auditable and logged.
- Schema is modular, emotionally annotated, and versioned for orchestration and analytics.

---

## Orchestration Mapping
- **Referenced by:**
  - PromptLogs (for input enrichment, trust, and persona context)
  - SessionAnalytics (for session-level adaptation, emotional trajectory, and trust metrics)
  - FeedbackLogs (for emotional resonance, micro-emotion capture, and user context)
  - All personalization, analytics, and memory layers
- **Enables:**
  - Emotional continuity across sessions and outputs
  - Adaptive UX and prompt flows based on persona, culture, and cognitive style
  - Trust-building and fallback logic tailored to user traits
  - Analytics and reporting on user journeys, emotional trends, and trust evolution
- **Codex Principle:**
  - UserContext is the backbone of emotionally intelligent orchestration. Every flow that adapts, remembers, or personalizes references this table to ensure clarity, trust, and emotional resonance are always preserved.

---

> "Every user is a story. UserContext is the memory, emotion, and trust that makes every journey personal and safe." 