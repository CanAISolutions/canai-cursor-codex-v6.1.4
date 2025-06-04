/**
 * DEPRECATED: This script references deleted airtable-table-definitions.json
 * Legacy table definitions file has been deleted as part of 36→18 table transformation
 * Use direct Airtable API integration for 18-table architecture instead
 * 
 * Make.com Integration Test Script
 * 
 * Tests integration between Airtable tables and Make.com scenarios.
 * Verifies webhook data structure, field mappings, and end-to-end flow.
 * Codex v6.1.4 compliant with production-ready error handling and logging.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// Configuration
const TABLE_DEFINITIONS_PATH = path.join(__dirname, '../../airtable-table-definitions.json');
const TEST_RESULTS_PATH = path.join(__dirname, 'make-integration-test-results.json');
const LOG_FILE = path.join(__dirname, 'make-integration-test-log.md');

// Environment variables (should be set in the system or .env file)
const MAKE_API_KEY = process.env.MAKE_API_KEY || 'test-api-key';
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'test-airtable-key';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Make.com webhook IDs for testing
const MAKE_WEBHOOK_IDS = {
  admin_add_project: '1006807',
  add_project: '1003214',
  add_client: '1003140',
  saap_update: 'saap-update',
  emotional_recovery: 'emotional-sovereignty',
  sparksplit_integration: 'sparksplit-ab-results'
};

// Expected field mappings for Make.com scenarios
const EXPECTED_FIELD_MAPPINGS = {
  admin_add_project: [
    'sessionId', 'productType', 'structuredIntent', 'emotionalContext', 
    'sparkResonance', 'selectedSparkName', 'emotionalArcType', 
    'startTrustScore', 'finalTrustScore', 'emotionalDelta',
    'usedEmotionalMemory', 'languageFingerprint'
  ],
  add_project: [
    'sessionId', 'productType', 'intent', 'trustScore', 
    'outputs', 'emotionalDepth'
  ],
  emotional_recovery: [
    'sessionId', 'trustScore', 'emotionalArcType', 'recoveryNeeded',
    'context'
  ],
  sparksplit_integration: [
    'sessionId', 'productType', 'comparisonId', 'trustDelta',
    'aweScore', 'ownershipScore', 'wonderScore', 'calmScore', 'powerScore',
    'sterileOutput', 'enhancedOutput'
  ]
};

// Utility to write to log file
function appendToLog(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `\n## ${timestamp}\n${message}\n`;
  
  fs.appendFileSync(LOG_FILE, logEntry, 'utf8');
  console.log(message);
}

// Utility to initialize log file
function initializeLog() {
  const header = `# Make.com Integration Test Log\n\nTesting started at ${new Date().toISOString()}\n`;
  fs.writeFileSync(LOG_FILE, header, 'utf8');
}

// Load table definitions
function loadTableDefinitions() {
  try {
    return JSON.parse(fs.readFileSync(TABLE_DEFINITIONS_PATH, 'utf8'));
  } catch (error) {
    appendToLog(`❌ Error loading table definitions: ${error.message}`);
    return null;
  }
}

// Generate a test session ID
function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const randomPart = crypto.randomBytes(4).toString('hex');
  return `test_session_${timestamp}${randomPart}`;
}

// Make an HTTP request to a webhook URL
function makeWebhookRequest(webhookUrl, payload) {
  return new Promise((resolve, reject) => {
    // Prepare request data
    const data = JSON.stringify(payload);
    
    // Extract hostname and path from webhook URL
    const url = new URL(webhookUrl);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${MAKE_API_KEY}`
      }
    };
    
    // Create request
    const req = https.request(options, (res) => {
      let responseData = '';
      
      // Collect response data
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      // Process response when complete
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const jsonResponse = JSON.parse(responseData);
            resolve({
              success: true,
              statusCode: res.statusCode,
              response: jsonResponse
            });
          } catch (error) {
            resolve({
              success: true,
              statusCode: res.statusCode,
              response: responseData
            });
          }
        } else {
          resolve({
            success: false,
            statusCode: res.statusCode,
            response: responseData
          });
        }
      });
    });
    
    // Handle request errors
    req.on('error', (error) => {
      reject({
        success: false,
        error: error.message
      });
    });
    
    // Send payload
    req.write(data);
    req.end();
  });
}

// Test a Make.com webhook scenario
async function testMakeScenario(scenarioName, webhookId) {
  try {
    appendToLog(`🔍 Testing Make.com scenario: ${scenarioName}`);
    
    // Create webhook URL
    const webhookUrl = `https://hook.us1.make.com/${webhookId}`;
    
    // Generate test payload based on scenario
    const sessionId = generateSessionId();
    const payload = generateTestPayload(scenarioName, sessionId);
    
    appendToLog(`📤 Sending payload to webhook: ${webhookUrl}`);
    appendToLog(`📦 Payload: ${JSON.stringify(payload, null, 2)}`);
    
    // If running in test mode, don't actually make the request
    if (process.env.TEST_MODE === 'true') {
      appendToLog(`🧪 TEST MODE: Not making actual webhook request`);
      return {
        scenarioName,
        webhookUrl,
        sessionId,
        success: true,
        testMode: true,
        payload
      };
    }
    
    // Make the webhook request
    const result = await makeWebhookRequest(webhookUrl, payload);
    
    // Log result
    if (result.success) {
      appendToLog(`✅ Webhook request successful: Status ${result.statusCode}`);
      appendToLog(`📥 Response: ${JSON.stringify(result.response, null, 2)}`);
    } else {
      appendToLog(`❌ Webhook request failed: Status ${result.statusCode}`);
      appendToLog(`📥 Response: ${result.response}`);
    }
    
    return {
      scenarioName,
      webhookUrl,
      sessionId,
      success: result.success,
      statusCode: result.statusCode,
      response: result.response,
      payload
    };
  } catch (error) {
    appendToLog(`❌ Error testing scenario ${scenarioName}: ${error.message}`);
    return {
      scenarioName,
      success: false,
      error: error.message
    };
  }
}

// Generate a test payload based on scenario
function generateTestPayload(scenarioName, sessionId) {
  const timestamp = new Date().toISOString();
  
  // Base payload common to all scenarios
  const basePayload = {
    sessionId,
    timestamp,
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

// Test all critical Make.com scenarios
async function testAllScenarios() {
  const results = [];
  
  // Test each critical scenario
  for (const [scenarioName, webhookId] of Object.entries(MAKE_WEBHOOK_IDS)) {
    // Only test the 4 main scenarios
    if (['admin_add_project', 'add_project', 'emotional_recovery', 'sparksplit_integration'].includes(scenarioName)) {
      const result = await testMakeScenario(scenarioName, webhookId);
      results.push(result);
      
      // Add a delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

// Verify Airtable table structure against Make.com requirements
function verifyTableStructure(tables) {
  const verificationResults = [];
  
  // Check for critical tables
  const criticalTables = ['PromptLogs', 'SparkSplitAnalytics', 'EmotionalSovereignty', 'EmotionalRecovery'];
  
  for (const criticalTable of criticalTables) {
    const table = tables.find(t => t.name === criticalTable);
    
    if (!table) {
      verificationResults.push({
        tableName: criticalTable,
        exists: false,
        errors: [`Table ${criticalTable} is missing but required for Make.com integration`]
      });
      continue;
    }
    
    const errors = [];
    const warnings = [];
    
    // Check Make.com integration flag
    if (!table.makeIntegration) {
      warnings.push(`Table is missing 'makeIntegration' flag or it's set to false`);
    }
    
    // Check Make.com integration points
    if (!table.makeIntegrationPoints || !Array.isArray(table.makeIntegrationPoints) || table.makeIntegrationPoints.length === 0) {
      errors.push(`Table is missing Make.com integration points array`);
    } else {
      // Check each integration point
      table.makeIntegrationPoints.forEach(point => {
        if (!point.scenarioName) {
          errors.push(`Integration point is missing 'scenarioName'`);
        }
        if (!point.webhookId) {
          errors.push(`Integration point is missing 'webhookId'`);
        }
        if (!point.fields || !Array.isArray(point.fields) || point.fields.length === 0) {
          errors.push(`Integration point is missing 'fields' array`);
        } else {
          // Check if expected fields for scenario are present
          const expectedFields = EXPECTED_FIELD_MAPPINGS[point.scenarioName];
          if (expectedFields) {
            const missingFields = expectedFields.filter(field => !point.fields.includes(field));
            if (missingFields.length > 0) {
              errors.push(`Integration point for '${point.scenarioName}' is missing expected fields: ${missingFields.join(', ')}`);
            }
          }
        }
      });
    }
    
    // Check if all required fields exist
    if (table.fields && Array.isArray(table.fields)) {
      // Get all field names
      const fieldNames = table.fields.map(field => field.name);
      
      // Check if any integration point references non-existent fields
      if (table.makeIntegrationPoints && Array.isArray(table.makeIntegrationPoints)) {
        table.makeIntegrationPoints.forEach(point => {
          if (point.fields && Array.isArray(point.fields)) {
            const nonExistentFields = point.fields.filter(field => !fieldNames.includes(field));
            if (nonExistentFields.length > 0) {
              errors.push(`Integration point for '${point.scenarioName}' references non-existent fields: ${nonExistentFields.join(', ')}`);
            }
          }
        });
      }
      
      // Check if all standard fields exist
      const standardFields = ['recordId', 'createdAt', 'updatedAt', 'sessionId'];
      const missingStandardFields = standardFields.filter(field => !fieldNames.includes(field));
      if (missingStandardFields.length > 0) {
        errors.push(`Table is missing standard fields: ${missingStandardFields.join(', ')}`);
      }
    } else {
      errors.push(`Table has no fields defined`);
    }
    
    verificationResults.push({
      tableName: table.name,
      exists: true,
      valid: errors.length === 0,
      errors,
      warnings
    });
  }
  
  return verificationResults;
}

// Main execution
async function main() {
  // Initialize log
  initializeLog();
  
  appendToLog('🔍 Starting Make.com integration tests...');
  
  // Load table definitions
  const tableDefinitions = loadTableDefinitions();
  
  if (!tableDefinitions) {
    appendToLog('❌ Could not load table definitions. Tests aborted.');
    return;
  }
  
  appendToLog(`📊 Found ${tableDefinitions.length} table definitions`);
  
  // Verify table structure against Make.com requirements
  appendToLog('🔍 Verifying table structure against Make.com requirements...');
  const structureVerification = verifyTableStructure(tableDefinitions);
  
  // Log structure verification results
  appendToLog(`\n## Table Structure Verification Results`);
  structureVerification.forEach(result => {
    if (result.exists && result.valid) {
      appendToLog(`✅ Table ${result.tableName}: Valid for Make.com integration`);
    } else if (result.exists) {
      appendToLog(`⚠️ Table ${result.tableName}: Structure issues found`);
      result.errors.forEach(error => {
        appendToLog(`  - ❌ ${error}`);
      });
      result.warnings.forEach(warning => {
        appendToLog(`  - ⚠️ ${warning}`);
      });
    } else {
      appendToLog(`❌ Table ${result.tableName}: Missing but required for Make.com integration`);
    }
  });
  
  // Test Make.com scenarios if structure validation passes
  const criticalErrors = structureVerification
    .filter(result => !result.exists || (result.exists && !result.valid))
    .length;
  
  if (criticalErrors > 0) {
    appendToLog(`\n⚠️ Found ${criticalErrors} critical structure issues. Skipping Make.com scenario tests.`);
    appendToLog(`🔧 Fix table structure issues before testing webhook integrations.`);
  } else {
    appendToLog(`\n📡 Testing Make.com webhook scenarios...`);
    
    // Test all scenarios
    const scenarioResults = await testAllScenarios();
    
    // Calculate summary
    const successful = scenarioResults.filter(r => r.success).length;
    const failed = scenarioResults.filter(r => !r.success).length;
    
    // Log summary
    appendToLog(`\n## Make.com Scenario Test Results`);
    appendToLog(`✅ Successful: ${successful}`);
    appendToLog(`❌ Failed: ${failed}`);
    
    // Save full results to file
    const fullResults = {
      structureVerification,
      scenarioTests: scenarioResults,
      summary: {
        structureCriticalErrors: criticalErrors,
        successfulScenarios: successful,
        failedScenarios: failed,
        timestamp: new Date().toISOString()
      }
    };
    
    fs.writeFileSync(TEST_RESULTS_PATH, JSON.stringify(fullResults, null, 2), 'utf8');
    appendToLog(`\n📝 Full test results saved to ${TEST_RESULTS_PATH}`);
  }
  
  appendToLog(`\n🔍 Make.com integration tests completed at ${new Date().toISOString()}`);
}

// Execute main function with error handling
try {
  main();
} catch (error) {
  appendToLog(`❌ Unhandled error: ${error.message}`);
  process.exit(1);
} 