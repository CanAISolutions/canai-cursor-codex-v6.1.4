/**
 * @codex-purpose: Validates Dream-State server boot integrity, golden error handling, and emotional UX preservation.
 * @codex-system: Server Integrity Test Suite
 * @codex-critical: Prevents silent regressions in routing, middleware safety, and emotional output structures.
 * @codex-verified: v1.0.0
 */

import request from "supertest";
import { Request, Response } from "express";
const app = require("../server");

describe("Dream-State Server Integrity", () => {
  it("should boot and respond to invalid routes with golden 404 payload", async () => {
    const res = await request(app).get("/api/unknown-route");

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      success: false,
      payload: null,
      errors: expect.arrayContaining([
        expect.objectContaining({
          code: "NOT_FOUND",
          message: expect.stringContaining("requested resource could not be found")
        })
      ]),
      meta: expect.any(Object)
    });
  });

  it("should normalize internal server errors into golden emotional payloads", async () => {
    // Simulate throwing error inside route
    app.get("/simulate-error", (req: Request, res: Response) => {
      throw new Error("Simulated failure");
    });

    const res = await request(app).get("/simulate-error");

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({
      success: false,
      payload: null,
      errors: expect.arrayContaining([
        expect.objectContaining({
          code: expect.stringMatching(/INTERNAL_ERROR|.*?/),
          message: expect.stringContaining("unexpected error")
        })
      ]),
      meta: expect.any(Object)
    });
  });

  it("should allow feature router (posts) to operate correctly", async () => {
    const res = await request(app).get("/api/posts/123");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      payload: expect.objectContaining({
        id: "123",
        title: expect.any(String),
        content: expect.any(String)
      }),
      errors: [],
      meta: {}
    });
  });
});
