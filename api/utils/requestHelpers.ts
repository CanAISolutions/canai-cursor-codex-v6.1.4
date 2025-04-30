/**
 * @file requestHelpers.ts
 * @description Common safe parsing and method enforcement utilities for API requests.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { NextApiRequest } from "next";
import { throwApiError } from "../errors/errorResponses";

/**
 * Ensures the incoming request is the correct HTTP method.
 * 
 * @param req - The incoming Next.js API request.
 * @param allowedMethods - Array of allowed HTTP methods (e.g., ['POST']).
 */
export function enforceHttpMethod(req: NextApiRequest, allowedMethods: string[]): void {
  if (!allowedMethods.includes(req.method || "")) {
    throwApiError("FORBIDDEN");
  }
}

/**
 * Safely parses the JSON body of a request.
 * 
 * @param req - The incoming Next.js API request.
 * @returns - The parsed JSON body.
 */
export async function safeParseJson(req: NextApiRequest): Promise<any> {
  try {
    const body = await new Promise<string>((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        resolve(data);
      });
      req.on("error", (err) => {
        reject(err);
      });
    });

    return JSON.parse(body);
  } catch (error) {
    throwApiError("VALIDATION_FAILED");
  }
}

/**
 * Retrieves a specific header safely.
 * 
 * @param req - The incoming Next.js API request.
 * @param headerKey - The name of the header to retrieve.
 * @returns - The header value or throws if missing.
 */
export function getHeaderOrThrow(req: NextApiRequest, headerKey: string): string {
  const value = req.headers[headerKey.toLowerCase()];
  
  if (!value || typeof value !== "string") {
    throwApiError("VALIDATION_FAILED");
  }

  return value;
}
