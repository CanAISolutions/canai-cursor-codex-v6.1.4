/**
 * @codex-purpose: Validates Dream-State golden error payload generation for emotional UX resilience and output structure predictability.
 * @codex-system: Utils Error Normalization Test Suite
 * @codex-critical: Prevents brittle or inconsistent error messaging pathways across Dream-State API.
 * @codex-verified: v1.0.0
 */

import { standardizeError } from "../../api-router/utils/standardizeError";

describe("Dream-State Golden Error Payload", () => {
  it("should generate a standard error payload with provided code and message", () => {
    const output = standardizeError("VALIDATION_FAILED", "The input was invalid.");

    expect(output).toMatchObject({
      success: false,
      payload: null,
      errors: [
        {
          code: "VALIDATION_FAILED",
          message: "The input was invalid."
        }
      ],
      meta: {}
    });
  });

  it("should handle missing optional fields gracefully", () => {
    // Provide only minimal info
    const output = standardizeError("UNKNOWN_ERROR", "Something went wrong.");

    expect(output).toMatchObject({
      success: false,
      payload: null,
      errors: [
        {
          code: "UNKNOWN_ERROR",
          message: "Something went wrong."
        }
      ],
      meta: {}
    });
  });

  it("should allow meta inclusion for additional diagnostics", () => {
    const meta = { requestId: "xyz789" };
    const output = standardizeError("SERVER_ERROR", "Unexpected failure.", meta);

    expect(output).toMatchObject({
      success: false,
      payload: null,
      errors: [
        {
          code: "SERVER_ERROR",
          message: "Unexpected failure."
        }
      ],
      meta: meta
    });
  });

  it("should always structure errors as an array even if only one", () => {
    const output = standardizeError("RATE_LIMIT", "Too many requests.");

    expect(Array.isArray(output.errors)).toBe(true);
    expect(output.errors.length).toBe(1);
  });
});
