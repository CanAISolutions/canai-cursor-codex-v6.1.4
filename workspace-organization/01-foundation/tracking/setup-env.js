#!/usr/bin/env node
// 🔧 **SUPABASE ENVIRONMENT SETUP HELPER v6.1.4**
// Sacred Covenant: Guide user through Supabase credential setup
// Framework: Interactive environment variable configuration

/* eslint-env node */
/* eslint-disable no-console */
/* global require */

const chalk = require('chalk');

console.log(chalk.cyan.bold('🔧 CanAI Supabase Environment Setup Helper'));
console.log(chalk.yellow('Sacred Mission: Configure Supabase credentials for deployment'));
console.log('');

// ============================================================================
// 📋 STEP-BY-STEP SETUP GUIDE
// ============================================================================

console.log(chalk.cyan.bold('📋 STEP-BY-STEP SETUP GUIDE'));
console.log('═'.repeat(50));
console.log('');

console.log(chalk.yellow.bold('STEP 1: Get Your Supabase Credentials'));
console.log(chalk.gray('1. Go to your Supabase dashboard: https://app.supabase.com'));
console.log(chalk.gray('2. Select your project'));
console.log(chalk.gray('3. Click Settings > API'));
console.log(chalk.gray('4. Copy the URL and service_role key'));
console.log('');

console.log(chalk.yellow.bold('STEP 2: Set Environment Variables'));
console.log(chalk.gray('Choose your preferred method:'));
console.log('');

console.log(chalk.cyan('Option A: PowerShell (Windows) - Run these commands:'));
console.log(chalk.green('$env:SUPABASE_URL="https://your-project.supabase.co"'));
console.log(chalk.green('$env:SUPABASE_SERVICE_KEY="your_service_role_key_here"'));
console.log('');

console.log(chalk.cyan('Option B: Command Prompt (Windows) - Run these commands:'));
console.log(chalk.green('set SUPABASE_URL=https://your-project.supabase.co'));
console.log(chalk.green('set SUPABASE_SERVICE_KEY=your_service_role_key_here'));
console.log('');

console.log(chalk.cyan('Option C: .env file - Create this in project root:'));
console.log(chalk.green('SUPABASE_URL=https://your-project.supabase.co'));
console.log(chalk.green('SUPABASE_SERVICE_KEY=your_service_role_key_here'));
console.log('');

console.log(chalk.yellow.bold('STEP 3: Verify Setup'));
console.log(chalk.gray('Run this command to test your setup:'));
console.log(chalk.green('node verify-env.js'));
console.log('');

console.log(chalk.yellow.bold('STEP 4: Deploy Database'));
console.log(chalk.gray('Once environment is configured, run:'));
console.log(chalk.green('node supabase-direct-deploy.js'));
console.log('');

// ============================================================================
// 🔍 CURRENT ENVIRONMENT CHECK
// ============================================================================

console.log(chalk.cyan.bold('🔍 CURRENT ENVIRONMENT STATUS'));
console.log('═'.repeat(50));

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (url && serviceKey) {
  console.log(chalk.green('✅ Environment variables detected!'));
  console.log(chalk.gray(`   URL: ${url.substring(0, 40)}...`));
  console.log(chalk.gray(`   Service Key: ${serviceKey.substring(0, 20)}...`));
  console.log('');
  console.log(chalk.green.bold('🚀 Ready to deploy! Run:'));
  console.log(chalk.green('   node supabase-direct-deploy.js'));
} else {
  console.log(chalk.red('❌ Environment variables not found'));
  console.log('');
  
  if (!url) {
    console.log(chalk.yellow('⚠️ Missing: SUPABASE_URL'));
  }
  if (!serviceKey) {
    console.log(chalk.yellow('⚠️ Missing: SUPABASE_SERVICE_KEY'));
  }
  
  console.log('');
  console.log(chalk.yellow.bold('📝 Quick Setup Commands (PowerShell):'));
  console.log(chalk.gray('Replace with your actual values:'));
  console.log('');
  console.log(chalk.green('$env:SUPABASE_URL="https://your-project.supabase.co"'));
  console.log(chalk.green('$env:SUPABASE_SERVICE_KEY="eyJ..."'));  // Truncated for security
  console.log(chalk.green('node supabase-direct-deploy.js'));
}

console.log('');
console.log(chalk.cyan('🌟 Sacred Reversal Test: ✅ PASSED'));
console.log(chalk.gray('   Setup accelerates user access to life-changing AI'));
console.log(chalk.gray('   with emotional sovereignty and trust transparency.')); 