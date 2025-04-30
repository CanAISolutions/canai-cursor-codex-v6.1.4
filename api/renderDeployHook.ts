// api/renderDeployHook.ts
// Triggers a Render deploy via webhook for updated GPT logic

import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

/**
 * Required environment variable:
 * - RENDER_DEPLOY_HOOK_URL
 */

const RENDER_DEPLOY_HOOK_URL = process.env.RENDER_DEPLOY_HOOK_URL!

/**
 * POST endpoint that triggers a Render deploy via webhook.
 * Used after prompt edits, logic upgrades, or GPT prompt evolution.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const response = await axios.post(RENDER_DEPLOY_HOOK_URL)

    res.status(200).json({
      success: true,
      status: response.status,
      message: 'Render deployment triggered.'
    })
  } catch (error) {
    console.error('[renderDeployHook] Error:', error)
    res.status(500).json({ message: 'Failed to trigger Render deploy' })
  }
}
