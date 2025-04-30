/**
 * @codex-purpose: Dynamic input validation enforcement middleware based on routeMeta.
 * @codex-system: Dream-State Adaptive Validation Engine
 * @codex-critical: Ensures emotionally resilient UX and operational safety by enforcing input checks with traceable error origin.
 * @codex-verified: v1.1.0
 */

import { Request, Response, NextFunction } from "express";
import { getRouteMeta } from "../utils/route-meta-accessor";

export function validationChecker(req: Request, res: Response, next: NextFunction) {
  const meta = getRouteMeta(req.app, req.method, req.path);

  if (meta?.requiresValidation) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        payload: null,
        errors: [
          { code: "INVALID_INPUT", message: "Request body is required and cannot be empty." }
        ],
        meta: { errorOrigin: "validationChecker" }
      });
    }
  }

  return next();
}
