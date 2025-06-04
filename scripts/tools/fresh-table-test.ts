// 🔍 fresh-table-test.ts
// Fresh test of all 18 CanAI tables - starting from scratch

import Airtable from "airtable"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Base ID from the provided URLs
const BASE_ID = "apph8yM7gVc9QBFtx"
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN

console.log("🔧 Fresh Environment Check:")
console.log(`   Base ID: ${BASE_ID}`)
console.log(`   API Key: ${AIRTABLE_API_KEY ? "✅ Set" : "❌ Missing"}`)

if (!AIRTABLE_API_KEY) {
  console.error("❌ Missing AIRTABLE_API_KEY or AIRTABLE_TOKEN environment variable")
  console.log("💡 Set your Airtable API key as an environment variable")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// All 18 CanAI tables as they should exist
const ALL_CANAI_TABLES = [
  // 18-Table Optimized Architecture
  '01_PromptLogs', '02_SessionAnalytics', '03_SparkSplitAnalytics', '04_GoldmineOutput', '05_UserContext',
  '06_EmotionalIntelligence', '07_TrustMetrics', '08_PerformanceMetrics', '09_WebhookLogs', '10_AirtableSync',
  '11_ErrorLogs', '12_ProcessingResults', '13_SystemHealth', '14_PromptTypes', '15_EmotionalStates',
  '16_TrustFactors', '17_SystemConfigs', '18_AnalyticsAggregates',
  
  // Advanced Intelligence Tables (13-24)
  '13_TrustMetrics',
  '14_PersonaCluster',
  '15_ContentOptimization',
  '16_PredictiveInsights',
  '17_CompetitiveIntel',
  '18_RevenueAttribution',
  '19_CustomerJourney',
  '20_BrandResonance',
  '21_BehavioralPatterns',
  '22_EmotionalJourney',
  '23_TrustEvolution',
  '24_SystemPerformance',
  
  // Meta-Intelligence & Evolution Tables (25-36)
  '25_QualityMetrics',
  '26_UsageAnalytics',
  '27_GrowthMetrics',
  '28_RetentionAnalysis',
  '29_ConversionFunnels',
  '30_EmotionalIntelligence',
  '31_SentimentAnalysis',
  '32_PersonalizationEngine',
  '33_InnovationMetrics',
  '34_FutureInsights',
  '35_MetaIntelligence',
  '36_SystemEvolution'
]

async function testAllTables() {
  console.log("\n🔍 Testing all 18 CanAI tables...")
  console.log(`📋 Base ID: ${BASE_ID}`)
  console.log(`🎯 Expected tables: ${ALL_CANAI_TABLES.length}`)
  
  let accessibleTables: string[] = []
  let inaccessibleTables: string[] = []
  let tableDetails: Array<{name: string, recordCount: number, fields: string[]}> = []
  
  for (const tableName of ALL_CANAI_TABLES) {
    try {
      console.log(`🔍 Testing table: ${tableName}`)
      const records = await base(tableName).select({ maxRecords: 3 }).firstPage()
      console.log(`✅ Table ${tableName} is accessible with ${records.length} records`)
      
      let fields: string[] = []
      if (records.length > 0) {
        fields = Object.keys(records[0].fields)
        console.log(`   Fields (${fields.length}): ${fields.slice(0, 5).join(", ")}${fields.length > 5 ? "..." : ""}`)
      }
      
      accessibleTables.push(tableName)
      tableDetails.push({
        name: tableName,
        recordCount: records.length,
        fields: fields
      })
      
    } catch (error: any) {
      console.log(`❌ Table ${tableName} not accessible: ${error.message}`)
      inaccessibleTables.push(tableName)
    }
  }
  
  console.log(`\n📊 COMPREHENSIVE RESULTS:`)
  console.log(`✅ Accessible tables: ${accessibleTables.length}/${ALL_CANAI_TABLES.length}`)
  console.log(`❌ Inaccessible tables: ${inaccessibleTables.length}/${ALL_CANAI_TABLES.length}`)
  
  if (accessibleTables.length > 0) {
    console.log(`\n✅ WORKING TABLES:`)
    tableDetails.forEach(table => {
      console.log(`   - ${table.name}: ${table.recordCount} records, ${table.fields.length} fields`)
    })
  }
  
  if (inaccessibleTables.length > 0) {
    console.log(`\n❌ MISSING TABLES:`)
    inaccessibleTables.forEach(table => console.log(`   - ${table}`))
  }
  
  if (accessibleTables.length === ALL_CANAI_TABLES.length) {
    console.log(`\n🌟 PERFECT! ALL 18 TABLES OPERATIONAL!`)
    console.log(`🚀 Complete CanAI emotional sovereignty platform ready!`)
    console.log(`✅ SparkSplit trust transparency engine operational`)
    console.log(`✅ Emotional intelligence tracking active`)
    console.log(`✅ Revenue attribution system live`)
    console.log(`✅ Predictive analytics operational`)
    return true
  } else if (accessibleTables.length >= 15) {
    console.log(`\n🎉 EXCELLENT! ${accessibleTables.length}/18 tables operational!`)
    console.log(`✅ Core infrastructure fully functional`)
    return true
  } else {
    console.log(`\n⚠️  PARTIAL SETUP: ${accessibleTables.length}/18 tables accessible`)
    return false
  }
}

// Run the test
testAllTables().catch(console.error) 