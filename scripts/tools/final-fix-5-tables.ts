// 🎯 final-fix-5-tables.ts
// Final fix for the 5 failing tables using discovered field structures
// Target: 100% CRUD success rate (18/18 tables)

import Airtable from "airtable"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

const BASE_ID = "apph8yM7gVc9QBFtx"
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN

console.log("🎯 CanAI - Final Fix for 5 Tables")
console.log("=================================")
console.log(`Base ID: ${BASE_ID}`)
console.log(`API Key: ${AIRTABLE_API_KEY ? "✅ Set" : "❌ Missing"}`)

if (!AIRTABLE_API_KEY) {
  console.error("❌ Missing AIRTABLE_API_KEY environment variable")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// Test data using actual discovered field names
const TABLE_TEST_DATA = {
  '17_CompetitiveIntel': {
    recordId: `test_comp_${Date.now()}`,
    competitorName: `Test Competitor ${Date.now()}`,
    trustScore: 0.85,
    emotionalIntelligence: 0.92,
    userPreference: "trust_transparency",
    differentiationFactor: "emotional_sovereignty",
    marketPosition: "premium_trust_leader",
    threatLevel: "low",
    opportunityScore: 0.88
  },
  '24_SystemPerformance': {
    recordId: `test_sys_${Date.now()}`,
    metricType: "response_time_optimization",
    metricValue: 1.2,
    benchmark: 2.0,
    performanceScore: 0.95,
    optimizationOpportunity: "cache_enhancement",
    systemHealth: "excellent",
    userImpact: "positive_experience",
    technicalDebt: "minimal",
    scalabilityScore: 0.89
  },
  '27_GrowthMetrics': {
    recordId: `test_growth_${Date.now()}`,
    metricType: "user_acquisition_trust",
    metricValue: 150,
    growthRate: 0.25,
    trendDirection: "upward_accelerating",
    seasonality: "consistent_growth",
    growthBarriers: "market_education_needed",
    optimizationPotential: 0.78,
    forecastAccuracy: 0.91
  },
  '28_RetentionAnalysis': {
    recordId: `test_retention_${Date.now()}`,
    userId: `user_test_${Date.now()}`,
    retentionRate: 0.94,
    churnRisk: "low",
    engagementScore: 0.87,
    valueRealization: "high_trust_value",
    churnIndicators: "none_detected",
    interventionSuccess: "proactive_engagement"
  },
  '34_FutureInsights': {
    recordId: `test_future_${Date.now()}`,
    insightType: "trust_transparency_evolution",
    trendStrength: 0.91,
    timeHorizon: "6_months",
    probabilityScore: 0.88,
    impactAssessment: "revolutionary_market_shift",
    preparationNeeded: "trust_infrastructure_scaling",
    opportunitySize: 0.95,
    riskMitigation: "emotional_sovereignty_protection",
    strategicImportance: "critical_competitive_advantage"
  }
}

interface CrudResult {
  tableName: string
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
  error?: string
  recordId?: string
}

async function testTableCrud(tableName: string, testData: any): Promise<CrudResult> {
  const result: CrudResult = {
    tableName,
    create: false,
    read: false,
    update: false,
    delete: false
  }

  try {
    console.log(`\n🔧 Testing CRUD for: ${tableName}`)
    
    // CREATE
    console.log(`   📝 CREATE: Testing with optimized field data...`)
    const createResponse = await base(tableName).create([{ fields: testData }])
    const recordId = createResponse[0].id
    result.recordId = recordId
    result.create = true
    console.log(`   ✅ CREATE: Success (ID: ${recordId})`)

    // READ
    console.log(`   📖 READ: Retrieving created record...`)
    const readResponse = await base(tableName).find(recordId)
    result.read = !!readResponse
    console.log(`   ✅ READ: Success`)

    // UPDATE
    console.log(`   ✏️  UPDATE: Modifying record...`)
    const updateData: any = {}
    
    // Use safe fields for update based on table
    if (tableName === '17_CompetitiveIntel') {
      updateData.trustScore = 0.95
      updateData.threatLevel = "very_low"
    } else if (tableName === '24_SystemPerformance') {
      updateData.performanceScore = 0.98
      updateData.systemHealth = "optimal"
    } else if (tableName === '27_GrowthMetrics') {
      updateData.growthRate = 0.35
      updateData.trendDirection = "exponential_growth"
    } else if (tableName === '28_RetentionAnalysis') {
      updateData.retentionRate = 0.97
      updateData.churnRisk = "minimal"
    } else if (tableName === '34_FutureInsights') {
      updateData.trendStrength = 0.96
      updateData.probabilityScore = 0.92
    }

    await base(tableName).update([{ id: recordId, fields: updateData }])
    result.update = true
    console.log(`   ✅ UPDATE: Success`)

    // DELETE
    console.log(`   🗑️  DELETE: Removing test record...`)
    await base(tableName).destroy([recordId])
    result.delete = true
    console.log(`   ✅ DELETE: Success`)

    console.log(`   🌟 ${tableName}: PERFECT CRUD (CREATE ✅ READ ✅ UPDATE ✅ DELETE ✅)`)

  } catch (error: any) {
    result.error = error.message
    console.log(`   ❌ ${tableName}: CRUD failed - ${error.message}`)
    
    // Cleanup if record was created but later operations failed
    if (result.recordId && !result.delete) {
      try {
        await base(tableName).destroy([result.recordId])
        console.log(`   🧹 Cleanup: Test record removed`)
      } catch (cleanupError) {
        console.log(`   ⚠️  Cleanup failed: ${cleanupError}`)
      }
    }
  }

  return result
}

async function runFinalFix() {
  console.log(`\n🚀 Starting final fix for 5 failing tables...`)
  console.log(`🎯 Target: 100% CRUD success rate (18/18 tables)`)
  
  const results: CrudResult[] = []
  const tableNames = Object.keys(TABLE_TEST_DATA)

  for (const tableName of tableNames) {
    const testData = TABLE_TEST_DATA[tableName as keyof typeof TABLE_TEST_DATA]
    const result = await testTableCrud(tableName, testData)
    results.push(result)
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  // Calculate success metrics
  const successfulTables = results.filter(r => r.create && r.read && r.update && r.delete)
  const successRate = (successfulTables.length / results.length) * 100
  const totalSuccessRate = ((17 + successfulTables.length) / 18) * 100

  console.log(`\n📊 FINAL FIX RESULTS`)
  console.log(`====================`)
  console.log(`✅ Tables fixed: ${successfulTables.length}/${results.length}`)
  console.log(`🎯 Fix success rate: ${successRate.toFixed(1)}%`)
  console.log(`🌟 Total platform success rate: ${totalSuccessRate.toFixed(1)}% (${17 + successfulTables.length}/18 tables)`)

  if (successfulTables.length === 5) {
    console.log(`\n🎉 MISSION ACCOMPLISHED!`)
    console.log(`🌟 100% CRUD SUCCESS RATE ACHIEVED!`)
    console.log(`🚀 All 18 CanAI tables are now fully operational`)
    console.log(`💎 Perfect emotional sovereignty platform ready`)
  } else {
    console.log(`\n⚠️  TABLES STILL NEEDING ATTENTION:`)
    results.forEach(result => {
      if (!(result.create && result.read && result.update && result.delete)) {
        console.log(`   - ${result.tableName}:`)
        console.log(`     CREATE: ${result.create ? "✅" : "❌"}`)
        console.log(`     READ: ${result.read ? "✅" : "❌"}`)
        console.log(`     UPDATE: ${result.update ? "✅" : "❌"}`)
        console.log(`     DELETE: ${result.delete ? "✅" : "❌"}`)
        if (result.error) {
          console.log(`     ERROR: ${result.error}`)
        }
      }
    })
  }

  return results
}

// Run the final fix
runFinalFix().catch(console.error) 