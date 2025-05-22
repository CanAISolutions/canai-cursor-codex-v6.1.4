/**
 * rules/rule-engine.ts
 * 
 * Purpose:
 * Evaluates loaded prompts, agent decisions, or memory payloads against Codex rules.
 * Emits violations and integrates with MetaEventRouter for rule enforcement.
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

export class CodexRuleEngine implements RuleEngine {
  private violations: Violation[] = [];
  private validationCache: Map<string, boolean> = new Map();

  constructor(
    private eventBus: EventBus,
    private trustThreshold: number = 0.8
  ) {}

  /**
   * Evaluates a single rule against a target
   */
  async evaluateRule(rule: Rule, target: unknown): Promise<boolean> {
    try {
      const cacheKey = `${rule.id}:${JSON.stringify(target)}`;
      
      if (this.validationCache.has(cacheKey)) {
        return this.validationCache.get(cacheKey)!;
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