/**
 * @file scripts/tools/fresh-airtable-verification.ts
 * @description Fresh Airtable verification script - no bias from previous attempts
 * @version 1.0.0
 * @purpose Accurately test Airtable CRUD operations with proper field handling
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

interface AirtableField {
  id: string;
  name: string;
  type: string;
  options?: any;
}

interface TableSchema {
  id: string;
  name: string;
  fields: AirtableField[];
}

interface CRUDTestResult {
  tableName: string;
  readable: boolean;
  writable: boolean;
  updatable: boolean;
  deletable: boolean;
  fullCRUD: boolean;
  error?: string;
  fieldCount: number;
}

class FreshAirtableVerifier {
  private apiKey: string;
  private baseId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_PAT || '';
    this.baseId = process.env.AIRTABLE_BASE_ID || '';
    this.baseUrl = `https://api.airtable.com/v0/${this.baseId}`;
    
    if (!this.apiKey || !this.baseId) {
      throw new Error('Missing Airtable configuration in .env.local');
    }

    console.log('🔧 Fresh Airtable Verifier Initialized');
    console.log(`   Base ID: ${this.baseId}`);
    console.log(`   API Key: ${this.apiKey.substring(0, 12)}...`);
    console.log('');
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    const defaultOptions: RequestInit = {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error?.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  private async getTableSchema(tableName: string): Promise<TableSchema | null> {
    try {
      // Get base metadata to understand field types
      const metaUrl = `https://api.airtable.com/v0/meta/bases/${this.baseId}/tables`;
      const metadata = await this.makeRequest(metaUrl);
      
      const table = metadata.tables.find((t: any) => t.name === tableName);
      return table || null;
    } catch (error) {
      console.log(`   ⚠️  Could not get schema for ${tableName}: ${error}`);
      return null;
    }
  }

  private generateSmartTestData(schema: TableSchema): any {
    const testData: any = {};
    const timestamp = new Date().toISOString();
    const testId = `test_${Date.now()}`;

    for (const field of schema.fields) {
      // Skip computed fields
      if (field.type === 'formula' || field.type === 'rollup' || field.type === 'lookup') {
        continue;
      }

      // Skip auto-generated fields
      if (field.name.toLowerCase().includes('record id') || 
          field.name.toLowerCase().includes('created time') ||
          field.name.toLowerCase().includes('last modified')) {
        continue;
      }

      switch (field.type) {
        case 'singleLineText':
          testData[field.name] = `Test ${testId}`;
          break;
          
        case 'multilineText':
          testData[field.name] = `Test description for ${testId}`;
          break;
          
        case 'number':
          testData[field.name] = Math.round(Math.random() * 100);
          break;
          
        case 'currency':
          testData[field.name] = Math.round(Math.random() * 1000 * 100) / 100;
          break;
          
        case 'percent':
          testData[field.name] = Math.round(Math.random() * 100) / 100;
          break;
          
        case 'date':
          testData[field.name] = timestamp.split('T')[0]; // YYYY-MM-DD format
          break;
          
        case 'dateTime':
          testData[field.name] = timestamp;
          break;
          
        case 'checkbox':
          testData[field.name] = Math.random() > 0.5;
          break;
          
        case 'email':
          testData[field.name] = `test_${testId}@canai.so`;
          break;
          
        case 'url':
          testData[field.name] = `https://canai.so/test/${testId}`;
          break;
          
        case 'phoneNumber':
          testData[field.name] = '+1-555-0123';
          break;
          
        case 'singleSelect':
          if (field.options?.choices && field.options.choices.length > 0) {
            const randomChoice = field.options.choices[Math.floor(Math.random() * field.options.choices.length)];
            testData[field.name] = randomChoice.name;
          }
          break;
          
        case 'multipleSelects':
          if (field.options?.choices && field.options.choices.length > 0) {
            const randomChoice = field.options.choices[Math.floor(Math.random() * field.options.choices.length)];
            testData[field.name] = [randomChoice.name];
          }
          break;
          
        case 'rating':
          const maxRating = field.options?.max || 5;
          testData[field.name] = Math.ceil(Math.random() * maxRating);
          break;
          
        default:
          // For unknown field types, try a simple string
          testData[field.name] = `Test ${testId}`;
      }
    }

    return testData;
  }

  private async testTableCRUD(tableName: string): Promise<CRUDTestResult> {
    const result: CRUDTestResult = {
      tableName,
      readable: false,
      writable: false,
      updatable: false,
      deletable: false,
      fullCRUD: false,
      fieldCount: 0
    };

    try {
      console.log(`🧪 Testing ${tableName}...`);

      // Step 1: Test READ operation
      const readUrl = `${this.baseUrl}/${encodeURIComponent(tableName)}?maxRecords=1`;
      const readResponse = await this.makeRequest(readUrl);
      
      result.readable = true;
      result.fieldCount = readResponse.records?.[0]?.fields ? Object.keys(readResponse.records[0].fields).length : 0;
      console.log(`   ✅ READ: Success (${result.fieldCount} fields)`);

      // Step 2: Get table schema for smart test data
      const schema = await getTableSchema(tableName);
      let testData: any;

      if (schema) {
        testData = this.generateSmartTestData(schema);
        console.log(`   📋 Schema: Found ${schema.fields.length} fields, generated smart test data`);
      } else {
        // Fallback to simple test data
        testData = {
          'Name': `Test Record ${Date.now()}`,
          'Status': 'Active',
          'Notes': 'Test record created by verification script'
        };
        console.log(`   📋 Schema: Using fallback test data`);
      }

      // Step 3: Test CREATE operation
      const createUrl = `${this.baseUrl}/${encodeURIComponent(tableName)}`;
      const createPayload = {
        records: [{
          fields: testData
        }]
      };

      const createResponse = await this.makeRequest(createUrl, {
        method: 'POST',
        body: JSON.stringify(createPayload)
      });

      if (createResponse.records && createResponse.records.length > 0) {
        result.writable = true;
        const recordId = createResponse.records[0].id;
        console.log(`   ✅ CREATE: Success (ID: ${recordId})`);

                 // Step 4: Test UPDATE operation
         try {
           const updateUrl = `${this.baseUrl}/${encodeURIComponent(tableName)}/${recordId}`;
           
           // Use the first text field from the created record for update
           const createdFields = Object.keys(createResponse.records[0].fields);
           const textField = createdFields.find(field => 
             typeof createResponse.records[0].fields[field] === 'string'
           ) || createdFields[0];
           
           const updatePayload = {
             fields: {
               [textField]: `Updated at ${new Date().toISOString()}`
             }
           };

           await this.makeRequest(updateUrl, {
             method: 'PATCH',
             body: JSON.stringify(updatePayload)
           });

          result.updatable = true;
          console.log(`   ✅ UPDATE: Success`);

          // Step 5: Test DELETE operation
          try {
            await this.makeRequest(updateUrl, {
              method: 'DELETE'
            });

            result.deletable = true;
            console.log(`   ✅ DELETE: Success`);
          } catch (deleteError) {
            console.log(`   ❌ DELETE: ${deleteError}`);
          }
        } catch (updateError) {
          console.log(`   ❌ UPDATE: ${updateError}`);
        }
      } else {
        console.log(`   ❌ CREATE: No records returned`);
      }

    } catch (error) {
      result.error = String(error);
      console.log(`   ❌ ERROR: ${error}`);
    }

    result.fullCRUD = result.readable && result.writable && result.updatable && result.deletable;
    
    if (result.fullCRUD) {
      console.log(`   🎉 FULL CRUD: ${tableName} - ALL OPERATIONS SUCCESSFUL`);
    }

    return result;
  }

  public async verifyAllTables(): Promise<void> {
    console.log('🚀 Fresh Airtable CRUD Verification Starting...\n');

    // Get all tables from base metadata
    let allTables: string[] = [];
    
    try {
      const metaUrl = `https://api.airtable.com/v0/meta/bases/${this.baseId}/tables`;
      const metadata = await this.makeRequest(metaUrl);
      allTables = metadata.tables.map((table: any) => table.name);
      console.log(`📋 Found ${allTables.length} tables in base`);
    } catch (error) {
      console.log(`⚠️  Could not get table list from metadata: ${error}`);
      console.log('Using fallback table list...');
      
      // Fallback table list
      allTables = [
        '01_PromptLogs', '02_SparkSplitAnalytics', '03_SessionAnalytics', '04_UserContext',
        '05_OutputGoldmine', '06_FeedbackLogs', '07_DeliveryCostLogs', '08_ReferralTriggers',
        '09_AIMiningAgents', '10_FieldGlossary', '11_SchemaEvents', '12_EmotionalCompass',
        '13_TrustMetrics', '14_PersonaCluster', '15_ContentOptimization', '16_PredictiveInsights',
        '17_CompetitiveIntel', '18_RevenueAttribution', '19_CustomerJourney', '20_BrandResonance',
        '21_ConversionFunnels', '22_GrowthMetrics', '23_EmotionalIntelligence', '24_EmotionalJourney',
        '25_SentimentAnalysis', '26_BehavioralPatterns', '27_SystemEvolution', '28_MetaIntelligence',
        '29_InnovationMetrics', '30_FutureInsights', '31_TrustEvolution', '32_LearningExtraction',
        '33_CompoundIntelligence', '34_PredictiveModeling', '35_EvolutionTracking', '36_IntelligenceCompound'
      ];
    }

    console.log(`\n🧪 Testing CRUD operations on ${allTables.length} tables...\n`);

    const results: CRUDTestResult[] = [];
    let fullCRUDCount = 0;
    let readableCount = 0;

    for (const tableName of allTables) {
      const result = await this.testTableCRUD(tableName);
      results.push(result);

      if (result.readable) readableCount++;
      if (result.fullCRUD) fullCRUDCount++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('');
    }

    // Generate final report
    this.generateReport(results, fullCRUDCount, readableCount);
  }

  private generateReport(results: CRUDTestResult[], fullCRUDCount: number, readableCount: number): void {
    console.log('🎯 FRESH AIRTABLE VERIFICATION REPORT');
    console.log('=====================================\n');

    console.log('📊 SUMMARY STATISTICS:');
    console.log(`   Total Tables: ${results.length}`);
    console.log(`   Readable Tables: ${readableCount}/${results.length} (${Math.round(readableCount/results.length*100)}%)`);
    console.log(`   Full CRUD Tables: ${fullCRUDCount}/${results.length} (${Math.round(fullCRUDCount/results.length*100)}%)`);
    console.log(`   CRUD Success Rate: ${Math.round(fullCRUDCount/results.length*100)}%\n`);

    if (fullCRUDCount > 0) {
      console.log('✅ TABLES WITH FULL CRUD SUPPORT:');
      results.filter(r => r.fullCRUD).forEach(result => {
        console.log(`   🎉 ${result.tableName} (${result.fieldCount} fields)`);
      });
      console.log('');
    }

    const readOnlyTables = results.filter(r => r.readable && !r.fullCRUD);
    if (readOnlyTables.length > 0) {
      console.log('📖 READ-ONLY TABLES:');
      readOnlyTables.forEach(result => {
        console.log(`   📋 ${result.tableName} (${result.fieldCount} fields) - ${result.error || 'Write operations failed'}`);
      });
      console.log('');
    }

    const inaccessibleTables = results.filter(r => !r.readable);
    if (inaccessibleTables.length > 0) {
      console.log('❌ INACCESSIBLE TABLES:');
      inaccessibleTables.forEach(result => {
        console.log(`   🚫 ${result.tableName} - ${result.error}`);
      });
      console.log('');
    }

    // Truth assessment
    const crudSuccessRate = Math.round(fullCRUDCount/results.length*100);
    console.log('🎯 TRUTH ASSESSMENT:');
    
    if (crudSuccessRate >= 90) {
      console.log(`   ✅ CLAIM VERIFIED: ${crudSuccessRate}% CRUD success supports "full CRUD operations" claim`);
    } else if (crudSuccessRate >= 70) {
      console.log(`   ⚠️  CLAIM MOSTLY ACCURATE: ${crudSuccessRate}% CRUD success - some limitations exist`);
    } else {
      console.log(`   ❌ CLAIM INACCURATE: ${crudSuccessRate}% CRUD success does not support "full CRUD operations" claim`);
    }

    console.log(`\n🌐 Airtable Base: https://airtable.com/${this.baseId}`);
    console.log('🎯 Fresh verification completed!\n');
  }
}

// Helper function to get table schema (needs to be outside class for proper scoping)
async function getTableSchema(tableName: string): Promise<TableSchema | null> {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_PAT || '';
    const baseId = process.env.AIRTABLE_BASE_ID || '';
    
    const metaUrl = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;
    const response = await fetch(metaUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const metadata = await response.json() as any;
    const table = metadata.tables.find((t: any) => t.name === tableName);
    return table || null;
  } catch (error) {
    return null;
  }
}

// Run verification if called directly
if (require.main === module) {
  const verifier = new FreshAirtableVerifier();
  verifier.verifyAllTables()
    .then(() => {
      console.log('✅ Verification completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
}

export { FreshAirtableVerifier, CRUDTestResult }; 