// test-emotional-api.js
// Simple test to verify emotional intelligence integration

const http = require('http');

const testData = JSON.stringify({
  content: "I am feeling frustrated with this feature"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/gpt',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
};

console.log('🧪 Testing Emotional Intelligence API Integration...');

const req = http.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('\n✅ SUCCESS! Emotional Intelligence Response:');
      console.log(JSON.stringify(response, null, 2));
      
      // Validate emotional intelligence features
      if (response.emotionalContext) {
        console.log('\n🧠 Emotional Intelligence Features Detected:');
        console.log(`   Tone: ${response.emotionalContext.tone}`);
        console.log(`   Trust Score: ${response.emotionalContext.trustScore}`);
        console.log(`   Intensity: ${response.emotionalContext.intensity}`);
        console.log(`   Stability: ${response.emotionalContext.stability}`);
        console.log(`   Resonance: ${response.emotionalContext.resonanceQuality}`);
        
        if (response.processing?.emotionallyEnhanced) {
          console.log('\n🎉 INTEGRATION SUCCESS: Emotional intelligence is working!');
        }
      } else {
        console.log('\n❌ No emotional context found in response');
      }
    } catch (error) {
      console.log('\n❌ Error parsing response:', error.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.log('\n💡 Make sure the server is running: node server.js');
});

req.write(testData);
req.end(); 