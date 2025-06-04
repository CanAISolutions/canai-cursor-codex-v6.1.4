/**
 * CanAI CSV Data Source Validation Script
 * Validates that every CSV field has a verified data source and accurate sample data
 * 
 * Version: v1.0.0
 * Date: 2025-05-29
 * Purpose: Ensure CSV accuracy before Airtable import
 */

import * as fs from 'fs';
import * as path from 'path';

interface FieldDataSource {
  fieldName: string;
  dataSource: 'user_input' | 'api_response' | 'calculated' | 'system_generated' | 'placeholder';
  component: string;
  filePath: string;
  verified: boolean;
  sampleValue: any;
  notes: string;
}

interface CSVValidationResult {
  tableName: string;
  totalFields: number;
  verifiedFields: number;
  placeholderFields: number;
  missingSourceFields: number;
  issues: string[];
  dataSourceMap: FieldDataSource[];
}

export class CSVDataSourceValidator {
  private validationResults: CSVValidationResult[];

  constructor() {
    // Note: Legacy CSV directory removed - 18-table architecture uses direct API integration
    console.log('⚠️  CSV data source validation not applicable for 18-table architecture');
    console.log('✅ Using direct Airtable API integration instead of CSV imports');
    this.validationResults = [];
  }

  public async validateAllCSVFiles(): Promise<void> {
    console.log('⚠️  CSV Data Source Validation not applicable for 18-table architecture');
    console.log('✅ Using direct Airtable API integration instead of CSV imports');
    console.log('💡 Run: npm run test-airtable-crud for table validation');
    return;
  }

  private async validateCSVFile(csvFile: string): Promise<void> {
    console.log('⚠️  CSV file validation not applicable for 18-table architecture');
    return;
  }

  private async mapFieldDataSources(
    tableName: string, 
    headers: string[], 
    sampleData: string[]
  ): Promise<FieldDataSource[]> {
    const dataSourceMap: FieldDataSource[] = [];

    for (let i = 0; i < headers.length; i++) {
      const fieldName = headers[i];
      const sampleValue = sampleData[i] || '';
      
      const fieldMapping = this.getFieldDataSource(tableName, fieldName, sampleValue);
      dataSourceMap.push(fieldMapping);
    }

    return dataSourceMap;
  }

  private getFieldDataSource(tableName: string, fieldName: string, sampleValue: string): FieldDataSource {
    // Universal system fields
    if (fieldName === 'recordId') {
      return {
        fieldName,
        dataSource: 'system_generated',
        component: 'ULID Generator',
        filePath: '/lib/utils/ulid-generator.ts',
        verified: true,
        sampleValue,
        notes: 'Auto-generated ULID for record identification'
      };
    }

    if (fieldName === 'createdAt' || fieldName === 'updatedAt') {
      return {
        fieldName,
        dataSource: 'system_generated',
        component: 'Airtable System',
        filePath: 'Airtable auto-generation',
        verified: true,
        sampleValue,
        notes: 'Airtable automatic timestamp'
      };
    }

    if (fieldName === 'sessionId') {
      return {
        fieldName,
        dataSource: 'system_generated',
        component: 'Session Manager',
        filePath: '/cursor/services/session-manager.ts',
        verified: true,
        sampleValue,
        notes: 'Session tracking identifier'
      };
    }

    if (fieldName === 'userId') {
      return {
        fieldName,
        dataSource: 'user_input',
        component: 'User Context Extractor',
        filePath: '/api/services/user-context-extractor.ts',
        verified: true,
        sampleValue,
        notes: 'User identification from context'
      };
    }

    // Table-specific field mappings
    switch (tableName) {
      case '01_PromptLogs':
        return this.getPromptLogsFieldSource(fieldName, sampleValue);
      case '02_SparkSplitAnalytics':
        return this.getSparkSplitFieldSource(fieldName, sampleValue);
      case '03_SessionAnalytics':
        return this.getSessionAnalyticsFieldSource(fieldName, sampleValue);
      case '04_UserContext':
        return this.getUserContextFieldSource(fieldName, sampleValue);
      default:
        return this.getGenericFieldSource(fieldName, sampleValue);
    }
  }

  private getPromptLogsFieldSource(fieldName: string, sampleValue: string): FieldDataSource {
    const promptLogsMapping: Record<string, FieldDataSource> = {
      promptType: {
        fieldName,
        dataSource: 'user_input',
        component: 'PromptType Router',
        filePath: '/prompts/promptTypeRouter.ts',
        verified: true,
        sampleValue,
        notes: 'Product type selection from 11 available products'
      },
      intent: {
        fieldName,
        dataSource: 'user_input',
        component: 'Intent Extractor',
        filePath: '/cursor/services/intent-extractor.ts',
        verified: false,
        sampleValue,
        notes: 'NEEDS VERIFICATION: Intent extraction component'
      },
      inputs: {
        fieldName,
        dataSource: 'user_input',
        component: 'Emotional Sovereignty Bridge',
        filePath: '/api/webhook/emotional-sovereignty-bridge.ts',
        verified: true,
        sampleValue,
        notes: 'JSON serialized user form inputs'
      },
      outputs: {
        fieldName,
        dataSource: 'api_response',
        component: 'OpenAI Handler',
        filePath: '/api/services/openaiHandler.ts',
        verified: true,
        sampleValue,
        notes: 'AI-generated response from GPT-4o/Claude'
      },
      modelUsed: {
        fieldName,
        dataSource: 'calculated',
        component: 'Master Orchestrator',
        filePath: '/cursor/orchestration/master-orchestrator.ts',
        verified: true,
        sampleValue,
        notes: 'Model selection logic (gpt-4o, claude-4-sonnet)'
      },
      tokensUsed: {
        fieldName,
        dataSource: 'api_response',
        component: 'OpenAI API Response',
        filePath: '/api/services/openaiHandler.ts',
        verified: true,
        sampleValue,
        notes: 'Token count from OpenAI API response'
      },
      trustScore: {
        fieldName,
        dataSource: 'calculated',
        component: 'Emotional Sovereignty Orchestrator',
        filePath: '/api/orchestration/emotional-sovereignty-orchestrator.ts',
        verified: true,
        sampleValue,
        notes: 'Trust score calculation (lines 222-251)'
      },
      industry: {
        fieldName,
        dataSource: 'user_input',
        component: 'Webflow Discovery Funnel',
        filePath: '/cursor/webflow/discovery-funnel-embed.html',
        verified: false,
        sampleValue,
        notes: 'NEEDS VERIFICATION: Webflow form field (line 156)'
      },
      audience: {
        fieldName,
        dataSource: 'user_input',
        component: 'Webflow Discovery Funnel',
        filePath: '/cursor/webflow/discovery-funnel-embed.html',
        verified: false,
        sampleValue,
        notes: 'NEEDS VERIFICATION: Webflow form field (line 178)'
      },
      goal: {
        fieldName,
        dataSource: 'user_input',
        component: 'Webflow Discovery Funnel',
        filePath: '/cursor/webflow/discovery-funnel-embed.html',
        verified: false,
        sampleValue,
        notes: 'NEEDS VERIFICATION: Webflow form field (line 134)'
      },
      tone: {
        fieldName,
        dataSource: 'user_input',
        component: 'Variable Alias Map',
        filePath: '/cursor/system-intel/variable-alias-map.json',
        verified: true,
        sampleValue,
        notes: 'Tone selection or smart default'
      },
      customerContent: {
        fieldName,
        dataSource: 'user_input',
        component: 'Site Audit Template',
        filePath: '/gpt-templates/site_audit.v1.prompt',
        verified: true,
        sampleValue,
        notes: 'Content to audit for site_audit product'
      },
      problemSolved: {
        fieldName,
        dataSource: 'user_input',
        component: 'Business Plan Template',
        filePath: '/gpt-templates/business_plan.v1.prompt',
        verified: true,
        sampleValue,
        notes: 'Problem business solves (line 31)'
      },
      differentiator: {
        fieldName,
        dataSource: 'user_input',
        component: 'Business Plan Template',
        filePath: '/gpt-templates/business_plan.v1.prompt',
        verified: true,
        sampleValue,
        notes: 'Competitive advantage (line 35)'
      },
      founderBio: {
        fieldName,
        dataSource: 'user_input',
        component: 'AI Brand Identity Template',
        filePath: '/gpt-templates/ai_brand_identity.v1.prompt',
        verified: true,
        sampleValue,
        notes: 'Founder background (line 28)'
      }
    };

    return promptLogsMapping[fieldName] || this.getGenericFieldSource(fieldName, sampleValue);
  }

  private getSparkSplitFieldSource(fieldName: string, sampleValue: string): FieldDataSource {
    const sparkSplitMapping: Record<string, FieldDataSource> = {
      comparisonId: {
        fieldName,
        dataSource: 'system_generated',
        component: 'SparkSplit Engine',
        filePath: '/cursor/services/spark-split-engine.ts',
        verified: true,
        sampleValue,
        notes: 'Comparison ID generation (line 156)'
      },
      testId: {
        fieldName,
        dataSource: 'system_generated',
        component: 'SparkSplit A/B Testing Engine',
        filePath: '/cursor/services/spark-split-ab-testing-engine.ts',
        verified: false,
        sampleValue,
        notes: 'NEEDS VERIFICATION: A/B test ID generation'
      },
      productType: {
        fieldName,
        dataSource: 'user_input',
        component: 'PromptType Router',
        filePath: '/prompts/promptTypeRouter.ts',
        verified: true,
        sampleValue,
        notes: 'Product type from promptType field'
      },
      sterileOutput: {
        fieldName,
        dataSource: 'calculated',
        component: 'SparkSplit Engine',
        filePath: '/cursor/services/spark-split-engine.ts',
        verified: true,
        sampleValue,
        notes: 'Baseline AI output generation (lines 234-267)'
      },
      enhancedOutput: {
        fieldName,
        dataSource: 'calculated',
        component: 'SparkSplit Engine',
        filePath: '/cursor/services/spark-split-engine.ts',
        verified: true,
        sampleValue,
        notes: 'CanAI enhanced output (lines 289-322)'
      },
      conversionLift: {
        fieldName,
        dataSource: 'calculated',
        component: 'Conversion Lift Calculator',
        filePath: '/cursor/analytics/conversion-lift-calculator.ts',
        verified: false,
        sampleValue,
        notes: 'NEEDS VERIFICATION: Performance improvement calculation'
      },
      trustScoreDelta: {
        fieldName,
        dataSource: 'calculated',
        component: 'SparkSplit Engine',
        filePath: '/cursor/services/spark-split-engine.ts',
        verified: true,
        sampleValue,
        notes: 'Trust score difference calculation (lines 557-590)'
      },
      aweScore: {
        fieldName,
        dataSource: 'calculated',
        component: 'Emotional Compass',
        filePath: '/cursor/services/emotional-compass.ts',
        verified: false,
        sampleValue,
        notes: 'NEEDS VERIFICATION: Awe emotion measurement'
      },
      ownershipScore: {
        fieldName,
        dataSource: 'calculated',
        component: 'Emotional Compass',
        filePath: '/cursor/services/emotional-compass.ts',
        verified: false,
        sampleValue,
        notes: 'NEEDS VERIFICATION: Ownership feeling measurement'
      },
      userSelection: {
        fieldName,
        dataSource: 'user_input',
        component: 'SparkSplit UI',
        filePath: '/cursor/dashboard/sparksplit-ui.ts',
        verified: false,
        sampleValue,
        notes: 'NEEDS VERIFICATION: User choice in SparkSplit comparison'
      }
    };

    return sparkSplitMapping[fieldName] || this.getGenericFieldSource(fieldName, sampleValue);
  }

  private getSessionAnalyticsFieldSource(fieldName: string, sampleValue: string): FieldDataSource {
    // Placeholder mapping for SessionAnalytics - needs implementation
    return {
      fieldName,
      dataSource: 'placeholder',
      component: 'Not Implemented',
      filePath: 'TBD',
      verified: false,
      sampleValue,
      notes: 'PLACEHOLDER: SessionAnalytics field mapping needed'
    };
  }

  private getUserContextFieldSource(fieldName: string, sampleValue: string): FieldDataSource {
    // Placeholder mapping for UserContext - needs implementation
    return {
      fieldName,
      dataSource: 'placeholder',
      component: 'Not Implemented',
      filePath: 'TBD',
      verified: false,
      sampleValue,
      notes: 'PLACEHOLDER: UserContext field mapping needed'
    };
  }

  private getGenericFieldSource(fieldName: string, sampleValue: string): FieldDataSource {
    return {
      fieldName,
      dataSource: 'placeholder',
      component: 'Unknown',
      filePath: 'TBD',
      verified: false,
      sampleValue,
      notes: 'NEEDS INVESTIGATION: Data source not mapped'
    };
  }

  private identifyIssues(dataSourceMap: FieldDataSource[]): string[] {
    const issues: string[] = [];

    // Check for unverified critical fields
    const unverifiedCritical = dataSourceMap.filter(f => 
      !f.verified && 
      ['trustScore', 'promptType', 'outputs', 'inputs'].includes(f.fieldName)
    );

    if (unverifiedCritical.length > 0) {
      issues.push(`Critical fields unverified: ${unverifiedCritical.map(f => f.fieldName).join(', ')}`);
    }

    // Check for placeholder data
    const placeholders = dataSourceMap.filter(f => f.dataSource === 'placeholder');
    if (placeholders.length > 0) {
      issues.push(`Placeholder fields: ${placeholders.map(f => f.fieldName).join(', ')}`);
    }

    // Check for missing file paths
    const missingPaths = dataSourceMap.filter(f => 
      f.filePath === 'TBD' || f.filePath.includes('NEEDS VERIFICATION')
    );

    if (missingPaths.length > 0) {
      issues.push(`Missing file paths: ${missingPaths.map(f => f.fieldName).join(', ')}`);
    }

    // Check for sample data quality
    const emptySamples = dataSourceMap.filter(f => 
      !f.sampleValue || f.sampleValue.trim() === ''
    );

    if (emptySamples.length > 0) {
      issues.push(`Empty sample data: ${emptySamples.map(f => f.fieldName).join(', ')}`);
    }

    return issues;
  }

  private generateValidationReport(): void {
    console.log('\n📊 CSV DATA SOURCE VALIDATION REPORT');
    console.log('=====================================');

    let totalFields = 0;
    let totalVerified = 0;
    let totalPlaceholders = 0;
    let totalIssues = 0;

    for (const result of this.validationResults) {
      totalFields += result.totalFields;
      totalVerified += result.verifiedFields;
      totalPlaceholders += result.placeholderFields;
      totalIssues += result.issues.length;

      console.log(`\n📋 ${result.tableName}`);
      console.log(`   Fields: ${result.totalFields} | Verified: ${result.verifiedFields} | Placeholders: ${result.placeholderFields}`);
      
      if (result.issues.length > 0) {
        console.log(`   ⚠️  Issues: ${result.issues.length}`);
        result.issues.forEach(issue => console.log(`      - ${issue}`));
      }
    }

    console.log('\n📈 SUMMARY');
    console.log(`Total Fields: ${totalFields}`);
    console.log(`Verified Fields: ${totalVerified} (${Math.round(totalVerified/totalFields*100)}%)`);
    console.log(`Placeholder Fields: ${totalPlaceholders} (${Math.round(totalPlaceholders/totalFields*100)}%)`);
    console.log(`Total Issues: ${totalIssues}`);

    // Determine readiness status
    const verificationRate = totalVerified / totalFields;
    const placeholderRate = totalPlaceholders / totalFields;

    if (verificationRate >= 0.8 && placeholderRate <= 0.2) {
      console.log('\n✅ STATUS: READY FOR AIRTABLE IMPORT');
      console.log('High verification rate with minimal placeholders.');
    } else if (verificationRate >= 0.6) {
      console.log('\n🟡 STATUS: NEEDS VERIFICATION IMPROVEMENTS');
      console.log('Moderate verification rate - address critical fields first.');
    } else {
      console.log('\n❌ STATUS: REQUIRES SIGNIFICANT WORK');
      console.log('Low verification rate - major data source mapping needed.');
    }

    // Export detailed results
    this.exportDetailedResults();
  }

  private exportDetailedResults(): void {
    const detailedReport = {
      validationDate: new Date().toISOString(),
      summary: {
        totalTables: this.validationResults.length,
        totalFields: this.validationResults.reduce((sum, r) => sum + r.totalFields, 0),
        totalVerified: this.validationResults.reduce((sum, r) => sum + r.verifiedFields, 0),
        totalPlaceholders: this.validationResults.reduce((sum, r) => sum + r.placeholderFields, 0),
        totalIssues: this.validationResults.reduce((sum, r) => sum + r.issues.length, 0)
      },
      tableResults: this.validationResults
    };

    fs.writeFileSync(
      path.join(__dirname, 'csv-data-source-validation-results.json'),
      JSON.stringify(detailedReport, null, 2)
    );

    console.log('\n📄 Detailed results exported to: csv-data-source-validation-results.json');
  }
}

// CLI execution
if (require.main === module) {
  const validator = new CSVDataSourceValidator();
  
  validator.validateAllCSVFiles()
    .then(() => {
      console.log('\n✅ CSV Data Source Validation Complete');
    })
    .catch((error: any) => {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    });
} 