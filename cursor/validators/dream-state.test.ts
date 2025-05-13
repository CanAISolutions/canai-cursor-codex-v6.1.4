import { DreamStateChecker } from './dream-state';

describe('DreamStateChecker', () => {
  let checker: DreamStateChecker;

  beforeEach(() => {
    checker = new DreamStateChecker();
  });

  // What: Validates dream state alignment for a valid result
  it('should validate dream state alignment for valid result', async () => {
    const result = {
      message: 'Empowerment and progress achieved through emotional partnership and clarity.'
    };
    const isAligned = await checker.validate(result);
    expect(isAligned).toBe(true);
  });

  // What: Handles null input gracefully
  it('should fallback to false for null input', async () => {
    const isAligned = await checker.validate(null as any);
    expect(isAligned).toBe(false);
  });

  // What: Handles malformed input (missing indicators)
  it('should fallback to false for missing indicators', async () => {
    const result = { message: 'This is a generic message.' };
    const isAligned = await checker.validate(result);
    expect(isAligned).toBe(false);
  });

  // What: Handles chaos/edge-case (unexpected types)
  it('should fallback to false for chaos input', async () => {
    const isAligned = await checker.validate(42 as any);
    expect(isAligned).toBe(false);
  });

  // What: Snapshot output for valid and fallback cases
  it('should match snapshot for valid and fallback', async () => {
    const valid = { message: 'Empowerment and progress achieved through emotional partnership and clarity.' };
    const invalid = { message: 'No dream state here.' };
    expect(await checker.validate(valid)).toMatchSnapshot('valid-dream-state');
    expect(await checker.validate(invalid)).toMatchSnapshot('fallback-dream-state');
  });
}); 