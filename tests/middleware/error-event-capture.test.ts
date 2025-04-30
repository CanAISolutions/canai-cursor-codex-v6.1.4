/**
 * @codex-purpose: Validates Dream-State error event capture middleware resilience, emotional safety, and production lockout behavior.
 * @codex-system: Middleware Resilience Test Suite
 * @codex-critical: Prevents silent failure or security drift in error telemetry while preserving emotional UX principles.
 * @codex-verified: v1.0.0
 */

import express, { Request, Response, NextFunction } from "express";
import request from "supertest";
import { errorEventCapture } from "../../api-router/middleware/error-event-capture";
import { errorEventStore } from "../../api-router/devtools/errors/error-event.store";

// Helper to reset the event store before each test
beforeEach(() => {
  errorEventStore.clearAll();
});

describe("Dream-State Error Event Capture Middleware", () => {
  function createTestApp(env: string) {
    const app = express();
    process.env.NODE_ENV = env;

    app.get("/simulate-error", (req, res, next) => {
      const error = new Error("Simulated error");
      // @ts-ignore
      error.code = "SIMULATED_ERROR";
      next(error);
    });

    app.use(errorEventCapture);

    // Dummy error normalizer to complete Express pipeline
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({
        success: false,
        error: {
          code: err.code || "UNKNOWN",
          message: err.message
        }
      });
    });

    return app;
  }

  it("should capture structured errors in non-production environments", async () => {
    const app = createTestApp("development");

    await request(app).get("/simulate-error");

    const captured = errorEventStore.getRecentErrors();

    expect(captured.length).toBe(1);
    expect(captured[0]).toMatchObject({
      code: "SIMULATED_ERROR",
      message: "Simulated error",
      timestamp: expect.any(String)
    });
  });

  it("should not capture errors in production environments", async () => {
    const app = createTestApp("production");

    await request(app).get("/simulate-error");

    const captured = errorEventStore.getRecentErrors();

    expect(captured.length).toBe(0);
  });

  it("should fail silently if error capturing itself fails", async () => {
    const app = express();
    process.env.NODE_ENV = "development";

    // Break the store deliberately
    app.use((req, res, next) => {
      // @ts-ignore
      errorEventStore.captureError = () => {
        throw new Error("Forced capture failure");
      };
      next();
    });

    app.get("/simulate-error", (req, res, next) => {
      const error = new Error("Simulated error");
      // @ts-ignore
      error.code = "SIMULATED_ERROR";
      next(error);
    });

    app.use(errorEventCapture);

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({
        success: false,
        error: {
          code: err.code || "UNKNOWN",
          message: err.message
        }
      });
    });

    const res = await request(app).get("/simulate-error");

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    // Confirm no crash despite telemetry failure
  });
});
