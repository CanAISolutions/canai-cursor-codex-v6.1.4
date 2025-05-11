/**
 * output-delta-intelligence.ts
 * 
 * Purpose: Analyze historical deltas to provide predictive refinement guidance.
 * Triggered: After delta ingestion, during refinement planning, or on demand.
 * Enforces: Pattern-based learning, confidence-weighted guidance, and predictive refinement.
 */

import { EventBus } from '../../event-bus/eventBus';
import { emitSystemLog } from '../../system-intel/audit-utils';
import { RevisionTrigger } from '../self-refine/self-refine-trigger';
import { PromptVersion } from '../prompt-evolution/prompt-memory-layer';
import * as fs from 'fs/promises';
import * as path from 'path';

interface DeltaPattern {
  type: 'clarity' | 'empathy' | 'trust' | 'structure' | 'tone';
  confidence: number;
  frequency: number;
  impact: number;
  examples: Array<{
    before: string;
    after: string;
    metrics: {
      clarity: number;
      empathy: number;
      trust: number;
    };
  }>;
}

interface RefinementGuide {
  promptPath: string;
  version: string;
  confidence: number;
  patterns: DeltaPattern[];
  recommendations: Array<{
    type: string;
    priority: 'low' | 'medium' | 'high';
    confidence: number;
    rationale: string;
    examples: string[];
  }>;
  metrics: {
    clarity: number;
    empathy: number;
    trust: number;
    emotionalResonance: number;
  };
}

interface DeltaCluster {
  type: string;
  patterns: DeltaPattern[];
  confidence: number;
  impact: number;
  frequency: number;
}

export class OutputDeltaIntelligence {
  private eventBus: EventBus;
  private readonly DELTA_LOG_DIR = '/delta-logs';
  private readonly PATTERN_DIR = '/output-intel/patterns';
  private readonly GUIDE_DIR = '/output-intel/guides';
  private readonly MIN_CONFIDENCE = 0.7;
  private readonly MIN_FREQUENCY = 3;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.initializeEventListeners();
  }

  /**
   * Initialize event listeners
   */
  private initializeEventListeners(): void {
    this.eventBus.on('DELTA_INGESTED', this.handleDeltaIngestion.bind(this));
    this.eventBus.on('REFINEMENT_REQUESTED', this.generateRefinementGuide.bind(this));
  }

  /**
   * Handle new delta ingestion
   */
  async handleDeltaIngestion(delta: any): Promise<void> {
    try {
      // Parse and analyze delta
      const patterns = await this.analyzeDelta(delta);
      
      // Update pattern clusters
      await this.updatePatternClusters(patterns);
      
      // Generate new refinement guides if needed
      await this.updateRefinementGuides(delta.promptPath);
      
      // Log analysis
      await this.logDeltaAnalysis(delta, patterns);
    } catch (error) {
      console.error('Failed to handle delta ingestion:', error);
      throw error;
    }
  }

  /**
   * Analyze delta for patterns
   */
  private async analyzeDelta(delta: any): Promise<DeltaPattern[]> {
    const patterns: DeltaPattern[] = [];
    
    // Analyze clarity patterns
    if (delta.metrics?.clarity) {
      patterns.push(await this.analyzeClarityPattern(delta));
    }
    
    // Analyze empathy patterns
    if (delta.metrics?.empathy) {
      patterns.push(await this.analyzeEmpathyPattern(delta));
    }
    
    // Analyze trust patterns
    if (delta.metrics?.trust) {
      patterns.push(await this.analyzeTrustPattern(delta));
    }
    
    // Analyze structure patterns
    if (delta.diff?.structure) {
      patterns.push(await this.analyzeStructurePattern(delta));
    }
    
    // Analyze tone patterns
    if (delta.diff?.tone) {
      patterns.push(await this.analyzeTonePattern(delta));
    }

    return patterns.filter(p => p.confidence >= this.MIN_CONFIDENCE);
  }

  /**
   * Analyze clarity pattern
   */
  private async analyzeClarityPattern(delta: any): Promise<DeltaPattern> {
    const clarityImpact = delta.metrics.clarity.after - delta.metrics.clarity.before;
    const confidence = this.calculateConfidence(delta, 'clarity');
    
    return {
      type: 'clarity',
      confidence,
      frequency: 1,
      impact: clarityImpact,
      examples: [{
        before: delta.diff.before,
        after: delta.diff.after,
        metrics: delta.metrics
      }]
    };
  }

  /**
   * Analyze empathy pattern
   */
  private async analyzeEmpathyPattern(delta: any): Promise<DeltaPattern> {
    const empathyImpact = delta.metrics.empathy.after - delta.metrics.empathy.before;
    const confidence = this.calculateConfidence(delta, 'empathy');
    
    return {
      type: 'empathy',
      confidence,
      frequency: 1,
      impact: empathyImpact,
      examples: [{
        before: delta.diff.before,
        after: delta.diff.after,
        metrics: delta.metrics
      }]
    };
  }

  /**
   * Analyze trust pattern
   */
  private async analyzeTrustPattern(delta: any): Promise<DeltaPattern> {
    const trustImpact = delta.metrics.trust.after - delta.metrics.trust.before;
    const confidence = this.calculateConfidence(delta, 'trust');
    
    return {
      type: 'trust',
      confidence,
      frequency: 1,
      impact: trustImpact,
      examples: [{
        before: delta.diff.before,
        after: delta.diff.after,
        metrics: delta.metrics
      }]
    };
  }

  /**
   * Analyze structure pattern
   */
  private async analyzeStructurePattern(delta: any): Promise<DeltaPattern> {
    const structureImpact = this.calculateStructureImpact(delta.diff.structure);
    const confidence = this.calculateConfidence(delta, 'structure');
    
    return {
      type: 'structure',
      confidence,
      frequency: 1,
      impact: structureImpact,
      examples: [{
        before: delta.diff.before,
        after: delta.diff.after,
        metrics: delta.metrics
      }]
    };
  }

  /**
   * Analyze tone pattern
   */
  private async analyzeTonePattern(delta: any): Promise<DeltaPattern> {
    const toneImpact = this.calculateToneImpact(delta.diff.tone);
    const confidence = this.calculateConfidence(delta, 'tone');
    
    return {
      type: 'tone',
      confidence,
      frequency: 1,
      impact: toneImpact,
      examples: [{
        before: delta.diff.before,
        after: delta.diff.after,
        metrics: delta.metrics
      }]
    };
  }

  /**
   * Update pattern clusters
   */
  private async updatePatternClusters(newPatterns: DeltaPattern[]): Promise<void> {
    for (const pattern of newPatterns) {
      const clusterPath = `${this.PATTERN_DIR}/${pattern.type}.json`;
      let cluster: DeltaCluster;

      try {
        const content = await fs.readFile(clusterPath, 'utf8');
        cluster = JSON.parse(content);
      } catch {
        cluster = {
          type: pattern.type,
          patterns: [],
          confidence: 0,
          impact: 0,
          frequency: 0
        };
      }

      // Update cluster with new pattern
      cluster.patterns.push(pattern);
      cluster.frequency += 1;
      cluster.confidence = this.calculateClusterConfidence(cluster);
      cluster.impact = this.calculateClusterImpact(cluster);

      // Save updated cluster
      await fs.writeFile(clusterPath, JSON.stringify(cluster, null, 2));
    }
  }

  /**
   * Generate refinement guide
   */
  async generateRefinementGuide(request: { promptPath: string; version: string }): Promise<RefinementGuide> {
    try {
      // Get relevant patterns
      const patterns = await this.getRelevantPatterns(request.promptPath);
      
      // Generate recommendations
      const recommendations = await this.generateRecommendations(patterns);
      
      // Calculate overall confidence
      const confidence = this.calculateGuideConfidence(patterns, recommendations);
      
      // Create guide
      const guide: RefinementGuide = {
        promptPath: request.promptPath,
        version: request.version,
        confidence,
        patterns,
        recommendations,
        metrics: await this.calculateGuideMetrics(patterns)
      };

      // Save guide
      await this.saveRefinementGuide(guide);
      
      // Log guide generation
      await this.logGuideGeneration(guide);

      return guide;
    } catch (error) {
      console.error('Failed to generate refinement guide:', error);
      throw error;
    }
  }

  /**
   * Get relevant patterns for prompt
   */
  private async getRelevantPatterns(promptPath: string): Promise<DeltaPattern[]> {
    const patterns: DeltaPattern[] = [];
    const patternFiles = await fs.readdir(this.PATTERN_DIR);

    for (const file of patternFiles) {
      const content = await fs.readFile(path.join(this.PATTERN_DIR, file), 'utf8');
      const cluster: DeltaCluster = JSON.parse(content);

      // Filter patterns by confidence and frequency
      const relevantPatterns = cluster.patterns.filter(
        p => p.confidence >= this.MIN_CONFIDENCE && p.frequency >= this.MIN_FREQUENCY
      );

      patterns.push(...relevantPatterns);
    }

    return patterns;
  }

  /**
   * Generate recommendations from patterns
   */
  private async generateRecommendations(patterns: DeltaPattern[]): Promise<RefinementGuide['recommendations']> {
    const recommendations: RefinementGuide['recommendations'] = [];

    for (const pattern of patterns) {
      if (pattern.impact > 0) {
        recommendations.push({
          type: pattern.type,
          priority: this.determinePriority(pattern),
          confidence: pattern.confidence,
          rationale: this.generateRationale(pattern),
          examples: pattern.examples.map(e => e.after)
        });
      }
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Save refinement guide
   */
  private async saveRefinementGuide(guide: RefinementGuide): Promise<void> {
    const guidePath = `${this.GUIDE_DIR}/${guide.promptPath}/${guide.version}.json`;
    await fs.writeFile(guidePath, JSON.stringify(guide, null, 2));
  }

  /**
   * Log guide generation
   */
  private async logGuideGeneration(guide: RefinementGuide): Promise<void> {
    const logEntry = `
## [${new Date().toISOString()}] Refinement Guide Generated

### Prompt: ${guide.promptPath}
- Version: ${guide.version}
- Confidence: ${guide.confidence}

### Recommendations:
${guide.recommendations.map(rec => `
- Type: ${rec.type}
  - Priority: ${rec.priority}
  - Confidence: ${rec.confidence}
  - Rationale: ${rec.rationale}
`).join('\n')}

### Metrics:
${Object.entries(guide.metrics).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
`;

    await emitSystemLog('refinement-guide', {
      path: '/refinement-guides.log.md',
      content: logEntry
    });
  }

  /**
   * Calculate confidence for pattern
   */
  private calculateConfidence(delta: any, type: string): number {
    // In real implementation, this would use more sophisticated analysis
    return 0.85;
  }

  /**
   * Calculate structure impact
   */
  private calculateStructureImpact(structure: any): number {
    // In real implementation, this would analyze structural changes
    return 0.5;
  }

  /**
   * Calculate tone impact
   */
  private calculateToneImpact(tone: any): number {
    // In real implementation, this would analyze tone changes
    return 0.5;
  }

  /**
   * Calculate cluster confidence
   */
  private calculateClusterConfidence(cluster: DeltaCluster): number {
    return cluster.patterns.reduce((sum, p) => sum + p.confidence, 0) / cluster.patterns.length;
  }

  /**
   * Calculate cluster impact
   */
  private calculateClusterImpact(cluster: DeltaCluster): number {
    return cluster.patterns.reduce((sum, p) => sum + p.impact, 0) / cluster.patterns.length;
  }

  /**
   * Calculate guide confidence
   */
  private calculateGuideConfidence(
    patterns: DeltaPattern[],
    recommendations: RefinementGuide['recommendations']
  ): number {
    const patternConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
    const recommendationConfidence = recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length;
    return (patternConfidence + recommendationConfidence) / 2;
  }

  /**
   * Calculate guide metrics
   */
  private async calculateGuideMetrics(patterns: DeltaPattern[]): Promise<RefinementGuide['metrics']> {
    // In real implementation, this would use more sophisticated analysis
    return {
      clarity: 0.85,
      empathy: 0.8,
      trust: 0.9,
      emotionalResonance: 0.85
    };
  }

  /**
   * Determine recommendation priority
   */
  private determinePriority(pattern: DeltaPattern): 'low' | 'medium' | 'high' {
    if (pattern.confidence >= 0.9 && pattern.impact >= 0.7) return 'high';
    if (pattern.confidence >= 0.8 && pattern.impact >= 0.5) return 'medium';
    return 'low';
  }

  /**
   * Generate recommendation rationale
   */
  private generateRationale(pattern: DeltaPattern): string {
    return `Based on ${pattern.frequency} successful applications with ${Math.round(pattern.confidence * 100)}% confidence and ${Math.round(pattern.impact * 100)}% impact.`;
  }

  /**
   * Update refinement guides for prompt
   */
  private async updateRefinementGuides(promptPath: string): Promise<void> {
    try {
      // Get current version
      const version = await this.getCurrentVersion(promptPath);
      
      // Generate new guide
      await this.generateRefinementGuide({ promptPath, version });
    } catch (error) {
      console.error('Failed to update refinement guides:', error);
      throw error;
    }
  }

  /**
   * Log delta analysis
   */
  private async logDeltaAnalysis(delta: any, patterns: DeltaPattern[]): Promise<void> {
    const logEntry = `
## [${new Date().toISOString()}] Delta Analysis

### Prompt: ${delta.promptPath}
- Version: ${delta.version}

### Patterns Found:
${patterns.map(pattern => `
- Type: ${pattern.type}
  - Confidence: ${pattern.confidence}
  - Impact: ${pattern.impact}
  - Frequency: ${pattern.frequency}
`).join('\n')}

### Metrics:
${Object.entries(delta.metrics).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
`;

    await emitSystemLog('delta-analysis', {
      path: '/delta-analysis.log.md',
      content: logEntry
    });
  }

  /**
   * Get current version for prompt
   */
  private async getCurrentVersion(promptPath: string): Promise<string> {
    const metadataPath = `${this.PATTERN_DIR}/${promptPath}/version-metadata.json`;
    try {
      const content = await fs.readFile(metadataPath, 'utf8');
      const metadata = JSON.parse(content);
      return metadata.currentVersion;
    } catch {
      return 'v1.0.0';
    }
  }
} 