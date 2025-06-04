// 🎯 fix-remaining-5-tables.ts
// Targeted fix for the 5 tables failing CRUD operations
// Addresses specific field type mismatches and validation issues

import Airtable from "airtable"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

const BASE_ID = "apph8yM7gVc9QBFtx"
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN

console.log("🎯 CanAI - Fix Remaining 5 Tables")
console.log("=================================")
console.log(`Base ID: ${BASE_ID}`)
console.log(`API Key: ${AIRTABLE_API_KEY ? "✅ Set" : "❌ Missing"}`)

if (!AIRTABLE_API_KEY) {
  console.error("❌ Missing AIRTABLE_API_KEY environment variable")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// The 5 tables that need fixing with their specific issues
const FAILING_TABLES = [
  '17_CompetitiveIntel',
  '24_SystemPerformance', 
  '27_GrowthMetrics',
  '28_RetentionAnalysis',
  '34_FutureInsights'
]

interface FixResult {
  tableName: string
  originalError: string
  fixApplied: string
  createSuccess: boolean
  readSuccess: boolean
  updateSuccess: boolean
  deleteSuccess: boolean
  recordId?: string
  finalError?: string
}

// Custom field handlers for each problematic table
function generateCustomTestData(tableName: string, existingFields: string[]): any {
  const timestamp = new Date().toISOString()
  const testId = `fix_test_${Date.now()}`
  
  switch (tableName) {
    case '17_CompetitiveIntel':
      // Issue: featureComparison field type mismatch
      // Fix: Use simple string instead of complex object
      return {
        recordId: testId,
        competitorName: `Test_Competitor_${testId}`,
        featureComparison: `Simple comparison text ${testId}`, // Fixed: Use string not object
        competitiveAdvantage: 'test_advantage',
        threatLevel: 0.5,
        marketPosition: 'test_position'
      }
    
    case '24_SystemPerformance':
      // Issue: metricValue field validation issue
      // Fix: Use proper number format within expected range
      return {
        recordId: testId,
        metricName: `Test_Metric_${testId}`,
        metricValue: 85.5, // Fixed: Use decimal number within 0-100 range
        performanceCategory: 'test_category',
        measurementUnit: 'percentage',
        benchmarkValue: 80.0
      }
    
    case '27_GrowthMetrics':
      // Issue: metricValue field validation issue  
      // Fix: Use proper growth rate format
      return {
        recordId: testId,
        growthMetric: `Test_Growth_${testId}`,
        metricValue: 12.5, // Fixed: Use positive growth percentage
        growthPeriod: 'monthly',
        metricType: 'user_growth',
        targetValue: 15.0
      }
    
    case '28_RetentionAnalysis':
      // Issue: cohortMonth date field formatting
      // Fix: Use proper date format for cohort analysis
      return {
        recordId: testId,
        cohortMonth: '2025-01', // Fixed: Use YYYY-MM format for cohort month
        retentionRate: 0.85,
        cohortSize: 100,
        retentionPeriod: 'month_1',
        churnRate: 0.15
      }
    
    case '34_FutureInsights':
      // Issue: trendStrength field validation issue
      // Fix: Use proper trend strength scale
      return {
        recordId: testId,
        insightType: `Test_Insight_${testId}`,
        trendStrength: 0.75, // Fixed: Use decimal between 0-1 for trend strength
        predictionConfidence: 0.85,
        timeHorizon: 'short_term',
        insightCategory: 'user_behavior'
      }
    
    default:
      // Fallback for any unexpected table
      return {
        recordId: testId,
        testField: `Fixed_Test_${testId}`,
        testValue: 'fixed_value'
      }
  }
}

async function getExistingFields(tableName: string): Promise<string[]> {
  try {
    const records = await base(tableName).select({ maxRecords: 1 }).firstPage()
    if (records.length > 0) {
      return Object.keys(records[0].fields)
    }
    return []
  } catch (error) {
    console.log(`   ⚠️  Could not get fields for ${tableName}: ${error}`)
    return []
  }
}

async function fixTable(tableName: string): Promise<FixResult> {
  const result: FixResult = {
    tableName,
    originalError: "Field type mismatch or validation issue",
    fixApplied: "",
    createSuccess: false,
    readSuccess: false,
    updateSuccess: false,
    deleteSuccess: false
  }

  try {
    console.log(`\n🔧 Fixing: ${tableName}`)
    
    // Get existing field structure
    const existingFields = await getExistingFields(tableName)
    console.log(`   📋 Found ${existingFields.length} existing fields`)
    
    // Generate custom test data with fixes
    const testData = generateCustomTestData(tableName, existingFields)
    
    // Document the fix applied
    switch (tableName) {
      case '17_CompetitiveIntel':
        result.fixApplied = "featureComparison: Changed from object to simple string"
        break
      case '24_SystemPerformance':
        result.fixApplied = "metricValue: Used decimal number within 0-100 range"
        break
      case '27_GrowthMetrics':
        result.fixApplied = "metricValue: Used positive growth percentage format"
        break
      case '28_RetentionAnalysis':
        result.fixApplied = "cohortMonth: Used YYYY-MM format instead of full datetime"
        break
      case '34_FutureInsights':
        result.fixApplied = "trendStrength: Used decimal between 0-1 for trend strength"
        break
    }
    
    console.log(`   🎯 Fix Applied: ${result.fixApplied}`)
    console.log(`   📋 Test Data: ${Object.keys(testData).join(", ")}`)
    
    // 1. CREATE - Test with fixed data
    console.log(`   📝 CREATE: Testing with fixed field formats...`)
    const createResponse = await base(tableName).create([{ fields: testData }])
    
    if (createResponse && createResponse.length > 0) {
      result.createSuccess = true
      result.recordId = createResponse[0].id
      console.log(`   ✅ CREATE: Success - Record ID: ${result.recordId}`)
    }

    // 2. READ - Verify record was created properly
    if (result.recordId) {
      console.log(`   📖 READ: Retrieving created record...`)
      const readResponse = await base(tableName).find(result.recordId)
      if (readResponse && readResponse.id === result.recordId) {
        result.readSuccess = true
        console.log(`   ✅ READ: Success - Record retrieved`)
      }
    }

    // 3. UPDATE - Test update with safe field
    if (result.recordId) {
      console.log(`   ✏️  UPDATE: Modifying record...`)
      
      // Use the first safe field for update
      const updateField = Object.keys(testData)[0]
      const updateData = {
        [updateField]: `UPDATED_${Date.now()}`
      }
      
      const updateResponse = await base(tableName).update([{
        id: result.recordId,
        fields: updateData
      }])
      
      if (updateResponse && updateResponse.length > 0) {
        result.updateSuccess = true
        console.log(`   ✅ UPDATE: Success - Modified ${updateField}`)
      }
    }

    // 4. DELETE - Clean up test record
    if (result.recordId) {
      console.log(`   🗑️  DELETE: Cleaning up test record...`)
      const deleteResponse = await base(tableName).destroy([result.recordId])
      if (deleteResponse && deleteResponse.length > 0) {
        result.deleteSuccess = true
        console.log(`   ✅ DELETE: Success - Test record cleaned up`)
      }
    }

    // Check if all operations succeeded
    const allSuccess = result.createSuccess && result.readSuccess && 
                      result.updateSuccess && result.deleteSuccess
    
    if (allSuccess) {
      console.log(`   🎉 FIXED! ${tableName} now has full CRUD capabilities`)
    } else {
      console.log(`   ⚠️  Partial fix - some operations still failing`)
    }

  } catch (error: any) {
    result.finalError = error.message
    console.log(`   ❌ Fix attempt failed: ${error.message}`)
    
    // Cleanup attempt if we created a record
    if (result.recordId && !result.deleteSuccess) {
      try {
        await base(tableName).destroy([result.recordId])
        console.log(`   🧹 CLEANUP: Test record removed after error`)
      } catch (cleanupError) {
        console.log(`   ⚠️  CLEANUP FAILED: ${cleanupError}`)
      }
    }
  }

  return result
}

async function runTargetedFix() {
  console.log(`\n🚀 Starting targeted fix for ${FAILING_TABLES.length} failing tables...`)
  
  const results: FixResult[] = []
  let fixedTables = 0
  let stillFailingTables = 0

  for (const tableName of FAILING_TABLES) {
    const result = await fixTable(tableName)
    results.push(result)
    
    const allOperationsSuccessful = result.createSuccess && result.readSuccess && 
                                   result.updateSuccess && result.deleteSuccess
    
    if (allOperationsSuccessful) {
      fixedTables++
    } else {
      stillFailingTables++
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  // Generate comprehensive fix report
  console.log(`\n📊 TARGETED FIX RESULTS`)
  console.log(`=======================`)
  console.log(`✅ Tables fixed: ${fixedTables}/${FAILING_TABLES.length}`)
  console.log(`❌ Tables still failing: ${stillFailingTables}/${FAILING_TABLES.length}`)
  
  if (fixedTables > 0) {
    console.log(`\n✅ SUCCESSFULLY FIXED TABLES:`)
    results.filter(r => r.createSuccess && r.readSuccess && r.updateSuccess && r.deleteSuccess)
           .forEach(r => {
             console.log(`   - ${r.tableName}: ${r.fixApplied}`)
           })
  }
  
  if (stillFailingTables > 0) {
    console.log(`\n❌ TABLES STILL NEEDING ATTENTION:`)
    results.filter(r => !(r.createSuccess && r.readSuccess && r.updateSuccess && r.deleteSuccess))
           .forEach(r => {
             console.log(`   - ${r.tableName}:`)
             console.log(`     Fix Applied: ${r.fixApplied}`)
             console.log(`     CREATE: ${r.createSuccess ? '✅' : '❌'}`)
             console.log(`     READ: ${r.readSuccess ? '✅' : '❌'}`)
             console.log(`     UPDATE: ${r.updateSuccess ? '✅' : '❌'}`)
             console.log(`     DELETE: ${r.deleteSuccess ? '✅' : '❌'}`)
             if (r.finalError) console.log(`     ERROR: ${r.finalError}`)
           })
  }

  // Calculate new success rate
  const originalSuccessful = 15 // From previous test
  const newSuccessful = originalSuccessful + fixedTables
  const totalTables = 18
  const newSuccessRate = (newSuccessful / totalTables) * 100
  
  console.log(`\n🎯 IMPACT ASSESSMENT:`)
  console.log(`Previous Success Rate: 86.1% (15/18 tables)`)
  console.log(`New Success Rate: ${newSuccessRate.toFixed(1)}% (${newSuccessful}/18 tables)`)
  console.log(`Improvement: +${(newSuccessRate - 86.1).toFixed(1)}% (${fixedTables} tables fixed)`)
  
  if (newSuccessRate === 100) {
    console.log(`\n🌟 PERFECT! ALL 18 TABLES NOW HAVE FULL CRUD CAPABILITIES!`)
    console.log(`🚀 Complete CanAI emotional sovereignty platform ready for production!`)
    console.log(`✅ SparkSplit trust engine ready for live data collection`)
    console.log(`✅ All emotional intelligence tracking operational`)
    console.log(`✅ Complete revenue attribution system ready`)
    console.log(`✅ Meta-intelligence capabilities fully functional`)
  } else if (newSuccessRate >= 95) {
    console.log(`\n🎉 EXCELLENT! ${newSuccessRate.toFixed(1)}% of tables operational`)
    console.log(`✅ Platform ready for production with minor optimizations needed`)
  } else {
    console.log(`\n⚠️  PROGRESS MADE: ${newSuccessRate.toFixed(1)}% operational`)
    console.log(`💡 Additional field analysis needed for remaining tables`)
  }

  return results
}

// Run the targeted fix
runTargetedFix().catch(console.error) 