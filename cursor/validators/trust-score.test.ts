import { TrustScoreCalculator } from './trust-score';

describe('TrustScoreCalculator', () => {
  let calculator: TrustScoreCalculator;

  beforeEach(() => {
    calculator = new TrustScoreCalculator();
  });

  // What: Validates trust score calculation with valid metrics
  it('should calculate trust score for valid metrics', async () => {
    const score = await calculator.calculateTrustScore();
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(5);
  });

  // What: Handles malformed metrics (missing fields)
  it('should fallback to 0 for malformed metrics', () => {
    // @ts-ignore
    const score = (calculator as any).computeTrustScore({});
    expect(typeof score).toBe('number');
    expect(score).toBe(0);
  });

  // What: Handles chaos/edge-case (unexpected types)
  it('should fallback to 0 for chaos input', () => {
    // @ts-ignore
    const score = (calculator as any).computeTrustScore(42);
    expect(typeof score).toBe('number');
    expect(score).toBe(0);
  });

  // What: Handles null input
  it('should fallback to 0 for null input', () => {
    // @ts-ignore
    const score = (calculator as any).computeTrustScore(null);
    expect(typeof score).toBe('number');
    expect(score).toBe(0);
  });

  // What: Snapshot output for valid and fallback cases
  it('should match snapshot for valid and fallback', async () => {
    const valid = { consistency: 4.5, reliability: 4.3, transparency: 4.0, safety: 4.8 };
    // @ts-ignore
    const validScore = (calculator as any).computeTrustScore(valid);
    // @ts-ignore
    const fallbackScore = (calculator as any).computeTrustScore({});
    expect(validScore).toMatchSnapshot('valid-metrics');
    expect(fallbackScore).toMatchSnapshot('fallback-metrics');
  });

  // What: Validate trust score threshold logic
  it('should validate trust score above threshold', async () => {
    const result = await calculator.validateTrustScore(4.5);
    expect(result).toBe(true);
  });

  it('should invalidate trust score below threshold', async () => {
    const result = await calculator.validateTrustScore(3.9);
    expect(result).toBe(false);
  });
}); 