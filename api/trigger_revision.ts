// api/trigger_revision.ts
// Logs a prompt revision request for session tracking and feedback enrichment

import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

/**
 * Required environment variables:
 * - AIRTABLE_API_KEY
 * - AIRTABLE_BASE_ID
 * - REVISIONS_TABLE_ID
 */

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!
const REVISIONS_TABLE_ID = process.env.REVISIONS_TABLE_ID!

/**
 * Records a user-initiated revision request to Airtable.
 * Can be used to trigger SmartPrompt refinement or analytics enrichment.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { sessionId, promptType, feedback, revisionNotes } = req.body

    if (!sessionId || !promptType) {
      return res.status(400).json({ message: 'Missing sessionId or promptType' })
    }

    const payload = {
      records: [
        {
          fields: {
            SessionID: sessionId,
            PromptType: promptType,
            Feedback: feedback || 'Unspecified',
            RevisionNotes: revisionNotes || 'Unspecified',
            Status: 'Pending'
          }
        }
      ]
    }

    const response = await axios.post(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${REVISIONS_TABLE_ID}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    res.status(200).json({
      success: true,
      revisionId: response.data.records[0].id
    })
  } catch (error) {
    console.error('[trigger_revision] Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
