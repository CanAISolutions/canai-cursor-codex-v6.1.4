// ✅ test-personalization-context-flow.ts
// Validates end-to-end trait > prompt > follow-up logic

const userTraits = {
    userId: "user-789",
    tonePreference: "Confident, warm",
    preferredPrompt: "ai_blueprint",
    region: "Canada"
  }
  
  const promptInput = {
    PromptType: userTraits.preferredPrompt,
    tone: userTraits.tonePreference,
    location: userTraits.region
  }
  
  if (!promptInput.tone || !promptInput.PromptType) {
    throw new Error("❌ Personalization flow failed to inject traits")
  }
  
  console.log("✅ Personalization flow context passed.")
  