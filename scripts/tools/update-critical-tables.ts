/**
 * DEPRECATED: This script is no longer applicable for 18-table architecture
 * Legacy table definitions file has been deleted as part of 36→18 table transformation
 * Use direct Airtable API integration instead
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const TABLE_DEFINITIONS_PATH = path.join(__dirname, '../../airtable-table-definitions.json');
const BACKUP_PATH = path.join(__dirname, '../../airtable-table-definitions.backup.json');
const OUTPUT_LOG = path.join(__dirname, '../../infra/airtable/table-update-log.md');

// Configuration - Legacy file deleted, using 18-table architecture
// const TABLE_DEFINITIONS_PATH = path.join(__dirname, '../../airtable-table-definitions.json'); // DELETED
console.log('⚠️  Table definitions file deleted - using 18-table optimized architecture');
console.log('✅ Direct API integration replaces legacy table definitions');
process.exit(0);

// Make.com webhook IDs
const MAKE_WEBHOOK_IDS: Record<string, string> = {
  'admin_add_project': '1006807',
  'add_project': '1003214',
  'emotional_recovery': 'emotional-sovereignty',
  'sparksplit_integration': 'sparksplit-ab-results'
};

// Critical Make.com tables
const CRITICAL_TABLES = [
  'PromptLogs',
  'SparkSplitAnalytics',
  'EmotionalSovereignty',
  'EmotionalRecovery',
  'SessionAnalytics',
  'UserContext'
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

interface UpdateResult {
  tableName: string;
  action: 'added' | 'updated' | 'skipped';
  fieldsCount: number;
  makeIntegrationPoints?: number;
  errors?: string[];
}

// Utility to write to log file
function appendToLog(message: string): void {
  const timestamp = new Date().toISOString();
  const logEntry = `\n## ${timestamp}\n${message}\n`;
  
  fs.appendFileSync(OUTPUT_LOG, logEntry, 'utf8');
  console.log(message);
}

// Initialize log file
function initializeLog(): void {
  const header = `# Critical Tables Update Log\n\nUpdate started at ${new Date().toISOString()}\n`;
  fs.writeFileSync(OUTPUT_LOG, header, 'utf8');
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

// Save table definitions
function saveTableDefinitions(tables: TableDefinition[]): boolean {
  try {
    // Backup existing file
    if (fs.existsSync(TABLE_DEFINITIONS_PATH)) {
      fs.copyFileSync(TABLE_DEFINITIONS_PATH, BACKUP_PATH);
      appendToLog(`✅ Backed up existing table definitions to ${BACKUP_PATH}`);
    }
    
    // Write new definitions
    fs.writeFileSync(TABLE_DEFINITIONS_PATH, JSON.stringify(tables, null, 2), 'utf8');
    appendToLog(`✅ Saved updated table definitions to ${TABLE_DEFINITIONS_PATH}`);
    return true;
  } catch (error: any) {
    appendToLog(`❌ Error saving table definitions: ${error.message}`);
    return false;
  }
}

// Get the definition for EmotionalSovereignty table
function getEmotionalSovereigntyDefinition(): TableDefinition {
  return {
    name: "EmotionalSovereignty",
    description: "Emotional processing and trust score tracking",
    primaryKey: "recordId",
    makeIntegration: true,
    priority: 3,
    fields: [
      { name: "recordId", type: "ULID", required: true, emotionalRole: "identity", dataSensitivity: "internal" },
      { name: "createdAt", type: "datetime", required: true, emotionalRole: "traceability", dataSensitivity: "internal" },
      { name: "updatedAt", type: "datetime", required: true, emotionalRole: "traceability", dataSensitivity: "internal" },
      { name: "sessionId", type: "string", required: true, emotionalRole: "identity", dataSensitivity: "internal" },
      { name: "productType", type: "string", required: true, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "structuredIntent", type: "string", required: true, emotionalRole: "clarity", dataSensitivity: "internal" },
      { name: "emotionalContext", type: "json", required: true, emotionalRole: "emotion", dataSensitivity: "internal" },
      { name: "sparkResonance", type: "number", required: true, emotionalRole: "emotion", dataSensitivity: "internal" },
      { name: "selectedSparkName", type: "string", required: true, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "emotionalArcType", type: "string", required: true, emotionalRole: "emotion", dataSensitivity: "internal" },
      { name: "startTrustScore", type: "number", required: true, emotionalRole: "trust", dataSensitivity: "internal" },
      { name: "finalTrustScore", type: "number", required: true, emotionalRole: "trust", dataSensitivity: "internal" },
      { name: "emotionalDelta", type: "number", required: true, emotionalRole: "emotion", dataSensitivity: "internal" },
      { name: "usedEmotionalMemory", type: "boolean", required: true, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "languageFingerprint", type: "string", required: true, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "processedAt", type: "datetime", required: true, emotionalRole: "traceability", dataSensitivity: "internal" },
      { name: "status", type: "string", required: true, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "verificationStatus", type: "string", required: true, emotionalRole: "trust", dataSensitivity: "internal" }
    ],
    makeIntegrationPoints: [
      {
        scenarioName: "admin_add_project",
        webhookId: MAKE_WEBHOOK_IDS["admin_add_project"],
        fields: [
          "sessionId", "productType", "structuredIntent", "emotionalContext", 
          "sparkResonance", "selectedSparkName", "emotionalArcType", 
          "startTrustScore", "finalTrustScore", "emotionalDelta", 
          "usedEmotionalMemory", "languageFingerprint", "processedAt", "status"
        ]
      }
    ]
  };
}

// Get the definition for EmotionalRecovery table
function getEmotionalRecoveryDefinition(): TableDefinition {
  return {
    name: "EmotionalRecovery",
    description: "Handles trust breach recovery",
    primaryKey: "recordId",
    makeIntegration: true,
    priority: 4,
    fields: [
      { name: "recordId", type: "ULID", required: true, emotionalRole: "identity", dataSensitivity: "internal" },
      { name: "createdAt", type: "datetime", required: true, emotionalRole: "traceability", dataSensitivity: "internal" },
      { name: "updatedAt", type: "datetime", required: true, emotionalRole: "traceability", dataSensitivity: "internal" },
      { name: "sessionId", type: "string", required: true, emotionalRole: "identity", dataSensitivity: "internal" },
      { name: "productType", type: "string", required: true, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "trustScore", type: "number", required: true, emotionalRole: "trust", dataSensitivity: "internal" },
      { name: "emotionalArcType", type: "string", required: true, emotionalRole: "emotion", dataSensitivity: "internal" },
      { name: "recoveryTriggered", type: "boolean", required: true, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "recoveryReason", type: "string", required: true, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "verificationStatus", type: "string", required: true, emotionalRole: "trust", dataSensitivity: "internal" },
      { name: "processedAt", type: "datetime", required: true, emotionalRole: "traceability", dataSensitivity: "internal" }
    ],
    makeIntegrationPoints: [
      {
        scenarioName: "emotional_recovery",
        webhookId: MAKE_WEBHOOK_IDS["emotional_recovery"],
        fields: [
          "sessionId", "trustScore", "emotionalArcType", "recoveryTriggered", 
          "recoveryReason", "processedAt", "verificationStatus"
        ]
      }
    ]
  };
}

// Get the definition for SessionAnalytics table
function getSessionAnalyticsDefinition(): TableDefinition {
  return {
    name: "SessionAnalytics",
    description: "Session-level tracking metrics",
    primaryKey: "recordId",
    makeIntegration: false,
    priority: 5,
    fields: [
      { name: "recordId", type: "ULID", required: true, emotionalRole: "identity", dataSensitivity: "internal" },
      { name: "createdAt", type: "datetime", required: true, emotionalRole: "traceability", dataSensitivity: "internal" },
      { name: "updatedAt", type: "datetime", required: true, emotionalRole: "traceability", dataSensitivity: "internal" },
      { name: "sessionId", type: "string", required: true, emotionalRole: "identity", dataSensitivity: "internal" },
      { name: "userId", type: "string", required: true, emotionalRole: "identity", dataSensitivity: "internal" },
      { name: "startTime", type: "datetime", required: true, emotionalRole: "traceability", dataSensitivity: "internal" },
      { name: "endTime", type: "datetime", required: false, emotionalRole: "traceability", dataSensitivity: "internal" },
      { name: "sessionDuration", type: "number", required: false, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "promptCount", type: "number", required: true, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "averageTrustScore", type: "number", required: false, emotionalRole: "trust", dataSensitivity: "internal" },
      { name: "trustDelta", type: "number", required: false, emotionalRole: "trust", dataSensitivity: "internal" },
      { name: "completionRate", type: "number", required: false, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "deviceInfo", type: "json", required: false, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "referrer", type: "string", required: false, emotionalRole: "context", dataSensitivity: "internal" }
    ]
  };
}

// Get the definition for UserContext table
function getUserContextDefinition(): TableDefinition {
  return {
    name: "UserContext",
    description: "User profile and preferences",
    primaryKey: "recordId",
    makeIntegration: false,
    priority: 6,
    fields: [
      { name: "recordId", type: "ULID", required: true, emotionalRole: "identity", dataSensitivity: "internal" },
      { name: "createdAt", type: "datetime", required: true, emotionalRole: "traceability", dataSensitivity: "internal" },
      { name: "updatedAt", type: "datetime", required: true, emotionalRole: "traceability", dataSensitivity: "internal" },
      { name: "userId", type: "string", required: true, emotionalRole: "identity", dataSensitivity: "internal" },
      { name: "email", type: "string", required: false, emotionalRole: "identity", dataSensitivity: "pii" },
      { name: "firstName", type: "string", required: false, emotionalRole: "identity", dataSensitivity: "pii" },
      { name: "lastName", type: "string", required: false, emotionalRole: "identity", dataSensitivity: "pii" },
      { name: "industryFocus", type: "string", required: false, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "businessType", type: "string", required: false, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "communicationStyle", type: "string", required: false, emotionalRole: "emotion", dataSensitivity: "internal" },
      { name: "tonePreference", type: "string", required: false, emotionalRole: "emotion", dataSensitivity: "internal" },
      { name: "preferredPromptTypes", type: "json", required: false, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "lastLoginDate", type: "datetime", required: false, emotionalRole: "traceability", dataSensitivity: "internal" },
      { name: "totalSessions", type: "number", required: false, emotionalRole: "context", dataSensitivity: "internal" },
      { name: "averageTrustScore", type: "number", required: false, emotionalRole: "trust", dataSensitivity: "internal" },
      { name: "lifetimeTrustDelta", type: "number", required: false, emotionalRole: "trust", dataSensitivity: "internal" }
    ]
  };
}

// Fix PromptLogs definition to ensure it has Make.com integration points
function fixPromptLogsDefinition(table: TableDefinition): TableDefinition {
  if (!table.makeIntegration) {
    table.makeIntegration = true;
  }
  
  if (!table.makeIntegrationPoints || !Array.isArray(table.makeIntegrationPoints)) {
    table.makeIntegrationPoints = [];
  }
  
  // Check if it already has the necessary integration points
  const hasAdminProject = table.makeIntegrationPoints.some(p => p.scenarioName === 'admin_add_project');
  const hasAddProject = table.makeIntegrationPoints.some(p => p.scenarioName === 'add_project');
  
  if (!hasAdminProject) {
    table.makeIntegrationPoints.push({
      scenarioName: 'admin_add_project',
      webhookId: MAKE_WEBHOOK_IDS['admin_add_project'],
      fields: ['sessionId', 'promptType', 'trustScore', 'emotionalDepth', 'outputs']
    });
  }
  
  if (!hasAddProject) {
    table.makeIntegrationPoints.push({
      scenarioName: 'add_project',
      webhookId: MAKE_WEBHOOK_IDS['add_project'],
      fields: ['sessionId', 'promptType', 'trustScore', 'emotionalDepth', 'outputs']
    });
  }
  
  return table;
}

// Fix SparkSplitAnalytics definition to ensure it has Make.com integration points
function fixSparkSplitAnalyticsDefinition(table: TableDefinition): TableDefinition {
  if (!table.makeIntegration) {
    table.makeIntegration = true;
  }
  
  if (!table.makeIntegrationPoints || !Array.isArray(table.makeIntegrationPoints)) {
    table.makeIntegrationPoints = [];
  }
  
  // Check if it already has the necessary integration point
  const hasSparkSplitIntegration = table.makeIntegrationPoints.some(p => p.scenarioName === 'sparksplit_integration');
  
  if (!hasSparkSplitIntegration) {
    table.makeIntegrationPoints.push({
      scenarioName: 'sparksplit_integration',
      webhookId: MAKE_WEBHOOK_IDS['sparksplit_integration'],
      fields: [
        'sessionId', 'productType', 'comparisonId', 'trustScoreDelta', 
        'aweScore', 'ownershipScore', 'wonderScore', 'calmScore', 'powerScore',
        'sterileOutput', 'enhancedOutput'
      ]
    });
  }
  
  return table;
}

// Update critical tables
function updateCriticalTables(): UpdateResult[] {
  const results: UpdateResult[] = [];
  const existingTables = loadTableDefinitions();
  
  // Get table names
  const tableNames = existingTables.map(t => t.name);
  
  // Process PromptLogs table
  const promptLogsIndex = tableNames.indexOf('PromptLogs');
  if (promptLogsIndex >= 0) {
    const updatedTable = fixPromptLogsDefinition(existingTables[promptLogsIndex]);
    existingTables[promptLogsIndex] = updatedTable;
    
    results.push({
      tableName: 'PromptLogs',
      action: 'updated',
      fieldsCount: updatedTable.fields.length,
      makeIntegrationPoints: updatedTable.makeIntegrationPoints?.length || 0
    });
  }
  
  // Process SparkSplitAnalytics table
  const sparkSplitIndex = tableNames.indexOf('SparkSplitAnalytics');
  if (sparkSplitIndex >= 0) {
    const updatedTable = fixSparkSplitAnalyticsDefinition(existingTables[sparkSplitIndex]);
    existingTables[sparkSplitIndex] = updatedTable;
    
    results.push({
      tableName: 'SparkSplitAnalytics',
      action: 'updated',
      fieldsCount: updatedTable.fields.length,
      makeIntegrationPoints: updatedTable.makeIntegrationPoints?.length || 0
    });
  }
  
  // Add EmotionalSovereignty if it doesn't exist
  if (!tableNames.includes('EmotionalSovereignty')) {
    const emotionalSovereignty = getEmotionalSovereigntyDefinition();
    existingTables.push(emotionalSovereignty);
    
    results.push({
      tableName: 'EmotionalSovereignty',
      action: 'added',
      fieldsCount: emotionalSovereignty.fields.length,
      makeIntegrationPoints: emotionalSovereignty.makeIntegrationPoints?.length || 0
    });
  }
  
  // Add EmotionalRecovery if it doesn't exist
  if (!tableNames.includes('EmotionalRecovery')) {
    const emotionalRecovery = getEmotionalRecoveryDefinition();
    existingTables.push(emotionalRecovery);
    
    results.push({
      tableName: 'EmotionalRecovery',
      action: 'added',
      fieldsCount: emotionalRecovery.fields.length,
      makeIntegrationPoints: emotionalRecovery.makeIntegrationPoints?.length || 0
    });
  }
  
  // Add SessionAnalytics if it doesn't exist
  if (!tableNames.includes('SessionAnalytics')) {
    const sessionAnalytics = getSessionAnalyticsDefinition();
    existingTables.push(sessionAnalytics);
    
    results.push({
      tableName: 'SessionAnalytics',
      action: 'added',
      fieldsCount: sessionAnalytics.fields.length,
      makeIntegrationPoints: sessionAnalytics.makeIntegrationPoints?.length || 0
    });
  }
  
  // Add UserContext if it doesn't exist
  if (!tableNames.includes('UserContext')) {
    const userContext = getUserContextDefinition();
    existingTables.push(userContext);
    
    results.push({
      tableName: 'UserContext',
      action: 'added',
      fieldsCount: userContext.fields.length,
      makeIntegrationPoints: userContext.makeIntegrationPoints?.length || 0
    });
  }
  
  // Save updated tables
  if (results.length > 0) {
    saveTableDefinitions(existingTables);
  }
  
  return results;
}

// Format update results into a detailed log
function formatUpdateResults(results: UpdateResult[]): string {
  let output = `# Critical Tables Update Results\n\n`;
  
  // Summary
  const added = results.filter(r => r.action === 'added').length;
  const updated = results.filter(r => r.action === 'updated').length;
  const skipped = results.filter(r => r.action === 'skipped').length;
  
  output += `## Summary\n\n`;
  output += `- **Added**: ${added}\n`;
  output += `- **Updated**: ${updated}\n`;
  output += `- **Skipped**: ${skipped}\n`;
  output += `- **Total**: ${results.length}\n\n`;
  
  // Table details
  output += `## Table Details\n\n`;
  
  results.forEach(result => {
    output += `### ${result.tableName}\n\n`;
    output += `- **Action**: ${result.action}\n`;
    output += `- **Fields**: ${result.fieldsCount}\n`;
    
    if (result.makeIntegrationPoints !== undefined) {
      output += `- **Make.com Integration Points**: ${result.makeIntegrationPoints}\n`;
    }
    
    if (result.errors && result.errors.length > 0) {
      output += `\n**Errors**:\n`;
      result.errors.forEach(error => {
        output += `- ${error}\n`;
      });
    }
    
    output += `\n`;
  });
  
  return output;
}

// Main execution
async function main(): Promise<void> {
  // Initialize log
  initializeLog();
  
  appendToLog('🔍 Starting critical tables update...');
  
  // Update tables
  const updateResults = updateCriticalTables();
  
  // Format and save detailed results
  const formattedResults = formatUpdateResults(updateResults);
  fs.writeFileSync(path.join(__dirname, '../../infra/airtable/table-update-results.md'), formattedResults);
  
  // Log summary
  const added = updateResults.filter(r => r.action === 'added').length;
  const updated = updateResults.filter(r => r.action === 'updated').length;
  
  appendToLog(`\n📊 Update Summary:`);
  appendToLog(`- Added: ${added} tables`);
  appendToLog(`- Updated: ${updated} tables`);
  appendToLog(`- Total: ${updateResults.length} tables processed`);
  
  if (added > 0 || updated > 0) {
    appendToLog(`\n✅ Critical tables update SUCCESSFUL!`);
  } else {
    appendToLog(`\n⚠️ No changes were made.`);
  }
  
  appendToLog(`\n📝 Detailed results saved to: infra/airtable/table-update-results.md`);
  appendToLog(`\n🔍 Update completed at ${new Date().toISOString()}`);
}

// Execute main function with error handling
try {
  main();
} catch (error: any) {
  appendToLog(`❌ Unhandled error: ${error.message}`);
  process.exit(1);
} 