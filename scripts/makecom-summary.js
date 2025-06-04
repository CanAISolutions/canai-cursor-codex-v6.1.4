#!/usr/bin/env node

/**
 * Make.com Interface Summary Script
 * 
 * Analyzes the CLEAN interface extraction results (filtered from wrong schema)
 * and provides actionable insights for Make.com integration.
 */

const fs = require('fs');

// Find the latest Make.com extraction files
const files = fs.readdirSync('.')
  .filter(f => f.startsWith('makecom-interfaces-report-'))
  .sort()
  .reverse();

if (files.length === 0) {
  console.log('❌ No Make.com interface reports found. Run extract-makecom-interfaces.js first.');
  process.exit(1);
}

const latestReport = files[0];
const latestMapping = latestReport.replace('makecom-interfaces-report-', 'makecom-field-mapping-');
const latestWebhook = latestReport.replace('makecom-interfaces-report-', 'makecom-webhook-structure-');

console.log(`📊 Analyzing CLEAN Make.com extraction: ${latestReport}`);

try {
  // Read the clean files
  const reportData = JSON.parse(fs.readFileSync(latestReport, 'utf8'));
  const mappingData = JSON.parse(fs.readFileSync(latestMapping, 'utf8'));
  const webhookData = JSON.parse(fs.readFileSync(latestWebhook, 'utf8'));
  
  console.log('\n🎯 CLEAN MAKE.COM INTERFACE SUMMARY');
  console.log('=====================================');
  console.log(`🚫 Filtered out: ${reportData.summary.filteredOut}`);
  console.log(`📁 Files scanned: ${reportData.summary.totalFiles}`);
  console.log(`🔧 Interfaces found: ${reportData.summary.totalInterfaces}`);
  console.log(`📋 Unique fields: ${reportData.summary.uniqueFields}`);
  console.log(`⭐ High-value interfaces: ${reportData.summary.highValueInterfaces}`);
  
  console.log('\n🎯 KEY INTERFACES FOR MAKE.COM (CLEAN)');
  console.log('=====================================');
  
  Object.entries(webhookData).forEach(([interfaceName, interfaceData]) => {
    console.log(`\n📋 ${interfaceName}`);
    console.log(`   📁 File: ${interfaceData.filePath}`);
    console.log(`   ⭐ Relevance Score: ${interfaceData.relevanceScore}`);
    console.log(`   🔢 Fields: ${interfaceData.fields.length}`);
    
    // Show required fields
    const requiredFields = interfaceData.fields.filter(f => f.required);
    console.log(`   ✅ Required: ${requiredFields.map(f => f.name).join(', ')}`);
    
    // Show optional fields
    const optionalFields = interfaceData.fields.filter(f => !f.required);
    if (optionalFields.length > 0) {
      console.log(`   ⚪ Optional: ${optionalFields.map(f => f.name).join(', ')}`);
    }
  });
  
  console.log('\n🔥 TOP EMOTIONAL SOVEREIGNTY FIELDS (CLEAN)');
  console.log('=====================================');
  
  const emotionalFields = mappingData.emotionalFields.slice(0, 15);
  emotionalFields.forEach((field, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${field}`);
  });
  
  console.log('\n⚡ TOP SPARKSPLIT FIELDS (CLEAN)');
  console.log('=====================================');
  
  const sparkSplitFields = mappingData.sparkSplitFields.slice(0, 10);
  sparkSplitFields.forEach((field, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${field}`);
  });
  
  console.log('\n🔗 WEBHOOK FIELDS (CLEAN)');
  console.log('=====================================');
  
  const webhookFields = mappingData.webhookFields;
  webhookFields.forEach((field, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${field}`);
  });
  
  console.log('\n🎯 CORE SYSTEM FIELDS (CLEAN)');
  console.log('=====================================');
  
  const coreFields = mappingData.coreFields.slice(0, 15);
  coreFields.forEach((field, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${field}`);
  });
  
  console.log('\n🔗 MAKE.COM WEBHOOK PAYLOAD EXAMPLES (CLEAN)');
  console.log('=====================================');
  
  Object.entries(webhookData).forEach(([interfaceName, interfaceData]) => {
    console.log(`\n📋 ${interfaceName} Webhook Payload:`);
    interfaceData.fields.forEach(field => {
      const required = field.required ? '✅' : '⚪';
      console.log(`   ${required} ${field.name}: ${field.makeComType} (example: ${field.example})`);
    });
  });
  
  console.log('\n🚨 COMPARISON: CLEAN vs POLLUTED RESULTS');
  console.log('=====================================');
  
  // Compare with the polluted results if they exist
  const pollutedFiles = fs.readdirSync('.')
    .filter(f => f.startsWith('field-mapping-2025-05-29T19-15-20-106Z.json'));
  
  if (pollutedFiles.length > 0) {
    const pollutedData = JSON.parse(fs.readFileSync(pollutedFiles[0], 'utf8'));
    
    console.log(`❌ Polluted extraction: ${pollutedData.allUniqueFields.length} fields`);
    console.log(`✅ Clean extraction: ${mappingData.allUniqueFields.length} fields`);
    console.log(`🎯 Reduction: ${((pollutedData.allUniqueFields.length - mappingData.allUniqueFields.length) / pollutedData.allUniqueFields.length * 100).toFixed(1)}% noise removed`);
    
    // Show fields that were filtered out
    const filteredOut = pollutedData.allUniqueFields.filter(field => 
      !mappingData.allUniqueFields.includes(field)
    );
    
    console.log(`🚫 Filtered out ${filteredOut.length} irrelevant fields from wrong schema`);
    console.log(`   Examples: ${filteredOut.slice(0, 10).join(', ')}...`);
  }
  
  console.log('\n💡 MAKE.COM INTEGRATION RECOMMENDATIONS (CLEAN)');
  console.log('=====================================');
  
  console.log('1. 🎯 Focus on these 4 KEY interfaces:');
  Object.keys(webhookData).forEach(interfaceName => {
    console.log(`   - ${interfaceName}`);
  });
  
  console.log('\n2. 🔥 Priority fields for immediate implementation:');
  const priorityFields = [
    ...mappingData.coreFields.slice(0, 5),
    ...mappingData.emotionalFields.slice(0, 5),
    ...mappingData.sparkSplitFields.slice(0, 3),
    ...mappingData.webhookFields.slice(0, 2)
  ];
  priorityFields.forEach((field, index) => {
    console.log(`   ${(index + 1).toString().padStart(2)}. ${field}`);
  });
  
  console.log('\n3. ⚡ Minimum viable webhook payload:');
  console.log('   {');
  console.log('     "sessionId": "sess_abc123",');
  console.log('     "userInput": "Launch coffee shop online presence",');
  console.log('     "productType": "discovery_funnel",');
  console.log('     "emotionalContext": {...},');
  console.log('     "sparkResonance": 0.85,');
  console.log('     "trustScore": 4.2');
  console.log('   }');
  
  console.log('\n4. 🔧 Make.com scenario structure:');
  console.log('   - Webhook trigger → Emotional processing → SparkSplit → Output delivery');
  console.log('   - Use EmotionalSovereigntyRequest for input');
  console.log('   - Use EmotionalSovereigntyResponse for processing');
  console.log('   - Use SparkSplitInput/Output for comparison');
  
  console.log('\n✅ CLEAN EXTRACTION COMPLETE!');
  console.log('=====================================');
  console.log('🎯 Use these CLEAN results for Make.com integration');
  console.log('🚫 Ignore the polluted 2,775-field extraction');
  console.log(`📊 Focus on ${mappingData.allUniqueFields.length} relevant fields instead`);
  
} catch (error) {
  console.error('❌ Error analyzing Make.com extraction:', error.message);
  process.exit(1);
} 