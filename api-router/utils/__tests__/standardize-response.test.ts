/**
 * @codex-purpose: Validate and snapshot-lock all standardized success and error responses.
 * @codex-system: API Router Output Standardization Layer
 * @codex-critical: Prevents silent output drift, preserves emotional UX trust, and ensures Copilot-safe system evolution.
 * @codex-verified: v1.0.0
 */

import { standardizeSuccess } from "../standardizeSuccess";
import { standardizeError } from "../standardizeError";

describe("standardizeSuccess", () => {
  it("should wrap a valid payload correctly", () => {
    const payload = { id: "123", status: "active" };
    const result = standardizeSuccess(payload);

    expect(result).toEqual({
      success: true,
      data: {
        id: "123",
        status: "active"
      }
    });
  });

  it("should default to empty object if payload is undefined", () => {
    const result = standardizeSuccess(undefined as any);

    expect(result).toEqual({
      success: true,
      data: {}
    });
  });
});

describe("standardizeError", () => {
  it("should wrap a valid error code and message correctly", () => {
    const code = "VALIDATION_FAILED";
    const message = "Some required fields are missing or invalid.";
    const result = standardizeError(code, message);

    expect(result).toEqual({
      success: false,
      error: {
        code: "VALIDATION_FAILED",
        message: "Some required fields are missing or invalid."
      }
    });
  });
});
