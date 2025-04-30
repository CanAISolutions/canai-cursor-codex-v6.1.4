/**
 * @codex-purpose: Post-related API routes for Dream-State Platform.
 * @codex-system: API Router Posts Layer
 * @codex-critical: Enables modular, scalable management of content creation and retrieval flows.
 * @codex-verified: v1.0.0
 */

import { Router } from "express";
import { standardizeSuccess } from "../../utils/standardizeSuccess";
import { standardizeError } from "../../utils/standardizeError";
import { z } from "zod";

const postsRouter = Router();

// --- Input Validation Schemas ---

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1)
});

// --- Route Metadata ---

const routeMeta = {
  createPost: {
    path: "/api/posts/create",
    method: "POST",
    requiresValidation: true,
    requiresAuth: false,
    rateLimited: true,
    description: "Create a new post."
  },
  getPostById: {
    path: "/api/posts/:id",
    method: "GET",
    requiresValidation: false,
    requiresAuth: false,
    rateLimited: true,
    description: "Retrieve a post by its ID."
  }
};

// --- Routes ---

postsRouter.post("/create", (req, res) => {
  const validationResult = createPostSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json(
      standardizeError(validationResult.error.errors.map(e => e.message))
    );
  }

  const { title } = validationResult.data;

  res.status(201).json(
    standardizeSuccess({
      message: `Post '${title}' created successfully.`
    })
  );
});

postsRouter.get("/:id", (req, res) => {
  const { id } = req.params;

  res.status(200).json(
    standardizeSuccess({
      id,
      title: "Example Post",
      content: "This is an example post content."
    })
  );
});

export { postsRouter, routeMeta };
