/**
 * @codex-purpose: Enforce schema-based validation on incoming requests before authentication, authorization, or business logic execution.
 * @codex-system: API Router Input Validation Layer
 * @codex-critical: Prevents untrusted external data from entering internal logic; preserves system trust boundary.
 * @codex-verified: v1.0.0
 */

import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export function validateInput(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (validationError: any) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_FAILED",
          message: "Some required fields are missing or invalid."
        }
      });
    }
  };
}
