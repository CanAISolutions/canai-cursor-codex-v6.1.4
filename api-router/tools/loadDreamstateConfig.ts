/**
 * @codex-purpose: Safely load and validate Dream-State emotional UX and operational config constants.
 * @codex-system: Dream-State Global Configuration Loader
 * @codex-critical: Prevents brittle config imports, enables safe, modular, emotionally resilient system parameter consumption.
 * @codex-verified: v1.0.0
 */

import fs from "fs";
import path from "path";

type DreamStateConfig = {
  payload: {
    maxResponseBodyKb: number;
    maxRequestBodyKb: number;
    maxMetaFields: number;
  };
  rateLimit: {
    defaultRetryAfterSeconds: number;
    earlyScalingLimit: number;
    earlyScalingWindowMs: number;
  };
  errors: {
    defaultErrorCode: string;
    defaultErrorMessage: string;
    invalidInputCode: string;
    invalidInputMessage: string;
    rateLimitExceededCode: string;
    rateLimitExceededMessage: string;
  };
  emotionalUx: {
    validationTone: string;
    rateLimitTone: string;
    errorTone: string;
  };
};

// Define default config in case file is missing or corrupt
const defaultConfig: DreamStateConfig = {
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

/**
 * Load and validate the Dream-State config.
 */
export function loadDreamstateConfig(): DreamStateConfig {
  try {
    const configPath = path.resolve(__dirname, ".dreamstate-config.json");
    const raw = fs.readFileSync(configPath, "utf-8");
    const parsed = JSON.parse(raw);

    // Minimal sanity validation
    if (!parsed.payload || !parsed.rateLimit || !parsed.errors || !parsed.emotionalUx) {
      console.warn("[DreamStateConfig] Partial config detected — falling back to safe defaults.");
      return defaultConfig;
    }

    return parsed as DreamStateConfig;
  } catch (error: any) {
    console.warn("[DreamStateConfig] Failed to load config — using default Dream-State safe parameters.");
    return defaultConfig;
  }
}
