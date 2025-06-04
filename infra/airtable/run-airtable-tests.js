/**
 * CanAI Airtable API Test Runner
 * 
 * Simplified JavaScript version for immediate execution
 * Tests Airtable API integration and validates field mappings
 * 
 * Usage: node infra/airtable/run-airtable-tests.js
 */

require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

class AirtableTestRunner {
  constructor() {
    this.config = {
      apiKey: process.env.AIRTABLE_API_KEY || '',
      baseId: process.env.AIRTABLE_BASE_ID || '',
      baseUrl: 'https://api.airtable.com/v0'
    };

    this.results = [];
    this.logFile = path.join(__dirname, 'test-results.md');
    
    // Initialize log
    const header = `# Airtable API Test Results\n\n**Generated:** ${new Date().toISOString()}\n**Base ID:** ${this.config.baseId}\n\n`;
    fs.writeFileSync(this.logFile, header, 'utf8');
  }

  log(message) {
    console.log(message);
    fs.appendFileSync(this.logFile, message + '\n', 'utf8');
  }

  async runTests() {
    this.log('🚀 Starting Airtable API Integration Tests');
    
    try {
      // Phase 1: Environment validation
      await this.testEnvironment();
      
      // Phase 2: Table discovery
      await this.discoverTables();
      
      // Phase 3: Field validation for key tables
      await this.validateKeyTables();
      
      // Phase 4: CRUD operations test
      await this.testCRUDOperations();
      
      // Phase 5: Field type compatibility
      await this.testFieldTypes();
      
      this.generateReport();
      
    } catch (error) {
      this.log(`❌ Test execution failed: ${error.message}`);
      throw error;
    }
  }

  async testEnvironment() {
    this.log('\n## 🔧 Phase 1: Environment Validation');
    
    if (!this.config.apiKey) {
      throw new Error('❌ AIRTABLE_API_KEY not found in .env.local');
    }
    
    if (!this.config.baseId) {
      throw new Error('❌ AIRTABLE_BASE_ID not found in .env.local');
    }
    
    this.log('✅ Environment variables loaded');
    this.log(`📊 Testing Base: ${this.config.baseId}`);
    
    // Test API connectivity with a known table instead of base metadata
    try {
      // Use table ID from the URLs provided: tbloOnbwQ2LG7QVLB (PromptLogs)
      const response = await this.makeRequest('GET', 'tbloOnbwQ2LG7QVLB', { maxRecords: 1 });
      if (response.records !== undefined) {
        this.log(`✅ API connectivity confirmed - Successfully accessed PromptLogs table`);
        this.recordResult('Environment Setup', 'VALIDATE', true, 'API connectivity successful');
      }
    } catch (error) {
      this.recordResult('Environment Setup', 'VALIDATE', false, error.message);
      throw error;
    }
  }

  async discoverTables() {
    this.log('\n## 📊 Phase 2: Table Discovery');
    
    // Use actual table IDs from the user's URLs instead of names
    const expectedTables = [
      { name: 'PromptLogs', id: 'tbloOnbwQ2LG7QVLB' },
      { name: 'SessionAnalytics', id: 'tblBMHTFbglxhWEkq' }, 
      { name: 'SparkSplitAnalytics', id: 'tblJMbF0FONE8WZVI' }
      // Note: We'll test these core tables first, then add others as we discover their IDs
    ];

    for (const table of expectedTables) {
      try {
        const response = await this.makeRequest('GET', table.id, { maxRecords: 1 });
        
        if (response.records !== undefined) {
          const recordCount = response.records.length;
          const fieldCount = recordCount > 0 ? Object.keys(response.records[0].fields || {}).length : 0;
          
          this.log(`✅ Table found: ${table.name} (${fieldCount} fields, ${recordCount} sample records)`);
          this.recordResult(`Table Discovery: ${table.name}`, 'VALIDATE', true, `${fieldCount} fields detected`);
          
          // Log field names for verification
          if (recordCount > 0 && response.records[0].fields) {
            const fields = Object.keys(response.records[0].fields);
            this.log(`   📋 Fields: ${fields.slice(0, 5).join(', ')}${fields.length > 5 ? '...' : ''}`);
          }
        } else {
          this.log(`❌ Table not found: ${table.name}`);
          this.recordResult(`Table Discovery: ${table.name}`, 'VALIDATE', false, 'Table not found');
        }
      } catch (error) {
        this.log(`❌ Error accessing table ${table.name}: ${error.message}`);
        this.recordResult(`Table Discovery: ${table.name}`, 'VALIDATE', false, error.message);
      }
    }
  }

  async validateKeyTables() {
    this.log('\n## 🔍 Phase 3: Key Table Field Validation');
    
    const keyTables = ['PromptLogs', 'SessionAnalytics', 'SparkSplitAnalytics'];
    
    for (const tableName of keyTables) {
      await this.validateTableFields(tableName);
    }
  }

  async validateTableFields(tableName) {
    this.log(`\n### 🔍 Validating ${tableName} Fields`);
    
    try {
      const response = await this.makeRequest('GET', tableName, { maxRecords: 1 });
      
      if (!response.records || response.records.length === 0) {
        this.log(`   ⚠️ No records found in ${tableName} - cannot validate field types`);
        this.recordResult(`Field Validation: ${tableName}`, 'VALIDATE', false, 'No sample data');
        return;
      }

      const sampleRecord = response.records[0];
      const fields = sampleRecord.fields || {};
      const fieldNames = Object.keys(fields);
      
      this.log(`   📋 Found ${fieldNames.length} fields with data`);
      
      // Validate critical fields based on table type
      const criticalFields = this.getCriticalFields(tableName);
      let validFields = 0;
      let invalidFields = 0;
      
      for (const fieldName of criticalFields) {
        if (fieldNames.includes(fieldName)) {
          const value = fields[fieldName];
          const validation = this.validateFieldValue(tableName, fieldName, value);
          
          if (validation.valid) {
            this.log(`   ✅ ${fieldName}: ${validation.type} (${JSON.stringify(value).substring(0, 50)}...)`);
            validFields++;
          } else {
            this.log(`   ❌ ${fieldName}: ${validation.issue}`);
            invalidFields++;
          }
        } else {
          this.log(`   ❌ Missing critical field: ${fieldName}`);
          invalidFields++;
        }
      }
      
      const success = invalidFields === 0;
      this.recordResult(`Field Validation: ${tableName}`, 'VALIDATE', success, 
        `${validFields} valid, ${invalidFields} invalid fields`);
        
    } catch (error) {
      this.log(`   ❌ Field validation failed: ${error.message}`);
      this.recordResult(`Field Validation: ${tableName}`, 'VALIDATE', false, error.message);
    }
  }

  async testCRUDOperations() {
    this.log('\n## 🔄 Phase 4: CRUD Operations Testing');
    
    // Test with PromptLogs table (most critical) using table ID
    await this.testTableCRUD('PromptLogs', 'tbloOnbwQ2LG7QVLB');
  }

  async testTableCRUD(tableName, tableId) {
    this.log(`\n### 🔄 Testing CRUD: ${tableName} (${tableId})`);
    
    const testData = this.generateTestData(tableName);
    let recordId = null;
    
    try {
      // CREATE Test
      this.log('   📝 Testing CREATE...');
      const createResponse = await this.makeRequest('POST', tableId, {
        records: [{ fields: testData }]
      });
      
      if (createResponse.records && createResponse.records.length > 0) {
        recordId = createResponse.records[0].id;
        this.log(`   ✅ CREATE successful: ${recordId}`);
        this.recordResult(`CRUD CREATE: ${tableName}`, 'CREATE', true, recordId);
      } else {
        throw new Error('No record returned from CREATE');
      }
      
      // READ Test
      this.log('   📖 Testing READ...');
      const readResponse = await this.makeRequest('GET', `${tableId}/${recordId}`);
      
      if (readResponse.id === recordId) {
        this.log(`   ✅ READ successful: ${recordId}`);
        this.recordResult(`CRUD READ: ${tableName}`, 'READ', true, recordId);
      } else {
        throw new Error('Record not found in READ');
      }
      
      // UPDATE Test
      this.log('   ✏️ Testing UPDATE...');
      const updateData = { ...testData, updated: true };
      const updateResponse = await this.makeRequest('PATCH', tableId, {
        records: [{ id: recordId, fields: updateData }]
      });
      
      if (updateResponse.records && updateResponse.records.length > 0) {
        this.log(`   ✅ UPDATE successful: ${recordId}`);
        this.recordResult(`CRUD UPDATE: ${tableName}`, 'UPDATE', true, recordId);
      } else {
        throw new Error('No record returned from UPDATE');
      }
      
      // DELETE Test
      this.log('   🗑️ Testing DELETE...');
      const deleteResponse = await this.makeRequest('DELETE', `${tableId}/${recordId}`);
      
      if (deleteResponse.deleted && deleteResponse.id === recordId) {
        this.log(`   ✅ DELETE successful: ${recordId}`);
        this.recordResult(`CRUD DELETE: ${tableName}`, 'DELETE', true, recordId);
        recordId = null; // Prevent cleanup
      } else {
        throw new Error('Record deletion not confirmed');
      }
      
    } catch (error) {
      this.log(`   ❌ CRUD test failed: ${error.message}`);
      this.recordResult(`CRUD: ${tableName}`, 'CRUD', false, error.message);
      
      // Cleanup if needed
      if (recordId) {
        try {
          await this.makeRequest('DELETE', `${tableId}/${recordId}`);
          this.log(`   🧹 Cleanup successful: ${recordId}`);
        } catch (cleanupError) {
          this.log(`   ⚠️ Cleanup failed: ${cleanupError.message}`);
        }
      }
    }
  }

  async testFieldTypes() {
    this.log('\n## 🔧 Phase 5: Field Type Compatibility Testing');
    
    // Test problematic field types that caused CSV import issues
    const fieldTests = [
      {
        table: 'PromptLogs',
        field: 'promptType',
        type: 'Single Select',
        testValue: 'business_plan',
        description: 'Single select field validation'
      },
      {
        table: 'PromptLogs', 
        field: 'inputFields',
        type: 'Long Text (JSON)',
        testValue: JSON.stringify({ industry: 'tech', goal: 'growth' }),
        description: 'JSON string storage validation'
      },
      {
        table: 'SessionAnalytics',
        field: 'productsUsed',
        type: 'Multiple Select',
        testValue: ['business_plan', 'ad_amplify'],
        description: 'Multiple select array validation'
      }
    ];

    for (const test of fieldTests) {
      await this.testFieldType(test);
    }
  }

  async testFieldType(test) {
    this.log(`   🔧 Testing ${test.table}.${test.field} (${test.type})`);
    
    try {
      const testData = this.generateTestData(test.table);
      testData[test.field] = test.testValue;
      
      // Try to create a record with this field type
      const response = await this.makeRequest('POST', test.table, {
        records: [{ fields: testData }]
      });
      
      if (response.records && response.records.length > 0) {
        const recordId = response.records[0].id;
        const actualValue = response.records[0].fields[test.field];
        
        this.log(`   ✅ Field type compatible: ${test.field} = ${JSON.stringify(actualValue)}`);
        this.recordResult(`Field Type: ${test.table}.${test.field}`, 'VALIDATE', true, test.description);
        
        // Cleanup
        await this.makeRequest('DELETE', `${test.table}/${recordId}`);
      } else {
        throw new Error('No record returned');
      }
      
    } catch (error) {
      this.log(`   ❌ Field type incompatible: ${test.field} - ${error.message}`);
      this.recordResult(`Field Type: ${test.table}.${test.field}`, 'VALIDATE', false, error.message);
    }
  }

  // Helper methods
  async makeRequest(method, endpoint, data = null) {
    const url = `${this.config.baseUrl}/${this.config.baseId}/${endpoint}`;
    
    const options = {
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

  getCriticalFields(tableName) {
    const fieldMap = {
      'PromptLogs': ['sessionId', 'userId', 'promptType', 'inputFields', 'output', 'trustScore'],
      'SessionAnalytics': ['sessionId', 'userId', 'startTime', 'duration', 'promptCount', 'status'],
      'SparkSplitAnalytics': ['sessionId', 'promptType', 'trustDelta', 'userSelection', 'competitiveAdvantage']
    };
    
    return fieldMap[tableName] || [];
  }

  validateFieldValue(tableName, fieldName, value) {
    // Basic field validation logic
    if (value === null || value === undefined) {
      return { valid: false, issue: 'Field is null/undefined', type: 'null' };
    }

    if (fieldName.includes('Score') && typeof value === 'number') {
      if (value >= 0 && value <= 1) {
        return { valid: true, type: 'score', issue: null };
      } else {
        return { valid: false, issue: 'Score out of range (0-1)', type: 'number' };
      }
    }

    if (fieldName.includes('Id') && typeof value === 'string') {
      return { valid: true, type: 'string', issue: null };
    }

    if (fieldName === 'inputFields' || fieldName === 'output') {
      try {
        JSON.parse(value);
        return { valid: true, type: 'json', issue: null };
      } catch {
        return { valid: false, issue: 'Invalid JSON format', type: 'string' };
      }
    }

    return { valid: true, type: typeof value, issue: null };
  }

  generateTestData(tableName) {
    const timestamp = Date.now();
    
    const baseData = {
      'PromptLogs': {
        sessionId: `test_session_${timestamp}`,
        userId: `test_user_${timestamp}`,
        promptType: 'business_plan',
        inputFields: JSON.stringify({ industry: 'technology', goal: 'testing' }),
        output: JSON.stringify({ result: 'test output' }),
        tokensUsed: 100,
        costUSD: 0.002,
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
      },
      'SessionAnalytics': {
        sessionId: `test_session_${timestamp}`,
        userId: `test_user_${timestamp}`,
        startTime: new Date().toISOString(),
        duration: 60000,
        promptCount: 1,
        productsUsed: ['business_plan'],
        primaryProduct: 'business_plan',
        trustScoreBefore: 0.75,
        trustScoreAfter: 0.85,
        trustDelta: 0.10,
        emotionalDepth: 0.75,
        overrideCount: 0,
        timeToConfirmation: 5000,
        dropOffSignal: false,
        cohort: 'test',
        status: 'completed'
      }
    };

    return baseData[tableName] || {};
  }

  recordResult(testName, operation, success, details) {
    this.results.push({
      testName,
      operation,
      success,
      details,
      timestamp: new Date().toISOString()
    });
  }

  generateReport() {
    this.log('\n## 📊 Test Summary Report');
    
    const total = this.results.length;
    const passed = this.results.filter(r => r.success).length;
    const failed = total - passed;
    
    this.log(`\n### Overall Results`);
    this.log(`- **Total Tests:** ${total}`);
    this.log(`- **Passed:** ${passed}`);
    this.log(`- **Failed:** ${failed}`);
    this.log(`- **Success Rate:** ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      this.log(`\n### Failed Tests`);
      this.results.filter(r => !r.success).forEach(result => {
        this.log(`- **${result.testName}**: ${result.details}`);
      });
    }

    // Export JSON results
    const jsonFile = path.join(__dirname, 'test-results.json');
    fs.writeFileSync(jsonFile, JSON.stringify(this.results, null, 2), 'utf8');
    
    this.log(`\n📄 Detailed results saved to:`);
    this.log(`- Markdown: ${this.logFile}`);
    this.log(`- JSON: ${jsonFile}`);
    
    if (failed === 0) {
      this.log('\n🎉 All tests passed! Your Airtable integration is working correctly.');
    } else {
      this.log(`\n⚠️ ${failed} tests failed. Review the details above to fix issues.`);
    }
  }
}

// Execute tests
if (require.main === module) {
  const runner = new AirtableTestRunner();
  runner.runTests()
    .then(() => {
      console.log('\n✅ Test execution completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Test execution failed:', error.message);
      process.exit(1);
    });
}

module.exports = AirtableTestRunner; 