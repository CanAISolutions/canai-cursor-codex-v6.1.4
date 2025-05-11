/**
 * prompt-health-dashboard.ts
 * 
 * Purpose: Generate prompt health metrics for weekly founder digest
 * Includes: Test status, last delta, persona confidence, trend alerts, health score
 */

import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from '../system-intel/audit-utils';
import * as fs from 'fs/promises';
import * as path from 'path';

interface PromptHealthMetrics {
  promptPath: string;
  lastVersion: string;
  testStatus: {
    passed: boolean;
    coverage: number;
    lastRun: string;
  };
  metrics: {
    lastDelta: number;
    personaConfidence: number;
    structuralScore: number;
    regressionScore: number;
  };
  trends: {
    deltaTrend: 'improving' | 'stable' | 'regressing';
    personaTrend: 'improving' | 'stable' | 'regressing';
    testTrend: 'improving' | 'stable' | 'regressing';
  };
}

interface WeeklyDigest {
  timestamp: string;
  period: {
    start: string;
    end: string;
  };
  promptHealth: PromptHealthMetrics[];
  summary: {
    totalPrompts: number;
    passingPrompts: number;
    failingPrompts: number;
    averageCoverage: number;
    criticalIssues: number;
  };
}

interface TrendAlert {
  type: 'delta' | 'persona' | 'coverage';
  severity: 'warning' | 'critical';
  message: string;
  metric: {
    current: number;
    previous: number;
    change: number;
  };
  timestamp: string;
}

interface PersonaWeight {
  promptType: string;
  weight: number;
  priority: 'high' | 'medium' | 'low';
}

interface DigestHook {
  type: 'slack' | 'notion';
  channel: string;
  enabled: boolean;
}

interface PromptHealthScore {
  overall: number;
  components: {
    delta: number;
    coverage: number;
    persona: number;
  };
  trend: 'improving' | 'stable' | 'regressing';
  timestamp: string;
}

interface SlackMessage {
  channel: string;
  text: string;
  blocks: any[];
}

interface NotionPage {
  parent: { database_id: string };
  properties: Record<string, any>;
}

export class PromptHealthDashboard {
  private eventBus: EventBus;
  private readonly VALIDATION_DIR = '/prompt-validation';
  private readonly REPORTS_DIR = '/prompt-validation/reports';
  private readonly DIGEST_DIR = '/dashboard/digests';
  private readonly ARCHIVE_DIR = '/dashboard/archives';
  
  // Alert thresholds
  private readonly DELTA_ALERT_THRESHOLD = 0.3; // 30% drop
  private readonly PERSONA_ALERT_THRESHOLD = 0.2; // 2 points
  private readonly COVERAGE_ALERT_THRESHOLD = 0.1; // 10% drop
  
  // Persona weights
  private readonly PERSONA_WEIGHTS: PersonaWeight[] = [
    { promptType: 'business_plan', weight: 1.0, priority: 'high' },
    { promptType: 'site_audit', weight: 0.8, priority: 'medium' },
    { promptType: 'social_content', weight: 0.6, priority: 'low' }
  ];
  
  // Digest hooks
  private readonly DIGEST_HOOKS: DigestHook[] = [
    { type: 'slack', channel: '#founder-digest', enabled: true },
    { type: 'notion', channel: 'founder-weekly', enabled: true }
  ];

  // API configuration
  private readonly SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;
  private readonly NOTION_TOKEN = process.env.NOTION_API_KEY;
  private readonly NOTION_DATABASE_ID = process.env.NOTION_DIGEST_DATABASE_ID;

  // Health score weights
  private readonly HEALTH_SCORE_WEIGHTS = {
    delta: 0.4,
    coverage: 0.3,
    persona: 0.3
  };

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.initializeEventListeners();
  }

  /**
   * Initialize event listeners
   */
  private initializeEventListeners(): void {
    this.eventBus.on('VALIDATION_COMPLETED', this.handleValidationUpdate.bind(this));
    this.eventBus.on('WEEKLY_DIGEST_REQUESTED', this.generateWeeklyDigest.bind(this));
  }

  /**
   * Handle validation update
   */
  private async handleValidationUpdate(validation: any): Promise<void> {
    try {
      // Update metrics
      await this.updateMetrics(validation);
      
      // Emit dashboard update
      await this.emitDashboardUpdate(validation);
    } catch (error) {
      console.error('Failed to handle validation update:', error);
      throw error;
    }
  }

  /**
   * Generate weekly digest
   */
  async generateWeeklyDigest(): Promise<WeeklyDigest> {
    try {
      // Get all prompt health metrics
      const metrics = await this.getAllPromptMetrics();
      
      // Calculate summary
      const summary = this.calculateSummary(metrics);
      
      // Generate digest
      const digest: WeeklyDigest = {
        timestamp: new Date().toISOString(),
        period: {
          start: this.getLastWeekStart(),
          end: new Date().toISOString()
        },
        promptHealth: metrics,
        summary
      };
      
      // Save digest
      await this.saveDigest(digest);
      
      // Emit digest
      await this.emitDigest(digest);
      
      return digest;
    } catch (error) {
      console.error('Failed to generate weekly digest:', error);
      throw error;
    }
  }

  /**
   * Get all prompt metrics
   */
  private async getAllPromptMetrics(): Promise<PromptHealthMetrics[]> {
    const metrics: PromptHealthMetrics[] = [];
    
    // Get all prompt paths
    const promptPaths = await this.getPromptPaths();
    
    // Get metrics for each prompt
    for (const promptPath of promptPaths) {
      const metric = await this.getPromptMetrics(promptPath);
      metrics.push(metric);
    }
    
    return metrics;
  }

  /**
   * Get prompt paths
   */
  private async getPromptPaths(): Promise<string[]> {
    const reportsPath = path.join(this.REPORTS_DIR);
    const entries = await fs.readdir(reportsPath, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  }

  /**
   * Get prompt metrics
   */
  private async getPromptMetrics(promptPath: string): Promise<PromptHealthMetrics> {
    // Get latest validation report
    const latestReport = await this.getLatestReport(promptPath);
    
    // Get test status
    const testStatus = await this.getTestStatus(promptPath);
    
    // Get trends
    const trends = await this.calculateTrends(promptPath);
    
    return {
      promptPath,
      lastVersion: latestReport.version,
      testStatus,
      metrics: {
        lastDelta: latestReport.metrics.overallScore,
        personaConfidence: latestReport.metrics.personaScore,
        structuralScore: latestReport.metrics.structuralScore,
        regressionScore: latestReport.metrics.regressionScore
      },
      trends
    };
  }

  /**
   * Get latest report
   */
  private async getLatestReport(promptPath: string): Promise<any> {
    const reportsPath = path.join(this.REPORTS_DIR, promptPath);
    const entries = await fs.readdir(reportsPath);
    const latestReport = entries
      .filter(entry => entry.endsWith('.json'))
      .sort()
      .pop();
    
    if (!latestReport) {
      throw new Error(`No reports found for ${promptPath}`);
    }
    
    const content = await fs.readFile(path.join(reportsPath, latestReport), 'utf8');
    return JSON.parse(content);
  }

  /**
   * Get test status
   */
  private async getTestStatus(promptPath: string): Promise<PromptHealthMetrics['testStatus']> {
    // In real implementation, this would read from test results
    return {
      passed: true,
      coverage: 95,
      lastRun: new Date().toISOString()
    };
  }

  /**
   * Calculate trends with alerts
   */
  private async calculateTrends(promptPath: string): Promise<{
    trends: {
      deltaTrend: 'improving' | 'stable' | 'regressing';
      personaTrend: 'improving' | 'stable' | 'regressing';
      testTrend: 'improving' | 'stable' | 'regressing';
    };
    alerts: TrendAlert[];
  }> {
    const alerts: TrendAlert[] = [];
    const currentMetrics = await this.getPromptMetrics(promptPath);
    const previousMetrics = await this.getPreviousMetrics(promptPath);
    
    // Calculate delta trend
    const deltaChange = currentMetrics.metrics.lastDelta - previousMetrics.metrics.lastDelta;
    if (Math.abs(deltaChange) >= this.DELTA_ALERT_THRESHOLD) {
      alerts.push({
        type: 'delta',
        severity: deltaChange < 0 ? 'critical' : 'warning',
        message: `Delta ${deltaChange < 0 ? 'dropped' : 'increased'} by ${Math.abs(deltaChange * 100).toFixed(1)}%`,
        metric: {
          current: currentMetrics.metrics.lastDelta,
          previous: previousMetrics.metrics.lastDelta,
          change: deltaChange
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Calculate persona trend
    const personaChange = currentMetrics.metrics.personaConfidence - previousMetrics.metrics.personaConfidence;
    if (Math.abs(personaChange) >= this.PERSONA_ALERT_THRESHOLD) {
      alerts.push({
        type: 'persona',
        severity: personaChange < 0 ? 'critical' : 'warning',
        message: `Persona confidence ${personaChange < 0 ? 'dropped' : 'increased'} by ${Math.abs(personaChange * 100).toFixed(1)}%`,
        metric: {
          current: currentMetrics.metrics.personaConfidence,
          previous: previousMetrics.metrics.personaConfidence,
          change: personaChange
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Calculate test trend
    const coverageChange = currentMetrics.testStatus.coverage - previousMetrics.testStatus.coverage;
    if (Math.abs(coverageChange) >= this.COVERAGE_ALERT_THRESHOLD) {
      alerts.push({
        type: 'coverage',
        severity: coverageChange < 0 ? 'critical' : 'warning',
        message: `Test coverage ${coverageChange < 0 ? 'dropped' : 'increased'} by ${Math.abs(coverageChange).toFixed(1)}%`,
        metric: {
          current: currentMetrics.testStatus.coverage,
          previous: previousMetrics.testStatus.coverage,
          change: coverageChange
        },
        timestamp: new Date().toISOString()
      });
    }
    
    const trends = {
      deltaTrend: this.getTrendDirection(deltaChange),
      personaTrend: this.getTrendDirection(personaChange),
      testTrend: this.getTrendDirection(coverageChange)
    };
    
    return { trends, alerts };
  }

  /**
   * Get previous metrics
   */
  private async getPreviousMetrics(promptPath: string): Promise<PromptHealthMetrics> {
    const reportsPath = path.join(this.REPORTS_DIR, promptPath);
    const entries = await fs.readdir(reportsPath);
    const previousReport = entries
      .filter(entry => entry.endsWith('.json'))
      .sort()
      .slice(-2, -1)[0];
    
    if (!previousReport) {
      return this.getPromptMetrics(promptPath);
    }
    
    const content = await fs.readFile(path.join(reportsPath, previousReport), 'utf8');
    const report = JSON.parse(content);
    
    return {
      promptPath,
      lastVersion: report.version,
      testStatus: {
        passed: report.testStatus.passed,
        coverage: report.testStatus.coverage,
        lastRun: report.testStatus.lastRun
      },
      metrics: {
        lastDelta: report.metrics.overallScore,
        personaConfidence: report.metrics.personaScore,
        structuralScore: report.metrics.structuralScore,
        regressionScore: report.metrics.regressionScore
      },
      trends: {
        deltaTrend: 'stable',
        personaTrend: 'stable',
        testTrend: 'stable'
      }
    };
  }

  /**
   * Get trend direction
   */
  private getTrendDirection(change: number): 'improving' | 'stable' | 'regressing' {
    if (Math.abs(change) < 0.05) return 'stable';
    return change > 0 ? 'improving' : 'regressing';
  }

  /**
   * Get persona weight
   */
  private getPersonaWeight(promptType: string): number {
    const weight = this.PERSONA_WEIGHTS.find(w => w.promptType === promptType);
    return weight?.weight || 0.5;
  }

  /**
   * Calculate summary
   */
  private calculateSummary(metrics: PromptHealthMetrics[]): WeeklyDigest['summary'] {
    const totalPrompts = metrics.length;
    const passingPrompts = metrics.filter(m => m.testStatus.passed).length;
    const failingPrompts = totalPrompts - passingPrompts;
    const averageCoverage = metrics.reduce((sum, m) => sum + m.testStatus.coverage, 0) / totalPrompts;
    const criticalIssues = metrics.filter(m => !m.testStatus.passed && m.metrics.lastDelta < 0.7).length;
    
    return {
      totalPrompts,
      passingPrompts,
      failingPrompts,
      averageCoverage,
      criticalIssues
    };
  }

  /**
   * Save digest
   */
  private async saveDigest(digest: WeeklyDigest): Promise<void> {
    const digestPath = path.join(this.DIGEST_DIR, `digest-${digest.timestamp}.json`);
    await fs.writeFile(digestPath, JSON.stringify(digest, null, 2));
  }

  /**
   * Emit digest
   */
  private async emitDigest(digest: WeeklyDigest): Promise<void> {
    const markdown = this.formatDigestMarkdown(digest);
    
    // Save to system log
    await emitSystemLog('weekly-digest', {
      path: '/dashboard/weekly-digest.md',
      content: markdown
    });
    
    // Archive digest
    await this.archiveDigest(digest);
    
    // Emit to hooks
    await this.emitToHooks(digest, markdown);
  }

  /**
   * Archive digest
   */
  private async archiveDigest(digest: WeeklyDigest): Promise<void> {
    const archivePath = path.join(this.ARCHIVE_DIR, `digest-${digest.timestamp}.json`);
    await fs.writeFile(archivePath, JSON.stringify(digest, null, 2));
  }

  /**
   * Emit to hooks
   */
  private async emitToHooks(digest: WeeklyDigest, markdown: string): Promise<void> {
    for (const hook of this.DIGEST_HOOKS) {
      if (!hook.enabled) continue;
      
      try {
        switch (hook.type) {
          case 'slack':
            await this.emitToSlack(hook.channel, markdown);
            break;
          case 'notion':
            await this.emitToNotion(hook.channel, digest);
            break;
        }
      } catch (error) {
        console.error(`Failed to emit to ${hook.type}:`, error);
      }
    }
  }

  /**
   * Calculate prompt health score
   */
  private calculateHealthScore(metrics: PromptHealthMetrics): PromptHealthScore {
    const deltaScore = metrics.metrics.lastDelta;
    const coverageScore = metrics.testStatus.coverage / 100;
    const personaScore = metrics.metrics.personaConfidence;

    const overallScore = (
      deltaScore * this.HEALTH_SCORE_WEIGHTS.delta +
      coverageScore * this.HEALTH_SCORE_WEIGHTS.coverage +
      personaScore * this.HEALTH_SCORE_WEIGHTS.persona
    );

    return {
      overall: overallScore,
      components: {
        delta: deltaScore,
        coverage: coverageScore,
        persona: personaScore
      },
      trend: this.getTrendDirection(
        overallScore - (metrics.metrics.lastDelta * 0.4 + 
                       metrics.testStatus.coverage / 100 * 0.3 + 
                       metrics.metrics.personaConfidence * 0.3)
      ),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Emit to Slack
   */
  private async emitToSlack(channel: string, markdown: string): Promise<void> {
    if (!this.SLACK_TOKEN) {
      console.error('Slack token not configured');
      return;
    }

    try {
      const message: SlackMessage = {
        channel,
        text: 'Weekly Prompt Health Digest',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '📊 Weekly Prompt Health Digest'
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: markdown
            }
          }
        ]
      };

      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.SLACK_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.statusText}`);
      }

      const result = await response.json();
      if (!result.ok) {
        throw new Error(`Slack API error: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to emit to Slack:', error);
      throw error;
    }
  }

  /**
   * Emit to Notion
   */
  private async emitToNotion(channel: string, digest: WeeklyDigest): Promise<void> {
    if (!this.NOTION_TOKEN || !this.NOTION_DATABASE_ID) {
      console.error('Notion configuration missing');
      return;
    }

    try {
      const page: NotionPage = {
        parent: { database_id: this.NOTION_DATABASE_ID },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: `Prompt Health Digest - ${new Date(digest.timestamp).toLocaleDateString()}`
                }
              }
            ]
          },
          Status: {
            select: {
              name: 'Active'
            }
          },
          'Total Prompts': {
            number: digest.summary.totalPrompts
          },
          'Passing Prompts': {
            number: digest.summary.passingPrompts
          },
          'Average Coverage': {
            number: digest.summary.averageCoverage
          },
          'Critical Issues': {
            number: digest.summary.criticalIssues
          },
          'Health Score': {
            number: this.calculateHealthScore(digest.promptHealth[0]).overall
          }
        }
      };

      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.NOTION_TOKEN}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify(page)
      });

      if (!response.ok) {
        throw new Error(`Notion API error: ${response.statusText}`);
      }

      const result = await response.json();
      if (!result.id) {
        throw new Error('Failed to create Notion page');
      }
    } catch (error) {
      console.error('Failed to emit to Notion:', error);
      throw error;
    }
  }

  /**
   * Format digest markdown
   */
  private formatDigestMarkdown(digest: WeeklyDigest): string {
    const alerts = this.collectAlerts(digest);
    const healthScore = this.calculateHealthScore(digest.promptHealth[0]);
    
    return `
# Weekly Prompt Health Digest
## Period: ${new Date(digest.period.start).toLocaleDateString()} - ${new Date(digest.period.end).toLocaleDateString()}

### Health Score: ${(healthScore.overall * 100).toFixed(1)}% (${healthScore.trend})
- Delta: ${(healthScore.components.delta * 100).toFixed(1)}%
- Coverage: ${(healthScore.components.coverage * 100).toFixed(1)}%
- Persona: ${(healthScore.components.persona * 100).toFixed(1)}%

### Summary
- Total Prompts: ${digest.summary.totalPrompts}
- Passing Prompts: ${digest.summary.passingPrompts}
- Failing Prompts: ${digest.summary.failingPrompts}
- Average Coverage: ${digest.summary.averageCoverage.toFixed(1)}%
- Critical Issues: ${digest.summary.criticalIssues}

${alerts.length > 0 ? `
### Alerts
${alerts.map(alert => `
#### ${alert.type.toUpperCase()} Alert (${alert.severity})
- ${alert.message}
- Current: ${(alert.metric.current * 100).toFixed(1)}%
- Previous: ${(alert.metric.previous * 100).toFixed(1)}%
- Change: ${(alert.metric.change * 100).toFixed(1)}%
`).join('\n')}
` : ''}

### Prompt Health
${digest.promptHealth.map(metric => `
#### ${metric.promptPath}
- Last Version: ${metric.lastVersion}
- Test Status: ${metric.testStatus.passed ? '✅' : '❌'} (${metric.testStatus.coverage}% coverage)
- Last Delta: ${(metric.metrics.lastDelta * 100).toFixed(1)}%
- Persona Confidence: ${(metric.metrics.personaConfidence * 100).toFixed(1)}%
- Trends:
  - Delta: ${metric.trends.deltaTrend}
  - Persona: ${metric.trends.personaTrend}
  - Tests: ${metric.trends.testTrend}
`).join('\n')}
`.trim();
  }

  /**
   * Collect alerts
   */
  private collectAlerts(digest: WeeklyDigest): TrendAlert[] {
    const alerts: TrendAlert[] = [];
    
    for (const metric of digest.promptHealth) {
      // Add alerts based on thresholds
      if (metric.metrics.lastDelta < 0.7) {
        alerts.push({
          type: 'delta',
          severity: 'critical',
          message: `Critical delta drop in ${metric.promptPath}`,
          metric: {
            current: metric.metrics.lastDelta,
            previous: 0.9, // Example previous value
            change: metric.metrics.lastDelta - 0.9
          },
          timestamp: new Date().toISOString()
        });
      }
      
      if (metric.metrics.personaConfidence < 0.8) {
        alerts.push({
          type: 'persona',
          severity: 'warning',
          message: `Persona confidence drop in ${metric.promptPath}`,
          metric: {
            current: metric.metrics.personaConfidence,
            previous: 0.9, // Example previous value
            change: metric.metrics.personaConfidence - 0.9
          },
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return alerts;
  }

  /**
   * Get last week start
   */
  private getLastWeekStart(): string {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString();
  }

  /**
   * Update metrics
   */
  private async updateMetrics(validation: any): Promise<void> {
    // In real implementation, this would update metrics storage
  }

  /**
   * Emit dashboard update
   */
  private async emitDashboardUpdate(validation: any): Promise<void> {
    // In real implementation, this would update dashboard
  }
} 