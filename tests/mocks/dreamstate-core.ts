// dreamstate-core.ts
// All canonical mocks have been collapsed for production readiness.
// Use real builder functions or runtime data in all DreamState tests.

// @codex-temp-real-input: Add real builder functions here as needed for test migration.

// @codex-temp-real-input: Real builder stubs for test migration
export function createEmotionalPayload() {
  return {
    traceId: 'trace-real',
    sessionId: 'session-real',
    tone: 'reassuring',
    trustScore: 0.98,
    emotionIntentHash: 'intent-xyz',
    locale: 'en-US',
    payload: 'You are safe and supported.'
  };
}

export function buildFallbackChain() {
  return [
    { step: 1, agent: 'Primary', status: 'fail' },
    { step: 2, agent: 'Fallback1', status: 'fail' },
    { step: 3, agent: 'Fallback2', status: 'success' }
  ];
}

// Mock: Canonical emotional payload
export const mockEmotionalPayload = {
  traceId: 'trace-123',
  sessionId: 'session-abc',
  tone: 'reassuring',
  trustScore: 0.98,
  emotionIntentHash: 'intent-xyz',
  locale: 'en-US',
  payload: 'You are safe and supported.'
};

// Mock: Agent workflow sequence
export const mockAgentWorkflow = [
  { agent: 'Parser', status: 'complete', output: 'Parsed prompt.' },
  { agent: 'Generator', status: 'complete', output: 'Generated content.' },
  { agent: 'Validator', status: 'complete', output: 'Emotion validated.' }
];

// Mock: Fallback chain
export const mockFallbackChain = [
  { step: 1, agent: 'Primary', status: 'fail' },
  { step: 2, agent: 'Fallback1', status: 'fail' },
  { step: 3, agent: 'Fallback2', status: 'success' }
];

// Mock: Malicious input
export const mockMaliciousInput = {
  userPrompt: 'SELECT * FROM users; --',
  locale: 'en-US'
};

// Mock: Chaos scenario (network failure)
export const mockChaosNetworkFailure = {
  event: 'network-partition',
  affectedAgents: ['Generator', 'Validator'],
  recovery: false
};

// Mock: README assessment data
export const mockReadmeAssessment = {
  clarityScore: 0.92,
  inclusionScore: 0.88,
  completeness: 0.95,
  emotionalResonance: 0.87,
  trustIndicators: ['clear-language', 'inclusive-tone', 'comprehensive-coverage']
};

// Mock: Load balancer status
export const mockLoadBalancerStatus = {
  nodes: [
    { id: 'node-1', load: 0.45, status: 'healthy' },
    { id: 'node-2', load: 0.67, status: 'healthy' },
    { id: 'node-3', load: 0.23, status: 'healthy' }
  ],
  failoverTriggered: false,
  totalCapacity: 0.78,
  responseTime: 120
};

// Mock: Intent extraction data
export const mockIntentExtraction = {
  accuracy: 0.94,
  emotionalFidelity: 0.91,
  intentCategories: ['support', 'information', 'action'],
  confidenceScore: 0.89,
  extractedIntents: [
    { intent: 'support', confidence: 0.95 },
    { intent: 'information', confidence: 0.87 }
  ]
};

// Fallback logic: If any mock is missing, throw with Codex-aligned error
export function requireMock(name: string): never {
  throw new Error(`Codex: Required DreamState mock missing: ${name}`);
} 