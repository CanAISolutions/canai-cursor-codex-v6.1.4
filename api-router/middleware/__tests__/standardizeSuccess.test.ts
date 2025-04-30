/**
 * @codex-purpose: Validate standardized success response structure for Dream-State emotional UX compliance.
 * @codex-system: API Output Standardization Layer
 * @codex-critical: Ensures all successful outputs remain emotionally resonant and structurally snapshot-safe.
 * @codex-verified: v1.0.0
 */

import { standardizeSuccess } from "../standardizeSuccess";

describe("standardizeSuccess utility", () => {
  it("should wrap payload correctly in Dream-State success structure", () => {
    const result = standardizeSuccess({ id: "123", message: "Created successfully." });

    expect(result).toEqual({
      success: true,
      data: {
        id: "123",
        message: "Created successfully."
      }
    });
  });
});
