#!/usr/bin/env node

/**
 * Extract Make.com Interface Definitions from CanAI Codebase
 * 
 * Purpose: Extract clean interface definitions for Make.com integration,
 * excluding the legacy 36-table Airtable schema that was replaced with 18 optimized tables.
 * 
 * Filters:
 * - Files with "36" or "ALL_TABLE" references (legacy architecture)
 * - Files in api/create-all-tables.ts and related legacy 36-table files
 * - CSV import files from old 36-table structure
 * 
 * Focus: Clean 18-table interface catalog for Make.com webhooks
 */

const fs = require('fs');
const path = require('path');

class MakeComInterfaceExtractor {
  constructor() {
    this.interfaces = new Map();
    this.exportedInterfaces = new Map();
    this.fieldInventory = new Set();
    this.fileCount = 0;
    this.interfaceCount = 0;
    
    // Patterns for interface detection
    this.interfacePattern = /(?:export\s+)?interface\s+(\w+)(?:\s*<[^>]*>)?\s*(?:extends\s+[^{]+)?\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/gs;
    this.fieldPattern = /^\s*(?:readonly\s+)?(\w+)(\?)?:\s*([^;,\n]+)(?:[;,]|$)/gm;
    this.commentPattern = /\/\*\*[\s\S]*?\*\/|\/\/.*$/gm;
    
    // Directories to scan (focused on Make.com integration)
    this.scanDirs = [
      'api/orchestration',
      'api/webhook', 
      'cursor/services',
      'cursor/types',
      'prompts',
      'types'
    ];
    
    // Files to EXCLUDE (wrong schema pollution)
    this.excludePatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      'coverage',
      '.jest-cache',
      'create-all-tables',
      'test-all-18-tables',
      'ALL_TABLE',
      'ALL_CANAI_TABLES',
      '36_',
      'field-discovery-and-crud',
      'test-table-population',
      'complete-table-setup',
      '18 optimized tables'
    ];

    // Key interfaces we actually want for Make.com
    this.targetInterfaces = [
      'EmotionalSovereigntyRequest',
      'EmotionalSovereigntyResponse', 
      'SparkSplitInput',
      'SparkSplitOutput',
      'StructuredIntent',
      'EmotionalContext',
      'SparkConcept',
      'TrustMetrics',
      'WebhookPayload',
      'MakeWebhookData'
    ];
  }

  /**
   * Main extraction method - focused on Make.com interfaces only
   */
  async extractMakeComInterfaces() {
    console.log('🎯 Starting Make.com-focused interface extraction...');
    console.log('🚫 Filtering out legacy 36-table Airtable schema pollution...');
    
    try {
      // Scan focused directories only
      for (const dir of this.scanDirs) {
        if (fs.existsSync(dir)) {
          await this.scanDirectory(dir);
        }
      }
      
      // Generate focused reports
      const report = this.generateMakeComReport();
      const fieldMapping = this.generateMakeComFieldMapping();
      const webhookStructure = this.generateWebhookStructure();
      
      // Write focused output files
      this.writeMakeComResults(report, fieldMapping, webhookStructure);
      
      console.log(`✅ Make.com extraction complete!`);
      console.log(`📁 Files scanned: ${this.fileCount}`);
      console.log(`🔧 Interfaces found: ${this.interfaceCount}`);
      console.log(`📋 Unique fields: ${this.fieldInventory.size}`);
      console.log(`📤 Target interfaces: ${this.exportedInterfaces.size}`);
      
    } catch (error) {
      console.error('❌ Extraction failed:', error.message);
      throw error;
    }
  }

  /**
   * Recursively scan directory for TypeScript files (filtered)
   */
  async scanDirectory(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      // Skip excluded patterns (wrong schema files)
      if (this.excludePatterns.some(pattern => fullPath.includes(pattern))) {
        console.log(`🚫 Skipping: ${fullPath} (wrong schema)`);
        continue;
      }
      
      if (entry.isDirectory()) {
        await this.scanDirectory(fullPath);
      } else if (this.isTypeScriptFile(entry.name)) {
        await this.processFile(fullPath);
      }
    }
  }

  /**
   * Check if file is TypeScript/JavaScript
   */
  isTypeScriptFile(filename) {
    return /\.(ts|tsx|js|jsx)$/.test(filename);
  }

  /**
   * Process individual file for interfaces (with content filtering)
   */
  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Skip files that contain wrong schema references
      if (this.containsWrongSchema(content)) {
        console.log(`🚫 Skipping: ${filePath} (contains wrong schema)`);
        return;
      }
      
      this.fileCount++;
      console.log(`✅ Processing: ${filePath}`);
      
      // Remove comments to avoid false matches
      const cleanContent = content.replace(this.commentPattern, '');
      
      // Extract interfaces
      let match;
      while ((match = this.interfacePattern.exec(cleanContent)) !== null) {
        const [fullMatch, interfaceName, interfaceBody] = match;
        const isExported = fullMatch.startsWith('export');
        
        // Only include target interfaces or those with relevant fields
        if (this.isRelevantInterface(interfaceName, interfaceBody)) {
          const interfaceData = {
            name: interfaceName,
            filePath: filePath.replace(/\\/g, '/'),
            isExported,
            fields: this.extractFields(interfaceBody),
            rawDefinition: fullMatch.trim(),
            relevanceScore: this.calculateRelevanceScore(interfaceName, interfaceBody)
          };
          
          this.interfaces.set(`${filePath}:${interfaceName}`, interfaceData);
          
          if (isExported) {
            this.exportedInterfaces.set(interfaceName, interfaceData);
          }
          
          this.interfaceCount++;
          
          // Add fields to inventory
          interfaceData.fields.forEach(field => {
            this.fieldInventory.add(field.name);
          });
          
          console.log(`  📋 Found interface: ${interfaceName} (${interfaceData.fields.length} fields)`);
        }
      }
      
    } catch (error) {
      console.warn(`⚠️  Error processing ${filePath}:`, error.message);
    }
  }

  /**
   * Check if content contains wrong schema references
   */
  containsWrongSchema(content) {
    const wrongSchemaPatterns = [
      'ALL_TABLE_SCHEMAS',
      'ALL_CANAI_TABLES', 
      '36 tables',
      "'01_PromptLogs', '02_SparkSplitAnalytics'",
      "'21_ConversionFunnels'",
      "'36_IntelligenceCompound'",
      'Tables 21-36',
      'Missing ones that need to be created',
      '18 optimized tables'
    ];
    
    return wrongSchemaPatterns.some(pattern => content.includes(pattern));
  }

  /**
   * Check if interface is relevant for Make.com integration
   */
  isRelevantInterface(interfaceName, interfaceBody) {
    // Always include target interfaces
    if (this.targetInterfaces.includes(interfaceName)) {
      return true;
    }
    
    // Include interfaces with Make.com relevant fields
    const relevantFieldPatterns = [
      'sessionId',
      'userId', 
      'emotionalContext',
      'sparkResonance',
      'trustScore',
      'webhookData',
      'makeWebhook',
      'structuredIntent',
      'emotionalArc',
      'sparkConcept'
    ];
    
    return relevantFieldPatterns.some(pattern => 
      interfaceBody.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Calculate relevance score for interface
   */
  calculateRelevanceScore(interfaceName, interfaceBody) {
    let score = 0;
    
    // High value interfaces
    if (this.targetInterfaces.includes(interfaceName)) score += 10;
    
    // Emotional sovereignty fields
    if (interfaceBody.includes('emotional')) score += 5;
    if (interfaceBody.includes('trust')) score += 5;
    if (interfaceBody.includes('spark')) score += 5;
    
    // Make.com integration fields
    if (interfaceBody.includes('webhook')) score += 3;
    if (interfaceBody.includes('sessionId')) score += 3;
    if (interfaceBody.includes('userId')) score += 2;
    
    return score;
  }

  /**
   * Extract field definitions from interface body
   */
  extractFields(interfaceBody) {
    const fields = [];
    let match;
    
    // Reset regex
    this.fieldPattern.lastIndex = 0;
    
    while ((match = this.fieldPattern.exec(interfaceBody)) !== null) {
      const [, fieldName, optional, fieldType] = match;
      
      fields.push({
        name: fieldName,
        type: fieldType.trim(),
        optional: !!optional,
        required: !optional,
        makeComType: this.mapToMakeComType(fieldType.trim())
      });
    }
    
    return fields;
  }

  /**
   * Map TypeScript types to Make.com types
   */
  mapToMakeComType(tsType) {
    if (tsType.includes('string')) return 'text';
    if (tsType.includes('number')) return 'number';
    if (tsType.includes('boolean')) return 'boolean';
    if (tsType.includes('Date')) return 'date';
    if (tsType.includes('[]')) return 'array';
    if (tsType.includes('{') || tsType.includes('object')) return 'object';
    return 'text'; // default
  }

  /**
   * Generate Make.com focused report
   */
  generateMakeComReport() {
    const interfacesByRelevance = {};
    const fieldFrequency = {};
    const highValueInterfaces = {};
    
    // Group interfaces by relevance score
    for (const [key, interfaceData] of this.interfaces) {
      const score = interfaceData.relevanceScore;
      if (!interfacesByRelevance[score]) {
        interfacesByRelevance[score] = [];
      }
      interfacesByRelevance[score].push(interfaceData);
      
      // Track high value interfaces
      if (score >= 10) {
        highValueInterfaces[interfaceData.name] = interfaceData;
      }
      
      // Count field frequency
      interfaceData.fields.forEach(field => {
        fieldFrequency[field.name] = (fieldFrequency[field.name] || 0) + 1;
      });
    }
    
    return {
      summary: {
        totalFiles: this.fileCount,
        totalInterfaces: this.interfaceCount,
        exportedInterfaces: this.exportedInterfaces.size,
        uniqueFields: this.fieldInventory.size,
        highValueInterfaces: Object.keys(highValueInterfaces).length,
        scanTimestamp: new Date().toISOString(),
        filteredOut: 'Legacy 36-table Airtable schema replaced with 18 optimized tables'
      },
      highValueInterfaces,
      interfacesByRelevance,
      exportedInterfaces: Object.fromEntries(this.exportedInterfaces),
      fieldFrequency: Object.entries(fieldFrequency)
        .sort(([,a], [,b]) => b - a)
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}),
      allFields: Array.from(this.fieldInventory).sort()
    };
  }

  /**
   * Generate Make.com specific field mapping
   */
  generateMakeComFieldMapping() {
    const mapping = {
      coreFields: [],
      emotionalFields: [],
      sparkSplitFields: [],
      webhookFields: [],
      orchestratorFields: [],
      allUniqueFields: Array.from(this.fieldInventory).sort()
    };
    
    // Categorize fields for Make.com integration
    for (const field of this.fieldInventory) {
      if (this.isCoreField(field)) {
        mapping.coreFields.push(field);
      }
      if (this.isEmotionalField(field)) {
        mapping.emotionalFields.push(field);
      }
      if (this.isSparkSplitField(field)) {
        mapping.sparkSplitFields.push(field);
      }
      if (this.isWebhookField(field)) {
        mapping.webhookFields.push(field);
      }
      if (this.isOrchestratorField(field)) {
        mapping.orchestratorFields.push(field);
      }
    }
    
    return mapping;
  }

  /**
   * Generate webhook payload structure for Make.com
   */
  generateWebhookStructure() {
    const structure = {};
    
    // Get key interfaces for Make.com webhooks
    const keyInterfaces = [
      'EmotionalSovereigntyRequest',
      'EmotionalSovereigntyResponse', 
      'SparkSplitInput',
      'SparkSplitOutput'
    ];
    
    for (const interfaceName of keyInterfaces) {
      const interfaceData = this.exportedInterfaces.get(interfaceName);
      if (interfaceData) {
        structure[interfaceName] = {
          filePath: interfaceData.filePath,
          relevanceScore: interfaceData.relevanceScore,
          fields: interfaceData.fields.map(field => ({
            name: field.name,
            type: field.type,
            required: field.required,
            makeComType: field.makeComType,
            example: this.generateFieldExample(field.name, field.type)
          }))
        };
      }
    }
    
    return structure;
  }

  /**
   * Field categorization helpers
   */
  isCoreField(field) {
    const corePatterns = ['sessionId', 'userId', 'timestamp', 'id', 'recordId'];
    return corePatterns.some(pattern => field.toLowerCase().includes(pattern.toLowerCase()));
  }

  isEmotionalField(field) {
    const emotionalPatterns = ['emotional', 'trust', 'resonance', 'spark'];
    return emotionalPatterns.some(pattern => field.toLowerCase().includes(pattern.toLowerCase()));
  }

  isSparkSplitField(field) {
    const sparkPatterns = ['spark', 'split', 'comparison', 'sterile', 'enhanced', 'compass'];
    return sparkPatterns.some(pattern => field.toLowerCase().includes(pattern.toLowerCase()));
  }

  isWebhookField(field) {
    const webhookPatterns = ['webhook', 'payload', 'data', 'response'];
    return webhookPatterns.some(pattern => field.toLowerCase().includes(pattern.toLowerCase()));
  }

  isOrchestratorField(field) {
    const orchestratorPatterns = ['structured', 'intent', 'context', 'arc', 'orchestrat'];
    return orchestratorPatterns.some(pattern => field.toLowerCase().includes(pattern.toLowerCase()));
  }

  generateFieldExample(fieldName, fieldType) {
    if (fieldName.includes('sessionId')) return 'sess_abc123';
    if (fieldName.includes('userId')) return 'user_xyz789';
    if (fieldName.includes('trustScore')) return '4.2';
    if (fieldName.includes('timestamp')) return '2025-01-27T10:30:00Z';
    if (fieldType.includes('boolean')) return 'true';
    if (fieldType.includes('number')) return '42';
    return 'example_value';
  }

  /**
   * Write Make.com focused results to files
   */
  writeMakeComResults(report, fieldMapping, webhookStructure) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Write Make.com focused report
    fs.writeFileSync(
      `makecom-interfaces-report-${timestamp}.json`,
      JSON.stringify(report, null, 2)
    );
    
    // Write Make.com field mapping
    fs.writeFileSync(
      `makecom-field-mapping-${timestamp}.json`,
      JSON.stringify(fieldMapping, null, 2)
    );
    
    // Write webhook structure
    fs.writeFileSync(
      `makecom-webhook-structure-${timestamp}.json`,
      JSON.stringify(webhookStructure, null, 2)
    );
    
    // Write simple field list for quick reference
    fs.writeFileSync(
      `makecom-fields-${timestamp}.txt`,
      Array.from(this.fieldInventory).sort().join('\n')
    );
    
    // Write CSV for Make.com integration
    const csvContent = [
      'Field Name,Frequency,Category,Make.com Type,Required,Example',
      ...Array.from(this.fieldInventory).map(field => {
        const freq = Object.entries(report.fieldFrequency).find(([f]) => f === field)?.[1] || 0;
        const category = this.categorizeField(field);
        const makeComType = this.mapToMakeComType('string'); // default
        const example = this.generateFieldExample(field, 'string');
        return `${field},${freq},${category},${makeComType},true,${example}`;
      })
    ].join('\n');
    
    fs.writeFileSync(`makecom-integration-${timestamp}.csv`, csvContent);
    
    console.log(`📄 Make.com reports written:`);
    console.log(`   - makecom-interfaces-report-${timestamp}.json`);
    console.log(`   - makecom-field-mapping-${timestamp}.json`);
    console.log(`   - makecom-webhook-structure-${timestamp}.json`);
    console.log(`   - makecom-fields-${timestamp}.txt`);
    console.log(`   - makecom-integration-${timestamp}.csv`);
  }

  categorizeField(fieldName) {
    if (this.isCoreField(fieldName)) return 'core';
    if (this.isEmotionalField(fieldName)) return 'emotional';
    if (this.isSparkSplitField(fieldName)) return 'sparksplit';
    if (this.isWebhookField(fieldName)) return 'webhook';
    if (this.isOrchestratorField(fieldName)) return 'orchestrator';
    return 'general';
  }
}

// Run the Make.com focused extraction
if (require.main === module) {
  const extractor = new MakeComInterfaceExtractor();
  extractor.extractMakeComInterfaces().catch(console.error);
}

module.exports = MakeComInterfaceExtractor; 