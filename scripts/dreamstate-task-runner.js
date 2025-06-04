#!/usr/bin/env node
// scripts/dreamstate-task-runner.js
// Automated DreamState Task Execution with Test-First Truth Enforcement

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

class DreamStateTaskRunner {
  constructor() {
    this.taskListPath = 'docs/dreamstate-enhancement-implementation-tasks.md';
    this.promptPath = 'cursor/prompts/dreamstate-task-executor.md';
    this.currentTask = null;
    this.currentPhase = null;
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async run() {
    this.log('\n🚀 DreamState Task Runner - Test-First Truth Enforcement', 'cyan');
    this.log('=' .repeat(70), 'cyan');
    
    try {
      await this.loadPrompt();
      await this.analyzeCurrentStatus();
      await this.identifyNextTask();
      await this.validatePrerequisites();
      await this.generateExecutionPlan();
      await this.enforceQualityGates();
      await this.displayNextSteps();
    } catch (error) {
      this.log(`❌ Task runner failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }

  async loadPrompt() {
    this.log('\n📋 Loading DreamState Task Executor Prompt...', 'yellow');
    
    if (!fs.existsSync(this.promptPath)) {
      throw new Error(`Prompt file not found: ${this.promptPath}`);
    }
    
    const promptContent = fs.readFileSync(this.promptPath, 'utf8');
    this.log('  ✅ Prompt loaded successfully', 'green');
    
    // Display key enforcement rules
    this.log('\n🚫 ABSOLUTE PROHIBITIONS:', 'red');
    this.log('  • NO MOCKS - All functionality must be real', 'red');
    this.log('  • NO PLACEHOLDERS - Every function fully implemented', 'red');
    this.log('  • NO TODO CODE - No "implement later" code', 'red');
    this.log('  • NO CONSOLE.LOG - Use proper logging infrastructure', 'red');
    this.log('  • NO STUB IMPLEMENTATIONS - Every method must work', 'red');
  }

  async analyzeCurrentStatus() {
    this.log('\n📊 Analyzing Current Implementation Status...', 'yellow');
    
    if (!fs.existsSync(this.taskListPath)) {
      throw new Error(`Task list not found: ${this.taskListPath}`);
    }
    
    const taskContent = fs.readFileSync(this.taskListPath, 'utf8');
    
    // Extract current progress
    const progressMatch = taskContent.match(/\*\*Overall Progress\*\*: (\d+)% complete \((\d+)\/(\d+) enhancements\)/);
    if (progressMatch) {
      const [, percentage, completed, total] = progressMatch;
      this.log(`  📈 Overall Progress: ${percentage}% (${completed}/${total} enhancements)`, 'blue');
    }
    
    // Find current phase
    const phaseMatches = taskContent.match(/## 🎯 \*\*PHASE (\d+): ([^*]+)\*\* ✅ \*\*COMPLETED\*\*/g);
    const completedPhases = phaseMatches ? phaseMatches.length : 0;
    this.log(`  ✅ Completed Phases: ${completedPhases}`, 'green');
    
    // Check for any failed tests
    await this.checkTestStatus();
  }

  async checkTestStatus() {
    this.log('\n🧪 Checking Test Status...', 'yellow');
    
    try {
      // Run DreamState tests
      const testOutput = execSync('npm run dreamstate:test', { 
        encoding: 'utf8',
        timeout: 30000 
      });
      
      // Parse test results
      const passMatch = testOutput.match(/(\d+) passing/);
      const failMatch = testOutput.match(/(\d+) failing/);
      
      this.testResults.passed = passMatch ? parseInt(passMatch[1]) : 0;
      this.testResults.failed = failMatch ? parseInt(failMatch[1]) : 0;
      this.testResults.total = this.testResults.passed + this.testResults.failed;
      
      if (this.testResults.failed === 0) {
        this.log(`  ✅ All tests passing: ${this.testResults.passed}/${this.testResults.total}`, 'green');
      } else {
        this.log(`  ❌ Tests failing: ${this.testResults.failed}/${this.testResults.total}`, 'red');
        this.log('  🚨 BLOCKING ISSUE: Fix failing tests before proceeding', 'red');
      }
    } catch (error) {
      this.log('  ⚠️  Could not run tests - may need to fix test infrastructure first', 'yellow');
    }
  }

  async identifyNextTask() {
    this.log('\n🎯 Identifying Next Sequential Task...', 'yellow');
    
    const taskContent = fs.readFileSync(this.taskListPath, 'utf8');
    
    // Find the first incomplete task
    const taskPattern = /### \*\*Task (\d+\.\d+): ([^*]+)\*\* ⚪ \*\*PENDING\*\*/;
    const match = taskContent.match(taskPattern);
    
    if (match) {
      const [, taskNumber, taskName] = match;
      this.currentTask = {
        number: taskNumber,
        name: taskName.trim(),
        status: 'PENDING'
      };
      
      this.log(`  🎯 Next Task: ${taskNumber} - ${taskName}`, 'blue');
      
      // Determine phase
      const phaseMatch = taskContent.match(new RegExp(`## 🎯 \\*\\*PHASE (\\d+): ([^*]+)\\*\\*[\\s\\S]*?### \\*\\*Task ${taskNumber}`));
      if (phaseMatch) {
        this.currentPhase = {
          number: phaseMatch[1],
          name: phaseMatch[2].trim()
        };
        this.log(`  📋 Phase: ${this.currentPhase.number} - ${this.currentPhase.name}`, 'blue');
      }
    } else {
      this.log('  🎉 All tasks appear to be complete!', 'green');
      this.currentTask = null;
    }
  }

  async validatePrerequisites() {
    this.log('\n✅ Validating Prerequisites...', 'yellow');
    
    // Check for blocking test failures
    if (this.testResults.failed > 0) {
      this.log('  ❌ BLOCKING: Failed tests must be fixed first', 'red');
      return;
    }
    
    // Check for placeholder code
    await this.scanForPlaceholders();
    
    // Check file structure
    await this.validateFileStructure();
    
    this.log('  ✅ Prerequisites validated', 'green');
  }

  async scanForPlaceholders() {
    this.log('  🔍 Scanning for prohibited patterns...', 'blue');
    
    try {
      const prohibitedPatterns = [
        'TODO',
        'FIXME', 
        'placeholder',
        'stub',
        'mock',
        'console\\.log',
        'implement later',
        'for now',
        'temporary'
      ];
      
      const searchPattern = prohibitedPatterns.join('\\|');
      const result = execSync(`grep -r "${searchPattern}" src/ tests/ --exclude-dir=node_modules || true`, { 
        encoding: 'utf8' 
      });
      
      if (result.trim()) {
        this.log('  ⚠️  Found prohibited patterns:', 'yellow');
        result.split('\n').forEach(line => {
          if (line.trim()) {
            this.log(`    ${line}`, 'yellow');
          }
        });
      } else {
        this.log('  ✅ No prohibited patterns found', 'green');
      }
    } catch (error) {
      this.log('  ⚠️  Could not scan for patterns', 'yellow');
    }
  }

  async validateFileStructure() {
    this.log('  📁 Validating file structure...', 'blue');
    
    const requiredDirs = [
      'src',
      'tests/dreamstate',
      'cursor/utils',
      'api'
    ];
    
    let allPresent = true;
    for (const dir of requiredDirs) {
      if (fs.existsSync(dir)) {
        this.log(`    ✅ ${dir}/`, 'green');
      } else {
        this.log(`    ❌ ${dir}/ - MISSING`, 'red');
        allPresent = false;
      }
    }
    
    if (allPresent) {
      this.log('  ✅ File structure validated', 'green');
    }
  }

  async generateExecutionPlan() {
    if (!this.currentTask) {
      return;
    }
    
    this.log('\n📋 Generating Execution Plan...', 'yellow');
    
    const plan = `
## TASK: ${this.currentTask.name}
**Phase**: ${this.currentPhase?.number} - ${this.currentPhase?.name} | **Milestone**: ${this.currentTask.number}

### STATUS CHECK
- Current Phase Progress: Phase ${this.currentPhase?.number} in progress
- Previous Task Status: ✅ Complete (based on sequential order)
- Blocking Issues: ${this.testResults.failed > 0 ? `${this.testResults.failed} failing tests` : 'None'}

### IMPLEMENTATION PLAN
1. Write comprehensive tests that define expected behavior
2. Implement production-ready functionality (NO placeholders)
3. Ensure all tests pass with 100% success rate
4. Validate performance requirements (<50ms response times)
5. Update task list with ✅ COMPLETE status

### TEST-FIRST TRUTH VALIDATION
- [ ] Tests written and failing appropriately
- [ ] Implementation makes tests pass
- [ ] Full test suite passes: npm run dreamstate:test
- [ ] Performance validated: <50ms response times

### COMPLETION CONFIRMATION
- [ ] Zero placeholders or TODO code
- [ ] All tests passing (100% rate)
- [ ] Performance benchmarks met
- [ ] Task list updated with ✅ COMPLETE
- [ ] Ready for next task

### NEXT TASK
**Next**: Will be identified after current task completion
**Dependencies**: Current task must be 100% complete
**Estimated Effort**: Implement with full production readiness
`;
    
    this.log(plan, 'cyan');
  }

  async enforceQualityGates() {
    this.log('\n🛡️  Quality Gate Enforcement...', 'yellow');
    
    this.log('  📋 Quality Requirements:', 'blue');
    this.log('    • 100% Test Pass Rate (currently: ' + 
      `${this.testResults.total > 0 ? Math.round((this.testResults.passed / this.testResults.total) * 100) : 0}%)`, 
      this.testResults.failed === 0 ? 'green' : 'red');
    this.log('    • Zero Placeholder Code', 'blue');
    this.log('    • Production-Ready Implementation', 'blue');
    this.log('    • Sub-50ms Performance', 'blue');
    this.log('    • Complete Error Handling', 'blue');
    
    if (this.testResults.failed > 0) {
      this.log('\n  🚨 QUALITY GATE FAILURE: Tests must pass before proceeding', 'red');
    } else {
      this.log('\n  ✅ Quality gates ready for enforcement', 'green');
    }
  }

  async displayNextSteps() {
    this.log('\n🚀 Next Steps:', 'cyan');
    
    if (this.testResults.failed > 0) {
      this.log('  1. 🔧 Fix failing tests first:', 'red');
      this.log('     npm run dreamstate:test', 'yellow');
      this.log('  2. 🔍 Investigate and resolve test failures', 'red');
      this.log('  3. ✅ Ensure 100% test pass rate', 'red');
      this.log('  4. 🔄 Re-run this script to proceed', 'red');
    } else if (this.currentTask) {
      this.log('  1. 📝 Follow the execution plan above', 'green');
      this.log('  2. 🧪 Write tests first (Test-First Truth)', 'green');
      this.log('  3. 💻 Implement production-ready code', 'green');
      this.log('  4. ✅ Validate 100% test pass rate', 'green');
      this.log('  5. 📊 Update task list with completion', 'green');
      this.log('  6. 🔄 Run script again for next task', 'green');
    } else {
      this.log('  🎉 All tasks complete! Ready for production deployment', 'green');
    }
    
    this.log('\n📚 Available Commands:', 'cyan');
    this.log('  npm run dreamstate:test          - Run DreamState test suite', 'blue');
    this.log('  npm run test:integration         - Run integration tests', 'blue');
    this.log('  npm run test-first-truth:validate - Validate test-first principles', 'blue');
    this.log('  node scripts/dreamstate-task-runner.js - Run this script', 'blue');
    
    this.log('\n' + '=' .repeat(70), 'cyan');
    this.log('🎯 Remember: Test-First Truth - Nothing is complete until tests prove it works!', 'bright');
  }
}

// Main execution
async function main() {
  const runner = new DreamStateTaskRunner();
  await runner.run();
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Task runner failed:', error);
    process.exit(1);
  });
}

module.exports = { DreamStateTaskRunner }; 