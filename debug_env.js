const fs = require('fs');

console.log('Environment debugging:');

// Try dotenv first
require('dotenv').config({ path: '.env.local' });
console.log('Dotenv API Key exists:', !!process.env.OPENAI_API_KEY);

// Read file directly
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  console.log('File content length:', envContent.length);
  
  // Look for OPENAI_API_KEY
  const lines = envContent.split('\n');
  let apiKeyLine = '';
  let foundKey = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('OPENAI_API_KEY=')) {
      foundKey = true;
      apiKeyLine = lines[i];
      // Check if key continues on next lines
      let j = i + 1;
      while (j < lines.length && !lines[j].includes('=') && lines[j].trim() !== '') {
        apiKeyLine += lines[j];
        j++;
      }
      break;
    }
  }
  
  if (foundKey) {
    const apiKey = apiKeyLine.replace('OPENAI_API_KEY=', '').replace(/\n/g, '').trim();
    console.log('✅ API Key found in file');
    console.log('API Key length:', apiKey.length);
    console.log('API Key starts with sk-:', apiKey.startsWith('sk-'));
    console.log('First 10 chars:', apiKey.substring(0, 10));
  } else {
    console.log('❌ API Key not found in file');
  }
  
} catch (error) {
  console.error('Error reading file:', error.message);
} 