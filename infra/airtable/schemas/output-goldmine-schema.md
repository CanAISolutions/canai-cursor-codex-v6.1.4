# OutputGoldmine Table Schema

<!--
  What: Canonical schema for Output Goldmine — captures reusable outputs, emotional resonance patterns, and compound intelligence assets.
  Why: Transforms every session into monetizable, reusable assets. Enables AI-powered content generation, case studies, and personalized follow-ups.
  How: Structured capture of high-resonance outputs with emotional fingerprinting, industry clustering, and reuse potential scoring.
-->

## Table Overview
- **Name:** OutputGoldmine
- **Version:** v1.0.0
- **Purpose:** Captures and structures high-value outputs for reuse, monetization, and compound intelligence
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name              | Type      | Required | Default   | Emotional Role    | Data Sensitivity | Context Scope | Description / Orchestration Notes                                 | Codex Enforcement                                      |
|------------------------|-----------|----------|-----------|------------------|------------------|---------------|-------------------------------------------------------------------|--------------------------------------------------------|
| recordId               | ULID      | Yes      | —         | identity         | internal         | global        | Primary key for OutputGoldmine.                                   | Block record creation if missing. Audit trail required.|
| createdAt              | Timestamp | Yes      | now()     | traceability     | internal         | global        | Used for audit and recovery.                                      | Set to now() if missing. Audit trail required.         |
| updatedAt              | Timestamp | Yes      | now()     | traceability     | internal         | global        | Timestamp for last update.                                        | Set to now() if missing. Audit trail required.         |
| sessionId              | String    | Yes      | —         | traceability     | internal         | session       | Foreign key to SessionAnalytics.sessionId for session linkage.   | Block record creation if missing. Audit trail required.|
| userId                 | String    | No       | null      | identity         | pii              | user          | User identifier for personalization tracking.                     | Allow null if anonymous. Audit trail required.         |
| promptType             | String    | Yes      | —         | context          | internal         | session       | Product type that generated this output.                          | Block record creation if missing. Audit trail required.|
| outputContent          | LongText  | Yes      | —         | content          | internal         | output        | The actual output content (anonymized if needed).                | Block record creation if missing. Audit trail required.|
| outputHash             | String    | Yes      | —         | identity         | internal         | output        | SHA-256 hash of output for deduplication and similarity.         | Block record creation if missing. Audit trail required.|
| resonanceScore         | Number    | Yes      | 0.0       | quality          | internal         | output        | Emotional resonance score (0.0-10.0).                            | Set to 0.0 if missing. Audit trail required.           |
| trustScore             | Number    | Yes      | 0.0       | trust            | internal         | output        | Trust score from session (0.0-5.0).                              | Set to 0.0 if missing. Audit trail required.           |
| emotionalFingerprint   | Object    | Yes      | {}        | emotion          | internal         | output        | Emotional characteristics (tone, style, energy).                 | Set to empty object if missing. Audit trail required.  |
| industryCluster        | String    | No       | null      | categorization   | internal         | output        | Detected industry/vertical (e.g., 'coffee_retail', 'saas').      | Allow null if not detected. Audit trail required.      |
| intentSummary          | String    | Yes      | —         | context          | internal         | output        | Structured summary of user intent.                                | Block record creation if missing. Audit trail required.|
| sparkConcept           | String    | No       | null      | personalization  | internal         | output        | Spark concept that resonated with user.                          | Allow null if no spark used. Audit trail required.     |
| languageStyle          | Object    | No       | {}        | style            | internal         | output        | Language patterns, vocabulary, sentence structure.               | Set to empty object if missing. Audit trail required.  |
| reuseCategory          | String    | No       | null      | monetization     | internal         | output        | Category for reuse: 'case_study', 'template', 'inspiration'.     | Allow null if not categorized. Audit trail required.   |
| reusePotential         | Number    | No       | 0.0       | monetization     | internal         | output        | Potential for reuse/monetization (0.0-10.0).                     | Set to 0.0 if missing. Audit trail required.           |
| anonymizationLevel     | String    | Yes      | 'full'    | privacy          | internal         | output        | Level of anonymization: 'none', 'partial', 'full'.              | Set to 'full' if missing. Audit trail required.        |
| userConsent            | Boolean   | No       | false     | privacy          | pii              | output        | User consent for reuse/sharing.                                   | Set to false if missing. Audit trail required.         |
| shareableVersion      | LongText  | No       | null      | monetization     | internal         | output        | Anonymized/edited version ready for sharing.                     | Allow null if not prepared. Audit trail required.      |
| keyInsights            | Array     | No       | []        | intelligence     | internal         | output        | Extracted key insights and patterns.                             | Set to empty array if missing. Audit trail required.   |
| followUpOpportunities  | Array     | No       | []        | growth           | internal         | output        | Identified follow-up product opportunities.                      | Set to empty array if missing. Audit trail required.   |
| contentAssets          | Object    | No       | {}        | monetization     | internal         | output        | Generated content assets (social, blog, email).                  | Set to empty object if missing. Audit trail required.  |
| similarOutputs         | Array     | No       | []        | intelligence     | internal         | output        | Array of similar output IDs for clustering.                      | Set to empty array if missing. Audit trail required.   |
| performanceMetrics     | Object    | No       | {}        | analytics        | internal         | output        | User engagement metrics (saves, shares, exports).                | Set to empty object if missing. Audit trail required.  |
| evolutionTriggers      | Array     | No       | []        | improvement      | internal         | output        | Triggers for prompt/system evolution.                            | Set to empty array if missing. Audit trail required.   |
| monetizationFlags      | Object    | No       | {}        | business         | internal         | output        | Flags for monetization opportunities.                            | Set to empty object if missing. Audit trail required.  |
| compoundValue          | Number    | No       | 0.0       | business         | internal         | output        | Calculated compound value score (0.0-100.0).                     | Set to 0.0 if missing. Audit trail required.           |
| lastAccessedAt         | Timestamp | No       | null      | usage            | internal         | output        | When this output was last accessed for reuse.                    | Allow null if never accessed. Audit trail required.    |
| accessCount            | Number    | No       | 0         | usage            | internal         | output        | Number of times this output has been accessed.                   | Set to 0 if missing. Audit trail required.             |
| auditTrail             | Object    | No       | {}        | traceability     | internal         | session       | Audit log for all changes and fallback events.                   | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** Content generation, case study creation, template building, AI mining agents
- **Feeds:** Reuse engine, content assets, personalization, follow-up campaigns
- **Binds To:** SessionAnalytics, PromptLogs, UserContext, SparkSplitAnalytics
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Goldmine Intelligence Patterns
- **High-Resonance Clustering**: Group outputs by emotional fingerprint and industry
- **Template Generation**: Convert high-performing outputs into reusable templates
- **Case Study Mining**: Identify success stories for marketing and social proof
- **Follow-Up Orchestration**: Trigger personalized follow-up campaigns
- **Content Asset Generation**: Auto-generate blog posts, social content, email sequences

---

## Example Record
```json
{
  "recordId": "01HQGOLD123456789ABCDEF",
  "createdAt": "2025-01-27T14:30:00.000Z",
  "updatedAt": "2025-01-27T14:35:00.000Z",
  "sessionId": "session_abc123",
  "userId": "user_xyz789",
  "promptType": "business_plan",
  "outputContent": "[ANONYMIZED] Your coffee brand strategy focuses on busy professionals...",
  "outputHash": "sha256:abc123def456...",
  "resonanceScore": 9.2,
  "trustScore": 4.8,
  "emotionalFingerprint": {
    "tone": "confident",
    "energy": "high",
    "style": "professional",
    "vocabulary": "business-focused"
  },
  "industryCluster": "coffee_retail",
  "intentSummary": "Launch premium coffee brand targeting busy professionals",
  "sparkConcept": "The Morning Ritual Revolution",
  "languageStyle": {
    "sentenceLength": "medium",
    "complexity": "moderate",
    "personalPronouns": "high"
  },
  "reuseCategory": "case_study",
  "reusePotential": 8.5,
  "anonymizationLevel": "full",
  "userConsent": true,
  "shareableVersion": "A coffee entrepreneur used CanAI to develop a strategy...",
  "keyInsights": [
    "Premium positioning works for coffee",
    "Busy professionals value convenience",
    "Morning rituals are powerful emotional triggers"
  ],
  "followUpOpportunities": [
    "brand_identity",
    "social_content",
    "email_campaign"
  ],
  "contentAssets": {
    "blogPost": "How One Coffee Brand Captured the Morning Rush",
    "socialPost": "☕ The Morning Ritual Revolution is here...",
    "emailSubject": "Your coffee brand strategy is ready"
  },
  "similarOutputs": ["01HQGOLD987654321FEDCBA"],
  "performanceMetrics": {
    "saved": true,
    "shared": true,
    "exported": true,
    "timeSpent": 180
  },
  "evolutionTriggers": [
    "add_sustainability_angle",
    "expand_target_demographics"
  ],
  "monetizationFlags": {
    "templateWorthy": true,
    "caseStudyReady": true,
    "followUpReady": true
  },
  "compoundValue": 85.7,
  "lastAccessedAt": "2025-01-27T16:00:00.000Z",
  "accessCount": 3,
  "auditTrail": {
    "created": "2025-01-27T14:30:00.000Z",
    "events": [
      {
        "action": "anonymized",
        "timestamp": "2025-01-27T14:32:00.000Z"
      },
      {
        "action": "content_assets_generated",
        "timestamp": "2025-01-27T14:35:00.000Z"
      }
    ]
  }
}
``` 