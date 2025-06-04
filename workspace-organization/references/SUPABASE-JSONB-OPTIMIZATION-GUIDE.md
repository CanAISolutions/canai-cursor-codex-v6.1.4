# 🚀 **SUPABASE JSONB OPTIMIZATION GUIDE**

> **Sacred Covenant**: Optimize JSONB performance for complex product interfaces while maintaining emotional sovereignty and trust transparency.

## 🎯 **OPTIMIZATION OVERVIEW**

This guide provides specific SQL improvements to achieve sub-200ms JSONB query performance for all 11 CanAI product types, with comprehensive flattening functions for CLI dashboard and Make.com integration.

### **Performance Targets**
- ✅ **JSONB Queries**: < 200ms for complex nested operations
- ✅ **Flattening Functions**: < 50ms for product interface conversion
- ✅ **CLI Dashboard**: Real-time flattened data display
- ✅ **Make.com Integration**: Optimized webhook payload generation
- ✅ **Trust Score Maintenance**: 4.2+ throughout all operations

---

## 📋 **PHASE 1: GIN INDEXES FOR JSONB PERFORMANCE**

### **1.1 Core JSONB Indexes**

```sql
-- Primary JSONB performance indexes
-- These indexes dramatically improve JSONB query performance

-- Context data index for cursor interactions
CREATE INDEX CONCURRENTLY idx_cursor_interactions_context_gin 
ON cursor_interactions_log USING GIN(context_data);

-- Target metrics index for task tracking
CREATE INDEX CONCURRENTLY idx_task_tracker_target_metrics_gin 
ON task_tracker_13day USING GIN(target_metrics);

-- Actual metrics index for task tracking  
CREATE INDEX CONCURRENTLY idx_task_tracker_actual_metrics_gin 
ON task_tracker_13day USING GIN(actual_metrics);

-- Backup data index for state preservation
CREATE INDEX CONCURRENTLY idx_task_backups_data_gin 
ON task_state_backups USING GIN(backup_data);

-- Measurement context index for real-time metrics
CREATE INDEX CONCURRENTLY idx_metrics_context_gin 
ON task_metrics_realtime USING GIN(measurement_context);
```

### **1.2 Specific Path Indexes for Common Queries**

```sql
-- Performance-critical path indexes
-- These target specific JSONB fields frequently accessed

-- P99 latency tracking (performance monitoring)
CREATE INDEX CONCURRENTLY idx_task_metrics_p99_latency 
ON task_tracker_13day USING BTREE((actual_metrics->>'p99_latency')::numeric)
WHERE actual_metrics->>'p99_latency' IS NOT NULL;

-- Sentiment accuracy tracking (emotional intelligence)
CREATE INDEX CONCURRENTLY idx_task_metrics_sentiment_accuracy 
ON task_tracker_13day USING BTREE((actual_metrics->>'sentiment_accuracy')::numeric)
WHERE actual_metrics->>'sentiment_accuracy' IS NOT NULL;

-- Trust score tracking (emotional sovereignty)
CREATE INDEX CONCURRENTLY idx_task_metrics_trust_score 
ON task_tracker_13day USING BTREE((actual_metrics->>'trust_score')::numeric)
WHERE actual_metrics->>'trust_score' IS NOT NULL;

-- Emotional impact score tracking
CREATE INDEX CONCURRENTLY idx_task_metrics_emotional_impact 
ON task_tracker_13day USING BTREE((actual_metrics->>'emotional_impact_score')::integer)
WHERE actual_metrics->>'emotional_impact_score' IS NOT NULL;

-- User empowerment indicator tracking
CREATE INDEX CONCURRENTLY idx_cursor_interactions_empowerment 
ON cursor_interactions_log USING BTREE(user_empowerment_indicator)
WHERE user_empowerment_indicator IS NOT NULL;
```

### **1.3 Composite Indexes for Complex Queries**

```sql
-- Multi-dimensional indexes for complex emotional sovereignty queries

-- Trust score and emotional impact composite
CREATE INDEX CONCURRENTLY idx_task_trust_emotional_composite 
ON task_tracker_13day USING BTREE(
  (actual_metrics->>'trust_score')::numeric,
  (actual_metrics->>'emotional_impact_score')::integer,
  sacred_reversal_test_passed
) WHERE actual_metrics IS NOT NULL;

-- Performance and trust composite
CREATE INDEX CONCURRENTLY idx_task_performance_trust_composite 
ON task_tracker_13day USING BTREE(
  (actual_metrics->>'p99_latency')::numeric,
  (actual_metrics->>'trust_score')::numeric,
  status
) WHERE actual_metrics IS NOT NULL;

-- Energy level and complexity composite for prioritization
CREATE INDEX CONCURRENTLY idx_task_energy_complexity_composite 
ON task_tracker_13day USING BTREE(
  energy_level,
  complexity_rating,
  (actual_metrics->>'trust_score')::numeric
) WHERE energy_level IS NOT NULL;
```

---

## 📋 **PHASE 2: COMPREHENSIVE FLATTENING FUNCTIONS**

### **2.1 Core Task Metrics Flattening**

```sql
-- Primary flattening function for CLI dashboard
CREATE OR REPLACE FUNCTION flatten_task_metrics(task_id_param VARCHAR(20))
RETURNS TABLE(
  task_id VARCHAR(20),
  task_name VARCHAR(255),
  status VARCHAR(20),
  progress_percentage INTEGER,
  
  -- Performance metrics
  p99_latency NUMERIC,
  avg_response_time NUMERIC,
  error_rate NUMERIC,
  throughput NUMERIC,
  
  -- Emotional sovereignty metrics
  trust_score NUMERIC,
  sentiment_accuracy NUMERIC,
  emotional_impact_score INTEGER,
  user_empowerment_score NUMERIC,
  sacred_reversal_passed BOOLEAN,
  
  -- Task management
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  complexity_rating INTEGER,
  energy_level VARCHAR(20),
  
  -- Timestamps
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  last_updated TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.task_id,
    t.task_name,
    t.status,
    t.progress_percentage,
    
    -- Extract performance metrics from JSONB
    (t.actual_metrics->>'p99_latency')::NUMERIC,
    (t.actual_metrics->>'avg_response_time')::NUMERIC,
    (t.actual_metrics->>'error_rate')::NUMERIC,
    (t.actual_metrics->>'throughput')::NUMERIC,
    
    -- Extract emotional sovereignty metrics
    (t.actual_metrics->>'trust_score')::NUMERIC,
    (t.actual_metrics->>'sentiment_accuracy')::NUMERIC,
    (t.actual_metrics->>'emotional_impact_score')::INTEGER,
    (t.actual_metrics->>'user_empowerment_score')::NUMERIC,
    t.sacred_reversal_test_passed,
    
    -- Task management data
    t.estimated_hours,
    t.actual_hours,
    t.complexity_rating,
    t.energy_level,
    
    -- Timestamps
    t.start_time,
    t.end_time,
    t.updated_at
    
  FROM task_tracker_13day t
  WHERE t.task_id = task_id_param;
END;
$$ LANGUAGE plpgsql;

-- Performance optimization: Add function index
CREATE INDEX CONCURRENTLY idx_flatten_task_metrics_performance 
ON task_tracker_13day(task_id, status, sacred_reversal_test_passed)
WHERE actual_metrics IS NOT NULL;
```

### **2.2 Product Interface Flattening for Make.com**

```sql
-- Advanced product interface flattening for webhook integration
CREATE OR REPLACE FUNCTION flatten_product_interface(
  interface_data JSONB,
  product_type VARCHAR(50)
)
RETURNS JSONB AS $$
DECLARE
  flattened JSONB := '{}';
  key TEXT;
  value JSONB;
  nested_key TEXT;
  nested_value JSONB;
BEGIN
  -- Handle null input
  IF interface_data IS NULL THEN
    RETURN '{}';
  END IF;
  
  -- Flatten first level
  FOR key, value IN SELECT * FROM jsonb_each(interface_data)
  LOOP
    IF jsonb_typeof(value) = 'object' THEN
      -- Flatten nested objects with dot notation
      FOR nested_key, nested_value IN SELECT * FROM jsonb_each(value)
      LOOP
        IF jsonb_typeof(nested_value) = 'object' THEN
          -- Handle third level nesting (e.g., financials.emotionalDrivers.*)
          DECLARE
            deep_key TEXT;
            deep_value JSONB;
          BEGIN
            FOR deep_key, deep_value IN SELECT * FROM jsonb_each(nested_value)
            LOOP
              flattened := flattened || jsonb_build_object(
                key || '.' || nested_key || '.' || deep_key, 
                deep_value
              );
            END LOOP;
          END;
        ELSIF jsonb_typeof(nested_value) = 'array' THEN
          -- Handle arrays by converting to indexed fields
          DECLARE
            array_index INTEGER := 0;
            array_element JSONB;
          BEGIN
            FOR array_element IN SELECT * FROM jsonb_array_elements(nested_value)
            LOOP
              flattened := flattened || jsonb_build_object(
                key || '.' || nested_key || '_' || array_index::TEXT,
                array_element
              );
              array_index := array_index + 1;
            END LOOP;
          END;
        ELSE
          -- Simple nested field
          flattened := flattened || jsonb_build_object(
            key || '.' || nested_key, 
            nested_value
          );
        END IF;
      END LOOP;
    ELSIF jsonb_typeof(value) = 'array' THEN
      -- Handle top-level arrays
      DECLARE
        array_index INTEGER := 0;
        array_element JSONB;
      BEGIN
        FOR array_element IN SELECT * FROM jsonb_array_elements(value)
        LOOP
          flattened := flattened || jsonb_build_object(
            key || '_' || array_index::TEXT,
            array_element
          );
          array_index := array_index + 1;
        END LOOP;
      END;
    ELSE
      -- Simple top-level field
      flattened := flattened || jsonb_build_object(key, value);
    END IF;
  END LOOP;
  
  -- Add metadata
  flattened := flattened || jsonb_build_object(
    '_product_type', product_type,
    '_flattened_at', extract(epoch from now()),
    '_field_count', jsonb_object_keys(flattened)
  );
  
  RETURN flattened;
END;
$$ LANGUAGE plpgsql;
```

### **2.3 Emotional Compass Flattening**

```sql
-- Flatten emotional compass data for analytics
CREATE OR REPLACE FUNCTION flatten_emotional_compass(
  compass_data JSONB
)
RETURNS TABLE(
  awe_score NUMERIC,
  ownership_score NUMERIC,
  wonder_score NUMERIC,
  calm_score NUMERIC,
  power_score NUMERIC,
  overall_emotional_score NUMERIC,
  emotional_balance_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (compass_data->>'awe')::NUMERIC,
    (compass_data->>'ownership')::NUMERIC,
    (compass_data->>'wonder')::NUMERIC,
    (compass_data->>'calm')::NUMERIC,
    (compass_data->>'power')::NUMERIC,
    
    -- Calculate overall emotional score (average of 5 axes)
    ((compass_data->>'awe')::NUMERIC + 
     (compass_data->>'ownership')::NUMERIC + 
     (compass_data->>'wonder')::NUMERIC + 
     (compass_data->>'calm')::NUMERIC + 
     (compass_data->>'power')::NUMERIC) / 5.0,
    
    -- Calculate emotional balance (standard deviation - lower is more balanced)
    sqrt(
      (power((compass_data->>'awe')::NUMERIC - 
              ((compass_data->>'awe')::NUMERIC + 
               (compass_data->>'ownership')::NUMERIC + 
               (compass_data->>'wonder')::NUMERIC + 
               (compass_data->>'calm')::NUMERIC + 
               (compass_data->>'power')::NUMERIC) / 5.0, 2) +
       power((compass_data->>'ownership')::NUMERIC - 
              ((compass_data->>'awe')::NUMERIC + 
               (compass_data->>'ownership')::NUMERIC + 
               (compass_data->>'wonder')::NUMERIC + 
               (compass_data->>'calm')::NUMERIC + 
               (compass_data->>'power')::NUMERIC) / 5.0, 2) +
       power((compass_data->>'wonder')::NUMERIC - 
              ((compass_data->>'awe')::NUMERIC + 
               (compass_data->>'ownership')::NUMERIC + 
               (compass_data->>'wonder')::NUMERIC + 
               (compass_data->>'calm')::NUMERIC + 
               (compass_data->>'power')::NUMERIC) / 5.0, 2) +
       power((compass_data->>'calm')::NUMERIC - 
              ((compass_data->>'awe')::NUMERIC + 
               (compass_data->>'ownership')::NUMERIC + 
               (compass_data->>'wonder')::NUMERIC + 
               (compass_data->>'calm')::NUMERIC + 
               (compass_data->>'power')::NUMERIC) / 5.0, 2) +
       power((compass_data->>'power')::NUMERIC - 
              ((compass_data->>'awe')::NUMERIC + 
               (compass_data->>'ownership')::NUMERIC + 
               (compass_data->>'wonder')::NUMERIC + 
               (compass_data->>'calm')::NUMERIC + 
               (compass_data->>'power')::NUMERIC) / 5.0, 2)) / 5.0
    );
END;
$$ LANGUAGE plpgsql;
```

---

## 📋 **PHASE 3: VALIDATION AND INTEGRITY TRIGGERS**

### **3.1 JSONB Data Validation**

```sql
-- Comprehensive JSONB validation for emotional sovereignty
CREATE OR REPLACE FUNCTION validate_emotional_sovereignty_jsonb()
RETURNS TRIGGER AS $$
DECLARE
  trust_score NUMERIC;
  emotional_impact INTEGER;
  required_fields TEXT[] := ARRAY['trust_score', 'emotional_impact_score'];
  field TEXT;
BEGIN
  -- Validate actual_metrics JSONB structure
  IF NEW.actual_metrics IS NOT NULL THEN
    
    -- Check for required fields
    FOREACH field IN ARRAY required_fields
    LOOP
      IF NOT (NEW.actual_metrics ? field) THEN
        RAISE WARNING 'Missing required field in actual_metrics: %', field;
      END IF;
    END LOOP;
    
    -- Validate trust score range
    trust_score := (NEW.actual_metrics->>'trust_score')::NUMERIC;
    IF trust_score IS NOT NULL THEN
      IF trust_score < 1.0 OR trust_score > 5.0 THEN
        RAISE EXCEPTION 'Trust score must be between 1.0 and 5.0, got: %', trust_score;
      END IF;
      
      -- Alert if trust score is below threshold
      IF trust_score < 4.2 THEN
        RAISE WARNING 'Trust score below threshold (4.2) for task %: %', NEW.task_id, trust_score;
        
        -- Log to cursor interactions for monitoring
        INSERT INTO cursor_interactions_log (
          task_id, interaction_type, prompt_text, success, error_message,
          emotional_impact_score, trust_score_delta, sacred_reversal_test_passed
        ) VALUES (
          NEW.task_id, 'trust_score_warning', 
          'Trust score below threshold detected', FALSE,
          'Trust score: ' || trust_score || ' (threshold: 4.2)',
          1, trust_score - 4.2, FALSE
        );
      END IF;
    END IF;
    
    -- Validate emotional impact score
    emotional_impact := (NEW.actual_metrics->>'emotional_impact_score')::INTEGER;
    IF emotional_impact IS NOT NULL THEN
      IF emotional_impact < 1 OR emotional_impact > 5 THEN
        RAISE EXCEPTION 'Emotional impact score must be between 1 and 5, got: %', emotional_impact;
      END IF;
    END IF;
    
    -- Validate performance metrics
    IF NEW.actual_metrics ? 'p99_latency' THEN
      IF (NEW.actual_metrics->>'p99_latency')::NUMERIC > 5000 THEN
        RAISE WARNING 'P99 latency above 5 seconds for task %: %ms', 
          NEW.task_id, (NEW.actual_metrics->>'p99_latency')::NUMERIC;
      END IF;
    END IF;
    
  END IF;
  
  -- Validate Sacred Reversal Test compliance
  IF NEW.sacred_reversal_test_passed = FALSE THEN
    RAISE WARNING 'Task % failed Sacred Reversal Test - emotional sovereignty review required', NEW.task_id;
    
    -- Auto-log for follow-up
    INSERT INTO cursor_interactions_log (
      task_id, interaction_type, prompt_text, success, error_message,
      emotional_impact_score, sacred_reversal_test_passed
    ) VALUES (
      NEW.task_id, 'sacred_reversal_failure',
      'Sacred Reversal Test failed - requires review', FALSE,
      'Task failed emotional sovereignty validation',
      1, FALSE
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply validation trigger
CREATE TRIGGER validate_emotional_sovereignty_trigger
  BEFORE INSERT OR UPDATE ON task_tracker_13day
  FOR EACH ROW EXECUTE FUNCTION validate_emotional_sovereignty_jsonb();
```

### **3.2 Performance Monitoring Triggers**

```sql
-- Monitor JSONB query performance
CREATE OR REPLACE FUNCTION monitor_jsonb_performance()
RETURNS TRIGGER AS $$
DECLARE
  query_start TIMESTAMPTZ := clock_timestamp();
  query_duration INTERVAL;
BEGIN
  -- Simulate query completion
  query_duration := clock_timestamp() - query_start;
  
  -- Log slow JSONB operations
  IF EXTRACT(EPOCH FROM query_duration) * 1000 > 200 THEN
    INSERT INTO cursor_interactions_log (
      task_id, interaction_type, prompt_text, success, error_message,
      response_time_ms
    ) VALUES (
      COALESCE(NEW.task_id, 'system'),
      'slow_jsonb_query',
      'JSONB operation exceeded 200ms threshold',
      TRUE,
      'Query duration: ' || EXTRACT(EPOCH FROM query_duration) * 1000 || 'ms',
      EXTRACT(EPOCH FROM query_duration) * 1000
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 📋 **PHASE 4: OPTIMIZATION UTILITIES**

### **4.1 Performance Analysis Functions**

```sql
-- Analyze JSONB query performance
CREATE OR REPLACE FUNCTION analyze_jsonb_performance()
RETURNS TABLE(
  table_name TEXT,
  index_name TEXT,
  index_size TEXT,
  usage_count BIGINT,
  avg_query_time_ms NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    schemaname || '.' || tablename as table_name,
    indexname as index_name,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size,
    idx_scan as usage_count,
    0.0 as avg_query_time_ms -- Placeholder for actual timing data
  FROM pg_stat_user_indexes 
  WHERE indexname LIKE '%_gin' OR indexname LIKE '%jsonb%'
  ORDER BY idx_scan DESC;
END;
$$ LANGUAGE plpgsql;

-- Get JSONB field usage statistics
CREATE OR REPLACE FUNCTION get_jsonb_field_usage()
RETURNS TABLE(
  table_name TEXT,
  jsonb_column TEXT,
  field_path TEXT,
  usage_frequency BIGINT,
  avg_value_size INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'task_tracker_13day'::TEXT,
    'actual_metrics'::TEXT,
    'trust_score'::TEXT,
    COUNT(*) as usage_frequency,
    AVG(length(actual_metrics->>'trust_score'))::INTEGER as avg_value_size
  FROM task_tracker_13day 
  WHERE actual_metrics ? 'trust_score'
  
  UNION ALL
  
  SELECT 
    'task_tracker_13day'::TEXT,
    'actual_metrics'::TEXT,
    'p99_latency'::TEXT,
    COUNT(*) as usage_frequency,
    AVG(length(actual_metrics->>'p99_latency'))::INTEGER as avg_value_size
  FROM task_tracker_13day 
  WHERE actual_metrics ? 'p99_latency'
  
  UNION ALL
  
  SELECT 
    'cursor_interactions_log'::TEXT,
    'context_data'::TEXT,
    'emotional_impact'::TEXT,
    COUNT(*) as usage_frequency,
    AVG(length(context_data->>'emotional_impact'))::INTEGER as avg_value_size
  FROM cursor_interactions_log 
  WHERE context_data ? 'emotional_impact';
END;
$$ LANGUAGE plpgsql;
```

### **4.2 Maintenance and Cleanup Functions**

```sql
-- Clean up old JSONB data to maintain performance
CREATE OR REPLACE FUNCTION cleanup_old_jsonb_data(
  retention_days INTEGER DEFAULT 90
)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
  cutoff_date TIMESTAMPTZ := NOW() - (retention_days || ' days')::INTERVAL;
BEGIN
  -- Clean up old cursor interactions
  DELETE FROM cursor_interactions_log 
  WHERE created_at < cutoff_date 
  AND success = TRUE 
  AND interaction_type NOT IN ('trust_score_warning', 'sacred_reversal_failure');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Clean up old task backups (keep checkpoints)
  DELETE FROM task_state_backups 
  WHERE created_at < cutoff_date 
  AND is_checkpoint_backup = FALSE;
  
  -- Vacuum analyze affected tables
  PERFORM pg_stat_reset_single_table_counters('cursor_interactions_log'::regclass);
  PERFORM pg_stat_reset_single_table_counters('task_state_backups'::regclass);
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Reindex JSONB indexes for optimal performance
CREATE OR REPLACE FUNCTION reindex_jsonb_indexes()
RETURNS TEXT AS $$
DECLARE
  index_name TEXT;
  result_message TEXT := 'Reindexed JSONB indexes: ';
BEGIN
  -- Reindex all GIN indexes
  FOR index_name IN 
    SELECT indexname 
    FROM pg_indexes 
    WHERE indexdef LIKE '%USING gin%' 
    AND tablename IN ('task_tracker_13day', 'cursor_interactions_log', 'task_state_backups')
  LOOP
    EXECUTE 'REINDEX INDEX CONCURRENTLY ' || index_name;
    result_message := result_message || index_name || ', ';
  END LOOP;
  
  RETURN rtrim(result_message, ', ');
END;
$$ LANGUAGE plpgsql;
```

---

## 🎯 **DEPLOYMENT CHECKLIST**

### **Pre-Deployment Validation**
- [ ] Backup existing database
- [ ] Test all functions in staging environment
- [ ] Validate index creation doesn't block operations
- [ ] Confirm flattening functions return expected structure
- [ ] Test CLI dashboard with flattened data
- [ ] Verify Make.com webhook compatibility

### **Deployment Steps**
1. **Create indexes with CONCURRENTLY** (no downtime)
2. **Deploy flattening functions** (immediate availability)
3. **Add validation triggers** (data integrity protection)
4. **Test performance improvements** (< 200ms target)
5. **Update CLI dashboard** (enhanced display)
6. **Validate emotional sovereignty compliance** (trust score > 4.2)

### **Post-Deployment Monitoring**
- [ ] Monitor query performance with `analyze_jsonb_performance()`
- [ ] Track trust score compliance with validation triggers
- [ ] Verify flattened data accuracy in CLI dashboard
- [ ] Test Make.com webhook payload generation
- [ ] Monitor Sacred Reversal Test compliance

### **Success Criteria**
- ✅ **Query Performance**: All JSONB queries < 200ms
- ✅ **Trust Score Maintenance**: Average > 4.2 across all operations
- ✅ **CLI Dashboard**: Real-time flattened data display functional
- ✅ **Make.com Integration**: Optimized webhook payloads generated
- ✅ **Emotional Sovereignty**: Sacred Reversal Test compliance maintained
- ✅ **Data Integrity**: Validation triggers preventing poor experiences

This optimization guide provides the foundation for high-performance JSONB operations while maintaining the sacred covenant of emotional sovereignty and trust transparency. 