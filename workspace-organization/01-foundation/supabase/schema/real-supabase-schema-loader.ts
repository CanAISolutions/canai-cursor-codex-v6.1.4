/**
 * real-supabase-schema-loader.ts
 * 
 * Loads and provides access to the Supabase schema data
 * from supabase-schema.json
 * 
 * Part of the Truth-Based Integration System
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Interface definitions
export interface ColumnSchema {
  type: string;
  nullable: boolean;
  default?: string;
  foreignKey?: string;
  description?: string;
  range?: [number, number];
  enum?: string[];
}

export interface TableSchema {
  primaryKey: string;
  description: string;
  emotionalImpact?: string;
  columns: Record<string, ColumnSchema>;
  relationships: {
    belongsTo?: Array<{ table: string; key: string; reference: string }>;
    hasMany?: Array<{ table: string; key: string; reference: string }>;
  };
}

export interface SupabaseSchema {
  version: string;
  lastUpdated: string;
  tables: Record<string, TableSchema>;
}

/**
 * Loads and provides access to the Supabase schema
 */
export class SupabaseSchemaLoader {
  private schema: SupabaseSchema | null = null;
  private schemaPath: string;
  
  /**
   * Creates a new SupabaseSchemaLoader
   * 
   * @param schemaPath Path to the schema JSON file
   */
  constructor(schemaPath: string = '../supabase-schema.json') {
    this.schemaPath = schemaPath;
  }
  
  /**
   * Loads the Supabase schema from the JSON file
   * 
   * @returns A promise that resolves when the schema is loaded
   */
  async loadSchema(): Promise<void> {
    try {
      // In a real implementation, this would be an async file read
      const schemaJson = readFileSync(join(__dirname, this.schemaPath), 'utf8');
      this.schema = JSON.parse(schemaJson);
      
      console.log(`Loaded Supabase schema version ${this.schema?.version} with ${this.getTableCount()} tables`);
    } catch (error) {
      console.error('Error loading Supabase schema:', error);
      
      // Create a minimal schema for testing
      this.schema = {
        version: '1.0.0-demo',
        lastUpdated: new Date().toISOString(),
        tables: this.createDemoTables()
      };
      
      console.log('Created demo Supabase schema');
    }
  }
  
  /**
   * Gets a table by name
   * 
   * @param name Table name
   * @returns The table schema or null if not found
   */
  getTable(name: string): TableSchema | null {
    if (!this.schema) return null;
    return this.schema.tables[name] || null;
  }
  
  /**
   * Gets all tables
   * 
   * @returns All tables in the schema
   */
  getAllTables(): Record<string, TableSchema> {
    if (!this.schema) return {};
    return this.schema.tables;
  }
  
  /**
   * Gets the number of tables in the schema
   * 
   * @returns The number of tables
   */
  getTableCount(): number {
    if (!this.schema) return 0;
    return Object.keys(this.schema.tables).length;
  }
  
  /**
   * Creates demo tables for testing
   * 
   * @returns A record of demo tables
   */
  private createDemoTables(): Record<string, TableSchema> {
    return {
      'prompt_logs': {
        primaryKey: 'id',
        description: 'Stores prompt usage and performance data',
        emotionalImpact: 'Preserves user trust through data integrity',
        columns: {
          'id': {
            type: 'uuid',
            nullable: false,
            default: 'uuid_generate_v4()',
            description: 'Primary key'
          },
          'user_id': {
            type: 'uuid',
            nullable: false,
            foreignKey: 'users.id',
            description: 'Reference to the user'
          },
          'prompt_type': {
            type: 'varchar',
            nullable: false,
            description: 'Type of prompt'
          },
          'input_content': {
            type: 'text',
            nullable: false,
            description: 'User input content'
          },
          'output_content': {
            type: 'text',
            nullable: false,
            description: 'Generated output content'
          },
          'trust_score': {
            type: 'numeric',
            nullable: false,
            range: [0, 5],
            description: 'Trust score for the prompt'
          },
          'resonance_score': {
            type: 'numeric',
            nullable: true,
            range: [0, 5],
            description: 'Emotional resonance score'
          },
          'emotional_fingerprint': {
            type: 'jsonb',
            nullable: true,
            description: 'Emotional fingerprint data'
          },
          'timestamp': {
            type: 'timestamptz',
            nullable: false,
            default: 'now()',
            description: 'When the prompt was created'
          },
          'created_at': {
            type: 'timestamptz',
            nullable: false,
            default: 'now()',
            description: 'Record creation timestamp'
          },
          'updated_at': {
            type: 'timestamptz',
            nullable: false,
            default: 'now()',
            description: 'Record update timestamp'
          }
        },
        relationships: {
          belongsTo: [
            { table: 'users', key: 'user_id', reference: 'id' }
          ],
          hasMany: [
            { table: 'goldmine_output', key: 'id', reference: 'prompt_log_id' }
          ]
        }
      },
      'goldmine_output': {
        primaryKey: 'id',
        description: 'Stores valuable content insights from prompts',
        emotionalImpact: 'Amplifies user confidence through knowledge extraction',
        columns: {
          'id': {
            type: 'uuid',
            nullable: false,
            default: 'uuid_generate_v4()',
            description: 'Primary key'
          },
          'prompt_log_id': {
            type: 'uuid',
            nullable: false,
            foreignKey: 'prompt_logs.id',
            description: 'Reference to the prompt log'
          },
          'insight_type': {
            type: 'varchar',
            nullable: false,
            description: 'Type of insight'
          },
          'insight_content': {
            type: 'text',
            nullable: false,
            description: 'Valuable insight content'
          },
          'trust_score': {
            type: 'numeric',
            nullable: false,
            range: [0, 5],
            description: 'Trust score for the insight'
          },
          'timestamp': {
            type: 'timestamptz',
            nullable: false,
            default: 'now()',
            description: 'When the insight was created'
          },
          'created_at': {
            type: 'timestamptz',
            nullable: false,
            default: 'now()',
            description: 'Record creation timestamp'
          },
          'updated_at': {
            type: 'timestamptz',
            nullable: false,
            default: 'now()',
            description: 'Record update timestamp'
          }
        },
        relationships: {
          belongsTo: [
            { table: 'prompt_logs', key: 'prompt_log_id', reference: 'id' }
          ]
        }
      }
    };
  }
} 