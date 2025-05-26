// ✅ test-openaiHandler.test.ts
// Mocks fulfillment logic to validate GPT input/output cycle

import { handler } from "../api/openaiHandler"

const mockRequest = {
  body: {
    prompt: "Write a 5-part email campaign for a coaching business.",
    temperature: 0.7
  }
}

handler(mockRequest, {
  status: (code: number) => ({
    json: (data: any) => {
      if (!data.choices || !data.choices[0].text) {
        throw new Error("❌ No GPT output text returned")
      }
      console.log("✅ OpenAI handler returned a response.")
    }
  })
})
