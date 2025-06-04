/**
 * DEPRECATED: This script references deleted airtable-table-definitions.json
 * Legacy table definitions file has been deleted as part of 36→18 table transformation
 * Use direct Airtable API integration for 18-table architecture instead
 * 
 * Make.com Integration Tester
 * 
 * Tests integration between Airtable table definitions and Make.com scenarios.
 * Validates webhook IDs, field mappings, and table structure requirements.
 * 
 * Codex v6.1.4 compliant with proper error handling and logging.
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const TABLE_DEFINITIONS_PATH = path.join(__dirname, '../../airtable-table-definitions.json');
const LOG_FILE = path.join(__dirname, '../../infra/airtable/make-integration-test-log.md');

// Critical Make.com scenarios that must be supported
const CRITICAL_MAKE_SCENARIOS = {
  'admin_add_project': '1006807',
  'add_project': '1003214',
  'emotional_recovery': 'emotional-sovereignty',
  'sparksplit_integration': 'sparksplit-ab-results'
};

// Expected field mappings for each scenario
const EXPECTED_FIELD_MAPPINGS: Record<string, string[]> = {
  'admin_add_project': ['sessionId', 'promptType', 'trustScore', 'emotionalDepth', 'outputs'],
  'add_project': ['sessionId', 'promptType', 'trustScore', 'emotionalDepth', 'outputs'],
  'emotional_recovery': ['sessionId', 'trustScore', 'emotionalArcType', 'recoveryNeeded', 'context'],
  'sparksplit_integration': [
    'sessionId', 'productType', 'comparisonId', 'trustScoreDelta', 
    'aweScore', 'ownershipScore', 'wonderScore', 'calmScore', 'powerScore',
    'sterileOutput', 'enhancedOutput'
  ]
};

// Required tables for Make.com integration
const REQUIRED_TABLES = [
  'PromptLogs',
  'SparkSplitAnalytics',
  'EmotionalSovereignty',
  'EmotionalRecovery'
];

// Interface definitions
interface FieldDefinition {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  emotionalRole?: string;
  dataSensitivity?: string;
}

interface MakeIntegrationPoint {
  scenarioName: string;
  webhookId: string;
  fields: string[];
}

interface TableDefinition {
  name: string;
  description?: string;
  primaryKey: string;
  makeIntegration?: boolean;
  priority?: number;
  fields: FieldDefinition[];
  relationships?: any[];
  makeIntegrationPoints?: MakeIntegrationPoint[];
}

interface ValidationResult {
  tableName: string;
  exists: boolean;
  makeIntegration: boolean;
  integrationPoints: number;
  scenarios: string[];
  missingFields: string[];
  errors: string[];
  warnings: string[];
  valid: boolean;
}

interface TestResult {
  overallValid: boolean;
  requiredTablesPresent: boolean;
  criticalScenariosSupported: boolean;
  tableResults: ValidationResult[];
  missingTables: string[];
  missingScenarios: string[];
  errorCount: number;
  warningCount: number;
}

// Utility to write to log file
function appendToLog(message: string): void {
  const timestamp = new Date().toISOString();
  const logEntry = `\n## ${timestamp}\n${message}\n`;
  
  fs.appendFileSync(LOG_FILE, logEntry, 'utf8');
  console.log(message);
}

// Initialize log file
function initializeLog(): void {
  const header = `# Make.com Integration Test Log\n\nTest started at ${new Date().toISOString()}\n`;
  fs.writeFileSync(LOG_FILE, header, 'utf8');
}

// Load table definitions
function loadTableDefinitions(): TableDefinition[] {
  try {
    const definitions = JSON.parse(fs.readFileSync(TABLE_DEFINITIONS_PATH, 'utf8'));
    return Array.isArray(definitions) ? definitions : [];
  } catch (error: any) {
    appendToLog(`❌ Error loading table definitions: ${error.message}`);
    return [];
  }
}

// Validate Make.com integration for a single table
function validateTableIntegration(table: TableDefinition): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const scenarios: string[] = [];
  const missingFields: string[] = [];
  
  // Check if Make.com integration is enabled
  if (!table.makeIntegration) {
    if (REQUIRED_TABLES.includes(table.name)) {
      errors.push(`Table should have makeIntegration set to true`);
    } else {
      warnings.push(`Table does not have makeIntegration enabled`);
    }
  }
  
  // Check for integration points
  if (!table.makeIntegrationPoints || !Array.isArray(table.makeIntegrationPoints) || table.makeIntegrationPoints.length === 0) {
    if (table.makeIntegration) {
      errors.push(`Table has makeIntegration enabled but no makeIntegrationPoints defined`);
    }
    
    return {
      tableName: table.name,
      exists: true,
      makeIntegration: !!table.makeIntegration,
      integrationPoints: 0,
      scenarios: [],
      missingFields: [],
      errors,
      warnings,
      valid: errors.length === 0
    };
  }
  
  // Check each integration point
  table.makeIntegrationPoints.forEach(point => {
    if (!point.scenarioName) {
      errors.push(`Integration point missing scenarioName`);
    } else {
      scenarios.push(point.scenarioName);
      
      // Check if this is a critical scenario
      if (CRITICAL_MAKE_SCENARIOS[point.scenarioName] && 
          CRITICAL_MAKE_SCENARIOS[point.scenarioName] !== point.webhookId) {
        errors.push(`Integration point for '${point.scenarioName}' has incorrect webhookId: '${point.webhookId}' (expected: '${CRITICAL_MAKE_SCENARIOS[point.scenarioName]}')`);
      }
    }
    
    if (!point.webhookId) {
      errors.push(`Integration point for '${point.scenarioName || 'unknown'}' missing webhookId`);
    }
    
    if (!point.fields || !Array.isArray(point.fields) || point.fields.length === 0) {
      errors.push(`Integration point for '${point.scenarioName || 'unknown'}' missing fields array`);
    } else {
      // Check if all fields exist in the table
      const tableFieldNames = table.fields.map(f => f.name);
      const missingFieldsInTable = point.fields.filter(f => !tableFieldNames.includes(f));
      
      if (missingFieldsInTable.length > 0) {
        errors.push(`Integration point for '${point.scenarioName}' references missing fields: ${missingFieldsInTable.join(', ')}`);
        missingFields.push(...missingFieldsInTable);
      }
      
      // Check against expected fields for this scenario
      if (EXPECTED_FIELD_MAPPINGS[point.scenarioName]) {
        const expectedFields = EXPECTED_FIELD_MAPPINGS[point.scenarioName];
        const missingExpectedFields = expectedFields.filter(f => !point.fields.includes(f));
        
        if (missingExpectedFields.length > 0) {
          errors.push(`Integration point for '${point.scenarioName}' missing expected fields: ${missingExpectedFields.join(', ')}`);
        }
      }
    }
  });
  
  return {
    tableName: table.name,
    exists: true,
    makeIntegration: !!table.makeIntegration,
    integrationPoints: table.makeIntegrationPoints.length,
    scenarios,
    missingFields: [...new Set(missingFields)],
    errors,
    warnings,
    valid: errors.length === 0
  };
}

// Test all tables for Make.com integration
function testMakeIntegration(tables: TableDefinition[]): TestResult {
  const tableResults: ValidationResult[] = [];
  const missingTables: string[] = [];
  const allScenarios: Set<string> = new Set();
  
  // Check if all required tables are present
  const tableNames = tables.map(t => t.name);
  missingTables.push(...REQUIRED_TABLES.filter(t => !tableNames.includes(t)));
  
  // Validate each table
  tables.forEach(table => {
    const result = validateTableIntegration(table);
    tableResults.push(result);
    
    // Collect scenarios for overall analysis
    result.scenarios.forEach(s => allScenarios.add(s));
  });
  
  // Add results for missing tables
  missingTables.forEach(tableName => {
    tableResults.push({
      tableName,
      exists: false,
      makeIntegration: false,
      integrationPoints: 0,
      scenarios: [],
      missingFields: [],
      errors: [`Required table '${tableName}' is missing`],
      warnings: [],
      valid: false
    });
  });
  
  // Check which critical scenarios are missing
  const missingScenarios = Object.keys(CRITICAL_MAKE_SCENARIOS)
    .filter(s => ![...allScenarios].includes(s));
  
  // Calculate overall stats
  const errorCount = tableResults.reduce((sum, r) => sum + r.errors.length, 0);
  const warningCount = tableResults.reduce((sum, r) => sum + r.warnings.length, 0);
  
  return {
    overallValid: errorCount === 0 && missingTables.length === 0 && missingScenarios.length === 0,
    requiredTablesPresent: missingTables.length === 0,
    criticalScenariosSupported: missingScenarios.length === 0,
    tableResults,
    missingTables,
    missingScenarios,
    errorCount,
    warningCount
  };
}

// Generate sample payload for scenario testing
function generateSamplePayload(scenarioName: string): any {
  const sessionId = `test_${Date.now()}`;
  
  // Base payload common to all scenarios
  const basePayload = {
    sessionId,
    timestamp: new Date().toISOString(),
    verificationStatus: 'TEST-VERIFICATION'
  };
  
  // Scenario-specific payloads
  switch (scenarioName) {
    case 'admin_add_project':
      return {
        ...basePayload,
        productType: 'business_plan',
        structuredIntent: 'Launch coffee shop with bold branding',
        emotionalContext: JSON.stringify({
          tonePreference: 'bold',
          industryContext: 'coffee',
          painPoints: ['visibility', 'differentiation']
        }),
        sparkResonance: 0.89,
        selectedSparkName: 'Bold Brew Empire',
        emotionalArcType: 'aspiration_to_confidence',
        startTrustScore: 3.7,
        finalTrustScore: 4.5,
        emotionalDelta: 0.8,
        usedEmotionalMemory: false,
        languageFingerprint: 'bold_confident_optimistic'
      };
      
    case 'add_project':
      return {
        ...basePayload,
        productType: 'email_campaign',
        intent: 'Create email campaign for product launch',
        trustScore: 3.8,
        outputs: 'Email campaign content with 3 sequential messages...',
        emotionalDepth: 0.75,
        industry: 'tech',
        audience: 'small business owners'
      };
      
    case 'emotional_recovery':
      return {
        ...basePayload,
        trustScore: 2.5,
        emotionalArcType: 'confusion_to_clarity',
        recoveryNeeded: true,
        context: JSON.stringify({
          frustrationTrigger: 'unclear_output',
          previousAttempts: 1,
          emotionalState: 'hesitant'
        }),
        productType: 'social_content'
      };
      
    case 'sparksplit_integration':
      return {
        ...basePayload,
        productType: 'business_plan',
        comparisonId: `comp_${Date.now()}`,
        trustDelta: 0.73,
        aweScore: 0.85,
        ownershipScore: 0.91,
        wonderScore: 0.78,
        calmScore: 0.82,
        powerScore: 0.89,
        sterileOutput: 'Basic business plan with standard sections...',
        enhancedOutput: 'Bold, emotionally resonant business plan that creates ownership...'
      };
      
    default:
      return basePayload;
  }
}

// Format test results into detailed log
function formatTestResults(result: TestResult): string {
  let output = `# Make.com Integration Test Results\n\n`;
  
  // Overall status
  output += `## Overall Status\n\n`;
  output += `- **Status**: ${result.overallValid ? '✅ VALID' : '❌ INVALID'}\n`;
  output += `- **Required Tables**: ${result.requiredTablesPresent ? '✅ All Present' : `❌ Missing (${result.missingTables.length})`}\n`;
  output += `- **Critical Scenarios**: ${result.criticalScenariosSupported ? '✅ All Supported' : `❌ Missing (${result.missingScenarios.length})`}\n`;
  output += `- **Errors**: ${result.errorCount}\n`;
  output += `- **Warnings**: ${result.warningCount}\n\n`;
  
  // Missing tables
  if (result.missingTables.length > 0) {
    output += `## Missing Required Tables\n\n`;
    result.missingTables.forEach(table => {
      output += `- \`${table}\`\n`;
    });
    output += `\n`;
  }
  
  // Missing scenarios
  if (result.missingScenarios.length > 0) {
    output += `## Missing Critical Scenarios\n\n`;
    result.missingScenarios.forEach(scenario => {
      output += `- \`${scenario}\` (webhook ID: \`${CRITICAL_MAKE_SCENARIOS[scenario]}\`)\n`;
    });
    output += `\n`;
  }
  
  // Table details
  output += `## Table Details\n\n`;
  
  result.tableResults.forEach(tableResult => {
    output += `### ${tableResult.tableName}\n\n`;
    output += `- **Status**: ${tableResult.valid ? '✅ VALID' : '❌ INVALID'}\n`;
    output += `- **Exists**: ${tableResult.exists ? 'Yes' : 'No'}\n`;
    
    if (tableResult.exists) {
      output += `- **Make.com Integration**: ${tableResult.makeIntegration ? 'Enabled' : 'Disabled'}\n`;
      output += `- **Integration Points**: ${tableResult.integrationPoints}\n`;
      
      if (tableResult.scenarios.length > 0) {
        output += `- **Scenarios**: ${tableResult.scenarios.join(', ')}\n`;
      }
      
      if (tableResult.missingFields.length > 0) {
        output += `- **Missing Fields**: ${tableResult.missingFields.join(', ')}\n`;
      }
    }
    
    if (tableResult.errors.length > 0) {
      output += `\n**Errors**:\n`;
      tableResult.errors.forEach(error => {
        output += `- ${error}\n`;
      });
    }
    
    if (tableResult.warnings.length > 0) {
      output += `\n**Warnings**:\n`;
      tableResult.warnings.forEach(warning => {
        output += `- ${warning}\n`;
      });
    }
    
    output += `\n`;
  });
  
  // Sample payloads
  output += `## Sample Payloads for Testing\n\n`;
  
  Object.keys(CRITICAL_MAKE_SCENARIOS).forEach(scenario => {
    output += `### ${scenario}\n\n`;
    output += `Webhook ID: \`${CRITICAL_MAKE_SCENARIOS[scenario]}\`\n\n`;
    output += "```json\n";
    output += JSON.stringify(generateSamplePayload(scenario), null, 2);
    output += "\n```\n\n";
  });
  
  return output;
}

// Main execution
async function main(): Promise<void> {
  // Initialize log
  initializeLog();
  
  appendToLog('🔍 Starting Make.com integration test...');
  
  // Load table definitions
  const tableDefinitions = loadTableDefinitions();
  
  if (!tableDefinitions || tableDefinitions.length === 0) {
    appendToLog('❌ No table definitions found. Test aborted.');
    process.exit(1);
  }
  
  appendToLog(`📊 Found ${tableDefinitions.length} table definitions to test`);
  
  // Run tests
  const testResults = testMakeIntegration(tableDefinitions);
  
  // Format and save detailed results
  const formattedResults = formatTestResults(testResults);
  fs.writeFileSync(path.join(__dirname, '../../infra/airtable/make-integration-results.md'), formattedResults);
  
  // Log summary
  if (testResults.overallValid) {
    appendToLog(`\n✅ Make.com integration test PASSED!`);
  } else {
    appendToLog(`\n❌ Make.com integration test FAILED!`);
    
    if (testResults.missingTables.length > 0) {
      appendToLog(`\nMissing required tables: ${testResults.missingTables.join(', ')}`);
    }
    
    if (testResults.missingScenarios.length > 0) {
      appendToLog(`\nMissing critical scenarios: ${testResults.missingScenarios.join(', ')}`);
    }
    
    appendToLog(`\nTotal errors: ${testResults.errorCount}`);
  }
  
  appendToLog(`\n📝 Detailed results saved to: infra/airtable/make-integration-results.md`);
  appendToLog(`\n🔍 Test completed at ${new Date().toISOString()}`);
}

// Execute main function with error handling
try {
  main();
} catch (error: any) {
  appendToLog(`❌ Unhandled error: ${error.message}`);
  process.exit(1);
} 