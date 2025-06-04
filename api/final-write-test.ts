// 🧪 final-18-table-write-test.ts
// Final comprehensive write test for 18 optimized tables with proper date handling

import Airtable from "airtable"

// Load environment variables
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Working API credentials from .env.local
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_PAT || ""
const BASE_ID = process.env.AIRTABLE_BASE_ID || "apph8yM7gVc9QBFtx"

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// All 18 optimized tables (4-tier architecture)
const OPTIMIZED_18_TABLES = [
  // TIER 1: CORE TABLES (3)
  'PromptLogs', 'SessionAnalytics', 'SparkSplitAnalytics',
  
  // TIER 2: INTELLIGENCE TABLES (5)
  'GoldmineOutput', 'UserContext', 'EmotionalIntelligence', 'TrustMetrics', 'PerformanceMetrics',
  
  // TIER 3: INTEGRATION INFRASTRUCTURE (5)
  'WebhookLogs', 'AirtableSync', 'ErrorLogs', 'ProcessingResults', 'SystemHealth',
  
  // TIER 4: REFERENCE TABLES (5)
  'PromptTypes', 'EmotionalStates', 'TrustFactors', 'SystemConfigs', 'AnalyticsAggregates'
]

function generateOptimizedTestData(tableName: string, existingFields: string[]) {
  const timestamp = new Date().toISOString()
  const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const data: any = {}
  
  existingFields.forEach(field => {
    // Handle date fields properly
    if (field.toLowerCase().includes('createdat') || 
        field.toLowerCase().includes('updatedat') ||
        field.toLowerCase().includes('timestamp') ||
        field.toLowerCase().includes('date') ||
        field.toLowerCase().includes('time')) {
      data[field] = timestamp
    }
    // Handle ID fields
    else if (field.toLowerCase().includes('id')) {
      data[field] = testId
    }
    // Handle score/numeric fields
    else if (field.toLowerCase().includes('score') || 
             field.toLowerCase().includes('rating') ||
             field.toLowerCase().includes('count') ||
             field.toLowerCase().includes('number')) {
      data[field] = Math.round(Math.random() * 100) / 100
    }
    // Handle email fields
    else if (field.toLowerCase().includes('email')) {
      data[field] = `test_${testId}@canai.so`
    }
    // Handle boolean fields
    else if (field.toLowerCase().includes('active') ||
             field.toLowerCase().includes('enabled') ||
             field.toLowerCase().includes('verified')) {
      data[field] = true
    }
    // Handle text fields
    else {
      data[field] = `test_value_${testId}`
    }
  })
  
  return data
}

async function testTableWriteOperations(tableName: string): Promise<boolean> {
  try {
    console.log(`\n📊 Testing Table: ${tableName}`)
    console.log(`----------------------------------------`)
    
    // Step 1: Read existing records to understand field structure
    console.log(`🔍 Testing READ: ${tableName}`)
    const existingRecords = await base(tableName).select({ maxRecords: 1 }).firstPage()
    
    if (existingRecords.length === 0) {
      console.log(`   ⚠️  No existing records to analyze field structure`)
      return false
    }
    
    const existingFields = Object.keys(existingRecords[0].fields)
    console.log(`   ✅ READ successful - ${existingFields.length} fields found`)
    
    // Step 2: Generate proper test data based on existing field structure
    const testData = generateOptimizedTestData(tableName, existingFields)
    
    // Step 3: Test CREATE operation
    console.log(`🔨 Testing CREATE: ${tableName}`)
    const newRecord = await base(tableName).create(testData) as any
    console.log(`   ✅ CREATE successful - Record ID: ${newRecord.id}`)
    
    // Step 4: Test UPDATE operation
    console.log(`📝 Testing UPDATE: ${tableName}`)
    const updateData: any = {}
    // Only update non-date fields to avoid conflicts
    const safeFields = existingFields.filter(field => 
      !field.toLowerCase().includes('createdat') && 
      !field.toLowerCase().includes('updatedat')
    )
    if (safeFields.length > 0) {
      updateData[safeFields[0]] = `updated_${Date.now()}`
    }
    
    await base(tableName).update(newRecord.id, updateData)
    console.log(`   ✅ UPDATE successful`)
    
    // Step 5: Test DELETE operation
    console.log(`🗑️  Testing DELETE: ${tableName}`)
    await base(tableName).destroy(newRecord.id)
    console.log(`   ✅ DELETE successful`)
    
    console.log(`   🎉 FULL CRUD SUPPORT: ${tableName}`)
    return true
    
  } catch (error: any) {
    if (error.message.includes('not authorized')) {
      console.log(`   ❌ ACCESS DENIED: ${error.message}`)
    } else if (error.message.includes('Cannot parse date')) {
      console.log(`   ❌ DATE FORMAT ERROR: ${error.message}`)
    } else {
      console.log(`   ❌ OPERATION FAILED: ${error.message}`)
    }
    return false
  }
}

async function runFinalWriteTest(): Promise<void> {
  console.log("🧪 CanAI Final Comprehensive Write Test")
  console.log("🚀 Testing CRUD operations on all 18 tables with proper date handling")
  console.log("============================================================\n")
  
  let accessibleTables = 0
  let fullCrudTables = 0
  let accessDeniedTables = 0
  
  const results = {
    fullCrud: [] as string[],
    readOnly: [] as string[],
    accessDenied: [] as string[],
    errors: [] as string[]
  }
  
  for (const tableName of OPTIMIZED_18_TABLES) {
    const success = await testTableWriteOperations(tableName)
    
    if (success) {
      fullCrudTables++
      accessibleTables++
      results.fullCrud.push(tableName)
    } else {
      // Check if it was access denied vs other error
      try {
        await base(tableName).select({ maxRecords: 1 }).firstPage()
        accessibleTables++
        results.readOnly.push(tableName)
      } catch (error: any) {
        if (error.message.includes('not authorized')) {
          accessDeniedTables++
          results.accessDenied.push(tableName)
        } else {
          results.errors.push(tableName)
        }
      }
    }
  }
  
  // Final Results
  console.log(`\n📊 FINAL COMPREHENSIVE RESULTS`)
  console.log(`============================================================`)
  
  console.log(`\n🎯 OVERALL STATISTICS:`)
  console.log(`   Tables Tested: ${OPTIMIZED_18_TABLES.length}`)
  console.log(`   Accessible Tables: ${accessibleTables}`)
  console.log(`   Full CRUD Support: ${fullCrudTables}`)
  console.log(`   Access Denied: ${accessDeniedTables}`)
  console.log(`   Success Rate: ${Math.round((accessibleTables / OPTIMIZED_18_TABLES.length) * 100)}%`)
  console.log(`   CRUD Success Rate: ${Math.round((fullCrudTables / OPTIMIZED_18_TABLES.length) * 100)}%`)
  
  if (results.fullCrud.length > 0) {
    console.log(`\n✅ FULL CRUD SUPPORT (${results.fullCrud.length} tables):`)
    results.fullCrud.forEach(table => console.log(`   ${table}`))
  }
  
  if (results.readOnly.length > 0) {
    console.log(`\n📖 READ-ONLY ACCESS (${results.readOnly.length} tables):`)
    results.readOnly.forEach(table => console.log(`   ${table}`))
  }
  
  if (results.accessDenied.length > 0) {
    console.log(`\n❌ ACCESS DENIED (${results.accessDenied.length} tables):`)
    results.accessDenied.forEach(table => console.log(`   ${table}`))
  }
  
  console.log(`\n📋 NEXT ACTIONS:`)
  if (accessDeniedTables > 0) {
    console.log(`1. 🔧 Check Airtable base permissions for tables 21-36`)
    console.log(`2. 🔑 Ensure API key has access to all tables`)
    console.log(`3. 👥 Verify user permissions in Airtable workspace`)
  }
  
  if (fullCrudTables < accessibleTables) {
    console.log(`4. 🔧 Review field permissions for write operations`)
    console.log(`5. 📋 Check required vs optional fields`)
  }
  
  if (fullCrudTables >= 20) {
    console.log(`\n🎉 EXCELLENT! ${fullCrudTables} tables have full CRUD support`)
    console.log(`✅ Core infrastructure operational for data collection`)
  }
}

runFinalWriteTest().catch(console.error) 