/**
 * @codex-purpose: Unit test Dream-State payload validator to enforce emotional UX and structural integrity.
 * @codex-system: Dream-State Inline Validation Layer
 * @codex-critical: Protects against silent output shape decay at local development stage before CI/CD.
 * @codex-verified: v1.0.0
 */

import { validateDreamStatePayload } from "../validateDreamStatePayload";

describe("validateDreamStatePayload", () => {
  it("should validate a correct success payload", () => {
    const payload = {
      success: true,
      data: { id: "123", message: "Created successfully." }
    };

    const result = validateDreamStatePayload(payload);

    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("should validate a correct error payload", () => {
    const payload = {
      success: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "The user does not exist."
      }
    };

    const result = validateDreamStatePayload(payload);

    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("should catch missing 'success' field", () => {
    const payload = {
      data: { something: true }
    };

    const result = validateDreamStatePayload(payload);

    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(expect.stringContaining("success"));
  });

  it("should catch bad success payload structure", () => {
    const payload = {
      success: true,
      data: "not-an-object"
    };

    const result = validateDreamStatePayload(payload);

    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(expect.stringContaining("data object"));
  });

  it("should catch missing error fields", () => {
    const payload = {
      success: false,
      error: {}
    };

    const result = validateDreamStatePayload(payload);

    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(expect.stringContaining("code"));
    expect(result.issues).toContainEqual(expect.stringContaining("message"));
  });

  it("should catch bad meta structure if present", () => {
    const payload = {
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Please slow down."
      },
      meta: "not-an-object"
    };

    const result = validateDreamStatePayload(payload);

    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(expect.stringContaining("meta"));
  });

  it("should catch non-object payloads", () => {
    const payload = null;

    const result = validateDreamStatePayload(payload);

    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(expect.stringContaining("non-null object"));
  });
});
