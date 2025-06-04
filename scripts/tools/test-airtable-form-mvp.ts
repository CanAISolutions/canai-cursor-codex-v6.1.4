#!/usr/bin/env node

/**
 * 🚀 Airtable Form MVP Test Script
 * 
 * Tests the complete MVP flow using Airtable form payload format:
 * Airtable Form → Webhook → Orchestrator → Intent Mirror → Make.com → Analytics
 * 
 * Usage: npm run test:airtable-mvp
 */

import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface AirtableFormPayload {
  userInput: {
    intent: string;
    tone: string;
    industry?: string;
    pain_point?: string;
  };
  sessionId: string;
  productType: string;
  context: {
    preferredTone: string;
    timestamp: string;
    source: string;
    dwellTime: string;
    fieldInteractions: string;
  };
  verificationStatus: string;
}

class AirtableFormMVPTester {
  private apiBaseUrl: string;
  private webhookEndpoint: string;

  constructor() {
    this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    this.webhookEndpoint = '/api/webhook/emotional-sovereignty-bridge';
    
    console.log('🔧 Airtable Form MVP Tester Configuration:');
    console.log(`   API Base URL: ${this.apiBaseUrl}`);
    console.log(`   Webhook Endpoint: ${this.webhookEndpoint}`);
    console.log('');
  }

  /**
   * Generate test payload matching Airtable form structure
   */
  private generateTestPayload(): AirtableFormPayload {
    const sessionId = `airtable-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      userInput: {
        intent: "I want to launch a coffee shop that stands out from the competition with bold, memorable branding that attracts young professionals",
        tone: "bold",
        industry: "coffee",
        pain_point: "Struggling to differentiate from Starbucks and local competitors"
      },
      sessionId,
      productType: 'discovery_funnel',
      context: {
        preferredTone: "bold",
        timestamp: new Date().toISOString(),
        source: 'airtable_form',
        dwellTime: '0',
        fieldInteractions: '4'
      },
      verificationStatus: 'AIRTABLE-FORM-MVP-TEST'
    };
  }

  /**
   * Test the webhook endpoint with Airtable form payload
   */
  async testWebhookEndpoint(): Promise<any> {
    const payload = this.generateTestPayload();
    
    console.log('📤 Testing Webhook Endpoint...');
    console.log(`   Session ID: ${payload.sessionId}`);
    console.log(`   Intent: ${payload.userInput.intent.substring(0, 50)}...`);
    console.log(`   Tone: ${payload.userInput.tone}`);
    console.log('');

    try {
      const response = await fetch(`${this.apiBaseUrl}${this.webhookEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_KEY || 'test-key'}`
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('✅ Webhook Test Successful!');
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(responseData, null, 2)}`);
        return {
          success: true,
          status: response.status,
          data: responseData,
          sessionId: payload.sessionId
        };
      } else {
        console.log('❌ Webhook Test Failed!');
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${JSON.stringify(responseData, null, 2)}`);
        return {
          success: false,
          status: response.status,
          error: responseData,
          sessionId: payload.sessionId
        };
      }
    } catch (error) {
      console.log('❌ Webhook Request Failed!');
      console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        sessionId: payload.sessionId
      };
    }
  }

  /**
   * Test multiple scenarios to validate robustness
   */
  async testMultipleScenarios(): Promise<void> {
    const scenarios = [
      {
        name: 'Bold Coffee Shop',
        payload: {
          intent: "Launch a bold coffee shop with memorable branding",
          tone: "bold",
          industry: "coffee",
          pain_point: "Standing out from competition"
        }
      },
      {
        name: 'Calm Consulting',
        payload: {
          intent: "Build a professional consulting practice with calm, trustworthy presence",
          tone: "calm",
          industry: "consulting",
          pain_point: "Building credibility in crowded market"
        }
      },
      {
        name: 'Playful Bakery',
        payload: {
          intent: "Create a fun, community-focused bakery that brings joy to families",
          tone: "playful",
          industry: "bakery",
          pain_point: "Connecting with local community"
        }
      },
      {
        name: 'Luxury Fitness',
        payload: {
          intent: "Establish premium fitness studio for high-end clientele",
          tone: "luxury",
          industry: "fitness",
          pain_point: "Justifying premium pricing"
        }
      }
    ];

    console.log('🎯 Testing Multiple Scenarios...');
    console.log('');

    const results = [];

    for (const scenario of scenarios) {
      console.log(`📋 Testing: ${scenario.name}`);
      
      const testPayload: AirtableFormPayload = {
        userInput: scenario.payload,
        sessionId: `airtable-${scenario.name.toLowerCase().replace(' ', '-')}-${Date.now()}`,
        productType: 'discovery_funnel',
        context: {
          preferredTone: scenario.payload.tone,
          timestamp: new Date().toISOString(),
          source: 'airtable_form',
          dwellTime: '0',
          fieldInteractions: '4'
        },
        verificationStatus: 'AIRTABLE-FORM-MVP-SCENARIO-TEST'
      };

      try {
        const response = await fetch(`${this.apiBaseUrl}${this.webhookEndpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_KEY || 'test-key'}`
          },
          body: JSON.stringify(testPayload)
        });

        const responseData = await response.json();
        
        if (response.ok) {
          console.log(`   ✅ ${scenario.name}: Success (${response.status})`);
          results.push({
            scenario: scenario.name,
            success: true,
            status: response.status,
            sessionId: testPayload.sessionId,
            trustScore: responseData.emotionalArc?.finalTrustScore || 'N/A'
          });
        } else {
          console.log(`   ❌ ${scenario.name}: Failed (${response.status})`);
          results.push({
            scenario: scenario.name,
            success: false,
            status: response.status,
            sessionId: testPayload.sessionId,
            error: responseData
          });
        }
      } catch (error) {
        console.log(`   ❌ ${scenario.name}: Error - ${error instanceof Error ? error.message : 'Unknown'}`);
        results.push({
          scenario: scenario.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          sessionId: testPayload.sessionId
        });
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('');
    console.log('📊 Scenario Test Results:');
    console.log('========================');
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const trustScore = result.trustScore ? ` (Trust: ${result.trustScore})` : '';
      console.log(`   ${status} ${result.scenario}${trustScore}`);
    });
    
    console.log('');
    console.log(`🎯 Overall Success Rate: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)`);
    
    if (successCount === totalCount) {
      console.log('🎉 All scenarios passed! Airtable Form MVP is ready for deployment.');
    } else {
      console.log('⚠️  Some scenarios failed. Check logs for debugging information.');
    }
  }

  /**
   * Validate environment configuration
   */
  validateEnvironment(): boolean {
    const required = ['API_BASE_URL', 'AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.log('❌ Missing required environment variables:');
      missing.forEach(key => console.log(`   - ${key}`));
      console.log('');
      console.log('💡 Please check your .env.local file contains:');
      console.log('   API_BASE_URL=https://your-domain.com');
      console.log('   AIRTABLE_API_KEY=your_api_key');
      console.log('   AIRTABLE_BASE_ID=your_base_id');
      return false;
    }
    
    console.log('✅ Environment configuration validated');
    console.log('');
    return true;
  }

  /**
   * Run complete MVP test suite
   */
  async runCompleteTest(): Promise<void> {
    console.log('🚀 Airtable Form MVP Test Suite');
    console.log('================================');
    console.log('');

    // Validate environment
    if (!this.validateEnvironment()) {
      process.exit(1);
    }

    // Test single webhook
    console.log('🔍 Phase 1: Single Webhook Test');
    console.log('-------------------------------');
    const singleTest = await this.testWebhookEndpoint();
    console.log('');

    if (!singleTest.success) {
      console.log('❌ Single webhook test failed. Aborting scenario tests.');
      process.exit(1);
    }

    // Test multiple scenarios
    console.log('🎯 Phase 2: Multiple Scenario Tests');
    console.log('-----------------------------------');
    await this.testMultipleScenarios();
    console.log('');

    console.log('🎉 Airtable Form MVP Test Suite Complete!');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('   1. Create Airtable form with the tested field structure');
    console.log('   2. Configure Airtable automation webhook');
    console.log('   3. Test form submission → webhook → orchestrator flow');
    console.log('   4. Validate Make.com scenario triggering');
    console.log('   5. Check analytics data in Airtable tables');
  }
}

// Run the test if called directly
if (require.main === module) {
  const tester = new AirtableFormMVPTester();
  tester.runCompleteTest().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

export { AirtableFormMVPTester }; 