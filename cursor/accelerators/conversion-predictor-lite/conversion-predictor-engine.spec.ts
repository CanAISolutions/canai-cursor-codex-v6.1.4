// cursor/accelerators/conversion-predictor-lite/conversion-predictor-engine.spec.ts
// ✅ Snapshot Tests – Conversion Scoring Engine
// Verifies signal matching, score normalization, and verdict accuracy.

import { scoreConversionLikelihood, ConversionScoreResult } from './conversion-predictor-engine'

describe('scoreConversionLikelihood', () => {
  it('detects strong conversion signals in a call-to-action', () => {
    const output = `Get started today and take control of your business with confidence. Trusted by thousands.`
    const result: ConversionScoreResult = scoreConversionLikelihood(output)

    expect(result.score).toBeGreaterThanOrEqual(0.7)
    expect(result.verdict).toBe('strong')
    expect(result.matchedSignals.length).toBeGreaterThan(0)
    expect(result.riskFactors.length).toBe(0)
    expect(result.trace.reasoning).toMatch(/Matched/)
  })

  it('flags weak or passive phrasing as low conversion', () => {
    const output = `You could consider exploring options. Let me know if that helps.`
    const result: ConversionScoreResult = scoreConversionLikelihood(output)

    expect(result.score).toBeLessThanOrEqual(0.4)
    expect(result.verdict).toBe('weak')
    expect(result.riskFactors.length).toBeGreaterThan(0)
    expect(result.trace.reasoning).toMatch(/Negative/)
  })

  it('returns neutral verdict when no strong or weak signals present', () => {
    const output = `Here is the info you asked for.`
    const result = scoreConversionLikelihood(output)

    expect(result.verdict).toBe('neutral')
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(1)
    expect(result.matchedSignals.length).toBe(0)
    expect(result.riskFactors.length).toBe(0)
  })

  it('does not exceed score bounds', () => {
    const output = `Sign up now! Sign up now! Sign up now! Sign up now! Sign up now!`
    const result = scoreConversionLikelihood(output)

    expect(result.score).toBeLessThanOrEqual(1)
    expect(result.score).toBeGreaterThanOrEqual(0)
  })

  it('truncates trace snippet appropriately', () => {
    const longOutput = 'Act now and discover the benefits. '.repeat(10)
    const result = scoreConversionLikelihood(longOutput)

    expect(result.trace.snippet.length).toBeLessThanOrEqual(123)
    expect(result.trace.snippet.endsWith('...')).toBe(true)
  })
})
