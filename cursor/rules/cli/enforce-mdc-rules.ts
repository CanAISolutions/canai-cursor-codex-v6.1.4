#!/usr/bin/env node

/**
 * CLI Tool: Enforce MDC Rules
 * 
 * Usage:
 *   npx ts-node cursor/rules/cli/enforce-mdc-rules.ts [options]
 *   npm run enforce-mdc [options]
 * 
 * Options:
 *   --files <pattern>     File patterns to check (default: all TypeScript files)
 *   --fix                 Auto-fix violations where possible
 *   --report <file>       Save report to file
 *   --fail-on-violations  Exit with error code if violations found
 *   --trust-threshold <n> Minimum trust score required (default: 4.2)
 *   --watch               Watch mode for continuous enforcement
 *   --help                Show help
 */

import { MDCEnforcementEngine } from '../mdc-enforcement-engine';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface CLIOptions {
  files: string[];
  fix: boolean;
  report?: string;
  failOnViolations: boolean;
  trustThreshold: number;
  watch: boolean;
  help: boolean;
}

function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    fix: false,
    failOnViolations: false,
    trustThreshold: 4.2,
    watch: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--files':
        if (args[i + 1]) {
          options.files = args[i + 1].split(',');
          i++;
        }
        break;
      case '--fix':
        options.fix = true;
        break;
      case '--report':
        if (args[i + 1]) {
          options.report = args[i + 1];
          i++;
        }
        break;
      case '--fail-on-violations':
        options.failOnViolations = true;
        break;
      case '--trust-threshold':
        if (args[i + 1]) {
          options.trustThreshold = parseFloat(args[i + 1]);
          i++;
        }
        break;
      case '--watch':
        options.watch = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }

  return options;
}

function showHelp(): void {
  console.log(`
🔒 MDC Rule Enforcement CLI
============================

Enforce .MDC rules across your codebase to maintain emotional sovereignty standards.

USAGE:
  npx ts-node cursor/rules/cli/enforce-mdc-rules.ts [options]
  npm run enforce-mdc [options]

OPTIONS:
  --files <pattern>         File patterns to check (comma-separated)
                           Default: **/*.ts,**/*.tsx,**/*.js,**/*.jsx
  
  --fix                    Auto-fix violations where possible
                           (Currently supports: console.log removal)
  
  --report <file>          Save detailed report to specified file
                           Example: --report mdc-violations.txt
  
  --fail-on-violations     Exit with error code if violations found
                           (Useful for CI/CD pipelines)
  
  --trust-threshold <n>    Minimum trust score required (1.0-5.0)
                           Default: 4.2
  
  --watch                  Watch mode for continuous enforcement
                           (Re-runs on file changes)
  
  --help, -h              Show this help message

EXAMPLES:
  # Check all TypeScript files
  npm run enforce-mdc
  
  # Check specific files with auto-fix
  npm run enforce-mdc -- --files "src/**/*.ts" --fix
  
  # Generate report and fail on violations (CI/CD)
  npm run enforce-mdc -- --report violations.txt --fail-on-violations
  
  # Watch mode for development
  npm run enforce-mdc -- --watch
  
  # Custom trust threshold
  npm run enforce-mdc -- --trust-threshold 4.5

RULE TYPES ENFORCED:
  🚨 BLOCKING:           Critical violations that must be fixed
  ⚠️  MANDATORY:         Required patterns for emotional sovereignty
  📊 TRUST SCORE:        Minimum trust score enforcement (≥4.2)
  🙏 SACRED REVERSAL:    "Would you feel seen, honored, empowered?"
  🧪 TEST VALIDATION:    Test-First Truth enforcement

For more information about .MDC rules, see: cursor/rules/README.md
`);
}

async function autoFix(filePath: string, violations: any[]): Promise<boolean> {
  // Simple auto-fixes for common violations
  let content = require('fs').readFileSync(filePath, 'utf-8');
  let modified = false;

  for (const violation of violations) {
    if (violation.autoFixable) {
      if (violation.message.includes('console.log')) {
        // Remove console.log statements
        const originalContent = content;
        content = content.replace(/console\.log\([^)]*\);?\n?/g, '');
        if (content !== originalContent) {
          modified = true;
          console.log(`   🔧 Auto-fixed: Removed console.log statements`);
        }
      }
    }
  }

  if (modified) {
    require('fs').writeFileSync(filePath, content);
    return true;
  }

  return false;
}

async function runEnforcement(options: CLIOptions): Promise<void> {
  console.log('🔒 Starting MDC Rule Enforcement...\n');
  
  const engine = new MDCEnforcementEngine();
  const results = await engine.enforceProject(options.files);
  
  // Filter results based on trust threshold
  const filteredResults = results.map(result => ({
    ...result,
    violations: result.violations.filter(v => {
      if (v.type === 'trust-score' && result.trustScore) {
        return result.trustScore < options.trustThreshold;
      }
      return true;
    })
  }));

  // Auto-fix if requested
  if (options.fix) {
    console.log('🔧 Auto-fixing violations...\n');
    let fixedFiles = 0;
    
    for (const result of filteredResults) {
      if (!result.isValid && result.violations.some(v => v.autoFixable)) {
        const wasFixed = await autoFix(result.filePath, result.violations);
        if (wasFixed) {
          fixedFiles++;
          console.log(`   ✅ Fixed: ${result.filePath}`);
        }
      }
    }
    
    if (fixedFiles > 0) {
      console.log(`\n🎉 Auto-fixed ${fixedFiles} files. Re-running enforcement...\n`);
      // Re-run enforcement after fixes
      const newResults = await engine.enforceProject(options.files);
      return runEnforcement({ ...options, fix: false }); // Don't fix again
    }
  }

  // Generate and display report
  const report = engine.generateReport(filteredResults);
  console.log(report);

  // Save report to file if requested
  if (options.report) {
    const reportPath = join(process.cwd(), options.report);
    writeFileSync(reportPath, report);
    console.log(`\n📄 Report saved to: ${reportPath}`);
  }

  // Calculate summary statistics
  const totalFiles = filteredResults.length;
  const validFiles = filteredResults.filter(r => r.isValid).length;
  const violationCount = filteredResults.reduce((sum, r) => sum + r.violations.length, 0);
  const criticalViolations = filteredResults.reduce((sum, r) => 
    sum + r.violations.filter(v => v.severity === 'critical').length, 0);

  // Trust score statistics
  const trustScores = filteredResults
    .map(r => r.trustScore)
    .filter(score => score !== undefined) as number[];
  const avgTrustScore = trustScores.length > 0 ? 
    trustScores.reduce((sum, score) => sum + score, 0) / trustScores.length : 0;

  console.log(`\n📊 ENFORCEMENT SUMMARY:`);
  console.log(`   Files Checked: ${totalFiles}`);
  console.log(`   Valid Files: ${validFiles} (${((validFiles/totalFiles)*100).toFixed(1)}%)`);
  console.log(`   Total Violations: ${violationCount}`);
  console.log(`   Critical Violations: ${criticalViolations}`);
  if (trustScores.length > 0) {
    console.log(`   Average Trust Score: ${avgTrustScore.toFixed(2)}/5.0`);
    console.log(`   Trust Threshold: ${options.trustThreshold}/5.0`);
  }

  // Sacred Reversal Test summary
  const sacredTestPassed = filteredResults.filter(r => r.sacredReversalTestPassed).length;
  const testValidationPassed = filteredResults.filter(r => r.testValidationPassed).length;
  
  console.log(`\n🙏 EMOTIONAL SOVEREIGNTY STATUS:`);
  console.log(`   Sacred Reversal Test: ${sacredTestPassed}/${totalFiles} passed (${((sacredTestPassed/totalFiles)*100).toFixed(1)}%)`);
  console.log(`   Test Validation: ${testValidationPassed}/${totalFiles} passed (${((testValidationPassed/totalFiles)*100).toFixed(1)}%)`);

  // Exit with error code if violations found and fail-on-violations is set
  if (options.failOnViolations && (violationCount > 0 || criticalViolations > 0)) {
    console.log(`\n❌ ENFORCEMENT FAILED: ${violationCount} violations found (${criticalViolations} critical)`);
    console.log(`   Use --fix to auto-fix violations where possible`);
    console.log(`   Review .MDC rules in cursor/rules/ for requirements`);
    process.exit(1);
  }

  if (violationCount === 0) {
    console.log(`\n🎉 SUCCESS: All files comply with .MDC rules!`);
    console.log(`   Emotional sovereignty standards maintained ✅`);
    console.log(`   Trust score threshold met ✅`);
    console.log(`   Sacred Reversal Test passed ✅`);
  }
}

async function watchMode(options: CLIOptions): Promise<void> {
  console.log('👀 Starting watch mode...');
  console.log('   Watching for file changes...');
  console.log('   Press Ctrl+C to exit\n');

  const chokidar = require('chokidar');
  
  // Watch the specified file patterns
  const watcher = chokidar.watch(options.files, {
    ignored: /node_modules|\.git/,
    persistent: true
  });

  let isRunning = false;

  const runEnforcementDebounced = async () => {
    if (isRunning) return;
    isRunning = true;
    
    console.log('\n🔄 File change detected, running enforcement...\n');
    await runEnforcement({ ...options, watch: false });
    console.log('\n👀 Watching for changes...\n');
    
    isRunning = false;
  };

  watcher.on('change', runEnforcementDebounced);
  watcher.on('add', runEnforcementDebounced);

  // Initial run
  await runEnforcementDebounced();

  // Keep the process alive
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping watch mode...');
    watcher.close();
    process.exit(0);
  });
}

async function main(): Promise<void> {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  try {
    if (options.watch) {
      await watchMode(options);
    } else {
      await runEnforcement(options);
    }
  } catch (error) {
    console.error('❌ Enforcement failed:', error);
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
} 