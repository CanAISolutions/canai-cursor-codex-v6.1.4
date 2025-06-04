-- Complete Supabase Schema for Master Implementation Plan v6.1.4
-- Aligned with live Airtable structure (Base ID: apph8yM7gVc9QBFtx)
-- 18 tables, 47 relationships (36 linked + 11 rollups)
-- Hub-and-spoke architecture with SessionAnalytics as central hub

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TIER 1: CORE ANALYTICS TABLES (Central Hub Architecture)
-- ============================================================================

-- SessionAnalytics - Central Hub (10 outbound relationships)
CREATE TABLE IF NOT EXISTS session_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255),
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration INTEGER, -- milliseconds
    prompt_count INTEGER DEFAULT 0,
    
    -- Product usage tracking
    products_used TEXT[],
    primary_product VARCHAR(255),
    
    -- Trust & emotional metrics
    trust_score_before DECIMAL(3,2),
    trust_score_after DECIMAL(3,2),
    trust_delta DECIMAL(3,2),
    emotional_depth DECIMAL(3,2),
    
    -- Session behavior
    override_count INTEGER DEFAULT 0,
    time_to_confirmation INTEGER,
    drop_off_signal BOOLEAN DEFAULT FALSE,
    cohort VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PromptLogs - Universal prompt tracking for all 11 product types
CREATE TABLE IF NOT EXISTS prompt_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    
    -- Product type support (all 11 CanAI products)
    prompt_type VARCHAR(255) NOT NULL CHECK (prompt_type IN (
        'ad_amplify',
        'blogblitz', 
        'profile_makeover',
        'business_plan',
        'email_campaign',
        'site_audit',
        'social_content',
        'reverse_strategy',
        'ai_blueprint',
        'ai_brand_identity',
        'spark_split'
    )),
    
    -- Flexible input storage (supports all 38 interfaces)
    input_fields JSONB NOT NULL,
    output JSONB,
    
    -- Core metrics
    tokens_used INTEGER,
    cost_usd DECIMAL(8,4),
    
    -- Quality metrics
    trust_score DECIMAL(3,2),
    resonance_score DECIMAL(3,2),
    smart_prompt_score DECIMAL(3,2),
    emotional_depth DECIMAL(3,2),
    
    -- 5-axis emotional compass
    awe_score DECIMAL(3,2),
    ownership_score DECIMAL(3,2),
    wonder_score DECIMAL(3,2),
    calm_score DECIMAL(3,2),
    power_score DECIMAL(3,2),
    
    -- Fallback tracking
    fallback_triggered BOOLEAN DEFAULT FALSE,
    fallback_fields TEXT[],
    
    -- System metadata
    analytics_meta JSONB,
    consent_given BOOLEAN DEFAULT TRUE,
    deletion_requested BOOLEAN DEFAULT FALSE,
    
    -- Vector search support
    content_vector vector(1536),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SparkSplitAnalytics - Revolutionary trust transparency engine
CREATE TABLE IF NOT EXISTS spark_split_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    timestamp BIGINT NOT NULL,
    prompt_type VARCHAR(255),
    comparison_id VARCHAR(255),
    trust_delta DECIMAL(3,2),
    user_selection VARCHAR(50), -- 'sterile' | 'canai' | 'both' | 'neither' | 'skip'
    time_to_selection INTEGER,
    
    -- 5-axis emotional compass
    awe_score DECIMAL(3,2),
    ownership_score DECIMAL(3,2),
    wonder_score DECIMAL(3,2),
    calm_score DECIMAL(3,2),
    power_score DECIMAL(3,2),
    
    -- Trust transparency metrics
    competitive_advantage DECIMAL(3,2),
    trust_transparency_score DECIMAL(3,2),
    emotional_education_score DECIMAL(3,2),
    would_refer BOOLEAN,
    shared_output BOOLEAN DEFAULT FALSE,
    circuit_breaker_triggered BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TIER 2: INTELLIGENCE & USER DATA TABLES
-- ============================================================================

-- UserContext - User intelligence hub (5 outbound relationships)
CREATE TABLE IF NOT EXISTS user_context (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    name VARCHAR(255),
    
    -- User preferences
    preferred_tone VARCHAR(100),
    industry_focus TEXT[],
    business_goals TEXT[],
    
    -- Emotional profile
    emotional_profile JSONB,
    spark_resonance JSONB,
    personalization_score DECIMAL(3,2),
    
    -- Predictive insights
    predictive_insights JSONB,
    lifetime_value DECIMAL(10,2),
    churn_risk DECIMAL(3,2),
    
    -- Usage statistics
    total_sessions INTEGER DEFAULT 0,
    total_prompts INTEGER DEFAULT 0,
    total_spend DECIMAL(10,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GoldmineOutput - Content intelligence and monetization
CREATE TABLE IF NOT EXISTS goldmine_output (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    prompt_type VARCHAR(255) NOT NULL,
    
    -- Content data
    output_content TEXT NOT NULL,
    output_hash VARCHAR(64) NOT NULL,
    
    -- Quality metrics
    resonance_score DECIMAL(3,2) NOT NULL,
    trust_score DECIMAL(3,2) NOT NULL,
    
    -- Emotional fingerprint
    emotional_fingerprint JSONB NOT NULL,
    
    -- Intelligence data
    industry_cluster VARCHAR(100),
    intent_summary TEXT NOT NULL,
    spark_concept TEXT,
    reuse_category VARCHAR(100),
    reuse_potential DECIMAL(3,2) NOT NULL,
    compound_value DECIMAL(10,2) NOT NULL,
    
    -- Vector search
    content_vector vector(1536),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EmotionalIntelligence - Emotional tracking and analysis
CREATE TABLE IF NOT EXISTS emotional_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    
    -- Emotional metrics
    emotional_state VARCHAR(100),
    emotional_intensity DECIMAL(3,2),
    emotional_stability DECIMAL(3,2),
    
    -- 5-axis compass
    awe_score DECIMAL(3,2),
    ownership_score DECIMAL(3,2),
    wonder_score DECIMAL(3,2),
    calm_score DECIMAL(3,2),
    power_score DECIMAL(3,2),
    
    -- Context
    trigger_event TEXT,
    emotional_context JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TrustMetrics - Trust measurement and tracking
CREATE TABLE IF NOT EXISTS trust_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    
    -- Trust scores
    trust_score DECIMAL(3,2) NOT NULL,
    trust_delta DECIMAL(3,2),
    trust_trend VARCHAR(50),
    
    -- Trust factors
    transparency_score DECIMAL(3,2),
    consistency_score DECIMAL(3,2),
    reliability_score DECIMAL(3,2),
    empathy_score DECIMAL(3,2),
    
    -- Context
    trust_event TEXT,
    trust_context JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TIER 3: SYSTEM INFRASTRUCTURE TABLES
-- ============================================================================

-- PerformanceMetrics - System performance tracking
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    
    -- Performance data
    response_time INTEGER, -- milliseconds
    processing_time INTEGER,
    queue_time INTEGER,
    
    -- Resource usage
    cpu_usage DECIMAL(5,2),
    memory_usage DECIMAL(5,2),
    api_calls INTEGER,
    
    -- Quality metrics
    success_rate DECIMAL(5,2),
    error_rate DECIMAL(5,2),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ErrorLogs - Error tracking and debugging
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255),
    
    -- Error details
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    error_code VARCHAR(50),
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Context
    stack_trace TEXT,
    user_agent TEXT,
    request_data JSONB,
    
    -- Resolution
    resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ProcessingResults - Processing pipeline results
CREATE TABLE IF NOT EXISTS processing_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    
    -- Processing data
    processing_stage VARCHAR(100) NOT NULL,
    processing_status VARCHAR(50) NOT NULL,
    processing_time INTEGER,
    
    -- Results
    input_data JSONB,
    output_data JSONB,
    processing_metadata JSONB,
    
    -- Quality
    success BOOLEAN DEFAULT TRUE,
    confidence_score DECIMAL(3,2),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WebhookLogs - Webhook delivery tracking
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255),
    
    -- Webhook details
    webhook_type VARCHAR(100) NOT NULL,
    endpoint VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL,
    
    -- Request/Response
    request_payload JSONB,
    response_payload JSONB,
    status_code INTEGER,
    
    -- Delivery
    delivery_status VARCHAR(50) NOT NULL,
    retry_count INTEGER DEFAULT 0,
    delivery_time INTEGER,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TIER 4: REFERENCE DATA TABLES
-- ============================================================================

-- PromptTypes - Prompt type definitions and analytics
CREATE TABLE IF NOT EXISTS prompt_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_type VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Configuration
    field_schema JSONB NOT NULL,
    validation_rules JSONB,
    default_settings JSONB,
    
    -- Analytics
    total_usage_count INTEGER DEFAULT 0,
    average_trust_score DECIMAL(3,2),
    average_cost_per_use DECIMAL(8,4),
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SystemConfigs - System configuration management
CREATE TABLE IF NOT EXISTS system_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    config_type VARCHAR(100) NOT NULL,
    
    -- Metadata
    description TEXT,
    environment VARCHAR(50) DEFAULT 'production',
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SystemHealth - System health monitoring
CREATE TABLE IF NOT EXISTS system_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    component_name VARCHAR(255) NOT NULL,
    
    -- Health status
    status VARCHAR(50) NOT NULL CHECK (status IN ('healthy', 'degraded', 'unhealthy', 'unknown')),
    health_score DECIMAL(3,2),
    
    -- Metrics
    uptime_percentage DECIMAL(5,2),
    response_time INTEGER,
    error_rate DECIMAL(5,2),
    
    -- Details
    health_details JSONB,
    last_check TIMESTAMPTZ DEFAULT NOW(),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AirtableSync - Airtable synchronization tracking
CREATE TABLE IF NOT EXISTS airtable_sync (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(255) NOT NULL,
    
    -- Sync details
    sync_type VARCHAR(50) NOT NULL, -- 'full', 'incremental', 'delta'
    sync_status VARCHAR(50) NOT NULL,
    records_synced INTEGER DEFAULT 0,
    
    -- Timing
    sync_start TIMESTAMPTZ,
    sync_end TIMESTAMPTZ,
    sync_duration INTEGER,
    
    -- Results
    sync_errors JSONB,
    sync_metadata JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AnalyticsAggregates - Pre-computed analytics
CREATE TABLE IF NOT EXISTS analytics_aggregates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_period VARCHAR(50) NOT NULL, -- 'hourly', 'daily', 'weekly', 'monthly'
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    
    -- Aggregated data
    aggregate_data JSONB NOT NULL,
    record_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EmotionalStates - Reference data for emotional states
CREATE TABLE IF NOT EXISTS emotional_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_name VARCHAR(100) UNIQUE NOT NULL,
    state_category VARCHAR(100) NOT NULL,
    
    -- Characteristics
    intensity_range JSONB,
    typical_triggers TEXT[],
    recommended_responses TEXT[],
    
    -- 5-axis mapping
    awe_influence DECIMAL(3,2),
    ownership_influence DECIMAL(3,2),
    wonder_influence DECIMAL(3,2),
    calm_influence DECIMAL(3,2),
    power_influence DECIMAL(3,2),
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TrustFactors - Reference data for trust factors
CREATE TABLE IF NOT EXISTS trust_factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factor_name VARCHAR(100) UNIQUE NOT NULL,
    factor_category VARCHAR(100) NOT NULL,
    
    -- Configuration
    weight DECIMAL(3,2) NOT NULL,
    calculation_method TEXT,
    
    -- Thresholds
    excellent_threshold DECIMAL(3,2),
    good_threshold DECIMAL(3,2),
    poor_threshold DECIMAL(3,2),
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FOREIGN KEY RELATIONSHIPS (Hub-and-Spoke Architecture)
-- ============================================================================

-- SessionAnalytics relationships (Central Hub - 10 outbound)
ALTER TABLE prompt_logs ADD CONSTRAINT fk_prompt_logs_session 
    FOREIGN KEY (session_id) REFERENCES session_analytics(session_id);

ALTER TABLE spark_split_analytics ADD CONSTRAINT fk_spark_split_session 
    FOREIGN KEY (session_id) REFERENCES session_analytics(session_id);

ALTER TABLE goldmine_output ADD CONSTRAINT fk_goldmine_session 
    FOREIGN KEY (session_id) REFERENCES session_analytics(session_id);

ALTER TABLE emotional_intelligence ADD CONSTRAINT fk_emotional_session 
    FOREIGN KEY (session_id) REFERENCES session_analytics(session_id);

ALTER TABLE trust_metrics ADD CONSTRAINT fk_trust_session 
    FOREIGN KEY (session_id) REFERENCES session_analytics(session_id);

ALTER TABLE performance_metrics ADD CONSTRAINT fk_performance_session 
    FOREIGN KEY (session_id) REFERENCES session_analytics(session_id);

ALTER TABLE webhook_logs ADD CONSTRAINT fk_webhook_session 
    FOREIGN KEY (session_id) REFERENCES session_analytics(session_id);

ALTER TABLE error_logs ADD CONSTRAINT fk_error_session 
    FOREIGN KEY (session_id) REFERENCES session_analytics(session_id);

ALTER TABLE processing_results ADD CONSTRAINT fk_processing_session 
    FOREIGN KEY (session_id) REFERENCES session_analytics(session_id);

-- UserContext relationships (Secondary Hub - 5 outbound)
ALTER TABLE session_analytics ADD CONSTRAINT fk_session_user 
    FOREIGN KEY (user_id) REFERENCES user_context(user_id);

ALTER TABLE prompt_logs ADD CONSTRAINT fk_prompt_user 
    FOREIGN KEY (user_id) REFERENCES user_context(user_id);

ALTER TABLE goldmine_output ADD CONSTRAINT fk_goldmine_user 
    FOREIGN KEY (user_id) REFERENCES user_context(user_id);

ALTER TABLE emotional_intelligence ADD CONSTRAINT fk_emotional_user 
    FOREIGN KEY (user_id) REFERENCES user_context(user_id);

ALTER TABLE trust_metrics ADD CONSTRAINT fk_trust_user 
    FOREIGN KEY (user_id) REFERENCES user_context(user_id);

-- PromptTypes relationships
ALTER TABLE prompt_logs ADD CONSTRAINT fk_prompt_type 
    FOREIGN KEY (prompt_type) REFERENCES prompt_types(prompt_type);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- SessionAnalytics indexes
CREATE INDEX IF NOT EXISTS idx_session_analytics_user_start ON session_analytics(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_session_analytics_trust_delta ON session_analytics(trust_delta);
CREATE INDEX IF NOT EXISTS idx_session_analytics_primary_product ON session_analytics(primary_product);
CREATE INDEX IF NOT EXISTS idx_session_analytics_status ON session_analytics(status);

-- PromptLogs indexes
CREATE INDEX IF NOT EXISTS idx_prompt_logs_session_timestamp ON prompt_logs(session_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_prompt_logs_user_timestamp ON prompt_logs(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_prompt_logs_type_timestamp ON prompt_logs(prompt_type, timestamp);
CREATE INDEX IF NOT EXISTS idx_prompt_logs_trust_score ON prompt_logs(trust_score);
CREATE INDEX IF NOT EXISTS idx_prompt_logs_resonance_score ON prompt_logs(resonance_score);

-- Vector search indexes
CREATE INDEX IF NOT EXISTS idx_prompt_logs_content_vector 
    ON prompt_logs USING ivfflat (content_vector vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_goldmine_content_vector 
    ON goldmine_output USING ivfflat (content_vector vector_cosine_ops) WITH (lists = 100);

-- SparkSplitAnalytics indexes
CREATE INDEX IF NOT EXISTS idx_spark_split_session_timestamp ON spark_split_analytics(session_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_spark_split_user_selection ON spark_split_analytics(user_selection);
CREATE INDEX IF NOT EXISTS idx_spark_split_trust_delta ON spark_split_analytics(trust_delta);

-- UserContext indexes
CREATE INDEX IF NOT EXISTS idx_user_context_email ON user_context(email);
CREATE INDEX IF NOT EXISTS idx_user_context_churn_risk ON user_context(churn_risk);
CREATE INDEX IF NOT EXISTS idx_user_context_lifetime_value ON user_context(lifetime_value);

-- GoldmineOutput indexes
CREATE INDEX IF NOT EXISTS idx_goldmine_hash ON goldmine_output(output_hash);
CREATE INDEX IF NOT EXISTS idx_goldmine_reuse_potential ON goldmine_output(reuse_potential);
CREATE INDEX IF NOT EXISTS idx_goldmine_industry_cluster ON goldmine_output(industry_cluster);

-- System monitoring indexes
CREATE INDEX IF NOT EXISTS idx_error_logs_severity_created ON error_logs(severity, created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status_created ON webhook_logs(delivery_status, created_at);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_response_time ON performance_metrics(response_time);

-- ============================================================================
-- ROLLUP FIELD FUNCTIONS (Matching Airtable Rollups)
-- ============================================================================

-- Function to calculate total prompts for session
CREATE OR REPLACE FUNCTION calculate_session_total_prompts(session_id_param VARCHAR(255))
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER 
        FROM prompt_logs 
        WHERE session_id = session_id_param
    );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate average trust score for session
CREATE OR REPLACE FUNCTION calculate_session_avg_trust_score(session_id_param VARCHAR(255))
RETURNS DECIMAL(3,2) AS $$
BEGIN
    RETURN (
        SELECT ROUND(AVG(trust_score), 2)
        FROM prompt_logs 
        WHERE session_id = session_id_param
    );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate total cost for session
CREATE OR REPLACE FUNCTION calculate_session_total_cost(session_id_param VARCHAR(255))
RETURNS DECIMAL(8,4) AS $$
BEGIN
    RETURN (
        SELECT COALESCE(SUM(cost_usd), 0)
        FROM prompt_logs 
        WHERE session_id = session_id_param
    );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user total sessions
CREATE OR REPLACE FUNCTION calculate_user_total_sessions(user_id_param VARCHAR(255))
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER 
        FROM session_analytics 
        WHERE user_id = user_id_param
    );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user average session duration
CREATE OR REPLACE FUNCTION calculate_user_avg_session_duration(user_id_param VARCHAR(255))
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT ROUND(AVG(duration))::INTEGER
        FROM session_analytics 
        WHERE user_id = user_id_param AND duration IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS FOR ROLLUP FIELD UPDATES
-- ============================================================================

-- Trigger function to update session rollups
CREATE OR REPLACE FUNCTION update_session_rollups()
RETURNS TRIGGER AS $$
BEGIN
    -- Update session analytics with rollup calculations
    UPDATE session_analytics 
    SET 
        prompt_count = calculate_session_total_prompts(NEW.session_id),
        updated_at = NOW()
    WHERE session_id = NEW.session_id;
    
    -- Update user context with rollup calculations
    UPDATE user_context 
    SET 
        total_sessions = calculate_user_total_sessions(NEW.user_id),
        total_prompts = (
            SELECT COUNT(*)::INTEGER 
            FROM prompt_logs 
            WHERE user_id = NEW.user_id
        ),
        total_spend = (
            SELECT COALESCE(SUM(cost_usd), 0)
            FROM prompt_logs 
            WHERE user_id = NEW.user_id
        ),
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_session_rollups
    AFTER INSERT OR UPDATE ON prompt_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_session_rollups();

-- ============================================================================
-- REFERENCE DATA POPULATION
-- ============================================================================

-- Insert all 11 product types
INSERT INTO prompt_types (prompt_type, display_name, description, field_schema, active) VALUES
('ad_amplify', 'Ad Amplify', 'Advertisement optimization and amplification', '{"fields": 16, "complexity": "medium"}', true),
('blogblitz', 'Blog Blitz', 'Rapid blog content creation', '{"fields": 13, "complexity": "simple"}', true),
('profile_makeover', 'Profile Makeover', 'Professional profile enhancement', '{"fields": 14, "complexity": "medium"}', true),
('business_plan', 'Business Plan', 'Comprehensive business planning', '{"fields": 31, "complexity": "complex", "nested": true}', true),
('email_campaign', 'Email Campaign', 'Email marketing campaigns', '{"fields": 6, "complexity": "simple"}', true),
('site_audit', 'Site Audit', 'Website analysis and optimization', '{"fields": 15, "complexity": "medium"}', true),
('social_content', 'Social Content', 'Social media content creation', '{"fields": 6, "complexity": "simple"}', true),
('reverse_strategy', 'Reverse Strategy', 'Competitive analysis and strategy', '{"fields": 6, "complexity": "medium"}', true),
('ai_blueprint', 'AI Blueprint', 'AI implementation planning', '{"fields": 6, "complexity": "medium"}', true),
('ai_brand_identity', 'AI Brand Identity', 'Brand identity development', '{"fields": 6, "complexity": "medium"}', true),
('spark_split', 'Spark Split', 'A/B testing and trust transparency', '{"fields": 28, "complexity": "complex", "nested": true}', true)
ON CONFLICT (prompt_type) DO NOTHING;

-- Insert emotional states
INSERT INTO emotional_states (state_name, state_category, awe_influence, ownership_influence, wonder_influence, calm_influence, power_influence) VALUES
('Excited', 'Positive', 0.8, 0.6, 0.9, 0.3, 0.7),
('Confident', 'Positive', 0.5, 0.9, 0.4, 0.7, 0.9),
('Curious', 'Neutral', 0.7, 0.5, 0.9, 0.6, 0.4),
('Anxious', 'Negative', 0.2, 0.3, 0.4, 0.1, 0.2),
('Frustrated', 'Negative', 0.1, 0.4, 0.2, 0.2, 0.3),
('Inspired', 'Positive', 0.9, 0.7, 0.8, 0.6, 0.8),
('Calm', 'Positive', 0.4, 0.6, 0.5, 0.9, 0.5),
('Overwhelmed', 'Negative', 0.2, 0.2, 0.3, 0.1, 0.1)
ON CONFLICT (state_name) DO NOTHING;

-- Insert trust factors
INSERT INTO trust_factors (factor_name, factor_category, weight, excellent_threshold, good_threshold, poor_threshold) VALUES
('Transparency', 'Core', 0.25, 0.9, 0.7, 0.4),
('Consistency', 'Core', 0.25, 0.9, 0.7, 0.4),
('Reliability', 'Core', 0.25, 0.9, 0.7, 0.4),
('Empathy', 'Core', 0.25, 0.9, 0.7, 0.4),
('Responsiveness', 'Secondary', 0.15, 0.8, 0.6, 0.3),
('Competence', 'Secondary', 0.20, 0.9, 0.7, 0.4),
('Authenticity', 'Secondary', 0.15, 0.8, 0.6, 0.3)
ON CONFLICT (factor_name) DO NOTHING;

-- Insert system configurations
INSERT INTO system_configs (config_key, config_value, config_type, description) VALUES
('sacred_metrics_targets', '{"spark_resonance": 97.0, "emotional_trust_score": 4.9, "trust_continuity": 99.0, "response_latency": 200, "system_uptime": 99.9}', 'metrics', 'Target values for sacred metrics'),
('interface_catalog_version', '{"version": "v1.1", "total_interfaces": 38}', 'system', 'Interface catalog version information'),
('airtable_base_config', '{"base_id": "apph8yM7gVc9QBFtx", "total_tables": 18, "total_relationships": 47}', 'integration', 'Live Airtable base configuration'),
('emotional_compass_weights', '{"awe": 0.2, "ownership": 0.2, "wonder": 0.2, "calm": 0.2, "power": 0.2}', 'emotional', '5-axis emotional compass weights')
ON CONFLICT (config_key) DO NOTHING;

-- ============================================================================
-- VIEWS FOR DASHBOARD AND ANALYTICS
-- ============================================================================

-- Sacred metrics dashboard view
CREATE OR REPLACE VIEW sacred_metrics_dashboard AS
SELECT 
    'Spark Resonance' AS metric_name,
    ROUND(AVG(resonance_score) * 100, 2) AS current_value,
    97.0 AS target_value,
    'percentage' AS unit,
    CASE WHEN AVG(resonance_score) * 100 >= 97.0 THEN 'Achieved' ELSE 'In Progress' END AS status
FROM prompt_logs 
WHERE created_at >= NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
    'Emotional Trust Score' AS metric_name,
    ROUND(AVG((awe_score + ownership_score + wonder_score + calm_score + power_score) / 5 * 5), 2) AS current_value,
    4.9 AS target_value,
    'score' AS unit,
    CASE WHEN AVG((awe_score + ownership_score + wonder_score + calm_score + power_score) / 5 * 5) >= 4.9 THEN 'Achieved' ELSE 'In Progress' END AS status
FROM prompt_logs 
WHERE created_at >= NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
    'Trust Continuity' AS metric_name,
    ROUND(AVG(CASE WHEN trust_delta >= 0 THEN 1.0 ELSE 0.0 END) * 100, 2) AS current_value,
    99.0 AS target_value,
    'percentage' AS unit,
    CASE WHEN AVG(CASE WHEN trust_delta >= 0 THEN 1.0 ELSE 0.0 END) * 100 >= 99.0 THEN 'Achieved' ELSE 'In Progress' END AS status
FROM session_analytics 
WHERE created_at >= NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
    'Response Latency' AS metric_name,
    ROUND(AVG(response_time), 0) AS current_value,
    200.0 AS target_value,
    'milliseconds' AS unit,
    CASE WHEN AVG(response_time) <= 200 THEN 'Achieved' ELSE 'In Progress' END AS status
FROM performance_metrics 
WHERE created_at >= NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
    'System Uptime' AS metric_name,
    ROUND(AVG(uptime_percentage), 2) AS current_value,
    99.9 AS target_value,
    'percentage' AS unit,
    CASE WHEN AVG(uptime_percentage) >= 99.9 THEN 'Achieved' ELSE 'In Progress' END AS status
FROM system_health 
WHERE created_at >= NOW() - INTERVAL '24 hours';

-- Interface usage analytics view
CREATE OR REPLACE VIEW interface_usage_analytics AS
SELECT 
    pt.prompt_type,
    pt.display_name,
    COUNT(pl.id) AS total_usage,
    ROUND(AVG(pl.trust_score), 2) AS avg_trust_score,
    ROUND(AVG(pl.resonance_score), 2) AS avg_resonance_score,
    ROUND(SUM(pl.cost_usd), 4) AS total_cost,
    ROUND(AVG(pl.cost_usd), 4) AS avg_cost_per_use
FROM prompt_types pt
LEFT JOIN prompt_logs pl ON pt.prompt_type = pl.prompt_type
WHERE pl.created_at >= NOW() - INTERVAL '30 days' OR pl.created_at IS NULL
GROUP BY pt.prompt_type, pt.display_name
ORDER BY total_usage DESC;

-- User intelligence summary view
CREATE OR REPLACE VIEW user_intelligence_summary AS
SELECT 
    uc.user_id,
    uc.email,
    uc.total_sessions,
    uc.total_prompts,
    uc.total_spend,
    uc.lifetime_value,
    uc.churn_risk,
    ROUND(AVG(sa.trust_score_after), 2) AS avg_trust_score,
    ROUND(AVG(sa.emotional_depth), 2) AS avg_emotional_depth,
    COUNT(DISTINCT sa.primary_product) AS products_used
FROM user_context uc
LEFT JOIN session_analytics sa ON uc.user_id = sa.user_id
GROUP BY uc.user_id, uc.email, uc.total_sessions, uc.total_prompts, uc.total_spend, uc.lifetime_value, uc.churn_risk
ORDER BY uc.lifetime_value DESC;

-- ============================================================================
-- HEALTH CHECK AND VALIDATION FUNCTIONS
-- ============================================================================

-- Function to validate schema integrity
CREATE OR REPLACE FUNCTION validate_schema_integrity()
RETURNS TABLE (
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Check table count
    RETURN QUERY
    SELECT 
        'Table Count' as check_name,
        CASE WHEN COUNT(*) = 18 THEN 'PASS' ELSE 'FAIL' END as status,
        'Expected: 18, Found: ' || COUNT(*)::TEXT as details
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name NOT LIKE 'build_progress%'
    AND table_name NOT LIKE 'sacred_metrics%';
    
    -- Check foreign key relationships
    RETURN QUERY
    SELECT 
        'Foreign Key Relationships' as check_name,
        CASE WHEN COUNT(*) >= 15 THEN 'PASS' ELSE 'FAIL' END as status,
        'Found: ' || COUNT(*)::TEXT || ' foreign key constraints' as details
    FROM information_schema.table_constraints 
    WHERE constraint_type = 'FOREIGN KEY'
    AND table_schema = 'public';
    
    -- Check vector extension
    RETURN QUERY
    SELECT 
        'Vector Extension' as check_name,
        CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END as status,
        'Vector extension status' as details
    FROM pg_extension 
    WHERE extname = 'vector';
END;
$$ LANGUAGE plpgsql;

-- Function to get schema statistics
CREATE OR REPLACE FUNCTION get_schema_statistics()
RETURNS TABLE (
    table_name TEXT,
    row_count BIGINT,
    size_pretty TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname||'.'||tablename as table_name,
        n_tup_ins - n_tup_del as row_count,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size_pretty
    FROM pg_stat_user_tables 
    WHERE schemaname = 'public'
    ORDER BY n_tup_ins - n_tup_del DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- EXAMPLE USAGE AND TESTING
-- ============================================================================

/*
-- Validate schema integrity
SELECT * FROM validate_schema_integrity();

-- Get schema statistics
SELECT * FROM get_schema_statistics();

-- View sacred metrics dashboard
SELECT * FROM sacred_metrics_dashboard;

-- View interface usage analytics
SELECT * FROM interface_usage_analytics;

-- View user intelligence summary
SELECT * FROM user_intelligence_summary LIMIT 10;

-- Test vector search functionality
SELECT '[1,2,3]'::vector <-> '[4,5,6]'::vector as distance_test;

-- Test rollup calculations
SELECT calculate_session_total_prompts('test_session_123');
SELECT calculate_session_avg_trust_score('test_session_123');
SELECT calculate_session_total_cost('test_session_123');
*/ 