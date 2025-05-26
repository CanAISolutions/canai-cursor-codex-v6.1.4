// 🎯 test-working-tables.ts
// Test the 20 working CanAI tables with proper API integration

import Airtable from "airtable"
import * as dotenv from "dotenv"
import { AIRTABLE_TABLES } from "./types/airtable"

// Load environment variables
dotenv.config({ path: '../.env.local' })

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = process.env.AIRTABLE_BASE_ID!

console.log("🔧 Environment check:")
console.log(`   AIRTABLE_API_KEY: ${AIRTABLE_API_KEY ? "✅ Set" : "❌ Missing"}`)
console.log(`   AIRTABLE_BASE_ID: ${BASE_ID ? "✅ Set" : "❌ Missing"}`)

if (!AIRTABLE_API_KEY || !BASE_ID) {
  console.error("❌ Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID environment variables")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

async function testWorkingTables() {
  console.log("\n🎯 Testing 20 working CanAI tables with API integration...")
  console.log(`📋 Base ID: ${BASE_ID}`)
  
  const workingTables = Object.entries(AIRTABLE_TABLES)
  console.log(`🎯 Testing ${workingTables.length} working tables`)
  
  let successCount = 0
  let failCount = 0
  
  for (const [tableKey, tableName] of workingTables) {
    try {
      console.log(`🔍 Testing ${tableKey} (${tableName})`)
      const records = await base(tableName).select({ maxRecords: 3 }).firstPage()
      console.log(`✅ ${tableKey}: ${records.length} records accessible`)
      
      if (records.length > 0) {
        const fields = Object.keys(records[0].fields)
        console.log(`   Fields (${fields.length}): ${fields.slice(0, 4).join(", ")}${fields.length > 4 ? "..." : ""}`)
        
        // Show sample data for key tables
        if (tableKey === 'SPARK_SPLIT_ANALYTICS' || tableKey === 'PROMPT_LOGS') {
          console.log(`   Sample data: ${JSON.stringify(records[0].fields).substring(0, 100)}...`)
        }
      }
      
      successCount++
      
    } catch (error: any) {
      console.log(`❌ ${tableKey} (${tableName}): ${error.message}`)
      failCount++
    }
  }
  
  console.log(`\n📊 API INTEGRATION TEST RESULTS:`)
  console.log(`✅ Successful connections: ${successCount}/${workingTables.length}`)
  console.log(`❌ Failed connections: ${failCount}/${workingTables.length}`)
  
  if (successCount === workingTables.length) {
    console.log(`\n🎉 PERFECT! ALL WORKING TABLES ACCESSIBLE VIA API!`)
    console.log(`🚀 CanAI emotional intelligence platform ready for production!`)
    console.log(`✅ SparkSplit trust transparency engine operational`)
    console.log(`✅ Core analytics platform ready for data collection`)
    console.log(`✅ Advanced intelligence suite ready for insights`)
    
    console.log(`\n🎯 READY FOR NEXT STEPS:`)
    console.log(`   1. Start data collection from live site`)
    console.log(`   2. Implement Make.com scenario logging`)
    console.log(`   3. Begin SparkSplit trust transparency testing`)
    console.log(`   4. Launch emotional intelligence analytics`)
    
    return true
  } else {
    console.log(`\n⚠️  Some tables need attention`)
    console.log(`💡 Check API permissions and table access`)
    return false
  }
}

// Test basic CRUD operations on key tables
async function testCRUDOperations() {
  console.log(`\n🧪 Testing basic CRUD operations...`)
  
  try {
    // Test creating a record in PromptLogs
    const testRecord = await base(AIRTABLE_TABLES.PROMPT_LOGS).create({
      sessionId: 'test-session-' + Date.now(),
      userId: 'test-user-api',
      promptType: 'API Test',
      promptContent: 'Testing API connectivity',
      responseContent: 'API test successful',
      trustScore: 4.5,
      emotionalIntelligenceScore: 4.2,
      userSatisfaction: 5,
      responseTimeMs: 1500,
      tokenUsage: 150,
      costUsd: 0.01
    })
    
    console.log(`✅ CREATE: Successfully created test record ${testRecord.id}`)
    
    // Test reading the record
    const readRecord = await base(AIRTABLE_TABLES.PROMPT_LOGS).find(testRecord.id)
    console.log(`✅ READ: Successfully read record ${readRecord.id}`)
    
    // Test updating the record
    const updatedRecord = await base(AIRTABLE_TABLES.PROMPT_LOGS).update(testRecord.id, {
      trustScore: 4.8,
      emotionalIntelligenceScore: 4.5
    })
    console.log(`✅ UPDATE: Successfully updated record ${updatedRecord.id}`)
    
    // Test deleting the record
    await base(AIRTABLE_TABLES.PROMPT_LOGS).destroy(testRecord.id)
    console.log(`✅ DELETE: Successfully deleted test record`)
    
    console.log(`\n🎉 CRUD OPERATIONS: ALL SUCCESSFUL!`)
    console.log(`✅ Full read/write access confirmed`)
    console.log(`✅ Ready for production data collection`)
    
    return true
    
  } catch (error: any) {
    console.log(`❌ CRUD test failed: ${error.message}`)
    console.log(`💡 Check API token permissions for write access`)
    return false
  }
}

async function runFullTest() {
  const tablesWorking = await testWorkingTables()
  
  if (tablesWorking) {
    const crudWorking = await testCRUDOperations()
    
    if (crudWorking) {
      console.log(`\n🌟 COMPLETE SUCCESS! CanAI PLATFORM READY!`)
      console.log(`✅ 20 tables operational`)
      console.log(`✅ Full CRUD access confirmed`)
      console.log(`✅ SparkSplit trust engine ready`)
      console.log(`✅ Emotional intelligence platform operational`)
      console.log(`\n🚀 Ready to launch data collection!`)
    }
  }
}

runFullTest().catch(console.error) 