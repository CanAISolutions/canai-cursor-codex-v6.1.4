/**
 * real-truth-mapping-engine.ts
 * 
 * Core engine that orchestrates the Truth-Based Integration System
 * connecting interface catalog with database schemas through
 * Make.com scenarios and webhook handlers
 * 
 * Part of the Truth-Based Integration System
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { InterfaceCatalogLoader, InterfaceCatalogEntry } from './real-interface-catalog-loader';
import { SupabaseSchemaLoader, TableSchema } from './real-supabase-schema-loader';
import { FieldMapper, FieldMapping } from './real-field-mapper';
import { MakeComScenarioBuilder, MakeComScenario } from './real-makecom-scenario-builder';
import { WebhookHandlerGenerator } from './real-webhook-handler-generator';

/**
 * Represents a mapping between an interface and a database table
 */
export interface InterfaceToTableMapping {
  interfaceName: string;
  interfaceData: InterfaceCatalogEntry;
  tableName: string;
  tableSchema: TableSchema;
  fieldMappings: FieldMapping[];
  makecomScenario?: MakeComScenario;
  webhookHandlerCode?: string;
  trustScore: number;
  emotionalSovereignty: boolean;
}

/**
 * Main engine for the Truth-Based Integration System
 */
export class TruthMappingEngine {
  private interfaceCatalogLoader: InterfaceCatalogLoader;
  private supabaseSchemaLoader: SupabaseSchemaLoader;
  private fieldMapper: FieldMapper;
  private makecomScenarioBuilder: MakeComScenarioBuilder;
  private webhookHandlerGenerator: WebhookHandlerGenerator;
  private outputDir: string;
  private mappings: InterfaceToTableMapping[] = [];
  
  /**
   * Creates a new TruthMappingEngine
   * 
   * @param outputDir Directory for output files
   */
  constructor(outputDir: string = './output') {
    this.interfaceCatalogLoader = new InterfaceCatalogLoader();
    this.supabaseSchemaLoader = new SupabaseSchemaLoader();
    this.fieldMapper = new FieldMapper();
    this.makecomScenarioBuilder = new MakeComScenarioBuilder();
    this.webhookHandlerGenerator = new WebhookHandlerGenerator();
    this.outputDir = outputDir;
  }
  
  /**
   * Initializes the engine by loading catalog and schemas
   */
  async initialize(): Promise<void> {
    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });
    
    // Load the interface catalog and database schema
    await this.interfaceCatalogLoader.loadCatalog();
    await this.supabaseSchemaLoader.loadSchema();
    
    console.log(`Truth Mapping Engine initialized with output directory: ${this.outputDir}`);
    console.log(`Loaded ${this.interfaceCatalogLoader.getInterfaceCount()} interfaces`);
    console.log(`Loaded ${this.supabaseSchemaLoader.getTableCount()} database tables`);
  }
  
  /**
   * Maps a single interface to a database table, generating all artifacts
   * 
   * @param interfaceName Name of the interface to map
   * @returns The mapping with all generated artifacts
   */
  async mapInterface(interfaceName: string): Promise<InterfaceToTableMapping | null> {
    console.log(`Mapping interface: ${interfaceName}`);
    
    // Get the interface data
    const interfaceData = this.interfaceCatalogLoader.getInterface(interfaceName);
    if (!interfaceData) {
      console.error(`Interface not found: ${interfaceName}`);
      return null;
    }
    
    // Determine the best matching table for this interface
    const { tableName, tableSchema } = this.findBestMatchingTable(interfaceData);
    if (!tableSchema) {
      console.error(`No matching table found for interface: ${interfaceName}`);
      return null;
    }
    
    console.log(`Matched interface ${interfaceName} to table ${tableName}`);
    
    // Map interface fields to table columns
    const fieldMappings = this.fieldMapper.mapInterfaceToTable(
      interfaceData.fields,
      tableSchema.columns
    );
    
    // Build Make.com integration scenario
    const makecomScenario = this.makecomScenarioBuilder.buildScenario(
      interfaceName,
      interfaceData,
      fieldMappings
    );
    
    // Generate webhook handler
    const webhookHandlerCode = this.webhookHandlerGenerator.generateWebhookHandler(
      interfaceName,
      interfaceData,
      fieldMappings
    );
    
    // Calculate trust score for this mapping
    const trustScore = this.calculateTrustScore(interfaceData, tableSchema, fieldMappings);
    
    // Verify emotional sovereignty
    const emotionalSovereignty = trustScore >= 4.2;
    
    // Create the mapping
    const mapping: InterfaceToTableMapping = {
      interfaceName,
      interfaceData,
      tableName,
      tableSchema,
      fieldMappings,
      makecomScenario,
      webhookHandlerCode,
      trustScore,
      emotionalSovereignty
    };
    
    // Save the mapping
    this.mappings.push(mapping);
    
    // Generate all output files
    await this.generateOutputFiles(mapping);
    
    return mapping;
  }
  
  /**
   * Maps all interfaces in the catalog
   * 
   * @returns Array of all mappings
   */
  async mapAllInterfaces(): Promise<InterfaceToTableMapping[]> {
    const interfaces = this.interfaceCatalogLoader.getAllInterfaceNames();
    const results: InterfaceToTableMapping[] = [];
    
    console.log(`Mapping all ${interfaces.length} interfaces...`);
    
    for (const interfaceName of interfaces) {
      const mapping = await this.mapInterface(interfaceName);
      if (mapping) {
        results.push(mapping);
      }
    }
    
    console.log(`Successfully mapped ${results.length} interfaces`);
    return results;
  }
  
  /**
   * Finds the best matching table for an interface
   * 
   * @param interfaceData The interface data
   * @returns The best matching table name and schema
   */
  private findBestMatchingTable(interfaceData: InterfaceCatalogEntry): { tableName: string; tableSchema: TableSchema | null } {
    // First try direct mapping by name
    const interfaceToTableMap: Record<string, string> = {
      'PromptLogs': 'prompt_logs',
      'GoldmineOutput': 'goldmine_output',
      'SparkSplitMetrics': 'sparksplit_analytics',
      'UserAIProfile': 'user_context',
      'SparkSplitComparisons': 'sparksplit_comparisons',
      'TrustMetrics': 'trust_metrics',
      'EmotionalIntelligence': 'emotional_intelligence'
    };
    
    // Try direct mapping first
    const mappedTableName = interfaceToTableMap[interfaceData.name];
    if (mappedTableName) {
      const tableSchema = this.supabaseSchemaLoader.getTable(mappedTableName);
      if (tableSchema) {
        return { tableName: mappedTableName, tableSchema };
      }
    }
    
    // Try converting to snake_case
    const snakeCaseName = this.camelToSnake(interfaceData.name);
    const tableSchema = this.supabaseSchemaLoader.getTable(snakeCaseName);
    if (tableSchema) {
      return { tableName: snakeCaseName, tableSchema };
    }
    
    // If no direct match, find the most compatible table
    const allTables = this.supabaseSchemaLoader.getAllTables();
    let bestMatch: { tableName: string; score: number; schema: TableSchema } | null = null;
    
    for (const [tableName, schema] of Object.entries(allTables)) {
      const score = this.calculateCompatibilityScore(interfaceData, schema);
      
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { tableName, score, schema };
      }
    }
    
    return bestMatch 
      ? { tableName: bestMatch.tableName, tableSchema: bestMatch.schema }
      : { tableName: '', tableSchema: null };
  }
  
  /**
   * Calculates compatibility score between an interface and a table
   * 
   * @param interfaceData The interface data
   * @param tableSchema The table schema
   * @returns Compatibility score (0-100)
   */
  private calculateCompatibilityScore(interfaceData: InterfaceCatalogEntry, tableSchema: TableSchema): number {
    let score = 0;
    const interfaceFields = Object.keys(interfaceData.fields);
    const tableColumns = Object.keys(tableSchema.columns);
    
    // Calculate field name matches
    for (const field of interfaceFields) {
      const snakeCase = this.camelToSnake(field);
      if (tableColumns.includes(snakeCase)) {
        score += 10;
      }
    }
    
    // Bonus for purpose/description match
    if (tableSchema.description.toLowerCase().includes(interfaceData.purpose.toLowerCase())) {
      score += 20;
    }
    
    // Bonus for relationship matches
    if (interfaceData.relationships && tableSchema.relationships) {
      const interfaceRels = interfaceData.relationships;
      const tableRels = [
        ...(tableSchema.relationships.belongsTo?.map(r => r.table) || []),
        ...(tableSchema.relationships.hasMany?.map(r => r.table) || [])
      ];
      
      for (const rel of interfaceRels) {
        if (tableRels.some(tableRel => tableRel.includes(rel.toLowerCase()))) {
          score += 5;
        }
      }
    }
    
    return score;
  }
  
  /**
   * Calculates trust score for a mapping
   * 
   * @param interfaceData The interface data
   * @param tableSchema The table schema
   * @param fieldMappings The field mappings
   * @returns Trust score (0-5)
   */
  private calculateTrustScore(
    interfaceData: InterfaceCatalogEntry,
    tableSchema: TableSchema,
    fieldMappings: FieldMapping[]
  ): number {
    // Base trust score
    let trustScore = 3.0;
    
    // Increase score for direct name matches
    const directMatches = fieldMappings.filter(m => 
      m.sourceField.toLowerCase() === m.targetField.replace(/_/g, '') ||
      m.sourceField === this.snakeToCamel(m.targetField)
    ).length;
    
    const matchRatio = directMatches / fieldMappings.length;
    trustScore += matchRatio * 0.5;
    
    // Increase for high percentage of required fields mapped
    const requiredFields = Object.values(interfaceData.fields).filter(f => f.required).length;
    const requiredMapped = fieldMappings.filter(m => 
      Object.entries(interfaceData.fields).some(([name, field]) => 
        name === m.sourceField && field.required
      )
    ).length;
    
    if (requiredFields > 0) {
      const requiredRatio = requiredMapped / requiredFields;
      trustScore += requiredRatio * 0.5;
    }
    
    // Check for emotional sovereignty fields
    const hasTrustFields = fieldMappings.some(m => 
      m.sourceField.toLowerCase().includes('trust') || 
      m.targetField.toLowerCase().includes('trust')
    );
    
    const hasEmotionalFields = fieldMappings.some(m => 
      m.sourceField.toLowerCase().includes('emotional') || 
      m.targetField.toLowerCase().includes('emotional')
    );
    
    if (hasTrustFields) trustScore += 0.3;
    if (hasEmotionalFields) trustScore += 0.3;
    
    // Penalize for transformations that might lose data
    const complexTransformations = fieldMappings.filter(m => 
      m.transformation !== 'direct'
    ).length;
    
    trustScore -= (complexTransformations / fieldMappings.length) * 0.2;
    
    // Ensure the score is within the valid range
    return Math.max(0, Math.min(5, trustScore));
  }
  
  /**
   * Generates all output files for a mapping
   * 
   * @param mapping The mapping to generate files for
   */
  private async generateOutputFiles(mapping: InterfaceToTableMapping): Promise<void> {
    const { interfaceName } = mapping;
    
    // Create directory for this interface
    const interfaceDir = join(this.outputDir, interfaceName);
    await fs.mkdir(interfaceDir, { recursive: true });
    
    // Save field mappings
    await fs.writeFile(
      join(interfaceDir, 'field-mappings.json'),
      JSON.stringify(mapping.fieldMappings, null, 2)
    );
    
    // Save Make.com scenario
    if (mapping.makecomScenario) {
      await fs.writeFile(
        join(interfaceDir, 'makecom-scenario.json'),
        JSON.stringify(mapping.makecomScenario, null, 2)
      );
    }
    
    // Save webhook handler
    if (mapping.webhookHandlerCode) {
      await fs.writeFile(
        join(interfaceDir, `${this.camelToSnake(interfaceName)}-webhook.ts`),
        mapping.webhookHandlerCode
      );
    }
    
    // Save mapping summary
    const summary = {
      interfaceName: mapping.interfaceName,
      tableName: mapping.tableName,
      fieldCount: mapping.fieldMappings.length,
      trustScore: mapping.trustScore,
      emotionalSovereignty: mapping.emotionalSovereignty,
      generatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(
      join(interfaceDir, 'mapping-summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log(`Generated output files for ${interfaceName} in ${interfaceDir}`);
  }
  
  /**
   * Generates the Ultimate Truth Mapping Guide
   */
  async generateUltimateTruthMappingGuide(): Promise<void> {
    console.log('Generating Ultimate Truth Mapping Guide...');
    
    // Sort mappings by trust score
    const sortedMappings = [...this.mappings].sort((a, b) => b.trustScore - a.trustScore);
    
    // Create the guide content
    let guide = `# Ultimate Truth-Based Integration Guide\n\n`;
    guide += `*Generated on ${new Date().toISOString()} with emotional sovereignty*\n\n`;
    guide += `## Overview\n\n`;
    guide += `This guide provides a comprehensive overview of the Truth-Based Integration System, `;
    guide += `connecting the CanAI Interface Catalog with Supabase database schemas through `;
    guide += `Make.com scenarios and webhook handlers.\n\n`;
    guide += `Total interfaces mapped: **${this.mappings.length}**\n`;
    guide += `Average trust score: **${this.calculateAverageTrustScore().toFixed(2)}**\n`;
    guide += `Emotional sovereignty preserved: **${this.countEmotionalSovereigntyPreserved()}/${this.mappings.length}**\n\n`;
    guide += `## Interface Mappings\n\n`;
    
    // Add each mapping
    for (const mapping of sortedMappings) {
      guide += `### ${mapping.interfaceName} → ${mapping.tableName}\n\n`;
      guide += `**Trust Score**: ${mapping.trustScore.toFixed(2)} `;
      
      if (mapping.emotionalSovereignty) {
        guide += `✅ *Emotional sovereignty preserved*\n\n`;
      } else {
        guide += `⚠️ *Emotional sovereignty at risk*\n\n`;
      }
      
      guide += `**Purpose**: ${mapping.interfaceData.purpose}\n\n`;
      guide += `**Field Mappings**:\n\n`;
      guide += `| Interface Field | Database Column | Transformation | Emotional Impact |\n`;
      guide += `|----------------|-----------------|----------------|------------------|\n`;
      
      for (const field of mapping.fieldMappings) {
        const emotionalImpact = field.emotionalImpact || 'neutral';
        const emotionalIcon = emotionalImpact === 'positive' ? '✨' : 
                              emotionalImpact === 'requires_validation' ? '⚠️' : '➖';
        
        guide += `| ${field.sourceField} | ${field.targetField} | ${field.transformation} | ${emotionalIcon} ${emotionalImpact} |\n`;
      }
      
      guide += `\n**Generated Files**:\n\n`;
      guide += `- [Field Mappings](${mapping.interfaceName}/field-mappings.json)\n`;
      guide += `- [Make.com Scenario](${mapping.interfaceName}/makecom-scenario.json)\n`;
      guide += `- [Webhook Handler](${mapping.interfaceName}/${this.camelToSnake(mapping.interfaceName)}-webhook.ts)\n`;
      guide += `- [Mapping Summary](${mapping.interfaceName}/mapping-summary.json)\n\n`;
      guide += `---\n\n`;
    }
    
    // Add trust transparency section
    guide += `## Trust Transparency\n\n`;
    guide += `### Trust Score Methodology\n\n`;
    guide += `Trust scores are calculated based on the following factors:\n\n`;
    guide += `- Direct field name matches\n`;
    guide += `- Required fields coverage\n`;
    guide += `- Presence of emotional sovereignty fields\n`;
    guide += `- Complexity of transformations\n\n`;
    
    guide += `### Emotional Sovereignty Validation\n\n`;
    guide += `Emotional sovereignty is preserved when:\n\n`;
    guide += `- Trust score is 4.2 or higher\n`;
    guide += `- Field transformations maintain data integrity\n`;
    guide += `- Response format includes empowering messages\n`;
    guide += `- Error handling preserves user dignity\n\n`;
    
    // Save the guide
    await fs.writeFile(
      join(this.outputDir, 'ULTIMATE-TRUTH-MAPPING-GUIDE.md'),
      guide
    );
    
    console.log(`Generated Ultimate Truth Mapping Guide at ${join(this.outputDir, 'ULTIMATE-TRUTH-MAPPING-GUIDE.md')}`);
  }
  
  /**
   * Calculates the average trust score of all mappings
   * 
   * @returns The average trust score
   */
  private calculateAverageTrustScore(): number {
    if (this.mappings.length === 0) return 0;
    
    const total = this.mappings.reduce((sum, mapping) => sum + mapping.trustScore, 0);
    return total / this.mappings.length;
  }
  
  /**
   * Counts how many mappings preserve emotional sovereignty
   * 
   * @returns The count of mappings with preserved emotional sovereignty
   */
  private countEmotionalSovereigntyPreserved(): number {
    return this.mappings.filter(mapping => mapping.emotionalSovereignty).length;
  }
  
  /**
   * Converts a camelCase string to snake_case
   * 
   * @param str String to convert
   * @returns The snake_case version
   */
  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).toLowerCase();
  }
  
  /**
   * Converts a snake_case string to camelCase
   * 
   * @param str String to convert
   * @returns The camelCase version
   */
  private snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
} 