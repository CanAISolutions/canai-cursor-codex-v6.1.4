/**
 * @file add_project.ts
 * @description API endpoint for logging new project requests into Airtable and queuing enrichment flows.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { enforceHttpMethod, safeParseJson, safeTrim } from "../utils/requestHelpers";
import { getCurrentTimestamp } from "../utils/common";

// Required environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const PROJECTS_TABLE_ID = process.env.PROJECTS_TABLE_ID!;

/**
 * Adds a new project session record to Airtable.
 * 
 * Fields: promptType (required), input (required), userId (optional), sessionId (optional)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    enforceHttpMethod(req, ["POST"]);

    const { promptType, input, userId, sessionId } = req.body;

    // --- Basic Input Validation ---
    const safePromptType = safeTrim(promptType);
    if (!safePromptType || !input) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_FAILED", message: "Missing or invalid promptType or input payload." },
      });
    }

    // --- Construct Airtable Payload ---
    const payload = {
      records: [
        {
          fields: {
            PromptType: safePromptType,
            Input: JSON.stringify(input),
            UserID: userId ? safeTrim(userId) : "anonymous",
            SessionID: sessionId ? safeTrim(sessionId) : `sess-${Date.now()}`,
            Status: "Submitted",
            CreatedAt: getCurrentTimestamp(),
          },
        },
      ],
    };

    // --- Airtable API Request ---
    const airtableResponse = await axios.post(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${PROJECTS_TABLE_ID}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // --- Successful Response ---
    res.status(200).json({
      success: true,
      airtableId: airtableResponse.data.records[0].id,
    });
  } catch (error) {
    console.error("[add_project] Fatal error:", error);

    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred while adding the project." },
    });
  }
}
