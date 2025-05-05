import { TrustScore, TrustScoreFactors, TrustLevel } from './types';

export class TrustScorer {
  private readonly weights = {
    codeQuality: 0.4,
    testCoverage: 0.3,
    documentation: 0.2,
    maintainability: 0.1
  };

  /**
   * Calculates a trust score based on various code quality factors
   * @param factors The input factors to calculate the trust score from
   * @returns A TrustScore object containing the calculated score and metadata
   */
  public calculateTrustScore(factors: TrustScoreFactors): TrustScore {
    const score = this.calculateWeightedScore(factors);
    const confidence = this.calculateConfidence(factors);

    return {
      score,
      confidence,
      factors,
      timestamp: new Date()
    };
  }

  /**
   * Gets the trust level based on a score
   * @param score The trust score to evaluate
   * @returns The trust level (high, medium, or low)
   */
  public getTrustLevel(score: number): TrustLevel {
    if (score >= 0.8) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  }

  private calculateWeightedScore(factors: TrustScoreFactors): number {
    return (
      factors.codeQuality * this.weights.codeQuality +
      factors.testCoverage * this.weights.testCoverage +
      factors.documentation * this.weights.documentation +
      factors.maintainability * this.weights.maintainability
    );
  }

  private calculateConfidence(factors: TrustScoreFactors): number {
    // Simple confidence calculation based on how many factors are non-zero
    const nonZeroFactors = Object.values(factors).filter(v => v > 0).length;
    return nonZeroFactors / Object.keys(factors).length;
  }
} 