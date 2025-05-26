/**
 * rules/rules-schema.ts
 * 
 * Purpose:
 * Defines core types and interfaces for Codex rule enforcement system.
 * Acts as the contract layer for behavior validation across prompts, agents, and memory.
 * Includes Test-First Truth validation types and enforcement mechanisms.
 */

import { EventBus } from '../utils/event-bus';

// Core rule types
export type RuleType = 
  | 'tone' 
  | 'length' 
  | 'memory' 
  | 'evolution' 
  | 'trust' 
  | 'structure'
  | 'test-first-truth';

export type SeverityLevel = 
  | 'critical' 
  | 'high' 
  | 'medium' 
  | 'low' 
  | 'warning';

export type RecoveryAction = 
  | 'block' 
  | 'warn' 
  | 'retry' 
  | 'fallback' 
  | 'circuit-break';

export type CircuitBreakerState = 
  | 'closed' 
  | 'open' 
  | 'half-open';

// Rule definition interface
export interface Rule {
  id: string;
  type: RuleType;
  name: string;
  description: string;
  severity: SeverityLevel;
  recoveryAction: RecoveryAction;
  validation: {
    method: 'regex' | 'schema' | 'function' | 'threshold';
    pattern?: string;
    schema?: object;
    function?: string;
    threshold?: number;
  };
  metadata: {
    createdAt: number;
    updatedAt: number;
    version: string;
    tags: string[];
    dependencies: string[];
  };
  testFirstTruth?: 'mandatory' | 'optional' | 'disabled';
}

// Violation interface
export interface Violation {
  id: string;
  ruleId: string;
  timestamp: number;
  severity: SeverityLevel;
  recoveryAction: RecoveryAction;
  context: {
    target: string;
    targetType: 'prompt' | 'agent' | 'memory' | 'evolution' | 'test-validation' | 'feature' | 'api' | 'component' | 'integration' | 'deployment';
    value: unknown;
    expected: unknown;
  };
  metadata: {
    stackTrace?: string;
    trustScore?: number;
    memoryContext?: object;
    testFirstTruthViolation?: boolean;
    blockingIssues?: string[];
  };
}

// Circuit breaker interface
export interface CircuitBreaker {
  id: string;
  state: CircuitBreakerState;
  threshold: number;
  decayRate: number;
  lastViolation: number;
  violationCount: number;
  metadata: {
    createdAt: number;
    updatedAt: number;
    reason?: string;
    trustScore: number;
  };
}

// Rule engine interface
export interface RuleEngine {
  evaluateRule(rule: Rule, target: unknown): Promise<boolean>;
  evaluateRules(rules: Rule[], target: unknown): Promise<Violation[]>;
  getViolations(): Violation[];
  clearViolations(): void;
}

// Circuit breaker interface
export interface CircuitBreakerManager {
  check(target: string): Promise<boolean>;
  recordViolation(violation: Violation): void;
  reset(target: string): void;
  getState(target: string): CircuitBreakerState;
}

// Event types
export type RuleEventType = 
  | 'rule:violation' 
  | 'rule:passed' 
  | 'rule:test-first-truth-violation'
  | 'circuit:opened' 
  | 'circuit:closed' 
  | 'circuit:half-open';

export interface RuleEvent {
  type: RuleEventType;
  data: {
    ruleId?: string;
    violation?: Violation;
    circuitId?: string;
    state?: CircuitBreakerState;
    timestamp: number;
    blockingIssues?: string[];
  };
}

// Service interfaces
export interface RuleService {
  loadRules(): Promise<Rule[]>;
  validateRule(rule: Rule): Promise<boolean>;
  getRule(ruleId: string): Promise<Rule | null>;
  updateRule(rule: Rule): Promise<void>;
  deleteRule(ruleId: string): Promise<void>;
}

export interface CircuitBreakerService {
  createBreaker(target: string, threshold: number): Promise<CircuitBreaker>;
  getBreaker(target: string): Promise<CircuitBreaker | null>;
  updateBreaker(breaker: CircuitBreaker): Promise<void>;
  deleteBreaker(target: string): Promise<void>;
} 