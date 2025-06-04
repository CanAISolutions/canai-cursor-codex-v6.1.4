// 🔧 comprehensive-crud-test.ts
// Comprehensive CRUD operations test for all 18 CanAI tables
// Tests: Create, Read, Update, Delete with rollback capabilities

import Airtable from "airtable"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

const BASE_ID = "apph8yM7gVc9QBFtx"
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN

console.log("🔧 CanAI CRUD Operations Test")
console.log("=============================")
console.log(`Base ID: ${BASE_ID}`)
console.log(`API Key: ${AIRTABLE_API_KEY ? "✅ Set" : "❌ Missing"}`)

if (!AIRTABLE_API_KEY) {
  console.error("❌ Missing AIRTABLE_API_KEY environment variable")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// All 18 CanAI tables
const ALL_CANAI_TABLES = [
  // 18-Table Optimized Architecture
  '01_PromptLogs', '02_SessionAnalytics', '03_SparkSplitAnalytics', '04_GoldmineOutput', '05_UserContext',
  '06_EmotionalIntelligence', '07_TrustMetrics', '08_PerformanceMetrics', '09_WebhookLogs', '10_AirtableSync',
  '11_ErrorLogs', '12_ProcessingResults', '13_SystemHealth', '14_PromptTypes', '15_EmotionalStates',
  '16_TrustFactors', '17_SystemConfigs', '18_AnalyticsAggregates'
]

// Test data templates for different table types
const getTestData = (tableName: string) => {
  const timestamp = new Date().toISOString()
  const testId = `test_${Date.now()}`
  
  // Core fields that most tables should have
  const baseFields = {
    recordId: testId,
    createdAt: timestamp,
    updatedAt: timestamp
  }

  // Specific test data based on table type
  switch (tableName) {
    case '01_PromptLogs':
      return {
        ...baseFields,
        sessionId: `session_${testId}`,
        userId: `user_${testId}`,
        promptType: 'test_prompt',
        promptText: 'CRUD test prompt',
        responseText: 'CRUD test response',
        tokenCount: 100,
        processingTime: 1.5,
        emotionalTone: 'neutral'
      }
    
    case '02_SparkSplitAnalytics':
      return {
        ...baseFields,
        sessionId: `session_${testId}`,
        promptLogId: `prompt_${testId}`,
        trustScore: 0.85,
        transparencyLevel: 'high',
        emotionalResonance: 0.75,
        userSatisfaction: 0.90
      }
    
    case '03_SessionAnalytics':
      return {
        ...baseFields,
        sessionId: `session_${testId}`,
        userId: `user_${testId}`,
        sessionDuration: 300,
        promptCount: 5,
        emotionalJourney: 'positive_progression'
      }
    
    default:
      // Generic test data for other tables
      return {
        ...baseFields,
        testField: `CRUD_test_${tableName}`,
        testValue: Math.random(),
        testStatus: 'active'
      }
  }
}

interface CrudTestResult {
  tableName: string
  createSuccess: boolean
  readSuccess: boolean
  updateSuccess: boolean
  deleteSuccess: boolean
  recordId?: string
  error?: string
}

async function testTableCrud(tableName: string): Promise<CrudTestResult> {
  const result: CrudTestResult = {
    tableName,
    createSuccess: false,
    readSuccess: false,
    updateSuccess: false,
    deleteSuccess: false
  }

  try {
    console.log(`\n🔍 Testing CRUD operations for: ${tableName}`)
    
    // 1. CREATE - Insert test record
    console.log(`   📝 CREATE: Inserting test record...`)
    const testData = getTestData(tableName)
    const createResponse = await base(tableName).create([{ fields: testData }])
    
    if (createResponse && createResponse.length > 0) {
      result.createSuccess = true
      result.recordId = createResponse[0].id
      console.log(`   ✅ CREATE: Success - Record ID: ${result.recordId}`)
    }

    // 2. READ - Retrieve the created record
    console.log(`   📖 READ: Retrieving created record...`)
    if (result.recordId) {
      const readResponse = await base(tableName).find(result.recordId)
      if (readResponse && readResponse.id === result.recordId) {
        result.readSuccess = true
        console.log(`   ✅ READ: Success - Found record with ${Object.keys(readResponse.fields).length} fields`)
      }
    }

    // 3. UPDATE - Modify the record
    console.log(`   ✏️  UPDATE: Modifying record...`)
    if (result.recordId) {
      const updateData = {
        updatedAt: new Date().toISOString(),
        testStatus: 'updated_by_crud_test'
      }
      const updateResponse = await base(tableName).update([{
        id: result.recordId,
        fields: updateData
      }])
      
      if (updateResponse && updateResponse.length > 0) {
        result.updateSuccess = true
        console.log(`   ✅ UPDATE: Success - Record modified`)
      }
    }

    // 4. DELETE - Remove the test record (cleanup)
    console.log(`   🗑️  DELETE: Cleaning up test record...`)
    if (result.recordId) {
      const deleteResponse = await base(tableName).destroy([result.recordId])
      if (deleteResponse && deleteResponse.length > 0) {
        result.deleteSuccess = true
        console.log(`   ✅ DELETE: Success - Test record cleaned up`)
      }
    }

  } catch (error: any) {
    result.error = error.message
    console.log(`   ❌ ERROR: ${error.message}`)
    
    // Attempt cleanup if we created a record but failed later
    if (result.recordId && !result.deleteSuccess) {
      try {
        await base(tableName).destroy([result.recordId])
        console.log(`   🧹 CLEANUP: Test record removed after error`)
      } catch (cleanupError) {
        console.log(`   ⚠️  CLEANUP FAILED: ${cleanupError}`)
      }
    }
  }

  return result
}

async function runComprehensiveCrudTest() {
  console.log(`\n🚀 Starting comprehensive CRUD test for ${ALL_CANAI_TABLES.length} tables...`)
  
  const results: CrudTestResult[] = []
  let successfulTables = 0
  let failedTables = 0

  for (const tableName of ALL_CANAI_TABLES) {
    const result = await testTableCrud(tableName)
    results.push(result)
    
    const allOperationsSuccessful = result.createSuccess && result.readSuccess && 
                                   result.updateSuccess && result.deleteSuccess
    
    if (allOperationsSuccessful) {
      successfulTables++
    } else {
      failedTables++
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Generate comprehensive report
  console.log(`\n📊 COMPREHENSIVE CRUD TEST RESULTS`)
  console.log(`=====================================`)
  console.log(`✅ Successful tables: ${successfulTables}/${ALL_CANAI_TABLES.length}`)
  console.log(`❌ Failed tables: ${failedTables}/${ALL_CANAI_TABLES.length}`)
  
  if (successfulTables > 0) {
    console.log(`\n✅ TABLES WITH FULL CRUD SUCCESS:`)
    results.filter(r => r.createSuccess && r.readSuccess && r.updateSuccess && r.deleteSuccess)
           .forEach(r => console.log(`   - ${r.tableName}: All operations successful`))
  }
  
  if (failedTables > 0) {
    console.log(`\n❌ TABLES WITH CRUD ISSUES:`)
    results.filter(r => !(r.createSuccess && r.readSuccess && r.updateSuccess && r.deleteSuccess))
           .forEach(r => {
             console.log(`   - ${r.tableName}:`)
             console.log(`     CREATE: ${r.createSuccess ? '✅' : '❌'}`)
             console.log(`     READ: ${r.readSuccess ? '✅' : '❌'}`)
             console.log(`     UPDATE: ${r.updateSuccess ? '✅' : '❌'}`)
             console.log(`     DELETE: ${r.deleteSuccess ? '✅' : '❌'}`)
             if (r.error) console.log(`     ERROR: ${r.error}`)
           })
  }

  // Success assessment
  const successRate = (successfulTables / ALL_CANAI_TABLES.length) * 100
  
  if (successRate === 100) {
    console.log(`\n🌟 PERFECT! ALL 18 TABLES HAVE FULL CRUD CAPABILITIES!`)
    console.log(`🚀 Complete CanAI platform ready for production data operations!`)
    console.log(`✅ SparkSplit trust engine ready for live data collection`)
    console.log(`✅ Emotional intelligence tracking ready for user interactions`)
    console.log(`✅ Revenue attribution system ready for business analytics`)
  } else if (successRate >= 90) {
    console.log(`\n🎉 EXCELLENT! ${successRate.toFixed(1)}% of tables have full CRUD capabilities!`)
    console.log(`✅ Core infrastructure operational for production use`)
  } else if (successRate >= 75) {
    console.log(`\n⚠️  GOOD: ${successRate.toFixed(1)}% of tables operational`)
    console.log(`💡 Some tables may need field structure adjustments`)
  } else {
    console.log(`\n❌ ATTENTION NEEDED: Only ${successRate.toFixed(1)}% of tables fully operational`)
    console.log(`🔧 Field structure review and adjustment required`)
  }

  return results
}

// Run the comprehensive test
runComprehensiveCrudTest().catch(console.error) 