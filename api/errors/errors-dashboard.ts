/**
 * @codex-purpose: Developer-safe live error telemetry dashboard for Dream-State.
 * @codex-system: Devtools Error Observability Layer
 * @codex-critical: Enables trusted copilots and developers to inspect real-time error patterns without leaking sensitive data.
 * @codex-verified: v1.0.0
 */

import { Router } from "express";
import { errorEventStore } from "./error-event.store";

const errorsDashboardRouter = Router();

// Only enable this dashboard outside of production
errorsDashboardRouter.get("/errors", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({
      success: false,
      payload: null,
      errors: [
        {
          code: "FORBIDDEN",
          message: "Error dashboard is not available in production."
        }
      ],
      meta: {}
    });
  }

  return res.status(200).json({
    success: true,
    payload: {
      capturedErrors: errorEventStore.getRecentErrors()
    },
    errors: [],
    meta: {
      capturedAt: new Date().toISOString()
    }
  });
});

export default errorsDashboardRouter;
