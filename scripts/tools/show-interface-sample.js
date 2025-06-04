#!/usr/bin/env node

/**
 * Show a sample of the interface extraction JSON data
 */

const fs = require('fs');
const path = require('path');

// Find the most recent interface extraction report
const files = fs.readdirSync('.')
  .filter(f => f.startsWith('interface-extraction-report-') && f.endsWith('.json'))
  .sort()
  .reverse();

if (files.length === 0) {
  console.log('No interface extraction reports found.');
  process.exit(1);
}

const reportFile = files[0];
console.log(`📄 Reading sample from: ${reportFile}`);

try {
  const data = JSON.parse(fs.readFileSync(reportFile, 'utf-8'));
  
  console.log('\n📊 REPORT OVERVIEW');
  console.log('==================');
  console.log(`Generated: ${data.timestamp}`);
  console.log(`Total Interfaces: ${data.totalInterfaces}`);
  console.log(`Total Files: ${data.totalFiles}`);
  
  console.log('\n📂 CATEGORIES');
  console.log('==============');
  Object.entries(data.categories)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`${category}: ${count} interfaces`);
    });
  
  console.log('\n📈 FIELD STATISTICS');
  console.log('===================');
  console.log(`Total Fields: ${data.summary.fieldStatistics.totalFields}`);
  console.log(`Required Fields: ${data.summary.fieldStatistics.requiredFields}`);
  console.log(`Optional Fields: ${data.summary.fieldStatistics.optionalFields}`);
  
  console.log('\n🔤 MOST COMMON TYPES');
  console.log('====================');
  Object.entries(data.summary.fieldStatistics.mostCommonTypes)
    .slice(0, 10)
    .forEach(([type, count]) => {
      console.log(`${type}: ${count} occurrences`);
    });
  
  console.log('\n🔍 SAMPLE INTERFACE STRUCTURE');
  console.log('==============================');
  
  // Show first interface as example
  if (data.interfaces.length > 0) {
    const sample = data.interfaces[0];
    console.log(JSON.stringify(sample, null, 2));
  }
  
  console.log('\n📋 INTERFACES BY CATEGORY (Top 5 per category)');
  console.log('===============================================');
  
  Object.entries(data.summary.byCategory)
    .sort(([,a], [,b]) => b.length - a.length)
    .slice(0, 5)
    .forEach(([category, interfaces]) => {
      console.log(`\n${category} (${interfaces.length} total):`);
      interfaces.slice(0, 5).forEach(iface => {
        console.log(`  - ${iface.name} (${iface.fields.length} fields) - ${iface.relativePath}:${iface.lineNumber}`);
      });
    });
  
} catch (error) {
  console.error('Error reading report:', error.message);
  process.exit(1);
} 