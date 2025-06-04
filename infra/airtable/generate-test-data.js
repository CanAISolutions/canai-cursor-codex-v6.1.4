/**
 * DEPRECATED: This script references deleted airtable-table-definitions.json
 * Legacy table definitions file has been deleted as part of 36→18 table transformation
 * Use direct Airtable API integration for 18-table architecture instead
 * 
 * Test Data Generator for Airtable Tables
 * 
 * Generates realistic test data for Airtable tables based on table definitions.
 * Codex v6.1.4 compliant with production-ready error handling and logging.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const TABLE_DEFINITIONS_PATH = path.join(__dirname, '../../airtable-table-definitions.json');
const OUTPUT_DIR = path.join(__dirname, 'tables');
const RECORDS_PER_TABLE = 5; // Number of test records to generate per table

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Utility to generate a deterministic ULID-like ID
function generateId(prefix = '', index = 0) {
  const timestamp = Date.now().toString(36);
  const randomPart = crypto.createHash('md5').update(`${prefix}${index}${timestamp}`).digest('hex').substring(0, 8);
  return `${prefix}${timestamp}${randomPart}`;
}

// Utility to generate ISO timestamp with slight variations
function generateTimestamp(offsetMinutes = 0) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + offsetMinutes);
  return date.toISOString();
}

// Load table definitions
function loadTableDefinitions() {
  try {
    return JSON.parse(fs.readFileSync(TABLE_DEFINITIONS_PATH, 'utf8'));
  } catch (error) {
    console.error(`❌ Error loading table definitions: ${error.message}`);
    process.exit(1);
  }
}

// Generate sample data for a field based on its type and name
function generateFieldValue(field, recordIndex, tableContext = {}) {
  const { name, type } = field;
  
  // Special case handling for common fields
  if (name === 'recordId') {
    return generateId('record_', recordIndex);
  }
  
  if (name === 'createdAt') {
    return generateTimestamp(-recordIndex * 10); // Older records created earlier
  }
  
  if (name === 'updatedAt') {
    return generateTimestamp(-recordIndex * 5); // Some records updated more recently
  }
  
  if (name === 'sessionId') {
    return tableContext.sessionIds?.[recordIndex % tableContext.sessionIds.length] || 
           generateId('session_', recordIndex);
  }
  
  if (name === 'userId') {
    return tableContext.userIds?.[recordIndex % tableContext.userIds.length] || 
           generateId('user_', recordIndex);
  }
  
  if (name === 'promptLogId') {
    return tableContext.promptLogIds?.[recordIndex % tableContext.promptLogIds.length] || 
           generateId('promptlog_', recordIndex);
  }
  
  // Generate values based on field type
  switch (type) {
    case 'string':
      if (name === 'promptType') {
        const promptTypes = ['business_plan', 'email_campaign', 'social_content', 'site_audit', 
                           'reverse_strategy', 'ai_brand_identity', 'profile_makeover', 
                           'blogblitz', 'ad_amplify', 'ai_blueprint'];
        return promptTypes[recordIndex % promptTypes.length];
      }
      
      if (name === 'intent') {
        const intents = [
          'Launch coffee shop online presence with bold branding',
          'Create email sequence for product launch',
          'Develop social media strategy for fitness brand',
          'Audit website for conversion optimization',
          'Create comprehensive business plan for startup'
        ];
        return intents[recordIndex % intents.length];
      }
      
      if (name === 'industry') {
        const industries = ['tech', 'health', 'finance', 'education', 'retail', 'hospitality'];
        return industries[recordIndex % industries.length];
      }
      
      if (name === 'tone') {
        const tones = ['professional', 'friendly', 'authoritative', 'playful', 'bold'];
        return tones[recordIndex % tones.length];
      }
      
      if (name === 'modelUsed') {
        const models = ['gpt-4o', 'claude-4-sonnet', 'gpt-4o-mini'];
        return models[recordIndex % models.length];
      }
      
      if (name === 'behavioralSignals') {
        const signals = [
          'engagement_high,trust_building',
          'hesitation,uncertainty,reread',
          'confidence,fast_decision',
          'consideration,thoughtful_pause',
          'enthusiasm,excitement'
        ];
        return signals[recordIndex % signals.length];
      }
      
      if (name === 'winningVariant') {
        return recordIndex % 3 === 0 ? 'sterile' : 'enhanced'; // Biased toward enhanced
      }
      
      // Default string value
      return `Sample ${name} ${recordIndex + 1}`;
      
    case 'number':
      if (name === 'tokensUsed') {
        return 1000 + (recordIndex * 250); // Different token counts
      }
      
      if (name === 'revisionCount') {
        return recordIndex % 3; // 0, 1, or 2 revisions
      }
      
      if (name.includes('Score') || name.includes('Delta')) {
        // Generate a score between 0 and 1 for most metrics
        const baseScore = 0.65 + (Math.random() * 0.3); // Between 0.65 and 0.95
        
        // Adjust based on name
        if (name === 'trustScore') {
          return (3.5 + (baseScore * 1.5)).toFixed(2); // 3.5 to 5.0
        }
        
        if (name === 'confidenceLevel') {
          return (0.85 + (Math.random() * 0.15)).toFixed(2); // 0.85 to 1.0
        }
        
        if (name.includes('improvement') || name.includes('Lift')) {
          return (baseScore * 0.3).toFixed(2); // 0.195 to 0.285 (19.5% to 28.5%)
        }
        
        return baseScore.toFixed(2); // Standard score
      }
      
      if (name === 'deliveryCost') {
        return (0.002 + (Math.random() * 0.006)).toFixed(4); // $0.002 to $0.008
      }
      
      // Default number
      return (Math.random() * 10).toFixed(2);
      
    case 'boolean':
      if (name === 'marketingReady') {
        return recordIndex % 4 !== 0 ? 'true' : 'false'; // 75% ready
      }
      
      // Default boolean
      return recordIndex % 2 === 0 ? 'true' : 'false';
      
    case 'datetime':
      // Already handled common datetime fields above
      return generateTimestamp(-recordIndex * 2);
      
    case 'json':
      if (name === 'inputs') {
        const inputSets = [
          { industry: 'coffee', tone: 'bold', audience: 'millennials' },
          { industry: 'tech', tone: 'professional', audience: 'businesses' },
          { industry: 'fitness', tone: 'motivational', audience: 'health-conscious' },
          { industry: 'education', tone: 'friendly', audience: 'students' },
          { industry: 'finance', tone: 'authoritative', audience: 'investors' }
        ];
        return JSON.stringify(inputSets[recordIndex % inputSets.length]);
      }
      
      if (name === 'auditTrail') {
        return JSON.stringify({
          createdBy: 'system',
          events: [
            { type: 'creation', timestamp: generateTimestamp(-recordIndex * 10) },
            { type: 'processing', timestamp: generateTimestamp(-recordIndex * 9) },
            { type: 'completion', timestamp: generateTimestamp(-recordIndex * 8) }
          ]
        });
      }
      
      // Default JSON
      return JSON.stringify({ sampleKey: `value${recordIndex}` });
      
    case 'longtext':
      if (name === 'outputs') {
        const outputs = [
          "# Executive Summary\n\nBold Brew is a specialty coffee shop concept targeting young professionals in urban areas. With a focus on ethically sourced beans and innovative brewing methods, Bold Brew will stand out in the competitive coffee market through its distinctive brand voice and customer experience.\n\n## Market Opportunity\n\nThe specialty coffee market continues to grow at 10% annually, with consumers increasingly seeking premium experiences and sustainable options.",
          "# Email Campaign: Product Launch Sequence\n\nEmail 1: Teaser (3 days before launch)\nSubject: Something Bold is Coming Your Way\n\nBody: We've been brewing something special just for you. In just 3 days, experience coffee like never before. Stay tuned.\n\nEmail 2: Launch Day\nSubject: BOLD BREW IS HERE – Elevate Your Coffee Experience\n\nBody: Today's the day coffee lovers! Bold Brew has officially launched with our signature roasts that will transform your morning routine.",
          "# Social Media Content Calendar\n\nWeek 1: Brand Introduction\nPost 1: Meet Bold Brew – Where Coffee Meets Courage [Image: Logo reveal]\nPost 2: Our Story – From Garage Roasting to Your Cup [Image: Founder with coffee beans]\nPost 3: Bold Flavors, Bold Mission – How We're Changing Coffee Culture [Carousel: Bean sourcing process]",
          "# Website Audit Results\n\n## Critical Issues\n1. Homepage load time exceeds 4.2 seconds on mobile devices\n2. Checkout process requires 5 steps (industry standard is 3)\n3. Product images are inconsistent in size and quality\n\n## Recommendations\n1. Implement image compression and lazy loading\n2. Streamline checkout to 3 steps maximum\n3. Standardize product photography guidelines",
          "# Comprehensive Business Plan\n\n## Executive Summary\nBold Brew will revolutionize the coffee experience through its commitment to ethically sourced beans, innovative brewing techniques, and immersive customer experience. With projected first-year revenue of $420,000 and a growth rate of 25% annually, Bold Brew represents an exciting opportunity in the specialty beverage market."
        ];
        return outputs[recordIndex % outputs.length];
      }
      
      if (name === 'sterileOutput' || name === 'enhancedOutput') {
        const sterileOutputs = [
          "Executive Summary: The business plan outlines a coffee shop focused on quality beans and efficient service. Market analysis shows demand for specialty coffee. The business model includes in-store and online sales. Financial projections indicate profitability by month 8.",
          "Email sequence for product launch including announcement, features, and early-bird offer. The three emails will be sent over a 5-day period with appropriate calls to action and product specifications.",
          "Social media strategy for increasing brand awareness and engagement. Posts will focus on product features, customer testimonials, and industry news. Recommended platforms: Instagram, Facebook, and LinkedIn."
        ];
        
        const enhancedOutputs = [
          "# BOLD BREW: Where Coffee Meets Courage\n\nExecutive Summary: Bold Brew isn't just another coffee shop—it's a revolution in a cup. We're creating a sanctuary for the ambitious, where ethically-sourced beans meet fearless innovation. Our market analysis reveals a growing tribe of coffee enthusiasts hungry for authenticity and connection. With our dual-channel approach (immersive in-store experience + convenient online ordering), we're projecting profitability within 6 months, with 30% of revenue from our signature subscription 'Courage in a Cup.'\n\nThis isn't just business. It's personal.",
          "# TRANSFORM Launch: Emails That Ignite Action\n\nEmail 1: \"The Wait Is Almost Over\" (Subject)\nBody teaser: \"What if your [pain point] disappeared tomorrow? In 48 hours, we're revealing something that will forever change how you [key benefit]. Are you ready to transform?\"\n\nEmail 2: \"INTRODUCING TRANSFORM – Your [Benefit] Revolution\" (Subject)\nOpens with personal story of transformation, reveals product with emotional before/after scenarios, includes early-bird offer that creates urgency through limited spots (not just time).\n\nEmail 3: \"[First Name], This Is Your Moment\" (Subject)\nShares unexpected customer story that resonates deeply with audience identity, addresses final objection through authentic testimonial, and closes with a soul-stirring call to brave action.",
          "# ELEVATE: Social Strategy That Creates Belonging\n\nThis isn't just content—it's connection. Your social presence will transform from brand monologue to community heartbeat.\n\nPlatform Strategy:\n• Instagram: Visual storytelling that captures the FEELING of achievement your product enables\n• Facebook: Community building through customer transformation stories\n• LinkedIn: Thought leadership that positions you as the emotional pioneer in your space\n\nKey Content Pillars:\n1. IDENTITY posts: Content that makes followers feel seen and understood (\"This is SO me\")\n2. ASPIRATION posts: Glimpses of the emotional destination your product enables\n3. BELONGING posts: Community celebrations that create tribal connection\n\nEach post crafted with your unique voice fingerprint: Bold yet vulnerable, authoritative yet relatable."
        ];
        
        return name === 'sterileOutput' 
          ? sterileOutputs[recordIndex % sterileOutputs.length]
          : enhancedOutputs[recordIndex % enhancedOutputs.length];
      }
      
      // Default long text
      return `Sample ${name} content for test record ${recordIndex + 1}. This is a longer text field that contains multiple sentences to simulate realistic content. The purpose is to provide enough sample text to test handling of multi-line content in Airtable and related systems.`;
      
    case 'ULID':
      // Already handled 'recordId' above
      return generateId(`${name}_`, recordIndex);
      
    default:
      return `Unsupported type: ${type}`;
  }
}

// Generate test data for a table
function generateTableTestData(table) {
  try {
    // Create context for relational data
    const tableContext = {
      sessionIds: Array.from({ length: RECORDS_PER_TABLE }, (_, i) => generateId('session_', i)),
      userIds: Array.from({ length: RECORDS_PER_TABLE }, (_, i) => generateId('user_', i)),
      promptLogIds: Array.from({ length: RECORDS_PER_TABLE }, (_, i) => generateId('promptlog_', i))
    };
    
    // Generate records
    const records = Array.from({ length: RECORDS_PER_TABLE }, (_, recordIndex) => {
      const record = {};
      
      table.fields.forEach(field => {
        record[field.name] = generateFieldValue(field, recordIndex, tableContext);
      });
      
      return record;
    });
    
    // Create output file
    const outputFile = path.join(OUTPUT_DIR, `${table.name}.test.json`);
    fs.writeFileSync(outputFile, JSON.stringify({ records }, null, 2), 'utf8');
    
    console.log(`✅ Generated test data for ${table.name} (${records.length} records)`);
    
    return {
      tableName: table.name,
      recordCount: records.length,
      success: true
    };
  } catch (error) {
    console.error(`❌ Error generating test data for ${table.name}: ${error.message}`);
    return {
      tableName: table.name,
      recordCount: 0,
      success: false,
      error: error.message
    };
  }
}

// Main execution
function main() {
  console.log(`🔍 Starting test data generation...`);
  
  // Load table definitions
  const tableDefinitions = loadTableDefinitions();
  
  if (!tableDefinitions || !Array.isArray(tableDefinitions) || tableDefinitions.length === 0) {
    console.error('❌ No table definitions found or invalid format');
    process.exit(1);
  }
  
  console.log(`📊 Found ${tableDefinitions.length} table definitions`);
  
  // Generate test data for each table
  const results = tableDefinitions.map(generateTableTestData);
  
  // Calculate summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalRecords = results.reduce((sum, r) => sum + r.recordCount, 0);
  
  // Print summary
  console.log(`\n🎉 Test Data Generation Summary:`);
  console.log(`✅ Successfully generated data for ${successful} tables`);
  console.log(`📊 Total test records created: ${totalRecords}`);
  
  if (failed > 0) {
    console.log(`❌ Failed to generate data for ${failed} tables`);
    results.filter(r => !r.success).forEach(failure => {
      console.log(`  - ${failure.tableName}: ${failure.error}`);
    });
  }
  
  console.log(`\n📝 Test data files saved to ${OUTPUT_DIR}`);
}

// Execute main function with error handling
try {
  main();
} catch (error) {
  console.error(`❌ Unhandled error: ${error.message}`);
  process.exit(1);
} 