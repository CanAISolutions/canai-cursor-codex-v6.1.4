import { VisionCatcher } from './vision-catcher';
import { StructuredIntent } from './schema-engine';

const mockEventBus = {
  emit: jest.fn().mockResolvedValue(undefined),
  on: jest.fn()
};

jest.mock('../event-bus/eventBus', () => ({
  EventBus: { getInstance: () => mockEventBus }
}));

describe('VisionCatcher', () => {
  let catcher: VisionCatcher;
  let validIntent: StructuredIntent;

  beforeEach(() => {
    catcher = new VisionCatcher({ confidenceThreshold: 0.8, requireEmotionalAnchor: true, maxRetries: 3 });
    // Patch getVisionInput to simulate user input
    jest.spyOn(catcher as any, 'getVisionInput').mockImplementation(async () => 'Vision for the future.');
    validIntent = {
      business_type: { value: 'SaaS', confidence: 0.75, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      primary_goal: { value: 'Grow users', confidence: 0.75, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      tone: { value: 'professional', confidence: 0.75, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      challenges: { value: ['competition'], confidence: 0.75, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      motivator: { value: 'impact', confidence: 0.75, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      _meta: {
        allFields: ['business_type', 'primary_goal', 'tone', 'challenges', 'motivator'],
        injectedFields: [],
        validationPassed: true,
        errors: [],
        usedSparkSignal: false,
        usedVisionCatcher: false,
        intentConfidence: 0.75,
        fallbackSummary: '',
        emotionalAnchorPresent: false,
        conflictDetected: false,
        hasMotivationHook: false
      }
    } as StructuredIntent;
  });

  // What: Enriches intent with vision when needed
  it('should enrich intent with vision input', async () => {
    const result = await catcher.catchVision(validIntent);
    expect(result?.vision_feel_quote?.value).toContain('Vision for the future.');
    expect(result?._meta.usedVisionCatcher).toBe(true);
  });

  // What: Handles null input gracefully
  it('should fallback for null input', async () => {
    // @ts-ignore
    const result = await catcher.catchVision(null);
    expect(result).toBeNull();
  });

  // What: Handles malformed input (missing _meta)
  it('should fallback for malformed input', async () => {
    const malformed = { ...validIntent };
    // @ts-ignore
    delete malformed._meta;
    const result = await catcher.catchVision(malformed);
    expect(result).toBeNull();
  });

  // What: Handles chaos/edge-case (unexpected types)
  it('should fallback for chaos input', async () => {
    // @ts-ignore
    const result = await catcher.catchVision(42);
    expect(result).toBeNull();
  });

  // What: Snapshot output for vision enrichment
  it('should match snapshot for vision enrichment', async () => {
    expect(await catcher.catchVision(validIntent)).toMatchSnapshot('vision-enrichment');
  });
}); 