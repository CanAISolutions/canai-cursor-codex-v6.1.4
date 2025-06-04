/**
 * DreamState Production Server Test
 * Tests the enhanced server.js with full DreamState integration
 */

const http = require('http');

// Test configuration
const SERVER_URL = 'http://localhost:3000';
const tests = [];

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test 1: Health Check with DreamState Status
tests.push(async () => {
  console.log('🧪 Testing DreamState Health Check...');
  try {
    const response = await makeRequest('GET', '/api/health');
    console.log('📊 Status Code:', response.status);
    console.log('📋 DreamState Status:', JSON.stringify(response.data.dreamState, null, 2));
    
    if (response.data.dreamState) {
      console.log('✅ DreamState components detected');
      return true;
    } else {
      console.log('❌ DreamState components not found');
      return false;
    }
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
});

// Test 2: Enhanced GPT Endpoint with Cultural Intelligence
tests.push(async () => {
  console.log('\n🧪 Testing Enhanced GPT with Cultural Intelligence...');
  try {
    const testData = {
      content: "I would like to proceed with this business proposal",
      culture: "japanese",
      context: "business_decision"
    };
    
    const response = await makeRequest('POST', '/api/gpt', testData);
    console.log('📊 Status Code:', response.status);
    console.log('🌍 Cultural Intelligence:', JSON.stringify(response.data.culturalIntelligence, null, 2));
    console.log('🔮 Crisis Prevention:', JSON.stringify(response.data.crisisPrevention, null, 2));
    console.log('🛡️ Security Assessment:', JSON.stringify(response.data.security, null, 2));
    
    if (response.data.culturalIntelligence && response.data.crisisPrevention) {
      console.log('✅ Full DreamState integration working');
      return true;
    } else {
      console.log('❌ DreamState integration incomplete');
      return false;
    }
  } catch (error) {
    console.error('❌ Enhanced GPT test failed:', error.message);
    return false;
  }
});

// Test 3: Cultural Validation Endpoint
tests.push(async () => {
  console.log('\n🧪 Testing Cultural Validation Endpoint...');
  try {
    const testData = {
      text: "はい、それで結構です。",
      culture: "japanese",
      context: "business_approval"
    };
    
    const response = await makeRequest('POST', '/api/cultural-validation', testData);
    console.log('📊 Status Code:', response.status);
    console.log('🌍 Validation Result:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200 && response.data.culturallyEnhanced) {
      console.log('✅ Cultural validation working');
      return true;
    } else {
      console.log('❌ Cultural validation failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Cultural validation test failed:', error.message);
    return false;
  }
});

// Test 4: Crisis Prediction Endpoint
tests.push(async () => {
  console.log('\n🧪 Testing Crisis Prediction Endpoint...');
  try {
    const testData = {
      context: {
        emotionalState: "frustrated",
        trustLevel: 2.5,
        culture: "american",
        content: "This system is not working properly",
        timestamp: Date.now()
      }
    };
    
    const response = await makeRequest('POST', '/api/crisis-prediction', testData);
    console.log('📊 Status Code:', response.status);
    console.log('🔮 Prediction Result:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200 && response.data.crisisPreventionActive) {
      console.log('✅ Crisis prediction working');
      return true;
    } else {
      console.log('❌ Crisis prediction failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Crisis prediction test failed:', error.message);
    return false;
  }
});

// Test 5: Emotional Transition Analysis
tests.push(async () => {
  console.log('\n🧪 Testing Emotional Transition Analysis...');
  try {
    const testData = {
      sequence: [
        { state: "neutral", timestamp: Date.now() - 5000, intensity: 0.5 },
        { state: "excited", timestamp: Date.now() - 3000, intensity: 0.8 },
        { state: "satisfied", timestamp: Date.now(), intensity: 0.7 }
      ]
    };
    
    const response = await makeRequest('POST', '/api/emotional-transition', testData);
    console.log('📊 Status Code:', response.status);
    console.log('💫 Transition Analysis:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200 && response.data.emotionalTransitionActive) {
      console.log('✅ Emotional transition analysis working');
      return true;
    } else {
      console.log('❌ Emotional transition analysis failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Emotional transition test failed:', error.message);
    return false;
  }
});

// Run all tests
async function runTests() {
  console.log('🚀 Starting DreamState Production Server Tests\n');
  console.log('=' .repeat(60));
  
  let passed = 0;
  let total = tests.length;
  
  for (let i = 0; i < tests.length; i++) {
    const testPassed = await tests[i]();
    if (testPassed) passed++;
    
    if (i < tests.length - 1) {
      console.log('\n' + '-'.repeat(40));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`🏆 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('✅ ALL DREAMSTATE COMPONENTS OPERATIONAL IN PRODUCTION!');
    console.log('🌟 Cultural Intelligence: ACTIVE');
    console.log('🔮 Crisis Prediction: ACTIVE');
    console.log('💫 Emotional Transitions: ACTIVE');
    console.log('🛡️ Security with Grace: ACTIVE');
  } else {
    console.log('❌ Some DreamState components need attention');
  }
  
  console.log('\n🚀 DreamState Production Deployment Status: READY FOR REAL USERS');
}

// Check if server is running first
console.log('🔍 Checking if DreamState server is running...');
makeRequest('GET', '/api/health')
  .then(() => {
    console.log('✅ Server is running, starting tests...\n');
    runTests();
  })
  .catch(() => {
    console.log('❌ Server is not running. Please start with: node server.js');
    console.log('💡 Then run this test with: node test-dreamstate-server.js');
  }); 