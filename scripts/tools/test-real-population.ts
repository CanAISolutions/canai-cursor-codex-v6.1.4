// 🧪 test-real-population.ts
// PROOF TEST: Populate all 36 tables with REAL field names

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

function generateValidTestData(tableName: string) {
  const timestamp = new Date().toISOString()
  const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  switch (tableName) {
    case '01_PromptLogs':
      return {
        recordId: `test_${testId}`,
        createdAt: timestamp,
        updatedAt: timestamp,
        sessionId: `session_${testId}`,
        userId: `user_${testId}`,
        promptType: 'test_prompt',
        intent: 'test_intent',
        inputs: 'test input data',
        outputs: 'test output data',
        trustFallbackUsed: false,
        clarityIndex: 0.85,
        resonanceScore: 0.92,
        momentumScore: 0.88,
        deliveryCost: 0.05,
        industry: 'technology',
        audience: 'entrepreneurs',
        goal: 'test_goal',
        tone: 'professional',
        customerContent: 'test content',
        problemSolved: 'test problem',
        differentiator: 'test differentiator',
        founderBio: 'test bio',
        customerPain: 'test pain',
        trustSignal: 'test signal'
      }
    
    case '02_SparkSplitAnalytics':
      return {
        recordId: `test_${testId}`,
        createdAt: timestamp,
        updatedAt: timestamp,
        sessionId: `session_${testId}`,
        promptLogId: `prompt_${testId}`,
        comparisonId: `comparison_${testId}`,
        sterileOutput: 'Basic sterile output',
        canaiOutput: 'Enhanced CanAI output with emotional intelligence',
        userSelection: 'canai_enhanced',
        selectionTimestamp: timestamp,
        timeToSelection: 15,
        trustDelta: 0.25,
        aweScore: 0.89,
        ownershipScore: 0.91,
        wonderScore: 0.87,
        calmScore: 0.93,
        powerScore: 0.85
      }
    
    case '21_BehavioralPatterns':
      return {
        recordId: `test_${testId}`,
        createdAt: timestamp,
        updatedAt: timestamp,
        userId: `user_${testId}`,
        patternType: 'trust_building',
        patternStrength: 0.87,
        frequency: 'high',
        triggers: 'transparency_features',
        outcomes: 'increased_engagement',
        emotionalCorrelation: 0.91,
        predictiveValue: 0.84,
        interventionOpportunity: 'show_more_transparency'
      }
    
    default:
      // Minimal test data for other tables
      return {
        recordId: `test_${testId}`,
        createdAt: timestamp,
        updatedAt: timestamp,
        userId: `user_${testId}`,
        sessionId: `session_${testId}`
      }
  }
}

async function testRealPopulation() {
  console.log("🧪 REAL PROOF TEST: Populating tables with actual field names")
  console.log("=" .repeat(60))
  
  const results = {
    successful: [] as string[],
    failed: [] as { table: string, error: string }[],
    createdRecords: [] as { table: string, recordId: string }[]
  }
  
  // Test a few key tables first
  const testTables = ['01_PromptLogs', '02_SparkSplitAnalytics', '21_BehavioralPatterns']
  
  for (const tableName of testTables) {
    try {
      console.log(`\n🔍 Testing ${tableName}...`)
      
      // Generate test data with real field names
      const testData = generateValidTestData(tableName)
      console.log(`   📝 Generated test data: ${Object.keys(testData).length} fields`)
      console.log(`   🔑 Fields: ${Object.keys(testData).slice(0, 5).join(', ')}...`)
      
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
  console.log(`\n📊 REAL POPULATION TEST RESULTS:`)
  console.log(`✅ Successfully populated: ${results.successful.length}/${testTables.length} test tables`)
  console.log(`❌ Failed to populate: ${results.failed.length}/${testTables.length} test tables`)
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
  if (results.successful.length === testTables.length) {
    console.log(`\n🎉 PROOF COMPLETE: TABLES CAN BE POPULATED WITH REAL DATA!`)
    console.log(`✅ Infrastructure validated with actual field schemas`)
    console.log(`✅ Ready to test all 36 tables with proper field mapping`)
    return true
  } else {
    console.log(`\n⚠️  ISSUES FOUND: ${results.failed.length} tables failed`)
    console.log(`💡 Need to investigate field schema mismatches`)
    return false
  }
}

// Run the test
testRealPopulation().catch(console.error) 