/**
 * @codex-purpose: Validates Dream-State system configuration loader integrity, schema adherence, and emotional system boot safety.
 * @codex-system: Tools Config Loader Test Suite
 * @codex-critical: Prevents operational drift or corrupted system boot from invalid or missing configuration schemas.
 * @codex-verified: v1.0.0
 */

import { loadDreamstateConfig } from "../../api-router/tools/loadDreamstateConfig";

describe("Dream-State Config Loader", () => {
  it("should load valid dreamstate-config.json safely", () => {
    const config = loadDreamstateConfig();

    expect(config).toMatchObject({
      payload: expect.objectContaining({
        maxResponseBodyKb: expect.any(Number),
        maxRequestBodyKb: expect.any(Number),
        maxMetaFields: expect.any(Number)
      }),
      rateLimit: expect.objectContaining({
        defaultRetryAfterSeconds: expect.any(Number),
        earlyScalingLimit: expect.any(Number),
        earlyScalingWindowMs: expect.any(Number)
      }),
      errors: expect.objectContaining({
        defaultErrorCode: expect.any(String),
        defaultErrorMessage: expect.any(String),
        invalidInputCode: expect.any(String),
        invalidInputMessage: expect.any(String),
        rateLimitExceededCode: expect.any(String),
        rateLimitExceededMessage: expect.any(String)
      }),
      emotionalUx: expect.objectContaining({
        validationTone: expect.any(String),
        rateLimitTone: expect.any(String),
        errorTone: expect.any(String)
      }),
      $schemaVersion: expect.any(String)
    });
  });

  it("should ensure required top-level fields exist", () => {
    const config = loadDreamstateConfig();

    expect(config).toHaveProperty("payload");
    expect(config).toHaveProperty("rateLimit");
    expect(config).toHaveProperty("errors");
    expect(config).toHaveProperty("emotionalUx");
    expect(config).toHaveProperty("$schemaVersion");
  });
});
