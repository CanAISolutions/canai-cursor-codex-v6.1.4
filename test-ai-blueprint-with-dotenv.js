/**
 * AI Blueprint Production Test with Proper .env Loading
 * This version correctly loads environment variables from .env file
 */

// ✅ CRITICAL: Load .env file FIRST before anything else
require('dotenv').config();

const OpenAI = require('openai');
const fs = require('fs');

console.log('🔧 Environment Setup Check:');
console.log(`📁 Working directory: ${process.cwd()}`);
console.log(`🗂️  .env file exists: ${fs.existsSync('.env') ? 'YES' : 'NO'}`);
console.log(`🔑 API key loaded: ${process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 7)}...` : 'NOT FOUND'}`);

// Now access the environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('\n❌ OPENAI_API_KEY not found in environment variables');
  console.log('📝 Make sure your .env file contains:');
  console.log('   OPENAI_API_KEY=sk-proj-your-actual-key-here');
  process.exit(1);
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  timeout: 30000,
});

// Test scenario
const testInput = {
  businessName: "TechCorp AI Solutions",
  targetAudience: "Software developers and tech teams",
  primaryGoal: "Build AI-powered code review and optimization tools",
  competitiveContext: "Competing with GitHub Copilot and CodeWhisperer",
  brandVoice: "technical",
  resourceConstraints: "$100K budget, 6-month timeline, 5-person team",
  currentStatus: "Basic code analysis tools in use",
  aiSolution: "AI-powered code review and optimization platform",
  mvpFeatures: "Code analysis, security scanning, performance optimization suggestions",
  successMetrics: "30d: MVP; 60d: Beta users; 90d: Production launch",
  linkedPrompts: ["business-plan"],
  minimumViableExecution: "Use OpenAI API for code analysis, GitHub integration, cloud deployment"
};

async function testOpenAIWithDotenv() {
  console.log('\n🧪 Starting OpenAI API Test with .env Loading...\n');
  
  try {
    // Step 1: Test basic connectivity
    console.log('🔍 Testing OpenAI API connectivity...');
    const testResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5
    });
    
    console.log('✅ OpenAI API connection successful!');
    console.log(`🆔 Request ID: ${testResponse.id}`);
    
    // Step 2: Generate AI Blueprint
    console.log('\n🚀 Generating AI Blueprint...');
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an AI strategy consultant. Create detailed AI blueprints in JSON format.'
        },
        {
          role: 'user',
          content: `Create an AI Blueprint for: ${JSON.stringify(testInput, null, 2)}

Return a JSON response with this structure:
{
  "blueprint": {
    "architecture": "Architecture name",
    "components": ["Component 1", "Component 2", "Component 3"],
    "integrations": ["Integration 1", "Integration 2", "Integration 3"]
  },
  "recommendations": ["Rec 1", "Rec 2", "Rec 3"],
  "timeline": ["Phase 1", "Phase 2", "Phase 3"],
  "risks": ["Risk 1", "Risk 2", "Risk 3"]
}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const result = response.choices[0].message.content;
    console.log('✅ AI Blueprint generated successfully!');
    console.log(`📏 Response length: ${result.length} characters`);
    console.log(`💰 Tokens used: ${response.usage?.total_tokens || 'N/A'}`);
    
    // Try to parse as JSON
    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
      console.log('✅ Response is valid JSON');
    } catch {
      console.log('⚠️  Response is not JSON, using as text');
      parsedResult = { content: result };
    }
    
    // Save results
    const resultsFile = `ai-blueprint-dotenv-test-${Date.now()}.json`;
    const fullResults = {
      success: true,
      timestamp: new Date().toISOString(),
      input: testInput,
      apiResponse: {
        id: response.id,
        model: response.model,
        usage: response.usage,
        content: result
      },
      parsedOutput: parsedResult
    };
    
    fs.writeFileSync(resultsFile, JSON.stringify(fullResults, null, 2));
    
    console.log('\n🎉 TEST COMPLETED SUCCESSFULLY!');
    console.log(`📄 Results saved to: ${resultsFile}`);
    console.log('✅ Your .env file is loading correctly');
    console.log('✅ OpenAI API integration is working');
    
    return fullResults;
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    
    if (error.code === 'invalid_api_key') {
      console.log('🔧 Your API key appears to be invalid');
      console.log('📝 Please check your .env file contains the correct key');
    } else if (error.code === 'insufficient_quota') {
      console.log('💳 Your OpenAI account appears to have insufficient credits');
    } else {
      console.log('🔧 Error details:', error);
    }
    
    const errorFile = `ai-blueprint-error-${Date.now()}.json`;
    fs.writeFileSync(errorFile, JSON.stringify({
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    }, null, 2));
    
    console.log(`📄 Error details saved to: ${errorFile}`);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testOpenAIWithDotenv()
    .then(() => {
      console.log('\n🎯 All tests passed!');
      process.exit(0);
    })
    .catch((error) => {
      console.log('\n💥 Test failed!');
      process.exit(1);
    });
}

module.exports = { testOpenAIWithDotenv }; 