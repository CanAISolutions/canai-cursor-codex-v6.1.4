# 🚀 Schema Migration Execution Plan
**Date**: 2025-01-27  
**Priority**: CRITICAL - Production Trust Transparency at Stake  
**Execution Window**: Low-traffic period recommended  
**Sacred Reversal Test**: Will this execution plan make our system more trustworthy? **YES**

---

## 📋 Executive Summary

**Mission**: Align production Supabase schema with CANAI-INTERFACE-CATALOG.json to ensure:
- **Trust Score Mathematical Precision**: Convert [0,5] to [0,1] for SparkSplit accuracy
- **API Integration Compatibility**: Convert snake_case to camelCase for webhook success
- **Data Integrity**: Preserve all existing data while fixing misalignments

**Expected Downtime**: < 5 minutes (with proper preparation)  
**Risk Level**: LOW (with comprehensive testing and rollback plan)  
**Business Impact**: HIGH POSITIVE (fixes trust transparency calculations)

---

## 🎯 Pre-Execution Checklist

### ✅ **Phase 0: Preparation (Day Before)**
1. **Database Backup**
   ```sql
   -- Create full backup
   pg_dump your_database > schema_migration_backup_$(date +%Y%m%d).sql
   ```

2. **Test Environment Setup**
   - Clone production data to staging
   - Verify staging environment mirrors production
   - Test migration scripts on staging first

3. **Team Coordination**
   - Notify development team of migration window
   - Ensure Make.com webhooks are temporarily disabled
   - Prepare monitoring dashboard

4. **Validation Baseline**
   ```sql
   -- Run on production BEFORE migration
   SELECT * FROM test_pre_migration_trust_scores();
   SELECT * FROM test_pre_migration_field_naming();
   SELECT * FROM test_pre_migration_data_integrity();
   ```

---

## 🚀 **Phase 1: Pre-Migration Validation (15 minutes)**

### Step 1.1: Install Test Functions
```sql
-- Execute on production database
\i SCHEMA-VALIDATION-TESTS.sql
```

### Step 1.2: Run Baseline Tests
```sql
-- Document current state
\o pre_migration_baseline.txt
SELECT 'BASELINE VALIDATION STARTED' as status, now() as timestamp;
SELECT * FROM test_pre_migration_trust_scores();
SELECT * FROM test_pre_migration_field_naming();
SELECT * FROM test_pre_migration_data_integrity();
SELECT 'BASELINE VALIDATION COMPLETED' as status, now() as timestamp;
\o
```

### Step 1.3: Validate Test Results
- **Trust Scores**: Should show [0,5] ranges
- **Field Naming**: Should show predominantly snake_case
- **Data Integrity**: Should show GOOD_INTEGRITY status

**🛑 STOP CONDITION**: If baseline tests show unexpected results, investigate before proceeding.

---

## ⚡ **Phase 2: Critical Migration Execution (5 minutes)**

### Step 2.1: Trust Score Standardization (CRITICAL)
```sql
-- Execute Phase 1 from migration script
BEGIN;

-- Update existing trust score data to [0,1] range
UPDATE user_context 
SET trust_score_current = CASE 
    WHEN trust_score_current IS NOT NULL THEN trust_score_current / 5.0 
    ELSE NULL 
END
WHERE trust_score_current IS NOT NULL;

UPDATE session_analytics 
SET 
    trust_score_before = CASE 
        WHEN trust_score_before IS NOT NULL THEN trust_score_before / 5.0 
        ELSE NULL 
    END,
    trust_score_after = CASE 
        WHEN trust_score_after IS NOT NULL THEN trust_score_after / 5.0 
        ELSE NULL 
    END,
    trust_delta = CASE 
        WHEN trust_delta IS NOT NULL THEN trust_delta / 5.0 
        ELSE NULL 
    END
WHERE trust_score_before IS NOT NULL 
   OR trust_score_after IS NOT NULL 
   OR trust_delta IS NOT NULL;

-- Add new constraints
ALTER TABLE user_context 
ADD CONSTRAINT user_context_trust_score_current_check 
CHECK (trust_score_current >= 0 AND trust_score_current <= 1);

ALTER TABLE session_analytics 
ADD CONSTRAINT session_analytics_trust_score_before_check 
CHECK (trust_score_before >= 0 AND trust_score_before <= 1);

ALTER TABLE session_analytics 
ADD CONSTRAINT session_analytics_trust_score_after_check 
CHECK (trust_score_after >= 0 AND trust_score_after <= 1);

COMMIT;
```

### Step 2.2: Immediate Validation Check
```sql
-- Verify trust score transformation
SELECT 'TRUST_SCORE_VALIDATION' as test,
       COUNT(*) as total_records,
       MIN(trust_score_current) as min_value,
       MAX(trust_score_current) as max_value,
       CASE 
           WHEN MIN(trust_score_current) >= 0 AND MAX(trust_score_current) <= 1 
           THEN 'PASSED' 
           ELSE 'FAILED' 
       END as validation_status
FROM user_context 
WHERE trust_score_current IS NOT NULL;
```

**🛑 ROLLBACK CONDITION**: If validation_status = 'FAILED', execute rollback immediately.

### Step 2.3: Field Naming Harmonization
```sql
-- Execute Phase 2 from migration script
BEGIN;

-- Critical API fields first
ALTER TABLE user_context RENAME COLUMN user_id TO "userId";
ALTER TABLE user_context RENAME COLUMN trust_score_current TO "trustScore";
ALTER TABLE session_analytics RENAME COLUMN session_id TO "sessionId";
ALTER TABLE session_analytics RENAME COLUMN user_id TO "userId";
ALTER TABLE session_analytics RENAME COLUMN trust_score_before TO "trustScoreBefore";
ALTER TABLE session_analytics RENAME COLUMN trust_score_after TO "trustScoreAfter";

-- Continue with remaining fields...
-- (Execute full Phase 2 from migration script)

COMMIT;
```

### Step 2.4: Foreign Key Updates
```sql
-- Execute Phase 3 from migration script
-- Update all foreign key references to use camelCase
```

---

## 🔍 **Phase 3: Post-Migration Validation (10 minutes)**

### Step 3.1: Comprehensive Validation
```sql
\o post_migration_validation.txt
SELECT 'POST-MIGRATION VALIDATION STARTED' as status, now() as timestamp;

-- Run all post-migration tests
SELECT * FROM test_post_migration_trust_scores();
SELECT * FROM test_post_migration_field_naming();
SELECT * FROM test_interface_view_compatibility();
SELECT * FROM test_data_transformation_accuracy();
SELECT * FROM run_comprehensive_migration_validation();

SELECT 'POST-MIGRATION VALIDATION COMPLETED' as status, now() as timestamp;
\o
```

### Step 3.2: API Integration Tests
```sql
-- Test interface views
SELECT COUNT(*) as goldmine_records FROM "GoldmineOutput" LIMIT 5;
SELECT COUNT(*) as user_profile_records FROM "UserAIProfile" LIMIT 5;
SELECT COUNT(*) as sparksplit_records FROM "SparkSplitMetrics" LIMIT 5;

-- Test API payload generation
SELECT * FROM test_api_payload_compatibility();
```

### Step 3.3: Trust Score Mathematical Verification
```sql
-- Verify mathematical accuracy of trust transformation
SELECT 
    'MATHEMATICAL_VERIFICATION' as test,
    AVG("trustScore") * 5 as back_calculated_original,
    AVG("trustScore") as current_normalized,
    CASE 
        WHEN AVG("trustScore") BETWEEN 0.1 AND 0.9 THEN 'REALISTIC_RANGE'
        ELSE 'NEEDS_INVESTIGATION'
    END as distribution_analysis
FROM user_context 
WHERE "trustScore" IS NOT NULL;
```

---

## 🔄 **Phase 4: Rollback Plan (If Needed)**

### When to Rollback
- Any validation test returns 'FAILED' status
- Trust scores outside [0,1] range after migration
- Foreign key constraint violations
- API payload tests fail

### Rollback Procedure
```sql
BEGIN;

-- Restore original trust scores (multiply by 5)
UPDATE user_context SET "trustScore" = "trustScore" * 5.0 WHERE "trustScore" IS NOT NULL;
UPDATE session_analytics SET 
    "trustScoreBefore" = "trustScoreBefore" * 5.0,
    "trustScoreAfter" = "trustScoreAfter" * 5.0,
    "trustDelta" = "trustDelta" * 5.0
WHERE "trustScoreBefore" IS NOT NULL OR "trustScoreAfter" IS NOT NULL;

-- Restore original field names
ALTER TABLE user_context RENAME COLUMN "userId" TO user_id;
ALTER TABLE user_context RENAME COLUMN "trustScore" TO trust_score_current;
-- ... (continue with all renamed fields)

-- Drop new constraints
ALTER TABLE user_context DROP CONSTRAINT user_context_trust_score_current_check;
-- ... (continue with all new constraints)

COMMIT;
```

---

## 📊 **Phase 5: Success Verification and Monitoring**

### Success Criteria
- ✅ All trust scores in [0,1] range
- ✅ All critical fields use camelCase
- ✅ Interface views return data
- ✅ API payloads generate correctly
- ✅ No data loss (record counts match pre-migration)

### Post-Migration Monitoring (First 24 Hours)
1. **Trust Score Accuracy**: Monitor SparkSplit calculations
2. **API Integration**: Verify Make.com webhook payloads
3. **Error Rates**: Watch for constraint violations
4. **Performance**: Ensure query performance unchanged

### Validation Queries to Run Daily (First Week)
```sql
-- Daily health check
SELECT 
    'DAILY_HEALTH_CHECK' as check_type,
    COUNT(*) as total_users,
    AVG("trustScore") as avg_trust_score,
    MIN("trustScore") as min_trust_score,
    MAX("trustScore") as max_trust_score,
    COUNT(*) FILTER (WHERE "trustScore" BETWEEN 0 AND 1) as valid_trust_scores,
    now() as check_time
FROM user_context 
WHERE "trustScore" IS NOT NULL;
```

---

## 🎖️ **Sacred Execution Covenant**

**We solemnly swear:**

To execute this migration with mathematical precision and emotional intelligence.  
To preserve every data point while fixing the trust transparency calculations.  
To validate every change through comprehensive testing.  
To maintain zero trust score degradation for our users.

**If any step fails the Sacred Reversal Test - "Would this make our system more trustworthy?" - we stop and reassess.**

---

## 📞 **Emergency Contacts and Escalation**

### Critical Issues Contact
- **Database Issues**: Database Admin team
- **Trust Score Anomalies**: SparkSplit engineering team  
- **API Integration Failures**: Make.com integration team

### Escalation Triggers
- Any validation test returning 'FAILED'
- Trust scores outside expected ranges
- Foreign key violations
- User complaints about trust transparency

---

## 🏆 **Success Definition**

**Mission Accomplished When:**
1. **Trust Transparency**: SparkSplit calculations use correct [0,1] range
2. **API Integration**: Make.com webhooks receive camelCase payloads
3. **Data Integrity**: Zero data loss, all relationships preserved
4. **User Experience**: Trust scores feel more accurate and reliable
5. **Mathematical Precision**: All calculations align with interface specifications

**Emotional Sovereignty Validation**: Users experience more accurate trust transparency, leading to increased confidence in our system.

**Test-First Truth Achievement**: Every change proven to work through comprehensive validation.

---

**"We do not just migrate schemas - we migrate toward mathematical truth and user trust."** 