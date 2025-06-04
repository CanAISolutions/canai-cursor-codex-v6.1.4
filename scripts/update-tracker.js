#!/usr/bin/env node

/**
 * CanAI Integration Tracker Updater
 * Automatically updates CANAI-INTEGRATION-TRACKER.md with real-time metrics
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TRACKER_FILE = 'CANAI-INTEGRATION-TRACKER.md';

class TrackerUpdater {
  constructor() {
    this.trackerPath = path.join(process.cwd(), TRACKER_FILE);
    this.timestamp = new Date().toISOString();
  }

  /**
   * Update tracker with current metrics
   */
  async updateTracker(updates = {}) {
    try {
      console.log('🔄 Updating integration tracker...');
      
      // Read current tracker
      let content = fs.readFileSync(this.trackerPath, 'utf8');
      
      // Update timestamp
      content = this.updateTimestamp(content);
      
      // Update metrics if provided
      if (updates.metrics) {
        content = this.updateMetrics(content, updates.metrics);
      }
      
      // Update phase progress if provided
      if (updates.phase) {
        content = this.updatePhaseProgress(content, updates.phase);
      }
      
      // Update checklist items if provided
      if (updates.checklist) {
        content = this.updateChecklist(content, updates.checklist);
      }
      
      // Write updated content
      fs.writeFileSync(this.trackerPath, content);
      
      console.log('✅ Tracker updated successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error updating tracker:', error.message);
      return false;
    }
  }

  /**
   * Update timestamp in tracker
   */
  updateTimestamp(content) {
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
    return content.replace(
      /> \*\*⏱️ Last Updated\*\*: .+/,
      `> **⏱️ Last Updated**: ${timestamp}`
    );
  }

  /**
   * Update metrics in the dashboard
   */
  updateMetrics(content, metrics) {
    Object.keys(metrics).forEach(metric => {
      const value = metrics[metric];
      const pattern = new RegExp(`(\\| ${metric} \\| [^|]+ \\| )[^|]+(\\| [^|]+ \\| [^|]+ \\|)`, 'g');
      content = content.replace(pattern, `$1${value}$2`);
    });
    return content;
  }

  /**
   * Update phase progress
   */
  updatePhaseProgress(content, phaseUpdates) {
    Object.keys(phaseUpdates).forEach(phase => {
      const update = phaseUpdates[phase];
      
      // Update phase status in executive dashboard
      const phasePattern = new RegExp(
        `(\\| ${phase}[^|]+ \\| )[^|]+(\\| )[^|]+(\\| [^|]+ \\| [^|]+ \\| [^|]+ \\|)`,
        'g'
      );
      content = content.replace(
        phasePattern,
        `$1${update.status}$2${update.progress}%$3`
      );
      
      // Update phase score
      if (update.score !== undefined) {
        const scorePattern = new RegExp(
          `(\\*\\*${phase} Score: )[^*]+(\\*\\*)`,
          'g'
        );
        content = content.replace(scorePattern, `$1${update.score}%$2`);
      }
    });
    return content;
  }

  /**
   * Update checklist items
   */
  updateChecklist(content, checklistUpdates) {
    Object.keys(checklistUpdates).forEach(item => {
      const isCompleted = checklistUpdates[item];
      const checkbox = isCompleted ? '[x]' : '[ ]';
      
      // Update checkbox for the item
      const pattern = new RegExp(`(- \\[[ x]\\] \\*\\*${item}\\*\\*)`, 'g');
      content = content.replace(pattern, `- ${checkbox} **${item}**`);
    });
    return content;
  }

  /**
   * Run tests and update metrics
   */
  async runTestsAndUpdate() {
    console.log('🧪 Running tests to update metrics...');
    
    try {
      // Run tests and capture results
      const testResult = execSync('npm test 2>&1', { encoding: 'utf8' });
      
      // Parse test results
      const passedTests = (testResult.match(/✓/g) || []).length;
      const failedTests = (testResult.match(/✗/g) || []).length;
      const totalTests = passedTests + failedTests;
      
      // Update tracker with test results
      await this.updateTracker({
        metrics: {
          'Test Pass Rate': `${totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 100}%`,
          'Build Status': failedTests === 0 ? 'Passing' : 'Failing'
        }
      });
      
      console.log(`📊 Tests: ${passedTests} passed, ${failedTests} failed`);
      
    } catch (error) {
      console.warn('⚠️ Test execution failed, updating with error status');
      await this.updateTracker({
        metrics: {
          'Build Status': 'Failed'
        }
      });
    }
  }

  /**
   * Mark checklist item as complete
   */
  async completeChecklistItem(itemName) {
    console.log(`✅ Marking "${itemName}" as complete...`);
    
    await this.updateTracker({
      checklist: {
        [itemName]: true
      }
    });
  }

  /**
   * Update phase progress
   */
  async updatePhase(phaseName, status, progress, score) {
    console.log(`📊 Updating ${phaseName}: ${status} (${progress}%)`);
    
    await this.updateTracker({
      phase: {
        [phaseName]: {
          status,
          progress,
          score
        }
      }
    });
  }

  /**
   * Generate progress report
   */
  generateReport() {
    console.log('📋 Generating progress report...');
    
    const content = fs.readFileSync(this.trackerPath, 'utf8');
    
    // Extract key metrics
    const completedItems = (content.match(/- \[x\]/g) || []).length;
    const totalItems = (content.match(/- \[[ x]\]/g) || []).length;
    const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    const report = {
      timestamp: this.timestamp,
      completionRate: `${completionRate}%`,
      completedItems,
      totalItems,
      summary: `${completedItems}/${totalItems} items complete (${completionRate}%)`
    };
    
    console.log('📊 Progress Report:', report);
    return report;
  }
}

// CLI Interface
if (require.main === module) {
  const updater = new TrackerUpdater();
  const command = process.argv[2];
  const args = process.argv.slice(3);

  switch (command) {
    case 'update':
      updater.updateTracker();
      break;
      
    case 'test':
      updater.runTestsAndUpdate();
      break;
      
    case 'complete':
      if (args[0]) {
        updater.completeChecklistItem(args[0]);
      } else {
        console.error('❌ Please provide item name: npm run update-tracker complete "Item Name"');
      }
      break;
      
    case 'phase':
      if (args.length >= 3) {
        updater.updatePhase(args[0], args[1], parseInt(args[2]), parseInt(args[3]));
      } else {
        console.error('❌ Usage: npm run update-tracker phase "Phase Name" "Status" progress [score]');
      }
      break;
      
    case 'report':
      updater.generateReport();
      break;
      
    default:
      console.log(`
🔄 CanAI Integration Tracker Updater

Usage:
  node scripts/update-tracker.js <command> [args]

Commands:
  update                           - Update timestamp and basic metrics
  test                            - Run tests and update metrics
  complete "Item Name"            - Mark checklist item as complete
  phase "Phase" "Status" progress - Update phase progress
  report                          - Generate progress report

Examples:
  node scripts/update-tracker.js update
  node scripts/update-tracker.js complete "Form Submission Test"
  node scripts/update-tracker.js phase "Phase 1" "🔄 IN PROGRESS" 50 50
  node scripts/update-tracker.js test
  node scripts/update-tracker.js report
      `);
  }
}

module.exports = TrackerUpdater; 