/**
 * prompt-refinement-advisor.ts
 * 
 * Purpose: Surface actionable refinement guidance from delta intelligence.
 * Triggered: On demand, during CI checks, or after delta analysis.
 * Enforces: Clear guidance, prioritized actions, and exportable insights.
 */

import { EventBus } from '../../event-bus/eventBus';
import { emitSystemLog } from '../../system-intel/audit-utils';
import { OutputDeltaIntelligence } from '../output-intel/output-delta-intelligence';
import * as fs from 'fs/promises';
import * as path from 'path';

interface RefinementAction {
  type: string;
  priority: 'low' | 'medium' | 'high';
  confidence: number;
  impact: number;
  description: string;
  examples: string[];
  rationale: string;
}

interface PromptGuidance {
  promptPath: string;
  version: string;
  lastUpdated: string;
  overallScore: number;
  actions: RefinementAction[];
  metrics: {
    clarity: number;
    empathy: number;
    trust: number;
    emotionalResonance: number;
  };
  summary: string;
}

interface PromptTypeGuidance {
  type: string;
  commonIssues: Array<{
    issue: string;
    frequency: number;
    impact: number;
    examples: string[];
  }>;
  bestPractices: Array<{
    practice: string;
    confidence: number;
    impact: number;
    examples: string[];
  }>;
  metrics: {
    averageClarity: number;
    averageEmpathy: number;
    averageTrust: number;
    averageEmotionalResonance: number;
  };
}

export class PromptRefinementAdvisor {
  private eventBus: EventBus;
  private deltaIntelligence: OutputDeltaIntelligence;
  private readonly GUIDANCE_DIR = '/refinement-advisor/guidance';
  private readonly DASHBOARD_DIR = '/refinement-advisor/dashboard';
  private readonly MIN_CONFIDENCE = 0.7;
  private readonly MIN_IMPACT = 0.5;

  constructor(eventBus: EventBus, deltaIntelligence: OutputDeltaIntelligence) {
    this.eventBus = eventBus;
    this.deltaIntelligence = deltaIntelligence;
    this.initializeEventListeners();
  }

  /**
   * Initialize event listeners
   */
  private initializeEventListeners(): void {
    this.eventBus.on('GUIDANCE_REQUESTED', this.handleGuidanceRequest.bind(this));
    this.eventBus.on('CI_CHECK', this.handleCICheck.bind(this));
  }

  /**
   * Handle guidance request
   */
  async handleGuidanceRequest(request: { promptPath: string; version: string }): Promise<PromptGuidance> {
    try {
      // Get refinement guide
      const guide = await this.deltaIntelligence.generateRefinementGuide(request);
      
      // Generate actions
      const actions = await this.generateActions(guide);
      
      // Calculate overall score
      const overallScore = this.calculateOverallScore(guide.metrics);
      
      // Generate summary
      const summary = this.generateSummary(actions, guide.metrics);
      
      // Create guidance
      const guidance: PromptGuidance = {
        promptPath: request.promptPath,
        version: request.version,
        lastUpdated: new Date().toISOString(),
        overallScore,
        actions,
        metrics: guide.metrics,
        summary
      };

      // Save guidance
      await this.saveGuidance(guidance);
      
      // Update dashboard
      await this.updateDashboard(guidance);
      
      // Log guidance generation
      await this.logGuidanceGeneration(guidance);

      return guidance;
    } catch (error) {
      console.error('Failed to handle guidance request:', error);
      throw error;
    }
  }

  /**
   * Handle CI check
   */
  async handleCICheck(check: { promptPath: string; version: string }): Promise<void> {
    try {
      // Get guidance
      const guidance = await this.handleGuidanceRequest(check);
      
      // Emit CI report
      await this.emitCIReport(guidance);
    } catch (error) {
      console.error('Failed to handle CI check:', error);
      throw error;
    }
  }

  /**
   * Generate actions from guide
   */
  private async generateActions(guide: any): Promise<RefinementAction[]> {
    const actions: RefinementAction[] = [];

    for (const rec of guide.recommendations) {
      if (rec.confidence >= this.MIN_CONFIDENCE) {
        actions.push({
          type: rec.type,
          priority: rec.priority,
          confidence: rec.confidence,
          impact: this.calculateActionImpact(rec),
          description: this.generateActionDescription(rec),
          examples: rec.examples,
          rationale: rec.rationale
        });
      }
    }

    return actions.sort((a, b) => {
      if (a.priority !== b.priority) {
        return this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority);
      }
      return b.confidence - a.confidence;
    });
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(metrics: PromptGuidance['metrics']): number {
    const weights = {
      clarity: 0.3,
      empathy: 0.3,
      trust: 0.3,
      emotionalResonance: 0.1
    };

    return Object.entries(metrics).reduce(
      (score, [key, value]) => score + value * weights[key as keyof typeof weights],
      0
    );
  }

  /**
   * Generate summary
   */
  private generateSummary(actions: RefinementAction[], metrics: PromptGuidance['metrics']): string {
    const highPriorityActions = actions.filter(a => a.priority === 'high');
    const mediumPriorityActions = actions.filter(a => a.priority === 'medium');
    
    return `
This prompt has an overall quality score of ${Math.round(this.calculateOverallScore(metrics) * 100)}%.

${highPriorityActions.length > 0 ? `
High-priority improvements needed:
${highPriorityActions.map(a => `- ${a.description}`).join('\n')}
` : ''}

${mediumPriorityActions.length > 0 ? `
Medium-priority improvements:
${mediumPriorityActions.map(a => `- ${a.description}`).join('\n')}
` : ''}

Current metrics:
- Clarity: ${Math.round(metrics.clarity * 100)}%
- Empathy: ${Math.round(metrics.empathy * 100)}%
- Trust: ${Math.round(metrics.trust * 100)}%
- Emotional Resonance: ${Math.round(metrics.emotionalResonance * 100)}%
`.trim();
  }

  /**
   * Save guidance
   */
  private async saveGuidance(guidance: PromptGuidance): Promise<void> {
    const guidancePath = `${this.GUIDANCE_DIR}/${guidance.promptPath}/${guidance.version}`;
    
    // Save JSON
    await fs.writeFile(
      `${guidancePath}.json`,
      JSON.stringify(guidance, null, 2)
    );
    
    // Save Markdown
    await fs.writeFile(
      `${guidancePath}.md`,
      this.formatGuidanceMarkdown(guidance)
    );
  }

  /**
   * Update dashboard
   */
  private async updateDashboard(guidance: PromptGuidance): Promise<void> {
    const dashboardPath = `${this.DASHBOARD_DIR}/prompts.json`;
    let dashboard: Record<string, any>;

    try {
      const content = await fs.readFile(dashboardPath, 'utf8');
      dashboard = JSON.parse(content);
    } catch {
      dashboard = {};
    }

    // Update dashboard data
    dashboard[guidance.promptPath] = {
      version: guidance.version,
      lastUpdated: guidance.lastUpdated,
      overallScore: guidance.overallScore,
      metrics: guidance.metrics,
      actionCount: guidance.actions.length,
      highPriorityActions: guidance.actions.filter(a => a.priority === 'high').length
    };

    // Save dashboard
    await fs.writeFile(dashboardPath, JSON.stringify(dashboard, null, 2));
  }

  /**
   * Emit CI report
   */
  private async emitCIReport(guidance: PromptGuidance): Promise<void> {
    const report = {
      promptPath: guidance.promptPath,
      version: guidance.version,
      overallScore: guidance.overallScore,
      metrics: guidance.metrics,
      highPriorityActions: guidance.actions.filter(a => a.priority === 'high'),
      summary: guidance.summary
    };

    await emitSystemLog('ci-report', {
      path: '/ci-reports/refinement-check.json',
      content: JSON.stringify(report, null, 2)
    });
  }

  /**
   * Log guidance generation
   */
  private async logGuidanceGeneration(guidance: PromptGuidance): Promise<void> {
    const logEntry = `
## [${new Date().toISOString()}] Refinement Guidance Generated

### Prompt: ${guidance.promptPath}
- Version: ${guidance.version}
- Overall Score: ${Math.round(guidance.overallScore * 100)}%

### Actions:
${guidance.actions.map(action => `
- Type: ${action.type}
  - Priority: ${action.priority}
  - Confidence: ${action.confidence}
  - Impact: ${action.impact}
  - Description: ${action.description}
`).join('\n')}

### Metrics:
${Object.entries(guidance.metrics).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
`;

    await emitSystemLog('refinement-guidance', {
      path: '/refinement-guidance.log.md',
      content: logEntry
    });
  }

  /**
   * Format guidance as Markdown
   */
  private formatGuidanceMarkdown(guidance: PromptGuidance): string {
    return `# Refinement Guidance for ${guidance.promptPath}

## Overview
- Version: ${guidance.version}
- Last Updated: ${guidance.lastUpdated}
- Overall Score: ${Math.round(guidance.overallScore * 100)}%

## Summary
${guidance.summary}

## Detailed Actions
${guidance.actions.map(action => `
### ${action.type} (${action.priority} priority)
- Confidence: ${Math.round(action.confidence * 100)}%
- Impact: ${Math.round(action.impact * 100)}%
- Description: ${action.description}
- Rationale: ${action.rationale}

#### Examples:
${action.examples.map(ex => `- ${ex}`).join('\n')}
`).join('\n')}

## Metrics
${Object.entries(guidance.metrics).map(([key, value]) => `- ${key}: ${Math.round(value * 100)}%`).join('\n')}
`;
  }

  /**
   * Calculate action impact
   */
  private calculateActionImpact(recommendation: any): number {
    // In real implementation, this would use more sophisticated analysis
    return recommendation.confidence * 0.8;
  }

  /**
   * Generate action description
   */
  private generateActionDescription(recommendation: any): string {
    return `Improve ${recommendation.type} by applying proven patterns with ${Math.round(recommendation.confidence * 100)}% confidence.`;
  }

  /**
   * Get priority weight
   */
  private getPriorityWeight(priority: 'low' | 'medium' | 'high'): number {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
    }
  }
} 