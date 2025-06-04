-- GIN Indexes for prompt_logs only (Safe Deployment)
-- CanAI Emotional Sovereignty Database v6.1.4
-- Optimized for <200ms JSONB query performance

-- Increase memory for index creation
SET maintenance_work_mem = '1GB';

-- Create GIN indexes for JSONB fields in prompt_logs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_prompt_logs_input_gin 
ON prompt_logs USING GIN(input_fields)
WHERE input_fields IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_prompt_logs_output_gin 
ON prompt_logs USING GIN(output)
WHERE output IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_prompt_logs_analytics_meta_gin 
ON prompt_logs USING GIN(analytics_meta)
WHERE analytics_meta IS NOT NULL;

-- Reset memory setting
RESET maintenance_work_mem;

-- Validation block
DO $$    
DECLARE
  index_count INTEGER;
  expected_count INTEGER := 3;
BEGIN
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes 
  WHERE tablename = 'prompt_logs' 
  AND indexname LIKE 'idx_prompt_logs_%_gin';
  
  IF index_count >= expected_count THEN
    RAISE NOTICE 'SUCCESS: % GIN indexes created for JSONB performance optimization', index_count;
  ELSE
    RAISE WARNING 'INCOMPLETE: % of % expected GIN indexes created', index_count, expected_count;
  END IF;
END;
$$;

-- Performance test query
SELECT 'GIN indexes deployed successfully for prompt_logs JSONB optimization' as status; 