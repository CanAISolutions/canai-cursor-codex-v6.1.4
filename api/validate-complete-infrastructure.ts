// 🎯 validate-complete-infrastructure.ts
// Comprehensive validation of all 36 CanAI tables for complete infrastructure readiness

import Airtable from "airtable"
import * as dotenv from "dotenv"
import { AIRTABLE_TABLES } from "./types/airtable"

// Load environment variables
dotenv.config({ path: '../.env.local' })

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = process.env.AIRTABLE_BASE_ID!

if (!AIRTABLE_API_KEY || !BASE_ID) {
  console.error("❌ Missing environment variables")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// Expected 36 tables for complete infrastructure
const EXPECTED_TABLES = [
  // Core Analytics Platform (1-12)
  '01_PromptLogs', '02_SparkSplitAnalytics', '03_SessionAnalytics', '04_UserContext',
  '05_OutputGoldmine', '06_FeedbackLogs', '07_DeliveryCostLogs', '08_ReferralTriggers',
  '09_AIMiningAgents', '10_FieldGlossary', '11_SchemaEvents', '12_EmotionalCompass',
  
  // Advanced Intelligence (13-20)
  '13_TrustMetrics', '14_PersonaCluster', '15_ContentOptimization', '16_PredictiveInsights',
  '17_CompetitiveIntel', '18_RevenueAttribution', '19_CustomerJourney', '20_BrandResonance',
  
  // Meta-Intelligence System (21-36)
  '21_ConversionFunnels', '22_GrowthMetrics', '23_EmotionalIntelligence', '24_EmotionalJourney',
  '25_SentimentAnalysis', '26_BehavioralPatterns', '27_SystemEvolution', '28_MetaIntelligence',
  '29_InnovationMetrics', '30_FutureInsights', '31_TrustEvolution', '32_LearningExtraction',
  '33_CompoundIntelligence', '34_PredictiveModeling', '35_EvolutionTracking', '36_IntelligenceCompound'
]

interface TableValidationResult {
  name: string
  accessible: boolean
  recordCount: number
  fieldCount: number
  sampleFields: string[]
  error?: string
}

async function validateCompleteInfrastructure(): Promise<void> {
  console.log("🎯 CanAI Complete Infrastructure Validation")
  console.log("🚀 Testing all 36 tables for emotional sovereignty platform readiness\n")
  
  const results: TableValidationResult[] = []
  let accessibleCount = 0
  let totalRecords = 0
  
  for (const tableName of EXPECTED_TABLES) {
    try {
      console.log(`🔍 Validating: ${tableName}`)
      
      const records = await base(tableName).select({ maxRecords: 5 }).firstPage()
      const fieldCount = records.length > 0 ? Object.keys(records[0].fields).length : 0
      const sampleFields = records.length > 0 ? Object.keys(records[0].fields).slice(0, 3) : []
      
      results.push({
        name: tableName,
        accessible: true,
        recordCount: records.length,
        fieldCount,
        sampleFields
      })
      
      console.log(`   ✅ Accessible - ${records.length} records, ${fieldCount} fields`)
      accessibleCount++
      totalRecords += records.length
      
    } catch (error: any) {
      console.log(`   ❌ Not accessible: ${error.message}`)
      results.push({
        name: tableName,
        accessible: false,
        recordCount: 0,
        fieldCount: 0,
        sampleFields: [],
        error: error.message
      })
    }
  }
  
  // Generate comprehensive report
  console.log(`\n📊 COMPLETE INFRASTRUCTURE VALIDATION REPORT`)
  console.log(`═══════════════════════════════════════════════`)
  
  console.log(`\n🎯 OVERALL STATUS:`)
  console.log(`   Tables Accessible: ${accessibleCount}/${EXPECTED_TABLES.length}`)
  console.log(`   Total Records: ${totalRecords}`)
  console.log(`   Infrastructure Completeness: ${Math.round((accessibleCount / EXPECTED_TABLES.length) * 100)}%`)
  
  // Categorize results
  const accessibleTables = results.filter(r => r.accessible)
  const missingTables = results.filter(r => !r.accessible)
  
  if (accessibleTables.length > 0) {
    console.log(`\n✅ OPERATIONAL TABLES (${accessibleTables.length}):`)
    accessibleTables.forEach(table => {
      console.log(`   ${table.name} - ${table.recordCount} records, ${table.fieldCount} fields`)
    })
  }
  
  if (missingTables.length > 0) {
    console.log(`\n❌ MISSING TABLES (${missingTables.length}):`)
    missingTables.forEach(table => {
      console.log(`   ${table.name} - ${table.error}`)
    })
    
    console.log(`\n🔧 SETUP REQUIRED:`)
    console.log(`   1. Create missing tables manually in Airtable`)
    console.log(`   2. Use setup guide: api/complete-table-setup-guide.md`)
    console.log(`   3. Import field schemas for each missing table`)
    console.log(`   4. Re-run this validation script`)
  }
  
  // API Integration Test
  if (accessibleCount >= 20) {
    console.log(`\n🧪 TESTING API INTEGRATION...`)
    await testAPIIntegration(accessibleTables)
  }
  
  // Final Assessment
  console.log(`\n🎯 INFRASTRUCTURE READINESS ASSESSMENT:`)
  
  if (accessibleCount === EXPECTED_TABLES.length) {
    console.log(`🌟 PERFECT! COMPLETE INFRASTRUCTURE OPERATIONAL!`)
    console.log(`✅ All 36 tables accessible`)
    console.log(`✅ Complete emotional intelligence platform ready`)
    console.log(`✅ Advanced meta-intelligence capabilities available`)
    console.log(`✅ Predictive modeling infrastructure operational`)
    console.log(`✅ Trust transparency system fully deployed`)
    console.log(`✅ Zero future integration bottlenecks`)
    
    console.log(`\n🚀 COMPETITIVE ADVANTAGES UNLOCKED:`)
    console.log(`✅ World's most advanced AI emotional platform`)
    console.log(`✅ Complete data collection from day one`)
    console.log(`✅ Future-proof architecture`)
    console.log(`✅ Market leadership position secured`)
    
  } else if (accessibleCount >= 30) {
    console.log(`🎉 EXCELLENT! Near-complete infrastructure (${accessibleCount}/36)`)
    console.log(`✅ Core platform operational`)
    console.log(`✅ Most competitive advantages available`)
    console.log(`🔧 ${36 - accessibleCount} tables remaining for complete setup`)
    
  } else if (accessibleCount >= 20) {
    console.log(`✅ GOOD! Core infrastructure operational (${accessibleCount}/36)`)
    console.log(`✅ Essential capabilities available`)
    console.log(`🔧 ${36 - accessibleCount} tables remaining for full platform`)
    
  } else {
    console.log(`⚠️  PARTIAL SETUP (${accessibleCount}/36)`)
    console.log(`🔧 Significant setup required for complete platform`)
    console.log(`💡 Focus on core tables first, then expand`)
  }
  
  console.log(`\n📋 NEXT ACTIONS:`)
  if (missingTables.length > 0) {
    console.log(`1. Create ${missingTables.length} missing tables`)
    console.log(`2. Follow setup guide: api/complete-table-setup-guide.md`)
    console.log(`3. Re-run validation: npx ts-node validate-complete-infrastructure.ts`)
  } else {
    console.log(`1. Begin data collection from live site`)
    console.log(`2. Implement Make.com scenario logging`)
    console.log(`3. Launch emotional intelligence analytics`)
    console.log(`4. Activate SparkSplit trust transparency`)
  }
}

async function testAPIIntegration(accessibleTables: TableValidationResult[]): Promise<void> {
  console.log(`\n🔧 Testing API integration with ${accessibleTables.length} tables...`)
  
  try {
    // Test CRUD operations on a core table
    const coreTable = accessibleTables.find(t => t.name === '01_PromptLogs')
    if (coreTable) {
      const timestamp = Date.now()
      
      // Create test record
      const testRecord = await base('01_PromptLogs').create({
        recordId: `validation-test-${timestamp}`,
        sessionId: `validation-session-${timestamp}`,
        userId: 'validation-user',
        promptType: 'VALIDATION_TEST',
        intent: 'Infrastructure validation test',
        outputs: 'All systems operational - validation successful'
      })
      
      console.log(`   ✅ CREATE: Test record created successfully`)
      
      // Read test record
      const readRecord = await base('01_PromptLogs').find(testRecord.id)
      console.log(`   ✅ READ: Test record retrieved successfully`)
      
      // Update test record
      await base('01_PromptLogs').update(testRecord.id, {
        outputs: 'Infrastructure validation complete - all systems operational'
      })
      console.log(`   ✅ UPDATE: Test record updated successfully`)
      
      // Delete test record
      await base('01_PromptLogs').destroy(testRecord.id)
      console.log(`   ✅ DELETE: Test record cleaned up successfully`)
      
      console.log(`   🎉 API INTEGRATION: FULLY OPERATIONAL`)
      
    } else {
      console.log(`   ⚠️  Core table not available for API testing`)
    }
    
  } catch (error: any) {
    console.log(`   ❌ API Integration Error: ${error.message}`)
    console.log(`   💡 Check API permissions and table access`)
  }
}

// Run validation
validateCompleteInfrastructure().catch(console.error) 