/**
 * Test script for Simple MCP API endpoint
 */
const http = require('http');

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testMCPAPI() {
  console.log('🚀 Testing Simple MCP API...');
  
  const baseOptions = {
    hostname: 'localhost',
    port: 3000,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  try {
    // Test 1: Valid message with tone
    console.log('\n--- Test 1: Valid message with tone ---');
    const response1 = await makeRequest({
      ...baseOptions,
      path: '/api/simple-mcp'
    }, {
      message: "I want to start a coffee shop",
      tone: "friendly"
    });
    console.log('✅ Response 1:', JSON.stringify(response1, null, 2));
    
    // Test 2: Valid message without tone (should default)
    console.log('\n--- Test 2: Valid message without tone ---');
    const response2 = await makeRequest({
      ...baseOptions,
      path: '/api/simple-mcp'
    }, {
      message: "I need help with my business plan"
    });
    console.log('✅ Response 2:', JSON.stringify(response2, null, 2));
    
    // Test 3: Missing message (should error gracefully)
    console.log('\n--- Test 3: Missing message (error handling) ---');
    const response3 = await makeRequest({
      ...baseOptions,
      path: '/api/simple-mcp'
    }, {
      tone: "professional"
    });
    console.log('✅ Response 3:', JSON.stringify(response3, null, 2));
    
    // Test 4: Health check
    console.log('\n--- Test 4: Health check ---');
    const response4 = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      method: 'GET',
      path: '/api/health'
    });
    console.log('✅ Health Response:', JSON.stringify(response4, null, 2));
    
    console.log('\n🎯 Simple MCP API Tests Complete!');
    
    return {
      test1: response1.status === 200,
      test2: response2.status === 200,
      test3: response3.status === 400, // We expect a 400 error
      test4: response4.status === 200,
      allWorking: response1.status === 200 && response2.status === 200 && response3.status === 400 && response4.status === 200
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n💡 Make sure the server is running: node server.js');
    return { error: error.message };
  }
}

// Run tests if called directly
if (require.main === module) {
  testMCPAPI().then(results => {
    console.log('\n🏆 Final Test Results:', results);
    if (results.allWorking) {
      console.log('✅ ALL TESTS PASSED - Simple MCP API working perfectly!');
    } else if (results.error) {
      console.log('❌ Test execution failed - is the server running?');
    } else {
      console.log('⚠️ Some tests failed - check responses above');
    }
  });
}

module.exports = { testMCPAPI }; 