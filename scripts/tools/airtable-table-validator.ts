// 🔍 airtable-table-validator.ts
// Flexible validation script for manually created Airtable tables
// Tests whatever tables exist and provides guidance on next steps

import Airtable from "airtable"
import * as fs from "fs"
import * as path from "path"

// Load environment variables from .env.local
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '..', '..', '.env.local')
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const lines = envContent.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '')
          process.env[key] = value
        }
      }
    }
    console.log("✅ Loaded environment variables from .env.local")
  } else {
    console.log("⚠️  .env.local file not found at:", envPath)
  }
}

loadEnvLocal()

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = process.env.AIRTABLE_BASE_ID!

if (!AIRTABLE_API_KEY || !BASE_ID) {
  console.error("❌ Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID environment variables")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// Priority tables to check for
const PRIORITY_TABLES = [
  'PromptLogs',
  'SparkSplitAnalytics', 
  'SessionAnalytics',
  'UserContext',
  'OutputGoldmine',
  'FeedbackLogs',
  'DeliveryCostLogs',
  'ReferralTriggers',
  'AIMiningAgents',
  'FieldGlossary'
]

// Expected field structures for validation
const EXPECTED_FIELDS: Record<string, string[]> = {
  'PromptLogs': [
    'recordId', 'createdAt', 'updatedAt', 'sessionId', 'userId', 'promptType',
    'intent', 'inputs', 'outputs', 'trustFallbackUsed', 'clarityIndex',
    'resonanceScore', 'momentumScore', 'deliveryCost', 'industry', 'audience'
  ],
  'SparkSplitAnalytics': [
    'recordId', 'createdAt', 'updatedAt', 'sessionId', 'promptLogId', 'comparisonId',
    'sterileOutput', 'canaiOutput', 'userSelection', 'selectionTimestamp',
    'timeToSelection', 'trustDelta', 'aweScore', 'ownershipScore', 'wonderScore'
  ],
  'SessionAnalytics': [
    'recordId', 'createdAt', 'updatedAt', 'sessionId', 'userId', 'sessionDuration',
    'promptCount', 'emotionalTrajectory', 'frictionPoints', 'outcomeType',
    'trustScore', 'emotionalDepth', 'sessionMomentum'
  ],
  'UserContext': [
    'recordId', 'createdAt', 'updatedAt', 'userId', 'userEmail', 'industryFocus',
    'communicationStyle', 'emotionalProfile', 'preferredTone', 'culturalContext',
    'cognitiveTraits'
  ],
  'OutputGoldmine': [
    'recordId', 'createdAt', 'updatedAt', 'outputHash', 'promptType', 'outputContent',
    'industryCluster', 'reusePotential', 'compoundValue', 'emotionalResonance',
    'usageCount', 'monetizationPotential'
  ]
}

async function validateTable(tableName: string) {
  try {
    console.log(`\n🔍 Validating table: ${tableName}`)
    
    // Test basic access
    const records = await base(tableName).select({ maxRecords: 3 }).firstPage()
    console.log(`✅ Table accessible with ${records.length} records`)
    
    // Check field structure if we have records
    if (records.length > 0) {
      const firstRecord = records[0]
      const actualFields = Object.keys(firstRecord.fields)
      const expectedFields = EXPECTED_FIELDS[tableName] || []
      
      console.log(`📋 Found ${actualFields.length} fields:`)
      actualFields.forEach((field: string) => {
        const isExpected = expectedFields.includes(field)
        console.log(`   ${isExpected ? '✅' : '🔶'} ${field}`)
      })
      
      // Check for missing critical fields
      const missingFields = expectedFields.filter((field: string) => !actualFields.includes(field))
      if (missingFields.length > 0) {
        console.log(`⚠️  Missing expected fields:`)
        missingFields.forEach((field: string) => {
          console.log(`   ❌ ${field}`)
        })
      }
      
      // Show sample data structure
      console.log(`📄 Sample record structure:`)
      Object.entries(firstRecord.fields).forEach(([key, value]) => {
        const valueType = Array.isArray(value) ? 'array' : typeof value
        const valuePreview = typeof value === 'string' && value.length > 50 
          ? value.substring(0, 50) + '...' 
          : value
        console.log(`   ${key}: ${valueType} = ${JSON.stringify(valuePreview)}`)
      })
    } else {
      console.log(`📝 Table is empty - ready for data`)
    }
    
    return { 
      success: true, 
      table: tableName, 
      recordCount: records.length,
      hasData: records.length > 0
    }
    
  } catch (error: any) {
    if (error.statusCode === 404) {
      console.log(`❌ Table ${tableName} does not exist`)
      return { success: false, table: tableName, error: 'not_found' }
    } else {
      console.log(`❌ Error accessing ${tableName}:`, error.message)
      return { success: false, table: tableName, error: error.message }
    }
  }
}

async function createSampleRecord(tableName: string) {
  try {
    console.log(`\n🚀 Creating sample record in ${tableName}...`)
    
    const sampleData: any = {
      recordId: `test_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Add table-specific sample data
    if (tableName === 'PromptLogs') {
      Object.assign(sampleData, {
        sessionId: `session_${Date.now()}`,
        userId: 'test_user',
        promptType: 'ai_blueprint',
        intent: 'Test validation record',
        inputs: '{"test": true}',
        outputs: 'Sample output for validation',
        trustFallbackUsed: false,
        clarityIndex: 8,
        resonanceScore: 0.85,
        momentumScore: 0.92,
        deliveryCost: 0.0023,
        industry: 'Technology',
        audience: 'Small business owners'
      })
    } else if (tableName === 'SparkSplitAnalytics') {
      Object.assign(sampleData, {
        sessionId: `session_${Date.now()}`,
        promptLogId: 'test_prompt_log',
        comparisonId: `comp_${Date.now()}`,
        sterileOutput: 'Basic AI output without emotional intelligence',
        canaiOutput: 'CanAI emotionally enriched output with deep resonance',
        userSelection: 'canai',
        selectionTimestamp: new Date().toISOString(),
        timeToSelection: 12.5,
        trustDelta: 0.73,
        aweScore: 0.82,
        ownershipScore: 0.91
      })
    }
    
    const createdRecord = await base(tableName).create(sampleData)
    console.log(`✅ Sample record created with ID: ${(createdRecord as any).id}`)
    
    return { success: true, recordId: (createdRecord as any).id }
    
  } catch (error: any) {
    console.log(`❌ Failed to create sample record:`, error.message)
    return { success: false, error: error.message }
  }
}

async function runCompleteValidation() {
  console.log("🚀 Starting Airtable Table Validation")
  console.log(`📋 Base ID: ${BASE_ID}`)
  console.log(`🔍 Checking ${PRIORITY_TABLES.length} priority tables\n`)
  
  const results = []
  
  for (const tableName of PRIORITY_TABLES) {
    const result = await validateTable(tableName)
    results.push(result)
    
    // If table exists and is empty, offer to create sample record
    if (result.success && !result.hasData) {
      console.log(`💡 Would you like to create a sample record? (Creating automatically for validation...)`)
      await createSampleRecord(tableName)
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Summary report
  console.log("\n" + "=".repeat(60))
  console.log("📊 VALIDATION SUMMARY")
  console.log("=".repeat(60))
  
  const existing = results.filter(r => r.success)
  const missing = results.filter(r => !r.success)
  
  console.log(`✅ Tables found: ${existing.length}/${PRIORITY_TABLES.length}`)
  console.log(`❌ Tables missing: ${missing.length}`)
  
  if (existing.length > 0) {
    console.log("\n✅ EXISTING TABLES:")
    existing.forEach(r => {
      console.log(`   - ${r.table} (${r.recordCount} records)`)
    })
  }
  
  if (missing.length > 0) {
    console.log("\n❌ MISSING TABLES:")
    missing.forEach(r => {
      console.log(`   - ${r.table}`)
    })
    
    console.log("\n📋 NEXT STEPS:")
    console.log("1. Create missing tables manually in Airtable interface")
    console.log("2. Use the setup guide: scripts/tools/airtable-complete-setup-guide.md")
    console.log("3. Run this validation script again")
  }
  
  if (existing.length === PRIORITY_TABLES.length) {
    console.log("\n🎉 ALL PRIORITY TABLES VALIDATED!")
    console.log("✅ Ready to begin data collection")
    console.log("✅ SparkSplit trust engine ready")
    console.log("✅ Emotional intelligence tracking ready")
    console.log("\n🚀 Next: Begin integrating with your CanAI prompts")
  }
  
  console.log("\n" + "=".repeat(60))
  
  return results
}

// Main execution
async function main() {
  try {
    await runCompleteValidation()
  } catch (error) {
    console.error("❌ Validation failed:", error)
    process.exit(1)
  }
}

main() 