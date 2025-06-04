// 🧪 fixed-date-write-test.ts
// Fixed write test with proper date field handling

import Airtable from "airtable"

// Working API credentials
const AIRTABLE_API_KEY = "patm0p87AP12yGYUS.e9c0549cd4d70808e02d5261ef59a4e15d02e604ace8fef9483b4fae4df48ef5"
const BASE_ID = "apph8yM7gVc9QBFtx"

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// Focus on the 20 accessible tables first
const ACCESSIBLE_TABLES = [
  '01_PromptLogs', '02_SparkSplitAnalytics', '03_SessionAnalytics', '04_UserContext',
  '05_OutputGoldmine', '06_FeedbackLogs', '07_DeliveryCostLogs', '08_ReferralTriggers',
  '09_AIMiningAgents', '10_FieldGlossary', '11_SchemaEvents', '12_EmotionalCompass',
  '13_TrustMetrics', '14_PersonaCluster', '15_ContentOptimization', '16_PredictiveInsights',
  '17_CompetitiveIntel', '18_RevenueAttribution', '19_CustomerJourney', '20_BrandResonance'
]

interface FieldInfo {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'date'
  sampleValue: any
}

// Analyze existing records to understand field types
async function analyzeTableFields(tableName: string): Promise<FieldInfo[]> {
  try {
    const records = await base(tableName).select({ maxRecords: 1 }).firstPage()
    
    if (records.length === 0) {
      return []
    }
    
    const sampleRecord = records[0]
    const fields: FieldInfo[] = []
    
    Object.entries(sampleRecord.fields).forEach(([fieldName, value]) => {
      let type: 'string' | 'number' | 'boolean' | 'object' | 'date' = typeof value as any
      
      // Detect date fields by checking if the value looks like a date
      if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
        type = 'date'
      }
      
      fields.push({
        name: fieldName,
        type,
        sampleValue: value
      })
    })
    
    return fields
  } catch (error) {
    console.log(`   ⚠️  Could not analyze fields: ${(error as any).message}`)
    return []
  }
}

// Generate proper test data based on field analysis
function generateProperTestData(fields: FieldInfo[]): Record<string, any> {
  const timestamp = new Date().toISOString()
  const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const testData: Record<string, any> = {}
  
  fields.forEach(field => {
    const fieldLower = field.name.toLowerCase()
    
    // Handle date fields properly
    if (field.type === 'date' || fieldLower.includes('createdat') || fieldLower.includes('updatedat') || fieldLower.includes('timestamp')) {
      testData[field.name] = timestamp
    }
    // Handle ID fields
    else if (fieldLower.includes('id') && !fieldLower.includes('user')) {
      testData[field.name] = `test_${testId}`
    }
    // Handle user/session IDs
    else if (fieldLower.includes('userid') || fieldLower.includes('user_id')) {
      testData[field.name] = `user_${testId}`
    }
    else if (fieldLower.includes('sessionid') || fieldLower.includes('session_id')) {
      testData[field.name] = `session_${testId}`
    }
    // Handle numeric fields
    else if (field.type === 'number' || fieldLower.includes('score') || fieldLower.includes('rating')) {
      testData[field.name] = Math.round(Math.random() * 5 * 100) / 100
    }
    else if (fieldLower.includes('count') || fieldLower.includes('number')) {
      testData[field.name] = Math.floor(Math.random() * 100)
    }
    // Handle boolean fields
    else if (field.type === 'boolean' || fieldLower.includes('enabled') || fieldLower.includes('active')) {
      testData[field.name] = true
    }
    // Handle specific field types
    else if (fieldLower.includes('email')) {
      testData[field.name] = `test_${testId}@canai.so`
    }
    else if (fieldLower.includes('type') || fieldLower.includes('category')) {
      testData[field.name] = 'test_type'
    }
    else if (fieldLower.includes('name') || fieldLower.includes('title')) {
      testData[field.name] = `Test ${field.name} Entry`
    }
    else if (fieldLower.includes('content') || fieldLower.includes('description')) {
      testData[field.name] = `Test content for validation`
    }
    else if (fieldLower.includes('url') || fieldLower.includes('link')) {
      testData[field.name] = `https://canai.so/test/${testId}`
    }
    else if (fieldLower.includes('status')) {
      testData[field.name] = 'active'
    }
    // Default to string
    else {
      testData[field.name] = `test_value_${testId}`
    }
  })
  
  return testData
}

async function testSingleTable(tableName: string): Promise<boolean> {
  console.log(`\n📊 Testing: ${tableName}`)
  console.log("-".repeat(40))
  
  try {
    // Step 1: Analyze field structure
    console.log(`🔍 Analyzing field structure...`)
    const fields = await analyzeTableFields(tableName)
    
    if (fields.length === 0) {
      console.log(`   ❌ No fields found or table empty`)
      return false
    }
    
    console.log(`   ✅ Found ${fields.length} fields`)
    
    // Show field analysis
    const dateFields = fields.filter(f => f.type === 'date' || f.name.toLowerCase().includes('date') || f.name.toLowerCase().includes('time'))
    if (dateFields.length > 0) {
      console.log(`   📅 Date fields detected: ${dateFields.map(f => f.name).join(', ')}`)
    }
    
    // Step 2: Generate proper test data
    console.log(`🔨 Generating test data...`)
    const testData = generateProperTestData(fields)
    
    // Step 3: Test CREATE
    console.log(`📝 Testing CREATE operation...`)
    const createdRecord = await base(tableName).create(testData)
    console.log(`   ✅ CREATE successful - Record ID: ${createdRecord.id}`)
    
    // Step 4: Test UPDATE
    console.log(`🔄 Testing UPDATE operation...`)
    const updateData: Record<string, any> = {}
    
    // Update a safe field
    const safeField = fields.find(f => f.name.toLowerCase().includes('content') || f.name.toLowerCase().includes('description'))
    if (safeField) {
      updateData[safeField.name] = `Updated content - ${new Date().toISOString()}`
    } else if (fields.length > 0) {
      // Update the first non-date field
      const nonDateField = fields.find(f => f.type !== 'date')
      if (nonDateField) {
        updateData[nonDateField.name] = `updated_${Date.now()}`
      }
    }
    
    await base(tableName).update(createdRecord.id, updateData)
    console.log(`   ✅ UPDATE successful`)
    
    // Step 5: Test DELETE
    console.log(`🗑️  Testing DELETE operation...`)
    await base(tableName).destroy(createdRecord.id)
    console.log(`   ✅ DELETE successful`)
    
    console.log(`   🎉 FULL CRUD SUPPORT CONFIRMED!`)
    return true
    
  } catch (error: any) {
    console.log(`   ❌ Error: ${error.message}`)
    return false
  }
}

async function runFixedWriteTest(): Promise<void> {
  console.log("🧪 CanAI Fixed Date Write Test")
  console.log("🚀 Testing CRUD operations with proper date field handling")
  console.log(`🔑 API Key: ${AIRTABLE_API_KEY.substring(0, 15)}...`)
  console.log(`📋 Base ID: ${BASE_ID}`)
  console.log("=".repeat(60))
  
  const results: { tableName: string; success: boolean }[] = []
  
  for (const tableName of ACCESSIBLE_TABLES) {
    const success = await testSingleTable(tableName)
    results.push({ tableName, success })
    
    // Brief pause to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Generate final report
  console.log(`\n📊 FINAL RESULTS`)
  console.log("=".repeat(60))
  
  const successfulTables = results.filter(r => r.success)
  const failedTables = results.filter(r => !r.success)
  
  console.log(`\n🎯 SUMMARY:`)
  console.log(`   Tables Tested: ${ACCESSIBLE_TABLES.length}`)
  console.log(`   Full CRUD Success: ${successfulTables.length}`)
  console.log(`   Failed: ${failedTables.length}`)
  console.log(`   Success Rate: ${Math.round((successfulTables.length / ACCESSIBLE_TABLES.length) * 100)}%`)
  
  if (successfulTables.length > 0) {
    console.log(`\n✅ TABLES WITH FULL CRUD SUPPORT (${successfulTables.length}):`)
    successfulTables.forEach(table => {
      console.log(`   ✅ ${table.tableName}`)
    })
  }
  
  if (failedTables.length > 0) {
    console.log(`\n❌ TABLES STILL HAVING ISSUES (${failedTables.length}):`)
    failedTables.forEach(table => {
      console.log(`   ❌ ${table.tableName}`)
    })
  }
  
  // Final assessment
  if (successfulTables.length >= 15) {
    console.log(`\n🌟 EXCELLENT! ${successfulTables.length}/20 tables with full CRUD support`)
    console.log(`✅ Core emotional intelligence platform operational`)
    console.log(`✅ Ready for production data collection`)
    console.log(`✅ SparkSplit trust transparency ready`)
  } else if (successfulTables.length >= 10) {
    console.log(`\n🎉 GOOD PROGRESS! ${successfulTables.length}/20 tables operational`)
    console.log(`✅ Core functionality available`)
    console.log(`🔧 Continue optimizing remaining tables`)
  } else {
    console.log(`\n⚠️  NEEDS WORK: ${successfulTables.length}/20 tables operational`)
    console.log(`🔧 Focus on resolving field schema issues`)
  }
  
  console.log(`\n📋 NEXT STEPS:`)
  if (successfulTables.length >= 10) {
    console.log(`1. ✅ Begin using ${successfulTables.length} operational tables for data collection`)
    console.log(`2. 🔧 Create missing tables 21-36 for complete platform`)
    console.log(`3. 🚀 Implement Make.com scenario logging`)
    console.log(`4. 📊 Launch emotional intelligence analytics`)
  } else {
    console.log(`1. 🔧 Review and fix remaining field schema issues`)
    console.log(`2. 📋 Ensure all date fields are properly configured`)
    console.log(`3. 🔄 Re-run test after fixes`)
  }
}

// Run the fixed test
runFixedWriteTest().catch(console.error) 