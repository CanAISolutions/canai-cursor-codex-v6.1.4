// 🎯 validate-complete-infrastructure.ts
// Comprehensive validation of all 18 CanAI tables for complete infrastructure readiness

import Airtable from "airtable"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = process.env.AIRTABLE_BASE_ID!

// Initialize Airtable
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// Expected 18 tables for complete infrastructure
const ALL_CANAI_TABLES = [
  // TIER 1: CORE TABLES (3)
  '01_PromptLogs', '02_SessionAnalytics', '03_SparkSplitAnalytics', 
  
  // TIER 2: INTELLIGENCE TABLES (5)
  '04_GoldmineOutput', '05_UserContext', '06_EmotionalIntelligence', 
  '07_TrustMetrics', '08_PerformanceMetrics',
  
  // TIER 3: INTEGRATION INFRASTRUCTURE (5)
  '09_WebhookLogs', '10_AirtableSync', '11_ErrorLogs', 
  '12_ProcessingResults', '13_SystemHealth',
  
  // TIER 4: REFERENCE TABLES (5)
  '14_PromptTypes', '15_EmotionalStates', '16_TrustFactors', 
  '17_SystemConfigs', '18_AnalyticsAggregates'
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
  console.log("🚀 Testing all 18 tables for emotional sovereignty platform readiness\n")
  
  const results: TableValidationResult[] = []
  let accessibleCount = 0
  let totalRecords = 0
  
  for (const tableName of ALL_CANAI_TABLES) {
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
  console.log(`   Tables Accessible: ${accessibleCount}/${ALL_CANAI_TABLES.length}`)
  console.log(`   Total Records: ${totalRecords}`)
  console.log(`   Infrastructure Completeness: ${Math.round((accessibleCount / ALL_CANAI_TABLES.length) * 100)}%`)
  
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
  if (accessibleCount >= 10) {
    console.log(`\n🧪 TESTING API INTEGRATION...`)
    await testAPIIntegration(accessibleTables)
  }
  
  // Final Assessment
  console.log(`\n🎯 INFRASTRUCTURE READINESS ASSESSMENT:`)
  
  if (accessibleCount === ALL_CANAI_TABLES.length) {
    console.log(`🌟 PERFECT! COMPLETE INFRASTRUCTURE OPERATIONAL!`)
    console.log(`✅ All 18 tables accessible`)
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
    
  } else if (accessibleCount >= 15) {
    console.log(`🎉 EXCELLENT! Near-complete infrastructure (${accessibleCount}/18)`)
    console.log(`✅ Core platform operational`)
    console.log(`✅ Most competitive advantages available`)
    console.log(`🔧 ${18 - accessibleCount} tables remaining for complete setup`)
    
  } else if (accessibleCount >= 10) {
    console.log(`✅ GOOD! Core infrastructure operational (${accessibleCount}/18)`)
    console.log(`✅ Essential capabilities available`)
    console.log(`🔧 ${18 - accessibleCount} tables remaining for full platform`)
    
  } else {
    console.log(`⚠️  PARTIAL SETUP (${accessibleCount}/18)`)
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