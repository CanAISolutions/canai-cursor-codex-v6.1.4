-- CanAI Step 2: Simple Core Tables (No RLS)
-- Sacred Covenant: Essential analytics tables without security policies

-- SessionAnalytics: Central Hub
CREATE TABLE session_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255),
    start_time TIMESTAMP NOT NULL DEFAULT NOW(),
    trust_score_before DECIMAL(3,2),
    trust_score_after DECIMAL(3,2),
    trust_delta DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW()
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
    trust_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- SparkSplitAnalytics: Trust Transparency Engine
CREATE TABLE sparksplit_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    timestamp BIGINT NOT NULL,
    comparison_id VARCHAR(255) UNIQUE,
    trust_delta DECIMAL(3,2),
    user_selection VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- UserContext: User intelligence hub
CREATE TABLE user_context (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    name VARCHAR(255),
    total_sessions INTEGER DEFAULT 0,
    emotional_profile JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Verify tables created
SELECT 'Simple tables created successfully!' AS status; 