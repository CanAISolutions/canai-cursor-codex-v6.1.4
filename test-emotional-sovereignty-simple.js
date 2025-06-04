const http = require('http');

async function testEmotionalSovereignty() {
  console.log('🧪 Testing DreamState Emotional Sovereignty Core...');
  
  try {
    const response = await makeRequest('/api/emotional-sovereignty', {
      content: 'I am absolutely thrilled and excited about this amazing opportunity!',
      sessionId: 'test_session_joy',
      context: { culture: 'american' }
    });

    console.log('\n📊 Joy Analysis Results:');
    console.log('   Detected Emotion:', response.emotionalState.primaryEmotion);
    console.log('   Intensity:', response.emotionalState.intensity.toFixed(2));
    console.log('   Complexity:', response.emotionalState.emotionalComplexity.toFixed(2));
    console.log('   Predicted Need:', response.emotionalPrediction.predictedNeed);
    console.log('   UX Adapted:', response.uxAdaptation.adapted);
    
    if (response.uxAdaptation.adapted) {
      console.log('   Color Scheme:', response.uxAdaptation.colorScheme.emotion);
      console.log('   Typography:', response.uxAdaptation.typography.style);
      console.log('   Animation:', response.uxAdaptation.animations.type);
    }
    
    console.log('\n✅ Emotional Sovereignty Core is working!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
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

testEmotionalSovereignty(); 