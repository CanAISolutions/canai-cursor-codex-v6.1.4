/**
 * meta-control/recovery-types.ts
 * 
 * Purpose:
 * Defines types for recovery procedures and context.
 */

export interface RecoveryStep {
  action: string;
  parameters?: Record<string, any>;
  priority: 'high' | 'medium' | 'low';
  timeout?: number;
}

export interface RecoveryPlan {
  trigger: string;
  steps: RecoveryStep[];
  fallback?: RecoveryStep;
  timeout?: number;
}

export interface RecoveryContext {
  type: 'trust' | 'resource' | 'alignment';
  metrics: {
    trustScore: number;
    trustVolatility: number;
    recoveryAttempts: number;
    evolutionTriggers: number;
    stagnationFlags: number;
  };
  resourceMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    activeAgents: number;
  };
  agentMetrics: Record<string, {
    trustScore: number;
    recoveryAttempts: number;
    patternSubstitutions: number;
  }>;
}

export interface RecoveryEvent {
  type: string;
  data: any;
  timestamp: string;
} 