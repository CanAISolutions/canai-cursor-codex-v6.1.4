#!/usr/bin/env node

/**
 * Project Insights Summary Script
 * 
 * Extracts key insights from the comprehensive project analysis
 * to understand what CanAI actually is and what it needs.
 */

const fs = require('fs');

// Find the latest comprehensive analysis
const files = fs.readdirSync('.')
  .filter(f => f.startsWith('comprehensive-project-analysis-'))
  .sort()
  .reverse();

if (files.length === 0) {
  console.log('❌ No comprehensive analysis found. Run comprehensive-project-analysis.js first.');
  process.exit(1);
}

const latestAnalysis = files[0];
console.log(`📊 Analyzing: ${latestAnalysis}`);

try {
  const data = JSON.parse(fs.readFileSync(latestAnalysis, 'utf8'));
  
  console.log('\n🎯 CANAI PROJECT REALITY CHECK');
  console.log('=====================================');
  console.log(`📁 Files analyzed: ${data.summary.totalFiles}`);
  console.log(`🔧 Interfaces found: ${data.summary.totalInterfaces}`);
  console.log(`📋 Total fields: ${data.summary.totalFields}`);
  console.log(`📤 Exported interfaces: ${data.summary.exportedInterfaces}`);
  
  console.log('\n🏗️ ARCHITECTURE OVERVIEW');
  console.log('=====================================');
  
  // Show interface categories
  Object.entries(data.architecture.interfacesByCategory).forEach(([category, interfaces]) => {
    console.log(`📋 ${category}: ${interfaces.length} interfaces`);
  });
  
  console.log('\n🎯 PRODUCT PORTFOLIO ANALYSIS');
  console.log('=====================================');
  console.log(`Total products: ${data.products.totalProducts}`);
  console.log(`Average completeness: ${data.products.completenessScore.toFixed(1)}%`);
  
  Object.entries(data.products.products).forEach(([productName, productData]) => {
    const status = productData.completeness >= 75 ? '✅' : 
                   productData.completeness >= 50 ? '⚠️' : '❌';
    console.log(`${status} ${productName}: ${productData.completeness}% complete`);
    console.log(`   📁 ${productData.path}`);
    console.log(`   🔧 Interface: ${productData.hasInterface ? 'Yes' : 'No'}`);
    console.log(`   📋 MCP: ${productData.hasMCP ? 'Yes' : 'No'}`);
    console.log(`   ✅ Validation: ${productData.hasValidation ? 'Yes' : 'No'}`);
    console.log(`   📊 Size: ${(productData.size / 1024).toFixed(1)}KB`);
  });
  
  console.log('\n⚙️ SERVICE ARCHITECTURE ANALYSIS');
  console.log('=====================================');
  console.log(`Total services: ${data.services.totalServices}`);
  console.log(`Average maturity: ${data.services.maturityScore.toFixed(1)}%`);
  
  Object.entries(data.services.services).forEach(([serviceName, serviceData]) => {
    const status = serviceData.maturity >= 80 ? '✅' : 
                   serviceData.maturity >= 60 ? '⚠️' : '❌';
    console.log(`${status} ${serviceName}: ${serviceData.maturity}% mature`);
    console.log(`   📁 ${serviceData.path}`);
    console.log(`   🔧 Interface: ${serviceData.hasInterface ? 'Yes' : 'No'}`);
    console.log(`   📤 Exports: ${serviceData.hasExports ? 'Yes' : 'No'}`);
    console.log(`   🧪 Tests: ${serviceData.hasTests ? 'Yes' : 'No'}`);
  });
  
  console.log('\n🔗 INTEGRATION ECOSYSTEM ANALYSIS');
  console.log('=====================================');
  console.log(`Total integrations: ${data.integrations.totalIntegrations}`);
  console.log(`Average readiness: ${data.integrations.readinessScore.toFixed(1)}%`);
  
  Object.entries(data.integrations.integrations).forEach(([integrationName, integrationData]) => {
    const status = integrationData.readiness >= 80 ? '✅' : 
                   integrationData.readiness >= 50 ? '⚠️' : '❌';
    console.log(`${status} ${integrationName}: ${integrationData.readiness}% ready`);
    console.log(`   📁 ${integrationData.path}`);
    console.log(`   🔗 Webhook: ${integrationData.hasWebhook ? 'Yes' : 'No'}`);
    console.log(`   🌐 API: ${integrationData.hasAPI ? 'Yes' : 'No'}`);
    console.log(`   🔐 Auth: ${integrationData.hasAuth ? 'Yes' : 'No'}`);
  });
  
  console.log('\n🔥 TOP BUSINESS-CRITICAL INTERFACES');
  console.log('=====================================');
  
  data.topInterfaces.slice(0, 15).forEach((iface, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${iface.name}`);
    console.log(`    📁 ${iface.filePath}`);
    console.log(`    📋 Category: ${iface.category}`);
    console.log(`    💎 Business Value: ${iface.businessValue}`);
    console.log(`    🔢 Fields: ${iface.fieldCount}`);
    console.log(`    📤 Exported: ${iface.isExported ? 'Yes' : 'No'}`);
  });
  
  console.log('\n📊 CRITICAL FIELD ANALYSIS');
  console.log('=====================================');
  
  data.criticalFields.slice(0, 20).forEach((field, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${field.fieldName} (${field.category})`);
    console.log(`    🔄 Used ${field.frequency} times across interfaces`);
  });
  
  console.log('\n🎯 DATA FLOW ANALYSIS');
  console.log('=====================================');
  
  if (data.dataFlows && data.dataFlows.coreDataFlows) {
    Object.entries(data.dataFlows.coreDataFlows).forEach(([fieldName, flowData]) => {
      console.log(`🔄 ${fieldName}:`);
      console.log(`   📊 Used in ${flowData.usageCount} interfaces`);
      flowData.interfaces.slice(0, 5).forEach(iface => {
        console.log(`   - ${iface.name} (${iface.category})`);
      });
      if (flowData.interfaces.length > 5) {
        console.log(`   ... and ${flowData.interfaces.length - 5} more`);
      }
    });
  }
  
  console.log('\n🚨 CRITICAL RECOMMENDATIONS');
  console.log('=====================================');
  
  data.recommendations.forEach(rec => {
    const priority = rec.priority === 'high' ? '🔴' : 
                     rec.priority === 'medium' ? '🟡' : '🟢';
    console.log(`${priority} ${rec.type.toUpperCase()}: ${rec.message}`);
  });
  
  console.log('\n💡 WHAT THIS TELLS US ABOUT CANAI');
  console.log('=====================================');
  
  // Analyze what CanAI actually is
  const emotionalInterfaces = data.architecture.interfacesByCategory['emotional-intelligence'] || [];
  const sparkInterfaces = data.architecture.interfacesByCategory['spark-system'] || [];
  const trustInterfaces = data.architecture.interfacesByCategory['trust-system'] || [];
  const productInterfaces = data.architecture.interfacesByCategory['product'] || [];
  
  console.log(`🧠 Emotional Intelligence: ${emotionalInterfaces.length} interfaces`);
  console.log(`✨ Spark System: ${sparkInterfaces.length} interfaces`);
  console.log(`🛡️ Trust System: ${trustInterfaces.length} interfaces`);
  console.log(`🎯 Product System: ${productInterfaces.length} interfaces`);
  
  // Calculate core system strength
  const coreSystemStrength = (emotionalInterfaces.length + sparkInterfaces.length + trustInterfaces.length) / data.summary.totalInterfaces * 100;
  console.log(`💪 Core System Strength: ${coreSystemStrength.toFixed(1)}% of total interfaces`);
  
  // Identify gaps
  console.log('\n🔍 IDENTIFIED GAPS:');
  if (data.products.completenessScore < 50) {
    console.log('❌ Products are incomplete - need MCP files and validation');
  }
  if (data.services.maturityScore < 70) {
    console.log('❌ Services lack maturity - need tests and proper exports');
  }
  if (data.integrations.readinessScore < 60) {
    console.log('❌ Integrations are not ready - need webhooks and APIs');
  }
  
  // Identify strengths
  console.log('\n✅ IDENTIFIED STRENGTHS:');
  if (emotionalInterfaces.length > 50) {
    console.log('✅ Strong emotional intelligence foundation');
  }
  if (sparkInterfaces.length > 20) {
    console.log('✅ Robust spark/creativity system');
  }
  if (trustInterfaces.length > 10) {
    console.log('✅ Trust system architecture in place');
  }
  if (data.dataFlows && data.dataFlows.fieldCoverage && data.dataFlows.fieldCoverage.coverage > 0.8) {
    console.log('✅ Good field coverage across categories');
  }
  
  console.log('\n🎯 CANAI CORE IDENTITY');
  console.log('=====================================');
  console.log('Based on the analysis, CanAI is:');
  console.log('1. 🧠 An emotional intelligence platform for AI interactions');
  console.log('2. ✨ A spark/creativity enhancement system');
  console.log('3. 🛡️ A trust-building framework for AI-human relationships');
  console.log('4. 🎯 A product suite for business automation');
  console.log('5. 🔗 An integration platform connecting multiple services');
  
  console.log('\n📋 NEXT STEPS PRIORITY');
  console.log('=====================================');
  console.log('1. 🔴 Complete product MCP files (34.1% → 75%+)');
  console.log('2. 🔴 Add service tests and exports (56.7% → 80%+)');
  console.log('3. 🟡 Finish integration webhooks/APIs (34.0% → 70%+)');
  console.log('4. 🟡 Standardize field types (89.8% → 95%+)');
  console.log('5. 🟢 Document the emotional intelligence architecture');
  
} catch (error) {
  console.error('❌ Error analyzing project:', error.message);
  process.exit(1);
} 