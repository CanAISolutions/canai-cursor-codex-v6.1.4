/**
 * @codex-purpose: Provide a dev-only endpoint to expose all active API routes for Dream-State Manifest Selfcheck validation.
 * @codex-system: API Router DevTools & Validation Layer
 * @codex-critical: Prevents route drift, enables manifest auditing, and protects production integrity.
 * @codex-verified: v1.0.0
 */

import { Router } from "express";

const devToolsRouter = Router();

// Only expose manifest-dump in non-production environments
devToolsRouter.get("/manifest-dump", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "This endpoint is not available in production."
      }
    });
  }

  const routes = (req.app._router.stack || [])
    .filter((r: any) => r.route && r.route.path)
    .map((r: any) => r.route.path)
    .filter((path: string) => path.startsWith("/api")); // Only return API routes

  res.status(200).json({
    success: true,
    data: {
      routes
    }
  });
});

export default devToolsRouter;
