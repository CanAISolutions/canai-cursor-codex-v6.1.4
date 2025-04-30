/**
 * @codex-purpose: Dynamic authentication enforcement middleware based on routeMeta.
 * @codex-system: Dream-State Adaptive Auth Engine
 * @codex-critical: Protects sensitive operations, ensures secure emotional journeys with traceable auth failure origins.
 * @codex-verified: v1.1.0
 */

import { Request, Response, NextFunction } from "express";
import { getRouteMeta } from "../utils/route-meta-accessor";

export function authChecker(req: Request, res: Response, next: NextFunction) {
  const meta = getRouteMeta(req.app, req.method, req.path);

  if (meta?.requiresAuth) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        payload: null,
        errors: [
          { code: "UNAUTHORIZED", message: "Authentication required to access this resource." }
        ],
        meta: { errorOrigin: "authChecker" }
      });
    }
  }

  return next();
}
