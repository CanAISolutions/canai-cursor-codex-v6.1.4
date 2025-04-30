/**
 * @codex-purpose: Validate and snapshot-lock Dream-State compliant rate limit failure responses.
 * @codex-system: API Router Rate Limit UX Preservation Layer
 * @codex-critical: Prevents output drift and ensures emotional UX resilience during overload events.
 * @codex-verified: v1.0.0
 */

import { handleRateLimitExceeded } from "../handleRateLimitExceeded";
import { Request, Response, NextFunction } from "express";

describe("handleRateLimitExceeded", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn()
    };
    mockNext = jest.fn();
  });

  it("should return standard 429 response without meta", () => {
    handleRateLimitExceeded(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockRes.status).toHaveBeenCalledWith(429);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "You're sending requests too quickly. Please slow down and try again."
      }
    });
  });

  it("should include Retry-After header and meta when provided", () => {
    handleRateLimitExceeded(
      mockReq as Request,
      mockRes as Response,
      mockNext,
      {
        retryAfter: 60,
        limit: 100,
        remaining: 0
      }
    );

    expect(mockRes.setHeader).toHaveBeenCalledWith("Retry-After", 60);
    expect(mockRes.status).toHaveBeenCalledWith(429);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "You're sending requests too quickly. Please slow down and try again."
      },
      meta: {
        retryAfter: 60,
        limit: 100,
        remaining: 0
      }
    });
  });
});
