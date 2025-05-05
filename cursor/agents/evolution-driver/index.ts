/**
 * @file index.ts
 * @description Main evolution driver class that orchestrates system evolution
 */

import { EvolutionDriverConfig, SystemMetrics, ImprovementProposal, EvolutionMetrics } from './types';
import { PatternAnalyzer } from './core/pattern-analyzer';
import { RefactorProposer } from './core/refactor-proposer';
import { QualityTracker } from './core/quality-tracker';

export class EvolutionDriver {
  private config: EvolutionDriverConfig;
  private patternAnalyzer!: PatternAnalyzer;
  private refactorProposer!: RefactorProposer;
  private qualityTracker!: QualityTracker;
  private metrics!: EvolutionMetrics;

  constructor(config: EvolutionDriverConfig) {
    this.config = config;
    this.initializeComponents();
    this.initializeMetrics();
  }

  /**
   * Analyzes the system and generates improvement proposals
   * @param codebase Current codebase to analyze
   * @returns Array of improvement proposals
   */
  public async analyzeSystem(codebase: string[]): Promise<ImprovementProposal[]> {
    try {
      // Update metrics
      const systemMetrics = await this.collectSystemMetrics();
      this.updateMetrics(systemMetrics);

      // Analyze patterns if enabled
      let patterns = new Map();
      if (this.config.patternRecognitionEnabled) {
        patterns = await this.patternAnalyzer.analyzePatterns(codebase);
      }

      // Generate proposals if enabled
      let proposals: ImprovementProposal[] = [];
      if (this.config.refactoringEnabled) {
        proposals = await this.refactorProposer.generateProposals(patterns);
      }

      // Update evolution metrics
      this.updateEvolutionMetrics(proposals);

      return proposals;
    } catch (error) {
      console.error('Error analyzing system:', error);
      throw new Error('System analysis failed');
    }
  }

  /**
   * Gets current evolution metrics
   * @returns Evolution metrics
   */
  public getMetrics(): EvolutionMetrics {
    return this.metrics;
  }

  /**
   * Gets metrics below quality threshold
   * @returns Array of metrics below threshold
   */
  public getMetricsBelowThreshold(): string[] {
    return this.qualityTracker.getMetricsBelowThreshold();
  }

  /**
   * Updates configuration
   * @param config New configuration
   */
  public updateConfig(config: Partial<EvolutionDriverConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Initializes component classes
   */
  private initializeComponents(): void {
    const initialMetrics: SystemMetrics = {
      codeQuality: 0.8,
      testCoverage: 0.8,
      performance: 0.8,
      maintainability: 0.8,
      timestamp: new Date()
    };

    this.patternAnalyzer = new PatternAnalyzer(initialMetrics);
    this.refactorProposer = new RefactorProposer(initialMetrics, this.config.maxRefactoringComplexity);
    this.qualityTracker = new QualityTracker(this.config.minQualityThreshold);
  }

  /**
   * Initializes evolution metrics
   */
  private initializeMetrics(): void {
    this.metrics = {
      proposalsGenerated: 0,
      proposalsApplied: 0,
      qualityImprovements: 0,
      patternsIdentified: 0,
      learningOpportunities: 0,
      timestamp: new Date()
    };
  }

  /**
   * Collects current system metrics
   * @returns System metrics
   */
  private async collectSystemMetrics(): Promise<SystemMetrics> {
    // TODO: Implement actual metric collection
    // This would include:
    // 1. Code quality analysis
    // 2. Test coverage calculation
    // 3. Performance measurement
    // 4. Maintainability assessment

    return {
      codeQuality: 0.8,
      testCoverage: 0.8,
      performance: 0.8,
      maintainability: 0.8,
      timestamp: new Date()
    };
  }

  /**
   * Updates metrics across all components
   * @param metrics New system metrics
   */
  private updateMetrics(metrics: SystemMetrics): void {
    this.patternAnalyzer.updateMetrics(metrics);
    this.refactorProposer.updateMetrics(metrics);
    this.qualityTracker.updateMetrics(metrics);
  }

  /**
   * Updates evolution metrics based on analysis results
   * @param proposals Generated improvement proposals
   */
  private updateEvolutionMetrics(proposals: ImprovementProposal[]): void {
    this.metrics.proposalsGenerated += proposals.length;
    this.metrics.timestamp = new Date();
  }
} 