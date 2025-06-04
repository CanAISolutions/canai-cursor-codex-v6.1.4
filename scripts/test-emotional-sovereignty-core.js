/**
 * Test script for DreamState Emotional Sovereignty Core
 */

const http = require('http');

async function testEmotionalSovereignty() {
  console.log('🧪 Testing DreamState Emotional Sovereignty Core...');
  
  const testCases = [
    {
      name: 'Joy Analysis',
      content: 'I am absolutely thrilled and excited about this amazing opportunity!',
      sessionId: 'test_session_joy',
      expectedEmotion: 'joy'
    },
    {
      name: 'Trust Analysis', 
      content: 'I feel confident and secure about moving forward with this plan.',
      sessionId: 'test_session_trust',
      expectedEmotion: 'trust'
    },
    {
      name: 'Fear Analysis',
      content: 'I am really worried and anxious about what might happen next.',
      sessionId: 'test_session_fear', 
      expectedEmotion: 'fear'
    },
    {
      name: 'Complex Emotional State',
      content: 'I am excited about the opportunity but also nervous about the challenges ahead.',
      sessionId: 'test_session_complex',
      expectedEmotion: 'anticipation'
    }
  ];

  for (const testCase of testCases) {
    try {
      const response = await makeRequest('/api/emotional-sovereignty', {
        content: testCase.content,
        sessionId: testCase.sessionId,
        context: { culture: 'american' }
      });

      console.log(`\n📊 ${testCase.name}:`);
      console.log(`   Content: "${testCase.content}"`);
      console.log(`   Detected Emotion: ${response.emotionalState.primaryEmotion}`);
      console.log(`   Intensity: ${response.emotionalState.intensity.toFixed(2)}`);
      console.log(`   Complexity: ${response.emotionalState.emotionalComplexity.toFixed(2)}`);
      console.log(`   Predicted Need: ${response.emotionalPrediction.predictedNeed}`);
      console.log(`   UX Adapted: ${response.uxAdaptation.adapted}`);
      
      if (response.uxAdaptation.adapted) {
        console.log(`   Color Scheme: ${response.uxAdaptation.colorScheme.emotion}`);
        console.log(`   Typography: ${response.uxAdaptation.typography.style}`);
        console.log(`   Animation: ${response.uxAdaptation.animations.type}`);
      }
      
    } catch (error) {
      console.error(`❌ ${testCase.name} failed:`, error.message);
    }
  }
}

function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
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
          const parsed = JSON.parse(responseData);
          if (res.statusCode === 200) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.error || 'Unknown error'}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
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

// Run the test
testEmotionalSovereignty().then(() => {
  console.log('\n✅ Emotional Sovereignty Core testing completed');
}).catch((error) => {
  console.error('❌ Testing failed:', error);
});
