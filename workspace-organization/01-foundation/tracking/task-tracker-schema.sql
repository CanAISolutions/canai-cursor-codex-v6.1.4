-- Enhanced Task Tracker for 13-Day CanAI Implementation Plan V6.1.4
-- Comprehensive tracking system for solo developer execution
-- Supports Cursor prompting, context preservation, and automated validation

-- Main task tracker table
CREATE TABLE IF NOT EXISTS task_tracker_13day (
    -- Core identification
    task_id VARCHAR(20) PRIMARY KEY, -- Format: D01_T01, D02_T03, etc.
    day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 13),
    task_sequence INTEGER NOT NULL,
    
    -- Task definition
    task_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'infrastructure', 'bert_optimization', 'webhook_tuning', 
        'integration', 'validation', 'monitoring', 'rollback_testing',
        'circuit_breaker', 'json_edge_cases', 'trust_remediation'
    )),
    
    -- Timing and effort
    estimated_hours DECIMAL(3,1) NOT NULL CHECK (estimated_hours <= 6.0), -- Solo 4-6h/day limit
    actual_hours DECIMAL(3,1),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    
    -- Dependencies and relationships
    dependencies TEXT[], -- Array of task_ids
    blocks_tasks TEXT[], -- Tasks that depend on this one
    parallel_tasks TEXT[], -- Tasks that can run in parallel
    
    -- Status tracking
    status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN (
        'not_started', 'in_progress', 'completed', 'blocked', 'failed', 'skipped'
    )),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Metrics and validation
    target_metrics JSONB, -- e.g., {"latency_p99": 420, "accuracy": 0.93}
    actual_metrics JSONB, -- Measured results
    validation_criteria TEXT[] NOT NULL,
    validation_query TEXT,
    validation_passed BOOLEAN,
    
    -- Solo developer context
    owner VARCHAR(50) DEFAULT 'solo_developer',
    energy_level VARCHAR(20) CHECK (energy_level IN ('high', 'medium', 'low')), -- Track daily energy
    complexity_rating INTEGER CHECK (complexity_rating >= 1 AND complexity_rating <= 5),
    
    -- Cursor interaction tracking
    cursor_prompt TEXT NOT NULL,
    cursor_response_summary TEXT,
    cursor_interaction_count INTEGER DEFAULT 0,
    last_cursor_interaction TIMESTAMPTZ,
    
    -- Notes and context preservation
    implementation_notes TEXT,
    blockers_encountered TEXT[],
    lessons_learned TEXT,
    fallback_plan TEXT,
    
    -- Checkpoints (Days 6, 9, 12)
    is_checkpoint_task BOOLEAN DEFAULT FALSE,
    checkpoint_validation JSONB,
    
    -- Emotional sovereignty tracking
    emotional_impact_score INTEGER CHECK (emotional_impact_score >= 1 AND emotional_impact_score <= 5),
    trust_score_delta DECIMAL(3,2), -- Impact on trust score
    user_empowerment_indicator TEXT,
    sacred_reversal_test_passed BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes for solo developer queries
CREATE INDEX idx_task_tracker_day_sequence ON task_tracker_13day(day_number, task_sequence);
CREATE INDEX idx_task_tracker_status ON task_tracker_13day(status);
CREATE INDEX idx_task_tracker_dependencies ON task_tracker_13day USING GIN(dependencies);
CREATE INDEX idx_task_tracker_category ON task_tracker_13day(category);
CREATE INDEX idx_task_tracker_checkpoint ON task_tracker_13day(is_checkpoint_task) WHERE is_checkpoint_task = TRUE;
CREATE INDEX idx_task_tracker_updated ON task_tracker_13day(updated_at);
CREATE INDEX idx_task_tracker_sacred_reversal ON task_tracker_13day(sacred_reversal_test_passed);

-- Cursor interaction logging table
CREATE TABLE IF NOT EXISTS cursor_interactions_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id VARCHAR(20) REFERENCES task_tracker_13day(task_id),
    interaction_type VARCHAR(50) NOT NULL, -- 'prompt', 'response', 'validation', 'troubleshooting'
    prompt_text TEXT,
    response_text TEXT,
    success BOOLEAN,
    error_message TEXT,
    context_data JSONB,
    emotional_impact_assessment TEXT,
    trust_transparency_notes TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Metrics tracking table for real-time updates
CREATE TABLE IF NOT EXISTS task_metrics_realtime (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id VARCHAR(20) REFERENCES task_tracker_13day(task_id),
    metric_name VARCHAR(100) NOT NULL,
    target_value DECIMAL(10,4),
    current_value DECIMAL(10,4),
    unit VARCHAR(20), -- 'ms', '%', 'count', etc.
    measurement_time TIMESTAMPTZ DEFAULT NOW(),
    source VARCHAR(50), -- 'k6', 'supabase', 'lambda', 'manual'
    meets_target BOOLEAN GENERATED ALWAYS AS (
        CASE 
            WHEN metric_name LIKE '%latency%' THEN current_value <= target_value
            WHEN metric_name LIKE '%accuracy%' THEN current_value >= target_value
            WHEN metric_name LIKE '%false_positive%' THEN current_value <= target_value
            WHEN metric_name LIKE '%error_rate%' THEN current_value <= target_value
            WHEN metric_name LIKE '%recovery_time%' THEN current_value <= target_value
            ELSE current_value >= target_value
        END
    ) STORED,
    emotional_sovereignty_impact TEXT,
    trust_score_impact DECIMAL(3,2)
);

-- Task state backup table for context preservation
CREATE TABLE IF NOT EXISTS task_state_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_data JSONB NOT NULL,
    backup_type VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'manual', 'checkpoint'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily summary view for solo developer dashboard
CREATE OR REPLACE VIEW daily_progress_summary AS
SELECT 
    day_number,
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
    COUNT(CASE WHEN status = 'blocked' THEN 1 END) as blocked_tasks,
    SUM(estimated_hours) as estimated_hours_total,
    SUM(actual_hours) as actual_hours_total,
    ROUND(AVG(progress_percentage), 1) as avg_progress,
    COUNT(CASE WHEN validation_passed = TRUE THEN 1 END) as validated_tasks,
    COUNT(CASE WHEN sacred_reversal_test_passed = TRUE THEN 1 END) as sacred_reversal_passed,
    AVG(emotional_impact_score) as avg_emotional_impact,
    AVG(trust_score_delta) as avg_trust_delta
FROM task_tracker_13day
GROUP BY day_number
ORDER BY day_number;

-- Checkpoint validation view
CREATE OR REPLACE VIEW checkpoint_validation_summary AS
SELECT 
    day_number,
    task_name,
    checkpoint_validation,
    validation_passed,
    sacred_reversal_test_passed,
    emotional_impact_score,
    trust_score_delta,
    actual_metrics,
    implementation_notes
FROM task_tracker_13day
WHERE is_checkpoint_task = TRUE
ORDER BY day_number;

-- Context preservation functions
CREATE OR REPLACE FUNCTION log_cursor_interaction(
    task_id_param VARCHAR(20),
    interaction_type_param VARCHAR(50),
    prompt_text TEXT,
    response_text TEXT DEFAULT NULL,
    success_param BOOLEAN DEFAULT TRUE,
    context_data JSONB DEFAULT '{}'::JSONB,
    emotional_impact TEXT DEFAULT NULL,
    trust_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    interaction_id UUID;
BEGIN
    INSERT INTO cursor_interactions_log (
        task_id, interaction_type, prompt_text, response_text, 
        success, context_data, emotional_impact_assessment, 
        trust_transparency_notes, timestamp
    ) VALUES (
        task_id_param, interaction_type_param, prompt_text, response_text, 
        success_param, context_data, emotional_impact, trust_notes, NOW()
    ) RETURNING id INTO interaction_id;
    
    -- Update task interaction count
    UPDATE task_tracker_13day 
    SET 
        cursor_interaction_count = cursor_interaction_count + 1,
        last_cursor_interaction = NOW(),
        cursor_response_summary = CASE 
            WHEN response_text IS NOT NULL THEN LEFT(response_text, 500) 
            ELSE cursor_response_summary 
        END,
        updated_at = NOW()
    WHERE task_id = task_id_param;
    
    RETURN interaction_id;
END;
$$ LANGUAGE plpgsql;

-- Task state backup function
CREATE OR REPLACE FUNCTION backup_task_state(backup_type_param VARCHAR(50) DEFAULT 'scheduled')
RETURNS TABLE(backup_id UUID, backup_data JSONB) AS $$
DECLARE
    backup_uuid UUID := gen_random_uuid();
    complete_state JSONB;
BEGIN
    -- Create complete state snapshot
    SELECT jsonb_build_object(
        'timestamp', NOW(),
        'backup_type', backup_type_param,
        'tasks', (
            SELECT jsonb_agg(to_jsonb(t.*))
            FROM task_tracker_13day t
        ),
        'metrics', (
            SELECT jsonb_agg(to_jsonb(m.*))
            FROM task_metrics_realtime m
            WHERE m.measurement_time >= NOW() - INTERVAL '24 hours'
        ),
        'interactions', (
            SELECT jsonb_agg(to_jsonb(i.*))
            FROM cursor_interactions_log i
            WHERE i.timestamp >= NOW() - INTERVAL '24 hours'
        ),
        'daily_summary', (
            SELECT jsonb_agg(to_jsonb(d.*))
            FROM daily_progress_summary d
        )
    ) INTO complete_state;
    
    -- Store backup
    INSERT INTO task_state_backups (id, backup_data, backup_type, created_at)
    VALUES (backup_uuid, complete_state, backup_type_param, NOW());
    
    RETURN QUERY SELECT backup_uuid, complete_state;
END;
$$ LANGUAGE plpgsql;

-- Task deduplication function
CREATE OR REPLACE FUNCTION prevent_task_duplication(
    task_id_param VARCHAR(20),
    operation_type VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
    last_operation TIMESTAMPTZ;
    duplicate_threshold INTERVAL := '5 minutes';
BEGIN
    -- Check for recent identical operations
    SELECT MAX(timestamp) INTO last_operation
    FROM cursor_interactions_log
    WHERE task_id = task_id_param
    AND interaction_type = operation_type
    AND timestamp > NOW() - duplicate_threshold;
    
    IF last_operation IS NOT NULL THEN
        RAISE NOTICE 'Duplicate operation detected for task % within % minutes', 
                     task_id_param, EXTRACT(MINUTES FROM duplicate_threshold);
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Daily progress monitoring
CREATE OR REPLACE FUNCTION monitor_daily_progress()
RETURNS TABLE(
    day_number INTEGER,
    completion_rate DECIMAL(5,2),
    hours_used DECIMAL(4,1),
    hours_planned DECIMAL(4,1),
    efficiency_score DECIMAL(5,2),
    blockers_count INTEGER,
    emotional_sovereignty_score DECIMAL(3,2),
    trust_impact_total DECIMAL(4,2),
    critical_issues TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH daily_stats AS (
        SELECT 
            t.day_number,
            COUNT(*) as total_tasks,
            COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
            COUNT(CASE WHEN t.status = 'blocked' THEN 1 END) as blocked_tasks,
            SUM(t.estimated_hours) as planned_hours,
            SUM(t.actual_hours) as used_hours,
            AVG(t.emotional_impact_score) as avg_emotional_impact,
            SUM(t.trust_score_delta) as total_trust_impact,
            COUNT(CASE WHEN t.sacred_reversal_test_passed = TRUE THEN 1 END) as sacred_reversal_passed,
            ARRAY_AGG(
                CASE WHEN t.status = 'blocked' THEN t.task_name END
            ) FILTER (WHERE t.status = 'blocked') as blocked_task_names
        FROM task_tracker_13day t
        GROUP BY t.day_number
    )
    SELECT 
        ds.day_number,
        ROUND((ds.completed_tasks::DECIMAL / ds.total_tasks) * 100, 2) as completion_rate,
        COALESCE(ds.used_hours, 0) as hours_used,
        ds.planned_hours as hours_planned,
        CASE 
            WHEN ds.used_hours > 0 THEN 
                ROUND((ds.completed_tasks::DECIMAL / ds.used_hours) * 100, 2)
            ELSE 0 
        END as efficiency_score,
        ds.blocked_tasks as blockers_count,
        COALESCE(ds.avg_emotional_impact, 0) as emotional_sovereignty_score,
        COALESCE(ds.total_trust_impact, 0) as trust_impact_total,
        CASE 
            WHEN ds.completion_rate < 80 AND ds.day_number <= EXTRACT(DAY FROM NOW()) THEN 
                ARRAY['Low completion rate: ' || ds.completion_rate::TEXT || '%']
            WHEN ds.used_hours > ds.planned_hours * 1.2 THEN 
                ARRAY['Over time budget by ' || ROUND(ds.used_hours - ds.planned_hours, 1)::TEXT || ' hours']
            WHEN ds.blocked_tasks > 0 THEN 
                ARRAY['Blocked tasks: ' || array_to_string(ds.blocked_task_names, ', ')]
            WHEN ds.sacred_reversal_passed < ds.total_tasks THEN
                ARRAY['Sacred Reversal Test failures detected']
            ELSE ARRAY[]::TEXT[]
        END as critical_issues
    FROM daily_stats ds
    ORDER BY ds.day_number;
END;
$$ LANGUAGE plpgsql;

-- Checkpoint validation (Days 6, 9, 12)
CREATE OR REPLACE FUNCTION validate_checkpoint(checkpoint_day INTEGER)
RETURNS TABLE(
    checkpoint_status VARCHAR(20),
    tasks_completed INTEGER,
    tasks_total INTEGER,
    critical_metrics_met INTEGER,
    critical_metrics_total INTEGER,
    emotional_sovereignty_score DECIMAL(3,2),
    trust_score_impact DECIMAL(4,2),
    sacred_reversal_compliance DECIMAL(5,2),
    blockers TEXT[],
    recommendations TEXT[]
) AS $$
DECLARE
    completion_threshold DECIMAL := 0.90; -- 90% completion required
    metrics_threshold DECIMAL := 0.85; -- 85% of metrics must meet targets
    emotional_threshold DECIMAL := 4.0; -- Minimum emotional impact score
    trust_threshold DECIMAL := 4.2; -- Minimum trust score maintenance
BEGIN
    RETURN QUERY
    WITH checkpoint_analysis AS (
        SELECT 
            COUNT(*) as total_tasks,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
            COUNT(CASE WHEN status = 'blocked' THEN 1 END) as blocked_tasks,
            AVG(emotional_impact_score) as avg_emotional_impact,
            SUM(trust_score_delta) as total_trust_impact,
            COUNT(CASE WHEN sacred_reversal_test_passed = TRUE THEN 1 END) as sacred_reversal_passed,
            ARRAY_AGG(
                CASE WHEN status = 'blocked' THEN task_name END
            ) FILTER (WHERE status = 'blocked') as blocked_task_names
        FROM task_tracker_13day
        WHERE day_number <= checkpoint_day
    ),
    metrics_analysis AS (
        SELECT 
            COUNT(*) as total_metrics,
            COUNT(CASE WHEN meets_target = TRUE THEN 1 END) as met_metrics
        FROM task_metrics_realtime tmr
        JOIN task_tracker_13day tt ON tmr.task_id = tt.task_id
        WHERE tt.day_number <= checkpoint_day
        AND tmr.measurement_time = (
            SELECT MAX(measurement_time) 
            FROM task_metrics_realtime tmr2 
            WHERE tmr2.task_id = tmr.task_id 
            AND tmr2.metric_name = tmr.metric_name
        )
    )
    SELECT 
        CASE 
            WHEN (ca.completed_tasks::DECIMAL / ca.total_tasks) >= completion_threshold 
             AND (ma.met_metrics::DECIMAL / NULLIF(ma.total_metrics, 0)) >= metrics_threshold
             AND ca.avg_emotional_impact >= emotional_threshold
             AND (4.2 + ca.total_trust_impact) >= trust_threshold
            THEN 'PASS'
            WHEN (ca.completed_tasks::DECIMAL / ca.total_tasks) >= completion_threshold * 0.8 
            THEN 'WARNING'
            ELSE 'FAIL'
        END as checkpoint_status,
        ca.completed_tasks,
        ca.total_tasks,
        ma.met_metrics,
        ma.total_metrics,
        COALESCE(ca.avg_emotional_impact, 0) as emotional_sovereignty_score,
        COALESCE(ca.total_trust_impact, 0) as trust_score_impact,
        ROUND((ca.sacred_reversal_passed::DECIMAL / ca.total_tasks) * 100, 2) as sacred_reversal_compliance,
        COALESCE(ca.blocked_task_names, ARRAY[]::TEXT[]) as blockers,
        CASE 
            WHEN (ca.completed_tasks::DECIMAL / ca.total_tasks) < completion_threshold THEN 
                ARRAY['Focus on completing blocked tasks', 'Consider parallel execution', 'Reduce scope if necessary']
            WHEN (ma.met_metrics::DECIMAL / NULLIF(ma.total_metrics, 0)) < metrics_threshold THEN 
                ARRAY['Review metric targets', 'Implement fallback strategies', 'Prioritize critical metrics']
            WHEN ca.avg_emotional_impact < emotional_threshold THEN
                ARRAY['Enhance emotional sovereignty focus', 'Review Sacred Reversal Test compliance']
            WHEN (4.2 + ca.total_trust_impact) < trust_threshold THEN
                ARRAY['Implement trust recovery measures', 'Review trust transparency']
            ELSE ARRAY['Continue with current approach', 'Monitor for emerging issues']
        END as recommendations
    FROM checkpoint_analysis ca
    CROSS JOIN metrics_analysis ma;
END;
$$ LANGUAGE plpgsql;

-- Real-time blocker detection
CREATE OR REPLACE FUNCTION detect_blockers()
RETURNS TABLE(
    task_id VARCHAR(20),
    task_name VARCHAR(255),
    blocker_type VARCHAR(50),
    blocker_description TEXT,
    suggested_action TEXT,
    urgency_level VARCHAR(20),
    emotional_impact TEXT,
    trust_recovery_needed BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    -- Overdue tasks
    SELECT 
        t.task_id,
        t.task_name,
        'overdue'::VARCHAR(50) as blocker_type,
        'Task running over estimated time by ' || 
        ROUND(EXTRACT(EPOCH FROM (NOW() - t.start_time))/3600 - t.estimated_hours, 1)::TEXT || 
        ' hours' as blocker_description,
        'Review scope, implement fallback, or escalate' as suggested_action,
        CASE 
            WHEN EXTRACT(EPOCH FROM (NOW() - t.start_time))/3600 > t.estimated_hours * 2 THEN 'HIGH'
            ELSE 'MEDIUM'
        END::VARCHAR(20) as urgency_level,
        'User confidence may be impacted by delays' as emotional_impact,
        CASE WHEN t.trust_score_delta < 0 THEN TRUE ELSE FALSE END as trust_recovery_needed
    FROM task_tracker_13day t
    WHERE t.status = 'in_progress'
    AND t.start_time IS NOT NULL
    AND EXTRACT(EPOCH FROM (NOW() - t.start_time))/3600 > t.estimated_hours * 1.5

    UNION ALL

    -- Dependency blockers
    SELECT 
        t.task_id,
        t.task_name,
        'dependency'::VARCHAR(50) as blocker_type,
        'Waiting for dependencies: ' || array_to_string(t.dependencies, ', ') as blocker_description,
        'Check dependency status, consider parallel work' as suggested_action,
        'MEDIUM'::VARCHAR(20) as urgency_level,
        'User journey may be disrupted by dependency delays' as emotional_impact,
        FALSE as trust_recovery_needed
    FROM task_tracker_13day t
    WHERE t.status = 'not_started'
    AND array_length(t.dependencies, 1) > 0
    AND EXISTS (
        SELECT 1 FROM task_tracker_13day dep
        WHERE dep.task_id = ANY(t.dependencies)
        AND dep.status NOT IN ('completed', 'skipped')
    )

    UNION ALL

    -- Metric failures
    SELECT 
        t.task_id,
        t.task_name,
        'metric_failure'::VARCHAR(50) as blocker_type,
        'Critical metrics not meeting targets' as blocker_description,
        'Review implementation, adjust targets, or implement fallback' as suggested_action,
        'HIGH'::VARCHAR(20) as urgency_level,
        'User trust may be compromised by performance issues' as emotional_impact,
        TRUE as trust_recovery_needed
    FROM task_tracker_13day t
    WHERE t.status = 'in_progress'
    AND EXISTS (
        SELECT 1 FROM task_metrics_realtime tmr
        WHERE tmr.task_id = t.task_id
        AND tmr.meets_target = FALSE
        AND tmr.metric_name IN ('latency_p99', 'sentiment_accuracy', 'webhook_false_positives')
    )

    UNION ALL

    -- Sacred Reversal Test failures
    SELECT 
        t.task_id,
        t.task_name,
        'sacred_reversal_failure'::VARCHAR(50) as blocker_type,
        'Task has not passed Sacred Reversal Test for emotional sovereignty' as blocker_description,
        'Review emotional impact, enhance user empowerment focus' as suggested_action,
        'HIGH'::VARCHAR(20) as urgency_level,
        'Critical: User sovereignty and empowerment at risk' as emotional_impact,
        TRUE as trust_recovery_needed
    FROM task_tracker_13day t
    WHERE t.status IN ('in_progress', 'completed')
    AND t.sacred_reversal_test_passed = FALSE;
END;
$$ LANGUAGE plpgsql;

-- Automated backup trigger (every 4 hours)
CREATE OR REPLACE FUNCTION schedule_task_backups()
RETURNS VOID AS $$
BEGIN
    -- This would be called by a cron job or scheduled function
    PERFORM backup_task_state('scheduled');
    
    -- Clean up old backups (keep last 7 days)
    DELETE FROM task_state_backups 
    WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Update trigger for task tracker
CREATE OR REPLACE FUNCTION update_task_tracker_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_task_tracker_timestamp
    BEFORE UPDATE ON task_tracker_13day
    FOR EACH ROW
    EXECUTE FUNCTION update_task_tracker_timestamp();

-- Comments for documentation
COMMENT ON TABLE task_tracker_13day IS 'Comprehensive task tracking for 13-day CanAI implementation plan with emotional sovereignty validation';
COMMENT ON TABLE cursor_interactions_log IS 'Detailed logging of all Cursor interactions with emotional impact assessment';
COMMENT ON TABLE task_metrics_realtime IS 'Real-time metric tracking with automated target validation and trust score impact';
COMMENT ON TABLE task_state_backups IS 'Complete system state backups for context preservation and recovery'; 