/**
 * @codex-purpose: Test Dream-State configuration loader for safe fallback, structural integrity, and emotional UX resilience.
 * @codex-system: Dream-State Global Configuration Loader
 * @codex-critical: Prevents operational fractures and emotional UX drift caused by broken configuration handling.
 * @codex-verified: v1.0.0
 */

import { loadDreamstateConfig } from "../loadDreamstateConfig";
import fs from "fs";
import path from "path";

// Mock filesystem reads
jest.mock("fs");

const mockedFs = fs as jest.Mocked<typeof fs>;

describe("loadDreamstateConfig", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should load valid Dream-State config successfully", () => {
    const validConfig = {
      payload: {
        maxResponseBodyKb: 256,
        maxRequestBodyKb: 128,
        maxMetaFields: 10
      },
      rateLimit: {
        defaultRetryAfterSeconds: 60,
        earlyScalingLimit: 100,
        earlyScalingWindowMs: 60000
      },
      errors: {
        defaultErrorCode: "INTERNAL_SERVER_ERROR",
        defaultErrorMessage: "Something went wrong. Please try again later.",
        invalidInputCode: "INVALID_INPUT",
        invalidInputMessage: "One or more fields are invalid. Please check your input and try again.",
        rateLimitExceededCode: "RATE_LIMIT_EXCEEDED",
        rateLimitExceededMessage: "You're sending requests too quickly. Please slow down and try again."
      },
      emotionalUx: {
        validationTone: "supportive",
        rateLimitTone: "empathetic",
        errorTone: "reassuring"
      }
    };

    mockedFs.readFileSync.mockReturnValueOnce(JSON.stringify(validConfig));

    const config = loadDreamstateConfig();
    expect(config.payload.maxResponseBodyKb).toBe(256);
    expect(config.errors.defaultErrorCode).toBe("INTERNAL_SERVER_ERROR");
  });

  it("should fallback to defaults if config file is missing", () => {
    mockedFs.readFileSync.mockImplementation(() => {
      throw new Error("File not found");
    });

    const config = loadDreamstateConfig();
    expect(config.payload.maxResponseBodyKb).toBe(256);
    expect(config.errors.defaultErrorCode).toBe("INTERNAL_SERVER_ERROR");
  });

  it("should fallback to defaults if config is malformed JSON", () => {
    mockedFs.readFileSync.mockReturnValueOnce("not-json");

    const config = loadDreamstateConfig();
    expect(config.payload.maxResponseBodyKb).toBe(256);
    expect(config.errors.defaultErrorCode).toBe("INTERNAL_SERVER_ERROR");
  });

  it("should fallback if config is missing critical sections", () => {
    const incompleteConfig = {
      payload: {
        maxResponseBodyKb: 256
      }
    };

    mockedFs.readFileSync.mockReturnValueOnce(JSON.stringify(incompleteConfig));

    const config = loadDreamstateConfig();
    expect(config.payload.maxResponseBodyKb).toBe(256); // Still correct
    expect(config.errors.defaultErrorCode).toBe("INTERNAL_SERVER_ERROR"); // Default fallback
  });
});
