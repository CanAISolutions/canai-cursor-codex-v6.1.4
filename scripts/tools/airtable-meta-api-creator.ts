// 🚀 airtable-meta-api-creator.ts
// Uses Airtable Meta API to programmatically create tables and fields
// This can actually create tables, unlike the regular Airtable API

import axios from "axios"
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

const AIRTABLE_PAT = process.env.AIRTABLE_PAT!
const BASE_ID = process.env.AIRTABLE_BASE_ID!

if (!AIRTABLE_PAT || !BASE_ID) {
  console.error("❌ Missing AIRTABLE_PAT or AIRTABLE_BASE_ID environment variables")
  console.log("💡 Note: Meta API requires Personal Access Token (PAT), not API Key")
  process.exit(1)
}

// Airtable Meta API configuration
const META_API_BASE_URL = 'https://api.airtable.com/v0/meta/bases'
const headers = {
  'Authorization': `Bearer ${AIRTABLE_PAT}`,
  'Content-Type': 'application/json'
}

// Enhanced table definitions with proper Meta API format
const TABLE_DEFINITIONS = [
  {
    name: "PromptLogs",
    description: "Core session tracking and analytics - the heart of CanAI's emotional intelligence",
    fields: [
      { name: "recordId", type: "singleLineText", description: "Primary key identifier" },
      { name: "createdAt", type: "dateTime", description: "Record creation timestamp" },
      { name: "updatedAt", type: "dateTime", description: "Last update timestamp" },
      { name: "sessionId", type: "singleLineText", description: "Session correlation ID" },
      { name: "userId", type: "singleLineText", description: "User identifier" },
      { 
        name: "promptType", 
        type: "singleSelect", 
        description: "Type of prompt executed",
        options: {
          choices: [
            { name: "ai_blueprint" },
            { name: "business_plan" },
            { name: "email_campaign" },
            { name: "site_audit" },
            { name: "social_content" },
            { name: "reverse_strategy" },
            { name: "ai_brand_identity" },
            { name: "profile_makeover" },
            { name: "blogblitz" },
            { name: "ad_amplify" }
          ]
        }
      },
      { name: "intent", type: "singleLineText", description: "User's stated intent" },
      { name: "inputs", type: "longText", description: "Raw user inputs JSON" },
      { name: "outputs", type: "longText", description: "Generated outputs" },
      { name: "trustFallbackUsed", type: "checkbox", description: "Whether fallback was triggered" },
      { name: "clarityIndex", type: "number", description: "Clarity score 0-10", options: { precision: 0 } },
      { name: "resonanceScore", type: "number", description: "Emotional resonance 0.0-1.0", options: { precision: 2 } },
      { name: "momentumScore", type: "number", description: "Session momentum 0.0-1.0", options: { precision: 2 } },
      { name: "deliveryCost", type: "number", description: "API cost in USD", options: { precision: 4 } },
      { name: "industry", type: "singleLineText", description: "User's industry" },
      { name: "audience", type: "singleLineText", description: "Target audience" },
      { name: "goal", type: "singleLineText", description: "User's goal" },
      { name: "tone", type: "singleLineText", description: "Desired tone" },
      { name: "customerContent", type: "longText", description: "Customer-specific content" },
      { name: "problemSolved", type: "longText", description: "Problem being solved" },
      { name: "differentiator", type: "longText", description: "Key differentiator" },
      { name: "founderBio", type: "longText", description: "Founder biography" },
      { name: "customerPain", type: "longText", description: "Customer pain points" },
      { name: "trustSignal", type: "longText", description: "Trust building elements" }
    ]
  },

  {
    name: "SparkSplitAnalytics",
    description: "Revolutionary trust transparency engine - CanAI's competitive moat",
    fields: [
      { name: "recordId", type: "singleLineText", description: "Primary key identifier" },
      { name: "createdAt", type: "dateTime", description: "Record creation timestamp" },
      { name: "updatedAt", type: "dateTime", description: "Last update timestamp" },
      { name: "sessionId", type: "singleLineText", description: "Session correlation ID" },
      { name: "promptLogId", type: "singleLineText", description: "Link to PromptLogs" },
      { name: "comparisonId", type: "singleLineText", description: "Unique comparison identifier" },
      { name: "sterileOutput", type: "longText", description: "Sterile AI output for comparison" },
      { name: "canaiOutput", type: "longText", description: "CanAI emotionally enriched output" },
      { 
        name: "userSelection", 
        type: "singleSelect", 
        description: "User's choice in comparison",
        options: {
          choices: [
            { name: "sterile" },
            { name: "canai" },
            { name: "both" },
            { name: "neither" },
            { name: "skip" }
          ]
        }
      },
      { name: "selectionTimestamp", type: "dateTime", description: "When user made selection" },
      { name: "timeToSelection", type: "number", description: "Time to decide in seconds", options: { precision: 2 } },
      { name: "trustDelta", type: "number", description: "Trust improvement score", options: { precision: 2 } },
      { name: "aweScore", type: "number", description: "Emotional compass: Awe", options: { precision: 2 } },
      { name: "ownershipScore", type: "number", description: "Emotional compass: Ownership", options: { precision: 2 } },
      { name: "wonderScore", type: "number", description: "Emotional compass: Wonder", options: { precision: 2 } },
      { name: "calmScore", type: "number", description: "Emotional compass: Calm", options: { precision: 2 } },
      { name: "powerScore", type: "number", description: "Emotional compass: Power", options: { precision: 2 } }
    ]
  },

  {
    name: "SessionAnalytics",
    description: "Session-level emotional intelligence and behavior tracking",
    fields: [
      { name: "recordId", type: "singleLineText", description: "Primary key identifier" },
      { name: "createdAt", type: "dateTime", description: "Record creation timestamp" },
      { name: "updatedAt", type: "dateTime", description: "Last update timestamp" },
      { name: "sessionId", type: "singleLineText", description: "Session correlation ID" },
      { name: "userId", type: "singleLineText", description: "User identifier" },
      { name: "sessionDuration", type: "number", description: "Session length in seconds", options: { precision: 0 } },
      { name: "promptCount", type: "number", description: "Number of prompts in session", options: { precision: 0 } },
      { name: "emotionalTrajectory", type: "longText", description: "Emotional journey mapping" },
      { 
        name: "frictionPoints", 
        type: "multipleSelects", 
        description: "Identified friction points",
        options: {
          choices: [
            { name: "loading_delay" },
            { name: "unclear_prompt" },
            { name: "unexpected_output" },
            { name: "navigation_confusion" },
            { name: "trust_hesitation" },
            { name: "emotional_disconnect" }
          ]
        }
      },
      { 
        name: "outcomeType", 
        type: "singleSelect", 
        description: "Session outcome",
        options: {
          choices: [
            { name: "completed" },
            { name: "abandoned" },
            { name: "converted" },
            { name: "referred" },
            { name: "trust_breakthrough" }
          ]
        }
      },
      { name: "trustScore", type: "number", description: "Trust level 0.0-5.0", options: { precision: 2 } },
      { name: "emotionalDepth", type: "number", description: "Emotional engagement depth", options: { precision: 2 } },
      { name: "sessionMomentum", type: "number", description: "Session momentum score", options: { precision: 2 } }
    ]
  },

  {
    name: "UserContext",
    description: "Deep user intelligence and emotional profiling",
    fields: [
      { name: "recordId", type: "singleLineText", description: "Primary key identifier" },
      { name: "createdAt", type: "dateTime", description: "Record creation timestamp" },
      { name: "updatedAt", type: "dateTime", description: "Last update timestamp" },
      { name: "userId", type: "singleLineText", description: "User identifier" },
      { name: "userEmail", type: "email", description: "User email address" },
      { 
        name: "industryFocus", 
        type: "multipleSelects", 
        description: "User's industry interests",
        options: {
          choices: [
            { name: "SaaS" },
            { name: "E-commerce" },
            { name: "Consulting" },
            { name: "Healthcare" },
            { name: "Education" },
            { name: "Finance" },
            { name: "Real Estate" },
            { name: "Manufacturing" },
            { name: "Creative Services" },
            { name: "Non-profit" }
          ]
        }
      },
      { 
        name: "communicationStyle", 
        type: "singleSelect", 
        description: "Preferred communication approach",
        options: {
          choices: [
            { name: "direct" },
            { name: "collaborative" },
            { name: "analytical" },
            { name: "creative" },
            { name: "empathetic" },
            { name: "results_focused" }
          ]
        }
      },
      { name: "emotionalProfile", type: "longText", description: "Emotional intelligence profile" },
      { 
        name: "preferredTone", 
        type: "singleSelect", 
        description: "Preferred communication tone",
        options: {
          choices: [
            { name: "professional" },
            { name: "friendly" },
            { name: "authoritative" },
            { name: "empowering" },
            { name: "conversational" },
            { name: "inspiring" }
          ]
        }
      },
      { name: "culturalContext", type: "singleLineText", description: "Cultural background context" },
      { 
        name: "cognitiveTraits", 
        type: "multipleSelects", 
        description: "Cognitive processing preferences",
        options: {
          choices: [
            { name: "detail_oriented" },
            { name: "big_picture" },
            { name: "analytical" },
            { name: "intuitive" },
            { name: "systematic" },
            { name: "creative" },
            { name: "logical" },
            { name: "emotional" }
          ]
        }
      }
    ]
  },

  {
    name: "OutputGoldmine",
    description: "Reusable intelligence and compound value creation",
    fields: [
      { name: "recordId", type: "singleLineText", description: "Primary key identifier" },
      { name: "createdAt", type: "dateTime", description: "Record creation timestamp" },
      { name: "updatedAt", type: "dateTime", description: "Last update timestamp" },
      { name: "outputHash", type: "singleLineText", description: "Content hash for deduplication" },
      { name: "promptType", type: "singleLineText", description: "Source prompt type" },
      { name: "outputContent", type: "longText", description: "Reusable output content" },
      { 
        name: "industryCluster", 
        type: "singleSelect", 
        description: "Industry categorization",
        options: {
          choices: [
            { name: "SaaS" },
            { name: "E-commerce" },
            { name: "Consulting" },
            { name: "Healthcare" },
            { name: "Education" },
            { name: "Finance" },
            { name: "Creative" },
            { name: "B2B Services" },
            { name: "Consumer Products" },
            { name: "Technology" }
          ]
        }
      },
      { name: "reusePotential", type: "number", description: "Reusability score 0-10", options: { precision: 2 } },
      { name: "compoundValue", type: "number", description: "Compound intelligence value", options: { precision: 2 } },
      { name: "emotionalResonance", type: "number", description: "Emotional impact score", options: { precision: 2 } },
      { name: "usageCount", type: "number", description: "Times reused", options: { precision: 0 } },
      { name: "monetizationPotential", type: "number", description: "Revenue potential score", options: { precision: 2 } }
    ]
  }
]

// Create table using Meta API
async function createTableWithMetaAPI(tableDefinition: any) {
  try {
    console.log(`🚀 Creating table: ${tableDefinition.name}`)
    
    const payload = {
      name: tableDefinition.name,
      description: tableDefinition.description,
      fields: tableDefinition.fields
    }
    
    const response = await axios.post(
      `${META_API_BASE_URL}/${BASE_ID}/tables`,
      payload,
      { headers }
    )
    
    console.log(`✅ Successfully created table: ${tableDefinition.name}`)
    console.log(`   Table ID: ${response.data.id}`)
    console.log(`   Fields created: ${response.data.fields.length}`)
    
    return { success: true, table: tableDefinition.name, data: response.data }
    
  } catch (error: any) {
    if (error.response) {
      console.error(`❌ Failed to create table ${tableDefinition.name}:`)
      console.error(`   Status: ${error.response.status}`)
      console.error(`   Error: ${error.response.data.error?.message || error.response.data}`)
      
      // Check if table already exists
      if (error.response.status === 422 && error.response.data.error?.message?.includes('already exists')) {
        console.log(`ℹ️  Table ${tableDefinition.name} already exists`)
        return { success: true, table: tableDefinition.name, exists: true }
      }
    } else {
      console.error(`❌ Network error creating table ${tableDefinition.name}:`, error.message)
    }
    
    return { success: false, table: tableDefinition.name, error }
  }
}

// Check if base exists and get current tables
async function checkBaseInfo() {
  try {
    console.log("🔍 Checking base information...")
    
    const response = await axios.get(
      `${META_API_BASE_URL}/${BASE_ID}`,
      { headers }
    )
    
    console.log(`✅ Base found: ${response.data.name}`)
    console.log(`   Current tables: ${response.data.tables.length}`)
    
    response.data.tables.forEach((table: any) => {
      console.log(`   - ${table.name} (${table.fields.length} fields)`)
    })
    
    return response.data
    
  } catch (error: any) {
    if (error.response) {
      console.error(`❌ Failed to access base:`)
      console.error(`   Status: ${error.response.status}`)
      console.error(`   Error: ${error.response.data.error?.message || error.response.data}`)
    } else {
      console.error(`❌ Network error:`, error.message)
    }
    
    throw error
  }
}

async function createAllTablesWithMetaAPI() {
  console.log("🚀 Starting Airtable Meta API table creation...")
  console.log(`📊 Processing ${TABLE_DEFINITIONS.length} priority tables`)
  
  try {
    // Check base info first
    await checkBaseInfo()
    
    const results = []
    
    for (const tableDefinition of TABLE_DEFINITIONS) {
      const result = await createTableWithMetaAPI(tableDefinition)
      results.push(result)
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    // Summary
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length
    const existing = results.filter(r => r.exists).length
    
    console.log("\n🎉 Meta API table creation complete!")
    console.log(`✅ Successfully created: ${successful - existing}`)
    console.log(`ℹ️  Already existed: ${existing}`)
    console.log(`❌ Failed: ${failed}`)
    
    if (failed > 0) {
      console.log("\n❌ Failed tables:")
      results.filter(r => !r.success).forEach(r => {
        console.log(`   - ${r.table}`)
      })
    }
    
    console.log("\n🎯 Next steps:")
    console.log("1. Run connection test to validate all tables")
    console.log("2. Begin data collection with SparkSplit integration")
    console.log("3. Start building remaining emotional sovereignty components")
    
    return results
    
  } catch (error) {
    console.error("❌ Meta API creation process failed:", error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    await createAllTablesWithMetaAPI()
  } catch (error) {
    console.error("❌ Script execution failed:", error)
    process.exit(1)
  }
}

main() 