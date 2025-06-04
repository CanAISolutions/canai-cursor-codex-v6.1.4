-- ============================================================================
-- 🗺️ SYSTEM MAP GENERATOR - COMPREHENSIVE SCHEMA EXTRACTION
-- ============================================================================
-- Purpose: Extract complete database schema for system mapping and API access
-- Output: JSON structure with tables, columns, relationships, indexes, functions
-- Usage: SELECT * FROM generate_system_map();

-- Main system map generator function
CREATE OR REPLACE FUNCTION generate_system_map()
RETURNS JSONB AS $$
DECLARE
    system_map JSONB;
    tables_info JSONB;
    relationships_info JSONB;
    indexes_info JSONB;
    functions_info JSONB;
    views_info JSONB;
    summary_info JSONB;
BEGIN
    -- Extract all tables with columns
    SELECT jsonb_object_agg(
        table_name,
        jsonb_build_object(
            'table_name', table_name,
            'table_type', table_type,
            'columns', columns,
            'row_count', COALESCE(row_count, 0),
            'size_bytes', COALESCE(size_bytes, 0)
        )
    ) INTO tables_info
    FROM (
        SELECT 
            t.table_name,
            'BASE TABLE' as table_type,
            jsonb_agg(
                jsonb_build_object(
                    'column_name', c.column_name,
                    'data_type', c.data_type,
                    'is_nullable', c.is_nullable,
                    'column_default', c.column_default,
                    'character_maximum_length', c.character_maximum_length,
                    'ordinal_position', c.ordinal_position
                ) ORDER BY c.ordinal_position
            ) as columns,
            (SELECT reltuples::BIGINT FROM pg_class WHERE relname = t.table_name) as row_count,
            (SELECT pg_total_relation_size(c.oid) FROM pg_class c WHERE c.relname = t.table_name) as size_bytes
        FROM information_schema.tables t
        JOIN information_schema.columns c ON t.table_name = c.table_name
        WHERE t.table_schema = 'public' 
        AND t.table_type = 'BASE TABLE'
        GROUP BY t.table_name
    ) table_details;

    -- Extract foreign key relationships
    SELECT jsonb_agg(
        jsonb_build_object(
            'constraint_name', constraint_name,
            'source_table', table_name,
            'source_column', column_name,
            'target_table', foreign_table_name,
            'target_column', foreign_column_name,
            'relationship_type', 'foreign_key'
        )
    ) INTO relationships_info
    FROM (
        SELECT 
            tc.constraint_name,
            tc.table_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
    ) fk_details;

    -- Extract indexes
    SELECT jsonb_agg(
        jsonb_build_object(
            'index_name', indexname,
            'table_name', tablename,
            'index_definition', indexdef,
            'is_unique', CASE WHEN indexdef LIKE '%UNIQUE%' THEN true ELSE false END,
            'index_type', CASE 
                WHEN indexdef LIKE '%gin%' THEN 'GIN'
                WHEN indexdef LIKE '%gist%' THEN 'GIST' 
                WHEN indexdef LIKE '%hash%' THEN 'HASH'
                WHEN indexdef LIKE '%ivfflat%' THEN 'IVFFLAT'
                ELSE 'BTREE'
            END
        )
    ) INTO indexes_info
    FROM pg_indexes 
    WHERE schemaname = 'public'
    AND indexname NOT LIKE '%_pkey';

    -- Extract functions
    SELECT jsonb_agg(
        jsonb_build_object(
            'function_name', routine_name,
            'return_type', data_type,
            'routine_type', routine_type,
            'language', external_language,
            'is_deterministic', is_deterministic,
            'routine_definition', routine_definition
        )
    ) INTO functions_info
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_type = 'FUNCTION';

    -- Extract views (including rollup views)
    SELECT jsonb_agg(
        jsonb_build_object(
            'view_name', table_name,
            'view_definition', view_definition,
            'is_rollup', CASE WHEN table_name LIKE '%_rollups' THEN true ELSE false END
        )
    ) INTO views_info
    FROM information_schema.views
    WHERE table_schema = 'public';

    -- Generate summary statistics
    SELECT jsonb_build_object(
        'total_tables', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'),
        'total_columns', (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public'),
        'total_relationships', (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = 'public' AND constraint_type = 'FOREIGN KEY'),
        'total_indexes', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'),
        'total_functions', (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public'),
        'total_views', (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public'),
        'sparksplit_tables', (
            SELECT COUNT(*) FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND (table_name LIKE '%sparksplit%' OR table_name LIKE '%competitive%' OR table_name LIKE '%trust_transparency%')
        ),
        'database_size_mb', (
            SELECT ROUND((pg_database_size(current_database()) / 1024.0 / 1024.0)::NUMERIC, 2)
        ),
        'generated_at', NOW()
    ) INTO summary_info;

    -- Combine all information into complete system map
    system_map := jsonb_build_object(
        'database_name', current_database(),
        'schema_version', '6.1.4',
        'deployment_phase', 'Phase 3 Complete',
        'summary', summary_info,
        'tables', COALESCE(tables_info, '{}'),
        'relationships', COALESCE(relationships_info, '[]'),
        'indexes', COALESCE(indexes_info, '[]'),
        'functions', COALESCE(functions_info, '[]'),
        'views', COALESCE(views_info, '[]')
    );

    RETURN system_map;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 🔍 SPECIFIC EXTRACTION FUNCTIONS FOR API ENDPOINTS
-- ============================================================================

-- Get table schema only
CREATE OR REPLACE FUNCTION get_table_schema(target_table TEXT DEFAULT NULL)
RETURNS JSONB AS $$
BEGIN
    IF target_table IS NULL THEN
        -- Return all tables
        RETURN (SELECT jsonb_object_agg(table_name, table_info) FROM (
            SELECT 
                t.table_name,
                jsonb_build_object(
                    'columns', jsonb_agg(
                        jsonb_build_object(
                            'name', c.column_name,
                            'type', c.data_type,
                            'nullable', c.is_nullable = 'YES',
                            'default', c.column_default
                        ) ORDER BY c.ordinal_position
                    )
                ) as table_info
            FROM information_schema.tables t
            JOIN information_schema.columns c ON t.table_name = c.table_name
            WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
            GROUP BY t.table_name
        ) tables);
    ELSE
        -- Return specific table
        RETURN (
            SELECT jsonb_build_object(
                'table_name', target_table,
                'columns', jsonb_agg(
                    jsonb_build_object(
                        'name', column_name,
                        'type', data_type,
                        'nullable', is_nullable = 'YES',
                        'default', column_default
                    ) ORDER BY ordinal_position
                )
            )
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = target_table
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Get relationships only
CREATE OR REPLACE FUNCTION get_relationships()
RETURNS JSONB AS $$
BEGIN
    RETURN (
        SELECT jsonb_agg(
            jsonb_build_object(
                'from_table', table_name,
                'from_column', column_name,
                'to_table', foreign_table_name,
                'to_column', foreign_column_name,
                'constraint_name', constraint_name
            )
        )
        FROM (
            SELECT 
                tc.constraint_name,
                tc.table_name,
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
        ) relationships
    );
END;
$$ LANGUAGE plpgsql;

-- Get SparkSplit specific schema
CREATE OR REPLACE FUNCTION get_sparksplit_schema()
RETURNS JSONB AS $$
BEGIN
    RETURN (
        SELECT jsonb_build_object(
            'tables', jsonb_object_agg(table_name, table_info),
            'total_count', COUNT(*)
        )
        FROM (
            SELECT 
                t.table_name,
                jsonb_build_object(
                    'purpose', CASE 
                        WHEN t.table_name = 'sparksplit_analytics' THEN 'Core comparison analytics'
                        WHEN t.table_name = 'sparksplit_comparisons' THEN 'Individual comparison records'
                        WHEN t.table_name = 'competitive_advantage_metrics' THEN 'Competitive positioning'
                        WHEN t.table_name = 'trust_transparency_metrics' THEN 'Trust transparency tracking'
                        ELSE 'SparkSplit related'
                    END,
                    'columns', jsonb_agg(
                        jsonb_build_object(
                            'name', c.column_name,
                            'type', c.data_type
                        ) ORDER BY c.ordinal_position
                    )
                ) as table_info
            FROM information_schema.tables t
            JOIN information_schema.columns c ON t.table_name = c.table_name
            WHERE t.table_schema = 'public' 
            AND (t.table_name LIKE '%sparksplit%' OR t.table_name LIKE '%competitive%' OR t.table_name LIKE '%trust_transparency%')
            GROUP BY t.table_name
        ) sparksplit_tables
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 🎯 USAGE EXAMPLES AND TESTING
-- ============================================================================

-- Test the main function
-- SELECT generate_system_map();

-- Test specific functions
-- SELECT get_table_schema();
-- SELECT get_table_schema('sparksplit_analytics');
-- SELECT get_relationships();
-- SELECT get_sparksplit_schema();

-- ============================================================================
-- 📝 API ENDPOINT READY QUERIES
-- ============================================================================

/*
API Endpoint Examples:

1. GET /api/schema/complete
   Query: SELECT generate_system_map();

2. GET /api/schema/tables
   Query: SELECT get_table_schema();

3. GET /api/schema/tables/{table_name}
   Query: SELECT get_table_schema('table_name');

4. GET /api/schema/relationships
   Query: SELECT get_relationships();

5. GET /api/schema/sparksplit
   Query: SELECT get_sparksplit_schema();

6. GET /api/schema/summary
   Query: SELECT jsonb_extract_path(generate_system_map(), 'summary');
*/ 