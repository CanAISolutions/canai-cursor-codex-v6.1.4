/**
 * @codex-purpose: Validates Dream-State golden success payload generation for emotional UX safety and structural predictability.
 * @codex-system: Utils Payload Normalization Test Suite
 * @codex-critical: Prevents output drift, maintains emotional UX trust at every success pathway.
 * @codex-verified: v1.0.0
 */

import { standardizeSuccess } from "../../api-router/utils/standardizeSuccess";

describe("Dream-State Golden Success Payload", () => {
  it("should generate a basic success payload correctly", () => {
    const data = { message: "Operation successful" };
    const output = standardizeSuccess(data);

    expect(output).toMatchObject({
      success: true,
      payload: data,
      errors: [],
      meta: {}
    });
  });

  it("should allow optional meta data inclusion", () => {
    const data = { message: "Operation successful" };
    const meta = { requestId: "abc123" };
    const output = standardizeSuccess(data, meta);

    expect(output).toMatchObject({
      success: true,
      payload: data,
      errors: [],
      meta: meta
    });
  });

  it("should always have an empty errors array", () => {
    const output = standardizeSuccess({});

    expect(Array.isArray(output.errors)).toBe(true);
    expect(output.errors.length).toBe(0);
  });

  it("should preserve emotional UX safety even on empty payloads", () => {
    const output = standardizeSuccess(undefined);

    expect(output).toMatchObject({
      success: true,
      payload: {},
      errors: [],
      meta: {}
    });
  });
});
