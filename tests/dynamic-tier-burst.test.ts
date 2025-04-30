/**
 * @codex-purpose: Validate dynamic tier-based burst protection behavior and emotional UX compliance during high-load scenarios.
 * @codex-system: Dream-State Dynamic Burst Protection Validation
 * @codex-critical: Prevents tier-based emotional UX drift under high traffic bursts, ensuring scalable UX integrity.
 * @codex-verified: v1.0.0
 */

import express, { Request, Response } from "express";
import request from "supertest";
import { dynamicTierBurstProtection } from "../api-router/middleware/dynamic-tier-burst";

describe("🛡 Dream-State Dynamic Tier Burst Protection", () => {
  const app = express();

  app.use(dynamicTierBurstProtection);

  // Mocking user tiers for testing purposes
  const createUserWithTier = (tier: string) => {
    return {
      user: {
        tier
      }
    };
  };

  it("should allow requests within burst threshold for free users", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app).get("/test").set("user", createUserWithTier("free"));
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    }
  });

  it("should block requests exceeding burst threshold for free users", async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).get("/test").set("user", createUserWithTier("free"));
    }

    const res = await request(app).get("/test").set("user", createUserWithTier("free"));
    expect(res.statusCode).toBe(429);
    expect(res.body).toMatchSnapshot();
  });

  it("should allow requests within burst threshold for standard users", async () => {
    for (let i = 0; i < 10; i++) {
      const res = await request(app).get("/test").set("user", createUserWithTier("standard"));
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    }
  });

  it("should block requests exceeding burst threshold for standard users", async () => {
    for (let i = 0; i < 10; i++) {
      await request(app).get("/test").set("user", createUserWithTier("standard"));
    }

    const res = await request(app).get("/test").set("user", createUserWithTier("standard"));
    expect(res.statusCode).toBe(429);
    expect(res.body).toMatchSnapshot();
  });

  it("should allow requests within burst threshold for premium users", async () => {
    for (let i = 0; i < 20; i++) {
      const res = await request(app).get("/test").set("user", createUserWithTier("premium"));
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    }
  });

  it("should block requests exceeding burst threshold for premium users", async () => {
    for (let i = 0; i < 20; i++) {
      await request(app).get("/test").set("user", createUserWithTier("premium"));
    }

    const res = await request(app).get("/test").set("user", createUserWithTier("premium"));
    expect(res.statusCode).toBe(429);
    expect(res.body).toMatchSnapshot();
  });

  it("should allow requests within burst threshold for enterprise users", async () => {
    for (let i = 0; i < 50; i++) {
      const res = await request(app).get("/test").set("user", createUserWithTier("enterprise"));
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchSnapshot();
    }
  });

  it("should block requests exceeding burst threshold for enterprise users", async () => {
    for (let i = 0; i < 50; i++) {
      await request(app).get("/test").set("user", createUserWithTier("enterprise"));
    }

    const res = await request(app).get("/test").set("user", createUserWithTier("enterprise"));
    expect(res.statusCode).toBe(429);
    expect(res.body).toMatchSnapshot();
  });
});
