/**
 * @codex-purpose: Lock Dream-State Burst Protection Middleware behavior under heavy traffic conditions via snapshot-safe emotional UX tests.
 * @codex-system: Dream-State Burst Protection Snapshot Test Engine
 * @codex-critical: Prevents silent emotional UX drift during scaling overload events.
 * @codex-verified: v1.0.0
 */

import express, { Request, Response } from "express";
import request from "supertest";
import { burstProtectionMiddleware } from "../api-router/middleware/burst-protection-middleware";

describe("🛡 Dream-State Burst Protection Middleware", () => {
  const app = express();

  app.use(
    burstProtectionMiddleware({
      maxBurstRequests: 5,
      burstWindowMs: 2000,
      responseMessage: "You're making a lot of requests! Let's pace them out together."
    })
  );

  app.get("/test", (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "Request successful" });
  });

  it("should allow requests within burst threshold", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app).get("/test");
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    }
  });

  it("should block requests exceeding burst threshold", async () => {
    // Send 6th request rapidly to trigger burst protection
    for (let i = 0; i < 5; i++) {
      await request(app).get("/test");
    }

    const burstRes = await request(app).get("/test");
    expect(burstRes.statusCode).toBe(429);
    expect(burstRes.body).toMatchSnapshot();
  });
});
