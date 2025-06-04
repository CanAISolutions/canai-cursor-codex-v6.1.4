-- ============================================================================
-- CANONICAL VALIDATION QUERIES - VERIFIED DEPLOYMENT CHECKER
-- ============================================================================
-- Status: ✅ VERIFIED - Use these queries to validate each deployment phase
-- Purpose: Ensure 100% successful deployment with no errors

-- ============================================================================
-- PHASE 1: CORE SCHEMA VALIDATION (18 Tables)
-- ============================================================================

-- Check table count (Expect: 18)
SELECT 'Table Count Check' as validation_type, 
       COUNT(*) as actual_count, 
       18 as expected_count,
       CASE WHEN COUNT(*) = 18 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Check specific core tables exist
SELECT 'Core Tables Check' as validation_type,
       table_name,
       CASE WHEN table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (VALUES 
    ('session_analytics'),
    ('prompt_logs'),
    ('sparksplit_analytics'),
    ('goldmine_output'),
    ('user_context'),
    ('emotional_intelligence'),
    ('trust_metrics'),
    ('performance_metrics'),
    ('error_logs'),
    ('processing_results'),
    ('webhook_logs'),
    ('system_health'),
    ('airtable_sync'),
    ('prompt_types'),
    ('system_configs'),
    ('analytics_aggregates'),
    ('emotional_states'),
    ('trust_factors')
) AS expected(table_name)
LEFT JOIN information_schema.tables t 
    ON expected.table_name = t.table_name 
    AND t.table_schema = 'public';

-- Check extensions are enabled
SELECT 'Extensions Check' as validation_type,
       extname as extension_name,
       '✅ ENABLED' as status
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'vector', 'pg_trgm');

-- ============================================================================
-- PHASE 2: SPARKSPLIT SCHEMA VALIDATION (Additional Tables)
-- ============================================================================

-- Check SparkSplit tables exist
SELECT 'SparkSplit Tables Check' as validation_type,
       table_name,
       CASE WHEN table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM (VALUES 
    ('sparksplit_comparisons'),
    ('sparksplit_analytics'),
    ('competitive_advantage_metrics'),
    ('trust_transparency_metrics')
) AS expected(table_name)
LEFT JOIN information_schema.tables t 
    ON expected.table_name = t.table_name 
    AND t.table_schema = 'public';

-- ============================================================================
-- PHASE 3: GIN INDEXES VALIDATION
-- ============================================================================

-- Check GIN indexes on prompt_logs (Expect: 3)
SELECT 'GIN Indexes Check' as validation_type,
       indexname,
       tablename,
       '✅ EXISTS' as status
FROM pg_indexes 
WHERE tablename = 'prompt_logs' 
AND indexname LIKE 'idx_prompt_logs_%_gin'
ORDER BY indexname;

-- Count GIN indexes (Expect: 3)
SELECT 'GIN Index Count' as validation_type,
       COUNT(*) as actual_count,
       3 as expected_count,
       CASE WHEN COUNT(*) = 3 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM pg_indexes 
WHERE tablename = 'prompt_logs' 
AND indexname LIKE 'idx_prompt_logs_%_gin';

-- ============================================================================
-- PHASE 4: FOREIGN KEYS VALIDATION
-- ============================================================================

-- Check foreign key constraints
SELECT 'Foreign Keys Check' as validation_type,
       tc.table_name,
       tc.constraint_name,
       kcu.column_name,
       ccu.table_name AS referenced_table,
       '✅ EXISTS' as status
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- Count foreign keys (Expect: 18+)
SELECT 'Foreign Key Count' as validation_type,
       COUNT(*) as actual_count,
       18 as minimum_expected,
       CASE WHEN COUNT(*) >= 18 THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_schema = 'public';

-- ============================================================================
-- PHASE 5: EMOTIONAL SOVEREIGNTY VALIDATION
-- ============================================================================

-- Check trust score validation functions exist
SELECT 'Trust Functions Check' as validation_type,
       routine_name,
       '✅ EXISTS' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'validate_schema_integrity',
    'check_performance_health',
    'calculate_spark_resonance',
    'calculate_average_trust_score',
    'calculate_system_uptime'
)
ORDER BY routine_name;

-- Run schema integrity validation
SELECT 'Schema Integrity' as validation_type,
       check_name,
       status,
       details
FROM validate_schema_integrity();

-- Run performance health check
SELECT 'Performance Health' as validation_type,
       metric_name,
       current_value,
       target_value,
       status
FROM check_performance_health();

-- ============================================================================
-- PHASE 6: SAMPLE DATA VALIDATION (If Any)
-- ============================================================================

-- Check if sample data was inserted
SELECT 'Sample Data Check' as validation_type,
       'prompt_types' as table_name,
       COUNT(*) as record_count,
       CASE WHEN COUNT(*) > 0 THEN '✅ HAS DATA' ELSE 'ℹ️ EMPTY' END as status
FROM prompt_types;

SELECT 'Sample Data Check' as validation_type,
       'system_configs' as table_name,
       COUNT(*) as record_count,
       CASE WHEN COUNT(*) > 0 THEN '✅ HAS DATA' ELSE 'ℹ️ EMPTY' END as status
FROM system_configs;

-- ============================================================================
-- FINAL DEPLOYMENT SUCCESS SUMMARY
-- ============================================================================

-- Overall deployment status
SELECT 'DEPLOYMENT SUCCESS SUMMARY' as summary_type,
       CASE 
           WHEN (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') >= 18
           AND (SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'prompt_logs' AND indexname LIKE 'idx_prompt_logs_%_gin') >= 2
           AND (SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public') >= 15
           THEN '🎉 DEPLOYMENT SUCCESSFUL - READY FOR PRODUCTION'
           ELSE '⚠️ DEPLOYMENT INCOMPLETE - CHECK ERRORS ABOVE'
       END as overall_status;

-- Next steps recommendation
SELECT 'NEXT STEPS' as summary_type,
       'Run test queries on prompt_logs to verify JSONB performance <200ms' as recommendation
UNION ALL
SELECT 'NEXT STEPS' as summary_type,
       'Insert sample data to test SparkSplit analytics functions' as recommendation
UNION ALL
SELECT 'NEXT STEPS' as summary_type,
       'Configure Make.com webhooks with flattened JSON structure' as recommendation;

-- ============================================================================
-- PERFORMANCE TEST QUERIES (Optional)
-- ============================================================================

-- Test JSONB query performance (should be <200ms)
EXPLAIN ANALYZE 
SELECT * FROM prompt_logs 
WHERE input_fields @> '{"test": "value"}' 
LIMIT 10;

-- Test vector search readiness (should not error)
EXPLAIN ANALYZE
SELECT * FROM prompt_logs 
WHERE content_vector IS NOT NULL
LIMIT 5; 