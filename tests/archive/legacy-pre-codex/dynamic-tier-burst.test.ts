/**
 * @codex-purpose: Validate dynamic tier-based burst protection behavior and emotional UX compliance during high-load scenarios.
 * @codex-system: Dream-State Dynamic Burst Protection Validation
 * @codex-critical: Prevents tier-based emotional UX drift under high traffic bursts, ensuring scalable UX integrity.
 * @codex-verified: v1.0.0
 */

import express, { Request, Response, NextFunction } from "express";
import request from "supertest";
import { dynamicTierBurstProtection } from "../api-router/middleware/dynamic-tier-burst";

// Helper middleware to inject user tier from header
function userTierInjector(req: Request, res: Response, next: NextFunction): void {
  const tier = req.header('x-user-tier') || 'standard';
  (req as any).user = { tier };
  next();
}

describe("\uD83D\uDEE1 Dream-State Dynamic Tier Burst Protection", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(userTierInjector); // Inject user tier before burst protection
    app.use(dynamicTierBurstProtection()); // Use as middleware factory
    app.get("/test", (req: Request, res: Response) => {
      res.status(200).json({ success: true, tier: (req as any).user.tier });
    });
  });

  it("should allow requests within burst threshold for free users", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app).get("/test").set("x-user-tier", "free");
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    }
  });

  it("should block requests exceeding burst threshold for free users", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).get("/test").set("x-user-tier", "free");
    }
    const res = await request(app).get("/test").set("x-user-tier", "free");
    expect(res.statusCode).toBe(429);
    expect(res.body).toMatchSnapshot();
  });

  it("should allow requests within burst threshold for standard users", async () => {
    for (let i = 0; i < 10; i++) {
      const res = await request(app).get("/test").set("x-user-tier", "standard");
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    }
  });

  it("should block requests exceeding burst threshold for standard users", async () => {
    for (let i = 0; i < 10; i++) {
      await request(app).get("/test").set("x-user-tier", "standard");
    }
    const res = await request(app).get("/test").set("x-user-tier", "standard");
    expect(res.statusCode).toBe(429);
    expect(res.body).toMatchSnapshot();
  });

  it("should allow requests within burst threshold for premium users", async () => {
    for (let i = 0; i < 20; i++) {
      const res = await request(app).get("/test").set("x-user-tier", "premium");
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    }
  });

  it("should block requests exceeding burst threshold for premium users", async () => {
    for (let i = 0; i < 20; i++) {
      await request(app).get("/test").set("x-user-tier", "premium");
    }
    const res = await request(app).get("/test").set("x-user-tier", "premium");
    expect(res.statusCode).toBe(429);
    expect(res.body).toMatchSnapshot();
  });

  it("should allow requests within burst threshold for enterprise users", async () => {
    for (let i = 0; i < 50; i++) {
      const res = await request(app).get("/test").set("x-user-tier", "enterprise");
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    }
  });

  it("should block requests exceeding burst threshold for enterprise users", async () => {
    for (let i = 0; i < 50; i++) {
      await request(app).get("/test").set("x-user-tier", "enterprise");
    }
    const res = await request(app).get("/test").set("x-user-tier", "enterprise");
    expect(res.statusCode).toBe(429);
    expect(res.body).toMatchSnapshot();
  });
});
