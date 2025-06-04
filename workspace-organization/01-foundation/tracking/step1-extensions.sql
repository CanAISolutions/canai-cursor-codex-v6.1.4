-- CanAI Step 1: Enable Required Extensions
-- Sacred Covenant: Foundation setup for emotional sovereignty database

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Verify extensions
SELECT 'Extensions enabled successfully!' AS status; 