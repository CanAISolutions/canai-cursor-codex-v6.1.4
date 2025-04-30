/**
 * @file errorMap.ts
 * @description Centralized error code and message registry for the entire API system.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

export type ErrorCode =
  | "VALIDATION_FAILED"
  | "RESOURCE_NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_SERVER_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "WEBHOOK_VERIFICATION_FAILED"
  | "OPENAI_API_ERROR"
  | "STRIPE_EVENT_INVALID"
  | "PROJECT_ALREADY_EXISTS"
  | "CLIENT_ALREADY_EXISTS"
  | "REVISION_NOT_ALLOWED";

interface ErrorEntry {
  code: ErrorCode;
  message: string;
}

export const errorMap: Record<ErrorCode, ErrorEntry> = {
  // --- Validation Errors ---
  VALIDATION_FAILED: {
    code: "VALIDATION_FAILED",
    message: "The provided data failed validation checks.",
  },

  // --- Resource Errors ---
  RESOURCE_NOT_FOUND: {
    code: "RESOURCE_NOT_FOUND",
    message: "The requested resource was not found.",
  },

  // --- Authentication and Authorization Errors ---
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "Authentication credentials are missing or invalid.",
  },
  FORBIDDEN: {
    code: "FORBIDDEN",
    message: "You do not have permission to perform this action.",
  },

  // --- System/Server Errors ---
  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected server error occurred. Please try again later.",
  },
  SERVICE_UNAVAILABLE: {
    code: "SERVICE_UNAVAILABLE",
    message: "The service is temporarily unavailable. Please try again shortly.",
  },

  // --- Webhook Errors ---
  WEBHOOK_VERIFICATION_FAILED: {
    code: "WEBHOOK_VERIFICATION_FAILED",
    message: "Webhook signature verification failed. Request rejected.",
  },

  // --- External API Errors ---
  OPENAI_API_ERROR: {
    code: "OPENAI_API_ERROR",
    message: "An error occurred while communicating with the OpenAI API.",
  },
  STRIPE_EVENT_INVALID: {
    code: "STRIPE_EVENT_INVALID",
    message: "Received an invalid or unprocessable Stripe event.",
  },

  // --- Business Logic Errors ---
  PROJECT_ALREADY_EXISTS: {
    code: "PROJECT_ALREADY_EXISTS",
    message: "A project with the same identifier already exists.",
  },
  CLIENT_ALREADY_EXISTS: {
    code: "CLIENT_ALREADY_EXISTS",
    message: "A client with the same identifier already exists.",
  },
  REVISION_NOT_ALLOWED: {
    code: "REVISION_NOT_ALLOWED",
    message: "Revisions are not allowed for this resource at this time.",
  },
};
