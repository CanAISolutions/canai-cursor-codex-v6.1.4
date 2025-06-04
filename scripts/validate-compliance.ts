#!/usr/bin/env node

/**
 * Codex v6.1.4 Compliance Validation Script
 * Scans codebase for placeholder implementations and validates production readiness
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface ComplianceViolation {
  file: string;
  line: number;
  violation: string;
  severity: 'critical' | 'high' | 'medium';
  pattern: string;
}

class ComplianceValidator {
  private violations: ComplianceViolation[] = [];
  
  // Forbidden patterns that indicate placeholder code
  private forbiddenPatterns = [
    { pattern: /placeholder/i, severity: 'critical' as const, description: 'Placeholder implementation' },
    { pattern: /would integrate/i, severity: 'critical' as const, description: 'Placeholder integration' },
    { pattern: /TODO:/i, severity: 'high' as const, description: 'TODO comment' },
    { pattern: /FIXME:/i, severity: 'high' as const, description: 'FIXME comment' },
    { pattern: /mock implementation/i, severity: 'critical' as const, description: 'Mock implementation' },
    { pattern: /simulated response/i, severity: 'critical' as const, description: 'Simulated response' },
    { pattern: /fake-data/i, severity: 'critical' as const, description: 'Fake data return' },
    { pattern: /console\.log/i, severity: 'medium' as const, description: 'Console.log statement' }
  ];

  // Required patterns for production readiness
  private requiredPatterns = [
    { pattern: /process\.env\./i, description: 'Environment variable usage' },
    { pattern: /try\s*{[\s\S]*catch/i, description: 'Error handling' },
    { pattern: /emitSystemLog/i, description: 'Proper logging' }
  ];

  /**
   * Validate compliance across the codebase
   */
  public validateCompliance(): void {
    console.log('🔍 Starting Codex v6.1.4 Compliance Validation...\n');
    
    const filesToCheck = this.getTypeScriptFiles();
    
    for (const file of filesToCheck) {
      this.validateFile(file);
    }
    
    this.reportResults();
  }

  /**
   * Get all TypeScript files to validate
   */
  private getTypeScriptFiles(): string[] {
    const files: string[] = [];
    const directories = [
      'cursor/services',
      'api/orchestration',
      'api/webhook',
      'tests/dreamstate'
    ];

    for (const dir of directories) {
      try {
        this.scanDirectory(dir, files);
      } catch (error) {
        console.warn(`⚠️  Could not scan directory ${dir}: ${error}`);
      }
    }

    return files;
  }

  /**
   * Recursively scan directory for TypeScript files
   */
  private scanDirectory(dir: string, files: string[]): void {
    try {
      const items = readdirSync(dir);
      
      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          this.scanDirectory(fullPath, files);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
  }

  /**
   * Validate a single file for compliance violations
   */
  private validateFile(filePath: string): void {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        this.checkLineForViolations(filePath, line, index + 1);
      });
      
    } catch (error) {
      console.warn(`⚠️  Could not read file ${filePath}: ${error}`);
    }
  }

  /**
   * Check a single line for compliance violations
   */
  private checkLineForViolations(file: string, line: string, lineNumber: number): void {
    for (const { pattern, severity, description } of this.forbiddenPatterns) {
      if (pattern.test(line)) {
        this.violations.push({
          file,
          line: lineNumber,
          violation: description,
          severity,
          pattern: line.trim()
        });
      }
    }
  }

  /**
   * Report validation results
   */
  private reportResults(): void {
    const criticalViolations = this.violations.filter(v => v.severity === 'critical');
    const highViolations = this.violations.filter(v => v.severity === 'high');
    const mediumViolations = this.violations.filter(v => v.severity === 'medium');

    console.log('📊 COMPLIANCE VALIDATION RESULTS\n');
    console.log(`Total Violations: ${this.violations.length}`);
    console.log(`🚨 Critical: ${criticalViolations.length}`);
    console.log(`⚠️  High: ${highViolations.length}`);
    console.log(`ℹ️  Medium: ${mediumViolations.length}\n`);

    if (criticalViolations.length > 0) {
      console.log('🚨 CRITICAL VIOLATIONS (Must fix immediately):');
      criticalViolations.forEach(v => {
        console.log(`   ${v.file}:${v.line} - ${v.violation}`);
        console.log(`   Pattern: ${v.pattern}\n`);
      });
    }

    if (highViolations.length > 0) {
      console.log('⚠️  HIGH PRIORITY VIOLATIONS:');
      highViolations.forEach(v => {
        console.log(`   ${v.file}:${v.line} - ${v.violation}`);
        console.log(`   Pattern: ${v.pattern}\n`);
      });
    }

    if (mediumViolations.length > 0) {
      console.log('ℹ️  MEDIUM PRIORITY VIOLATIONS:');
      mediumViolations.forEach(v => {
        console.log(`   ${v.file}:${v.line} - ${v.violation}`);
        console.log(`   Pattern: ${v.pattern}\n`);
      });
    }

    // Overall compliance status
    if (criticalViolations.length === 0 && highViolations.length === 0) {
      console.log('✅ COMPLIANCE STATUS: PASSED');
      console.log('   All critical and high-priority violations resolved.');
      
      if (mediumViolations.length > 0) {
        console.log('   Note: Medium-priority violations should be addressed when possible.');
      }
    } else {
      console.log('❌ COMPLIANCE STATUS: FAILED');
      console.log('   Critical or high-priority violations must be resolved before deployment.');
      process.exit(1);
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new ComplianceValidator();
  validator.validateCompliance();
}

export { ComplianceValidator }; 