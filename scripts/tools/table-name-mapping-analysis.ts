// 🔍 table-name-mapping-analysis.ts
// Analyze the mismatch between CSV files and expected table names

import * as fs from 'fs'
import * as path from 'path'

// Expected table names from test script
const EXPECTED_TABLES = [
  // Core Analytics & Intelligence Tables (1-12) - WORKING
  '01_PromptLogs',
  '02_SparkSplitAnalytics', 
  '03_SessionAnalytics',
  '04_UserContext',
  '05_OutputGoldmine',
  '06_FeedbackLogs',
  '07_DeliveryCostLogs',
  '08_ReferralTriggers',
  '09_AIMiningAgents',
  '10_FieldGlossary',
  '11_SchemaEvents',
  '12_EmotionalCompass',
  
  // Advanced Intelligence Tables (13-24) - PARTIALLY WORKING
  '13_TrustMetrics',
  '14_PersonaCluster',
  '15_ContentOptimization',
  '16_PredictiveInsights',
  '17_CompetitiveIntel',
  '18_RevenueAttribution',
  '19_CustomerJourney',
  '20_BrandResonance',
  '21_ConversionFunnels',      // ❌ MISSING
  '22_GrowthMetrics',          // ❌ MISSING
  '23_EmotionalIntelligence',  // ❌ MISSING
  '24_EmotionalJourney',       // ❌ MISSING
  
  // Meta-Intelligence & Evolution Tables (25-36) - ALL MISSING
  '25_SentimentAnalysis',      // ❌ MISSING
  '26_BehavioralPatterns',     // ❌ MISSING
  '27_SystemEvolution',        // ❌ MISSING
  '28_MetaIntelligence',       // ❌ MISSING
  '29_InnovationMetrics',      // ❌ MISSING
  '30_FutureInsights',         // ❌ MISSING
  '31_TrustEvolution',         // ❌ MISSING
  '32_LearningExtraction',     // ❌ MISSING
  '33_CompoundIntelligence',   // ❌ MISSING
  '34_PredictiveModeling',     // ❌ MISSING
  '35_EvolutionTracking',      // ❌ MISSING
  '36_IntelligenceCompound'    // ❌ MISSING
]

function analyzeTableNameMismatch() {
  console.log("🔍 ANALYZING TABLE NAME MISMATCH")
  console.log("=" .repeat(50))
  
  const csvDir = '../../airtable-csv-imports'
  const csvFiles = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'))
  
  console.log(`\n📋 CSV FILES AVAILABLE (${csvFiles.length}):`)
  const csvTableNames = csvFiles.map(f => f.replace('.csv', '')).sort()
  csvTableNames.forEach(name => console.log(`   - ${name}`))
  
  console.log(`\n🎯 EXPECTED TABLE NAMES (${EXPECTED_TABLES.length}):`)
  EXPECTED_TABLES.forEach(name => console.log(`   - ${name}`))
  
  console.log(`\n🔍 MISMATCH ANALYSIS:`)
  
  // Find working tables (1-20)
  const workingTables = EXPECTED_TABLES.slice(0, 20)
  console.log(`\n✅ WORKING TABLES (${workingTables.length}):`)
  workingTables.forEach(table => {
    const csvExists = csvTableNames.includes(table)
    console.log(`   ${csvExists ? '✅' : '❌'} ${table} ${csvExists ? '(CSV available)' : '(CSV missing)'}`)
  })
  
  // Find missing tables (21-36)
  const missingTables = EXPECTED_TABLES.slice(20)
  console.log(`\n❌ MISSING TABLES (${missingTables.length}):`)
  missingTables.forEach(table => {
    const csvExists = csvTableNames.includes(table)
    console.log(`   ${csvExists ? '🔧' : '❌'} ${table} ${csvExists ? '(CSV available - needs import)' : '(CSV missing)'}`)
  })
  
  // Find CSV files that don't match expected names
  console.log(`\n🔍 CSV FILES NOT MATCHING EXPECTED NAMES:`)
  csvTableNames.forEach(csvName => {
    if (!EXPECTED_TABLES.includes(csvName)) {
      // Try to find what this might map to
      const number = csvName.split('_')[0]
      const expectedWithSameNumber = EXPECTED_TABLES.find(t => t.startsWith(number + '_'))
      
      if (expectedWithSameNumber) {
        console.log(`   🔧 ${csvName} → should be: ${expectedWithSameNumber}`)
      } else {
        console.log(`   ❓ ${csvName} → no matching expected table`)
      }
    }
  })
  
  console.log(`\n💡 SOLUTION SUMMARY:`)
  console.log(`   ✅ Tables 01-20: Already working in Airtable`)
  console.log(`   🔧 Tables 21-36: Need to be created in Airtable using CSV imports`)
  console.log(`   📋 Some CSV files may need renaming to match expected table names`)
  
  console.log(`\n🚀 NEXT STEPS:`)
  console.log(`   1. Check if tables 21-36 exist in Airtable but with different names`)
  console.log(`   2. Import CSV files for missing tables`)
  console.log(`   3. Ensure table names match exactly what the test script expects`)
  console.log(`   4. Re-run test-numbered-tables.ts to verify all 36 tables work`)
}

analyzeTableNameMismatch() 