import { EvolutionDriverConfig, SystemMetrics, ImprovementProposal, PatternAnalysis } from '../types';
import { PatternAnalyzer } from './pattern-analyzer';
import { QualityTracker } from './quality-tracker';
import { RefactorProposer } from './refactor-proposer';

export class EvolutionDriver {
  private config: EvolutionDriverConfig;
  private patternAnalyzer: PatternAnalyzer;
  private qualityTracker: QualityTracker;
  private refactorProposer: RefactorProposer;
  private metrics: {
    proposalsGenerated: number;
    proposalsApplied: number;
    qualityImprovements: number;
    patternsIdentified: number;
    learningOpportunities: number;
    timestamp: Date;
  };

  constructor(config: EvolutionDriverConfig) {
    this.config = config;
    // Use static/test values for SystemMetrics for now
    const defaultMetrics: SystemMetrics = {
      codeQuality: 0.8,
      testCoverage: 0.75,
      performance: 0.9,
      maintainability: 0.85,
      timestamp: new Date()
    };
    this.patternAnalyzer = new PatternAnalyzer(defaultMetrics);
    this.qualityTracker = new QualityTracker(config.minQualityThreshold);
    this.refactorProposer = new RefactorProposer(defaultMetrics, config.maxRefactoringComplexity);

    this.metrics = {
      proposalsGenerated: 0,
      proposalsApplied: 0,
      qualityImprovements: 0,
      patternsIdentified: 0,
      learningOpportunities: 0,
      timestamp: new Date()
    };
  }

  public getConfig(): EvolutionDriverConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<EvolutionDriverConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public async analyzeCodebase(codebase: string[]): Promise<{
    patterns: Map<string, PatternAnalysis>;
    metrics: SystemMetrics;
  }> {
    const patterns = await this.patternAnalyzer.analyzePatterns(codebase);
    const metrics = await this.trackQuality(codebase);
    return { patterns, metrics };
  }

  public async analyzeSystem(codebase: string[]): Promise<ImprovementProposal[]> {
    if (!this.config.patternRecognitionEnabled) {
      return [];
    }

    const { patterns } = await this.analyzeCodebase(codebase);
    const proposals = await this.refactorProposer.generateProposals(patterns);
    
    this.metrics.proposalsGenerated += proposals.length;
    this.metrics.patternsIdentified += patterns.size;
    
    return proposals;
  }

  public async generateProposals(codebase: string[]): Promise<ImprovementProposal[]> {
    const { patterns } = await this.analyzeCodebase(codebase);
    return this.refactorProposer.generateProposals(patterns);
  }

  public async trackQuality(codebase: string[]): Promise<SystemMetrics> {
    // Use static/test values for SystemMetrics for now
    const metrics: SystemMetrics = {
      codeQuality: 0.8,
      testCoverage: 0.75,
      performance: 0.9,
      maintainability: 0.85,
      timestamp: new Date()
    };
    this.qualityTracker.trackMetrics(metrics);
    return metrics;
  }

  public getMetrics(): typeof this.metrics {
    return this.metrics;
  }

  public getMetricsBelowThreshold(): string[] {
    const belowThreshold: string[] = [];
    const metrics = this.qualityTracker.getTrends();

    for (const metric of metrics) {
      if (metric.trend === 'degrading' && metric.confidence > 0.8) {
        belowThreshold.push(metric.metric);
      }
    }

    return belowThreshold;
  }
} 