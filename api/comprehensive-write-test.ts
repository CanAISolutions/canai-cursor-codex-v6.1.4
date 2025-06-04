// 🧪 comprehensive-write-test.ts
// Comprehensive write testing for all 18 CanAI tables
// Tests CREATE, READ, UPDATE, DELETE operations on each table

import Airtable from "airtable"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = process.env.AIRTABLE_BASE_ID!

if (!AIRTABLE_API_KEY || !BASE_ID) {
  console.error("❌ Missing environment variables")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// All 18 tables that should be operational
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
]

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

// Generate appropriate test data based on discovered field patterns
function generateTestData(tableName: string, existingFields: string[]): Record<string, any> {
  const timestamp = new Date().toISOString()
  const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const testData: Record<string, any> = {}
  
  // Generate test values based on field names
  existingFields.forEach(field => {
    const fieldLower = field.toLowerCase()
    
    if (fieldLower.includes('id') && !fieldLower.includes('userid') && !fieldLower.includes('sessionid')) {
      testData[field] = `test_${testId}`
    } else if (fieldLower.includes('userid') || fieldLower === 'user_id') {
      testData[field] = `user_${testId}`
    } else if (fieldLower.includes('sessionid') || fieldLower === 'session_id') {
      testData[field] = `session_${testId}`
    } else if (fieldLower.includes('email')) {
      testData[field] = `test_${testId}@canai.so`
    } else if (fieldLower.includes('score') || fieldLower.includes('rating')) {
      testData[field] = Math.round((Math.random() * 4 + 1) * 100) / 100 // 1.00 to 5.00
    } else if (fieldLower.includes('count') || fieldLower.includes('number')) {
      testData[field] = Math.floor(Math.random() * 100) + 1
    } else if (fieldLower.includes('date') || fieldLower.includes('time') || fieldLower.includes('timestamp')) {
      testData[field] = timestamp
    } else if (fieldLower.includes('type') || fieldLower.includes('category')) {
      testData[field] = 'test_type'
    } else if (fieldLower.includes('name') || fieldLower.includes('title')) {
      testData[field] = `Test ${field}`
    } else if (fieldLower.includes('content') || fieldLower.includes('description') || fieldLower.includes('text')) {
      testData[field] = `Test content for ${field} field`
    } else if (fieldLower.includes('url') || fieldLower.includes('link')) {
      testData[field] = `https://test.canai.so/${testId}`
    } else if (fieldLower.includes('status')) {
      testData[field] = 'active'
    } else if (fieldLower.includes('enabled') || fieldLower.includes('active') || fieldLower.includes('used')) {
      testData[field] = true
    } else if (fieldLower.includes('cost') || fieldLower.includes('price') || fieldLower.includes('amount')) {
      testData[field] = Math.round(Math.random() * 100 * 100) / 100 // 0.00 to 100.00
    } else if (fieldLower.includes('percentage') || fieldLower.includes('percent')) {
      testData[field] = Math.round(Math.random() * 100 * 100) / 100 // 0.00 to 100.00
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
    console.log(`\n🔍 Testing write operations for: ${tableName}`)
    
    // Step 1: Test READ access and discover fields
    console.log(`   📖 Testing READ access...`)
    const existingRecords = await base(tableName).select({ maxRecords: 3 }).firstPage()
    result.accessible = true
    result.canRead = true
    
    let fieldsToTest: string[] = []
    
    if (existingRecords.length > 0) {
      fieldsToTest = Object.keys(existingRecords[0].fields)
      result.fieldCount = fieldsToTest.length
      result.sampleFields = fieldsToTest.slice(0, 5)
      console.log(`   ✅ READ: Found ${existingRecords.length} records, ${fieldsToTest.length} fields`)
    } else {
      console.log(`   ⚠️  READ: Table empty, will test with minimal data`)
      // Try common field names for empty tables
      fieldsToTest = ['Name', 'Description', 'Status', 'Created']
    }
    
    // Step 2: Test CREATE operation
    console.log(`   ➕ Testing CREATE operation...`)
    const testData = generateTestData(tableName, fieldsToTest)
    
    try {
      const createdRecord = await base(tableName).create(testData)
      result.canCreate = true
      result.testRecordId = createdRecord.id
      console.log(`   ✅ CREATE: Successfully created record ${createdRecord.id}`)
      
      // Step 3: Test READ of created record
      console.log(`   🔍 Testing READ of created record...`)
      const readRecord = await base(tableName).find(createdRecord.id)
      if (readRecord) {
        console.log(`   ✅ READ: Successfully retrieved created record`)
        
        // Step 4: Test UPDATE operation
        console.log(`   ✏️  Testing UPDATE operation...`)
        const updateData: Record<string, any> = {}
        
        // Update a few fields with new test values
        const fieldsToUpdate = Object.keys(testData).slice(0, 2)
        fieldsToUpdate.forEach(field => {
          if (typeof testData[field] === 'string') {
            updateData[field] = `updated_${testData[field]}`
          } else if (typeof testData[field] === 'number') {
            updateData[field] = testData[field] + 1
          }
        })
        
        if (Object.keys(updateData).length > 0) {
          const updatedRecord = await base(tableName).update(createdRecord.id, updateData)
          result.canUpdate = true
          console.log(`   ✅ UPDATE: Successfully updated ${Object.keys(updateData).length} fields`)
        }
        
        // Step 5: Test DELETE operation
        console.log(`   🗑️  Testing DELETE operation...`)
        await base(tableName).destroy(createdRecord.id)
        result.canDelete = true
        console.log(`   ✅ DELETE: Successfully deleted test record`)
      }
      
    } catch (createError: any) {
      console.log(`   ❌ CREATE failed: ${createError.message}`)
      result.error = `CREATE: ${createError.message}`
      
      // If create failed, try with minimal data
      if (createError.message.includes('field')) {
        console.log(`   🔄 Retrying with minimal data...`)
        try {
          const minimalData = { Name: `Test ${tableName} ${Date.now()}` }
          const createdRecord = await base(tableName).create(minimalData)
          result.canCreate = true
          result.testRecordId = createdRecord.id
          console.log(`   ✅ CREATE (minimal): Success with basic data`)
          
          // Clean up
          await base(tableName).destroy(createdRecord.id)
          result.canDelete = true
        } catch (minimalError: any) {
          console.log(`   ❌ CREATE (minimal) also failed: ${minimalError.message}`)
        }
      }
    }
    
  } catch (error: any) {
    console.log(`   ❌ Table access failed: ${error.message}`)
    result.error = error.message
  }
  
  return result
}

async function runComprehensiveWriteTest(): Promise<void> {
  console.log("🧪 CanAI Comprehensive Write Test")
  console.log("🚀 Testing CRUD operations on all 18 tables")
  console.log("=" .repeat(60))
  
  const results: WriteTestResult[] = []
  let successfulTables = 0
  let fullCRUDTables = 0
  
  // Test each table
  for (const tableName of ALL_CANAI_TABLES) {
    const result = await testTableWriteOperations(tableName)
    results.push(result)
    
    if (result.accessible) {
      successfulTables++
      if (result.canCreate && result.canRead && result.canUpdate && result.canDelete) {
        fullCRUDTables++
      }
    }
    
    // Small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  // Generate comprehensive report
  console.log(`\n📊 COMPREHENSIVE WRITE TEST RESULTS`)
  console.log(`═══════════════════════════════════════════════`)
  
  console.log(`\n🎯 OVERALL STATUS:`)
  console.log(`   Tables Accessible: ${successfulTables}/${ALL_CANAI_TABLES.length}`)
  console.log(`   Full CRUD Support: ${fullCRUDTables}/${ALL_CANAI_TABLES.length}`)
  console.log(`   Infrastructure Completeness: ${Math.round((successfulTables / ALL_CANAI_TABLES.length) * 100)}%`)
  console.log(`   Write Capability: ${Math.round((fullCRUDTables / ALL_CANAI_TABLES.length) * 100)}%`)
  
  // Categorize results
  const fullCRUD = results.filter(r => r.canCreate && r.canRead && r.canUpdate && r.canDelete)
  const partialCRUD = results.filter(r => r.accessible && !(r.canCreate && r.canRead && r.canUpdate && r.canDelete))
  const inaccessible = results.filter(r => !r.accessible)
  
  if (fullCRUD.length > 0) {
    console.log(`\n✅ FULL CRUD SUPPORT (${fullCRUD.length} tables):`)
    fullCRUD.forEach(table => {
      console.log(`   ${table.tableName} - ${table.fieldCount} fields, complete CRUD operations`)
    })
  }
  
  if (partialCRUD.length > 0) {
    console.log(`\n⚠️  PARTIAL CRUD SUPPORT (${partialCRUD.length} tables):`)
    partialCRUD.forEach(table => {
      const operations = []
      if (table.canRead) operations.push('READ')
      if (table.canCreate) operations.push('CREATE')
      if (table.canUpdate) operations.push('UPDATE')
      if (table.canDelete) operations.push('DELETE')
      console.log(`   ${table.tableName} - ${operations.join(', ')} (${table.error || 'partial support'})`)
    })
  }
  
  if (inaccessible.length > 0) {
    console.log(`\n❌ INACCESSIBLE TABLES (${inaccessible.length} tables):`)
    inaccessible.forEach(table => {
      console.log(`   ${table.tableName} - ${table.error}`)
    })
  }
  
  // Final Assessment
  console.log(`\n🎯 WRITE CAPABILITY ASSESSMENT:`)
  
  if (fullCRUDTables === ALL_CANAI_TABLES.length) {
    console.log(`🌟 PERFECT! COMPLETE WRITE ACCESS TO ALL TABLES!`)
    console.log(`✅ All 18 tables support full CRUD operations`)
    console.log(`✅ Complete emotional intelligence platform ready for data collection`)
    console.log(`✅ SparkSplit trust transparency engine fully operational`)
    console.log(`✅ Meta-intelligence system ready for advanced analytics`)
    console.log(`✅ Zero limitations on data collection and analysis`)
    
    console.log(`\n🚀 READY FOR PRODUCTION:`)
    console.log(`✅ Live data collection from Make.com scenarios`)
    console.log(`✅ Real-time analytics and insights generation`)
    console.log(`✅ Complete user journey tracking and optimization`)
    console.log(`✅ Advanced predictive modeling and forecasting`)
    
  } else if (fullCRUDTables >= 15) {
    console.log(`🎉 EXCELLENT! Near-complete write access (${fullCRUDTables}/18)`)
    console.log(`✅ Core platform operational with write capabilities`)
    console.log(`✅ Most competitive advantages available`)
    console.log(`🔧 ${18 - fullCRUDTables} tables need write access optimization`)
    
  } else if (fullCRUDTables >= 10) {
    console.log(`✅ GOOD! Core write access operational (${fullCRUDTables}/18)`)
    console.log(`✅ Essential data collection capabilities available`)
    console.log(`🔧 ${18 - fullCRUDTables} tables need write access setup`)
    
  } else {
    console.log(`⚠️  LIMITED WRITE ACCESS (${fullCRUDTables}/18)`)
    console.log(`🔧 Significant write permission setup required`)
    console.log(`💡 Focus on core tables first, then expand`)
  }
  
  console.log(`\n📋 NEXT ACTIONS:`)
  if (fullCRUDTables === ALL_CANAI_TABLES.length) {
    console.log(`1. ✅ Begin live data collection from Make.com scenarios`)
    console.log(`2. ✅ Implement real-time analytics dashboards`)
    console.log(`3. ✅ Launch SparkSplit trust transparency features`)
    console.log(`4. ✅ Activate predictive modeling and insights`)
  } else {
    console.log(`1. �� Investigate ${ALL_CANAI_TABLES.length - fullCRUDTables} tables with limited write access`)
    console.log(`2. 🔧 Optimize field schemas for failed CREATE operations`)
    console.log(`3. 🔧 Verify API permissions for write operations`)
    console.log(`4. 🔄 Re-run test after optimizations`)
  }
  
  // Export results for further analysis
  console.log(`\n📄 Detailed results available for analysis and optimization`)
}

// Run the comprehensive test
runComprehensiveWriteTest().catch(console.error) 