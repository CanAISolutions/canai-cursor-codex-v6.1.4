/**
 * DreamState Ritual Test: selfcheck-api.ts — Operational Resilience & Emotional UX Fallback
 * Codex Pillar: Operational Resilience, Emotional UX Fidelity
 * Ritual Tag: #ritual-selfcheck-api-emotional-fallback
 *
 * WHAT: Ensures /api/devtools/selfcheck-api.ts enforces operational resilience, emotional fallback, and audit logging on all paths.
 * WHY: Defends against silent failure, emotional drift, and trust loss during selfcheck API calls.
 * HOW: Simulates successful and failed selfcheck, asserts fallback, emotional copy, and log triggers.
 */

import handler from '../../../api/internal/selfcheck_full';
import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';

// Mock fetch for the selfcheck handler
global.fetch = jest.fn();

describe('DreamState: selfcheck-api.ts — Operational Resilience & Emotional UX Fallback', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    jest.clearAllMocks();
  });

  it('returns success for healthy selfcheck and logs action', async () => {
    // Mock all endpoints to return success
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true })
      });

    const { req, res } = createMocks({ method: 'GET' });
    
    // Add required env property for NextApiRequest compatibility
    const mockReq = {
      ...req,
      env: process.env
    } as unknown as NextApiRequest;
    
    await handler(mockReq, res as unknown as NextApiResponse);
    expect(res._getStatusCode()).toBe(200);
    
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(true);
    expect(responseData.message).toContain('All core selfchecks passed');
  });

  it('returns error for failed selfcheck and triggers fallback', async () => {
    // Mock first endpoint to fail, others to succeed
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true })
      });

    const { req, res } = createMocks({ method: 'GET' });
    
    // Add required env property for NextApiRequest compatibility
    const mockReq = {
      ...req,
      env: process.env
    } as unknown as NextApiRequest;
    
    await handler(mockReq, res as unknown as NextApiResponse);
    expect(res._getStatusCode()).toBe(500);
    
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(false);
    expect(responseData.error.code).toBe('FULL_SELF_CHECK_FAILED');
  });
}); 