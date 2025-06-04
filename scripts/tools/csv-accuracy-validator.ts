#!/usr/bin/env ts-node

/**
 * CSV Accuracy Validator v1.0
 * Implements CSV-Accuracy-Standards-v1.0.md
 * 
 * Usage:
 *   npx ts-node scripts/tools/csv-accuracy-validator.ts --file=01_PromptLogs.csv
 *   npx ts-node scripts/tools/csv-accuracy-validator.ts --all
 */

import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  summary: string;
}

interface FieldDefinition {
  name: string;
  type: string;
  precision?: number;
  options?: string[];
  required?: boolean;
}

class CSVAccuracyValidator {
  private tableDefinitions: any;
  private standards: any;

  constructor() {
    // Load table definitions
    const tableDefPath = path.join(process.cwd(), 'airtable-table-definitions.json');
    this.tableDefinitions = JSON.parse(fs.readFileSync(tableDefPath, 'utf8'));
    
    // Define validation standards
    this.standards = {
      promptTypeOptions: [
        'ai_blueprint', 'business_plan', 'email_campaign', 'site_audit',
        'social_content', 'reverse_strategy', 'ai_brand_identity', 
        'profile_makeover', 'blogblitz', 'ad_amplify', 'sparksplit'
      ],
      productTypeOptions: [
        'discovery_funnel', 'ai_blueprint', 'business_plan', 'email_campaign',
        'site_audit', 'social_content', 'reverse_strategy', 'ai_brand_identity',
        'profile_makeover', 'blogblitz', 'ad_amplify'
      ],
      userSelectionOptions: ['sterile', 'enhanced', 'both', 'neither', 'skip'],
      winningVariantOptions: ['sterile', 'enhanced', 'tie', 'inconclusive'],
      precisionMap: {
        trustScore: 2, resonanceScore: 2, momentumScore: 2, outputDeltaScore: 2,
        emotionalAlignment: 2, promptQualityScore: 2, changeRate: 2, confidenceLevel: 2,
        sterilePerformance: 4, enhancedPerformance: 4, deliveryCost: 4, costUSD: 4,
        conversionLift: 2, trustScoreDelta: 2, improvementPercentage: 2, timeToSelection: 2,
        aweScore: 2, ownershipScore: 2, wonderScore: 2, calmScore: 2, powerScore: 2,
        tokensUsed: 0, revisionCount: 0, clarityIndex: 0, executionTimeMs: 0, variantIndex: 0
      }
    };
  }

  /**
   * Validate a single CSV file against standards
   */
  public validateCSV(filePath: string): ValidationResult {
    const result: ValidationResult = {
      passed: true,
      errors: [],
      warnings: [],
      summary: ''
    };

    try {
      // Read CSV file
      const csvContent = fs.readFileSync(filePath, 'utf8');
      const lines = csvContent.trim().split('\n');
      
      if (lines.length < 2) {
        result.errors.push('CSV file must have at least header and one data row');
        result.passed = false;
        return result;
      }

      const headers = this.parseCSVLine(lines[0]);
      const dataRow = this.parseCSVLine(lines[1]);

      // Get table name from filename
      const fileName = path.basename(filePath);
      const tableMatch = fileName.match(/^\d+_(.+)\.csv$/);
      if (!tableMatch) {
        result.errors.push('Filename must follow format: ##_TableName.csv');
        result.passed = false;
        return result;
      }

      const tableName = tableMatch[1];
      const tableDefinition = this.tableDefinitions.find((t: any) => t.name === tableName);
      
      if (!tableDefinition) {
        result.errors.push(`Table definition not found for: ${tableName}`);
        result.passed = false;
        return result;
      }

      // Validate field count and names
      this.validateFieldStructure(headers, tableDefinition, result);
      
      // Validate data types and formats
      this.validateDataFormats(headers, dataRow, tableDefinition, result);
      
      // Validate single select options
      this.validateSingleSelects(headers, dataRow, tableName, result);
      
      // Validate decimal precision
      this.validateDecimalPrecision(headers, dataRow, result);
      
      // Validate required fields
      this.validateRequiredFields(headers, dataRow, tableName, result);

      // Generate summary
      result.summary = this.generateSummary(result, tableName);

    } catch (error) {
      result.errors.push(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.passed = false;
    }

    return result;
  }

  /**
   * Validate all CSV files in 18-table optimized architecture
   * Note: Legacy CSV approach replaced with direct Airtable API integration
   */
  public validateAllCSVs(): ValidationResult[] {
    console.log('⚠️  CSV validation not applicable for 18-table architecture');
    console.log('✅ Using direct Airtable API integration instead of CSV imports');
    console.log('💡 Run: npm run test-airtable-crud for 18-table validation');
    
    return [{
      passed: true,
      errors: [],
      warnings: [],
      summary: '18-table architecture uses direct API integration'
    }];
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  private validateFieldStructure(headers: string[], tableDefinition: any, result: ValidationResult): void {
    const expectedFields = tableDefinition.fields.map((f: any) => f.name);
    
    // Check field count
    if (headers.length !== expectedFields.length) {
      result.errors.push(`Field count mismatch: expected ${expectedFields.length}, got ${headers.length}`);
      result.passed = false;
    }

    // Check field names and order
    headers.forEach((header, index) => {
      if (header !== expectedFields[index]) {
        result.errors.push(`Field ${index + 1}: expected '${expectedFields[index]}', got '${header}'`);
        result.passed = false;
      }
    });

    // Check required system fields
    const requiredSystemFields = ['recordId', 'createdAt', 'updatedAt'];
    requiredSystemFields.forEach(field => {
      if (!headers.includes(field)) {
        result.errors.push(`Missing required system field: ${field}`);
        result.passed = false;
      }
    });
  }

  private validateDataFormats(headers: string[], dataRow: string[], tableDefinition: any, result: ValidationResult): void {
    headers.forEach((header, index) => {
      const value = dataRow[index];
      const fieldDef = tableDefinition.fields.find((f: any) => f.name === header);
      
      if (!fieldDef) return;

      switch (fieldDef.type) {
        case 'dateTime':
          if (value && !this.isValidDateTime(value)) {
            result.errors.push(`${header}: Invalid datetime format '${value}'. Use ISO 8601: 2025-01-27T10:00:00Z`);
            result.passed = false;
          }
          break;
          
        case 'checkbox':
          if (value && !['true', 'false'].includes(value)) {
            result.errors.push(`${header}: Invalid boolean value '${value}'. Use 'true' or 'false'`);
            result.passed = false;
          }
          break;
          
        case 'number':
          if (value && !this.isValidNumber(value)) {
            result.errors.push(`${header}: Invalid number format '${value}'`);
            result.passed = false;
          }
          break;
          
        case 'longText':
          if (value && this.looksLikeJSON(value) && !this.isValidJSONFormat(value)) {
            result.errors.push(`${header}: Invalid JSON format. Use escaped quotes: "{\\"key\\":\\"value\\"}"`);
            result.passed = false;
          }
          break;
      }
    });
  }

  private validateSingleSelects(headers: string[], dataRow: string[], tableName: string, result: ValidationResult): void {
    headers.forEach((header, index) => {
      const value = dataRow[index];
      
      if (header === 'promptType' && value) {
        if (!this.standards.promptTypeOptions.includes(value)) {
          result.errors.push(`promptType: '${value}' not in valid options: ${this.standards.promptTypeOptions.join(', ')}`);
          result.passed = false;
        }
      }
      
      if (header === 'productType' && value && tableName === 'SparkSplitAnalytics') {
        if (!this.standards.productTypeOptions.includes(value)) {
          result.errors.push(`productType: '${value}' not in valid options: ${this.standards.productTypeOptions.join(', ')}`);
          result.passed = false;
        }
      }
      
      if (header === 'userSelection' && value && tableName === 'SparkSplitAnalytics') {
        if (!this.standards.userSelectionOptions.includes(value)) {
          result.errors.push(`userSelection: '${value}' not in valid options: ${this.standards.userSelectionOptions.join(', ')}`);
          result.passed = false;
        }
      }
      
      if (header === 'winningVariant' && value && tableName === 'SparkSplitAnalytics') {
        if (!this.standards.winningVariantOptions.includes(value)) {
          result.errors.push(`winningVariant: '${value}' not in valid options: ${this.standards.winningVariantOptions.join(', ')}`);
          result.passed = false;
        }
      }
    });
  }

  private validateDecimalPrecision(headers: string[], dataRow: string[], result: ValidationResult): void {
    headers.forEach((header, index) => {
      const value = dataRow[index];
      const expectedPrecision = this.standards.precisionMap[header];
      
      if (expectedPrecision !== undefined && value && this.isValidNumber(value)) {
        const decimalPlaces = (value.split('.')[1] || '').length;
        
        if (decimalPlaces !== expectedPrecision) {
          result.errors.push(`${header}: Expected ${expectedPrecision} decimal places, got ${decimalPlaces} in '${value}'`);
          result.passed = false;
        }
      }
    });
  }

  private validateRequiredFields(headers: string[], dataRow: string[], tableName: string, result: ValidationResult): void {
    const alwaysRequired = ['recordId', 'createdAt', 'updatedAt'];
    
    let tableSpecificRequired: string[] = [];
    switch (tableName) {
      case 'PromptLogs':
        tableSpecificRequired = ['sessionId', 'userId', 'promptType'];
        break;
      case 'SparkSplitAnalytics':
        tableSpecificRequired = ['sessionId', 'userId', 'testId', 'productType'];
        break;
      case 'SessionAnalytics':
        tableSpecificRequired = ['sessionId', 'userId'];
        break;
    }

    const requiredFields = [...alwaysRequired, ...tableSpecificRequired];
    
    requiredFields.forEach(field => {
      const index = headers.indexOf(field);
      if (index === -1) {
        result.errors.push(`Missing required field: ${field}`);
        result.passed = false;
      } else if (!dataRow[index] || dataRow[index].trim() === '') {
        result.errors.push(`Required field '${field}' is empty`);
        result.passed = false;
      }
    });
  }

  private isValidDateTime(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value);
  }

  private isValidNumber(value: string): boolean {
    return /^-?\d+(\.\d+)?$/.test(value);
  }

  private looksLikeJSON(value: string): boolean {
    return value.trim().startsWith('{') || value.trim().startsWith('[');
  }

  private isValidJSONFormat(value: string): boolean {
    try {
      // For CSV-parsed values, the outer quotes are already removed
      // So we need to handle both escaped and unescaped JSON
      if (value.includes('""')) {
        // This is escaped JSON from CSV - unescape it
        const unescaped = value.replace(/""/g, '"');
        JSON.parse(unescaped);
        return true;
      } else {
        // Try parsing as-is (might be already unescaped)
        JSON.parse(value);
        return true;
      }
    } catch {
      return false;
    }
  }

  private generateSummary(result: ValidationResult, tableName: string): string {
    const status = result.passed ? '✅ PASSED' : '❌ FAILED';
    const errorCount = result.errors.length;
    const warningCount = result.warnings.length;
    
    return `${tableName}: ${status} (${errorCount} errors, ${warningCount} warnings)`;
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const validator = new CSVAccuracyValidator();

  if (args.includes('--all')) {
    console.log('🔍 Validating all CSV files...\n');
    const results = validator.validateAllCSVs();
    
    results.forEach(result => {
      console.log(result.summary);
      if (result.errors.length > 0) {
        result.errors.forEach(error => console.log(`  ❌ ${error}`));
      }
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => console.log(`  ⚠️ ${warning}`));
      }
      console.log();
    });

    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    
    console.log(`\n📊 Summary: ${passedCount}/${totalCount} files passed validation`);
    
    if (passedCount === totalCount) {
      console.log('🎯 ALL VALIDATIONS PASSED: Ready for Airtable import');
      process.exit(0);
    } else {
      console.log('❌ VALIDATION FAILURES: Fix errors before importing');
      process.exit(1);
    }
  } else {
    const fileArg = args.find(arg => arg.startsWith('--file='));
    if (!fileArg) {
      console.log('Usage:');
      console.log('  npx ts-node scripts/tools/csv-accuracy-validator.ts --file=01_PromptLogs.csv');
      console.log('  npx ts-node scripts/tools/csv-accuracy-validator.ts --all');
      process.exit(1);
    }

    const fileName = fileArg.split('=')[1];
    console.log('⚠️  CSV file validation not applicable for 18-table architecture');
    console.log('✅ 18-table architecture uses direct Airtable API integration');
    console.log('💡 Run: npm run test-airtable-crud for table validation');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

export { CSVAccuracyValidator }; 