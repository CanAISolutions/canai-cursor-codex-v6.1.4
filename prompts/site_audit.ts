/**
 * site_audit.ts
 * 
 * Purpose:
 * Simple TypeScript interface for Site Audit prompt type.
 * Provides type safety and validation for prompt inputs.
 */

export interface SiteAuditPrompt {
  siteUrl: string;
  auditType: string;
  focusAreas: string[];
  goals: string[];
  tone: string;
  idea?: string;
  audience?: string;
  problemSolved?: string;
  differentiator?: string;
  customerContent?: string;
  founderBio?: string;
  archetype?: string;
  voice?: string;
  vibe?: string;
  enhancers?: Record<string, boolean>;
}

// 🧠 site_audit.ts
// Generates the final prompt string for the Website Audit & Rewrite product.
// Handles pasted content or auto-scraped sessions. Returns full metadata block.

import { composePrompt } from "../lib/composePrompt"
import { estimateTokens } from "../lib/estimateTokens"
import { scorePromptOutput } from "../lib/smartPromptScore"

type AuditInput = Record<string, any>

export function generateSiteAuditPrompt(input: AuditInput, version: string = "v1") {
  const result = composePrompt("site_audit", input, version)

  const tokenEstimate = estimateTokens(JSON.stringify(input), result.prompt)
  const score = scorePromptOutput(result.prompt)

  return {
    prompt: result.prompt,
    fallbackFields: result.fallbackFields,
    missingFields: result.missingFields,
    promptType: "site_audit",
    version,
    tokensEstimated: tokenEstimate.total,
    costUSD: tokenEstimate.costUSD,
    smartPromptScore: score.score,
    scoreDetails: score.reasons,
  }
}
