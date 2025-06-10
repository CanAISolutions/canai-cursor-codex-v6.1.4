/* global require, module, setTimeout */
/**
 * Super Basic MCP - Bare Bones API Integration Test (JavaScript)
 * Purpose: Validate MCP pattern and API integration
 */

class SimpleMCP {
  
  /**
   * Basic field inference - enhance minimal input
   */
  applyBasicEnhancers(input) {
    return {
      message: input.message,
      tone: input.tone || 'professional' // Default tone if not provided
    };
  }

  /**
   * Simulate API call to enhance message
   */
  async callEnhancementAPI(message, tone) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Basic enhancement based on tone
      const enhancements = {
        professional: `${message} [Enhanced with professional clarity and structure]`,
        casual: `${message} [Enhanced with casual, approachable language]`,
        friendly: `${message} [Enhanced with warm, friendly tone]`
      };
      
      return enhancements[tone] || message;
      
    } catch (error) {
      console.error('API call failed:', error);
      return `${message} [Enhancement failed, using original]`;
    }
  }

  /**
   * Main MCP processing function
   */
  async process(input) {
    try {
      console.log('🔄 Starting Simple MCP processing...');
      
      // Validate input
      if (!input || !input.message) {
        throw new Error('Message is required');
      }
      
      // 1. Apply basic field inference
      const enhanced = this.applyBasicEnhancers(input);
      console.log('✅ Field inference applied:', enhanced);
      
      // 2. Call enhancement API
      const enhancedMessage = await this.callEnhancementAPI(enhanced.message, enhanced.tone);
      console.log('✅ API enhancement completed');
      
      // 3. Return structured result
      const result = {
        success: true,
        data: {
          originalMessage: input.message,
          enhancedMessage: enhancedMessage,
          tone: enhanced.tone,
          timestamp: new Date().toISOString(),
          apiCalled: true
        }
      };
      
      console.log('✅ Simple MCP processing complete:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Simple MCP processing failed:', error);
      return {
        success: false,
        data: {
          originalMessage: (input && input.message) || '',
          enhancedMessage: (input && input.message) || '',
          tone: (input && input.tone) || 'professional',
          timestamp: new Date().toISOString(),
          apiCalled: false
        },
        error: error.message || 'Unknown error'
      };
    }
  }
}

/**
 * Test function to validate MCP works
 */
async function testSimpleMCP() {
  console.log('🚀 Testing Simple MCP...');
  
  const mcp = new SimpleMCP();
  
  // Test 1: Basic message with default tone
  console.log('\n--- Test 1: Basic message with default tone ---');
  const test1 = await mcp.process({
    message: "I want to start a coffee shop"
  });
  console.log('Test 1 Result:', test1);
  
  // Test 2: Message with specific tone
  console.log('\n--- Test 2: Message with specific tone ---');
  const test2 = await mcp.process({
    message: "I need help with my business plan",
    tone: 'friendly'
  });
  console.log('Test 2 Result:', test2);
  
  // Test 3: Empty message (error handling)
  console.log('\n--- Test 3: Empty message (error handling) ---');
  const test3 = await mcp.process({
    message: ""
  });
  console.log('Test 3 Result:', test3);
  
  // Test 4: No input (error handling)
  console.log('\n--- Test 4: No input (error handling) ---');
  const test4 = await mcp.process(null);
  console.log('Test 4 Result:', test4);
  
  const summary = {
    test1: test1.success,
    test2: test2.success,
    test3: test3.success,
    test4: test4.success,
    totalTests: 4,
    passedTests: [test1.success, test2.success, test3.success, test4.success].filter(Boolean).length
  };
  
  console.log('\n🎯 Test Summary:', summary);
  
  return summary;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SimpleMCP, testSimpleMCP };
}

/**
 * Direct execution for testing
 */
if (typeof require !== 'undefined' && require.main === module) {
  testSimpleMCP().then(results => {
    console.log('\n🏆 Final Results:', results);
    if (results.passedTests === results.totalTests) {
      console.log('✅ ALL TESTS PASSED - Simple MCP working perfectly!');
    } else {
      console.log(`⚠️ ${results.passedTests}/${results.totalTests} tests passed`);
    }
  });
} 