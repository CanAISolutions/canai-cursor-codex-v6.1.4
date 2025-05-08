// 🏥 Health Monitor
// Purpose: Monitor system health with emotional awareness
// Codex-Enforced • Phase 2.5 • Trust Score: 4.2

export interface HealthMetrics {
  cpu: number;
  memory: number;
  latency: number;
}

export interface HealthCheck {
  type: string;
  metrics: HealthMetrics;
}

export interface HealthResult {
  healthy: boolean;
  metrics: HealthMetrics;
  recommendations?: string[];
  emotionalScore?: number;
}

export class HealthMonitor {
  private readonly CPU_THRESHOLD = 80;
  private readonly MEMORY_THRESHOLD = 80;
  private readonly LATENCY_THRESHOLD = 300;

  async check(healthCheck: HealthCheck): Promise<HealthResult> {
    const { metrics } = healthCheck;
    const recommendations: string[] = [];

    // Check CPU
    if (metrics.cpu > this.CPU_THRESHOLD) {
      recommendations.push('CPU usage is high');
    }

    // Check memory
    if (metrics.memory > this.MEMORY_THRESHOLD) {
      recommendations.push('Memory usage is high');
    }

    // Check latency
    if (metrics.latency > this.LATENCY_THRESHOLD) {
      recommendations.push('Latency is above threshold');
    }

    return {
      healthy: recommendations.length === 0,
      metrics,
      recommendations: recommendations.length > 0 ? recommendations : undefined
    };
  }

  private generateRecommendation(metric: string, value: number, threshold: number): string {
    return `${metric} is at ${value}%, above ${threshold}% threshold`;
  }
} 