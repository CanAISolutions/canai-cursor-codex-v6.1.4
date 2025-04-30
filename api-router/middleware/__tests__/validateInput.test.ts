/**
 * @codex-purpose: Validate Dream-State compliant behavior of request input validation middleware.
 * @codex-system: API Router Input Validation Layer
 * @codex-critical: Protects against silent schema drift, enforces emotional UX fallback on invalid inputs.
 * @codex-verified: v1.0.0
 */

import express from "express";
import request from "supertest";
import { validateInput } from "../validateInput";
import { z } from "zod";

describe("validateInput middleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    const testSchema = z.object({
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6)
      }),
      query: z.object({}),
      params: z.object({})
    });

    app.post("/test", validateInput(testSchema), (req, res) => {
      res.status(200).json({ success: true });
    });
  });

  it("should allow valid input", async () => {
    const res = await request(app)
      .post("/test")
      .send({ email: "test@example.com", password: "securepass" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should reject invalid input with Dream-State fallback", async () => {
    const res = await request(app)
      .post("/test")
      .send({ email: "bademail", password: "123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INVALID_INPUT");
    expect(res.body.error.message).toMatch(/invalid/i);
  });
});
