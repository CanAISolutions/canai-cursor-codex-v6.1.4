import { MotivationHook } from './motivation-hook';
import { StructuredIntent } from './schema-engine';

const mockEventBus = {
  emit: jest.fn().mockResolvedValue(undefined),
  on: jest.fn()
};

jest.mock('../event-bus/eventBus', () => ({
  EventBus: { getInstance: () => mockEventBus }
}));

describe('MotivationHook', () => {
  let hook: MotivationHook;
  let validIntent: StructuredIntent;

  beforeEach(() => {
    hook = new MotivationHook({ minConfidence: 0.8, requireEmotionalAnchor: true, maxHookLength: 200 });
    validIntent = {
      business_type: { value: 'SaaS', confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      primary_goal: { value: 'Grow users', confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      tone: { value: 'professional', confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      challenges: { value: ['competition'], confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      motivator: { value: 'impact', confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      spark_feel_quote: { value: 'Inspire your team to greatness', confidence: 1.0, source: 'spark', overrideable: false, errorState: false, wasConfirmed: false },
      _meta: {
        allFields: ['business_type', 'primary_goal', 'tone', 'challenges', 'motivator', 'spark_feel_quote'],
        injectedFields: ['spark_feel_quote'],
        validationPassed: true,
        errors: [],
        usedSparkSignal: true,
        usedVisionCatcher: false,
        intentConfidence: 0.95,
        fallbackSummary: '',
        emotionalAnchorPresent: true,
        conflictDetected: false,
        hasMotivationHook: false
      }
    } as StructuredIntent;
  });

  // What: Infers motivation hook for valid structured intent
  it('should infer motivation hook for valid intent', async () => {
    const result = await hook.inferHook(validIntent);
    expect(result.motivationHook?.value).toContain('Inspire your team to greatness');
    expect(result._meta.hasMotivationHook).toBe(true);
  });

  // What: Handles null input gracefully
  it('should fallback for null input', async () => {
    // @ts-ignore
    const result = await hook.inferHook(null);
    expect(result.motivationHook).toBeUndefined();
  });

  // What: Handles malformed input (missing spark/vision quotes)
  it('should fallback for missing spark/vision quotes', async () => {
    const malformed = { ...validIntent };
    // @ts-ignore
    delete malformed.spark_feel_quote;
    // @ts-ignore
    delete malformed.vision_feel_quote;
    const result = await hook.inferHook(malformed);
    expect(result.motivationHook).toBeUndefined();
  });

  // What: Handles chaos/edge-case (unexpected types)
  it('should fallback for chaos input', async () => {
    // @ts-ignore
    const result = await hook.inferHook(42);
    expect(result.motivationHook).toBeUndefined();
  });

  // What: Snapshot output for valid and fallback cases
  it('should match snapshot for valid and fallback', async () => {
    const fallback = { ...validIntent };
    // @ts-ignore
    delete fallback.spark_feel_quote;
    expect(await hook.inferHook(validIntent)).toMatchSnapshot('valid-motivation-hook');
    expect(await hook.inferHook(fallback)).toMatchSnapshot('fallback-motivation-hook');
  });
}); 