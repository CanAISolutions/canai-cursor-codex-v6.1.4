// 🔍 discover-table-schemas.ts
// Discover the actual field schemas of all 36 tables

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

async function discoverTableSchemas() {
  console.log("🔍 DISCOVERING ACTUAL TABLE SCHEMAS")
  console.log("=" .repeat(50))
  
  const schemas: Record<string, string[]> = {}
  
  for (const tableName of ALL_TABLES) {
    try {
      console.log(`\n📋 Analyzing ${tableName}...`)
      
      // Get existing records to see field structure
      const records = await base(tableName).select({ maxRecords: 3 }).firstPage()
      
      if (records.length > 0) {
        const fields = Object.keys(records[0].fields)
        schemas[tableName] = fields
        console.log(`   ✅ Found ${fields.length} fields: ${fields.join(', ')}`)
        
        // Show sample data for first few fields
        const sampleData = records[0].fields
        console.log(`   📝 Sample data:`)
        fields.slice(0, 3).forEach(field => {
          const value = sampleData[field]
          const type = typeof value
          let preview: any = value
          if (type === 'string' && value && typeof value === 'string' && value.length > 50) {
            preview = value.substring(0, 50) + '...'
          }
          console.log(`      ${field}: ${preview} (${type})`)
        })
      } else {
        console.log(`   ⚠️  No records found - checking table structure...`)
        // Try to create a minimal record to discover required fields
        try {
          await base(tableName).create([{ fields: {} }])
        } catch (error: any) {
          if (error.message.includes('field')) {
            console.log(`   💡 Required fields hint: ${error.message}`)
          }
        }
        schemas[tableName] = []
      }
      
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`)
      schemas[tableName] = []
    }
  }
  
  // Generate TypeScript interface
  console.log(`\n📝 GENERATING TYPESCRIPT INTERFACES:`)
  console.log(`\n// Generated table schemas`)
  
  Object.entries(schemas).forEach(([tableName, fields]) => {
    if (fields.length > 0) {
      const interfaceName = tableName.replace(/^\d+_/, '') + 'Record'
      console.log(`\ninterface ${interfaceName} {`)
      fields.forEach(field => {
        console.log(`  ${field}: any // TODO: determine actual type`)
      })
      console.log(`}`)
    }
  })
  
  // Generate test data function
  console.log(`\n📝 GENERATING TEST DATA FUNCTION:`)
  console.log(`\nfunction generateValidTestData(tableName: string) {`)
  console.log(`  const timestamp = new Date().toISOString()`)
  console.log(`  const testId = \`test_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\``)
  console.log(`  `)
  console.log(`  switch (tableName) {`)
  
  Object.entries(schemas).forEach(([tableName, fields]) => {
    if (fields.length > 0) {
      console.log(`    case '${tableName}':`)
      console.log(`      return {`)
      fields.forEach(field => {
        // Generate appropriate test values based on field name
        let testValue = 'null'
        if (field.toLowerCase().includes('id')) testValue = '`test_${testId}`'
        else if (field.toLowerCase().includes('email')) testValue = '`test_${testId}@canai.so`'
        else if (field.toLowerCase().includes('score')) testValue = 'Math.random()'
        else if (field.toLowerCase().includes('count')) testValue = 'Math.floor(Math.random() * 100)'
        else if (field.toLowerCase().includes('date') || field.toLowerCase().includes('time')) testValue = 'timestamp'
        else if (field.toLowerCase().includes('type')) testValue = '`test_type`'
        else if (field.toLowerCase().includes('name')) testValue = '`test_name`'
        else testValue = '`test_value`'
        
        console.log(`        ${field}: ${testValue},`)
      })
      console.log(`      }`)
    }
  })
  
  console.log(`    default:`)
  console.log(`      return {}`)
  console.log(`  }`)
  console.log(`}`)
  
  // Summary
  const tablesWithFields = Object.values(schemas).filter(fields => fields.length > 0).length
  console.log(`\n📊 SCHEMA DISCOVERY SUMMARY:`)
  console.log(`✅ Tables with discovered fields: ${tablesWithFields}/${ALL_TABLES.length}`)
  console.log(`📋 Total unique fields discovered: ${new Set(Object.values(schemas).flat()).size}`)
  
  return schemas
}

discoverTableSchemas().catch(console.error) 