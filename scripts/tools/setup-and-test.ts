// 🔧 setup-and-test.ts
// Setup Airtable API key and test all 18 tables

import Airtable from "airtable"

// Base ID from the provided URLs
const BASE_ID = "apph8yM7gVc9QBFtx"

console.log("🔧 CanAI Airtable Setup & Test")
console.log("===============================")
console.log(`Base ID: ${BASE_ID}`)
console.log("")
console.log("📝 To run this test, you need to set your Airtable API key.")
console.log("💡 Get your API key from: https://airtable.com/create/tokens")
console.log("")
console.log("🚀 Run this command in PowerShell:")
console.log('$env:AIRTABLE_API_KEY="your_api_key_here"')
console.log("")
console.log("Then run: npx ts-node scripts/tools/fresh-table-test.ts")
console.log("")

// Check if API key is set
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN

if (!AIRTABLE_API_KEY) {
  console.log("❌ No API key found in environment variables")
  console.log("💡 Please set AIRTABLE_API_KEY and try again")
  process.exit(1)
}

console.log("✅ API key found! Testing tables...")

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// All 18 CanAI tables
const ALL_CANAI_TABLES = [
  // 18-Table Optimized Architecture
  '01_PromptLogs', '02_SessionAnalytics', '03_SparkSplitAnalytics', '04_GoldmineOutput', '05_UserContext',
  '06_EmotionalIntelligence', '07_TrustMetrics', '08_PerformanceMetrics', '09_WebhookLogs', '10_AirtableSync',
  '11_ErrorLogs', '12_ProcessingResults', '13_SystemHealth', '14_PromptTypes', '15_EmotionalStates',
  '16_TrustFactors', '17_SystemConfigs', '18_AnalyticsAggregates'
]

async function quickTest() {
  console.log(`\n🔍 Quick test of first 3 tables...`)
  
  for (let i = 0; i < 3; i++) {
    const tableName = ALL_CANAI_TABLES[i]
    try {
      const records = await base(tableName).select({ maxRecords: 1 }).firstPage()
      console.log(`✅ ${tableName}: Accessible (${records.length} records)`)
    } catch (error: any) {
      console.log(`❌ ${tableName}: ${error.message}`)
    }
  }
  
  console.log(`\n🚀 For full test, run: npx ts-node scripts/tools/fresh-table-test.ts`)
}

quickTest().catch(console.error) 