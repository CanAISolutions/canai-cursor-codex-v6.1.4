#!/usr/bin/env node

/**
 * Documentation Reconciliation Progress Tracker
 * 
 * This script scans the documentation reconciliation files and generates
 * a progress report on the status of the reconciliation tasks.
 * 
 * Usage: node scripts/tools/doc-reconciliation-progress.js
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

// Configuration
const DOCS_DIR = path.resolve(__dirname, '../../docs');
const RECONCILIATION_FILES = [
  'DOCUMENTATION-RECONCILIATION-PLAN.md',
  'COMPONENT-IMPLEMENTATION-MATRIX.md',
  'IMPLEMENTATION-STATUS-OVERVIEW.md',
  'MASTER-LAUNCH-CHECKLIST.md',
  'VERIFICATION-FIRST-PROTOCOL.md',
  'VERIFICATION-ENHANCEMENT-PLAN.md'
];

// Emotional sovereignty documents for reference and cross-verification
const SOVEREIGNTY_FILES = [
  'emotional-sovereignty-master-resource-index.md',
  'emotional-sovereignty-implementation-roadmap.md',
  'emotional-sovereignty-gap-analysis.md',
  'cohesive-integration-plan.md',
  'canai-launch-master-plan-v2.1-emotional-sovereignty.md'
];

// Verification evidence directory
const VERIFICATION_DIR = path.resolve(DOCS_DIR, 'verification-evidence');

// ANSI color codes for terminal output
const COLORS = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  UNDERSCORE: '\x1b[4m',
  BLINK: '\x1b[5m',
  REVERSE: '\x1b[7m',
  HIDDEN: '\x1b[8m',
  
  FG_BLACK: '\x1b[30m',
  FG_RED: '\x1b[31m',
  FG_GREEN: '\x1b[32m',
  FG_YELLOW: '\x1b[33m',
  FG_BLUE: '\x1b[34m',
  FG_MAGENTA: '\x1b[35m',
  FG_CYAN: '\x1b[36m',
  FG_WHITE: '\x1b[37m',
  
  BG_BLACK: '\x1b[40m',
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
  BG_YELLOW: '\x1b[43m',
  BG_BLUE: '\x1b[44m',
  BG_MAGENTA: '\x1b[45m',
  BG_CYAN: '\x1b[46m',
  BG_WHITE: '\x1b[47m'
};

/**
 * Analyzes a markdown file and extracts task completion statistics
 * @param {string} filePath - Path to the markdown file
 * @returns {Object} - Task statistics
 */
async function analyzeFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Extract file metadata
    const title = lines.find(line => line.startsWith('# '))?.replace('# ', '') || path.basename(filePath);
    const version = lines.find(line => line.includes('**Version**:'))?.match(/\*\*Version\*\*: (.*)/)?.[1] || 'Unknown';
    const status = lines.find(line => line.includes('**Status**:'))?.match(/\*\*Status\*\*: (.*)/)?.[1] || 'Unknown';
    
    // Count tasks
    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;
    let inProgressTasks = 0;
    let verifiedTasks = 0;
    let verificationPendingTasks = 0;
    
    // Task list format: - [x] Task description
    const taskListItems = lines.filter(line => /^\s*- \[[x ]\]/.test(line));
    totalTasks += taskListItems.length;
    completedTasks += taskListItems.filter(line => /^\s*- \[x\]/.test(line)).length;
    pendingTasks += taskListItems.filter(line => /^\s*- \[ \]/.test(line)).length;
    
    // Check for verification column in tables (new verification-first approach)
    const tableRows = lines.filter(line => /^\s*\|.*\|.*\|/.test(line));
    
    // Check for verification column
    const verificationColumnIndex = tableRows.find(row => /\|\s*Verification\s*\|/.test(row))
      ? tableRows.find(row => /\|\s*Verification\s*\|/.test(row))
          .split('|')
          .findIndex(col => /\s*Verification\s*/.test(col))
      : -1;
    
    // Check for verification evidence column
    const evidenceColumnIndex = tableRows.find(row => /\|\s*Verification Evidence\s*\|/.test(row))
      ? tableRows.find(row => /\|\s*Verification Evidence\s*\|/.test(row))
          .split('|')
          .findIndex(col => /\s*Verification Evidence\s*/.test(col))
      : -1;
    
    // Check for status column
    const statusColumnIndex = tableRows.find(row => /\|\s*Status\s*\|/.test(row) || /\|\s*Actual Status\s*\|/.test(row))
      ? tableRows.find(row => /\|\s*Status\s*\|/.test(row) || /\|\s*Actual Status\s*\|/.test(row))
          .split('|')
          .findIndex(col => /\s*Status\s*/.test(col) || /\s*Actual Status\s*/.test(col))
      : -1;
    
    if (statusColumnIndex > 0) {
      const dataRows = tableRows.filter(row => 
        !row.includes('---') && 
        !row.includes('Status') && 
        !row.includes('Component Category') &&
        row.split('|').length > statusColumnIndex);
      
      totalTasks += dataRows.length;
      
      dataRows.forEach(row => {
        const columns = row.split('|');
        const status = columns[statusColumnIndex]?.trim();
        
        if (status.includes('COMPLETE') || status.includes('✅ VERIFIED')) {
          completedTasks++;
          if (status.includes('✅ VERIFIED')) {
            verifiedTasks++;
          }
        } else if (status.includes('IN PROGRESS') || status.includes('🔄')) {
          inProgressTasks++;
        } else if (status.includes('PENDING') || status.includes('⏳')) {
          pendingTasks++;
        } else if (status.includes('🧪 VERIFICATION PENDING')) {
          verificationPendingTasks++;
        }
        
        // Count verified items by evidence path
        if (evidenceColumnIndex > 0 && columns[evidenceColumnIndex]?.trim() !== 'Pending' && columns[evidenceColumnIndex]?.trim() !== 'N/A') {
          verifiedTasks++;
        }
      });
    }
    
    // Calculate completion percentage
    const completionPercentage = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;
    
    // Calculate verification percentage
    const verificationPercentage = totalTasks > 0
      ? Math.round((verifiedTasks / totalTasks) * 100)
      : 0;
    
    return {
      file: path.basename(filePath),
      title,
      version,
      status,
      stats: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        pending: pendingTasks,
        verificationPending: verificationPendingTasks,
        verified: verifiedTasks,
        percentage: completionPercentage,
        verificationPercentage: verificationPercentage
      }
    };
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return {
      file: path.basename(filePath),
      title: path.basename(filePath),
      version: 'Error',
      status: 'Error',
      stats: {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        verificationPending: 0,
        verified: 0,
        percentage: 0,
        verificationPercentage: 0
      }
    };
  }
}

/**
 * Analyzes the verification evidence directory
 * @returns {Object} - Verification statistics
 */
function analyzeVerificationEvidence() {
  try {
    if (!fs.existsSync(VERIFICATION_DIR)) {
      return {
        directories: 0,
        files: 0,
        percentage: 0
      };
    }
    
    // Get subdirectories
    const subdirs = fs.readdirSync(VERIFICATION_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Count files in each subdirectory
    let totalFiles = 0;
    let subdirStats = {};
    
    subdirs.forEach(dir => {
      const dirPath = path.join(VERIFICATION_DIR, dir);
      const files = fs.readdirSync(dirPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name);
      totalFiles += files.length;
      subdirStats[dir] = files.length;
    });
    
    // Count top-level files
    const topLevelFiles = fs.readdirSync(VERIFICATION_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isFile())
      .map(dirent => dirent.name);
    totalFiles += topLevelFiles.length;
    
    return {
      directories: subdirs.length,
      files: totalFiles,
      percentage: totalFiles > 0 ? 100 : 0,
      subdirStats
    };
  } catch (error) {
    console.error(`Error analyzing verification evidence:`, error.message);
    return {
      directories: 0,
      files: 0,
      percentage: 0,
      subdirStats: {}
    };
  }
}

/**
 * Analyzes emotional sovereignty documents to extract component counts
 * @returns {Object} - Sovereignty component statistics
 */
async function analyzeSovereigntyDocs() {
  try {
    let results = {
      totalComponents: 0,
      availableComponents: 0,
      missingComponents: 0,
      sparkSplitComponents: 0,
      bridgeComponents: 0
    };
    
    for (const file of SOVEREIGNTY_FILES) {
      const filePath = path.join(DOCS_DIR, file);
      if (fs.existsSync(filePath)) {
        const content = await readFile(filePath, 'utf8');
        
        // Count components in emotional-sovereignty-master-resource-index.md
        if (file === 'emotional-sovereignty-master-resource-index.md') {
          const match = content.match(/75\+ production-ready components/);
          if (match) {
            results.availableComponents = 75;
          }
          
          // Count SparkSplit components
          const sparkSplitMatch = /SparkSplit v7\.2\.0.+?(\d+) lines/i.exec(content);
          if (sparkSplitMatch) {
            results.sparkSplitComponents = 5; // 5 SparkSplit components
          }
        }
        
        // Count missing components in gap analysis
        if (file === 'emotional-sovereignty-gap-analysis.md') {
          const match = content.match(/(\d+) remaining critical missing components/);
          if (match) {
            results.missingComponents = parseInt(match[1], 10);
          }
        }
        
        // Count bridge components in integration plan
        if (file === 'cohesive-integration-plan.md') {
          const match = content.match(/3-bridge integration architecture/);
          if (match) {
            results.bridgeComponents = 3; // 3 bridge components
          }
        }
      }
    }
    
    // Calculate total components
    results.totalComponents = results.availableComponents + results.missingComponents;
    
    return results;
  } catch (error) {
    console.error(`Error analyzing sovereignty docs:`, error.message);
    return {
      totalComponents: 0,
      availableComponents: 0,
      missingComponents: 0,
      sparkSplitComponents: 0,
      bridgeComponents: 0
    };
  }
}

/**
 * Analyzes milestone-based progress from the MASTER-LAUNCH-CHECKLIST.md
 * @returns {Object} - Milestone statistics
 */
async function analyzeMilestones() {
  try {
    const filePath = path.join(DOCS_DIR, 'MASTER-LAUNCH-CHECKLIST.md');
    if (!fs.existsSync(filePath)) {
      return {
        total: 0,
        completed: 0,
        percentage: 0
      };
    }
    
    const content = await readFile(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Find milestone sections
    const milestoneLines = lines.filter(line => line.includes('### Milestone'));
    
    // Count total milestones
    const totalMilestones = milestoneLines.length;
    
    // Count completed milestones (all tasks in milestone are complete)
    let completedMilestones = 0;
    
    for (const milestoneLine of milestoneLines) {
      const milestoneIndex = lines.indexOf(milestoneLine);
      const nextMilestoneIndex = lines.findIndex((line, index) => 
        index > milestoneIndex && line.includes('### Milestone'));
      
      const milestoneEnd = nextMilestoneIndex !== -1 ? nextMilestoneIndex : lines.findIndex((line, index) => 
        index > milestoneIndex && line.startsWith('---'));
      
      const milestoneTasks = lines.slice(milestoneIndex, milestoneEnd !== -1 ? milestoneEnd : undefined)
        .filter(line => /^\s*- \[[x ]\]/.test(line));
      
      const completedTasks = milestoneTasks.filter(line => /^\s*- \[x\]/.test(line)).length;
      
      if (milestoneTasks.length > 0 && completedTasks === milestoneTasks.length) {
        completedMilestones++;
      }
    }
    
    return {
      total: totalMilestones,
      completed: completedMilestones,
      percentage: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
    };
  } catch (error) {
    console.error(`Error analyzing milestones:`, error.message);
    return {
      total: 0,
      completed: 0,
      percentage: 0
    };
  }
}

/**
 * Generates a progress bar string
 * @param {number} percentage - Percentage completion
 * @param {number} length - Length of the progress bar
 * @returns {string} - ASCII progress bar
 */
function generateProgressBar(percentage, length = 20) {
  const filledLength = Math.round((percentage / 100) * length);
  const emptyLength = length - filledLength;
  
  const filled = '█'.repeat(filledLength);
  const empty = '░'.repeat(emptyLength);
  
  let color = COLORS.FG_RED;
  if (percentage >= 30) color = COLORS.FG_YELLOW;
  if (percentage >= 70) color = COLORS.FG_GREEN;
  
  return `${color}${filled}${COLORS.DIM}${empty}${COLORS.RESET} ${percentage}%`;
}

/**
 * Main function
 */
async function main() {
  console.log(`\n${COLORS.BRIGHT}${COLORS.FG_CYAN}=== DOCUMENTATION RECONCILIATION PROGRESS ===${COLORS.RESET}\n`);
  
  // Get analysis for each file
  const results = [];
  for (const file of RECONCILIATION_FILES) {
    const filePath = path.join(DOCS_DIR, file);
    if (fs.existsSync(filePath)) {
      const result = await analyzeFile(filePath);
      results.push(result);
    }
  }
  
  // Analyze sovereignty documents
  const sovereigntyStats = await analyzeSovereigntyDocs();
  
  // Analyze milestones
  const milestoneStats = await analyzeMilestones();
  
  // Analyze verification evidence
  const verificationStats = analyzeVerificationEvidence();
  
  // Display sovereignty component stats
  console.log(`${COLORS.UNDERSCORE}Emotional Sovereignty Components:${COLORS.RESET}\n`);
  console.log(`  Total Components: ${sovereigntyStats.totalComponents}`);
  console.log(`  Production-Ready: ${sovereigntyStats.availableComponents} (${Math.round((sovereigntyStats.availableComponents / sovereigntyStats.totalComponents) * 100)}%)`);
  console.log(`  Missing Components: ${sovereigntyStats.missingComponents} (${Math.round((sovereigntyStats.missingComponents / sovereigntyStats.totalComponents) * 100)}%)`);
  console.log(`  SparkSplit Components: ${sovereigntyStats.sparkSplitComponents}`);
  console.log(`  Bridge Components: ${sovereigntyStats.bridgeComponents}`);
  console.log(`  Implementation Progress: ${generateProgressBar(Math.round((sovereigntyStats.availableComponents / sovereigntyStats.totalComponents) * 100))}`);
  console.log();
  
  // Display milestone stats
  console.log(`${COLORS.UNDERSCORE}Milestone Progress:${COLORS.RESET}\n`);
  console.log(`  Total Milestones: ${milestoneStats.total}`);
  console.log(`  Completed Milestones: ${milestoneStats.completed} (${milestoneStats.percentage}%)`);
  console.log(`  Milestone Progress: ${generateProgressBar(milestoneStats.percentage)}`);
  console.log();
  
  // Display individual file progress
  console.log(`${COLORS.UNDERSCORE}File Progress:${COLORS.RESET}\n`);
  
  results.forEach(result => {
    console.log(`${COLORS.BRIGHT}${result.title}${COLORS.RESET} (${result.file})`);
    console.log(`  Version: ${result.version}`);
    console.log(`  Status: ${result.status}`);
    console.log(`  Tasks: ${result.stats.completed}/${result.stats.total} complete, ${result.stats.inProgress} in progress, ${result.stats.pending} pending`);
    console.log(`  Verification: ${result.stats.verified}/${result.stats.total} verified, ${result.stats.verificationPending} pending verification`);
    console.log(`  Progress: ${generateProgressBar(result.stats.percentage)}`);
    console.log(`  Verification: ${generateProgressBar(result.stats.verificationPercentage)}`);
    console.log();
  });
  
  // Display verification evidence stats
  console.log(`${COLORS.UNDERSCORE}Verification Evidence:${COLORS.RESET}\n`);
  console.log(`  Directories: ${verificationStats.directories}`);
  console.log(`  Evidence Files: ${verificationStats.files}`);
  
  // Show breakdown by directory if files exist
  if (verificationStats.files > 0) {
    console.log(`  Evidence by Category:`);
    Object.entries(verificationStats.subdirStats).forEach(([dir, count]) => {
      console.log(`    - ${dir}: ${count} files`);
    });
  }
  
  console.log(`  Structure: ${generateProgressBar(verificationStats.percentage)}`);
  console.log();
  
  // Calculate overall progress
  const totalTasks = results.reduce((sum, result) => sum + result.stats.total, 0);
  const completedTasks = results.reduce((sum, result) => sum + result.stats.completed, 0);
  const verifiedTasks = results.reduce((sum, result) => sum + result.stats.verified, 0);
  const inProgressTasks = results.reduce((sum, result) => sum + result.stats.inProgress, 0);
  const pendingTasks = results.reduce((sum, result) => sum + result.stats.pending, 0);
  const verificationPendingTasks = results.reduce((sum, result) => sum + result.stats.verificationPending, 0);
  const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const verificationPercentage = totalTasks > 0 ? Math.round((verifiedTasks / totalTasks) * 100) : 0;
  
  // Display overall progress
  console.log(`${COLORS.UNDERSCORE}Overall Progress:${COLORS.RESET}\n`);
  console.log(`  Total Tasks: ${totalTasks}`);
  console.log(`  Completed: ${completedTasks} (${Math.round((completedTasks / totalTasks) * 100)}%)`);
  console.log(`  Verified: ${verifiedTasks} (${Math.round((verifiedTasks / totalTasks) * 100)}%)`);
  console.log(`  In Progress: ${inProgressTasks} (${Math.round((inProgressTasks / totalTasks) * 100)}%)`);
  console.log(`  Pending: ${pendingTasks} (${Math.round((pendingTasks / totalTasks) * 100)}%)`);
  console.log(`  Pending Verification: ${verificationPendingTasks} (${Math.round((verificationPendingTasks / totalTasks) * 100)}%)`);
  console.log(`  Overall Progress: ${generateProgressBar(overallPercentage)}`);
  console.log(`  Verification Progress: ${generateProgressBar(verificationPercentage)}`);
  
  // Next steps recommendation
  console.log(`\n${COLORS.UNDERSCORE}Next Steps:${COLORS.RESET}\n`);
  
  if (verificationPercentage < 30) {
    console.log(`  ${COLORS.FG_YELLOW}➡️  Verify components marked as "VERIFICATION PENDING" with direct evidence${COLORS.RESET}`);
    console.log(`  ${COLORS.FG_YELLOW}➡️  Fix and verify components marked as "PARTIAL"${COLORS.RESET}`);
    console.log(`  ${COLORS.FG_YELLOW}➡️  Focus on Milestone 1 completion (Foundation Components)${COLORS.RESET}`);
  } else if (verificationPercentage < 60) {
    console.log(`  ${COLORS.FG_YELLOW}➡️  Continue verification of remaining components${COLORS.RESET}`);
    console.log(`  ${COLORS.FG_YELLOW}➡️  Update codex-handover.md with verified implementation status${COLORS.RESET}`);
    console.log(`  ${COLORS.FG_YELLOW}➡️  Progress to Milestone 2 (Emotional Intelligence Core)${COLORS.RESET}`);
  } else if (verificationPercentage < 90) {
    console.log(`  ${COLORS.FG_YELLOW}➡️  Complete verification of all components${COLORS.RESET}`);
    console.log(`  ${COLORS.FG_YELLOW}➡️  Update truth documents with verified information${COLORS.RESET}`);
    console.log(`  ${COLORS.FG_YELLOW}➡️  Progress to Milestone 3 (End-to-End Experience)${COLORS.RESET}`);
  } else {
    console.log(`  ${COLORS.FG_GREEN}➡️  Final verification and validation${COLORS.RESET}`);
    console.log(`  ${COLORS.FG_GREEN}➡️  Prepare launch with verified components${COLORS.RESET}`);
    console.log(`  ${COLORS.FG_GREEN}➡️  Complete Milestone 4 (Launch Readiness)${COLORS.RESET}`);
  }
  
  console.log(`\n${COLORS.DIM}Run this script again to update progress metrics.${COLORS.RESET}`);
}

// Run the script
main().catch(error => {
  console.error(`${COLORS.FG_RED}Error: ${error.message}${COLORS.RESET}`);
  process.exit(1);
}); 