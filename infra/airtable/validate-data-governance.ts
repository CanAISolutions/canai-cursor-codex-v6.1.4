/**
 * CanAI Airtable Data Governance Validation Script
 * Validates complete data lineage, relationships, and governance before production launch
 * Provides Collibra-level confidence in data architecture
 */

import * as fs from 'fs';
import * as path from 'path';

interface TableDefinition {
  tableName: string;
  description: string;
  version: string;
  fieldsFile: string;
  schemaFile: string;
  mockFile: string;
  testFile: string;
  codexEnforcement: {
    auditTrail: boolean;
    fallbackLogic: string;
    versioned: boolean;
  };
}

interface FieldDefinition {
  fieldName: string;
  fieldType: string;
  required: boolean;
  default: any;
  emotionalRole: string;
  dataSensitivity: string;
  contextScope: string;
  orchestrationNotes: string;
  codexEnforcement: {
    required: boolean;
    fallbackLogic: string;
    auditTrail: boolean;
  };
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    tablesValidated: number;
    fieldsValidated: number;
    relationshipsValidated: number;
    governanceScore: number;
  };
}

interface DataLineage {
  sourceTable: string;
  sourceField: string;
  targetTable: string;
  targetField: string;
  relationshipType: 'primary_key' | 'foreign_key' | 'reference' | 'dependency';
}

export class DataGovernanceValidator {
  private tablesPath: string;
  private fieldsPath: string;
  private schemasPath: string;
  private tables: Map<string, TableDefinition>;
  private fields: Map<string, FieldDefinition[]>;
  private lineage: DataLineage[];
  private validationResult: ValidationResult;

  constructor() {
    this.tablesPath = path.join(__dirname, 'tables');
    this.fieldsPath = path.join(__dirname, 'fields');
    this.schemasPath = path.join(__dirname, 'schemas');
    this.tables = new Map();
    this.fields = new Map();
    this.lineage = [];
    this.validationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      summary: {
        tablesValidated: 0,
        fieldsValidated: 0,
        relationshipsValidated: 0,
        governanceScore: 0
      }
    };
  }

  public async validateCompleteGovernance(): Promise<ValidationResult> {
    console.log('🔍 Starting Complete Data Governance Validation...\n');

    try {
      // Step 1: Load and validate table definitions
      await this.loadTableDefinitions();
      
      // Step 2: Load and validate field definitions
      await this.loadFieldDefinitions();
      
      // Step 3: Validate schema files exist and are complete
      await this.validateSchemaFiles();
      
      // Step 4: Validate field lineage and relationships
      await this.validateFieldLineage();
      
      // Step 5: Validate data governance rules
      await this.validateGovernanceRules();
      
      // Step 6: Validate cross-table dependencies
      await this.validateCrossTableDependencies();
      
      // Step 7: Generate governance score
      this.calculateGovernanceScore();
      
      // Step 8: Generate validation report
      this.generateValidationReport();

    } catch (error) {
      this.validationResult.isValid = false;
      this.validationResult.errors.push(`Critical validation error: ${error.message}`);
    }

    return this.validationResult;
  }

  private async loadTableDefinitions(): Promise<void> {
    console.log('📊 Loading table definitions...');
    
    const tableFiles = fs.readdirSync(this.tablesPath)
      .filter(file => file.endsWith('.json') && !file.includes('.test.') && !file.includes('.mock.'));

    for (const file of tableFiles) {
      try {
        const filePath = path.join(this.tablesPath, file);
        const tableData = JSON.parse(fs.readFileSync(filePath, 'utf8')) as TableDefinition;
        
        // Validate required table properties
        this.validateTableDefinition(tableData, file);
        
        this.tables.set(tableData.tableName, tableData);
        this.validationResult.summary.tablesValidated++;
        
      } catch (error) {
        this.validationResult.errors.push(`Failed to load table definition ${file}: ${error.message}`);
      }
    }

    console.log(`✅ Loaded ${this.validationResult.summary.tablesValidated} table definitions`);
  }

  private validateTableDefinition(table: TableDefinition, fileName: string): void {
    const requiredFields = ['tableName', 'description', 'version', 'fieldsFile', 'schemaFile'];
    
    for (const field of requiredFields) {
      if (!table[field]) {
        this.validationResult.errors.push(`Table ${fileName} missing required field: ${field}`);
      }
    }

    // Validate codex enforcement
    if (!table.codexEnforcement || !table.codexEnforcement.auditTrail) {
      this.validationResult.errors.push(`Table ${table.tableName} missing required codex enforcement`);
    }
  }

  private async loadFieldDefinitions(): Promise<void> {
    console.log('🔗 Loading field definitions...');
    
    const tableEntries = Array.from(this.tables.entries());
    for (const [tableName, tableData] of tableEntries) {
      try {
        const fieldsFilePath = path.join(this.fieldsPath, path.basename(tableData.fieldsFile));
        
        if (!fs.existsSync(fieldsFilePath)) {
          this.validationResult.errors.push(`Fields file not found for table ${tableName}: ${fieldsFilePath}`);
          continue;
        }

        const fieldsData = JSON.parse(fs.readFileSync(fieldsFilePath, 'utf8')) as FieldDefinition[];
        
        // Validate each field definition
        for (const field of fieldsData) {
          this.validateFieldDefinition(field, tableName);
          this.validationResult.summary.fieldsValidated++;
        }
        
        this.fields.set(tableName, fieldsData);
        
      } catch (error) {
        this.validationResult.errors.push(`Failed to load fields for table ${tableName}: ${error.message}`);
      }
    }

    console.log(`✅ Loaded ${this.validationResult.summary.fieldsValidated} field definitions`);
  }

  private validateFieldDefinition(field: FieldDefinition, tableName: string): void {
    const requiredFields = ['fieldName', 'fieldType', 'emotionalRole', 'dataSensitivity', 'contextScope'];
    
    for (const requiredField of requiredFields) {
      if (!field[requiredField]) {
        this.validationResult.errors.push(`Field ${field.fieldName} in table ${tableName} missing: ${requiredField}`);
      }
    }

    // Validate emotional role
    const validEmotionalRoles = ['identity', 'traceability', 'clarity', 'trust', 'emotion', 'context', 'resilience', 'improvement'];
    if (field.emotionalRole && !validEmotionalRoles.includes(field.emotionalRole)) {
      this.validationResult.warnings.push(`Field ${field.fieldName} has invalid emotional role: ${field.emotionalRole}`);
    }

    // Validate data sensitivity
    const validSensitivities = ['internal', 'pii', 'public'];
    if (field.dataSensitivity && !validSensitivities.includes(field.dataSensitivity)) {
      this.validationResult.errors.push(`Field ${field.fieldName} has invalid data sensitivity: ${field.dataSensitivity}`);
    }

    // Validate codex enforcement
    if (!field.codexEnforcement || field.codexEnforcement.auditTrail === undefined) {
      this.validationResult.errors.push(`Field ${field.fieldName} in table ${tableName} missing codex enforcement`);
    }
  }

  private async validateSchemaFiles(): Promise<void> {
    console.log('📋 Validating schema files...');
    
    const tableEntries = Array.from(this.tables.entries());
    for (const [tableName, tableData] of tableEntries) {
      const schemaFilePath = path.join(this.schemasPath, path.basename(tableData.schemaFile));
      
      if (!fs.existsSync(schemaFilePath)) {
        this.validationResult.errors.push(`Schema file not found for table ${tableName}: ${schemaFilePath}`);
        continue;
      }

      try {
        const schemaContent = fs.readFileSync(schemaFilePath, 'utf8');
        
        // Validate schema contains required sections
        const requiredSections = ['Table Overview', 'Fields', 'Orchestration Mapping'];
        for (const section of requiredSections) {
          if (!schemaContent.includes(section)) {
            this.validationResult.warnings.push(`Schema for ${tableName} missing section: ${section}`);
          }
        }

        // Validate schema mentions all fields
        const tableFields = this.fields.get(tableName) || [];
        for (const field of tableFields) {
          if (!schemaContent.includes(field.fieldName)) {
            this.validationResult.warnings.push(`Schema for ${tableName} missing field documentation: ${field.fieldName}`);
          }
        }

      } catch (error) {
        this.validationResult.errors.push(`Failed to validate schema for ${tableName}: ${error.message}`);
      }
    }

    console.log('✅ Schema files validated');
  }

  private async validateFieldLineage(): Promise<void> {
    console.log('🔗 Validating field lineage and relationships...');
    
    // Define universal fields that should exist in all tables
    const universalFields = ['recordId', 'createdAt', 'updatedAt'];
    
    // Define common foreign key patterns
    const foreignKeyPatterns = [
      { field: 'sessionId', targetTable: 'SessionAnalytics', targetField: 'recordId' },
      { field: 'userId', targetTable: 'UserContext', targetField: 'recordId' },
      { field: 'promptType', targetTable: 'PromptTypeGlossary', targetField: 'typeName' }
    ];

    const fieldEntries = Array.from(this.fields.entries());
    for (const [tableName, fields] of fieldEntries) {
      // Validate universal fields exist
      for (const universalField of universalFields) {
        const hasField = fields.some(f => f.fieldName === universalField);
        if (!hasField) {
          this.validationResult.errors.push(`Table ${tableName} missing universal field: ${universalField}`);
        }
      }

      // Validate foreign key relationships
      for (const field of fields) {
        const fkPattern = foreignKeyPatterns.find(p => p.field === field.fieldName);
        if (fkPattern) {
          // Record lineage relationship
          this.lineage.push({
            sourceTable: tableName,
            sourceField: field.fieldName,
            targetTable: fkPattern.targetTable,
            targetField: fkPattern.targetField,
            relationshipType: 'foreign_key'
          });
          this.validationResult.summary.relationshipsValidated++;
        }
      }
    }

    console.log(`✅ Validated ${this.validationResult.summary.relationshipsValidated} relationships`);
  }

  private async validateGovernanceRules(): Promise<void> {
    console.log('🛡️ Validating governance rules...');
    
    const fieldEntries = Array.from(this.fields.entries());
    for (const [tableName, fields] of fieldEntries) {
      for (const field of fields) {
        // Validate PII fields have proper governance
        if (field.dataSensitivity === 'pii') {
          if (!field.orchestrationNotes.toLowerCase().includes('consent') && 
              !field.orchestrationNotes.toLowerCase().includes('gdpr')) {
            this.validationResult.warnings.push(`PII field ${field.fieldName} in ${tableName} should mention consent/GDPR`);
          }
        }

        // Validate required fields have proper fallback logic
        if (field.required && !field.codexEnforcement.fallbackLogic.includes('Block')) {
          this.validationResult.warnings.push(`Required field ${field.fieldName} in ${tableName} should block creation if missing`);
        }

        // Validate identity fields use proper types
        if (field.emotionalRole === 'identity' && !['ULID', 'string'].includes(field.fieldType)) {
          this.validationResult.warnings.push(`Identity field ${field.fieldName} should use ULID or string type`);
        }
      }
    }

    console.log('✅ Governance rules validated');
  }

  private async validateCrossTableDependencies(): Promise<void> {
    console.log('🔄 Validating cross-table dependencies...');
    
    // Define expected table dependencies based on the master plan
    const expectedDependencies = [
      { source: 'PromptLogs', dependencies: ['SessionAnalytics', 'UserContext'] },
      { source: 'SparkSplitAnalytics', dependencies: ['PromptLogs', 'SessionAnalytics'] },
      { source: 'OutputGoldmine', dependencies: ['SessionAnalytics', 'PromptLogs'] },
      { source: 'AIMiningAgents', dependencies: ['OutputGoldmine', 'PromptLogs'] },
      { source: 'UserAIResume', dependencies: ['UserContext', 'SessionAnalytics'] }
    ];

    for (const dependency of expectedDependencies) {
      const sourceTable = this.tables.get(dependency.source);
      if (!sourceTable) {
        this.validationResult.errors.push(`Expected table not found: ${dependency.source}`);
        continue;
      }

      for (const depTable of dependency.dependencies) {
        if (!this.tables.has(depTable)) {
          this.validationResult.errors.push(`Dependency table not found: ${depTable} for ${dependency.source}`);
        }
      }
    }

    console.log('✅ Cross-table dependencies validated');
  }

  private calculateGovernanceScore(): void {
    const totalTables = this.tables.size;
    const totalFields = this.validationResult.summary.fieldsValidated;
    const totalErrors = this.validationResult.errors.length;
    const totalWarnings = this.validationResult.warnings.length;

    // Calculate score based on completeness and quality
    let score = 100;
    
    // Deduct for errors (major issues)
    score -= totalErrors * 5;
    
    // Deduct for warnings (minor issues)
    score -= totalWarnings * 1;
    
    // Bonus for comprehensive coverage
    if (totalTables >= 35) score += 5;
    if (totalFields >= 500) score += 5;
    if (this.validationResult.summary.relationshipsValidated >= 100) score += 5;

    this.validationResult.summary.governanceScore = Math.max(0, Math.min(100, score));
  }

  private generateValidationReport(): void {
    const { summary, errors, warnings } = this.validationResult;
    
    console.log('\n📊 DATA GOVERNANCE VALIDATION REPORT');
    console.log('=====================================');
    console.log(`Tables Validated: ${summary.tablesValidated}`);
    console.log(`Fields Validated: ${summary.fieldsValidated}`);
    console.log(`Relationships Validated: ${summary.relationshipsValidated}`);
    console.log(`Governance Score: ${summary.governanceScore}/100`);
    console.log(`Errors: ${errors.length}`);
    console.log(`Warnings: ${warnings.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ ERRORS:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }

    // Determine overall status
    if (errors.length === 0 && summary.governanceScore >= 95) {
      console.log('\n✅ STATUS: READY FOR PRODUCTION LAUNCH');
      console.log('Enterprise-grade data governance achieved!');
    } else if (errors.length === 0 && summary.governanceScore >= 90) {
      console.log('\n🟡 STATUS: READY WITH MINOR OPTIMIZATIONS');
      console.log('Good governance, minor improvements recommended.');
    } else {
      console.log('\n❌ STATUS: REQUIRES ATTENTION BEFORE LAUNCH');
      console.log('Critical issues must be resolved.');
      this.validationResult.isValid = false;
    }
  }

  public exportLineageReport(): string {
    const lineageReport = `# Data Lineage Report
Generated: ${new Date().toISOString()}

## Field Relationships
${this.lineage.map(rel => 
  `- **${rel.sourceTable}.${rel.sourceField}** → **${rel.targetTable}.${rel.targetField}** (${rel.relationshipType})`
).join('\n')}

## Table Dependencies
${Array.from(this.tables.keys()).map(table => {
  const dependencies = this.lineage
    .filter(rel => rel.sourceTable === table)
    .map(rel => rel.targetTable);
  return `- **${table}**: ${dependencies.length > 0 ? dependencies.join(', ') : 'No dependencies'}`;
}).join('\n')}

## Governance Summary
- **Total Tables**: ${this.tables.size}
- **Total Fields**: ${this.validationResult.summary.fieldsValidated}
- **Total Relationships**: ${this.validationResult.summary.relationshipsValidated}
- **Governance Score**: ${this.validationResult.summary.governanceScore}/100
`;

    return lineageReport;
  }
}

// CLI execution
if (require.main === module) {
  const validator = new DataGovernanceValidator();
  
  validator.validateCompleteGovernance()
    .then(result => {
      // Export lineage report
      const lineageReport = validator.exportLineageReport();
      fs.writeFileSync(
        path.join(__dirname, 'DATA-LINEAGE-REPORT.md'), 
        lineageReport
      );
      
      // Export validation results
      fs.writeFileSync(
        path.join(__dirname, 'validation-results.json'),
        JSON.stringify(result, null, 2)
      );
      
      console.log('\n📄 Reports exported:');
      console.log('- DATA-LINEAGE-REPORT.md');
      console.log('- validation-results.json');
      
      process.exit(result.isValid ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    });
} 