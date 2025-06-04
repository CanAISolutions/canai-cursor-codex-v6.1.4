-- 🧠 **SQL-BASED INTELLIGENCE FUNCTIONS**
-- Replace AWS Lambda BERT with Supabase-native sentiment analysis
-- Target: >90% accuracy while maintaining emotional sovereignty
-- Sacred Covenant: Honor user emotions and build trust through intelligent analysis

-- ============================================================================
-- PHASE 1: ADVANCED SENTIMENT ANALYSIS ENGINE
-- ============================================================================

-- Core sentiment analysis with emotional intelligence
CREATE OR REPLACE FUNCTION calculate_sentiment_score(input_text TEXT)
RETURNS NUMERIC AS $$
DECLARE
  sentiment_score NUMERIC := 0.5; -- Neutral baseline
  positive_words INTEGER := 0;
  negative_words INTEGER := 0;
  emotional_words INTEGER := 0;
  total_words INTEGER;
  text_length INTEGER;
  emotional_intensity NUMERIC := 1.0;
  sovereignty_boost NUMERIC := 0.0;
BEGIN
  -- Handle null or empty input
  IF input_text IS NULL OR length(trim(input_text)) = 0 THEN
    RETURN 0.5; -- Neutral for empty input
  END IF;
  
  -- Normalize text for analysis
  input_text := lower(trim(input_text));
  text_length := length(input_text);
  
  -- Count total words
  total_words := array_length(string_to_array(input_text, ' '), 1);
  
  -- Count positive emotional indicators (high-impact words)
  positive_words := (
    SELECT COUNT(*)
    FROM unnest(string_to_array(input_text, ' ')) AS word
    WHERE word IN (
      -- Core positive emotions
      'amazing', 'excellent', 'fantastic', 'wonderful', 'brilliant',
      'outstanding', 'exceptional', 'incredible', 'magnificent', 'superb',
      'perfect', 'awesome', 'great', 'good', 'beautiful', 'lovely',
      
      -- Empowerment language (emotional sovereignty focus)
      'empowering', 'inspiring', 'transformative', 'revolutionary', 'magical',
      'confident', 'capable', 'powerful', 'sovereign', 'transcendent',
      'breakthrough', 'visionary', 'destiny', 'potential', 'possibility',
      
      -- Trust and connection words
      'trust', 'reliable', 'authentic', 'genuine', 'honest', 'transparent',
      'supportive', 'understanding', 'caring', 'helpful', 'valuable',
      
      -- Achievement and success
      'success', 'achievement', 'accomplished', 'effective', 'efficient',
      'productive', 'innovative', 'creative', 'smart', 'intelligent'
    )
  );
  
  -- Count negative emotional indicators
  negative_words := (
    SELECT COUNT(*)
    FROM unnest(string_to_array(input_text, ' ')) AS word
    WHERE word IN (
      -- Core negative emotions
      'terrible', 'awful', 'horrible', 'disappointing', 'frustrating',
      'annoying', 'irritating', 'bad', 'poor', 'worst', 'hate', 'dislike',
      
      -- Disempowerment language (emotional sovereignty violations)
      'confusing', 'overwhelming', 'difficult', 'impossible', 'broken',
      'useless', 'worthless', 'failed', 'failure', 'hopeless', 'helpless',
      'powerless', 'weak', 'inadequate', 'insufficient', 'lacking',
      
      -- Trust violations
      'unreliable', 'dishonest', 'fake', 'misleading', 'deceptive',
      'untrustworthy', 'suspicious', 'questionable', 'doubtful',
      
      -- Technical problems
      'error', 'problem', 'issue', 'bug', 'crash', 'slow', 'laggy',
      'unresponsive', 'frozen', 'stuck', 'broken', 'malfunctioning'
    )
  );
  
  -- Count emotional intensity words (amplifiers)
  emotional_words := (
    SELECT COUNT(*)
    FROM unnest(string_to_array(input_text, ' ')) AS word
    WHERE word IN (
      'very', 'extremely', 'incredibly', 'absolutely', 'completely',
      'totally', 'really', 'truly', 'deeply', 'profoundly', 'intensely',
      'overwhelmingly', 'remarkably', 'exceptionally', 'extraordinarily'
    )
  );
  
  -- Calculate base sentiment with weighted scoring
  IF total_words > 0 THEN
    sentiment_score := 0.5 + 
      (positive_words::NUMERIC / total_words::NUMERIC * 0.4) - 
      (negative_words::NUMERIC / total_words::NUMERIC * 0.4);
    
    -- Apply emotional intensity multiplier
    IF emotional_words > 0 THEN
      emotional_intensity := 1.0 + (emotional_words::NUMERIC / total_words::NUMERIC * 0.3);
      sentiment_score := 0.5 + (sentiment_score - 0.5) * emotional_intensity;
    END IF;
  END IF;
  
  -- Apply emotional sovereignty boost for empowerment language
  IF input_text ~* '(empower|sovereign|transform|transcend|magical|revolutionary|destiny|potential|breakthrough)' THEN
    sovereignty_boost := 0.15;
  ELSIF input_text ~* '(inspire|motivate|uplift|encourage|support|guide|help)' THEN
    sovereignty_boost := 0.10;
  ELSIF input_text ~* '(trust|reliable|authentic|genuine|transparent)' THEN
    sovereignty_boost := 0.08;
  END IF;
  
  sentiment_score := sentiment_score + sovereignty_boost;
  
  -- Apply contextual adjustments
  -- Questions tend to be more neutral
  IF input_text ~* '\?' THEN
    sentiment_score := sentiment_score * 0.9;
  END IF;
  
  -- Exclamations tend to be more intense
  IF input_text ~* '!' THEN
    sentiment_score := 0.5 + (sentiment_score - 0.5) * 1.2;
  END IF;
  
  -- Length consideration (very short text is less reliable)
  IF text_length < 10 THEN
    sentiment_score := 0.5 + (sentiment_score - 0.5) * 0.7;
  END IF;
  
  -- Ensure score stays within bounds
  sentiment_score := GREATEST(0.0, LEAST(1.0, sentiment_score));
  
  RETURN sentiment_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PHASE 2: TRUST SCORE CALCULATION ENGINE
-- ============================================================================

-- Advanced trust score calculation with emotional intelligence
CREATE OR REPLACE FUNCTION calculate_trust_score(
  user_feedback TEXT,
  interaction_context JSONB,
  previous_trust_score NUMERIC DEFAULT 4.0
)
RETURNS NUMERIC AS $$
DECLARE
  base_sentiment NUMERIC;
  trust_delta NUMERIC := 0.0;
  final_trust_score NUMERIC;
  context_multiplier NUMERIC := 1.0;
  emotional_resonance NUMERIC := 0.0;
  sovereignty_compliance NUMERIC := 0.0;
BEGIN
  -- Get base sentiment analysis
  base_sentiment := calculate_sentiment_score(user_feedback);
  
  -- Calculate base trust delta (sentiment above/below neutral)
  trust_delta := (base_sentiment - 0.5) * 1.6; -- Scale to ±0.8
  
  -- Apply context-specific adjustments
  IF interaction_context IS NOT NULL THEN
    
    -- SparkSplit interactions have higher trust impact
    IF interaction_context->>'interaction_type' = 'sparksplit_comparison' THEN
      context_multiplier := 1.8;
      
      -- Bonus for choosing CanAI in comparison
      IF interaction_context->>'user_selection' = 'canai' THEN
        trust_delta := trust_delta + 0.3;
      END IF;
    END IF;
    
    -- Product creation interactions
    IF interaction_context->>'interaction_type' = 'product_creation' THEN
      context_multiplier := 1.4;
      
      -- Bonus for completion
      IF interaction_context->>'completion_status' = 'completed' THEN
        trust_delta := trust_delta + 0.2;
      END IF;
    END IF;
    
    -- Error recovery interactions
    IF interaction_context->>'interaction_type' = 'error_recovery' THEN
      context_multiplier := 2.0; -- Errors have high trust impact
      
      -- Successful recovery gets bonus
      IF interaction_context->>'recovery_successful' = 'true' THEN
        trust_delta := trust_delta + 0.4;
      END IF;
    END IF;
    
    -- Sacred Reversal Test compliance
    IF interaction_context->>'sacred_reversal_passed' = 'true' THEN
      sovereignty_compliance := 0.15;
    ELSIF interaction_context->>'sacred_reversal_passed' = 'false' THEN
      sovereignty_compliance := -0.25; -- Penalty for failing emotional sovereignty
    END IF;
    
    -- Emotional resonance bonus
    IF interaction_context ? 'emotional_compass' THEN
      DECLARE
        compass JSONB := interaction_context->'emotional_compass';
        avg_emotional_score NUMERIC;
      BEGIN
        avg_emotional_score := (
          COALESCE((compass->>'awe')::NUMERIC, 0.5) +
          COALESCE((compass->>'ownership')::NUMERIC, 0.5) +
          COALESCE((compass->>'wonder')::NUMERIC, 0.5) +
          COALESCE((compass->>'calm')::NUMERIC, 0.5) +
          COALESCE((compass->>'power')::NUMERIC, 0.5)
        ) / 5.0;
        
        -- Bonus for high emotional resonance
        IF avg_emotional_score > 0.7 THEN
          emotional_resonance := (avg_emotional_score - 0.7) * 0.5;
        END IF;
      END;
    END IF;
    
  END IF;
  
  -- Apply all adjustments
  trust_delta := trust_delta * context_multiplier + sovereignty_compliance + emotional_resonance;
  
  -- Calculate final score with momentum consideration
  -- Recent trust changes have more impact
  final_trust_score := previous_trust_score + trust_delta;
  
  -- Apply trust score boundaries with emotional sovereignty protection
  -- Never let trust score go below 2.0 (basic functionality)
  -- Cap at 5.0 (perfect trust)
  final_trust_score := GREATEST(2.0, LEAST(5.0, final_trust_score));
  
  -- Special protection: if trust score would drop below 4.0, apply circuit breaker
  IF final_trust_score < 4.0 AND previous_trust_score >= 4.0 THEN
    -- Log circuit breaker activation
    INSERT INTO cursor_interactions_log (
      interaction_type, prompt_text, success, error_message,
      trust_score_delta, sacred_reversal_test_passed
    ) VALUES (
      'trust_circuit_breaker',
      'Trust score circuit breaker activated',
      FALSE,
      'Trust score would drop below 4.0: ' || final_trust_score,
      final_trust_score - previous_trust_score,
      FALSE
    );
    
    -- Apply gentler trust degradation
    final_trust_score := GREATEST(4.0, previous_trust_score + (trust_delta * 0.3));
  END IF;
  
  RETURN final_trust_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PHASE 3: EMOTIONAL INTELLIGENCE ANALYSIS
-- ============================================================================

-- Analyze emotional intelligence in text
CREATE OR REPLACE FUNCTION analyze_emotional_intelligence(
  input_text TEXT,
  context_type VARCHAR(50) DEFAULT 'general'
)
RETURNS JSONB AS $$
DECLARE
  result JSONB := '{}';
  sentiment_score NUMERIC;
  emotional_depth NUMERIC := 0.0;
  empathy_score NUMERIC := 0.0;
  empowerment_score NUMERIC := 0.0;
  authenticity_score NUMERIC := 0.0;
  total_words INTEGER;
BEGIN
  -- Get base sentiment
  sentiment_score := calculate_sentiment_score(input_text);
  total_words := array_length(string_to_array(lower(input_text), ' '), 1);
  
  -- Calculate emotional depth (complexity of emotional expression)
  emotional_depth := (
    SELECT COUNT(*)::NUMERIC / GREATEST(total_words, 1)
    FROM unnest(string_to_array(lower(input_text), ' ')) AS word
    WHERE word IN (
      'feel', 'feeling', 'emotion', 'emotional', 'heart', 'soul',
      'passion', 'love', 'care', 'concern', 'worry', 'hope',
      'dream', 'vision', 'aspiration', 'desire', 'want', 'need',
      'understand', 'realize', 'recognize', 'appreciate', 'value'
    )
  ) * 2.0; -- Scale up
  
  -- Calculate empathy score (understanding and connection)
  empathy_score := (
    SELECT COUNT(*)::NUMERIC / GREATEST(total_words, 1)
    FROM unnest(string_to_array(lower(input_text), ' ')) AS word
    WHERE word IN (
      'understand', 'relate', 'connect', 'resonate', 'empathize',
      'support', 'help', 'assist', 'guide', 'care', 'listen',
      'hear', 'see', 'recognize', 'acknowledge', 'validate'
    )
  ) * 3.0; -- Scale up
  
  -- Calculate empowerment score (building capability and confidence)
  empowerment_score := (
    SELECT COUNT(*)::NUMERIC / GREATEST(total_words, 1)
    FROM unnest(string_to_array(lower(input_text), ' ')) AS word
    WHERE word IN (
      'empower', 'enable', 'strengthen', 'build', 'grow', 'develop',
      'improve', 'enhance', 'elevate', 'uplift', 'inspire', 'motivate',
      'encourage', 'support', 'capable', 'able', 'strong', 'confident',
      'potential', 'possibility', 'opportunity', 'achieve', 'accomplish'
    )
  ) * 2.5; -- Scale up
  
  -- Calculate authenticity score (genuine and transparent communication)
  authenticity_score := (
    SELECT COUNT(*)::NUMERIC / GREATEST(total_words, 1)
    FROM unnest(string_to_array(lower(input_text), ' ')) AS word
    WHERE word IN (
      'honest', 'genuine', 'authentic', 'real', 'true', 'transparent',
      'open', 'clear', 'direct', 'straightforward', 'sincere',
      'truthful', 'reliable', 'trustworthy', 'consistent'
    )
  ) * 3.0; -- Scale up
  
  -- Apply context-specific adjustments
  IF context_type = 'sparksplit_comparison' THEN
    -- SparkSplit should emphasize transparency and empowerment
    authenticity_score := authenticity_score * 1.5;
    empowerment_score := empowerment_score * 1.3;
  ELSIF context_type = 'product_creation' THEN
    -- Product creation should emphasize empowerment and possibility
    empowerment_score := empowerment_score * 1.4;
    emotional_depth := emotional_depth * 1.2;
  ELSIF context_type = 'error_recovery' THEN
    -- Error recovery should emphasize empathy and support
    empathy_score := empathy_score * 1.6;
    authenticity_score := authenticity_score * 1.3;
  END IF;
  
  -- Normalize scores to 0-1 range
  emotional_depth := LEAST(1.0, emotional_depth);
  empathy_score := LEAST(1.0, empathy_score);
  empowerment_score := LEAST(1.0, empowerment_score);
  authenticity_score := LEAST(1.0, authenticity_score);
  
  -- Build result JSON
  result := jsonb_build_object(
    'sentiment_score', sentiment_score,
    'emotional_depth', emotional_depth,
    'empathy_score', empathy_score,
    'empowerment_score', empowerment_score,
    'authenticity_score', authenticity_score,
    'overall_emotional_intelligence', 
      (sentiment_score + emotional_depth + empathy_score + empowerment_score + authenticity_score) / 5.0,
    'analysis_timestamp', extract(epoch from now()),
    'context_type', context_type,
    'word_count', total_words
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PHASE 4: PERFORMANCE MONITORING AND VALIDATION
-- ============================================================================

-- Monitor sentiment analysis accuracy against known benchmarks
CREATE OR REPLACE FUNCTION validate_sentiment_accuracy(
  test_cases JSONB -- Array of {text: string, expected_sentiment: number}
)
RETURNS JSONB AS $$
DECLARE
  test_case JSONB;
  calculated_sentiment NUMERIC;
  expected_sentiment NUMERIC;
  total_tests INTEGER := 0;
  accurate_tests INTEGER := 0;
  accuracy_threshold NUMERIC := 0.15; -- Within 0.15 is considered accurate
  results JSONB := '[]';
  overall_accuracy NUMERIC;
BEGIN
  -- Process each test case
  FOR test_case IN SELECT * FROM jsonb_array_elements(test_cases)
  LOOP
    total_tests := total_tests + 1;
    
    calculated_sentiment := calculate_sentiment_score(test_case->>'text');
    expected_sentiment := (test_case->>'expected_sentiment')::NUMERIC;
    
    -- Check if within accuracy threshold
    IF abs(calculated_sentiment - expected_sentiment) <= accuracy_threshold THEN
      accurate_tests := accurate_tests + 1;
    END IF;
    
    -- Add to results
    results := results || jsonb_build_object(
      'text', test_case->>'text',
      'expected', expected_sentiment,
      'calculated', calculated_sentiment,
      'difference', abs(calculated_sentiment - expected_sentiment),
      'accurate', abs(calculated_sentiment - expected_sentiment) <= accuracy_threshold
    );
  END LOOP;
  
  -- Calculate overall accuracy
  overall_accuracy := CASE 
    WHEN total_tests > 0 THEN accurate_tests::NUMERIC / total_tests::NUMERIC 
    ELSE 0.0 
  END;
  
  RETURN jsonb_build_object(
    'total_tests', total_tests,
    'accurate_tests', accurate_tests,
    'overall_accuracy', overall_accuracy,
    'accuracy_percentage', overall_accuracy * 100,
    'meets_target', overall_accuracy >= 0.90, -- 90% accuracy target
    'test_results', results,
    'validation_timestamp', extract(epoch from now())
  );
END;
$$ LANGUAGE plpgsql;

-- Get system performance metrics for SQL-based intelligence
CREATE OR REPLACE FUNCTION get_intelligence_performance_metrics()
RETURNS TABLE(
  metric_name VARCHAR(50),
  current_value NUMERIC,
  target_value NUMERIC,
  status VARCHAR(20),
  timestamp TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  
  -- Sentiment analysis accuracy
  SELECT 
    'sentiment_accuracy'::VARCHAR(50),
    (SELECT AVG((actual_metrics->>'sentiment_accuracy')::NUMERIC) 
     FROM task_tracker_13day 
     WHERE actual_metrics ? 'sentiment_accuracy' 
     AND updated_at > NOW() - INTERVAL '24 hours')::NUMERIC,
    0.90::NUMERIC, -- Target: 90% accuracy
    CASE 
      WHEN (SELECT AVG((actual_metrics->>'sentiment_accuracy')::NUMERIC) 
            FROM task_tracker_13day 
            WHERE actual_metrics ? 'sentiment_accuracy' 
            AND updated_at > NOW() - INTERVAL '24 hours') >= 0.90 
      THEN 'healthy'::VARCHAR(20)
      ELSE 'warning'::VARCHAR(20)
    END,
    NOW()
  
  UNION ALL
  
  -- Trust score average
  SELECT 
    'trust_score_avg'::VARCHAR(50),
    (SELECT AVG(trust_score_delta) 
     FROM cursor_interactions_log 
     WHERE created_at > NOW() - INTERVAL '24 hours' 
     AND trust_score_delta IS NOT NULL)::NUMERIC,
    4.2::NUMERIC, -- Target: >4.2
    CASE 
      WHEN (SELECT AVG(trust_score_delta) 
            FROM cursor_interactions_log 
            WHERE created_at > NOW() - INTERVAL '24 hours' 
            AND trust_score_delta IS NOT NULL) >= 4.2 
      THEN 'healthy'::VARCHAR(20)
      ELSE 'critical'::VARCHAR(20)
    END,
    NOW()
  
  UNION ALL
  
  -- Emotional intelligence processing time
  SELECT 
    'ei_processing_time'::VARCHAR(50),
    (SELECT AVG(response_time_ms) 
     FROM cursor_interactions_log 
     WHERE interaction_type = 'emotional_analysis' 
     AND created_at > NOW() - INTERVAL '1 hour')::NUMERIC,
    100.0::NUMERIC, -- Target: <100ms
    CASE 
      WHEN (SELECT AVG(response_time_ms) 
            FROM cursor_interactions_log 
            WHERE interaction_type = 'emotional_analysis' 
            AND created_at > NOW() - INTERVAL '1 hour') < 100 
      THEN 'healthy'::VARCHAR(20)
      ELSE 'warning'::VARCHAR(20)
    END,
    NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PHASE 5: INTEGRATION FUNCTIONS
-- ============================================================================

-- Process user interaction with full emotional intelligence
CREATE OR REPLACE FUNCTION process_user_interaction(
  user_input TEXT,
  interaction_type VARCHAR(50),
  session_id VARCHAR(255),
  previous_context JSONB DEFAULT '{}'
)
RETURNS JSONB AS $$
DECLARE
  sentiment_analysis JSONB;
  emotional_intelligence JSONB;
  trust_score NUMERIC;
  previous_trust NUMERIC;
  processing_start TIMESTAMPTZ := clock_timestamp();
  processing_time INTEGER;
  result JSONB;
BEGIN
  -- Get previous trust score
  previous_trust := COALESCE(
    (SELECT trust_score_delta FROM cursor_interactions_log 
     WHERE session_id = session_id 
     ORDER BY created_at DESC LIMIT 1), 
    4.0
  );
  
  -- Perform sentiment analysis
  sentiment_analysis := analyze_emotional_intelligence(user_input, interaction_type);
  
  -- Calculate new trust score
  trust_score := calculate_trust_score(
    user_input, 
    previous_context || jsonb_build_object('interaction_type', interaction_type),
    previous_trust
  );
  
  -- Calculate processing time
  processing_time := EXTRACT(EPOCH FROM (clock_timestamp() - processing_start)) * 1000;
  
  -- Build comprehensive result
  result := jsonb_build_object(
    'sentiment_analysis', sentiment_analysis,
    'trust_score', trust_score,
    'trust_delta', trust_score - previous_trust,
    'processing_time_ms', processing_time,
    'session_id', session_id,
    'interaction_type', interaction_type,
    'sacred_reversal_passed', trust_score >= 4.2,
    'emotional_sovereignty_compliant', 
      (sentiment_analysis->>'empowerment_score')::NUMERIC >= 0.6,
    'timestamp', extract(epoch from now())
  );
  
  -- Log the interaction
  INSERT INTO cursor_interactions_log (
    task_id, session_id, interaction_type, prompt_text, success,
    emotional_impact_score, trust_score_delta, user_empowerment_indicator,
    sacred_reversal_test_passed, response_time_ms, context_data
  ) VALUES (
    'intelligence_' || extract(epoch from now())::TEXT,
    session_id,
    interaction_type,
    left(user_input, 500), -- Truncate for storage
    TRUE,
    CASE 
      WHEN (sentiment_analysis->>'overall_emotional_intelligence')::NUMERIC >= 0.8 THEN 5
      WHEN (sentiment_analysis->>'overall_emotional_intelligence')::NUMERIC >= 0.6 THEN 4
      WHEN (sentiment_analysis->>'overall_emotional_intelligence')::NUMERIC >= 0.4 THEN 3
      WHEN (sentiment_analysis->>'overall_emotional_intelligence')::NUMERIC >= 0.2 THEN 2
      ELSE 1
    END,
    trust_score - previous_trust,
    (sentiment_analysis->>'empowerment_score')::NUMERIC >= 0.6,
    trust_score >= 4.2,
    processing_time,
    result
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PHASE 6: TESTING AND VALIDATION SUITE
-- ============================================================================

-- Create test cases for sentiment analysis validation
CREATE OR REPLACE FUNCTION create_sentiment_test_cases()
RETURNS JSONB AS $$
BEGIN
  RETURN '[
    {"text": "This is absolutely amazing and transformative!", "expected_sentiment": 0.9},
    {"text": "I love how empowering this feels", "expected_sentiment": 0.8},
    {"text": "This is okay, nothing special", "expected_sentiment": 0.5},
    {"text": "This is confusing and frustrating", "expected_sentiment": 0.2},
    {"text": "Completely useless and broken", "expected_sentiment": 0.1},
    {"text": "Revolutionary breakthrough in AI", "expected_sentiment": 0.85},
    {"text": "Magical experience that transformed my vision", "expected_sentiment": 0.9},
    {"text": "Reliable and trustworthy system", "expected_sentiment": 0.75},
    {"text": "Disappointing and unreliable", "expected_sentiment": 0.25},
    {"text": "Incredible potential for growth", "expected_sentiment": 0.8}
  ]'::JSONB;
END;
$$ LANGUAGE plpgsql;

-- Run comprehensive intelligence system validation
CREATE OR REPLACE FUNCTION validate_intelligence_system()
RETURNS JSONB AS $$
DECLARE
  test_cases JSONB;
  sentiment_validation JSONB;
  performance_metrics JSONB;
  overall_status VARCHAR(20);
  validation_result JSONB;
BEGIN
  -- Get test cases
  test_cases := create_sentiment_test_cases();
  
  -- Validate sentiment accuracy
  sentiment_validation := validate_sentiment_accuracy(test_cases);
  
  -- Get performance metrics
  SELECT jsonb_agg(
    jsonb_build_object(
      'metric_name', metric_name,
      'current_value', current_value,
      'target_value', target_value,
      'status', status
    )
  ) INTO performance_metrics
  FROM get_intelligence_performance_metrics();
  
  -- Determine overall status
  overall_status := CASE
    WHEN (sentiment_validation->>'meets_target')::BOOLEAN = TRUE 
         AND NOT EXISTS (
           SELECT 1 FROM get_intelligence_performance_metrics() 
           WHERE status = 'critical'
         ) THEN 'healthy'
    WHEN EXISTS (
           SELECT 1 FROM get_intelligence_performance_metrics() 
           WHERE status = 'critical'
         ) THEN 'critical'
    ELSE 'warning'
  END;
  
  -- Build validation result
  validation_result := jsonb_build_object(
    'overall_status', overall_status,
    'sentiment_validation', sentiment_validation,
    'performance_metrics', performance_metrics,
    'validation_timestamp', extract(epoch from now()),
    'meets_90_percent_accuracy', (sentiment_validation->>'meets_target')::BOOLEAN,
    'trust_score_compliant', NOT EXISTS (
      SELECT 1 FROM get_intelligence_performance_metrics() 
      WHERE metric_name = 'trust_score_avg' AND status = 'critical'
    )
  );
  
  RETURN validation_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- DEPLOYMENT AND MONITORING
-- ============================================================================

-- Initialize intelligence system with baseline metrics
CREATE OR REPLACE FUNCTION initialize_intelligence_system()
RETURNS TEXT AS $$
DECLARE
  validation_result JSONB;
  initialization_status TEXT;
BEGIN
  -- Run system validation
  validation_result := validate_intelligence_system();
  
  -- Log initialization
  INSERT INTO cursor_interactions_log (
    interaction_type, prompt_text, success, context_data
  ) VALUES (
    'system_initialization',
    'SQL-based intelligence system initialized',
    (validation_result->>'overall_status')::TEXT = 'healthy',
    validation_result
  );
  
  -- Return status
  initialization_status := 'SQL-based Intelligence System Initialized: ' || 
    (validation_result->>'overall_status')::TEXT || 
    ' | Sentiment Accuracy: ' || 
    ((validation_result->'sentiment_validation'->>'accuracy_percentage')::NUMERIC)::TEXT || '%';
  
  RETURN initialization_status;
END;
$$ LANGUAGE plpgsql;

-- Performance monitoring view for intelligence system
CREATE OR REPLACE VIEW intelligence_system_health AS
SELECT 
  'SQL Intelligence System' as system_name,
  (SELECT overall_status FROM jsonb_to_record(validate_intelligence_system()) 
   AS x(overall_status TEXT)) as health_status,
  (SELECT accuracy_percentage FROM jsonb_to_record(
    (validate_intelligence_system()->'sentiment_validation')
   ) AS x(accuracy_percentage NUMERIC)) as sentiment_accuracy_pct,
  (SELECT current_value FROM get_intelligence_performance_metrics() 
   WHERE metric_name = 'trust_score_avg') as avg_trust_score,
  NOW() as last_check;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION calculate_sentiment_score(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_trust_score(TEXT, JSONB, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION analyze_emotional_intelligence(TEXT, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION process_user_interaction(TEXT, VARCHAR, VARCHAR, JSONB) TO authenticated;
GRANT SELECT ON intelligence_system_health TO authenticated; 