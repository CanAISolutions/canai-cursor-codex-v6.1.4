#!/usr/bin/env node

/**
 * Placeholder Implementation Detection Tool
 * 
 * WHAT: Detects placeholder implementations throughout the codebase
 * WHY: Ensures all production code is fully implemented and functional
 * HOW: Scans files for common placeholder patterns and generates a report
 * 
 * Usage:
 *   node scripts/tools/detect-placeholder-implementations.js [options]
 * 
 * Options:
 *   --dir <directory>         Specify directories to scan (default: src,cursor,prompts)
 *   --include <pattern>       File patterns to include (default: **/*.{ts,js,tsx,jsx})
 *   --exclude <pattern>       File patterns to exclude (default: **/*.{test,spec}.{ts,js})
 *   --output <file>           Output report file (default: placeholder-report.json)
 *   --fail-on-critical        Exit with error code if critical placeholders found
 *   --ci                      Run in CI mode (generates GitHub annotation format)
 *   --suggest-fixes           Include suggested fixes in the report
 *   --update-registry         Update the placeholder registry
 *   --create-tasks            Create tasks for pending placeholders
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const minimist = require('minimist');

// Parse command line arguments
const argv = minimist(process.argv.slice(2), {
  string: ['dir', 'include', 'exclude', 'output'],
  boolean: ['fail-on-critical', 'ci', 'suggest-fixes', 'update-registry', 'create-tasks'],
  default: {
    dir: 'src,cursor,prompts',
    include: '**/*.{ts,js,tsx,jsx}',
    exclude: '**/*.{test,spec}.{ts,js},**/node_modules/**',
    output: 'placeholder-report.json'
  }
});

// Common placeholder implementation patterns
const PLACEHOLDER_PATTERNS = [
  {
    pattern: /In a real implementation/i,
    severity: 'critical',
    description: 'Real implementation placeholder comment',
    suggestionTemplate: 'Replace with actual implementation that {functionality}'
  },
  {
    pattern: /For this example/i,
    severity: 'critical',
    description: 'Example-only implementation',
    suggestionTemplate: 'Implement production-quality code with proper {functionality}'
  },
  {
    pattern: /placeholder implementation/i,
    severity: 'critical',
    description: 'Explicit placeholder implementation',
    suggestionTemplate: 'Replace placeholder with actual {functionality}'
  },
  {
    pattern: /simulat(e|ed|ion)/i,
    severity: 'high',
    description: 'Simulation instead of real implementation',
    suggestionTemplate: 'Replace simulation with actual {functionality}'
  },
  {
    pattern: /stub (for|implementation)/i,
    severity: 'high',
    description: 'Stub implementation',
    suggestionTemplate: 'Replace stub with complete implementation'
  },
  {
    pattern: /TODO:/i,
    severity: 'medium',
    description: 'TODO comment',
    suggestionTemplate: 'Implement the TODO item'
  },
  {
    pattern: /FIXME:/i,
    severity: 'high',
    description: 'FIXME comment',
    suggestionTemplate: 'Fix the issue described in the comment'
  },
  {
    pattern: /mock (data|implementation|service)/i,
    severity: 'medium',
    description: 'Mock implementation',
    suggestionTemplate: 'Replace mock with actual implementation'
  },
  {
    pattern: /hardcoded/i,
    severity: 'medium',
    description: 'Hardcoded values',
    suggestionTemplate: 'Replace hardcoded values with dynamic implementation'
  }
];

// Known placeholder function names
const PLACEHOLDER_FUNCTION_NAMES = [
  'simulateTranslation',
  'simulateEmotionalLoad',
  'simulateCulturalAdaptation',
  'simulateNetworkLatency',
  'simulateUserInteraction',
  'mockApiCall',
  'mockResponse',
  'stubImplementation',
  'placeholderFunction'
];

// Registry file path
const REGISTRY_PATH = path.resolve(process.cwd(), 'cursor/system-intel/placeholder-registry.json');

/**
 * Main function to detect placeholder implementations
 */
async function main() {
  console.log(chalk.blue('🔍 Starting placeholder implementation detection...'));
  
  // Get directories to scan
  const directories = argv.dir.split(',').map(dir => dir.trim());
  console.log(chalk.gray(`Scanning directories: ${directories.join(', ')}`));
  
  // Get files to scan
  const files = [];
  for (const dir of directories) {
    const dirPath = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      console.warn(chalk.yellow(`⚠️ Directory not found: ${dirPath}`));
      continue;
    }
    
    const pattern = path.join(dirPath, argv.include);
    const matches = glob.sync(pattern, {
      ignore: argv.exclude.split(',').map(p => path.join(dirPath, p.trim()))
    });
    
    files.push(...matches);
  }
  
  console.log(chalk.gray(`Found ${files.length} files to scan`));
  
  // Scan files for placeholders
  const placeholders = [];
  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  
  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file);
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i + 1;
        
        // Check for placeholder patterns
        for (const { pattern, severity, description, suggestionTemplate } of PLACEHOLDER_PATTERNS) {
          if (pattern.test(line)) {
            const match = line.trim();
            const context = getContext(lines, i);
            
            const placeholder = {
              file: relativePath,
              line: lineNumber,
              match,
              context,
              severity,
              description,
              suggestion: argv['suggest-fixes'] ? generateSuggestion(suggestionTemplate, context) : undefined
            };
            
            placeholders.push(placeholder);
            
            if (severity === 'critical') criticalCount++;
            if (severity === 'high') highCount++;
            if (severity === 'medium') mediumCount++;
            if (severity === 'low') lowCount++;
            
            break; // Only record one pattern per line
          }
        }
        
        // Check for placeholder function names
        for (const funcName of PLACEHOLDER_FUNCTION_NAMES) {
          if (line.includes(funcName)) {
            const match = line.trim();
            const context = getContext(lines, i);
            
            placeholders.push({
              file: relativePath,
              line: lineNumber,
              match,
              context,
              severity: 'high',
              description: `Placeholder function: ${funcName}`,
              suggestion: argv['suggest-fixes'] ? `Replace ${funcName} with production implementation` : undefined
            });
            
            highCount++;
            break;
          }
        }
      }
    } catch (error) {
      console.error(chalk.red(`❌ Error scanning file ${relativePath}: ${error.message}`));
    }
  }
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: placeholders.length,
      critical: criticalCount,
      high: highCount,
      medium: mediumCount,
      low: lowCount
    },
    placeholders
  };
  
  // Write report to file
  fs.writeFileSync(argv.output, JSON.stringify(report, null, 2));
  console.log(chalk.green(`✅ Report written to ${argv.output}`));
  
  // Print summary
  console.log('\n' + chalk.blue('📊 Placeholder Detection Summary:'));
  console.log(chalk.gray('------------------------------'));
  console.log(chalk.white(`Total files scanned: ${files.length}`));
  console.log(chalk.white(`Total placeholders found: ${placeholders.length}`));
  console.log(chalk.red(`🚨 Critical: ${criticalCount}`));
  console.log(chalk.yellow(`⚠️ High: ${highCount}`));
  console.log(chalk.blue(`ℹ️ Medium: ${mediumCount}`));
  console.log(chalk.gray(`💡 Low: ${lowCount}`));
  
  // Update registry if requested
  if (argv['update-registry']) {
    await updateRegistry(placeholders);
  }
  
  // Create tasks if requested
  if (argv['create-tasks']) {
    await createTasks();
  }
  
  // Exit with error if critical placeholders found and fail-on-critical flag is set
  if (argv['fail-on-critical'] && criticalCount > 0) {
    console.log(chalk.red(`\n❌ ${criticalCount} critical placeholder implementations found. Failing build.`));
    process.exit(1);
  }
  
  console.log(chalk.green('\n✅ Placeholder detection complete!'));
}

/**
 * Get context lines around a match
 */
function getContext(lines, lineIndex, contextLines = 2) {
  const start = Math.max(0, lineIndex - contextLines);
  const end = Math.min(lines.length - 1, lineIndex + contextLines);
  
  const context = [];
  for (let i = start; i <= end; i++) {
    context.push({
      line: i + 1,
      content: lines[i].trim(),
      isMatch: i === lineIndex
    });
  }
  
  return context;
}

/**
 * Generate a suggestion based on the context
 */
function generateSuggestion(template, context) {
  // Extract function name and signature from context
  let functionName = '';
  let functionality = '';
  
  for (const line of context) {
    const funcMatch = line.content.match(/function\s+(\w+)/);
    if (funcMatch) {
      functionName = funcMatch[1];
    }
    
    // Look for clues about what the function should do
    if (line.content.includes('would') && line.content.includes('this')) {
      const parts = line.content.split('would');
      if (parts.length > 1) {
        functionality = parts[1].replace(/^[^a-zA-Z]+/, '').trim();
      }
    }
  }
  
  // Replace placeholders in template
  let suggestion = template
    .replace('{functionName}', functionName)
    .replace('{functionality}', functionality || 'processes data properly');
  
  return suggestion;
}

/**
 * Update the placeholder registry
 */
async function updateRegistry(newPlaceholders) {
  console.log(chalk.blue('\n📝 Updating placeholder registry...'));
  
  // Create registry directory if it doesn't exist
  const registryDir = path.dirname(REGISTRY_PATH);
  if (!fs.existsSync(registryDir)) {
    fs.mkdirSync(registryDir, { recursive: true });
  }
  
  // Load existing registry or create new one
  let registry = { placeholders: [] };
  if (fs.existsSync(REGISTRY_PATH)) {
    try {
      registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    } catch (error) {
      console.error(chalk.red(`❌ Error loading registry: ${error.message}`));
    }
  }
  
  // Update registry with new placeholders
  for (const placeholder of newPlaceholders) {
    const key = `${placeholder.file}:${placeholder.line}`;
    const existing = registry.placeholders.find(p => 
      p.file === placeholder.file && p.line === placeholder.line
    );
    
    if (existing) {
      // Update existing entry
      existing.lastSeen = new Date().toISOString();
      existing.match = placeholder.match;
      existing.severity = placeholder.severity;
      existing.description = placeholder.description;
      
      // Don't overwrite status if already set
      if (!existing.status) {
        existing.status = 'pending';
      }
    } else {
      // Add new entry
      registry.placeholders.push({
        file: placeholder.file,
        line: placeholder.line,
        match: placeholder.match,
        severity: placeholder.severity,
        description: placeholder.description,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        status: 'pending',
        owner: '',
        dueDate: ''
      });
    }
  }
  
  // Write updated registry
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
  console.log(chalk.green(`✅ Registry updated at ${REGISTRY_PATH}`));
  
  // Generate auto-actions log entry
  generateAutoActionsLogEntry(registry.placeholders);
}

/**
 * Create tasks for pending placeholders
 */
async function createTasks() {
  console.log(chalk.blue('\n📋 Creating tasks for pending placeholders...'));
  
  // Check if registry exists
  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error(chalk.red(`❌ Registry not found at ${REGISTRY_PATH}`));
    return;
  }
  
  // Load registry
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  
  // Find pending placeholders
  const pendingPlaceholders = registry.placeholders.filter(p => p.status === 'pending');
  
  console.log(chalk.gray(`Found ${pendingPlaceholders.length} pending placeholders`));
  
  // Here you would integrate with your task management system
  // For this example, we'll just print the tasks
  console.log(chalk.green(`✅ Would create ${pendingPlaceholders.length} tasks`));
  
  // This would be replaced with actual API calls
  for (const placeholder of pendingPlaceholders) {
    console.log(chalk.gray(`  - ${placeholder.file}:${placeholder.line} (${placeholder.severity}): ${placeholder.description}`));
  }
}

/**
 * Generate an entry for the auto-actions log
 */
function generateAutoActionsLogEntry(placeholders) {
  console.log(chalk.blue('\n📜 Generating auto-actions log entry...'));
  
  // Count placeholders by status
  const pending = placeholders.filter(p => p.status === 'pending').length;
  const inProgress = placeholders.filter(p => p.status === 'in-progress').length;
  const completed = placeholders.filter(p => p.status === 'completed').length;
  const total = placeholders.length;
  
  // Count by severity
  const critical = placeholders.filter(p => p.severity === 'critical').length;
  const high = placeholders.filter(p => p.severity === 'high').length;
  const medium = placeholders.filter(p => p.severity === 'medium').length;
  const low = placeholders.filter(p => p.severity === 'low').length;
  
  // Generate markdown table of top 10 placeholders by severity
  const topPlaceholders = [...placeholders]
    .sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    })
    .slice(0, 10);
  
  let tableRows = '';
  for (const p of topPlaceholders) {
    const status = p.status === 'pending' ? '⏳ PENDING' : 
                  p.status === 'in-progress' ? '🔄 IN PROGRESS' : 
                  '✅ COMPLETED';
    
    tableRows += `| ${p.file} | ${p.description} | ${status} | ${p.owner || 'Unassigned'} | ${p.dueDate || 'TBD'} |\n`;
  }
  
  // Generate log entry
  const logEntry = `
## PLACEHOLDER IMPLEMENTATION REMEDIATION TRACKER
**Updated**: ${new Date().toISOString().split('T')[0]}  
**Status**: 🔄 IN PROGRESS - ${completed}/${total} implementations remediated

**Summary**:  
${pending} pending, ${inProgress} in progress, ${completed} completed

**Severity Breakdown**:  
- 🚨 Critical: ${critical}
- ⚠️ High: ${high}
- ℹ️ Medium: ${medium}
- 💡 Low: ${low}

**Top Placeholders by Severity**:

| File | Implementation | Status | Owner | Due Date |
|------|---------------|--------|-------|----------|
${tableRows}

**Next Steps**:
1. Assign owners to all critical placeholders
2. Set due dates based on severity
3. Begin implementation of critical placeholders
4. Update registry as implementations are completed
`;

  // Log would be appended to auto-actions.log.md
  console.log(chalk.gray('Log entry generated - would be appended to auto-actions.log.md'));
  
  // For this script, we'll just write to a temp file
  const tempLogPath = path.resolve(process.cwd(), 'placeholder-remediation-log.md');
  fs.writeFileSync(tempLogPath, logEntry);
  console.log(chalk.green(`✅ Temporary log written to ${tempLogPath}`));
}

// Run the main function
main().catch(error => {
  console.error(chalk.red(`❌ Error: ${error.message}`));
  process.exit(1);
}); 