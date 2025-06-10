/**
 * test_mcp_business_plan_20250607.ts
 * 
 * Comprehensive integration tests for Business Plan MCP V4 standardization
 * Tests TAP compliance, trust transparency, emotional intelligence, and production readiness
 */

import { businessPlanMCP, BusinessPlanInput, testBusinessPlanMCP } from '../prompts/business-plan.mcp';
import { generateBusinessPlanContent } from '../business_plan_content_update';

// Test configuration
const TEST_CONFIG = {
  minTrustScore: 4.2,
  minEmotionalDepth: 0.85,
  maxResponseTime: 2000, // 2 seconds
  requiredFields: ['businessName', 'targetAudience', 'primaryGoal', 'industry'],
  testTimeout: 30000 // 30 seconds
};

interface TestResult {
  testName: string;
  passed: boolean;
  score?: number;
  trustScore?: number;
  emotionalScore?: number;
  responseTime?: number;
  details: string;
  errors?: string[];
}

class BusinessPlanMCPTester {
  private results: TestResult[] = [];

  async runAllTests(): Promise<{ passed: number; failed: number; results: TestResult[] }> {
    console.log('🚀 Starting Business Plan MCP V4 Integration Tests...\n');

    // Test 1: Schema Validation
    await this.testSchemaValidation();
    
    // Test 2: Field Inference
    await this.testFieldInference();
    
    // Test 3: Trust Transparency
    await this.testTrustTransparency();
    
    // Test 4: Emotional Intelligence
    await this.testEmotionalIntelligence();
    
    // Test 5: Content Generation
    await this.testContentGeneration();
    
    // Test 6: Fallback Mechanisms
    await this.testFallbackMechanisms();
    
    // Test 7: Performance
    await this.testPerformance();
    
    // Test 8: TAP Compliance
    await this.testTAPCompliance();

    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;

    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);

    return { passed, failed, results: this.results };
  }

  private async testSchemaValidation(): Promise<void> {
    console.log('🔍 Testing Schema Validation...');

    try {
      // Test with valid input
      const validInput: BusinessPlanInput = {
        businessName: 'TechStartup Inc',
        targetAudience: 'Small business owners aged 25-45',
        primaryGoal: 'Launch innovative SaaS platform',
        industry: 'saas',
        goal: 'Secure Series A funding',
        tone: 'professional'
      };

      const session = await businessPlanMCP.processPrompt(validInput);
      
      this.addResult({
        testName: 'Schema Validation - Valid Input',
        passed: session.validationStatus.isValid,
        details: `Validation passed: ${session.validationStatus.isValid}, Missing fields: ${session.validationStatus.missingFields.length}`
      });

      // Test with invalid input
      const invalidInput: BusinessPlanInput = {
        industry: '',
        goal: '',
        tone: 'invalid_tone'
      };

      const invalidSession = await businessPlanMCP.processPrompt(invalidInput);
      
      this.addResult({
        testName: 'Schema Validation - Invalid Input Handling',
        passed: !invalidSession.validationStatus.isValid && invalidSession.recoveryStatus.triggered,
        details: `Fallback triggered: ${invalidSession.recoveryStatus.triggered}, Strategy: ${invalidSession.recoveryStatus.strategy}`
      });

    } catch (error) {
      this.addResult({
        testName: 'Schema Validation',
        passed: false,
        details: 'Test failed with error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  }

  private async testFieldInference(): Promise<void> {
    console.log('🧠 Testing Field Inference...');

    try {
      const minimalInput: BusinessPlanInput = {
        industry: 'fintech',
        goal: 'Create a mobile payment app for small businesses',
        tone: 'professional'
      };

      const testResult = await testBusinessPlanMCP(minimalInput);
      
      if (testResult.success) {
        const enhanced = testResult.data.enhancementSummary;
        const inferredFields = enhanced.enhancedFields.length;
        
        this.addResult({
          testName: 'Field Inference',
          passed: inferredFields >= 3, // Should infer at least 3 fields
          details: `Inferred ${inferredFields} fields: ${enhanced.enhancedFields.join(', ')}`,
          score: inferredFields / 4 // Normalize to 0-1 scale
        });
      } else {
        this.addResult({
          testName: 'Field Inference',
          passed: false,
          details: 'Field inference test failed',
          errors: [testResult.error || 'Unknown error']
        });
      }

    } catch (error) {
      this.addResult({
        testName: 'Field Inference',
        passed: false,
        details: 'Test failed with error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  }

  private async testTrustTransparency(): Promise<void> {
    console.log('🛡️ Testing Trust Transparency...');

    try {
      const trustInput: BusinessPlanInput = {
        businessName: 'EthicalTech Solutions',
        targetAudience: 'Enterprise customers seeking ethical AI',
        primaryGoal: 'Build trust through transparency',
        industry: 'artificial intelligence',
        goal: 'Create transparent AI solutions',
        tone: 'trustworthy',
        emotionalContext: {
          personalStory: 'Witnessed AI bias impact communities',
          motivator: 'Build ethical AI for everyone'
        }
      };

      const session = await businessPlanMCP.processPrompt(trustInput);
      const trustScore = session.scoreBreakdown.overall;
      
      this.addResult({
        testName: 'Trust Transparency',
        passed: trustScore >= TEST_CONFIG.minTrustScore,
        trustScore,
        details: `Trust score: ${trustScore.toFixed(2)}, Threshold: ${TEST_CONFIG.minTrustScore}`
      });

    } catch (error) {
      this.addResult({
        testName: 'Trust Transparency',
        passed: false,
        details: 'Test failed with error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  }

  private async testEmotionalIntelligence(): Promise<void> {
    console.log('💝 Testing Emotional Intelligence...');

    try {
      const emotionalInput: BusinessPlanInput = {
        businessName: 'HeartCare Medical',
        targetAudience: 'Families dealing with chronic illness',
        primaryGoal: 'Provide compassionate healthcare solutions',
        industry: 'healthcare',
        goal: 'Transform patient care experience',
        tone: 'empathetic',
        emotionalContext: {
          personalStory: 'Lost my father to preventable medical errors',
          visionQuote: 'Every patient deserves dignity and hope',
          motivator: 'Prevent other families from experiencing our pain',
          founderBackground: 'Former nurse turned healthcare innovator'
        }
      };

      const session = await businessPlanMCP.processPrompt(emotionalInput);
      const emotionalScore = session.scoreBreakdown.emotionalDepth;
      
      this.addResult({
        testName: 'Emotional Intelligence',
        passed: emotionalScore >= TEST_CONFIG.minEmotionalDepth,
        emotionalScore,
        details: `Emotional depth: ${emotionalScore.toFixed(2)}, Threshold: ${TEST_CONFIG.minEmotionalDepth}`
      });

    } catch (error) {
      this.addResult({
        testName: 'Emotional Intelligence',
        passed: false,
        details: 'Test failed with error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  }

  private async testContentGeneration(): Promise<void> {
    console.log('📝 Testing Content Generation...');

    // Skip if no OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      this.addResult({
        testName: 'Content Generation',
        passed: false,
        details: 'Skipped - No OPENAI_API_KEY found in environment'
      });
      return;
    }

    try {
      const contentInput: BusinessPlanInput = {
        businessName: 'GreenTech Innovations',
        targetAudience: 'Environmentally conscious consumers',
        primaryGoal: 'Accelerate sustainable technology adoption',
        industry: 'clean technology',
        goal: 'Launch solar energy platform',
        tone: 'inspiring',
        businessDescription: 'AI-powered solar energy optimization platform',
        revenueModel: 'Subscription with hardware sales',
        planPurpose: 'Series A funding',
        emotionalContext: {
          personalStory: 'Grew up in area affected by climate change',
          visionQuote: 'Clean energy should be accessible to everyone',
          motivator: 'Leave a better planet for future generations'
        }
      };

      const startTime = Date.now();
      const result = await generateBusinessPlanContent(contentInput);
      const responseTime = Date.now() - startTime;

      const passed = result.content.length > 500 && 
                   result.trustTransparency >= 0.8 && 
                   result.emotionalResonance >= 0.8 &&
                   responseTime < TEST_CONFIG.maxResponseTime;

      this.addResult({
        testName: 'Content Generation',
        passed,
        trustScore: result.trustTransparency,
        emotionalScore: result.emotionalResonance,
        responseTime,
        details: `Content length: ${result.content.length}, Trust: ${result.trustTransparency.toFixed(2)}, Emotional: ${result.emotionalResonance.toFixed(2)}, Time: ${responseTime}ms`
      });

    } catch (error) {
      this.addResult({
        testName: 'Content Generation',
        passed: false,
        details: 'Test failed with error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  }

  private async testFallbackMechanisms(): Promise<void> {
    console.log('🔄 Testing Fallback Mechanisms...');

    try {
      // Test validation fallback
      const invalidInput: BusinessPlanInput = {
        industry: '',
        goal: '',
        tone: 'invalid'
      };

      const session = await businessPlanMCP.processPrompt(invalidInput);
      
      this.addResult({
        testName: 'Fallback Mechanisms',
        passed: session.recoveryStatus.triggered && session.recoveryStatus.success,
        details: `Fallback triggered: ${session.recoveryStatus.triggered}, Success: ${session.recoveryStatus.success}, Strategy: ${session.recoveryStatus.strategy}`
      });

    } catch (error) {
      this.addResult({
        testName: 'Fallback Mechanisms',
        passed: false,
        details: 'Test failed with error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  }

  private async testPerformance(): Promise<void> {
    console.log('⚡ Testing Performance...');

    try {
      const performanceInput: BusinessPlanInput = {
        businessName: 'SpeedTech',
        targetAudience: 'Performance-focused developers',
        primaryGoal: 'Optimize application performance',
        industry: 'software',
        goal: 'Build fastest development platform',
        tone: 'technical'
      };

      const startTime = Date.now();
      const session = await businessPlanMCP.processPrompt(performanceInput);
      const responseTime = Date.now() - startTime;

      this.addResult({
        testName: 'Performance',
        passed: responseTime < TEST_CONFIG.maxResponseTime,
        responseTime,
        details: `Response time: ${responseTime}ms, Threshold: ${TEST_CONFIG.maxResponseTime}ms`
      });

    } catch (error) {
      this.addResult({
        testName: 'Performance',
        passed: false,
        details: 'Test failed with error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  }

  private async testTAPCompliance(): Promise<void> {
    console.log('🎯 Testing TAP Compliance...');

    try {
      const tapInput: BusinessPlanInput = {
        businessName: 'TAPCompliant Corp',
        targetAudience: 'Enterprise compliance officers',
        primaryGoal: 'Ensure regulatory compliance',
        industry: 'compliance',
        goal: 'Build compliance automation platform',
        tone: 'professional'
      };

      const session = await businessPlanMCP.processPrompt(tapInput);
      
      // TAP Compliance: Trust ≥ 4.2, Alignment (schema adherence), Performance < 2s
      const trustCompliant = session.scoreBreakdown.overall >= TEST_CONFIG.minTrustScore;
      const alignmentCompliant = session.validationStatus.isValid;
      // Performance tested separately
      
      this.addResult({
        testName: 'TAP Compliance',
        passed: trustCompliant && alignmentCompliant,
        trustScore: session.scoreBreakdown.overall,
        details: `Trust: ${trustCompliant ? '✅' : '❌'}, Alignment: ${alignmentCompliant ? '✅' : '❌'}`
      });

    } catch (error) {
      this.addResult({
        testName: 'TAP Compliance',
        passed: false,
        details: 'Test failed with error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  }

  private addResult(result: TestResult): void {
    this.results.push(result);
    const status = result.passed ? '✅' : '❌';
    console.log(`  ${status} ${result.testName}: ${result.details}`);
    if (result.errors) {
      result.errors.forEach(error => console.log(`    Error: ${error}`));
    }
  }
}

// Main test execution
export async function runBusinessPlanMCPTests(): Promise<void> {
  const tester = new BusinessPlanMCPTester();
  const results = await tester.runAllTests();
  
  // Generate test report
  const report = {
    timestamp: new Date().toISOString(),
    testSuite: 'Business Plan MCP V4',
    summary: {
      total: results.results.length,
      passed: results.passed,
      failed: results.failed,
      successRate: ((results.passed / results.results.length) * 100).toFixed(1) + '%'
    },
    results: results.results,
    compliance: {
      tapCompliant: results.results.find(r => r.testName === 'TAP Compliance')?.passed || false,
      trustScoreAverage: results.results
        .filter(r => r.trustScore !== undefined)
        .reduce((sum, r) => sum + (r.trustScore || 0), 0) / 
        results.results.filter(r => r.trustScore !== undefined).length,
      emotionalScoreAverage: results.results
        .filter(r => r.emotionalScore !== undefined)
        .reduce((sum, r) => sum + (r.emotionalScore || 0), 0) / 
        results.results.filter(r => r.emotionalScore !== undefined).length
    }
  };

  console.log('\n📋 Final Test Report:');
  console.log(JSON.stringify(report, null, 2));
  
  // Save report to file
  const fs = require('fs');
  fs.writeFileSync(
    `test_results_business_plan_${new Date().toISOString().split('T')[0]}.json`,
    JSON.stringify(report, null, 2)
  );
}

// Run tests if called directly
if (require.main === module) {
  runBusinessPlanMCPTests().catch(console.error);
} 