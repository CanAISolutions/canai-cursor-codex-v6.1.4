# UserAIResume Table Schema

<!--
  What: Canonical schema for User AI Resume — tracks evolving user profiles, preferences, and personalization data across sessions.
  Why: Enables deep personalization, predictive follow-ups, and compound user intelligence that improves with every interaction.
  How: Captures user style evolution, brand development, goal progression, and emotional patterns for ultimate personalization.
-->

## Table Overview
- **Name:** UserAIResume
- **Version:** v1.0.0
- **Purpose:** Tracks evolving user profiles and AI-powered personalization data for compound intelligence
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name              | Type      | Required | Default   | Emotional Role    | Data Sensitivity | Context Scope | Description / Orchestration Notes                                 | Codex Enforcement                                      |
|------------------------|-----------|----------|-----------|------------------|------------------|---------------|-------------------------------------------------------------------|--------------------------------------------------------|
| recordId               | ULID      | Yes      | —         | identity         | internal         | global        | Primary key for UserAIResume.                                     | Block record creation if missing. Audit trail required.|
| createdAt              | Timestamp | Yes      | now()     | traceability     | internal         | global        | Used for audit and recovery.                                      | Set to now() if missing. Audit trail required.         |
| updatedAt              | Timestamp | Yes      | now()     | traceability     | internal         | global        | Timestamp for last update.                                        | Set to now() if missing. Audit trail required.         |
| userId                 | String    | Yes      | —         | identity         | pii              | user          | User identifier for this AI resume.                              | Block record creation if missing. Audit trail required.|
| userEmail              | String    | No       | null      | identity         | pii              | user          | User email for personalization (if provided).                    | Allow null if not provided. Audit trail required.      |
| firstSessionDate       | Timestamp | Yes      | now()     | lifecycle        | internal         | user          | Date of user's first session.                                    | Set to now() if missing. Audit trail required.         |
| lastSessionDate        | Timestamp | Yes      | now()     | lifecycle        | internal         | user          | Date of user's most recent session.                              | Set to now() if missing. Audit trail required.         |
| totalSessions          | Number    | Yes      | 0         | engagement       | internal         | user          | Total number of sessions for this user.                          | Set to 0 if missing. Audit trail required.             |
| preferredTone          | String    | No       | null      | style            | internal         | user          | User's preferred communication tone.                              | Allow null if not determined. Audit trail required.    |
| communicationStyle     | Object    | No       | {}        | style            | internal         | user          | Detailed communication style preferences.                        | Set to empty object if missing. Audit trail required.  |
| industryFocus          | Array     | No       | []        | context          | internal         | user          | Industries the user is interested in or working with.            | Set to empty array if missing. Audit trail required.   |
| businessGoals          | Array     | No       | []        | goals            | internal         | user          | User's stated or inferred business goals.                        | Set to empty array if missing. Audit trail required.   |
| emotionalProfile       | Object    | No       | {}        | emotion          | internal         | user          | User's emotional patterns and preferences.                       | Set to empty object if missing. Audit trail required.  |
| sparkResonance         | Object    | No       | {}        | personalization  | internal         | user          | Spark concepts that resonate with this user.                     | Set to empty object if missing. Audit trail required.  |
| brandEvolution         | Array     | No       | []        | growth           | internal         | user          | Timeline of user's brand/business development.                   | Set to empty array if missing. Audit trail required.   |
| productPreferences     | Object    | No       | {}        | preferences      | internal         | user          | Preferred CanAI products and features.                           | Set to empty object if missing. Audit trail required.  |
| languagePatterns       | Object    | No       | {}        | style            | internal         | user          | User's language patterns and vocabulary preferences.             | Set to empty object if missing. Audit trail required.  |
| successMetrics         | Object    | No       | {}        | achievement      | internal         | user          | How user measures success and achievement.                       | Set to empty object if missing. Audit trail required.  |
| challengePatterns      | Array     | No       | []        | growth           | internal         | user          | Common challenges and how user approaches them.                  | Set to empty array if missing. Audit trail required.   |
| followUpHistory        | Array     | No       | []        | engagement       | internal         | user          | History of follow-up campaigns and responses.                    | Set to empty array if missing. Audit trail required.   |
| referralBehavior       | Object    | No       | {}        | viral            | internal         | user          | User's referral patterns and advocacy behavior.                  | Set to empty object if missing. Audit trail required.  |
| trustJourney           | Array     | No       | []        | trust            | internal         | user          | User's trust development over time.                              | Set to empty array if missing. Audit trail required.   |
| sparkSplitHistory      | Array     | No       | []        | transparency     | internal         | user          | User's SparkSplit selections and trust transparency journey.     | Set to empty array if missing. Audit trail required.   |
| personalizationScore   | Number    | Yes      | 0.0       | intelligence     | internal         | user          | How well we understand this user (0.0-10.0).                    | Set to 0.0 if missing. Audit trail required.           |
| predictiveInsights     | Object    | No       | {}        | intelligence     | internal         | user          | AI-generated insights about user's future needs.                | Set to empty object if missing. Audit trail required.  |
| nextBestActions        | Array     | No       | []        | growth           | internal         | user          | Recommended next actions for this user.                         | Set to empty array if missing. Audit trail required.   |
| lifetimeValue          | Number    | No       | 0.0       | business         | internal         | user          | Calculated or estimated lifetime value.                          | Set to 0.0 if missing. Audit trail required.           |
| churnRisk              | Number    | No       | 0.0       | retention        | internal         | user          | Calculated churn risk score (0.0-10.0).                         | Set to 0.0 if missing. Audit trail required.           |
| engagementTrend        | String    | No       | 'stable' | engagement       | internal         | user          | Engagement trend: 'increasing', 'stable', 'decreasing'.         | Set to 'stable' if missing. Audit trail required.      |
| lastPersonalizationUpdate | Timestamp | No    | null      | intelligence     | internal         | user          | When personalization data was last updated.                     | Allow null if never updated. Audit trail required.     |
| consentLevel           | String    | Yes      | 'basic'   | privacy          | pii              | user          | User's consent level: 'basic', 'enhanced', 'full'.              | Set to 'basic' if missing. Audit trail required.       |
| dataRetentionPreference | String   | No       | 'standard' | privacy         | pii              | user          | User's data retention preference.                                | Set to 'standard' if missing. Audit trail required.    |
| auditTrail             | Object    | No       | {}        | traceability     | internal         | user          | Audit log for all changes and fallback events.                   | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** Personalization engine, follow-up campaigns, predictive analytics, churn prevention
- **Feeds:** Smart defaults, personalized prompts, targeted campaigns, retention strategies
- **Binds To:** SessionAnalytics, PromptLogs, OutputGoldmine, SparkSplitAnalytics, UserContext
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## AI Resume Intelligence Patterns
- **Style Evolution Tracking**: Monitor how user's communication style develops over time
- **Goal Progression Mapping**: Track user's business goals and achievement patterns
- **Emotional Intelligence**: Deep understanding of user's emotional triggers and preferences
- **Predictive Personalization**: AI-powered predictions of user's future needs and interests
- **Churn Prevention**: Early warning system for users at risk of disengagement

---

## Example Record
```json
{
  "recordId": "01HQRESUME123456789ABCD",
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-27T14:30:00.000Z",
  "userId": "user_xyz789",
  "userEmail": "sarah@coffeestartup.com",
  "firstSessionDate": "2025-01-15T10:00:00.000Z",
  "lastSessionDate": "2025-01-27T14:30:00.000Z",
  "totalSessions": 8,
  "preferredTone": "confident",
  "communicationStyle": {
    "formality": "professional",
    "energy": "high",
    "directness": "direct",
    "emotionalExpression": "moderate"
  },
  "industryFocus": ["coffee_retail", "food_service", "sustainability"],
  "businessGoals": [
    "launch_coffee_brand",
    "build_sustainable_business",
    "target_busy_professionals"
  ],
  "emotionalProfile": {
    "primaryMotivators": ["achievement", "impact", "authenticity"],
    "stressPoints": ["overwhelm", "uncertainty"],
    "energySources": ["progress", "recognition", "community"],
    "communicationNeeds": ["clarity", "encouragement", "actionable_steps"]
  },
  "sparkResonance": {
    "highResonanceConcepts": [
      "The Morning Ritual Revolution",
      "Sustainable Impact Pioneer",
      "Professional Empowerment Hub"
    ],
    "averageResonanceScore": 8.7,
    "preferredSparkTypes": ["empowerment", "revolution", "impact"]
  },
  "brandEvolution": [
    {
      "date": "2025-01-15",
      "stage": "idea_validation",
      "focus": "coffee_concept",
      "confidence": 6.2
    },
    {
      "date": "2025-01-22",
      "stage": "business_planning",
      "focus": "sustainability_integration",
      "confidence": 7.8
    },
    {
      "date": "2025-01-27",
      "stage": "brand_development",
      "focus": "professional_targeting",
      "confidence": 8.5
    }
  ],
  "productPreferences": {
    "mostUsed": ["business_plan", "brand_identity"],
    "highestSatisfaction": ["business_plan"],
    "requestedFeatures": ["sustainability_focus", "professional_targeting"],
    "preferredDeliveryFormat": "comprehensive_with_actionable_steps"
  },
  "languagePatterns": {
    "vocabularyLevel": "professional",
    "sentenceComplexity": "moderate",
    "technicalComfort": "high",
    "preferredPronouns": "first_person",
    "actionOrientation": "high"
  },
  "successMetrics": {
    "primaryKPIs": ["customer_acquisition", "brand_recognition", "sustainability_impact"],
    "timeframes": ["6_month_launch", "1_year_profitability"],
    "measurementStyle": "data_driven_with_emotional_validation"
  },
  "challengePatterns": [
    {
      "challenge": "market_positioning",
      "approach": "research_and_differentiation",
      "supportNeeded": "strategic_guidance"
    },
    {
      "challenge": "sustainability_integration",
      "approach": "values_driven_solutions",
      "supportNeeded": "practical_implementation"
    }
  ],
  "followUpHistory": [
    {
      "date": "2025-01-20",
      "campaign": "business_plan_follow_up",
      "response": "engaged",
      "nextAction": "brand_identity"
    }
  ],
  "referralBehavior": {
    "likelihood": 8.5,
    "preferredChannels": ["linkedin", "industry_groups"],
    "referralTriggers": ["success_achievement", "value_demonstration"],
    "advocacyStyle": "professional_recommendation"
  },
  "trustJourney": [
    {
      "date": "2025-01-15",
      "trustScore": 6.8,
      "milestone": "first_session_completion"
    },
    {
      "date": "2025-01-22",
      "trustScore": 8.2,
      "milestone": "sparksplit_canai_selection"
    },
    {
      "date": "2025-01-27",
      "trustScore": 9.1,
      "milestone": "referral_consideration"
    }
  ],
  "sparkSplitHistory": [
    {
      "date": "2025-01-22",
      "comparisonId": "sparksplit_comp_001",
      "selection": "canai",
      "timeToSelection": 45,
      "feedback": "CanAI version understood my vision better",
      "trustDeltaAchieved": 2.3
    }
  ],
  "personalizationScore": 8.9,
  "predictiveInsights": {
    "nextLikelyProducts": ["social_content", "email_campaign"],
    "optimalTiming": "weekday_mornings",
    "preferredCommunicationFrequency": "weekly",
    "churnRiskFactors": ["long_gaps_between_sessions"],
    "growthOpportunities": ["sustainability_bundle", "professional_network_expansion"]
  },
  "nextBestActions": [
    {
      "action": "brand_identity_offer",
      "priority": "high",
      "timing": "within_3_days",
      "personalization": "sustainability_focused_professional_brand"
    },
    {
      "action": "sustainability_content_series",
      "priority": "medium",
      "timing": "next_week",
      "personalization": "coffee_industry_sustainability_trends"
    }
  ],
  "lifetimeValue": 247.50,
  "churnRisk": 2.1,
  "engagementTrend": "increasing",
  "lastPersonalizationUpdate": "2025-01-27T14:30:00.000Z",
  "consentLevel": "enhanced",
  "dataRetentionPreference": "extended",
  "auditTrail": {
    "created": "2025-01-15T10:00:00.000Z",
    "events": [
      {
        "action": "profile_created",
        "timestamp": "2025-01-15T10:00:00.000Z"
      },
      {
        "action": "personalization_updated",
        "timestamp": "2025-01-22T16:00:00.000Z"
      },
      {
        "action": "trust_milestone_achieved",
        "timestamp": "2025-01-27T14:30:00.000Z"
      }
    ]
  }
}
``` 