/**
 * monitoring/dashboard.ts
 * 
 * Purpose:
 * Provides a comprehensive dashboard for monitoring trust score trends,
 * system health metrics, and recovery effectiveness.
 */

import { TrustEvolutionTracker } from '../agents/trust-scorer/evolution-tracker';
import { SmartRevisionLoop } from '../self-healing/smart-revision-loop';
import { EnhancedVisionProcessor } from '../vision-injection/enhanced-vision-processor';

interface SystemMetrics {
  trustScores: {
    [component: string]: {
      current: number;
      trend: number[];
      baseline: number;
      stability: number;
    };
  };
  recoveryMetrics: {
    [component: string]: {
      successRate: number;
      averageTime: number;
      failureCount: number;
      lastRecovery: number;
    };
  };
  visionMetrics: {
    semanticConfidence: number;
    interpretationQuality: number;
    recoveryNeeded: boolean;
  };
  systemHealth: {
    overall: number;
    components: {
      [component: string]: number;
    };
  };
}

interface DashboardConfig {
  refreshInterval: number;
  historyWindow: number;
  alertThresholds: {
    trustScore: number;
    recoverySuccess: number;
    systemHealth: number;
  };
}

export class MonitoringDashboard {
  private metrics: SystemMetrics = {
    trustScores: {},
    recoveryMetrics: {},
    visionMetrics: {
      semanticConfidence: 0,
      interpretationQuality: 0,
      recoveryNeeded: false
    },
    systemHealth: {
      overall: 1,
      components: {}
    }
  };

  private readonly config: DashboardConfig = {
    refreshInterval: 5000, // 5 seconds
    historyWindow: 1000 * 60 * 60 * 24, // 24 hours
    alertThresholds: {
      trustScore: 0.7,
      recoverySuccess: 0.8,
      systemHealth: 0.8
    }
  };

  constructor(
    private trustTracker: TrustEvolutionTracker,
    private revisionLoop: SmartRevisionLoop,
    private visionProcessor: EnhancedVisionProcessor
  ) {
    this.initializeMetrics();
    this.startMonitoring();
  }

  /**
   * Gets current system metrics
   */
  async getMetrics(): Promise<SystemMetrics> {
    await this.updateMetrics();
    return this.metrics;
  }

  /**
   * Gets metrics for a specific component
   */
  async getComponentMetrics(component: string): Promise<{
    trust: any;
    recovery: any;
    health: number;
  }> {
    await this.updateMetrics();
    return {
      trust: this.metrics.trustScores[component],
      recovery: this.metrics.recoveryMetrics[component],
      health: this.metrics.systemHealth.components[component]
    };
  }

  /**
   * Initializes metrics for all components
   */
  private async initializeMetrics(): Promise<void> {
    const components = await this.getActiveComponents();
    
    for (const component of components) {
      this.metrics.trustScores[component] = {
        current: 1,
        trend: [],
        baseline: 1,
        stability: 1
      };

      this.metrics.recoveryMetrics[component] = {
        successRate: 1,
        averageTime: 0,
        failureCount: 0,
        lastRecovery: Date.now()
      };

      this.metrics.systemHealth.components[component] = 1;
    }
  }

  /**
   * Starts the monitoring loop
   */
  private startMonitoring(): void {
    setInterval(async () => {
      await this.updateMetrics();
      this.checkAlerts();
    }, this.config.refreshInterval);
  }

  /**
   * Updates all system metrics
   */
  private async updateMetrics(): Promise<void> {
    const components = await this.getActiveComponents();

    for (const component of components) {
      await this.updateTrustMetrics(component);
      await this.updateRecoveryMetrics(component);
      await this.updateVisionMetrics();
      await this.updateSystemHealth(component);
    }
  }

  /**
   * Updates trust metrics for a component
   */
  private async updateTrustMetrics(component: string): Promise<void> {
    const evolutionMetrics = await this.trustTracker.calculateEvolutionMetrics(component);
    const history = await this.trustTracker.getTrustHistory(component);

    this.metrics.trustScores[component] = {
      current: evolutionMetrics.baselineScore,
      trend: history.map(snapshot => snapshot.score),
      baseline: evolutionMetrics.baselineScore,
      stability: evolutionMetrics.stabilityIndex
    };
  }

  /**
   * Updates recovery metrics for a component
   */
  private async updateRecoveryMetrics(component: string): Promise<void> {
    const recoveryMetrics = await this.revisionLoop.getRecoveryMetrics(component);

    if (recoveryMetrics) {
      this.metrics.recoveryMetrics[component] = {
        successRate: recoveryMetrics.successRate,
        averageTime: recoveryMetrics.recoveryTime,
        failureCount: recoveryMetrics.failureCount,
        lastRecovery: recoveryMetrics.lastRecoveryTimestamp
      };
    } else {
      // Initialize with default values if no metrics available
      this.metrics.recoveryMetrics[component] = {
        successRate: 1,
        averageTime: 0,
        failureCount: 0,
        lastRecovery: Date.now()
      };
    }
  }

  /**
   * Updates vision metrics
   */
  private async updateVisionMetrics(): Promise<void> {
    const visionAnalysis = await this.visionProcessor.processVision(
      'system_state',
      {},
      {}
    );

    this.metrics.visionMetrics = {
      semanticConfidence: visionAnalysis.semanticAnalysis.confidence,
      interpretationQuality: visionAnalysis.semanticAnalysis.intentClarity,
      recoveryNeeded: visionAnalysis.semanticAnalysis.recoveryNeeded
    };
  }

  /**
   * Updates system health for a component
   */
  private async updateSystemHealth(component: string): Promise<void> {
    const trustScore = this.metrics.trustScores[component].current;
    const recoverySuccess = this.metrics.recoveryMetrics[component].successRate;
    const visionHealth = this.metrics.visionMetrics.semanticConfidence;

    const healthScore = (trustScore + recoverySuccess + visionHealth) / 3;
    this.metrics.systemHealth.components[component] = healthScore;

    // Update overall system health
    const componentScores = Object.values(this.metrics.systemHealth.components);
    this.metrics.systemHealth.overall =
      componentScores.reduce((sum, score) => sum + score, 0) / componentScores.length;
  }

  /**
   * Checks for alert conditions
   */
  private checkAlerts(): void {
    const alerts: string[] = [];

    // Check trust scores
    for (const [component, metrics] of Object.entries(this.metrics.trustScores)) {
      if (metrics.current < this.config.alertThresholds.trustScore) {
        alerts.push(`Low trust score for ${component}: ${metrics.current}`);
      }
    }

    // Check recovery success rates
    for (const [component, metrics] of Object.entries(this.metrics.recoveryMetrics)) {
      if (metrics.successRate < this.config.alertThresholds.recoverySuccess) {
        alerts.push(`Low recovery success rate for ${component}: ${metrics.successRate}`);
      }
    }

    // Check system health
    if (this.metrics.systemHealth.overall < this.config.alertThresholds.systemHealth) {
      alerts.push(`Low overall system health: ${this.metrics.systemHealth.overall}`);
    }

    if (alerts.length > 0) {
      this.handleAlerts(alerts);
    }
  }

  /**
   * Handles alert conditions
   */
  private handleAlerts(alerts: string[]): void {
    // Log alerts
    console.warn('System Alerts:', alerts);

    // TODO: Implement alert handling (e.g., notifications, automated recovery)
  }

  /**
   * Gets list of active components
   */
  private async getActiveComponents(): Promise<string[]> {
    // TODO: Implement component discovery
    return ['emotional', 'vision', 'trust', 'system'];
  }
} 