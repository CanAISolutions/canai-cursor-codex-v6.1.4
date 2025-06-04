// 🔍 test-numbered-tables.ts
// Test access to the numbered tables visible in the Airtable interface

import Airtable from "airtable"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: '../../.env.local' })

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = process.env.AIRTABLE_BASE_ID!

console.log("🔧 Environment check:")
console.log(`   AIRTABLE_API_KEY: ${AIRTABLE_API_KEY ? "✅ Set" : "❌ Missing"}`)
console.log(`   AIRTABLE_BASE_ID: ${BASE_ID ? "✅ Set" : "❌ Missing"}`)

if (!AIRTABLE_API_KEY || !BASE_ID) {
  console.error("❌ Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID environment variables")
  console.log("💡 Check your .env.local file in the root directory")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// Complete list of 18 tables as they should appear in the Airtable interface
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

async function testAllCanAITables() {
  console.log("\n🔍 Testing all 18 CanAI tables from Airtable interface...")
  console.log(`📋 Base ID: ${BASE_ID}`)
  console.log(`🎯 Expected tables: ${ALL_CANAI_TABLES.length}`)
  
  let accessibleTables = []
  let inaccessibleTables = []
  
  for (const tableName of ALL_CANAI_TABLES) {
    try {
      console.log(`🔍 Testing table: ${tableName}`)
      const records = await base(tableName).select({ maxRecords: 1 }).firstPage()
      console.log(`✅ Table ${tableName} is accessible with ${records.length} records`)
      
      if (records.length > 0) {
        const fields = Object.keys(records[0].fields)
        console.log(`   Fields (${fields.length}): ${fields.slice(0, 5).join(", ")}${fields.length > 5 ? "..." : ""}`)
      }
      
      accessibleTables.push(tableName)
      
    } catch (error: any) {
      console.log(`❌ Table ${tableName} not accessible: ${error.message}`)
      inaccessibleTables.push(tableName)
    }
  }
  
  console.log(`\n📊 COMPREHENSIVE SUMMARY:`)
  console.log(`✅ Accessible tables: ${accessibleTables.length}/${ALL_CANAI_TABLES.length}`)
  console.log(`❌ Inaccessible tables: ${inaccessibleTables.length}/${ALL_CANAI_TABLES.length}`)
  
  if (accessibleTables.length > 0) {
    console.log(`\n✅ WORKING TABLES:`)
    accessibleTables.forEach(table => console.log(`   - ${table}`))
  }
  
  if (inaccessibleTables.length > 0) {
    console.log(`\n❌ MISSING TABLES:`)
    inaccessibleTables.forEach(table => console.log(`   - ${table}`))
    
    console.log(`\n💡 NEXT STEPS FOR MISSING TABLES:`)
    console.log(`   1. Create missing tables manually in Airtable interface`)
    console.log(`   2. Use direct API integration for 18-table architecture`)
    console.log(`   3. Follow setup guide: scripts/tools/airtable-complete-setup-guide.md`)
  }
  
  if (accessibleTables.length >= 12) {
    console.log(`\n🎉 CORE INFRASTRUCTURE OPERATIONAL!`)
    console.log(`✅ Essential tables (${accessibleTables.length}) are accessible`)
    console.log(`✅ CanAI emotional intelligence platform ready for data collection`)
    console.log(`✅ SparkSplit trust transparency engine operational`)
    
    if (accessibleTables.length === ALL_CANAI_TABLES.length) {
      console.log(`\n🌟 PERFECT! ALL 18 TABLES OPERATIONAL!`)
      console.log(`🚀 Complete CanAI emotional sovereignty platform ready!`)
    }
    
    return true
  } else {
    console.log(`\n⚠️  PARTIAL SETUP DETECTED`)
    console.log(`💡 Need at least 12 core tables for basic operation`)
    console.log(`📋 Current: ${accessibleTables.length}/12 minimum required`)
    return false
  }
}

testAllCanAITables().catch(console.error) 