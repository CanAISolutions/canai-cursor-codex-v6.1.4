/**
 * @codex-purpose: Validates Dream-State system selfcheck integrity and golden health report structures.
 * @codex-system: Selfcheck System Test Suite
 * @codex-critical: Prevents silent operational decay by enforcing health validation resilience and emotional output safety.
 * @codex-verified: v1.0.0
 */

import express from "express";
import { runFullSelfcheck } from "../api-router/feature/selfcheck/selfcheck";

describe("Dream-State System Selfcheck", () => {
  const app = express(); // Minimal stub for selfcheck requiring Express app context

  it("should produce a golden selfcheck report structure", async () => {
    const report = await runFullSelfcheck(app);

    expect(report).toMatchObject({
      success: expect.any(Boolean),
      details: expect.any(Object),
      mismatches: expect.any(Object)
    });

    // Validate keys exist
    expect(Object.keys(report.details).length).toBeGreaterThan(0);
    expect(Object.keys(report.mismatches).length).toBeGreaterThan(0);
  });

  it("should mark overall success if no critical mismatches", async () => {
    const report = await runFullSelfcheck(app);

    if (Object.values(report.details).every(Boolean)) {
      expect(report.success).toBe(true);
    } else {
      expect(report.success).toBe(false);
    }
  });
});
