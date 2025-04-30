/**
 * @codex-purpose: Primary Express application bootstrapper for Dream-State API system.
 * @codex-system: API Router Server Core
 * @codex-critical: Establishes foundational server behaviors, dynamic routeMeta parsing, adaptive golden middlewares, smart error event capture, and emotional perimeter hardening.
 * @codex-verified: v1.4.0
 */

import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { postsRouter, routeMeta as postsRouteMeta } from "./api-router/feature/posts/posts-router";
import apiRouter from "./api-router"; // Core API routes entry (legacy placeholder if still used)
import devToolsRouter from "./api-router/devtools/manifest-dump";

import { validationChecker } from "./api-router/middleware/validation-checker";
import { authChecker } from "./api-router/middleware/auth-checker";
import { rateLimitChecker } from "./api-router/middleware/rate-limit-checker";
import { errorEventCapture } from "./api-router/middleware/error-event-capture"; // 🔥 new correct import
import { errorNormalizer } from "./api-router/middleware/error-normalizer";

const app = express();

// --- Core Middlewares ---
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("tiny")); // Optional: Logging for easier debugging

// --- Initialize Dream-State Route Meta Registry ---
app.locals.routeMetaRegistry = [];

/**
 * Helper to register routers and their routeMeta.
 */
function registerRouter(basePath: string, router: any, meta: Record<string, any>) {
  app.use(basePath, router);
  app.locals.routeMetaRegistry.push(...Object.values(meta));
}

// --- Dynamic Golden Middlewares (Before Feature Routers) ---
app.use(validationChecker);
app.use(authChecker);
app.use(rateLimitChecker);

// --- API Feature Routers Registration ---
registerRouter("/api/posts", postsRouter, postsRouteMeta);

// (Optional: continue registering other routers when built)

// --- Legacy API Router Mount (temporary fallback) ---
app.use("/api", apiRouter);

// --- DevTools (non-production only) ---
if (process.env.NODE_ENV !== "production") {
  app.use("/api/devtools", devToolsRouter);
}

// --- Smart Error Event Capture (Before Normalizer) ---
app.use(errorEventCapture);

// --- Global Error Normalization ---
app.use(errorNormalizer);

// --- 404 Fallback (Golden Output Standard) ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    payload: null,
    errors: [
      {
        code: "NOT_FOUND",
        message: "The requested resource could not be found."
      }
    ],
    meta: {}
  });
});

export default app;
