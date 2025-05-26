/**
 * rules/rule-engine.ts
 * 
 * Purpose:
 * Evaluates loaded prompts, agent decisions, or memory payloads against Codex rules.
 * Emits violations and integrates with MetaEventRouter for rule enforcement.
 * Enforces Test-First Truth principle across all system operations.
 */

import { EventBus } from '../event-bus/eventBus';
import { 
  Rule, 
  Violation, 
  RuleEngine, 
  RuleEvent, 
  RuleEventType,
  SeverityLevel,
  RecoveryAction
} from './rules-schema';
import { v4 as uuidv4 } from 'uuid';

// Test-First Truth interfaces
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

interface TestFirstTruthValidation {
  hasTestEvidence: boolean;
  testEvidence?: TestEvidence;
  validationStatus: 'VALIDATED' | 'PENDING' | 'FAILED';
  blockingIssues: string[];
}

export class CodexRuleEngine implements RuleEngine {
  private violations: Violation[] = [];
  private validationCache: Map<string, boolean> = new Map();
  private testFirstTruthEnabled: boolean = true;

  constructor(
    private eventBus: EventBus,
    private trustThreshold: number = 0.8
  ) {}

  /**
   * Evaluates a single rule against a target with Test-First Truth validation
   */
  async evaluateRule(rule: Rule, target: unknown): Promise<boolean> {
    try {
      const cacheKey = `${rule.id}:${JSON.stringify(target)}`;
      
      if (this.validationCache.has(cacheKey)) {
        return this.validationCache.get(cacheKey)!;
      }

      // Test-First Truth validation
      if (this.testFirstTruthEnabled && this.requiresTestValidation(rule, target)) {
        const testValidation = await this.validateTestFirstTruth(target);
        if (!testValidation.hasTestEvidence) {
          await this.handleTestFirstTruthViolation(rule, target, testValidation);
          return false;
        }
      }

      const isValid = await this.validateTarget(rule, target);
      this.validationCache.set(cacheKey, isValid);

      if (!isValid) {
        await this.handleViolation(rule, target);
      } else {
        this.emitEvent('rule:passed', { ruleId: rule.id });
      }

      return isValid;
    } catch (error) {
      console.error(`Error evaluating rule ${rule.id}:`, error);
      return false;
    }
  }

  /**
   * Validates Test-First Truth requirements
   */
  private async validateTestFirstTruth(target: unknown): Promise<TestFirstTruthValidation> {
    const validation: TestFirstTruthValidation = {
      hasTestEvidence: false,
      validationStatus: 'PENDING',
      blockingIssues: []
    };

    try {
      // Check if target includes test evidence
      if (typeof target === 'object' && target !== null) {
        const targetObj = target as any;
        
        // Look for test evidence in the target
        if (targetObj.testEvidence) {
          validation.testEvidence = targetObj.testEvidence;
          validation.hasTestEvidence = true;
          
          // Validate test evidence quality
          const testEvidence = targetObj.testEvidence as TestEvidence;
          
          if (testEvidence.testResults.failed > 0) {
            validation.blockingIssues.push(`${testEvidence.testResults.failed} tests failing`);
            validation.validationStatus = 'FAILED';
          } else if (testEvidence.testResults.total === 0) {
            validation.blockingIssues.push('No tests found');
            validation.validationStatus = 'FAILED';
          } else {
            validation.validationStatus = 'VALIDATED';
          }
        } else {
          validation.blockingIssues.push('No test evidence provided');
        }
      } else {
        validation.blockingIssues.push('Target does not contain test evidence');
      }
    } catch (error) {
      validation.blockingIssues.push(`Test validation error: ${error}`);
      validation.validationStatus = 'FAILED';
    }

    return validation;
  }

  /**
   * Determines if a rule/target combination requires test validation
   */
  private requiresTestValidation(rule: Rule, target: unknown): boolean {
    // Check if rule has testFirstTruth flag
    const ruleObj = rule as any;
    if (ruleObj.testFirstTruth === 'mandatory') {
      return true;
    }

    // Check target type for test requirements
    if (typeof target === 'object' && target !== null) {
      const targetObj = target as any;
      
      // Features, APIs, components, integrations require tests
      if (targetObj.type && [
        'feature', 'api', 'component', 'integration', 
        'deployment', 'endpoint', 'service'
      ].includes(targetObj.type)) {
        return true;
      }

      // Code changes require tests
      if (targetObj.files && Array.isArray(targetObj.files)) {
        const codeFiles = targetObj.files.filter((file: string) => 
          file.endsWith('.ts') || file.endsWith('.js') || 
          file.endsWith('.tsx') || file.endsWith('.jsx')
        );
        if (codeFiles.length > 0) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Handles Test-First Truth violations
   */
  private async handleTestFirstTruthViolation(
    rule: Rule, 
    target: unknown, 
    validation: TestFirstTruthValidation
  ): Promise<void> {
    const violation: Violation = {
      id: uuidv4(),
      ruleId: 'test-first-truth',
      timestamp: Date.now(),
      severity: 'critical' as SeverityLevel,
      recoveryAction: 'block' as RecoveryAction,
      context: {
        target: typeof target === 'string' ? target : JSON.stringify(target),
        targetType: 'test-validation',
        value: target,
        expected: 'Test evidence with passing tests'
      },
      metadata: {
        stackTrace: new Error().stack,
        trustScore: this.trustThreshold,
        testFirstTruthViolation: true,
        blockingIssues: validation.blockingIssues
      }
    };

    this.violations.push(violation);

    this.emitEvent('rule:test-first-truth-violation', {
      ruleId: 'test-first-truth',
      violation,
      blockingIssues: validation.blockingIssues
    });

    // Block execution for Test-First Truth violations
    throw new Error(`Test-First Truth Violation: ${validation.blockingIssues.join(', ')}`);
  }

  /**
   * Evaluates multiple rules against a target
   */
  async evaluateRules(rules: Rule[], target: unknown): Promise<Violation[]> {
    const violations: Violation[] = [];

    for (const rule of rules) {
      const isValid = await this.evaluateRule(rule, target);
      if (!isValid) {
        const violation = this.createViolation(rule, target);
        violations.push(violation);
      }
    }

    return violations;
  }

  /**
   * Returns all recorded violations
   */
  getViolations(): Violation[] {
    return [...this.violations];
  }

  /**
   * Clears all recorded violations
   */
  clearViolations(): void {
    this.violations = [];
    this.validationCache.clear();
  }

  /**
   * Enables or disables Test-First Truth enforcement
   */
  setTestFirstTruthEnabled(enabled: boolean): void {
    this.testFirstTruthEnabled = enabled;
  }

  /**
   * Gets Test-First Truth enforcement status
   */
  isTestFirstTruthEnabled(): boolean {
    return this.testFirstTruthEnabled;
  }

  /**
   * Validates a target against a rule's validation method
   */
  private async validateTarget(rule: Rule, target: unknown): Promise<boolean> {
    const { method, pattern, schema, function: func, threshold } = rule.validation;

    switch (method) {
      case 'regex':
        return this.validateRegex(target, pattern!);
      case 'schema':
        return this.validateSchema(target, schema!);
      case 'function':
        return this.validateFunction(target, func!);
      case 'threshold':
        return this.validateThreshold(target, threshold!);
      default:
        return false;
    }
  }

  /**
   * Creates a violation record
   */
  private createViolation(rule: Rule, target: unknown): Violation {
    const violation: Violation = {
      id: uuidv4(),
      ruleId: rule.id,
      timestamp: Date.now(),
      severity: rule.severity,
      recoveryAction: rule.recoveryAction,
      context: {
        target: typeof target === 'string' ? target : JSON.stringify(target),
        targetType: this.determineTargetType(target),
        value: target,
        expected: this.getExpectedValue(rule)
      },
      metadata: {
        stackTrace: new Error().stack,
        trustScore: this.trustThreshold
      }
    };

    this.violations.push(violation);
    return violation;
  }

  /**
   * Handles a rule violation
   */
  private async handleViolation(rule: Rule, target: unknown): Promise<void> {
    const violation = this.createViolation(rule, target);
    
    this.emitEvent('rule:violation', {
      ruleId: rule.id,
      violation
    });

    await this.executeRecoveryAction(rule.recoveryAction, violation);
  }

  /**
   * Executes the recovery action for a violation
   */
  private async executeRecoveryAction(action: RecoveryAction, violation: Violation): Promise<void> {
    switch (action) {
      case 'block':
        throw new Error(`Rule violation blocked execution: ${violation.ruleId}`);
      case 'warn':
        console.warn(`Rule violation warning: ${violation.ruleId}`);
        break;
      case 'retry':
        // Implement retry logic
        break;
      case 'fallback':
        // Implement fallback logic
        break;
      case 'circuit-break':
        this.emitEvent('circuit:opened', {
          circuitId: violation.ruleId,
          state: 'open'
        });
        break;
    }
  }

  /**
   * Emits a rule event
   */
  private emitEvent(type: RuleEventType, data: Partial<RuleEvent['data']>): void {
    this.eventBus.emit(`rule.${type}`, {
      type,
      data: {
        ...data,
        timestamp: Date.now()
      }
    });
  }

  /**
   * Validates using regex pattern
   */
  private validateRegex(target: unknown, pattern: string): boolean {
    if (typeof target !== 'string') return false;
    return new RegExp(pattern).test(target);
  }

  /**
   * Validates using JSON schema
   */
  private validateSchema(target: unknown, schema: object): boolean {
    // Implement schema validation
    return true;
  }

  /**
   * Validates using custom function
   */
  private validateFunction(target: unknown, func: string): boolean {
    try {
      const validationFn = new Function('target', func);
      return validationFn(target);
    } catch {
      return false;
    }
  }

  /**
   * Validates against a threshold
   */
  private validateThreshold(target: unknown, threshold: number): boolean {
    if (typeof target !== 'number') return false;
    return target >= threshold;
  }

  /**
   * Determines the type of target being validated
   */
  private determineTargetType(target: unknown): Violation['context']['targetType'] {
    // Implement target type detection
    return 'prompt';
  }

  /**
   * Gets the expected value for a rule
   */
  private getExpectedValue(rule: Rule): unknown {
    const { method, pattern, schema, threshold } = rule.validation;
    
    switch (method) {
      case 'regex':
        return pattern;
      case 'schema':
        return schema;
      case 'threshold':
        return threshold;
      default:
        return undefined;
    }
  }
} 