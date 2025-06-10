// Load .env file first
require('dotenv').config();

const { OpenAI } = require('openai');

console.log('Environment test:');
console.log('API key loaded:', !!process.env.OPENAI_API_KEY);

if (!process.env.OPENAI_API_KEY) {
  console.error('No API key found');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    console.log('Testing OpenAI...');
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Say hello' }],
      max_tokens: 10
    });
    
    console.log('Success!');
    console.log('Response:', response.choices[0].message.content);
    console.log('Model:', response.model);
    console.log('Request ID:', response.id);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test(); 