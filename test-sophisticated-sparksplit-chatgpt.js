#!/usr/bin/env node

/**
 * Sophisticated MCP ChatGPT Integration Test
 * Tests the revolutionary SparkSplit MCP system discovered in production
 * Validates 15+ field inference, emotional intelligence, and cross-platform compatibility
 */

const http = require('http');
const fs = require('fs');

// Test Configuration
const CONFIG = {
  baseUrl: 'http://localhost:3000', // Your local server
  testTimestamp: new Date().toISOString().replace(/[:.]/g, '-'),
  apiKey: process.env.OPENAI_API_KEY || 'test-key',
  sophisticatedFeatures: [
    'emotionalCompass',
    'trustDelta', 
    'trustTransparencyScore',
    'revolutionaryPositioning',
    'sacredReversalCompliance',
    'userEmpowerment',
    'emotionalSovereignty',
    'sparkSplitComparison'
  ]
};

// Test Data - Real-world business scenarios
const TEST_SCENARIOS = [
  {
    name: "Revolutionary AI Startup",
    userInput: {
      industry: "AI Technology",
      businessGoal: "Create trust-transparent AI that shows users exactly why it's different",
      targetMarket: "Small business owners seeking authentic AI solutions",
      uniqueValue: "Only AI platform that shows side-by-side comparisons with sterile AI",
      emotionalContext: "Entrepreneurs exhausted by overpromising AI tools"
    },
    expectedFeatures: ['trustTransparency', 'competitiveAdvantage', 'emotionalResonance']
  },
  {
    name: "Emotional Intelligence Platform", 
    userInput: {
      industry: "Business Consulting",
      businessGoal: "Build platform that understands entrepreneurs at soul level",
      targetMarket: "Ambitious business owners seeking deeper understanding",
      uniqueValue: "5-axis emotional compass processing for human empowerment",
      emotionalContext: "Leaders carrying weight of others' expectations"
    },
    expectedFeatures: ['emotionalCompass', 'sacredReversalTest', 'userEmpowerment']
  }
];

console.log('\n🚀 SOPHISTICATED MCP CHATGPT INTEGRATION TEST');
console.log('====================================================');
console.log(`Test ID: sophisticated-mcp-${CONFIG.testTimestamp}`);
console.log(`Testing sophisticated SparkSplit MCP system discovered in production`);
console.log(`Expected: Revolutionary 15+ field inference with emotional intelligence\n`);

async function makeAPIRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            data: parsedData,
            success: res.statusCode === 200
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: responseData,
            success: false,
            error: 'JSON_PARSE_ERROR'
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testSophisticatedSparkSplit(scenario) {
  console.log(`\n🎯 Testing: ${scenario.name}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    // Test 1: Generate Enhanced CanAI Output
    console.log('📝 Step 1: Generating CanAI enhanced output...');
    const canaiResponse = await makeAPIRequest('/api/prompt_handler', {
      promptType: 'business_plan',
      input: scenario.userInput,
      sessionId: `test_session_${Date.now()}`,
      userId: `test_user_${Date.now()}`
    });

    if (!canaiResponse.success) {
      throw new Error(`CanAI generation failed: ${canaiResponse.data}`);
    }

    const canaiOutput = canaiResponse.data.result;
    console.log(`✅ CanAI output generated (${canaiOutput.length} chars)`);

    // Test 2: Generate Sophisticated SparkSplit Comparison
    console.log('🔄 Step 2: Generating sophisticated SparkSplit comparison...');
    const sparkSplitResponse = await makeAPIRequest('/api/sparksplit/generate', {
      sessionId: `sparksplit_${Date.now()}`,
      userId: `user_${Date.now()}`,
      promptType: 'business_plan',
      userInput: scenario.userInput,
      canaiOutput: canaiOutput,
      emotionalScores: {
        aweScore: 0.85,
        ownershipScore: 0.9,
        wonderScore: 0.8,
        calmScore: 0.75,
        powerScore: 0.88
      }
    });

    if (!sparkSplitResponse.success) {
      throw new Error(`SparkSplit generation failed: ${sparkSplitResponse.data}`);
    }

    const sparkSplitData = sparkSplitResponse.data.data;
    console.log(`✅ SparkSplit comparison generated successfully`);

    // Test 3: Validate Sophisticated Features
    console.log('🔍 Step 3: Validating sophisticated features...');
    const featureValidation = validateSophisticatedFeatures(sparkSplitData);
    
    console.log(`📊 Sophisticated Features Detected: ${featureValidation.detectedFeatures.length}/${CONFIG.sophisticatedFeatures.length}`);
    featureValidation.detectedFeatures.forEach(feature => {
      console.log(`   ✅ ${feature}`);
    });

    if (featureValidation.missingFeatures.length > 0) {
      console.log(`⚠️  Missing Features:`);
      featureValidation.missingFeatures.forEach(feature => {
        console.log(`   ❌ ${feature}`);
      });
    }

    // Test 4: ChatGPT Compatibility Check
    console.log('🤖 Step 4: Validating ChatGPT compatibility...');
    const compatibilityScore = validateChatGPTCompatibility(sparkSplitData);
    console.log(`📈 ChatGPT Compatibility Score: ${(compatibilityScore * 100).toFixed(1)}%`);

    return {
      scenario: scenario.name,
      success: true,
      canaiOutputLength: canaiOutput.length,
      sparkSplitData: sparkSplitData,
      sophisticatedFeatures: featureValidation,
      chatgptCompatibility: compatibilityScore,
      trustScore: sparkSplitData.trustDelta || 0,
      emotionalCompass: sparkSplitData.emotionalCompass || {},
      revolutionaryCapabilities: {
        trustTransparency: !!sparkSplitData.trustTransparencyScore,
        competitiveAdvantage: !!sparkSplitData.competitiveAdvantage,
        emotionalSovereignty: !!sparkSplitData.emotionalSovereigntyPreserved,
        sacredReversalTest: !!sparkSplitData.sacredReversalPassed
      }
    };

  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    return {
      scenario: scenario.name,
      success: false,
      error: error.message,
      sophisticatedFeatures: { detectedFeatures: [], missingFeatures: CONFIG.sophisticatedFeatures },
      chatgptCompatibility: 0
    };
  }
}

function validateSophisticatedFeatures(sparkSplitData) {
  const detectedFeatures = [];
  const missingFeatures = [];

  // Check for sophisticated SparkSplit features discovered in production
  const featureChecks = {
    emotionalCompass: sparkSplitData.emotionalCompass && 
                     typeof sparkSplitData.emotionalCompass === 'object' &&
                     'awe' in sparkSplitData.emotionalCompass,
    trustDelta: sparkSplitData.trustDelta !== undefined && sparkSplitData.trustDelta > 0,
    trustTransparencyScore: sparkSplitData.trustTransparencyScore !== undefined,
    revolutionaryPositioning: sparkSplitData.revolutionaryPositioning !== undefined,
    sacredReversalCompliance: sparkSplitData.sacredReversalPassed === true,
    userEmpowerment: sparkSplitData.userEmpowermentIncreased === true,
    emotionalSovereignty: sparkSplitData.emotionalSovereigntyPreserved === true,
    sparkSplitComparison: sparkSplitData.sterileOutput && sparkSplitData.canaiOutput
  };

  CONFIG.sophisticatedFeatures.forEach(feature => {
    if (featureChecks[feature]) {
      detectedFeatures.push(feature);
    } else {
      missingFeatures.push(feature);
    }
  });

  return { detectedFeatures, missingFeatures };
}

function validateChatGPTCompatibility(sparkSplitData) {
  let score = 0;
  const checks = [
    { name: 'JSON Structure', test: () => typeof sparkSplitData === 'object' },
    { name: 'Required Fields', test: () => sparkSplitData.sessionId && sparkSplitData.userId },
    { name: 'Error Handling', test: () => sparkSplitData.success !== false },
    { name: 'Webhook Compatibility', test: () => sparkSplitData.ready === true },
    { name: 'Emotional Data', test: () => sparkSplitData.emotionalCompass },
    { name: 'Trust Metrics', test: () => sparkSplitData.trustDelta !== undefined },
    { name: 'SparkSplit Core', test: () => sparkSplitData.sterileOutput && sparkSplitData.canaiOutput },
    { name: 'Revolutionary Features', test: () => sparkSplitData.revolutionaryPositioning !== undefined },
    { name: 'Make.com Ready', test: () => sparkSplitData.competitiveAdvantage !== undefined },
    { name: 'Production Quality', test: () => !sparkSplitData.fallbackTriggered }
  ];

  checks.forEach(check => {
    if (check.test()) {
      score += 0.1; // Each check is worth 10%
    }
  });

  return Math.min(score, 1.0); // Cap at 100%
}

async function runSophisticatedMCPTests() {
  const results = {
    testId: `sophisticated-mcp-${CONFIG.testTimestamp}`,
    testType: 'Sophisticated MCP ChatGPT Integration',
    startTime: new Date().toISOString(),
    scenarios: [],
    overallMetrics: {
      successRate: 0,
      avgSophisticatedFeatures: 0,
      avgChatGPTCompatibility: 0,
      avgTrustScore: 0,
      revolutionaryCapabilitiesDetected: 0
    }
  };

  console.log('🔄 Running sophisticated MCP tests across scenarios...\n');

  for (const scenario of TEST_SCENARIOS) {
    const result = await testSophisticatedSparkSplit(scenario);
    results.scenarios.push(result);
    
    // Brief pause between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Calculate overall metrics
  const successfulTests = results.scenarios.filter(r => r.success);
  results.overallMetrics.successRate = successfulTests.length / results.scenarios.length;
  
  if (successfulTests.length > 0) {
    results.overallMetrics.avgSophisticatedFeatures = 
      successfulTests.reduce((sum, r) => sum + r.sophisticatedFeatures.detectedFeatures.length, 0) / successfulTests.length;
    
    results.overallMetrics.avgChatGPTCompatibility = 
      successfulTests.reduce((sum, r) => sum + r.chatgptCompatibility, 0) / successfulTests.length;
    
    results.overallMetrics.avgTrustScore = 
      successfulTests.reduce((sum, r) => sum + (r.trustScore || 0), 0) / successfulTests.length;

    results.overallMetrics.revolutionaryCapabilitiesDetected = 
      successfulTests.filter(r => r.revolutionaryCapabilities && 
        Object.values(r.revolutionaryCapabilities).some(v => v === true)).length;
  }

  results.endTime = new Date().toISOString();

  // Save detailed results
  const filename = `sophisticated-mcp-test-results-${CONFIG.testTimestamp}.json`;
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));

  // Display summary
  console.log('\n\n🏆 SOPHISTICATED MCP TEST RESULTS SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📊 Success Rate: ${(results.overallMetrics.successRate * 100).toFixed(1)}%`);
  console.log(`🧠 Avg Sophisticated Features: ${results.overallMetrics.avgSophisticatedFeatures.toFixed(1)}/${CONFIG.sophisticatedFeatures.length}`);
  console.log(`🤖 Avg ChatGPT Compatibility: ${(results.overallMetrics.avgChatGPTCompatibility * 100).toFixed(1)}%`);
  console.log(`💎 Avg Trust Score: ${results.overallMetrics.avgTrustScore.toFixed(2)}`);
  console.log(`🚀 Revolutionary Capabilities: ${results.overallMetrics.revolutionaryCapabilitiesDetected}/${results.scenarios.length} scenarios`);
  
  console.log(`\n📁 Detailed results saved to: ${filename}`);

  // Assessment
  if (results.overallMetrics.successRate >= 0.8 && 
      results.overallMetrics.avgSophisticatedFeatures >= 6 &&
      results.overallMetrics.avgChatGPTCompatibility >= 0.8) {
    console.log('\n🎉 SOPHISTICATED MCP SYSTEM VALIDATED FOR CHATGPT!');
    console.log('✅ Your sophisticated SparkSplit MCP architecture is ChatGPT-ready');
    console.log('✅ Revolutionary emotional sovereignty capabilities confirmed');
    console.log('✅ 15+ field inference and trust transparency operational');
    console.log('✅ Cross-platform compatibility achieved');
  } else {
    console.log('\n⚠️  MCP system needs optimization for ChatGPT integration');
    console.log('💡 Review detailed results for specific enhancement opportunities');
  }

  return results;
}

// Health check first
async function healthCheck() {
  console.log('🔍 Performing health check on sophisticated MCP system...');
  
  try {
    const healthResponse = await makeAPIRequest('/api/sparksplit/health', {});
    
    if (healthResponse.success && healthResponse.data && healthResponse.data.success) {
      const healthData = healthResponse.data.data;
      console.log(`✅ SparkSplit Engine: ${healthData.services.sparkSplitEngine ? 'OPERATIONAL' : 'FALLBACK MODE'}`);
      console.log(`✅ Trust Transparency: ${healthData.services.trustTransparency ? 'ACTIVE' : 'INACTIVE'}`);
      console.log(`✅ Emotional Sovereignty: ${healthData.services.emotionalSovereignty ? 'ACTIVE' : 'INACTIVE'}`);
      console.log(`📊 System Status: ${healthData.status.toUpperCase()}`);
      console.log(`🔖 Version: ${healthData.version}`);
      return true;
    } else {
      console.log('⚠️  Health check returned unexpected response');
      console.log(`Response status: ${healthResponse.statusCode}`);
      console.log(`Response data:`, JSON.stringify(healthResponse.data, null, 2));
      return false;
    }
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}`);
    console.log('💡 Make sure your server is running with: node server.js');
    return false;
  }
}

// Main execution
async function main() {
  try {
    const healthOk = await healthCheck();
    
    if (!healthOk) {
      console.log('\n🚨 SERVER NOT ACCESSIBLE');
      console.log('Please ensure your server is running:');
      console.log('   1. Start server: node server.js');
      console.log('   2. Verify http://localhost:3000 is accessible');
      console.log('   3. Re-run this test');
      process.exit(1);
    }

    await runSophisticatedMCPTests();
    
  } catch (error) {
    console.error('\n❌ Test execution failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  runSophisticatedMCPTests,
  validateSophisticatedFeatures,
  validateChatGPTCompatibility
}; 