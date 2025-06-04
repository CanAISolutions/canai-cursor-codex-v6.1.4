-- Foreign Key Constraints for SparkSplit Schema
-- Links SparkSplit tables to main CanAI schema

-- Add foreign key constraints for sparksplit_comparisons
ALTER TABLE sparksplit_comparisons 
ADD CONSTRAINT fk_sparksplit_comparisons_session 
FOREIGN KEY (session_id) REFERENCES session_analytics(session_id)
ON DELETE CASCADE;

ALTER TABLE sparksplit_comparisons 
ADD CONSTRAINT fk_sparksplit_comparisons_prompt_type 
FOREIGN KEY (prompt_type) REFERENCES prompt_types(prompt_type)
ON DELETE RESTRICT;

-- Note: sparksplit_analytics table structure confirmed to only have date_bucket and prompt_type
-- No session_id column exists, so no foreign key constraint needed

-- Validation query
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name LIKE 'sparksplit%' 
    AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, tc.constraint_name;

SELECT 'SparkSplit foreign key constraints added successfully' as status; 