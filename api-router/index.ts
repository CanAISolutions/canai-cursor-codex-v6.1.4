/**
 * @codex-purpose: Centralized API route aggregator for the Dream-State Router system.
 * @codex-system: API Router Index
 * @codex-critical: Ensures modular growth of the API, prevents route sprawl, and maintains Codex-perimeter discipline.
 * @codex-verified: v1.0.0
 */

import { Router } from "express";

// Import modular routers here
import authRouter from "./auth/auth-router"; // Example auth routes
import postsRouter from "./feature/posts/posts-router"; // Example posts routes
// Add new routers below as needed...

const apiRouter = Router();

// Mount modular routers
apiRouter.use("/auth", authRouter);
apiRouter.use("/posts", postsRouter);
// Add new feature mounts here...

export default apiRouter;
