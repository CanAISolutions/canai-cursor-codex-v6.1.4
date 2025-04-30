// server.ts

/**
 * WHAT: Core Express server initialization and configuration layer.
 * WHY: Orchestrates middleware loading, route binding, health checks, and operational readiness.
 * HOW: Sets up express app instance, applies middleware from manifest, binds routes, and integrates selfcheck validation.
 */

import express from 'express';
import { middlewareManifest } from './feature/middleware/middleware-manifest';
import { postsRouter } from './feature/posts/posts-router';
import { runFullSelfcheck } from './feature/selfcheck/selfcheck';

const app = express();

// --- Middleware Loading ---
middlewareManifest.forEach((entry) => {
  app.use(entry.handler);
});

// --- Route Loading ---
app.use('/api/posts', postsRouter);

// --- Selfcheck Validation on Startup ---
(async () => {
  const selfcheckResult = await runFullSelfcheck(app);
  if (!selfcheckResult.success) {
    console.error('🚨 Post-Deployment Selfcheck FAILED:', selfcheckResult.mismatches);
    process.exit(1); // Fail fast
  } else {
    console.log('✅ Post-Deployment Selfcheck PASSED.');
  }
})();

export { app };
