/**
 * @codex-purpose: Validates Dream-State error dashboard endpoint integrity, non-production safety, and emotional UX outputs.
 * @codex-system: Devtools Telemetry Test Suite
 * @codex-critical: Prevents accidental production exposure and preserves emotional observability trust layer.
 * @codex-verified: v1.0.0
 */

import request from "supertest";
import express from "express";
import errorsDashboardRouter from "../../api-router/devtools/errors/errors-dashboard";

// Helper to simulate environments dynamically
function createTestApp(env: string) {
  const app = express();
  process.env.NODE_ENV = env;
  app.use("/api/devtools", errorsDashboardRouter);
  return app;
}

describe("Dream-State Errors Dashboard Endpoint", () => {
  it("should respond with captured errors in non-production", async () => {
    const app = createTestApp("development");

    const res = await request(app).get("/api/devtools/errors");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      payload: expect.objectContaining({
        capturedErrors: expect.any(Array)
      }),
      errors: [],
      meta: expect.objectContaining({
        capturedAt: expect.any(String)
      })
    });
  });

  it("should forbid access in production environment", async () => {
    const app = createTestApp("production");

    const res = await request(app).get("/api/devtools/errors");

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({
      success: false,
      payload: null,
      errors: expect.arrayContaining([
        expect.objectContaining({
          code: "FORBIDDEN",
          message: expect.stringContaining("not available in production")
        })
      ]),
      meta: {}
    });
  });
});
