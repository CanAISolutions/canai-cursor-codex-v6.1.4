/**
 * @codex-purpose: Authentication-related API routes for Dream-State Platform.
 * @codex-system: API Router Auth Layer
 * @codex-critical: Provides modularized, emotionally intelligent entry points for user authentication flows.
 * @codex-verified: v1.0.0
 */

import { Router } from "express";
import { validateInput } from "../middleware/validateInput";
import { standardizeSuccess } from "../utils/standardizeSuccess";
import { z } from "zod";

const authRouter = Router();

// Input validation schemas
const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(3)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

// --- Routes ---

authRouter.post("/login", validateInput(loginSchema), (req, res) => {
  // Simulate login
  const { email } = req.body;
  res.status(200).json(
    standardizeSuccess({
      message: `Welcome back, ${email}!`
    })
  );
});

authRouter.post("/register", validateInput(registerSchema), (req, res) => {
  // Simulate registration
  const { username } = req.body;
  res.status(201).json(
    standardizeSuccess({
      message: `Account created successfully for ${username}.`
    })
  );
});

export default authRouter;
