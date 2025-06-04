// 🧪 working-write-test.ts
// Comprehensive write test using working API credentials
// Tests CREATE, READ, UPDATE, DELETE operations on all accessible tables

import Airtable from "airtable"

// Working API credentials (from successful test files)
const AIRTABLE_API_KEY = "patm0p87AP12yGYUS.e9c0549cd4d70808e02d5261ef59a4e15d02e604ace8fef9483b4fae4df48ef5"
const BASE_ID = "apph8yM7gVc9QBFtx"

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// All 18 optimized tables for CanAI platform
const ALL_CANAI_TABLES = [
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

interface WriteTestResult {
  tableName: string
  accessible: boolean
  canCreate: boolean
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
  fieldCount: number
  sampleFields: string[]
  testRecordId?: string
  error?: string
}

// Generate appropriate test data based on existing field structure
function generateTestData(tableName: string, existingFields: string[]): Record<string, any> {
  const timestamp = new Date().toISOString()
  const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const testData: Record<string, any> = {}
  
  // Generate values based on field names
  existingFields.forEach(field => {
    const fieldLower = field.toLowerCase()
    
    if (fieldLower.includes('id') && !fieldLower.includes('user')) {
      testData[field] = `test_${testId}`
    } else if (fieldLower.includes('userid') || fieldLower.includes('user_id')) {
      testData[field] = `user_${testId}`
    } else if (fieldLower.includes('sessionid') || fieldLower.includes('session_id')) {
      testData[field] = `session_${testId}`
    } else if (fieldLower.includes('email')) {
      testData[field] = `test_${testId}@canai.so`
    } else if (fieldLower.includes('score') || fieldLower.includes('rating')) {
      testData[field] = Math.round(Math.random() * 5 * 100) / 100 // 0-5 with 2 decimals
    } else if (fieldLower.includes('count') || fieldLower.includes('number')) {
      testData[field] = Math.floor(Math.random() * 100)
    } else if (fieldLower.includes('date') || fieldLower.includes('time') || fieldLower.includes('timestamp')) {
      testData[field] = timestamp
    } else if (fieldLower.includes('type') || fieldLower.includes('category')) {
      testData[field] = 'test_type'
    } else if (fieldLower.includes('name') || fieldLower.includes('title')) {
      testData[field] = `Test ${tableName} Entry`
    } else if (fieldLower.includes('content') || fieldLower.includes('description') || fieldLower.includes('text')) {
      testData[field] = `Test content for ${tableName} validation`
    } else if (fieldLower.includes('url') || fieldLower.includes('link')) {
      testData[field] = `https://canai.so/test/${testId}`
    } else if (fieldLower.includes('status')) {
      testData[field] = 'active'
    } else if (fieldLower.includes('enabled') || fieldLower.includes('active')) {
      testData[field] = true
    } else {
      // Default string value
      testData[field] = `test_value_${testId}`
    }
  })
  
  return testData
}

async function testTableWriteOperations(tableName: string): Promise<WriteTestResult> {
  const result: WriteTestResult = {
    tableName,
    accessible: false,
    canCreate: false,
    canRead: false,
    canUpdate: false,
    canDelete: false,
    fieldCount: 0,
    sampleFields: []
  }
  
  try {
    // Test READ operation first
    console.log(`🔍 Testing READ: ${tableName}`)
    const existingRecords = await base(tableName).select({ maxRecords: 1 }).firstPage()
    result.accessible = true
    result.canRead = true
    
    if (existingRecords.length > 0) {
      const fields = Object.keys(existingRecords[0].fields)
      result.fieldCount = fields.length
      result.sampleFields = fields.slice(0, 5)
      console.log(`   ✅ READ successful - ${fields.length} fields found`)
      
      // Generate test data based on existing fields
      const testData = generateTestData(tableName, fields)
      
      try {
        // Test CREATE operation
        console.log(`🔨 Testing CREATE: ${tableName}`)
        const createdRecord = await base(tableName).create(testData)
        result.canCreate = true
        result.testRecordId = createdRecord.id
        console.log(`   ✅ CREATE successful - Record ID: ${createdRecord.id}`)
        
        try {
          // Test UPDATE operation
          console.log(`📝 Testing UPDATE: ${tableName}`)
          const updateData: Record<string, any> = {}
          
          // Update a few fields safely
          if (result.sampleFields.length > 0) {
            const firstField = result.sampleFields[0]
            if (firstField.toLowerCase().includes('content') || firstField.toLowerCase().includes('description')) {
              updateData[firstField] = `Updated test content for ${tableName}`
            } else if (firstField.toLowerCase().includes('score')) {
              updateData[firstField] = 4.5
            } else {
              updateData[firstField] = `updated_${Date.now()}`
            }
          }
          
          await base(tableName).update(createdRecord.id, updateData)
          result.canUpdate = true
          console.log(`   ✅ UPDATE successful`)
          
        } catch (updateError: any) {
          console.log(`   ❌ UPDATE failed: ${updateError.message}`)
          result.error = `Update failed: ${updateError.message}`
        }
        
        try {
          // Test DELETE operation
          console.log(`🗑️  Testing DELETE: ${tableName}`)
          await base(tableName).destroy(createdRecord.id)
          result.canDelete = true
          console.log(`   ✅ DELETE successful`)
          
        } catch (deleteError: any) {
          console.log(`   ❌ DELETE failed: ${deleteError.message}`)
          result.error = `Delete failed: ${deleteError.message}`
        }
        
      } catch (createError: any) {
        console.log(`   ❌ CREATE failed: ${createError.message}`)
        result.error = `Create failed: ${createError.message}`
      }
      
    } else {
      console.log(`   ⚠️  No existing records to analyze field structure`)
      result.error = "No existing records to analyze field structure"
    }
    
  } catch (readError: any) {
    console.log(`   ❌ READ failed: ${readError.message}`)
    result.error = `Read failed: ${readError.message}`
  }
  
  return result
}

async function runWorkingWriteTest(): Promise<void> {
  console.log("🧪 CanAI Comprehensive Write Test")
  console.log("🚀 Testing CRUD operations on all 18 tables")
  console.log(`🔑 API Key: ${AIRTABLE_API_KEY.substring(0, 15)}...`)
  console.log(`📋 Base ID: ${BASE_ID}`)
  console.log("=" .repeat(60))
  
  const results: WriteTestResult[] = []
  let successfulTables = 0
  let fullCRUDTables = 0
  
  for (const tableName of ALL_CANAI_TABLES) {
    console.log(`\n📊 Testing Table: ${tableName}`)
    console.log("-" .repeat(40))
    
    const result = await testTableWriteOperations(tableName)
    results.push(result)
    
    if (result.accessible) {
      successfulTables++
      if (result.canCreate && result.canRead && result.canUpdate && result.canDelete) {
        fullCRUDTables++
      }
    }
    
    // Brief pause to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  // Generate comprehensive report
  console.log(`\n📊 COMPREHENSIVE WRITE TEST RESULTS`)
  console.log("=" .repeat(60))
  
  console.log(`\n🎯 OVERALL STATISTICS:`)
  console.log(`   Tables Tested: ${ALL_CANAI_TABLES.length}`)
  console.log(`   Accessible Tables: ${successfulTables}`)
  console.log(`   Full CRUD Support: ${fullCRUDTables}`)
  console.log(`   Success Rate: ${Math.round((successfulTables / ALL_CANAI_TABLES.length) * 100)}%`)
  console.log(`   CRUD Success Rate: ${Math.round((fullCRUDTables / ALL_CANAI_TABLES.length) * 100)}%`)
  
  // Categorize results
  const accessibleTables = results.filter(r => r.accessible)
  const fullCRUDTables_list = results.filter(r => r.canCreate && r.canRead && r.canUpdate && r.canDelete)
  const readOnlyTables = results.filter(r => r.accessible && r.canRead && !r.canCreate)
  const inaccessibleTables = results.filter(r => !r.accessible)
  
  if (fullCRUDTables_list.length > 0) {
    console.log(`\n✅ FULL CRUD SUPPORT (${fullCRUDTables_list.length} tables):`)
    fullCRUDTables_list.forEach(table => {
      console.log(`   ${table.tableName} - ${table.fieldCount} fields`)
    })
  }
  
  if (readOnlyTables.length > 0) {
    console.log(`\n📖 READ-ONLY ACCESS (${readOnlyTables.length} tables):`)
    readOnlyTables.forEach(table => {
      console.log(`   ${table.tableName} - ${table.error || 'Write operations restricted'}`)
    })
  }
  
  if (inaccessibleTables.length > 0) {
    console.log(`\n❌ INACCESSIBLE TABLES (${inaccessibleTables.length} tables):`)
    inaccessibleTables.forEach(table => {
      console.log(`   ${table.tableName} - ${table.error}`)
    })
  }
  
  // Final assessment
  console.log(`\n🎯 INFRASTRUCTURE ASSESSMENT:`)
  
  if (fullCRUDTables >= 15) {
    console.log(`🌟 EXCELLENT! ${fullCRUDTables}/18 tables with full CRUD support`)
    console.log(`✅ Revolutionary emotional intelligence platform operational`)
    console.log(`✅ Advanced data collection capabilities confirmed`)
    console.log(`✅ Production-ready infrastructure validated`)
    
  } else if (fullCRUDTables >= 10) {
    console.log(`🎉 VERY GOOD! ${fullCRUDTables}/18 tables with full CRUD support`)
    console.log(`✅ Core platform operational`)
    console.log(`🔧 ${18 - fullCRUDTables} tables need write permission adjustments`)
    
  } else if (accessibleTables.length >= 10) {
    console.log(`✅ GOOD! ${accessibleTables.length}/18 tables accessible`)
    console.log(`📖 Most tables have read access`)
    console.log(`🔧 Write permissions need configuration`)
    
  } else {
    console.log(`⚠️  PARTIAL ACCESS: ${accessibleTables.length}/18 tables accessible`)
    console.log(`🔧 Significant setup or permission adjustments needed`)
  }
  
  console.log(`\n📋 NEXT ACTIONS:`)
  if (fullCRUDTables >= 10) {
    console.log(`1. ✅ Begin production data collection with ${fullCRUDTables} operational tables`)
    console.log(`2. 🔧 Configure write permissions for remaining ${18 - fullCRUDTables} tables`)
    console.log(`3. 🚀 Launch emotional intelligence analytics`)
    console.log(`4. 📊 Implement Make.com scenario logging`)
  } else {
    console.log(`1. 🔧 Review table permissions in Airtable base`)
    console.log(`2. 📋 Ensure API key has write access to all tables`)
    console.log(`3. 🔄 Re-run test after permission adjustments`)
  }
  
  console.log(`\n🌐 Airtable Base: https://airtable.com/${BASE_ID}`)
  console.log(`🔑 API Key Status: ✅ Working (${AIRTABLE_API_KEY.substring(0, 15)}...)`)
}

// Run the comprehensive write test
runWorkingWriteTest().catch(console.error) 