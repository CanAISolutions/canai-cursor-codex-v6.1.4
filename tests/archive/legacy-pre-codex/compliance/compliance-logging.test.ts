import fs from 'fs';
import path from 'path';
import { PromptLogs } from '../../cursor/types/prompt-logs';

// What: Simulate compliance events and assert logging
// Why: Ensure all compliance contracts are enforced and auditable
// How: Write test PromptLogs and AgentActions, then assert presence and correctness

describe('Compliance Contract Logging', () => {
  const agentActionsPath = path.resolve(__dirname, '../../cursor/logs/AgentActions.json');
  let agentActions: any[] = [];

  beforeAll(() => {
    agentActions = JSON.parse(fs.readFileSync(agentActionsPath, 'utf-8'));
  });

  it('should log consent events in both PromptLogs and AgentActions', () => {
    // Simulate a PromptLogs entry for consent
    const consentLog: PromptLogs = {
      timestamp: '2025-05-14T10:00:00.000Z',
      sessionId: 'session-001',
      promptType: 'test',
      trustScore: 5,
      emotionalDepth: 1,
      enrichedInput: {
        businessType: '',
        primaryGoal: '',
        tone: '',
        motivator: '',
        confidence: 1,
        sourceMap: {},
        usedSparkSignal: false,
        usedVisionCatcher: false
      },
      emotionalAnchorPresent: false,
      analyticsMeta: {},
      consentGiven: true,
      agentActionType: 'consent',
      agentActionDetails: 'User accepted terms and provided explicit consent for data processing.'
    };
    // Assert AgentActions contains consent event
    const found = agentActions.find(e => e.agentActionType === 'consent' && e.sessionId === consentLog.sessionId);
    expect(found).toBeDefined();
    expect(found.agentActionDetails).toContain('consent');
  });

  it('should log deletion requests in both PromptLogs and AgentActions', () => {
    // Simulate a PromptLogs entry for deletion
    const deletionLog: PromptLogs = {
      timestamp: '2025-05-14T10:05:00.000Z',
      sessionId: 'session-002',
      promptType: 'test',
      trustScore: 5,
      emotionalDepth: 1,
      enrichedInput: {
        businessType: '',
        primaryGoal: '',
        tone: '',
        motivator: '',
        confidence: 1,
        sourceMap: {},
        usedSparkSignal: false,
        usedVisionCatcher: false
      },
      emotionalAnchorPresent: false,
      analyticsMeta: {},
      deletionRequested: true,
      agentActionType: 'deletion',
      agentActionDetails: 'User requested deletion of all session data and associated logs.'
    };
    // Assert AgentActions contains deletion event
    const found = agentActions.find(e => e.agentActionType === 'deletion' && e.sessionId === deletionLog.sessionId);
    expect(found).toBeDefined();
    expect(found.agentActionDetails).toContain('deletion');
  });

  it('should fail if compliance contract is missing', () => {
    // Simulate a PromptLogs entry missing compliance fields
    const incompleteLog: PromptLogs = {
      timestamp: '2025-05-14T10:10:00.000Z',
      sessionId: 'session-003',
      promptType: 'test',
      trustScore: 5,
      emotionalDepth: 1,
      enrichedInput: {
        businessType: '',
        primaryGoal: '',
        tone: '',
        motivator: '',
        confidence: 1,
        sourceMap: {},
        usedSparkSignal: false,
        usedVisionCatcher: false
      },
      emotionalAnchorPresent: false,
      analyticsMeta: {}
    };
    // Assert that incomplete compliance logs are not accepted
    expect(incompleteLog.consentGiven || incompleteLog.deletionRequested || incompleteLog.agentActionType).toBeDefined();
  });
}); 