# Meta-Control Layer Metrics Contract

## Purpose
This document defines the metrics contract for the meta-control layer, specifying all metrics that must be tracked, their types, and their usage. This ensures consistent monitoring and observability across the system.

## Core Metrics

### 1. Trust Metrics

#### `trust.score`
```typescript
interface TrustScoreMetric {
  value: number;          // Range: 0-1
  timestamp: number;
  source: string;
  context: {
    operation: string;
    agentId?: string;
  };
  metadata: {
    confidence: number;   // Range: 0-1
    volatility: number;   // Range: 0-1
    trend: 'up' | 'down' | 'stable';
  };
}
```

#### `trust.impact`
```typescript
interface TrustImpactMetric {
  before: number;         // Range: 0-1
  after: number;          // Range: 0-1
  delta: number;          // Range: -1 to 1
  timestamp: number;
  source: string;
  context: {
    operation: string;
    agentId?: string;
  };
  metadata: {
    confidence: number;   // Range: 0-1
    duration: number;     // milliseconds
  };
}
```

### 2. Resource Metrics

#### `resource.utilization`
```typescript
interface ResourceUtilizationMetric {
  cpu: number;            // Range: 0-1
  memory: number;         // Range: 0-1
  activeAgents: number;   // Count
  timestamp: number;
  context: {
    operation: string;
    agentId?: string;
  };
  metadata: {
    peak: {
      cpu: number;
      memory: number;
    };
    average: {
      cpu: number;
      memory: number;
    };
  };
}
```

#### `resource.impact`
```typescript
interface ResourceImpactMetric {
  before: {
    cpu: number;          // Range: 0-1
    memory: number;       // Range: 0-1
  };
  after: {
    cpu: number;          // Range: 0-1
    memory: number;       // Range: 0-1
  };
  timestamp: number;
  source: string;
  context: {
    operation: string;
    agentId?: string;
  };
  metadata: {
    duration: number;     // milliseconds
    efficiency: number;   // Range: 0-1
  };
}
```

### 3. Alignment Metrics

#### `alignment.score`
```typescript
interface AlignmentScoreMetric {
  value: number;          // Range: 0-1
  timestamp: number;
  source: string;
  context: {
    operation: string;
    agentId?: string;
  };
  metadata: {
    prompt: number;       // Range: 0-1
    response: number;     // Range: 0-1
    behavior: number;     // Range: 0-1
  };
}
```

#### `alignment.deviation`
```typescript
interface AlignmentDeviationMetric {
  type: 'prompt' | 'response' | 'behavior';
  severity: 'low' | 'medium' | 'high';
  value: number;          // Range: 0-1
  timestamp: number;
  source: string;
  context: {
    operation: string;
    agentId?: string;
  };
  metadata: {
    expected: string;
    actual: string;
    impact: number;       // Range: 0-1
  };
}
```

### 4. Evolution Metrics

#### `evolution.progress`
```typescript
interface EvolutionProgressMetric {
  stage: string;
  progress: number;       // Range: 0-1
  timestamp: number;
  context: {
    operation: string;
    agentId?: string;
  };
  metadata: {
    steps: Array<{
      name: string;
      status: 'pending' | 'in-progress' | 'completed' | 'failed';
      impact: number;     // Range: 0-1
    }>;
  };
}
```

#### `evolution.impact`
```typescript
interface EvolutionImpactMetric {
  before: {
    trust: number;        // Range: 0-1
    resources: number;    // Range: 0-1
    alignment: number;    // Range: 0-1
  };
  after: {
    trust: number;        // Range: 0-1
    resources: number;    // Range: 0-1
    alignment: number;    // Range: 0-1
  };
  timestamp: number;
  source: string;
  context: {
    operation: string;
    agentId?: string;
  };
  metadata: {
    duration: number;     // milliseconds
    success: boolean;
  };
}
```

## Metric Collection

### 1. Collection Points
```typescript
interface MetricCollector {
  collect(metric: string, value: number, context: Record<string, any>): void;
  batch(metrics: Array<{
    name: string;
    value: number;
    context: Record<string, any>;
  }>): void;
  flush(): Promise<void>;
}
```

### 2. Aggregation
```typescript
interface MetricAggregator {
  aggregate(metric: string, window: string): Promise<{
    min: number;
    max: number;
    avg: number;
    p95: number;
    p99: number;
  }>;
  trend(metric: string, window: string): Promise<{
    direction: 'up' | 'down' | 'stable';
    rate: number;
    confidence: number;
  }>;
}
```

### 3. Storage
```typescript
interface MetricStorage {
  store(metric: string, data: Record<string, any>): Promise<void>;
  query(criteria: Record<string, any>): Promise<Array<Record<string, any>>>;
  aggregate(criteria: Record<string, any>): Promise<Record<string, any>>;
}
```

## Metric Usage

### 1. Monitoring
```typescript
interface MetricMonitor {
  check(metric: string, threshold: number): Promise<boolean>;
  alert(criteria: Record<string, any>): void;
  report(): Promise<Record<string, any>>;
}
```

### 2. Analysis
```typescript
interface MetricAnalyzer {
  analyze(metric: string, window: string): Promise<{
    trend: string;
    anomalies: Array<{
      timestamp: number;
      value: number;
      severity: string;
    }>;
    recommendations: Array<string>;
  }>;
}
```

### 3. Visualization
```typescript
interface MetricVisualizer {
  plot(metric: string, options: Record<string, any>): Promise<string>;
  dashboard(metrics: Array<string>): Promise<string>;
  export(format: string): Promise<Buffer>;
}
```

## Best Practices

### 1. Metric Collection
- Collect metrics at appropriate intervals
- Include relevant context with each metric
- Validate metric values before collection
- Handle collection errors gracefully
- Batch metrics when possible

### 2. Metric Storage
- Store metrics efficiently
- Implement retention policies
- Enable quick querying
- Support aggregation
- Maintain data integrity

### 3. Metric Analysis
- Analyze trends over time
- Detect anomalies
- Generate insights
- Make recommendations
- Track impact

### 4. Metric Usage
- Set appropriate thresholds
- Configure meaningful alerts
- Create useful visualizations
- Enable easy access
- Support decision making

## Integration Examples

### 1. Collecting Metrics
```typescript
// Trust score collection
metricCollector.collect('trust.score', 0.85, {
  timestamp: Date.now(),
  source: 'agent-execution',
  context: {
    operation: 'code-generation',
    agentId: 'codex-agent-1'
  },
  metadata: {
    confidence: 0.9,
    volatility: 0.1,
    trend: 'stable'
  }
});

// Resource utilization collection
metricCollector.collect('resource.utilization', {
  cpu: 0.65,
  memory: 0.75,
  activeAgents: 3
}, {
  timestamp: Date.now(),
  context: {
    operation: 'system-health-check'
  },
  metadata: {
    peak: {
      cpu: 0.8,
      memory: 0.85
    },
    average: {
      cpu: 0.6,
      memory: 0.7
    }
  }
});
```

### 2. Analyzing Metrics
```typescript
// Trust score analysis
const trustAnalysis = await metricAnalyzer.analyze('trust.score', '1d');
console.log('Trust Score Analysis:', {
  trend: trustAnalysis.trend,
  anomalies: trustAnalysis.anomalies,
  recommendations: trustAnalysis.recommendations
});

// Resource utilization analysis
const resourceAnalysis = await metricAnalyzer.analyze('resource.utilization', '1h');
console.log('Resource Utilization Analysis:', {
  trend: resourceAnalysis.trend,
  anomalies: resourceAnalysis.anomalies,
  recommendations: resourceAnalysis.recommendations
});
```

### 3. Visualizing Metrics
```typescript
// Trust score visualization
const trustPlot = await metricVisualizer.plot('trust.score', {
  window: '1d',
  type: 'line',
  showTrend: true,
  showThresholds: true
});

// Resource utilization dashboard
const resourceDashboard = await metricVisualizer.dashboard([
  'resource.utilization.cpu',
  'resource.utilization.memory',
  'resource.utilization.activeAgents'
]);
```

## Thresholds and Alerts

### 1. Trust Thresholds
```typescript
const trustThresholds = {
  critical: 0.6,
  warning: 0.7,
  target: 0.8,
  volatility: 0.2,
  trend: 0.1
};
```

### 2. Resource Thresholds
```typescript
const resourceThresholds = {
  cpu: {
    critical: 0.9,
    warning: 0.8,
    target: 0.7
  },
  memory: {
    critical: 0.9,
    warning: 0.8,
    target: 0.7
  },
  agents: {
    critical: 5,
    warning: 4,
    target: 3
  }
};
```

### 3. Alignment Thresholds
```typescript
const alignmentThresholds = {
  score: {
    critical: 0.6,
    warning: 0.7,
    target: 0.8
  },
  deviation: {
    prompt: 0.2,
    response: 0.2,
    behavior: 0.2
  }
};
```

### 4. Evolution Thresholds
```typescript
const evolutionThresholds = {
  progress: {
    critical: 0.3,
    warning: 0.5,
    target: 0.7
  },
  impact: {
    trust: 0.1,
    resources: 0.2,
    alignment: 0.1
  }
};
``` 