/**
 * @file prompt_handler.ts
 * @description Safe fallback GPT fulfillment endpoint for manually testing or bypassing Make flows.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { composePrompt } from "../prompts/composePrompt";
import { enforceHttpMethod, safeTrim } from "../utils/requestHelpers";
import { enforceChecklistStatusGuard } from '../cursor/monitoring/enforceChecklistStatusGuard';

// Required environment variable
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
});

const openai = new OpenAIApi(config);

/**
 * Handles POST request to fulfill a structured promptType and input using GPT-4o.
 * 
 * Does not trigger Airtable, email, or Make automations.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    enforceHttpMethod(req, ["POST"]);

    const { promptType, input, sessionId, userId } = req.body;

    // --- Enforcement Guard ---
    const enforcementResult = await enforceChecklistStatusGuard({
      sessionId,
      promptId: promptType,
      userId,
      flow: 'prompt_handler',
      extra: { input }
    });
    if (enforcementResult.status === 'blocked') {
      return res.status(423).json({
        success: false,
        error: {
          code: 'ENFORCEMENT_BREACH',
          message: enforcementResult.fallbackMessage,
          failedItems: enforcementResult.failedItems,
        },
        enforcement: enforcementResult
      });
    }

    // --- Basic Input Validation ---
    const safePromptType = safeTrim(promptType);
    if (!safePromptType || !input) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_FAILED", message: "Missing or invalid promptType or input." },
      });
    }

    // --- Compose Final Prompt ---
    const finalPrompt = composePrompt(safePromptType, input);

    // --- Fulfill with OpenAI ---
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an elite AI strategist. Format all responses in markdown with clear structure, strong tone, and useful framing.",
        },
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    // --- Successful Response ---
    res.status(200).json({
      success: true,
      result: completion.data.choices[0].message?.content ?? "",
      prompt: finalPrompt,
    });
  } catch (error) {
    console.error("[prompt_handler] Fatal error:", error);

    res.status(500).json({
      success: false,
      error: { code: "OPENAI_API_ERROR", message: "An error occurred during prompt fulfillment." },
    });
  }
}
