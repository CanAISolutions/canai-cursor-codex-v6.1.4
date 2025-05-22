// api/openaiHandler.ts
// Handles GPT-4o prompt fulfillment for all CanAI product types

import OpenAI from 'openai'
import { composePrompt } from '../prompts/composePrompt'

/**
 * Required environment variable:
 * - OPENAI_API_KEY
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/**
 * Routes a structured input through the correct prompt builder and calls GPT-4o.
 */
export async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { promptType, input } = req.body

    if (!promptType || !input) {
      return res.status(400).json({ message: 'Missing promptType or input' })
    }

    const finalPrompt = composePrompt(promptType, input)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI strategist. Respond in markdown with structure, emotional intelligence, and precision.'
        },
        {
          role: 'user',
          content: finalPrompt.prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1200
    })

    res.status(200).json({
      result: completion.choices[0].message?.content ?? ''
    })
  } catch (error) {
    console.error('[openaiHandler] Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default handler;
