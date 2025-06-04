#!/usr/bin/env node

/**
 * Airtable Base Structure Extractor
 * 
 * Extracts the complete structure of an Airtable base including:
 * - All table names and IDs
 * - All field names, types, and configurations
 * - Sample data for validation
 * - Relationships between tables
 * 
 * @version 1.0.0
 * @author CanAI Codex v6.1.4
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

interface AirtableField {
  id: string;
  name: string;
  type: string;
  description?: string;
  options?: any;
}

interface AirtableTable {
  id: string;
  name: string;
  description?: string;
  primaryFieldId: string;
  fields: AirtableField[];
  views?: any[];
}

interface BaseStructure {
  baseId: string;
  extractedAt: string;
  totalTables: number;
  tables: Record<string, {
    id: string;
    name: string;
    description?: string;
    fieldCount: number;
    fields: Record<string, AirtableField>;
    sampleRecords: any[];
    recordCount: number;
  }>;
  relationships: Array<{
    sourceTable: string;
    targetTable: string;
    fieldName: string;
    type: 'linkedRecord' | 'lookup' | 'rollup';
  }>;
  summary: {
    totalFields: number;
    fieldTypes: Record<string, number>;
    tablesWithData: number;
    totalRecords: number;
  };
}

class AirtableBaseExtractor {
  private apiKey: string;
  private baseId: string;
  private baseUrl: string;
  private structure: BaseStructure;

  constructor() {
    // Use the provided credentials
    this.apiKey = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_PAT || 'pataqlMUXrJnzszI7.9e5923a7ab8a6564f1f9bf9feb1efbb9037725e8ba81d3da2fafaf094172ceb9';
    this.baseId = process.env.AIRTABLE_BASE_ID || 'apph8yM7gVc9QBFtx';
    this.baseUrl = `https://api.airtable.com/v0/${this.baseId}`;
    
    this.structure = {
      baseId: this.baseId,
      extractedAt: new Date().toISOString(),
      totalTables: 0,
      tables: {},
      relationships: [],
      summary: {
        totalFields: 0,
        fieldTypes: {},
        tablesWithData: 0,
        totalRecords: 0
      }
    };

    console.log('🔍 Airtable Base Structure Extractor');
    console.log(`📋 Base ID: ${this.baseId}`);
    console.log(`🔑 API Key: ${this.apiKey.substring(0, 15)}...`);
    console.log('');
  }

  /**
   * Make authenticated request to Airtable API
   */
  private async makeRequest(url: string): Promise<any> {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Get base metadata including all tables and their schemas
   */
  private async getBaseMetadata(): Promise<AirtableTable[]> {
    console.log('🔍 Step 1: Extracting Base Metadata');
    
    try {
      // Try the meta API endpoint first (requires proper permissions)
      const metaUrl = `https://api.airtable.com/v0/meta/bases/${this.baseId}/tables`;
      const metaResponse = await this.makeRequest(metaUrl);
      
      if (metaResponse.tables) {
        console.log(`✅ Meta API accessible - Found ${metaResponse.tables.length} tables`);
        console.log('📋 Tables with full schema information:');
        metaResponse.tables.forEach((table: any) => {
          console.log(`   - ${table.name} (${table.fields?.length || 0} fields)`);
        });
        return metaResponse.tables;
      }
    } catch (error) {
      console.log('⚠️  Meta API not accessible, using table discovery method');
    }

    // Fallback: Try to discover tables by attempting to access known table names
    return this.discoverTablesManually();
  }

  /**
   * Discover tables manually by trying common table names
   */
  private async discoverTablesManually(): Promise<AirtableTable[]> {
    console.log('🔍 Discovering tables manually...');
    
    const commonTableNames = [
      'PromptLogs', 'SessionAnalytics', 'SparkSplitAnalytics', 'GoldmineOutput',
      'UserContext', 'EmotionalIntelligence', 'TrustMetrics', 'PerformanceMetrics',
      'WebhookLogs', 'AirtableSync', 'ErrorLogs', 'ProcessingResults', 'SystemHealth',
      'PromptTypes', 'EmotionalStates', 'TrustFactors', 'SystemConfigs', 'AnalyticsAggregates',
      'SystemEvolution', 'UserProfiles', 'BusinessProfiles', 'ProjectTracking',
      'TaskManagement', 'ContentLibrary', 'TemplateRegistry', 'WorkflowSteps'
    ];

    const discoveredTables: AirtableTable[] = [];

    for (const tableName of commonTableNames) {
      try {
        const url = `${this.baseUrl}/${encodeURIComponent(tableName)}?maxRecords=1`;
        const response = await this.makeRequest(url);
        
        if (response.records !== undefined) {
          console.log(`✅ Found table: ${tableName}`);
          
          // Create a basic table structure (we'll get full schema later)
          discoveredTables.push({
            id: tableName, // We'll use name as ID for now
            name: tableName,
            primaryFieldId: '',
            fields: []
          });
        }
      } catch (error) {
        // Table doesn't exist or not accessible
        console.log(`❌ Table not found: ${tableName}`);
      }
    }

    return discoveredTables;
  }

  /**
   * Extract detailed information for each table
   */
  private async extractTableDetails(tables: AirtableTable[]): Promise<void> {
    console.log('\n🔍 Step 2: Extracting Table Details');
    
    for (const table of tables) {
      try {
        console.log(`\n📋 Analyzing table: ${table.name}`);
        
        // If we have full schema from Meta API, use it
        if (table.fields && table.fields.length > 0) {
          console.log(`   📊 Using Meta API schema (${table.fields.length} fields)`);
          
          // Create field definitions from Meta API
          const fields: Record<string, AirtableField> = {};
          table.fields.forEach((field: any) => {
            fields[field.name] = {
              id: field.id,
              name: field.name,
              type: field.type,
              description: field.description,
              options: field.options
            };
          });

          // Get sample records for data validation
          const url = `${this.baseUrl}/${encodeURIComponent(table.name)}?maxRecords=10`;
          const response = await this.makeRequest(url);
          const records = response.records || [];

          // Store table information
          this.structure.tables[table.name] = {
            id: table.id,
            name: table.name,
            description: table.description,
            fieldCount: table.fields.length,
            fields,
            sampleRecords: records.slice(0, 3),
            recordCount: records.length
          };

          console.log(`   ✅ ${table.fields.length} fields from schema`);
          console.log(`   📊 ${records.length} sample records extracted`);
          
          // Log linked record fields specifically
          const linkedFields = table.fields.filter((f: any) => 
            f.type === 'multipleRecordLinks' || f.type === 'foreignKey'
          );
          if (linkedFields.length > 0) {
            console.log(`   🔗 Found ${linkedFields.length} linked record fields:`);
            linkedFields.forEach((field: any) => {
              const targetTable = field.options?.linkedTableId || 'Unknown';
              console.log(`      - ${field.name} → ${targetTable}`);
            });
          }

        } else {
          // Fallback to record-based field discovery
          console.log(`   📊 Using record-based field discovery`);
          
          // Get sample records to understand field structure
          const url = `${this.baseUrl}/${encodeURIComponent(table.name)}?maxRecords=10`;
          const response = await this.makeRequest(url);
          
          const records = response.records || [];
          const fieldTypes: Record<string, string> = {};
          const fieldNames = new Set<string>();

          // Analyze field structure from sample records
          records.forEach((record: any) => {
            Object.entries(record.fields || {}).forEach(([fieldName, value]) => {
              fieldNames.add(fieldName);
              
              if (!fieldTypes[fieldName]) {
                fieldTypes[fieldName] = this.inferFieldType(value);
              }
            });
          });

          // Create field definitions
          const fields: Record<string, AirtableField> = {};
          Array.from(fieldNames).forEach((fieldName, index) => {
            fields[fieldName] = {
              id: `fld${index.toString().padStart(14, '0')}`,
              name: fieldName,
              type: fieldTypes[fieldName] || 'singleLineText'
            };
          });

          // Store table information
          this.structure.tables[table.name] = {
            id: table.id,
            name: table.name,
            description: table.description,
            fieldCount: fieldNames.size,
            fields,
            sampleRecords: records.slice(0, 3),
            recordCount: records.length
          };

          console.log(`   ✅ ${fieldNames.size} fields found`);
          console.log(`   📊 ${records.length} sample records extracted`);
          console.log(`   🏷️  Field types: ${Object.values(fieldTypes).join(', ')}`);
        }

        // Update summary statistics
        const tableData = this.structure.tables[table.name];
        this.structure.summary.totalFields += tableData.fieldCount;
        this.structure.summary.totalRecords += tableData.recordCount;
        if (tableData.recordCount > 0) {
          this.structure.summary.tablesWithData++;
        }

        // Count field types
        Object.values(tableData.fields).forEach(field => {
          this.structure.summary.fieldTypes[field.type] = (this.structure.summary.fieldTypes[field.type] || 0) + 1;
        });

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.log(`   ❌ Error analyzing table ${table.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    this.structure.totalTables = Object.keys(this.structure.tables).length;
  }

  /**
   * Infer field type from sample value
   */
  private inferFieldType(value: any): string {
    if (value === null || value === undefined) return 'singleLineText';
    
    if (typeof value === 'string') {
      if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) return 'dateTime';
      if (value.match(/^\d{4}-\d{2}-\d{2}$/)) return 'date';
      if (value.length > 100) return 'multilineText';
      return 'singleLineText';
    }
    
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'number' : 'number';
    }
    
    if (typeof value === 'boolean') return 'checkbox';
    
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && value[0].id) {
        return 'multipleRecordLinks';
      }
      return 'multipleSelects';
    }
    
    if (typeof value === 'object') {
      if (value.url) return 'url';
      if (value.email) return 'email';
      return 'singleLineText';
    }
    
    return 'singleLineText';
  }

  /**
   * Identify relationships between tables
   */
  private identifyRelationships(): void {
    console.log('\n🔍 Step 3: Identifying Table Relationships');
    
    // Create a map of table IDs to names for lookup
    const tableIdToName: Record<string, string> = {};
    Object.values(this.structure.tables).forEach(table => {
      tableIdToName[table.id] = table.name;
    });
    
    let totalRelationships = 0;
    
    Object.values(this.structure.tables).forEach(table => {
      Object.values(table.fields).forEach(field => {
        if (field.type === 'multipleRecordLinks') {
          // This is a linked record field
          let targetTableName = 'Unknown';
          
          // Try to get target table from field options
          if (field.options && field.options.linkedTableId) {
            targetTableName = tableIdToName[field.options.linkedTableId] || field.options.linkedTableId;
          }
          
          this.structure.relationships.push({
            sourceTable: table.name,
            targetTable: targetTableName,
            fieldName: field.name,
            type: 'linkedRecord'
          });
          
          totalRelationships++;
          console.log(`   🔗 ${table.name}.${field.name} → ${targetTableName}`);
        }
        
        // Also check for lookup and rollup fields
        if (field.type === 'lookup' || field.type === 'rollup') {
          let targetTableName = 'Unknown';
          
          if (field.options && field.options.recordLinkFieldId) {
            // Find the linked record field this lookup/rollup is based on
            const linkedField = Object.values(table.fields).find(f => 
              f.id === field.options.recordLinkFieldId
            );
            
            if (linkedField && linkedField.options && linkedField.options.linkedTableId) {
              targetTableName = tableIdToName[linkedField.options.linkedTableId] || linkedField.options.linkedTableId;
            }
          }
          
          this.structure.relationships.push({
            sourceTable: table.name,
            targetTable: targetTableName,
            fieldName: field.name,
            type: field.type as 'lookup' | 'rollup'
          });
          
          totalRelationships++;
          console.log(`   📊 ${table.name}.${field.name} (${field.type}) → ${targetTableName}`);
        }
      });
    });

    console.log(`✅ Found ${totalRelationships} relationships total`);
    
    // Display relationship summary
    if (totalRelationships > 0) {
      console.log('\n🔗 RELATIONSHIP SUMMARY:');
      const relationshipsByType = this.structure.relationships.reduce((acc, rel) => {
        acc[rel.type] = (acc[rel.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      Object.entries(relationshipsByType).forEach(([type, count]) => {
        console.log(`   📊 ${type}: ${count} relationships`);
      });
    }
  }

  /**
   * Generate comprehensive reports
   */
  private generateReports(): void {
    console.log('\n📊 Step 4: Generating Reports');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputDir = path.join(process.cwd(), 'airtable-extraction');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 1. Complete structure JSON
    const structureFile = path.join(outputDir, `base-structure-${timestamp}.json`);
    fs.writeFileSync(structureFile, JSON.stringify(this.structure, null, 2));
    console.log(`✅ Complete structure saved: ${structureFile}`);

    // 2. Table summary markdown
    const summaryFile = path.join(outputDir, `table-summary-${timestamp}.md`);
    const summaryContent = this.generateSummaryMarkdown();
    fs.writeFileSync(summaryFile, summaryContent);
    console.log(`✅ Table summary saved: ${summaryFile}`);

    // 3. Field mapping CSV
    const csvFile = path.join(outputDir, `field-mapping-${timestamp}.csv`);
    const csvContent = this.generateFieldMappingCSV();
    fs.writeFileSync(csvFile, csvContent);
    console.log(`✅ Field mapping saved: ${csvFile}`);

    // 4. TypeScript interfaces
    const typesFile = path.join(outputDir, `airtable-types-${timestamp}.ts`);
    const typesContent = this.generateTypeScriptInterfaces();
    fs.writeFileSync(typesFile, typesContent);
    console.log(`✅ TypeScript types saved: ${typesFile}`);
  }

  /**
   * Generate summary markdown report
   */
  private generateSummaryMarkdown(): string {
    const tables = Object.values(this.structure.tables);
    
    let content = `# Airtable Base Structure Report\n\n`;
    content += `**Base ID:** ${this.structure.baseId}\n`;
    content += `**Extracted:** ${this.structure.extractedAt}\n`;
    content += `**Total Tables:** ${this.structure.totalTables}\n`;
    content += `**Total Fields:** ${this.structure.summary.totalFields}\n`;
    content += `**Total Records:** ${this.structure.summary.totalRecords}\n\n`;

    content += `## Tables Overview\n\n`;
    tables.forEach(table => {
      content += `### ${table.name}\n`;
      content += `- **Fields:** ${table.fieldCount}\n`;
      content += `- **Sample Records:** ${table.recordCount}\n`;
      content += `- **Field Names:** ${Object.keys(table.fields).join(', ')}\n\n`;
    });

    content += `## Field Types Distribution\n\n`;
    Object.entries(this.structure.summary.fieldTypes).forEach(([type, count]) => {
      content += `- **${type}:** ${count} fields\n`;
    });

    return content;
  }

  /**
   * Generate field mapping CSV
   */
  private generateFieldMappingCSV(): string {
    let csv = 'Table,Field Name,Field Type,Sample Value\n';
    
    Object.values(this.structure.tables).forEach(table => {
      Object.values(table.fields).forEach(field => {
        const sampleValue = table.sampleRecords[0]?.fields?.[field.name] || '';
        const cleanValue = String(sampleValue).replace(/"/g, '""').substring(0, 50);
        csv += `"${table.name}","${field.name}","${field.type}","${cleanValue}"\n`;
      });
    });

    return csv;
  }

  /**
   * Generate TypeScript interfaces
   */
  private generateTypeScriptInterfaces(): string {
    let content = `// Airtable Base TypeScript Interfaces\n`;
    content += `// Generated: ${this.structure.extractedAt}\n`;
    content += `// Base ID: ${this.structure.baseId}\n\n`;

    Object.values(this.structure.tables).forEach(table => {
      content += `export interface ${table.name}Record {\n`;
      content += `  id: string;\n`;
      content += `  createdTime: string;\n`;
      content += `  fields: {\n`;
      
      Object.values(table.fields).forEach(field => {
        const tsType = this.mapAirtableTypeToTypeScript(field.type);
        content += `    "${field.name}"?: ${tsType};\n`;
      });
      
      content += `  };\n`;
      content += `}\n\n`;
    });

    return content;
  }

  /**
   * Map Airtable field types to TypeScript types
   */
  private mapAirtableTypeToTypeScript(airtableType: string): string {
    const typeMap: Record<string, string> = {
      'singleLineText': 'string',
      'multilineText': 'string',
      'number': 'number',
      'checkbox': 'boolean',
      'date': 'string',
      'dateTime': 'string',
      'email': 'string',
      'url': 'string',
      'multipleSelects': 'string[]',
      'multipleRecordLinks': 'string[]',
      'singleSelect': 'string'
    };

    return typeMap[airtableType] || 'any';
  }

  /**
   * Run the complete extraction process
   */
  async extract(): Promise<void> {
    try {
      console.log('🚀 Starting Airtable Base Structure Extraction\n');

      // Step 1: Get base metadata
      const tables = await this.getBaseMetadata();
      
      if (tables.length === 0) {
        throw new Error('No tables found in the base');
      }

      // Step 2: Extract detailed table information
      await this.extractTableDetails(tables);

      // Step 3: Identify relationships
      this.identifyRelationships();

      // Step 4: Generate reports
      this.generateReports();

      // Step 5: Display summary
      this.displaySummary();

      console.log('\n🎉 Extraction Complete!');
      console.log('📁 Check the "airtable-extraction" folder for detailed reports');

    } catch (error) {
      console.error('❌ Extraction failed:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  /**
   * Display extraction summary
   */
  private displaySummary(): void {
    console.log('\n📊 EXTRACTION SUMMARY');
    console.log('═'.repeat(50));
    console.log(`📋 Base ID: ${this.structure.baseId}`);
    console.log(`🗂️  Total Tables: ${this.structure.totalTables}`);
    console.log(`📝 Total Fields: ${this.structure.summary.totalFields}`);
    console.log(`📊 Total Records: ${this.structure.summary.totalRecords}`);
    console.log(`🔗 Relationships: ${this.structure.relationships.length}`);
    console.log('');

    console.log('�� DISCOVERED TABLES:');
    Object.values(this.structure.tables).forEach(table => {
      console.log(`   ✅ ${table.name} (${table.fieldCount} fields, ${table.recordCount} records)`);
    });

    console.log('\n🏷️  FIELD TYPE DISTRIBUTION:');
    Object.entries(this.structure.summary.fieldTypes)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`   📊 ${type}: ${count} fields`);
      });
  }
}

// Run the extraction if this file is executed directly
if (require.main === module) {
  const extractor = new AirtableBaseExtractor();
  extractor.extract().catch(console.error);
}

export { AirtableBaseExtractor };