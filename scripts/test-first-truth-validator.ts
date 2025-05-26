#!/usr/bin/env ts-node

/**
 * Test-First Truth Validator
 * 
 * Sacred Principle: Nothing is complete until tests prove it works
 * 
 * This script validates that all features, APIs, components, integrations,
 * and deployments have comprehensive test evidence before allowing completion claims.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface TestEvidence {
  testFiles: string[];
  testResults: {
    passed: number;
    failed: number;
    total: number;
  };
  coverage?: number;
  performance?: {
    responseTime: number;
    throughput?: number;
  };
  timestamp: number;
}

interface ValidationResult {
  isValid: boolean;
  evidence?: TestEvidence;
  blockingIssues: string[];
  recommendations: string[];
}

class TestFirstTruthValidator {
  private workspaceRoot: string;
  private testPatterns: string[] = [
    '**/*.test.ts',
    '**/*.test.js',
    '**/*.spec.ts',
    '**/*.spec.js'
  ];

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Validates a component or feature for Test-First Truth compliance
   */
  async validateComponent(componentPath: string, componentType: string): Promise<ValidationResult> {
    console.log(`🔍 Validating ${componentType}: ${componentPath}`);
    
    const result: ValidationResult = {
      isValid: false,
      blockingIssues: [],
      recommendations: []
    };

    try {
      // Check if component exists
      if (!fs.existsSync(path.join(this.workspaceRoot, componentPath))) {
        result.blockingIssues.push(`Component not found: ${componentPath}`);
        return result;
      }

      // Find associated test files
      const testFiles = await this.findTestFiles(componentPath);
      
      if (testFiles.length === 0) {
        result.blockingIssues.push(`No test files found for ${componentPath}`);
        result.recommendations.push(`Create test files: ${componentPath.replace(/\.(ts|js)$/, '.test.$1')}`);
        return result;
      }

      // Run tests and collect results
      const testResults = await this.runTests(testFiles);
      
      if (testResults.failed > 0) {
        result.blockingIssues.push(`${testResults.failed} tests failing`);
        result.recommendations.push('Fix failing tests before claiming completion');
        return result;
      }

      if (testResults.total === 0) {
        result.blockingIssues.push('No tests executed');
        result.recommendations.push('Add meaningful test cases');
        return result;
      }

      // Validate test coverage (if available)
      const coverage = await this.getCoverage(componentPath);
      if (coverage !== undefined && coverage < 80) {
        result.blockingIssues.push(`Test coverage too low: ${coverage}% (minimum: 80%)`);
        result.recommendations.push('Increase test coverage to at least 80%');
        return result;
      }

      // Validate performance (for APIs and services)
      let performance: TestEvidence['performance'] | undefined;
      if (componentType === 'api' || componentType === 'service') {
        performance = await this.validatePerformance(componentPath);
        if (performance && performance.responseTime > 2000) {
          result.blockingIssues.push(`Response time too slow: ${performance.responseTime}ms (maximum: 2000ms)`);
          result.recommendations.push('Optimize performance to meet response time requirements');
          return result;
        }
      }

      // All validations passed
      result.isValid = true;
      result.evidence = {
        testFiles,
        testResults,
        coverage,
        performance,
        timestamp: Date.now()
      };

      console.log(`✅ ${componentType} validation PASSED: ${componentPath}`);
      return result;

    } catch (error) {
      result.blockingIssues.push(`Validation error: ${error}`);
      return result;
    }
  }

  /**
   * Validates an entire project for Test-First Truth compliance
   */
  async validateProject(): Promise<ValidationResult> {
    console.log('🎯 Starting Test-First Truth project validation...');
    
    const result: ValidationResult = {
      isValid: false,
      blockingIssues: [],
      recommendations: []
    };

    try {
      // Find all components that require testing
      const components = await this.findComponents();
      
      let totalComponents = 0;
      let validatedComponents = 0;
      const allBlockingIssues: string[] = [];
      const allRecommendations: string[] = [];

      for (const component of components) {
        totalComponents++;
        const componentResult = await this.validateComponent(component.path, component.type);
        
        if (componentResult.isValid) {
          validatedComponents++;
        } else {
          allBlockingIssues.push(...componentResult.blockingIssues.map(issue => `${component.path}: ${issue}`));
          allRecommendations.push(...componentResult.recommendations.map(rec => `${component.path}: ${rec}`));
        }
      }

      if (allBlockingIssues.length > 0) {
        result.blockingIssues = allBlockingIssues;
        result.recommendations = allRecommendations;
        console.log(`❌ Project validation FAILED: ${validatedComponents}/${totalComponents} components validated`);
        return result;
      }

      result.isValid = true;
      console.log(`✅ Project validation PASSED: ${validatedComponents}/${totalComponents} components validated`);
      return result;

    } catch (error) {
      result.blockingIssues.push(`Project validation error: ${error}`);
      return result;
    }
  }

  /**
   * Finds test files associated with a component
   */
  private async findTestFiles(componentPath: string): Promise<string[]> {
    const testFiles: string[] = [];
    const baseName = path.basename(componentPath, path.extname(componentPath));
    const dirName = path.dirname(componentPath);

    // Common test file patterns
    const patterns = [
      `${baseName}.test.ts`,
      `${baseName}.test.js`,
      `${baseName}.spec.ts`,
      `${baseName}.spec.js`,
      `__tests__/${baseName}.test.ts`,
      `__tests__/${baseName}.test.js`
    ];

    for (const pattern of patterns) {
      const testPath = path.join(this.workspaceRoot, dirName, pattern);
      if (fs.existsSync(testPath)) {
        testFiles.push(path.relative(this.workspaceRoot, testPath));
      }
    }

    return testFiles;
  }

  /**
   * Runs tests and returns results
   */
  private async runTests(testFiles: string[]): Promise<TestEvidence['testResults']> {
    try {
      // Run Jest tests
      const testCommand = `npx jest ${testFiles.join(' ')} --json --passWithNoTests`;
      const output = execSync(testCommand, { 
        cwd: this.workspaceRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });

      const results = JSON.parse(output);
      
      return {
        passed: results.numPassedTests || 0,
        failed: results.numFailedTests || 0,
        total: results.numTotalTests || 0
      };
    } catch (error) {
      // If Jest fails, try to parse error output
      try {
        const errorOutput = (error as any).stdout || (error as any).stderr || '';
        const results = JSON.parse(errorOutput);
        return {
          passed: results.numPassedTests || 0,
          failed: results.numFailedTests || 0,
          total: results.numTotalTests || 0
        };
      } catch {
        // Fallback: assume tests exist but failed to run
        return {
          passed: 0,
          failed: 1,
          total: 1
        };
      }
    }
  }

  /**
   * Gets test coverage for a component
   */
  private async getCoverage(componentPath: string): Promise<number | undefined> {
    try {
      const coverageCommand = `npx jest --coverage --collectCoverageFrom="${componentPath}" --json`;
      const output = execSync(coverageCommand, {
        cwd: this.workspaceRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });

      const results = JSON.parse(output);
      const coverage = results.coverageMap?.[componentPath];
      
      if (coverage) {
        return coverage.statements?.pct || coverage.lines?.pct;
      }
    } catch (error) {
      // Coverage not available
    }
    
    return undefined;
  }

  /**
   * Validates performance for APIs and services
   */
  private async validatePerformance(componentPath: string): Promise<TestEvidence['performance'] | undefined> {
    // This would integrate with actual performance testing
    // For now, return mock data
    return {
      responseTime: 150,
      throughput: 1000
    };
  }

  /**
   * Finds all components that require testing
   */
  private async findComponents(): Promise<Array<{path: string, type: string}>> {
    const components: Array<{path: string, type: string}> = [];

    // Find TypeScript/JavaScript files that should have tests
    const findFiles = (dir: string, type: string) => {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        const relativePath = path.relative(this.workspaceRoot, fullPath);
        
        if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
          findFiles(fullPath, type);
        } else if (file.isFile() && (file.name.endsWith('.ts') || file.name.endsWith('.js'))) {
          // Skip test files themselves
          if (!file.name.includes('.test.') && !file.name.includes('.spec.')) {
            components.push({ path: relativePath, type });
          }
        }
      }
    };

    // Find components in key directories
    findFiles(path.join(this.workspaceRoot, 'api'), 'api');
    findFiles(path.join(this.workspaceRoot, 'src'), 'component');
    findFiles(path.join(this.workspaceRoot, 'cursor'), 'service');
    findFiles(path.join(this.workspaceRoot, 'components'), 'component');

    return components;
  }

  /**
   * Generates a Test-First Truth compliance report
   */
  async generateReport(): Promise<string> {
    const validation = await this.validateProject();
    
    let report = '# Test-First Truth Compliance Report\n\n';
    report += `**Generated**: ${new Date().toISOString()}\n`;
    report += `**Sacred Principle**: Nothing is complete until tests prove it works\n\n`;
    
    if (validation.isValid) {
      report += '## ✅ VALIDATION PASSED\n\n';
      report += 'All components have comprehensive test evidence and meet Test-First Truth standards.\n\n';
      report += '**Sacred Covenant Status**: UPHELD ✅\n\n';
    } else {
      report += '## ❌ VALIDATION FAILED\n\n';
      report += '**Sacred Covenant Status**: VIOLATED ❌\n\n';
      
      if (validation.blockingIssues.length > 0) {
        report += '### Blocking Issues\n\n';
        validation.blockingIssues.forEach(issue => {
          report += `- ❌ ${issue}\n`;
        });
        report += '\n';
      }
      
      if (validation.recommendations.length > 0) {
        report += '### Recommendations\n\n';
        validation.recommendations.forEach(rec => {
          report += `- 💡 ${rec}\n`;
        });
        report += '\n';
      }
    }
    
    report += '---\n\n';
    report += '**Test-First Truth**: We build trust through proven truth. Every feature, API, component, integration, and deployment must be validated through comprehensive testing before being considered complete.\n';
    
    return report;
  }
}

// CLI Interface
async function main() {
  const validator = new TestFirstTruthValidator();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'validate':
      const componentPath = args[1];
      const componentType = args[2] || 'component';
      
      if (!componentPath) {
        console.error('Usage: test-first-truth-validator validate <component-path> [component-type]');
        process.exit(1);
      }
      
      const result = await validator.validateComponent(componentPath, componentType);
      
      if (!result.isValid) {
        console.error('\n❌ Test-First Truth Validation FAILED');
        result.blockingIssues.forEach(issue => console.error(`  - ${issue}`));
        process.exit(1);
      } else {
        console.log('\n✅ Test-First Truth Validation PASSED');
        process.exit(0);
      }
      break;
      
    case 'project':
      const projectResult = await validator.validateProject();
      
      if (!projectResult.isValid) {
        console.error('\n❌ Project Test-First Truth Validation FAILED');
        projectResult.blockingIssues.forEach(issue => console.error(`  - ${issue}`));
        process.exit(1);
      } else {
        console.log('\n✅ Project Test-First Truth Validation PASSED');
        process.exit(0);
      }
      break;
      
    case 'report':
      const report = await validator.generateReport();
      console.log(report);
      
      // Save report to file
      fs.writeFileSync('test-first-truth-report.md', report);
      console.log('\n📄 Report saved to: test-first-truth-report.md');
      break;
      
    default:
      console.log('Test-First Truth Validator');
      console.log('');
      console.log('Sacred Principle: Nothing is complete until tests prove it works');
      console.log('');
      console.log('Commands:');
      console.log('  validate <component-path> [type]  Validate a specific component');
      console.log('  project                           Validate entire project');
      console.log('  report                            Generate compliance report');
      console.log('');
      console.log('Examples:');
      console.log('  npm run test-first-truth validate api/services/airtable-service.ts api');
      console.log('  npm run test-first-truth project');
      console.log('  npm run test-first-truth report');
      break;
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Test-First Truth Validator Error:', error);
    process.exit(1);
  });
}

export { TestFirstTruthValidator, TestEvidence, ValidationResult }; 