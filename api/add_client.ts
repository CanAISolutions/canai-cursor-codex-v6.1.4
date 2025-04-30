/**
 * @file add_client.ts
 * @description API endpoint for adding new client metadata into Airtable for personalization and lifecycle tracking.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { enforceHttpMethod, safeTrim } from "../utils/requestHelpers";
import { getCurrentTimestamp } from "../utils/common";

// Required environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const CLIENTS_TABLE_ID = process.env.CLIENTS_TABLE_ID!;

/**
 * Adds a new client record to Airtable.
 * 
 * Fields: email (required), industry, persona, source (optional)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    enforceHttpMethod(req, ["POST"]);

    const { email, industry, persona, source } = req.body;

    // --- Basic Input Validation ---
    const safeEmail = safeTrim(email);
    if (!safeEmail) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_FAILED", message: "Missing or invalid email address." },
      });
    }

    // --- Construct Airtable Payload ---
    const payload = {
      records: [
        {
          fields: {
            Email: safeEmail,
            Industry: industry ? safeTrim(industry) : "Unspecified",
            Persona: persona ? safeTrim(persona) : "Unspecified",
            Source: source ? safeTrim(source) : "Direct",
            CreatedAt: getCurrentTimestamp(),
          },
        },
      ],
    };

    // --- Airtable API Request ---
    const airtableResponse = await axios.post(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${CLIENTS_TABLE_ID}`,
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
    console.error("[add_client] Fatal error:", error);

    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred while adding the client." },
    });
  }
}
