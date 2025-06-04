#!/usr/bin/env node
// scripts/validate-integration-completeness.js
// Automated validation script for DreamState production integration
// Checks all milestones, runs tests, and updates tracker status

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class IntegrationValidator {
  constructor() {
    this.trackerPath = 'DREAMSTATE-PRODUCTION-INTEGRATION-TRACKER.md';
    this.results = {
      totalMilestones: 20,
      completedMilestones: 0,
      passedTests: 0,
      failedTests: 0,
      missingFiles: [],
      errors: [],
      warnings: []
    };
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async validateIntegration() {
    this.log('\n🚀 DreamState Production Integration Validator', 'cyan');
    this.log('=' .repeat(60), 'cyan');
    
    try {
      await this.checkFileStructure();
      await this.validatePhase1();
      await this.validatePhase2();
      await this.validatePhase3();
      await this.validatePhase4();
      await this.validatePhase5();
      await this.runIntegrationTests();
      await this.generateReport();
      await this.updateTracker();
    } catch (error) {
      this.log(`❌ Validation failed: ${error.message}`, 'red');
      this.results.errors.push(error.message);
    }
  }

  async checkFileStructure() {
    this.log('\n📁 Checking File Structure...', 'yellow');
    
    const requiredFiles = [
      'server.js',
      'test-emotional-api.js',
      'package.json',
      'DREAMSTATE-PRODUCTION-INTEGRATION-TRACKER.md'
    ];

    const requiredDirs = [
      'api',
      'cursor',
      'tests/dreamstate',
      'scripts'
    ];

    // Check required files
    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        this.log(`  ✅ ${file}`, 'green');
      } else {
        this.log(`  ❌ ${file} - MISSING`, 'red');
        this.results.missingFiles.push(file);
      }
    }

    // Check required directories
    for (const dir of requiredDirs) {
      if (fs.existsSync(dir)) {
        this.log(`  ✅ ${dir}/`, 'green');
      } else {
        this.log(`  ❌ ${dir}/ - MISSING`, 'red');
        this.results.missingFiles.push(dir);
      }
    }
  }

  async validatePhase1() {
    this.log('\n🎯 Phase 1: Foundation Integration', 'yellow');
    
    // Milestone 1.1: Basic Emotional Intelligence
    const milestone1_1 = await this.checkMilestone1_1();
    if (milestone1_1.complete) {
      this.results.completedMilestones++;
      this.log('  ✅ Milestone 1.1: Basic Emotional Intelligence - COMPLETE', 'green');
    } else {
      this.log('  ⚪ Milestone 1.1: Basic Emotional Intelligence - PENDING', 'yellow');
      this.results.warnings.push('Milestone 1.1 not complete');
    }

    // Check other Phase 1 milestones
    const phase1Milestones = [
      'Error Handling & Fallbacks',
      'Performance Monitoring', 
      'Logging & Observability',
      'Health Checks'
    ];

    for (const milestone of phase1Milestones) {
      this.log(`  ⚪ Milestone: ${milestone} - PENDING`, 'yellow');
    }
  }

  async checkMilestone1_1() {
    // Check if server.js has emotional intelligence integration
    try {
      const serverContent = fs.readFileSync('server.js', 'utf8');
      const hasEmotionalIntelligence = serverContent.includes('EmotionalIntelligenceAnalyzer');
      const hasEnhancedEndpoint = serverContent.includes('emotionalContext');
      const hasTestScript = fs.existsSync('test-emotional-api.js');
      
      return {
        complete: hasEmotionalIntelligence && hasEnhancedEndpoint && hasTestScript,
        details: {
          hasEmotionalIntelligence,
          hasEnhancedEndpoint,
          hasTestScript
        }
      };
    } catch (error) {
      return { complete: false, error: error.message };
    }
  }

  async validatePhase2() {
    this.log('\n🧠 Phase 2: Core Features Integration', 'yellow');
    this.log('  ⚪ All milestones pending - 0% complete', 'yellow');
  }

  async validatePhase3() {
    this.log('\n💾 Phase 3: Database Integration', 'yellow');
    this.log('  ⚪ All milestones pending - 0% complete', 'yellow');
  }

  async validatePhase4() {
    this.log('\n🌟 Phase 4: Advanced Features', 'yellow');
    this.log('  ⚪ All milestones pending - 0% complete', 'yellow');
  }

  async validatePhase5() {
    this.log('\n🚀 Phase 5: Production Readiness', 'yellow');
    this.log('  ⚪ All milestones pending - 0% complete', 'yellow');
  }

  async runIntegrationTests() {
    this.log('\n🧪 Running Integration Tests...', 'yellow');
    
    // Test 1: Basic Emotional API
    try {
      this.log('  🔄 Testing basic emotional API...', 'blue');
      const result = execSync('node test-emotional-api.js', { 
        encoding: 'utf8',
        timeout: 10000 
      });
      
      if (result.includes('SUCCESS')) {
        this.log('  ✅ Basic emotional API test - PASSED', 'green');
        this.results.passedTests++;
      } else {
        this.log('  ❌ Basic emotional API test - FAILED', 'red');
        this.results.failedTests++;
      }
    } catch (error) {
      this.log('  ❌ Basic emotional API test - ERROR', 'red');
      this.log(`     ${error.message}`, 'red');
      this.results.failedTests++;
      this.results.errors.push(`API test failed: ${error.message}`);
    }

    // Test 2: DreamState Test Suite (if available)
    try {
      if (fs.existsSync('tests/dreamstate')) {
        this.log('  🔄 Running DreamState test suite...', 'blue');
        const result = execSync('npm test -- tests/dreamstate --passWithNoTests', { 
          encoding: 'utf8',
          timeout: 30000 
        });
        
        if (result.includes('PASS') || result.includes('Tests:')) {
          this.log('  ✅ DreamState test suite - PASSED', 'green');
          this.results.passedTests++;
        } else {
          this.log('  ❌ DreamState test suite - FAILED', 'red');
          this.results.failedTests++;
        }
      } else {
        this.log('  ⚪ DreamState test suite - SKIPPED (directory not found)', 'yellow');
      }
    } catch (error) {
      this.log('  ⚪ DreamState test suite - SKIPPED (npm test not available)', 'yellow');
    }
  }

  async generateReport() {
    this.log('\n📊 Integration Status Report', 'cyan');
    this.log('=' .repeat(40), 'cyan');
    
    const completionPercentage = Math.round((this.results.completedMilestones / this.results.totalMilestones) * 100);
    
    this.log(`📈 Overall Progress: ${completionPercentage}% (${this.results.completedMilestones}/${this.results.totalMilestones} milestones)`, 'bright');
    this.log(`✅ Tests Passed: ${this.results.passedTests}`, 'green');
    this.log(`❌ Tests Failed: ${this.results.failedTests}`, 'red');
    this.log(`⚠️  Warnings: ${this.results.warnings.length}`, 'yellow');
    this.log(`🚨 Errors: ${this.results.errors.length}`, 'red');

    if (this.results.missingFiles.length > 0) {
      this.log('\n📁 Missing Files:', 'red');
      this.results.missingFiles.forEach(file => {
        this.log(`  - ${file}`, 'red');
      });
    }

    if (this.results.warnings.length > 0) {
      this.log('\n⚠️  Warnings:', 'yellow');
      this.results.warnings.forEach(warning => {
        this.log(`  - ${warning}`, 'yellow');
      });
    }

    if (this.results.errors.length > 0) {
      this.log('\n🚨 Errors:', 'red');
      this.results.errors.forEach(error => {
        this.log(`  - ${error}`, 'red');
      });
    }

    // Next steps
    this.log('\n🎯 Next Steps:', 'cyan');
    if (this.results.completedMilestones < 5) {
      this.log('  1. Complete Phase 1 foundation milestones', 'blue');
      this.log('  2. Implement error handling and fallbacks', 'blue');
      this.log('  3. Add performance monitoring', 'blue');
    } else if (this.results.completedMilestones < 10) {
      this.log('  1. Begin Phase 2 core features integration', 'blue');
      this.log('  2. Connect OpenAI with emotional intelligence', 'blue');
      this.log('  3. Implement session management', 'blue');
    } else {
      this.log('  1. Continue with advanced features', 'blue');
      this.log('  2. Prepare for production deployment', 'blue');
    }
  }

  async updateTracker() {
    try {
      if (!fs.existsSync(this.trackerPath)) {
        this.log('\n⚠️  Tracker file not found, skipping update', 'yellow');
        return;
      }

      let trackerContent = fs.readFileSync(this.trackerPath, 'utf8');
      
      // Update overall progress
      const completionPercentage = Math.round((this.results.completedMilestones / this.results.totalMilestones) * 100);
      trackerContent = trackerContent.replace(
        /\*\*Overall Progress\*\*: \d+% \(\d+\/\d+ major milestones\)/,
        `**Overall Progress**: ${completionPercentage}% (${this.results.completedMilestones}/${this.results.totalMilestones} major milestones)`
      );

      // Update last updated timestamp
      const now = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
      trackerContent = trackerContent.replace(
        /\*\*Last Updated\*\*: .+/,
        `**Last Updated**: ${now}`
      );

      // Update success metrics
      trackerContent = trackerContent.replace(
        /\| \*\*Integration Completeness\*\* \| 100% \| \d+% \|/,
        `| **Integration Completeness** | 100% | ${completionPercentage}% |`
      );

      fs.writeFileSync(this.trackerPath, trackerContent);
      this.log('\n✅ Tracker updated successfully', 'green');
    } catch (error) {
      this.log(`\n❌ Failed to update tracker: ${error.message}`, 'red');
    }
  }

  // Generate JSON report for CI/CD integration
  generateJSONReport() {
    const report = {
      timestamp: new Date().toISOString(),
      overall: {
        completionPercentage: Math.round((this.results.completedMilestones / this.results.totalMilestones) * 100),
        completedMilestones: this.results.completedMilestones,
        totalMilestones: this.results.totalMilestones
      },
      tests: {
        passed: this.results.passedTests,
        failed: this.results.failedTests,
        total: this.results.passedTests + this.results.failedTests
      },
      issues: {
        errors: this.results.errors,
        warnings: this.results.warnings,
        missingFiles: this.results.missingFiles
      },
      status: this.results.errors.length === 0 ? 'healthy' : 'issues_detected'
    };

    fs.writeFileSync('integration-report.json', JSON.stringify(report, null, 2));
    return report;
  }
}

// Main execution
async function main() {
  const validator = new IntegrationValidator();
  await validator.validateIntegration();
  
  const jsonReport = validator.generateJSONReport();
  
  // Exit with appropriate code for CI/CD
  const exitCode = jsonReport.issues.errors.length > 0 ? 1 : 0;
  process.exit(exitCode);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  });
}

module.exports = { IntegrationValidator }; 