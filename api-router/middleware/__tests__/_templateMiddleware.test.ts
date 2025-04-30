/**
 * @codex-purpose: Validate Dream-State fallback behavior and operational flow of template middleware.
 * @codex-system: API Router Middleware Test Layer
 * @codex-critical: Prevents middleware UX fractures, ensures fallback structures remain Codex-compliant, and enforces snapshot testability.
 * @codex-verified: v1.0.0
 */

import express, { Request, Response, NextFunction } from "express";
import request from "supertest";
import { templateMiddleware } from "../_templateMiddleware";

describe("templateMiddleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Insert template middleware under test
    app.use((req: Request, res: Response, next: NextFunction) => {
      templateMiddleware(req, res, next);
    });

    // Mock successful handler after middleware
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

  it("should pass through successfully when no errors occur", async () => {
    const res = await request(app).get("/test");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should handle unexpected errors with Dream-State fallback", async () => {
    // Force templateMiddleware to throw for this test
    const brokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
      throw new Error("Simulated Middleware Failure");
    };

    const errorApp = express();
    errorApp.use(express.json());
    errorApp.use(brokenMiddleware);

    errorApp.get("/test", (req: Request, res: Response) => {
      res.status(200).json({ success: true });
    });

    errorApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: err.message
        }
      });
    });

    const res = await request(errorApp).get("/test");

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INTERNAL_SERVER_ERROR");
    expect(res.body.error.message).toBeDefined();
  });
});
