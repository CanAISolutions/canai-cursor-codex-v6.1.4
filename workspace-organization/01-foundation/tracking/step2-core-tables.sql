-- CanAI Step 2: Core Tables for Emotional Sovereignty
-- Sacred Covenant: Essential analytics and trust transparency tables

-- SessionAnalytics: Central Hub
CREATE TABLE session_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255),
    start_time TIMESTAMP NOT NULL DEFAULT NOW(),
    end_time TIMESTAMP,
    duration INTEGER,
    prompt_count INTEGER DEFAULT 0,
    
    -- Trust & Emotional Metrics
    trust_score_before DECIMAL(3,2) CHECK (trust_score_before >= 0 AND trust_score_before <= 5),
    trust_score_after DECIMAL(3,2) CHECK (trust_score_after >= 0 AND trust_score_after <= 5),
    trust_delta DECIMAL(3,2) CHECK (trust_delta >= -5 AND trust_delta <= 5),
    
    -- 5-Axis Emotional Compass
    awe_score DECIMAL(3,2) CHECK (awe_score >= 0 AND awe_score <= 1),
    ownership_score DECIMAL(3,2) CHECK (ownership_score >= 0 AND ownership_score <= 1),
    wonder_score DECIMAL(3,2) CHECK (wonder_score >= 0 AND wonder_score <= 1),
    calm_score DECIMAL(3,2) CHECK (calm_score >= 0 AND calm_score <= 1),
    power_score DECIMAL(3,2) CHECK (power_score >= 0 AND power_score <= 1),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PromptLogs: Universal prompt tracking
CREATE TABLE prompt_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    prompt_type VARCHAR(255) NOT NULL,
    input_fields JSONB NOT NULL,
    output JSONB,
    
    -- Quality metrics
    trust_score DECIMAL(3,2) CHECK (trust_score >= 0 AND trust_score <= 5),
    resonance_score DECIMAL(3,2) CHECK (resonance_score >= 0 AND resonance_score <= 1),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- SparkSplitAnalytics: Trust Transparency Engine
CREATE TABLE sparksplit_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    timestamp BIGINT NOT NULL,
    prompt_type VARCHAR(255),
    comparison_id VARCHAR(255) UNIQUE,
    trust_delta DECIMAL(3,2) CHECK (trust_delta >= -5 AND trust_delta <= 5),
    user_selection VARCHAR(50) CHECK (user_selection IN ('sterile', 'canai', 'both', 'neither', 'skip')),
    
    -- Trust transparency metrics
    competitive_advantage DECIMAL(3,2) CHECK (competitive_advantage >= 0 AND competitive_advantage <= 1),
    trust_transparency_score DECIMAL(3,2) CHECK (trust_transparency_score >= 0 AND trust_transparency_score <= 1),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- UserContext: User intelligence hub
CREATE TABLE user_context (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    name VARCHAR(255),
    total_sessions INTEGER DEFAULT 0,
    
    -- Emotional profile
    emotional_profile JSONB,
    trust_score_current DECIMAL(3,2) CHECK (trust_score_current >= 0 AND trust_score_current <= 5),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE session_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sparksplit_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_context ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allow all for now)
CREATE POLICY "Allow all operations" ON session_analytics FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON prompt_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON sparksplit_analytics FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON user_context FOR ALL USING (true);

-- Verify tables created
SELECT 'Core tables created successfully!' AS status; 