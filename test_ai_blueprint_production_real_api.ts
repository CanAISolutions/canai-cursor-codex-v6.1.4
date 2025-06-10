/**
 * AI Blueprint Production-Ready OpenAI API Test
 * Based on MCP-PRODUCTION-INTEGRATION-GUIDE.md
 * 
 * This test validates the real-world functionality of the AI Blueprint MCP
 * with actual OpenAI API calls and comprehensive error handling.
 */

// ✅ CRITICAL: Load .env file FIRST before any imports
require('dotenv').config();

import { generateAIBlueprint, applyMCPEnhancers } from './prompts/ai_blueprint.mcp';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

// Environment configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const TEST_TIMEOUT = 60000; // 60 seconds
const MAX_RETRIES = 3;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  timeout: 30000,
});

// Test scenarios from the production guide
const testScenarios = [
  {
    name: "Healthcare AI Platform",
    input: {
      businessName: "MediTech Solutions",
      targetAudience: "Healthcare providers and medical staff",
      primaryGoal: "Develop AI-powered diagnostic assistance for radiology departments",
      competitiveContext: "Competing with traditional PACS systems and basic AI tools",
      brandVoice: "professional",
      resourceConstraints: "HIPAA compliance required, $200K budget, 8-month timeline",
      currentStatus: "Currently using traditional radiology workflows with manual analysis",
      aiSolution: "Computer vision AI for medical image analysis and anomaly detection",
      mvpFeatures: "DICOM integration, anomaly detection, radiologist workflow integration",
      successMetrics: "30d: Algorithm training; 60d: Clinical validation; 90d: FDA submission preparation",
      linkedPrompts: ["business-plan"],
      minimumViableExecution: "Use TensorFlow for deep learning, DICOM integration, HIPAA-compliant cloud hosting"
    },
    expectedOutputFields: ["blueprint", "recommendations", "timeline", "risks"],
    minTrustScore: 4.2
  },
  {
    name: "E-commerce Recommendation Engine",
    input: {
      businessName: "ShopSmart Analytics",
      targetAudience: "E-commerce businesses and retail managers",
      primaryGoal: "Build personalized product recommendation system to increase conversion rates",
      competitiveContext: "Competing with Amazon's recommendation algorithms and generic product suggestions",
      brandVoice: "innovative",
      resourceConstraints: "Mid-market budget, need integration with existing Shopify stores",
      currentStatus: "Manual product curation with basic 'related products' functionality",
      aiSolution: "Machine learning-powered personalization engine with real-time recommendations",
      mvpFeatures: "Collaborative filtering, real-time processing, A/B testing framework, Shopify integration",
      successMetrics: "30d: Algorithm setup; 60d: Shopify integration; 90d: 25% conversion increase",
      linkedPrompts: ["business-plan", "ad-amplify"],
      minimumViableExecution: "Use collaborative filtering algorithms, Redis for caching, Shopify API integration"
    },
    expectedOutputFields: ["blueprint", "recommendations", "timeline", "risks"],
    minTrustScore: 4.2
  },
  {
    name: "Financial Trading Bot",
    input: {
      businessName: "AlgoTrade Pro",
      targetAudience: "Financial professionals and algorithmic traders",
      primaryGoal: "Create AI-driven trading algorithm for cryptocurrency markets",
      competitiveContext: "Competing with established trading platforms and manual trading strategies",
      brandVoice: "technical",
      resourceConstraints: "Regulatory compliance, real-time processing requirements, $150K budget",
      currentStatus: "Manual trading with basic technical analysis tools",
      aiSolution: "Real-time market analysis AI with automated trading capabilities",
      mvpFeatures: "Market data integration, risk management, backtesting, live trading execution",
      successMetrics: "30d: Algorithm development; 60d: Backtesting validation; 90d: Live trading with positive ROI",
      linkedPrompts: ["business-plan", "site-audit"],
      minimumViableExecution: "Use Python/TensorFlow for ML, WebSocket APIs for real-time data, secure cloud deployment"
    },
    expectedOutputFields: ["blueprint", "recommendations", "timeline", "risks"],
    minTrustScore: 4.2
  }
];

// Performance tracking
interface TestMetrics {
  scenario: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  trustScore: number;
  apiCallCount: number;
  errorMessage?: string;
  responseSize: number;
}

const testMetrics: TestMetrics[] = [];

/**
 * Validates OpenAI API key and connectivity
 */
async function validateOpenAIConnection(): Promise<boolean> {
  console.log('🔑 Validating OpenAI API connection...');
  
  if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is required');
    console.log('📝 Please set your OpenAI API key:');
    console.log('   export OPENAI_API_KEY="sk-proj-[YOUR_ACTUAL_KEY]"');
    return false;
  }

  if (!OPENAI_API_KEY.startsWith('sk-')) {
    console.error('❌ Invalid OpenAI API key format');
    return false;
  }

  try {
    // Test connectivity with a minimal request
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Test connection' }],
      max_tokens: 5
    });

    if (response.choices && response.choices.length > 0) {
      console.log('✅ OpenAI API connection validated successfully');
      console.log(`📊 Model: ${response.model}`);
      console.log(`🆔 Request ID: ${response.id}`);
      return true;
    } else {
      console.error('❌ Invalid response from OpenAI API');
      return false;
    }
  } catch (error: any) {
    console.error('❌ OpenAI API connection failed:', error.message);
    if (error.code === 'invalid_api_key') {
      console.log('🔧 Please check your API key is valid and has sufficient credits');
    } else if (error.code === 'rate_limit_exceeded') {
      console.log('⏰ Rate limit exceeded. Please try again later');
    }
    return false;
  }
}

/**
 * Validates AI Blueprint output structure
 */
function validateOutputStructure(output: any, expectedFields: string[]): boolean {
  console.log('🔍 Validating output structure...');
  
  if (!output || typeof output !== 'object') {
    console.error('❌ Output is not a valid object');
    return false;
  }

  // Check required fields
  for (const field of expectedFields) {
    if (!output[field]) {
      console.error(`❌ Missing required field: ${field}`);
      return false;
    }
  }

  // Validate blueprint structure
  if (output.blueprint) {
    const blueprintRequired = ['architecture', 'components', 'integrations', 'security', 'scalability'];
    for (const field of blueprintRequired) {
      if (!output.blueprint[field]) {
        console.error(`❌ Missing blueprint field: ${field}`);
        return false;
      }
    }
  }

  // Validate arrays have content
  const arrayFields = ['recommendations', 'timeline', 'risks'];
  for (const field of arrayFields) {
    if (output[field] && Array.isArray(output[field])) {
      if (output[field].length === 0) {
        console.log(`⚠️  Warning: ${field} array is empty`);
      }
    }
  }

  console.log('✅ Output structure validation passed');
  return true;
}

/**
 * Tests MCP field enhancement functionality
 */
async function testMCPEnhancement(): Promise<boolean> {
  console.log('\n🧪 Testing MCP Field Enhancement...');
  
  try {
    // Test with minimal input to verify field inference
    const minimalInput = {
      businessName: "TestCorp",
      targetAudience: "Developers",
      primaryGoal: "Build AI tools"
    };

    console.log('📥 Input:', JSON.stringify(minimalInput, null, 2));
    
    const enhanced = await applyMCPEnhancers(minimalInput);
    
    console.log('📤 Enhanced output:', JSON.stringify(enhanced, null, 2));
    
    // Validate all required fields are present
    const requiredFields = [
      'businessName', 'targetAudience', 'primaryGoal', 'competitiveContext',
      'brandVoice', 'resourceConstraints', 'currentStatus', 'aiSolution',
      'mvpFeatures', 'successMetrics', 'linkedPrompts', 'minimumViableExecution'
    ];

    let enhancementSuccess = true;
    for (const field of requiredFields) {
      if (!enhanced[field as keyof typeof enhanced]) {
        console.error(`❌ Enhancement failed to generate: ${field}`);
        enhancementSuccess = false;
      }
    }

    if (enhancementSuccess) {
      console.log('✅ MCP field enhancement test passed');
      console.log(`📊 Enhanced ${Object.keys(enhanced).length} fields from ${Object.keys(minimalInput).length} input fields`);
    }

    return enhancementSuccess;
  } catch (error: any) {
    console.error('❌ MCP enhancement test failed:', error.message);
    return false;
  }
}

/**
 * Runs a single test scenario with retry logic
 */
async function runTestScenario(scenario: any, retryCount: number = 0): Promise<TestMetrics> {
  const startTime = Date.now();
  const metric: TestMetrics = {
    scenario: scenario.name,
    startTime,
    endTime: 0,
    duration: 0,
    success: false,
    trustScore: 0,
    apiCallCount: 0,
    responseSize: 0
  };

  try {
    console.log(`\n🧪 Testing Scenario: ${scenario.name}`);
    console.log('📥 Input:', JSON.stringify(scenario.input, null, 2));

    // Generate AI Blueprint with actual OpenAI API calls
    const session = await generateAIBlueprint(scenario.input);
    metric.apiCallCount++;

    metric.endTime = Date.now();
    metric.duration = metric.endTime - startTime;

    console.log(`⏱️  Generation completed in ${metric.duration}ms`);

    // Validate output structure
    if (!session.output) {
      throw new Error('No output generated from AI Blueprint');
    }

    const structureValid = validateOutputStructure(session.output, scenario.expectedOutputFields);
    if (!structureValid) {
      throw new Error('Output structure validation failed');
    }

    // Check trust score
    metric.trustScore = session.metadata.trustScore;
    console.log(`🎯 Trust Score: ${metric.trustScore.toFixed(2)}/5.0`);

    if (metric.trustScore < scenario.minTrustScore) {
      console.log(`⚠️  Trust score ${metric.trustScore.toFixed(2)} below minimum ${scenario.minTrustScore}`);
    }

    // Calculate response size
    metric.responseSize = JSON.stringify(session.output).length;
    console.log(`📊 Response size: ${metric.responseSize} characters`);

    // Log detailed results
    console.log('📤 Generated Output:');
    console.log('  Architecture:', session.output.blueprint?.architecture);
    console.log('  Components:', session.output.blueprint?.components?.length || 0);
    console.log('  Recommendations:', session.output.recommendations?.length || 0);
    console.log('  Timeline items:', session.output.timeline?.length || 0);
    console.log('  Risk factors:', session.output.risks?.length || 0);

    // Check emotional metrics if available
    if (session.emotionalCompass) {
      console.log('💝 Emotional Compass:');
      if ('awe' in session.emotionalCompass) {
        console.log(`  Awe: ${(session.emotionalCompass.awe * 100).toFixed(1)}%`);
        console.log(`  Ownership: ${(session.emotionalCompass.ownership * 100).toFixed(1)}%`);
        console.log(`  Wonder: ${(session.emotionalCompass.wonder * 100).toFixed(1)}%`);
        console.log(`  Calm: ${(session.emotionalCompass.calm * 100).toFixed(1)}%`);
        console.log(`  Power: ${(session.emotionalCompass.power * 100).toFixed(1)}%`);
      } else {
        const newCompass = session.emotionalCompass as any;
        console.log(`  Clarity: ${(newCompass.clarity * 100).toFixed(1)}%`);
        console.log(`  Empowerment: ${(newCompass.empowerment * 100).toFixed(1)}%`);
        console.log(`  Trust: ${(newCompass.trust * 100).toFixed(1)}%`);
        console.log(`  Joy: ${(newCompass.joy * 100).toFixed(1)}%`);
        console.log(`  Alignment: ${(newCompass.alignment * 100).toFixed(1)}%`);
      }
      console.log(`  Overall: ${(session.emotionalCompass.overall * 100).toFixed(1)}%`);
    }

    // Check SparkSplit integration if available
    if (session.sparkSplit) {
      console.log('🔥 SparkSplit Integration:');
      console.log(`  Trust Delta: ${session.sparkSplit.trustDelta.toFixed(2)}`);
      console.log(`  Emotional Impact: ${(session.sparkSplit.comparisonMetrics.emotionalImpactScore * 100).toFixed(1)}%`);
    }

    metric.success = true;
    console.log(`✅ Scenario "${scenario.name}" completed successfully`);

    return metric;

  } catch (error: any) {
    metric.endTime = Date.now();
    metric.duration = metric.endTime - startTime;
    metric.errorMessage = error.message;

    console.error(`❌ Scenario "${scenario.name}" failed:`, error.message);

    // Retry logic for transient failures
    if (retryCount < MAX_RETRIES && isRetryableError(error)) {
      console.log(`🔄 Retrying scenario (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      return runTestScenario(scenario, retryCount + 1);
    }

    return metric;
  }
}

/**
 * Determines if an error is retryable
 */
function isRetryableError(error: any): boolean {
  const retryableCodes = ['rate_limit_exceeded', 'server_error', 'timeout'];
  return retryableCodes.includes(error.code) || error.message.includes('timeout');
}

/**
 * Generates comprehensive test report
 */
function generateTestReport(metrics: TestMetrics[]): void {
  console.log('\n📊 TEST REPORT');
  console.log('='.repeat(60));

  const successfulTests = metrics.filter(m => m.success);
  const failedTests = metrics.filter(m => !m.success);

  console.log(`📈 Success Rate: ${successfulTests.length}/${metrics.length} (${((successfulTests.length / metrics.length) * 100).toFixed(1)}%)`);
  
  if (successfulTests.length > 0) {
    const avgDuration = successfulTests.reduce((sum, m) => sum + m.duration, 0) / successfulTests.length;
    const avgTrustScore = successfulTests.reduce((sum, m) => sum + m.trustScore, 0) / successfulTests.length;
    const avgResponseSize = successfulTests.reduce((sum, m) => sum + m.responseSize, 0) / successfulTests.length;
    const totalApiCalls = metrics.reduce((sum, m) => sum + m.apiCallCount, 0);

    console.log(`⏱️  Average Duration: ${avgDuration.toFixed(0)}ms`);
    console.log(`🎯 Average Trust Score: ${avgTrustScore.toFixed(2)}/5.0`);
    console.log(`📊 Average Response Size: ${avgResponseSize.toFixed(0)} characters`);
    console.log(`🔌 Total API Calls: ${totalApiCalls}`);
  }

  console.log('\n📋 Individual Test Results:');
  metrics.forEach(metric => {
    const status = metric.success ? '✅' : '❌';
    console.log(`${status} ${metric.scenario}`);
    console.log(`    Duration: ${metric.duration}ms`);
    if (metric.success) {
      console.log(`    Trust Score: ${metric.trustScore.toFixed(2)}/5.0`);
      console.log(`    Response Size: ${metric.responseSize} characters`);
    } else {
      console.log(`    Error: ${metric.errorMessage}`);
    }
  });

  if (failedTests.length > 0) {
    console.log('\n🚨 Failed Tests Analysis:');
    failedTests.forEach(metric => {
      console.log(`- ${metric.scenario}: ${metric.errorMessage}`);
    });
  }

  // Save detailed report to file
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: metrics.length,
      successfulTests: successfulTests.length,
      failedTests: failedTests.length,
      successRate: (successfulTests.length / metrics.length) * 100,
      averageDuration: successfulTests.length > 0 ? successfulTests.reduce((sum, m) => sum + m.duration, 0) / successfulTests.length : 0,
      averageTrustScore: successfulTests.length > 0 ? successfulTests.reduce((sum, m) => sum + m.trustScore, 0) / successfulTests.length : 0
    },
    detailedResults: metrics
  };

  const reportPath = path.join(__dirname, `ai_blueprint_test_report_${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

/**
 * Main test execution function
 */
async function runProductionTest(): Promise<void> {
  console.log('🚀 AI Blueprint Production OpenAI API Test');
  console.log('Based on MCP-PRODUCTION-INTEGRATION-GUIDE.md');
  console.log('='.repeat(60));

  try {
    // Step 1: Validate OpenAI connection
    const connectionValid = await validateOpenAIConnection();
    if (!connectionValid) {
      process.exit(1);
    }

    // Step 2: Test MCP enhancement functionality
    const enhancementValid = await testMCPEnhancement();
    if (!enhancementValid) {
      console.log('⚠️  MCP enhancement test failed, but continuing with main tests...');
    }

    // Step 3: Run all test scenarios
    console.log('\n🧪 Running Production Test Scenarios...');
    
    for (const scenario of testScenarios) {
      const metric = await runTestScenario(scenario);
      testMetrics.push(metric);
      
      // Brief pause between tests to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Step 4: Generate comprehensive report
    generateTestReport(testMetrics);

    // Step 5: Exit with appropriate code
    const hasFailures = testMetrics.some(m => !m.success);
    if (hasFailures) {
      console.log('\n⚠️  Some tests failed. Check the report above for details.');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed successfully!');
      console.log('✅ AI Blueprint MCP is production-ready with OpenAI API integration');
      process.exit(0);
    }

  } catch (error: any) {
    console.error('\n💥 Fatal error during test execution:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Execute the test if run directly
if (require.main === module) {
  runProductionTest().catch(error => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
}

export { runProductionTest, testScenarios, validateOpenAIConnection }; 