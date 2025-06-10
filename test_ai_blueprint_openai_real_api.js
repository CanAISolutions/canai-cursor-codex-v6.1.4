/**
 * Real OpenAI API Test for AI Blueprint MCP
 * 
 * This test performs actual OpenAI API calls using the ai_blueprint.mcp.ts file
 * Tests the full generation pipeline including SparkSplit trust transparency
 * 
 * Setup:
 * 1. Set OPENAI_API_KEY environment variable
 * 2. Run: node test_ai_blueprint_openai_real_api.js
 * 
 * Date: 2025-01-30
 * Version: Real API Integration Test
 */

const fs = require('fs');
const path = require('path');

// Environment setup
require('dotenv').config();

async function runRealOpenAITest() {
  console.log('🚀 Starting Real OpenAI API Test for AI Blueprint');
  console.log('====================================================');
  
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ERROR: OPENAI_API_KEY environment variable not set');
    console.log('');
    console.log('To fix this:');
    console.log('1. Create a .env file in the project root');
    console.log('2. Add: OPENAI_API_KEY=your_actual_api_key_here');
    console.log('3. Get API key from: https://platform.openai.com/api-keys');
    console.log('');
    process.exit(1);
  }

  const startTime = Date.now();
  
  try {
    // Dynamically import the AI Blueprint MCP
    console.log('📦 Loading AI Blueprint MCP...');
    
    // First try the TypeScript version directly
    let aiBlueprintMCP;
    try {
      // Try importing the TypeScript file directly with ts-node
      const { generateAIBlueprint } = await import('./prompts/ai_blueprint.mcp.ts');
      aiBlueprintMCP = { generate: generateAIBlueprint };
      console.log('✅ Successfully loaded TypeScript AI Blueprint MCP');
    } catch (tsError) {
      console.log('⚠️  TypeScript import failed, trying JavaScript compilation...');
      console.log('Error:', tsError.message);
      
      // Fallback: suggest compilation
      console.error('❌ Could not import ai_blueprint.mcp.ts directly');
      console.log('');
      console.log('To fix this:');
      console.log('1. Compile TypeScript: npm run build');
      console.log('2. Or install ts-node globally: npm install -g ts-node');
      console.log('3. Or use tsx: npx tsx test_ai_blueprint_openai_real_api.js');
      console.log('');
      process.exit(1);
    }

    // Test Cases for Real OpenAI API
    const testCases = [
      {
        name: 'Healthcare AI Assistant',
        description: 'Medical imaging analysis for radiology departments',
        input: {
          businessName: 'MedTech Innovations',
          targetAudience: 'Radiologists and medical imaging professionals',
          primaryGoal: 'Develop AI assistant for medical image analysis to improve diagnostic accuracy',
          competitiveContext: 'Advanced deep learning vs traditional manual analysis',
          brandVoice: 'professional',
          resourceConstraints: '$75K budget, 8-month development timeline, HIPAA compliance required',
          currentStatus: 'Manual image review with basic PACS integration',
          aiSolution: 'Computer vision AI for X-ray and CT scan analysis',
          mvpFeatures: 'Abnormality detection, confidence scoring, DICOM integration',
          successMetrics: '30d: Model training; 60d: Clinical validation; 90d: Hospital pilot',
          linkedPrompts: ['business-plan', 'site-audit'],
          minimumViableExecution: 'Use TensorFlow for deep learning, DICOM viewers, HIPAA-compliant cloud hosting'
        }
      },
      {
        name: 'E-commerce Recommendation Engine',
        description: 'Personalized product recommendations for online retailers',
        input: {
          businessName: 'ShopSmart Analytics',
          targetAudience: 'E-commerce businesses and online retailers',
          primaryGoal: 'Increase sales through AI-powered personalized product recommendations',
          competitiveContext: 'Advanced ML personalization vs generic rule-based suggestions',
          brandVoice: 'innovative',
          resourceConstraints: '$30K budget, 4-month timeline, existing Shopify integration',
          currentStatus: 'Basic product filtering with manual merchandising',
          aiSolution: 'Machine learning recommendation engine with real-time personalization',
          mvpFeatures: 'Collaborative filtering, behavioral tracking, A/B testing framework',
          successMetrics: '30d: Algorithm development; 60d: Shopify integration; 90d: 25% revenue increase',
          linkedPrompts: ['business-plan', 'ad-amplify', 'email-campaign'],
          minimumViableExecution: 'Use Python/Scikit-learn, Redis caching, Shopify APIs, AWS hosting'
        }
      },
      {
        name: 'Financial Risk Assessment',
        description: 'AI-powered credit risk analysis for fintech companies',
        input: {
          businessName: 'RiskGuard Financial',
          targetAudience: 'Financial institutions and fintech companies',
          primaryGoal: 'Automate credit risk assessment using advanced machine learning',
          competitiveContext: 'Real-time AI scoring vs traditional credit bureau reports',
          brandVoice: 'authoritative',
          resourceConstraints: '$100K budget, 6-month timeline, regulatory compliance (SOX, Basel III)',
          currentStatus: 'Manual underwriting with basic credit scoring',
          aiSolution: 'Machine learning risk assessment with alternative data sources',
          mvpFeatures: 'Alternative data analysis, real-time scoring, regulatory reporting',
          successMetrics: '30d: Data pipeline; 60d: Model validation; 90d: Regulatory approval',
          linkedPrompts: ['business-plan', 'site-audit'],
          minimumViableExecution: 'Use Python/XGBoost, secure APIs, SOC2-compliant infrastructure'
        }
      }
    ];

    const results = [];

    // Run tests for each case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\n🧪 Test Case ${i + 1}: ${testCase.name}`);
      console.log(`📝 ${testCase.description}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const testStartTime = Date.now();
      
      try {
        console.log('🔄 Generating AI Blueprint with real OpenAI API...');
        
        // Call the actual generateAIBlueprint function
        const session = await aiBlueprintMCP.generate(testCase.input);
        
        const testEndTime = Date.now();
        const responseTime = testEndTime - testStartTime;
        
        console.log(`✅ Generation completed in ${responseTime}ms`);
        
        // Analyze the results
        const analysis = {
          testCase: testCase.name,
          input: testCase.input,
          session: session,
          responseTime: responseTime,
          validation: {
            hasOutput: !!session.output,
            hasValidation: session.validationStatus.isValid,
            hasScore: !!session.score,
            hasEmpathy: !!session.empathyMetrics,
            hasSparkSplit: !!session.sparkSplit,
            hasTrustScore: session.metadata.trustScore > 0,
            hasEmotionalCompass: !!session.emotionalCompass
          },
          metrics: {
            trustScore: session.metadata.trustScore,
            validationIssues: session.validationStatus.issues.length,
            overallScore: session.score?.overall || 0,
            empathyScore: session.empathyMetrics?.overall || 0,
            emotionalOverall: session.emotionalCompass?.overall || 0
          }
        };
        
        results.push(analysis);
        
        // Display key results
        console.log('\n📊 Key Results:');
        console.log(`   Trust Score: ${session.metadata.trustScore.toFixed(2)}/5.0`);
        console.log(`   Validation: ${session.validationStatus.isValid ? '✅ Valid' : '❌ Invalid'}`);
        console.log(`   Overall Score: ${(session.score?.overall || 0).toFixed(2)}/1.0`);
        console.log(`   Empathy Score: ${(session.empathyMetrics?.overall || 0).toFixed(2)}/1.0`);
        console.log(`   Emotional Compass: ${(session.emotionalCompass?.overall || 0).toFixed(2)}/1.0`);
        console.log(`   SparkSplit: ${session.sparkSplit ? '✅ Active' : '❌ Disabled'}`);
        
        // Display output preview
        if (session.output) {
          console.log('\n📋 Blueprint Preview:');
          console.log(`   Architecture: ${session.output.blueprint.architecture}`);
          console.log(`   Components: ${session.output.blueprint.components.length} items`);
          console.log(`   Recommendations: ${session.output.recommendations.length} items`);
          console.log(`   Timeline: ${session.output.timeline.length} phases`);
          console.log(`   Risks: ${session.output.risks.length} identified`);
        }
        
        // Display SparkSplit analysis if available
        if (session.sparkSplit) {
          console.log('\n🌟 SparkSplit Trust Transparency:');
          console.log(`   Trust Delta: ${session.sparkSplit.trustDelta.toFixed(2)}`);
          console.log(`   Dominant Axis: ${session.sparkSplit.emotionalCompass.dominantAxis}`);
          console.log(`   Awe Score: ${(session.sparkSplit.comparisonMetrics.aweScore * 100).toFixed(1)}%`);
          console.log(`   Emotional Impact: ${(session.sparkSplit.comparisonMetrics.emotionalImpactScore * 100).toFixed(1)}%`);
        }
        
      } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
        
        const analysis = {
          testCase: testCase.name,
          input: testCase.input,
          error: error.message,
          responseTime: Date.now() - testStartTime,
          validation: {
            hasOutput: false,
            hasValidation: false,
            hasScore: false,
            hasEmpathy: false,
            hasSparkSplit: false,
            hasTrustScore: false,
            hasEmotionalCompass: false
          },
          metrics: {
            trustScore: 0,
            validationIssues: 1,
            overallScore: 0,
            empathyScore: 0,
            emotionalOverall: 0
          }
        };
        
        results.push(analysis);
        
        // Log error details
        console.log('\n🔍 Error Analysis:');
        if (error.message.includes('API key')) {
          console.log('   Issue: OpenAI API key problem');
          console.log('   Fix: Check your OPENAI_API_KEY environment variable');
        } else if (error.message.includes('rate limit')) {
          console.log('   Issue: OpenAI API rate limit exceeded');
          console.log('   Fix: Wait a moment and try again, or upgrade your OpenAI plan');
        } else if (error.message.includes('timeout')) {
          console.log('   Issue: API request timeout');
          console.log('   Fix: Check your internet connection and try again');
        } else {
          console.log(`   Issue: ${error.message}`);
          console.log('   Stack trace available in full logs');
        }
      }
    }
    
    // Generate comprehensive test report
    const totalTime = Date.now() - startTime;
    const successfulTests = results.filter(r => !r.error).length;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
    const avgTrustScore = results.reduce((sum, r) => sum + r.metrics.trustScore, 0) / results.length;
    
    console.log('\n🎯 COMPREHENSIVE TEST SUMMARY');
    console.log('═════════════════════════════════════════════════');
    console.log(`📊 Overall Results:`);
    console.log(`   Tests Run: ${results.length}`);
    console.log(`   Successful: ${successfulTests}/${results.length} (${(successfulTests/results.length*100).toFixed(1)}%)`);
    console.log(`   Total Time: ${totalTime}ms`);
    console.log(`   Avg Response Time: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`   Avg Trust Score: ${avgTrustScore.toFixed(2)}/5.0`);
    
    console.log('\n📈 Performance Metrics:');
    results.forEach((result, index) => {
      console.log(`   Test ${index + 1} (${result.testCase}):`);
      console.log(`     Status: ${result.error ? '❌ Failed' : '✅ Success'}`);
      console.log(`     Response Time: ${result.responseTime}ms`);
      console.log(`     Trust Score: ${result.metrics.trustScore.toFixed(2)}/5.0`);
    });
    
    // Save detailed results to file
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        testsRun: results.length,
        successful: successfulTests,
        successRate: successfulTests / results.length,
        totalTime: totalTime,
        avgResponseTime: avgResponseTime,
        avgTrustScore: avgTrustScore
      },
      results: results,
      environment: {
        nodeVersion: process.version,
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        openAIModel: process.env.OPENAI_MODEL || 'gpt-4-turbo'
      }
    };
    
    const reportFile = `ai_blueprint_openai_test_report_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));
    console.log(`\n📄 Detailed test report saved to: ${reportFile}`);
    
    // Generate human-readable report
    const humanReport = generateHumanReadableReport(reportData);
    const humanReportFile = `ai_blueprint_openai_test_report_${new Date().toISOString().replace(/[:.]/g, '-')}.md`;
    fs.writeFileSync(humanReportFile, humanReport);
    console.log(`📄 Human-readable report saved to: ${humanReportFile}`);
    
    if (successfulTests === results.length) {
      console.log('\n🎉 ALL TESTS PASSED - OpenAI API Integration Working Perfectly!');
    } else {
      console.log('\n⚠️  Some tests had issues - Check the detailed reports above');
    }
    
    return reportData;
    
  } catch (error) {
    console.error('❌ Critical test failure:', error.message);
    console.error('\n🔍 Debug Information:');
    console.error('   Error:', error.message);
    console.error('   Stack:', error.stack);
    
    process.exit(1);
  }
}

function generateHumanReadableReport(reportData) {
  return `# AI Blueprint OpenAI API Test Report

**Test Date**: ${new Date(reportData.timestamp).toLocaleString()}
**Environment**: Node.js ${reportData.environment.nodeVersion}
**OpenAI Model**: ${reportData.environment.openAIModel}

## Summary

- **Tests Run**: ${reportData.summary.testsRun}
- **Successful**: ${reportData.summary.successful}
- **Success Rate**: ${(reportData.summary.successRate * 100).toFixed(1)}%
- **Total Time**: ${reportData.summary.totalTime}ms
- **Average Response Time**: ${reportData.summary.avgResponseTime.toFixed(0)}ms
- **Average Trust Score**: ${reportData.summary.avgTrustScore.toFixed(2)}/5.0

## Test Results

${reportData.results.map((result, index) => `
### Test ${index + 1}: ${result.testCase}

**Status**: ${result.error ? '❌ Failed' : '✅ Success'}
**Response Time**: ${result.responseTime}ms
**Trust Score**: ${result.metrics.trustScore.toFixed(2)}/5.0

${result.error ? `**Error**: ${result.error}` : `
**Validation**: ${result.validation.hasValidation ? '✅ Valid' : '❌ Invalid'}
**Overall Score**: ${result.metrics.overallScore.toFixed(2)}/1.0
**Empathy Score**: ${result.metrics.empathyScore.toFixed(2)}/1.0
**Emotional Score**: ${result.metrics.emotionalOverall.toFixed(2)}/1.0
**SparkSplit**: ${result.validation.hasSparkSplit ? '✅ Active' : '❌ Disabled'}
`}
`).join('')}

## Recommendations

${reportData.summary.successRate === 1 ? 
  '🎉 All tests passed successfully! The OpenAI API integration is working perfectly.' :
  '⚠️ Some tests failed. Please check the error messages above and ensure your OpenAI API key is valid and has sufficient quota.'
}

---
*Generated by CanAI Cursor Codex Test Suite*
`;
}

// Run the test if this file is executed directly
if (require.main === module) {
  runRealOpenAITest().catch(console.error);
}

module.exports = { runRealOpenAITest }; 