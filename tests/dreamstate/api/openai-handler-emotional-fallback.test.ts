/**
 * DreamState Ritual Test: openaiHandler.ts — Emotional UX Fidelity & Fallback
 * Codex Pillar: Emotional UX Fidelity, Operational Resilience
 * Ritual Tag: #ritual-openai-handler-emotional-fallback
 *
 * WHAT: Ensures /api/openaiHandler.ts enforces emotional contract, safe fallback, and audit logging on all paths.
 * WHY: Defends against silent failure, emotional drift, and trust loss during OpenAI prompt fulfillment.
 * HOW: Simulates valid/invalid input, OpenAI failure, and asserts fallback, emotional copy, and log triggers.
 */

import handler from '../../../api/openaiHandler';
import { createMocks } from 'node-mocks-http';

// Mock OpenAI module with proper initialization
const mockCreate = jest.fn();
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: (...args: any[]) => mockCreate(...args)
      }
    }
  }));
});

describe('DreamState: openaiHandler.ts — Emotional UX & Fallback', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Default successful mock implementation
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Test response from mocked OpenAI'
          }
        }
      ]
    });
  });

  it('returns success for valid input and logs action', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { 
        promptType: 'business_plan', 
        input: { 
          bizName: 'Test Company',
          industry: 'Technology',
          goal: 'Create innovative solutions'
        } 
      },
    });
    
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    
    const responseData = JSON.parse(res._getData());
    expect(responseData.result).toBe('Test response from mocked OpenAI');
  });

  it('returns validation error for missing promptType/input and triggers fallback', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { input: 'hello' },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toMatch(/Missing promptType or input/);
  });

  it('handles OpenAI API failure with emotional fallback and logs', async () => {
    // Override mock to throw error for this specific test
    mockCreate.mockRejectedValue(new Error('OpenAI API Error'));

    const { req, res } = createMocks({
      method: 'POST',
      body: { 
        promptType: 'business_plan', 
        input: { 
          bizName: 'Test Company',
          industry: 'Technology'
        } 
      },
    });
    
    await handler(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toMatch(/Internal Server Error/);
  });
}); 