/**
 * @file errorNormalizer.ts
 * @description Normalizes unknown error objects into structured Codex-compliant fault payloads.
 * 
 * Purpose:
 * - Standardize error formats for safe logging, error dashboards, and user-facing API faults.
 * - Prevent raw unstructured exceptions from propagating unsafely.
 */

interface NormalizedError {
  code: string;
  message: string;
  context?: any;
}

export function normalizeError(rawError: unknown): NormalizedError {
  if (!rawError) {
    return {
      code: "UNKNOWN_ERROR",
      message: "An unknown error occurred.",
    };
  }

  if (rawError instanceof Error) {
    return {
      code: (rawError.name || "INTERNAL_SERVER_ERROR").toUpperCase(),
      message: rawError.message,
      context: {
        stack: rawError.stack,
      },
    };
  }

  if (typeof rawError === "string") {
    return {
      code: "STRING_ERROR",
      message: rawError,
    };
  }

  if (typeof rawError === "object" && "message" in rawError) {
    return {
      code: "OBJECT_ERROR",
      message: (rawError as any).message ?? "Object error without message.",
      context: rawError,
    };
  }

  return {
    code: "UNRECOGNIZED_ERROR",
    message: "An unrecognized error type was caught.",
    context: rawError,
  };
}
