/**
 * rules/__tests__/rule-engine.test.ts
 * 
 * Purpose:
 * Tests rule engine functionality including rule evaluation and violation handling.
 */

import { EventBus } from '../../utils/event-bus';
import { CodexRuleEngine } from '../rule-engine';
import { Rule, Violation, SeverityLevel, RecoveryAction } from '../rules-schema';

describe('CodexRuleEngine', () => {
  let eventBus: EventBus;
  let engine: CodexRuleEngine;
  let mockRule: Rule;

  beforeEach(() => {
    eventBus = new EventBus();
    engine = new CodexRuleEngine(eventBus);

    // Create mock rule
    mockRule = {
      id: 'test-rule',
      type: 'tone',
      name: 'Test Rule',
      description: 'A test rule for validation',
      severity: 'high' as SeverityLevel,
      recoveryAction: 'warn' as RecoveryAction,
      validation: {
        method: 'regex',
        pattern: 'test'
      },
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: '1.0.0',
        tags: ['test'],
        dependencies: []
      }
    };
  });

  describe('evaluateRule', () => {
    it('should evaluate a rule against a target', async () => {
      const target = 'test content';
      const isValid = await engine.evaluateRule(mockRule, target);
      expect(isValid).toBe(true);
    });

    it('should handle regex validation', async () => {
      const rule: Rule = {
        ...mockRule,
        validation: {
          method: 'regex',
          pattern: 'test'
        }
      };

      const validTarget = 'test content';
      const invalidTarget = 'invalid content';

      expect(await engine.evaluateRule(rule, validTarget)).toBe(true);
      expect(await engine.evaluateRule(rule, invalidTarget)).toBe(false);
    });

    it('should handle threshold validation', async () => {
      const rule: Rule = {
        ...mockRule,
        validation: {
          method: 'threshold',
          threshold: 0.8
        }
      };

      const validTarget = 0.9;
      const invalidTarget = 0.7;

      expect(await engine.evaluateRule(rule, validTarget)).toBe(true);
      expect(await engine.evaluateRule(rule, invalidTarget)).toBe(false);
    });

    it('should emit passed event on successful validation', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const target = 'test content';

      await engine.evaluateRule(mockRule, target);

      expect(eventSpy).toHaveBeenCalledWith(
        'rule.rule:passed',
        expect.objectContaining({
          type: 'rule:passed',
          data: expect.objectContaining({
            ruleId: mockRule.id
          })
        })
      );
    });

    it('should emit violation event on failed validation', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const target = 'invalid content';

      await engine.evaluateRule(mockRule, target);

      expect(eventSpy).toHaveBeenCalledWith(
        'rule.rule:violation',
        expect.objectContaining({
          type: 'rule:violation',
          data: expect.objectContaining({
            ruleId: mockRule.id,
            violation: expect.any(Object)
          })
        })
      );
    });
  });

  describe('evaluateRules', () => {
    it('should evaluate multiple rules against a target', async () => {
      const rules: Rule[] = [
        {
          ...mockRule,
          id: 'rule1',
          validation: { method: 'regex', pattern: 'test' }
        },
        {
          ...mockRule,
          id: 'rule2',
          validation: { method: 'regex', pattern: 'content' }
        }
      ];

      const target = 'test content';
      const violations = await engine.evaluateRules(rules, target);

      expect(violations).toHaveLength(0);
    });

    it('should return violations for failed rules', async () => {
      const rules: Rule[] = [
        {
          ...mockRule,
          id: 'rule1',
          validation: { method: 'regex', pattern: 'test' }
        },
        {
          ...mockRule,
          id: 'rule2',
          validation: { method: 'regex', pattern: 'invalid' }
        }
      ];

      const target = 'test content';
      const violations = await engine.evaluateRules(rules, target);

      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe('rule2');
    });
  });

  describe('getViolations', () => {
    it('should return all recorded violations', async () => {
      const target = 'invalid content';
      await engine.evaluateRule(mockRule, target);

      const violations = engine.getViolations();
      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe(mockRule.id);
    });
  });

  describe('clearViolations', () => {
    it('should clear all recorded violations', async () => {
      const target = 'invalid content';
      await engine.evaluateRule(mockRule, target);

      engine.clearViolations();
      expect(engine.getViolations()).toHaveLength(0);
    });
  });
}); 