import { SchemaEngine } from './schema-engine';
import { EmotionalValidator } from '../validators/emotional-validator';

describe('SchemaEngine', () => {
  let engine: SchemaEngine;
  let mockEmotionalValidator: EmotionalValidator;

  beforeEach(() => {
    mockEmotionalValidator = {
      validateEvent: jest.fn().mockResolvedValue(4.5),
      validateMessage: jest.fn().mockResolvedValue(4.5),
      validateContent: jest.fn().mockResolvedValue(4.5),
      validateScore: jest.fn().mockResolvedValue(4.5),
      validateSession: jest.fn().mockResolvedValue(4.5),
      validateResponse: jest.fn().mockResolvedValue(4.5),
      validateEmotionalTone: jest.fn().mockResolvedValue(0.8)
    } as any;
    engine = new SchemaEngine(mockEmotionalValidator);
  });

  // What: Validates structureIntent with valid interpreted input
  it('should structure valid interpreted intent', async () => {
    const interpreted = {
      businessType: 'SaaS',
      primaryGoal: 'Grow users',
      tone: 'professional',
      challenges: ['competition'],
      motivator: 'impact',
      confidence: 0.9,
      modelTier: 'rules' as const
    };
    const result = await engine.structureIntent(interpreted);
    expect(result._meta.validationPassed).toBe(true);
    expect(result.business_type.value).toBe('SaaS');
  });

  // What: Handles null input gracefully
  it('should fallback for null input', async () => {
    // @ts-ignore
    const result = await engine.structureIntent(null);
    expect(result._meta.validationPassed).toBe(false);
  });

  // What: Handles malformed input (missing fields)
  it('should fallback for missing fields', async () => {
    const interpreted = { businessType: '', primaryGoal: '', tone: '', challenges: [], motivator: '', confidence: 0.5, modelTier: 'rules' as const };
    const result = await engine.structureIntent(interpreted);
    expect(result._meta.validationPassed).toBe(false);
  });

  // What: Handles chaos/edge-case (unexpected types)
  it('should fallback for chaos input', async () => {
    // @ts-ignore
    const result = await engine.structureIntent(42);
    expect(result._meta.validationPassed).toBe(false);
  });

  // What: Snapshot output for valid and fallback cases
  it('should match snapshot for valid and fallback', async () => {
    const valid = {
      businessType: 'SaaS',
      primaryGoal: 'Grow users',
      tone: 'professional',
      challenges: ['competition'],
      motivator: 'impact',
      confidence: 0.9,
      modelTier: 'rules' as const
    };
    const invalid = { businessType: '', primaryGoal: '', tone: '', challenges: [], motivator: '', confidence: 0.5, modelTier: 'rules' as const };
    expect(await engine.structureIntent(valid)).toMatchSnapshot('valid-structured-intent');
    expect(await engine.structureIntent(invalid)).toMatchSnapshot('fallback-structured-intent');
  });
}); 