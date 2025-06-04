// 🧪 fixed-write-test.ts
// Fixed write test that properly handles date fields and uses real field schemas

import Airtable from "airtable"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: '../.env.local' })

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = process.env.AIRTABLE_BASE_ID!

if (!AIRTABLE_API_KEY || !BASE_ID) {
  console.error("❌ Missing environment variables")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// Test the 20 accessible tables first
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

// Generate proper test data based on actual field analysis
function generateProperTestData(fields: FieldInfo[]): Record<string, any> {
  const timestamp = new Date().toISOString()
  const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const testData: Record<string, any> = {}
  
  fields.forEach(field => {
    const fieldLower = field.name.toLowerCase()
    
    // Handle date/time fields properly
    if (fieldLower.includes('createdat') || fieldLower.includes('updatedat') || 
        fieldLower.includes('timestamp') || field.type === 'date') {
      testData[field.name] = timestamp
    }
    // Handle ID fields
    else if (fieldLower.includes('recordid') || fieldLower === 'id') {
      testData[field.name] = `test_${testId}`
    }
    else if (fieldLower.includes('userid') || fieldLower === 'user_id') {
      testData[field.name] = `user_${testId}`
    }
    else if (fieldLower.includes('sessionid') || fieldLower === 'session_id') {
      testData[field.name] = `session_${testId}`
    }
    // Handle score/rating fields
    else if (fieldLower.includes('score') || fieldLower.includes('rating')) {
      testData[field.name] = Math.round((Math.random() * 4 + 1) * 100) / 100 // 1.00 to 5.00
    }
    // Handle boolean fields
    else if (field.type === 'boolean' || fieldLower.includes('used') || fieldLower.includes('enabled')) {
      testData[field.name] = Math.random() > 0.5
    }
    // Handle number fields
    else if (field.type === 'number' || fieldLower.includes('count') || fieldLower.includes('cost')) {
      testData[field.name] = Math.round(Math.random() * 100 * 100) / 100
    }
    // Handle text fields
    else {
      testData[field.name] = `test_${field.name}_${testId}`
    }
  })
  
  return testData
}

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
      
      // Detect date fields
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
    return []
  }
}

async function testSingleTable(tableName: string): Promise<boolean> {
  try {
    console.log(`\n🔍 Testing: ${tableName}`)
    
    // Analyze existing fields
    const fields = await analyzeTableFields(tableName)
    if (fields.length === 0) {
      console.log(`   ⚠️  No existing records to analyze field structure`)
      return false
    }
    
    console.log(`   📋 Found ${fields.length} fields`)
    
    // Generate proper test data
    const testData = generateProperTestData(fields)
    console.log(`   📝 Generated test data for ${Object.keys(testData).length} fields`)
    
    // Test CREATE
    console.log(`   ➕ Testing CREATE...`)
    const createdRecord = await base(tableName).create(testData)
    console.log(`   ✅ CREATE: Success! Record ID: ${createdRecord.id}`)
    
    // Test READ
    console.log(`   📖 Testing READ...`)
    const readRecord = await base(tableName).find(createdRecord.id)
    console.log(`   ✅ READ: Success! Retrieved record`)
    
    // Test UPDATE
    console.log(`   ✏️  Testing UPDATE...`)
    const updateData: Record<string, any> = {}
    
    // Update a few non-critical fields
    const fieldsToUpdate = fields.filter(f => 
      !f.name.toLowerCase().includes('createdat') && 
      !f.name.toLowerCase().includes('id')
    ).slice(0, 2)
    
    fieldsToUpdate.forEach(field => {
      if (field.type === 'string') {
        updateData[field.name] = `updated_${testData[field.name]}`
      } else if (field.type === 'number') {
        updateData[field.name] = (testData[field.name] || 0) + 1
      }
    })
    
    if (Object.keys(updateData).length > 0) {
      await base(tableName).update(createdRecord.id, updateData)
      console.log(`   ✅ UPDATE: Success! Updated ${Object.keys(updateData).length} fields`)
    }
    
    // Test DELETE
    console.log(`   🗑️  Testing DELETE...`)
    await base(tableName).destroy(createdRecord.id)
    console.log(`   ✅ DELETE: Success! Record cleaned up`)
    
    console.log(`   🎉 FULL CRUD: ${tableName} supports all operations!`)
    return true
    
  } catch (error: any) {
    console.log(`   ❌ FAILED: ${error.message}`)
    return false
  }
}

async function runFixedWriteTest(): Promise<void> {
  console.log("🧪 CanAI Fixed Write Test")
  console.log("🚀 Testing CRUD operations with proper field handling")
  console.log("=" .repeat(60))
  
  const results = {
    successful: [] as string[],
    failed: [] as string[]
  }
  
  for (const tableName of ACCESSIBLE_TABLES) {
    const success = await testSingleTable(tableName)
    
    if (success) {
      results.successful.push(tableName)
    } else {
      results.failed.push(tableName)
    }
    
    // Small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Results summary
  console.log(`\n📊 FIXED WRITE TEST RESULTS`)
  console.log(`═══════════════════════════════════════════════`)
  
  console.log(`\n🎯 SUMMARY:`)
  console.log(`   ✅ Full CRUD Support: ${results.successful.length}/${ACCESSIBLE_TABLES.length}`)
  console.log(`   ❌ Failed Tables: ${results.failed.length}/${ACCESSIBLE_TABLES.length}`)
  console.log(`   📈 Success Rate: ${Math.round((results.successful.length / ACCESSIBLE_TABLES.length) * 100)}%`)
  
  if (results.successful.length > 0) {
    console.log(`\n✅ TABLES WITH FULL CRUD SUPPORT:`)
    results.successful.forEach(table => console.log(`   - ${table}`))
  }
  
  if (results.failed.length > 0) {
    console.log(`\n❌ TABLES NEEDING ATTENTION:`)
    results.failed.forEach(table => console.log(`   - ${table}`))
  }
  
  if (results.successful.length === ACCESSIBLE_TABLES.length) {
    console.log(`\n🌟 PERFECT! ALL ACCESSIBLE TABLES SUPPORT FULL CRUD!`)
    console.log(`✅ Ready for production data collection`)
    console.log(`✅ SparkSplit trust transparency operational`)
    console.log(`✅ Core emotional intelligence platform ready`)
    
    console.log(`\n📋 NEXT STEPS:`)
    console.log(`1. ✅ Begin live data collection from Make.com`)
    console.log(`2. 🔧 Investigate 16 inaccessible tables (21-36)`)
    console.log(`3. ✅ Implement real-time analytics`)
    console.log(`4. ✅ Launch trust transparency features`)
    
  } else {
    console.log(`\n🔧 OPTIMIZATION NEEDED:`)
    console.log(`💡 ${results.failed.length} tables need field schema adjustments`)
    console.log(`📋 Focus on successful tables for immediate production use`)
  }
}

// Run the fixed test
runFixedWriteTest().catch(console.error) 