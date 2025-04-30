/**
 * @codex-purpose: Validate runtime behavior of Dream-State compliant in-memory rate limiter.
 * @codex-system: API Router Rate Limit Testing Layer
 * @codex-critical: Prevents UX fracture under load, ensures overload fallback preserves trust, and snapshot-locks overload behaviors.
 * @codex-verified: v1.0.0
 */

import express, { Request, Response, NextFunction } from "express";
import request from "supertest";
import { rateLimit } from "../rateLimit";

describe("rateLimit middleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Apply Dream-State rate limiter: 3 requests allowed per 1000ms window
    app.use(rateLimit({ windowMs: 1000, maxRequests: 3 }));

    app.get("/test", (req: Request, res: Response) => {
      res.status(200).json({ success: true });
    });

    // Global error handler fallback
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: err.message
        }
      });
    });
  });

  it("should allow requests under the limit", async () => {
    const res1 = await request(app).get("/test");
    const res2 = await request(app).get("/test");
    const res3 = await request(app).get("/test");

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res3.status).toBe(200);
  });

  it("should block requests over the limit with Dream-State fallback", async () => {
    await request(app).get("/test");
    await request(app).get("/test");
    await request(app).get("/test");
    const res4 = await request(app).get("/test");

    expect(res4.status).toBe(429);
    expect(res4.body.success).toBe(false);
    expect(res4.body.error.code).toBe("RATE_LIMIT_EXCEEDED");
    expect(res4.body.error.message).toMatch(/slow down/i);
    expect(res4.body.meta).toHaveProperty("retryAfter");
    expect(res4.body.meta.limit).toBe(3);
    expect(res4.body.meta.remaining).toBe(0);
  });

  it("should reset the counter after the window passes", async () => {
    await request(app).get("/test");
    await request(app).get("/test");
    await request(app).get("/test");

    await new Promise((resolve) => setTimeout(resolve, 1100)); // Wait > windowMs

    const res = await request(app).get("/test");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
