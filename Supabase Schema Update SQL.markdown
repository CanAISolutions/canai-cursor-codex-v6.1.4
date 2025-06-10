# Supabase Schema Update SQL

This document provides SQL statements to align the Supabase schema (`supabase-schema.json`) with the `CANAI-INTERFACE-CATALOG.json`. The updates address:
- Trust score range mismatches (from `[0, 5]` to `[0, 1]`)
- Field naming convention mismatches (from snake_case to camelCase)
- Removal of extra fields not present in the corresponding interfaces

## Assumptions
- The `user_context` table corresponds to the `UserAIProfile` interface.
- The `session_analytics` table corresponds to the `SparkSplitMetrics` interface.
- Other tables (`airtable_sync`, `analytics_aggregates`, `competitive_advantage_metrics`, `emotional_intelligence`, `sparksplit_comparisons`) are retained as-is unless explicitly unused, as they may serve other system purposes.
- No data loss is acceptable; existing data will be preserved during renaming and constraint changes.
- Existing constraints (e.g., foreign keys, unique constraints) are preserved unless explicitly modified.

## SQL Statements

### 1. Update `user_context` Table (Maps to `UserAIProfile`)

#### Rename Columns (snake_case to camelCase)
```sql
ALTER TABLE user_context RENAME COLUMN user_id TO userId;
ALTER TABLE user_context RENAME COLUMN total_sessions TO totalSessions;
ALTER TABLE user_context RENAME COLUMN preferred_tone TO preferredTone;
ALTER TABLE user_context RENAME COLUMN industry_focus TO industryFocus;
ALTER TABLE user_context RENAME COLUMN business_goals TO businessGoals;
ALTER TABLE user_context RENAME COLUMN emotional_profile TO emotionalProfile;
ALTER TABLE user_context RENAME COLUMN spark_resonance TO sparkResonance;
ALTER TABLE user_context RENAME COLUMN personalization_score TO personalizationScore;
ALTER TABLE user_context RENAME COLUMN predictive_insights TO predictiveInsights;
ALTER TABLE user_context RENAME COLUMN lifetime_value TO lifetimeValue;
ALTER TABLE user_context RENAME COLUMN churn_risk TO churnRisk;
ALTER TABLE user_context RENAME COLUMN engagement_trend TO engagementTrend;
ALTER TABLE user_context RENAME COLUMN trust_score_current TO trustScore;
ALTER TABLE user_context RENAME COLUMN created_at TO createdAt;
ALTER TABLE user_context RENAME COLUMN updated_at TO updatedAt;
```

#### Update Trust Score Range
```sql
ALTER TABLE user_context
DROP CONSTRAINT IF EXISTS user_context_trust_score_current_check,
ADD CONSTRAINT user_context_trust_score_check CHECK (trustScore >= 0 AND trustScore <= 1);
```

#### Drop Extra Fields
The following fields are not present in `UserAIProfile`:
- `email`
- `name`
- `trust_history`

```sql
ALTER TABLE user_context DROP COLUMN IF EXISTS email;
ALTER TABLE user_context DROP COLUMN IF EXISTS name;
ALTER TABLE user_context DROP COLUMN IF EXISTS trust_history;
```

### 2. Update `session_analytics` Table (Maps to `SparkSplitMetrics`)

#### Rename Columns (snake_case to camelCase)
```sql
ALTER TABLE session_analytics RENAME COLUMN session_id TO sessionId;
ALTER TABLE session_analytics RENAME COLUMN user_id TO userId;
ALTER TABLE session_analytics RENAME COLUMN prompt_count TO promptCount;
ALTER TABLE session_analytics RENAME COLUMN trust_score_before TO trustScoreBefore;
ALTER TABLE session_analytics RENAME COLUMN trust_score_after TO trustScoreAfter;
ALTER TABLE session_analytics RENAME COLUMN trust_delta TO trustDelta;
ALTER TABLE session_analytics RENAME COLUMN emotional_depth TO emotionalDepth;
ALTER TABLE session_analytics RENAME COLUMN awe_score TO aweScore;
ALTER TABLE session_analytics RENAME COLUMN ownership_score TO ownershipScore;
ALTER TABLE session_analytics RENAME COLUMN wonder_score TO wonderScore;
ALTER TABLE session_analytics RENAME COLUMN calm_score TO calmScore;
ALTER TABLE session_analytics RENAME COLUMN power_score TO powerScore;
ALTER TABLE session_analytics RENAME COLUMN override_count TO overrideCount;
ALTER TABLE session_analytics RENAME COLUMN time_to_confirmation TO timeToConfirmation;
ALTER TABLE session_analytics RENAME COLUMN drop_off_signal TO dropOffSignal;
ALTER TABLE session_analytics RENAME COLUMN webhook_triggered TO webhookTriggered;
ALTER TABLE session_analytics RENAME COLUMN webhook_scenario TO webhookScenario;
ALTER TABLE session_analytics RENAME COLUMN webhook_response TO webhookResponse;
ALTER TABLE session_analytics RENAME COLUMN created_at TO createdAt;
ALTER TABLE session_analytics RENAME COLUMN updated_at TO updatedAt;
```

#### Update Trust Score Ranges
```sql
ALTER TABLE session_analytics
DROP CONSTRAINT IF EXISTS session_analytics_trust_score_before_check,
DROP CONSTRAINT IF EXISTS session_analytics_trust_score_after_check,
DROP CONSTRAINT IF EXISTS session_analytics_trust_delta_check,
ADD CONSTRAINT session_analytics_trust_score_before_check CHECK (trustScoreBefore >= 0 AND trustScoreBefore <= 1),
ADD CONSTRAINT session_analytics_trust_score_after_check CHECK (trustScoreAfter >= 0 AND trustScoreAfter <= 1),
ADD CONSTRAINT session_analytics_trust_delta_check CHECK (trustDelta >= -1 AND trustDelta <= 1);
```

#### Drop Extra Fields
The following fields are not present in `SparkSplitMetrics`:
- `start_time`
- `end_time`
- `duration`
- `products_used`
- `primary_product`
- `override_count`
- `drop_off_signal`
- `cohort`
- `status`
- `webhook_triggered`
- `webhook_scenario`
- `webhook_response`

```sql
ALTER TABLE session_analytics DROP COLUMN IF EXISTS start_time;
ALTER TABLE session_analytics DROP COLUMN IF EXISTS end_time;
ALTER TABLE session_analytics DROP COLUMN IF EXISTS duration;
ALTER TABLE session_analytics DROP COLUMN IF EXISTS products_used;
ALTER TABLE session_analytics DROP COLUMN IF EXISTS primary_product;
ALTER TABLE session_analytics DROP COLUMN IF EXISTS override_count;
ALTER TABLE session_analytics DROP COLUMN IF EXISTS drop_off_signal;
ALTER TABLE session_analytics DROP COLUMN IF EXISTS cohort;
ALTER TABLE session_analytics DROP COLUMN IF EXISTS status;
ALTER TABLE session_analytics DROP COLUMN IF EXISTS webhook_triggered;
ALTER TABLE session_analytics DROP COLUMN IF EXISTS webhook_scenario;
ALTER TABLE session_analytics DROP COLUMN IF EXISTS webhook_response;
```

### 3. Notes on Other Tables
The following tables in `supabase-schema.json` do not have direct corresponding interfaces in `CANAI-INTERFACE-CATALOG.json`:
- `airtable_sync`
- `analytics_aggregates`
- `competitive_advantage_metrics`
- `emotional_intelligence`
- `sparksplit_comparisons`

These tables are retained as-is because they may serve other system purposes not covered by the provided interfaces. However, trust score-related fields in these tables should also be updated to the `[0, 1]` range to ensure consistency.

#### Update `competitive_advantage_metrics` Trust Score Ranges
```sql
ALTER TABLE competitive_advantage_metrics
DROP CONSTRAINT IF EXISTS competitive_advantage_metrics_trust_transparency_advantage_check,
DROP CONSTRAINT IF EXISTS competitive_advantage_metrics_emotional_intelligence_advantage_check,
DROP CONSTRAINT IF EXISTS competitive_advantage_metrics_user_empowerment_advantage_check,
DROP CONSTRAINT IF EXISTS competitive_advantage_metrics_competitive_differentiation_check,
DROP CONSTRAINT IF EXISTS competitive_advantage_metrics_replication_difficulty_check,
DROP CONSTRAINT IF EXISTS competitive_advantage_metrics_market_leadership_score_check,
DROP CONSTRAINT IF EXISTS competitive_advantage_metrics_user_loyalty_impact_check,
DROP CONSTRAINT IF EXISTS competitive_advantage_metrics_word_of_mouth_potential_check,
DROP CONSTRAINT IF EXISTS competitive_advantage_metrics_competitive_moat_strength_check,
ADD CONSTRAINT competitive_advantage_metrics_trust_transparency_advantage_check CHECK (trust_transparency_advantage >= 0 AND trust_transparency_advantage <= 1),
ADD CONSTRAINT competitive_advantage_metrics_emotional_intelligence_advantage_check CHECK (emotional_intelligence_advantage >= 0 AND emotional_intelligence_advantage <= 1),
ADD CONSTRAINT competitive_advantage_metrics_user_empowerment_advantage_check CHECK (user_empowerment_advantage >= 0 AND user_empowerment_advantage <= 1),
ADD CONSTRAINT competitive_advantage_metrics_competitive_differentiation_check CHECK (competitive_differentiation >= 0 AND competitive_differentiation <= 1),
ADD CONSTRAINT competitive_advantage_metrics_replication_difficulty_check CHECK (replication_difficulty >= 0 AND replication_difficulty <= 1),
ADD CONSTRAINT competitive_advantage_metrics_market_leadership_score_check CHECK (market_leadership_score >= 0 AND market_leadership_score <= 1),
ADD CONSTRAINT competitive_advantage_metrics_user_loyalty_impact_check CHECK (user_loyalty_impact >= 0 AND user_loyalty_impact <= 1),
ADD CONSTRAINT competitive_advantage_metrics_word_of_mouth_potential_check CHECK (word_of_mouth_potential >= 0 AND word_of_mouth_potential <= 1),
ADD CONSTRAINT competitive_advantage_metrics_competitive_moat_strength_check CHECK (competitive_moat_strength >= 0 AND competitive_moat_strength <= 1);
```

#### Update `emotional_intelligence` Trust Score Range
```sql
ALTER TABLE emotional_intelligence
DROP CONSTRAINT IF EXISTS emotional_intelligence_confidence_level_check,
ADD CONSTRAINT emotional_intelligence_confidence_level_check CHECK (confidence_level >= 0 AND confidence_level <= 1);
```

#### Update `sparksplit_comparisons` Trust Score Ranges
```sql
ALTER TABLE sparksplit_comparisons
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_canai_awe_score_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_canai_ownership_score_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_canai_wonder_score_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_canai_calm_score_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_canai_power_score_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_sterile_awe_score_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_sterile_ownership_score_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_sterile_wonder_score_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_sterile_calm_score_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_sterile_power_score_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_trust_delta_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_competitive_advantage_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_trust_transparency_score_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_emotional_education_score_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_revolutionary_positioning_check,
DROP CONSTRAINT IF EXISTS sparksplit_comparisons_viral_potential_score_check,
ADD CONSTRAINT sparksplit_comparisons_canai_awe_score_check CHECK (canai_awe_score >= 0 AND canai_awe_score <= 1),
ADD CONSTRAINT sparksplit_comparisons_canai_ownership_score_check CHECK (canai_ownership_score >= 0 AND canai_ownership_score <= 1),
ADD CONSTRAINT sparksplit_comparisons_canai_wonder_score_check CHECK (canai_wonder_score >= 0 AND canai_wonder_score <= 1),
ADD CONSTRAINT sparksplit_comparisons_canai_calm_score_check CHECK (canai_calm_score >= 0 AND canai_calm_score <= 1),
ADD CONSTRAINT sparksplit_comparisons_canai_power_score_check CHECK (canai_power_score >= 0 AND canai_power_score <= 1),
ADD CONSTRAINT sparksplit_comparisons_sterile_awe_score_check CHECK (sterile_awe_score >= 0 AND sterile_awe_score <= 1),
ADD CONSTRAINT sparksplit_comparisons_sterile_ownership_score_check CHECK (sterile_ownership_score >= 0 AND sterile_ownership_score <= 1),
ADD CONSTRAINT sparksplit_comparisons_sterile_wonder_score_check CHECK (sterile_wonder_score >= 0 AND sterile_wonder_score <= 1),
ADD CONSTRAINT sparksplit_comparisons_sterile_calm_score_check CHECK (sterile_calm_score >= 0 AND sterile_calm_score <= 1),
ADD CONSTRAINT sparksplit_comparisons_sterile_power_score_check CHECK (sterile_power_score >= 0 AND sterile_power_score <= 1),
ADD CONSTRAINT sparksplit_comparisons_trust_delta_check CHECK (trust_delta >= -1 AND trust_delta <= 1),
ADD CONSTRAINT sparksplit_comparisons_competitive_advantage_check CHECK (competitive_advantage >= 0 AND competitive_advantage <= 1),
ADD CONSTRAINT sparksplit_comparisons_trust_transparency_score_check CHECK (trust_transparency_score >= 0 AND trust_transparency_score <= 1),
ADD CONSTRAINT sparksplit_comparisons_emotional_education_score_check CHECK (emotional_education_score >= 0 AND emotional_education_score <= 1),
ADD CONSTRAINT sparksplit_comparisons_revolutionary_positioning_check CHECK (revolutionary_positioning >= 0 AND revolutionary_positioning <= 1),
ADD CONSTRAINT sparksplit_comparisons_viral_potential_score_check CHECK (viral_potential_score >= 0 AND viral_potential_score <= 1);
```

### 4. Validation Steps
After applying these SQL statements:
1. **Verify Schema Alignment**: Check that column names in `user_context` and `session_analytics` match the camelCase fields in `UserAIProfile` and `SparkSplitMetrics`.
2. **Validate Constraints**: Ensure trust score fields enforce the `[0, 1]` range using `SELECT * FROM information_schema.check_constraints`.
3. **Test Data Integrity**: Query existing data to confirm no data loss occurred during renaming or dropping columns.
4. **Integration Testing**: Test API endpoints (e.g., `/webhook/user-profile`, `/webhook/sparksplit-metrics`) to ensure compatibility with the updated schema.
5. **Update Documentation**: Update `supabase-schema.json` to reflect the new column names, ranges, and removed fields.

### 5. Additional Notes
- **Foreign Keys**: Ensure foreign key constraints (e.g., `userId` in `session_analytics` referencing `userId` in `user_context`) are updated if necessary. The above SQL assumes foreign keys use the renamed columns.
- **Retained Tables**: Tables like `airtable_sync` and `analytics_aggregates` were not modified due to lack of direct interface mappings. Review their usage in the broader system before making changes.
- **Backup**: Before executing these SQL statements, back up the database to prevent data loss in case of errors.
- **Testing**: Follow the `testFirstTruth` principle from the schema and verify changes with integration tests, as specified in the `CANAI-INTERFACE-CATALOG.json`.