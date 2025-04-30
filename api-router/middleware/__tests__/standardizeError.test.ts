/**
 * @codex-purpose: Validate standardized error response structure for Dream-State emotional UX compliance.
 * @codex-system: API Output Standardization Layer
 * @codex-critical: Ensures all error outputs remain emotionally intelligent and snapshot-safe across scaling.
 * @codex-verified: v1.0.0
 */

import { standardizeError } from "../standardizeError";

describe("standardizeError utility", () => {
  it("should wrap error correctly in Dream-State structure", () => {
    const result = standardizeError("USER_NOT_FOUND", "The specified user does not exist.");

    expect(result).toEqual({
      success: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "The specified user does not exist."
      }
    });
  });
});
