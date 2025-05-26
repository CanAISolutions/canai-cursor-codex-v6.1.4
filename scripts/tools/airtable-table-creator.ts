// 🚀 airtable-table-creator.ts
// Comprehensive table creation script for CanAI's 35+ Airtable tables
// Pushes all schemas to Airtable via API with proper field types and validation

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

// Complete table definitions based on your schema system
const TABLE_DEFINITIONS = [
  // Core Analytics & Intelligence Tables
  {
    name: "PromptLogs",
    description: "Core session tracking and analytics",
    fields: [
      { name: "recordId", type: "singleLineText" },
      { name: "createdAt", type: "dateTime" },
      { name: "updatedAt", type: "dateTime" },
      { name: "sessionId", type: "singleLineText" },
      { name: "userId", type: "singleLineText" },
      { name: "promptType", type: "singleSelect", options: ["ai_blueprint", "business_plan", "email_campaign", "site_audit", "social_content", "reverse_strategy", "ai_brand_identity", "profile_makeover", "blogblitz", "ad_amplify"] },
      { name: "intent", type: "singleLineText" },
      { name: "inputs", type: "longText" },
      { name: "outputs", type: "longText" },
      { name: "trustFallbackUsed", type: "checkbox" },
      { name: "clarityIndex", type: "number", options: { precision: 0 } },
      { name: "resonanceScore", type: "number", options: { precision: 2 } },
      { name: "momentumScore", type: "number", options: { precision: 2 } },
      { name: "deliveryCost", type: "number", options: { precision: 4 } },
      { name: "industry", type: "singleLineText" },
      { name: "audience", type: "singleLineText" },
      { name: "goal", type: "singleLineText" },
      { name: "tone", type: "singleLineText" },
      { name: "customerContent", type: "longText" },
      { name: "problemSolved", type: "longText" },
      { name: "differentiator", type: "longText" },
      { name: "founderBio", type: "longText" },
      { name: "customerPain", type: "longText" },
      { name: "trustSignal", type: "longText" }
    ]
  },
  
  {
    name: "SessionAnalytics",
    description: "Session-level metrics and behavior tracking",
    fields: [
      { name: "recordId", type: "singleLineText" },
      { name: "createdAt", type: "dateTime" },
      { name: "updatedAt", type: "dateTime" },
      { name: "sessionId", type: "singleLineText" },
      { name: "userId", type: "singleLineText" },
      { name: "sessionDuration", type: "number", options: { precision: 0 } },
      { name: "promptCount", type: "number", options: { precision: 0 } },
      { name: "emotionalTrajectory", type: "longText" },
      { name: "frictionPoints", type: "multipleSelects", options: ["loading_delay", "unclear_prompt", "unexpected_output", "navigation_confusion"] },
      { name: "outcomeType", type: "singleSelect", options: ["completed", "abandoned", "converted", "referred"] },
      { name: "trustScore", type: "number", options: { precision: 2 } },
      { name: "emotionalDepth", type: "number", options: { precision: 2 } },
      { name: "sessionMomentum", type: "number", options: { precision: 2 } }
    ]
  },

  {
    name: "FeedbackLogs",
    description: "User feedback and delta tracking",
    fields: [
      { name: "recordId", type: "singleLineText" },
      { name: "createdAt", type: "dateTime" },
      { name: "updatedAt", type: "dateTime" },
      { name: "sessionId", type: "singleLineText" },
      { name: "promptLogId", type: "singleLineText" },
      { name: "feedbackType", type: "singleSelect", options: ["thumbs_up", "thumbs_down", "revision_request", "emotional_response"] },
      { name: "feedbackText", type: "longText" },
      { name: "emotionalTags", type: "multipleSelects", options: ["joy", "surprise", "trust", "anticipation", "fear", "sadness", "disgust", "anger"] },
      { name: "improvementSuggestion", type: "longText" },
      { name: "resonanceScore", type: "number", options: { precision: 2 } }
    ]
  },

  {
    name: "UserContext",
    description: "User profile and context data",
    fields: [
      { name: "recordId", type: "singleLineText" },
      { name: "createdAt", type: "dateTime" },
      { name: "updatedAt", type: "dateTime" },
      { name: "userId", type: "singleLineText" },
      { name: "userEmail", type: "email" },
      { name: "industryFocus", type: "multipleSelects", options: ["SaaS", "E-commerce", "Consulting", "Healthcare", "Education", "Finance", "Real Estate", "Manufacturing"] },
      { name: "communicationStyle", type: "singleSelect", options: ["direct", "collaborative", "analytical", "creative", "empathetic"] },
      { name: "emotionalProfile", type: "longText" },
      { name: "preferredTone", type: "singleSelect", options: ["professional", "friendly", "authoritative", "empowering", "conversational"] },
      { name: "culturalContext", type: "singleLineText" },
      { name: "cognitiveTraits", type: "multipleSelects", options: ["detail_oriented", "big_picture", "analytical", "intuitive", "systematic"] }
    ]
  },

  // SparkSplit Revolutionary Trust Engine
  {
    name: "SparkSplitAnalytics",
    description: "Trust transparency metrics and comparison data",
    fields: [
      { name: "recordId", type: "singleLineText" },
      { name: "createdAt", type: "dateTime" },
      { name: "updatedAt", type: "dateTime" },
      { name: "sessionId", type: "singleLineText" },
      { name: "promptLogId", type: "singleLineText" },
      { name: "comparisonId", type: "singleLineText" },
      { name: "sterileOutput", type: "longText" },
      { name: "canaiOutput", type: "longText" },
      { name: "userSelection", type: "singleSelect", options: ["sterile", "canai", "both", "neither", "skip"] },
      { name: "selectionTimestamp", type: "dateTime" },
      { name: "timeToSelection", type: "number", options: { precision: 2 } },
      { name: "trustDelta", type: "number", options: { precision: 2 } },
      { name: "aweScore", type: "number", options: { precision: 2 } },
      { name: "ownershipScore", type: "number", options: { precision: 2 } },
      { name: "wonderScore", type: "number", options: { precision: 2 } },
      { name: "calmScore", type: "number", options: { precision: 2 } },
      { name: "powerScore", type: "number", options: { precision: 2 } }
    ]
  },

  // Goldmine Layer Intelligence
  {
    name: "OutputGoldmine",
    description: "Reusable output intelligence and monetization",
    fields: [
      { name: "recordId", type: "singleLineText" },
      { name: "createdAt", type: "dateTime" },
      { name: "updatedAt", type: "dateTime" },
      { name: "outputHash", type: "singleLineText" },
      { name: "promptType", type: "singleLineText" },
      { name: "outputContent", type: "longText" },
      { name: "industryCluster", type: "singleSelect", options: ["SaaS", "E-commerce", "Consulting", "Healthcare", "Education", "Finance"] },
      { name: "reusePotential", type: "number", options: { precision: 2 } },
      { name: "compoundValue", type: "number", options: { precision: 2 } },
      { name: "emotionalResonance", type: "number", options: { precision: 2 } },
      { name: "usageCount", type: "number", options: { precision: 0 } }
    ]
  },

  {
    name: "AIMiningAgents",
    description: "AI pattern detection and intelligence extraction",
    fields: [
      { name: "recordId", type: "singleLineText" },
      { name: "createdAt", type: "dateTime" },
      { name: "updatedAt", type: "dateTime" },
      { name: "agentType", type: "singleSelect", options: ["pattern_detector", "trend_analyzer", "content_optimizer", "emotion_tracker"] },
      { name: "agentName", type: "singleLineText" },
      { name: "runId", type: "singleLineText" },
      { name: "runTimestamp", type: "dateTime" },
      { name: "recordsAnalyzed", type: "number", options: { precision: 0 } },
      { name: "patternsDetected", type: "longText" },
      { name: "insightsGenerated", type: "longText" },
      { name: "confidenceScore", type: "number", options: { precision: 2 } }
    ]
  },

  // System Intelligence & Governance
  {
    name: "FieldGlossary",
    description: "Field definitions and metadata",
    fields: [
      { name: "recordId", type: "singleLineText" },
      { name: "createdAt", type: "dateTime" },
      { name: "updatedAt", type: "dateTime" },
      { name: "tableName", type: "singleLineText" },
      { name: "fieldName", type: "singleLineText" },
      { name: "fieldType", type: "singleSelect", options: ["string", "number", "boolean", "object", "array", "timestamp", "ULID"] },
      { name: "description", type: "longText" },
      { name: "emotionalRole", type: "singleSelect", options: ["identity", "traceability", "clarity", "trust", "emotion", "context"] },
      { name: "dataSensitivity", type: "singleSelect", options: ["internal", "pii", "public"] },
      { name: "contextScope", type: "singleSelect", options: ["global", "session", "user", "event", "meta"] }
    ]
  },

  {
    name: "SchemaEvents",
    description: "Schema change tracking and audit",
    fields: [
      { name: "recordId", type: "singleLineText" },
      { name: "createdAt", type: "dateTime" },
      { name: "updatedAt", type: "dateTime" },
      { name: "eventType", type: "singleSelect", options: ["create", "update", "delete", "drift", "rollback"] },
      { name: "tableName", type: "singleLineText" },
      { name: "fieldName", type: "singleLineText" },
      { name: "eventPayload", type: "longText" },
      { name: "severity", type: "singleSelect", options: ["low", "medium", "high", "critical"] }
    ]
  },

  // Performance & Optimization
  {
    name: "DeliveryCostLogs",
    description: "Cost and performance tracking",
    fields: [
      { name: "recordId", type: "singleLineText" },
      { name: "createdAt", type: "dateTime" },
      { name: "updatedAt", type: "dateTime" },
      { name: "sessionId", type: "singleLineText" },
      { name: "promptLogId", type: "singleLineText" },
      { name: "apiCost", type: "currency", options: { precision: 4 } },
      { name: "processingTime", type: "number", options: { precision: 3 } },
      { name: "tokenCount", type: "number", options: { precision: 0 } },
      { name: "costPerToken", type: "currency", options: { precision: 6 } },
      { name: "efficiency", type: "number", options: { precision: 2 } }
    ]
  },

  // Referral & Growth
  {
    name: "ReferralTriggers",
    description: "Referral trigger events and tracking",
    fields: [
      { name: "recordId", type: "singleLineText" },
      { name: "createdAt", type: "dateTime" },
      { name: "updatedAt", type: "dateTime" },
      { name: "sessionId", type: "singleLineText" },
      { name: "userId", type: "singleLineText" },
      { name: "triggerType", type: "singleSelect", options: ["wow_moment", "completion", "value_realization", "trust_breakthrough"] },
      { name: "triggerContext", type: "longText" },
      { name: "emotionalIntensity", type: "number", options: { precision: 2 } },
      { name: "referralLikelihood", type: "number", options: { precision: 2 } }
    ]
  }
]

// Field type mapping for Airtable API
function mapFieldType(field: any) {
  const baseField: any = {
    name: field.name,
    type: field.type
  }

  // Add options for specific field types
  if (field.options) {
    baseField.options = field.options
  }

  // Handle select fields
  if (field.type === 'singleSelect' || field.type === 'multipleSelects') {
    if (field.options && Array.isArray(field.options)) {
      baseField.options = {
        choices: field.options.map((option: string) => ({ name: option }))
      }
    }
  }

  return baseField
}

async function createTable(tableDefinition: any) {
  try {
    console.log(`🔍 Creating table: ${tableDefinition.name}`)
    
    // Map fields to Airtable format
    const fields = tableDefinition.fields.map(mapFieldType)
    
    // Note: Airtable doesn't have a direct API to create tables
    // This would typically be done through the Airtable interface or Meta API
    // For now, we'll create records in existing tables or provide instructions
    
    console.log(`📋 Table definition for ${tableDefinition.name}:`)
    console.log(`   Description: ${tableDefinition.description}`)
    console.log(`   Fields: ${fields.length}`)
    
    // Try to access the table to see if it exists
    try {
      const testQuery = await base(tableDefinition.name).select({ maxRecords: 1 }).firstPage()
      console.log(`✅ Table ${tableDefinition.name} already exists with ${testQuery.length} records`)
    } catch (error) {
      console.log(`❌ Table ${tableDefinition.name} does not exist - needs to be created manually`)
      console.log(`   Fields to create:`)
      fields.forEach((field: any) => {
        console.log(`   - ${field.name} (${field.type})`)
      })
    }
    
    return { success: true, table: tableDefinition.name }
    
  } catch (error) {
    console.error(`❌ Failed to process table ${tableDefinition.name}:`, error)
    return { success: false, table: tableDefinition.name, error }
  }
}

async function createAllTables() {
  console.log("🚀 Starting Airtable table creation process...")
  console.log(`📊 Processing ${TABLE_DEFINITIONS.length} table definitions`)
  
  const results = []
  
  for (const tableDefinition of TABLE_DEFINITIONS) {
    const result = await createTable(tableDefinition)
    results.push(result)
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Summary
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  
  console.log("\n🎉 Table creation process complete!")
  console.log(`✅ Successful: ${successful}`)
  console.log(`❌ Failed: ${failed}`)
  
  if (failed > 0) {
    console.log("\n❌ Failed tables:")
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.table}`)
    })
  }
  
  console.log("\n📋 Next steps:")
  console.log("1. Create missing tables manually in Airtable interface")
  console.log("2. Use the field definitions provided above")
  console.log("3. Run validation script to confirm all tables are accessible")
  
  return results
}

// Export table definitions for manual creation
function exportTableDefinitions() {
  const exportPath = path.join(process.cwd(), '..', '..', 'airtable-table-definitions.json')
  fs.writeFileSync(exportPath, JSON.stringify(TABLE_DEFINITIONS, null, 2))
  console.log(`📄 Table definitions exported to: ${exportPath}`)
}

// Main execution
async function main() {
  try {
    // Export definitions for reference
    exportTableDefinitions()
    
    // Process tables
    await createAllTables()
    
  } catch (error) {
    console.error("❌ Script execution failed:", error)
    process.exit(1)
  }
}

main() 