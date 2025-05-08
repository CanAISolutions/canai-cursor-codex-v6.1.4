/**
 * optimization/resource-types.ts
 * 
 * Purpose:
 * Defines types for resource monitoring and management.
 */

export interface ResourceUsage {
  cpu: number;
  memory: number;
  timestamp: number;
}

export interface ResourceThresholds {
  cpuWarning: number;
  cpuCritical: number;
  memoryWarning: number;
  memoryCritical: number;
}

export interface ResourceMetrics {
  cpu: number;
  memory: number;
  responseTime: number;
}

export interface ResourceEvent {
  type: 'warning' | 'critical';
  resource: 'CPU' | 'Memory';
  value: number;
  threshold: number;
  timestamp: number;
} 