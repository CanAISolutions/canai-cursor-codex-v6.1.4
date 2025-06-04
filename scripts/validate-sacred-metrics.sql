-- ============================================================================
-- SACRED METRICS VALIDATION SCRIPT
-- Validates all 5 Sacred Metrics from Emotional Sovereignty Manifesto
-- Framework: Codex v6.1.4 - Truth-Verified Implementation
-- Purpose: Post-deployment validation with pass/fail logic and real-time alerts
-- ============================================================================

-- Sacred Metrics Targets:
-- 1. 97% Spark Resonance Rate
-- 2. 4.9/5.0 Emotional Trust Score  
-- 3. 99.9% System Uptime
-- 4. 90% Educational Impact Rate
-- 5. 85% CanAI Selection Rate (SparkSplit)

-- ============================================================================
-- SACRED METRICS VALIDATION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_sacred_metrics(
    time_window_hours INTEGER DEFAULT 24,
    alert_threshold_failures INTEGER DEFAULT 1
)
RETURNS TABLE(
    metric_name TEXT,
    current_value NUMERIC,
    target_value NUMERIC,
    status TEXT,
    pass_fail BOOLEAN,
    alert_triggered BOOLEAN,
    recommendation TEXT,
    sample_size INTEGER,
    confidence_level NUMERIC,
    last_updated TIMESTAMPTZ
) AS $$
DECLARE
    window_start TIMESTAMPTZ;
    total_failures INTEGER := 0;
BEGIN
    window_start := NOW() - INTERVAL '1 hour' * time_window_hours;
    
    RETURN QUERY
    WITH metric_calculations AS (
        -- 1. SPARK RESONANCE RATE (Target: 97%)
        SELECT 
            'Spark Resonance Rate'::TEXT as metric_name,
            COALESCE(
                (COUNT(CASE WHEN resonance_score >= 0.97 THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)),
                0
            ) as current_value,
            97.0 as target_value,
            COUNT(*) as sample_size,
            CASE 
                WHEN COUNT(*) >= 30 THEN 95.0  -- High confidence with 30+ samples
                WHEN COUNT(*) >= 10 THEN 85.0  -- Medium confidence with 10+ samples
                ELSE 70.0                      -- Low confidence with <10 samples
            END as confidence_level
        FROM prompt_logs 
        WHERE created_at >= window_start
        AND resonance_score IS NOT NULL
        
        UNION ALL
        
        -- 2. EMOTIONAL TRUST SCORE (Target: 4.9/5.0 = 98%)
        SELECT 
            'Emotional Trust Score'::TEXT as metric_name,
            COALESCE(
                (AVG((awe_score + ownership_score + wonder_score + calm_score + power_score) / 5) * 100),
                0
            ) as current_value,
            98.0 as target_value,
            COUNT(*) as sample_size,
            CASE 
                WHEN COUNT(*) >= 50 THEN 95.0
                WHEN COUNT(*) >= 20 THEN 85.0
                ELSE 70.0
            END as confidence_level
        FROM prompt_logs 
        WHERE created_at >= window_start
        AND awe_score IS NOT NULL 
        AND ownership_score IS NOT NULL
        AND wonder_score IS NOT NULL
        AND calm_score IS NOT NULL
        AND power_score IS NOT NULL
        
        UNION ALL
        
        -- 3. SYSTEM UPTIME (Target: 99.9%)
        SELECT 
            'System Uptime'::TEXT as metric_name,
            COALESCE(
                (COUNT(CASE WHEN health_status = 'healthy' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)),
                0
            ) as current_value,
            99.9 as target_value,
            COUNT(*) as sample_size,
            CASE 
                WHEN COUNT(*) >= 100 THEN 99.0  -- Very high confidence for uptime
                WHEN COUNT(*) >= 50 THEN 95.0
                ELSE 80.0
            END as confidence_level
        FROM system_health 
        WHERE last_check >= window_start
        
        UNION ALL
        
        -- 4. EDUCATIONAL IMPACT RATE (Target: 90%)
        SELECT 
            'Educational Impact Rate'::TEXT as metric_name,
            COALESCE(
                (COUNT(CASE WHEN educational_moment = true THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)),
                0
            ) as current_value,
            90.0 as target_value,
            COUNT(*) as sample_size,
            CASE 
                WHEN COUNT(*) >= 25 THEN 90.0
                WHEN COUNT(*) >= 10 THEN 80.0
                ELSE 65.0
            END as confidence_level
        FROM spark_split_analytics 
        WHERE created_at >= window_start
        
        UNION ALL
        
        -- 5. CANAI SELECTION RATE (Target: 85%)
        SELECT 
            'CanAI Selection Rate'::TEXT as metric_name,
            COALESCE(
                (COUNT(CASE WHEN user_selection = 'canai' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)),
                0
            ) as current_value,
            85.0 as target_value,
            COUNT(*) as sample_size,
            CASE 
                WHEN COUNT(*) >= 30 THEN 92.0
                WHEN COUNT(*) >= 15 THEN 85.0
                ELSE 70.0
            END as confidence_level
        FROM spark_split_analytics 
        WHERE created_at >= window_start
        AND user_selection IN ('canai', 'sterile', 'both', 'neither')
    )
    SELECT 
        mc.metric_name,
        ROUND(mc.current_value, 2) as current_value,
        mc.target_value,
        CASE 
            WHEN mc.current_value >= mc.target_value THEN '✅ PASS'
            WHEN mc.current_value >= (mc.target_value * 0.95) THEN '⚠️ WARNING'
            ELSE '❌ FAIL'
        END as status,
        (mc.current_value >= mc.target_value) as pass_fail,
        (mc.current_value < (mc.target_value * 0.90)) as alert_triggered,
        CASE 
            WHEN mc.metric_name = 'Spark Resonance Rate' AND mc.current_value < mc.target_value THEN
                'Improve emotional intelligence in prompt generation. Review low-scoring outputs.'
            WHEN mc.metric_name = 'Emotional Trust Score' AND mc.current_value < mc.target_value THEN
                'Enhance 5-axis emotional compass calibration. Focus on user empowerment.'
            WHEN mc.metric_name = 'System Uptime' AND mc.current_value < mc.target_value THEN
                'Investigate system health issues. Check infrastructure monitoring.'
            WHEN mc.metric_name = 'Educational Impact Rate' AND mc.current_value < mc.target_value THEN
                'Improve SparkSplit comparison clarity. Enhance educational messaging.'
            WHEN mc.metric_name = 'CanAI Selection Rate' AND mc.current_value < mc.target_value THEN
                'Review SparkSplit output quality. Ensure CanAI advantage is clear.'
            ELSE 'Metric performing within target range. Continue monitoring.'
        END as recommendation,
        mc.sample_size::INTEGER,
        ROUND(mc.confidence_level, 1) as confidence_level,
        NOW() as last_updated
    FROM metric_calculations mc
    ORDER BY 
        CASE mc.metric_name
            WHEN 'Spark Resonance Rate' THEN 1
            WHEN 'Emotional Trust Score' THEN 2
            WHEN 'System Uptime' THEN 3
            WHEN 'Educational Impact Rate' THEN 4
            WHEN 'CanAI Selection Rate' THEN 5
        END;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- REAL-TIME ALERT SYSTEM
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_sacred_metrics_alerts()
RETURNS TABLE(
    alert_level TEXT,
    metric_name TEXT,
    current_value NUMERIC,
    target_value NUMERIC,
    severity TEXT,
    action_required TEXT,
    alert_timestamp TIMESTAMPTZ
) AS $$
DECLARE
    metric_record RECORD;
    critical_failures INTEGER := 0;
    warning_failures INTEGER := 0;
BEGIN
    -- Check all sacred metrics
    FOR metric_record IN 
        SELECT * FROM validate_sacred_metrics(24, 1)
    LOOP
        -- Count failures for overall system health
        IF NOT metric_record.pass_fail THEN
            IF metric_record.current_value < (metric_record.target_value * 0.90) THEN
                critical_failures := critical_failures + 1;
            ELSE
                warning_failures := warning_failures + 1;
            END IF;
        END IF;
        
        -- Generate alerts for failing metrics
        IF metric_record.alert_triggered THEN
            RETURN QUERY
            SELECT 
                'CRITICAL'::TEXT as alert_level,
                metric_record.metric_name,
                metric_record.current_value,
                metric_record.target_value,
                CASE 
                    WHEN metric_record.current_value < (metric_record.target_value * 0.80) THEN 'SEVERE'
                    WHEN metric_record.current_value < (metric_record.target_value * 0.90) THEN 'HIGH'
                    ELSE 'MEDIUM'
                END as severity,
                CASE 
                    WHEN metric_record.metric_name = 'System Uptime' THEN 'IMMEDIATE: Check infrastructure and restart failed services'
                    WHEN metric_record.metric_name = 'Spark Resonance Rate' THEN 'URGENT: Review and improve emotional intelligence algorithms'
                    WHEN metric_record.metric_name = 'Emotional Trust Score' THEN 'HIGH: Recalibrate emotional compass and trust scoring'
                    WHEN metric_record.metric_name = 'Educational Impact Rate' THEN 'MEDIUM: Enhance SparkSplit educational messaging'
                    WHEN metric_record.metric_name = 'CanAI Selection Rate' THEN 'HIGH: Investigate SparkSplit output quality issues'
                    ELSE 'REVIEW: Investigate metric calculation and data quality'
                END as action_required,
                NOW() as alert_timestamp;
        ELSIF NOT metric_record.pass_fail THEN
            RETURN QUERY
            SELECT 
                'WARNING'::TEXT as alert_level,
                metric_record.metric_name,
                metric_record.current_value,
                metric_record.target_value,
                'LOW'::TEXT as severity,
                ('MONITOR: ' || metric_record.recommendation) as action_required,
                NOW() as alert_timestamp;
        END IF;
    END LOOP;
    
    -- System-wide alert if multiple metrics failing
    IF critical_failures >= 2 THEN
        RETURN QUERY
        SELECT 
            'SYSTEM_CRITICAL'::TEXT as alert_level,
            'Multiple Sacred Metrics'::TEXT as metric_name,
            critical_failures::NUMERIC as current_value,
            0::NUMERIC as target_value,
            'CRITICAL'::TEXT as severity,
            'EMERGENCY: Multiple sacred metrics failing. Initiate incident response protocol.' as action_required,
            NOW() as alert_timestamp;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SACRED METRICS DASHBOARD QUERY
-- ============================================================================

CREATE OR REPLACE VIEW sacred_metrics_dashboard AS
SELECT 
    vm.metric_name,
    vm.current_value,
    vm.target_value,
    vm.status,
    vm.pass_fail,
    vm.recommendation,
    vm.sample_size,
    vm.confidence_level,
    vm.last_updated,
    -- Performance indicators
    CASE 
        WHEN vm.current_value >= vm.target_value THEN '🟢'
        WHEN vm.current_value >= (vm.target_value * 0.95) THEN '🟡'
        ELSE '🔴'
    END as indicator,
    -- Trend analysis (compare to previous 24h)
    CASE 
        WHEN vm.metric_name = 'Spark Resonance Rate' THEN
            (SELECT COALESCE(AVG(resonance_score) * 100, 0) 
             FROM prompt_logs 
             WHERE created_at BETWEEN NOW() - INTERVAL '48 hours' AND NOW() - INTERVAL '24 hours')
        WHEN vm.metric_name = 'Emotional Trust Score' THEN
            (SELECT COALESCE(AVG((awe_score + ownership_score + wonder_score + calm_score + power_score) / 5) * 100, 0)
             FROM prompt_logs 
             WHERE created_at BETWEEN NOW() - INTERVAL '48 hours' AND NOW() - INTERVAL '24 hours'
             AND awe_score IS NOT NULL)
        ELSE NULL
    END as previous_24h_value,
    -- Data quality indicators
    CASE 
        WHEN vm.sample_size >= 50 THEN 'High'
        WHEN vm.sample_size >= 20 THEN 'Medium'
        WHEN vm.sample_size >= 10 THEN 'Low'
        ELSE 'Insufficient'
    END as data_quality
FROM validate_sacred_metrics(24, 1) vm;

-- ============================================================================
-- AUTOMATED MONITORING SETUP
-- ============================================================================

-- Create table to log sacred metrics history
CREATE TABLE IF NOT EXISTS sacred_metrics_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    current_value NUMERIC NOT NULL,
    target_value NUMERIC NOT NULL,
    status TEXT NOT NULL,
    pass_fail BOOLEAN NOT NULL,
    sample_size INTEGER NOT NULL,
    confidence_level NUMERIC NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to log metrics automatically
CREATE OR REPLACE FUNCTION log_sacred_metrics()
RETURNS INTEGER AS $$
DECLARE
    records_inserted INTEGER := 0;
BEGIN
    INSERT INTO sacred_metrics_history (
        metric_name, current_value, target_value, status, 
        pass_fail, sample_size, confidence_level
    )
    SELECT 
        metric_name, current_value, target_value, status,
        pass_fail, sample_size, confidence_level
    FROM validate_sacred_metrics(24, 1);
    
    GET DIAGNOSTICS records_inserted = ROW_COUNT;
    RETURN records_inserted;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMPREHENSIVE VALIDATION EXECUTION
-- ============================================================================

-- Execute sacred metrics validation
SELECT 
    '🎯 SACRED METRICS VALIDATION REPORT' as report_title,
    NOW() as generated_at;

-- Main validation results
SELECT * FROM validate_sacred_metrics(24, 1);

-- Alert status
SELECT 
    '🚨 ACTIVE ALERTS' as alert_section,
    COUNT(*) as total_alerts,
    COUNT(CASE WHEN alert_level = 'CRITICAL' THEN 1 END) as critical_alerts,
    COUNT(CASE WHEN alert_level = 'WARNING' THEN 1 END) as warning_alerts
FROM trigger_sacred_metrics_alerts();

-- Detailed alerts
SELECT * FROM trigger_sacred_metrics_alerts();

-- Dashboard summary
SELECT 
    '📊 DASHBOARD SUMMARY' as dashboard_section,
    COUNT(*) as total_metrics,
    COUNT(CASE WHEN pass_fail = true THEN 1 END) as passing_metrics,
    COUNT(CASE WHEN pass_fail = false THEN 1 END) as failing_metrics,
    ROUND(AVG(confidence_level), 1) as avg_confidence_level
FROM sacred_metrics_dashboard;

-- Sample size validation
SELECT 
    '📈 DATA QUALITY ASSESSMENT' as quality_section,
    metric_name,
    sample_size,
    data_quality,
    CASE 
        WHEN sample_size < 10 THEN 'Increase data collection'
        WHEN sample_size < 30 THEN 'Adequate for monitoring'
        ELSE 'Excellent statistical power'
    END as recommendation
FROM sacred_metrics_dashboard
ORDER BY sample_size DESC;

-- Historical trend (if data exists)
SELECT 
    '📈 HISTORICAL TRENDS (Last 7 Days)' as trend_section,
    metric_name,
    COUNT(*) as measurement_count,
    ROUND(AVG(current_value), 2) as avg_value,
    ROUND(MIN(current_value), 2) as min_value,
    ROUND(MAX(current_value), 2) as max_value,
    ROUND(STDDEV(current_value), 2) as volatility
FROM sacred_metrics_history 
WHERE recorded_at >= NOW() - INTERVAL '7 days'
GROUP BY metric_name
ORDER BY metric_name;

-- Log current metrics
SELECT 
    '💾 LOGGING CURRENT METRICS' as logging_section,
    log_sacred_metrics() as records_logged,
    'Metrics logged to sacred_metrics_history table' as status;

-- Final validation summary
SELECT 
    '✅ VALIDATION COMPLETE' as final_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM trigger_sacred_metrics_alerts() WHERE alert_level = 'CRITICAL') = 0 
        THEN 'All sacred metrics within acceptable ranges'
        ELSE 'ATTENTION REQUIRED: Critical alerts detected'
    END as overall_health,
    NOW() as completion_time;

-- ============================================================================
-- PERFORMANCE OPTIMIZATION RECOMMENDATIONS
-- ============================================================================

-- Query performance analysis
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM validate_sacred_metrics(24, 1);

-- Index recommendations for sacred metrics queries
SELECT 
    '🔧 INDEX OPTIMIZATION RECOMMENDATIONS' as optimization_section,
    'CREATE INDEX IF NOT EXISTS idx_prompt_logs_resonance_created ON prompt_logs(resonance_score, created_at);' as recommendation_1,
    'CREATE INDEX IF NOT EXISTS idx_prompt_logs_emotional_scores ON prompt_logs(awe_score, ownership_score, wonder_score, calm_score, power_score);' as recommendation_2,
    'CREATE INDEX IF NOT EXISTS idx_spark_split_educational ON spark_split_analytics(educational_moment, created_at);' as recommendation_3,
    'CREATE INDEX IF NOT EXISTS idx_spark_split_user_selection ON spark_split_analytics(user_selection, created_at);' as recommendation_4,
    'CREATE INDEX IF NOT EXISTS idx_system_health_status_check ON system_health(health_status, last_check);' as recommendation_5; 