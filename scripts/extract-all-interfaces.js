#!/usr/bin/env node

/**
 * Interface Extraction Script - Complete Codebase Analysis
 * 
 * Purpose: Extract ALL interface definitions from the codebase to build
 * a complete, factual inventory of data structures and fields.
 * 
 * What it does:
 * - Scans all .ts, .tsx, .js, .jsx files
 * - Extracts interface definitions with field details
 * - Identifies export interfaces vs internal interfaces
 * - Maps field types, optional/required status
 * - Generates comprehensive JSON report
 * - Creates Make.com-ready field mapping
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class InterfaceExtractor {
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
    
    // Directories to scan
    this.scanDirs = [
      'api',
      'cursor',
      'prompts',
      'src',
      'types',
      'utils',
      'lib',
      'components'
    ];
    
    // Files to exclude
    this.excludePatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      'coverage',
      '.jest-cache'
    ];
  }

  /**
   * Main extraction method
   */
  async extractAllInterfaces() {
    console.log('🔍 Starting comprehensive interface extraction...');
    
    try {
      // Scan all directories
      for (const dir of this.scanDirs) {
        if (fs.existsSync(dir)) {
          await this.scanDirectory(dir);
        }
      }
      
      // Generate reports
      const report = this.generateReport();
      const fieldMapping = this.generateFieldMapping();
      const makeComMapping = this.generateMakeComMapping();
      
      // Write output files
      this.writeResults(report, fieldMapping, makeComMapping);
      
      console.log(`✅ Extraction complete!`);
      console.log(`📁 Files scanned: ${this.fileCount}`);
      console.log(`🔧 Interfaces found: ${this.interfaceCount}`);
      console.log(`📋 Unique fields: ${this.fieldInventory.size}`);
      console.log(`📤 Exported interfaces: ${this.exportedInterfaces.size}`);
      
    } catch (error) {
      console.error('❌ Extraction failed:', error.message);
      throw error;
    }
  }

  /**
   * Recursively scan directory for TypeScript files
   */
  async scanDirectory(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      // Skip excluded patterns
      if (this.excludePatterns.some(pattern => fullPath.includes(pattern))) {
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
   * Process individual file for interfaces
   */
  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.fileCount++;
      
      // Remove comments to avoid false matches
      const cleanContent = content.replace(this.commentPattern, '');
      
      // Extract interfaces
      let match;
      while ((match = this.interfacePattern.exec(cleanContent)) !== null) {
        const [fullMatch, interfaceName, interfaceBody] = match;
        const isExported = fullMatch.startsWith('export');
        
        const interfaceData = {
          name: interfaceName,
          filePath: filePath.replace(/\\/g, '/'),
          isExported,
          fields: this.extractFields(interfaceBody),
          rawDefinition: fullMatch.trim()
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
      }
      
    } catch (error) {
      console.warn(`⚠️  Error processing ${filePath}:`, error.message);
    }
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
        required: !optional
      });
    }
    
    return fields;
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    const interfacesByFile = {};
    const interfacesByName = {};
    const fieldFrequency = {};
    
    // Group interfaces by file
    for (const [key, interfaceData] of this.interfaces) {
      const { filePath } = interfaceData;
      if (!interfacesByFile[filePath]) {
        interfacesByFile[filePath] = [];
      }
      interfacesByFile[filePath].push(interfaceData);
      
      // Track interface names
      if (!interfacesByName[interfaceData.name]) {
        interfacesByName[interfaceData.name] = [];
      }
      interfacesByName[interfaceData.name].push(interfaceData);
      
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
        scanTimestamp: new Date().toISOString()
      },
      interfacesByFile,
      interfacesByName,
      exportedInterfaces: Object.fromEntries(this.exportedInterfaces),
      fieldFrequency: Object.entries(fieldFrequency)
        .sort(([,a], [,b]) => b - a)
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}),
      allFields: Array.from(this.fieldInventory).sort()
    };
  }

  /**
   * Generate field mapping for Make.com integration
   */
  generateFieldMapping() {
    const mapping = {
      coreFields: [],
      emotionalFields: [],
      sparkSplitFields: [],
      orchestratorFields: [],
      mcpFields: [],
      allUniqueFields: Array.from(this.fieldInventory).sort()
    };
    
    // Categorize fields based on patterns
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
      if (this.isOrchestratorField(field)) {
        mapping.orchestratorFields.push(field);
      }
      if (this.isMCPField(field)) {
        mapping.mcpFields.push(field);
      }
    }
    
    return mapping;
  }

  /**
   * Generate Make.com scenario mapping
   */
  generateMakeComMapping() {
    const makeComFields = {};
    
    // Extract key interfaces for Make.com
    const keyInterfaces = [
      'EmotionalSovereigntyRequest',
      'EmotionalSovereigntyResponse', 
      'SparkSplitInput',
      'SparkSplitOutput',
      'BusinessPlanInput',
      'StructuredIntent'
    ];
    
    for (const interfaceName of keyInterfaces) {
      const interfaceData = this.exportedInterfaces.get(interfaceName);
      if (interfaceData) {
        makeComFields[interfaceName] = {
          filePath: interfaceData.filePath,
          fields: interfaceData.fields.map(field => ({
            name: field.name,
            type: field.type,
            required: field.required,
            makeComType: this.mapToMakeComType(field.type)
          }))
        };
      }
    }
    
    return {
      keyInterfaces: makeComFields,
      webhookPayloadStructure: this.generateWebhookStructure(),
      airtableFieldMapping: this.generateAirtableMapping()
    };
  }

  /**
   * Field categorization helpers
   */
  isCoreField(field) {
    const corePatterns = ['id', 'sessionId', 'userId', 'timestamp', 'createdAt', 'updatedAt'];
    return corePatterns.some(pattern => field.toLowerCase().includes(pattern.toLowerCase()));
  }

  isEmotionalField(field) {
    const emotionalPatterns = ['emotional', 'trust', 'resonance', 'spark', 'delight', 'frustration'];
    return emotionalPatterns.some(pattern => field.toLowerCase().includes(pattern.toLowerCase()));
  }

  isSparkSplitField(field) {
    const sparkPatterns = ['spark', 'split', 'comparison', 'sterile', 'enhanced', 'compass'];
    return sparkPatterns.some(pattern => field.toLowerCase().includes(pattern.toLowerCase()));
  }

  isOrchestratorField(field) {
    const orchestratorPatterns = ['orchestrat', 'structured', 'intent', 'context', 'arc'];
    return orchestratorPatterns.some(pattern => field.toLowerCase().includes(pattern.toLowerCase()));
  }

  isMCPField(field) {
    const mcpPatterns = ['industry', 'goal', 'tone', 'audience', 'content', 'founder'];
    return mcpPatterns.some(pattern => field.toLowerCase().includes(pattern.toLowerCase()));
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
   * Generate webhook payload structure
   */
  generateWebhookStructure() {
    const structure = {};
    
    // Get key interfaces and flatten their fields
    const keyInterfaces = ['EmotionalSovereigntyRequest', 'SparkSplitInput'];
    
    for (const interfaceName of keyInterfaces) {
      const interfaceData = this.exportedInterfaces.get(interfaceName);
      if (interfaceData) {
        structure[interfaceName] = interfaceData.fields.reduce((obj, field) => {
          obj[field.name] = {
            type: field.type,
            required: field.required,
            example: this.generateFieldExample(field.name, field.type)
          };
          return obj;
        }, {});
      }
    }
    
    return structure;
  }

  /**
   * Generate Airtable field mapping
   */
  generateAirtableMapping() {
    const mapping = {};
    
    // Map common fields to Airtable field types
    for (const field of this.fieldInventory) {
      mapping[field] = {
        airtableType: this.mapToAirtableType(field),
        category: this.categorizeField(field),
        priority: this.getFieldPriority(field)
      };
    }
    
    return mapping;
  }

  mapToAirtableType(fieldName) {
    if (fieldName.toLowerCase().includes('id')) return 'Single line text';
    if (fieldName.toLowerCase().includes('timestamp') || fieldName.toLowerCase().includes('date')) return 'Date';
    if (fieldName.toLowerCase().includes('score') || fieldName.toLowerCase().includes('count')) return 'Number';
    if (fieldName.toLowerCase().includes('flag') || fieldName.toLowerCase().includes('approved')) return 'Checkbox';
    if (fieldName.toLowerCase().includes('content') || fieldName.toLowerCase().includes('text')) return 'Long text';
    return 'Single line text';
  }

  categorizeField(fieldName) {
    if (this.isCoreField(fieldName)) return 'core';
    if (this.isEmotionalField(fieldName)) return 'emotional';
    if (this.isSparkSplitField(fieldName)) return 'sparksplit';
    return 'general';
  }

  getFieldPriority(fieldName) {
    const highPriority = ['sessionId', 'userId', 'trustScore', 'sparkResonance', 'finalTrustScore'];
    const mediumPriority = ['emotionalContext', 'structuredIntent', 'productType'];
    
    if (highPriority.some(p => fieldName.includes(p))) return 'high';
    if (mediumPriority.some(p => fieldName.includes(p))) return 'medium';
    return 'low';
  }

  generateFieldExample(fieldName, fieldType) {
    if (fieldName.includes('sessionId')) return 'sess_abc123';
    if (fieldName.includes('userId')) return 'user_xyz789';
    if (fieldName.includes('score')) return '4.2';
    if (fieldName.includes('timestamp')) return '2025-01-27T10:30:00Z';
    if (fieldType.includes('boolean')) return 'true';
    if (fieldType.includes('number')) return '42';
    return 'example_value';
  }

  /**
   * Write all results to files
   */
  writeResults(report, fieldMapping, makeComMapping) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Write comprehensive report
    fs.writeFileSync(
      `interface-extraction-report-${timestamp}.json`,
      JSON.stringify(report, null, 2)
    );
    
    // Write field mapping
    fs.writeFileSync(
      `field-mapping-${timestamp}.json`,
      JSON.stringify(fieldMapping, null, 2)
    );
    
    // Write Make.com mapping
    fs.writeFileSync(
      `makecom-mapping-${timestamp}.json`,
      JSON.stringify(makeComMapping, null, 2)
    );
    
    // Write simple field list for quick reference
    fs.writeFileSync(
      `all-fields-${timestamp}.txt`,
      Array.from(this.fieldInventory).sort().join('\n')
    );
    
    // Write CSV for spreadsheet analysis
    const csvContent = [
      'Field Name,Frequency,Category,Priority,Airtable Type',
      ...Array.from(this.fieldInventory).map(field => {
        const freq = Object.entries(report.fieldFrequency).find(([f]) => f === field)?.[1] || 0;
        return `${field},${freq},${this.categorizeField(field)},${this.getFieldPriority(field)},${this.mapToAirtableType(field)}`;
      })
    ].join('\n');
    
    fs.writeFileSync(`field-analysis-${timestamp}.csv`, csvContent);
    
    console.log(`📄 Reports written:`);
    console.log(`   - interface-extraction-report-${timestamp}.json`);
    console.log(`   - field-mapping-${timestamp}.json`);
    console.log(`   - makecom-mapping-${timestamp}.json`);
    console.log(`   - all-fields-${timestamp}.txt`);
    console.log(`   - field-analysis-${timestamp}.csv`);
  }
}

// Run the extraction
if (require.main === module) {
  const extractor = new InterfaceExtractor();
  extractor.extractAllInterfaces().catch(console.error);
}

module.exports = InterfaceExtractor; 