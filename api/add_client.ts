/**
 * @file add_client.ts
 * @description API endpoint for logging new client requests into Airtable.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { enforceHttpMethod, safeTrim } from "./utils/requestHelpers";
import { getCurrentTimestamp } from "./utils/common";

// Required environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const CLIENTS_TABLE_ID = process.env.CLIENTS_TABLE_ID!;

/**
 * Adds a new client record to Airtable.
 * 
 * Fields: clientName (required), email (optional), phone (optional)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    enforceHttpMethod(req, ["POST"]);

    const { clientName, email, phone } = req.body;

    // --- Basic Input Validation ---
    const safeClientName = safeTrim(clientName);
    if (!safeClientName) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_FAILED", message: "Missing or invalid clientName." },
      });
    }

    // --- Construct Airtable Payload ---
    const payload = {
      records: [
        {
          fields: {
            ClientName: safeClientName,
            Email: email ? safeTrim(email) : "",
            Phone: phone ? safeTrim(phone) : "",
            Status: "Active",
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
