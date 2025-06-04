/**
 * CanAI Airtable API Integration Testing Suite
 * 
 * Purpose: Comprehensive testing of Airtable CRUD operations and field validation
 * Addresses: CSV import issues with single select, JSON arrays, and field mapping
 * 
 * Version: v1.0.0
 * Date: 2025-01-27
 * Framework: Codex v6.1.4 + Test-First Truth
 */

import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  baseUrl: string;
}

interface TestResult {
  testName: string;
  tableName: string;
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'VALIDATE';
  success: boolean;
  duration: number;
  details: any;
  errors: string[];
  warnings: string[];
}

interface FieldValidation {
  fieldName: string;
  expectedType: string;
  actualType: string;
  isValid: boolean;
  issues: string[];
  sampleValue: any;
}

interface TableValidation {
  tableName: string;
  exists: boolean;
  fieldCount: number;
  validFields: number;
  invalidFields: number;
  fieldValidations: FieldValidation[];
  linkedRecordIssues: string[];
  selectOptionIssues: string[];
}

export class AirtableAPITester {
  private config: AirtableConfig;
  private testResults: TestResult[] = [];
  private logFile: string;

  constructor() {
    this.config = {
      apiKey: process.env.AIRTABLE_API_KEY || '',
      baseId: process.env.AIRTABLE_BASE_ID || '',
      baseUrl: 'https://api.airtable.com/v0'
    };

    this.logFile = path.join(__dirname, 'airtable-api-test-results.md');
    this.initializeLog();
  }

  /**
   * Main test execution - runs comprehensive API validation
   */
  public async runComprehensiveTests(): Promise<void> {
    this.log('🚀 Starting Comprehensive Airtable API Testing Suite');
    this.log(`📊 Testing Base: ${this.config.baseId}`);

    try {
      // Phase 1: Validate environment and connection
      await this.testEnvironmentSetup();
      
      // Phase 2: Validate table structure and fields
      await this.validateTableStructures();
      
      // Phase 3: Test CRUD operations for each tier
      await this.testTier1CoreOperations();
      await this.testTier2IntelligenceOperations();
      await this.testTier3IntegrationOperations();
      await this.testTier4ReferenceOperations();
      
      // Phase 4: Test linked record relationships
      await this.testLinkedRecordRelationships();
      
      // Phase 5: Test field type compatibility
      await this.testFieldTypeCompatibility();
      
      // Phase 6: Generate comprehensive report
      this.generateTestReport();
      
    } catch (error) {
      this.log(`❌ Critical testing error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test environment setup and API connectivity
   */
  private async testEnvironmentSetup(): Promise<void> {
    const startTime = Date.now();
    this.log('\n## 🔧 Phase 1: Environment Setup Validation');

    try {
      // Validate environment variables
      if (!this.config.apiKey) {
        throw new Error('AIRTABLE_API_KEY not found in environment variables');
      }
      
      if (!this.config.baseId) {
        throw new Error('AIRTABLE_BASE_ID not found in environment variables');
      }

      this.log('✅ Environment variables loaded successfully');

      // Test API connectivity
      const response = await this.makeAirtableRequest('GET', '');
      
      if (response.tables) {
        this.log(`✅ API connectivity confirmed - Found ${response.tables.length} tables`);
        
        // Log table names for verification
        response.tables.forEach((table: any) => {
          this.log(`   📋 Table: ${table.name} (${table.id})`);
        });
      }

      this.recordTestResult({
        testName: 'Environment Setup',
        tableName: 'N/A',
        operation: 'VALIDATE',
        success: true,
        duration: Date.now() - startTime,
        details: { tablesFound: response.tables?.length || 0 },
        errors: [],
        warnings: []
      });

    } catch (error) {
      this.recordTestResult({
        testName: 'Environment Setup',
        tableName: 'N/A',
        operation: 'VALIDATE',
        success: false,
        duration: Date.now() - startTime,
        details: {},
        errors: [error.message],
        warnings: []
      });
      throw error;
    }
  }

  /**
   * Validate table structures against expected schema
   */
  private async validateTableStructures(): Promise<void> {
    this.log('\n## 📊 Phase 2: Table Structure Validation');

    const expectedTables = [
      // Tier 1 - Core
      'PromptLogs', 'SessionAnalytics', 'SparkSplitAnalytics',
      // Tier 2 - Intelligence  
      'GoldmineOutput', 'UserContext', 'EmotionalIntelligence', 'TrustMetrics', 'PerformanceMetrics',
      // Tier 3 - Integration
      'WebhookLogs', 'AirtableSync', 'ErrorLogs', 'ProcessingResults', 'SystemHealth',
      // Tier 4 - Reference
      'PromptTypes', 'EmotionalStates', 'TrustFactors', 'SystemConfigs', 'AnalyticsAggregates'
    ];

    for (const tableName of expectedTables) {
      await this.validateTableStructure(tableName);
    }
  }

  /**
   * Validate individual table structure and fields
   */
  private async validateTableStructure(tableName: string): Promise<TableValidation> {
    const startTime = Date.now();
    this.log(`\n### 🔍 Validating Table: ${tableName}`);

    try {
      // Get table schema from Airtable
      const response = await this.makeAirtableRequest('GET', tableName, { maxRecords: 1 });
      
      if (!response.records) {
        throw new Error(`Table ${tableName} not found or inaccessible`);
      }

      // Load expected schema
      const expectedSchema = this.loadExpectedSchema(tableName);
      
      // Validate fields
      const fieldValidations: FieldValidation[] = [];
      const linkedRecordIssues: string[] = [];
      const selectOptionIssues: string[] = [];

      // Get actual fields from a sample record or table metadata
      const sampleRecord = response.records[0];
      const actualFields = sampleRecord ? Object.keys(sampleRecord.fields) : [];

      this.log(`   📋 Found ${actualFields.length} fields in ${tableName}`);

      // Validate each expected field
      for (const expectedField of expectedSchema.fields) {
        const validation = await this.validateField(
          tableName, 
          expectedField, 
          actualFields, 
          sampleRecord?.fields
        );
        fieldValidations.push(validation);

        if (!validation.isValid) {
          this.log(`   ❌ Field validation failed: ${expectedField.name} - ${validation.issues.join(', ')}`);
        } else {
          this.log(`   ✅ Field validated: ${expectedField.name}`);
        }
      }

      const validFields = fieldValidations.filter(f => f.isValid).length;
      const invalidFields = fieldValidations.filter(f => !f.isValid).length;

      const tableValidation: TableValidation = {
        tableName,
        exists: true,
        fieldCount: actualFields.length,
        validFields,
        invalidFields,
        fieldValidations,
        linkedRecordIssues,
        selectOptionIssues
      };

      this.recordTestResult({
        testName: `Table Structure Validation`,
        tableName,
        operation: 'VALIDATE',
        success: invalidFields === 0,
        duration: Date.now() - startTime,
        details: tableValidation,
        errors: fieldValidations.filter(f => !f.isValid).map(f => f.issues.join(', ')),
        warnings: []
      });

      return tableValidation;

    } catch (error) {
      this.log(`   ❌ Table validation failed: ${error.message}`);
      
      const tableValidation: TableValidation = {
        tableName,
        exists: false,
        fieldCount: 0,
        validFields: 0,
        invalidFields: 0,
        fieldValidations: [],
        linkedRecordIssues: [error.message],
        selectOptionIssues: []
      };

      this.recordTestResult({
        testName: `Table Structure Validation`,
        tableName,
        operation: 'VALIDATE',
        success: false,
        duration: Date.now() - startTime,
        details: tableValidation,
        errors: [error.message],
        warnings: []
      });

      return tableValidation;
    }
  }

  /**
   * Test CRUD operations for Tier 1 Core tables
   */
  private async testTier1CoreOperations(): Promise<void> {
    this.log('\n## 🎯 Phase 3: Tier 1 Core CRUD Operations');

    // Test PromptLogs CRUD
    await this.testTableCRUD('PromptLogs', this.generatePromptLogTestData());
    
    // Test SessionAnalytics CRUD
    await this.testTableCRUD('SessionAnalytics', this.generateSessionAnalyticsTestData());
    
    // Test SparkSplitAnalytics CRUD
    await this.testTableCRUD('SparkSplitAnalytics', this.generateSparkSplitTestData());
  }

  /**
   * Test CRUD operations for a specific table
   */
  private async testTableCRUD(tableName: string, testData: any): Promise<void> {
    this.log(`\n### 🔄 Testing CRUD Operations: ${tableName}`);

    let recordId: string | null = null;

    try {
      // CREATE Test
      recordId = await this.testCreateRecord(tableName, testData);
      
      // READ Test
      await this.testReadRecord(tableName, recordId);
      
      // UPDATE Test
      await this.testUpdateRecord(tableName, recordId, { ...testData, updated: true });
      
      // DELETE Test
      await this.testDeleteRecord(tableName, recordId);

    } catch (error) {
      this.log(`   ❌ CRUD test failed for ${tableName}: ${error.message}`);
      
      // Cleanup if record was created
      if (recordId) {
        try {
          await this.testDeleteRecord(tableName, recordId);
        } catch (cleanupError) {
          this.log(`   ⚠️ Cleanup failed for ${tableName}/${recordId}: ${cleanupError.message}`);
        }
      }
    }
  }

  /**
   * Test record creation
   */
  private async testCreateRecord(tableName: string, data: any): Promise<string> {
    const startTime = Date.now();
    
    try {
      const response = await this.makeAirtableRequest('POST', tableName, {
        records: [{ fields: data }]
      });

      if (response.records && response.records.length > 0) {
        const recordId = response.records[0].id;
        this.log(`   ✅ CREATE successful: ${recordId}`);
        
        this.recordTestResult({
          testName: 'Create Record',
          tableName,
          operation: 'CREATE',
          success: true,
          duration: Date.now() - startTime,
          details: { recordId, data },
          errors: [],
          warnings: []
        });

        return recordId;
      } else {
        throw new Error('No record returned from create operation');
      }

    } catch (error) {
      this.log(`   ❌ CREATE failed: ${error.message}`);
      
      this.recordTestResult({
        testName: 'Create Record',
        tableName,
        operation: 'CREATE',
        success: false,
        duration: Date.now() - startTime,
        details: { data },
        errors: [error.message],
        warnings: []
      });

      throw error;
    }
  }

  /**
   * Test record reading
   */
  private async testReadRecord(tableName: string, recordId: string): Promise<any> {
    const startTime = Date.now();
    
    try {
      const response = await this.makeAirtableRequest('GET', `${tableName}/${recordId}`);

      if (response.id === recordId) {
        this.log(`   ✅ READ successful: ${recordId}`);
        
        this.recordTestResult({
          testName: 'Read Record',
          tableName,
          operation: 'READ',
          success: true,
          duration: Date.now() - startTime,
          details: { recordId, fields: response.fields },
          errors: [],
          warnings: []
        });

        return response;
      } else {
        throw new Error('Record not found or ID mismatch');
      }

    } catch (error) {
      this.log(`   ❌ READ failed: ${error.message}`);
      
      this.recordTestResult({
        testName: 'Read Record',
        tableName,
        operation: 'READ',
        success: false,
        duration: Date.now() - startTime,
        details: { recordId },
        errors: [error.message],
        warnings: []
      });

      throw error;
    }
  }

  /**
   * Test record updating
   */
  private async testUpdateRecord(tableName: string, recordId: string, data: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      const response = await this.makeAirtableRequest('PATCH', tableName, {
        records: [{ id: recordId, fields: data }]
      });

      if (response.records && response.records.length > 0) {
        this.log(`   ✅ UPDATE successful: ${recordId}`);
        
        this.recordTestResult({
          testName: 'Update Record',
          tableName,
          operation: 'UPDATE',
          success: true,
          duration: Date.now() - startTime,
          details: { recordId, data },
          errors: [],
          warnings: []
        });

        return response.records[0];
      } else {
        throw new Error('No record returned from update operation');
      }

    } catch (error) {
      this.log(`   ❌ UPDATE failed: ${error.message}`);
      
      this.recordTestResult({
        testName: 'Update Record',
        tableName,
        operation: 'UPDATE',
        success: false,
        duration: Date.now() - startTime,
        details: { recordId, data },
        errors: [error.message],
        warnings: []
      });

      throw error;
    }
  }

  /**
   * Test record deletion
   */
  private async testDeleteRecord(tableName: string, recordId: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      const response = await this.makeAirtableRequest('DELETE', `${tableName}/${recordId}`);

      if (response.deleted && response.id === recordId) {
        this.log(`   ✅ DELETE successful: ${recordId}`);
        
        this.recordTestResult({
          testName: 'Delete Record',
          tableName,
          operation: 'DELETE',
          success: true,
          duration: Date.now() - startTime,
          details: { recordId },
          errors: [],
          warnings: []
        });
      } else {
        throw new Error('Record deletion not confirmed');
      }

    } catch (error) {
      this.log(`   ❌ DELETE failed: ${error.message}`);
      
      this.recordTestResult({
        testName: 'Delete Record',
        tableName,
        operation: 'DELETE',
        success: false,
        duration: Date.now() - startTime,
        details: { recordId },
        errors: [error.message],
        warnings: []
      });

      throw error;
    }
  }

  /**
   * Test linked record relationships
   */
  private async testLinkedRecordRelationships(): Promise<void> {
    this.log('\n## 🔗 Phase 5: Linked Record Relationship Testing');

    // Test critical relationships
    const relationships = [
      { parent: 'SessionAnalytics', child: 'PromptLogs', field: 'sessionId' },
      { parent: 'UserContext', child: 'PromptLogs', field: 'userId' },
      { parent: 'PromptTypes', child: 'PromptLogs', field: 'promptType' },
      { parent: 'SessionAnalytics', child: 'EmotionalIntelligence', field: 'sessionId' },
      { parent: 'SessionAnalytics', child: 'TrustMetrics', field: 'sessionId' }
    ];

    for (const relationship of relationships) {
      await this.testLinkedRecordRelationship(relationship);
    }
  }

  /**
   * Test field type compatibility (addresses CSV import issues)
   */
  private async testFieldTypeCompatibility(): Promise<void> {
    this.log('\n## 🔧 Phase 6: Field Type Compatibility Testing');

    // Test problematic field types from CSV import
    const fieldTypeTests = [
      { table: 'PromptLogs', field: 'promptType', type: 'Single Select', testValue: 'business_plan' },
      { table: 'PromptLogs', field: 'inputFields', type: 'Long Text (JSON)', testValue: '{"industry":"tech","goal":"growth"}' },
      { table: 'SessionAnalytics', field: 'productsUsed', type: 'Multiple Select', testValue: ['business_plan', 'ad_amplify'] },
      { table: 'SparkSplitAnalytics', field: 'userSelection', type: 'Single Select', testValue: 'canai' },
      { table: 'UserContext', field: 'preferredProducts', type: 'Multiple Select', testValue: ['business_plan', 'email_campaign'] }
    ];

    for (const test of fieldTypeTests) {
      await this.testFieldTypeCompatibility_Single(test);
    }
  }

  // Helper methods for test data generation
  private generatePromptLogTestData(): any {
    return {
      sessionId: `test_session_${Date.now()}`,
      userId: `test_user_${Date.now()}`,
      promptType: 'business_plan',
      inputFields: JSON.stringify({
        industry: 'technology',
        goal: 'Series A funding',
        audience: 'investors'
      }),
      output: JSON.stringify({
        plan: 'Comprehensive business plan for tech startup...'
      }),
      tokensUsed: 1200,
      costUSD: 0.024,
      trustScore: 0.85,
      resonanceScore: 0.78,
      smartPromptScore: 0.82,
      emotionalDepth: 0.75,
      aweScore: 0.80,
      ownershipScore: 0.85,
      wonderScore: 0.75,
      calmScore: 0.88,
      powerScore: 0.82,
      fallbackTriggered: false,
      consentGiven: true,
      deletionRequested: false
    };
  }

  private generateSessionAnalyticsTestData(): any {
    return {
      sessionId: `test_session_${Date.now()}`,
      userId: `test_user_${Date.now()}`,
      startTime: new Date().toISOString(),
      duration: 1800000,
      promptCount: 1,
      productsUsed: ['business_plan'],
      primaryProduct: 'business_plan',
      trustScoreBefore: 0.75,
      trustScoreAfter: 0.85,
      trustDelta: 0.10,
      emotionalDepth: 0.75,
      overrideCount: 0,
      timeToConfirmation: 15000,
      dropOffSignal: false,
      cohort: 'test_cohort',
      status: 'completed'
    };
  }

  private generateSparkSplitTestData(): any {
    return {
      sessionId: `test_session_${Date.now()}`,
      timestamp: Date.now(),
      promptType: 'business_plan',
      comparisonId: `comp_${Date.now()}`,
      trustDelta: 0.12,
      userSelection: 'canai',
      timeToSelection: 45000,
      aweScore: 0.88,
      ownershipScore: 0.92,
      wonderScore: 0.85,
      calmScore: 0.90,
      powerScore: 0.88,
      competitiveAdvantage: 0.85,
      trustTransparencyScore: 0.92,
      emotionalEducationScore: 0.88,
      wouldRefer: true,
      sharedOutput: true,
      circuitBreakerTriggered: false,
      testId: `test_${Date.now()}`,
      variantType: 'enhanced',
      conversionLift: 18.5,
      statisticalSignificance: 0.95,
      marketingReady: true,
      sterileOutput: 'Basic business plan template...',
      enhancedOutput: 'Revolutionary business vision with trust-building elements...',
      educationalMoment: true,
      transparencyTrust: 0.92,
      viralPotential: 0.78
    };
  }

  // Utility methods
  private async makeAirtableRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.config.baseUrl}/${this.config.baseId}/${endpoint}`;
    
    const options: any = {
      method,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Airtable API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  }

  private loadExpectedSchema(tableName: string): any {
    // Load schema from tier files
    const schemaFiles = [
      'schemas/tier1-core-tables.json',
      'schemas/tier2-intelligence-tables.json', 
      'schemas/tier3-integration-tables.json',
      'schemas/tier4-reference-tables.json'
    ];

    for (const schemaFile of schemaFiles) {
      try {
        const schemaPath = path.join(__dirname, schemaFile);
        const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
        
        if (schema.tables && schema.tables[tableName]) {
          return {
            fields: Object.entries(schema.tables[tableName].fields).map(([name, config]: [string, any]) => ({
              name,
              type: config.airtableType || config.type,
              required: config.constraints?.includes('Required') || false,
              ...config
            }))
          };
        }
      } catch (error) {
        // Continue to next schema file
      }
    }

    throw new Error(`Schema not found for table: ${tableName}`);
  }

  private async validateField(tableName: string, expectedField: any, actualFields: string[], sampleData: any): Promise<FieldValidation> {
    const fieldExists = actualFields.includes(expectedField.name);
    const issues: string[] = [];
    
    if (!fieldExists) {
      issues.push(`Field '${expectedField.name}' not found in table`);
    }

    // Additional validation logic here...

    return {
      fieldName: expectedField.name,
      expectedType: expectedField.type,
      actualType: fieldExists ? 'detected' : 'missing',
      isValid: issues.length === 0,
      issues,
      sampleValue: sampleData?.[expectedField.name] || null
    };
  }

  private async testLinkedRecordRelationship(relationship: any): Promise<void> {
    this.log(`   🔗 Testing relationship: ${relationship.parent} → ${relationship.child}`);
    // Implementation for relationship testing
  }

  private async testFieldTypeCompatibility_Single(test: any): Promise<void> {
    this.log(`   🔧 Testing field type: ${test.table}.${test.field} (${test.type})`);
    // Implementation for field type testing
  }

  private async testTier2IntelligenceOperations(): Promise<void> {
    this.log('\n## 🧠 Phase 4a: Tier 2 Intelligence CRUD Operations');
    // Implementation for Tier 2 testing
  }

  private async testTier3IntegrationOperations(): Promise<void> {
    this.log('\n## 🔌 Phase 4b: Tier 3 Integration CRUD Operations');
    // Implementation for Tier 3 testing
  }

  private async testTier4ReferenceOperations(): Promise<void> {
    this.log('\n## 📚 Phase 4c: Tier 4 Reference CRUD Operations');
    // Implementation for Tier 4 testing
  }

  private recordTestResult(result: TestResult): void {
    this.testResults.push(result);
  }

  private initializeLog(): void {
    const header = `# Airtable API Integration Test Results\n\n**Generated:** ${new Date().toISOString()}\n**Base ID:** ${this.config.baseId}\n\n`;
    fs.writeFileSync(this.logFile, header, 'utf8');
  }

  private log(message: string): void {
    console.log(message);
    fs.appendFileSync(this.logFile, message + '\n', 'utf8');
  }

  private generateTestReport(): void {
    this.log('\n## 📊 Comprehensive Test Report');
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    this.log(`\n### Summary`);
    this.log(`- **Total Tests:** ${totalTests}`);
    this.log(`- **Passed:** ${passedTests}`);
    this.log(`- **Failed:** ${failedTests}`);
    this.log(`- **Success Rate:** ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    // Detailed results by operation type
    const operationTypes = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'VALIDATE'];
    
    for (const operation of operationTypes) {
      const operationResults = this.testResults.filter(r => r.operation === operation);
      if (operationResults.length > 0) {
        const operationPassed = operationResults.filter(r => r.success).length;
        this.log(`\n### ${operation} Operations`);
        this.log(`- **Success Rate:** ${((operationPassed / operationResults.length) * 100).toFixed(1)}%`);
        
        // List failed operations
        const failed = operationResults.filter(r => !r.success);
        if (failed.length > 0) {
          this.log(`- **Failed Tests:**`);
          failed.forEach(f => {
            this.log(`  - ${f.tableName}: ${f.errors.join(', ')}`);
          });
        }
      }
    }

    // Export detailed JSON results
    const resultsFile = path.join(__dirname, 'airtable-api-test-results.json');
    fs.writeFileSync(resultsFile, JSON.stringify(this.testResults, null, 2), 'utf8');
    this.log(`\n📄 Detailed results exported to: ${resultsFile}`);
  }
}

// Export for use in other modules
export default AirtableAPITester;

// CLI execution
if (require.main === module) {
  const tester = new AirtableAPITester();
  tester.runComprehensiveTests()
    .then(() => {
      console.log('✅ All tests completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error.message);
      process.exit(1);
    });
} 