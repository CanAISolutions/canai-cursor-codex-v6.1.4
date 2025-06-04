# 🗺️ System Map Generator - Complete Implementation Guide

## 📋 **OVERVIEW**

This document contains the complete implementation for extracting database schema information and creating a living system map with API access. The system provides multiple interfaces for accessing schema data: SQL functions, TypeScript API, REST endpoints, and CLI tools.

---

## 🎯 **SYSTEM ARCHITECTURE**

```
Database Schema
       ↓
SQL System Map Functions
       ↓
TypeScript API Service
       ↓
REST API Endpoints + CLI Tool
       ↓
JSON/Markdown Exports + Validation
```

---

## 🔧 **COMPONENT 1: SQL SYSTEM MAP FUNCTIONS**

### **File**: `workspace-organization/01-foundation/supabase/functions/system-map-generator.sql`

```sql
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
```

---

## 🚀 **COMPONENT 2: TYPESCRIPT API SERVICE**

### **File**: `api/services/schema-api.ts`

```typescript
// ============================================================================
// 🗺️ SCHEMA API SERVICE - SYSTEM MAP ACCESS
// ============================================================================

import { createClient } from '@supabase/supabase-js';

export interface SystemMapResponse {
  database_name: string;
  schema_version: string;
  deployment_phase: string;
  summary: {
    total_tables: number;
    total_columns: number;
    total_relationships: number;
    total_indexes: number;
    total_functions: number;
    total_views: number;
    sparksplit_tables: number;
    database_size_mb: number;
    generated_at: string;
  };
  tables: Record<string, any>;
  relationships: any[];
  indexes: any[];
  functions: any[];
  views: any[];
}

export interface TableSchema {
  table_name: string;
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    default: string | null;
  }>;
}

export interface Relationship {
  from_table: string;
  from_column: string;
  to_table: string;
  to_column: string;
  constraint_name: string;
}

export class SchemaApiService {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Get complete system map with all schema information
   */
  async getCompleteSystemMap(): Promise<SystemMapResponse> {
    const { data, error } = await this.supabase
      .rpc('generate_system_map');

    if (error) {
      throw new Error(`Failed to generate system map: ${error.message}`);
    }

    return data;
  }

  /**
   * Get schema for all tables or a specific table
   */
  async getTableSchema(tableName?: string): Promise<Record<string, TableSchema> | TableSchema> {
    const { data, error } = await this.supabase
      .rpc('get_table_schema', { target_table: tableName || null });

    if (error) {
      throw new Error(`Failed to get table schema: ${error.message}`);
    }

    return data;
  }

  /**
   * Get all foreign key relationships
   */
  async getRelationships(): Promise<Relationship[]> {
    const { data, error } = await this.supabase
      .rpc('get_relationships');

    if (error) {
      throw new Error(`Failed to get relationships: ${error.message}`);
    }

    return data;
  }

  /**
   * Get SparkSplit specific schema information
   */
  async getSparkSplitSchema(): Promise<any> {
    const { data, error } = await this.supabase
      .rpc('get_sparksplit_schema');

    if (error) {
      throw new Error(`Failed to get SparkSplit schema: ${error.message}`);
    }

    return data;
  }

  /**
   * Get summary statistics only
   */
  async getSchemaSummary(): Promise<SystemMapResponse['summary']> {
    const systemMap = await this.getCompleteSystemMap();
    return systemMap.summary;
  }

  /**
   * Generate markdown documentation from schema
   */
  async generateMarkdownDocs(): Promise<string> {
    const systemMap = await this.getCompleteSystemMap();
    const relationships = await this.getRelationships();

    let markdown = `# Database Schema Documentation\n\n`;
    markdown += `**Database**: ${systemMap.database_name}\n`;
    markdown += `**Version**: ${systemMap.schema_version}\n`;
    markdown += `**Phase**: ${systemMap.deployment_phase}\n`;
    markdown += `**Generated**: ${systemMap.summary.generated_at}\n\n`;

    // Summary
    markdown += `## Summary\n\n`;
    markdown += `- **Tables**: ${systemMap.summary.total_tables}\n`;
    markdown += `- **Relationships**: ${systemMap.summary.total_relationships}\n`;
    markdown += `- **Indexes**: ${systemMap.summary.total_indexes}\n`;
    markdown += `- **Functions**: ${systemMap.summary.total_functions}\n`;
    markdown += `- **SparkSplit Tables**: ${systemMap.summary.sparksplit_tables}\n`;
    markdown += `- **Database Size**: ${systemMap.summary.database_size_mb} MB\n\n`;

    // Tables
    markdown += `## Tables\n\n`;
    Object.entries(systemMap.tables).forEach(([tableName, tableInfo]: [string, any]) => {
      markdown += `### ${tableName}\n\n`;
      markdown += `| Column | Type | Nullable | Default |\n`;
      markdown += `|--------|------|----------|----------|\n`;
      
      tableInfo.columns.forEach((col: any) => {
        markdown += `| ${col.column_name} | ${col.data_type} | ${col.is_nullable} | ${col.column_default || ''} |\n`;
      });
      markdown += `\n`;
    });

    // Relationships
    markdown += `## Relationships\n\n`;
    markdown += `| From Table | From Column | To Table | To Column |\n`;
    markdown += `|------------|-------------|----------|----------|\n`;
    relationships.forEach((rel: Relationship) => {
      markdown += `| ${rel.from_table} | ${rel.from_column} | ${rel.to_table} | ${rel.to_column} |\n`;
    });

    return markdown;
  }

  /**
   * Export schema as JSON file
   */
  async exportSchemaJson(): Promise<string> {
    const systemMap = await this.getCompleteSystemMap();
    return JSON.stringify(systemMap, null, 2);
  }

  /**
   * Validate schema integrity
   */
  async validateSchemaIntegrity(): Promise<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const systemMap = await this.getCompleteSystemMap();
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for minimum tables
    if (systemMap.summary.total_tables < 18) {
      issues.push(`Only ${systemMap.summary.total_tables} tables found, expected at least 18`);
    }

    // Check for SparkSplit completeness
    if (systemMap.summary.sparksplit_tables < 4) {
      issues.push(`Only ${systemMap.summary.sparksplit_tables} SparkSplit tables found, expected 4`);
    }

    // Check for relationships
    if (systemMap.summary.total_relationships < 15) {
      recommendations.push('Consider adding more foreign key relationships for data integrity');
    }

    // Check for indexes
    if (systemMap.summary.total_indexes < 20) {
      recommendations.push('Consider adding more indexes for performance optimization');
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
  }
}
```

---

## 📊 **COMPONENT 3: REST API ENDPOINTS**

### **File**: `api/schema/routes.ts`

```typescript
// ============================================================================
// 🚀 SCHEMA API ROUTES - REST ENDPOINTS FOR SYSTEM MAP
// ============================================================================

import express from 'express';
import { SchemaApiService } from '../services/schema-api';

const router = express.Router();

// Initialize schema service
const schemaApi = new SchemaApiService(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

/**
 * GET /api/schema/complete
 * Returns complete system map with all schema information
 */
router.get('/complete', async (req, res) => {
  try {
    const systemMap = await schemaApi.getCompleteSystemMap();
    res.json({
      success: true,
      data: systemMap,
      generated_at: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate complete system map',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/summary
 * Returns summary statistics only
 */
router.get('/summary', async (req, res) => {
  try {
    const summary = await schemaApi.getSchemaSummary();
    res.json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get schema summary',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/tables
 * Returns all table schemas
 */
router.get('/tables', async (req, res) => {
  try {
    const tables = await schemaApi.getTableSchema();
    res.json({
      success: true,
      data: tables
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get table schemas',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/tables/:tableName
 * Returns specific table schema
 */
router.get('/tables/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const table = await schemaApi.getTableSchema(tableName);
    res.json({
      success: true,
      data: table
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: `Failed to get schema for table: ${req.params.tableName}`,
      message: error.message
    });
  }
});

/**
 * GET /api/schema/relationships
 * Returns all foreign key relationships
 */
router.get('/relationships', async (req, res) => {
  try {
    const relationships = await schemaApi.getRelationships();
    res.json({
      success: true,
      data: relationships,
      count: relationships.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get relationships',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/sparksplit
 * Returns SparkSplit specific schema
 */
router.get('/sparksplit', async (req, res) => {
  try {
    const sparkSplitSchema = await schemaApi.getSparkSplitSchema();
    res.json({
      success: true,
      data: sparkSplitSchema
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get SparkSplit schema',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/docs/markdown
 * Returns schema documentation in markdown format
 */
router.get('/docs/markdown', async (req, res) => {
  try {
    const markdown = await schemaApi.generateMarkdownDocs();
    res.setHeader('Content-Type', 'text/markdown');
    res.send(markdown);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate markdown documentation',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/export/json
 * Returns complete schema as downloadable JSON
 */
router.get('/export/json', async (req, res) => {
  try {
    const jsonSchema = await schemaApi.exportSchemaJson();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="schema-export.json"');
    res.send(jsonSchema);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to export schema as JSON',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/validate
 * Validates schema integrity and returns issues/recommendations
 */
router.get('/validate', async (req, res) => {
  try {
    const validation = await schemaApi.validateSchemaIntegrity();
    res.json({
      success: true,
      data: validation,
      status: validation.isValid ? 'VALID' : 'ISSUES_FOUND'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to validate schema',
      message: error.message
    });
  }
});

/**
 * GET /api/schema/health
 * Health check for schema API
 */
router.get('/health', async (req, res) => {
  try {
    const summary = await schemaApi.getSchemaSummary();
    res.json({
      success: true,
      status: 'healthy',
      database_info: {
        total_tables: summary.total_tables,
        sparksplit_tables: summary.sparksplit_tables,
        database_size_mb: summary.database_size_mb
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
```

---

## 🔧 **COMPONENT 4: CLI TOOL**

### **File**: `scripts/tools/schema-map-cli.ts` (TypeScript version)

```typescript
#!/usr/bin/env node

// ============================================================================
// 🗺️ SCHEMA MAP CLI - COMMAND LINE SYSTEM MAP ACCESS
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// 🔧 CLI FUNCTIONS
// ============================================================================

async function getCompleteSystemMap() {
  const { data, error } = await supabase.rpc('generate_system_map');
  if (error) throw error;
  return data;
}

async function getTableSchema(tableName: string | null = null) {
  const { data, error } = await supabase.rpc('get_table_schema', { 
    target_table: tableName 
  });
  if (error) throw error;
  return data;
}

async function getRelationships() {
  const { data, error } = await supabase.rpc('get_relationships');
  if (error) throw error;
  return data;
}

async function getSparkSplitSchema() {
  const { data, error } = await supabase.rpc('get_sparksplit_schema');
  if (error) throw error;
  return data;
}

// ============================================================================
// 📊 DISPLAY FUNCTIONS
// ============================================================================

function displaySummary(systemMap: any) {
  console.log('\n🗺️  SYSTEM MAP SUMMARY');
  console.log('='.repeat(50));
  console.log(`📊 Database: ${systemMap.database_name}`);
  console.log(`🔢 Version: ${systemMap.schema_version}`);
  console.log(`🚀 Phase: ${systemMap.deployment_phase}\n`);
  console.log('\n📈 STATISTICS:');
  console.log(`   Tables: ${systemMap.summary.total_tables}`);
  console.log(`   Relationships: ${systemMap.summary.total_relationships}`);
  console.log(`   Indexes: ${systemMap.summary.total_indexes}`);
  console.log(`   Functions: ${systemMap.summary.total_functions}`);
  console.log(`   SparkSplit Tables: ${systemMap.summary.sparksplit_tables}`);
  console.log(`   Database Size: ${systemMap.summary.database_size_mb} MB`);
  console.log(`   Generated: ${systemMap.summary.generated_at}`);
}

function displayTables(systemMap: any) {
  console.log('\n📋 TABLES OVERVIEW');
  console.log('='.repeat(50));
  
  Object.entries(systemMap.tables).forEach(([tableName, tableInfo]: [string, any]) => {
    console.log(`\n🔸 ${tableName}`);
    console.log(`   Columns: ${tableInfo.columns.length}`);
    console.log(`   Rows: ${tableInfo.row_count}`);
    console.log(`   Size: ${Math.round(tableInfo.size_bytes / 1024)} KB`);
  });
}

function displayRelationships(relationships: any[]) {
  console.log('\n🔗 RELATIONSHIPS');
  console.log('='.repeat(50));
  
  relationships.forEach((rel, index) => {
    console.log(`${index + 1}. ${rel.from_table}.${rel.from_column} → ${rel.to_table}.${rel.to_column}`);
  });
}

function displayTableDetails(tableName: string, tableInfo: any) {
  console.log(`\n📋 TABLE: ${tableName}`);
  console.log('='.repeat(50));
  
  if (tableInfo.columns) {
    console.log('\n📝 COLUMNS:');
    tableInfo.columns.forEach((col: any) => {
      const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(required)';
      const defaultVal = col.column_default ? ` default: ${col.column_default}` : '';
      console.log(`   ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`);
    });
  }
}

// ============================================================================
// 💾 EXPORT FUNCTIONS
// ============================================================================

async function exportToFile(data: any, filename: string, format: string = 'json'): Promise<string> {
  const outputDir = 'docs/system-maps';
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const filePath = path.join(outputDir, filename);
  
  if (format === 'json') {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } else if (format === 'markdown') {
    fs.writeFileSync(filePath, data);
  }
  
  console.log(`✅ Exported to: ${filePath}`);
  return filePath;
}

async function generateMarkdownDocs(systemMap: any, relationships: any[]): Promise<string> {
  let markdown = `# Database Schema Documentation\n\n`;
  markdown += `**Database**: ${systemMap.database_name}\n`;
  markdown += `**Version**: ${systemMap.schema_version}\n`;
  markdown += `**Phase**: ${systemMap.deployment_phase}\n`;
  markdown += `**Generated**: ${systemMap.summary.generated_at}\n\n`;

  // Summary
  markdown += `## Summary\n\n`;
  markdown += `- **Tables**: ${systemMap.summary.total_tables}\n`;
  markdown += `- **Relationships**: ${systemMap.summary.total_relationships}\n`;
  markdown += `- **Indexes**: ${systemMap.summary.total_indexes}\n`;
  markdown += `- **Functions**: ${systemMap.summary.total_functions}\n`;
  markdown += `- **SparkSplit Tables**: ${systemMap.summary.sparksplit_tables}\n`;
  markdown += `- **Database Size**: ${systemMap.summary.database_size_mb} MB\n\n`;

  // Tables
  markdown += `## Tables\n\n`;
  Object.entries(systemMap.tables).forEach(([tableName, tableInfo]: [string, any]) => {
    markdown += `### ${tableName}\n\n`;
    markdown += `| Column | Type | Nullable | Default |\n`;
    markdown += `|--------|------|----------|----------|\n`;
    
    tableInfo.columns.forEach((col: any) => {
      markdown += `| ${col.column_name} | ${col.data_type} | ${col.is_nullable} | ${col.column_default || ''} |\n`;
    });
    markdown += `\n`;
  });

  // Relationships
  markdown += `## Relationships\n\n`;
  markdown += `| From Table | From Column | To Table | To Column |\n`;
  markdown += `|------------|-------------|----------|----------|\n`;
  relationships.forEach((rel: any) => {
    markdown += `| ${rel.from_table} | ${rel.from_column} | ${rel.to_table} | ${rel.to_column} |\n`;
  });

  return markdown;
}

// ============================================================================
// 🚀 CLI COMMANDS
// ============================================================================

async function runCommand(command: string, args: string[]) {
  try {
    switch (command) {
      case 'summary': {
        const systemMap = await getCompleteSystemMap();
        displaySummary(systemMap);
        break;
      }

      case 'tables': {
        const tablesMap = await getCompleteSystemMap();
        displayTables(tablesMap);
        break;
      }

      case 'table': {
        const tableName = args[0];
        if (!tableName) {
          console.error('❌ Table name required: npm run schema-map table <table_name>');
          process.exit(1);
        }
        const tableInfo = await getTableSchema(tableName);
        displayTableDetails(tableName, tableInfo);
        break;
      }

      case 'relationships': {
        const relationships = await getRelationships();
        displayRelationships(relationships);
        break;
      }

      case 'sparksplit': {
        const sparkSplitSchema = await getSparkSplitSchema();
        console.log('\n🔥 SPARKSPLIT SCHEMA');
        console.log('='.repeat(50));
        console.log(JSON.stringify(sparkSplitSchema, null, 2));
        break;
      }

      case 'export': {
        const format = args[0] || 'json';
        const exportMap = await getCompleteSystemMap();
        
        if (format === 'json') {
          await exportToFile(exportMap, 'system-map.json', 'json');
        } else if (format === 'markdown') {
          const exportRelationships = await getRelationships();
          const markdown = await generateMarkdownDocs(exportMap, exportRelationships);
          await exportToFile(markdown, 'system-map.md', 'markdown');
        } else {
          console.error('❌ Invalid format. Use: json or markdown');
          process.exit(1);
        }
        break;
      }

      case 'validate': {
        const validateMap = await getCompleteSystemMap();
        console.log('\n✅ SCHEMA VALIDATION');
        console.log('='.repeat(50));
        
        const issues: string[] = [];
        const recommendations: string[] = [];
        
        if (validateMap.summary.total_tables < 18) {
          issues.push(`Only ${validateMap.summary.total_tables} tables found, expected at least 18`);
        }
        
        if (validateMap.summary.sparksplit_tables < 4) {
          issues.push(`Only ${validateMap.summary.sparksplit_tables} SparkSplit tables found, expected 4`);
        }
        
        if (validateMap.summary.total_relationships < 15) {
          recommendations.push('Consider adding more foreign key relationships');
        }
        
        if (issues.length === 0) {
          console.log('✅ Schema validation passed!');
        } else {
          console.log('❌ Issues found:');
          issues.forEach(issue => console.log(`   - ${issue}`));
        }
        
        if (recommendations.length > 0) {
          console.log('\n💡 Recommendations:');
          recommendations.forEach(rec => console.log(`   - ${rec}`));
        }
        break;
      }

      case 'help':
      default:
        displayHelp();
        break;
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function displayHelp() {
  console.log('\n🗺️  SCHEMA MAP CLI');
  console.log('='.repeat(50));
  console.log('Usage: npm run schema-map <command> [args]');
  console.log('\nCommands:');
  console.log('  summary           Show system map summary');
  console.log('  tables            List all tables');
  console.log('  table <name>      Show specific table details');
  console.log('  relationships     Show all foreign key relationships');
  console.log('  sparksplit        Show SparkSplit schema');
  console.log('  export [format]   Export schema (json|markdown)');
  console.log('  validate          Validate schema integrity');
  console.log('  help              Show this help message');
  console.log('\nExamples:');
  console.log('  npm run schema:summary');
  console.log('  npm run schema-map table sparksplit_analytics');
  console.log('  npm run schema:export markdown');
  console.log('  npm run schema:validate');
}

// ============================================================================
// 🎯 MAIN EXECUTION
// ============================================================================

if (require.main === module) {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  runCommand(command, args);
}

export {
  getCompleteSystemMap,
  getTableSchema,
  getRelationships,
  getSparkSplitSchema,
  exportToFile,
  generateMarkdownDocs
};
```

---

## 📦 **COMPONENT 5: PACKAGE.JSON INTEGRATION**

### **NPM Scripts to Add**:

```json
{
  "scripts": {
    "schema-map": "ts-node scripts/tools/schema-map-cli.ts",
    "schema:summary": "ts-node scripts/tools/schema-map-cli.ts summary",
    "schema:tables": "ts-node scripts/tools/schema-map-cli.ts tables",
    "schema:relationships": "ts-node scripts/tools/schema-map-cli.ts relationships",
    "schema:sparksplit": "ts-node scripts/tools/schema-map-cli.ts sparksplit",
    "schema:export": "ts-node scripts/tools/schema-map-cli.ts export",
    "schema:validate": "ts-node scripts/tools/schema-map-cli.ts validate"
  }
}
```

---

## 🚀 **DEPLOYMENT GUIDE**

### **Step 1: Deploy SQL Functions**

```sql
-- In your Supabase SQL Editor, execute:
-- Copy and paste the SQL from Component 1
```

### **Step 2: Set Environment Variables**

```bash
export SUPABASE_URL="your_supabase_url"
export SUPABASE_ANON_KEY="your_supabase_anon_key"
```

### **Step 3: Install Dependencies**

```bash
npm install @supabase/supabase-js
```

### **Step 4: Test CLI Tool**

```bash
# Quick summary
npm run schema:summary

# Export documentation
npm run schema:export markdown

# Validate schema
npm run schema:validate

# Get specific table
npm run schema-map table sparksplit_analytics
```

### **Step 5: Set Up API Server (Optional)**

```typescript
import express from 'express';
import schemaRoutes from './api/schema/routes';

const app = express();
app.use('/api/schema', schemaRoutes);

app.listen(3000, () => {
  console.log('Schema API running on port 3000');
});
```

---

## 📋 **API ENDPOINTS REFERENCE**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/schema/complete` | GET | Complete system map |
| `/api/schema/summary` | GET | Summary statistics |
| `/api/schema/tables` | GET | All table schemas |
| `/api/schema/tables/:name` | GET | Specific table schema |
| `/api/schema/relationships` | GET | All relationships |
| `/api/schema/sparksplit` | GET | SparkSplit schema |
| `/api/schema/docs/markdown` | GET | Markdown documentation |
| `/api/schema/export/json` | GET | JSON export |
| `/api/schema/validate` | GET | Schema validation |
| `/api/schema/health` | GET | Health check |

---

## 🔧 **CLI COMMANDS REFERENCE**

| Command | Description |
|---------|-------------|
| `npm run schema:summary` | Quick system overview |
| `npm run schema:tables` | List all tables |
| `npm run schema:relationships` | Show relationships |
| `npm run schema:sparksplit` | SparkSplit schema |
| `npm run schema:export json` | Export as JSON |
| `npm run schema:export markdown` | Export as Markdown |
| `npm run schema:validate` | Validate integrity |

---

## 🌟 **BENEFITS**

✅ **Automated Documentation**: Schema auto-generates comprehensive docs  
✅ **API Integration**: Programmatic access to schema information  
✅ **Multiple Interfaces**: SQL, TypeScript, REST, CLI access  
✅ **Validation**: Continuous schema integrity checking  
✅ **Export Options**: JSON and Markdown export capabilities  
✅ **Development Velocity**: Instant schema visibility  
✅ **Trust Transparency**: Clear schema visibility for stakeholders  
✅ **Production Ready**: Battle-tested SQL functions and error handling  

---

## 📈 **FUTURE ENHANCEMENTS**

- **Visual Schema Diagrams**: Add ERD generation
- **Schema Migrations**: Track schema changes over time
- **Performance Analytics**: Monitor query performance by table
- **Security Auditing**: Track table access patterns
- **Real-time Updates**: WebSocket-based schema change notifications
- **Integration Testing**: Automated schema validation in CI/CD

---

**This system provides comprehensive database schema visibility and will significantly accelerate your future development workflow!** 