/**
 * Setup Script for OpenAI API Test
 * 
 * This script helps set up the environment for testing the AI Blueprint with real OpenAI API
 * 
 * Date: 2025-01-30
 * Version: Setup Helper
 */

const fs = require('fs');
const path = require('path');

function setupOpenAITest() {
  console.log('🛠️  OpenAI API Test Setup');
  console.log('========================');
  
  // Check if .env file exists
  const envPath = '.env';
  const envExists = fs.existsSync(envPath);
  
  if (!envExists) {
    console.log('📄 Creating .env file...');
    
    const envContent = `# CanAI Cursor Codex Environment Variables
# Add your OpenAI API key below

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Override default model
OPENAI_MODEL=gpt-4-turbo

# Optional: API timeout settings
OPENAI_TIMEOUT=30000

# Test Environment Settings
NODE_ENV=development
DEBUG=true`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file');
    console.log('');
    console.log('⚠️  IMPORTANT: You need to add your actual OpenAI API key!');
    console.log('');
    console.log('Steps to complete setup:');
    console.log('1. Get your API key from: https://platform.openai.com/api-keys');
    console.log('2. Open the .env file');
    console.log('3. Replace "your_openai_api_key_here" with your actual API key');
    console.log('4. Save the file');
    console.log('');
  } else {
    console.log('✅ .env file already exists');
    
    // Check if API key is set
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('your_openai_api_key_here')) {
      console.log('⚠️  OpenAI API key not set in .env file');
      console.log('');
      console.log('Please:');
      console.log('1. Open the .env file');
      console.log('2. Replace "your_openai_api_key_here" with your actual API key');
      console.log('3. Get API key from: https://platform.openai.com/api-keys');
      console.log('');
    } else {
      console.log('✅ OpenAI API key appears to be configured');
    }
  }
  
  // Check if required dependencies are installed
  console.log('🔍 Checking dependencies...');
  
  const packageJsonPath = 'package.json';
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const requiredDeps = ['openai', 'dotenv'];
    const missingDeps = requiredDeps.filter(dep => !deps[dep]);
    
    if (missingDeps.length > 0) {
      console.log('❌ Missing dependencies:', missingDeps.join(', '));
      console.log('');
      console.log('Install missing dependencies:');
      console.log(`npm install ${missingDeps.join(' ')}`);
      console.log('');
    } else {
      console.log('✅ All required dependencies are installed');
    }
  }
  
  // Check TypeScript setup
  console.log('🔍 Checking TypeScript setup...');
  
  const tsConfigPath = 'tsconfig.json';
  if (fs.existsSync(tsConfigPath)) {
    console.log('✅ TypeScript configuration found');
  } else {
    console.log('⚠️  No tsconfig.json found - TypeScript may not be properly configured');
  }
  
  // Check if ai_blueprint.mcp.ts exists
  const aiBlueprintPath = 'prompts/ai_blueprint.mcp.ts';
  if (fs.existsSync(aiBlueprintPath)) {
    console.log('✅ AI Blueprint MCP file found');
  } else {
    console.log('❌ AI Blueprint MCP file not found at:', aiBlueprintPath);
    console.log('   Make sure the file exists before running tests');
  }
  
  console.log('');
  console.log('🚀 Setup Complete!');
  console.log('');
  console.log('To run the OpenAI API test:');
  console.log('');
  console.log('Option 1 (if ts-node is available):');
  console.log('  npx ts-node test_ai_blueprint_openai_real_api.js');
  console.log('');
  console.log('Option 2 (using tsx):');
  console.log('  npx tsx test_ai_blueprint_openai_real_api.js');
  console.log('');
  console.log('Option 3 (compile first):');
  console.log('  npm run build');
  console.log('  node test_ai_blueprint_openai_real_api.js');
  console.log('');
  console.log('Option 4 (direct node):');
  console.log('  node test_ai_blueprint_openai_real_api.js');
  console.log('');
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupOpenAITest();
}

module.exports = { setupOpenAITest }; 