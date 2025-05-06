# System Intel Agent Contract

## Overview

The System Intel module provides comprehensive telemetry and monitoring capabilities for the Codex system. It aggregates data from various sources to provide insights into system health, agent performance, and trust metrics.

## Schema

### SystemIntelMetrics

```typescript
interface SystemIntelMetrics {
  timestamp: string;                    // ISO timestamp of the metrics snapshot
  agents: Record<string, AgentMetrics>; // Map of agent IDs to their metrics
  recentViolations: TrustViolation[];   // Recent trust violations
  trustTimeline: TrustDelta[];         // Historical trust score changes
  systemHealth: SystemHealth;          // Overall system health status
}
```

### AgentMetrics

```typescript
interface AgentMetrics {
  status: AgentStatus;                 // Current agent status
  trustScore: number;                  // Current trust score (0-1)
  lastHeartbeat: string;              // ISO timestamp of last heartbeat
  lastTrigger?: string;               // Last evolution trigger type
  resourceUsage?: ResourceMetrics;    // Current resource usage
}
```

### TrustViolation

```typescript
interface TrustViolation {
  agentId: string;                    // ID of the violating agent
  timestamp: string;                  // ISO timestamp of violation
  violationType: string;              // Type of violation
  details: string;                    // Violation details
}
```

### TrustDelta

```typescript
interface TrustDelta {
  agentId: string;                    // ID of the agent
  timestamp: string;                  // ISO timestamp of change
  previousScore: number;              // Previous trust score
  currentScore: number;               // New trust score
  delta: number;                      // Score change
  reason?: string;                    // Reason for change
}
```

### ResourceMetrics

```typescript
interface ResourceMetrics {
  cpu: number;                        // CPU usage (0-1)
  memory: number;                     // Memory usage (0-1)
  responseTime: number;               // Response time in ms
}
```

### Status Types

```typescript
type AgentStatus = 'healthy' | 'warning' | 'critical' | 'recovering';
type SystemHealth = 'stable' | 'degraded' | 'critical';
```

## Usage

### Initialization

```typescript
const intelAggregator = new IntelAggregator(
  eventBus,
  trustScorer,
  heartbeatMonitor,
  evolutionManager,
  resourceMonitor
);
```

### Event Handling

The module listens for the following events:

- `trust:signal` - Trust score updates
- `trust:warning` - Trust score warnings
- `trust:violation` - Trust violations
- `heartbeat:ping` - Agent heartbeat pings
- `heartbeat:warning` - Agent heartbeat warnings
- `heartbeat:critical` - Agent heartbeat critical states
- `evolution:triggered` - Evolution trigger events
- `evolution:completed` - Evolution completion events
- `resource:warning` - Resource usage warnings
- `resource:critical` - Resource usage critical states

### Snapshot Generation

```typescript
// Generate a new snapshot
await intelAggregator.generateSnapshot();

// Get current metrics
const metrics = intelAggregator.getCurrentMetrics();

// Get agent status
const agentStatus = intelAggregator.getAgentStatus('agent-1');

// Get system health
const health = intelAggregator.getSystemHealth();
```

### Trust Timeline

```typescript
// Record a trust delta
await trustTimeline.recordDelta('agent-1', 0.9, 'positive behavior');

// Get recent deltas
const deltas = await trustTimeline.getRecentDeltas('agent-1');

// Get trust trend
const trend = await trustTimeline.getTrustTrend('agent-1');
```

### Agent Status Surface

```typescript
// Get agent status
const status = await statusSurface.getAgentStatus('agent-1');

// Get all agent statuses
const allStatuses = await statusSurface.getAllAgentStatuses();
```

## Integration Points

The module integrates with:

1. Event Bus - For event handling and communication
2. Trust Scorer - For trust score tracking
3. Heartbeat Monitor - For agent health monitoring
4. Evolution Trigger Manager - For evolution tracking
5. Resource Monitor - For resource usage tracking

## Snapshot Storage

Snapshots are stored in `/logs/snapshots/` with the following format:
```
snapshot_YYYY-MM-DDTHH-mm-ss-sssZ.json
```

The module maintains a maximum of 1000 snapshots by default, removing the oldest ones when the limit is exceeded.

## Error Handling

The module handles various error conditions:

1. Missing monitors - Defaults to safe values
2. Invalid metrics - Validates and normalizes
3. Storage errors - Graceful degradation
4. Event processing errors - Error logging and recovery

## Performance Considerations

1. Snapshot generation is rate-limited (default: 5 minutes)
2. Trust timeline maintains a size limit (default: 1000 entries)
3. Resource-intensive operations are async
4. Caching is used where appropriate

## Security

1. No sensitive data is stored in snapshots
2. File operations use safe paths
3. Event data is validated
4. Resource usage is monitored

## Monitoring

The module can be monitored through:

1. System health status
2. Agent status metrics
3. Trust score trends
4. Resource usage patterns
5. Evolution trigger history 