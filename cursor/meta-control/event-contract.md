# Meta-Control Layer Event Contract

## Purpose
This document defines the event contract for the meta-control layer, specifying all events that can be emitted and their payload structures. This ensures consistent event handling and system-wide observability.

## Event Categories

### 1. System Health Events

#### `system:health-check`
```typescript
interface SystemHealthEvent {
  timestamp: number;
  metrics: {
    trustScore: number;
    resourceUtilization: number;
    activeAgents: number;
    errorRate: number;
  };
  status: 'healthy' | 'degraded' | 'critical';
  details: {
    checks: Array<{
      name: string;
      passed: boolean;
      value: number;
      threshold: number;
    }>;
  };
}
```

#### `system:recovery-started`
```typescript
interface RecoveryStartedEvent {
  timestamp: number;
  trigger: string;
  context: {
    trustScore: number;
    resourceUtilization: number;
    errorCount: number;
  };
  plan: {
    steps: Array<{
      action: string;
      priority: number;
      expectedOutcome: string;
    }>;
  };
}
```

#### `system:recovery-completed`
```typescript
interface RecoveryCompletedEvent {
  timestamp: number;
  success: boolean;
  duration: number;
  outcomes: Array<{
    step: string;
    success: boolean;
    impact: {
      trust: number;
      resources: number;
    };
  }>;
  finalState: {
    trustScore: number;
    resourceUtilization: number;
  };
}
```

### 2. Trust Management Events

#### `trust:violation`
```typescript
interface TrustViolationEvent {
  timestamp: number;
  source: string;
  violation: {
    type: 'threshold' | 'volatility' | 'trend';
    value: number;
    threshold: number;
  };
  context: {
    operation: string;
    agentId?: string;
    metrics: Record<string, number>;
  };
}
```

#### `trust:restored`
```typescript
interface TrustRestoredEvent {
  timestamp: number;
  previousScore: number;
  currentScore: number;
  delta: number;
  actions: Array<{
    type: string;
    impact: number;
  }>;
}
```

### 3. Resource Management Events

#### `resource:warning`
```typescript
interface ResourceWarningEvent {
  timestamp: number;
  resource: 'cpu' | 'memory' | 'agents';
  current: number;
  threshold: number;
  context: {
    operation: string;
    agentId?: string;
  };
}
```

#### `resource:degradation`
```typescript
interface ResourceDegradationEvent {
  timestamp: number;
  action: string;
  impact: {
    before: Record<string, number>;
    after: Record<string, number>;
  };
  reason: string;
}
```

### 4. Agent Management Events

#### `agent:selected`
```typescript
interface AgentSelectedEvent {
  timestamp: number;
  agentId: string;
  criteria: {
    trustScore: number;
    successRate: number;
    resourceImpact: number;
  };
  context: {
    operation: string;
    priority: number;
  };
}
```

#### `agent:deselected`
```typescript
interface AgentDeselectedEvent {
  timestamp: number;
  agentId: string;
  reason: string;
  metrics: {
    trustScore: number;
    successRate: number;
    resourceImpact: number;
  };
}
```

### 5. Codex Alignment Events

#### `alignment:deviation`
```typescript
interface AlignmentDeviationEvent {
  timestamp: number;
  type: 'prompt' | 'response' | 'behavior';
  severity: 'low' | 'medium' | 'high';
  details: {
    expected: string;
    actual: string;
    context: Record<string, any>;
  };
}
```

#### `alignment:correction`
```typescript
interface AlignmentCorrectionEvent {
  timestamp: number;
  type: 'prompt' | 'response' | 'behavior';
  action: string;
  impact: {
    before: number;
    after: number;
  };
  context: Record<string, any>;
}
```

### 6. Evolution Events

#### `evolution:triggered`
```typescript
interface EvolutionTriggeredEvent {
  timestamp: number;
  trigger: string;
  confidence: number;
  expectedImpact: {
    trust: number;
    resources: number;
    alignment: number;
  };
  context: Record<string, any>;
}
```

#### `evolution:completed`
```typescript
interface EvolutionCompletedEvent {
  timestamp: number;
  success: boolean;
  actualImpact: {
    trust: number;
    resources: number;
    alignment: number;
  };
  changes: Array<{
    component: string;
    type: string;
    details: Record<string, any>;
  }>;
}
```

## Event Handling Guidelines

### 1. Event Emission
- All events must include a timestamp
- All events must include relevant context
- All events must be traceable (include traceId when available)
- All events must be properly typed
- All events must be documented

### 2. Event Consumption
- All event handlers must be idempotent
- All event handlers must handle errors gracefully
- All event handlers must be properly typed
- All event handlers must be documented
- All event handlers must be testable

### 3. Event Validation
- All events must be validated before emission
- All events must be validated before consumption
- All events must be logged for audit purposes
- All events must be monitored for anomalies
- All events must be versioned

### 4. Event Performance
- Events should be batched when appropriate
- Events should be prioritized based on importance
- Events should be filtered based on relevance
- Events should be cached when appropriate
- Events should be optimized for size

## Integration Points

### 1. Event Bus
```typescript
interface EventBus {
  emit(event: string, payload: any): void;
  on(event: string, handler: (payload: any) => void): void;
  off(event: string, handler: (payload: any) => void): void;
}
```

### 2. Event Logger
```typescript
interface EventLogger {
  log(event: string, payload: any): void;
  query(criteria: Record<string, any>): Promise<Array<{
    event: string;
    payload: any;
    timestamp: number;
  }>>;
}
```

### 3. Event Monitor
```typescript
interface EventMonitor {
  track(event: string, metrics: Record<string, number>): void;
  alert(criteria: Record<string, any>): void;
  report(): Promise<Record<string, any>>;
}
```

## Usage Examples

### 1. Emitting Events
```typescript
// System health check
eventBus.emit('system:health-check', {
  timestamp: Date.now(),
  metrics: {
    trustScore: 0.85,
    resourceUtilization: 0.65,
    activeAgents: 3,
    errorRate: 0.02
  },
  status: 'healthy',
  details: {
    checks: [
      {
        name: 'trust-threshold',
        passed: true,
        value: 0.85,
        threshold: 0.8
      }
    ]
  }
});

// Trust violation
eventBus.emit('trust:violation', {
  timestamp: Date.now(),
  source: 'agent-execution',
  violation: {
    type: 'threshold',
    value: 0.75,
    threshold: 0.8
  },
  context: {
    operation: 'code-generation',
    agentId: 'codex-agent-1',
    metrics: {
      successRate: 0.92,
      responseTime: 150
    }
  }
});
```

### 2. Handling Events
```typescript
// System health check handler
eventBus.on('system:health-check', (payload: SystemHealthEvent) => {
  if (payload.status === 'critical') {
    triggerRecovery(payload);
  }
  updateMetrics(payload.metrics);
  logHealthStatus(payload);
});

// Trust violation handler
eventBus.on('trust:violation', (payload: TrustViolationEvent) => {
  if (payload.violation.type === 'threshold') {
    initiateTrustRestoration(payload);
  }
  updateTrustMetrics(payload);
  alertTrustViolation(payload);
});
```

## Best Practices

### 1. Event Design
- Keep events focused and single-purpose
- Include all necessary context
- Use consistent naming conventions
- Version events appropriately
- Document event schemas

### 2. Event Handling
- Handle events asynchronously
- Implement retry mechanisms
- Monitor event processing
- Handle event failures gracefully
- Maintain event order when necessary

### 3. Event Monitoring
- Track event volumes
- Monitor event processing times
- Alert on event anomalies
- Analyze event patterns
- Optimize event flows

### 4. Event Testing
- Test event emission
- Test event handling
- Test event validation
- Test event performance
- Test event recovery 