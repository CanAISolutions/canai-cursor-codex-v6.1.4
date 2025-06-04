#!/usr/bin/env node

/**
 * Complete Interface Extraction & Indexing Workflow
 * Runs interface extraction and automatically updates the mapping index
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Complete Interface Analysis Workflow...\n');

try {
  // Step 1: Run interface extraction
  console.log('📊 Step 1: Running Interface Extraction...');
  console.log('=' .repeat(50));
  
  const extractorPath = path.join(__dirname, 'interface-extractor.ts');
  execSync(`npx ts-node "${extractorPath}"`, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Interface extraction completed!\n');
  
  // Step 2: Update mapping index
  console.log('📋 Step 2: Updating Interface Mapping Index...');
  console.log('=' .repeat(50));
  
  const indexerPath = path.join(__dirname, 'update-interface-index.js');
  execSync(`node "${indexerPath}"`, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Interface mapping index updated!\n');
  
  // Step 3: Show summary
  console.log('📈 Step 3: Showing Analysis Summary...');
  console.log('=' .repeat(50));
  
  const samplePath = path.join(__dirname, 'show-interface-sample.js');
  execSync(`node "${samplePath}"`, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n🎉 WORKFLOW COMPLETE!');
  console.log('=' .repeat(50));
  console.log('📄 Generated Files:');
  console.log('   • interface-extraction-report-[timestamp].json');
  console.log('   • interface-extraction-report-[timestamp].md');
  console.log('   • INTERFACE-MAPPING-INDEX.md (updated)');
  console.log('\n💡 Next Steps:');
  console.log('   • Review the mapping index for your reference');
  console.log('   • Use the JSON report for programmatic access');
  console.log('   • Commit the updated index to version control');
  
} catch (error) {
  console.error('\n❌ Workflow failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('   • Ensure TypeScript is installed: npm install typescript');
  console.log('   • Ensure ts-node is available: npm install -g ts-node');
  console.log('   • Check file permissions in the project directory');
  process.exit(1);
} 