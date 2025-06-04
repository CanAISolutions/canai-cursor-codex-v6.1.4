/**
 * @file scripts/tools/airtable-truth-verification.ts
 * @description Comprehensive Airtable verification script for truth validation
 * @version 6.1.4
 * @purpose Verify claims about Airtable infrastructure with actual testing
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

interface TableTestResult {
  tableName: string;
  exists: boolean;
  createSuccess: boolean;
  readSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  error?: string;
}

interface VerificationReport {
  totalTables: number;
  successfulTables: number;
  failedTables: number;
  crudSuccessRate: number;
  tableResults: TableTestResult[];
  apiKeyValid: boolean;
  baseIdValid: boolean;
}

class AirtableVerifier {
  private apiKey: string;
  private baseId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_PAT || '';
    this.baseId = process.env.AIRTABLE_BASE_ID || '';
    this.baseUrl = `https://api.airtable.com/v0/${this.baseId}`;
    
    console.log('🔑 Airtable Configuration:');
    console.log(`   API Key: ${this.apiKey.substring(0, 10)}...`);
    console.log(`   Base ID: ${this.baseId}`);
    console.log(`   Base URL: ${this.baseUrl}`);
    console.log('');
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json() as any;
      
      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  private async getAllTables(): Promise<string[]> {
    try {
      // Get base schema to find all tables
      const schemaUrl = `https://api.airtable.com/v0/meta/bases/${this.baseId}/tables`;
      const response = await fetch(schemaUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get base schema: ${response.statusText}`);
      }

      const schema = await response.json() as any;
      return schema.tables.map((table: any) => table.name);
    } catch (error) {
      console.log('⚠️  Could not get base schema, using known table names...');
      
      // Fallback to known table names from the codebase
      return [
        'PromptLogs',
        'SessionAnalytics', 
        'FeedbackLogs',
        'UserContext',
        'SparkSplitAnalytics',
        'OutputGoldmine',
        'AIMiningAgents',
        'FieldGlossary',
        'SchemaEvents',
        'DeliveryCostLogs',
        'ReferralTriggers',
        'UserProfiles',
        'BusinessProfiles',
        'ProjectTracking',
        'TaskManagement',
        'ContentLibrary',
        'TemplateRegistry',
        'WorkflowSteps',
        'IntegrationLogs',
        'PerformanceMetrics',
        'ErrorTracking',
        'AuditTrail',
        'NotificationQueue',
        'SubscriptionPlans',
        'BillingHistory',
        'UsageMetrics',
        'FeatureFlags',
        'SystemConfig',
        'BackupLogs',
        'SecurityEvents',
        'ComplianceRecords',
        'DataExports',
        'APIUsage',
        'WebhookLogs',
        'CacheMetrics',
        'QueueStatus'
      ];
    }
  }

  private async testTableCRUD(tableName: string): Promise<TableTestResult> {
    const result: TableTestResult = {
      tableName,
      exists: false,
      createSuccess: false,
      readSuccess: false,
      updateSuccess: false,
      deleteSuccess: false
    };

    try {
      console.log(`📝 Testing ${tableName}...`);

      // Test READ (check if table exists and can be read)
      try {
        const readData = await this.makeRequest(`/${tableName}?maxRecords=1`);
        result.exists = true;
        result.readSuccess = true;
        console.log(`   ✅ READ: Table exists and readable`);
      } catch (error) {
        result.error = `READ failed: ${error}`;
        console.log(`   ❌ READ: ${error}`);
        return result;
      }

      // Test CREATE
      try {
        const testRecord = {
          fields: {
            'Name': `Test Record ${Date.now()}`,
            'Status': 'Testing',
            'Created': new Date().toISOString()
          }
        };

        const createData = await this.makeRequest(`/${tableName}`, 'POST', {
          records: [testRecord]
        });

        if (createData.records && createData.records.length > 0) {
          result.createSuccess = true;
          console.log(`   ✅ CREATE: Record created successfully`);

          const recordId = createData.records[0].id;

          // Test UPDATE
          try {
            const updateData = await this.makeRequest(`/${tableName}/${recordId}`, 'PATCH', {
              fields: {
                'Status': 'Updated'
              }
            });

            result.updateSuccess = true;
            console.log(`   ✅ UPDATE: Record updated successfully`);

            // Test DELETE
            try {
              await this.makeRequest(`/${tableName}/${recordId}`, 'DELETE');
              result.deleteSuccess = true;
              console.log(`   ✅ DELETE: Record deleted successfully`);
            } catch (error) {
              result.error = `DELETE failed: ${error}`;
              console.log(`   ❌ DELETE: ${error}`);
            }
          } catch (error) {
            result.error = `UPDATE failed: ${error}`;
            console.log(`   ❌ UPDATE: ${error}`);
          }
        }
      } catch (error) {
        result.error = `CREATE failed: ${error}`;
        console.log(`   ❌ CREATE: ${error}`);
      }

    } catch (error) {
      result.error = `General error: ${error}`;
      console.log(`   ❌ GENERAL: ${error}`);
    }

    return result;
  }

  public async runVerification(): Promise<VerificationReport> {
    console.log('🚀 Starting Airtable Truth Verification...\n');

    // Validate API configuration
    const apiKeyValid = this.apiKey.length > 0;
    const baseIdValid = this.baseId.length > 0;

    if (!apiKeyValid || !baseIdValid) {
      throw new Error('Invalid Airtable configuration. Check .env.local file.');
    }

    // Get all tables
    const tables = await this.getAllTables();
    console.log(`📋 Found ${tables.length} tables to verify:`);
    console.log(`   ${tables.join(', ')}\n`);

    // Test each table
    const tableResults: TableTestResult[] = [];
    let successfulTables = 0;

    for (const tableName of tables) {
      const result = await this.testTableCRUD(tableName);
      tableResults.push(result);

      if (result.createSuccess && result.readSuccess && result.updateSuccess && result.deleteSuccess) {
        successfulTables++;
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const crudSuccessRate = (successfulTables / tables.length) * 100;

    const report: VerificationReport = {
      totalTables: tables.length,
      successfulTables,
      failedTables: tables.length - successfulTables,
      crudSuccessRate,
      tableResults,
      apiKeyValid,
      baseIdValid
    };

    this.printReport(report);
    return report;
  }

  private printReport(report: VerificationReport): void {
    console.log('\n🎯 AIRTABLE VERIFICATION REPORT');
    console.log('=====================================');
    console.log(`📊 Total Tables: ${report.totalTables}`);
    console.log(`✅ Successful CRUD: ${report.successfulTables}/${report.totalTables}`);
    console.log(`❌ Failed CRUD: ${report.failedTables}/${report.totalTables}`);
    console.log(`🎯 Success Rate: ${report.crudSuccessRate.toFixed(1)}%`);
    console.log(`🔑 API Key Valid: ${report.apiKeyValid ? '✅' : '❌'}`);
    console.log(`📋 Base ID Valid: ${report.baseIdValid ? '✅' : '❌'}`);

    if (report.failedTables > 0) {
      console.log('\n⚠️  Tables with Issues:');
      report.tableResults
        .filter(r => !(r.createSuccess && r.readSuccess && r.updateSuccess && r.deleteSuccess))
        .forEach(result => {
          console.log(`   ❌ ${result.tableName}: ${result.error || 'CRUD operations incomplete'}`);
        });
    }

    if (report.successfulTables > 0) {
      console.log('\n✅ Successfully Verified Tables:');
      report.tableResults
        .filter(r => r.createSuccess && r.readSuccess && r.updateSuccess && r.deleteSuccess)
        .forEach(result => {
          console.log(`   ✅ ${result.tableName}: Full CRUD operations successful`);
        });
    }

    console.log(`\n🌐 Access your base: https://airtable.com/${report.baseIdValid ? process.env.AIRTABLE_BASE_ID : 'INVALID_BASE'}`);
    console.log('🎯 Verification completed!\n');
  }
}

// Run verification if called directly
if (require.main === module) {
  const verifier = new AirtableVerifier();
  verifier.runVerification()
    .then(report => {
      // Write report to file for documentation
      const fs = require('fs');
      const reportPath = 'docs/airtable-verification-report.md';
      
      const markdownReport = `# Airtable Verification Report
**Date**: ${new Date().toISOString()}
**Purpose**: Truth verification of Airtable infrastructure claims

## Summary
- **Total Tables**: ${report.totalTables}
- **Successful CRUD**: ${report.successfulTables}/${report.totalTables}
- **Success Rate**: ${report.crudSuccessRate.toFixed(1)}%
- **API Key Valid**: ${report.apiKeyValid}
- **Base ID Valid**: ${report.baseIdValid}

## Detailed Results
${report.tableResults.map(r => `
### ${r.tableName}
- **Exists**: ${r.exists ? '✅' : '❌'}
- **CREATE**: ${r.createSuccess ? '✅' : '❌'}
- **READ**: ${r.readSuccess ? '✅' : '❌'}
- **UPDATE**: ${r.updateSuccess ? '✅' : '❌'}
- **DELETE**: ${r.deleteSuccess ? '✅' : '❌'}
${r.error ? `- **Error**: ${r.error}` : ''}
`).join('')}

## Truth Assessment
**CLAIMED**: "18/18 tables with full CRUD operations", "100% CRUD success"
**ACTUAL**: ${report.totalTables} tables found, ${report.crudSuccessRate.toFixed(1)}% CRUD success rate

**Truth Score**: ${report.crudSuccessRate >= 95 ? '9/10 (Accurate)' : report.crudSuccessRate >= 80 ? '7/10 (Mostly Accurate)' : '4/10 (Significant Discrepancies)'}
`;

      fs.writeFileSync(reportPath, markdownReport);
      console.log(`📄 Report saved to: ${reportPath}`);
      
      process.exit(report.crudSuccessRate >= 95 ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
}

export { AirtableVerifier, VerificationReport, TableTestResult }; 