import { FeedbackCapture } from './feedback-capture';
import { StructuredIntent } from './schema-engine';

const mockEventBus = {
  emit: jest.fn().mockResolvedValue(undefined),
  on: jest.fn()
};

jest.mock('../event-bus/eventBus', () => ({
  EventBus: { getInstance: () => mockEventBus }
}));

describe('FeedbackCapture', () => {
  let capture: FeedbackCapture;
  let oldIntent: StructuredIntent;
  let newIntent: StructuredIntent;

  beforeEach(() => {
    capture = new FeedbackCapture({ trackAllFields: true, minConfidenceForTracking: 0.7, enableHeatmap: true });
    oldIntent = {
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
    newIntent = {
      business_type: { value: 'SaaS', confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      primary_goal: { value: 'Grow revenue', confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      tone: { value: 'professional', confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      challenges: { value: ['competition'], confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      motivator: { value: 'impact', confidence: 0.95, source: 'rules', overrideable: true, errorState: false, wasConfirmed: true },
      _meta: oldIntent._meta
    } as StructuredIntent;
  });

  // What: Captures feedback for a valid field change
  it('should capture feedback for valid field change', async () => {
    await capture.captureFeedback('primary_goal', 'Grow users', 'Grow revenue', 'user', 0.95);
    const heatmap = await capture.getOverrideHeatmap();
    expect(heatmap['primary_goal']).toBe(1);
  });

  // What: Handles null input gracefully
  it('should fallback for null input', async () => {
    // @ts-ignore
    await expect(capture.captureFeedback(null, null, null)).resolves.toBeUndefined();
  });

  // What: Handles malformed input (missing field name)
  it('should fallback for missing field name', async () => {
    // @ts-ignore
    await expect(capture.captureFeedback('', 'old', 'new')).resolves.toBeUndefined();
  });

  // What: Handles chaos/edge-case (unexpected types)
  it('should fallback for chaos input', async () => {
    // @ts-ignore
    await expect(capture.captureFeedback(42, {}, [])).resolves.toBeUndefined();
  });

  // What: Tracks changes between two structured intents
  it('should track changes between intents', async () => {
    await capture.trackIntentChanges(oldIntent, newIntent);
    const heatmap = await capture.getOverrideHeatmap();
    expect(heatmap['primary_goal']).toBe(1);
  });

  // What: Handles malformed intents in trackIntentChanges
  it('should fallback for malformed intents', async () => {
    // @ts-ignore
    await expect(capture.trackIntentChanges(null, null)).resolves.toBeUndefined();
  });

  // What: Snapshot output for heatmap
  it('should match snapshot for heatmap', async () => {
    await capture.captureFeedback('primary_goal', 'Grow users', 'Grow revenue', 'user', 0.95);
    expect(await capture.getOverrideHeatmap()).toMatchSnapshot('override-heatmap');
  });
}); 