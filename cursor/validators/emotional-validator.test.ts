import { EmotionalValidator } from './emotional-validator';

describe('EmotionalValidator', () => {
  const validator = new EmotionalValidator();

  // What: Validates correct event structure
  it('should validate a correct event', async () => {
    const event = { type: 'message', content: 'Hello', score: 0.9 };
    const score = await validator.validateEvent(event);
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThan(0);
  });

  // What: Handles null input gracefully
  it('should fallback on null input', async () => {
    const result = await validator.validateEvent(null as any);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(1.0);
  });

  // What: Handles malformed input (missing fields)
  it('should fallback on missing fields', async () => {
    const event = { type: 'message' };
    const result = await validator.validateEvent(event as any);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(1.0);
  });

  // What: Handles chaos/edge-case (unexpected types)
  it('should fallback on unexpected types', async () => {
    const event = 42;
    const result = await validator.validateEvent(event as any);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(1.0);
  });

  // What: Snapshot output for valid and fallback cases
  it('should match snapshot for valid and fallback', async () => {
    const valid = { type: 'message', content: 'Hi', score: 0.8 };
    const invalid = { foo: 'bar' };
    expect(await validator.validateEvent(valid)).toMatchSnapshot('valid-event');
    expect(await validator.validateEvent(invalid as any)).toMatchSnapshot('fallback-event');
  });

  // What: Validate emotional tone (whitelisted and non-whitelisted)
  it('should validate whitelisted tone', async () => {
    const score = await validator.validateEmotionalTone('empathetic');
    expect(score).toBeGreaterThan(0.5);
  });

  it('should fallback on non-whitelisted tone', async () => {
    const score = await validator.validateEmotionalTone('hostile');
    expect(score).toBeLessThan(0.5);
  });
}); 