/**
 * MDC (Markdown Codex) Rule Processor
 * 
 * Purpose: Load, parse, and process .mdc rule files into executable governance logic
 * This is the missing piece that bridges .mdc files to the rule engines
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export interface MDCRule {
  id: string;
  description: string;
  globs: string[];
  alwaysApply: boolean;
  ruleType: 'Always' | 'Conditional' | 'Context';
  content: string;
  frontmatter: Record<string, any>;
  filePath: string;
  enforcement: MDCEnforcement[];
  emotionalSovereignty: MDCEmotionalCheck[];
  testRequirements: MDCTestRequirement[];
}

export interface MDCEnforcement {
  type: 'block' | 'warn' | 'require' | 'validate';
  condition: string;
  action: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface MDCEmotionalCheck {
  type: 'sacred-reversal-test' | 'trust-score' | 'empowerment-validation';
  threshold?: number;
  description: string;
}

export interface MDCTestRequirement {
  type: 'unit' | 'integration' | 'e2e' | 'emotional' | 'trust';
  required: boolean;
  threshold?: number;
}

export class MDCProcessor {
  private rulesDir: string;
  private loadedRules: Map<string, MDCRule> = new Map();

  constructor(rulesDir: string = './cursor/rules') {
    this.rulesDir = rulesDir;
  }

  /**
   * Load all .mdc files from the rules directory
   */
  loadAllRules(): MDCRule[] {
    const mdcFiles = readdirSync(this.rulesDir)
      .filter(file => file.endsWith('.mdc'))
      .map(file => join(this.rulesDir, file));

    const rules: MDCRule[] = [];
    
    for (const filePath of mdcFiles) {
      try {
        const rule = this.loadRule(filePath);
        if (rule) {
          rules.push(rule);
          this.loadedRules.set(rule.id, rule);
        }
      } catch (error) {
        console.error(`[MDC] Failed to load rule from ${filePath}:`, error);
      }
    }

    console.log(`[MDC] Loaded ${rules.length} rules from ${mdcFiles.length} files`);
    return rules;
  }

  /**
   * Load and parse a single .mdc rule file
   */
  private loadRule(filePath: string): MDCRule | null {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const parsed = matter(content);
      
      const ruleId = this.extractRuleId(filePath);
      
      return {
        id: ruleId,
        description: parsed.data.description || '',
        globs: parsed.data.globs || ['**'],
        alwaysApply: parsed.data.alwaysApply || false,
        ruleType: parsed.data.ruleType || 'Conditional',
        content: parsed.content,
        frontmatter: parsed.data,
        filePath,
        enforcement: this.parseEnforcement(parsed.content),
        emotionalSovereignty: this.parseEmotionalChecks(parsed.content),
        testRequirements: this.parseTestRequirements(parsed.content)
      };
    } catch (error) {
      console.error(`[MDC] Error parsing ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Extract rule ID from file path
   */
  private extractRuleId(filePath: string): string {
    const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || '';
    return fileName.replace('.mdc', '');
  }

  /**
   * Parse enforcement rules from content
   */
  private parseEnforcement(content: string): MDCEnforcement[] {
    const enforcement: MDCEnforcement[] = [];
    
    // Look for enforcement patterns
    const blockPattern = /❌\s*\*\*BLOCKED\*\*:\s*(.+)/g;
    const requirePattern = /\*\*MANDATORY\*\*:\s*(.+)/g;
    const warnPattern = /⚠️\s*\*\*WARNING\*\*:\s*(.+)/g;
    
    let match;
    
    // Parse BLOCKED rules
    while ((match = blockPattern.exec(content)) !== null) {
      enforcement.push({
        type: 'block',
        condition: match[1].trim(),
        action: 'block_execution',
        severity: 'critical'
      });
    }
    
    // Parse MANDATORY rules
    while ((match = requirePattern.exec(content)) !== null) {
      enforcement.push({
        type: 'require',
        condition: match[1].trim(),
        action: 'require_compliance',
        severity: 'high'
      });
    }
    
    // Parse WARNING rules
    while ((match = warnPattern.exec(content)) !== null) {
      enforcement.push({
        type: 'warn',
        condition: match[1].trim(),
        action: 'emit_warning',
        severity: 'medium'
      });
    }
    
    return enforcement;
  }

  /**
   * Parse emotional sovereignty checks from content
   */
  private parseEmotionalChecks(content: string): MDCEmotionalCheck[] {
    const checks: MDCEmotionalCheck[] = [];
    
    // Look for Sacred Reversal Test
    if (content.includes('Sacred Reversal Test')) {
      checks.push({
        type: 'sacred-reversal-test',
        description: 'Must pass Sacred Reversal Test for emotional sovereignty'
      });
    }
    
    // Look for trust score requirements
    const trustScorePattern = /trust.*score.*(\d+\.?\d*)/gi;
    const trustMatch = trustScorePattern.exec(content);
    if (trustMatch) {
      checks.push({
        type: 'trust-score',
        threshold: parseFloat(trustMatch[1]),
        description: `Must maintain trust score ≥${trustMatch[1]}`
      });
    }
    
    // Look for empowerment validation
    if (content.includes('empowerment') || content.includes('Empowerment')) {
      checks.push({
        type: 'empowerment-validation',
        description: 'Must validate user empowerment and capability enhancement'
      });
    }
    
    return checks;
  }

  /**
   * Parse test requirements from content
   */
  private parseTestRequirements(content: string): MDCTestRequirement[] {
    const requirements: MDCTestRequirement[] = [];
    
    // Look for test requirements
    if (content.includes('test') || content.includes('Test')) {
      if (content.includes('Unit Test') || content.includes('unit test')) {
        requirements.push({ type: 'unit', required: true });
      }
      if (content.includes('Integration Test') || content.includes('integration test')) {
        requirements.push({ type: 'integration', required: true });
      }
      if (content.includes('E2E Test') || content.includes('e2e test')) {
        requirements.push({ type: 'e2e', required: true });
      }
      if (content.includes('Emotional') && content.includes('test')) {
        requirements.push({ type: 'emotional', required: true });
      }
      if (content.includes('Trust') && content.includes('test')) {
        requirements.push({ type: 'trust', required: true, threshold: 4.2 });
      }
    }
    
    return requirements;
  }

  /**
   * Get rules that apply to a specific file path
   */
  getRulesForPath(filePath: string): MDCRule[] {
    const applicableRules: MDCRule[] = [];
    
    for (const rule of this.loadedRules.values()) {
      if (rule.alwaysApply || this.pathMatchesGlobs(filePath, rule.globs)) {
        applicableRules.push(rule);
      }
    }
    
    return applicableRules;
  }

  /**
   * Check if a file path matches any of the glob patterns
   */
  private pathMatchesGlobs(filePath: string, globs: string[]): boolean {
    // Simple glob matching - could be enhanced with a proper glob library
    for (const glob of globs) {
      if (glob === '**' || glob === '*') {
        return true;
      }
      if (filePath.includes(glob.replace('*', ''))) {
        return true;
      }
    }
    return false;
  }

  /**
   * Validate a file against applicable rules
   */
  validateFile(filePath: string, content?: string): MDCValidationResult {
    const rules = this.getRulesForPath(filePath);
    const violations: MDCViolation[] = [];
    const warnings: MDCWarning[] = [];
    
    for (const rule of rules) {
      // Check enforcement rules
      for (const enforcement of rule.enforcement) {
        if (this.checkEnforcementViolation(enforcement, filePath, content)) {
          if (enforcement.type === 'block') {
            violations.push({
              ruleId: rule.id,
              type: 'enforcement',
              severity: enforcement.severity,
              message: `Blocked: ${enforcement.condition}`,
              filePath
            });
          } else if (enforcement.type === 'warn') {
            warnings.push({
              ruleId: rule.id,
              type: 'enforcement',
              severity: enforcement.severity,
              message: `Warning: ${enforcement.condition}`,
              filePath
            });
          }
        }
      }
      
      // Check emotional sovereignty
      for (const check of rule.emotionalSovereignty) {
        if (!this.checkEmotionalCompliance(check, filePath, content)) {
          violations.push({
            ruleId: rule.id,
            type: 'emotional',
            severity: 'high',
            message: `Emotional sovereignty violation: ${check.description}`,
            filePath
          });
        }
      }
    }
    
    return {
      filePath,
      isValid: violations.length === 0,
      violations,
      warnings,
      rulesApplied: rules.length
    };
  }

  /**
   * Check if an enforcement rule is violated
   */
  private checkEnforcementViolation(enforcement: MDCEnforcement, filePath: string, content?: string): boolean {
    // This would contain the actual enforcement logic
    // For now, return false (no violations) as a placeholder
    return false;
  }

  /**
   * Check emotional sovereignty compliance
   */
  private checkEmotionalCompliance(check: MDCEmotionalCheck, filePath: string, content?: string): boolean {
    // This would contain the actual emotional sovereignty validation logic
    // For now, return true (compliant) as a placeholder
    return true;
  }
}

export interface MDCValidationResult {
  filePath: string;
  isValid: boolean;
  violations: MDCViolation[];
  warnings: MDCWarning[];
  rulesApplied: number;
}

export interface MDCViolation {
  ruleId: string;
  type: 'enforcement' | 'emotional' | 'test';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  filePath: string;
}

export interface MDCWarning {
  ruleId: string;
  type: 'enforcement' | 'emotional' | 'test';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  filePath: string;
}

// Export singleton instance
export const mdcProcessor = new MDCProcessor(); 