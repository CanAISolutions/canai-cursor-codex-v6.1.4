#!/usr/bin/env node

/**
 * MDC Enforcement CLI Tool
 * 
 * Usage:
 *   node cursor/scripts/enforce-mdc.js [options]
 * 
 * Options:
 *   --file <path>          Enforce MDC rules on a specific file
 *   --dir <path>           Enforce MDC rules on all files in a directory
 *   --fix                  Auto-fix violations where possible
 *   --report <path>        Save report to a file
 *   --strict               Exit with error code if violations found
 *   --help                 Show this help message
 * 
 * Examples:
 *   node cursor/scripts/enforce-mdc.js --file server.js
 *   node cursor/scripts/enforce-mdc.js --dir cursor/boot_sequence --fix
 *   node cursor/scripts/enforce-mdc.js --dir cursor --report mdc-report.txt --strict
 */

// Import MDC enforcement engine
const { mdcEnforcement } = require('../rules/mdc-enforcement-engine');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  file: null,
  dir: null,
  fix: false,
  report: null,
  strict: false,
  help: false
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  switch (arg) {
    case '--file':
      options.file = args[++i];
      break;
    case '--dir':
      options.dir = args[++i];
      break;
    case '--fix':
      options.fix = true;
      break;
    case '--report':
      options.report = args[++i];
      break;
    case '--strict':
      options.strict = true;
      break;
    case '--help':
      options.help = true;
      break;
    default:
      console.error(`Unknown option: ${arg}`);
      process.exit(1);
  }
}

// Show help and exit
if (options.help || (!options.file && !options.dir)) {
  console.log(`
🔒 MDC Rules Enforcement CLI
============================

Enforce MDC rules across your codebase with confidence.

USAGE:
  node cursor/scripts/enforce-mdc.js [options]

OPTIONS:
  --file <path>          Enforce MDC rules on a specific file
  --dir <path>           Enforce MDC rules on all files in a directory
  --fix                  Auto-fix violations where possible (limited support)
  --report <path>        Save report to a file
  --strict               Exit with error code if violations found
  --help                 Show this help message

EXAMPLES:
  node cursor/scripts/enforce-mdc.js --file server.js
  node cursor/scripts/enforce-mdc.js --dir cursor/boot_sequence --fix
  node cursor/scripts/enforce-mdc.js --dir cursor --report mdc-report.txt --strict
  `);
  process.exit(0);
}

/**
 * Main function to run the enforcement
 */
async function main() {
  console.log('🔒 Starting MDC Rules Enforcement...');
  
  try {
    let results = [];
    
    // Enforce rules on a specific file
    if (options.file) {
      const filePath = path.resolve(options.file);
      console.log(`📄 Enforcing rules on file: ${filePath}`);
      
      const result = await mdcEnforcement.enforceFile(filePath);
      results.push(result);
      
      // Display result
      if (result.isValid) {
        console.log(`✅ ${filePath}: No violations found`);
      } else {
        console.log(`❌ ${filePath}: ${result.violations.length} violations found`);
        result.violations.forEach(violation => {
          console.log(`   - [${violation.ruleId}] ${violation.message}`);
          if (violation.suggestion) {
            console.log(`     💡 ${violation.suggestion}`);
          }
        });
      }
    }
    
    // Enforce rules on all files in a directory
    if (options.dir) {
      const dirPath = path.resolve(options.dir);
      console.log(`📁 Enforcing rules on directory: ${dirPath}`);
      
      // Find all TypeScript and JavaScript files
      const files = glob.sync(`${dirPath}/**/*.{ts,tsx,js,jsx}`, {
        ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
      });
      
      console.log(`📋 Found ${files.length} files to check`);
      
      // Enforce rules on each file
      for (const file of files) {
        try {
          const result = await mdcEnforcement.enforceFile(file);
          results.push(result);
          
          // Display result
          if (result.isValid) {
            console.log(`✅ ${file}: No violations found`);
          } else {
            console.log(`❌ ${file}: ${result.violations.length} violations found`);
          }
        } catch (error) {
          console.error(`Error enforcing rules on ${file}:`, error);
        }
      }
    }
    
    // Generate and display report
    const report = mdcEnforcement.generateReport(results);
    console.log('\n📊 MDC Rules Enforcement Report:');
    console.log(report);
    
    // Save report to file if requested
    if (options.report) {
      const reportPath = path.resolve(options.report);
      fs.writeFileSync(reportPath, report);
      console.log(`📄 Report saved to: ${reportPath}`);
    }
    
    // Exit with error code if violations found and strict mode is enabled
    const totalViolations = results.reduce((sum, result) => sum + result.violations.length, 0);
    if (options.strict && totalViolations > 0) {
      console.log(`❌ Exiting with error code due to ${totalViolations} violations found`);
      process.exit(1);
    }
    
    console.log('✅ MDC Rules Enforcement completed');
  } catch (error) {
    console.error('❌ Error enforcing MDC rules:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 