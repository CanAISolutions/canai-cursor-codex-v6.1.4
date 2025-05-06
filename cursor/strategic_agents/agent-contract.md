# Strategic Agents Contract

## Overview
This document defines the contract for strategic agents in the CanAI system. Strategic agents are autonomous components that plan, coordinate, and optimize behavior across the system.

## Agent Types

### 1. TrustRestorerAgent
**Purpose**: Engages when system-wide trust drops below acceptable thresholds.

**Activation Conditions**:
- System trust score < 0.6
- Trust volatility > 0.2
- Recovery attempts > 3

**Strategy Actions**:
- `trust:restore`: Initiates trust restoration procedures
- Parameters:
  - `targetAgents`: List of agents to restore trust for
  - `restorationMethod`: Type of restoration to apply
  - `priority`: Restoration priority level

**Metrics**:
- Trust impact score
- Resource utilization
- Execution time

### 2. RecoveryOptimizerAgent
**Purpose**: Adjusts recovery loops and fatigue thresholds based on system performance.

**Activation Conditions**:
- Recovery attempts > 3
- Pattern substitutions > 2
- Trust volatility > 0.15

**Strategy Actions**:
- `recovery:optimize`: Adjusts recovery parameters
- Parameters:
  - `thresholdAdjustment`: New threshold values
  - `cooldownPeriod`: Updated cooldown duration
  - `maxAttempts`: New maximum attempt limit

**Metrics**:
- Recovery success rate
- Trust impact
- Resource efficiency

### 3. EvolutionPathfinderAgent
**Purpose**: Selects alternate strategies when stagnation is detected.

**Activation Conditions**:
- Stagnation flags > 1
- Evolution triggers < 2
- Trust score < 0.7

**Strategy Actions**:
- `evolution:propose`: Proposes new evolution paths
- Parameters:
  - `pathType`: Type of evolution path
  - `targetMetrics`: Desired metric improvements
  - `timeframe`: Expected completion time

**Metrics**:
- Evolution success rate
- Trust improvement
- Resource impact

## Common Interfaces

### StrategyContext
```typescript
interface StrategyContext {
  systemMetrics: {
    trustScore: number;
    trustVolatility: number;
    recoveryAttempts: number;
    evolutionTriggers: number;
    stagnationFlags: number;
  };
  agentMetrics: Record<string, {
    trustScore: number;
    recoveryAttempts: number;
    patternSubstitutions: number;
  }>;
  resourceMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    activeAgents: number;
  };
}
```

### StrategyResult
```typescript
interface StrategyResult {
  success: boolean;
  actions: Array<{
    type: string;
    target: string;
    parameters: Record<string, any>;
  }>;
  metrics: {
    trustImpact: number;
    resourceImpact: number;
    executionTime: number;
  };
}
```

## Event Types

### Trust Events
- `trust:signal`: Trust score update
- `trust:warning`: Trust threshold warning
- `trust:violation`: Trust violation detected

### Recovery Events
- `recovery:attempted`: Recovery attempt initiated
- `recovery:succeeded`: Recovery attempt succeeded
- `recovery:failed`: Recovery attempt failed

### Evolution Events
- `evolution:triggered`: Evolution process started
- `evolution:completed`: Evolution process completed

### Strategy Events
- `strategy:context-updated`: System context updated
- `strategy:action:*`: Strategy action executed
- `strategy:completed`: Strategy execution completed
- `strategy:failed`: Strategy execution failed
- `strategy:error`: Strategy execution error

## Resource Constraints

### CPU Usage
- Warning threshold: 70%
- Critical threshold: 85%
- Maximum per agent: 30%

### Memory Usage
- Warning threshold: 75%
- Critical threshold: 90%
- Maximum per agent: 40%

### Concurrent Executions
- TrustRestorerAgent: 1
- RecoveryOptimizerAgent: 2
- EvolutionPathfinderAgent: 1

## Cooldown Periods

### TrustRestorerAgent
- Base cooldown: 5 minutes
- After failure: 15 minutes
- After success: 10 minutes

### RecoveryOptimizerAgent
- Base cooldown: 10 minutes
- After failure: 20 minutes
- After success: 15 minutes

### EvolutionPathfinderAgent
- Base cooldown: 15 minutes
- After failure: 30 minutes
- After success: 20 minutes

## Error Handling

### Retry Policy
- Maximum retries: 3
- Retry delay: 5 minutes
- Backoff factor: 2

### Error Types
- Resource exhaustion
- Trust violation
- Strategy conflict
- Execution timeout

## Monitoring

### Metrics Collection
- Trust scores
- Recovery attempts
- Evolution triggers
- Resource usage
- Execution times

### Alerts
- Trust threshold violations
- Resource exhaustion
- Strategy failures
- Execution timeouts

## Security

### Access Control
- Agent authentication
- Action authorization
- Resource limits
- Event validation

### Data Protection
- Metric encryption
- Action signing
- Event verification
- Result validation 