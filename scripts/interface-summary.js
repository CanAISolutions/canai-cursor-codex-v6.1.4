#!/usr/bin/env node

/**
 * Interface Summary Script
 * 
 * Analyzes the interface extraction results and provides key insights
 * for Make.com integration and Airtable schema design.
 */

const fs = require('fs');

// Find the latest extraction files
const files = fs.readdirSync('.')
  .filter(f => f.startsWith('interface-extraction-report-'))
  .sort()
  .reverse();

if (files.length === 0) {
  console.log('❌ No interface extraction reports found. Run extract-all-interfaces.js first.');
  process.exit(1);
}

const latestReport = files[0];
const latestMapping = latestReport.replace('interface-extraction-report-', 'field-mapping-');
const latestMakecom = latestReport.replace('interface-extraction-report-', 'makecom-mapping-');

console.log(`📊 Analyzing: ${latestReport}`);

try {
  // Read the files (they might be large, so we'll read selectively)
  const mappingData = JSON.parse(fs.readFileSync(latestMapping, 'utf8'));
  const makecomData = JSON.parse(fs.readFileSync(latestMakecom, 'utf8'));
  
  console.log('\n🔍 INTERFACE EXTRACTION SUMMARY');
  console.log('=====================================');
  
  // Summary stats
  console.log(`📋 Total unique fields found: ${mappingData.allUniqueFields.length}`);
  console.log(`🔧 Core fields: ${mappingData.coreFields.length}`);
  console.log(`💝 Emotional fields: ${mappingData.emotionalFields.length}`);
  console.log(`⚡ SparkSplit fields: ${mappingData.sparkSplitFields.length}`);
  console.log(`🎯 Orchestrator fields: ${mappingData.orchestratorFields.length}`);
  console.log(`📝 MCP fields: ${mappingData.mcpFields.length}`);
  
  console.log('\n🎯 KEY INTERFACES FOR MAKE.COM');
  console.log('=====================================');
  
  Object.entries(makecomData.keyInterfaces).forEach(([interfaceName, interfaceData]) => {
    console.log(`\n📋 ${interfaceName}`);
    console.log(`   📁 File: ${interfaceData.filePath}`);
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
  
  console.log('\n🔥 TOP EMOTIONAL SOVEREIGNTY FIELDS');
  console.log('=====================================');
  
  const emotionalFields = mappingData.emotionalFields.slice(0, 20);
  emotionalFields.forEach((field, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${field}`);
  });
  
  console.log('\n⚡ TOP SPARKSPLIT FIELDS');
  console.log('=====================================');
  
  const sparkSplitFields = mappingData.sparkSplitFields.slice(0, 15);
  sparkSplitFields.forEach((field, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${field}`);
  });
  
  console.log('\n🎯 CORE SYSTEM FIELDS');
  console.log('=====================================');
  
  const coreFields = mappingData.coreFields.slice(0, 25);
  coreFields.forEach((field, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${field}`);
  });
  
  console.log('\n📝 MCP PRODUCT FIELDS');
  console.log('=====================================');
  
  const mcpFields = mappingData.mcpFields.slice(0, 20);
  mcpFields.forEach((field, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${field}`);
  });
  
  // Generate Make.com webhook structure
  console.log('\n🔗 MAKE.COM WEBHOOK PAYLOAD STRUCTURE');
  console.log('=====================================');
  
  if (makecomData.webhookPayloadStructure) {
    Object.entries(makecomData.webhookPayloadStructure).forEach(([interfaceName, structure]) => {
      console.log(`\n📋 ${interfaceName} Webhook Payload:`);
      Object.entries(structure).forEach(([fieldName, fieldInfo]) => {
        const required = fieldInfo.required ? '✅' : '⚪';
        console.log(`   ${required} ${fieldName}: ${fieldInfo.type} (example: ${fieldInfo.example})`);
      });
    });
  }
  
  // Critical missing fields analysis
  console.log('\n🚨 CRITICAL ANALYSIS');
  console.log('=====================================');
  
  const userProvidedFields = [
    "audience", "auditTrail", "behavioralSignals", "changeRate", "clarityIndex",
    "confidenceLevel", "contextRichness", "costUSD", "createdAt", "customerContent",
    "customerPain", "delightFlag", "deliveryCost", "differentiator", "emotionalAlignment",
    "emotionalDepth", "errorType", "executionTimeMs", "fallbackTriggered", "finalOutputApproved",
    "founderBio", "frustrationFlag", "goal", "industry", "innovationScore", "inputs",
    "intent", "modelUsed", "momentumScore", "outputDeltaScore", "outputs", "problemSolved",
    "promptQualityScore", "promptType", "recordId", "resonanceScore", "revisionCount",
    "sessionId", "successFlag", "suggestedImprovement", "tokensUsed", "tone",
    "trustFallbackUsed", "trustScore", "trustSignal", "updatedAt", "userId", "variantIndex"
  ];
  
  const foundFields = new Set(mappingData.allUniqueFields);
  const missingFromExtraction = userProvidedFields.filter(field => !foundFields.has(field));
  const newFieldsFound = mappingData.allUniqueFields.filter(field => !userProvidedFields.includes(field));
  
  console.log(`\n❌ Fields from your list NOT found in codebase: ${missingFromExtraction.length}`);
  if (missingFromExtraction.length > 0) {
    console.log(`   ${missingFromExtraction.join(', ')}`);
  }
  
  console.log(`\n✅ NEW fields found in codebase: ${newFieldsFound.length}`);
  console.log(`   (First 20): ${newFieldsFound.slice(0, 20).join(', ')}`);
  
  console.log(`\n📊 COVERAGE ANALYSIS:`);
  console.log(`   Your list: ${userProvidedFields.length} fields`);
  console.log(`   Codebase total: ${mappingData.allUniqueFields.length} fields`);
  console.log(`   Coverage: ${((userProvidedFields.length / mappingData.allUniqueFields.length) * 100).toFixed(1)}%`);
  console.log(`   Missing: ${((missingFromExtraction.length / userProvidedFields.length) * 100).toFixed(1)}% of your list not found`);
  
  // Generate final recommendations
  console.log('\n💡 RECOMMENDATIONS FOR MAKE.COM');
  console.log('=====================================');
  
  console.log('1. 🎯 Focus on these KEY interfaces:');
  Object.keys(makecomData.keyInterfaces).forEach(name => {
    console.log(`   - ${name}`);
  });
  
  console.log('\n2. 🔥 Priority fields for Airtable schema:');
  const priorityFields = [
    ...mappingData.coreFields.slice(0, 10),
    ...mappingData.emotionalFields.slice(0, 10),
    ...mappingData.sparkSplitFields.slice(0, 5)
  ];
  priorityFields.forEach(field => console.log(`   - ${field}`));
  
  console.log('\n3. ⚡ SparkSplit integration fields:');
  mappingData.sparkSplitFields.slice(0, 10).forEach(field => {
    console.log(`   - ${field}`);
  });
  
  console.log('\n✅ Analysis complete! Use these findings to build your Make.com scenarios.');
  
} catch (error) {
  console.error('❌ Error analyzing files:', error.message);
} 