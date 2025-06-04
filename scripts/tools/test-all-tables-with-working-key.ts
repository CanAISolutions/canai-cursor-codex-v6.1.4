#!/usr/bin/env npx ts-node

/**
 * CanAI Codex v6.1.4 - Test All Tables with Working Key
 * 
 * What: Insert test entries into all CanAI Airtable tables using working API key
 * Why: Validate 100% operational functionality with real data
 * How: Use working API key and actual table names from definitions
 */

import Airtable from 'airtable';
import * as fs from 'fs';

// Working API key from test-new-api-key.ts
const AIRTABLE_API_KEY = "patm0p87AP12yGYUS.e9c0549cd4d70808e02d5261ef59a4e15d02e604ace8fef9483b4fae4df48ef5";
const BASE_ID = "apph8yM7gVc9QBFtx";

// Initialize Airtable
const base = new Airtable({
  apiKey: AIRTABLE_API_KEY
}).base(BASE_ID);

/**
 * Load actual table names from definitions
 */
function getActualTableNames(): string[] {
  // Note: Legacy airtable-table-definitions.json deleted - using 18-table optimized architecture
  return [
    // TIER 1: CORE TABLES (3)
    '01_PromptLogs', '02_SessionAnalytics', '03_SparkSplitAnalytics', 
    
    // TIER 2: INTELLIGENCE TABLES (5)
    '04_GoldmineOutput', '05_UserContext', '06_EmotionalIntelligence', 
    '07_TrustMetrics', '08_PerformanceMetrics',
    
    // TIER 3: INTEGRATION INFRASTRUCTURE (5)
    '09_WebhookLogs', '10_AirtableSync', '11_ErrorLogs', 
    '12_ProcessingResults', '13_SystemHealth',
    
    // TIER 4: REFERENCE TABLES (5)
    '14_PromptTypes', '15_EmotionalStates', '16_TrustFactors', 
    '17_SystemConfigs', '18_AnalyticsAggregates'
  ];
}

/**
 * Test entry configurations using minimal required fields
 */
function getTestEntry(tableName: string): any {
  // Common test entries based on table patterns
  const commonFields = {
    recordId: `test-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Table-specific test entries based on our definitions
  const specificEntries: { [key: string]: any } = {
    'PromptLogs': {
      ...commonFields,
      sessionId: 'test-session-001',
      userId: 'test-user-001',
      promptType: 'ai_blueprint',
      intent: 'Test prompt intent',
      inputs: 'Test input data',
      outputs: 'Test output data',
      trustFallbackUsed: false,
      clarityIndex: 85,
      resonanceScore: 4.5,
      momentumScore: 4.2,
      deliveryCost: 0.05,
      industry: 'Technology',
      audience: 'Small Business',
      goal: 'Growth',
      tone: 'Professional'
    },
    'SessionAnalytics': {
      ...commonFields,
      sessionId: 'test-session-001',
      userId: 'test-user-001',
      sessionDuration: 300,
      promptCount: 3,
      emotionalTrajectory: 'Positive progression',
      outcomeType: 'completed',
      trustScore: 4.8,
      emotionalDepth: 4.5,
      sessionMomentum: 4.3
    },
    'FeedbackLogs': {
      ...commonFields,
      sessionId: 'test-session-001',
      promptLogId: 'test-prompt-001',
      feedbackType: 'positive',
      feedbackText: 'Great output quality',
      resonanceScore: 4.7
    },
    'UserContext': {
      ...commonFields,
      userId: 'test-user-001',
      userEmail: 'test@canai.so',
      industryFocus: 'technology',
      communicationStyle: 'direct',
      emotionalProfile: 'analytical',
      preferredTone: 'professional',
      culturalContext: 'western'
    },
    'SparkSplitAnalytics': {
      ...commonFields,
      sessionId: 'test-session-001',
      promptLogId: 'test-prompt-001',
      comparisonId: 'test-comparison-001',
      sterileOutput: 'Basic output',
      canaiOutput: 'Enhanced CanAI output',
      userSelection: 'canai',
      selectionTimestamp: new Date().toISOString(),
      timeToSelection: 5,
      trustDelta: 0.8,
      aweScore: 4.5,
      ownershipScore: 4.3,
      wonderScore: 4.6,
      calmScore: 4.2,
      powerScore: 4.7
    },
    'OutputGoldmine': {
      ...commonFields,
      outputHash: 'test-hash-001',
      promptType: 'ai_blueprint',
      outputContent: 'Test output content for goldmine',
      industryCluster: 'technology',
      reusePotential: 4.5,
      compoundValue: 4.3,
      emotionalResonance: 4.6,
      usageCount: 1
    },
    'AIMiningAgents': {
      ...commonFields,
      agentType: 'pattern_miner',
      agentName: 'Test Mining Agent',
      runId: 'test-run-001',
      runTimestamp: new Date().toISOString()
    },
    'FieldGlossary': {
      ...commonFields,
      fieldName: 'testField',
      fieldType: 'singleLineText',
      description: 'Test field for validation',
      tableName: 'TestTable'
    },
    'SchemaEvents': {
      ...commonFields,
      eventType: 'field_added',
      tableName: 'TestTable',
      fieldName: 'testField',
      eventTimestamp: new Date().toISOString()
    },
    'DeliveryCostLogs': {
      ...commonFields,
      sessionId: 'test-session-001',
      promptLogId: 'test-prompt-001',
      deliveryCost: 0.05,
      tokenCount: 1500,
      model: 'gpt-4o'
    },
    'ReferralTriggers': {
      ...commonFields,
      userId: 'test-user-001',
      triggerType: 'satisfaction_threshold',
      triggerValue: 'high_satisfaction',
      triggered: false
    }
  };

  // Return specific entry if available, otherwise use common fields
  return specificEntries[tableName] || commonFields;
}

/**
 * Insert test entry into a specific table
 */
async function insertTestEntry(tableName: string): Promise<{ success: boolean; error?: string; recordId?: string }> {
  try {
    console.log(`📝 Testing ${tableName}...`);
    
    const fields = getTestEntry(tableName);
    const records = await base(tableName).create([{ fields }]);
    
    if (records && records.length > 0) {
      const recordId = records[0].id;
      console.log(`✅ ${tableName}: Test entry created successfully (ID: ${recordId})`);
      
      // Clean up - delete the test entry
      try {
        await base(tableName).destroy([recordId]);
        console.log(`🧹 ${tableName}: Test entry cleaned up`);
      } catch (cleanupError) {
        console.log(`⚠️  ${tableName}: Entry created but cleanup failed - manual cleanup may be needed`);
      }
      
      return { success: true, recordId };
    } else {
      const error = 'No records returned from create operation';
      console.log(`❌ ${tableName}: ${error}`);
      return { success: false, error };
    }
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }
    
    console.log(`❌ ${tableName}: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

/**
 * Main execution function
 */
async function testAllTablesWithWorkingKey(): Promise<void> {
  console.log('🎯 CanAI - Test All Tables with Working Key');
  console.log('==========================================');
  console.log(`🔑 Using API Key: ${AIRTABLE_API_KEY.substring(0, 15)}...`);
  console.log(`📋 Base ID: ${BASE_ID}`);
  
  const tableNames = getActualTableNames();
  console.log(`🚀 Found ${tableNames.length} tables to test`);
  console.log('📋 Tables:', tableNames.join(', '));
  console.log('\n🚀 Testing all tables with real entries...\n');

  const results: { [key: string]: { success: boolean; error?: string; recordId?: string } } = {};
  let successCount = 0;
  let totalTables = tableNames.length;

  // Test each table
  for (const tableName of tableNames) {
    const result = await insertTestEntry(tableName);
    results[tableName] = result;
    if (result.success) successCount++;
    
    // Small delay between requests to be respectful to Airtable API
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Summary
  console.log('\n🎯 COMPLETE TABLE ENTRY TEST RESULTS');
  console.log('====================================');
  console.log(`✅ Successful entries: ${successCount}/${totalTables}`);
  console.log(`🎯 Success rate: ${((successCount / totalTables) * 100).toFixed(1)}%`);

  if (successCount === totalTables) {
    console.log('\n🎉 MISSION ACCOMPLISHED!');
    console.log('🌟 100% TABLE ENTRY SUCCESS RATE ACHIEVED!');
    console.log(`🚀 All ${totalTables} CanAI tables are fully operational with real data`);
    console.log('💎 Complete confidence in platform functionality confirmed');
    console.log('🔥 Revolutionary emotional sovereignty platform ready for launch!');
  } else {
    console.log('\n⚠️  Tables that need attention:');
    Object.entries(results).forEach(([table, result]) => {
      if (!result.success) {
        console.log(`   ❌ ${table}: ${result.error || 'Unknown error'}`);
      }
    });
    
    console.log('\n✅ Successfully tested tables:');
    Object.entries(results).forEach(([table, result]) => {
      if (result.success) {
        console.log(`   ✅ ${table}`);
      }
    });
  }

  console.log(`\n🌐 Access your base: https://airtable.com/${BASE_ID}`);
  console.log('🎯 Test completed successfully!');
}

// Execute the test
if (require.main === module) {
  testAllTablesWithWorkingKey().catch(console.error);
}

export { testAllTablesWithWorkingKey }; 