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

// ============================================================================
// 🚀 USAGE EXAMPLES
// ============================================================================

/*
// Initialize the service
const schemaApi = new SchemaApiService(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Get complete system map
const systemMap = await schemaApi.getCompleteSystemMap();

// Get specific table schema
const userContextSchema = await schemaApi.getTableSchema('user_context');

// Get all relationships
const relationships = await schemaApi.getRelationships();

// Get SparkSplit schema
const sparkSplitSchema = await schemaApi.getSparkSplitSchema();

// Generate documentation
const docs = await schemaApi.generateMarkdownDocs();

// Validate schema
const validation = await schemaApi.validateSchemaIntegrity();
*/ 