import { ConfirmationUX, ConfirmationUXConfig } from './confirmation-ux';
import { StructuredIntent } from './schema-engine';

const mockEventBus = {
  emit: jest.fn().mockResolvedValue(undefined),
  on: jest.fn()
};

jest.mock('../event-bus/eventBus', () => ({
  EventBus: { getInstance: () => mockEventBus }
}));

describe('ConfirmationUX', () => {
  let ux: ConfirmationUX;
  let validIntent: StructuredIntent;

  beforeEach(() => {
    ux = new ConfirmationUX({ highConfidenceThreshold: 0.9, lowConfidenceThreshold: 0.8 });
    validIntent = {
      business_type: { value: 'SaaS', confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      primary_goal: { value: 'Grow users', confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      tone: { value: 'professional', confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      challenges: { value: ['competition'], confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      motivator: { value: 'impact', confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      _meta: {
        allFields: ['business_type', 'primary_goal', 'tone', 'challenges', 'motivator'],
        injectedFields: [],
        validationPassed: true,
        errors: [],
        usedSparkSignal: false,
        usedVisionCatcher: false,
        intentConfidence: 0.95,
        fallbackSummary: '',
        emotionalAnchorPresent: true,
        conflictDetected: false,
        hasMotivationHook: false
      }
    } as StructuredIntent;
  });

  // What: Validates confirmation for a valid structured intent
  it('should confirm valid structured intent', async () => {
    const result = await ux.confirmIntent(validIntent);
    expect(result.confirmed).toBe(true);
    expect(result.meta.usedConfirmationUX).toBe(true);
  });

  // What: Handles null input gracefully
  it('should fallback for null input', async () => {
    // @ts-ignore
    const result = await ux.confirmIntent(null);
    expect(result.confirmed).toBe(true);
    expect(result.meta.usedConfirmationUX).toBe(true);
  });

  // What: Handles malformed input (missing fields)
  it('should fallback for missing fields', async () => {
    const malformed = { ...validIntent, business_type: { ...validIntent.business_type, value: '' } };
    // @ts-ignore
    malformed._meta.intentConfidence = 0.5;
    const result = await ux.confirmIntent(malformed);
    expect(result.confirmed).toBe(true);
  });

  // What: Handles chaos/edge-case (unexpected types)
  it('should fallback for chaos input', async () => {
    // @ts-ignore
    const result = await ux.confirmIntent(42);
    expect(result.confirmed).toBe(true);
  });

  // What: Snapshot output for valid and fallback cases
  it('should match snapshot for valid and fallback', async () => {
    const fallback = { ...validIntent, _meta: { ...validIntent._meta, intentConfidence: 0.5, emotionalAnchorPresent: false } };
    expect(await ux.confirmIntent(validIntent)).toMatchSnapshot('valid-confirmation');
    expect(await ux.confirmIntent(fallback)).toMatchSnapshot('fallback-confirmation');
  });
}); 