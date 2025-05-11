import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../utils/logger';

/**
 * ClarityDashboard - Generates and updates the clarity dashboard
 * Visualizes uplift deltas, risk flags, and persona scoring trends
 */
export class ClarityDashboard {
  private readonly logger: Logger;
  private readonly dashboardPath: string;
  private readonly htmlPath: string;

  /**
   * Creates a new ClarityDashboard instance
   * @param dashboardPath The path to the dashboard JSON file
   * @param htmlPath The path to the dashboard HTML file
   */
  constructor(dashboardPath: string = 'clarity-engine-dashboard.json', htmlPath: string = 'clarity-engine-dashboard.html') {
    this.logger = new Logger('ClarityDashboard');
    this.dashboardPath = dashboardPath;
    this.htmlPath = htmlPath;

    // Initialize dashboard if it doesn't exist
    if (!fs.existsSync(this.dashboardPath)) {
      this.initializeDashboard();
    }
  }

  /**
   * Initializes the dashboard with default structure
   */
  private initializeDashboard(): void {
    const initialData = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      metrics: {
        trust: [],
        empathy: [],
        actionability: [],
        bias: [],
        input_uplift: []
      },
      flags: {
        risk: [],
        persona: [],
        quality: []
      },
      trends: {
        uplift: [],
        risk: [],
        persona: []
      }
    };

    fs.writeFileSync(this.dashboardPath, JSON.stringify(initialData, null, 2));
    this.logger.info('Initialized dashboard');
  }

  /**
   * Updates the dashboard with new scores and metrics
   * @param result The result to add to the dashboard
   */
  public async update(result: any): Promise<void> {
    try {
      // Read current dashboard
      const dashboard = JSON.parse(fs.readFileSync(this.dashboardPath, 'utf8'));

      // Update metrics
      this.updateMetrics(dashboard, result);

      // Update flags
      this.updateFlags(dashboard, result);

      // Update trends
      this.updateTrends(dashboard, result);

      // Update timestamp
      dashboard.lastUpdated = new Date().toISOString();

      // Write updated dashboard
      fs.writeFileSync(this.dashboardPath, JSON.stringify(dashboard, null, 2));

      // Generate HTML visualization
      await this.generateHtml(dashboard);

      this.logger.info('Updated dashboard');
    } catch (error) {
      this.logger.error('Failed to update dashboard', error);
      throw error;
    }
  }

  /**
   * Updates the metrics section of the dashboard
   * @param dashboard The dashboard data
   * @param result The result to add
   */
  private updateMetrics(dashboard: any, result: any): void {
    const scores = result.scores || {};
    const metrics = result.metrics || {};

    // Add trust score
    if (scores.trust !== undefined) {
      dashboard.metrics.trust.push({
        timestamp: new Date().toISOString(),
        score: scores.trust,
        scenario: result.scenario
      });
    }

    // Add empathy score
    if (scores.empathy !== undefined) {
      dashboard.metrics.empathy.push({
        timestamp: new Date().toISOString(),
        score: scores.empathy,
        scenario: result.scenario
      });
    }

    // Add actionability score
    if (scores.actionability !== undefined) {
      dashboard.metrics.actionability.push({
        timestamp: new Date().toISOString(),
        score: scores.actionability,
        scenario: result.scenario
      });
    }

    // Add bias score
    if (scores.bias !== undefined) {
      dashboard.metrics.bias.push({
        timestamp: new Date().toISOString(),
        score: scores.bias,
        scenario: result.scenario
      });
    }

    // Add input uplift score
    if (scores.input_uplift !== undefined) {
      dashboard.metrics.input_uplift.push({
        timestamp: new Date().toISOString(),
        score: scores.input_uplift,
        scenario: result.scenario
      });
    }
  }

  /**
   * Updates the flags section of the dashboard
   * @param dashboard The dashboard data
   * @param result The result to add
   */
  private updateFlags(dashboard: any, result: any): void {
    const flags = result.flags || [];

    // Add risk flags
    const riskFlags = flags.filter((flag: string) => 
      flag.includes('risk') || flag.includes('error') || flag.includes('warning')
    );
    if (riskFlags.length > 0) {
      dashboard.flags.risk.push({
        timestamp: new Date().toISOString(),
        flags: riskFlags,
        scenario: result.scenario
      });
    }

    // Add persona flags
    const personaFlags = flags.filter((flag: string) => 
      flag.includes('persona') || flag.includes('tone') || flag.includes('style')
    );
    if (personaFlags.length > 0) {
      dashboard.flags.persona.push({
        timestamp: new Date().toISOString(),
        flags: personaFlags,
        scenario: result.scenario
      });
    }

    // Add quality flags
    const qualityFlags = flags.filter((flag: string) => 
      flag.includes('quality') || flag.includes('readability') || flag.includes('clarity')
    );
    if (qualityFlags.length > 0) {
      dashboard.flags.quality.push({
        timestamp: new Date().toISOString(),
        flags: qualityFlags,
        scenario: result.scenario
      });
    }
  }

  /**
   * Updates the trends section of the dashboard
   * @param dashboard The dashboard data
   * @param result The result to add
   */
  private updateTrends(dashboard: any, result: any): void {
    const scores = result.scores || {};
    const metrics = result.metrics || {};

    // Add uplift trend
    if (scores.input_uplift !== undefined) {
      dashboard.trends.uplift.push({
        timestamp: new Date().toISOString(),
        score: scores.input_uplift,
        scenario: result.scenario
      });
    }

    // Add risk trend
    const riskScore = this.calculateRiskScore(result);
    if (riskScore !== undefined) {
      dashboard.trends.risk.push({
        timestamp: new Date().toISOString(),
        score: riskScore,
        scenario: result.scenario
      });
    }

    // Add persona trend
    const personaScore = this.calculatePersonaScore(result);
    if (personaScore !== undefined) {
      dashboard.trends.persona.push({
        timestamp: new Date().toISOString(),
        score: personaScore,
        scenario: result.scenario
      });
    }
  }

  /**
   * Calculates a risk score from a result
   * @param result The result to calculate from
   * @returns The risk score
   */
  private calculateRiskScore(result: any): number | undefined {
    const scores = result.scores || {};
    const metrics = result.metrics || {};

    // Calculate risk score from trust and memory fidelity
    if (scores.trust !== undefined && metrics.memory_fidelity !== undefined) {
      return (scores.trust + metrics.memory_fidelity) / 2;
    }

    return undefined;
  }

  /**
   * Calculates a persona score from a result
   * @param result The result to calculate from
   * @returns The persona score
   */
  private calculatePersonaScore(result: any): number | undefined {
    const scores = result.scores || {};
    const metrics = result.metrics || {};

    // Calculate persona score from empathy and tone fit
    if (scores.empathy !== undefined && metrics.tone_fit !== undefined) {
      return (scores.empathy + metrics.tone_fit) / 2;
    }

    return undefined;
  }

  /**
   * Generates the HTML visualization of the dashboard
   * @param dashboard The dashboard data
   */
  private async generateHtml(dashboard: any): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clarity Engine Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: Inter, system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            background: #3A69E0;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .chart-container {
            position: relative;
            height: 300px;
        }
        .flags {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
        }
        .flag {
            background: #fff3cd;
            color: #856404;
            padding: 10px;
            border-radius: 4px;
            font-size: 14px;
        }
        .flag.risk {
            background: #f8d7da;
            color: #721c24;
        }
        .flag.persona {
            background: #d4edda;
            color: #155724;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Clarity Engine Dashboard</h1>
            <p>Last updated: ${new Date(dashboard.lastUpdated).toLocaleString()}</p>
        </div>

        <div class="grid">
            <div class="card">
                <h2>Metrics Overview</h2>
                <div class="chart-container">
                    <canvas id="metricsChart"></canvas>
                </div>
            </div>

            <div class="card">
                <h2>Trends</h2>
                <div class="chart-container">
                    <canvas id="trendsChart"></canvas>
                </div>
            </div>
        </div>

        <div class="card">
            <h2>Active Flags</h2>
            <div class="flags">
                ${this.generateFlagsHtml(dashboard)}
            </div>
        </div>
    </div>

    <script>
        // Metrics Chart
        const metricsCtx = document.getElementById('metricsChart').getContext('2d');
        new Chart(metricsCtx, {
            type: 'radar',
            data: {
                labels: ['Trust', 'Empathy', 'Actionability', 'Bias', 'Input Uplift'],
                datasets: [{
                    label: 'Latest Scores',
                    data: [
                        ${this.getLatestMetric(dashboard.metrics.trust)},
                        ${this.getLatestMetric(dashboard.metrics.empathy)},
                        ${this.getLatestMetric(dashboard.metrics.actionability)},
                        ${this.getLatestMetric(dashboard.metrics.bias)},
                        ${this.getLatestMetric(dashboard.metrics.input_uplift)}
                    ],
                    backgroundColor: 'rgba(58, 105, 224, 0.2)',
                    borderColor: '#3A69E0',
                    pointBackgroundColor: '#3A69E0'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 1
                    }
                }
            }
        });

        // Trends Chart
        const trendsCtx = document.getElementById('trendsChart').getContext('2d');
        new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: ${JSON.stringify(this.getTimestamps(dashboard.trends.uplift))},
                datasets: [{
                    label: 'Uplift',
                    data: ${JSON.stringify(this.getScores(dashboard.trends.uplift))},
                    borderColor: '#3A69E0',
                    tension: 0.1
                }, {
                    label: 'Risk',
                    data: ${JSON.stringify(this.getScores(dashboard.trends.risk))},
                    borderColor: '#dc3545',
                    tension: 0.1
                }, {
                    label: 'Persona',
                    data: ${JSON.stringify(this.getScores(dashboard.trends.persona))},
                    borderColor: '#28a745',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1
                    }
                }
            }
        });
    </script>
</body>
</html>
    `;

    fs.writeFileSync(this.htmlPath, html);
    this.logger.info('Generated HTML dashboard');
  }

  /**
   * Generates HTML for the flags section
   * @param dashboard The dashboard data
   * @returns The HTML string
   */
  private generateFlagsHtml(dashboard: any): string {
    const flags = [
      ...dashboard.flags.risk.map((f: any) => ({ ...f, type: 'risk' })),
      ...dashboard.flags.persona.map((f: any) => ({ ...f, type: 'persona' })),
      ...dashboard.flags.quality.map((f: any) => ({ ...f, type: 'quality' }))
    ];

    return flags
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map((flag: any) => `
        <div class="flag ${flag.type}">
            <strong>${flag.scenario}</strong><br>
            ${flag.flags.join(', ')}<br>
            <small>${new Date(flag.timestamp).toLocaleString()}</small>
        </div>
      `)
      .join('');
  }

  /**
   * Gets the latest metric value
   * @param metrics The metrics array
   * @returns The latest value or 0
   */
  private getLatestMetric(metrics: any[]): number {
    if (metrics.length === 0) return 0;
    return metrics[metrics.length - 1].score;
  }

  /**
   * Gets timestamps from a trend array
   * @param trends The trends array
   * @returns Array of formatted timestamps
   */
  private getTimestamps(trends: any[]): string[] {
    return trends.map(t => new Date(t.timestamp).toLocaleString());
  }

  /**
   * Gets scores from a trend array
   * @param trends The trends array
   * @returns Array of scores
   */
  private getScores(trends: any[]): number[] {
    return trends.map(t => t.score);
  }
} 