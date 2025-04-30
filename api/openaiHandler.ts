// api/openaiHandler.ts
// Handles GPT-4o prompt fulfillment for all CanAI product types

import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'
import { composePrompt } from '../prompts/composePrompt'

/**
 * Required environment variable:
 * - OPENAI_API_KEY
 */

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

/**
 * Routes a structured input through the correct prompt builder and calls GPT-4o.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { promptType, input } = req.body

    if (!promptType || !input) {
      return res.status(400).json({ message: 'Missing promptType or input' })
    }

    const finalPrompt = composePrompt(promptType, input)

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI strategist. Respond in markdown with structure, emotional intelligence, and precision.'
        },
        {
          role: 'user',
          content: finalPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1200
    })

    res.status(200).json({
      result: completion.data.choices[0].message?.content ?? ''
    })
  } catch (error) {
    console.error('[openaiHandler] Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
