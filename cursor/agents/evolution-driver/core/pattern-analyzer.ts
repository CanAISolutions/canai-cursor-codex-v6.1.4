/**
 * @file core/pattern-analyzer.ts
 * @description Pattern analyzer for identifying code patterns and improvement opportunities
 */

import { SystemMetrics, PatternAnalysis } from '../types';

export class PatternAnalyzer {
  private metrics: SystemMetrics;

  constructor(metrics: SystemMetrics) {
    this.metrics = metrics;
  }

  /**
   * Analyzes code patterns across the codebase
   * @param codebase The codebase to analyze
   * @returns Map of identified patterns and their analysis
   */
  public async analyzePatterns(codebase: string[]): Promise<Map<string, PatternAnalysis>> {
    if (!Array.isArray(codebase) || codebase.length === 0) {
      throw new Error('Invalid codebase format: Expected non-empty array of strings');
    }

    const patterns = new Map<string, PatternAnalysis>();

    for (const file of codebase) {
      // Analyze function patterns
      const functionPatterns = this.analyzeFunctionPatterns(file);
      for (const [pattern, analysis] of functionPatterns) {
        const existing = patterns.get(pattern);
        if (existing) {
          existing.occurrences += analysis.occurrences;
          existing.files.push(...analysis.files);
          existing.impact = Math.max(existing.impact, analysis.impact);
          existing.suggestions.push(...analysis.suggestions);
        } else {
          patterns.set(pattern, analysis);
        }
      }

      // Analyze class patterns
      const classPatterns = this.analyzeClassPatterns(file);
      for (const [pattern, analysis] of classPatterns) {
        const existing = patterns.get(pattern);
        if (existing) {
          existing.occurrences += analysis.occurrences;
          existing.files.push(...analysis.files);
          existing.impact = Math.max(existing.impact, analysis.impact);
          existing.suggestions.push(...analysis.suggestions);
        } else {
          patterns.set(pattern, analysis);
        }
      }

      // Analyze arrow function patterns
      const arrowPatterns = this.analyzeArrowFunctionPatterns(file);
      for (const [pattern, analysis] of arrowPatterns) {
        const existing = patterns.get(pattern);
        if (existing) {
          existing.occurrences += analysis.occurrences;
          existing.files.push(...analysis.files);
          existing.impact = Math.max(existing.impact, analysis.impact);
          existing.suggestions.push(...analysis.suggestions);
        } else {
          patterns.set(pattern, analysis);
        }
      }
    }

    if (patterns.size === 0) {
      throw new Error('No patterns found in codebase');
    }

    return patterns;
  }

  private analyzeFunctionPatterns(file: string): Map<string, PatternAnalysis> {
    const patterns = new Map<string, PatternAnalysis>();
    const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*{/g;
    let match;

    while ((match = functionRegex.exec(file)) !== null) {
      const pattern = 'function-declaration';
      const analysis: PatternAnalysis = {
        occurrences: 1,
        files: [file],
        impact: 0.5,
        suggestions: [
          'Consider using arrow functions for better lexical scoping',
          'Add JSDoc comments for better documentation',
          'Consider breaking down large functions into smaller ones'
        ]
      };
      patterns.set(pattern, analysis);
    }

    return patterns;
  }

  private analyzeClassPatterns(file: string): Map<string, PatternAnalysis> {
    const patterns = new Map<string, PatternAnalysis>();
    const classRegex = /class\s+(\w+)\s*(?:extends\s+\w+)?\s*{/g;
    let match;

    while ((match = classRegex.exec(file)) !== null) {
      const pattern = 'class-declaration';
      const analysis: PatternAnalysis = {
        occurrences: 1,
        files: [file],
        impact: 0.7,
        suggestions: [
          'Consider using composition over inheritance',
          'Add proper access modifiers',
          'Implement interface contracts'
        ]
      };
      patterns.set(pattern, analysis);
    }

    return patterns;
  }

  private analyzeArrowFunctionPatterns(file: string): Map<string, PatternAnalysis> {
    const patterns = new Map<string, PatternAnalysis>();
    const arrowRegex = /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g;
    let match;

    while ((match = arrowRegex.exec(file)) !== null) {
      const pattern = 'arrow-function';
      const analysis: PatternAnalysis = {
        occurrences: 1,
        files: [file],
        impact: 0.3,
        suggestions: [
          'Consider adding type annotations',
          'Break down complex arrow functions',
          'Add error handling'
        ]
      };
      patterns.set(pattern, analysis);
    }

    return patterns;
  }

  public getMetrics(): SystemMetrics {
    return this.metrics;
  }

  /**
   * Updates system metrics for impact calculation
   * @param metrics New system metrics
   */
  public updateMetrics(newMetrics: SystemMetrics): void {
    this.metrics = newMetrics;
  }

  /**
   * Detects changes between pattern sets
   */
  public detectPatternChanges(
    oldPatterns: Map<string, PatternAnalysis>,
    newPatterns: Map<string, PatternAnalysis>
  ): Map<string, number> {
    const changes = new Map<string, number>();

    // Get all unique keys from both maps
    const allKeys = new Set([...oldPatterns.keys(), ...newPatterns.keys()]);

    for (const key of allKeys) {
      const oldCount = oldPatterns.get(key)?.occurrences || 0;
      const newCount = newPatterns.get(key)?.occurrences || 0;
      const difference = newCount - oldCount;

      if (difference !== 0) {
        changes.set(key, difference);
      }
    }

    return changes;
  }
} 