/**
 * MDC Rule Enforcement Engine
 * 
 * Purpose: Enforce .MDC rules in real development workflows
 * Features: Real-time validation, CI/CD integration, automated blocking
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import * as glob from 'glob';

// Import our MDC processor types
interface MDCRule {
  id: string;
  filePath: string;
  description: string;
  alwaysApply: boolean;
  hasEnforcement: boolean;
  hasEmotionalSovereignty: boolean;
  hasTestRequirements: boolean;
  enforcementCount: number;
  emotionalCheckCount: number;
  testRequirementCount: number;
  trustScoreThreshold?: number;
  requiresSacredReversalTest: boolean;
  requiresTestValidation: boolean;
  globs: string[];
  blockingViolations: string[];
  warningViolations: string[];
  mandatoryRequirements: string[];
}

interface EnforcementResult {
  filePath: string;
  isValid: boolean;
  violations: EnforcementViolation[];
  warnings: EnforcementWarning[];
  rulesApplied: string[];
  trustScore?: number;
  sacredReversalTestPassed: boolean;
  testValidationPassed: boolean;
  emotionalSovereigntyPassed: boolean;
}

interface EnforcementViolation {
  ruleId: string;
  type: 'blocking' | 'mandatory' | 'trust-score' | 'sacred-reversal' | 'test-validation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  suggestion?: string;
  autoFixable: boolean;
}

interface EnforcementWarning {
  ruleId: string;
  type: 'warning' | 'suggestion' | 'improvement';
  message: string;
  suggestion?: string;
}

export class MDCEnforcementEngine {
  private rules: MDCRule[] = [];
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.loadAllRules();
  }

  /**
   * Load all .MDC rule files from the rules directory
   */
  private loadAllRules(): void {
    try {
      // Fix: Look for rules in the correct directory
      const rulesDir = this.projectRoot.includes('cursor/rules') 
        ? this.projectRoot  // Already in rules directory
        : join(this.projectRoot, 'cursor', 'rules'); // Navigate to rules directory
      
      console.log(`[MDC Enforcement] Loading rules from: ${rulesDir}`);
      
      const mdcFiles = readdirSync(rulesDir)
        .filter(file => file.endsWith('.mdc'))
        .map(file => join(rulesDir, file));

      console.log(`[MDC Enforcement] Found ${mdcFiles.length} .mdc files`);

      for (const filePath of mdcFiles) {
        try {
          const rule = this.loadRule(filePath);
          if (rule) {
            this.rules.push(rule);
            console.log(`[MDC Enforcement] Loaded rule: ${rule.id}`);
          }
        } catch (error) {
          console.warn(`[MDC Enforcement] Failed to load rule from ${filePath}:`, error);
        }
      }

      console.log(`[MDC Enforcement] Successfully loaded ${this.rules.length} rules`);
    } catch (error) {
      console.error('[MDC Enforcement] Failed to load rules:', error);
      // Don't fail completely - use fallback rules
      this.loadFallbackRules();
    }
  }

  /**
   * Load and parse a single .MDC rule file
   */
  private loadRule(filePath: string): MDCRule | null {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const ruleId = filePath.split('/').pop()?.replace('.mdc', '') || 
                     filePath.split('\\').pop()?.replace('.mdc', '') || 'unknown';

      // Parse frontmatter for globs
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      let globs = ['**/*'];
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const globsMatch = frontmatter.match(/globs:\s*\[(.*?)\]/s);
        if (globsMatch) {
          globs = globsMatch[1].split(',').map(g => g.trim().replace(/['"]/g, ''));
        }
      }

      // Parse trust score threshold
      const trustScoreMatch = content.match(/trust.*score.*(\d+\.?\d*)/gi);
      const trustScoreThreshold = trustScoreMatch ? 
        parseFloat(trustScoreMatch[0].match(/(\d+\.?\d*)/)?.[1] || '0') : undefined;

      // Parse blocking violations
      const blockingPattern = /❌\s*\*\*BLOCKED\*\*:\s*(.+)/g;
      const blockingViolations: string[] = [];
      let blockMatch;
      while ((blockMatch = blockingPattern.exec(content)) !== null) {
        blockingViolations.push(blockMatch[1].trim());
      }

      // Parse mandatory requirements
      const mandatoryPattern = /\*\*MANDATORY\*\*:\s*(.+)/g;
      const mandatoryRequirements: string[] = [];
      let mandatoryMatch;
      while ((mandatoryMatch = mandatoryPattern.exec(content)) !== null) {
        mandatoryRequirements.push(mandatoryMatch[1].trim());
      }

      // Parse warnings
      const warningPattern = /⚠️\s*\*\*WARNING\*\*:\s*(.+)/g;
      const warningViolations: string[] = [];
      let warningMatch;
      while ((warningMatch = warningPattern.exec(content)) !== null) {
        warningViolations.push(warningMatch[1].trim());
      }

      // Parse requirements
      const requiresSacredReversalTest = content.includes('Sacred Reversal Test');
      const requiresTestValidation = content.includes('test') || content.includes('Test');

      // Count patterns
      const enforcementCount = blockingViolations.length + mandatoryRequirements.length + warningViolations.length;
      const emotionalCheckCount = [
        content.includes('Sacred Reversal Test'),
        /trust.*score.*\d+/gi.test(content),
        content.includes('empowerment') || content.includes('Empowerment')
      ].filter(Boolean).length;
      const testRequirementCount = [
        content.includes('Unit Test'),
        content.includes('Integration Test'),
        content.includes('E2E Test'),
        content.includes('Emotional') && content.includes('test'),
        content.includes('Trust') && content.includes('test')
      ].filter(Boolean).length;

      return {
        id: ruleId,
        filePath,
        description: `Rule: ${ruleId}`,
        alwaysApply: content.includes('alwaysApply: true'),
        hasEnforcement: enforcementCount > 0,
        hasEmotionalSovereignty: emotionalCheckCount > 0,
        hasTestRequirements: testRequirementCount > 0,
        enforcementCount,
        emotionalCheckCount,
        testRequirementCount,
        trustScoreThreshold,
        requiresSacredReversalTest,
        requiresTestValidation,
        globs,
        blockingViolations,
        warningViolations,
        mandatoryRequirements
      };
    } catch (error) {
      console.error(`[MDC Enforcement] Error loading rule ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Enforce rules on a single file
   */
  enforceFile(filePath: string): EnforcementResult {
    const applicableRules = this.getApplicableRules(filePath);
    const violations: EnforcementViolation[] = [];
    const warnings: EnforcementWarning[] = [];
    
    let content: string;
    try {
      content = readFileSync(filePath, 'utf-8');
    } catch (error) {
      return {
        filePath,
        isValid: false,
        violations: [{
          ruleId: 'file-access',
          type: 'blocking',
          severity: 'critical',
          message: `Cannot read file: ${error}`,
          autoFixable: false
        }],
        warnings: [],
        rulesApplied: [],
        sacredReversalTestPassed: false,
        testValidationPassed: false,
        emotionalSovereigntyPassed: false
      };
    }

    let trustScore: number | undefined;
    let sacredReversalTestPassed = true;
    let testValidationPassed = true;
    let emotionalSovereigntyPassed = true;

    for (const rule of applicableRules) {
      // Check blocking violations
      for (const blockingRule of rule.blockingViolations) {
        if (this.checkViolation(content, blockingRule)) {
          violations.push({
            ruleId: rule.id,
            type: 'blocking',
            severity: 'critical',
            message: `BLOCKED: ${blockingRule}`,
            suggestion: this.getSuggestion(blockingRule),
            autoFixable: this.isAutoFixable(blockingRule)
          });
        }
      }

      // Check mandatory requirements
      for (const mandatoryRule of rule.mandatoryRequirements) {
        if (!this.checkCompliance(content, mandatoryRule)) {
          violations.push({
            ruleId: rule.id,
            type: 'mandatory',
            severity: 'high',
            message: `MANDATORY: ${mandatoryRule}`,
            suggestion: this.getSuggestion(mandatoryRule),
            autoFixable: this.isAutoFixable(mandatoryRule)
          });
        }
      }

      // Check trust score
      if (rule.trustScoreThreshold) {
        trustScore = this.calculateTrustScore(content);
        if (trustScore < rule.trustScoreThreshold) {
          violations.push({
            ruleId: rule.id,
            type: 'trust-score',
            severity: 'high',
            message: `Trust score ${trustScore.toFixed(2)} below threshold ${rule.trustScoreThreshold}`,
            suggestion: 'Add emotional intelligence patterns, graceful fallbacks, or empowerment language',
            autoFixable: false
          });
        }
      }

      // Check Sacred Reversal Test
      if (rule.requiresSacredReversalTest) {
        sacredReversalTestPassed = this.checkSacredReversalTest(content);
        if (!sacredReversalTestPassed) {
          violations.push({
            ruleId: rule.id,
            type: 'sacred-reversal',
            severity: 'high',
            message: 'Sacred Reversal Test failed: Code does not honor human dignity',
            suggestion: 'Add empowerment language, graceful fallbacks, or dignity-preserving patterns',
            autoFixable: false
          });
        }
      }

      // Check test validation
      if (rule.requiresTestValidation) {
        testValidationPassed = this.checkTestValidation(content, filePath);
        if (!testValidationPassed) {
          violations.push({
            ruleId: rule.id,
            type: 'test-validation',
            severity: 'high',
            message: 'Test-First Truth violated: No corresponding test validation found',
            suggestion: 'Create unit tests, integration tests, or validation functions',
            autoFixable: true
          });
        }
      }

      // Check warnings
      for (const warningRule of rule.warningViolations) {
        if (this.checkViolation(content, warningRule)) {
          warnings.push({
            ruleId: rule.id,
            type: 'warning',
            message: `WARNING: ${warningRule}`,
            suggestion: this.getSuggestion(warningRule)
          });
        }
      }
    }

    return {
      filePath,
      isValid: violations.length === 0,
      violations,
      warnings,
      rulesApplied: applicableRules.map(r => r.id),
      trustScore,
      sacredReversalTestPassed,
      testValidationPassed,
      emotionalSovereigntyPassed: violations.filter(v => v.type === 'sacred-reversal').length === 0
    };
  }

  /**
   * Enforce rules on multiple files or directories
   */
  async enforceProject(patterns: string[] = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx']): Promise<EnforcementResult[]> {
    const results: EnforcementResult[] = [];
    
    for (const pattern of patterns) {
      try {
        const files = glob.sync(pattern, { 
          cwd: this.projectRoot,
          ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**']
        });
        
        for (const file of files) {
          const fullPath = join(this.projectRoot, file);
          const result = this.enforceFile(fullPath);
          results.push(result);
        }
      } catch (error) {
        console.error(`[MDC Enforcement] Error processing pattern ${pattern}:`, error);
      }
    }

    return results;
  }

  /**
   * Get rules that apply to a specific file
   */
  private getApplicableRules(filePath: string): MDCRule[] {
    const relativePath = relative(this.projectRoot, filePath);
    const applicableRules: MDCRule[] = [];

    for (const rule of this.rules) {
      if (rule.alwaysApply || this.pathMatchesGlobs(relativePath, rule.globs)) {
        applicableRules.push(rule);
      }
    }

    return applicableRules;
  }

  /**
   * Check if a file path matches any glob patterns
   */
  private pathMatchesGlobs(filePath: string, globs: string[]): boolean {
    // Simple glob matching - could be enhanced with a proper glob library
    for (const globPattern of globs) {
      if (globPattern === '**' || globPattern === '**/*') {
        return true;
      }
      if (filePath.includes(globPattern.replace('*', ''))) {
        return true;
      }
      // Check file extension
      if (globPattern.startsWith('*.') && filePath.endsWith(globPattern.substring(1))) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if content violates a rule
   */
  private checkViolation(content: string, rule: string): boolean {
    // Simple pattern matching - could be enhanced with more sophisticated analysis
    const lowerRule = rule.toLowerCase();
    const lowerContent = content.toLowerCase();
    
    if (lowerRule.includes('console.log') && lowerContent.includes('console.log')) {
      return true;
    }
    if (lowerRule.includes('todo') && lowerContent.includes('todo')) {
      return true;
    }
    if (lowerRule.includes('fixme') && lowerContent.includes('fixme')) {
      return true;
    }
    
    return false;
  }

  /**
   * Check if content complies with a mandatory rule
   */
  private checkCompliance(content: string, rule: string): boolean {
    const lowerRule = rule.toLowerCase();
    const lowerContent = content.toLowerCase();
    
    if (lowerRule.includes('comment') && !lowerContent.includes('//') && !lowerContent.includes('/*')) {
      return false;
    }
    if (lowerRule.includes('type') && !lowerContent.includes('interface') && !lowerContent.includes('type')) {
      return false;
    }
    
    return true;
  }

  /**
   * Calculate trust score for content
   */
  private calculateTrustScore(content: string): number {
    let score = 3.0; // Base score
    
    // Positive indicators
    if (content.includes('trust')) score += 0.3;
    if (content.includes('empowerment') || content.includes('empowered')) score += 0.4;
    if (content.includes('dignity')) score += 0.3;
    if (content.includes('graceful')) score += 0.2;
    if (content.includes('fallback')) score += 0.2;
    if (content.includes('validation')) score += 0.2;
    if (content.includes('emotional')) score += 0.3;
    if (content.includes('sacred')) score += 0.2;
    
    // Negative indicators
    if (content.includes('error') && !content.includes('graceful')) score -= 0.2;
    if (content.includes('fail') && !content.includes('fallback')) score -= 0.2;
    if (content.includes('console.log')) score -= 0.1;
    
    return Math.min(5.0, Math.max(1.0, score));
  }

  /**
   * Check Sacred Reversal Test compliance
   */
  private checkSacredReversalTest(content: string): boolean {
    const positiveIndicators = [
      'empowered', 'dignity', 'honored', 'seen', 'graceful', 
      'fallback', 'recovery', 'support', 'guidance'
    ];
    
    const negativeIndicators = [
      'broken', 'failed', 'error', 'crash', 'undefined'
    ];
    
    const positiveCount = positiveIndicators.filter(indicator => 
      content.toLowerCase().includes(indicator)).length;
    const negativeCount = negativeIndicators.filter(indicator => 
      content.toLowerCase().includes(indicator) && 
      !content.toLowerCase().includes('graceful')).length;
    
    return positiveCount > negativeCount;
  }

  /**
   * Check test validation compliance
   */
  private checkTestValidation(content: string, filePath: string): boolean {
    // Check if file has corresponding test
    const testPatterns = [
      filePath.replace(/\.(ts|tsx|js|jsx)$/, '.test.$1'),
      filePath.replace(/\.(ts|tsx|js|jsx)$/, '.spec.$1'),
      filePath.replace(/src\//, 'tests/').replace(/\.(ts|tsx|js|jsx)$/, '.test.$1')
    ];
    
    for (const testPath of testPatterns) {
      try {
        statSync(testPath);
        return true; // Test file exists
      } catch {
        // Test file doesn't exist, continue checking
      }
    }
    
    // Check if content includes test patterns
    return content.includes('test') || content.includes('Test') || 
           content.includes('describe') || content.includes('it(');
  }

  /**
   * Get suggestion for fixing a rule violation
   */
  private getSuggestion(rule: string): string {
    const lowerRule = rule.toLowerCase();
    
    if (lowerRule.includes('console.log')) {
      return 'Replace console.log with proper logging or remove debug statements';
    }
    if (lowerRule.includes('todo')) {
      return 'Complete the TODO item or create a proper issue tracker entry';
    }
    if (lowerRule.includes('comment')) {
      return 'Add meaningful comments explaining the purpose and logic';
    }
    if (lowerRule.includes('type')) {
      return 'Add TypeScript type definitions for better type safety';
    }
    
    return 'Review the rule requirements and update code accordingly';
  }

  /**
   * Check if a rule violation can be automatically fixed
   */
  private isAutoFixable(rule: string): boolean {
    const lowerRule = rule.toLowerCase();
    
    // These can potentially be auto-fixed
    if (lowerRule.includes('console.log')) return true;
    if (lowerRule.includes('todo')) return false; // Requires human decision
    if (lowerRule.includes('comment')) return false; // Requires human input
    if (lowerRule.includes('type')) return false; // Requires human design
    
    return false;
  }

  /**
   * Generate enforcement report
   */
  generateReport(results: EnforcementResult[]): string {
    const totalFiles = results.length;
    const validFiles = results.filter(r => r.isValid).length;
    const invalidFiles = totalFiles - validFiles;
    const totalViolations = results.reduce((sum, r) => sum + r.violations.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
    
    const criticalViolations = results.reduce((sum, r) => 
      sum + r.violations.filter(v => v.severity === 'critical').length, 0);
    const highViolations = results.reduce((sum, r) => 
      sum + r.violations.filter(v => v.severity === 'high').length, 0);
    
    let report = `
🔒 MDC Rule Enforcement Report
============================================
📊 Summary:
   Total Files: ${totalFiles}
   Valid Files: ${validFiles} (${((validFiles/totalFiles)*100).toFixed(1)}%)
   Invalid Files: ${invalidFiles}
   Total Violations: ${totalViolations}
   Total Warnings: ${totalWarnings}

🚨 Severity Breakdown:
   Critical: ${criticalViolations}
   High: ${highViolations}
   Medium: ${totalViolations - criticalViolations - highViolations}

`;

    if (invalidFiles > 0) {
      report += `\n❌ Files with Violations:\n`;
      for (const result of results.filter(r => !r.isValid)) {
        report += `\n📁 ${result.filePath}\n`;
        for (const violation of result.violations) {
          report += `   ${violation.severity === 'critical' ? '🚨' : '⚠️'} [${violation.ruleId}] ${violation.message}\n`;
          if (violation.suggestion) {
            report += `      💡 Suggestion: ${violation.suggestion}\n`;
          }
        }
      }
    }

    if (totalWarnings > 0) {
      report += `\n⚠️ Warnings:\n`;
      for (const result of results.filter(r => r.warnings.length > 0)) {
        for (const warning of result.warnings) {
          report += `   📁 ${result.filePath}: ${warning.message}\n`;
        }
      }
    }

    return report;
  }

  /**
   * Load fallback rules when .MDC files can't be loaded
   */
  private loadFallbackRules(): void {
    console.log('[MDC Enforcement] Loading fallback rules...');
    
    // Create basic fallback rules for essential enforcement
    const fallbackRules: MDCRule[] = [
      {
        id: 'fallback-console-log',
        filePath: 'fallback',
        description: 'Block console.log statements',
        globs: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        alwaysApply: true,
        hasEnforcement: true,
        hasEmotionalSovereignty: false,
        hasTestRequirements: false,
        enforcementCount: 1,
        emotionalCheckCount: 0,
        testRequirementCount: 0,
        requiresSacredReversalTest: false,
        requiresTestValidation: false,
        blockingViolations: ['console.log'],
        warningViolations: [],
        mandatoryRequirements: []
      },
      {
        id: 'fallback-trust-score',
        filePath: 'fallback',
        description: 'Ensure minimum trust score',
        globs: ['**/*.ts', '**/*.tsx'],
        alwaysApply: true,
        hasEnforcement: true,
        hasEmotionalSovereignty: true,
        hasTestRequirements: true,
        enforcementCount: 1,
        emotionalCheckCount: 1,
        testRequirementCount: 1,
        trustScoreThreshold: 4.2,
        requiresSacredReversalTest: true,
        requiresTestValidation: true,
        blockingViolations: ['trust score below 4.2'],
        warningViolations: [],
        mandatoryRequirements: ['Sacred Reversal Test', 'Test validation']
      }
    ];

    this.rules = fallbackRules;
    console.log(`[MDC Enforcement] Loaded ${fallbackRules.length} fallback rules`);
  }
}

// Export singleton instance
export const mdcEnforcement = new MDCEnforcementEngine(); 