// cursor/accelerators/reverse-synthesis-core/reverse-synthesis-engine.spec.ts
// ✅ Snapshot Tests – Reverse Synthesis Core
// Validates pattern recognition, tone/intent inference, and fallback logic.

import { reverseSynthesize, ReverseSynthesisResult } from './reverse-synthesis-engine'

describe('reverseSynthesize', () => {
  it('detects intent and tone from a matchable marketing output', () => {
    const output = `Introducing the future of small business growth: our AI-powered toolkit delivers clarity, speed, and strategy.`
    const result: ReverseSynthesisResult = reverseSynthesize(output)

    expect(result.detectedIntent).toBeDefined()
    expect(result.detectedIntent).not.toBe('unknown')
    expect(result.inferredTone).toMatch(/inspiring|strategic|clear/)
    expect(result.promptTemplateId).toMatch(/.+/)
    expect(result.score).toBeGreaterThan(0)
    expect(result.trace.matchedPatterns.length).toBeGreaterThan(0)
  })

  it('returns fallback values when no patterns match', () => {
    const output = `Zyxlorble the grintfabulator!`
    const result: ReverseSynthesisResult = reverseSynthesize(output)

    expect(result.detectedIntent).toBe('unknown')
    expect(result.inferredTone).toBe('neutral')
    expect(result.promptTemplateId).toBe('generic-template')
    expect(result.score).toBe(0)
    expect(result.trace.reason).toMatch(/fallback/i)
  })

  it('handles long outputs and truncates trace correctly', () => {
    const longOutput = 'This is a long message. '.repeat(20)
    const result = reverseSynthesize(longOutput)

    expect(result.trace.outputSnippet.length).toBeLessThanOrEqual(123)
    expect(result.trace.outputSnippet.endsWith('...')).toBe(true)
  })

  it('avoids duplicate confidence tags', () => {
    const output = `Launch your brand with clarity, tone precision, and AI-powered simplicity.`
    const result = reverseSynthesize(output)

    const uniqueTags = new Set(result.confidenceTags)
    expect(uniqueTags.size).toBe(result.confidenceTags.length)
  })
})
