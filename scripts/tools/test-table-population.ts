// 🧪 test-table-population.ts
// PROOF TEST: Actually populate all 36 tables with real data

import Airtable from "airtable"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: '../../.env.local' })

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = process.env.AIRTABLE_BASE_ID!

if (!AIRTABLE_API_KEY || !BASE_ID) {
  console.error("❌ Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID environment variables")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// All 36 tables that should be operational
const ALL_TABLES = [
  '01_PromptLogs', '02_SparkSplitAnalytics', '03_SessionAnalytics', '04_UserContext',
  '05_OutputGoldmine', '06_FeedbackLogs', '07_DeliveryCostLogs', '08_ReferralTriggers',
  '09_AIMiningAgents', '10_FieldGlossary', '11_SchemaEvents', '12_EmotionalCompass',
  '13_TrustMetrics', '14_PersonaCluster', '15_ContentOptimization', '16_PredictiveInsights',
  '17_CompetitiveIntel', '18_RevenueAttribution', '19_CustomerJourney', '20_BrandResonance',
  '21_BehavioralPatterns', '22_EmotionalJourney', '23_TrustEvolution', '24_SystemPerformance',
  '25_QualityMetrics', '26_UsageAnalytics', '27_GrowthMetrics', '28_RetentionAnalysis',
  '29_ConversionFunnels', '30_EmotionalIntelligence', '31_SentimentAnalysis', '32_PersonalizationEngine',
  '33_InnovationMetrics', '34_FutureInsights', '35_MetaIntelligence', '36_SystemEvolution'
]

// Generate test data for each table type
function generateTestData(tableName: string) {
  const timestamp = new Date().toISOString()
  const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Base fields that all tables should have
  const baseData = {
    recordId: testId,
    createdAt: timestamp,
    updatedAt: timestamp
  }

  // Table-specific test data
  switch (tableName) {
    case '01_PromptLogs':
      return {
        ...baseData,
        sessionId: `session_${testId}`,
        userId: `user_${testId}`,
        promptType: 'test_prompt',
        promptText: 'Test prompt for validation',
        responseText: 'Test response for validation',
        trustScore: 4.8,
        emotionalResonance: 0.92
      }
    
    case '02_SparkSplitAnalytics':
      return {
        ...baseData,
        sessionId: `session_${testId}`,
        promptLogId: `prompt_${testId}`,
        sparkChoice: 'canai_enhanced',
        comparisonShown: true,
        trustTransparency: 0.95,
        userPreference: 'enhanced'
      }
    
    case '03_SessionAnalytics':
      return {
        ...baseData,
        sessionId: `session_${testId}`,
        userId: `user_${testId}`,
        sessionDuration: 1200,
        promptCount: 5,
        trustScore: 4.7,
        emotionalJourney: 'discovery_to_trust'
      }
    
    case '04_UserContext':
      return {
        ...baseData,
        userId: `user_${testId}`,
        userEmail: `test_${testId}@canai.so`,
        businessType: 'test_business',
        emotionalProfile: 'analytical_optimist',
        trustLevel: 'high'
      }
    
    case '05_OutputGoldmine':
      return {
        ...baseData,
        outputHash: `hash_${testId}`,
        promptType: 'business_strategy',
        outputQuality: 0.94,
        reusePotential: 0.87,
        emotionalResonance: 0.91
      }
    
    case '21_BehavioralPatterns':
      return {
        ...baseData,
        userId: `user_${testId}`,
        patternType: 'trust_building',
        patternStrength: 0.87,
        frequency: 'high',
        triggers: 'transparency_features,sparksplit_comparisons',
        outcomes: 'increased_engagement,higher_conversion',
        emotionalCorrelation: 0.91,
        predictiveValue: 0.84,
        interventionOpportunity: 'show_more_transparency'
      }
    
    case '30_EmotionalIntelligence':
      return {
        ...baseData,
        userId: `user_${testId}`,
        sessionId: `session_${testId}`,
        emotionalState: 'curious_optimistic',
        empathyScore: 0.89,
        resonanceLevel: 0.92,
        trustIndicators: 'high_engagement,positive_feedback',
        emotionalGrowth: 0.15,
        transcendenceMarkers: 'breakthrough_moment_detected'
      }
    
    default:
      // Generic test data for other tables
      return {
        ...baseData,
        userId: `user_${testId}`,
        sessionId: `session_${testId}`,
        metricType: 'test_metric',
        metricValue: Math.random() * 100,
        qualityScore: Math.random(),
        trustScore: 4.0 + Math.random() * 1.0
      }
  }
}

async function testTablePopulation() {
  console.log("🧪 PROOF TEST: Populating all 36 tables with real data")
  console.log("=" .repeat(60))
  
  const results = {
    successful: [] as string[],
    failed: [] as { table: string, error: string }[],
    createdRecords: [] as { table: string, recordId: string }[]
  }
  
  for (const tableName of ALL_TABLES) {
    try {
      console.log(`\n🔍 Testing ${tableName}...`)
      
      // Generate test data
      const testData = generateTestData(tableName)
      console.log(`   📝 Generated test data: ${Object.keys(testData).length} fields`)
      
      // Create record
      const createdRecords = await base(tableName).create([
        { fields: testData }
      ])
      
      const recordId = createdRecords[0].id
      console.log(`   ✅ Created record: ${recordId}`)
      
      // Verify record exists by reading it back
      const retrievedRecord = await base(tableName).find(recordId)
      console.log(`   ✅ Verified record exists with ${Object.keys(retrievedRecord.fields).length} fields`)
      
      results.successful.push(tableName)
      results.createdRecords.push({ table: tableName, recordId })
      
    } catch (error: any) {
      console.log(`   ❌ Failed: ${error.message}`)
      results.failed.push({ table: tableName, error: error.message })
    }
  }
  
  // Summary
  console.log(`\n📊 POPULATION TEST RESULTS:`)
  console.log(`✅ Successfully populated: ${results.successful.length}/${ALL_TABLES.length} tables`)
  console.log(`❌ Failed to populate: ${results.failed.length}/${ALL_TABLES.length} tables`)
  console.log(`📝 Total records created: ${results.createdRecords.length}`)
  
  if (results.successful.length > 0) {
    console.log(`\n✅ SUCCESSFULLY POPULATED TABLES:`)
    results.successful.forEach(table => console.log(`   - ${table}`))
  }
  
  if (results.failed.length > 0) {
    console.log(`\n❌ FAILED TO POPULATE:`)
    results.failed.forEach(({ table, error }) => console.log(`   - ${table}: ${error}`))
  }
  
  console.log(`\n📋 CREATED RECORDS (for cleanup if needed):`)
  results.createdRecords.forEach(({ table, recordId }) => 
    console.log(`   - ${table}: ${recordId}`)
  )
  
  // Final verdict
  if (results.successful.length === ALL_TABLES.length) {
    console.log(`\n🎉 PROOF COMPLETE: ALL 36 TABLES CAN BE POPULATED!`)
    console.log(`✅ 100% infrastructure validated with real data`)
    console.log(`✅ CanAI Emotional Sovereignty Platform fully operational`)
    return true
  } else {
    console.log(`\n⚠️  PARTIAL SUCCESS: ${results.successful.length}/${ALL_TABLES.length} tables working`)
    console.log(`💡 ${results.failed.length} tables need investigation`)
    return false
  }
}

// Run the test
testTablePopulation().catch(console.error) 